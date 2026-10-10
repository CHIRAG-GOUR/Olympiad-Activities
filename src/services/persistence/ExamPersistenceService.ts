"use client";

import { idbClient } from "./indexeddb";
import type { DeviceInfo, IntegrityLog } from "@/types/session";
import { db, auth } from "@/services/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { logError, logWarn, withTimeout } from "@/lib/logger";

/**
 * Examination session persistence.
 *
 * Durability order, from fastest to most durable:
 *
 *   React state ──▶ IndexedDB (+ localStorage mirror)  — on every change, debounced ~0.5s
 *               ──▶ Firestore `examSessions/{id}`      — at most every 30s while there are
 *                                                         unsaved changes, and immediately
 *                                                         when the tab is hidden or the
 *                                                         connection returns
 *
 * The local copy is what survives a refresh, a crash, a closed tab or lost connectivity;
 * the cloud copy is what lets a candidate continue on another device and what the live
 * monitor reads. Previously every save (a 4-second heartbeat plus every navigation) also
 * wrote Firestore — hundreds of writes per candidate per paper with no gain in safety.
 *
 * Submission is a small state machine stored on the session itself:
 *
 *   in_progress ──▶ submitting (attempt computed and stored locally; upload pending)
 *               ──▶ submitted  (attempt confirmed in Firestore)
 *
 * so a refresh or a dropped connection in the middle of submitting resumes the upload of
 * the same attempt rather than losing it or creating a second one.
 */

function sanitizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) return payload;
  if (typeof payload !== "object") return payload;
  if (Array.isArray(payload)) {
    return payload.map(sanitizePayload) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(payload as Record<string, unknown>)) {
    if (val === undefined || typeof val === "function" || typeof val === "symbol") continue;
    clean[key] = sanitizePayload(val);
  }
  return clean as T;
}

/**
 * Stamps the signed-in account onto a cloud document. `ownerUid` is the one field the
 * security rules can check against the caller's token.
 */
function withOwner<T extends object>(payload: T): T & { ownerUid?: string } {
  const uid = auth?.currentUser?.uid;
  return uid ? { ...payload, ownerUid: uid } : payload;
}

export interface AnswerState {
  questionId: string;
  answer: unknown;
  selectedOption?: string;
  enteredValue?: string;
  activityState?: unknown;
  answeredAt?: string;
  lastModifiedAt?: string;
  isFinal?: boolean;
}

export type SessionStatus =
  | "not_started"
  | "in_progress"
  | "paused"
  | "submitting"
  | "completed"
  | "submitted"
  | "recovered";

export interface ExamSessionState {
  sessionId: string;
  examId: string;
  examTitle: string;
  /** The candidate's account uid. */
  studentId: string;
  studentName: string;
  schoolName?: string;
  grade?: number | string;
  /** Short display code shown as the roll number. */
  rollNumber?: string;
  device?: DeviceInfo;
  startedAt: string; // ISO timestamp — the authoritative start of the timed window
  durationMinutes: number;
  lastSavedAt: string;
  currentQuestionIndex: number;
  currentQuestionId: string;
  answers: Record<string, AnswerState>;
  activityStates: Record<string, unknown>;
  completedQuestions: string[];
  visitedQuestions: string[];
  markedForReview: string[];
  timeSpentMap: Record<string, number>;
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  status: SessionStatus;
  version: number;
  /** Set once submission begins; the attempt id is deterministic for the sitting. */
  attemptId?: string;
  submittedAt?: string;
  submissionType?: "normal" | "auto_timeout" | "force_submit";
  /** Tab switches and full-screen exits during this sitting. */
  integrity?: IntegrityLog;
  /** Question ids in the order this candidate sees them (shuffled per sitting). */
  questionOrder?: string[];
  /** Question IDs where the candidate unlocked hints (max 4 per sitting). */
  hintsUsed?: string[];
}

/** Cloud mirror cadence while a candidate is working. */
const REMOTE_MIN_INTERVAL_MS = 30_000;
/** A cloud lookup must not hold the exam page hostage on a bad connection. */
const REMOTE_READ_TIMEOUT_MS = 6_000;

export type SyncStatus = "idle" | "saving" | "saved" | "offline" | "error";

export interface SyncSnapshot {
  status: SyncStatus;
  /** Last successful local save. */
  localSavedAt: number | null;
  /** Last successful cloud save. */
  remoteSavedAt: number | null;
  /** Local changes not yet in the cloud. */
  remotePending: boolean;
}

class ExamPersistenceServiceClass {
  private remoteTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private lastRemoteAt = new Map<string, number>();
  private latest = new Map<string, ExamSessionState>();
  private sync: SyncSnapshot = { status: "idle", localSavedAt: null, remoteSavedAt: null, remotePending: false };
  private syncListeners = new Set<(s: SyncSnapshot) => void>();

  /* ── Identity ────────────────────────────────────────────── */

  /** One session per candidate per paper. Deterministic, so every device agrees on it. */
  generateSessionId(examId: string, studentId: string, attemptNumber = 1): string {
    return `sess_${examId}_${studentId}_att${attemptNumber}`;
  }

  /** The attempt id for a sitting: stable across retries, unique per sitting. */
  attemptIdFor(session: Pick<ExamSessionState, "examId" | "studentId" | "startedAt">): string {
    const started = new Date(session.startedAt).getTime() || 0;
    return `att_${session.examId}_${session.studentId}_${started}`;
  }

  /* ── Sync status (drives the "Saved / Offline" indicator) ── */

  getSyncSnapshot(): SyncSnapshot {
    return this.sync;
  }

  subscribeSync(listener: (s: SyncSnapshot) => void): () => void {
    this.syncListeners.add(listener);
    return () => {
      this.syncListeners.delete(listener);
    };
  }

  private setSync(patch: Partial<SyncSnapshot>) {
    this.sync = { ...this.sync, ...patch };
    this.syncListeners.forEach((l) => {
      try {
        l(this.sync);
      } catch {
        // a listener must not break persistence
      }
    });
  }

  /* ── Lifecycle ───────────────────────────────────────────── */

  async createSession(params: {
    examId: string;
    examTitle: string;
    studentId: string;
    studentName: string;
    rollNumber?: string;
    schoolName?: string;
    grade?: number | string;
    durationMinutes: number;
    firstQuestionId: string;
    device?: DeviceInfo;
    /** Which sitting of this paper this is (1 for the first). Each sitting has its own id. */
    attemptNumber?: number;
  }): Promise<ExamSessionState> {
    const now = new Date().toISOString();
    const durationSec = params.durationMinutes * 60;
    const session: ExamSessionState = {
      sessionId: this.generateSessionId(params.examId, params.studentId, params.attemptNumber || 1),
      examId: params.examId,
      examTitle: params.examTitle,
      studentId: params.studentId,
      studentName: params.studentName,
      rollNumber: params.rollNumber,
      schoolName: params.schoolName || "",
      grade: params.grade || 6,
      device: params.device,
      startedAt: now,
      durationMinutes: params.durationMinutes,
      lastSavedAt: now,
      currentQuestionIndex: 0,
      currentQuestionId: params.firstQuestionId,
      answers: {},
      activityStates: {},
      completedQuestions: [],
      visitedQuestions: params.firstQuestionId ? [params.firstQuestionId] : [],
      markedForReview: [],
      timeSpentMap: {},
      timeRemainingSeconds: durationSec,
      totalTimeSeconds: durationSec,
      status: "in_progress",
      hintsUsed: [],
      version: 1,
    };
    await this.saveLocal(session);
    // The start is mirrored at once: it fixes the authoritative start time in the cloud,
    // so a second device continues the same clock rather than starting a fresh one.
    void this.mirrorRemote(session, { immediate: true });
    return session;
  }

  /** Writes the session to this device. Never touches the network. */
  async saveLocal(state: ExamSessionState): Promise<ExamSessionState> {
    const updated = sanitizePayload({
      ...state,
      lastSavedAt: new Date().toISOString(),
      version: (state.version || 0) + 1,
    });
    this.latest.set(updated.sessionId, updated);
    try {
      await idbClient.put("sessions", updated);
      this.setSync({ localSavedAt: Date.now(), remotePending: true });
    } catch (e) {
      logError("ANSWER_SAVE_FAILED", { sessionId: updated.sessionId, examId: updated.examId, operation: "saveLocal" }, e);
      this.setSync({ status: "error" });
    }
    return updated;
  }

  /**
   * Saves locally now and schedules the cloud mirror. Kept under its original name for
   * the existing call sites.
   */
  async saveProgress(state: ExamSessionState, opts: { remoteNow?: boolean } = {}): Promise<void> {
    if (!state?.sessionId) return;
    const saved = await this.saveLocal(state);
    void this.mirrorRemote(saved, { immediate: opts.remoteNow });
  }

  /**
   * Throttled cloud mirror. Only the newest state is sent; intermediate states are
   * coalesced. A failure is recorded (and shown as "Offline"/"Not synced") and retried on
   * the next save or when connectivity returns — never thrown at the exam page.
   */
  mirrorRemote(state: ExamSessionState, opts: { immediate?: boolean } = {}): Promise<void> {
    if (!db || !state?.sessionId) return Promise.resolve();
    this.latest.set(state.sessionId, state);
    const id = state.sessionId;
    const since = Date.now() - (this.lastRemoteAt.get(id) ?? 0);

    if (!opts.immediate && since < REMOTE_MIN_INTERVAL_MS) {
      if (!this.remoteTimers.has(id)) {
        this.remoteTimers.set(
          id,
          setTimeout(() => {
            this.remoteTimers.delete(id);
            const newest = this.latest.get(id);
            if (newest) void this.writeRemote(newest);
          }, REMOTE_MIN_INTERVAL_MS - since)
        );
      }
      return Promise.resolve();
    }
    const pending = this.remoteTimers.get(id);
    if (pending) {
      clearTimeout(pending);
      this.remoteTimers.delete(id);
    }
    return this.writeRemote(state);
  }

  private async writeRemote(state: ExamSessionState): Promise<void> {
    if (!db) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      this.setSync({ status: "offline", remotePending: true });
      return;
    }
    this.lastRemoteAt.set(state.sessionId, Date.now());
    this.setSync({ status: "saving" });
    try {
      await withTimeout(
        setDoc(doc(db, "examSessions", state.sessionId), withOwner(sanitizePayload(state)), { merge: true }),
        15_000,
        "session mirror"
      );
      this.setSync({ status: "saved", remoteSavedAt: Date.now(), remotePending: false });
    } catch (e) {
      const offline = typeof navigator !== "undefined" && navigator.onLine === false;
      this.setSync({ status: offline ? "offline" : "error", remotePending: true });
      logWarn("SESSION_SYNC_FAILED", { sessionId: state.sessionId, examId: state.examId }, e);
    }
  }

  /** Pushes the newest known state now (tab hidden, connection back, leaving the page). */
  async flushRemote(sessionId: string): Promise<void> {
    const newest = this.latest.get(sessionId);
    if (newest) await this.mirrorRemote(newest, { immediate: true });
  }

  /* ── Lookup ──────────────────────────────────────────────── */

  async loadLocal(sessionId: string): Promise<ExamSessionState | null> {
    const cachedState = this.latest.get(sessionId);
    if (cachedState) return cachedState;
    const record = await idbClient.get<ExamSessionState>("sessions", sessionId);
    if (record) this.latest.set(sessionId, record);
    return record;
  }

  /**
   * The candidate's session for this paper, wherever it lives, in any state — including
   * expired and already-submitted ones, because the caller must act on those (auto-submit
   * the expired paper; show the result of a submitted one) rather than offer a restart.
   *
   * This device's copy is preferred; the cloud copy is consulted when this device has none
   * (cleared browser, different computer) or when the cloud copy is newer.
   */
  async findSession(examId: string, studentId: string, attemptNumber = 1): Promise<ExamSessionState | null> {
    if (!examId || !studentId) return null;
    const sessionId = this.generateSessionId(examId, studentId, attemptNumber);
    let local = await this.loadLocal(sessionId).catch(() => null);

    // Sessions written before ids were tied to the account carry a random roll code;
    // adopt one for this paper only if it was made by this same account. Those predate
    // retakes, so they can only ever be a first sitting.
    if (!local && attemptNumber === 1) {
      try {
        const all = await idbClient.getAll<ExamSessionState & { ownerUid?: string }>("sessions");
        local =
          all
            .filter(
              (s) =>
                s.examId === examId &&
                (s.studentId === studentId || s.ownerUid === studentId) &&
                !/_att\d+$/.test(s.sessionId || "")
            )
            .sort((a, b) => new Date(b.lastSavedAt || 0).getTime() - new Date(a.lastSavedAt || 0).getTime())[0] ?? null;
      } catch {
        // fall through to the cloud
      }
    }

    let remote: ExamSessionState | null = null;
    if (db) {
      try {
        const snap = await withTimeout(getDoc(doc(db, "examSessions", sessionId)), REMOTE_READ_TIMEOUT_MS, "session lookup");
        remote = snap.exists() ? (snap.data() as ExamSessionState) : null;
      } catch (e) {
        // Offline or slow: the local copy (if any) is authoritative for now.
        logWarn("ATTEMPT_RESUME_FAILED", { examId, sessionId, operation: "remoteLookup" }, e);
      }
    }

    const rank = (s: ExamSessionState | null) => {
      if (!s) return -1;
      // A session further along the submission state machine always wins.
      const stage = s.status === "submitted" || s.status === "completed" ? 2 : s.status === "submitting" ? 1 : 0;
      return stage * 1e15 + (new Date(s.lastSavedAt || 0).getTime() || 0);
    };
    const chosen = rank(remote) > rank(local) ? remote : local;
    if (chosen && chosen !== local) {
      await idbClient.put("sessions", chosen).catch(() => {});
      this.latest.set(chosen.sessionId, chosen);
    }
    return chosen;
  }

  /* ── Time ────────────────────────────────────────────────── */

  /**
   * Remaining time from the session's start timestamp — never from a running counter — so
   * it is right after a refresh, a sleeping laptop, a throttled background tab or a crash.
   */
  calculateTrueRemainingTime(session: Pick<ExamSessionState, "startedAt" | "durationMinutes"> | null): number {
    const total = ((session && session.durationMinutes) || 60) * 60;
    if (!session || !session.startedAt) return total;
    const start = new Date(session.startedAt).getTime();
    if (!Number.isFinite(start) || start <= 0) return total;
    const elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
    return Math.max(0, total - elapsed);
  }

  /* ── Submission ──────────────────────────────────────────── */

  /** Records that submission has begun for this attempt. Idempotent. */
  async markSubmitting(
    state: ExamSessionState,
    attemptId: string,
    submissionType: ExamSessionState["submissionType"]
  ): Promise<ExamSessionState> {
    const next: ExamSessionState = {
      ...state,
      status: state.status === "submitted" ? "submitted" : "submitting",
      attemptId,
      submittedAt: state.submittedAt || new Date().toISOString(),
      submissionType: state.submissionType || submissionType,
    };
    return this.saveLocal(next);
  }

  /** Records that the attempt is safely in Firestore. Closes the session everywhere. */
  async markSubmitted(sessionId: string): Promise<void> {
    const session = await this.loadLocal(sessionId);
    if (!session) return;
    const closed = await this.saveLocal({ ...session, status: "submitted" });
    const pending = this.remoteTimers.get(sessionId);
    if (pending) {
      clearTimeout(pending);
      this.remoteTimers.delete(sessionId);
    }
    await this.writeRemote(closed);
  }

  /** Sessions on this device whose attempt has not yet reached the server. */
  async pendingSubmissions(): Promise<ExamSessionState[]> {
    try {
      const all = await idbClient.getAll<ExamSessionState>("sessions");
      return all.filter((s) => s.status === "submitting" && Boolean(s.attemptId));
    } catch {
      return [];
    }
  }

  /**
   * Discards a session. Staff use this to re-run a paper they are previewing; candidates
   * cannot restart a sitting (that would reset the timer).
   */
  async clearSession(sessionId: string): Promise<void> {
    const pending = this.remoteTimers.get(sessionId);
    if (pending) {
      clearTimeout(pending);
      this.remoteTimers.delete(sessionId);
    }
    this.latest.delete(sessionId);
    await idbClient.delete("sessions", sessionId);
    if (db) {
      try {
        const { deleteDoc } = await import("firebase/firestore");
        await deleteDoc(doc(db, "examSessions", sessionId));
      } catch (e) {
        logWarn("SESSION_SYNC_FAILED", { sessionId, operation: "clearSession" }, e);
      }
    }
  }
}

export const ExamPersistenceService = new ExamPersistenceServiceClass();

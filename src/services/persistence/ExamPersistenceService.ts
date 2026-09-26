"use client";

import { idbClient } from "./indexeddb";
import type { DeviceInfo } from "@/types/session";
import { db, auth } from "@/services/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

function sanitizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) return payload;
  if (typeof payload !== "object") return payload;
  if (Array.isArray(payload)) {
    return payload.map(sanitizePayload) as unknown as T;
  }
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(payload as Record<string, any>)) {
    if (val === undefined || typeof val === "function" || typeof val === "symbol") {
      continue;
    }
    clean[key] = sanitizePayload(val);
  }
  return clean as T;
}

/**
 * Stamps the signed-in account onto a cloud document.
 *
 * Candidates are identified inside the paper by their roll code (STU-…), which Firestore
 * cannot verify. `ownerUid` is the one field the security rules can check against the
 * caller's token, so it is what ties a session or an attempt to whoever actually wrote it.
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

export interface ExamSessionState {
  sessionId: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  schoolName?: string;
  grade?: number | string;
  /** Captured once at session start, so the live-monitor can show the candidate's
   * actual browser/OS/device instead of a placeholder while the exam is in progress. */
  device?: DeviceInfo;
  startedAt: string; // ISO timestamp
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
  status:
    | "not_started"
    | "in_progress"
    | "paused"
    | "completed"
    | "submitted"
    | "recovered";
  version: number;
}

class ExamPersistenceServiceClass {
  private activeDebounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private inMemoryCache: Map<string, ExamSessionState> = new Map();

  /**
   * Generates a deterministic, unique session identifier
   */
  generateSessionId(examId: string, studentId: string, attemptNumber: number = 1): string {
    return `sess_${examId}_${studentId}_att${attemptNumber}`;
  }

  /**
   * Creates and initializes a new examination session
   */
  async createSession(params: {
    examId: string;
    examTitle: string;
    studentId: string;
    studentName: string;
    schoolName?: string;
    grade?: number | string;
    durationMinutes: number;
    firstQuestionId: string;
    attemptNumber?: number;
  }): Promise<ExamSessionState> {
    const sessionId = this.generateSessionId(
      params.examId,
      params.studentId,
      params.attemptNumber || 1
    );

    const now = new Date().toISOString();
    const durationSec = params.durationMinutes * 60;

    const sessionState: ExamSessionState = {
      sessionId,
      examId: params.examId,
      examTitle: params.examTitle,
      studentId: params.studentId,
      studentName: params.studentName,
      schoolName: params.schoolName || "",
      grade: params.grade || 6,
      startedAt: now,
      durationMinutes: params.durationMinutes,
      lastSavedAt: now,
      currentQuestionIndex: 0,
      currentQuestionId: params.firstQuestionId,
      answers: {},
      activityStates: {},
      completedQuestions: [],
      visitedQuestions: [params.firstQuestionId],
      markedForReview: [],
      timeSpentMap: {},
      timeRemainingSeconds: durationSec,
      totalTimeSeconds: durationSec,
      status: "in_progress",
      version: 1,
    };

    this.inMemoryCache.set(sessionId, sessionState);
    await idbClient.put("sessions", sessionState);

    // Save active session pointer in local storage for instant reboot detection
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "active_exam_session",
          JSON.stringify({
            sessionId,
            examId: params.examId,
            studentId: params.studentId,
            lastSavedAt: now,
          })
        );
      } catch {
        // quota ignore
      }
    }

    // Async cloud mirror if Firestore is configured
    if (db) {
      setDoc(doc(db, "examSessions", sessionId), withOwner(sessionState), { merge: true }).catch(() => {});
    }

    return sessionState;
  }

  /**
   * Immediately saves the progress to IndexedDB with version bump
   */
  async saveProgress(state: ExamSessionState): Promise<void> {
    if (!state || !state.sessionId) return;

    const updated: ExamSessionState = {
      ...state,
      lastSavedAt: new Date().toISOString(),
      version: (state.version || 0) + 1,
    };

    const cleanUpdated = sanitizePayload(updated);

    this.inMemoryCache.set(cleanUpdated.sessionId, cleanUpdated);
    await idbClient.put("sessions", cleanUpdated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "active_exam_session",
          JSON.stringify({
            sessionId: cleanUpdated.sessionId,
            examId: cleanUpdated.examId,
            studentId: cleanUpdated.studentId,
            lastSavedAt: cleanUpdated.lastSavedAt,
            currentQuestionIndex: cleanUpdated.currentQuestionIndex,
          })
        );
      } catch {
        // ignore
      }
    }

    // Async cloud mirror if Firestore is configured
    if (db) {
      try {
        setDoc(doc(db, "examSessions", cleanUpdated.sessionId), withOwner(cleanUpdated), { merge: true }).catch(() => {});
      } catch {
        // ignore
      }
    }
  }

  /**
   * Debounced autosave (saves at most every 2000ms per session)
   */
  debouncedSave(state: ExamSessionState, delayMs: number = 2000): void {
    this.inMemoryCache.set(state.sessionId, state);

    if (this.activeDebounceTimers.has(state.sessionId)) {
      clearTimeout(this.activeDebounceTimers.get(state.sessionId));
    }

    const timer = setTimeout(() => {
      this.saveProgress(state).catch((err) => {
        console.warn("[ExamPersistence] Debounced save error:", err);
      });
      this.activeDebounceTimers.delete(state.sessionId);
    }, delayMs);

    this.activeDebounceTimers.set(state.sessionId, timer);
  }

  /**
   * Flushes any pending debounced save immediately (e.g. before page exit or question switch)
   */
  async flush(sessionId: string): Promise<void> {
    if (this.activeDebounceTimers.has(sessionId)) {
      clearTimeout(this.activeDebounceTimers.get(sessionId));
      this.activeDebounceTimers.delete(sessionId);
    }
    const cached = this.inMemoryCache.get(sessionId);
    if (cached) {
      await this.saveProgress(cached);
    }
  }

  /**
   * Loads the session state by sessionId
   */
  async loadProgress(sessionId: string): Promise<ExamSessionState | null> {
    if (this.inMemoryCache.has(sessionId)) {
      return this.inMemoryCache.get(sessionId)!;
    }
    const record = await idbClient.get<ExamSessionState>("sessions", sessionId);
    if (record) {
      this.inMemoryCache.set(sessionId, record);
    }
    return record;
  }

  /**
   * Checks for an existing incomplete/active session for crash recovery
   */
  async getIncompleteSession(examId: string, studentId?: string): Promise<ExamSessionState | null> {
    // 1. Check local storage hint
    if (typeof window !== "undefined") {
      try {
        const hintRaw = localStorage.getItem("active_exam_session");
        if (hintRaw) {
          const hint = JSON.parse(hintRaw);
          if (hint.sessionId && hint.examId === examId) {
            if (!studentId || hint.studentId === studentId) {
              const session = await this.loadProgress(hint.sessionId);
              if (session && session.status === "in_progress") {
                return session;
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Scan IndexedDB sessions
    const all = await idbClient.getAll<ExamSessionState>("sessions");
    const activeMatches = all.filter(
      (s) =>
        s.examId === examId &&
        s.status === "in_progress" &&
        (!studentId || s.studentId === studentId)
    );

    if (activeMatches.length > 0) {
      // Return the most recently saved session
      activeMatches.sort(
        (a, b) => new Date(b.lastSavedAt).getTime() - new Date(a.lastSavedAt).getTime()
      );
      return activeMatches[0];
    }

    return null;
  }

  /**
   * Updates answer and optional activity microworld state for a question
   */
  async updateAnswer(
    sessionId: string,
    questionId: string,
    answer: unknown,
    activityState?: unknown,
    selectedOption?: string
  ): Promise<void> {
    const session = await this.loadProgress(sessionId);
    if (!session || session.status === "submitted" || session.status === "completed") return;

    const now = new Date().toISOString();
    const existing = session.answers[questionId];

    session.answers[questionId] = {
      questionId,
      answer,
      selectedOption: selectedOption || (typeof answer === "string" ? answer : undefined),
      activityState: activityState ?? existing?.activityState,
      answeredAt: existing?.answeredAt || now,
      lastModifiedAt: now,
      isFinal: false,
    };

    if (activityState !== undefined) {
      session.activityStates[questionId] = activityState;
    }

    if (!session.completedQuestions.includes(questionId)) {
      session.completedQuestions.push(questionId);
    }

    this.debouncedSave(session);
  }

  /**
   * Updates internal activity state (e.g. 3D rotations, slider progress, drag layout)
   */
  async updateActivityState(
    sessionId: string,
    questionId: string,
    activityState: unknown
  ): Promise<void> {
    const session = await this.loadProgress(sessionId);
    if (!session || session.status === "submitted" || session.status === "completed") return;

    session.activityStates[questionId] = activityState;
    if (session.answers[questionId]) {
      session.answers[questionId].activityState = activityState;
      session.answers[questionId].lastModifiedAt = new Date().toISOString();
    }

    this.debouncedSave(session, 3000);
  }

  /**
   * Calculates true remaining time based on server/start timestamp, immune to throttling
   */
  calculateTrueRemainingTime(session: ExamSessionState): number {
    if (!session || !session.startedAt) {
      return ((session && session.durationMinutes) || 60) * 60;
    }
    const startTime = new Date(session.startedAt).getTime();
    if (isNaN(startTime) || startTime <= 0) {
      return (session.durationMinutes || 60) * 60;
    }
    const now = Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
    const totalSeconds = (session.durationMinutes || 60) * 60;
    const remaining = totalSeconds - elapsedSeconds;
    return Math.max(0, remaining);
  }

  /**
   * Marks examination as submitted (idempotent, prevents duplicate submits)
   */
  async completeExam(sessionId: string): Promise<ExamSessionState | null> {
    await this.flush(sessionId);
    const session = await this.loadProgress(sessionId);
    if (!session) return null;

    session.status = "submitted";
    session.lastSavedAt = new Date().toISOString();
    await idbClient.put("sessions", session);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("active_exam_session");
      } catch {
        // ignore
      }
    }

    if (db) {
      setDoc(doc(db, "examSessions", sessionId), withOwner(session), { merge: true }).catch(() => {});
    }

    return session;
  }

  /**
   * Clears a session from storage if candidate chooses to restart
   */
  async clearSession(sessionId: string): Promise<void> {
    if (this.activeDebounceTimers.has(sessionId)) {
      clearTimeout(this.activeDebounceTimers.get(sessionId));
      this.activeDebounceTimers.delete(sessionId);
    }
    this.inMemoryCache.delete(sessionId);
    await idbClient.delete("sessions", sessionId);

    if (typeof window !== "undefined") {
      try {
        const hintRaw = localStorage.getItem("active_exam_session");
        if (hintRaw) {
          const hint = JSON.parse(hintRaw);
          if (hint.sessionId === sessionId) {
            localStorage.removeItem("active_exam_session");
          }
        }
      } catch {
        // ignore
      }
    }

    if (db) {
      try {
        const { deleteDoc } = await import("firebase/firestore");
        deleteDoc(doc(db, "examSessions", sessionId)).catch(() => {});
      } catch {
        // ignore
      }
    }
  }
}

export const ExamPersistenceService = new ExamPersistenceServiceClass();

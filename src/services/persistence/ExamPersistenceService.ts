"use client";

import { idbClient } from "./indexeddb";
import type { DeviceInfo } from "@/types/session";

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

    return sessionState;
  }

  /**
   * Immediately saves the progress to IndexedDB with version bump
   */
  async saveProgress(state: ExamSessionState): Promise<void> {
    const updated: ExamSessionState = {
      ...state,
      lastSavedAt: new Date().toISOString(),
      version: (state.version || 0) + 1,
    };

    this.inMemoryCache.set(updated.sessionId, updated);
    await idbClient.put("sessions", updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "active_exam_session",
          JSON.stringify({
            sessionId: updated.sessionId,
            examId: updated.examId,
            studentId: updated.studentId,
            lastSavedAt: updated.lastSavedAt,
            currentQuestionIndex: updated.currentQuestionIndex,
          })
        );
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
    const startTime = new Date(session.startedAt).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const totalSeconds = session.durationMinutes * 60;
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
  }
}

export const ExamPersistenceService = new ExamPersistenceServiceClass();

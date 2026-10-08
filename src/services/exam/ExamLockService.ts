"use client";

import { db, auth, isRealFirebaseConfigured } from "@/services/firebase/config";
import { doc, setDoc, onSnapshot, collection, type Unsubscribe } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { logError, logWarn } from "@/lib/logger";

const STORAGE_LOCKS_KEY = "olympiad_exam_locks_v3";
const STORAGE_CLASSES_KEY = "olympiad_exam_classes_v3";
const STORAGE_STUDENTS_KEY = "olympiad_exam_students_v3";
const STORAGE_ASSIGNMENTS_KEY = "olympiad_exam_assignments_v1";
const STORAGE_ATTEMPTS_KEY = "olympiad_exam_max_attempts_v1";

/**
 * Default unlocked exams:
 * The primary mathematics examination featuring the 3D rotating dice manipulative (Q1 DiceLabActivity):
 * - "exam_imo_2022_g6_setb" / "exam_imo_class6_setb_2022" (IMO 2022-23 Class 6 Set B)
 */
const DEFAULT_UNLOCKED_EXAMS = new Set([
  "exam_imo_2022_g6_setb",
  "exam_imo_class6_setb_2022",
  "IMO-2022-23-G6-SETB",
]);

/** Highest finite attempt limit a teacher can choose; above this the paper is unlimited. */
export const MAX_ATTEMPT_CHOICES = 10;

/** A student a paper has been assigned to, recorded with the class they were assigned in. */
export interface AssignedStudent {
  id: string;
  email?: string;
  name?: string;
  grade: number;
}

/** Who is asking for a paper. Any one identifier matching an assignment is enough. */
export interface StudentIdentity {
  id?: string;
  email?: string;
  name?: string;
  grade?: number | string;
}

export interface ExamAccessConfig {
  examId: string;
  isLocked: boolean;
  visibleClasses: number[];
  assignedStudentIds?: string[];
  assignedStudents?: AssignedStudent[];
  /** Sittings allowed per student; absent or null means unlimited. */
  maxAttempts?: number | null;
  updatedAt?: string;
}

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();

/** 1–10, or null for unlimited. Anything else is treated as unlimited. */
export function normalizeMaxAttempts(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.min(MAX_ATTEMPT_CHOICES, Math.floor(n));
}

class ExamLockServiceClass {
  private listeners: Set<() => void> = new Set();
  private lockState: Record<string, boolean> = {};
  private classState: Record<string, number[]> = {};
  private studentState: Record<string, string[]> = {};
  private assignmentState: Record<string, AssignedStudent[]> = {};
  private attemptState: Record<string, number | null> = {};
  private initialized = false;
  private snapshotUnsub: Unsubscribe | null = null;
  private readyResolve: (() => void) | null = null;
  /** Settles once the server's lock state has been received (or could not be). */
  private readyPromise: Promise<void> = new Promise((r) => (this.readyResolve = r));
  private ready = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private markReady() {
    if (this.ready) return;
    this.ready = true;
    this.readyResolve?.();
  }

  private init() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const rawLocks = localStorage.getItem(STORAGE_LOCKS_KEY);
      if (rawLocks) this.lockState = JSON.parse(rawLocks);

      const rawClasses = localStorage.getItem(STORAGE_CLASSES_KEY);
      if (rawClasses) this.classState = JSON.parse(rawClasses);

      const rawStudents = localStorage.getItem(STORAGE_STUDENTS_KEY);
      if (rawStudents) this.studentState = JSON.parse(rawStudents);

      const rawAssignments = localStorage.getItem(STORAGE_ASSIGNMENTS_KEY);
      if (rawAssignments) this.assignmentState = JSON.parse(rawAssignments);

      const rawAttempts = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
      if (rawAttempts) this.attemptState = JSON.parse(rawAttempts);
    } catch {}

    if (!isRealFirebaseConfigured || !db || !auth) {
      this.markReady();
      return;
    }

    // The lock collection is only readable when signed in. Listening before sign-in was
    // refused by the rules and never retried, so lock changes made by a teacher did not
    // reach candidates until a full reload. The listener now follows the auth state: one
    // live listener per signed-in session, torn down on sign-out.
    onAuthStateChanged(auth, (user) => {
      this.snapshotUnsub?.();
      this.snapshotUnsub = null;
      if (!user || !db) {
        this.markReady();
        return;
      }
      this.snapshotUnsub = onSnapshot(
        collection(db, "exam_locks"),
        (snapshot) => {
          snapshot.forEach((d) => {
            const data = d.data();
            if (typeof data?.isLocked === "boolean") {
              this.lockState[d.id] = data.isLocked;
            }
            if (Array.isArray(data?.visibleClasses)) {
              this.classState[d.id] = data.visibleClasses.map(Number).filter(Boolean);
            }
            if (Array.isArray(data?.assignedStudentIds)) {
              this.studentState[d.id] = data.assignedStudentIds.map(String).filter(Boolean);
            }
            if (Array.isArray(data?.assignedStudents)) {
              this.assignmentState[d.id] = (data.assignedStudents as AssignedStudent[])
                .filter((s) => s && s.id)
                .map((s) => ({ ...s, grade: Number(s.grade) || 6 }));
            } else {
              delete this.assignmentState[d.id];
            }
            this.attemptState[d.id] = normalizeMaxAttempts(data?.maxAttempts);
          });
          this.saveLocal();
          this.markReady();
          this.notify();
        },
        (err) => {
          logWarn("FIRESTORE_QUERY_FAILED", { operation: "exam_locks.listen" }, err);
          this.markReady();
        }
      );
    });
  }

  /**
   * Resolves when the server's lock state is known, or after `timeoutMs` with whatever this
   * device last saw — a candidate is never stuck behind a slow connection.
   */
  whenReady(timeoutMs = 4000): Promise<void> {
    if (this.ready) return Promise.resolve();
    return Promise.race([this.readyPromise, new Promise<void>((r) => setTimeout(r, timeoutMs))]);
  }

  isReady(): boolean {
    return this.ready;
  }

  private saveLocal() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_LOCKS_KEY, JSON.stringify(this.lockState));
      localStorage.setItem(STORAGE_CLASSES_KEY, JSON.stringify(this.classState));
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(this.studentState));
      localStorage.setItem(STORAGE_ASSIGNMENTS_KEY, JSON.stringify(this.assignmentState));
      localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(this.attemptState));
    } catch {}
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        logWarn("UNHANDLED_UI_ERROR", { operation: "exam_locks.notify" }, e);
      }
    });
  }

  /**
   * Determine if an exam is currently locked.
   * Default: Paper 01 is unlocked; all other papers are locked by default until a teacher/admin toggles them.
   */
  isExamLocked(examId: string): boolean {
    if (!examId) return true;

    // 1. Explicit override in lockState
    if (examId in this.lockState) {
      return this.lockState[examId];
    }

    // 2. Default: unlocked for primary dice paper, locked otherwise
    if (DEFAULT_UNLOCKED_EXAMS.has(examId)) {
      return false;
    }

    return true;
  }

  /**
   * Get the assigned classes/grades where this paper is visible (e.g. [6], [7], [8], [6, 7, 8]).
   */
  getVisibleClasses(examId: string, defaultGrade: number = 6): number[] {
    if (!examId) return [defaultGrade || 6];

    if (this.classState[examId] && Array.isArray(this.classState[examId]) && this.classState[examId].length > 0) {
      return this.classState[examId];
    }

    return [defaultGrade || 6];
  }

  /**
   * Check if an exam is visible to a specific class/grade (e.g. Class 6, 7, or 8).
   */
  isExamVisibleToClass(examId: string, classNum: number | string, defaultGrade: number = 6): boolean {
    const num = Number(classNum) || 6;
    const classes = this.getVisibleClasses(examId, defaultGrade);
    return classes.includes(num);
  }

  /** The full lock document for a paper, built from what this device knows. */
  private configFor(examId: string): Omit<ExamAccessConfig, "updatedAt"> {
    return {
      examId,
      isLocked: this.isExamLocked(examId),
      visibleClasses: this.getVisibleClasses(examId),
      assignedStudentIds: this.getAssignedStudents(examId),
      assignedStudents: this.getAssignedStudentRecords(examId),
      maxAttempts: this.getMaxAttempts(examId),
    };
  }

  /**
   * Writes the paper's lock document. On failure every local change made by `apply` is
   * rolled back: candidates read the server's state, so a change that did not reach it
   * must not be shown to staff as if it had.
   */
  private async persist(
    examId: string,
    apply: () => void,
    operation: string,
    fields: (keyof Omit<ExamAccessConfig, "examId" | "updatedAt">)[]
  ): Promise<void> {
    const snapshot = {
      lock: this.lockState[examId],
      hadLock: examId in this.lockState,
      classes: this.classState[examId],
      students: this.studentState[examId],
      assignments: this.assignmentState[examId],
      hadAttempts: examId in this.attemptState,
      attempts: this.attemptState[examId],
    };
    apply();
    this.saveLocal();
    this.notify();

    if (!isRealFirebaseConfigured || !db) return;
    try {
      // Only the fields this change touched: a device whose view is a moment behind must
      // not overwrite another teacher's assignments while toggling a lock.
      const config = this.configFor(examId);
      const payload: Record<string, unknown> = { examId, updatedAt: new Date().toISOString() };
      for (const f of fields) payload[f] = config[f] ?? null;
      await setDoc(doc(db, "exam_locks", examId), payload, { merge: true });
    } catch (err) {
      if (snapshot.hadLock) this.lockState[examId] = snapshot.lock;
      else delete this.lockState[examId];
      if (snapshot.classes) this.classState[examId] = snapshot.classes;
      else delete this.classState[examId];
      if (snapshot.students) this.studentState[examId] = snapshot.students;
      else delete this.studentState[examId];
      if (snapshot.assignments) this.assignmentState[examId] = snapshot.assignments;
      else delete this.assignmentState[examId];
      if (snapshot.hadAttempts) this.attemptState[examId] = snapshot.attempts;
      else delete this.attemptState[examId];
      this.saveLocal();
      this.notify();
      logError("FIRESTORE_WRITE_FAILED", { operation, examId }, err);
      throw err;
    }
  }

  /**
   * Set lock status for an exam.
   */
  async setExamLocked(examId: string, locked: boolean): Promise<void> {
    await this.persist(examId, () => (this.lockState[examId] = locked), "exam_locks.write", [
      "isLocked",
      "visibleClasses",
    ]);
  }

  /**
   * Toggle the lock status of an exam.
   */
  async toggleExamLocked(examId: string): Promise<boolean> {
    const current = this.isExamLocked(examId);
    const next = !current;
    await this.setExamLocked(examId, next);
    return next;
  }

  /**
   * Set visible classes for an exam (e.g. [6], [7], [8]).
   */
  async setVisibleClasses(examId: string, classes: number[]): Promise<void> {
    const sanitized = Array.from(new Set(classes.map(Number).filter((n) => n >= 1 && n <= 12)));
    const finalClasses = sanitized.length > 0 ? sanitized : [6];
    await this.persist(examId, () => (this.classState[examId] = finalClasses), "exam_locks.write", [
      "isLocked",
      "visibleClasses",
    ]);
  }

  /**
   * Toggle a specific class visibility for an exam.
   */
  async toggleExamClass(examId: string, classNum: number, defaultGrade: number = 6): Promise<number[]> {
    const current = this.getVisibleClasses(examId, defaultGrade);
    let next: number[];
    if (current.includes(classNum)) {
      // Don't remove if it's the only one
      if (current.length === 1) return current;
      next = current.filter((c) => c !== classNum);
    } else {
      next = [...current, classNum].sort((a, b) => a - b);
    }
    await this.setVisibleClasses(examId, next);
    return next;
  }

  /**
   * Ids of the students explicitly assigned to this examination.
   */
  getAssignedStudents(examId: string): string[] {
    if (!examId) return [];
    const records = this.assignmentState[examId];
    if (records) return records.map((s) => s.id);
    return this.studentState[examId] || [];
  }

  /** Assigned students with the class each was assigned in. Empty for legacy id-only lists. */
  getAssignedStudentRecords(examId: string): AssignedStudent[] {
    if (!examId) return [];
    return this.assignmentState[examId] || [];
  }

  /**
   * Replaces the students assigned to an exam, each recorded with their class, and
   * optionally the number of sittings each may take. Assigned students see the paper on
   * their dashboard immediately — even while it is locked to everyone else.
   */
  async assignStudents(
    examId: string,
    students: AssignedStudent[],
    maxAttempts?: number | null
  ): Promise<void> {
    const seen = new Set<string>();
    const sanitized: AssignedStudent[] = [];
    for (const s of students) {
      const id = String(s.id || "").trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      sanitized.push({
        id,
        grade: Number(s.grade) || 6,
        ...(s.email ? { email: norm(s.email) } : {}),
        ...(s.name ? { name: String(s.name).trim() } : {}),
      });
    }
    await this.persist(
      examId,
      () => {
        this.assignmentState[examId] = sanitized;
        this.studentState[examId] = sanitized.map((s) => s.id);
        if (maxAttempts !== undefined) this.attemptState[examId] = normalizeMaxAttempts(maxAttempts);
      },
      "exam_locks.writeStudents",
      maxAttempts !== undefined
        ? ["assignedStudentIds", "assignedStudents", "maxAttempts"]
        : ["assignedStudentIds", "assignedStudents"]
    );
  }

  /** Legacy id-only assignment. Prefer `assignStudents`, which records each student's class. */
  async setAssignedStudents(examId: string, studentIds: string[]): Promise<void> {
    const sanitized = Array.from(new Set(studentIds.map((s) => s.trim()).filter(Boolean)));
    await this.persist(
      examId,
      () => {
        this.studentState[examId] = sanitized;
        delete this.assignmentState[examId];
      },
      "exam_locks.writeStudents",
      ["assignedStudentIds", "assignedStudents"]
    );
  }

  /** Sittings each student may take of this paper; null means unlimited. */
  getMaxAttempts(examId: string): number | null {
    if (!examId) return null;
    return examId in this.attemptState ? this.attemptState[examId] : null;
  }

  async setMaxAttempts(examId: string, maxAttempts: number | null): Promise<void> {
    await this.persist(
      examId,
      () => (this.attemptState[examId] = normalizeMaxAttempts(maxAttempts)),
      "exam_locks.writeAttempts",
      ["maxAttempts"]
    );
  }

  /** Whether this student is named in the paper's assignment, by uid, email or legacy id. */
  isStudentAssigned(examId: string, student: StudentIdentity): boolean {
    const keys = new Set([norm(student.id), norm(student.email), norm(student.name)].filter(Boolean));
    if (keys.size === 0) return false;
    const records = this.getAssignedStudentRecords(examId);
    if (records.some((r) => keys.has(norm(r.id)) || (r.email && keys.has(norm(r.email))))) return true;
    // Id-only lists written before assignments carried a class (including demo aliases
    // such as the student's email or display name).
    return (this.studentState[examId] || []).some((id) => keys.has(norm(id)));
  }

  /**
   * Check if an examination is accessible to a given student.
   * Priority:
   * 1. Explicit student assignment: if the student is assigned to the paper, they have access.
   * 2. Default unlocked dice exam: accessible to demo students.
   * 3. General unlocked exam: accessible if candidate's grade is in visible classes.
   */
  isExamAccessibleToStudent(examId: string, student: StudentIdentity | undefined): boolean {
    if (!examId) return false;

    // 1. Direct candidate assignment
    if (student && this.isStudentAssigned(examId, student)) {
      return true;
    }

    // 2. Default unlocked paper (Dice Mathematics Olympiad)
    if (DEFAULT_UNLOCKED_EXAMS.has(examId)) {
      return true;
    }

    // 3. Locked papers are hidden unless explicitly assigned to the student
    if (this.isExamLocked(examId)) {
      return false;
    }

    // 4. Class visibility check
    const grade = Number(student?.grade) || 6;
    return this.isExamVisibleToClass(examId, grade);
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  getAllLocks(): Record<string, boolean> {
    return { ...this.lockState };
  }

  getAllClasses(): Record<string, number[]> {
    return { ...this.classState };
  }

  getAllStudentAssignments(): Record<string, string[]> {
    return { ...this.studentState };
  }
}

export const ExamLockService = new ExamLockServiceClass();

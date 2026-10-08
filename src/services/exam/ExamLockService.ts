"use client";

import { db, auth, isRealFirebaseConfigured } from "@/services/firebase/config";
import { doc, setDoc, onSnapshot, collection, type Unsubscribe } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { logError, logWarn } from "@/lib/logger";

const STORAGE_LOCKS_KEY = "olympiad_exam_locks_v3";
const STORAGE_CLASSES_KEY = "olympiad_exam_classes_v3";
const STORAGE_STUDENTS_KEY = "olympiad_exam_students_v3";

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

export interface ExamAccessConfig {
  examId: string;
  isLocked: boolean;
  visibleClasses: number[];
  assignedStudentIds?: string[];
  updatedAt?: string;
}

class ExamLockServiceClass {
  private listeners: Set<() => void> = new Set();
  private lockState: Record<string, boolean> = {};
  private classState: Record<string, number[]> = {};
  private studentState: Record<string, string[]> = {};
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

  /**
   * Set lock status for an exam.
   */
  async setExamLocked(examId: string, locked: boolean): Promise<void> {
    const hadPrevious = examId in this.lockState;
    const previous = this.lockState[examId];
    this.lockState[examId] = locked;
    this.saveLocal();
    this.notify();

    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(
          doc(db, "exam_locks", examId),
          {
            examId,
            isLocked: locked,
            visibleClasses: this.getVisibleClasses(examId),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        // Candidates read the server's state, so a change that did not reach it must not
        // be shown to staff as if it had.
        if (hadPrevious) this.lockState[examId] = previous;
        else delete this.lockState[examId];
        this.saveLocal();
        this.notify();
        logError("FIRESTORE_WRITE_FAILED", { operation: "exam_locks.write", examId }, err);
        throw err;
      }
    }
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

    const previousClasses = this.classState[examId];
    this.classState[examId] = finalClasses;
    this.saveLocal();
    this.notify();

    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(
          doc(db, "exam_locks", examId),
          {
            examId,
            isLocked: this.isExamLocked(examId),
            visibleClasses: finalClasses,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        if (previousClasses) this.classState[examId] = previousClasses;
        else delete this.classState[examId];
        this.saveLocal();
        this.notify();
        logError("FIRESTORE_WRITE_FAILED", { operation: "exam_locks.write", examId }, err);
        throw err;
      }
    }
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
   * Get students explicitly aligned/assigned to this examination.
   */
  getAssignedStudents(examId: string): string[] {
    if (!examId) return [];
    return this.studentState[examId] || [];
  }

  /**
   * Set specific students assigned to an exam.
   * If students are assigned, those students can access the exam directly.
   */
  async setAssignedStudents(examId: string, studentIds: string[]): Promise<void> {
    const sanitized = Array.from(new Set(studentIds.map((s) => s.trim()).filter(Boolean)));
    const previous = this.studentState[examId];
    this.studentState[examId] = sanitized;
    this.saveLocal();
    this.notify();

    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(
          doc(db, "exam_locks", examId),
          {
            examId,
            isLocked: this.isExamLocked(examId),
            visibleClasses: this.getVisibleClasses(examId),
            assignedStudentIds: sanitized,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        if (previous) this.studentState[examId] = previous;
        else delete this.studentState[examId];
        this.saveLocal();
        this.notify();
        logError("FIRESTORE_WRITE_FAILED", { operation: "exam_locks.writeStudents", examId }, err);
        throw err;
      }
    }
  }

  /**
   * Check if an examination is accessible to a given student.
   * Priority:
   * 1. Explicit student alignment: if studentId is assigned to the paper, they have access.
   * 2. Default unlocked dice exam: accessible to demo students.
   * 3. General unlocked exam: accessible if candidate's grade is in visible classes.
   */
  isExamAccessibleToStudent(
    examId: string,
    studentId?: string,
    studentGrade?: number | string
  ): boolean {
    if (!examId) return false;

    // 1. Direct candidate alignment
    const assigned = this.getAssignedStudents(examId);
    if (studentId && assigned.length > 0) {
      if (assigned.includes(studentId)) {
        return true;
      }
    }

    // 2. Default unlocked paper (Dice Mathematics Olympiad)
    if (DEFAULT_UNLOCKED_EXAMS.has(examId)) {
      return true;
    }

    // 3. Locked papers are hidden unless explicitly aligned to student
    if (this.isExamLocked(examId)) {
      return false;
    }

    // 4. Class visibility check
    const grade = Number(studentGrade) || 6;
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

"use client";

import { db, isRealFirebaseConfigured } from "@/services/firebase/config";
import { doc, getDoc, setDoc, onSnapshot, collection } from "firebase/firestore";

const STORAGE_KEY = "olympiad_exam_locks_v2";

/**
 * Default unlocked exams:
 * The very first maths exam with the 3D rotating dice question (Q1 DiceLabActivity):
 * - "exam_imo_class6_setb_2022" (IMO 2022-23 Class 6 Set B)
 * - "exam_imo_2024_g6_setb" (IMO 2024-25 Class 6 Set B)
 *
 * All other exams remain strictly locked for candidate testers until a Teacher or Super Admin unlocks them.
 */
const DEFAULT_UNLOCKED_EXAMS = new Set([
  "exam_imo_2022_g6_setb",
  "exam_imo_class6_setb_2022",
  "IMO-2022-23-G6-SETB",
  "exam_imo_2024_g6_setb",
]);

class ExamLockServiceClass {
  private listeners: Set<() => void> = new Set();
  private lockState: Record<string, boolean> = {};
  private initialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.lockState = JSON.parse(raw);
      }
    } catch {}

    // Listen to Firestore if configured
    if (isRealFirebaseConfigured && db) {
      try {
        onSnapshot(
          collection(db, "exam_locks"),
          (snapshot) => {
            snapshot.forEach((d) => {
              const data = d.data();
              if (typeof data?.isLocked === "boolean") {
                this.lockState[d.id] = data.isLocked;
              }
            });
            this.saveLocal();
            this.notify();
          },
          (err) => {
            console.warn("[ExamLockService] Snapshot listener warning:", err);
          }
        );
      } catch {}
    }
  }

  private saveLocal() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lockState));
    } catch {}
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.warn("[ExamLockService] Listener error:", e);
      }
    });
  }

  /**
   * Determine if an exam is currently locked.
   * Default rule: The first maths dice exam is unlocked; all other exams are locked by default.
   */
  isExamLocked(examId: string): boolean {
    if (!examId) return true;

    // 1. Explicit override in lockState takes top priority
    if (examId in this.lockState) {
      return this.lockState[examId];
    }

    // 2. Default: unlocked if it's the dice exam, locked otherwise
    if (DEFAULT_UNLOCKED_EXAMS.has(examId)) {
      return false;
    }

    return true; // All others locked by default
  }

  /**
   * Set lock status for an exam.
   */
  async setExamLocked(examId: string, locked: boolean): Promise<void> {
    this.lockState[examId] = locked;
    this.saveLocal();
    this.notify();

    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "exam_locks", examId), {
          examId,
          isLocked: locked,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("[ExamLockService] Firestore write failed:", err);
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

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  getAllLocks(): Record<string, boolean> {
    return { ...this.lockState };
  }
}

export const ExamLockService = new ExamLockServiceClass();

import { IAttemptRepository, AttemptFilters } from "../interfaces/IAttemptRepository";
import { ExamAttempt } from "@/types/attempt";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { LocalAttemptRepository } from "../local/LocalAttemptRepository";

export class FirestoreAttemptRepository implements IAttemptRepository {
  private localFallback = new LocalAttemptRepository();

  async getAttempt(id: string): Promise<ExamAttempt | null> {
    if (!db) return this.localFallback.getAttempt(id);
    try {
      const snap = await getDoc(doc(db, "attempts", id));
      if (snap.exists()) {
        return snap.data() as ExamAttempt;
      }
      return this.localFallback.getAttempt(id);
    } catch (e) {
      console.warn("Firestore getAttempt failed, fallback to local:", e);
      return this.localFallback.getAttempt(id);
    }
  }

  async listAttempts(filters?: AttemptFilters): Promise<ExamAttempt[]> {
    if (!db) return this.localFallback.listAttempts(filters);
    try {
      const snap = await getDocs(collection(db, "attempts"));
      if (!snap.empty) {
        let attempts = snap.docs.map((d) => d.data() as ExamAttempt);
        attempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        if (filters) {
          if (filters.examId) {
            attempts = attempts.filter((a) => a.examId === filters.examId);
          }
          if (filters.studentId) {
            attempts = attempts.filter((a) => a.student?.studentId === filters.studentId);
          }
          if (filters.isPassed !== undefined) {
            attempts = attempts.filter((a) => a.isPassed === filters.isPassed);
          }
        }
        return attempts;
      }
      return this.localFallback.listAttempts(filters);
    } catch (e) {
      console.warn("Firestore listAttempts failed, fallback to local:", e);
      return this.localFallback.listAttempts(filters);
    }
  }

  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "attempts", attempt.id), attempt);
      } catch (e) {
        console.error("Firestore saveAttempt failed:", e);
      }
    }
    await this.localFallback.saveAttempt(attempt);
  }

  async countAttempts(): Promise<number> {
    const list = await this.listAttempts();
    return list.length;
  }
}

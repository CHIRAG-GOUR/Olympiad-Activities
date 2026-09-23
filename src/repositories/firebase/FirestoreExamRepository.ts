import { IExamRepository } from "../interfaces/IExamRepository";
import { Exam } from "@/types/exam";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { LocalExamRepository } from "../local/LocalExamRepository";

export class FirestoreExamRepository implements IExamRepository {
  private localFallback = new LocalExamRepository();

  async getExam(id: string): Promise<Exam | null> {
    if (!db) return this.localFallback.getExam(id);
    try {
      const snap = await getDoc(doc(db, "exams", id));
      if (snap.exists()) {
        return snap.data() as Exam;
      }
      return this.localFallback.getExam(id);
    } catch (e) {
      console.warn("Firestore getExam failed, fallback to local:", e);
      return this.localFallback.getExam(id);
    }
  }

  async listExams(): Promise<Exam[]> {
    if (!db) return this.localFallback.listExams();
    try {
      const snap = await getDocs(collection(db, "exams"));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Exam);
      }
      return this.localFallback.listExams();
    } catch (e) {
      console.warn("Firestore listExams failed, fallback to local:", e);
      return this.localFallback.listExams();
    }
  }

  async saveExam(exam: Exam): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "exams", exam.id), exam);
      } catch (e) {
        console.error("Firestore saveExam failed:", e);
      }
    }
    await this.localFallback.saveExam(exam);
  }

  async deleteExam(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "exams", id));
      } catch (e) {
        console.error("Firestore deleteExam failed:", e);
      }
    }
    await this.localFallback.deleteExam(id);
  }
}

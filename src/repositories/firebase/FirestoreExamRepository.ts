import { IExamRepository } from "../interfaces/IExamRepository";
import { Exam } from "@/types/exam";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { LocalExamRepository } from "../local/LocalExamRepository";
import { reviveNestedArrays } from "./decodeFirestore";
import { SEED_EXAMS, preferSeed, reconcileWithSeed } from "@/lib/seedData";
import { cached, invalidate, CACHE_TTL } from "../cache";
import { logError, logWarn } from "@/lib/logger";

export class FirestoreExamRepository implements IExamRepository {
  private local = new LocalExamRepository();

  async getExam(id: string): Promise<Exam | null> {
    if (!db) return this.local.getExam(id);
    const firestore = db;
    return cached(`exams:one:${id}`, CACHE_TTL.content, async () => {
      try {
        const snap = await getDoc(doc(firestore, "exams", id));
        if (snap.exists()) {
          return preferSeed(reviveNestedArrays(snap.data()) as Exam, SEED_EXAMS, id);
        }
        return this.local.getExam(id);
      } catch (e) {
        // A built-in paper is still available without the network; a paper authored in
        // the console may be cached on this device. Only when neither exists is the
        // failure the caller's to report.
        const fallback = await this.local.getExam(id);
        if (fallback) {
          logWarn("FIRESTORE_QUERY_FAILED", { operation: "getExam", examId: id }, e);
          return fallback;
        }
        logError("FIRESTORE_QUERY_FAILED", { operation: "getExam", examId: id }, e);
        throw e;
      }
    });
  }

  async listExams(): Promise<Exam[]> {
    if (!db) return this.local.listExams();
    const firestore = db;
    return cached("exams:all", CACHE_TTL.content, async () => {
      const local = await this.local.listExams();
      try {
        const snap = await getDocs(collection(firestore, "exams"));
        if (snap.empty) return local;
        const remote = snap.docs.map((d) => reviveNestedArrays(d.data()) as Exam);
        const remoteIds = new Set(remote.map((e) => e.id));
        return reconcileWithSeed([...remote, ...local.filter((e) => !remoteIds.has(e.id))], SEED_EXAMS);
      } catch (e) {
        logWarn("FIRESTORE_QUERY_FAILED", { operation: "listExams" }, e);
        return local;
      }
    });
  }

  async saveExam(exam: Exam): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "exams", exam.id), exam);
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "saveExam", examId: exam.id }, e);
        throw e;
      }
    }
    await this.local.saveExam(exam);
    invalidate("exams:");
  }

  async deleteExam(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "exams", id));
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "deleteExam", examId: id }, e);
        throw e;
      }
    }
    await this.local.deleteExam(id);
    invalidate("exams:");
  }
}

import { ISubjectRepository } from "../interfaces/ISubjectRepository";
import { Subject } from "@/types/subject";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { LocalSubjectRepository } from "../local/LocalSubjectRepository";
import { reviveNestedArrays } from "./decodeFirestore";

import { SEED_SUBJECTS, reconcileWithSeed, preferSeed } from "@/lib/seedData";
import { cached, invalidate, CACHE_TTL } from "../cache";
import { logError, logWarn } from "@/lib/logger";

export class FirestoreSubjectRepository implements ISubjectRepository {
  private localFallback = new LocalSubjectRepository();

  async getSubject(id: string): Promise<Subject | null> {
    if (!db) return this.localFallback.getSubject(id);
    try {
      const snap = await getDoc(doc(db, "subjects", id));
      if (snap.exists()) {
        return preferSeed(reviveNestedArrays(snap.data()) as Subject, SEED_SUBJECTS, id);
      }
      return this.localFallback.getSubject(id);
    } catch (e) {
      logWarn("FIRESTORE_QUERY_FAILED", { operation: "getSubject", id }, e);
      return this.localFallback.getSubject(id);
    }
  }

  async listSubjects(): Promise<Subject[]> {
    if (!db) return this.localFallback.listSubjects();
    const firestore = db;
    return cached("subjects:all", CACHE_TTL.content, async () => {
      const local = await this.localFallback.listSubjects();
      try {
        const snap = await getDocs(collection(firestore, "subjects"));
        if (snap.empty) return local;
        const remote = snap.docs.map((d) => reviveNestedArrays(d.data()) as Subject);
        const remoteIds = new Set(remote.map((s) => s.id));
        return reconcileWithSeed([...remote, ...local.filter((s) => !remoteIds.has(s.id))], SEED_SUBJECTS);
      } catch (e) {
        logWarn("FIRESTORE_QUERY_FAILED", { operation: "listSubjects" }, e);
        return local;
      }
    });
  }

  async saveSubject(subject: Subject): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "subjects", subject.id), subject);
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "saveSubject", id: subject.id }, e);
        throw e;
      }
    }
    await this.localFallback.saveSubject(subject);
    invalidate("subjects:");
  }

  async deleteSubject(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "subjects", id));
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "deleteSubject", id: id }, e);
        throw e;
      }
    }
    await this.localFallback.deleteSubject(id);
    invalidate("subjects:");
  }
}

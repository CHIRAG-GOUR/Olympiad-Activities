import { ISubjectRepository } from "../interfaces/ISubjectRepository";
import { Subject } from "@/types/subject";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { LocalSubjectRepository } from "../local/LocalSubjectRepository";
import { reviveNestedArrays } from "./decodeFirestore";

import { SEED_SUBJECTS, reconcileWithSeed, preferSeed } from "@/lib/seedData";

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
      console.warn("Firestore getSubject failed, fallback to local:", e);
      return this.localFallback.getSubject(id);
    }
  }

  async listSubjects(): Promise<Subject[]> {
    const local = await this.localFallback.listSubjects();
    if (!db) return local;
    try {
      const snap = await getDocs(collection(db, "subjects"));
      if (!snap.empty) {
        const remote = snap.docs.map((d) => reviveNestedArrays(d.data()) as Subject);
        const remoteIds = new Set(remote.map((s) => s.id));
        const missingLocal = local.filter((s) => !remoteIds.has(s.id));
        return reconcileWithSeed([...remote, ...missingLocal], SEED_SUBJECTS);
      }
      return local;
    } catch (e) {
      console.warn("Firestore listSubjects failed, fallback to local:", e);
      return local;
    }
  }

  async saveSubject(subject: Subject): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "subjects", subject.id), subject);
      } catch (e) {
        console.error("Firestore saveSubject failed:", e);
      }
    }
    await this.localFallback.saveSubject(subject);
  }

  async deleteSubject(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "subjects", id));
      } catch (e) {
        console.error("Firestore deleteSubject failed:", e);
      }
    }
    await this.localFallback.deleteSubject(id);
  }
}

import { IQuestionRepository, QuestionFilters } from "../interfaces/IQuestionRepository";
import { Question } from "@/types/question";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, where, documentId } from "firebase/firestore";
import { LocalQuestionRepository } from "../local/LocalQuestionRepository";
import { reviveNestedArrays } from "./decodeFirestore";
import { SEED_QUESTIONS, preferSeed, reconcileWithSeed } from "@/lib/seedData";
import { cached, invalidate, CACHE_TTL } from "../cache";
import { logError, logWarn } from "@/lib/logger";

/** Firestore's ceiling on values in a single `in` filter. */
const IN_BATCH = 30;

function applyFilters(questions: Question[], filters?: QuestionFilters): Question[] {
  if (!filters) return questions;
  let out = questions;
  if (filters.subjectId) out = out.filter((q) => q.subjectId === filters.subjectId);
  if (filters.grade) out = out.filter((q) => String(q.grade) === String(filters.grade));
  if (filters.chapter) out = out.filter((q) => (q.chapter || "").toLowerCase().includes(filters.chapter!.toLowerCase()));
  if (filters.topic) out = out.filter((q) => (q.topic || "").toLowerCase().includes(filters.topic!.toLowerCase()));
  if (filters.difficulty) out = out.filter((q) => q.difficulty === filters.difficulty);
  if (filters.section) out = out.filter((q) => q.section === filters.section);
  if (filters.searchQuery) {
    const s = filters.searchQuery.toLowerCase();
    out = out.filter(
      (q) =>
        (q.questionText || "").toLowerCase().includes(s) ||
        (q.questionId || "").toLowerCase().includes(s) ||
        (q.topic || "").toLowerCase().includes(s)
    );
  }
  return out;
}

export class FirestoreQuestionRepository implements IQuestionRepository {
  private local = new LocalQuestionRepository();

  async getQuestion(id: string): Promise<Question | null> {
    if (!db) return this.local.getQuestion(id);
    try {
      const snap = await getDoc(doc(db, "questions", id));
      if (snap.exists()) {
        return preferSeed(reviveNestedArrays(snap.data()) as Question, SEED_QUESTIONS, id);
      }
      return this.local.getQuestion(id);
    } catch (e) {
      logWarn("FIRESTORE_QUERY_FAILED", { operation: "getQuestion", questionId: id }, e);
      return this.local.getQuestion(id);
    }
  }

  /** The whole bank, merged with the built-in papers. Cached; any write invalidates it. */
  private async all(): Promise<Question[]> {
    if (!db) return this.local.listQuestions();
    const firestore = db;
    return cached("questions:all", CACHE_TTL.content, async () => {
      const local = await this.local.listQuestions();
      try {
        const snap = await getDocs(collection(firestore, "questions"));
        if (snap.empty) return local;
        const remote = snap.docs.map((d) => reviveNestedArrays(d.data()) as Question);
        const remoteIds = new Set(remote.map((q) => q.id));
        return reconcileWithSeed([...remote, ...local.filter((q) => !remoteIds.has(q.id))], SEED_QUESTIONS);
      } catch (e) {
        // The built-in papers are real content, so the bank is still usable offline.
        logWarn("FIRESTORE_QUERY_FAILED", { operation: "listQuestions" }, e);
        return local;
      }
    });
  }

  async listQuestions(filters?: QuestionFilters): Promise<Question[]> {
    return applyFilters(await this.all(), filters);
  }

  /**
   * Only the questions a paper needs.
   *
   * The exam page used to download the entire bank (every paper's questions) to show one
   * paper. It now reads just this paper's documents, by id, in batches of 30 — and applies
   * the same seed-revision rule as the bank, so a teacher's edit to a built-in question
   * is what the candidate sees. Without the network the built-in papers still load.
   */
  async getQuestionsByIds(ids: string[]): Promise<Question[]> {
    const wanted = Array.from(new Set(ids.filter(Boolean)));
    if (!db) return this.local.getQuestionsByIds(wanted);
    const firestore = db;

    const found = new Map<string, Question>();
    try {
      const remote = new Map<string, Question>();
      for (let i = 0; i < wanted.length; i += IN_BATCH) {
        const batch = wanted.slice(i, i + IN_BATCH);
        const snap = await getDocs(query(collection(firestore, "questions"), where(documentId(), "in", batch)));
        snap.docs.forEach((d) => remote.set(d.id, reviveNestedArrays(d.data()) as Question));
      }
      for (const id of wanted) {
        const q = preferSeed(remote.get(id) ?? null, SEED_QUESTIONS, id);
        if (q) found.set(id, q);
      }
    } catch (e) {
      // Built-in questions and any cached on this device still make the paper sittable.
      (await this.local.getQuestionsByIds(wanted)).forEach((q) => found.set(q.id, q));
      if (found.size < wanted.length) {
        logError("FIRESTORE_QUERY_FAILED", { operation: "getQuestionsByIds", count: wanted.length }, e);
        throw e;
      }
      logWarn("FIRESTORE_QUERY_FAILED", { operation: "getQuestionsByIds", count: wanted.length }, e);
    }
    // Console-authored questions not yet in Firestore (local-only installs).
    const stillMissing = wanted.filter((id) => !found.has(id));
    if (stillMissing.length) {
      (await this.local.getQuestionsByIds(stillMissing)).forEach((q) => found.set(q.id, q));
    }
    return ids.map((id) => found.get(id)).filter((q): q is Question => Boolean(q));
  }

  /** Writes reach Firestore or fail loudly — a save that only landed in this browser is not a save. */
  async saveQuestion(question: Question): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "questions", question.id), question);
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "saveQuestion", questionId: question.id }, e);
        throw e;
      }
    }
    await this.local.saveQuestion(question);
    invalidate("questions:");
  }

  async deleteQuestion(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "questions", id));
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "deleteQuestion", questionId: id }, e);
        throw e;
      }
    }
    await this.local.deleteQuestion(id);
    invalidate("questions:");
  }

  async countQuestions(): Promise<number> {
    return (await this.all()).length;
  }
}

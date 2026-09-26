import { IQuestionRepository, QuestionFilters } from "../interfaces/IQuestionRepository";
import { Question } from "@/types/question";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { LocalQuestionRepository } from "../local/LocalQuestionRepository";
import { reviveNestedArrays } from "./decodeFirestore";

export class FirestoreQuestionRepository implements IQuestionRepository {
  private localFallback = new LocalQuestionRepository();

  async getQuestion(id: string): Promise<Question | null> {
    if (!db) return this.localFallback.getQuestion(id);
    try {
      const snap = await getDoc(doc(db, "questions", id));
      if (snap.exists()) {
        return reviveNestedArrays(snap.data()) as Question;
      }
      return this.localFallback.getQuestion(id);
    } catch (e) {
      console.warn("Firestore getQuestion failed, fallback to local:", e);
      return this.localFallback.getQuestion(id);
    }
  }

  async listQuestions(filters?: QuestionFilters): Promise<Question[]> {
    const local = await this.localFallback.listQuestions(filters);
    if (!db) return local;
    try {
      const colRef = collection(db, "questions");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        let remote = snap.docs.map((d) => reviveNestedArrays(d.data()) as Question);
        const remoteIds = new Set(remote.map((q) => q.id));
        const missingLocal = (await this.localFallback.listQuestions()).filter((q) => !remoteIds.has(q.id));
        let questions = [...remote, ...missingLocal];
        if (filters) {
          if (filters.subjectId) {
            questions = questions.filter((q) => q.subjectId === filters.subjectId);
          }
          if (filters.grade) {
            questions = questions.filter((q) => String(q.grade) === String(filters.grade));
          }
          if (filters.chapter) {
            questions = questions.filter((q) => q.chapter.toLowerCase().includes(filters.chapter!.toLowerCase()));
          }
          if (filters.topic) {
            questions = questions.filter((q) => q.topic.toLowerCase().includes(filters.topic!.toLowerCase()));
          }
          if (filters.difficulty) {
            questions = questions.filter((q) => q.difficulty === filters.difficulty);
          }
          if (filters.section) {
            questions = questions.filter((q) => q.section === filters.section);
          }
          if (filters.searchQuery) {
            const qLower = filters.searchQuery.toLowerCase();
            questions = questions.filter(
              (q) =>
                q.questionText.toLowerCase().includes(qLower) ||
                q.questionId.toLowerCase().includes(qLower) ||
                q.topic.toLowerCase().includes(qLower)
            );
          }
        }
        return questions;
      }
      return local;
    } catch (e) {
      console.warn("Firestore listQuestions failed, fallback to local:", e);
      return local;
    }
  }

  async saveQuestion(question: Question): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "questions", question.id), question);
      } catch (e) {
        console.error("Firestore saveQuestion failed:", e);
      }
    }
    await this.localFallback.saveQuestion(question);
  }

  async deleteQuestion(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "questions", id));
      } catch (e) {
        console.error("Firestore deleteQuestion failed:", e);
      }
    }
    await this.localFallback.deleteQuestion(id);
  }

  async countQuestions(): Promise<number> {
    const list = await this.listQuestions();
    return list.length;
  }
}

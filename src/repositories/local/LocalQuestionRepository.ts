import { IQuestionRepository, QuestionFilters } from "../interfaces/IQuestionRepository";
import { Question } from "@/types/question";
import { SEED_QUESTIONS } from "@/lib/seedData";

// Bumped with the arrival of the Set A question bank (see LocalExamRepository).
const LOCAL_STORAGE_KEY = "olympiad_questions_repo_v5";

export class LocalQuestionRepository implements IQuestionRepository {
  private inMemory: Question[] | null = null;

  private async load(): Promise<Question[]> {
    if (this.inMemory) return this.inMemory;

    let questions: Question[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          questions = JSON.parse(raw);
        }
      } catch {
        // ignore
      }
    }

    const existingIds = new Set(questions.map((q) => q.id));
    const missing = SEED_QUESTIONS.filter((q) => !existingIds.has(q.id));
    this.inMemory = [...questions, ...missing];
    if (missing.length > 0 || questions.length === 0) {
      this.persist(this.inMemory);
    }
    return this.inMemory;
  }

  private persist(questions: Question[]) {
    this.inMemory = questions;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
      } catch {
        // ignore
      }
    }
  }

  async getQuestion(id: string): Promise<Question | null> {
    const questions = await this.load();
    return questions.find((q) => q.id === id || q.questionId === id) || null;
  }

  async listQuestions(filters?: QuestionFilters): Promise<Question[]> {
    let questions = await this.load();

    if (!filters) return questions;

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

    return questions;
  }

  async saveQuestion(question: Question): Promise<void> {
    const questions = await this.load();
    const idx = questions.findIndex((q) => q.id === question.id);
    if (idx >= 0) {
      questions[idx] = question;
    } else {
      questions.push(question);
    }
    this.persist(questions);
  }

  async deleteQuestion(id: string): Promise<void> {
    const questions = await this.load();
    const filtered = questions.filter((q) => q.id !== id);
    this.persist(filtered);
  }

  async countQuestions(): Promise<number> {
    const questions = await this.load();
    return questions.length;
  }
}

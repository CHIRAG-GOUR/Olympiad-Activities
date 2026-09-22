import { IQuestionRepository, QuestionFilters } from "../interfaces/IQuestionRepository";
import { Question } from "@/types/question";
import { SEED_QUESTIONS } from "@/lib/seedData";

const LOCAL_STORAGE_KEY = "olympiad_questions_repo_v2";

export class LocalQuestionRepository implements IQuestionRepository {
  private inMemory: Question[] | null = null;

  private async load(): Promise<Question[]> {
    if (this.inMemory) return this.inMemory;

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          this.inMemory = JSON.parse(raw);
          return this.inMemory!;
        }
      } catch {
        // ignore
      }
    }

    this.inMemory = [...SEED_QUESTIONS];
    this.persist(this.inMemory);
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

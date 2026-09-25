import { IExamRepository } from "../interfaces/IExamRepository";
import { Exam } from "@/types/exam";
import { SEED_EXAMS } from "@/lib/seedData";
import { idbClient } from "@/services/persistence/indexeddb";

// Key bumped when IMO 2018-19 Set A was added, so browsers holding the older single-paper
// blob pick the new paper up instead of silently skipping the seed.
const LOCAL_STORAGE_KEY = "olympiad_exams_repo_v3";

export class LocalExamRepository implements IExamRepository {
  private inMemory: Exam[] | null = null;

  private async load(): Promise<Exam[]> {
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

    this.inMemory = [...SEED_EXAMS];
    this.persist(this.inMemory);
    return this.inMemory;
  }

  private persist(exams: Exam[]) {
    this.inMemory = exams;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exams));
      } catch {
        // ignore
      }
    }
  }

  async getExam(id: string): Promise<Exam | null> {
    const exams = await this.load();
    return exams.find((e) => e.id === id || e.code === id) || null;
  }

  async listExams(): Promise<Exam[]> {
    return this.load();
  }

  async saveExam(exam: Exam): Promise<void> {
    const exams = await this.load();
    const idx = exams.findIndex((e) => e.id === exam.id);
    if (idx >= 0) {
      exams[idx] = exam;
    } else {
      exams.push(exam);
    }
    this.persist(exams);
  }

  async deleteExam(id: string): Promise<void> {
    const exams = await this.load();
    const filtered = exams.filter((e) => e.id !== id);
    this.persist(filtered);
  }
}

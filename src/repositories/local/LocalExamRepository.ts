import { IExamRepository } from "../interfaces/IExamRepository";
import { Exam } from "@/types/exam";
import { SEED_EXAMS, reconcileWithSeed } from "@/lib/seedData";
import { idbClient } from "@/services/persistence/indexeddb";

// Key bumped to v10 for IEO Class 6 Set A paper and interactive activities.
const LOCAL_STORAGE_KEY = "olympiad_exams_repo_v10";

export class LocalExamRepository implements IExamRepository {
  private inMemory: Exam[] | null = null;

  private async load(): Promise<Exam[]> {
    if (this.inMemory) return this.inMemory;

    let exams: Exam[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          exams = JSON.parse(raw);
        }
      } catch {
        // ignore
      }
    }

    const merged = reconcileWithSeed(exams, SEED_EXAMS);
    this.inMemory = merged;
    if (exams.length === 0 || merged.some((e, i) => e !== exams[i])) {
      this.persist(merged);
    }
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

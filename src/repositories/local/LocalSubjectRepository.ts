import { ISubjectRepository } from "../interfaces/ISubjectRepository";
import { Subject } from "@/types/subject";
import { SEED_SUBJECTS } from "@/lib/seedData";

// Bumped so the subject's question and exam counts are recomputed for both papers.
const LOCAL_STORAGE_KEY = "olympiad_subjects_repo_v2";

export class LocalSubjectRepository implements ISubjectRepository {
  private inMemory: Subject[] | null = null;

  private async load(): Promise<Subject[]> {
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

    this.inMemory = [...SEED_SUBJECTS];
    this.persist(this.inMemory);
    return this.inMemory;
  }

  private persist(subjects: Subject[]) {
    this.inMemory = subjects;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subjects));
      } catch {
        // ignore
      }
    }
  }

  async getSubject(id: string): Promise<Subject | null> {
    const subjects = await this.load();
    return subjects.find((s) => s.id === id || s.code === id) || null;
  }

  async listSubjects(): Promise<Subject[]> {
    return this.load();
  }

  async saveSubject(subject: Subject): Promise<void> {
    const subjects = await this.load();
    const idx = subjects.findIndex((s) => s.id === subject.id);
    if (idx >= 0) {
      subjects[idx] = subject;
    } else {
      subjects.push(subject);
    }
    this.persist(subjects);
  }

  async deleteSubject(id: string): Promise<void> {
    const subjects = await this.load();
    const filtered = subjects.filter((s) => s.id !== id);
    this.persist(filtered);
  }
}

import { IAttemptRepository, AttemptFilters } from "../interfaces/IAttemptRepository";
import { ExamAttempt } from "@/types/attempt";
import { idbClient } from "@/services/persistence/indexeddb";

export class LocalAttemptRepository implements IAttemptRepository {
  // Attempts are read from IndexedDB by the dashboard, analytics, live-monitor and
  // results pages, often within the same admin session, each running its own full
  // getAll() transaction. Cache the sorted list in memory and only re-read from IndexedDB
  // when a new attempt is actually saved, or on first use per page load.
  private cache: ExamAttempt[] | null = null;

  private async loadAll(): Promise<ExamAttempt[]> {
    if (this.cache) return this.cache;
    const attempts = await idbClient.getAll<ExamAttempt>("attempts");
    attempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    this.cache = attempts;
    return attempts;
  }

  async getAttempt(id: string): Promise<ExamAttempt | null> {
    return idbClient.get<ExamAttempt>("attempts", id);
  }

  async listAttempts(filters?: AttemptFilters): Promise<ExamAttempt[]> {
    const attempts = await this.loadAll();

    if (!filters) return attempts;

    let filtered = attempts;
    if (filters.examId) {
      filtered = filtered.filter((a) => a.examId === filters.examId);
    }
    if (filters.studentId) {
      filtered = filtered.filter((a) => a.student.studentId === filters.studentId);
    }
    if (filters.isPassed !== undefined) {
      filtered = filtered.filter((a) => a.isPassed === filters.isPassed);
    }

    return filtered;
  }

  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    await idbClient.put("attempts", attempt);
    this.cache = null; // invalidate — next read gets the fresh set including this attempt
  }

  async countAttempts(): Promise<number> {
    const attempts = await this.loadAll();
    return attempts.length;
  }
}

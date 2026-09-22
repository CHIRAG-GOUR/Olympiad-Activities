import { IAttemptRepository, AttemptFilters } from "../interfaces/IAttemptRepository";
import { ExamAttempt } from "@/types/attempt";
import { idbClient } from "@/services/persistence/indexeddb";

export class LocalAttemptRepository implements IAttemptRepository {
  async getAttempt(id: string): Promise<ExamAttempt | null> {
    return idbClient.get<ExamAttempt>("attempts", id);
  }

  async listAttempts(filters?: AttemptFilters): Promise<ExamAttempt[]> {
    const attempts = await idbClient.getAll<ExamAttempt>("attempts");
    
    // Sort descending by submittedAt
    attempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

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
  }

  async countAttempts(): Promise<number> {
    const attempts = await idbClient.getAll<ExamAttempt>("attempts");
    return attempts.length;
  }
}

import { attemptRepository, AttemptFilters } from "@/repositories";
import { ExamAttempt } from "@/types/attempt";
import { ScoreEngineInput, evaluateAndGenerateFullResult } from "@/engine/scoring-engine";
import { reportRepository } from "@/repositories";

export class AttemptService {
  async getAttempt(id: string): Promise<ExamAttempt | null> {
    return attemptRepository.getAttempt(id);
  }

  async listAttempts(filters?: AttemptFilters): Promise<ExamAttempt[]> {
    return attemptRepository.listAttempts(filters);
  }

  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    return attemptRepository.saveAttempt(attempt);
  }

  async countAttempts(): Promise<number> {
    return attemptRepository.countAttempts();
  }

  /**
   * Evaluates examination submission, computes marks, and persists attempt & report atomically.
   */
  async submitExam(input: ScoreEngineInput): Promise<{ attempt: ExamAttempt; report: any }> {
    const { attempt, report } = evaluateAndGenerateFullResult(input);
    await attemptRepository.saveAttempt(attempt);
    await reportRepository.saveReport(report);
    return { attempt, report };
  }
}

export const attemptService = new AttemptService();
export const resultService = attemptService;

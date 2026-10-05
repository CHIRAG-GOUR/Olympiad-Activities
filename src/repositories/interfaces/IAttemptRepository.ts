import { ExamAttempt } from "@/types/attempt";

export interface AttemptFilters {
  examId?: string;
  studentId?: string;
  isPassed?: boolean;
  /**
   * Restrict to one account's attempts. Required when the caller is a candidate: the
   * security rules only allow a candidate to query their own documents, so an unscoped
   * query is refused outright rather than filtered.
   */
  ownerUid?: string;
}

export interface IAttemptRepository {
  getAttempt(id: string): Promise<ExamAttempt | null>;
  listAttempts(filters?: AttemptFilters): Promise<ExamAttempt[]>;
  saveAttempt(attempt: ExamAttempt): Promise<void>;
  countAttempts(): Promise<number>;
}

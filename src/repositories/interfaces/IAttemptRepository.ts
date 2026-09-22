import { ExamAttempt } from "@/types/attempt";

export interface AttemptFilters {
  examId?: string;
  studentId?: string;
  isPassed?: boolean;
}

export interface IAttemptRepository {
  getAttempt(id: string): Promise<ExamAttempt | null>;
  listAttempts(filters?: AttemptFilters): Promise<ExamAttempt[]>;
  saveAttempt(attempt: ExamAttempt): Promise<void>;
  countAttempts(): Promise<number>;
}

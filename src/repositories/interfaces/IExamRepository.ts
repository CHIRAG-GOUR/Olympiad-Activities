import { Exam } from "@/types/exam";

export interface IExamRepository {
  getExam(id: string): Promise<Exam | null>;
  listExams(): Promise<Exam[]>;
  saveExam(exam: Exam): Promise<void>;
  deleteExam(id: string): Promise<void>;
}

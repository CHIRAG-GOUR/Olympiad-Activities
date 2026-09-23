import { examRepository } from "@/repositories";
import { Exam } from "@/types/exam";

export class ExamService {
  async getExam(id: string): Promise<Exam | null> {
    return examRepository.getExam(id);
  }

  async listExams(): Promise<Exam[]> {
    return examRepository.listExams();
  }

  async saveExam(exam: Exam): Promise<void> {
    return examRepository.saveExam(exam);
  }

  async deleteExam(id: string): Promise<void> {
    return examRepository.deleteExam(id);
  }
}

export const examService = new ExamService();

import { ExamReport } from "@/types/report";

export interface ReportFilters {
  examId?: string;
  studentId?: string;
  classLevel?: number | string;
}

export interface IReportRepository {
  getReport(reportId: string): Promise<ExamReport | null>;
  getReportByAttemptId(attemptId: string): Promise<ExamReport | null>;
  listReports(filters?: ReportFilters): Promise<ExamReport[]>;
  saveReport(report: ExamReport): Promise<void>;
}

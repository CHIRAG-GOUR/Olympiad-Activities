import { IReportRepository, ReportFilters } from "../interfaces/IReportRepository";
import { ExamReport } from "@/types/report";
import { idbClient } from "@/services/persistence/indexeddb";

export class LocalReportRepository implements IReportRepository {
  async getReport(reportId: string): Promise<ExamReport | null> {
    return idbClient.get<ExamReport>("reports", reportId);
  }

  async getReportByAttemptId(attemptId: string): Promise<ExamReport | null> {
    const all = await idbClient.getAll<ExamReport>("reports");
    return all.find((r) => r.attemptId === attemptId) || null;
  }

  async listReports(filters?: ReportFilters): Promise<ExamReport[]> {
    const reports = await idbClient.getAll<ExamReport>("reports");
    
    reports.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    if (!filters) return reports;

    let filtered = reports;
    if (filters.examId) {
      filtered = filtered.filter((r) => r.examId === filters.examId);
    }
    if (filters.studentId) {
      filtered = filtered.filter((r) => r.studentId === filters.studentId);
    }
    if (filters.classLevel !== undefined) {
      filtered = filtered.filter((r) => String(r.classLevel) === String(filters.classLevel));
    }

    return filtered;
  }

  async saveReport(report: ExamReport): Promise<void> {
    await idbClient.put("reports", report);
  }
}

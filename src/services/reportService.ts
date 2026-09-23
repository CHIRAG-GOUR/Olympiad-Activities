import { reportRepository, ReportFilters } from "@/repositories";
import { ExamReport } from "@/types/report";
import { ScoreEngineInput, evaluateAndGenerateFullResult } from "@/engine/scoring-engine";

export class ReportService {
  /**
   * Generates a fully calculated, structured exam report from submission input.
   * Satisfies the universal report contract across client, server, and cloud function environments.
   */
  generateReport(input: ScoreEngineInput): ExamReport {
    const { report } = evaluateAndGenerateFullResult(input);
    return report;
  }

  async getReport(reportId: string): Promise<ExamReport | null> {
    return reportRepository.getReport(reportId);
  }

  async getReportByAttemptId(attemptId: string): Promise<ExamReport | null> {
    return reportRepository.getReportByAttemptId(attemptId);
  }

  async listReports(filters?: ReportFilters): Promise<ExamReport[]> {
    return reportRepository.listReports(filters);
  }

  async saveReport(report: ExamReport): Promise<void> {
    return reportRepository.saveReport(report);
  }
}

export const reportService = new ReportService();

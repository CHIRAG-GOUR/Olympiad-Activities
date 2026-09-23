import { IReportRepository, ReportFilters } from "../interfaces/IReportRepository";
import { ExamReport } from "@/types/report";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { LocalReportRepository } from "../local/LocalReportRepository";

export class FirestoreReportRepository implements IReportRepository {
  private localFallback = new LocalReportRepository();

  async getReport(reportId: string): Promise<ExamReport | null> {
    if (!db) return this.localFallback.getReport(reportId);
    try {
      const snap = await getDoc(doc(db, "reports", reportId));
      if (snap.exists()) {
        return snap.data() as ExamReport;
      }
      return this.localFallback.getReport(reportId);
    } catch (e) {
      console.warn("Firestore getReport failed, fallback to local:", e);
      return this.localFallback.getReport(reportId);
    }
  }

  async getReportByAttemptId(attemptId: string): Promise<ExamReport | null> {
    if (!db) return this.localFallback.getReportByAttemptId(attemptId);
    try {
      const all = await this.listReports();
      return all.find((r) => r.attemptId === attemptId) || this.localFallback.getReportByAttemptId(attemptId);
    } catch (e) {
      return this.localFallback.getReportByAttemptId(attemptId);
    }
  }

  async listReports(filters?: ReportFilters): Promise<ExamReport[]> {
    if (!db) return this.localFallback.listReports(filters);
    try {
      const snap = await getDocs(collection(db, "reports"));
      if (!snap.empty) {
        let reports = snap.docs.map((d) => d.data() as ExamReport);
        reports.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        if (filters) {
          if (filters.examId) {
            reports = reports.filter((r) => r.examId === filters.examId);
          }
          if (filters.studentId) {
            reports = reports.filter((r) => r.studentId === filters.studentId);
          }
          if (filters.classLevel !== undefined) {
            reports = reports.filter((r) => String(r.classLevel) === String(filters.classLevel));
          }
        }
        return reports;
      }
      return this.localFallback.listReports(filters);
    } catch (e) {
      console.warn("Firestore listReports failed, fallback to local:", e);
      return this.localFallback.listReports(filters);
    }
  }

  async saveReport(report: ExamReport): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "reports", report.reportId), report);
      } catch (e) {
        console.error("Firestore saveReport failed:", e);
      }
    }
    await this.localFallback.saveReport(report);
  }
}

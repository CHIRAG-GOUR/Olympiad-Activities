import { IReportRepository, ReportFilters } from "../interfaces/IReportRepository";
import { ExamReport } from "@/types/report";
import { db, auth } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, query, where, orderBy, limit, type QueryConstraint } from "firebase/firestore";
import { LocalReportRepository } from "../local/LocalReportRepository";
import { cached, invalidate, CACHE_TTL } from "../cache";
import { isPermissionDenied, logError } from "@/lib/logger";

const COHORT_LIMIT = 1000;

function applyFilters(reports: ExamReport[], filters?: ReportFilters): ExamReport[] {
  if (!filters) return reports;
  let out = reports;
  if (filters.examId) out = out.filter((r) => r.examId === filters.examId);
  if (filters.studentId) out = out.filter((r) => r.studentId === filters.studentId);
  if (filters.classLevel !== undefined) out = out.filter((r) => String(r.classLevel) === String(filters.classLevel));
  return out;
}

export class FirestoreReportRepository implements IReportRepository {
  private local = new LocalReportRepository();

  async getReport(reportId: string): Promise<ExamReport | null> {
    const mine = await this.local.getReport(reportId);
    if (mine || !db) return mine;
    try {
      const snap = await getDoc(doc(db, "reports", reportId));
      return snap.exists() ? (snap.data() as ExamReport) : null;
    } catch (e) {
      logError("FIRESTORE_QUERY_FAILED", { operation: "getReport", reportId }, e);
      throw e;
    }
  }

  /**
   * One document read. Report ids are `rep_<attemptId>`, so the report is fetched directly
   * rather than by downloading every report in the system and searching the list (which
   * was also refused outright for candidates by the security rules).
   */
  async getReportByAttemptId(attemptId: string): Promise<ExamReport | null> {
    const mine = await this.local.getReportByAttemptId(attemptId);
    if (mine || !db) return mine;
    try {
      const snap = await getDoc(doc(db, "reports", `rep_${attemptId}`));
      if (snap.exists()) return snap.data() as ExamReport;
      // Older reports may not follow the id convention; this staff-only fallback is a
      // single-document query.
      const legacy = await getDocs(query(collection(db, "reports"), where("attemptId", "==", attemptId), limit(1)));
      return legacy.empty ? null : (legacy.docs[0].data() as ExamReport);
    } catch (e) {
      if (isPermissionDenied(e)) return null; // a candidate's legacy fallback query is refused
      logError("FIRESTORE_QUERY_FAILED", { operation: "getReportByAttemptId", attemptId }, e);
      throw e;
    }
  }

  async listReports(filters?: ReportFilters): Promise<ExamReport[]> {
    if (!db) return this.local.listReports(filters);
    const firestore = db;
    const owner = filters?.ownerUid;
    const remote = await cached(`reports:${owner ?? "*"}`, CACHE_TTL.records, async () => {
      const constraints: QueryConstraint[] = owner
        ? [where("ownerUid", "==", owner), orderBy("submittedAt", "desc")]
        : [orderBy("submittedAt", "desc"), limit(COHORT_LIMIT)];
      try {
        const snap = await getDocs(query(collection(firestore, "reports"), ...constraints));
        return snap.docs.map((d) => d.data() as ExamReport);
      } catch (e) {
        logError("FIRESTORE_QUERY_FAILED", { operation: "listReports", scope: owner ? "own" : "cohort" }, e);
        throw e;
      }
    });
    const pending = owner ? await this.local.listReports({ ownerUid: owner }) : [];
    const ids = new Set(remote.map((r) => r.reportId));
    return applyFilters([...remote, ...pending.filter((r) => !ids.has(r.reportId))], filters);
  }

  /** Same contract as `saveAttempt`: local first, idempotent, failures thrown. */
  async saveReport(report: ExamReport): Promise<void> {
    const uid = auth?.currentUser?.uid;
    const record = uid ? { ...report, ownerUid: uid } : report;
    await this.local.saveReport(record);
    invalidate("reports:");
    if (!db) return;
    const ref = doc(db, "reports", report.reportId);
    try {
      await setDoc(ref, record);
    } catch (e) {
      if (isPermissionDenied(e)) {
        const existing = await getDoc(ref).catch(() => null);
        if (existing?.exists()) return;
      }
      logError("FIRESTORE_WRITE_FAILED", { operation: "saveReport", attemptId: report.attemptId, examId: report.examId }, e);
      throw e;
    }
  }
}

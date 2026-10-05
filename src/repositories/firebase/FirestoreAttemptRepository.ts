import { IAttemptRepository, AttemptFilters } from "../interfaces/IAttemptRepository";
import { ExamAttempt } from "@/types/attempt";
import { db, auth } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, query, where, orderBy, limit, type QueryConstraint } from "firebase/firestore";
import { LocalAttemptRepository } from "../local/LocalAttemptRepository";
import { cached, invalidate, CACHE_TTL } from "../cache";
import { isPermissionDenied, logError } from "@/lib/logger";

/** Upper bound on a cohort-wide read; staff screens summarise, they do not page through. */
const COHORT_LIMIT = 1000;

function applyFilters(attempts: ExamAttempt[], filters?: AttemptFilters): ExamAttempt[] {
  if (!filters) return attempts;
  let out = attempts;
  if (filters.examId) out = out.filter((a) => a.examId === filters.examId);
  if (filters.studentId) out = out.filter((a) => a.student?.studentId === filters.studentId);
  if (filters.isPassed !== undefined) out = out.filter((a) => a.isPassed === filters.isPassed);
  return out;
}

const bySubmittedDesc = (a: ExamAttempt, b: ExamAttempt) =>
  new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();

export class FirestoreAttemptRepository implements IAttemptRepository {
  private local = new LocalAttemptRepository();

  /**
   * This device's own copy first: a candidate who has just submitted (possibly offline)
   * sees their score paper immediately and without a read. Otherwise Firestore.
   * A Firestore failure is raised, not hidden — "not found" and "could not load" are
   * different answers and the score page shows them differently.
   */
  async getAttempt(id: string): Promise<ExamAttempt | null> {
    const mine = await this.local.getAttempt(id);
    if (mine || !db) return mine;
    try {
      const snap = await getDoc(doc(db, "attempts", id));
      return snap.exists() ? (snap.data() as ExamAttempt) : null;
    } catch (e) {
      logError("FIRESTORE_QUERY_FAILED", { operation: "getAttempt", attemptId: id }, e);
      throw e;
    }
  }

  async listAttempts(filters?: AttemptFilters): Promise<ExamAttempt[]> {
    if (!db) return this.local.listAttempts(filters);
    const firestore = db;
    const owner = filters?.ownerUid;
    const key = `attempts:${owner ?? "*"}`;

    const remote = await cached(key, CACHE_TTL.records, async () => {
      const constraints: QueryConstraint[] = owner
        ? [where("ownerUid", "==", owner), orderBy("submittedAt", "desc")]
        : [orderBy("submittedAt", "desc"), limit(COHORT_LIMIT)];
      try {
        const snap = await getDocs(query(collection(firestore, "attempts"), ...constraints));
        return snap.docs.map((d) => d.data() as ExamAttempt);
      } catch (e) {
        logError("FIRESTORE_QUERY_FAILED", { operation: "listAttempts", scope: owner ? "own" : "cohort" }, e);
        throw e;
      }
    });

    // Attempts submitted on this device but not yet uploaded (offline submission) are
    // still the candidate's results; merge them in so they never seem to vanish.
    const pending = owner ? await this.local.listAttempts({ ownerUid: owner }) : [];
    const ids = new Set(remote.map((a) => a.id));
    const merged = [...remote, ...pending.filter((a) => !ids.has(a.id))].sort(bySubmittedDesc);
    return applyFilters(merged, filters);
  }

  /**
   * Files the attempt on this device, then in Firestore.
   *
   * Idempotent: attempt ids are deterministic per sitting and the rules make an existing
   * attempt read-only to candidates, so a retry of an attempt that already reached the
   * server is refused — in which case its presence is confirmed and treated as success.
   * Any other failure is thrown so the caller can queue a retry; it is never swallowed.
   */
  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    const uid = auth?.currentUser?.uid;
    const record = uid ? { ...attempt, ownerUid: uid } : attempt;
    await this.local.saveAttempt(record);
    invalidate("attempts:");
    if (!db) return;
    const ref = doc(db, "attempts", attempt.id);
    try {
      await setDoc(ref, record);
    } catch (e) {
      if (isPermissionDenied(e)) {
        const existing = await getDoc(ref).catch(() => null);
        if (existing?.exists()) return;
      }
      logError("FIRESTORE_WRITE_FAILED", { operation: "saveAttempt", attemptId: attempt.id, examId: attempt.examId }, e);
      throw e;
    }
  }

  async countAttempts(): Promise<number> {
    const list = await this.listAttempts();
    return list.length;
  }
}

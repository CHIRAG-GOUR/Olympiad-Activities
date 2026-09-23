import { UserProfile, UserRole, hasPermission } from "./rbac";
import { ExamAttempt } from "@/types/attempt";
import { ExamReport } from "@/types/report";

/**
 * Data-access authorization.
 *
 * Route guards decide which screens open; this decides which *records* a person may
 * receive. Every read of attempts or reports goes through here, so a student changing
 * `/results/<id>` to someone else's id is refused at the data boundary rather than merely
 * being unable to find a link to it.
 *
 * The shape is deliberately query-like — a scope in, a filtered set out — so it maps
 * directly onto Firestore security rules and server-side `where` clauses when Firebase is
 * connected. Nothing here relies on the UI having hidden something.
 */

export interface AccessScope {
  role: UserRole;
  /** Identity used for ownership comparisons. */
  userId: string;
  email: string;
  name: string;
}

export function scopeFor(user: UserProfile | null): AccessScope | null {
  if (!user) return null;
  return { role: user.role, userId: user.id, email: user.email, name: user.name };
}

/* ── Ownership ─────────────────────────────────────────────── */

/**
 * Whether an attempt belongs to the person in `scope`.
 *
 * Candidates identify themselves at the start of a paper, so an attempt carries the name
 * and id they entered rather than a foreign key to a user record. Until Firebase supplies
 * a real uid on every attempt, ownership matches on either, compared case-insensitively
 * and trimmed.
 */
export function ownsAttempt(scope: AccessScope, attempt: ExamAttempt): boolean {
  const candidateId = attempt.student?.studentId?.trim().toLowerCase();
  const candidateName = attempt.student?.name?.trim().toLowerCase();
  return (
    (Boolean(candidateId) && candidateId === scope.userId.trim().toLowerCase()) ||
    (Boolean(candidateName) && candidateName === scope.name.trim().toLowerCase())
  );
}

export function ownsReport(scope: AccessScope, report: ExamReport): boolean {
  const owner = String(report.studentId ?? "").trim().toLowerCase();
  return Boolean(owner) && owner === scope.userId.trim().toLowerCase();
}

/* ── Read authorization ────────────────────────────────────── */

/** May this scope open this single attempt? */
export function canReadAttempt(scope: AccessScope | null, attempt: ExamAttempt | null): boolean {
  if (!scope || !attempt) return false;
  if (hasPermission(scope.role, "result:view")) return true; // staff: cohort-wide
  if (hasPermission(scope.role, "result:viewOwn")) return ownsAttempt(scope, attempt);
  return false;
}

export function canReadReport(scope: AccessScope | null, report: ExamReport | null): boolean {
  if (!scope || !report) return false;
  if (hasPermission(scope.role, "report:view")) return true;
  if (hasPermission(scope.role, "report:viewOwn")) return ownsReport(scope, report);
  return false;
}

/**
 * Narrows a list of attempts to what the scope is entitled to see.
 *
 * Staff receive the cohort; a candidate receives only their own records — not the full set
 * rendered selectively. Callers should pass this the result of a repository read and use
 * the returned array exclusively.
 */
export function visibleAttempts(scope: AccessScope | null, attempts: ExamAttempt[]): ExamAttempt[] {
  if (!scope) return [];
  if (hasPermission(scope.role, "result:view")) return attempts;
  if (hasPermission(scope.role, "result:viewOwn")) {
    return attempts.filter((a) => ownsAttempt(scope, a));
  }
  return [];
}

export function visibleReports(scope: AccessScope | null, reports: ExamReport[]): ExamReport[] {
  if (!scope) return [];
  if (hasPermission(scope.role, "report:view")) return reports;
  if (hasPermission(scope.role, "report:viewOwn")) {
    return reports.filter((r) => ownsReport(scope, r));
  }
  return [];
}

/**
 * Whether the scope may see cohort-level aggregates (other candidates' performance,
 * participation totals, system analytics). Students never may.
 */
export function canSeeCohortData(scope: AccessScope | null): boolean {
  return Boolean(scope && hasPermission(scope.role, "result:view"));
}

export function canSeeSystemAnalytics(scope: AccessScope | null): boolean {
  return Boolean(scope && hasPermission(scope.role, "analytics:system"));
}

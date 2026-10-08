/**
 * Who may sit a paper, and how many times — as pure functions of the paper's lock record.
 *
 * ExamLockService holds the live records and calls these; tests call them directly.
 */

/** Highest finite attempt limit a teacher can choose; above this the paper is unlimited. */
export const MAX_ATTEMPT_CHOICES = 10;

/** A student a paper has been assigned to, recorded with the class they were assigned in. */
export interface AssignedStudent {
  id: string;
  email?: string;
  name?: string;
  grade: number;
  section?: string;
}

/** Who is asking for a paper. Any one identifier matching an assignment is enough. */
export interface StudentIdentity {
  id?: string;
  email?: string;
  name?: string;
  grade?: number | string;
}

/** What the access decision needs to know about one paper. */
export interface PaperAccessState {
  isLocked: boolean;
  /** Classes the paper is open to while unlocked. */
  visibleClasses: number[];
  /** Students assigned with their class (current format). */
  assignedStudents: AssignedStudent[];
  /** Ids written before assignments carried a class; may hold emails or display names. */
  legacyAssignedIds: string[];
  /** Papers open to every candidate regardless of lock (the demo paper). */
  alwaysOpen?: boolean;
}

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();

/** 1–10, or null for unlimited. Anything else is treated as unlimited. */
export function normalizeMaxAttempts(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.min(MAX_ATTEMPT_CHOICES, Math.floor(n));
}

/** Whether this student is named in the paper's assignment, by uid, email or legacy id. */
export function isAssigned(state: Pick<PaperAccessState, "assignedStudents" | "legacyAssignedIds">, student: StudentIdentity): boolean {
  const keys = new Set([norm(student.id), norm(student.email), norm(student.name)].filter(Boolean));
  if (keys.size === 0) return false;
  if (state.assignedStudents.some((r) => keys.has(norm(r.id)) || (r.email && keys.has(norm(r.email))))) return true;
  return state.legacyAssignedIds.some((id) => keys.has(norm(id)));
}

/**
 * Whether a candidate may see and sit a paper:
 *   1. assigned to them by a teacher — even while the paper is locked to everyone else;
 *   2. the always-open demo paper;
 *   3. otherwise only when unlocked and open to the candidate's class.
 */
export function canStudentAccess(state: PaperAccessState, student: StudentIdentity | undefined): boolean {
  if (student && isAssigned(state, student)) return true;
  if (state.alwaysOpen) return true;
  if (state.isLocked) return false;
  const grade = Number(student?.grade) || 6;
  return state.visibleClasses.includes(grade);
}

/** Sittings left, or null when unlimited. */
export function attemptsLeft(maxAttempts: number | null, used: number): number | null {
  return maxAttempts === null ? null : Math.max(0, maxAttempts - used);
}

/** Whether another sitting may be started. Staff previews are never limited. */
export function mayStartSitting(maxAttempts: number | null, used: number, isStaff = false): boolean {
  if (isStaff || maxAttempts === null) return true;
  return used < maxAttempts;
}

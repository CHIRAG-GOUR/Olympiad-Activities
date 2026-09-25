/**
 * Role-Based Access Control — core definitions.
 *
 * Single source of truth for roles, permissions and the role→permission grant table.
 * Nothing else in the application may compare role strings directly; everything asks a
 * question of this module instead. That keeps authorization auditable in one file and maps
 * cleanly onto Firestore security rules when Firebase is connected.
 */

export type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

export const USER_ROLES: UserRole[] = ["SUPER_ADMIN", "TEACHER", "STUDENT"];

/**
 * Permission vocabulary.
 *
 * `*:own` permissions are deliberately distinct from their global counterparts: a student
 * holds `result:viewOwn`, never `result:view`, so a query written against the data layer
 * cannot accidentally hand them the whole cohort.
 */
export type Permission =
  // Examinations
  | "exam:view"
  | "exam:create"
  | "exam:edit"
  | "exam:delete"
  | "exam:publish"
  | "exam:archive"
  | "exam:attempt"
  | "exam:resume"
  // Questions & activities
  | "question:view"
  | "question:create"
  | "question:edit"
  | "question:delete"
  | "question:import"
  | "activity:view"
  | "activity:create"
  | "activity:edit"
  // People
  | "student:view"
  | "student:manage"
  | "teacher:view"
  | "teacher:manage"
  | "user:manage"
  // Results & reports
  | "result:view"
  | "result:viewOwn"
  | "report:view"
  | "report:viewOwn"
  | "report:download"
  // Oversight
  | "monitor:view"
  | "analytics:view"
  | "analytics:system"
  // Platform
  | "subject:manage"
  | "settings:manage"
  | "system:configure";

const TEACHER_PERMISSIONS: Permission[] = [
  "exam:view",
  "exam:create",
  "exam:edit",
  "exam:publish",
  "exam:attempt",
  "question:view",
  "question:create",
  "question:edit",
  "question:delete",
  "question:import",
  "activity:view",
  "activity:create",
  "activity:edit",
  "student:view",
  "result:view",
  "report:view",
  "report:download",
  "monitor:view",
];

const STUDENT_PERMISSIONS: Permission[] = [
  "exam:view",
  "exam:attempt",
  "exam:resume",
  "result:viewOwn",
  "report:viewOwn",
  "report:download",
];

/**
 * Super administrators hold every permission. Expressed as a wildcard rather than a
 * hand-maintained list so a newly added permission is never accidentally withheld.
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[] | "*"> = {
  SUPER_ADMIN: "*",
  TEACHER: TEACHER_PERMISSIONS,
  STUDENT: STUDENT_PERMISSIONS,
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const grants = ROLE_PERMISSIONS[role];
  if (!grants) return false;
  if (grants === "*") return true;
  return grants.includes(permission);
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getPermissionsForRole(role: UserRole): Permission[] | "*" {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "TEACHER":
      return "Teacher";
    case "STUDENT":
      return "Student";
    default:
      return role;
  }
}

export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Full administration of the platform";
    case "TEACHER":
      return "Examinations, questions and candidate results";
    case "STUDENT":
      return "Sitting examinations and reviewing own results";
    default:
      return "";
  }
}

/* ── User model (Firebase-ready) ───────────────────────────── */

export type UserStatus = "active" | "suspended" | "invited";

export interface UserProfile {
  id: string;
  email: string;
  /** Display name. `name` is retained as the canonical field used across the app. */
  name: string;
  role: UserRole;
  status?: UserStatus;
  schoolName?: string;
  grade?: number | string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

/* ── Privileged testing accounts ───────────────────────────── */

/**
 * Accounts permitted to view the platform as any role.
 *
 * This is an explicit allow-list, not a role check: an ordinary teacher or student can
 * never acquire the switcher, and adding a privileged tester is a one-line, reviewable
 * change. When Firebase lands this becomes a custom claim.
 */
const MULTI_ROLE_ACCOUNTS = [
  "pa1@skillizee.io",
  "swati123@gmail.com",
  "aarna@cambridgecourtgroup.com",
];

/**
 * Founding administrators, by email.
 *
 * These are not credentials — there are no passwords here, and holding the address proves
 * nothing. Sign-in still has to succeed against Firebase Authentication first. This only
 * answers "which role does this verified account hold?" for the accounts that exist
 * before anybody is in a position to grant a role, which is the bootstrap problem every
 * new deployment has.
 *
 * It is consulted last: a `role` custom claim wins, then the account's /users/{uid}
 * document, then this. Once claims are issued by the Admin SDK this list can go, and the
 * matching allow-list in firestore.rules with it.
 */
const FOUNDING_ADMINS = [
  "pa1@skillizee.io",
  "swati123@gmail.com",
  "aarna@cambridgecourtgroup.com",
];

/** The role a verified account starts with when nothing else has assigned one. */
export function bootstrapRoleFor(email: string | undefined | null): UserRole | null {
  if (!email) return null;
  return FOUNDING_ADMINS.includes(email.trim().toLowerCase()) ? "SUPER_ADMIN" : null;
}

export function canSwitchRole(email: string | undefined | null): boolean {
  if (!email) return false;
  return MULTI_ROLE_ACCOUNTS.includes(email.trim().toLowerCase());
}

/** Roles a given account may operate as. */
export function availableRolesFor(email: string | undefined | null, assignedRole: UserRole): UserRole[] {
  return canSwitchRole(email) ? [...USER_ROLES] : [assignedRole];
}

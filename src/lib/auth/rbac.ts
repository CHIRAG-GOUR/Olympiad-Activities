/**
 * Role-Based Access Control (RBAC) Core Module
 * Provides centralized, granular role and permission checks for Olympiad Digital Examination.
 */

export type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

export type Permission =
  | "exam:create"
  | "exam:edit"
  | "exam:delete"
  | "exam:publish"
  | "exam:archive"
  | "exam:view"
  | "exam:attempt"
  | "report:view"
  | "report:download"
  | "users:manage"
  | "questions:manage"
  | "questions:import"
  | "analytics:view"
  | "monitor:view"
  | "settings:manage";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolName?: string;
  grade?: number | string;
  avatarUrl?: string;
  createdAt: string;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "exam:create",
    "exam:edit",
    "exam:delete",
    "exam:publish",
    "exam:archive",
    "exam:view",
    "exam:attempt",
    "report:view",
    "report:download",
    "users:manage",
    "questions:manage",
    "questions:import",
    "analytics:view",
    "monitor:view",
    "settings:manage",
  ],
  TEACHER: [
    "exam:create",
    "exam:edit",
    "exam:view",
    "exam:attempt",
    "report:view",
    "report:download",
    "questions:manage",
    "questions:import",
    "analytics:view",
    "monitor:view",
  ],
  STUDENT: [
    "exam:view",
    "exam:attempt",
    "report:view",
    "report:download",
  ],
};

/**
 * Checks if a specific role has a given permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Checks if a user has all required permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Checks if a user has at least one of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Returns all permissions for a given role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Returns human-readable label for a role
 */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Administrator";
    case "TEACHER":
      return "Examiner / Teacher";
    case "STUDENT":
      return "Candidate / Student";
    default:
      return role;
  }
}

import { UserRole } from "./rbac";

/**
 * Role → route resolution.
 *
 * One place decides where each role lands and what each role may open, so guards, the
 * login redirect and the navigation all agree.
 */

export const LOGIN_ROUTE = "/login";

/** Where a role goes immediately after authenticating. */
export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  TEACHER: "/teacher/dashboard",
  STUDENT: "/student/dashboard",
};

export function homeFor(role: UserRole | undefined | null): string {
  return (role && ROLE_HOME[role]) || LOGIN_ROUTE;
}

/**
 * Route prefixes each role may open.
 *
 * Dashboards are role-private. The shared console tools under /admin (examinations,
 * question bank, students, results, analytics) stay open to teachers, who already hold the
 * permissions for them and whose navigation is filtered by RBAC — but /admin/dashboard is
 * the administrator's own dashboard and is not one of them.
 */
const ACCESS: Record<UserRole, { allow: string[]; deny: string[] }> = {
  SUPER_ADMIN: {
    allow: ["/admin", "/exam", "/results"],
    deny: ["/teacher", "/student"],
  },
  TEACHER: {
    allow: ["/teacher", "/admin", "/exam", "/results"],
    deny: ["/admin/dashboard", "/student"],
  },
  STUDENT: {
    allow: ["/student", "/exam", "/results"],
    deny: ["/admin", "/teacher"],
  },
};

/** Whether a role may open a path. Deny rules win over allow rules. */
export function canAccess(role: UserRole, pathname: string): boolean {
  const rules = ACCESS[role];
  if (!rules) return false;

  const matches = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

  if (rules.deny.some(matches)) return false;
  return rules.allow.some(matches);
}

/** Public routes that never require a session. */
export function isPublicRoute(pathname: string): boolean {
  return pathname === LOGIN_ROUTE || pathname.startsWith(`${LOGIN_ROUTE}/`);
}

import { UserRole, hasPermission } from "./rbac";
import { ROLE_PREFIX, canOpenSection, pathFor, sectionForPath } from "./sections";

/**
 * Route authorization.
 *
 * Every protected path resolves to a decision here — guards, the login redirect and the
 * navigation all consult this one function, so a route cannot be reachable by URL while
 * being hidden in the menu. Access is decided by permission, not by string-matching a
 * role, and route-group ownership is enforced on top of it.
 */

export const LOGIN_ROUTE = "/login";
export const RESTRICTED_ROUTE = "/restricted";

/** Where each role lands after authenticating. */
export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: `${ROLE_PREFIX.SUPER_ADMIN}/dashboard`,
  TEACHER: `${ROLE_PREFIX.TEACHER}/dashboard`,
  STUDENT: `${ROLE_PREFIX.STUDENT}/dashboard`,
};

export function homeFor(role: UserRole | undefined | null): string {
  return (role && ROLE_HOME[role]) || LOGIN_ROUTE;
}

/** Routes reachable without a session. */
export function isPublicRoute(pathname: string): boolean {
  return pathname === LOGIN_ROUTE || pathname.startsWith(`${LOGIN_ROUTE}/`);
}

/**
 * Which role groups a role may enter.
 *
 * A super administrator may inspect every experience — that is the point of the role, and
 * the privileged account relies on it to test all three. A teacher and a student are
 * confined to their own group, so /admin/* is genuinely closed to them rather than merely
 * absent from their menu.
 */
const GROUP_ACCESS: Record<UserRole, UserRole[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
  TEACHER: ["TEACHER"],
  STUDENT: ["STUDENT"],
};

/** The role group a pathname belongs to, or null when it is not group-scoped. */
export function groupForPath(pathname: string): UserRole | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "SUPER_ADMIN";
  if (pathname === "/teacher" || pathname.startsWith("/teacher/")) return "TEACHER";
  if (pathname === "/student" || pathname.startsWith("/student/")) return "STUDENT";
  return null;
}

/** Non-grouped routes that still require a session, with the permission each needs. */
const SHARED_ROUTES: { prefix: string; anyOf: Parameters<typeof hasPermission>[1][] }[] = [
  { prefix: "/exam", anyOf: ["exam:attempt", "exam:view"] },
  { prefix: "/results", anyOf: ["report:view", "report:viewOwn"] },
];

export type AccessDecision =
  | { allowed: true }
  | { allowed: false; reason: "unauthenticated" | "wrong-group" | "no-permission" };

/**
 * The single authorization decision for a pathname.
 *
 * Note this governs *reaching* a route. Record-level ownership — whether this candidate
 * may open this particular result — is enforced separately in the data-access layer,
 * because a route check cannot know which record an id refers to.
 */
export function evaluateRouteAccess(
  role: UserRole | null | undefined,
  pathname: string
): AccessDecision {
  if (isPublicRoute(pathname)) return { allowed: true };
  if (!role) return { allowed: false, reason: "unauthenticated" };

  const group = groupForPath(pathname);

  if (group) {
    if (!GROUP_ACCESS[role]?.includes(group)) {
      return { allowed: false, reason: "wrong-group" };
    }

    // Within a permitted group, the section's own permission still applies. A super
    // administrator inspecting /teacher/* is evaluated against the group's role so the
    // experience matches what that role would actually see.
    const section = sectionForPath(pathname);
    if (section && !canOpenSection(section.id, group)) {
      return { allowed: false, reason: "no-permission" };
    }
    return { allowed: true };
  }

  const shared = SHARED_ROUTES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  );
  if (shared) {
    const permitted = shared.anyOf.some((p) => hasPermission(role, p));
    return permitted ? { allowed: true } : { allowed: false, reason: "no-permission" };
  }

  // Anything else (root, unknown paths) is treated as reachable; the route itself decides.
  return { allowed: true };
}

export function canAccess(role: UserRole, pathname: string): boolean {
  return evaluateRouteAccess(role, pathname).allowed;
}

/** Re-exported so callers have one import for route questions. */
export { pathFor, ROLE_PREFIX };

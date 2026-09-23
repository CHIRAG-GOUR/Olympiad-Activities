import { Permission, UserRole, hasPermission } from "./rbac";

/**
 * Application section registry.
 *
 * Every navigable area of the platform is declared once, with the permission required to
 * open it and the path it occupies inside each role's route group. Navigation, route
 * guards and in-page links all read from here, so a section cannot appear in a menu that
 * the guard would then refuse, and no page needs to hard-code `/admin/...`.
 */

export type SectionId =
  | "dashboard"
  | "exams"
  | "activities"
  | "questions"
  | "questionBank"
  | "subjects"
  | "students"
  | "teachers"
  | "liveMonitor"
  | "results"
  | "analytics"
  | "imports"
  | "settings";

export interface AppSection {
  id: SectionId;
  label: string;
  /** Permission required to open the section at all. */
  permission: Permission;
  /** Route segment inside a role's group, e.g. "exams" → /admin/exams, /teacher/exams. */
  segment: string;
  /** Which role groups mount this section. */
  groups: UserRole[];
  /** Show in the primary navigation (some sections are reachable but not top-level). */
  inNav: boolean;
}

/** Route-group prefix owned by each role. */
export const ROLE_PREFIX: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

export const SECTIONS: AppSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    permission: "exam:view",
    segment: "dashboard",
    groups: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
    inNav: true,
  },
  {
    id: "exams",
    label: "Examinations",
    permission: "exam:view",
    segment: "exams",
    groups: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
    inNav: true,
  },
  {
    id: "activities",
    label: "Activities",
    permission: "activity:view",
    segment: "activities",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "questions",
    label: "Questions",
    permission: "question:view",
    segment: "questions",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "questionBank",
    label: "Question Bank",
    permission: "question:view",
    segment: "question-bank",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "subjects",
    label: "Subjects",
    permission: "subject:manage",
    segment: "subjects",
    groups: ["SUPER_ADMIN"],
    inNav: false,
  },
  {
    id: "students",
    label: "Students",
    permission: "student:view",
    segment: "students",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "teachers",
    label: "Teachers",
    permission: "teacher:manage",
    segment: "teachers",
    groups: ["SUPER_ADMIN"],
    inNav: true,
  },
  {
    id: "liveMonitor",
    label: "Live Monitor",
    permission: "monitor:view",
    segment: "live-monitor",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "results",
    label: "Results",
    permission: "report:view",
    segment: "results",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    permission: "analytics:system",
    segment: "analytics",
    groups: ["SUPER_ADMIN"],
    inNav: true,
  },
  {
    id: "imports",
    label: "Imports",
    permission: "question:import",
    segment: "imports",
    groups: ["SUPER_ADMIN"],
    inNav: true,
  },
  {
    id: "settings",
    label: "Settings",
    permission: "settings:manage",
    segment: "settings",
    groups: ["SUPER_ADMIN"],
    inNav: true,
  },
];

/**
 * Student-facing sections use their own vocabulary — a candidate has "My Results", not a
 * results ledger — and rest on the `*:own` permissions.
 */
const STUDENT_SECTION_OVERRIDES: Partial<Record<SectionId, { label: string; permission: Permission }>> = {
  dashboard: { label: "Dashboard", permission: "exam:view" },
  exams: { label: "Exams", permission: "exam:view" },
  results: { label: "My Results", permission: "result:viewOwn" },
};

const SECTION_BY_ID = new Map(SECTIONS.map((s) => [s.id, s]));

/** The path a section occupies for a given role. */
export function pathFor(id: SectionId, role: UserRole): string {
  const section = SECTION_BY_ID.get(id);
  if (!section) return ROLE_PREFIX[role];
  return `${ROLE_PREFIX[role]}/${section.segment}`;
}

/** Whether a role may open a section, accounting for student-specific permissions. */
export function canOpenSection(id: SectionId, role: UserRole): boolean {
  const section = SECTION_BY_ID.get(id);
  if (!section) return false;

  if (role === "STUDENT") {
    const override = STUDENT_SECTION_OVERRIDES[id];
    if (!override) return false; // students only ever see the overridden set
    return hasPermission(role, override.permission);
  }

  if (!section.groups.includes(role)) return false;
  return hasPermission(role, section.permission);
}

export interface NavEntry {
  id: SectionId;
  label: string;
  href: string;
}

/**
 * Navigation built from permissions rather than filtered after the fact — a role is only
 * ever handed the entries it can actually open.
 */
export function navigationFor(role: UserRole): NavEntry[] {
  if (role === "STUDENT") {
    return (["dashboard", "exams", "results"] as SectionId[])
      .filter((id) => canOpenSection(id, role))
      .map((id) => ({
        id,
        label: STUDENT_SECTION_OVERRIDES[id]?.label ?? SECTION_BY_ID.get(id)!.label,
        href: pathFor(id, role),
      }));
  }

  return SECTIONS.filter((s) => s.inNav && canOpenSection(s.id, role)).map((s) => ({
    id: s.id,
    label: s.label,
    href: pathFor(s.id, role),
  }));
}

/** Resolves a concrete pathname back to the section it belongs to, if any. */
export function sectionForPath(pathname: string): AppSection | null {
  const withoutPrefix = pathname.replace(/^\/(admin|teacher|student)/, "");
  const segment = withoutPrefix.split("/").filter(Boolean)[0];
  if (!segment) return null;
  return SECTIONS.find((s) => s.segment === segment) ?? null;
}

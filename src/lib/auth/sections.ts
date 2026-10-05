import { Permission, UserRole, hasPermission } from "./rbac";

/**
 * Application section registry.
 *
 * Every navigable area of the platform is declared once, with its permission,
 * category grouping, path resolution, and route hierarchy.
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

export type SectionCategory =
  | "CORE"
  | "ACADEMIC"
  | "MONITORING"
  | "PEOPLE"
  | "SYSTEM";

export const CATEGORY_LABELS: Record<SectionCategory, string> = {
  CORE: "Core",
  ACADEMIC: "Academic Bank",
  MONITORING: "Examination Oversight",
  PEOPLE: "Faculty & Students",
  SYSTEM: "System & Config",
};

export interface AppSection {
  id: SectionId;
  label: string;
  category: SectionCategory;
  /** Permission required to open the section at all. */
  permission: Permission;
  /** Route segment inside a role's group, e.g. "exams" → /admin/exams, /teacher/exams. */
  segment: string;
  /** Parent section for sub-routes (e.g. /imports highlights questions). */
  parentSection?: SectionId;
  /** Optional dynamic badge indicator (e.g. live session pulse). */
  badgeKey?: "live" | "new";
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
  // ── Core ───────────────────────────────────────────────────
  {
    id: "dashboard",
    label: "Dashboard",
    category: "CORE",
    permission: "exam:view",
    segment: "dashboard",
    groups: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
    inNav: true,
  },
  {
    id: "exams",
    label: "Examinations",
    category: "CORE",
    permission: "exam:view",
    segment: "exams",
    groups: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
    inNav: true,
  },

  // ── Academic Bank ──────────────────────────────────────────
  {
    id: "activities",
    label: "Activities",
    category: "ACADEMIC",
    permission: "activity:view",
    segment: "activities",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "questions",
    label: "Questions",
    category: "ACADEMIC",
    permission: "question:view",
    segment: "questions",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "questionBank",
    label: "Question Bank",
    category: "ACADEMIC",
    permission: "question:view",
    segment: "question-bank",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "subjects",
    label: "Subjects",
    category: "ACADEMIC",
    permission: "subject:manage",
    segment: "subjects",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "imports",
    label: "Import Questions",
    category: "ACADEMIC",
    parentSection: "questions",
    permission: "question:import",
    segment: "imports",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: false,
  },

  // ── Examination Oversight ──────────────────────────────────
  {
    id: "liveMonitor",
    label: "Live Monitor",
    category: "MONITORING",
    permission: "monitor:view",
    segment: "live-monitor",
    badgeKey: "live",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "results",
    label: "Results & Ledger",
    category: "MONITORING",
    permission: "report:view",
    segment: "results",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    category: "MONITORING",
    permission: "analytics:system",
    segment: "analytics",
    groups: ["SUPER_ADMIN"],
    inNav: true,
  },

  // ── Faculty & Candidates ───────────────────────────────────
  {
    id: "students",
    label: "Students",
    category: "PEOPLE",
    permission: "student:view",
    segment: "students",
    groups: ["SUPER_ADMIN", "TEACHER"],
    inNav: true,
  },
  {
    id: "teachers",
    label: "Teachers",
    category: "PEOPLE",
    permission: "teacher:manage",
    segment: "teachers",
    groups: ["SUPER_ADMIN"],
    inNav: true,
  },

  // ── System & Config ────────────────────────────────────────
  {
    id: "settings",
    label: "Settings",
    category: "SYSTEM",
    permission: "settings:manage",
    segment: "settings",
    groups: ["SUPER_ADMIN"],
    inNav: true,
  },
];

/** Fast O(1) Lookups */
const SECTION_BY_ID = new Map<SectionId, AppSection>(SECTIONS.map((s) => [s.id, s]));
const SECTION_BY_SEGMENT = new Map<string, AppSection>(SECTIONS.map((s) => [s.segment, s]));

/**
 * Student-facing sections use candidate-friendly vocabulary.
 */
const STUDENT_SECTION_OVERRIDES: Partial<Record<SectionId, { label: string; permission: Permission }>> = {
  dashboard: { label: "Dashboard", permission: "exam:view" },
  exams: { label: "My Exams", permission: "exam:view" },
  results: { label: "My Results", permission: "result:viewOwn" },
};

/** The path a section occupies for a given role. */
export function pathFor(id: SectionId, role: UserRole): string {
  const section = SECTION_BY_ID.get(id);
  if (!section) return ROLE_PREFIX[role];
  return `${ROLE_PREFIX[role]}/${section.segment}`;
}

/** Whether a role may open a section, accounting for student-specific permissions. */
export function canOpenSection(id: SectionId, role: UserRole): boolean {
  // Super Admin has full unrestricted access to every section
  if (role === "SUPER_ADMIN") return true;

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
  category: SectionCategory;
  badgeKey?: "live" | "new";
  parentSection?: SectionId;
}

/**
 * Navigation built from permissions rather than filtered after the fact.
 */
export function navigationFor(role: UserRole): NavEntry[] {
  if (role === "STUDENT") {
    return (["dashboard", "exams", "results"] as SectionId[])
      .filter((id) => canOpenSection(id, role))
      .map((id) => {
        const section = SECTION_BY_ID.get(id)!;
        return {
          id,
          label: STUDENT_SECTION_OVERRIDES[id]?.label ?? section.label,
          href: pathFor(id, role),
          category: "CORE",
        };
      });
  }

  return SECTIONS.filter((s) => s.inNav && canOpenSection(s.id, role)).map((s) => ({
    id: s.id,
    label: s.label,
    href: pathFor(s.id, role),
    category: s.category,
    badgeKey: s.badgeKey,
    parentSection: s.parentSection,
  }));
}

/** Resolves a concrete pathname back to the section it belongs to in O(1) time. */
export function sectionForPath(pathname: string): AppSection | null {
  const withoutPrefix = pathname.replace(/^\/(admin|teacher|student)/, "");
  const segment = withoutPrefix.split("/").filter(Boolean)[0];
  if (!segment) return null;
  return SECTION_BY_SEGMENT.get(segment) ?? null;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Standard breadcrumb trail generator for any route.
 */
export function getBreadcrumbsForPath(pathname: string, role: UserRole): BreadcrumbItem[] {
  const base = ROLE_PREFIX[role];
  const section = sectionForPath(pathname);
  if (!section || section.id === "dashboard") {
    return [{ label: "Dashboard", href: `${base}/dashboard` }];
  }

  const crumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: `${base}/dashboard` },
  ];

  if (section.parentSection) {
    const parent = SECTION_BY_ID.get(section.parentSection);
    if (parent) {
      crumbs.push({ label: parent.label, href: pathFor(parent.id, role) });
    }
  }

  crumbs.push({ label: section.label, href: pathFor(section.id, role) });
  return crumbs;
}

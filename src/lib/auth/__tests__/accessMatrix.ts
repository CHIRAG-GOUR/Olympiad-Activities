/**
 * RBAC access matrix verification.
 *
 * Exercises the real authorization functions across every role × route combination and
 * asserts the boundaries the platform depends on: teachers locked out of the admin group,
 * students locked out of both staff groups, the privileged account able to inspect all
 * three, and record-level ownership refusing another candidate's paper.
 *
 * Run with:  npm run verify:rbac
 */
import { evaluateRouteAccess } from "@/lib/auth/roleRoutes";
import { navigationFor } from "@/lib/auth/sections";
import { canSwitchRole, availableRolesFor, hasPermission } from "@/lib/auth/rbac";
import { visibleAttempts, canReadAttempt, scopeFor } from "@/lib/auth/dataAccess";
import type { UserRole } from "@/lib/auth/rbac";

const ROUTES = [
  "/admin/dashboard", "/admin/analytics", "/admin/settings", "/admin/teachers",
  "/admin/imports", "/admin/exams", "/admin/questions", "/admin/question-bank",
  "/teacher/dashboard", "/teacher/exams", "/teacher/questions", "/teacher/questions/new",
  "/teacher/question-bank", "/teacher/students", "/teacher/live-monitor", "/teacher/results",
  "/student/dashboard", "/student/exams", "/student/results",
  "/exam/exam_imo_2024_g6_setb", "/results/att_1",
];

let fail = 0;
const check = (label: string, actual: boolean, expected: boolean) => {
  const ok = actual === expected;
  if (!ok) { fail++; console.log(`  FAIL ${label} → got ${actual}, expected ${expected}`); }
  return ok;
};

for (const role of ["SUPER_ADMIN", "TEACHER", "STUDENT"] as UserRole[]) {
  console.log(`\n=== ${role} ===`);
  const allowed: string[] = [], denied: string[] = [];
  for (const r of ROUTES) {
    (evaluateRouteAccess(role, r).allowed ? allowed : denied).push(r);
  }
  console.log("  allowed:", allowed.join(", ") || "(none)");
  console.log("  DENIED :", denied.join(", ") || "(none)");
  console.log("  nav    :", navigationFor(role).map(n => n.label).join(" | "));
}

console.log("\n=== ASSERTIONS ===");
// Teacher must be locked out of the admin group entirely
for (const r of ["/admin/dashboard","/admin/analytics","/admin/settings","/admin/exams","/admin/teachers"]) {
  check(`TEACHER blocked from ${r}`, evaluateRouteAccess("TEACHER", r).allowed, false);
}
// Student must be locked out of admin and teacher groups
for (const r of ["/admin/dashboard","/admin/questions","/admin/analytics","/teacher/dashboard","/teacher/questions"]) {
  check(`STUDENT blocked from ${r}`, evaluateRouteAccess("STUDENT", r).allowed, false);
}
// Super admin may inspect all three groups
for (const r of ["/admin/dashboard","/teacher/dashboard","/student/dashboard"]) {
  check(`SUPER_ADMIN reaches ${r}`, evaluateRouteAccess("SUPER_ADMIN", r).allowed, true);
}
// Teacher keeps its own group
for (const r of ["/teacher/dashboard","/teacher/questions/new","/teacher/results"]) {
  check(`TEACHER reaches ${r}`, evaluateRouteAccess("TEACHER", r).allowed, true);
}
// Unauthenticated reaches nothing protected
check("no session blocked from /admin/dashboard", evaluateRouteAccess(null, "/admin/dashboard").allowed, false);
check("no session may open /login", evaluateRouteAccess(null, "/login").allowed, true);

// Role switching is account-scoped, not role-scoped
check("pa1 may switch", canSwitchRole("pa1@skillizee.io"), true);
check("PA1 uppercase may switch", canSwitchRole("PA1@Skillizee.io "), true);
check("ordinary teacher may not switch", canSwitchRole("ananya.sen@olympiad.org"), false);
check("pa1 has 3 roles", availableRolesFor("pa1@skillizee.io", "SUPER_ADMIN").length === 3, true);
check("other account has 1 role", availableRolesFor("t@x.io", "TEACHER").length === 1, true);

// Permission separation
check("student lacks result:view", hasPermission("STUDENT", "result:view"), false);
check("student has result:viewOwn", hasPermission("STUDENT", "result:viewOwn"), true);
check("teacher lacks analytics:system", hasPermission("TEACHER", "analytics:system"), false);
check("teacher lacks settings:manage", hasPermission("TEACHER", "settings:manage"), false);
check("teacher may create questions", hasPermission("TEACHER", "question:create"), true);
check("admin has everything", hasPermission("SUPER_ADMIN", "system:configure"), true);

// Data-access ownership
const mine: any = { id: "a1", student: { studentId: "STU-1", name: "Rahul Sharma" } };
const theirs: any = { id: "a2", student: { studentId: "STU-9", name: "Someone Else" } };
const studentScope = scopeFor({ id: "STU-1", email: "r@x.io", name: "Rahul Sharma", role: "STUDENT", createdAt: "" } as any);
const staffScope = scopeFor({ id: "usr_admin_01", email: "pa1@skillizee.io", name: "Chirag Gour", role: "SUPER_ADMIN", createdAt: "" } as any);
check("student reads own attempt", canReadAttempt(studentScope, mine), true);
check("student BLOCKED from other attempt", canReadAttempt(studentScope, theirs), false);
check("staff reads any attempt", canReadAttempt(staffScope, theirs), true);
check("student list narrowed to own", visibleAttempts(studentScope, [mine, theirs]).length === 1, true);
check("staff list unnarrowed", visibleAttempts(staffScope, [mine, theirs]).length === 2, true);

console.log(fail === 0 ? "\n✅ ALL ASSERTIONS PASSED" : `\n❌ ${fail} ASSERTION(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);

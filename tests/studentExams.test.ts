import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Guards against the blank "My Exams" page coming back. It was caused by student screens
 * asking for every student's attempts (refused by the rules) inside a Promise.all, which
 * took the exam list down with it.
 */
const src = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

test("student screens load each data source independently", () => {
  for (const file of ["src/features/StudentExamsScreen.tsx", "src/components/dashboard/DashboardView.tsx"]) {
    const code = src(file);
    const load = code.slice(code.indexOf("async function load"), code.indexOf("load();"));
    assert.match(load, /Promise\.allSettled/, `${file}: first load must use Promise.allSettled`);
    assert.doesNotMatch(load, /Promise\.all\(/, `${file}: one failed read must not blank the page`);
  }
});

test("the student exam list asks only for the student's own attempts", () => {
  assert.match(src("src/features/StudentExamsScreen.tsx"), /listAttempts\(ownerUid \? \{ ownerUid \} : undefined\)/);
});

test("a refused cohort read falls back to the signed-in student's own attempts", () => {
  const code = src("src/repositories/firebase/FirestoreAttemptRepository.ts");
  assert.match(code, /isPermissionDenied\(e\)/);
  assert.match(code, /auth\?\.currentUser\?\.uid/);
});

test("resumable sessions are matched by account, never by name or any session on the device", () => {
  assert.match(src("src/features/StudentExamsScreen.tsx"), /s\.studentId === studentId/);
  assert.match(src("src/components/dashboard/DashboardView.tsx"), /s\.studentId === user\?\.id/);
});

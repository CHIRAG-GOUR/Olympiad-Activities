import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canStudentAccess,
  isAssigned,
  normalizeMaxAttempts,
  mayStartSitting,
  attemptsLeft,
  type PaperAccessState,
} from "@/lib/exam/access";

const paper = (over: Partial<PaperAccessState> = {}): PaperAccessState => ({
  isLocked: true,
  visibleClasses: [6],
  assignedStudents: [],
  legacyAssignedIds: [],
  ...over,
});

const priya = { id: "uid_priya", email: "priya@school.org", name: "Priya", grade: 6 };
const rohan = { id: "uid_rohan", email: "rohan@school.org", name: "Rohan", grade: 7 };

test("a teacher-assigned student sees a paper that is locked for everyone else", () => {
  const p = paper({ assignedStudents: [{ id: "uid_priya", grade: 6, email: "priya@school.org" }] });
  assert.equal(canStudentAccess(p, priya), true);
  assert.equal(canStudentAccess(p, { id: "uid_other", grade: 6 }), false);
});

test("assignment matches by email when the account id differs", () => {
  const p = paper({ assignedStudents: [{ id: "old_id", grade: 6, email: "PRIYA@school.org" }] });
  assert.equal(isAssigned(p, priya), true);
});

test("legacy id-only assignments (email or display name) still match", () => {
  assert.equal(isAssigned(paper({ legacyAssignedIds: ["priya@school.org"] }), priya), true);
  assert.equal(isAssigned(paper({ legacyAssignedIds: ["Priya"] }), priya), true);
  assert.equal(isAssigned(paper({ legacyAssignedIds: ["someone"] }), priya), false);
});

test("an unlocked paper is open only to its classes", () => {
  const p = paper({ isLocked: false, visibleClasses: [6] });
  assert.equal(canStudentAccess(p, priya), true);
  assert.equal(canStudentAccess(p, rohan), false);
});

test("the always-open demo paper is visible to everyone", () => {
  assert.equal(canStudentAccess(paper({ alwaysOpen: true }), rohan), true);
});

test("attempt limits: 1–10, anything else unlimited", () => {
  assert.equal(normalizeMaxAttempts(3), 3);
  assert.equal(normalizeMaxAttempts("10"), 10);
  assert.equal(normalizeMaxAttempts(25), 10);
  assert.equal(normalizeMaxAttempts(0), null);
  assert.equal(normalizeMaxAttempts(null), null);
  assert.equal(normalizeMaxAttempts(undefined), null);
  assert.equal(normalizeMaxAttempts("unlimited"), null);
});

test("a student may start a sitting only while attempts remain; staff are never limited", () => {
  assert.equal(mayStartSitting(2, 0), true);
  assert.equal(mayStartSitting(2, 1), true);
  assert.equal(mayStartSitting(2, 2), false);
  assert.equal(mayStartSitting(null, 50), true);
  assert.equal(mayStartSitting(1, 5, true), true);
  assert.equal(attemptsLeft(3, 1), 2);
  assert.equal(attemptsLeft(3, 7), 0);
  assert.equal(attemptsLeft(null, 7), null);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateTeacherInvitationHtml, generateTeacherInvitationPlainText } from "@/lib/email/invitationTemplate";

const src = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

const data = {
  teacherName: "Ms. Rao",
  teacherEmail: "ms.rao@school.org",
  teacherId: "tea_ms_rao",
  temporaryPassword: "Oly@Ab3!xyz",
  subjectName: "Mathematics",
  assignedClasses: [6, 7],
};

test("the invitation is the themed Olympiad Dashboard email addressed to the entered teacher", () => {
  const html = generateTeacherInvitationHtml(data);
  assert.match(html, /Olympiad Dashboard/);
  assert.match(html, /ms\.rao@school\.org/);
  assert.match(html, /Oly@Ab3!xyz/);
  assert.match(generateTeacherInvitationPlainText(data), /Class 6, Class 7/);
});

test("an existing account is told to use its own password, not a temporary one", () => {
  const html = generateTeacherInvitationHtml({ ...data, existingAccount: true });
  assert.doesNotMatch(html, /Oly@Ab3!xyz/);
  assert.match(html, /existing Olympiad Dashboard password/);
});

test("no part of the faculty flow sends a Firebase password-reset email", () => {
  for (const file of ["src/services/email/TeacherInvitationService.ts", "src/app/admin/teachers/page.tsx"]) {
    const code = src(file);
    assert.doesNotMatch(code, /PASSWORD_RESET/, `${file} sends a password reset`);
    assert.doesNotMatch(code, /sendOobCode|sendPasswordResetEmail|dispatchFirebaseEmail/, `${file} sends a password reset`);
  }
});

test("the invitation is queued only to the invited address", () => {
  const code = src("src/services/email/TeacherInvitationService.ts");
  assert.match(code, /to: \[data\.teacherEmail\]/);
});

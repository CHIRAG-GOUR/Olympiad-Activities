import { test, expect, type Page } from "@playwright/test";

/**
 * The student journey that broke in production: a signed-in student opens My Exams and
 * must see their paper — never "No examination paper assigned yet".
 * Read-only: nothing is started or submitted.
 */

async function signInAsDemoStudent(page: Page) {
  await page.goto("/login");
  // One-click demo candidate card on the sign-in page.
  await page.getByRole("button", { name: /DemoStudent1/ }).first().click();
  await page.waitForURL(/\/student\//, { timeout: 30_000 });
}

test("a student's My Exams page lists their paper", async ({ page }) => {
  await signInAsDemoStudent(page);
  await page.goto("/student/exams");

  await expect(page.getByText("Loading your examination paper")).toHaveCount(0, { timeout: 30_000 });
  await expect(page.getByText("No examination paper assigned yet")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Your Olympiad Examination" })).toBeVisible();
  // The attempts counter added with teacher-set attempt limits.
  await expect(page.getByText(/used · Unlimited|of \d+ used/)).toBeVisible();
  // There is always a way into the paper (or a clear "all attempts used").
  await expect(page.getByText(/Begin Examination|Retake Examination|Resume Exam|All attempts used/).first()).toBeVisible();
});

test("a student's dashboard offers their paper, not someone else's session", async ({ page }) => {
  await signInAsDemoStudent(page);
  await page.goto("/student/dashboard");
  await expect(page.getByText("No examination available yet")).toHaveCount(0, { timeout: 30_000 });
  await expect(page.getByText(/Begin examination|Retake examination|Continue examination/).first()).toBeVisible();
});

test("opening the paper reaches the instructions page, not a lock or an error", async ({ page }) => {
  await signInAsDemoStudent(page);
  await page.goto("/student/exams");
  const enter = page.getByRole("link", { name: /Begin Examination|Retake Examination|Resume Exam/ }).first();
  await expect(enter).toBeVisible({ timeout: 30_000 });
  await enter.click();
  await page.waitForURL(/\/exam/);
  await expect(page.getByText("This examination is not open yet")).toHaveCount(0);
  await expect(page.getByText(/Unable to|could not be/i)).toHaveCount(0);
});

import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests. They run against E2E_BASE_URL — the live site by default, or a local
 * build (`npx serve out` → E2E_BASE_URL=http://localhost:3000).
 *
 * These tests only read: they sign in as a demo student and look at pages. They never
 * start, submit or change anything, so they are safe to run against production.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 20_000 },
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "https://the-olympiad-dashboard.web.app",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

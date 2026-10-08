import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { bootstrapRoleFor } from "@/lib/auth/rbac";

const src = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

test("the login page offers no staff quick-login and shows no staff password", () => {
  const page = src("src/components/auth/LoginExperience.tsx");
  assert.doesNotMatch(page, /"SUPER_ADMIN"\)\}/, "a quick-login button signs in as Super Admin");
  assert.doesNotMatch(page, /787700/);
});

test("only demo students are ever created or signed in automatically", () => {
  const auth = src("src/lib/auth/firebaseAuthService.ts");
  assert.match(auth, /const demoStudent = preset\?\.role === "STUDENT" \? preset : undefined;/);
  assert.doesNotMatch(auth, /createUserWithEmailAndPassword\(auth, normalizedEmail, preset\./);
  assert.doesNotMatch(auth, /defaultPass: "787700"/);
});

test("an address without an account is not a founding administrator", () => {
  // tech@skillizee.io has no sign-in account; while listed, anyone could register it.
  assert.equal(bootstrapRoleFor("tech@skillizee.io"), null);
  assert.doesNotMatch(src("firestore.rules"), /'tech@skillizee\.io'/);
});

#!/usr/bin/env node
/**
 * Creates the Olympiad's staff accounts in Firebase Authentication.
 *
 *   npm run firebase:staff
 *
 * Reads the project's web API key from .env.local, generates a strong password per
 * account, creates it, sets the display name, and prints the credentials once.
 *
 * Accounts that already exist are reported and left alone — running this twice will not
 * reset anybody's password.
 *
 * Requires: Firebase Console → Authentication → Sign-in method → Email/Password enabled.
 */

import { readFileSync } from "node:fs";
import { randomInt } from "node:crypto";
import { resolve } from "node:path";

const STAFF = [
  { email: "Swati123@gmail.com", name: "Swati Ma'am" },
  { email: "aarna@cambridgecourtgroup.com", name: "Aarna" },
  { email: "pa1@skillizee.io", name: "Chirag Gour" },
];

function apiKey() {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (fromEnv) return fromEnv;
  try {
    const file = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const line = file.split(/\r?\n/).find((l) => l.startsWith("NEXT_PUBLIC_FIREBASE_API_KEY="));
    if (line) return line.slice("NEXT_PUBLIC_FIREBASE_API_KEY=".length).trim();
  } catch {
    /* fall through */
  }
  return null;
}

const ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generatePassword(length = 16) {
  // Regenerate until the password is definitely mixed-case with a digit, so it satisfies
  // any password policy configured on the project.
  for (;;) {
    let out = "";
    for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
    if (/[a-z]/.test(out) && /[A-Z]/.test(out) && /[0-9]/.test(out)) return out;
  }
}

async function call(key, method, payload) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${method}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, body: await res.json() };
}

const key = apiKey();
if (!key) {
  console.error("\n  No NEXT_PUBLIC_FIREBASE_API_KEY found in the environment or .env.local.\n");
  process.exit(1);
}

const created = [];
let blocked = false;

console.log("\n  Creating staff accounts in Firebase Authentication\n");

for (const { email, name } of STAFF) {
  const password = generatePassword();
  const { ok, body } = await call(key, "signUp", { email, password, returnSecureToken: true });

  if (ok) {
    await call(key, "update", { idToken: body.idToken, displayName: name, returnSecureToken: false });
    console.log(`  created    ${email.padEnd(34)} uid=${body.localId}`);
    created.push({ email, name, password });
    continue;
  }

  const reason = body?.error?.message ?? "unknown error";
  if (reason.startsWith("EMAIL_EXISTS")) {
    console.log(`  exists     ${email.padEnd(34)} left unchanged`);
  } else if (reason.startsWith("OPERATION_NOT_ALLOWED")) {
    console.log(`  BLOCKED    ${email.padEnd(34)} Email/Password sign-in is disabled`);
    blocked = true;
  } else {
    console.log(`  failed     ${email.padEnd(34)} ${reason}`);
  }
}

if (blocked) {
  console.log(
    "\n  Enable it at:\n" +
      "  https://console.firebase.google.com/project/olympiad-dashboard/authentication/providers\n" +
      "  Authentication → Sign-in method → Email/Password → Enable, then run this again.\n"
  );
  process.exit(1);
}

if (created.length) {
  const line = "=".repeat(74);
  console.log(`\n${line}\n  CREDENTIALS — shown once. Change them after first sign-in.\n${line}`);
  for (const { email, name, password } of created) {
    console.log(`  ${name.padEnd(14)} ${email.padEnd(34)} ${password}`);
  }
  console.log(`${line}\n`);
} else {
  console.log("\n  Nothing to create.\n");
}

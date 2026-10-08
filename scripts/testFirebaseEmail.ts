import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function apiKey() {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (fromEnv) return fromEnv;
  try {
    const file = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const line = file.split(/\r?\n/).find((l) => l.startsWith("NEXT_PUBLIC_FIREBASE_API_KEY="));
    if (line) return line.slice("NEXT_PUBLIC_FIREBASE_API_KEY=".length).trim();
  } catch {}
  return "AIzaSyBRpGwa_39FWQL3fMK1uOJGS_EcK0aRC9Q";
}

const key = apiKey();

async function testAuthDispatch(email: string) {
  console.log(`Testing Firebase Auth user creation and password reset email for: ${email}`);

  // 1. Try to send password reset email via Identity Toolkit REST API
  const sendResetUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${key}`;
  
  let resetRes = await fetch(sendResetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestType: "PASSWORD_RESET",
      email: email,
    }),
  });

  let resetData = await resetRes.json();
  console.log("Direct reset attempt response:", resetData);

  if (resetData.error && resetData.error.message === "EMAIL_NOT_FOUND") {
    console.log("Email not found in Firebase Auth! Provisioning user account first...");

    // 2. Provision account with temporary password
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`;
    const signUpRes = await fetch(signUpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: "TempPassword#2026",
        returnSecureToken: false,
      }),
    });
    const signUpData = await signUpRes.json();
    console.log("Sign up response:", signUpData);

    if (signUpRes.ok || signUpData.error?.message === "EMAIL_EXISTS") {
      console.log("User now exists in Firebase Auth! Re-triggering password reset email...");
      resetRes = await fetch(sendResetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: email,
        }),
      });
      resetData = await resetRes.json();
      console.log("Second reset attempt response:", resetData);
    }
  }

  if (resetData.email) {
    console.log(`SUCCESS! Firebase sent an official password reset email to: ${resetData.email}`);
  }
}

testAuthDispatch("gourchirag101@gmail.com").catch(console.error);

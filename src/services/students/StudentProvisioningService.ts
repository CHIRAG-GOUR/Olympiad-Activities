"use client";

import { db } from "@/services/firebase/config";
import { doc, setDoc, getDocs, query, collection, where, limit } from "firebase/firestore";
import { invalidate } from "@/repositories/cache";
import { logError } from "@/lib/logger";
import { generateStudentPassword, type RosterEntry } from "@/lib/students/roster";

/**
 * Creates student sign-in accounts from a roster.
 *
 * Each account is created through the Identity Toolkit REST endpoint, so the teacher's own
 * session is left alone, and the student's profile is written to `/users/{uid}` with their
 * class and section. Passwords are returned once, for the login cards, and never stored.
 */

export type ProvisionStatus = "created" | "updated" | "failed" | "skipped";

export interface ProvisionResult {
  entry: RosterEntry;
  status: ProvisionStatus;
  uid?: string;
  /** Present only for newly created accounts: the password to hand to the student. */
  password?: string;
  message?: string;
}

function apiKey(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBRpGwa_39FWQL3fMK1uOJGS_EcK0aRC9Q";
}

/** Firebase's per-network sign-up limit: once hit, the rest of the batch cannot succeed now. */
class QuotaError extends Error {}

async function signUp(email: string, password: string): Promise<{ uid?: string; existed: boolean }> {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: false }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok && data.localId) return { uid: data.localId, existed: false };
  const code: string = data?.error?.message || String(res.status);
  if (code === "EMAIL_EXISTS") return { existed: true };
  if (code.startsWith("TOO_MANY_ATTEMPTS") || code.includes("QUOTA")) throw new QuotaError(code);
  throw new Error(code === "INVALID_EMAIL" ? "invalid email address" : code === "WEAK_PASSWORD : Password should be at least 6 characters" ? "password too short" : code);
}

async function findProfile(email: string): Promise<{ id: string; role?: string } | null> {
  if (!db) return null;
  const snap = await getDocs(query(collection(db, "users"), where("email", "==", email), limit(1)));
  const d = snap.docs[0];
  return d ? { id: d.id, role: (d.data() as { role?: string }).role } : null;
}

export async function provisionStudents(
  entries: RosterEntry[],
  onProgress?: (done: number, result: ProvisionResult) => void
): Promise<ProvisionResult[]> {
  if (!db) throw new Error("Student accounts can only be created while connected to Firebase.");
  const firestore = db;
  const results: ProvisionResult[] = [];
  let quotaHit: string | null = null;

  for (const entry of entries) {
    let result: ProvisionResult;
    if (quotaHit) {
      result = { entry, status: "skipped", message: "Not created: Firebase's sign-up limit for this network was reached. Try these again later." };
    } else {
      try {
        const password = entry.password || generateStudentPassword();
        const account = await signUp(entry.email, password);
        const profile = {
          email: entry.email,
          name: entry.name,
          role: "STUDENT",
          grade: entry.grade,
          section: entry.section,
          ...(entry.schoolName ? { schoolName: entry.schoolName } : {}),
          status: "active",
          updatedAt: new Date().toISOString(),
        };
        if (!account.existed && account.uid) {
          await setDoc(doc(firestore, "users", account.uid), {
            id: account.uid,
            ...profile,
            createdAt: new Date().toISOString(),
          });
          result = { entry, status: "created", uid: account.uid, password };
        } else {
          const existing = await findProfile(entry.email);
          if (!existing) {
            result = { entry, status: "failed", message: "This email already has a sign-in account but no profile here. Ask the student to sign in once, then upload again." };
          } else if (existing.role && existing.role !== "STUDENT") {
            result = { entry, status: "failed", message: `This email belongs to a ${existing.role === "TEACHER" ? "teacher" : "administrator"} account, so it was left unchanged.` };
          } else {
            await setDoc(doc(firestore, "users", existing.id), { id: existing.id, ...profile }, { merge: true });
            result = { entry, status: "updated", uid: existing.id, message: "Already registered: class and section updated. Their existing password is unchanged." };
          }
        }
      } catch (err) {
        if (err instanceof QuotaError) {
          quotaHit = err.message;
          result = { entry, status: "skipped", message: "Not created: Firebase's sign-up limit for this network was reached. Try these again later." };
        } else {
          logError("FIRESTORE_WRITE_FAILED", { operation: "provisionStudent", row: entry.row }, err);
          result = { entry, status: "failed", message: err instanceof Error ? err.message : "Could not create this account." };
        }
      }
    }
    results.push(result);
    onProgress?.(results.length, result);
  }

  invalidate("users:");
  return results;
}

import { UserProfile } from "./rbac";

/**
 * Temporary sign-in credentials.
 *
 * ⚠️  THIS IS A SOFT GATE, NOT SECURITY.
 *
 * The application has no backend, so this check runs entirely in the browser. That means:
 *   • the password below ships inside the JavaScript bundle and can be read by anyone
 *     who opens developer tools;
 *   • the gate can be bypassed by editing localStorage.
 *
 * It is here to keep the console behind a deliberate step and to give a named account,
 * exactly as requested — not to protect data. When a real backend (or Firebase Auth,
 * which the repository layer is already shaped for) is wired up, replace
 * `verifyCredentials` with a server call and delete the constant below. Nothing else in
 * the app needs to change.
 */

export interface DemoCredential {
  name: string;
  email: string;
  password: string;
  rolesDescription: string;
  profile: UserProfile;
}

export const TEMPORARY_CREDENTIALS: DemoCredential[] = [
  {
    name: "Swati Ma'am",
    email: "swati@skillizee.io",
    password: "123456",
    rolesDescription: "All 3 Access (Super Admin • Teacher • Student)",
    profile: {
      id: "usr_admin_swati",
      name: "Swati Ma'am",
      email: "swati@skillizee.io",
      role: "SUPER_ADMIN",
      schoolName: "National Olympiad Council",
      createdAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    name: "Chirag Gour",
    email: "pa1@skillizee.io",
    password: "787700",
    rolesDescription: "All 3 Access (Super Admin • Teacher • Student)",
    profile: {
      id: "usr_admin_01",
      name: "Chirag Gour",
      email: "pa1@skillizee.io",
      role: "SUPER_ADMIN",
      schoolName: "National Olympiad Council",
      createdAt: "2024-01-01T00:00:00Z",
    },
  },
];

export type SignInResult =
  | { ok: true; profile: UserProfile }
  | { ok: false; reason: "unknown-email" | "wrong-password" | "empty" };

/** Case-insensitive on the email, exact on the password. */
export function verifyCredentials(email: string, password: string): SignInResult {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !password) return { ok: false, reason: "empty" };

  const match = TEMPORARY_CREDENTIALS.find((c) => c.email.toLowerCase() === trimmedEmail);
  if (!match) return { ok: false, reason: "unknown-email" };
  if (match.password !== password) return { ok: false, reason: "wrong-password" };

  return { ok: true, profile: match.profile };
}

/** The account a successful sign-in lands on, used to seed the user directory. */
export function primaryAccount(): UserProfile {
  return TEMPORARY_CREDENTIALS[0].profile;
}

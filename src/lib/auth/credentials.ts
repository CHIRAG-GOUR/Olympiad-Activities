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

export interface Credential {
  email: string;
  password: string;
  profile: UserProfile;
}

export const TEMPORARY_CREDENTIALS: Credential[] = [
  {
    email: "Swati123@gmail.com",
    password: "787700",
    profile: {
      id: "usr_admin_swati",
      name: "Swati Ma'am",
      email: "Swati123@gmail.com",
      role: "SUPER_ADMIN",
      schoolName: "National Olympiad Council",
      createdAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    email: "aarna@cambridgecourtgroup.com",
    password: "787700",
    profile: {
      id: "usr_admin_aarna",
      name: "Aarna",
      email: "aarna@cambridgecourtgroup.com",
      role: "SUPER_ADMIN",
      schoolName: "Cambridge Court Group",
      createdAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    email: "pa1@skillizee.io",
    password: "787700",
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

/** The default account used to seed the user directory. */
export function primaryAccount(): UserProfile {
  return TEMPORARY_CREDENTIALS[0].profile;
}

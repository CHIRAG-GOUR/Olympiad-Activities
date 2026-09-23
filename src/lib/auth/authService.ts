import { UserProfile, UserRole } from "./rbac";
import { verifyCredentials } from "./credentials";

/**
 * Authentication service.
 *
 * The UI never talks to a credential store directly — it calls this interface. Swapping
 * the local implementation for Firebase Authentication means writing a
 * `FirebaseAuthService` that satisfies `AuthService` and changing the single export at the
 * bottom of this file. No screen, guard or context needs to change.
 */

export interface SignInRequest {
  email: string;
  password: string;
  /** Which experience the person is signing in to. */
  role: UserRole;
}

export type SignInOutcome =
  | { ok: true; profile: UserProfile }
  | { ok: false; code: "empty" | "unknown-email" | "wrong-password"; message: string };

export interface StoredSession {
  profile: UserProfile;
  issuedAt: string;
}

export interface AuthService {
  signIn(request: SignInRequest): Promise<SignInOutcome>;
  signOut(): Promise<void>;
  /** Reads a persisted session without prompting. Returns null when signed out. */
  restore(): Promise<StoredSession | null>;
}

const SESSION_KEY = "olympiad_session_v2";

const MESSAGES: Record<"empty" | "unknown-email" | "wrong-password", string> = {
  empty: "Enter your email and password to continue.",
  "unknown-email": "We do not recognise that email address.",
  "wrong-password": "That password is not correct.",
};

/**
 * Local, browser-only implementation backing the temporary credentials.
 *
 * The selected role decides which experience is opened; the credential authenticates the
 * person. That mirrors how a Firebase custom-claim role resolver will behave once the
 * backend exists.
 */
class LocalAuthService implements AuthService {
  async signIn({ email, password, role }: SignInRequest): Promise<SignInOutcome> {
    // Kept async so callers already handle the latency a real backend will introduce.
    const result = verifyCredentials(email, password);

    if (!result.ok) {
      return { ok: false, code: result.reason, message: MESSAGES[result.reason] };
    }

    const profile: UserProfile = { ...result.profile, role };
    const session: StoredSession = { profile, issuedAt: new Date().toISOString() };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Session simply will not survive a reload if storage is unavailable.
    }

    return { ok: true, profile };
  }

  async signOut(): Promise<void> {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }

  async restore(): Promise<StoredSession | null> {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredSession;
      if (!parsed?.profile?.role) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}

export const authService: AuthService = new LocalAuthService();

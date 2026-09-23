import { UserProfile, UserRole, availableRolesFor } from "./rbac";
import { verifyCredentials } from "./credentials";

/**
 * Authentication service.
 *
 * The UI never talks to a credential store directly — it calls this interface. Swapping
 * the local implementation for Firebase Authentication means writing a
 * `FirebaseAuthService` that satisfies `AuthService` and changing the single export at the
 * bottom of this file. No screen, guard or context needs to change.
 *
 * The account's *assigned* role and the role it is currently *operating as* are stored
 * separately: only a privileged multi-role account can differ between the two, and the
 * service refuses a role the account is not entitled to.
 */

export interface SignInRequest {
  email: string;
  password: string;
  /** Which experience to open. Must be one the account is entitled to. */
  role: UserRole;
}

export type SignInOutcome =
  | { ok: true; profile: UserProfile; activeRole: UserRole }
  | { ok: false; code: "empty" | "unknown-email" | "wrong-password" | "role-not-permitted"; message: string };

export interface StoredSession {
  /** The account as issued, carrying its assigned role. */
  profile: UserProfile;
  /** The role the session is currently operating as. */
  activeRole: UserRole;
  issuedAt: string;
}

export interface AuthService {
  signIn(request: SignInRequest): Promise<SignInOutcome>;
  signOut(): Promise<void>;
  restore(): Promise<StoredSession | null>;
  /** Changes the operating role of the current session. Refused if not entitled. */
  setActiveRole(role: UserRole): Promise<boolean>;
}

const SESSION_KEY = "olympiad_session_v3";

const MESSAGES: Record<
  "empty" | "unknown-email" | "wrong-password" | "role-not-permitted",
  string
> = {
  empty: "Enter your email and password to continue.",
  "unknown-email": "We do not recognise that email address.",
  "wrong-password": "That password is not correct.",
  "role-not-permitted": "This account is not permitted to sign in with that role.",
};

class LocalAuthService implements AuthService {
  private read(): StoredSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredSession;
      if (!parsed?.profile?.email || !parsed?.activeRole) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private write(session: StoredSession) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Session simply will not survive a reload if storage is unavailable.
    }
  }

  async signIn({ email, password, role }: SignInRequest): Promise<SignInOutcome> {
    // Kept async so callers already handle the latency a real backend introduces.
    const result = verifyCredentials(email, password);
    if (!result.ok) {
      return { ok: false, code: result.reason, message: MESSAGES[result.reason] };
    }

    const profile = result.profile;

    // Authorization, not preference: an account may only open a role it is entitled to.
    const entitled = availableRolesFor(profile.email, profile.role);
    if (!entitled.includes(role)) {
      return { ok: false, code: "role-not-permitted", message: MESSAGES["role-not-permitted"] };
    }

    const session: StoredSession = {
      profile,
      activeRole: role,
      issuedAt: new Date().toISOString(),
    };
    this.write(session);

    return { ok: true, profile, activeRole: role };
  }

  async signOut(): Promise<void> {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }

  async restore(): Promise<StoredSession | null> {
    const session = this.read();
    if (!session) return null;

    // Re-check entitlement on restore, so revoking a privileged account's multi-role
    // status takes effect on the next load rather than persisting in an old session.
    const entitled = availableRolesFor(session.profile.email, session.profile.role);
    if (!entitled.includes(session.activeRole)) {
      const corrected: StoredSession = { ...session, activeRole: session.profile.role };
      this.write(corrected);
      return corrected;
    }
    return session;
  }

  async setActiveRole(role: UserRole): Promise<boolean> {
    const session = this.read();
    if (!session) return false;

    const entitled = availableRolesFor(session.profile.email, session.profile.role);
    if (!entitled.includes(role)) return false;

    this.write({ ...session, activeRole: role });
    return true;
  }
}

export const authService: AuthService = new LocalAuthService();

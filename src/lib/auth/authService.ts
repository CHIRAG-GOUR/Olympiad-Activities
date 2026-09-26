import { UserProfile, UserRole } from "./rbac";
import { isRealFirebaseConfigured } from "@/services/firebase/config";
import { FirebaseAuthService } from "./firebaseAuthService";

/**
 * Authentication service.
 *
 * The UI never talks to a credential store directly — it calls this interface. Sign-in is
 * Firebase Authentication; there are no credentials in this repository, and no built-in
 * accounts. Adding, disabling or resetting a person is done in the Firebase console.
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
  getCachedSession?(): StoredSession | null;
  onAuthStateChanged?(callback: (session: StoredSession | null) => void): () => void;
}

/**
 * Stand-in used when Firebase is not configured.
 *
 * It refuses every sign-in rather than falling back to built-in accounts: a hard-coded
 * password would ship inside the JavaScript bundle, and a console that quietly lets
 * anyone in when configuration is missing is worse than one that will not open.
 */
class UnconfiguredAuthService implements AuthService {
  async signIn(): Promise<SignInOutcome> {
    return {
      ok: false,
      code: "unknown-email",
      message:
        "Sign-in is unavailable because Firebase is not configured for this deployment.",
    };
  }
  async signOut(): Promise<void> {}
  async restore(): Promise<StoredSession | null> {
    return null;
  }
  async setActiveRole(): Promise<boolean> {
    return false;
  }
}

export const authService: AuthService = isRealFirebaseConfigured
  ? new FirebaseAuthService()
  : new UnconfiguredAuthService();

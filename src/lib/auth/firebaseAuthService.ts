import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase/config";
import { UserProfile, UserRole, availableRolesFor, bootstrapRoleFor } from "./rbac";
import type { AuthService, SignInRequest, SignInOutcome, StoredSession } from "./authService";

/**
 * Firebase Authentication implementation of `AuthService`.
 *
 * Credentials live in Firebase, not in this repository. A user's role is resolved from a
 * verified custom claim first, because a claim cannot be edited by the user and costs no
 * read; it falls back to their `/users/{uid}` document for accounts whose claim has not
 * been issued yet.
 *
 * Only the *operating* role is kept in local storage — the session itself is Firebase's,
 * so clearing local storage cannot forge one.
 */

const ACTIVE_ROLE_KEY = "olympiad_active_role_v1";

const MESSAGES = {
  empty: "Enter your email and password to continue.",
  "unknown-email": "We do not recognise that email address.",
  "wrong-password": "That password is not correct.",
  "role-not-permitted": "This account is not permitted to sign in with that role.",
} as const;

/** Firebase deliberately blurs "no such user" and "wrong password" to resist probing. */
function mapAuthError(code: string): keyof typeof MESSAGES {
  switch (code) {
    case "auth/invalid-email":
    case "auth/user-not-found":
      return "unknown-email";
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/too-many-requests":
      return "wrong-password";
    default:
      return "wrong-password";
  }
}

const isRole = (v: unknown): v is UserRole =>
  v === "SUPER_ADMIN" || v === "TEACHER" || v === "STUDENT";

export class FirebaseAuthService implements AuthService {
  private readActiveRole(): UserRole | null {
    try {
      const raw = localStorage.getItem(ACTIVE_ROLE_KEY);
      return isRole(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  private writeActiveRole(role: UserRole) {
    try {
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    } catch {
      // The operating role simply resets to the assigned one on the next load.
    }
  }

  /** The signed-in user's profile, preferring the token claim over the user document. */
  private async profileFor(user: FirebaseUser): Promise<UserProfile> {
    let role: UserRole = "STUDENT";
    let claimed = false;
    let documented = false;
    let name = user.displayName ?? "";
    let schoolName: string | undefined;
    let grade: number | string | undefined;

    try {
      const token = await user.getIdTokenResult();
      if (isRole(token.claims.role)) {
        role = token.claims.role;
        claimed = true;
      }
    } catch {
      // Fall through to the user document.
    }

    if (db) {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data() as Partial<UserProfile>;
          if (isRole(data.role)) {
            role = data.role;
            documented = true;
          }
          if (data.name) name = data.name;
          schoolName = data.schoolName;
          grade = data.grade;
        }
      } catch {
        // A denied or offline read must not block sign-in; the claim still governs.
      }
    }

    // Last resort: a founding administrator signing in before any claim or user
    // document exists. Only ever *raises* a role that nothing else has assigned.
    if (!claimed && !documented) {
      const bootstrap = bootstrapRoleFor(user.email);
      if (bootstrap) role = bootstrap;
    }

    return {
      id: user.uid,
      email: user.email ?? "",
      name: name || (user.email ?? "").split("@")[0],
      role,
      schoolName,
      grade,
      createdAt: user.metadata.creationTime ?? new Date().toISOString(),
    };
  }

  /**
   * Keeps `/users/{uid}` in step with the account, so staff screens can list people
   * without a separate directory. Never writes the role — that is the claim's job, and
   * the rules refuse a self-service role change anyway.
   */
  private async touchUserDoc(profile: UserProfile) {
    if (!db) return;
    try {
      const ref = doc(db, "users", profile.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          status: "active",
          createdAt: profile.createdAt,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch {
      // Best effort only.
    }
  }

  async signIn({ email, password, role }: SignInRequest): Promise<SignInOutcome> {
    if (!email?.trim() || !password) {
      return { ok: false, code: "empty", message: MESSAGES.empty };
    }
    if (!auth) {
      return { ok: false, code: "unknown-email", message: "Authentication is not configured." };
    }

    let user: FirebaseUser;
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      user = credential.user;
    } catch (err) {
      const code = mapAuthError((err as { code?: string })?.code ?? "");
      return { ok: false, code, message: MESSAGES[code] };
    }

    const profile = await this.profileFor(user);

    // Authorization, not preference: an account may only open a role it is entitled to.
    const entitled = availableRolesFor(profile.email, profile.role);
    if (!entitled.includes(role)) {
      await firebaseSignOut(auth);
      return {
        ok: false,
        code: "role-not-permitted",
        message: MESSAGES["role-not-permitted"],
      };
    }

    await this.touchUserDoc(profile);
    this.writeActiveRole(role);

    return { ok: true, profile, activeRole: role };
  }

  async signOut(): Promise<void> {
    try {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    } catch {
      // ignore
    }
    if (auth) await firebaseSignOut(auth);
  }

  async restore(): Promise<StoredSession | null> {
    if (!auth) return null;

    // Firebase resolves persisted sessions asynchronously, so wait for the first
    // definite answer rather than reading `currentUser` before it is populated.
    const user = await new Promise<FirebaseUser | null>((resolve) => {
      const stop = onAuthStateChanged(
        auth!,
        (u) => {
          stop();
          resolve(u);
        },
        () => {
          stop();
          resolve(null);
        }
      );
    });

    if (!user) return null;

    const profile = await this.profileFor(user);
    const stored = this.readActiveRole();

    // Re-check entitlement on restore, so revoking a privileged account's multi-role
    // status takes effect on the next load rather than persisting in an old session.
    const entitled = availableRolesFor(profile.email, profile.role);
    const activeRole = stored && entitled.includes(stored) ? stored : profile.role;
    if (activeRole !== stored) this.writeActiveRole(activeRole);

    return { profile, activeRole, issuedAt: new Date().toISOString() };
  }

  async setActiveRole(role: UserRole): Promise<boolean> {
    if (!auth?.currentUser) return false;
    const profile = await this.profileFor(auth.currentUser);
    const entitled = availableRolesFor(profile.email, profile.role);
    if (!entitled.includes(role)) return false;
    this.writeActiveRole(role);
    return true;
  }
}

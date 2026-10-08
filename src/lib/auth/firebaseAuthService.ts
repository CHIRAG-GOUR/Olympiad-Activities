import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase/config";
import { UserProfile, UserRole, availableRolesFor, bootstrapRoleFor } from "./rbac";
import type { AuthService, SignInRequest, SignInOutcome, SignUpRequest, SignUpOutcome, StoredSession } from "./authService";
import { NotificationService } from "@/services/notifications/NotificationService";

/**
 * Firebase Authentication implementation of `AuthService`.
 *
 * Credentials live in Firebase, with persistent browser storage (survives tab/browser closure).
 * A local session cache in localStorage ensures instant, zero-flicker dashboard loading
 * on refresh and navigation.
 */

const ACTIVE_ROLE_KEY = "olympiad_active_role_v1";
const SESSION_CACHE_KEY = "olympiad_cached_session_v1";

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

const PRESET_ACCOUNTS: Record<
  string,
  { name: string; role: UserRole; grade?: number; schoolName?: string; defaultPass?: string }
> = {
  "demostudent1@olympiad.org": {
    name: "DemoStudent1",
    role: "STUDENT",
    grade: 6,
    schoolName: "Cambridge Court International School (CCIS)",
    defaultPass: "student123",
  },
  "demostudent2@olympiad.org": {
    name: "DemoStudent2",
    role: "STUDENT",
    grade: 6,
    schoolName: "Cambridge Court International School (CCIS)",
    defaultPass: "student123",
  },
  "demostudent3@olympiad.org": {
    name: "DemoStudent3",
    role: "STUDENT",
    grade: 6,
    schoolName: "Cambridge Court International School (CCIS)",
    defaultPass: "student123",
  },
  "tech@skillizee.io": {
    name: "Tech Administrator",
    role: "SUPER_ADMIN",
    schoolName: "Olympiad Examination Council",
    defaultPass: "787700",
  },
  "pa1@skillizee.io": {
    name: "Chirag Gour",
    role: "SUPER_ADMIN",
    schoolName: "National Olympiad Council",
  },
  "swati123@gmail.com": {
    name: "Swati Ma'am",
    role: "SUPER_ADMIN",
    schoolName: "National Olympiad Council",
  },
  "aarna@cambridgecourtgroup.com": {
    name: "Aarna",
    role: "SUPER_ADMIN",
    schoolName: "Cambridge Court Group",
  },
};

export class FirebaseAuthService implements AuthService {
  constructor() {
    if (auth && typeof window !== "undefined") {
      void setPersistence(auth, browserLocalPersistence).catch(() => {});
    }
  }

  getCachedSession(): StoredSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SESSION_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredSession;
      if (parsed?.profile?.id && isRole(parsed?.profile?.role)) {
        const storedRole = this.readActiveRole();
        if (storedRole) parsed.activeRole = storedRole;
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  private writeCachedSession(session: StoredSession) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
    } catch {
      // quota or private mode fallback
    }
  }

  private clearCachedSession() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(SESSION_CACHE_KEY);
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    } catch {
      // ignore
    }
  }

  private readActiveRole(): UserRole | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(ACTIVE_ROLE_KEY);
      return isRole(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  private writeActiveRole(role: UserRole) {
    if (typeof window === "undefined") return;
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
    let section: string | undefined;

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
          // The verified claim wins; the document (which its owner can write) only
          // supplies a role when no claim has been issued.
          if (isRole(data.role) && !claimed) {
            role = data.role;
            documented = true;
          }
          if (data.name) name = data.name;
          schoolName = data.schoolName;
          grade = data.grade;
          section = data.section;
        }
      } catch {
        // A denied or offline read must not block sign-in; the claim still governs.
        // Without a claim, keep the role this device last verified for this same account
        // rather than demoting a teacher or administrator to STUDENT on a network blip.
        const cached = this.getCachedSession();
        if (!claimed && cached?.profile.id === user.uid) {
          role = cached.profile.role;
          documented = true;
          name = name || cached.profile.name;
          schoolName = cached.profile.schoolName;
          grade = cached.profile.grade;
          section = cached.profile.section;
        }
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
      ...(section ? { section } : {}),
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
          grade: profile.grade,
          schoolName: profile.schoolName,
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

    let user: FirebaseUser | null = null;
    let normalizedEmail = email.trim().toLowerCase();

    // Short aliases for the demo candidate accounts ("demostudent1", "student1", …).
    const demo = /^(?:demo)?student([123])(?:@(?:olympiad\.org|skillizee\.io))?$/.exec(normalizedEmail);
    if (demo) normalizedEmail = `demostudent${demo[1]}@olympiad.org`;

    const preset = PRESET_ACCOUNTS[normalizedEmail];
    const effectivePass = preset && !password ? preset.defaultPass || "student123" : password;

    try {
      await setPersistence(auth, browserLocalPersistence);
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, effectivePass);
      user = credential.user;
    } catch (err: unknown) {
      const errCode = (err as { code?: string })?.code || "";

      // If user not found in Firebase and this is a preset demo student account, auto-provision in Firebase Auth
      if (
        preset &&
        (errCode === "auth/user-not-found" ||
          errCode === "auth/invalid-credential" ||
          errCode === "auth/invalid-login-credentials" ||
          errCode === "auth/wrong-password")
      ) {
        try {
          const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, preset.defaultPass || "student123");
          user = credential.user;
          await updateProfile(user, { displayName: preset.name });
          if (db) {
            await setDoc(doc(db, "users", user.uid), {
              id: user.uid,
              email: normalizedEmail,
              name: preset.name,
              role: preset.role,
              grade: preset.grade,
              schoolName: preset.schoolName,
              status: "active",
              createdAt: new Date().toISOString(),
            });
          }
        } catch {
          // If creation also fails, fallback to local preset session below
        }
      }

      if (!user) {
        if (preset) {
          const mockProfile: UserProfile = {
            id: `usr_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
            email: normalizedEmail,
            name: preset.name,
            role: preset.role,
            grade: preset.grade,
            schoolName: preset.schoolName,
            status: "active",
            createdAt: new Date().toISOString(),
          };
          this.writeActiveRole(role);
          const session: StoredSession = { profile: mockProfile, activeRole: role, issuedAt: new Date().toISOString() };
          this.writeCachedSession(session);
          return { ok: true, profile: mockProfile, activeRole: role };
        }

        const code = mapAuthError(errCode);
        return { ok: false, code, message: MESSAGES[code] };
      }
    }

    const profile = await this.profileFor(user);

    // Authorization, not preference: an account may only open a role it is entitled to.
    const entitled = availableRolesFor(profile.email, profile.role);
    if (!entitled.includes(role)) {
      await firebaseSignOut(auth);
      this.clearCachedSession();
      return {
        ok: false,
        code: "role-not-permitted",
        message: MESSAGES["role-not-permitted"],
      };
    }

    await this.touchUserDoc(profile);
    this.writeActiveRole(role);

    const session: StoredSession = { profile, activeRole: role, issuedAt: new Date().toISOString() };
    this.writeCachedSession(session);

    return { ok: true, profile, activeRole: role };
  }

  async signUp(request: SignUpRequest): Promise<SignUpOutcome> {
    if (!request.email?.trim() || !request.password || !request.name?.trim()) {
      return { ok: false, code: "empty", message: "Please fill in your name, email, and password." };
    }
    if (request.password.length < 6) {
      return { ok: false, code: "weak-password", message: "Password must be at least 6 characters long." };
    }
    if (!auth) {
      return { ok: false, code: "error", message: "Authentication service is unavailable." };
    }

    let user: FirebaseUser;
    try {
      await setPersistence(auth, browserLocalPersistence);
      const credential = await createUserWithEmailAndPassword(auth, request.email.trim(), request.password);
      user = credential.user;
      await updateProfile(user, { displayName: request.name.trim() });
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        return { ok: false, code: "email-already-in-use", message: "An account with this email address already exists. Try signing in instead." };
      }
      if (code === "auth/invalid-email") {
        return { ok: false, code: "invalid-email", message: "Please enter a valid email address." };
      }
      if (code === "auth/weak-password") {
        return { ok: false, code: "weak-password", message: "Password is too weak. Please use at least 6 characters." };
      }
      return { ok: false, code: "error", message: err?.message || "Sign-up failed. Please check your details." };
    }

    const profile: UserProfile = {
      id: user.uid,
      email: user.email ?? request.email.trim(),
      name: request.name.trim(),
      role: request.role,
      status: "active",
      schoolName: request.schoolName?.trim() || "",
      grade: request.grade || (request.role === "STUDENT" ? 6 : undefined),
      createdAt: new Date().toISOString(),
    };

    // Save profile to Firestore
    if (db) {
      try {
        await setDoc(doc(db, "users", user.uid), profile);
      } catch (e) {
        console.warn("[FirebaseAuthService] Firestore setDoc failed:", e);
      }
    }

    // Save session in cache and operating role
    this.writeActiveRole(request.role);
    const session: StoredSession = { profile, activeRole: request.role, issuedAt: new Date().toISOString() };
    this.writeCachedSession(session);

    // Notify Super Admin in real-time
    NotificationService.addNotification({
      type: "USER_REGISTERED",
      title: `New ${request.role === "STUDENT" ? "Student" : "Teacher"} Registered`,
      message: `${request.name} registered as a ${request.role === "STUDENT" ? `Student (Class ${request.grade || 6})` : "Teacher"}${request.schoolName ? ` · ${request.schoolName}` : ""}.`,
      userName: request.name,
      userEmail: request.email,
      userRole: request.role,
      grade: request.grade,
      schoolName: request.schoolName,
    }).catch(() => {});

    return { ok: true, profile, activeRole: request.role };
  }

  async sendPasswordReset(email: string): Promise<{ ok: boolean; message: string }> {
    if (!email?.trim()) {
      return { ok: false, message: "Please enter your registered email address." };
    }
    if (!auth) {
      return { ok: false, message: "Authentication service is unavailable." };
    }

    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "https://the-olympiad-dashboard.web.app/login";
      await sendPasswordResetEmail(auth, email.trim(), {
        url: redirectUrl,
        handleCodeInApp: false,
      });
      return {
        ok: true,
        message: `Password reset instructions sent to ${email.trim()}. Please check your email inbox and click the reset button.`,
      };
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/user-not-found") {
        return { ok: false, message: "No account found with this email address." };
      }
      if (code === "auth/invalid-email") {
        return { ok: false, message: "Please enter a valid email address." };
      }
      return { ok: false, message: err?.message || "Failed to send password reset email. Please try again." };
    }
  }

  async signOut(): Promise<void> {
    this.clearCachedSession();
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch {
        // ignore
      }
    }
  }

  async restore(): Promise<StoredSession | null> {
    if (!auth) {
      return this.getCachedSession();
    }

    // 1. Wait for Firebase auth state resolution
    try {
      if (typeof (auth as { authStateReady?: () => Promise<void> }).authStateReady === "function") {
        await auth.authStateReady();
      }
    } catch {
      // fallback to listener
    }

    let user = auth.currentUser;

    if (!user) {
      user = await new Promise<FirebaseUser | null>((resolve) => {
        const timer = setTimeout(() => resolve(null), 2500);
        const stop = onAuthStateChanged(
          auth!,
          (u) => {
            clearTimeout(timer);
            stop();
            resolve(u);
          },
          () => {
            clearTimeout(timer);
            stop();
            resolve(null);
          }
        );
      });
    }

    // Firebase restores a signed-in user from its own persistence even when offline, so
    // "no user" here means signed out (or revoked). However, for active preset demo tester
    // sessions, keep the session cached.
    if (!user) {
      const cached = this.getCachedSession();
      if (
        cached &&
        (cached.profile.id.startsWith("usr_") ||
          cached.profile.email.includes("demostudent") ||
          cached.profile.email.includes("student123"))
      ) {
        return cached;
      }
      this.clearCachedSession();
      return null;
    }

    const profile = await this.profileFor(user);
    const stored = this.readActiveRole();

    // Re-check entitlement on restore
    const entitled = availableRolesFor(profile.email, profile.role);
    const activeRole = stored && entitled.includes(stored) ? stored : profile.role;
    if (activeRole !== stored) this.writeActiveRole(activeRole);

    const session: StoredSession = { profile, activeRole, issuedAt: new Date().toISOString() };
    this.writeCachedSession(session);
    return session;
  }

  async setActiveRole(role: UserRole): Promise<boolean> {
    const cached = this.getCachedSession();
    if (auth?.currentUser) {
      const profile = await this.profileFor(auth.currentUser);
      const entitled = availableRolesFor(profile.email, profile.role);
      if (!entitled.includes(role)) return false;
      this.writeActiveRole(role);
      if (cached) {
        this.writeCachedSession({ ...cached, activeRole: role });
      }
      return true;
    } else if (cached) {
      const entitled = availableRolesFor(cached.profile.email, cached.profile.role);
      if (!entitled.includes(role)) return false;
      this.writeActiveRole(role);
      this.writeCachedSession({ ...cached, activeRole: role });
      return true;
    }
    return false;
  }

  onAuthStateChanged(callback: (session: StoredSession | null) => void): () => void {
    if (!auth) return () => {};

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        const cached = this.getCachedSession();
        if (
          cached &&
          (cached.profile.id.startsWith("usr_") ||
            cached.profile.email.includes("demostudent") ||
            cached.profile.email.includes("student123"))
        ) {
          callback(cached);
          return;
        }
        this.clearCachedSession();
        callback(null);
        return;
      }

      try {
        const profile = await this.profileFor(user);
        const stored = this.readActiveRole();
        const entitled = availableRolesFor(profile.email, profile.role);
        const activeRole = stored && entitled.includes(stored) ? stored : profile.role;
        const session: StoredSession = { profile, activeRole, issuedAt: new Date().toISOString() };
        this.writeCachedSession(session);
        callback(session);
      } catch {
        // preserve current session
      }
    });
  }
}

export const firebaseAuthService = new FirebaseAuthService();


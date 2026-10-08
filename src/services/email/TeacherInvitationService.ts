"use client";

import { userRepository } from "@/repositories";
import { UserProfile } from "@/lib/auth/rbac";
import { firebaseAuthService } from "@/lib/auth/firebaseAuthService";
import { db, isRealFirebaseConfigured } from "@/services/firebase/config";
import { doc, setDoc, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { logWarn } from "@/lib/logger";
import {
  generateTeacherInvitationHtml,
  generateTeacherInvitationPlainText,
  TeacherInvitationData,
} from "@/lib/email/invitationTemplate";

const STORAGE_INVITATIONS_KEY = "olympiad_teacher_invitations_v1";

export interface StoredInvitation extends TeacherInvitationData {
  invitationId: string;
  createdAt: string;
  status: "sent" | "delivered" | "pending";
  passwordResetTriggered: boolean;
}

class TeacherInvitationServiceClass {
  private getLocalInvitations(): StoredInvitation[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_INVITATIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalInvitation(inv: StoredInvitation) {
    if (typeof window === "undefined") return;
    try {
      const list = this.getLocalInvitations();
      const next = [inv, ...list.filter((i) => i.teacherEmail !== inv.teacherEmail)];
      localStorage.setItem(STORAGE_INVITATIONS_KEY, JSON.stringify(next));
    } catch {}
  }

  async listInvitations(): Promise<StoredInvitation[]> {
    const local = this.getLocalInvitations();

    if (isRealFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "faculty_invitations"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        const remote: StoredInvitation[] = [];
        snap.forEach((d) => remote.push(d.data() as StoredInvitation));
        if (remote.length > 0) return remote;
      } catch (err) {
        logWarn("FIRESTORE_QUERY_FAILED", { operation: "faculty_invitations.list" }, err);
      }
    }

    return local;
  }

  /**
   * Dispatches teacher invitation in 1 click using Firebase:
   * 1. Provisions account in Firebase Authentication if new.
   * 2. Automatically triggers official password setup email via Firebase Identity Toolkit (with a reset button).
   * 3. Creates/Updates User profile in repository & Firestore /users.
   * 4. Logs to `faculty_invitations` and queues in Firestore `/mail`.
   */
  async inviteTeacher(
    data: TeacherInvitationData,
    options?: { triggerFirebaseReset?: boolean }
  ): Promise<{
    ok: boolean;
    emailSentViaFirebase: boolean;
    invitation: StoredInvitation;
    html: string;
    text: string;
    message: string;
  }> {
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const html = generateTeacherInvitationHtml(data);
    const text = generateTeacherInvitationPlainText(data);
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBRpGwa_39FWQL3fMK1uOJGS_EcK0aRC9Q";
    const normalizedEmail = data.teacherEmail.trim().toLowerCase();
    const tempPassword = data.temporaryPassword.trim() || "OlympiadFaculty#2026";

    let emailSentViaFirebase = false;
    let firebaseStatusNote = "";

    // Step 1: Ensure account exists in Firebase Authentication
    try {
      const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
      const signUpRes = await fetch(signUpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password: tempPassword,
          returnSecureToken: false,
        }),
      });
      const signUpData = await signUpRes.json();
      if (signUpRes.ok || signUpData.error?.message === "EMAIL_EXISTS") {
        firebaseStatusNote = "Account provisioned in Firebase Auth.";
      }
    } catch (e) {
      console.warn("Firebase Auth provisioning error:", e);
    }

    // Step 2: Trigger official email from Firebase directly to user's inbox
    if (options?.triggerFirebaseReset !== false) {
      try {
        const sendResetUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;
        const redirectUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : "https://the-olympiad-dashboard.web.app/login";

        const resetRes = await fetch(sendResetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: normalizedEmail,
            continueUri: redirectUrl,
          }),
        });

        const resetData = await resetRes.json();
        if (resetData.email) {
          emailSentViaFirebase = true;
          firebaseStatusNote = "Official access email sent successfully by Firebase.";
        } else {
          firebaseStatusNote = resetData.error?.message || "Firebase email dispatch pending.";
        }
      } catch (err: any) {
        console.warn("Firebase email dispatch error:", err);
      }
    }

    // Step 3: Ensure User Account exists in platform repository
    const teacherProfile: UserProfile = {
      id: data.teacherId,
      name: data.teacherName.trim(),
      email: normalizedEmail,
      role: "TEACHER",
      createdAt: new Date().toISOString(),
      metadata: {
        subject: data.subjectName,
        assignedClasses: data.assignedClasses,
        temporaryPassword: data.temporaryPassword,
        invitedAt: new Date().toISOString(),
        emailSentViaFirebase,
      },
    };

    try {
      await userRepository.saveUser(teacherProfile);
    } catch (err) {
      console.warn("Could not save teacher profile to user repository:", err);
    }

    const invitation: StoredInvitation = {
      ...data,
      invitationId,
      createdAt: new Date().toISOString(),
      status: "sent",
      passwordResetTriggered: emailSentViaFirebase,
    };

    this.saveLocalInvitation(invitation);

    // Step 4: Save to Firestore if available
    if (isRealFirebaseConfigured && db) {
      try {
        // Save invitation record
        await setDoc(doc(db, "faculty_invitations", invitationId), invitation, { merge: true });

        // Save teacher user record
        await setDoc(
          doc(db, "users", data.teacherId),
          {
            id: data.teacherId,
            email: normalizedEmail,
            name: data.teacherName.trim(),
            role: "TEACHER",
            createdAt: new Date().toISOString(),
            status: "active",
            subject: data.subjectName,
            assignedClasses: data.assignedClasses,
          },
          { merge: true }
        );

        // Queue in mail collection
        await addDoc(collection(db, "mail"), {
          to: [normalizedEmail],
          message: {
            subject: "Official Invitation: Olympiad Dashboard Faculty Access",
            html,
            text,
          },
          createdAt: new Date().toISOString(),
        }).catch(() => {});
      } catch (err) {
        logWarn("FIRESTORE_WRITE_FAILED", { operation: "faculty_invitations.write" }, err);
      }
    }

    return {
      ok: true,
      emailSentViaFirebase,
      invitation,
      html,
      text,
      message: emailSentViaFirebase
        ? `Official invitation email successfully sent to ${data.teacherEmail} via Firebase.`
        : `Faculty account registered (${firebaseStatusNote}).`,
    };
  }

  /**
   * 1-Click re-dispatch of official invitation / password email via Firebase.
   */
  async dispatchFirebaseEmail(email: string): Promise<{ ok: boolean; message: string }> {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBRpGwa_39FWQL3fMK1uOJGS_EcK0aRC9Q";
    const normalized = email.trim().toLowerCase();

    try {
      // 1. Ensure user exists in Firebase Auth
      const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
      await fetch(signUpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          password: "OlympiadPass#2026",
          returnSecureToken: false,
        }),
      });

      // 2. Dispatch email via Firebase
      const sendResetUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : "https://the-olympiad-dashboard.web.app/login";

      const res = await fetch(sendResetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: normalized,
          continueUri: redirectUrl,
        }),
      });

      const data = await res.json();
      if (data.email) {
        return { ok: true, message: `Official email sent to ${normalized} via Firebase!` };
      }
      return { ok: false, message: data.error?.message || "Failed to send email via Firebase." };
    } catch (err: any) {
      return { ok: false, message: err?.message || "Network error contacting Firebase." };
    }
  }
}

export const TeacherInvitationService = new TeacherInvitationServiceClass();


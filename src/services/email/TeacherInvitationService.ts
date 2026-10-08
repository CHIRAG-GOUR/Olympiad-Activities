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
   * Dispatches teacher invitation:
   * 1. Creates/Updates User profile in repository & Firestore.
   * 2. Triggers Firebase Auth password reset email if account exists or requested.
   * 3. Writes message to Firestore `mail` collection (compatible with Firebase Trigger Email extension).
   * 4. Logs to `faculty_invitations` collection.
   */
  async inviteTeacher(
    data: TeacherInvitationData,
    options?: { triggerFirebaseReset?: boolean }
  ): Promise<{
    ok: boolean;
    invitation: StoredInvitation;
    html: string;
    text: string;
    mailtoUrl: string;
    message: string;
  }> {
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const html = generateTeacherInvitationHtml(data);
    const text = generateTeacherInvitationPlainText(data);

    // 1. Ensure User Account exists in the platform repository
    const teacherProfile: UserProfile = {
      id: data.teacherId,
      name: data.teacherName.trim(),
      email: data.teacherEmail.trim().toLowerCase(),
      role: "TEACHER",
      createdAt: new Date().toISOString(),
      metadata: {
        subject: data.subjectName,
        assignedClasses: data.assignedClasses,
        temporaryPassword: data.temporaryPassword,
        invitedAt: new Date().toISOString(),
      },
    };

    try {
      await userRepository.saveUser(teacherProfile);
    } catch (err) {
      console.warn("Could not save teacher profile to user repository:", err);
    }

    // 2. Trigger Firebase Auth Password Reset Email if requested
    let passwordResetTriggered = false;
    if (options?.triggerFirebaseReset !== false) {
      try {
        const res = await firebaseAuthService.sendPasswordReset(data.teacherEmail.trim());
        if (res.ok) passwordResetTriggered = true;
      } catch (err) {
        // Continue even if Firebase Auth account hasn't been created yet
        console.warn("Firebase password reset email dispatch:", err);
      }
    }

    const invitation: StoredInvitation = {
      ...data,
      invitationId,
      createdAt: new Date().toISOString(),
      status: "sent",
      passwordResetTriggered,
    };

    this.saveLocalInvitation(invitation);

    // 3. Save to Firestore if available
    if (isRealFirebaseConfigured && db) {
      try {
        // Save invitation record
        await setDoc(doc(db, "faculty_invitations", invitationId), invitation, { merge: true });

        // Save email document for Trigger Email extension (if configured in Firebase)
        await addDoc(collection(db, "mail"), {
          to: [data.teacherEmail.trim()],
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

    // 4. Construct direct mailto link
    const subject = "Official Invitation: Olympiad Dashboard Faculty Access";
    const mailtoUrl = `mailto:${encodeURIComponent(data.teacherEmail.trim())}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(text)}`;

    return {
      ok: true,
      invitation,
      html,
      text,
      mailtoUrl,
      message: `Invitation generated for ${data.teacherName} (${data.teacherEmail}).`,
    };
  }
}

export const TeacherInvitationService = new TeacherInvitationServiceClass();

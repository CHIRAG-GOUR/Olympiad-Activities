"use client";

import { db, isRealFirebaseConfigured } from "@/services/firebase/config";
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { invalidate } from "@/repositories/cache";
import { logError, logWarn } from "@/lib/logger";
import {
  generateTeacherInvitationHtml,
  generateTeacherInvitationPlainText,
  TeacherInvitationData,
} from "@/lib/email/invitationTemplate";

const STORAGE_INVITATIONS_KEY = "olympiad_teacher_invitations_v1";
const INVITATION_SUBJECT = "Official Invitation: Olympiad Dashboard Faculty Access";

/**
 * Where the invitation is in delivery. `queued` until the mail sender picks it up; the
 * sender (Firebase "Trigger Email" extension on the `mail` collection) then reports
 * `sending`, `sent` or `failed` on the mail document.
 */
export type InvitationDelivery = "queued" | "sending" | "sent" | "failed";

export interface StoredInvitation extends TeacherInvitationData {
  invitationId: string;
  createdAt: string;
  /** Id of the queued message in the `mail` collection. */
  mailId?: string;
  delivery?: InvitationDelivery;
  deliveryError?: string;
  /** Retained for records written before invitations stopped sending password resets. */
  status?: "sent" | "delivered" | "pending";
  passwordResetTriggered?: boolean;
}

export interface InvitationOutcome {
  ok: boolean;
  invitation: StoredInvitation;
  message: string;
}

function apiKey(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBRpGwa_39FWQL3fMK1uOJGS_EcK0aRC9Q";
}

/** The mail extension's delivery state, mapped onto ours. */
function deliveryFrom(mail: { delivery?: { state?: string; error?: string } } | undefined): {
  delivery: InvitationDelivery;
  deliveryError?: string;
} {
  const state = mail?.delivery?.state;
  if (state === "SUCCESS") return { delivery: "sent" };
  if (state === "ERROR") return { delivery: "failed", deliveryError: mail?.delivery?.error };
  if (state === "PROCESSING" || state === "RETRY") return { delivery: "sending" };
  return { delivery: "queued" };
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

  /** Invitations, newest first, each with the current delivery state of its email. */
  async listInvitations(): Promise<StoredInvitation[]> {
    const local = this.getLocalInvitations();

    if (isRealFirebaseConfigured && db) {
      const firestore = db;
      try {
        const q = query(collection(firestore, "faculty_invitations"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        const remote: StoredInvitation[] = [];
        snap.forEach((d) => remote.push(d.data() as StoredInvitation));
        if (remote.length > 0) {
          return Promise.all(
            remote.map(async (inv) => {
              if (!inv.mailId) return inv;
              try {
                const mail = await getDoc(doc(firestore, "mail", inv.mailId));
                return { ...inv, ...deliveryFrom(mail.data() as never) };
              } catch {
                return inv;
              }
            })
          );
        }
      } catch (err) {
        logWarn("FIRESTORE_QUERY_FAILED", { operation: "faculty_invitations.list" }, err);
      }
    }

    return local;
  }

  /**
   * Creates the sign-in account for the address, or reports that one already exists.
   * Uses the REST endpoint so the administrator's own session is left untouched.
   */
  private async provisionAccount(
    email: string,
    password: string
  ): Promise<{ uid?: string; existed: boolean }> {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.localId) return { uid: data.localId, existed: false };
    if (data?.error?.message === "EMAIL_EXISTS") return { existed: true };
    throw new Error(
      data?.error?.message === "INVALID_EMAIL"
        ? `${email} is not a valid email address.`
        : `The sign-in account could not be created (${data?.error?.message || res.status}).`
    );
  }

  /** The `/users` document id of an existing account with this address, if there is one. */
  private async findUserIdByEmail(email: string): Promise<string | undefined> {
    if (!db) return undefined;
    const snap = await getDocs(query(collection(db, "users"), where("email", "==", email), limit(1)));
    return snap.docs[0]?.id;
  }

  /**
   * Invites a teacher in one click:
   *   1. Creates their sign-in account with the temporary password (or finds the existing one).
   *   2. Gives that account the TEACHER role, on the document its sign-in actually reads.
   *   3. Queues the themed Olympiad Dashboard invitation to the address entered — and only
   *      that address. No password-reset email is sent.
   */
  async inviteTeacher(data: TeacherInvitationData): Promise<InvitationOutcome> {
    const normalizedEmail = data.teacherEmail.trim().toLowerCase();
    const tempPassword = data.temporaryPassword.trim() || "OlympiadFaculty#2026";

    const account = await this.provisionAccount(normalizedEmail, tempPassword);
    let uid = account.uid;
    if (account.existed) {
      try {
        uid = await this.findUserIdByEmail(normalizedEmail);
      } catch (err) {
        logWarn("FIRESTORE_QUERY_FAILED", { operation: "users.findByEmail" }, err);
      }
    }

    const invitationData: TeacherInvitationData = {
      ...data,
      teacherEmail: normalizedEmail,
      temporaryPassword: tempPassword,
      // The account already had a password of its own; the generated one was not applied.
      existingAccount: account.existed,
    };

    if (uid && db) {
      try {
        await setDoc(
          doc(db, "users", uid),
          {
            id: uid,
            email: normalizedEmail,
            name: data.teacherName.trim(),
            role: "TEACHER",
            status: "active",
            updatedAt: new Date().toISOString(),
            metadata: {
              subject: data.subjectName,
              assignedClasses: data.assignedClasses,
              teacherCode: data.teacherId,
              invitedAt: new Date().toISOString(),
            },
            ...(account.existed ? {} : { createdAt: new Date().toISOString() }),
          },
          { merge: true }
        );
        invalidate("users:");
      } catch (err) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "users.inviteTeacher" }, err);
        throw new Error("The teacher's account was created, but their teacher role could not be saved. Please try again.");
      }
    }

    const invitation = await this.queueInvitationEmail(invitationData);
    return {
      ok: true,
      invitation,
      message: !uid
        ? `Invitation queued for ${normalizedEmail}, but that address already has a sign-in account with no profile here, so teacher access could not be applied. Ask them to sign in once, then invite again.`
        : account.existed
        ? `${normalizedEmail} already had an account; it now has teacher access and the invitation is queued.`
        : `Invitation queued for ${normalizedEmail}.`,
    };
  }

  /** Sends the same themed invitation again. Never a password reset. */
  async resendInvitation(data: TeacherInvitationData): Promise<InvitationOutcome> {
    const invitation = await this.queueInvitationEmail({
      ...data,
      teacherEmail: data.teacherEmail.trim().toLowerCase(),
    });
    return { ok: true, invitation, message: `Invitation queued again for ${invitation.teacherEmail}.` };
  }

  /** Writes the invitation record and the outgoing message to the `mail` queue. */
  private async queueInvitationEmail(data: TeacherInvitationData): Promise<StoredInvitation> {
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const invitation: StoredInvitation = {
      ...data,
      invitationId,
      mailId: invitationId,
      createdAt: new Date().toISOString(),
      delivery: "queued",
    };

    if (!isRealFirebaseConfigured || !db) {
      this.saveLocalInvitation(invitation);
      throw new Error("Email cannot be sent: the platform is not connected to Firebase.");
    }

    try {
      await setDoc(doc(db, "mail", invitationId), {
        to: [data.teacherEmail],
        message: {
          subject: INVITATION_SUBJECT,
          html: generateTeacherInvitationHtml(data),
          text: generateTeacherInvitationPlainText(data),
        },
        createdAt: new Date().toISOString(),
      });
      await setDoc(doc(db, "faculty_invitations", invitationId), invitation);
    } catch (err) {
      logError("FIRESTORE_WRITE_FAILED", { operation: "mail.queueInvitation" }, err);
      throw new Error("The invitation email could not be queued. Please try again.");
    }

    this.saveLocalInvitation(invitation);
    return invitation;
  }
}

export const TeacherInvitationService = new TeacherInvitationServiceClass();

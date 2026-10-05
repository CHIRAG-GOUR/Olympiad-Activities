"use client";

import { db, isRealFirebaseConfigured } from "@/services/firebase/config";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export interface AdminNotification {
  id: string;
  type: "USER_REGISTERED" | "EXAM_STARTED" | "EXAM_SUBMITTED" | "SYSTEM_ALERT";
  title: string;
  message: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  grade?: number | string;
  schoolName?: string;
  examTitle?: string;
  read: boolean;
  createdAt: string; // ISO
}

const STORAGE_KEY = "olympiad_admin_notifications_v1";

const INITIAL_NOTIFICATIONS: AdminNotification[] = [];

class NotificationServiceClass {
  private listeners: Set<(notifications: AdminNotification[]) => void> = new Set();

  private getLocal(): AdminNotification[] {
    if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  private saveLocal(items: AdminNotification[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
    this.notifyListeners(items);
  }

  private notifyListeners(items: AdminNotification[]) {
    this.listeners.forEach((listener) => {
      try {
        listener(items);
      } catch (err) {
        console.warn("[NotificationService] Listener error:", err);
      }
    });
  }

  async getNotifications(): Promise<AdminNotification[]> {
    if (isRealFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as AdminNotification);
          this.saveLocal(list);
          return list;
        }
      } catch (e) {
        // Fall back to local
      }
    }
    return this.getLocal();
  }

  async addNotification(data: Omit<AdminNotification, "id" | "createdAt" | "read">): Promise<AdminNotification> {
    const newNotif: AdminNotification = {
      ...data,
      id: `notif_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const current = this.getLocal();
    const updated = [newNotif, ...current].slice(0, 50);
    this.saveLocal(updated);

    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "notifications", newNotif.id), newNotif);
      } catch (err) {
        console.warn("[NotificationService] Firestore write failed:", err);
      }
    }

    return newNotif;
  }

  async markAsRead(id: string): Promise<void> {
    const current = this.getLocal();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveLocal(updated);

    if (isRealFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "notifications", id), { read: true });
      } catch {}
    }
  }

  async markAllAsRead(): Promise<void> {
    const current = this.getLocal();
    const updated = current.map((n) => ({ ...n, read: true }));
    this.saveLocal(updated);

    if (isRealFirebaseConfigured && db) {
      try {
        for (const n of current) {
          if (!n.read) {
            updateDoc(doc(db, "notifications", n.id), { read: true }).catch(() => {});
          }
        }
      } catch {}
    }
  }

  async clearAll(): Promise<void> {
    this.saveLocal([]);
  }

  subscribe(callback: (notifications: AdminNotification[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getLocal());

    let firestoreUnsub: (() => void) | null = null;
    if (isRealFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(50));
        firestoreUnsub = onSnapshot(
          q,
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => d.data() as AdminNotification);
              this.saveLocal(list);
              callback(list);
            }
          },
          (err) => {
            console.warn("[NotificationService] Firestore snapshot error:", err);
          }
        );
      } catch {}
    }

    return () => {
      this.listeners.delete(callback);
      if (firestoreUnsub) firestoreUnsub();
    };
  }
}

export const NotificationService = new NotificationServiceClass();

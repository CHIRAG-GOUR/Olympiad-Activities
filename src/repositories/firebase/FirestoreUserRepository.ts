import { IUserRepository } from "../interfaces/IUserRepository";
import { UserProfile, UserRole } from "@/lib/auth/rbac";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { LocalUserRepository } from "../local/LocalUserRepository";

export class FirestoreUserRepository implements IUserRepository {
  private localFallback = new LocalUserRepository();

  async getUser(id: string): Promise<UserProfile | null> {
    if (!db) return this.localFallback.getUser(id);
    try {
      const snap = await getDoc(doc(db, "users", id));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return this.localFallback.getUser(id);
    } catch (e) {
      console.warn("Firestore getUser failed, fallback to local:", e);
      return this.localFallback.getUser(id);
    }
  }

  async listUsers(role?: UserRole): Promise<UserProfile[]> {
    if (!db) return this.localFallback.listUsers(role);
    try {
      const snap = await getDocs(collection(db, "users"));
      if (!snap.empty) {
        let users = snap.docs.map((d) => d.data() as UserProfile);
        if (role) {
          users = users.filter((u) => u.role === role);
        }
        return users;
      }
      return this.localFallback.listUsers(role);
    } catch (e) {
      console.warn("Firestore listUsers failed, fallback to local:", e);
      return this.localFallback.listUsers(role);
    }
  }

  async saveUser(user: UserProfile): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "users", user.id), user);
      } catch (e) {
        console.error("Firestore saveUser failed:", e);
      }
    }
    await this.localFallback.saveUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (e) {
        console.error("Firestore deleteUser failed:", e);
      }
    }
    await this.localFallback.deleteUser(id);
  }

  async countUsers(role?: UserRole): Promise<number> {
    const users = await this.listUsers(role);
    return users.length;
  }
}

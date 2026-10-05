import { IUserRepository } from "../interfaces/IUserRepository";
import { UserProfile, UserRole } from "@/lib/auth/rbac";
import { db } from "@/services/firebase/config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { LocalUserRepository } from "../local/LocalUserRepository";
import { cached, invalidate, CACHE_TTL } from "../cache";
import { logError, logWarn } from "@/lib/logger";

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
      logWarn("FIRESTORE_QUERY_FAILED", { operation: "getUser", id }, e);
      return this.localFallback.getUser(id);
    }
  }

  /**
   * The directory, for staff. Failures are raised rather than answered from this browser's
   * local copy: an empty or stale list presented as "the students" is wrong data.
   */
  async listUsers(role?: UserRole): Promise<UserProfile[]> {
    if (!db) return this.localFallback.listUsers(role);
    const firestore = db;
    const users = await cached("users:all", CACHE_TTL.records, async () => {
      try {
        const snap = await getDocs(collection(firestore, "users"));
        return snap.docs.map((d) => d.data() as UserProfile);
      } catch (e) {
        logError("FIRESTORE_QUERY_FAILED", { operation: "listUsers" }, e);
        throw e;
      }
    });
    return role ? users.filter((u) => u.role === role) : users;
  }

  async saveUser(user: UserProfile): Promise<void> {
    if (db) {
      try {
        await setDoc(doc(db, "users", user.id), user);
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "saveUser", id: user.id }, e);
        throw e;
      }
    }
    await this.localFallback.saveUser(user);
    invalidate("users:");
  }

  async deleteUser(id: string): Promise<void> {
    if (db) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (e) {
        logError("FIRESTORE_WRITE_FAILED", { operation: "deleteUser", id: id }, e);
        throw e;
      }
    }
    await this.localFallback.deleteUser(id);
    invalidate("users:");
  }

  async countUsers(role?: UserRole): Promise<number> {
    const users = await this.listUsers(role);
    return users.length;
  }
}

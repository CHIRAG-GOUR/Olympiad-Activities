"use client";

/**
 * Robust IndexedDB client-side database wrapper for Olympiad Digital Examination.
 * Provides resilient, asynchronous, versioned storage for sessions, attempts, reports, and questions.
 */

const DB_NAME = "OlympiadExamDB";
const DB_VERSION = 2;

export interface DBStores {
  sessions: "exam_sessions";
  attempts: "exam_attempts";
  reports: "exam_reports";
  meta: "exam_meta";
}

export const STORES: DBStores = {
  sessions: "exam_sessions",
  attempts: "exam_attempts",
  reports: "exam_reports",
  meta: "exam_meta",
};

class IndexedDBClient {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB is only available in the browser"));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(STORES.sessions)) {
            const sessionStore = db.createObjectStore(STORES.sessions, { keyPath: "sessionId" });
            sessionStore.createIndex("by_exam_student", ["examId", "studentId"], { unique: false });
            sessionStore.createIndex("by_status", "status", { unique: false });
            sessionStore.createIndex("by_lastSaved", "lastSavedAt", { unique: false });
          }

          if (!db.objectStoreNames.contains(STORES.attempts)) {
            const attemptStore = db.createObjectStore(STORES.attempts, { keyPath: "id" });
            attemptStore.createIndex("by_exam", "examId", { unique: false });
            attemptStore.createIndex("by_student", "student.studentId", { unique: false });
          }

          if (!db.objectStoreNames.contains(STORES.reports)) {
            const reportStore = db.createObjectStore(STORES.reports, { keyPath: "reportId" });
            reportStore.createIndex("by_attempt", "attemptId", { unique: false });
            reportStore.createIndex("by_student", "studentId", { unique: false });
          }

          if (!db.objectStoreNames.contains(STORES.meta)) {
            db.createObjectStore(STORES.meta, { keyPath: "key" });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.error("Failed to open IndexedDB:", request.error);
          reject(request.error);
        };
      });
    }

    return this.dbPromise;
  }

  async get<T>(storeName: keyof DBStores, key: IDBValidKey): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES[storeName], "readonly");
        const store = tx.objectStore(STORES[storeName]);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`[IDB] Read failed for store ${storeName}, key ${String(key)}:`, err);
      // Fallback to localStorage for small items
      return this.fallbackGet<T>(storeName, key);
    }
  }

  async put<T>(storeName: keyof DBStores, value: T): Promise<void> {
    // Exam sessions are the crash-recovery critical record: mirror every write into
    // localStorage synchronously (in addition to IndexedDB), so recovery survives an
    // IndexedDB outage/wipe even when the async IDB write itself succeeded fine. This
    // is a redundant backup, not a replacement — cheap because session records are small.
    if (storeName === "sessions") {
      this.fallbackPut(storeName, value);
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES[storeName], "readwrite");
        const store = tx.objectStore(STORES[storeName]);
        const request = store.put(value);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`[IDB] Put failed for store ${storeName}:`, err);
      this.fallbackPut(storeName, value);
    }
  }

  async getAll<T>(storeName: keyof DBStores): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES[storeName], "readonly");
        const store = tx.objectStore(STORES[storeName]);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`[IDB] GetAll failed for store ${storeName}:`, err);
      return this.fallbackGetAll<T>(storeName);
    }
  }

  async delete(storeName: keyof DBStores, key: IDBValidKey): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES[storeName], "readwrite");
        const store = tx.objectStore(STORES[storeName]);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`[IDB] Delete failed for store ${storeName}:`, err);
      this.fallbackDelete(storeName, key);
    }
  }

  // LocalStorage fallback utilities for resilient degrade mode
  private fallbackGet<T>(storeName: keyof DBStores, key: IDBValidKey): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`idb_fb_${storeName}_${String(key)}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private fallbackGetAll<T>(storeName: keyof DBStores): T[] {
    if (typeof window === "undefined") return [];
    const prefix = `idb_fb_${storeName}_`;
    const out: T[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(prefix)) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
          out.push(JSON.parse(raw));
        } catch {
          // skip corrupted entry
        }
      }
    } catch {
      // localStorage unavailable
    }
    return out;
  }

  private fallbackPut<T>(storeName: keyof DBStores, value: any): void {
    if (typeof window === "undefined") return;
    try {
      const key = value.sessionId || value.id || value.reportId || value.key;
      if (key) {
        localStorage.setItem(`idb_fb_${storeName}_${key}`, JSON.stringify(value));
      }
    } catch {
      // Storage quota or disabled
    }
  }

  private fallbackDelete(storeName: keyof DBStores, key: IDBValidKey): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(`idb_fb_${storeName}_${String(key)}`);
    } catch {
      // Ignore
    }
  }
}

export const idbClient = new IndexedDBClient();

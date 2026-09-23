/**
 * Storage Service Abstraction
 * 
 * Provides unified file handling across Local development/Vercel (in-browser blob/data URL)
 * and Firebase Storage (production asset & report uploads).
 */

import { appConfig } from "@/lib/config/env";
import { storage } from "@/services/firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export interface StorageUploadResult {
  url: string;
  path: string;
  sizeBytes?: number;
}

export interface IStorageService {
  upload(file: Blob | File | string, path: string, metadata?: Record<string, string>): Promise<StorageUploadResult>;
  download(path: string): Promise<Blob | null>;
  delete(path: string): Promise<void>;
  getDownloadUrl(path: string): Promise<string>;
}

export class LocalStorageService implements IStorageService {
  private inMemoryBlobs: Map<string, Blob> = new Map();

  async upload(file: Blob | File | string, path: string): Promise<StorageUploadResult> {
    let blob: Blob;
    if (typeof file === "string") {
      blob = new Blob([file], { type: "text/plain" });
    } else {
      blob = file;
    }

    this.inMemoryBlobs.set(path, blob);

    let url = "";
    if (typeof window !== "undefined" && window.URL) {
      url = window.URL.createObjectURL(blob);
    } else {
      url = `data:application/octet-stream;base64,${path}`;
    }

    return {
      url,
      path,
      sizeBytes: blob.size,
    };
  }

  async download(path: string): Promise<Blob | null> {
    return this.inMemoryBlobs.get(path) || null;
  }

  async delete(path: string): Promise<void> {
    this.inMemoryBlobs.delete(path);
  }

  async getDownloadUrl(path: string): Promise<string> {
    const blob = this.inMemoryBlobs.get(path);
    if (blob && typeof window !== "undefined" && window.URL) {
      return window.URL.createObjectURL(blob);
    }
    return `/mock-storage/${path}`;
  }
}

export class FirebaseStorageService implements IStorageService {
  private localFallback = new LocalStorageService();

  async upload(file: Blob | File | string, path: string, metadata?: Record<string, string>): Promise<StorageUploadResult> {
    if (!storage) {
      return this.localFallback.upload(file, path);
    }

    try {
      const storageRef = ref(storage, path);
      let blob: Blob;
      if (typeof file === "string") {
        blob = new Blob([file], { type: "text/plain" });
      } else {
        blob = file;
      }

      await uploadBytes(storageRef, blob, { customMetadata: metadata });
      const url = await getDownloadURL(storageRef);

      return {
        url,
        path,
        sizeBytes: blob.size,
      };
    } catch (e) {
      console.warn("Firebase Storage upload failed, fallback to local:", e);
      return this.localFallback.upload(file, path);
    }
  }

  async download(path: string): Promise<Blob | null> {
    return this.localFallback.download(path);
  }

  async delete(path: string): Promise<void> {
    if (!storage) return this.localFallback.delete(path);
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (e) {
      console.warn("Firebase Storage delete failed, fallback to local:", e);
      return this.localFallback.delete(path);
    }
  }

  async getDownloadUrl(path: string): Promise<string> {
    if (!storage) return this.localFallback.getDownloadUrl(path);
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (e) {
      return this.localFallback.getDownloadUrl(path);
    }
  }
}

export const storageService: IStorageService =
  appConfig.dataProvider === "firebase"
    ? new FirebaseStorageService()
    : new LocalStorageService();

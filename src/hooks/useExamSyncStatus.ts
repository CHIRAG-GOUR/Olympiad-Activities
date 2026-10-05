"use client";

import { useEffect, useState } from "react";
import { ExamPersistenceService, type SyncSnapshot } from "@/services/persistence/ExamPersistenceService";

function ago(ms: number | null, now: number): string {
  if (!ms) return "";
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.round(s / 60)} min ago`;
}

/**
 * The candidate-facing save indicator.
 *
 *   Saved · just now            everything is in the cloud
 *   Saving…                     a cloud save is in flight
 *   Saved on this device        changes are safe locally; cloud copy follows shortly
 *   Offline · saved 12s ago     no connection; work is safe on this device and will sync
 */
export function useExamSyncStatus(): { tone: "ok" | "pending" | "offline" | "error"; label: string } {
  const [snap, setSnap] = useState<SyncSnapshot>(() => ExamPersistenceService.getSyncSnapshot());
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => ExamPersistenceService.subscribeSync(setSnap), []);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    const tick = setInterval(() => setNow(Date.now()), 5000);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
      clearInterval(tick);
    };
  }, []);

  if (!online || snap.status === "offline") {
    const when = ago(snap.localSavedAt, now);
    return { tone: "offline", label: when ? `Offline · saved ${when}` : "Offline · saving on this device" };
  }
  if (snap.status === "saving") return { tone: "pending", label: "Saving…" };
  if (snap.status === "error") return { tone: "error", label: "Saved on this device · retrying" };
  if (snap.remotePending) return { tone: "pending", label: "Saved on this device" };
  if (snap.remoteSavedAt) return { tone: "ok", label: `Saved · ${ago(snap.remoteSavedAt, now)}` };
  return { tone: "pending", label: "Saved on this device" };
}

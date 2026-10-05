"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { retryPendingSubmissions } from "@/services/exam/SubmissionService";
import { clearRepositoryCache } from "@/repositories/cache";

/**
 * Background delivery of submissions made while offline.
 *
 * A paper submitted without a connection is complete on the candidate's device; this
 * uploads it on the next app start and whenever the connection returns, wherever in the
 * app the candidate happens to be. It also drops cached reads when the signed-in account
 * changes, so nothing loaded for one person is shown to the next.
 */
export function SubmissionSyncAgent() {
  const { user, isReady } = useAuth();
  const uid = user?.id;

  useEffect(() => {
    clearRepositoryCache();
  }, [uid]);

  useEffect(() => {
    if (!isReady || !uid) return;
    const run = () => {
      void retryPendingSubmissions(uid);
    };
    run();
    window.addEventListener("online", run);
    return () => window.removeEventListener("online", run);
  }, [isReady, uid]);

  return null;
}

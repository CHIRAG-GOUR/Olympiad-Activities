"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/auth/roleRoutes";
import { logError } from "@/lib/logger";
import { StatusPanel } from "@/components/feedback/StatusPanel";

/**
 * Route-level error boundary for the whole application.
 *
 * The person stays on the URL they were on; "Try again" re-renders it. Going home is
 * offered as a choice, to the person's own home — never forced, and never to another
 * role's dashboard.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { activeRole, isAuthenticated } = useAuth();

  useEffect(() => {
    logError("UNHANDLED_UI_ERROR", { operation: "route", digest: error.digest }, error);
  }, [error]);

  return (
    <StatusPanel
      title="This page could not be displayed"
      message="Something unexpected went wrong. You can try again, or return to your dashboard."
      actions={[
        { label: isAuthenticated ? "My dashboard" : "Sign in", href: isAuthenticated ? homeFor(activeRole) : "/login" },
        { label: "Try again", onClick: () => reset(), primary: true },
      ]}
    />
  );
}

"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import { logError } from "@/lib/logger";
import { StatusPanel } from "@/components/feedback/StatusPanel";

/**
 * Last-resort boundary for the examination page.
 *
 * Individual activities have their own boundary (one failing question never takes the
 * paper down), so reaching this means the paper shell itself failed to render. The
 * candidate's answers are already saved on this device; "Try again" re-renders the page and
 * the sitting resumes from that save. There is deliberately no "start fresh" here — that
 * deleted the saved sitting and reset the timer.
 */
export default function ExamErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { activeRole } = useAuth();

  useEffect(() => {
    logError("UNHANDLED_UI_ERROR", { operation: "exam-page", digest: error.digest }, error);
  }, [error]);

  return (
    <StatusPanel
      title="The examination page needs to reload"
      message="Something went wrong while displaying the paper. Your answers are saved — choose Try again to continue where you left off."
      actions={[
        { label: "Back to my examinations", href: `${ROLE_PREFIX[activeRole]}/exams` },
        { label: "Try again", onClick: () => reset(), primary: true },
      ]}
    />
  );
}

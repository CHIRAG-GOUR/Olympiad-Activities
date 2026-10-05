"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLoading } from "@/components/auth/AppLoading";

/**
 * Reads the `?id=` of a record route (see `@/lib/routes`) and renders the screen for it.
 *
 * `useSearchParams` must sit under a Suspense boundary in a static export, so every record
 * page goes through here. The child is keyed by id: moving from one record to another
 * remounts the screen instead of carrying the previous record's state across.
 */
function Reader({ render }: { render: (id: string) => React.ReactNode }) {
  const id = useSearchParams().get("id")?.trim() ?? "";
  return <React.Fragment key={id}>{render(id)}</React.Fragment>;
}

export function RecordIdPage({
  render,
  loadingLabel,
}: {
  render: (id: string) => React.ReactNode;
  loadingLabel?: string;
}) {
  return (
    <Suspense fallback={<AppLoading label={loadingLabel} />}>
      <Reader render={render} />
    </Suspense>
  );
}

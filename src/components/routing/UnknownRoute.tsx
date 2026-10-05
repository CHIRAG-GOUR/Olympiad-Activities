"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { homeFor, LOGIN_ROUTE } from "@/lib/auth/roleRoutes";
import { legacyRecordRoute } from "@/lib/routes";
import { logWarn } from "@/lib/logger";
import { AppLoading } from "@/components/auth/AppLoading";
import { StatusPanel } from "@/components/feedback/StatusPanel";

/**
 * What a path with no page of its own shows.
 *
 * Firebase Hosting answers every unknown path with `/index.html` (and `next dev` with the
 * not-found page). Previously that landed on the root redirect and the person was dropped
 * on their dashboard with no explanation. Now:
 *
 *   • a link in the old `/exam/<id>`-style scheme is forwarded to its record page, so old
 *     bookmarks and shared links keep working;
 *   • anything else says plainly that the page does not exist and lets the person choose
 *     where to go. Nothing navigates on its own.
 */
export function UnknownRoute() {
  const router = useRouter();
  const { isReady, isAuthenticated, activeRole } = useAuth();
  const [pathname, setPathname] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const forward = pathname ? legacyRecordRoute(pathname) : null;

  useEffect(() => {
    if (forward) router.replace(forward);
    else if (pathname) logWarn("ROUTE_NOT_FOUND", { operation: "navigate", path: pathname });
  }, [forward, pathname, router]);

  if (!pathname || forward) return <AppLoading label="Opening the page" />;

  const home = isReady && isAuthenticated ? homeFor(activeRole) : LOGIN_ROUTE;
  return (
    <StatusPanel
      tone="notfound"
      title="Page not found"
      message="This address does not match any page in the examination centre. It may have been mistyped or moved."
      actions={[
        { label: "Go back", onClick: () => router.back() },
        { label: isAuthenticated ? "Open my dashboard" : "Sign in", href: home, primary: true },
      ]}
    />
  );
}

"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { evaluateRouteAccess, homeFor, LOGIN_ROUTE } from "@/lib/auth/roleRoutes";
import { AppLoading } from "@/components/auth/AppLoading";
import { AccessRestricted } from "@/components/auth/AccessRestricted";

/**
 * Protected route wrapper.
 *
 * Renders nothing until the session has resolved, then asks the central access decision
 * whether this role may open this path. An unauthenticated visitor is sent to login; a
 * signed-in person who reaches a route outside their entitlement is shown the restricted
 * state rather than silently bounced, so the boundary is visible rather than mysterious.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady, activeRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const decision = evaluateRouteAccess(isAuthenticated ? activeRole : null, pathname);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) router.replace(LOGIN_ROUTE);
  }, [isReady, isAuthenticated, router]);

  if (!isReady) return <AppLoading />;
  if (!isAuthenticated) return <AppLoading label="Taking you to sign in" />;

  if (!decision.allowed) {
    return <AccessRestricted homeHref={homeFor(activeRole)} />;
  }

  return <>{children}</>;
}

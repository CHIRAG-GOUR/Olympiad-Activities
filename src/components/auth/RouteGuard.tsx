"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { canAccess, homeFor, LOGIN_ROUTE } from "@/lib/auth/roleRoutes";
import { AppLoading } from "@/components/auth/AppLoading";

/**
 * Protected route wrapper.
 *
 * Holds rendering until the session has been restored, so a signed-in person never sees
 * the login screen flash and a signed-out person never sees a dashboard paint before the
 * redirect. Roles that reach a route they do not own are sent to their own home.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const permitted = isAuthenticated && canAccess(role, pathname);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace(LOGIN_ROUTE);
      return;
    }
    if (!canAccess(role, pathname)) {
      router.replace(homeFor(role));
    }
  }, [isReady, isAuthenticated, role, pathname, router]);

  if (!isReady || !permitted) return <AppLoading />;

  return <>{children}</>;
}

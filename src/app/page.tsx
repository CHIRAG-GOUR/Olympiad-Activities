"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { homeFor, LOGIN_ROUTE } from "@/lib/auth/roleRoutes";
import { AppLoading } from "@/components/auth/AppLoading";

/**
 * Root.
 *
 * There is no landing or dashboard-selection screen: the root resolves the session and
 * sends the person straight to the login experience or to their own dashboard.
 */
export default function RootEntry() {
  const { isReady, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    router.replace(isAuthenticated ? homeFor(role) : LOGIN_ROUTE);
  }, [isReady, isAuthenticated, role, router]);

  return <AppLoading />;
}

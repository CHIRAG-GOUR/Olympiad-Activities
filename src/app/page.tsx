"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { homeFor, LOGIN_ROUTE } from "@/lib/auth/roleRoutes";
import { AppLoading } from "@/components/auth/AppLoading";
import { UnknownRoute } from "@/components/routing/UnknownRoute";

/**
 * Root.
 *
 * At `/` the root resolves the session and sends the person to sign-in or their own
 * dashboard. Firebase Hosting also serves this page for every path that has no file of its
 * own (the `** → /index.html` rewrite); for those the root must NOT redirect to the
 * dashboard — that silent bounce was the "random return to dashboard" — so it hands over to
 * `UnknownRoute`, which forwards old-style record links and otherwise shows "not found".
 */
export default function RootEntry() {
  const { isReady, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [atRoot, setAtRoot] = useState<boolean | null>(null);

  useEffect(() => {
    setAtRoot(window.location.pathname === "/" || window.location.pathname === "/index.html");
  }, []);

  useEffect(() => {
    if (!atRoot || !isReady) return;
    router.replace(isAuthenticated ? homeFor(role) : LOGIN_ROUTE);
  }, [atRoot, isReady, isAuthenticated, role, router]);

  if (atRoot === false) return <UnknownRoute />;
  return <AppLoading />;
}

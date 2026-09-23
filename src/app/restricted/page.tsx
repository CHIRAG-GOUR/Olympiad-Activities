"use client";

import { useAuth } from "@/context/AuthContext";
import { homeFor, LOGIN_ROUTE } from "@/lib/auth/roleRoutes";
import { AccessRestricted } from "@/components/auth/AccessRestricted";

export default function RestrictedPage() {
  const { isAuthenticated, activeRole } = useAuth();
  return <AccessRestricted homeHref={isAuthenticated ? homeFor(activeRole) : LOGIN_ROUTE} />;
}

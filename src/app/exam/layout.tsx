import React from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";

/** Full-screen record pages still require a session and the route's permission. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RouteGuard>{children}</RouteGuard>;
}

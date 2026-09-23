"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { UserRole, Permission, UserProfile, hasPermission } from "@/lib/auth/rbac";
import { authService, type SignInOutcome } from "@/lib/auth/authService";

export interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  /** False until the persisted session has been read — guards wait on this to avoid flicker */
  isReady: boolean;
  signIn: (email: string, password: string, role: UserRole) => Promise<SignInOutcome>;
  signOut: () => void;
  switchRole: (role: UserRole) => void;
  can: (permission: Permission) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authService
      .restore()
      .then((session) => {
        if (!cancelled && session) setCurrentUser(session.profile);
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string, role: UserRole): Promise<SignInOutcome> => {
      const outcome = await authService.signIn({ email, password, role });
      if (outcome.ok) setCurrentUser(outcome.profile);
      return outcome;
    },
    []
  );

  const signOut = useCallback(() => {
    void authService.signOut();
    setCurrentUser(null);
  }, []);

  /** Re-opens the platform as another role without re-authenticating (demo affordance). */
  const switchRole = useCallback(
    (newRole: UserRole) => {
      if (!currentUser) return;
      const next: UserProfile = { ...currentUser, role: newRole };
      setCurrentUser(next);
      void authService.signIn({
        email: currentUser.email,
        password: "",
        role: newRole,
      });
    },
    [currentUser]
  );

  const role = currentUser?.role ?? "STUDENT";

  const can = useCallback(
    (permission: Permission) => (currentUser ? hasPermission(currentUser.role, permission) : false),
    [currentUser]
  );
  const canAll = useCallback((permissions: Permission[]) => permissions.every(can), [can]);
  const canAny = useCallback((permissions: Permission[]) => permissions.some(can), [can]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: currentUser,
      role,
      isAuthenticated: currentUser !== null,
      isReady,
      signIn,
      signOut,
      switchRole,
      can,
      canAll,
      canAny,
      logout: signOut,
    }),
    [currentUser, role, isReady, signIn, signOut, switchRole, can, canAll, canAny]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { can } = useAuth();
  if (!can(permission)) return <>{fallback}</>;
  return <>{children}</>;
}

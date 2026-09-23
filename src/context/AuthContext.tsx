"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  UserRole,
  Permission,
  UserProfile,
  hasPermission,
  availableRolesFor,
  canSwitchRole as accountCanSwitchRole,
} from "@/lib/auth/rbac";
import { authService, type SignInOutcome } from "@/lib/auth/authService";
import { scopeFor, type AccessScope } from "@/lib/auth/dataAccess";

/**
 * Authentication and authorization context.
 *
 * Exposes the signed-in account, the role it is currently operating as, the roles it is
 * permitted to operate as, and permission predicates. Screens ask questions of this
 * context; none of them compare role strings themselves.
 */
export interface AuthContextType {
  user: UserProfile | null;
  /** The role whose experience is currently rendered. */
  activeRole: UserRole;
  /** Roles this account may operate as — one entry unless it is a privileged tester. */
  availableRoles: UserRole[];
  /** Whether the role switcher should be offered at all. */
  canSwitchRole: boolean;
  isAuthenticated: boolean;
  /** False until the persisted session has been read — guards wait on this. */
  isReady: boolean;
  /** Authorization scope handed to the data-access layer. */
  scope: AccessScope | null;
  signIn: (email: string, password: string, role: UserRole) => Promise<SignInOutcome>;
  signOut: () => void;
  switchRole: (role: UserRole) => void;
  can: (permission: Permission) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  /** Retained alias used by existing call sites. */
  role: UserRole;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>("STUDENT");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authService
      .restore()
      .then((session) => {
        if (cancelled || !session) return;
        setAccount(session.profile);
        setActiveRole(session.activeRole ?? session.profile.role);
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
      if (outcome.ok) {
        setAccount(outcome.profile);
        setActiveRole(outcome.activeRole);
      }
      return outcome;
    },
    []
  );

  const signOut = useCallback(() => {
    void authService.signOut();
    setAccount(null);
    setActiveRole("STUDENT");
  }, []);

  const availableRoles = useMemo(
    () => (account ? availableRolesFor(account.email, account.role) : []),
    [account]
  );

  const canSwitch = useMemo(() => accountCanSwitchRole(account?.email), [account]);

  /**
   * Changes which experience is rendered. Refused unless the account is entitled to the
   * requested role, so this cannot be used to escalate from the console.
   */
  const switchRole = useCallback(
    (nextRole: UserRole) => {
      if (!account) return;
      if (!availableRoles.includes(nextRole)) return;
      setActiveRole(nextRole);
      void authService.setActiveRole(nextRole);
    },
    [account, availableRoles]
  );

  const can = useCallback(
    (permission: Permission) => (account ? hasPermission(activeRole, permission) : false),
    [account, activeRole]
  );
  const canAll = useCallback((permissions: Permission[]) => permissions.every(can), [can]);
  const canAny = useCallback((permissions: Permission[]) => permissions.some(can), [can]);

  const scope = useMemo(
    () => (account ? scopeFor({ ...account, role: activeRole }) : null),
    [account, activeRole]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user: account ? { ...account, role: activeRole } : null,
      activeRole,
      role: activeRole,
      availableRoles,
      canSwitchRole: canSwitch,
      isAuthenticated: account !== null,
      isReady,
      scope,
      signIn,
      signOut,
      switchRole,
      can,
      canAll,
      canAny,
      logout: signOut,
    }),
    [account, activeRole, availableRoles, canSwitch, isReady, scope, signIn, signOut, switchRole, can, canAll, canAny]
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

/** Renders children only when the active role holds the permission. */
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

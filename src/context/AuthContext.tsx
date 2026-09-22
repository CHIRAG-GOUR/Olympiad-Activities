"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { UserRole, Permission, UserProfile, hasPermission, getPermissionsForRole } from "@/lib/auth/rbac";

export interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  can: (permission: Permission) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  loginAs: (user: Partial<UserProfile> & { role: UserRole }) => void;
  logout: () => void;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  SUPER_ADMIN: {
    id: "usr_admin_01",
    name: "Dr. Vikram Sethi",
    email: "admin@olympiad.org",
    role: "SUPER_ADMIN",
    schoolName: "National Olympiad Council",
    createdAt: "2024-01-01T00:00:00Z",
  },
  TEACHER: {
    id: "usr_teacher_01",
    name: "Prof. Ananya Sen",
    email: "ananya.sen@olympiad.org",
    role: "TEACHER",
    schoolName: "Delhi Public School, R.K. Puram",
    createdAt: "2024-02-15T00:00:00Z",
  },
  STUDENT: {
    id: "usr_student_01",
    name: "Rahul Sharma",
    email: "rahul.s@student.olympiad.org",
    role: "STUDENT",
    schoolName: "Kendriya Vidyalaya No. 1",
    grade: 6,
    createdAt: "2024-03-10T00:00:00Z",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USERS.SUPER_ADMIN);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedRole = localStorage.getItem("olympiad_auth_role") as UserRole | null;
      if (savedRole && DEFAULT_USERS[savedRole]) {
        setCurrentUser(DEFAULT_USERS[savedRole]);
      }
    } catch {
      // ignore
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    const newUser = DEFAULT_USERS[newRole] || DEFAULT_USERS.STUDENT;
    setCurrentUser(newUser);
    try {
      localStorage.setItem("olympiad_auth_role", newRole);
    } catch {
      // ignore
    }
  };

  const loginAs = (userData: Partial<UserProfile> & { role: UserRole }) => {
    const base = DEFAULT_USERS[userData.role] || DEFAULT_USERS.STUDENT;
    const merged: UserProfile = {
      ...base,
      ...userData,
      id: userData.id || `usr_${Date.now()}`,
    };
    setCurrentUser(merged);
    try {
      localStorage.setItem("olympiad_auth_role", merged.role);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    switchRole("STUDENT");
  };

  const can = (permission: Permission): boolean => {
    return hasPermission(currentUser.role, permission);
  };

  const canAll = (permissions: Permission[]): boolean => {
    return permissions.every((p) => hasPermission(currentUser.role, p));
  };

  const canAny = (permissions: Permission[]): boolean => {
    return permissions.some((p) => hasPermission(currentUser.role, p));
  };

  const value = useMemo(
    () => ({
      user: currentUser,
      role: currentUser.role,
      isAuthenticated: true,
      switchRole,
      can,
      canAll,
      canAny,
      loginAs,
      logout,
    }),
    [currentUser]
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
  if (!can(permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

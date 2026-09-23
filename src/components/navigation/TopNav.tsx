"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/auth/rbac";
import { ROLE_HOME } from "@/lib/auth/roleRoutes";
import { Bell, ChevronDown, Menu, X, Check, LogOut } from "lucide-react";

/**
 * Platform navigation.
 *
 * A light horizontal bar rather than a permanent coloured sidebar: navigation should
 * recede into the product and give the examination content the full canvas. Items are
 * filtered by role, so students never see administrative destinations.
 */

interface NavItem {
  label: string;
  href: string;
  roles: UserRole[];
  /** Also treat these path prefixes as "this section is active" */
  match?: string[];
}

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "__ROLE_HOME__",
    roles: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
    match: ["/admin/dashboard", "/teacher/dashboard", "/student/dashboard"],
  },
  {
    label: "Examinations",
    href: "/admin/exams",
    roles: ["SUPER_ADMIN", "TEACHER"],
    match: ["/admin/exams", "/admin/live-monitor"],
  },
  // Staff only: the library renders full question text, which candidates must not see.
  { label: "Activities", href: "/admin/activities", roles: ["SUPER_ADMIN", "TEACHER"] },
  {
    label: "Question Bank",
    href: "/admin/question-bank",
    roles: ["SUPER_ADMIN", "TEACHER"],
    match: ["/admin/question-bank", "/admin/questions", "/admin/imports", "/admin/subjects"],
  },
  {
    label: "Students",
    href: "/admin/students",
    roles: ["SUPER_ADMIN", "TEACHER"],
    match: ["/admin/students", "/admin/teachers"],
  },
  { label: "Results", href: "/admin/results", roles: ["SUPER_ADMIN", "TEACHER"] },
  { label: "Analytics", href: "/admin/analytics", roles: ["SUPER_ADMIN", "TEACHER"] },
];

const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

function initials(name: string) {
  return name
    .replace(/(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function TopNav() {
  const pathname = usePathname();
  const { role, user, switchRole, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const items = NAV.filter((i) => i.roles.includes(role)).map((i) =>
    i.href === "__ROLE_HOME__" ? { ...i, href: ROLE_HOME[role] } : i
  );

  // Close the profile menu on outside click / Escape
  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  // Close the mobile sheet whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (item: NavItem) => {
    const prefixes = item.match ?? [item.href];
    return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  };

  return (
    <header className="shrink-0 bg-white/45 backdrop-blur-xl border-b border-white/70 z-30">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-7">
        <div className="h-16 flex items-center gap-3">
          {/* Emblem + wordmark */}
          <Link href={ROLE_HOME[role]} className="flex items-center gap-2.5 shrink-0 group">
            <span className="w-9 h-9 rounded-xl bg-[#2468B2] text-white grid place-items-center font-display font-bold text-lg shadow-subtle group-hover:bg-[#1C5190] transition-colors">
              Ω
            </span>
            <span className="hidden sm:block leading-tight">
              <span className="block text-[14px] font-bold text-[#182338] tracking-[-0.01em]">
                Olympiad
              </span>
              <span className="block text-[11px] text-[#77839A] font-medium">Examination Centre</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-4" aria-label="Main">
            {items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3.5 h-16 flex items-center text-[13.5px] font-semibold transition-colors ${
                    active ? "text-[#2468B2]" : "text-[#667085] hover:text-[#182338]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-3 right-3 bottom-0 h-[2.5px] rounded-t-full transition-opacity ${
                      active ? "bg-[#2468B2] opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {role !== "STUDENT" && (
              <Link
                href="/admin/live-monitor"
                title="Live examination activity"
                className="relative w-10 h-10 grid place-items-center rounded-xl text-[#667085] hover:text-[#182338] hover:bg-white/70 transition-colors"
              >
                <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#F29A38]" />
              </Link>
            )}

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 h-10 pl-1.5 pr-2 rounded-xl border border-[#E1E7EF] bg-white hover:bg-white/70 transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-[#EAF2FC] text-[#2468B2] grid place-items-center text-[11px] font-bold">
                  {initials(user?.name ?? "User")}
                </span>
                <span className="hidden md:block text-left leading-tight pr-0.5">
                  <span className="block text-[12.5px] font-semibold text-[#182338] max-w-[130px] truncate">
                    {user?.name}
                  </span>
                  <span className="block text-[10.5px] text-[#77839A]">{ROLE_LABEL[role]}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#77839A] transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white/95 backdrop-blur-xl border border-white/90 rounded-2xl shadow-dropdown p-1.5 animate-rise-in"
                >
                  <div className="px-3 py-2.5 border-b border-[#E1E7EF] mb-1">
                    <div className="text-[13px] font-semibold text-[#182338] truncate">{user?.name}</div>
                    <div className="text-[11.5px] text-[#77839A] truncate">{user?.email}</div>
                    {user?.schoolName && (
                      <div className="text-[11px] text-[#667085] mt-1 truncate">{user.schoolName}</div>
                    )}
                  </div>

                  <div className="px-3 pt-1 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#77839A]">
                    View platform as
                  </div>
                  {(["SUPER_ADMIN", "TEACHER", "STUDENT"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        switchRole(r);
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        role === r ? "bg-[#EAF2FC] text-[#2468B2] font-semibold" : "text-[#182338] hover:bg-[#F4F7FB]"
                      }`}
                    >
                      {ROLE_LABEL[r]}
                      {role === r && <Check className="w-4 h-4" strokeWidth={2.4} />}
                    </button>
                  ))}

                  <div className="mt-1 pt-1 border-t border-[#E1E7EF]">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 h-9 rounded-lg text-[13px] font-medium text-[#182338] hover:bg-[#E8786A]/10 hover:text-[#C0453C] transition-colors"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2.2} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
              className="lg:hidden w-10 h-10 grid place-items-center rounded-xl border border-[#E1E7EF] text-[#182338] hover:bg-white/70 transition-colors"
            >
              {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation sheet */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t border-white/70 bg-white/85 backdrop-blur-xl px-4 sm:px-6 py-2 animate-rise-in"
          aria-label="Main"
        >
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center h-12 px-3 rounded-xl text-[14px] font-semibold transition-colors ${
                  active ? "bg-[#EAF2FC] text-[#2468B2]" : "text-[#182338] hover:bg-[#F4F7FB]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

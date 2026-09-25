"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole, getRoleLabel, getRoleDescription } from "@/lib/auth/rbac";
import { navigationFor, pathFor } from "@/lib/auth/sections";
import { homeFor } from "@/lib/auth/roleRoutes";
import { Bell, ChevronDown, Menu, Check, LogOut, FlaskConical } from "lucide-react";

/**
 * Slim header above the content region.
 *
 * Navigation itself lives in the rail on the left; this carries the current section's
 * name, live-oversight access and the account menu, plus the control that opens the rail
 * as a drawer on narrow screens.
 */

function initials(name: string) {
  return name
    .replace(/(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, availableRoles, canSwitchRole, user, switchRole, signOut, can } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

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

  // The section's name as this role is offered it — a candidate sees "My Results".
  const current = navigationFor(activeRole)
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  /** Switching role changes the whole experience, so land on that role's own home. */
  const handleSwitchRole = (nextRole: UserRole) => {
    setProfileOpen(false);
    if (nextRole === activeRole) return;
    switchRole(nextRole);
    router.replace(homeFor(nextRole));
  };

  return (
    <header className="shrink-0 h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-white/70 bg-white/35 backdrop-blur-xl z-20">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="lg:hidden w-10 h-10 grid place-items-center rounded-xl border border-white/90 bg-white/65 text-[#182338] hover:bg-white/90 transition-colors"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      <h1 className="text-[15px] sm:text-[16px] font-bold text-[#182338] tracking-[-0.01em] truncate">
        {current?.label ?? "Olympiad"}
      </h1>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Live oversight is a permission, not decoration */}
        {can("monitor:view") && (
          <Link
            href={pathFor("liveMonitor", activeRole)}
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
            className="flex items-center gap-2 h-10 pl-1.5 pr-2 rounded-xl border border-white/90 bg-white/65 hover:bg-white/90 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-[#EAF2FC] text-[#2468B2] grid place-items-center text-[11px] font-bold">
              {initials(user?.name ?? "User")}
            </span>
            <span className="hidden md:block text-left leading-tight pr-0.5">
              <span className="block text-[12.5px] font-semibold text-[#182338] max-w-[130px] truncate">
                {user?.name}
              </span>
              <span className="block text-[10.5px] text-[#77839A]">{getRoleLabel(activeRole)}</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#77839A] transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] w-[268px] bg-white/95 backdrop-blur-xl border border-white/90 rounded-2xl shadow-dropdown p-1.5 animate-rise-in"
            >
              <div className="px-3 py-2.5 border-b border-[#E1E7EF] mb-1">
                <div className="text-[13px] font-semibold text-[#182338] truncate">{user?.name}</div>
                <div className="text-[11.5px] text-[#77839A] truncate">{user?.email}</div>
                <div className="mt-1.5 text-[11px] text-[#667085] leading-snug">
                  {getRoleDescription(activeRole)}
                </div>
              </div>

              {/* Offered only to accounts entitled to more than one role */}
              {canSwitchRole && availableRoles.length > 1 && (
                <>
                  <div className="px-3 pt-1 pb-1.5 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#77839A]">
                    <FlaskConical className="w-3 h-3" />
                    Testing · view as
                  </div>
                  {availableRoles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSwitchRole(r)}
                      className={`w-full flex items-center justify-between gap-2 px-3 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        activeRole === r
                          ? "bg-[#EAF2FC] text-[#2468B2] font-semibold"
                          : "text-[#182338] hover:bg-[#F4F7FB]"
                      }`}
                    >
                      {getRoleLabel(r)}
                      {activeRole === r && <Check className="w-4 h-4" strokeWidth={2.4} />}
                    </button>
                  ))}
                </>
              )}

              <div className="mt-1 pt-1 border-t border-[#E1E7EF]">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 h-9 rounded-lg text-[13px] font-medium text-[#182338] hover:bg-[#E8786A]/10 hover:text-[#B8433F] transition-colors"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2.2} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

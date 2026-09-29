"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole, getRoleLabel, getRoleDescription } from "@/lib/auth/rbac";
import { navigationFor, pathFor } from "@/lib/auth/sections";
import { homeFor } from "@/lib/auth/roleRoutes";
import { Bell, ChevronDown, Menu, Check, LogOut, FlaskConical, UserPlus, RadioTower, CheckCheck, Clock } from "lucide-react";
import { NotificationService, type AdminNotification } from "@/services/notifications/NotificationService";

/**
 * Slim header above the content region.
 *
 * Navigation itself lives in the rail on the left; this carries the current section's
 * name, live-oversight access, the interactive notification center, and the account menu.
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

function timeAgo(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "";
  }
}

export function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, availableRoles, canSwitchRole, user, switchRole, signOut, can } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const unsub = NotificationService.subscribe((list) => {
      setNotifications(list);
    });
    return () => unsub();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!profileOpen && !notifOpen) return;
    const onDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen, notifOpen]);

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

  const handleMarkAsRead = (id: string) => {
    void NotificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    void NotificationService.markAllAsRead();
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

      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-[15px] sm:text-[16px] font-bold text-[#182338] tracking-[-0.01em] truncate">
          {current?.label ?? "Olympiad"}
        </h1>

        {/* Subtle pill indicating simulated role when Super Admin is viewing as Student/Teacher */}
        {canSwitchRole && activeRole !== "SUPER_ADMIN" && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF4E5] text-[#B54708] border border-[#FEDF89]">
            <FlaskConical className="w-3 h-3 text-[#F79009]" />
            Viewing as {getRoleLabel(activeRole)}
          </span>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Interactive Notification Center (Super Admin & Teachers) */}
        {can("monitor:view") && (
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className="relative w-10 h-10 grid place-items-center rounded-xl text-[#667085] hover:text-[#182338] hover:bg-white/70 transition-colors"
            >
              <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E53E3E] text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                role="region"
                aria-label="Admin Notifications"
                className="absolute right-0 top-[calc(100%+8px)] w-[340px] sm:w-[380px] bg-white/95 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-dropdown overflow-hidden z-30 animate-rise-in font-sans"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-[#E1E7EF] flex items-center justify-between bg-white/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#182338]">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FC] text-[#2468B2]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-semibold text-[#2468B2] hover:text-[#1C5190] flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F1F5F9]">
                  {notifications.length === 0 ? (
                    <div className="py-10 px-4 text-center space-y-1.5 text-[#667085]">
                      <Bell className="w-8 h-8 text-[#A0AEC0] mx-auto opacity-40" />
                      <p className="text-xs font-semibold">No notifications right now</p>
                      <p className="text-[11px]">New candidate registrations and events will appear here.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id)}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                          !notif.read ? "bg-[#F8FAFC]" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                            notif.type === "USER_REGISTERED"
                              ? "bg-[#EAF2FC] text-[#2468B2]"
                              : "bg-[#FEF3F2] text-[#D92D20]"
                          }`}
                        >
                          {notif.type === "USER_REGISTERED" ? (
                            <UserPlus className="w-4 h-4" />
                          ) : (
                            <RadioTower className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[12.5px] font-bold text-[#182338] truncate">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-[#8C98A9] font-medium flex items-center gap-1 shrink-0">
                              <Clock className="w-2.5 h-2.5" />
                              {timeAgo(notif.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#475569] leading-snug line-clamp-2">
                            {notif.message}
                          </p>
                          {notif.userRole && (
                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EAF2FC] text-[#2468B2]">
                                {notif.userRole}
                              </span>
                              {notif.grade && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F1F5F9] text-[#475569]">
                                  Class {notif.grade}
                                </span>
                              )}
                              {notif.schoolName && (
                                <span className="text-[10px] text-[#8C98A9] truncate max-w-[140px]">
                                  {notif.schoolName}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#2468B2] shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Link */}
                <div className="p-2 border-t border-[#E1E7EF] bg-white/70">
                  <Link
                    href={pathFor("liveMonitor", activeRole)}
                    onClick={() => setNotifOpen(false)}
                    className="w-full h-8 flex items-center justify-center gap-1.5 text-xs font-bold text-[#2468B2] hover:bg-[#EAF2FC] rounded-lg transition-colors"
                  >
                    <RadioTower className="w-3.5 h-3.5" />
                    <span>Open Live Candidate Monitor</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Menu & Role Switcher */}
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

              {/* Offered ONLY to accounts entitled to switch roles (Super Admin) */}
              {canSwitchRole && availableRoles.length > 1 && (
                <>
                  <div className="px-3 pt-1 pb-1.5 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#77839A]">
                    <FlaskConical className="w-3 h-3 text-[#2468B2]" />
                    Super Admin · View / Login As
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
                      <span>{getRoleLabel(r)}</span>
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

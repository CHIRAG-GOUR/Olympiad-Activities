"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SideNav } from "@/components/navigation/SideNav";
import { TopBar } from "@/components/navigation/TopBar";
import { AmbientField } from "@/components/ui/AmbientField";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { useAuth } from "@/context/AuthContext";
import { getRoleLabel } from "@/lib/auth/rbac";
import { homeFor } from "@/lib/auth/roleRoutes";
import { X, ShieldAlert, ArrowLeft } from "lucide-react";

/**
 * Platform shell.
 *
 * A frosted application window floating on the ambient field, split into a navigation
 * rail and one scrolling content region. Below `lg` the rail becomes a drawer, since a
 * permanent rail would take too much of a phone's width; on phones the window's inset
 * collapses so it uses the full screen.
 */
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, canSwitchRole, switchRole } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  // Navigating should never leave the drawer covering the page it just opened.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const handleReturnToAdmin = () => {
    switchRole("SUPER_ADMIN");
    router.replace(homeFor("SUPER_ADMIN"));
  };

  return (
    <RouteGuard>
      <div className="h-dvh overflow-hidden font-sans text-[#182338] antialiased">
        <AmbientField />

        <div className="h-full p-0 sm:p-3 lg:p-4 xl:p-5">
          <div
            className="
              h-full flex overflow-hidden
              bg-white/55 backdrop-blur-2xl
              border-y sm:border border-white/70
              sm:rounded-[22px] lg:rounded-[26px]
              shadow-[0_1px_0_0_rgba(255,255,255,0.75)_inset,0_18px_50px_-12px_rgba(38,45,90,0.22),0_4px_14px_-6px_rgba(38,45,90,0.12)]
            "
          >
            {/* Permanent rail from lg upwards */}
            <aside className="hidden lg:block w-[244px] shrink-0">
              <SideNav />
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
              {/* Simulation Banner for Super Admin */}
              {canSwitchRole && activeRole !== "SUPER_ADMIN" && (
                <div className="shrink-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-xs z-30">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-200" />
                    <span>
                      Viewing platform as <strong>{getRoleLabel(activeRole)}</strong> (Super Admin Simulation)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleReturnToAdmin}
                    className="px-2.5 py-0.5 rounded-md bg-white text-orange-800 hover:bg-orange-50 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Super Admin</span>
                  </button>
                </div>
              )}

              <TopBar onOpenNav={() => setNavOpen(true)} />

              <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-7 py-6 sm:py-7 lg:py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Drawer for narrow screens */}
        {navOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="absolute inset-0 bg-[#182338]/35 backdrop-blur-sm animate-fade-in"
            />
            <div className="absolute inset-y-0 left-0 w-[260px] max-w-[82vw] bg-white/85 backdrop-blur-2xl shadow-2xl animate-slide-in-left">
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Close navigation"
                className="absolute top-3.5 right-3 w-9 h-9 grid place-items-center rounded-lg text-[#667085] hover:bg-white/80 z-10"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
              <SideNav onNavigate={() => setNavOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

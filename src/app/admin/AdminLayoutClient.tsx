"use client";

import React from "react";
import { TopNav } from "@/components/navigation/TopNav";
import { AmbientField } from "@/components/ui/AmbientField";
import { RouteGuard } from "@/components/auth/RouteGuard";

/**
 * Platform shell.
 *
 * A frosted application window floating on the ambient field: inset from the viewport
 * edges, translucent, with the navigation fused to its top edge and one scrolling content
 * region beneath. On phones the inset collapses so the window uses the full screen —
 * a floating frame would waste too much width there.
 */
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <div className="h-dvh overflow-hidden font-sans text-[#182338] antialiased">
        <AmbientField />

        <div className="h-full p-0 sm:p-3 lg:p-4 xl:p-5">
          <div
            className="
              h-full flex flex-col overflow-hidden
              bg-white/55 backdrop-blur-2xl
              border-y sm:border border-white/70
              sm:rounded-[22px] lg:rounded-[26px]
              shadow-[0_1px_0_0_rgba(255,255,255,0.75)_inset,0_18px_50px_-12px_rgba(38,45,90,0.22),0_4px_14px_-6px_rgba(38,45,90,0.12)]
            "
          >
            <TopNav />

            <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-7 py-6 sm:py-7 lg:py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

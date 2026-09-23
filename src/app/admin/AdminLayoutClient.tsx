"use client";

import React from "react";
import { TopNav } from "@/components/navigation/TopNav";

/**
 * Platform shell.
 *
 * Viewport-height flex column: a light top navigation that stays put, and a single
 * scrolling content region below it. Content is laid out directly on the page canvas
 * rather than inside one giant white panel, so each section can breathe.
 */
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh bg-[#F4F7FB] flex flex-col overflow-hidden font-sans text-[#182338] antialiased">
      <TopNav />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 py-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}

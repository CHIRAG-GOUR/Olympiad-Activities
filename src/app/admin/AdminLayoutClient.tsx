"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    // Fixed to the viewport height with the scrolling handled entirely by <main>, the same
    // proven shell used on the exam screen. The previous version capped <main> at
    // max-h-screen but also gave the inner white card `overflow-hidden` together with a
    // `min-h-[calc(100vh-64px)]` flex-column box — a combination that, once a page's content
    // (like the dashboard) grew past one screen, could clip the overflow instead of letting
    // it scroll. Padding now lives on a plain block wrapper *inside* the scroll container,
    // so nothing above it constrains how tall a page's content is allowed to get.
    <div className="h-dvh bg-[#F4F7EE] flex flex-row overflow-hidden font-sans text-[#172033] antialiased">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1550px] mx-auto bg-white rounded-3xl border border-[#DDE4D7] shadow-sm overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

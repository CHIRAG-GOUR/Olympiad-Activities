"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F7EE] flex flex-row font-sans text-[#172033] antialiased">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[1550px] mx-auto bg-white rounded-3xl border border-[#DDE4D7] shadow-sm min-h-[calc(100vh-64px)] flex flex-col overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

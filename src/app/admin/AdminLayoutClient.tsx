"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneDashboard = pathname === "/admin/dashboard";

  if (isStandaloneDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F7EE] flex flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-[calc(100vw-240px)]">
        {children}
      </main>
    </div>
  );
}

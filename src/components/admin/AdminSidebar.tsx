"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck2,
  HelpCircle,
  Database,
  BookOpen,
  Users,
  Activity,
  Award,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Exams", href: "/admin/exams", icon: FileCheck2 },
  { label: "Questions", href: "/admin/questions", icon: HelpCircle },
  { label: "Question Bank", href: "/admin/question-bank", icon: Database },
  { label: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Live Monitor", href: "/admin/live-monitor", icon: Activity },
  { label: "Results", href: "/admin/results", icon: Award },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Imports", href: "/admin/imports", icon: FileSpreadsheet },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-[#547322] border-r border-[#435C1B] text-white flex flex-col justify-between flex-shrink-0 h-screen sticky top-0 shadow-xl z-20 font-sans">
      {/* Header with Olympiad Academic Emblem */}
      <div>
        <div className="h-[76px] px-5 border-b border-[#435C1B] flex items-center gap-3 bg-[#4D691F]">
          {/* Academic Crest */}
          <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0 shadow-xs border border-white/20 relative overflow-hidden backdrop-blur-xs">
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 3L6 7V14C6 20.5 10.3 26.5 16 29C21.7 26.5 26 20.5 26 14V7L16 3Z"
                fill="#F4C400"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <path
                d="M16 8L18 12.5L23 13L19 16.5L20.2 21.5L16 19L11.8 21.5L13 16.5L9 13L14 12.5L16 8Z"
                fill="#547322"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="text-[14px] font-extrabold tracking-tight text-white uppercase leading-tight truncate">
              Olympiad Council
            </div>
            <div className="text-[11px] font-semibold text-white/75 tracking-normal flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9E34B]" />
              Faculty Portal
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 h-[42px] rounded-xl text-[14px] font-semibold transition-all ${
                  isActive
                    ? "bg-white text-[#3E5519] font-bold shadow-md shadow-black/10"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    isActive ? "text-[#547322]" : "text-white/70"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Settings & Student Link */}
      <div className="p-3 border-t border-[#435C1B] bg-[#4D691F]/70 space-y-2">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3.5 h-[40px] rounded-xl text-[14px] font-semibold transition-all ${
            pathname === "/admin/settings"
              ? "bg-white text-[#3E5519] font-bold"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Settings className="w-[18px] h-[18px] text-white/70" />
          <span>System Settings</span>
        </Link>

        <Link
          href="/"
          className="flex items-center justify-between px-3.5 h-[42px] bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-[13px] font-bold text-white transition-all shadow-xs backdrop-blur-xs"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFE066]" />
            Student Portal
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-white/70" />
        </Link>
      </div>
    </aside>
  );
}

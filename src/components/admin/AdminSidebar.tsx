"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileCheck2,
  HelpCircle,
  Database,
  Users,
  Activity,
  Award,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  GraduationCap,
  UserCheck,
  Layers,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { role, user } = useAuth();

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isTeacher = role === "TEACHER";

  return (
    <aside className="w-[260px] bg-[#4D741F] border-r border-[#355415] text-white flex flex-col justify-between flex-shrink-0 h-screen sticky top-0 shadow-lg z-20 font-sans select-none">
      {/* Header with Official Olympiad Emblem */}
      <div>
        <div className="h-[76px] px-5 border-b border-[#355415]/70 flex items-center gap-3 bg-[#3E5F19]">
          <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0 shadow-xs border border-white/20">
            <ShieldCheck className="w-6 h-6 text-[#F4C400]" />
          </div>

          <div className="min-w-0">
            <div className="text-[13px] font-extrabold tracking-tight text-white uppercase leading-tight truncate">
              Olympiad Council
            </div>
            <div className="text-[11px] font-semibold text-white/80 tracking-normal flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#A9E34B] animate-pulse" />
              <span>{isSuperAdmin ? "Super Admin Portal" : isTeacher ? "Faculty Portal" : "Student Portal"}</span>
            </div>
          </div>
        </div>

        {/* Structured Navigation Groups (Requirement 2 & 46) */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          {/* Main Dashboard */}
          <div>
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-3 px-3.5 h-[40px] rounded-xl text-[13px] font-bold transition-all ${
                pathname === "/admin/dashboard"
                  ? "bg-white text-[#355415] shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${pathname === "/admin/dashboard" ? "text-[#4D741F]" : "text-white/70"}`} />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* EXAMINATIONS GROUP */}
          <div className="space-y-1">
            <div className="px-3.5 text-[10px] font-black uppercase tracking-wider text-white/50">
              Examinations
            </div>
            <Link
              href="/admin/exams"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/exams"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-white/70" />
              <span>All Examinations</span>
            </Link>

            <Link
              href="/admin/exams/new"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/exams/new"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-white/70" />
              <span>Create Examination</span>
            </Link>

            <Link
              href="/admin/live-monitor"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/live-monitor"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4 text-white/70" />
              <span>Live Monitor</span>
            </Link>
          </div>

          {/* QUESTIONS GROUP */}
          <div className="space-y-1">
            <div className="px-3.5 text-[10px] font-black uppercase tracking-wider text-white/50">
              Questions
            </div>
            <Link
              href="/admin/questions"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/questions"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-white/70" />
              <span>Question Repository</span>
            </Link>

            <Link
              href="/admin/question-bank"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/question-bank"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Database className="w-4 h-4 text-white/70" />
              <span>Question Bank</span>
            </Link>

            <Link
              href="/admin/imports"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/imports"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-white/70" />
              <span>Import Questions</span>
            </Link>
          </div>

          {/* PEOPLE GROUP */}
          <div className="space-y-1">
            <div className="px-3.5 text-[10px] font-black uppercase tracking-wider text-white/50">
              People
            </div>
            <Link
              href="/admin/students"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/students"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-white/70" />
              <span>Students</span>
            </Link>

            {isSuperAdmin && (
              <Link
                href="/admin/teachers"
                className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                  pathname === "/admin/teachers"
                    ? "bg-white text-[#355415] font-bold shadow-sm"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4 text-white/70" />
                <span>Teachers</span>
              </Link>
            )}
          </div>

          {/* RESULTS & ANALYTICS GROUP */}
          <div className="space-y-1">
            <div className="px-3.5 text-[10px] font-black uppercase tracking-wider text-white/50">
              Evaluation
            </div>
            <Link
              href="/admin/results"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/results"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4 text-white/70" />
              <span>Results & Reports</span>
            </Link>

            <Link
              href="/admin/analytics"
              className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
                pathname === "/admin/analytics"
                  ? "bg-white text-[#355415] font-bold shadow-sm"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-white/70" />
              <span>Analytics</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer / System Settings & Student Portal Link */}
      <div className="p-3 border-t border-[#355415]/70 bg-[#3E5F19]/60 space-y-2">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3.5 h-[38px] rounded-xl text-[13px] font-semibold transition-all ${
            pathname === "/admin/settings"
              ? "bg-white text-[#355415] font-bold"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4 text-white/70" />
          <span>System Settings</span>
        </Link>

        <Link
          href="/"
          className="flex items-center justify-between px-3.5 h-[38px] bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-[12px] font-bold text-white transition-all shadow-xs"
        >
          <span className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#F4C400]" />
            Candidate Portal
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-white/70" />
        </Link>
      </div>
    </aside>
  );
}

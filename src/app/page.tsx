"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { examRepository, attemptRepository, reportRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import { ExamAttempt } from "@/types/attempt";
import { useAuth } from "@/context/AuthContext";
import {
  FileCheck2,
  LayoutDashboard,
  Play,
  Award,
  Activity,
  ArrowRight,
  BookOpen,
  Layers,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  History,
  FileText,
} from "lucide-react";

export default function GatewayHomePage() {
  const { role, user, switchRole } = useAuth();

  const [exams, setExams] = useState<Exam[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ex, atts] = await Promise.all([
          examRepository.listExams(),
          attemptRepository.listAttempts(),
        ]);
        setExams(ex);
        setRecentAttempts(atts);
      } catch (err) {
        console.error("Failed to load gateway data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-between font-sans antialiased text-slate-900 select-none">
      {/* Platform Header */}
      <header className="bg-[#0B4F8A] border-b-2 border-[#083863] sticky top-0 z-30 shadow-md text-white">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white text-[#0B4F8A] flex items-center justify-center flex-shrink-0 shadow font-black text-xl">
              &Omega;
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                National & International Examination Council
              </div>
              <div className="text-[18px] font-black leading-tight tracking-tight">
                OLYMPIAD DIGITAL EXAMINATION PORTAL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-1 border border-white/20 text-xs font-bold">
              <span className="text-white/70 px-2 uppercase text-[10px]">Active Role:</span>
              {(["STUDENT", "TEACHER", "SUPER_ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    role === r
                      ? "bg-white text-[#0B4F8A] font-black shadow-xs"
                      : "text-white/80 hover:bg-white/15"
                  }`}
                >
                  {r === "STUDENT" ? "Student" : r === "TEACHER" ? "Teacher" : "SuperAdmin"}
                </button>
              ))}
            </div>

            {role !== "STUDENT" ? (
              <Link
                href="/admin/dashboard"
                className="h-[42px] px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-950" />
                <span>Admin & Operations Desk</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-white/90 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>{user?.name || "Rahul Sharma"} (Class 6)</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Portal Hub */}
      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        
        {/* Banner Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-slate-300 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Official Examination Session Environment
            </span>
            <span className="text-xs text-slate-500 font-semibold">• 2024–25 Academic Cycle</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Interactive Digital Olympiad Examination
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl font-medium">
            Standardized Olympiad assessment environment featuring interactive laboratory simulations, rotational spatial reasoning, coordinate geometry plotting, and deterministic algorithmic evaluation backed by continuous IndexedDB crash recovery.
          </p>
        </div>

        {/* Dual Portal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active & Scheduled Examinations (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#0B4F8A]" />
                <h2 className="text-lg font-black text-slate-900">Official Examination Papers</h2>
              </div>
              <span className="text-xs text-[#0B4F8A] font-bold font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-300">
                {exams.length} Active Paper{exams.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white border-2 border-slate-300 hover:border-[#0B4F8A] rounded-2xl p-6 shadow-sm transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-extrabold text-xs bg-[#0B4F8A] text-white px-3 py-1 rounded-lg">
                        {exam.code}
                      </span>
                      <span className="text-xs text-[#0B4F8A] font-bold px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200">
                        Class {exam.grade}
                      </span>
                      <span className="text-xs text-slate-600 font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                        50 Questions
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-700 font-mono font-bold">
                      <span>{exam.durationMinutes} Mins</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-extrabold">+{exam.totalMarks} Marks</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">{exam.title}</h3>
                    {exam.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5 font-bold">{exam.subtitle}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                      {exam.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 font-medium">
                      Sections: Logical Reasoning, Mathematical Reasoning, Everyday Math, Achievers Section.
                    </div>

                    <Link
                      href={`/exam/${exam.id}`}
                      className="h-11 px-6 bg-[#28A745] hover:bg-[#218838] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow transition-all uppercase tracking-wider cursor-pointer whitespace-nowrap"
                    >
                      <span>Take Examination</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Student Completed Exams & Recent Results (Requirement 20) */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-lg font-black text-slate-900">Recent Completed Attempts & Results</h2>
                </div>
              </div>

              {recentAttempts.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center text-xs text-slate-500">
                  No completed examination attempts recorded yet. Start an exam to generate your official score paper.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttempts.map((att) => (
                    <div
                      key={att.id}
                      className="bg-white border-2 border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{att.examTitle}</span>
                          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            Completed
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          Candidate: {att.student.name} • Submitted:{" "}
                          {new Date(att.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-black font-mono text-[#0B4F8A]">
                            Score: {att.scoreDisplay}
                          </div>
                          <div className="text-xs font-bold text-emerald-700">{att.percentage}% Score</div>
                        </div>

                        <Link
                          href={`/results/${att.id}`}
                          className="h-9 px-4 bg-[#0B4F8A] hover:bg-[#083863] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Score Paper
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Operations & Tools (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="pb-2 border-b-2 border-slate-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0B4F8A]" />
              <h2 className="text-lg font-black text-slate-900">Interactive Laboratories</h2>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">50 Interactive Activities Studio</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Test and inspect all 50 bespoke interactive question activities (folding studios, torque balances, radar drones, and rotating dice labs) in light academic theme.
                </p>
              </div>

              <Link
                href="/admin/activities"
                className="w-full h-11 bg-[#0B4F8A] hover:bg-[#083863] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>Open 50 Activities Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Operations Links */}
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Platform Navigation
              </h3>
              <div className="space-y-2 text-xs font-bold">
                <Link
                  href="/admin/live-monitor"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> Live Surveillance Monitor
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/admin/results"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#0B4F8A]" /> All Results Ledger
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/admin/questions"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" /> Question Repository
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t-2 border-slate-300 py-4 px-6 text-center text-xs font-bold text-slate-500">
        National Olympiad Digital Examination Platform • Council Accreditation Level-1 Standard
      </footer>
    </div>
  );
}

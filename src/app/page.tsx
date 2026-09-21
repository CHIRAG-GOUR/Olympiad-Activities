"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OlympiadStore } from "@/services/firebase/firestore";
import { Exam } from "@/types/exam";
import {
  FileCheck2,
  LayoutDashboard,
  Play,
  Award,
  Activity,
  ArrowRight,
  BookOpen,
  Layers,
  Rocket,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function GatewayHomePage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const ex = await OlympiadStore.getExams();
      setExams(ex);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7EE] flex flex-col justify-between font-sans antialiased text-slate-900">
      {/* Platform Header with Rich Forest Green Identity */}
      <header className="bg-[#547322] border-b border-[#435C1B] sticky top-0 z-30 shadow-md">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0 shadow-xs border border-white/20 relative overflow-hidden backdrop-blur-xs">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 6V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V6L12 2Z" fill="#547322" stroke="#FFD84D" strokeWidth="1.5" />
                <path d="M12 6L14 10H18L15 13L16 17L12 14.5L8 17L9 13L6 10H10L12 6Z" fill="#F4C400" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFE066]">
                National & International Examination Council
              </div>
              <div className="text-[19px] font-extrabold text-white leading-tight tracking-tight">
                OLYMPIAD DIGITAL EXAMINATION
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="h-[44px] px-5 bg-white text-[#3E5519] hover:bg-[#F4F9FB] rounded-xl text-[14px] font-extrabold flex items-center gap-2 transition-all shadow-md shadow-black/10"
            >
              <LayoutDashboard className="w-4 h-4 text-[#547322]" />
              <span>Admin & Teacher Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero & Portal Access Hub - Full Desktop Scale */}
      <main className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 flex-1">
        {/* Banner Section with Forest/Olive Green Gradient */}
        <div className="bg-gradient-to-r from-[#547322] via-[#4D691F] to-[#3E5519] rounded-2xl p-6 sm:p-10 shadow-lg text-white space-y-4 border border-[#435C1B] relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 text-[#FFE066] rounded-xl font-extrabold text-[12px] border border-white/20 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-[#FFE066]" />
            <span>Official Examination Session Environment • Verified Council Standard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Interactive Digital Olympiad Examination Platform
          </h1>

          <p className="text-[15px] sm:text-[16px] text-white/85 leading-relaxed max-w-4xl font-medium">
            A specialized digital examination environment where candidates demonstrate mathematical rigor, spatial reasoning, and scientific inquiry through direct interactive problem solving—featuring physical balance simulations, coordinate plotting, ordering tokens, and pure algorithmic scoring.
          </p>
        </div>

        {/* Dual Portal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Student Examinations (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#D4E0C2]">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[#547322]" />
                <h2 className="text-[19px] font-extrabold text-slate-900">Active Student Examinations</h2>
              </div>
              <span className="text-[13px] text-[#547322] font-bold font-mono bg-white px-3 py-1 rounded-lg border border-[#D4E0C2]">
                {exams.length} Active Paper{exams.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-4">
              {exams.length === 0 ? (
                <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 bg-[#FEF3C7] text-[#B45309] rounded-xl flex items-center justify-center mx-auto border border-[#FDE68A]">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-extrabold text-slate-900">No Examinations Currently Scheduled</h3>
                    <p className="text-[14px] text-slate-600 max-w-md mx-auto mt-1 font-medium">
                      There are no active examination papers in the system. Teachers and administrators can create, configure, and publish Olympiad papers from the operations desk.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/admin/exams/new"
                      className="h-[44px] px-6 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[14px] font-extrabold inline-flex items-center gap-2 shadow-md transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Create New Examination</span>
                    </Link>
                    <Link
                      href="/admin/questions/new"
                      className="h-[44px] px-5 bg-white border-2 border-[#D4E0C2] hover:bg-[#F4F7EE] text-[#3E5519] rounded-xl text-[14px] font-bold inline-flex items-center gap-2 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#547322]" />
                      <span>Author Questions</span>
                    </Link>
                  </div>
                </div>
              ) : (
                exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-[#FFFDF5] border-2 border-[#FDE68A] hover:border-[#F59E0B] rounded-2xl p-6 sm:p-7 shadow-sm transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-extrabold text-[13px] bg-[#0B4F8A] text-white px-3 py-1 rounded-lg">
                          {exam.code}
                        </span>
                        <span className="text-[13px] text-[#92400E] font-extrabold px-3 py-1 rounded-lg bg-[#FEF3C7] border border-[#FDE68A]">
                          Grade {exam.grade}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[13px] text-slate-700 font-mono font-bold">
                        <span>{exam.durationMinutes} Mins</span>
                        <span>•</span>
                        <span className="text-[#B45309] font-extrabold">+{exam.totalMarks} Marks</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[20px] font-extrabold text-slate-900">{exam.title}</h3>
                      {exam.subtitle && (
                        <p className="text-[13px] text-[#B45309] mt-0.5 font-bold">{exam.subtitle}</p>
                      )}
                      <p className="text-[14px] text-slate-600 mt-2 leading-relaxed font-medium">
                        {exam.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-[12px] text-slate-500 font-medium">
                        Includes: Drag ordering, classification buckets, coordinate grids, and live torque simulations.
                      </div>

                      <Link
                        href={`/exam/${exam.id}`}
                        className="h-[46px] px-7 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 rounded-xl text-[14px] font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 transition-all whitespace-nowrap cursor-pointer"
                      >
                        <span>Take Examination</span>
                        <Play className="w-4 h-4 fill-current" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Admin & Teacher Console Card (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="pb-3 border-b-2 border-[#D4E0C2] flex items-center gap-2.5">
              <LayoutDashboard className="w-5 h-5 text-[#547322]" />
              <h2 className="text-[19px] font-extrabold text-slate-900">Faculty Operations</h2>
            </div>

            <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-[16px] font-extrabold text-slate-900">Examination Operations Desk</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  Real-time student surveillance, question authoring sandbox, Excel bulk ingestion, and teacher-marked score papers.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <Link
                  href="/admin/dashboard"
                  className="w-full p-3.5 bg-[#F4F7EE] hover:bg-[#EBF1E2] border border-[#D4E0C2] rounded-xl text-[14px] font-bold text-[#3E5519] flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-[#547322]" />
                    Operations Dashboard
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#547322]" />
                </Link>

                <Link
                  href="/admin/live-monitor"
                  className="w-full p-3.5 bg-[#F4F7EE] hover:bg-[#EBF1E2] border border-[#D4E0C2] rounded-xl text-[14px] font-bold text-[#3E5519] flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Live Student Monitor
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#547322]" />
                </Link>

                <Link
                  href="/admin/questions/new"
                  className="w-full p-3.5 bg-[#F4F7EE] hover:bg-[#EBF1E2] border border-[#D4E0C2] rounded-xl text-[14px] font-bold text-[#3E5519] flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#D97706]" />
                    Author Question (Split Studio)
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#547322]" />
                </Link>

                <Link
                  href="/admin/imports"
                  className="w-full p-3.5 bg-[#F4F7EE] hover:bg-[#EBF1E2] border border-[#D4E0C2] rounded-xl text-[14px] font-bold text-[#3E5519] flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-[#547322]" />
                    Excel / CSV Ingestion
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#547322]" />
                </Link>

                <Link
                  href="/admin/results"
                  className="w-full p-3.5 bg-[#F4F7EE] hover:bg-[#EBF1E2] border border-[#D4E0C2] rounded-xl text-[14px] font-bold text-[#3E5519] flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#C62828]" />
                    Evaluated Results Ledger
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#547322]" />
                </Link>
              </div>

              <div className="pt-3 border-t border-[#D4E0C2] text-[12px] text-slate-500 font-mono font-semibold">
                13 Firestore Standard Collections Active
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#4D691F] border-t border-[#435C1B] py-6 text-white">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/80">
          <div>
            © 2026 Olympiad Digital Examination Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4 font-semibold text-white/90">
            <span>Olympiad Green Theme Standard</span>
            <span>•</span>
            <span>Interactive Educational Engines</span>
            <span>•</span>
            <span>Verified Assessment System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


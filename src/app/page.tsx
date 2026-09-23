"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { examRepository, attemptRepository } from "@/repositories";
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
  Database,
  GraduationCap,
  FileText,
  ChevronRight,
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
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-between font-sans antialiased text-[#172033] select-none">
      {/* 1. Official Olympiad Header */}
      <header className="bg-white border-b border-[#E3E8EF] sticky top-0 z-30">
        <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="w-9 h-9 rounded-xl bg-[#2563A8] text-white grid place-items-center font-display font-bold text-lg shadow-subtle group-hover:bg-[#1B4E88] transition-colors">
              Ω
            </span>
            <span className="leading-tight">
              <span className="block text-[14px] font-bold text-[#172033] tracking-[-0.01em]">
                Olympiad
              </span>
              <span className="hidden sm:block text-[11px] text-[#98A2B3] font-medium">
                Candidate Portal
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Role selection — this build lets you view the platform as any role */}
            <div className="hidden sm:flex items-center bg-[#F6F8FB] rounded-xl p-1 border border-[#E3E8EF] text-[12.5px] font-semibold">
              {(["STUDENT", "TEACHER", "SUPER_ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  className={`px-3 h-8 rounded-lg transition-colors ${
                    role === r
                      ? "bg-white text-[#2563A8] shadow-subtle"
                      : "text-[#667085] hover:text-[#172033]"
                  }`}
                >
                  {r === "STUDENT" ? "Student" : r === "TEACHER" ? "Teacher" : "Admin"}
                </button>
              ))}
            </div>

            {role !== "STUDENT" ? (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563A8] text-white text-[13px] font-semibold hover:bg-[#1B4E88] transition-colors shadow-subtle"
              >
                <LayoutDashboard className="w-4 h-4" strokeWidth={2.2} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl border border-[#E3E8EF] bg-white text-[13px] font-semibold text-[#172033]">
                <GraduationCap className="w-4 h-4 text-[#2563A8]" strokeWidth={2.2} />
                <span className="max-w-[140px] truncate">{user?.name}</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Portal Workspace Surface */}
      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        
        {/* Banner Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E3E8EF] space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B4E88] bg-[#EAF2FB] px-2.5 py-1 rounded-md border border-[#E3E8EF]">
              Official Examination Session Environment
            </span>
            <span className="text-xs text-[#667085] font-semibold">• 2024–25 Academic Cycle</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Digital Olympiad Examination
          </h1>

          <p className="text-sm text-[#667085] leading-relaxed max-w-4xl font-medium">
            Standardized Olympiad assessment environment featuring interactive question mechanics, spatial logic laboratories, geometric plotting, and deterministic scoring backed by continuous IndexedDB crash recovery.
          </p>
        </div>

        {/* Dual Portal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Active Examinations (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3E8EF]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#2563A8]" />
                <h2 className="text-lg font-bold text-[#172033]">Available Examination Papers</h2>
              </div>
              <span className="text-xs text-[#1B4E88] font-bold font-mono bg-[#EAF2FB] px-2.5 py-1 rounded-lg border border-[#E3E8EF]">
                {exams.length} Active Paper{exams.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white border border-[#E3E8EF] hover:border-[#2563A8] rounded-3xl p-6 shadow-sm transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-[#2563A8] text-white px-3 py-1 rounded-lg">
                        {exam.code}
                      </span>
                      <span className="text-xs text-[#1B4E88] font-bold px-2.5 py-1 rounded-lg bg-[#EAF2FB] border border-[#E3E8EF]">
                        Class {exam.grade}
                      </span>
                      <span className="text-xs text-[#667085] font-bold px-2.5 py-1 rounded-lg bg-[#F6F8FB] border border-[#E3E8EF]">
                        {exam.questionIds.length || 50} Questions
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#172033] font-mono font-bold">
                      <span>{exam.durationMinutes} Mins</span>
                      <span>•</span>
                      <span className="text-[#1B4E88] font-bold">+{exam.totalMarks || 60} Marks</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#172033]">{exam.title}</h3>
                    {exam.subtitle && (
                      <p className="text-xs text-[#2563A8] mt-0.5 font-bold">{exam.subtitle}</p>
                    )}
                    <p className="text-xs text-[#667085] mt-2 leading-relaxed font-medium">
                      {exam.description || "Standardized digital Olympiad examination paper."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E3E8EF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-[#667085] font-medium">
                      Sections: Logical Reasoning, Mathematical Reasoning, Everyday Math, Achievers Section.
                    </div>

                    <Link
                      href={`/exam/${exam.id}`}
                      className="h-10 px-6 bg-[#2563A8] hover:bg-[#1B4E88] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-subtle transition-all uppercase tracking-wider cursor-pointer whitespace-nowrap"
                    >
                      <span>Take Examination</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Results Section */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3E8EF]">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#2563A8]" />
                  <h2 className="text-lg font-bold text-[#172033]">Recent Completed Attempts</h2>
                </div>
              </div>

              {recentAttempts.length === 0 ? (
                <div className="bg-white border border-dashed border-[#E3E8EF] rounded-2xl p-6 text-center text-xs text-[#667085]">
                  No completed examination attempts recorded yet. Start an exam above to generate your official score paper.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttempts.map((att) => (
                    <div
                      key={att.id}
                      className="bg-white border border-[#E3E8EF] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#172033]">{att.examTitle}</span>
                          <span className="text-[10px] font-bold bg-[#EAF2FB] text-[#1B4E88] px-2 py-0.5 rounded-md border border-[#E3E8EF]">
                            Completed
                          </span>
                        </div>
                        <div className="text-xs text-[#667085] font-mono">
                          Candidate: {att.student.name} • Submitted:{" "}
                          {new Date(att.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono text-[#2563A8]">
                            Score: {att.scoreDisplay}
                          </div>
                          <div className="text-xs font-bold text-[#1B4E88]">{att.percentage}% Accuracy</div>
                        </div>

                        <Link
                          href={`/results/${att.id}`}
                          className="h-9 px-4 bg-[#2563A8] hover:bg-[#1B4E88] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all"
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

          {/* Right: Operations & Information Hierarchy (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="pb-2 border-b border-[#E3E8EF] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#2563A8]" />
              <h2 className="text-lg font-bold text-[#172033]">Question Repository</h2>
            </div>

            <div className="bg-white border border-[#E3E8EF] rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Standardized Question Bank</h3>
                <p className="text-xs text-[#667085] mt-1 font-medium leading-relaxed">
                  Interactive Olympiad questions with deterministic mechanics (Ordering, Simulation, Graph, Numeric, Matching, Classification, Hotspot).
                </p>
              </div>

              <Link
                href="/admin/questions"
                className="w-full h-10 bg-[#EAF2FB] hover:bg-[#E3E8EF] text-[#1B4E88] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Question Repository</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Operations Links */}
            <div className="bg-white border border-[#E3E8EF] rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Examination Operations
              </h3>
              <div className="space-y-2 text-xs font-bold">
                <Link
                  href="/admin/live-monitor"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F8FB] hover:bg-[#EAF2FB] text-[#172033] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#2563A8]" /> Live Surveillance Monitor
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
                </Link>

                <Link
                  href="/admin/results"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F8FB] hover:bg-[#EAF2FB] text-[#172033] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#2563A8]" /> Results & Reports Ledger
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
                </Link>

                <Link
                  href="/admin/question-bank"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F8FB] hover:bg-[#EAF2FB] text-[#172033] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#2563A8]" /> Curriculum Question Bank
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E3E8EF] py-4 px-6 text-center text-xs font-semibold text-[#667085]">
        National Olympiad Digital Examination Platform • Council Accreditation Standard
      </footer>
    </div>
  );
}

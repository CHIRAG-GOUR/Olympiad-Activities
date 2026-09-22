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
  BookOpen,
  Database,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
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
    <div className="min-h-screen bg-[#F4F7EE] flex flex-col justify-between font-sans antialiased text-[#172033] select-none">
      {/* 1. Official Olympiad Header */}
      <header className="bg-[#4D741F] border-b border-[#355415] sticky top-0 z-30 shadow-md text-white">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0 shadow-xs border border-white/20">
              <ShieldCheck className="w-6 h-6 text-[#F4C400]" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFE066]">
                National Olympiad Examination Council
              </div>
              <div className="text-[18px] font-black leading-tight tracking-tight">
                OLYMPIAD DIGITAL EXAMINATION PORTAL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher Toolbar */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-1 border border-white/20 text-xs font-bold">
              <span className="text-white/70 px-2 uppercase text-[10px]">Active Role:</span>
              {(["STUDENT", "TEACHER", "SUPER_ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    role === r
                      ? "bg-white text-[#355415] font-black shadow-xs"
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
                className="h-10 px-4 bg-white text-[#355415] hover:bg-[#EEF5E7] rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-[#4D741F]" />
                <span>Command Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                <GraduationCap className="w-4 h-4 text-[#FFE066]" />
                <span>{user?.name || "Rahul Sharma"} (Class 6)</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Portal Workspace Surface */}
      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        
        {/* Banner Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DDE4D7] space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#355415] bg-[#EEF5E7] px-2.5 py-1 rounded-md border border-[#DDE4D7]">
              Official Examination Session Environment
            </span>
            <span className="text-xs text-[#667085] font-semibold">• 2024–25 Academic Cycle</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
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
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE4D7]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#4D741F]" />
                <h2 className="text-lg font-extrabold text-[#172033]">Available Examination Papers</h2>
              </div>
              <span className="text-xs text-[#355415] font-bold font-mono bg-[#EEF5E7] px-2.5 py-1 rounded-lg border border-[#DDE4D7]">
                {exams.length} Active Paper{exams.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white border border-[#DDE4D7] hover:border-[#4D741F] rounded-3xl p-6 shadow-sm transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-extrabold text-xs bg-[#4D741F] text-white px-3 py-1 rounded-lg">
                        {exam.code}
                      </span>
                      <span className="text-xs text-[#355415] font-bold px-2.5 py-1 rounded-lg bg-[#EEF5E7] border border-[#DDE4D7]">
                        Class {exam.grade}
                      </span>
                      <span className="text-xs text-[#667085] font-bold px-2.5 py-1 rounded-lg bg-[#F6F9F1] border border-[#DDE4D7]">
                        {exam.questionIds.length || 50} Questions
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#172033] font-mono font-bold">
                      <span>{exam.durationMinutes} Mins</span>
                      <span>•</span>
                      <span className="text-[#355415] font-extrabold">+{exam.totalMarks || 60} Marks</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#172033]">{exam.title}</h3>
                    {exam.subtitle && (
                      <p className="text-xs text-[#4D741F] mt-0.5 font-bold">{exam.subtitle}</p>
                    )}
                    <p className="text-xs text-[#667085] mt-2 leading-relaxed font-medium">
                      {exam.description || "Standardized digital Olympiad examination paper."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DDE4D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-[#667085] font-medium">
                      Sections: Logical Reasoning, Mathematical Reasoning, Everyday Math, Achievers Section.
                    </div>

                    <Link
                      href={`/exam/${exam.id}`}
                      className="h-10 px-6 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all uppercase tracking-wider cursor-pointer whitespace-nowrap"
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
              <div className="flex items-center justify-between pb-2 border-b border-[#DDE4D7]">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#4D741F]" />
                  <h2 className="text-lg font-extrabold text-[#172033]">Recent Completed Attempts</h2>
                </div>
              </div>

              {recentAttempts.length === 0 ? (
                <div className="bg-white border border-dashed border-[#DDE4D7] rounded-2xl p-6 text-center text-xs text-[#667085]">
                  No completed examination attempts recorded yet. Start an exam above to generate your official score paper.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttempts.map((att) => (
                    <div
                      key={att.id}
                      className="bg-white border border-[#DDE4D7] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#172033]">{att.examTitle}</span>
                          <span className="text-[10px] font-extrabold bg-[#EEF5E7] text-[#355415] px-2 py-0.5 rounded-md border border-[#DDE4D7]">
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
                          <div className="text-sm font-black font-mono text-[#4D741F]">
                            Score: {att.scoreDisplay}
                          </div>
                          <div className="text-xs font-bold text-[#355415]">{att.percentage}% Accuracy</div>
                        </div>

                        <Link
                          href={`/results/${att.id}`}
                          className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
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
            <div className="pb-2 border-b border-[#DDE4D7] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#4D741F]" />
              <h2 className="text-lg font-extrabold text-[#172033]">Question Repository</h2>
            </div>

            <div className="bg-white border border-[#DDE4D7] rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#172033]">Standardized Question Bank</h3>
                <p className="text-xs text-[#667085] mt-1 font-medium leading-relaxed">
                  Interactive Olympiad questions with deterministic mechanics (Ordering, Simulation, Graph, Numeric, Matching, Classification, Hotspot).
                </p>
              </div>

              <Link
                href="/admin/questions"
                className="w-full h-10 bg-[#EEF5E7] hover:bg-[#DDE4D7] text-[#355415] rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Question Repository</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Operations Links */}
            <div className="bg-white border border-[#DDE4D7] rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                Examination Operations
              </h3>
              <div className="space-y-2 text-xs font-bold">
                <Link
                  href="/admin/live-monitor"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F9F1] hover:bg-[#EEF5E7] text-[#172033] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#4D741F]" /> Live Surveillance Monitor
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
                </Link>

                <Link
                  href="/admin/results"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F9F1] hover:bg-[#EEF5E7] text-[#172033] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#4D741F]" /> Results & Reports Ledger
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
                </Link>

                <Link
                  href="/admin/question-bank"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F9F1] hover:bg-[#EEF5E7] text-[#172033] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#4D741F]" /> Curriculum Question Bank
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#DDE4D7] py-4 px-6 text-center text-xs font-semibold text-[#667085]">
        National Olympiad Digital Examination Platform • Council Accreditation Standard
      </footer>
    </div>
  );
}

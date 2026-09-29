"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { examRepository, questionRepository, attemptRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import { Question } from "@/types/question";
import { ExamAttempt } from "@/types/attempt";
import { useAuth } from "@/context/AuthContext";
import { visibleAttempts } from "@/lib/auth/dataAccess";
import { Card, SectionHeading, ActionLink } from "@/components/ui/primitives";
import { EmptyState } from "@/components/dashboard/DashboardSections";
import { formatClock, remainingSecondsFor, type LiveSession } from "@/lib/dashboard/insights";
import { Play, RotateCcw, CheckCircle2, Clock, FileText, Calculator, BookOpen, Layers, Search, GraduationCap } from "lucide-react";

type SubjectTabKey = "math" | "english" | "all";

/**
 * Candidate examination list.
 *
 * Shows what this candidate can sit, resume or review — organized by subject in 1-by-1 tabs.
 * Attempt data is narrowed through the data-access layer, not filtered in the markup.
 */
export default function StudentExamsScreen() {
  const { scope, user } = useAuth();

  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [activeTab, setActiveTab] = useState<SubjectTabKey>("math");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [ex, qs, atts, live] = await Promise.all([
          examRepository.listExams(),
          questionRepository.listQuestions(),
          attemptRepository.listAttempts(),
          (async () => {
            try {
              const { idbClient } = await import("@/services/persistence/indexeddb");
              return await idbClient.getAll<LiveSession>("sessions");
            } catch {
              return [] as LiveSession[];
            }
          })(),
        ]);
        if (cancelled) return;
        setExams(ex);
        setQuestions(qs);
        setAttempts(atts);
        setSessions(live);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Only this candidate's records ever reach the view. */
  const myAttempts = useMemo(() => visibleAttempts(scope, attempts), [scope, attempts]);

  const myResumable = useMemo(() => {
    const mine = sessions.filter(
      (s) =>
        s.status === "in_progress" &&
        s.studentName?.trim().toLowerCase() === (user?.name ?? "").trim().toLowerCase()
    );
    return new Map(mine.map((s) => [s.examId, s]));
  }, [sessions, user]);

  const available = useMemo(() => exams.filter((e) => e.status !== "Archived"), [exams]);

  // Split exams by subject
  const mathExams = useMemo(() => {
    return available.filter((e) => {
      const sId = (e.subjectId || "").toLowerCase();
      const sName = (e.subjectName || "").toLowerCase();
      const code = (e.code || "").toLowerCase();
      const title = (e.title || "").toLowerCase();
      return (
        sId.includes("math") ||
        sName.includes("math") ||
        code.includes("imo") ||
        title.includes("mathematics") ||
        title.includes("imo") ||
        (!sId.includes("eng") && !sName.includes("english"))
      );
    });
  }, [available]);

  const englishExams = useMemo(() => {
    return available.filter((e) => {
      const sId = (e.subjectId || "").toLowerCase();
      const sName = (e.subjectName || "").toLowerCase();
      const code = (e.code || "").toLowerCase();
      const title = (e.title || "").toLowerCase();
      return (
        sId.includes("eng") ||
        sName.includes("english") ||
        code.includes("ieo") ||
        title.includes("english") ||
        title.includes("ieo")
      );
    });
  }, [available]);

  // Current tab collection
  const currentTabExams = useMemo(() => {
    if (activeTab === "math") return mathExams;
    if (activeTab === "english") return englishExams;
    return available;
  }, [activeTab, mathExams, englishExams, available]);

  // Search filter
  const filtered = useMemo(() => {
    return currentTabExams.filter(
      (e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [currentTabExams, searchTerm]);

  if (loading) {
    return (
      <Card>
        <EmptyState kind="exams" title="Loading your examinations…" />
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
          <span>Candidate Examination Hall</span>
          <span className="text-[#667085]">•</span>
          <span>Grade 6 Olympiad Registry</span>
        </div>
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-[#182338] mt-1">
          Olympiad Examinations
        </h1>
        <p className="mt-1 text-[13.5px] text-[#667085] font-medium">
          Select a subject tab to explore examination papers available for your grade and track your progress.
        </p>
      </div>

      {/* 2. Subject Tabs Navigation */}
      <div className="bg-white border border-[#E1E7EF] rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Maths Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("math")}
            style={
              activeTab === "math"
                ? { backgroundColor: "#2468B2", color: "#FFFFFF", borderColor: "#2468B2" }
                : { backgroundColor: "#FFFFFF", color: "#475569", borderColor: "#E1E7EF" }
            }
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "math"
                ? "shadow-sm ring-2 ring-[#2468B2]/20"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Calculator
              className="w-4 h-4"
              style={{ color: activeTab === "math" ? "#FFFFFF" : "#2468B2" }}
            />
            <span style={{ color: activeTab === "math" ? "#FFFFFF" : "#1E293B" }}>Mathematics</span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-mono font-black"
              style={
                activeTab === "math"
                  ? { backgroundColor: "rgba(255, 255, 255, 0.22)", color: "#FFFFFF" }
                  : { backgroundColor: "#EEF4FF", color: "#2468B2", border: "1px solid #D0E1FD" }
              }
            >
              {mathExams.length}
            </span>
          </button>

          {/* English Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("english")}
            style={
              activeTab === "english"
                ? { backgroundColor: "#9333EA", color: "#FFFFFF", borderColor: "#9333EA" }
                : { backgroundColor: "#FFFFFF", color: "#475569", borderColor: "#E1E7EF" }
            }
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "english"
                ? "shadow-sm ring-2 ring-[#9333EA]/20"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen
              className="w-4 h-4"
              style={{ color: activeTab === "english" ? "#FFFFFF" : "#9333EA" }}
            />
            <span style={{ color: activeTab === "english" ? "#FFFFFF" : "#1E293B" }}>English</span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-mono font-black"
              style={
                activeTab === "english"
                  ? { backgroundColor: "rgba(255, 255, 255, 0.22)", color: "#FFFFFF" }
                  : { backgroundColor: "#FAF5FF", color: "#9333EA", border: "1px solid #F3E8FF" }
              }
            >
              {englishExams.length}
            </span>
          </button>

          {/* All Subjects Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            style={
              activeTab === "all"
                ? { backgroundColor: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" }
                : { backgroundColor: "#FFFFFF", color: "#475569", borderColor: "#E1E7EF" }
            }
            className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "all"
                ? "shadow-sm ring-2 ring-slate-900/20"
                : "hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Layers
              className="w-4 h-4"
              style={{ color: activeTab === "all" ? "#FFFFFF" : "#64748B" }}
            />
            <span style={{ color: activeTab === "all" ? "#FFFFFF" : "#1E293B" }}>All Subjects</span>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-mono font-black"
              style={
                activeTab === "all"
                  ? { backgroundColor: "rgba(255, 255, 255, 0.22)", color: "#FFFFFF" }
                  : { backgroundColor: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0" }
              }
            >
              {available.length}
            </span>
          </button>
        </div>

        {/* Grade 6 Badge */}
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
            <span>Grade 6</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Count Bar */}
      <div className="bg-white border border-[#E1E7EF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full min-w-[260px]">
          <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            style={{ paddingLeft: "2.5rem" }}
            placeholder={
              activeTab === "math"
                ? "Search Mathematics papers by title, code, or set..."
                : activeTab === "english"
                ? "Search English papers..."
                : "Search all examinations..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pr-3 text-xs sm:text-[13px] bg-[#F4F7FB]/70 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs font-bold text-[#667085] px-2 whitespace-nowrap">
          Showing <strong className="text-[#2468B2]">{filtered.length}</strong> {activeTab === "math" ? "Mathematics" : activeTab === "english" ? "English" : ""} papers
        </div>
      </div>

      {/* 4. Tab 1-by-1 Content */}
      <section>
        <SectionHeading title={activeTab === "math" ? "Mathematics Papers" : activeTab === "english" ? "English Papers" : "All Available Papers"} />
        {activeTab === "english" && englishExams.length === 0 ? (
          <Card className="p-10 text-center space-y-3 border-2 border-dashed border-purple-200 bg-purple-50/30">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">English Olympiad (IEO) Grade 6 Ready</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              The English Olympiad examination papers will appear here as soon as they are published.
            </p>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              kind="exams"
              title="No examination matching search"
              description="Try refining your search terms or switch subject tabs."
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((exam, idx) => {
              const resume = myResumable.get(exam.id);
              const done = myAttempts.find((a) => a.examId === exam.id);
              const count = exam.questionIds.length || exam.totalQuestions || questions.length;
              return (
                <Card key={exam.id} interactive className="p-5 sm:p-6 hover:border-[#2468B2] transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Paper number + details */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Paper Number Pill */}
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-50 to-sky-100 border border-indigo-200 text-[#2468B2] flex flex-col items-center justify-center font-mono shadow-2xs">
                        <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">Paper</span>
                        <span className="text-base font-black leading-tight">{(idx + 1).toString().padStart(2, "0")}</span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-[11px] text-[#2468B2] bg-[#EAF2FC] px-2.5 py-0.5 rounded-md border border-indigo-100">
                            {exam.code}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold font-mono">
                            Class {exam.grade || 6}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {exam.totalMarks || 60} Marks
                          </span>
                        </div>

                        <div>
                          <h2 className="text-base sm:text-lg font-bold leading-snug text-[#182338]">{exam.title}</h2>
                          {exam.subtitle && (
                            <p className="text-xs font-bold text-[#2468B2] mt-0.5">{exam.subtitle}</p>
                          )}
                        </div>

                        {exam.description && (
                          <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 font-medium max-w-3xl">
                            {exam.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#667085] pt-1">
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#2468B2]" />
                            {exam.durationMinutes} minutes
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            {count} interactive questions
                          </span>
                        </div>

                        {resume && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B4701F] bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            Paused at question {resume.currentQuestionIndex + 1} ·{" "}
                            <span className="font-mono font-bold">{formatClock(remainingSecondsFor(resume))}</span> left
                          </p>
                        )}
                        {!resume && done && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#3E9E6F] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Submitted · <span className="font-mono font-bold">{done.scoreDisplay}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E1E7EF]">
                      {done && (
                        <ActionLink
                          href={`/results/${done.id}`}
                          tone="secondary"
                          icon={FileText}
                          className="h-11 sm:h-10"
                        >
                          View Report
                        </ActionLink>
                      )}
                      <ActionLink
                        href={`/exam/${exam.id}`}
                        tone="primary"
                        icon={resume ? RotateCcw : Play}
                        className="h-11 sm:h-10"
                      >
                        {resume ? "Resume Exam" : done ? "Sit Again" : "Begin Exam"}
                      </ActionLink>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Completed Section */}
      {myAttempts.length > 0 && (
        <section>
          <SectionHeading
            title="Completed Examinations"
            description="Your submitted papers and performance summaries."
            action={{ label: "My Results", href: "/student/results" }}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {myAttempts.map((a) => (
              <Card key={a.id} interactive className="p-4">
                <Link href={`/results/${a.id}`} className="flex items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold truncate text-[#182338]">{a.examTitle}</span>
                    <span className="block text-[12px] text-[#667085] mt-0.5 font-medium">
                      {new Date(a.submittedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="font-mono text-[15px] font-bold text-[#2468B2] shrink-0">
                    {a.scoreDisplay}
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

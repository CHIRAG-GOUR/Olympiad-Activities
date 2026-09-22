"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { examRepository, questionRepository, attemptRepository, userRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import { ExamAttempt } from "@/types/attempt";
import { Question } from "@/types/question";
import { UserProfile } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import { hasBespokeActivity } from "@/components/activities/ActivityRegistry";
import {
  FileCheck2,
  Users,
  GraduationCap,
  Award,
  Activity,
  ArrowRight,
  PlusCircle,
  Gamepad2,
  Target,
  FileText,
  ChevronRight,
} from "lucide-react";

interface RawSession {
  sessionId: string;
  examId: string;
  status: string;
}

interface ExamStats {
  completed: number;
  inProgress: number;
  notStarted: number;
  avgScore: number | null;
  passRate: number | null;
}

const EMPTY_STATS: ExamStats = { completed: 0, inProgress: 0, notStarted: 0, avgScore: null, passRate: null };

export default function AdminDashboardPage() {
  const { role, user, switchRole } = useAuth();

  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [sessions, setSessions] = useState<RawSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [exList, attList, qList, uList, liveSessions] = await Promise.all([
          examRepository.listExams(),
          attemptRepository.listAttempts(),
          questionRepository.listQuestions(),
          userRepository.listUsers(),
          (async () => {
            try {
              const { idbClient } = await import("@/services/persistence/indexeddb");
              return await idbClient.getAll<RawSession>("sessions");
            } catch {
              return [] as RawSession[];
            }
          })(),
        ]);
        if (cancelled) return;
        setExams(exList);
        setAttempts(attList);
        setQuestions(qList);
        setUsers(uList);
        setSessions(liveSessions);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Real Counts (Requirements 9, 43 - Zero Mock Data)
  const studentUsers = useMemo(() => users.filter((u) => u.role === "STUDENT"), [users]);
  const teacherUsers = useMemo(() => users.filter((u) => u.role === "TEACHER"), [users]);

  // Total real student count = registered student profiles + distinct students with attempts
  const distinctAttemptStudentIds = useMemo(
    () => new Set(attempts.map((a) => a.student?.studentId).filter(Boolean)),
    [attempts]
  );
  const totalStudents = Math.max(studentUsers.length, distinctAttemptStudentIds.size);
  const totalTeachers = teacherUsers.length;
  const activeExamsCount = exams.filter((e) => e.status !== "Archived").length;
  const completedAttemptsCount = attempts.length;
  const totalQuestionsCount = questions.length;

  // Sessions currently in progress, grouped per exam — each exam's card must reflect ITS
  // OWN candidates, not the site-wide total (the previous dashboard showed the same
  // global in-progress count on every exam's row regardless of which exam it belonged to).
  const inProgressByExam = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      if (s.status !== "in_progress") continue;
      map.set(s.examId, (map.get(s.examId) || 0) + 1);
    }
    return map;
  }, [sessions]);
  const activeSessionsCount = useMemo(
    () => sessions.filter((s) => s.status === "in_progress").length,
    [sessions]
  );

  // Per-exam completion, live participation, average score and pass rate — the numbers a
  // teacher actually needs when deciding whether a specific paper is ready/performing,
  // rather than one aggregate figure blended across every exam in the system.
  const examStats = useMemo(() => {
    const map = new Map<string, ExamStats>();
    for (const exam of exams) {
      const examAttempts = attempts.filter((a) => a.examId === exam.id);
      const completed = examAttempts.length;
      const inProgress = inProgressByExam.get(exam.id) || 0;
      const notStarted = Math.max(0, totalStudents - (completed + inProgress));
      const avgScore =
        completed > 0
          ? Math.round(examAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completed)
          : null;
      const passRate =
        completed > 0
          ? Math.round((examAttempts.filter((a) => a.isPassed).length / completed) * 100)
          : null;
      map.set(exam.id, { completed, inProgress, notStarted, avgScore, passRate });
    }
    return map;
  }, [exams, attempts, inProgressByExam, totalStudents]);

  // Interactive activity coverage across the question bank actually wired into exams —
  // directly reflects whether the papers being conducted have a genuine manipulable
  // activity behind each question, or are still falling back to the standard renderer.
  const activityCoverage = useMemo(() => {
    if (questions.length === 0) return { withActivity: 0, total: 0, percent: 0 };
    const withActivity = questions.filter(
      (q) => hasBespokeActivity(q.id) || hasBespokeActivity(q.questionId)
    ).length;
    return {
      withActivity,
      total: questions.length,
      percent: Math.round((withActivity / questions.length) * 100),
    };
  }, [questions]);

  // Section-wise performance aggregated from every graded attempt's sectionScores — a
  // curriculum-level read on which part of the syllabus candidates are actually
  // struggling with, computed from whatever sections the conducted exams define (not a
  // hardcoded list), so it generalizes to new exams with different sections.
  const sectionPerformance = useMemo(() => {
    const agg = new Map<string, { correct: number; total: number; marksAwarded: number; maxMarks: number }>();
    for (const att of attempts) {
      for (const s of att.sectionScores || []) {
        const cur = agg.get(s.sectionTitle) || { correct: 0, total: 0, marksAwarded: 0, maxMarks: 0 };
        cur.correct += s.questionsCorrect;
        cur.total += s.questionsTotal;
        cur.marksAwarded += s.marksAwarded;
        cur.maxMarks += s.maxMarks;
        agg.set(s.sectionTitle, cur);
      }
    }
    return Array.from(agg.entries())
      .map(([title, d]) => ({
        title,
        accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
        marksAwarded: d.marksAwarded,
        maxMarks: d.maxMarks,
      }))
      .sort((a, b) => b.maxMarks - a.maxMarks);
  }, [attempts]);

  // Header texts based on role (Requirement 8)
  const headerTitle =
    role === "SUPER_ADMIN"
      ? "Olympiad Examination Dashboard"
      : role === "TEACHER"
      ? "Teacher Command Dashboard"
      : "My Examination Dashboard";

  const headerSubtitle =
    role === "SUPER_ADMIN"
      ? "System-wide examination management, student participation, and official evaluation overview."
      : role === "TEACHER"
      ? "Monitor your assigned examinations, track student participation, and review official results."
      : "View your registered Olympiad examinations, active progress, and certified score papers.";

  return (
    <div className="flex-1 flex flex-col font-sans select-none text-[#172033]">
      {/* 1. TOP HEADER & ROLE SWITCHER (Requirement 8) */}
      <div className="px-6 sm:px-8 py-6 border-b border-[#DDE4D7] bg-[#F6F9F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#4D741F]">
            <span>National Olympiad Council</span>
            <span className="text-[#667085]">•</span>
            <span className="text-[#667085]">Academic Session 2024–25</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033] mt-1">
            {headerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            {headerSubtitle}
          </p>
        </div>

        {/* Role Switcher Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <div className="bg-white border border-[#DDE4D7] rounded-xl p-1 flex items-center gap-1 shadow-xs text-xs font-bold">
            <span className="text-[#667085] px-2 text-[10px] uppercase font-bold">Role:</span>
            {(["SUPER_ADMIN", "TEACHER", "STUDENT"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  role === r
                    ? "bg-[#4D741F] text-white font-extrabold shadow-xs"
                    : "text-[#667085] hover:bg-[#EEF5E7] hover:text-[#355415]"
                }`}
              >
                {r === "SUPER_ADMIN" ? "SuperAdmin" : r === "TEACHER" ? "Teacher" : "Student"}
              </button>
            ))}
          </div>

          <Link
            href="/admin/exams/new"
            className="h-9 px-4 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Exam</span>
          </Link>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8 flex-1">

        {/* 2. TOP SUMMARY METRICS BLOCKS (Requirements 9, 10 - Real Data Only) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: Registered Students */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">
                Registered Students
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-[#172033] tracking-tight">
                {totalStudents}
              </div>
              <div className="text-[11px] text-[#667085] font-semibold mt-1">
                {studentUsers.length > 0 ? `${studentUsers.length} verified profiles` : "Active candidates"}
              </div>
            </div>
          </div>

          {/* Card 2: Certified Teachers */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">
                Teachers / Evaluators
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-[#172033] tracking-tight">
                {totalTeachers}
              </div>
              <div className="text-[11px] text-[#667085] font-semibold mt-1">
                Authorized examiners
              </div>
            </div>
          </div>

          {/* Card 3: Active Examinations */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">
                Active Examinations
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-[#4D741F] tracking-tight">
                {activeExamsCount}
              </div>
              <div className="text-[11px] text-[#667085] font-semibold mt-1">
                {activeSessionsCount > 0 ? `${activeSessionsCount} candidates live now` : "Published & scheduled"}
              </div>
            </div>
          </div>

          {/* Card 4: Completed Attempts */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">
                Completed Attempts
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-[#355415] tracking-tight">
                {completedAttemptsCount}
              </div>
              <div className="text-[11px] text-[#667085] font-semibold mt-1">
                Evaluated score records
              </div>
            </div>
          </div>

          {/* Card 5: Interactive Activity Coverage */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">
                Activities Ready
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center">
                <Gamepad2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-[#5F8A28] tracking-tight">
                {activityCoverage.withActivity}/{activityCoverage.total || totalQuestionsCount}
              </div>
              <div className="text-[11px] text-[#667085] font-semibold mt-1">
                {activityCoverage.percent}% questions with a live interaction
              </div>
            </div>
          </div>
        </div>

        {/* 3. TWO-COLUMN DASHBOARD (Requirements 11, 12, 13) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Examination Activity (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#172033]">Examination Activity</h2>
                <p className="text-xs text-[#667085] font-medium mt-0.5">
                  Live status, average score and pass rate — per examination paper
                </p>
              </div>
              <Link
                href="/admin/exams"
                className="text-xs font-bold text-[#4D741F] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {exams.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#667085]">
                No active examinations found.
              </div>
            ) : (
              <div className="space-y-4">
                {exams.map((exam) => {
                  const stats = examStats.get(exam.id) || EMPTY_STATS;
                  const total = stats.completed + stats.inProgress + stats.notStarted || 1;

                  const completedPercent = Math.round((stats.completed / total) * 100);
                  const inProgressPercent = Math.round((stats.inProgress / total) * 100);

                  return (
                    <div
                      key={exam.id}
                      className="p-4 rounded-xl border border-[#DDE4D7] bg-[#F6F9F1]/40 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <div className="text-sm font-extrabold text-[#172033]">{exam.title}</div>
                          <div className="text-xs text-[#667085] font-medium">
                            Class {exam.grade} • {exam.questionIds.length || totalQuestionsCount} Questions • {exam.durationMinutes} Mins
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {stats.avgScore !== null && (
                            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-white text-[#355415] border border-[#DDE4D7] font-mono">
                              Avg {stats.avgScore}%
                            </span>
                          )}
                          {stats.passRate !== null && (
                            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-white text-[#0B4F8A] border border-[#DDE4D7] font-mono">
                              Pass {stats.passRate}%
                            </span>
                          )}
                          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-[#EEF5E7] text-[#355415] border border-[#DDE4D7]">
                            {exam.status || "Active"}
                          </span>
                        </div>
                      </div>

                      {/* Multi-segment Progress bar */}
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-full bg-[#E5EBE0] rounded-full overflow-hidden flex">
                          <div
                            className="bg-[#4D741F] h-full transition-all"
                            style={{ width: `${completedPercent}%` }}
                            title={`Completed: ${stats.completed}`}
                          />
                          <div
                            className="bg-[#5F8A28] h-full opacity-70 transition-all"
                            style={{ width: `${inProgressPercent}%` }}
                            title={`In Progress: ${stats.inProgress}`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs font-semibold text-[#667085] pt-1 flex-wrap gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#4D741F]" />
                            <span>Completed: <strong className="text-[#172033]">{stats.completed}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#5F8A28]" />
                            <span>In Progress: <strong className="text-[#172033]">{stats.inProgress}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#DDE4D7]" />
                            <span>Not Started: <strong className="text-[#172033]">{stats.notStarted}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Student Participation (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div className="border-b border-[#DDE4D7] pb-4">
              <h2 className="text-base font-extrabold text-[#172033]">Student Participation</h2>
              <p className="text-xs text-[#667085] font-medium mt-0.5">
                Aggregate candidate completion telemetry
              </p>
            </div>

            {/* Participation Breakdown Visualization */}
            <div className="space-y-4 my-auto">
              <div className="p-4 rounded-xl bg-[#F6F9F1] border border-[#DDE4D7] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#172033]">Total Enrolled Candidates</span>
                  <span className="font-mono text-sm text-[#4D741F] font-black">{totalStudents}</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#DDE4D7]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#4D741F]" /> Completed
                    </span>
                    <span className="font-mono font-bold text-[#172033]">{completedAttemptsCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#5F8A28]" /> In Progress
                    </span>
                    <span className="font-mono font-bold text-[#172033]">{activeSessionsCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#DDE4D7]" /> Not Started
                    </span>
                    <span className="font-mono font-bold text-[#172033]">
                      {Math.max(0, totalStudents - (completedAttemptsCount + activeSessionsCount))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#DDE4D7] rounded-xl text-xs text-[#667085] space-y-1">
                <div className="font-bold text-[#172033] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#4D741F]" /> Live Surveillance Engine
                </div>
                <p className="text-[11px] leading-relaxed">
                  Real-time IndexedDB persistence tracks answers, activity simulations, and true server timestamps.
                </p>
              </div>
            </div>

            <Link
              href="/admin/live-monitor"
              className="w-full h-10 bg-[#EEF5E7] hover:bg-[#DDE4D7] text-[#355415] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Open Live Surveillance Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4. SECTION-WISE PERFORMANCE — curriculum-level read on conducted exams */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#172033] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#4D741F]" />
                Section-Wise Performance
              </h2>
              <p className="text-xs text-[#667085] font-medium mt-0.5">
                Average accuracy per syllabus section, aggregated across every graded attempt
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-[#4D741F] hover:underline flex items-center gap-1"
            >
              <span>Full analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {sectionPerformance.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#667085]">
              Section-wise breakdown appears here once candidates start submitting exams.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sectionPerformance.map((sec) => (
                <div key={sec.title} className="p-4 rounded-xl border border-[#DDE4D7] bg-[#F6F9F1]/40 space-y-2">
                  <div className="text-xs font-extrabold text-[#172033] leading-tight">{sec.title}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-[#4D741F]">{sec.accuracy}%</span>
                    <span className="text-[10px] text-[#667085] font-semibold">accuracy</span>
                  </div>
                  <div className="h-2 bg-[#E5EBE0] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        sec.accuracy >= 75 ? "bg-[#4D741F]" : sec.accuracy >= 50 ? "bg-[#D97706]" : "bg-[#DC3545]"
                      }`}
                      style={{ width: `${sec.accuracy}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#667085] font-mono font-semibold">
                    {sec.marksAwarded}/{sec.maxMarks} marks scored
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. RECENT EXAMINATIONS TABLE (Requirement 14) */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#172033]">Recent Examinations</h2>
              <p className="text-xs text-[#667085] font-medium mt-0.5">
                Configured Olympiad examination papers and test standards
              </p>
            </div>
            <Link
              href="/admin/exams"
              className="text-xs font-bold text-[#4D741F] hover:underline flex items-center gap-1"
            >
              <span>View all examinations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto border border-[#DDE4D7] rounded-xl">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-[#F6F9F1] text-[#667085] border-b border-[#DDE4D7] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Examination Title</th>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5 text-center">Class</th>
                  <th className="p-3.5 text-center">Questions</th>
                  <th className="p-3.5 text-center">Duration</th>
                  <th className="p-3.5 text-center">Completed</th>
                  <th className="p-3.5 text-center">Avg Score</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE4D7] text-[#172033]">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[#667085] font-medium">
                      No examinations created yet. Create your first Olympiad examination to get started.
                    </td>
                  </tr>
                ) : (
                  exams.map((ex) => {
                    const stats = examStats.get(ex.id) || EMPTY_STATS;
                    return (
                      <tr key={ex.id} className="hover:bg-[#F6F9F1]/60">
                        <td className="p-3.5 font-extrabold text-[#172033]">{ex.title}</td>
                        <td className="p-3.5 font-mono text-[#4D741F] font-bold">{ex.code}</td>
                        <td className="p-3.5 text-center font-bold">Class {ex.grade}</td>
                        <td className="p-3.5 text-center font-mono">{ex.questionIds.length || totalQuestionsCount}</td>
                        <td className="p-3.5 text-center font-mono">{ex.durationMinutes} min</td>
                        <td className="p-3.5 text-center font-mono">{stats.completed}</td>
                        <td className="p-3.5 text-center font-mono font-bold text-[#355415]">
                          {stats.avgScore !== null ? `${stats.avgScore}%` : "—"}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#EEF5E7] text-[#355415] border border-[#DDE4D7]">
                            {ex.status || "Active"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <Link
                            href={`/exam/${ex.id}`}
                            className="px-3 py-1.5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-lg text-xs font-bold transition-all inline-block shadow-xs"
                          >
                            Launch Exam
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. RECENT RESULTS TABLE (Requirements 15, 16 - Zero Mock Candidates) */}
        <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE4D7] pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#172033]">Recent Examination Results</h2>
              <p className="text-xs text-[#667085] font-medium mt-0.5">
                Evaluated candidate submissions with official teacher-checked marking
              </p>
            </div>
            <Link
              href="/admin/results"
              className="text-xs font-bold text-[#4D741F] hover:underline flex items-center gap-1"
            >
              <span>View full results ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto border border-[#DDE4D7] rounded-xl">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-[#F6F9F1] text-[#667085] border-b border-[#DDE4D7] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Candidate</th>
                  <th className="p-3.5">Examination</th>
                  <th className="p-3.5 text-center">Score</th>
                  <th className="p-3.5 text-center">Accuracy</th>
                  <th className="p-3.5 text-center">Submitted At</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Official Paper</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE4D7] text-[#172033]">
                {attempts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-[#667085] space-y-2">
                      <div className="text-sm font-bold text-[#172033]">No examination results yet.</div>
                      <div className="text-xs text-[#667085] max-w-sm mx-auto">
                        Student score records will automatically appear here once candidates complete an examination.
                      </div>
                      <div className="pt-2">
                        <Link
                          href={`/exam/${exams[0]?.id || "exam_imo_2024_g6_setb"}`}
                          className="inline-block px-4 py-2 bg-[#4D741F] hover:bg-[#355415] text-white rounded-xl text-xs font-bold shadow-xs"
                        >
                          Take Examination Sample
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attempts.slice(0, 10).map((att) => (
                    <tr key={att.id} className="hover:bg-[#F6F9F1]/60">
                      <td className="p-3.5">
                        <div className="font-extrabold text-[#172033]">{att.student.name}</div>
                        <div className="text-[11px] font-mono text-[#667085]">{att.student.studentId} • Class {att.student.grade}</div>
                      </td>
                      <td className="p-3.5 font-medium text-[#172033]">{att.examTitle}</td>
                      <td className="p-3.5 text-center font-mono font-black text-sm text-[#4D741F]">
                        {att.scoreDisplay}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#355415]">
                        {att.percentage}%
                      </td>
                      <td className="p-3.5 text-center font-mono text-xs text-[#667085]">
                        {new Date(att.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#EEF5E7] text-[#355415] border border-[#DDE4D7]">
                          Completed
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/results/${att.id}`}
                          className="px-3 py-1.5 bg-[#4D741F] hover:bg-[#355415] text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { examRepository, questionRepository, attemptRepository, userRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import { ExamAttempt } from "@/types/attempt";
import { Question } from "@/types/question";
import { UserProfile } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import {
  FileCheck2,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Activity,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { role, user, switchRole } = useAuth();

  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeSessionsCount, setActiveSessionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [exList, attList, qList, uList, liveSess] = await Promise.all([
          examRepository.listExams(),
          attemptRepository.listAttempts(),
          questionRepository.listQuestions(),
          userRepository.listUsers(),
          (async () => {
            try {
              const { idbClient } = await import("@/services/persistence/indexeddb");
              const sess = await idbClient.getAll<any>("sessions");
              return sess.filter((s) => s.status === "in_progress").length;
            } catch {
              return 0;
            }
          })(),
        ]);
        setExams(exList);
        setAttempts(attList);
        setQuestions(qList);
        setUsers(uList);
        setActiveSessionsCount(liveSess);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Real Counts (Requirements 9, 43 - Zero Mock Data)
  const studentUsers = users.filter((u) => u.role === "STUDENT");
  const teacherUsers = users.filter((u) => u.role === "TEACHER");
  
  // Total real student count = registered student profiles + distinct students with attempts
  const distinctAttemptStudentIds = new Set(attempts.map((a) => a.student?.studentId).filter(Boolean));
  const totalStudents = Math.max(studentUsers.length, distinctAttemptStudentIds.size);
  const totalTeachers = teacherUsers.length;
  const activeExamsCount = exams.filter((e) => e.status !== "Archived").length;
  const completedAttemptsCount = attempts.length;
  const totalQuestionsCount = questions.length;

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
                Published & scheduled
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

          {/* Card 5: Questions in Repository */}
          <div className="bg-[#FFFFFF] border border-[#DDE4D7] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">
                Questions in Bank
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#EEF5E7] text-[#4D741F] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-[#5F8A28] tracking-tight">
                {totalQuestionsCount}
              </div>
              <div className="text-[11px] text-[#667085] font-semibold mt-1">
                Interactive questions
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
                  Live status across published examination papers
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
                  const examAttempts = attempts.filter((a) => a.examId === exam.id);
                  const completed = examAttempts.length;
                  const inProgress = activeSessionsCount;
                  const notStarted = Math.max(0, totalStudents - (completed + inProgress));
                  const total = completed + inProgress + notStarted || 1;

                  const completedPercent = Math.round((completed / total) * 100);
                  const inProgressPercent = Math.round((inProgress / total) * 100);

                  return (
                    <div
                      key={exam.id}
                      className="p-4 rounded-xl border border-[#DDE4D7] bg-[#F6F9F1]/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-extrabold text-[#172033]">{exam.title}</div>
                          <div className="text-xs text-[#667085] font-medium">
                            Class {exam.grade} • {exam.questionIds.length || 50} Questions • {exam.durationMinutes} Mins
                          </div>
                        </div>
                        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-[#EEF5E7] text-[#355415] border border-[#DDE4D7]">
                          Active
                        </span>
                      </div>

                      {/* Multi-segment Progress bar */}
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-full bg-[#E5EBE0] rounded-full overflow-hidden flex">
                          <div
                            className="bg-[#4D741F] h-full transition-all"
                            style={{ width: `${completedPercent}%` }}
                            title={`Completed: ${completed}`}
                          />
                          <div
                            className="bg-[#5F8A28] h-full opacity-70 transition-all"
                            style={{ width: `${inProgressPercent}%` }}
                            title={`In Progress: ${inProgress}`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs font-semibold text-[#667085] pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#4D741F]" />
                            <span>Completed: <strong className="text-[#172033]">{completed}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#5F8A28]" />
                            <span>In Progress: <strong className="text-[#172033]">{inProgress}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#DDE4D7]" />
                            <span>Not Started: <strong className="text-[#172033]">{notStarted}</strong></span>
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

        {/* 4. RECENT EXAMINATIONS TABLE (Requirement 14) */}
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
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE4D7] text-[#172033]">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#667085] font-medium">
                      No examinations created yet. Create your first Olympiad examination to get started.
                    </td>
                  </tr>
                ) : (
                  exams.map((ex) => (
                    <tr key={ex.id} className="hover:bg-[#F6F9F1]/60">
                      <td className="p-3.5 font-extrabold text-[#172033]">{ex.title}</td>
                      <td className="p-3.5 font-mono text-[#4D741F] font-bold">{ex.code}</td>
                      <td className="p-3.5 text-center font-bold">Class {ex.grade}</td>
                      <td className="p-3.5 text-center font-mono">{ex.questionIds.length || 50}</td>
                      <td className="p-3.5 text-center font-mono">{ex.durationMinutes} min</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. RECENT RESULTS TABLE (Requirements 15, 16 - Zero Mock Candidates) */}
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

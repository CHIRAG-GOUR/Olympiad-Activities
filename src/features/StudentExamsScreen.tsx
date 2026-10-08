"use client";

import { examRoute, resultRoute } from "@/lib/routes";
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
import { ActivityMiniPreview } from "@/components/dashboard/ActivityMiniPreview";
import { formatClock, remainingSecondsFor, type LiveSession, interactionKindFor } from "@/lib/dashboard/insights";
import { ExamLockService } from "@/services/exam/ExamLockService";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileText,
  Calculator,
  GraduationCap,
  Award,
  Layers,
  Check,
  Compass,
  Shapes,
  Boxes,
  Zap,
} from "lucide-react";

const PRIMARY_EXAM_ID = "exam_imo_2022_g6_setb";

/**
 * Candidate single examination portal.
 *
 * Exclusively presents the official active examination paper (IMO 2022-23 Class 6 Set B)
 * with the 3D rotating dice laboratory manipulative and 50 interactive activities.
 */
export default function StudentExamsScreen() {
  const { scope, user } = useAuth();

  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  const ownerUid = user?.id;

  useEffect(() => {
    let cancelled = false;
    const loadSessions = async () => {
      try {
        const { idbClient } = await import("@/services/persistence/indexeddb");
        return await idbClient.getAll<LiveSession>("sessions");
      } catch {
        return [] as LiveSession[];
      }
    };
    // Only this candidate's attempts: the rules refuse a cohort-wide read to a student.
    const loadAttempts = () => attemptRepository.listAttempts(ownerUid ? { ownerUid } : undefined);

    async function load() {
      // Each source settles on its own. A failed results read must never hide the papers
      // the candidate has been assigned.
      const [ex, qs, atts, live] = await Promise.allSettled([
        examRepository.listExams(),
        questionRepository.listQuestions(),
        loadAttempts(),
        loadSessions(),
      ]);
      if (cancelled) return;
      if (ex.status === "fulfilled") setExams(ex.value);
      if (qs.status === "fulfilled") setQuestions(qs.value);
      if (atts.status === "fulfilled") setAttempts(atts.value);
      if (live.status === "fulfilled") setSessions(live.value);
      setLoading(false);
    }
    load();

    const interval = setInterval(async () => {
      if (cancelled) return;
      const [atts, live] = await Promise.allSettled([loadAttempts(), loadSessions()]);
      if (cancelled) return;
      if (atts.status === "fulfilled") setAttempts(atts.value);
      if (live.status === "fulfilled") setSessions(live.value);
    }, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [ownerUid]);

  const [lockVersion, setLockVersion] = useState(0);

  useEffect(() => {
    const unsub = ExamLockService.subscribe(() => {
      setLockVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  /** Only this candidate's records ever reach the view. */
  const myAttempts = useMemo(() => visibleAttempts(scope, attempts), [scope, attempts]);

  const studentGrade = Number(user?.grade) || 6;

  const studentId = user?.id || (user as any)?.studentId || "";
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  // All papers accessible to this specific candidate
  const accessibleExams = useMemo(() => {
    const me = { id: studentId, email: user?.email, name: user?.name, grade: studentGrade };
    const list = exams.filter((e) => ExamLockService.isExamAccessibleToStudent(e.id, me));
    // Papers a teacher assigned by name come first, newest assignment work at the top.
    return [
      ...list.filter((e) => ExamLockService.isStudentAssigned(e.id, me)),
      ...list.filter((e) => !ExamLockService.isStudentAssigned(e.id, me)),
    ];
  }, [exams, studentId, studentGrade, user?.email, user?.name, lockVersion]);

  // Active paper for candidate. Only ever one this candidate may actually sit.
  const exam = useMemo(() => {
    if (selectedExamId) {
      const found = accessibleExams.find((e) => e.id === selectedExamId);
      if (found) return found;
    }
    if (accessibleExams.length === 0) return null;
    const me = { id: studentId, email: user?.email, name: user?.name };
    const assigned = accessibleExams.find((e) => ExamLockService.isStudentAssigned(e.id, me));
    const primary = accessibleExams.find((e) => e.id === PRIMARY_EXAM_ID || e.id === "exam_imo_class6_setb_2022");
    return assigned || primary || accessibleExams[0];
  }, [selectedExamId, accessibleExams, studentId, user?.email, user?.name, lockVersion]);

  // Questions in this specific paper
  const examQuestions = useMemo(() => {
    if (!exam) return [];
    if (exam.questionIds && exam.questionIds.length > 0) {
      const qMap = new Map(questions.map((q) => [q.id, q]));
      const matched = exam.questionIds.map((id) => qMap.get(id)).filter((q): q is Question => Boolean(q));
      if (matched.length > 0) return matched;
    }
    return questions.slice(0, exam.totalQuestions || 50);
  }, [exam, questions]);

  const resumableSession = useMemo(() => {
    if (!exam) return null;
    return sessions.find(
      (s) =>
        s &&
        s.examId === exam.id &&
        s.status === "in_progress" &&
        remainingSecondsFor(s) > 0 &&
        (!user?.name || !s.studentName || s.studentName?.trim().toLowerCase() === user.name.trim().toLowerCase())
    );
  }, [sessions, exam, user]);

  const latestAttempt = useMemo(() => {
    if (!exam) return null;
    return myAttempts.find((a) => a.examId === exam.id);
  }, [myAttempts, exam]);

  /** Sittings used on this paper and the teacher's limit (null = unlimited). */
  const attemptsUsed = useMemo(
    () => (exam ? myAttempts.filter((a) => a.examId === exam.id).length : 0),
    [myAttempts, exam]
  );
  const maxAttempts = exam ? ExamLockService.getMaxAttempts(exam.id) : null;
  const attemptsLeft = maxAttempts === null ? null : Math.max(0, maxAttempts - attemptsUsed);
  const outOfAttempts = attemptsLeft === 0 && !resumableSession;

  if (loading) {
    return (
      <Card>
        <EmptyState kind="exams" title="Loading your examination paper…" />
      </Card>
    );
  }

  if (!exam) {
    return (
      <Card>
        <EmptyState
          kind="exams"
          title="No examination paper assigned yet"
          description="Your examination paper will appear here as soon as it is scheduled."
        />
      </Card>
    );
  }

  const questionCount = exam.questionIds?.length || exam.totalQuestions || examQuestions.length || 50;

  return (
    <div className="space-y-6 sm:space-y-8 animate-rise-in font-sans text-[#182338]">
      {/* 1. Candidate Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
          <span>Candidate Examination Hall</span>
          <span className="text-[#667085]">•</span>
          <span>Grade 6 Olympiad Registry</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1.5">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-black tracking-[-0.02em] text-[#182338]">
              Your Olympiad Examination
            </h1>
            <p className="mt-1 text-[13.5px] text-[#667085] font-medium">
              Candidate: <strong className="text-slate-900">{user?.name || "Student"}</strong>
              {user?.schoolName && <span> · {user.schoolName}</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-[#2468B2] font-mono">
              Class 6 Mathematics
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Paper Highlight Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left Details */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="text-xs font-mono font-bold text-[#2468B2] mb-1">
                {exam.code}
              </div>
              <h2 className="text-[22px] sm:text-[26px] font-black tracking-[-0.01em] text-slate-900 leading-snug">
                {exam.title}
              </h2>
              <p className="text-sm font-bold text-[#2468B2] mt-1">
                {exam.subtitle || "Official Science Olympiad Foundation Examination"}
              </p>
              <p className="text-xs sm:text-[13px] text-slate-600 font-medium mt-2 leading-relaxed max-w-3xl">
                {exam.description ||
                  "Official Level-1 examination paper from the Science Olympiad Foundation (SOF) covering Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, and Achievers Section."}
              </p>
            </div>

            {/* Meta Tags Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-[#2468B2]" />
                  {exam.durationMinutes} Minutes
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Questions</span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  {questionCount} Questions
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maximum Marks</span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  {exam.totalMarks || 60} Marks
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eligibility</span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Grade 6
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:w-64 flex flex-col justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100 shadow-sm shrink-0">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Your Status
              </span>
              {resumableSession ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Session in Progress</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Paused at question {resumableSession.currentQuestionIndex + 1}
                  </p>
                  <p className="font-mono text-xs font-bold text-amber-900">
                    {formatClock(remainingSecondsFor(resumableSession))} remaining
                  </p>
                </div>
              ) : latestAttempt ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paper Completed</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Score: <strong className="font-mono text-sm">{latestAttempt.scoreDisplay}</strong> ({latestAttempt.percentage}%)
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#2468B2]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2468B2]" />
                    <span>Ready to Sit</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Auto-saved continuously. You can resume at any point.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-0.5">
                <span>Attempts</span>
                <span className={outOfAttempts ? "text-rose-600" : "text-[#2468B2]"}>
                  {maxAttempts === null
                    ? `${attemptsUsed} used · Unlimited`
                    : `${attemptsUsed} of ${maxAttempts} used`}
                </span>
              </div>
              {outOfAttempts ? (
                <div className="w-full h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All attempts used</span>
                </div>
              ) : (
              <Link
                href={
                  resumableSession
                    ? examRoute(exam.id)
                    : latestAttempt
                    ? `${examRoute(exam.id)}&retake=1`
                    : examRoute(exam.id)
                }
                className="w-full h-12 rounded-xl bg-[#2468B2] hover:bg-[#1C5190] active:bg-[#153E6F] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {resumableSession ? (
                  <>
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                    <span>Resume Exam</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {latestAttempt ? "Retake Examination" : "Begin Examination"}
                      {latestAttempt && attemptsLeft !== null ? ` (${attemptsLeft} left)` : ""}
                    </span>
                  </>
                )}
              </Link>
              )}

              {latestAttempt && (
                <Link
                  href={resultRoute(latestAttempt.id)}
                  className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Full Score Report</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Multiple Assigned Papers Selector (When teacher aligns papers) */}
      {accessibleExams.length > 1 && (
        <section className="space-y-3">
          <SectionHeading
            icon={FileText}
            title="Your Assigned Question Papers"
            description="Select any of the examination papers aligned to your student profile by your teacher."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accessibleExams.map((ex) => {
              const isSelected = ex.id === exam?.id;
              const isEnglish = (ex.title || "").toLowerCase().includes("eng") || (ex.code || "").startsWith("IEO");

              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExamId(ex.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-white border-[#2468B2] shadow-md ring-2 ring-[#2468B2]/20"
                      : "bg-white/80 hover:bg-white border-slate-200 shadow-2xs hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] text-[#2468B2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ex.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-[#2468B2] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isSelected ? "Active Paper" : "Select"}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{ex.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {isEnglish ? "English Olympiad" : "Mathematics Olympiad"} &bull; Class {ex.grade || 6}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>{ex.durationMinutes} mins</span>
                    <span className="font-bold text-[#2468B2]">50 Questions</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Syllabus Structure Breakdown */}
      <section>
        <SectionHeading
          icon={Layers}
          title="Examination Syllabus Sections"
          description="The 50 questions are organized across four balanced cognitive sections."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2468B2] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900">Section 1: Logical Reasoning</h3>
            <p className="text-xs text-slate-500 font-medium">
              3D Cube counting, pattern analogies, mirror reflections, and spatial unfolding.
            </p>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-100">
              <span>Q01 – Q15</span>
              <span className="text-[#2468B2]">15 Marks (1 pt each)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900">Section 2: Mathematical Reasoning</h3>
            <p className="text-xs text-slate-500 font-medium">
              Integers, fractions, coordinate geometry, angle protractors, and primes.
            </p>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-100">
              <span>Q16 – Q35</span>
              <span className="text-indigo-700">20 Marks (1 pt each)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900">Section 3: Everyday Mathematics</h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-world shopping scenarios, speed/distance calculations, and unitary method.
            </p>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-100">
              <span>Q36 – Q45</span>
              <span className="text-emerald-700">10 Marks (1 pt each)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900">Section 4: Achievers Section</h3>
            <p className="text-xs text-slate-500 font-medium">
              High-order thinking questions (HOTS) and multi-step interactive problem solving.
            </p>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-100">
              <span>Q46 – Q50</span>
              <span className="text-amber-700 font-black">15 Marks (3 pts each)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Completed Section (If any) */}
      {myAttempts.length > 0 && (
        <section>
          <SectionHeading
            icon={Award}
            title="Your Examination History"
            description="Review your past submitted attempts and performance reports."
            action={{ label: "My Results", href: "/student/results" }}
          />
          <div className="space-y-3">
            {myAttempts.map((a) => (
              <Card key={a.id} interactive className="p-4 sm:p-5 hover:border-[#2468B2]">
                <Link href={resultRoute(a.id)} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-bold truncate text-[#182338]">{a.examTitle}</span>
                      <span className="block text-xs text-[#667085] mt-0.5 font-medium">
                        Submitted {new Date(a.submittedAt).toLocaleDateString()} at {new Date(a.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-base font-black text-[#2468B2] block">
                      {a.scoreDisplay}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {a.percentage}% Accuracy
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

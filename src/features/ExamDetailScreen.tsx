"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { examService, questionService } from "@/services";
import { Exam } from "@/types/exam";
import { Question } from "@/types/question";
import { ArrowLeft, Play } from "lucide-react";
import { examRoute, questionDetailRoute } from "@/lib/routes";
import { InlineStatus } from "@/components/feedback/StatusPanel";
import { logError, userMessageFor } from "@/lib/logger";

export default function ExamDetailScreen({ examId }: { examId: string }) {
  // Links resolve into the route group the active role actually owns.
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const e = examId ? await examService.getExam(examId) : null;
        const qs = e ? await questionService.getQuestionsByIds(e.questionIds) : [];
        if (cancelled) return;
        setExam(e);
        setQuestions(qs);
      } catch (err) {
        if (cancelled) return;
        logError("EXAM_LOAD_FAILED", { examId, operation: "examDetail" }, err);
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [examId, attempt]);

  if (loading) {
    return (
      <div className="p-10 text-center space-y-2">
        <div className="w-8 h-8 border-2 border-olympiad-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[14px] text-olympiad-textMuted font-bold">Loading examination details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <InlineStatus
        title="Unable to load this examination"
        message={userMessageFor(error, "this examination")}
        actions={[
          { label: "Back to examinations", href: `${roleBase}/exams` },
          { label: "Retry", onClick: () => setAttempt((n) => n + 1), primary: true },
        ]}
      />
    );
  }

  if (!exam) {
    return (
      <InlineStatus
        tone="notfound"
        title="Examination not found"
        message="No examination matches this link. It may have been deleted or the link is incomplete."
        actions={[{ label: "Back to examinations", href: `${roleBase}/exams` }]}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <AdminHeader
        title={exam.title}
        subtitle={`${exam.code} • ${exam.subjectName} • Grade ${exam.grade}`}
        actionButton={{
          label: "Launch Student Exam",
          href: examRoute(exam.id),
          icon: Play,
        }}
      />

      <div className="p-6 md:p-8 space-y-6 w-full min-w-0">
        <div className="flex items-center justify-between">
          <Link
            href={`${roleBase}/exams`}
            className="h-[40px] px-3.5 bg-white border border-olympiad-border rounded-md text-[13px] font-bold text-olympiad-textMuted hover:text-navy-900 flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Examinations
          </Link>

          <Link
            href={examRoute(exam.id)}
            className="h-[42px] px-5 bg-olympiad-primary hover:bg-olympiad-deep text-white text-[14px] font-bold rounded-md shadow-subtle flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open Candidate Test Window</span>
          </Link>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-olympiad-border rounded-lg p-5 shadow-subtle space-y-1">
            <div className="text-[12px] uppercase font-bold text-olympiad-textMuted tracking-wider">Duration</div>
            <div className="text-2xl font-bold font-mono text-navy-900">{exam.durationMinutes} Mins</div>
            <div className="text-[12px] text-olympiad-textMuted">Standard timed window</div>
          </div>
          <div className="bg-white border border-olympiad-border rounded-lg p-5 shadow-subtle space-y-1">
            <div className="text-[12px] uppercase font-bold text-olympiad-textMuted tracking-wider">Total Marks</div>
            <div className="text-2xl font-bold font-mono text-olympiad-primary">+{exam.totalMarks} Marks</div>
            <div className="text-[12px] text-olympiad-textMuted">Pass threshold: {exam.passingMarks} marks</div>
          </div>
          <div className="bg-white border border-olympiad-border rounded-lg p-5 shadow-subtle space-y-1">
            <div className="text-[12px] uppercase font-bold text-olympiad-textMuted tracking-wider">Questions</div>
            <div className="text-2xl font-bold font-mono text-navy-900">{questions.length} Items</div>
            <div className="text-[12px] text-olympiad-green font-semibold">● 100% interactive engines</div>
          </div>
          <div className="bg-white border border-olympiad-border rounded-lg p-5 shadow-subtle space-y-1">
            <div className="text-[12px] uppercase font-bold text-olympiad-textMuted tracking-wider">Candidates</div>
            <div className="text-2xl font-bold font-mono text-navy-900">{exam.participantCount || 0}</div>
            <div className="text-[12px] text-olympiad-textMuted">Attempts evaluated</div>
          </div>
        </div>

        {/* Question Roster */}
        <div className="bg-white border border-olympiad-border rounded-lg shadow-subtle overflow-hidden">
          <div className="px-6 py-4.5 border-b border-olympiad-border flex items-center justify-between">
            <div>
              <h3 className="text-[17px] font-bold text-navy-900">Compiled Question Roster</h3>
              <p className="text-[13px] text-olympiad-textMuted mt-0.5">
                Interactive questions presented to candidates in this Olympiad paper
              </p>
            </div>
            <span className="text-[13px] font-mono font-bold text-navy-800 bg-navy-50 px-3 py-1 rounded-md border border-navy-200">
              {questions.length} Total Items
            </span>
          </div>

          <div className="divide-y divide-olympiad-border">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5 flex items-center justify-between hover:bg-navy-50/40 transition-colors">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <span className="w-8 h-8 rounded-md bg-navy-100 text-navy-900 font-mono font-bold text-[13px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[13px] text-navy-900">{q.questionId}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-olympiad-primary rounded text-[11px] font-bold border border-blue-200">
                        {q.questionType}
                      </span>
                      {q.section && <span className="text-[12px] text-olympiad-textMuted font-medium truncate">{q.section}</span>}
                    </div>
                    <p className="text-[14px] text-navy-900 font-medium truncate mt-1">{q.questionText}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-[14px] text-navy-900 bg-navy-50 px-2.5 py-1 rounded-md border border-navy-200">
                    +{q.marks}
                  </span>
                  <Link
                    href={questionDetailRoute(roleBase, q.id)}
                    className="h-8 px-3 bg-[#EAF2FC] hover:bg-[#2468B2] hover:text-white text-[#1C5190] rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                    title="Inspect & Edit Question"
                  >
                    <span>Inspect</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

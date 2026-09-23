"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLE_PREFIX } from "@/lib/auth/sections";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { examService, questionService } from "@/services";
import { Exam } from "@/types/exam";
import { Question } from "@/types/question";
import { ArrowLeft, Play, Clock, Award, Users, CheckCircle, ExternalLink } from "lucide-react";

export default function ExamDetailScreen({ params }: { params: Promise<{ id: string }> }) {
  // Links resolve into the route group the active role actually owns.
  const { activeRole } = useAuth();
  const roleBase = ROLE_PREFIX[activeRole];
  const resolvedParams = use(params);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [e, qList] = await Promise.all([
        examService.getExam(resolvedParams.id),
        questionService.listQuestions(),
      ]);
      setExam(e);
      if (e) {
        const examQuestions = qList.filter((q) => e.questionIds.includes(q.id));
        setQuestions(examQuestions);
      }
      setLoading(false);
    }
    load();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="p-10 text-center space-y-2">
        <div className="w-8 h-8 border-2 border-olympiad-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[14px] text-olympiad-textMuted font-bold">Loading examination details...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-10 text-center space-y-3">
        <h2 className="text-xl font-bold text-navy-900">Examination Not Found</h2>
        <Link href={`${roleBase}/exams`} className="text-[14px] text-olympiad-primary font-bold hover:underline">
          Return to Examinations
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <AdminHeader
        title={exam.title}
        subtitle={`${exam.code} • ${exam.subjectName} • Grade ${exam.grade}`}
        actionButton={{
          label: "Launch Student Exam",
          href: `/exam/${exam.id}`,
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
            href={`/exam/${exam.id}`}
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
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-md bg-navy-100 text-navy-900 font-mono font-bold text-[13px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[13px] text-navy-900">{q.questionId}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-olympiad-primary rounded text-[11px] font-bold border border-blue-200">
                        {q.questionType}
                      </span>
                      {q.section && <span className="text-[12px] text-olympiad-textMuted font-medium">{q.section}</span>}
                    </div>
                    <p className="text-[14px] text-navy-900 font-medium line-clamp-1 mt-1">{q.questionText}</p>
                  </div>
                </div>

                <span className="font-mono font-bold text-[15px] text-navy-900 bg-navy-50 px-3 py-1 rounded-md border border-navy-200">
                  +{q.marks}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

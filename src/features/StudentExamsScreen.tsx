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
import { AcademicSeal } from "@/components/ui/OlympiadArt";
import { formatClock, remainingSecondsFor, type LiveSession } from "@/lib/dashboard/insights";
import { Play, RotateCcw, CheckCircle2, Clock, FileText } from "lucide-react";

/**
 * Candidate examination list.
 *
 * Shows what this candidate can sit, resume or review — and nothing about anyone else.
 * Attempt data is narrowed through the data-access layer, not filtered in the markup.
 */
export default function StudentExamsScreen() {
  const { scope, user } = useAuth();

  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
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

  const available = exams.filter((e) => e.status !== "Archived");

  if (loading) {
    return (
      <Card>
        <EmptyState kind="exams" title="Loading your examinations…" />
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-rise-in">
      <div>
        <h1 className="text-[24px] sm:text-[27px] font-bold tracking-[-0.02em]">Examinations</h1>
        <p className="mt-1.5 text-[13.5px] text-[#667085]">
          Papers available to you, and the ones you have already completed.
        </p>
      </div>

      <section>
        <SectionHeading title="Available to sit" />
        {available.length === 0 ? (
          <Card>
            <EmptyState
              kind="exams"
              title="No examination available yet"
              description="Your paper will appear here as soon as it is published."
            />
          </Card>
        ) : (
          <div className="grid gap-4">
            {available.map((exam) => {
              const resume = myResumable.get(exam.id);
              const done = myAttempts.find((a) => a.examId === exam.id);
              const count = exam.questionIds.length || exam.totalQuestions || questions.length;
              return (
                <Card key={exam.id} interactive className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <AcademicSeal className="w-10 h-10 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <h2 className="text-[15.5px] font-bold leading-snug">{exam.title}</h2>
                        <p className="text-[12.5px] text-[#667085] mt-0.5">
                          Class {exam.grade}
                          <span className="text-[#C3D8EC] mx-1.5">·</span>
                          {count} questions
                          <span className="text-[#C3D8EC] mx-1.5">·</span>
                          {exam.durationMinutes} minutes
                        </p>

                        {resume && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B4701F]">
                            <Clock className="w-3.5 h-3.5" />
                            Paused at question {resume.currentQuestionIndex + 1} ·{" "}
                            <span className="font-mono">{formatClock(remainingSecondsFor(resume))}</span> left
                          </p>
                        )}
                        {!resume && done && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#3E9E6F]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Submitted · {done.scoreDisplay}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {done && (
                        <ActionLink
                          href={`/results/${done.id}`}
                          tone="secondary"
                          icon={FileText}
                          className="h-11 sm:h-10"
                        >
                          View report
                        </ActionLink>
                      )}
                      <ActionLink
                        href={`/exam/${exam.id}`}
                        tone="primary"
                        icon={resume ? RotateCcw : Play}
                        className="h-11 sm:h-10"
                      >
                        {resume ? "Resume" : done ? "Sit again" : "Begin"}
                      </ActionLink>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {myAttempts.length > 0 && (
        <section>
          <SectionHeading
            title="Completed"
            description="Your submitted papers."
            action={{ label: "My results", href: "/student/results" }}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {myAttempts.map((a) => (
              <Card key={a.id} interactive className="p-4">
                <Link href={`/results/${a.id}`} className="flex items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold truncate">{a.examTitle}</span>
                    <span className="block text-[12px] text-[#667085] mt-0.5">
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

"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  SectionHeading,
  ActionLink,
  StatusMark,
  StatusKind,
  ScoreMark,
  AccuracySeal,
  DotGauge,
  ProgressRule,
  EmptyNote,
} from "@/components/ui/primitives";
import { SectionMotif, InteractionMotif, ExamCentreScene, AcademicSeal } from "@/components/ui/OlympiadArt";
import type { SectionInsight, ActivityPreview, ExamInsight, LiveSession } from "@/lib/dashboard/insights";
import { formatClock, remainingSecondsFor } from "@/lib/dashboard/insights";
import { ExamAttempt } from "@/types/attempt";
import { Play, Library, ArrowRight } from "lucide-react";

/* ── Hero ─────────────────────────────────────────────────── */

export function DashboardHero({
  greeting,
  name,
  roleLine,
  facts,
  primary,
  secondary,
}: {
  greeting: string;
  name: string;
  roleLine: string;
  facts: { value: React.ReactNode; label: string }[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Card className="overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="p-6 sm:p-8 min-w-0">
          <p className="text-[13px] font-medium text-[#667085]">
            {greeting}, <span className="text-[#172033] font-semibold">{name}</span>
          </p>
          <h1 className="mt-1 text-[24px] sm:text-[30px] leading-[1.15] font-bold text-[#172033] tracking-[-0.02em]">
            {roleLine}
          </h1>

          <dl className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            {facts.map((f) => (
              <div key={f.label}>
                <dd className="font-mono text-[22px] leading-none font-bold text-[#2563A8] tabular-nums">
                  {f.value}
                </dd>
                <dt className="text-[12.5px] text-[#667085] mt-1.5">{f.label}</dt>
              </div>
            ))}
          </dl>

          {(primary || secondary) && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {primary && (
                <ActionLink href={primary.href} tone="primary" icon={Play}>
                  {primary.label}
                </ActionLink>
              )}
              {secondary && (
                <ActionLink href={secondary.href} tone="secondary" icon={Library}>
                  {secondary.label}
                </ActionLink>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:block pr-6 xl:pr-8 pb-2">
          <ExamCentreScene className="w-[330px] xl:w-[380px] h-auto" />
        </div>
      </div>
    </Card>
  );
}

/* ── Syllabus / subject cards ─────────────────────────────── */

export function SyllabusGrid({ sections }: { sections: SectionInsight[] }) {
  if (!sections.length) {
    return (
      <Card>
        <EmptyNote>No syllabus sections found in the question bank yet.</EmptyNote>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sections.map((s) => (
        <Card key={s.title} interactive className="p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <SectionMotif kind={s.motif} className="w-11 h-11 shrink-0" />
            {s.accuracy !== null && <AccuracySeal percent={s.accuracy} size={40} />}
          </div>

          <h3 className="mt-4 text-[14.5px] font-bold text-[#172033] leading-snug">{s.title}</h3>

          <p className="mt-1.5 text-[12.5px] text-[#667085]">
            <span className="font-semibold text-[#2563A8]">{s.activityCount}</span> interactive{" "}
            {s.activityCount === 1 ? "activity" : "activities"}
            <span className="text-[#C2D4E8] mx-1.5">·</span>
            {s.questionCount} {s.questionCount === 1 ? "question" : "questions"}
          </p>

          <div className="mt-auto pt-4">
            <ProgressRule
              percent={s.questionCount ? (s.activityCount / s.questionCount) * 100 : 0}
              tone="#4FA8D8"
            />
            <p className="mt-2 text-[11px] text-[#98A2B3]">
              {s.accuracy !== null
                ? `${s.accuracy}% average accuracy so far`
                : "Awaiting first graded attempt"}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Activity previews ────────────────────────────────────── */

export function ActivityPreviewRow({ previews }: { previews: ActivityPreview[] }) {
  if (!previews.length) {
    return (
      <Card>
        <EmptyNote>No interactive activities are registered yet.</EmptyNote>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {previews.map((p) => (
        <Card key={p.questionId} interactive className="group p-5">
          <div className="flex items-start gap-4">
            <InteractionMotif kind={p.kind} animate className="w-[72px] h-[56px] shrink-0" />
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold text-[#172033] leading-snug truncate">{p.topic}</h3>
              <p className="mt-1 text-[12.5px] text-[#667085] leading-snug">{p.blurb}</p>
              <p className="mt-2 font-mono text-[11px] text-[#98A2B3]">{p.questionId}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Examinations ─────────────────────────────────────────── */

export function ExaminationList({ exams }: { exams: ExamInsight[] }) {
  if (!exams.length) {
    return (
      <Card>
        <EmptyNote>
          No examinations configured yet.
          <br />
          Create one to open your examination centre.
        </EmptyNote>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {exams.map((e) => (
        <Card key={e.exam.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-[#172033] leading-snug">{e.exam.title}</h3>
              <p className="text-[12.5px] text-[#667085] mt-0.5">
                Class {e.exam.grade}
                <span className="text-[#C2D4E8] mx-1.5">·</span>
                {e.exam.code}
              </p>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-[#2563A8] bg-[#EAF2FB] border border-[#DCE9F7] rounded-lg px-2.5 py-1">
              {e.exam.status || "Active"}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <dt className="text-[11px] text-[#98A2B3]">Participating</dt>
              <dd className="mt-1 flex items-center gap-2">
                <span className="font-mono text-[16px] font-bold text-[#172033] tabular-nums">
                  {e.participants}
                </span>
                {e.participants > 0 && (
                  <DotGauge filled={e.completed} total={e.participants} max={10} tone="#2563A8" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#98A2B3]">Questions</dt>
              <dd className="mt-1 font-mono text-[16px] font-bold text-[#172033] tabular-nums">
                {e.questionCount}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#98A2B3]">
                {e.soonestRemainingSeconds !== null ? "Time remaining" : "Duration"}
              </dt>
              <dd className="mt-1 font-mono text-[16px] font-bold tabular-nums text-[#172033]">
                {e.soonestRemainingSeconds !== null
                  ? formatClock(e.soonestRemainingSeconds)
                  : `${e.exam.durationMinutes} min`}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#98A2B3]">Average score</dt>
              <dd className="mt-1 font-mono text-[16px] font-bold tabular-nums text-[#172033]">
                {e.avgScore !== null ? `${e.avgScore}%` : "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-5 pt-4 border-t border-[#E3E8EF] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-[12px] text-[#667085]">
              <StatusMark kind="solving" label={`${e.inProgress} solving`} />
              <StatusMark kind="submitted" label={`${e.completed} submitted`} />
            </div>
            <ActionLink href={`/exam/${e.exam.id}`} tone="secondary" className="h-9 text-[12.5px]">
              Open examination
            </ActionLink>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── Live examination panel ───────────────────────────────── */

export function LivePanel({ sessions, totalByExam }: { sessions: LiveSession[]; totalByExam: Record<string, number> }) {
  const live = sessions.filter((s) => s.status === "in_progress");

  return (
    <Card className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-[#172033] tracking-[-0.01em]">Live examination</h2>
          <p className="text-[12.5px] text-[#667085] mt-0.5">Candidates currently solving</p>
        </div>
        {live.length > 0 && (
          <span className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2E8F59]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39A96B] animate-pulse" />
            {live.length}
          </span>
        )}
      </div>

      {live.length === 0 ? (
        <EmptyNote>
          Nobody is taking an examination right now.
          <br />
          Live candidates appear here the moment they begin.
        </EmptyNote>
      ) : (
        <ul className="mt-4 -mx-1 divide-y divide-[#E3E8EF]">
          {live.slice(0, 7).map((s) => {
            const total = totalByExam[s.examId] || 0;
            const answered = Object.keys(s.answers || {}).length;
            const remaining = remainingSecondsFor(s);
            return (
              <li key={s.sessionId} className="px-1 py-3 flex items-center gap-3">
                <span className="w-8 h-8 shrink-0 rounded-lg bg-[#EAF2FB] text-[#2563A8] grid place-items-center text-[11px] font-bold">
                  {(s.studentName || "?").slice(0, 2).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#172033] truncate">
                    {s.studentName || "Candidate"}
                  </p>
                  <p className="text-[11.5px] text-[#98A2B3] truncate">
                    Question {s.currentQuestionIndex + 1}
                    {total > 0 && ` of ${total}`}
                    <span className="text-[#C2D4E8] mx-1.5">·</span>
                    {answered} answered
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <StatusMark kind={remaining > 0 ? "solving" : "paused"} />
                  <p className="font-mono text-[11px] text-[#98A2B3] tabular-nums mt-0.5">
                    {formatClock(remaining)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto pt-4">
        <Link
          href="/admin/live-monitor"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2563A8] hover:text-[#1B4E88] transition-colors"
        >
          Open live monitor <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}

/* ── Results ledger ───────────────────────────────────────── */

export function ResultsLedger({ attempts, limit = 8 }: { attempts: ExamAttempt[]; limit?: number }) {
  if (!attempts.length) {
    return (
      <Card>
        <EmptyNote>
          No examination records yet.
          <br />
          Completed papers are entered here automatically once a candidate submits.
        </EmptyNote>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Desktop: ruled academic register */}
      <table className="hidden sm:table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E3E8EF]">
            {["Candidate", "Examination", "Score", "Accuracy", "Submitted", ""].map((h, i) => (
              <th
                key={h || i}
                className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3] ${
                  i === 2 || i === 3 ? "text-center" : ""
                } ${i === 5 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E3E8EF]">
          {attempts.slice(0, limit).map((a) => (
            <tr key={a.id} className="hover:bg-[#F6F8FB] transition-colors">
              <td className="px-5 py-3.5">
                <div className="text-[13.5px] font-semibold text-[#172033]">{a.student.name}</div>
                <div className="font-mono text-[11px] text-[#98A2B3]">
                  {a.student.studentId} · Class {a.student.grade}
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] text-[#667085] max-w-[260px] truncate">
                {a.examTitle}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-center">
                  <ScoreMark score={a.totalMarks} max={a.maximumMarks} />
                </div>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-center">
                  <AccuracySeal percent={a.percentage} size={40} />
                </div>
              </td>
              <td className="px-5 py-3.5 font-mono text-[12px] text-[#98A2B3] tabular-nums">
                {new Date(a.submittedAt).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                })}
              </td>
              <td className="px-5 py-3.5 text-right">
                <Link
                  href={`/results/${a.id}`}
                  className="text-[12.5px] font-semibold text-[#2563A8] hover:text-[#1B4E88] whitespace-nowrap transition-colors"
                >
                  View report →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked records, not a squeezed table */}
      <ul className="sm:hidden divide-y divide-[#E3E8EF]">
        {attempts.slice(0, limit).map((a) => (
          <li key={a.id}>
            <Link href={`/results/${a.id}`} className="flex items-center gap-4 px-4 py-4 active:bg-[#F6F8FB]">
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[#172033] truncate">{a.student.name}</div>
                <div className="text-[12px] text-[#667085] truncate mt-0.5">{a.examTitle}</div>
                <div className="font-mono text-[11px] text-[#98A2B3] mt-1">
                  {new Date(a.submittedAt).toLocaleDateString()}
                </div>
              </div>
              <ScoreMark score={a.totalMarks} max={a.maximumMarks} size="sm" />
              <AccuracySeal percent={a.percentage} size={38} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── Student: continue / next exam ────────────────────────── */

export function ContinueExamCard({
  session,
  totalQuestions,
}: {
  session: LiveSession;
  totalQuestions: number;
}) {
  const answered = Object.keys(session.answers || {}).length;
  const current = session.currentQuestionIndex + 1;
  const remaining = remainingSecondsFor(session);

  // A short window of the question path around where the student stopped
  const windowStart = Math.max(0, Math.min(current - 4, Math.max(0, totalQuestions - 7)));
  const path = Array.from({ length: Math.min(7, totalQuestions) }, (_, i) => windowStart + i + 1);

  return (
    <Card className="p-6 border-[#DCE9F7] bg-gradient-to-br from-[#F8FBFE] to-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#2563A8]">
            Continue where you left off
          </p>
          <h2 className="mt-1.5 text-[19px] font-bold text-[#172033] tracking-[-0.01em]">
            {session.examTitle}
          </h2>
          <p className="text-[13px] text-[#667085] mt-1">
            Question {current}
            {totalQuestions > 0 && ` of ${totalQuestions}`}
            <span className="text-[#C2D4E8] mx-2">·</span>
            {answered} answered
            <span className="text-[#C2D4E8] mx-2">·</span>
            <span className="font-mono tabular-nums">{formatClock(remaining)}</span> left
          </p>
        </div>
        <ActionLink href={`/exam/${session.examId}`} tone="primary" icon={Play}>
          Continue examination
        </ActionLink>
      </div>

      {/* Question path */}
      <div className="mt-6 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {path.map((n, i) => {
            const done = n < current;
            const here = n === current;
            return (
              <React.Fragment key={n}>
                {i > 0 && <span className="w-5 h-px bg-[#E3E8EF]" />}
                <span
                  className={`w-8 h-8 rounded-full grid place-items-center font-mono text-[11px] font-bold tabular-nums border transition-colors ${
                    here
                      ? "bg-[#2563A8] border-[#2563A8] text-white"
                      : done
                      ? "bg-[#E9F7EF] border-[#BEE5CF] text-[#2E8F59]"
                      : "bg-white border-[#E3E8EF] text-[#98A2B3]"
                  }`}
                >
                  {done ? "✓" : n}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-[11.5px] text-[#98A2B3]">
        Your answers and every activity you have set up are saved on this device.
      </p>
    </Card>
  );
}

export function NextExamCard({
  title,
  grade,
  questionCount,
  durationMinutes,
  href,
}: {
  title: string;
  grade: number | string;
  questionCount: number;
  durationMinutes: number;
  href: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <AcademicSeal className="w-10 h-10 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#2563A8]">
            Your next examination
          </p>
          <h2 className="mt-1.5 text-[19px] font-bold text-[#172033] tracking-[-0.01em]">{title}</h2>
          <p className="text-[13px] text-[#667085] mt-1">
            Class {grade}
            <span className="text-[#C2D4E8] mx-2">·</span>
            {questionCount} questions
            <span className="text-[#C2D4E8] mx-2">·</span>
            {durationMinutes} minutes
          </p>
          <div className="mt-5">
            <ActionLink href={href} tone="primary" icon={Play}>
              Begin examination
            </ActionLink>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ── Student results summary ──────────────────────────────── */

export function StudentProgress({ attempts }: { attempts: ExamAttempt[] }) {
  if (!attempts.length) {
    return (
      <Card>
        <EmptyNote>
          Your results will appear here once you finish an examination.
        </EmptyNote>
      </Card>
    );
  }

  const best = attempts.reduce((m, a) => (a.percentage > m.percentage ? a : m), attempts[0]);
  const avg = Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-5">
        <p className="text-[12px] text-[#667085]">Papers completed</p>
        <p className="mt-2 font-mono text-[26px] font-bold text-[#172033] tabular-nums leading-none">
          {attempts.length}
        </p>
      </Card>
      <Card className="p-5">
        <p className="text-[12px] text-[#667085]">Average accuracy</p>
        <div className="mt-2 flex items-center gap-3">
          <AccuracySeal percent={avg} size={42} />
          <span className="text-[12px] text-[#98A2B3]">across all papers</span>
        </div>
      </Card>
      <Card className="p-5">
        <p className="text-[12px] text-[#667085]">Best result</p>
        <div className="mt-2 flex items-center gap-3">
          <ScoreMark score={best.totalMarks} max={best.maximumMarks} />
          <span className="text-[12px] text-[#98A2B3] truncate">{best.examTitle}</span>
        </div>
      </Card>
    </div>
  );
}

export { SectionHeading };
export type { StatusKind };

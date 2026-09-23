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
} from "@/components/ui/primitives";
import {
  SectionMotif,
  ExamCentreScene,
  AcademicSeal,
  HeroBackdrop,
  EmptyArt,
  type EmptyKind,
} from "@/components/ui/OlympiadArt";
import { Sparkline, BarSeries, ColumnChart, Donut, ChartLegend, type Point } from "@/components/ui/charts";
import type { SectionInsight, ExamInsight, LiveSession } from "@/lib/dashboard/insights";
import { formatClock, remainingSecondsFor, toneForIndex } from "@/lib/dashboard/insights";
import { ExamAttempt } from "@/types/attempt";
import { Play, Library, ArrowRight, type LucideIcon } from "lucide-react";

/* ── Empty state ──────────────────────────────────────────── */

export function EmptyState({
  kind,
  title,
  description,
  action,
}: {
  kind: EmptyKind;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-10">
      <EmptyArt kind={kind} className="w-[120px] h-[90px] mb-4" />
      <p className="text-[14px] font-semibold text-[#182338]">{title}</p>
      {description && (
        <p className="text-[12.5px] text-[#667085] mt-1.5 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-5">
          <ActionLink href={action.href} tone="secondary" className="h-11 sm:h-9 text-[12.5px]">
            {action.label}
          </ActionLink>
        </div>
      )}
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */

export function DashboardHero({
  greeting,
  name,
  roleLine,
  blurb,
  facts,
  primary,
  secondary,
}: {
  greeting: string;
  name: string;
  roleLine: string;
  blurb?: string;
  facts: { value: React.ReactNode; label: string; tone?: string }[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#D9E8F8] bg-gradient-to-br from-[#EAF2FC] via-[#F4F8FD] to-[#FDF5DF]/50 shadow-subtle">
      <HeroBackdrop className="absolute inset-0 w-full h-full" />

      <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="p-5 sm:p-7 lg:p-8 min-w-0">
          <p className="text-[13px] font-medium text-[#667085]">
            {greeting}, <span className="text-[#182338] font-semibold">{name}</span>
          </p>
          <h1 className="mt-1 text-[22px] sm:text-[27px] lg:text-[31px] leading-[1.15] font-bold text-[#182338] tracking-[-0.02em]">
            {roleLine}
          </h1>
          {blurb && (
            <p className="mt-2.5 text-[13.5px] text-[#667085] leading-relaxed max-w-lg">{blurb}</p>
          )}

          {(primary || secondary) && (
            <div className="mt-5 flex flex-wrap gap-2.5">
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

          <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-4">
            {facts.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5">
                <span
                  className="w-1 h-9 rounded-full shrink-0"
                  style={{ background: f.tone || "#2468B2" }}
                />
                <span>
                  <dd className="font-mono text-[21px] leading-none font-bold text-[#182338] tabular-nums">
                    {f.value}
                  </dd>
                  <dt className="text-[12px] text-[#667085] mt-1">{f.label}</dt>
                </span>
              </div>
            ))}
          </dl>
        </div>

        <div className="hidden lg:block pr-6 xl:pr-9 pb-3 shrink-0">
          <ExamCentreScene className="w-[320px] xl:w-[368px] h-auto" />
        </div>
      </div>
    </section>
  );
}

/* ── Metric cards ─────────────────────────────────────────── */

export interface MetricCard {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone: string;
  toneSoft: string;
  icon: LucideIcon;
  /** One of these renders as the card's small visual */
  spark?: number[];
  dots?: { filled: number; total: number };
  progress?: number;
  donut?: Point[];
}

export function MetricRow({ cards }: { cards: MetricCard[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} interactive className="p-4 sm:p-5 relative overflow-hidden">
            {/* Accent rail keeps each metric distinguishable without colouring the whole card */}
            <span
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: c.tone }}
              aria-hidden
            />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11.5px] font-semibold uppercase tracking-wider text-[#98A2B3] truncate">
                  {c.label}
                </p>
                <p className="mt-2 font-mono text-[28px] leading-none font-bold text-[#182338] tabular-nums">
                  {c.value}
                </p>
              </div>
              <span
                className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
                style={{ background: c.toneSoft, color: c.tone }}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </span>
            </div>

            <div className="mt-3.5 min-h-[34px] flex items-end">
              {c.spark && <Sparkline values={c.spark} tone={c.tone} className="w-full h-[34px]" />}
              {c.dots && (
                <DotGauge filled={c.dots.filled} total={c.dots.total} max={12} tone={c.tone} />
              )}
              {c.progress !== undefined && (
                <div className="w-full">
                  <ProgressRule percent={c.progress} tone={c.tone} />
                </div>
              )}
              {c.donut && (
                <div className="flex items-center gap-1.5 w-full">
                  {c.donut.map((d) => (
                    <span
                      key={d.label}
                      className="h-2 rounded-full transition-all"
                      style={{
                        background: d.tone,
                        flexGrow: Math.max(d.value, 0.001),
                        minWidth: d.value > 0 ? 6 : 0,
                      }}
                      title={`${d.label}: ${d.value}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {c.hint && <p className="mt-2.5 text-[11.5px] text-[#667085] truncate">{c.hint}</p>}
          </Card>
        );
      })}
    </div>
  );
}

/* ── Syllabus / subject cards ─────────────────────────────── */

export function SyllabusGrid({ sections }: { sections: SectionInsight[] }) {
  if (!sections.length) {
    return (
      <Card>
        <EmptyState
          kind="exams"
          title="No syllabus sections yet"
          description="Sections appear here once questions are added to the bank."
          action={{ label: "Open question bank", href: "/admin/question-bank" }}
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sections.map((s, i) => {
        const tone = toneForIndex(i);
        const coverage = s.questionCount ? (s.activityCount / s.questionCount) * 100 : 0;
        return (
          <Card key={s.title} interactive className="group p-0 overflow-hidden flex flex-col">
            {/* Tinted head carries the subject's identity */}
            <div
              className="relative px-5 pt-5 pb-4 border-b border-[#E1E7EF]"
              style={{ background: `linear-gradient(135deg, ${tone}14, ${tone}05)` }}
            >
              <div className="flex items-start justify-between gap-3">
                <SectionMotif
                  kind={s.motif}
                  className="w-12 h-12 shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
                {s.accuracy !== null && <AccuracySeal percent={s.accuracy} size={42} />}
              </div>
              <h3 className="mt-3.5 text-[14.5px] font-bold text-[#182338] leading-snug">{s.title}</h3>
            </div>

            <div className="p-5 pt-4 flex-1 flex flex-col">
              <div className="flex items-baseline gap-4">
                <span>
                  <span className="font-mono text-[19px] font-bold tabular-nums" style={{ color: tone }}>
                    {s.activityCount}
                  </span>
                  <span className="text-[11.5px] text-[#667085] ml-1.5">activities</span>
                </span>
                <span>
                  <span className="font-mono text-[19px] font-bold text-[#182338] tabular-nums">
                    {s.questionCount}
                  </span>
                  <span className="text-[11.5px] text-[#667085] ml-1.5">questions</span>
                </span>
              </div>

              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-[11px] text-[#667085] mb-1.5">
                  <span>Interactive coverage</span>
                  <span className="font-mono font-semibold tabular-nums">{Math.round(coverage)}%</span>
                </div>
                <ProgressRule percent={coverage} tone={tone} />
                <p className="mt-2.5 text-[11px] text-[#98A2B3]">
                  {s.accuracy !== null
                    ? `${s.accuracy}% average accuracy so far`
                    : "Awaiting first graded attempt"}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ── Examinations ─────────────────────────────────────────── */

export function ExaminationList({ exams }: { exams: ExamInsight[] }) {
  if (!exams.length) {
    return (
      <Card>
        <EmptyState
          kind="exams"
          title="No examinations configured"
          description="Create a paper to open your examination centre."
          action={{ label: "Create examination", href: "/admin/exams/new" }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {exams.map((e) => {
        const completionPct =
          e.participants > 0 ? Math.round((e.completed / e.participants) * 100) : 0;
        return (
          <Card key={e.exam.id} interactive className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[15.5px] font-bold text-[#182338] leading-snug">
                  {e.exam.title}
                </h3>
                <p className="text-[12.5px] text-[#667085] mt-0.5">
                  Class {e.exam.grade}
                  <span className="text-[#C3D8EC] mx-1.5">·</span>
                  {e.exam.code}
                </p>
              </div>
              <StatusMark
                kind={e.inProgress > 0 ? "solving" : e.completed > 0 ? "submitted" : "idle"}
                label={
                  e.inProgress > 0
                    ? `Live · ${e.inProgress} solving`
                    : e.completed > 0
                    ? `${e.exam.status || "Published"}`
                    : `${e.exam.status || "Published"}`
                }
              />
            </div>

            <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
              {[
                { t: "Questions", v: e.questionCount },
                { t: "Duration", v: `${e.exam.durationMinutes} min` },
                { t: "Participating", v: e.participants },
                {
                  t: e.soonestRemainingSeconds !== null ? "Time remaining" : "Average score",
                  v:
                    e.soonestRemainingSeconds !== null
                      ? formatClock(e.soonestRemainingSeconds)
                      : e.avgScore !== null
                      ? `${e.avgScore}%`
                      : "—",
                },
              ].map((cell) => (
                <div key={cell.t} className="min-w-0">
                  <dt className="text-[11px] text-[#98A2B3] truncate">{cell.t}</dt>
                  <dd className="mt-1 font-mono text-[16px] font-bold text-[#182338] tabular-nums truncate">
                    {cell.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[11.5px] mb-1.5">
                <span className="text-[#667085]">
                  {e.completed} submitted
                  {e.inProgress > 0 && ` · ${e.inProgress} still solving`}
                </span>
                <span className="font-mono font-semibold text-[#182338] tabular-nums">
                  {completionPct}%
                </span>
              </div>
              {/* Two-tone rule: submitted, then still-solving */}
              <div className="h-2 w-full rounded-full bg-[#EDF1F7] overflow-hidden flex">
                <div
                  className="h-full transition-[width] duration-700"
                  style={{
                    width: `${e.participants ? (e.completed / e.participants) * 100 : 0}%`,
                    background: "#2468B2",
                  }}
                />
                <div
                  className="h-full transition-[width] duration-700"
                  style={{
                    width: `${e.participants ? (e.inProgress / e.participants) * 100 : 0}%`,
                    background: "#59B6DE",
                  }}
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E1E7EF] flex flex-wrap items-center justify-between gap-3">
              {e.passRate !== null ? (
                <span className="text-[12.5px] text-[#667085]">
                  Pass rate <span className="font-mono font-semibold text-[#3E9E6F]">{e.passRate}%</span>
                </span>
              ) : (
                <span className="text-[12.5px] text-[#98A2B3]">No graded attempts yet</span>
              )}
              <ActionLink href={`/exam/${e.exam.id}`} tone="secondary" className="h-11 sm:h-9 text-[12.5px]">
                Open examination
              </ActionLink>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ── Live examination panel ───────────────────────────────── */

export function LivePanel({
  sessions,
  totalByExam,
}: {
  sessions: LiveSession[];
  totalByExam: Record<string, number>;
}) {
  const live = sessions.filter((s) => s.status === "in_progress");

  return (
    <Card className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-[#182338] tracking-[-0.01em]">Live now</h2>
          <p className="text-[12.5px] text-[#667085] mt-0.5 truncate">
            {live.length > 0
              ? `${live.length} ${live.length === 1 ? "candidate" : "candidates"} solving`
              : "Candidates appear the moment they begin"}
          </p>
        </div>
        {live.length > 0 && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#EAF7F1] px-2.5 py-1 text-[12px] font-semibold text-[#3E9E6F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55B987] animate-pulse" />
            Live
          </span>
        )}
      </div>

      {live.length === 0 ? (
        <EmptyState
          kind="candidates"
          title="Nobody is taking an examination"
          description="Live candidates and their progress show up here in real time."
        />
      ) : (
        <ul className="mt-4 divide-y divide-[#E1E7EF]">
          {live.slice(0, 6).map((s) => {
            const total = totalByExam[s.examId] || 0;
            const answered = Object.keys(s.answers || {}).length;
            const remaining = remainingSecondsFor(s);
            const pct = total > 0 ? (answered / total) * 100 : 0;
            return (
              <li key={s.sessionId} className="py-3 flex items-center gap-3">
                <span className="w-9 h-9 shrink-0 rounded-xl bg-[#EAF2FC] text-[#2468B2] grid place-items-center text-[11.5px] font-bold">
                  {(s.studentName || "?").slice(0, 2).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[#182338] truncate">
                      {s.studentName || "Candidate"}
                    </p>
                    <p className="font-mono text-[11.5px] text-[#667085] tabular-nums shrink-0">
                      Q{s.currentQuestionIndex + 1}
                      {total > 0 && <span className="text-[#98A2B3]">/{total}</span>}
                    </p>
                  </div>
                  <div className="mt-1.5">
                    <ProgressRule percent={pct} tone="#59B6DE" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <StatusMark kind={remaining > 0 ? "solving" : "paused"} />
                    <span className="font-mono text-[11px] text-[#98A2B3] tabular-nums">
                      {formatClock(remaining)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto pt-4">
        <Link
          href="/admin/live-monitor"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2468B2] hover:text-[#1C5190] transition-colors"
        >
          Open live monitor <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}

/* ── Analytics ────────────────────────────────────────────── */

export function AnalyticsGrid({
  sectionPoints,
  scoreDistribution,
  participation,
  difficultyMix,
  attemptCount,
}: {
  sectionPoints: Point[];
  scoreDistribution: Point[];
  participation: Point[];
  difficultyMix: Point[];
  attemptCount: number;
}) {
  const bankTotal = difficultyMix.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Subject performance */}
      <Card className="lg:col-span-5 p-5">
        <h3 className="text-[14px] font-bold text-[#182338]">Performance by section</h3>
        <p className="text-[12px] text-[#667085] mt-0.5">Average accuracy across graded attempts</p>
        <div className="mt-5">
          {sectionPoints.length > 0 ? (
            <BarSeries points={sectionPoints} max={100} suffix="%" />
          ) : (
            <EmptyState
              kind="chart"
              title="No graded attempts yet"
              description="Section accuracy appears once a candidate submits a paper."
            />
          )}
        </div>
      </Card>

      {/* Score distribution */}
      <Card className="lg:col-span-4 p-5">
        <h3 className="text-[14px] font-bold text-[#182338]">Score distribution</h3>
        <p className="text-[12px] text-[#667085] mt-0.5">
          {attemptCount > 0
            ? `${attemptCount} graded ${attemptCount === 1 ? "paper" : "papers"}`
            : "Bands fill as papers are marked"}
        </p>
        <div className="mt-5">
          {scoreDistribution.length > 0 ? (
            <ColumnChart points={scoreDistribution} height={140} />
          ) : (
            <EmptyState kind="chart" title="No graded attempts yet" />
          )}
        </div>
      </Card>

      {/* Question bank composition */}
      <Card className="lg:col-span-3 p-5">
        <h3 className="text-[14px] font-bold text-[#182338]">Question bank</h3>
        <p className="text-[12px] text-[#667085] mt-0.5">By difficulty</p>
        {difficultyMix.length > 0 ? (
          <div className="mt-5 flex flex-col sm:flex-row lg:flex-col items-center gap-5">
            <Donut
              segments={difficultyMix}
              centerValue={bankTotal}
              centerLabel="questions"
              size={124}
              thickness={13}
            />
            <div className="w-full">
              <ChartLegend points={difficultyMix} />
            </div>
          </div>
        ) : (
          <EmptyState kind="chart" title="Question bank is empty" />
        )}
      </Card>

      {/* Participation trend */}
      {participation.length > 0 && (
        <Card className="lg:col-span-12 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h3 className="text-[14px] font-bold text-[#182338]">Submissions this week</h3>
              <p className="text-[12px] text-[#667085] mt-0.5">Papers submitted per day</p>
            </div>
            <span className="font-mono text-[13px] font-semibold text-[#2468B2] tabular-nums">
              {participation.reduce((s, p) => s + p.value, 0)} total
            </span>
          </div>
          <div className="mt-5">
            <ColumnChart
              points={participation.map((p) => ({ ...p, tone: "#2468B2" }))}
              height={120}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

/* ── Results ledger ───────────────────────────────────────── */

export function ResultsLedger({ attempts, limit = 8 }: { attempts: ExamAttempt[]; limit?: number }) {
  if (!attempts.length) {
    return (
      <Card>
        <EmptyState
          kind="results"
          title="No examination records yet"
          description="Completed papers are entered here automatically the moment a candidate submits."
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Desktop: ruled academic register */}
      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E1E7EF] bg-[#F9FBFD]">
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
        <tbody className="divide-y divide-[#E1E7EF]">
          {attempts.slice(0, limit).map((a) => (
            <tr key={a.id} className="hover:bg-[#F9FBFD] transition-colors">
              <td className="px-5 py-3.5">
                <div className="text-[13.5px] font-semibold text-[#182338]">{a.student.name}</div>
                <div className="font-mono text-[11px] text-[#98A2B3]">
                  {a.student.studentId} · Class {a.student.grade}
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] text-[#667085] max-w-[240px] truncate">
                {a.examTitle}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-center">
                  <ScoreMark score={a.totalMarks} max={a.maximumMarks} />
                </div>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-center">
                  <AccuracySeal percent={a.percentage} size={42} />
                </div>
              </td>
              <td className="px-5 py-3.5 font-mono text-[12px] text-[#98A2B3] tabular-nums whitespace-nowrap">
                {new Date(a.submittedAt).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                })}
              </td>
              <td className="px-5 py-3.5 text-right">
                <Link
                  href={`/results/${a.id}`}
                  className="text-[12.5px] font-semibold text-[#2468B2] hover:text-[#1C5190] whitespace-nowrap transition-colors"
                >
                  View report →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tablet & mobile: records as cards, never a squeezed table */}
      <ul className="md:hidden divide-y divide-[#E1E7EF]">
        {attempts.slice(0, limit).map((a) => (
          <li key={a.id}>
            <Link
              href={`/results/${a.id}`}
              className="flex items-center gap-4 px-4 py-4 active:bg-[#F9FBFD] min-h-[72px]"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[#182338] truncate">
                  {a.student.name}
                </div>
                <div className="text-[12px] text-[#667085] truncate mt-0.5">{a.examTitle}</div>
                <div className="font-mono text-[11px] text-[#98A2B3] mt-1">
                  {new Date(a.submittedAt).toLocaleDateString()}
                </div>
              </div>
              <ScoreMark score={a.totalMarks} max={a.maximumMarks} />
              <AccuracySeal percent={a.percentage} size={40} />
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

  const windowStart = Math.max(0, Math.min(current - 4, Math.max(0, totalQuestions - 7)));
  const path = Array.from({ length: Math.min(7, totalQuestions) }, (_, i) => windowStart + i + 1);

  return (
    <Card className="p-5 sm:p-6 border-[#D9E8F8] bg-gradient-to-br from-[#EAF2FC] to-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11.5px] font-semibold uppercase tracking-wider text-[#2468B2]">
            Continue where you left off
          </p>
          <h2 className="mt-1.5 text-[18px] sm:text-[20px] font-bold text-[#182338] tracking-[-0.01em]">
            {session.examTitle}
          </h2>
          <p className="text-[13px] text-[#667085] mt-1">
            Question {current}
            {totalQuestions > 0 && ` of ${totalQuestions}`}
            <span className="text-[#C3D8EC] mx-2">·</span>
            {answered} answered
            <span className="text-[#C3D8EC] mx-2">·</span>
            <span className="font-mono tabular-nums">{formatClock(remaining)}</span> left
          </p>
        </div>
        <ActionLink href={`/exam/${session.examId}`} tone="primary" icon={Play}>
          Continue examination
        </ActionLink>
      </div>

      <div className="mt-6 overflow-x-auto -mx-1 px-1 pb-1">
        <div className="flex items-center gap-1 min-w-max">
          {path.map((n, i) => {
            const done = n < current;
            const here = n === current;
            return (
              <React.Fragment key={n}>
                {i > 0 && <span className="w-4 sm:w-5 h-px bg-[#C3D8EC]" />}
                <span
                  className={`w-9 h-9 rounded-full grid place-items-center font-mono text-[11.5px] font-bold tabular-nums border transition-colors ${
                    here
                      ? "bg-[#2468B2] border-[#2468B2] text-white shadow-subtle"
                      : done
                      ? "bg-[#EAF7F1] border-[#BFE6D3] text-[#3E9E6F]"
                      : "bg-white border-[#E1E7EF] text-[#98A2B3]"
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
        Your answers and every activity you set up are saved on this device.
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
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <AcademicSeal className="w-10 h-10 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-semibold uppercase tracking-wider text-[#2468B2]">
            Your next examination
          </p>
          <h2 className="mt-1.5 text-[18px] sm:text-[20px] font-bold text-[#182338] tracking-[-0.01em]">
            {title}
          </h2>
          <p className="text-[13px] text-[#667085] mt-1">
            Class {grade}
            <span className="text-[#C3D8EC] mx-2">·</span>
            {questionCount} questions
            <span className="text-[#C3D8EC] mx-2">·</span>
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
        <EmptyState
          kind="results"
          title="No results yet"
          description="Finish an examination and your marked paper will appear here."
        />
      </Card>
    );
  }

  const best = attempts.reduce((m, a) => (a.percentage > m.percentage ? a : m), attempts[0]);
  const avg = Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-5">
        <p className="text-[12px] text-[#667085]">Papers completed</p>
        <p className="mt-2 font-mono text-[28px] font-bold text-[#182338] tabular-nums leading-none">
          {attempts.length}
        </p>
      </Card>
      <Card className="p-5">
        <p className="text-[12px] text-[#667085]">Average accuracy</p>
        <div className="mt-2 flex items-center gap-3">
          <AccuracySeal percent={avg} size={44} />
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

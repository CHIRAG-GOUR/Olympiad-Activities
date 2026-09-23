"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { questionRepository, examRepository } from "@/repositories";
import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import { hasBespokeActivity } from "@/components/activities/ActivityRegistry";
import { Card, SectionHeading, EmptyNote, ProgressRule } from "@/components/ui/primitives";
import { InteractionMotif, SectionMotif } from "@/components/ui/OlympiadArt";
import { interactionKindFor } from "@/lib/dashboard/insights";
import { Search } from "lucide-react";

/**
 * Activity Library.
 *
 * Every question in the bank that carries a bespoke interactive activity, with the
 * interaction it uses. This route previously just bounced to the question repository;
 * it now shows what the platform's activities actually are.
 */

const KIND_LABEL: Record<string, string> = {
  rotate: "Rotate & inspect",
  plot: "Place & plot",
  arrange: "Arrange & sort",
  simulate: "Run a simulation",
  construct: "Construct a figure",
  measure: "Measure & read off",
};

export default function ActivityLibraryPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([questionRepository.listQuestions(), examRepository.listExams()])
      .then(([q, e]) => {
        if (cancelled) return;
        setQuestions(q);
        setExams(e);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const activities = useMemo(
    () =>
      questions
        .filter((q) => hasBespokeActivity(q.id) || hasBespokeActivity(q.questionId))
        .map((q) => ({ question: q, kind: interactionKindFor(q) })),
    [questions]
  );

  const sections = useMemo(
    () => Array.from(new Set(questions.map((q) => q.section).filter(Boolean))) as string[],
    [questions]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return activities.filter(({ question: q, kind }) => {
      if (section !== "all" && q.section !== section) return false;
      if (!needle) return true;
      return (
        q.topic?.toLowerCase().includes(needle) ||
        q.questionId?.toLowerCase().includes(needle) ||
        q.questionText?.toLowerCase().includes(needle) ||
        KIND_LABEL[kind]?.toLowerCase().includes(needle)
      );
    });
  }, [activities, query, section]);

  const coverage = questions.length ? Math.round((activities.length / questions.length) * 100) : 0;
  const primaryExamId = exams[0]?.id;

  return (
    <div className="space-y-8 animate-rise-in">
      {/* Header */}
      <Card className="p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold text-[#172033] tracking-[-0.02em]">Activity library</h1>
            <p className="text-[13.5px] text-[#667085] mt-1.5 max-w-xl leading-relaxed">
              Every question in the bank with a bespoke interactive activity behind it. The student
              manipulates the activity and the manipulation itself produces the answer.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <div className="font-mono text-[26px] font-bold text-[#2563A8] leading-none tabular-nums">
                {activities.length}
              </div>
              <div className="text-[12px] text-[#667085] mt-1.5">Activities</div>
            </div>
            <div className="min-w-[128px]">
              <div className="font-mono text-[26px] font-bold text-[#172033] leading-none tabular-nums">
                {coverage}%
              </div>
              <div className="text-[12px] text-[#667085] mt-1.5 mb-2">Bank coverage</div>
              <ProgressRule percent={coverage} tone="#4FA8D8" />
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, interaction or question code"
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#E3E8EF] rounded-xl text-[13.5px] text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#2563A8] focus:ring-2 focus:ring-[#2563A8]/15 transition-shadow"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSection("all")}
            className={`h-11 px-3.5 rounded-xl text-[13px] font-semibold border transition-colors ${
              section === "all"
                ? "bg-[#2563A8] border-[#2563A8] text-white"
                : "bg-white border-[#E3E8EF] text-[#667085] hover:text-[#172033] hover:border-[#C2D4E8]"
            }`}
          >
            All sections
          </button>
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`h-11 px-3.5 rounded-xl text-[13px] font-semibold border transition-colors ${
                section === s
                  ? "bg-[#2563A8] border-[#2563A8] text-white"
                  : "bg-white border-[#E3E8EF] text-[#667085] hover:text-[#172033] hover:border-[#C2D4E8]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <Card>
          <EmptyNote>Loading activities…</EmptyNote>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyNote>No activities match that search.</EmptyNote>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ question: q, kind }) => (
            <Card key={q.id} interactive className="group p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <InteractionMotif kind={kind} animate className="w-[72px] h-[56px] shrink-0" />
                <span className="font-mono text-[11px] text-[#98A2B3] shrink-0">{q.questionId}</span>
              </div>

              <h3 className="mt-3 text-[14.5px] font-bold text-[#172033] leading-snug">
                {q.topic || q.chapter}
              </h3>
              <p className="mt-1 text-[12.5px] text-[#2563A8] font-medium">{KIND_LABEL[kind]}</p>

              <p className="mt-2.5 text-[12.5px] text-[#667085] leading-relaxed line-clamp-3">
                {q.questionText}
              </p>

              <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-[#E3E8EF]">
                <span className="text-[11.5px] text-[#98A2B3] truncate">{q.section}</span>
                {primaryExamId && (
                  <Link
                    href={`/exam/${primaryExamId}`}
                    className="text-[12.5px] font-semibold text-[#2563A8] hover:text-[#1B4E88] whitespace-nowrap transition-colors"
                  >
                    Try it →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Section legend */}
      {sections.length > 0 && (
        <section>
          <SectionHeading title="Sections in this paper" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sections.map((s) => {
              const inSection = activities.filter((a) => a.question.section === s).length;
              const motif =
                s.toLowerCase().includes("logical")
                  ? "logic"
                  : s.toLowerCase().includes("everyday")
                  ? "everyday"
                  : s.toLowerCase().includes("achiever")
                  ? "achiever"
                  : "geometry";
              return (
                <Card key={s} className="p-5 flex items-center gap-4">
                  <SectionMotif kind={motif as never} className="w-10 h-10 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-[#172033] truncate">{s}</div>
                    <div className="text-[12px] text-[#667085] mt-0.5">{inSection} activities</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

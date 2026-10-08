"use client";

import React, { useMemo, useState } from "react";
import type { ExamAttempt } from "@/types/attempt";
import { classSummary, questionStats, sectionStats, formatSeconds } from "@/lib/results/analysis";
import { BarChart3, Target, Clock, Users, Trophy, EyeOff, Layers } from "lucide-react";

type SortKey = "missed" | "order" | "slowest";

/**
 * Class view of one paper: how the class did overall, in each section, and on each
 * question — sorted so the questions most students got wrong come first.
 */
export function ResultsAnalysisPanel({
  attempts,
  examTitle,
  questionText,
}: {
  /** Counted attempts for one paper, already filtered and narrowed by the count policy. */
  attempts: ExamAttempt[];
  examTitle: string;
  questionText: Map<string, string>;
}) {
  const [sort, setSort] = useState<SortKey>("missed");
  const summary = useMemo(() => classSummary(attempts), [attempts]);
  const sections = useMemo(() => sectionStats(attempts), [attempts]);
  const questions = useMemo(() => {
    const list = questionStats(attempts);
    if (sort === "missed") return list.sort((a, b) => b.missedPercent - a.missedPercent || a.questionNumber - b.questionNumber);
    if (sort === "slowest") return list.sort((a, b) => b.averageTimeSeconds - a.averageTimeSeconds);
    return list;
  }, [attempts, sort]);

  if (attempts.length === 0) return null;

  const tiles = [
    { icon: Users, label: "Students", value: String(summary.students) },
    { icon: Target, label: "Class average", value: `${summary.averagePercent}%`, sub: `${summary.averageMarks} / ${summary.maximumMarks} marks` },
    { icon: Trophy, label: "Highest · Lowest", value: `${summary.highestPercent}% · ${summary.lowestPercent}%` },
    { icon: BarChart3, label: "Pass rate", value: `${summary.passRate}%` },
    { icon: Clock, label: "Average time", value: `${summary.averageTimeMinutes} min` },
    { icon: EyeOff, label: "Left exam window", value: String(summary.flaggedForFocus), sub: "attempts", warn: summary.flaggedForFocus > 0 },
  ];

  return (
    <section className="bg-white border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E1E7EF] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#182338]">Class Analysis · {examTitle}</h2>
          <p className="text-xs text-[#667085]">Which questions the class found hardest, how long they took, and how each section went.</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className={`rounded-xl border p-3 ${t.warn ? "bg-rose-50 border-rose-200" : "bg-[#F4F7FB] border-[#E1E7EF]"}`}>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#667085]">
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </span>
              <strong className={`block mt-1 text-lg font-black font-mono ${t.warn ? "text-rose-700" : "text-[#182338]"}`}>{t.value}</strong>
              {t.sub && <span className="text-[10px] text-[#667085]">{t.sub}</span>}
            </div>
          ))}
        </div>

        {sections.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold text-[#182338] mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#2468B2]" /> Sections
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {sections.map((s) => (
                <div key={s.section} className="rounded-xl border border-[#E1E7EF] p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#182338]">
                    <span>{s.section}</span>
                    <span className="font-mono">
                      {s.averageMarks} / {s.maxMarks} · {s.averagePercent}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#F4F7FB] border border-[#E1E7EF] overflow-hidden">
                    <div
                      className={`h-full ${s.averagePercent >= 75 ? "bg-[#2468B2]" : s.averagePercent >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${s.averagePercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-xs font-extrabold text-[#182338]">Questions</h3>
            <div className="flex items-center gap-1 bg-[#F4F7FB] p-1 rounded-lg border border-[#E1E7EF]" role="group" aria-label="Sort questions">
              {([
                ["missed", "Most missed"],
                ["order", "Question order"],
                ["slowest", "Slowest"],
              ] as [SortKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  aria-pressed={sort === key}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                    sort === key ? "bg-white text-[#2468B2] border border-[#E1E7EF] shadow-2xs" : "text-[#667085]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto border border-[#E1E7EF] rounded-xl">
            <table className="w-full min-w-[860px] text-left text-xs">
              <thead className="bg-[#F4F7FB] text-[#667085] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-[56px]">Q</th>
                  <th className="py-2.5 px-3">Question</th>
                  <th className="py-2.5 px-3 w-[170px]">Got it right</th>
                  <th className="py-2.5 px-3 w-[70px] text-center">Wrong</th>
                  <th className="py-2.5 px-3 w-[80px] text-center">Left</th>
                  <th className="py-2.5 px-3 w-[90px] text-right">Avg time</th>
                  <th className="py-2.5 px-3 w-[150px]">Common wrong answer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                {questions.map((q) => (
                  <tr key={q.questionId} className="hover:bg-[#F4F7FB]/60">
                    <td className="py-2.5 px-3 font-mono font-black">Q{String(q.questionNumber).padStart(2, "0")}</td>
                    <td className="py-2.5 px-3">
                      <span className="line-clamp-2 font-medium" title={questionText.get(q.questionId) || ""}>
                        {questionText.get(q.questionId) || q.questionId}
                      </span>
                      <span className="text-[10px] text-[#667085]">{q.section}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-[#F4F7FB] border border-[#E1E7EF] overflow-hidden">
                          <div
                            className={`h-full ${q.correctPercent >= 75 ? "bg-emerald-500" : q.correctPercent >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                            style={{ width: `${q.correctPercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold">{q.correctPercent}%</span>
                        <span className="text-[10px] text-[#667085]">({q.correct})</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700">{q.wrong}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#667085]">{q.unanswered}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{formatSeconds(q.averageTimeSeconds)}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      {q.commonWrongAnswer ? (
                        <span title={`${q.commonWrongAnswer.count} students chose this`}>
                          {q.commonWrongAnswer.answer.slice(0, 24)} <span className="text-[#667085]">×{q.commonWrongAnswer.count}</span>
                        </span>
                      ) : (
                        <span className="text-[#98A2B3]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

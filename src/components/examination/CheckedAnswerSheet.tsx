"use client";

import React from "react";
import type { QuestionReportItem } from "@/types/report";
import type { SectionScore } from "@/types/attempt";

/**
 * The score paper as a teacher would hand it back: ruled paper with a margin, a red tick
 * or cross against every answer, the marks written in the margin, corrections in red next
 * to wrong answers, a ring around each section total and a remark at the end.
 */

const INK = "#B42318";

/** Handwritten-looking tick. */
export function RedTick({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Correct" role="img">
      <path d="M6 22 C 9 24, 12 28, 15 32 C 20 22, 27 13, 36 5" stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Handwritten-looking cross. */
export function RedCross({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Incorrect" role="img">
      <path d="M8 8 C 16 16, 24 25, 33 33" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M33 7 C 25 15, 16 24, 7 34" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

/** A loose hand-drawn ring around a short piece of text. */
export function RedRing({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center px-3 py-1 ${className}`}>
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M 18,8 C 45,1 88,4 96,22 C 101,40 70,49 42,47 C 14,45 1,36 4,22 C 6,12 22,5 52,4 C 66,3 78,5 86,9"
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** The teacher's comment for a percentage. */
export function teacherRemark(percentage: number): string {
  if (percentage >= 90) return "Excellent work! Keep it up.";
  if (percentage >= 75) return "Very good — well done.";
  if (percentage >= 50) return "Good effort. Revise the questions marked in red.";
  if (percentage >= 30) return "Fair attempt. Practise the topics marked in red.";
  return "Needs more practice. Please go through the corrections with me.";
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

interface Props {
  questions: QuestionReportItem[];
  sections: SectionScore[];
  percentage: number;
  checkedOn: string;
}

export function CheckedAnswerSheet({ questions, sections, percentage, checkedOn }: Props) {
  return (
    <div className="bg-white border border-[#E1E7EF] rounded-3xl shadow-sm overflow-hidden print:border-none print:shadow-none">
      <div className="px-6 sm:px-8 pt-6 pb-3 border-b border-[#E1E7EF] flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-[#182338]">Checked Answer Sheet</h2>
          <p className="text-xs text-[#667085]">Every answer marked: tick for correct, cross for wrong, marks in the margin.</p>
        </div>
        {sections.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-hand text-[19px] leading-none" style={{ color: INK }}>
            {sections.map((s) => (
              <span key={s.sectionTitle} className="flex items-center gap-1.5">
                <span className="text-[#667085] font-sans text-[11px] font-bold uppercase tracking-wide">{s.sectionTitle}</span>
                <RedRing>
                  <span className="font-bold">
                    {fmt(s.marksAwarded)}/{fmt(s.maxMarks)}
                  </span>
                </RedRing>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ruled paper: a red margin line, and a ruled line under every answer */}
      <ol className="relative">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-[50px] sm:left-[64px] w-[2px] bg-[#B42318]/45" />
        {questions.map((q) => {
          const correct = q.status === "CORRECT";
          const partial = q.status === "PARTIAL";
          const unanswered = q.status === "UNANSWERED";
          return (
            <li
              key={q.questionId}
              className="relative flex gap-3 pl-[62px] pr-[60px] sm:pl-[78px] sm:pr-[92px] py-3.5 border-b border-[#DCE6F2] break-inside-avoid"
            >
              {/* Margin mark */}
              <span className="absolute left-1 sm:left-3 top-2.5 w-11 flex justify-center">
                {correct || partial ? <RedTick /> : unanswered ? (
                  <span className="font-hand text-3xl leading-none" style={{ color: INK }} aria-label="Not attempted">—</span>
                ) : (
                  <RedCross />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 text-xs">
                  <span className="font-black font-mono text-[#182338]">Q{String(q.questionNumber).padStart(2, "0")}</span>
                  <span className="text-[#667085] font-medium truncate">{q.section}{q.topic ? ` · ${q.topic}` : ""}</span>
                </div>
                <p className="text-[13px] text-[#182338] font-medium mt-0.5 leading-snug">{q.questionText}</p>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
                  <span className="text-[#475467]">
                    Answer:{" "}
                    <strong className={`font-mono ${unanswered ? "text-[#98A2B3]" : "text-[#182338]"}`}>
                      {unanswered ? "not attempted" : q.studentAnswerFormatted}
                    </strong>
                  </span>
                  {!correct && (
                    <span className="font-hand text-[20px] leading-none" style={{ color: INK }}>
                      {unanswered ? "Answer: " : "Correct: "}
                      {q.correctAnswerFormatted}
                    </span>
                  )}
                </div>
                {!correct && q.explanation && (
                  <p className="mt-1 text-[11.5px] text-[#667085] leading-snug">{q.explanation}</p>
                )}
              </div>

              {/* Marks in the right margin */}
              <span
                className="absolute right-2 sm:right-4 top-2.5 font-hand font-bold text-[21px] sm:text-[24px] leading-none whitespace-nowrap"
                style={{ color: INK }}
                aria-label={`${q.marksAwarded} of ${q.maxMarks} marks`}
              >
                {q.marksAwarded > 0 ? `+${fmt(q.marksAwarded)}` : fmt(q.marksAwarded)}
                <span className="text-[16px] opacity-75">/{fmt(q.maxMarks)}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="px-6 sm:px-8 py-5 border-t border-[#E1E7EF] flex flex-wrap items-end justify-between gap-4">
        <p className="font-hand text-[26px] leading-tight max-w-xl" style={{ color: INK }}>
          {teacherRemark(percentage)}
        </p>
        <div className="text-right font-hand leading-tight" style={{ color: INK }}>
          <div className="text-[22px] font-bold">Checked ✓</div>
          <div className="text-[17px]">{checkedOn}</div>
        </div>
      </div>
    </div>
  );
}

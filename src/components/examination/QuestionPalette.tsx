"use client";

import React from "react";
import { Question } from "@/types/question";
import { User, HelpCircle, X } from "lucide-react";

export type NtaQuestionStatus =
  | "answered"
  | "not_answered"
  | "not_visited"
  | "marked_for_review"
  | "answered_marked_for_review";

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  visitedIndices: Set<number>;
  answeredIndices: Set<number>;
  markedForReviewIndices: Set<number>;
  activeSectionId?: string;
  onSelectIndex: (index: number) => void;
  onSubmitExam: () => void;
  candidateName?: string;
  candidateId?: string;
  /** Opens the guide that explains every control on the screen. */
  onOpenGuide?: () => void;
  /** Shown when the palette is opened as a drawer on small screens. */
  onClose?: () => void;
}

export function QuestionPalette({
  questions,
  currentIndex,
  visitedIndices,
  answeredIndices,
  markedForReviewIndices,
  activeSectionId,
  onSelectIndex,
  onSubmitExam,
  candidateName = "Candidate",
  candidateId = "STU-10492",
  onOpenGuide,
  onClose,
}: QuestionPaletteProps) {
  const total = questions.length;

  // Calculate NTA 5-state status for each question index
  const getStatus = (idx: number): NtaQuestionStatus => {
    const isAnswered = answeredIndices.has(idx);
    const isMarked = markedForReviewIndices.has(idx);
    const isVisited = visitedIndices.has(idx);

    if (isAnswered && isMarked) return "answered_marked_for_review";
    if (isAnswered) return "answered";
    if (isMarked) return "marked_for_review";
    if (isVisited) return "not_answered";
    return "not_visited";
  };

  // Compute counts
  let countAnswered = 0;
  let countNotAnswered = 0;
  let countNotVisited = 0;
  let countMarked = 0;
  let countAnsweredMarked = 0;

  questions.forEach((_, idx) => {
    const st = getStatus(idx);
    if (st === "answered") countAnswered++;
    else if (st === "not_answered") countNotAnswered++;
    else if (st === "not_visited") countNotVisited++;
    else if (st === "marked_for_review") countMarked++;
    else if (st === "answered_marked_for_review") countAnsweredMarked++;
  });

  return (
    <div className="bg-white border-2 border-slate-300 rounded-xl shadow-md overflow-hidden flex flex-col font-sans h-full min-h-0">
      {/* Candidate Profile Header Box (NTA Standard) */}
      <div className="shrink-0 px-3.5 py-2.5 bg-slate-100 border-b border-slate-300 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0 text-slate-600">
          <User className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 truncate">Candidate</div>
          <div className="text-[14px] font-bold text-slate-900 truncate">{candidateName}</div>
          <div className="text-[11px] font-mono font-bold text-[#2468B2] truncate">Roll: {candidateId}</div>
        </div>
        {onOpenGuide && (
          <button
            type="button"
            onClick={onOpenGuide}
            title="How every button on this screen works"
            className="shrink-0 h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-[11px] font-bold text-[#2468B2] hover:bg-[#EAF2FC] flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden xl:inline">Button guide</span>
            <span className="xl:hidden">Help</span>
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close question palette" className="shrink-0 w-9 h-9 rounded-lg border border-slate-300 bg-white grid place-items-center hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Legend and number grid scroll together between the fixed candidate header and
          the fixed submit button, so a short window never hides either of those. */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
      {/* Official NTA 5-State Legend Summary Table */}
      <div className="px-3.5 py-2.5 bg-white border-b border-slate-200 space-y-2">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center justify-between">
          <span>Question Status Legend</span>
          <span className="font-mono text-slate-500 font-bold">{total} Questions</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[12px] font-bold text-slate-800">
          {/* Answered (Green) */}
          <div className="flex items-center gap-2 bg-emerald-50/70 p-1.5 rounded border border-emerald-200">
            <span className="w-6 h-6 rounded bg-[#55B987] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-subtle">
              {countAnswered}
            </span>
            <span className="text-emerald-950 font-semibold truncate">Answered</span>
          </div>

          {/* Not Answered (Red) */}
          <div className="flex items-center gap-2 bg-rose-50/70 p-1.5 rounded border border-rose-200">
            <span className="w-6 h-6 rounded bg-[#E8786A] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-subtle">
              {countNotAnswered}
            </span>
            <span className="text-rose-950 font-semibold leading-tight">Not Answered</span>
          </div>

          {/* Not Visited (Silver) */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded border border-slate-200">
            <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center font-mono text-xs font-bold shrink-0">
              {countNotVisited}
            </span>
            <span className="text-slate-700 font-semibold truncate">Not Visited</span>
          </div>

          {/* Marked for Review (Purple) */}
          <div className="flex items-center gap-2 bg-purple-50/70 p-1.5 rounded border border-purple-200">
            <span className="w-6 h-6 rounded-full bg-[#8067D9] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-subtle">
              {countMarked}
            </span>
            <span className="text-purple-950 font-semibold leading-tight">Marked for Review</span>
          </div>
        </div>

        {/* Answered & Marked for Review (Purple with Green badge) */}
        <div className="flex items-center gap-2.5 bg-purple-50/50 p-1.5 rounded border border-purple-200 text-[11px] font-bold">
          <div className="relative w-6 h-6 rounded-full bg-[#8067D9] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-subtle">
            <span>{countAnsweredMarked}</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#55B987] border border-white" />
          </div>
          <span className="text-purple-900 leading-tight">
            Ans & Marked for Review <span className="text-[10px] text-slate-500 font-normal block">(Will be evaluated)</span>
          </span>
        </div>
      </div>

      {/* Numbered Palette Grid (Strictly 1 to 50 in Order) */}
      <div className="px-3.5 pt-2.5 pb-3 flex flex-col gap-2">
        <div className="sticky top-0 z-20 bg-white py-1 flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="uppercase tracking-wider">Choose Question</span>
          <span className="text-[#2468B2] font-mono">Q. {currentIndex + 1} Active</span>
        </div>

        <div className="px-1 -mx-1 pt-1">
          <div className="grid grid-cols-5 gap-2 pb-1">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const status = getStatus(idx);

              let statusStyles = "";
              if (status === "answered") {
                statusStyles = "bg-[#55B987] text-white border-[#3E9E6F]";
              } else if (status === "not_answered") {
                statusStyles = "bg-[#E8786A] text-white border-[#D25F52]";
              } else if (status === "marked_for_review") {
                statusStyles = "bg-[#8067D9] text-white border-[#6C55C4] rounded-full";
              } else if (status === "answered_marked_for_review") {
                statusStyles = "bg-[#8067D9] text-white border-[#6C55C4] rounded-full";
              } else {
                // not_visited
                statusStyles = "bg-white text-slate-800 border-slate-300 hover:bg-slate-100";
              }

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  aria-label={`Question ${idx + 1}: ${status.replace(/_/g, " ")}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`relative h-[38px] text-[13px] font-mono font-bold transition-all flex items-center justify-center border cursor-pointer ${
                    status === "marked_for_review" || status === "answered_marked_for_review"
                      ? "rounded-full"
                      : "rounded-md"
                  } ${statusStyles} ${
                    isCurrent
                      ? "ring-2 ring-[#2468B2] ring-offset-1 scale-105 z-10 font-bold shadow-md"
                      : "hover:opacity-90"
                  }`}
                >
                  <span>{idx + 1}</span>

                  {/* Corner indicator for answered + marked */}
                  {status === "answered_marked_for_review" && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#55B987] border border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      </div>

      {/* Submit Button */}
      <div className="shrink-0 px-3.5 py-2.5 bg-slate-50 border-t border-slate-300">
        <button
          type="button"
          onClick={onSubmitExam}
          className="w-full h-[46px] bg-[#2468B2] hover:bg-[#1C5190] active:bg-[#163F71] text-white rounded-lg text-sm font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Submit Question Paper</span>
        </button>
      </div>
    </div>
  );
}

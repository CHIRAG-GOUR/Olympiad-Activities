"use client";

import React from "react";
import { Question } from "@/types/question";
import { User, Check, Bookmark, HelpCircle } from "lucide-react";

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
    <div className="bg-white border-2 border-slate-300 rounded-xl shadow-md overflow-hidden flex flex-col font-sans">
      {/* Candidate Profile Header Box (NTA Standard) */}
      <div className="p-3.5 bg-slate-100 border-b border-slate-300 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0 text-slate-600">
          <User className="w-7 h-7" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Candidate Name</div>
          <div className="text-[14px] font-extrabold text-slate-900 truncate">{candidateName}</div>
          <div className="text-[11px] font-mono font-bold text-[#0B4F8A]">Roll No: {candidateId}</div>
        </div>
      </div>

      {/* Official NTA 5-State Legend Summary Table */}
      <div className="p-3.5 bg-white border-b border-slate-200 space-y-2.5">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center justify-between">
          <span>Question Status Legend</span>
          <span className="font-mono text-slate-500 font-bold">{total} Questions</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px] font-bold text-slate-800">
          {/* Answered (Green) */}
          <div className="flex items-center gap-2 bg-emerald-50/70 p-1.5 rounded border border-emerald-200">
            <span className="w-6 h-6 rounded bg-[#28A745] text-white flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-xs">
              {countAnswered}
            </span>
            <span className="text-emerald-950 font-semibold truncate">Answered</span>
          </div>

          {/* Not Answered (Red) */}
          <div className="flex items-center gap-2 bg-rose-50/70 p-1.5 rounded border border-rose-200">
            <span className="w-6 h-6 rounded bg-[#DC3545] text-white flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-xs">
              {countNotAnswered}
            </span>
            <span className="text-rose-950 font-semibold truncate">Not Answered</span>
          </div>

          {/* Not Visited (Silver) */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded border border-slate-200">
            <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center font-mono text-xs font-black shrink-0">
              {countNotVisited}
            </span>
            <span className="text-slate-700 font-semibold truncate">Not Visited</span>
          </div>

          {/* Marked for Review (Purple) */}
          <div className="flex items-center gap-2 bg-purple-50/70 p-1.5 rounded border border-purple-200">
            <span className="w-6 h-6 rounded-full bg-[#6F42C1] text-white flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-xs">
              {countMarked}
            </span>
            <span className="text-purple-950 font-semibold truncate">Marked for Review</span>
          </div>
        </div>

        {/* Answered & Marked for Review (Purple with Green badge) */}
        <div className="flex items-center gap-2.5 bg-purple-50/50 p-1.5 rounded border border-purple-200 text-[11px] font-bold">
          <div className="relative w-6 h-6 rounded-full bg-[#6F42C1] text-white flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-xs">
            <span>{countAnsweredMarked}</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#28A745] border border-white" />
          </div>
          <span className="text-purple-900 leading-tight">
            Ans & Marked for Review <span className="text-[10px] text-slate-500 font-normal block">(Will be evaluated)</span>
          </span>
        </div>
      </div>

      {/* Numbered Palette Grid (Strictly 1 to 50 in Order) */}
      <div className="p-3.5 space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="uppercase tracking-wider">Choose Question</span>
          <span className="text-[#0B4F8A] font-mono">Q. {currentIndex + 1} Active</span>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-1">
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const status = getStatus(idx);

              let statusStyles = "";
              if (status === "answered") {
                statusStyles = "bg-[#28A745] text-white border-[#218838]";
              } else if (status === "not_answered") {
                statusStyles = "bg-[#DC3545] text-white border-[#C82333]";
              } else if (status === "marked_for_review") {
                statusStyles = "bg-[#6F42C1] text-white border-[#5A32A3] rounded-full";
              } else if (status === "answered_marked_for_review") {
                statusStyles = "bg-[#6F42C1] text-white border-[#5A32A3] rounded-full";
              } else {
                // not_visited
                statusStyles = "bg-white text-slate-800 border-slate-300 hover:bg-slate-100";
              }

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  className={`relative h-[38px] text-[13px] font-mono font-bold transition-all flex items-center justify-center border cursor-pointer ${
                    status === "marked_for_review" || status === "answered_marked_for_review"
                      ? "rounded-full"
                      : "rounded-md"
                  } ${statusStyles} ${
                    isCurrent
                      ? "ring-3 ring-[#0B4F8A] ring-offset-1 scale-105 z-10 font-black shadow-md"
                      : "hover:opacity-90"
                  }`}
                >
                  <span>{idx + 1}</span>

                  {/* Corner indicator for answered + marked */}
                  {status === "answered_marked_for_review" && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#28A745] border border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-300">
        <button
          type="button"
          onClick={onSubmitExam}
          className="w-full h-[46px] bg-[#0B4F8A] hover:bg-[#083863] active:bg-[#062644] text-white rounded-lg text-sm font-extrabold shadow transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Submit Question Paper</span>
        </button>
      </div>
    </div>
  );
}

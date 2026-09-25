"use client";

import React from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Bookmark, CheckCircle2, Send } from "lucide-react";

interface ExamNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onSaveAndNext: () => void;
  onSaveAndMarkForReview: () => void;
  onMarkForReviewAndNext: () => void;
  onClearResponse: () => void;
  onPrevious: () => void;
  onNext: () => void;
  /** Opens the final submission confirmation — kept reachable here too, so
   * finishing the paper never requires scrolling to find it. */
  onSubmitExam?: () => void;
}

export function ExamNavigation({
  currentIndex,
  totalQuestions,
  onSaveAndNext,
  onSaveAndMarkForReview,
  onMarkForReviewAndNext,
  onClearResponse,
  onPrevious,
  onNext,
  onSubmitExam,
}: ExamNavigationProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <nav
      aria-label="NTA Examination Navigation Bar"
      className="shrink-0 bg-white border-t-2 border-slate-300 z-30 shadow-lg"
    >
      <div className="w-full max-w-[1750px] mx-auto px-2 sm:px-6 py-2 sm:py-3 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-1.5 sm:gap-3 sm:min-h-[64px] [&_button]:max-sm:h-[40px] [&_button]:max-sm:px-2 [&_button]:max-sm:justify-center">
        {/* Left: Previous & Next Simple Navigation */}
        <div className="col-span-2 sm:col-span-1 grid grid-cols-2 sm:flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onPrevious}
            title="Go to the previous question. Your answer here is kept."
            disabled={isFirst}
            className="h-[42px] px-4 bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&lt;&lt; Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            title="Go to the next question without changing this one."
            disabled={isLast}
            className="h-[42px] px-4 bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next &gt;&gt;</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Clear Response & Mark for Review Buttons */}
        <div className="col-span-2 sm:col-span-1 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onClearResponse}
            title="Remove the answer to this question and reset its activity."
            className="h-[42px] px-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Response</span>
          </button>

          <button
            type="button"
            onClick={onMarkForReviewAndNext}
            title="Flag this question to revisit and move on. Any answer already recorded is kept."
            className="h-[42px] px-4 bg-[#8067D9] hover:bg-[#6C55C4] active:bg-[#5A46A6] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Mark for Review & Next</span>
          </button>
        </div>

        {/* Right: Save & Mark for Review & Save & Next (Primary NTA Actions) */}
        <div className="col-span-2 sm:col-span-1 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={onSaveAndMarkForReview}
            title="Keep your answer, flag this question to revisit and move on."
            className="h-[42px] px-5 bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Save & Mark for Review</span>
          </button>

          <button
            type="button"
            onClick={onSaveAndNext}
            title="Confirm your answer and move to the next question."
            className="h-[42px] px-6 bg-[#55B987] hover:bg-[#3E9E6F] active:bg-[#33875C] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer tracking-wide uppercase"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Next</span>
          </button>

          {onSubmitExam && (
            <button
              type="button"
              onClick={onSubmitExam}
            title="Review the summary and end the examination."
              className="max-sm:col-span-2 h-[42px] px-5 bg-[#2468B2] hover:bg-[#1C5190] active:bg-[#163F71] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer tracking-wide uppercase"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Paper</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

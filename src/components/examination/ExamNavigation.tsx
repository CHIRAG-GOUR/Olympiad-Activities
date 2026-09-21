"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Bookmark, RotateCcw, Send } from "lucide-react";

interface ExamNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  isFlagged: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFlag: () => void;
  onClearAnswer: () => void;
  onSubmitExam: () => void;
}

export function ExamNavigation({
  currentIndex,
  totalQuestions,
  isFlagged,
  onPrevious,
  onNext,
  onToggleFlag,
  onClearAnswer,
  onSubmitExam,
}: ExamNavigationProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <nav aria-label="Examination navigation" className="bg-[#FFFDF5] border-t-2 border-[#FDE68A] sticky bottom-0 z-20 shadow-md">
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 min-h-[72px]">
        {/* Left: Previous & Clear */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirst}
            className="h-[46px] px-5 bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white rounded-xl text-[14px] font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Previous Question</span>
          </button>

          <button
            type="button"
            onClick={onClearAnswer}
            className="h-[46px] px-4 text-slate-600 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Response</span>
          </button>
        </div>

        {/* Center: Mark for Review (Warm Amber) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFlag}
            className={`h-[46px] px-5 rounded-xl text-[14px] font-bold flex items-center gap-2 border-2 transition-all cursor-pointer shadow-xs ${
              isFlagged
                ? "bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] ring-2 ring-[#FEF08A]"
                : "bg-white border-[#FDE68A] text-slate-800 hover:bg-[#FEFCE8]"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFlagged ? "fill-[#D97706] text-[#D97706]" : "text-[#D97706]"}`} />
            <span>{isFlagged ? "Marked for Review" : "Mark for Review"}</span>
          </button>
        </div>

        {/* Right: Save & Next / Finish Exam (Academic Gold Primary) */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto h-[46px] px-8 bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-slate-950 rounded-xl text-[14px] font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Save & Next Question</span>
              <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmitExam}
              className="w-full sm:w-auto h-[46px] px-8 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-[14px] font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Examination Paper</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import React from "react";
import { Bookmark, CheckCircle2, Award } from "lucide-react";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answeredIndices: Set<number>;
  flaggedIndices: Set<number>;
  onSelectIndex: (index: number) => void;
}

export function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  onSelectIndex,
}: QuestionPaletteProps) {
  const indices = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#FDE68A]">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#D97706]" />
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E]">
            Question Palette
          </h3>
        </div>
        <span className="text-[12px] font-mono font-extrabold text-[#92400E] bg-[#FEF3C7] px-2.5 py-1 rounded-lg border border-[#FDE68A]">
          {answeredIndices.size} / {totalQuestions} Solved
        </span>
      </div>

      {/* Grid of 44px question number tiles */}
      <div className="grid grid-cols-5 gap-2.5">
        {indices.map((idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answeredIndices.has(idx);
          const isFlagged = flaggedIndices.has(idx);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative h-[44px] rounded-xl font-mono text-[14px] font-extrabold transition-all flex items-center justify-center border-2 cursor-pointer ${
                isCurrent
                  ? "bg-[#F59E0B] text-slate-900 border-[#D97706] shadow-md shadow-amber-500/25 scale-105 ring-2 ring-[#FEF08A]"
                  : isAnswered
                  ? "bg-[#0B4F8A] text-white border-[#0B4F8A] hover:bg-[#1769AA] shadow-xs"
                  : "bg-white text-slate-800 border-[#E2E8F0] hover:border-[#F59E0B] hover:bg-[#FEFCE8]"
              }`}
            >
              <span>{String(idx + 1).padStart(2, "0")}</span>

              {isFlagged && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#EA580C] ring-2 ring-white flex items-center justify-center text-[9px] text-white font-bold"
                  title="Marked for Review"
                >
                  !
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="pt-3 border-t border-[#FDE68A] grid grid-cols-2 gap-2 text-[12px] font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#0B4F8A]" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-white border-2 border-slate-300" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#F59E0B] border border-[#D97706]" />
          <span>Current Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#EA580C]" />
          <span>Marked Review</span>
        </div>
      </div>
    </div>
  );
}

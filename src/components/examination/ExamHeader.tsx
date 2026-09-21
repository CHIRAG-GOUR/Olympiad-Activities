"use client";

import React from "react";
import { Clock, ShieldCheck, Award } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface ExamHeaderProps {
  olympiadTitle: string;
  examCode?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemainingSeconds: number;
  isSaving?: boolean;
  isOnline?: boolean;
}

export function ExamHeader({
  olympiadTitle,
  examCode,
  currentQuestionIndex,
  totalQuestions,
  timeRemainingSeconds,
  isSaving = false,
  isOnline = true,
}: ExamHeaderProps) {
  const isCritical = timeRemainingSeconds <= 120;
  const isWarning = timeRemainingSeconds <= 300 && !isCritical;

  return (
    <header className="bg-[#FFFDF5] border-b-2 border-[#FDE68A] sticky top-0 z-30 shadow-sm min-h-[76px]">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Olympiad Title with Academic Gold Crest */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#0B4F8A] text-white flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-[#F59E0B]">
            <svg viewBox="0 0 32 32" className="w-7 h-7 fill-none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 3L6 7V14C6 20.5 10.3 26.5 16 29C21.7 26.5 26 20.5 26 14V7L16 3Z"
                fill="#0B4F8A"
                stroke="#FFD84D"
                strokeWidth="1.5"
              />
              <path
                d="M16 8L18 12.5L23 13L19 16.5L20.2 21.5L16 19L11.8 21.5L13 16.5L9 13L14 12.5L16 8Z"
                fill="#F4C400"
              />
            </svg>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-widest font-extrabold text-[#B45309] flex items-center gap-1.5">
              <span>National Olympiad Examination</span>
              {examCode && (
                <span className="font-mono bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded border border-[#FDE68A] text-[11px]">
                  {examCode}
                </span>
              )}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate max-w-sm sm:max-w-md">
              {olympiadTitle}
            </div>
          </div>
        </div>

        {/* Center: Question Counter Pill */}
        <div className="hidden md:flex items-center gap-3 bg-[#FEF3C7] px-5 h-[46px] rounded-xl border-2 border-[#FDE68A] shadow-xs">
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E]">
            Question
          </span>
          <span className="text-lg font-extrabold text-slate-900 font-mono">
            {String(currentQuestionIndex + 1).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
          </span>
        </div>

        {/* Right: Autosave & Academic Gold Countdown Timer */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[13px] text-slate-600 font-medium">
            {isSaving ? (
              <span className="text-[#B45309] font-bold animate-pulse">Syncing response...</span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Responses Encrypted
              </span>
            )}
          </div>

          {/* Countdown Timer with Academic Gold Glow */}
          <div
            className={`flex items-center gap-2.5 px-4 h-[46px] rounded-xl border-2 font-mono font-extrabold text-base sm:text-lg transition-all shadow-sm ${
              isCritical
                ? "bg-rose-50 text-rose-700 border-rose-400 animate-pulse"
                : isWarning
                ? "bg-amber-100 text-amber-900 border-amber-400"
                : "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B] shadow-amber-500/10"
            }`}
          >
            <Clock className={`w-5 h-5 ${isCritical ? "text-rose-600" : "text-[#D97706]"}`} />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

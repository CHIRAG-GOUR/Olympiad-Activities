"use client";

import React from "react";
import { Clock, ShieldCheck, User } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface ExamHeaderProps {
  olympiadTitle: string;
  examCode?: string;
  candidateName?: string;
  candidateId?: string;
  timeRemainingSeconds: number;
  isSaving?: boolean;
}

export function ExamHeader({
  olympiadTitle,
  examCode,
  candidateName = "Candidate",
  candidateId = "STU-10492",
  timeRemainingSeconds,
  isSaving = false,
}: ExamHeaderProps) {
  const isCritical = timeRemainingSeconds <= 180;

  return (
    <header className="shrink-0 bg-[#2563A8] text-white border-b-2 border-[#1B4E88] z-40 shadow-md">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Exam Emblem & Paper Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white text-[#2563A8] flex items-center justify-center font-bold text-xl shadow-subtle border border-white/40">
            <span>&Omega;</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-300 tracking-wider uppercase flex items-center gap-2">
              <span>National Testing Agency Standard</span>
              {examCode && (
                <span className="font-mono bg-white/15 px-1.5 py-0.2 rounded text-[10px] text-white">
                  {examCode}
                </span>
              )}
            </div>
            <div className="text-sm sm:text-base font-bold tracking-tight text-white truncate max-w-sm md:max-w-md">
              {olympiadTitle}
            </div>
          </div>
        </div>

        {/* Center / Right: Candidate Details */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          {/* Autosave Indicator */}
          {isSaving && (
            <span className="text-amber-300 text-xs font-bold animate-pulse">
              Syncing...
            </span>
          )}

          {/* Official Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-base sm:text-lg shadow-inner ${
              isCritical
                ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                : "bg-white text-slate-900 border-slate-300"
            }`}
          >
            <Clock className={`w-4 h-4 ${isCritical ? "text-white" : "text-[#2563A8]"}`} />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-tight">Time Left :</span>
              <span className="text-[#2563A8] font-bold">{formatTime(timeRemainingSeconds)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

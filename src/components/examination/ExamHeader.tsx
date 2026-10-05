"use client";

import React from "react";
import { Clock, Wifi, WifiOff, CloudUpload, AlertTriangle } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface ExamHeaderProps {
  olympiadTitle: string;
  examCode?: string;
  candidateName?: string;
  candidateId?: string;
  timeRemainingSeconds: number;
  /** Where the candidate's work is saved right now — see useExamSyncStatus. */
  sync?: { tone: "ok" | "pending" | "offline" | "error"; label: string };
}

export function ExamHeader({
  olympiadTitle,
  examCode,
  candidateName,
  candidateId,
  timeRemainingSeconds,
  sync,
}: ExamHeaderProps) {
  const isCritical = timeRemainingSeconds <= 180;

  return (
    <header className="shrink-0 bg-[#2468B2] text-white border-b-2 border-[#1C5190] z-40 shadow-md">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Exam Emblem & Paper Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white text-[#2468B2] flex items-center justify-center font-bold text-xl shadow-subtle border border-white/40">
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
          {(candidateName || candidateId) && (
            <div className="hidden md:block text-right leading-tight">
              {candidateName && <div className="text-xs font-bold text-white truncate max-w-[180px]">{candidateName}</div>}
              {candidateId && <div className="text-[10px] font-mono text-white/75">{candidateId}</div>}
            </div>
          )}

          {/* Save / connection status — the candidate always knows their work is safe. */}
          {sync && (
            <span
              role="status"
              aria-live="polite"
              className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-md ${
                sync.tone === "offline"
                  ? "bg-amber-400 text-amber-950"
                  : sync.tone === "error"
                  ? "bg-rose-100 text-rose-800"
                  : sync.tone === "pending"
                  ? "bg-white/15 text-white"
                  : "bg-white/10 text-emerald-100"
              }`}
            >
              {sync.tone === "offline" ? (
                <WifiOff className="w-3.5 h-3.5" />
              ) : sync.tone === "error" ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : sync.tone === "pending" ? (
                <CloudUpload className="w-3.5 h-3.5" />
              ) : (
                <Wifi className="w-3.5 h-3.5" />
              )}
              <span>{sync.label}</span>
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
            <Clock className={`w-4 h-4 ${isCritical ? "text-white" : "text-[#2468B2]"}`} />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-tight">Time Left :</span>
              <span className="text-[#2468B2] font-bold">{formatTime(timeRemainingSeconds)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

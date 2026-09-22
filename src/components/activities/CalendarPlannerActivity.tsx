"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle2, Sparkles, Building } from "lucide-react";

interface CalendarPlannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function CalendarPlannerActivity({
  value,
  onChange,
  readOnly = false,
}: CalendarPlannerActivityProps) {
  const [selectedCount, setSelectedCount] = useState<string>(
    value ? String(value) : ""
  );

  // February non-leap year (28 days) starting on Thursday:
  // Sundays: 4, 11, 18, 25 (4 days holiday)
  // Multiples of 5: 5, 10, 15, 20, 25 (25 is already a Sunday holiday!)
  // Extra holiday multiples of 5: 5, 10, 15, 20 (4 extra days)
  // Total holidays = 4 (Sundays) + 4 (other multiples of 5) = 8 holidays.
  // Working days = 28 - 8 = 20 days.
  const options = [
    { id: "A", val: "20", label: "20 Working Days (28 total - 4 Sundays - 4 unique multiples of 5)", isCorrect: true },
    { id: "B", val: "21", label: "21 Days", isCorrect: false },
    { id: "C", val: "19", label: "19 Days", isCorrect: false },
    { id: "D", val: "22", label: "22 Days", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedCount(val);
    onChange(val);
  };

  // Generate 28 calendar days starting Thursday (col 4, 0-indexed)
  const days = Array.from({ length: 28 }, (_, i) => {
    const dayNum = i + 1;
    // Day of week: (3 + i) % 7 where 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    // If Feb 1 is Thursday (4), then Feb 4 is Sunday (0), Feb 11 is Sunday, Feb 18 is Sunday, Feb 25 is Sunday
    const isSunday = dayNum === 4 || dayNum === 11 || dayNum === 18 || dayNum === 25;
    const isMultipleOf5 = dayNum % 5 === 0;
    const isHoliday = isSunday || isMultipleOf5;
    return { dayNum, isSunday, isMultipleOf5, isHoliday };
  });

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 border border-blue-400/40 rounded-lg text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-blue-300 flex items-center gap-2">
              Office Schedule Planner (February 28 Days) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Holidays: All <span className="text-rose-400 font-bold">Sundays (4,11,18,25)</span> +{" "}
              <span className="text-amber-400 font-bold">Multiples of 5 (5,10,15,20,25)</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Calendar Matrix */}
      <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono font-bold text-slate-400 mb-2 border-b border-slate-800 pb-2">
          <span className="text-rose-400">SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* 28 Day cells (Feb 1 starts on Thursday -> 4 empty padding slots) */}
        <div className="grid grid-cols-7 gap-1.5">
          <div className="p-2 opacity-0"></div>
          <div className="p-2 opacity-0"></div>
          <div className="p-2 opacity-0"></div>
          <div className="p-2 opacity-0"></div>

          {days.map((d) => (
            <div
              key={d.dayNum}
              className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                d.isSunday
                  ? "bg-rose-950/40 border-rose-500/60 text-rose-300 font-bold"
                  : d.isMultipleOf5
                  ? "bg-amber-950/40 border-amber-500/60 text-amber-300 font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-200"
              }`}
            >
              <span className="text-sm font-black">{d.dayNum}</span>
              <span className="text-[9px] uppercase tracking-tighter mt-0.5">
                {d.isSunday
                  ? "SUN OFF"
                  : d.isMultipleOf5
                  ? "5x OFF"
                  : "WORK"}
              </span>
            </div>
          ))}
        </div>

        {/* Schedule Tally Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 4 Sundays
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 4 Other Multiples of 5
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 20 Working Days
            </span>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          How many total days does Ankit go to the office in this month?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedCount === opt.val || selectedCount === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-600/30 border-blue-400 text-blue-200 shadow-lg shadow-blue-500/20 scale-[1.02]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

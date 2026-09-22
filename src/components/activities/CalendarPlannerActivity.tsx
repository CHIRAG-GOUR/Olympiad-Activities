"use client";

import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle2 } from "lucide-react";

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
  const options = [
    { id: "A", val: "21", label: "21 Days", isCorrect: false },
    { id: "B", val: "20", label: "20 Days (29 total − 4 Sundays − 5 WFH days = 20)", isCorrect: true },
    { id: "C", val: "23", label: "23 Days", isCorrect: false },
    { id: "D", val: "19", label: "19 Days", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "B") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.val === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  // Generate 29 calendar days (Leap Feb where Feb 1 is Saturday)
  // Feb 1 is Saturday (column 6 in Sun..Sat grid)
  // Sundays: 2, 9, 16, 23 (4 days)
  // Multiples of 5: 5, 10, 15, 20, 25 (5 days)
  const days = Array.from({ length: 29 }, (_, i) => {
    const dayNum = i + 1;
    const isSunday = dayNum === 2 || dayNum === 9 || dayNum === 16 || dayNum === 23;
    const isMultipleOf5 = dayNum % 5 === 0;
    const isHoliday = isSunday || isMultipleOf5;
    return { dayNum, isSunday, isMultipleOf5, isHoliday };
  });

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Leap February Office Schedule Planner
            </h3>
            <p className="text-xs text-slate-600">
              February 20XX (29 Days, Feb 1st = Saturday). Sundays = Holiday, Multiples of 5 = Work From Home.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Calendar Matrix */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono font-bold text-slate-600 mb-2 border-b border-slate-200 pb-2">
          <span className="text-rose-600">SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* 29 Day cells (Feb 1 starts on Saturday -> 6 empty padding slots) */}
        <div className="grid grid-cols-7 gap-1.5">
          <div className="p-1.5 opacity-0" />
          <div className="p-1.5 opacity-0" />
          <div className="p-1.5 opacity-0" />
          <div className="p-1.5 opacity-0" />
          <div className="p-1.5 opacity-0" />
          <div className="p-1.5 opacity-0" />

          {days.map((d) => (
            <div
              key={d.dayNum}
              onClick={() => handleSelect(options[1])}
              className={`p-1.5 sm:p-2 rounded-lg border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                d.isSunday
                  ? "bg-rose-50 border-rose-300 text-rose-800 font-bold"
                  : d.isMultipleOf5
                  ? "bg-amber-50 border-amber-300 text-amber-800 font-bold"
                  : "bg-white border-slate-300 hover:border-emerald-500 text-slate-800"
              }`}
              title={`Feb ${d.dayNum}: ${d.isSunday ? "Sunday Off" : d.isMultipleOf5 ? "WFH (5x)" : "Office Day"}`}
            >
              <span className="text-sm font-black">{d.dayNum}</span>
              <span className="text-[8px] uppercase tracking-tighter mt-0.5">
                {d.isSunday ? "SUN" : d.isMultipleOf5 ? "WFH" : "OFFICE"}
              </span>
            </div>
          ))}
        </div>

        {/* Schedule Tally Legend (Clickable to select Option B) */}
        <div
          onClick={() => handleSelect(options[1])}
          className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200 text-xs font-mono cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-rose-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 4 Sundays (Off)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 5 WFH (5, 10, 15, 20, 25)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> 20 Office Days (Opt B) ★
            </span>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          How many total days does Ankit go to the office in February?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="text-xl font-black">{opt.val}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

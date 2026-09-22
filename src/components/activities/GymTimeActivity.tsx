"use client";

import React, { useState } from "react";
import { Timer, Sparkles, CheckCircle2 } from "lucide-react";

interface GymTimeActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function GymTimeActivity({
  value,
  onChange,
  readOnly = false,
}: GymTimeActivityProps) {
  // Workout starts at 18:25 (6:25 PM) and ends at 19:52 (7:52 PM)
  // Elapsed time:
  // 18:25 to 19:25 = 1 hour (60 mins)
  // 19:25 to 19:52 = 27 mins
  // Total duration = 1 hour 27 minutes (87 minutes)!
  const [selectedDuration, setSelectedDuration] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "1 hr 27 mins", label: "1 hour 27 minutes (19:52 - 18:25 = 87 mins)", isCorrect: true },
    { id: "B", val: "1 hr 35 mins", label: "1 hour 35 minutes", isCorrect: false },
    { id: "C", val: "1 hr 17 mins", label: "1 hour 17 minutes", isCorrect: false },
    { id: "D", val: "1 hr 42 mins", label: "1 hour 42 minutes", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedDuration(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-300 flex items-center gap-2">
              Gym Time Controller <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Calculate elapsed duration from <strong className="text-white font-mono">18:25</strong> to <strong className="text-white font-mono">19:52</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Stopwatch & Chrono Display */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-around flex-wrap gap-4">
        <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Workout Start</span>
          <div className="font-black text-2xl text-amber-300 font-mono">18:25</div>
          <span className="text-[10px] text-slate-500 font-mono">6:25 PM</span>
        </div>

        <div className="text-2xl font-black text-slate-600">→</div>

        <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Workout Finish</span>
          <div className="font-black text-2xl text-emerald-300 font-mono">19:52</div>
          <span className="text-[10px] text-slate-500 font-mono">7:52 PM</span>
        </div>

        <div className="text-2xl font-black text-amber-400">=</div>

        <div className="p-3.5 bg-amber-950/60 border-2 border-amber-400 rounded-xl text-center space-y-1 shadow-lg shadow-amber-500/20">
          <span className="text-xs font-mono text-amber-300 font-bold">Elapsed Duration</span>
          <div className="font-black text-2xl text-white font-mono">1 hr 27 min</div>
          <span className="text-[10px] text-amber-300 font-mono">87 total minutes</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedDuration === opt.val || selectedDuration === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                isSelected
                  ? "bg-amber-600/30 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 scale-[1.01]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-amber-400 mr-2">
                  Option {opt.id}
                </span>
                <span className="font-mono text-base font-black">{opt.val}</span>
                <p className="text-[11px] text-slate-400 mt-1 font-normal">{opt.label}</p>
              </div>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

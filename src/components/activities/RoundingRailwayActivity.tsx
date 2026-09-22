"use client";

import React, { useState } from "react";
import { Train, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface RoundingRailwayActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function RoundingRailwayActivity({
  value,
  onChange,
  readOnly = false,
}: RoundingRailwayActivityProps) {
  // Rounding 5,78,634 to the nearest thousand:
  // Hundreds digit is 6 (>= 5) -> rounds UP to 5,79,000!
  const [selectedStation, setSelectedStation] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "5,79,000", label: "5,79,000 (Rounds UP since hundreds digit is 6 ≥ 5)", isCorrect: true },
    { id: "B", val: "5,78,000", label: "5,78,000 (Rounds down)", isCorrect: false },
    { id: "C", val: "5,80,000", label: "5,80,000 (Rounded to nearest ten-thousand)", isCorrect: false },
    { id: "D", val: "5,78,600", label: "5,78,600 (Rounded to nearest hundred)", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedStation(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-400">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-300 flex items-center gap-2">
              Rounding Railway (Nearest 1,000) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              The train is loaded with <strong className="text-white font-mono">5,78,634</strong>. Switch the track to its nearest thousand station.
            </p>
          </div>
        </div>
      </div>

      {/* Railway Number Line Track */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
        <div className="w-full max-w-lg relative py-8">
          {/* Main Track Line */}
          <div className="h-3 bg-slate-800 border-y border-slate-700 w-full relative flex items-center justify-between px-2">
            {/* Midpoint 5,78,500 marker */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-400">Midpoint: 5,78,500</span>
              <div className="w-0.5 h-6 bg-amber-500" />
            </div>

            {/* Train Position: 5,78,634 (at ~63% position) */}
            <div
              className="absolute left-[63%] -translate-x-1/2 -top-8 flex flex-col items-center transition-all animate-bounce"
            >
              <div className="px-2.5 py-1 bg-amber-500 border border-amber-300 rounded-md text-[11px] font-black text-slate-950 shadow-lg flex items-center gap-1">
                🚂 5,78,634
              </div>
              <div className="w-2 h-2 bg-amber-400 transform rotate-45 -mt-1" />
            </div>
          </div>

          {/* Station Platforms */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-start">
              <span className="text-xs font-mono font-bold text-slate-400">Station A</span>
              <span className="font-black text-base text-slate-200">5,78,000</span>
              <span className="text-[10px] text-slate-500 font-mono">(Distance: 634)</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-emerald-400">Station B (Nearest)</span>
              <span className="font-black text-base text-emerald-300">5,79,000</span>
              <span className="text-[10px] text-emerald-400/80 font-mono">(Distance: 366 ← Closer!)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Stations Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Select the rounded number at the nearest thousand station:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedStation === opt.val || selectedStation === opt.id;
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
                  <span className="font-mono text-lg font-black">{opt.val}</span>
                  <p className="text-[11px] text-slate-400 mt-1 font-normal">{opt.label}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

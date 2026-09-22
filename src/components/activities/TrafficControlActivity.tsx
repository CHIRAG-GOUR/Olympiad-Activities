"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

interface TrafficControlActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function TrafficControlActivity({
  value,
  onChange,
  readOnly = false,
}: TrafficControlActivityProps) {
  // Library Tally Visitors:
  // Mon: 25, Tue: 20, Wed: 35, Thu: 15, Fri: 30, Sat: 40, Sun: 45 (Total = 210)
  // Compare: Mon + Wed + Thu = 25 + 35 + 15 = 75 visitors
  // Sat + Sun = 40 + 45 = 85 visitors
  // Difference = 85 - 75 = 10 fewer visitors on weekdays vs weekend!
  const [selectedAnswer, setSelectedAnswer] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "10", label: "10 (Weekend 85 - Selected Weekdays 75 = 10)", isCorrect: true },
    { id: "B", val: "15", label: "15", isCorrect: false },
    { id: "C", val: "20", label: "20", isCorrect: false },
    { id: "D", val: "5", label: "5", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedAnswer(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 border border-blue-400/40 rounded-lg text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-blue-300 flex items-center gap-2">
              Library Traffic Control Room <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Tally Telemetry: Compare (Mon + Wed + Thu) against (Sat + Sun).
            </p>
          </div>
        </div>
      </div>

      {/* Tally Visitor Meters */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weekday Cluster (Mon + Wed + Thu) */}
        <div className="p-4 bg-slate-950/90 border border-sky-500/40 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-sky-400 block">
            WEEKDAY SUM (Mon + Wed + Thu)
          </span>
          <div className="text-xs text-slate-300 space-y-1 font-mono">
            <div>Mon: 25 (<s>||||</s> <s>||||</s> <s>||||</s> <s>||||</s> <s>||||</s>)</div>
            <div>Wed: 35 (7 tally bundles of 5)</div>
            <div>Thu: 15 (3 tally bundles of 5)</div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-sm font-black text-sky-300">
            Total = 25 + 35 + 15 = 75 Visitors
          </div>
        </div>

        {/* Weekend Cluster (Sat + Sun) */}
        <div className="p-4 bg-slate-950/90 border border-emerald-500/40 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-400 block">
            WEEKEND SUM (Sat + Sun)
          </span>
          <div className="text-xs text-slate-300 space-y-1 font-mono">
            <div>Sat: 40 (8 tally bundles of 5)</div>
            <div>Sun: 45 (9 tally bundles of 5)</div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-sm font-black text-emerald-300">
            Total = 40 + 45 = 85 Visitors
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          How many fewer visitors attended on (Mon + Wed + Thu) than on the weekend?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.val || selectedAnswer === opt.id;
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
                <span className="text-[10px] text-slate-400 mt-2 font-mono">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

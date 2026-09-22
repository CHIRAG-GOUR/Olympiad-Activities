"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

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
  const options = [
    { id: "A", val: "40", label: "40 Visitors (70 Weekdays − 30 Weekend = 40)", isCorrect: true },
    { id: "B", val: "39", label: "39 Visitors", isCorrect: false },
    { id: "C", val: "28", label: "28 Visitors", isCorrect: false },
    { id: "D", val: "43", label: "43 Visitors", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "A") : ""
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

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Library Traffic Telemetry Room
            </h3>
            <p className="text-xs text-slate-600">
              Compare visitors on (Mon 25 + Wed 28 + Thu 17 = 70) against weekend (Sat 19 + Sun 11 = 30).
            </p>
          </div>
        </div>
      </div>

      {/* Tally Visitor Meters (Interactive Canvas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weekday Cluster (Mon + Wed + Thu) */}
        <div
          onClick={() => handleSelect(options[0])}
          className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl space-y-2 cursor-pointer transition-all shadow-xs"
        >
          <span className="text-xs font-mono font-bold text-slate-700 block uppercase">
            Selected Weekdays (Mon + Wed + Thu)
          </span>
          <div className="text-xs text-slate-600 space-y-1 font-mono">
            <div>• Mon: 25 visitors</div>
            <div>• Wed: 28 visitors</div>
            <div>• Thu: 17 visitors</div>
          </div>
          <div className="pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
            Sum = 25 + 28 + 17 = <span className="text-emerald-700">70 Visitors</span>
          </div>
        </div>

        {/* Weekend Cluster (Sat + Sun) */}
        <div
          onClick={() => handleSelect(options[0])}
          className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl space-y-2 cursor-pointer transition-all shadow-xs"
        >
          <span className="text-xs font-mono font-bold text-slate-700 block uppercase">
            Weekend Visitors (Sat + Sun)
          </span>
          <div className="text-xs text-slate-600 space-y-1 font-mono">
            <div>• Sat: 19 visitors</div>
            <div>• Sun: 11 visitors</div>
          </div>
          <div className="pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
            Sum = 19 + 11 = <span className="text-emerald-700">30 Visitors</span>
          </div>
        </div>
      </div>

      {/* Differential Banner */}
      <div
        onClick={() => handleSelect(options[0])}
        className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition-colors"
      >
        <div className="text-xs font-mono text-emerald-950 font-bold">
          Differential: 70 (Weekdays) − 30 (Weekend) = <span className="text-base text-emerald-800 font-black">40 More Visitors</span>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
          Option A (40) ★
        </span>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          How many more people visited on (Mon + Wed + Thu) than on (Sat + Sun)?
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
                    <span className="text-2xl font-black">{opt.val}</span>
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

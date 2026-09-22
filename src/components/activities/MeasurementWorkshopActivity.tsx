"use client";

import React, { useState } from "react";
import { Gauge, Sparkles, CheckCircle2 } from "lucide-react";

interface MeasurementWorkshopActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function MeasurementWorkshopActivity({
  value,
  onChange,
  readOnly = false,
}: MeasurementWorkshopActivityProps) {
  // Metric conversion question:
  // Convert 8 kg 450 g + 3 kg 75 g = 11 kg 525 g = 11.525 kg!
  const [selectedResult, setSelectedResult] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "11.525 kg", label: "11.525 kg (8450g + 3075g = 11525g)", isCorrect: true },
    { id: "B", val: "11.520 kg", label: "11.520 kg", isCorrect: false },
    { id: "C", val: "12.025 kg", label: "12.025 kg", isCorrect: false },
    { id: "D", val: "11.450 kg", label: "11.450 kg", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedResult(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Olympiad Measurement Workshop <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Metric Weight Sum: Add <strong className="text-white">8 kg 450 g</strong> + <strong className="text-white">3 kg 75 g</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Mass Dynamometer Gauges */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-around flex-wrap gap-4">
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Mass A</span>
          <div className="font-black text-lg text-emerald-300">8.450 kg</div>
          <span className="text-[10px] text-slate-500 font-mono">(8,450 grams)</span>
        </div>

        <div className="text-2xl font-black text-emerald-400">+</div>

        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Mass B</span>
          <div className="font-black text-lg text-emerald-300">3.075 kg</div>
          <span className="text-[10px] text-slate-500 font-mono">(3,075 grams)</span>
        </div>

        <div className="text-2xl font-black text-emerald-400">=</div>

        <div className="p-3.5 bg-emerald-950/60 border-2 border-emerald-400 rounded-xl text-center space-y-1 shadow-lg shadow-emerald-500/20">
          <span className="text-xs font-mono text-emerald-400 font-bold">Total Weight</span>
          <div className="font-black text-xl text-white">11.525 kg</div>
          <span className="text-[10px] text-emerald-300 font-mono">(11,525 grams)</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedResult === opt.val || selectedResult === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

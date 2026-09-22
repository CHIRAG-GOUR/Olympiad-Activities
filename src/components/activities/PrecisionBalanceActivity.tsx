"use client";

import React, { useState } from "react";
import { Scale, Sparkles, CheckCircle2 } from "lucide-react";

interface PrecisionBalanceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PrecisionBalanceActivity({
  value,
  onChange,
  readOnly = false,
}: PrecisionBalanceActivityProps) {
  // Decimal Comparison:
  // Left Expression: 95.23 + 220.80 - 11.05 = 316.03 - 11.05 = 304.98
  // Right Expression: 350.91 + 18.31 - 57.73 = 369.22 - 57.73 = 311.49
  // Comparison: 304.98 < 311.49 -> Sign is '<'
  const [selectedSign, setSelectedSign] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", sign: "<", label: "< (Left 304.98 < Right 311.49)", isCorrect: true },
    { id: "B", sign: ">", label: "> (Left is greater)", isCorrect: false },
    { id: "C", sign: "=", label: "= (Both are equal)", isCorrect: false },
    { id: "D", sign: "≤", label: "None of these", isCorrect: false },
  ];

  const handleSelect = (sign: string) => {
    if (readOnly) return;
    setSelectedSign(sign);
    onChange(sign);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 border border-sky-400/40 rounded-lg text-sky-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-sky-300 flex items-center gap-2">
              Decimal Precision Balance Lab <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Evaluate and compare the two decimal arithmetic pipelines on the precision scale.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Expression Balance Canvas */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-around flex-wrap gap-4">
        {/* Left Pan: 304.98 */}
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400 block">Left Expression</span>
          <span className="text-xs text-slate-300">95.23 + 220.80 - 11.05</span>
          <div className="font-black text-2xl text-sky-300 mt-2">304.98</div>
        </div>

        {/* Center Comparison Sign Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-black text-3xl text-amber-300 shadow-lg shadow-amber-500/20">
          {selectedSign || "?"}
        </div>

        {/* Right Pan: 311.49 */}
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400 block">Right Expression</span>
          <span className="text-xs text-slate-300">350.91 + 18.31 - 57.73</span>
          <div className="font-black text-2xl text-emerald-300 mt-2">311.49</div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedSign === opt.sign || selectedSign === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.sign)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-sky-600/30 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{opt.sign}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

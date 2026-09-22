"use client";

import React, { useState } from "react";
import { Binary, Sparkles, CheckCircle2 } from "lucide-react";

interface DivisibilityScannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function DivisibilityScannerActivity({
  value,
  onChange,
  readOnly = false,
}: DivisibilityScannerActivityProps) {
  // Divisibility rule by 4:
  // A number is divisible by 4 if its last two digits form a number divisible by 4.
  // Numbers:
  // 54832 -> Last 2 digits: 32 (32 / 4 = 8) -> Divisible by 4!
  // 73129 -> Last 2 digits: 29 (Not divisible)
  // 86514 -> Last 2 digits: 14 (Not divisible)
  // 92318 -> Last 2 digits: 18 (Not divisible)
  const [selectedNumber, setSelectedNumber] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", num: "54832", last2: "32", desc: "32 ÷ 4 = 8 (Divisible by 4)", isCorrect: true },
    { id: "B", num: "73129", last2: "29", desc: "29 ÷ 4 leaves remainder 1", isCorrect: false },
    { id: "C", num: "86514", last2: "14", desc: "14 ÷ 4 leaves remainder 2", isCorrect: false },
    { id: "D", num: "92318", last2: "18", desc: "18 ÷ 4 leaves remainder 2", isCorrect: false },
  ];

  const handleSelect = (num: string) => {
    if (readOnly) return;
    setSelectedNumber(num);
    onChange(num);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-400">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-700 flex items-center gap-2">
              4-Divisibility Scanner <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Rule: A number is divisible by 4 if and only if its <strong className="text-cyan-400">last two digits</strong> form a multiple of 4.
            </p>
          </div>
        </div>
      </div>

      {/* Optical Scanner Chamber */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => (
          <div
            key={opt.id}
            className="p-3 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-1 shadow-inner"
          >
            <span className="text-[10px] font-mono text-slate-500 font-bold">CANDIDATE {opt.id}</span>
            <div className="text-base font-black font-mono">
              <span className="text-slate-600">{opt.num.slice(0, 3)}</span>
              <span className="text-cyan-400 bg-cyan-50 border border-cyan-200 px-1 py-0.5 rounded border border-cyan-500/40">
                {opt.last2}
              </span>
            </div>
            <span className="text-[10px] text-slate-600 mt-1 font-mono">{opt.desc}</span>
          </div>
        ))}
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select which number is completely divisible by 4:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedNumber === opt.num || selectedNumber === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.num)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-cyan-600/30 border-cyan-400 text-cyan-800 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                    : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">{opt.num}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

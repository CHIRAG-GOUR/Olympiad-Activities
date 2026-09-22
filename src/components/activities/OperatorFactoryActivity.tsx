"use client";

import React, { useState } from "react";
import { Wrench, Play, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

interface OperatorFactoryActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function OperatorFactoryActivity({
  value,
  onChange,
  readOnly = false,
}: OperatorFactoryActivityProps) {
  const [selectedResult, setSelectedResult] = useState<string>(
    value ? String(value) : ""
  );

  // Expression: 510 + 17 x 15 / 2
  // Operator Mappings:
  // '+' means '/' (divide)
  // 'x' means '-' (subtract)
  // '/' means '+' (add)
  // '-' means 'x' (multiply)
  // Transformed Expression: 510 ÷ 17 - 15 + 2
  // Step 1: 510 ÷ 17 = 30
  // Step 2: 30 - 15 = 15
  // Step 3: 15 + 2 = 17
  const options = [
    { id: "A", val: "17", label: "17 (30 - 15 + 2 = 17)", isCorrect: true },
    { id: "B", val: "24", label: "24", isCorrect: false },
    { id: "C", val: "32", label: "32", isCorrect: false },
    { id: "D", val: "45", label: "45", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedResult(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-700 flex items-center gap-2">
              Mathematical Operator Factory <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Substitution Pipeline: <span className="text-amber-400">[+] → [÷]</span>,{" "}
              <span className="text-amber-400">[×] → [-]</span>,{" "}
              <span className="text-amber-400">[÷] → [+]</span>
            </p>
          </div>
        </div>
      </div>

      {/* Assembly Line Calculation Pipeline */}
      <div className="p-5 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl overflow-x-auto shadow-inner">
        <div className="flex items-center justify-center min-w-[500px] gap-3 text-lg font-mono">
          <div className="px-4 py-3 bg-white border border-slate-200 border border-slate-200 rounded-xl font-black text-2xl text-white">
            510
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 line-through">+</span>
            <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-400/60 rounded text-amber-700 font-black">
              ÷
            </span>
          </div>
          <div className="px-4 py-3 bg-white border border-slate-200 border border-slate-200 rounded-xl font-black text-2xl text-white">
            17
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 line-through">×</span>
            <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-400/60 rounded text-amber-700 font-black">
              -
            </span>
          </div>
          <div className="px-4 py-3 bg-white border border-slate-200 border border-slate-200 rounded-xl font-black text-2xl text-white">
            15
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 line-through">÷</span>
            <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-400/60 rounded text-amber-700 font-black">
              +
            </span>
          </div>
          <div className="px-4 py-3 bg-white border border-slate-200 border border-slate-200 rounded-xl font-black text-2xl text-white">
            2
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 mx-2" />
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 border-2 border-amber-400 rounded-xl font-black text-2xl text-amber-800">
            {selectedResult || "?"}
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Evaluate the result of the transformed arithmetic expression:
        </label>
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
                    ? "bg-amber-600/30 border-amber-400 text-amber-800 shadow-lg shadow-amber-500/20 scale-[1.02]"
                    : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[10px] text-slate-600 mt-2 font-mono">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

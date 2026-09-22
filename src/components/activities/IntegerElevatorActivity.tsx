"use client";

import React, { useState } from "react";
import { ArrowUpDown, Sparkles, CheckCircle2 } from "lucide-react";

interface IntegerElevatorActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function IntegerElevatorActivity({
  value,
  onChange,
  readOnly = false,
}: IntegerElevatorActivityProps) {
  // Question on integer successor and predecessor:
  // Successor of -10 is -9 (-10 + 1 = -9)
  // Predecessor of -15 is -16 (-15 - 1 = -16)
  // Value: Successor of (-10) + Predecessor of (-15) = (-9) + (-16) = -25!
  const [selectedSum, setSelectedSum] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "-25", label: "-25 (Successor(-10)=-9 + Predecessor(-15)=-16 = -25)", isCorrect: true },
    { id: "B", val: "-23", label: "-23", isCorrect: false },
    { id: "C", val: "-27", label: "-27", isCorrect: false },
    { id: "D", val: "-24", label: "-24", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedSum(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 border border-purple-400/40 rounded-lg text-purple-400">
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-purple-300 flex items-center gap-2">
              Integer Elevator (Sub-Zero Shaft) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Calculate: <strong className="text-white font-mono">Successor(-10) + Predecessor(-15)</strong> in the signed integer shaft.
            </p>
          </div>
        </div>
      </div>

      {/* Shaft Elevator Display */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-around flex-wrap gap-4">
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Successor of -10</span>
          <div className="font-black text-2xl text-purple-300 font-mono">-9</div>
          <span className="text-[10px] text-slate-500 font-mono">-10 + 1 = -9 (1 floor UP)</span>
        </div>

        <div className="text-2xl font-black text-purple-400">+</div>

        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Predecessor of -15</span>
          <div className="font-black text-2xl text-rose-300 font-mono">-16</div>
          <span className="text-[10px] text-slate-500 font-mono">-15 - 1 = -16 (1 floor DOWN)</span>
        </div>

        <div className="text-2xl font-black text-purple-400">=</div>

        <div className="p-4 bg-purple-950/60 border-2 border-purple-400 rounded-xl text-center space-y-1 shadow-lg shadow-purple-500/20">
          <span className="text-xs font-mono text-purple-300 font-bold">Total Combined Depth</span>
          <div className="font-black text-3xl text-white font-mono">-25</div>
          <span className="text-[10px] text-purple-300 font-mono">(-9) + (-16) = -25</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedSum === opt.val || selectedSum === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-purple-600/30 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Scale,  CheckCircle2 } from "lucide-react";

interface IntegerBalanceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function IntegerBalanceActivity({
  value,
  onChange,
  readOnly = false }: IntegerBalanceActivityProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    value ? String(value) : ""
  );

  // Expression testing which yields a sum strictly less than zero:
  // Option A: (-15) + (-8) + 20 = -23 + 20 = -3 (< 0) -> Correct!
  // Option B: (-10) + 15 + 5 = 10 (> 0)
  // Option C: (-12) + (-8) + 25 = 5 (> 0)
  // Option D: (-4) + (-6) + 10 = 0 (= 0)
  const options = [
    { id: "A", expr: "(-15) + (-8) + 20", sum: -3, label: "Sum = -3 (< 0, Falls Left)", isCorrect: true },
    { id: "B", expr: "(-10) + 15 + 5", sum: 10, label: "Sum = +10 (> 0)", isCorrect: false },
    { id: "C", expr: "(-12) + (-8) + 25", sum: 5, label: "Sum = +5 (> 0)", isCorrect: false },
    { id: "D", expr: "(-4) + (-6) + 10", sum: 0, label: "Sum = 0 (Balanced)", isCorrect: false },
  ];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedOption(id);
    onChange(id);
  };

  const currentSum = options.find((o) => o.id === selectedOption)?.sum ?? -3;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 border border-rose-400/40 rounded-lg text-rose-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-rose-700 flex items-center gap-2">
              Integer Balance Scale (Total &lt; 0) 
            </h3>
            <p className="text-xs text-slate-600">
              Evaluate each integer combination. The scale tilts left for negative net sums.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Balance Beam */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
        <div className="w-full max-w-sm h-48 relative flex flex-col items-center justify-center">
          {/* Fulcrum Stand */}
          <div className="w-4 h-24 bg-slate-700 rounded-t absolute bottom-4" />
          <div className="w-20 h-4 bg-slate-100 border border-slate-200 border border-slate-600 rounded-full absolute bottom-0" />

          {/* Tilting Lever Beam */}
          <div
            className="w-full h-3 bg-gradient-to-r from-rose-500 via-slate-300 to-sky-500 rounded-full transition-transform duration-500 shadow-md relative"
            style={{
              transform: `rotate(${currentSum < 0 ? -12 : currentSum > 0 ? 12 : 0}deg)` }}
          >
            {/* Left Pan (Negative) */}
            <div className="absolute -left-2 -top-12 flex flex-col items-center">
              <div className="w-16 h-12 bg-rose-50 border border-rose-200/80 border border-rose-500 rounded-xl flex flex-col items-center justify-center shadow">
                <span className="text-xs font-mono font-bold text-rose-700">Negative</span>
                <span className="text-[10px] text-slate-600">Left Tilt</span>
              </div>
            </div>

            {/* Right Pan (Positive) */}
            <div className="absolute -right-2 -top-12 flex flex-col items-center">
              <div className="w-16 h-12 bg-sky-950/80 border border-sky-500 rounded-xl flex flex-col items-center justify-center shadow">
                <span className="text-xs font-mono font-bold text-sky-700">Positive</span>
                <span className="text-[10px] text-slate-600">Right Tilt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Balance Readout */}
        <div className="mt-2 text-xs font-mono">
          Current Net Sum:{" "}
          <strong
            className={`text-sm ${
              currentSum < 0
                ? "text-rose-700"
                : currentSum > 0
                ? "text-sky-800"
                : "text-amber-800"
            }`}
          >
            {currentSum} {currentSum < 0 ? "(LESS THAN ZERO)" : ""}
          </strong>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.id)}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                isSelected
                  ? "bg-rose-600/30 border-rose-400 text-rose-800 shadow-lg shadow-rose-500/20 scale-[1.01]"
                  : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono text-rose-700 mr-2">
                  Option {opt.id}
                </span>
                <span className="font-mono text-base font-black">{opt.expr}</span>
                <p className="text-[11px] text-slate-600 mt-1 font-normal">{opt.label}</p>
              </div>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-rose-700 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Scale, CheckCircle2 } from "lucide-react";

interface IntegerBalanceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function IntegerBalanceActivity({
  value,
  onChange,
  readOnly = false,
}: IntegerBalanceActivityProps) {
  const options = [
    { id: "A", expr: "171 + (−23) + (−120)", sum: 28, label: "Sum = +28 (Positive > 0)", isCorrect: false },
    { id: "B", expr: "−815 + 750 + (−230)", sum: -295, label: "Sum = −295 (Negative < 0, Tilts Left)", isCorrect: true },
    { id: "C", expr: "−413 + (−315) + 880", sum: 152, label: "Sum = +152 (Positive > 0)", isCorrect: false },
    { id: "D", expr: "Both B and C", sum: 0, label: "Both B and C", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.expr === value)?.id || "B") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.expr === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  const selectedOpt = options.find((o) => o.id === selectedId) || options[1];
  const currentSum = selectedOpt.sum;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Signed Integer Balance Scale (Sum &lt; 0)
            </h3>
            <p className="text-xs text-slate-600">
              Click any expression or scale pan. The scale tilts left for negative sums strictly less than zero.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Balance Beam (Clickable Canvas) */}
      <div
        onClick={() => handleSelect(options[1])}
        className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all"
        title="Click to test Expression B (−295)"
      >
        <div className="w-full max-w-sm h-44 relative flex flex-col items-center justify-center select-none">
          {/* Fulcrum Stand */}
          <div className="w-4 h-20 bg-slate-700 rounded-t absolute bottom-3" />
          <div className="w-20 h-3 bg-slate-400 rounded-full absolute bottom-0" />

          {/* Tilting Lever Beam */}
          <div
            className="w-full h-3 bg-slate-400 rounded-full transition-transform duration-500 shadow-md relative"
            style={{
              transform: `rotate(${currentSum < 0 ? -12 : currentSum > 0 ? 12 : 0}deg)`,
            }}
          >
            {/* Left Pan (Negative) */}
            <div className="absolute -left-2 -top-12 flex flex-col items-center">
              <div
                className={`w-20 h-14 rounded-xl flex flex-col items-center justify-center shadow-xs border-2 transition-all ${
                  currentSum < 0
                    ? "bg-rose-50 border-rose-500 text-rose-800 font-bold scale-105 ring-2 ring-rose-400/40"
                    : "bg-white border-slate-300 text-slate-600"
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold">Negative</span>
                <span className="text-xs font-black">{currentSum < 0 ? `${currentSum}` : "Tilt Left"}</span>
              </div>
            </div>

            {/* Right Pan (Positive) */}
            <div className="absolute -right-2 -top-12 flex flex-col items-center">
              <div
                className={`w-20 h-14 rounded-xl flex flex-col items-center justify-center shadow-xs border-2 transition-all ${
                  currentSum > 0
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold scale-105"
                    : "bg-white border-slate-300 text-slate-600"
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold">Positive</span>
                <span className="text-xs font-black">{currentSum > 0 ? `+${currentSum}` : "Tilt Right"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Balance Readout */}
        <div className="mt-1 text-xs font-mono">
          Current Evaluated Sum:{" "}
          <strong
            className={`text-sm ${
              currentSum < 0
                ? "text-rose-700 font-bold"
                : currentSum > 0
                ? "text-emerald-700 font-bold"
                : "text-slate-700"
            }`}
          >
            {currentSum} {currentSum < 0 ? "(LESS THAN ZERO: OPTION B) ★" : ""}
          </strong>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select the expression with a sum strictly less than zero:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.01]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="font-mono text-base font-black">{opt.expr}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{opt.label}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

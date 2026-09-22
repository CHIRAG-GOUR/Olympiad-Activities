"use client";

import React, { useState, useEffect } from "react";
import { Scale, CheckCircle2 } from "lucide-react";

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
  const options = [
    { id: "A", sign: ">", label: "> (Left is greater)", isCorrect: false },
    { id: "B", sign: "=", label: "= (Both are equal)", isCorrect: false },
    { id: "C", sign: "<", label: "< (LHS 304.98 < RHS 311.49)", isCorrect: true },
    { id: "D", sign: "Can't be determined", label: "Can't be determined", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.sign === value)?.id || "C") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.sign === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  const selectedOpt = options.find((o) => o.id === selectedId);

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
              Decimal Precision Balance Lab
            </h3>
            <p className="text-xs text-slate-600">
              Evaluate and compare the two decimal pipelines: LHS (304.98) vs RHS (311.49).
            </p>
          </div>
        </div>
      </div>

      {/* Dual Expression Balance Canvas (Interactive) */}
      <div
        onClick={() => handleSelect(options[2])}
        className="p-5 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl flex items-center justify-around flex-wrap gap-4 cursor-pointer transition-all shadow-xs"
        title="Click to select comparison '<' (Option C)"
      >
        {/* Left Pan: 304.98 */}
        <div className="p-4 bg-white border-2 border-slate-200 rounded-xl text-center space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">LHS Expression</span>
          <span className="text-xs text-slate-600 font-mono">95.23 + 220.80 − 11.05</span>
          <div className="font-black text-2xl text-slate-900 mt-1">304.98</div>
        </div>

        {/* Center Comparison Sign Badge */}
        <div
          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-3xl shadow-xs transition-all ${
            selectedId === "C"
              ? "bg-emerald-50 border-emerald-600 text-emerald-800 scale-110"
              : "bg-white border-slate-300 text-slate-700 hover:border-emerald-500"
          }`}
        >
          {selectedOpt ? selectedOpt.sign : "<"}
        </div>

        {/* Right Pan: 311.49 */}
        <div className="p-4 bg-white border-2 border-slate-200 rounded-xl text-center space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">RHS Expression</span>
          <span className="text-xs text-slate-600 font-mono">350.91 + 18.31 − 57.73</span>
          <div className="font-black text-2xl text-emerald-700 mt-1">311.49</div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select the correct comparison symbol:
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
                    <span className="text-2xl font-black">{opt.sign}</span>
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

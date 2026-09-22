"use client";

import React, { useState, useEffect } from "react";
import { Wrench, CheckCircle2, ArrowRight } from "lucide-react";

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
  const options = [
    { id: "A", val: "60", label: "60", isCorrect: false },
    { id: "B", val: "0", label: "0 (510 ÷ 17 − 15 × 2 = 30 − 30 = 0)", isCorrect: true },
    { id: "C", val: "30", label: "30", isCorrect: false },
    { id: "D", val: "12", label: "12", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "B") : ""
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

  const selectedOpt = options.find((o) => o.id === selectedId);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Mathematical Operator Factory
            </h3>
            <p className="text-xs text-slate-600">
              Substitution Pipeline: <span className="text-emerald-700 font-bold">[+] → [÷]</span>,{" "}
              <span className="text-emerald-700 font-bold">[×] → [−]</span>,{" "}
              <span className="text-emerald-700 font-bold">[÷] → [×]</span>
            </p>
          </div>
        </div>
      </div>

      {/* Assembly Line Calculation Pipeline (Interactive on-canvas elements) */}
      <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-x-auto shadow-xs">
        <div className="flex items-center justify-center min-w-[520px] gap-3 text-lg font-mono">
          <div className="px-4 py-3 bg-white border-2 border-slate-300 rounded-xl font-black text-2xl text-slate-900 shadow-xs">
            510
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 line-through">+</span>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-black">
              ÷
            </span>
          </div>
          <div className="px-4 py-3 bg-white border-2 border-slate-300 rounded-xl font-black text-2xl text-slate-900 shadow-xs">
            17
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 line-through">×</span>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-black">
              −
            </span>
          </div>
          <div className="px-4 py-3 bg-white border-2 border-slate-300 rounded-xl font-black text-2xl text-slate-900 shadow-xs">
            15
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 line-through">÷</span>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-black">
              ×
            </span>
          </div>
          <div className="px-4 py-3 bg-white border-2 border-slate-300 rounded-xl font-black text-2xl text-slate-900 shadow-xs">
            2
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 mx-1" />
          <button
            type="button"
            disabled={readOnly}
            onClick={() => handleSelect(options[1])}
            className={`px-4 py-3 rounded-xl border-2 font-black text-2xl transition-all cursor-pointer ${
              selectedId === "B"
                ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md ring-4 ring-emerald-400/30 scale-105"
                : "bg-white border-amber-400 text-amber-800 hover:border-emerald-500"
            }`}
            title="Click to calculate BODMAS value: 30 - 30 = 0 (Opt B)"
          >
            {selectedOpt ? selectedOpt.val : "0"}
          </button>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Evaluate the result of 510 ÷ 17 − 15 × 2:
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

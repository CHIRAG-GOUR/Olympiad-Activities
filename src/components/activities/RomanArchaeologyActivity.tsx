"use client";

import React, { useState } from "react";
import { Scroll, Sparkles, CheckCircle2 } from "lucide-react";

interface RomanArchaeologyActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function RomanArchaeologyActivity({
  value,
  onChange,
  readOnly = false,
}: RomanArchaeologyActivityProps) {
  // Question: Which Roman Numeral expression yields the smallest value?
  // Opt A: XCIV - XLVIII = 94 - 48 = 46 (Smallest!)
  // Opt B: CLX - XCVIII = 160 - 98 = 62
  // Opt C: LXXVI - XVIII = 76 - 18 = 58
  // Opt D: CXXIV - LXIX = 124 - 69 = 55
  const [selectedOption, setSelectedOption] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", expr: "XCIV - XLVIII", val: 46, label: "94 - 48 = 46 (Smallest Value)", isCorrect: true },
    { id: "B", expr: "CLX - XCVIII", val: 62, label: "160 - 98 = 62", isCorrect: false },
    { id: "C", expr: "LXXVI - XVIII", val: 58, label: "76 - 18 = 58", isCorrect: false },
    { id: "D", expr: "CXXIV - LXIX", val: 55, label: "124 - 69 = 55", isCorrect: false },
  ];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedOption(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-400">
            <Scroll className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-700 flex items-center gap-2">
              Roman Numeral Archaeology <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Decipher the ancient stone inscriptions to find which expression yields the <strong className="text-amber-400">smallest numeric value</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Inscription Tablets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => (
          <div
            key={opt.id}
            className="p-3 bg-slate-50 border border-slate-200 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center text-center gap-1 shadow-inner"
          >
            <span className="text-[10px] font-mono text-amber-400 font-bold">TABLET {opt.id}</span>
            <span className="font-mono text-sm font-black text-amber-800">{opt.expr}</span>
            <span className="text-xs font-mono text-slate-600 mt-1">= {opt.val}</span>
          </div>
        ))}
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select the Roman Numeral expression with the SMALLEST value:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id || selectedOption === opt.expr;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? "bg-amber-600/30 border-amber-400 text-amber-800 shadow-lg shadow-amber-500/20 scale-[1.01]"
                    : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 border border-slate-200 rounded text-xs font-mono text-amber-400 mr-2">
                    Option {opt.id}
                  </span>
                  <span className="font-mono text-base font-black">{opt.expr}</span>
                  <p className="text-[11px] text-slate-600 mt-1 font-normal">{opt.label}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

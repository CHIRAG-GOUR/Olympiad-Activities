"use client";

import React, { useState } from "react";
import { Droplets, Sparkles, CheckCircle2 } from "lucide-react";

interface FractionTanksActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FractionTanksActivity({
  value,
  onChange,
  readOnly = false,
}: FractionTanksActivityProps) {
  // Comparing Shaded Fraction of Model 1 vs Model 2:
  // Model 1 (P): 4/8 = 1/2
  // Model 2 (Q): 3/6 = 1/2
  // Therefore, Fraction P = Fraction Q!
  const [selectedRelation, setSelectedRelation] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", rel: "P = Q", label: "Fraction P = Fraction Q (Both equal 1/2)", isCorrect: true },
    { id: "B", rel: "P < Q", label: "Fraction P < Fraction Q", isCorrect: false },
    { id: "C", rel: "P > Q", label: "Fraction P > Fraction Q", isCorrect: false },
    { id: "D", rel: "Cannot determine", label: "Cannot be determined", isCorrect: false },
  ];

  const handleSelect = (rel: string) => {
    if (readOnly) return;
    setSelectedRelation(rel);
    onChange(rel);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-700 flex items-center gap-2">
              Fraction Water Tanks <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Compare the shaded volume levels between Reservoir P (4/8) and Reservoir Q (3/6).
            </p>
          </div>
        </div>
      </div>

      {/* Dual Volumetric Reservoirs */}
      <div className="p-6 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl flex items-center justify-center gap-8 flex-wrap">
        {/* Tank P: 4 out of 8 bars filled */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-40 bg-white border border-slate-200 border-2 border-cyan-500/60 rounded-xl relative overflow-hidden flex flex-col-reverse p-1">
            <div className="w-full h-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-b-lg shadow-[0_0_12px_#06b6d4]" />
            <div className="absolute inset-0 grid grid-rows-8 divide-y divide-slate-800 pointer-events-none" />
          </div>
          <span className="font-bold text-sm text-cyan-700">Tank P (4/8 = 1/2)</span>
        </div>

        {/* Equalizer Valve symbol */}
        <div className="text-2xl font-black text-slate-500">VS</div>

        {/* Tank Q: 3 out of 6 bars filled */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-40 bg-white border border-slate-200 border-2 border-cyan-500/60 rounded-xl relative overflow-hidden flex flex-col-reverse p-1">
            <div className="w-full h-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-b-lg shadow-[0_0_12px_#06b6d4]" />
            <div className="absolute inset-0 grid grid-rows-6 divide-y divide-slate-800 pointer-events-none" />
          </div>
          <span className="font-bold text-sm text-cyan-700">Tank Q (3/6 = 1/2)</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedRelation === opt.rel || selectedRelation === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.rel)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-cyan-600/30 border-cyan-400 text-cyan-800 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                  : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{opt.rel}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2 font-mono">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

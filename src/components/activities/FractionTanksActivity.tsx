"use client";

import React, { useState, useEffect } from "react";
import { Droplets, CheckCircle2 } from "lucide-react";

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
  const options = [
    { id: "A", rel: "P = Q", label: "P = Q", isCorrect: false },
    { id: "B", rel: "P < Q", label: "P < Q", isCorrect: false },
    { id: "C", rel: "P > Q", label: "P > Q (Model P: 8/12 = 2/3 > Model Q: 3/6 = 1/2)", isCorrect: true },
    { id: "D", rel: "None of these", label: "None of these", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.rel === value)?.id || "C") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.rel === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Volumetric Fraction Comparison Tanks
            </h3>
            <p className="text-xs text-slate-600">
              Model P (8/12 = 2/3) vs Model Q (3/6 = 1/2). Click the tanks or comparison valve to select the relationship.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Volumetric Reservoirs (Interactive Canvas) */}
      <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center gap-8 flex-wrap">
        {/* Tank P: 8 out of 12 filled (2/3 = 66.7%) */}
        <div
          onClick={() => handleSelect(options[2])}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          title="Click to select Model P (8/12 = 2/3)"
        >
          <div
            className={`w-28 h-40 bg-white rounded-xl relative overflow-hidden flex flex-col-reverse p-1 border-2 transition-all ${
              selectedId === "C" ? "border-emerald-600 ring-4 ring-emerald-400/30 shadow-md" : "border-slate-300"
            }`}
          >
            <div className="w-full h-[66.7%] bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-b-lg shadow-xs" />
            <div className="absolute inset-0 grid grid-rows-12 divide-y divide-slate-200 pointer-events-none" />
          </div>
          <span className="font-black text-sm text-slate-900">Tank P (8/12 = 2/3 ≈ 0.67)</span>
        </div>

        {/* Comparison Valve (Clickable to select P > Q) */}
        <div
          onClick={() => handleSelect(options[2])}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-3xl cursor-pointer transition-all border-2 shadow-xs ${
            selectedId === "C"
              ? "bg-emerald-50 border-emerald-600 text-emerald-800 scale-110"
              : "bg-white border-slate-300 text-slate-700 hover:border-emerald-500"
          }`}
          title="Click to select P > Q"
        >
          &gt;
        </div>

        {/* Tank Q: 3 out of 6 filled (1/2 = 50%) */}
        <div
          onClick={() => handleSelect(options[2])}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          title="Click to select Model Q (3/6 = 1/2)"
        >
          <div className="w-28 h-40 bg-white border-2 border-slate-300 rounded-xl relative overflow-hidden flex flex-col-reverse p-1 shadow-xs">
            <div className="w-full h-[50%] bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-b-lg shadow-xs" />
            <div className="absolute inset-0 grid grid-rows-6 divide-y divide-slate-200 pointer-events-none" />
          </div>
          <span className="font-black text-sm text-slate-900">Tank Q (3/6 = 1/2 = 0.50)</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select comparison relation between Fraction P and Fraction Q:
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
                    <span className="text-xl font-black">{opt.rel}</span>
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

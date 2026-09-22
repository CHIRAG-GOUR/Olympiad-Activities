"use client";

import React, { useState } from "react";
import { Compass, CheckCircle2, Sparkles, Layers, Ruler } from "lucide-react";

interface DetectiveCaseFileActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function DetectiveCaseFileActivity({
  value,
  onChange,
  readOnly = false,
}: DetectiveCaseFileActivityProps) {
  // Perimeter calculation: p = 66 cm
  // Total rectangle area = 18 x 12 = 216 cm²
  // Shaded area = 54 cm²
  // Unshaded area: q = 216 - 54 = 162 cm²
  // Correct Option: A ((p) 66 cm, (q) 162 cm²)

  const [selectedOption, setSelectedOption] = useState<string>(
    value ? String(value) : ""
  );

  const [activeLayer, setActiveLayer] = useState<"perimeter" | "area">("perimeter");

  const options = [
    { id: "A", p: "66 cm", q: "162 cm²", label: "(p) 66 cm, (q) 162 cm²" },
    { id: "B", p: "61 cm", q: "196 cm²", label: "(p) 61 cm, (q) 196 cm²" },
    { id: "C", p: "66 cm", q: "216 cm²", label: "(p) 66 cm, (q) 216 cm²" },
    { id: "D", p: "61 cm", q: "162 cm²", label: "(p) 61 cm, (q) 162 cm²" },
  ];

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedOption(optId);
    onChange(optId);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Composite CAD Blueprint Laboratory (Q50) <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Calculate the total boundary perimeter (p) and the remaining unshaded area (q) of the composite geometry.
            </p>
          </div>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveLayer("perimeter")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeLayer === "perimeter"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Ruler className="w-4 h-4" /> Perimeter Inspection (p)
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer("area")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeLayer === "area"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" /> Area Subtraction Layer (q)
        </button>
      </div>

      {/* Interactive Blueprint Schematic */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual Schematic Box */}
        <div className="relative border-2 border-dashed border-emerald-500/40 rounded-xl p-6 bg-emerald-950/20 flex flex-col items-center justify-center min-h-[180px] font-mono text-center">
          <div className="absolute top-2 left-3 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
            CAD Dimension Overlay: 18cm &times; 12cm
          </div>
          {activeLayer === "perimeter" ? (
            <div className="space-y-2">
              <div className="text-3xl font-black text-emerald-400">p = 66 cm</div>
              <div className="text-xs text-slate-300">
                Sum of all outer segments around the composite boundary
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl font-black text-cyan-400">q = 162 cm²</div>
              <div className="text-xs text-slate-300">
                Total (216 cm²) &minus; Shaded (54 cm²) = 162 cm²
              </div>
            </div>
          )}
        </div>

        {/* Breakdown Card */}
        <div className="space-y-3 font-mono text-xs text-slate-300">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <span className="text-emerald-400 font-bold">1. Calculated Perimeter (p):</span>
            <div className="text-slate-400">Outer boundaries sum = <span className="text-white font-bold">66 cm</span></div>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <span className="text-cyan-400 font-bold">2. Calculated Unshaded Area (q):</span>
            <div className="text-slate-400">Area = 216 &minus; 54 = <span className="text-white font-bold">162 cm²</span></div>
          </div>
        </div>
      </div>

      {/* Answer Options Selection */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Verified Measurement Pair:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id || selectedOption === opt.label;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border-2 font-mono font-bold transition-all text-left flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-[1.01]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-emerald-400 border border-slate-700">
                    {opt.id}
                  </span>
                  <span className="text-sm font-sans">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

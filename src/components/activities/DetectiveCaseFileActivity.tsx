"use client";

import React, { useState } from "react";
import { Compass, CheckCircle2, Layers, Ruler } from "lucide-react";

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
  // Question 50:
  // Perimeter: p = 66 cm
  // Total rectangle area = 18 × 12 = 216 cm²
  // Shaded area = 54 cm²
  // Unshaded area: q = 216 − 54 = 162 cm²
  // Option A: (p) 66 cm, (q) 162 cm² (Correct!)

  const options = [
    { id: "A", p: "66 cm", q: "162 cm²", label: "(p) 66 cm, (q) 162 cm²", isCorrect: true },
    { id: "B", p: "61 cm", q: "196 cm²", label: "(p) 61 cm, (q) 196 cm²", isCorrect: false },
    { id: "C", p: "66 cm", q: "216 cm²", label: "(p) 66 cm, (q) 216 cm²", isCorrect: false },
    { id: "D", p: "61 cm", q: "162 cm²", label: "(p) 61 cm, (q) 162 cm²", isCorrect: false },
  ];

  const getInitial = () => {
    if (!value) return "A";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.label === str);
    return found ? found.id : "A";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const [activeLayer, setActiveLayer] = useState<"perimeter" | "area">("perimeter");

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Composite CAD Blueprint Laboratory (Q50)
            </h3>
            <p className="text-xs text-slate-600">
              Achievers Section: Calculate total outer boundary perimeter (<strong className="text-emerald-700">p</strong>) and remaining unshaded area (<strong className="text-emerald-700">q</strong>).
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300">
          Evaluated Pair: <span className="text-emerald-700 font-black">{activeOpt.label}</span>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveLayer("perimeter")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeLayer === "perimeter"
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Ruler className="w-4 h-4 text-emerald-700" /> Perimeter Inspection (p = 66 cm)
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer("area")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeLayer === "area"
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-700" /> Area Subtraction Layer (q = 162 cm²)
        </button>
      </div>

      {/* Interactive Blueprint Schematic */}
      <div
        onClick={() => handleSelect("A")}
        className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
      >
        {/* Visual Schematic Box */}
        <div className="relative border-2 border-dashed border-emerald-400 rounded-xl p-4 bg-emerald-50/50 flex flex-col items-center justify-center min-h-[160px] font-mono text-center">
          <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest mb-1">
            CAD DIMENSION OVERLAY: 18 cm &times; 12 cm
          </div>
          {activeLayer === "perimeter" ? (
            <div className="space-y-1">
              <div className="text-3xl font-black text-emerald-700">p = 66 cm</div>
              <div className="text-xs text-slate-600">
                Sum of all perimeter boundary segments
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-3xl font-black text-emerald-700">q = 162 cm²</div>
              <div className="text-xs text-slate-600">
                Total (216 cm²) &minus; Shaded (54 cm²) = 162 cm²
              </div>
            </div>
          )}
        </div>

        {/* Mathematical Breakdown Card */}
        <div className="space-y-2.5 font-mono text-xs text-slate-700">
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
            <span className="text-emerald-700 font-bold">1. Calculated Perimeter (p):</span>
            <div className="text-slate-600 font-sans">
              Outer boundaries sum = <span className="text-slate-900 font-bold font-mono">66 cm</span>
            </div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
            <span className="text-emerald-700 font-bold">2. Calculated Unshaded Area (q):</span>
            <div className="text-slate-600 font-sans">
              Area = 216 &minus; 54 = <span className="text-slate-900 font-bold font-mono">162 cm²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Measurement Pair:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div className="text-sm font-black font-mono">{opt.label}</div>
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

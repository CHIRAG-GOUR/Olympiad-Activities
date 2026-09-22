"use client";

import React, { useState } from "react";
import { Layout, Sparkles, CheckCircle2 } from "lucide-react";

interface FloorPlannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FloorPlannerActivity({
  value,
  onChange,
  readOnly = false,
}: FloorPlannerActivityProps) {
  // Stepped polygon area calculation:
  // Dimensions: 10 cm, 9 cm, 7 cm, 6 cm, 4 cm, 3 cm
  // Decomposed into 3 rectangular sections:
  // R1: 10 x 3 = 30 cm²
  // R2: 7 x 3 = 21 cm²
  // R3: 4 x 3 = 12 cm²
  // Total Area = 30 + 21 + 12 = 63 cm²
  const [selectedArea, setSelectedArea] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "63", label: "63 cm² (30 + 21 + 12 = 63 cm²)", isCorrect: true },
    { id: "B", val: "54", label: "54 cm²", isCorrect: false },
    { id: "C", val: "72", label: "72 cm²", isCorrect: false },
    { id: "D", val: "48", label: "48 cm²", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedArea(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-400">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-300 flex items-center gap-2">
              Architect's Floor Planner (Area Decomposition) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Decompose the stepped polygon into 3 rectangular regions: R1 + R2 + R3.
            </p>
          </div>
        </div>
      </div>

      {/* Stepped Blueprint Dissection View */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 340 180" className="w-full h-full max-w-sm select-none">
          {/* Region 1: 10 x 3 = 30 cm² (Blue) */}
          <rect x="40" y="110" width="260" height="50" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" />
          <text x="170" y="140" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="bold">
            R1: 10 × 3 = 30 cm²
          </text>

          {/* Region 2: 7 x 3 = 21 cm² (Emerald) */}
          <rect x="40" y="60" width="180" height="50" fill="#047857" fillOpacity="0.4" stroke="#34d399" strokeWidth="2" />
          <text x="130" y="90" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="bold">
            R2: 7 × 3 = 21 cm²
          </text>

          {/* Region 3: 4 x 3 = 12 cm² (Amber) */}
          <rect x="40" y="10" width="100" height="50" fill="#b45309" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="2" />
          <text x="90" y="40" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">
            R3: 4 × 3 = 12 cm²
          </text>

          {/* Total Area Annotation */}
          <text x="250" y="50" fill="#38bdf8" fontSize="12" fontWeight="extrabold">
            Total = 63 cm²
          </text>
        </svg>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Find the total area of the stepped figure:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedArea === opt.val || selectedArea === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-cyan-600/30 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">{opt.val} cm²</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

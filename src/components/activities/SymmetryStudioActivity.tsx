"use client";

import React, { useState } from "react";
import { Split, Sparkles, CheckCircle2 } from "lucide-react";

interface SymmetryStudioActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function SymmetryStudioActivity({
  value,
  onChange,
  readOnly = false,
}: SymmetryStudioActivityProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    value ? String(value) : ""
  );

  // Four geometric figures: P, Q, R, S
  // P (Regular Hexagon) -> 6 lines of symmetry (> 2)
  // Q (Square) -> 4 lines of symmetry (> 2)
  // R (Equilateral Triangle) -> 3 lines of symmetry (> 2)
  // S (Rectangle) -> 2 lines of symmetry (= 2)
  // Question: Which figures have more than 2 lines of symmetry?
  // Answer: P, Q, and R!
  const options = [
    { id: "A", label: "P, Q and R only", desc: "Hexagon (6), Square (4), Equilateral Triangle (3) > 2", isCorrect: true },
    { id: "B", label: "P and Q only", desc: "Leaves out Equilateral Triangle (3)", isCorrect: false },
    { id: "C", label: "P, Q, R and S", desc: "Rectangle has only 2 lines of symmetry", isCorrect: false },
    { id: "D", label: "Q and S only", desc: "Incorrect set", isCorrect: false },
  ];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedOption(id);
    onChange(id);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 border border-sky-400/40 rounded-lg text-sky-400">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-sky-300 flex items-center gap-2">
              Symmetry Mirror Studio <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Count the lines of reflectional symmetry for each figure. Condition: <strong className="text-sky-400">&gt; 2 lines</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Inspection Chambers: P, Q, R, S */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Figure P: Hexagon (6 lines) */}
        <div className="p-3.5 bg-slate-950/90 border-2 border-emerald-500/60 rounded-xl flex flex-col items-center justify-center gap-1 shadow-inner">
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <polygon points="30,5 52,18 52,42 30,55 8,42 8,18" fill="none" stroke="#34d399" strokeWidth="2.5" />
            <line x1="30" y1="5" x2="30" y2="55" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="8" y1="30" x2="52" y2="30" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-emerald-300">P (Hexagon)</span>
          <span className="text-[10px] font-mono text-emerald-400">6 Lines (&gt; 2) ✓</span>
        </div>

        {/* Figure Q: Square (4 lines) */}
        <div className="p-3.5 bg-slate-950/90 border-2 border-emerald-500/60 rounded-xl flex flex-col items-center justify-center gap-1 shadow-inner">
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <rect x="10" y="10" width="40" height="40" fill="none" stroke="#34d399" strokeWidth="2.5" />
            <line x1="30" y1="10" x2="30" y2="50" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="10" y1="30" x2="50" y2="30" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-emerald-300">Q (Square)</span>
          <span className="text-[10px] font-mono text-emerald-400">4 Lines (&gt; 2) ✓</span>
        </div>

        {/* Figure R: Equilateral Triangle (3 lines) */}
        <div className="p-3.5 bg-slate-950/90 border-2 border-emerald-500/60 rounded-xl flex flex-col items-center justify-center gap-1 shadow-inner">
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <polygon points="30,8 54,48 6,48" fill="none" stroke="#34d399" strokeWidth="2.5" />
            <line x1="30" y1="8" x2="30" y2="48" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-emerald-300">R (Eq. Triangle)</span>
          <span className="text-[10px] font-mono text-emerald-400">3 Lines (&gt; 2) ✓</span>
        </div>

        {/* Figure S: Rectangle (2 lines) */}
        <div className="p-3.5 bg-slate-950/90 border-2 border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 shadow-inner">
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <rect x="8" y="16" width="44" height="28" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <line x1="30" y1="16" x2="30" y2="44" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="8" y1="30" x2="52" y2="30" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-slate-400">S (Rectangle)</span>
          <span className="text-[10px] font-mono text-slate-500">2 Lines (= 2) ✗</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Select which figures have MORE THAN 2 lines of symmetry:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-sky-600/30 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/20 scale-[1.02]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">{opt.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-2">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

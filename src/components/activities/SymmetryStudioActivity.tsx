"use client";

import React, { useState } from "react";
import { Split,  CheckCircle2 } from "lucide-react";

interface SymmetryStudioActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function SymmetryStudioActivity({
  value,
  onChange,
  readOnly = false }: SymmetryStudioActivityProps) {
  const options = [
    {
      id: "A",
      label: "P, Q and R only",
      figures: ["P", "Q", "R"],
      desc: "Hexagon (6), Square (4), Equilateral Triangle (3) > 2 lines",
      isCorrect: true },
    {
      id: "B",
      label: "P and Q only",
      figures: ["P", "Q"],
      desc: "Leaves out Equilateral Triangle (3 lines)",
      isCorrect: false },
    {
      id: "C",
      label: "P, Q, R and S",
      figures: ["P", "Q", "R", "S"],
      desc: "Rectangle (S) has only 2 lines (not > 2)",
      isCorrect: false },
    {
      id: "D",
      label: "Q and S only",
      figures: ["Q", "S"],
      desc: "Incorrect subset",
      isCorrect: false },
  ];

  const initialOpt = options.find((o) => o.id === value) || options[0];
  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);

  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

  const handleSelectOption = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-700">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Symmetry Mirror Studio 
            </h3>
            <p className="text-xs text-slate-600">
              Inspect lines of reflectional symmetry. Condition: Figures with <strong className="text-sky-700">&gt; 2 lines of symmetry</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-sky-50 text-sky-900 px-3 py-1.5 rounded-lg border border-sky-200">
          Target: Count &gt; 2 Lines
        </div>
      </div>

      {/* 4 Geometric Shapes with dynamic highlight linked to option selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Figure P: Hexagon (6 lines) */}
        <div
          onClick={() => handleSelectOption("A")}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
            activeOpt.figures.includes("P")
              ? "bg-emerald-50 border-emerald-500 text-emerald-950 scale-[1.02]"
              : "bg-slate-50 border-slate-200 text-slate-500 opacity-60 hover:opacity-100"
          }`}
        >
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <polygon
              points="30,5 52,18 52,42 30,55 8,42 8,18"
              fill={activeOpt.figures.includes("P") ? "#d1fae5" : "#f1f5f9"}
              stroke="#059669"
              strokeWidth="2.5"
            />
            <line x1="30" y1="5" x2="30" y2="55" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="8" y1="30" x2="52" y2="30" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-slate-900">Figure P (Hexagon)</span>
          <span className="text-[11px] font-mono font-bold text-emerald-700">6 Lines (&gt; 2) ✓</span>
        </div>

        {/* Figure Q: Square (4 lines) */}
        <div
          onClick={() => handleSelectOption("A")}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
            activeOpt.figures.includes("Q")
              ? "bg-emerald-50 border-emerald-500 text-emerald-950 scale-[1.02]"
              : "bg-slate-50 border-slate-200 text-slate-500 opacity-60 hover:opacity-100"
          }`}
        >
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <rect
              x="10"
              y="10"
              width="40"
              height="40"
              fill={activeOpt.figures.includes("Q") ? "#d1fae5" : "#f1f5f9"}
              stroke="#059669"
              strokeWidth="2.5"
            />
            <line x1="30" y1="10" x2="30" y2="50" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="10" y1="30" x2="50" y2="30" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-slate-900">Figure Q (Square)</span>
          <span className="text-[11px] font-mono font-bold text-emerald-700">4 Lines (&gt; 2) ✓</span>
        </div>

        {/* Figure R: Equilateral Triangle (3 lines) */}
        <div
          onClick={() => handleSelectOption("A")}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
            activeOpt.figures.includes("R")
              ? "bg-emerald-50 border-emerald-500 text-emerald-950 scale-[1.02]"
              : "bg-slate-50 border-slate-200 text-slate-500 opacity-60 hover:opacity-100"
          }`}
        >
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <polygon
              points="30,8 54,48 6,48"
              fill={activeOpt.figures.includes("R") ? "#d1fae5" : "#f1f5f9"}
              stroke="#059669"
              strokeWidth="2.5"
            />
            <line x1="30" y1="8" x2="30" y2="48" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="6" y1="48" x2="42" y2="28" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-slate-900">Figure R (Triangle)</span>
          <span className="text-[11px] font-mono font-bold text-emerald-700">3 Lines (&gt; 2) ✓</span>
        </div>

        {/* Figure S: Rectangle (2 lines) */}
        <div
          onClick={() => handleSelectOption("C")}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
            activeOpt.figures.includes("S")
              ? "bg-amber-50 border-amber-500 text-amber-950 scale-[1.02]"
              : "bg-slate-50 border-slate-200 text-slate-500 opacity-60 hover:opacity-100"
          }`}
        >
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <rect
              x="5"
              y="15"
              width="50"
              height="30"
              fill={activeOpt.figures.includes("S") ? "#fef3c7" : "#f1f5f9"}
              stroke="#d97706"
              strokeWidth="2.5"
            />
            <line x1="30" y1="15" x2="30" y2="45" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="5" y1="30" x2="55" y2="30" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="text-xs font-bold text-slate-900">Figure S (Rectangle)</span>
          <span className="text-[11px] font-mono font-bold text-amber-700">2 Lines (not &gt; 2) ✗</span>
        </div>
      </div>

      {/* Answer Options Grid (Directly connected to shapes highlight) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Matching Subset:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-sky-50 border-sky-600 text-sky-950 shadow-md shadow-sky-600/10 scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="text-sm font-black">{opt.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

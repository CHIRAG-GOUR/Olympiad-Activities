"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Play, CheckCircle2 } from "lucide-react";

interface ShapeTransformActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ShapeTransformActivity({
  value,
  onChange,
  readOnly = false,
}: ShapeTransformActivityProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    value ? String(value) : ""
  );

  // Transformation rule: Figure (i) -> (ii) inverts outer shape and alters interior symbols.
  const options = [
    { id: "A", label: "Figure A", desc: "Correct inverted geometry with shaded center", isCorrect: true },
    { id: "B", label: "Figure B", desc: "Incorrect interior symbol orientation", isCorrect: false },
    { id: "C", label: "Figure C", desc: "No outer shape inversion", isCorrect: false },
    { id: "D", label: "Figure D", desc: "Missing shaded element", isCorrect: false },
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
          <div className="p-2.5 bg-purple-500/20 border border-purple-400/40 rounded-lg text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-purple-700 flex items-center gap-2">
              Shape Transformation Machine
            </h3>
            <p className="text-xs text-slate-600">
              Figure (i) transforms into (ii). Apply the exact same mutation to Figure (iii).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSimulating(true);
            setTimeout(() => setIsSimulating(false), 1200);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-800 hover:bg-purple-700 border border-purple-600 rounded text-xs font-semibold text-purple-800 transition"
        >
          <Play className="w-3.5 h-3.5" /> Run Machine
        </button>
      </div>

      {/* Machine Chamber Visualizer */}
      <div className="p-6 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl flex items-center justify-around flex-wrap gap-4">
        {/* Stage 1: Figure (i) */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-white border border-slate-200 border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-inner">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <polygon points="30,5 55,50 5,50" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="30" cy="35" r="7" fill="#f43f5e" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-slate-600">Figure (i)</span>
        </div>

        <ArrowRight className="w-6 h-6 text-purple-400 animate-pulse" />

        {/* Stage 2: Figure (ii) Result */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-white border border-slate-200 border border-purple-500/60 rounded-xl flex items-center justify-center p-2 shadow-inner">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <polygon points="30,55 55,10 5,10" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <rect x="23" y="20" width="14" height="14" fill="#f43f5e" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-purple-700 font-bold">Figure (ii) (Transformed)</span>
        </div>

        <div className="w-px h-16 bg-slate-100 border border-slate-200 hidden sm:block" />

        {/* Stage 3: Figure (iii) Target Input */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-white border border-slate-200 border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-inner">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke="#34d399" strokeWidth="2.5" />
              <polygon points="30,20 40,40 20,40" fill="#fbbf24" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-slate-600">Figure (iii) (Input)</span>
        </div>

        <ArrowRight className="w-6 h-6 text-emerald-400 animate-pulse" />

        {/* Stage 4: Result Output Slot */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center p-2 transition-all ${
              selectedOption
                ? "bg-purple-50/70 border border-purple-200 border-purple-400 shadow-lg shadow-purple-500/20"
                : "bg-white border border-slate-200 border-slate-200"
            }`}
          >
            <span className="font-black text-2xl text-purple-700">
              {selectedOption ? `Opt ${selectedOption}` : "?"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">Figure (iv) Target</span>
        </div>
      </div>

      {/* Answer Selection Grid */}
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
                  ? "bg-purple-600/30 border-purple-400 text-purple-800 shadow-lg shadow-purple-500/20 scale-[1.02]"
                  : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black">{opt.label}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

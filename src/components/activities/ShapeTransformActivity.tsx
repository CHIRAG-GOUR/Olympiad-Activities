"use client";

import React, { useState } from "react";
import { ArrowRight, Play, CheckCircle2, Shuffle } from "lucide-react";

interface ShapeTransformActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ShapeTransformActivity({
  value,
  onChange,
  readOnly = false }: ShapeTransformActivityProps) {
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

  const runSimulation = () => {
    setIsSimulating(true);
    handleSelect("A");
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-700">
            <Shuffle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Shape Transformation Machine
            </h3>
            <p className="text-xs text-slate-600">
              Figure (i) transforms into (ii). Apply the exact same mutation to Figure (iii).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={runSimulation}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Run Mutation
        </button>
      </div>

      {/* Machine Chamber Visualizer */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-around flex-wrap gap-4">
        {/* Stage 1: Figure (i) */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-xs">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <polygon points="30,5 55,50 5,50" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="30" cy="35" r="7" fill="#e11d48" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-slate-600 font-bold">Figure (i)</span>
        </div>

        <ArrowRight className="w-6 h-6 text-purple-600 animate-pulse" />

        {/* Stage 2: Figure (ii) Result */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-purple-50/70 border-2 border-purple-300 rounded-xl flex items-center justify-center p-2 shadow-xs">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <polygon points="30,55 55,10 5,10" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="23" y="20" width="14" height="14" fill="#e11d48" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-purple-700 font-bold">Figure (ii) (Mutated)</span>
        </div>

        <div className="w-px h-16 bg-slate-200 hidden sm:block" />

        {/* Stage 3: Figure (iii) Target Input */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-xs">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke="#059669" strokeWidth="2.5" />
              <polygon points="30,20 40,40 20,40" fill="#d97706" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-slate-600 font-bold">Figure (iii) (Input)</span>
        </div>

        <ArrowRight className="w-6 h-6 text-emerald-600 animate-pulse" />

        {/* Stage 4: Result Output Slot */}
        <div
          onClick={() => handleSelect("A")}
          className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
        >
          <div
            className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center p-2 transition-all ${
              selectedOption
                ? "bg-purple-50 border-purple-600 text-purple-900 shadow-md shadow-purple-600/10"
                : "bg-white border-2 border-dashed border-slate-300"
            }`}
          >
            <span className="font-black text-xl font-mono text-purple-800">
              {selectedOption ? `Opt ${selectedOption}` : "Click Target"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-700 font-bold">Figure (iv) (Click)</span>
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
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-purple-50 border-purple-600 text-purple-950 shadow-md shadow-purple-600/10 scale-[1.02]"
                  : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                    {opt.id}
                  </span>
                  <span className="text-base font-black font-mono">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

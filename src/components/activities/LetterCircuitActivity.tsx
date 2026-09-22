"use client";

import React, { useState } from "react";
import { Cpu, Zap, CheckCircle2, ArrowRight } from "lucide-react";

interface LetterCircuitActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function LetterCircuitActivity({
  value,
  onChange,
  readOnly = false,
}: LetterCircuitActivityProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>(value ? String(value) : "");
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);

  const candidates = [
    { id: "A", val: "O", formula: "L(12) + 3 = O(15) -> O(15) + 2 = Q(17)" },
    { id: "B", val: "Q", formula: "Direct duplicate" },
    { id: "C", val: "S", formula: "L(12) + 7" },
    { id: "D", val: "M", formula: "L(12) + 1" },
  ];

  const handleSelect = (letter: string) => {
    if (readOnly) return;
    setSelectedLetter(letter);
    onChange(letter);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/60 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-700/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-indigo-300 flex items-center gap-2">
              Letter Circuit Board
            </h3>
            <p className="text-xs text-slate-400">
              Complete the missing electronic bus terminal: Row rule = (+3, +2)
            </p>
          </div>
        </div>
      </div>

      {/* Circuit Board 3x3 Grid */}
      <div className="relative p-6 bg-slate-950/90 border border-indigo-900/80 rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center">
        {/* Circuit Trace Glow Effects */}
        <div className="absolute inset-x-8 top-1/3 h-0.5 bg-indigo-500/30 blur-[1px]" />
        <div className="absolute inset-x-8 top-2/3 h-0.5 bg-indigo-500/30 blur-[1px]" />
        <div className="absolute inset-y-8 left-1/3 w-0.5 bg-indigo-500/30 blur-[1px]" />
        <div className="absolute inset-y-8 right-1/3 w-0.5 bg-indigo-500/30 blur-[1px]" />

        {/* 3x3 Matrix Nodes */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 z-10">
          {/* Row 1 */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">U</span>
            <span className="text-[10px] font-mono text-slate-500">21</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">X</span>
            <span className="text-[10px] font-mono text-slate-500">24 (+3)</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">Z</span>
            <span className="text-[10px] font-mono text-slate-500">26 (+2)</span>
          </div>

          {/* Row 2 */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">M</span>
            <span className="text-[10px] font-mono text-slate-500">13</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">P</span>
            <span className="text-[10px] font-mono text-slate-500">16 (+3)</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">R</span>
            <span className="text-[10px] font-mono text-slate-500">18 (+2)</span>
          </div>

          {/* Row 3 */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">L</span>
            <span className="text-[10px] font-mono text-slate-500">12</span>
          </div>
          {/* Missing Target Cell */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
              selectedLetter
                ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20 animate-pulse"
                : "bg-slate-900/60 border-indigo-400/40 text-slate-500"
            }`}
          >
            <span className="font-black text-3xl">{selectedLetter || "?"}</span>
            <span className="text-[9px] font-mono text-amber-400/80">TARGET CELL</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900/90 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-lg">
            <span className="font-black text-2xl text-indigo-300">Q</span>
            <span className="text-[10px] font-mono text-slate-500">17 (+2)</span>
          </div>
        </div>
      </div>

      {/* Letter Selector Bus */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> Plug in the Missing Bus Component:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {candidates.map((cand) => {
            const isSelected = selectedLetter === cand.val || selectedLetter === cand.id;
            return (
              <button
                key={cand.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(cand.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-lg shadow-indigo-500/20 scale-[1.02]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl font-black">{cand.val}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-400">
                    Opt {cand.id}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 line-clamp-1">{cand.formula}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

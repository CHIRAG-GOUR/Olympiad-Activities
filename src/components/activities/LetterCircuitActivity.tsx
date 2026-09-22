"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Zap, CheckCircle2 } from "lucide-react";

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
  const options = [
    { id: "A", val: "O", label: "O (L + 3 = O, O + 2 = Q)", formula: "Row 3: L(12) + 3 = O(15) → O(15) + 2 = Q(17)", isCorrect: true },
    { id: "B", val: "Q", label: "Q", formula: "Duplicate of end terminal", isCorrect: false },
    { id: "C", val: "S", label: "S", formula: "L(12) + 7 = S(19)", isCorrect: false },
    { id: "D", val: "M", label: "M", formula: "L(12) + 1 = M(13)", isCorrect: false },
  ];

  const initialOpt = options.find((o) => o.id === value || o.val === value) || options[0];
  const [selectedId, setSelectedId] = useState<string>(value ? (options.find((o) => o.id === value || o.val === value)?.id || "A") : "");

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.val === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  const selectedOpt = options.find((o) => o.id === selectedId);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Letter Circuit Matrix Board
            </h3>
            <p className="text-xs text-slate-600">
              Click the missing slot in the circuit or select a candidate terminal to complete the (+3, +2) rule.
            </p>
          </div>
        </div>

        {/* Selected status badge */}
        {selectedOpt && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-mono font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plugged In: Option {selectedOpt.id} ({selectedOpt.val})</span>
          </div>
        )}
      </div>

      {/* Circuit Board 3x3 Grid */}
      <div className="relative p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at center, #059669 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* 3x3 Matrix Nodes */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 z-10">
          {/* Row 1 */}
          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">U</span>
            <span className="text-[10px] font-mono text-slate-500">21</span>
          </div>
          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">X</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">24 (+3)</span>
          </div>
          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">Z</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">26 (+2)</span>
          </div>

          {/* Row 2 */}
          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">M</span>
            <span className="text-[10px] font-mono text-slate-500">13</span>
          </div>
          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">P</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">16 (+3)</span>
          </div>
          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">R</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">18 (+2)</span>
          </div>

          {/* Row 3 */}
          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">L</span>
            <span className="text-[10px] font-mono text-slate-500">12</span>
          </div>

          {/* Missing Target Cell - Directly Clickable on Canvas */}
          <button
            type="button"
            disabled={readOnly}
            onClick={() => handleSelect(options[0])}
            className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedOpt
                ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md ring-4 ring-emerald-400/30 scale-105"
                : "bg-white border-amber-400 text-amber-600 hover:bg-amber-50"
            }`}
            title="Click to plug in the correct missing letter 'O'"
          >
            <span className="font-black text-2xl">{selectedOpt ? selectedOpt.val : "?"}</span>
            <span className="text-[9px] font-mono font-bold text-emerald-700">
              {selectedOpt ? `15 (+3)` : "CLICK TO FIT"}
            </span>
          </button>

          <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-xs">
            <span className="font-black text-2xl text-slate-900">Q</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">17 (+2)</span>
          </div>
        </div>
      </div>

      {/* Letter Selector Candidates */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" /> Plug In Missing Terminal Option:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((cand) => {
            const isSelected = selectedId === cand.id;
            return (
              <button
                key={cand.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(cand)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {cand.id}
                    </span>
                    <span className="text-xl font-black">{cand.val}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium line-clamp-1">
                  {cand.formula}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

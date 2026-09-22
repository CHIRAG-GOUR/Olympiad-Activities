"use client";

import React, { useState } from "react";
import { TrendingDown,  CheckCircle2 } from "lucide-react";

interface NumberTrailActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function NumberTrailActivity({
  value,
  onChange,
  readOnly = false }: NumberTrailActivityProps) {
  // Descending Integer Sequence (Greatest to Least):
  // Given integers: 18, -25, 0, -12, 34, -4
  // Descending Order: 34 > 18 > 0 > -4 > -12 > -25
  const [selectedSequence, setSelectedSequence] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", seq: "34, 18, 0, -4, -12, -25", label: "34 > 18 > 0 > -4 > -12 > -25 (Descending)", isCorrect: true },
    { id: "B", seq: "-25, -12, -4, 0, 18, 34", label: "-25 < -12 < ... (Ascending Order)", isCorrect: false },
    { id: "C", seq: "34, 18, 0, -25, -12, -4", label: "34, 18, 0, -25... (Wrong negative order)", isCorrect: false },
    { id: "D", seq: "18, 34, 0, -4, -12, -25", label: "18, 34... (Unsorted positive values)", isCorrect: false },
  ];

  const handleSelect = (seq: string) => {
    if (readOnly) return;
    setSelectedSequence(seq);
    onChange(seq);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 border border-rose-400/40 rounded-lg text-rose-700">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-rose-700 flex items-center gap-2">
              Mountain-to-Valley Number Trail 
            </h3>
            <p className="text-xs text-slate-600">
              Arrange the signed integers in descending order (highest altitude peak to lowest valley floor).
            </p>
          </div>
        </div>
      </div>

      {/* Altitude Trail Visualizer */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-x-auto">
        <div className="flex items-end gap-3 min-w-[480px]">
          {[
            { val: 34, h: "h-28", bg: "bg-emerald-600", label: "Peak (+34)" },
            { val: 18, h: "h-20", bg: "bg-emerald-700", label: "High (+18)" },
            { val: 0, h: "h-14", bg: "bg-slate-700", label: "Sea Level (0)" },
            { val: -4, h: "h-12", bg: "bg-rose-900", label: "Valley (-4)" },
            { val: -12, h: "h-16", bg: "bg-rose-50 border border-rose-200", label: "Trench (-12)" },
            { val: -25, h: "h-24", bg: "bg-rose-50 border border-rose-200 border border-rose-500", label: "Abyss (-25)" },
          ].map((node, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-black text-xs font-mono text-slate-900">{node.val}</span>
              <div className={`w-full ${node.h} ${node.bg} rounded-t-lg transition-all`} />
              <span className="text-[9px] font-mono text-slate-600 text-center leading-tight">
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedSequence === opt.seq || selectedSequence === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.seq)}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                isSelected
                  ? "bg-rose-600/30 border-rose-400 text-rose-800 shadow-lg shadow-rose-500/20 scale-[1.01]"
                  : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono text-rose-700 mr-2">
                  Option {opt.id}
                </span>
                <span className="font-mono text-sm font-black tracking-wide">{opt.seq}</span>
                <p className="text-[11px] text-slate-600 mt-1 font-normal">{opt.label}</p>
              </div>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-rose-700 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

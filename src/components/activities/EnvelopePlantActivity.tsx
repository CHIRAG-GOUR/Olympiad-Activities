"use client";

import React, { useState } from "react";
import { Scissors, Sparkles, CheckCircle2 } from "lucide-react";

interface EnvelopePlantActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function EnvelopePlantActivity({
  value,
  onChange,
  readOnly = false,
}: EnvelopePlantActivityProps) {
  // Master sheet: 384 cm long, 168 cm wide.
  // Envelope piece size: 16 cm long, 12 cm wide.
  // Integer divisions along dimensions:
  // Along length: 384 / 16 = 24 envelopes
  // Along width: 168 / 12 = 14 envelopes
  // Total complete envelopes = 24 * 14 = 336 envelopes!
  const [selectedCount, setSelectedCount] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "336", label: "336 Envelopes (24 rows × 14 columns = 336)", isCorrect: true },
    { id: "B", val: "320", label: "320 Envelopes", isCorrect: false },
    { id: "C", val: "348", label: "348 Envelopes", isCorrect: false },
    { id: "D", val: "288", label: "288 Envelopes", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedCount(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Envelope Manufacturing Plant (384×168 cm) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Calculate total complete 16×12 cm envelopes cut from the master sheet without waste.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Tessellation Layout View */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-around flex-wrap gap-4">
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Length Division</span>
          <div className="font-black text-xl text-emerald-300">24 Units</div>
          <span className="text-[10px] text-slate-500 font-mono">384 cm ÷ 16 cm</span>
        </div>

        <div className="text-2xl font-black text-emerald-400">×</div>

        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Width Division</span>
          <div className="font-black text-xl text-emerald-300">14 Units</div>
          <span className="text-[10px] text-slate-500 font-mono">168 cm ÷ 12 cm</span>
        </div>

        <div className="text-2xl font-black text-emerald-400">=</div>

        <div className="p-3.5 bg-emerald-950/60 border-2 border-emerald-400 rounded-xl text-center space-y-1 shadow-lg shadow-emerald-500/20">
          <span className="text-xs font-mono text-emerald-300 font-bold">Total Envelopes</span>
          <div className="font-black text-2xl text-white">336 Units</div>
          <span className="text-[10px] text-emerald-300 font-mono">24 × 14 = 336</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedCount === opt.val || selectedCount === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

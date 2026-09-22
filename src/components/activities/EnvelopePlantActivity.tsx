"use client";

import React, { useState } from "react";
import { Scissors,  CheckCircle2 } from "lucide-react";

interface EnvelopePlantActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function EnvelopePlantActivity({
  value,
  onChange,
  readOnly = false }: EnvelopePlantActivityProps) {
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
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-700">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
              Envelope Manufacturing Plant (384×168 cm) 
            </h3>
            <p className="text-xs text-slate-600">
              Calculate total complete 16×12 cm envelopes cut from the master sheet without waste.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Tessellation Layout View */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-around flex-wrap gap-4">
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-600">Length Division</span>
          <div className="font-black text-xl text-emerald-700">24 Units</div>
          <span className="text-[10px] text-slate-500 font-mono">384 cm ÷ 16 cm</span>
        </div>

        <div className="text-2xl font-black text-emerald-700">×</div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-600">Width Division</span>
          <div className="font-black text-xl text-emerald-700">14 Units</div>
          <span className="text-[10px] text-slate-500 font-mono">168 cm ÷ 12 cm</span>
        </div>

        <div className="text-2xl font-black text-emerald-700">=</div>

        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-center space-y-1 shadow-lg shadow-emerald-500/20">
          <span className="text-xs font-mono text-emerald-700 font-bold">Total Envelopes</span>
          <div className="font-black text-2xl text-slate-900">336 Units</div>
          <span className="text-[10px] text-emerald-700 font-mono">24 × 14 = 336</span>
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
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-800 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

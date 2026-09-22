"use client";

import React, { useState } from "react";
import { Package, Sparkles, CheckCircle2 } from "lucide-react";

interface PenPackingActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PenPackingActivity({
  value,
  onChange,
  readOnly = false,
}: PenPackingActivityProps) {
  // Black pens: 1,25,360
  // Blue pens: 93,515
  // Total pens = 1,25,360 + 93,515 = 2,18,875 pens
  // Box capacity = 425 pens
  // Total boxes = 2,18,875 / 425 = 515 complete boxes!
  const [selectedBoxes, setSelectedBoxes] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "515", label: "515 Boxes (2,18,875 total pens ÷ 425 = 515)", isCorrect: true },
    { id: "B", val: "525", label: "525 Boxes", isCorrect: false },
    { id: "C", val: "485", label: "485 Boxes", isCorrect: false },
    { id: "D", val: "505", label: "505 Boxes", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedBoxes(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-lg text-indigo-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-indigo-300 flex items-center gap-2">
              Pen Packing Factory <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Combine <strong className="text-white">1,25,360 Black</strong> + <strong className="text-white">93,515 Blue</strong> pens into boxes of 425.
            </p>
          </div>
        </div>
      </div>

      {/* Industrial Packing Conveyor */}
      <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-around flex-wrap gap-4">
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-400">Total Merged Pens</span>
          <div className="font-black text-xl text-white font-mono">2,18,875</div>
          <span className="text-[10px] text-slate-500 font-mono">1,25,360 + 93,515</span>
        </div>

        <div className="text-2xl font-black text-indigo-400">÷ 425 =</div>

        <div className="p-3.5 bg-indigo-950/60 border-2 border-indigo-400 rounded-xl text-center space-y-1 shadow-lg shadow-indigo-500/20">
          <span className="text-xs font-mono text-indigo-300 font-bold">Boxes Required</span>
          <div className="font-black text-2xl text-white font-mono">515 Boxes</div>
          <span className="text-[10px] text-indigo-300 font-mono">0 remainder pens</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedBoxes === opt.val || selectedBoxes === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-lg shadow-indigo-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

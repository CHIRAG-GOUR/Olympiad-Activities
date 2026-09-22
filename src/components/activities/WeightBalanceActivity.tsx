"use client";

import React, { useState } from "react";
import { Scale, Sparkles, CheckCircle2 } from "lucide-react";

interface WeightBalanceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function WeightBalanceActivity({
  value,
  onChange,
  readOnly = false,
}: WeightBalanceActivityProps) {
  // Sneha's weight = 42.5 kg
  // Sakshi's weight = 4.8 kg more than Sneha = 42.5 + 4.8 = 47.3 kg
  // Total weight of all three persons = 138.2 kg
  // Third person's weight = 138.2 - (42.5 + 47.3) = 138.2 - 89.8 = 48.4 kg!
  const [selectedWeight, setSelectedWeight] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "48.4 kg", label: "48.4 kg (138.2 kg - (42.5 + 47.3) = 48.4 kg)", isCorrect: true },
    { id: "B", val: "47.3 kg", label: "47.3 kg (This is Sakshi's weight)", isCorrect: false },
    { id: "C", val: "46.2 kg", label: "46.2 kg", isCorrect: false },
    { id: "D", val: "49.6 kg", label: "49.6 kg", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedWeight(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 border border-sky-400/40 rounded-lg text-sky-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-sky-700 flex items-center gap-2">
              Three-Person Weight Balance Station <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Sneha (42.5 kg), Sakshi (47.3 kg). Find Third Person's weight given Total = 138.2 kg.
            </p>
          </div>
        </div>
      </div>

      {/* Balance Platform Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-600">Person 1: Sneha</span>
          <div className="font-black text-lg text-sky-700">42.5 kg</div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-600">Person 2: Sakshi (+4.8kg)</span>
          <div className="font-black text-lg text-sky-700">47.3 kg</div>
        </div>

        <div className="p-3.5 bg-sky-950/60 border-2 border-sky-400 rounded-xl text-center space-y-1 shadow-lg shadow-sky-500/20">
          <span className="text-xs font-mono text-sky-700 font-bold">Person 3: Target</span>
          <div className="font-black text-lg text-white">48.4 kg</div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedWeight === opt.val || selectedWeight === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-sky-600/30 border-sky-400 text-sky-800 shadow-lg shadow-sky-500/20 scale-[1.02]"
                  : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

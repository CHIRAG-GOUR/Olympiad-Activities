"use client";

import React, { useState } from "react";
import { Cpu, Sparkles, CheckCircle2 } from "lucide-react";

interface DigitPlantActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function DigitPlantActivity({
  value,
  onChange,
  readOnly = false,
}: DigitPlantActivityProps) {
  // Digits: 1, 4, 0, 6, 8 (Form 6-digit numbers by repeating greatest/smallest digits):
  // Greatest 6-digit number: 886410 (repeat 8 twice)
  // Smallest 6-digit number: 100468 (repeat 0 twice, cannot start with 0)
  // Difference = 886410 - 100468 = 785942!
  const [selectedDiff, setSelectedDiff] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "7,85,942", label: "7,85,942 (886410 - 100468 = 785942)", isCorrect: true },
    { id: "B", val: "7,86,942", label: "7,86,942", isCorrect: false },
    { id: "C", val: "7,75,942", label: "7,75,942", isCorrect: false },
    { id: "D", val: "7,95,942", label: "7,95,942", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedDiff(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-indigo-300 flex items-center gap-2">
              Digit Manufacturing Plant <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Compute the difference between the Greatest (886410) and Smallest (100468) 6-digit numbers formed from <strong className="text-white">1, 4, 0, 6, 8</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Assembly Conveyors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950/90 border border-indigo-500/40 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-indigo-400 block">
            GREATEST 6-DIGIT ASSEMBLY
          </span>
          <div className="font-black text-2xl text-white font-mono">8,86,410</div>
          <span className="text-[10px] text-slate-400 font-mono">Repeats largest digit 8</span>
        </div>

        <div className="p-4 bg-slate-950/90 border border-sky-500/40 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-sky-400 block">
            SMALLEST 6-DIGIT ASSEMBLY
          </span>
          <div className="font-black text-2xl text-white font-mono">1,00,468</div>
          <span className="text-[10px] text-slate-400 font-mono">Starts with 1, repeats 0</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Find the difference between the two numbers:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedDiff === opt.val || selectedDiff === opt.id;
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
                  <span className="text-xl font-black">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Factory, Sparkles, CheckCircle2 } from "lucide-react";

interface NumberPressActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function NumberPressActivity({
  value,
  onChange,
  readOnly = false,
}: NumberPressActivityProps) {
  // Greatest 6-digit number formed using digits 3, 5, 0, 2, 9 (repeating 9 twice for 6 digits):
  // 995320 -> International System: Nine hundred ninety-five thousand three hundred twenty!
  const [selectedName, setSelectedName] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", name: "Nine hundred ninety-five thousand three hundred twenty", num: "995,320", isCorrect: true },
    { id: "B", name: "Nine lakh ninety-five thousand three hundred twenty", num: "9,95,320 (Indian System)", isCorrect: false },
    { id: "C", name: "Nine hundred fifty-nine thousand three hundred twenty", num: "959,320", isCorrect: false },
    { id: "D", name: "Nine hundred ninety-five thousand two hundred thirty", num: "995,230", isCorrect: false },
  ];

  const handleSelect = (name: string) => {
    if (readOnly) return;
    setSelectedName(name);
    onChange(name);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-lg text-indigo-400">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-indigo-300 flex items-center gap-2">
              Number Naming Press (International System) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Form the greatest 6-digit number from digits <strong className="text-white">3, 5, 0, 2, 9</strong> and write its International name.
            </p>
          </div>
        </div>
      </div>

      {/* Assembly Digit Belt */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {["9", "9", "5", "3", "2", "0"].map((digit, idx) => (
            <div
              key={idx}
              className="w-12 h-14 bg-indigo-950/80 border-2 border-indigo-400 rounded-xl flex flex-col items-center justify-center shadow-lg"
            >
              <span className="font-black text-2xl text-white">{digit}</span>
              <span className="text-[9px] font-mono text-indigo-300">
                {idx < 3 ? "THOU" : "ONES"}
              </span>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-sm text-indigo-300">
          International Number Formatting: <strong className="text-white text-base">995,320</strong>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Select the correct number name in the International Number System:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedName === opt.name || selectedName === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.name)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-lg shadow-indigo-500/20 scale-[1.01]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-indigo-400 mr-2">
                    Option {opt.id}
                  </span>
                  <span className="font-sans text-sm font-black">{opt.name}</span>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{opt.num}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

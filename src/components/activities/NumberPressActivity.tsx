"use client";

import React, { useState, useEffect } from "react";
import { Factory, CheckCircle2 } from "lucide-react";

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
  const options = [
    { id: "A", name: "Nine lakh ninety five thousand three hundred twenty (995320)", num: "9,95,320", isCorrect: true },
    { id: "B", name: "Nine hundred ninety five thousand three hundred twenty", num: "995,320 (International)", isCorrect: false },
    { id: "C", name: "Nine lakh fifty five thousand three hundred two", num: "9,55,302", isCorrect: false },
    { id: "D", name: "Nine hundred ninety thousand five hundred thirty two", num: "990,532", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.name === value)?.id || "A") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.name === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Number Formatter & Naming Press
            </h3>
            <p className="text-xs text-slate-600">
              Form the greatest 6-digit number using digits 3, 5, 0, 2, 9 (repeating 9): <strong className="text-slate-900">9,95,320</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Assembly Digit Belt (Interactive Canvas) */}
      <div
        onClick={() => handleSelect(options[0])}
        className="p-5 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all shadow-xs"
        title="Click to assemble the greatest 6-digit number (9,95,320)"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {[
            { d: "9", p: "Lakhs" },
            { d: "9", p: "T-Th" },
            { d: "5", p: "Thous" },
            { d: "3", p: "Hund" },
            { d: "2", p: "Tens" },
            { d: "0", p: "Ones" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center shadow-xs border-2 transition-all ${
                selectedId === "A"
                  ? "bg-white border-emerald-500 text-emerald-950 scale-105"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <span className="font-black text-2xl">{item.d}</span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">{item.p}</span>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-700 shadow-xs">
          Formed Number: <strong className="text-emerald-700 text-base font-black">9,95,320</strong> →{" "}
          <span className="font-bold text-slate-900">Nine lakh ninety five thousand three hundred twenty (Option A) ★</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select the correct number name for the greatest 6-digit number:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.01]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="font-sans text-sm font-black">{opt.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono font-medium">{opt.num}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

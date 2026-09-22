"use client";

import React, { useState } from "react";
import { Scroll, CheckCircle2, Sparkles, HelpCircle } from "lucide-react";

interface RomanArchaeologyActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function RomanArchaeologyActivity({
  value,
  onChange,
  readOnly = false,
}: RomanArchaeologyActivityProps) {
  // Question 33: Calculate the value of the Roman numeral operation that gives the LEAST value:
  // A: MMMCLXIX − MMDCCXVII = 3169 − 2717 = 452
  // B: MMCDLXV − MCCXLIV = 2465 − 1244 = 1221
  // C: DCCCXCIX − CDXLVII = 899 − 447 = 452
  // D: MMDCCIX − MMCDIII = 2709 − 2403 = 306 (LEAST VALUE = 306) -> Option D

  const options = [
    {
      id: "A",
      expr: "MMMCLXIX − MMDCCXVII",
      n1: "3169",
      n2: "2717",
      diff: 452,
      label: "3,169 − 2,717 = 452",
      isLeast: false,
    },
    {
      id: "B",
      expr: "MMCDLXV − MCCXLIV",
      n1: "2465",
      n2: "1244",
      diff: 1221,
      label: "2,465 − 1,244 = 1,221",
      isLeast: false,
    },
    {
      id: "C",
      expr: "DCCCXCIX − CDXLVII",
      n1: "899",
      n2: "447",
      diff: 452,
      label: "899 − 447 = 452",
      isLeast: false,
    },
    {
      id: "D",
      expr: "MMDCCIX − MMCDIII",
      n1: "2709",
      n2: "2403",
      diff: 306,
      label: "2,709 − 2,403 = 306 (LEAST VALUE)",
      isLeast: true,
    },
  ];

  const getInitial = () => {
    if (!value) return "D";
    const str = String(value).trim();
    const found = options.find(
      (o) => o.id === str || o.expr === str || String(o.diff) === str
    );
    return found ? found.id : "D";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  const activeOpt = options.find((o) => o.id === selectedId) || options[3];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-800">
            <Scroll className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-900 flex items-center gap-2">
              Roman Numeral Archaeology Lab (Q33)
            </h3>
            <p className="text-xs text-slate-600">
              Decipher all 4 ancient stone tablets and click the tablet with the <strong className="text-amber-800">LEAST numeric difference (306)</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
          Decoded: {activeOpt.expr} = <span className="text-emerald-700">{activeOpt.diff}</span>
        </div>
      </div>

      {/* 4 Clickable Inscription Tablets */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Interactive Archaeological Tablets (Click any tablet to decipher & select):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between text-center relative ${
                  isSelected
                    ? "bg-amber-50 border-amber-500 text-amber-950 shadow-md ring-2 ring-amber-400/30 scale-[1.02]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {opt.isLeast && (
                  <span className="absolute -top-2 right-2 text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                    LEAST: 306
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                      TABLET {opt.id}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <div className="font-mono text-xs font-black text-slate-900 my-1 break-words">
                    {opt.expr}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">
                    {opt.n1} − {opt.n2}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">Value:</span>
                  <span className={`font-mono text-sm font-black ${opt.isLeast ? "text-emerald-700" : "text-slate-800"}`}>
                    = {opt.diff}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer Options Grid (Strictly connected to tablet selector) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Roman Numeral Expression with LEAST Value:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-amber-50 border-amber-600 text-amber-950 shadow-sm ring-1 ring-amber-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div>
                    <div className="font-mono text-xs font-black">{opt.expr}</div>
                    <div className="text-[11px] text-slate-500 font-sans font-normal mt-0.5">{opt.label}</div>
                  </div>
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

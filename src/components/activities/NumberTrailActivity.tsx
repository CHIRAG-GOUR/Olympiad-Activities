"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, CheckCircle2 } from "lucide-react";

interface NumberTrailActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function NumberTrailActivity({
  value,
  onChange,
  readOnly = false,
}: NumberTrailActivityProps) {
  const options = [
    { id: "A", seq: "−31, −25, −10, 12, 18", label: "−31, −25, −10, 12, 18 (Ascending)", isCorrect: false },
    { id: "B", seq: "−20, −39, −41, 0, 11", label: "−20, −39, −41, 0, 11", isCorrect: false },
    { id: "C", seq: "49, 38, 20, −10, −25", label: "49 > 38 > 20 > −10 > −25 (Strictly Descending)", isCorrect: true },
    { id: "D", seq: "78, 57, −20, −11, −5", label: "78, 57, −20, −11, −5", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.seq === value)?.id || "C") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.seq === value);
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
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Mountain-to-Valley Integer Trail (Descending Order)
            </h3>
            <p className="text-xs text-slate-600">
              Click the peak-to-abyss sequence cards to order integers from greatest positive to least negative.
            </p>
          </div>
        </div>
      </div>

      {/* Altitude Trail Visualizer (Interactive Canvas) */}
      <div
        onClick={() => handleSelect(options[2])}
        className="p-5 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl flex items-center justify-center overflow-x-auto cursor-pointer transition-all shadow-xs"
        title="Click to select Descending Trail (Option C)"
      >
        <div className="flex items-end gap-3 min-w-[440px]">
          {[
            { val: 49, h: "h-28", bg: "bg-emerald-600", label: "Peak (+49)" },
            { val: 38, h: "h-22", bg: "bg-emerald-600", label: "High (+38)" },
            { val: 20, h: "h-16", bg: "bg-emerald-500", label: "Mid (+20)" },
            { val: -10, h: "h-14", bg: "bg-rose-500", label: "Valley (−10)" },
            { val: -25, h: "h-24", bg: "bg-rose-700", label: "Abyss (−25)" },
          ].map((node, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="font-black text-sm font-mono text-slate-900">{node.val}</span>
              <div className={`w-full ${node.h} ${node.bg} rounded-t-lg transition-all shadow-xs`} />
              <span className="text-[10px] font-mono text-slate-500 text-center leading-tight">
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select descending integer order:
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
                    <span className="font-mono text-base font-black tracking-wide">{opt.seq}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{opt.label}</p>
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

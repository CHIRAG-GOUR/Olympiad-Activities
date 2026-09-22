"use client";

import React, { useState, useEffect } from "react";
import { Train, CheckCircle2 } from "lucide-react";

interface RoundingRailwayActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function RoundingRailwayActivity({
  value,
  onChange,
  readOnly = false,
}: RoundingRailwayActivityProps) {
  const options = [
    { id: "A", val: "360000", label: "3,60,000", isCorrect: false },
    { id: "B", val: "354000", label: "3,54,000 (7,90,000 − 4,36,000 = 3,54,000)", isCorrect: true },
    { id: "C", val: "352000", label: "3,52,000", isCorrect: false },
    { id: "D", val: "362000", label: "3,62,000", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "B") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.val === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  const selectedOpt = options.find((o) => o.id === selectedId);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Rounding Railway Yard (Nearest 1,000)
            </h3>
            <p className="text-xs text-slate-600">
              Round <strong className="text-slate-900 font-mono">7,89,562</strong> → 7,90,000 and <strong className="text-slate-900 font-mono">4,35,821</strong> → 4,36,000. Calculate their estimated difference.
            </p>
          </div>
        </div>
      </div>

      {/* Railway Number Line Track (Interactive Canvas) */}
      <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center">
        <div className="w-full max-w-lg relative py-6">
          {/* Dual Trains Telemetry */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              onClick={() => handleSelect(options[1])}
              className="p-3 bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-xl text-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-[11px] font-mono text-slate-500 uppercase block font-bold">Train 1 (Load A)</span>
              <span className="text-sm font-black text-slate-900">7,89,562</span>
              <div className="text-xs font-mono font-bold text-emerald-700 mt-1">
                ≈ 7,90,000 (Rounds Up)
              </div>
            </div>

            <div
              onClick={() => handleSelect(options[1])}
              className="p-3 bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-xl text-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-[11px] font-mono text-slate-500 uppercase block font-bold">Train 2 (Load B)</span>
              <span className="text-sm font-black text-slate-900">4,35,821</span>
              <div className="text-xs font-mono font-bold text-emerald-700 mt-1">
                ≈ 4,36,000 (Rounds Up)
              </div>
            </div>
          </div>

          {/* Main Track Line with Switch */}
          <div
            onClick={() => handleSelect(options[1])}
            className="h-4 bg-slate-200 rounded-full w-full relative flex items-center justify-between px-3 cursor-pointer shadow-inner"
          >
            <div className="absolute left-[50%] -translate-x-1/2 -top-7 flex flex-col items-center">
              <div className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black shadow-xs flex items-center gap-1.5 animate-bounce">
                🚂 Difference: 3,54,000
              </div>
              <div className="w-2 h-2 bg-emerald-600 transform rotate-45 -mt-1" />
            </div>
          </div>

          {/* Station Platforms */}
          <div className="flex items-center justify-between mt-3 text-xs font-mono">
            <span className="text-slate-500">7,90,000 (Minuend)</span>
            <span className="text-emerald-700 font-bold">− 4,36,000 (Subtrahend)</span>
          </div>
        </div>
      </div>

      {/* Destination Stations Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Estimated Difference at Junction:
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
                    <span className="font-mono text-lg font-black">{opt.val}</span>
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

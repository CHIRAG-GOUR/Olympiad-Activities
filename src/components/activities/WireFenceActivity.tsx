"use client";

import React, { useState, useEffect } from "react";
import { Square, CheckCircle2 } from "lucide-react";

interface WireFenceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function WireFenceActivity({
  value,
  onChange,
  readOnly = false,
}: WireFenceActivityProps) {
  const options = [
    { id: "A", val: "2700 sq. m", label: "2,700 sq. m", isCorrect: false },
    { id: "B", val: "1800 sq. m", label: "1,800 sq. m (Length = 60m, Breadth = 30m → 60 × 30 = 1,800 m²)", isCorrect: true },
    { id: "C", val: "2150 sq. m", label: "2,150 sq. m", isCorrect: false },
    { id: "D", val: "None of these", label: "None of these", isCorrect: false },
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

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Square className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Wire-to-Fence Perimeter Workshop
            </h3>
            <p className="text-xs text-slate-600">
              A 180m wire forms a rectangle where <strong className="text-emerald-700">Breadth = Length / 2</strong> (60m × 30m). Click the fence to calculate area.
            </p>
          </div>
        </div>

        {/* Quick Area Presets */}
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedId === opt.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {opt.val} ({opt.id})
            </button>
          ))}
        </div>
      </div>

      {/* Bent Wire Geometry Frame (Interactive Canvas) */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={() => handleSelect(options[1])}
            className="w-72 h-36 border-4 border-emerald-500 bg-emerald-50 rounded-xl relative flex flex-col items-center justify-center shadow-md shadow-emerald-500/10 cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-xs font-mono font-bold text-emerald-800">
              Length = 60 m
            </span>
            <span className="font-black text-2xl text-slate-900 my-1 font-mono">
              Area = 1,800 sq. m ★
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800">
              Breadth = 30 m (Half of Length)
            </span>

            {/* Corner dimension markers */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-mono font-bold text-slate-700 shadow-xs">
              Perimeter = 2 × (60 + 30) = 180 m
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Find the area enclosed by the rectangular wire fence:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="text-xl font-black font-mono">{opt.val}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

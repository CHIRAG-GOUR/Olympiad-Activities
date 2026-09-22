"use client";

import React, { useState, useEffect } from "react";
import { Layout, CheckCircle2 } from "lucide-react";

interface FloorPlannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FloorPlannerActivity({
  value,
  onChange,
  readOnly = false,
}: FloorPlannerActivityProps) {
  const options = [
    { id: "A", val: "36", label: "36 sq. cm (Outer 90 − Inner 54 = 36 sq. cm)", isCorrect: true },
    { id: "B", val: "37", label: "37 sq. cm", isCorrect: false },
    { id: "C", val: "28", label: "28 sq. cm", isCorrect: false },
    { id: "D", val: "63", label: "63 sq. cm", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "A") : ""
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
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Architect's Floor Blueprint (Shaded Border Area)
            </h3>
            <p className="text-xs text-slate-600">
              Outer Rectangle = 10 cm × 9 cm (90 cm²), Inner Cutout = 54 cm². Click the shaded border to calculate remaining area.
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
              {opt.val} sq. cm ({opt.id})
            </button>
          ))}
        </div>
      </div>

      {/* Blueprint Dissection View (Interactive Canvas) */}
      <div className="relative h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 340 180" className="w-full h-full max-w-sm select-none">
          {/* Outer Rectangle (10 x 9 = 90 cm²) - Shaded Green Border */}
          <g className="cursor-pointer" onClick={() => handleSelect(options[0])}>
            <rect
              x="30" y="15" width="280" height="150" rx="8"
              fill={selectedId === "A" ? "#d1fae5" : "#ecfdf5"}
              stroke="#059669" strokeWidth="3"
            />
            <text x="170" y="32" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="bold">
              Outer Rectangle: 10 cm × 9 cm = 90 cm²
            </text>
          </g>

          {/* Inner Stepped Cutout (54 cm²) - White Unshaded Area */}
          <g className="cursor-pointer" onClick={() => handleSelect(options[0])}>
            <rect x="70" y="45" width="200" height="90" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            <text x="170" y="85" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold">
              Inner Cutout = 54 cm²
            </text>
            <text x="170" y="105" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="black">
              Shaded Border: 90 − 54 = 36 cm² (Click) ★
            </text>
          </g>
        </svg>

        <div
          onClick={() => handleSelect(options[0])}
          className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-700 shadow-xs cursor-pointer hover:bg-emerald-50"
        >
          SHADED BORDER: 90 − 54 = 36 sq. cm (Option A) ★
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Find the area of the remaining shaded border:
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
                    <span className="text-xl font-black font-mono">{opt.val} sq. cm</span>
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

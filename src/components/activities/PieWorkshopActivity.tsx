"use client";

import React, { useState, useEffect } from "react";
import { PieChart, CheckCircle2 } from "lucide-react";

interface PieWorkshopActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PieWorkshopActivity({
  value,
  onChange,
  readOnly = false,
}: PieWorkshopActivityProps) {
  const options = [
    { id: "A", val: "3 / 61", label: "3 / 61", isCorrect: false },
    { id: "B", val: "6 / 61", label: "6 / 61 (12 Tuesday visitors / 122 Total weekly visitors)", isCorrect: true },
    { id: "C", val: "3 / 22", label: "3 / 22", isCorrect: false },
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
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Library Data Pie Fraction Workshop
            </h3>
            <p className="text-xs text-slate-600">
              Tuesday visitors = 12, Total weekly visitors = 122. Find fraction in simplest form.
            </p>
          </div>
        </div>

        {/* Quick Fraction Presets */}
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

      {/* Pie Sector Visualizer (Interactive Canvas) */}
      <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center">
        <div className="flex items-center gap-8 flex-wrap justify-center">
          <svg
            viewBox="0 0 160 160"
            className="w-36 h-36 select-none cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleSelect(options[1])}
          >
            {/* Full Weekly Circle: 122 */}
            <circle cx="80" cy="80" r="70" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
            {/* Tuesday Sector: 12/122 = ~35.4 degrees */}
            <path
              d="M 80 80 L 80 10 A 70 70 0 0 1 120 23 Z"
              fill={selectedId === "B" ? "#a7f3d0" : "#d1fae5"}
              stroke="#059669"
              strokeWidth="2.5"
            />
            <text x="85" y="45" fill="#065f46" fontSize="11" fontWeight="bold">
              Tue: 12
            </text>
          </svg>

          <div
            onClick={() => handleSelect(options[1])}
            className="space-y-2 text-xs font-mono p-4 bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <div>Tuesday Visitors = <strong className="text-emerald-700 text-sm">12</strong></div>
            <div>Total Weekly Sum = <strong className="text-slate-900 text-sm">122</strong></div>
            <div className="pt-2 border-t border-slate-200 font-bold text-emerald-800 text-sm">
              Fraction = 12 / 122 = <span className="text-base font-black text-emerald-700">6 / 61</span> (Option B) ★
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Fraction in Simplest Form:
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

"use client";

import React, { useState } from "react";
import { PieChart, Sparkles, CheckCircle2 } from "lucide-react";

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
  // Tuesday visitors = 20
  // Weekly total visitors = 25 + 20 + 35 + 15 + 30 + 40 + 45 = 210
  // Simplified Fraction = 20 / 210 = 2 / 21
  const [selectedFraction, setSelectedFraction] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "2/21", label: "2/21 (20 Tuesday visitors / 210 Total weekly visitors)", isCorrect: true },
    { id: "B", val: "1/10", label: "1/10", isCorrect: false },
    { id: "C", val: "3/21", label: "3/21", isCorrect: false },
    { id: "D", val: "2/15", label: "2/15", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedFraction(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 border border-purple-400/40 rounded-lg text-purple-400">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-purple-300 flex items-center gap-2">
              Library Data Pie Workshop <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Calculate the fractional share of Tuesday's visitor traffic relative to the full weekly total (210).
            </p>
          </div>
        </div>
      </div>

      {/* Pie Sector Visualizer */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-center">
        <div className="flex items-center gap-8 flex-wrap justify-center">
          <svg viewBox="0 0 160 160" className="w-36 h-36 select-none">
            {/* Full Weekly Circle: 210 */}
            <circle cx="80" cy="80" r="70" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            {/* Tuesday Sector: 20/210 = ~34 degrees */}
            <path
              d="M 80 80 L 80 10 A 70 70 0 0 1 122 25 Z"
              fill="#a855f7"
              stroke="#c084fc"
              strokeWidth="2"
            />
            <text x="95" y="45" fill="#f3e8ff" fontSize="11" fontWeight="bold">
              Tue: 20
            </text>
          </svg>

          <div className="space-y-2 text-xs font-mono">
            <div>Tuesday Visitors = <strong className="text-purple-300 text-sm">20</strong></div>
            <div>Total Weekly Sum = <strong className="text-white text-sm">210</strong></div>
            <div className="pt-2 border-t border-slate-800 font-bold text-purple-400 text-sm">
              Fraction = 20 / 210 = 2 / 21
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedFraction === opt.val || selectedFraction === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-purple-600/30 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Search, Eye, CheckCircle2, Sparkles } from "lucide-react";

interface PrecisionScannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PrecisionScannerActivity({
  value,
  onChange,
  readOnly = false,
}: PrecisionScannerActivityProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    {
      id: "A",
      label: "Option A",
      desc: "Dot satisfies circle ∩ triangle exclusively",
      isCorrect: true,
    },
    {
      id: "B",
      label: "Option B",
      desc: "Dot falls outside triangle",
      isCorrect: false,
    },
    {
      id: "C",
      label: "Option C",
      desc: "Dot enters square overlap",
      isCorrect: false,
    },
    {
      id: "D",
      label: "Option D",
      desc: "Dot is isolated in circle",
      isCorrect: false,
    },
  ];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedOption(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
              Precision Geometry Condition Scanner <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Condition: Dot is in Circle ∩ Triangle exclusively (Outside Square).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Condition Reticle Viewer */}
      <div className="relative h-64 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 380 200" className="w-full h-full max-w-sm select-none">
          {/* Target Reference Condition (Left Side) */}
          <g>
            <rect x="20" y="30" width="80" height="80" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="80" cy="110" r="45" fill="none" stroke="#f472b6" strokeWidth="2" />
            <polygon points="90,40 140,130 40,130" fill="none" stroke="#fbbf24" strokeWidth="2" />
            {/* The Dot */}
            <circle cx="95" cy="118" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="20" y="20" fill="#94a3b8" fontSize="10" fontWeight="bold">PROBLEM CONDITION</text>
          </g>

          {/* Scanner Divider */}
          <line x1="170" y1="20" x2="170" y2="180" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

          {/* Solution Inspector Reticle (Right Side) */}
          <g transform="translate(190, 0)">
            <rect x="20" y="30" width="80" height="80" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="80" cy="110" r="45" fill="none" stroke="#f472b6" strokeWidth="2" />
            <polygon points="90,40 140,130 40,130" fill="none" stroke="#fbbf24" strokeWidth="2" />
            {/* Active Dot placement */}
            <circle cx="95" cy="118" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="animate-ping" />
            <circle cx="95" cy="118" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text x="20" y="20" fill="#34d399" fontSize="10" fontWeight="bold">MATCHING REGION (OPT A)</text>
          </g>
        </svg>

        {/* Laser Scope Crosshairs */}
        <div className="absolute top-3 right-3 bg-white border border-slate-200 border border-slate-200/80 px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
          <Eye className="w-3 h-3" />
          <span>CONDITION: LOCKED</span>
        </div>
      </div>

      {/* Option Selection Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select which figure satisfies the exact same dot placement conditions:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-600/30 border-emerald-400 text-emerald-800 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                    : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black">{opt.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-slate-600 mt-2">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

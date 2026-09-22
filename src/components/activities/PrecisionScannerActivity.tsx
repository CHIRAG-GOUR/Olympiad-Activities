"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, CheckCircle2 } from "lucide-react";

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
  const options = [
    {
      id: "A",
      label: "Figure A",
      desc: "Satisfies both regional dot placement overlaps",
      isCorrect: false,
    },
    {
      id: "B",
      label: "Figure B",
      desc: "Satisfies both regional dot placement overlaps",
      isCorrect: false,
    },
    {
      id: "C",
      label: "Figure C (Invalid Overlap)",
      desc: "Cannot form Triangle ∩ Rectangle without intersecting Circle",
      isCorrect: true,
    },
    {
      id: "D",
      label: "Figure D",
      desc: "Satisfies both regional dot placement overlaps",
      isCorrect: false,
    },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value)?.id || "C") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedId(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Dot Placement Condition Scanner
            </h3>
            <p className="text-xs text-slate-600">
              Conditions: Dot 1 in (Circle ∩ Triangle) & Dot 2 in (Triangle ∩ Rectangle). Click the figure that does NOT satisfy these.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Condition Reticle Viewer */}
      <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 380 200" className="w-full h-full max-w-sm select-none">
          {/* Target Reference Condition (Left Side) */}
          <g>
            <rect x="20" y="30" width="80" height="80" fill="none" stroke="#0284c7" strokeWidth="2" />
            <circle cx="80" cy="110" r="45" fill="none" stroke="#e11d48" strokeWidth="2" />
            <polygon points="90,40 140,130 40,130" fill="none" stroke="#d97706" strokeWidth="2" />
            {/* Dot 1 */}
            <circle cx="95" cy="118" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
            {/* Dot 2 */}
            <circle cx="65" cy="70" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
            <text x="20" y="20" fill="#64748b" fontSize="10" fontWeight="bold">PROBLEM FIGURE</text>
          </g>

          {/* Scanner Divider */}
          <line x1="180" y1="20" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

          {/* Solution Inspector Reticle (Right Side - Clickable to choose Option C) */}
          <g
            className="cursor-pointer"
            transform="translate(195, 0)"
            onClick={() => handleSelect("C")}
          >
            <rect
              x="10" y="25" width="165" height="155" rx="10"
              fill={selectedId === "C" ? "#d1fae5" : "#ffffff"}
              stroke={selectedId === "C" ? "#059669" : "#cbd5e1"}
              strokeWidth={selectedId === "C" ? 3 : 1.5}
            />
            <rect x="25" y="40" width="70" height="70" fill="none" stroke="#0284c7" strokeWidth="2" />
            <circle cx="95" cy="110" r="40" fill="none" stroke="#e11d48" strokeWidth="2" />
            <polygon points="100,50 145,130 55,130" fill="none" stroke="#d97706" strokeWidth="2" />
            <text x="90" y="170" textAnchor="middle" fill={selectedId === "C" ? "#065f46" : "#b91c1c"} fontSize="11" fontWeight="bold">
              FIG C: FAILS CONDITION (C) ★
            </text>
          </g>
        </svg>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-700 flex items-center gap-1.5 shadow-xs">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          <span>INSPECTOR: ACTIVE</span>
        </div>
      </div>

      {/* Option Selection Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select the figure which does NOT satisfy the conditions:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
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
                    <span className="text-base font-black">{opt.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

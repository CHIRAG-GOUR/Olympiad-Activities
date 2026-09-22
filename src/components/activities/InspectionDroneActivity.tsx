"use client";

import React, { useState } from "react";
import { Crosshair, Sparkles, CheckCircle2 } from "lucide-react";

interface InspectionDroneActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function InspectionDroneActivity({
  value,
  onChange,
  readOnly = false,
}: InspectionDroneActivityProps) {
  // Question on perpendicular pairs and right angles in the geometric engineering frame:
  // Answer: 8 pairs of perpendicular lines and 16 right angles.
  const [selectedCounts, setSelectedCounts] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "8, 16", label: "8 Perpendicular Pairs, 16 Right Angles (90°)", isCorrect: true },
    { id: "B", val: "6, 12", label: "6 Pairs, 12 Right Angles", isCorrect: false },
    { id: "C", val: "8, 12", label: "8 Pairs, 12 Right Angles", isCorrect: false },
    { id: "D", val: "10, 20", label: "10 Pairs, 20 Right Angles", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedCounts(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 border border-purple-400/40 rounded-lg text-purple-400">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-purple-700 flex items-center gap-2">
              Geometry Inspection Drone (Achievers) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Drone Scanner: Identify total <strong className="text-purple-700">perpendicular line pairs (⊥)</strong> and <strong className="text-purple-700">right angles (90°)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Drone Crosshair Geometry Canvas */}
      <div className="p-6 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 340 180" className="w-full h-full max-w-sm select-none">
          {/* Engineering Frame Box */}
          <rect x="40" y="20" width="260" height="140" fill="#0f172a" stroke="#818cf8" strokeWidth="2.5" rx="4" />

          {/* Internal Perpendicular Cross Struts */}
          <line x1="170" y1="20" x2="170" y2="160" stroke="#c084fc" strokeWidth="2" />
          <line x1="40" y1="90" x2="300" y2="90" stroke="#c084fc" strokeWidth="2" />

          {/* 90° Angle Square Markers */}
          <rect x="40" y="20" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="288" y="20" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="40" y="148" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="288" y="148" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Center 4 Right Angles */}
          <rect x="158" y="78" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="170" y="78" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="158" y="90" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="170" y="90" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

          <text x="170" y="175" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">
            DRONE TELEMETRY: 8 PAIRS (⊥), 16 ANGLES (90°)
          </text>
        </svg>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedCounts === opt.val || selectedCounts === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-purple-600/30 border-purple-400 text-purple-800 shadow-lg shadow-purple-500/20 scale-[1.02]"
                  : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black font-mono">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Compass, Sparkles, CheckCircle2 } from "lucide-react";

interface GeometrySurveyorActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function GeometrySurveyorActivity({
  value,
  onChange,
  readOnly = false,
}: GeometrySurveyorActivityProps) {
  // Count line segments in the given figure:
  // Points: A, B, C, D on main horizontal line + intersecting verticals and diagonals
  // Total line segments = 15 distinct line segments.
  const [selectedCount, setSelectedCount] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "15", label: "15 Segments (6 on horizontal + 4 verticals + 5 diagonals)", isCorrect: true },
    { id: "B", val: "12", label: "12 Segments", isCorrect: false },
    { id: "C", val: "16", label: "16 Segments", isCorrect: false },
    { id: "D", val: "18", label: "18 Segments", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedCount(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Geometry Surveyor <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Survey and count all distinct straight line segments bounded by vertices.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Surveyor Canvas */}
      <div className="relative h-64 bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 380 200" className="w-full h-full max-w-sm select-none">
          {/* Main Horizontal Baseline */}
          <line x1="40" y1="140" x2="340" y2="140" stroke="#38bdf8" strokeWidth="3" />

          {/* Vertical & Diagonal Survey Struts */}
          <line x1="90" y1="140" x2="90" y2="50" stroke="#34d399" strokeWidth="2.5" />
          <line x1="190" y1="140" x2="190" y2="50" stroke="#34d399" strokeWidth="2.5" />
          <line x1="290" y1="140" x2="290" y2="50" stroke="#34d399" strokeWidth="2.5" />

          <line x1="90" y1="50" x2="190" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="190" y1="50" x2="290" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="90" y1="50" x2="290" y2="50" stroke="#ec4899" strokeWidth="2" />

          {/* Vertex Survey Markers */}
          <circle cx="40" cy="140" r="5" fill="#38bdf8" />
          <circle cx="90" cy="140" r="5" fill="#34d399" />
          <circle cx="190" cy="140" r="5" fill="#34d399" />
          <circle cx="290" cy="140" r="5" fill="#34d399" />
          <circle cx="340" cy="140" r="5" fill="#38bdf8" />

          <circle cx="90" cy="50" r="5" fill="#f472b6" />
          <circle cx="190" cy="50" r="5" fill="#f472b6" />
          <circle cx="290" cy="50" r="5" fill="#f472b6" />

          {/* Vertex Labels */}
          <text x="35" y="160" fill="#94a3b8" fontSize="11" fontWeight="bold">A</text>
          <text x="85" y="160" fill="#94a3b8" fontSize="11" fontWeight="bold">B</text>
          <text x="185" y="160" fill="#94a3b8" fontSize="11" fontWeight="bold">C</text>
          <text x="285" y="160" fill="#94a3b8" fontSize="11" fontWeight="bold">D</text>
          <text x="335" y="160" fill="#94a3b8" fontSize="11" fontWeight="bold">E</text>
        </svg>

        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400">
          SURVEY: 15 DISTINCT LINE SEGMENTS
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedCount === opt.val || selectedCount === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

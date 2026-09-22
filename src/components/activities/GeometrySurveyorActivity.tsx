"use client";

import React, { useState } from "react";
import { Compass,  CheckCircle2 } from "lucide-react";

interface GeometrySurveyorActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function GeometrySurveyorActivity({
  value,
  onChange,
  readOnly = false }: GeometrySurveyorActivityProps) {
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

  const [highlightedGroup, setHighlightedGroup] = useState<string>("all");

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Geometry Surveyor
            </h3>
            <p className="text-xs text-slate-600">
              Survey and count all distinct straight line segments bounded by vertices.
            </p>
          </div>
        </div>

        {/* On-stage surveyor segment presets */}
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCount === opt.val || selectedCount === opt.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {opt.val} ({opt.id})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Surveyor Canvas */}
      <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 380 200" className="w-full h-full max-w-sm select-none">
          {/* Main Horizontal Baseline */}
          <line
            x1="40" y1="140" x2="340" y2="140"
            stroke="#0284c7" strokeWidth="3.5"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("15")}
          />

          {/* Vertical & Diagonal Survey Struts */}
          <line
            x1="90" y1="140" x2="90" y2="50"
            stroke="#059669" strokeWidth="3"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("15")}
          />
          <line
            x1="190" y1="140" x2="190" y2="50"
            stroke="#059669" strokeWidth="3"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("15")}
          />
          <line
            x1="290" y1="140" x2="290" y2="50"
            stroke="#059669" strokeWidth="3"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("15")}
          />

          <line
            x1="90" y1="50" x2="190" y2="140"
            stroke="#d97706" strokeWidth="2.5" strokeDasharray="4 4"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("15")}
          />
          <line
            x1="190" y1="50" x2="290" y2="140"
            stroke="#d97706" strokeWidth="2.5" strokeDasharray="4 4"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("15")}
          />
          <line
            x1="90" y1="50" x2="290" y2="50"
            stroke="#db2777" strokeWidth="2.5"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("15")}
          />

          {/* Vertex Survey Markers */}
          <circle cx="40" cy="140" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          <circle cx="90" cy="140" r="6" fill="#059669" stroke="#ffffff" strokeWidth="2" />
          <circle cx="190" cy="140" r="6" fill="#059669" stroke="#ffffff" strokeWidth="2" />
          <circle cx="290" cy="140" r="6" fill="#059669" stroke="#ffffff" strokeWidth="2" />
          <circle cx="340" cy="140" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />

          <circle cx="90" cy="50" r="6" fill="#db2777" stroke="#ffffff" strokeWidth="2" />
          <circle cx="190" cy="50" r="6" fill="#db2777" stroke="#ffffff" strokeWidth="2" />
          <circle cx="290" cy="50" r="6" fill="#db2777" stroke="#ffffff" strokeWidth="2" />

          {/* Vertex Labels */}
          <text x="35" y="162" fill="#334155" fontSize="12" fontWeight="bold">A</text>
          <text x="85" y="162" fill="#334155" fontSize="12" fontWeight="bold">B</text>
          <text x="185" y="162" fill="#334155" fontSize="12" fontWeight="bold">C</text>
          <text x="285" y="162" fill="#334155" fontSize="12" fontWeight="bold">D</text>
          <text x="335" y="162" fill="#334155" fontSize="12" fontWeight="bold">E</text>
        </svg>

        <div
          onClick={() => handleSelect("15")}
          className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-700 shadow-xs cursor-pointer hover:bg-emerald-50"
        >
          SURVEY TALLY: 15 DISTINCT LINE SEGMENTS (Click to select)
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
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
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
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

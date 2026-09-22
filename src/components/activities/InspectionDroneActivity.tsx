"use client";

import React, { useState } from "react";
import { Crosshair,  CheckCircle2 } from "lucide-react";

interface InspectionDroneActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function InspectionDroneActivity({
  value,
  onChange,
  readOnly = false }: InspectionDroneActivityProps) {
  const options = [
    {
      id: "A",
      val: "8, 16",
      pairs: 8,
      angles: 16,
      label: "8 Pairs (⊥), 16 Right Angles (90°)",
      desc: "4 outer corners + 4 central intersections = 8 pairs & 16 right angles",
      isCorrect: true },
    {
      id: "B",
      val: "6, 12",
      pairs: 6,
      angles: 12,
      label: "6 Pairs, 12 Right Angles",
      desc: "Incomplete count",
      isCorrect: false },
    {
      id: "C",
      val: "8, 12",
      pairs: 8,
      angles: 12,
      label: "8 Pairs, 12 Right Angles",
      desc: "Angle count mismatch",
      isCorrect: false },
    {
      id: "D",
      val: "10, 20",
      pairs: 10,
      angles: 20,
      label: "10 Pairs, 20 Right Angles",
      desc: "Overcounted elements",
      isCorrect: false },
  ];

  const initialOpt = options.find((o) => o.id === value || o.val === value) || options[0];
  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);

  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-700">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Geometry Inspection Drone (Achievers) 
            </h3>
            <p className="text-xs text-slate-600">
              Drone Scanner: Inspect <strong className="text-purple-700">perpendicular line pairs (⊥)</strong> and <strong className="text-purple-700">right angles (90°)</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-purple-50 text-purple-900 px-3 py-1.5 rounded-lg border border-purple-200">
          Selected Telemetry: {activeOpt.pairs} Pairs | {activeOpt.angles} Angles
        </div>
      </div>

      {/* Drone Crosshair Geometry Canvas */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center">
        <svg viewBox="0 0 340 180" className="w-full h-full max-w-sm select-none">
          {/* Engineering Frame Box */}
          <rect x="40" y="20" width="260" height="140" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" rx="6" />

          {/* Internal Perpendicular Cross Struts */}
          <line x1="170" y1="20" x2="170" y2="160" stroke="#7c3aed" strokeWidth="2.5" />
          <line x1="40" y1="90" x2="300" y2="90" stroke="#7c3aed" strokeWidth="2.5" />

          {/* Corner 90° Markers */}
          <rect x="40" y="20" width="14" height="14" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          <rect x="286" y="20" width="14" height="14" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          <rect x="40" y="146" width="14" height="14" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          <rect x="286" y="146" width="14" height="14" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />

          {/* Central 4 Right Angles */}
          <rect x="156" y="76" width="14" height="14" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="170" y="76" width="14" height="14" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="156" y="90" width="14" height="14" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="170" y="90" width="14" height="14" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />

          <text x="170" y="175" textAnchor="middle" fill="#6d28d9" fontSize="11" fontWeight="bold" fontFamily="monospace">
            DRONE TELEMETRY: {activeOpt.pairs} PAIRS (⊥), {activeOpt.angles} ANGLES (90°)
          </text>
        </svg>
      </div>

      {/* Answer Options Grid (Directly connected to drone telemetry) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Verified Count Pair:
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
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-purple-50 border-purple-600 text-purple-950 shadow-md shadow-purple-600/10 scale-[1.01]"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div>
                    <div className="text-sm font-black font-mono">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 font-sans font-normal mt-0.5">{opt.desc}</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

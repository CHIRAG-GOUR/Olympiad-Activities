"use client";

import React, { useState, useEffect } from "react";
import { Grid, CheckCircle2 } from "lucide-react";

interface MosaicRestorationActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function MosaicRestorationActivity({
  value,
  onChange,
  readOnly = false,
}: MosaicRestorationActivityProps) {
  const options = [
    { id: "A", label: "Option A", desc: "Straight cross pattern only", isCorrect: false },
    { id: "B", label: "Option B", desc: "Inverted arc orientation", isCorrect: false },
    { id: "C", label: "Option C (Matching Piece)", desc: "Curved radial concentric arc with corner diagonal ray", isCorrect: true },
    { id: "D", label: "Option D", desc: "Offset disconnected lines", isCorrect: false },
  ];

  const [selectedPiece, setSelectedPiece] = useState<string>(
    value ? (options.find((o) => o.id === value)?.id || "C") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value);
      if (match) setSelectedPiece(match.id);
    }
  }, [value]);

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedPiece(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Geometric Mosaic Mandala Restoration
            </h3>
            <p className="text-xs text-slate-600">
              Click the damaged bottom-left quadrant (?) on the canvas to snap-fit Option C and complete the mandala.
            </p>
          </div>
        </div>

        {/* Quick Piece Presets */}
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPiece === opt.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Mosaic Mandala Canvas */}
      <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 240 240" className="w-full h-full max-w-[220px] select-none">
          {/* Outer Boundary Frame */}
          <rect x="20" y="20" width="200" height="200" fill="#ffffff" stroke="#0284c7" strokeWidth="3" rx="8" />

          {/* Central Connecting Lines */}
          <line x1="120" y1="20" x2="120" y2="220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="20" y1="120" x2="220" y2="120" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

          {/* Top-Left Quadrant (Intact) */}
          <path d="M 20 120 A 100 100 0 0 1 120 20" fill="none" stroke="#d97706" strokeWidth="3" />
          <line x1="20" y1="20" x2="120" y2="120" stroke="#e11d48" strokeWidth="2" />

          {/* Top-Right Quadrant (Intact) */}
          <path d="M 120 20 A 100 100 0 0 1 220 120" fill="none" stroke="#d97706" strokeWidth="3" />
          <line x1="220" y1="20" x2="120" y2="120" stroke="#e11d48" strokeWidth="2" />

          {/* Bottom-Right Quadrant (Intact) */}
          <path d="M 220 120 A 100 100 0 0 1 120 220" fill="none" stroke="#d97706" strokeWidth="3" />
          <line x1="220" y1="220" x2="120" y2="120" stroke="#e11d48" strokeWidth="2" />

          {/* Bottom-Left Quadrant (Target Damaged Void - Clickable) */}
          <g
            className="cursor-pointer hover:opacity-90"
            onClick={() => handleSelect("C")}
          >
            <rect
              x="22"
              y="122"
              width="96"
              height="96"
              fill={selectedPiece === "C" ? "#ecfdf5" : "#fef2f2"}
              stroke={selectedPiece === "C" ? "#059669" : "#e11d48"}
              strokeWidth="2.5"
              strokeDasharray={selectedPiece === "C" ? "none" : "4 4"}
            />

            {/* Restored Piece Projection if Selected */}
            {selectedPiece === "C" ? (
              <g>
                <path d="M 120 220 A 100 100 0 0 1 20 120" fill="none" stroke="#059669" strokeWidth="3.5" />
                <line x1="20" y1="220" x2="120" y2="120" stroke="#059669" strokeWidth="2.5" />
              </g>
            ) : (
              <text x="70" y="175" textAnchor="middle" fill="#e11d48" fontSize="24" fontWeight="black">
                ?
              </text>
            )}
          </g>
        </svg>

        {/* Live Alignment Telemetry */}
        <div
          onClick={() => handleSelect("C")}
          className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-700 shadow-xs cursor-pointer hover:bg-emerald-50"
        >
          {selectedPiece === "C" ? "SNAP-FIT: LOCKED (OPTION C) ★" : "TARGET: RESTORE VOID (Click ?)"}
        </div>
      </div>

      {/* Tile Candidate Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select which tile piece correctly completes the geometric mandala:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedPiece === opt.id;
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

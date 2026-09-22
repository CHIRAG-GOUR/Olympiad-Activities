"use client";

import React, { useState } from "react";
import { Grid, Sparkles, CheckCircle2 } from "lucide-react";

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
  const [selectedPiece, setSelectedPiece] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", label: "Piece A", desc: "Quadrant with matching concentric arc & diagonal ray", isCorrect: true },
    { id: "B", label: "Piece B", desc: "Inverted arc alignment", isCorrect: false },
    { id: "C", label: "Piece C", desc: "Opposite corner orientation", isCorrect: false },
    { id: "D", label: "Piece D", desc: "Missing central line", isCorrect: false },
  ];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedPiece(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
              Geometric Mosaic Restoration <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Complete the damaged bottom-left quadrant of the decorative geometric mandala.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Mosaic Mandala Canvas */}
      <div className="relative h-64 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 240 240" className="w-full h-full max-w-[220px] select-none">
          {/* Outer Boundary Frame */}
          <rect x="20" y="20" width="200" height="200" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" rx="8" />

          {/* Central Connecting Lines */}
          <line x1="120" y1="20" x2="120" y2="220" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="20" y1="120" x2="220" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />

          {/* Top-Left Quadrant (Intact) */}
          <path d="M 20 120 A 100 100 0 0 1 120 20" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <line x1="20" y1="20" x2="120" y2="120" stroke="#f43f5e" strokeWidth="2" />

          {/* Top-Right Quadrant (Intact) */}
          <path d="M 120 20 A 100 100 0 0 1 220 120" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <line x1="220" y1="20" x2="120" y2="120" stroke="#f43f5e" strokeWidth="2" />

          {/* Bottom-Right Quadrant (Intact) */}
          <path d="M 220 120 A 100 100 0 0 1 120 220" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <line x1="220" y1="220" x2="120" y2="120" stroke="#f43f5e" strokeWidth="2" />

          {/* Bottom-Left Quadrant (Target Damaged Void) */}
          <rect
            x="22"
            y="122"
            width="96"
            height="96"
            fill={selectedPiece ? "#064e3b" : "#1e1e2e"}
            fillOpacity={selectedPiece ? 0.6 : 0.8}
            stroke={selectedPiece ? "#34d399" : "#e11d48"}
            strokeWidth="2"
            strokeDasharray={selectedPiece ? "none" : "4 4"}
          />

          {/* Restored Piece Projection if Selected */}
          {selectedPiece ? (
            <g>
              <path d="M 120 220 A 100 100 0 0 1 20 120" fill="none" stroke="#34d399" strokeWidth="3.5" />
              <line x1="20" y1="220" x2="120" y2="120" stroke="#34d399" strokeWidth="2.5" />
            </g>
          ) : (
            <text x="70" y="175" textAnchor="middle" fill="#f43f5e" fontSize="24" fontWeight="black">
              ?
            </text>
          )}
        </svg>

        {/* Live Alignment Telemetry */}
        <div className="absolute bottom-3 left-3 bg-white border border-slate-200 border border-slate-200/80 px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400">
          {selectedPiece ? "SNAP-FIT: LOCKED (OPTION A)" : "TARGET: RESTORE VOID"}
        </div>
      </div>

      {/* Tile Candidate Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
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

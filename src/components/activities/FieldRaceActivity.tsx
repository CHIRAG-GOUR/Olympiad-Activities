"use client";

import React, { useState } from "react";
import { Flag, Sparkles, CheckCircle2, Play } from "lucide-react";

interface FieldRaceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FieldRaceActivity({
  value,
  onChange,
  readOnly = false,
}: FieldRaceActivityProps) {
  // Rashi runs around a rectangular park: 52 m long, 30 m wide.
  // Perimeter of Rashi's park = 2 * (52 + 30) = 2 * 82 = 164 m.
  // Rashi completes 5 rounds = 5 * 164 m = 820 m.
  // Kirti runs around a square park of side 65 m.
  // Perimeter of Kirti's park = 4 * 65 m = 260 m.
  // Kirti completes 7 rounds = 7 * 260 m = 1820 m.
  // Who covered more distance and by how much?
  // Kirti covered more by: 1820 m - 820 m = 1000 m!
  const [selectedWinner, setSelectedWinner] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "Kirti, 1000 m", label: "Kirti by 1000 m (1820m - 820m = 1000m)", isCorrect: true },
    { id: "B", val: "Rashi, 1000 m", label: "Rashi by 1000 m", isCorrect: false },
    { id: "C", val: "Kirti, 800 m", label: "Kirti by 800 m", isCorrect: false },
    { id: "D", val: "Rashi, 600 m", label: "Rashi by 600 m", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedWinner(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Olympiad Field Race Telemetry <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Rashi (5 rounds of 52m×30m) vs Kirti (7 rounds of 65m square).
            </p>
          </div>
        </div>
      </div>

      {/* Dual Track Telemetry Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rashi's Telemetry */}
        <div className="p-4 bg-slate-950/90 border border-sky-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-400">RASHI (5 LAPS)</span>
            <span className="text-[10px] text-slate-400 font-mono">Rect: 52m × 30m</span>
          </div>
          <div className="text-xs text-slate-300 font-mono">
            Lap = 2 × (52 + 30) = 164 m
          </div>
          <div className="pt-2 border-t border-slate-800 text-xl font-black text-sky-300">
            Total = 5 × 164 = 820 m
          </div>
        </div>

        {/* Kirti's Telemetry */}
        <div className="p-4 bg-slate-950/90 border border-emerald-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">KIRTI (7 LAPS)</span>
            <span className="text-[10px] text-slate-400 font-mono">Square: 65m side</span>
          </div>
          <div className="text-xs text-slate-300 font-mono">
            Lap = 4 × 65 = 260 m
          </div>
          <div className="pt-2 border-t border-slate-800 text-xl font-black text-emerald-300">
            Total = 7 × 260 = 1,820 m
          </div>
        </div>
      </div>

      {/* Comparison Delta Banner */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center font-mono text-xs text-slate-300">
        Distance Differential = 1,820 m - 820 m = <strong className="text-emerald-400 text-sm">1,000 m (Kirti covers more)</strong>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedWinner === opt.val || selectedWinner === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                isSelected
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-[1.01]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-emerald-400 mr-2">
                  Option {opt.id}
                </span>
                <span className="font-mono text-base font-black">{opt.val}</span>
                <p className="text-[11px] text-slate-400 mt-1 font-normal">{opt.label}</p>
              </div>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

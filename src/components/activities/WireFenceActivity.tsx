"use client";

import React, { useState } from "react";
import { Square, Sparkles, CheckCircle2 } from "lucide-react";

interface WireFenceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function WireFenceActivity({
  value,
  onChange,
  readOnly = false,
}: WireFenceActivityProps) {
  // A wire of length 180 m is bent into a rectangle:
  // Perimeter = 2 * (Length + Breadth) = 180 m -> Length + Breadth = 90 m.
  // Condition: Breadth = Length / 2 -> Length + (Length / 2) = 90 -> 1.5 * Length = 90 -> Length = 60 m, Breadth = 30 m.
  // Area = Length * Breadth = 60 m * 30 m = 1800 m²!
  const [selectedArea, setSelectedArea] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "1800", label: "1800 m² (Length = 60m, Breadth = 30m)", isCorrect: true },
    { id: "B", val: "1600", label: "1600 m²", isCorrect: false },
    { id: "C", val: "2000", label: "2000 m²", isCorrect: false },
    { id: "D", val: "1200", label: "1200 m²", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedArea(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Square className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Wire-to-Fence Workshop <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              A 180m wire forms a rectangle where <strong className="text-emerald-400">Breadth = Length / 2</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Bent Wire Geometry Frame */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-72 h-36 border-4 border-emerald-400 bg-emerald-950/30 rounded-lg relative flex flex-col items-center justify-center shadow-[0_0_15px_#10b98130]">
            <span className="text-xs font-mono font-bold text-emerald-300">
              Length = 60 m
            </span>
            <span className="font-black text-2xl text-white my-1">
              Area = 1,800 m²
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              Breadth = 30 m (Half of Length)
            </span>

            {/* Corner dimension markers */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400">
              Perimeter = 2 × (60 + 30) = 180 m
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Find the area enclosed by the rectangular wire fence:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedArea === opt.val || selectedArea === opt.id;
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
                  <span className="text-2xl font-black">{opt.val} m²</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">Option {opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

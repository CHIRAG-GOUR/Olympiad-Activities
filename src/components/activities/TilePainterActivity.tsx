"use client";

import React, { useState } from "react";
import { Paintbrush, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";

interface TilePainterActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function TilePainterActivity({
  value,
  onChange,
  readOnly = false,
}: TilePainterActivityProps) {
  // Total 14 diamond tiles. To make 3/7 unshaded:
  // (3 / 7) * 14 = 6 unshaded diamonds -> exactly 8 shaded diamonds!
  const totalTiles = 14;
  const [shadedIndices, setShadedIndices] = useState<Set<number>>(
    new Set([0, 1, 2, 3, 4, 5, 6, 7]) // default 8 shaded
  );

  const toggleTile = (idx: number) => {
    if (readOnly) return;
    const next = new Set(shadedIndices);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setShadedIndices(next);
    onChange(next.size);
  };

  const shadedCount = shadedIndices.size;
  const unshadedCount = totalTiles - shadedCount;
  // 6 / 14 = 3 / 7
  const isTargetAchieved = unshadedCount === 6 && shadedCount === 8;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Paintbrush className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Diamond Tile Painter <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Click tiles to shade/unshade. Target: Exactly <strong className="text-emerald-400">3/7 of the figure unshaded</strong> (6 unshaded / 14 total).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShadedIndices(new Set([0, 1, 2, 3, 4, 5, 6, 7]))}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-semibold text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset (8 Shaded)
        </button>
      </div>

      {/* Interactive 14-Diamond Grid */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
        <div className="grid grid-cols-7 gap-3 sm:gap-4 select-none">
          {Array.from({ length: totalTiles }, (_, i) => {
            const isShaded = shadedIndices.has(i);
            return (
              <button
                key={i}
                type="button"
                disabled={readOnly}
                onClick={() => toggleTile(i)}
                className={`w-10 h-10 sm:w-12 sm:h-12 transform rotate-45 rounded-md border-2 transition-all flex items-center justify-center ${
                  isShaded
                    ? "bg-emerald-500 border-emerald-300 shadow-md shadow-emerald-500/30"
                    : "bg-slate-900 border-slate-700 hover:border-slate-500"
                }`}
                title={`Tile #${i + 1}: ${isShaded ? "Shaded" : "Unshaded"}`}
              >
                <span className="transform -rotate-45 text-[10px] font-mono font-bold text-slate-950">
                  {isShaded ? "■" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Fraction Telemetry Bar */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-800 text-xs font-mono">
          <div>
            Shaded: <strong className="text-emerald-400 text-sm">{shadedCount}</strong> / 14
          </div>
          <div>
            Unshaded: <strong className="text-amber-400 text-sm">{unshadedCount}</strong> / 14
          </div>
          <div className="font-bold">
            Unshaded Fraction:{" "}
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                isTargetAchieved
                  ? "bg-emerald-950 border border-emerald-400 text-emerald-300"
                  : "bg-slate-900 text-slate-400"
              }`}
            >
              {unshadedCount}/14 {isTargetAchieved ? "= 3/7 (TARGET REACHED)" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Answer Verification Card */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-xs text-slate-300">
            Option representing 8 shaded & 6 unshaded diamonds corresponds to{" "}
            <strong className="text-emerald-300">Option B</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange("B")}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-bold transition"
        >
          Select Option B
        </button>
      </div>
    </div>
  );
}

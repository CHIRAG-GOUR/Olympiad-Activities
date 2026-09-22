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
  // Total 28 diamond units. Unshaded must be 3/7 of total:
  // Unshaded = (3/7) * 28 = 12 diamonds unshaded
  // Shaded = 28 - 12 = 16 diamonds shaded!
  const totalTiles = 28;

  const options = [
    { id: "A", count: 12, label: "12 Diamonds", unshaded: 16, isCorrect: false },
    { id: "B", count: 14, label: "14 Diamonds", unshaded: 14, isCorrect: false },
    { id: "C", count: 16, label: "16 Diamonds", unshaded: 12, isCorrect: true, desc: "Leaves exactly 12/28 = 3/7 unshaded" },
    { id: "D", count: 18, label: "18 Diamonds", unshaded: 10, isCorrect: false },
  ];

  const initialOpt = options.find((o) => o.id === value || o.count === Number(value)) || options[2];
  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);

  // Initialize with 16 shaded diamonds
  const [shadedIndices, setShadedIndices] = useState<Set<number>>(
    new Set(Array.from({ length: initialOpt.count }, (_, i) => i))
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
    const newCount = next.size;
    const matched = options.find((o) => o.count === newCount);
    if (matched) {
      setSelectedId(matched.id);
      onChange(matched.id);
    } else {
      onChange(newCount);
    }
  };

  const handleSelectOption = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    // Repaint exact number of diamonds
    const next = new Set<number>(Array.from({ length: opt.count }, (_, i) => i));
    setShadedIndices(next);
    onChange(opt.id);
  };

  const shadedCount = shadedIndices.size;
  const unshadedCount = totalTiles - shadedCount;
  const isTargetAchieved = unshadedCount === 12 && shadedCount === 16;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Paintbrush className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Geometric Tessellation Diamond Painter <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-600">
              Click individual diamonds to shade/unshade, or select an option to batch paint the grid.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSelectOption(options[2])}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Target Preset (16 Shaded)
        </button>
      </div>

      {/* Interactive 28-Diamond Tessellation Canvas */}
      <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center">
        <div className="grid grid-cols-7 gap-2.5 sm:gap-3.5 select-none py-3">
          {Array.from({ length: totalTiles }, (_, i) => {
            const isShaded = shadedIndices.has(i);
            return (
              <button
                key={i}
                type="button"
                disabled={readOnly}
                onClick={() => toggleTile(i)}
                className={`w-9 h-9 sm:w-11 sm:h-11 transform rotate-45 rounded-sm border-2 transition-all flex items-center justify-center cursor-pointer ${
                  isShaded
                    ? "bg-[#28A745] border-[#218838] shadow-sm scale-95"
                    : "bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50"
                }`}
                title={`Diamond #${i + 1}: ${isShaded ? "Shaded" : "Unshaded"}`}
              >
                <span className="transform -rotate-45 text-[10px] font-mono font-bold text-white">
                  {isShaded ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Fraction Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 text-xs font-mono w-full">
          <div>
            Shaded Diamonds: <strong className="text-emerald-700 text-sm">{shadedCount}</strong> / 28
          </div>
          <div>
            Unshaded Diamonds: <strong className="text-amber-700 text-sm">{unshadedCount}</strong> / 28
          </div>
          <div className="font-bold font-sans">
            Unshaded Fraction:{" "}
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                isTargetAchieved
                  ? "bg-emerald-100 border border-emerald-300 text-emerald-900"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {unshadedCount}/28 {isTargetAchieved ? "= 3/7 (TARGET REACHED)" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Answer Options Grid (Connected directly to painter) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Number of Shaded Diamonds Required:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id || shadedCount === opt.count;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="text-base font-black font-mono">{opt.count}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

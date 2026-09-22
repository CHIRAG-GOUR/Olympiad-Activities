"use client";

import React, { useState } from "react";
import { Footprints, Sparkles, CheckCircle2 } from "lucide-react";

interface StepSyncActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function StepSyncActivity({
  value,
  onChange,
  readOnly = false,
}: StepSyncActivityProps) {
  // Three girls step together from the same spot:
  // Step sizes: 50 cm, 75 cm, 90 cm.
  // Minimum common distance to cover in complete steps = LCM(50, 75, 90):
  // 50 = 2 * 5²
  // 75 = 3 * 5²
  // 90 = 2 * 3² * 5
  // LCM = 2 * 3² * 5² = 2 * 9 * 25 = 450 cm = 4.5 meters (or 450 cm)!
  const [selectedDistance, setSelectedDistance] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "450 cm", label: "450 cm (LCM of 50, 75, 90 cm = 450 cm)", isCorrect: true },
    { id: "B", val: "300 cm", label: "300 cm (Not divisible by 90)", isCorrect: false },
    { id: "C", val: "500 cm", label: "500 cm", isCorrect: false },
    { id: "D", val: "900 cm", label: "900 cm (Common multiple, but not minimum)", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedDistance(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
              Step Synchronizer (LCM Alignment) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Three walkers take steps of <strong className="text-white">50 cm</strong>, <strong className="text-white">75 cm</strong>, and <strong className="text-white">90 cm</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Synchronized Stepping Tracks */}
      <div className="p-5 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl space-y-3">
        <div className="space-y-2">
          {/* Girl 1: 50 cm steps (9 steps to 450 cm) */}
          <div className="flex items-center gap-3">
            <span className="w-20 text-[11px] font-mono text-sky-400 font-bold">Girl 1 (50cm)</span>
            <div className="flex-1 h-3 bg-white border border-slate-200 border border-slate-200 rounded-full flex items-center justify-between px-1">
              {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map((s) => (
                <span key={s} className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-600">9 Steps</span>
          </div>

          {/* Girl 2: 75 cm steps (6 steps to 450 cm) */}
          <div className="flex items-center gap-3">
            <span className="w-20 text-[11px] font-mono text-emerald-400 font-bold">Girl 2 (75cm)</span>
            <div className="flex-1 h-3 bg-white border border-slate-200 border border-slate-200 rounded-full flex items-center justify-between px-1">
              {[0, 75, 150, 225, 300, 375, 450].map((s) => (
                <span key={s} className="w-2 h-2 bg-emerald-400 rounded-full" />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-600">6 Steps</span>
          </div>

          {/* Girl 3: 90 cm steps (5 steps to 450 cm) */}
          <div className="flex items-center gap-3">
            <span className="w-20 text-[11px] font-mono text-amber-400 font-bold">Girl 3 (90cm)</span>
            <div className="flex-1 h-3 bg-white border border-slate-200 border border-slate-200 rounded-full flex items-center justify-between px-1">
              {[0, 90, 180, 270, 360, 450].map((s) => (
                <span key={s} className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-600">5 Steps</span>
          </div>
        </div>

        {/* Alignment Flag Banner */}
        <div className="pt-2 border-t border-slate-200 text-center text-xs font-mono text-emerald-400 font-bold">
          🎯 First Common Footprint Alignment at 450 cm (4.5 meters)
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedDistance === opt.val || selectedDistance === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.val)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-800 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

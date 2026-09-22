"use client";

import React, { useState } from "react";
import { Footprints, CheckCircle2, Target, Trophy } from "lucide-react";

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
  // Question 45: Three athletes take step lengths of 50 cm, 75 cm, and 90 cm.
  // Calculate LCM(50, 75, 90):
  // 50 = 2 × 5²
  // 75 = 3 × 5²
  // 90 = 2 × 3² × 5
  // LCM = 2 × 3² × 5² = 2 × 9 × 25 = 450 cm (Option C)

  const options = [
    { id: "A", val: "150 cm", num: 150, label: "150 cm", desc: "Common multiple of 50 & 75, but not 90" },
    { id: "B", val: "800 cm", num: 800, label: "800 cm", desc: "Non-multiple calibration" },
    { id: "C", val: "450 cm", num: 450, label: "450 cm (LCM of 50, 75, 90 cm)", desc: "Lowest common footprint distance", isCorrect: true },
    { id: "D", val: "None of these", num: 0, label: "None of these", desc: "Distractor" },
  ];

  const getInitial = () => {
    if (!value) return "C";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.id : "C";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[2];

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Three-Athlete Step Synchronizer (Q45)
            </h3>
            <p className="text-xs text-slate-600">
              Calculate <strong className="text-emerald-700 font-mono">LCM(50 cm, 75 cm, 90 cm)</strong> to find the minimum distance where all 3 step footprints align perfectly.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300">
          Sync Distance: <span className="text-emerald-700 font-black">{activeOpt.val}</span>
        </div>
      </div>

      {/* Synchronized Stepping Tracks Canvas */}
      <div
        onClick={() => handleSelect("C")}
        className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
      >
        <div className="space-y-2.5">
          {/* Athlete 1: 50 cm steps (9 steps to 450 cm) */}
          <div className="flex items-center gap-3">
            <span className="w-24 text-xs font-mono text-sky-800 font-bold">Athlete 1 (50cm)</span>
            <div className="flex-1 h-4 bg-white border border-slate-200 rounded-full flex items-center justify-between px-2">
              {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map((s) => (
                <span key={s} className="w-2 h-2 bg-sky-500 rounded-full" />
              ))}
            </div>
            <span className="text-xs font-mono text-slate-600 font-bold">9 Steps</span>
          </div>

          {/* Athlete 2: 75 cm steps (6 steps to 450 cm) */}
          <div className="flex items-center gap-3">
            <span className="w-24 text-xs font-mono text-emerald-700 font-bold">Athlete 2 (75cm)</span>
            <div className="flex-1 h-4 bg-white border border-slate-200 rounded-full flex items-center justify-between px-2">
              {[0, 75, 150, 225, 300, 375, 450].map((s) => (
                <span key={s} className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              ))}
            </div>
            <span className="text-xs font-mono text-slate-600 font-bold">6 Steps</span>
          </div>

          {/* Athlete 3: 90 cm steps (5 steps to 450 cm) */}
          <div className="flex items-center gap-3">
            <span className="w-24 text-xs font-mono text-amber-800 font-bold">Athlete 3 (90cm)</span>
            <div className="flex-1 h-4 bg-white border border-slate-200 rounded-full flex items-center justify-between px-2">
              {[0, 90, 180, 270, 360, 450].map((s) => (
                <span key={s} className="w-3 h-3 bg-amber-500 rounded-full" />
              ))}
            </div>
            <span className="text-xs font-mono text-slate-600 font-bold">5 Steps</span>
          </div>
        </div>

        {/* Alignment Milestone Banner */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-center gap-2 text-xs font-mono text-emerald-800 font-bold">
          <Target className="w-4 h-4 text-emerald-600" />
          <span>FIRST COMMON SYNCHRONIZED STRIDE AT EXACTLY 450 cm (4.50 METERS)</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Minimum Synchronized Distance (LCM):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-black font-mono">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <div className="mt-1">
                  <div className="text-[10px] text-slate-500 font-mono">Option {opt.id}</div>
                  <div className="text-[10px] text-slate-400 truncate">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

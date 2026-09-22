"use client";

import React, { useState } from "react";
import { GitCommit, Sparkles, CheckCircle2 } from "lucide-react";

interface TrackInspectorActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function TrackInspectorActivity({
  value,
  onChange,
  readOnly = false,
}: TrackInspectorActivityProps) {
  // Question: In the given track network, how many pairs of intersecting lines and parallel lines are present?
  // Answer: 6 pairs of intersecting lines and 2 pairs of parallel lines.
  const [selectedAnswer, setSelectedAnswer] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "6, 2", label: "6 Intersecting pairs, 2 Parallel pairs", isCorrect: true },
    { id: "B", val: "4, 2", label: "4 Intersecting pairs, 2 Parallel pairs", isCorrect: false },
    { id: "C", val: "6, 3", label: "6 Intersecting pairs, 3 Parallel pairs", isCorrect: false },
    { id: "D", val: "5, 1", label: "5 Intersecting pairs, 1 Parallel pair", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedAnswer(val);
    onChange(val);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              Railway Track Inspector <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Inspect the geometric track grid to tally intersecting line pairs vs parallel pairs.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Track Network Canvas */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 340 180" className="w-full h-full max-w-sm select-none">
          {/* Parallel Horizontal Tracks (Line L1 & Line L2) */}
          <line x1="30" y1="50" x2="310" y2="50" stroke="#38bdf8" strokeWidth="3" />
          <line x1="30" y1="130" x2="310" y2="130" stroke="#38bdf8" strokeWidth="3" />
          <text x="320" y="55" fill="#38bdf8" fontSize="11" fontWeight="bold">L1</text>
          <text x="320" y="135" fill="#38bdf8" fontSize="11" fontWeight="bold">L2 (Parallel)</text>

          {/* Transversal & Intersecting Tracks */}
          <line x1="80" y1="20" x2="160" y2="160" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="260" y1="20" x2="180" y2="160" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Intersections Glowing Nodes */}
          <circle cx="97" cy="50" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="143" cy="130" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="243" cy="50" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="197" cy="130" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="170" cy="90" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.val || selectedAnswer === opt.id;
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
                <span className="text-xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

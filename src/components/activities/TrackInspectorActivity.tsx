"use client";

import React, { useState } from "react";
import { GitCommit,  CheckCircle2 } from "lucide-react";

interface TrackInspectorActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function TrackInspectorActivity({
  value,
  onChange,
  readOnly = false }: TrackInspectorActivityProps) {
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
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-700">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
              Railway Track Inspector 
            </h3>
            <p className="text-xs text-slate-600">
              Inspect the geometric track grid to tally intersecting line pairs vs parallel pairs.
            </p>
          </div>
        </div>
        {/* Quick Tally Preset Buttons */}
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedAnswer === opt.val || selectedAnswer === opt.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Option {opt.id}: ({opt.val})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Track Network Canvas */}
      <div className="relative h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 340 180" className="w-full h-full max-w-sm select-none">
          {/* Parallel Horizontal Tracks (Line L1 & Line L2) */}
          <line
            x1="30" y1="50" x2="310" y2="50"
            stroke="#0284c7" strokeWidth="3.5"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("6, 2")}
          />
          <line
            x1="30" y1="130" x2="310" y2="130"
            stroke="#0284c7" strokeWidth="3.5"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("6, 2")}
          />
          <text x="315" y="54" fill="#0369a1" fontSize="12" fontWeight="bold">L1</text>
          <text x="315" y="134" fill="#0369a1" fontSize="12" fontWeight="bold">L2 (Parallel)</text>

          {/* Transversal & Intersecting Tracks */}
          <line
            x1="80" y1="20" x2="160" y2="160"
            stroke="#d97706" strokeWidth="3"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("6, 2")}
          />
          <line
            x1="260" y1="20" x2="180" y2="160"
            stroke="#d97706" strokeWidth="3"
            className="cursor-pointer hover:stroke-emerald-500 transition-colors"
            onClick={() => handleSelect("6, 2")}
          />

          {/* Intersections Glowing Nodes (Clickable) */}
          <circle cx="97" cy="50" r="7" fill="#dc2626" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:scale-125 transition-transform" onClick={() => handleSelect("6, 2")} />
          <circle cx="143" cy="130" r="7" fill="#dc2626" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:scale-125 transition-transform" onClick={() => handleSelect("6, 2")} />
          <circle cx="243" cy="50" r="7" fill="#dc2626" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:scale-125 transition-transform" onClick={() => handleSelect("6, 2")} />
          <circle cx="197" cy="130" r="7" fill="#dc2626" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:scale-125 transition-transform" onClick={() => handleSelect("6, 2")} />
          <circle cx="170" cy="90" r="8" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" className="cursor-pointer hover:scale-125 transition-transform" onClick={() => handleSelect("6, 2")} />
        </svg>

        <div
          onClick={() => handleSelect("6, 2")}
          className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-700 shadow-xs cursor-pointer hover:bg-emerald-50"
        >
          INSPECTION TALLY: 6 Intersecting, 2 Parallel (Click to select)
        </div>
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
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
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
                  <span className="text-xl font-black font-mono">{opt.val}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

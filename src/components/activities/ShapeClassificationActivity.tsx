"use client";

import React, { useState } from "react";
import { Boxes, CheckCircle2, Sparkles } from "lucide-react";

interface ShapeClassificationActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ShapeClassificationActivity({
  value,
  onChange,
  readOnly = false,
}: ShapeClassificationActivityProps) {
  const [selectedGrouping, setSelectedGrouping] = useState<string>(
    value ? String(value) : ""
  );

  // Grouping 9 figures into 3 classes based on geometric traits:
  // Class 1 (Open curved/wavy shapes): 1, 4, 7
  // Class 2 (Concentric closed polygons): 2, 5, 8
  // Class 3 (Intersecting line segments): 3, 6, 9
  const options = [
    { id: "A", val: "1,4,7; 2,5,8; 3,6,9", label: "(1,4,7), (2,5,8), (3,6,9)", isCorrect: true },
    { id: "B", val: "1,2,3; 4,5,6; 7,8,9", label: "(1,2,3), (4,5,6), (7,8,9)", isCorrect: false },
    { id: "C", val: "1,5,9; 2,6,7; 3,4,8", label: "(1,5,9), (2,6,7), (3,4,8)", isCorrect: false },
    { id: "D", val: "1,3,5; 2,4,6; 7,8,9", label: "(1,3,5), (2,4,6), (7,8,9)", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedGrouping(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-lg text-indigo-400">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-indigo-700 flex items-center gap-2">
              Shape Classification Observatory <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Classify the 9 laboratory figures into 3 distinct geometric classes based on topology.
            </p>
          </div>
        </div>
      </div>

      {/* 9 Laboratory Figures Table */}
      <div className="p-4 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              key={num}
              className="p-3 bg-white border border-slate-200 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-1 shadow-inner"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                {num === 1 && <span className="text-xl text-sky-400">〰️</span>}
                {num === 2 && <span className="text-xl text-emerald-400">⬡</span>}
                {num === 3 && <span className="text-xl text-amber-400">✕</span>}
                {num === 4 && <span className="text-xl text-sky-400">〜</span>}
                {num === 5 && <span className="text-xl text-emerald-400">□</span>}
                {num === 6 && <span className="text-xl text-amber-400">＋</span>}
                {num === 7 && <span className="text-xl text-sky-400">⌒</span>}
                {num === 8 && <span className="text-xl text-emerald-400">△</span>}
                {num === 9 && <span className="text-xl text-amber-400">✱</span>}
              </div>
              <span className="text-[10px] font-mono text-slate-600 font-bold">Fig #{num}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grouping Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select the correct 3-class geometric grouping:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedGrouping === opt.val || selectedGrouping === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-600/30 border-indigo-400 text-indigo-800 shadow-lg shadow-indigo-500/20 scale-[1.01]"
                    : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 border border-slate-200 rounded text-xs font-mono text-indigo-400 mr-2">
                    Option {opt.id}
                  </span>
                  <span className="font-mono text-sm tracking-wide">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

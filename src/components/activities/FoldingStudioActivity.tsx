"use client";

import React, { useState } from "react";
import { FoldVertical, Sparkles, CheckCircle2, Eye } from "lucide-react";

interface FoldingStudioActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FoldingStudioActivity({
  value,
  onChange,
  readOnly = false,
}: FoldingStudioActivityProps) {
  const [foldProgress, setFoldProgress] = useState(100); // 0 = open, 100 = fully folded
  const [selectedOption, setSelectedOption] = useState<string>(value ? String(value) : "");

  const options = [
    { id: "A", label: "Figure A", desc: "Triangular cutout overlapping circle on right" },
    { id: "B", label: "Figure B", desc: "Cutout inverted" },
    { id: "C", label: "Figure C", desc: "Circle on left half" },
    { id: "D", label: "Figure D", desc: "No overlap" },
  ];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedOption(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <FoldVertical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
              Transparent Sheet Folding Studio <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Drag the fold controller to simulate folding along the dotted crease line.
            </p>
          </div>
        </div>

        {/* Quick Fold Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFoldProgress(0)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-700 border border-slate-200 rounded text-xs"
          >
            Unfolded (0%)
          </button>
          <button
            type="button"
            onClick={() => setFoldProgress(100)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 rounded text-xs font-bold"
          >
            Folded (100%)
          </button>
        </div>
      </div>

      {/* Sheet Visualization Canvas */}
      <div className="relative h-64 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl flex items-center justify-center p-4 overflow-hidden">
        <svg viewBox="0 0 360 200" className="w-full h-full max-w-sm select-none">
          {/* Transparent Sheet Base */}
          <rect
            x="40"
            y="20"
            width="280"
            height="160"
            rx="8"
            fill="#0f172a"
            fillOpacity="0.6"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* Dotted Fold Axis Line */}
          <line
            x1="180"
            y1="20"
            x2="180"
            y2="180"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Left Half Graphics: Triangle & Diagonal cut */}
          <g
            style={{
              transformOrigin: "180px 100px",
              transform: `scaleX(${1 - (foldProgress / 100) * 2})`,
              opacity: foldProgress > 80 ? 0.4 : 1,
            }}
          >
            <polygon points="90,50 140,150 60,150" fill="#ec4899" fillOpacity="0.5" stroke="#f472b6" strokeWidth="2" />
          </g>

          {/* Right Half Graphics: Circle & Target boundary */}
          <circle cx="250" cy="100" r="35" fill="#38bdf8" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2" />

          {/* Overlapping Fold Projection when Folded */}
          {foldProgress > 50 && (
            <g style={{ opacity: foldProgress / 100 }}>
              {/* Inverted Triangle on Right Side */}
              <polygon points="270,50 220,150 300,150" fill="#ec4899" fillOpacity="0.6" stroke="#f472b6" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* Live Folding Status */}
        <div className="absolute bottom-3 left-3 bg-white border border-slate-200 border border-slate-200/80 px-3 py-1 rounded text-[11px] font-mono text-slate-700 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fold Progress: {foldProgress}%</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select which option matches the resulting folded configuration:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
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

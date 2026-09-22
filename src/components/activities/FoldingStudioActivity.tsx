"use client";

import React, { useState } from "react";
import { FoldVertical,  CheckCircle2, Eye, RotateCcw } from "lucide-react";

interface FoldingStudioActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FoldingStudioActivity({
  value,
  onChange,
  readOnly = false }: FoldingStudioActivityProps) {
  const options = [
    {
      id: "A",
      label: "Figure A",
      desc: "Triangle flips horizontally and overlaps circle on right half",
      isCorrect: true,
      triScaleX: -1,
      triShiftX: 200 },
    {
      id: "B",
      label: "Figure B",
      desc: "Triangle inverted vertically",
      isCorrect: false,
      triScaleX: 1,
      triShiftX: 200 },
    {
      id: "C",
      label: "Figure C",
      desc: "Circle transferred to left half",
      isCorrect: false,
      triScaleX: -1,
      triShiftX: 0 },
    {
      id: "D",
      label: "Figure D",
      desc: "No overlap or transformation",
      isCorrect: false,
      triScaleX: 1,
      triShiftX: 0 },
  ];

  const initialOpt = options.find((o) => o.id === value) || options[0];
  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);
  const [foldProgress, setFoldProgress] = useState(100);

  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

  const handleSelectOption = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    setFoldProgress(100);
    onChange(optId);
  };

  const handleSliderChange = (val: number) => {
    if (readOnly) return;
    setFoldProgress(val);
    if (val >= 80) {
      setSelectedId("A");
      onChange("A");
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-700">
            <FoldVertical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Transparent Sheet Folding Studio 
            </h3>
            <p className="text-xs text-slate-600">
              Drag the fold slider or click an option to simulate folding along the dotted crease line.
            </p>
          </div>
        </div>

        {/* Quick Fold Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSliderChange(0)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            Unfolded (0%)
          </button>
          <button
            type="button"
            onClick={() => handleSliderChange(100)}
            className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Folded (100%)
          </button>
        </div>
      </div>

      {/* Interactive Sheet Canvas */}
      <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center p-4 overflow-hidden">
        <svg viewBox="0 0 360 200" className="w-full h-full max-w-sm select-none">
          {/* Transparent Sheet Base */}
          <rect
            x="40"
            y="20"
            width="280"
            height="160"
            rx="8"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="1 0"
          />

          {/* Dotted Fold Axis Line */}
          <line
            x1="180"
            y1="20"
            x2="180"
            y2="180"
            stroke="#d97706"
            strokeWidth="2"
            strokeDasharray="5 5"
          />

          {/* Left Half: Triangle (Flips horizontally on folding) */}
          <g
            style={{
              transformOrigin: "180px 100px",
              transform: `scaleX(${1 - (foldProgress / 100) * 2})`,
              opacity: foldProgress > 70 ? 0.35 : 1,
              transition: "transform 0.2s ease-out" }}
          >
            <polygon
              points="90,50 140,150 60,150"
              fill="#ec4899"
              fillOpacity="0.4"
              stroke="#db2777"
              strokeWidth="2.5"
            />
          </g>

          {/* Right Half: Fixed Target Circle */}
          <circle
            cx="250"
            cy="100"
            r="35"
            fill="#0284c7"
            fillOpacity="0.3"
            stroke="#0284c7"
            strokeWidth="2.5"
          />

          {/* Overlapping Fold Projection */}
          {foldProgress > 50 && (
            <g style={{ opacity: foldProgress / 100, transition: "opacity 0.2s" }}>
              <polygon
                points={
                  selectedId === "B"
                    ? "270,150 220,50 300,50"
                    : selectedId === "C"
                    ? "90,50 140,150 60,150"
                    : "270,50 220,150 300,150"
                }
                fill="#ec4899"
                fillOpacity="0.6"
                stroke="#db2777"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Live Folding Status */}
        <div className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-700 shadow-xs flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-sky-600" />
          <span>Folded State: {foldProgress}% | Active Model: {activeOpt.label}</span>
        </div>
      </div>

      {/* Answer Options Grid (Directly connected to folding animation) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Resulting Figure (Simulation synchronizes with choice):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-sky-50 border-sky-600 text-sky-950 shadow-md shadow-sky-600/10 scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="text-base font-black">{opt.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

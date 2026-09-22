"use client";

import React, { useState } from "react";
import { Boxes, CheckCircle2, Sparkles, Filter } from "lucide-react";

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
  // 9 Figures grouping based on boundaries:
  // Class 1 (Pure Curves: 1, 7, 9 - Oval, Crescent, Drop)
  // Class 2 (Pure Straight Polygons: 2, 3, 5 - Triangle, Quad, Pentagon)
  // Class 3 (Mixed Straight + Curves: 4, 6, 8 - Sector, Shield, Arch)
  // Correct Option: B (1, 7, 9 ; 2, 3, 5 ; 4, 6, 8)
  const options = [
    {
      id: "A",
      val: "1, 7, 8 ; 2, 3, 5 ; 4, 6, 9",
      label: "1, 7, 8 ; 2, 3, 5 ; 4, 6, 9",
      groups: {
        "1": "C1", "7": "C1", "8": "C1",
        "2": "C2", "3": "C2", "5": "C2",
        "4": "C3", "6": "C3", "9": "C3",
      },
      isCorrect: false,
    },
    {
      id: "B",
      val: "1, 7, 9 ; 2, 3, 5 ; 4, 6, 8",
      label: "1, 7, 9 ; 2, 3, 5 ; 4, 6, 8",
      groups: {
        "1": "C1", "7": "C1", "9": "C1",
        "2": "C2", "3": "C2", "5": "C2",
        "4": "C3", "6": "C3", "8": "C3",
      },
      isCorrect: true,
      desc: "Pure Curves (1,7,9) • Pure Polygons (2,3,5) • Mixed (4,6,8)",
    },
    {
      id: "C",
      val: "1, 7, 9 ; 2, 3, 6 ; 4, 5, 8",
      label: "1, 7, 9 ; 2, 3, 6 ; 4, 5, 8",
      groups: {
        "1": "C1", "7": "C1", "9": "C1",
        "2": "C2", "3": "C2", "6": "C2",
        "4": "C3", "5": "C3", "8": "C3",
      },
      isCorrect: false,
    },
    {
      id: "D",
      val: "1, 2, 3 ; 4, 5, 6 ; 7, 8, 9",
      label: "1, 2, 3 ; 4, 5, 6 ; 7, 8, 9",
      groups: {
        "1": "C1", "2": "C1", "3": "C1",
        "4": "C2", "5": "C2", "6": "C2",
        "7": "C3", "8": "C3", "9": "C3",
      },
      isCorrect: false,
    },
  ];

  const initialOpt = options.find((o) => o.id === value || o.val === value) || options[1];
  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);

  const activeOpt = options.find((o) => o.id === selectedId) || options[1];

  const handleSelectOption = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  const figures = [
    { num: 1, name: "Oval (Ellipse)", type: "Smooth Curve", icon: "⬭" },
    { num: 2, name: "Triangle", type: "Straight Polygon", icon: "▲" },
    { num: 3, name: "Quadrilateral", type: "Straight Polygon", icon: "◆" },
    { num: 4, name: "Circular Sector", type: "Mixed Line + Curve", icon: "⌔" },
    { num: 5, name: "Regular Pentagon", type: "Straight Polygon", icon: "⬟" },
    { num: 6, name: "Shield Arch", type: "Mixed Line + Curve", icon: "🛡️" },
    { num: 7, name: "Crescent", type: "Smooth Curve", icon: "☽" },
    { num: 8, name: "Arched Polygon", type: "Mixed Line + Curve", icon: "⌂" },
    { num: 9, name: "Water Drop", type: "Smooth Curve", icon: "💧" },
  ];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Shape Classification Observatory <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-600">
              Classify the 9 geometric figures into 3 distinct classes based on boundary curvature.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300">
            Class 1 (Curves)
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
            Class 2 (Polygons)
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            Class 3 (Mixed)
          </span>
        </div>
      </div>

      {/* 9 Figures Observatory Grid (Color-coded based on active option) */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          {figures.map((fig) => {
            const classKey = (activeOpt.groups as any)[String(fig.num)] || "C1";
            let tagColor = "bg-sky-100 border-sky-300 text-sky-900";
            if (classKey === "C2") tagColor = "bg-emerald-100 border-emerald-300 text-emerald-900";
            if (classKey === "C3") tagColor = "bg-amber-100 border-amber-300 text-amber-900";

            return (
              <div
                key={fig.num}
                className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-between text-center gap-2 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between w-full text-[11px] font-mono">
                  <span className="font-bold text-slate-500">#{fig.num}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${tagColor}`}>
                    Group {classKey}
                  </span>
                </div>
                <div className="text-3xl py-1">{fig.icon}</div>
                <div className="text-xs font-bold text-slate-800 truncate w-full">{fig.name}</div>
                <div className="text-[10px] text-slate-500 truncate w-full">{fig.type}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grouping Options Grid (Directly connected to observatory) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select the correct 3-class geometric grouping:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-md shadow-indigo-600/10 scale-[1.01]"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div>
                    <div className="text-sm font-black font-mono">{opt.label}</div>
                    {opt.desc && <div className="text-[11px] text-slate-500 font-sans font-normal mt-0.5">{opt.desc}</div>}
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

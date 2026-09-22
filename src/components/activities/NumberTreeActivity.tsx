"use client";

import React, { useState } from "react";
import { GitBranch,  CheckCircle2 } from "lucide-react";

interface NumberTreeActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function NumberTreeActivity({
  value,
  onChange,
  readOnly = false }: NumberTreeActivityProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(
    value ? String(value) : ""
  );

  // Number tree structure:
  // Root: 48
  // Branch Left: x, Branch Right: 8 -> x * 8 = 48 -> x = 6!
  // From 8: Branch Left: 2, Branch Right: y -> 2 * y = 8 -> y = 4!
  // From 6 (x): Branch Left: 2, Branch Right: z -> 2 * z = 6 -> z = 3!
  // Sum or value: x = 6, y = 4, z = 3.
  const options = [
    { id: "A", val: "x=6, y=4, z=3", label: "x = 6, y = 4, z = 3", isCorrect: true },
    { id: "B", val: "x=8, y=2, z=4", label: "x = 8, y = 2, z = 4", isCorrect: false },
    { id: "C", val: "x=6, y=3, z=2", label: "x = 6, y = 3, z = 2", isCorrect: false },
    { id: "D", val: "x=4, y=6, z=3", label: "x = 4, y = 6, z = 3", isCorrect: false },
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
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Number Tree Laboratory
            </h3>
            <p className="text-xs text-slate-600">
              Click the unknown nodes in the factorization tree or select the matching combination.
            </p>
          </div>
        </div>

        {/* Quick Solution Button */}
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
              {opt.id}: {opt.val}
            </button>
          ))}
        </div>
      </div>

      {/* Living Tree Visualizer with clickable nodes */}
      <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 380 220" className="w-full h-full max-w-sm select-none">
          {/* Tree Branches */}
          <line x1="190" y1="35" x2="110" y2="90" stroke="#059669" strokeWidth="2.5" />
          <line x1="190" y1="35" x2="270" y2="90" stroke="#059669" strokeWidth="2.5" />

          <line x1="110" y1="100" x2="70" y2="160" stroke="#059669" strokeWidth="2" />
          <line x1="110" y1="100" x2="150" y2="160" stroke="#059669" strokeWidth="2" />

          <line x1="270" y1="100" x2="230" y2="160" stroke="#059669" strokeWidth="2" />
          <line x1="270" y1="100" x2="310" y2="160" stroke="#059669" strokeWidth="2" />

          {/* Root Node: 48 */}
          <circle cx="190" cy="35" r="22" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
          <text x="190" y="42" textAnchor="middle" fill="#065f46" fontSize="16" fontWeight="900">
            48
          </text>

          {/* Left Branch Node: x = 6 (Clickable) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleSelect(options[0].val)}
          >
            <circle cx="110" cy="95" r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="110" y="101" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="bold">
              x=6
            </text>
          </g>

          {/* Right Branch Node: 8 */}
          <circle cx="270" cy="95" r="18" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
          <text x="270" y="101" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">
            8
          </text>

          {/* Leaves under x (6): 2 and z (3) */}
          <circle cx="70" cy="165" r="15" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="70" y="170" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold">
            2
          </text>

          {/* Leaf z = 3 (Clickable) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleSelect(options[0].val)}
          >
            <circle cx="150" cy="165" r="15" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <text x="150" y="170" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">
              z=3
            </text>
          </g>

          {/* Leaves under 8: 2 and y (4) */}
          <circle cx="230" cy="165" r="15" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="230" y="170" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold">
            2
          </text>

          {/* Leaf y = 4 (Clickable) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleSelect(options[0].val)}
          >
            <circle cx="310" cy="165" r="15" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <text x="310" y="170" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">
              y=4
            </text>
          </g>
        </svg>

        <div className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-600 shadow-xs">
          Factorization Rule: Parent = Child₁ × Child₂
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Unknown Values of x, y, and z in the Number Tree:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.val || selectedAnswer === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.01]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <span className="font-mono text-base font-black">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

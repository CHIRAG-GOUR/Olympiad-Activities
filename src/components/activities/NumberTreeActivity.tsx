"use client";

import React, { useState } from "react";
import { GitBranch, Sparkles, CheckCircle2 } from "lucide-react";

interface NumberTreeActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function NumberTreeActivity({
  value,
  onChange,
  readOnly = false,
}: NumberTreeActivityProps) {
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
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-lime-500/20 border border-lime-400/40 rounded-lg text-lime-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-lime-300 flex items-center gap-2">
              Number Tree Laboratory <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Factorization cascade: Each parent node is the product of its two children.
            </p>
          </div>
        </div>
      </div>

      {/* Living Tree Visualizer */}
      <div className="relative h-64 bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 380 220" className="w-full h-full max-w-sm select-none">
          {/* Tree Branches */}
          <line x1="190" y1="35" x2="110" y2="90" stroke="#84cc16" strokeWidth="2.5" />
          <line x1="190" y1="35" x2="270" y2="90" stroke="#84cc16" strokeWidth="2.5" />

          <line x1="110" y1="100" x2="70" y2="160" stroke="#84cc16" strokeWidth="2" />
          <line x1="110" y1="100" x2="150" y2="160" stroke="#84cc16" strokeWidth="2" />

          <line x1="270" y1="100" x2="230" y2="160" stroke="#84cc16" strokeWidth="2" />
          <line x1="270" y1="100" x2="310" y2="160" stroke="#84cc16" strokeWidth="2" />

          {/* Root Node: 48 */}
          <circle cx="190" cy="35" r="22" fill="#365314" stroke="#84cc16" strokeWidth="2.5" />
          <text x="190" y="42" textAnchor="middle" fill="#ecfccb" fontSize="16" fontWeight="900">
            48
          </text>

          {/* Left Branch Node: x = 6 */}
          <circle cx="110" cy="95" r="18" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
          <text x="110" y="101" textAnchor="middle" fill="#fde047" fontSize="14" fontWeight="bold">
            x=6
          </text>

          {/* Right Branch Node: 8 */}
          <circle cx="270" cy="95" r="18" fill="#365314" stroke="#84cc16" strokeWidth="2" />
          <text x="270" y="101" textAnchor="middle" fill="#ecfccb" fontSize="14" fontWeight="bold">
            8
          </text>

          {/* Leaves under x (6): 2 and z (3) */}
          <circle cx="70" cy="165" r="15" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <text x="70" y="170" textAnchor="middle" fill="#94a3b8" fontSize="12">
            2
          </text>

          <circle cx="150" cy="165" r="15" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="150" y="170" textAnchor="middle" fill="#fde047" fontSize="12" fontWeight="bold">
            z=3
          </text>

          {/* Leaves under 8: 2 and y (4) */}
          <circle cx="230" cy="165" r="15" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <text x="230" y="170" textAnchor="middle" fill="#94a3b8" fontSize="12">
            2
          </text>

          <circle cx="310" cy="165" r="15" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="310" y="170" textAnchor="middle" fill="#fde047" fontSize="12" fontWeight="bold">
            y=4
          </text>
        </svg>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Find the unknown values of x, y, and z in the number tree:
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
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? "bg-lime-600/30 border-lime-400 text-lime-200 shadow-lg shadow-lime-500/20 scale-[1.01]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-lime-400 mr-2">
                    Option {opt.id}
                  </span>
                  <span className="font-mono text-base tracking-wide">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { KeyRound,  CheckCircle2 } from "lucide-react";

interface FactorVaultActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FactorVaultActivity({
  value,
  onChange,
  readOnly = false }: FactorVaultActivityProps) {
  // Factors of 32: 1, 2, 4, 8, 16, 32
  // Factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48
  // Common Factors of 32 and 48: 1, 2, 4, 8, 16
  const [selectedFactors, setSelectedFactors] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "1, 2, 4, 8, 16", label: "1, 2, 4, 8, 16 (All 5 common divisor keys)", isCorrect: true },
    { id: "B", val: "1, 2, 4, 8", label: "1, 2, 4, 8 (Missing 16)", isCorrect: false },
    { id: "C", val: "2, 4, 8, 16, 32", label: "2, 4, 8, 16, 32 (32 is not a factor of 48)", isCorrect: false },
    { id: "D", val: "1, 3, 4, 8, 16", label: "1, 3, 4... (3 is not a factor of 32)", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedFactors(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-800">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-700 flex items-center gap-2">
              Factor Lock Vault (32 & 48) 
            </h3>
            <p className="text-xs text-slate-600">
              Extract all shared common factor keys that unlock both Vault 32 and Vault 48 simultaneously.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Vault Panels */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 border border-amber-500/40 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-amber-800 block">
            VAULT 32 FACTORS
          </span>
          <div className="text-xs font-mono text-slate-700">
            [1, 2, 4, 8, 16, 32]
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 border border-amber-500/40 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-amber-800 block">
            VAULT 48 FACTORS
          </span>
          <div className="text-xs font-mono text-slate-700">
            [1, 2, 3, 4, 6, 8, 12, 16, 24, 48]
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select the complete set of common factors of 32 and 48:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedFactors === opt.val || selectedFactors === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? "bg-amber-600/30 border-amber-400 text-amber-800 shadow-lg shadow-amber-500/20 scale-[1.01]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono text-amber-800 mr-2">
                    Option {opt.id}
                  </span>
                  <span className="font-mono text-base font-black">{opt.val}</span>
                  <p className="text-[11px] text-slate-600 mt-1 font-normal">{opt.label}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-800 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

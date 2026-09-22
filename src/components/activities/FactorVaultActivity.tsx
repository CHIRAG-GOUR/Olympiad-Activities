"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, CheckCircle2 } from "lucide-react";

interface FactorVaultActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FactorVaultActivity({
  value,
  onChange,
  readOnly = false,
}: FactorVaultActivityProps) {
  const options = [
    { id: "A", val: "64", label: "64", isCorrect: false },
    { id: "B", val: "384", label: "384", isCorrect: false },
    { id: "C", val: "1536", label: "1536", isCorrect: false },
    { id: "D", val: "1024", label: "1024 (Product: 1 × 2 × 4 × 8 × 16 = 1024)", isCorrect: true },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "D") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.val === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Common Factor Product Vault (32 & 48)
            </h3>
            <p className="text-xs text-slate-600">
              Common factors of 32 & 48 are {"{1, 2, 4, 8, 16}"}. Calculate their product (1 × 2 × 4 × 8 × 16).
            </p>
          </div>
        </div>
      </div>

      {/* Dual Vault Panels (Interactive Canvas) */}
      <div
        onClick={() => handleSelect(options[3])}
        className="p-5 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl cursor-pointer transition-all shadow-xs"
        title="Click to calculate factor product: 1024 (Option D)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white border-2 border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block">
              Factors of 32
            </span>
            <div className="text-xs font-mono text-slate-700">
              [1, 2, 4, 8, 16, 32]
            </div>
          </div>

          <div className="p-3 bg-white border-2 border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block">
              Factors of 48
            </span>
            <div className="text-xs font-mono text-slate-700">
              [1, 2, 3, 4, 6, 8, 12, 16, 24, 48]
            </div>
          </div>
        </div>

        {/* Common Factor Product Calculation */}
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
          <span className="text-xs font-mono text-emerald-900 block font-bold">
            Common Factors = {"{1, 2, 4, 8, 16}"}
          </span>
          <div className="text-sm font-black text-emerald-800 mt-1 font-mono">
            Product = 1 × 2 × 4 × 8 × 16 = <span className="text-base text-emerald-700">1024</span> (Option D) ★
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select the product of all common factors:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
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
                    <span className="font-mono text-xl font-black">{opt.val}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Scale, CheckCircle2, User, UserCheck } from "lucide-react";

interface WeightBalanceActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function WeightBalanceActivity({
  value,
  onChange,
  readOnly = false,
}: WeightBalanceActivityProps) {
  // Question 42: Sneha weighs 35.28 kg. Sakshi is 4.15 kg heavier (39.43 kg). Monika is 1.05 kg heavier than Sakshi (40.48 kg).
  // Total weight: 35.28 + 39.43 + 40.48 = 115.19 kg
  // Options:
  // A: 111.25 kg
  // B: 97.05 kg
  // C: 113.09 kg
  // D: None of these (Actual 115.19 kg) -> Correct Option D

  const options = [
    { id: "A", val: "111.25 kg", label: "111.25 kg", desc: "Calculation omission" },
    { id: "B", val: "97.05 kg", label: "97.05 kg", desc: "Miscalculated base weights" },
    { id: "C", val: "113.09 kg", label: "113.09 kg", desc: "Carry error" },
    { id: "D", val: "None of these (Actual 115.19 kg)", label: "None of these (Actual 115.19 kg)", desc: "Exact sum: 35.28 + 39.43 + 40.48 = 115.19 kg", isCorrect: true },
  ];

  const getInitial = () => {
    if (!value) return "D";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || str.includes("115.19"));
    return found ? found.id : "D";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[3];

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Three-Person Weight Bridge Station (Q42)
            </h3>
            <p className="text-xs text-slate-600">
              Calculate total weight: Sneha (35.28 kg), Sakshi (+4.15 kg = 39.43 kg), Monika (+1.05 kg = 40.48 kg).
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-sky-50 text-sky-900 px-3 py-1.5 rounded-lg border border-sky-300">
          Scale Sum: <span className="text-sky-700 font-black">115.19 kg</span>
        </div>
      </div>

      {/* 3-Person Mass Bridge Canvas */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        {/* Person 1: Sneha */}
        <div
          onClick={() => handleSelect("D")}
          className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1 cursor-pointer hover:border-sky-400 transition-all shadow-sm"
        >
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">1. SNEHA</div>
          <div className="text-xl font-black text-slate-900 font-mono">35.28 kg</div>
          <span className="text-[10px] text-slate-400 font-mono">Base measurement</span>
        </div>

        {/* Person 2: Sakshi */}
        <div
          onClick={() => handleSelect("D")}
          className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1 cursor-pointer hover:border-sky-400 transition-all shadow-sm"
        >
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">2. SAKSHI (+4.15kg)</div>
          <div className="text-xl font-black text-sky-700 font-mono">39.43 kg</div>
          <span className="text-[10px] text-slate-400 font-mono">35.28 + 4.15</span>
        </div>

        {/* Person 3: Monika */}
        <div
          onClick={() => handleSelect("D")}
          className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1 cursor-pointer hover:border-sky-400 transition-all shadow-sm"
        >
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">3. MONIKA (+1.05kg)</div>
          <div className="text-xl font-black text-indigo-700 font-mono">40.48 kg</div>
          <span className="text-[10px] text-slate-400 font-mono">39.43 + 1.05</span>
        </div>

        {/* Total Triple Bridge */}
        <div
          onClick={() => handleSelect("D")}
          className="p-3 bg-sky-50 border-2 border-sky-500 rounded-xl text-center space-y-1 cursor-pointer shadow-md"
        >
          <div className="text-[10px] font-mono font-bold text-sky-900 uppercase">COMBINED TOTAL</div>
          <div className="text-xl font-black text-sky-950 font-mono">115.19 kg</div>
          <span className="text-[10px] text-emerald-700 font-bold font-mono">None of choices A, B, C</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Total Combined Weight:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-sky-50 border-sky-600 text-sky-950 shadow-sm ring-1 ring-sky-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div>
                    <div className="text-sm font-black font-mono">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 font-sans font-normal mt-0.5">{opt.desc}</div>
                  </div>
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

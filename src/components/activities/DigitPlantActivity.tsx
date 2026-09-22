"use client";

import React, { useState } from "react";
import { Cpu, CheckCircle2, Calculator, ArrowRight } from "lucide-react";

interface DigitPlantActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function DigitPlantActivity({
  value,
  onChange,
  readOnly = false,
}: DigitPlantActivityProps) {
  // Question 37: Rekha formed greatest 6-digit number (886410) and smallest 6-digit number (100468) using digits 1, 4, 0, 6, 8.
  // Calculate their sum: 886410 + 100468 = 986878 (Option B)

  const options = [
    { id: "A", val: "875680", num: 875680, label: "8,75,680", desc: "Calculation deviation" },
    { id: "B", val: "986878", num: 986878, label: "9,86,878 (886410 + 100468)", desc: "Exact arithmetic sum", isCorrect: true },
    { id: "C", val: "928170", num: 928170, label: "9,28,170", desc: "Carry error" },
    { id: "D", val: "756868", num: 756868, label: "7,56,868", desc: "Subtractive difference instead of sum" },
  ];

  const getInitial = () => {
    if (!value) return "B";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.id : "B";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[1];

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
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Digit Manufacturing Plant (Q37)
            </h3>
            <p className="text-xs text-slate-600">
              Form greatest & smallest 6-digit numbers from digits <span className="font-mono font-bold text-slate-900">[1, 4, 0, 6, 8]</span> and calculate their <strong className="text-indigo-700">total sum</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-lg border border-indigo-300">
          Synthesized Sum: <span className="text-indigo-700 font-black">{activeOpt.val}</span>
        </div>
      </div>

      {/* Interactive Assembly Conveyor */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Greatest Number Assembler */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
        >
          <div className="text-[10px] font-mono font-bold text-indigo-700 uppercase">
            GREATEST 6-DIGIT ASSEMBLY
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">8,86,410</div>
          <div className="text-[11px] text-slate-500">
            Repeats highest digit 8 in Lakhs & Ten-Thousands place
          </div>
        </div>

        {/* Smallest Number Assembler */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
        >
          <div className="text-[10px] font-mono font-bold text-sky-700 uppercase">
            SMALLEST 6-DIGIT ASSEMBLY
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">1,00,468</div>
          <div className="text-[11px] text-slate-500">
            Starts with 1 (cannot start with 0) and repeats 0
          </div>
        </div>

        {/* Total Sum Calculator Result */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-indigo-50 border-2 border-indigo-500 rounded-xl space-y-1.5 cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-900 uppercase">
            <span>SYNTHESIZED TOTAL SUM</span>
            <Calculator className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl font-black text-indigo-950 font-mono">9,86,878</div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold">
            886410 + 100468 = 986878
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Sum of Both 6-Digit Numbers:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-sm ring-1 ring-indigo-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-black font-mono">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <div className="mt-1">
                  <div className="text-[10px] text-slate-500 font-mono">Option {opt.id}</div>
                  <div className="text-[10px] text-slate-400 truncate">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

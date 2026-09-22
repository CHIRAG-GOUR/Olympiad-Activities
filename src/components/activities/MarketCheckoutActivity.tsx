"use client";

import React, { useState } from "react";
import { ShoppingCart, CheckCircle2, Store, Calculator } from "lucide-react";

interface MarketCheckoutActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function MarketCheckoutActivity({
  value,
  onChange,
  readOnly = false,
}: MarketCheckoutActivityProps) {
  // Question 44: Amit bought MCDLXX apples (1470), CMXLVIII oranges (948), and MCCCXCIX watermelons (1399).
  // Total fruits = 1470 + 948 + 1399 = 3817 (Option A)

  const options = [
    { id: "A", val: "3817", num: 3817, label: "3,817 Fruits (1470 + 948 + 1399)", desc: "Exact integer sum of all 3 fruits", isCorrect: true },
    { id: "B", val: "3750", num: 3750, label: "3,750 Fruits", desc: "Rounding subtraction error" },
    { id: "C", val: "3250", num: 3250, label: "3,250 Fruits", desc: "Missing watermelon tally" },
    { id: "D", val: "2913", num: 2913, label: "2,913 Fruits", desc: "Underrepresented roman translation" },
  ];

  const getInitial = () => {
    if (!value) return "A";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.id : "A";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

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
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Ancient Roman Market Register (Q44)
            </h3>
            <p className="text-xs text-slate-600">
              Decipher Roman quantities: <strong className="text-slate-900 font-mono">MCDLXX Apples</strong>, <strong className="text-slate-900 font-mono">CMXLVIII Oranges</strong>, <strong className="text-slate-900 font-mono">MCCCXCIX Melons</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
          Register Total: <span className="text-amber-800 font-black">{activeOpt.val} Fruits</span>
        </div>
      </div>

      {/* 3 Fruit Crates & Cash Register */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        {/* Apples */}
        <div
          onClick={() => handleSelect("A")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl text-center space-y-1 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
        >
          <div className="text-2xl">🍎</div>
          <div className="text-xs font-mono font-bold text-slate-500">MCDLXX APPLES</div>
          <div className="text-xl font-black text-slate-900 font-mono">1,470</div>
          <div className="text-[10px] text-slate-400 font-mono">1000 + 400 + 70</div>
        </div>

        {/* Oranges */}
        <div
          onClick={() => handleSelect("A")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl text-center space-y-1 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
        >
          <div className="text-2xl">🍊</div>
          <div className="text-xs font-mono font-bold text-slate-500">CMXLVIII ORANGES</div>
          <div className="text-xl font-black text-amber-700 font-mono">948</div>
          <div className="text-[10px] text-slate-400 font-mono">900 + 40 + 8</div>
        </div>

        {/* Melons */}
        <div
          onClick={() => handleSelect("A")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl text-center space-y-1 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
        >
          <div className="text-2xl">🍉</div>
          <div className="text-xs font-mono font-bold text-slate-500">MCCCXCIX MELONS</div>
          <div className="text-xl font-black text-emerald-700 font-mono">1,399</div>
          <div className="text-[10px] text-slate-400 font-mono">1300 + 90 + 9</div>
        </div>

        {/* Register Sum */}
        <div
          onClick={() => handleSelect("A")}
          className="p-3.5 bg-amber-50 border-2 border-amber-500 rounded-xl text-center space-y-1 cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-amber-900 uppercase">
            <Calculator className="w-3.5 h-3.5" />
            <span>TOTAL FRUITS</span>
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono">3,817</div>
          <div className="text-[10px] text-emerald-700 font-mono font-bold">
            1470 + 948 + 1399
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Total Fruits Purchased:
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
                    ? "bg-amber-50 border-amber-600 text-amber-950 shadow-sm ring-1 ring-amber-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl font-black font-mono">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <div className="mt-1">
                  <div className="text-[10px] text-slate-500 font-mono">Option {opt.id}</div>
                  <div className="text-[10px] text-slate-400 truncate">{opt.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

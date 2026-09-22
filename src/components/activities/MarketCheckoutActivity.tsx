"use client";

import React, { useState } from "react";
import { ShoppingCart, Sparkles, CheckCircle2 } from "lucide-react";

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
  // Fruit purchases in Roman numerals:
  // Apples: XLV = 45
  // Oranges: XXVIII = 28
  // Watermelons: XIV = 14
  // Total Fruits = 45 + 28 + 14 = 87 -> In Roman Numerals: LXXXVII!
  const [selectedTotal, setSelectedTotal] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "LXXXVII", num: 87, label: "LXXXVII (45 + 28 + 14 = 87)", isCorrect: true },
    { id: "B", val: "LXXVII", num: 77, label: "LXXVII (77)", isCorrect: false },
    { id: "C", val: "XCVII", num: 97, label: "XCVII (97)", isCorrect: false },
    { id: "D", val: "LXXXVIII", num: 88, label: "LXXXVIII (88)", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedTotal(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-700 flex items-center gap-2">
              Ancient Market Checkout <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Checkout register: Add <strong className="text-white">XLV Apples</strong> + <strong className="text-white">XXVIII Oranges</strong> + <strong className="text-white">XIV Watermelons</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Market Basket Stalls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-2xl">🍎</span>
          <div className="font-mono font-black text-lg text-amber-700">XLV Apples</div>
          <span className="text-[10px] text-slate-600 font-mono">= 45 units</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-2xl">🍊</span>
          <div className="font-mono font-black text-lg text-amber-700">XXVIII Oranges</div>
          <span className="text-[10px] text-slate-600 font-mono">= 28 units</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-2xl">🍉</span>
          <div className="font-mono font-black text-lg text-amber-700">XIV Melons</div>
          <span className="text-[10px] text-slate-600 font-mono">= 14 units</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select the total sum of fruits in Roman Numerals:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedTotal === opt.val || selectedTotal === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-600/30 border-amber-400 text-amber-800 shadow-lg shadow-amber-500/20 scale-[1.02]"
                    : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black font-mono">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id} ({opt.num})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ShoppingBag,  CheckCircle2, Wallet } from "lucide-react";

interface PocketMoneyActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PocketMoneyActivity({
  value,
  onChange,
  readOnly = false }: PocketMoneyActivityProps) {
  // Karan's pocket money problem:
  // Starts with X.
  // Shop 1 (Shoes): Spends 1/2 of X -> Remainder = X/2
  // Shop 2 (Books): Spends 1/2 of remainder = (X/2)/2 = X/4 -> Remainder = X/4
  // Shop 3 (Furniture/Toys): Spends 1/2 of remainder = (X/4)/2 = X/8 -> Remainder = X/8
  // Final remaining amount = ₹350
  // Therefore: X / 8 = ₹350 -> X = 350 * 8 = ₹2,800!
  const [selectedTotal, setSelectedTotal] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "₹2,800", num: 2800, label: "₹2,800 (350 × 2 × 2 × 2 = ₹2,800)", isCorrect: true },
    { id: "B", val: "₹2,400", num: 2400, label: "₹2,400", isCorrect: false },
    { id: "C", val: "₹3,200", num: 3200, label: "₹3,200", isCorrect: false },
    { id: "D", val: "₹1,400", num: 1400, label: "₹1,400", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedTotal(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-700">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
              Pocket Money Shopping Day 
            </h3>
            <p className="text-xs text-slate-600">
              Karan spends <strong className="text-emerald-700">half of the remaining money</strong> at 3 consecutive shops, leaving ₹350.
            </p>
          </div>
        </div>
      </div>

      {/* Sequential Shopping Street Canvas */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between min-w-[520px] gap-3">
          {/* Start: Initial Wallet */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center">
            <Wallet className="w-6 h-6 text-amber-800 mb-1" />
            <span className="text-[10px] font-mono text-slate-600">START WALLET</span>
            <span className="font-black text-sm text-amber-700">Total X</span>
          </div>

          <span className="text-slate-600 font-bold">→</span>

          {/* Shop 1: Shoes (-1/2) */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-slate-800">1. Shoe Store</span>
            <span className="text-[10px] text-rose-700 block">-1/2 (Spend ₹1,400)</span>
            <span className="text-[11px] font-mono text-slate-600">Leaves ₹1,400</span>
          </div>

          <span className="text-slate-600 font-bold">→</span>

          {/* Shop 2: Books (-1/2 of remainder) */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-slate-800">2. Book Store</span>
            <span className="text-[10px] text-rose-700 block">-1/2 (Spend ₹700)</span>
            <span className="text-[11px] font-mono text-slate-600">Leaves ₹700</span>
          </div>

          <span className="text-slate-600 font-bold">→</span>

          {/* Shop 3: Toys (-1/2 of remainder) */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-slate-800">3. Toy Store</span>
            <span className="text-[10px] text-rose-700 block">-1/2 (Spend ₹350)</span>
            <span className="text-[11px] font-mono text-slate-600">Leaves ₹350</span>
          </div>

          <span className="text-slate-600 font-bold">→</span>

          {/* Final Leftover */}
          <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex flex-col items-center">
            <span className="text-[10px] font-mono text-emerald-700 font-bold">REMAINING</span>
            <span className="font-black text-base text-slate-900">₹350</span>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
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
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-800 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

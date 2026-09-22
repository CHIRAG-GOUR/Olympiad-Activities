"use client";

import React, { useState } from "react";
import { Package, CheckCircle2, Scale, Truck } from "lucide-react";

interface PocketMoneyActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PocketMoneyActivity({
  value,
  onChange,
  readOnly = false,
}: PocketMoneyActivityProps) {
  // Question 36: If 12 cartons of mathematics textbooks weigh 180 kg, how many such identical cartons are needed to pack 225 kg of books?
  // 1 carton weight = 180 / 12 = 15 kg
  // Total cartons for 225 kg = 225 / 15 = 15 cartons (Option B)

  const options = [
    { id: "A", val: "14", num: 14, totalKg: 210, label: "14 Cartons (210 kg)", isCorrect: false },
    { id: "B", val: "15", num: 15, totalKg: 225, label: "15 Cartons (225 kg - EXACT MATCH)", isCorrect: true },
    { id: "C", val: "16", num: 16, totalKg: 240, label: "16 Cartons (240 kg)", isCorrect: false },
    { id: "D", val: "18", num: 18, totalKg: 270, label: "18 Cartons (270 kg)", isCorrect: false },
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
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Textbook Logistics & Packing Warehouse (Q36)
            </h3>
            <p className="text-xs text-slate-600">
              Unitary Method: 12 cartons weigh 180 kg (15 kg/carton). Calculate cartons needed for <strong className="text-indigo-700">225 kg</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-lg border border-indigo-300">
          Scale Reading: <span className="text-indigo-700 font-black">{activeOpt.totalKg} kg ({activeOpt.num} Cartons)</span>
        </div>
      </div>

      {/* Interactive Warehouse Pallet Canvas */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Step 1: Unit Rate Box */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500">
            <span>1. UNIT CARTON RATE</span>
            <Scale className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">15 kg / carton</div>
          <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            180 kg ÷ 12 cartons = <span className="font-bold text-indigo-700">15 kg</span> per carton
          </div>
        </div>

        {/* Step 2: Target Weight */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500">
            <span>2. TARGET SHIPMENT</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700 font-mono">225 kg Books</div>
          <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            Shipment quota required by exam specification
          </div>
        </div>

        {/* Step 3: Resulting Pallet */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-indigo-50 border-2 border-indigo-500 rounded-xl space-y-2 cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-800">
            <span>3. CARTONS REQUIRED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-indigo-950 font-mono">15 Cartons</div>
          <div className="text-xs text-indigo-900 font-mono font-semibold bg-white/80 p-2 rounded border border-indigo-200">
            225 kg ÷ 15 kg/carton = <span className="text-emerald-700 font-bold">15 Cartons</span>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Required Number of Cartons:
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
                  <span className="text-2xl font-black font-mono">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <div className="mt-1">
                  <div className="text-[10px] text-slate-500 font-mono">Option {opt.id} ({opt.totalKg} kg)</div>
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

"use client";

import React, { useState } from "react";
import { Package, CheckCircle2, Box, Layers } from "lucide-react";

interface PenPackingActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PenPackingActivity({
  value,
  onChange,
  readOnly = false,
}: PenPackingActivityProps) {
  // Question 40: 125360 black pens + 93515 blue pens = 218875 total pens.
  // Packed into boxes of 425 pens each.
  // 218875 / 425 = 515 boxes (Option D)

  const options = [
    { id: "A", val: "525", num: 525, label: "525 Boxes", desc: "Overcount of 10 boxes" },
    { id: "B", val: "490", num: 490, label: "490 Boxes", desc: "Undercount" },
    { id: "C", val: "570", num: 570, label: "570 Boxes", desc: "Quotient miscalculation" },
    { id: "D", val: "515", num: 515, label: "515 Boxes (2,18,875 ÷ 425 = 515)", desc: "Exact integer quotient (0 remainder)", isCorrect: true },
  ];

  const getInitial = () => {
    if (!value) return "D";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
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
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Industrial Stationery Pen Packing Plant (Q40)
            </h3>
            <p className="text-xs text-slate-600">
              Merge <strong className="text-slate-900 font-mono">1,25,360 Black</strong> + <strong className="text-slate-900 font-mono">93,515 Blue</strong> pens and pack into standard boxes of 425 pens.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-lg border border-indigo-300">
          Factory Output: <span className="text-indigo-700 font-black">{activeOpt.val} Boxes</span>
        </div>
      </div>

      {/* Industrial Packaging Conveyor Layout */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Step 1: Merged Pen Inflow */}
        <div
          onClick={() => handleSelect("D")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase">
            <span>1. MERGED TOTAL PENS</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">2,18,875</div>
          <div className="text-[11px] text-slate-500 font-mono">
            1,25,360 (Black) + 93,515 (Blue)
          </div>
        </div>

        {/* Step 2: Box Specification */}
        <div
          onClick={() => handleSelect("D")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase">
            <span>2. BOX UNIT CAPACITY</span>
            <Box className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700 font-mono">425 Pens / Box</div>
          <div className="text-[11px] text-slate-500">
            Standard ISO packing container capacity
          </div>
        </div>

        {/* Step 3: Calculated Boxes */}
        <div
          onClick={() => handleSelect("D")}
          className="p-3.5 bg-indigo-50 border-2 border-indigo-500 rounded-xl space-y-1.5 cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-900 uppercase">
            <span>3. PACKED PALLET COUNT</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-indigo-950 font-mono">515 Boxes</div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold">
            2,18,875 &divide; 425 = 515 (0 Remainder)
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Total Packed Boxes:
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

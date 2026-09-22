"use client";

import React, { useState } from "react";
import { Scissors, CheckCircle2, Grid3X3, Layers } from "lucide-react";

interface EnvelopePlantActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function EnvelopePlantActivity({
  value,
  onChange,
  readOnly = false,
}: EnvelopePlantActivityProps) {
  // Question 43: How many envelopes of size 16 cm by 12 cm can be cut from a large paper sheet of 384 cm by 168 cm?
  // Along length: 384 ÷ 16 = 24 envelopes
  // Along width: 168 ÷ 12 = 14 envelopes
  // Total envelopes = 24 × 14 = 336 envelopes (Option C)

  const options = [
    { id: "A", val: "340", num: 340, label: "340 Envelopes", desc: "Area approximation ignoring discrete dimensions" },
    { id: "B", val: "344", num: 344, label: "344 Envelopes", desc: "Overcount" },
    { id: "C", val: "336", num: 336, label: "336 Envelopes (24 × 14 = 336)", desc: "24 along length × 14 along width = 336", isCorrect: true },
    { id: "D", val: "342", num: 342, label: "342 Envelopes", desc: "Arithmetic error" },
  ];

  const getInitial = () => {
    if (!value) return "C";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.id : "C";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[2];

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
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Envelope Manufacturing Precision Cutter (Q43)
            </h3>
            <p className="text-xs text-slate-600">
              Master Sheet (<strong className="text-slate-900 font-mono">384 cm &times; 168 cm</strong>). Cut into envelopes of <strong className="text-emerald-700 font-mono">16 cm &times; 12 cm</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300">
          Factory Output: <span className="text-emerald-700 font-black">{activeOpt.val} Envelopes</span>
        </div>
      </div>

      {/* Cutting Grid Tessellation Breakdown */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Length Division */}
        <div
          onClick={() => handleSelect("C")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase">
            <span>1. LENGTH DIVISION</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">24 Units</div>
          <div className="text-[11px] text-slate-500 font-mono">
            384 cm &divide; 16 cm = <span className="font-bold text-emerald-700">24 rows</span>
          </div>
        </div>

        {/* Width Division */}
        <div
          onClick={() => handleSelect("C")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase">
            <span>2. WIDTH DIVISION</span>
            <Grid3X3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">14 Units</div>
          <div className="text-[11px] text-slate-500 font-mono">
            168 cm &divide; 12 cm = <span className="font-bold text-emerald-700">14 columns</span>
          </div>
        </div>

        {/* Total Envelope Count */}
        <div
          onClick={() => handleSelect("C")}
          className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl space-y-1.5 cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-900 uppercase">
            <span>3. TOTAL ENVELOPES</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono">336 Envelopes</div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold">
            24 &times; 14 = 336 (0 Waste)
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Total Envelopes Cut:
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
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-400"
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

"use client";

import React, { useState, useEffect } from "react";
import { Users, CheckCircle2 } from "lucide-react";

interface FamilyPinboardActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FamilyPinboardActivity({
  value,
  onChange,
  readOnly = false,
}: FamilyPinboardActivityProps) {
  const options = [
    { id: "A", val: "Nephew", label: "Nephew (Son of brother X)", isCorrect: true },
    { id: "B", val: "Son", label: "Son", isCorrect: false },
    { id: "C", val: "Uncle", label: "Uncle", isCorrect: false },
    { id: "D", val: "Son-in-law", label: "Son-in-law", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "A") : ""
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Genealogical Pedigree Board
            </h3>
            <p className="text-xs text-slate-600">
              Click the family nodes or deduction link to determine how V is related to W.
            </p>
          </div>
        </div>

        {/* Quick Deduction Presets */}
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedId === opt.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {opt.val} ({opt.id})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Detective Corkboard Tree */}
      <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 460 220" className="w-full h-full max-w-lg select-none">
          {/* Generation 1: W (Sister) <-> X (Father) */}
          <line x1="140" y1="60" x2="280" y2="60" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 4" />
          <text x="210" y="50" textAnchor="middle" fill="#e11d48" fontSize="11" fontWeight="bold">
            ◄── SIBLINGS ──►
          </text>

          {/* Node W (Female - Sister of X) */}
          <g
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleSelect(options[0])}
          >
            <rect x="70" y="30" width="70" height="60" rx="10" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
            <text x="105" y="58" textAnchor="middle" fill="#9f1239" fontSize="20" fontWeight="black">W</text>
            <text x="105" y="78" textAnchor="middle" fill="#be123c" fontSize="10" fontWeight="bold">(Sister)</text>
          </g>

          {/* Node X (Male - Brother of W, Father of V) */}
          <g className="cursor-pointer" onClick={() => handleSelect(options[0])}>
            <rect x="280" y="30" width="70" height="60" rx="10" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
            <text x="315" y="58" textAnchor="middle" fill="#0369a1" fontSize="20" fontWeight="black">X</text>
            <text x="315" y="78" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">(Father)</text>
          </g>

          {/* Vertical Parent-Child Line: X -> V & Z */}
          <line x1="315" y1="90" x2="315" y2="135" stroke="#0284c7" strokeWidth="2" />
          <line x1="240" y1="135" x2="390" y2="135" stroke="#0284c7" strokeWidth="2" />
          <line x1="240" y1="135" x2="240" y2="155" stroke="#0284c7" strokeWidth="2" />
          <line x1="390" y1="135" x2="390" y2="155" stroke="#0284c7" strokeWidth="2" />

          {/* Node V (Male - Son of X, Nephew of W) */}
          <g
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleSelect(options[0])}
          >
            <rect
              x="205" y="155" width="70" height="55" rx="10"
              fill={selectedId === "A" ? "#d1fae5" : "#ecfdf5"}
              stroke={selectedId === "A" ? "#059669" : "#10b981"}
              strokeWidth={selectedId === "A" ? 3 : 2}
            />
            <text x="240" y="182" textAnchor="middle" fill="#065f46" fontSize="18" fontWeight="black">V</text>
            <text x="240" y="198" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">(Son/Brother)</text>
          </g>

          {/* Node Z (Sibling) */}
          <g>
            <rect x="355" y="155" width="70" height="55" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="390" y="182" textAnchor="middle" fill="#475569" fontSize="18" fontWeight="black">Z</text>
            <text x="390" y="198" textAnchor="middle" fill="#64748b" fontSize="9">(Sibling)</text>
          </g>

          {/* Direct Deductive Connector: W -> V (Nephew) */}
          <path
            d="M 105 90 Q 120 180 205 180"
            fill="none"
            stroke="#d97706"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="cursor-pointer hover:stroke-emerald-600 transition-colors"
            onClick={() => handleSelect(options[0])}
          />
          <text
            x="120" y="142"
            fill="#b45309"
            fontSize="11"
            fontWeight="bold"
            className="cursor-pointer"
            onClick={() => handleSelect(options[0])}
          >
            V is Nephew of W (A) ★
          </text>
        </svg>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          How is V related to W?
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
                    <span className="text-base font-black">{opt.val}</span>
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

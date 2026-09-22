"use client";

import React, { useState } from "react";
import { Users, GitFork, CheckCircle2,  Heart } from "lucide-react";

interface FamilyPinboardActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function FamilyPinboardActivity({
  value,
  onChange,
  readOnly = false }: FamilyPinboardActivityProps) {
  const [selectedRelation, setSelectedRelation] = useState<string>(
    value ? String(value) : ""
  );

  // Problem statement:
  // W is sister of X.
  // X is father of V.
  // V is brother of Z.
  // How is W related to V?
  // W is sister of V's father (X) -> W is V's paternal Aunt!
  const options = [
    { id: "A", val: "Aunt", label: "Aunt (Sister of Father X)", isCorrect: true },
    { id: "B", val: "Mother", label: "Mother", isCorrect: false },
    { id: "C", val: "Sister", label: "Sister", isCorrect: false },
    { id: "D", val: "Daughter", label: "Daughter", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedRelation(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 border border-rose-400/40 rounded-lg text-rose-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-rose-700 flex items-center gap-2">
              Family Investigation Board 
            </h3>
            <p className="text-xs text-slate-600">
              Trace the genealogical connection between W and V through Father X.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Detective Corkboard Tree */}
      <div className="relative h-64 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 460 220" className="w-full h-full max-w-lg select-none">
          {/* Generation 1: W (Sister) <-> X (Father) */}
          {/* Horizontal Sibling Line */}
          <line x1="140" y1="60" x2="280" y2="60" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 4" />
          <text x="210" y="50" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="bold">
            ◄── SIBLINGS ──►
          </text>

          {/* Node W (Female) */}
          <g>
            <rect x="70" y="30" width="70" height="60" rx="10" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
            <text x="105" y="58" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="black">W</text>
            <text x="105" y="78" textAnchor="middle" fill="#fda4af" fontSize="10" fontWeight="bold">(Sister)</text>
          </g>

          {/* Node X (Male / Father) */}
          <g>
            <rect x="280" y="30" width="70" height="60" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="315" y="58" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="black">X</text>
            <text x="315" y="78" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">(Father)</text>
          </g>

          {/* Vertical Parent-Child Line: X -> V & Z */}
          <line x1="315" y1="90" x2="315" y2="135" stroke="#38bdf8" strokeWidth="2" />
          <line x1="240" y1="135" x2="390" y2="135" stroke="#38bdf8" strokeWidth="2" />
          <line x1="240" y1="135" x2="240" y2="155" stroke="#38bdf8" strokeWidth="2" />
          <line x1="390" y1="135" x2="390" y2="155" stroke="#38bdf8" strokeWidth="2" />

          {/* Node V (Son / Target) */}
          <g>
            <rect x="205" y="155" width="70" height="55" rx="10" fill="#065f46" stroke="#34d399" strokeWidth="2" />
            <text x="240" y="182" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="black">V</text>
            <text x="240" y="198" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">(Brother)</text>
          </g>

          {/* Node Z (Sibling) */}
          <g>
            <rect x="355" y="155" width="70" height="55" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="390" y="182" textAnchor="middle" fill="#94a3b8" fontSize="18" fontWeight="black">Z</text>
            <text x="390" y="198" textAnchor="middle" fill="#64748b" fontSize="9">(Sibling)</text>
          </g>

          {/* Direct Deductive Connector: W -> V (Aunt) */}
          <path
            d="M 105 90 Q 120 180 205 180"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <text x="135" y="145" fill="#fde047" fontSize="11" fontWeight="extrabold">
            W is Father's Sister (Aunt)
          </text>
        </svg>
      </div>

      {/* Relational Deduction Options */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          How is W related to V?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedRelation === opt.val || selectedRelation === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-rose-600/30 border-rose-400 text-rose-800 shadow-lg shadow-rose-500/20 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-700" />}
                </div>
                <span className="text-[10px] text-slate-600 mt-2 font-mono">Option {opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

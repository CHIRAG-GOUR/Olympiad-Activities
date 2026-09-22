"use client";

import React, { useState } from "react";
import { ArrowUpDown, CheckCircle2, Building, ShieldCheck } from "lucide-react";

interface IntegerElevatorActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function IntegerElevatorActivity({
  value,
  onChange,
  readOnly = false,
}: IntegerElevatorActivityProps) {
  // Question 46: Match statements in Column-I with Column-II:
  // P. Successor of (170 − 20 + 219 − 38 = 331) -> 331 + 1 = 332 -> (iii)
  // Q. Predecessor of (−911 + 175 − 200 = −936) -> −936 − 1 = −937 -> (i)
  // R. Successor of (480 − 419 − 729 + 330 = −338) -> −338 + 1 = −337 -> (iv)
  // S. Additive inverse of (152 + 283 − 333 = 102) -> −102 -> (ii)
  // Matching string: P-(iii); Q-(i); R-(iv); S-(ii) (Option C)

  const pairs = [
    { key: "P", expr: "Successor of (170 − 20 + 219 − 38 = 331)", math: "331 + 1", res: "332", target: "(iii)" },
    { key: "Q", expr: "Predecessor of (−911 + 175 − 200 = −936)", math: "−936 − 1", res: "−937", target: "(i)" },
    { key: "R", expr: "Successor of (480 − 419 − 729 + 330 = −338)", math: "−338 + 1", res: "−337", target: "(iv)" },
    { key: "S", expr: "Additive inverse of (152 + 283 − 333 = 102)", math: "−(102)", res: "−102", target: "(ii)" },
  ];

  const options = [
    { id: "A", val: "P-(ii); Q-(i); R-(iv); S-(iii)", label: "P-(ii); Q-(i); R-(iv); S-(iii)" },
    { id: "B", val: "P-(iii); Q-(iv); R-(i); S-(ii)", label: "P-(iii); Q-(iv); R-(i); S-(ii)" },
    { id: "C", val: "P-(iii); Q-(i); R-(iv); S-(ii)", label: "P-(iii); Q-(i); R-(iv); S-(ii)", isCorrect: true },
    { id: "D", val: "P-(iv); Q-(ii); R-(iii); S-(i)", label: "P-(iv); Q-(ii); R-(iii); S-(i)" },
  ];

  const getInitial = () => {
    if (!value) return "C";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str);
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
          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-700">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              High-Altitude Integer Elevator Matrix (Q46)
            </h3>
            <p className="text-xs text-slate-600">
              Achievers Section: Match each complex multi-term integer evaluation with its target destination level in Column-II.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-purple-50 text-purple-900 px-3 py-1.5 rounded-lg border border-purple-300">
          Matched Code: <span className="text-purple-700 font-black">{activeOpt.id} &rarr; {activeOpt.val}</span>
        </div>
      </div>

      {/* 4 Interactive Match Cable Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pairs.map((p) => (
          <div
            key={p.key}
            onClick={() => handleSelect("C")}
            className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-2 cursor-pointer hover:border-purple-400 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                Statement {p.key}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                &rarr; {p.target} ({p.res})
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-800">{p.expr}</div>
            <div className="text-[11px] font-mono text-slate-500 bg-white p-1.5 rounded border border-slate-200">
              Evaluation: {p.math} = <strong className="text-purple-700">{p.res}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Matching Combination:
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
                    ? "bg-purple-50 border-purple-600 text-purple-950 shadow-sm ring-1 ring-purple-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div className="font-mono text-xs font-black">{opt.label}</div>
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

"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, ArrowRight, CheckCircle2, Droplets } from "lucide-react";

interface TransformationLabActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function TransformationLabActivity({
  value,
  onChange,
  readOnly = false,
}: TransformationLabActivityProps) {
  const chain = [
    { from: "Apple", to: "Grass", icon: "🍎" },
    { from: "Grass", to: "Water", icon: "🌿" },
    { from: "Water", to: "Coal", icon: "💧", isTargetTransition: true },
    { from: "Coal", to: "Leaf", icon: "🪨" },
  ];

  const options = [
    { id: "A", val: "Water", label: "Water", isCorrect: false },
    { id: "B", val: "Coal", label: "Coal (Since 'Water' is called 'Coal')", isCorrect: true },
    { id: "C", val: "Grass", label: "Grass", isCorrect: false },
    { id: "D", val: "Apple", label: "Apple", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "B") : ""
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
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Substitution Cipher Laboratory
            </h3>
            <p className="text-xs text-slate-600">
              Click any stage on the substitution conveyor to decode what represents naturally colourless liquid (Water).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Mutation Pipeline Conveyor */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-x-auto shadow-xs">
        <div className="flex items-center justify-between min-w-[500px] gap-2">
          {chain.map((step, idx) => (
            <React.Fragment key={step.from}>
              <div
                onClick={() => {
                  if (step.isTargetTransition) handleSelect(options[1]); // Coal
                }}
                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  step.isTargetTransition
                    ? selectedId === "B"
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md ring-4 ring-emerald-400/30 scale-105"
                      : "bg-white border-amber-400 text-amber-900 hover:border-emerald-500"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <span className="text-2xl mb-1">{step.icon}</span>
                <span className="font-extrabold text-sm text-slate-900">{step.from}</span>
                <span className="text-[10px] font-mono text-slate-500">is called</span>
                <span
                  className={`font-black text-sm mt-0.5 ${
                    step.isTargetTransition ? "text-emerald-700" : "text-slate-700"
                  }`}
                >
                  {step.to} {step.isTargetTransition ? "★" : ""}
                </span>
              </div>

              {idx < chain.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Target Clue & Selection Grid */}
      <div className="space-y-2">
        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <Droplets className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-xs text-slate-700">
            Water is naturally colourless. Under this cipher: <strong className="text-emerald-800 font-bold">"Water is called Coal"</strong>.
          </p>
        </div>

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
                    <span className="text-lg font-black">{opt.val}</span>
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

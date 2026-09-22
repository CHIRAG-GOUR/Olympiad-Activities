"use client";

import React, { useState } from "react";
import { RefreshCw, ArrowRight, CheckCircle2,  Droplets } from "lucide-react";

interface TransformationLabActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function TransformationLabActivity({
  value,
  onChange,
  readOnly = false }: TransformationLabActivityProps) {
  const [selectedWord, setSelectedWord] = useState<string>(value ? String(value) : "");

  // Substitution chain:
  // Apple -> Grass -> Water -> Coal -> Leaf
  // Question: What is used to drink / What represents the colourless object (Water)?
  // In substitution code: 'Water' is called 'Coal'.
  const chain = [
    { from: "Apple", to: "Grass", icon: "🍎" },
    { from: "Grass", to: "Water", icon: "🌿" },
    { from: "Water", to: "Coal", icon: "💧", isTargetTransition: true },
    { from: "Coal", to: "Leaf", icon: "🪨" },
  ];

  const options = [
    { id: "A", val: "Coal", label: "Coal (Since 'Water' is called 'Coal')", isCorrect: true },
    { id: "B", val: "Water", label: "Water", isCorrect: false },
    { id: "C", val: "Grass", label: "Grass", isCorrect: false },
    { id: "D", val: "Leaf", label: "Leaf", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedWord(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-800">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-700 flex items-center gap-2">
              Word Transformation Laboratory 
            </h3>
            <p className="text-xs text-slate-600">
              Follow the substitution pipeline: Identify what a thirsty person will drink (Water → ?).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Mutation Pipeline Conveyor */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between min-w-[500px] gap-2">
          {chain.map((step, idx) => (
            <React.Fragment key={step.from}>
              <div
                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  step.isTargetTransition
                    ? "bg-cyan-50 border border-cyan-200 border-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "bg-white border border-slate-200 border-slate-200"
                }`}
              >
                <span className="text-2xl mb-1">{step.icon}</span>
                <span className="font-extrabold text-sm text-slate-900">{step.from}</span>
                <span className="text-[10px] font-mono text-slate-600">is called</span>
                <span
                  className={`font-black text-sm mt-0.5 ${
                    step.isTargetTransition ? "text-cyan-700" : "text-amber-700"
                  }`}
                >
                  {step.to}
                </span>
              </div>

              {idx < chain.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Target Clue & Selection Grid */}
      <div className="space-y-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
          <Droplets className="w-5 h-5 text-cyan-800" />
          <p className="text-xs text-slate-700">
            A thirsty person drinks <strong className="text-cyan-700 font-bold">Water</strong>.
            Under this code, what is Water called?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedWord === opt.val || selectedWord === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-cyan-600/30 border-cyan-400 text-cyan-800 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-800" />}
                </div>
                <span className="text-[10px] text-slate-600 mt-2">Option {opt.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Waves, Sparkles, CheckCircle2, Eye } from "lucide-react";

interface ReflectionPoolActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ReflectionPoolActivity({
  value,
  onChange,
  readOnly = false,
}: ReflectionPoolActivityProps) {
  const options = [
    {
      id: "A",
      text: "M E ⅃ C O W E",
      desc: "Correct vertical reflection for all characters",
      reflectedString: "M E ⅃ C O W E",
      isCorrect: true,
    },
    {
      id: "B",
      text: "M E L C O W E",
      desc: "Letter L is incorrectly un-inverted",
      reflectedString: "M E L C O W E",
      isCorrect: false,
    },
    {
      id: "C",
      text: "W E ⅃ C O M E",
      desc: "Letters W and M are not inverted vertically",
      reflectedString: "W E ⅃ C O M E",
      isCorrect: false,
    },
    {
      id: "D",
      text: "E M O C L E W",
      desc: "Reversed horizontally like a horizontal mirror",
      reflectedString: "E M O C L E W",
      isCorrect: false,
    },
  ];

  const initialOpt = options.find((o) => o.id === value) || options[0];
  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);

  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedId(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Optical Reflection Pool Laboratory <Sparkles className="w-4 h-4 text-cyan-500" />
            </h3>
            <p className="text-xs text-slate-600">
              Inspect the vertical water reflection of the word "WELCOME" across the horizontal waterline.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-cyan-50 text-cyan-900 px-3 py-1.5 rounded-lg border border-cyan-200">
          Axis: Horizontal Waterline (Vertical Inversion)
        </div>
      </div>

      {/* Interactive Water Chamber */}
      <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden select-none p-4">
        {/* Above Water: Original Word */}
        <div className="flex-1 flex items-end justify-center pb-3">
          <span className="font-black text-3xl sm:text-4xl tracking-widest text-slate-900 font-mono">
            W E L C O M E
          </span>
        </div>

        {/* Water Surface Line */}
        <div className="w-full relative flex items-center justify-center my-1">
          <div className="w-full h-0.5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
          <span className="absolute px-3 py-0.5 bg-cyan-100 border border-cyan-300 rounded-full text-[10px] font-mono font-bold text-cyan-900">
            WATERLINE (HORIZONTAL REFLECTION AXIS)
          </span>
        </div>

        {/* Below Water: Simulated Reflection linked to Selected Option */}
        <div className="flex-1 flex items-start justify-center pt-3">
          <span className="font-black text-3xl sm:text-4xl tracking-widest text-cyan-700 font-mono opacity-85">
            {activeOpt.reflectedString}
          </span>
        </div>

        {/* Active Inspection Pill */}
        <div className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-600 shadow-xs flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-600" />
          <span>Simulated Model: {activeOpt.id} ({activeOpt.desc})</span>
        </div>
      </div>

      {/* Answer Options Grid (Directly connected to pool) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Water Reflection Option (Reflection chamber updates in real-time):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-50 border-cyan-600 text-cyan-950 shadow-md shadow-cyan-600/10 scale-[1.01]"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div>
                    <div className="text-base font-black font-mono">{opt.text}</div>
                    <div className="text-[11px] text-slate-500 font-sans font-normal">{opt.desc}</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

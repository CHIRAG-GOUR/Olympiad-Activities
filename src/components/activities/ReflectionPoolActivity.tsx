"use client";

import React, { useState } from "react";
import { Waves, Sparkles, CheckCircle2 } from "lucide-react";

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
  const [waterline, setWaterline] = useState(50); // percentage
  const [selectedOption, setSelectedOption] = useState<string>(value ? String(value) : "");

  // Options representing the water image of WELCOME
  // Water image inverts each letter vertically in place:
  // W -> M, E -> E, L -> inverted L (foot points left), C -> C, O -> O, M -> W, E -> E
  const options = [
    {
      id: "A",
      text: "M E ⅃ C O W E",
      desc: "Correct vertical reflection for all characters",
      isCorrect: true,
    },
    {
      id: "B",
      text: "M E L C O W E",
      desc: "L is not vertically inverted",
      isCorrect: false,
    },
    {
      id: "C",
      text: "W E ⅃ C O M E",
      desc: "W and M are not inverted",
      isCorrect: false,
    },
    {
      id: "D",
      text: "E M O C L E W",
      desc: "Reversed horizontally like a mirror image",
      isCorrect: false,
    },
  ];

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedOption(id);
    onChange(id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-800/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-400">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-700 flex items-center gap-2">
              Optical Reflection Pool <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Drag the water boundary slider to observe the dynamic vertical reflection of "WELCOME".
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Water Chamber */}
      <div className="relative h-64 bg-slate-50 border border-slate-200 border border-cyan-900/60 rounded-xl flex flex-col items-center justify-center overflow-hidden select-none p-4">
        {/* Above Water: Original Word */}
        <div className="flex-1 flex items-end justify-center pb-3">
          <span className="font-black text-3xl sm:text-4xl tracking-widest text-white drop-shadow">
            W E L C O M E
          </span>
        </div>

        {/* Water Surface Line */}
        <div className="w-full relative flex items-center justify-center my-1">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />
          <span className="absolute px-2.5 py-0.5 bg-cyan-900/90 border border-cyan-400/50 rounded-full text-[10px] font-mono text-cyan-700">
            WATERLINE (VERTICAL REFLECTION AXIS)
          </span>
        </div>

        {/* Below Water: Real-time Inverted Reflection */}
        <div
          className="flex-1 flex items-start justify-center pt-3 opacity-80"
          style={{
            transform: "scaleY(-1)",
            filter: "blur(0.5px)",
          }}
        >
          <span className="font-black text-3xl sm:text-4xl tracking-widest text-cyan-700">
            W E L C O M E
          </span>
        </div>

        {/* Animated Water Ripple Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-950/40 to-transparent pointer-events-none" />
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select the correct water image of "WELCOME":
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id || selectedOption === opt.text;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? "bg-cyan-600/30 border-cyan-400 text-cyan-800 shadow-lg shadow-cyan-500/20 scale-[1.01]"
                    : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 border border-slate-200 rounded text-xs font-mono text-cyan-400">
                      Option {opt.id}
                    </span>
                    <span className="font-black text-xl tracking-wider">{opt.text}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-normal">{opt.desc}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

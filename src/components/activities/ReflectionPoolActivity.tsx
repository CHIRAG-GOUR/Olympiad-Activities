"use client";

import React, { useState, useEffect } from "react";
import { Waves, CheckCircle2, Eye, Sparkles } from "lucide-react";

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
      text: "Option A (W→M, E→E, L flipped up, C→C, O→O, M→W, E→E)",
      desc: "True vertical water reflection for every letter",
      reflectedString: "M E ⅃ C O W E",
      isCorrect: true,
    },
    {
      id: "B",
      text: "Option B (Horizontal reverse order)",
      desc: "Reversed horizontally like a horizontal mirror",
      reflectedString: "E M O C L E W",
      isCorrect: false,
    },
    {
      id: "C",
      text: "Option C (Letters rotated 180 degrees)",
      desc: "Letters rotated 180 degrees instead of pure reflection",
      reflectedString: "Ǝ W O Ɔ ⅂ Ǝ M",
      isCorrect: false,
    },
    {
      id: "D",
      text: "Option D (Only vowels inverted)",
      desc: "Only vowels inverted, consonants unchanged",
      reflectedString: "W Ǝ L C O M Ǝ",
      isCorrect: false,
    },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value)?.id || "A") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value);
      if (match) setSelectedId(match.id);
    }
  }, [value]);

  const handleSelect = (id: string) => {
    if (readOnly) return;
    setSelectedId(id);
    onChange(id);
  };

  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Optical Water Reflection Pool
            </h3>
            <p className="text-xs text-slate-600">
              Click the underwater reflection chamber or select an option to simulate the vertical water image.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300">
          Axis: Horizontal Waterline (Vertical Inversion)
        </div>
      </div>

      {/* Interactive Water Chamber */}
      <div
        onClick={() => handleSelect("A")}
        className="relative h-64 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl flex flex-col items-center justify-center overflow-hidden select-none p-4 cursor-pointer transition-all"
        title="Click to select Option A (True Reflection)"
      >
        {/* Above Water: Original Word */}
        <div className="flex-1 flex items-end justify-center pb-3">
          <span className="font-black text-3xl sm:text-4xl tracking-widest text-slate-900 font-mono">
            W E L C O M E
          </span>
        </div>

        {/* Water Surface Line */}
        <div className="w-full relative flex items-center justify-center my-1">
          <div className="w-full h-0.5 bg-cyan-600 shadow-[0_0_8px_#0891b2]" />
          <span className="absolute px-3 py-0.5 bg-cyan-50 border border-cyan-300 rounded-full text-[10px] font-mono font-bold text-cyan-900">
            WATERLINE (HORIZONTAL REFLECTION AXIS)
          </span>
        </div>

        {/* Below Water: Simulated Reflection linked to Selected Option */}
        <div className="flex-1 flex items-start justify-center pt-3 relative">
          <span className="font-black text-3xl sm:text-4xl tracking-widest text-cyan-700 font-mono opacity-90">
            {activeOpt.reflectedString}
          </span>
          {activeOpt.id === "A" && (
            <span className="absolute -top-1 right-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 animate-pulse">
              ✓ Exact Match
            </span>
          )}
        </div>

        {/* Active Inspection Pill */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-700 shadow-xs flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-700" />
          <span>Active Simulation: Option {activeOpt.id}</span>
        </div>
      </div>

      {/* Answer Options Grid (Directly connected to pool) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Water Reflection Option:
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
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.01]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="font-mono text-base font-black tracking-wider text-slate-900">
                      {opt.reflectedString}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{opt.desc}</p>
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

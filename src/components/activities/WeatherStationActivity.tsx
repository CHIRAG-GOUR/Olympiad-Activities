"use client";

import React, { useState } from "react";
import { ThermometerSnowflake, CheckCircle2, Sun, Snowflake } from "lucide-react";

interface WeatherStationActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function WeatherStationActivity({
  value,
  onChange,
  readOnly = false,
}: WeatherStationActivityProps) {
  // Question 39: Minimum temp in Manali = −8°C, Jaipur = 23°C.
  // Difference = 23 − (−8) = 23 + 8 = 31°C (Option B)

  const options = [
    { id: "A", val: "30°C", num: 30, label: "30°C", desc: "Approximation error" },
    { id: "B", val: "31°C", num: 31, label: "31°C (23 − (−8) = 31°C)", desc: "Exact thermal span", isCorrect: true },
    { id: "C", val: "29°C", num: 29, label: "29°C", desc: "Subtraction error" },
    { id: "D", val: "8°C", num: 8, label: "8°C", desc: "Only sub-zero magnitude" },
  ];

  const getInitial = () => {
    if (!value) return "B";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.id : "B";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[1];

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
          <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700">
            <ThermometerSnowflake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Mountain vs City Weather Station (Q39)
            </h3>
            <p className="text-xs text-slate-600">
              Measure signed temperature span between Manali (<span className="text-cyan-700 font-bold font-mono">−8°C</span>) and Jaipur (<span className="text-amber-600 font-bold font-mono">+23°C</span>).
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-cyan-50 text-cyan-900 px-3 py-1.5 rounded-lg border border-cyan-300">
          Evaluated Span: <span className="text-cyan-700 font-black">{activeOpt.val}</span>
        </div>
      </div>

      {/* Dual Mercury Thermometer Columns & Difference Gauge */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-4">
        {/* Manali: -8°C */}
        <div
          onClick={() => handleSelect("B")}
          className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center gap-2 w-full sm:w-auto cursor-pointer hover:border-cyan-400 transition-all shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700">
            <Snowflake className="w-4 h-4 text-cyan-500" />
            <span>Manali (Min)</span>
          </div>
          <div className="w-10 h-36 bg-slate-100 border-2 border-cyan-400 rounded-full relative overflow-hidden p-1 flex flex-col-reverse items-center">
            {/* Mercury Column for -8 */}
            <div className="w-4 h-8 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full" />
            <div className="w-6 h-6 bg-cyan-500 rounded-full absolute bottom-1" />
          </div>
          <span className="font-black text-2xl text-cyan-800 font-mono">−8°C</span>
          <span className="text-[10px] text-slate-400 font-mono">Sub-zero Freeze</span>
        </div>

        {/* Thermal Difference Span Indicator */}
        <div
          onClick={() => handleSelect("B")}
          className="p-4 bg-cyan-50 border-2 border-cyan-500 rounded-xl text-center space-y-1.5 cursor-pointer shadow-md w-full sm:w-auto"
        >
          <div className="text-xs font-mono font-bold text-cyan-800 uppercase">
            THERMAL GAP CALCULATION
          </div>
          <div className="font-black text-3xl text-cyan-950 font-mono">31°C Difference</div>
          <div className="text-xs text-slate-700 font-mono bg-white/80 p-2 rounded border border-cyan-200">
            23°C &minus; (&minus;8°C) = 23 + 8 = <span className="font-bold text-cyan-800">31°C</span>
          </div>
        </div>

        {/* Jaipur: +23°C */}
        <div
          onClick={() => handleSelect("B")}
          className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center gap-2 w-full sm:w-auto cursor-pointer hover:border-amber-400 transition-all shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Jaipur (Warm)</span>
          </div>
          <div className="w-10 h-36 bg-slate-100 border-2 border-amber-400 rounded-full relative overflow-hidden p-1 flex flex-col-reverse items-center">
            {/* Mercury Column for +23 */}
            <div className="w-4 h-28 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full" />
            <div className="w-6 h-6 bg-amber-500 rounded-full absolute bottom-1" />
          </div>
          <span className="font-black text-2xl text-amber-800 font-mono">+23°C</span>
          <span className="text-[10px] text-slate-400 font-mono">Desert Climate</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Calculated Temperature Difference:
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
                    ? "bg-cyan-50 border-cyan-600 text-cyan-950 shadow-sm ring-1 ring-cyan-400"
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

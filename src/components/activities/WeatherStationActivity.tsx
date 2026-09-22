"use client";

import React, { useState } from "react";
import { ThermometerSnowflake,  CheckCircle2 } from "lucide-react";

interface WeatherStationActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function WeatherStationActivity({
  value,
  onChange,
  readOnly = false }: WeatherStationActivityProps) {
  // Temperature at Manali = -8°C
  // Temperature at Jaipur = 23°C
  // Difference = 23 - (-8) = 23 + 8 = 31°C!
  const [selectedDelta, setSelectedDelta] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", val: "31°C", label: "31°C (23°C - (-8°C) = 31°C)", isCorrect: true },
    { id: "B", val: "15°C", label: "15°C (23 - 8 = 15)", isCorrect: false },
    { id: "C", val: "-31°C", label: "-31°C", isCorrect: false },
    { id: "D", val: "25°C", label: "25°C", isCorrect: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedDelta(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-800">
            <ThermometerSnowflake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-700 flex items-center gap-2">
              Mountain vs City Weather Station 
            </h3>
            <p className="text-xs text-slate-600">
              Measure the signed temperature differential between Manali (-8°C) and Jaipur (23°C).
            </p>
          </div>
        </div>
      </div>

      {/* Dual Mercury Thermometer Columns */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-around flex-wrap gap-4">
        {/* Manali: -8°C */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-44 bg-white border border-slate-200 border-2 border-cyan-500/60 rounded-full relative overflow-hidden p-1 flex flex-col-reverse items-center shadow-[0_0_12px_#06b6d430]">
            {/* Mercury column */}
            <div className="w-4 h-10 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full" />
            <div className="w-6 h-6 bg-cyan-500 rounded-full absolute bottom-1" />
          </div>
          <span className="font-bold text-sm text-cyan-700">Manali</span>
          <span className="font-black text-xl text-cyan-800 font-mono">-8°C</span>
        </div>

        {/* Temperature Delta Gauge */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-xs font-mono text-slate-600">Total Thermal Gap</span>
          <div className="font-black text-3xl text-amber-700 font-mono">31°C</div>
          <span className="text-[10px] text-slate-500 font-mono">23 - (-8) = 23 + 8</span>
        </div>

        {/* Jaipur: 23°C */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-44 bg-white border border-slate-200 border-2 border-amber-500/60 rounded-full relative overflow-hidden p-1 flex flex-col-reverse items-center shadow-[0_0_12px_#f59e0b30]">
            {/* Mercury column */}
            <div className="w-4 h-32 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full" />
            <div className="w-6 h-6 bg-amber-500 rounded-full absolute bottom-1" />
          </div>
          <span className="font-bold text-sm text-amber-700">Jaipur</span>
          <span className="font-black text-xl text-amber-800 font-mono">+23°C</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedDelta === opt.val || selectedDelta === opt.id;
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
                <span className="text-2xl font-black">{opt.val}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-800" />}
              </div>
              <span className="text-[10px] text-slate-600 mt-2 font-mono">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

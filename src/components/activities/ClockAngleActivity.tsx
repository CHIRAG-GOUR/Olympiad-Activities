"use client";

import React, { useState } from "react";
import { Clock, Sparkles, CheckCircle2 } from "lucide-react";

interface ClockAngleActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ClockAngleActivity({
  value,
  onChange,
  readOnly = false,
}: ClockAngleActivityProps) {
  // Clock times:
  // Option A: 4:40 -> Hour hand at 140°, Minute hand at 240° -> Angle = 100° (Obtuse > 90° and < 180°!)
  // Option B: 3:00 -> Angle = 90° (Right angle)
  // Option C: 2:00 -> Angle = 60° (Acute)
  // Option D: 6:00 -> Angle = 180° (Straight angle)
  // Question: Which time forms an obtuse angle between the hands?
  // Answer: 4:40 (100° obtuse)!
  const [selectedTime, setSelectedTime] = useState<string>(
    value ? String(value) : ""
  );

  const options = [
    { id: "A", time: "4:40", angle: 100, type: "Obtuse (100°)", isCorrect: true },
    { id: "B", time: "3:00", angle: 90, type: "Right Angle (90°)", isCorrect: false },
    { id: "C", time: "2:00", angle: 60, type: "Acute (60°)", isCorrect: false },
    { id: "D", time: "6:00", angle: 180, type: "Straight Angle (180°)", isCorrect: false },
  ];

  const handleSelect = (time: string) => {
    if (readOnly) return;
    setSelectedTime(time);
    onChange(time);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-300 flex items-center gap-2">
              Clock Tower Workshop (Obtuse Angles) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Condition: Identify the time forming an <strong className="text-amber-400">obtuse angle (90° &lt; θ &lt; 180°)</strong> between the clock hands.
            </p>
          </div>
        </div>
      </div>

      {/* Geared Analog Clock Visualizer for 4:40 */}
      <div className="p-6 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-center">
        <div className="flex items-center gap-8 flex-wrap justify-center">
          <svg viewBox="0 0 200 200" className="w-44 h-44 select-none">
            {/* Clock Face Dial */}
            <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />

            {/* Hour tick marks */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 100 + 72 * Math.sin(angle);
              const y = 100 - 72 * Math.cos(angle);
              return (
                <text key={h} x={x} y={y + 4} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                  {h}
                </text>
              );
            })}

            {/* Obtuse Arc Sector (100°) */}
            <path
              d="M 100 100 L 140 148 A 60 60 0 0 1 48 135 Z"
              fill="#fbbf24"
              fillOpacity="0.2"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <text x="100" y="145" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">
              100° (Obtuse)
            </text>

            {/* Minute Hand at 40 (240°) */}
            <line x1="100" y1="100" x2="35" y2="138" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

            {/* Hour Hand at 4:40 (140°) */}
            <line x1="100" y1="100" x2="142" y2="150" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />

            {/* Center Cap */}
            <circle cx="100" cy="100" r="5" fill="#ffffff" />
          </svg>

          <div className="space-y-2 text-xs font-mono">
            <div>Display Time: <strong className="text-white text-base">4:40</strong></div>
            <div>Hour Hand Position: <strong className="text-amber-300">140°</strong></div>
            <div>Minute Hand Position: <strong className="text-sky-300">240°</strong></div>
            <div className="pt-2 border-t border-slate-800 text-amber-400 font-bold">
              Smallest Angle = 240° - 140° = 100° (Obtuse)
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = selectedTime === opt.time || selectedTime === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(opt.time)}
              className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-amber-600/30 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{opt.time}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">{opt.type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

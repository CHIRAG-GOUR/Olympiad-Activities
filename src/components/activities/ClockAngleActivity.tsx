"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2 } from "lucide-react";

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
  const options = [
    { id: "A", val: "4:00", label: "Clock A (4:00 = 120° Obtuse)", isCorrect: false },
    { id: "B", val: "7:00", label: "Clock B (7:00 = 150° Obtuse)", isCorrect: false },
    { id: "C", val: "8:00", label: "Clock C (8:00 = 120° Obtuse)", isCorrect: false },
    { id: "D", val: "All of these", label: "All of these (4:00, 7:00, 8:00 are all obtuse angles > 90°)", isCorrect: true },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "D") : ""
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

  const clocks = [
    { name: "Clock A", time: "4:00", angle: "120°", type: "Obtuse", hourDeg: 120, minDeg: 0 },
    { name: "Clock B", time: "7:00", angle: "150°", type: "Obtuse", hourDeg: 210, minDeg: 0 },
    { name: "Clock C", time: "8:00", angle: "120°", type: "Obtuse", hourDeg: 240, minDeg: 0 },
  ];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Clock Angle Laboratory (Obtuse Hands)
            </h3>
            <p className="text-xs text-slate-600">
              Inspect the smaller angle between hour & minute hands for 4:00 (120°), 7:00 (150°), and 8:00 (120°).
            </p>
          </div>
        </div>
      </div>

      {/* 3 Interactive Clocks Display */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {clocks.map((c, i) => {
            const hAngle = ((c.hourDeg - 90) * Math.PI) / 180;
            const hx = 60 + 26 * Math.cos(hAngle);
            const hy = 60 + 26 * Math.sin(hAngle);

            return (
              <div
                key={c.name}
                onClick={() => handleSelect(options[3])}
                className="p-3 bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
              >
                <svg viewBox="0 0 120 120" className="w-28 h-28">
                  <circle cx="60" cy="60" r="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                  {/* Minute hand pointing to 12 (top) */}
                  <line x1="60" y1="60" x2="60" y2="22" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
                  {/* Hour hand */}
                  <line x1="60" y1="60" x2={hx} y2={hy} stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="60" cy="60" r="4" fill="#0f172a" />
                  {/* Hour numbers */}
                  <text x="60" y="19" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">12</text>
                  <text x="101" y="63" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">3</text>
                  <text x="60" y="105" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">6</text>
                  <text x="19" y="63" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">9</text>
                </svg>
                <span className="font-black text-sm text-slate-900 mt-1">{c.name} ({c.time})</span>
                <span className="text-[11px] font-mono font-bold text-emerald-700">{c.angle} ({c.type})</span>
              </div>
            );
          })}
        </div>

        {/* Global Confirmation Banner */}
        <div
          onClick={() => handleSelect(options[3])}
          className="mt-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-mono font-bold text-emerald-900 cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          ✓ All 3 Clocks (4:00, 7:00, 8:00) form obtuse angles &gt; 90°. (Click to Select Option D) ★
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Which of the clocks form an obtuse angle between hands?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
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
                    <span className="text-base font-black">{opt.label}</span>
                  </div>
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

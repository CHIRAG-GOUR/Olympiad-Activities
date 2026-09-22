"use client";

import React, { useState } from "react";
import { Scale, CheckCircle2, Crosshair, ShieldCheck } from "lucide-react";

interface InspectionDroneActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function InspectionDroneActivity({
  value,
  onChange,
  readOnly = false,
}: InspectionDroneActivityProps) {
  // Question 47: Fulcrum Torque Balance:
  // Left arm: 18 N at 2.0 m -> Left Torque = 18 × 2 = 36 N·m
  // Right arm: Distance = 3.0 m
  // Counterweight required: W × 3.0 = 36 => W = 12 kg (Option B)

  const options = [
    { id: "A", val: "8 kg", mass: 8, torque: 24, tilt: -12, label: "8 kg (Right Torque = 24 N·m)", desc: "Left heavy - scale tilts down on left" },
    { id: "B", val: "12 kg (36 N·m equilibrium)", mass: 12, torque: 36, tilt: 0, label: "12 kg (36 N·m equilibrium)", desc: "Exact torque balance: 18 × 2 = 12 × 3 = 36 N·m", isCorrect: true },
    { id: "C", val: "15 kg", mass: 15, torque: 45, tilt: 10, label: "15 kg (Right Torque = 45 N·m)", desc: "Right heavy - tilts right" },
    { id: "D", val: "18 kg", mass: 18, torque: 54, tilt: 16, label: "18 kg (Right Torque = 54 N·m)", desc: "Heavy right tilt overload" },
  ];

  const getInitial = () => {
    if (!value) return "B";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.mass) === str);
    return found ? found.id : "B";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[1];

  const handleSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Fulcrum Torque Equilibrium Simulator (Q47)
            </h3>
            <p className="text-xs text-slate-600">
              Left load: <strong className="text-slate-900">18 N at 2.0 m (36 N·m)</strong>. Adjust right counterweight at 3.0 m to achieve exact horizontal 0° balance.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-purple-50 text-purple-900 px-3 py-1.5 rounded-lg border border-purple-300">
          Equilibrium State: {activeOpt.tilt === 0 ? "🎯 0.0° PERFECT LEVEL" : `${activeOpt.tilt > 0 ? "+" : ""}${activeOpt.tilt}° TILT`}
        </div>
      </div>

      {/* Interactive Fulcrum Seesaw Canvas */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center">
        <svg viewBox="0 0 380 160" className="w-full h-full max-w-md select-none">
          {/* Fulcrum Triangle Base */}
          <polygon points="190,110 175,145 205,145" fill="#64748b" stroke="#334155" strokeWidth="2" />
          <rect x="150" y="145" width="80" height="8" fill="#94a3b8" rx="2" />
          <circle cx="190" cy="110" r="5" fill="#0f172a" />

          {/* Rotating Seesaw Beam with tilt angle */}
          <g transform={`rotate(${activeOpt.tilt}, 190, 110)`} className="transition-transform duration-300 ease-out">
            {/* Beam Bar */}
            <rect x="50" y="106" width="280" height="8" fill="#475569" stroke="#1e293b" strokeWidth="1.5" rx="3" />

            {/* Left Pan & Load: 18 N at 2.0 m */}
            <line x1="90" y1="110" x2="90" y2="80" stroke="#64748b" strokeWidth="2" />
            <rect x="65" y="55" width="50" height="25" fill="#ecfdf5" stroke="#059669" strokeWidth="2" rx="4" />
            <text x="90" y="71" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46" fontFamily="monospace">
              18 N (2m)
            </text>

            {/* Right Pan & Load: Counterweight at 3.0 m */}
            <line x1="310" y1="110" x2="310" y2="80" stroke="#64748b" strokeWidth="2" />
            <rect
              x="280"
              y={55 - (activeOpt.mass - 8) * 1.5}
              width="60"
              height={25 + (activeOpt.mass - 8) * 1.5}
              fill={activeOpt.tilt === 0 ? "#f5f3ff" : "#fef2f2"}
              stroke={activeOpt.tilt === 0 ? "#7c3aed" : "#ef4444"}
              strokeWidth="2"
              rx="4"
            />
            <text
              x="310"
              y="71"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={activeOpt.tilt === 0 ? "#6d28d9" : "#b91c1c"}
              fontFamily="monospace"
            >
              {activeOpt.mass} kg (3m)
            </text>
          </g>

          {/* Digital Torque Readout Overlay */}
          <text x="90" y="152" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669" fontFamily="monospace">
            Left: 36 N·m
          </text>
          <text x="310" y="152" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeOpt.tilt === 0 ? "#7c3aed" : "#ef4444"} fontFamily="monospace">
            Right: {activeOpt.torque} N·m
          </text>
        </svg>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Counterweight Mass:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt)}
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
                  <div>
                    <div className="text-sm font-black font-mono">{opt.val}</div>
                    <div className="text-[11px] text-slate-500 font-sans font-normal mt-0.5">{opt.desc}</div>
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

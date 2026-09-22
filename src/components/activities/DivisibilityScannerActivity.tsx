"use client";

import React, { useState } from "react";
import { Rocket, CheckCircle2, Play, Gauge, ShieldAlert } from "lucide-react";

interface DivisibilityScannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function DivisibilityScannerActivity({
  value,
  onChange,
  readOnly = false,
}: DivisibilityScannerActivityProps) {
  // Question 35: Educational Physics Simulation: Adjust the launch velocity parameter to reach the target orbital altitude of 250 km.
  // Use the slider or keypad to set the velocity to exactly 2500 m/s and trigger the simulation.
  // Options:
  // A: 2000 m/s (Reaches 160 km - Suborbital)
  // B: 2500 m/s (Reaches 250 km - Target Orbital Altitude!) -> Correct Option B
  // C: 3000 m/s (Reaches 360 km - Escape Overthrust)
  // D: 1500 m/s (Reaches 90 km - Inadequate Thrust)

  const options = [
    { id: "A", val: "2000 m/s", num: 2000, alt: "160 km", status: "Suborbital Drop", isTarget: false },
    { id: "B", val: "2500 m/s", num: 2500, alt: "250 km", status: "Stable Orbital Lock (TARGET)", isTarget: true },
    { id: "C", val: "3000 m/s", num: 3000, alt: "360 km", status: "Over-altitude Drift", isTarget: false },
    { id: "D", val: "1500 m/s", num: 1500, alt: "90 km", status: "Atmospheric Fall", isTarget: false },
  ];

  const getInitialVelocity = () => {
    if (!value) return 2500;
    const num = Number(value);
    if (!isNaN(num) && num >= 500 && num <= 3500) return num;
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.num : 2500;
  };

  const [velocity, setVelocity] = useState<number>(getInitialVelocity());
  const [selectedId, setSelectedId] = useState<string>(
    options.find((o) => o.num === getInitialVelocity())?.id || "B"
  );
  const [isLaunched, setIsLaunched] = useState<boolean>(true);

  const calculateAltitude = (v: number) => {
    // 2500 m/s corresponds to 250 km
    return Math.round((v / 2500) * (v / 2500) * 250);
  };

  const currentAlt = calculateAltitude(velocity);
  const isTargetAchieved = Math.abs(currentAlt - 250) <= 10;

  const handleVelocityChange = (v: number) => {
    if (readOnly) return;
    setVelocity(v);
    const matched = options.find((o) => Math.abs(o.num - v) < 200);
    if (matched) {
      setSelectedId(matched.id);
      onChange(matched.id);
    } else {
      onChange(v);
    }
  };

  const handleSelectOption = (opt: typeof options[0]) => {
    if (readOnly) return;
    setVelocity(opt.num);
    setSelectedId(opt.id);
    onChange(opt.id);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Orbital Launch Physics Simulator (Q35)
            </h3>
            <p className="text-xs text-slate-600">
              Set launch thrust velocity to exactly <strong className="text-cyan-700 font-mono">2500 m/s</strong> to achieve stable <strong className="text-slate-900">250 km Low-Earth Orbit</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
            isTargetAchieved
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-amber-50 text-amber-900 border-amber-300"
          }`}>
            Telemetry: {velocity} m/s &rarr; {currentAlt} km {isTargetAchieved ? "🎯 LOCKED" : ""}
          </span>
        </div>
      </div>

      {/* Interactive Launch Trajectory Canvas */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* SVG Orbital Trajectory */}
        <div className="md:col-span-2 h-[190px] bg-white border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 360 180" className="w-full h-full select-none">
            {/* Atmosphere Gradient Bands */}
            <rect x="0" y="140" width="360" height="40" fill="#e0f2fe" opacity="0.6" />
            <line x1="0" y1="140" x2="360" y2="140" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3,3" />
            <text x="10" y="155" fontSize="8" fill="#0369a1" fontWeight="bold">Troposphere</text>

            {/* Target 250 km Orbit Corridor */}
            <rect x="0" y="45" width="360" height="20" fill="#d1fae5" opacity="0.4" />
            <line x1="0" y1="55" x2="360" y2="55" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="10" y="50" fontSize="9" fill="#047857" fontWeight="bold" fontFamily="monospace">
              TARGET ORBIT: 250 km CORRIDOR
            </text>

            {/* Earth Horizon Arc */}
            <path d="M -20,180 Q 180,165 380,180" fill="#0284c7" fillOpacity="0.1" stroke="#0284c7" strokeWidth="3" />
            <text x="180" y="176" textAnchor="middle" fontSize="9" fill="#0369a1" fontWeight="bold">
              EARTH SURFACE LAUNCH PAD
            </text>

            {/* Dynamic Rocket Trajectory Parabola */}
            {(() => {
              const apexY = Math.max(20, 160 - (currentAlt / 300) * 125);
              const pathD = `M 40,165 Q 160,${apexY} 320,${apexY + 15}`;
              return (
                <>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isTargetAchieved ? "#059669" : "#0284c7"}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Rocket Marker at Apex */}
                  <g transform={`translate(160, ${apexY})`}>
                    <circle r="7" fill={isTargetAchieved ? "#10b981" : "#0284c7"} stroke="#ffffff" strokeWidth="2" />
                    <text x="12" y="3" fontSize="10" fontWeight="bold" fill={isTargetAchieved ? "#047857" : "#0369a1"} fontFamily="monospace">
                      {currentAlt} km
                    </text>
                  </g>
                </>
              );
            })()}
          </svg>
        </div>

        {/* Throttle Controls */}
        <div className="space-y-3 font-mono text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-700 font-bold">
              <span>Velocity Slider:</span>
              <span className="text-cyan-800 text-sm font-black">{velocity} m/s</span>
            </div>
            <input
              type="range"
              min="500"
              max="3500"
              step="50"
              value={velocity}
              disabled={readOnly}
              onChange={(e) => handleVelocityChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>500 m/s</span>
              <span>2500 m/s (Target)</span>
              <span>3500 m/s</span>
            </div>
          </div>

          {/* Quick Velocity Presets */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Thrust Presets:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-left ${
                    selectedId === opt.id
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Target Launch Velocity:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectOption(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-cyan-50 border-cyan-600 text-cyan-950 shadow-sm ring-1 ring-cyan-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-black font-mono">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />}
                </div>
                <div className="mt-1">
                  <div className="text-[10px] text-slate-500 font-mono">Option {opt.id} ({opt.alt})</div>
                  <div className="text-[10px] text-slate-400 truncate">{opt.status}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

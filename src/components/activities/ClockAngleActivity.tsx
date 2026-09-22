"use client";

import React, { useState } from "react";
import { Clock,  CheckCircle2, RotateCw } from "lucide-react";

interface ClockAngleActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ClockAngleActivity({
  value,
  onChange,
  readOnly = false }: ClockAngleActivityProps) {
  const options = [
    {
      id: "A",
      time: "4:40",
      hourAngle: 140,
      minAngle: 240,
      angleDiff: 100,
      type: "Obtuse Angle (100°)",
      desc: "Smallest angle between hands = 240° - 140° = 100°",
      isObtuse: true },
    {
      id: "B",
      time: "3:00",
      hourAngle: 90,
      minAngle: 0,
      angleDiff: 90,
      type: "Right Angle (90°)",
      desc: "Exact perpendicular right angle",
      isObtuse: false },
    {
      id: "C",
      time: "2:00",
      hourAngle: 60,
      minAngle: 0,
      angleDiff: 60,
      type: "Acute Angle (60°)",
      desc: "Angle < 90°",
      isObtuse: false },
    {
      id: "D",
      time: "6:00",
      hourAngle: 180,
      minAngle: 0,
      angleDiff: 180,
      type: "Straight Angle (180°)",
      desc: "Hands in a straight continuous line",
      isObtuse: false },
  ];

  const initialOpt =
    options.find((o) => o.id === value || o.time === value) || options[0];

  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);

  const activeOpt = options.find((o) => o.id === selectedId) || options[0];

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  // Convert angles to radian cartesian endpoints
  const hourRad = ((activeOpt.hourAngle - 90) * Math.PI) / 180;
  const hx = 100 + 46 * Math.cos(hourRad);
  const hy = 100 + 46 * Math.sin(hourRad);

  const minRad = ((activeOpt.minAngle - 90) * Math.PI) / 180;
  const mx = 100 + 68 * Math.cos(minRad);
  const my = 100 + 68 * Math.sin(minRad);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Clock Tower Interactive Laboratory 
            </h3>
            <p className="text-xs text-slate-600">
              Select or test clock configurations to inspect the angle formed between hands.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200">
          Target: Obtuse Angle (90° &lt; &theta; &lt; 180°)
        </div>
      </div>

      {/* Dynamic Geared Clock Simulator */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center gap-8 flex-wrap">
        <div className="relative cursor-pointer select-none">
          <svg viewBox="0 0 200 200" className="w-52 h-52">
            {/* Dial Background */}
            <circle cx="100" cy="100" r="90" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="100" cy="100" r="85" fill="#f8fafc" />

            {/* Hour Numbers */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 100 + 70 * Math.sin(angle);
              const y = 100 - 70 * Math.cos(angle);
              return (
                <text
                  key={h}
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {h}
                </text>
              );
            })}

            {/* Angle Sector Arc */}
            <path
              d={`M 100 100 L ${hx} ${hy} A 45 45 0 0 ${activeOpt.hourAngle > activeOpt.minAngle ? 0 : 1} ${mx} ${my} Z`}
              fill={activeOpt.isObtuse ? "#f59e0b" : "#38bdf8"}
              fillOpacity="0.25"
              stroke={activeOpt.isObtuse ? "#d97706" : "#0284c7"}
              strokeWidth="1.5"
            />

            {/* Minute Hand (Sky Blue) */}
            <line
              x1="100"
              y1="100"
              x2={mx}
              y2={my}
              stroke="#0284c7"
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Hour Hand (Amber) */}
            <line
              x1="100"
              y1="100"
              x2={hx}
              y2={hy}
              stroke="#d97706"
              strokeWidth="5.5"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Center Cap */}
            <circle cx="100" cy="100" r="6" fill="#0f172a" />
          </svg>
        </div>

        {/* Live Mathematical Angle Telemetry */}
        <div className="space-y-3 font-mono text-xs max-w-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 font-bold block">Current Simulation State:</span>
            <div className="text-2xl font-black text-slate-900 font-sans">{activeOpt.time}</div>
            <div className="text-slate-600 font-mono">
              Hour: <strong className="text-amber-700">{activeOpt.hourAngle}°</strong> | Minute:{" "}
              <strong className="text-sky-700">{activeOpt.minAngle}°</strong>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border font-bold ${
              activeOpt.isObtuse
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-slate-100 border-slate-300 text-slate-700"
            }`}
          >
            <div className="text-sm font-black flex items-center justify-between">
              <span>Angle: {activeOpt.angleDiff}°</span>
              <span>{activeOpt.type}</span>
            </div>
            <p className="text-[11px] font-sans font-normal mt-1">{activeOpt.desc}</p>
          </div>
        </div>
      </div>

      {/* Interactive Options Selector Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Option to Synchronize Clock Hands:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-amber-50 border-amber-500 text-amber-950 shadow-md shadow-amber-500/10 scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="text-lg font-black font-mono">{opt.time}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-mono">{opt.type}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

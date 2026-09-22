"use client";

import React, { useState } from "react";
import { Network, CheckCircle2, ShieldCheck } from "lucide-react";

interface MeasurementWorkshopActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function MeasurementWorkshopActivity({
  value,
  onChange,
  readOnly = false,
}: MeasurementWorkshopActivityProps) {
  // Question 34: Using the polygon diagonal formula n(n − 3)/2, enter the total number of diagonals in a regular 8-sided polygon (octagon).
  // n = 8 => Diagonals = 8 × (8 − 3) / 2 = (8 × 5) / 2 = 20 diagonals (Option B)

  const options = [
    { id: "A", val: "16", num: 16, label: "16 Diagonals", desc: "Underestimated diagonal network" },
    { id: "B", val: "20", num: 20, label: "20 Diagonals", desc: "Formula: 8 × (8 − 3) / 2 = 40 / 2 = 20", isCorrect: true },
    { id: "C", val: "24", num: 24, label: "24 Diagonals", desc: "Overcounted chords" },
    { id: "D", val: "28", num: 28, label: "28 Diagonals", desc: "Includes outer boundary segments" },
  ];

  const getInitial = () => {
    if (!value) return "B";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.id : "B";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const [activeVertex, setActiveVertex] = useState<number | null>(0);

  // Generate 8 regular octagon vertex coordinates
  const radius = 75;
  const centerX = 150;
  const centerY = 100;
  const vertices = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 8 - Math.PI / 8;
    return {
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      label: `V${i + 1}`,
    };
  });

  // Generate all 20 non-adjacent internal diagonal pairs
  const diagonals: { p1: typeof vertices[0]; p2: typeof vertices[0] }[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = i + 2; j < 8; j++) {
      if (i === 0 && j === 7) continue; // adjacent edge
      diagonals.push({ p1: vertices[i], p2: vertices[j] });
    }
  }

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  const handleVertexClick = (idx: number) => {
    if (readOnly) return;
    setActiveVertex(idx);
    handleSelect("B");
  };

  const activeOpt = options.find((o) => o.id === selectedId) || options[1];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Octagon Polygon & Diagonal Surveyor (Q34)
            </h3>
            <p className="text-xs text-slate-600">
              Interactive 8-gon: Apply <span className="font-mono font-bold text-emerald-700">d = n(n − 3)/2</span> to calculate all internal non-adjacent diagonals.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300">
          Evaluated Diagonals: <span className="text-emerald-700 font-black">20 Chords</span>
        </div>
      </div>

      {/* Interactive Octagon Canvas */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* SVG Octagon */}
        <div className="w-full max-w-[300px] h-[200px] flex items-center justify-center">
          <svg viewBox="0 0 300 200" className="w-full h-full select-none cursor-pointer">
            {/* Draw 20 internal diagonal chords */}
            {diagonals.map((d, idx) => {
              const isHighlighted =
                activeVertex !== null &&
                (d.p1.id === activeVertex || d.p2.id === activeVertex);
              return (
                <line
                  key={idx}
                  x1={d.p1.x}
                  y1={d.p1.y}
                  x2={d.p2.x}
                  y2={d.p2.y}
                  stroke={isHighlighted ? "#059669" : "#a7f3d0"}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? "none" : "2,2"}
                />
              );
            })}

            {/* Draw Outer 8-Gon Perimeter */}
            <polygon
              points={vertices.map((v) => `${v.x},${v.y}`).join(" ")}
              fill="#ecfdf5"
              fillOpacity="0.7"
              stroke="#059669"
              strokeWidth="3"
            />

            {/* Draw 8 Clickable Vertices */}
            {vertices.map((v) => {
              const isActive = activeVertex === v.id;
              return (
                <g key={v.id} onClick={() => handleVertexClick(v.id)} className="cursor-pointer">
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={isActive ? 8 : 6}
                    fill={isActive ? "#047857" : "#10b981"}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={v.x + (v.x > centerX ? 10 : -10)}
                    y={v.y + (v.y > centerY ? 10 : -6)}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#065f46"
                    textAnchor={v.x > centerX ? "start" : "end"}
                    fontFamily="monospace"
                  >
                    {v.label}
                  </text>
                </g>
              );
            })}

            {/* Central Badge */}
            <circle cx={centerX} cy={centerY} r="22" fill="#ffffff" stroke="#059669" strokeWidth="2" />
            <text
              x={centerX}
              y={centerY - 2}
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#065f46"
              fontFamily="monospace"
            >
              20
            </text>
            <text
              x={centerX}
              y={centerY + 9}
              textAnchor="middle"
              fontSize="7"
              fontWeight="bold"
              fill="#047857"
              fontFamily="sans-serif"
            >
              DIAGONALS
            </text>
          </svg>
        </div>

        {/* Formula breakdown & verification box */}
        <div className="flex-1 w-full space-y-2 font-mono text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Mathematical Deduction:
            </div>
            <div className="text-sm font-bold text-slate-800">
              Polygon Sides (<span className="text-emerald-700">n</span>) = 8 (Regular Octagon)
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
              Diagonals = <span className="font-bold text-emerald-700">8 &times; (8 &minus; 3) / 2</span> = (8 &times; 5) / 2 = <span className="font-bold text-emerald-700 text-sm">20</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Click on any vertex to highlight the 5 internal diagonals originating from it.
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Calculated Diagonal Count:
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
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-black font-mono">{opt.val}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <div className="mt-1">
                  <div className="text-[10px] text-slate-500 font-mono">Option {opt.id}</div>
                  <div className="text-[10px] text-slate-400 truncate">{opt.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

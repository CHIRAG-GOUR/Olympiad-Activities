"use client";

import React, { useState, useEffect } from "react";
import { Compass, CheckCircle2, Navigation } from "lucide-react";

interface ExplorerNavActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ExplorerNavActivity({
  value,
  onChange,
  readOnly = false,
}: ExplorerNavActivityProps) {
  const [currentStep, setCurrentStep] = useState(4); // default completed view
  const options = [
    { id: "A", val: "North-West", label: "North-West (NW)", angle: -45, desc: "Displacement: -95m West, +40m North", isCorrect: true },
    { id: "B", val: "South-East", label: "South-East (SE)", angle: 135, desc: "+95m East, -40m South", isCorrect: false },
    { id: "C", val: "South", label: "South (S)", angle: 180, desc: "Direct downward vector", isCorrect: false },
    { id: "D", val: "North-East", label: "North-East (NE)", angle: 45, desc: "+95m East, +40m North", isCorrect: false },
  ];

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.val === value)?.id || "A") : ""
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

  const selectedOpt = options.find((o) => o.id === selectedId);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Explorer Navigation Mission
            </h3>
            <p className="text-xs text-slate-600">
              Click Rajesh's destination or the compass directions on the map to choose the bearing.
            </p>
          </div>
        </div>

        {/* Playback step controller */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev > 1 ? prev - 1 : 1))}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold text-slate-700 cursor-pointer"
          >
            Prev Step
          </button>
          <span className="text-xs font-mono text-emerald-800 font-bold px-2">
            Step {currentStep} of 4
          </span>
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev < 4 ? prev + 1 : 4))}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold text-slate-700 cursor-pointer"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Interactive Cartography Map Canvas */}
      <div className="relative h-72 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 400 260" className="w-full h-full max-w-md select-none">
          {/* Compass grid lines */}
          <line x1="200" y1="20" x2="200" y2="240" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="40" y1="140" x2="360" y2="140" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="200" cy="140" r="100" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="200" cy="140" r="60" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Compass Cardinal Points */}
          <text x="200" y="24" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">N</text>
          <text x="200" y="252" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">S</text>
          <text x="375" y="144" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">E</text>
          <text x="25" y="144" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">W</text>

          {/* Interactive Quadrant Click Zones */}
          {/* North-West Quadrant (Target Zone) */}
          <g className="cursor-pointer" onClick={() => handleSelect(options[0])}>
            <rect x="50" y="30" width="140" height="100" fill={selectedId === "A" ? "#d1fae5" : "transparent"} opacity="0.4" rx="8" />
            <text x="110" y="60" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="bold">NW ZONE (A)</text>
          </g>

          {/* North-East Quadrant */}
          <g className="cursor-pointer" onClick={() => handleSelect(options[3])}>
            <rect x="210" y="30" width="140" height="100" fill={selectedId === "D" ? "#d1fae5" : "transparent"} opacity="0.4" rx="8" />
            <text x="280" y="60" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">NE ZONE (D)</text>
          </g>

          {/* South-East Quadrant */}
          <g className="cursor-pointer" onClick={() => handleSelect(options[1])}>
            <rect x="210" y="150" width="140" height="90" fill={selectedId === "B" ? "#d1fae5" : "transparent"} opacity="0.4" rx="8" />
            <text x="280" y="210" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">SE ZONE (B)</text>
          </g>

          {/* South Zone */}
          <g className="cursor-pointer" onClick={() => handleSelect(options[2])}>
            <rect x="150" y="190" width="100" height="60" fill={selectedId === "C" ? "#d1fae5" : "transparent"} opacity="0.4" rx="8" />
            <text x="200" y="235" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">S ZONE (C)</text>
          </g>

          {/* Start Point (200, 180) */}
          <circle cx="200" cy="180" r="7" fill="#059669" stroke="#ffffff" strokeWidth="2" />
          <text x="214" y="185" fill="#059669" fontSize="11" fontWeight="bold">START (0,0)</text>

          {/* Segment 1: 70m North -> (200, 110) */}
          {currentStep >= 1 && (
            <path d="M 200 180 L 200 110" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Segment 2: 70m West -> (130, 110) */}
          {currentStep >= 2 && (
            <path d="M 200 110 L 130 110" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Segment 3: 30m South -> (130, 140) */}
          {currentStep >= 3 && (
            <path d="M 130 110 L 130 140" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Segment 4: 25m West -> (105, 140) */}
          {currentStep >= 4 && (
            <path d="M 130 140 L 105 140" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Final Position & Relative Vector Needle */}
          {currentStep >= 4 && (
            <g className="cursor-pointer" onClick={() => handleSelect(options[0])}>
              {/* Direct bearing line from start to finish */}
              <line x1="200" y1="180" x2="105" y2="140" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 4" />
              <circle cx="105" cy="140" r="9" fill="#e11d48" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
              <text x="50" y="130" fill="#e11d48" fontSize="12" fontWeight="bold">
                RAJESH (NW) ✓
              </text>
            </g>
          )}
        </svg>

        {/* Live Vector Telemetry */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-700 shadow-xs">
          Displacement: -95m West, +40m North → <span className="text-emerald-700 font-bold">North-West (Opt A)</span>
        </div>
      </div>

      {/* Direction Selection Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          What is Rajesh's final direction with respect to START?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((dir) => {
            const isSelected = selectedId === dir.id;
            return (
              <button
                key={dir.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(dir)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {dir.id}
                    </span>
                    <span className="text-base font-black">{dir.val}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-2 line-clamp-1">{dir.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

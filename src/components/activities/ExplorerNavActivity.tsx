"use client";

import React, { useState } from "react";
import { Compass, Play, RotateCcw, CheckCircle2, Navigation } from "lucide-react";

interface ExplorerNavActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function ExplorerNavActivity({
  value,
  onChange,
  readOnly = false }: ExplorerNavActivityProps) {
  const [currentStep, setCurrentStep] = useState(4); // default completed view
  const [selectedDirection, setSelectedDirection] = useState<string>(
    value ? String(value) : ""
  );

  const steps = [
    { label: "Start at Origin (0,0)", dx: 0, dy: 0 },
    { label: "Step 1: Walk 70m North (0, +70)", dx: 0, dy: -70 },
    { label: "Step 2: Turn Left (West) & Walk 70m (-70, +70)", dx: -70, dy: -70 },
    { label: "Step 3: Turn Left (South) & Walk 30m (-70, +40)", dx: -70, dy: -40 },
    { label: "Step 4: Turn Right (West) & Walk 25m (-95, +40)", dx: -95, dy: -40 },
  ];

  const directions = [
    { id: "A", val: "North-West", label: "North-West (NW)", angle: -45 },
    { id: "B", val: "South-East", label: "South-East (SE)", angle: 135 },
    { id: "C", val: "South", label: "South (S)", angle: 180 },
    { id: "D", val: "North-East", label: "North-East (NE)", angle: 45 },
  ];

  const handleSelect = (dir: string) => {
    if (readOnly) return;
    setSelectedDirection(dir);
    onChange(dir);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-800">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-700 flex items-center gap-2">
              Explorer Navigation Mission
            </h3>
            <p className="text-xs text-slate-600">
              Trace Rajesh's exact path from origin to determine final bearing.
            </p>
          </div>
        </div>

        {/* Playback step controller */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev > 1 ? prev - 1 : 1))}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 hover:bg-slate-100 border border-slate-200 rounded text-xs"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-amber-800 font-bold px-2">
            Step {currentStep} of 4
          </span>
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev < 4 ? prev + 1 : 4))}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 hover:bg-slate-100 border border-slate-200 rounded text-xs"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Interactive Cartography Map Canvas */}
      <div className="relative h-72 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        {/* Radar concentric circles */}
        <svg viewBox="0 0 400 260" className="w-full h-full max-w-md select-none">
          {/* Compass grid lines */}
          <line x1="200" y1="20" x2="200" y2="240" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="130" x2="360" y2="130" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="200" cy="130" r="100" fill="none" stroke="#1e293b" strokeWidth="1" />
          <circle cx="200" cy="130" r="60" fill="none" stroke="#1e293b" strokeWidth="1" />

          {/* Compass labels */}
          <text x="200" y="25" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">N</text>
          <text x="200" y="250" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">S</text>
          <text x="375" y="134" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">E</text>
          <text x="25" y="134" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">W</text>

          {/* Path rendering (Origin: 200, 180) */}
          {/* Start Point */}
          <circle cx="200" cy="180" r="6" fill="#10b981" />
          <text x="215" y="185" fill="#34d399" fontSize="11" fontWeight="bold">START (0,0)</text>

          {/* Segment 1: 70m North -> (200, 110) */}
          {currentStep >= 1 && (
            <path
              d="M 200 180 L 200 110"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Segment 2: 70m West -> (130, 110) */}
          {currentStep >= 2 && (
            <path
              d="M 200 110 L 130 110"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Segment 3: 30m South -> (130, 140) */}
          {currentStep >= 3 && (
            <path
              d="M 130 110 L 130 140"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Segment 4: 25m West -> (105, 140) */}
          {currentStep >= 4 && (
            <path
              d="M 130 140 L 105 140"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Final Position & Relative Vector Needle */}
          {currentStep >= 4 && (
            <>
              {/* Direct bearing line from start to finish */}
              <line
                x1="200"
                y1="180"
                x2="105"
                y2="140"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle cx="105" cy="140" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="75" y="130" fill="#f87171" fontSize="12" fontWeight="bold">
                RAJESH (NW)
              </text>
            </>
          )}
        </svg>

        {/* Live Vector Telemetry */}
        <div className="absolute bottom-3 left-3 bg-white border border-slate-200/80 px-3 py-1 rounded text-[11px] font-mono text-slate-700">
          Displacement: -95m West, +40m North → <span className="text-amber-800 font-bold">North-West</span>
        </div>
      </div>

      {/* Direction Selection Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          What is Rajesh's final direction with respect to START?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {directions.map((dir) => {
            const isSelected =
              selectedDirection === dir.val ||
              selectedDirection === dir.id ||
              selectedDirection.toLowerCase().includes(dir.val.toLowerCase());
            return (
              <button
                key={dir.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(dir.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-400 text-amber-800 shadow-lg shadow-amber-500/20 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black">{dir.val}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-800" />}
                </div>
                <span className="text-[10px] text-slate-600 font-mono mt-2">Option {dir.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

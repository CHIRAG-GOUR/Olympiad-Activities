"use client";

import React, { useState } from "react";
import { Filter, CheckCircle2, Shield, Heart, User, Sparkles } from "lucide-react";

interface VennScannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function VennScannerActivity({
  value,
  onChange,
  readOnly = false,
}: VennScannerActivityProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(value ? String(value) : "");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "TARGET">("TARGET");

  // Regions from the question:
  // Square = Soldiers, Circle = Females, Triangle = Married
  // Region 7: Soldiers & Females ONLY (Outside Married Triangle) -> Unmarried Female Soldiers!
  // Region 5: All Three
  // Region 4: Married Soldiers (Inside Square & Triangle)
  // Region 9: Married Females (Inside Circle & Triangle)
  const regions = [
    { id: "7", label: "Region 7", desc: "Soldier + Female (Unmarried)", isTarget: true },
    { id: "5", label: "Region 5", desc: "Soldier + Female + Married", isTarget: false },
    { id: "4", label: "Region 4", desc: "Soldier + Married (Male)", isTarget: false },
    { id: "9", label: "Region 9", desc: "Female + Married (Non-Soldier)", isTarget: false },
  ];

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedRegion(val);
    onChange(val);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 border border-sky-400/40 rounded-lg text-sky-400">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-sky-700 flex items-center gap-2">
              Personnel Classification Scanner <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-600">
              Filter: <span className="text-emerald-400 font-bold">+SOLDIER</span> +{" "}
              <span className="text-pink-400 font-bold">+FEMALE</span> -{" "}
              <span className="text-amber-400 font-bold">-MARRIED</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Venn Diagram Canvas */}
      <div className="relative h-72 bg-slate-50 border border-slate-200 border border-slate-200 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 500 320" className="w-full h-full max-w-lg select-none">
          <defs>
            <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Square: Soldiers (Blue) */}
          <rect
            x="60"
            y="50"
            width="220"
            height="200"
            rx="12"
            fill="#0284c7"
            fillOpacity="0.2"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          <text x="75" y="80" fill="#38bdf8" fontSize="13" fontWeight="bold">
            ■ Soldiers (Square)
          </text>

          {/* Circle: Females (Pink) */}
          <circle
            cx="300"
            cy="150"
            r="110"
            fill="#ec4899"
            fillOpacity="0.2"
            stroke="#f472b6"
            strokeWidth="3"
          />
          <text x="310" y="80" fill="#f472b6" fontSize="13" fontWeight="bold">
            ● Females (Circle)
          </text>

          {/* Triangle: Married (Amber) */}
          <polygon
            points="230,20 130,280 330,280"
            fill="#f59e0b"
            fillOpacity="0.2"
            stroke="#fbbf24"
            strokeWidth="3"
          />
          <text x="230" y="45" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">
            ▲ Married (Triangle)
          </text>

          {/* Region 7 (Soldiers ∩ Females \ Married) -> The Target Zone! */}
          <g
            className="cursor-pointer transition hover:opacity-80"
            onClick={() => handleSelect("7")}
          >
            <ellipse
              cx="205"
              cy="105"
              rx="30"
              ry="24"
              fill={selectedRegion === "7" ? "#10b981" : "#0f172a"}
              fillOpacity={selectedRegion === "7" ? 0.8 : 0.6}
              stroke={selectedRegion === "7" ? "#34d399" : "#64748b"}
              strokeWidth={selectedRegion === "7" ? "3" : "1.5"}
            />
            <text
              x="205"
              y="112"
              textAnchor="middle"
              fill={selectedRegion === "7" ? "#ffffff" : "#38bdf8"}
              fontSize="20"
              fontWeight="900"
            >
              7
            </text>
          </g>

          {/* Region 5 (All Three Center) */}
          <g
            className="cursor-pointer transition hover:opacity-80"
            onClick={() => handleSelect("5")}
          >
            <circle
              cx="230"
              cy="165"
              r="22"
              fill={selectedRegion === "5" ? "#10b981" : "#0f172a"}
              fillOpacity={selectedRegion === "5" ? 0.8 : 0.6}
              stroke={selectedRegion === "5" ? "#34d399" : "#64748b"}
              strokeWidth={selectedRegion === "5" ? "3" : "1.5"}
            />
            <text
              x="230"
              y="172"
              textAnchor="middle"
              fill={selectedRegion === "5" ? "#ffffff" : "#e2e8f0"}
              fontSize="18"
              fontWeight="bold"
            >
              5
            </text>
          </g>

          {/* Region 4 (Soldiers ∩ Married) */}
          <g
            className="cursor-pointer transition hover:opacity-80"
            onClick={() => handleSelect("4")}
          >
            <circle
              cx="165"
              cy="200"
              r="20"
              fill={selectedRegion === "4" ? "#10b981" : "#0f172a"}
              fillOpacity={selectedRegion === "4" ? 0.8 : 0.6}
              stroke={selectedRegion === "4" ? "#34d399" : "#64748b"}
              strokeWidth={selectedRegion === "4" ? "3" : "1.5"}
            />
            <text
              x="165"
              y="207"
              textAnchor="middle"
              fill={selectedRegion === "4" ? "#ffffff" : "#e2e8f0"}
              fontSize="18"
              fontWeight="bold"
            >
              4
            </text>
          </g>

          {/* Region 9 (Females ∩ Married) */}
          <g
            className="cursor-pointer transition hover:opacity-80"
            onClick={() => handleSelect("9")}
          >
            <circle
              cx="295"
              cy="200"
              r="20"
              fill={selectedRegion === "9" ? "#10b981" : "#0f172a"}
              fillOpacity={selectedRegion === "9" ? 0.8 : 0.6}
              stroke={selectedRegion === "9" ? "#34d399" : "#64748b"}
              strokeWidth={selectedRegion === "9" ? "3" : "1.5"}
            />
            <text
              x="295"
              y="207"
              textAnchor="middle"
              fill={selectedRegion === "9" ? "#ffffff" : "#e2e8f0"}
              fontSize="18"
              fontWeight="bold"
            >
              9
            </text>
          </g>
        </svg>
      </div>

      {/* Region Picker Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {regions.map((reg) => {
          const isSelected = selectedRegion === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelect(reg.id)}
              className={`p-3 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-800 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-slate-50 border border-slate-200 border-slate-200/80 text-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{reg.id}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[11px] text-slate-600 mt-1">{reg.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Filter, CheckCircle2, Shield, Heart, User } from "lucide-react";

interface VennScannerActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function VennScannerActivity({
  value,
  onChange,
  readOnly = false }: VennScannerActivityProps) {
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
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-700">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Personnel Classification Scanner
            </h3>
            <p className="text-xs text-slate-600">
              Filter target: <span className="text-emerald-700 font-bold">+SOLDIER</span> +{" "}
              <span className="text-pink-600 font-bold">+FEMALE</span> -{" "}
              <span className="text-amber-700 font-bold">-MARRIED</span>
            </p>
          </div>
        </div>

        {/* Quick Region Presets */}
        <div className="flex items-center gap-2">
          {regions.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => handleSelect(reg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === reg.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Region {reg.id}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Venn Diagram Canvas */}
      <div className="relative h-72 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 500 320" className="w-full h-full max-w-lg select-none">
          {/* Square: Soldiers (Blue) */}
          <rect
            x="60"
            y="50"
            width="220"
            height="200"
            rx="12"
            fill="#e0f2fe"
            fillOpacity="0.6"
            stroke="#0284c7"
            strokeWidth="3"
          />
          <text x="75" y="80" fill="#0369a1" fontSize="13" fontWeight="bold">
            ■ Soldiers (Square)
          </text>

          {/* Circle: Females (Pink) */}
          <circle
            cx="300"
            cy="150"
            r="110"
            fill="#fce7f3"
            fillOpacity="0.6"
            stroke="#db2777"
            strokeWidth="3"
          />
          <text x="310" y="80" fill="#be185d" fontSize="13" fontWeight="bold">
            ● Females (Circle)
          </text>

          {/* Triangle: Married (Amber) */}
          <polygon
            points="230,20 130,280 330,280"
            fill="#fef3c7"
            fillOpacity="0.6"
            stroke="#d97706"
            strokeWidth="3"
          />
          <text x="230" y="45" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="bold">
            ▲ Married (Triangle)
          </text>

          {/* Region 7 (Soldiers ∩ Females \ Married) -> The Target Zone! */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleSelect("7")}
          >
            <ellipse
              cx="205"
              cy="105"
              rx="30"
              ry="24"
              fill={selectedRegion === "7" ? "#059669" : "#ffffff"}
              stroke={selectedRegion === "7" ? "#047857" : "#0284c7"}
              strokeWidth={selectedRegion === "7" ? "3.5" : "2"}
              className="shadow-sm"
            />
            <text
              x="205"
              y="113"
              textAnchor="middle"
              fill={selectedRegion === "7" ? "#ffffff" : "#0369a1"}
              fontSize="20"
              fontWeight="900"
            >
              7
            </text>
          </g>

          {/* Region 5 (All Three Center) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleSelect("5")}
          >
            <circle
              cx="230"
              cy="165"
              r="22"
              fill={selectedRegion === "5" ? "#059669" : "#ffffff"}
              stroke={selectedRegion === "5" ? "#047857" : "#d97706"}
              strokeWidth={selectedRegion === "5" ? "3" : "2"}
            />
            <text
              x="230"
              y="172"
              textAnchor="middle"
              fill={selectedRegion === "5" ? "#ffffff" : "#334155"}
              fontSize="18"
              fontWeight="bold"
            >
              5
            </text>
          </g>

          {/* Region 4 (Soldiers ∩ Married) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleSelect("4")}
          >
            <circle
              cx="165"
              cy="200"
              r="20"
              fill={selectedRegion === "4" ? "#059669" : "#ffffff"}
              stroke={selectedRegion === "4" ? "#047857" : "#0284c7"}
              strokeWidth={selectedRegion === "4" ? "3" : "2"}
            />
            <text
              x="165"
              y="207"
              textAnchor="middle"
              fill={selectedRegion === "4" ? "#ffffff" : "#334155"}
              fontSize="18"
              fontWeight="bold"
            >
              4
            </text>
          </g>

          {/* Region 9 (Females ∩ Married) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleSelect("9")}
          >
            <circle
              cx="295"
              cy="200"
              r="20"
              fill={selectedRegion === "9" ? "#059669" : "#ffffff"}
              stroke={selectedRegion === "9" ? "#047857" : "#db2777"}
              strokeWidth={selectedRegion === "9" ? "3" : "2"}
            />
            <text
              x="295"
              y="207"
              textAnchor="middle"
              fill={selectedRegion === "9" ? "#ffffff" : "#334155"}
              fontSize="18"
              fontWeight="bold"
            >
              9
            </text>
          </g>
        </svg>

        <div
          onClick={() => handleSelect("7")}
          className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-700 shadow-xs cursor-pointer hover:bg-emerald-50"
        >
          TARGET REGION: 7 (Unmarried Female Soldiers - Click to Select)
        </div>
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
              className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.02]"
                  : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                    {reg.id}
                  </span>
                  <span className="text-xl font-black font-mono">Region {reg.id}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">{reg.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

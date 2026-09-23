"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Crosshair, CheckCircle2 } from "lucide-react";

interface HotspotQuestionProps {
  question: Question;
  value?: string[] | string;
  onChange: (val: string[] | string) => void;
  readOnly?: boolean;
}

export function HotspotQuestion({ question, value, onChange, readOnly = false }: HotspotQuestionProps) {
  const config = question.hotspotConfig;
  const hotspots = config?.hotspots || [];
  const maxSelections = config?.maxSelections || 1;

  const [selectedSpots, setSelectedSpots] = useState<string[]>(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value) return [value];
    return [];
  });

  useEffect(() => {
    if (Array.isArray(value)) setSelectedSpots(value);
    else if (typeof value === "string" && value) setSelectedSpots([value]);
    else if (!value) setSelectedSpots([]);
  }, [value]);

  const handleSpotClick = (spotId: string) => {
    if (readOnly) return;
    let next: string[];
    if (selectedSpots.includes(spotId)) {
      next = selectedSpots.filter((id) => id !== spotId);
    } else {
      if (maxSelections === 1) {
        next = [spotId];
      } else {
        next = [...selectedSpots, spotId];
      }
    }
    setSelectedSpots(next);
    onChange(maxSelections === 1 ? next[0] || "" : next);
  };

  return (
    <div className="space-y-6">
      {config?.instruction && (
        <div className="p-4 bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-xl text-[14px] text-[#92400E] font-extrabold flex items-center gap-2.5">
          <Crosshair className="w-5 h-5 text-[#D97706] flex-shrink-0" />
          <span>{config.instruction}</span>
        </div>
      )}

      {/* Interactive Diagram Canvas */}
      <div className="relative w-full max-w-3xl mx-auto bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-6 shadow-md select-none">
        <div className="relative w-full aspect-[16/9] bg-[#FEFCE8] rounded-xl border-2 border-[#FDE68A] flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon
              points="20,75 50,25 80,75"
              fill="#FEF3C7"
              stroke="#2563A8"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <line x1="50" y1="25" x2="50" y2="75" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3,3" />
            <line x1="20" y1="75" x2="80" y2="75" stroke="#2563A8" strokeWidth="2.2" />

            <path d="M 44,36 A 12,12 0 0,0 58,35" fill="none" stroke="#D9534F" strokeWidth="1.5" />
            <text x="46" y="19" fontSize="5" fill="#2563A8" fontWeight="900">
              Vertex B (125°)
            </text>
            <text x="12" y="83" fontSize="5" fill="#2563A8" fontWeight="900">
              Vertex A (50°)
            </text>
            <text x="82" y="83" fontSize="5" fill="#2563A8" fontWeight="900">
              Vertex C (65°)
            </text>
            <text x="52" y="70" fontSize="4.5" fill="#92400E" fontWeight="bold">
              Altitude Base O (90°)
            </text>
          </svg>

          {/* Clickable Hotspot Targets */}
          {hotspots.map((spot) => {
            const isSelected = selectedSpots.includes(spot.id);

            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => handleSpotClick(spot.id)}
                disabled={readOnly}
                style={{
                  left: `${spot.xPercent}%`,
                  top: `${spot.yPercent}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#D9534F] text-white ring-6 ring-rose-200 shadow-xl scale-125 z-20"
                    : "bg-white border-2 border-[#F59E0B] text-[#D97706] hover:bg-[#2563A8] hover:text-white shadow-md hover:scale-110 z-10"
                }`}
                title={spot.label || `Hotspot ${spot.id}`}
              >
                {isSelected ? (
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                ) : (
                  <Crosshair className="w-6 h-6 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-[13px] text-slate-600 px-2 font-semibold">
          <span>Click directly on the target vertex coordinate</span>
          <span className="text-[#92400E] font-mono font-extrabold text-[14px] bg-[#FEF3C7] px-2.5 py-0.5 rounded-lg border border-[#FDE68A]">
            Selected: {selectedSpots.length} / {maxSelections}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Grid, RotateCcw } from "lucide-react";

interface GraphQuestionProps {
  question: Question;
  value?: { x: number; y: number }[];
  onChange: (val: { x: number; y: number }[]) => void;
  readOnly?: boolean;
}

export function GraphQuestion({ question, value, onChange, readOnly = false }: GraphQuestionProps) {
  const config = question.graphConfig;
  const minX = config?.gridMinX ?? 0;
  const maxX = config?.gridMaxX ?? 10;
  const minY = config?.gridMinY ?? 0;
  const maxY = config?.gridMaxY ?? 10;
  const step = config?.step ?? 1;

  const [points, setPoints] = useState<{ x: number; y: number }[]>(value || []);

  useEffect(() => {
    if (value) setPoints(value);
  }, [value]);

  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const padding = 38;
    const plotW = width - padding * 2;
    const plotH = height - padding * 2;

    if (clickX < padding || clickX > width - padding || clickY < padding || clickY > height - padding) {
      return;
    }

    const normX = (clickX - padding) / plotW;
    const normY = 1 - (clickY - padding) / plotH;

    const rawX = minX + normX * (maxX - minX);
    const rawY = minY + normY * (maxY - minY);

    const snappedX = Math.round(rawX / step) * step;
    const snappedY = Math.round(rawY / step) * step;

    const existingIdx = points.findIndex((p) => p.x === snappedX && p.y === snappedY);
    let next: { x: number; y: number }[];
    if (existingIdx >= 0) {
      next = points.filter((_, idx) => idx !== existingIdx);
    } else {
      if (config?.mode === "point" && config.targetPoints.length === 1) {
        next = [{ x: snappedX, y: snappedY }];
      } else {
        next = [...points, { x: snappedX, y: snappedY }];
      }
    }
    setPoints(next);
    onChange(next);
  };

  const handleClear = () => {
    if (readOnly) return;
    setPoints([]);
    onChange([]);
  };

  const xTicks = [];
  for (let x = minX; x <= maxX; x += step) xTicks.push(x);
  const yTicks = [];
  for (let y = minY; y <= maxY; y += step) yTicks.push(y);

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-[#92400E] font-extrabold flex items-center gap-2">
          <Grid className="w-5 h-5 text-[#D97706]" />
          Click Cartesian grid intersection points to plot coordinates
        </span>
        {!readOnly && points.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="h-[34px] px-3 bg-white border-2 border-[#FDE68A] hover:bg-rose-50 text-rose-600 text-[12px] font-bold rounded-xl flex items-center gap-1.5 shadow-subtle"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Points
          </button>
        )}
      </div>

      <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-5 shadow-md flex justify-center">
        <svg
          viewBox="0 0 380 380"
          className="w-full max-w-[360px] aspect-square cursor-crosshair select-none"
          onClick={handleGridClick}
        >
          {xTicks.map((x) => {
            const px = 38 + ((x - minX) / (maxX - minX)) * 304;
            return (
              <g key={`x-${x}`}>
                <line x1={px} y1={38} x2={px} y2={342} stroke="#FDE68A" strokeWidth="1.2" />
                <text x={px} y={360} fontSize="11" fill="#92400E" textAnchor="middle" fontWeight="bold">
                  {x}
                </text>
              </g>
            );
          })}

          {yTicks.map((y) => {
            const py = 342 - ((y - minY) / (maxY - minY)) * 304;
            return (
              <g key={`y-${y}`}>
                <line x1={38} y1={py} x2={342} y2={py} stroke="#FDE68A" strokeWidth="1.2" />
                <text x={26} y={py + 4} fontSize="11" fill="#92400E" textAnchor="end" fontWeight="bold">
                  {y}
                </text>
              </g>
            );
          })}

          <line x1={38} y1={342} x2={352} y2={342} stroke="#2468B2" strokeWidth="2.5" />
          <line x1={38} y1={342} x2={38} y2={28} stroke="#2468B2" strokeWidth="2.5" />
          <polygon points="352,338 362,342 352,346" fill="#2468B2" />
          <polygon points="34,28 38,18 42,28" fill="#2468B2" />
          <text x={358} y={362} fontSize="13" fill="#2468B2" fontWeight="900">
            X
          </text>
          <text x={18} y={24} fontSize="13" fill="#2468B2" fontWeight="900">
            Y
          </text>

          {points.map((p, idx) => {
            const px = 38 + ((p.x - minX) / (maxX - minX)) * 304;
            const py = 342 - ((p.y - minY) / (maxY - minY)) * 304;

            return (
              <g key={`pt-${idx}`}>
                <circle cx={px} cy={py} r="8" fill="#F59E0B" stroke="#2468B2" strokeWidth="2.5" />
                <circle cx={px} cy={py} r="3" fill="#FFFFFF" />
                <text
                  x={px + 10}
                  y={py - 10}
                  fontSize="12"
                  fill="#2468B2"
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  ({p.x}, {p.y})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[13px] text-slate-600 px-2 font-semibold">
        <span>Cartesian Coordinate Grid Active</span>
        <span className="font-mono font-extrabold text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-lg border border-[#FDE68A]">
          {points.length} Point{points.length === 1 ? "" : "s"} Plotted
        </span>
      </div>
    </div>
  );
}

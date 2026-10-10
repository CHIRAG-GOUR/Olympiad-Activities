"use client";

import React, { useEffect, useMemo } from "react";
import { Question } from "@/types/question";
import { Check } from "lucide-react";

interface MultipleChoiceQuestionProps {
  question: Question;
  value?: any;
  onChange: (val: string) => void;
  readOnly?: boolean;
  isBelowActivity?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  readOnly = false,
  isBelowActivity = false,
}: MultipleChoiceQuestionProps) {
  const config = question.multipleChoiceConfig;
  const rawOptions = config?.options || [];
  const options = useMemo(() => {
    return [...rawOptions].sort((a, b) => {
      const orderA = ["A", "B", "C", "D", "1", "2", "3", "4"].indexOf(String(a.id).trim().toUpperCase());
      const orderB = ["A", "B", "C", "D", "1", "2", "3", "4"].indexOf(String(b.id).trim().toUpperCase());
      if (orderA !== -1 && orderB !== -1) return orderA - orderB;
      return String(a.id).localeCompare(String(b.id));
    });
  }, [rawOptions]);

  // Keyboard shortcut listener for A, B, C, D
  useEffect(() => {
    if (readOnly) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs/textareas
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const key = e.key.toUpperCase();
      const match = options.find((opt) => opt.id.toUpperCase() === key);
      if (match) {
        onChange(match.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, onChange, readOnly]);

  // Robustly resolve whether value matches an option id or option text
  const matchedOpt = options.find((opt) => {
    if (value === undefined || value === null || value === "") return false;
    const vStr = String(value).trim().toUpperCase();
    return opt.id.trim().toUpperCase() === vStr || opt.text.trim().toUpperCase() === vStr;
  });
  const activeOptionId = matchedOpt?.id || (typeof value === "string" ? value : undefined);

  // If all options are concise (< 30 chars), display in a 4-column row on tablets & desktop
  const allShort = options.length === 4 && options.every((o) => (o.text || "").length < 30);
  const gridLayout =
    config?.layout === "grid" || allShort
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`space-y-2.5 ${isBelowActivity ? "mt-1" : ""}`}>
      <div className="flex items-center justify-between text-[11.5px] sm:text-xs text-amber-900 font-extrabold uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span>Select Answer (Click an option or press A, B, C, D):</span>
        </span>
        {activeOptionId && (
          <span className="text-[#1C5190] font-mono font-black bg-[#EAF2FC] px-2.5 py-0.5 rounded-lg border border-[#BBD5F3] text-xs shadow-subtle shrink-0">
            Selected: Option {activeOptionId}
          </span>
        )}
      </div>

      <div className={`grid gap-2.5 sm:gap-3 ${gridLayout}`}>
        {options.map((opt) => {
          const isSelected =
            activeOptionId !== undefined &&
            String(activeOptionId).trim().toUpperCase() === String(opt.id).trim().toUpperCase();

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                if (!readOnly) {
                  onChange(opt.id);
                }
              }}
              disabled={readOnly}
              className={`text-left p-3 sm:p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 group cursor-pointer shadow-sm ${
                isSelected
                  ? "border-amber-500 bg-[#FEF3C7] shadow-md ring-2 ring-amber-300"
                  : "border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40"
              } ${readOnly ? "cursor-default" : ""}`}
            >
              {/* Option Letter Badge (always shows A, B, C, D) */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-black text-[15px] sm:text-base border-2 transition-all relative ${
                  isSelected
                    ? "bg-[#2468B2] text-white border-[#1C5190] shadow-sm"
                    : "bg-slate-50 text-slate-800 border-slate-200 group-hover:border-amber-400 group-hover:bg-amber-100/50"
                }`}
              >
                <span>{opt.id}</span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Option Text & Media */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div
                  className={`text-sm sm:text-[15px] leading-snug font-bold break-words ${
                    isSelected ? "text-slate-950 font-black" : "text-slate-900"
                  }`}
                >
                  {opt.text}
                </div>
                {opt.subtext && (
                  <div className="text-xs text-amber-900 font-mono font-semibold">
                    {opt.subtext}
                  </div>
                )}
                {opt.visualSvg && (
                  <div
                    className="pt-1.5"
                    dangerouslySetInnerHTML={{ __html: opt.visualSvg }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

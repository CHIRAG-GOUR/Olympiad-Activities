"use client";

import React, { useEffect } from "react";
import { Question } from "@/types/question";
import { Check } from "lucide-react";

interface MultipleChoiceQuestionProps {
  question: Question;
  value?: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  readOnly = false,
}: MultipleChoiceQuestionProps) {
  const config = question.multipleChoiceConfig;
  const options = config?.options || [];

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

  const isGrid = config?.layout === "grid" || (options.length === 4 && options.every((o) => o.text.length < 35));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[12px] text-[#92400E] font-extrabold uppercase tracking-wider">
        <span>Select one option (Press A, B, C, or D):</span>
        {value && <span className="text-[#B45309] font-mono font-extrabold bg-[#FEF3C7] px-2.5 py-0.5 rounded border border-[#FDE68A]">Selected: Option {value}</span>}
      </div>

      <div className={`grid gap-3.5 ${isGrid ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        {options.map((opt) => {
          const isSelected = String(value || "").trim().toUpperCase() === String(opt.id).trim().toUpperCase();

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
              className={`text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-4 group cursor-pointer shadow-subtle ${
                isSelected
                  ? "border-[#F59E0B] bg-[#FEF3C7] shadow-md ring-2 ring-[#FEF08A]"
                  : "border-[#FDE68A] bg-[#FFFDF5] hover:border-[#F59E0B] hover:bg-[#FEFCE8]"
              } ${readOnly ? "cursor-default" : ""}`}
            >
              {/* Option Letter Badge */}
              <div
                className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center font-mono font-extrabold text-[15px] border-2 transition-colors ${
                  isSelected
                    ? "bg-[#2563A8] text-white border-[#2563A8] shadow-subtle"
                    : "bg-white text-slate-800 border-[#FDE68A] group-hover:border-[#F59E0B] group-hover:bg-[#FEF3C7]"
                }`}
              >
                {isSelected ? <Check className="w-5 h-5 text-[#E0AE2B]" /> : opt.id}
              </div>

              {/* Option Text & Media */}
              <div className="flex-1 space-y-1 pt-0.5">
                <div
                  className={`text-[15px] leading-relaxed font-bold ${
                    isSelected ? "text-slate-950 font-extrabold" : "text-slate-900"
                  }`}
                >
                  {opt.text}
                </div>
                {opt.subtext && (
                  <div className="text-[13px] text-[#92400E] font-mono font-semibold">
                    {opt.subtext}
                  </div>
                )}
                {opt.visualSvg && (
                  <div
                    className="pt-2"
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

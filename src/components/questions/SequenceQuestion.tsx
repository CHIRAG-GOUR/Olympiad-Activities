"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { HelpCircle, Check } from "lucide-react";

interface SequenceQuestionProps {
  question: Question;
  value?: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
}

export function SequenceQuestion({ question, value, onChange, readOnly = false }: SequenceQuestionProps) {
  const config = question.sequenceConfig;
  const sequence = config?.sequence || [];
  const options = config?.options || [];

  const [selectedId, setSelectedId] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) setSelectedId(value);
  }, [value]);

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  const chosenOption = options.find((o) => o.id === selectedId);

  return (
    <div className="space-y-8">
      {/* Visual Sequence Strip */}
      <div className="bg-[#FEFCE8] p-8 rounded-2xl border-2 border-[#FDE68A] flex flex-wrap items-center justify-center gap-4">
        {sequence.map((item, idx) => {
          if (item.isBlank) {
            return (
              <div
                key={item.id || idx}
                className={`min-w-[84px] h-[84px] px-5 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all shadow-subtle ${
                  chosenOption
                    ? "border-[#F59E0B] bg-[#FEF3C7] text-slate-900 font-mono font-extrabold text-3xl scale-105"
                    : "border-[#D97706] bg-[#FEF3C7]/40 text-[#D97706]"
                }`}
              >
                {chosenOption ? (
                  <span>{chosenOption.value}</span>
                ) : (
                  <HelpCircle className="w-10 h-10 stroke-[2]" />
                )}
              </div>
            );
          }

          return (
            <div
              key={item.id || idx}
              className="min-w-[84px] h-[84px] px-5 bg-white border-2 border-[#FDE68A] rounded-2xl shadow-sm flex items-center justify-center font-mono font-extrabold text-3xl text-slate-900"
            >
              {item.value}
            </div>
          );
        })}
      </div>

      {/* Selectable completion tokens */}
      <div>
        <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-3 text-center">
          Select the correct value to complete the sequence:
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                disabled={readOnly}
                className={`h-[60px] px-6 rounded-xl border-2 font-mono font-extrabold text-2xl transition-all flex items-center justify-center gap-2 shadow-subtle cursor-pointer ${
                  isSelected
                    ? "border-[#F59E0B] bg-[#2563A8] text-white shadow-md scale-105"
                    : "border-[#FDE68A] bg-white text-slate-900 hover:border-[#F59E0B] hover:bg-[#FEF3C7]"
                }`}
              >
                <span>{opt.value}</span>
                {isSelected && <Check className="w-5 h-5 text-[#E0AE2B]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

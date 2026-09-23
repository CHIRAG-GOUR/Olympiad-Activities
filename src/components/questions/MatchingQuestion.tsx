"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Link2, X, Check } from "lucide-react";

interface MatchingQuestionProps {
  question: Question;
  value?: { leftId: string; rightId: string }[];
  onChange: (val: { leftId: string; rightId: string }[]) => void;
  readOnly?: boolean;
}

export function MatchingQuestion({ question, value, onChange, readOnly = false }: MatchingQuestionProps) {
  const config = question.matchingConfig;
  const leftItems = config?.leftItems || [];
  const rightItems = config?.rightItems || [];

  const [pairs, setPairs] = useState<{ leftId: string; rightId: string }[]>(value || []);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  useEffect(() => {
    if (value) setPairs(value);
  }, [value]);

  const handleLeftClick = (leftId: string) => {
    if (readOnly) return;
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
    }
  };

  const handleRightClick = (rightId: string) => {
    if (readOnly || !selectedLeft) return;

    const filtered = pairs.filter((p) => p.leftId !== selectedLeft && p.rightId !== rightId);
    const updated = [...filtered, { leftId: selectedLeft, rightId }];
    setPairs(updated);
    onChange(updated);
    setSelectedLeft(null);
  };

  const removePair = (leftId: string) => {
    if (readOnly) return;
    const updated = pairs.filter((p) => p.leftId !== leftId);
    setPairs(updated);
    onChange(updated);
  };

  const getMatchedRightId = (leftId: string) => pairs.find((p) => p.leftId === leftId)?.rightId;
  const getMatchedLeftId = (rightId: string) => pairs.find((p) => p.rightId === rightId)?.leftId;

  const leftMap = new Map(leftItems.map((i) => [i.id, i]));
  const rightMap = new Map(rightItems.map((i) => [i.id, i]));

  return (
    <div className="space-y-6">
      {config?.instruction && (
        <div className="p-4 bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-xl text-[14px] text-[#92400E] font-extrabold flex items-center gap-2.5">
          <Link2 className="w-5 h-5 text-[#D97706] flex-shrink-0" />
          <span>{config.instruction}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-[#FEFCE8] p-8 rounded-2xl border-2 border-[#FDE68A] shadow-sm">
        {/* Left Column */}
        <div className="space-y-3.5">
          <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-2">
            Column A (Select Source)
          </div>
          {leftItems.map((item) => {
            const isSelected = selectedLeft === item.id;
            const matchedRightId = getMatchedRightId(item.id);
            const isPaired = Boolean(matchedRightId);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLeftClick(item.id)}
                disabled={readOnly}
                className={`w-full text-left px-5 h-[56px] rounded-xl border-2 transition-all flex items-center justify-between text-[15px] font-bold shadow-subtle ${
                  isSelected
                    ? "border-[#F59E0B] bg-[#2468B2] text-white shadow-md scale-[1.02]"
                    : isPaired
                    ? "border-[#FDE68A] bg-white text-slate-900"
                    : "border-[#FDE68A] bg-white text-slate-800 hover:border-[#F59E0B] hover:bg-[#FEF3C7]"
                }`}
              >
                <div>{item.text}</div>
                <div className="flex items-center gap-2">
                  {isPaired && !isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#2468B2] text-white flex items-center justify-center text-xs font-bold">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      isSelected
                        ? "border-white bg-[#E0AE2B]"
                        : isPaired
                        ? "border-[#2468B2] bg-[#2468B2]"
                        : "border-[#FDE68A]"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3.5">
          <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-2">
            Column B (Click to Match)
          </div>
          {rightItems.map((item) => {
            const matchedLeftId = getMatchedLeftId(item.id);
            const isPaired = Boolean(matchedLeftId);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleRightClick(item.id)}
                disabled={readOnly || !selectedLeft}
                className={`w-full text-left px-5 h-[56px] rounded-xl border-2 transition-all flex items-center justify-between text-[15px] font-bold shadow-subtle ${
                  isPaired
                    ? "border-[#FDE68A] bg-white text-slate-900"
                    : selectedLeft
                    ? "border-[#F59E0B] bg-white hover:border-[#F59E0B] hover:bg-[#FEF3C7] cursor-pointer scale-[1.01]"
                    : "border-[#FDE68A] bg-white text-slate-400 opacity-80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      isPaired ? "border-[#2468B2] bg-[#2468B2]" : "border-[#FDE68A]"
                    }`}
                  />
                  <div>{item.text}</div>
                </div>
                {isPaired && (
                  <span className="text-[12px] text-[#92400E] font-extrabold bg-[#FEF3C7] px-2.5 py-0.5 rounded-lg border border-[#FDE68A]">
                    Matched
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Connection Summary */}
      {pairs.length > 0 && (
        <div className="pt-2">
          <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-2">
            Established Match Pairs ({pairs.length} / {leftItems.length})
          </div>
          <div className="flex flex-wrap gap-2.5">
            {pairs.map((p) => {
              const leftText = leftMap.get(p.leftId)?.text || p.leftId;
              const rightText = rightMap.get(p.rightId)?.text || p.rightId;

              return (
                <div
                  key={`${p.leftId}-${p.rightId}`}
                  className="px-4 py-2 bg-white border-2 border-[#FDE68A] rounded-xl shadow-subtle text-[13px] flex items-center gap-2.5 text-slate-900 font-extrabold"
                >
                  <span>{leftText}</span>
                  <span className="text-[#D97706]">↔</span>
                  <span>{rightText}</span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => removePair(p.leftId)}
                      className="text-slate-400 hover:text-rose-600 ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

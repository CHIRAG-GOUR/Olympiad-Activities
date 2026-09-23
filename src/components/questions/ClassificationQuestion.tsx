"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { FolderKanban, X, Plus } from "lucide-react";

interface ClassificationQuestionProps {
  question: Question;
  value?: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  readOnly?: boolean;
}

export function ClassificationQuestion({ question, value, onChange, readOnly = false }: ClassificationQuestionProps) {
  const config = question.classificationConfig;
  const categories = config?.categories || [];
  const items = config?.items || [];

  const [assignments, setAssignments] = useState<Record<string, string>>(value || {});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (value) setAssignments(value);
  }, [value]);

  const assignItemToCategory = (itemId: string, categoryId: string) => {
    if (readOnly) return;
    const updated = { ...assignments, [itemId]: categoryId };
    setAssignments(updated);
    onChange(updated);
    setSelectedItemId(null);
  };

  const removeItem = (itemId: string) => {
    if (readOnly) return;
    const updated = { ...assignments };
    delete updated[itemId];
    setAssignments(updated);
    onChange(updated);
  };

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const unassigned = items.filter((i) => !assignments[i.id]);

  return (
    <div className="space-y-6">
      {config?.instruction && (
        <div className="p-4 bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-xl text-[14px] text-[#92400E] font-extrabold flex items-center gap-2.5">
          <FolderKanban className="w-5 h-5 text-[#D97706] flex-shrink-0" />
          <span>{config.instruction}</span>
        </div>
      )}

      {/* Unclassified Pool */}
      <div>
        <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-2.5">
          Select or Drag Items to Classify ({unassigned.length} remaining)
        </div>
        <div className="bg-[#FEFCE8] p-6 rounded-2xl border-2 border-[#FDE68A] flex flex-wrap gap-3.5 min-h-[90px] items-center">
          {unassigned.length === 0 ? (
            <span className="text-[14px] text-slate-500 italic font-medium">All item tokens have been placed into groups.</span>
          ) : (
            unassigned.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => !readOnly && setSelectedItemId(isSelected ? null : item.id)}
                  className={`h-[52px] px-6 rounded-xl text-[15px] font-extrabold transition-all border-2 shadow-sm ${
                    isSelected
                      ? "bg-[#2468B2] text-white border-[#2468B2] scale-105 shadow-md"
                      : "bg-white text-slate-900 border-[#FDE68A] hover:border-[#F59E0B] hover:scale-105 hover:bg-[#FEF3C7]"
                  }`}
                >
                  {item.text}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Categories Buckets */}
      <div>
        <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-2.5">
          Classification Groups
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const assignedHere = items.filter((i) => assignments[i.id] === cat.id);

            return (
              <div
                key={cat.id}
                className="bg-white border-2 border-[#FDE68A] rounded-2xl p-5 flex flex-col justify-between min-h-[190px] shadow-subtle hover:border-[#F59E0B] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#FDE68A]">
                    <span className="font-extrabold text-[15px] text-slate-900">{cat.title}</span>
                    <span className="text-[12px] px-2.5 py-0.5 bg-[#FEF3C7] text-[#92400E] font-mono font-extrabold rounded-lg border border-[#FDE68A]">
                      {assignedHere.length} Items
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-[13px] text-slate-600 mt-1.5 mb-4 leading-normal font-medium">{cat.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 py-2">
                    {assignedHere.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-[13px] font-extrabold text-[#92400E]"
                      >
                        <span>{item.text}</span>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedItemId && !readOnly && (
                  <button
                    type="button"
                    onClick={() => assignItemToCategory(selectedItemId, cat.id)}
                    className="w-full mt-4 h-[44px] bg-[#F59E0B] border-2 border-[#D97706] text-slate-950 text-[13px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#D97706] transition-all shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4 text-slate-950" /> Place &quot;{itemMap.get(selectedItemId)?.text}&quot; Here
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

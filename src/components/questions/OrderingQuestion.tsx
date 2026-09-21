"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { ArrowLeftRight, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface OrderingQuestionProps {
  question: Question;
  value?: string[];
  onChange: (val: string[]) => void;
  readOnly?: boolean;
}

export function OrderingQuestion({ question, value, onChange, readOnly = false }: OrderingQuestionProps) {
  const config = question.orderingConfig;
  const initialItems = config?.items || [];

  const [itemsOrder, setItemsOrder] = useState<string[]>(() => {
    if (value && Array.isArray(value) && value.length === initialItems.length) {
      return value;
    }
    return initialItems.map((i) => i.id);
  });

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (value && Array.isArray(value) && value.length === initialItems.length) {
      setItemsOrder(value);
    }
  }, [value, initialItems.length]);

  const handleDragStart = (idx: number) => {
    if (readOnly) return;
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (readOnly || draggedIdx === null || draggedIdx === targetIdx) return;

    const newOrder = [...itemsOrder];
    const [moved] = newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, moved);
    setDraggedIdx(targetIdx);
    setItemsOrder(newOrder);
    onChange(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (readOnly) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= itemsOrder.length) return;

    const newOrder = [...itemsOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setItemsOrder(newOrder);
    onChange(newOrder);
  };

  const itemMap = new Map(initialItems.map((i) => [i.id, i]));

  return (
    <div className="space-y-6">
      {config?.instruction && (
        <div className="p-4 bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-xl text-[14px] text-[#92400E] font-extrabold flex items-center gap-2.5">
          <ArrowLeftRight className="w-5 h-5 text-[#D97706] flex-shrink-0" />
          <span>{config.instruction}</span>
        </div>
      )}

      {/* Spacious Ordering Strip */}
      <div className="bg-[#FEFCE8] p-8 rounded-2xl border-2 border-[#FDE68A] flex flex-wrap gap-4 items-center justify-center min-h-[170px]">
        {itemsOrder.map((itemId, idx) => {
          const item = itemMap.get(itemId);
          if (!item) return null;
          const isDragging = draggedIdx === idx;

          return (
            <div
              key={itemId}
              draggable={!readOnly}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 px-6 h-[64px] min-w-[120px] bg-white border-2 rounded-xl transition-all cursor-grab active:cursor-grabbing select-none shadow-md ${
                isDragging
                  ? "border-[#F59E0B] bg-[#FEF3C7] shadow-xl scale-105"
                  : "border-[#FDE68A] hover:border-[#F59E0B] hover:scale-[1.02]"
              }`}
            >
              {!readOnly && (
                <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />
              )}
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-slate-900">
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="text-[12px] font-bold text-[#92400E]">{item.sublabel}</span>
                )}
              </div>

              {!readOnly && itemsOrder.length > 1 && (
                <div className="flex flex-col gap-1 ml-3 border-l-2 border-[#FDE68A] pl-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItem(idx, "up");
                    }}
                    disabled={idx === 0}
                    title="Move left/up"
                    className="p-1 hover:bg-[#FEF3C7] disabled:opacity-20 rounded text-slate-800"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItem(idx, "down");
                    }}
                    disabled={idx === itemsOrder.length - 1}
                    title="Move right/down"
                    className="p-1 hover:bg-[#FEF3C7] disabled:opacity-20 rounded text-slate-800"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-[13px] text-slate-600 font-medium flex items-center justify-between px-2">
        <span className="flex items-center gap-1.5 font-bold text-slate-900">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" />
          Sequence order: Left = First (Smallest) → Right = Last (Greatest)
        </span>
        <span className="font-mono font-extrabold text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-lg border border-[#FDE68A]">{itemsOrder.length} Elements</span>
      </div>
    </div>
  );
}

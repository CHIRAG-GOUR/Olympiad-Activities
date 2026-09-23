"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Layers, X, GripHorizontal } from "lucide-react";

interface DragDropQuestionProps {
  question: Question;
  value?: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  readOnly?: boolean;
}

export function DragDropQuestion({ question, value, onChange, readOnly = false }: DragDropQuestionProps) {
  const config = question.dragDropConfig;
  const items = config?.items || [];
  const zones = config?.zones || [];

  const [mapping, setMapping] = useState<Record<string, string>>(value || {});
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activeZoneTarget, setActiveZoneTarget] = useState<string | null>(null);

  useEffect(() => {
    if (value) setMapping(value);
  }, [value]);

  const handleDragStart = (itemId: string) => {
    if (readOnly) return;
    setDraggedItemId(itemId);
  };

  const handleDropOnZone = (zoneId: string) => {
    if (readOnly || !draggedItemId) return;
    const newMapping = { ...mapping, [draggedItemId]: zoneId };
    setMapping(newMapping);
    onChange(newMapping);
    setDraggedItemId(null);
    setActiveZoneTarget(null);
  };

  const removeItemFromZone = (itemId: string) => {
    if (readOnly) return;
    const newMapping = { ...mapping };
    delete newMapping[itemId];
    setMapping(newMapping);
    onChange(newMapping);
  };

  const unassignedItems = items.filter((it) => !mapping[it.id]);

  return (
    <div className="space-y-6">
      {config?.instruction && (
        <div className="p-4 bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-xl text-[14px] text-[#92400E] font-extrabold flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#D97706] flex-shrink-0" />
          <span>{config.instruction}</span>
        </div>
      )}

      {/* Available Items Pool */}
      <div>
        <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-2.5">
          Available Items Pool ({unassignedItems.length} unplaced)
        </div>
        <div className="bg-[#FEFCE8] p-6 rounded-2xl border-2 border-[#FDE68A] flex flex-wrap gap-3.5 min-h-[90px] items-center">
          {unassignedItems.length === 0 ? (
            <span className="text-[14px] text-slate-500 italic font-medium">All item tokens placed into zones.</span>
          ) : (
            unassignedItems.map((item) => (
              <div
                key={item.id}
                draggable={!readOnly}
                onDragStart={() => handleDragStart(item.id)}
                className="h-[52px] px-5 bg-white border-2 border-[#FDE68A] hover:border-[#F59E0B] rounded-xl shadow-sm text-[15px] font-extrabold text-slate-900 flex items-center gap-2.5 cursor-grab active:cursor-grabbing hover:scale-105 transition-all select-none hover:bg-[#FEF3C7]"
              >
                <GripHorizontal className="w-4 h-4 text-[#D97706]" />
                <span>{item.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Drop Zones */}
      <div>
        <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] mb-2.5">
          Target Category Zones
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {zones.map((zone) => {
            const assignedItems = items.filter((it) => mapping[it.id] === zone.id);
            const isTarget = activeZoneTarget === zone.id;

            return (
              <div
                key={zone.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!readOnly) setActiveZoneTarget(zone.id);
                }}
                onDragLeave={() => setActiveZoneTarget(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnZone(zone.id);
                }}
                className={`p-5 rounded-2xl border-2 transition-all min-h-[150px] flex flex-col justify-between shadow-subtle ${
                  isTarget
                    ? "border-[#F59E0B] bg-[#FEF3C7]"
                    : "border-dashed border-[#FDE68A] bg-white hover:border-[#F59E0B]"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#FDE68A]">
                  <span className="text-[15px] font-extrabold text-slate-900">{zone.label}</span>
                  <span className="text-[12px] font-extrabold px-2.5 py-0.5 bg-[#FEF3C7] text-[#92400E] rounded-lg border border-[#FDE68A] font-mono">
                    {assignedItems.length} Placed
                  </span>
                </div>

                <div className="py-3 flex flex-wrap gap-2 flex-1 items-start">
                  {assignedItems.length === 0 ? (
                    <div className="w-full text-center py-6 text-[13px] text-slate-400 font-medium">
                      Drag and drop matching items here
                    </div>
                  ) : (
                    assignedItems.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-[13px] font-extrabold text-[#92400E] shadow-subtle"
                      >
                        <span>{item.label}</span>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => removeItemFromZone(item.id)}
                            className="text-slate-400 hover:text-rose-600 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

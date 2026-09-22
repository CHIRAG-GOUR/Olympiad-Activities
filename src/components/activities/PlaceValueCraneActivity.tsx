"use client";

import React, { useState } from "react";
import { Building2, MoveUp, MoveDown, CheckCircle2, RotateCcw } from "lucide-react";

interface PlaceValueCraneActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function PlaceValueCraneActivity({
  value,
  onChange,
  readOnly = false }: PlaceValueCraneActivityProps) {
  // Initial scrambled order or user provided order
  const initialItems = [
    { id: "1", label: "Hundreds (10²)", power: 2 },
    { id: "4", label: "Thousands (10³)", power: 3 },
    { id: "2", label: "Ones (10⁰)", power: 0 },
    { id: "5", label: "Lakhs (10⁵)", power: 5 },
    { id: "3", label: "Tens (10¹)", power: 1 },
  ];

  const [items, setItems] = useState<typeof initialItems>(() => {
    if (Array.isArray(value)) {
      return value
        .map((id) => initialItems.find((item) => item.id === String(id)))
        .filter(Boolean) as typeof initialItems;
    }
    return initialItems;
  });

  const moveItem = (index: number, direction: "up" | "down") => {
    if (readOnly) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    setItems(newItems);
    onChange(newItems.map((i) => i.id));
  };

  const handleReset = () => {
    setItems(initialItems);
    onChange(initialItems.map((i) => i.id));
  };

  const isAscendingCorrect =
    items.map((i) => i.id).join(",") === "2,3,1,4,5";

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-500/20 border border-yellow-400/40 rounded-lg text-yellow-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-yellow-300 flex items-center gap-2">
              Number Construction Crane
            </h3>
            <p className="text-xs text-slate-600">
              Operate the crane to stack the place-value tower in ascending order (smallest to largest).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Tower
        </button>
      </div>

      {/* Crane & Place Value Tower Canvas */}
      <div className="space-y-2.5 max-w-xl mx-auto">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
              isAscendingCorrect
                ? "bg-emerald-50/70 border border-emerald-200 border-emerald-500/80 text-emerald-800"
                : "bg-slate-100 border border-slate-200/80 border-slate-200/80 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-sm text-yellow-400">
                {idx + 1}
              </span>
              <div>
                <h4 className="font-bold text-sm tracking-wide">{item.label}</h4>
                <span className="text-[11px] font-mono text-slate-600">Tier #{item.id}</span>
              </div>
            </div>

            {/* Crane movement controls */}
            {!readOnly && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, "up")}
                  className="p-2 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition"
                  title="Move Up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => moveItem(idx, "down")}
                  className="p-2 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition"
                  title="Move Down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Tower Status Indicator */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center flex items-center justify-center gap-2 text-xs font-mono">
        {isAscendingCorrect ? (
          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Ascending Tower Verified: 2 → 3 → 1 → 4 → 5 (Option C)
          </span>
        ) : (
          <span className="text-slate-600">
            Current sequence: {items.map((i) => i.id).join(" → ")}
          </span>
        )}
      </div>
    </div>
  );
}

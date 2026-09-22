"use client";

import React, { useState, useEffect } from "react";
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
  readOnly = false,
}: PlaceValueCraneActivityProps) {
  const initialItems = [
    { id: "1", label: "1. Hundreds (10²)", power: 2 },
    { id: "4", label: "4. Thousands (10³)", power: 3 },
    { id: "2", label: "2. Ones (10⁰)", power: 0 },
    { id: "5", label: "5. Lakhs (10⁵)", power: 5 },
    { id: "3", label: "3. Tens (10¹)", power: 1 },
  ];

  const options = [
    { id: "A", seq: "2, 3, 1, 5, 4", label: "2, 3, 1, 5, 4", isCorrect: false },
    { id: "B", seq: "3, 1, 2, 4, 5", label: "3, 1, 2, 4, 5", isCorrect: false },
    { id: "C", seq: "2, 3, 1, 4, 5", label: "2, 3, 1, 4, 5 (Ones → Tens → Hundreds → Thousands → Lakhs)", isCorrect: true },
    { id: "D", seq: "3, 2, 1, 4, 5", label: "3, 2, 1, 4, 5", isCorrect: false },
  ];

  const [items, setItems] = useState<typeof initialItems>(() => {
    if (value === "C" || value === "2, 3, 1, 4, 5") {
      const order = ["2", "3", "1", "4", "5"];
      return order.map((id) => initialItems.find((item) => item.id === id)!).filter(Boolean);
    }
    return initialItems;
  });

  const [selectedId, setSelectedId] = useState<string>(
    value ? (options.find((o) => o.id === value || o.seq === value)?.id || "C") : ""
  );

  useEffect(() => {
    if (value) {
      const match = options.find((o) => o.id === value || o.seq === value);
      if (match) {
        setSelectedId(match.id);
        const order = match.seq.split(", ");
        const reordered = order.map((id) => initialItems.find((i) => i.id === id)!).filter(Boolean);
        if (reordered.length === 5) setItems(reordered);
      }
    }
  }, [value]);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (readOnly) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    setItems(newItems);
    const newSeq = newItems.map((i) => i.id).join(", ");
    const matched = options.find((o) => o.seq === newSeq);
    if (matched) {
      setSelectedId(matched.id);
      onChange(matched.id);
    } else {
      onChange(newItems.map((i) => i.id));
    }
  };

  const handleSelectOption = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    const order = opt.seq.split(", ");
    const reordered = order.map((id) => initialItems.find((i) => i.id === id)!).filter(Boolean);
    if (reordered.length === 5) setItems(reordered);
    onChange(opt.id);
  };

  const handleReset = () => {
    setItems(initialItems);
    setSelectedId("");
    onChange(initialItems.map((i) => i.id));
  };

  const currentSeq = items.map((i) => i.id).join(", ");
  const isAscendingCorrect = currentSeq === "2, 3, 1, 4, 5";

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Place-Value Crane Construction
            </h3>
            <p className="text-xs text-slate-600">
              Stack the place-value blocks in ascending order (smallest to largest) using crane arrows or select a sequence option.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectOption(options[2])}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Auto-Stack Ascending
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Crane & Place Value Tower Canvas */}
      <div className="space-y-2 max-w-xl mx-auto p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
              isAscendingCorrect
                ? "bg-white border-emerald-500 text-emerald-950 shadow-xs"
                : "bg-white border-slate-300 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center font-mono font-bold text-xs text-slate-700">
                #{idx + 1}
              </span>
              <div>
                <h4 className="font-bold text-sm tracking-wide">{item.label}</h4>
                <span className="text-[10px] font-mono text-slate-500">Block ID: {item.id}</span>
              </div>
            </div>

            {/* Crane movement controls */}
            {!readOnly && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, "up")}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 border border-slate-300 text-slate-700 transition cursor-pointer"
                  title="Move Up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => moveItem(idx, "down")}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 border border-slate-300 text-slate-700 transition cursor-pointer"
                  title="Move Down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select Ascending Order Sequence:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id || currentSeq === opt.seq;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectOption(opt)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.01]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="font-mono text-base font-black">{opt.seq}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{opt.label}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

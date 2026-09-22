"use client";

import React, { useRef, useState } from "react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { usePointerDrag } from "./usePointerDrag";

export interface ReorderItem {
  id: string;
  label: string;
  sub?: string;
  accent?: string;
}

interface ReorderListProps {
  items: ReorderItem[];
  /** Current order, as item ids */
  order: string[];
  onReorder: (order: string[]) => void;
  readOnly?: boolean;
  orientation?: "vertical" | "horizontal";
  /** Rendered to the right of each row, e.g. a computed place-value */
  renderMeta?: (id: string, index: number) => React.ReactNode;
}

const move = (order: string[], from: number, to: number) => {
  const next = order.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** Drag-to-reorder that works with mouse, touch and keyboard (arrow buttons). */
export function ReorderList({
  items,
  order,
  onReorder,
  readOnly = false,
  orientation = "vertical",
  renderMeta,
}: ReorderListProps) {
  const byId = new Map(items.map((i) => [i.id, i]));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const geom = useRef<{ centers: number[]; index: number } | null>(null);
  const horizontal = orientation === "horizontal";

  const { start } = usePointerDrag<string>({
    disabled: readOnly,
    onStart: (_p, id) => {
      const rows = Array.from(containerRef.current?.querySelectorAll("[data-row]") || []);
      geom.current = {
        centers: rows.map((r) => {
          const b = (r as HTMLElement).getBoundingClientRect();
          return horizontal ? b.left + b.width / 2 : b.top + b.height / 2;
        }),
        index: order.indexOf(id),
      };
      setActiveId(id);
    },
    onMove: (p, id) => {
      const g = geom.current;
      if (!g) return;
      const delta = horizontal ? p.dx : p.dy;
      setOffset(delta);
      const from = order.indexOf(id);
      const pos = g.centers[g.index] + delta;
      let target = 0;
      for (let i = 0; i < g.centers.length; i++) if (pos > g.centers[i]) target = i;
      if (pos < g.centers[0]) target = 0;
      if (target !== from) onReorder(move(order, from, target));
    },
    onEnd: () => {
      setActiveId(null);
      setOffset(0);
      geom.current = null;
    },
  });

  const shift = (id: string, dir: -1 | 1) => {
    if (readOnly) return;
    const from = order.indexOf(id);
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    onReorder(move(order, from, to));
  };

  return (
    <div
      ref={containerRef}
      className={horizontal ? "flex gap-2 overflow-x-auto pb-1" : "space-y-2"}
      style={{ touchAction: "none" }}
    >
      {order.map((id, idx) => {
        const item = byId.get(id);
        if (!item) return null;
        const isActive = activeId === id;
        return (
          <div
            key={id}
            data-row
            onPointerDown={(e) => start(e, id)}
            className={`group flex items-center gap-2.5 rounded-xl border-2 bg-white px-3 py-2.5 transition-shadow ${
              isActive
                ? "border-emerald-500 shadow-lg z-10 relative cursor-grabbing"
                : "border-slate-200 hover:border-emerald-300 cursor-grab"
            } ${horizontal ? "min-w-[140px] flex-col items-stretch" : ""}`}
            style={
              isActive
                ? { transform: horizontal ? `translateX(${offset}px)` : `translateY(${offset}px)` }
                : undefined
            }
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-6 h-6 shrink-0 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                {idx + 1}
              </span>
              <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="font-black text-sm text-slate-900 truncate">{item.label}</div>
                {item.sub && <div className="text-[11px] text-slate-500 font-medium truncate">{item.sub}</div>}
              </div>
            </div>
            {renderMeta && <div className="shrink-0">{renderMeta(id, idx)}</div>}
            <div className="flex shrink-0 gap-0.5" onPointerDown={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Move earlier"
                disabled={readOnly || idx === 0}
                onClick={() => shift(id, -1)}
                className="w-9 h-9 sm:w-7 sm:h-7 grid place-items-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-200 disabled:opacity-30"
              >
                <ChevronUp className={`w-4 h-4 ${horizontal ? "-rotate-90" : ""}`} />
              </button>
              <button
                type="button"
                aria-label="Move later"
                disabled={readOnly || idx === order.length - 1}
                onClick={() => shift(id, 1)}
                className="w-9 h-9 sm:w-7 sm:h-7 grid place-items-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-200 disabled:opacity-30"
              >
                <ChevronDown className={`w-4 h-4 ${horizontal ? "-rotate-90" : ""}`} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

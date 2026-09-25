"use client";

import React, { useCallback, useRef } from "react";
import { Check, X } from "lucide-react";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";

/**
 * Interaction primitives shared by the Set A activities. Everything here is driven by
 * Pointer Events, so a mouse, a finger and a stylus all work identically, and every
 * listener is torn down by `usePointerDrag` when the question unmounts.
 */

/** A scale the student physically drags along to choose a value. */
export function NumberScale({
  min,
  max,
  step = 1,
  value,
  onChange,
  readOnly,
  label,
  format = (v: number) => String(v),
  ticks = true,
}: {
  min: number;
  max: number;
  step?: number;
  value: number | null;
  onChange: (v: number) => void;
  readOnly?: boolean;
  label?: string;
  format?: (v: number) => string;
  ticks?: boolean;
}) {
  const snap = useCallback(
    (frac: number) => {
      const raw = min + frac * (max - min);
      const snapped = Math.round(raw / step) * step;
      return clamp(Number(snapped.toFixed(6)), min, max);
    },
    [min, max, step]
  );

  const { start, dragging } = usePointerDrag({
    disabled: readOnly,
    onStart: (p) => onChange(snap(p.fracX)),
    onMove: (p) => onChange(snap(p.fracX)),
  });

  const pct = value === null ? 0 : ((value - min) / (max - min)) * 100;
  const tickCount = ticks ? Math.min(21, Math.floor((max - min) / step) + 1) : 0;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
          <span className="font-mono text-lg font-black text-slate-900">
            {value === null ? "—" : format(value)}
          </span>
        </div>
      )}
      <div
        onPointerDown={(e) => start(e, undefined)}
        className={`relative h-12 rounded-xl border-2 bg-white ${
          readOnly ? "border-slate-200" : dragging ? "border-emerald-500 cursor-grabbing" : "border-slate-300 cursor-grab hover:border-emerald-400"
        }`}
        style={{ touchAction: "none" }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value ?? undefined}
        aria-label={label}
      >
        {tickCount > 0 && (
          <div className="absolute inset-x-2 top-1.5 flex justify-between">
            {Array.from({ length: tickCount }).map((_, i) => (
              <span key={i} className="w-px h-2 bg-slate-200" />
            ))}
          </div>
        )}
        <div
          className="absolute inset-y-1 left-1 rounded-lg bg-emerald-100/70"
          style={{ width: value === null ? 0 : `calc(${pct}% - 4px)` }}
        />
        {value !== null && (
          <span
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 min-w-[2.5rem] px-1.5 rounded-lg bg-emerald-600 text-white grid place-items-center font-mono text-sm font-black shadow"
            style={{ left: `${pct}%` }}
          >
            {format(value)}
          </span>
        )}
      </div>
      <div className="flex justify-between text-[10px] font-mono text-slate-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

/** Freely draggable marker inside an SVG microworld, positioned in viewBox units. */
export function DraggableDot({
  x,
  y,
  onMove,
  readOnly,
  r = 3.2,
  label,
  tone = "emerald",
  viewBox = 100,
}: {
  x: number;
  y: number;
  onMove: (x: number, y: number) => void;
  readOnly?: boolean;
  r?: number;
  label?: string;
  tone?: "emerald" | "sky" | "rose";
  viewBox?: number;
}) {
  const tones = {
    emerald: { fill: "#059669", ring: "#a7f3d0" },
    sky: { fill: "#0284c7", ring: "#bae6fd" },
    rose: { fill: "#e11d48", ring: "#fecdd3" },
  } as const;

  // The gesture must be measured against the whole drawing, not against the dot's own
  // bounding box, so the owning <svg> is measured when the drag begins.
  const surface = useRef<DOMRect | null>(null);

  const { start, dragging } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const r = surface.current;
      if (!r || !r.width || !r.height) return;
      onMove(
        clamp(((p.x - r.left) / r.width) * viewBox, 0, viewBox),
        clamp(((p.y - r.top) / r.height) * viewBox, 0, viewBox)
      );
    },
  });

  const begin = (e: React.PointerEvent<SVGGElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    surface.current = svg ? svg.getBoundingClientRect() : null;
    start(e as unknown as React.PointerEvent, undefined);
  };

  return (
    <g
      onPointerDown={begin}
      style={{ cursor: readOnly ? "default" : dragging ? "grabbing" : "grab", touchAction: "none" }}
    >
      <circle cx={x} cy={y} r={r * 2.4} fill="transparent" />
      <circle cx={x} cy={y} r={r * 1.7} fill={tones[tone].ring} opacity={dragging ? 0.9 : 0.5} />
      <circle cx={x} cy={y} r={r} fill={tones[tone].fill} stroke="#fff" strokeWidth={0.8} />
      {label && (
        <text x={x} y={y - r * 2.4} textAnchor="middle" fontSize={4} fontWeight={800} fill="#334155">
          {label}
        </text>
      )}
    </g>
  );
}

/**
 * Drawing surface for an SVG microworld.
 *
 * `aspect` must match the `viewBox` ratio. The default pairs a 100×100 viewBox with a
 * square box, so no letterboxing appears and `DraggableDot` can map pointer positions
 * straight onto viewBox units.
 */
export function DragSurface({
  children,
  className = "",
  viewBox = "0 0 100 100",
  aspect = "aspect-square",
}: {
  children: React.ReactNode;
  className?: string;
  viewBox?: string;
  aspect?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={`w-full ${aspect} select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {children}
    </svg>
  );
}

/** Live checklist of the conditions a microworld must satisfy. */
export function Conditions({
  items,
}: {
  items: { id: string; label: string; met: boolean }[];
}) {
  return (
    <ul className="space-y-1">
      {items.map((it) => (
        <li
          key={it.id}
          className={`flex items-start gap-2 text-xs font-semibold rounded-lg px-2.5 py-1.5 border ${
            it.met
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          {it.met ? (
            <Check className="w-3.5 h-3.5 mt-px shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 mt-px shrink-0 opacity-50" />
          )}
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** A pressable tile used for cells, faces, digits and other discrete choices. */
export function Tile({
  children,
  active,
  onClick,
  readOnly,
  tone = "emerald",
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  readOnly?: boolean;
  tone?: "emerald" | "sky" | "amber";
  className?: string;
  ariaLabel?: string;
}) {
  const tones = {
    emerald: "bg-emerald-600 border-emerald-700 text-white",
    sky: "bg-sky-600 border-sky-700 text-white",
    amber: "bg-amber-500 border-amber-600 text-white",
  } as const;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={readOnly}
      onClick={onClick}
      className={`min-h-[44px] rounded-lg border-2 font-bold transition active:scale-95 disabled:opacity-50 ${
        active ? tones[tone] : "bg-white border-slate-200 text-slate-700 hover:border-emerald-400"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/** Compact labelled figure used across the read-out panels. */
export function Metric({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "slate" | "emerald" | "sky" | "amber";
}) {
  const tones = {
    slate: "bg-white border-slate-200 text-slate-900",
    emerald: "bg-emerald-50 border-emerald-300 text-emerald-900",
    sky: "bg-sky-50 border-sky-300 text-sky-900",
    amber: "bg-amber-50 border-amber-300 text-amber-900",
  } as const;
  return (
    <div className={`px-2.5 py-1.5 rounded-lg border-2 ${tones[tone]}`}>
      <div className="text-[9px] font-bold uppercase tracking-wider opacity-60 leading-tight">{label}</div>
      <div className="font-mono text-sm font-black leading-tight tabular-nums">{value}</div>
    </div>
  );
}

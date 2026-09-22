"use client";

import React, { useRef } from "react";
import { Delete, Minus, Plus } from "lucide-react";
import { usePointerDrag, clamp } from "./usePointerDrag";

/** Big touch-friendly keypad. Emits the raw digit string. */
export function NumberPad({
  value,
  onChange,
  readOnly = false,
  allowDecimal = false,
  allowSign = false,
  maxLength = 9,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  allowDecimal?: boolean;
  allowSign?: boolean;
  maxLength?: number;
  suffix?: string;
}) {
  const push = (ch: string) => {
    if (readOnly) return;
    if (ch === "back") return onChange(value.slice(0, -1));
    if (ch === "clear") return onChange("");
    if (ch === "-") return onChange(value.startsWith("-") ? value.slice(1) : `-${value}`);
    if (ch === "." && (value.includes(".") || !value)) return;
    if (value.replace(/[-.]/g, "").length >= maxLength) return;
    onChange(value + ch);
  };

  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", allowSign ? "-" : "", "0", allowDecimal ? "." : ""];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2 rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5">
        <span className="font-mono text-2xl font-black text-slate-900 tabular-nums">{value || "—"}</span>
        {suffix && <span className="text-xs font-bold text-slate-500">{suffix}</span>}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {keys.map((k, i) =>
          k ? (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              onClick={() => push(k)}
              className="h-11 rounded-lg border-2 border-slate-200 bg-white font-mono text-lg font-black text-slate-800 hover:bg-emerald-50 hover:border-emerald-400 active:scale-95 transition disabled:opacity-40"
            >
              {k}
            </button>
          ) : (
            <span key={i} />
          )
        )}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          disabled={readOnly}
          onClick={() => push("back")}
          className="h-10 rounded-lg border-2 border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-200 inline-flex items-center justify-center gap-1.5"
        >
          <Delete className="w-3.5 h-3.5" /> Backspace
        </button>
        <button
          type="button"
          disabled={readOnly}
          onClick={() => push("clear")}
          className="h-10 rounded-lg border-2 border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-200"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

/** Labelled slider that also works as a coarse drag control on touch. */
export function ValueSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  readOnly = false,
  tone = "emerald",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  readOnly?: boolean;
  tone?: "emerald" | "sky" | "rose";
}) {
  const tones = { emerald: "accent-emerald-600", sky: "accent-sky-600", rose: "accent-rose-600" } as const;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">{label}</span>
        <span className="font-mono text-base font-black text-slate-900">
          {value}
          {unit ? <span className="text-xs font-bold text-slate-500 ml-1">{unit}</span> : null}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={readOnly}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-3 ${tones[tone]} cursor-pointer`}
        style={{ touchAction: "none" }}
      />
      <div className="flex justify-between text-[10px] font-mono text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

/** Minus/plus counter with a 44px touch target. */
export function Stepper({
  label,
  value,
  min = 0,
  max = 99,
  step = 1,
  unit,
  onChange,
  readOnly = false,
}: {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  readOnly?: boolean;
}) {
  const set = (v: number) => !readOnly && onChange(clamp(Number(v.toFixed(4)), min, max));
  return (
    <div className="space-y-1">
      {label && <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Decrease"
          disabled={readOnly || value <= min}
          onClick={() => set(value - step)}
          className="w-11 h-11 grid place-items-center rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center font-mono text-lg font-black text-slate-900 tabular-nums">
          {value}
          {unit && <span className="text-[11px] font-bold text-slate-500 ml-1">{unit}</span>}
        </div>
        <button
          type="button"
          aria-label="Increase"
          disabled={readOnly || value >= max}
          onClick={() => set(value + step)}
          className="w-11 h-11 grid place-items-center rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Rotary dial the student physically spins. The pointer angle picks one of `items`.
 */
export function RotaryDial({
  items,
  index,
  onChange,
  readOnly = false,
  size = 150,
  label,
}: {
  items: string[];
  index: number;
  onChange: (index: number) => void;
  readOnly?: boolean;
  size?: number;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const seg = 360 / items.length;

  const angleTo = (x: number, y: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return null;
    const a = Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2));
    return ((a * 180) / Math.PI + 450) % 360;
  };

  const { start, dragging } = usePointerDrag({
    disabled: readOnly,
    onStart: (p) => {
      const a = angleTo(p.x, p.y);
      if (a !== null) onChange(Math.round(a / seg) % items.length);
    },
    onMove: (p) => {
      const a = angleTo(p.x, p.y);
      if (a !== null) onChange(Math.round(a / seg) % items.length);
    },
  });

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>}
      <div
        ref={ref}
        onPointerDown={(e) => start(e, undefined)}
        className={`relative rounded-full border-4 border-slate-300 bg-white shadow-inner ${
          readOnly ? "" : dragging ? "cursor-grabbing border-emerald-500" : "cursor-grab hover:border-emerald-400"
        }`}
        style={{ width: size, height: size, touchAction: "none" }}
      >
        {items.map((it, i) => {
          const a = ((i * seg - 90) * Math.PI) / 180;
          const r = size / 2 - 20;
          return (
            <span
              key={it + i}
              className={`absolute -translate-x-1/2 -translate-y-1/2 text-xs font-black ${
                i === index ? "text-emerald-700 scale-125" : "text-slate-400"
              }`}
              style={{ left: size / 2 + r * Math.cos(a), top: size / 2 + r * Math.sin(a) }}
            >
              {it}
            </span>
          );
        })}
        <div
          className="absolute left-1/2 top-1/2 w-1.5 rounded-full bg-emerald-600"
          style={{
            height: size / 2 - 24,
            transform: `translate(-50%,-100%) rotate(${index * seg}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900 text-white grid place-items-center font-black text-sm">
          {items[index]}
        </div>
      </div>
    </div>
  );
}

/** Segmented control where each press is a genuine state change of the microworld. */
export function ToggleRow<T extends string>({
  options,
  value,
  onChange,
  readOnly = false,
  label,
}: {
  options: { id: T; label: string; sub?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  readOnly?: boolean;
  label?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={readOnly}
            onClick={() => onChange(o.id)}
            className={`px-3 py-2 min-h-[44px] rounded-lg border-2 text-xs font-bold transition ${
              value === o.id
                ? "bg-emerald-600 border-emerald-700 text-white"
                : "bg-white border-slate-200 text-slate-700 hover:border-emerald-400"
            }`}
          >
            <span className="block">{o.label}</span>
            {o.sub && <span className="block text-[10px] font-medium opacity-70">{o.sub}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A latch the student physically flips; used for property filters and rule switches. */
export function SwitchToggle({
  label,
  sub,
  on,
  onChange,
  readOnly = false,
}: {
  label: string;
  sub?: string;
  on: boolean;
  onChange: (on: boolean) => void;
  readOnly?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={() => onChange(!on)}
      className={`flex items-center gap-2.5 w-full rounded-xl border-2 px-3 py-2 min-h-[48px] text-left transition ${
        on ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      <span
        className={`w-10 h-6 rounded-full p-0.5 transition-colors shrink-0 ${on ? "bg-emerald-600" : "bg-slate-300"}`}
      >
        <span
          className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : ""}`}
        />
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-xs text-slate-900">{label}</span>
        {sub && <span className="block text-[10px] text-slate-500">{sub}</span>}
      </span>
    </button>
  );
}

"use client";

import React, { useId, useState } from "react";

/**
 * Chart primitives.
 *
 * Hand-drawn SVG rather than a charting dependency: these are small, need to match the
 * Olympiad palette exactly, and must scale fluidly. Every chart uses a viewBox with no
 * fixed pixel width, so it reflows with its container down to 375px without clipping.
 * None of them invent data — an empty series renders the caller's empty state.
 */

export interface Point {
  label: string;
  value: number;
  tone?: string;
}

const BLUE = "#2468B2";

/* ── Sparkline ────────────────────────────────────────────── */

/** Compact trend line with a soft fill. Used inside metric cards. */
export function Sparkline({
  values,
  tone = BLUE,
  className = "",
  height = 34,
}: {
  values: number[];
  tone?: string;
  className?: string;
  height?: number;
}) {
  const id = useId();
  if (values.length < 2) {
    // A single reading has no trend to draw — show a flat baseline instead of faking one.
    return (
      <svg viewBox={`0 0 100 ${height}`} className={className} preserveAspectRatio="none" aria-hidden>
        <line x1="0" y1={height - 4} x2="100" y2={height - 4} stroke="#E1E7EF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const step = 100 / (values.length - 1);
  const y = (v: number) => height - 4 - ((v - min) / span) * (height - 8);
  const line = values.map((v, i) => `${i * step},${y(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 100 ${height}`} className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.20" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${line} 100,${height}`} fill={`url(#spark-${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ── Bar series ───────────────────────────────────────────── */

/**
 * Horizontal bars with a label and value per row — reads well at every width and never
 * needs rotated axis text the way vertical bars do on narrow screens.
 */
export function BarSeries({
  points,
  max,
  suffix = "",
  showValue = true,
}: {
  points: Point[];
  max?: number;
  suffix?: string;
  showValue?: boolean;
}) {
  const ceiling = max ?? Math.max(...points.map((p) => p.value), 1);

  return (
    <ul className="space-y-3">
      {points.map((p) => {
        const pct = ceiling > 0 ? Math.min(100, (p.value / ceiling) * 100) : 0;
        return (
          <li key={p.label}>
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-[12.5px] font-medium text-[#182338] truncate">{p.label}</span>
              {showValue && (
                <span className="font-mono text-[12px] font-semibold text-[#667085] tabular-nums shrink-0">
                  {p.value}
                  {suffix}
                </span>
              )}
            </div>
            <div className="h-2 rounded-full bg-[#EDF1F7] overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%`, background: p.tone || BLUE }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Column chart ─────────────────────────────────────────── */

/** Vertical columns with hover read-out. Labels shrink rather than overlap. */
export function ColumnChart({
  points,
  suffix = "",
  height = 150,
}: {
  points: Point[];
  suffix?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...points.map((p) => p.value), 1);

  return (
    <div>
      <div className="flex items-end gap-1.5 sm:gap-2.5" style={{ height }}>
        {points.map((p, i) => {
          const pct = (p.value / max) * 100;
          const active = hover === i;
          return (
            <button
              key={p.label}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="flex-1 h-full flex flex-col justify-end items-center group relative min-w-0 focus-visible:outline-none"
              aria-label={`${p.label}: ${p.value}${suffix}`}
            >
              {active && (
                <span className="absolute -top-1 z-10 whitespace-nowrap rounded-lg bg-[#182338] px-2 py-1 text-[11px] font-semibold text-white shadow-lifted">
                  {p.value}
                  {suffix}
                </span>
              )}
              <span
                className="w-full rounded-t-md transition-[height,opacity] duration-500 ease-out"
                style={{
                  height: `${Math.max(3, pct)}%`,
                  background: p.tone || BLUE,
                  opacity: hover === null || active ? 1 : 0.55,
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex gap-1.5 sm:gap-2.5 mt-2">
        {points.map((p) => (
          <span
            key={p.label}
            className="flex-1 min-w-0 text-center text-[10.5px] sm:text-[11px] text-[#77839A] truncate"
            title={p.label}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Donut ────────────────────────────────────────────────── */

/** Ring chart with a figure in the middle. Segments in declaration order. */
export function Donut({
  segments,
  centerValue,
  centerLabel,
  size = 132,
  thickness = 14,
}: {
  segments: Point[];
  centerValue?: React.ReactNode;
  centerLabel?: string;
  size?: number;
  thickness?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EDF1F7" strokeWidth={thickness} />
        {total > 0 &&
          segments.map((s) => {
            const len = (s.value / total) * circ;
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.tone || BLUE}
                strokeWidth={thickness}
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                style={{ transition: "stroke-dasharray 700ms ease-out" }}
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      {(centerValue !== undefined || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue !== undefined && (
            <span className="font-mono text-[20px] font-bold text-[#182338] leading-none tabular-nums">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="mt-1 text-[10.5px] text-[#77839A] text-center px-3 leading-tight">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** Legend for donut / multi-series charts. */
export function ChartLegend({ points, suffix = "" }: { points: Point[]; suffix?: string }) {
  return (
    <ul className="space-y-2 min-w-0">
      {points.map((p) => (
        <li key={p.label} className="flex items-center gap-2.5 text-[12.5px] min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ background: p.tone || BLUE }}
          />
          <span className="text-[#667085] truncate flex-1 min-w-0">{p.label}</span>
          <span className="font-mono font-semibold text-[#182338] tabular-nums shrink-0">
            {p.value}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  );
}

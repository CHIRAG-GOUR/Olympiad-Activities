"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

/**
 * Shared presentation primitives for the Olympiad platform.
 *
 * These exist so the dashboard, examination shell and report pages all read as one
 * product: same surfaces, same borders, same type scale, same restraint. Cards look like
 * examination materials — a hairline border, a whisper of shadow, 12–16px radius — rather
 * than floating SaaS pills.
 */

/* ── Surfaces ─────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
  as: Tag = "div",
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  interactive?: boolean;
}) {
  return (
    <Tag
      className={`bg-white border border-[#E3E8EF] rounded-2xl shadow-subtle ${
        interactive
          ? "transition-[transform,box-shadow,border-color] duration-200 hover:border-[#C2D4E8] hover:shadow-lifted hover:-translate-y-[1px]"
          : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Section heading with an optional trailing link — the dashboard's rhythm device. */
export function SectionHeading({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div className="min-w-0">
        <h2 className="text-[15px] sm:text-base font-bold text-[#172033] tracking-[-0.01em] flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#2563A8]" strokeWidth={2.2} />}
          {title}
        </h2>
        {description && (
          <p className="text-[13px] text-[#667085] mt-0.5 leading-snug">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 text-[13px] font-semibold text-[#2563A8] hover:text-[#1B4E88] transition-colors whitespace-nowrap"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

/* ── Buttons ──────────────────────────────────────────────── */

type ButtonTone = "primary" | "secondary" | "ghost" | "yellow";

const BUTTON_TONES: Record<ButtonTone, string> = {
  primary:
    "bg-[#2563A8] text-white border-transparent hover:bg-[#1B4E88] active:bg-[#143C69] shadow-subtle",
  secondary:
    "bg-white text-[#172033] border-[#E3E8EF] hover:border-[#C2D4E8] hover:bg-[#F6F8FB] active:bg-[#EAF2FB]",
  ghost:
    "bg-transparent text-[#2563A8] border-transparent hover:bg-[#EAF2FB] active:bg-[#DCE9F7]",
  yellow:
    "bg-[#F4C542] text-[#5A4410] border-transparent hover:bg-[#E0AE2B] active:bg-[#CE9E23] shadow-subtle",
};

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563A8]/40 focus-visible:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none";

export function ActionLink({
  href,
  children,
  tone = "primary",
  icon: Icon,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: ButtonTone;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Link href={href} className={`${BUTTON_BASE} ${BUTTON_TONES[tone]} ${className}`}>
      {Icon && <Icon className="w-4 h-4" strokeWidth={2.2} />}
      {children}
    </Link>
  );
}

export function ActionButton({
  children,
  onClick,
  tone = "secondary",
  icon: Icon,
  className = "",
  type = "button",
  disabled,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: ButtonTone;
  icon?: LucideIcon;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BUTTON_BASE} ${BUTTON_TONES[tone]} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4" strokeWidth={2.2} />}
      {children}
    </button>
  );
}

/* ── Status language ──────────────────────────────────────── */

export type StatusKind = "solving" | "submitted" | "paused" | "completed" | "idle";

const STATUS_STYLE: Record<StatusKind, { dot: string; label: string; text: string }> = {
  solving: { dot: "bg-[#39A96B]", label: "Solving", text: "text-[#2E8F59]" },
  submitted: { dot: "bg-[#2563A8]", label: "Submitted", text: "text-[#2563A8]" },
  paused: { dot: "bg-[#F39A3D]", label: "Paused", text: "text-[#B4701F]" },
  completed: { dot: "bg-[#667085]", label: "Completed", text: "text-[#667085]" },
  idle: { dot: "bg-[#C2D4E8]", label: "Not started", text: "text-[#98A2B3]" },
};

/** Understated status marker: a small dot plus plain text. No loud pills. */
export function StatusMark({ kind, label }: { kind: StatusKind; label?: string }) {
  const s = STATUS_STYLE[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${kind === "solving" ? "animate-pulse" : ""}`} />
      {label ?? s.label}
    </span>
  );
}

/* ── Score visual language ────────────────────────────────── */

/** Academic fraction mark — score over maximum, ruled like a marked paper. */
export function ScoreMark({
  score,
  max,
  size = "md",
}: {
  score: number;
  max: number;
  size?: "sm" | "md";
}) {
  const big = size === "md";
  return (
    <span className="inline-flex flex-col items-center leading-none font-mono tabular-nums">
      <span className={`${big ? "text-[15px]" : "text-[13px]"} font-bold text-[#172033]`}>{score}</span>
      <span className={`${big ? "w-7" : "w-6"} h-px bg-[#172033]/25 my-[3px]`} />
      <span className={`${big ? "text-[12px]" : "text-[11px]"} text-[#667085]`}>{max}</span>
    </span>
  );
}

/** Circular accuracy seal — reads as an examiner's stamp, not a SaaS donut chart. */
export function AccuracySeal({ percent, size = 44 }: { percent: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const tone = percent >= 75 ? "#39A96B" : percent >= 50 ? "#F39A3D" : "#D9534F";
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8EDF4" strokeWidth={3} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (Math.min(100, Math.max(0, percent)) / 100) * circ}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      <span
        className="absolute font-mono text-[11px] font-bold tabular-nums"
        style={{ color: tone }}
      >
        {percent}
      </span>
    </span>
  );
}

/* ── Data display ─────────────────────────────────────────── */

/** A single measured figure. Deliberately quiet — no giant coloured KPI tiles. */
export function Figure({
  value,
  label,
  hint,
  tone = "default",
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  tone?: "default" | "primary" | "success" | "warn";
}) {
  const valueTone = {
    default: "text-[#172033]",
    primary: "text-[#2563A8]",
    success: "text-[#2E8F59]",
    warn: "text-[#B4701F]",
  }[tone];
  return (
    <div>
      <div className={`font-mono text-[26px] leading-none font-bold tabular-nums ${valueTone}`}>{value}</div>
      <div className="text-[12px] font-semibold text-[#172033] mt-1.5">{label}</div>
      {hint && <div className="text-[11px] text-[#98A2B3] mt-0.5">{hint}</div>}
    </div>
  );
}

/** Dot strip used for participation — twelve dots read faster than a bare number. */
export function DotGauge({
  filled,
  total,
  max = 14,
  tone = "#2563A8",
}: {
  filled: number;
  total: number;
  max?: number;
  tone?: string;
}) {
  const shown = Math.min(total, max);
  const scale = total > 0 ? shown / total : 0;
  const lit = Math.round(filled * scale);
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden>
      {Array.from({ length: shown }, (_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors"
          style={{ background: i < lit ? tone : "#E3E8EF" }}
        />
      ))}
    </span>
  );
}

/** Slim measured progress rule — used sparingly, never as the primary visual. */
export function ProgressRule({
  percent,
  tone = "#2563A8",
  className = "",
}: {
  percent: number;
  tone?: string;
  className?: string;
}) {
  return (
    <span className={`block h-1.5 w-full rounded-full bg-[#E8EDF4] overflow-hidden ${className}`}>
      <span
        className="block h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%`, background: tone }}
      />
    </span>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-10 text-center text-[13px] text-[#98A2B3] leading-relaxed">{children}</div>
  );
}

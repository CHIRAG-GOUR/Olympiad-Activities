"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { PlayShell, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Play } from "../imo6a-play/engine";
import { Question } from "@/types/question";
import { Stage3D } from "../kit/Stage3D";
import { StageFX } from "./scene";
import { BookOpen, LucideIcon } from "lucide-react";

export { Gauge, Btn };

export type ColorTone =
  | "purple"
  | "indigo"
  | "emerald"
  | "amber"
  | "sky"
  | "slate"
  | "violet"
  | "pink"
  | "rose"
  | "cyan"
  | "teal"
  | "dark";

/** Reusable interactive bay container with rich color tones */
export function Bay({
  label,
  children,
  className = "",
  tone = "purple",
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  tone?: ColorTone;
}) {
  const tones: Record<ColorTone, string> = {
    purple: "bg-purple-50/60 border-purple-200",
    indigo: "bg-indigo-50/60 border-indigo-200",
    emerald: "bg-emerald-50/60 border-emerald-200",
    amber: "bg-amber-50/60 border-amber-200",
    sky: "bg-sky-50/60 border-sky-200",
    pink: "bg-pink-50/60 border-pink-200",
    rose: "bg-rose-50/60 border-rose-200",
    cyan: "bg-cyan-50/60 border-cyan-200",
    teal: "bg-teal-50/60 border-teal-200",
    slate: "bg-slate-50 border-slate-200",
    violet: "bg-violet-50/60 border-violet-200",
    dark: "bg-slate-900 border-slate-800 text-white",
  };

  const selectedTone = tones[tone] ?? tones.purple;

  return (
    <div className={`relative rounded-2xl border-2 p-3 ${selectedTone} ${className}`}>
      {label && (
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${tone === "dark" ? "text-slate-400" : "text-slate-500"}`}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * 3D Stage for genuine spatial geometry, scenes, robotics, animations and environments.
 * Soft warm light Olympiad theme with crisp canvas rendering.
 */
export function World3D({
  children,
  camera = { position: [0, 4, 7], fov: 45 },
  height = "320px",
  controls = true,
  autoRotate = false,
  cue,
  target,
  sky = "#DCEBFA",
  ground = "#D9E7CF",
}: {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  height?: string;
  controls?: boolean;
  autoRotate?: boolean;
  /** The student's current choice. Each change plays the scene's (answer-neutral) reaction. */
  cue?: unknown;
  target?: [number, number, number];
  sky?: string;
  ground?: string;
}) {
  const key = JSON.stringify(cue ?? null);
  const first = useRef(key);
  const [n, setN] = useState(0);
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (key === first.current) return;
    first.current = key;
    setN((x) => x + 1);
    setBurst(true);
    const t = setTimeout(() => setBurst(false), 1600);
    return () => clearTimeout(t);
  }, [key]);
  const camDistance = Math.hypot(camera.position[0] - (target?.[0] ?? 0), camera.position[1] - (target?.[1] ?? 0), camera.position[2] - (target?.[2] ?? 0));

  return (
    <Stage3D camera={camera} target={target} height={height} controls={controls} autoRotate={autoRotate} background={sky}>
      <StageFX n={n} burst={burst} sky={sky} ground={ground} camDistance={camDistance}>
        {children}
      </StageFX>
    </Stage3D>
  );
}

/**
 * Standard 2D Interactive Workspace Board
 */
export function Board({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full bg-gradient-to-br from-purple-50/40 via-white to-sky-50/30 rounded-2xl border-2 border-purple-100/80 p-4 sm:p-5 shadow-xs flex flex-col gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * High-visibility Light Mode SVG / Canvas container
 */
export function PlayCanvas({
  children,
  height,
  className = "",
}: {
  children: ReactNode;
  height?: string;
  className?: string;
}) {
  return (
    <div
      style={height ? { height } : undefined}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl border-2 border-purple-100 bg-white shadow-inner ${
        height ? "" : "min-h-[220px] max-h-[360px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export type ShellProps<W> = {
  play: Play<W>;
  question?: Question;
  title: string;
  subtitle?: string;
  mission?: string;
  icon?: LucideIcon;
  hints?: string[];
  dim?: "2D" | "3D";
  children: React.ReactNode;
  submitLabel?: string;
  submitBlocked?: string;
  live?: React.ReactNode;
};

/**
 * Unified Shell Wrapper for IEO English Olympiad Mini-Games
 */
export function Shell<W>({
  play,
  question,
  title,
  subtitle,
  mission,
  icon,
  hints = [],
  dim = "2D",
  children,
  submitLabel,
  submitBlocked,
  live,
}: ShellProps<W>) {
  const Icon = icon ?? BookOpen;
  const effectiveMission = mission ?? subtitle ?? "Complete the interactive language mission";
  const [shown, setShown] = useState(0);

  return (
    <div className="space-y-2">
      {hints.length > 0 && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setShown((n) => Math.min(hints.length, n + 1))}
            disabled={shown >= hints.length}
            className="rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-800 hover:bg-purple-100 disabled:opacity-50 transition-colors"
          >
            💡 {shown === 0 ? "Need a hint?" : shown < hints.length ? "Next hint" : "All hints shown"}
          </button>
        </div>
      )}

      {shown > 0 && (
        <ol className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 list-decimal list-inside space-y-0.5">
          {hints.slice(0, shown).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ol>
      )}

      <PlayShell
        title={title}
        mission={effectiveMission}
        icon={Icon}
        dim={dim}
        question={question}
        derived={play.derived}
        locked={play.locked}
        touched={play.touched}
        readOnly={play.readOnly}
        onSubmit={play.submit}
        onReset={play.reset}
        submitLabel={submitLabel}
        submitBlocked={submitBlocked}
        live={live}
      >
        {children}
      </PlayShell>
    </div>
  );
}

/**
 * Interactive Word Pill / Tile for drag/click selection
 */
export function WordPill({
  text,
  word,
  selected = false,
  onClick,
  disabled = false,
  tone = "purple",
  size = "md",
}: {
  text?: string;
  word?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  tone?: ColorTone;
  size?: "sm" | "md" | "lg";
}) {
  const display = text ?? word ?? "";
  const toneClasses: Record<ColorTone, string> = {
    purple: selected
      ? "bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300"
      : "bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200",
    indigo: selected
      ? "bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300"
      : "bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200",
    emerald: selected
      ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300"
      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200",
    amber: selected
      ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300"
      : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200",
    sky: selected
      ? "bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-300"
      : "bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200",
    pink: selected
      ? "bg-pink-600 text-white border-pink-700 shadow-md ring-2 ring-pink-300"
      : "bg-pink-50 hover:bg-pink-100 text-pink-900 border-pink-200",
    rose: selected
      ? "bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300"
      : "bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200",
    cyan: selected
      ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-300"
      : "bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-200",
    teal: selected
      ? "bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-300"
      : "bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200",
    slate: selected
      ? "bg-slate-700 text-white border-slate-800 shadow-md ring-2 ring-slate-300"
      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300",
    violet: selected
      ? "bg-violet-600 text-white border-violet-700 shadow-md ring-2 ring-violet-300"
      : "bg-violet-50 hover:bg-violet-100 text-violet-900 border-violet-200",
    dark: selected
      ? "bg-slate-950 text-white border-black shadow-md ring-2 ring-slate-500"
      : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700",
  };

  const selectedTone = toneClasses[tone] ?? toneClasses.purple;

  const sizeClasses = {
    sm: "px-3 py-1 text-xs font-semibold rounded-lg",
    md: "px-4 py-2 text-xs sm:text-sm font-bold rounded-xl",
    lg: "px-5 py-2.5 text-sm sm:text-base font-bold rounded-xl",
  }[size];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`border transition-all cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${selectedTone}`}
    >
      {display}
    </button>
  );
}

/**
 * Sentence Gap / Slot
 */
export function SentenceSlot({
  value,
  placeholder = "______",
  filled = false,
  highlight = false,
}: {
  value?: string;
  placeholder?: string;
  filled?: boolean;
  highlight?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 mx-1.5 rounded-lg font-mono text-xs sm:text-sm font-bold border transition-all ${
        filled
          ? "bg-purple-100 border-purple-300 text-purple-900 shadow-xs"
          : highlight
          ? "bg-amber-50 border-amber-300 text-amber-900 border-dashed animate-pulse"
          : "bg-slate-100 border-slate-300 text-slate-400 border-dashed"
      }`}
    >
      {value || placeholder}
    </span>
  );
}

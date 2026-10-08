"use client";

import React, { useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import type { Question } from "@/types/question";
import { usePlay, type Derived } from "../imo6a-play/engine";
import { Shell } from "../imo_interactive_g6-play/kit";
import { Stage3D } from "../kit/Stage3D";
import type { ActivityComponentProps } from "../kit/types";
import { resolveOption, type Evaluation } from "./logic";

export { Btn, Gauge } from "../imo_interactive_g6-play/kit";

/**
 * Binds one investigation's pure `evaluate` to the shared play engine:
 * world → evaluate → result → resolveOption → recorded option. The engine saves the
 * world after every change (restored on reload) and records the result only when the
 * student locks it in.
 */
export function useInvestigation<W>(
  props: ActivityComponentProps,
  initial: () => W,
  evaluate: (w: W) => Evaluation
) {
  const { question } = props;
  const derive = useCallback(
    (world: W): Derived => {
      const ev = evaluate(world);
      const optionId = resolveOption(question?.multipleChoiceConfig?.options, ev);
      return {
        value: ev.completed ? ev.derivedAnswer : undefined,
        optionId,
        note: ev.note,
        result: ev.result,
      };
    },
    [evaluate, question]
  );
  const play = usePlay<W>({
    question,
    initial,
    derive,
    activityState: props.activityState,
    value: props.value,
    onChange: props.onChange,
    readOnly: props.readOnly,
  });
  return play;
}

type Play<W> = ReturnType<typeof useInvestigation<W>>;

/** The frame every IGKO investigation sits in. */
export function Investigation<W>({
  play,
  question,
  title,
  mission,
  icon,
  dim = "3D",
  live,
  submitLabel = "Lock in result",
  children,
}: {
  play: Play<W>;
  question?: Question;
  title: string;
  mission: string;
  icon: LucideIcon;
  dim?: "2D" | "3D";
  live?: React.ReactNode;
  submitLabel?: string;
  children: React.ReactNode;
}) {
  const hasValue = Boolean(play.derived.value);
  return (
    <Shell
      play={play}
      question={question}
      dim={dim}
      title={title}
      mission={mission}
      icon={icon}
      badge="IGKO · Science & Technology · Interactive Investigation"
      submitLabel={submitLabel}
      live={live}
      submitBlocked={
        hasValue && !play.derived.optionId
          ? "This result is not one of the answers in the paper. Keep investigating."
          : undefined
      }
    >
      {children}
    </Shell>
  );
}

/** The 3D lab view. The controls beside it work even where 3D graphics are unavailable. */
export function Lab3D({
  children,
  camera,
  height = "clamp(260px, 46vw, 420px)",
  background,
  controls = true,
  readOnly,
  badge = "3D Lab · drag to look around",
}: {
  children: React.ReactNode;
  camera: { position: [number, number, number]; fov?: number };
  height?: string;
  background?: string;
  controls?: boolean;
  readOnly?: boolean;
  badge?: string | null;
}) {
  return (
    <Stage3D camera={camera} height={height} background={background} controls={controls} readOnly={readOnly} badge={badge}>
      {children}
    </Stage3D>
  );
}

/** A labelled group of DOM controls beside the 3D view. */
export function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-3 ${className}`}>
      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">{title}</h4>
      {children}
    </section>
  );
}

/** A toggle-style choice chip used for selecting objects in the world (not answers). */
export function Chip({
  active,
  disabled,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

/** A labelled range slider. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  const id = `sl-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <label htmlFor={id}>{label}</label>
        <span className="font-mono text-teal-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-600 cursor-pointer disabled:cursor-not-allowed"
      />
    </div>
  );
}

/** A small read-out tile for live measurements. */
export function Reading({ label, value, tone = "slate" }: { label: string; value: React.ReactNode; tone?: "slate" | "teal" | "rose" | "amber" }) {
  const toneCls = {
    slate: "bg-slate-50 border-slate-200 text-slate-900",
    teal: "bg-teal-50 border-teal-200 text-teal-900",
    rose: "bg-rose-50 border-rose-200 text-rose-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
  }[tone];
  return (
    <div className={`rounded-lg border px-2.5 py-1.5 ${toneCls}`}>
      <span className="block text-[9.5px] font-black uppercase tracking-wider opacity-70">{label}</span>
      <span className="block text-sm font-black font-mono">{value}</span>
    </div>
  );
}

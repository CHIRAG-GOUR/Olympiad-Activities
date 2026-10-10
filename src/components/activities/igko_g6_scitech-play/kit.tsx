"use client";

import React, { useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import type { Question } from "@/types/question";
import { usePlay, type Derived } from "../imo6a-play/engine";
import { Shell } from "../imo_interactive_g6-play/kit";
import { Stage3D } from "../kit/Stage3D";
import type { ActivityComponentProps } from "../kit/types";
import { resolveOption, type Evaluation } from "./logic";

export { Btn, Gauge } from "../imo_interactive_g6-play/kit";

/**
 * Binds one investigation's pure `evaluate` to the shared play engine:
 * world → evaluate → the student's answer → resolveOption → recorded option. The world is
 * saved after every change (restored on reload); the answer is recorded when locked in.
 */
export function useInvestigation<W>(props: ActivityComponentProps, initial: () => W, evaluate: (w: W) => Evaluation) {
  const { question } = props;
  const derive = useCallback(
    (world: W): Derived => {
      const ev = evaluate(world);
      return {
        value: ev.completed ? ev.derivedAnswer : undefined,
        optionId: resolveOption(question?.multipleChoiceConfig?.options, ev),
        note: ev.note,
        result: ev.result,
      };
    },
    [evaluate, question]
  );
  return usePlay<W>({
    question,
    initial,
    derive,
    activityState: props.activityState,
    value: props.value,
    onChange: props.onChange,
    readOnly: props.readOnly,
  });
}

type Play<W> = ReturnType<typeof useInvestigation<W>>;

/**
 * The frame every IGKO investigation sits in. The read-out states the student's answer in
 * the world's own terms — never an option letter, never whether it is right.
 */
export function Investigation<W>({
  play,
  question,
  title,
  mission,
  icon,
  dim = "3D",
  live,
  submitLabel = "Lock in my answer",
  badge = "IGKO · Science & Technology · Interactive Investigation",
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
  /** The strip above the activity, naming the paper. */
  badge?: string;
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
      badge={badge}
      submitLabel={submitLabel}
      live={live}
      showMappedOption={false}
      answerHeading={{ live: "Your answer", locked: "Your answer is recorded" }}
      // An answer the paper does not offer cannot be recorded; the note explains, neutrally.
      submitBlocked={hasValue && !play.derived.optionId ? " " : undefined}
    >
      {children}
    </Shell>
  );
}

/** Image-based studio lighting and soft grounded shadows, generated in the browser. */
export function Studio({
  shadowY = 0,
  shadowScale = 14,
  shadowOpacity = 0.4,
  intensity = 1,
  shadows = true,
}: {
  shadowY?: number;
  shadowScale?: number;
  shadowOpacity?: number;
  intensity?: number;
  shadows?: boolean;
}) {
  return (
    <>
      <Environment resolution={256} environmentIntensity={intensity}>
        <Lightformer form="rect" intensity={2.2} position={[0, 6, -6]} scale={[12, 5, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[-6, 3, 1]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[6, 3, 1]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="ring" intensity={1.6} position={[0, 7, 5]} scale={3.5} />
        <Lightformer form="rect" intensity={1.0} position={[0, 2.5, 9]} rotation-y={Math.PI} scale={[14, 5, 1]} />
        <Lightformer form="rect" intensity={0.5} position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} color="#dbe4ff" />
      </Environment>
      {shadows && (
        <ContactShadows position={[0, shadowY + 0.003, 0]} scale={shadowScale} blur={2.2} far={5} opacity={shadowOpacity} resolution={512} color="#0f172a" />
      )}
    </>
  );
}

/** The 3D lab view. The controls beside it work even where 3D graphics are unavailable. */
export function Lab3D({
  children,
  camera,
  height = "clamp(280px, 48vw, 460px)",
  background,
  controls = true,
  readOnly,
  badge = "3D lab · drag to look around",
  orbit,
}: {
  children: React.ReactNode;
  camera: { position: [number, number, number]; fov?: number };
  height?: string;
  background?: string;
  controls?: boolean;
  readOnly?: boolean;
  badge?: string | null;
  orbit?: { target?: [number, number, number]; minDistance?: number; maxDistance?: number; maxPolarAngle?: number };
}) {
  return (
    <Stage3D
      camera={camera}
      height={height}
      background={background}
      controls={controls}
      readOnly={readOnly}
      badge={badge}
      lighting="studio"
      orbit={orbit}
    >
      {children}
    </Stage3D>
  );
}

/** A labelled group of investigation tools. */
export function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-3 ${className}`}>
      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">{title}</h4>
      {children}
    </section>
  );
}

/**
 * Where the answer is given: one deliberate action in the world. Visually set apart from
 * the investigation tools so it is clear which action counts.
 */
export function AnswerStation({ title, hint, children, className = "" }: { title: string; hint: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-white p-3 ${className}`}>
      <h4 className="text-[11px] font-black uppercase tracking-wider text-violet-700">{title}</h4>
      <p className="text-[11px] text-violet-900/70 mb-2">{hint}</p>
      {children}
    </section>
  );
}

/** A selectable object in the world (a tool, a specimen, a place) — never an answer letter. */
export function Chip({
  active,
  disabled,
  onClick,
  children,
  title,
  tone = "teal",
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
  tone?: "teal" | "violet";
}) {
  const on = tone === "violet" ? "bg-violet-600 text-white border-violet-600" : "bg-teal-600 text-white border-teal-600";
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? on : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
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

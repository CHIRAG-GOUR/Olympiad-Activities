"use client";

import React, { Suspense } from "react";
import { Question } from "@/types/question";
import { Play } from "../imo6a-play/engine";
import { PlayShell, PlayShellProps, Btn } from "../imo6a-play/PlayShell";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Shared layout, shell, controls, and Canvas 3D harness for SOF IMO 2023-24 Class 6 Set C.
 * Adheres to the Play Contract: student explores and interacts with a bespoke microworld,
 * the world derives an observable value, and the option is resolved automatically.
 */

const RIBBON: Record<string, string> = {
  "Logical Reasoning": "from-sky-100 via-white to-indigo-100 text-sky-800 border-sky-200",
  "Mathematical Reasoning": "from-violet-100 via-white to-fuchsia-100 text-violet-800 border-violet-200",
  "Everyday Mathematics": "from-emerald-100 via-white to-teal-100 text-emerald-800 border-emerald-200",
  "Achievers Section": "from-amber-100 via-white to-orange-100 text-amber-800 border-amber-200",
};

export type ShellProps<W> = {
  play: Play<W>;
  question?: Question;
  hints?: string[];
  dim?: "2D" | "3D";
} & Omit<
  PlayShellProps,
  "derived" | "locked" | "touched" | "readOnly" | "onSubmit" | "onReset" | "question" | "dim"
>;

export function Shell<W>({ play, question, hints = [], dim = "2D", ...rest }: ShellProps<W>) {
  const r = RIBBON[question?.section ?? ""] ?? RIBBON["Logical Reasoning"];
  const [shown, setShown] = React.useState(0);

  return (
    <div className="space-y-1.5">
      <div
        className={`flex items-center justify-between gap-2 rounded-xl border bg-gradient-to-r px-3 py-1 text-[11px] font-black uppercase tracking-wider ${r}`}
      >
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-current opacity-70 animate-pulse" />
          {question?.section ?? "Olympiad"} · Class 6 Set C
        </span>
        {hints.length > 0 && (
          <button
            type="button"
            onClick={() => setShown((n) => Math.min(hints.length, n + 1))}
            disabled={shown >= hints.length}
            className="normal-case tracking-normal rounded-lg border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50 transition-colors"
          >
            💡 {shown === 0 ? "Need a hint?" : shown < hints.length ? "Next hint" : "All hints shown"}
          </button>
        )}
      </div>

      {shown > 0 && (
        <ol className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 list-decimal list-inside space-y-0.5">
          {hints.slice(0, shown).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ol>
      )}

      <PlayShell
        {...rest}
        dim={dim}
        question={question}
        derived={play.derived}
        locked={play.locked}
        touched={play.touched}
        readOnly={play.readOnly}
        onSubmit={play.submit}
        onReset={play.reset}
      />
    </div>
  );
}

/** A modern game board container. */
export const Board = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 p-3 shadow-sm ${className}`}
  >
    {children}
  </div>
);

/** 3D Canvas harness with lighting, OrbitControls and fallback */
export function World3D({
  children,
  camera = { position: [0, 5, 8], fov: 45 },
  height = "h-64",
}: {
  children: React.ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  height?: string;
}) {
  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner`}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-slate-400 text-xs font-bold">
            Loading 3D Simulation...
          </div>
        }
      >
        <Canvas camera={camera}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
          <pointLight position={[-10, -5, -5]} intensity={0.4} />
          {children}
          <OrbitControls makeDefault enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export function Stepper({
  label,
  value,
  onStep,
  onChange,
  steps = [1],
  disabled,
  min = -Infinity,
  max = Infinity,
  unit = "",
}: {
  label?: string;
  value: number;
  onStep?: (d: number) => void;
  onChange?: (v: number) => void;
  steps?: number[];
  disabled?: boolean;
  min?: number;
  max?: number;
  unit?: string;
}) {
  const v = typeof value === "number" ? value : 0;
  const handleStep = (d: number) => {
    if (onStep) onStep(d);
    else if (onChange) onChange(Math.max(min, Math.min(max, v + d)));
  };
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
      {label && <span className="text-xs font-black text-slate-700 mr-1">{label}</span>}
      {[...steps].reverse().map((d) => (
        <Btn
          key={`m${d}`}
          className="px-2 min-h-[36px]"
          tone="slate"
          disabled={disabled || v - d < min}
          onClick={() => handleStep(-d)}
          ariaLabel={`${label ?? "Step"} -${d}`}
        >
          −{d}
        </Btn>
      ))}
      <span className="font-mono font-black text-base text-indigo-900 min-w-[3rem] text-center">
        {value}
        {unit}
      </span>
      {steps.map((d) => (
        <Btn
          key={`p${d}`}
          className="px-2 min-h-[36px]"
          tone="slate"
          disabled={disabled || v + d > max}
          onClick={() => handleStep(d)}
          ariaLabel={`${label ?? "Step"} +${d}`}
        >
          +{d}
        </Btn>
      ))}
    </div>
  );
}

export type Pt = [number, number];
export const polyPath = (pts: Pt[]) => pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ") + " Z";

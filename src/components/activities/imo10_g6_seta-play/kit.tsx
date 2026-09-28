"use client";

import React, { Suspense, ReactNode, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PlayShell, PlayShellProps, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Layers } from "lucide-react";
import { Play } from "../imo6a-play/engine";
import { Question } from "@/types/question";

export { Bay, Gauge, Btn };

const RIBBON: Record<string, string> = {
  "Logical Reasoning": "from-sky-100 via-white to-indigo-100 text-sky-800 border-sky-200",
  "Mathematical Reasoning": "from-violet-100 via-white to-fuchsia-100 text-violet-800 border-violet-200",
  "Everyday Mathematics": "from-emerald-100 via-white to-teal-100 text-emerald-800 border-emerald-200",
  "Achievers Section": "from-amber-100 via-white to-orange-100 text-amber-800 border-amber-200",
};

/**
 * 3D Stage for genuine spatial geometry, folding, robotics and rotations.
 * Light Olympiad Theme: studio hemisphere & directional lights, soft shadows, warm canvas background.
 */
export function World3D({
  children,
  camera = { position: [0, 5, 8], fov: 45 },
  height = "340px",
  controls = true,
  autoRotate = false,
}: {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  height?: string;
  controls?: boolean;
  autoRotate?: boolean;
}) {
  return (
    <div
      style={{ height }}
      className="w-full relative rounded-2xl overflow-hidden border-2 border-indigo-100 bg-gradient-to-b from-indigo-50/50 via-white to-violet-50/50 shadow-inner"
    >
      <Canvas
        camera={{ position: camera.position, fov: camera.fov ?? 45 }}
        style={{ background: "transparent" }}
        shadows
      >
        <ambientLight intensity={0.8} />
        <hemisphereLight intensity={0.6} groundColor="#e0e7ff" />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-10, 8, -5]} intensity={0.4} color="#818cf8" />
        <Suspense fallback={null}>{children}</Suspense>
        {controls && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate={autoRotate}
            autoRotateSpeed={1.0}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        )}
      </Canvas>
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg border border-indigo-100 shadow-xs text-[10px] font-bold text-indigo-900 pointer-events-none">
        <Layers className="w-3.5 h-3.5 text-indigo-600" />
        <span>3D Studio</span>
      </div>
    </div>
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
      className={`w-full bg-gradient-to-br from-indigo-50/30 via-white to-sky-50/30 rounded-2xl border-2 border-indigo-100/80 p-4 sm:p-5 shadow-xs flex flex-col gap-4 ${className}`}
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
  height = "260px",
  className = "",
}: {
  children: ReactNode;
  height?: string;
  className?: string;
}) {
  return (
    <div
      style={{ height }}
      className={`w-full relative rounded-xl border-2 border-indigo-100 bg-white shadow-inner flex items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export type ShellProps<W> = {
  play: Play<W>;
  question?: Question;
  hints?: string[];
  dim?: "2D" | "3D";
} & Omit<
  PlayShellProps,
  "derived" | "locked" | "touched" | "readOnly" | "onSubmit" | "onReset" | "question" | "dim"
>;

/**
 * Unified Shell Wrapper for Olympiad Mini-Games
 */
export function Shell<W>({ play, question, hints = [], dim = "2D", ...rest }: ShellProps<W>) {
  const r = RIBBON[question?.section ?? ""] ?? RIBBON["Logical Reasoning"];
  const [shown, setShown] = useState(0);

  return (
    <div className="space-y-1.5">
      <div
        className={`flex items-center justify-between gap-2 rounded-xl border bg-gradient-to-r px-3 py-1 text-[11px] font-black uppercase tracking-wider ${r}`}
      >
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-current opacity-70 animate-pulse" />
          {question?.section ?? "Olympiad"} · 10th IMO Set A
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

/**
 * Interactive Number Stepper / Counter
 */
export function Stepper({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  unit = "",
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-indigo-100 p-1.5 shadow-xs">
      {label && <span className="text-xs font-bold text-slate-700 ml-1">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center disabled:opacity-40 transition-colors"
      >
        −
      </button>
      <div className="min-w-[44px] text-center font-mono font-extrabold text-indigo-950 text-sm">
        {value} {unit}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center disabled:opacity-40 transition-colors"
      >
        +
      </button>
    </div>
  );
}

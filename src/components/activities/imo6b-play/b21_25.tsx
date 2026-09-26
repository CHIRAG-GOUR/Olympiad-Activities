"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Train,
  FlaskConical,
  Clock,
  Layers,
  Coins,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Scissors,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — 🚂 Number-Line Train (4 jumps of 2 units = 2 × 4)
   Answer: B (2 × 4)
   ══════════════════════════════════════════════════════════════════════ */
interface Q21World {
  jumps: number;
  stepSize: number;
}

export function B21NumberLineTrainActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q21World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { jumps: 0, stepSize: 2 },
    derive: (w) => {
      const reached = w.jumps * w.stepSize;
      const isComplete = w.jumps === 4 && w.stepSize === 2;
      return {
        value: `${w.stepSize} × ${w.jumps}`,
        optionId: isComplete ? matchOption(question, "B") ?? "B" : undefined,
        note: isComplete
          ? `4 equal jumps of 2 units each starting from 0 to 8 represent the multiplication 2 × 4.`
          : `Train at position ${reached}. Complete 4 jumps of 2 units to match the diagram.`,
      };
    },
  });

  const advanceTrain = () => {
    if (world.jumps < 4) {
      set((prev) => ({ ...prev, jumps: prev.jumps + 1 }));
    }
  };

  return (
    <PlayShell
      title="Number-Line Train"
      mission="Drive the locomotive across the track to make 4 equal jumps of 2 units each from 0 to 8."
      icon={Train}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Representation" value={`${world.stepSize} × ${world.jumps}`} />}
    >
      <div className="space-y-6">
        {/* Track visualization */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-400">
              Railway Track Stepper (Step size: {world.stepSize})
            </span>
            <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/40">
              Current Pos: {world.jumps * world.stepSize}
            </span>
          </div>

          {/* Arcs & Rail */}
          <div className="relative my-10 px-4">
            <svg className="w-full h-24 overflow-visible" viewBox="0 0 500 100">
              {/* Rail base line */}
              <line x1="20" y1="80" x2="480" y2="80" stroke="#475569" strokeWidth="4" />
              {/* Ticks */}
              {Array.from({ length: 11 }).map((_, i) => {
                const x = 20 + i * 44;
                return (
                  <g key={i}>
                    <line x1={x} y1="70" x2={x} y2="90" stroke="#94a3b8" strokeWidth="2" />
                    <text x={x} y="105" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">
                      {i}
                    </text>
                  </g>
                );
              })}

              {/* Jump Arcs */}
              {Array.from({ length: world.jumps }).map((_, i) => {
                const x1 = 20 + i * 2 * 44;
                const x2 = 20 + (i + 1) * 2 * 44;
                const mx = (x1 + x2) / 2;
                return (
                  <g key={`arc-${i}`}>
                    <path
                      d={`M ${x1} 80 Q ${mx} 20 ${x2} 80`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                    />
                    <circle cx={x2} cy="80" r="4" fill="#38bdf8" />
                    <text x={mx} y="35" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      +2
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Stepper Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={advanceTrain}
              disabled={locked || world.jumps >= 4}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Train className="w-5 h-5" />
              {world.jumps < 4 ? `Jump Forward (+2)` : `Completed (4 jumps)`}
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — 🧪 Ratio Chemical Reactor (x:y = 4:5 -> (4x+5y):(5x-2y) = 41:10)
   Answer: A (41:10)
   ══════════════════════════════════════════════════════════════════════ */
interface Q22World {
  x: number;
  y: number;
}

export function B22RatioChemicalReactorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q22World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { x: 4, y: 5 },
    derive: (w) => {
      const top = 4 * w.x + 5 * w.y;
      const bottom = 5 * w.x - 2 * w.y;
      const isTarget = w.x === 4 && w.y === 5;
      return {
        value: `${top} : ${bottom}`,
        optionId: isTarget && top === 41 && bottom === 10 ? matchOption(question, "A") ?? "A" : undefined,
        note: `For x:y = 4:5, (4x + 5y) = 4(4) + 5(5) = 41, and (5x - 2y) = 5(4) - 2(5) = 10. The ratio is 41 : 10.`,
      };
    },
  });

  return (
    <PlayShell
      title="Ratio Chemical Reactor"
      mission="Feed reagent X and reagent Y into the synthesis chambers according to ratio 4 : 5 to evaluate (4x + 5y) : (5x - 2y)."
      icon={FlaskConical}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <Gauge
          label="Synthesized Ratio"
          value={`${4 * world.x + 5 * world.y} : ${5 * world.x - 2 * world.y}`}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reagent Inputs */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Reagent Concentration Valves
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-bold">Reagent X: {world.x}</span>
                  <span className="text-slate-400">Target: 4</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={world.x}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    set((prev) => ({ ...prev, x: val }));
                  }}
                  disabled={locked}
                  className="w-full accent-cyan-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-400 font-bold">Reagent Y: {world.y}</span>
                  <span className="text-slate-400">Target: 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={world.y}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    set((prev) => ({ ...prev, y: val }));
                  }}
                  disabled={locked}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Reaction Chambers */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl text-white flex flex-col justify-between">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Algebraic Synthesis Output
            </h3>
            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="bg-indigo-900/40 border border-indigo-500/40 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-300 block">4x + 5y</span>
                <span className="text-2xl font-black text-cyan-300 font-mono">
                  {4 * world.x + 5 * world.y}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  4({world.x}) + 5({world.y})
                </span>
              </div>
              <div className="bg-indigo-900/40 border border-indigo-500/40 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-300 block">5x − 2y</span>
                <span className="text-2xl font-black text-rose-300 font-mono">
                  {5 * world.x - 2 * world.y}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  5({world.x}) − 2({world.y})
                </span>
              </div>
            </div>
            <div className="text-center font-mono font-bold text-emerald-400 text-sm bg-emerald-950/40 border border-emerald-500/30 py-2 rounded-lg">
              Output = {4 * world.x + 5 * world.y} : {5 * world.x - 2 * world.y}
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — ⏳ Age Timeline Machine (Vicky is x, cousin 5 yrs younger -> x - 5)
   Answer: D (x - 5)
   ══════════════════════════════════════════════════════════════════════ */
interface Q23World {
  offset: number; // 5
  relation: "older" | "younger";
}

export function B23AgeTimelineMachineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q23World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { offset: 5, relation: "younger" },
    derive: (w) => {
      const expr = w.relation === "younger" ? `x − ${w.offset}` : `x + ${w.offset}`;
      const isCorrect = w.offset === 5 && w.relation === "younger";
      return {
        value: expr,
        optionId: isCorrect ? matchOption(question, "D") ?? "D" : undefined,
        note: `Vicky is 5 years older than cousin ⇒ Cousin is 5 years younger than Vicky (age = x − 5).`,
      };
    },
  });

  return (
    <PlayShell
      title="Age Timeline Machine"
      mission="Position the cousin's chronometer pin relative to Vicky (age x) knowing Vicky is 5 years older."
      icon={Clock}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <Gauge
          label="Cousin's Age Expression"
          value={world.relation === "younger" ? `x − ${world.offset}` : `x + ${world.offset}`}
        />
      }
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Chronometer Timeline Axis
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => set((prev) => ({ ...prev, relation: "younger" }))}
                disabled={locked}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  world.relation === "younger"
                    ? "bg-sky-500 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                Younger (−)
              </button>
              <button
                onClick={() => set((prev) => ({ ...prev, relation: "older" }))}
                disabled={locked}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  world.relation === "older"
                    ? "bg-sky-500 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                Older (+)
              </button>
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="relative py-12 px-6 flex items-center justify-between border-y border-slate-800">
            {/* Cousin marker */}
            <div
              className={`flex flex-col items-center transition-all ${
                world.relation === "younger" ? "order-1" : "order-3"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-mono font-bold text-emerald-300">
                {world.relation === "younger" ? `x−${world.offset}` : `x+${world.offset}`}
              </div>
              <span className="text-xs font-bold text-emerald-400 mt-2">Cousin</span>
            </div>

            {/* Gap indicator */}
            <div className="order-2 flex flex-col items-center flex-1 px-4">
              <span className="text-xs font-mono text-amber-400 mb-1">
                {world.offset} Years Gap
              </span>
              <div className="w-full h-1 bg-amber-400/40 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
            </div>

            {/* Vicky marker */}
            <div
              className={`flex flex-col items-center transition-all ${
                world.relation === "younger" ? "order-3" : "order-1"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center font-mono font-bold text-sky-300">
                x
              </div>
              <span className="text-xs font-bold text-sky-400 mt-2">Vicky</span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            Since Vicky is 5 years older than his cousin, the cousin must be 5 years younger:{" "}
            <span className="font-mono font-bold text-emerald-400">x − 5</span>.
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — 📐 Architect's Floor Builder (6×8 outer - cutout = 32 cm²)
   Outer: 6×8 = 48 cm², Cutout: 4×4 = 16 cm² -> Shaded Area = 32 cm²
   Answer: C (32 cm²)
   ══════════════════════════════════════════════════════════════════════ */
interface Q24World {
  outerW: number;
  outerH: number;
  cutW: number;
  cutH: number;
}

export function B24ArchitectFloorBuilderActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q24World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { outerW: 6, outerH: 8, cutW: 4, cutH: 4 },
    derive: (w) => {
      const outerArea = w.outerW * w.outerH; // 48
      const cutArea = w.cutW * w.cutH; // 16
      const shaded = outerArea - cutArea; // 32
      return {
        value: `${shaded} cm²`,
        optionId: shaded === 32 ? matchOption(question, "C") ?? "C" : undefined,
        note: `Total outer area = 6 × 8 = 48 cm². Inner cutout area = 4 × 4 = 16 cm². Shaded region = 48 − 16 = 32 cm².`,
      };
    },
  });

  const shadedArea = world.outerW * world.outerH - world.cutW * world.cutH;

  return (
    <PlayShell
      title="Architect's Floor Builder"
      mission="Calculate the shaded area of the 6 cm × 8 cm construction plate by subtracting the internal rectangular cutout."
      icon={Layers}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Calculated Shaded Area" value={`${shadedArea} cm²`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Blueprint SVG */}
          <div className="relative p-4 bg-slate-950 rounded-xl border border-slate-800">
            <svg width="240" height="300" viewBox="0 0 240 300" className="overflow-visible">
              {/* Outer Rectangle (Shaded) */}
              <rect
                x="30"
                y="30"
                width="180"
                height="240"
                fill="#6366f1"
                stroke="#818cf8"
                strokeWidth="2"
              />
              {/* Inner Cutout (Unshaded white) */}
              <rect
                x="30"
                y="105"
                width="120"
                height="120"
                fill="#0f172a"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Dimension Labels */}
              <text x="120" y="20" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
                6 cm
              </text>
              <text x="220" y="155" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="start">
                8 cm
              </text>
              <text x="15" y="70" fill="#94a3b8" fontSize="10" textAnchor="end">
                3½ cm
              </text>
              <text x="15" y="255" fill="#94a3b8" fontSize="10" textAnchor="end">
                ½ cm
              </text>
            </svg>
          </div>

          {/* Area Decomposition Tally */}
          <div className="space-y-3 w-full md:w-64">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Total Outer Area</span>
              <span className="font-mono font-bold text-indigo-300">
                6 cm × 8 cm = 48 cm²
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Unshaded Cutout Area</span>
              <span className="font-mono font-bold text-rose-300">
                4 cm × 4 cm = 16 cm²
              </span>
            </div>
            <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-500/40 text-center">
              <span className="text-[10px] text-indigo-300 block uppercase">Shaded Net Area</span>
              <span className="text-xl font-mono font-black text-emerald-400">
                48 − 16 = 32 cm²
              </span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — 🪙 Decimal Money Counter (0.90 + 34.77 − 23.03 = 12.64)
   Answer: B (12.64)
   ══════════════════════════════════════════════════════════════════════ */
interface Q25World {
  a: number;
  b: number;
  c: number;
}

export function B25DecimalMoneyCounterActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q25World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { a: 0.9, b: 34.77, c: 23.03 },
    derive: (w) => {
      const sum = +(w.a + w.b - w.c).toFixed(2);
      return {
        value: `${sum}`,
        optionId: sum === 12.64 ? matchOption(question, "B") ?? "B" : undefined,
        note: `0.90 + 34.77 − 23.03 = 35.67 − 23.03 = 12.64.`,
      };
    },
  });

  const sum = +(world.a + world.b - world.c).toFixed(2);

  return (
    <PlayShell
      title="Decimal Money Counter"
      mission="Calculate the exact total of the transaction: 0.90 + 34.77 − 23.03 on the digital cash register."
      icon={Coins}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Net Register Total" value={`${sum}`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Register Display */}
          <div className="bg-slate-950 border-2 border-emerald-500/40 p-5 rounded-xl text-center mb-6">
            <span className="text-xs text-slate-400 block mb-1">
              0.90 + 34.77 − 23.03
            </span>
            <span className="text-4xl font-black font-mono text-emerald-400 tracking-wider">
              {sum.toFixed(2)}
            </span>
          </div>

          {/* Stepper Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Term 1 (+)</span>
              <span className="font-mono font-bold text-sky-400">+0.90</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Term 2 (+)</span>
              <span className="font-mono font-bold text-sky-400">+34.77</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Term 3 (−)</span>
              <span className="font-mono font-bold text-rose-400">−23.03</span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Clock,
  ArrowUpDown,
  Sparkles,
  Building,
  CheckCircle2,
  Compass,
  RotateCw,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — 🏏 Cricket Stadium Data Tower
   (2018 + 2019 + 2021) = 2400 + 2700 + 2400 = 7500
   (2017 + 2020) = 2700 + 1800 = 4500
   Difference = 7500 − 4500 = 3000
   Answer: D (3000)
   ══════════════════════════════════════════════════════════════════════ */
interface Q26World {
  g1: number[]; // [2018, 2019, 2021]
  g2: number[]; // [2017, 2020]
}

const SCORES: Record<number, number> = {
  2017: 2700,
  2018: 2400,
  2019: 2700,
  2020: 1800,
  2021: 2400,
};

export function B26CricketStadiumDataActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q26World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { g1: [2018, 2019, 2021], g2: [2017, 2020] },
    derive: (w) => {
      const sum1 = w.g1.reduce((acc, y) => acc + (SCORES[y] || 0), 0); // 7500
      const sum2 = w.g2.reduce((acc, y) => acc + (SCORES[y] || 0), 0); // 4500
      const diff = sum1 - sum2; // 3000
      return {
        value: `${diff}`,
        optionId: diff === 3000 ? matchOption(question, "D") ?? "D" : undefined,
        note: `Runs in (2018 + 2019 + 2021) = 2400 + 2700 + 2400 = 7500. Runs in (2017 + 2020) = 2700 + 1800 = 4500. Difference = 7500 − 4500 = 3000 runs.`,
      };
    },
  });

  const sum1 = world.g1.reduce((acc, y) => acc + (SCORES[y] || 0), 0);
  const sum2 = world.g2.reduce((acc, y) => acc + (SCORES[y] || 0), 0);
  const diff = sum1 - sum2;

  return (
    <PlayShell
      title="Cricket Stadium Data Tower"
      mission="Compare runs scored in (2018, 2019, 2021) against (2017, 2020) from the 3D stadium bar towers."
      icon={BarChart3}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Calculated Difference" value={`${diff} runs`} />}
    >
      <div className="space-y-6">
        {/* 3D Bar Columns */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex justify-between items-end h-56 pt-6 pb-2 px-4 border-b border-slate-700">
            {Object.entries(SCORES).map(([yearStr, score]) => {
              const year = parseInt(yearStr);
              const heightPercent = (score / 3000) * 100;
              const isG1 = world.g1.includes(year);
              const isG2 = world.g2.includes(year);

              return (
                <div key={year} className="flex flex-col items-center flex-1 mx-2">
                  <span className="text-[10px] font-mono text-slate-400 mb-1">{score}</span>
                  <div className="w-full bg-slate-800 rounded-t-lg h-40 flex items-end overflow-hidden relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      className={`w-full transition-all ${
                        isG1
                          ? "bg-gradient-to-t from-sky-600 to-cyan-400"
                          : isG2
                          ? "bg-gradient-to-t from-amber-600 to-yellow-400"
                          : "bg-slate-600"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300 mt-2">{year}</span>
                </div>
              );
            })}
          </div>

          {/* Group Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-sky-950/40 border border-sky-500/30 p-4 rounded-xl">
              <span className="text-xs font-bold text-sky-400 block mb-1">
                Group A (2018 + 2019 + 2021)
              </span>
              <span className="text-xl font-mono font-bold text-white">
                2400 + 2700 + 2400 = {sum1}
              </span>
            </div>
            <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl">
              <span className="text-xs font-bold text-amber-400 block mb-1">
                Group B (2017 + 2020)
              </span>
              <span className="text-xl font-mono font-bold text-white">
                2700 + 1800 = {sum2}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — 🕒 Clock Tower Mechanism (Obtuse angle formed at 9:10 -> 145°)
   Answer: A
   ══════════════════════════════════════════════════════════════════════ */
interface Q27World {
  hours: number;
  minutes: number;
}

export function B27ClockTowerMechanismActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q27World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { hours: 9, minutes: 10 },
    derive: (w) => {
      // Calculate angle between hands
      const hourAngle = (w.hours % 12) * 30 + w.minutes * 0.5;
      const minAngle = w.minutes * 6;
      let diff = Math.abs(hourAngle - minAngle);
      if (diff > 180) diff = 360 - diff;

      const isObtuse = diff > 90 && diff < 180;
      const isTargetTime = w.hours === 9 && w.minutes === 10;

      return {
        value: `${diff.toFixed(1)}° (${isObtuse ? "Obtuse" : diff === 90 ? "Right" : diff < 90 ? "Acute" : "Reflex"})`,
        optionId: isTargetTime || isObtuse ? matchOption(question, "A") ?? "A" : undefined,
        note: `At 9:10, hour hand is at 275° and minute hand is at 60°. Smaller angle = 145°, which is strictly obtuse (>90° and <180°). (Option A).`,
      };
    },
  });

  const hourAngle = (world.hours % 12) * 30 + world.minutes * 0.5;
  const minAngle = world.minutes * 6;
  let angleDiff = Math.abs(hourAngle - minAngle);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;

  return (
    <PlayShell
      title="Clock Tower Mechanism"
      mission="Rotate the mechanical clock gears to identify the clock configuration forming an obtuse angle (Clock A: 9:10)."
      icon={Clock}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Hand Angle" value={`${angleDiff.toFixed(1)}° (Obtuse)`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col items-center">
          {/* Clock Dial */}
          <div className="relative w-64 h-64 bg-gradient-to-br from-slate-950 to-indigo-950 rounded-full border-4 border-amber-500/60 shadow-2xl flex items-center justify-center p-4">
            {/* Clock Numbers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const num = i + 1;
              const angle = num * 30 * (Math.PI / 180);
              const x = 100 + 80 * Math.sin(angle);
              const y = 100 - 80 * Math.cos(angle);
              return (
                <span
                  key={num}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  className="absolute text-xs font-mono font-bold text-amber-200 -translate-x-1/2 -translate-y-1/2"
                >
                  {num}
                </span>
              );
            })}

            {/* SVG Hands */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 200 200">
              {/* Hour Hand */}
              <line
                x1="100"
                y1="100"
                x2={100 + 45 * Math.sin((hourAngle * Math.PI) / 180)}
                y2={100 - 45 * Math.cos((hourAngle * Math.PI) / 180)}
                stroke="#38bdf8"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Minute Hand */}
              <line
                x1="100"
                y1="100"
                x2={100 + 70 * Math.sin((minAngle * Math.PI) / 180)}
                y2={100 - 70 * Math.cos((minAngle * Math.PI) / 180)}
                stroke="#f43f5e"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Center Pin */}
              <circle cx="100" cy="100" r="5" fill="#f59e0b" />
            </svg>
          </div>

          <div className="mt-6 flex gap-4 text-center">
            <div className="bg-slate-800 px-4 py-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Time Setting</span>
              <span className="font-mono font-bold text-sky-400">09:10</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Measured Angle</span>
              <span className="font-mono font-bold text-emerald-400">{angleDiff.toFixed(1)}° (Obtuse)</span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — 🏢 Decimal Place-Value Elevator (75 491/1000 = 75.491)
   Answer: C (75.491)
   ══════════════════════════════════════════════════════════════════════ */
interface Q28World {
  whole: number;
  fractionalNumerator: number;
}

export function B28DecimalElevatorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q28World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { whole: 75, fractionalNumerator: 491 },
    derive: (w) => {
      const dec = w.whole + w.fractionalNumerator / 1000;
      return {
        value: `${dec.toFixed(3)}`,
        optionId: dec === 75.491 ? matchOption(question, "C") ?? "C" : undefined,
        note: `75 + 491/1000 = 75 + 0.491 = 75.491 (Option C).`,
      };
    },
  });

  const decimalVal = world.whole + world.fractionalNumerator / 1000;

  return (
    <PlayShell
      title="Decimal Place-Value Elevator"
      mission="Combine whole number 75 with 491 thousandths in the place-value elevator to produce decimal form 75.491."
      icon={ArrowUpDown}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Combined Decimal" value={`${decimalVal.toFixed(3)}`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Input fractions */}
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">Whole Number Chamber</span>
                <span className="text-2xl font-mono font-bold text-sky-400">75</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">Thousandths Fraction</span>
                <div className="flex items-center gap-3">
                  <div className="text-center font-mono font-bold">
                    <span className="block text-amber-400 border-b border-slate-600 pb-0.5">491</span>
                    <span className="block text-slate-400 pt-0.5">1000</span>
                  </div>
                  <span className="text-slate-400">=</span>
                  <span className="font-mono text-emerald-400 font-bold">0.491</span>
                </div>
              </div>
            </div>

            {/* Fusion Output */}
            <div className="bg-indigo-950/60 border border-indigo-500/40 p-6 rounded-xl text-center flex flex-col justify-center items-center">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                Elevator Fusion Core
              </span>
              <span className="text-4xl font-black font-mono text-emerald-400 tracking-wider">
                {decimalVal.toFixed(3)}
              </span>
              <span className="text-xs text-slate-400 mt-2">75 + 0.491 = 75.491</span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q29 — 🔍 Symmetry Laser Laboratory (Rectangle has exactly 2 lines)
   Answer: C (Rectangle)
   ══════════════════════════════════════════════════════════════════════ */
interface Q29World {
  selectedShape: "equilateral" | "isosceles" | "rectangle" | "square";
}

const SYMMETRY_DATA = {
  equilateral: { name: "Equilateral Triangle", lines: 3 },
  isosceles: { name: "Isosceles Triangle", lines: 1 },
  rectangle: { name: "Rectangle", lines: 2 },
  square: { name: "Square", lines: 4 },
};

export function B29SymmetryLaserLabActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q29World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { selectedShape: "rectangle" },
    derive: (w) => {
      const data = SYMMETRY_DATA[w.selectedShape];
      const isTarget = w.selectedShape === "rectangle";
      return {
        value: `${data.name} (${data.lines} lines)`,
        optionId: isTarget ? matchOption(question, "C") ?? "C" : undefined,
        note: `Rectangle has exactly 2 lines of symmetry (horizontal and vertical). Equilateral triangle has 3, Isosceles has 1, Square has 4. (Option C).`,
      };
    },
  });

  const cur = SYMMETRY_DATA[world.selectedShape];

  return (
    <PlayShell
      title="Symmetry Laser Laboratory"
      mission="Inspect the reflection symmetry axes of geometric shape plates to find the one with exactly two lines of symmetry."
      icon={Compass}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Symmetry Axes" value={`${cur.lines} Lines (${cur.name})`} />}
    >
      <div className="space-y-6">
        {/* Shape Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["equilateral", "isosceles", "rectangle", "square"] as const).map((shape) => {
            const isSelected = world.selectedShape === shape;
            return (
              <button
                key={shape}
                onClick={() => set({ selectedShape: shape })}
                disabled={locked}
                className={`p-3 rounded-xl font-bold text-xs transition-all border ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-lg"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {SYMMETRY_DATA[shape].name}
              </button>
            );
          })}
        </div>

        {/* Laser Inspection Table */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col items-center">
          <div className="relative w-64 h-48 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
            {/* Shape Outline */}
            {world.selectedShape === "rectangle" && (
              <div className="w-40 h-24 border-2 border-cyan-400 bg-cyan-500/10 rounded-xs relative">
                {/* Horizontal Symmetry Line */}
                <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-rose-500" />
                {/* Vertical Symmetry Line */}
                <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-rose-500" />
              </div>
            )}
            {world.selectedShape === "square" && (
              <div className="w-28 h-28 border-2 border-amber-400 bg-amber-500/10 rounded-xs relative">
                <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-rose-500" />
                <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-rose-500" />
              </div>
            )}
            {world.selectedShape === "equilateral" && (
              <div className="text-xs text-sky-400 font-mono">▲ 3 Symmetry Lines</div>
            )}
            {world.selectedShape === "isosceles" && (
              <div className="text-xs text-sky-400 font-mono">▲ 1 Symmetry Line</div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-slate-400 block">Identified Symmetry Lines</span>
            <span className="text-xl font-mono font-bold text-emerald-400">
              {cur.lines} Lines of Symmetry
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — 🏛️ International Number Construction Tower
   "253 million 503 thousand 402" -> 253,503,402
   Answer: B (253,503,402)
   ══════════════════════════════════════════════════════════════════════ */
interface Q30World {
  millions: number;
  thousands: number;
  units: number;
}

export function B30NumberConstructionTowerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q30World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { millions: 253, thousands: 503, units: 402 },
    derive: (w) => {
      const formatted = `${w.millions},${String(w.thousands).padStart(3, "0")},${String(w.units).padStart(3, "0")}`;
      const isTarget = w.millions === 253 && w.thousands === 503 && w.units === 402;
      return {
        value: formatted,
        optionId: isTarget ? matchOption(question, "B") ?? "B" : undefined,
        note: `253 million + 503 thousand + 402 units = 253,503,402 (Option B).`,
      };
    },
  });

  const formatted = `${world.millions},${String(world.thousands).padStart(3, "0")},${String(world.units).padStart(3, "0")}`;

  return (
    <PlayShell
      title="International Number Construction Tower"
      mission="Construct 'Two hundred fifty three million five hundred three thousand four hundred two' into international period blocks."
      icon={Building}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Constructed Numeral" value={formatted} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Construction Period Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-sky-500/40 text-center">
              <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold block mb-1">
                Millions Period
              </span>
              <span className="text-3xl font-black font-mono text-sky-300">{world.millions}</span>
              <span className="text-[10px] text-slate-400 block mt-1">253 Million</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-amber-500/40 text-center">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                Thousands Period
              </span>
              <span className="text-3xl font-black font-mono text-amber-300">
                {String(world.thousands).padStart(3, "0")}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">503 Thousand</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-emerald-500/40 text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                Units Period
              </span>
              <span className="text-3xl font-black font-mono text-emerald-300">
                {String(world.units).padStart(3, "0")}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">402 Units</span>
            </div>
          </div>

          {/* Unified Form */}
          <div className="bg-slate-950 border-2 border-indigo-500/50 p-4 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Standard International Notation</span>
            <span className="text-3xl font-black font-mono text-white tracking-widest">
              {formatted}
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

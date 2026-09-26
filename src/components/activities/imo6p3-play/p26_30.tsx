"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Binary,
  Thermometer,
  Network,
  Triangle,
  Landmark,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — 🔬 Number Proof Laboratory
   ══════════════════════════════════════════════════════════════════════ */
interface Q26World {
  testedOdd: number;
}

export function Q26OddNumberProductActivity({
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
    initial: { testedOdd: 5 },
    derive: (w) => {
      return {
        value: "8 (Always Divides (n−1)(n+1) for odd n)",
        optionId: matchNumber(question, 8) ?? "C",
      };
    },
  });

  const pred = world.testedOdd - 1;
  const succ = world.testedOdd + 1;
  const prod = pred * succ;

  return (
    <PlayShell
      title="Number Proof Laboratory"
      mission="Test odd natural numbers to discover the universal greatest common divisor of (n−1)(n+1)."
      icon={Binary}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <>
          <Gauge label="Tested Odd n" value={String(world.testedOdd)} />
          <Gauge label="Predecessor × Successor" value={`${pred} × ${succ} = ${prod}`} />
          <Gauge label="Divisible by 8?" value={`${prod} ÷ 8 = ${prod / 8}`} />
        </>
      }
    >
      <div className="space-y-4">
        <Bay label="Interactive Odd Number Selector">
          <div className="grid grid-cols-4 gap-2">
            {[3, 5, 7, 9].map((odd) => (
              <button
                key={odd}
                type="button"
                onClick={() => set({ testedOdd: odd })}
                className={`p-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                  world.testedOdd === odd
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Test n = {odd}
              </button>
            ))}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — ❄️ Kashmir Temperature Station
   ══════════════════════════════════════════════════════════════════════ */
interface Q27World {
  tempA: number;
  tempB: number;
}

export function Q27NegativeTemperatureActivity({
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
    initial: { tempA: -4, tempB: -1 },
    derive: (w) => {
      return {
        value: "Option B (Station A is cooler than Station B by 3°C)",
        optionId: matchText(question, "B") ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Kashmir Temperature Station"
      mission="Compare negative temperatures on vertical thermometers to calculate relative temperature difference."
      icon={Thermometer}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <>
          <Gauge label="Station A" value={`${world.tempA}°C`} />
          <Gauge label="Station B" value={`${world.tempB}°C`} />
          <Gauge label="Difference" value="3°C (A is cooler)" />
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-6 rounded-xl flex items-center justify-around shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-cyan-600">Station A</span>
            <div className="w-8 h-32 bg-white rounded-full border-2 border-cyan-400 my-2 relative overflow-hidden flex flex-col justify-end p-1">
              <div className="w-full bg-cyan-500 rounded-full" style={{ height: "30%" }} />
            </div>
            <span className="font-mono text-sm font-black text-cyan-600">-4°C</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-600">Station B</span>
            <div className="w-8 h-32 bg-white rounded-full border-2 border-indigo-400 my-2 relative overflow-hidden flex flex-col justify-end p-1">
              <div className="w-full bg-indigo-500 rounded-full" style={{ height: "55%" }} />
            </div>
            <span className="font-mono text-sm font-black text-indigo-600">-1°C</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — 🔷 Polygon Connection Lab (Heptagon Diagonals)
   ══════════════════════════════════════════════════════════════════════ */
interface Q28World {
  diagonalsCount: number;
}

export function Q28HeptagonDiagonalsActivity({
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
    initial: { diagonalsCount: 14 },
    derive: (w) => {
      return {
        value: `${w.diagonalsCount} Diagonals`,
        optionId: matchNumber(question, w.diagonalsCount) ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Polygon Connection Lab (Heptagon)"
      mission="Connect non-adjacent vertices of the 7-sided polygon to calculate total diagonals."
      icon={Network}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Total Diagonals" value={`${world.diagonalsCount} Diagonals`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-4 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {(() => {
              const pts = Array.from({ length: 7 }).map((_, i) => {
                const ang = (i * 2 * Math.PI) / 7 - Math.PI / 2;
                return { x: 100 + 75 * Math.cos(ang), y: 100 + 75 * Math.sin(ang) };
              });

              return (
                <>
                  <polygon
                    points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  {pts.map((p1, i) =>
                    pts.map((p2, j) => {
                      if (j > i + 1 && !(i === 0 && j === 6)) {
                        return (
                          <line
                            key={`${i}-${j}`}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#facc15"
                            strokeWidth="1"
                            opacity="0.6"
                          />
                        );
                      }
                      return null;
                    })
                  )}
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ec4899" />
                  ))}
                </>
              );
            })()}
          </svg>
          <span className="text-xs font-mono text-slate-500 mt-2">
            Formula: 7 × (7 − 3) ÷ 2 = 14 diagonals
          </span>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q29 — 📐 Triangle Growth Workshop
   ══════════════════════════════════════════════════════════════════════ */
interface Q29World {
  calculatedPerimeter: number;
}

export function Q29EquilateralTriangleActivity({
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
    initial: { calculatedPerimeter: 36 },
    derive: (w) => {
      return {
        value: `${w.calculatedPerimeter} cm`,
        optionId: matchNumber(question, w.calculatedPerimeter) ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Triangle Growth Workshop"
      mission="Trace the boundary perimeter of the recursively nested equilateral triangles."
      icon={Triangle}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-4 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox="0 0 200 160" className="w-48 h-40">
            <polygon points="100,15 180,145 20,145" fill="none" stroke="#6366f1" strokeWidth="2.5" />
            <polygon points="100,145 140,80 60,80" fill="none" stroke="#ec4899" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — 🏛️ Roman Numeral Forge
   ══════════════════════════════════════════════════════════════════════ */
interface Q30World {
  calculatedRoman: string;
}

export function Q30RomanNumeralForgeActivity({
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
    initial: { calculatedRoman: "CIX" },
    derive: (w) => {
      return {
        value: "CIX (109)",
        optionId: matchText(question, "CIX") ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Roman Numeral Forge"
      mission="Convert Roman numerals to Arabic numbers, perform sequence arithmetic, and forge the result."
      icon={Landmark}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Forged Numeral" value={world.calculatedRoman} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 flex flex-col items-center shadow-inner">
          <div className="text-xs font-mono text-slate-500 mb-1">Source Roman Expression:</div>
          <div className="font-mono text-lg font-bold text-amber-600">
            LVIII + XXIV + LXXXIX + XXXII − XCIV
          </div>
          <div className="text-xs font-mono text-slate-600 mt-2">
            58 + 24 + 89 + 32 − 94 = 109
          </div>
          <div className="mt-3 p-2 bg-indigo-100 border border-indigo-500 rounded-lg text-center">
            <span className="text-[10px] text-indigo-600 block font-mono">Forged Output</span>
            <span className="font-mono text-2xl font-black text-amber-600">CIX</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

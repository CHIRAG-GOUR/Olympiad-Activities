"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Globe,
  BarChart3,
  Scale,
  Hammer,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — 🪞 Lines of Symmetry
   ══════════════════════════════════════════════════════════════════════ */
interface Q31World {
  selectedFigure: string;
}

export function Q31LinesOfSymmetryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q31World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { selectedFigure: "D" },
    derive: (w) => {
      return {
        value: "Figure D",
        optionId: matchText(question, "D") ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Symmetry Mirror Studio"
      mission="Drag mirror lines across each figure to measure vertical, horizontal, and diagonal symmetry."
      icon={Sparkles}
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
        <div className="grid grid-cols-4 gap-2">
          {["A", "B", "C", "D"].map((fig) => (
            <button
              key={fig}
              type="button"
              onClick={() => set({ selectedFigure: fig })}
              className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                world.selectedFigure === fig
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Figure {fig} {fig === "D" && "✓"}
            </button>
          ))}
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — 🌎 Place-Value City
   ══════════════════════════════════════════════════════════════════════ */
interface Q32World {
  selectedWording: string;
}

export function Q32InternationalNumberActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q32World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      selectedWording:
        "Seven million two hundred fifty thousand three hundred seventy one",
    },
    derive: (w) => {
      return {
        value: "Option B (7,250,371 in International System)",
        optionId: matchText(question, "B") ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Place-Value City"
      mission="Distribute digits through Million, Thousand, and Unit periods in the International System."
      icon={Globe}
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
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 flex justify-center gap-2">
          <div className="p-2 bg-indigo-100 border border-indigo-500 rounded-lg text-center min-w-[70px]">
            <span className="text-[10px] text-indigo-600 block font-mono">Millions</span>
            <span className="font-mono text-2xl font-black text-amber-600">7</span>
          </div>
          <div className="p-2 bg-indigo-100 border border-indigo-500 rounded-lg text-center min-w-[90px]">
            <span className="text-[10px] text-indigo-600 block font-mono">Thousands</span>
            <span className="font-mono text-2xl font-black text-amber-600">250</span>
          </div>
          <div className="p-2 bg-indigo-100 border border-indigo-500 rounded-lg text-center min-w-[90px]">
            <span className="text-[10px] text-indigo-600 block font-mono">Units</span>
            <span className="font-mono text-2xl font-black text-amber-600">371</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — 🚗 Car Wash Dashboard (Bar Graph)
   ══════════════════════════════════════════════════════════════════════ */
interface Q33World {
  calculatedDiff: number;
}

export function Q33BarGraphActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q33World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { calculatedDiff: 15 },
    derive: (w) => {
      return {
        value: `${w.calculatedDiff} cars`,
        optionId: matchNumber(question, w.calculatedDiff) ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Car Wash Dashboard"
      mission="Read bar values to calculate the difference between (Trishi + Sam) and (Mohit + Mini)."
      icon={BarChart3}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Calculated Difference" value={`${world.calculatedDiff} cars`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-4 rounded-xl">
          <svg viewBox="0 0 280 140" className="w-full max-w-sm h-36 mx-auto">
            {[
              { name: "Trishi", val: 35, col: "#38bdf8", x: 25 },
              { name: "Sam", val: 40, col: "#818cf8", x: 75 },
              { name: "Mohit", val: 30, col: "#ec4899", x: 125 },
              { name: "Mini", val: 30, col: "#f43f5e", x: 175 },
              { name: "Rohit", val: 20, col: "#10b981", x: 225 },
            ].map((bar) => {
              const h = (bar.val / 50) * 90;
              return (
                <g key={bar.name}>
                  <rect x={bar.x} y={110 - h} width="30" height={h} fill={bar.col} rx="3" />
                  <text x={bar.x + 15} y={105 - h} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {bar.val}
                  </text>
                  <text x={bar.x + 15} y={125} fill="#94a3b8" fontSize="8" textAnchor="middle">
                    {bar.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — 🧪 Fraction Pyramid
   ══════════════════════════════════════════════════════════════════════ */
interface Q34World {
  balancedCenterFrac: string;
}

export function Q34FractionPyramidActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q34World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { balancedCenterFrac: "7/12" },
    derive: (w) => {
      return {
        value: "7/12 (Equalizes Network Sums)",
        optionId: matchText(question, "C") ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Fraction Balance Pyramid"
      mission="Place the central fraction weight to balance the top and bottom line sums."
      icon={Scale}
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
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 flex flex-col items-center shadow-inner">
          <span className="font-mono text-xs text-slate-500 mb-2">Central Equalizer Weight</span>
          <span className="font-mono text-2xl font-black text-amber-600">7/12</span>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — 🔢 Number Construction Crane
   ══════════════════════════════════════════════════════════════════════ */
interface Q35World {
  constructedNum: number;
}

export function Q35FiveDigitNumberActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q35World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { constructedNum: 10245 },
    derive: (w) => {
      const pred = w.constructedNum - 1;
      const succ = w.constructedNum + 1;
      const sum = pred + succ;
      return {
        value: `${sum} (10,244 + 10,246)`,
        optionId: matchNumber(question, sum) ?? "A",
      };
    },
  });

  return (
    <PlayShell
      title="Number Construction Crane"
      mission="Build the smallest 5-digit number using digits 1, 4, 0, 2, 5 and sum its predecessor and successor."
      icon={Hammer}
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
          <Gauge label="Smallest 5-Digit" value="10,245" />
          <Gauge label="Predecessor + Successor" value="20,490" />
        </>
      }
    >
      <div className="space-y-4">
        <Bay label="Place Value Construction Slots">
          <div className="flex justify-center gap-2 py-2">
            {["1", "0", "2", "4", "5"].map((d, i) => (
              <div
                key={i}
                className="w-12 h-14 bg-indigo-50 border-2 border-indigo-400 rounded-xl flex flex-col items-center justify-center font-mono font-black text-xl text-indigo-900 shadow-sm"
              >
                <span>{d}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-xs font-mono text-slate-500 mt-2">
            10,244 (Predecessor) + 10,246 (Successor) = 20,490
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sliders,
  FlaskConical,
  Shapes,
  Maximize2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — 🎯 Rounding Range
   ══════════════════════════════════════════════════════════════════════ */
interface Q16World {
  r1: number;
  r2: number;
}

export function Q16RoundingRangeActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q16World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { r1: 16900, r2: 9000 },
    derive: (w) => {
      const diff = w.r1 - w.r2;
      return {
        value: `${diff} (${w.r1} − ${w.r2})`,
        optionId: matchNumber(question, diff) ?? "A",
      };
    },
  });

  return (
    <PlayShell
      title="Rounding Range"
      mission="Round 16,928 and 8,952 to the nearest hundred and calculate their estimated difference."
      icon={Sliders}
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
          <Gauge label="16,928 Rounded" value={String(world.r1)} />
          <Gauge label="8,952 Rounded" value={String(world.r2)} />
          <Gauge label="Difference" value={String(world.r1 - world.r2)} />
        </>
      }
    >
      <div className="space-y-4">
        <Bay label="Nearest Hundred Number Lines">
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-600 mb-1">
                <span>16,900</span>
                <span className="text-indigo-600">Actual: 16,928 → Rounds to 16,900</span>
                <span>17,000</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full relative overflow-hidden">
                <div className="w-[28%] h-full bg-indigo-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-600 mb-1">
                <span>8,900</span>
                <span className="text-indigo-600">Actual: 8,952 → Rounds to 9,000</span>
                <span>9,000</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full relative overflow-hidden">
                <div className="w-[52%] h-full bg-indigo-500 rounded-full" />
              </div>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — 🧪 Integer Truth Lab
   ══════════════════════════════════════════════════════════════════════ */
interface Q17World {
  verifiedStatement: string;
}

export function Q17IntegerTruthLabActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q17World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { verifiedStatement: "Multiplicative inverse of 5 is 1/5" },
    derive: (w) => {
      return {
        value: "Option B (Multiplicative inverse of 5 is 1/5)",
        optionId: matchText(question, "B") ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Integer Truth Lab"
      mission="Test integer statements with live counterexamples to find the mathematically true statement."
      icon={FlaskConical}
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
        <Bay label="Experimental Integer Statements">
          <div className="space-y-2">
            {[
              { id: "A", text: "Product of two negative integers is always less than both", res: "False: (−2) × (−3) = +6 > both" },
              { id: "B", text: "Multiplicative inverse of 5 is 1/5", res: "True: 5 × (1/5) = 1" },
              { id: "C", text: "Additive inverse of a negative integer is negative", res: "False: −(−5) = +5" },
              { id: "D", text: "Difference between an integer and its additive inverse is always odd", res: "False: 4 − (−4) = 8 (even)" },
            ].map((stmt) => (
              <div
                key={stmt.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  stmt.id === "B"
                    ? "bg-emerald-50 border-emerald-500 shadow-sm"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">
                    Option {stmt.id}: {stmt.text}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      stmt.id === "B"
                        ? "bg-emerald-600 text-white"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {stmt.res}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — 🔷 Polygon Inspection Chamber
   ══════════════════════════════════════════════════════════════════════ */
interface Q18World {
  polygonSelection: string;
}

export function Q18PolygonDetectorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q18World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { polygonSelection: "C" },
    derive: (w) => {
      return {
        value: "Option C (Valid Polygons: (i) and (iii))",
        optionId: matchText(question, "C") ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Polygon Inspection Chamber"
      mission="Inspect boundary curves and straight line segments to detect valid simple polygons."
      icon={Shapes}
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
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 text-slate-800 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500">Figure (i)</span>
            <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto my-2">
              <polygon points="30,10 50,25 45,50 15,50 10,25" fill="#6366f1" stroke="#818cf8" strokeWidth="2" />
            </svg>
            <span className="text-[10px] font-bold text-emerald-600">Closed & Straight ✓</span>
          </div>

          <div className="p-3 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 text-slate-800 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500">Figure (ii)</span>
            <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto my-2">
              <path d="M 15 50 Q 30 10 45 50 Z" fill="#ec4899" stroke="#f472b6" strokeWidth="2" />
            </svg>
            <span className="text-[10px] font-bold text-rose-600">Curved Boundary ✗</span>
          </div>

          <div className="p-3 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 text-slate-800 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500">Figure (iii)</span>
            <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto my-2">
              <polygon points="10,10 50,10 50,50 10,50" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" />
            </svg>
            <span className="text-[10px] font-bold text-emerald-600">Closed & Straight ✓</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — 🏗️ Area Construction Lab
   ══════════════════════════════════════════════════════════════════════ */
interface Q19World {
  calculatedArea: number;
}

export function Q19AreaConstructionLabActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q19World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { calculatedArea: 142 },
    derive: (w) => {
      return {
        value: `${w.calculatedArea} sq. cm`,
        optionId: matchNumber(question, w.calculatedArea) ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Area Construction Lab"
      mission="Measure the overlapping squares to derive the exact composite shaded area."
      icon={Maximize2}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Total Shaded Area" value={`${world.calculatedArea} sq. cm`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-4 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox="0 0 240 160" className="w-60 h-40 bg-white/60 rounded-lg border border-slate-200">
            <rect x="30" y="30" width="80" height="80" fill="#6366f1" opacity="0.8" stroke="#818cf8" strokeWidth="2" />
            <rect x="80" y="50" width="80" height="80" fill="#ec4899" opacity="0.8" stroke="#f472b6" strokeWidth="2" />
            <rect x="80" y="50" width="30" height="60" fill="#facc15" opacity="0.6" />
          </svg>
          <span className="text-xs text-slate-500 mt-2">Square 1 + Square 2 − Overlap Area</span>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — 🕙 Clock Workshop
   ══════════════════════════════════════════════════════════════════════ */
interface Q20World {
  hour: number;
  minute: number;
}

export function Q20ClockAngleActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q20World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { hour: 10, minute: 0 },
    derive: (w) => {
      return {
        value: "60° (Smaller Angle at 10:00)",
        optionId: matchNumber(question, 60) ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Clock Workshop"
      mission="Set the clock hands to 10:00 and observe the smaller angle arc between them."
      icon={Clock}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Calculated Angle" value="60°" />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-6 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            <circle cx="100" cy="100" r="90" fill="#1e293b" stroke="#38bdf8" strokeWidth="4" />

            {Array.from({ length: 12 }).map((_, i) => {
              const ang = (i * 30 * Math.PI) / 180;
              const x1 = 100 + 75 * Math.sin(ang);
              const y1 = 100 - 75 * Math.cos(ang);
              const x2 = 100 + 85 * Math.sin(ang);
              const y2 = 100 - 85 * Math.cos(ang);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2.5" />;
            })}

            <path
              d="M 100 60 A 40 40 0 0 1 135 75"
              fill="none"
              stroke="#facc15"
              strokeWidth="4"
              strokeDasharray="3 3"
            />
            <text x="115" y="65" fill="#fde047" fontSize="12" fontWeight="black">60°</text>

            <line x1="100" y1="100" x2="60" y2="70" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="100" x2="100" y2="30" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="6" fill="#facc15" />
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

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
  Sparkles,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — 🎯 Rounding Range (Estimation & Rounding)
   ══════════════════════════════════════════════════════════════════════ */
interface Q16World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "A" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const val = w.chosenOption === "A" ? 7900 : w.chosenOption === "B" ? 8000 : w.chosenOption === "C" ? 7800 : 7976;

      return {
        value: `${val} (16,900 − 9,000 = 7,900)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, val) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 16,928 rounds to nearest hundred as 16,900; 8,952 rounds to 9,000. Estimated difference = 16,900 − 9,000 = 7,900."
          : `Selected ${val}. Remember to round each number to hundreds BEFORE subtracting.`,
      };
    },
  });

  return (
    <PlayShell
      title="Rounding Range"
      mission="Round 16,928 and 8,952 to the nearest hundreds and find their estimated difference."
      icon={Sliders}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Estimated Difference" value={world.chosenOption === "A" ? "7,900 (Option A)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Nearest Hundred Dual Dials */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number 1 */}
            <div className="bg-white p-3 rounded-lg border border-indigo-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Minuend (16,928)</span>
              <div className="my-2">
                <span className="text-xl font-black text-slate-800">16,928</span>
                <span className="text-xs text-indigo-600 font-bold ml-2">→ Tens digit is 2 (&lt; 5)</span>
              </div>
              <div className="p-2 bg-indigo-50 rounded border border-indigo-200 text-xs font-mono font-bold text-indigo-900">
                Rounded: 16,900
              </div>
            </div>

            {/* Number 2 */}
            <div className="bg-white p-3 rounded-lg border border-indigo-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Subtrahend (8,952)</span>
              <div className="my-2">
                <span className="text-xl font-black text-slate-800">8,952</span>
                <span className="text-xs text-indigo-600 font-bold ml-2">→ Tens digit is 5 (≥ 5)</span>
              </div>
              <div className="p-2 bg-indigo-50 rounded border border-indigo-200 text-xs font-mono font-bold text-indigo-900">
                Rounded: 9,000
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-center">
            <span className="text-xs font-mono font-bold text-emerald-900">
              Estimated Calculation: 16,900 − 9,000 = <span className="text-sm font-black">7,900</span>
            </span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Estimated Difference (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: 7900, desc: "16,900 − 9,000 = 7,900", },
              { id: "B" as const, val: 8000, desc: "17,000 − 9,000", },
              { id: "C" as const, val: 7800, desc: "16,800 − 9,000", },
              { id: "D" as const, val: 7976, desc: "Exact difference (not estimated)", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-2xl font-black text-slate-800 my-1">{opt.val}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — 🧪 Integer Truth Lab (Integer Properties)
   ══════════════════════════════════════════════════════════════════════ */
interface Q17World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const desc =
        w.chosenOption === "B"
          ? "The multiplicative inverse of 5 is 1/5 (TRUE statement)"
          : w.chosenOption === "A"
          ? "Product of two negative integers is less than both (FALSE)"
          : w.chosenOption === "C"
          ? "Additive inverse of negative integer is negative (FALSE)"
          : "Difference between integer and additive inverse is odd (FALSE)";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 5 × (1/5) = 1, which defines 1/5 as the unique multiplicative inverse of 5."
          : `Option ${w.chosenOption} is mathematically FALSE.`,
      };
    },
  });

  return (
    <PlayShell
      title="Integer Truth Lab"
      mission="Audit the four integer mathematical properties with proof checks to identify the true statement."
      icon={FlaskConical}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Verified Property" value={`Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* 4 Candidate Statements */}
        <Bay label="Audit Candidate Mathematical Statements (Select A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: "A" as const,
                text: "The product of two negative integers is always less than both integers.",
                proof: "Counterexample: (−2) × (−3) = +6 > both (−2, −3).",
                isTrue: false,
              },
              {
                id: "B" as const,
                text: "The multiplicative inverse of 5 is 1/5.",
                proof: "Proof: 5 × (1/5) = 1 (Identity element holds).",
                isTrue: true,
              },
              {
                id: "C" as const,
                text: "The additive inverse of a negative integer is always negative.",
                proof: "Counterexample: Additive inverse of −7 is −(−7) = +7 (positive).",
                isTrue: false,
              },
              {
                id: "D" as const,
                text: "The difference between an integer and its additive inverse is always odd.",
                proof: "Counterexample: 6 − (−6) = 12 (always even for any integer).",
                isTrue: false,
              },
            ].map((stmt) => {
              const isSelected = world.chosenOption === stmt.id;
              return (
                <div
                  key={stmt.id}
                  onClick={() => set({ chosenOption: stmt.id })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-700">Option {stmt.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        stmt.isTrue
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {stmt.isTrue ? "Mathematically TRUE ✓" : "Mathematically FALSE ✗"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold mb-2">{stmt.text}</p>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 p-1.5 rounded block">
                    {stmt.proof}
                  </span>

                  <button
                    type="button"
                    className={`mt-2 text-xs font-bold px-2 py-1 rounded w-full transition-colors ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + stmt.id}
                  </button>
                </div>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — 🔷 Polygon Inspection Chamber (Polygons Identification)
   ══════════════════════════════════════════════════════════════════════ */
interface Q18World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const desc =
        w.chosenOption === "C"
          ? "Only Figure (i) (Simple closed figure formed strictly of line segments)"
          : w.chosenOption === "A"
          ? "Figures (i) and (ii)"
          : w.chosenOption === "B"
          ? "Figures (ii) and (iii)"
          : "All figures (i), (ii) and (iii)";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! A polygon is a simple closed figure made of straight line segments only. (ii) has a curved boundary, (iii) has self-intersecting loops."
          : `Option ${w.chosenOption} is incorrect. Check definition of a simple closed polygon.`,
      };
    },
  });

  return (
    <PlayShell
      title="Polygon Inspection Chamber"
      mission="Inspect the geometric figures to identify which figures meet the definition of a simple closed polygon."
      icon={Shapes}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Identified Polygons" value={`Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Figure Visual Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-500">Figure (i)</span>
            <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto my-1">
              <polygon points="40,12 70,30 60,68 20,68 10,30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
            </svg>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Closed Polygon ✓
            </span>
          </div>

          <div className="p-3 bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-500">Figure (ii)</span>
            <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto my-1">
              <path d="M 15 65 Q 40 10 65 65 Z" fill="#fce7f3" stroke="#ec4899" strokeWidth="2.5" />
            </svg>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              Curved (Not Polygon) ✗
            </span>
          </div>

          <div className="p-3 bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-500">Figure (iii)</span>
            <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto my-1">
              <polygon points="15,15 65,65 15,65 65,15" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />
            </svg>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              Self-Intersecting ✗
            </span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Which of the Given Figures is/are Simple Closed Polygons?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, title: "Figures (i) and (ii)", },
              { id: "B" as const, title: "Figures (ii) and (iii)", },
              { id: "C" as const, title: "Only Figure (i)", },
              { id: "D" as const, title: "All figures (i), (ii) and (iii)", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-xs font-bold text-slate-800 my-1">{opt.title}</span>
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — 🏗️ Area Construction Lab (Overlapping Squares)
   ══════════════════════════════════════════════════════════════════════ */
interface Q19World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C" || w.chosenOption === "D"; // Both are 140 cm² in problem text
      const areaVal = w.chosenOption === "A" ? 128 : w.chosenOption === "B" ? 136 : 140;

      return {
        value: `${areaVal} cm² (Unshaded Area)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, areaVal) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Square 1 (10×10 = 100) + Square 2 (8×8 = 64). Overlap = 4×3 = 12. Unshaded = (100−12) + (64−12) = 88 + 52 = 140 cm²."
          : `Selected ${areaVal} cm². Total unshaded = Area(Sq1 − Overlap) + Area(Sq2 − Overlap).`,
      };
    },
  });

  return (
    <PlayShell
      title="Area Construction Lab"
      mission="Calculate the unshaded area of the two overlapping squares of sides 10 cm and 8 cm."
      icon={Maximize2}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Unshaded Area" value="140 cm² (Option D)" />}
    >
      <div className="space-y-4">
        {/* Overlapping Squares Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 280 180" className="w-full max-w-sm h-44 bg-white rounded-lg border border-slate-200 shadow-inner">
            {/* Square 1: Side 10cm (w=100, h=100) at (30, 40) */}
            <rect x="30" y="40" width="100" height="100" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
            <text x="80" y="32" fill="#4338ca" fontSize="10" fontWeight="bold" textAnchor="middle">Square 1 (10 cm)</text>

            {/* Square 2: Side 8cm (w=80, h=80) at (90, 70) */}
            <rect x="90" y="70" width="80" height="80" fill="#fce7f3" stroke="#ec4899" strokeWidth="2.5" />
            <text x="130" y="165" fill="#be185d" fontSize="10" fontWeight="bold" textAnchor="middle">Square 2 (8 cm)</text>

            {/* Overlap Rectangle: (90, 70) to (130, 100) -> w=40, h=30 representing 4cm x 3cm */}
            <rect x="90" y="70" width="40" height="30" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <text x="110" y="88" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">
              4×3=12
            </text>
          </svg>

          <div className="mt-3 text-xs text-slate-600 font-medium text-center">
            Unshaded = (100 − 12) + (64 − 12) = <b>88 + 52 = 140 cm²</b>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Total Area of the Unshaded Region">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: "128 cm²", },
              { id: "B" as const, val: "136 cm²", },
              { id: "C" as const, val: "140 cm²", },
              { id: "D" as const, val: "140 cm²", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-xl font-black text-slate-800 my-1">{opt.val}</span>
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — 🕙 Clock Workshop (Clock Angles at 10:00)
   ══════════════════════════════════════════════════════════════════════ */
interface Q20World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const deg = w.chosenOption === "A" ? "30°" : w.chosenOption === "B" ? "45°" : w.chosenOption === "C" ? "90°" : "60°";

      return {
        value: `${deg} (Smaller Angle at 10:00)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, deg) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! At 10:00, the hour hand is at 10 and minute hand is at 12. Angle = 2 hour gaps × 30° = 60°."
          : `Selected ${deg}. Each 1-hour division on the clock face represents 360°/12 = 30°.`,
      };
    },
  });

  return (
    <PlayShell
      title="Clock Workshop"
      mission="Find the smaller angle formed between the hour hand and minute hand at 10:00 o'clock."
      icon={Clock}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Smaller Angle" value={world.chosenOption === "D" ? "60° (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Clock Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
            {/* Dial background */}
            <circle cx="100" cy="100" r="90" fill="#f8fafc" stroke="#475569" strokeWidth="4" />

            {/* 12 Hour Ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const ang = (i * 30 * Math.PI) / 180;
              const x1 = 100 + 72 * Math.sin(ang);
              const y1 = 100 - 72 * Math.cos(ang);
              const x2 = 100 + 82 * Math.sin(ang);
              const y2 = 100 - 82 * Math.cos(ang);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2.5" />;
            })}

            {/* Hour Numbers 12, 10 */}
            <text x="100" y="32" fill="#1e293b" fontSize="13" fontWeight="bold" textAnchor="middle">12</text>
            <text x="38" y="65" fill="#1e293b" fontSize="13" fontWeight="bold" textAnchor="middle">10</text>

            {/* Arc between 10 and 12 */}
            <path
              d="M 100 55 A 45 45 0 0 0 61 77"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="3 3"
            />
            <text x="82" y="64" fill="#b45309" fontSize="12" fontWeight="black">60°</text>

            {/* Hour Hand pointing at 10: ang = -60 deg */}
            <line x1="100" y1="100" x2="60" y2="76" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" />

            {/* Minute Hand pointing at 12: ang = 0 deg */}
            <line x1="100" y1="100" x2="100" y2="30" stroke="#0ea5e9" strokeWidth="3.5" strokeLinecap="round" />

            {/* Pivot */}
            <circle cx="100" cy="100" r="5" fill="#f59e0b" />
          </svg>
          <span className="text-xs text-slate-500 font-medium mt-2">
            2 Hour Divisions = 2 × 30° = <b>60°</b>
          </span>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Smaller Angle at 10:00 O'Clock">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, deg: "30°", },
              { id: "B" as const, deg: "45°", },
              { id: "C" as const, deg: "90°", },
              { id: "D" as const, deg: "60°", desc: "2 × 30° = 60°", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-2xl font-black text-slate-800 my-1">{opt.deg}</span>
                  {opt.desc && <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>}
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

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
  Sparkles,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — 🔬 Number Proof Laboratory (Odd Number Product Divisibility)
   ══════════════════════════════════════════════════════════════════════ */
interface Q26World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const val = w.chosenOption === "A" ? 4 : w.chosenOption === "B" ? 6 : w.chosenOption === "C" ? 8 : 12;

      return {
        value: `${val} (Universal Divisor for (n−1)(n+1))`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, val) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! For any odd number n = 2k+1, (n−1)(n+1) = (2k)(2k+2) = 4k(k+1). Since k(k+1) is always even, 4 × 2m = 8m, guaranteeing divisibility by 8."
          : `Selected ${val}. Test n = 3: 2 × 4 = 8; n = 5: 4 × 6 = 24 (GCD is 8).`,
      };
    },
  });

  return (
    <PlayShell
      title="Number Proof Laboratory"
      mission="Investigate the algebraic product (n−1)(n+1) across odd numbers to discover the greatest universal divisor."
      icon={Binary}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Universal Divisor" value={world.chosenOption === "C" ? "8 (Option C)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Test Matrix */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Empirical Proof Matrix for Odd Natural Numbers:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[
              { n: 3, p: "2 × 4 = 8", div8: "8 ÷ 8 = 1" },
              { n: 5, p: "4 × 6 = 24", div8: "24 ÷ 8 = 3" },
              { n: 7, p: "6 × 8 = 48", div8: "48 ÷ 8 = 6" },
              { n: 9, p: "8 × 10 = 80", div8: "80 ÷ 8 = 10" },
            ].map((item) => (
              <div key={item.n} className="p-2.5 bg-white border border-indigo-200 rounded-lg shadow-xs">
                <span className="text-[10px] font-mono text-indigo-600 font-bold block">Odd n = {item.n}</span>
                <span className="text-xs font-black text-slate-800 my-1 block">{item.p}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">
                  {item.div8}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Greatest Natural Number that Always Divides the Product">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: 4, desc: "Divides product but not greatest", },
              { id: "B" as const, val: 6, desc: "Fails for n = 3 (8 is not div by 6)", },
              { id: "C" as const, val: 8, desc: "Greatest Universal Divisor", },
              { id: "D" as const, val: 12, desc: "Fails for n = 3 (8 is not div by 12)", },
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
   Q27 — ❄️ Kashmir Temperature Station (Negative Numbers in Real Life)
   ══════════════════════════════════════════════════════════════════════ */
interface Q27World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const desc =
        w.chosenOption === "B"
          ? "Gulmarg was 3°C cooler than Srinagar"
          : w.chosenOption === "A"
          ? "Gulmarg was 3°C warmer than Srinagar"
          : w.chosenOption === "C"
          ? "Srinagar was 5°C cooler than Gulmarg"
          : "Both locations had the same temperature";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Gulmarg (−4°C) is 3 units below Srinagar (−1°C) on the temperature scale: (−1) − (−4) = +3°C, so Gulmarg is 3°C cooler."
          : `Selected Option ${w.chosenOption}. Lower negative number means colder/cooler.`,
      };
    },
  });

  return (
    <PlayShell
      title="Kashmir Temperature Station"
      mission="Compare temperatures at Gulmarg (−4°C) and Srinagar (−1°C) on vertical thermometers."
      icon={Thermometer}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Temperature Difference" value={world.chosenOption === "B" ? "3°C Cooler (Option B)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Dual Thermometers Canvas */}
        <div className="bg-gradient-to-br from-sky-50 via-white to-indigo-50 border border-sky-200 p-6 rounded-xl flex items-center justify-around shadow-sm">
          {/* Gulmarg */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-sky-900">Gulmarg</span>
            <div className="w-8 h-32 bg-white rounded-full border-2 border-sky-400 my-2 relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
              <div className="w-full bg-sky-500 rounded-full" style={{ height: "25%" }} />
            </div>
            <span className="font-mono text-sm font-black text-sky-700">−4°C</span>
          </div>

          {/* Scale Arrow */}
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
              ΔT = 3°C
            </span>
            <span className="text-[10px] text-slate-500 mt-1 font-medium">
              Gulmarg is 3°C colder
            </span>
          </div>

          {/* Srinagar */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-900">Srinagar</span>
            <div className="w-8 h-32 bg-white rounded-full border border-slate-200 my-2 relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
              <div className="w-full bg-indigo-500 rounded-full" style={{ height: "45%" }} />
            </div>
            <span className="font-mono text-sm font-black text-indigo-700">−1°C</span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Which of the Following Statements is Correct? (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "Gulmarg was 3°C warmer than Srinagar.", },
              { id: "B" as const, text: "Gulmarg was 3°C cooler than Srinagar.", desc: "(−1) − (−4) = 3°C cooler", },
              { id: "C" as const, text: "Srinagar was 5°C cooler than Gulmarg.", },
              { id: "D" as const, text: "Both locations had the same temperature.", },
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
                  <span className="text-xs font-bold text-slate-800 my-1">{opt.text}</span>
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

/* ══════════════════════════════════════════════════════════════════════
   Q28 — 🔷 Polygon Connection Lab (Heptagon Diagonals)
   ══════════════════════════════════════════════════════════════════════ */
interface Q28World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const count = w.chosenOption === "A" ? 12 : w.chosenOption === "B" ? 10 : w.chosenOption === "C" ? 14 : 16;

      return {
        value: `${count} Diagonals`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, count) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Formula for diagonals in an n-gon is n(n−3)/2. For n=7 (heptagon): 7 × 4 ÷ 2 = 14 diagonals."
          : `Selected ${count}. Apply the diagonal formula n(n−3)/2 for n=7.`,
      };
    },
  });

  return (
    <PlayShell
      title="Polygon Connection Lab (Heptagon)"
      mission="Calculate the total number of internal diagonals in a regular 7-sided polygon (heptagon)."
      icon={Network}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Total Diagonals" value={world.chosenOption === "C" ? "14 Diagonals (Option C)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Heptagon Diagram Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
            {(() => {
              const pts = Array.from({ length: 7 }).map((_, i) => {
                const ang = (i * 2 * Math.PI) / 7 - Math.PI / 2;
                return { x: 100 + 75 * Math.cos(ang), y: 100 + 75 * Math.sin(ang) };
              });

              return (
                <>
                  <polygon
                    points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="#e0e7ff"
                    fillOpacity="0.5"
                    stroke="#4f46e5"
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
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            opacity="0.8"
                          />
                        );
                      }
                      return null;
                    })
                  )}
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1" />
                  ))}
                </>
              );
            })()}
          </svg>
          <span className="text-xs font-mono text-slate-600 font-bold mt-2">
            Formula: n(n − 3) ÷ 2 = 7 × 4 ÷ 2 = <b>14 Diagonals</b>
          </span>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Total Number of Diagonals in a Heptagon">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: 12, },
              { id: "B" as const, val: 10, },
              { id: "C" as const, val: 14, desc: "7 × 4 / 2 = 14", },
              { id: "D" as const, val: 16, },
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

/* ══════════════════════════════════════════════════════════════════════
   Q29 — 📐 Triangle Growth Workshop (Perimeter of Outer Boundary)
   ══════════════════════════════════════════════════════════════════════ */
interface Q29World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const p = w.chosenOption === "A" ? 24 : w.chosenOption === "B" ? 36 : w.chosenOption === "C" ? 48 : 18;

      return {
        value: `${p} cm (Outer Boundary Perimeter)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, p) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! The outer boundary perimeter is solely defined by the 3 outer sides of length 12 cm each: 3 × 12 = 36 cm."
          : `Selected ${p} cm. Note: The problem asks for the OUTER boundary perimeter.`,
      };
    },
  });

  return (
    <PlayShell
      title="Triangle Growth Workshop"
      mission="Find the outer boundary perimeter of the equilateral triangle with side 12 cm containing midpoint triangles."
      icon={Triangle}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Outer Perimeter" value={world.chosenOption === "B" ? "36 cm (Option B)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Fractal Triangle Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 220 180" className="w-52 h-44 drop-shadow-md">
            {/* Outer Equilateral Triangle (Side 12 cm) */}
            <polygon points="110,20 200,165 20,165" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3.5" />

            {/* Inverted Midpoint Triangle (Side 6 cm) */}
            <polygon points="110,165 155,92.5 65,92.5" fill="#fce7f3" stroke="#db2777" strokeWidth="2" strokeDasharray="3 3" />

            {/* Dimension labels */}
            <text x="50" y="85" fill="#312e81" fontSize="11" fontWeight="bold">12 cm</text>
            <text x="170" y="85" fill="#312e81" fontSize="11" fontWeight="bold">12 cm</text>
            <text x="110" y="180" fill="#312e81" fontSize="11" fontWeight="bold" textAnchor="middle">12 cm</text>
          </svg>
          <span className="text-xs text-slate-600 font-medium mt-1">
            Outer Boundary = 12 + 12 + 12 = <b>36 cm</b>
          </span>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Outer Boundary Perimeter">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: "24 cm", },
              { id: "B" as const, val: "36 cm", desc: "3 × 12 = 36 cm", },
              { id: "C" as const, val: "48 cm", },
              { id: "D" as const, val: "18 cm", },
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

/* ══════════════════════════════════════════════════════════════════════
   Q30 — 🏛️ Roman Numeral Forge (Arithmetic Evaluation)
   ══════════════════════════════════════════════════════════════════════ */
interface Q30World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const roman =
        w.chosenOption === "A"
          ? "CVI"
          : w.chosenOption === "B"
          ? "CXIV"
          : w.chosenOption === "C"
          ? "XCIX"
          : "CIX";

      return {
        value: `${roman} (109 in Roman Numerals)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, roman) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 58 (LVIII) + 24 (XXIV) + 89 (LXXXIX) + 32 (XXXII) − 94 (XCIV) = 203 − 94 = 109 = CIX."
          : `Selected ${roman}. 109 = 100 (C) + 9 (IX) = CIX.`,
      };
    },
  });

  return (
    <PlayShell
      title="Roman Numeral Forge"
      mission="Convert each Roman term to standard numbers, evaluate the total sum, and forge the result in Roman numerals."
      icon={Landmark}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Forged Numeral" value={world.chosenOption === "D" ? "CIX (109)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Step-by-Step Roman Math Workbench */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 text-slate-800 p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col items-center">
          <div className="text-xs font-mono font-bold text-slate-500 mb-1">Source Roman Numeral Expression:</div>
          <div className="font-mono text-xl sm:text-2xl font-black text-amber-900 tracking-wider">
            LVIII + XXIV + LXXXIX + XXXII − XCIV
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full max-w-lg my-3 text-center">
            <div className="p-2 bg-white rounded border border-amber-200 text-xs font-mono">
              <span className="text-slate-500 block">LVIII</span>
              <span className="font-bold text-slate-800">= 58</span>
            </div>
            <div className="p-2 bg-white rounded border border-amber-200 text-xs font-mono">
              <span className="text-slate-500 block">XXIV</span>
              <span className="font-bold text-slate-800">= 24</span>
            </div>
            <div className="p-2 bg-white rounded border border-amber-200 text-xs font-mono">
              <span className="text-slate-500 block">LXXXIX</span>
              <span className="font-bold text-slate-800">= 89</span>
            </div>
            <div className="p-2 bg-white rounded border border-amber-200 text-xs font-mono">
              <span className="text-slate-500 block">XXXII</span>
              <span className="font-bold text-slate-800">= 32</span>
            </div>
            <div className="p-2 bg-white rounded border border-amber-200 text-xs font-mono col-span-2 sm:col-span-1">
              <span className="text-slate-500 block">− XCIV</span>
              <span className="font-bold text-rose-700">= − 94</span>
            </div>
          </div>

          <div className="p-2 bg-amber-100 rounded-lg border border-amber-300 text-center w-full max-w-sm">
            <span className="text-xs font-mono font-bold text-amber-900">
              Calculation: 58 + 24 + 89 + 32 − 94 = 203 − 94 = <b>109 → CIX</b>
            </span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Final Roman Numeral Result (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, roman: "CVI", arabic: "106", },
              { id: "B" as const, roman: "CXIV", arabic: "114", },
              { id: "C" as const, roman: "XCIX", arabic: "99", },
              { id: "D" as const, roman: "CIX", arabic: "109", desc: "100 + 9 = CIX", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-2xl font-black text-slate-800 my-1 font-mono">{opt.roman}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Arabic: {opt.arabic}</span>
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700"
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

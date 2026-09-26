"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  TrendingUp,
  FlaskConical,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — 🧠 Geometry Control Room (HOTS Geometry Fundamentals)
   ══════════════════════════════════════════════════════════════════════ */
interface Q46World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q46GeometryClassificationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q46World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const desc =
        w.chosenOption === "D"
          ? "(P) Parallel, (Q) 3, (R) Diameter, (S) 54° (Correct Classification)"
          : w.chosenOption === "A"
          ? "(P) Intersecting, (Q) 4, (R) Radius, (S) 60°"
          : w.chosenOption === "B"
          ? "(P) Parallel, (Q) 4, (R) Diameter, (S) 45°"
          : "(P) Intersecting, (Q) 3, (R) Chord, (S) 54°";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! (P) Non-intersecting lines in a plane = Parallel. (Q) Minimum polygon sides = 3 (triangle). (R) Chord through centre = Diameter. (S) 3/5 × 90° = 54°."
          : `Selected Option ${w.chosenOption}. Check 4 geometric axioms: Parallel, 3 sides, Diameter, 54°.`,
      };
    },
  });

  return (
    <PlayShell
      title="Geometry Control Room"
      mission="Audit all 4 higher-order geometric definitions (Parallel, Polygon, Chord, Angle) to select the correct set."
      icon={Cpu}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Geometry State" value={world.chosenOption === "D" ? "(P) Parallel, (Q) 3, (R) Diameter, (S) 54°" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* 4 Statement Inspection Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Statement (P)</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Non-intersecting lines</span>
            <span className="font-mono text-sm font-black text-indigo-700 mt-2 block">Parallel</span>
          </div>

          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Statement (Q)</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Min lines for polygon</span>
            <span className="font-mono text-sm font-black text-indigo-700 mt-2 block">3 (Triangle)</span>
          </div>

          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Statement (R)</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Chord through centre</span>
            <span className="font-mono text-sm font-black text-indigo-700 mt-2 block">Diameter</span>
          </div>

          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Statement (S)</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">3/5 of a right angle</span>
            <span className="font-mono text-sm font-black text-indigo-700 mt-2 block">54°</span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Correct Combination of Blank Values (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "(P) Intersecting, (Q) 4, (R) Radius, (S) 60°", isCorrect: false },
              { id: "B" as const, text: "(P) Parallel, (Q) 4, (R) Diameter, (S) 45°", isCorrect: false },
              { id: "C" as const, text: "(P) Intersecting, (Q) 3, (R) Chord, (S) 54°", isCorrect: false },
              { id: "D" as const, text: "(P) Parallel, (Q) 3, (R) Diameter, (S) 54°", desc: "All 4 axioms exact (Correct)", isCorrect: true },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-start justify-between text-left ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                    {isSelected && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${opt.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"}`}>
                        {opt.isCorrect ? "Correct ✓" : "Selected"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800">{opt.text}</span>
                  {opt.desc && <span className="text-[10px] text-slate-500 mt-1">{opt.desc}</span>}
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
   Q47 — 📈 Toy Store Analytics (Line Graph Ratio)
   ══════════════════════════════════════════════════════════════════════ */
interface Q47World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q47LineGraphRatioActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q47World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "A" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const ratio = w.chosenOption === "A" ? "2 : 3" : w.chosenOption === "B" ? "3 : 2" : w.chosenOption === "C" ? "4 : 5" : "3 : 4";

      return {
        value: `${ratio} ((April 350 + June 450) : (August 650 + July 550))`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, ratio) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! (April 350 + June 450) = 800. (August 650 + July 550) = 1,200. Ratio = 800 : 1,200 = 8 : 12 = 2 : 3."
          : `Selected ${ratio}. (350 + 450) : (650 + 550) = 800 : 1200 = 2 : 3.`,
      };
    },
  });

  return (
    <PlayShell
      title="Toy Store Analytics"
      mission="Read sales figures from the line graph and find the ratio of (April + June) to (August + July) in simplest form."
      icon={TrendingUp}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Sales Ratio" value={world.chosenOption === "A" ? "2 : 3 (Option A)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Line Graph Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200 p-4 rounded-xl shadow-sm">
          <svg viewBox="0 0 320 160" className="w-full max-w-md h-40 mx-auto">
            {/* Grid lines */}
            {[200, 400, 600, 800].map((val) => {
              const y = 130 - (val / 800) * 110;
              return (
                <g key={val}>
                  <line x1="35" y1={y} x2="310" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  <text x="30" y={y + 3} fill="#94a3b8" fontSize="8" textAnchor="end">{val}</text>
                </g>
              );
            })}

            {/* Line Graph Path */}
            <polyline
              points="55,82 110,61 165,68 220,54 275,41"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3"
            />

            {/* 5 Months: April (350), May (500), June (450), July (550), August (650) */}
            {[
              { m: "Apr", val: 350, x: 55, y: 82 },
              { m: "May", val: 500, x: 110, y: 61 },
              { m: "Jun", val: 450, x: 165, y: 68 },
              { m: "Jul", val: 550, x: 220, y: 54 },
              { m: "Aug", val: 650, x: 275, y: 41 },
            ].map((pt) => (
              <g key={pt.m}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x={pt.x} y={pt.y - 8} fill="#1e293b" fontSize="9" fontWeight="black" textAnchor="middle">
                  {pt.val}
                </text>
                <text x={pt.x} y={145} fill="#475569" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {pt.m}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-2 text-center text-xs font-mono text-indigo-900 font-bold">
            (Apr 350 + Jun 450 = 800) &nbsp;:&nbsp; (Aug 650 + Jul 550 = 1200) &nbsp;→&nbsp; 800 : 1200 = <b>2 : 3</b>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Simplified Ratio (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, ratio: "2 : 3", desc: "800 : 1200 = 2:3 (Correct)", isCorrect: true },
              { id: "B" as const, ratio: "3 : 2", desc: "Inverted ratio error", isCorrect: false },
              { id: "C" as const, ratio: "4 : 5", isCorrect: false },
              { id: "D" as const, ratio: "3 : 4", isCorrect: false },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-2xl font-black text-slate-800 my-1 font-mono">{opt.ratio}</span>
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
   Q48 — 🔬 Mathematics Truth Laboratory (T/F Proof System)
   ══════════════════════════════════════════════════════════════════════ */
interface Q48World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q48TrueFalseFractionActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q48World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "A" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const seq =
        w.chosenOption === "A"
          ? "(P) T, (Q) F, (R) F, (S) T"
          : w.chosenOption === "B"
          ? "(P) T, (Q) T, (R) F, (S) F"
          : w.chosenOption === "C"
          ? "(P) F, (Q) F, (R) T, (S) T"
          : "(P) T, (Q) F, (R) T, (S) F";

      return {
        value: `Option ${w.chosenOption} — ${seq}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, seq) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! (P) Simplest form = coprime numerator and denominator (T). (Q) 5/9 = 0.55 < 4/5 = 0.8 (F). (R) Fractions can be represented on number line (F). (S) Decimal place value divides by 10 moving left-to-right (T)."
          : `Selected Option ${w.chosenOption}. Truth sequence: T, F, F, T.`,
      };
    },
  });

  return (
    <PlayShell
      title="Mathematics Truth Laboratory"
      mission="Audit the truth value of all four advanced statements (P, Q, R, S) to identify the correct T/F pattern."
      icon={FlaskConical}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Truth Sequence" value={world.chosenOption === "A" ? "T, F, F, T (Option A)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Statement Truth Checks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">(P) Simplest Form Definition</span>
            <p className="text-xs text-slate-700 mt-1">Numerator & denominator share no common factors other than 1.</p>
            <span className="text-xs font-mono font-bold text-emerald-900 mt-1 block">Truth: TRUE (T) ✓</span>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl">
            <span className="text-[10px] font-bold text-rose-800 uppercase block">(Q) Fraction Comparison</span>
            <p className="text-xs text-slate-700 mt-1">5/9 (0.55) is greater than 4/5 (0.80).</p>
            <span className="text-xs font-mono font-bold text-rose-900 mt-1 block">Truth: FALSE (F) ✗</span>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl">
            <span className="text-[10px] font-bold text-rose-800 uppercase block">(R) Number Line Existence</span>
            <p className="text-xs text-slate-700 mt-1">Fractions cannot be represented on a number line.</p>
            <span className="text-xs font-mono font-bold text-rose-900 mt-1 block">Truth: FALSE (F) ✗</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">(S) Decimal Place Value</span>
            <p className="text-xs text-slate-700 mt-1">Moving left to right divides place value factor by 10.</p>
            <span className="text-xs font-mono font-bold text-emerald-900 mt-1 block">Truth: TRUE (T) ✓</span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Correct T/F Sequence (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, seq: "(P) T, (Q) F, (R) F, (S) T", desc: "True, False, False, True (Correct)", isCorrect: true },
              { id: "B" as const, seq: "(P) T, (Q) T, (R) F, (S) F", isCorrect: false },
              { id: "C" as const, seq: "(P) F, (Q) F, (R) T, (S) T", isCorrect: false },
              { id: "D" as const, seq: "(P) T, (Q) F, (R) T, (S) F", isCorrect: false },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-start justify-between text-left ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                    {isSelected && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${opt.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"}`}>
                        {opt.isCorrect ? "Correct ✓" : "Selected"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800">{opt.seq}</span>
                  {opt.desc && <span className="text-[10px] text-slate-500 mt-1">{opt.desc}</span>}
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
   Q49 — 🔐 Divisibility Security Lab (Divisibility by 8 Investigation)
   ══════════════════════════════════════════════════════════════════════ */
interface Q49World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q49DivisibilitySecurityActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q49World>({
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
          ? "Both Statement I and II are true, and Statement I explains Statement II (Correct)"
          : w.chosenOption === "A"
          ? "Statement I is true and Statement II is false"
          : w.chosenOption === "B"
          ? "Statement I is false and Statement II is true"
          : "Both Statement I and Statement II are false";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Statement I states the universal divisibility rule for 8 (last 3 digits). Statement II tests 987,648 where 648 ÷ 8 = 81 (true). Thus Statement I directly explains Statement II."
          : `Selected Option ${w.chosenOption}. Both statements are true and Statement I is the underlying mathematical theorem.`,
      };
    },
  });

  return (
    <PlayShell
      title="Divisibility Security Lab"
      mission="Investigate Statement I (divisibility rule for 8) and Statement II (987,648 divisibility) to evaluate their logical relationship."
      icon={ShieldCheck}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Logical Evaluation" value={`Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Divisibility Rule & Verification Cards */}
        <div className="space-y-2">
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-mono">
            <div>
              <span className="font-bold text-emerald-950 block">Statement I: Divisibility by 8 Rule</span>
              <span className="text-slate-600">A number is divisible by 8 if its last 3 digits are divisible by 8.</span>
            </div>
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">TRUE ✓</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-mono">
            <div>
              <span className="font-bold text-emerald-950 block">Statement II: Target Number 987,648</span>
              <span className="text-slate-600">Last 3 digits 648 ÷ 8 = 81 (Leaves remainder 0).</span>
            </div>
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">TRUE ✓</span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Correct Logical Relationship (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "Statement I is true and Statement II is false.", isCorrect: false },
              { id: "B" as const, text: "Statement I is false and Statement II is true.", isCorrect: false },
              { id: "C" as const, text: "Both Statement I and Statement II are true, and Statement I is the correct explanation for Statement II.", desc: "Both True & Logically Connected (Correct)", isCorrect: true },
              { id: "D" as const, text: "Both Statement I and Statement II are false.", isCorrect: false },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-start justify-between text-left ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                    {isSelected && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${opt.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"}`}>
                        {opt.isCorrect ? "Correct ✓" : "Selected"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{opt.text}</span>
                  {opt.desc && <span className="text-[10px] text-slate-500 mt-1">{opt.desc}</span>}
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
   Q50 — 🏆 Olympiad Master Control Room (Grand Finale Multi-Concept)
   ══════════════════════════════════════════════════════════════════════ */
interface Q50World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q50MasterControlRoomActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q50World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const matchStr =
        w.chosenOption === "D"
          ? "(P)→0, (Q)→81, (R)→6, (S)→56 cm (Grand Finale Solution)"
          : w.chosenOption === "A"
          ? "(P)→1, (Q)→72, (R)→4, (S)→48 cm"
          : w.chosenOption === "B"
          ? "(P)→0, (Q)→72, (R)→6, (S)→56 cm"
          : "(P)→1, (Q)→81, (R)→4, (S)→28 cm";

      return {
        value: `Option ${w.chosenOption} — ${matchStr}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! (P) Smallest int > all negatives = 0. (Q) 49 − (−40) − (−3) + 69 − 80 = 81. (R) 7254*98 div by 22 => (20+*) − 15 = 11 => * = 6. (S) 28/4 = 7 squares × 8cm perimeter = 56 cm."
          : `Selected Option ${w.chosenOption}. Solve all 4 stations: P=0, Q=81, R=6, S=56 cm.`,
      };
    },
  });

  return (
    <PlayShell
      title="Olympiad Master Control Room"
      mission="Coordinate all four high-order mathematical stations (P, Q, R, S) to solve the grand finale problem."
      icon={Trophy}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Grand Finale Solution" value={world.chosenOption === "D" ? "(P)→0, (Q)→81, (R)→6, (S)→56 cm" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* 4 Grand Finale Station Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Station (P)</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">&gt; all negative ints</span>
            <span className="font-mono text-xl font-black text-indigo-700 my-1 block">0</span>
          </div>

          <div className="p-3 bg-white border-2 border-emerald-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Station (Q)</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">49 + 40 + 3 + 69 − 80</span>
            <span className="font-mono text-xl font-black text-emerald-700 my-1 block">81</span>
          </div>

          <div className="p-3 bg-white border-2 border-purple-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Station (R)</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">7254*98 div by 22</span>
            <span className="font-mono text-xl font-black text-purple-700 my-1 block">6</span>
          </div>

          <div className="p-3 bg-white border-2 border-amber-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Station (S)</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">7 squares × 8 cm</span>
            <span className="font-mono text-xl font-black text-amber-700 my-1 block">56 cm</span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Matching Set for Column I → Column II (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "(P)→1, (Q)→72, (R)→4, (S)→48 cm", isCorrect: false },
              { id: "B" as const, text: "(P)→0, (Q)→72, (R)→6, (S)→56 cm", isCorrect: false },
              { id: "C" as const, text: "(P)→1, (Q)→81, (R)→4, (S)→28 cm", isCorrect: false },
              { id: "D" as const, text: "(P)→0, (Q)→81, (R)→6, (S)→56 cm", desc: "P=0, Q=81, R=6, S=56 cm (Correct)", isCorrect: true },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-start justify-between text-left ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                    {isSelected && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${opt.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"}`}>
                        {opt.isCorrect ? "Correct ✓" : "Selected"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800">{opt.text}</span>
                  {opt.desc && <span className="text-[10px] text-slate-500 mt-1">{opt.desc}</span>}
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

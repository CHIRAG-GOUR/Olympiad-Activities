"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  PieChart,
  Binary,
  Compass,
  MoveRight,
  RotateCw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — 🧊 3D Solid Inspector (Triangular Prism Topology)
   ══════════════════════════════════════════════════════════════════════ */
interface Q21World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q21TriangularPrismActivity({
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
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const desc =
        w.chosenOption === "D"
          ? "P = 5 faces, Q = 6 vertices, R = 9 edges"
          : w.chosenOption === "A"
          ? "P = 4, Q = 4, R = 6 (Tetrahedron)"
          : w.chosenOption === "B"
          ? "P = 6, Q = 8, R = 12 (Cuboid)"
          : "P = 5, Q = 5, R = 8 (Square Pyramid)";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! A triangular prism consists of 2 triangular bases + 3 rectangular lateral faces = 5 Faces; 3 + 3 = 6 Vertices; 3 + 3 + 3 = 9 Edges."
          : `Selected Option ${w.chosenOption}. Check Euler's formula: F + V − E = 2 (5 + 6 − 9 = 2).`,
      };
    },
  });

  return (
    <PlayShell
      title="3D Solid Inspector (Triangular Prism)"
      mission="Inspect the 3D topology of a triangular prism to find the exact count of Faces (P), Vertices (Q), and Edges (R)."
      icon={Box}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Prism Topology" value={world.chosenOption === "D" ? "P=5, Q=6, R=9 (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* 3D Prism Visual Diagram */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 260 180" className="w-60 h-44 drop-shadow-md">
            <defs>
              <linearGradient id="prismFront" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="prismTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {/* Hidden back edges */}
            <line x1="80" y1="50" x2="190" y2="50" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="80" y1="50" x2="50" y2="120" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="80" y1="50" x2="110" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

            {/* Top Slanted Face */}
            <polygon points="50,120 160,120 190,50 80,50" fill="url(#prismTop)" stroke="#9333ea" strokeWidth="2" />

            {/* Front Triangular Face */}
            <polygon points="160,120 220,140 190,50" fill="url(#prismFront)" stroke="#4338ca" strokeWidth="2.5" />

            {/* Bottom Rectangular Face */}
            <polygon points="50,120 110,140 220,140 160,120" fill="#4f46e5" fillOpacity="0.6" stroke="#4338ca" strokeWidth="2" />

            {/* 6 Vertices */}
            {[
              { x: 50, y: 120, label: "V1" },
              { x: 110, y: 140, label: "V2" },
              { x: 80, y: 50, label: "V3" },
              { x: 160, y: 120, label: "V4" },
              { x: 220, y: 140, label: "V5" },
              { x: 190, y: 50, label: "V6" },
            ].map((v, i) => (
              <g key={i}>
                <circle cx={v.x} cy={v.y} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x={v.x + (v.x > 150 ? 10 : -10)} y={v.y + 4} fill="#1e293b" fontSize="10" fontWeight="black" textAnchor="middle">
                  {v.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Topology Breakdown */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-3 text-center">
            <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 block">Faces (P)</span>
              <span className="font-mono text-lg font-black text-indigo-700">5</span>
              <span className="text-[9px] text-slate-500">2 Tri + 3 Rect</span>
            </div>
            <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 block">Vertices (Q)</span>
              <span className="font-mono text-lg font-black text-indigo-700">6</span>
              <span className="text-[9px] text-slate-500">3 + 3 Corners</span>
            </div>
            <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 block">Edges (R)</span>
              <span className="font-mono text-lg font-black text-indigo-700">9</span>
              <span className="text-[9px] text-slate-500">3 + 3 + 3 Edges</span>
            </div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Correct Values of P, Q, and R (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, text: "P = 4, Q = 4, R = 6", },
              { id: "B" as const, text: "P = 6, Q = 8, R = 12", },
              { id: "C" as const, text: "P = 5, Q = 5, R = 8", },
              { id: "D" as const, text: "P = 5, Q = 6, R = 9", desc: "Triangular Prism", },
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
                  <span className="text-xs font-mono font-black text-slate-800 my-1">{opt.text}</span>
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
   Q22 — 🍕 Fraction Sorting Table (Fraction Comparison)
   ══════════════════════════════════════════════════════════════════════ */
interface Q22World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q22FractionSortingTableActivity({
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
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const order =
        w.chosenOption === "B"
          ? "P < Q < R < S (3/8 < 4/8 < 5/8 < 6/8)"
          : w.chosenOption === "A"
          ? "S < R < Q < P (Descending)"
          : w.chosenOption === "C"
          ? "Q < P < S < R"
          : "R < S < P < Q";

      return {
        value: `Option ${w.chosenOption} — ${order}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! P = 3/8 (0.375), Q = 1/2 = 4/8 (0.50), R = 5/8 (0.625), S = 3/4 = 6/8 (0.75). Ascending order: P < Q < R < S."
          : `Selected Option ${w.chosenOption}. Express all fractions with common denominator 8: 3/8, 4/8, 5/8, 6/8.`,
      };
    },
  });

  return (
    <PlayShell
      title="Fraction Sorting Table"
      mission="Convert fractions to a common denominator of 8 and arrange P, Q, R, and S in ascending order."
      icon={PieChart}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Ascending Order" value={world.chosenOption === "B" ? "P < Q < R < S (Option B)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Fraction Visual Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "P", orig: "3/8", equiv: "3/8 (37.5%)", fillCount: 3, col: "#3b82f6" },
            { id: "Q", orig: "1/2", equiv: "4/8 (50.0%)", fillCount: 4, col: "#8b5cf6" },
            { id: "R", orig: "5/8", equiv: "5/8 (62.5%)", fillCount: 5, col: "#ec4899" },
            { id: "S", orig: "3/4", equiv: "6/8 (75.0%)", fillCount: 6, col: "#10b981" },
          ].map((item) => (
            <div key={item.id} className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs flex flex-col items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Figure {item.id}</span>
              {/* 8-segment Bar */}
              <div className="w-full my-2 flex border-2 border-slate-300 rounded overflow-hidden h-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-r border-slate-200 last:border-r-0 ${
                      i < item.fillCount ? "bg-indigo-600" : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-sm font-black text-slate-800">{item.orig}</span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">{item.equiv}</span>
            </div>
          ))}
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Ascending Order of Shaded Fractions (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, seq: "S < R < Q < P", desc: "Descending order error", },
              { id: "B" as const, seq: "P < Q < R < S", desc: "3/8 < 4/8 < 5/8 < 6/8", },
              { id: "C" as const, seq: "Q < P < S < R", },
              { id: "D" as const, seq: "R < S < P < Q", },
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
                  <span className="text-base font-black text-slate-800 my-1 font-mono">{opt.seq}</span>
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
   Q23 — 🔢 Decimal Translation Machine (Place Value Match)
   ══════════════════════════════════════════════════════════════════════ */
interface Q23World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q23DecimalMatchActivity({
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const desc =
        w.chosenOption === "C"
          ? "Sixteen and two tenths → 16.2"
          : w.chosenOption === "A"
          ? "Twelve and thirty-nine thousandths → 12.420 (Incorrect: should be 12.039)"
          : w.chosenOption === "B"
          ? "Four and forty hundredths → 4.004 (Incorrect: should be 4.40)"
          : "Eight and five hundredths → 80.50 (Incorrect: should be 8.05)";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 'Sixteen and two tenths' = 16 + 2/10 = 16.2."
          : `Option ${w.chosenOption} has a place-value conversion error.`,
      };
    },
  });

  return (
    <PlayShell
      title="Decimal Translation Machine"
      mission="Identify the decimal word name that correctly matches its numerical representation."
      icon={Binary}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Matched Decimal" value={`Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* 4 Candidate Cards */}
        <Bay label="Audit Decimal Translation Options (Select A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: "A" as const,
                words: "Twelve and thirty-nine thousandths",
                num: "12.420",
              },
              {
                id: "B" as const,
                words: "Four and forty hundredths",
                num: "4.004",
              },
              {
                id: "C" as const,
                words: "Sixteen and two tenths",
                num: "16.2",
              },
              {
                id: "D" as const,
                words: "Eight and five hundredths",
                num: "80.50",
              },
            ].map((item) => {
              const isSelected = world.chosenOption === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => set({ chosenOption: item.id })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-700">Option {item.id}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 font-semibold">{item.words}</p>
                  <div className="my-2 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-xs flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Denoted Number:</span>
                    <span className="font-black text-slate-900 text-sm">{item.num}</span>
                  </div>

                  <button
                    type="button"
                    className={`mt-1 text-xs font-bold px-2 py-1 rounded w-full transition-colors ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + item.id}
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
   Q24 — 📐 Angle Observatory (Protractor Ray Classification)
   ══════════════════════════════════════════════════════════════════════ */
interface Q24World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q24AngleMatchingActivity({
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
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const desc =
        w.chosenOption === "D"
          ? "(P)→(ii) Acute, (Q)→(i) Right, (R)→(iv) Obtuse, (S)→(iii) Straight"
          : w.chosenOption === "A"
          ? "(P)→(i), (Q)→(ii), (R)→(iii), (S)→(iv)"
          : w.chosenOption === "B"
          ? "(P)→(ii), (Q)→(iv), (R)→(i), (S)→(iii)"
          : "(P)→(iv), (Q)→(i), (R)→(ii), (S)→(iii)";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! ∠AOB = 40° (Acute), ∠AOC = 90° (Right), ∠AOE = 130° (Obtuse), ∠BOD = 180° (Straight)."
          : `Selected Option ${w.chosenOption}. Acute < 90°, Right = 90°, 90° < Obtuse < 180°, Straight = 180°.`,
      };
    },
  });

  return (
    <PlayShell
      title="Angle Observatory"
      mission="Classify angles ∠AOB, ∠AOC, ∠AOE, and ∠BOD into acute, right, obtuse, and straight angles."
      icon={Compass}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Angle Classification" value={`Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Ray Figure Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 280 160" className="w-full max-w-sm h-40 bg-white rounded-lg border border-slate-200 shadow-inner">
            {/* Straight line DOB */}
            <line x1="20" y1="120" x2="260" y2="120" stroke="#64748b" strokeWidth="2.5" />
            <text x="20" y="138" fill="#475569" fontSize="11" fontWeight="bold">D (180°)</text>
            <text x="140" y="138" fill="#475569" fontSize="11" fontWeight="bold">O</text>
            <text x="250" y="138" fill="#475569" fontSize="11" fontWeight="bold">B (0°)</text>

            {/* Ray OA (40° Acute) */}
            <line x1="140" y1="120" x2="216" y2="56" stroke="#3b82f6" strokeWidth="2.5" />
            <text x="224" y="52" fill="#2563eb" fontSize="11" fontWeight="bold">A (40°)</text>

            {/* Ray OC (90° Right) */}
            <line x1="140" y1="120" x2="140" y2="25" stroke="#10b981" strokeWidth="2.5" />
            <text x="140" y="18" fill="#059669" fontSize="11" fontWeight="bold" textAnchor="middle">C (90°)</text>

            {/* Ray OE (130° Obtuse) */}
            <line x1="140" y1="120" x2="63" y2="43" stroke="#ec4899" strokeWidth="2.5" />
            <text x="50" y="38" fill="#be185d" fontSize="11" fontWeight="bold">E (130°)</text>

            {/* Vertex Point O */}
            <circle cx="140" cy="120" r="5" fill="#f59e0b" />
          </svg>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Correct Matching (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "(P)→(i), (Q)→(ii), (R)→(iii), (S)→(iv)", },
              { id: "B" as const, text: "(P)→(ii), (Q)→(iv), (R)→(i), (S)→(iii)", },
              { id: "C" as const, text: "(P)→(iv), (Q)→(i), (R)→(ii), (S)→(iii)", },
              { id: "D" as const, text: "(P)→(ii), (Q)→(i), (R)→(iv), (S)→(iii)", desc: "40°=Acute, 90°=Right, 130°=Obtuse, 180°=Straight", },
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
                  <span className="text-xs font-mono font-black text-slate-800 my-1">{opt.text}</span>
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
   Q25 — 🏃 Number Line Runner (Addition: (-5) + 8 = 3)
   ══════════════════════════════════════════════════════════════════════ */
interface Q25World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q25NumberLineAdditionActivity({
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const desc =
        w.chosenOption === "C"
          ? "Number line starting at −5 with an arrow moving 8 units to the right to 3"
          : w.chosenOption === "A"
          ? "Number line starting at 0 moving to −5 then −8"
          : w.chosenOption === "B"
          ? "Number line starting at 8 moving 5 units left to 3"
          : "Number line starting at 3 moving 8 units right";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! In (−5) + 8 = 3, we start at −5 on the number line and jump 8 units to the right, ending at +3."
          : `Selected Option ${w.chosenOption}. Adding a positive integer moves to the right.`,
      };
    },
  });

  return (
    <PlayShell
      title="Number Line Runner"
      mission="Identify the number line that accurately depicts the integer addition (-5) + 8 = 3."
      icon={MoveRight}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Operation (−5) + 8" value={world.chosenOption === "C" ? "= +3 (Option C)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Interactive Number Line Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 340 120" className="w-full max-w-md h-32 bg-white rounded-lg border border-slate-200 shadow-inner">
            <line x1="20" y1="80" x2="320" y2="80" stroke="#475569" strokeWidth="2.5" markerEnd="url(#arr)" markerStart="url(#arrL)" />

            {Array.from({ length: 11 }).map((_, i) => {
              const val = i - 6; // -6 to +4
              const x = 30 + i * 28;
              const isStart = val === -5;
              const isEnd = val === 3;

              return (
                <g key={val}>
                  <line x1={x} y1="74" x2={x} y2="86" stroke="#64748b" strokeWidth="2" />
                  <text x={x} y="102" fill={isStart ? "#dc2626" : isEnd ? "#16a34a" : "#64748b"} fontSize="11" fontWeight="bold" textAnchor="middle">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Jump Arc from -5 (x=58) to 3 (x=282) */}
            <path
              d="M 58 74 Q 170 15 282 74"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3.5"
            />
            <circle cx="58" cy="80" r="5" fill="#ef4444" />
            <circle cx="282" cy="80" r="5" fill="#10b981" />
            <text x="170" y="32" fill="#4f46e5" fontSize="12" fontWeight="black" textAnchor="middle">
              +8 Units Right
            </text>
          </svg>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Which Number Line Correctly Represents (-5) + 8 = 3?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "Number line starting at 0 moving to −5 then −8", },
              { id: "B" as const, text: "Number line starting at 8 moving 5 units left to 3", },
              { id: "C" as const, text: "Starting at −5 with arrow moving 8 units to the right to 3", desc: "(−5) + 8 = 3", },
              { id: "D" as const, text: "Number line starting at 3 moving 8 units right", },
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

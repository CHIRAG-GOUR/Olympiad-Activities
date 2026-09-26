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
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — 🪞 Symmetry Mirror Studio (Lines of Symmetry)
   ══════════════════════════════════════════════════════════════════════ */
interface Q31World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const desc =
        w.chosenOption === "D"
          ? "Rectangle (non-square) — Exactly 2 lines of symmetry (Horizontal & Vertical)"
          : w.chosenOption === "A"
          ? "Equilateral triangle — 3 lines of symmetry"
          : w.chosenOption === "B"
          ? "Square — 4 lines of symmetry"
          : "Scalene triangle — 0 lines of symmetry";

      return {
        value: `Option ${w.chosenOption} — ${desc}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! A non-square rectangle has exactly 2 lines of symmetry (connecting opposite midpoint pairs). Diagonals are not lines of symmetry."
          : `Selected Option ${w.chosenOption}. Check how many reflection axes divide the figure symmetrically.`,
      };
    },
  });

  return (
    <PlayShell
      title="Symmetry Mirror Studio"
      mission="Identify the geometric figure that possesses exactly 2 lines of symmetry."
      icon={Sparkles}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="2 Lines of Symmetry" value={world.chosenOption === "D" ? "Rectangle (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* 4 Candidate Shape Cards with Symmetry Lines */}
        <Bay label="Audit Geometric Figures (Select Option A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                name: "Equilateral Triangle",
                lines: "3 Lines of Symmetry",
                isCorrect: false,
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <polygon points="40,10 70,68 10,68" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                    <line x1="40" y1="10" x2="40" y2="68" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="10" y1="68" x2="55" y2="39" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="70" y1="68" x2="25" y2="39" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                name: "Square",
                lines: "4 Lines of Symmetry",
                isCorrect: false,
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <rect x="15" y="15" width="50" height="50" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
                    <line x1="40" y1="15" x2="40" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="15" y1="40" x2="65" y2="40" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="15" y1="15" x2="65" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="65" y1="15" x2="15" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                name: "Scalene Triangle",
                lines: "0 Lines of Symmetry",
                isCorrect: false,
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <polygon points="20,15 72,60 10,70" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                id: "D" as const,
                title: "Option D (Matching)",
                name: "Rectangle (non-square)",
                lines: "Exactly 2 Lines of Symmetry",
                isCorrect: true,
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-emerald-50 border-2 border-emerald-400 rounded-lg p-1">
                    <rect x="10" y="24" width="60" height="32" fill="#d1fae5" stroke="#059669" strokeWidth="2.5" />
                    <line x1="40" y1="20" x2="40" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
                    <line x1="6" y1="40" x2="74" y2="40" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800">{opt.title}</span>
                    {isSelected && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${opt.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"}`}>
                        {opt.isCorrect ? "Match ✓" : "Active"}
                      </span>
                    )}
                  </div>

                  {opt.renderSvg()}

                  <span className="text-[11px] font-bold text-slate-800 mt-1">{opt.name}</span>
                  <span className="text-[10px] text-indigo-600 font-bold">{opt.lines}</span>
                  <button
                    type="button"
                    className={`mt-2 text-[10px] font-bold px-2 py-1 rounded w-full transition-colors ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
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
   Q32 — 🌎 Place-Value City (International Numeration System)
   ══════════════════════════════════════════════════════════════════════ */
interface Q32World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const wordName =
        w.chosenOption === "B"
          ? "Seven million two hundred fifty thousand three hundred seventy-one (Correct)"
          : w.chosenOption === "A"
          ? "Seventy-two lakh fifty thousand three hundred seventy-one (Indian System)"
          : w.chosenOption === "C"
          ? "Seven million twenty-five thousand three hundred seventy-one"
          : "Seven hundred twenty-five thousand three hundred seventy-one";

      return {
        value: `Option ${w.chosenOption} — ${wordName}`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 7,250,371 is grouped into periods of 3 digits: 7 (Millions) + 250 (Thousands) + 371 (Units)."
          : `Selected Option ${w.chosenOption}. In International system: 7,250,371 = 7 million 250 thousand 371.`,
      };
    },
  });

  return (
    <PlayShell
      title="Place-Value City"
      mission="Group 7,250,371 into 3-digit periods to express the number in the International numeration system."
      icon={Globe}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="International Name" value={`Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* International Place Value Chart */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm flex flex-col items-center">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">
            International 3-Digit Period Grouping for 7,250,371:
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-md my-2 text-center">
            <div className="p-3 bg-indigo-100/80 border border-indigo-300 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block uppercase">Millions Period</span>
              <span className="font-mono text-3xl font-black text-indigo-900 my-1 block">7</span>
              <span className="text-[10px] text-slate-600">Seven Million</span>
            </div>

            <div className="p-3 bg-purple-100/80 border border-purple-300 rounded-xl">
              <span className="text-[10px] font-bold text-purple-700 block uppercase">Thousands Period</span>
              <span className="font-mono text-3xl font-black text-purple-900 my-1 block">250</span>
              <span className="text-[10px] text-slate-600">Two Hundred Fifty Thousand</span>
            </div>

            <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">Units Period</span>
              <span className="font-mono text-3xl font-black text-emerald-900 my-1 block">371</span>
              <span className="text-[10px] text-slate-600">Three Hundred Seventy-One</span>
            </div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Correct International Word Name">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "Seventy-two lakh fifty thousand three hundred seventy-one", desc: "Indian Numeration System", isCorrect: false },
              { id: "B" as const, text: "Seven million two hundred fifty thousand three hundred seventy-one", desc: "International System (Correct)", isCorrect: true },
              { id: "C" as const, text: "Seven million twenty-five thousand three hundred seventy-one", desc: "Represents 7,025,371", isCorrect: false },
              { id: "D" as const, text: "Seven hundred twenty-five thousand three hundred seventy-one", desc: "Represents 725,371", isCorrect: false },
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
                  <span className="text-[10px] text-slate-500 mt-1">{opt.desc}</span>
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
   Q33 — 🚗 Car Wash Dashboard (Bar Graph Interpretation)
   ══════════════════════════════════════════════════════════════════════ */
interface Q33World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const diff = w.chosenOption === "A" ? 8 : w.chosenOption === "B" ? 10 : w.chosenOption === "C" ? 12 : 14;

      return {
        value: `${diff} cars ((18 + 14) − (12 + 8) = 12)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, diff) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! (Trishi + Sam) = 18 + 14 = 32. (Mohit + Mini) = 12 + 8 = 20. Difference = 32 − 20 = 12 cars."
          : `Selected ${diff} cars. (Trishi 18 + Sam 14) − (Mohit 12 + Mini 8) = 32 − 20.`,
      };
    },
  });

  return (
    <PlayShell
      title="Car Wash Dashboard"
      mission="Calculate the difference between the total cars washed by (Trishi + Sam) and (Mohit + Mini)."
      icon={BarChart3}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Difference" value={world.chosenOption === "C" ? "12 cars (Option C)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Bar Graph Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200 p-4 rounded-xl shadow-sm">
          <svg viewBox="0 0 320 160" className="w-full max-w-md h-40 mx-auto">
            {/* Grid lines */}
            {[0, 5, 10, 15, 20].map((val) => {
              const y = 130 - (val / 20) * 110;
              return (
                <g key={val}>
                  <line x1="35" y1={y} x2="310" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  <text x="28" y={y + 3} fill="#94a3b8" fontSize="8" textAnchor="end">{val}</text>
                </g>
              );
            })}

            {/* 5 Children Bars */}
            {[
              { name: "Trishi", val: 18, col: "#3b82f6", x: 45 },
              { name: "Sam", val: 14, col: "#6366f1", x: 100 },
              { name: "Mohit", val: 12, col: "#ec4899", x: 155 },
              { name: "Mini", val: 8, col: "#f43f5e", x: 210 },
              { name: "Aarav", val: 16, col: "#10b981", x: 265 },
            ].map((bar) => {
              const h = (bar.val / 20) * 110;
              return (
                <g key={bar.name}>
                  <rect x={bar.x} y={130 - h} width="35" height={h} fill={bar.col} rx="3" />
                  <text x={bar.x + 17.5} y={124 - h} fill="#1e293b" fontSize="10" fontWeight="black" textAnchor="middle">
                    {bar.val}
                  </text>
                  <text x={bar.x + 17.5} y={145} fill="#475569" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {bar.name}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 text-center text-xs font-mono text-indigo-900 font-bold">
            Group 1: (18 + 14 = 32) &nbsp;|&nbsp; Group 2: (12 + 8 = 20) &nbsp;→&nbsp; Difference = <b>32 − 20 = 12</b>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Difference in Total Cars Washed">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: "8 cars", isCorrect: false },
              { id: "B" as const, val: "10 cars", isCorrect: false },
              { id: "C" as const, val: "12 cars", desc: "32 − 20 = 12 (Correct)", isCorrect: true },
              { id: "D" as const, val: "14 cars", isCorrect: false },
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
   Q34 — 🧪 Fraction Balance Pyramid (Sum to 1)
   ══════════════════════════════════════════════════════════════════════ */
interface Q34World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const frac = w.chosenOption === "A" ? "1/6" : w.chosenOption === "B" ? "1/4" : w.chosenOption === "C" ? "1/3" : "5/12";

      return {
        value: `${frac} (Missing Fraction in Row 2)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, frac) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 1/4 + (?) + 5/12 = 1. With common denominator 12: 3/12 + 5/12 + (?) = 1 => 8/12 + (?) = 12/12 => (?) = 4/12 = 1/3."
          : `Selected ${frac}. Row sum: 3/12 + (?) + 5/12 = 12/12.`,
      };
    },
  });

  return (
    <PlayShell
      title="Fraction Balance Pyramid"
      mission="Determine the missing fraction (?) in row 2 such that the sum of all fractions in the row equals 1."
      icon={Scale}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Missing Fraction (?)" value={world.chosenOption === "C" ? "1/3 (Option C)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Fraction Pyramid Visual Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
          {/* Row 1 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold text-slate-500 mr-2">Row 1 (Sum = 1):</span>
            <div className="px-3 py-1.5 bg-white border-2 border-indigo-300 rounded-lg font-mono font-black text-indigo-900">1/2</div>
            <span className="font-bold text-slate-400">+</span>
            <div className="px-3 py-1.5 bg-white border-2 border-indigo-300 rounded-lg font-mono font-black text-indigo-900">1/2</div>
            <span className="font-bold text-emerald-600 text-xs ml-2">= 1 ✓</span>
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 mr-2">Row 2 (Sum = 1):</span>
            <div className="px-3 py-1.5 bg-white border-2 border-indigo-300 rounded-lg font-mono font-bold text-indigo-900">1/4 (3/12)</div>
            <span className="font-bold text-slate-400">+</span>
            <div className="px-4 py-1.5 bg-amber-100 border-2 border-amber-500 rounded-lg font-mono font-black text-amber-900">
              {world.chosenOption === "C" ? "1/3 (4/12)" : world.chosenOption === "A" ? "1/6" : world.chosenOption === "B" ? "1/4" : "5/12"}
            </div>
            <span className="font-bold text-slate-400">+</span>
            <div className="px-3 py-1.5 bg-white border-2 border-indigo-300 rounded-lg font-mono font-bold text-indigo-900">5/12</div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Fraction that Replaces (?)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, frac: "1/6", isCorrect: false },
              { id: "B" as const, frac: "1/4", isCorrect: false },
              { id: "C" as const, frac: "1/3", desc: "4/12 = 1/3 (Correct)", isCorrect: true },
              { id: "D" as const, frac: "5/12", isCorrect: false },
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
                  <span className="text-2xl font-black text-slate-800 my-1 font-mono">{opt.frac}</span>
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
   Q35 — 🔢 Number Construction Crane (Digits 1, 4, 0, 2, 5)
   ══════════════════════════════════════════════════════════════════════ */
interface Q35World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "A" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const sum = w.chosenOption === "A" ? 20490 : w.chosenOption === "B" ? 20492 : w.chosenOption === "C" ? 20488 : 10245;

      return {
        value: `${sum} (Predecessor 10,244 + Successor 10,246)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, sum) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Smallest 5-digit number using 1,4,0,2,5 once is 10,245. Predecessor = 10,244; Successor = 10,246. Sum = 10,244 + 10,246 = 20,490."
          : `Selected ${sum}. First construct the smallest 5-digit number (10,245), then calculate (N−1) + (N+1) = 2N.`,
      };
    },
  });

  return (
    <PlayShell
      title="Number Construction Crane"
      mission="Form the smallest 5-digit number from digits 1, 4, 0, 2, 5 and sum its predecessor and successor."
      icon={Hammer}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Predecessor + Successor" value={world.chosenOption === "A" ? "20,490 (Option A)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Digit Placement Visual */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-slate-500 mb-2">
            Smallest 5-Digit Number (Non-zero leading digit):
          </span>
          <div className="flex gap-2 py-1">
            {["1", "0", "2", "4", "5"].map((d, i) => (
              <div
                key={i}
                className="w-12 h-14 bg-white border-2 border-indigo-400 rounded-xl flex flex-col items-center justify-center font-mono font-black text-xl text-indigo-900 shadow-xs"
              >
                <span>{d}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-center font-mono text-xs text-emerald-900 font-bold">
            10,244 (Predecessor) + 10,246 (Successor) = <b>20,490</b>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Sum of its Predecessor and Successor">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: 20490, desc: "10,244 + 10,246 = 20,490 (Correct)", isCorrect: true },
              { id: "B" as const, val: 20492, isCorrect: false },
              { id: "C" as const, val: 20488, isCorrect: false },
              { id: "D" as const, val: 10245, desc: "The number itself", isCorrect: false },
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

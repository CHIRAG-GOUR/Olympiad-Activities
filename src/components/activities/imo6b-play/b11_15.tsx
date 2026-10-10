"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ListOrdered,
  Eye,
  Sliders,
  Box,
  Grid,
  Sparkles,
  RotateCw,
  Cpu,
  Layers,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — 🔤 Alphabet Sorting Factory (SAFEST -> AEFSST)
   Result: AEFSST (Option B)
   ══════════════════════════════════════════════════════════════════════ */
interface Q11World {
  letters: string[];
}

export function B11AlphabetFactoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q11World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { letters: ["S", "A", "F", "E", "S", "T"] },
    derive: (w) => {
      const code = w.letters.join("");
      const isSorted = code === "AEFSST";
      return {
        value: code,
        optionId: isSorted ? matchOption(question, "B") ?? "B" : undefined,
        note: isSorted
          ? "Alphabetical sort valid: Letters of SAFEST ordered alphabetically produce AEFSST."
          : `Current sequence: ${code}. Arrange letters in standard alphabetical dictionary order.`,
      };
    },
  });

  const swap = (idx: number, dir: -1 | 1) => {
    if (locked) return;
    const target = idx + dir;
    if (target < 0 || target >= world.letters.length) return;
    const next = [...world.letters];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    set({ letters: next });
  };

  return (
    <PlayShell
      title="Alphabet Sorting Factory"
      mission="Operate the sorting gates to arrange the letters of SAFEST in ascending alphabetical order, matching the rule from CREDIT → CDEIRT."
      icon={ListOrdered}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Current Sequence" value={world.letters.join("")} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-3">
            Click arrows to arrange letters in alphabetical order:
          </div>
          <div className="flex gap-2 flex-wrap justify-center py-2">
            {world.letters.map((char, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-14 bg-indigo-600 text-white font-mono font-black text-2xl rounded-xl flex items-center justify-center shadow-md">
                  {char}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={locked || idx === 0}
                    onClick={() => swap(idx, -1)}
                    className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-[10px] font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                    title="Move left"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    disabled={locked || idx === world.letters.length - 1}
                    onClick={() => swap(idx, 1)}
                    className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-[10px] font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                    title="Move right"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            <button
              type="button"
              disabled={locked}
              onClick={() => set({ letters: ["A", "E", "F", "S", "S", "T"] })}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Auto-Sort Alphabetically (AEFSST)
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => set({ letters: ["S", "A", "F", "E", "S", "T"] })}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 cursor-pointer"
            >
              Reset to SAFEST
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — 🪞 Mirror Dimension (3D BOOK Object Reflection)
   Result: Option A
   ══════════════════════════════════════════════════════════════════════ */
interface Q12World {
  mirrorActive: boolean;
}

export function B12MirrorDimensionActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q12World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { mirrorActive: false },
    derive: (w) => {
      return {
        value: w.mirrorActive ? "Mirrored Figure A (ʞOO𐐒)" : "Mirror Inactive",
        optionId: w.mirrorActive ? matchOption(question, "A") ?? "A" : undefined,
        note: w.mirrorActive
          ? "Reflection across vertical right plane mirrors horizontal glyphs (Figure A)."
          : "Align the mirror plane to inspect lateral inversion.",
      };
    },
  });

  return (
    <PlayShell
      title="Mirror Dimension"
      mission="Slide the virtual mirror plane into position to inspect the lateral inversion of the triangular object."
      icon={Eye}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Reflected Geometry" value={world.mirrorActive ? "Figure A (Live)" : "Inactive"} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-6 shadow-sm">
          {/* Object */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 mb-1">Original Object</span>
            <div className="w-28 h-28 bg-white border border-slate-300 rounded-xl flex items-center justify-center p-2 shadow-inner">
              <svg viewBox="0 0 80 80" className="w-24 h-24">
                <polygon points="40,10 70,70 10,70" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <text x="40" y="55" fill="#4338ca" fontSize="12" fontWeight="black" textAnchor="middle">BOOK</text>
              </svg>
            </div>
          </div>

          {/* Mirror Plane */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-2 h-28 rounded-full shadow-md transition-all ${world.mirrorActive ? "bg-cyan-400 ring-4 ring-cyan-200" : "bg-slate-300"}`} />
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ mirrorActive: !w.mirrorActive }))}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm ${
                world.mirrorActive ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {world.mirrorActive ? "Mirror Active ✓" : "Activate Mirror"}
            </button>
          </div>

          {/* Mirrored Reflection */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-600 mb-1">Mirror Image (Live Reflection)</span>
            <div className={`w-28 h-28 rounded-xl flex items-center justify-center p-2 transition-all ${
              world.mirrorActive
                ? "bg-indigo-50 border-2 border-indigo-400 shadow-md"
                : "bg-slate-50 border border-dashed border-slate-300 opacity-40"
            }`}>
              {world.mirrorActive ? (
                <svg viewBox="0 0 80 80" className="w-24 h-24">
                  <polygon points="40,10 70,70 10,70" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
                  <text x="40" y="55" fill="#312e81" fontSize="12" fontWeight="black" textAnchor="middle" transform="scale(-1, 1) translate(-80, 0)">
                    BOOK
                  </text>
                </svg>
              ) : (
                <span className="text-xs text-slate-400 font-semibold">Activate to view</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — ⚙️ Operator Control Room (14 ÷ 6 − 8 + 4 × 10 = 76)
   Original: 14 ÷ 6 − 8 + 4 × 10
   Rules: '+' = ÷, '−' = +, '×' = −, '÷' = ×
   Substituted: 14 × 6 + 8 ÷ 4 − 10 = 76 (Option C)
   ══════════════════════════════════════════════════════════════════════ */
interface Q13World {
  ops: [string, string, string, string];
}

function calcBodmas(nums: number[], ops: string[]): number {
  const n: number[] = [nums[0]];
  const o: string[] = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const next = nums[i + 1];
    if (op === "×" || op === "*") {
      n[n.length - 1] = n[n.length - 1] * next;
    } else if (op === "÷" || op === "/") {
      n[n.length - 1] = next !== 0 ? Math.round((n[n.length - 1] / next) * 100) / 100 : 0;
    } else {
      o.push(op);
      n.push(next);
    }
  }
  let result = n[0];
  for (let i = 0; i < o.length; i++) {
    const op = o[i];
    const next = n[i + 1];
    if (op === "+") {
      result += next;
    } else if (op === "−" || op === "-") {
      result -= next;
    }
  }
  return Math.round(result * 100) / 100;
}

const OP_LIST = ["+", "−", "×", "÷"];

export function B13OperatorControlRoomActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const nums = [14, 6, 8, 4, 10];

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q13World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { ops: ["÷", "−", "+", "×"] },
    derive: (w) => {
      const val = calcBodmas(nums, w.ops);
      const is76 = val === 76;
      const is52 = val === 52;
      const is64 = val === 64;
      const is88 = val === 88;
      let opt: string | undefined = undefined;
      if (is76) opt = matchOption(question, "C") ?? "C";
      else if (is52) opt = matchOption(question, "A") ?? "A";
      else if (is64) opt = matchOption(question, "B") ?? "B";
      else if (is88) opt = matchOption(question, "D") ?? "D";

      return {
        value: `${val}`,
        optionId: opt,
        note: is76
          ? "Calculation verified: 14 × 6 + (8 ÷ 4) − 10 = 84 + 2 − 10 = 76."
          : `Current calculated output: ${val}. Substitute operators according to the rule and evaluate with BODMAS.`,
      };
    },
  });

  const cycleOp = (slotIdx: number) => {
    if (locked) return;
    const cur = world.ops[slotIdx];
    const curPos = OP_LIST.indexOf(cur);
    const nextOp = OP_LIST[(curPos + 1) % OP_LIST.length];
    const nextOps = [...world.ops] as [string, string, string, string];
    nextOps[slotIdx] = nextOp;
    set({ ops: nextOps });
  };

  const setSlotOp = (slotIdx: number, newOp: string) => {
    if (locked) return;
    const nextOps = [...world.ops] as [string, string, string, string];
    nextOps[slotIdx] = newOp;
    set({ ops: nextOps });
  };

  const currentResult = calcBodmas(nums, world.ops);

  return (
    <PlayShell
      title="Operator Control Room"
      mission="Substitute the operators: '+' becomes '÷', '−' becomes '+', '×' becomes '−', and '÷' becomes '×'. Then evaluate the equation."
      icon={Sliders}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Calculated Value" value={`${currentResult}`} />}
    >
      <div className="space-y-4">
        {/* Rules Key */}
        <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
          <span className="text-slate-500 font-bold uppercase tracking-wide text-[10px]">Rule Key:</span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            <strong className="text-indigo-600">+</strong> &rarr; <strong className="text-purple-600">&divide;</strong>
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            <strong className="text-rose-600">&minus;</strong> &rarr; <strong className="text-emerald-600">+</strong>
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            <strong className="text-amber-600">&times;</strong> &rarr; <strong className="text-rose-600">&minus;</strong>
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            <strong className="text-purple-600">&divide;</strong> &rarr; <strong className="text-amber-600">&times;</strong>
          </span>
        </div>

        {/* Equation Machine */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">
            Click operator boxes to change or substitute operators:
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap py-3 font-mono font-black text-xl sm:text-2xl text-slate-800">
            <span className="w-10 h-12 bg-white rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
              14
            </span>

            {/* Slot 0 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={locked}
                onClick={() => cycleOp(0)}
                className="w-10 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                title="Click to cycle operator"
              >
                {world.ops[0]}
              </button>
              <div className="flex gap-0.5 mt-1">
                {OP_LIST.map((op) => (
                  <button
                    key={op}
                    type="button"
                    disabled={locked}
                    onClick={() => setSlotOp(0, op)}
                    className={`w-4 h-4 text-[9px] rounded flex items-center justify-center font-bold ${
                      world.ops[0] === op ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <span className="w-10 h-12 bg-white rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
              6
            </span>

            {/* Slot 1 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={locked}
                onClick={() => cycleOp(1)}
                className="w-10 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                title="Click to cycle operator"
              >
                {world.ops[1]}
              </button>
              <div className="flex gap-0.5 mt-1">
                {OP_LIST.map((op) => (
                  <button
                    key={op}
                    type="button"
                    disabled={locked}
                    onClick={() => setSlotOp(1, op)}
                    className={`w-4 h-4 text-[9px] rounded flex items-center justify-center font-bold ${
                      world.ops[1] === op ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <span className="w-10 h-12 bg-white rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
              8
            </span>

            {/* Slot 2 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={locked}
                onClick={() => cycleOp(2)}
                className="w-10 h-12 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                title="Click to cycle operator"
              >
                {world.ops[2]}
              </button>
              <div className="flex gap-0.5 mt-1">
                {OP_LIST.map((op) => (
                  <button
                    key={op}
                    type="button"
                    disabled={locked}
                    onClick={() => setSlotOp(2, op)}
                    className={`w-4 h-4 text-[9px] rounded flex items-center justify-center font-bold ${
                      world.ops[2] === op ? "bg-purple-700 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <span className="w-10 h-12 bg-white rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
              4
            </span>

            {/* Slot 3 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={locked}
                onClick={() => cycleOp(3)}
                className="w-10 h-12 bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                title="Click to cycle operator"
              >
                {world.ops[3]}
              </button>
              <div className="flex gap-0.5 mt-1">
                {OP_LIST.map((op) => (
                  <button
                    key={op}
                    type="button"
                    disabled={locked}
                    onClick={() => setSlotOp(3, op)}
                    className={`w-4 h-4 text-[9px] rounded flex items-center justify-center font-bold ${
                      world.ops[3] === op ? "bg-rose-700 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <span className="w-10 h-12 bg-white rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
              10
            </span>

            <span className="text-slate-400 font-bold px-1">=</span>

            <span className="px-3.5 py-1.5 bg-indigo-900 text-amber-300 rounded-xl shadow-inner font-mono font-black text-2xl">
              {currentResult}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            <button
              type="button"
              disabled={locked}
              onClick={() => set({ ops: ["×", "+", "÷", "−"] })}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Apply Substituted Operators (&times;, +, &divide;, &minus;)
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => set({ ops: ["÷", "−", "+", "×"] })}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 cursor-pointer"
            >
              Reset to Original Equation
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — 🧊 Cube Construction Yard (3D Stacked Cubes)
   Result: 27 Cubes (Option B)
   ══════════════════════════════════════════════════════════════════════ */
interface Q14World {
  cubeCount: number;
}

export function B14CubeConstructionYardActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q14World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { cubeCount: 1 },
    derive: (w) => {
      const is27 = w.cubeCount === 27;
      return {
        value: `${w.cubeCount} Cubes`,
        optionId: is27 ? matchOption(question, "B") ?? "B" : undefined,
        note: is27
          ? "Spatial layer enumeration complete: Top + middle + base foundation total 27 cubes."
          : `Current cube count: ${w.cubeCount}. Inspect hidden base foundation layers.`,
      };
    },
  });

  return (
    <PlayShell
      title="Cube Construction Yard"
      mission="Rotate the 3D model, pull layers apart, and inspect hidden cubes to count the total number of unit cubes in the structure."
      icon={Box}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Counted Cubes" value={`${world.cubeCount} Cubes`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 160 140" className="w-44 h-36 drop-shadow-md">
            {/* Isometric Cubes Layer */}
            <g transform="translate(40, 20)">
              <polygon points="40,10 70,25 40,40 10,25" fill="#818cf8" stroke="#3730a3" strokeWidth="1.5" />
              <polygon points="10,25 40,40 40,70 10,55" fill="#6366f1" stroke="#3730a3" strokeWidth="1.5" />
              <polygon points="70,25 40,40 40,70 70,55" fill="#4f46e5" stroke="#3730a3" strokeWidth="1.5" />

              <polygon points="70,25 100,40 70,55 40,40" fill="#818cf8" stroke="#3730a3" strokeWidth="1.5" />
              <polygon points="70,55 100,40 100,70 70,85" fill="#4f46e5" stroke="#3730a3" strokeWidth="1.5" />
            </g>
          </svg>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ cubeCount: Math.max(1, w.cubeCount - 1) }))}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
            >
              − Remove Cube
            </button>
            <span className="font-mono text-base font-black text-indigo-700">{world.cubeCount}</span>
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ cubeCount: w.cubeCount + 1 }))}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow-sm"
            >
              + Add Cube
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — 🎯 Arrow Matrix Reactor (3x3 Matrix Completion)
   Result: Option C (3 rightward horizontal arrows)
   ══════════════════════════════════════════════════════════════════════ */
interface Q15World {
  arrowCount: number; // 3
  arrowDir: "horizontal" | "vertical"; // horizontal
}

export function B15ArrowMatrixReactorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q15World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { arrowCount: 1, arrowDir: "vertical" },
    derive: (w) => {
      const isTarget = w.arrowCount === 3 && w.arrowDir === "horizontal";
      return {
        value: `${w.arrowCount} ${w.arrowDir} arrows (Figure ${isTarget ? "C" : "?"})`,
        optionId: isTarget ? matchOption(question, "C") ?? "C" : undefined,
        note: isTarget
          ? "Row progression matched: Row 2 contains 1 horizontal → 2 vertical → 3 horizontal arrows facing right."
          : "Adjust arrow count and orientation in cell (2, 3) to complete the matrix pattern.",
      };
    },
  });

  return (
    <PlayShell
      title="Arrow Matrix Reactor"
      mission="Configure the missing cell in the 3×3 matrix to satisfy the row/column progression rules."
      icon={Grid}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Cell Output" value={`${world.arrowCount} ${world.arrowDir} arrows`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <div className="w-32 h-32 bg-white border-2 border-indigo-400 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-inner p-3">
            {Array.from({ length: world.arrowCount }).map((_, i) => (
              <div key={i} className="text-indigo-600 font-bold text-xl">
                {world.arrowDir === "horizontal" ? "→" : "↑"}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((cnt) => (
              <button
                key={cnt}
                type="button"
                disabled={locked}
                onClick={() => set((w) => ({ ...w, arrowCount: cnt }))}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  world.arrowCount === cnt
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cnt} Arrows
              </button>
            ))}
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ ...w, arrowDir: w.arrowDir === "horizontal" ? "vertical" : "horizontal" }))}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Toggle Direction
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

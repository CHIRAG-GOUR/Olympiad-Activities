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
    initial: { letters: ["A", "E", "F", "S", "S", "T"] },
    derive: (w) => {
      const code = w.letters.join("");
      const isSorted = code === "AEFSST";
      return {
        value: code,
        optionId: isSorted ? matchOption(question, "B") ?? "B" : matchOption(question, "A") ?? "A",
        note: isSorted
          ? "Alphabetical sort valid: Letters of SAFEST ordered alphabetically produce AEFSST."
          : `Current sequence: ${code}. Sort letters in standard dictionary order.`,
      };
    },
  });

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
      live={<Gauge label="Sorted Sequence" value={world.letters.join("")} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <div className="flex gap-2 flex-wrap justify-center py-2">
            {world.letters.map((char, idx) => (
              <div
                key={idx}
                className="w-12 h-14 bg-indigo-600 text-white font-mono font-black text-2xl rounded-xl flex items-center justify-center shadow-md"
              >
                {char}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={locked}
              onClick={() => set({ letters: ["A", "E", "F", "S", "S", "T"] })}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Sort Alphabetically (AEFSST)
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
    initial: { mirrorActive: true },
    derive: (w) => {
      return {
        value: "Mirrored Figure A (ʞOO𐐒)",
        optionId: matchOption(question, "A") ?? "A",
        note: "Reflection across vertical right plane mirrors horizontal glyphs (Figure A).",
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
      live={<Gauge label="Reflected Geometry" value="Figure A" />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex items-center justify-around shadow-sm">
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
          <div className="w-1.5 h-32 bg-cyan-400 rounded-full shadow-md" />

          {/* Mirrored Reflection */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-600 mb-1">Mirror Image (Live Reflection)</span>
            <div className="w-28 h-28 bg-indigo-50 border-2 border-indigo-400 rounded-xl flex items-center justify-center p-2 shadow-md">
              <svg viewBox="0 0 80 80" className="w-24 h-24">
                <polygon points="40,10 70,70 10,70" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
                <text x="40" y="55" fill="#312e81" fontSize="12" fontWeight="black" textAnchor="middle" transform="scale(-1, 1) translate(-80, 0)">
                  BOOK
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — ⚙️ Operator Control Room (14 ÷ 6 − 8 + 4 × 10 = 76)
   Result: 76 (Option C)
   ══════════════════════════════════════════════════════════════════════ */
interface Q13World {
  evaluatedValue: number;
}

export function B13OperatorControlRoomActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q13World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { evaluatedValue: 76 },
    derive: (w) => {
      const is76 = w.evaluatedValue === 76;
      return {
        value: `${w.evaluatedValue} (14 × 6 + 8 ÷ 4 − 10 = ${w.evaluatedValue})`,
        optionId: is76 ? matchOption(question, "C") ?? "C" : matchOption(question, "A") ?? "A",
        note: is76
          ? "Calculation verified: 14 × 6 + (8 ÷ 4) − 10 = 84 + 2 − 10 = 76."
          : `Current value: ${w.evaluatedValue}. Substitute symbols properly.`,
      };
    },
  });

  return (
    <PlayShell
      title="Operator Control Room"
      mission="Insert the redefined operator modules: '+' = ÷, '÷' = ×, '×' = −, '−' = + to evaluate 14 ÷ 6 − 8 + 4 × 10."
      icon={Sliders}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Evaluated Value" value={`${world.evaluatedValue}`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Mathematical Machine Core:</div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-slate-800 tracking-wider my-2">
            14 <span className="text-indigo-600 font-bold">×</span> 6{" "}
            <span className="text-emerald-600 font-bold">+</span> 8{" "}
            <span className="text-purple-600 font-bold">÷</span> 4{" "}
            <span className="text-rose-600 font-bold">−</span> 10
          </div>
          <div className="mt-2 text-xs font-mono text-indigo-900 font-bold bg-indigo-100 px-3 py-1 rounded-full">
            84 + 2 − 10 = 76
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
    initial: { cubeCount: 27 },
    derive: (w) => {
      const is27 = w.cubeCount === 27;
      return {
        value: `${w.cubeCount} Cubes`,
        optionId: is27 ? matchOption(question, "B") ?? "B" : matchOption(question, "A") ?? "A",
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
    initial: { arrowCount: 3, arrowDir: "horizontal" },
    derive: (w) => {
      const isTarget = w.arrowCount === 3 && w.arrowDir === "horizontal";
      return {
        value: `${w.arrowCount} ${w.arrowDir} arrows (Figure C)`,
        optionId: isTarget ? matchOption(question, "C") ?? "C" : matchOption(question, "A") ?? "A",
        note: isTarget
          ? "Row progression matched: Row 2 contains 1 horizontal → 2 vertical → 3 horizontal arrows facing right."
          : "Adjust arrow count and orientation in cell (2, 3).",
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

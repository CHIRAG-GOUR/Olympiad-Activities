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
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — 🧊 3D Solid Inspector (Triangular Prism)
   ══════════════════════════════════════════════════════════════════════ */
interface Q21World {
  facesCount: number;
  verticesCount: number;
  edgesCount: number;
  rotationY: number;
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
    initial: {
      facesCount: 5,
      verticesCount: 6,
      edgesCount: 9,
      rotationY: 25,
    },
    derive: (w) => {
      const isCorrect =
        w.facesCount === 5 && w.verticesCount === 6 && w.edgesCount === 9;
      if (isCorrect) {
        return {
          value: `P = 5, Q = 6, R = 9`,
          optionId: matchText(question, "D") ?? "D",
        };
      }
      return {
        value: `P=${w.facesCount}, Q=${w.verticesCount}, R=${w.edgesCount}`,
        note: "Inspect all faces, vertices, and edges of the triangular prism.",
      };
    },
  });

  return (
    <PlayShell
      title="3D Solid Inspector (Triangular Prism)"
      mission="Rotate the 3D triangular prism and count its faces (P), vertices (Q), and edges (R)."
      icon={Box}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <>
          <Gauge label="Faces (P)" value={String(world.facesCount)} />
          <Gauge label="Vertices (Q)" value={String(world.verticesCount)} />
          <Gauge label="Edges (R)" value={String(world.edgesCount)} />
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 240 180" className="w-56 h-44 drop-shadow-lg">
            <defs>
              <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <polygon points="120,20 180,60 140,80" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="60,80 120,20 140,80 80,140" fill="url(#prismGrad)" stroke="#c084fc" strokeWidth="2" opacity="0.85" />
            <polygon points="80,140 140,80 180,60 120,120" fill="#4338ca" stroke="#c084fc" strokeWidth="2" opacity="0.75" />
            <polygon points="60,80 120,120 80,140" fill="#4f46e5" stroke="#facc15" strokeWidth="2.5" />

            {[
              { x: 60, y: 80, label: "V1" },
              { x: 120, y: 120, label: "V2" },
              { x: 80, y: 140, label: "V3" },
              { x: 120, y: 20, label: "V4" },
              { x: 180, y: 60, label: "V5" },
              { x: 140, y: 80, label: "V6" },
            ].map((v, i) => (
              <circle key={i} cx={v.x} cy={v.y} r="4.5" fill="#facc15" stroke="#000" strokeWidth="1" />
            ))}
          </svg>

          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-600">
            <span>Drag / Rotate Prism</span>
            <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
          </div>
        </div>

        <Bay label="Measured Topology Summary">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 block">Faces (P)</span>
              <span className="font-mono text-xl font-black text-indigo-700">5</span>
              <span className="text-[9px] text-slate-500 block">2 Triangles + 3 Rectangles</span>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 block">Vertices (Q)</span>
              <span className="font-mono text-xl font-black text-indigo-700">6</span>
              <span className="text-[9px] text-slate-500 block">3 Top + 3 Bottom</span>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 block">Edges (R)</span>
              <span className="font-mono text-xl font-black text-indigo-700">9</span>
              <span className="text-[9px] text-slate-500 block">3 + 3 + 3 Pillars</span>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — 🍕 Fraction Sorting Table
   ══════════════════════════════════════════════════════════════════════ */
interface Q22World {
  sortedOrder: string;
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
    initial: { sortedOrder: "P < Q < R < S" },
    derive: (w) => {
      return {
        value: "Option B (P < Q < R < S)",
        optionId: matchText(question, "B") ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Fraction Sorting Table"
      mission="Derive the shaded fractions of figures P, Q, R, and S and sort them into ascending order."
      icon={PieChart}
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "P", frac: "1/4", deg: 90, col: "#3b82f6" },
            { id: "Q", frac: "3/8", deg: 135, col: "#8b5cf6" },
            { id: "R", frac: "1/2", deg: 180, col: "#ec4899" },
            { id: "S", frac: "5/8", deg: 225, col: "#10b981" },
          ].map((item) => (
            <div key={item.id} className="p-3 bg-white border-2 border-slate-200 rounded-xl text-center shadow-sm">
              <span className="text-[10px] font-mono text-slate-500 block mb-1">Figure {item.id}</span>
              <svg viewBox="0 0 60 60" className="w-12 h-12 mx-auto my-1">
                <circle cx="30" cy="30" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                <path
                  d={`M 30 30 L 30 5 A 25 25 0 0 1 ${30 + 25 * Math.sin((item.deg * Math.PI) / 180)} ${
                    30 - 25 * Math.cos((item.deg * Math.PI) / 180)
                  } Z`}
                  fill={item.col}
                />
              </svg>
              <span className="font-mono text-xs font-bold text-slate-700">{item.frac}</span>
            </div>
          ))}
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — 🔢 Decimal Translation Machine
   ══════════════════════════════════════════════════════════════════════ */
interface Q23World {
  selectedPair: string;
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
    initial: { selectedPair: "C" },
    derive: (w) => {
      return {
        value: "Option C (Sixteen and two tenths → 16.2)",
        optionId: matchText(question, "C") ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Decimal Translation Machine"
      mission="Translate words into place-value blocks and find the correctly matched decimal pair."
      icon={Binary}
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
        <Bay label="Decimal Translation Pairs">
          <div className="space-y-2">
            {[
              { id: "A", words: "Twelve and thirty-nine thousandths", num: "12.420", valid: false },
              { id: "B", words: "Four and forty hundredths", num: "4.004", valid: false },
              { id: "C", words: "Sixteen and two tenths", num: "16.2", valid: true },
              { id: "D", words: "Eight and five hundredths", num: "80.50", valid: false },
            ].map((p) => (
              <div
                key={p.id}
                className={`p-3 rounded-xl border-2 flex items-center justify-between ${
                  p.valid ? "bg-emerald-50 border-emerald-500" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-slate-800">
                    Option {p.id}: {p.words}
                  </span>
                  <span className="text-xs font-mono text-slate-500 block mt-0.5">
                    Matches: <span className="font-bold text-slate-900">{p.num}</span>
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    p.valid ? "bg-emerald-600 text-white" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {p.valid ? "Correct Match ✓" : "Incorrect"}
                </span>
              </div>
            ))}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — 📐 Angle Matching
   ══════════════════════════════════════════════════════════════════════ */
interface Q24World {
  matchedOption: string;
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
    initial: { matchedOption: "D" },
    derive: (w) => {
      return {
        value: "Option D",
        optionId: matchText(question, "D") ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Angle Observatory"
      mission="Rotate the protractor across rays to classify angles as acute, right, obtuse, or straight."
      icon={Compass}
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
          <svg viewBox="0 0 240 140" className="w-60 h-36 bg-white/60 rounded-lg border border-slate-200">
            <line x1="20" y1="100" x2="220" y2="100" stroke="#facc15" strokeWidth="2.5" />
            <text x="20" y="115" fill="#fde047" fontSize="11" fontWeight="bold">D</text>
            <text x="120" y="115" fill="#fde047" fontSize="11" fontWeight="bold">O</text>
            <text x="220" y="115" fill="#fde047" fontSize="11" fontWeight="bold">B</text>

            <line x1="120" y1="100" x2="180" y2="30" stroke="#38bdf8" strokeWidth="2" />
            <text x="185" y="25" fill="#38bdf8" fontSize="11" fontWeight="bold">A</text>

            <line x1="120" y1="100" x2="120" y2="20" stroke="#a855f7" strokeWidth="2" />
            <text x="120" y="15" fill="#a855f7" fontSize="11" fontWeight="bold">C</text>

            <line x1="120" y1="100" x2="50" y2="30" stroke="#ec4899" strokeWidth="2" />
            <text x="45" y="25" fill="#ec4899" fontSize="11" fontWeight="bold">E</text>

            <circle cx="120" cy="100" r="4" fill="#facc15" />
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — 🏃 Number Line Addition
   ══════════════════════════════════════════════════════════════════════ */
interface Q25World {
  startPos: number;
  jumps: number;
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
    initial: { startPos: -5, jumps: 8 },
    derive: (w) => {
      const finalPos = w.startPos + w.jumps;
      return {
        value: `+${finalPos} (from −5 + 8)`,
        optionId: matchText(question, "C") ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Number Line Runner"
      mission="Start at −5, perform eight positive unit jumps to the right, and locate the final number."
      icon={MoveRight}
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
          <Gauge label="Start Position" value={String(world.startPos)} />
          <Gauge label="Unit Jumps" value={`+${world.jumps}`} />
          <Gauge label="Final Position" value={String(world.startPos + world.jumps)} />
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-4 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox="0 0 320 120" className="w-full max-w-md h-28 bg-white/60 rounded-lg border border-slate-200">
            <line x1="20" y1="80" x2="300" y2="80" stroke="#64748b" strokeWidth="2.5" />

            {Array.from({ length: 13 }).map((_, i) => {
              const val = i - 6;
              const x = 30 + i * 21.6;
              return (
                <g key={val}>
                  <line x1={x} y1="75" x2={x} y2="85" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x={x} y="98" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    {val}
                  </text>
                </g>
              );
            })}

            <path
              d="M 51.6 75 Q 160 10 245 75"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            <circle cx="51.6" cy="80" r="5" fill="#f43f5e" />
            <circle cx="245" cy="80" r="5" fill="#10b981" />
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

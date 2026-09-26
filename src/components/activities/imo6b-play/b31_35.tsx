"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Compass,
  Gavel,
  Grid,
  Trophy,
  Sparkles,
  CheckCircle2,
  Apple,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — ⚖️ Fruit Market Algebra
   Mango + 2 Pineapples = 400
   Mango + Pineapple = 240
   => Pineapple = 160, Mango = 80
   Answer: A (160, 80)
   ══════════════════════════════════════════════════════════════════════ */
interface Q31World {
  pineappleWeight: number;
  mangoWeight: number;
}

export function B31FruitMarketAlgebraActivity({
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
    initial: { pineappleWeight: 160, mangoWeight: 80 },
    derive: (w) => {
      const isTarget = w.pineappleWeight === 160 && w.mangoWeight === 80;
      return {
        value: `${w.pineappleWeight}, ${w.mangoWeight}`,
        optionId: isTarget ? matchOption(question, "A") ?? "A" : undefined,
        note: `(Mango + 2 Pineapples) − (Mango + Pineapple) = 400 − 240 ⇒ Pineapple = 160. Then Mango = 240 − 160 = 80. (Option A: 160, 80).`,
      };
    },
  });

  return (
    <PlayShell
      title="Fruit Market Algebra"
      mission="Solve the dual fruit balance equations to determine the weights of Pineapple and Mango respectively."
      icon={Scale}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <Gauge
          label="Derived Weights"
          value={`Pineapple: ${world.pineappleWeight}g, Mango: ${world.mangoWeight}g`}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Balance 1 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Balance Scale 1
            </span>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center mb-3">
              <span className="text-sm font-mono text-slate-300">
                🥭 Mango + 🍍 Pineapple + 🍍 Pineapple = 400g
              </span>
            </div>
            <div className="text-xs text-slate-400">
              M + 2P = 400
            </div>
          </div>

          {/* Balance 2 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2">
              Balance Scale 2
            </span>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center mb-3">
              <span className="text-sm font-mono text-slate-300">
                🍍 Pineapple + 🥭 Mango = 240g
              </span>
            </div>
            <div className="text-xs text-slate-400">
              P + M = 240
            </div>
          </div>
        </div>

        {/* Algebraic Extraction Solution */}
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl text-white">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">
            Scale Subtraction Resolver
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Pineapple Weight (P)</span>
              <span className="text-2xl font-black font-mono text-amber-400">
                400 − 240 = 160g
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Mango Weight (M)</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                240 − 160 = 80g
              </span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — 📐 3D Line Surveyor (4 pairs of parallel lines)
   Answer: A (4)
   ══════════════════════════════════════════════════════════════════════ */
interface Q32World {
  detectedPairs: number;
}

export function B32LineSurveyorActivity({
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
    initial: { detectedPairs: 4 },
    derive: (w) => {
      return {
        value: `${w.detectedPairs}`,
        optionId: w.detectedPairs === 4 ? matchOption(question, "A") ?? "A" : undefined,
        note: `The surveyor scans parallel line sets (p || q, q || r, p || r) and transversal parallel pairs = 4 pairs of parallel lines (Option A: 4).`,
      };
    },
  });

  return (
    <PlayShell
      title="3D Line Surveyor"
      mission="Deploy laser parallelism beams on the engineering scaffold to count all distinct pairs of parallel lines."
      icon={Compass}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Parallel Line Pairs" value={`${world.detectedPairs} Pairs`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col items-center">
          {/* Geometric Lines Scaffold */}
          <div className="relative w-full max-w-md h-52 bg-slate-950 rounded-xl border border-slate-800 p-4">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Horizontal parallel lines p, q, r */}
              <line x1="40" y1="40" x2="360" y2="40" stroke="#38bdf8" strokeWidth="2" />
              <text x="370" y="45" fill="#38bdf8" fontSize="12" fontWeight="bold">p</text>

              <line x1="40" y1="90" x2="360" y2="90" stroke="#38bdf8" strokeWidth="2" />
              <text x="370" y="95" fill="#38bdf8" fontSize="12" fontWeight="bold">q</text>

              <line x1="40" y1="140" x2="360" y2="140" stroke="#38bdf8" strokeWidth="2" />
              <text x="370" y="145" fill="#38bdf8" fontSize="12" fontWeight="bold">r</text>

              {/* Transversals */}
              <line x1="120" y1="20" x2="80" y2="170" stroke="#f43f5e" strokeWidth="2" />
              <line x1="200" y1="20" x2="160" y2="170" stroke="#f43f5e" strokeWidth="2" />
              <line x1="280" y1="20" x2="320" y2="170" stroke="#a855f7" strokeWidth="2" />
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 w-full text-center">
            {["(p, q)", "(q, r)", "(p, r)", "Transversals"].map((pair, idx) => (
              <div key={idx} className="bg-slate-800/80 p-2 rounded-lg border border-sky-500/30">
                <span className="text-[10px] text-slate-400 block">Pair {idx + 1}</span>
                <span className="text-xs font-mono font-bold text-sky-300">{pair}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — ⚖️ Number Theory Courtroom (Every whole number has a successor)
   Answer: B
   ══════════════════════════════════════════════════════════════════════ */
interface Q33World {
  verifiedStatement: string;
}

export function B33NumberTheoryCourtroomActivity({
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
    initial: { verifiedStatement: "Every whole number has a successor." },
    derive: (w) => {
      const isTarget = w.verifiedStatement.includes("Every whole number has a successor");
      return {
        value: "Every whole number has a successor.",
        optionId: isTarget ? matchOption(question, "B") ?? "B" : undefined,
        note: `For any whole number n, its successor n + 1 always exists in whole numbers. (Option B is correct).`,
      };
    },
  });

  return (
    <PlayShell
      title="Number Theory Courtroom"
      mission="Audit the four number theory statements to certify the universally correct mathematical rule."
      icon={Gavel}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Certified True Rule" value="Every whole number has a successor" />}
    >
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl space-y-3">
          {/* Statement stations */}
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/20 flex justify-between items-center opacity-60">
            <div>
              <span className="text-xs font-bold text-slate-300 block">
                Smallest natural number is 0
              </span>
              <span className="text-[10px] text-rose-400">
                False: Smallest natural number is 1.
              </span>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">DISPROVEN</span>
          </div>

          <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-950/40 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-white block">
                Every whole number has a successor
              </span>
              <span className="text-[10px] text-emerald-400">
                True: For every n ∈ W, n + 1 exists.
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-900/50 px-2 py-1 rounded">
              CERTIFIED TRUE (Option B)
            </span>
          </div>

          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/20 flex justify-between items-center opacity-60">
            <div>
              <span className="text-xs font-bold text-slate-300 block">
                Predecessor of a two digit number is always a two digit number
              </span>
              <span className="text-[10px] text-rose-400">
                False: Predecessor of 10 is 9 (single digit).
              </span>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">DISPROVEN</span>
          </div>

          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/20 flex justify-between items-center opacity-60">
            <div>
              <span className="text-xs font-bold text-slate-300 block">
                Smallest whole number is 1
              </span>
              <span className="text-[10px] text-rose-400">
                False: Smallest whole number is 0.
              </span>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">DISPROVEN</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — 🟦 Fraction Tile Observatory (10 shaded out of 18 = 5/9)
   Answer: A (5/9)
   ══════════════════════════════════════════════════════════════════════ */
interface Q34World {
  shadedCount: number;
  totalCount: number;
}

export function B34FractionTileObservatoryActivity({
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
    initial: { shadedCount: 10, totalCount: 18 },
    derive: (w) => {
      const isTarget = w.shadedCount === 10 && w.totalCount === 18;
      return {
        value: `5/9`,
        optionId: isTarget ? matchOption(question, "A") ?? "A" : undefined,
        note: `Total triangular units = 18. Shaded triangular units = 10. Shaded fraction = 10/18 = 5/9. (Option A: 5/9).`,
      };
    },
  });

  return (
    <PlayShell
      title="Fraction Tile Observatory"
      mission="Count shaded triangular sub-tiles out of the 18 total triangular units in the 3×3 square grid."
      icon={Grid}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Shaded Fraction" value="5/9 (10/18)" />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-around gap-6">
          {/* 3x3 Subdivided Grid SVG */}
          <div className="relative p-4 bg-slate-950 rounded-xl border border-slate-800">
            <svg width="200" height="200" viewBox="0 0 180 180" className="border-2 border-indigo-500">
              {/* 3x3 Grid lines */}
              <line x1="60" y1="0" x2="60" y2="180" stroke="#475569" strokeWidth="2" />
              <line x1="120" y1="0" x2="120" y2="180" stroke="#475569" strokeWidth="2" />
              <line x1="0" y1="60" x2="180" y2="60" stroke="#475569" strokeWidth="2" />
              <line x1="0" y1="120" x2="180" y2="120" stroke="#475569" strokeWidth="2" />

              {/* Diagonal subdivisions for shaded triangles */}
              {/* Row 1 */}
              <polygon points="0,0 60,0 60,60" fill="#6366f1" />
              <polygon points="60,0 120,60 60,60" fill="#6366f1" />
              <polygon points="120,0 180,0 180,60" fill="#6366f1" />

              {/* Row 2 */}
              <polygon points="0,60 60,120 0,120" fill="#6366f1" />
              <polygon points="60,60 120,60 120,120" fill="#6366f1" />
              <polygon points="120,60 180,120 120,120" fill="#6366f1" />

              {/* Row 3 */}
              <polygon points="0,120 60,120 60,180" fill="#6366f1" />
              <polygon points="60,120 120,180 60,180" fill="#6366f1" />
              <polygon points="120,120 180,120 180,180" fill="#6366f1" />
              <polygon points="120,180 180,180 120,120" fill="#6366f1" />
            </svg>
          </div>

          {/* Fraction Breakdown */}
          <div className="space-y-3 text-center md:text-left">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Shaded Triangles</span>
              <span className="text-xl font-mono font-bold text-indigo-400">10 Triangles</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Total Triangles</span>
              <span className="text-xl font-mono font-bold text-slate-200">18 Triangles</span>
            </div>
            <div className="bg-indigo-950/60 p-4 rounded-xl border border-indigo-500/40 text-center">
              <span className="text-[10px] text-indigo-300 block uppercase">Reduced Fraction</span>
              <span className="text-3xl font-mono font-black text-emerald-400">5 / 9</span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — ⚽ Football Data Arena (Goals >= 2 count = 16)
   Data: 2, 3, 2, 1, 0, 4, 3, 1, 2, 0, 3, 2, 1, 3, 0, 2, 5, 2, 4, 3, 1, 2, 1, 3
   Answer: D (16)
   ══════════════════════════════════════════════════════════════════════ */
const MATCH_GOALS = [
  2, 3, 2, 1, 0, 4, 3, 1, 2, 0, 3, 2, 1, 3, 0, 2, 5, 2, 4, 3, 1, 2, 1, 3,
];

interface Q35World {
  threshold: number; // 2
}

export function B35FootballDataArenaActivity({
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
    initial: { threshold: 2 },
    derive: (w) => {
      const qualifying = MATCH_GOALS.filter((g) => g >= w.threshold).length; // 16
      return {
        value: `${qualifying}`,
        optionId: qualifying === 16 ? matchOption(question, "D") ?? "D" : undefined,
        note: `In 24 matches, scores with at least 2 goals (≥2) occur 16 times: [2, 3, 2, 4, 3, 2, 3, 2, 3, 2, 5, 2, 4, 3, 2, 3]. (Option D: 16).`,
      };
    },
  });

  const qualifyingCount = MATCH_GOALS.filter((g) => g >= world.threshold).length;

  return (
    <PlayShell
      title="Football Data Arena"
      mission="Filter the 24 match results in the arena scoring tunnel to count matches where the player scored at least 2 goals."
      icon={Trophy}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Qualifying Matches (≥ 2 Goals)" value={`${qualifyingCount} Matches`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              24 Match Ball Stadium Grid
            </span>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40">
              Matches with ≥ 2 Goals: {qualifyingCount}
            </span>
          </div>

          {/* 24 match balls grid */}
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
            {MATCH_GOALS.map((goals, idx) => {
              const isQualifying = goals >= world.threshold;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-center font-mono font-bold text-xs transition-all border ${
                    isQualifying
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md"
                      : "bg-slate-800/40 border-slate-700/50 text-slate-500 opacity-40"
                  }`}
                >
                  <span className="text-[9px] text-slate-400 block">M{idx + 1}</span>
                  <span className="text-sm">{goals} ⚽</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            16 out of 24 matches have 2 or more goals.
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Vault,
  Compass,
  Atom,
  HardHat,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  GitMerge,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — 🏛️ Mathematical Matching Vault
   (P) -> 5800 (iii)
   (Q) -> 1800 (i)
   (R) -> 9837 (ii)
   Answer: A ((P)->(iii), (Q)->(i), (R)->(ii))
   ══════════════════════════════════════════════════════════════════════ */
interface Q46World {
  p_match: string;
  q_match: string;
  r_match: string;
}

export function B46MatchingVaultActivity({
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
    initial: { p_match: "(iii)", q_match: "(i)", r_match: "(ii)" },
    derive: (w) => {
      const isTarget = w.p_match === "(iii)" && w.q_match === "(i)" && w.r_match === "(ii)";
      return {
        value: "(P)->(iii), (Q)->(i), (R)->(ii)",
        optionId: isTarget ? matchOption(question, "A") ?? "A" : undefined,
        note: `(P) 5000 + 800 = 5800 -> (iii). (Q) 1000 + 800 = 1800 -> (i). (R) Greatest 4-digit distinct digits with 3 at tens place = 9837 -> (ii). Matching is (P)-(iii), (Q)-(i), (R)-(ii) (Option A).`,
      };
    },
  });

  return (
    <PlayShell
      title="Mathematical Matching Vault"
      mission="Connect the three algebraic statement conduits to their matching mathematical vault solutions."
      icon={Vault}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Matched Sequence" value="(P)→(iii), (Q)→(i), (R)→(ii)" />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl space-y-4">
          {/* P Statement */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-sky-500/40 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-sky-400 block mb-1">
                (P) Sum of place values of 5 and 8 in 95807
              </span>
              <span className="text-[11px] text-slate-300">5000 + 800 = 5800</span>
            </div>
            <span className="text-sm font-mono font-bold text-sky-300 bg-sky-950 px-3 py-1.5 rounded-lg border border-sky-500/50">
              (iii) 5800
            </span>
          </div>

          {/* Q Statement */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-amber-500/40 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 block mb-1">
                (Q) 8 hundreds more than smallest 4-digit even number
              </span>
              <span className="text-[11px] text-slate-300">1000 + 800 = 1800</span>
            </div>
            <span className="text-sm font-mono font-bold text-amber-300 bg-amber-950 px-3 py-1.5 rounded-lg border border-amber-500/50">
              (i) 1800
            </span>
          </div>

          {/* R Statement */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-emerald-500/40 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                (R) Greatest 4-digit number with distinct digits & 3 at tens place
              </span>
              <span className="text-[11px] text-slate-300">Digits 9, 8, 3, 7 → 9837</span>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-300 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-500/50">
              (ii) 9837
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — 🧭 Navigation Compass Tower
   Statement-I: 1/4 rev = right angle (90°) -> TRUE
   Statement-II: North to SW clockwise = 225° / 360° = 5/8 rev -> TRUE
   Answer: C (Both Statement-I and Statement-II are true)
   ══════════════════════════════════════════════════════════════════════ */
interface Q47World {
  s1True: boolean;
  s2True: boolean;
}

export function B47CompassTowerActivity({
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
    initial: { s1True: true, s2True: true },
    derive: (w) => {
      const isTarget = w.s1True && w.s2True;
      return {
        value: "Both Statement-I and Statement-II are true.",
        optionId: isTarget ? matchOption(question, "C") ?? "C" : undefined,
        note: `Statement-I: 1/4 revolution = 360°/4 = 90° (Right angle). Statement-II: Turning North to South-West clockwise = 225° = 5/8 revolution. Both are TRUE. (Option C).`,
      };
    },
  });

  return (
    <PlayShell
      title="Navigation Compass Tower"
      mission="Audit the angular rotation statements on the 3D navigational compass bezel."
      icon={Compass}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Compass Verification" value="Both Statements TRUE" />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl space-y-4">
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                Statement-I: One-fourth of a revolution is a right angle
              </span>
              <span className="text-[11px] text-slate-300">
                1/4 × 360° = 90° (Right angle)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/50 px-2.5 py-1 rounded">
              VERIFIED TRUE
            </span>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                Statement-II: Turning clockwise from North to South-West is 5/8 revolution
              </span>
              <span className="text-[11px] text-slate-300">
                North(0°) → East(90°) → South(180°) → SW(225°). 225° / 360° = 5/8.
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/50 px-2.5 py-1 rounded">
              VERIFIED TRUE
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — ⚛️ Triple Calculation Reactor
   (P) 57.295 + 108.280 − 33.912 = 131.663
   (Q) 50 + 5 + 5/10 + 5/100 = 55.55
   (R) ₹12.50 + ₹5.75 + ₹8.38 = ₹26.63
   Answer: C (P: 131.663, Q: 55.55, R: ₹26.63)
   ══════════════════════════════════════════════════════════════════════ */
interface Q48World {
  p_val: number;
  q_val: number;
  r_val: number;
}

export function B48TripleCalculationReactorActivity({
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
    initial: { p_val: 131.663, q_val: 55.55, r_val: 26.63 },
    derive: (w) => {
      const isTarget = w.p_val === 131.663 && w.q_val === 55.55 && w.r_val === 26.63;
      return {
        value: `(P) 131.663, (Q) 55.55, (R) ₹26.63`,
        optionId: isTarget ? matchOption(question, "C") ?? "C" : undefined,
        note: `(P) = 57.295 + 108.280 − 33.912 = 131.663. (Q) = 50 + 5 + 0.5 + 0.05 = 55.55. (R) = 12.50 + 5.75 + 8.38 = ₹26.63. (Option C).`,
      };
    },
  });

  return (
    <PlayShell
      title="Triple Calculation Reactor"
      mission="Operate the three independent mathematical reactor chambers to verify outputs for (P), (Q), and (R)."
      icon={Atom}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Reactor Core" value="P: 131.663 | Q: 55.55 | R: ₹26.63" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-sky-500/40 p-4 rounded-2xl text-white text-center">
            <span className="text-xs font-bold text-sky-400 block mb-1">Chamber (P)</span>
            <span className="text-[10px] text-slate-400 block mb-2">57.295 + 108.280 − 33.912</span>
            <span className="text-2xl font-mono font-black text-sky-300">131.663</span>
          </div>

          <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-2xl text-white text-center">
            <span className="text-xs font-bold text-amber-400 block mb-1">Chamber (Q)</span>
            <span className="text-[10px] text-slate-400 block mb-2">50 + 5 + 5/10 + 5/100</span>
            <span className="text-2xl font-mono font-black text-amber-300">55.55</span>
          </div>

          <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-2xl text-white text-center">
            <span className="text-xs font-bold text-emerald-400 block mb-1">Chamber (R)</span>
            <span className="text-[10px] text-slate-400 block mb-2">₹12.50 + ₹5.75 + ₹8.38</span>
            <span className="text-2xl font-mono font-black text-emerald-300">₹26.63</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — 👷 Construction Engineer Challenge
   (a) Path outside 12m×8m of width 0.5m -> Outer: 13×9 = 117 m², Inner = 96 m² -> Area = 21 m²
   (b) Wire 68cm into square -> Side = 68/4 = 17cm -> Area = 17×17 = 289 cm²
   Answer: D ((a) 21 m², (b) 289 cm²)
   ══════════════════════════════════════════════════════════════════════ */
interface Q49World {
  pathArea: number;
  squareArea: number;
}

export function B49ConstructionEngineerActivity({
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
    initial: { pathArea: 21, squareArea: 289 },
    derive: (w) => {
      const isTarget = w.pathArea === 21 && w.squareArea === 289;
      return {
        value: `(a) 21 m², (b) 289 cm²`,
        optionId: isTarget ? matchOption(question, "D") ?? "D" : undefined,
        note: `(a) Path Area = (12 + 2×0.5) × (8 + 2×0.5) − (12 × 8) = 13 × 9 − 96 = 117 − 96 = 21 m². (b) Wire Square side = 68/4 = 17 cm, Area = 17 × 17 = 289 cm². (Option D: 21 m², 289 cm²).`,
      };
    },
  });

  return (
    <PlayShell
      title="Construction Engineer Challenge"
      mission="Solve the dual construction engineering problems: boundary path expansion and square wire bending."
      icon={HardHat}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Dual Solutions" value="(a) 21 m² | (b) 289 cm²" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Part A: Path */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2">
              (a) Outside Path (50cm Border)
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 bg-slate-800/60 rounded">
                <span>Outer Dimensions</span>
                <span className="text-sky-300">13 m × 9 m = 117 m²</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-800/60 rounded">
                <span>Field Area</span>
                <span className="text-slate-400">12 m × 8 m = 96 m²</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-950 border border-sky-500/40 rounded font-bold">
                <span className="text-sky-300">Path Area</span>
                <span className="text-emerald-400">117 − 96 = 21 m²</span>
              </div>
            </div>
          </div>

          {/* Part B: Square Wire */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              (b) Bent Wire Square (68cm)
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 bg-slate-800/60 rounded">
                <span>Perimeter</span>
                <span className="text-amber-300">68 cm</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-800/60 rounded">
                <span>Side Length</span>
                <span className="text-slate-400">68 / 4 = 17 cm</span>
              </div>
              <div className="flex justify-between p-2 bg-amber-950 border border-amber-500/40 rounded font-bold">
                <span className="text-amber-300">Square Area</span>
                <span className="text-emerald-400">17 × 17 = 289 cm²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — 📊 Retail Analytics City
   Pictograph (1 laptop icon = 4 laptops):
   P = 16, Q = 12, R = 18, S = 22, T = 14. Total = 76.
   (i) S − Q = 22 − 12 = 10 laptops
   (ii) (P + R) / Total = (16 + 18) / 76 = 34 / 76 = 17 / 38
   Answer: B ((i) 10, (ii) 17/38)
   ══════════════════════════════════════════════════════════════════════ */
interface Q50World {
  diff_S_Q: number;
  fraction_PR: string;
}

export function B50RetailAnalyticsCityActivity({
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
    initial: { diff_S_Q: 10, fraction_PR: "17/38" },
    derive: (w) => {
      const isTarget = w.diff_S_Q === 10 && w.fraction_PR === "17/38";
      return {
        value: `(i) 10, (ii) 17/38`,
        optionId: isTarget ? matchOption(question, "B") ?? "B" : undefined,
        note: `(i) Shop S (22) − Shop Q (12) = 10 laptops. (ii) (Shop P + Shop R) / Total = (16 + 18) / 76 = 34 / 76 = 17/38. (Option B: (i) 10, (ii) 17/38).`,
      };
    },
  });

  return (
    <PlayShell
      title="Retail Analytics City"
      mission="Analyze the 5 shop laptop inventory stacks (1 icon = 4 laptops) to calculate S − Q and the combined ratio of P & R."
      icon={ShoppingBag}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Analytics Output" value="(i) 10 | (ii) 17/38" />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Shop Inventories */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 text-center">
            {[
              { shop: "P", count: 16, icons: "4.0" },
              { shop: "Q", count: 12, icons: "3.0" },
              { shop: "R", count: 18, icons: "4.5" },
              { shop: "S", count: 22, icons: "5.5" },
              { shop: "T", count: 14, icons: "3.5" },
            ].map((s) => (
              <div key={s.shop} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-sky-400 block">Shop {s.shop}</span>
                <span className="text-lg font-mono font-bold text-white">{s.count}</span>
                <span className="text-[10px] text-slate-400 block">({s.icons} icons)</span>
              </div>
            ))}
          </div>

          {/* Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-center">
              <span className="text-xs font-bold text-indigo-300 block mb-1">
                (i) Shop S − Shop Q
              </span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                22 − 12 = 10 Laptops
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-center">
              <span className="text-xs font-bold text-indigo-300 block mb-1">
                (ii) (P + R) / Total
              </span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                (16 + 18) / 76 = 34 / 76 = 17 / 38
              </span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

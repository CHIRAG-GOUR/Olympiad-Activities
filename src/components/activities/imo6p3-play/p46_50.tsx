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
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — 🧠 Geometry Control Room
   ══════════════════════════════════════════════════════════════════════ */
interface Q46World {
  p: string;
  q: string;
  r: string;
  s: string;
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
    initial: {
      p: "Parallel",
      q: "3",
      r: "Diameter",
      s: "54°",
    },
    derive: (w) => {
      return {
        value: "Option D (P: Parallel, Q: 3, R: Diameter, S: 54°)",
        optionId: matchText(question, "D") ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Geometry Control Room"
      mission="Solve all four geometry stations (Parallel, Polygon, Chord, Angle) to generate the master classification."
      icon={Cpu}
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
          <Gauge label="P (Lines)" value={world.p} />
          <Gauge label="Q (Min Lines)" value={world.q} />
          <Gauge label="R (Centre Chord)" value={world.r} />
          <Gauge label="S (3/5 of 90°)" value={world.s} />
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block">Station P</span>
            <span className="font-bold text-xs text-indigo-900">{world.p} Lines</span>
          </div>
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block">Station Q</span>
            <span className="font-bold text-xs text-indigo-900">{world.q} Lines</span>
          </div>
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block">Station R</span>
            <span className="font-bold text-xs text-indigo-900">{world.r}</span>
          </div>
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block">Station S</span>
            <span className="font-bold text-xs text-indigo-900">{world.s}</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — 📈 Toy Store Analytics
   ══════════════════════════════════════════════════════════════════════ */
interface Q47World {
  derivedRatio: string;
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
    initial: { derivedRatio: "Option A" },
    derive: (w) => {
      return {
        value: "Option A",
        optionId: matchText(question, "A") ?? "A",
      };
    },
  });

  return (
    <PlayShell
      title="Toy Store Analytics"
      mission="Read monthly toy sales from the line graph and calculate the simplified ratio."
      icon={TrendingUp}
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
          <svg viewBox="0 0 280 140" className="w-full max-w-sm h-36 bg-white/60 rounded-lg border border-slate-200">
            <polyline
              points="30,110 80,80 130,40 180,60 230,20"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            {[
              { x: 30, y: 110, m: "Apr" },
              { x: 80, y: 80, m: "May" },
              { x: 130, y: 40, m: "Jun" },
              { x: 180, y: 60, m: "Jul" },
              { x: 230, y: 20, m: "Aug" },
            ].map((pt) => (
              <g key={pt.m}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="#facc15" />
                <text x={pt.x} y={130} fill="#94a3b8" fontSize="9" textAnchor="middle">
                  {pt.m}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — 🔬 Mathematics Truth Laboratory
   ══════════════════════════════════════════════════════════════════════ */
interface Q48World {
  pattern: string;
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
    initial: { pattern: "T, F, F, T" },
    derive: (w) => {
      return {
        value: "Option A (P: T, Q: F, R: F, S: T)",
        optionId: matchText(question, "A") ?? "A",
      };
    },
  });

  return (
    <PlayShell
      title="Mathematics Truth Laboratory"
      mission="Audit the truth value of four advanced mathematical statements to derive the T/F combination."
      icon={FlaskConical}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Truth Sequence" value="T, F, F, T" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
            <span className="text-[10px] text-slate-500 block">Statement P</span>
            <span className="font-mono text-xl font-black text-emerald-700">T</span>
          </div>
          <div className="p-2 bg-rose-50 border border-rose-300 rounded-xl">
            <span className="text-[10px] text-slate-500 block">Statement Q</span>
            <span className="font-mono text-xl font-black text-rose-700">F</span>
          </div>
          <div className="p-2 bg-rose-50 border border-rose-300 rounded-xl">
            <span className="text-[10px] text-slate-500 block">Statement R</span>
            <span className="font-mono text-xl font-black text-rose-700">F</span>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
            <span className="text-[10px] text-slate-500 block">Statement S</span>
            <span className="font-mono text-xl font-black text-emerald-700">T</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — 🔐 Divisibility Security Lab
   ══════════════════════════════════════════════════════════════════════ */
interface Q49World {
  statement1: boolean;
  statement2: boolean;
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
    initial: { statement1: true, statement2: true },
    derive: (w) => {
      return {
        value: "Option C (Both Statement I and II are true)",
        optionId: matchText(question, "C") ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Divisibility Security Lab"
      mission="Verify divisibility by 8 for general numbers and validate 987,648 via its last 3 digits (648)."
      icon={ShieldCheck}
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
          <Gauge label="Statement I" value="True (Divisibility Rule)" />
          <Gauge label="Statement II" value="True (648 ÷ 8 = 81)" />
        </>
      }
    >
      <div className="space-y-4">
        <Bay label="Divisibility Audit Chambers">
          <div className="space-y-2">
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-mono">
              <span>Statement I: Divisibility-by-8 rule for last 3 digits</span>
              <span className="font-bold text-emerald-800">TRUE ✓</span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-mono">
              <span>Statement II: 987,648 → Last 3 digits 648 ÷ 8 = 81</span>
              <span className="font-bold text-emerald-800">TRUE ✓</span>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — 🏆 Olympiad Master Control Room
   ══════════════════════════════════════════════════════════════════════ */
interface Q50World {
  pVal: number;
  qVal: number;
  rVal: number;
  sVal: number;
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
    initial: {
      pVal: 0,
      qVal: 81,
      rVal: 6,
      sVal: 56,
    },
    derive: (w) => {
      return {
        value: "Option D (P→0, Q→81, R→6, S→56 cm)",
        optionId: matchText(question, "D") ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Olympiad Master Control Room"
      mission="Operate all 4 master stations (P, Q, R, S) to solve the multi-concept grand finale."
      icon={Trophy}
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
          <Gauge label="Station P" value="0" />
          <Gauge label="Station Q" value="81" />
          <Gauge label="Station R" value="6" />
          <Gauge label="Station S" value="56 cm" />
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-gradient-to-br from-violet-50 to-indigo-50 text-slate-800 rounded-xl border-2 border-indigo-300 text-center">
            <span className="text-[10px] font-mono text-indigo-600 block">Station P</span>
            <span className="font-mono text-2xl font-black text-amber-600 my-1 block">0</span>
            <span className="text-[9px] text-slate-500 block">&gt; all negative ints</span>
          </div>

          <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 text-slate-800 rounded-xl border-2 border-emerald-300 text-center">
            <span className="text-[10px] font-mono text-emerald-600 block">Station Q</span>
            <span className="font-mono text-2xl font-black text-amber-600 my-1 block">81</span>
            <span className="text-[9px] text-slate-500 block">Integer sequence</span>
          </div>

          <div className="p-3 bg-gradient-to-br from-rose-50 to-pink-50 text-slate-800 rounded-xl border-2 border-rose-300 text-center">
            <span className="text-[10px] font-mono text-rose-600 block">Station R</span>
            <span className="font-mono text-2xl font-black text-amber-600 my-1 block">6</span>
            <span className="text-[9px] text-slate-500 block">Divisible by 22</span>
          </div>

          <div className="p-3 bg-gradient-to-br from-cyan-50 to-sky-50 text-slate-800 rounded-xl border-2 border-cyan-300 text-center">
            <span className="text-[10px] font-mono text-cyan-600 block">Station S</span>
            <span className="font-mono text-2xl font-black text-amber-600 my-1 block">56 cm</span>
            <span className="text-[9px] text-slate-500 block">Total wire length</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Fence,
  Briefcase,
  GlassWater,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — 🏏 Cricket Bat Shopping
   ══════════════════════════════════════════════════════════════════════ */
interface Q36World {
  savings: number;
}

export function Q36CricketBatShoppingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q36World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { savings: 1080 },
    derive: (w) => {
      return {
        value: `₹${w.savings} Savings`,
        optionId: matchNumber(question, w.savings) ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Sports Store Checkout"
      mission="Calculate the total cost of 16 bats from Shop A and Shop B to determine the savings."
      icon={ShoppingBag}
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
          <Gauge label="Shop A (16 bats)" value="₹5,120" />
          <Gauge label="Shop B (16 bats)" value="₹6,200" />
          <Gauge label="Net Savings" value="₹1,080" />
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center">
            <span className="text-xs font-bold text-emerald-800">Shop A (Best Price)</span>
            <div className="font-mono text-lg font-black text-emerald-950 mt-1">₹5,120</div>
            <span className="text-[10px] text-slate-500">2 packs of 8 bats @ ₹2560</span>
          </div>

          <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-center">
            <span className="text-xs font-bold text-slate-700">Shop B</span>
            <div className="font-mono text-lg font-black text-slate-900 mt-1">₹6,200</div>
            <span className="text-[10px] text-slate-500">4 packs of 4 bats @ ₹1550</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — 🏞️ Land Fencing
   ══════════════════════════════════════════════════════════════════════ */
interface Q37World {
  totalWireLength: number;
}

export function Q37LandFencingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q37World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { totalWireLength: 56 },
    derive: (w) => {
      return {
        value: `${w.totalWireLength} cm (or m)`,
        optionId: matchNumber(question, w.totalWireLength) ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Fencing Robot"
      mission="Trace 4 complete rows of wire around the 4.5 cm × 2.5 cm rectangular boundary."
      icon={Fence}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Total Wire Length" value={`${world.totalWireLength} cm`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-4 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox="0 0 240 140" className="w-60 h-36 bg-white/60 rounded-lg border border-slate-200">
            <rect x="40" y="30" width="160" height="80" fill="#14532d" stroke="#22c55e" strokeWidth="3" />
            <text x="120" y="22" fill="#86efac" fontSize="11" fontWeight="bold" textAnchor="middle">
              4.5 cm
            </text>
            <text x="215" y="75" fill="#86efac" fontSize="11" fontWeight="bold" textAnchor="start">
              2.5 cm
            </text>
          </svg>
          <span className="text-xs font-mono text-slate-500 mt-2">
            Perimeter = 2 × (4.5 + 2.5) = 14 cm × 4 rows = 56 cm
          </span>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — 💼 Working Hours
   ══════════════════════════════════════════════════════════════════════ */
interface Q38World {
  totalHours: number;
}

export function Q38WorkingHoursActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q38World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { totalHours: 175 },
    derive: (w) => {
      return {
        value: `${w.totalHours} hours`,
        optionId: matchNumber(question, w.totalHours) ?? "A",
      };
    },
  });

  return (
    <PlayShell
      title="Work-Time Payroll"
      mission="Allocate regular and overtime working hours to reach exactly ₹432 in 4 weeks."
      icon={Briefcase}
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
          <Gauge label="Regular Hours" value="160 hrs" />
          <Gauge label="Overtime Hours" value="15 hrs" />
          <Gauge label="Total Hours" value={`${world.totalHours} hrs`} />
        </>
      }
    >
      <div className="space-y-4">
        <Bay label="Payroll Calculation Summary">
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs font-mono">
              <span>Regular Pay: 160 hrs × ₹2.40/hr</span>
              <span className="font-bold">₹384.00</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs font-mono">
              <span>Overtime Pay: 15 hrs × ₹3.20/hr</span>
              <span className="font-bold">₹48.00</span>
            </div>
            <div className="flex justify-between p-2 bg-emerald-50 rounded-lg text-xs font-mono text-emerald-900 border border-emerald-300 font-bold">
              <span>Total Earnings (175 Hours)</span>
              <span>₹432.00</span>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — 🥤 Mocktail Mixer
   ══════════════════════════════════════════════════════════════════════ */
interface Q39World {
  totalLitresMixed: string;
}

export function Q39MocktailMixerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q39World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { totalLitresMixed: "5 5/6" },
    derive: (w) => {
      return {
        value: `${w.totalLitresMixed} L`,
        optionId: matchText(question, "D") ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Mocktail Laboratory"
      mission="Pour soda, lime syrup, and water into the central vessel to compute the total mixed volume."
      icon={GlassWater}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Combined Volume" value={`${world.totalLitresMixed} L`} />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
            <span className="text-[10px] text-slate-500 block">Soda</span>
            <span className="font-mono text-sm font-bold text-indigo-700">2 ⅓ L</span>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="text-[10px] text-slate-500 block">Lime Syrup</span>
            <span className="font-mono text-sm font-bold text-emerald-700">1 ⅔ L</span>
          </div>
          <div className="p-2 bg-cyan-50 border border-cyan-200 rounded-lg">
            <span className="text-[10px] text-slate-500 block">Water</span>
            <span className="font-mono text-sm font-bold text-cyan-700">1 ⅚ L</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — 🏘️ Village Population
   ══════════════════════════════════════════════════════════════════════ */
interface Q40World {
  finalPopulation: number;
}

export function Q40VillagePopulationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q40World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { finalPopulation: 100323 },
    derive: (w) => {
      return {
        value: `${w.finalPopulation} Residents`,
        optionId: matchNumber(question, w.finalPopulation) ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Village Population Simulator"
      mission="Simulate arrivals and departures to calculate the village population for January 2017."
      icon={Building2}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Jan 2017 Population" value="100,323" />}
    >
      <div className="space-y-4">
        <Bay label="Population Migration Dynamics">
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Initial (Jan 2016)</span>
              <span>105,250</span>
            </div>
            <div className="flex justify-between p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <span>New Residents Added (+)</span>
              <span>+4,315</span>
            </div>
            <div className="flex justify-between p-2 bg-rose-50 text-rose-800 rounded-lg">
              <span>Residents Departed (−)</span>
              <span>−9,242</span>
            </div>
            <div className="flex justify-between p-2 bg-indigo-50 font-bold text-indigo-900 border border-indigo-300 rounded-lg">
              <span>Net Population (Jan 2017)</span>
              <span>100,323</span>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PersonStanding,
  Users,
  UtensilsCrossed,
  Flag,
  Tractor,
  Sparkles,
  CheckCircle2,
  Footprints,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — 🏃 Park Runner (5 rounds of 123m × 65m = 1880 m)
   Breadth = 65 m, Length = 2(65) − 7 = 123 m
   Perimeter = 2(123 + 65) = 376 m
   5 rounds = 5 × 376 = 1880 m
   Answer: C (1880 m)
   ══════════════════════════════════════════════════════════════════════ */
interface Q36World {
  laps: number;
  breadth: number;
  length: number;
}

export function B36ParkRunnerActivity({
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
    initial: { laps: 5, breadth: 65, length: 123 },
    derive: (w) => {
      const perimeter = 2 * (w.length + w.breadth); // 376
      const totalDist = w.laps * perimeter; // 1880
      const isTarget = w.laps === 5 && w.length === 123 && w.breadth === 65;
      return {
        value: `${totalDist} m`,
        optionId: isTarget && totalDist === 1880 ? matchOption(question, "C") ?? "C" : undefined,
        note: `Length = 2(65) − 7 = 123 m. Perimeter = 2(123 + 65) = 376 m. 5 rounds = 5 × 376 = 1880 m. (Option C: 1880 m).`,
      };
    },
  });

  const perimeter = 2 * (world.length + world.breadth);
  const totalDist = world.laps * perimeter;

  return (
    <PlayShell
      title="Park Runner"
      mission="Simulate 5 rounds around the rectangular park (Breadth 65m, Length 123m) to calculate Arpita's total running distance."
      icon={Footprints}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Total Distance Run" value={`${totalDist} m (5 Laps)`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-around gap-6">
          {/* 3D Park Track Simulation */}
          <div className="relative p-6 bg-slate-950 rounded-xl border border-slate-800">
            <svg width="220" height="150" viewBox="0 0 220 150">
              {/* Park Grass */}
              <rect x="20" y="20" width="180" height="110" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
              {/* Running Track Path */}
              <rect x="30" y="30" width="160" height="90" rx="6" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3" />

              <text x="110" y="15" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">
                Length = 2(65) − 7 = 123 m
              </text>
              <text x="215" y="80" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="start">
                65 m
              </text>
            </svg>
          </div>

          {/* Odometer Metrics */}
          <div className="space-y-3 w-full md:w-64">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">1 Lap Perimeter</span>
              <span className="font-mono font-bold text-sky-400">
                2 × (123 + 65) = 376 m
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Number of Rounds</span>
              <span className="font-mono font-bold text-amber-400">5 Complete Rounds</span>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-300 block uppercase">Total Distance</span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                5 × 376 = 1880 m
              </span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — 👥 Classroom Grouping Simulator (LCM(2,3,5,6) = 30)
   Answer: B (30)
   ══════════════════════════════════════════════════════════════════════ */
interface Q37World {
  studentCount: number;
}

export function B37ClassroomGroupingActivity({
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
    initial: { studentCount: 30 },
    derive: (w) => {
      const isDivisible =
        w.studentCount % 2 === 0 &&
        w.studentCount % 3 === 0 &&
        w.studentCount % 5 === 0 &&
        w.studentCount % 6 === 0;
      return {
        value: `${w.studentCount}`,
        optionId: isDivisible && w.studentCount === 30 ? matchOption(question, "B") ?? "B" : undefined,
        note: `Least common multiple LCM(2, 3, 5, 6) = 30. 30 students can be divided into groups of 2, 3, 5, and 6 with 0 remainder. (Option B: 30).`,
      };
    },
  });

  return (
    <PlayShell
      title="Classroom Grouping Simulator"
      mission="Find the minimum student count that divides evenly into pods of 2, 3, 5, and 6."
      icon={Users}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Classroom Size (LCM)" value={`${world.studentCount} Students`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { size: 2, groups: 15 },
              { size: 3, groups: 10 },
              { size: 5, groups: 6 },
              { size: 6, groups: 5 },
            ].map((pod, idx) => (
              <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/30 text-center">
                <span className="text-[10px] text-indigo-400 block uppercase font-bold">
                  Groups of {pod.size}
                </span>
                <span className="text-lg font-mono font-bold text-white">
                  {pod.groups} Pods
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">Remainder: 0</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">LCM Calculation Matrix</span>
            <span className="text-xl font-mono font-bold text-emerald-400">
              LCM(2, 3, 5, 6) = 2 × 3 × 5 = 30
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — 🍳 Breakfast Shop (5.50 : 12.00 = 11 : 24)
   5 eggs = ₹27.50 -> 1 egg = ₹5.50
   5 omelettes = ₹60 -> 1 omelette = ₹12.00
   Ratio = 5.50 / 12 = 55 / 120 = 11 : 24
   Answer: D (11:24)
   ══════════════════════════════════════════════════════════════════════ */
interface Q38World {
  eggUnitPrice: number;
  omeletteUnitPrice: number;
}

export function B38BreakfastShopRatioActivity({
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
    initial: { eggUnitPrice: 5.5, omeletteUnitPrice: 12.0 },
    derive: (w) => {
      const isTarget = w.eggUnitPrice === 5.5 && w.omeletteUnitPrice === 12.0;
      return {
        value: "11:24",
        optionId: isTarget ? matchOption(question, "D") ?? "D" : undefined,
        note: `Cost of 1 egg = 27.50 / 5 = ₹5.50. Cost of 1 omelette = 60 / 5 = ₹12.00. Ratio = 5.50 : 12 = 55 : 120 = 11 : 24. (Option D: 11:24).`,
      };
    },
  });

  return (
    <PlayShell
      title="Breakfast Shop"
      mission="Calculate unit prices of 1 egg and 1 omelette to simplify the breakfast cost ratio."
      icon={UtensilsCrossed}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Unit Cost Ratio" value="11 : 24" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              🥚 Egg Unit Price
            </span>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">5 eggs = ₹27.50</span>
              <span className="text-xl font-mono font-bold text-amber-400">
                1 egg = ₹27.50 / 5 = ₹5.50
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">
              🍳 Omelette Unit Price
            </span>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">5 omelettes = ₹60.00</span>
              <span className="text-xl font-mono font-bold text-rose-400">
                1 omelette = ₹60 / 5 = ₹12.00
              </span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-950/60 border border-indigo-500/40 p-4 rounded-xl text-center text-white">
          <span className="text-xs text-indigo-300 uppercase tracking-wider block mb-1">
            Simplified Unit Ratio
          </span>
          <span className="text-2xl font-mono font-black text-emerald-400">
            5.50 : 12.00 = 55 : 120 = 11 : 24
          </span>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — 🏁 Race Track Simulator (1 3/5 − 1 1/2 = 1/10 km)
   8/5 − 3/2 = (16 − 15)/10 = 1/10 km
   Answer: A (1/10 km)
   ══════════════════════════════════════════════════════════════════════ */
interface Q39World {
  totalKm: number; // 1.6
  ranKm: number; // 1.5
}

export function B39RaceTrackSimulatorActivity({
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
    initial: { totalKm: 1.6, ranKm: 1.5 },
    derive: (w) => {
      const remaining = +(w.totalKm - w.ranKm).toFixed(2);
      return {
        value: "1/10 km",
        optionId: remaining === 0.1 ? matchOption(question, "A") ?? "A" : undefined,
        note: `Total race = 1 3/5 km = 8/5 km. Distance run = 1 1/2 km = 3/2 km. Remaining = 8/5 − 3/2 = (16 − 15)/10 = 1/10 km. (Option A: 1/10 km).`,
      };
    },
  });

  return (
    <PlayShell
      title="Race Track Simulator"
      mission="Simulate Rohit's race (1 3/5 km total, 1 1/2 km completed) to measure the remaining segment."
      icon={Flag}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Remaining Distance" value="1/10 km (0.1 km)" />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Track Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2 font-mono">
              <span className="text-emerald-400">Completed: 1½ km (3/2 km)</span>
              <span className="text-rose-400 font-bold">Remaining: 1/10 km</span>
            </div>
            <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden p-1 flex border border-slate-700">
              <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: "93.75%" }} />
              <div className="h-full bg-rose-500 rounded-r-full animate-pulse" style={{ width: "6.25%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0 km</span>
              <span>Total: 1⅗ km (8/5 km)</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono">
            <span className="text-xs text-slate-400 block mb-1">Fraction Subtraction Engine</span>
            <span className="text-lg text-emerald-400 font-bold">
              8/5 − 3/2 = (16 − 15) / 10 = 1/10 km
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — 🚜 Farm Builder (Area = 612 / 17 = 36 m² -> Side = 6 m)
   Answer: C (6 m)
   ══════════════════════════════════════════════════════════════════════ */
interface Q40World {
  totalCost: number;
  ratePerM2: number;
}

export function B40FarmBuilderActivity({
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
    initial: { totalCost: 612, ratePerM2: 17 },
    derive: (w) => {
      const area = w.totalCost / w.ratePerM2; // 36
      const side = Math.sqrt(area); // 6
      const isTarget = area === 36 && side === 6;
      return {
        value: `${side} m`,
        optionId: isTarget ? matchOption(question, "C") ?? "C" : undefined,
        note: `Area of square field = Total cost / Rate = ₹612 / ₹17 = 36 m². Side of square field = √36 = 6 m. (Option C: 6 m).`,
      };
    },
  });

  const area = world.totalCost / world.ratePerM2;
  const side = Math.sqrt(area);

  return (
    <PlayShell
      title="Farm Builder"
      mission="Calculate the area and side length of the square cultivation field from total cost ₹612 at ₹17 per m²."
      icon={Tractor}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Square Side Length" value={`${side} m`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-around gap-6">
          {/* 3D Square Farm Plot */}
          <div className="relative p-6 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center">
            <div className="w-40 h-40 bg-emerald-900/30 border-4 border-emerald-500 rounded-lg flex flex-col items-center justify-center relative">
              <span className="text-xs text-emerald-300 font-bold uppercase">Area = 36 m²</span>
              <span className="text-[10px] text-slate-400">Side × Side</span>
              <span className="absolute -top-5 font-mono text-xs font-bold text-amber-400">6 m</span>
              <span className="absolute -left-7 font-mono text-xs font-bold text-amber-400">6 m</span>
            </div>
          </div>

          {/* Derivation breakdown */}
          <div className="space-y-3 w-full md:w-64">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Field Area</span>
              <span className="font-mono font-bold text-sky-400">
                ₹612 / ₹17 = 36 m²
              </span>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-300 block uppercase">Square Side</span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                √36 = 6 m
              </span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

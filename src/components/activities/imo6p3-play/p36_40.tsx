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
  Sparkles,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — 🏏 Cricket Bat Shopping (Unit Price & Savings)
   ══════════════════════════════════════════════════════════════════════ */
interface Q36World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const sav = w.chosenOption === "A" ? "₹980" : w.chosenOption === "B" ? "₹1080" : w.chosenOption === "C" ? "₹1120" : "₹1240";

      return {
        value: `${sav} Savings (Shop B ₹6,200 − Shop A ₹5,120)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, sav) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 16 bats from Shop A: 2 packs × ₹2560 = ₹5120. From Shop B: 4 packs × ₹1550 = ₹6200. Savings = ₹6200 − ₹5120 = ₹1080."
          : `Selected ${sav}. Cost A = 2 × ₹2560 = ₹5120; Cost B = 4 × ₹1550 = ₹6200.`,
      };
    },
  });

  return (
    <PlayShell
      title="Sports Store Checkout"
      mission="Compare purchase totals for 16 bats from Shop A versus Shop B to calculate the coach's savings."
      icon={ShoppingBag}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Coach's Savings" value={world.chosenOption === "B" ? "₹1,080 (Option B)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Dual Store Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase">Shop A (Bulk Pack)</span>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Best Deal ✓</span>
            </div>
            <div className="font-mono text-2xl font-black text-emerald-950 my-1">₹5,120</div>
            <span className="text-xs text-emerald-800 font-medium">
              2 packs of 8 bats @ ₹2,560 each (16 bats)
            </span>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-slate-700 uppercase">Shop B (Standard Pack)</span>
            <div className="font-mono text-2xl font-black text-slate-900 my-1">₹6,200</div>
            <span className="text-xs text-slate-600 font-medium">
              4 packs of 4 bats @ ₹1,550 each (16 bats)
            </span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Total Savings (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, sav: "₹980", isCorrect: false },
              { id: "B" as const, sav: "₹1080", desc: "₹6200 − ₹5120 = ₹1080 (Correct)", isCorrect: true },
              { id: "C" as const, sav: "₹1120", isCorrect: false },
              { id: "D" as const, sav: "₹1240", isCorrect: false },
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
                  <span className="text-2xl font-black text-slate-800 my-1">{opt.sav}</span>
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
   Q37 — 🏞️ Land Fencing (Rectangular Boundary Wire)
   ══════════════════════════════════════════════════════════════════════ */
interface Q37World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const len = w.chosenOption === "A" ? "28 metres" : w.chosenOption === "B" ? "56 metres" : w.chosenOption === "C" ? "42 metres" : "70 metres";

      return {
        value: `${len} Wire (4 rounds × 14 m perimeter)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, len) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Perimeter of field = 2 × (4.5 + 2.5) = 2 × 7 = 14 metres. 4 rounds of fencing = 4 × 14 = 56 metres."
          : `Selected ${len}. Total wire = 4 × Perimeter = 4 × [2 × (length + breadth)].`,
      };
    },
  });

  return (
    <PlayShell
      title="Fencing Robot"
      mission="Calculate the total wire needed for 4 rounds of fencing around a 4.5 m × 2.5 m playground."
      icon={Fence}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Total Wire Length" value={world.chosenOption === "B" ? "56 metres (Option B)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Field Diagram Canvas */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 280 150" className="w-full max-w-sm h-36 bg-white rounded-lg border-2 border-emerald-300 shadow-inner">
            <rect x="40" y="30" width="200" height="90" fill="#dcfce7" stroke="#16a34a" strokeWidth="3" rx="4" />
            <text x="140" y="22" fill="#166534" fontSize="11" fontWeight="bold" textAnchor="middle">
              Length = 4.5 m
            </text>
            <text x="250" y="80" fill="#166534" fontSize="11" fontWeight="bold" textAnchor="start">
              2.5 m
            </text>
            <text x="140" y="80" fill="#15803d" fontSize="12" fontWeight="black" textAnchor="middle">
              4 Rounds of Wire
            </text>
          </svg>
          <span className="text-xs font-mono text-emerald-900 font-bold mt-2">
            1 Round = 2 × (4.5 + 2.5) = 14 m &nbsp;|&nbsp; 4 Rounds = 4 × 14 = <b>56 metres</b>
          </span>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Total Length of Wire Required (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, len: "28 metres", desc: "2 rounds only", isCorrect: false },
              { id: "B" as const, len: "56 metres", desc: "4 × 14 = 56 m (Correct)", isCorrect: true },
              { id: "C" as const, len: "42 metres", desc: "3 rounds only", isCorrect: false },
              { id: "D" as const, len: "70 metres", desc: "5 rounds", isCorrect: false },
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
                      : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-xl font-black text-slate-800 my-1">{opt.len}</span>
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
   Q38 — 💼 Work-Time Payroll (Wage & Overtime)
   ══════════════════════════════════════════════════════════════════════ */
interface Q38World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "A" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const hrs = w.chosenOption === "A" ? "175 hours" : w.chosenOption === "B" ? "160 hours" : w.chosenOption === "C" ? "180 hours" : "190 hours";

      return {
        value: `${hrs} (160 Regular + 15 Overtime Hours)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, hrs) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Regular hours = 4 × 5 × 8 = 160 hrs @ ₹2.40 = ₹384. Overtime pay = ₹432 − ₹384 = ₹48. Overtime hours = ₹48 ÷ ₹3.20 = 15 hrs. Total hours = 160 + 15 = 175 hours."
          : `Selected ${hrs}. Total hours = Regular hours (160) + Overtime hours (15).`,
      };
    },
  });

  return (
    <PlayShell
      title="Work-Time Payroll"
      mission="Calculate the total hours worked across 4 weeks with regular rate ₹2.40/hr and overtime ₹3.20/hr."
      icon={Briefcase}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Total Hours" value={world.chosenOption === "A" ? "175 hours (Option A)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Payslip Breakdown Card */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Detailed Monthly Payroll Breakdown:</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
              <span>Regular Pay: 4 wks × 40 hrs = 160 hrs @ ₹2.40/hr</span>
              <span className="font-bold text-slate-800">₹384.00</span>
            </div>
            <div className="flex justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
              <span>Overtime Pay: ₹432 − ₹384 = ₹48 @ ₹3.20/hr</span>
              <span className="font-bold text-indigo-600">15 hrs (= ₹48.00)</span>
            </div>
            <div className="flex justify-between p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold rounded-lg">
              <span>Total Earnings = ₹432.00 &nbsp;|&nbsp; Total Hours = 160 + 15</span>
              <span>175 Hours</span>
            </div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Total Hours Worked (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, hrs: "175 hours", desc: "160 reg + 15 ot = 175 hrs (Correct)", isCorrect: true },
              { id: "B" as const, hrs: "160 hours", desc: "Regular hours only", isCorrect: false },
              { id: "C" as const, hrs: "180 hours", isCorrect: false },
              { id: "D" as const, hrs: "190 hours", isCorrect: false },
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
                  <span className="text-xl font-black text-slate-800 my-1">{opt.hrs}</span>
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
   Q39 — 🥤 Mocktail Laboratory (Fraction Capacity Addition)
   ══════════════════════════════════════════════════════════════════════ */
interface Q39World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const vol = w.chosenOption === "A" ? "4 ⅔ litres" : w.chosenOption === "B" ? "5 ⅓ litres" : w.chosenOption === "C" ? "6 litres" : "5 ⅚ litres";

      return {
        value: `${vol} (Total Mocktail Volume)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, vol) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 2 ⅓ + 1 ⅔ + 1 ⅚ = 7/3 + 5/3 + 11/6 = 14/6 + 10/6 + 11/6 = 35/6 = 5 ⅚ litres."
          : `Selected ${vol}. Convert mixed fractions to common denominator 6: (14 + 10 + 11)/6 = 35/6 = 5 ⅚ litres.`,
      };
    },
  });

  return (
    <PlayShell
      title="Mocktail Laboratory"
      mission="Calculate the total volume when mixing 2⅓ L soda, 1⅔ L lime syrup, and 1⅚ L sparkling water."
      icon={GlassWater}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Combined Volume" value={world.chosenOption === "D" ? "5 ⅚ litres (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Flasks Display */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs flex flex-col items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Soda</span>
            <span className="font-mono text-lg font-black text-indigo-700 my-1">2 ⅓ L</span>
            <span className="text-[10px] font-mono text-slate-500">= 14/6 L</span>
          </div>

          <div className="p-3 bg-white border-2 border-emerald-200 rounded-xl text-center shadow-xs flex flex-col items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Lime Syrup</span>
            <span className="font-mono text-lg font-black text-emerald-700 my-1">1 ⅔ L</span>
            <span className="text-[10px] font-mono text-slate-500">= 10/6 L</span>
          </div>

          <div className="p-3 bg-white border-2 border-cyan-200 rounded-xl text-center shadow-xs flex flex-col items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Water</span>
            <span className="font-mono text-lg font-black text-cyan-700 my-1">1 ⅚ L</span>
            <span className="text-[10px] font-mono text-slate-500">= 11/6 L</span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Total Volume of Mocktail (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, vol: "4 ⅔ litres", isCorrect: false },
              { id: "B" as const, vol: "5 ⅓ litres", isCorrect: false },
              { id: "C" as const, vol: "6 litres", isCorrect: false },
              { id: "D" as const, vol: "5 ⅚ litres", desc: "35/6 = 5 5/6 L (Correct)", isCorrect: true },
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
                  <span className="text-xl font-black text-slate-800 my-1">{opt.vol}</span>
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
   Q40 — 🏘️ Village Population Simulator (Annual Population Flow)
   ══════════════════════════════════════════════════════════════════════ */
interface Q40World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const pop = w.chosenOption === "A" ? "98,420" : w.chosenOption === "B" ? "101,250" : w.chosenOption === "C" ? "100,323" : "102,143";

      return {
        value: `${pop} Residents (Jan 2017 Population)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, pop) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Population = Initial (105,250) + Moved in (4,315) − Left (9,242) = 109,565 − 9,242 = 100,323."
          : `Selected ${pop}. Calculation: 105,250 + 4,315 − 9,242 = 100,323.`,
      };
    },
  });

  return (
    <PlayShell
      title="Village Population Simulator"
      mission="Calculate the town's population in January 2017 from initial count, arrivals, and departures."
      icon={Building2}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Jan 2017 Population" value={world.chosenOption === "C" ? "100,323 (Option C)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Population Dynamics Ledger */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Population Migration Ledger:</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 bg-white border border-slate-200 rounded-lg">
              <span>Base Population (Dec 2015)</span>
              <span className="font-bold text-slate-800">105,250</span>
            </div>
            <div className="flex justify-between p-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg font-bold">
              <span>+ People who moved in during 2016</span>
              <span>+4,315</span>
            </div>
            <div className="flex justify-between p-2 bg-rose-50 border border-rose-300 text-rose-900 rounded-lg font-bold">
              <span>− People who left during 2016</span>
              <span>−9,242</span>
            </div>
            <div className="flex justify-between p-2.5 bg-indigo-50 border-2 border-indigo-400 text-indigo-950 font-black rounded-lg text-sm">
              <span>Net Population in Jan 2017</span>
              <span>100,323</span>
            </div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Population in January 2017 (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, pop: "98,420", isCorrect: false },
              { id: "B" as const, pop: "101,250", isCorrect: false },
              { id: "C" as const, pop: "100,323", desc: "105,250 + 4,315 − 9,242 = 100,323 (Correct)", isCorrect: true },
              { id: "D" as const, pop: "102,143", isCorrect: false },
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
                  <span className="text-xl font-black text-slate-800 my-1">{opt.pop}</span>
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

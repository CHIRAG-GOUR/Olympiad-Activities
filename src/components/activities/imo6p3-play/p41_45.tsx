"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Footprints,
  Train,
  MapPin,
  Milk,
  Truck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — 🏃 Marching Synchronizer (Step Lengths & LCM)
   ══════════════════════════════════════════════════════════════════════ */
interface Q41World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q41StepSynchronizationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q41World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "A" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const dist = w.chosenOption === "A" ? "6930 cm" : w.chosenOption === "B" ? "6300 cm" : w.chosenOption === "C" ? "7700 cm" : "5400 cm";

      return {
        value: `${dist} (LCM of 63, 70, 77)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, dist) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 63 = 7 × 9, 70 = 7 × 10, 77 = 7 × 11. LCM(63, 70, 77) = 7 × 9 × 10 × 11 = 6,930 cm."
          : `Selected ${dist}. Find the Lowest Common Multiple (LCM) of 63, 70, and 77 cm.`,
      };
    },
  });

  return (
    <PlayShell
      title="Marching Synchronizer"
      mission="Calculate the minimum distance where three friends with step lengths 63 cm, 70 cm, and 77 cm complete whole steps."
      icon={Footprints}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Sync Distance" value={world.chosenOption === "A" ? "6,930 cm (Option A)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Prime Factorization LCM Workbench */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Step Synchronization Factorization:</div>
          <div className="grid grid-cols-3 gap-2 text-center my-2">
            <div className="p-2.5 bg-white border border-indigo-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 block">Friend 1 (63 cm)</span>
              <span className="font-mono text-sm font-black text-indigo-700">7 × 3²</span>
              <span className="text-[10px] text-slate-500 block">110 steps</span>
            </div>
            <div className="p-2.5 bg-white border border-indigo-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 block">Friend 2 (70 cm)</span>
              <span className="font-mono text-sm font-black text-indigo-700">7 × 2 × 5</span>
              <span className="text-[10px] text-slate-500 block">99 steps</span>
            </div>
            <div className="p-2.5 bg-white border border-indigo-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 block">Friend 3 (77 cm)</span>
              <span className="font-mono text-sm font-black text-indigo-700">7 × 11</span>
              <span className="text-[10px] text-slate-500 block">90 steps</span>
            </div>
          </div>
          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-center font-mono text-xs font-bold text-emerald-900">
            LCM = 7 × 9 × 10 × 11 = <b>6,930 cm</b> (69 m 30 cm)
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Minimum Distance (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, dist: "6930 cm", desc: "LCM(63, 70, 77) (Correct)", isCorrect: true },
              { id: "B" as const, dist: "6300 cm", isCorrect: false },
              { id: "C" as const, dist: "7700 cm", isCorrect: false },
              { id: "D" as const, dist: "5400 cm", isCorrect: false },
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
                  <span className="text-xl font-black text-slate-800 my-1 font-mono">{opt.dist}</span>
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
   Q42 — 🚇 Metro Sustainability Dashboard (Fuel Savings Fraction)
   ══════════════════════════════════════════════════════════════════════ */
interface Q42World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q42MetroFuelSavingsActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q42World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const frac = w.chosenOption === "A" ? "71/110" : w.chosenOption === "B" ? "81/110" : w.chosenOption === "C" ? "9/11" : "23/33";

      return {
        value: `${frac} ((3300 + 21000) / 33000)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, frac) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Total diesel + petrol = 3,300 + 21,000 = 24,300 tonnes. Ratio to CNG = 24,300 ÷ 33,000 = 243/330 = 81/110 (dividing by 3)."
          : `Selected ${frac}. (3300 + 21000)/33000 = 24300/33000 = 81/110.`,
      };
    },
  });

  return (
    <PlayShell
      title="Metro Sustainability Dashboard"
      mission="Compute the fraction of (diesel + petrol saved) to CNG saved in simplest reduced form."
      icon={Train}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Simplest Fraction" value={world.chosenOption === "B" ? "81/110 (Option B)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Fuel Volume Tonnages */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white border-2 border-emerald-300 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">CNG Saved</span>
            <span className="font-mono text-lg font-black text-emerald-700 my-1 block">33,000 t</span>
            <span className="text-[10px] text-slate-500">Denominator</span>
          </div>

          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Diesel Saved</span>
            <span className="font-mono text-lg font-black text-indigo-700 my-1 block">3,300 t</span>
          </div>

          <div className="p-3 bg-white border-2 border-indigo-200 rounded-xl text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Petrol Saved</span>
            <span className="font-mono text-lg font-black text-indigo-700 my-1 block">21,000 t</span>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Fraction in Simplest Form (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, frac: "71/110", isCorrect: false },
              { id: "B" as const, frac: "81/110", desc: "24300 / 33000 = 81/110 (Correct)", isCorrect: true },
              { id: "C" as const, frac: "9/11", isCorrect: false },
              { id: "D" as const, frac: "23/33", isCorrect: false },
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
   Q43 — 🥾 Journey Tracker (Multi-Day Trek Distance)
   ══════════════════════════════════════════════════════════════════════ */
interface Q43World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q43JourneyTrackerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q43World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const dist = w.chosenOption === "A" ? "14.18 km" : w.chosenOption === "B" ? "16.02 km" : w.chosenOption === "C" ? "15.50 km" : "15.21 km";

      return {
        value: `${dist} (Thursday Walk Distance)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, dist) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Distance covered Mon–Wed = 8.25 + 7.52 + 11.27 = 27.04 km. Remaining Thursday distance = 42.25 − 27.04 = 15.21 km."
          : `Selected ${dist}. Thursday distance = 42.25 − (8.25 + 7.52 + 11.27).`,
      };
    },
  });

  return (
    <PlayShell
      title="Journey Tracker"
      mission="Find the distance Suresh must walk on Thursday to complete the 42.25 km total trek."
      icon={MapPin}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Thursday Trek" value={world.chosenOption === "D" ? "15.21 km (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* 4-Day Trek Ledger */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Daily Trekking Ledger:</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 bg-white border border-slate-200 rounded-lg">
              <span>Monday</span>
              <span className="font-bold">8.25 km</span>
            </div>
            <div className="flex justify-between p-2 bg-white border border-slate-200 rounded-lg">
              <span>Tuesday</span>
              <span className="font-bold">7.52 km</span>
            </div>
            <div className="flex justify-between p-2 bg-white border border-slate-200 rounded-lg">
              <span>Wednesday</span>
              <span className="font-bold">11.27 km</span>
            </div>
            <div className="flex justify-between p-2.5 bg-indigo-50 border-2 border-indigo-400 text-indigo-950 font-black rounded-lg">
              <span>Thursday Needed (42.25 − 27.04)</span>
              <span>15.21 km</span>
            </div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Distance to Walk on Thursday (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, dist: "14.18 km", isCorrect: false },
              { id: "B" as const, dist: "16.02 km", isCorrect: false },
              { id: "C" as const, dist: "15.50 km", isCorrect: false },
              { id: "D" as const, dist: "15.21 km", desc: "42.25 − 27.04 = 15.21 km (Correct)", isCorrect: true },
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
                  <span className="text-xl font-black text-slate-800 my-1 font-mono">{opt.dist}</span>
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
   Q44 — 🥛 Dairy Filling Station (Capacity Division)
   ══════════════════════════════════════════════════════════════════════ */
interface Q44World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q44DairyFillingStationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q44World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const b = w.chosenOption === "A" ? "520 bottles" : w.chosenOption === "B" ? "540 bottles" : w.chosenOption === "C" ? "560 bottles" : "580 bottles";

      return {
        value: `${b} (70,200 mL ÷ 130 mL)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, b) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 70 L 200 mL = 70,200 mL. Total bottles = 70,200 ÷ 130 = 540 bottles."
          : `Selected ${b}. Convert total volume to millilitres: (70 × 1000) + 200 = 70,200 mL. Then divide by 130 mL.`,
      };
    },
  });

  return (
    <PlayShell
      title="Dairy Filling Station"
      mission="Convert 70 L 200 mL into mL and calculate the number of 130 mL bottles filled."
      icon={Milk}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Bottles Filled" value={world.chosenOption === "B" ? "540 bottles (Option B)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Barrel to Bottle Conversion Display */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md my-2">
            <div className="p-3 bg-white border border-indigo-200 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Barrel Capacity</span>
              <span className="font-mono text-xl font-black text-indigo-900 my-1 block">70 L 200 mL</span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">= 70,200 mL</span>
            </div>

            <div className="p-3 bg-white border border-indigo-200 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Single Bottle</span>
              <span className="font-mono text-xl font-black text-indigo-900 my-1 block">130 mL</span>
              <span className="text-[10px] text-slate-500">Per unit capacity</span>
            </div>
          </div>

          <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-center font-mono text-xs font-bold text-emerald-900 w-full max-w-md">
            70,200 ÷ 130 = <b>540 Bottles Completely Filled</b>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select the Number of Bottles Filled (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, b: "520 bottles", isCorrect: false },
              { id: "B" as const, b: "540 bottles", desc: "70200 / 130 = 540 (Correct)", isCorrect: true },
              { id: "C" as const, b: "560 bottles", isCorrect: false },
              { id: "D" as const, b: "580 bottles", isCorrect: false },
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
                  <span className="text-xl font-black text-slate-800 my-1">{opt.b}</span>
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
   Q45 — 🚚 Milk Delivery Route (Weekly Revenue)
   ══════════════════════════════════════════════════════════════════════ */
interface Q45World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q45WeeklyMilkVendorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q45World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const amt = w.chosenOption === "A" ? "₹24,500" : w.chosenOption === "B" ? "₹25,200" : w.chosenOption === "C" ? "₹27,400" : "₹26,600";

      return {
        value: `${amt} (1,330 Litres × ₹20)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, amt) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Daily milk = 105 + 85 = 190 L. Weekly volume (7 days) = 190 × 7 = 1,330 L. Total revenue = 1,330 × ₹20 = ₹26,600."
          : `Selected ${amt}. Daily: 105 + 85 = 190 L. Weekly (7 days) = 1,330 L. Total cost = 1,330 × ₹20 = ₹26,600.`,
      };
    },
  });

  return (
    <PlayShell
      title="Milk Delivery Route"
      mission="Calculate the vendor's weekly collection for delivering 105 L morning and 85 L evening daily at ₹20/L."
      icon={Truck}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Weekly Revenue" value={world.chosenOption === "D" ? "₹26,600 (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Weekly Revenue Breakdown */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Weekly Milk Billing Calculation:</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 bg-white border border-slate-200 rounded-lg">
              <span>Daily Volume (105 L Morning + 85 L Evening)</span>
              <span className="font-bold text-slate-800">190 L / day</span>
            </div>
            <div className="flex justify-between p-2 bg-white border border-slate-200 rounded-lg">
              <span>Weekly Volume (7 Days × 190 L)</span>
              <span className="font-bold text-slate-800">1,330 Litres</span>
            </div>
            <div className="flex justify-between p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-950 font-black rounded-lg text-sm">
              <span>Total Weekly Revenue (1,330 L × ₹20 / L)</span>
              <span>₹26,600</span>
            </div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Total Money Collected in 1 Week (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, amt: "₹24,500", isCorrect: false },
              { id: "B" as const, amt: "₹25,200", isCorrect: false },
              { id: "C" as const, amt: "₹27,400", isCorrect: false },
              { id: "D" as const, amt: "₹26,600", desc: "190 × 7 × 20 = ₹26,600 (Correct)", isCorrect: true },
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
                  <span className="text-2xl font-black text-slate-800 my-1">{opt.amt}</span>
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

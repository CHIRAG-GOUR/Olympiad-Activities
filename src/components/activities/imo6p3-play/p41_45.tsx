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
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — 🏃 Step Synchronization
   ══════════════════════════════════════════════════════════════════════ */
interface Q41World {
  syncDistanceCm: number;
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
    initial: { syncDistanceCm: 6930 },
    derive: (w) => {
      return {
        value: "69 m 30 cm (6930 cm)",
        optionId: matchText(question, "A") ?? "A",
      };
    },
  });

  return (
    <PlayShell
      title="Marching Synchronizer"
      mission="Advance characters with step sizes 63 cm, 70 cm, and 77 cm until their steps align at the LCM distance."
      icon={Footprints}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Sync Distance" value="69 m 30 cm" />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-600">Boy 1 (Step 63 cm)</span>
            <span>110 complete steps</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-emerald-600">Boy 2 (Step 70 cm)</span>
            <span>99 complete steps</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-indigo-600">Boy 3 (Step 77 cm)</span>
            <span>90 complete steps</span>
          </div>
          <div className="pt-2 border-t border-indigo-200 text-center font-bold text-amber-600 text-xs">
            LCM = 7 × 9 × 10 × 11 = 6,930 cm = 69 m 30 cm
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — 🚇 Metro Fuel Savings
   ══════════════════════════════════════════════════════════════════════ */
interface Q42World {
  ratioFraction: string;
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
    initial: { ratioFraction: "81/110" },
    derive: (w) => {
      return {
        value: "81/110",
        optionId: matchText(question, "B") ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Metro Sustainability Dashboard"
      mission="Combine diesel and petrol savings and balance against CNG savings to simplify the fraction."
      icon={Train}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Simplified Fraction" value="81/110" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="text-[10px] text-slate-500 block">CNG</span>
            <span className="font-mono text-xs font-bold text-emerald-800">33,000 t</span>
          </div>
          <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
            <span className="text-[10px] text-slate-500 block">Diesel</span>
            <span className="font-mono text-xs font-bold text-indigo-800">3,300 t</span>
          </div>
          <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
            <span className="text-[10px] text-slate-500 block">Petrol</span>
            <span className="font-mono text-xs font-bold text-indigo-800">21,000 t</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — 🥾 Four-Day Walking Log
   ══════════════════════════════════════════════════════════════════════ */
interface Q43World {
  thursdayDistance: number;
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
    initial: { thursdayDistance: 15.21 },
    derive: (w) => {
      return {
        value: `${w.thursdayDistance} km`,
        optionId: matchNumber(question, w.thursdayDistance) ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Journey Tracker"
      mission="Subtract Monday, Tuesday, and Wednesday distances from the 42.25 km total to find Thursday."
      icon={MapPin}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Thursday Walk" value="15.21 km" />}
    >
      <div className="space-y-4">
        <Bay label="4-Day Walking Mileage Log">
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Monday</span>
              <span>8.25 km</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Tuesday</span>
              <span>7.52 km</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Wednesday</span>
              <span>11.27 km</span>
            </div>
            <div className="flex justify-between p-2 bg-indigo-50 font-bold text-indigo-900 border border-indigo-300 rounded-lg">
              <span>Thursday (42.25 − 27.04)</span>
              <span>15.21 km</span>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — 🥛 Dairy Filling Station
   ══════════════════════════════════════════════════════════════════════ */
interface Q44World {
  filledJugs: number;
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
    initial: { filledJugs: 540 },
    derive: (w) => {
      return {
        value: `${w.filledJugs} Jugs`,
        optionId: matchNumber(question, w.filledJugs) ?? "B",
      };
    },
  });

  return (
    <PlayShell
      title="Dairy Filling Station"
      mission="Convert 70 L 200 mL into mL and count how many 130 mL jugs are filled."
      icon={Milk}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Jugs Filled" value="540 Jugs" />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 text-center">
          <span className="text-xs font-mono text-slate-500">70,200 mL ÷ 130 mL/jug</span>
          <div className="font-mono text-2xl font-black text-amber-600 mt-1">540 Jugs</div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — 🥛 Weekly Milk Vendor
   ══════════════════════════════════════════════════════════════════════ */
interface Q45World {
  weeklyPayment: number;
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
    initial: { weeklyPayment: 26600 },
    derive: (w) => {
      return {
        value: `₹${w.weeklyPayment} (1330 L × ₹20)`,
        optionId: matchNumber(question, w.weeklyPayment) ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Milk Delivery Route"
      mission="Log daily morning and evening deliveries for 7 days and compute the weekly bill at ₹20/L."
      icon={Truck}
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
          <Gauge label="Daily Total" value="190 Litres" />
          <Gauge label="Weekly Total" value="1,330 Litres" />
          <Gauge label="Total Payment" value="₹26,600" />
        </>
      }
    >
      <div className="space-y-4">
        <Bay label="Weekly Delivery Accounting">
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Daily Milk (105 L Morning + 85 L Evening)</span>
              <span>190 L / day</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>7 Days Volume (190 × 7)</span>
              <span>1,330 Litres</span>
            </div>
            <div className="flex justify-between p-2 bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 rounded-lg">
              <span>Total Weekly Bill @ ₹20 / L</span>
              <span>₹26,600</span>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

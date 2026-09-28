"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, Stepper, PlayCanvas } from "./kit";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Droplet, Clock, ShoppingCart, Car, Grid, CheckCircle2 } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — The Water Distribution Plant (HCF of 4200 L, 5040 L, 6750 L)
   Capacities: 4200, 5040, 6750.
   HCF = 30 L -> Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q41WaterPlant({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const TANKS = [
    { name: "Tank Alpha", cap: 4200 },
    { name: "Tank Beta", cap: 5040 },
    { name: "Tank Gamma", cap: 6750 },
  ];

  const CANDIDATES = [10, 15, 20, 25, 30, 42, 50, 60];

  const play = usePlay<{ containerCap: number }>({
    question,
    initial: { containerCap: 30 },
    derive: (w) => {
      const cap = w?.containerCap ?? 30;
      const validAlpha = 4200 % cap === 0;
      const validBeta = 5040 % cap === 0;
      const validGamma = 6750 % cap === 0;
      const allDivisible = validAlpha && validBeta && validGamma;

      if (cap === 30 && allDivisible) {
        return { value: "30 L", optionId: matchText(question, "30 L") };
      }
      return {
        note: `Selected: ${cap} L (${allDivisible ? "Common divisor" : "Leaves remainder"}). Find greatest common container (HCF).`,
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const containerCap = play.world?.containerCap ?? 30;

  return (
    <Shell
      play={play}
      question={question}
      title="The Water Tanker HCF Dispenser"
      mission="Three water tankers hold 4200 L, 5040 L and 6750 L. Test candidate container capacities to find the maximum capacity (HCF = 30 L) that measures all three quantities exactly."
      icon={Droplet}
      dim="2D"
      submitLabel="Submit Maximum Capacity (30 L)"
      hints={[
        "The measuring container must divide all 3 tank capacities with zero remainder.",
        "4200 ÷ 30 = 140 fills, 5040 ÷ 30 = 168 fills, 6750 ÷ 30 = 225 fills (all exact integers!).",
        "Higher candidates like 42 L, 50 L, 60 L fail to divide at least one tank evenly.",
      ]}
      live={
        <>
          <Gauge label="Testing Container" value={`${containerCap} L`} tone={containerCap === 30 ? "emerald" : "indigo"} />
          <Gauge label="All Exact?" value={4200 % containerCap === 0 && 5040 % containerCap === 0 && 6750 % containerCap === 0 ? "Yes (Divisible)" : "No (Remainder)"} tone={containerCap === 30 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="space-y-3">
          {/* Tanks Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {TANKS.map((t) => {
              const isExact = t.cap % containerCap === 0;
              const fills = Math.floor(t.cap / containerCap);
              return (
                <div key={t.name} className="rounded-xl border border-indigo-100 bg-white p-3 text-center shadow-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t.name}</div>
                  <div className="text-xl font-black text-indigo-950 mt-1">{t.cap.toLocaleString()} L</div>
                  <div className={`mt-2 rounded-lg py-1 px-2 text-xs font-bold border ${isExact ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
                    {isExact ? `✓ ${fills} exact fills` : `✗ Rem: ${t.cap % containerCap} L`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Container Selector */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
            <div className="text-xs font-black uppercase tracking-wider text-indigo-950 mb-2">
              Select Test Measuring Container:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {CANDIDATES.map((c) => {
                const isSelected = containerCap === c;
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={play.readOnly}
                    onClick={() => play.patch({ containerCap: c })}
                    className={`py-2 rounded-xl text-xs font-black border transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-700 shadow-xs scale-105"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50"
                    }`}
                  >
                    {c} L
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Board>

      <Bay label="HCF Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ containerCap: 30 })}>
          ⚡ Set Maximum Capacity: 30 L (HCF)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — The 24-Hour Life Clock (Garima's Routine)
   Office = 8h, Travel = 4h, Play = 5h.
   Sleep = 24 - (8 + 4 + 5) = 7h.
   Fraction = 7/24 -> Option C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q42LifeClock({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ office: number; travel: number; playH: number }>({
    question,
    initial: { office: 8, travel: 4, playH: 5 },
    derive: (w) => {
      const office = w?.office ?? 8;
      const travel = w?.travel ?? 4;
      const playH = w?.playH ?? 5;
      const allocated = office + travel + playH;
      const sleepH = 24 - allocated;

      if (sleepH === 7) {
        return { value: "7/24", optionId: matchText(question, "7/24") };
      }
      return {
        note: `Current sleeping time: ${sleepH} hours (${sleepH}/24). Configure schedule blocks.`,
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const office = play.world?.office ?? 8;
  const travel = play.world?.travel ?? 4;
  const playH = play.world?.playH ?? 5;
  const sleepH = 24 - (office + travel + playH);

  return (
    <Shell
      play={play}
      question={question}
      title="The 24-Hour Daily Fraction Clock"
      mission="In a 24-hour day, Garima spends 8h in office, 4h travelling, 5h playing with her son, and the rest sleeping. Derive the fraction of the day spent sleeping (7/24)."
      icon={Clock}
      dim="2D"
      submitLabel="Submit Sleeping Fraction (7/24)"
      hints={[
        "Total day = 24 hours.",
        "Office (8h) + Travel (4h) + Playing (5h) = 17 hours.",
        "Remaining Sleeping Time = 24 − 17 = 7 hours.",
        "Fraction of day = 7 / 24 (Option C).",
      ]}
      live={
        <>
          <Gauge label="Allocated Routine" value="17h" tone="violet" />
          <Gauge label="Sleeping Hours" value={`${sleepH}h`} tone={sleepH === 7 ? "emerald" : "indigo"} />
          <Gauge label="Fraction of Day" value={`${sleepH}/24`} tone={sleepH === 7 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="space-y-3">
          {/* Visual 24h Bar */}
          <div className="rounded-xl border border-indigo-100 bg-white p-3.5 space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>24-Hour Daily Timeline</span>
              <span>Total: 24 Hours</span>
            </div>

            <div className="flex h-10 w-full rounded-xl overflow-hidden border border-slate-200 font-black text-white text-[11px] shadow-inner">
              <div style={{ width: `${(office / 24) * 100}%` }} className="bg-sky-500 flex items-center justify-center">
                Office ({office}h)
              </div>
              <div style={{ width: `${(travel / 24) * 100}%` }} className="bg-amber-500 flex items-center justify-center">
                Travel ({travel}h)
              </div>
              <div style={{ width: `${(playH / 24) * 100}%` }} className="bg-emerald-500 flex items-center justify-center">
                Play ({playH}h)
              </div>
              <div style={{ width: `${(Math.max(0, sleepH) / 24) * 100}%` }} className="bg-indigo-600 flex items-center justify-center">
                Sleep ({sleepH}h)
              </div>
            </div>
          </div>

          {/* Derived Fraction Card */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase text-indigo-700">Calculated Sleeping Hours</div>
              <div className="text-xs text-slate-700 font-bold mt-0.5">
                24 − ({office} + {travel} + {playH}) = <span className="font-extrabold text-indigo-900">{sleepH} hours</span>
              </div>
            </div>
            <div className="rounded-xl bg-white border border-indigo-300 px-4 py-1.5 text-center shadow-xs">
              <div className="text-xl font-black text-indigo-700">{sleepH} / 24</div>
            </div>
          </div>
        </div>
      </Board>

      <Bay label="Scheduler" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ office: 8, travel: 4, playH: 5 })}>
          ⚡ Set Garima's Schedule (7/24 Sleep)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — The Birthday Gift Shop (Pencils and Pens)
   25 pencils @ ₹8 = ₹200.
   25 pens @ ₹15 = ₹375.
   Total = 200 + 375 = ₹575 -> Option A.
   ══════════════════════════════════════════════════════════════════════ */

export function Q43GiftShop({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ pencils: number; pens: number }>({
    question,
    initial: { pencils: 25, pens: 25 },
    derive: (w) => {
      const pencils = w?.pencils ?? 25;
      const pens = w?.pens ?? 25;
      const pencilCost = pencils * 8;
      const penCost = pens * 15;
      const total = pencilCost + penCost;

      if (total === 575) {
        return { value: "₹ 575", optionId: matchText(question, "575") };
      }
      return { note: `Current bill: ₹${total} (25 pencils @ ₹8 + 25 pens @ ₹15 = ₹575).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const pencils = play.world?.pencils ?? 25;
  const pens = play.world?.pens ?? 25;
  const pencilCost = pencils * 8;
  const penCost = pens * 15;
  const total = pencilCost + penCost;

  return (
    <Shell
      play={play}
      question={question}
      title="The Birthday Stationery Checkout"
      mission="Sonali buys 25 pencils at ₹8 each and 25 pens at ₹15 each for friends. Calculate the total checkout amount (25×8 + 25×15 = ₹575)."
      icon={ShoppingCart}
      dim="2D"
      submitLabel="Submit Total Amount (₹575)"
      hints={[
        "25 pencils at ₹8 each = 25 × 8 = ₹200.",
        "25 pens at ₹15 each = 25 × 15 = ₹375.",
        "Total expenditure = ₹200 + ₹375 = ₹575 (Option A).",
      ]}
      live={
        <>
          <Gauge label="25 Pencils" value="₹200" tone="violet" />
          <Gauge label="25 Pens" value="₹375" tone="indigo" />
          <Gauge label="Total Checkout" value={`₹ ${total}`} tone={total === 575 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 shadow-xs space-y-3 border border-indigo-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase text-amber-900">✏️ 25 Pencils</div>
                <div className="text-[11px] text-slate-600 font-bold">25 pcs × ₹8</div>
              </div>
              <div className="text-xl font-black text-amber-900">₹{pencilCost}</div>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase text-sky-900">✒️ 25 Pens</div>
                <div className="text-[11px] text-slate-600 font-bold">25 pcs × ₹15</div>
              </div>
              <div className="text-xl font-black text-sky-900">₹{penCost}</div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex justify-between items-center text-emerald-950">
            <span className="text-xs font-black uppercase">Total Bill Sum:</span>
            <span className="text-xl font-black">₹ {total}</span>
          </div>
        </div>
      </Board>

      <Bay label="Checkout Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ pencils: 25, pens: 25 })}>
          ⚡ Compute Total Amount: ₹575
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — The Three-Day Road Trip (Mayank's Travel)
   Total = 352.15 km.
   Day 1 = 115.28 km, Day 2 = 79.50 km.
   Day 3 = 352.15 - (115.28 + 79.50) = 157.37 km -> Option B.
   ══════════════════════════════════════════════════════════════════════ */

export function Q44RoadTrip({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const TOTAL = 352.15;
  const DAY1 = 115.28;
  const DAY2 = 79.5;

  const play = usePlay<{ verified: boolean }>({
    question,
    initial: { verified: false },
    derive: (w) => {
      const day3 = parseFloat((TOTAL - (DAY1 + DAY2)).toFixed(2));
      const label = `${day3.toFixed(2)} km`;

      if (w.verified) {
        return { value: label, optionId: matchText(question, "157.37 km") };
      }
      return { note: `Calculate Day 3 distance: 352.15 - (${DAY1} + ${DAY2}).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const day3 = (TOTAL - (DAY1 + DAY2)).toFixed(2);

  return (
    <Shell
      play={play}
      question={question}
      title="The Three-Day Trip Odometer"
      mission="Mayank travelled 352.15 km in three days (Day 1: 115.28 km, Day 2: 79.50 km). Track the trip odometer to calculate the distance travelled on Day 3 (157.37 km)."
      icon={Car}
      dim="2D"
      submitLabel="Submit Day 3 Distance (157.37 km)"
      hints={[
        "Total distance for 3 days = 352.15 km.",
        "Sum of Day 1 & Day 2 = 115.28 + 79.50 = 194.78 km.",
        "Day 3 distance = 352.15 − 194.78 = 157.37 km (Option B).",
      ]}
      live={
        <>
          <Gauge label="Day 1" value="115.28 km" tone="violet" />
          <Gauge label="Day 2" value="79.50 km" tone="violet" />
          <Gauge label="Day 3" value={w.verified ? `${day3} km` : "---"} tone={w.verified ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 shadow-xs space-y-3 border border-indigo-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
              <div className="text-[10px] font-black uppercase text-sky-800">Day 1 Leg</div>
              <div className="text-lg font-black text-sky-950 mt-1">{DAY1.toFixed(2)} km</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="text-[10px] font-black uppercase text-amber-800">Day 2 Leg</div>
              <div className="text-lg font-black text-amber-950 mt-1">{DAY2.toFixed(2)} km</div>
            </div>
            <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-3 shadow-xs">
              <div className="text-[10px] font-black uppercase text-emerald-800">Day 3 (Derived)</div>
              <div className="text-lg font-black text-emerald-950 mt-1">{w.verified ? `${day3} km` : "---"}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-bold text-indigo-950 text-center">
            352.15 km − (115.28 km + 79.50 km) = 352.15 km − 194.78 km = <span className="text-emerald-700 font-black">157.37 km</span>
          </div>
        </div>
      </Board>

      <Bay label="Trip Computer" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ verified: true })}>
          ⚡ Compute Day 3 Distance (157.37 km)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — The Flooring Contractor (Area & Dimensions)
   Cost = 2160, Rate = 45/sq m -> Area = 2160 / 45 = 48 sq m.
   Length = 8m -> Breadth = 48 / 8 = 6m -> Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q45Flooring({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const TOTAL_COST = 2160;
  const RATE = 45;
  const LENGTH = 8;

  const play = usePlay<{ breadth: number }>({
    question,
    initial: { breadth: 6 },
    derive: (w) => {
      const b = w?.breadth ?? 6;
      const area = LENGTH * b;
      const cost = area * RATE;
      const label = `${b} m`;

      if (b === 6) {
        return { value: label, optionId: matchText(question, "6 m") };
      }
      return { note: `Breadth: ${b} m (Area: ${area} m², Cost: ₹${cost} vs budget ₹${TOTAL_COST}).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const breadth = play.world?.breadth ?? 6;
  const area = LENGTH * breadth;
  const cost = area * RATE;

  return (
    <Shell
      play={play}
      question={question}
      title="The Room Flooring Blueprint Planner"
      mission="Flooring a room costs ₹2160 at ₹45 per sq. metre. If length is 8 metres, use the blueprint to derive the room's breadth (Area = 2160÷45 = 48 m² → Breadth = 48÷8 = 6 m)."
      icon={Grid}
      dim="2D"
      submitLabel="Submit Room Breadth (6 m)"
      hints={[
        "Floor Area = Total Cost ÷ Rate = ₹2160 ÷ ₹45 = 48 sq. metres.",
        "Area = Length × Breadth ⇒ 48 = 8 × Breadth.",
        "Breadth = 48 ÷ 8 = 6 metres (Option D).",
      ]}
      live={
        <>
          <Gauge label="Total Cost" value="₹2160" tone="violet" />
          <Gauge label="Floor Area" value={`${area} m²`} tone="indigo" />
          <Gauge label="Derived Breadth" value={`${breadth} m`} tone={breadth === 6 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 shadow-xs space-y-3 border border-indigo-100">
          <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div
              style={{ width: `${LENGTH * 24}px`, height: `${breadth * 22}px` }}
              className="bg-indigo-50 border-2 border-indigo-400 rounded-xl flex flex-col items-center justify-center text-indigo-950 font-bold transition-all shadow-xs"
            >
              <span className="text-[11px] font-black text-indigo-700">Length: 8 m</span>
              <span className="text-sm font-black text-indigo-900 my-0.5">Area: {area} m²</span>
              <span className="text-[11px] font-black text-indigo-700">Breadth: {breadth} m</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
            <span>₹2160 ÷ ₹45/m² = 48 m²</span>
            <span className={cost === TOTAL_COST ? "text-emerald-700 font-black" : "text-rose-700"}>
              {cost === TOTAL_COST ? "✓ Exact Budget Match (Breadth = 6 m)" : "✗ Mismatch"}
            </span>
          </div>
        </div>
      </Board>

      <Bay label="Blueprint Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ breadth: 6 })}>
          ⚡ Set Exact Breadth: 6 m (Area: 48 m²)
        </Btn>
      </Bay>
    </Shell>
  );
}

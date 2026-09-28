"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, Stepper } from "./kit";
import { Droplet, Clock, ShoppingCart, Car, Grid } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Q41: THE WATER DISTRIBUTION PLANT (HCF of 4200 L, 5040 L, 6750 L)
// ─────────────────────────────────────────────────────────────────────────────
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
        return { value: "30 L", optionId: matchText(question, "30 L") ?? "D" };
      }
      return {
        note: `Selected: ${cap} L (All exact? ${allDivisible ? "Divisible (Check if maximum)" : "Leaves remainder"}). Find greatest container.`,
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
      title="The Water Distribution Plant"
      mission="Three tankers contain 4200 L, 5040 L and 6750 L. Test candidate container capacities to find the maximum capacity (HCF) that measures all three quantities exactly."
      icon={Droplet}
      hints={[
        "The measuring container must divide all 3 tank capacities with zero remainder.",
        "4200 / 30 = 140 fills, 5040 / 30 = 168 fills, 6750 / 30 = 225 fills (all exact!).",
        "Higher candidates like 42, 50, 60 fail to divide at least one tank evenly.",
      ]}
    >
      <Board className="space-y-4">
        {/* Tanks Display */}
        <div className="grid grid-cols-3 gap-3">
          {TANKS.map((t) => {
            const isExact = t.cap % containerCap === 0;
            const fills = Math.floor(t.cap / containerCap);
            return (
              <div key={t.name} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                <div className="text-[11px] font-bold text-slate-500 uppercase">{t.name}</div>
                <div className="text-lg font-black text-slate-800">{t.cap.toLocaleString()} L</div>
                <div className={`mt-2 rounded-lg py-1 px-2 text-xs font-bold border ${isExact ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                  {isExact ? `✓ ${fills} fills` : `✗ Rem: ${t.cap % containerCap} L`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Container Selector */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
          <div className="text-xs font-black uppercase tracking-wider text-indigo-900 mb-2">
            Select Test Measuring Container:
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {CANDIDATES.map((c) => {
              const isSelected = containerCap === c;
              const allDiv = 4200 % c === 0 && 5040 % c === 0 && 6750 % c === 0;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => play.patch({ containerCap: c })}
                  className={`py-2 rounded-xl text-xs font-black border transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-md scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50"
                  }`}
                >
                  {c} L {allDiv && isSelected && "★"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluation Banner */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Current Container: <span className="font-bold text-indigo-700">{containerCap} L</span>
          </div>
          <div className="text-xs font-black">
            {4200 % containerCap === 0 && 5040 % containerCap === 0 && 6750 % containerCap === 0
              ? (containerCap === 30 ? "🏆 Maximum Common Capacity: 30 L (HCF)" : "✓ Common Divisor (Check if higher exists)")
              : "❌ Leaves remainder in at least one tank"}
          </div>
        </div>
      </Board>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Q42: THE 24-HOUR LIFE CLOCK (Garima's Routine)
// ─────────────────────────────────────────────────────────────────────────────
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
        return { value: "7/24", optionId: matchText(question, "7/24") ?? "C" };
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
      title="The 24-Hour Life Clock"
      mission="In a 24-hour day, Garima spends 8h in office, 4h travelling, 5h playing with her son, and the rest sleeping. Derive the fraction of the day spent sleeping."
      icon={Clock}
      hints={[
        "Total day = 24 hours.",
        "Office (8h) + Travel (4h) + Playing (5h) = 17 hours.",
        "Remaining Sleeping Time = 24 - 17 = 7 hours.",
        "Fraction of day = 7 / 24.",
      ]}
    >
      <Board className="space-y-4">
        {/* Visual 24h Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>24-Hour Timeline Distribution</span>
            <span>Total: 24 Hours</span>
          </div>

          <div className="flex h-10 w-full rounded-xl overflow-hidden border border-slate-300 font-bold text-white text-[11px] shadow-inner">
            <div style={{ width: `${(office / 24) * 100}%` }} className="bg-blue-500 flex items-center justify-center">
              Office ({office}h)
            </div>
            <div style={{ width: `${(travel / 24) * 100}%` }} className="bg-amber-500 flex items-center justify-center">
              Travel ({travel}h)
            </div>
            <div style={{ width: `${(playH / 24) * 100}%` }} className="bg-emerald-500 flex items-center justify-center">
              Play ({playH}h)
            </div>
            <div style={{ width: `${(Math.max(0, sleepH) / 24) * 100}%` }} className="bg-indigo-600 flex items-center justify-center animate-pulse">
              Sleep ({sleepH}h)
            </div>
          </div>
        </div>

        {/* Schedule Allocator Controls */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center">
            <div className="text-xs font-bold text-blue-800">Office Work</div>
            <Stepper
              value={office}
              min={1}
              max={15}
              onChange={(v) => play.patch({ office: v })}
            />
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-center">
            <div className="text-xs font-bold text-amber-800">Commute / Travel</div>
            <Stepper
              value={travel}
              min={1}
              max={10}
              onChange={(v) => play.patch({ travel: v })}
            />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center">
            <div className="text-xs font-bold text-emerald-800">Playing with Son</div>
            <Stepper
              value={playH}
              min={1}
              max={10}
              onChange={(v) => play.patch({ playH: v })}
            />
          </div>
        </div>

        {/* Derived Fraction Card */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-indigo-700">Calculated Sleeping Fraction</div>
            <div className="text-sm text-slate-700">
              Remaining: 24 − ({office} + {travel} + {playH}) = <span className="font-bold text-indigo-900">{sleepH} hours</span>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-indigo-300 px-4 py-2 text-center shadow-sm">
            <div className="text-xl font-black text-indigo-700">{sleepH} / 24</div>
            <div className="text-[10px] text-slate-500 font-semibold">Fraction of Day</div>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Q43: THE BIRTHDAY GIFT SHOP (Pencils and Pens)
// ─────────────────────────────────────────────────────────────────────────────
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
        return { value: "₹ 575", optionId: matchText(question, "₹ 575") ?? "A" };
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
      title="The Birthday Gift Shop"
      mission="Sonali buys 25 pencils at ₹8 each and 25 pens at ₹15 each for friends. Fill the gift baskets and compute the total checkout amount."
      icon={ShoppingCart}
      hints={[
        "25 pencils at ₹8 each = 25 × 8 = ₹200.",
        "25 pens at ₹15 each = 25 × 15 = ₹375.",
        "Total expenditure = ₹200 + ₹375 = ₹575.",
      ]}
    >
      <Board className="space-y-4">
        {/* Store Shelf & Baskets */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pencils Card */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-amber-800 uppercase">✏️ Pencils</div>
                <div className="text-xs text-slate-500">Rate: ₹8 per pencil</div>
              </div>
              <div className="text-lg font-black text-amber-900">₹{pencilCost}</div>
            </div>
            <Stepper
              value={pencils}
              min={0}
              max={50}
              onChange={(v) => play.patch({ pencils: v })}
            />
          </div>

          {/* Pens Card */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-blue-800 uppercase">✒️ Pens</div>
                <div className="text-xs text-slate-500">Rate: ₹15 per pen</div>
              </div>
              <div className="text-lg font-black text-blue-900">₹{penCost}</div>
            </div>
            <Stepper
              value={pens}
              min={0}
              max={50}
              onChange={(v) => play.patch({ pens: v })}
            />
          </div>
        </div>

        {/* Checkout Counter */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase text-slate-500">Checkout Bill Breakdown</div>
          <div className="flex justify-between text-xs text-slate-700 py-1 border-b">
            <span>Pencils ({pencils} pcs × ₹8):</span>
            <span className="font-bold">₹{pencilCost}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-700 py-1 border-b">
            <span>Pens ({pens} pcs × ₹15):</span>
            <span className="font-bold">₹{penCost}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1">
            <span>Total Bill Amount:</span>
            <span className="text-xl font-black text-emerald-600">₹ {total}</span>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Q44: THE THREE-DAY ROAD TRIP (Mayank's Travel)
// ─────────────────────────────────────────────────────────────────────────────
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

  const play = usePlay<{ day1: number; day2: number; verified: boolean }>({
    question,
    initial: { day1: DAY1, day2: DAY2, verified: true },
    derive: (w) => {
      const d1 = w?.day1 ?? DAY1;
      const d2 = w?.day2 ?? DAY2;
      const day3 = parseFloat((TOTAL - (d1 + d2)).toFixed(2));
      const label = `${day3.toFixed(2)} km`;

      if (label === "157.37 km") {
        return { value: label, optionId: matchText(question, "157.37 km") ?? "B" };
      }
      return { note: `Trip distance: 352.15 - (${d1} + ${d2}) = ${label}.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const d1 = play.world?.day1 ?? DAY1;
  const d2 = play.world?.day2 ?? DAY2;
  const day3 = (TOTAL - (d1 + d2)).toFixed(2);

  return (
    <Shell
      play={play}
      question={question}
      title="The Three-Day Road Trip"
      mission="Mayank travelled 352.15 km in three days (Day 1: 115.28 km, Day 2: 79.50 km). Track the trip odometer to derive the distance travelled on Day 3."
      icon={Car}
      hints={[
        "Total distance for 3 days = 352.15 km.",
        "Sum of Day 1 & Day 2 = 115.28 + 79.50 = 194.78 km.",
        "Day 3 distance = 352.15 - 194.78 = 157.37 km.",
      ]}
    >
      <Board className="space-y-4">
        {/* Road map segment display */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Road Trip Progress</span>
            <span>Total: 352.15 km</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-2">
              <div className="text-[10px] font-bold text-blue-700 uppercase">Day 1 Leg</div>
              <div className="text-base font-black text-blue-900">{d1.toFixed(2)} km</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2">
              <div className="text-[10px] font-bold text-amber-700 uppercase">Day 2 Leg</div>
              <div className="text-base font-black text-amber-900">{d2.toFixed(2)} km</div>
            </div>
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-2 ring-2 ring-emerald-400">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Day 3 (Calculated)</div>
              <div className="text-base font-black text-emerald-900">{day3} km</div>
            </div>
          </div>
        </div>

        {/* Trip Computer Calculator */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-indigo-900">
            Trip Computer Arithmetic:
          </div>
          <div className="text-xs font-mono text-slate-700 space-y-1">
            <div>• Total Distance = 352.15 km</div>
            <div>• Days (1 + 2) Sum = {d1.toFixed(2)} + {d2.toFixed(2)} = {(d1 + d2).toFixed(2)} km</div>
            <div>• Day 3 Distance = 352.15 − {(d1 + d2).toFixed(2)} = <span className="font-bold text-indigo-700">{day3} km</span></div>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Q45: THE FLOORING CONTRACTOR (Area & Dimensions)
// ─────────────────────────────────────────────────────────────────────────────
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
        return { value: label, optionId: matchText(question, "6 m") ?? "D" };
      }
      return { note: `Breadth: ${b} m (Area: ${area} m², Cost: ₹${cost} vs budget ₹${TOTAL_COST}). Adjust to match budget.` };
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
      title="The Flooring Contractor"
      mission="Flooring a room costs ₹2160 at ₹45 per sq. metre. If length is 8 metres, use the virtual blueprint to derive the room's breadth."
      icon={Grid}
      hints={[
        "Floor Area = Total Cost ÷ Rate = ₹2160 ÷ ₹45 = 48 sq. metres.",
        "Area = Length × Breadth ⇒ 48 = 8 × Breadth.",
        "Breadth = 48 ÷ 8 = 6 metres.",
      ]}
    >
      <Board className="space-y-4">
        {/* Room Blueprint Visual */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase">Room Blueprint Grid (Length: 8m)</div>
          
          <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div
              style={{ width: `${LENGTH * 24}px`, height: `${breadth * 24}px` }}
              className="bg-amber-100 border-2 border-amber-500 rounded-lg flex flex-col items-center justify-center text-amber-900 font-bold transition-all shadow-md"
            >
              <span className="text-xs">Length: 8 m</span>
              <span className="text-sm font-black">Area: {area} m²</span>
              <span className="text-xs">Breadth: {breadth} m</span>
            </div>
          </div>
        </div>

        {/* Breadth Measuring Tape Stepper */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-indigo-900">Adjust Virtual Measuring Tape:</div>
            <div className="text-xs text-slate-600">Calculated Cost: <span className="font-bold">₹{cost}</span> (Target: ₹2160)</div>
          </div>
          <Stepper
            value={breadth}
            min={4}
            max={15}
            onChange={(v) => play.patch({ breadth: v })}
          />
        </div>

        {/* Audit Report */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 flex justify-between items-center text-xs font-semibold text-slate-700">
          <span>Cost / Rate = 2160 / 45 = 48 m²</span>
          <span className={cost === TOTAL_COST ? "text-emerald-600 font-black" : "text-rose-600"}>
            {cost === TOTAL_COST ? "✓ Exact Budget Match (₹2160)" : "✗ Cost mismatch"}
          </span>
        </div>
      </Board>
    </Shell>
  );
}

"use client";

import React from "react";
import { Egg, Tag, Ruler, Droplets, Truck, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — Large Scale Egg Logistics Warehouse
   58,970,252 − 3,789,441 − 4,207,985 = 50,972,826 trays × 30 = 1,529,184,780 eggs (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q41ColdStorageEggActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ calculatedEggs: string }>({
    question,
    initial: { calculatedEggs: "1,529,184,780" },
    derive: (w) => {
      const e = w?.calculatedEggs ?? "1,529,184,780";
      if (e === "1,529,184,780") {
        return {
          value: "1,529,184,780",
          optionId: matchText(question, "1,529,184,780"),
        };
      }
      return { note: `Calculated: ${e} eggs. Subtract Delhi and Punjab shipments, then multiply by 30.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const eggs = play.world?.calculatedEggs ?? "1,529,184,780";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Cold-Storage Logistics Warehouse"
      mission="Track 58,970,252 egg trays: dispatch 3,789,441 to Delhi and 4,207,985 to Punjab. Convert remaining 50,972,826 trays into eggs (@ 30 eggs/tray) -> 1,529,184,780 eggs."
      icon={Egg}
      dim="2D"
      submitLabel="Submit Remaining Eggs (Option A)"
      hints={[
        "Initial Trays = 58,970,252.",
        "Total Dispatched = 3,789,441 + 4,207,985 = 7,997,426 trays.",
        "Remaining Trays = 58,970,252 − 7,997,426 = 50,972,826 trays.",
        "Total Eggs = 50,972,826 × 30 = 1,529,184,780 eggs (Option A).",
      ]}
      live={
        <>
          <Gauge label="Dispatched Trays" value="7,997,426" tone="rose" />
          <Gauge label="Remaining Trays" value="50,972,826" tone="sky" />
          <Gauge label="Remaining Eggs" value={eggs} tone={eggs === "1,529,184,780" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "1,529,184,780",
            "1,528,450,220",
            "1,600,120,500",
            "1,498,782,100",
          ].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => play.patch({ calculatedEggs: val })}
              className={`p-3 rounded-xl font-mono text-xs font-black border transition-all text-center ${
                eggs === val
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {val} {val === "1,529,184,780" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — Shopping Mall Checkout (Handbag Savings)
   ₹428.98 − ₹399.99 = ₹28.99 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q42ShoppingDiscountActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ calculatedSavings: number }>({
    question,
    initial: { calculatedSavings: 28.99 },
    derive: (w) => {
      const s = w?.calculatedSavings ?? 0;
      if (s === 28.99) {
        return {
          value: "₹28.99",
          optionId: matchText(question, "₹28.99"),
        };
      }
      return { note: `Savings: ₹${s}. Original(₹428.98) - Sale(₹399.99).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const sav = play.world?.calculatedSavings ?? 28.99;

  return (
    <Shell
      play={play}
      question={question}
      title="Shopping Mall Discount Checkout"
      mission="Handbag original price is ₹428.98, on sale next week for ₹399.99. Compute Garima's savings (₹428.98 − ₹399.99 = ₹28.99)."
      icon={Tag}
      dim="2D"
      submitLabel="Submit Savings (₹28.99 / Option A)"
      hints={[
        "Original Price = ₹428.98.",
        "Sale Price = ₹399.99.",
        "Savings = ₹428.98 − ₹399.99 = ₹28.99 (Option A).",
      ]}
      live={
        <>
          <Gauge label="Original Price" value="₹428.98" tone="sky" />
          <Gauge label="Sale Price" value="₹399.99" tone="indigo" />
          <Gauge label="Garima's Savings" value={`₹${sav.toFixed(2)}`} tone={sav === 28.99 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[28.99, 29.01, 30.99, 27.89].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => play.patch({ calculatedSavings: p })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                sav === p
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              ₹{p.toFixed(2)} {p === 28.99 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — 3D Coloured Rod Manufacturing Machine
   Violet portion = 12.08 m => Total length = 16 m (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q43ColouredRodActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ rodLength: number }>({
    question,
    initial: { rodLength: 16 },
    derive: (w) => {
      const len = w?.rodLength ?? 0;
      if (len === 16) {
        return {
          value: "16 m",
          optionId: matchText(question, "16 m"),
        };
      }
      return { note: `Total Rod Length: ${len} m. Adjust length so violet section equals 12.08 m.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const len = play.world?.rodLength ?? 16;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Coloured Rod Manufacturing Machine"
      mission="Pass the rod through 6 coloured fractional chambers (Red, Orange, Yellow, Green, Blue, Black). Adjust total length until remaining violet section is 12.08 m -> 16 m."
      icon={Ruler}
      dim="2D"
      submitLabel="Submit Rod Length (16 m / Option A)"
      hints={[
        "Sum of coloured fractions leaves remaining fraction for violet.",
        "Violet portion = 12.08 m.",
        "Solving for total length yields exactly 16 m (Option A).",
      ]}
      live={
        <>
          <Gauge label="6 Coloured Bands" value="Calculated" tone="sky" />
          <Gauge label="Violet Section" value="12.08 m" tone="violet" />
          <Gauge label="Total Length" value={`${len} m`} tone={len === 16 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[16, 18, 20, 24].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => play.patch({ rodLength: m })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                len === m
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {m} m {m === 16 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — Industrial Liquid Transfer (Oil Drum)
   705 L − 135.75 L − 253.50 L = 315.75 litres left (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q44OilTankActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ remainingOil: number }>({
    question,
    initial: { remainingOil: 315.75 },
    derive: (w) => {
      const oil = w?.remainingOil ?? 0;
      if (oil === 315.75) {
        return {
          value: "315.75 litres",
          optionId: matchText(question, "315.75 litres"),
        };
      }
      return { note: `Remaining Oil: ${oil} L. Drum capacity = 705 L − (135.75 + 253.50).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const oil = play.world?.remainingOil ?? 315.75;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Industrial Oil-Transfer Laboratory"
      mission="A 705-litre drum dispenses into two containers of 135.75 L and 253.50 L. Operate valves to measure the remaining liquid in the drum (315.75 litres)."
      icon={Droplets}
      dim="2D"
      submitLabel="Submit Remaining Oil (315.75 L / Option D)"
      hints={[
        "Total initial oil = 705.00 litres.",
        "Total drained = 135.75 + 253.50 = 389.25 litres.",
        "Remaining Oil = 705.00 − 389.25 = 315.75 litres (Option D).",
      ]}
      live={
        <>
          <Gauge label="Initial Drum" value="705.00 L" tone="sky" />
          <Gauge label="Drained Liquid" value="389.25 L" tone="rose" />
          <Gauge label="Remaining Volume" value={`${oil.toFixed(2)} L`} tone={oil === 315.75 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[310.25, 325.50, 308.75, 315.75].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => play.patch({ remainingOil: v })}
              className={`py-3 rounded-xl font-mono text-xs font-black border transition-all ${
                oil === v
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {v.toFixed(2)} L {v === 315.75 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — Delivery Vehicle Total Cargo Load
   Truck (582) + Van (359) = 941 boxes × 16 kg = 15,056 kg (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q45DeliveryLoadActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ totalKg: number }>({
    question,
    initial: { totalKg: 15056 },
    derive: (w) => {
      const kg = w?.totalKg ?? 0;
      if (kg === 15056) {
        return {
          value: "15,056 kg",
          optionId: matchText(question, "15,056 kg"),
        };
      }
      return { note: `Total weight: ${kg} kg. Truck(582 × 16) + Van(359 × 16) = 941 × 16.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const kg = play.world?.totalKg ?? 15056;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Delivery Fleet Loading Simulator"
      mission="Load transport truck (582 boxes) and delivery van (359 boxes) @ 16 kg per box: compute total combined weight (941 × 16 kg = 15,056 kg)."
      icon={Truck}
      dim="2D"
      submitLabel="Submit Total Load (15,056 kg / Option B)"
      hints={[
        "Total boxes in both vehicles = 582 + 359 = 941 boxes.",
        "Each box weighs 16 kg.",
        "Total weight = 941 × 16 = 15,056 kg (Option B).",
      ]}
      live={
        <>
          <Gauge label="Truck (582 boxes)" value="9,312 kg" tone="sky" />
          <Gauge label="Van (359 boxes)" value="5,744 kg" tone="sky" />
          <Gauge label="Combined Load" value={`${kg.toLocaleString()} kg`} tone={kg === 15056 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[14890, 15056, 15240, 14976].map((wt) => (
            <button
              key={wt}
              type="button"
              onClick={() => play.patch({ totalKg: wt })}
              className={`py-3 rounded-xl font-mono text-xs font-black border transition-all ${
                kg === wt
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {wt.toLocaleString()} kg {wt === 15056 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

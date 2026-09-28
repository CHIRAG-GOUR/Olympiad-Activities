"use client";

import React from "react";
import { Train, PackageCheck, Layers, Scale, Scissors, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — 3D Transport Journey Planning Simulator
   Train = 2/3, Bus = 1/4. Train - Bus = (5/12)x = 60 km => x = 144 km (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q36JourneyDistanceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ totalDistance: number }>({
    question,
    initial: { totalDistance: 144 },
    derive: (w) => {
      const d = w?.totalDistance ?? 0;
      if (d === 144) {
        return {
          value: "144 km",
          optionId: matchText(question, "144 km"),
        };
      }
      return { note: `Distance: ${d} km. Train(2/3)=${((2 / 3) * d).toFixed(1)} km, Bus(1/4)=${((1 / 4) * d).toFixed(1)} km. Difference must be 60 km.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const dist = play.world?.totalDistance ?? 144;
  const trainDist = (2 / 3) * dist;
  const busDist = (1 / 4) * dist;
  const diff = trainDist - busDist;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Transport Journey Simulator"
      mission="Mohit travels 2/3 by train and 1/4 by bus. Train distance is 60 km more than bus distance. Adjust total distance dial until difference is exactly 60 km -> 144 km."
      icon={Train}
      dim="2D"
      submitLabel="Submit Total Journey Distance (144 km / Option C)"
      hints={[
        "Let total distance = x km.",
        "Train distance = (2/3)x, Bus distance = (1/4)x.",
        "Difference: (2/3)x − (1/4)x = (5/12)x = 60 km.",
        "x = (60 × 12) / 5 = 12 × 12 = 144 km (Option C).",
      ]}
      live={
        <>
          <Gauge label="Train (2/3)" value={`${trainDist.toFixed(1)} km`} tone="sky" />
          <Gauge label="Bus (1/4)" value={`${busDist.toFixed(1)} km`} tone="indigo" />
          <Gauge label="Difference" value={`${diff.toFixed(1)} km`} tone={diff === 60 ? "emerald" : "amber"} />
          <Gauge label="Total Distance" value={`${dist} km`} tone={dist === 144 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[120, 132, 144, 160].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => play.patch({ totalDistance: d })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                dist === d
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {d} km {d === 144 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — Sticker Packaging Robot Factory
   Between 30 and 40 stickers, packs of 2, 3, 4 without remainder => LCM(2,3,4)=12 -> 36 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q37PackingRobotActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ stickerCount: number }>({
    question,
    initial: { stickerCount: 36 },
    derive: (w) => {
      const s = w?.stickerCount ?? 0;
      if (s === 36) {
        return {
          value: "36",
          optionId: matchText(question, "36"),
        };
      }
      return { note: `Stickers: ${s}. Must be divisible by 2, 3, and 4 between 30 and 40.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const count = play.world?.stickerCount ?? 36;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Sticker Packaging Robot Factory"
      mission="Deepika has between 30 and 40 stickers that divide into complete packs of 2, 3, or 4 with 0 remainder. Determine the sticker quantity (36 stickers)."
      icon={PackageCheck}
      dim="2D"
      submitLabel="Submit Sticker Count (36 / Option A)"
      hints={[
        "Quantity must be divisible by 2, 3, and 4.",
        "LCM(2, 3, 4) = 12.",
        "Multiples of 12: 12, 24, 36, 48...",
        "The only multiple between 30 and 40 is 36 stickers (Option A).",
      ]}
      live={
        <>
          <Gauge label="Pack of 2" value={count % 2 === 0 ? "0 Rem ✓" : "Leftover"} tone={count % 2 === 0 ? "emerald" : "rose"} />
          <Gauge label="Pack of 3" value={count % 3 === 0 ? "0 Rem ✓" : "Leftover"} tone={count % 3 === 0 ? "emerald" : "rose"} />
          <Gauge label="Pack of 4" value={count % 4 === 0 ? "0 Rem ✓" : "Leftover"} tone={count % 4 === 0 ? "emerald" : "rose"} />
          <Gauge label="Sticker Count" value={count} tone={count === 36 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[36, 32, 38, 34].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => play.patch({ stickerCount: n })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                count === n
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {n} {n === 36 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — Flooring & Carpet Cost Workshop
   4 rectangular carpets + 1 square carpet => Total = ₹416 (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q38FlooringCarpetActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ totalCost: number }>({
    question,
    initial: { totalCost: 416 },
    derive: (w) => {
      const c = w?.totalCost ?? 0;
      if (c === 416) {
        return {
          value: "₹416",
          optionId: matchText(question, "₹416"),
        };
      }
      return { note: `Calculated Cost: ₹${c}. Sum rectangular carpets (@ ₹6/m²) and square carpet (@ ₹8/m²).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const cost = play.world?.totalCost ?? 416;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Room-Flooring Workshop"
      mission="Lay 4 rectangular carpets (@ ₹6/m²) and 1 square carpet (@ ₹8/m²) according to blueprint dimensions: calculate the total cost (₹416)."
      icon={Layers}
      dim="2D"
      submitLabel="Submit Total Cost (₹416 / Option D)"
      hints={[
        "Calculate area of 4 rectangular carpets multiplied by ₹6/m².",
        "Calculate area of central square carpet multiplied by ₹8/m².",
        "Total combined cost = ₹416 (Option D).",
      ]}
      live={
        <>
          <Gauge label="4 Rectangles (@ ₹6)" value="Calculated" tone="sky" />
          <Gauge label="1 Square (@ ₹8)" value="Calculated" tone="indigo" />
          <Gauge label="Total Cost" value={`₹${cost}`} tone={cost === 416 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[384, 402, 396, 416].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => play.patch({ totalCost: p })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                cost === p
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              ₹{p} {p === 416 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — Digital Weighing Station
   Kiara = 34.5 kg, Uncle = 3 × 34.5 = 103.5 kg. Total = 138 kg (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q39WeightBalanceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ totalWeight: number }>({
    question,
    initial: { totalWeight: 138 },
    derive: (w) => {
      const wt = w?.totalWeight ?? 0;
      if (wt === 138) {
        return {
          value: "138 kg",
          optionId: matchText(question, "138 kg"),
        };
      }
      return { note: `Total: ${wt} kg. Kiara(34.5) + Uncle(3 × 34.5 = 103.5) = 138 kg.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const wt = play.world?.totalWeight ?? 138;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Digital Weighing Station"
      mission="Kiara weighs 34.5 kg and her uncle weighs three times as much (103.5 kg). Place both on the digital balance scale to compute total weight (138 kg)."
      icon={Scale}
      dim="2D"
      submitLabel="Submit Combined Weight (138 kg / Option C)"
      hints={[
        "Kiara's weight = 34.5 kg.",
        "Uncle's weight = 3 × 34.5 kg = 103.5 kg.",
        "Total combined weight = 34.5 + 103.5 = 138 kg (Option C).",
      ]}
      live={
        <>
          <Gauge label="Kiara" value="34.5 kg" tone="sky" />
          <Gauge label="Uncle (3×)" value="103.5 kg" tone="indigo" />
          <Gauge label="Total Scale" value={`${wt} kg`} tone={wt === 138 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[103.5, 128, 138, 142.5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => play.patch({ totalWeight: v })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                wt === v
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {v} kg {v === 138 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — Physical Rope Cutting Workshop
   Ropes: 16 m and 20 m. Max common piece length = HCF(16, 20) = 4 m (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q40RopeCuttingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ maxPieceLength: number }>({
    question,
    initial: { maxPieceLength: 4 },
    derive: (w) => {
      const len = w?.maxPieceLength ?? 0;
      if (len === 4) {
        return {
          value: "4 m",
          optionId: matchText(question, "4 m"),
        };
      }
      return { note: `Cutter set to: ${len} m. Piece length must divide both 16 m and 20 m.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const len = play.world?.maxPieceLength ?? 4;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Physical Rope-Cutting Workshop"
      mission="Cut ropes of length 16 m and 20 m into equal pieces with no remainder left over: find the maximum common piece length (HCF = 4 m)."
      icon={Scissors}
      dim="2D"
      submitLabel="Cut & Submit Length (4 m / Option B)"
      hints={[
        "Maximum piece length with zero leftover = HCF of 16 and 20.",
        "Factors of 16: 1, 2, 4, 8, 16.",
        "Factors of 20: 1, 2, 4, 5, 10, 20.",
        "Highest Common Factor (HCF) = 4 m (Option B).",
      ]}
      live={
        <>
          <Gauge label="Rope A (16 m)" value={`${16 / len} pieces`} tone={16 % len === 0 ? "emerald" : "rose"} />
          <Gauge label="Rope B (20 m)" value={`${20 / len} pieces`} tone={20 % len === 0 ? "emerald" : "rose"} />
          <Gauge label="HCF Piece Length" value={`${len} m`} tone={len === 4 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[2, 4, 5, 8].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => play.patch({ maxPieceLength: m })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                len === m
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {m} m {m === 4 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q46 · 3D Multi-Stage Number Reactor ((48*3 - 20)/2 = 62) (C) [3 Marks]
// ============================================================================
export function PlayQ46({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { history: number[]; currentStage: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { history: [48], currentStage: 0 },
    derive(w) {
      if (w.currentStage < 3) return { note: "Execute all 3 stages" };
      const finalVal = w.history[w.history.length - 1];
      if (finalVal !== 62) return { note: "Invalid reactor computation" };
      return {
        value: "62",
        optionId: "C",
      };
    },
  });

  const step1 = () => play.set({ history: [48, 144], currentStage: 1 });
  const step2 = () => play.set({ history: [48, 144, 124], currentStage: 2 });
  const step3 = () => play.set({ history: [48, 144, 124, 62], currentStage: 3 });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Input number = 48.",
        "Stage 1 (×3): 48 × 3 = 144.",
        "Stage 2 (−20): 144 − 20 = 124.",
        "Stage 3 (÷2): 124 ÷ 2 = 62.",
        "Final reactor output = 62.",
      ]}
      title="3D Multi-Stage Math Reactor"
      badge="Q46 · Achievers Section · 3 Marks"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh castShadow>
            <cylinderGeometry args={[1.5, 1.5, 2.5, 32]} />
            <meshStandardMaterial color="#312e81" metalness={0.7} roughness={0.2} />
          </mesh>
        </World3D>

        <Bay title="Sequential Processing Chambers">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="font-bold text-slate-500 block">Input</span>
              <span className="text-lg font-black text-indigo-950">48</span>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="font-bold text-blue-700 block">× 3 Chamber</span>
              <span className="text-lg font-black text-blue-950">
                {play.world.currentStage >= 1 ? "144" : "—"}
              </span>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-700 block">− 20 Chamber</span>
              <span className="text-lg font-black text-amber-950">
                {play.world.currentStage >= 2 ? "124" : "—"}
              </span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-700 block">÷ 2 Chamber</span>
              <span className="text-lg font-black text-emerald-950">
                {play.world.currentStage >= 3 ? "62" : "—"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={step1}
              disabled={play.world.currentStage >= 1}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 disabled:opacity-40"
            >
              1. Multiply by 3 (→ 144)
            </button>
            <button
              type="button"
              onClick={step2}
              disabled={play.world.currentStage !== 1}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl border border-amber-200 disabled:opacity-40"
            >
              2. Subtract 20 (→ 124)
            </button>
            <button
              type="button"
              onClick={step3}
              disabled={play.world.currentStage !== 2}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md disabled:opacity-40"
            >
              3. Divide by 2 (→ 62)
            </button>
          </div>
        </Bay>

        <Gauge
          label="Reactor Final Holographic Output"
          value={
            play.world.currentStage === 3
              ? "Reactor Output: 62 (Option C)"
              : "Execute all 3 chambers in order"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q47 · Geometry Cutting Workshop (18*10 - 4*5 = 180 - 20 = 160 cm²) (B) [3 Marks]
// ============================================================================
export function PlayQ47({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { cutDone: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { cutDone: false },
    derive(w) {
      if (!w.cutDone) return { note: "Execute corner cut" };
      return {
        value: "160 cm²",
        optionId: "B",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Total original area of rectangle = 18 cm × 10 cm = 180 cm².",
        "Area of removed corner = 4 cm × 5 cm = 20 cm².",
        "Remaining area = 180 cm² − 20 cm² = 160 cm².",
      ]}
      title="3D Geometry Cutting Workshop"
      badge="Q47 · Achievers Section · 3 Marks"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.6, 2.0]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {play.world.cutDone && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.3, 0.01, 0.5]}>
              <planeGeometry args={[1.0, 1.0]} />
              <meshStandardMaterial color="#f1f5f9" />
            </mesh>
          )}
        </World3D>

        <Bay title="Corner Cut Dimensions (18×10 with 4×5 removed)">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 block">Original Area</span>
              <span className="text-xl font-black text-indigo-950">18 × 10 = 180 cm²</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-xs font-bold text-rose-800 block">Removed Corner</span>
              <span className="text-xl font-black text-rose-950">4 × 5 = 20 cm²</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-800 block">Remaining Area</span>
              <span className="text-xl font-black text-emerald-950">180 − 20 = 160 cm²</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ cutDone: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2"
            >
              ✂️ Execute Precision Guided Corner Cut
            </button>
          </div>
        </Bay>

        <Gauge
          label="Remaining Metal Area"
          value={
            play.derived.value
              ? "Remaining Area: 160 cm² (Option B)"
              : "Execute corner cut to calculate area"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q48 · Transparent Water Tank ((3/10)C = 12L -> C = 40 L) (C) [3 Marks]
// ============================================================================
export function PlayQ48({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { initialFrac: number; addedLitres: number; finalFrac: number; calculated: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { initialFrac: 0.6, addedLitres: 12, finalFrac: 0.9, calculated: false },
    derive(w) {
      if (!w.calculated) return { note: "Calculate capacity" };
      return {
        value: "40 L",
        optionId: "C",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Initial tank fraction = 3/5 = 6/10.",
        "Final tank fraction = 9/10.",
        "Fraction increase = 9/10 − 6/10 = 3/10 of capacity.",
        "3/10 of Capacity = 12 Litres.",
        "Full Capacity = 12 × (10 / 3) = 4 × 10 = 40 Litres.",
      ]}
      title="3D Transparent Water Tank Investigation"
      badge="Q48 · Achievers Section · 3 Marks"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1, 1, 3.2, 32]} />
            <meshStandardMaterial color="#38bdf8" opacity={0.3} transparent />
          </mesh>
          <mesh position={[0, play.world.calculated ? 0.3 : -0.3, 0]}>
            <cylinderGeometry args={[0.96, 0.96, play.world.calculated ? 2.5 : 1.6, 32]} />
            <meshStandardMaterial color="#0284c7" opacity={0.8} transparent />
          </mesh>
        </World3D>

        <Bay title="Tank Calibrations & Addition Pump">
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl">
              <span className="font-bold text-slate-500 block">Initial Level</span>
              <span className="text-base font-black text-sky-950">3/5 = 6/10</span>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="font-bold text-blue-700 block">+ Added Water</span>
              <span className="text-base font-black text-blue-950">+12 Litres</span>
            </div>
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="font-bold text-indigo-700 block">Final Level</span>
              <span className="text-base font-black text-indigo-950">9/10</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ ...play.world, calculated: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2"
            >
              💧 Pump 12L & Calculate Full Capacity
            </button>
          </div>
        </Bay>

        <Gauge
          label="Total Tank Capacity"
          value={
            play.derived.value
              ? "Tank Capacity: 40 Litres (Option C)"
              : "Pump 12L to derive total capacity"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q49 · 3D Number Vault (0,2,4,6,8 -> Largest div by 3 & 8 = 8640) (A) [3 Marks]
// ============================================================================
export function PlayQ49({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { digits: (number | null)[] };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { digits: [null, null, null, null] },
    derive(w) {
      const d = w.digits;
      if (d.some((x) => x === null)) return { note: "Fill 4 digit blocks" };
      const num = Number(d.join(""));
      const sum = d.reduce((a, b) => a! + b!, 0)!;
      const isDiv3 = sum % 3 === 0;
      const last3 = Number(d.slice(1).join(""));
      const isDiv8 = last3 % 8 === 0;

      if (!isDiv3 || !isDiv8 || num !== 8640) return { note: "Number must be largest and divisible by 3 and 8" };

      return {
        value: "8640",
        optionId: "A",
      };
    },
  });

  const available = [0, 2, 4, 6, 8];

  const setSlot = (slotIdx: number, val: number) => {
    const next = [...play.world.digits];
    const prevIdx = next.indexOf(val);
    if (prevIdx !== -1) next[prevIdx] = null;
    next[slotIdx] = val;
    play.set({ digits: next });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Available digits: 0, 2, 4, 6, 8 (each used at most once in a 4-digit number).",
        "Divisibility by 3: Sum of digits must be divisible by 3.",
        "Divisibility by 8: Number formed by last 3 digits must be divisible by 8.",
        "To make it as large as possible, start with 8 in thousands place, then 6 in hundreds place.",
        "8640: Sum = 8+6+4+0 = 18 (divisible by 3). Last 3 digits = 640 ÷ 8 = 80 (divisible by 8).",
        "Largest valid number = 8640.",
      ]}
      title="3D Number Vault Security Game"
      badge="Q49 · Achievers Section · 3 Marks"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh castShadow>
            <cylinderGeometry args={[2, 2, 0.4, 32]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
          </mesh>
        </World3D>

        <Bay title="Vault Combination Slots [Thousands, Hundreds, Tens, Units]">
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((slotIdx) => (
              <div key={slotIdx} className="p-3 bg-white border-2 border-indigo-100 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-500">Slot {slotIdx + 1}</span>
                <div className="text-3xl font-black text-indigo-950 my-2 font-mono">
                  {play.world.digits[slotIdx] !== null ? play.world.digits[slotIdx] : "—"}
                </div>
              </div>
            ))}
          </div>
        </Bay>

        <Bay title="Available Magnetic Digit Blocks [0, 2, 4, 6, 8]">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {available.map((d) => (
              <div key={d} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-black text-lg flex items-center justify-center">
                  {d}
                </span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSlot(slot, d)}
                      className={`w-7 h-7 rounded text-xs font-bold ${
                        play.world.digits[slot] === d ? "bg-indigo-600 text-white" : "bg-white text-slate-700 border"
                      }`}
                    >
                      S{slot + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => play.set({ digits: [8, 6, 4, 0] })}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Set 8640
            </button>
          </div>
        </Bay>

        <Gauge
          label="Vault Security Verification"
          value={
            play.derived.value
              ? "8640 unlocks vault (Largest, Divisible by 3 & 8) → Option A"
              : "Arrange digits to form largest 4-digit number divisible by 3 and 8"
          }
          tone={play.derived.optionId === "A" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q50 · Master Builder Composite Shape (Area=250 cm², Perimeter=68 cm) (A) [3 Marks]
// ============================================================================
export function PlayQ50({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { cornerCutApplied: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { cornerCutApplied: false },
    derive(w) {
      if (!w.cornerCutApplied) return { note: "Apply corner cut" };
      return {
        value: "250 cm² and 68 cm",
        optionId: "A",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Initial rectangle: 20 cm × 14 cm.",
        "Initial area = 20 × 14 = 280 cm².",
        "Corner cut area = 6 cm × 5 cm = 30 cm².",
        "Remaining area = 280 − 30 = 250 cm².",
        "Perimeter analysis: Removing a corner replaces length 6 and width 5 with the same indented lengths 6 and 5.",
        "Perimeter remains = 2 × (20 + 14) = 68 cm.",
        "Final measurements = 250 cm² and 68 cm.",
      ]}
      title="Flagship 3D Master Builder Simulation"
      badge="Q50 · Master Achiever · 3 Marks"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.0, 2.8]} />
            <meshStandardMaterial color="#4f46e5" metalness={0.3} roughness={0.4} />
          </mesh>
          {play.world.cornerCutApplied && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.4, 0.01, 0.9]}>
              <planeGeometry args={[1.2, 1.0]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          )}
        </World3D>

        <Bay title="Blueprint Recalculation Engine">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 block">Remaining Polygon Area</span>
              <span className="text-2xl font-black text-indigo-950 font-mono">
                {play.world.cornerCutApplied ? "280 − 30 = 250 cm²" : "280 cm²"}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 block">Polygon Perimeter</span>
              <span className="text-2xl font-black text-emerald-950 font-mono">
                {play.world.cornerCutApplied ? "68 cm" : "68 cm"}
              </span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ cornerCutApplied: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2"
            >
              🏗️ Cut 6×5 cm Corner & Recalculate {`{Area, Perimeter}`}
            </button>
          </div>
        </Bay>

        <Gauge
          label="Master Builder Results"
          value={
            play.derived.value
              ? "Area: 250 cm² and Perimeter: 68 cm (Option A)"
              : "Execute corner cut to generate area and perimeter"
          }
          tone={play.derived.optionId === "A" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

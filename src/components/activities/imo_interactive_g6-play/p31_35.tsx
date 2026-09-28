"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q31 · Ratio Marble Mixer (3:5 with total 64 -> Blue = 40) (C)
// ============================================================================
export function PlayQ31({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { red: number; blue: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { red: 24, blue: 40 },
    derive(w) {
      if (w.red + w.blue !== 64 || w.red / w.blue !== 3 / 5) return { note: "Configure 3:5 ratio with 64 total" };
      return {
        value: String(w.blue),
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
        "Ratio Red : Blue = 3 : 5.",
        "Total ratio units = 3 + 5 = 8 parts.",
        "Value of 1 part = 64 ÷ 8 = 8 marbles.",
        "Blue marbles = 5 parts × 8 = 40 marbles.",
        "Red marbles = 3 parts × 8 = 24 marbles.",
      ]}
      title="3D Marble Mixing Factory"
      badge="Q31 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <group position={[-1.5, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.6, 0.6, 3, 16]} />
              <meshStandardMaterial color="#ef4444" opacity={0.7} transparent />
            </mesh>
          </group>

          <group position={[1.5, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.6, 0.6, 3, 16]} />
              <meshStandardMaterial color="#3b82f6" opacity={0.7} transparent />
            </mesh>
          </group>
        </World3D>

        <Bay title="Dispensers Configuration">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
              <span className="text-xs font-bold text-red-900 block">Red Marbles (3 Parts)</span>
              <span className="text-2xl font-black text-red-950">{play.world.red}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-900 block">Blue Marbles (5 Parts)</span>
              <span className="text-2xl font-black text-blue-950">{play.world.blue}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ red: 24, blue: 40 })}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs"
            >
              Mix 3:5 Ratio (Total 64)
            </button>
          </div>
        </Bay>

        <Gauge
          label="Blue Marbles Count"
          value={
            play.world.blue === 40
              ? "40 Blue Marbles (5 × 8 = 40) → Option C"
              : `Current Blue Count: ${play.world.blue}`
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q32 · Unit Conversion Conveyor (3.5 m = 350 cm) (B)
// ============================================================================
export function PlayQ32({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { convertedVal: number | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { convertedVal: null },
    derive(w) {
      if (!w.convertedVal) return { note: "Convert 3.5 m to cm" };
      let opt = "A";
      if (w.convertedVal === 35) opt = "A";
      else if (w.convertedVal === 350) opt = "B";
      else if (w.convertedVal === 3500) opt = "C";
      else if (w.convertedVal === 0.35) opt = "D";

      return {
        value: `${w.convertedVal} cm`,
        optionId: opt,
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "1 metre = 100 centimetres.",
        "3.5 metres = 3.5 × 100 centimetres.",
        "3.5 × 100 = 350 cm.",
      ]}
      title="3D Measurement Conveyor"
      badge="Q32 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.5, 0.2, 0.4]} />
            <meshStandardMaterial color="#eab308" metalness={0.4} roughness={0.3} />
          </mesh>
        </World3D>

        <Bay title="Convert 3.5 m into Centimetres">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[35, 350, 3500, 0.35].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => play.set({ convertedVal: val })}
                className={`py-3 rounded-xl border-2 font-black text-lg transition-all ${
                  play.world.convertedVal === val
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md scale-105"
                    : "border-indigo-100 bg-white text-indigo-950 hover:bg-indigo-50"
                }`}
              >
                {val} cm
              </button>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Conversion Output"
          value={
            play.world.convertedVal === 350
              ? "3.5 m = 350 cm (Option B)"
              : play.world.convertedVal
              ? `${play.world.convertedVal} cm`
              : "Select the correct centimetre conversion"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q33 · Data Observatory (Average of 14, 18, 10, 22 = 16) (C)
// ============================================================================
export function PlayQ33({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { avgCalculated: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { avgCalculated: false },
    derive(w) {
      if (!w.avgCalculated) return { note: "Compute average" };
      return {
        value: "16",
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
        "Formula: Average = Sum of observations ÷ Total number of observations.",
        "Sum = 14 + 18 + 10 + 22 = 64.",
        "Count = 4.",
        "Average = 64 ÷ 4 = 16.",
      ]}
      title="3D Data Observatory"
      badge="Q33 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          {[-2.1, -0.7, 0.7, 2.1].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh castShadow>
                <octahedronGeometry args={[0.7, 0]} />
                <meshStandardMaterial color="#6366f1" roughness={0.2} metalness={0.8} />
              </mesh>
            </group>
          ))}
        </World3D>

        <Bay title="Floating Data Crystals [14, 18, 10, 22]">
          <div className="grid grid-cols-4 gap-3 text-center">
            {[14, 18, 10, 22].map((v, i) => (
              <div key={i} className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <span className="text-xl font-black text-indigo-950">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ avgCalculated: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2"
            >
              📊 Compute Average: (14 + 18 + 10 + 22) ÷ 4
            </button>
          </div>
        </Bay>

        <Gauge
          label="Computed Average"
          value={
            play.derived.value
              ? "Average = 64 ÷ 4 = 16 (Option C)"
              : "Combine data crystals and compute average"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q34 · Decimal Fuel Tank (12.75 + 8.60 - 3.25 = 18.10) (B)
// ============================================================================
export function PlayQ34({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { currentFuel: number; step: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { currentFuel: 12.75, step: 0 },
    derive(w) {
      if (w.step < 2) return { note: "Apply addition and subtraction" };
      return {
        value: "18.10",
        optionId: "B",
      };
    },
  });

  const addFuel = () => play.set({ currentFuel: 21.35, step: 1 });
  const pumpOut = () => play.set({ currentFuel: 18.1, step: 2 });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Step 1: Start at 12.75 units.",
        "Step 2: Add 8.60 units: 12.75 + 8.60 = 21.35 units.",
        "Step 3: Subtract 3.25 units: 21.35 − 3.25 = 18.10 units.",
      ]}
      title="3D Spacecraft Fuel Control Panel"
      badge="Q34 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 2, 6], fov: 42 }}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 3, 24]} />
            <meshStandardMaterial color="#0284c7" opacity={0.6} transparent />
          </mesh>
        </World3D>

        <Bay title="Fuel Loading & Extraction Valves">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={addFuel}
              disabled={play.world.step >= 1}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 disabled:opacity-40"
            >
              + Load 8.60 Units (→ 21.35)
            </button>
            <button
              type="button"
              onClick={pumpOut}
              disabled={play.world.step !== 1}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl border border-rose-200 disabled:opacity-40"
            >
              − Pump Out 3.25 Units (→ 18.10)
            </button>
          </div>
        </Bay>

        <Gauge
          label="Fuel Sensor Level"
          value={
            play.world.step === 2
              ? "Final Level: 18.10 Units (Option B)"
              : `Current Level: ${play.world.currentFuel.toFixed(2)} Units`
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q35 · Pattern Power Plant (2, 5, 11, 23, ? -> *2+1 -> 47) (D)
// ============================================================================
export function PlayQ35({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { generatedValue: number | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { generatedValue: null },
    derive(w) {
      if (!w.generatedValue) return { note: "Generate 5th power cell" };
      let opt = "A";
      if (w.generatedValue === 35) opt = "A";
      else if (w.generatedValue === 42) opt = "B";
      else if (w.generatedValue === 46) opt = "C";
      else if (w.generatedValue === 47) opt = "D";

      return {
        value: String(w.generatedValue),
        optionId: opt,
      };
    },
  });

  const cells = [
    { v: 2, rule: "" },
    { v: 5, rule: "2 × 2 + 1" },
    { v: 11, rule: "5 × 2 + 1" },
    { v: 23, rule: "11 × 2 + 1" },
    { v: play.world.generatedValue ?? "?", rule: "23 × 2 + 1" },
  ];

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Observe the pattern progression:",
        "2 × 2 + 1 = 5",
        "5 × 2 + 1 = 11",
        "11 × 2 + 1 = 23",
        "Next number = 23 × 2 + 1 = 46 + 1 = 47.",
      ]}
      title="3D Pattern Power Plant"
      badge="Q35 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.9, 0.9, 0.9]} />
                <meshStandardMaterial color={i === 4 ? "#10b981" : "#4f46e5"} />
              </mesh>
            </group>
          ))}
        </World3D>

        <Bay title="Power Cell Progression (Rule: × 2 + 1)">
          <div className="grid grid-cols-5 gap-2 text-center">
            {cells.map((c, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border ${
                  i === 4 ? "border-emerald-400 bg-emerald-50" : "border-indigo-100 bg-white"
                }`}
              >
                <span className="text-xl font-black text-indigo-950 block">{c.v}</span>
                <span className="text-[10px] font-bold text-slate-500">{c.rule}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Generate 5th Energy Cell Value:
            </span>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {[35, 42, 46, 47].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => play.set({ generatedValue: val })}
                  className={`py-2 rounded-xl font-black text-sm transition-all ${
                    play.world.generatedValue === val
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </Bay>

        <Gauge
          label="Next Energy Cell Value"
          value={
            play.world.generatedValue === 47
              ? "Next Value = 47 (Option D)"
              : play.world.generatedValue
              ? `Generated: ${play.world.generatedValue}`
              : "Apply rule (23 × 2 + 1) to generate next value"
          }
          tone={play.derived.optionId === "D" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q41 · Smart Gym Time Tracker (17:35 to 19:10 = 1 h 35 min) (B)
// ============================================================================
export function PlayQ41({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { start: string; end: string; measured: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { start: "17:35", end: "19:10", measured: false },
    derive(w) {
      if (!w.measured) return { note: "Calculate elapsed workout duration" };
      return {
        value: "1 h 35 min",
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
        "From 17:35 to 18:00 = 25 minutes.",
        "From 18:00 to 19:00 = 1 hour (60 minutes).",
        "From 19:00 to 19:10 = 10 minutes.",
        "Total duration = 1 hour + (25 + 10) minutes = 1 hour 35 minutes.",
      ]}
      title="3D Smart Gym Time Tracker"
      badge="Q41 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh castShadow>
            <cylinderGeometry args={[2, 2, 0.4, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </World3D>

        <Bay title="Workout Interval Record">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 block">Check-In Time</span>
              <span className="text-2xl font-black text-indigo-950 font-mono">17:35</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 block">Check-Out Time</span>
              <span className="text-2xl font-black text-emerald-950 font-mono">19:10</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ ...play.world, measured: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2"
            >
              ⏱️ Calculate Elapsed Workout Duration
            </button>
          </div>
        </Bay>

        <Gauge
          label="Elapsed Workout Time"
          value={
            play.derived.value
              ? "Duration: 1 h 35 min (Option B)"
              : "Calculate duration between 17:35 and 19:10"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q42 · Character Weight Station (Sneha 18.75 + 2.40 = Sakshi 21.15 kg) (B)
// ============================================================================
export function PlayQ42({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { sneha: number; added: number; calculated: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { sneha: 18.75, added: 2.4, calculated: false },
    derive(w) {
      if (!w.calculated) return { note: "Calculate Sakshi's weight" };
      return {
        value: "21.15 kg",
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
        "Sneha's weight = 18.75 kg.",
        "Sakshi is 2.40 kg heavier than Sneha.",
        "Sakshi's weight = 18.75 + 2.40 = 21.15 kg.",
      ]}
      title="3D Character Weighing Station"
      badge="Q42 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <group position={[-1.5, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[1, 1, 0.2, 24]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
          </group>
          <group position={[1.5, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[1, 1, 0.2, 24]} />
              <meshStandardMaterial color="#8b5cf6" />
            </mesh>
          </group>
        </World3D>

        <Bay title="Scale Calibrations">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl">
              <span className="text-xs font-bold text-pink-900 block">Sneha's Scale</span>
              <span className="text-2xl font-black text-pink-950 font-mono">18.75 kg</span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="text-xs font-bold text-purple-900 block">Weight Offset Block</span>
              <span className="text-2xl font-black text-purple-950 font-mono">+2.40 kg</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ ...play.world, calculated: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md"
            >
              ⚖️ Compute Sakshi's Weight: 18.75 + 2.40 kg
            </button>
          </div>
        </Bay>

        <Gauge
          label="Sakshi's Computed Weight"
          value={
            play.derived.value
              ? "Sakshi's Weight: 21.15 kg (Option B)"
              : "Apply weight offset to find Sakshi's weight"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q43 · Tile Factory ((30*20)/(5*5) = 600/25 = 24 tiles) (B)
// ============================================================================
export function PlayQ43({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { tileCount: number | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { tileCount: null },
    derive(w) {
      if (!w.tileCount) return { note: "Calculate required tiles" };
      let opt = "A";
      if (w.tileCount === 20) opt = "A";
      else if (w.tileCount === 24) opt = "B";
      else if (w.tileCount === 30) opt = "C";
      else if (w.tileCount === 36) opt = "D";

      return {
        value: `${w.tileCount} Tiles`,
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
        "Floor area = Length × Width = 30 cm × 20 cm = 600 cm².",
        "One tile area = Side × Side = 5 cm × 5 cm = 25 cm².",
        "Number of tiles = Floor area ÷ Tile area = 600 ÷ 25 = 24 tiles.",
        "(Alternatively: (30 ÷ 5) × (20 ÷ 5) = 6 × 4 = 24 tiles).",
      ]}
      title="3D Tile-Laying Construction Game"
      badge="Q43 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.6, 2.4]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
        </World3D>

        <Bay title="Calculate Number of 5 cm × 5 cm Tiles for 30 cm × 20 cm Floor">
          <div className="grid grid-cols-4 gap-3">
            {[20, 24, 30, 36].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => play.set({ tileCount: count })}
                className={`py-3 rounded-xl border-2 font-black text-lg transition-all ${
                  play.world.tileCount === count
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md scale-105"
                    : "border-indigo-100 bg-white text-indigo-950 hover:bg-indigo-50"
                }`}
              >
                {count} Tiles
              </button>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Tiles Required to Cover Floor"
          value={
            play.world.tileCount === 24
              ? "24 Tiles Required (600 ÷ 25 = 24) → Option B"
              : play.world.tileCount
              ? `${play.world.tileCount} Tiles`
              : "Select required tiles"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q44 · Fruit Warehouse (1350 + 875 + 625 = 2850) (C)
// ============================================================================
export function PlayQ44({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { total: number | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { total: null },
    derive(w) {
      if (!w.total) return { note: "Calculate total fruits" };
      let opt = "A";
      if (w.total === 2650) opt = "A";
      else if (w.total === 2750) opt = "B";
      else if (w.total === 2850) opt = "C";
      else if (w.total === 2950) opt = "D";

      return {
        value: `${w.total.toLocaleString()}`,
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
        "Apples = 1,350",
        "Oranges = 875",
        "Watermelons = 625",
        "Oranges + Watermelons = 875 + 625 = 1,500.",
        "Total fruit = 1,350 + 1,500 = 2,850.",
      ]}
      title="3D Automated Fruit Warehouse"
      badge="Q44 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          {[-1.8, 0, 1.8].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} castShadow>
              <boxGeometry args={[1.2, 0.8, 1]} />
              <meshStandardMaterial color={i === 0 ? "#ef4444" : i === 1 ? "#f97316" : "#10b981"} />
            </mesh>
          ))}
        </World3D>

        <Bay title="Warehouse Fruit Inventory">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-xs font-bold text-red-800 block">🍎 Apples</span>
              <span className="text-xl font-black text-red-950">1,350</span>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <span className="text-xs font-bold text-orange-800 block">🍊 Oranges</span>
              <span className="text-xl font-black text-orange-950">875</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-800 block">🍉 Watermelons</span>
              <span className="text-xl font-black text-emerald-950">625</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Total Fruit in Warehouse:
            </span>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {[2650, 2750, 2850, 2950].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => play.set({ total: val })}
                  className={`py-2 rounded-xl font-black text-sm transition-all ${
                    play.world.total === val
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  {val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </Bay>

        <Gauge
          label="Total Fruit Count"
          value={
            play.world.total === 2850
              ? "2,850 Fruits Altogether (Option C)"
              : play.world.total
              ? `${play.world.total.toLocaleString()} Fruits`
              : "Select sum of all inventory"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q45 · Synchronised Steps (LCM of 48, 60, 72 = 720 cm) (C)
// ============================================================================
export function PlayQ45({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { distance: number | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { distance: null },
    derive(w) {
      if (!w.distance) return { note: "Calculate LCM distance" };
      let opt = "A";
      if (w.distance === 240) opt = "A";
      else if (w.distance === 360) opt = "B";
      else if (w.distance === 720) opt = "C";
      else if (w.distance === 1440) opt = "D";

      return {
        value: `${w.distance} cm`,
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
        "Step lengths: 48 cm, 60 cm, 72 cm.",
        "48 = 2⁴ × 3",
        "60 = 2² × 3 × 5",
        "72 = 2³ × 3²",
        "LCM = 2⁴ × 3² × 5 = 16 × 9 × 5 = 720 cm.",
      ]}
      title="3D Robot March Synchronisation"
      badge="Q45 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          {[-2, 0, 2].map((x, i) => (
            <mesh key={i} position={[x, -0.1, 0]}>
              <boxGeometry args={[1.2, 0.1, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          ))}
        </World3D>

        <Bay title="Robot Step Lengths [48 cm, 60 cm, 72 cm]">
          <div className="grid grid-cols-4 gap-3">
            {[240, 360, 720, 1440].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => play.set({ distance: dist })}
                className={`py-3 rounded-xl border-2 font-black text-lg transition-all ${
                  play.world.distance === dist
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md scale-105"
                    : "border-indigo-100 bg-white text-indigo-950 hover:bg-indigo-50"
                }`}
              >
                {dist} cm
              </button>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Minimum Synchronized Distance (LCM)"
          value={
            play.world.distance === 720
              ? "LCM(48, 60, 72) = 720 cm (Option C)"
              : play.world.distance
              ? `${play.world.distance} cm`
              : "Select the minimum common distance"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

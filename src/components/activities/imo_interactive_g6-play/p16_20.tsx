"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q16 · Fraction Pizza Laboratory (3/4 of 28 = 21) (C)
// ============================================================================
export function PlayQ16({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { numerator: number; denominator: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { numerator: 1, denominator: 4 },
    derive(w) {
      if (w.numerator !== 3 || w.denominator !== 4) return { note: "Select 3/4 fraction" };
      const val = (w.numerator / w.denominator) * 28;
      let opt = "A";
      if (val === 18) opt = "A";
      else if (val === 20) opt = "B";
      else if (val === 21) opt = "C";
      else if (val === 24) opt = "D";

      return {
        value: String(val),
        optionId: opt,
      };
    },
  });

  const selectedCount = (play.world.numerator / play.world.denominator) * 28;

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Total slices in pizza = 28.",
        "1/4 of 28 = 28 ÷ 4 = 7 slices.",
        "3/4 of 28 = 3 × 7 = 21 slices.",
      ]}
      title="3D Fraction Pizza Laboratory"
      badge="Q16 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <cylinderGeometry args={[2.5, 2.5, 0.2, 28]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} />
          </mesh>
        </World3D>

        <Bay title="Fraction Control Rings">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-1">Fraction Rings (Numerator)</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => play.set({ ...play.world, numerator: num })}
                      className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                        play.world.numerator === num
                          ? "bg-indigo-600 text-white shadow-md scale-105"
                          : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                      }`}
                    >
                      {num}/4
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
              <span className="text-xs font-bold text-indigo-900">
                Formula: ({play.world.numerator}/4) × 28 = <strong className="text-lg">{selectedCount} Slices</strong>
              </span>
            </div>
          </div>
        </Bay>

        <Gauge
          label="Calculated Slice Quantity"
          value={
            play.world.numerator === 3
              ? `3/4 of 28 = 21 slices (Option ${play.derived.optionId})`
              : `Current: ${play.world.numerator}/4 of 28 = ${selectedCount} slices`
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q17 · Gear Synchronisation (LCM of 12 & 18 = 36) (C)
// ============================================================================
export function PlayQ17({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { currentRotation: number; synced: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { currentRotation: 0, synced: false },
    derive(w) {
      if (w.currentRotation !== 36) return { note: "Align gears to LCM" };
      return {
        value: "36",
        optionId: "C",
      };
    },
  });

  const stepRot = (delta: number) => {
    const next = Math.max(0, Math.min(60, play.world.currentRotation + delta));
    play.set({ currentRotation: next, synced: next === 36 });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "First gear completes full cycles at multiples of 12: 12, 24, 36, 48...",
        "Second gear completes full cycles at multiples of 18: 18, 36, 54...",
        "Lowest Common Multiple (LCM) of 12 and 18 is 36.",
        "Both gears align back at starting position after 36 rotations.",
      ]}
      title="3D Industrial Gear Synchronisation"
      badge="Q17 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <group position={[-1.6, 0, 0]} rotation={[0, 0, (play.world.currentRotation / 12) * Math.PI * 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[1.2, 1.2, 0.3, 12]} />
              <meshStandardMaterial color="#6366f1" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>

          <group position={[1.6, 0, 0]} rotation={[0, 0, -(play.world.currentRotation / 18) * Math.PI * 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[1.7, 1.7, 0.3, 18]} />
              <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        </World3D>

        <Bay title="Gear Cycle Rotation Controls">
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl font-black text-indigo-950 font-mono bg-indigo-50 px-6 py-2 rounded-2xl border-2 border-indigo-200">
              Rotations: {play.world.currentRotation}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepRot(-6)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                −6 Rotations
              </button>
              <button
                type="button"
                onClick={() => stepRot(6)}
                className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-xs font-bold"
              >
                +6 Rotations
              </button>
              <button
                type="button"
                onClick={() => play.set({ currentRotation: 36, synced: true })}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Align to 36
              </button>
            </div>
          </div>
        </Bay>

        <Gauge
          label="Synchronization Status"
          value={
            play.world.currentRotation === 36
              ? "Both Gears Synchronized at 36 Rotations (Option C)"
              : `Gear 1: ${(play.world.currentRotation / 12).toFixed(2)} cycles | Gear 2: ${(play.world.currentRotation / 18).toFixed(2)} cycles`
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q18 · Crystal Divider Machine (HCF of 84 & 126 = 42) (C)
// ============================================================================
export function PlayQ18({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { cutSize: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { cutSize: 14 },
    derive(w) {
      if (w.cutSize !== 42) return { note: "Find maximum common divisor" };
      return {
        value: "42",
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
        "Factors of 84: 1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84.",
        "Factors of 126: 1, 2, 3, 6, 7, 9, 14, 18, 21, 42, 63, 126.",
        "Common factors include 14, 21, 42.",
        "The Highest Common Factor (HCF) is 42 (84 = 42 × 2 and 126 = 42 × 3).",
      ]}
      title="3D Crystal Cutting Machine"
      badge="Q18 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <group position={[-1.5, 0, 0]}>
            <mesh castShadow>
              <octahedronGeometry args={[1.2, 0]} />
              <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.7} />
            </mesh>
          </group>

          <group position={[1.5, 0, 0]}>
            <mesh castShadow>
              <octahedronGeometry args={[1.6, 0]} />
              <meshStandardMaterial color="#06b6d4" roughness={0.1} metalness={0.7} />
            </mesh>
          </group>
        </World3D>

        <Bay title="Select Common Divisor Cutting Size">
          <div className="grid grid-cols-4 gap-3">
            {[14, 21, 42, 63].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => play.set({ cutSize: val })}
                className={`py-3 rounded-xl border-2 font-black text-lg transition-all ${
                  play.world.cutSize === val
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md scale-105"
                    : "border-indigo-100 bg-white text-indigo-950 hover:bg-indigo-50"
                }`}
              >
                {val}
                <div className="text-[10px] font-normal opacity-80">
                  {84 % val === 0 && 126 % val === 0 ? "Exact Divisor" : "Has Remainder"}
                </div>
              </button>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Highest Common Factor (HCF)"
          value={
            play.world.cutSize === 42
              ? "HCF = 42 (84 ÷ 42 = 2, 126 ÷ 42 = 3) → Option C"
              : `Current test divisor: ${play.world.cutSize}`
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q19 · Rounding Roller Coaster (761->800, 483->500, Diff = 300) (B)
// ============================================================================
export function PlayQ19({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { r483: number; r761: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { r483: 483, r761: 761 },
    derive(w) {
      if (w.r483 !== 500 || w.r761 !== 800) return { note: "Snap both numbers to nearest hundred" };
      return {
        value: "300",
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
        "483 rounded to the nearest hundred: since tens digit 8 ≥ 5, it rounds UP to 500.",
        "761 rounded to the nearest hundred: since tens digit 6 ≥ 5, it rounds UP to 800.",
        "Estimated difference = 800 − 500 = 300.",
      ]}
      title="Rounding Roller Coaster"
      badge="Q19 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <group position={[-1.8, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.8, 1]} />
              <meshStandardMaterial color="#f43f5e" />
            </mesh>
          </group>

          <group position={[1.8, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.8, 1]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
          </group>
        </World3D>

        <Bay title="Snap Numbers to Nearest Hundred Station">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white border border-indigo-100 rounded-xl flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Cart A: 483</span>
              <div className="text-2xl font-black text-indigo-950">{play.world.r483}</div>
              <button
                type="button"
                onClick={() => play.set({ ...play.world, r483: 500 })}
                className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs"
              >
                Snap 483 → 500
              </button>
            </div>

            <div className="p-3 bg-white border border-indigo-100 rounded-xl flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Cart B: 761</span>
              <div className="text-2xl font-black text-indigo-950">{play.world.r761}</div>
              <button
                type="button"
                onClick={() => play.set({ ...play.world, r761: 800 })}
                className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs"
              >
                Snap 761 → 800
              </button>
            </div>
          </div>
        </Bay>

        <Gauge
          label="Estimated Difference"
          value={
            play.derived.value
              ? "800 − 500 = 300 (Option B)"
              : "Snap both numbers to nearest hundred"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q20 · Integer Temperature Reactor (-18 + 27 - 14 = -5) (B)
// ============================================================================
export function PlayQ20({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { currentTemp: number; stepIndex: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { currentTemp: 0, stepIndex: 0 },
    derive(w) {
      if (w.stepIndex < 3 || w.currentTemp !== -5) return { note: "Apply all 3 stages" };
      return {
        value: "-5",
        optionId: "B",
      };
    },
  });

  const applyStage = (stage: number) => {
    if (stage === 1) play.set({ currentTemp: -18, stepIndex: 1 });
    else if (stage === 2) play.set({ currentTemp: 9, stepIndex: 2 });
    else if (stage === 3) play.set({ currentTemp: -5, stepIndex: 3 });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Step 1: Start at −18.",
        "Step 2: Add 27: −18 + 27 = +9.",
        "Step 3: Subtract 14: +9 − 14 = −5.",
        "Final value is −5.",
      ]}
      title="3D Integer Temperature Reactor"
      badge="Q20 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 2, 6], fov: 42 }}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 4, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} opacity={0.5} transparent />
          </mesh>
        </World3D>

        <Bay title="Apply Integer Transformations">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => applyStage(1)}
              className={`p-3 rounded-xl border-2 font-black transition-all ${
                play.world.stepIndex >= 1
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              Stage 1: −18
            </button>
            <button
              type="button"
              onClick={() => applyStage(2)}
              disabled={play.world.stepIndex < 1}
              className={`p-3 rounded-xl border-2 font-black transition-all ${
                play.world.stepIndex >= 2
                  ? "border-amber-500 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-white disabled:opacity-40"
              }`}
            >
              Stage 2: +27 (→ +9)
            </button>
            <button
              type="button"
              onClick={() => applyStage(3)}
              disabled={play.world.stepIndex < 2}
              className={`p-3 rounded-xl border-2 font-black transition-all ${
                play.world.stepIndex >= 3
                  ? "border-rose-500 bg-rose-50 text-rose-900"
                  : "border-slate-200 bg-white disabled:opacity-40"
              }`}
            >
              Stage 3: −14 (→ −5)
            </button>
          </div>
        </Bay>

        <Gauge
          label="Reactor Temperature"
          value={
            play.world.stepIndex === 3
              ? "Final Value: −5 (Option B)"
              : `Current Temperature: ${play.world.currentTemp}°C`
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

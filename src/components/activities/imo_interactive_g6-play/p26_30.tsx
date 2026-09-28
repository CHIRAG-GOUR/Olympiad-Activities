"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q26 · Precision Clock Scanner (4:30 -> 45°) (C)
// ============================================================================
export function PlayQ26({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { hour: number; minute: number; scanned: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { hour: 4, minute: 0, scanned: false },
    derive(w) {
      if (!w.scanned || w.hour !== 4 || w.minute !== 30) return { note: "Set clock to 4:30 and scan" };
      return {
        value: "45°",
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
        "At 4:30, minute hand is at 180° (6 o'clock).",
        "Hour hand is at 4 × 30° + 30 × 0.5° = 135°.",
        "Smaller angle between hands = 180° − 135° = 45°.",
      ]}
      title="Precision Clock Scanner"
      badge="Q26 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 0, 7], fov: 42 }}>
          <mesh>
            <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </World3D>

        <Bay title="Robotic Scanner Clock Setting">
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl font-black text-indigo-950 font-mono bg-indigo-50 px-6 py-2 rounded-2xl border-2 border-indigo-200">
              {play.world.hour}:{play.world.minute === 0 ? "00" : play.world.minute}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => play.set({ hour: 4, minute: 30, scanned: true })}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md"
              >
                🔬 Scan Angle at 4:30
              </button>
            </div>
          </div>
        </Bay>

        <Gauge
          label="Robotic Scanner Measured Angle"
          value={
            play.derived.value
              ? "Measured Angle: 45° (Option C)"
              : "Set clock to 4:30 and scan"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q27 · Place-Value Elevator (705,032 -> 5 is thousands -> 5,000) (C)
// ============================================================================
export function PlayQ27({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { selectedPlace: string | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { selectedPlace: null },
    derive(w) {
      if (!w.selectedPlace) return { note: "Select place value" };
      let opt = "C";
      if (w.selectedPlace === "50") opt = "A";
      else if (w.selectedPlace === "500") opt = "B";
      else if (w.selectedPlace === "5,000") opt = "C";
      else if (w.selectedPlace === "50,000") opt = "D";

      return {
        value: w.selectedPlace,
        optionId: opt,
      };
    },
  });

  const places = [
    { name: "Hundred Thousands (7)", val: "700,000" },
    { name: "Ten Thousands (0)", val: "0" },
    { name: "Thousands (5)", val: "5,000" },
    { name: "Hundreds (0)", val: "0" },
    { name: "Tens (3)", val: "30" },
    { name: "Ones (2)", val: "2" },
  ];

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "In 705,032:",
        "7 is in hundred-thousands place (700,000)",
        "0 is in ten-thousands place",
        "5 is in thousands place -> 5 × 1,000 = 5,000.",
        "0 is in hundreds place",
        "3 is in tens place (30), 2 is in ones place (2).",
      ]}
      title="3D Place-Value Elevator"
      badge="Q27 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 7], fov: 42 }}>
          {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh position={[0, -0.3, 0]}>
                <boxGeometry args={[0.8, 0.1, 0.8]} />
                <meshStandardMaterial color="#cbd5e1" />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.7, 0.8, 0.7]} />
                <meshStandardMaterial color={i === 2 ? "#4f46e5" : "#94a3b8"} />
              </mesh>
            </group>
          ))}
        </World3D>

        <Bay title="Inspect Digits in 705,032">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {places.map((p, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-center ${
                  i === 2 ? "border-indigo-400 bg-indigo-50 font-black" : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-[10px] text-slate-500 block">{p.name}</span>
                <span className="text-sm font-bold text-indigo-950">{p.val}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Select the value of digit 5:
            </span>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {["50", "500", "5,000", "50,000"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => play.set({ selectedPlace: v })}
                  className={`py-2 rounded-xl font-black text-sm transition-all ${
                    play.world.selectedPlace === v
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </Bay>

        <Gauge
          label="Place Value of Digit 5"
          value={
            play.world.selectedPlace
              ? `Value: ${play.world.selectedPlace} (Option ${play.derived.optionId})`
              : "Select the value of digit 5 in 705,032"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q28 · Roman Numeral Forge (MCDXL = 1,440) (B)
// ============================================================================
export function PlayQ28({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { m: number; cd: number; xl: number; forged: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { m: 1000, cd: 400, xl: 40, forged: false },
    derive(w) {
      if (!w.forged) return { note: "Forge and evaluate Roman numerals" };
      return {
        value: "1,440",
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
        "M = 1000",
        "CD = 500 − 100 = 400",
        "XL = 50 − 10 = 40",
        "Total value = 1000 + 400 + 40 = 1440.",
      ]}
      title="Roman Numeral Blacksmith Forge"
      badge="Q28 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          {[-1.8, 0, 1.8].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.2, 0.2, 1.2]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </World3D>

        <Bay title="Forge Components Breakdown">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xl font-black text-indigo-950 block">M</span>
              <span className="text-xs font-bold text-indigo-600">1,000</span>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xl font-black text-indigo-950 block">CD</span>
              <span className="text-xs font-bold text-indigo-600">500 − 100 = 400</span>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xl font-black text-indigo-950 block">XL</span>
              <span className="text-xs font-bold text-indigo-600">50 − 10 = 40</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ ...play.world, forged: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md"
            >
              🔨 Forge & Evaluate: 1000 + 400 + 40
            </button>
          </div>
        </Bay>

        <Gauge
          label="Decimal Value"
          value={
            play.derived.value
              ? "MCDXL = 1,440 (Option B)"
              : "Assemble and forge the Roman numeral components"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q29 · Divisibility Scanner Tunnel (5,832 divisible by 9) (B)
// ============================================================================
export function PlayQ29({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { testedNum: string | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { testedNum: null },
    derive(w) {
      if (!w.testedNum) return { note: "Select a number to scan" };
      let opt = "A";
      if (w.testedNum === "5,823") opt = "A";
      else if (w.testedNum === "5,832") opt = "B";
      else if (w.testedNum === "5,842") opt = "C";
      else if (w.testedNum === "5,852") opt = "D";

      return {
        value: w.testedNum,
        optionId: opt,
      };
    },
  });

  const candidates = [
    { num: "5,823", sum: "5+8+2+3 = 18", div: true },
    { num: "5,832", sum: "5+8+3+2 = 18", div: true },
    { num: "5,842", sum: "5+8+4+2 = 19", div: false },
    { num: "5,852", sum: "5+8+5+2 = 20", div: false },
  ];

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Divisibility rule for 9: A number is divisible by 9 if the sum of its digits is a multiple of 9.",
        "5 + 8 + 3 + 2 = 18, which is divisible by 9 (18 ÷ 9 = 2).",
        "5,832 ÷ 9 = 648 exactly.",
      ]}
      title="3D Divisibility Scanner Tunnel"
      badge="Q29 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[2, 0.2, 16, 32]} />
            <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={0.6} />
          </mesh>
        </World3D>

        <Bay title="Inspect Candidate Number Capsules">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {candidates.map((c) => (
              <button
                key={c.num}
                type="button"
                onClick={() => play.set({ testedNum: c.num })}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                  play.world.testedNum === c.num
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md scale-105"
                    : "border-indigo-100 bg-white text-indigo-950 hover:bg-indigo-50"
                }`}
              >
                <span className="text-lg font-black">{c.num}</span>
                <span className="text-[10px] opacity-80">{c.sum}</span>
              </button>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Scanner Validation"
          value={
            play.world.testedNum === "5,832"
              ? "5,832 passes 9-divisibility gate (Option B)"
              : play.world.testedNum
              ? `Selected ${play.world.testedNum}`
              : "Select a number to pass through the divisibility gate"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q30 · Fraction Balance (5/8 = 0.625 > 3/5 = 0.600 -> 5/8 is greater) (A)
// ============================================================================
export function PlayQ30({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { weighed: boolean; greaterFraction: string | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { weighed: false, greaterFraction: null },
    derive(w) {
      if (!w.weighed) return { note: "Activate precision balance" };
      return {
        value: "5/8",
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
        "Convert to a common denominator of 40:",
        "5/8 = (5 × 5) / (8 × 5) = 25/40.",
        "3/5 = (3 × 8) / (5 × 8) = 24/40.",
        "Since 25/40 > 24/40, 5/8 is greater than 3/5.",
      ]}
      title="3D Fraction Balance Laboratory"
      badge="Q30 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <group rotation={[0, 0, play.world.weighed ? -0.08 : 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4.5, 0.15, 0.4]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} />
            </mesh>
            <mesh position={[-1.8, 0.6, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
              <meshStandardMaterial color="#3b82f6" opacity={0.8} transparent />
            </mesh>
            <mesh position={[1.8, 0.6, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
              <meshStandardMaterial color="#10b981" opacity={0.8} transparent />
            </mesh>
          </group>
        </World3D>

        <Bay title="Common Denominator (40) Comparison">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-xl font-black text-blue-900 block">5/8</span>
              <span className="text-xs font-bold text-blue-700">25/40 = 0.625</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xl font-black text-emerald-900 block">3/5</span>
              <span className="text-xs font-bold text-emerald-700">24/40 = 0.600</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ weighed: true, greaterFraction: "5/8" })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2"
            >
              ⚖️ Activate Precision Balance
            </button>
          </div>
        </Bay>

        <Gauge
          label="Greater Fraction Result"
          value={
            play.derived.value
              ? "5/8 is greater (25/40 > 24/40) → Option A"
              : "Activate the balance to compare 5/8 and 3/5"
          }
          tone={play.derived.optionId === "A" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

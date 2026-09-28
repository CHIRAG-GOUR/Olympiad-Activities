"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q36 · Supermarket Checkout (275.50 + 149.75 + 74.75 = ₹500) (C)
// ============================================================================
export function PlayQ36({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { scanned: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { scanned: false },
    derive(w) {
      if (!w.scanned) return { note: "Scan products at checkout" };
      return {
        value: "₹500",
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
        "Bag = ₹275.50",
        "Shoes = ₹149.75",
        "Cap = ₹74.75",
        "Total = 275.50 + 149.75 + 74.75 = ₹500.00.",
      ]}
      title="3D Supermarket Checkout Game"
      badge="Q36 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[5, 0.2, 2]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
          {[-1.5, 0, 1.5].map((x, i) => (
            <mesh key={i} position={[x, 0.3, 0]} castShadow>
              <boxGeometry args={[0.7, 0.7, 0.7]} />
              <meshStandardMaterial color={i === 0 ? "#4f46e5" : i === 1 ? "#0ea5e9" : "#10b981"} />
            </mesh>
          ))}
        </World3D>

        <Bay title="Purchased Items Price List">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-slate-600 block">🎒 School Bag</span>
              <span className="text-lg font-black text-indigo-950">₹275.50</span>
            </div>
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
              <span className="text-xs font-bold text-slate-600 block">👟 Sports Shoes</span>
              <span className="text-lg font-black text-sky-950">₹149.75</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-slate-600 block">🧢 Summer Cap</span>
              <span className="text-lg font-black text-emerald-950">₹74.75</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ scanned: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md"
            >
              🧾 Scan Conveyor & Print Total
            </button>
          </div>
        </Bay>

        <Gauge
          label="Total Amount Spent"
          value={
            play.derived.value
              ? "Total: ₹500.00 (Option C)"
              : "Scan products at checkout"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q37 · Pocket Money Escape Room (Remaining 120 * 8 = ₹960) (C)
// ============================================================================
export function PlayQ37({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { calculatedInitial: number | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { calculatedInitial: null },
    derive(w) {
      if (!w.calculatedInitial) return { note: "Calculate initial money" };
      let opt = "A";
      if (w.calculatedInitial === 480) opt = "A";
      else if (w.calculatedInitial === 720) opt = "B";
      else if (w.calculatedInitial === 960) opt = "C";
      else if (w.calculatedInitial === 1200) opt = "D";

      return {
        value: `₹${w.calculatedInitial}`,
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
        "Work backwards from remaining amount ₹120:",
        "Before 3rd purchase (table): 120 × 2 = ₹240.",
        "Before 2nd purchase (book): 240 × 2 = ₹480.",
        "Before 1st purchase (shoes): 480 × 2 = ₹960.",
        "Initial total amount = ₹960.",
      ]}
      title="3D Pocket Money Escape Room"
      badge="Q37 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          {[-2, 0, 2].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} castShadow>
              <boxGeometry args={[1, 2, 0.2]} />
              <meshStandardMaterial color="#6366f1" metalness={0.7} />
            </mesh>
          ))}
        </World3D>

        <Bay title="Reverse Spending Gates">
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="font-bold text-slate-600 block">Gate 3 (Table)</span>
              <span className="text-base font-black text-indigo-950">₹120 × 2 = ₹240</span>
            </div>
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="font-bold text-slate-600 block">Gate 2 (Book)</span>
              <span className="text-base font-black text-indigo-950">₹240 × 2 = ₹480</span>
            </div>
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="font-bold text-slate-600 block">Gate 1 (Shoes)</span>
              <span className="text-base font-black text-indigo-950">₹480 × 2 = ₹960</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Select Initial Money Amount:
            </span>
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {[480, 720, 960, 1200].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => play.set({ calculatedInitial: amt })}
                  className={`py-2 rounded-xl font-black text-sm transition-all ${
                    play.world.calculatedInitial === amt
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        </Bay>

        <Gauge
          label="Initial Money Solved"
          value={
            play.world.calculatedInitial === 960
              ? "Initial Money = ₹960 (Option C)"
              : play.world.calculatedInitial
              ? `Selected: ₹${play.world.calculatedInitial}`
              : "Calculate initial money from reverse halving"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q38 · Highway Driving Simulator (45 km/h * 2h20m = 105 km) (C)
// ============================================================================
export function PlayQ38({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { distance: number; driven: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { distance: 0, driven: false },
    derive(w) {
      if (!w.driven || w.distance !== 105) return { note: "Run GPS telemetry" };
      return {
        value: "105 km",
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
        "Time = 2 hours 20 minutes = 2 + (20/60) hours = 2 + 1/3 = 7/3 hours.",
        "Speed = 45 km/h.",
        "Distance = Speed × Time = 45 × (7/3) = 15 × 7 = 105 km.",
      ]}
      title="3D Highway Driving Simulator"
      badge="Q38 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[8, 0.1, 2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <group position={[play.world.driven ? 2.5 : -2.5, 0.3, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.5, 0.8]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
        </World3D>

        <Bay title="Telemetry Controls">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 block">Cruise Speed</span>
              <span className="text-xl font-black text-indigo-950">45 km/h</span>
            </div>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 block">Journey Duration</span>
              <span className="text-xl font-black text-indigo-950">2 h 20 min (7/3 h)</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ distance: 105, driven: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2"
            >
              🚗 Run GPS Telemetry: 45 × (7/3) km
            </button>
          </div>
        </Bay>

        <Gauge
          label="Total Travelled Distance"
          value={
            play.derived.value
              ? "Distance = 105 km (Option C)"
              : "Drive simulated journey to record distance"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q39 · Weather Station (17 - (-6) = 23°C) (C)
// ============================================================================
export function PlayQ39({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { diff: number; measured: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { diff: 0, measured: false },
    derive(w) {
      if (!w.measured || w.diff !== 23) return { note: "Measure temperature difference" };
      return {
        value: "23°C",
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
        "City A minimum temperature = −6°C.",
        "City B minimum temperature = +17°C.",
        "Difference = 17°C − (−6°C) = 17°C + 6°C = 23°C.",
      ]}
      title="3D Weather Station"
      badge="Q39 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <group position={[-1.5, 0, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 2.5, 16]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>

          <group position={[1.5, 0, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 2.5, 16]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
          </group>
        </World3D>

        <Bay title="City Sensors Readings">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
              <span className="text-xs font-bold text-sky-800 block">City A Sensor</span>
              <span className="text-2xl font-black text-sky-950 font-mono">−6°C</span>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <span className="text-xs font-bold text-orange-800 block">City B Sensor</span>
              <span className="text-2xl font-black text-orange-950 font-mono">+17°C</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ diff: 23, measured: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md"
            >
              🌡️ Measure Thermal Column Span: 17 − (−6)
            </button>
          </div>
        </Bay>

        <Gauge
          label="Temperature Difference"
          value={
            play.derived.value
              ? "Difference = 23°C (Option C)"
              : "Measure thermal distance between sensors"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q40 · Warehouse Packing Game (8640 / 240 = 36 boxes) (C)
// ============================================================================
export function PlayQ40({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { boxCount: number | null };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { boxCount: null },
    derive(w) {
      if (!w.boxCount) return { note: "Calculate number of boxes" };
      let opt = "A";
      if (w.boxCount === 32) opt = "A";
      else if (w.boxCount === 34) opt = "B";
      else if (w.boxCount === 36) opt = "C";
      else if (w.boxCount === 38) opt = "D";

      return {
        value: `${w.boxCount} Boxes`,
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
        "Total pens to pack = 8,640.",
        "Pens per box = 240.",
        "Number of boxes = 8,640 ÷ 240 = 864 ÷ 24 = 36 boxes.",
      ]}
      title="3D Warehouse Packing Game"
      badge="Q40 · Everyday Mathematics"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          {[-1.5, 0, 1.5].map((x, i) =>
            [-0.7, 0.7].map((z, j) => (
              <mesh key={`${i}-${j}`} position={[x, 0, z]} castShadow>
                <boxGeometry args={[0.8, 0.6, 0.8]} />
                <meshStandardMaterial color="#d97706" />
              </mesh>
            ))
          )}
        </World3D>

        <Bay title="Select Packed Box Total (8640 ÷ 240)">
          <div className="grid grid-cols-4 gap-3">
            {[32, 34, 36, 38].map((boxes) => (
              <button
                key={boxes}
                type="button"
                onClick={() => play.set({ boxCount: boxes })}
                className={`py-3 rounded-xl border-2 font-black text-lg transition-all ${
                  play.world.boxCount === boxes
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md scale-105"
                    : "border-indigo-100 bg-white text-indigo-950 hover:bg-indigo-50"
                }`}
              >
                {boxes} Boxes
              </button>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Required Boxes"
          value={
            play.world.boxCount === 36
              ? "36 Boxes Required (8,640 ÷ 240 = 36) → Option C"
              : play.world.boxCount
              ? `${play.world.boxCount} Boxes`
              : "Select required boxes"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

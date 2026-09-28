"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q21 · Symmetry Museum (Regular Hexagon = 6 lines of symmetry) (D)
// ============================================================================
export function PlayQ21({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { activeMirrors: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { activeMirrors: 0 },
    derive(w) {
      if (w.activeMirrors !== 6) return { note: "Select symmetry axes" };
      return {
        value: "6",
        optionId: "D",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "A regular polygon with n sides has exactly n lines of symmetry.",
        "A regular hexagon has 6 equal sides and 6 equal angles.",
        "3 lines connect opposite vertices (vertices to vertices).",
        "3 lines connect midpoints of opposite sides.",
        "Total lines of symmetry = 6.",
      ]}
      title="3D Symmetry Museum"
      badge="Q21 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 0, 7], fov: 42 }}>
          <mesh castShadow>
            <cylinderGeometry args={[2.2, 2.2, 0.2, 6]} />
            <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.2} />
          </mesh>
        </World3D>

        <Bay title="Activate Laser Symmetry Mirrors">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-slate-600">
              Select number of symmetry axes for regular hexagon:
            </span>
            <div className="flex items-center gap-3">
              {[3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => play.set({ activeMirrors: count })}
                  className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${
                    play.world.activeMirrors === count
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </Bay>

        <Gauge
          label="Symmetry Axes Verified"
          value={
            play.world.activeMirrors === 6
              ? "6 Lines of Symmetry Verified (Option D)"
              : `Current: ${play.world.activeMirrors} lines`
          }
          tone={play.derived.optionId === "D" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q22 · Line Segment Factory (5 points on a line = 5*4/2 = 10 segments) (C)
// ============================================================================
export function PlayQ22({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { connectedPairs: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { connectedPairs: 0 },
    derive(w) {
      if (w.connectedPairs !== 10) return { note: "Calculate line segments" };
      return {
        value: "10",
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
        "Number of line segments formed by n collinear points is given by n(n−1)/2.",
        "For 5 points: 5 × 4 ÷ 2 = 10 unique segments.",
        "These are: AB, AC, AD, AE, BC, BD, BE, CD, CE, DE.",
      ]}
      title="Line Segment Factory"
      badge="Q22 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 2, 6], fov: 42 }}>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[6, 0.1, 0.2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
          </mesh>
          {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => (
            <group key={i} position={[x, 0.2, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#4f46e5" />
              </mesh>
            </group>
          ))}
        </World3D>

        <Bay title="Laser Line Segment Generation">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-slate-600">
              Formula: n(n−1)/2 = 5 × 4 / 2 = 10 Segments
            </span>
            <div className="flex items-center gap-3">
              {[5, 8, 10, 12].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => play.set({ connectedPairs: val })}
                  className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${
                    play.world.connectedPairs === val
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
          label="Unique Line Segments"
          value={
            play.world.connectedPairs === 10
              ? "10 Distinct Line Segments Formed (Option C)"
              : `Current count: ${play.world.connectedPairs}`
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q23 · Library Data Observatory (94 - 36 = 58) (B)
// ============================================================================
export function PlayQ23({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { computedDiff: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { computedDiff: 0 },
    derive(w) {
      if (w.computedDiff !== 58) return { note: "Calculate difference between groups" };
      return {
        value: "58",
        optionId: "B",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="2D"
      hints={[
        "Monday + Wednesday + Thursday = 32 + 27 + 35 = 94 visitors.",
        "Saturday + Sunday = 16 + 20 = 36 visitors.",
        "Difference = 94 − 36 = 58 more visitors.",
      ]}
      title="Library Data Observatory"
      badge="Q23 · Mathematical Reasoning"
    >
      <Board>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-xs font-bold text-indigo-900 block mb-1">Group 1: Mon + Wed + Thu</span>
            <div className="text-2xl font-black text-indigo-950 font-mono">32 + 27 + 35 = 94</div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-xs font-bold text-purple-900 block mb-1">Group 2: Sat + Sun</span>
            <div className="text-2xl font-black text-purple-950 font-mono">16 + 20 = 36</div>
          </div>
        </div>

        <Bay title="Compute Difference (Group 1 − Group 2)">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ computedDiff: 58 })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all"
            >
              📊 Calculate: 94 − 36 = 58
            </button>
          </div>
        </Bay>

        <Gauge
          label="Visitor Difference"
          value={
            play.world.computedDiff === 58
              ? "58 More Visitors (Option B)"
              : "Compute difference between combined days"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q24 · Construction Site Area (12x8 - 4x3 = 96 - 12 = 84 m²) (C)
// ============================================================================
export function PlayQ24({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { gardenArea: number; pondArea: number; calculated: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { gardenArea: 96, pondArea: 12, calculated: false },
    derive(w) {
      if (!w.calculated) return { note: "Calculate remaining land area" };
      return {
        value: "84 m²",
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
        "Total garden area = Length × Width = 12 m × 8 m = 96 m².",
        "Pond area = 4 m × 3 m = 12 m².",
        "Remaining walkable area = 96 m² − 12 m² = 84 m².",
      ]}
      title="3D Garden Construction Simulator"
      badge="Q24 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 5, 7], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[4.8, 3.2]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[1.6, 1.2]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </World3D>

        <Bay title="Site Area Calculations">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-900 block">Total Garden (12 × 8)</span>
              <span className="text-xl font-black text-emerald-950">96 m²</span>
            </div>
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center">
              <span className="text-xs font-bold text-sky-900 block">Excavated Pond (4 × 3)</span>
              <span className="text-xl font-black text-sky-950">12 m²</span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ ...play.world, calculated: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all"
            >
              🏗️ Calculate Remaining Land Area (96 − 12)
            </button>
          </div>
        </Bay>

        <Gauge
          label="Remaining Walkable Area"
          value={
            play.derived.value
              ? "84 m² (Option C)"
              : "Press calculate to compute remaining area"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q25 · Perimeter Robot (2 * (15 + 9) = 48 m) (B)
// ============================================================================
export function PlayQ25({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { distanceTravelled: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { distanceTravelled: 0 },
    derive(w) {
      if (w.distanceTravelled !== 48) return { note: "Drive robot around perimeter" };
      return {
        value: "48 m",
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
        "Perimeter of rectangle = 2 × (Length + Width).",
        "Length = 15 m, Width = 9 m.",
        "Perimeter = 2 × (15 + 9) = 2 × 24 = 48 m.",
      ]}
      title="3D Perimeter Robot"
      badge="Q25 · Mathematical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.5, 2.7]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[4.5, 0.05, 2.7]} />
            <meshStandardMaterial color="#4f46e5" wireframe />
          </mesh>
        </World3D>

        <Bay title="Drive Robot Around Playground Boundary">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ distanceTravelled: 48 })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              🤖 Drive Perimeter: 15 + 9 + 15 + 9 = 48 m
            </button>
          </div>
        </Bay>

        <Gauge
          label="Total Boundary Distance"
          value={
            play.world.distanceTravelled === 48
              ? "Perimeter = 48 m (Option B)"
              : "Drive robot around all 4 sides"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

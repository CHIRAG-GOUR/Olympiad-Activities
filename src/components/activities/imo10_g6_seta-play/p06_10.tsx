"use client";

import React, { useRef } from "react";
import { Compass, Trees, Scan, Cpu, Lock, CheckCircle2, RotateCcw } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper, World3D } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q06 — 3D Compass Navigation Rover Mission
   Latika facing Bikaner. Turns 315° anti-clockwise => Facing Nirula's (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q06CompassNavActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const LOCATIONS = [
    { name: "Haldiram", angle: 0 },
    { name: "KFC", angle: 45 },
    { name: "Bikaner", angle: 90 },
    { name: "Nirula's", angle: 135 },
    { name: "McD", angle: 180 },
    { name: "Subway", angle: 225 },
    { name: "Dominos", angle: 270 },
    { name: "Pizza Hut", angle: 315 },
  ];

  const play = usePlay<{ turnAngle: number }>({
    question,
    initial: { turnAngle: 315 },
    derive: (w) => {
      const turn = w?.turnAngle ?? 0;
      // Start at Bikaner (90°). Anti-clockwise turn adds angle in standard math orientation or:
      // (90 + 315) % 360 = 405 % 360 = 45° offset -> Nirula's
      if (turn === 315) {
        return {
          value: "Nirula's",
          optionId: matchText(question, "Nirula's") ?? "D",
        };
      }
      return { note: `Turn angle: ${turn}°. Rotate dial 315° anti-clockwise.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const turn = play.world?.turnAngle ?? 315;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Compass Navigation Mission"
      mission="Start Latika facing Bikaner (East-North). Rotate the navigation dial 315° anti-clockwise to discover her destination (Nirula's)."
      icon={Compass}
      dim="2D"
      submitLabel="Lock Heading & Submit Nirula's (Option D)"
      hints={[
        "8 compass points are spaced by 45° each.",
        "Turning 315° anti-clockwise is equivalent to turning 45° clockwise.",
        "From Bikaner, 45° clockwise lands directly on Nirula's (Option D).",
      ]}
      live={
        <>
          <Gauge label="Initial Heading" value="Bikaner" tone="sky" />
          <Gauge label="Rotation Angle" value={`${turn}° ACW`} tone="indigo" />
          <Gauge label="Target Destination" value={turn === 315 ? "Nirula's ✓" : "Off Course"} tone={turn === 315 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="260px">
          <svg className="w-full h-full" viewBox="0 0 400 240">
            {/* Center Dial */}
            <g transform="translate(200, 120)">
              {/* Compass Ring */}
              <circle r="90" fill="#f8fafc" stroke="#4f46e5" strokeWidth="2.5" />
              <circle r="70" fill="none" stroke="#e0e7ff" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* 8 Radial Direction Lines & Text */}
              {LOCATIONS.map((loc) => {
                const rad = ((loc.angle - 90) * Math.PI) / 180;
                const x = 75 * Math.cos(rad);
                const y = 75 * Math.sin(rad);
                const isNirula = loc.name === "Nirula's";
                const isBikaner = loc.name === "Bikaner";
                return (
                  <g key={loc.name}>
                    <line x1="0" y1="0" x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1.5" />
                    <circle cx={x} cy={y} r="4" fill={isNirula ? "#059669" : isBikaner ? "#4f46e5" : "#64748b"} />
                    <text
                      x={x * 1.25}
                      y={y * 1.25 + 4}
                      fill={isNirula ? "#065f46" : isBikaner ? "#312e81" : "#475569"}
                      fontSize="10"
                      fontWeight={isNirula || isBikaner ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {loc.name}
                    </text>
                  </g>
                );
              })}

              {/* Heading Indicator Needle */}
              <line
                x1="0"
                y1="0"
                x2={turn === 315 ? "55" : "0"}
                y2={turn === 315 ? "55" : "-60"}
                stroke="#e11d48"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle r="6" fill="#e11d48" />
            </g>
          </svg>
        </PlayCanvas>

        <div className="flex justify-center gap-3">
          <Stepper
            value={turn}
            min={0}
            max={360}
            step={45}
            unit="°"
            onChange={(v) => play.patch({ turnAngle: v })}
            label="Turn Angle"
          />
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q07 — 3D Semantic Word-Swap Garden
   Earth -> Sky, Sky -> Tree, Tree -> Wall. Fruit grows on Tree -> called Wall (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q07WordSwapGardenActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ pickedObject: string }>({
    question,
    initial: { pickedObject: "tree" },
    derive: (w) => {
      const obj = w?.pickedObject ?? "tree";
      if (obj === "tree") {
        return {
          value: "wall",
          optionId: matchText(question, "wall") ?? "C",
        };
      }
      return { note: `Picked: ${obj}. Fruit grows on tree, which is named 'wall'.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const obj = play.world?.pickedObject ?? "tree";

  return (
    <Shell
      play={play}
      question={question}
      title="Semantic Word-Swap Garden"
      mission="Fruits grow on a 'tree'. In this transformed semantic garden, follow the substitution rules ('tree' is called 'wall') -> Option C."
      icon={Trees}
      dim="2D"
      submitLabel="Submit Transformed Name (wall / Option C)"
      hints={[
        "Factual premise: Fruits grow on a tree.",
        "Substitution code: 'earth' → 'sky', 'sky' → 'tree', 'tree' → 'wall'.",
        "Therefore, fruit grows on 'wall' (Option C).",
      ]}
      live={
        <>
          <Gauge label="Natural Habitat" value="Tree (🌳)" tone="emerald" />
          <Gauge label="Semantic Code" value="Tree ➔ Wall" tone="violet" />
          <Gauge label="Answer" value="wall (Option C)" tone="emerald" />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "earth", name: "Earth", called: "Sky", icon: "🌍" },
            { id: "sky", name: "Sky", called: "Tree", icon: "☁️" },
            { id: "tree", name: "Tree (Grows Fruit)", called: "Wall", icon: "🌳", isFruit: true },
            { id: "wall", name: "Wall", called: "House", icon: "🧱" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => play.patch({ pickedObject: item.id })}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                obj === item.id
                  ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500 shadow-md"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="font-extrabold text-xs text-slate-800">{item.name}</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
                Called: {item.called}
              </span>
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q08 — 3D Embedded-Shape Hunt
   Fig. (X) embedded in Figure A (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q08EmbeddedShapeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedFigure: string }>({
    question,
    initial: { selectedFigure: "A" },
    derive: (w) => {
      const fig = w?.selectedFigure ?? "A";
      if (fig === "A") {
        return {
          value: "Figure A",
          optionId: matchText(question, "Figure A") ?? "A",
        };
      }
      return { note: `Figure ${fig} selected. Use laser beam to verify embedded geometry.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const fig = play.world?.selectedFigure ?? "A";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Embedded Shape Scanner"
      mission="Inspect the rotating wireframe structures: trace target Fig. (X) with the inspection laser to locate its exact embedded occurrence in Figure A."
      icon={Scan}
      dim="2D"
      submitLabel="Verify & Submit Figure A (Option A)"
      hints={[
        "Target Fig. (X): An open trapezoidal zigzag with a horizontal baseline.",
        "Scan each figure to verify exact edge-to-edge alignment.",
        "Figure A contains Fig. (X) intact with matching angles.",
      ]}
      live={
        <>
          <Gauge label="Target Geometry" value="Fig. (X)" tone="sky" />
          <Gauge label="Structure Inspected" value={`Figure ${fig}`} tone={fig === "A" ? "emerald" : "amber"} />
          <Gauge label="Match Status" value={fig === "A" ? "Exact Match (100%)" : "Mismatch"} tone={fig === "A" ? "emerald" : "rose"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="240px">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Target Fig X Box */}
            <g transform="translate(40, 40)">
              <rect width="90" height="90" fill="#f8fafc" stroke="#4f46e5" strokeWidth="2" rx="6" />
              <polyline points="20,70 35,30 65,30 80,70" fill="none" stroke="#4f46e5" strokeWidth="3" />
              <text x="45" y="110" fill="#312e81" fontSize="12" fontWeight="bold" textAnchor="middle">Fig. (X)</text>
            </g>

            {/* Candidate Figures A & B */}
            <g transform="translate(170, 40)">
              <rect width="90" height="90" fill="#f8fafc" stroke={fig === "A" ? "#059669" : "#cbd5e1"} strokeWidth="2" rx="6" />
              <polyline points="20,70 35,30 65,30 80,70" fill="none" stroke="#059669" strokeWidth="3" />
              <line x1="15" y1="50" x2="75" y2="50" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="45" y="110" fill={fig === "A" ? "#065f46" : "#64748b"} fontSize="12" fontWeight="bold" textAnchor="middle">Fig. A ✓</text>
            </g>

            <g transform="translate(280, 40)">
              <rect width="90" height="90" fill="#f8fafc" stroke={fig === "B" ? "#059669" : "#cbd5e1"} strokeWidth="2" rx="6" />
              <polyline points="20,30 35,70 65,70 80,30" fill="none" stroke="#94a3b8" strokeWidth="2" />
              <text x="45" y="110" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">Fig. B</text>
            </g>
          </svg>
        </PlayCanvas>

        <div className="grid grid-cols-4 gap-2">
          {["A", "B", "C", "D"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => play.patch({ selectedFigure: id })}
              className={`py-2 rounded-xl font-black text-xs border transition-all ${
                fig === id
                  ? "bg-emerald-600 text-white border-emerald-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Figure {id} {id === "A" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q09 — 3D Pattern Transformation Machine
   Fig 1 -> Fig 2; Fig 3 -> Fig 4 (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q09PatternTransformationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ transformed: boolean }>({
    question,
    initial: { transformed: true },
    derive: (w) => {
      if (w?.transformed) {
        return {
          value: "Figure B",
          optionId: matchText(question, "Figure B") ?? "B",
        };
      }
      return { note: "Operate the pattern transformation machine to generate Fig. (4)." };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const transformed = play.world?.transformed ?? true;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Pattern Transformation Machine"
      mission="Analyze the mechanical transformation between Fig (1) and Fig (2): apply the identical rotation + inversion to Fig (3) to forge Fig (4) -> Figure B."
      icon={Cpu}
      dim="2D"
      submitLabel="Forge & Submit Figure B (Option B)"
      hints={[
        "Fig 1 to Fig 2: 90° clockwise rotation with inner sector shading invert.",
        "Applying the exact rule to Fig 3 generates Figure B.",
      ]}
      live={
        <>
          <Gauge label="Rule Engine" value="90° CW + Invert" tone="indigo" />
          <Gauge label="Input Figure" value="Fig (3)" tone="sky" />
          <Gauge label="Generated Output" value={transformed ? "Figure B ✓" : "Pending"} tone={transformed ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="bg-white rounded-xl border border-indigo-100 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-around text-center">
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="text-2xl">📐 Fig (1)</div>
              <div className="text-[10px] text-slate-500 mt-1">Source Model</div>
            </div>
            <div className="text-xl font-bold text-indigo-400">➔</div>
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="text-2xl">📐 Fig (2)</div>
              <div className="text-[10px] text-slate-500 mt-1">Transformed</div>
            </div>
            <div className="text-xl font-bold text-indigo-400">::</div>
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="text-2xl">🔷 Fig (3)</div>
              <div className="text-[10px] text-slate-500 mt-1">Target Input</div>
            </div>
            <div className="text-xl font-bold text-indigo-400">➔</div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
              <div className="text-2xl">🔷 Fig (4) = B</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">Forged Output ✓</div>
            </div>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — 3D Mathematical Number Vault
   Box 1 = 90, Box 2 = 360, Box 3 = 64 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q10NumberVaultActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ lockCode: number }>({
    question,
    initial: { lockCode: 64 },
    derive: (w) => {
      const code = w?.lockCode ?? 0;
      if (code === 64) {
        return {
          value: "64",
          optionId: matchText(question, "64") ?? "A",
        };
      }
      return { note: `Lock Dial at: ${code}. Solve 4-number operation.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const code = play.world?.lockCode ?? 64;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Number Vault Lock"
      mission="Decipher the mathematical operation across the 4-number panels (Lock 1 = 90, Lock 2 = 360) and unlock Vault 3 -> 64."
      icon={Lock}
      dim="2D"
      submitLabel="Unlock & Submit 64 (Option A)"
      hints={[
        "Panel 1 evaluates to 90.",
        "Panel 2 evaluates to 360.",
        "Panel 3 with identical operation derives 64 (Option A).",
      ]}
      live={
        <>
          <Gauge label="Lock 1 Output" value="90" tone="sky" />
          <Gauge label="Lock 2 Output" value="360" tone="sky" />
          <Gauge label="Lock 3 Dial" value={code} tone={code === 64 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[64, 72, 48, 81].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => play.patch({ lockCode: c })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                code === c
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c} {c === 64 ? "🔓" : "🔒"}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navigation, Box, KeyRound, LayoutGrid, Globe2, Sparkles, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, World3D, PlayCanvas } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — The Campus Navigation Mission (Riya's Journey)
   Riya starts from college: North 10m -> Right 25m -> Right 50m -> Right 25m.
   Candidate navigates step-by-step; drone laser measures 40 m straight line.
   ══════════════════════════════════════════════════════════════════════ */

export function Q01CampusNavActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const steps = [
    { dir: "North", dist: 10, label: "North 10 m" },
    { dir: "Right (East)", dist: 25, label: "Turn Right → East 25 m" },
    { dir: "Right (South)", dist: 50, label: "Turn Right → South 50 m" },
    { dir: "Right (West)", dist: 25, label: "Turn Right → West 25 m" },
  ];

  const play = usePlay<{ currentStep: number; measured: boolean }>({
    question,
    initial: { currentStep: 0, measured: false },
    derive: (w) => {
      if (w.currentStep < steps.length) {
        return { note: `Step ${w.currentStep + 1} of ${steps.length}: Guide Riya along her path.` };
      }
      if (!w.measured) return { note: "Activate surveying drone to measure straight-line distance to college." };
      return { value: "40 m", optionId: matchText(question, "40 m") };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const advance = () => {
    if (w.currentStep < steps.length) {
      play.patch({ currentStep: w.currentStep + 1 });
    }
  };

  // Trajectory points on 240x200 grid (college at 120, 60)
  const pts: [number, number][] = [[120, 60]];
  if (w.currentStep >= 1) pts.push([120, 36]); // N 10m (24px)
  if (w.currentStep >= 2) pts.push([180, 36]); // E 25m (60px)
  if (w.currentStep >= 3) pts.push([180, 156]); // S 50m (120px)
  if (w.currentStep >= 4) pts.push([120, 156]); // W 25m (60px) -> Home

  const currentPos = pts[pts.length - 1];

  return (
    <Shell
      play={play}
      question={question}
      title="The Campus Navigation Mission"
      mission="Guide Riya's navigation robot along her exact course from College: North 10 m → Right 25 m → Right 50 m → Right 25 m. Then activate the surveying drone to measure her final distance from college."
      icon={Navigation}
      dim="2D"
      submitLabel="Submit Surveyed Distance"
      hints={[
        "North is upward on the campus grid.",
        "Turning right from North heads East; right from East heads South; right from South heads West.",
        "Since East 25 m and West 25 m cancel out, the net vertical distance is 50 m - 10 m = 40 m South.",
      ]}
      live={
        <>
          <Gauge label="Steps Completed" value={`${w.currentStep}/${steps.length}`} tone={w.currentStep === steps.length ? "emerald" : "indigo"} />
          <Gauge label="Surveyed Distance" value={w.measured ? "40 m" : "Standby"} tone={w.measured ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="h-64" className="bg-gradient-to-b from-sky-50/50 via-white to-indigo-50/30">
          <svg className="w-full h-full" viewBox="0 0 240 190">
            <defs>
              <pattern id="campusGridLight" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="240" height="190" fill="url(#campusGridLight)" rx="8" />

            {/* Compass Rose */}
            <g transform="translate(25, 30)">
              <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="0" y="-4" fill="#4f46e5" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
              <text x="0" y="11" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">S</text>
              <text x="8" y="3" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">E</text>
              <text x="-8" y="3" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">W</text>
            </g>

            {/* College icon / Origin */}
            <g transform="translate(120, 60)">
              <circle cx="0" cy="0" r="10" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
              <text x="0" y="3" fontSize="11" textAnchor="middle">🏫</text>
              <text x="14" y="3" fill="#312e81" fontSize="9" fontWeight="bold">College (Start)</text>
            </g>

            {/* Breadcrumb Path */}
            {pts.length > 1 && (
              <polyline
                points={pts.map((p) => `${p[0]},${p[1]}`).join(" ")}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeDasharray="6 3"
              />
            )}

            {/* Final Straight Line Measurement Laser */}
            {w.measured && (
              <g>
                <line x1="120" y1="60" x2="120" y2="156" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                <rect x="76" y="98" width="36" height="18" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                <text x="94" y="110" fill="#047857" fontSize="10" fontWeight="bold" textAnchor="middle">
                  40 m
                </text>
              </g>
            )}

            {/* Home Marker at step 4 */}
            {w.currentStep === 4 && (
              <g transform="translate(120, 156)">
                <circle cx="0" cy="0" r="10" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <text x="0" y="3" fontSize="11" textAnchor="middle">🏠</text>
                <text x="14" y="3" fill="#92400e" fontSize="9" fontWeight="bold">Home (40 m from College)</text>
              </g>
            )}

            {/* Robot Cursor */}
            <circle cx={currentPos[0]} cy={currentPos[1]} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
          </svg>
        </PlayCanvas>
      </Board>

      <Bay label="Navigation Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          {w.currentStep < steps.length ? (
            <Btn tone="emerald" disabled={play.readOnly} onClick={advance}>
              🧭 Step {w.currentStep + 1}: {steps[w.currentStep].label}
            </Btn>
          ) : (
            <Btn tone="amber" active={w.measured} disabled={play.readOnly || w.measured} onClick={() => play.patch({ measured: true })}>
              🛸 Activate Drone Laser & Measure Distance
            </Btn>
          )}
          <Btn tone="slate" disabled={play.readOnly || w.currentStep === 0} onClick={() => play.patch({ currentStep: 0, measured: false })}>
            ↺ Reset
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q2 — The Forbidden Cube Vault (Count 3D Cubes)
   Full 3D isometric inspection of the 22-cube construction.
   Candidate can toggle X-ray, strip layers, and count cubes.
   ══════════════════════════════════════════════════════════════════════ */

function CubeMesh({ pos, color = "#6366f1", wireframe = false }: { pos: [number, number, number]; color?: string; wireframe?: boolean }) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={[0.92, 0.92, 0.92]} />
      <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.25} metalness={0.15} />
    </mesh>
  );
}

export function Q02ForbiddenCubeVaultActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  // Layer 1 (Base: 8 cubes), Layer 2 (Middle: 8 cubes), Layer 3 (Top: 6 cubes) = 22 total
  const cubeCoords: [number, number, number][] = [
    // Bottom Layer (y = 0) - 8 cubes
    [-1, 0, -1], [0, 0, -1], [1, 0, -1],
    [-1, 0, 0], [0, 0, 0], [1, 0, 0],
    [-1, 0, 1], [0, 0, 1],
    // Middle Layer (y = 1) - 8 cubes
    [-1, 1, -1], [0, 1, -1], [1, 1, -1],
    [-1, 1, 0], [0, 1, 0], [1, 1, 0],
    [-1, 1, 1], [0, 1, 1],
    // Top Layer (y = 2) - 6 cubes
    [-1, 2, -1], [0, 2, -1], [1, 2, -1],
    [-1, 2, 0], [0, 2, 0], [1, 2, 0],
  ];

  const play = usePlay<{ count: number; xray: boolean; layerFilter: number }>({
    question,
    initial: { count: 0, xray: false, layerFilter: 3 },
    derive: (w) => {
      if (w.count === 0) return { note: "Inspect the 3D cube vault and tally the cubes across all layers." };
      return { value: `${w.count}`, optionId: matchNumber(question, w.count) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The 3D Cube Vault Inspector"
      mission="Orbit and inspect the multi-tier 3D isometric cube structure. Toggle X-ray or isolate individual layers (Top: 6, Middle: 8, Base: 8) to verify all hidden blocks and enter the complete count (22)."
      icon={Box}
      dim="3D"
      submitLabel="Submit Total Cube Count"
      hints={[
        "Use layer filters to inspect the top layer (6 cubes), middle layer (8 cubes), and base layer (8 cubes).",
        "Total = 6 + 8 + 8 = 22 cubes.",
      ]}
      live={
        <>
          <Gauge label="Inspected Tally" value={`${w.count}`} tone={w.count === 22 ? "emerald" : "indigo"} />
          <Gauge label="Layers Shown" value={`${w.layerFilter}/3`} tone="violet" />
        </>
      }
    >
      <Board>
        <World3D camera={{ position: [3.8, 3.8, 4.8], fov: 42 }} background="#f8fafc">
          <group position={[0, -0.6, 0]}>
            {cubeCoords
              .filter((c) => c[1] < w.layerFilter)
              .map((pos, i) => (
                <CubeMesh
                  key={i}
                  pos={pos}
                  color={pos[1] === 2 ? "#38bdf8" : pos[1] === 1 ? "#818cf8" : "#4f46e5"}
                  wireframe={w.xray}
                />
              ))}
          </group>
        </World3D>
      </Board>

      <Bay label="3D Layer Controls & Tally" tone="indigo">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Btn
              tone={w.xray ? "emerald" : "slate"}
              disabled={play.readOnly}
              onClick={() => play.patch({ xray: !w.xray })}
            >
              {w.xray ? "🔍 Solid View" : "👓 X-Ray View"}
            </Btn>
            <Btn
              tone="violet"
              disabled={play.readOnly}
              onClick={() => play.patch({ layerFilter: (w.layerFilter % 3) + 1 })}
            >
              🏢 Layer Filter: {w.layerFilter === 3 ? "All (3 Layers)" : `Top ${w.layerFilter}`}
            </Btn>
          </div>

          <div className="flex items-center gap-1">
            <Btn tone="slate" disabled={play.readOnly || w.count <= 0} onClick={() => play.patch({ count: Math.max(0, w.count - 1) })}>
              −1
            </Btn>
            <span className="font-mono text-base font-black text-indigo-900 px-2 min-w-[4rem] text-center">{w.count} cubes</span>
            <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ count: w.count + 1 })}>
              +1
            </Btn>
            <Btn tone="indigo" disabled={play.readOnly} onClick={() => play.patch({ count: 22 })}>
              Tally All (22)
            </Btn>
          </div>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q3 — The Codebreaker Machine (EXAMS=67249, SHARED=912563)
   Candidate decodes letter mapping and translates ASHRAM -> 291524.
   ══════════════════════════════════════════════════════════════════════ */

export function Q03CodebreakerMachineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const targetWord = "ASHRAM";
  const correctCode = "291524";

  const play = usePlay<{ dialed: string[]; translated: boolean }>({
    question,
    initial: { dialed: Array(targetWord.length).fill("_"), translated: false },
    derive: (w) => {
      const code = w.dialed.join("");
      if (code.includes("_")) return { note: "Deduce letter codes and assemble ASHRAM on the console." };
      return { value: code, optionId: matchText(question, code) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const setDigit = (idx: number, digit: string) => {
    const next = [...w.dialed];
    next[idx] = digit;
    play.patch({ dialed: next });
  };

  return (
    <Shell
      play={play}
      question={question}
      title="The Codebreaker Console"
      mission="Investigate the cipher transmissions EXAMS → 67249 and SHARED → 912563. Deduce the unique number for each letter and dial the translation for ASHRAM."
      icon={KeyRound}
      dim="2D"
      submitLabel="Submit Decrypted Code"
      hints={[
        "Look at common letters: 'S' is in both EXAMS and SHARED, matching '9'.",
        "In EXAMS (67249): E=6, X=7, A=2, M=4, S=9.",
        "In SHARED (912563): S=9, H=1, A=2, R=5, E=6, D=3.",
        "Therefore ASHRAM = A(2) S(9) H(1) R(5) A(2) M(4) = 291524.",
      ]}
      live={
        <>
          <Gauge label="Dialed Code" value={w.dialed.join("")} tone={w.dialed.join("") === correctCode ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        {/* Transmission Clues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 to-blue-50/60 border border-indigo-200 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 mb-1">Transmission 1</div>
            <div className="font-mono text-base font-black tracking-widest text-slate-800">E X A M S</div>
            <div className="font-mono text-base font-black tracking-widest text-indigo-600">6 7 2 4 9</div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 to-blue-50/60 border border-indigo-200 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 mb-1">Transmission 2</div>
            <div className="font-mono text-base font-black tracking-widest text-slate-800">S H A R E D</div>
            <div className="font-mono text-base font-black tracking-widest text-indigo-600">9 1 2 5 6 3</div>
          </div>
        </div>

        {/* Decoder Dials */}
        <div className="text-center font-bold text-xs text-slate-700 mb-2">Assemble Target Word: <span className="text-indigo-900 font-extrabold tracking-wider">ASHRAM</span></div>
        <div className="grid grid-cols-6 gap-2">
          {targetWord.split("").map((ch, i) => (
            <div key={i} className="p-2 rounded-xl border-2 border-indigo-100 bg-white text-center shadow-xs">
              <div className="font-mono text-xs font-bold text-slate-500">{ch}</div>
              <div className="font-mono text-2xl font-black text-indigo-900 my-1">{w.dialed[i]}</div>
              <div className="flex justify-center gap-1 flex-wrap">
                {["1", "2", "4", "5", "9"].map((d) => (
                  <button
                    key={d}
                    disabled={play.readOnly}
                    onClick={() => setDigit(i, d)}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-indigo-100 active:bg-indigo-200 text-xs font-bold text-slate-800 transition-colors"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Board>

      <Bay label="Quick Actions" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ dialed: ["2", "9", "1", "5", "2", "4"] })}>
          ⚡ Solve & Set 291524
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — The Fracture Window (2×2 Geometric Pattern Completion)
   Candidate tests 4 candidate tiles into missing bottom-right slot.
   Snaps correct tile C into place.
   ══════════════════════════════════════════════════════════════════════ */

export function Q04FractureWindowActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedTile: string | null; locked: boolean }>({
    question,
    initial: { selectedTile: null, locked: false },
    derive: (w) => {
      if (!w.selectedTile) return { note: "Select and slot a candidate tile into the missing bottom-right quadrant." };
      return { value: w.selectedTile, optionId: matchOption(question, w.selectedTile) ?? w.selectedTile };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Geometric Mandala Pattern"
      mission="A 2×2 geometric stained-glass pattern has a missing bottom-right tile. Test the candidate pieces to complete the diagonal symmetry, shaded quadrant, and concentric arcs."
      icon={LayoutGrid}
      dim="2D"
      submitLabel="Submit Matching Tile"
      hints={[
        "Check the inner concentric circle: the bottom-right tile must continue the circular arc.",
        "Check the diagonal division: the shading must mirror the top-left quadrant.",
        "Tile C provides the perfect continuous arcs and diagonal geometry.",
      ]}
      live={
        <>
          <Gauge label="Inserted Tile" value={w.selectedTile ?? "None"} tone={w.selectedTile === "C" ? "emerald" : "indigo"} />
          <Gauge label="Continuity Test" value={w.selectedTile === "C" ? "Valid (100%)" : w.selectedTile ? "Mismatch" : "Waiting"} tone={w.selectedTile === "C" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        {/* 2x2 Mandala Grid */}
        <div className="w-52 h-52 mx-auto grid grid-cols-2 grid-rows-2 gap-1.5 p-2 rounded-2xl bg-slate-100 border-2 border-indigo-200 shadow-sm">
          {/* Top-Left */}
          <div className="bg-white rounded-xl relative overflow-hidden border border-slate-200">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 0 100 A 100 100 0 0 1 100 0 L 100 100 Z" fill="#6366f1" opacity="0.8" />
              <path d="M 100 100 A 60 60 0 0 0 40 100 L 100 100 Z" fill="#38bdf8" />
              <line x1="0" y1="0" x2="100" y2="100" stroke="#1e1b4b" strokeWidth="2.5" />
            </svg>
          </div>
          {/* Top-Right */}
          <div className="bg-white rounded-xl relative overflow-hidden border border-slate-200">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 100 100 A 100 100 0 0 0 0 0 L 0 100 Z" fill="#4338ca" opacity="0.8" />
              <path d="M 0 100 A 60 60 0 0 1 60 100 L 0 100 Z" fill="#0284c7" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#1e1b4b" strokeWidth="2.5" />
            </svg>
          </div>
          {/* Bottom-Left */}
          <div className="bg-white rounded-xl relative overflow-hidden border border-slate-200">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 0 0 A 100 100 0 0 0 100 100 L 100 0 Z" fill="#4338ca" opacity="0.8" />
              <path d="M 100 0 A 60 60 0 0 1 40 0 L 100 0 Z" fill="#0284c7" />
              <line x1="0" y1="100" x2="100" y2="0" stroke="#1e1b4b" strokeWidth="2.5" />
            </svg>
          </div>
          {/* Bottom-Right (Slot) */}
          <div className={`rounded-xl relative overflow-hidden border-2 border-dashed ${w.selectedTile === "C" ? "border-emerald-500 bg-emerald-50/50" : "border-amber-400 bg-white"} flex items-center justify-center`}>
            {w.selectedTile === "C" ? (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M 100 0 A 100 100 0 0 1 0 100 L 0 0 Z" fill="#6366f1" opacity="0.8" />
                <path d="M 0 0 A 60 60 0 0 0 60 0 L 0 0 Z" fill="#38bdf8" />
                <line x1="100" y1="100" x2="0" y2="0" stroke="#1e1b4b" strokeWidth="2.5" />
              </svg>
            ) : (
              <span className="text-xs font-black text-amber-600">Slot {w.selectedTile ?? "?"}</span>
            )}
          </div>
        </div>
      </Board>

      <Bay label="Candidate Tiles" tone="indigo">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["A", "B", "C", "D"].map((opt) => (
            <Btn
              key={opt}
              tone={w.selectedTile === opt ? "emerald" : "slate"}
              disabled={play.readOnly}
              onClick={() => play.patch({ selectedTile: opt, locked: opt === "C" })}
            >
              Slot Candidate {opt}
            </Btn>
          ))}
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — The Solar System Relationship Chamber (Venn Diagram)
   Earth (Outer), India (Contained in Earth), Moon (Separate object).
   Candidate places relationship rings to derive Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q05SolarSystemVennActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ indiaInEarth: boolean; moonSeparate: boolean }>({
    question,
    initial: { indiaInEarth: false, moonSeparate: false },
    derive: (w) => {
      if (!w.indiaInEarth || !w.moonSeparate) {
        return { note: "Configure containment rings: India belongs inside Earth; Moon is completely separate." };
      }
      return { value: "Diagram D (India ⊂ Earth, Moon isolated)", optionId: "D" };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Celestial Venn Chamber"
      mission="Construct the logical containment relationship between 'Moon, Earth and India'. India is a country on Earth (proper subset), while the Moon is a separate astronomical body."
      icon={Globe2}
      dim="2D"
      submitLabel="Submit Venn Model"
      hints={[
        "India is located geographically inside Earth → India is a circle inside the Earth circle.",
        "Moon is a celestial satellite separate from Earth's terrestrial domain → Moon is an independent circle outside Earth.",
        "This configuration matches Diagram D.",
      ]}
      live={
        <>
          <Gauge label="India ⊂ Earth" value={w.indiaInEarth ? "True" : "False"} tone={w.indiaInEarth ? "emerald" : "amber"} />
          <Gauge label="Moon Disjoint" value={w.moonSeparate ? "True" : "False"} tone={w.moonSeparate ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="h-56" className="bg-gradient-to-br from-indigo-50/30 via-white to-sky-50/40">
          <svg viewBox="0 0 240 130" className="w-full h-full">
            {/* Earth Circle */}
            <circle cx="85" cy="65" r="48" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2.5" />
            <text x="85" y="32" fill="#1e40af" fontSize="9" fontWeight="bold" textAnchor="middle">
              🌍 Earth
            </text>

            {/* India Circle inside Earth */}
            {w.indiaInEarth && (
              <g>
                <circle cx="85" cy="75" r="24" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
                <text x="85" y="78" fill="#065f46" fontSize="8" fontWeight="bold" textAnchor="middle">
                  🇮🇳 India
                </text>
              </g>
            )}

            {/* Moon Circle */}
            {w.moonSeparate && (
              <g>
                <circle cx="185" cy="65" r="28" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" />
                <text x="185" y="69" fill="#334155" fontSize="9" fontWeight="bold" textAnchor="middle">
                  🌙 Moon
                </text>
              </g>
            )}
          </svg>
        </PlayCanvas>
      </Board>

      <Bay label="Relational Assembly" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn
            tone={w.indiaInEarth ? "emerald" : "slate"}
            disabled={play.readOnly}
            onClick={() => play.patch({ indiaInEarth: !w.indiaInEarth })}
          >
            {w.indiaInEarth ? "✓ India inside Earth" : "Place India inside Earth"}
          </Btn>
          <Btn
            tone={w.moonSeparate ? "emerald" : "slate"}
            disabled={play.readOnly}
            onClick={() => play.patch({ moonSeparate: !w.moonSeparate })}
          >
            {w.moonSeparate ? "✓ Moon Separate" : "Place Moon Disjoint"}
          </Btn>
          <Btn tone="indigo" disabled={play.readOnly} onClick={() => play.patch({ indiaInEarth: true, moonSeparate: true })}>
            ⚡ Complete Containment Model
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

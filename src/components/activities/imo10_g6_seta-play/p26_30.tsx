"use client";

import React from "react";
import { Scan, Pentagon, Pickaxe, Box, Compass, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper, World3D } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — Collinearity Laser Scanner
   Collinear points = 15 (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q26CollinearScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ collinearCount: number }>({
    question,
    initial: { collinearCount: 15 },
    derive: (w) => {
      const c = w?.collinearCount ?? 0;
      if (c === 15) {
        return {
          value: "15",
          optionId: matchText(question, "15"),
        };
      }
      return { note: `Counted: ${c} collinear sets. Sweep laser line along diagram lines.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const c = play.world?.collinearCount ?? 15;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Geometry Line Laser Scanner"
      mission="Sweep the laser inspection beam across all diagram line segments: detect and tally all collinear point combinations (15 collinear points)."
      icon={Scan}
      dim="2D"
      submitLabel="Submit Collinear Count (15 / Option C)"
      hints={[
        "Collinear points are 3 or more points lying on the exact same straight line.",
        "Total distinct collinear point combinations = 15 (Option C).",
      ]}
      live={
        <>
          <Gauge label="Laser Beam" value="Active" tone="sky" />
          <Gauge label="Collinear Points" value={c} tone={c === 15 ? "emerald" : "amber"} />
          <Gauge label="Status" value={c === 15 ? "All Lines Scanned ✓" : "Scanning..."} tone={c === 15 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[10, 12, 15, 18].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => play.patch({ collinearCount: n })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                c === n
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {n} {n === 15 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — Prime Polygon Builder
   Least two consecutive primes = 2 + 3 = 5 sides (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q27PrimePolygonActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ sides: number }>({
    question,
    initial: { sides: 5 },
    derive: (w) => {
      const s = w?.sides ?? 0;
      if (s === 5) {
        return {
          value: "5",
          optionId: matchText(question, "5"),
        };
      }
      return { note: `Polygon sides: ${s}. Add the two least consecutive primes (2 + 3).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const sides = play.world?.sides ?? 5;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Prime Polygon Construction Machine"
      mission="Collect the two least consecutive prime numbers (2 and 3): add them in the physical reactor (2 + 3 = 5) to synthesize a 5-sided polygon (Pentagon)."
      icon={Pentagon}
      dim="2D"
      submitLabel="Build & Submit Polygon (5 sides / Option B)"
      hints={[
        "The first two consecutive prime numbers are 2 and 3.",
        "Sum = 2 + 3 = 5.",
        "A polygon with 5 sides is a regular pentagon (Option B).",
      ]}
      live={
        <>
          <Gauge label="Prime 1" value="2" tone="sky" />
          <Gauge label="Prime 2" value="3" tone="sky" />
          <Gauge label="Sum / Sides" value={`${sides} (Pentagon)`} tone={sides === 5 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[4, 5, 6, 7].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => play.patch({ sides: s })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                sides === s
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s} sides {s === 5 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — Prime Mining Expedition
   Primes between 16-80 (16) + between 90-100 (1) = 17 (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q28PrimeMinerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ primeCount: number }>({
    question,
    initial: { primeCount: 17 },
    derive: (w) => {
      const p = w?.primeCount ?? 0;
      if (p === 17) {
        return {
          value: "17",
          optionId: matchText(question, "17"),
        };
      }
      return { note: `Mined: ${p} primes. Collect primes in 16–80 and 90–100.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const p = play.world?.primeCount ?? 17;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Prime Mining Expedition"
      mission="Drive the mining rover across numbered rocks: mine primes between 16–80 (16 primes) and between 90–100 (97 is 1 prime) -> Total 17 primes."
      icon={Pickaxe}
      dim="2D"
      submitLabel="Submit Total Primes (17 / Option C)"
      hints={[
        "Primes between 16 and 80: 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79 (16 primes).",
        "Primes between 90 and 100: 97 (1 prime).",
        "Total primes = 16 + 1 = 17 primes (Option C).",
      ]}
      live={
        <>
          <Gauge label="Range 16–80" value="16 Primes" tone="sky" />
          <Gauge label="Range 90–100" value="1 Prime (97)" tone="indigo" />
          <Gauge label="Total Primes" value={p} tone={p === 17 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[15, 16, 17, 18].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => play.patch({ primeCount: n })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                p === n
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {n} {n === 17 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q29 — 3D Solid Identification Factory
   5 faces, 8 edges, 5 vertices => Square/Rectangular Pyramid (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q29SolidIdentificationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedSolid: string }>({
    question,
    initial: { selectedSolid: "Square/Rectangular Pyramid" },
    derive: (w) => {
      const s = w?.selectedSolid ?? "Square/Rectangular Pyramid";
      if (s === "Square/Rectangular Pyramid") {
        return {
          value: "Square/Rectangular Pyramid",
          optionId: matchText(question, "Square/Rectangular Pyramid"),
        };
      }
      return { note: `Inspected: ${s}. Scanner requires F=5, E=8, V=5.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const solid = play.world?.selectedSolid ?? "Square/Rectangular Pyramid";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Solid Polyhedron Factory"
      mission="Scan geometric features: identify which 3D solid possesses exactly 5 faces (1 base + 4 triangular sides), 8 edges and 5 vertices (Square Pyramid)."
      icon={Box}
      dim="3D"
      submitLabel="Submit Polyhedron (Square Pyramid / Option A)"
      hints={[
        "Square/Rectangular Pyramid: 1 square base + 4 triangular faces = 5 faces.",
        "Edges: 4 base edges + 4 slant edges = 8 edges.",
        "Vertices: 4 base corners + 1 top apex = 5 vertices.",
        "Satisfies Euler's formula: F + V = E + 2 (5 + 5 = 8 + 2 = 10).",
      ]}
      live={
        <>
          <Gauge label="Faces (F)" value="5" tone="sky" />
          <Gauge label="Edges (E)" value="8" tone="indigo" />
          <Gauge label="Vertices (V)" value="5" tone="sky" />
          <Gauge label="Identified Solid" value={solid} tone={solid === "Square/Rectangular Pyramid" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <World3D height="240px" camera={{ position: [3, 3, 4], fov: 45 }}>
          {/* 3D Pyramid Mesh */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <coneGeometry args={[1.5, 2.2, 4]} />
            <meshStandardMaterial color="#4f46e5" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
        </World3D>

        <div className="grid grid-cols-2 gap-2">
          {[
            "Square/Rectangular Pyramid",
            "Triangular Prism",
            "Tetrahedron",
            "Pentagonal Pyramid",
          ].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => play.patch({ selectedSolid: name })}
              className={`py-2.5 px-2 rounded-xl font-bold text-xs border transition-all text-center ${
                solid === name
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {name} {name === "Square/Rectangular Pyramid" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — 3D Angle Construction Laboratory
   Sum = Obtuse angle. Not possible: Two right angles (90° + 90° = 180° straight) => Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q30AngleLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedCombination: string }>({
    question,
    initial: { selectedCombination: "Two right angles" },
    derive: (w) => {
      const c = w?.selectedCombination ?? "Two right angles";
      if (c === "Two right angles") {
        return {
          value: "Two right angles",
          optionId: matchText(question, "Two right angles"),
        };
      }
      return { note: `Combination: ${c}. Test whether sum can form an obtuse angle (90° < θ < 180°).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const comb = play.world?.selectedCombination ?? "Two right angles";

  return (
    <Shell
      play={play}
      question={question}
      title="Angle Construction Laboratory"
      mission="Test angle combinations: determine which pair CANNOT sum to an obtuse angle (90° < θ < 180°). Two right angles produce 180° (straight angle) -> Option D."
      icon={Compass}
      dim="2D"
      submitLabel="Submit Impossible Pair (Two right angles / Option D)"
      hints={[
        "Obtuse angle definition: strictly greater than 90° and strictly less than 180°.",
        "Two right angles = 90° + 90° = 180° (Straight angle, NOT obtuse).",
        "Therefore, Two right angles is IMPOSSIBLE (Option D).",
      ]}
      live={
        <>
          <Gauge label="Obtuse Range" value="90° < θ < 180°" tone="sky" />
          <Gauge label="Two Right Angles" value="90° + 90° = 180°" tone="rose" />
          <Gauge label="Result" value={comb} tone={comb === "Two right angles" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="space-y-2">
          {[
            { text: "One acute and one right angle", sum: "< 180°", possible: true },
            { text: "One acute and one obtuse angle", sum: "can be < 180°", possible: true },
            { text: "Two acute angles", sum: "can be > 90° (e.g. 50°+50°=100°)", possible: true },
            { text: "Two right angles", sum: "90° + 90° = 180° (Straight)", impossible: true },
          ].map((item) => (
            <button
              key={item.text}
              type="button"
              onClick={() => play.patch({ selectedCombination: item.text })}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                comb === item.text
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{item.text}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${comb === item.text ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {item.sum} {item.impossible ? "✗ (Impossible)" : ""}
              </span>
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

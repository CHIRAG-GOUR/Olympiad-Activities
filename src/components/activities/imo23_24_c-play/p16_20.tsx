"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitCommit, Zap, Compass, Sparkles, Building2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — The Line Intersection Observatory (Intersecting Line Pairs)
   Lines r, s, p, q with labeled crossings.
   Candidate activates intersection sensors to count 3 unique pairs (B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q16LineIntersectionObservatoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ detectedPairs: number }>({
    question,
    initial: { detectedPairs: 0 },
    derive: (w) => {
      if (w.detectedPairs === 0) return { note: "Activate sensors at all line crossing junctions." };
      return { value: `${w.detectedPairs}`, optionId: matchNumber(question, w.detectedPairs) ?? (w.detectedPairs === 3 ? "B" : undefined) };
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
      title="The Line Intersection Observatory"
      mission="Inspect the intersecting lines r, s, p, q. Activate the junction optical sensors where two lines cross to tally the exact count of unique intersecting line pairs."
      icon={GitCommit}
      dim="2D"
      submitLabel="Submit Intersecting Pairs"
      hints={[
        "Lines r and s are parallel (0 intersections).",
        "Line p intersects lines r and s (2 pairs: (p,r), (p,s)).",
        "Line q intersects line p at a third distinct point (1 pair: (p,q)).",
        "Total unique intersecting pairs = 3 pairs.",
      ]}
      live={
        <>
          <Gauge label="Junctions Sensor Tally" value={`${w.detectedPairs}`} tone={w.detectedPairs === 3 ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-center border border-slate-700">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Parallel lines r and s */}
            <line x1="20" y1="35" x2="180" y2="35" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="185" y="38" fill="#38bdf8" fontSize="10" fontWeight="bold">r</text>

            <line x1="20" y1="85" x2="180" y2="85" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="185" y="88" fill="#38bdf8" fontSize="10" fontWeight="bold">s</text>

            {/* Transversal line p */}
            <line x1="50" y1="10" x2="150" y2="110" stroke="#a855f7" strokeWidth="2.5" />
            <text x="155" y="115" fill="#a855f7" fontSize="10" fontWeight="bold">p</text>

            {/* Line q intersecting p */}
            <line x1="30" y1="110" x2="170" y2="60" stroke="#f59e0b" strokeWidth="2" />
            <text x="175" y="63" fill="#f59e0b" fontSize="10" fontWeight="bold">q</text>

            {/* Active sensor dots */}
            {w.detectedPairs >= 1 && <circle cx="75" cy="35" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />}
            {w.detectedPairs >= 2 && <circle cx="125" cy="85" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />}
            {w.detectedPairs >= 3 && <circle cx="106" cy="66" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />}
          </svg>
        </div>
      </Board>

      <Bay label="Sensor Scanner" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="slate" disabled={play.readOnly || w.detectedPairs <= 0} onClick={() => play.patch({ detectedPairs: Math.max(0, w.detectedPairs - 1) })}>
            − Sensor
          </Btn>
          <Btn tone="indigo" disabled={play.readOnly || w.detectedPairs >= 3} onClick={() => play.patch({ detectedPairs: Math.min(3, w.detectedPairs + 1) })}>
            + Detect Intersection
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ detectedPairs: 3 })}>
            🎯 Lock All 3 Intersecting Pairs
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — The Integer Power Challenge (Maximum Value)
   A: -5 + 7 - 17 + 0 = -15
   B: 25 - 31 + 15 - 6 = 3 (MAXIMUM)
   C: -18 - 37 + 45 + 5 = -5
   D: 50 - 45 - 40 + 15 = -20
   Candidate runs conveyors to compare values -> Option B.
   ══════════════════════════════════════════════════════════════════════ */

export function Q17IntegerPowerChallengeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const expressions = [
    { label: "A", expr: "-5 + 7 - 17 + 0", val: -15 },
    { label: "B", expr: "25 - 31 + 15 - 6", val: 3 },
    { label: "C", expr: "-18 - 37 + 45 + 5", val: -5 },
    { label: "D", expr: "50 - 45 - 40 + 15", val: -20 },
  ];

  const play = usePlay<{ calculated: boolean; maxOption: string | null }>({
    question,
    initial: { calculated: false, maxOption: null },
    derive: (w) => {
      if (!w.calculated) return { note: "Calculate the integer sum towers to find the maximum value." };
      return { value: "Option B (Value = +3)", optionId: "B" };
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
      title="The Integer Conveyor Tower"
      mission="Evaluate the four signed arithmetic expressions on four conveyor engines. Determine which calculation tower yields the maximum algebraic value."
      icon={Zap}
      dim="2D"
      submitLabel="Submit Maximum Expression"
      hints={[
        "Calculate A: -5 + 7 - 17 + 0 = 2 - 17 = -15.",
        "Calculate B: 25 - 31 + 15 - 6 = -6 + 15 - 6 = 9 - 6 = +3.",
        "Calculate C: -18 - 37 + 45 + 5 = -55 + 50 = -5.",
        "Calculate D: 50 - 45 - 40 + 15 = 5 - 40 + 15 = -20.",
        "+3 is the only positive value and therefore the greatest.",
      ]}
      live={
        <>
          <Gauge label="Greatest Output" value={w.calculated ? "Option B (+3)" : "Evaluating"} tone={w.calculated ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {expressions.map((e) => (
            <div
              key={e.label}
              className={`p-2 rounded-xl border text-center flex flex-col justify-between ${w.calculated && e.label === "B" ? "bg-emerald-950/80 border-emerald-400" : "bg-slate-900 border-slate-700"}`}
            >
              <div className="text-[10px] font-bold text-slate-400">Tower {e.label}</div>
              <div className="text-[10px] font-mono text-slate-300 my-1">{e.expr}</div>
              <div className="font-mono text-base font-black text-sky-400">{w.calculated ? (e.val > 0 ? `+${e.val}` : e.val) : "---"}</div>
            </div>
          ))}
        </div>
      </Board>

      <Bay label="Conveyor Engine" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ calculated: true, maxOption: "B" })}>
          ⚡ Run Conveyor Calculations & Identify Maximum (Tower B)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — The Angle Observatory (Obtuse Angles)
   Rays meeting at point O forming various angle sectors.
   Candidate scans rays to count 4 obtuse angles (B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q18AngleObservatoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ obtuseCount: number }>({
    question,
    initial: { obtuseCount: 0 },
    derive: (w) => {
      if (w.obtuseCount === 0) return { note: "Scan all angle sectors around vertex O (angles between 90° and 180°)." };
      return { value: `${w.obtuseCount}`, optionId: matchNumber(question, w.obtuseCount) ?? (w.obtuseCount === 4 ? "B" : undefined) };
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
      title="The Angle Observatory"
      mission="Scan all pair-wise ray sectors originating from vertex O. Use the optical angle probe to detect and tally all obtuse angles (strictly greater than 90° and less than 180°)."
      icon={Compass}
      dim="2D"
      submitLabel="Submit Obtuse Angle Count"
      hints={[
        "An obtuse angle measures between 90° and 180°.",
        "Check adjacent and compound ray pairs around vertex O.",
        "There are exactly 4 distinct obtuse angle combinations in the given figure.",
      ]}
      live={
        <>
          <Gauge label="Obtuse Angles Found" value={`${w.obtuseCount}`} tone={w.obtuseCount === 4 ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-2 flex items-center justify-center border border-slate-700">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Rays from (100, 70) */}
            <line x1="100" y1="70" x2="170" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="100" y1="70" x2="150" y2="20" stroke="#818cf8" strokeWidth="2.5" />
            <line x1="100" y1="70" x2="100" y2="15" stroke="#a855f7" strokeWidth="2.5" />
            <line x1="100" y1="70" x2="40" y2="25" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="100" y1="70" x2="30" y2="70" stroke="#ec4899" strokeWidth="2.5" />

            <circle cx="100" cy="70" r="4" fill="#fff" />
            <text x="96" y="85" fill="#cbd5e1" fontSize="10" fontWeight="bold">O</text>

            {/* Obtuse Arc Indicators */}
            {w.obtuseCount >= 1 && <path d="M 140 70 A 40 40 0 0 0 65 37" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />}
          </svg>
        </div>
      </Board>

      <Bay label="Angle Scanner" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="slate" disabled={play.readOnly || w.obtuseCount <= 0} onClick={() => play.patch({ obtuseCount: Math.max(0, w.obtuseCount - 1) })}>
            − 1
          </Btn>
          <Btn tone="indigo" disabled={play.readOnly || w.obtuseCount >= 4} onClick={() => play.patch({ obtuseCount: Math.min(4, w.obtuseCount + 1) })}>
            + Detect Obtuse Angle
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ obtuseCount: 4 })}>
            🎯 Lock All 4 Obtuse Angles
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — The Symmetry Scanner (Numbers: 3 5 1 0 6 7)
   Digits tested for horizontal/vertical symmetry lines.
   Digits '3' (horizontal line) and '0' (horizontal & vertical) -> 2 digits.
   ══════════════════════════════════════════════════════════════════════ */

export function Q19SymmetryScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const digits = [
    { d: "3", sym: true, line: "Horizontal" },
    { d: "5", sym: false, line: "None" },
    { d: "1", sym: false, line: "None" },
    { d: "0", sym: true, line: "Dual (H + V)" },
    { d: "6", sym: false, line: "None" },
    { d: "7", sym: false, line: "None" },
  ];

  const play = usePlay<{ scanned: boolean; count: number }>({
    question,
    initial: { scanned: false, count: 0 },
    derive: (w) => {
      if (!w.scanned) return { note: "Scan all 6 digits for lines of reflectional symmetry." };
      return { value: `${w.count}`, optionId: matchNumber(question, w.count) ?? (w.count === 2 ? "B" : undefined) };
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
      title="The Symmetry Scanner"
      mission="Send the digits 3, 5, 1, 0, 6, 7 through a dual-axis symmetry laser. Determine how many of these digits possess at least one line of symmetry."
      icon={Sparkles}
      dim="2D"
      submitLabel="Submit Symmetric Count"
      hints={[
        "Digit '3' has 1 horizontal line of symmetry.",
        "Digit '0' has 2 lines of symmetry (horizontal and vertical).",
        "Digits 5, 1, 6, 7 have no lines of symmetry in standard sans-serif typography.",
        "Total numbers with symmetry = 2 (Option B).",
      ]}
      live={
        <>
          <Gauge label="Symmetric Digits" value={w.scanned ? `${w.count}` : "0"} tone={w.count === 2 ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-6 gap-1.5">
          {digits.map((item) => (
            <div
              key={item.d}
              className={`p-2 rounded-xl border text-center ${w.scanned ? (item.sym ? "bg-emerald-950/80 border-emerald-400" : "bg-slate-900 border-slate-700 opacity-60") : "bg-slate-900 border-slate-700"}`}
            >
              <div className="font-mono text-2xl font-black text-indigo-200">{item.d}</div>
              <div className="text-[9px] font-bold text-slate-400 mt-1">
                {w.scanned ? (item.sym ? `✓ ${item.line}` : "✗ No Axis") : "Pending"}
              </div>
            </div>
          ))}
        </div>
      </Board>

      <Bay label="Scanner Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ scanned: true, count: 2 })}>
          ⚡ Scan Symmetries & Vault Valid Digits (2)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — The Architecture Floor Lab (Area of Composite Figure)
   Stepped polygon with dimensions: (6×3) + (2×1.5) + (2×2)... = 25 sq cm.
   Candidate decomposes shape into rectangles to calculate 25 sq cm (C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q20ArchitectureFloorLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ decomposed: boolean; calculatedArea: number }>({
    question,
    initial: { decomposed: false, calculatedArea: 0 },
    derive: (w) => {
      if (w.calculatedArea === 0) return { note: "Decompose composite stepped floor into rectangles and calculate area." };
      return { value: `${w.calculatedArea} sq. cm`, optionId: matchText(question, `${w.calculatedArea}`) ?? "C" };
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
      title="The Architecture Floor Lab"
      mission="The architectural blueprint shows a stepped polygon with perimeter dimensions (2cm, 1.5cm, 3cm, 1cm, 2cm, 3cm, 6cm). Decompose the floor into rectangular sections and compute the exact total area."
      icon={Building2}
      dim="2D"
      submitLabel="Submit Calculated Area"
      hints={[
        "Divide the stepped shape into 3 vertical or horizontal rectangular blocks.",
        "Block 1: 6 cm × 3 cm = 18 sq. cm.",
        "Block 2: 2 cm × 2 cm = 4 sq. cm.",
        "Block 3: 2 cm × 1.5 cm = 3 sq. cm.",
        "Total Area = 18 + 4 + 3 = 25 sq. cm.",
      ]}
      live={
        <>
          <Gauge label="Decomposition" value={w.decomposed ? "3 Rectangles" : "Single Polygon"} tone="violet" />
          <Gauge label="Total Area" value={w.calculatedArea ? `${w.calculatedArea} sq. cm` : "---"} tone={w.calculatedArea === 25 ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-2 flex items-center justify-center border border-slate-700">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Stepped Polygon */}
            <path
              d="M 40 100 L 160 100 L 160 40 L 120 40 L 120 60 L 80 60 L 80 80 L 40 80 Z"
              fill={w.decomposed ? "#4338ca" : "#312e81"}
              stroke="#6366f1"
              strokeWidth="2"
            />
            {w.decomposed && (
              <>
                <line x1="80" y1="80" x2="80" y2="100" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="120" y1="60" x2="120" y2="100" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="55" y="93" fill="#bae6fd" fontSize="8" fontWeight="bold">3 cm²</text>
                <text x="95" y="83" fill="#bae6fd" fontSize="8" fontWeight="bold">4 cm²</text>
                <text x="135" y="73" fill="#bae6fd" fontSize="8" fontWeight="bold">18 cm²</text>
              </>
            )}
          </svg>
        </div>
      </Board>

      <Bay label="Architect Tools" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="violet" disabled={play.readOnly} onClick={() => play.patch({ decomposed: true })}>
            📐 Decompose into 3 Rectangles
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly || !w.decomposed} onClick={() => play.patch({ calculatedArea: 25 })}>
            ⚡ Calculate Total Area (25 sq. cm)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

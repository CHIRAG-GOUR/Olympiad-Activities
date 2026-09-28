"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitCommit, Zap, Compass, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, PlayCanvas } from "./kit";

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
      mission="Inspect the intersecting lines r, s, p, q. Activate the optical junction sensors where two lines cross to tally the exact count of unique intersecting line pairs (3 pairs)."
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
        <PlayCanvas height="h-56" className="bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/40">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Parallel lines r and s */}
            <line x1="20" y1="35" x2="180" y2="35" stroke="#3b82f6" strokeWidth="2.5" />
            <text x="185" y="38" fill="#1e40af" fontSize="11" fontWeight="bold">r</text>

            <line x1="20" y1="85" x2="180" y2="85" stroke="#3b82f6" strokeWidth="2.5" />
            <text x="185" y="88" fill="#1e40af" fontSize="11" fontWeight="bold">s</text>

            {/* Transversal line p */}
            <line x1="50" y1="10" x2="150" y2="110" stroke="#8b5cf6" strokeWidth="2.5" />
            <text x="155" y="115" fill="#6d28d9" fontSize="11" fontWeight="bold">p</text>

            {/* Line q intersecting p */}
            <line x1="30" y1="110" x2="170" y2="60" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="175" y="63" fill="#b45309" fontSize="11" fontWeight="bold">q</text>

            {/* Active sensor dots */}
            {w.detectedPairs >= 1 && (
              <g>
                <circle cx="75" cy="35" r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="75" y="26" fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle">p × r</text>
              </g>
            )}
            {w.detectedPairs >= 2 && (
              <g>
                <circle cx="125" cy="85" r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="125" y="98" fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle">p × s</text>
              </g>
            )}
            {w.detectedPairs >= 3 && (
              <g>
                <circle cx="106" cy="66" r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="120" y="63" fill="#047857" fontSize="8" fontWeight="bold">p × q</text>
              </g>
            )}
          </svg>
        </PlayCanvas>
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
      title="The Integer Comparison Calculator"
      mission="Evaluate the four signed integer expressions on four calculation towers. Determine which arithmetic tower yields the maximum algebraic value (+3 from Tower B)."
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {expressions.map((e) => (
            <div
              key={e.label}
              className={`p-3 rounded-xl border text-center flex flex-col justify-between transition-all ${w.calculated && e.label === "B" ? "bg-emerald-50 border-emerald-400 shadow-sm" : "bg-white border-slate-200 shadow-xs"}`}
            >
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Tower {e.label}</div>
              <div className="text-xs font-mono font-bold text-slate-800 my-1.5">{e.expr}</div>
              <div className={`font-mono text-lg font-black ${w.calculated && e.label === "B" ? "text-emerald-700" : "text-indigo-900"}`}>
                {w.calculated ? (e.val > 0 ? `+${e.val}` : e.val) : "---"}
              </div>
            </div>
          ))}
        </div>
      </Board>

      <Bay label="Calculation Engine" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ calculated: true, maxOption: "B" })}>
          ⚡ Calculate All Expressions & Identify Maximum (Tower B)
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
      title="The Angle Protractor & Sector Scanner"
      mission="Scan all pair-wise ray sectors originating from vertex O. Use the angle scanner to detect and tally all obtuse angles (strictly greater than 90° and less than 180°)."
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
        <PlayCanvas height="h-56" className="bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/40">
          <svg viewBox="0 0 220 130" className="w-full h-full">
            {/* Rays from (110, 80) */}
            <line x1="110" y1="80" x2="190" y2="80" stroke="#0284c7" strokeWidth="2.5" />
            <text x="195" y="84" fill="#0369a1" fontSize="10" fontWeight="bold">A</text>

            <line x1="110" y1="80" x2="170" y2="25" stroke="#4f46e5" strokeWidth="2.5" />
            <text x="174" y="24" fill="#3730a3" fontSize="10" fontWeight="bold">B</text>

            <line x1="110" y1="80" x2="110" y2="15" stroke="#7c3aed" strokeWidth="2.5" />
            <text x="106" y="10" fill="#5b21b6" fontSize="10" fontWeight="bold">C</text>

            <line x1="110" y1="80" x2="40" y2="30" stroke="#d97706" strokeWidth="2.5" />
            <text x="28" y="32" fill="#92400e" fontSize="10" fontWeight="bold">D</text>

            <line x1="110" y1="80" x2="25" y2="80" stroke="#dc2626" strokeWidth="2.5" />
            <text x="14" y="84" fill="#991b1b" fontSize="10" fontWeight="bold">E</text>

            <circle cx="110" cy="80" r="5" fill="#1e1b4b" />
            <text x="106" y="98" fill="#1e1b4b" fontSize="11" fontWeight="bold">O</text>

            {/* Obtuse Arc Indicators */}
            {w.obtuseCount >= 1 && <path d="M 160 80 A 50 50 0 0 0 68 45" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />}
          </svg>
        </PlayCanvas>
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
    { d: "3", sym: true, line: "Horizontal Axis" },
    { d: "5", sym: false, line: "No Axis" },
    { d: "1", sym: false, line: "No Axis" },
    { d: "0", sym: true, line: "Dual Axis (H + V)" },
    { d: "6", sym: false, line: "No Axis" },
    { d: "7", sym: false, line: "No Axis" },
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
      title="The Reflectional Symmetry Inspector"
      mission="Send the numbers 3, 5, 1, 0, 6, 7 through the symmetry axis scanner. Determine how many of these digits possess at least one line of reflectional symmetry (2 digits: '3' and '0')."
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
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {digits.map((item) => (
            <div
              key={item.d}
              className={`p-3 rounded-xl border text-center transition-all ${w.scanned ? (item.sym ? "bg-emerald-50 border-emerald-400 shadow-xs" : "bg-slate-50 border-slate-200 opacity-60") : "bg-white border-indigo-100 shadow-xs"}`}
            >
              <div className="font-mono text-3xl font-black text-indigo-950">{item.d}</div>
              <div className="text-[10px] font-bold text-slate-600 mt-1.5">
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
      title="The Stepped Composite Area Workshop"
      mission="The architectural blueprint shows a stepped polygon with perimeter dimensions (2cm, 1.5cm, 3cm, 1cm, 2cm, 3cm, 6cm). Decompose the floor into rectangular sections and compute the exact total area (25 sq. cm)."
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
        <PlayCanvas height="h-56" className="bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/40">
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Stepped Polygon */}
            <path
              d="M 40 105 L 160 105 L 160 40 L 120 40 L 120 60 L 80 60 L 80 80 L 40 80 Z"
              fill={w.decomposed ? "#c7d2fe" : "#e0e7ff"}
              stroke="#4f46e5"
              strokeWidth="2.5"
            />
            {w.decomposed && (
              <g>
                <line x1="80" y1="80" x2="80" y2="105" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="120" y1="60" x2="120" y2="105" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                <rect x="48" y="88" width="24" height="14" rx="3" fill="#ffffff" stroke="#cbd5e1" />
                <text x="60" y="98" fill="#1e40af" fontSize="8" fontWeight="bold" textAnchor="middle">3 cm²</text>
                <rect x="88" y="78" width="24" height="14" rx="3" fill="#ffffff" stroke="#cbd5e1" />
                <text x="100" y="88" fill="#1e40af" fontSize="8" fontWeight="bold" textAnchor="middle">4 cm²</text>
                <rect x="128" y="68" width="26" height="14" rx="3" fill="#ffffff" stroke="#cbd5e1" />
                <text x="141" y="78" fill="#1e40af" fontSize="8" fontWeight="bold" textAnchor="middle">18 cm²</text>
              </g>
            )}
          </svg>
        </PlayCanvas>
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

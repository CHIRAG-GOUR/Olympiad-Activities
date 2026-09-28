"use client";

import React from "react";
import { LayoutGrid, PieChart, Sparkles, Frame, Scale, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — E-Shaped Area Construction
   Split into rectangles: Total Area = 15 cm² (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q21EShapedAreaActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ calculatedArea: number }>({
    question,
    initial: { calculatedArea: 15 },
    derive: (w) => {
      const a = w?.calculatedArea ?? 0;
      if (a === 15) {
        return {
          value: "15 cm²",
          optionId: matchText(question, "15 cm²"),
        };
      }
      return { note: `Calculated Area: ${a} cm². Decompose E-shape into vertical and horizontal bars.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const a = play.world?.calculatedArea ?? 15;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Construction-Site Area Game"
      mission="Decompose the E-shaped perimeter into non-overlapping rectangular blocks: sum the rectangular area segments to derive 15 cm²."
      icon={LayoutGrid}
      dim="2D"
      submitLabel="Submit Total Area (15 cm² / Option B)"
      hints={[
        "Vertical spine: 7 cm × 1 cm = 7 cm².",
        "Top horizontal bar (excluding spine): 3 cm × 1 cm = 3 cm².",
        "Middle horizontal bar (excluding spine): 2 cm × 1 cm = 2 cm².",
        "Bottom horizontal bar (excluding spine): 3 cm × 1 cm = 3 cm².",
        "Total Area = 7 + 3 + 2 + 3 = 15 cm² (Option B).",
      ]}
      live={
        <>
          <Gauge label="Vertical Spine" value="7 cm²" tone="sky" />
          <Gauge label="Horizontal Arms" value="8 cm²" tone="indigo" />
          <Gauge label="Total Area" value={`${a} cm²`} tone={a === 15 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="240px">
          <svg className="w-full h-full" viewBox="0 0 360 200">
            {/* Grid */}
            <defs>
              <pattern id="q21grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="200" fill="url(#q21grid)" />

            {/* E-Shape Geometry */}
            <g transform="translate(120, 30)">
              {/* Vertical Spine */}
              <rect x="0" y="0" width="25" height="140" fill="#4f46e5" stroke="#312e81" strokeWidth="2" rx="2" />
              {/* Top Arm */}
              <rect x="25" y="0" width="60" height="25" fill="#0284c7" stroke="#0369a1" strokeWidth="2" rx="2" />
              {/* Middle Arm */}
              <rect x="25" y="55" width="45" height="25" fill="#059669" stroke="#047857" strokeWidth="2" rx="2" />
              {/* Bottom Arm */}
              <rect x="25" y="115" width="60" height="25" fill="#d97706" stroke="#b45309" strokeWidth="2" rx="2" />

              {/* Labels */}
              <text x="12" y="75" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">7</text>
              <text x="55" y="17" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>
              <text x="47" y="72" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
              <text x="55" y="132" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>
            </g>
          </svg>
        </PlayCanvas>

        <div className="grid grid-cols-4 gap-2">
          {[12, 15, 18, 20].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => play.patch({ calculatedArea: val })}
              className={`py-2.5 rounded-xl font-mono text-sm font-black border transition-all ${
                a === val
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {val} cm² {val === 15 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — Fraction Shading Lab
   Match fractions in Column I with Column II => Option C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q22FractionShadingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedMatch: string }>({
    question,
    initial: { selectedMatch: "P-4, Q-3, R-2, S-1" },
    derive: (w) => {
      const m = w?.selectedMatch ?? "P-4, Q-3, R-2, S-1";
      if (m === "P-4, Q-3, R-2, S-1") {
        return {
          value: "P-4, Q-3, R-2, S-1",
          optionId: matchText(question, "P-4, Q-3, R-2, S-1"),
        };
      }
      return { note: `Mapping: ${m}. Connect each numerical fraction to shaded disc.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const match = play.world?.selectedMatch ?? "P-4, Q-3, R-2, S-1";

  return (
    <Shell
      play={play}
      question={question}
      title="Tactile Fraction Shading Laboratory"
      mission="Connect fraction values in Column I to their exact shaded geometric segment representations in Column II -> Option C."
      icon={PieChart}
      dim="2D"
      submitLabel="Submit Fraction Matching (Option C)"
      hints={[
        "Calculate shaded area ratio for each shape.",
        "Matches: P-4, Q-3, R-2, S-1 (Option C).",
      ]}
      live={
        <>
          <Gauge label="Column I" value="4 Fractions" tone="sky" />
          <Gauge label="Column II" value="4 Shaded Shapes" tone="indigo" />
          <Gauge label="Matching Code" value={match} tone={match === "P-4, Q-3, R-2, S-1" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "P-2, Q-4, R-1, S-3",
            "P-3, Q-1, R-4, S-2",
            "P-4, Q-3, R-2, S-1",
            "P-1, Q-2, R-3, S-4",
          ].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => play.patch({ selectedMatch: opt })}
              className={`p-3 rounded-xl font-mono text-xs font-bold border transition-all text-center ${
                match === opt
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt} {opt === "P-4, Q-3, R-2, S-1" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — 3D Symmetry Gallery
   10 symmetrical figures out of 10 => Option B (10).
   ══════════════════════════════════════════════════════════════════════ */

export function Q23SymmetryGalleryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ symmetricCount: number }>({
    question,
    initial: { symmetricCount: 10 },
    derive: (w) => {
      const c = w?.symmetricCount ?? 0;
      if (c === 10) {
        return {
          value: "10",
          optionId: matchText(question, "10"),
        };
      }
      return { note: `Counted: ${c} symmetric shapes. Scan each figure across vertical/horizontal planes.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const c = play.world?.symmetricCount ?? 10;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Symmetry Scanner Gallery"
      mission="Audit all 10 geometrical figures rotating on pedestals: test each with the bilateral reflection plane to verify that all 10 are symmetrical."
      icon={Sparkles}
      dim="2D"
      submitLabel="Submit Symmetrical Count (10 / Option B)"
      hints={[
        "Each of the 10 provided figures has at least one axis of bilateral or radial symmetry.",
        "Total symmetrical shapes = 10 (Option B).",
      ]}
      live={
        <>
          <Gauge label="Total Objects" value="10 Figures" tone="sky" />
          <Gauge label="Reflection Plane" value="Bilateral Active" tone="indigo" />
          <Gauge label="Symmetric Count" value={c} tone={c === 10 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[8, 10, 7, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => play.patch({ symmetricCount: n })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                c === n
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {n} {n === 10 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — Framed Picture Architect
   Outer 12x10, 2cm border on all sides -> (12-4)x(10-4) = 8x6 = 48 cm² (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q24FramedPictureActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ innerArea: number }>({
    question,
    initial: { innerArea: 48 },
    derive: (w) => {
      const a = w?.innerArea ?? 0;
      if (a === 48) {
        return {
          value: "48 cm²",
          optionId: matchText(question, "48 cm²"),
        };
      }
      return { note: `Inner area: ${a} cm². Subtract 2 cm border from both sides.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const a = play.world?.innerArea ?? 48;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Framing Workshop Architect"
      mission="Outer frame measures 12 cm × 10 cm with a uniform 2 cm border width. Strip the frame borders to calculate inner picture area (8 cm × 6 cm = 48 cm²)."
      icon={Frame}
      dim="2D"
      submitLabel="Submit Picture Area (48 cm² / Option A)"
      hints={[
        "Outer Length = 12 cm, Outer Breadth = 10 cm.",
        "Inner Length = 12 − 2(2) = 12 − 4 = 8 cm.",
        "Inner Breadth = 10 − 2(2) = 10 − 4 = 6 cm.",
        "Area of Inner Picture = 8 × 6 = 48 cm² (Option A).",
      ]}
      live={
        <>
          <Gauge label="Inner Length" value="8 cm" tone="sky" />
          <Gauge label="Inner Breadth" value="6 cm" tone="sky" />
          <Gauge label="Picture Area" value={`${a} cm²`} tone={a === 48 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="220px">
          <svg className="w-full h-full" viewBox="0 0 360 180">
            <g transform="translate(100, 20)">
              {/* Outer Frame */}
              <rect x="0" y="0" width="160" height="140" fill="#d97706" stroke="#b45309" strokeWidth="2" rx="4" />
              {/* Inner Picture */}
              <rect x="25" y="25" width="110" height="90" fill="#f8fafc" stroke="#4f46e5" strokeWidth="2" rx="2" />
              <text x="80" y="75" fill="#312e81" fontSize="13" fontWeight="bold" textAnchor="middle">
                8 cm × 6 cm = 48 cm²
              </text>
            </g>
          </svg>
        </PlayCanvas>

        <div className="grid grid-cols-4 gap-2">
          {[48, 54, 60, 72].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => play.patch({ innerArea: v })}
              className={`py-2.5 rounded-xl font-mono text-sm font-black border transition-all ${
                a === v
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {v} cm² {v === 48 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — 3D Integer Balance Scale
   Box A: -37 vs Box B: -55 => -37 > -55 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q25IntegerBalanceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ comparator: string }>({
    question,
    initial: { comparator: ">" },
    derive: (w) => {
      const c = w?.comparator ?? ">";
      if (c === ">") {
        return {
          value: ">",
          optionId: matchText(question, ">"),
        };
      }
      return { note: `Comparator: ${c}. Compare Box A (-37) and Box B (-55).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const comp = play.world?.comparator ?? ">";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Integer Balance Scale"
      mission="Evaluate expressions in Box A and Box B: Box A = (−3)−74+(−42)−(−82) = −37; Box B = (−12)+(−43) = −55. Since −37 > −55, determine >."
      icon={Scale}
      dim="2D"
      submitLabel="Submit Comparison (> / Option A)"
      hints={[
        "Box A: -3 - 74 - 42 + 82 = -119 + 82 = -37.",
        "Box B: -12 - 43 = -55.",
        "On the number line, -37 lies to the right of -55, so -37 > -55 (Option A).",
      ]}
      live={
        <>
          <Gauge label="Box A Value" value="−37" tone="sky" />
          <Gauge label="Box B Value" value="−55" tone="indigo" />
          <Gauge label="Comparison" value={`−37 ${comp} −55`} tone={comp === ">" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white rounded-xl border border-indigo-100 text-center shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase">Box A</div>
            <div className="font-mono text-base font-black text-indigo-950 mt-1">−37</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-indigo-100 text-center shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase">Box B</div>
            <div className="font-mono text-base font-black text-indigo-950 mt-1">−55</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[">", "<", "=", "Cannot be determined"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => play.patch({ comparator: c })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all text-center ${
                comp === c
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c} {c === ">" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

"use client";

import React, { useRef } from "react";
import { Disc, Grid, Users, Calculator, Navigation, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper, World3D } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — 3D Circle Orbit Observatory
   Arrangement of circles -> Total = 7 circles (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q11CircleObservatoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ circlesCounted: number }>({
    question,
    initial: { circlesCounted: 7 },
    derive: (w) => {
      const c = w?.circlesCounted ?? 0;
      if (c === 7) {
        return {
          value: "7",
          optionId: matchText(question, "7") ?? "A",
        };
      }
      return { note: `Counted: ${c} circles. Trace each complete circle ring.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const c = play.world?.circlesCounted ?? 7;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Circle Orbit Observatory"
      mission="Rotate the multi-ring orbital geometry in 3D: trace every distinct, complete circular hoop to determine the total count (7 circles)."
      icon={Disc}
      dim="2D"
      submitLabel="Submit Circle Count (7 / Option A)"
      hints={[
        "Count only unbroken, full circular perimeters.",
        "Center ring: 1 circle.",
        "Outer interconnected symmetric rings: 6 circles.",
        "Total = 1 + 6 = 7 circles (Option A).",
      ]}
      live={
        <>
          <Gauge label="Center Ring" value="1" tone="sky" />
          <Gauge label="Outer Rings" value="6" tone="indigo" />
          <Gauge label="Total Circles" value={c} tone={c === 7 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="240px">
          <svg className="w-full h-full" viewBox="0 0 400 220">
            {/* Center Circle */}
            <circle cx="200" cy="110" r="45" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
            <circle cx="200" cy="110" r="4" fill="#4f46e5" />

            {/* 6 Surrounding Intersecting Circles */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = 200 + 45 * Math.cos(rad);
              const y = 110 + 45 * Math.sin(rad);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="45" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.85" />
                  <circle cx={x} cy={y} r="3" fill="#0284c7" />
                </g>
              );
            })}
          </svg>
        </PlayCanvas>

        <div className="flex justify-center">
          <Stepper
            value={c}
            min={1}
            max={15}
            onChange={(v) => play.patch({ circlesCounted: v })}
            label="Circles Counted"
          />
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — 3D Missing Corner Puzzle (Figure Completion)
   Complete Fig. (X) -> Option A.
   ══════════════════════════════════════════════════════════════════════ */

export function Q12MissingCornerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedCorner: string }>({
    question,
    initial: { selectedCorner: "A" },
    derive: (w) => {
      const cor = w?.selectedCorner ?? "A";
      if (cor === "A") {
        return {
          value: "Option A",
          optionId: matchText(question, "Option A") ?? "A",
        };
      }
      return { note: `Corner piece: ${cor}. Rotate and snap into missing quadrant.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const cor = play.world?.selectedCorner ?? "A";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Missing Corner Architectural Puzzle"
      mission="Inspect the 4-quadrant geometric tile: rotate and snap the candidate missing piece into quadrant 4 to complete Fig. (X) -> Option A."
      icon={Grid}
      dim="2D"
      submitLabel="Snap & Submit Piece (Option A)"
      hints={[
        "Follow arc continuity and diagonal symmetric lines across quadrants.",
        "Option A has the exact arc radius and inward pointing corner arrow.",
      ]}
      live={
        <>
          <Gauge label="Missing Quadrant" value="Bottom-Right" tone="sky" />
          <Gauge label="Fitted Piece" value={`Option ${cor}`} tone={cor === "A" ? "emerald" : "amber"} />
          <Gauge label="Tile Continuity" value={cor === "A" ? "Continuous 100% ✓" : "Broken Line"} tone={cor === "A" ? "emerald" : "rose"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {["A", "B", "C", "D"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => play.patch({ selectedCorner: id })}
              className={`py-3 rounded-xl font-black text-sm border transition-all ${
                cor === id
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Option {id} {id === "A" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — 3D Classroom Queue (Ranking & Ordering)
   14th from top, 26th from bottom => 14 + 26 - 1 = 39 (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q13ClassroomQueueActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ totalStudents: number }>({
    question,
    initial: { totalStudents: 39 },
    derive: (w) => {
      const tot = w?.totalStudents ?? 0;
      if (tot === 39) {
        return {
          value: "39",
          optionId: matchText(question, "39") ?? "B",
        };
      }
      return { note: `Assembly total: ${tot}. Formula: Top(14) + Bottom(26) - 1.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const tot = play.world?.totalStudents ?? 39;

  return (
    <Shell
      play={play}
      question={question}
      title="School Assembly Queue Ranking"
      mission="Position Naman in the assembly queue: 14th from the top and 26th from the bottom. Derive the total class strength (39 students)."
      icon={Users}
      dim="2D"
      submitLabel="Submit Class Total (39 / Option B)"
      hints={[
        "Total students = (Rank from top) + (Rank from bottom) − 1.",
        "Total = 14 + 26 − 1 = 40 − 1 = 39 students (Option B).",
      ]}
      live={
        <>
          <Gauge label="Rank from Top" value="14th" tone="sky" />
          <Gauge label="Rank from Bottom" value="26th" tone="sky" />
          <Gauge label="Total Strength" value={`${tot} Students`} tone={tot === 39 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="bg-white rounded-xl border border-indigo-100 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Top Rank: 14</span>
            <span className="font-extrabold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Naman (Position 14 / Bottom 26)
            </span>
            <span className="text-slate-500">Bottom Rank: 26</span>
          </div>

          <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-center font-mono text-xs text-indigo-950 font-bold">
            Total Formula: 14 + 26 − 1 = <span className="text-emerald-700 text-sm font-extrabold">39</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[38, 39, 40, 41].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => play.patch({ totalStudents: n })}
              className={`py-2.5 rounded-xl font-mono text-sm font-black border transition-all ${
                tot === n
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {n} {n === 39 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — Custom Multiplication Arcade Machine
   8*7=56, 9*6=54, 8*3=24 => 8*5 = 40 (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q14MultiplicationMachineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ calculatedProduct: number }>({
    question,
    initial: { calculatedProduct: 40 },
    derive: (w) => {
      const p = w?.calculatedProduct ?? 0;
      if (p === 40) {
        return {
          value: "40",
          optionId: matchText(question, "40") ?? "B",
        };
      }
      return { note: `Calculated: ${p}. Feed 8 and 5 into gear multiplication slots.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const p = play.world?.calculatedProduct ?? 40;

  return (
    <Shell
      play={play}
      question={question}
      title="Custom Multiplication Machine"
      mission="Demonstrate multiplication through physical number gears: 8×7=56, 9×6=54, 8×3=24. Compute the value of 8×5 = 40."
      icon={Calculator}
      dim="2D"
      submitLabel="Compute & Submit 40 (Option B)"
      hints={[
        "Standard arithmetic multiplication is preserved across all sample slots.",
        "8 × 5 = 40 (Option B).",
      ]}
      live={
        <>
          <Gauge label="Slot 1" value="8 × 7 = 56" tone="sky" />
          <Gauge label="Slot 2" value="9 × 6 = 54" tone="sky" />
          <Gauge label="Target Slot" value="8 × 5" tone="indigo" />
          <Gauge label="Product" value={p} tone={p === 40 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[35, 40, 45, 48].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => play.patch({ calculatedProduct: n })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                p === n
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {n} {n === 40 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — School Navigation Maze
   5 km East, left 3 km, right 5 km, left turn => Facing North (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q15NavigationMazeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ finalHeading: string }>({
    question,
    initial: { finalHeading: "North" },
    derive: (w) => {
      const h = w?.finalHeading ?? "North";
      if (h === "North") {
        return {
          value: "North",
          optionId: matchText(question, "North") ?? "C",
        };
      }
      return { note: `Heading: ${h}. Follow path: East 5km -> Left 3km -> Right 5km -> Left.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const h = play.world?.finalHeading ?? "North";

  return (
    <Shell
      play={play}
      question={question}
      title="3D School Campus Navigation Maze"
      mission="Navigate Raju along the exact trail: East 5 km ➔ Left (North) 3 km ➔ Right (East) 5 km ➔ Left turn. Determine his final heading (North)."
      icon={Navigation}
      dim="2D"
      submitLabel="Submit Final Heading (North / Option C)"
      hints={[
        "Step 1: Starts facing East (5 km).",
        "Step 2: Turns Left → now facing North (3 km).",
        "Step 3: Turns Right → now facing East (5 km).",
        "Step 4: Turns Left → now facing North (Option C).",
      ]}
      live={
        <>
          <Gauge label="Path Segment 1" value="East 5 km" tone="sky" />
          <Gauge label="Path Segment 2" value="North 3 km" tone="sky" />
          <Gauge label="Path Segment 3" value="East 5 km" tone="sky" />
          <Gauge label="Final Heading" value={h} tone={h === "North" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="240px">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid */}
            <defs>
              <pattern id="q15grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#q15grid)" />

            {/* Path */}
            <g transform="translate(60, 140)">
              {/* Start */}
              <circle cx="0" cy="0" r="5" fill="#4f46e5" />
              <text x="-5" y="18" fill="#312e81" fontSize="10" fontWeight="bold">Start</text>

              {/* East 5km */}
              <line x1="0" y1="0" x2="100" y2="0" stroke="#4f46e5" strokeWidth="3" />
              <text x="50" y="-8" fill="#4f46e5" fontSize="10" textAnchor="middle">5 km E</text>

              {/* North 3km (up in SVG) */}
              <line x1="100" y1="0" x2="100" y2="-60" stroke="#0284c7" strokeWidth="3" />
              <text x="125" y="-30" fill="#0284c7" fontSize="10" textAnchor="middle">3 km N</text>

              {/* East 5km */}
              <line x1="100" y1="-60" x2="200" y2="-60" stroke="#059669" strokeWidth="3" />
              <text x="150" y="-68" fill="#059669" fontSize="10" textAnchor="middle">5 km E</text>

              {/* Left turn Arrow (pointing North) */}
              <line x1="200" y1="-60" x2="200" y2="-100" stroke="#e11d48" strokeWidth="3.5" strokeDasharray="5 3" />
              <polygon points="195,-95 200,-105 205,-95" fill="#e11d48" />
              <text x="215" y="-85" fill="#e11d48" fontSize="11" fontWeight="bold">Facing North ✓</text>
            </g>
          </svg>
        </PlayCanvas>

        <div className="grid grid-cols-4 gap-2">
          {["East", "West", "North", "South"].map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => play.patch({ finalHeading: dir })}
              className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                h === dir
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {dir} {dir === "North" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Clock, Fuel, ShieldCheck, Ruler } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — The Algebra Balance Chamber ("Twice product = thrice difference")
   2mn = 3(m - n) -> Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q26AlgebraBalanceChamberActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ leftAssembled: boolean; rightAssembled: boolean }>({
    question,
    initial: { leftAssembled: false, rightAssembled: false },
    derive: (w) => {
      if (!w.leftAssembled || !w.rightAssembled) {
        return { note: "Assemble left (Twice product of m, n) and right (Thrice difference of m, n) balance pans." };
      }
      return { value: "2mn = 3(m - n)", optionId: "D" };
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
      title="The Algebra Balance Chamber"
      mission="Translate the verbal mathematical statement into a balanced algebraic equation: 'Twice the product of m and n is equal to thrice of their difference'."
      icon={Scale}
      dim="2D"
      submitLabel="Submit Algebraic Equation"
      hints={[
        "'Product of m and n' = mn. 'Twice the product' = 2mn.",
        "'Difference of m and n' = (m − n). 'Thrice of their difference' = 3(m − n).",
        "Setting them equal yields: 2mn = 3(m − n) (Option D).",
      ]}
      live={
        <>
          <Gauge label="Left Pan" value={w.leftAssembled ? "2mn" : "Empty"} tone="violet" />
          <Gauge label="Right Pan" value={w.rightAssembled ? "3(m − n)" : "Empty"} tone="indigo" />
          <Gauge label="Balance State" value={w.leftAssembled && w.rightAssembled ? "Equilibrium (2mn = 3(m-n))" : "Unbalanced"} tone={w.leftAssembled && w.rightAssembled ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          {/* Left Pan */}
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 text-center w-36">
            <div className="text-[10px] font-bold text-slate-400 mb-1">LEFT PAN (Twice Product)</div>
            <div className="font-mono text-xl font-black text-sky-400">{w.leftAssembled ? "2mn" : "---"}</div>
          </div>

          <div className="font-mono text-3xl font-black text-emerald-400">=</div>

          {/* Right Pan */}
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 text-center w-36">
            <div className="text-[10px] font-bold text-slate-400 mb-1">RIGHT PAN (Thrice Diff)</div>
            <div className="font-mono text-xl font-black text-violet-400">{w.rightAssembled ? "3(m − n)" : "---"}</div>
          </div>
        </div>
      </Board>

      <Bay label="Balance Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="sky" disabled={play.readOnly} onClick={() => play.patch({ leftAssembled: true })}>
            Place 2mn on Left
          </Btn>
          <Btn tone="violet" disabled={play.readOnly} onClick={() => play.patch({ rightAssembled: true })}>
            Place 3(m − n) on Right
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ leftAssembled: true, rightAssembled: true })}>
            ⚡ Balance Equation (2mn = 3(m − n))
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — The Clockwork Tower (1/4 of a revolution)
   1 revolution = 360°. 1/4 revolution = 90° (Right angle between hands).
   Clock A shows 90° angle -> Option A.
   ══════════════════════════════════════════════════════════════════════ */

export function Q27ClockworkTowerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedClock: string | null; angleDeg: number }>({
    question,
    initial: { selectedClock: null, angleDeg: 0 },
    derive: (w) => {
      if (!w.selectedClock) return { note: "Inspect clock hands to find the one spanning 1/4 revolution (90°)." };
      return { value: `Clock ${w.selectedClock} (90°)`, optionId: matchOption(question, w.selectedClock) ?? w.selectedClock };
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
      title="The Clockwork Revolution Tower"
      mission="1 complete revolution of a clock hand is 360° (12 hour units). Identify the clock face where the angle between the hour and minute hands measures exactly 1/4 of a revolution (90°)."
      icon={Clock}
      dim="2D"
      submitLabel="Submit 1/4 Turn Clock"
      hints={[
        "1 revolution = 360°.",
        "1/4 revolution = 360° ÷ 4 = 90° (3 hours separation on clock dial).",
        "Clock A (e.g. 3:00 / 9:00 position) shows an exact 90° right angle.",
      ]}
      live={
        <>
          <Gauge label="Inspected Clock" value={w.selectedClock ?? "None"} tone={w.selectedClock === "A" ? "emerald" : "indigo"} />
          <Gauge label="Hand Angle" value={w.angleDeg ? `${w.angleDeg}°` : "---"} tone={w.angleDeg === 90 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          {["A", "B", "C", "D"].map((clk) => (
            <div
              key={clk}
              className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 ${w.selectedClock === clk ? "bg-emerald-950/80 border-emerald-400" : "bg-slate-800 border-slate-700"}`}
            >
              <span className="text-[10px] font-bold text-slate-400">Clock {clk}</span>
              <div className="w-16 h-16 rounded-full border-2 border-indigo-400 bg-indigo-950/60 relative flex items-center justify-center">
                {/* Center pin */}
                <div className="w-2 h-2 rounded-full bg-amber-400 z-10" />
                {/* Hand 1 (12 o'clock) */}
                <div className="absolute top-2 w-0.5 h-6 bg-sky-400" />
                {/* Hand 2: Clock A = 3 o'clock (90°), B = 6 o'clock (180°), C = 4 o'clock (120°), D = 2 o'clock (60°) */}
                <div
                  className="absolute w-0.5 h-5 bg-pink-400 origin-bottom"
                  style={{
                    transform: `rotate(${clk === "A" ? 90 : clk === "B" ? 180 : clk === "C" ? 120 : 60}deg)`,
                    bottom: "50%",
                  }}
                />
              </div>
              <span className="text-[9px] font-mono text-emerald-300 font-bold">
                {clk === "A" ? "90° (1/4)" : clk === "B" ? "180° (1/2)" : clk === "C" ? "120°" : "60°"}
              </span>
            </div>
          ))}
        </div>
      </Board>

      <Bay label="Clock Selector" tone="indigo">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["A", "B", "C", "D"].map((opt) => (
            <Btn
              key={opt}
              tone={w.selectedClock === opt ? "emerald" : "slate"}
              disabled={play.readOnly}
              onClick={() => play.patch({ selectedClock: opt, angleDeg: opt === "A" ? 90 : opt === "B" ? 180 : opt === "C" ? 120 : 60 })}
            >
              Select Clock {opt}
            </Btn>
          ))}
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — The Decimal Fuel Station (0.5 / 0.05 + 0.05 / 0.5)
   Term 1: 0.5 / 0.05 = 50 / 5 = 10
   Term 2: 0.05 / 0.5 = 5 / 50 = 0.1
   Total = 10 + 0.1 = 10.1 (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q28DecimalFuelStationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ valvesOpened: boolean; total: number }>({
    question,
    initial: { valvesOpened: false, total: 0 },
    derive: (w) => {
      if (w.total === 0) return { note: "Open valves to meter decimal tank quotients." };
      return { value: `${w.total}`, optionId: matchNumber(question, w.total) ?? "B" };
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
      title="The Decimal Fuel Station"
      mission="Operate the calibrated precision valves on the decimal tank system to evaluate: (0.5 ÷ 0.05) + (0.05 ÷ 0.5)."
      icon={Fuel}
      dim="2D"
      submitLabel="Submit Decimal Sum (10.1)"
      hints={[
        "First term: 0.5 ÷ 0.05 = (0.5 × 100) ÷ (0.05 × 100) = 50 ÷ 5 = 10.",
        "Second term: 0.05 ÷ 0.5 = (0.05 × 10) ÷ (0.5 × 10) = 0.5 ÷ 5 = 0.1.",
        "Sum = 10 + 0.1 = 10.1 (Option B).",
      ]}
      live={
        <>
          <Gauge label="Tank 1 (0.5÷0.05)" value={w.valvesOpened ? "10.0" : "0.0"} tone="violet" />
          <Gauge label="Tank 2 (0.05÷0.5)" value={w.valvesOpened ? "0.1" : "0.0"} tone="indigo" />
          <Gauge label="Combined Volume" value={w.total ? `${w.total}` : "0.0"} tone={w.total === 10.1 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 text-center w-36">
            <div className="text-[10px] font-bold text-slate-400 mb-1">0.5 ÷ 0.05</div>
            <div className="font-mono text-2xl font-black text-sky-400">{w.valvesOpened ? "10" : "---"}</div>
          </div>

          <div className="font-mono text-3xl font-black text-amber-400">+</div>

          <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 text-center w-36">
            <div className="text-[10px] font-bold text-slate-400 mb-1">0.05 ÷ 0.5</div>
            <div className="font-mono text-2xl font-black text-violet-400">{w.valvesOpened ? "0.1" : "---"}</div>
          </div>
        </div>
      </Board>

      <Bay label="Valve Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ valvesOpened: true, total: 10.1 })}>
          ⚡ Open Valves & Combine Flow (10.1)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q29 — The Number Security Lock (455?656 divisible by 3)
   Sum of known digits = 4 + 5 + 5 + 6 + 5 + 6 = 31.
   31 + ? must be multiple of 3. Smallest whole number is ? = 2 (31 + 2 = 33) -> Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q29NumberSecurityLockActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const baseSum = 31;
  const play = usePlay<{ dialedDigit: number }>({
    question,
    initial: { dialedDigit: 0 },
    derive: (w) => {
      const sum = baseSum + w.dialedDigit;
      if (sum % 3 !== 0) return { note: `Sum = ${sum} is not divisible by 3. Adjust dial.` };
      return { value: `${w.dialedDigit}`, optionId: matchNumber(question, w.dialedDigit) ?? (w.dialedDigit === 2 ? "D" : undefined) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const currentSum = baseSum + w.dialedDigit;
  const isDiv3 = currentSum % 3 === 0;

  return (
    <Shell
      play={play}
      question={question}
      title="The Security Lock Dial (Divisibility by 3)"
      mission="The security lock sequence is 455?656. A number is divisible by 3 if the sum of its digits is a multiple of 3. Turn the central dial to find the smallest whole number (0–9) that unlocks the vault."
      icon={ShieldCheck}
      dim="2D"
      submitLabel="Submit Smallest Digit (2)"
      hints={[
        "Sum of known digits: 4 + 5 + 5 + 6 + 5 + 6 = 31.",
        "Test digits: 31 + 0 = 31 (No), 31 + 1 = 32 (No), 31 + 2 = 33 (Yes: 33 ÷ 3 = 11).",
        "Smallest whole digit is 2 (Option D).",
      ]}
      live={
        <>
          <Gauge label="Missing Digit ?" value={`${w.dialedDigit}`} tone={w.dialedDigit === 2 ? "emerald" : "indigo"} />
          <Gauge label="Digit Sum" value={`${currentSum}`} tone="violet" />
          <Gauge label="Vault Status" value={isDiv3 ? "UNLOCKED (Divisible by 3)" : "LOCKED"} tone={isDiv3 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-between items-center border border-slate-700">
          <div className="flex items-center gap-2 font-mono text-2xl font-black text-slate-300">
            <span>4</span>
            <span>5</span>
            <span>5</span>
            <span className={`px-2 py-0.5 rounded-lg border-2 ${isDiv3 ? "bg-emerald-950 border-emerald-400 text-emerald-300" : "bg-amber-950 border-amber-400 text-amber-300"}`}>
              {w.dialedDigit}
            </span>
            <span>6</span>
            <span>5</span>
            <span>6</span>
          </div>

          <div className="font-mono text-xs font-bold text-slate-400">
            Digit Sum: 31 + {w.dialedDigit} = {currentSum} ({isDiv3 ? "Multiple of 3" : "Not a multiple of 3"})
          </div>
        </div>
      </Board>

      <Bay label="Dial Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-1.5 justify-center">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button
              key={d}
              disabled={play.readOnly}
              onClick={() => play.patch({ dialedDigit: d })}
              className={`w-8 h-8 rounded-lg font-mono font-bold text-xs border ${w.dialedDigit === d ? "bg-indigo-600 border-indigo-300 text-white" : "bg-slate-800 border-slate-700 text-slate-300"}`}
            >
              {d}
            </button>
          ))}
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ dialedDigit: 2 })}>
            🎯 Lock Smallest Valid (2)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — The Tile Border Factory (Perimeter of Shaded Grid)
   Each grid tile = 4 cm × 4 cm.
   Exposed outer edges = 24 edges.
   Perimeter = 24 × 4 cm = 96 cm -> Option C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q30TileBorderFactoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const edgeCount = 24;
  const edgeSize = 4;
  const play = usePlay<{ measured: boolean }>({
    question,
    initial: { measured: false },
    derive: (w) => {
      if (!w.measured) return { note: "Walk perimeter robot around shaded boundary to count exposed tile edges." };
      return { value: "96 cm", optionId: matchText(question, "96 cm") ?? "C" };
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
      title="The Tile Perimeter Surveyor"
      mission="The shaded shape is formed on a square tile grid where each unit square has side 4 cm. Walk the boundary to count all exposed outer unit edges and calculate the total perimeter in cm."
      icon={Ruler}
      dim="2D"
      submitLabel="Submit Perimeter (96 cm)"
      hints={[
        "Count the exposed perimeter unit segment edges around the boundary.",
        "Total exposed edges = 24 edges.",
        "Each unit edge = 4 cm.",
        "Perimeter = 24 × 4 cm = 96 cm (Option C).",
      ]}
      live={
        <>
          <Gauge label="Exposed Edges" value={w.measured ? "24 edges" : "Uncounted"} tone="violet" />
          <Gauge label="Unit Tile Side" value="4 cm" tone="indigo" />
          <Gauge label="Total Perimeter" value={w.measured ? "96 cm" : "---"} tone={w.measured ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-center border border-slate-700">
          <svg viewBox="0 0 160 120" className="w-44 h-36">
            <defs>
              <pattern id="tileGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="none" stroke="#334155" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="160" height="120" fill="url(#tileGrid)" />

            {/* Shaded Shape Path */}
            <path
              d="M 32 32 L 80 32 L 80 48 L 112 48 L 112 80 L 64 80 L 64 64 L 32 64 Z"
              fill="#4338ca"
              stroke={w.measured ? "#10b981" : "#818cf8"}
              strokeWidth={w.measured ? "3" : "1.5"}
            />
          </svg>
        </div>
      </Board>

      <Bay label="Surveyor Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ measured: true })}>
          🤖 Walk Perimeter Robot & Measure (24 edges × 4 cm = 96 cm)
        </Btn>
      </Bay>
    </Shell>
  );
}

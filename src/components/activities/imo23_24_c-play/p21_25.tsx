"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Lock, Landmark, BarChart3, Shirt } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — The Fraction Rollercoaster (Fractions in Ascending Order)
   Fractions: 1/2 (0.5), 7/18 (0.389), 5/9 (0.556), 7/27 (0.259)
   Ascending order: 7/27 < 7/18 < 1/2 < 5/9 -> Option A / C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q21FractionRollercoasterActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const fractions = [
    { text: "7/27", val: 0.259 },
    { text: "7/18", val: 0.389 },
    { text: "1/2", val: 0.5 },
    { text: "5/9", val: 0.556 },
  ];

  const play = usePlay<{ ordered: boolean }>({
    question,
    initial: { ordered: false },
    derive: (w) => {
      if (!w.ordered) return { note: "Sort fraction carriages from lowest to highest decimal value on the track." };
      return { value: "7/27, 7/18, 1/2, 5/9", optionId: "A" };
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
      title="The Fraction Track Rollercoaster"
      mission="Compare the four fraction carriages (1/2, 7/18, 5/9, 7/27). Calculate common denominator (54) or decimal equivalents to arrange them in strict ascending order from left to right."
      icon={MoveRight}
      dim="2D"
      submitLabel="Submit Ascending Order"
      hints={[
        "Convert to common denominator 54: 7/27 = 14/54, 7/18 = 21/54, 1/2 = 27/54, 5/9 = 30/54.",
        "Comparing numerators: 14 < 21 < 27 < 30.",
        "Ascending sequence: 7/27, 7/18, 1/2, 5/9.",
      ]}
      live={
        <>
          <Gauge label="Track Order" value={w.ordered ? "Ascending" : "Unsorted"} tone={w.ordered ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-between border border-slate-700">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>◀ Smallest (0)</span>
            <span>Largest (1) ▶</span>
          </div>

          <div className="flex items-center justify-around gap-2 my-auto">
            {fractions.map((f, i) => (
              <div
                key={f.text}
                className={`p-2.5 rounded-xl border text-center transition-all ${w.ordered ? "bg-emerald-950/80 border-emerald-400" : "bg-slate-800 border-slate-600"}`}
              >
                <div className="font-mono text-base font-black text-sky-300">{f.text}</div>
                {w.ordered && <div className="text-[10px] font-mono text-emerald-400">≈ {f.val}</div>}
              </div>
            ))}
          </div>

          <div className="text-center text-xs font-mono font-bold text-indigo-300">
            {w.ordered ? "14/54 < 21/54 < 27/54 < 30/54" : "Common Denominator: 54"}
          </div>
        </div>
      </Board>

      <Bay label="Track Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ ordered: true })}>
          ⚡ Align Fractions in Ascending Order
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — The Divisibility Vault (Smallest number diminished by 3)
   LCM(21, 28, 36, 45) = 1260.
   Smallest number N such that N - 3 = 1260 => N = 1263 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q22DivisibilityVaultActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ candidate: number; gatesPassed: number }>({
    question,
    initial: { candidate: 1260, gatesPassed: 0 },
    derive: (w) => {
      const diff = w.candidate - 3;
      const valid = diff > 0 && diff % 21 === 0 && diff % 28 === 0 && diff % 36 === 0 && diff % 45 === 0;
      if (!valid) return { note: "Find number N such that (N - 3) is divisible by 21, 28, 36, and 45." };
      return { value: `${w.candidate}`, optionId: matchNumber(question, w.candidate) ?? "A" };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const diff = w.candidate - 3;
  const g21 = diff > 0 && diff % 21 === 0;
  const g28 = diff > 0 && diff % 28 === 0;
  const g36 = diff > 0 && diff % 36 === 0;
  const g45 = diff > 0 && diff % 45 === 0;

  return (
    <Shell
      play={play}
      question={question}
      title="The Divisibility Security Vault"
      mission="Find the smallest positive integer N which, when diminished by 3 (N − 3), passes all four modularity gates: divisible by 21, 28, 36, and 45 simultaneously."
      icon={Lock}
      dim="2D"
      submitLabel="Submit Smallest Candidate"
      hints={[
        "Calculate LCM(21, 28, 36, 45).",
        "Prime factors: 21 = 3×7, 28 = 2²×7, 36 = 2²×3², 45 = 3²×5.",
        "LCM = 2² × 3² × 5 × 7 = 4 × 9 × 35 = 1260.",
        "Number N = LCM + 3 = 1260 + 3 = 1263.",
      ]}
      live={
        <>
          <Gauge label="Candidate N" value={`${w.candidate}`} tone={w.candidate === 1263 ? "emerald" : "indigo"} />
          <Gauge label="N − 3" value={`${diff}`} tone="violet" />
          <Gauge label="LCM Match" value={g21 && g28 && g36 && g45 ? "Passed All 4" : "Failed"} tone={g21 && g28 && g36 && g45 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-between border border-slate-700">
          <div className="text-center font-mono text-xl font-black text-sky-400">
            Testing Candidate: {w.candidate} (N − 3 = {diff})
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className={`p-2 rounded-lg text-center border ${g21 ? "bg-emerald-950 border-emerald-400 text-emerald-300" : "bg-slate-800 border-slate-600 text-slate-400"}`}>
              <div className="text-[10px] font-bold">GATE ÷21</div>
              <div className="font-mono text-xs">{g21 ? "✓ OPEN" : "✗ LOCKED"}</div>
            </div>
            <div className={`p-2 rounded-lg text-center border ${g28 ? "bg-emerald-950 border-emerald-400 text-emerald-300" : "bg-slate-800 border-slate-600 text-slate-400"}`}>
              <div className="text-[10px] font-bold">GATE ÷28</div>
              <div className="font-mono text-xs">{g28 ? "✓ OPEN" : "✗ LOCKED"}</div>
            </div>
            <div className={`p-2 rounded-lg text-center border ${g36 ? "bg-emerald-950 border-emerald-400 text-emerald-300" : "bg-slate-800 border-slate-600 text-slate-400"}`}>
              <div className="text-[10px] font-bold">GATE ÷36</div>
              <div className="font-mono text-xs">{g36 ? "✓ OPEN" : "✗ LOCKED"}</div>
            </div>
            <div className={`p-2 rounded-lg text-center border ${g45 ? "bg-emerald-950 border-emerald-400 text-emerald-300" : "bg-slate-800 border-slate-600 text-slate-400"}`}>
              <div className="text-[10px] font-bold">GATE ÷45</div>
              <div className="font-mono text-xs">{g45 ? "✓ OPEN" : "✗ LOCKED"}</div>
            </div>
          </div>
        </div>
      </Board>

      <Bay label="Candidate Selector" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ candidate: 1143 })}>Test 1143</Btn>
          <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ candidate: 1290 })}>Test 1290</Btn>
          <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ candidate: 1560 })}>Test 1560</Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ candidate: 1263 })}>⚡ Test & Lock 1263 (LCM+3)</Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — The Roman Empire Comparison Hall (CCCLXXVI+CDXIV vs DCXIX+CCLXVIII)
   Left: 376 + 414 = 790
   Right: 619 + 268 = 887
   790 < 887 -> Option C (<).
   ══════════════════════════════════════════════════════════════════════ */

export function Q23RomanEmpireComparisonActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ forged: boolean; comparator: string | null }>({
    question,
    initial: { forged: false, comparator: null },
    derive: (w) => {
      if (!w.comparator) return { note: "Forge Roman numeral stone totals and apply comparison operator." };
      return { value: w.comparator, optionId: matchText(question, w.comparator) ?? "C" };
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
      title="The Roman Empire Comparison Hall"
      mission="Translate the ancient Roman numeral expressions: Left = CCCLXXVI + CDXIV, Right = DCXIX + CCLXVIII. Compare their Hindu-Arabic sums to determine the relational operator (<, >, =)."
      icon={Landmark}
      dim="2D"
      submitLabel="Submit Comparison (<)"
      hints={[
        "Left Monument: CCCLXXVI = 376, CDXIV = 414 → Sum = 376 + 414 = 790.",
        "Right Monument: DCXIX = 619, CCLXVIII = 268 → Sum = 619 + 268 = 887.",
        "790 is strictly less than 887 → Operator is '<' (Option C).",
      ]}
      live={
        <>
          <Gauge label="Left Monument" value={w.forged ? "790" : "CCCLXXVI+CDXIV"} tone="violet" />
          <Gauge label="Relation" value={w.comparator ?? "?"} tone={w.comparator === "<" ? "emerald" : "indigo"} />
          <Gauge label="Right Monument" value={w.forged ? "887" : "DCXIX+CCLXVIII"} tone="violet" />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          {/* Left Column */}
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-600 text-center w-36">
            <div className="text-[10px] font-bold text-slate-400 mb-1">MONUMENT I</div>
            <div className="font-mono text-xs font-bold text-sky-400">CCCLXXVI + CDXIV</div>
            <div className="font-mono text-xl font-black text-emerald-400 mt-2">{w.forged ? "790" : "---"}</div>
          </div>

          {/* Comparator Box */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center font-mono text-3xl font-black text-amber-300">
            {w.comparator ?? "?"}
          </div>

          {/* Right Column */}
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-600 text-center w-36">
            <div className="text-[10px] font-bold text-slate-400 mb-1">MONUMENT II</div>
            <div className="font-mono text-xs font-bold text-sky-400">DCXIX + CCLXVIII</div>
            <div className="font-mono text-xl font-black text-emerald-400 mt-2">{w.forged ? "887" : "---"}</div>
          </div>
        </div>
      </Board>

      <Bay label="Relational Comparison" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="violet" disabled={play.readOnly} onClick={() => play.patch({ forged: true })}>
            🏛️ Forge Roman Numeral Values
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly || !w.forged} onClick={() => play.patch({ comparator: "<" })}>
            ⚡ Apply Operator: &lt; (790 &lt; 887)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — The Shirt Factory Data Floor (Alok vs Virat)
   Alok = 35 + 12 = 47.
   Virat = 20.
   Difference = 47 - 20 = 27 shirts -> Option C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q24ShirtFactoryDataFloorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ alokAdded: boolean; diffCalculated: boolean }>({
    question,
    initial: { alokAdded: false, diffCalculated: false },
    derive: (w) => {
      if (!w.diffCalculated) return { note: "Add 12 shirts to Alok's tower and calculate difference from Virat." };
      return { value: "27 shirts", optionId: matchNumber(question, 27) ?? "C" };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const alokTotal = w.alokAdded ? 47 : 35;
  const viratTotal = 20;

  return (
    <Shell
      play={play}
      question={question}
      title="The Shirt Factory Data Floor"
      mission="Study the shirt production line graph (Alok = 35, Virat = 20). If Alok's father gives him 12 additional shirts, determine how many more shirts Alok now possesses compared to Virat."
      icon={BarChart3}
      dim="2D"
      submitLabel="Submit Shirt Difference"
      hints={[
        "Read graph: Alok bought 35 shirts, Virat bought 20 shirts.",
        "Add 12 shirts to Alok: 35 + 12 = 47 shirts.",
        "Difference: 47 − 20 = 27 shirts (Option C).",
      ]}
      live={
        <>
          <Gauge label="Alok's Shirts" value={`${alokTotal}`} tone="violet" />
          <Gauge label="Virat's Shirts" value={`${viratTotal}`} tone="indigo" />
          <Gauge label="Difference" value={w.diffCalculated ? "27" : "---"} tone={w.diffCalculated ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-end justify-around border border-slate-700">
          {/* Alok Tower */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-xs font-bold text-sky-300">{alokTotal}</span>
            <div
              className={`w-14 rounded-t-lg transition-all ${w.alokAdded ? "bg-emerald-500" : "bg-sky-500"}`}
              style={{ height: `${(alokTotal / 60) * 100}px` }}
            />
            <span className="text-[10px] font-bold text-slate-400">Alok</span>
          </div>

          {/* Virat Tower */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-xs font-bold text-violet-300">{viratTotal}</span>
            <div className="w-14 bg-violet-500 rounded-t-lg" style={{ height: `${(viratTotal / 60) * 100}px` }} />
            <span className="text-[10px] font-bold text-slate-400">Virat</span>
          </div>
        </div>
      </Board>

      <Bay label="Factory Operations" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="sky" disabled={play.readOnly} onClick={() => play.patch({ alokAdded: true })}>
            📦 Add +12 Shirts to Alok (35 + 12 = 47)
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly || !w.alokAdded} onClick={() => play.patch({ diffCalculated: true })}>
            ⚡ Calculate Difference vs Virat (27 shirts)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — The Fashion Warehouse (Shirt Ratio)
   Tarun = 60.
   Vinit + Ronak = 40 + 45 = 85.
   Ratio Tarun : (Vinit + Ronak) = 60 : 85 = 12 : 17 -> Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q25FashionWarehouseRatioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ simplified: boolean }>({
    question,
    initial: { simplified: false },
    derive: (w) => {
      if (!w.simplified) return { note: "Aggregate crates (Tarun vs Vinit+Ronak) and simplify the ratio." };
      return { value: "12:17", optionId: matchText(question, "12:17") ?? "D" };
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
      title="The Fashion Warehouse Ratio Machine"
      mission="Read the line graph: Tarun = 60 shirts, Vinit = 40 shirts, Ronak = 45 shirts. Compute the simplified integer ratio of Tarun to (Vinit + Ronak) combined."
      icon={Shirt}
      dim="2D"
      submitLabel="Submit Simplified Ratio (12:17)"
      hints={[
        "Tarun = 60.",
        "Vinit + Ronak = 40 + 45 = 85.",
        "Ratio = 60 : 85.",
        "Divide both terms by HCF (5): 60÷5 : 85÷5 = 12 : 17 (Option D).",
      ]}
      live={
        <>
          <Gauge label="Tarun" value="60" tone="violet" />
          <Gauge label="Vinit + Ronak" value="85" tone="indigo" />
          <Gauge label="Ratio" value={w.simplified ? "12 : 17" : "60 : 85"} tone={w.simplified ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 text-center">
            <div className="text-[10px] font-bold text-slate-400">TARUN</div>
            <div className="font-mono text-2xl font-black text-sky-400">60</div>
          </div>

          <div className="font-mono text-3xl font-black text-amber-400">:</div>

          <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 text-center">
            <div className="text-[10px] font-bold text-slate-400">VINIT + RONAK</div>
            <div className="font-mono text-2xl font-black text-violet-400">85 (40+45)</div>
          </div>
        </div>
      </Board>

      <Bay label="Ratio Machine" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ simplified: true })}>
          ⚡ Divide by Common Factor 5 → Simplify to 12:17
        </Btn>
      </Bay>
    </Shell>
  );
}

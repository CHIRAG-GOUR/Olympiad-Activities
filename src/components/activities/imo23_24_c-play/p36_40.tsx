"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Printer, Navigation2, Users2, Music, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, PlayCanvas } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — The Fruit Market Algebra Game (Apples & Mangoes)
   Apple crate = x, Mango crate = x + 5.
   5 Apples + 4 Mangoes = 5x + 4(x + 5) = 5x + 4x + 20 = 9x + 20 (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q36FruitMarketAlgebraActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ checkoutBuilt: boolean }>({
    question,
    initial: { checkoutBuilt: false },
    derive: (w) => {
      if (!w.checkoutBuilt) return { note: "Combine 5 apples and 4 mango crates into checkout register." };
      return { value: "9x + 20", optionId: matchText(question, "9x + 20") ?? "C" };
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
      title="The Fruit Market Cost Checkout"
      mission="An apple costs ₹ x and a mango costs ₹ 5 more than an apple (₹ x + 5). Assemble a shopping cart of 5 apples and 4 mangoes, and derive the total algebraic cost expression (9x + 20)."
      icon={ShoppingCart}
      dim="2D"
      submitLabel="Submit Total Cost (9x + 20)"
      hints={[
        "Cost of 1 apple = x → Cost of 5 apples = 5x.",
        "Cost of 1 mango = x + 5 → Cost of 4 mangoes = 4(x + 5) = 4x + 20.",
        "Total = 5x + 4x + 20 = 9x + 20 (Option C).",
      ]}
      live={
        <>
          <Gauge label="5 Apples" value="5x" tone="violet" />
          <Gauge label="4 Mangoes" value="4x + 20" tone="indigo" />
          <Gauge label="Total Cost" value={w.checkoutBuilt ? "9x + 20" : "---"} tone={w.checkoutBuilt ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex items-center justify-around border border-indigo-100 shadow-xs flex-wrap gap-3 min-h-[160px]">
          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-center w-40">
            <div className="text-2xl">🍎 × 5</div>
            <div className="font-mono text-sm font-extrabold text-rose-900 mt-1">5 × x = 5x</div>
          </div>

          <div className="font-mono text-3xl font-black text-indigo-600">+</div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-center w-40">
            <div className="text-2xl">🥭 × 4</div>
            <div className="font-mono text-sm font-extrabold text-amber-900 mt-1">4(x + 5) = 4x + 20</div>
          </div>
        </div>
      </Board>

      <Bay label="Checkout Register" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ checkoutBuilt: true })}>
          ⚡ Sum Baskets: 5x + (4x + 20) = 9x + 20
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — The Publishing House (1950 pages × 315 words = 614250)
   Candidate runs typesetter calculation conveyor -> Option A.
   ══════════════════════════════════════════════════════════════════════ */

export function Q37PublishingHouseActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const pages = 1950;
  const wordsPerPage = 315;
  const totalWords = 614250;

  const play = usePlay<{ calculated: boolean }>({
    question,
    initial: { calculated: false },
    derive: (w) => {
      if (!w.calculated) return { note: "Feed 1950 page stacks into word counter." };
      return { value: `${totalWords}`, optionId: matchNumber(question, totalWords) ?? "A" };
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
      title="The Publishing House Typesetter"
      mission="Priyanka types a 1950-page manuscript. Each page contains 315 words. Calculate the total number of words typed in all (1950 × 315 = 614,250 words)."
      icon={Printer}
      dim="2D"
      submitLabel="Submit Total Words (614250)"
      hints={[
        "Total Words = Total Pages × Words per Page.",
        "1950 × 315 = 1950 × (300 + 10 + 5) = 585000 + 19500 + 9750 = 614250.",
        "Total = 614250 words (Option A).",
      ]}
      live={
        <>
          <Gauge label="Pages" value="1950" tone="violet" />
          <Gauge label="Words / Page" value="315" tone="indigo" />
          <Gauge label="Total Word Count" value={w.calculated ? "614250" : "---"} tone={w.calculated ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-around text-center border border-indigo-100 shadow-xs space-y-3 min-h-[160px]">
          <div className="font-mono text-xs font-black uppercase tracking-wider text-slate-500">Printing Batch Telemetry</div>
          <div className="font-mono text-2xl font-black text-indigo-950">
            1950 pages × 315 words/page
          </div>
          <div className="font-mono text-base font-black text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
            {w.calculated ? "= 614,250 total words" : "Ready to Multiply"}
          </div>
        </div>
      </Board>

      <Bay label="Typesetter Controls" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ calculated: true })}>
          ⚡ Execute Typesetter Multiply (1950 × 315 = 614250)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — The Polar Navigation Map (465 km South + 644 km North = 1109 km)
   Candidate launches opposite exploration vehicles -> Option A.
   ══════════════════════════════════════════════════════════════════════ */

export function Q38PolarNavigationMapActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const south = 465;
  const north = 644;
  const total = south + north; // 1109 km

  const play = usePlay<{ measured: boolean }>({
    question,
    initial: { measured: false },
    derive: (w) => {
      if (!w.measured) return { note: "Deploy vehicles North and South and measure separation distance." };
      return { value: `${total} km`, optionId: matchText(question, `${total}`) ?? "A" };
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
      title="The Opposite Axis Displacement Mapper"
      mission="From a shared origin, Manya travels 465 km South, while Ananya travels 644 km North. Measure the total distance between their final destinations (465 + 644 = 1109 km)."
      icon={Navigation2}
      dim="2D"
      submitLabel="Submit Separation Distance (1109 km)"
      hints={[
        "South and North are opposite directions along the vertical line.",
        "Distance between them = (Distance South) + (Distance North).",
        "465 km + 644 km = 1109 km (Option A).",
      ]}
      live={
        <>
          <Gauge label="Manya (South)" value="465 km" tone="violet" />
          <Gauge label="Ananya (North)" value="644 km" tone="indigo" />
          <Gauge label="Total Separation" value={w.measured ? "1109 km" : "---"} tone={w.measured ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-between items-center border border-indigo-100 shadow-xs space-y-3 min-h-[160px]">
          <div className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
            ▲ Ananya (North): +644 km
          </div>

          <div className="w-4/5 flex items-center justify-between relative py-2">
            <div className="w-full h-1 bg-slate-200 absolute rounded-full" />
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 mx-auto z-10 shadow-xs" />
          </div>

          <div className="text-xs font-mono font-bold text-violet-800 bg-violet-50 px-3 py-1 rounded-lg border border-violet-200">
            ▼ Manya (South): −465 km
          </div>

          <div className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-300">
            {w.measured ? "Total Separation: 644 km + 465 km = 1109 km" : "Shared Origin (0 km)"}
          </div>
        </div>
      </Board>

      <Bay label="Expedition Radar" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ measured: true })}>
          ⚡ Measure Separation (644 + 465 = 1109 km)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — The Party Crowd Simulator (Party Ratio)
   Initial: 64 boys, G girls.
   After 1h: 64 - 24 = 40 boys; G + 30 girls.
   Ratio: 40 / (G + 30) = 2 / 5 => 200 = 2G + 60 => 2G = 140 => G = 70 (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q39PartyCrowdSimulatorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ initialGirls: number }>({
    question,
    initial: { initialGirls: 60 },
    derive: (w) => {
      const finalBoys = 64 - 24; // 40
      const finalGirls = w.initialGirls + 30;
      const is2to5 = finalBoys * 5 === finalGirls * 2;
      if (!is2to5) return { note: `Initial girls = ${w.initialGirls} gives ratio ${finalBoys}:${finalGirls} ≠ 2:5.` };
      return { value: `${w.initialGirls} girls`, optionId: matchNumber(question, w.initialGirls) ?? (w.initialGirls === 70 ? "C" : undefined) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const finalBoys = 40;
  const finalGirls = w.initialGirls + 30;
  const isMatch = finalBoys * 5 === finalGirls * 2;

  return (
    <Shell
      play={play}
      question={question}
      title="The Party Crowd Ratio Solver"
      mission="A party had 64 boys and G girls. 24 boys left (leaving 40) and 30 more girls joined. The ratio of boys to girls became 2 : 5. Adjust the initial girl count to discover G (70 girls)."
      icon={Users2}
      dim="2D"
      submitLabel="Submit Initial Girls (70)"
      hints={[
        "Final Boys = 64 − 24 = 40 boys.",
        "Ratio is 2 : 5. If 2 parts = 40 boys, then 1 part = 20 people.",
        "5 parts = 5 × 20 = 100 girls.",
        "Initial girls = 100 − 30 (who joined) = 70 girls (Option C).",
      ]}
      live={
        <>
          <Gauge label="Initial Girls" value={`${w.initialGirls}`} tone={w.initialGirls === 70 ? "emerald" : "indigo"} />
          <Gauge label="Final Crowd" value={`40 B : ${finalGirls} G`} tone="violet" />
          <Gauge label="Ratio Status" value={isMatch ? "Valid 2:5" : "Ratio Mismatch"} tone={isMatch ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-around border border-indigo-100 shadow-xs text-center space-y-3 min-h-[160px]">
          <div className="flex justify-around font-mono text-sm font-bold text-slate-800 flex-wrap gap-2">
            <span className="bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">👦 Boys: 64 − 24 = 40</span>
            <span className="bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">👧 Girls: {w.initialGirls} + 30 = {finalGirls}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-bold text-indigo-950">
            Cross Check: 40 × 5 = 200 vs {finalGirls} × 2 = {finalGirls * 2} ({isMatch ? "✓ MATCHES 2:5 RATIO" : "MISMATCH"})
          </div>
        </div>
      </Board>

      <Bay label="Crowd Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="slate" disabled={play.readOnly || w.initialGirls <= 50} onClick={() => play.patch({ initialGirls: w.initialGirls - 5 })}>
            − 5 Girls
          </Btn>
          <Btn tone="slate" disabled={play.readOnly || w.initialGirls >= 100} onClick={() => play.patch({ initialGirls: w.initialGirls + 5 })}>
            + 5 Girls
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ initialGirls: 70 })}>
            🎯 Lock Initial 70 Girls (2:5 Ratio)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — The Music School Schedule (Piano Classes)
   Total hours = 24 hours.
   Each class = 3/4 hour (45 mins).
   Classes = 24 / (3/4) = 24 × 4/3 = 8 × 4 = 32 classes -> Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q40MusicSchoolScheduleActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ computed: boolean }>({
    question,
    initial: { computed: false },
    derive: (w) => {
      if (!w.computed) return { note: "Allocate 24 teaching hours into 3/4-hour class blocks." };
      return { value: "32 classes", optionId: matchNumber(question, 32) ?? "D" };
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
      title="The Music Academy Class Scheduler"
      mission="Mrs. Sinha taught a total of 24 hours in September. Each piano lesson lasted 3/4 of an hour (45 minutes). Compute the total number of classes she delivered (24 ÷ 3/4 = 32 classes)."
      icon={Music}
      dim="2D"
      submitLabel="Submit Total Classes (32)"
      hints={[
        "Total Classes = Total Hours ÷ Class Duration.",
        "24 ÷ (3/4) = 24 × (4/3) = (24 × 4) ÷ 3 = 96 ÷ 3 = 32.",
        "Total = 32 classes (Option D).",
      ]}
      live={
        <>
          <Gauge label="Total Time" value="24 hours" tone="violet" />
          <Gauge label="Duration / Class" value="3/4 hour" tone="indigo" />
          <Gauge label="Class Tally" value={w.computed ? "32 classes" : "---"} tone={w.computed ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-around text-center border border-indigo-100 shadow-xs space-y-3 min-h-[160px]">
          <div className="font-mono text-2xl font-black text-indigo-950">
            24 ÷ (3/4) = 24 × (4/3)
          </div>
          <div className="font-mono text-base font-black text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
            {w.computed ? "= 32 completed piano lessons" : "Schedule Ready"}
          </div>
        </div>
      </Board>

      <Bay label="Scheduler" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ computed: true })}>
          ⚡ Divide 24 by (3/4) = 32 Classes
        </Btn>
      </Bay>
    </Shell>
  );
}

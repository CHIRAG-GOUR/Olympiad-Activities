"use client";

import React from "react";
import { Box, Cake, ShieldCheck, BarChart3, Trophy, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper, World3D } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — 3D Solid Recognition & Classification Factory
   Match P, Q, R, S with:
   P -> Triangular Prism (2)
   Q -> Rectangular Pyramid (3)
   R -> Octagonal Prism (1)
   S -> Pentagonal Pyramid (4)
   => P-2, Q-3, R-1, S-4 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q46SolidMatchingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedCode: string }>({
    question,
    initial: { selectedCode: "P-2, Q-3, R-1, S-4" },
    derive: (w) => {
      const code = w?.selectedCode ?? "P-2, Q-3, R-1, S-4";
      if (code === "P-2, Q-3, R-1, S-4") {
        return {
          value: "P-2, Q-3, R-1, S-4",
          optionId: matchText(question, "P-2, Q-3, R-1, S-4"),
        };
      }
      return { note: `Mapping: ${code}. Inspect base geometry and apex/prism structure of P, Q, R, S.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const code = play.world?.selectedCode ?? "P-2, Q-3, R-1, S-4";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Polyhedron Recognition Factory"
      mission="Achiever Mission 1: Inspect 3D solids P, Q, R, S. Classify base shapes and prism/pyramid faces -> P: Triangular Prism (2), Q: Rectangular Pyramid (3), R: Octagonal Prism (1), S: Pentagonal Pyramid (4)."
      icon={Box}
      dim="3D"
      submitLabel="Submit Polyhedron Classification (Option A)"
      hints={[
        "Solid P: 2 triangular bases + 3 rectangular faces = Triangular Prism (2).",
        "Solid Q: 1 rectangular base + 4 triangular sides to apex = Rectangular Pyramid (3).",
        "Solid R: 2 octagonal bases + 8 rectangular sides = Octagonal Prism (1).",
        "Solid S: 1 pentagonal base + 5 triangular sides to apex = Pentagonal Pyramid (4).",
        "Mapping: P-2, Q-3, R-1, S-4 (Option A).",
      ]}
      live={
        <>
          <Gauge label="P (Triangular Prism)" value="Code 2" tone="sky" />
          <Gauge label="Q (Rect. Pyramid)" value="Code 3" tone="indigo" />
          <Gauge label="R (Octagonal Prism)" value="Code 1" tone="sky" />
          <Gauge label="S (Pent. Pyramid)" value="Code 4" tone="indigo" />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "P-2, Q-3, R-1, S-4",
            "P-3, Q-2, R-4, S-1",
            "P-2, Q-4, R-1, S-3",
            "P-4, Q-1, R-2, S-3",
          ].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => play.patch({ selectedCode: m })}
              className={`p-3.5 rounded-xl font-mono text-xs font-black border transition-all text-center ${
                code === m
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {m} {m === "P-2, Q-3, R-1, S-4" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — Strawberry Bakery Fractions
   Initial: (5/8)x = 25 => x = 40 strawberries.
   Remaining: 10 / 2 = 5 each => 5/40 = 1/8 fraction of initial.
   => (a) 40, (b) 1/8 (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q47StrawberryBakeryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedCombination: string }>({
    question,
    initial: { selectedCombination: "(a) 40, (b) 1/8" },
    derive: (w) => {
      const c = w?.selectedCombination ?? "(a) 40, (b) 1/8";
      if (c === "(a) 40, (b) 1/8") {
        return {
          value: "(a) 40, (b) 1/8",
          optionId: matchText(question, "(a) 40, (b) 1/8"),
        };
      }
      return { note: `Combination: ${c}. Solve: (1 - 1/8 - 1/4)x = 25 strawberries.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const comb = play.world?.selectedCombination ?? "(a) 40, (b) 1/8";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Strawberry Bakery Inventory Simulator"
      mission="Achiever Mission 2: 1/8 strawberries rotten, 25 used for cake, 1/4 remaining. Determine (a) initial strawberry count (40) and (b) fraction received by each son when remaining 10 are shared equally (1/8)."
      icon={Cake}
      dim="2D"
      submitLabel="Submit Bakery Inventory ((a) 40, (b) 1/8 / Option D)"
      hints={[
        "Let initial strawberries = x.",
        "Rotten = (1/8)x, Cake = 25, Left = (1/4)x.",
        "x − (1/8)x − 25 = (1/4)x ⇒ (5/8)x = 25 ⇒ x = 40 strawberries.",
        "Remaining strawberries = (1/4) × 40 = 10.",
        "Shared equally between 2 sons = 5 each.",
        "Fraction of total = 5 / 40 = 1/8 (Option D).",
      ]}
      live={
        <>
          <Gauge label="(a) Initial Total" value="40 Strawberries" tone="sky" />
          <Gauge label="Cake Used" value="25" tone="rose" />
          <Gauge label="Remaining / 2" value="5 each" tone="indigo" />
          <Gauge label="(b) Son Fraction" value="1/8 of Total" tone="emerald" />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 gap-2">
          {[
            "(a) 36, (b) 1/6",
            "(a) 48, (b) 1/8",
            "(a) 45, (b) 1/5",
            "(a) 40, (b) 1/8",
          ].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => play.patch({ selectedCombination: c })}
              className={`p-3.5 rounded-xl font-mono text-xs font-black border transition-all text-center ${
                comb === c
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c} {c === "(a) 40, (b) 1/8" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — Prime Number Logic Proof Laboratory
   I. Every prime is odd (False: 2 is prime and even).
   II. Product of any two primes is odd (False: 2 × 3 = 6 is even).
   => Neither Statement I nor Statement II (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q48PrimeLogicActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedVerdict: string }>({
    question,
    initial: { selectedVerdict: "Neither Statement I nor Statement II" },
    derive: (w) => {
      const v = w?.selectedVerdict ?? "Neither Statement I nor Statement II";
      if (v === "Neither Statement I nor Statement II") {
        return {
          value: "Neither Statement I nor Statement II",
          optionId: matchText(question, "Neither Statement I nor Statement II"),
        };
      }
      return { note: `Verdict: ${v}. Test counterexample 2 (even prime).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const verd = play.world?.selectedVerdict ?? "Neither Statement I nor Statement II";

  return (
    <Shell
      play={play}
      question={question}
      title="Prime Number Logic Proof Laboratory"
      mission="Achiever Mission 3: Test mathematical theorems. Counterexample 2 is an even prime, disproving Statement I. The product 2 × 3 = 6 is an even number, disproving Statement II -> Neither Statement I nor Statement II."
      icon={ShieldCheck}
      dim="2D"
      submitLabel="Submit Proof Verdict (Neither I nor II / Option D)"
      hints={[
        "Statement I: 'Every prime is odd' ➔ Counterexample: 2 is a prime number and is EVEN ⇒ FALSE.",
        "Statement II: 'Product of any two primes is odd' ➔ Counterexample: 2 × 3 = 6 (EVEN) ⇒ FALSE.",
        "Therefore: Neither Statement I nor Statement II is correct (Option D).",
      ]}
      live={
        <>
          <Gauge label="Statement I (Odd Primes)" value="FALSE (2 is even)" tone="rose" />
          <Gauge label="Statement II (Odd Product)" value="FALSE (2 × 3 = 6)" tone="rose" />
          <Gauge label="Final Proof" value="Neither I nor II ✓" tone="emerald" />
        </>
      }
    >
      <Board>
        <div className="space-y-2">
          {[
            "Only Statement I",
            "Only Statement II",
            "Both Statement I and Statement II",
            "Neither Statement I nor Statement II",
          ].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => play.patch({ selectedVerdict: v })}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                verd === v
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{v}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${verd === v ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {v.includes("Neither") ? "CORRECT PROOF ✓" : "DISPROVED"}
              </span>
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — Sports Data Observatory (Basketball vs Badminton Difference)
   Basketball total − Badminton total (2011–2016) = 250 million (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q49SportsObservatoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ calculatedDiff: number }>({
    question,
    initial: { calculatedDiff: 250 },
    derive: (w) => {
      const d = w?.calculatedDiff ?? 0;
      if (d === 250) {
        return {
          value: "250 million",
          optionId: matchText(question, "250 million"),
        };
      }
      return { note: `Difference: ${d} million. Sum Basketball bars (1200M) and Badminton bars (950M).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const diff = play.world?.calculatedDiff ?? 250;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Sports Data Observatory"
      mission="Achiever Mission 4: Audit multi-year preferences across 2011–2016. Aggregate Basketball total (1200 million) and Badminton total (950 million) to compute the difference (250 million)."
      icon={BarChart3}
      dim="2D"
      submitLabel="Submit Difference (250 million / Option D)"
      hints={[
        "Basketball Total (2011–2016) = 1200 million.",
        "Badminton Total (2011–2016) = 950 million.",
        "Difference = 1200 − 950 = 250 million (Option D).",
      ]}
      live={
        <>
          <Gauge label="Basketball Total" value="1200 Million" tone="sky" />
          <Gauge label="Badminton Total" value="950 Million" tone="indigo" />
          <Gauge label="Absolute Difference" value={`${diff} Million`} tone={diff === 250 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[180, 210, 230, 250].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => play.patch({ calculatedDiff: val })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                diff === val
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {val}M {val === 250 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — 3D Stadium Crowd Accumulator (Tennis Total)
   Tennis total across all years (2011–2016) = 1700 million (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q50TennisAccumulatorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ tennisTotal: number }>({
    question,
    initial: { tennisTotal: 1700 },
    derive: (w) => {
      const tot = w?.tennisTotal ?? 0;
      if (tot === 1700) {
        return {
          value: "1700 million",
          optionId: matchText(question, "1700 million"),
        };
      }
      return { note: `Tennis Total: ${tot} million. Sum all 6 yearly Tennis stadium crowd towers.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const tot = play.world?.tennisTotal ?? 1700;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Stadium Crowd Accumulator (Grand Finale)"
      mission="Grand Finale Achiever Mission: Sum Tennis spectators across all six years (2011–2016) in the central crowd accumulator -> 1700 million."
      icon={Trophy}
      dim="2D"
      submitLabel="Submit Grand Total (1700 million / Option D)"
      hints={[
        "Sum the six annual Tennis preferences from the source chart:",
        "Total Tennis = 1700 million (Option D).",
      ]}
      live={
        <>
          <Gauge label="Surveyed Years" value="2011–2016 (6 yrs)" tone="sky" />
          <Gauge label="Sport" value="Tennis" tone="indigo" />
          <Gauge label="Grand Total" value={`${tot} Million`} tone={tot === 1700 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[1500, 1620, 1680, 1700].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => play.patch({ tennisTotal: val })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                tot === val
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {val}M {val === 1700 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

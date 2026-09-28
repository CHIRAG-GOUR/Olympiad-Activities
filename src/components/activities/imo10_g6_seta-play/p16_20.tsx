"use client";

import React from "react";
import { GitBranch, Network, Search, Split, ArrowDownCircle, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Priority Calculation Lab (BODMAS Chambers)
   2.002 + 7.9 {2.8 − 6.3(3.6 − 1.5) + 15.6} = 42.845 (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q16PriorityCalculationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ calculatedResult: number }>({
    question,
    initial: { calculatedResult: 42.845 },
    derive: (w) => {
      const res = w?.calculatedResult ?? 0;
      if (res === 42.845) {
        return {
          value: "42.845",
          optionId: matchText(question, "42.845") ?? "D",
        };
      }
      return { note: `Calculated: ${res}. Resolve inner parenthesis (3.6 - 1.5) first.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const res = play.world?.calculatedResult ?? 42.845;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Priority Calculation Laboratory"
      mission="Resolve nested bracket chambers in order: (3.6 − 1.5) = 2.1 ➔ 2.8 − 6.3(2.1) + 15.6 = 5.17 ➔ 2.002 + 7.9(5.17) = 42.845."
      icon={GitBranch}
      dim="2D"
      submitLabel="Submit Final Value (42.845 / Option D)"
      hints={[
        "Chamber 1 (Innermost): (3.6 − 1.5) = 2.1.",
        "Chamber 2 (Multiplication): 6.3 × 2.1 = 13.23.",
        "Chamber 3 (Braces): 2.8 − 13.23 + 15.6 = 5.17.",
        "Chamber 4 (Outer Product): 7.9 × 5.17 = 40.843.",
        "Final Sum: 2.002 + 40.843 = 42.845 (Option D).",
      ]}
      live={
        <>
          <Gauge label="Innermost ( )" value="2.1" tone="sky" />
          <Gauge label="Braces { }" value="5.17" tone="indigo" />
          <Gauge label="Final Simplified" value={res} tone={res === 42.845 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        {/* Visual Pipeline Chambers */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Step 1: Parentheses</div>
            <div className="font-mono text-sm font-extrabold text-indigo-900 mt-1">3.6 − 1.5 = 2.1</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Step 2: Braces</div>
            <div className="font-mono text-sm font-extrabold text-indigo-900 mt-1">2.8 − 13.23 + 15.6 = 5.17</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 shadow-xs">
            <div className="text-[10px] font-bold text-emerald-800 uppercase">Step 3: Total Sum</div>
            <div className="font-mono text-sm font-extrabold text-emerald-950 mt-1">2.002 + 40.843 = 42.845</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[38.450, 40.125, 45.670, 42.845].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => play.patch({ calculatedResult: v })}
              className={`py-2.5 rounded-xl font-mono text-sm font-black border transition-all ${
                res === v
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {v.toFixed(3)} {v === 42.845 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — Operator Maze (Expression Equivalence)
   Expressions I and IV evaluate to identical numbers => Option B.
   ══════════════════════════════════════════════════════════════════════ */

export function Q17OperatorMazeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedPair: string }>({
    question,
    initial: { selectedPair: "I and IV" },
    derive: (w) => {
      const pair = w?.selectedPair ?? "I and IV";
      if (pair === "I and IV") {
        return {
          value: "I and IV",
          optionId: matchText(question, "I and IV") ?? "B",
        };
      }
      return { note: `Audited: ${pair}. Route gates to discover identical outputs.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const pair = play.world?.selectedPair ?? "I and IV";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Operator Maze & Expression Equivalence"
      mission="Route expressions I, II, III, and IV through mathematical operator gates to identify the two expressions with equal evaluated output (I and IV)."
      icon={Network}
      dim="2D"
      submitLabel="Submit Equivalent Pair (I and IV / Option B)"
      hints={[
        "Evaluate each expression respecting standard operator precedence.",
        "Expression I and Expression IV produce the exact same numerical result.",
      ]}
      live={
        <>
          <Gauge label="Expression I" value="Evaluated" tone="sky" />
          <Gauge label="Expression IV" value="Evaluated" tone="sky" />
          <Gauge label="Equivalent Pair" value={pair} tone={pair === "I and IV" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {["I and II", "I and IV", "II and III", "III and IV"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => play.patch({ selectedPair: p })}
              className={`py-3 rounded-xl font-bold text-xs border transition-all ${
                pair === p
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p} {p === "I and IV" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — Mathematical Detective Lab (Roman & Metric Statements)
   Incorrect: (i) 84 = CXXXIV (false, LXXXIV), (iii) 10000mg = 1kg (false, 1,000,000mg)
   => Both (i) and (iii) (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q18RomanMetricDetectiveActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedClaim: string }>({
    question,
    initial: { selectedClaim: "Both (i) and (iii)" },
    derive: (w) => {
      const c = w?.selectedClaim ?? "Both (i) and (iii)";
      if (c === "Both (i) and (iii)") {
        return {
          value: "Both (i) and (iii)",
          optionId: matchText(question, "Both (i) and (iii)") ?? "A",
        };
      }
      return { note: `Audited claims: ${c}. Verify Roman numeral 84 and 1 kg metric conversion.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const claim = play.world?.selectedClaim ?? "Both (i) and (iii)";

  return (
    <Shell
      play={play}
      question={question}
      title="Mathematical Detective Evidence Room"
      mission="Investigate 4 mathematical statements: detect which statements are INCORRECT ((i) 84 is LXXXIV, not CXXXIV; (iii) 1 kg = 1,000,000 mg, not 10,000 mg) -> Both (i) and (iii)."
      icon={Search}
      dim="2D"
      submitLabel="Submit Incorrect Claims (Both (i) and (iii) / Option A)"
      hints={[
        "(i) 84 = 50 + 30 + 4 = LXXXIV. CXXXIV represents 134 ⇒ INCORRECT.",
        "(ii) 1 crore = 1,00,00,000 (7 zeroes) ⇒ CORRECT.",
        "(iii) 1 kg = 1,000 g = 1,000,000 mg (10 lakh mg, not 10,000 mg) ⇒ INCORRECT.",
        "(iv) Smallest 4-digit using 4,3,0,8 is 3048 ⇒ CORRECT.",
        "Incorrect statements: Both (i) and (iii) (Option A).",
      ]}
      live={
        <>
          <Gauge label="(i) 84 = CXXXIV" value="FALSE (LXXXIV)" tone="rose" />
          <Gauge label="(ii) 1 Crore = 7 zeros" value="TRUE" tone="emerald" />
          <Gauge label="(iii) 1 kg = 10k mg" value="FALSE (1M mg)" tone="rose" />
          <Gauge label="Verdict" value={claim} tone={claim === "Both (i) and (iii)" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="space-y-2">
          <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 shadow-xs">
            <span className="font-bold text-rose-700">Statement (i):</span> 84 in Roman is <span className="font-mono font-bold">LXXXIV</span> (CXXXIV is 134) ➔ <span className="font-bold text-rose-600">INCORRECT ✗</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 shadow-xs">
            <span className="font-bold text-emerald-700">Statement (ii):</span> 1 Crore = 10,000,000 (7 zeroes) ➔ <span className="font-bold text-emerald-600">CORRECT ✓</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 shadow-xs">
            <span className="font-bold text-rose-700">Statement (iii):</span> 1 kg = 1,000 × 1,000 mg = 1,000,000 mg (≠ 10,000 mg) ➔ <span className="font-bold text-rose-600">INCORRECT ✗</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 shadow-xs">
            <span className="font-bold text-emerald-700">Statement (iv):</span> Smallest with 4,3,0,8 is 3048 ➔ <span className="font-bold text-emerald-600">CORRECT ✓</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["Both (i) and (iii)", "Both (ii) and (iv)", "(i), (ii) and (iii)", "Only (iii)"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => play.patch({ selectedClaim: opt })}
              className={`py-2.5 px-2 rounded-xl font-bold text-xs border transition-all text-center ${
                claim === opt
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt} {opt === "Both (i) and (iii)" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — 3D Distributive Property Factory
   258 × 1008 = 258 × (1000 + 8) = 258 × 1000 + 258 × 8 (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q19DistributivePropertyActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedForm: string }>({
    question,
    initial: { selectedForm: "258 × 1000 + 258 × 8" },
    derive: (w) => {
      const f = w?.selectedForm ?? "258 × 1000 + 258 × 8";
      if (f === "258 × 1000 + 258 × 8") {
        return {
          value: "258 × 1000 + 258 × 8",
          optionId: matchText(question, "258 × 1000 + 258 × 8") ?? "B",
        };
      }
      return { note: `Form: ${f}. Split 1008 into (1000 + 8) and distribute 258.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const form = play.world?.selectedForm ?? "258 × 1000 + 258 × 8";

  return (
    <Shell
      play={play}
      question={question}
      title="Distributive Property Conveyor Factory"
      mission="Split 1008 into 1000 + 8 on parallel conveyor belts: distribute 258 to establish 258 × 1000 + 258 × 8 -> Option B."
      icon={Split}
      dim="2D"
      submitLabel="Submit Distributive Expansion (Option B)"
      hints={[
        "Distributive law: a × (b + c) = (a × b) + (a × c).",
        "258 × 1008 = 258 × (1000 + 8) = 258 × 1000 + 258 × 8 (Option B).",
      ]}
      live={
        <>
          <Gauge label="Original Product" value="258 × 1008" tone="sky" />
          <Gauge label="Split Addition" value="1000 + 8" tone="indigo" />
          <Gauge label="Expansion" value={form} tone={form === "258 × 1000 + 258 × 8" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "258 × 1000 + 8",
            "258 × 1000 + 258 × 8",
            "258 × 100 + 258 × 8",
            "258 × 1008 + 8",
          ].map((exp) => (
            <button
              key={exp}
              type="button"
              onClick={() => play.patch({ selectedForm: exp })}
              className={`p-3 rounded-xl font-mono text-xs font-bold border transition-all text-left ${
                form === exp
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {exp} {exp === "258 × 1000 + 258 × 8" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — 3D Integer Elevator
   Integer -12 best represented by "Petrol price reduced by ₹12" (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q20IntegerElevatorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedSituation: string }>({
    question,
    initial: { selectedSituation: "Petrol price reduced by ₹12" },
    derive: (w) => {
      const s = w?.selectedSituation ?? "Petrol price reduced by ₹12";
      if (s === "Petrol price reduced by ₹12") {
        return {
          value: "Petrol price reduced by ₹12",
          optionId: matchText(question, "Petrol price reduced by ₹12") ?? "B",
        };
      }
      return { note: `Situation: ${s}. Negative sign (−) represents reductions, drops, or losses.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const sit = play.world?.selectedSituation ?? "Petrol price reduced by ₹12";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Economic Integer Elevator"
      mission="Operate the signed integer elevator: identify which real-world scenario descends to level −12 (Petrol price reduced by ₹12)."
      icon={ArrowDownCircle}
      dim="2D"
      submitLabel="Submit Scenario (Option B)"
      hints={[
        "Gain/Increase/Climbing/Above Zero = Positive (+).",
        "Reduction/Loss/Descending/Below Zero = Negative (−).",
        "Petrol price reduced by ₹12 = −12 (Option B).",
      ]}
      live={
        <>
          <Gauge label="Target Integer" value="−12" tone="rose" />
          <Gauge label="Scenario Sign" value="Decrease / Loss (−)" tone="indigo" />
          <Gauge label="Matched Scenario" value={sit} tone={sit === "Petrol price reduced by ₹12" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="space-y-2">
          {[
            { text: "A gain of ₹12 in trade", sign: "+12" },
            { text: "Petrol price reduced by ₹12", sign: "−12", correct: true },
            { text: "Climbing 12 steps upstairs", sign: "+12" },
            { text: "A temperature of 12°C above zero", sign: "+12" },
          ].map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => play.patch({ selectedSituation: s.text })}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                sit === s.text
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{s.text}</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded ${sit === s.text ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {s.sign} {s.correct ? "✓" : ""}
              </span>
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

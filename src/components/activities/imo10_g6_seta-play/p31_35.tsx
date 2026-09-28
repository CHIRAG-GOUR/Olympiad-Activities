"use client";

import React from "react";
import { KeyRound, ShieldAlert, Layers, Flame, AlertOctagon, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, Stepper } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — 3D Number-Card Detective
   Sanchi product = 63 (cards: 1, 7, 9) => Largest number = 9 (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q31NumberCardDetectiveActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ largestCard: number }>({
    question,
    initial: { largestCard: 9 },
    derive: (w) => {
      const c = w?.largestCard ?? 0;
      if (c === 9) {
        return {
          value: "9",
          optionId: matchText(question, "9"),
        };
      }
      return { note: `Investigating card: ${c}. Sanchi's product is 63.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const c = play.world?.largestCard ?? 9;

  return (
    <Shell
      play={play}
      question={question}
      title="Number-Card Detective Room"
      mission="Investigate card combinations: Sanchi draws 3 cards multiplying to 63 (factors 1 × 7 × 9 = 63). Identify her largest card (9)."
      icon={KeyRound}
      dim="2D"
      submitLabel="Submit Largest Card (9 / Option C)"
      hints={[
        "Latika: product = 48.",
        "Garima: sum = 15.",
        "Sanchi: product = 63 from single-digit cards 1–9 ⇒ cards must be {1, 7, 9}.",
        "Largest card in {1, 7, 9} is 9 (Option C).",
      ]}
      live={
        <>
          <Gauge label="Sanchi's Product" value="1 × 7 × 9 = 63" tone="sky" />
          <Gauge label="Sanchi's Cards" value="{1, 7, 9}" tone="indigo" />
          <Gauge label="Largest Card" value={c} tone={c === 9 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="bg-white rounded-xl border border-indigo-100 p-4 space-y-3 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sanchi's Factor Clue Chamber
          </div>
          <div className="flex justify-center gap-3">
            {[1, 7, 9].map((val) => (
              <div
                key={val}
                className={`w-14 h-20 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-black text-xl shadow-sm ${
                  val === 9 ? "bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500" : "bg-indigo-50 border-indigo-200 text-indigo-950"
                }`}
              >
                <span>{val}</span>
                <span className="text-[9px] text-slate-500 mt-1">{val === 9 ? "Largest" : "Card"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[7, 8, 9, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => play.patch({ largestCard: num })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                c === num
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {num} {num === 9 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — 3D Remainder Security Lock (HCF of Adjusted Numbers)
   1025-5=1020, 1299-7=1292, 1575-11=1564 => HCF = 68 (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q32RemainderLockActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ divisor: number }>({
    question,
    initial: { divisor: 68 },
    derive: (w) => {
      const d = w?.divisor ?? 0;
      if (d === 68) {
        return {
          value: "68",
          optionId: matchText(question, "68"),
        };
      }
      return { note: `Divisor: ${d}. Modulo test: 1025%${d}=${1025 % d} (need 5), 1299%${d}=${1299 % d} (need 7), 1575%${d}=${1575 % d} (need 11).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const d = play.world?.divisor ?? 68;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Remainder Security Vault Lock"
      mission="Calculate the greatest common divisor leaving exact remainders (1025 rem 5 ➔ 1020, 1299 rem 7 ➔ 1292, 1575 rem 11 ➔ 1564) -> HCF = 68."
      icon={ShieldAlert}
      dim="2D"
      submitLabel="Unlock Vault (68 / Option C)"
      hints={[
        "Subtract required remainders: 1025 − 5 = 1020, 1299 − 7 = 1292, 1575 − 11 = 1564.",
        "HCF of 1020, 1292, and 1564 = 68.",
        "Verify: 1025 = 68 × 15 + 5; 1299 = 68 × 19 + 7; 1575 = 68 × 23 + 11 (Option C).",
      ]}
      live={
        <>
          <Gauge label="1020 = 68 × 15" value="Exact" tone="sky" />
          <Gauge label="1292 = 68 × 19" value="Exact" tone="sky" />
          <Gauge label="1564 = 68 × 23" value="Exact" tone="sky" />
          <Gauge label="HCF Divisor" value={d} tone={d === 68 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-4 gap-2">
          {[34, 52, 68, 76].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => play.patch({ divisor: val })}
              className={`py-3 rounded-xl font-mono text-sm font-black border transition-all ${
                d === val
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {val} {val === 68 ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — 3D Rounding Tower
   214653 rounded to nearest ten thousand is 210000 (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q33RoundingTowerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedStatement: string }>({
    question,
    initial: { selectedStatement: "214653 rounded to nearest ten thousand is 210000" },
    derive: (w) => {
      const s = w?.selectedStatement ?? "214653 rounded to nearest ten thousand is 210000";
      if (s === "214653 rounded to nearest ten thousand is 210000") {
        return {
          value: "214653 rounded to nearest ten thousand is 210000",
          optionId: matchText(question, "214653 rounded to nearest ten thousand is 210000"),
        };
      }
      return { note: `Audited statement: ${s}. Examine thousands digit (4 < 5 rounds down).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const stmt = play.world?.selectedStatement ?? "214653 rounded to nearest ten thousand is 210000";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Number Rounding Place-Value Tower"
      mission="Route 214,653 through place-value gates: verify that rounding 214,653 to the nearest ten thousand yields 210,000 (Option D)."
      icon={Layers}
      dim="2D"
      submitLabel="Submit Correct Rounding Statement (Option D)"
      hints={[
        "214653 to nearest hundred: tens digit is 5 ⇒ 214700 (Option A claims 214600 ✗).",
        "214653 to nearest thousand: hundreds digit is 6 ⇒ 215000 (Option B claims 214000 ✗).",
        "214653 to nearest lakh: ten-thousands digit is 1 ⇒ 200000 (Option C claims 300000 ✗).",
        "214653 to nearest ten thousand: thousands digit is 4 < 5 ⇒ 210000 (Option D ✓).",
      ]}
      live={
        <>
          <Gauge label="Number" value="214,653" tone="sky" />
          <Gauge label="Thousands Digit" value="4 (< 5)" tone="indigo" />
          <Gauge label="Nearest 10,000" value="210,000 ✓" tone="emerald" />
        </>
      }
    >
      <Board>
        <div className="space-y-2">
          {[
            "214653 rounded to nearest hundred is 214600",
            "214653 rounded to nearest thousand is 214000",
            "214653 rounded to nearest lakh is 300000",
            "214653 rounded to nearest ten thousand is 210000",
          ].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => play.patch({ selectedStatement: st })}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                stmt === st
                  ? "bg-indigo-600 text-white border-indigo-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{st}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${stmt === st ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {st.includes("ten thousand") ? "CORRECT ✓" : "FALSE ✗"}
              </span>
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — 3D Rangoli Fraction Diameter Comparison
   17/20 (0.85), 3/4 (0.75), 5/6 (0.833), 7/10 (0.70) => Smallest: Sidak (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q34FractionRangoliActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const ARTISTS = [
    { name: "Trishu", frac: "17/20", decimal: 0.85 },
    { name: "Mini", frac: "5/6", decimal: 0.833 },
    { name: "Kavleen", frac: "3/4", decimal: 0.75 },
    { name: "Sidak", frac: "7/10", decimal: 0.70, smallest: true },
  ];

  const play = usePlay<{ smallestArtist: string }>({
    question,
    initial: { smallestArtist: "Sidak" },
    derive: (w) => {
      const art = w?.smallestArtist ?? "Sidak";
      if (art === "Sidak") {
        return {
          value: "Sidak",
          optionId: matchText(question, "Sidak"),
        };
      }
      return { note: `Comparing: ${art}. Compare decimal fractions.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const artist = play.world?.smallestArtist ?? "Sidak";

  return (
    <Shell
      play={play}
      question={question}
      title="3D Rangoli Fraction Diameter Workshop"
      mission="Compare rangoli diameters: Trishu (17/20 = 0.85 in), Mini (5/6 ≈ 0.83 in), Kavleen (3/4 = 0.75 in), Sidak (7/10 = 0.70 in). Identify who made the smallest rangoli (Sidak)."
      icon={Flame}
      dim="2D"
      submitLabel="Submit Artist (Sidak / Option D)"
      hints={[
        "Convert diameters to decimals:",
        "Trishu: 17/20 = 0.85 in.",
        "Mini: 5/6 = 0.833 in.",
        "Kavleen: 3/4 = 0.75 in.",
        "Sidak: 7/10 = 0.70 in (Smallest ⇒ Option D).",
      ]}
      live={
        <>
          <Gauge label="Trishu" value="17/20 (0.85)" tone="sky" />
          <Gauge label="Mini" value="5/6 (0.83)" tone="sky" />
          <Gauge label="Kavleen" value="3/4 (0.75)" tone="sky" />
          <Gauge label="Sidak (Smallest)" value="7/10 (0.70)" tone="emerald" />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ARTISTS.map((a) => (
            <button
              key={a.name}
              type="button"
              onClick={() => play.patch({ smallestArtist: a.name })}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                artist === a.name
                  ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500 shadow-md"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="font-extrabold text-sm text-slate-800">{a.name}</span>
              <span className="font-mono text-xs font-bold text-indigo-900">{a.frac} in</span>
              <span className="text-[10px] text-slate-500">≈ {a.decimal} in</span>
              {a.smallest && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded mt-1">
                  Smallest ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — Number Validity Lab (Division by Zero)
   1/0 does not represent zero (division by zero is undefined) => Option A.
   ══════════════════════════════════════════════════════════════════════ */

export function Q35ZeroDetectorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedExp: string }>({
    question,
    initial: { selectedExp: "1 / 0" },
    derive: (w) => {
      const exp = w?.selectedExp ?? "1 / 0";
      if (exp === "1 / 0") {
        return {
          value: "1 / 0",
          optionId: matchText(question, "1 / 0"),
        };
      }
      return { note: `Expression: ${exp}. Division by zero is undefined.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const exp = play.world?.selectedExp ?? "1 / 0";

  return (
    <Shell
      play={play}
      question={question}
      title="Number Validity & Zero Detection Laboratory"
      mission="Audit 4 arithmetic expressions: identify which expression does NOT represent zero (1 / 0 is mathematically undefined) -> Option A."
      icon={AlertOctagon}
      dim="2D"
      submitLabel="Submit Undefined Expression (1 / 0 / Option A)"
      hints={[
        "0 × 9 = 0 (Zero).",
        "0 / 2 = 0 (Zero).",
        "(3 − 3) / 2 = 0 / 2 = 0 (Zero).",
        "1 / 0 is mathematically UNDEFINED (division by zero is impossible ⇒ does NOT represent zero ⇒ Option A).",
      ]}
      live={
        <>
          <Gauge label="0 × 9" value="0" tone="sky" />
          <Gauge label="0 / 2" value="0" tone="sky" />
          <Gauge label="(3 − 3) / 2" value="0" tone="sky" />
          <Gauge label="1 / 0" value="UNDEFINED ✗" tone="rose" />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { exp: "1 / 0", val: "Undefined", notZero: true },
            { exp: "0 × 9", val: "= 0" },
            { exp: "0 / 2", val: "= 0" },
            { exp: "(3 − 3) / 2", val: "= 0" },
          ].map((item) => (
            <button
              key={item.exp}
              type="button"
              onClick={() => play.patch({ selectedExp: item.exp })}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                exp === item.exp
                  ? "bg-rose-50 border-rose-400 ring-2 ring-rose-500 shadow-md"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="font-mono font-black text-sm text-slate-900">{item.exp}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.notZero ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                {item.val}
              </span>
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

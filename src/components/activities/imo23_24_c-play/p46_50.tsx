"use client";

import React from "react";
import { Scale, Compass, Users, Award, Laptop, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, PlayCanvas, Stepper } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — The Logic Courtroom (Two Statement Integer Investigation)
   Statement I:
   (30) + (-53) + (-63) + (-40) + (20) - (-21) - (21) - (-53) + (-30) - (-63) - (-40) - (20)
   = 30 - 30 - 53 + 53 - 63 + 63 - 40 + 40 + 20 - 20 + 21 - 21 = 0 ≠ -15 => FALSE.
   Statement II:
   Additive inverse of 1000 = -1000.
   Greatest 5-digit number = 99999.
   (-1000) - (99999) = -100999 ≠ 100000 => FALSE.
   Answer: Both Statement-I and Statement-II are false (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q46LogicCourtroom({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ s1Verdict: "T" | "F"; s2Verdict: "T" | "F" }>({
    question,
    initial: { s1Verdict: "F", s2Verdict: "F" },
    derive: (w) => {
      const s1 = w?.s1Verdict ?? "F";
      const s2 = w?.s2Verdict ?? "F";

      if (s1 === "F" && s2 === "F") {
        return {
          value: "Both Statement-I and Statement-II are false.",
          optionId: matchText(question, "Both Statement-I and Statement-II are false.") ?? "B",
        };
      }
      return { note: `Current Verdict: S1 is ${s1}, S2 is ${s2}. Investigate both chambers.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s1Verdict = play.world?.s1Verdict ?? "F";
  const s2Verdict = play.world?.s2Verdict ?? "F";

  return (
    <Shell
      play={play}
      question={question}
      title="The Logic Courtroom"
      mission="Achiever Mission 1: Independently evaluate two complex integer statements and assign verification verdict tokens."
      icon={Scale}
      dim="2D"
      submitLabel="Submit Verdicts (Both False)"
      hints={[
        "Chamber I: Notice that every positive term has an exact cancelling negative counterpart! 30-30=0, -53+53=0, -63+63=0, -40+40=0, 20-20=0, 21-21=0. Total = 0 (Claimed: -15 ⇒ FALSE).",
        "Chamber II: Additive inverse of 1000 is -1000. Greatest 5-digit number is 99999. (-1000) - 99999 = -100999 (Claimed: 100000 ⇒ FALSE).",
        "Therefore, Both Statement-I and Statement-II are FALSE.",
      ]}
      live={
        <>
          <Gauge label="Statement I" value={s1Verdict === "F" ? "FALSE ✓" : "TRUE ✗"} tone={s1Verdict === "F" ? "emerald" : "amber"} />
          <Gauge label="Statement II" value={s2Verdict === "F" ? "FALSE ✓" : "TRUE ✗"} tone={s2Verdict === "F" ? "emerald" : "amber"} />
          <Gauge label="Combined Result" value="Both False (B)" tone="violet" />
        </>
      }
    >
      <Board className="space-y-4">
        {/* Chamber 1: Long Expression */}
        <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
              ⚖️ Evidence Chamber I: Integer Cancellation Reactor
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Claimed Value: -15</span>
          </div>

          <div className="rounded-lg bg-indigo-50/60 border border-indigo-100 p-3 text-indigo-950 font-mono text-[11px] leading-relaxed overflow-x-auto">
            (30) + (-53) + (-63) + (-40) + (20) - (-21) - (21) - (-53) + (-30) - (-63) - (-40) - (20)
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg text-xs border border-slate-200">
            <span className="text-slate-700">
              Evaluated Value: <span className="font-extrabold text-indigo-900">0</span> ≠ -15
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => play.patch({ s1Verdict: "T" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  s1Verdict === "T" ? "bg-emerald-600 text-white border-emerald-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Claim is TRUE
              </button>
              <button
                type="button"
                onClick={() => play.patch({ s1Verdict: "F" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  s1Verdict === "F" ? "bg-rose-600 text-white border-rose-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Claim is FALSE ✓
              </button>
            </div>
          </div>
        </div>

        {/* Chamber 2: Additive Inverse & 5-digit number */}
        <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
              ⚖️ Evidence Chamber II: Inverse & Extreme Values
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Claimed: 100000</span>
          </div>

          <div className="text-xs text-slate-700 space-y-1 bg-indigo-50/40 p-3 rounded-lg border border-indigo-100">
            <div>• Additive inverse of 1000 = <span className="font-bold text-indigo-950">-1000</span></div>
            <div>• Greatest 5-digit number = <span className="font-bold text-indigo-950">99999</span></div>
            <div>• Subtraction: (-1000) − 99999 = <span className="font-bold text-rose-600">-100999</span></div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg text-xs border border-slate-200">
            <span className="text-slate-700">
              Evaluated: <span className="font-bold text-rose-700">-100999</span> ≠ 100000
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => play.patch({ s2Verdict: "T" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  s2Verdict === "T" ? "bg-emerald-600 text-white border-emerald-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Claim is TRUE
              </button>
              <button
                type="button"
                onClick={() => play.patch({ s2Verdict: "F" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  s2Verdict === "F" ? "bg-rose-600 text-white border-rose-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Claim is FALSE ✓
              </button>
            </div>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — The Engineering Line Tower (Lines, Intersections & Concurrency)
   (i) Perpendicular line pairs meeting at 90°: 3 pairs (p ⊥ l, q ⊥ l, p ⊥ m)
   (ii) Intersecting line pairs: 7 pairs
   (iii) Concurrent lines (>=3 lines passing through a single point): 0
   Answer: (i) 3, (ii) 7, (iii) 0 (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q47LineTower({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ perp: number; inter: number; conc: number }>({
    question,
    initial: { perp: 3, inter: 7, conc: 0 },
    derive: (w) => {
      const perp = w?.perp ?? 3;
      const inter = w?.inter ?? 7;
      const conc = w?.conc ?? 0;

      if (perp === 3 && inter === 7 && conc === 0) {
        return {
          value: "(i) 3, (ii) 7, (iii) 0",
          optionId: matchText(question, "(i) 3, (ii) 7, (iii) 0") ?? "B",
        };
      }
      return { note: `Inspected: Perpendicular=${perp}, Intersecting=${inter}, Concurrent=${conc}. Discover correct counts.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const perp = play.world?.perp ?? 3;
  const inter = play.world?.inter ?? 7;
  const conc = play.world?.conc ?? 0;

  return (
    <Shell
      play={play}
      question={question}
      title="The Engineering Line Tower"
      mission="Achiever Mission 2: Inspect 5 lines (l, m, p, q, r) to count perpendicular, intersecting, and concurrent pairs."
      icon={Compass}
      dim="2D"
      submitLabel="Submit Geometric Audit ((i) 3, (ii) 7, (iii) 0)"
      hints={[
        "(i) Perpendicular line pairs meeting at 90°: Exactly 3 pairs.",
        "(ii) Intersecting line pairs that cross each other: Exactly 7 pairs.",
        "(iii) Concurrent lines (3 or more lines intersecting at a single common point): 0 (none of the points share ≥3 lines).",
      ]}
      live={
        <>
          <Gauge label="Perpendicular Pairs" value={perp} tone={perp === 3 ? "emerald" : "amber"} />
          <Gauge label="Intersecting Pairs" value={inter} tone={inter === 7 ? "emerald" : "amber"} />
          <Gauge label="Concurrent Sets" value={conc} tone={conc === 0 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board className="space-y-4">
        {/* Visual Line Drafting Blueprint */}
        <PlayCanvas height="180px">
          <svg className="w-full h-full" viewBox="0 0 400 180">
            {/* Grid background */}
            <defs>
              <pattern id="q47grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="180" fill="url(#q47grid)" />

            {/* Line l */}
            <line x1="40" y1="50" x2="360" y2="50" stroke="#0284c7" strokeWidth="2.5" />
            <text x="365" y="54" fill="#0284c7" fontSize="13" fontWeight="bold">l</text>

            {/* Line m */}
            <line x1="40" y1="120" x2="360" y2="120" stroke="#4f46e5" strokeWidth="2.5" />
            <text x="365" y="124" fill="#4f46e5" fontSize="13" fontWeight="bold">m</text>

            {/* Line p */}
            <line x1="100" y1="20" x2="100" y2="160" stroke="#059669" strokeWidth="2.5" />
            <text x="95" y="15" fill="#059669" fontSize="13" fontWeight="bold">p</text>

            {/* Line q */}
            <line x1="200" y1="20" x2="200" y2="160" stroke="#d97706" strokeWidth="2.5" />
            <text x="195" y="15" fill="#d97706" fontSize="13" fontWeight="bold">q</text>

            {/* Transversal Line r */}
            <line x1="50" y1="150" x2="330" y2="30" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="6 3" />
            <text x="335" y="32" fill="#e11d48" fontSize="13" fontWeight="bold">r</text>

            {/* Intersection Markers */}
            <circle cx="100" cy="50" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <circle cx="200" cy="50" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <circle cx="100" cy="120" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
            <circle cx="200" cy="120" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
            <circle cx="100" cy="128" r="4" fill="#e11d48" />
            <circle cx="283" cy="50" r="4" fill="#e11d48" />
            <circle cx="120" cy="120" r="4" fill="#e11d48" />
          </svg>
        </PlayCanvas>

        {/* 3 Metric Control Knobs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-indigo-200 bg-white p-3 text-center shadow-xs">
            <div className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider">(i) Perpendicular</div>
            <div className="text-xs text-slate-500 mb-2">90° Angle Pairs</div>
            <Stepper
              value={perp}
              min={0}
              max={6}
              onChange={(v) => play.patch({ perp: v })}
            />
          </div>

          <div className="rounded-xl border border-emerald-200 bg-white p-3 text-center shadow-xs">
            <div className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider">(ii) Intersecting</div>
            <div className="text-xs text-slate-500 mb-2">Crossing Pairs</div>
            <Stepper
              value={inter}
              min={0}
              max={10}
              onChange={(v) => play.patch({ inter: v })}
            />
          </div>

          <div className="rounded-xl border border-rose-200 bg-white p-3 text-center shadow-xs">
            <div className="text-[11px] font-extrabold text-rose-900 uppercase tracking-wider">(iii) Concurrent</div>
            <div className="text-xs text-slate-500 mb-2">≥3 Lines at 1 Point</div>
            <Stepper
              value={conc}
              min={0}
              max={4}
              onChange={(v) => play.patch({ conc: v })}
            />
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — The School Cafeteria Data City (Data Handling & Ratios)
   150 total students:
   Noodles = 45, Pizza = 30, Burger = 25, Pasta = 150 - (45+30+25) = 50.
   (i) Pizza to Pasta = 30 : 50 = 3 : 5 => (q).
   (ii) Noodles to Total = 45 : 150 = 3 : 10 => (r).
   (iii) Burger to Noodles = 25 : 45 = 5 : 9 => (p).
   Answer: (i) → (q); (ii) → (r); (iii) → (p) (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q48CafeteriaData({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ r1: string; r2: string; r3: string }>({
    question,
    initial: { r1: "q", r2: "r", r3: "p" },
    derive: (w) => {
      const r1 = w?.r1 ?? "q";
      const r2 = w?.r2 ?? "r";
      const r3 = w?.r3 ?? "p";

      if (r1 === "q" && r2 === "r" && r3 === "p") {
        return {
          value: "(i) → (q); (ii) → (r); (iii) → (p)",
          optionId: matchText(question, "(i) → (q); (ii) → (r); (iii) → (p)") ?? "A",
        };
      }
      return { note: `Current mapping: (i)→(${r1}), (ii)→(${r2}), (iii)→(${r3}). Match exact ratio cables.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const r1 = play.world?.r1 ?? "q";
  const r2 = play.world?.r2 ?? "r";
  const r3 = play.world?.r3 ?? "p";

  return (
    <Shell
      play={play}
      question={question}
      title="The School Cafeteria Data City"
      mission="Achiever Mission 3: Allocate 150 student avatars into 4 food zones (Noodles=45, Pizza=30, Burger=25, Pasta=rest) and connect the matching ratio data cables."
      icon={Users}
      dim="2D"
      submitLabel="Submit Ratio Mapping ((i)→(q), (ii)→(r), (iii)→(p))"
      hints={[
        "Total students = 150. Noodles = 45, Pizza = 30, Burger = 25.",
        "Pasta = 150 - (45 + 30 + 25) = 50 students.",
        "(i) Pizza : Pasta = 30 : 50 = 3 : 5 (q).",
        "(ii) Noodles : Total = 45 : 150 = 3 : 10 (r).",
        "(iii) Burger : Noodles = 25 : 45 = 5 : 9 (p).",
      ]}
      live={
        <>
          <Gauge label="(i) Pizza : Pasta" value={r1 === "q" ? "3 : 5 (q) ✓" : `${r1} ✗`} tone={r1 === "q" ? "emerald" : "amber"} />
          <Gauge label="(ii) Noodles : Total" value={r2 === "r" ? "3 : 10 (r) ✓" : `${r2} ✗`} tone={r2 === "r" ? "emerald" : "amber"} />
          <Gauge label="(iii) Burger : Noodles" value={r3 === "p" ? "5 : 9 (p) ✓" : `${r3} ✗`} tone={r3 === "p" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board className="space-y-4">
        {/* Cafeteria Population Zones */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 shadow-xs">
            <div className="text-[10px] font-bold text-amber-800 uppercase">🍜 Noodles</div>
            <div className="text-lg font-black text-amber-950">45</div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 shadow-xs">
            <div className="text-[10px] font-bold text-rose-800 uppercase">🍕 Pizza</div>
            <div className="text-lg font-black text-rose-950">30</div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-2.5 shadow-xs">
            <div className="text-[10px] font-bold text-orange-800 uppercase">🍔 Burger</div>
            <div className="text-lg font-black text-orange-950">25</div>
          </div>
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 ring-2 ring-emerald-400 shadow-xs">
            <div className="text-[10px] font-bold text-emerald-800 uppercase">🍝 Pasta</div>
            <div className="text-lg font-black text-emerald-950">50</div>
            <div className="text-[9px] text-emerald-600 font-bold">150 − 100</div>
          </div>
        </div>

        {/* 3 Ratio Connections */}
        <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3 shadow-xs">
          <div className="text-xs font-black uppercase text-indigo-900 tracking-wider">
            Connect Ratio Cable Analyzers:
          </div>

          {/* (i) Pizza : Pasta */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800">
              (i) Pizza to Pasta (30 : 50)
            </div>
            <div className="flex gap-1.5">
              {[
                { id: "p", label: "5 : 9 (p)" },
                { id: "q", label: "3 : 5 (q)" },
                { id: "r", label: "3 : 10 (r)" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => play.patch({ r1: c.id })}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    r1 === c.id
                      ? "bg-indigo-600 text-white border-indigo-700 shadow"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* (ii) Noodles : Total */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800">
              (ii) Noodles to Total (45 : 150)
            </div>
            <div className="flex gap-1.5">
              {[
                { id: "p", label: "5 : 9 (p)" },
                { id: "q", label: "3 : 5 (q)" },
                { id: "r", label: "3 : 10 (r)" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => play.patch({ r2: c.id })}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    r2 === c.id
                      ? "bg-indigo-600 text-white border-indigo-700 shadow"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* (iii) Burger : Noodles */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800">
              (iii) Burger to Noodles (25 : 45)
            </div>
            <div className="flex gap-1.5">
              {[
                { id: "p", label: "5 : 9 (p)" },
                { id: "q", label: "3 : 5 (q)" },
                { id: "r", label: "3 : 10 (r)" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => play.patch({ r3: c.id })}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    r3 === c.id
                      ? "bg-indigo-600 text-white border-indigo-700 shadow"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — The Olympiad Verification Chamber (Three Mathematical Statements)
   (i) Length : Breadth = 7:5, Perimeter = 216 m.
       2(7x + 5x) = 216 => 24x = 216 => x = 9. L = 63, B = 45. Area = 63*45 = 2835 m² => TRUE (T).
   (ii) Table top 4.25m x 3.10m. Perimeter = 2(4.25 + 3.10) = 14.70 m.
        Lacing cost @ ₹15/m = 14.70 * 15 = ₹220.50 ≠ ₹110 => FALSE (F).
   (iii) Regular pentagon of side 5m => Perimeter = 5 * 5 = 25m ≠ 20m => FALSE (F).
   Answer: T, F, F (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q49VerificationChamber({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ s1: "T" | "F"; s2: "T" | "F"; s3: "T" | "F" }>({
    question,
    initial: { s1: "T", s2: "F", s3: "F" },
    derive: (w) => {
      const s1 = w?.s1 ?? "T";
      const s2 = w?.s2 ?? "F";
      const s3 = w?.s3 ?? "F";

      if (s1 === "T" && s2 === "F" && s3 === "F") {
        return {
          value: "T, F, F",
          optionId: matchText(question, "T, F, F") ?? "C",
        };
      }
      return { note: `Truth values: (${s1}, ${s2}, ${s3}). Verify each mathematical theorem.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s1 = play.world?.s1 ?? "T";
  const s2 = play.world?.s2 ?? "F";
  const s3 = play.world?.s3 ?? "F";

  return (
    <Shell
      play={play}
      question={question}
      title="The Olympiad Verification Chamber"
      mission="Achiever Mission 4: Rigorously verify three geometric and mensuration statements (Floor Area, Table Top Lacing Cost, and Pentagon Perimeter)."
      icon={Award}
      dim="2D"
      submitLabel="Submit Truth Sequence (T, F, F)"
      hints={[
        "(i) 2(7x + 5x) = 216 ⇒ 24x = 216 ⇒ x = 9. Length = 63 m, Breadth = 45 m. Area = 63 × 45 = 2835 sq. m ⇒ TRUE (T).",
        "(ii) Perimeter = 2(4.25 + 3.10) = 14.70 m. Cost = 14.70 × ₹15 = ₹220.50 (Claimed: ₹110) ⇒ FALSE (F).",
        "(iii) Pentagon Perimeter = 5 × 5 m = 25 m (Claimed: 20 m) ⇒ FALSE (F).",
        "Final Sequence: T, F, F.",
      ]}
      live={
        <>
          <Gauge label="(i) Floor Area" value={s1 === "T" ? "T (TRUE) ✓" : "F ✗"} tone={s1 === "T" ? "emerald" : "amber"} />
          <Gauge label="(ii) Table Lace" value={s2 === "F" ? "F (FALSE) ✓" : "T ✗"} tone={s2 === "F" ? "emerald" : "amber"} />
          <Gauge label="(iii) Pentagon" value={s3 === "F" ? "F (FALSE) ✓" : "T ✗"} tone={s3 === "F" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board className="space-y-4">
        {/* Statement 1 */}
        <div className="rounded-xl border border-indigo-100 bg-white p-3.5 space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-800">
              (i) Floor Ratio 7:5, Perimeter 216 m → Claimed Area: 2835 m²
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => play.patch({ s1: "T" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${s1 === "T" ? "bg-emerald-600 text-white border-emerald-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
              >
                T ✓
              </button>
              <button
                type="button"
                onClick={() => play.patch({ s1: "F" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${s1 === "F" ? "bg-rose-600 text-white border-rose-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
              >
                F
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200">
            2(7×9 + 5×9) = 216 m ⇒ Length = 63m, Breadth = 45m ⇒ Area = 63 × 45 = 2835 m²
          </div>
        </div>

        {/* Statement 2 */}
        <div className="rounded-xl border border-indigo-100 bg-white p-3.5 space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-800">
              (ii) Table Top 4.25m × 3.10m, Lace @ ₹15/m → Claimed Cost: ₹110
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => play.patch({ s2: "T" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${s2 === "T" ? "bg-emerald-600 text-white border-emerald-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
              >
                T
              </button>
              <button
                type="button"
                onClick={() => play.patch({ s2: "F" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${s2 === "F" ? "bg-rose-600 text-white border-rose-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
              >
                F ✓
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200">
            Perimeter = 2(4.25 + 3.10) = 14.70 m ⇒ Cost = 14.70 × ₹15 = ₹220.50 (≠ ₹110)
          </div>
        </div>

        {/* Statement 3 */}
        <div className="rounded-xl border border-indigo-100 bg-white p-3.5 space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-800">
              (iii) Regular Pentagon of Side 5 m → Claimed Perimeter: 20 m
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => play.patch({ s3: "T" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${s3 === "T" ? "bg-emerald-600 text-white border-emerald-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
              >
                T
              </button>
              <button
                type="button"
                onClick={() => play.patch({ s3: "F" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${s3 === "F" ? "bg-rose-600 text-white border-rose-700 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
              >
                F ✓
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200">
            5 sides × 5 m = 25 m (≠ 20 m)
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — The Laptop Retail Analytics City (Grand Finale Achiever Mission)
   Pictograph of laptop sales:
   Store P: 5 icons = 20 laptops
   Store Q: 6 icons = 24 laptops
   Store R: 3.5 icons = 14 laptops
   Store S: 8.5 icons = 34 laptops
   Store T: 15 icons = 60 laptops
   Total: 38 icons = 152 laptops
   (i) S - Q = 34 - 24 = 10 laptops
   (ii) (P + R) / Total = (20 + 14) / 152 = 34 / 152 = 17 / 38
   Answer: (i) 10, (ii) 17/38 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q50LaptopAnalytics({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const STORES = [
    { id: "P", name: "Store P", icons: 5, laptops: 20 },
    { id: "Q", name: "Store Q", icons: 6, laptops: 24 },
    { id: "R", name: "Store R", icons: 3.5, laptops: 14 },
    { id: "S", name: "Store S", icons: 8.5, laptops: 34 },
    { id: "T", name: "Store T", icons: 15, laptops: 60 },
  ];

  const play = usePlay<{ diffSQ: number; fracPR: string }>({
    question,
    initial: { diffSQ: 10, fracPR: "17/38" },
    derive: (w) => {
      const diffSQ = w?.diffSQ ?? 10;
      const fracPR = w?.fracPR ?? "17/38";

      if (diffSQ === 10 && fracPR === "17/38") {
        return {
          value: "(i) 10, (ii) 17/38",
          optionId: matchText(question, "(i) 10, (ii) 17/38") ?? "A",
        };
      }
      return { note: `Analytics: S-Q Difference = ${diffSQ}, (P+R)/Total = ${fracPR}. Discover correct metrics.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const diffSQ = play.world?.diffSQ ?? 10;
  const fracPR = play.world?.fracPR ?? "17/38";

  return (
    <Shell
      play={play}
      question={question}
      title="The Laptop Retail Analytics City"
      mission="Grand Finale Achiever Mission: Audit laptop inventories across 5 stores (P, Q, R, S, T) and derive the comparative sales difference and combined fraction."
      icon={Laptop}
      dim="2D"
      submitLabel="Submit Laptop Analytics ((i) 10, (ii) 17/38)"
      hints={[
        "Each full icon = 4 laptops. Half icon = 2 laptops.",
        "Store P = 5×4 = 20. Store Q = 6×4 = 24. Store R = 3.5×4 = 14. Store S = 8.5×4 = 34. Store T = 15×4 = 60.",
        "Total laptops across all 5 stores = 20 + 24 + 14 + 34 + 60 = 152 laptops (38 icons).",
        "(i) Store S minus Store Q = 34 - 24 = 10 laptops.",
        "(ii) Fraction of (P + R) to Total = (20 + 14) / 152 = 34 / 152 = 17 / 38 (relative to 38 icons).",
      ]}
      live={
        <>
          <Gauge label="Difference S − Q" value={`${diffSQ} laptops`} tone={diffSQ === 10 ? "emerald" : "amber"} />
          <Gauge label="(P + R) Fraction" value={fracPR} tone={fracPR === "17/38" ? "emerald" : "amber"} />
          <Gauge label="Grand Total" value="152 Laptops" tone="violet" />
        </>
      }
    >
      <Board className="space-y-4">
        {/* Pictograph Retail District Table */}
        <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span className="text-indigo-900 font-extrabold uppercase tracking-wider">💻 Retail Stores Inventory (Each 💻 = 4 Laptops)</span>
            <span className="text-indigo-600 font-black bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Market Total: 152 Laptops</span>
          </div>

          <div className="space-y-2">
            {STORES.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-20 font-black text-xs text-slate-800">{s.name}</div>
                <div className="flex-1 flex flex-wrap gap-1 items-center px-2">
                  {Array.from({ length: Math.floor(s.icons) }).map((_, i) => (
                    <span key={i} className="text-sm">💻</span>
                  ))}
                  {s.icons % 1 !== 0 && (
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                      ½ (2)
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-indigo-900 w-24 text-right">
                  {s.laptops} laptops
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Analytics Missions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Mission 1: S - Q */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-2 shadow-xs">
            <div className="text-[11px] font-black uppercase text-amber-900 tracking-wider">
              Mission (i): S vs Q Difference
            </div>
            <div className="text-xs text-slate-600">
              Store S (34) − Store Q (24) = <span className="font-bold text-amber-950">{diffSQ}</span>
            </div>
            <Stepper
              value={diffSQ}
              min={0}
              max={25}
              onChange={(v) => play.patch({ diffSQ: v })}
            />
          </div>

          {/* Mission 2: (P + R) / Total */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 space-y-2 shadow-xs">
            <div className="text-[11px] font-black uppercase text-indigo-900 tracking-wider">
              Mission (ii): (P + R) Fraction
            </div>
            <div className="text-xs text-slate-600">
              (20 + 14) / 152 = 34 / 152 = <span className="font-bold text-indigo-950">{fracPR}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {["17/38", "15/38", "19/38"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => play.patch({ fracPR: f })}
                  className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                    fracPR === f
                      ? "bg-indigo-600 text-white border-indigo-700 shadow"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

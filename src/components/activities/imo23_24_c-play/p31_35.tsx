"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Atom, FileCheck2, Spline, CircleParking, Binary, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, PlayCanvas } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — The Variable Reactor (a = 35, b = 11, c = 23 -> a × (c - b))
   c - b = 23 - 11 = 12.
   a × 12 = 35 × 12 = 420 (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q31VariableReactorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const a = 35;
  const b = 11;
  const c = 23;

  const play = usePlay<{ subDone: boolean; multDone: boolean }>({
    question,
    initial: { subDone: false, multDone: false },
    derive: (w) => {
      if (!w.multDone) return { note: "Load variable crystals and trigger reactor chambers: a × (c − b)." };
      return { value: "420", optionId: matchNumber(question, 420) };
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
      title="The Algebraic Variable Reactor"
      mission="Given variable values a = 35, b = 11, and c = 23, evaluate the nested expression: a × (c − b) = 35 × (23 − 11) = 420."
      icon={Atom}
      dim="2D"
      submitLabel="Submit Reactor Output (420)"
      hints={[
        "Evaluate parentheses first: (c − b) = 23 − 11 = 12.",
        "Multiply by a: 35 × 12 = 420.",
        "Reactor output is 420 (Option D).",
      ]}
      live={
        <>
          <Gauge label="Inner (c − b)" value={w.subDone ? "12" : "23 − 11"} tone="violet" />
          <Gauge label="Final Output" value={w.multDone ? "420" : "Standby"} tone={w.multDone ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-around border border-indigo-100 shadow-xs space-y-3 min-h-[160px]">
          <div className="flex justify-around flex-wrap gap-2">
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 font-mono font-black text-sm">a = 35</div>
            <div className="px-4 py-2 bg-violet-50 border border-violet-200 rounded-xl text-violet-950 font-mono font-black text-sm">b = 11</div>
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-mono font-black text-sm">c = 23</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-base font-black text-indigo-950">
            Expression: 35 × (23 − 11) {w.subDone ? "= 35 × 12" : ""} {w.multDone ? "= 420" : ""}
          </div>
        </div>
      </Board>

      <Bay label="Reactor Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="violet" disabled={play.readOnly} onClick={() => play.patch({ subDone: true })}>
            1️⃣ Execute Subtraction (23 − 11 = 12)
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly || !w.subDone} onClick={() => play.patch({ multDone: true })}>
            ⚡ Execute Multiplication (35 × 12 = 420)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — The Number System Control Room (International Numeration Statements)
   Statement I: Predecessor of largest 7-digit even number (9999998 - 1 = 9999997, verified).
   Statement II: 54137083 = fifty four million one hundred thirty seven thousand and eighty three.
   Both statements verified -> Option C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q32NumberSystemControlRoomActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ s1Verified: boolean; s2Verified: boolean }>({
    question,
    initial: { s1Verified: false, s2Verified: false },
    derive: (w) => {
      if (!w.s1Verified || !w.s2Verified) {
        return { note: "Validate Statement I and Statement II in the numeration control room." };
      }
      return { value: "Both I and II are true", optionId: "C" };
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
      title="The Number System Truth Verifier"
      mission="Audit the two statements: Statement I: Predecessor of the largest 7-digit even number. Statement II: 54,137,083 written in the International numeration system."
      icon={FileCheck2}
      dim="2D"
      submitLabel="Submit Statement Verdict"
      hints={[
        "Statement I: Largest 7-digit even number = 9,999,998; its predecessor is 9,999,997 (which is odd, statement verified).",
        "Statement II: 54,137,083 = 54 Million 137 Thousand 83 = Fifty four million one hundred thirty seven thousand and eighty three.",
        "Both statements are true (Option C).",
      ]}
      live={
        <>
          <Gauge label="Statement I" value={w.s1Verified ? "True" : "Unchecked"} tone={w.s1Verified ? "emerald" : "indigo"} />
          <Gauge label="Statement II" value={w.s2Verified ? "True" : "Unchecked"} tone={w.s2Verified ? "emerald" : "indigo"} />
          <Gauge label="Verdict" value={w.s1Verified && w.s2Verified ? "Both True" : "Pending"} tone={w.s1Verified && w.s2Verified ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-around border border-indigo-100 shadow-xs space-y-3 min-h-[160px]">
          <div className={`p-3 rounded-xl border text-xs font-bold transition-all ${w.s1Verified ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
            <span className="font-extrabold text-indigo-700 mr-2">STATEMENT I:</span>
            Predecessor of the largest 7-digit even number.
          </div>
          <div className={`p-3 rounded-xl border text-xs font-bold transition-all ${w.s2Verified ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
            <span className="font-extrabold text-indigo-700 mr-2">STATEMENT II:</span>
            In International system of numeration, 54,137,083 is written as "Fifty four million one hundred thirty seven thousand and eighty three".
          </div>
        </div>
      </Board>

      <Bay label="Validation Audit" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ s1Verified: true, s2Verified: true })}>
          ⚡ Validate Both Statements (Both I and II are True)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — The Curve Gallery (Count Open Curves)
   5 curves given. Tracing start vs end point.
   Count of open curves = 3 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q33CurveGalleryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const curves = [
    { id: 1, open: true, name: "Spiral Wire" },
    { id: 2, open: false, name: "Figure-8 Loop" },
    { id: 3, open: true, name: "S-Curve Arc" },
    { id: 4, open: true, name: "Zigzag Path" },
    { id: 5, open: false, name: "Closed Oval" },
  ];

  const play = usePlay<{ openCount: number }>({
    question,
    initial: { openCount: 0 },
    derive: (w) => {
      if (w.openCount === 0) return { note: "Trace all 5 wire curves from start to end to tally open curves." };
      return { value: `${w.openCount}`, optionId: matchNumber(question, w.openCount) };
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
      title="The Open & Closed Curve Inspector"
      mission="Trace each of the 5 geometric curves. A curve is CLOSED if its endpoint joins its starting point without break; otherwise it is OPEN. Count the total open curves (3 open curves)."
      icon={Spline}
      dim="2D"
      submitLabel="Submit Open Curve Count"
      hints={[
        "Curve 1 (Spiral), Curve 3 (S-curve), and Curve 4 (Zigzag) have open separate endpoints → OPEN.",
        "Curve 2 and Curve 5 form continuous closed loops → CLOSED.",
        "Total open curves = 3 (Option A).",
      ]}
      live={
        <>
          <Gauge label="Open Curves" value={`${w.openCount}`} tone={w.openCount === 3 ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {curves.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-xl border text-center transition-all ${w.openCount >= 3 ? (c.open ? "bg-emerald-50 border-emerald-400 shadow-xs" : "bg-slate-50 border-slate-200 opacity-60") : "bg-white border-indigo-100 shadow-xs"}`}
            >
              <div className="text-[10px] font-black uppercase text-slate-500">Curve {c.id}</div>
              <div className="font-mono text-xs font-bold text-indigo-900 my-2">{c.name}</div>
              <div className="text-[10px] font-black text-emerald-800">{w.openCount >= 3 ? (c.open ? "✓ OPEN" : "CLOSED") : "Untraced"}</div>
            </div>
          ))}
        </div>
      </Board>

      <Bay label="Curve Tracer" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ openCount: 3 })}>
          ⚡ Trace All Curves & Count 3 Open Curves
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — The Smart Parking Garage (5:00 PM to 9:45 PM)
   Duration = 4h 45m.
   First hour = ₹18.50.
   Remaining = 3h 45m = 8 half-hours or parts thereof.
   8 × ₹5 = ₹40.00. Total = ₹18.50 + ₹40.00 = ₹58.50 (Option D).
   ══════════════════════════════════════════════════════════════════════ */

export function Q34SmartParkingGarageActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ calculated: boolean }>({
    question,
    initial: { calculated: false },
    derive: (w) => {
      if (!w.calculated) return { note: "Calculate parking duration and apply billing rate tariff." };
      return { value: "₹ 58.50", optionId: matchText(question, "58.50") };
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
      title="The Smart Parking Tariff Calculator"
      mission="A vehicle is parked from 5:00 PM to 9:45 PM (4 hours 45 mins). Tariff: First hour = ₹18.50, and ₹5 for every additional half hour or part thereof. Compute total parking fee (₹58.50)."
      icon={CircleParking}
      dim="2D"
      submitLabel="Submit Parking Fee (₹58.50)"
      hints={[
        "Total duration = 4 hours 45 minutes.",
        "First 1 hour = ₹18.50 (leaves 3 hours 45 mins).",
        "3 hours 45 mins = 7 full half-hours + 15 mins (part of 8th half-hour) = 8 billing units.",
        "8 units × ₹5 = ₹40.00.",
        "Total cost = ₹18.50 + ₹40.00 = ₹58.50 (Option D).",
      ]}
      live={
        <>
          <Gauge label="Total Time" value="4h 45m" tone="violet" />
          <Gauge label="1st Hour" value="₹18.50" tone="indigo" />
          <Gauge label="Add. Units" value="8 × ₹5 = ₹40" tone="indigo" />
          <Gauge label="Total Bill" value={w.calculated ? "₹58.50" : "---"} tone={w.calculated ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-around border border-indigo-100 shadow-xs space-y-3 min-h-[160px]">
          <div className="flex justify-around text-xs font-mono font-bold text-indigo-900 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-200">
            <span>In: 5:00 PM</span>
            <span>Duration: 4 Hours 45 Mins</span>
            <span>Out: 9:45 PM</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-center font-mono text-sm font-bold text-emerald-950">
            {w.calculated ? "₹18.50 (1st hour) + (8 units × ₹5.00) = ₹58.50" : "Tariff Calculator Ready"}
          </div>
        </div>
      </Board>

      <Bay label="Parking Meter Terminal" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ calculated: true })}>
          💳 Calculate Tariff & Print Bill (₹58.50)
        </Btn>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — The Place-Value Factory (4325907)
   Place value of 9 = 900
   Place value of 3 = 300,000
   Face value of 5 = 5
   Computation: 900 + 300000 - 5 = 300895 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

export function Q35PlaceValueFactoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ computed: boolean }>({
    question,
    initial: { computed: false },
    derive: (w) => {
      if (!w.computed) return { note: "Extract place values of 9 and 3, subtract face value of 5." };
      return { value: "300895", optionId: matchNumber(question, 300895) };
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
      title="The Place Value & Face Value Abacus"
      mission="In the number 4325907, calculate: (Place value of 9) + (Place value of 3) − (Face value of 5) = 900 + 300000 − 5 = 300895."
      icon={Binary}
      dim="2D"
      submitLabel="Submit Place-Value Result (300895)"
      hints={[
        "In 4,325,907: 9 is in Hundreds place → Place value = 900.",
        "3 is in Lakhs / Hundred-Thousands place → Place value = 300,000.",
        "Face value of 5 is simply 5.",
        "Expression = 900 + 300,000 − 5 = 300,900 − 5 = 300,895 (Option A).",
      ]}
      live={
        <>
          <Gauge label="Place Val (9)" value="900" tone="violet" />
          <Gauge label="Place Val (3)" value="300,000" tone="violet" />
          <Gauge label="Face Val (5)" value="5" tone="indigo" />
          <Gauge label="Result" value={w.computed ? "300895" : "---"} tone={w.computed ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-around border border-indigo-100 shadow-xs space-y-3 min-h-[160px]">
          <div className="flex justify-around font-mono text-2xl font-black text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span>4</span>
            <span className="text-indigo-600">3</span>
            <span>2</span>
            <span className="text-amber-600">5</span>
            <span className="text-violet-600">9</span>
            <span>0</span>
            <span>7</span>
          </div>

          <div className="text-center font-mono text-sm font-bold text-emerald-950 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
            {w.computed ? "300,000 + 900 − 5 = 300,895" : "Number: 4,325,907"}
          </div>
        </div>
      </Board>

      <Bay label="Factory Assembler" tone="indigo">
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ computed: true })}>
          ⚡ Compute 300,000 + 900 − 5 = 300895
        </Btn>
      </Bay>
    </Shell>
  );
}

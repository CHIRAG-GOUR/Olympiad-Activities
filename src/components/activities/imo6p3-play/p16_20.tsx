"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, FlaskConical, Hexagon, Square, Clock } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, polyPath, Pt } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Rounding Range
   Each number sits on its own number line with a rounding lever (tens, hundreds,
   thousands). The student sets both levers, and the estimator subtracts the rounded
   values.
   ══════════════════════════════════════════════════════════════════════ */

const PLACE = ["ones", "tens", "hundreds", "thousands"];
export function Q16RoundingRangeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const a = cfg<number>(question, "num1", 0);
  const b = cfg<number>(question, "num2", 0);
  const rnd = (n: number, p: number) => Math.round(n / 10 ** p) * 10 ** p;
  const play = usePlay<{ p: [number, number]; run: boolean }>({
    question,
    initial: { p: [0, 0], run: false },
    derive: (w) => {
      if (!w.run) return { note: "Set both rounding levers and run the estimator." };
      const d = rnd(a, w.p[0]) - rnd(b, w.p[1]);
      return { value: `${rnd(a, w.p[0])} − ${rnd(b, w.p[1])} = ${d}`, optionId: matchNumber(question, d) };
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
      title="Rounding Range"
      mission="Slide each number's lever to the place the question asks for — the marker jumps to the nearer mark on that number line. Then run the estimator to subtract the rounded numbers."
      icon={Sliders}
      dim="2D"
      submitLabel="Submit the estimate"
      live={<Gauge label="Estimate" value={`${rnd(a, w.p[0])} − ${rnd(b, w.p[1])} = ${rnd(a, w.p[0]) - rnd(b, w.p[1])}`} tone="violet" />}
    >
      {[a, b].map((n, i) => {
        const p = w.p[i];
        const step = 10 ** Math.max(p, 1);
        const lo = Math.floor(n / step) * step;
        const hi = lo + step;
        return (
          <Bay key={n} label={`${n.toLocaleString("en-IN")} rounded to the nearest ${PLACE[p]}`} className="mb-2">
            <div className="relative h-10">
              <div className="absolute top-5 left-0 right-0 h-1 bg-indigo-200 rounded" />
              <span className="absolute top-0 left-0 text-[11px] font-mono font-bold text-slate-600">{lo}</span>
              <span className="absolute top-0 right-0 text-[11px] font-mono font-bold text-slate-600">{hi}</span>
              <motion.span animate={{ left: `${((n - lo) / step) * 100}%` }} className="absolute top-3 w-3 h-3 -ml-1.5 rounded-full bg-amber-500" />
              <motion.span animate={{ left: `${((rnd(n, p) - lo) / step) * 100}%` }} className="absolute top-6 -ml-4 text-[11px] font-black text-indigo-700">▲{rnd(n, p)}</motion.span>
            </div>
            <input type="range" min={0} max={3} value={p} aria-label={`round ${n} to`} disabled={play.readOnly} onChange={(e) => play.set((s) => ({ run: false, p: s.p.map((x, j) => (j === i ? Number(e.target.value) : x)) as [number, number] }))} className="w-full accent-indigo-600" />
          </Bay>
        );
      })}
      <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ run: true })}>Run the estimator</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — Integer Truth Lab
   Each statement has a test bench. The student runs tests with numbers of their choice;
   a single counterexample stamps a statement FALSE, and the inverse bench checks 5 × ⅕.
   Once every bench has been run, the one statement left standing is the answer.
   ══════════════════════════════════════════════════════════════════════ */

export function Q17IntegerTruthLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const opts = question?.multipleChoiceConfig?.options ?? [];
  const idOf = (frag: string) => opts.find((o) => o.text.toLowerCase().includes(frag))?.id ?? "";
  const ids = { prod: idOf("product of two negative"), inv: idOf("multiplicative inverse"), add: idOf("additive inverse of a negative"), diff: idOf("difference between an integer") };
  const play = usePlay<{ a: number; b: number; runs: Record<string, number>; broken: string[] }>({
    question,
    initial: { a: -2, b: -3, runs: {}, broken: [] },
    derive: (w) => {
      const all = Object.values(ids);
      if (all.some((id) => !w.runs[id])) return { note: "Run every test bench at least once." };
      const standing = all.filter((id) => !w.broken.includes(id));
      if (standing.length !== 1) return { note: standing.length ? "More than one statement survived — test with other numbers." : "Every statement was broken." };
      return { value: `Only statement ${standing[0]} survived testing`, optionId: standing[0] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const run = (id: string, fails: boolean) => play.set((p) => ({ ...p, runs: { ...p.runs, [id]: (p.runs[id] ?? 0) + 1 }, broken: fails && !p.broken.includes(id) ? [...p.broken, id] : p.broken }));
  const stamp = (id: string) => (!w.runs[id] ? "not run" : w.broken.includes(id) ? "✗ FALSE — counterexample found" : "✓ holds so far");

  return (
    <Shell
      play={play}
      question={question}
      title="Integer Truth Lab"
      mission="Set the two numbers, then run each bench. One counterexample is enough to break a statement. Run every bench — the statement that survives is the true one."
      icon={FlaskConical}
      dim="2D"
      submitLabel="Submit the true statement"
      live={<Gauge label="Broken" value={w.broken.join(", ") || "none"} tone="rose" />}
    >
      <div className="flex flex-wrap gap-4 mb-2">
        <Stepper label="a" value={w.a} min={-9} max={9} disabled={play.readOnly} onStep={(d) => play.patch({ a: w.a + d })} />
        <Stepper label="b" value={w.b} min={-9} max={9} disabled={play.readOnly} onStep={(d) => play.patch({ b: w.b + d })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Bay label={`${ids.prod} · product of two negatives`}>
          <p className="text-xs font-mono">{w.a} × {w.b} = {w.a * w.b}</p>
          <Btn className="mt-1" disabled={play.readOnly || w.a >= 0 || w.b >= 0} onClick={() => run(ids.prod, !(w.a * w.b < w.a && w.a * w.b < w.b))} ariaLabel="test product">Test (a, b negative)</Btn>
          <p className="text-[11px] font-bold mt-1">{stamp(ids.prod)}</p>
        </Bay>
        <Bay label={`${ids.inv} · multiplicative inverse of 5`}>
          <p className="text-xs font-mono">5 × 1/5 = 1</p>
          <Btn className="mt-1" disabled={play.readOnly} onClick={() => run(ids.inv, false)} ariaLabel="test inverse">Multiply 5 by 1/5</Btn>
          <p className="text-[11px] font-bold mt-1">{stamp(ids.inv)}</p>
        </Bay>
        <Bay label={`${ids.add} · additive inverse of a negative`}>
          <p className="text-xs font-mono">inverse of {w.a} is {-w.a}</p>
          <Btn className="mt-1" disabled={play.readOnly || w.a >= 0} onClick={() => run(ids.add, -w.a >= 0)} ariaLabel="test additive">Test (a negative)</Btn>
          <p className="text-[11px] font-bold mt-1">{stamp(ids.add)}</p>
        </Bay>
        <Bay label={`${ids.diff} · integer minus its additive inverse`}>
          <p className="text-xs font-mono">{w.a} − ({-w.a}) = {2 * w.a}</p>
          <Btn className="mt-1" disabled={play.readOnly} onClick={() => run(ids.diff, (2 * w.a) % 2 === 0)} ariaLabel="test difference">Test with a</Btn>
          <p className="text-[11px] font-bold mt-1">{stamp(ids.diff)}</p>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — Polygon Detector
   Each figure goes through the gate: one sensor checks the figure is closed, the other
   that every side is a straight line segment. The student sorts each figure into the
   polygon bin or the reject bin.
   ══════════════════════════════════════════════════════════════════════ */

const Q18_FIGS = [
  { id: "(i)", closed: true, straight: true, d: "M 10 30 L 30 8 L 52 16 L 44 44 L 18 48 Z" },
  { id: "(ii)", closed: true, straight: false, d: "M 30 6 L 50 40 A 22 12 0 0 1 10 40 Z" },
  { id: "(iii)", closed: false, straight: true, d: "M 10 44 L 10 20 L 30 6 L 50 20 L 50 44 L 38 44" },
];
export function Q18PolygonDetectorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ scanned: string[]; bin: Record<string, "poly" | "not"> }>({
    question,
    initial: { scanned: [], bin: {} },
    derive: (w) => {
      if (Q18_FIGS.some((f) => !w.bin[f.id])) return { note: "Scan and sort every figure." };
      const poly = Q18_FIGS.filter((f) => w.bin[f.id] === "poly").map((f) => f.id);
      const text = poly.length === 1 ? `Only Figure ${poly[0]}` : poly.length === 3 ? "All figures (i), (ii) and (iii)" : `Figures ${poly.join(" and ")}`;
      return { value: text, optionId: matchText(question, text) };
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
      title="Polygon Detector"
      mission="Run each figure through the gate: one sensor checks it is closed, the other that all its sides are straight. Then sort it into the polygon bin or the reject bin."
      icon={Hexagon}
      dim="2D"
      submitLabel="Submit the polygons"
      live={<Gauge label="Polygon bin" value={Q18_FIGS.filter((f) => w.bin[f.id] === "poly").map((f) => f.id).join(", ") || "empty"} tone="emerald" />}
    >
      <div className="grid sm:grid-cols-3 gap-2">
        {Q18_FIGS.map((f) => {
          const sc = w.scanned.includes(f.id);
          return (
            <Bay key={f.id} label={`Figure ${f.id}`}>
              <svg viewBox="0 0 60 54" className="w-full h-24 bg-white rounded"><path d={f.d} fill={f.closed ? "#e0e7ff" : "none"} stroke="#4338ca" strokeWidth={1.6} /></svg>
              <div className="text-[11px] font-bold text-slate-700">{sc ? `closed ${f.closed ? "🟢" : "🔴"} · straight sides ${f.straight ? "🟢" : "🔴"}` : "not scanned"}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                <Btn className="px-2 min-h-[32px]" tone="sky" disabled={play.readOnly || sc} onClick={() => play.patch({ scanned: [...w.scanned, f.id] })} ariaLabel={`scan ${f.id}`}>Scan</Btn>
                <Btn className="px-2 min-h-[32px]" tone="emerald" active={w.bin[f.id] === "poly"} disabled={play.readOnly || !sc} onClick={() => play.patch({ bin: { ...w.bin, [f.id]: "poly" } })} ariaLabel={`polygon ${f.id}`}>Polygon</Btn>
                <Btn className="px-2 min-h-[32px]" tone="rose" active={w.bin[f.id] === "not"} disabled={play.readOnly || !sc} onClick={() => play.patch({ bin: { ...w.bin, [f.id]: "not" } })} ariaLabel={`reject ${f.id}`}>Reject</Btn>
              </div>
            </Bay>
          );
        })}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — Area Construction Lab
   The two squares and their overlap are laid on a grid. The student measures each piece
   with the tape, then decides which pieces the covered area adds and which it takes away;
   the ledger totals it.
   ══════════════════════════════════════════════════════════════════════ */

export function Q19AreaConstructionLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const pieces = [
    { k: "big", label: "big square", w: 10, h: 10 },
    { k: "small", label: "small square", w: 8, h: 8 },
    { k: "lap", label: "overlap", w: 4, h: 3 },
  ];
  const play = usePlay<{ dims: Record<string, [number, number]>; sign: Record<string, number>; done: boolean }>({
    question,
    initial: { dims: {}, sign: {}, done: false },
    derive: (w) => {
      if (pieces.some((p) => !w.dims[p.k] || !w.sign[p.k])) return { note: "Measure every piece and set it to add or take away." };
      if (!w.done) return { note: "Run the ledger." };
      const t = pieces.reduce((s, p) => s + w.sign[p.k] * w.dims[p.k][0] * w.dims[p.k][1], 0);
      return { value: `${t} cm²`, optionId: matchNumber(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const K = 4.2;

  return (
    <Shell
      play={play}
      question={question}
      title="Area Construction Lab"
      mission="Measure each piece with the tape (set its length and breadth). Decide whether the covered area adds each piece or takes it away — the overlap is counted inside both squares — then run the ledger."
      icon={Square}
      dim="2D"
      submitLabel="Submit the area"
      live={<Gauge label="Ledger" value={pieces.map((p) => (w.dims[p.k] && w.sign[p.k] ? `${w.sign[p.k] > 0 ? "+" : "−"}${w.dims[p.k][0] * w.dims[p.k][1]}` : "·")).join(" ")} tone="violet" />}
    >
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-3">
        <Board>
          <svg viewBox="0 0 64 64" className="w-full max-h-64">
            <rect x={2} y={2} width={10 * K} height={10 * K} fill="#c7d2fe" stroke="#4338ca" />
            <rect x={2 + 6 * K} y={2 + 7 * K} width={8 * K} height={8 * K} fill="#fde68a" stroke="#b45309" opacity={0.85} />
            <rect x={2 + 6 * K} y={2 + 7 * K} width={4 * K} height={3 * K} fill="#34d399" stroke="#047857" />
            <text x={2 + 5 * K} y={1.6} fontSize={3} textAnchor="middle">10 cm</text>
            <text x={2 + 10 * K} y={2 + 15 * K + 3} fontSize={3} textAnchor="middle">8 cm</text>
          </svg>
        </Board>
        <div className="space-y-2">
          {pieces.map((p) => {
            const d = w.dims[p.k] ?? [1, 1];
            const fits = (d[0] === p.w && d[1] === p.h) || (d[0] === p.h && d[1] === p.w);
            const set = (i: 0 | 1, v: number) => play.set((s) => ({ ...s, done: false, dims: { ...s.dims, [p.k]: (i ? [d[0], v] : [v, d[1]]) as [number, number] } }));
            return (
              <Bay key={p.k} label={`${p.label}: ${fits ? "tape fits ✓" : "measuring…"}`}>
                <Stepper label={`${p.label} length`} value={d[0]} min={1} max={12} disabled={play.readOnly} onStep={(s) => set(0, d[0] + s)} />
                <Stepper label={`${p.label} breadth`} value={d[1]} min={1} max={12} disabled={play.readOnly} onStep={(s) => set(1, d[1] + s)} />
                <div className="flex gap-1 mt-1">
                  <Btn className="px-2 min-h-[32px]" tone="emerald" active={w.sign[p.k] === 1} disabled={play.readOnly} onClick={() => play.patch({ sign: { ...w.sign, [p.k]: 1 }, done: false })} ariaLabel={`add ${p.label}`}>+ add</Btn>
                  <Btn className="px-2 min-h-[32px]" tone="rose" active={w.sign[p.k] === -1} disabled={play.readOnly} onClick={() => play.patch({ sign: { ...w.sign, [p.k]: -1 }, done: false })} ariaLabel={`take away ${p.label}`}>− take away</Btn>
                </div>
              </Bay>
            );
          })}
          <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ done: true })}>Run the ledger</Btn>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — Clock Workshop
   The student winds the crown to set the time; the hour hand creeps with the minutes as
   on a real clock. The gauge opens between the hands and reads the smaller angle.
   ══════════════════════════════════════════════════════════════════════ */

export function Q20ClockAngleActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ mins: number; read: boolean }>({
    question,
    initial: { mins: 4 * 60 + 20, read: false },
    derive: (w) => {
      if (!w.read) return { note: "Set the clock, then read the gauge." };
      const a = Math.abs(30 * ((w.mins / 60) % 12) - 6 * (w.mins % 60));
      const s = Math.min(a, 360 - a);
      return { value: `${s}°`, optionId: matchNumber(question, s) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const hA = 30 * ((w.mins / 60) % 12);
  const mA = 6 * (w.mins % 60);
  const a = Math.abs(hA - mA);
  const small = Math.min(a, 360 - a);
  const hand = (deg: number, len: number): Pt => [50 + len * Math.sin((deg * Math.PI) / 180), 50 - len * Math.cos((deg * Math.PI) / 180)];
  const wind = (d: number) => play.set((p) => ({ mins: (((p.mins + d) % 720) + 720) % 720, read: false }));
  const [hx, hy] = hand(hA, 22);
  const [mx, my] = hand(mA, 34);
  const time = `${Math.floor(w.mins / 60) % 12 || 12}:${String(w.mins % 60).padStart(2, "0")}`;

  return (
    <Shell
      play={play}
      question={question}
      title="Clock Workshop"
      mission="Wind the crown to the time in the question. The gauge always shows the smaller angle between the hands. Read it when the clock is set."
      icon={Clock}
      dim="2D"
      submitLabel="Submit the angle"
      live={<><Gauge label="Clock" value={time} tone="violet" /><Gauge label="Gauge" value={`${small}°`} tone="amber" /></>}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-center">
        <svg viewBox="0 0 100 100" className="w-56 h-56">
          <circle cx={50} cy={50} r={46} fill="#fff" stroke="#6366f1" strokeWidth={2} />
          {Array.from({ length: 12 }, (_, i) => { const [x, y] = hand(i * 30, 38); return <text key={i} x={x} y={y + 2} fontSize={7} textAnchor="middle" fontWeight={900} fill="#312e81">{i || 12}</text>; })}
          <line x1={50} y1={50} x2={hx} y2={hy} stroke="#1e1b4b" strokeWidth={3} strokeLinecap="round" />
          <line x1={50} y1={50} x2={mx} y2={my} stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" />
          <circle cx={50} cy={50} r={2} fill="#1e1b4b" />
        </svg>
        <Bay label="Crown" tone="violet">
          <div className="flex flex-wrap gap-1.5">
            <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(-60)}>−1 hour</Btn>
            <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(-5)}>−5 min</Btn>
            <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(5)}>+5 min</Btn>
            <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(60)}>+1 hour</Btn>
          </div>
          <Btn tone="amber" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ read: true })}>📐 Read the gauge</Btn>
        </Bay>
      </div>
    </Shell>
  );
}

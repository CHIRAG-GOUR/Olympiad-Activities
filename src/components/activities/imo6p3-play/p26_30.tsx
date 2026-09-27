"use client";

import React from "react";
import { Microscope, Thermometer, Hexagon, Triangle, Landmark } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, Pt, toggle } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — Odd Number Proof Laboratory
   The student picks odd numbers; the lab multiplies each one's predecessor and successor
   and runs the product past a row of divisors. After four different odd numbers, the
   greatest divisor that divided every product is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const DIVS = [4, 6, 8, 12, 16];
export function Q26OddNumberProductActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ n: number; log: number[] }>({
    question,
    initial: { n: 3, log: [] },
    derive: (w) => {
      if (w.log.length < 4) return { note: `Test at least four odd numbers (${w.log.length}/4).` };
      const prods = w.log.map((n) => (n - 1) * (n + 1));
      const always = DIVS.filter((d) => prods.every((p) => p % d === 0));
      if (!always.length) return { note: "No divisor divided every product." };
      const best = Math.max(...always);
      return { value: `${best} divided every product`, optionId: matchNumber(question, best) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const p = (w.n - 1) * (w.n + 1);

  return (
    <Shell
      play={play}
      question={question}
      title="Odd Number Proof Laboratory"
      mission="Choose an odd number greater than 1. The lab multiplies its predecessor by its successor and tests the product against each divisor. Log at least four different odd numbers; the greatest divisor that worked every time is the answer."
      icon={Microscope}
      dim="2D"
      submitLabel="Submit the divisor"
      live={<Gauge label="Logged" value={w.log.map((n) => `${n}→${(n - 1) * (n + 1)}`).join(", ") || "—"} tone="violet" />}
    >
      <Stepper label="Odd number" value={w.n} min={3} max={99} steps={[2]} disabled={play.readOnly} onStep={(d) => play.patch({ n: w.n + d })} />
      <Board className="mt-2">
        <p className="font-mono font-black text-indigo-900 text-center">{w.n - 1} × {w.n + 1} = {p}</p>
        <div className="flex justify-center gap-1.5 mt-1">{DIVS.map((d) => <span key={d} className={`px-2 py-1 rounded-lg text-xs font-black ${p % d === 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>÷{d} {p % d === 0 ? "✓" : "✗"}</span>)}</div>
      </Board>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly || w.log.includes(w.n)} onClick={() => play.patch({ log: [...w.log, w.n] })}>{w.log.includes(w.n) ? "Already logged" : `Log ${w.n}`}</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — Kashmir Temperature Station
   The student sets each town's thermometer to its reading. The station compares the two
   columns and states which town is cooler, and by how much.
   ══════════════════════════════════════════════════════════════════════ */

export function Q27NegativeTemperatureActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const t1 = cfg<number>(question, "t1", 0);
  const t2 = cfg<number>(question, "t2", 0);
  const names = ["Gulmarg", "Srinagar"];
  const play = usePlay<{ a: number; b: number; compared: boolean }>({
    question,
    initial: { a: 0, b: 0, compared: false },
    derive: (w) => {
      if (!w.compared) return { note: "Set both thermometers and compare them." };
      if (w.a === w.b) return { value: "Same temperature", optionId: matchText(question, "Both locations had the same temperature.") };
      const [cool, warm] = w.a < w.b ? [0, 1] : [1, 0];
      const text = `${names[cool]} was ${Math.abs(w.a - w.b)}°C cooler than ${names[warm]}.`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const Y = (t: number) => 60 - t * 5;

  return (
    <Shell
      play={play}
      question={question}
      title="Kashmir Temperature Station"
      mission={`Set Gulmarg's thermometer to ${t1} °C and Srinagar's to ${t2} °C. Then compare: the station states which town is cooler and by how many degrees.`}
      icon={Thermometer}
      dim="2D"
      submitLabel="Submit the statement"
      live={<><Gauge label="Gulmarg" value={`${w.a} °C`} tone="sky" /><Gauge label="Srinagar" value={`${w.b} °C`} tone="sky" /></>}
    >
      <div className="flex gap-6 items-end">
        <svg viewBox="0 0 60 100" className="h-48">
          {[5, 0, -5].map((t) => <g key={t}><line x1={4} x2={56} y1={Y(t)} y2={Y(t)} stroke="#cbd5e1" strokeWidth={0.4} /><text x={0} y={Y(t) + 1.5} fontSize={4}>{t}°</text></g>)}
          {[w.a, w.b].map((t, i) => <g key={i}><rect x={16 + i * 22} y={10} width={8} height={80} rx={4} fill="#fff" stroke="#6366f1" /><rect x={17 + i * 22} y={Y(t)} width={6} height={90 - Y(t)} fill="#38bdf8" /></g>)}
        </svg>
        <div className="space-y-2">
          <Stepper label="Gulmarg" value={w.a} min={-10} max={10} unit=" °C" disabled={play.readOnly} onStep={(d) => play.patch({ a: w.a + d, compared: false })} />
          <Stepper label="Srinagar" value={w.b} min={-10} max={10} unit=" °C" disabled={play.readOnly} onStep={(d) => play.patch({ b: w.b + d, compared: false })} />
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ compared: true })}>Compare the towns</Btn>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — Polygon Connection Lab
   The student taps two corners of the heptagon to draw a diagonal between them. Sides are
   refused. The number of different diagonals drawn is the answer.
   ══════════════════════════════════════════════════════════════════════ */

export function Q28HeptagonDiagonalsActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const n = cfg<number>(question, "sides", 7);
  const [pick, setPick] = React.useState<number | null>(null);
  const play = usePlay<{ diag: string[] }>({
    question,
    initial: { diag: [] },
    derive: (w) => (!w.diag.length ? { note: "Draw the diagonals by tapping pairs of corners." } : { value: `${w.diag.length} diagonals`, optionId: matchNumber(question, w.diag.length) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const P: Pt[] = Array.from({ length: n }, (_, i) => [50 + 40 * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n), 50 + 40 * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / n)]);
  const tap = (i: number) => {
    if (play.readOnly) return;
    if (pick === null) return setPick(i);
    const a = Math.min(pick, i), b = Math.max(pick, i);
    setPick(null);
    if (a === b || b - a === 1 || (a === 0 && b === n - 1)) return;
    play.set((s) => ({ diag: toggle(s.diag, `${a}-${b}`) }));
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Polygon Connection Lab"
      mission="Tap one corner and then another to draw the diagonal joining them (tap an existing diagonal's corners again to rub it out). Sides don't count. Draw every diagonal of the heptagon."
      icon={Hexagon}
      dim="2D"
      submitLabel="Submit the diagonal count"
      live={<Gauge label="Diagonals" value={w.diag.length} tone="violet" />}
    >
      <Board>
        <svg viewBox="0 0 100 100" className="w-full max-h-72">
          <polygon points={P.map((p) => p.join(",")).join(" ")} fill="#eef2ff" stroke="#312e81" strokeWidth={1} />
          {w.diag.map((k) => { const [a, b] = k.split("-").map(Number); return <line key={k} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} stroke="#f59e0b" strokeWidth={0.9} />; })}
          {P.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={pick === i ? "#e11d48" : "#4338ca"} role="button" aria-label={`corner ${i + 1}`} style={{ cursor: "pointer" }} onClick={() => tap(i)} />)}
        </svg>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q29 — Triangle Growth Workshop
   The big triangle is split by the midpoint triangle into small edges of 6 cm. The student
   taps the edges that make up the figure's outer boundary; the measuring wheel adds them.
   ══════════════════════════════════════════════════════════════════════ */

export function Q29EquilateralTriangleActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const A: Pt = [50, 8], B: Pt = [10, 78], C: Pt = [90, 78];
  const m = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const AB = m(A, B), BC = m(B, C), CA = m(C, A);
  const segs: [Pt, Pt][] = [[A, AB], [AB, B], [B, BC], [BC, C], [C, CA], [CA, A], [AB, BC], [BC, CA], [CA, AB]];
  const half = 6;
  const play = usePlay<{ on: number[]; rolled: boolean }>({
    question,
    initial: { on: [], rolled: false },
    derive: (w) => (!w.rolled || !w.on.length ? { note: "Tap the boundary edges, then roll the measuring wheel." } : { value: `${w.on.length} edges × ${half} cm = ${w.on.length * half} cm`, optionId: matchNumber(question, w.on.length * half) }),
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
      title="Triangle Growth Workshop"
      mission="Every small edge is half of a 12 cm side, so 6 cm. Tap each edge that lies on the outer boundary of the figure (tap again to remove it), then roll the measuring wheel along them."
      icon={Triangle}
      dim="2D"
      submitLabel="Submit the perimeter"
      live={<Gauge label="Wheel" value={`${w.on.length * half} cm`} tone="violet" />}
    >
      <Board>
        <svg viewBox="0 0 100 86" className="w-full max-h-72">
          {segs.map(([p, q], i) => <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={w.on.includes(i) ? "#f59e0b" : "#4338ca"} strokeWidth={w.on.includes(i) ? 3 : 1.4} role="button" aria-label={`edge ${i + 1}`} style={{ cursor: "pointer" }} onClick={() => !play.readOnly && play.set((s) => ({ rolled: false, on: toggle(s.on, i) }))} />)}
        </svg>
      </Board>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !w.on.length} onClick={() => play.patch({ rolled: true })}>🛞 Roll the measuring wheel</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — Roman Numeral Forge
   Each numeral in the sum is decoded tile by tile: the student sets every tile to add or
   take away. The forge then adds and subtracts the decoded values, and the student casts
   the result back into Roman numerals from the tile rack.
   ══════════════════════════════════════════════════════════════════════ */

const RV: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
const Q30_TERMS = [
  { r: "LVIII", s: 1 },
  { r: "XXIV", s: 1 },
  { r: "LXXXIX", s: 1 },
  { r: "XXXII", s: 1 },
  { r: "XCIV", s: -1 },
];
const RACK = ["C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
const RACKV: Record<string, number> = { C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
export function Q30RomanNumeralForgeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ minus: Record<number, number[]>; cast: string[]; done: boolean }>({
    question,
    initial: { minus: {}, cast: [], done: false },
    derive: (w) => {
      if (!w.done || !w.cast.length) return { note: "Decode, forge the total, then cast it in Roman numerals." };
      const text = w.cast.join("");
      return { value: `${text} = ${w.cast.reduce((s, t) => s + RACKV[t], 0)}`, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const dec = (i: number) => Q30_TERMS[i].r.split("").reduce((s, ch, j) => s + ((w.minus[i] ?? []).includes(j) ? -1 : 1) * RV[ch], 0);
  const total = Q30_TERMS.reduce((s, t, i) => s + t.s * dec(i), 0);
  const castV = w.cast.reduce((s, t) => s + RACKV[t], 0);

  return (
    <Shell
      play={play}
      question={question}
      title="Roman Numeral Forge"
      mission="Tap a tile to switch it between adding and taking away — a smaller symbol before a larger one is taken away. The forge totals the sum. Then cast the total in Roman numerals from the rack, largest pieces first."
      icon={Landmark}
      dim="2D"
      submitLabel="Submit the numeral"
      live={<><Gauge label="Forge total" value={total} tone="violet" /><Gauge label="Cast" value={`${w.cast.join("") || "—"} = ${castV}`} tone={castV === total ? "emerald" : "amber"} /></>}
    >
      <div className="space-y-1.5">
        {Q30_TERMS.map((t, i) => (
          <div key={i} className="flex flex-wrap items-center gap-1 rounded-xl bg-white border border-indigo-200 p-1.5">
            <span className="w-5 font-black text-indigo-700">{t.s < 0 ? "−" : "+"}</span>
            {t.r.split("").map((ch, j) => {
              const neg = (w.minus[i] ?? []).includes(j);
              return <button key={j} type="button" disabled={play.readOnly} aria-label={`term ${i + 1} tile ${j + 1}`} onClick={() => play.set((p) => ({ ...p, done: false, minus: { ...p.minus, [i]: toggle(p.minus[i] ?? [], j) } }))} className={`w-8 h-10 rounded font-serif font-black border-2 ${neg ? "bg-rose-100 border-rose-400" : "bg-amber-50 border-amber-300"}`}>{ch}<span className="block text-[8px] font-sans">{neg ? "−" : "+"}{RV[ch]}</span></button>;
            })}
            <span className="ml-auto font-mono font-black text-indigo-900">{dec(i)}</span>
          </div>
        ))}
      </div>
      <Bay label="Casting rack" tone="violet" className="mt-2">
        <div className="flex flex-wrap gap-1">
          {RACK.map((r) => <Btn key={r} className="px-2 min-h-[34px] font-serif" tone="slate" disabled={play.readOnly} onClick={() => play.patch({ cast: [...w.cast, r], done: false })} ariaLabel={`cast ${r}`}>{r}</Btn>)}
          <Btn className="px-2 min-h-[34px]" tone="slate" disabled={play.readOnly || !w.cast.length} onClick={() => play.patch({ cast: w.cast.slice(0, -1), done: false })}>⌫</Btn>
          <Btn className="px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly || !w.cast.length} onClick={() => play.patch({ done: true })}>🔥 Cast it</Btn>
        </div>
      </Bay>
    </Shell>
  );
}

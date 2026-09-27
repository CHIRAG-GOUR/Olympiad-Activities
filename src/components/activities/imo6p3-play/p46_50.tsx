"use client";

import React from "react";
import { MonitorCheck, ChartLine, ClipboardCheck, ShieldCheck, Cpu } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText, gcd } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, toggle } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — Geometry Control Room (Achievers)
   Four stations. (P) turn one line until it never meets the other, and name the pair.
   (Q) add segments until a closed figure forms. (R) slide a chord until it passes through
   the centre, and name it. (S) take 3/5 of a right angle on the slicer.
   ══════════════════════════════════════════════════════════════════════ */

export function Q46GeometryClassificationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ tilt: number; segs: number; chord: number; slices: number; taken: number; done: string[] }>({
    question,
    initial: { tilt: 30, segs: 1, chord: 20, slices: 1, taken: 0, done: [] },
    derive: (w) => {
      if (w.done.length < 4) return { note: "Complete all four stations." };
      const P = w.tilt === 0 ? "Parallel" : "Intersecting";
      const R = w.chord === 0 ? "Diameter" : "Chord";
      const S = +(90 * (w.taken / w.slices)).toFixed(2);
      const t = `(P) ${P}, (Q) ${w.segs}, (R) ${R}, (S) ${S}°`;
      return { value: t, optionId: matchText(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const mark = (k: string) => play.patch({ done: w.done.includes(k) ? w.done : [...w.done, k] });
  const set = (p: Partial<typeof w>, k: string) => play.set((s) => ({ ...s, ...p, done: s.done.filter((x) => x !== k) }));
  const closed = w.segs >= 3;

  return (
    <Shell
      play={play}
      question={question}
      title="Geometry Control Room"
      mission="Work each station and lock it. (P) Tilt the second line until the two lines never meet. (Q) Add segments one at a time until they close a figure. (R) Slide the chord until it passes through the centre. (S) Cut a right angle into equal slices and take 3 of 5."
      icon={MonitorCheck}
      dim="2D"
      submitLabel="Submit all four blanks"
      live={<Gauge label="Stations locked" value={`${w.done.length}/4`} tone="violet" />}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Bay label="P · two lines">
          <svg viewBox="0 0 100 40" className="w-full h-20 bg-white rounded"><line x1={5} y1={12} x2={95} y2={12} stroke="#4338ca" strokeWidth={1.4} /><line x1={5} y1={30 + w.tilt * 0.3} x2={95} y2={30 - w.tilt * 0.3} stroke="#f59e0b" strokeWidth={1.4} /></svg>
          <div className="flex items-center gap-1"><Stepper label="tilt" value={w.tilt} min={-30} max={30} steps={[10]} disabled={play.readOnly} onStep={(d) => set({ tilt: w.tilt + d }, "P")} /><Btn className="px-2 min-h-[32px]" tone="emerald" disabled={play.readOnly} onClick={() => mark("P")}>Lock</Btn></div>
          <p className="text-[11px] font-bold text-slate-600">{w.tilt === 0 ? "They never meet: parallel lines." : "They meet somewhere: intersecting lines."}</p>
        </Bay>
        <Bay label="Q · close a figure">
          <svg viewBox="0 0 100 40" className="w-full h-20 bg-white rounded">
            {w.segs >= 1 && <line x1={20} y1={34} x2={80} y2={34} stroke="#4338ca" strokeWidth={1.4} />}
            {w.segs >= 2 && <line x1={80} y1={34} x2={50} y2={6} stroke="#4338ca" strokeWidth={1.4} />}
            {w.segs >= 3 && <line x1={50} y1={6} x2={20} y2={34} stroke="#4338ca" strokeWidth={1.4} />}
            {w.segs >= 4 && <line x1={20} y1={34} x2={50} y2={20} stroke="#e11d48" strokeWidth={1.4} />}
          </svg>
          <div className="flex items-center gap-1"><Stepper label="segments" value={w.segs} min={1} max={4} disabled={play.readOnly} onStep={(d) => set({ segs: w.segs + d }, "Q")} /><Btn className="px-2 min-h-[32px]" tone="emerald" disabled={play.readOnly || !closed} onClick={() => mark("Q")}>Lock</Btn></div>
          <p className="text-[11px] font-bold text-slate-600">{closed ? "Closed figure formed." : "Still open."}</p>
        </Bay>
        <Bay label="R · chord through the centre">
          <svg viewBox="0 0 100 44" className="w-full h-20 bg-white rounded"><circle cx={50} cy={22} r={18} fill="#eef2ff" stroke="#4338ca" /><circle cx={50} cy={22} r={1.2} fill="#1e1b4b" /><line x1={50 - Math.sqrt(Math.max(0, 324 - w.chord * w.chord))} y1={22 + w.chord} x2={50 + Math.sqrt(Math.max(0, 324 - w.chord * w.chord))} y2={22 + w.chord} stroke="#f59e0b" strokeWidth={1.4} /></svg>
          <div className="flex items-center gap-1"><Stepper label="chord offset" value={w.chord} min={0} max={16} steps={[4]} disabled={play.readOnly} onStep={(d) => set({ chord: w.chord + d }, "R")} /><Btn className="px-2 min-h-[32px]" tone="emerald" disabled={play.readOnly} onClick={() => mark("R")}>Lock</Btn></div>
          <p className="text-[11px] font-bold text-slate-600">{w.chord === 0 ? "Through the centre: this chord is a diameter." : "Misses the centre: an ordinary chord."}</p>
        </Bay>
        <Bay label="S · fraction of a right angle">
          <p className="text-xs font-mono">{w.taken} of {w.slices} slices of 90° = {+(90 * (w.taken / w.slices)).toFixed(2)}°</p>
          <Stepper label="slices" value={w.slices} min={1} max={10} disabled={play.readOnly} onStep={(d) => set({ slices: w.slices + d, taken: 0 }, "S")} />
          <Stepper label="taken" value={w.taken} min={0} max={w.slices} disabled={play.readOnly} onStep={(d) => set({ taken: w.taken + d }, "S")} />
          <Btn className="px-2 min-h-[32px]" tone="emerald" disabled={play.readOnly || !w.taken} onClick={() => mark("S")}>Lock</Btn>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — Toy Store Analytics (Achievers)
   The line graph's points are live. The student puts months into two baskets; the
   analytics board totals each basket, forms the ratio and cuts common factors out of it.
   ══════════════════════════════════════════════════════════════════════ */

const SALES: [string, number][] = [["April", 350], ["May", 500], ["June", 450], ["July", 550], ["August", 650]];
export function Q47LineGraphRatioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ a: string[]; b: string[]; reduced: boolean }>({
    question,
    initial: { a: [], b: [], reduced: false },
    derive: (w) => {
      if (!w.a.length || !w.b.length || !w.reduced) return { note: "Fill both baskets and reduce the ratio." };
      const s = (m: string[]) => m.reduce((t, x) => t + (SALES.find((p) => p[0] === x)?.[1] ?? 0), 0);
      const g = gcd(s(w.a), s(w.b));
      const t = `${s(w.a) / g} : ${s(w.b) / g}`;
      return { value: t, optionId: matchText(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const s = (m: string[]) => m.reduce((t, x) => t + (SALES.find((p) => p[0] === x)?.[1] ?? 0), 0);
  const X = (i: number) => 12 + i * 20;
  const Y = (v: number) => 60 - v / 12;

  return (
    <Shell
      play={play}
      question={question}
      title="Toy Store Analytics"
      mission="Read the line graph. Put the first pair of months in basket 1 and the second pair in basket 2 (in the order the question says), then reduce the ratio."
      icon={ChartLine}
      dim="2D"
      submitLabel="Submit the ratio"
      live={<Gauge label="Ratio" value={`${s(w.a)} : ${s(w.b)}`} tone="violet" />}
    >
      <Board>
        <svg viewBox="0 0 110 70" className="w-full max-h-56">
          <polyline points={SALES.map(([, v], i) => `${X(i)},${Y(v)}`).join(" ")} fill="none" stroke="#6366f1" strokeWidth={1.2} />
          {SALES.map(([m, v], i) => <g key={m}><circle cx={X(i)} cy={Y(v)} r={1.8} fill={w.a.includes(m) ? "#6366f1" : w.b.includes(m) ? "#f59e0b" : "#94a3b8"} /><text x={X(i)} y={Y(v) - 3} fontSize={3.5} textAnchor="middle">{v}</text><text x={X(i)} y={67} fontSize={3.5} textAnchor="middle">{m.slice(0, 3)}</text></g>)}
        </svg>
      </Board>
      <div className="grid sm:grid-cols-2 gap-2 mt-2">
        {(["a", "b"] as const).map((k, i) => (
          <Bay key={k} label={`Basket ${i + 1}: ${s(w[k])}`}>
            <div className="flex flex-wrap gap-1">{SALES.map(([m]) => <Btn key={m} className="px-2 min-h-[32px] text-[11px]" active={w[k].includes(m)} tone={w[k].includes(m) ? (i ? "amber" : "violet") : "slate"} disabled={play.readOnly || w[i ? "a" : "b"].includes(m)} onClick={() => play.set((p) => ({ ...p, reduced: false, [k]: toggle(p[k], m) }))} ariaLabel={`basket ${i + 1} ${m}`}>{m.slice(0, 3)}</Btn>)}</div>
          </Bay>
        ))}
      </div>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !w.a.length || !w.b.length} onClick={() => play.patch({ reduced: true })}>✂ Reduce the ratio</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — Mathematics Truth Laboratory (Achievers)
   Each statement has a bench that runs an experiment. The student runs the bench, reads
   the evidence, and sets the statement's verdict. The four verdicts are the answer.
   ══════════════════════════════════════════════════════════════════════ */

const BENCHES = [
  { k: "P", ev: "4/9: common factors of 4 and 9 → only 1. It cannot be reduced, so it is in simplest form." },
  { k: "Q", ev: "5/9 = 0.555…, 4/5 = 0.8 — so 5/9 is smaller than 4/5." },
  { k: "R", ev: "1/2 sits halfway between 0 and 1 on the number line; 3/4 sits three quarters of the way." },
  { k: "S", ev: "Place values: ones × 1, tenths × 1/10, hundredths × 1/100 — each factor is 1/10 of the one before." },
];
export function Q48TrueFalseFractionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ ran: string[]; v: Record<string, "T" | "F"> }>({
    question,
    initial: { ran: [], v: {} },
    derive: (w) => {
      if (BENCHES.some((b) => !w.v[b.k])) return { note: "Run each bench and give every statement a verdict." };
      const t = BENCHES.map((b) => `(${b.k}) ${w.v[b.k]}`).join(", ");
      return { value: t, optionId: matchText(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const stmt = (k: string) => (question?.questionText.split("\n").find((l) => l.startsWith(`(${k})`)) ?? `(${k})`).slice(4);

  return (
    <Shell
      play={play}
      question={question}
      title="Mathematics Truth Laboratory"
      mission="Run each statement's bench to see the evidence, then mark the statement True or False."
      icon={ClipboardCheck}
      dim="2D"
      submitLabel="Submit the verdicts"
      live={<Gauge label="Verdicts" value={BENCHES.map((b) => `${b.k}:${w.v[b.k] ?? "?"}`).join(" ")} tone="violet" />}
    >
      <div className="grid md:grid-cols-2 gap-2">
        {BENCHES.map((b) => (
          <Bay key={b.k} label={`(${b.k}) ${stmt(b.k)}`}>
            <Btn className="px-2 min-h-[32px]" tone="sky" disabled={play.readOnly || w.ran.includes(b.k)} onClick={() => play.patch({ ran: [...w.ran, b.k] })} ariaLabel={`run ${b.k}`}>🧪 Run the bench</Btn>
            {w.ran.includes(b.k) && <p className="text-[11px] font-semibold text-slate-700 mt-1">{b.ev}</p>}
            <div className="flex gap-1 mt-1">
              {(["T", "F"] as const).map((x) => <Btn key={x} className="px-2 min-h-[32px]" active={w.v[b.k] === x} tone={w.v[b.k] === x ? (x === "T" ? "emerald" : "rose") : "slate"} disabled={play.readOnly || !w.ran.includes(b.k)} onClick={() => play.patch({ v: { ...w.v, [b.k]: x } })} ariaLabel={`${b.k} ${x}`}>{x === "T" ? "True" : "False"}</Btn>)}
            </div>
          </Bay>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — Divisibility Security Lab (Achievers)
   Stage 1 tests Statement I: the student enters numbers and the lab compares division of
   the whole number by 8 with division of its last three digits. Stage 2 runs 987648
   through the ÷8 tester. The lab combines the two verdicts.
   ══════════════════════════════════════════════════════════════════════ */

export function Q49DivisibilitySecurityActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ n: number; log: number[]; ran2: boolean }>({
    question,
    initial: { n: 12344, log: [], ran2: false },
    derive: (w) => {
      if (w.log.length < 3 || !w.ran2) return { note: "Test Statement I on three numbers and run Statement II." };
      const rule = w.log.every((n) => (n % 8 === 0) === ((n % 1000) % 8 === 0));
      const two = 987648 % 8 === 0;
      const id = rule && two ? question?.multipleChoiceConfig?.options.find((o) => /both.*true/i.test(o.text))?.id : rule ? question?.multipleChoiceConfig?.options.find((o) => /I is true and Statement II is false/i.test(o.text))?.id : two ? question?.multipleChoiceConfig?.options.find((o) => /I is false and Statement II is true/i.test(o.text))?.id : question?.multipleChoiceConfig?.options.find((o) => /both.*false/i.test(o.text))?.id;
      return { value: `Statement I ${rule ? "held" : "failed"}; 987648 ${two ? "is" : "is not"} divisible by 8`, optionId: id };
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
      title="Divisibility Security Lab"
      mission="Stage 1: enter numbers and test Statement I — the lab checks the whole number and its last three digits against 8. Test at least three. Stage 2: run 987648 through the ÷8 tester."
      icon={ShieldCheck}
      dim="2D"
      submitLabel="Submit the verdict"
      live={<Gauge label="Rule held" value={w.log.length ? (w.log.every((n) => (n % 8 === 0) === ((n % 1000) % 8 === 0)) ? `${w.log.length}/${w.log.length}` : "broken") : "—"} tone="violet" />}
    >
      <Bay label="Stage 1 · Statement I">
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" aria-label="Number to test" value={w.n} disabled={play.readOnly} onChange={(e) => play.patch({ n: Math.max(1000, Math.round(Number(e.target.value)) || 1000) })} className="w-32 h-10 rounded-lg border border-indigo-200 px-2 font-mono font-black" />
          <span className="text-xs font-mono">{w.n} ÷ 8 {w.n % 8 === 0 ? "✓" : "✗"} · last three {String(w.n % 1000).padStart(3, "0")} ÷ 8 {(w.n % 1000) % 8 === 0 ? "✓" : "✗"}</span>
          <Btn tone="emerald" disabled={play.readOnly || w.log.includes(w.n)} onClick={() => play.patch({ log: [...w.log, w.n] })}>Test {w.n}</Btn>
        </div>
      </Bay>
      <Bay label="Stage 2 · Statement II" tone="violet" className="mt-2">
        <Btn tone="sky" disabled={play.readOnly || w.ran2} onClick={() => play.patch({ ran2: true })}>Run 987648 through ÷8</Btn>
        {w.ran2 && <p className="font-mono font-black mt-1 text-indigo-900">last three digits 648 ÷ 8 = 81 · 987648 ÷ 8 = {987648 / 8}</p>}
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — Olympiad Master Control Room (Achievers)
   Four stations: an integer line to find the smallest integer above every negative, a
   step calculator for the expression, a divisibility-by-22 dial for the missing digit,
   and a wire workshop that bends the wire into 2 cm squares.
   ══════════════════════════════════════════════════════════════════════ */

export function Q50MasterControlRoomActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const terms = [49, 40, 3, 69, -80];
  const play = usePlay<{ p: number | null; steps: number; digit: number; rLock: boolean; squares: number; sLock: boolean }>({
    question,
    initial: { p: null, steps: 1, digit: 0, rLock: false, squares: 1, sLock: false },
    derive: (w) => {
      if (w.p === null || w.steps < terms.length || !w.rLock || !w.sLock) return { note: "Complete all four stations." };
      const q = terms.reduce((a, b) => a + b, 0);
      const t = `(P)→${w.p}, (Q)→${q}, (R)→${w.digit}, (S)→${w.squares * 8} cm`;
      return { value: t, optionId: matchText(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const num = Number(`7254${w.digit}98`);
  const area = w.squares * 4;

  return (
    <Shell
      play={play}
      question={question}
      title="Olympiad Master Control Room"
      mission="(P) Tap the smallest integer that is greater than every negative integer. (Q) Step the calculator through 49 − (−40) − (−3) + 69 − 80. (R) Dial the digit that makes 7254*98 divisible by 22 and lock it. (S) Bend wire into 2 cm squares until they cover 28 cm², then lock it."
      icon={Cpu}
      dim="2D"
      submitLabel="Submit the matching"
      live={<Gauge label="Stations" value={`P ${w.p ?? "?"} · Q ${w.steps >= terms.length ? terms.reduce((a, b) => a + b, 0) : "…"} · R ${w.rLock ? w.digit : "?"} · S ${w.sLock ? `${w.squares * 8} cm` : "?"}`} tone="violet" />}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Bay label="P · integer line">
          <div className="flex flex-wrap gap-1">{[-3, -2, -1, 0, 1, 2].map((n) => <Btn key={n} className="px-2 min-h-[32px]" active={w.p === n} tone={w.p === n ? "violet" : n < 0 ? "rose" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ p: n })} ariaLabel={`integer ${n}`}>{n}</Btn>)}</div>
        </Bay>
        <Bay label="Q · step calculator">
          <p className="font-mono text-xs">{terms.slice(0, w.steps).map((t, i) => (i ? (t < 0 ? ` − ${-t}` : ` + ${t}`) : t)).join("")} = <b>{terms.slice(0, w.steps).reduce((a, b) => a + b, 0)}</b></p>
          <Btn className="px-2 min-h-[32px] mt-1" tone="slate" disabled={play.readOnly || w.steps >= terms.length} onClick={() => play.patch({ steps: w.steps + 1 })}>Next step</Btn>
        </Bay>
        <Bay label="R · divisible by 22?">
          <p className="font-mono text-sm">{num} · ÷2 {num % 2 === 0 ? "✓" : "✗"} · ÷11 {num % 11 === 0 ? "✓" : "✗"}</p>
          <div className="flex items-center gap-1"><Stepper label="digit" value={w.digit} min={0} max={9} disabled={play.readOnly} onStep={(d) => play.patch({ digit: w.digit + d, rLock: false })} /><Btn className="px-2 min-h-[32px]" tone="emerald" disabled={play.readOnly || num % 22 !== 0} onClick={() => play.patch({ rLock: true })}>Lock</Btn></div>
        </Bay>
        <Bay label="S · wire workshop">
          <div className="flex flex-wrap gap-0.5">{Array.from({ length: w.squares }, (_, i) => <span key={i} className="w-6 h-6 border-2 border-amber-600 rounded-sm" />)}</div>
          <p className="text-xs font-mono">{w.squares} squares × 4 cm² = {area} cm² · wire used {w.squares * 8} cm</p>
          <div className="flex items-center gap-1"><Stepper label="squares" value={w.squares} min={1} max={12} disabled={play.readOnly} onStep={(d) => play.patch({ squares: w.squares + d, sLock: false })} /><Btn className="px-2 min-h-[32px]" tone="emerald" disabled={play.readOnly || area !== 28} onClick={() => play.patch({ sLock: true })}>Lock</Btn></div>
        </Bay>
      </div>
    </Shell>
  );
}

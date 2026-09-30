"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Telescope, Route, Microscope, ChartPie, MonitorCheck } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, polyPath, toggle, optText, r4, Pt } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q46–Q50 (Achievers). */

/* ══════════════════════════════════════════════════════════════════════
   Q46 — Decimal Observatory
   Station 1: the lens slides over 43.295 and names each place. Station 2: both sides of the
   balance are worked one step at a time. Station 3: the rounding laser snaps 15.5575 to the
   aimed place. The three readings fill the blanks.
   ══════════════════════════════════════════════════════════════════════ */

const PLACES = ["tens", "ones", "·", "tenths", "hundredths", "thousandths"];

export function Q46DecimalObservatoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const number = cfg<string>(question, "number", "0");
  const left = cfg<number[]>(question, "left", []);
  const right = cfg<number[]>(question, "right", []);
  const rnum = cfg<number>(question, "round", 0);
  const rounded = (aim: number) => (Math.round(Number((rnum * 10 ** aim).toFixed(6))) / 10 ** aim).toFixed(aim);
  const play = usePlay<{ lens: number; digit: string | null; ls: number; rs: number; aim: number; fired: boolean }>({
    question,
    initial: { lens: 0, digit: null, ls: 1, rs: 1, aim: 1, fired: false },
    derive: (w) => {
      if (!w.digit) return { note: "Station 1: record the hundredths digit." };
      if (w.ls < left.length || w.rs < right.length) return { note: "Station 2: work both sides of the balance." };
      if (!w.fired) return { note: "Station 3: aim the laser and fire." };
      const L = r4(left.reduce((a, b) => a + b, 0));
      const R = r4(right.reduce((a, b) => a + b, 0));
      const cmp = L < R ? "<" : L > R ? ">" : "=";
      const text = `${w.digit}, ${cmp}, ${rounded(w.aim)}`;
      return { value: text, optionId: question?.multipleChoiceConfig?.options.find((o) => o.text.replace(/\s/g, "") === text.replace(/\s/g, ""))?.id };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const run = (xs: number[], k: number) => r4(xs.slice(0, k).reduce((a, b) => a + b, 0));

  return (
    <Shell
      play={play}
      question={question}
      title="Decimal Observatory"
      mission="Station 1: slide the lens along 43.295 and record the digit in the hundredths place. Station 2: work each side of the balance one step at a time and see which way it tips. Station 3: aim the rounding laser at the place asked for and fire."
      icon={Telescope}
      dim="2D"
      submitLabel="Submit all three blanks"
      hints={["Hundredths is the second digit after the decimal point.", "Rounding to thousandths keeps three digits after the point; look at the fourth to round."]}
      live={
        <>
          <Gauge label="(i) digit" value={w.digit ?? "—"} tone="violet" />
          <Gauge label="(ii) balance" value={w.ls >= left.length && w.rs >= right.length ? `${run(left, left.length)} vs ${run(right, right.length)}` : "working"} tone="violet" />
          <Gauge label="(iii) laser" value={w.fired ? rounded(w.aim) : "—"} tone="violet" />
        </>
      }
    >
      <div className="grid md:grid-cols-3 gap-2">
        <Bay label="1 · Place-value lens">
          <div className="flex justify-center gap-0.5 font-mono text-2xl font-black">
            {number.split("").map((c, i) => <span key={i} className={`w-7 text-center rounded ${w.lens === i ? "bg-amber-300" : ""}`}>{c}</span>)}
          </div>
          <div className="text-center text-xs font-bold mt-1">lens on: {PLACES[w.lens]}</div>
          <div className="flex gap-1 justify-center mt-1">
            <Btn className="px-2 min-h-[32px]" tone="slate" disabled={play.readOnly || w.lens <= 0} onClick={() => play.patch({ lens: w.lens - 1 })} ariaLabel="lens left">◀</Btn>
            <Btn className="px-2 min-h-[32px]" tone="slate" disabled={play.readOnly || w.lens >= number.length - 1} onClick={() => play.patch({ lens: w.lens + 1 })} ariaLabel="lens right">▶</Btn>
            <Btn className="px-2 min-h-[32px]" disabled={play.readOnly || number[w.lens] === "."} onClick={() => play.patch({ digit: number[w.lens] })}>Record</Btn>
          </div>
        </Bay>
        <Bay label="2 · Balance">
          {[{ xs: left, k: w.ls, key: "ls" as const }, { xs: right, k: w.rs, key: "rs" as const }].map((s, i) => (
            <div key={i} className="flex items-center gap-1 mb-1">
              <span className="font-mono text-[11px] flex-1">
                {s.xs.slice(0, s.k).map((x, j) => (j ? (x < 0 ? ` − ${-x}` : ` + ${x}`) : x)).join("")} = <b>{run(s.xs, s.k)}</b>
              </span>
              <Btn className="px-2 min-h-[30px]" tone="slate" disabled={play.readOnly || s.k >= s.xs.length} onClick={() => play.patch({ [s.key]: s.k + 1 } as Partial<typeof w>)} ariaLabel={`${i ? "right" : "left"} step`}>step</Btn>
            </div>
          ))}
          {w.ls >= left.length && w.rs >= right.length && <div className="text-center text-sm font-black">{run(left, left.length) < run(right, right.length) ? "left side rises ⬆ (lighter)" : run(left, left.length) > run(right, right.length) ? "left side sinks ⬇ (heavier)" : "level"}</div>}
        </Bay>
        <Bay label="3 · Rounding laser">
          <div className="font-mono text-lg font-black text-center">{rnum}</div>
          <div className="flex flex-wrap gap-1 justify-center">
            {[1, 2, 3].map((k) => (
              <Btn key={k} className="px-2 min-h-[30px] text-[11px]" active={w.aim === k} tone={w.aim === k ? "sky" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ aim: k, fired: false })} ariaLabel={`aim ${PLACES[k + 2]}`}>
                {PLACES[k + 2]}
              </Btn>
            ))}
          </div>
          <Btn tone="rose" className="mt-1 w-full" disabled={play.readOnly} onClick={() => play.patch({ fired: true })}>🔦 Fire → {w.fired ? rounded(w.aim) : "?"}</Btn>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — Perimeter Surveyor
   Each figure is a grid of equal squares (5 cm, 4 cm, 3 cm). The survey cart drives along
   the outside edge; each drive goes straight to the next corner and the odometer adds the
   length. Once all three are surveyed, the student tests the claims on the comparison
   balance and picks the true one.
   ══════════════════════════════════════════════════════════════════════ */

type Fig47 = { unit: number; rows: number[][] };
const cellsOf = (f: Fig47): Pt[] => f.rows.flatMap((r, y) => r.map((x) => [x, y] as Pt));
const boundary = (cells: Pt[]) => {
  const has = (x: number, y: number) => cells.some((c) => c[0] === x && c[1] === y);
  const out = new Set<string>();
  const add = (a: Pt, b: Pt) => out.add([a, b].map((p) => p.join(",")).sort().join("|"));
  cells.forEach(([x, y]) => {
    if (!has(x, y - 1)) add([x, y], [x + 1, y]);
    if (!has(x, y + 1)) add([x, y + 1], [x + 1, y + 1]);
    if (!has(x - 1, y)) add([x, y], [x, y + 1]);
    if (!has(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
  });
  return out;
};
const ek = (a: Pt, b: Pt) => [a, b].map((p) => p.join(",")).sort().join("|");
const DIRS: Record<string, Pt> = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };

export function Q47PerimeterSurveyorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figures = cfg<Record<string, Fig47>>(question, "figures", {});
  const claims = cfg<Record<string, { left: string[]; op: string; right: string[] }>>(question, "claims", {});
  const ids = Object.keys(figures);
  const edges = useMemo(() => Object.fromEntries(ids.map((id) => [id, boundary(cellsOf(figures[id]))])), [figures]); // eslint-disable-line react-hooks/exhaustive-deps
  const homeOf = (id: string): Pt => {
    const c = cellsOf(figures[id]).sort((a, b) => a[1] - b[1] || a[0] - b[0])[0] ?? [0, 0];
    return [c[0], c[1]];
  };
  type SW = { fig: string; at: Record<string, Pt>; walked: Record<string, string[]>; test: string | null; pick: string | null };
  const done = (w: SW, id: string) => (w.walked[id] ?? []).length === edges[id].size && w.at[id]?.[0] === homeOf(id)[0] && w.at[id]?.[1] === homeOf(id)[1];
  const perim = (w: SW, id: string) => (w.walked[id] ?? []).length * figures[id].unit;
  const play = usePlay<SW>({
    question,
    initial: { fig: ids[0] ?? "", at: Object.fromEntries(ids.map((id) => [id, homeOf(id)])), walked: {}, test: null, pick: null },
    derive: (w) => {
      if (ids.some((id) => !done(w, id))) return { note: `Survey every figure all the way round (${ids.filter((id) => done(w, id)).length}/${ids.length}).` };
      if (!w.pick) return { note: "Test the claims and pick the true one." };
      return { value: `${ids.map((id) => `${id} = ${perim(w, id)} cm`).join(", ")}; picked ${w.pick}`, optionId: w.pick === "none" ? matchText(question, "None of these") : w.pick };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const id = w.fig;
  const f = figures[id];
  const cells = f ? cellsOf(f) : [];
  const walked = w.walked[id] ?? [];
  const at = w.at[id] ?? [0, 0];
  const cols = f ? Math.max(...cells.map((c) => c[0])) + 1 : 1;
  const rows = f ? f.rows.length : 1;
  const S = 10;
  const drive = (d: string) =>
    play.set((p) => {
      let cur = p.at[id];
      const seen = [...(p.walked[id] ?? [])];
      let moved = 0;
      for (;;) {
        const nx: Pt = [cur[0] + DIRS[d][0], cur[1] + DIRS[d][1]];
        const k = ek(cur, nx);
        if (!edges[id].has(k) || seen.includes(k)) break;
        seen.push(k);
        cur = nx;
        moved++;
        const next: Pt = [cur[0] + DIRS[d][0], cur[1] + DIRS[d][1]];
        const branches = Object.values(DIRS).filter(([dx, dy]) => {
          const q: Pt = [cur[0] + dx, cur[1] + dy];
          return edges[id].has(ek(cur, q)) && !seen.includes(ek(cur, q));
        }).length;
        if (!edges[id].has(ek(cur, next)) || branches > 1) break;
      }
      if (!moved) return p;
      return { ...p, at: { ...p.at, [id]: cur }, walked: { ...p.walked, [id]: seen }, pick: null };
    });
  const side = (list: string[]) => list.reduce((s, k) => s + perim(w, k), 0);
  const allDone = ids.every((k) => done(w, k));
  const c = w.test ? claims[w.test] : null;

  return (
    <Shell
      play={play}
      question={question}
      title="Perimeter Surveyor"
      mission="Pick a figure and drive the survey cart round its outside edge; each drive runs straight to the next corner and the odometer adds the lengths (each square's side is marked). Survey all three, then put each claim on the comparison balance and pick the one that is true."
      icon={Route}
      dim="2D"
      submitLabel="Submit the true claim"
      hints={["Count the edges round the outside, then multiply by the length of one square's side.", "The three figures use different square sizes: 5 cm, 4 cm and 3 cm."]}
      live={
        <>
          {ids.map((k) => (
            <Gauge key={k} label={`${k} (${figures[k].unit} cm squares)`} value={done(w, k) ? `${perim(w, k)} cm` : `${perim(w, k)} cm so far`} tone={done(w, k) ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {ids.map((k) => (
          <Btn key={k} active={w.fig === k} tone={w.fig === k ? "violet" : done(w, k) ? "emerald" : "slate"} onClick={() => play.patch({ fig: k })}>
            Figure {k}
          </Btn>
        ))}
      </div>
      {f && (
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-3">
          <Board>
            <svg viewBox={`-4 -4 ${cols * S + 8} ${rows * S + 8}`} className="w-full max-h-72">
              {cells.map(([x, y]) => <rect key={`${x},${y}`} x={x * S} y={y * S} width={S} height={S} fill="#e0e7ff" stroke="#6366f1" strokeWidth={0.4} />)}
              {walked.map((k) => {
                const [a, b] = k.split("|").map((s) => s.split(",").map(Number));
                return <line key={k} x1={a[0] * S} y1={a[1] * S} x2={b[0] * S} y2={b[1] * S} stroke="#f59e0b" strokeWidth={1.6} />;
              })}
              <motion.circle cx={at[0] * S} cy={at[1] * S} initial={false} animate={{ cx: at[0] * S, cy: at[1] * S }} r={2.4} fill="#0f172a" />
            </svg>
            <p className="text-[11px] font-bold text-slate-500">Each small square here is {f.unit} cm × {f.unit} cm.</p>
          </Board>
          <Bay label="Cart controls" tone="violet">
            <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
              <span />
              <Btn disabled={play.readOnly} onClick={() => drive("N")} ariaLabel="drive north">▲</Btn>
              <span />
              <Btn disabled={play.readOnly} onClick={() => drive("W")} ariaLabel="drive west">◀</Btn>
              <span className="text-center self-center text-xl">🚜</span>
              <Btn disabled={play.readOnly} onClick={() => drive("E")} ariaLabel="drive east">▶</Btn>
              <span />
              <Btn disabled={play.readOnly} onClick={() => drive("S")} ariaLabel="drive south">▼</Btn>
              <span />
            </div>
            <Btn tone="slate" className="mt-2" disabled={play.readOnly || !walked.length} onClick={() => play.set((p) => ({ ...p, at: { ...p.at, [id]: homeOf(id) }, walked: { ...p.walked, [id]: [] }, pick: null }))}>
              Restart this survey
            </Btn>
          </Bay>
        </div>
      )}
      <Bay label="Comparison balance">
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(claims).map((k) => (
            <Btn key={k} className="text-[11px]" active={w.test === k} tone={w.test === k ? "sky" : "slate"} disabled={play.readOnly || !allDone} onClick={() => play.patch({ test: k })}>
              Test claim {k}
            </Btn>
          ))}
        </div>
        {c && (
          <div className="mt-2 text-sm font-bold">
            <div className="text-[11px] text-slate-500">{optText(question, w.test!)}</div>
            <div className="font-mono">
              {c.left.join(" + ")} = {side(c.left)} cm  {c.op}?  {c.right.join(" + ")} = {side(c.right)} cm
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Object.keys(claims).map((k) => (
            <Btn key={k} className="text-[11px]" tone={w.pick === k ? "emerald" : "slate"} active={w.pick === k} disabled={play.readOnly || !allDone} onClick={() => play.patch({ pick: k })} ariaLabel={`pick ${k}`}>
              ✓ Claim {k} is true
            </Btn>
          ))}
          <Btn className="text-[11px]" tone={w.pick === "none" ? "emerald" : "slate"} active={w.pick === "none"} disabled={play.readOnly || !allDone} onClick={() => play.patch({ pick: "none" })} ariaLabel="pick none">
            None of the claims is true
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — Divisibility Research Laboratory
   Stage 1 feeds 7456824 through the digit-sum machine and the ÷9 tester. Stage 2 tests the
   claimed rule on numbers whose digit sum is a multiple of 3 — one counterexample is
   enough to break it.
   ══════════════════════════════════════════════════════════════════════ */

export function Q48DivisibilityLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const number = cfg<number>(question, "number", 0);
  const verdictOptions = cfg<Record<string, string>>(question, "verdictOptions", {});
  const digits = String(number).split("").map(Number);
  const dsum = (n: number) => String(n).split("").reduce((s, d) => s + Number(d), 0);
  const play = usePlay<{ fed: number; tested: boolean; n: number; log: number[] }>({
    question,
    initial: { fed: 0, tested: false, n: 12, log: [] },
    derive: (w) => {
      if (w.fed < digits.length || !w.tested) return { note: "Stage 1: feed every digit, then run the ÷9 tester." };
      const v1 = number % 9 === 0 ? "T" : "F";
      const counter = w.log.some((n) => dsum(n) % 3 === 0 && n % 9 !== 0);
      const support = w.log.filter((n) => dsum(n) % 3 === 0 && n % 9 === 0).length;
      const v2 = counter ? "F" : support >= 4 ? "T" : null;
      if (!v2) return { note: "Stage 2: test numbers whose digit sum is a multiple of 3." };
      return { value: `Statement-I ${v1 === "T" ? "true" : "false"}, Statement-II ${v2 === "T" ? "true" : "false"}`, optionId: verdictOptions[`${v1}${v2}`] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const sum = digits.slice(0, w.fed).reduce((a, b) => a + b, 0);

  return (
    <Shell
      play={play}
      question={question}
      title="Divisibility Research Laboratory"
      mission="Stage 1: feed each digit of 7456824 into the digit-sum machine, then run the ÷9 tester. Stage 2: test Statement-II — enter numbers whose digits add to a multiple of 3 and see whether 9 always divides them."
      icon={Microscope}
      dim="2D"
      submitLabel="Submit the verdicts"
      hints={["A rule is false if even one number breaks it.", "Try a small number like 12 or 21."]}
      live={
        <>
          <Gauge label="Digit sum" value={`${sum}${w.fed === digits.length ? (sum % 9 === 0 ? " (÷9 ✓)" : " (÷9 ✗)") : ""}`} tone="violet" />
          <Gauge label="Rule broken by" value={w.log.filter((n) => dsum(n) % 3 === 0 && n % 9 !== 0).join(", ") || "none yet"} tone="rose" />
        </>
      }
    >
      <Bay label="Stage 1 · Number scanner">
        <div className="flex flex-wrap items-center gap-1">
          {digits.map((d, i) => <span key={i} className={`w-8 h-10 rounded grid place-items-center font-mono font-black text-xl ${i < w.fed ? "bg-emerald-200" : "bg-slate-100"}`}>{d}</span>)}
          <Btn className="ml-2" disabled={play.readOnly || w.fed >= digits.length} onClick={() => play.patch({ fed: w.fed + 1 })}>Feed next digit</Btn>
          <Btn tone="emerald" disabled={play.readOnly || w.fed < digits.length} onClick={() => play.patch({ tested: true })}>Run ÷9 tester</Btn>
          {w.tested && <span className="font-black text-sm">{number} ÷ 9 = {number / 9}</span>}
        </div>
      </Bay>
      <Bay label="Stage 2 · Rule tester" tone="violet">
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" aria-label="Number to test" value={w.n} disabled={play.readOnly} onChange={(e) => play.patch({ n: Math.max(1, Math.round(Number(e.target.value)) || 1) })} className="w-28 h-10 rounded border-2 px-2 font-mono font-black bg-white" />
          <span className="text-xs font-bold">digit sum {dsum(w.n)} {dsum(w.n) % 3 === 0 ? "(multiple of 3)" : "(not a multiple of 3)"}</span>
          <Btn tone="emerald" disabled={play.readOnly || w.log.includes(w.n)} onClick={() => play.patch({ log: [...w.log, w.n] })}>Test {w.n}</Btn>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {w.log.map((n) => <span key={n} className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold border ${dsum(n) % 3 === 0 && n % 9 !== 0 ? "bg-rose-100 border-rose-300" : "bg-white"}`}>{n}: ÷9 {n % 9 === 0 ? "✓" : "✗"}</span>)}
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — Fraction Observatory
   Each figure goes under the observatory: the student taps every piece to count it and the
   observatory reads shaded pieces over all pieces. Measured figures are loaded onto the
   conveyor in the order the student chooses.
   ══════════════════════════════════════════════════════════════════════ */

export function Q49FractionObservatoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figs = cfg<Record<string, { regions: Pt[][]; shaded: number[] }>>(question, "figures", {});
  const ids = Object.keys(figs);
  const [open, setOpen] = useState(ids[0] ?? "P");
  const play = usePlay<{ counted: Record<string, number[]>; belt: string[] }>({
    question,
    initial: { counted: {}, belt: [] },
    derive: (w) => {
      if (w.belt.length < ids.length) return { note: "Measure every figure and load it onto the conveyor." };
      const text = w.belt.join(", ");
      return { value: `Conveyor: ${text}`, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const f = figs[open];
  const c = w.counted[open] ?? [];
  const measured = (id: string) => (w.counted[id] ?? []).length === figs[id].regions.length;
  const frac = (id: string) => {
    const t = w.counted[id] ?? [];
    return `${t.filter((i) => figs[id].shaded.includes(i)).length}/${t.length}`;
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Fraction Observatory"
      mission="Put a figure under the observatory and tap every piece to count it; it reads shaded pieces over all pieces. When a figure is fully counted, load it onto the conveyor. Load all four from the smallest shaded fraction to the largest."
      icon={ChartPie}
      dim="2D"
      submitLabel="Submit the order"
      hints={["To compare fractions, compare each with 1/2 first.", "5/12 is less than 1/2 by 1/12; 15/32 is less than 1/2 by 1/32."]}
      live={
        <>
          <Gauge label={`Figure ${open}`} value={frac(open)} tone="violet" />
          <Gauge label="Conveyor" value={w.belt.map((id) => `${id} ${frac(id)}`).join(" → ") || "empty"} tone="amber" />
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {ids.map((id) => <Btn key={id} active={open === id} tone={open === id ? "violet" : measured(id) ? "emerald" : "slate"} onClick={() => setOpen(id)}>Figure {id}</Btn>)}
      </div>
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <Board>
          {f && (
            <svg viewBox="0 0 100 100" className="w-full max-h-64">
              {f.regions.map((pts, i) => (
                <path key={i} d={polyPath(pts)} fill={f.shaded.includes(i) ? "#a78bfa" : "#ffffff"} stroke={c.includes(i) ? "#f59e0b" : "#312e81"} strokeWidth={c.includes(i) ? 1.6 : 0.6} role="button" aria-label={`piece ${i + 1}`} style={{ cursor: "pointer" }} onClick={() => !play.readOnly && play.set((p) => ({ ...p, belt: p.belt.filter((x) => x !== open), counted: { ...p.counted, [open]: toggle(p.counted[open] ?? [], i) } }))} />
              ))}
            </svg>
          )}
        </Board>
        <Bay label="Ascending conveyor" tone="violet">
          <div className="flex gap-1 min-h-[48px]">
            {w.belt.map((id) => <span key={id} className="w-14 h-12 rounded-lg bg-amber-200 grid place-items-center font-black leading-tight">{id}<span className="text-[9px]">{frac(id)}</span></span>)}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Btn tone="emerald" disabled={play.readOnly || !measured(open) || w.belt.includes(open)} onClick={() => play.patch({ belt: [...w.belt, open] })}>Load figure {open}</Btn>
            <Btn tone="slate" disabled={play.readOnly || !w.belt.length} onClick={() => play.patch({ belt: [] })}>Clear conveyor</Btn>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — Mathematics Control Room
   Four stations, one per statement: a Roman numeral decoder, a digit arranger, an
   estimation calculator and a place-value scanner. Each stamps its statement once worked;
   the student then flags the statement that failed.
   ══════════════════════════════════════════════════════════════════════ */

const RV: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
interface RoomWorld {
  minus: number[];
  aDone: boolean;
  order: number[];
  bDone: boolean;
  places: number[];
  cDone: boolean;
  scan: number;
  scans: number[];
  flag: string | null;
}

export function Q50ControlRoomActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const st = cfg<{ A: { roman: string; claim: number }; B: { digits: number[]; claim: number }; C: { factors: number[]; claim: number }; D: { place: number } }>(question, "stations", {
    A: { roman: "", claim: 0 },
    B: { digits: [], claim: 0 },
    C: { factors: [], claim: 0 },
    D: { place: 1 },
  });
  const romanVal = (w: RoomWorld) => st.A.roman.split("").reduce((s, ch, i) => s + (w.minus.includes(i) ? -1 : 1) * RV[ch], 0);
  const built = (w: RoomWorld) => (w.order.length === st.B.digits.length ? Number(w.order.map((i) => st.B.digits[i]).join("")) : null);
  const est = (w: RoomWorld) => st.C.factors.reduce((p, f, i) => p * Math.round(f / 10 ** w.places[i]) * 10 ** w.places[i], 1);
  const tensEqual = (n: number) => {
    const d = Math.floor(n / 10) % 10;
    return d * 10 === d;
  };
  const verdict = (w: RoomWorld) => ({
    A: w.aDone ? romanVal(w) === st.A.claim : null,
    B: w.bDone ? built(w) === st.B.claim : null,
    C: w.cDone ? est(w) === st.C.claim : null,
    D: w.scans.length ? w.scans.every(tensEqual) : null,
  });
  const play = usePlay<RoomWorld>({
    question,
    initial: { minus: [], aDone: false, order: [], bDone: false, places: st.C.factors.map(() => 0), cDone: false, scan: 3456, scans: [], flag: null },
    derive: (w) => {
      const v = verdict(w);
      if (Object.values(v).some((x) => x === null)) return { note: "Work every station until it stamps its statement." };
      if (!w.flag) return { note: "Flag the statement that is incorrect." };
      return { value: `Statement ${w.flag} flagged (station ${v[w.flag as keyof typeof v] ? "passed" : "failed"} it)`, optionId: w.flag };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const v = verdict(w);
  const stamp = (x: boolean | null) => (x === null ? <span className="text-[10px] text-slate-400 font-bold">not checked</span> : <span className={`text-[10px] font-black px-1.5 rounded ${x ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>{x ? "✓ HOLDS" : "✗ FAILS"}</span>);
  const b = built(w);
  const ready = Object.values(v).every((x) => x !== null);

  return (
    <Shell
      play={play}
      question={question}
      title="Mathematics Control Room"
      mission="Work each station. A: set each numeral tile to add or take away and decode. B: arrange the four digits into the smallest 4-digit number. C: round each factor to its greatest place and multiply. D: scan numbers and compare the tens digit's face value with its place value. Then flag the incorrect statement."
      icon={MonitorCheck}
      dim="2D"
      submitLabel="Submit the incorrect statement"
      hints={["A 4-digit number cannot start with 0.", "Place value of a tens digit is 10 times its face value."]}
      live={<>{(["A", "B", "C", "D"] as const).map((k) => <Gauge key={k} label={`Station ${k}`} value={v[k] === null ? "—" : v[k] ? "holds" : "fails"} tone={v[k] === null ? "slate" : v[k] ? "emerald" : "rose"} />)}</>}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Bay label={<span className="flex items-center gap-2">A · Roman numerals {stamp(v.A)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "A")}</p>
          <div className="flex gap-1">
            {st.A.roman.split("").map((ch, i) => (
              <button key={i} type="button" disabled={play.readOnly} aria-label={`A tile ${i + 1}`} onClick={() => play.set((p) => ({ ...p, aDone: false, flag: null, minus: toggle(p.minus, i) }))} className={`w-8 h-10 rounded font-serif font-black border-2 ${w.minus.includes(i) ? "bg-rose-100 border-rose-400" : "bg-amber-50 border-amber-300"}`}>
                {ch}
              </button>
            ))}
            <Btn className="ml-auto px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ aDone: true })}>Decode → {romanVal(w)}</Btn>
          </div>
        </Bay>
        <Bay label={<span className="flex items-center gap-2">B · Digit arranger {stamp(v.B)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "B")}</p>
          <div className="flex flex-wrap gap-1">
            {st.B.digits.map((d, i) => (
              <Btn key={i} className="px-3 min-h-[34px]" tone="slate" disabled={play.readOnly || w.order.includes(i) || (w.order.length === 0 && d === 0)} onClick={() => play.set((p) => ({ ...p, bDone: false, flag: null, order: [...p.order, i] }))} ariaLabel={`digit ${d}`}>
                {d}
              </Btn>
            ))}
            <span className="font-mono font-black text-xl px-2">{w.order.map((i) => st.B.digits[i]).join("") || "____"}</span>
            <Btn className="px-2 min-h-[34px]" tone="slate" disabled={play.readOnly || !w.order.length} onClick={() => play.set((p) => ({ ...p, bDone: false, order: [] }))}>clear</Btn>
            <Btn className="px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly || b === null} onClick={() => play.patch({ bDone: true })}>Check</Btn>
          </div>
        </Bay>
        <Bay label={<span className="flex items-center gap-2">C · Estimation calculator {stamp(v.C)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "C")}</p>
          {st.C.factors.map((f, i) => (
            <div key={f} className="flex flex-wrap items-center gap-1 text-xs font-bold">
              <span className="w-12 font-mono">{f}</span>
              {[0, 1, 2, 3].map((p) => (
                <Btn key={p} className="px-1.5 min-h-[28px] text-[10px]" active={w.places[i] === p} tone={w.places[i] === p ? "sky" : "slate"} disabled={play.readOnly || 10 ** p > f} onClick={() => play.set((s) => ({ ...s, cDone: false, flag: null, places: s.places.map((x, j) => (j === i ? p : x)) }))} ariaLabel={`${f} round ${["ones", "tens", "hundreds", "thousands"][p]}`}>
                  {["ones", "tens", "hundreds", "thousands"][p]}
                </Btn>
              ))}
              <span className="font-mono">{Math.round(f / 10 ** w.places[i]) * 10 ** w.places[i]}</span>
            </div>
          ))}
          <Btn className="mt-1 px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ cDone: true })}>Multiply → {est(w)}</Btn>
        </Bay>
        <Bay label={<span className="flex items-center gap-2">D · Place-value scanner {stamp(v.D)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "D")}</p>
          <div className="flex flex-wrap items-center gap-2">
            <input type="number" aria-label="Number to scan" value={w.scan} disabled={play.readOnly} onChange={(e) => play.patch({ scan: Math.max(10, Math.round(Number(e.target.value)) || 10) })} className="w-24 h-9 rounded border-2 px-2 font-mono font-black bg-white" />
            <span className="text-xs font-bold">tens digit {Math.floor(w.scan / 10) % 10}: face {Math.floor(w.scan / 10) % 10}, place {(Math.floor(w.scan / 10) % 10) * 10}</span>
            <Btn className="px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ scans: [...w.scans, w.scan], flag: null })}>Scan</Btn>
          </div>
        </Bay>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(["A", "B", "C", "D"] as const).map((k) => (
          <Btn key={k} tone={w.flag === k ? "rose" : "slate"} active={w.flag === k} disabled={play.readOnly || !ready} onClick={() => play.patch({ flag: k })} ariaLabel={`flag ${k}`}>
            🚩 Statement {k} is incorrect
          </Btn>
        ))}
      </div>
    </Shell>
  );
}

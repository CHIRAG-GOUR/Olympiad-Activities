"use client";

import React, { useState } from "react";
import { FlipHorizontal2, MessageSquareText, ChartColumn, Triangle, Hammer } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, Pt, polyPath, optStarting } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — Symmetry Mirror Studio
   The student lays a mirror across each shape along one of eight lines through its
   centre and records every line where the reflection lands exactly on the shape. After
   all eight lines are tried on every shape, the shape with exactly two lines is found.
   ══════════════════════════════════════════════════════════════════════ */

const Q31_SHAPES: Record<string, Pt[]> = {
  "Equilateral triangle": [[0, -26], [22.5, 13], [-22.5, 13]],
  Square: [[-22, -22], [22, -22], [22, 22], [-22, 22]],
  "Scalene triangle": [[-26, 18], [24, 18], [-6, -22]],
  Rectangle: [[-30, -16], [30, -16], [30, 16], [-30, 16]],
};
const MIRRORS = [0, 30, 45, 60, 90, 120, 135, 150];
const reflect = ([x, y]: Pt, deg: number): Pt => {
  const t = (2 * deg * Math.PI) / 180;
  return [x * Math.cos(t) + y * Math.sin(t), x * Math.sin(t) - y * Math.cos(t)];
};
const hits = (pts: Pt[], deg: number) => {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  const c = pts.map(([x, y]) => [x - cx, y - cy] as Pt);
  return c.map((p) => reflect(p, deg)).every((r) => c.some((q) => Math.hypot(q[0] - r[0], q[1] - r[1]) < 0.6));
};

export function Q31LinesOfSymmetryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const names = Object.keys(Q31_SHAPES);
  const play = usePlay<{ fig: string; mirror: number | null; tried: Record<string, number[]>; lines: Record<string, number[]> }>({
    question,
    initial: { fig: names[0], mirror: null, tried: {}, lines: {} },
    derive: (w) => {
      if (names.some((n) => (w.tried[n] ?? []).length < MIRRORS.length)) return { note: "Try all eight mirror lines on every shape." };
      const two = names.filter((n) => (w.lines[n] ?? []).length === 2);
      if (two.length !== 1) return { note: "Record every line of symmetry you find." };
      return { value: `${two[0]} has exactly 2 lines`, optionId: optStarting(question, two[0]) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const pts = Q31_SHAPES[w.fig];
  const hit = w.mirror !== null && hits(pts, w.mirror);
  const rad = ((w.mirror ?? 0) * Math.PI) / 180;

  return (
    <Shell
      play={play}
      question={question}
      title="Symmetry Mirror Studio"
      mission="Pick a shape and lay the mirror along each of the eight lines. When the reflection (dashed) lands exactly on the shape, record that line. Try every line on every shape."
      icon={FlipHorizontal2}
      dim="2D"
      submitLabel="Submit the shape"
      live={<>{names.map((n) => <Gauge key={n} label={n} value={`${(w.lines[n] ?? []).length} lines · ${(w.tried[n] ?? []).length}/8 tried`} tone={(w.tried[n] ?? []).length === 8 ? "emerald" : "slate"} />)}</>}
    >
      <div className="flex flex-wrap gap-1.5 mb-2">{names.map((n) => <Btn key={n} active={w.fig === n} tone={w.fig === n ? "violet" : "slate"} onClick={() => play.patch({ fig: n, mirror: null })}>{n}</Btn>)}</div>
      <div className="grid md:grid-cols-2 gap-3">
        <Board>
          <svg viewBox="-45 -45 90 90" className="w-full max-h-64">
            <path d={polyPath(pts)} fill="#e0e7ff" stroke="#4338ca" strokeWidth={1} />
            {w.mirror !== null && (() => {
              const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
              const rp = pts.map(([x, y]) => { const r = reflect([x - cx, y - cy], w.mirror!); return [r[0] + cx, r[1] + cy] as Pt; });
              return (<><path d={polyPath(rp)} fill="none" stroke={hit ? "#10b981" : "#e11d48"} strokeWidth={1} strokeDasharray="2 1.5" /><line x1={cx - 42 * Math.cos(rad)} y1={cy - 42 * Math.sin(rad)} x2={cx + 42 * Math.cos(rad)} y2={cy + 42 * Math.sin(rad)} stroke="#0ea5e9" strokeWidth={1.2} /></>);
            })()}
          </svg>
        </Board>
        <Bay label="Mirror lines" tone="violet">
          <div className="grid grid-cols-4 gap-1">{MIRRORS.map((m) => <Btn key={m} className="px-1 min-h-[34px]" active={w.mirror === m} tone={w.mirror === m ? "sky" : (w.lines[w.fig] ?? []).includes(m) ? "emerald" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, mirror: m, tried: { ...p.tried, [p.fig]: Array.from(new Set([...(p.tried[p.fig] ?? []), m])) } }))} ariaLabel={`mirror ${m}`}>{m}°</Btn>)}</div>
          <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !hit || (w.lines[w.fig] ?? []).includes(w.mirror!)} onClick={() => play.patch({ lines: { ...w.lines, [w.fig]: [...(w.lines[w.fig] ?? []), w.mirror!] } })}>Record this line</Btn>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — Place-Value City
   The digits stand in a row with a comma slot between each pair. The student places the
   commas; the city names the groups from the right as ones, thousands and millions and
   reads the number aloud from the grouping.
   ══════════════════════════════════════════════════════════════════════ */

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const words = (n: number): string => (n < 20 ? ONES[n] : n < 100 ? TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "") : `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${words(n % 100)}` : ""}`);
const INTL = ["", "thousand", "million", "billion"];
const LAKH = ["", "thousand", "lakh", "crore"];
export function Q32InternationalNumberActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const digits = String(cfg<number>(question, "number", 0));
  const read = (commas: boolean[], sys: string[]) => {
    const groups: string[] = [];
    let cur = "";
    digits.split("").forEach((d, i) => { cur += d; if (commas[i]) { groups.push(cur); cur = ""; } });
    groups.push(cur);
    if (groups.length > sys.length || groups.some((g) => g.length > 3)) return null;
    const t = [...groups].reverse().map((g, i) => ({ v: Number(g), n: sys[i] })).reverse().filter((p) => p.v).map((p) => `${words(p.v)}${p.n ? ` ${p.n}` : ""}`).join(" ");
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const play = usePlay<{ commas: boolean[]; sys: "intl" | "indian"; spoken: boolean }>({
    question,
    initial: { commas: Array(Math.max(0, digits.length - 1)).fill(false), sys: "indian", spoken: false },
    derive: (w) => {
      if (!w.spoken) return { note: "Place the commas, choose the system and let the city read it." };
      const t = read(w.commas, w.sys === "intl" ? INTL : LAKH);
      if (!t) return { note: "That grouping cannot be read." };
      return { value: t, optionId: matchText(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const t = read(w.commas, w.sys === "intl" ? INTL : LAKH);

  return (
    <Shell
      play={play}
      question={question}
      title="Place-Value City"
      mission="Tap the gaps between digits to place the commas, and choose the number system. The city reads the number from your grouping — make it read the number the International way."
      icon={MessageSquareText}
      dim="2D"
      submitLabel="Submit the reading"
      live={<Gauge label="Written" value={digits.split("").map((d, i) => d + (w.commas[i] ? "," : "")).join("")} tone="violet" />}
    >
      <div className="flex flex-wrap gap-1.5 mb-2">
        <Btn active={w.sys === "intl"} tone={w.sys === "intl" ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ sys: "intl", spoken: false })}>🌍 International system</Btn>
        <Btn active={w.sys === "indian"} tone={w.sys === "indian" ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ sys: "indian", spoken: false })}>🇮🇳 Indian system</Btn>
      </div>
      <Board>
        <div className="flex flex-wrap justify-center items-center gap-0.5">
          {digits.split("").map((d, i) => (
            <React.Fragment key={i}>
              <span className="w-10 h-12 rounded-lg bg-white border border-indigo-200 grid place-items-center font-mono text-2xl font-black text-indigo-900">{d}</span>
              {i < digits.length - 1 && <button type="button" disabled={play.readOnly} aria-label={`comma after digit ${i + 1}`} onClick={() => play.set((p) => ({ ...p, spoken: false, commas: p.commas.map((c, j) => (j === i ? !c : c)) }))} className={`w-5 h-12 rounded border-2 border-dashed font-black text-xl ${w.commas[i] ? "border-indigo-500 text-indigo-700 bg-indigo-50" : "border-slate-200 text-transparent"}`}>,</button>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-center font-bold text-slate-700 mt-2">{w.spoken ? (t ? `“${t}”` : "⚠ can't read that grouping") : "…"}</p>
      </Board>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ spoken: true })}>🔊 Read it aloud</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — Car Wash Dashboard
   The bar graph is live. The student drags children's bars into two groups on the
   dashboard; each group's total is read from the bars and the difference is shown.
   ══════════════════════════════════════════════════════════════════════ */

const Q33_BARS: Record<string, number> = { Trishi: 18, Sam: 14, Mohit: 12, Mini: 8, Aarav: 16 };
export function Q33BarGraphActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ g: Record<string, 1 | 2 | undefined>; compared: boolean }>({
    question,
    initial: { g: {}, compared: false },
    derive: (w) => {
      const s = (k: 1 | 2) => Object.keys(Q33_BARS).filter((n) => w.g[n] === k);
      if (!w.compared || !s(1).length || !s(2).length) return { note: "Fill both groups and compare them." };
      const d = Math.abs(s(1).reduce((a, n) => a + Q33_BARS[n], 0) - s(2).reduce((a, n) => a + Q33_BARS[n], 0));
      return { value: `${d} cars`, optionId: matchNumber(question, d) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const tot = (k: 1 | 2) => Object.keys(Q33_BARS).filter((n) => w.g[n] === k).reduce((a, n) => a + Q33_BARS[n], 0);

  return (
    <Shell
      play={play}
      question={question}
      title="Car Wash Dashboard"
      mission="Read the bars. Tap a child's group button to put their bar in group 1 or group 2 (tap again to take it out). Put the two pairs the question compares in the two groups, then compare."
      icon={ChartColumn}
      dim="2D"
      submitLabel="Submit the difference"
      live={<><Gauge label="Group 1" value={tot(1)} tone="violet" /><Gauge label="Group 2" value={tot(2)} tone="amber" /></>}
    >
      <Board>
        <div className="flex items-end gap-3 h-40 px-2">
          {Object.entries(Q33_BARS).map(([n, v]) => (
            <div key={n} className="flex-1 text-center">
              <div className="text-[10px] font-black text-slate-600">{v}</div>
              <div className={`mx-auto w-8 rounded-t ${w.g[n] === 1 ? "bg-indigo-500" : w.g[n] === 2 ? "bg-amber-400" : "bg-slate-300"}`} style={{ height: v * 6 }} />
              <div className="text-[10px] font-bold text-slate-700">{n}</div>
              <div className="flex justify-center gap-0.5 mt-0.5">
                {([1, 2] as const).map((k) => <button key={k} type="button" disabled={play.readOnly} aria-label={`${n} group ${k}`} onClick={() => play.set((p) => ({ compared: false, g: { ...p.g, [n]: p.g[n] === k ? undefined : k } }))} className={`w-6 h-6 rounded text-[10px] font-black ${w.g[n] === k ? (k === 1 ? "bg-indigo-600 text-white" : "bg-amber-500 text-white") : "bg-slate-100 text-slate-600"}`}>{k}</button>)}
              </div>
            </div>
          ))}
        </div>
      </Board>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ compared: true })}>Compare the groups</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — Fraction Balance Pyramid
   Each row of the pyramid must add up to 1. The student dials the missing fraction in
   twelfths; the row's balance lamp lights when it sums to exactly 1.
   ══════════════════════════════════════════════════════════════════════ */

export function Q34FractionPyramidActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ n: number; set: boolean }>({
    question,
    initial: { n: 1, set: false },
    derive: (w) => {
      if (!w.set) return { note: "Dial the missing fraction and lock it in." };
      if (3 + w.n + 5 !== 12) return { note: `The row adds to ${3 + w.n + 5}/12, not 1.` };
      return { value: `${w.n}/12`, optionId: matchNumber(question, w.n / 12, 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const sum = 3 + w.n + 5;

  return (
    <Shell
      play={play}
      question={question}
      title="Fraction Balance Pyramid"
      mission="Every row must add up to 1. Row 2 holds 1/4 (= 3/12), the missing block and 5/12. Dial the missing block in twelfths until the row's lamp lights, then lock it in."
      icon={Triangle}
      dim="2D"
      submitLabel="Submit the missing fraction"
      live={<Gauge label="Row 2" value={`3/12 + ${w.n}/12 + 5/12 = ${sum}/12`} tone={sum === 12 ? "emerald" : "amber"} />}
    >
      <Board>
        <div className="space-y-1.5 text-center">
          <div className="flex justify-center gap-1">{["1/2", "1/2"].map((t, i) => <span key={i} className="w-28 h-10 grid place-items-center rounded bg-indigo-100 border border-indigo-300 font-mono font-black">{t}</span>)}<span className="self-center text-xs font-black text-emerald-700 ml-2">= 1 ✓</span></div>
          <div className="flex justify-center gap-1">
            <span className="w-24 h-10 grid place-items-center rounded bg-sky-100 border border-sky-300 font-mono font-black">1/4</span>
            <span className={`w-24 h-10 grid place-items-center rounded border-2 font-mono font-black ${sum === 12 ? "bg-emerald-100 border-emerald-400" : "bg-amber-50 border-amber-400"}`}>{w.n}/12</span>
            <span className="w-24 h-10 grid place-items-center rounded bg-sky-100 border border-sky-300 font-mono font-black">5/12</span>
            <span className={`self-center text-xs font-black ml-2 ${sum === 12 ? "text-emerald-700" : "text-rose-600"}`}>= {sum}/12 {sum === 12 ? "✓" : ""}</span>
          </div>
        </div>
      </Board>
      <div className="flex flex-wrap gap-2 mt-2">
        <Stepper label="Missing block (twelfths)" value={w.n} min={0} max={12} disabled={play.readOnly} onStep={(d) => play.patch({ n: w.n + d, set: false })} />
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ set: true })}>Lock it in</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — Number Construction Crane
   The crane lowers digit blocks into five slots; a number can't start with 0. Once built,
   the student steps to the predecessor and the successor and the crane adds them.
   ══════════════════════════════════════════════════════════════════════ */

export function Q35FiveDigitNumberActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const digits = [1, 4, 0, 2, 5];
  const play = usePlay<{ order: number[]; pred: boolean; succ: boolean }>({
    question,
    initial: { order: [], pred: false, succ: false },
    derive: (w) => {
      if (w.order.length < 5) return { note: "Build the number with all five digits." };
      if (!w.pred || !w.succ) return { note: "Find its predecessor and successor." };
      const n = Number(w.order.map((i) => digits[i]).join(""));
      return { value: `${n - 1} + ${n + 1} = ${2 * n}`, optionId: matchNumber(question, 2 * n) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const n = w.order.length === 5 ? Number(w.order.map((i) => digits[i]).join("")) : null;

  return (
    <Shell
      play={play}
      question={question}
      title="Number Construction Crane"
      mission="Lower the digit blocks into the slots, left to right, to build the smallest 5-digit number (a number can't start with 0). Then step back one to its predecessor and forward one to its successor; the crane adds the two."
      icon={Hammer}
      dim="2D"
      submitLabel="Submit the sum"
      live={<Gauge label="Built" value={n ?? "…"} tone="violet" />}
    >
      <div className="flex flex-wrap gap-1.5">{digits.map((d, i) => <Btn key={i} className="px-3" tone="slate" disabled={play.readOnly || w.order.includes(i) || (w.order.length === 0 && d === 0)} onClick={() => play.patch({ order: [...w.order, i], pred: false, succ: false })} ariaLabel={`digit ${d}`}>{d}</Btn>)}<Btn tone="slate" disabled={play.readOnly || !w.order.length} onClick={() => play.patch({ order: [], pred: false, succ: false })}>clear</Btn></div>
      <Board className="mt-2">
        <div className="flex justify-center gap-1">{Array.from({ length: 5 }, (_, k) => <span key={k} className="w-11 h-12 grid place-items-center rounded-lg bg-white border border-indigo-200 font-mono text-2xl font-black text-indigo-900">{w.order[k] !== undefined ? digits[w.order[k]] : ""}</span>)}</div>
        {n !== null && <p className="text-center font-mono font-black text-indigo-900 mt-2">{w.pred ? n - 1 : "?"} + {w.succ ? n + 1 : "?"} = {w.pred && w.succ ? 2 * n : "?"}</p>}
      </Board>
      <div className="flex gap-2 mt-2">
        <Btn disabled={play.readOnly || n === null} onClick={() => play.patch({ pred: true })}>◀ Step back 1 (predecessor)</Btn>
        <Btn disabled={play.readOnly || n === null} onClick={() => play.patch({ succ: true })}>Step forward 1 (successor) ▶</Btn>
      </div>
    </Shell>
  );
}

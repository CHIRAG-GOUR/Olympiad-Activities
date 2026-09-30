"use client";

import React, { useRef, useState } from "react";
import { ArrowDownUp, Calculator, Check, Delete, Hand, Hash, Link2, ListOrdered, MousePointerClick, Puzzle, Scale, Shapes, Sigma, Undo2, X } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { usePlay, type Derived } from "../imo6a-play/engine";
import { Shell } from "../ieo_g6_seta-play/kit";
import { eq, isValid, parseQ, show, type Q } from "./rational";

/* ══════════════════════════════════════════════════════════════════════
   Maths lab — one engine for the printed Olympiad papers.

   Every question keeps its printed figure (cropped from the paper scan) and
   is worked with a tool that fits what it asks:

     count    tap a counter onto each thing you count in the figure
     dial     work the answer out and key it in; it maps to an option by value
     figure   place one of the paper's option figures into the answer slot
     tile     complete a statement with a card
     truth    judge each statement true or false
     order    put items in order
     match    link each item of one column to the other
     multi    key in the answer to every part of a multi-part question
     compare  work out both sides; the machine sets the sign between them
     max      evaluate every expression; the machine picks the largest
     build    assemble an expression from its pieces

   Nothing on screen reacts differently to the right answer, and no mode
   knows which option is correct.
   ══════════════════════════════════════════════════════════════════════ */

type Opt = { id: string; text: string };
type Img = { src: string; w?: number };

export type LabCfg = { fig?: Img; figs?: Img[]; title?: string; mission?: string; hints?: string[] } & (
  | { mode: "count"; what: string; fig: Img }
  | { mode: "dial"; unit?: string; keys?: string }
  | { mode: "figure"; opts: Record<string, Img>; slot?: string }
  | { mode: "tile"; template: string }
  | { mode: "truth"; statements: string[]; map: Record<string, string> }
  | { mode: "order"; items: string[]; sep?: string; ask: string }
  | { mode: "match"; left: string[]; right: { key: string; text: string }[]; map: Record<string, string> }
  | { mode: "multi"; parts: { label: string; unit?: string }[] }
  | { mode: "compare"; left: string; right: string; map: Record<string, string> }
  | { mode: "max"; pick?: "largest" | "smallest" }
  | { mode: "build"; tokens: string[] }
);

type W = {
  marks: { x: number; y: number }[];
  keyed: string[];
  pick?: string;
  seq: string[];
  truth: Record<number, "T" | "F">;
  links: Record<number, string>;
};

const INIT: W = { marks: [], keyed: [], seq: [], truth: {}, links: {} };

/* ── value helpers ──────────────────────────────────────────────────── */

const clean = (s: string) => s.replace(/₹\s*/g, "").replace(/(\d),(?=\d{3}\b)/g, "$1").replace(/[−–]/g, "-");
const compact = (s: string) => clean(s).toLowerCase().replace(/\s+/g, "").replace(/×/g, "x");

/** All numbers in a text, in order ("(i) 2; (ii) 6" → [2, 6]). */
export function numbersIn(text: string): Q[] {
  const t = clean(text).replace(/\((?:i{1,3}|iv|v)\)/gi, " ");
  return (t.match(/-?\d+\s+\d+\/\d+|-?\d+\s*\/\s*\d+|-?\d*\.\d+|-?\d+/g) ?? []).map((m) => parseQ(m)).filter((x): x is Q => !!x);
}

/** Maps a keyed value to the printed option with the same value (ratios compare as written). */
function optionForValue(options: Opt[], raw: string): string | undefined {
  const v = raw.trim();
  if (v.includes(":")) return options.find((o) => compact(o.text) === compact(v))?.id;
  if (/^[0-9]{5,}$/.test(v)) {
    const exact = options.find((o) => clean(o.text).replace(/\s+/g, "") === v);
    if (exact) return exact.id;
  }
  const q = parseQ(v);
  if (!q || !isValid(q)) return undefined;
  const hit = options.find((o) => {
    const n = numbersIn(o.text);
    return n.length === 1 && eq(n[0], q);
  });
  if (hit) return hit.id;
  return options.find((o) => /none of these/i.test(o.text))?.id;
}

/* ── the activity ───────────────────────────────────────────────────── */

export function MathLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const c = (question?.customConfig?.lab ?? { mode: "dial" }) as LabCfg;
  const options: Opt[] = question?.multipleChoiceConfig?.options ?? [];
  const byId = (id?: string) => options.find((o) => o.id === id);

  const derive = (w: W): Derived => {
    switch (c.mode) {
      case "count": {
        if (!w.marks.length) return { note: `Tap the figure to place a counter on each ${c.what}.` };
        const n = w.marks.length;
        const id = options.find((o) => {
          const x = numbersIn(o.text);
          return x.length === 1 && eq(x[0], { p: n, q: 1 });
        })?.id;
        return { value: `${n}`, optionId: id, note: id ? undefined : "That count is not one of the printed answers — check again." };
      }
      case "dial": {
        const raw = w.keyed.join("");
        if (!raw) return { note: "Work it out, then key your answer into the pad." };
        const id = optionForValue(options, raw);
        const q = parseQ(raw);
        const shown = raw.includes(":") || !q ? raw : show(q);
        return { value: `${shown}${c.unit ? ` ${c.unit}` : ""}`, optionId: id, note: id ? undefined : "Keep working — that value is not one the paper prints." };
      }
      case "figure":
      case "tile": {
        const o = byId(w.pick);
        if (!o) return { note: c.mode === "figure" ? "Place a figure card into the answer slot." : "Place a card into the statement." };
        return { value: o.text, optionId: o.id };
      }
      case "truth": {
        const verdict = c.statements.map((_, i) => w.truth[i] ?? "").join("");
        if (verdict.length < c.statements.length) return { note: "Judge every statement: true or false." };
        const id = c.map[verdict];
        return { value: c.statements.map((_, i) => `${roman(i)} ${w.truth[i] === "T" ? "true" : "false"}`).join(", "), optionId: id, note: id ? undefined : "No printed option matches that verdict." };
      }
      case "order": {
        if (w.seq.length < c.items.length) return { note: "Tap every item in order." };
        const text = w.seq.join(c.sep ?? ", ");
        const id = options.find((o) => compact(o.text) === compact(text))?.id;
        return { value: text, optionId: id, note: id ? undefined : "That order is not one of the printed options." };
      }
      case "match": {
        if (Object.keys(w.links).length < c.left.length) return { note: "Link every row of Column I." };
        const key = c.left.map((_, i) => w.links[i]).join("");
        const id = c.map[key];
        return { value: c.left.map((_, i) => `${roman(i)}→(${w.links[i]})`).join(" "), optionId: id, note: id ? undefined : "That set of links is not one of the printed options." };
      }
      case "multi": {
        const parts = partsOf(w.keyed, c.parts.length);
        if (parts.some((p) => !p)) return { note: "Key in an answer for every part." };
        const vals = parts.map((p) => parseQ(p));
        const id = options.find((o) => {
          const n = numbersIn(o.text);
          return n.length === vals.length && n.every((x, i) => vals[i] && eq(x, vals[i]!));
        })?.id;
        return { value: parts.map((p, i) => `${roman(i)} ${p}`).join(", "), optionId: id, note: id ? undefined : "That set of answers is not one of the printed options." };
      }
      case "compare": {
        const [l, r] = partsOf(w.keyed, 2);
        if (!l || !r) return { note: "Work out both sides and key them in." };
        const a = parseQ(l);
        const b = parseQ(r);
        if (!a || !b) return { note: "Key a number for each side." };
        const d = a.p * b.q - b.p * a.q;
        const sign = d > 0 ? ">" : d < 0 ? "<" : "=";
        return { value: `${show(a)} ${sign} ${show(b)}`, optionId: c.map[sign] };
      }
      case "max": {
        const vals = options.map((_, i) => parseQ(partsOf(w.keyed, options.length)[i] ?? ""));
        if (vals.some((v) => !v)) return { note: "Evaluate every expression." };
        const pickSmall = c.pick === "smallest";
        let best = 0;
        vals.forEach((v, i) => {
          const b = vals[best]!;
          const d = v!.p * b.q - b.p * v!.q;
          if (pickSmall ? d < 0 : d > 0) best = i;
        });
        return { value: `${options[best].text} = ${show(vals[best]!)}`, optionId: options[best].id };
      }
      case "build": {
        if (!w.seq.length) return { note: "Assemble the expression from the pieces." };
        const text = w.seq.join(" ");
        const id = options.find((o) => compact(o.text) === compact(text))?.id ?? options.find((o) => /none of these/i.test(o.text))?.id;
        return { value: text, optionId: id, note: id ? undefined : "That expression is not one of the printed options." };
      }
    }
  };

  const play = usePlay<W>({ question, initial: INIT, derive, activityState, value, onChange, readOnly });
  const w = { ...INIT, ...play.world };
  const set = (p: Partial<W>) => play.set((prev) => ({ ...INIT, ...prev, ...p }));
  const locked = play.locked;
  const blocked = play.derived.value && !play.derived.optionId ? "Only an answer the paper prints can be recorded." : undefined;

  const META: Record<LabCfg["mode"], { title: string; icon: typeof Calculator; mission: string }> = {
    count: { title: "Counting Bench", icon: Hash, mission: "Mark each one on the paper's figure — the counter keeps the tally." },
    dial: { title: "Working Bench", icon: Calculator, mission: "Work the problem out and key in your answer — it is matched to the printed options by its value." },
    figure: { title: "Figure Fit", icon: Puzzle, mission: "Study the figure, then place the option figure that fits into the answer slot." },
    tile: { title: "Statement Builder", icon: Shapes, mission: "Complete the statement with the card that makes it true." },
    truth: { title: "Truth Lab", icon: Scale, mission: "Check each statement yourself and judge it true or false." },
    order: { title: "Ordering Rail", icon: ListOrdered, mission: "Tap the items in the order the question asks for." },
    match: { title: "Match Board", icon: Link2, mission: "Work out each row of Column I and link it to Column II." },
    multi: { title: "Multi-part Bench", icon: Sigma, mission: "Answer every part — the set of answers is matched to the printed options." },
    compare: { title: "Balance", icon: ArrowDownUp, mission: "Work out the value of each side; the balance shows how they compare." },
    max: { title: "Expression Scanner", icon: Sigma, mission: "Evaluate every expression; the scanner picks the one the question asks for." },
    build: { title: "Expression Builder", icon: Shapes, mission: "Translate the words into symbols by assembling the pieces in order." },
  };
  const meta = META[c.mode];

  return (
    <Shell dim="2D" play={play} question={question} title={c.title ?? meta.title} subtitle={c.mission ?? meta.mission} icon={meta.icon} hints={c.hints ?? []} submitBlocked={blocked}>
      <div className="space-y-3">
        <Stem question={question} />
        {c.mode === "count" && <CountPanel fig={c.fig} what={c.what} marks={w.marks} locked={locked} onMarks={(marks) => set({ marks })} />}
        {c.mode !== "count" && (c.fig || c.figs) && <Figures figs={c.figs ?? [c.fig!]} />}
        {c.mode === "dial" && <Pad keyed={w.keyed} unit={c.unit} keys={c.keys} locked={locked} onKeyed={(keyed) => set({ keyed })} />}
        {c.mode === "figure" && <FigurePanel opts={c.opts} options={options} pick={w.pick} slot={c.slot} locked={locked} onPick={(pick) => set({ pick })} />}
        {c.mode === "tile" && <TilePanel template={c.template} options={options} pick={w.pick} locked={locked} onPick={(pick) => set({ pick })} />}
        {c.mode === "truth" && <TruthPanel statements={c.statements} truth={w.truth} locked={locked} onTruth={(truth) => set({ truth })} />}
        {c.mode === "order" && <OrderPanel items={c.items} ask={c.ask} seq={w.seq} locked={locked} onSeq={(seq) => set({ seq })} />}
        {c.mode === "match" && <MatchPanel left={c.left} right={c.right} links={w.links} locked={locked} onLinks={(links) => set({ links })} />}
        {c.mode === "multi" && <MultiPanel labels={c.parts.map((p, i) => `${roman(i)} ${p.label}`)} units={c.parts.map((p) => p.unit)} keyed={w.keyed} locked={locked} onKeyed={(keyed) => set({ keyed })} />}
        {c.mode === "compare" && <MultiPanel labels={[c.left, c.right]} keyed={w.keyed} locked={locked} onKeyed={(keyed) => set({ keyed })} balance />}
        {c.mode === "max" && <MultiPanel labels={options.map((o) => o.text)} keyed={w.keyed} locked={locked} onKeyed={(keyed) => set({ keyed })} mono />}
        {c.mode === "build" && <BuildPanel tokens={c.tokens} seq={w.seq} locked={locked} onSeq={(seq) => set({ seq })} />}
      </div>
    </Shell>
  );
}

const roman = (i: number) => `(${["i", "ii", "iii", "iv", "v"][i]})`;

/** Multi-field answers are stored as one list with "|" between fields. */
function partsOf(keyed: string[], n: number): string[] {
  const s = keyed.join("").split("|");
  return Array.from({ length: n }, (_, i) => s[i] ?? "");
}

/* ── panels ─────────────────────────────────────────────────────────── */

function Stem({ question }: { question?: ActivityComponentProps["question"] }) {
  const lines = (question?.questionText ?? "").split(/\n| \/ /).map((l) => l.trim()).filter(Boolean);
  return (
    <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4">
      <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-indigo-500">Question {String(question?.customConfig?.questionNumber ?? "")}</div>
      {lines.map((l, i) => (
        <p key={i} className={`${i ? "mt-1 text-[13.5px]" : "text-[15px] font-bold"} leading-relaxed text-slate-800`}>
          {l}
        </p>
      ))}
    </div>
  );
}

function Figures({ figs }: { figs: Img[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-3">
      {figs.map((f) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={f.src} src={f.src} alt="figure from the question paper" draggable={false} className="max-h-[300px] w-auto select-none" style={{ maxWidth: f.w ?? 520 }} />
      ))}
    </div>
  );
}

const chip = "inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 px-3 text-sm font-black transition-all select-none disabled:opacity-40";

function CountPanel({ fig, what, marks, onMarks, locked }: { fig: Img; what: string; marks: { x: number; y: number }[]; onMarks: (m: { x: number; y: number }[]) => void; locked: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/40 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700">
          <MousePointerClick className="h-3.5 w-3.5" /> Tap once for each {what} · tap a counter to lift it
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-white px-2.5 py-1 font-mono text-lg font-black text-amber-800 shadow-sm" aria-label="tally">
            {marks.length}
          </span>
          <button type="button" disabled={locked || !marks.length} onClick={() => onMarks(marks.slice(0, -1))} className={`${chip} border-slate-200 bg-white text-slate-600`}>
            <Undo2 className="h-4 w-4" />
          </button>
          <button type="button" disabled={locked || !marks.length} onClick={() => onMarks([])} className={`${chip} border-slate-200 bg-white text-slate-600`}>
            Clear
          </button>
        </div>
      </div>
      <div
        ref={box}
        role="application"
        aria-label={`figure — tap each ${what}`}
        className="relative mx-auto w-fit cursor-crosshair select-none"
        onClick={(e) => {
          if (locked || !box.current) return;
          const r = box.current.getBoundingClientRect();
          onMarks([...marks, { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }]);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fig.src} alt="figure from the question paper" draggable={false} className="block max-h-[340px] w-auto" style={{ maxWidth: fig.w ?? 540 }} />
        {marks.map((m, i) => (
          <button
            key={i}
            type="button"
            aria-label={`counter ${i + 1}`}
            disabled={locked}
            onClick={(e) => {
              e.stopPropagation();
              onMarks(marks.filter((_, j) => j !== i));
            }}
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-[10px] font-black text-white shadow-md"
            style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-center">
        <button type="button" disabled={locked} onClick={() => onMarks([...marks, { x: 0.04 + (marks.length % 12) * 0.08, y: 0.96 }])} className={`${chip} border-amber-300 bg-white text-amber-800`}>
          + add a counter (keyboard)
        </button>
      </div>
    </div>
  );
}

const PAD = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "/"];

function Pad({ keyed, onKeyed, unit, keys, locked }: { keyed: string[]; onKeyed: (k: string[]) => void; unit?: string; keys?: string; locked: boolean }) {
  const extra = (keys ?? "-").split("").filter((k) => k !== " ");
  const push = (k: string) => !locked && keyed.length < 14 && onKeyed([...keyed, k]);
  return (
    <div className="mx-auto max-w-[420px] rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 shadow-inner">
      <div
        className="mb-2 flex min-h-[56px] items-center justify-end rounded-xl border-4 border-slate-700 bg-slate-800 px-3 font-mono text-2xl font-black tracking-wider text-emerald-300 outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
        tabIndex={locked ? -1 : 0}
        aria-label="answer display"
        onKeyDown={(e) => {
          if (/^[0-9./:\-]$/.test(e.key)) (e.preventDefault(), push(e.key));
          else if (e.key === "Backspace") (e.preventDefault(), onKeyed(keyed.slice(0, -1)));
        }}
      >
        {keyed.join("") || <span className="text-sm text-slate-500">your answer</span>}
        {unit && <span className="ml-2 text-base text-slate-400">{unit}</span>}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {PAD.slice(0, 3).map((k) => <Key key={k} k={k} onPress={push} locked={locked} />)}
        <button type="button" aria-label="key backspace" disabled={locked || !keyed.length} onClick={() => onKeyed(keyed.slice(0, -1))} className={`${chip} border-slate-300 bg-slate-100 text-slate-700`}>
          <Delete className="h-5 w-5" />
        </button>
        {PAD.slice(3, 6).map((k) => <Key key={k} k={k} onPress={push} locked={locked} />)}
        <button type="button" aria-label="key clear" disabled={locked || !keyed.length} onClick={() => onKeyed([])} className={`${chip} border-slate-300 bg-slate-100 text-slate-700`}>
          C
        </button>
        {PAD.slice(6, 9).map((k) => <Key key={k} k={k} onPress={push} locked={locked} />)}
        {extra[0] ? <Key k={extra[0]} onPress={push} locked={locked} /> : <span />}
        {PAD.slice(9).map((k) => <Key key={k} k={k} onPress={push} locked={locked} />)}
        {extra[1] ? <Key k={extra[1]} onPress={push} locked={locked} /> : <span />}
      </div>
    </div>
  );
}

function Key({ k, onPress, locked }: { k: string; onPress: (k: string) => void; locked: boolean }) {
  return (
    <button type="button" aria-label={`key ${k}`} disabled={locked} onClick={() => onPress(k)} className={`${chip} border-slate-200 bg-white font-mono text-xl text-slate-800 shadow-[0_2px_0_#e2e8f0] active:translate-y-0.5`}>
      {k === "-" ? "−" : k}
    </button>
  );
}

function FigurePanel({ opts, options, pick, onPick, slot, locked }: { opts: Record<string, Img>; options: Opt[]; pick?: string; onPick: (id: string) => void; slot?: string; locked: boolean }) {
  const [held, setHeld] = useState<string | null>(null);
  return (
    <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <Hand className="h-3.5 w-3.5" /> Figure cards — pick one up, then drop it in the slot
        </div>
        <div className="grid grid-cols-2 gap-2">
          {options.map((o) => (
            <button key={o.id} type="button" disabled={locked} aria-pressed={held === o.id} aria-label={`figure card ${o.id}`} onClick={() => setHeld((h) => (h === o.id ? null : o.id))} className={`flex min-h-[90px] items-center justify-center rounded-xl border-2 bg-white p-2 transition-all ${held === o.id ? "-translate-y-1 border-amber-400 ring-4 ring-amber-200" : pick === o.id ? "border-indigo-300 opacity-40" : "border-slate-200 hover:-translate-y-0.5"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={opts[o.id]?.src} alt={`option figure ${o.id}`} draggable={false} className="max-h-[110px] w-auto" />
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        disabled={locked || !held}
        aria-label="answer slot"
        onClick={() => {
          if (held) onPick(held);
          setHeld(null);
        }}
        className={`flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${held ? "animate-pulse border-amber-400 bg-amber-50" : "border-indigo-200 bg-indigo-50/50"}`}
      >
        <div className="text-[10px] font-black uppercase tracking-wider text-indigo-500">{slot ?? "Answer slot"}</div>
        <div className="mt-2 flex min-h-[110px] min-w-[120px] items-center justify-center rounded-xl border-2 border-dashed border-indigo-300 bg-white p-2">
          {pick ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={opts[pick]?.src} alt="placed figure" draggable={false} className="max-h-[120px] w-auto" />
          ) : (
            <span className="text-3xl font-black text-indigo-200">?</span>
          )}
        </div>
        <div className="mt-1 text-[10px] font-semibold text-slate-400">{held ? "tap to place the card" : "pick up a card first"}</div>
      </button>
    </div>
  );
}

function TilePanel({ template, options, pick, onPick, locked }: { template: string; options: Opt[]; pick?: string; onPick: (id: string) => void; locked: boolean }) {
  const [a, b] = template.split("___");
  const placed = options.find((o) => o.id === pick);
  return (
    <div className="space-y-3">
      <p className="rounded-2xl border-2 border-violet-100 bg-violet-50/50 p-4 text-center text-lg font-bold text-slate-800">
        {a}
        <span className={`mx-1 inline-flex min-w-[110px] items-center justify-center rounded-lg border-2 px-2.5 py-0.5 align-middle ${placed ? "border-violet-400 bg-white text-violet-900" : "border-dashed border-slate-300 text-slate-300"}`}>{placed?.text ?? "______"}</span>
        {b}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((o) => (
          <button key={o.id} type="button" disabled={locked} aria-label={`card ${o.text}`} onClick={() => onPick(o.id)} className={`${chip} ${pick === o.id ? "border-violet-500 bg-violet-600 text-white" : "border-violet-300 bg-white text-violet-900 shadow-[0_3px_0_#c4b5fd]"}`}>
            {o.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function TruthPanel({ statements, truth, onTruth, locked }: { statements: string[]; truth: Record<number, "T" | "F">; onTruth: (t: Record<number, "T" | "F">) => void; locked: boolean }) {
  return (
    <div className="space-y-2">
      {statements.map((s, i) => (
        <div key={i} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-3">
          <span className="font-black text-indigo-600">{statements.length > 2 ? roman(i) : `Statement ${["I", "II", "III"][i]}`}</span>
          <p className="min-w-[200px] flex-1 text-[13.5px] leading-snug text-slate-800">{s}</p>
          <div className="flex gap-1.5">
            {(["T", "F"] as const).map((v) => (
              <button key={v} type="button" disabled={locked} aria-label={`statement ${i + 1} ${v === "T" ? "true" : "false"}`} aria-pressed={truth[i] === v} onClick={() => onTruth({ ...truth, [i]: v })} className={`${chip} w-20 ${truth[i] === v ? (v === "T" ? "border-emerald-500 bg-emerald-500 text-white" : "border-rose-500 bg-rose-500 text-white") : "border-slate-200 bg-white text-slate-600"}`}>
                {v === "T" ? <Check className="mr-1 h-4 w-4" /> : <X className="mr-1 h-4 w-4" />}
                {v === "T" ? "True" : "False"}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderPanel({ items, ask, seq, onSeq, locked }: { items: string[]; ask: string; seq: string[]; onSeq: (s: string[]) => void; locked: boolean }) {
  return (
    <div className="space-y-3 rounded-2xl border-2 border-sky-100 bg-sky-50/50 p-3">
      <div className="text-[10px] font-black uppercase tracking-wider text-sky-700">{ask}</div>
      <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-sky-300 bg-white p-2">
        {seq.map((s, i) => (
          <button key={s} type="button" disabled={locked} aria-label={`take back ${s}`} onClick={() => onSeq(seq.filter((x) => x !== s))} className={`${chip} border-sky-500 bg-sky-600 text-white`}>
            <span className="mr-1.5 text-[10px] opacity-70">{i + 1}</span>
            {s}
          </button>
        ))}
        {!seq.length && <span className="text-xs font-semibold text-slate-400">first → last</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((it) => (
          <button key={it} type="button" disabled={locked || seq.includes(it)} aria-label={`item ${it}`} onClick={() => onSeq([...seq, it])} className={`${chip} border-sky-300 bg-white font-mono text-lg text-sky-900 shadow-[0_3px_0_#7dd3fc]`}>
            {it}
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchPanel({ left, right, links, onLinks, locked }: { left: string[]; right: { key: string; text: string }[]; links: Record<number, string>; onLinks: (l: Record<number, string>) => void; locked: boolean }) {
  const [from, setFrom] = useState<number | null>(null);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Column I — tap a row</div>
        {left.map((l, i) => (
          <button key={i} type="button" disabled={locked} aria-label={`row ${i + 1}`} onClick={() => setFrom(i)} className={`flex w-full items-start gap-2 rounded-xl border-2 p-2.5 text-left text-[13px] font-semibold transition-all ${from === i ? "border-amber-400 bg-amber-50" : "border-slate-200 bg-white"}`}>
            <span className="font-black text-indigo-600">{roman(i)}</span>
            <span className="flex-1 text-slate-800">{l}</span>
            <span className={`rounded-md px-1.5 py-0.5 text-xs font-black ${links[i] ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>{links[i] ? `(${links[i]})` : "—"}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Column II — then tap its match</div>
        {right.map((r) => (
          <button
            key={r.key}
            type="button"
            disabled={locked || from === null}
            aria-label={`column two ${r.key}`}
            onClick={() => {
              if (from === null) return;
              onLinks({ ...links, [from]: r.key });
              setFrom(null);
            }}
            className={`${chip} w-full justify-start gap-2 border-slate-200 bg-white text-slate-800 ${from !== null ? "animate-pulse border-amber-300" : ""}`}
          >
            <span className="font-black text-indigo-600">({r.key})</span> {r.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiPanel({ labels, units, keyed, onKeyed, locked, balance, mono }: { labels: string[]; units?: (string | undefined)[]; keyed: string[]; onKeyed: (k: string[]) => void; locked: boolean; balance?: boolean; mono?: boolean }) {
  const fields = partsOf(keyed, labels.length);
  const [active, setActive] = useState(0);
  const write = (i: number, v: string) => {
    const next = [...fields];
    next[i] = v;
    onKeyed(next.join("|").split(""));
  };
  const keys = [...PAD, "-", ":"];
  return (
    <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
      <div className="space-y-2">
        {labels.map((l, i) => (
          <button key={i} type="button" disabled={locked} aria-label={`field ${i + 1}`} onClick={() => setActive(i)} className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border-2 p-2.5 text-left transition-all ${active === i ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white"}`}>
            <span className={`text-[13px] font-bold text-slate-800 ${mono ? "font-mono" : ""}`}>{l}</span>
            <span className="min-w-[90px] rounded-lg bg-slate-800 px-2 py-1 text-right font-mono text-lg font-black text-emerald-300">
              {fields[i] || <span className="text-xs text-slate-500">= ?</span>}
              {units?.[i] && <span className="ml-1 text-xs text-slate-400">{units[i]}</span>}
            </span>
          </button>
        ))}
        {balance && fields[0] && fields[1] && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 p-2 text-sm font-black text-indigo-800">
            <Scale className="h-4 w-4" /> the balance tips by the values you keyed
          </div>
        )}
      </div>
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-2">
        <div className="mb-1 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">Keypad → field {active + 1}</div>
        <div className="grid grid-cols-4 gap-1.5">
          {keys.map((k) => (
            <button key={k} type="button" aria-label={`key ${k}`} disabled={locked} onClick={() => fields[active].length < 12 && write(active, fields[active] + k)} className={`${chip} border-slate-200 bg-white font-mono text-lg text-slate-800`}>
              {k === "-" ? "−" : k}
            </button>
          ))}
          <button type="button" aria-label="key backspace" disabled={locked} onClick={() => write(active, fields[active].slice(0, -1))} className={`${chip} col-span-2 border-slate-300 bg-slate-100 text-slate-700`}>
            <Delete className="h-5 w-5" />
          </button>
          <button type="button" aria-label="next field" disabled={locked} onClick={() => setActive((a) => (a + 1) % labels.length)} className={`${chip} col-span-2 border-indigo-300 bg-indigo-50 text-indigo-800`}>
            next ↓
          </button>
        </div>
      </div>
    </div>
  );
}

function BuildPanel({ tokens, seq, onSeq, locked }: { tokens: string[]; seq: string[]; onSeq: (s: string[]) => void; locked: boolean }) {
  return (
    <div className="space-y-3 rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 p-3">
      <div className="flex min-h-[54px] flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed border-indigo-300 bg-white p-2 font-mono text-lg">
        {seq.map((s, i) => (
          <button key={i} type="button" disabled={locked} aria-label={`take back ${s}`} onClick={() => onSeq(seq.filter((_, j) => j !== i))} className={`${chip} border-indigo-500 bg-indigo-600 font-mono text-white`}>
            {s}
          </button>
        ))}
        {!seq.length && <span className="text-xs font-semibold text-slate-400">tap pieces to build the expression</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {tokens.map((t, i) => (
          <button key={i} type="button" disabled={locked} aria-label={`piece ${t}`} onClick={() => onSeq([...seq, t])} className={`${chip} border-indigo-300 bg-white font-mono text-lg text-indigo-900 shadow-[0_3px_0_#a5b4fc]`}>
            {t}
          </button>
        ))}
        <button type="button" aria-label="undo piece" disabled={locked || !seq.length} onClick={() => onSeq(seq.slice(0, -1))} className={`${chip} border-slate-200 bg-white text-slate-600`}>
          <Undo2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

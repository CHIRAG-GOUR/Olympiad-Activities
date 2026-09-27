"use client";

import React, { useState } from "react";
import { Factory, CircleDot, BookA, Users, Grid3x3 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { clientToSvg } from "../imo6a-play/svgPoint";
import { Shell, Board, Pt, polyPath } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — Operator Factory
   Each code letter is a socket; the student plugs the real operator into it. The factory
   then evaluates the expression one operation at a time, and only accepts the operation
   the order-of-operations rules allow next.
   ══════════════════════════════════════════════════════════════════════ */

const Q11_EXPR = ["24", "R", "8", "S", "7", "M", "2", "P", "5"];
const REAL: Record<string, string> = { P: "×", R: "÷", M: "−", S: "+" };
const f = (op: string, a: number, b: number) => (op === "×" ? a * b : op === "÷" ? a / b : op === "+" ? a + b : a - b);
export function Q11OperatorFactoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [msg, setMsg] = useState<string | null>(null);
  const play = usePlay<{ plug: Record<string, string>; toks: string[] | null }>({
    question,
    initial: { plug: {}, toks: null },
    derive: (w) => {
      if (!w.toks) return { note: "Plug an operator into every letter, then start the factory." };
      if (w.toks.length > 1) return { note: "Keep running operations until one number is left." };
      const v = Number(w.toks[0]);
      return { value: String(v), optionId: matchNumber(question, v, 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const letters = ["P", "R", "M", "S"];
  const ready = letters.every((l) => w.plug[l]);
  const nextIdx = (t: string[]) => {
    const md = t.findIndex((s) => s === "×" || s === "÷");
    return md >= 0 ? md : t.findIndex((s) => s === "+" || s === "−");
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Operator Factory"
      mission="Plug the operator each letter stands for into its socket. Start the factory, then tap the operation that must be done next — × and ÷ before + and −, left to right. Keep going until one number remains."
      icon={Factory}
      dim="2D"
      submitLabel="Submit the value"
      live={<Gauge label="Line" value={(w.toks ?? Q11_EXPR.map((t) => w.plug[t] ?? t)).join(" ")} tone="violet" />}
    >
      <div className="grid sm:grid-cols-4 gap-2">
        {letters.map((l) => (
          <Bay key={l} label={`letter ${l}`}>
            <div className="flex gap-1">
              {["×", "÷", "+", "−"].map((o) => (
                <Btn key={o} className="px-2 min-h-[34px]" active={w.plug[l] === o} tone={w.plug[l] === o ? "violet" : "slate"} disabled={play.readOnly || !!w.toks} onClick={() => play.patch({ plug: { ...w.plug, [l]: o } })} ariaLabel={`${l} as ${o}`}>{o}</Btn>
              ))}
            </div>
          </Bay>
        ))}
      </div>
      <Board className="mt-2">
        <div className="flex flex-wrap items-center gap-1 justify-center">
          {(w.toks ?? Q11_EXPR.map((t) => w.plug[t] ?? t)).map((t, i) =>
            w.toks && ["×", "÷", "+", "−"].includes(t) ? (
              <button key={i} type="button" disabled={play.readOnly} aria-label={`operation ${i}`} className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-black" onClick={() => {
                const t0 = w.toks!;
                if (nextIdx(t0) !== i) return setMsg("Not yet — × and ÷ come first, left to right.");
                setMsg(null);
                const v = f(t, Number(t0[i - 1]), Number(t0[i + 1]));
                play.patch({ toks: [...t0.slice(0, i - 1), String(+v.toFixed(6)), ...t0.slice(i + 2)] });
              }}>{t}</button>
            ) : (
              <span key={i} className="font-mono text-xl font-black text-indigo-900 px-1">{t}</span>
            )
          )}
        </div>
      </Board>
      {msg && <p className="text-xs font-bold text-rose-600">{msg}</p>}
      <div className="flex gap-2 mt-2">
        <Btn tone="emerald" disabled={play.readOnly || !ready || !!w.toks} onClick={() => play.patch({ toks: Q11_EXPR.map((t) => w.plug[t] ?? t) })}>▶ Start the factory</Btn>
        <Btn tone="slate" disabled={play.readOnly || !w.toks} onClick={() => play.patch({ toks: null })}>Stop and re-plug</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — Geometric Dot Laboratory
   The student places the two dots in a candidate figure; the scanner reports exactly which
   shapes each dot is inside. A candidate can be locked only when both dots satisfy
   Figure (X)'s conditions.
   ══════════════════════════════════════════════════════════════════════ */

interface Fig { c: [number, number, number]; s: [number, number, number]; t: Pt[] }
const Q12_FIGS: Record<string, Fig> = {
  A: { c: [35, 55, 16], s: [52, 50, 28], t: [[50, 10], [15, 85], [85, 85]] },
  B: { c: [50, 52, 12], s: [30, 30, 42], t: [[50, 15], [20, 82], [80, 82]] },
  C: { c: [20, 25, 14], s: [62, 60, 28], t: [[45, 40], [25, 90], [65, 90]] },
  D: { c: [45, 50, 20], s: [50, 32, 35], t: [[22, 8], [8, 40], [36, 40]] },
};
const inside = (g: Fig, [x, y]: Pt) => {
  const [[x1, y1], [x2, y2], [x3, y3]] = g.t;
  const d = (ax: number, ay: number, bx: number, by: number) => (bx - ax) * (y - ay) - (by - ay) * (x - ax);
  const a = d(x1, y1, x2, y2), b = d(x2, y2, x3, y3), c = d(x3, y3, x1, y1);
  return {
    circle: (x - g.c[0]) ** 2 + (y - g.c[1]) ** 2 <= g.c[2] ** 2,
    triangle: (a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0),
    square: x >= g.s[0] && x <= g.s[0] + g.s[2] && y >= g.s[1] && y <= g.s[1] + g.s[2],
  };
};
const RULES = [
  { dot: 1, want: { circle: true, triangle: true, square: false }, label: "circle and triangle only" },
  { dot: 2, want: { circle: false, triangle: true, square: true }, label: "triangle and square only" },
];

export function Q12GeometricDotLaboratoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [dot, setDot] = useState(1);
  const svg = React.useRef<SVGSVGElement>(null);
  const play = usePlay<{ fig: string; dots: Record<string, Record<number, Pt>>; locked: string | null }>({
    question,
    initial: { fig: "A", dots: {}, locked: null },
    derive: (w) => (!w.locked ? { note: "Place both dots correctly in a figure and lock it." } : { value: `Both dots fit in figure ${w.locked}`, optionId: w.locked }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const g = Q12_FIGS[w.fig];
  const here = w.dots[w.fig] ?? {};
  const ok = (r: (typeof RULES)[number]) => {
    const p = here[r.dot];
    if (!p) return false;
    const s = inside(g, p);
    return s.circle === r.want.circle && s.triangle === r.want.triangle && s.square === r.want.square;
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Geometric Dot Laboratory"
      mission="In Figure (X) one dot is inside the circle and the triangle only, and the other inside the triangle and the square only. Pick a candidate, choose a dot and tap where it goes. Lock the candidate where both dots can sit correctly."
      icon={CircleDot}
      dim="2D"
      submitLabel="Submit the figure"
      live={<>{RULES.map((r) => <Gauge key={r.dot} label={`Dot ${r.dot} (${r.label})`} value={ok(r) ? "✓" : "✗"} tone={ok(r) ? "emerald" : "slate"} />)}</>}
    >
      <div className="flex flex-wrap gap-1.5 mb-2">
        {Object.keys(Q12_FIGS).map((k) => <Btn key={k} active={w.fig === k} tone={w.fig === k ? "violet" : "slate"} onClick={() => play.patch({ fig: k, locked: null })}>Figure {k}</Btn>)}
        {RULES.map((r) => <Btn key={r.dot} active={dot === r.dot} tone={dot === r.dot ? "amber" : "slate"} onClick={() => setDot(r.dot)}>Dot {r.dot}</Btn>)}
      </div>
      <Board>
        <svg ref={svg} viewBox="0 0 100 100" className="w-full max-h-80" onClick={(e) => {
          if (play.readOnly) return;
          const q = clientToSvg(svg.current, e.clientX, e.clientY);
          if (!q) return;
          play.set((s) => ({ ...s, locked: null, dots: { ...s.dots, [s.fig]: { ...(s.dots[s.fig] ?? {}), [dot]: [Math.round(q.x), Math.round(q.y)] } } }));
        }}>
          <circle cx={g.c[0]} cy={g.c[1]} r={g.c[2]} fill="#38bdf833" stroke="#0284c7" strokeWidth={0.8} />
          <rect x={g.s[0]} y={g.s[1]} width={g.s[2]} height={g.s[2]} fill="#f59e0b22" stroke="#d97706" strokeWidth={0.8} />
          <path d={polyPath(g.t)} fill="#8b5cf622" stroke="#7c3aed" strokeWidth={0.8} />
          {Object.entries(here).map(([k, p]) => (
            <g key={k}>
              <circle cx={p[0]} cy={p[1]} r={2} fill={ok(RULES[Number(k) - 1]) ? "#10b981" : "#e11d48"} stroke="#fff" strokeWidth={0.5} />
              <text x={p[0] + 2.5} y={p[1] - 2} fontSize={4} fontWeight={900} fill="#1e1b4b">{k}</text>
            </g>
          ))}
        </svg>
      </Board>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !RULES.every(ok)} onClick={() => play.patch({ locked: w.fig })}>🔒 Lock figure {w.fig}</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — Dictionary Conveyor
   The student loads the word cards onto the conveyor in the order they would appear in a
   dictionary. The conveyor reads back their numbers in that order.
   ══════════════════════════════════════════════════════════════════════ */

export function Q13DictionaryConveyorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const words = cfg<string[]>(question, "words", []);
  const play = usePlay<{ belt: number[] }>({
    question,
    initial: { belt: [] },
    derive: (w) => {
      if (w.belt.length < words.length) return { note: "Load every word onto the conveyor." };
      const text = w.belt.map((i) => i + 1).join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const letterAt = (k: number) => {
    // the first letter position where the loaded neighbours differ, to show the student why
    if (k === 0) return -1;
    const a = words[w.belt[k - 1]], b = words[w.belt[k]];
    let i = 0;
    while (i < Math.min(a.length, b.length) && a[i].toLowerCase() === b[i].toLowerCase()) i++;
    return i;
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Dictionary Conveyor"
      mission="Tap the word cards in the order they appear in a dictionary. Compare letter by letter — the conveyor highlights the first letter where each word differs from the one before it."
      icon={BookA}
      dim="2D"
      submitLabel="Submit the order"
      live={<Gauge label="Order" value={w.belt.map((i) => i + 1).join(", ") || "—"} tone="violet" />}
    >
      <div className="flex flex-wrap gap-2">
        {words.map((wd, i) => (
          <Btn key={wd} tone={w.belt.includes(i) ? "emerald" : "slate"} disabled={play.readOnly || w.belt.includes(i)} onClick={() => play.patch({ belt: [...w.belt, i] })} ariaLabel={`word ${wd}`}>
            {i + 1}. {wd}
          </Btn>
        ))}
      </div>
      <Board className="mt-2">
        <div className="flex flex-wrap gap-2 min-h-[48px]">
          {w.belt.map((i, k) => {
            const d = letterAt(k);
            return (
              <span key={i} className="px-3 py-2 rounded-lg bg-white border border-indigo-200 font-mono text-lg font-black text-indigo-900">
                {words[i].split("").map((c, j) => <span key={j} className={j === d ? "bg-amber-200 rounded" : ""}>{c}</span>)}
                <sup className="text-[10px] text-slate-500 ml-1">{i + 1}</sup>
              </span>
            );
          })}
        </div>
      </Board>
      <Btn tone="slate" className="mt-2" disabled={play.readOnly || !w.belt.length} onClick={() => play.patch({ belt: [] })}>Empty the conveyor</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — Family Detective
   Person cards go into a family tree. When the clue in Amar's sentence lights up, the
   detective reads Amar's relation to the girl's mother from the tree.
   ══════════════════════════════════════════════════════════════════════ */

const PEOPLE = [
  { id: "Amar", g: "M" },
  { id: "Amar's mother", g: "F" },
  { id: "Girl's mother", g: "F" },
  { id: "Girl", g: "F" },
];
export function Q14FamilyDetectiveActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [held, setHeld] = useState<string | null>(null);
  const play = usePlay<{ at: Record<string, string> }>({
    question,
    initial: { at: {} },
    derive: (w) => {
      const lit = w.at["Amar's mother"] === "top" && ["c1", "c2"].includes(w.at["Amar"]) && ["c1", "c2"].includes(w.at["Girl's mother"]) && w.at["Girl"] === `${w.at["Girl's mother"]}k`;
      if (!lit) return { note: "Build the tree so the clue lights up." };
      return { value: "Amar and the girl's mother are children of the same mother", optionId: matchText(question, "Brother") };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const who = (s: string) => Object.keys(w.at).find((k) => w.at[k] === s);
  const place = (s: string) => {
    if (!held || play.readOnly) return;
    play.set((p) => {
      const at = { ...p.at };
      Object.keys(at).forEach((k) => at[k] === s && delete at[k]);
      at[held] = s;
      return { at };
    });
    setHeld(null);
  };
  const Slot = ({ s, label }: { s: string; label: string }) => (
    <button type="button" onClick={() => place(s)} aria-label={`slot ${label}`} className={`h-12 w-full rounded-xl border-2 text-xs font-black ${who(s) ? "bg-white border-indigo-400 text-indigo-900" : "border-dashed border-slate-300 text-slate-400"}`}>
      {who(s) ?? label}
    </button>
  );
  const lit = w.at["Amar's mother"] === "top" && ["c1", "c2"].includes(w.at["Amar"] ?? "") && ["c1", "c2"].includes(w.at["Girl's mother"] ?? "") && w.at["Girl"] === `${w.at["Girl's mother"]}k`;

  return (
    <Shell
      play={play}
      question={question}
      title="Family Detective"
      mission="“Her mother is the only daughter of my mother.” Tap a card, then a place in the tree: the top is a mother, the next row her children, and the bottom a child of the person above it. When the clue lights, read how Amar is related to the girl's mother."
      icon={Users}
      dim="2D"
      submitLabel="Submit the relation"
      live={<Gauge label="Clue" value={lit ? "lit" : "not yet"} tone={lit ? "emerald" : "slate"} />}
    >
      <div className="flex flex-wrap gap-1.5 mb-2">
        {PEOPLE.map((p) => <Btn key={p.id} active={held === p.id} tone={held === p.id ? "amber" : "slate"} disabled={play.readOnly} onClick={() => setHeld(p.id)} ariaLabel={`person ${p.id}`}>{p.g === "M" ? "👦" : "👩"} {p.id}</Btn>)}
      </div>
      <Board>
        <div className="max-w-sm mx-auto space-y-2">
          <Slot s="top" label="mother" />
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2"><Slot s="c1" label="child 1" /><Slot s="c1k" label="child of child 1" /></div>
            <div className="space-y-2"><Slot s="c2" label="child 2" /><Slot s="c2k" label="child of child 2" /></div>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — Matrix Laboratory
   Along each row the shaded sector turns a quarter turn clockwise, and the third column
   carries a cross. The student builds the missing cell — shape, shaded sector and cross —
   and the built cell is compared with the options.
   ══════════════════════════════════════════════════════════════════════ */

const SHAPES = ["circle", "square", "diamond"] as const;
const SECT = ["left", "top", "right", "bottom"] as const;
const Q15_STATES: Record<string, { shape: string; sector: string; cross: boolean }> = {
  A: { shape: "circle", sector: "top", cross: false },
  B: { shape: "square", sector: "bottom", cross: false },
  C: { shape: "diamond", sector: "right", cross: true },
  D: { shape: "circle", sector: "right", cross: true },
};
function Cell({ shape, sector, cross }: { shape: string | null; sector: string | null; cross: boolean }) {
  const clip = shape === "circle" ? <circle cx={20} cy={20} r={15} /> : shape === "square" ? <rect x={6} y={6} width={28} height={28} /> : <polygon points="20,4 36,20 20,36 4,20" />;
  const wedge: Record<string, string> = { left: "M20 20 L0 0 L0 40 Z", top: "M20 20 L0 0 L40 0 Z", right: "M20 20 L40 0 L40 40 Z", bottom: "M20 20 L0 40 L40 40 Z" };
  const id = `cl${shape}${sector}${cross}`;
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect width={40} height={40} fill="#fff" />
      {shape && (
        <>
          <defs><clipPath id={id}>{clip}</clipPath></defs>
          {sector && <path d={wedge[sector]} fill="#6366f1" clipPath={`url(#${id})`} />}
          {React.cloneElement(clip, { fill: "none", stroke: "#312e81", strokeWidth: 1.2 })}
          {cross && <path d="M14 20 H26 M20 14 V26" stroke="#e11d48" strokeWidth={1.4} />}
        </>
      )}
    </svg>
  );
}
export function Q15MatrixLaboratoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ shape: string | null; sector: string | null; cross: boolean; placed: boolean }>({
    question,
    initial: { shape: null, sector: null, cross: false, placed: false },
    derive: (w) => {
      if (!w.placed || !w.shape || !w.sector) return { note: "Build the missing cell and slot it in." };
      const opt = Object.keys(Q15_STATES).find((k) => Q15_STATES[k].shape === w.shape && Q15_STATES[k].sector === w.sector && Q15_STATES[k].cross === w.cross);
      return { value: `${w.shape}, ${w.sector} sector${w.cross ? ", cross" : ""}`, optionId: opt };
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
      title="Matrix Laboratory"
      mission="Study the rows and columns. Build the missing cell: pick its shape, the shaded sector and whether it carries the cross. Slot it into the matrix."
      icon={Grid3x3}
      dim="2D"
      submitLabel="Submit the cell"
      live={<Gauge label="Your cell" value={`${w.shape ?? "?"} · ${w.sector ?? "?"}${w.cross ? " · cross" : ""}`} tone="violet" />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-start">
        <div className="grid grid-cols-3 w-60 h-60 gap-0.5 bg-indigo-200 p-0.5 rounded-lg">
          {SHAPES.flatMap((sh, r) =>
            [0, 1, 2].map((c) =>
              r === 2 && c === 2 ? (
                <div key={`${r}${c}`} className="bg-amber-50 grid place-items-center">{w.placed ? <Cell shape={w.shape} sector={w.sector} cross={w.cross} /> : <span className="text-3xl text-amber-600 font-black">?</span>}</div>
              ) : (
                <Cell key={`${r}${c}`} shape={sh} sector={SECT[c]} cross={c === 2} />
              )
            )
          )}
        </div>
        <Bay label="Cell builder" tone="violet">
          <div className="flex flex-wrap gap-1 mb-1">{SHAPES.map((s) => <Btn key={s} className="px-2 min-h-[34px]" active={w.shape === s} tone={w.shape === s ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ shape: s, placed: false })}>{s}</Btn>)}</div>
          <div className="flex flex-wrap gap-1 mb-1">{SECT.map((s) => <Btn key={s} className="px-2 min-h-[34px]" active={w.sector === s} tone={w.sector === s ? "sky" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ sector: s, placed: false })} ariaLabel={`sector ${s}`}>shade {s}</Btn>)}</div>
          <Btn className="px-2 min-h-[34px]" active={w.cross} tone={w.cross ? "rose" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ cross: !w.cross, placed: false })}>✚ cross {w.cross ? "on" : "off"}</Btn>
          <div className="w-20 h-20 mt-2 border border-indigo-200 rounded"><Cell shape={w.shape} sector={w.sector} cross={w.cross} /></div>
          <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !w.shape || !w.sector} onClick={() => play.patch({ placed: true })}>Slot it in</Btn>
        </Bay>
      </div>
    </Shell>
  );
}

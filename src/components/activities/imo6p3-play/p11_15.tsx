"use client";

import React, { useMemo, useState } from "react";
import { Users, Shapes, Atom, ScanSearch, Dna } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q11–Q15. */

const A2Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — Family Tree Detective
   Person cards go into a two-generation tree. Each clue lights when the tree satisfies it;
   with every clue lit, Karan's relation to Atul is read off the tree.
   ══════════════════════════════════════════════════════════════════════ */

const TOP = ["T0", "T1", "T2"];

export function Q11FamilyTreeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const people = cfg<{ id: string; g: "M" | "F" }[]>(question, "people", []);
  const [held, setHeld] = useState<string | null>(null);
  type TreeWorld = { at: Record<string, string> };
  const parentOf = (w: TreeWorld, id: string) => {
    const s = w.at[id];
    return s && s.includes("c") ? Object.keys(w.at).find((p) => w.at[p] === s.slice(0, 2)) : undefined;
  };
  const top = (w: TreeWorld, id: string) => TOP.includes(w.at[id] ?? "");
  const clues = (w: TreeWorld) => [
    { text: "Karan is the brother of Vijay", ok: top(w, "Karan") && top(w, "Vijay") },
    { text: "Sneha is the daughter of Vijay", ok: parentOf(w, "Sneha") === "Vijay" },
    { text: "Bharti is the sister of Karan", ok: top(w, "Bharti") && top(w, "Karan") },
    { text: "Atul is the brother of Sneha", ok: !!parentOf(w, "Atul") && parentOf(w, "Atul") === parentOf(w, "Sneha") },
  ];
  const relation = (w: TreeWorld, a: string, b: string) => {
    if (parentOf(w, b) === a) return "Father";
    if (top(w, a) && top(w, b)) return "Brother";
    if (top(w, a) && parentOf(w, b) && parentOf(w, b) !== a) return "Uncle";
    if (parentOf(w, a) && parentOf(w, b)) return parentOf(w, a) === parentOf(w, b) ? "Brother" : "Cousin";
    return "—";
  };
  const play = usePlay<TreeWorld>({
    question,
    initial: { at: {} },
    derive: (w) => {
      const c = clues(w);
      if (!c.every((x) => x.ok)) return { note: `Build the tree so every clue lights (${c.filter((x) => x.ok).length}/${c.length}).` };
      const r = relation(w, "Karan", "Atul");
      return { value: `Karan is Atul's ${r.toLowerCase()}`, optionId: matchText(question, r) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const who = (slot: string) => Object.keys(w.at).find((p) => w.at[p] === slot);
  const place = (slot: string) => {
    if (!held || play.readOnly) return;
    play.set((p) => {
      const at = { ...p.at };
      Object.keys(at).forEach((k) => at[k] === slot && delete at[k]);
      at[held] = slot;
      return { at };
    });
    setHeld(null);
  };
  const Slot = ({ s, small }: { s: string; small?: boolean }) => {
    const p = who(s);
    const g = people.find((x) => x.id === p)?.g;
    return (
      <button type="button" onClick={() => place(s)} aria-label={`tree slot ${s}`} className={`rounded-xl border-2 ${small ? "h-10 text-xs" : "h-12 text-sm"} w-full font-black ${p ? (g === "M" ? "bg-sky-100 border-sky-400" : "bg-pink-100 border-pink-400") : held ? "border-dashed border-violet-400 bg-violet-50" : "border-dashed border-slate-300 bg-white"}`}>
        {p ?? "empty"}
      </button>
    );
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Family Tree Detective"
      mission="Tap a person card, then a place on the tree. The top row is one set of brothers and sisters; the two places under someone are that person's children. Build the tree until every clue lights, and read Karan's relation to Atul from it."
      icon={Users}
      dim="2D"
      submitLabel="Submit the relation"
      hints={["Karan, Vijay and Bharti are brothers and sister, so they share the top row.", "Sneha and Atul both belong under the same parent."]}
      live={<Gauge label="Karan → Atul" value={clues(w).every((c) => c.ok) ? relation(w, "Karan", "Atul") : "—"} tone="violet" />}
    >
      <div className="flex flex-wrap gap-1.5">
        {people.map((p) => (
          <Btn key={p.id} active={held === p.id} tone={held === p.id ? "amber" : "slate"} disabled={play.readOnly} onClick={() => setHeld(p.id)} ariaLabel={`person ${p.id}`}>
            {p.g === "M" ? "👦" : "👧"} {p.id}
          </Btn>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 rounded-2xl bg-amber-50 border-2 border-amber-200 p-3">
        {TOP.map((t) => (
          <div key={t} className="space-y-2">
            <Slot s={t} />
            <div className="h-3 border-l-2 border-amber-400 mx-auto w-0" />
            <div className="grid grid-cols-2 gap-1">
              <Slot s={`${t}c0`} small />
              <Slot s={`${t}c1`} small />
            </div>
          </div>
        ))}
      </div>
      <ul className="grid sm:grid-cols-2 gap-1">
        {clues(w).map((c) => (
          <li key={c.text} className={`text-xs font-bold rounded-lg px-2 py-1 ${c.ok ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
            {c.ok ? "✓" : "○"} {c.text}
          </li>
        ))}
      </ul>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — Shape Sorting Laboratory
   Tapping a figure runs the probe, which reports how it is built. The student sends each
   figure to one of three chambers; when every chamber holds three, the grouping is read.
   ══════════════════════════════════════════════════════════════════════ */

const FIGS: Record<string, { el: React.ReactNode; probe: string }> = {
  circleSquare: { el: <><circle cx={25} cy={21} r={17} /><rect x={17} y={13} width={16} height={16} /></>, probe: "outer circle, inner square" },
  squareQuarters: { el: <><rect x={10} y={6} width={30} height={30} /><path d="M 25 6 V 36 M 10 21 H 40" /></>, probe: "square cut into 4 parts" },
  diamondDiamond: { el: <><path d="M 25 3 L 43 21 L 25 39 L 7 21 Z" /><path d="M 25 13 L 33 21 L 25 29 L 17 21 Z" /></>, probe: "outer diamond, inner diamond" },
  triangleTriangle: { el: <><path d="M 25 4 L 44 38 L 6 38 Z" /><path d="M 25 18 L 34 33 L 16 33 Z" /></>, probe: "outer triangle, inner triangle" },
  rectQuarters: { el: <><rect x={5} y={10} width={40} height={22} /><path d="M 25 10 V 32 M 5 21 H 45" /></>, probe: "rectangle cut into 4 parts" },
  trapQuarters: { el: <><path d="M 14 5 L 36 5 L 42 37 L 8 37 Z" /><path d="M 25 5 V 37 M 11 21 H 39" /></>, probe: "trapezium cut into 4 parts" },
  squareTriangle: { el: <><rect x={8} y={4} width={34} height={34} /><path d="M 25 11 L 36 32 L 14 32 Z" /></>, probe: "outer square, inner triangle" },
  triangleCircle: { el: <><path d="M 25 3 L 45 39 L 5 39 Z" /><circle cx={25} cy={27} r={7} /></>, probe: "outer triangle, inner circle" },
  circleCircle: { el: <><circle cx={25} cy={21} r={17} /><circle cx={25} cy={21} r={8} /></>, probe: "outer circle, inner circle" },
};
const groupsKey = (groups: number[][]) => groups.map((g) => [...g].sort((a, b) => a - b).join(",")).sort().join(";");

export function Q12ShapeSorterActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figs = cfg<string[]>(question, "figures", []);
  const [held, setHeld] = useState<number | null>(null);
  const play = usePlay<{ ch: Record<number, number> }>({
    question,
    initial: { ch: {} },
    derive: (w) => {
      if (Object.keys(w.ch).length < figs.length) return { note: `Sort every figure (${Object.keys(w.ch).length}/${figs.length}).` };
      const groups = [0, 1, 2].map((g) => figs.map((_, i) => i + 1).filter((n) => w.ch[n - 1] === g));
      if (groups.some((g) => g.length !== 3)) return { note: "Each chamber takes exactly three figures." };
      const key = groupsKey(groups);
      const opt = question?.multipleChoiceConfig?.options.find((o) => groupsKey(o.text.split(";").map((g) => g.split(",").map((x) => Number(x.trim())))) === key)?.id;
      return { value: groups.map((g) => g.join(", ")).join("; "), optionId: opt };
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
      title="Shape Sorting Laboratory"
      mission="Tap a figure to probe it — the probe tells you how it is built. Then tap a chamber to send it there. Find the property that splits the nine figures into three chambers of three."
      icon={Shapes}
      dim="2D"
      submitLabel="Submit the three chambers"
      hints={["Some figures are one shape cut into parts; others are one shape inside another.", "For the figures with an inner shape, compare the inner shape with the outer one."]}
      live={<Gauge label="Probe" value={held !== null ? `${held + 1}: ${FIGS[figs[held]]?.probe}` : "tap a figure"} tone="sky" />}
    >
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
        {figs.map((f, i) => (
          <button key={i} type="button" disabled={play.readOnly} onClick={() => setHeld(i)} aria-label={`figure ${i + 1}`} className={`rounded-xl border-2 p-1 ${held === i ? "border-violet-600 ring-2 ring-violet-300 bg-white" : w.ch[i] !== undefined ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
            <svg viewBox="0 0 50 42" className="w-full" fill="none" stroke="#312e81" strokeWidth={1.6}>
              {FIGS[f]?.el}
            </svg>
            <div className="text-[10px] font-black">{i + 1}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((g) => (
          <button
            key={g}
            type="button"
            disabled={play.readOnly || held === null}
            onClick={() => {
              if (held === null) return;
              play.set((p) => ({ ch: { ...p.ch, [held]: g } }));
              setHeld(null);
            }}
            aria-label={`chamber ${g + 1}`}
            className="rounded-2xl border-4 border-sky-300 bg-sky-50 min-h-[90px] p-2 text-left"
          >
            <div className="text-[10px] font-black text-sky-800">CHAMBER {g + 1}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {figs.map((f, i) =>
                w.ch[i] === g ? (
                  <span key={i} className="w-9 rounded bg-white border">
                    <svg viewBox="0 0 50 42" fill="none" stroke="#4c1d95" strokeWidth={1.6}>
                      {FIGS[f]?.el}
                    </svg>
                    <span className="block text-center text-[9px] font-black">{i + 1}</span>
                  </span>
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — Number Reactor
   The student chooses how the reactor treats each outer number (as it is, squared,
   doubled) and whether it is added or taken away. When both solved triangles glow, the
   same rule is run on the third.
   ══════════════════════════════════════════════════════════════════════ */

type Tf = "x" | "sq" | "dbl";
const TF: Record<Tf, { label: string; f: (v: number) => number; show: (s: string) => string }> = {
  x: { label: "as is", f: (v) => v, show: (s) => s },
  sq: { label: "squared", f: (v) => v * v, show: (s) => `${s}²` },
  dbl: { label: "doubled", f: (v) => 2 * v, show: (s) => `2×${s}` },
};

export function Q13NumberReactorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const examples = cfg<{ a: number; b: number; c: number; out: number }[]>(question, "examples", []);
  const ask = cfg<{ a: number; b: number; c: number }>(question, "ask", { a: 0, b: 0, c: 0 });
  type RW = { tf: Tf[]; sign: number[] };
  const run = (w: RW, t: { a: number; b: number; c: number }) => [t.a, t.b, t.c].reduce((s, v, i) => s + w.sign[i] * TF[w.tf[i]].f(v), 0);
  const play = usePlay<RW>({
    question,
    initial: { tf: ["x", "x", "x"], sign: [1, 1, 1] },
    derive: (w) => {
      if (!examples.every((e) => run(w, e) === e.out)) return { note: "Find a rule that makes both solved triangles glow." };
      const v = run(w, ask);
      return { value: String(v), optionId: matchNumber(question, v) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const names = ["left side", "right side", "bottom"];
  const formula = ["a", "b", "c"].map((s, i) => `${w.sign[i] < 0 ? "−" : i ? "+" : ""} ${TF[w.tf[i]].show(s)}`).join(" ");
  const good = examples.every((e) => run(w, e) === e.out);

  return (
    <Shell
      play={play}
      question={question}
      title="Number Reactor"
      mission="Set how the reactor treats each outer number and whether it is added or taken away. When both solved triangles glow green, the reactor runs your rule on the third triangle."
      icon={Atom}
      dim="2D"
      submitLabel="Submit the reactor output"
      hints={["The answers on offer are large, so the rule probably squares some numbers.", "Try treating all three numbers the same way and changing only the signs."]}
      live={
        <>
          <Gauge label="Rule" value={formula} tone="violet" />
          <Gauge label="Third triangle" value={good ? run(w, ask) : "?"} tone="emerald" />
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {[...examples.map((e) => ({ ...e, out: e.out as number | null })), { ...ask, out: null }].map((t, k) => {
          const got = run(w, t);
          const ok = t.out !== null && got === t.out;
          return (
            <div key={k} className={`rounded-2xl p-2 text-center border-2 ${t.out === null ? "bg-amber-50 border-amber-300" : ok ? "bg-emerald-100 border-emerald-400" : "bg-white border-slate-200"}`}>
              <svg viewBox="0 0 60 54" className="w-full">
                <path d="M 30 6 L 54 44 L 6 44 Z" fill="none" stroke="#334155" strokeWidth={1} />
                <text x={10} y={24} fontSize={6} fontWeight={900}>{t.a}</text>
                <text x={46} y={24} fontSize={6} fontWeight={900}>{t.b}</text>
                <text x={30} y={52} fontSize={6} fontWeight={900} textAnchor="middle">{t.c}</text>
                <text x={30} y={34} fontSize={8} fontWeight={900} textAnchor="middle" fill={t.out === null ? "#b45309" : "#1e1b4b"}>
                  {t.out ?? "?"}
                </text>
              </svg>
              <div className="text-[11px] font-bold">
                {t.out === null ? "run →" : "reactor gives"} {got}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        {names.map((nm, i) => (
          <Bay key={nm} label={`${nm} number (${["a", "b", "c"][i]})`}>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(TF) as Tf[]).map((t) => (
                <Btn key={t} className="px-2 min-h-[34px]" active={w.tf[i] === t} tone={w.tf[i] === t ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, tf: p.tf.map((x, j) => (j === i ? t : x)) }))} ariaLabel={`${nm} ${TF[t].label}`}>
                  {TF[t].label}
                </Btn>
              ))}
              <Btn className="px-2 min-h-[34px]" tone={w.sign[i] < 0 ? "rose" : "emerald"} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, sign: p.sign.map((x, j) => (j === i ? -x : x)) }))} ariaLabel={`${nm} sign`}>
                {w.sign[i] < 0 ? "take away" : "add"}
              </Btn>
            </div>
          </Bay>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — Zig-zag Scanner
   Each option figure is drawn on a triangular grid. The student traces along the figure's
   lines by tapping grid points; a stroke is refused if it is not a real line. The figure
   can be confirmed only when the trace has exactly the given zig-zag's shape.
   ══════════════════════════════════════════════════════════════════════ */

type LP = [number, number]; // [row, k] with 0 ≤ k ≤ row ≤ 4
const LX = (p: LP) => 50 + (p[1] - p[0] / 2) * 20;
const LY = (p: LP) => 10 + p[0] * 17.32;
const STEP: Record<string, LP> = { DL: [1, 0], DR: [1, 1], R: [0, 1], UR: [-1, 0], UL: [-1, -1], L: [0, -1] };
const INVERSE: Record<string, string> = { DL: "UR", UR: "DL", DR: "UL", UL: "DR", R: "L", L: "R" };
const SIDES: [LP, LP][] = [[[0, 0], [4, 0]], [[0, 0], [4, 4]], [[4, 0], [4, 4]]];
const unitsOf = (a: LP, b: LP): string[] | null => {
  const dr = b[0] - a[0];
  const dk = b[1] - a[1];
  const n = Math.max(Math.abs(dr), Math.abs(dk));
  if (!n) return null;
  const u: LP = [dr / n, dk / n];
  const name = Object.keys(STEP).find((k) => STEP[k][0] === u[0] && STEP[k][1] === u[1]);
  return name ? Array(n).fill(name) : null;
};
const edgeSet = (segs: [LP, LP][]) => {
  const out = new Set<string>();
  segs.forEach(([a, b]) => {
    const u = unitsOf(a, b);
    if (!u) return;
    let p = a;
    u.forEach((s) => {
      const q: LP = [p[0] + STEP[s][0], p[1] + STEP[s][1]];
      out.add(`${p}|${q}`);
      out.add(`${q}|${p}`);
      p = q;
    });
  });
  return out;
};

export function Q14ZigzagScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const target = cfg<string[]>(question, "target", []);
  const figures = cfg<Record<string, { lattice: [LP, LP][]; extra: [number, number][][] }>>(question, "figures", {});
  const edges = useMemo(() => Object.fromEntries(Object.entries(figures).map(([k, f]) => [k, edgeSet([...SIDES, ...f.lattice])])), [figures]);
  const back = useMemo(() => [...target].reverse().map((s) => INVERSE[s]), [target]);
  const check = (fig: string, tr: LP[]) => {
    const units: string[] = [];
    let valid = true;
    for (let i = 1; i < tr.length; i++) {
      const u = unitsOf(tr[i - 1], tr[i]);
      if (!u) {
        valid = false;
        break;
      }
      let p = tr[i - 1];
      for (const s of u) {
        const q: LP = [p[0] + STEP[s][0], p[1] + STEP[s][1]];
        if (!edges[fig]?.has(`${p}|${q}`)) valid = false;
        p = q;
      }
      units.push(...u);
    }
    const same = (a: string[]) => a.length === units.length && a.every((s, i) => s === units[i]);
    return { valid, shape: valid && (same(target) || same(back)) };
  };
  const play = usePlay<{ fig: string; trace: LP[]; found: string | null }>({
    question,
    initial: { fig: "A", trace: [], found: null },
    derive: (w) => (!w.found ? { note: "Trace the zig-zag inside a figure and confirm it." } : { value: `Zig-zag traced in figure ${w.found}`, optionId: w.found }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const c = check(w.fig, w.trace);
  const f = figures[w.fig];
  const points: LP[] = [];
  for (let r = 0; r <= 4; r++) for (let k = 0; k <= r; k++) points.push([r, k]);
  const targetPts = target.reduce<[number, number][]>((acc, s) => {
    const [x, y] = acc[acc.length - 1];
    const d = { DL: [-10, 17.32], DR: [10, 17.32], R: [20, 0], UR: [10, -17.32], UL: [-10, -17.32], L: [-20, 0] }[s] as [number, number];
    return [...acc, [x + d[0], y + d[1]]];
  }, [[30, 5]]);

  return (
    <Shell
      play={play}
      question={question}
      title="Zig-zag Scanner"
      mission="Pick a figure and trace along its lines by tapping grid points one after another. The scanner rejects a stroke that is not a real line. Confirm the figure where your trace has exactly the shape of the given zig-zag."
      icon={ScanSearch}
      dim="2D"
      submitLabel="Submit the figure"
      hints={["The zig-zag's first two strokes are long: look for a long horizontal line that meets a side of the big triangle.", "The last three strokes are short: you need a small slanting line near a bottom corner."]}
      live={
        <>
          <Gauge label="Trace" value={`${Math.max(0, w.trace.length - 1)} strokes`} tone="violet" />
          <Gauge label="On real lines?" value={c.valid ? "yes" : "no"} tone={c.valid ? "emerald" : "rose"} />
          <Gauge label="Zig-zag shape?" value={c.shape ? "exact" : "not yet"} tone={c.shape ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {Object.keys(figures).map((id) => (
          <Btn key={id} active={w.fig === id} tone={w.fig === id ? "violet" : "slate"} onClick={() => play.set((p) => ({ ...p, fig: id, trace: [] }))}>
            Figure {id}
          </Btn>
        ))}
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-start">
        <Bay label="Given figure">
          <svg viewBox="0 0 90 90" className="w-28">
            <polyline points={targetPts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#7c3aed" strokeWidth={2} strokeLinejoin="round" />
          </svg>
        </Bay>
        <Board>
          <svg viewBox="0 0 100 90" className="w-full max-h-80">
            {f && (
              <>
                {[...SIDES, ...f.lattice].map(([a, b], i) => (
                  <line key={i} x1={LX(a)} y1={LY(a)} x2={LX(b)} y2={LY(b)} stroke="#1e293b" strokeWidth={0.9} />
                ))}
                {f.extra.map((pts, i) => (
                  <polyline key={`e${i}`} points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#1e293b" strokeWidth={0.9} />
                ))}
              </>
            )}
            <polyline points={w.trace.map((p) => `${LX(p)},${LY(p)}`).join(" ")} fill="none" stroke={c.valid ? (c.shape ? "#10b981" : "#8b5cf6") : "#f43f5e"} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p) => (
              <circle key={`${p}`} cx={LX(p)} cy={LY(p)} r={2.6} fill={w.trace.some((t) => t[0] === p[0] && t[1] === p[1]) ? "#f59e0b" : "#cbd5e1"} stroke="#475569" strokeWidth={0.4} role="button" aria-label={`point ${p[0]},${p[1]}`} style={{ cursor: "pointer" }} onClick={() => !play.readOnly && play.set((s) => ({ ...s, found: null, trace: [...s.trace, p] }))} />
            ))}
          </svg>
        </Board>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn tone="slate" disabled={play.readOnly || !w.trace.length} onClick={() => play.patch({ trace: [] })}>
          Clear trace
        </Btn>
        <Btn tone="emerald" disabled={play.readOnly || !c.shape} onClick={() => play.patch({ found: w.fig })}>
          Confirm: embedded in figure {w.fig}
        </Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — Alphabet DNA Analyzer
   Each word goes into the analysis chamber, which marks its letters on the alphabet strand
   and measures the jumps. After all four are analysed the student flags the odd word.
   ══════════════════════════════════════════════════════════════════════ */

export function Q15DnaAnalyzerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const words = (question?.multipleChoiceConfig?.options ?? []).map((o) => o.text);
  const jumps = (wd: string) => wd.split("").slice(1).map((c, i) => A2Z.indexOf(c) - A2Z.indexOf(wd[i]));
  const play = usePlay<{ analysed: string[]; open: string | null; flagged: string | null }>({
    question,
    initial: { analysed: [], open: null, flagged: null },
    derive: (w) => {
      if (w.analysed.length < words.length) return { note: `Analyse every word (${w.analysed.length}/${words.length}).` };
      if (!w.flagged) return { note: "Flag the word whose pattern is different." };
      return { value: `${w.flagged} is the odd one`, optionId: matchText(question, w.flagged) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const open = w.open;

  return (
    <Shell
      play={play}
      question={question}
      title="Alphabet DNA Analyzer"
      mission="Put each word into the analysis chamber. It marks the letters on the alphabet strand and measures every jump. When all four are analysed, flag the word whose jumps follow a different pattern."
      icon={Dna}
      dim="2D"
      submitLabel="Submit the odd word"
      hints={["Write down the three jumps of every word and compare them."]}
      live={<Gauge label="Analysed" value={w.analysed.map((x) => `${x} ${jumps(x).map((j) => `+${j}`).join(" ")}`).join(" · ") || "none"} tone="violet" />}
    >
      <div className="flex flex-wrap gap-1.5">
        {words.map((wd) => (
          <Btn key={wd} active={open === wd} tone={open === wd ? "violet" : w.analysed.includes(wd) ? "emerald" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, open: wd, analysed: p.analysed.includes(wd) ? p.analysed : [...p.analysed, wd] }))} ariaLabel={`analyse ${wd}`}>
            {wd}
          </Btn>
        ))}
      </div>
      <Board>
        <svg viewBox="0 0 270 60" className="w-full">
          {A2Z.split("").map((ch, i) => (
            <text key={ch} x={8 + i * 10} y={50} fontSize={6} textAnchor="middle" fill={open?.includes(ch) ? "#b45309" : "#94a3b8"} fontWeight={900}>
              {ch}
            </text>
          ))}
          {open &&
            open.split("").slice(1).map((ch, i) => {
              const a = 8 + A2Z.indexOf(open[i]) * 10;
              const b = 8 + A2Z.indexOf(ch) * 10;
              return (
                <g key={i}>
                  <path d={`M ${a} 42 Q ${(a + b) / 2} ${22 - i * 4} ${b} 42`} fill="none" stroke="#7c3aed" strokeWidth={1.2} />
                  <text x={(a + b) / 2} y={28 - i * 4} fontSize={7} fill="#4c1d95" textAnchor="middle" fontWeight={900}>
                    +{A2Z.indexOf(ch) - A2Z.indexOf(open[i])}
                  </text>
                </g>
              );
            })}
        </svg>
      </Board>
      <div className="flex flex-wrap gap-1.5">
        {words.map((wd) => (
          <Btn key={wd} tone={w.flagged === wd ? "rose" : "slate"} active={w.flagged === wd} disabled={play.readOnly || w.analysed.length < words.length} onClick={() => play.patch({ flagged: wd })} ariaLabel={`flag ${wd}`}>
            🚩 {wd}
          </Btn>
        ))}
      </div>
    </Shell>
  );
}

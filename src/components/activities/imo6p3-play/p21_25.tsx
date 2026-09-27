"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, ChartPie, SpellCheck, Compass, MoveHorizontal } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumberList, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, Pt, polyPath, toggle } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — Triangular Prism Inspector
   The prism is drawn with its hidden edges dashed. The student switches between counting
   faces, corners and edges and taps each one to tag it. The three tallies are the answer.
   ══════════════════════════════════════════════════════════════════════ */

const V: Pt[] = [[15, 75], [60, 75], [37, 38], [50, 55], [95, 55], [72, 18]]; // front triangle 0-1-2, back 3-4-5 (drawn up and to the right)
const EDGES: [number, number, boolean][] = [[0, 1, false], [1, 2, false], [2, 0, false], [3, 4, true], [4, 5, false], [5, 3, true], [0, 3, true], [1, 4, false], [2, 5, false]];
const FACES: { pts: number[]; hidden: boolean }[] = [
  { pts: [0, 1, 2], hidden: false },
  { pts: [3, 4, 5], hidden: true },
  { pts: [0, 1, 4, 3], hidden: true },
  { pts: [1, 2, 5, 4], hidden: false },
  { pts: [2, 0, 3, 5], hidden: false },
];
export function Q21TriangularPrismActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [mode, setMode] = useState<"faces" | "verts" | "edges">("faces");
  const [xray, setXray] = useState(false);
  const play = usePlay<{ faces: number[]; verts: number[]; edges: number[] }>({
    question,
    initial: { faces: [], verts: [], edges: [] },
    derive: (w) =>
      !w.faces.length || !w.verts.length || !w.edges.length
        ? { note: "Tag the faces, the corners and the edges." }
        : { value: `${w.faces.length} faces, ${w.verts.length} vertices, ${w.edges.length} edges`, optionId: matchNumberList(question, [w.faces.length, w.verts.length, w.edges.length]) },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const tag = (k: "faces" | "verts" | "edges", i: number) => !play.readOnly && play.set((p) => ({ ...p, [k]: toggle(p[k], i) }));

  return (
    <Shell
      play={play}
      question={question}
      title="Triangular Prism Inspector"
      mission="Switch on X-ray to see the hidden back of the prism. Choose what to count, then tap each face, corner or edge once to tag it. Tag them all."
      icon={Box}
      dim="2D"
      submitLabel="Submit P, Q and R"
      live={<><Gauge label="Faces (P)" value={w.faces.length} tone={mode === "faces" ? "violet" : "slate"} /><Gauge label="Vertices (Q)" value={w.verts.length} tone={mode === "verts" ? "violet" : "slate"} /><Gauge label="Edges (R)" value={w.edges.length} tone={mode === "edges" ? "violet" : "slate"} /></>}
    >
      <Board>
        <svg viewBox="0 0 120 80" className="w-full max-h-72">
          {FACES.map((f, i) =>
            f.hidden && !xray ? null : (
              <path key={i} d={polyPath(f.pts.map((k) => V[k]))} fill={w.faces.includes(i) ? "#a78bfa" : "#eef2ff"} fillOpacity={f.hidden ? 0.5 : 0.85} stroke="none" role="button" aria-label={`face ${i + 1}`} style={{ cursor: mode === "faces" ? "pointer" : "default" }} onClick={() => mode === "faces" && tag("faces", i)} />
            )
          )}
          {EDGES.map(([a, b, hid], i) => (
            <line key={i} x1={V[a][0]} y1={V[a][1]} x2={V[b][0]} y2={V[b][1]} stroke={w.edges.includes(i) ? "#f59e0b" : "#312e81"} strokeWidth={mode === "edges" ? 2.4 : 1.2} strokeDasharray={hid ? "2 1.5" : undefined} role="button" aria-label={`edge ${i + 1}`} style={{ cursor: mode === "edges" ? "pointer" : "default" }} onClick={() => mode === "edges" && tag("edges", i)} />
          ))}
          {V.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={mode === "verts" ? 3 : 1.6} fill={w.verts.includes(i) ? "#e11d48" : "#312e81"} role="button" aria-label={`vertex ${i + 1}`} style={{ cursor: mode === "verts" ? "pointer" : "default" }} onClick={() => mode === "verts" && tag("verts", i)} />)}
        </svg>
      </Board>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {(["faces", "verts", "edges"] as const).map((m) => <Btn key={m} active={mode === m} tone={mode === m ? "violet" : "slate"} onClick={() => setMode(m)}>Count {m === "verts" ? "vertices" : m}</Btn>)}
        <Btn active={xray} tone={xray ? "sky" : "slate"} onClick={() => setXray(!xray)}>🩻 X-ray {xray ? "on" : "off"}</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — Fraction Sorting Table
   Each figure goes under the counter: the student taps every region to count it and the
   counter reads the shaded fraction. Counted figures are placed on the sorting table from
   least shaded to most shaded.
   ══════════════════════════════════════════════════════════════════════ */

const Q22_FIGS: Record<string, { parts: number; shaded: number[] }> = { P: { parts: 8, shaded: [0, 3, 6] }, Q: { parts: 4, shaded: [0, 2] }, R: { parts: 8, shaded: [0, 1, 3, 5, 6] }, S: { parts: 4, shaded: [0, 1, 3] } };
export function Q22FractionSortingTableActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [open, setOpen] = useState("P");
  const play = usePlay<{ counted: Record<string, number[]>; table: string[] }>({
    question,
    initial: { counted: {}, table: [] },
    derive: (w) => {
      if (w.table.length < 4) return { note: "Count every figure and place all four on the table." };
      const text = w.table.join(" < ");
      return { value: text, optionId: question?.multipleChoiceConfig?.options.find((o) => o.text.replace(/\s/g, "") === text.replace(/\s/g, ""))?.id };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const f = Q22_FIGS[open];
  const c = w.counted[open] ?? [];
  const done = (k: string) => (w.counted[k] ?? []).length === Q22_FIGS[k].parts;
  const frac = (k: string) => `${(w.counted[k] ?? []).filter((i) => Q22_FIGS[k].shaded.includes(i)).length}/${(w.counted[k] ?? []).length}`;
  const sector = (i: number, n: number) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    return `M 50 50 L ${50 + 40 * Math.cos(a0)} ${50 + 40 * Math.sin(a0)} A 40 40 0 0 1 ${50 + 40 * Math.cos(a1)} ${50 + 40 * Math.sin(a1)} Z`;
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Fraction Sorting Table"
      mission="Put a figure under the counter and tap every region once to count it — the counter reads shaded regions over all regions. Place counted figures on the table from the least shaded to the most shaded."
      icon={ChartPie}
      dim="2D"
      submitLabel="Submit the order"
      live={<><Gauge label={`Figure ${open}`} value={frac(open)} tone="violet" /><Gauge label="Table" value={w.table.join(" < ") || "empty"} tone="amber" /></>}
    >
      <div className="flex gap-1.5 mb-2">{Object.keys(Q22_FIGS).map((k) => <Btn key={k} active={open === k} tone={open === k ? "violet" : done(k) ? "emerald" : "slate"} onClick={() => setOpen(k)}>Figure {k}</Btn>)}</div>
      <div className="grid md:grid-cols-2 gap-3">
        <Board>
          <svg viewBox="0 0 100 100" className="w-full max-h-60">
            {Array.from({ length: f.parts }, (_, i) => <path key={i} d={sector(i, f.parts)} fill={f.shaded.includes(i) ? "#6366f1" : "#fff"} stroke={c.includes(i) ? "#f59e0b" : "#312e81"} strokeWidth={c.includes(i) ? 2 : 0.8} role="button" aria-label={`region ${i + 1}`} style={{ cursor: "pointer" }} onClick={() => !play.readOnly && play.set((p) => ({ table: p.table.filter((x) => x !== open), counted: { ...p.counted, [open]: toggle(p.counted[open] ?? [], i) } }))} />)}
          </svg>
        </Board>
        <Bay label="Sorting table (least → most shaded)" tone="violet">
          <div className="flex gap-1 min-h-[48px]">{w.table.map((k) => <span key={k} className="w-12 h-12 rounded-lg bg-amber-100 border border-amber-300 grid place-items-center font-black text-indigo-900">{k}<span className="text-[9px]">{frac(k)}</span></span>)}</div>
          <div className="flex gap-1.5 mt-2">
            <Btn tone="emerald" disabled={play.readOnly || !done(open) || w.table.includes(open)} onClick={() => play.patch({ table: [...w.table, open] })}>Place figure {open}</Btn>
            <Btn tone="slate" disabled={play.readOnly || !w.table.length} onClick={() => play.patch({ table: [] })}>Clear table</Btn>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — Decimal Translation Machine
   For each word name the student builds the number on a place-value board, digit by
   digit. The machine compares the built number with the printed one. After all four are
   built, the one printed correctly is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const COLS = ["tens", "ones", "tenths", "hundredths", "thousandths"];
const W_ = [10, 1, 0.1, 0.01, 0.001];
export function Q23DecimalMatchActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const rows = (question?.multipleChoiceConfig?.options ?? []).map((o) => {
    const [name, num] = o.text.split("→").map((s) => s.trim());
    return { id: o.id, name, num: Number(num) };
  });
  const play = usePlay<{ d: Record<string, number[]>; built: string[] }>({
    question,
    initial: { d: {}, built: [] },
    derive: (w) => {
      if (w.built.length < rows.length) return { note: "Build every word name on the board." };
      const hits = rows.filter((r) => Math.abs(val(w, r.id) - r.num) < 1e-9);
      if (hits.length !== 1) return { note: hits.length ? "More than one row matched." : "No row matched its printed number." };
      return { value: `${hits[0].name} = ${hits[0].num}`, optionId: hits[0].id };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  function val(w: { d: Record<string, number[]> }, id: string) {
    return Math.round((w.d[id] ?? [0, 0, 0, 0, 0]).reduce((s, x, i) => s + x * W_[i], 0) * 1000) / 1000;
  }
  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="Decimal Translation Machine"
      mission="For each word name, set the digits in the place-value columns (tens, ones · tenths, hundredths, thousandths) and build it. The machine compares your number with the printed one."
      icon={SpellCheck}
      dim="2D"
      submitLabel="Submit the correct match"
      live={<Gauge label="Built" value={w.built.map((id) => `${id}: ${val(w, id)}`).join("  ") || "—"} tone="violet" />}
    >
      <div className="space-y-2">
        {rows.map((r) => {
          const d = w.d[r.id] ?? [0, 0, 0, 0, 0];
          return (
            <Bay key={r.id} label={`${r.id} · “${r.name}” printed as ${r.num}`}>
              <div className="flex flex-wrap items-end gap-1">
                {COLS.map((c, i) => (
                  <div key={c} className={`text-center ${i === 2 ? "border-l-4 border-l-rose-300 pl-1" : ""}`}>
                    <div className="text-[9px] font-black text-slate-500">{c}</div>
                    <button type="button" disabled={play.readOnly} aria-label={`${r.id} ${c}`} onClick={() => play.set((p) => ({ built: p.built.filter((x) => x !== r.id), d: { ...p.d, [r.id]: d.map((x, j) => (j === i ? (x + 1) % 10 : x)) } }))} className="w-9 h-10 rounded bg-white border border-indigo-200 font-mono text-xl font-black text-indigo-900">{d[i]}</button>
                  </div>
                ))}
                <span className="font-mono font-black ml-2 text-indigo-700">= {val(w, r.id)}</span>
                <Btn className="ml-auto px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly || w.built.includes(r.id)} onClick={() => play.patch({ built: [...w.built, r.id] })} ariaLabel={`build ${r.id}`}>Build</Btn>
              </div>
            </Bay>
          );
        })}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — Angle Observatory
   The protractor arm starts on OA. For each angle the student swings the arm onto the
   other ray and records the reading; the observatory names the angle from the reading.
   The four names make the matching.
   ══════════════════════════════════════════════════════════════════════ */

const RAYS: Record<string, number> = { A: 0, B: 40, C: 90, E: 130, D: 220 };
const Q24_ANGLES = [
  { k: "P", name: "∠AOB", from: "A", to: "B" },
  { k: "Q", name: "∠AOC", from: "A", to: "C" },
  { k: "R", name: "∠AOE", from: "A", to: "E" },
  { k: "S", name: "∠BOD", from: "B", to: "D" },
];
const kindOf = (deg: number) => (deg === 90 ? "(i)" : deg < 90 ? "(ii)" : deg === 180 ? "(iii)" : "(iv)");
export function Q24AngleMatchingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [sel, setSel] = useState(0);
  const play = usePlay<{ arm: number; rec: Record<string, number> }>({
    question,
    initial: { arm: 0, rec: {} },
    derive: (w) => {
      if (Q24_ANGLES.some((a) => w.rec[a.k] === undefined)) return { note: "Measure all four angles." };
      const text = Q24_ANGLES.map((a) => `(${a.k})→${kindOf(w.rec[a.k])}`).join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const a = Q24_ANGLES[sel];
  const base = RAYS[a.from];
  const on = Object.entries(RAYS).find(([, d]) => d === (base + w.arm) % 360)?.[0];
  const ray = (deg: number, r = 40): Pt => [60 + r * Math.cos((deg * Math.PI) / 180), 50 - r * Math.sin((deg * Math.PI) / 180)];

  return (
    <Shell
      play={play}
      question={question}
      title="Angle Observatory"
      mission="Pick an angle. The protractor arm starts on its first ray; swing it round until it lies on the second ray, then record the reading. The observatory names each angle from its measure."
      icon={Compass}
      dim="2D"
      submitLabel="Submit the matching"
      live={<><Gauge label={a.name} value={`${w.arm}° · arm on ${on ? `O${on}` : "—"}`} tone="violet" /><Gauge label="Recorded" value={Q24_ANGLES.map((x) => `${x.k}:${w.rec[x.k] ?? "—"}`).join(" ")} /></>}
    >
      <div className="flex flex-wrap gap-1.5 mb-2">{Q24_ANGLES.map((x, i) => <Btn key={x.k} active={sel === i} tone={sel === i ? "violet" : w.rec[x.k] !== undefined ? "emerald" : "slate"} onClick={() => { setSel(i); play.patch({ arm: 0 }); }}>({x.k}) {x.name}</Btn>)}</div>
      <Board>
        <svg viewBox="0 0 120 100" className="w-full max-h-64">
          {Object.entries(RAYS).map(([k, d]) => { const [x, y] = ray(d); const [tx, ty] = ray(d, 46); return <g key={k}><line x1={60} y1={50} x2={x} y2={y} stroke="#312e81" strokeWidth={1} /><text x={tx} y={ty + 2} fontSize={5} fontWeight={900} textAnchor="middle">{k}</text></g>; })}
          <motion.line x1={60} y1={50} animate={{ x2: ray(base + w.arm, 36)[0], y2: ray(base + w.arm, 36)[1] }} stroke="#f59e0b" strokeWidth={2.4} />
          <text x={63} y={57} fontSize={4} fontWeight={900}>O</text>
        </svg>
      </Board>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {[-10, 10, 45].map((d) => <Btn key={d} tone="slate" disabled={play.readOnly} onClick={() => play.patch({ arm: Math.max(0, Math.min(350, w.arm + d)) })}>{d > 0 ? `+${d}°` : `${d}°`}</Btn>)}
        <Btn tone="emerald" disabled={play.readOnly || on !== a.to} onClick={() => play.patch({ rec: { ...w.rec, [a.k]: w.arm } })}>{on === a.to ? `Record ${a.name} = ${w.arm}°` : "Swing the arm onto the second ray"}</Btn>
      </div>
      <p className="text-[11px] text-slate-600 mt-1">Column II: (i) right angle · (ii) acute angle · (iii) straight angle · (iv) obtuse angle</p>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — Number Line Runner
   The runner stands on the number line. The student places the start marker and makes one
   jump; the jump arrow is drawn on the line. The start and jump are compared with the four
   printed number lines.
   ══════════════════════════════════════════════════════════════════════ */

const Q25_STATES: Record<string, { start: number; jump: number }> = { A: { start: 0, jump: -5 }, B: { start: 8, jump: -5 }, C: { start: -5, jump: 8 }, D: { start: 3, jump: 8 } };
export function Q25NumberLineAdditionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ start: number; jump: number; jumped: boolean }>({
    question,
    initial: { start: 0, jump: 0, jumped: false },
    derive: (w) => {
      if (!w.jumped) return { note: "Place the start marker and make the jump." };
      const opt = Object.keys(Q25_STATES).find((k) => Q25_STATES[k].start === w.start && Q25_STATES[k].jump === w.jump);
      return { value: `Start ${w.start}, jump ${w.jump > 0 ? "+" : ""}${w.jump}, land on ${w.start + w.jump}`, optionId: opt };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const X = (n: number) => 8 + (n + 8) * 6;

  return (
    <Shell
      play={play}
      question={question}
      title="Number Line Runner"
      mission="(−5) + 8: place the runner where the sum starts, set how far and which way to jump, and make the jump. The arrow is drawn on the line."
      icon={MoveHorizontal}
      dim="2D"
      submitLabel="Submit the number line"
      live={<Gauge label="Run" value={`${w.start} ${w.jump >= 0 ? "+" : "−"} ${Math.abs(w.jump)} = ${w.start + w.jump}`} tone="violet" />}
    >
      <Board>
        <svg viewBox="0 0 112 40" className="w-full">
          <line x1={4} x2={108} y1={28} y2={28} stroke="#312e81" strokeWidth={0.8} />
          {Array.from({ length: 17 }, (_, i) => i - 8).map((n) => <g key={n}><line x1={X(n)} x2={X(n)} y1={26} y2={30} stroke="#312e81" strokeWidth={0.5} /><text x={X(n)} y={36} fontSize={3.2} textAnchor="middle">{n}</text></g>)}
          {w.jumped && <path d={`M ${X(w.start)} 26 Q ${(X(w.start) + X(w.start + w.jump)) / 2} ${6} ${X(w.start + w.jump)} 26`} fill="none" stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#q25a)" />}
          <defs><marker id="q25a" markerWidth={4} markerHeight={4} refX={2} refY={2} orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#f59e0b" /></marker></defs>
          <motion.text animate={{ x: X(w.jumped ? w.start + w.jump : w.start) }} y={22} fontSize={6} textAnchor="middle">🏃</motion.text>
        </svg>
      </Board>
      <div className="flex flex-wrap gap-4 mt-2">
        <Stepper label="Start" value={w.start} min={-8} max={8} disabled={play.readOnly} onStep={(d) => play.patch({ start: w.start + d, jumped: false })} />
        <Stepper label="Jump" value={w.jump} min={-10} max={10} disabled={play.readOnly} onStep={(d) => play.patch({ jump: w.jump + d, jumped: false })} />
        <Btn tone="emerald" disabled={play.readOnly || !w.jump} onClick={() => play.patch({ jumped: true })}>Jump!</Btn>
      </div>
    </Shell>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ScanSearch, Languages, BrickWall, FoldHorizontal, Compass } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Pt } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — Shape X-Ray Scanner
   Each candidate figure sits on a dot lattice. The student traces Figure (X) inside it by
   tapping dots in turn; every stroke must be a real line of the candidate. When the trace
   has exactly the shape of Figure (X), the scanner confirms the candidate.
   ══════════════════════════════════════════════════════════════════════ */

type Seg = [Pt, Pt];
const Q6_TARGET: Pt[] = [[1, 0], [1, 1], [-1, 1], [-1, 0], [0, -1], [0, -1]]; // a closed "house" pentagon, stroke by stroke
const Q6_FIGS: Record<string, Seg[]> = {
  A: [[[1, 1], [2, 1]], [[2, 1], [3, 2]], [[3, 2], [2, 3]], [[2, 3], [1, 3]], [[1, 3], [1, 1]], [[0, 0], [4, 0]], [[0, 0], [0, 4]], [[0, 4], [4, 4]], [[4, 0], [4, 4]], [[3, 2], [4, 2]]],
  B: [[[1, 1], [2, 1]], [[2, 1], [1, 2]], [[1, 2], [2, 3]], [[1, 1], [1, 3]], [[0, 0], [4, 0]], [[0, 0], [0, 4]], [[0, 4], [4, 4]], [[4, 0], [4, 4]]],
  C: [[[2, 1], [3, 1]], [[3, 1], [3, 3]], [[3, 3], [2, 3]], [[2, 3], [1, 2]], [[1, 2], [2, 1]], [[0, 0], [4, 0]], [[0, 0], [0, 4]], [[0, 4], [4, 4]], [[4, 0], [4, 4]]],
  D: [[[1, 1], [3, 1]], [[3, 1], [3, 3]], [[3, 3], [1, 3]], [[1, 3], [1, 1]], [[1, 1], [3, 3]], [[0, 0], [4, 0]], [[0, 0], [0, 4]], [[0, 4], [4, 4]], [[4, 0], [4, 4]]],
};
const unitEdges = (segs: Seg[]) => {
  const out = new Set<string>();
  segs.forEach(([a, b]) => {
    const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    const dx = Math.sign(b[0] - a[0]);
    const dy = Math.sign(b[1] - a[1]);
    for (let i = 0; i < n; i++) {
      const p = [a[0] + dx * i, a[1] + dy * i];
      const q = [p[0] + dx, p[1] + dy];
      out.add(`${p}|${q}`);
      out.add(`${q}|${p}`);
    }
  });
  return out;
};

export function Q06ShapeXRayScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const edges = useMemo(() => Object.fromEntries(Object.entries(Q6_FIGS).map(([k, s]) => [k, unitEdges(s)])), []);
  const play = usePlay<{ fig: string; trace: Pt[]; found: string | null }>({
    question,
    initial: { fig: "A", trace: [], found: null },
    derive: (w) => (!w.found ? { note: "Trace Figure (X) inside a candidate and confirm it." } : { value: `Figure (X) traced in figure ${w.found}`, optionId: w.found }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const steps = w.trace.slice(1).map((p, i) => [p[0] - w.trace[i][0], p[1] - w.trace[i][1]]);
  const valid = w.trace.slice(1).every((p, i) => edges[w.fig].has(`${w.trace[i]}|${p}`));
  const exact = valid && steps.length === Q6_TARGET.length && steps.every((s, i) => s[0] === Q6_TARGET[i][0] && s[1] === Q6_TARGET[i][1]);
  const X = (v: number) => 10 + v * 20;

  return (
    <Shell
      play={play}
      question={question}
      title="Shape X-Ray Scanner"
      mission="Figure (X) is a pentagon: across, down-right slant, down-left slant, back across and straight up. Pick a candidate and trace Figure (X) by tapping lattice dots one after another along the candidate's own lines. Confirm the candidate where your trace fits exactly."
      icon={ScanSearch}
      dim="2D"
      submitLabel="Submit the figure"
      live={
        <>
          <Gauge label="On real lines?" value={valid ? "yes" : "no"} tone={valid ? "emerald" : "rose"} />
          <Gauge label="Shape of (X)?" value={exact ? "exact" : "not yet"} tone={exact ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="flex gap-1.5 mb-2">
        {Object.keys(Q6_FIGS).map((k) => <Btn key={k} active={w.fig === k} tone={w.fig === k ? "violet" : "slate"} onClick={() => play.set((p) => ({ ...p, fig: k, trace: [] }))}>Figure {k}</Btn>)}
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-start">
        <Bay label="Figure (X)">
          <svg viewBox="-0.3 -0.3 2.6 2.6" className="w-20">
            <polyline points="0,0 1,0 2,1 1,2 0,2 0,0" fill="#e0e7ff" stroke="#4338ca" strokeWidth={0.08} />
          </svg>
        </Bay>
        <Board>
          <svg viewBox="0 0 100 100" className="w-full max-h-72">
            {Q6_FIGS[w.fig].map(([a, b], i) => <line key={i} x1={X(a[0])} y1={X(a[1])} x2={X(b[0])} y2={X(b[1])} stroke="#334155" strokeWidth={1} />)}
            <polyline points={w.trace.map(([x, y]) => `${X(x)},${X(y)}`).join(" ")} fill="none" stroke={valid ? (exact ? "#10b981" : "#8b5cf6") : "#f43f5e"} strokeWidth={2.4} strokeLinecap="round" />
            {Array.from({ length: 25 }, (_, k) => {
              const p: Pt = [k % 5, Math.floor(k / 5)];
              return <circle key={k} cx={X(p[0])} cy={X(p[1])} r={2.6} fill={w.trace.some((t) => t[0] === p[0] && t[1] === p[1]) ? "#f59e0b" : "#a5b4fc"} role="button" aria-label={`dot ${p[0]},${p[1]}`} style={{ cursor: "pointer" }} onClick={() => !play.readOnly && play.set((s) => ({ ...s, found: null, trace: [...s.trace, p] }))} />;
            })}
          </svg>
        </Board>
      </div>
      <div className="flex gap-2 mt-2">
        <Btn tone="slate" disabled={play.readOnly || !w.trace.length} onClick={() => play.patch({ trace: [] })}>Clear trace</Btn>
        <Btn tone="emerald" disabled={play.readOnly || !exact} onClick={() => play.patch({ found: w.fig })}>Confirm figure {w.fig}</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — Word-Swap Laboratory
   Real objects sit on the bench; the translator shows what each is called in this code.
   The student picks the object the question really needs, sends it through the
   translator, and the coded word that comes out is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const USES: Record<string, string> = { Clock: "tells the time", Television: "shows programmes", Radio: "plays broadcasts", Oven: "bakes food", Grinder: "grinds spices", Iron: "presses clothes" };
export function Q07WordSwapLaboratoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const chain = cfg<Record<string, string>>(question, "chain", {});
  const objects = Array.from(new Set([...Object.keys(chain), ...Object.values(chain)]));
  const play = usePlay<{ obj: string | null; sent: boolean }>({
    question,
    initial: { obj: null, sent: false },
    derive: (w) => {
      if (!w.obj || !w.sent) return { note: "Pick the real object and send it through the translator." };
      const coded = chain[w.obj] ?? w.obj;
      return { value: `${w.obj} is called ${coded}`, optionId: matchText(question, coded) };
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
      title="Word-Swap Laboratory"
      mission="Each real object on the bench has a new name in this code language. Pick the object a woman would really use to bake, then send it through the translator to see what it is called."
      icon={Languages}
      dim="2D"
      submitLabel="Submit the coded name"
      live={<Gauge label="Translator" value={w.obj && w.sent ? `${w.obj} → ${chain[w.obj] ?? w.obj}` : "—"} tone="violet" />}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {objects.map((o) => (
          <button key={o} type="button" disabled={play.readOnly} onClick={() => play.set({ obj: o, sent: false })} aria-label={`object ${o}`} className={`rounded-xl border-2 p-2 text-left bg-white ${w.obj === o ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}`}>
            <div className="font-black text-indigo-900">{o}</div>
            <div className="text-[11px] text-slate-500">real use: {USES[o] ?? "—"}</div>
            <div className="text-[11px] font-bold text-amber-700">called “{chain[o] ?? "—"}”</div>
          </button>
        ))}
      </div>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !w.obj} onClick={() => play.patch({ sent: true })}>🔁 Send {w.obj ?? "…"} through the translator</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — Brick Wall Completion
   The wall alternates two brick panels in a chequerboard. Four panels are missing. The
   student picks a panel type for each gap; the finished patch is compared with the
   options.
   ══════════════════════════════════════════════════════════════════════ */

type Panel = "H" | "V" | "D" | "S";
const Q8_STATES: Record<string, Panel[]> = { A: ["V", "V", "V", "V"], B: ["H", "V", "V", "H"], C: ["D", "D", "D", "D"], D: ["S", "S", "S", "S"] };
function PanelArt({ t }: { t: Panel | null }) {
  return (
    <svg viewBox="0 0 20 20" className="w-full h-full">
      <rect width={20} height={20} fill={t ? "#fde68a" : "#f8fafc"} stroke="#92400e" strokeWidth={0.6} strokeDasharray={t ? undefined : "1 1"} />
      {t === "H" && [5, 10, 15].map((y) => <line key={y} x1={0} x2={20} y1={y} y2={y} stroke="#92400e" strokeWidth={0.6} />)}
      {t === "V" && [5, 10, 15].map((x) => <line key={x} y1={0} y2={20} x1={x} x2={x} stroke="#92400e" strokeWidth={0.6} />)}
      {t === "D" && [0, 10, 20].map((k) => <line key={k} x1={k - 10} y1={20} x2={k + 10} y2={0} stroke="#92400e" strokeWidth={0.6} />)}
      {t === "S" && <rect width={20} height={20} fill="#b45309" />}
    </svg>
  );
}
export function Q08BrickWallCompletionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [held, setHeld] = useState<Panel>("H");
  const play = usePlay<{ gap: (Panel | null)[]; done: boolean }>({
    question,
    initial: { gap: [null, null, null, null], done: false },
    derive: (w) => {
      if (w.gap.some((g) => !g) || !w.done) return { note: "Fill all four gaps and set the patch." };
      const opt = Object.keys(Q8_STATES).find((k) => Q8_STATES[k].join() === w.gap.join());
      return { value: `Patch ${w.gap.join(" ")}`, optionId: opt };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const wall = (r: number, c: number): Panel => ((r + c) % 2 ? "V" : "H");
  const gapIdx = (r: number, c: number) => (r >= 2 && c >= 2 ? (r - 2) * 2 + (c - 2) : -1);

  return (
    <Shell
      play={play}
      question={question}
      title="Brick Wall Completion"
      mission="Study how the brick panels alternate across the wall. Pick a panel type and tap each empty gap to fill it so the pattern carries on. Then set the patch."
      icon={BrickWall}
      dim="2D"
      submitLabel="Submit the patch"
      live={<Gauge label="Patch" value={w.gap.map((g) => g ?? "·").join(" ")} tone="violet" />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-start">
        <div className="grid grid-cols-4 w-60 h-60 border-2 border-amber-800 rounded-lg overflow-hidden">
          {Array.from({ length: 16 }, (_, k) => {
            const r = Math.floor(k / 4);
            const c = k % 4;
            const g = gapIdx(r, c);
            return g < 0 ? (
              <PanelArt key={k} t={wall(r, c)} />
            ) : (
              <button key={k} type="button" disabled={play.readOnly} onClick={() => play.set((p) => ({ done: false, gap: p.gap.map((x, j) => (j === g ? held : x)) }))} aria-label={`gap ${g + 1}`}>
                <PanelArt t={w.gap[g]} />
              </button>
            );
          })}
        </div>
        <Bay label="Brick panels" tone="violet">
          <div className="flex flex-wrap gap-2">
            {(["H", "V", "D", "S"] as Panel[]).map((t) => (
              <button key={t} type="button" onClick={() => setHeld(t)} aria-label={`panel ${t}`} className={`w-14 h-14 rounded-lg border-2 ${held === t ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}`}>
                <PanelArt t={t} />
              </button>
            ))}
          </div>
          <Btn tone="emerald" className="mt-2" disabled={play.readOnly || w.gap.some((g) => !g)} onClick={() => play.patch({ done: true })}>Set the patch</Btn>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q9 — Fold Studio
   A transparent sheet carries a triangle in one corner and a circle on the other half.
   The student chooses which half to fold over the dotted line and drags the fold closed;
   whatever lies on the folded sheet is matched to the options.
   ══════════════════════════════════════════════════════════════════════ */

const Q9_STATES: Record<string, { side: string; items: string }> = {
  A: { side: "left", items: "triangle" },
  B: { side: "right", items: "triangle+circle" },
  C: { side: "none", items: "triangle+circle" },
  D: { side: "left", items: "triangle+circle" },
};
export function Q09FoldStudioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ fold: "right" | "left" | null; progress: number }>({
    question,
    initial: { fold: null, progress: 0 },
    derive: (w) => {
      if (!w.fold || w.progress < 1) return { note: "Choose the half to fold and close the fold completely." };
      const side = w.fold === "right" ? "left" : "right";
      const st = { side, items: "triangle+circle" };
      const opt = Object.keys(Q9_STATES).find((k) => Q9_STATES[k].side === st.side && Q9_STATES[k].items === st.items);
      return { value: `Folded onto the ${side} half: triangle and circle superimposed`, optionId: opt };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const turn = w.fold === "right" ? -180 * w.progress : 180 * w.progress;

  return (
    <Shell
      play={play}
      question={question}
      title="Fold Studio"
      mission="The sheet is transparent, so anything on the folded half shows through. The question folds the right half over the dotted line. Choose that half and drag the fold slider until the sheet is closed."
      icon={FoldHorizontal}
      dim="2D"
      submitLabel="Submit the folded sheet"
      live={<Gauge label="Fold" value={w.fold ? `${w.fold} half · ${Math.round(w.progress * 100)}%` : "—"} tone="violet" />}
    >
      <Board>
        <div className="flex justify-center" style={{ perspective: 600 }}>
          <div className="relative flex">
            <div className="w-28 h-40 bg-sky-50/80 border border-sky-300 relative">
              <svg viewBox="0 0 28 40" className="absolute inset-0"><polygon points="2,2 14,2 2,14" fill="#6366f1" /></svg>
            </div>
            <div className="border-l-2 border-dashed border-rose-400" />
            <motion.div className="w-28 h-40 bg-sky-50/70 border border-sky-300 relative origin-left" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: w.fold === "right" ? turn : 0 }}>
              <svg viewBox="0 0 28 40" className="absolute inset-0"><circle cx={20} cy={30} r={5} fill="none" stroke="#10b981" strokeWidth={2} /></svg>
            </motion.div>
          </div>
        </div>
      </Board>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Btn active={w.fold === "right"} tone={w.fold === "right" ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set({ fold: "right", progress: 0 })}>Fold the right half over</Btn>
        <Btn active={w.fold === "left"} tone={w.fold === "left" ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set({ fold: "left", progress: 0 })}>Fold the left half over</Btn>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          fold
          <input type="range" aria-label="fold amount" min={0} max={1} step={0.1} value={w.progress} disabled={play.readOnly || !w.fold} onChange={(e) => play.patch({ progress: Number(e.target.value) })} className="accent-indigo-600" />
        </label>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — Two-Explorer Navigation
   The student walks each explorer's route on the map in 5 m steps. When both routes end
   at C, the map lays a tape between the two starting points.
   ══════════════════════════════════════════════════════════════════════ */

const HEAD = ["North", "East", "South", "West"];
const DIR: Pt[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
interface Walker {
  face: number;
  x: number;
  y: number;
  path: Pt[];
}
const fresh = (x: number, y: number): Walker => ({ face: 0, x, y, path: [[x, y]] });

export function Q10TwoExplorerNavigationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const vStart = cfg<Pt>(question, "vanshStart", [0, 0]);
  const pStart = cfg<Pt>(question, "puneetStart", [0, 0]);
  const [who, setWho] = useState<"v" | "p">("v");
  const play = usePlay<{ v: Walker; p: Walker; taped: boolean }>({
    question,
    initial: { v: fresh(vStart[0], vStart[1]), p: fresh(pStart[0], pStart[1]), taped: false },
    derive: (w) => {
      if (w.v.x !== w.p.x || w.v.y !== w.p.y || w.v.path.length < 2 || w.p.path.length < 2) return { note: "Walk both explorers until they meet at C." };
      if (!w.taped) return { note: "Lay the tape between the starting points." };
      const d = Math.hypot(pStart[0] - vStart[0], pStart[1] - vStart[1]);
      return { value: `${+d.toFixed(2)} m between the starts`, optionId: matchNumber(question, d, 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const upd = (f: (x: Walker) => Walker) => play.set((s) => ({ ...s, taped: false, [who]: f(s[who]) }));
  const S = 1.4;
  const ox = 20;
  const oy = 30;

  return (
    <Shell
      play={play}
      question={question}
      title="Two-Explorer Navigation"
      mission="Pick an explorer and walk their route in 5 m steps, turning as the question says (each starts facing North). When both reach the same point C, lay the tape between their starting points."
      icon={Compass}
      dim="2D"
      submitLabel="Submit the distance"
      live={
        <>
          <Gauge label="Vansh" value={`${HEAD[w.v.face]} · (${w.v.x}, ${-w.v.y})`} tone="violet" />
          <Gauge label="Puneet" value={`${HEAD[w.p.face]} · (${w.p.x}, ${-w.p.y})`} tone="amber" />
        </>
      }
    >
      <Board>
        <svg viewBox="0 0 110 80" className="w-full">
          {[...Array(23)].map((_, i) => <line key={i} x1={i * 5} x2={i * 5} y1={0} y2={80} stroke="#e0e7ff" strokeWidth={0.3} />)}
          {[...Array(17)].map((_, i) => <line key={`h${i}`} y1={i * 5} y2={i * 5} x1={0} x2={110} stroke="#e0e7ff" strokeWidth={0.3} />)}
          <polyline points={w.v.path.map(([x, y]) => `${ox + x * S},${oy + y * S}`).join(" ")} fill="none" stroke="#6366f1" strokeWidth={1.2} />
          <polyline points={w.p.path.map(([x, y]) => `${ox + x * S},${oy + y * S}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth={1.2} />
          {w.taped && <line x1={ox + vStart[0] * S} y1={oy + vStart[1] * S} x2={ox + pStart[0] * S} y2={oy + pStart[1] * S} stroke="#e11d48" strokeWidth={0.9} strokeDasharray="2 1" />}
          <text x={ox + vStart[0] * S - 3} y={oy + vStart[1] * S + 5} fontSize={4} fontWeight={900}>A</text>
          <text x={ox + pStart[0] * S + 1} y={oy + pStart[1] * S + 5} fontSize={4} fontWeight={900}>B</text>
          {[w.v, w.p].map((x, i) => <circle key={i} cx={ox + x.x * S} cy={oy + x.y * S} r={1.8} fill={i ? "#f59e0b" : "#6366f1"} />)}
        </svg>
      </Board>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <Btn active={who === "v"} tone={who === "v" ? "violet" : "slate"} onClick={() => setWho("v")}>Vansh</Btn>
        <Btn active={who === "p"} tone={who === "p" ? "amber" : "slate"} onClick={() => setWho("p")}>Puneet</Btn>
        <Btn tone="slate" disabled={play.readOnly} onClick={() => upd((x) => ({ ...x, face: (x.face + 3) % 4 }))}>↺ Turn left</Btn>
        <Btn tone="slate" disabled={play.readOnly} onClick={() => upd((x) => ({ ...x, face: (x.face + 1) % 4 }))}>Turn right ↻</Btn>
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => upd((x) => { const nx = x.x + DIR[x.face][0] * 5; const ny = x.y + DIR[x.face][1] * 5; return { ...x, x: nx, y: ny, path: [...x.path, [nx, ny]] }; })}>🚶 Walk 5 m</Btn>
        <Btn tone="slate" disabled={play.readOnly} onClick={() => upd(() => (who === "v" ? fresh(vStart[0], vStart[1]) : fresh(pStart[0], pStart[1])))}>Back to start</Btn>
        <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ taped: true })}>📏 Lay the tape A–B</Btn>
      </div>
    </Shell>
  );
}

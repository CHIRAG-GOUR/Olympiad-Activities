"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, CircleDot, TrainFront, Scissors, Compass } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOptionState } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { clientToSvg } from "../imo6a-play/svgPoint";
import { Shell, Board, polyPath, Pt } from "./kit";

/**
 * Paper 3 (IMO 2019-20 Set A) · Q1–Q5.
 * Every game derives its value from what the student built; the option is found by
 * matching that value against the printed options. Nothing here names a correct option.
 */

const A2Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const shiftL = (c: string, k: number) => A2Z[(((A2Z.indexOf(c) + k) % 26) + 26) % 26];

/* ══════════════════════════════════════════════════════════════════════
   Q1 — Cipher Laboratory
   One letter wheel per position. The student turns each wheel until NATION comes out as
   OZUHPM, then runs REASON through the same wheels. The printed output is the answer.
   ══════════════════════════════════════════════════════════════════════ */

export function Q01CipherLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const ex = cfg<{ plain: string; coded: string }>(question, "example", { plain: "", coded: "" });
  const target = cfg<string>(question, "target", "");
  const n = ex.plain.length;
  const play = usePlay<{ shift: number[]; ran: boolean }>({
    question,
    initial: { shift: Array(n).fill(0), ran: false },
    derive: (w) => {
      if (!w.ran) return { note: `Tune the wheels on ${ex.plain}, then run ${target} through them.` };
      const out = target.split("").map((c, i) => shiftL(c, w.shift[i])).join("");
      return { value: out, optionId: matchText(question, out) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const tuned = ex.plain.split("").map((c, i) => shiftL(c, w.shift[i]) === ex.coded[i]);
  const turn = (i: number, d: number) => play.set((p) => ({ ran: false, shift: p.shift.map((s, j) => (j === i ? Math.max(-3, Math.min(3, s + d)) : s)) }));

  return (
    <Shell
      play={play}
      question={question}
      title="Cipher Laboratory"
      mission={`Turn each wheel to set how far it moves its letter. When every lamp is green, ${ex.plain} comes out as ${ex.coded}. Then run ${target} through the same wheels.`}
      icon={KeyRound}
      dim="2D"
      submitLabel="Submit the coded word"
      hints={["Compare each letter of NATION with the letter under it in OZUHPM: how many places forward or back did it move?", "The moves follow a pattern from one position to the next.", "Keep the same wheel settings for REASON."]}
      live={
        <>
          <Gauge label="Wheels tuned" value={`${tuned.filter(Boolean).length}/${n}`} tone={tuned.every(Boolean) ? "emerald" : "amber"} />
          <Gauge label="Wheel settings" value={w.shift.map((s) => (s > 0 ? `+${s}` : s)).join(" ")} tone="violet" />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-6 gap-1.5">
          {ex.plain.split("").map((c, i) => (
            <div key={i} className={`rounded-xl border-2 p-1 text-center ${tuned[i] ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}>
              <Btn className="w-full px-0 min-h-[34px]" tone="slate" disabled={play.readOnly} onClick={() => turn(i, 1)} ariaLabel={`wheel ${i + 1} up`}>
                ▲
              </Btn>
              <div className="font-mono text-sm font-bold text-slate-500">{c}</div>
              <motion.div key={w.shift[i]} initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} className="font-mono text-2xl font-black text-indigo-900">
                {shiftL(c, w.shift[i])}
              </motion.div>
              <div className="text-[10px] font-black text-violet-700">{w.shift[i] > 0 ? `+${w.shift[i]}` : w.shift[i]}</div>
              <Btn className="w-full px-0 min-h-[34px]" tone="slate" disabled={play.readOnly} onClick={() => turn(i, -1)} ariaLabel={`wheel ${i + 1} down`}>
                ▼
              </Btn>
              <div className={`mx-auto mt-1 w-3 h-3 rounded-full ${tuned[i] ? "bg-emerald-500" : "bg-slate-300"}`} />
            </div>
          ))}
        </div>
      </Board>
      <Bay label="Second word" tone="violet">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ ran: true })}>
            ⚙ Run {target} through the wheels
          </Btn>
          <span className="font-mono text-2xl font-black tracking-widest text-indigo-900">{w.ran ? target.split("").map((c, i) => shiftL(c, w.shift[i])).join("") : target}</span>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q2 — Dot Placement Laboratory
   Each option figure is a light-table. The student places three dots; the scanner reports
   which shapes each dot is inside. A figure can be locked only when all three dots sit in
   the regions the given figure uses.
   ══════════════════════════════════════════════════════════════════════ */

interface DotFig {
  circle: [number, number, number];
  square: [number, number, number];
  triangle: Pt[];
}
const inCircle = (f: DotFig, [x, y]: Pt) => (x - f.circle[0]) ** 2 + (y - f.circle[1]) ** 2 <= f.circle[2] ** 2;
const inSquare = (f: DotFig, [x, y]: Pt) => x >= f.square[0] && x <= f.square[0] + f.square[2] && y >= f.square[1] && y <= f.square[1] + f.square[2];
const inTri = (f: DotFig, [x, y]: Pt) => {
  const [[x1, y1], [x2, y2], [x3, y3]] = f.triangle;
  const d = (ax: number, ay: number, bx: number, by: number) => (bx - ax) * (y - ay) - (by - ay) * (x - ax);
  const a = d(x1, y1, x2, y2), b = d(x2, y2, x3, y3), c = d(x3, y3, x1, y1);
  return (a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0);
};
const insideOf = (f: DotFig, p: Pt): Record<string, boolean> => ({ circle: inCircle(f, p), square: inSquare(f, p), triangle: inTri(f, p) });
type Rule = { dot: number; inside: string[]; outside: string[] };
const fits = (f: DotFig | undefined, p: Pt | undefined, r: Rule) => {
  if (!f || !p) return false;
  const s = insideOf(f, p);
  return r.inside.every((k) => s[k]) && r.outside.every((k) => !s[k]);
};

function DotFigure({ f, dots, ok }: { f: DotFig; dots?: Record<number, Pt>; ok?: (k: number) => boolean }) {
  return (
    <>
      <circle cx={f.circle[0]} cy={f.circle[1]} r={f.circle[2]} fill="#38bdf822" stroke="#0284c7" strokeWidth={0.8} />
      <rect x={f.square[0]} y={f.square[1]} width={f.square[2]} height={f.square[2]} fill="#f59e0b1f" stroke="#d97706" strokeWidth={0.8} />
      <path d={polyPath(f.triangle)} fill="#a78bfa22" stroke="#7c3aed" strokeWidth={0.8} />
      {Object.entries(dots ?? {}).map(([k, p]) => (
        <g key={k}>
          <circle cx={p[0]} cy={p[1]} r={2.2} fill={ok ? (ok(Number(k)) ? "#10b981" : "#f43f5e") : "#0f172a"} stroke="#fff" strokeWidth={0.5} />
          {ok && (
            <text x={p[0] + 2.5} y={p[1] - 2} fontSize={4.5} fill="#1e1b4b" fontWeight={900}>
              {k}
            </text>
          )}
        </g>
      ))}
    </>
  );
}

export function Q02DotLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figures = cfg<Record<string, DotFig>>(question, "figures", {});
  const given = cfg<DotFig & { dots: Pt[] }>(question, "given", { circle: [0, 0, 0], square: [0, 0, 0], triangle: [[0, 0], [0, 0], [0, 0]], dots: [] });
  const rules = cfg<Rule[]>(question, "rules", []);
  const [dot, setDot] = useState(1);
  const play = usePlay<{ fig: string; dots: Record<string, Record<number, Pt>>; locked: string | null }>({
    question,
    initial: { fig: "A", dots: {}, locked: null },
    derive: (w) => (!w.locked ? { note: `Place all ${rules.length} dots correctly in one figure and lock it.` } : { value: `All ${rules.length} dots fit in figure ${w.locked}`, optionId: w.locked }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const f = figures[w.fig];
  const here = w.dots[w.fig] ?? {};
  const allOk = !!f && rules.every((r) => fits(f, here[r.dot], r));
  const svgRef = React.useRef<SVGSVGElement>(null);
  const describe = (r: Rule) => `inside ${r.inside.join(" + ")}${r.outside.length ? `, outside ${r.outside.join(" + ")}` : ""}`;

  return (
    <Shell
      play={play}
      question={question}
      title="Dot Placement Laboratory"
      mission={`Study the given figure: the list says which shapes each of its dots is inside. Then pick an option figure, choose a dot and tap the light-table to place it. Lock the figure where all ${rules.length} dots can sit in the same kinds of region.`}
      icon={CircleDot}
      dim="2D"
      submitLabel="Submit the figure"
      hints={cfg<string[]>(question, "hints", ["A dot's region is described by the shapes it is inside and the shapes it is outside.", "Look for a region that is inside the triangle and the square but not the circle — not every figure has one."])}
      live={
        <>
          {rules.map((r) => (
            <Gauge key={r.dot} label={`Dot ${r.dot}`} value={here[r.dot] && f ? Object.entries(insideOf(f, here[r.dot])).filter(([, v]) => v).map(([k]) => k).join(" + ") || "outside all" : "not placed"} tone={fits(f, here[r.dot], r) ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-3">
        <Bay label="Given figure">
          <svg viewBox="0 0 100 100" className="w-full max-h-56">
            <DotFigure f={given} dots={Object.fromEntries(given.dots.map((p, i) => [i + 1, p]))} />
          </svg>
          <ul className="text-[11px] font-semibold text-slate-600 space-y-0.5">
            {rules.map((r) => (
              <li key={r.dot}>
                Dot {r.dot}: {describe(r)}
              </li>
            ))}
          </ul>
        </Bay>
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {Object.keys(figures).map((id) => (
              <Btn key={id} active={w.fig === id} tone={w.fig === id ? "violet" : "slate"} onClick={() => play.patch({ fig: id })}>
                Figure {id}
              </Btn>
            ))}
            <span className="w-px bg-slate-200 mx-1" />
            {rules.map((r) => (
              <Btn key={r.dot} active={dot === r.dot} tone={dot === r.dot ? "amber" : "slate"} onClick={() => setDot(r.dot)}>
                Dot {r.dot}
              </Btn>
            ))}
          </div>
          {f && (
            <Board>
              <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                className="w-full max-h-72 cursor-crosshair"
                onClick={(e) => {
                  if (play.readOnly) return;
                  const q = clientToSvg(svgRef.current, e.clientX, e.clientY);
                  if (!q) return;
                  const p: Pt = [Math.round(q.x), Math.round(q.y)];
                  play.set((s) => ({ ...s, locked: null, dots: { ...s.dots, [s.fig]: { ...(s.dots[s.fig] ?? {}), [dot]: p } } }));
                }}
              >
                <DotFigure f={f} dots={here} ok={(k) => fits(f, here[k], rules.find((r) => r.dot === k)!)} />
              </svg>
            </Board>
          )}
          <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !allOk} onClick={() => play.patch({ locked: w.fig })}>
            🔒 Lock figure {w.fig}
          </Btn>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q3 — Alphabet Railway
   One track per letter position. The student reads the jumps already made on a track and
   sets the next one; the three stops form the next term.
   ══════════════════════════════════════════════════════════════════════ */

export function Q03AlphabetRailwayActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const series = cfg<string[]>(question, "series", []);
  const last = series[series.length - 1] ?? "AAA";
  const play = usePlay<{ jump: (number | null)[] }>({
    question,
    initial: { jump: [null, null, null] },
    derive: (w) => {
      if (w.jump.some((j) => j === null)) return { note: "Set the next jump on all three tracks." };
      const word = last.split("").map((c, k) => shiftL(c, w.jump[k]!)).join("");
      return { value: word, optionId: matchText(question, word) };
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
      title="Alphabet Railway"
      mission="Each track carries one letter of every term. Read the jumps the train has already made on a track, then choose the size of the next jump. The three stops make the next term."
      icon={TrainFront}
      dim="2D"
      submitLabel="Submit the next term"
      hints={["The jump sizes on a track grow in a steady way.", "Count letters carefully across the alphabet: after Z the train would go back to A."]}
      live={<Gauge label="Next term" value={w.jump.every((j) => j !== null) ? last.split("").map((c, k) => shiftL(c, w.jump[k]!)).join("") : "…"} tone="violet" />}
    >
      <div className="space-y-2">
        {[0, 1, 2].map((k) => {
          const stops = series.map((s) => s[k]);
          const jumps = stops.slice(1).map((c, i) => (A2Z.indexOf(c) - A2Z.indexOf(stops[i]) + 26) % 26);
          const next = w.jump[k] === null ? null : shiftL(stops[stops.length - 1], w.jump[k]!);
          return (
            <Bay key={k} label={`Track ${k + 1} — letter ${k + 1} of each term`}>
              <div className="flex flex-wrap items-center gap-1">
                {stops.map((c, i) => (
                  <React.Fragment key={i}>
                    <span className="w-9 h-9 rounded-lg bg-indigo-100 border-2 border-indigo-300 text-indigo-900 font-mono font-black grid place-items-center">{c}</span>
                    {i < jumps.length && <span className="text-[11px] font-black text-violet-700">+{jumps[i]}→</span>}
                  </React.Fragment>
                ))}
                <span className="text-[11px] font-black text-amber-700">{w.jump[k] === null ? "+?" : `+${w.jump[k]}`}→</span>
                <motion.span key={next ?? "q"} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-9 h-9 rounded-lg bg-amber-300 font-mono font-black grid place-items-center">
                  {next ?? "?"}
                </motion.span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <Btn key={j} className="px-2 min-h-[34px]" active={w.jump[k] === j} tone={w.jump[k] === j ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ jump: p.jump.map((x, i) => (i === k ? j : x)) }))} ariaLabel={`track ${k + 1} jump ${j}`}>
                    +{j}
                  </Btn>
                ))}
              </div>
            </Bay>
          );
        })}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — Round Sheet Fold & Cut
   The student folds the round sheet as X and Y show, picks a punch (square or round) and
   cuts the folded quarter where figure Z marks it, then opens the folds one at a time.
   Every cut is copied across each fold as it opens.
   ══════════════════════════════════════════════════════════════════════ */

type Hole = [string, number, number];
interface CutWorld {
  folds: number;
  tool: "square" | "circle";
  holes: Hole[];
  opened: number;
}
const dedupeHoles = (hs: Hole[]) => hs.filter((h, i) => hs.findIndex((g) => g[0] === h[0] && Math.abs(g[1] - h[1]) < 0.5 && Math.abs(g[2] - h[2]) < 0.5) === i);
const sameHoleSet = (a: Hole[], b: Hole[]) =>
  a.length === b.length && a.every((h) => b.some((g) => g[0] === h[0] && Math.abs(g[1] - h[1]) < 3 && Math.abs(g[2] - h[2]) < 3));

export function Q04RoundFoldCutActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const marks = cfg<{ shape: string; x: number; y: number }[]>(question, "marks", []);
  const holesNow = (w: CutWorld) => {
    let h = [...w.holes];
    if (w.opened >= 1) h = dedupeHoles([...h, ...h.map(([s, x, y]) => [s, x, -y] as Hole)]);
    if (w.opened >= 2) h = dedupeHoles([...h, ...h.map(([s, x, y]) => [s, -x, y] as Hole)]);
    return h;
  };
  const play = usePlay<CutWorld>({
    question,
    initial: { folds: 0, tool: "square", holes: [], opened: 0 },
    derive: (w) => {
      if (w.folds < 2) return { note: "Fold the sheet as in X and Y." };
      if (!w.holes.length) return { note: "Cut the folded quarter where figure Z shows." };
      if (w.opened < 2) return { note: "Open both folds." };
      const h = holesNow(w);
      return { value: `${h.length} cut-outs after unfolding`, optionId: matchOptionState(question, h, (o: Hole[], b) => sameHoleSet(o, b)) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const shown = holesNow(w);
  const canCut = w.folds === 2 && w.opened === 0;
  const stage = w.opened >= 2 || w.folds === 0 ? "full" : w.opened === 1 || w.folds === 1 ? "half" : "quarter";
  const paper = stage === "full" ? "M 0 -50 A 50 50 0 1 1 -0.01 -50 Z" : stage === "half" ? "M 0 -50 A 50 50 0 0 0 0 50 Z" : "M 0 0 L -50 0 A 50 50 0 0 0 0 50 Z";

  return (
    <Shell
      play={play}
      question={question}
      title="Round Sheet Fold & Cut"
      mission="Fold the round sheet: first the right half onto the left (X), then the top down onto the bottom (Y). Choose the square or round punch and cut the quarter where figure Z shows (the faint guides). Then open the folds one at a time."
      icon={Scissors}
      dim="2D"
      submitLabel="Submit the unfolded sheet"
      hints={["Each fold you open copies every cut to the mirror side of that fold.", "A cut that sits exactly on a fold line joins with its copy into one hole on that line.", "Use the punch whose shape matches the cut in Z."]}
      live={
        <>
          <Gauge label="Folds" value={`${w.folds}/2`} tone="violet" />
          <Gauge label="Cuts" value={w.holes.length} tone="amber" />
          <Gauge label="Folds opened" value={`${w.opened}/2`} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-3">
        <Board>
          <svg
            ref={svgRef}
            viewBox="-58 -58 116 116"
            className="w-full max-h-80"
            onClick={(e) => {
              if (play.readOnly || !canCut) return;
              const q = clientToSvg(svgRef.current, e.clientX, e.clientY);
              if (!q || q.x > 1 || q.y < -1 || Math.hypot(q.x, q.y) > 50) return;
              const snap = marks.find((m) => Math.hypot(m.x - q.x, m.y - q.y) < 7);
              const p: Hole = snap ? [w.tool, snap.x, snap.y] : [w.tool, Math.round(q.x / 2) * 2, Math.round(q.y / 2) * 2];
              play.set((s) => {
                const at = s.holes.findIndex((h) => Math.abs(h[1] - p[1]) < 0.5 && Math.abs(h[2] - p[2]) < 0.5);
                return { ...s, holes: at >= 0 ? s.holes.filter((_, i) => i !== at) : [...s.holes, p] };
              });
            }}
          >
            <path d={paper} fill={stage === "full" ? "#fef9c3" : "#fde68a"} stroke="#92400e" strokeWidth={0.8} />
            {w.opened >= 1 && <line x1={-50} x2={w.opened >= 2 ? 50 : 0} y1={0} y2={0} stroke="#92400e" strokeDasharray="2 2" strokeWidth={0.4} />}
            {w.opened >= 2 && <line x1={0} x2={0} y1={-50} y2={50} stroke="#92400e" strokeDasharray="2 2" strokeWidth={0.4} />}
            {canCut && marks.map((m, i) => (m.shape === "circle" ? <circle key={i} cx={m.x} cy={m.y} r={5} fill="none" stroke="#dc2626" strokeDasharray="1 1" strokeWidth={0.5} /> : <rect key={i} x={m.x - 4.5} y={m.y - 4.5} width={9} height={9} fill="none" stroke="#dc2626" strokeDasharray="1 1" strokeWidth={0.5} />))}
            {shown.map(([s, x, y], i) => (s === "circle" ? <circle key={i} cx={x} cy={y} r={3.8} fill="#fff" stroke="#1e293b" strokeWidth={0.8} /> : <rect key={i} x={x - 3.5} y={y - 3.5} width={7} height={7} fill="#fff" stroke="#1e293b" strokeWidth={0.8} />))}
          </svg>
        </Board>
        <div className="space-y-2">
          <Bay label="Folding bench" tone="violet">
            <div className="flex flex-wrap gap-1.5">
              <Btn disabled={play.readOnly || w.folds !== 0} onClick={() => play.patch({ folds: 1 })}>
                Fold X: right half onto left
              </Btn>
              <Btn disabled={play.readOnly || w.folds !== 1} onClick={() => play.patch({ folds: 2 })}>
                Fold Y: top down onto bottom
              </Btn>
            </div>
          </Bay>
          <Bay label="Punch">
            <div className="flex flex-wrap gap-1.5">
              <Btn active={w.tool === "square"} tone={w.tool === "square" ? "amber" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ tool: "square" })}>
                ■ Square punch
              </Btn>
              <Btn active={w.tool === "circle"} tone={w.tool === "circle" ? "amber" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ tool: "circle" })}>
                ● Round punch
              </Btn>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">{canCut ? "Tap the folded quarter to cut (tap a cut again to remove it)." : w.folds < 2 ? "Fold first." : "Cutting is done."}</p>
          </Bay>
          <Bay label="Unfold">
            <div className="flex flex-wrap gap-1.5">
              <Btn tone="amber" disabled={play.readOnly || w.folds < 2 || !w.holes.length || w.opened >= 2} onClick={() => play.patch({ opened: w.opened + 1 })}>
                {w.opened === 0 ? "Open fold Y" : "Open fold X"}
              </Btn>
              <Btn tone="slate" disabled={play.readOnly} onClick={() => play.set({ folds: 0, tool: w.tool, holes: [], opened: 0 })}>
                New sheet
              </Btn>
            </div>
          </Bay>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — Explorer Navigation Map
   The student walks Umang across the map in 5 m steps, turning as the story says. The
   survey drone then measures the straight-line distance back to the flag.
   ══════════════════════════════════════════════════════════════════════ */

const HEAD = ["North", "East", "South", "West"];
const DIR: Pt[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];

export function Q05ExplorerMapActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const step = cfg<number>(question, "step", 5);
  const play = usePlay<{ face: number; x: number; y: number; path: Pt[]; measured: boolean }>({
    question,
    initial: { face: 0, x: 0, y: 0, path: [[0, 0]], measured: false },
    derive: (w) => (!w.measured ? { note: "Walk the route, then measure the distance home." } : { value: `${+Math.hypot(w.x, w.y).toFixed(2)} m`, optionId: matchNumber(question, Math.hypot(w.x, w.y), 1e-6) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const S = 1.1;
  const ox = 35;
  const oy = 15;

  return (
    <Shell
      play={play}
      question={question}
      title="Explorer Navigation Map"
      mission="Umang starts at the flag facing North. Turn him to face the way the story begins, walk in 5 m steps and make each turn the story describes. Then send the drone to measure how far he is from the flag."
      icon={Compass}
      dim="2D"
      submitLabel="Submit the distance"
      hints={["Left and right depend on the way Umang is facing, not on the map.", "Facing South, his left hand points East."]}
      live={
        <>
          <Gauge label="Facing" value={HEAD[w.face]} tone="violet" />
          <Gauge label="Walked" value={`${(w.path.length - 1) * step} m`} />
          <Gauge label="Drone reading" value={w.measured ? `${+Math.hypot(w.x, w.y).toFixed(2)} m` : "—"} tone="emerald" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-3">
        <div className="rounded-2xl bg-lime-50 border-2 border-lime-200 p-1">
          <svg viewBox="0 0 110 90" className="w-full">
            {Array.from({ length: 23 }, (_, i) => (
              <line key={`v${i}`} x1={i * 5} x2={i * 5} y1={0} y2={90} stroke="#d9f99d" strokeWidth={0.3} />
            ))}
            {Array.from({ length: 19 }, (_, i) => (
              <line key={`h${i}`} y1={i * 5} y2={i * 5} x1={0} x2={110} stroke="#d9f99d" strokeWidth={0.3} />
            ))}
            <polyline points={w.path.map(([x, y]) => `${ox + x * S},${oy + y * S}`).join(" ")} fill="none" stroke="#7c3aed" strokeWidth={1.2} />
            {w.measured && <line x1={ox} y1={oy} x2={ox + w.x * S} y2={oy + w.y * S} stroke="#dc2626" strokeWidth={0.8} strokeDasharray="2 1" />}
            <text x={ox - 2} y={oy - 2} fontSize={5}>
              🚩
            </text>
            <motion.g animate={{ x: ox + w.x * S, y: oy + w.y * S, rotate: w.face * 90 }}>
              <polygon points="0,-3 2.4,2.4 -2.4,2.4" fill="#0f172a" />
            </motion.g>
            <text x={102} y={8} fontSize={5} fontWeight={900} textAnchor="middle">
              N↑
            </text>
          </svg>
        </div>
        <Bay label="Controls" tone="violet">
          <div className="flex flex-wrap gap-1.5">
            <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, measured: false, face: (p.face + 3) % 4 }))}>
              ↺ Turn left
            </Btn>
            <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, measured: false, face: (p.face + 1) % 4 }))}>
              Turn right ↻
            </Btn>
            <Btn
              tone="emerald"
              disabled={play.readOnly}
              onClick={() =>
                play.set((p) => {
                  const x = p.x + DIR[p.face][0] * step;
                  const y = p.y + DIR[p.face][1] * step;
                  return { ...p, measured: false, x, y, path: [...p.path, [x, y]] };
                })
              }
            >
              🚶 Walk {step} m
            </Btn>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Btn tone="amber" disabled={play.readOnly || w.path.length < 2} onClick={() => play.patch({ measured: true })}>
              🛸 Measure distance home
            </Btn>
            <Btn tone="slate" disabled={play.readOnly} onClick={() => play.set({ face: 0, x: 0, y: 0, path: [[0, 0]], measured: false })}>
              Back to the flag
            </Btn>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

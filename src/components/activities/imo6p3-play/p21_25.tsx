"use client";

import React, { useState } from "react";
import { Scale, Brackets, Calculator, CircleDashed, FlipHorizontal2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, reduceFraction } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { clientToSvg } from "../imo6a-play/svgPoint";
import { Shell, Board, Stepper, polyPath, listText, Pt } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q21–Q25. */

/* ══════════════════════════════════════════════════════════════════════
   Q21 — Algebra Balance Machine
   The student loads x and y; the ratio lamp lights when y : x is 3 : 4. The machine works
   out the expression for every loaded pair. Two different pairs show whether it changes.
   ══════════════════════════════════════════════════════════════════════ */

export function Q21AlgebraBalanceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [ry, rx] = cfg<[number, number]>(question, "ratio", [3, 4]);
  const evalE = (x: number, y: number) => {
    const [n, d] = reduceFraction(2 * x - y, x + 2 * y);
    const [a, b] = reduceFraction(d + 4 * n, 4 * d);
    return { n: a, d: b };
  };
  const play = usePlay<{ x: number; y: number; log: { x: number; y: number; n: number; d: number }[] }>({
    question,
    initial: { x: 2, y: 2, log: [] },
    derive: (w) => {
      if (w.log.length < 2) return { note: `Log the machine's result for two different pairs in the ratio (${w.log.length}/2).` };
      if (new Set(w.log.map((l) => `${l.n}/${l.d}`)).size > 1) return { note: "The logged results differ — check the pairs." };
      const l = w.log[0];
      return { value: l.d === 1 ? `${l.n} for every pair` : `${l.n}/${l.d} for every pair`, optionId: matchNumber(question, l.n / l.d) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const okRatio = w.y * rx === w.x * ry;
  const e = evalE(w.x, w.y);
  const dup = w.log.some((l) => l.x === w.x && l.y === w.y);

  return (
    <Shell
      play={play}
      question={question}
      title="Algebra Balance Machine"
      mission={`Load x and y so that y : x is ${ry} : ${rx} (the ratio lamp lights). The machine works out 1/4 + (2x − y)/(x + 2y). Log two different pairs and see whether the answer changes.`}
      icon={Scale}
      dim="2D"
      submitLabel="Submit the value"
      hints={["The simplest pair is x = 4, y = 3.", "Doubling both x and y keeps the ratio the same."]}
      live={
        <>
          <Gauge label="y : x" value={`${w.y} : ${w.x}`} tone={okRatio ? "emerald" : "rose"} />
          <Gauge label="Machine" value={e.d === 1 ? e.n : `${e.n}/${e.d}`} tone="violet" />
          <Gauge label="Logged" value={w.log.map((l) => `(${l.x},${l.y})→${l.n}/${l.d}`).join(" ") || "—"} />
        </>
      }
    >
      <div className="flex flex-wrap gap-4">
        <Stepper label="x" value={w.x} min={1} max={40} steps={[1, 4]} disabled={play.readOnly} onStep={(d) => play.patch({ x: w.x + d })} />
        <Stepper label="y" value={w.y} min={1} max={40} steps={[1, 3]} disabled={play.readOnly} onStep={(d) => play.patch({ y: w.y + d })} />
      </div>
      <Board className="font-mono text-indigo-900 p-3">
        1/4 + (2·{w.x} − {w.y}) / ({w.x} + 2·{w.y}) = 1/4 + {2 * w.x - w.y}/{w.x + 2 * w.y} = <b className="text-amber-700">{e.d === 1 ? e.n : `${e.n}/${e.d}`}</b>
      </Board>
      <Btn tone="emerald" disabled={play.readOnly || !okRatio || dup} onClick={() => play.patch({ log: [...w.log, { x: w.x, y: w.y, ...e }] })}>
        {!okRatio ? "Ratio lamp is off" : dup ? "Pair already logged" : "Log this pair"}
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — Bracket Factory (fractions)
   Each expression is a line of tokens. The student taps the operation to do next; the
   factory accepts only what the rules allow (innermost brackets first, then left to
   right) and collapses it into one fraction. When all four are reduced, the equal pair is
   read.
   ══════════════════════════════════════════════════════════════════════ */

const OPEN = ["(", "[", "{"];
const CLOSE = [")", "]", "}"];
const OPS = ["÷", "·"];
const parseQ = (s: string): [number, number] => {
  const [a, b] = s.split("/").map(Number);
  return reduceFraction(a, b ?? 1) as [number, number];
};
const fmtQ = ([n, d]: [number, number]) => (d === 1 ? String(n) : `${n}/${d}`);

function nextOp(t: string[]) {
  let depth = 0;
  let max = 0;
  t.forEach((s) => {
    if (OPEN.includes(s)) max = Math.max(max, ++depth);
    if (CLOSE.includes(s)) depth--;
  });
  let lo = 0;
  let hi = t.length;
  if (max > 0) {
    depth = 0;
    for (let i = 0; i < t.length; i++) {
      if (OPEN.includes(t[i]) && ++depth === max) {
        lo = i + 1;
        hi = t.findIndex((s, j) => j > i && CLOSE.includes(s));
        break;
      }
      if (CLOSE.includes(t[i])) depth--;
    }
  }
  const k = t.slice(lo, hi).findIndex((s) => OPS.includes(s));
  return k >= 0 ? lo + k : -1;
}
function applyOp(t: string[], i: number) {
  const [an, ad] = parseQ(t[i - 1]);
  const [bn, bd] = parseQ(t[i + 1]);
  const v = t[i] === "÷" ? reduceFraction(an * bd, ad * bn) : reduceFraction(an * bn, ad * bd);
  let out = [...t.slice(0, i - 1), fmtQ(v as [number, number]), ...t.slice(i + 2)];
  let changed = true;
  while (changed) {
    changed = false;
    for (let j = 1; j < out.length - 1; j++)
      if (OPEN.includes(out[j - 1]) && CLOSE.includes(out[j + 1])) {
        out = [...out.slice(0, j - 1), out[j], ...out.slice(j + 2)];
        changed = true;
        break;
      }
  }
  return out;
}
const showTok = (s: string) => (s === "{" || s === "}" ? "" : s === "·" ? "×" : s);

export function Q22BracketFactoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const exprs = cfg<Record<string, string[]>>(question, "exprs", {});
  const [msg, setMsg] = useState<string | null>(null);
  const play = usePlay<{ t: Record<string, string[]> }>({
    question,
    initial: { t: exprs },
    derive: (w) => {
      const ids = Object.keys(w.t);
      if (ids.some((k) => w.t[k].length > 1)) return { note: "Reduce every expression to a single number." };
      if (ids.every((k) => w.t[k][0] === w.t[ids[0]][0])) return { value: `All equal (${w.t[ids[0]][0]})`, optionId: matchText(question, "All are equal.") };
      const pairs = ids.flatMap((a, i) => ids.slice(i + 1).filter((b) => w.t[a][0] === w.t[b][0]).map((b) => [a, b]));
      if (pairs.length !== 1) return { note: pairs.length ? "More than one pair is equal." : "No two expressions are equal." };
      const text = `${pairs[0][0]} and ${pairs[0][1]}`;
      return { value: `${text} (both ${w.t[pairs[0][0]][0]})`, optionId: matchText(question, text) };
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
      title="Bracket Factory"
      mission="On each line, tap the operation that should be done next. The factory only accepts the right order — innermost brackets first, then left to right — and collapses the pair into one fraction. In S, 8(15 ÷ 16) means 8 × (15 ÷ 16), worked as one block. Reduce all four lines and find the ones that are equal."
      icon={Brackets}
      dim="2D"
      submitLabel="Submit the equal pair"
      hints={["Dividing by a fraction is the same as multiplying by its reciprocal.", "Brackets change the answer: compare Q and R carefully."]}
      live={<Gauge label="Results" value={Object.entries(w.t).map(([k, v]) => `${k}=${v.length === 1 ? v[0] : "…"}`).join("  ")} tone="violet" />}
    >
      <div className="space-y-2">
        {Object.entries(w.t).map(([k, toks]) => (
          <div key={k} className="flex flex-wrap items-center gap-1 rounded-xl bg-white border-2 border-slate-200 p-2">
            <span className="font-black w-6">{k}</span>
            {toks.map((s, i) =>
              OPS.includes(s) ? (
                <button
                  key={i}
                  type="button"
                  disabled={play.readOnly}
                  aria-label={`${k} operation ${i}`}
                  onClick={() => {
                    if (nextOp(toks) !== i) return setMsg(`${k}: not yet — innermost brackets first, then left to right.`);
                    setMsg(null);
                    play.set((p) => ({ t: { ...p.t, [k]: applyOp(p.t[k], i) } }));
                  }}
                  className="w-9 h-9 rounded-lg bg-violet-600 text-white font-black"
                >
                  {showTok(s)}
                </button>
              ) : (
                <span key={i} className="font-mono font-black text-lg px-0.5">
                  {showTok(s)}
                </span>
              )
            )}
            {toks.length === 1 && <span className="ml-auto text-xs font-black text-emerald-700">done</span>}
          </div>
        ))}
      </div>
      {msg && <p className="text-xs font-bold text-rose-600">{msg}</p>}
      <Btn tone="slate" disabled={play.readOnly} onClick={() => play.set({ t: exprs })}>
        Reload the lines
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — Rounding Cash Register
   Each number has a rounding lever (ones, tens, hundreds, thousands). The register shows
   each rounded figure and rings up their sum.
   ══════════════════════════════════════════════════════════════════════ */

const PLACE = ["ones", "tens", "hundreds", "thousands"];

export function Q23RoundingRegisterActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const nums = cfg<number[]>(question, "numbers", []);
  const rnd = (n: number, p: number) => Math.round(n / 10 ** p) * 10 ** p;
  const play = usePlay<{ place: number[]; rung: boolean }>({
    question,
    initial: { place: nums.map(() => 0), rung: false },
    derive: (w) => {
      if (!w.rung) return { note: "Round the numbers and ring up the total." };
      const t = nums.reduce((s, n, i) => s + rnd(n, w.place[i]), 0);
      return { value: String(t), optionId: matchNumber(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const total = nums.reduce((s, n, i) => s + rnd(n, w.place[i]), 0);

  return (
    <Shell
      play={play}
      question={question}
      title="Rounding Cash Register"
      mission="Slide each number's rounding lever to the place the question asks for. The register shows each rounded figure; ring up the total when both are set."
      icon={Calculator}
      dim="2D"
      submitLabel="Submit the estimate"
      hints={["Round each number first, then add.", "Look at the tens digit to decide whether to round a hundred up or down."]}
      live={<Gauge label="Register total" value={total} tone="violet" />}
    >
      <Board className="space-y-2 p-3">
        {nums.map((n, i) => (
          <div key={n} className="flex flex-wrap items-center gap-2">
            <span className="font-mono w-20 font-bold">{n}</span>
            <input type="range" min={0} max={3} value={w.place[i]} disabled={play.readOnly} aria-label={`round ${n} to`} onChange={(e) => play.set((p) => ({ rung: false, place: p.place.map((x, j) => (j === i ? Number(e.target.value) : x)) }))} className="accent-violet-600" />
            <span className="text-xs w-20 font-semibold">{PLACE[w.place[i]]}</span>
            <span className="font-mono font-black text-violet-700">{rnd(n, w.place[i])}</span>
          </div>
        ))}
        <div className="border-t-2 border-indigo-200 pt-2 font-mono text-2xl font-black text-emerald-700">= {total}</div>
      </Board>
      <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ rung: true })}>
        🔔 Ring up
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — Circle Geometry Explorer
   The centre is not marked. The student drops Q; three compass arms measure from Q to
   three points of the circle and Q locks only when they agree. The tape then runs from Q
   through O to P.
   ══════════════════════════════════════════════════════════════════════ */

export function Q24CircleExplorerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const R = cfg<number>(question, "radius", 5);
  const OP = cfg<number>(question, "op", 5);
  const C: Pt = [18, 9];
  const ring: Pt[] = [0, 110, 230].map((d) => [C[0] + R * Math.cos((d * Math.PI) / 180), C[1] + R * Math.sin((d * Math.PI) / 180)]);
  const O: Pt = [C[0] - R, C[1]];
  const P: Pt = [O[0] - OP, O[1]];
  const svg = React.useRef<SVGSVGElement>(null);
  const play = usePlay<{ q: Pt | null; locked: boolean; taped: boolean }>({
    question,
    initial: { q: null, locked: false, taped: false },
    derive: (w) => {
      if (!w.locked || !w.q || !w.taped) return { note: "Find and lock the centre Q, then run the tape to P." };
      const d = +Math.hypot(P[0] - w.q[0], P[1] - w.q[1]).toFixed(2);
      return { value: `QP = ${d} cm`, optionId: matchNumber(question, d, 0.05) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const dists = w.q ? ring.map((p) => Math.hypot(p[0] - w.q![0], p[1] - w.q![1])) : [];
  const equal = dists.length > 0 && Math.max(...dists) - Math.min(...dists) < 0.05;
  const K = 4;

  return (
    <Shell
      play={play}
      question={question}
      title="Circle Geometry Explorer"
      mission="Tap the board to drop Q. Three compass arms measure from Q to three points on the circle; when all three read the same, Q is the centre and can be locked. Then run the measuring tape from Q through O to P."
      icon={CircleDashed}
      dim="2D"
      submitLabel="Submit QP"
      hints={["Every point of a circle is one radius away from its centre.", "QP is made of two parts: QO and OP."]}
      live={
        <>
          <Gauge label="Compass arms" value={dists.length ? dists.map((d) => d.toFixed(1)).join(" / ") : "—"} tone={equal ? "emerald" : "amber"} />
          <Gauge label="QO" value={w.locked ? `${R} cm (radius)` : "—"} />
          <Gauge label="OP" value={`${OP} cm`} />
        </>
      }
    >
      <Board>
        <svg
          ref={svg}
          viewBox="0 0 110 72"
          className="w-full cursor-crosshair"
          onClick={(e) => {
            if (play.readOnly || w.locked) return;
            const q = clientToSvg(svg.current, e.clientX, e.clientY);
            if (!q) return;
            play.set({ q: [Math.round((q.x / K) * 2) / 2, Math.round((q.y / K) * 2) / 2], locked: false, taped: false });
          }}
        >
          {Array.from({ length: 28 }, (_, i) => <line key={i} x1={i * K} x2={i * K} y1={0} y2={72} stroke="#e0e7ff" strokeWidth={0.3} />)}
          {Array.from({ length: 19 }, (_, i) => <line key={`h${i}`} y1={i * K} y2={i * K} x1={0} x2={110} stroke="#e0e7ff" strokeWidth={0.3} />)}
          <circle cx={C[0] * K} cy={C[1] * K} r={R * K} fill="#ede9fe" stroke="#6d28d9" strokeWidth={0.6} />
          {ring.map((p, i) => <circle key={i} cx={p[0] * K} cy={p[1] * K} r={0.9} fill="#6d28d9" />)}
          {w.q && ring.map((p, i) => <line key={`a${i}`} x1={w.q![0] * K} y1={w.q![1] * K} x2={p[0] * K} y2={p[1] * K} stroke={equal ? "#10b981" : "#f59e0b"} strokeWidth={0.4} strokeDasharray="1 1" />)}
          <line x1={P[0] * K} y1={P[1] * K} x2={O[0] * K} y2={O[1] * K} stroke="#0f172a" strokeWidth={0.5} />
          <circle cx={O[0] * K} cy={O[1] * K} r={1.2} fill="#0f172a" />
          <text x={O[0] * K + 1} y={O[1] * K - 2} fontSize={3.5} fontWeight={900}>O</text>
          <circle cx={P[0] * K} cy={P[1] * K} r={1.2} fill="#dc2626" />
          <text x={P[0] * K - 1} y={P[1] * K - 2} fontSize={3.5} fontWeight={900}>P</text>
          <text x={((P[0] + O[0]) * K) / 2} y={O[1] * K + 5} fontSize={3.2} textAnchor="middle">{OP} cm</text>
          {w.q && (
            <>
              <circle cx={w.q[0] * K} cy={w.q[1] * K} r={1.4} fill="#7c3aed" />
              <text x={w.q[0] * K + 1.5} y={w.q[1] * K + 4} fontSize={3.5} fontWeight={900}>Q</text>
            </>
          )}
          {w.taped && w.q && <line x1={w.q[0] * K} y1={w.q[1] * K + 0.1} x2={P[0] * K} y2={P[1] * K} stroke="#f59e0b" strokeWidth={1.2} />}
        </svg>
      </Board>
      <div className="flex flex-wrap gap-2">
        <Btn tone="emerald" disabled={play.readOnly || !equal || w.locked} onClick={() => play.patch({ locked: true })}>🔒 Lock Q as the centre</Btn>
        <Btn tone="amber" disabled={play.readOnly || !w.locked} onClick={() => play.patch({ taped: true })}>📏 Run the tape Q → O → P</Btn>
        {w.taped && w.q && <span className="self-center font-mono font-black">tape reads {+Math.hypot(P[0] - w.q[0], P[1] - w.q[1]).toFixed(2)} cm</span>}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — Symmetry Scanner
   The student turns a mirror line through the centre of each figure in 15° steps. The
   reflected figure (dashed) is drawn over the real one; when it lands exactly — shading
   included — that line is a line of symmetry. A figure is settled once a line is found or
   every angle has been tried.
   ══════════════════════════════════════════════════════════════════════ */

type Part = { fill: "none" | "shade" | "white"; pts: Pt[] };
const reflectPt = ([x, y]: Pt, deg: number): Pt => {
  const t = (2 * deg * Math.PI) / 180;
  return [x * Math.cos(t) + y * Math.sin(t), x * Math.sin(t) - y * Math.cos(t)];
};
const samePts = (a: Pt[], b: Pt[]) => a.length === b.length && a.every((p) => b.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.6));
const symmetricAt = (parts: Part[], deg: number) => parts.every((p) => parts.some((q) => q.fill === p.fill && samePts(p.pts.map((pt) => reflectPt(pt, deg)), q.pts)));
const ANGLES = Array.from({ length: 12 }, (_, i) => i * 15);
const FILL: Record<string, string> = { none: "#ede9fe", shade: "#7c3aed", white: "#ffffff" };

export function Q25SymmetryScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const shapes = cfg<Record<string, Part[]>>(question, "shapes", {});
  const ids = Object.keys(shapes);
  const found = (tried: Record<string, number[]>, id: string) => (tried[id] ?? []).some((m) => symmetricAt(shapes[id], m));
  const settled = (tried: Record<string, number[]>, id: string) => found(tried, id) || (tried[id] ?? []).length >= ANGLES.length;
  const play = usePlay<{ fig: string; mirror: number | null; tried: Record<string, number[]> }>({
    question,
    initial: { fig: ids[0] ?? "P", mirror: null, tried: {} },
    derive: (w) => {
      if (ids.some((id) => !settled(w.tried, id))) return { note: "Find a line of symmetry in each figure, or try every mirror angle." };
      const yes = ids.filter((id) => found(w.tried, id));
      const text = yes.length === ids.length ? listText(ids) : yes.length ? `Only ${listText(yes)}` : "None";
      return { value: yes.length ? `Lines found in ${listText(yes)}` : "No figure has a line", optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const parts = shapes[w.fig] ?? [];
  const hit = w.mirror !== null && symmetricAt(parts, w.mirror);
  const rad = ((w.mirror ?? 0) * Math.PI) / 180;
  const turn = (m: number) => play.set((p) => ({ ...p, mirror: m, tried: { ...p.tried, [p.fig]: Array.from(new Set([...(p.tried[p.fig] ?? []), m])) } }));

  return (
    <Shell
      play={play}
      question={question}
      title="Symmetry Scanner"
      mission="Pick a figure and turn the mirror line through its centre. The reflection (dashed) is drawn over the figure; when it lands exactly on it — shading too — you have found a line of symmetry. A figure is settled once you find a line or have tried every angle."
      icon={FlipHorizontal2}
      dim="2D"
      submitLabel="Submit the symmetric figures"
      hints={["Shading counts: a shaded part must land on a shaded part.", "A figure that only looks the same after turning has no line of symmetry."]}
      live={
        <>
          <Gauge label="Mirror" value={w.mirror === null ? "—" : `${w.mirror}° · ${hit ? "lands exactly" : "does not match"}`} tone={hit ? "emerald" : "slate"} />
          <Gauge label="Lines found in" value={ids.filter((id) => found(w.tried, id)).join(", ") || "—"} tone="violet" />
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {ids.map((id) => (
          <Btn key={id} active={w.fig === id} tone={w.fig === id ? "violet" : settled(w.tried, id) ? "emerald" : "slate"} onClick={() => play.patch({ fig: id, mirror: null })}>
            Figure {id}
          </Btn>
        ))}
      </div>
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <Board>
          <svg viewBox="-45 -45 90 90" className="w-full max-h-64">
            {parts.map((p, i) => (
              <path key={i} d={polyPath(p.pts)} fill={FILL[p.fill]} stroke="#4c1d95" strokeWidth={0.8} />
            ))}
            {w.mirror !== null && (
              <>
                {parts.map((p, i) => (
                  <path key={`r${i}`} d={polyPath(p.pts.map((pt) => reflectPt(pt, w.mirror!)))} fill={p.fill === "shade" ? (hit ? "#16a34a55" : "#dc262655") : "none"} stroke={hit ? "#16a34a" : "#dc2626"} strokeWidth={0.8} strokeDasharray="2 1.5" />
                ))}
                <line x1={-44 * Math.cos(rad)} y1={-44 * Math.sin(rad)} x2={44 * Math.cos(rad)} y2={44 * Math.sin(rad)} stroke="#0ea5e9" strokeWidth={1.2} />
              </>
            )}
          </svg>
        </Board>
        <Bay label={`Mirror angles tried on ${w.fig}: ${(w.tried[w.fig] ?? []).length}/${ANGLES.length}`} tone="violet">
          <div className="flex flex-wrap gap-1">
            {ANGLES.map((m) => (
              <Btn key={m} className="px-2 min-h-[32px] text-[11px]" active={w.mirror === m} tone={w.mirror === m ? "sky" : (w.tried[w.fig] ?? []).includes(m) ? "emerald" : "slate"} disabled={play.readOnly} onClick={() => turn(m)} ariaLabel={`mirror ${m}`}>
                {m}°
              </Btn>
            ))}
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

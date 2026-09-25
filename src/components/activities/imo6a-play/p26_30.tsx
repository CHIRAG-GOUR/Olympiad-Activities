"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Spline, SlidersHorizontal, Paintbrush, HardHat, CircleDot } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, toMixedString, round } from "../imo6a/shared";
import { usePointerDrag } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { clientToSvg } from "./svgPoint";

function useSvgPoint(svg: React.RefObject<SVGSVGElement | null>, vb: { x: number; y: number; w: number; h: number }) {
  void vb;
  return (cx: number, cy: number) => clientToSvg(svg.current, cx, cy);
}

/* ══════════════════════════════════════════════════════════════════════
   Q26 — Perimeter Builder (2D)
   The square and the four equilateral triangles are separate pieces. The student fits
   each triangle onto a side of the square, then drags a glowing tracer bead all the way
   round the outside. The tracer measures only the outline it actually walks.
   ══════════════════════════════════════════════════════════════════════ */

type Side = "top" | "right" | "bottom" | "left";
const SIDES: Side[] = ["top", "right", "bottom", "left"];

function outline(square: number, placed: Partial<Record<Side, number>>) {
  const s = square;
  const h = (t: number) => (t * Math.sqrt(3)) / 2;
  const pts: [number, number][] = [[0, 0]];
  const t = placed.top;
  if (t) pts.push([s / 2 - t / 2, 0], [s / 2, -h(t)], [s / 2 + t / 2, 0]);
  pts.push([s, 0]);
  const r = placed.right;
  if (r) pts.push([s, s / 2 - r / 2], [s + h(r), s / 2], [s, s / 2 + r / 2]);
  pts.push([s, s]);
  const b = placed.bottom;
  if (b) pts.push([s / 2 + b / 2, s], [s / 2, s + h(b)], [s / 2 - b / 2, s]);
  pts.push([0, s]);
  const l = placed.left;
  if (l) pts.push([0, s / 2 + l / 2], [-h(l), s / 2], [0, s / 2 - l / 2]);
  return pts;
}

function polyLength(pts: [number, number][]) {
  let L = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    L += Math.hypot(x2 - x1, y2 - y1);
  }
  return L;
}

/** Arc-length position of the point on the closed polyline nearest to (x, y). */
function project(pts: [number, number][], x: number, y: number) {
  let best = { d: Infinity, s: 0, px: 0, py: 0 };
  let acc = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    const L = Math.hypot(x2 - x1, y2 - y1);
    const t = L ? Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (L * L))) : 0;
    const px = x1 + t * (x2 - x1);
    const py = y1 + t * (y2 - y1);
    const d = Math.hypot(x - px, y - py);
    if (d < best.d) best = { d, s: acc + t * L, px, py };
    acc += L;
  }
  return best;
}

interface PerimWorld {
  placed: Partial<Record<Side, number>>;
  holding: number | null;
  traced: number;
  lap: boolean;
}

export function Q26PerimeterBuilder({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const square = cfg<number>(question, "squareSide", 8);
  const tris = cfg<{ name: string; side: number; on: Side }[]>(question, "triangles", []);
  const unit = cfg<string>(question, "unit", "cm");
  const svg = useRef<SVGSVGElement>(null);
  const vb = { x: -6, y: -6, w: square + 12, h: square + 12 };
  const at = useSvgPoint(svg, vb);
  const lastS = useRef<number | null>(null);
  const [bead, setBead] = useState<[number, number] | null>(null);

  const play = usePlay<PerimWorld>({
    question,
    initial: { placed: {}, holding: null, traced: 0, lap: false },
    derive: (w) => {
      const count = Object.keys(w.placed).length;
      if (count < tris.length) return { note: `Fit all ${tris.length} triangles onto the square (${count} fitted).` };
      if (!w.lap) return { note: "Drag the tracer bead all the way round the outside." };
      const P = round(polyLength(outline(square, w.placed)), 3);
      return { value: `${P} ${unit}`, optionId: matchNumber(question, P, 1e-3) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const pts = outline(square, w.placed);
  const P = polyLength(pts);

  const trace = usePointerDrag({
    disabled: readOnly,
    onStart: () => (lastS.current = null),
    onMove: (p) => {
      const q = at(p.x, p.y);
      if (!q) return;
      const hit = project(pts, q.x, q.y);
      if (hit.d > 1.5) return;
      setBead([hit.px, hit.py]);
      const prev = lastS.current ?? hit.s;
      lastS.current = hit.s;
      let d = hit.s - prev;
      if (d > P / 2) d -= P;
      if (d < -P / 2) d += P;
      if (d <= 0 || d > 2.5) return;
      play.set((pw) => {
        const traced = Math.min(P, pw.traced + d);
        return { ...pw, traced, lap: pw.lap || traced >= P - 0.05 };
      });
    },
  });

  // Which tray pieces are already on the square (a piece is identified by its index).
  const placedIdx = new Set<number>();
  Object.values(w.placed).forEach((side) => {
    const i = tris.findIndex((t, k) => t.side === side && !placedIdx.has(k));
    if (i >= 0) placedIdx.add(i);
  });

  return (
    <PlayShell
      title="Perimeter Builder"
      mission="Pick up a triangle from the tray and tap a side of the square to fit it there. When all four are fitted, drag the glowing tracer bead once all the way round the outside edge. It measures only the outline it walks."
      icon={Spline}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the measured perimeter"
      live={
        <>
          <Gauge label="Triangles fitted" value={`${Object.keys(w.placed).length} / ${tris.length}`} tone="violet" />
          <Gauge label="Tracer walked" value={`${round(w.traced, 2)} ${unit}`} tone="sky" />
          <Gauge label="Lap" value={w.lap ? "complete ✓" : "not yet"} tone={w.lap ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3">
        <Bay label="Build site">
          <svg ref={svg} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="w-full max-h-[360px]" style={{ touchAction: "none" }}>
            <rect x={0} y={0} width={square} height={square} fill="#ede9fe" stroke="#6d28d9" strokeWidth={0.08} />
            <text x={square / 2} y={square / 2} textAnchor="middle" fontSize={0.9} fontWeight={800} fill="#6d28d9">
              square {square} {unit}
            </text>
            <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="#c4b5fd" fillOpacity={0.35} stroke="#1e1b4b" strokeWidth={0.12} />
            {SIDES.map((sd) => {
              const seg: Record<Side, [number, number, number, number]> = {
                top: [0, 0, square, 0],
                right: [square, 0, square, square],
                bottom: [0, square, square, square],
                left: [0, 0, 0, square],
              };
              const [x1, y1, x2, y2] = seg[sd];
              return (
                <line
                  key={sd}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={w.holding !== null && !w.placed[sd] ? "#f59e0b" : "transparent"}
                  strokeWidth={w.holding !== null ? 0.9 : 0.1}
                  strokeOpacity={0.6}
                  style={{ cursor: w.holding !== null ? "pointer" : "default" }}
                  role="button"
                  aria-label={`${sd} side`}
                  onClick={() => {
                    if (play.readOnly || w.holding === null || w.placed[sd]) return;
                    play.set((p) => ({ ...p, placed: { ...p.placed, [sd]: tris[p.holding!].side }, holding: null, traced: 0, lap: false }));
                  }}
                />
              );
            })}
            {w.traced > 0 && (() => {
              // Glowing trail: the part of the outline already walked.
              let left = w.traced;
              const trail: string[] = [];
              for (let i = 0; i < pts.length && left > 0; i++) {
                const [x1, y1] = pts[i];
                const [x2, y2] = pts[(i + 1) % pts.length];
                const L = Math.hypot(x2 - x1, y2 - y1);
                const f = Math.min(1, left / L);
                trail.push(`M ${x1} ${y1} L ${x1 + (x2 - x1) * f} ${y1 + (y2 - y1) * f}`);
                left -= L;
              }
              return <path d={trail.join(" ")} stroke="#f59e0b" strokeWidth={0.35} fill="none" strokeLinecap="round" />;
            })()}
            {Object.keys(w.placed).length === tris.length && (
              <g onPointerDown={(e) => trace.start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: "grab", touchAction: "none" }}>
                <circle cx={(bead ?? pts[0])[0]} cy={(bead ?? pts[0])[1]} r={1.6} fill="transparent" />
                <circle cx={(bead ?? pts[0])[0]} cy={(bead ?? pts[0])[1]} r={0.55} fill="#f59e0b" stroke="#fff" strokeWidth={0.12}>
                  <animate attributeName="r" values="0.45;0.7;0.45" dur="1s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        </Bay>
        <Bay label="Triangle tray" tone="violet">
          <div className="grid grid-cols-2 gap-2">
            {tris.map((t, i) => {
              const onSquare = placedIdx.has(i);
              return (
                <button
                  key={t.name}
                  type="button"
                  disabled={play.readOnly || onSquare}
                  onClick={() => play.patch({ holding: w.holding === i ? null : i })}
                  className={`rounded-xl border-2 p-2 text-left ${w.holding === i ? "border-amber-500 bg-amber-50" : onSquare ? "border-slate-200 bg-slate-100 opacity-50" : "border-slate-200 bg-white"}`}
                >
                  <svg viewBox="-3 -3.2 6 3.6" className="w-full h-10">
                    <polygon points={`${-t.side / 2 * 0.6},0 0,${-(t.side * Math.sqrt(3)) / 2 * 0.6} ${t.side / 2 * 0.6},0`} fill="#c4b5fd" stroke="#1e1b4b" strokeWidth={0.08} />
                  </svg>
                  <div className="text-[11px] font-black text-slate-800">
                    {t.name} · side {t.side} {unit}
                  </div>
                  {onSquare && <div className="text-[10px] font-bold text-emerald-700">fitted</div>}
                </button>
              );
            })}
          </div>
          <Btn className="mt-2" disabled={play.readOnly} onClick={() => play.set({ placed: {}, holding: null, traced: 0, lap: false })}>
            Take all triangles off
          </Btn>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — Algebra Control Panel (2D)
   The expression is a control panel with an empty socket wherever a letter stands. The
   student slots value blocks into the sockets; each half of the panel evaluates itself as
   soon as its sockets are full, and the display reduces the quotient.
   ══════════════════════════════════════════════════════════════════════ */

interface Term {
  coef: number;
  vars: string[];
}
interface PanelWorld {
  sockets: Record<string, number | null>;
  holding: number | null;
}

export function Q27AlgebraPanel({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const vars = cfg<{ name: string; value: number }[]>(question, "variables", []);
  const num = cfg<{ terms: Term[] }>(question, "numerator", { terms: [] });
  const den = cfg<{ terms: Term[] }>(question, "denominator", { terms: [] });
  const socketIds = [...num.terms.flatMap((t, i) => t.vars.map((v, j) => `n${i}${j}`)), ...den.terms.flatMap((t, i) => t.vars.map((v, j) => `d${i}${j}`))];

  const evalPart = (terms: Term[], prefix: string, s: PanelWorld["sockets"]) => {
    let total = 0;
    for (let i = 0; i < terms.length; i++) {
      let v = terms[i].coef;
      for (let j = 0; j < terms[i].vars.length; j++) {
        const x = s[`${prefix}${i}${j}`];
        if (x === null || x === undefined) return null;
        v *= x;
      }
      total += v;
    }
    return total;
  };

  const play = usePlay<PanelWorld>({
    question,
    initial: { sockets: Object.fromEntries(socketIds.map((k) => [k, null])), holding: null },
    derive: (w) => {
      const N = evalPart(num.terms, "n", w.sockets);
      const D = evalPart(den.terms, "d", w.sockets);
      if (N === null || D === null) return { note: "Fill every socket with a value block." };
      if (D === 0) return { note: "The denominator reads 0 — the panel cannot divide." };
      return { value: toMixedString(N, D), optionId: matchNumber(question, N / D, 1e-9), note: `${N} ÷ ${D}` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const N = evalPart(num.terms, "n", w.sockets);
  const D = evalPart(den.terms, "d", w.sockets);

  const Row = ({ terms, prefix }: { terms: Term[]; prefix: string }) => (
    <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xl font-black">
      {terms.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-slate-500">{t.coef < 0 ? "−" : "+"}</span>}
          {(t.vars.length === 0 || Math.abs(t.coef) !== 1) && <span>{i === 0 ? t.coef : Math.abs(t.coef)}</span>}
          {t.vars.map((v, j) => {
            const id = `${prefix}${i}${j}`;
            const val = w.sockets[id];
            return (
              <button
                key={id}
                type="button"
                disabled={play.readOnly}
                onClick={() => play.set((p) => ({ ...p, sockets: { ...p.sockets, [id]: p.holding } }))}
                className={`relative w-12 h-12 rounded-lg border-2 grid place-items-center ${val !== null ? "bg-violet-600 border-violet-700 text-white" : "bg-white border-dashed border-violet-400 text-violet-300"}`}
                aria-label={`socket for ${v}`}
              >
                {val ?? v}
                <span className={`absolute -bottom-3.5 text-[9px] font-black ${val !== null ? "text-violet-700" : "text-violet-400"}`}>{v}</span>
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <PlayShell
      title="Algebra Control Panel"
      mission="Pick up a value block and tap a socket to plug it in. Every socket stands for a letter, so plug in the value that letter has. Each half of the panel lights up with its value as soon as it is full."
      icon={SlidersHorizontal}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the panel's value"
      live={
        <>
          <Gauge label="Top half" value={N ?? "—"} tone="violet" />
          <Gauge label="Bottom half" value={D ?? "—"} tone="violet" />
        </>
      }
    >
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 space-y-3">
        <Row terms={num.terms} prefix="n" />
        <div className="h-1 rounded bg-slate-900 mx-6 mt-4" />
        <Row terms={den.terms} prefix="d" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">GIVEN:</span>
        {vars.map((v) => (
          <span key={v.name} className="text-sm font-black font-mono bg-white border border-slate-200 rounded px-2 py-1">
            {v.name} = {v.value}
          </span>
        ))}
        <span className="mx-2 w-px h-8 bg-slate-200" />
        <span className="text-[10px] font-bold text-slate-500">VALUE BLOCKS:</span>
        {vars.map((v) => (
          <Btn key={v.name} tone="violet" active={w.holding === v.value} disabled={play.readOnly} onClick={() => play.patch({ holding: w.holding === v.value ? null : v.value })} className="w-12 text-lg">
            {v.value}
          </Btn>
        ))}
      </div>
      {N !== null && D !== null && D !== 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-lg font-black text-slate-800">
          {N} ÷ {D} = <span className="text-violet-700">{toMixedString(N, D)}</span>
        </motion.div>
      )}
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — Mirror Painter (2D)
   The printed grid with a movable mirror. The student chooses the mirror line; every
   shaded square's reflection appears as a ghost, and squares that break the symmetry
   glow red. Painting squares clears the red. The painted squares are the answer.
   ══════════════════════════════════════════════════════════════════════ */

type Axis = "vertical" | "horizontal" | "diagonal" | "anti-diagonal";
interface PaintWorld {
  axis: Axis | null;
  painted: string[];
}

export function Q28MirrorPainter({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const g = cfg<{ cols: number; rows: number; shaded: [number, number][]; labelled: { id: string; col: number; row: number }[] }>(question, "play", {
    cols: 5,
    rows: 5,
    shaded: [],
    labelled: [],
  });
  const reflect = (axis: Axis, c: number, r: number): [number, number] => {
    const n = g.cols - 1;
    const m = g.rows - 1;
    if (axis === "vertical") return [n - c, r];
    if (axis === "horizontal") return [c, m - r];
    if (axis === "diagonal") return [r, c];
    return [n - r, m - c];
  };

  const play = usePlay<PaintWorld>({
    question,
    initial: { axis: null, painted: [] },
    derive: (w) => {
      if (w.painted.length !== 2) return { note: "Paint exactly two lettered squares." };
      const [a, b] = [...w.painted].sort();
      const text = `${a} and ${b}`;
      return { value: text, optionId: matchText(question, text) ?? matchText(question, `${b} and ${a}`) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const filled = new Set(g.shaded.map(([c, r]) => `${c},${r}`));
  g.labelled.forEach((l) => w.painted.includes(l.id) && filled.add(`${l.col},${l.row}`));
  const broken = new Set<string>();
  if (w.axis)
    filled.forEach((k) => {
      const [c, r] = k.split(",").map(Number);
      const [c2, r2] = reflect(w.axis!, c, r);
      if (!filled.has(`${c2},${r2}`)) broken.add(`${c2},${r2}`);
    });
  const S = 20;

  return (
    <PlayShell
      title="Mirror Painter"
      mission="Stand the mirror along a line of the grid. Ghosts show where each shaded square's reflection must be, and red squares mark where symmetry breaks. Paint lettered squares until nothing glows red."
      icon={Paintbrush}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the painted squares"
      live={
        <>
          <Gauge label="Mirror" value={w.axis ?? "not placed"} tone="violet" />
          <Gauge label="Symmetry breaks" value={w.axis ? broken.size : "—"} tone={w.axis && broken.size === 0 ? "emerald" : "amber"} />
          <Gauge label="Painted" value={w.painted.length ? [...w.painted].sort().join(", ") : "—"} />
        </>
      }
    >
      <div className="grid sm:grid-cols-[auto_1fr] gap-4 items-start">
        <svg viewBox={`-6 -6 ${g.cols * S + 12} ${g.rows * S + 12}`} className="w-72">
          {Array.from({ length: g.rows }).flatMap((_, r) =>
            Array.from({ length: g.cols }).map((__, c) => {
              const k = `${c},${r}`;
              const label = g.labelled.find((l) => l.col === c && l.row === r);
              const isFilled = filled.has(k);
              const isPainted = !!label && w.painted.includes(label.id);
              return (
                <g
                  key={k}
                  role={label ? "button" : undefined}
                  aria-label={label ? `square ${label.id}` : undefined}
                  onClick={() => {
                    if (!label || play.readOnly) return;
                    play.set((p) => ({ ...p, painted: p.painted.includes(label.id) ? p.painted.filter((x) => x !== label.id) : [...p.painted, label.id] }));
                  }}
                  style={{ cursor: label ? "pointer" : "default" }}
                >
                  <rect x={c * S} y={r * S} width={S} height={S} fill={isPainted ? "#a78bfa" : isFilled ? "#94a3b8" : "#fff"} stroke="#1e1b4b" strokeWidth={0.6} />
                  {broken.has(k) && (
                    <rect x={c * S + 1.5} y={r * S + 1.5} width={S - 3} height={S - 3} fill="none" stroke="#e11d48" strokeWidth={1.4}>
                      <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                    </rect>
                  )}
                  {label && (
                    <text x={c * S + S / 2} y={r * S + S / 2 + 3.5} textAnchor="middle" fontSize={10} fontWeight={900} fill={isPainted ? "#fff" : "#1e1b4b"}>
                      {label.id}
                    </text>
                  )}
                </g>
              );
            })
          )}
          {w.axis && (
            <motion.line
              key={w.axis}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x1={w.axis === "vertical" ? (g.cols * S) / 2 : w.axis === "anti-diagonal" ? g.cols * S + 4 : -4}
              y1={w.axis === "horizontal" ? (g.rows * S) / 2 : -4}
              x2={w.axis === "vertical" ? (g.cols * S) / 2 : w.axis === "anti-diagonal" ? -4 : g.cols * S + 4}
              y2={w.axis === "horizontal" ? (g.rows * S) / 2 : g.rows * S + 4}
              stroke="#0ea5e9"
              strokeWidth={1.6}
              strokeDasharray="4 2"
            />
          )}
        </svg>
        <Bay label="Mirror line" tone="violet">
          <div className="grid grid-cols-2 gap-1.5">
            {(["vertical", "horizontal", "diagonal", "anti-diagonal"] as Axis[]).map((a) => (
              <Btn key={a} active={w.axis === a} disabled={play.readOnly} onClick={() => play.patch({ axis: a })}>
                {a === "diagonal" ? "╲ diagonal" : a === "anti-diagonal" ? "╱ diagonal" : a === "vertical" ? "│ vertical" : "─ horizontal"}
              </Btn>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500 font-semibold">Only the lettered squares can be painted. Tap one again to wash it off.</p>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q29 — Area Construction Site (2D)
   The composite plot is a construction blueprint. The student runs saw cuts along the
   guide lines to split it into pieces, and pours concrete piece by piece. A piece can
   only be poured once it is a true rectangle the site crew can measure.
   ══════════════════════════════════════════════════════════════════════ */

interface SiteWorld {
  cuts: string[];
  poured: string[];
}

function pointInPoly(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function Q29ConstructionSite({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const poly = cfg<[number, number][]>(question, "outline", []);
  const unit = cfg<string>(question, "unit", "sq. cm");
  const W = cfg<number>(question, "width", 6);
  const H = cfg<number>(question, "height", 6);

  const xs = useMemo(() => [...new Set(poly.map((p) => p[0]))].sort((a, b) => a - b), [poly]);
  const ys = useMemo(() => [...new Set(poly.map((p) => p[1]))].sort((a, b) => a - b), [poly]);
  const cells = useMemo(() => {
    const out: { i: number; j: number }[] = [];
    for (let i = 0; i < xs.length - 1; i++)
      for (let j = 0; j < ys.length - 1; j++) if (pointInPoly((xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2, poly)) out.push({ i, j });
    return out;
  }, [xs, ys, poly]);
  const guides = [...xs.slice(1, -1).map((x) => `v${x}`), ...ys.slice(1, -1).map((y) => `h${y}`)];

  const piecesOf = (cuts: string[]) => {
    const key = (c: { i: number; j: number }) => `${c.i}:${c.j}`;
    const inside = new Set(cells.map(key));
    const seen = new Set<string>();
    const pieces: { id: string; cells: { i: number; j: number }[] }[] = [];
    for (const c of cells) {
      if (seen.has(key(c))) continue;
      const stack = [c];
      const group: { i: number; j: number }[] = [];
      seen.add(key(c));
      while (stack.length) {
        const cur = stack.pop()!;
        group.push(cur);
        const nbrs = [
          { i: cur.i + 1, j: cur.j, wall: `v${xs[cur.i + 1]}` },
          { i: cur.i - 1, j: cur.j, wall: `v${xs[cur.i]}` },
          { i: cur.i, j: cur.j + 1, wall: `h${ys[cur.j + 1]}` },
          { i: cur.i, j: cur.j - 1, wall: `h${ys[cur.j]}` },
        ];
        for (const n of nbrs) {
          const k = key(n);
          if (!inside.has(k) || seen.has(k) || cuts.includes(n.wall)) continue;
          seen.add(k);
          stack.push(n);
        }
      }
      const id = group.map(key).sort().join("|");
      pieces.push({ id, cells: group });
    }
    return pieces.map((p) => {
      const i0 = Math.min(...p.cells.map((c) => c.i));
      const i1 = Math.max(...p.cells.map((c) => c.i));
      const j0 = Math.min(...p.cells.map((c) => c.j));
      const j1 = Math.max(...p.cells.map((c) => c.j));
      const rect = p.cells.length === (i1 - i0 + 1) * (j1 - j0 + 1);
      const w = xs[i1 + 1] - xs[i0];
      const h = ys[j1 + 1] - ys[j0];
      const area = p.cells.reduce((t, c) => t + (xs[c.i + 1] - xs[c.i]) * (ys[c.j + 1] - ys[c.j]), 0);
      return { ...p, rect, w, h, x0: xs[i0], y0: ys[j0], area };
    });
  };

  const play = usePlay<SiteWorld>({
    question,
    initial: { cuts: [], poured: [] },
    derive: (w) => {
      const pieces = piecesOf(w.cuts);
      const left = pieces.filter((p) => !w.poured.includes(p.id));
      if (left.length) return { note: `${left.length} piece(s) still to pour.` };
      const total = round(pieces.reduce((t, p) => t + p.area, 0), 3);
      return { value: `${total} ${unit}`, optionId: matchNumber(question, total, 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const pieces = piecesOf(w.cuts);
  const S = 14;
  const X = (x: number) => 4 + x * S;
  const Y = (y: number) => 4 + (H - y) * S;
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <PlayShell
      title="Area Construction Site"
      mission="Tap a dashed guide line to run a saw cut along it (tap again to undo). Tap a piece to pour concrete into it. The crew can only measure and pour a piece that is a true rectangle. Pour the whole site."
      icon={HardHat}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the site's area"
      live={
        <>
          <Gauge label="Pieces" value={pieces.length} tone="violet" />
          <Gauge label="Poured" value={`${pieces.filter((p) => w.poured.includes(p.id)).length} / ${pieces.length}`} />
          <Gauge label="Concrete so far" value={`${round(pieces.filter((p) => w.poured.includes(p.id)).reduce((t, p) => t + p.area, 0), 2)} ${unit}`} tone="sky" />
          {msg && <Gauge label="Site crew" value={msg} tone="amber" />}
        </>
      }
    >
      <div className="rounded-2xl bg-[#1e3a8a] p-2">
        <svg viewBox={`0 0 ${W * S + 8} ${H * S + 8}`} className="w-full max-h-[380px]">
          {pieces.map((p) => {
            const poured = w.poured.includes(p.id);
            return (
              <g
                key={p.id}
                role="button"
                aria-label={`piece ${p.x0},${p.y0}`}
                onClick={() => {
                  if (play.readOnly) return;
                  if (!p.rect) {
                    setMsg("That piece is not a rectangle — cut it first.");
                    return;
                  }
                  setMsg(null);
                  play.set((pw) => ({ ...pw, poured: pw.poured.includes(p.id) ? pw.poured.filter((x) => x !== p.id) : [...pw.poured, p.id] }));
                }}
                style={{ cursor: "pointer" }}
              >
                {p.cells.map((c) => (
                  <rect
                    key={`${c.i}:${c.j}`}
                    x={X(xs[c.i])}
                    y={Y(ys[c.j + 1])}
                    width={(xs[c.i + 1] - xs[c.i]) * S}
                    height={(ys[c.j + 1] - ys[c.j]) * S}
                    fill={poured ? "#cbd5e1" : p.rect ? "#93c5fd" : "#60a5fa"}
                    fillOpacity={poured ? 1 : 0.35}
                  />
                ))}
                {p.rect && (
                  <text x={X(p.x0 + p.w / 2)} y={Y(p.y0 + p.h / 2) + 1.5} textAnchor="middle" fontSize={3.6} fontWeight={800} fill={poured ? "#1e293b" : "#e0f2fe"} pointerEvents="none">
                    {p.w} × {p.h}
                    {poured ? ` = ${round(p.area, 2)}` : ""}
                  </text>
                )}
              </g>
            );
          })}
          <polygon points={poly.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")} fill="none" stroke="#e0f2fe" strokeWidth={0.8} />
          {guides.map((gd) => {
            const on = w.cuts.includes(gd);
            const isV = gd[0] === "v";
            const v = Number(gd.slice(1));
            return (
              <line
                key={gd}
                x1={isV ? X(v) : X(0)}
                x2={isV ? X(v) : X(W)}
                y1={isV ? Y(0) : Y(v)}
                y2={isV ? Y(H) : Y(v)}
                stroke={on ? "#fbbf24" : "#bfdbfe"}
                strokeWidth={on ? 0.9 : 0.5}
                strokeDasharray={on ? undefined : "2 1.5"}
                style={{ cursor: "pointer" }}
                onClick={() => !play.readOnly && play.set((pw) => ({ cuts: pw.cuts.includes(gd) ? pw.cuts.filter((x) => x !== gd) : [...pw.cuts, gd], poured: [] }))}
              />
            );
          })}
          {guides.map((gd) => {
            const isV = gd[0] === "v";
            const v = Number(gd.slice(1));
            return (
              <line
                key={`hit-${gd}`}
                role="button"
                aria-label={`cut ${gd}`}
                x1={isV ? X(v) : X(0)}
                x2={isV ? X(v) : X(W)}
                y1={isV ? Y(0) : Y(v)}
                y2={isV ? Y(H) : Y(v)}
                stroke="transparent"
                strokeWidth={3}
                style={{ cursor: "pointer" }}
                onClick={() => !play.readOnly && play.set((pw) => ({ cuts: pw.cuts.includes(gd) ? pw.cuts.filter((x) => x !== gd) : [...pw.cuts, gd], poured: [] }))}
              />
            );
          })}
        </svg>
      </div>
      <p className="text-[11px] text-slate-500 font-semibold">Measurements are in centimetres, read from the printed figure.</p>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — Circle Statement Lab (2D)
   Two benches, one per statement. On the first the student walks a point on a tether and
   sees what path it traces. On the second they choose which boundary pieces enclose a
   region, and the lab names the region they built. Then they give each statement a verdict.
   ══════════════════════════════════════════════════════════════════════ */

interface CircleWorld {
  locked: boolean;
  trail: number[];
  sweptBins: number[];
  boundary: string[];
  built: string[];
  verdict: Record<string, "T" | "F" | undefined>;
}

export function Q30CircleLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const statements = cfg<{ id: string; text: string }[]>(question, "statements", []);
  const verdictOptions = cfg<Record<string, string>>(question, "verdictOptions", {});
  const kinds = cfg<{ id: string; label: string; name: string }[]>(question, "regionKinds", []);
  const svg = useRef<SVGSVGElement>(null);
  const at = useSvgPoint(svg, { x: 0, y: 0, w: 100, h: 100 });
  const [pt, setPt] = useState<[number, number]>([80, 50]);

  const play = usePlay<CircleWorld>({
    question,
    initial: { locked: true, trail: [], sweptBins: [], boundary: [], built: [], verdict: {} },
    derive: (w) => {
      if (statements.some((s) => !w.verdict[s.id])) return { note: "Run both experiments, then give each statement a verdict." };
      const key = statements.map((s) => w.verdict[s.id]).join("");
      const words = statements.map((s) => `${s.id}: ${w.verdict[s.id] === "T" ? "true" : "false"}`).join(", ");
      return { value: words, optionId: verdictOptions[key] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const closed = w.sweptBins.length >= 34;
  const walk = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const q = at(p.x, p.y);
      if (!q) return;
      let x = q.x;
      let y = q.y;
      if (w.locked) {
        const a = Math.atan2(y - 50, x - 50);
        x = 50 + 30 * Math.cos(a);
        y = 50 + 30 * Math.sin(a);
      }
      setPt([x, y]);
      const d = Math.hypot(x - 50, y - 50);
      const bin = Math.floor((((Math.atan2(y - 50, x - 50) * 180) / Math.PI + 360) % 360) / 10);
      play.set((pw) => ({
        ...pw,
        trail: [...pw.trail.slice(-240), Math.round(x * 10) / 10, Math.round(y * 10) / 10],
        sweptBins: pw.locked && Math.abs(d - 30) < 0.5 && !pw.sweptBins.includes(bin) ? [...pw.sweptBins, bin] : pw.sweptBins,
      }));
    },
  });

  const region = (() => {
    const b = [...w.boundary].sort().join("+");
    if (b === "arc+chord") return kinds.find((k) => k.id === "segment");
    if (b === "arc+radii") return kinds.find((k) => k.id === "sector");
    return undefined;
  })();

  const trailPath = w.trail.reduce((s, v, i) => (i % 2 ? s : s + `${i ? "L" : "M"} ${v} ${w.trail[i + 1]} `), "");

  return (
    <PlayShell
      title="Circle Statement Lab"
      mission="Bench I: drag the point around its tether, locked or unlocked, and see what path a point at a fixed distance traces. Bench II: pick the boundary pieces that enclose a region and read what the lab calls it. Then give each statement a verdict."
      icon={CircleDot}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit both verdicts"
      live={
        <>
          <Gauge label="Bench I path" value={closed ? "closed loop — a circle" : `${w.sweptBins.length * 10}° swept`} tone={closed ? "emerald" : "violet"} />
          <Gauge label="Bench II region" value={region ? region.name : "—"} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <Bay label={`Bench I — Statement ${statements[0]?.id ?? "I"}`}>
          <p className="text-[11px] font-semibold text-slate-600 mb-1">{statements[0]?.text}</p>
          <svg ref={svg} viewBox="0 0 100 100" className="w-full max-h-64 bg-white rounded-xl border border-slate-200" style={{ touchAction: "none" }}>
            <path d={trailPath} stroke="#7c3aed" strokeWidth={0.8} fill="none" />
            <line x1={50} y1={50} x2={pt[0]} y2={pt[1]} stroke={w.locked ? "#0f172a" : "#94a3b8"} strokeWidth={0.6} strokeDasharray={w.locked ? undefined : "2 1"} />
            <circle cx={50} cy={50} r={1.6} fill="#0f172a" />
            <text x={52} y={48} fontSize={4} fontWeight={800}>
              O
            </text>
            <g onPointerDown={(e) => walk.start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: "grab", touchAction: "none" }}>
              <circle cx={pt[0]} cy={pt[1]} r={6} fill="transparent" />
              <circle cx={pt[0]} cy={pt[1]} r={2.4} fill="#f59e0b" stroke="#fff" strokeWidth={0.6} />
            </g>
          </svg>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Btn active={w.locked} disabled={play.readOnly} onClick={() => play.patch({ locked: !w.locked, trail: [], sweptBins: [] })}>
              {w.locked ? "🔒 Distance locked" : "🔓 Distance free"}
            </Btn>
            <Btn disabled={play.readOnly} onClick={() => play.patch({ trail: [], sweptBins: [] })}>
              Wipe trail
            </Btn>
          </div>
        </Bay>
        <Bay label={`Bench II — Statement ${statements[1]?.id ?? "II"}`}>
          <p className="text-[11px] font-semibold text-slate-600 mb-1">{statements[1]?.text}</p>
          <svg viewBox="0 0 100 100" className="w-full max-h-64 bg-white rounded-xl border border-slate-200">
            <circle cx={50} cy={50} r={32} fill="none" stroke="#cbd5e1" strokeWidth={0.8} />
            {region?.id === "segment" && <path d="M 22.3 34 A 32 32 0 0 1 77.7 34 Z" fill="#a78bfa" fillOpacity={0.5} />}
            {region?.id === "sector" && <path d="M 50 50 L 22.3 34 A 32 32 0 0 1 77.7 34 Z" fill="#38bdf8" fillOpacity={0.5} />}
            {w.boundary.includes("arc") && <path d="M 22.3 34 A 32 32 0 0 1 77.7 34" stroke="#1e1b4b" strokeWidth={1.4} fill="none" />}
            {w.boundary.includes("chord") && <line x1={22.3} y1={34} x2={77.7} y2={34} stroke="#be123c" strokeWidth={1.4} />}
            {w.boundary.includes("radii") && <path d="M 22.3 34 L 50 50 L 77.7 34" stroke="#0369a1" strokeWidth={1.4} fill="none" />}
            <circle cx={50} cy={50} r={1.2} fill="#0f172a" />
            {region && (
              <text x={50} y={90} textAnchor="middle" fontSize={7} fontWeight={900} fill="#1e1b4b">
                This region is a {region.name.toUpperCase()}
              </text>
            )}
          </svg>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              { id: "arc", label: "arc" },
              { id: "chord", label: "chord" },
              { id: "radii", label: "two radii" },
            ].map((b) => (
              <Btn
                key={b.id}
                active={w.boundary.includes(b.id)}
                disabled={play.readOnly}
                onClick={() =>
                  play.set((pw) => {
                    const boundary = pw.boundary.includes(b.id) ? pw.boundary.filter((x) => x !== b.id) : [...pw.boundary, b.id];
                    const key = [...boundary].sort().join("+");
                    const built = key === "arc+chord" || key === "arc+radii" ? [...new Set([...pw.built, key])] : pw.built;
                    return { ...pw, boundary, built };
                  })
                }
              >
                {b.label}
              </Btn>
            ))}
          </div>
        </Bay>
      </div>
      <Bay label="Verdicts" tone="violet">
        <div className="space-y-2">
          {statements.map((s, i) => {
            const ready = i === 0 ? closed : w.built.length > 0;
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-800 w-28">Statement-{s.id}</span>
                {(["T", "F"] as const).map((v) => (
                  <Btn
                    key={v}
                    tone={v === "T" ? "emerald" : "rose"}
                    active={w.verdict[s.id] === v}
                    disabled={play.readOnly || !ready}
                    onClick={() => play.set((pw) => ({ ...pw, verdict: { ...pw.verdict, [s.id]: v } }))}
                  >
                    {v === "T" ? "TRUE" : "FALSE"}
                  </Btn>
                ))}
                {!ready && <span className="text-[11px] text-slate-400 font-semibold">run bench {s.id} first</span>}
              </div>
            );
          })}
        </div>
      </Bay>
    </PlayShell>
  );
}

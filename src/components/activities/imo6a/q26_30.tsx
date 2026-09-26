"use client";

import React, { useMemo } from "react";
import { Footprints, FlaskConical, Grid2x2, Shapes, CircleDashed } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchText, toMixedString, round } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q26 — Perimeter Walker
   Decide, side by side, whether the outline goes over each triangle.
   ══════════════════════════════════════════════════════════════ */

interface WalkState {
  overPeak: Record<string, boolean>;
  walked: number;
}

export function Q26PerimeterWalkerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<WalkState>) {
  const cfg = question?.customConfig ?? {};
  const side: number = cfg.squareSide ?? 0;
  const triangles: { name: string; side: number; on: string }[] = cfg.triangles ?? [];
  const unit: string = cfg.unit ?? "cm";

  /** Going over a triangle swaps its base for the triangle's other two sides. */
  const lengthFor = (t: { side: number }, over: boolean) => (over ? side - t.side + 2 * t.side : side);

  const totalFor = (over: Record<string, boolean>) =>
    triangles.reduce((sum, t) => sum + lengthFor(t, Boolean(over[t.on])), 0);

  const engine = useActivityEngine<WalkState, string>({
    initialState: { overPeak: {}, walked: 0 },
    resolve: (s) => (s.walked < 1 ? undefined : matchNumber(question, totalFor(s.overPeak))),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { overPeak, walked } = engine.state;
  const total = totalFor(overPeak);
  const odometer = round(total * walked, 2);

  const SIDE_POS: Record<string, { x: number; y: number; rot: number }> = {
    top: { x: 50, y: 22, rot: 0 },
    right: { x: 78, y: 50, rot: 90 },
    bottom: { x: 50, y: 78, rot: 180 },
    left: { x: 22, y: 50, rot: 270 },
  };

  return (
    <ActivityShell
      title="Perimeter Walker"
      howTo="For each side, decide whether the outside edge climbs over the triangle or runs straight along its base. Then send the walker round — the odometer adds up every stretch it actually covers."
      icon={Footprints}
      answerText={walked >= 1 ? `${total} ${unit}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Set every side, then walk the full circuit"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[1fr_1fr] gap-3">
        <Stage label="The figure">
          <svg viewBox="0 0 100 100" className="w-full aspect-square">
            <rect x="0" y="0" width="100" height="100" fill="#fff" />
            <rect x="28" y="28" width="44" height="44" fill="#f1f5f9" stroke="#334155" strokeWidth="1.4" />
            {triangles.map((t) => {
              const p = SIDE_POS[t.on];
              if (!p) return null;
              const half = (t.side / side) * 22;
              const h = half * 1.4;
              const over = Boolean(overPeak[t.on]);
              return (
                <g key={t.on} transform={`rotate(${p.rot} 50 50)`}>
                  <polygon
                    points={`${50 - half},28 ${50 + half},28 50,${28 - h}`}
                    fill={over ? "#dcfce7" : "#f8fafc"}
                    stroke={over ? "#059669" : "#94a3b8"}
                    strokeWidth="1.3"
                    strokeDasharray={over ? undefined : "2 2"}
                  />
                  <text x="50" y={24 - h} textAnchor="middle" fontSize="4.4" fontWeight="800" fill="#475569">
                    {t.side}
                  </text>
                </g>
              );
            })}
            <text x="50" y="53" textAnchor="middle" fontSize="5" fontWeight="800" fill="#64748b">
              side {side}
            </text>
          </svg>
        </Stage>

        <div className="space-y-2.5">
          <Stage label="Route on each side">
            <div className="space-y-1.5">
              {triangles.map((t) => (
                <div key={t.on} className="flex flex-wrap items-center gap-1.5">
                  <span className="w-[86px] text-[11px] font-bold text-slate-600">
                    {t.name} <span className="text-slate-400">({t.on})</span>
                  </span>
                  <Tile
                    active={Boolean(overPeak[t.on])}
                    readOnly={engine.readOnly}
                    onClick={() =>
                      engine.update((p) => ({
                        ...p,
                        overPeak: { ...p.overPeak, [t.on]: !p.overPeak[t.on] },
                        walked: 0,
                      }))
                    }
                    className="px-2.5 text-[11px]"
                  >
                    {overPeak[t.on] ? "Over the peak" : "Straight across"}
                  </Tile>
                  <Metric label="this side" value={`${lengthFor(t, Boolean(overPeak[t.on]))} ${unit}`} />
                </div>
              ))}
            </div>
          </Stage>

          <Stage label="Walk the circuit">
            <NumberScale
              min={0}
              max={1}
              step={0.05}
              value={walked}
              onChange={(v) => engine.update((p) => ({ ...p, walked: v }))}
              readOnly={engine.readOnly}
              label="Distance walked"
              format={(v) => `${Math.round(v * 100)}%`}
              ticks={false}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Metric label="Odometer" value={`${odometer} ${unit}`} tone={walked >= 1 ? "emerald" : "slate"} />
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q27 — Substitution Lab
   Load each variable, then read the numerator and denominator separately.
   ══════════════════════════════════════════════════════════════ */

interface Term {
  coef: number;
  vars: string[];
}
interface SubState {
  values: Record<string, number | null>;
}

const showTerm = (t: Term) =>
  `${t.coef > 0 ? "+" : "−"} ${Math.abs(t.coef)}${t.vars.join("")}`;

export function Q27SubstitutionLabActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<SubState>) {
  const cfg = question?.customConfig ?? {};
  const variables: { name: string; value: number; min: number; max: number }[] = cfg.variables ?? [];
  const numer: { terms: Term[] } = cfg.numerator ?? { terms: [] };
  const denom: { terms: Term[] } = cfg.denominator ?? { terms: [] };

  const evalSide = (terms: Term[], vals: Record<string, number | null>) => {
    let total = 0;
    for (const t of terms) {
      let v = t.coef;
      for (const name of t.vars) {
        const x = vals[name];
        if (x === null || x === undefined) return undefined;
        v *= x;
      }
      total += v;
    }
    return total;
  };

  const engine = useActivityEngine<SubState, string>({
    initialState: { values: Object.fromEntries(variables.map((v) => [v.name, null])) },
    resolve: (s) => {
      const n = evalSide(numer.terms, s.values);
      const d = evalSide(denom.terms, s.values);
      if (n === undefined || d === undefined || d === 0) return undefined;
      return matchNumber(question, n / d, 1e-9);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const vals = engine.state.values;
  const n = evalSide(numer.terms, vals);
  const d = evalSide(denom.terms, vals);
  const ready = n !== undefined && d !== undefined && d !== 0;

  return (
    <ActivityShell
      title="Substitution Lab"
      howTo="Load each variable into its socket. The lab works the numerator and the denominator out separately and reduces the result to a mixed number."
      icon={FlaskConical}
      answerText={ready ? toMixedString(n as number, d as number) : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Set a value for every variable"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Variable sockets">
          <div className="grid sm:grid-cols-2 gap-3">
            {variables.map((v) => (
              <NumberScale
                key={v.name}
                min={v.min}
                max={v.max}
                step={1}
                value={vals[v.name] ?? null}
                onChange={(x) => engine.update((p) => ({ values: { ...p.values, [v.name]: x } }))}
                readOnly={engine.readOnly}
                label={`${v.name} =`}
              />
            ))}
          </div>
        </Stage>

        <Stage label="The expression">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex flex-wrap items-baseline justify-center gap-1.5">
              {numer.terms.map((t, i) => (
                <span key={i} className="font-mono text-sm font-bold text-slate-700">
                  {i === 0 ? `${t.coef}${t.vars.join("")}` : showTerm(t)}
                </span>
              ))}
              <span className="ml-2 font-mono text-sm font-black text-emerald-700">
                = {n ?? "?"}
              </span>
            </div>
            <div className="h-0.5 bg-slate-700 w-56" />
            <div className="flex flex-wrap items-baseline justify-center gap-1.5">
              {denom.terms.map((t, i) => (
                <span key={i} className="font-mono text-sm font-bold text-slate-700">
                  {i === 0 ? `${t.coef}${t.vars.join("")}` : showTerm(t)}
                </span>
              ))}
              <span className="ml-2 font-mono text-sm font-black text-emerald-700">
                = {d ?? "?"}
              </span>
            </div>
          </div>
          {ready && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              <Metric label="Exact value" value={`${n} / ${d}`} />
              <Metric label="As a mixed number" value={toMixedString(n as number, d as number)} tone="emerald" />
            </div>
          )}
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q28 — Symmetry Grid
   Switch candidate squares on and watch the mirror test.
   ══════════════════════════════════════════════════════════════ */

interface SymState {
  on: string[];
}

export function Q28SymmetryGridActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<SymState>) {
  const cfg = question?.customConfig ?? {};
  const cols: number = cfg.cols ?? 4;
  const rows: number = cfg.rows ?? 5;
  const preShaded: [number, number][] = cfg.shaded ?? [];
  const labelled: { id: string; col: number; row: number }[] = cfg.labelled ?? [];

  const engine = useActivityEngine<SymState, string>({
    initialState: { on: [] },
    resolve: (s) =>
      s.on.length !== 2 ? undefined : matchText(question, [...s.on].sort().join(" and ")),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { on } = engine.state;

  const shadedNow = useMemo(() => {
    const set = new Set(preShaded.map(([c, r]) => `${c},${r}`));
    labelled.forEach((l) => {
      if (on.includes(l.id)) set.add(`${l.col},${l.row}`);
    });
    return set;
  }, [preShaded, labelled, on]);

  // The printed figure is tested against its leading diagonal.
  const symmetric = useMemo(() => {
    const n = Math.min(cols, rows);
    for (let c = 0; c < n; c++) {
      for (let r = 0; r < n; r++) {
        if (shadedNow.has(`${c},${r}`) !== shadedNow.has(`${r},${c}`)) return false;
      }
    }
    return true;
  }, [shadedNow, cols, rows]);

  const toggle = (id: string) =>
    engine.update((p) => {
      if (p.on.includes(id)) return { on: p.on.filter((x) => x !== id) };
      if (p.on.length >= 2) return { on: [p.on[1], id] };
      return { on: [...p.on, id] };
    });

  return (
    <ActivityShell
      title="Symmetry Grid"
      howTo="Switch the labelled squares on and off. The mirror test runs live and tells you when the pattern has become symmetric."
      icon={Grid2x2}
      answerText={on.length === 2 ? [...on].sort().join(" and ") : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Shade exactly two of the labelled squares"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[auto_1fr] gap-3">
        <Stage label="The grid">
          <div className="inline-grid gap-px bg-slate-300" style={{ gridTemplateColumns: `repeat(${cols}, 2.5rem)` }}>
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const lab = labelled.find((l) => l.col === c && l.row === r);
                const isOn = shadedNow.has(`${c},${r}`);
                const isPre = preShaded.some(([pc, pr]) => pc === c && pr === r);
                return (
                  <button
                    key={`${c}-${r}`}
                    type="button"
                    disabled={engine.readOnly || !lab}
                    onClick={() => lab && toggle(lab.id)}
                    className={`h-10 grid place-items-center text-xs font-black transition ${
                      isOn
                        ? isPre
                          ? "bg-slate-400 text-white"
                          : "bg-emerald-600 text-white"
                        : lab
                        ? "bg-white hover:bg-emerald-50 text-slate-500"
                        : "bg-white text-slate-300"
                    }`}
                  >
                    {lab?.id ?? ""}
                  </button>
                );
              })
            )}
          </div>
        </Stage>

        <div className="space-y-2.5">
          <Stage label="Mirror test">
            <Conditions
              items={[
                { id: "count", label: "Exactly two labelled squares shaded", met: on.length === 2 },
                { id: "sym", label: "Pattern is symmetric about the axis", met: symmetric },
              ]}
            />
          </Stage>
          <Stage label="Currently shaded">
            <div className="flex flex-wrap gap-1.5">
              {labelled.map((l) => (
                <Metric key={l.id} label={l.id} value={on.includes(l.id) ? "on" : "off"} tone={on.includes(l.id) ? "emerald" : "slate"} />
              ))}
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q29 — Area Decomposer
   Cut the composite shape into rectangles and add their areas.
   ══════════════════════════════════════════════════════════════ */

interface Piece {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface AreaState {
  pieces: Piece[];
  anchor: { x: number; y: number } | null;
}

function pointInPolygon(x: number, y: number, poly: number[][]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export function Q29AreaDecomposerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<AreaState>) {
  const cfg = question?.customConfig ?? {};
  const outline: number[][] = cfg.outline ?? [];
  const grid: number = cfg.grid ?? 0.5;
  const W: number = cfg.width ?? 6;
  const H: number = cfg.height ?? 6;
  const unit: string = cfg.unit ?? "sq. cm";

  /** Every grid cell whose centre lies inside the printed outline. */
  const insideCells = useMemo(() => {
    const set = new Set<string>();
    for (let x = 0; x < W; x += grid) {
      for (let y = 0; y < H; y += grid) {
        if (pointInPolygon(x + grid / 2, y + grid / 2, outline)) set.add(`${x},${y}`);
      }
    }
    return set;
  }, [outline, grid, W, H]);

  const cellsOf = (p: Piece) => {
    const out: string[] = [];
    for (let x = p.x; x < p.x + p.w - 1e-9; x += grid) {
      for (let y = p.y; y < p.y + p.h - 1e-9; y += grid) {
        out.push(`${round(x, 4)},${round(y, 4)}`);
      }
    }
    return out;
  };

  const claimed = (pieces: Piece[]) => new Set(pieces.flatMap(cellsOf));

  const engine = useActivityEngine<AreaState, string>({
    initialState: { pieces: [], anchor: null },
    resolve: (s) => {
      if (s.pieces.length === 0) return undefined;
      // Only a complete, gap-free tiling counts as having measured the shape.
      const got = claimed(s.pieces);
      if (got.size !== insideCells.size) return undefined;
      const area = s.pieces.reduce((t, p) => t + p.w * p.h, 0);
      return matchNumber(question, round(area, 4), 1e-6);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { pieces, anchor } = engine.state;
  const got = claimed(pieces);
  const area = pieces.reduce((t, p) => t + p.w * p.h, 0);
  const complete = got.size === insideCells.size && pieces.length > 0;

  const tapCell = (cx: number, cy: number) =>
    engine.update((p) => {
      if (!p.anchor) return { ...p, anchor: { x: cx, y: cy } };
      const x = Math.min(p.anchor.x, cx);
      const y = Math.min(p.anchor.y, cy);
      const w = Math.abs(cx - p.anchor.x) + grid;
      const h = Math.abs(cy - p.anchor.y) + grid;
      const piece: Piece = { x: round(x, 4), y: round(y, 4), w: round(w, 4), h: round(h, 4) };
      const cells = cellsOf(piece);
      const existing = claimed(p.pieces);
      const ok = cells.every((c) => insideCells.has(c) && !existing.has(c));
      return ok ? { pieces: [...p.pieces, piece], anchor: null } : { ...p, anchor: null };
    });

  const SCALE = 100 / W;

  return (
    <ActivityShell
      title="Area Decomposer"
      howTo="Tap two opposite corners to lay a rectangle over the shape. A rectangle is accepted only if it lies entirely inside and does not overlap one you have already placed. Cover the whole shape and the areas add up."
      icon={Shapes}
      answerText={complete ? `${round(area, 2)} ${unit}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`Covered ${got.size} of ${insideCells.size} squares`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[1.1fr_1fr] gap-3">
        <Stage label="The figure">
          <svg viewBox={`0 0 100 ${H * SCALE}`} className="w-full" style={{ aspectRatio: `${W} / ${H}` }}>
            {/* y is flipped so the origin sits at the bottom-left, as the dimensions read */}
            <g transform={`translate(0 ${H * SCALE}) scale(${SCALE} ${-SCALE})`}>
              <polygon
                points={outline.map((p) => p.join(",")).join(" ")}
                fill="#f1f5f9"
                stroke="#334155"
                strokeWidth={1.2 / SCALE}
              />
              {pieces.map((p, i) => (
                <rect
                  key={i}
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  fill={["#a7f3d0", "#bae6fd", "#fde68a", "#fecdd3"][i % 4]}
                  fillOpacity="0.85"
                  stroke="#0f172a"
                  strokeWidth={0.8 / SCALE}
                />
              ))}
              {Array.from(insideCells).map((k) => {
                const [x, y] = k.split(",").map(Number);
                return (
                  <rect
                    key={k}
                    x={x}
                    y={y}
                    width={grid}
                    height={grid}
                    fill="transparent"
                    stroke="#cbd5e1"
                    strokeWidth={0.3 / SCALE}
                    style={{ cursor: engine.readOnly ? "default" : "pointer" }}
                    onClick={() => !engine.readOnly && tapCell(x, y)}
                  />
                );
              })}
              {anchor && (
                <rect
                  x={anchor.x}
                  y={anchor.y}
                  width={grid}
                  height={grid}
                  fill="#059669"
                  fillOpacity="0.6"
                  pointerEvents="none"
                />
              )}
            </g>
          </svg>
        </Stage>

        <div className="space-y-2.5">
          <Stage label="Pieces laid">
            {pieces.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                Nothing placed yet. Tap one corner square, then the opposite corner.
              </p>
            ) : (
              <ul className="space-y-1">
                {pieces.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5"
                  >
                    <span>
                      {p.w} × {p.h} = {round(p.w * p.h, 2)}
                    </span>
                    <button
                      type="button"
                      disabled={engine.readOnly}
                      onClick={() => engine.update((s) => ({ ...s, pieces: s.pieces.filter((_, j) => j !== i) }))}
                      className="text-slate-400 hover:text-rose-600 font-black px-1"
                      aria-label="Remove this piece"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Stage>
          <Stage label="Running total">
            <div className="flex flex-wrap gap-1.5">
              <Metric label="Area so far" value={`${round(area, 2)} ${unit}`} tone={complete ? "emerald" : "slate"} />
              <Metric label="Squares covered" value={`${got.size}/${insideCells.size}`} />
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q30 — Circle Workbench
   Test each statement on the bench before calling it true or false.
   ══════════════════════════════════════════════════════════════ */

interface CircleState {
  distance: number;
  traced: boolean;
  regionKind: string | null;
  verdicts: Record<string, "T" | "F" | null>;
}

export function Q30CircleWorkbenchActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<CircleState>) {
  const cfg = question?.customConfig ?? {};
  const statements: { id: string; text: string }[] = cfg.statements ?? [];
  const regionKinds: { id: string; label: string; name: string }[] = cfg.regionKinds ?? [];
  const verdictOptions: Record<string, string> = cfg.verdictOptions ?? {};

  const engine = useActivityEngine<CircleState, string>({
    initialState: { distance: 26, traced: false, regionKind: null, verdicts: { I: null, II: null } },
    resolve: (s) => {
      const a = s.verdicts[statements[0]?.id ?? "I"];
      const b = s.verdicts[statements[1]?.id ?? "II"];
      if (!a || !b) return undefined;
      return verdictOptions[`${a}${b}`];
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const built = regionKinds.find((k) => k.id === s.regionKind);

  const setVerdict = (id: string, v: "T" | "F") =>
    engine.update((p) => ({ ...p, verdicts: { ...p.verdicts, [id]: p.verdicts[id] === v ? null : v } }));

  const VerdictRow = ({ id, text, locked }: { id: string; text: string; locked: boolean }) => (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <span className="text-[11px] font-bold text-slate-600 flex-1 min-w-[170px]">{text}</span>
      {(["T", "F"] as const).map((v) => (
        <Tile
          key={v}
          active={s.verdicts[id] === v}
          readOnly={engine.readOnly || locked}
          onClick={() => setVerdict(id, v)}
          className="w-11 text-sm"
        >
          {v}
        </Tile>
      ))}
    </div>
  );

  return (
    <ActivityShell
      title="Circle Workbench"
      howTo="Run the test beside each statement — trace the locus, and build the region from an arc and a chord to see what it is really called — then mark each statement true or false."
      icon={CircleDashed}
      answerText={
        s.verdicts.I && s.verdicts.II
          ? `Statement I: ${s.verdicts.I} · Statement II: ${s.verdicts.II}`
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Test both statements and mark each one"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Stage label="Test for Statement I — trace the locus">
          <svg viewBox="0 0 100 100" className="w-full aspect-square bg-white rounded-lg border border-slate-200">
            <circle cx="50" cy="50" r="1.8" fill="#0f172a" />
            <text x="54" y="49" fontSize="4.4" fontWeight="700" fill="#64748b">
              fixed point
            </text>
            {s.traced && (
              <circle cx="50" cy="50" r={s.distance} fill="none" stroke="#059669" strokeWidth="1.6" strokeDasharray="3 2" />
            )}
            <line x1="50" y1="50" x2={50 + s.distance} y2="50" stroke="#0284c7" strokeWidth="1.1" />
            <circle cx={50 + s.distance} cy="50" r="2.4" fill="#0284c7" />
          </svg>
          <div className="mt-2">
            <NumberScale
              min={8}
              max={40}
              step={1}
              value={s.distance}
              onChange={(v) => engine.update((p) => ({ ...p, distance: v, traced: false }))}
              readOnly={engine.readOnly}
              label="Distance kept from the fixed point"
              ticks={false}
            />
            <Tile
              readOnly={engine.readOnly}
              active={s.traced}
              onClick={() => engine.update((p) => ({ ...p, traced: !p.traced }))}
              className="mt-2 px-3 text-[11px]"
            >
              {s.traced ? "Path traced" : "Sweep the point all the way round"}
            </Tile>
          </div>
          <VerdictRow id={statements[0]?.id ?? "I"} text={statements[0]?.text ?? ""} locked={!s.traced} />
        </Stage>

        <Stage label="Test for Statement II — build the region">
          <svg viewBox="0 0 100 100" className="w-full aspect-square bg-white rounded-lg border border-slate-200">
            <circle cx="50" cy="50" r="34" fill="none" stroke="#94a3b8" strokeWidth="1.3" />
            {s.regionKind === "segment" && (
              <path d="M 26 26 A 34 34 0 0 1 74 26 L 26 26 Z" fill="#fde68a" fillOpacity="0.7" stroke="#d97706" strokeWidth="1.4" />
            )}
            {s.regionKind === "sector" && (
              <path d="M 50 50 L 26 26 A 34 34 0 0 1 74 26 Z" fill="#bae6fd" fillOpacity="0.7" stroke="#0284c7" strokeWidth="1.4" />
            )}
            <circle cx="50" cy="50" r="1.5" fill="#0f172a" />
          </svg>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {regionKinds.map((k) => (
              <Tile
                key={k.id}
                active={s.regionKind === k.id}
                readOnly={engine.readOnly}
                onClick={() => engine.update((p) => ({ ...p, regionKind: p.regionKind === k.id ? null : k.id }))}
                className="px-2.5 text-[11px]"
              >
                {k.label}
              </Tile>
            ))}
          </div>
          {built && (
            <p className="mt-2 text-[11px] font-bold text-slate-700">
              What you built is called a <span className="text-emerald-700">{built.name}</span>.
            </p>
          )}
          <VerdictRow id={statements[1]?.id ?? "II"} text={statements[1]?.text ?? ""} locked={!built} />
        </Stage>
      </div>
    </ActivityShell>
  );
}

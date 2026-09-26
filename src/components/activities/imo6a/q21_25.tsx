"use client";

import React, { useMemo } from "react";
import { Spline, Compass, Ruler, Scale, Gauge } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchNumberList, matchText, round } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q21 — Line Arranger
   Slide and swing three lines; the board counts where they cross.
   ══════════════════════════════════════════════════════════════ */

interface LineDef {
  angle: number;
  offset: number;
}
interface LinesState {
  lines: LineDef[];
  active: number;
}

const CENTRE = 50;

function lineGeometry(l: LineDef) {
  const t = (l.angle * Math.PI) / 180;
  const dir = { x: Math.cos(t), y: Math.sin(t) };
  const normal = { x: -Math.sin(t), y: Math.cos(t) };
  const p = { x: CENTRE + l.offset * normal.x, y: CENTRE + l.offset * normal.y };
  return { p, dir };
}

function intersect(a: LineDef, b: LineDef) {
  const A = lineGeometry(a);
  const B = lineGeometry(b);
  const cross = A.dir.x * B.dir.y - A.dir.y * B.dir.x;
  if (Math.abs(cross) < 1e-9) return null; // parallel: they never meet
  const dx = B.p.x - A.p.x;
  const dy = B.p.y - A.p.y;
  const t = (dx * B.dir.y - dy * B.dir.x) / cross;
  return { x: A.p.x + t * A.dir.x, y: A.p.y + t * A.dir.y };
}

/** Distinct crossing points, with nearby points treated as one concurrency. */
function crossingPoints(lines: LineDef[]) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const p = intersect(lines[i], lines[j]);
      if (!p) continue;
      if (!pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 1.2)) pts.push(p);
    }
  }
  return pts;
}

export function Q21LineArrangerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<LinesState>) {
  const cfg = question?.customConfig ?? {};
  const count: number = cfg.lineCount ?? 3;

  const engine = useActivityEngine<LinesState, string>({
    initialState: {
      lines: Array.from({ length: count }, (_, i) => ({ angle: 30 + i * 40, offset: (i - 1) * 14 })),
      active: 0,
    },
    resolve: (s) => matchNumber(question, crossingPoints(s.lines).length),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { lines, active } = engine.state;
  const points = useMemo(() => crossingPoints(lines), [lines]);
  const sel = lines[active];

  const setLine = (patch: Partial<LineDef>) =>
    engine.update((p) => ({
      ...p,
      lines: p.lines.map((l, i) => (i === p.active ? { ...l, ...patch } : l)),
    }));

  const TONE = ["#059669", "#0284c7", "#e11d48"];

  return (
    <ActivityShell
      title="Three Lines Board"
      howTo="Swing and slide each of the three lines. The board marks every distinct point where lines cross and keeps the count — see how few crossing points you can get them down to."
      icon={Spline}
      answerText={`${points.length} crossing point${points.length === 1 ? "" : "s"}`}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Arrange the lines"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[1.1fr_1fr] gap-3">
        <Stage label="The board">
          <svg viewBox="0 0 100 100" className="w-full aspect-square">
            <rect x="0" y="0" width="100" height="100" fill="#fff" stroke="#e2e8f0" />
            {lines.map((l, i) => {
              const { p, dir } = lineGeometry(l);
              const L = 150;
              return (
                <line
                  key={i}
                  x1={p.x - dir.x * L}
                  y1={p.y - dir.y * L}
                  x2={p.x + dir.x * L}
                  y2={p.y + dir.y * L}
                  stroke={TONE[i % 3]}
                  strokeWidth={i === active ? 1.8 : 1.1}
                  opacity={i === active ? 1 : 0.75}
                />
              );
            })}
            {points.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="3.4" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
                <circle cx={pt.x} cy={pt.y} r="1.1" fill="#92400e" />
              </g>
            ))}
          </svg>
        </Stage>

        <div className="space-y-2.5">
          <Stage label="Choose a line">
            <div className="flex gap-1.5">
              {lines.map((_, i) => (
                <Tile
                  key={i}
                  active={active === i}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, active: i }))}
                  className="w-16 text-[11px]"
                >
                  Line {i + 1}
                </Tile>
              ))}
            </div>
          </Stage>
          <Stage label={`Line ${active + 1}`}>
            <NumberScale
              min={0}
              max={179}
              step={1}
              value={sel?.angle ?? 0}
              onChange={(v) => setLine({ angle: v })}
              readOnly={engine.readOnly}
              label="Direction"
              format={(v) => `${v}°`}
              ticks={false}
            />
            <div className="mt-2">
              <NumberScale
                min={-40}
                max={40}
                step={1}
                value={sel?.offset ?? 0}
                onChange={(v) => setLine({ offset: v })}
                readOnly={engine.readOnly}
                label="Slide across"
                ticks={false}
              />
            </div>
          </Stage>
          <Metric label="Distinct crossing points" value={points.length} tone="emerald" />
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q22 — Compass Bench
   Actually attempt each construction with a ruler and a pair of compasses.
   ══════════════════════════════════════════════════════════════ */

interface BenchState {
  circleRadius: number;
  circleDrawn: boolean;
  arcRadius: number;
  arcsDrawn: boolean;
  bisectorDrawn: boolean;
}

const SEG = { x1: 18, x2: 82, y: 58 };
const HALF = (SEG.x2 - SEG.x1) / 2;

export function Q22CompassBenchActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<BenchState>) {
  const cfg = question?.customConfig ?? {};
  const bothId: string = cfg.bothOptionId ?? "";
  const neitherId: string = cfg.neitherOptionId ?? "";
  const tasks: { id: string; label: string; optionId: string }[] = cfg.tasks ?? [];

  const engine = useActivityEngine<BenchState, string>({
    initialState: {
      circleRadius: 16,
      circleDrawn: false,
      arcRadius: Math.round(HALF) + 6,
      arcsDrawn: false,
      bisectorDrawn: false,
    },
    resolve: (s) => {
      const done = [s.circleDrawn, s.bisectorDrawn];
      if (done.every(Boolean)) return bothId || undefined;
      if (!done.some(Boolean)) return undefined;
      const idx = done.findIndex(Boolean);
      return tasks[idx]?.optionId;
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const arcsMeet = s.arcRadius > HALF;

  return (
    <ActivityShell
      title="Ruler and Compasses Bench"
      howTo="Try each construction for real. Set the compasses, sweep the arcs, and use the ruler — the bench records only the constructions you actually manage to complete."
      icon={Compass}
      answerText={
        s.circleDrawn && s.bisectorDrawn
          ? "Both constructions completed"
          : s.circleDrawn
          ? "Only the circle was completed"
          : s.bisectorDrawn
          ? "Only the bisector was completed"
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Complete at least one construction"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Stage label="Construction 1 — a circle of known radius">
          <svg viewBox="0 0 100 100" className="w-full aspect-square bg-white rounded-lg border border-slate-200">
            <line x1="10" y1="82" x2="46" y2="82" stroke="#94a3b8" strokeWidth="1" />
            <text x="28" y="90" textAnchor="middle" fontSize="5" fill="#64748b" fontWeight="700">
              radius = {s.circleRadius}
            </text>
            {s.circleDrawn && (
              <circle cx="50" cy="44" r={s.circleRadius} fill="#dcfce7" fillOpacity="0.5" stroke="#059669" strokeWidth="1.6" />
            )}
            <circle cx="50" cy="44" r="1.6" fill="#0f172a" />
            {!s.circleDrawn && (
              <line x1="50" y1="44" x2={50 + s.circleRadius} y2="44" stroke="#059669" strokeWidth="1.2" strokeDasharray="2 2" />
            )}
          </svg>
          <div className="mt-2">
            <NumberScale
              min={6}
              max={34}
              step={1}
              value={s.circleRadius}
              onChange={(v) => engine.update((p) => ({ ...p, circleRadius: v, circleDrawn: false }))}
              readOnly={engine.readOnly}
              label="Open the compasses"
              ticks={false}
            />
            <Tile
              readOnly={engine.readOnly}
              active={s.circleDrawn}
              onClick={() => engine.update((p) => ({ ...p, circleDrawn: !p.circleDrawn }))}
              className="mt-2 px-3 text-[11px]"
            >
              {s.circleDrawn ? "Circle drawn — undo" : "Sweep the circle"}
            </Tile>
          </div>
        </Stage>

        <Stage label="Construction 2 — perpendicular bisector of a segment">
          <svg viewBox="0 0 100 100" className="w-full aspect-square bg-white rounded-lg border border-slate-200">
            <line x1={SEG.x1} y1={SEG.y} x2={SEG.x2} y2={SEG.y} stroke="#0f172a" strokeWidth="1.8" />
            <circle cx={SEG.x1} cy={SEG.y} r="1.6" fill="#0f172a" />
            <circle cx={SEG.x2} cy={SEG.y} r="1.6" fill="#0f172a" />
            {s.arcsDrawn && (
              <>
                <circle cx={SEG.x1} cy={SEG.y} r={s.arcRadius} fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 1.6" />
                <circle cx={SEG.x2} cy={SEG.y} r={s.arcRadius} fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 1.6" />
              </>
            )}
            {s.bisectorDrawn && arcsMeet && (
              <line
                x1={(SEG.x1 + SEG.x2) / 2}
                y1={SEG.y - Math.sqrt(Math.max(0, s.arcRadius ** 2 - HALF ** 2))}
                x2={(SEG.x1 + SEG.x2) / 2}
                y2={SEG.y + Math.sqrt(Math.max(0, s.arcRadius ** 2 - HALF ** 2))}
                stroke="#059669"
                strokeWidth="1.8"
              />
            )}
          </svg>
          <div className="mt-2">
            <NumberScale
              min={10}
              max={44}
              step={1}
              value={s.arcRadius}
              onChange={(v) =>
                engine.update((p) => ({ ...p, arcRadius: v, arcsDrawn: false, bisectorDrawn: false }))
              }
              readOnly={engine.readOnly}
              label="Open the compasses"
              ticks={false}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Tile
                readOnly={engine.readOnly}
                active={s.arcsDrawn}
                onClick={() => engine.update((p) => ({ ...p, arcsDrawn: !p.arcsDrawn, bisectorDrawn: false }))}
                className="px-3 text-[11px]"
              >
                {s.arcsDrawn ? "Arcs drawn" : "Sweep arcs from both ends"}
              </Tile>
              <Tile
                readOnly={engine.readOnly || !s.arcsDrawn || !arcsMeet}
                active={s.bisectorDrawn}
                onClick={() => engine.update((p) => ({ ...p, bisectorDrawn: !p.bisectorDrawn }))}
                className="px-3 text-[11px]"
              >
                Join the crossings
              </Tile>
            </div>
            {s.arcsDrawn && !arcsMeet && (
              <p className="mt-1.5 text-[11px] font-semibold text-amber-700">
                The arcs are too small to meet — open the compasses wider than half the segment.
              </p>
            )}
          </div>
        </Stage>
      </div>

      <div className="mt-3">
        <Conditions
          items={[
            { id: "c", label: tasks[0]?.label ?? "Circle of a known radius", met: s.circleDrawn },
            { id: "b", label: tasks[1]?.label ?? "Perpendicular bisector", met: s.bisectorDrawn },
          ]}
        />
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q23 — Number Line Ruler
   Drag both ends of the segment and read the tape.
   ══════════════════════════════════════════════════════════════ */

interface RulerState {
  a: number;
  b: number;
}

export function Q23NumberLineRulerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<RulerState>) {
  const cfg = question?.customConfig ?? {};
  const min: number = cfg.min ?? -12;
  const max: number = cfg.max ?? 12;
  const ends: number[] = cfg.endpoints ?? [];
  const unit: string = cfg.unit ?? "cm";

  const engine = useActivityEngine<RulerState, string>({
    initialState: { a: 0, b: 0 },
    resolve: (s) => (s.a === s.b ? undefined : matchNumber(question, Math.abs(s.b - s.a))),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { a, b } = engine.state;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const pos = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <ActivityShell
      title="Number Line Tape"
      howTo={`Marks on this line are ${cfg.spacingCm ?? 1} ${unit} apart. Drag each end of the segment onto the number the question gives it — the tape counts the steps between them.`}
      icon={Ruler}
      answerText={a === b ? undefined : `${Math.abs(b - a)} ${unit}`}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Place both ends of the segment"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="The number line">
          <div className="relative h-24 px-1">
            <div className="absolute left-0 right-0 top-12 h-0.5 bg-slate-400" />
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((v) => (
              <div key={v} className="absolute top-9" style={{ left: `${pos(v)}%` }}>
                <div className={`w-px ${v % 5 === 0 ? "h-6 bg-slate-500" : "h-3 bg-slate-300"} -translate-x-1/2`} />
                {v % 5 === 0 && (
                  <span className="absolute top-7 -translate-x-1/2 text-[9px] font-mono font-bold text-slate-500">
                    {v}
                  </span>
                )}
              </div>
            ))}
            {a !== b && (
              <div
                className="absolute top-[42px] h-2 bg-emerald-400/60 rounded-full"
                style={{ left: `${pos(lo)}%`, width: `${pos(hi) - pos(lo)}%` }}
              />
            )}
            {(["a", "b"] as const).map((k, i) => (
              <div
                key={k}
                className="absolute top-3 -translate-x-1/2"
                style={{ left: `${pos(engine.state[k])}%` }}
              >
                <div
                  className={`w-7 h-7 rounded-full grid place-items-center text-[10px] font-black text-white shadow ${
                    i === 0 ? "bg-emerald-600" : "bg-sky-600"
                  }`}
                >
                  {i === 0 ? "A" : "B"}
                </div>
              </div>
            ))}
          </div>
        </Stage>

        <div className="grid sm:grid-cols-2 gap-3">
          <Stage label="End A">
            <NumberScale
              min={min}
              max={max}
              step={1}
              value={a}
              onChange={(v) => engine.update((p) => ({ ...p, a: v }))}
              readOnly={engine.readOnly}
              label="Position of end A"
            />
          </Stage>
          <Stage label="End B">
            <NumberScale
              min={min}
              max={max}
              step={1}
              value={b}
              onChange={(v) => engine.update((p) => ({ ...p, b: v }))}
              readOnly={engine.readOnly}
              label="Position of end B"
            />
          </Stage>
        </div>

        <Stage label="Reading">
          <div className="flex flex-wrap items-center gap-2">
            <Conditions
              items={ends.map((e, i) => ({
                id: String(i),
                label: `One end sits at ${e}`,
                met: a === e || b === e,
              }))}
            />
            <Metric label="Length of the segment" value={`${Math.abs(b - a)} ${unit}`} tone="emerald" />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q24 — Triple Balance
   Share the total between three tanks until the weighted beams level.
   ══════════════════════════════════════════════════════════════ */

interface BalanceState {
  first: number;
  second: number;
}

export function Q24TripleBalanceActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<BalanceState>) {
  const cfg = question?.customConfig ?? {};
  const total: number = cfg.total ?? 0;
  const mult: number[] = cfg.multipliers ?? [1, 1, 1];
  const labels: string[] = cfg.partLabels ?? ["First", "Second", "Third"];

  const engine = useActivityEngine<BalanceState, string>({
    initialState: { first: Math.round(total / 3), second: Math.round(total / 3) },
    resolve: (s) => {
      const third = total - s.first - s.second;
      if (third < 0) return undefined;
      const w = [s.first * mult[0], s.second * mult[1], third * mult[2]];
      const level = w.every((x) => x === w[0]);
      return level ? matchNumberList(question, [s.first, s.second, third]) : undefined;
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { first, second } = engine.state;
  const third = total - first - second;
  const weights = [first * mult[0], second * mult[1], third * mult[2]];
  const maxW = Math.max(...weights, 1);
  const level = weights.every((w) => w === weights[0]) && third >= 0;

  return (
    <ActivityShell
      title="Three-Beam Balance"
      howTo={`Share all ${total} units between the three tanks. Each beam lifts its tank's amount multiplied by its own factor — get all three beams to exactly the same height.`}
      icon={Scale}
      answerText={level ? `${first}, ${second}, ${third}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={third < 0 ? "You have shared out more than the total" : "Level all three beams"}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="The beams">
          <div className="flex items-end justify-center gap-5 h-[150px]">
            {weights.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 w-[86px]">
                <span className="font-mono text-[11px] font-black text-slate-700">{w}</span>
                <div
                  className={`w-full rounded-t-lg border-2 transition-[height] ${
                    level ? "bg-emerald-200 border-emerald-600" : "bg-slate-200 border-slate-400"
                  }`}
                  style={{ height: `${Math.max(4, (w / maxW) * 104)}px` }}
                />
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500 text-center leading-tight">
                  {labels[i]}
                  <br />× {mult[i]}
                </span>
              </div>
            ))}
          </div>
        </Stage>

        <div className="grid sm:grid-cols-2 gap-3">
          <Stage label={labels[0]}>
            <NumberScale
              min={0}
              max={total}
              step={1}
              value={first}
              onChange={(v) => engine.update((p) => ({ ...p, first: v }))}
              readOnly={engine.readOnly}
              label={labels[0]}
              ticks={false}
            />
          </Stage>
          <Stage label={labels[1]}>
            <NumberScale
              min={0}
              max={total}
              step={1}
              value={second}
              onChange={(v) => engine.update((p) => ({ ...p, second: v }))}
              readOnly={engine.readOnly}
              label={labels[1]}
              ticks={false}
            />
          </Stage>
        </div>

        <Stage label="Tally">
          <div className="flex flex-wrap gap-1.5">
            <Metric label={labels[0]} value={first} />
            <Metric label={labels[1]} value={second} />
            <Metric label={labels[2]} value={third} tone={third < 0 ? "amber" : "slate"} />
            <Metric label="Total shared" value={first + second + third} />
            <Metric label="Beams level" value={level ? "yes" : "no"} tone={level ? "emerald" : "slate"} />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q25 — Fraction Dialer
   Turn the numerator until the decimal gauge reads the target.
   ══════════════════════════════════════════════════════════════ */

interface DialState {
  numerator: number | null;
}

export function Q25FractionDialerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<DialState>) {
  const cfg = question?.customConfig ?? {};
  const den: number = cfg.denominator ?? 1;
  const target: number = cfg.targetDecimal ?? 0;
  const range = cfg.numeratorRange ?? { min: 0, max: den, step: 1 };

  const engine = useActivityEngine<DialState, string>({
    initialState: { numerator: null },
    resolve: (s) => (s.numerator === null ? undefined : matchNumber(question, s.numerator / den, 1e-9)),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const num = engine.state.numerator;
  const decimal = num === null ? null : num / den;
  const onTarget = decimal !== null && Math.abs(decimal - target) < 1e-9;

  return (
    <ActivityShell
      title="Fraction Dialer"
      howTo={`The denominator is fixed at ${den}. Turn the numerator dial and watch the decimal gauge until it reads exactly ${target}.`}
      icon={Gauge}
      answerText={num === null ? undefined : `${num}/${den}`}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Turn the numerator dial"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="The fraction">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="text-center">
              <div
                className={`font-mono text-3xl font-black leading-none ${
                  num === null ? "text-slate-300" : "text-slate-900"
                }`}
              >
                {num ?? "?"}
              </div>
              <div className="h-0.5 bg-slate-700 my-1.5 w-16 mx-auto" />
              <div className="font-mono text-3xl font-black leading-none text-slate-900">{den}</div>
            </div>
            <span className="text-2xl font-black text-slate-400">=</span>
            <div
              className={`px-4 py-2.5 rounded-xl border-2 ${
                onTarget ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-300"
              }`}
            >
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Decimal gauge
              </div>
              <div className="font-mono text-2xl font-black text-slate-900 tabular-nums">
                {decimal === null ? "—" : round(decimal, 4)}
              </div>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              target {target}
            </div>
          </div>
        </Stage>

        <Stage label="Numerator dial">
          <NumberScale
            min={range.min}
            max={range.max}
            step={range.step ?? 1}
            value={num}
            onChange={(v) => engine.update({ numerator: v })}
            readOnly={engine.readOnly}
            label="Numerator"
          />
        </Stage>
      </div>
    </ActivityShell>
  );
}

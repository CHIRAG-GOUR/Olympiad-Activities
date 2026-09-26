"use client";

import React, { useMemo } from "react";
import { CircleDot, Box, ScanLine, Triangle, FlipHorizontal } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchOptionState, matchText, normalise, sameSet } from "./shared";
import { NumberScale, DraggableDot, DragSurface, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q6 — Living Venn
   Drag and size three circles until the relationships are all true.
   ══════════════════════════════════════════════════════════════ */

interface Disc {
  x: number;
  y: number;
  r: number;
}
interface VennState {
  discs: Record<string, Disc>;
  selected: string;
}

const DISC_TONES: Record<string, { fill: string; stroke: string }> = {
  Cats: { fill: "#fde68a", stroke: "#d97706" },
  Dogs: { fill: "#bae6fd", stroke: "#0284c7" },
  Animals: { fill: "#dcfce7", stroke: "#16a34a" },
};

const isSubset = (a: Disc, b: Disc) => Math.hypot(a.x - b.x, a.y - b.y) + a.r <= b.r;
const isDisjoint = (a: Disc, b: Disc) => Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r;

/** Name the configuration the student has built, in the vocabulary the options use. */
function classifyVenn(d: Record<string, Disc>): string | undefined {
  const cats = d.Cats;
  const dogs = d.Dogs;
  const animals = d.Animals;
  if (!cats || !dogs || !animals) return undefined;

  const catsIn = isSubset(cats, animals);
  const dogsIn = isSubset(dogs, animals);
  const apart = isDisjoint(cats, dogs);

  if (catsIn && dogsIn && apart) return "two-disjoint-inside-one";
  if (catsIn && dogsIn && (isSubset(cats, dogs) || isSubset(dogs, cats))) return "concentric-three";
  if (catsIn !== dogsIn) return "one-inside-one-outside";
  if (!apart) return "overlapping-pair";
  return undefined;
}

export function Q06VennActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<VennState>) {
  const cfg = question?.customConfig ?? {};
  const labels: string[] = cfg.labels ?? ["Cats", "Dogs", "Animals"];

  const engine = useActivityEngine<VennState, string>({
    initialState: {
      discs: {
        Animals: { x: 50, y: 50, r: 30 },
        Cats: { x: 22, y: 22, r: 12 },
        Dogs: { x: 78, y: 22, r: 12 },
      },
      selected: "Cats",
    },
    resolve: (s) =>
      matchOptionState(question, classifyVenn(s.discs), (opt, built) => opt === built),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { discs, selected } = engine.state;
  const sel = discs[selected];

  const move = (id: string, x: number, y: number) =>
    engine.update((p) => ({ ...p, discs: { ...p.discs, [id]: { ...p.discs[id], x, y } } }));

  const conditions = [
    { id: "c1", label: "Every cat is an animal", met: isSubset(discs.Cats, discs.Animals) },
    { id: "c2", label: "Every dog is an animal", met: isSubset(discs.Dogs, discs.Animals) },
    { id: "c3", label: "No cat is a dog", met: isDisjoint(discs.Cats, discs.Dogs) },
  ];

  // Draw the biggest disc first so the smaller ones stay visible on top of it.
  const order = [...labels].sort((a, b) => discs[b].r - discs[a].r);

  return (
    <ActivityShell
      title="Living Venn Diagram"
      howTo="Drag each circle and change its size until all three statements about cats, dogs and animals are true at once."
      icon={CircleDot}
      answerText={
        conditions.every((c) => c.met)
          ? "Cats and dogs sit apart, both inside animals"
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Arrange the circles so every statement is satisfied"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[1.1fr_1fr] gap-3">
        <Stage label="Your diagram">
          <DragSurface>
            <rect x="0" y="0" width="100" height="100" fill="#fff" />
            {order.map((id) => {
              const d = discs[id];
              const tone = DISC_TONES[id] ?? DISC_TONES.Animals;
              return (
                <g key={id}>
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill={tone.fill}
                    fillOpacity="0.5"
                    stroke={tone.stroke}
                    strokeWidth={selected === id ? 2 : 1.2}
                  />
                  <text
                    x={d.x}
                    y={d.y - d.r + 6}
                    textAnchor="middle"
                    fontSize="5"
                    fontWeight="800"
                    fill={tone.stroke}
                    pointerEvents="none"
                  >
                    {id}
                  </text>
                </g>
              );
            })}
            {order.map((id) => (
              <DraggableDot
                key={`h-${id}`}
                x={discs[id].x}
                y={discs[id].y}
                r={2.6}
                tone={id === "Animals" ? "emerald" : id === "Cats" ? "rose" : "sky"}
                readOnly={engine.readOnly}
                onMove={(x, y) => move(id, x, y)}
              />
            ))}
          </DragSurface>
        </Stage>

        <div className="space-y-3">
          <Stage label="Resize a circle">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {labels.map((l) => (
                <Tile
                  key={l}
                  active={selected === l}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, selected: l }))}
                  className="px-2.5 text-[11px]"
                >
                  {l}
                </Tile>
              ))}
            </div>
            <NumberScale
              min={6}
              max={44}
              step={1}
              value={sel?.r ?? null}
              onChange={(r) =>
                engine.update((p) => ({ ...p, discs: { ...p.discs, [p.selected]: { ...p.discs[p.selected], r } } }))
              }
              readOnly={engine.readOnly}
              label={`${selected} radius`}
              ticks={false}
            />
          </Stage>

          <Stage label="Statements that must be true">
            <Conditions items={conditions} />
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q7 — Cube Net Folder
   Fold the printed net, then turn the cube to see three faces at once.
   ══════════════════════════════════════════════════════════════ */

interface CubeState {
  fold: number;
  front: string;
  back: string;
  top: string;
  bottom: string;
  right: string;
  left: string;
}

/**
 * Derive the three opposite-face pairs from the printed net.
 *
 * The net is a vertical strip of four cells with one cell attached on each side. Folding
 * the strip wraps it right round the cube, so cells two apart in the strip end up facing
 * each other; the two side flaps become the remaining pair.
 */
function pairsFromNet(net: { face: string; col: number; row: number }[]) {
  const byCol = new Map<number, { face: string; row: number }[]>();
  net.forEach((c) => {
    const list = byCol.get(c.col) ?? [];
    list.push({ face: c.face, row: c.row });
    byCol.set(c.col, list);
  });

  let strip: string[] = [];
  const flaps: string[] = [];
  byCol.forEach((cells) => {
    const sorted = [...cells].sort((a, b) => a.row - b.row);
    if (sorted.length >= 4) strip = sorted.map((c) => c.face);
    else sorted.forEach((c) => flaps.push(c.face));
  });

  if (strip.length < 4 || flaps.length < 2) return null;
  return {
    frontBack: [strip[0], strip[2]] as [string, string],
    topBottom: [strip[3], strip[1]] as [string, string],
    rightLeft: [flaps[0], flaps[1]] as [string, string],
  };
}

export function Q07CubeNetActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<CubeState>) {
  const cfg = question?.customConfig ?? {};
  const net: { face: string; col: number; row: number }[] = cfg.net ?? [];
  const pairs = useMemo(() => pairsFromNet(net), [net]);

  const initial: CubeState = pairs
    ? {
        fold: 0,
        front: pairs.frontBack[0],
        back: pairs.frontBack[1],
        top: pairs.topBottom[0],
        bottom: pairs.topBottom[1],
        right: pairs.rightLeft[0],
        left: pairs.rightLeft[1],
      }
    : { fold: 0, front: "", back: "", top: "", bottom: "", right: "", left: "" };

  const engine = useActivityEngine<CubeState, string>({
    initialState: initial,
    resolve: (s) =>
      s.fold < 1
        ? undefined
        : matchOptionState(question, [s.front, s.top, s.right], (opt, built) => sameSet(opt, built)),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;

  /** Turn about the upright axis: the left face swings round to the front. */
  const yaw = () =>
    engine.update((p) => ({ ...p, front: p.left, left: p.back, back: p.right, right: p.front }));
  /** Tip forward: the bottom face comes up to the front. */
  const pitch = () =>
    engine.update((p) => ({ ...p, front: p.bottom, bottom: p.back, back: p.top, top: p.front }));
  /** Roll sideways: the right face comes up to the top. */
  const roll = () =>
    engine.update((p) => ({ ...p, top: p.right, right: p.bottom, bottom: p.left, left: p.top }));

  const folded = s.fold >= 1;
  const cols = [0, 1, 2];
  const rows = [0, 1, 2, 3];

  return (
    <ActivityShell
      title="Cube Folding Bench"
      howTo="Drag the fold control to close the net into a cube, then turn the cube until three faces are showing. Only face triples that can genuinely meet at a corner will ever appear."
      icon={Box}
      answerText={folded ? `Showing ${s.front}, ${s.top} and ${s.right}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={folded ? "Turn the cube to bring three faces into view" : "Fold the net into a cube first"}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <div className="grid sm:grid-cols-2 gap-3">
          <Stage label="The printed net">
            <div
              className="inline-grid gap-px transition-opacity"
              style={{ gridTemplateColumns: `repeat(${cols.length}, 2.25rem)`, opacity: 1 - s.fold * 0.75 }}
            >
              {rows.map((r) =>
                cols.map((c) => {
                  const cell = net.find((n) => n.col === c && n.row === r);
                  return (
                    <div
                      key={`${c}-${r}`}
                      className={`h-9 grid place-items-center font-mono text-sm font-black ${
                        cell
                          ? "border-2 border-slate-400 bg-white text-slate-800"
                          : "border-2 border-transparent"
                      }`}
                      style={
                        cell
                          ? { transform: `scale(${1 - s.fold * 0.25})` }
                          : undefined
                      }
                    >
                      {cell?.face ?? ""}
                    </div>
                  );
                })
              )}
            </div>
          </Stage>

          <Stage label={folded ? "Your cube" : "Folding…"}>
            <div className="flex items-center justify-center h-[152px]">
              <svg viewBox="0 0 120 120" className="w-[168px] h-[168px]" style={{ opacity: 0.25 + s.fold * 0.75 }}>
                {/* front face */}
                <polygon points="18,44 78,44 78,104 18,104" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
                {/* top face */}
                <polygon points="18,44 42,20 102,20 78,44" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
                {/* right face */}
                <polygon points="78,44 102,20 102,80 78,104" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
                {folded && (
                  <>
                    <text x="48" y="80" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0f172a">
                      {s.front}
                    </text>
                    <text x="60" y="37" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f172a">
                      {s.top}
                    </text>
                    <text x="90" y="70" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f172a">
                      {s.right}
                    </text>
                  </>
                )}
              </svg>
            </div>
          </Stage>
        </div>

        <Stage label="Controls">
          <NumberScale
            min={0}
            max={1}
            step={0.05}
            value={s.fold}
            onChange={(v) => engine.update((p) => ({ ...p, fold: v }))}
            readOnly={engine.readOnly}
            label="Fold the net"
            format={(v) => `${Math.round(v * 100)}%`}
            ticks={false}
          />
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <Tile readOnly={engine.readOnly || !folded} onClick={yaw} className="px-3 text-[11px]">
              Turn sideways
            </Tile>
            <Tile readOnly={engine.readOnly || !folded} onClick={pitch} className="px-3 text-[11px]">
              Tip forward
            </Tile>
            <Tile readOnly={engine.readOnly || !folded} onClick={roll} className="px-3 text-[11px]">
              Roll over
            </Tile>
          </div>
          {folded && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <Metric label="Hidden back" value={s.back} />
              <Metric label="Hidden bottom" value={s.bottom} />
              <Metric label="Hidden left" value={s.left} />
            </div>
          )}
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q8 — Series Scanner
   Step through the series and judge each candidate digit in turn.
   ══════════════════════════════════════════════════════════════ */

interface ScanState {
  cursor: number;
  verdicts: Record<number, boolean>;
}

export function Q08SeriesScannerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<ScanState>) {
  const cfg = question?.customConfig ?? {};
  const series: number[] = cfg.series ?? [];
  const target: number = cfg.target ?? 6;
  const before: number = cfg.precededBy;
  const notAfter: number = cfg.notFollowedBy;

  const candidates = useMemo(
    () => series.map((v, i) => (v === target ? i : -1)).filter((i) => i >= 0),
    [series, target]
  );

  const engine = useActivityEngine<ScanState, string>({
    initialState: { cursor: 0, verdicts: {} },
    resolve: (s) => {
      const decided = candidates.every((i) => i in s.verdicts);
      if (!decided) return undefined;
      const count = candidates.filter((i) => s.verdicts[i]).length;
      return matchNumber(question, count);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { cursor, verdicts } = engine.state;
  const decidedCount = candidates.filter((i) => i in verdicts).length;
  const acceptedCount = candidates.filter((i) => verdicts[i]).length;
  const atCandidate = series[cursor] === target;

  const step = (delta: number) =>
    engine.update((p) => ({ ...p, cursor: Math.min(series.length - 1, Math.max(0, p.cursor + delta)) }));

  const judge = (ok: boolean) =>
    engine.update((p) => {
      const next = { ...p.verdicts, [p.cursor]: ok };
      // Jump straight to the next undecided candidate so the scan keeps moving.
      const following = candidates.find((i) => i > p.cursor && !(i in next));
      return { cursor: following ?? p.cursor, verdicts: next };
    });

  return (
    <ActivityShell
      title="Series Scanner"
      howTo={`Move the scanner along the series. Every time it lands on a ${target}, decide whether that ${target} has a ${before} immediately before it and does not have a ${notAfter} immediately after it.`}
      icon={ScanLine}
      answerText={engine.answer !== undefined ? `${acceptedCount} qualifying ${target}${acceptedCount === 1 ? "" : "'s"}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`Judge every ${target} in the series (${decidedCount} of ${candidates.length} done)`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <Stage label="The series">
          <div className="flex flex-wrap gap-1">
            {series.map((v, i) => {
              const isCand = v === target;
              const verdict = verdicts[i];
              return (
                <button
                  key={i}
                  type="button"
                  disabled={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, cursor: i }))}
                  className={`w-9 h-10 rounded-lg border-2 font-mono text-sm font-black transition ${
                    i === cursor
                      ? "border-emerald-600 bg-emerald-600 text-white scale-105"
                      : verdict === true
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : verdict === false
                      ? "border-slate-300 bg-slate-100 text-slate-400 line-through"
                      : isCand
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </Stage>

        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start">
          <Stage label="Scanner window">
            <div className="flex items-center justify-center gap-2">
              {[-1, 0, 1].map((o) => {
                const i = cursor + o;
                const v = series[i];
                return (
                  <div
                    key={o}
                    className={`w-14 h-14 rounded-xl border-2 grid place-items-center font-mono text-xl font-black ${
                      o === 0
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {v === undefined ? "–" : v}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5 mt-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="w-14 text-center">before</span>
              <span className="w-14 text-center">here</span>
              <span className="w-14 text-center">after</span>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              <Tile readOnly={engine.readOnly} onClick={() => step(-1)} className="px-3 text-xs">
                ◀ Back
              </Tile>
              <Tile readOnly={engine.readOnly} onClick={() => step(1)} className="px-3 text-xs">
                Forward ▶
              </Tile>
            </div>
          </Stage>

          <Stage label="Verdict">
            {atCandidate ? (
              <div className="space-y-1.5">
                <p className="text-[11px] text-slate-600 leading-snug max-w-[200px]">
                  Does this {target} qualify?
                </p>
                <div className="flex gap-1.5">
                  <Tile
                    active={verdicts[cursor] === true}
                    readOnly={engine.readOnly}
                    onClick={() => judge(true)}
                    className="px-3 text-xs"
                  >
                    Counts
                  </Tile>
                  <Tile
                    active={verdicts[cursor] === false}
                    readOnly={engine.readOnly}
                    onClick={() => judge(false)}
                    className="px-3 text-xs"
                  >
                    Rejected
                  </Tile>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 max-w-[200px] leading-snug">
                The scanner is not on a {target}. Move it along until it is.
              </p>
            )}
            <div className="flex gap-1.5 mt-2.5">
              <Metric label="Judged" value={`${decidedCount}/${candidates.length}`} />
              <Metric label="Counted" value={acceptedCount} tone="emerald" />
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q9 — Triangle Explorer
   Trace triangles on the figure; the board tallies the distinct ones found.
   ══════════════════════════════════════════════════════════════ */

const FIG_PTS: Record<string, { x: number; y: number }> = {
  T: { x: 50, y: 8 },
  A: { x: 14, y: 30 },
  B: { x: 50, y: 30 },
  C: { x: 86, y: 30 },
  O: { x: 50, y: 52 },
  D: { x: 14, y: 74 },
  E: { x: 50, y: 74 },
  F: { x: 86, y: 74 },
  U: { x: 50, y: 96 },
};

/** Every straight line drawn in the figure, listed as the points lying on it. */
const FIG_LINES: string[][] = [
  ["A", "B", "C"],
  ["D", "E", "F"],
  ["A", "D"],
  ["C", "F"],
  ["T", "B", "O", "E", "U"],
  ["A", "O", "F"],
  ["C", "O", "D"],
  ["T", "A"],
  ["T", "C"],
  ["U", "D"],
  ["U", "F"],
];

const joined = (p: string, q: string) => FIG_LINES.some((l) => l.includes(p) && l.includes(q));
const collinear = (p: string, q: string, r: string) =>
  FIG_LINES.some((l) => l.includes(p) && l.includes(q) && l.includes(r));

/** A triple is a triangle of this figure when each side runs along a drawn line. */
const isTriangle = (t: string[]) =>
  t.length === 3 &&
  joined(t[0], t[1]) &&
  joined(t[1], t[2]) &&
  joined(t[0], t[2]) &&
  !collinear(t[0], t[1], t[2]);

interface TriState {
  picked: string[];
  found: string[];
  finished: boolean;
}

export function Q09TriangleExplorerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<TriState>) {
  const engine = useActivityEngine<TriState, string>({
    initialState: { picked: [], found: [], finished: false },
    resolve: (s) => {
      if (!s.finished) return undefined;
      const n = s.found.length;
      // A count that matches no printed figure is exactly what "None of these" is for.
      return matchNumber(question, n) ?? matchText(question, "None of these");
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { picked, found, finished } = engine.state;

  const tap = (id: string) =>
    engine.update((p) => {
      if (p.finished) return p;
      if (p.picked.includes(id)) return { ...p, picked: p.picked.filter((v) => v !== id) };
      const next = [...p.picked, id];
      if (next.length < 3) return { ...p, picked: next };
      const key = [...next].sort().join("");
      if (isTriangle(next) && !p.found.includes(key)) {
        return { ...p, picked: [], found: [...p.found, key] };
      }
      return { ...p, picked: [] };
    });

  const lastValid = picked.length === 3;

  return (
    <ActivityShell
      title="Triangle Explorer"
      howTo="Tap three corners to trace a triangle. If all three sides run along lines that are actually drawn, the triangle is added to your tally. Keep going until you are sure you have them all, then finish the count."
      icon={Triangle}
      answerText={finished ? `${found.length} triangles found` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={
        finished ? "Counting finished" : `Traced ${found.length} so far — finish when you have them all`
      }
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <Tile
          readOnly={engine.readOnly || found.length === 0}
          active={finished}
          onClick={() => engine.update((p) => ({ ...p, finished: !p.finished, picked: [] }))}
          className="px-3 text-[11px]"
        >
          {finished ? "Reopen count" : "Finish counting"}
        </Tile>
      }
    >
      <div className="grid sm:grid-cols-[1.2fr_1fr] gap-3">
        <Stage label="The figure">
          <svg viewBox="0 0 100 104" className="w-full aspect-[100/104] select-none">
            <rect x="0" y="0" width="100" height="104" fill="#fff" />
            {FIG_LINES.map((line, i) => {
              const a = FIG_PTS[line[0]];
              const b = FIG_PTS[line[line.length - 1]];
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#475569"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              );
            })}
            {picked.length >= 2 && (
              <polygon
                points={picked.map((p) => `${FIG_PTS[p].x},${FIG_PTS[p].y}`).join(" ")}
                fill={lastValid && isTriangle(picked) ? "#a7f3d0" : "#fecdd3"}
                fillOpacity="0.55"
                stroke={lastValid && isTriangle(picked) ? "#059669" : "#e11d48"}
                strokeWidth="1.4"
              />
            )}
            {Object.entries(FIG_PTS).map(([id, p]) => (
              <g
                key={id}
                onClick={() => !engine.readOnly && tap(id)}
                style={{ cursor: engine.readOnly || finished ? "default" : "pointer" }}
              >
                <circle cx={p.x} cy={p.y} r={5.5} fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={picked.includes(id) ? 3 : 2}
                  fill={picked.includes(id) ? "#059669" : "#fff"}
                  stroke={picked.includes(id) ? "#047857" : "#475569"}
                  strokeWidth="1.2"
                />
                <text
                  x={p.x + 4}
                  y={p.y - 3}
                  fontSize="4.2"
                  fontWeight="800"
                  fill="#64748b"
                  pointerEvents="none"
                >
                  {id}
                </text>
              </g>
            ))}
          </svg>
        </Stage>

        <Stage label="Your tally">
          <div className="flex gap-1.5 mb-2">
            <Metric label="Triangles found" value={found.length} tone="emerald" />
            <Metric label="Corners picked" value={`${picked.length}/3`} />
          </div>
          <div className="flex flex-wrap gap-1 max-h-[180px] overflow-auto">
            {found.length === 0 ? (
              <p className="text-[11px] text-slate-500 leading-snug">
                Nothing traced yet. Tap three corners that are joined to each other.
              </p>
            ) : (
              found.map((f) => (
                <span
                  key={f}
                  className="text-[10px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 rounded px-1.5 py-0.5"
                >
                  {f.split("").join("")}
                </span>
              ))
            )}
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q10 — Mirror World
   Swing the mirror against the strip and read the reflection it makes.
   ══════════════════════════════════════════════════════════════ */

interface MirrorState {
  axis: "vertical" | "horizontal" | null;
}

export function Q10MirrorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<MirrorState>) {
  const cfg = question?.customConfig ?? {};
  const source = cfg.source ?? { text: "XYZ", hatchOn: "left", capsOn: "top" };

  /** What a mirror on the given axis actually does to the strip. */
  const reflect = (axis: "vertical" | "horizontal") =>
    axis === "vertical"
      ? {
          text: [...String(source.text)].reverse().join(""),
          flipped: true,
          hatchOn: source.hatchOn === "left" ? "right" : "left",
          capsOn: source.capsOn,
        }
      : {
          text: String(source.text),
          flipped: false,
          hatchOn: source.hatchOn,
          capsOn: source.capsOn === "top" ? "bottom" : "top",
        };

  const engine = useActivityEngine<MirrorState, string>({
    initialState: { axis: null },
    resolve: (s) =>
      s.axis === null
        ? undefined
        : matchOptionState(question, reflect(s.axis), (opt, built) =>
            opt.text === built.text &&
            Boolean(opt.flipped) === built.flipped &&
            opt.hatchOn === built.hatchOn &&
            opt.capsOn === built.capsOn
          ),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const axis = engine.state.axis;
  const image = axis ? reflect(axis) : null;

  const Strip = ({
    text,
    flipped,
    hatchOn,
    capsOn,
  }: {
    text: string;
    flipped: boolean;
    hatchOn: string;
    capsOn: string;
  }) => (
    <div className="relative w-[150px] h-[54px] border-2 border-slate-400 bg-white grid place-items-center overflow-hidden">
      <div
        className={`absolute top-0 bottom-0 w-4 ${hatchOn === "left" ? "left-0" : "right-0"}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#94a3b8 0 3px,transparent 3px 6px)",
        }}
      />
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-9 h-2.5 rounded-full bg-slate-700 ${
          capsOn === "top" ? "top-1.5" : "bottom-1.5"
        }`}
      />
      <span
        className="font-black text-xl tracking-[0.2em] text-slate-900"
        style={{ transform: flipped ? "scaleX(-1)" : undefined }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <ActivityShell
      title="Mirror Bench"
      howTo="Stand the mirror against the figure. Swing it upright or lay it flat — the bench shows the reflection that mirror really produces."
      icon={FlipHorizontal}
      answerText={image ? `${axis === "vertical" ? "Upright" : "Flat"} mirror → "${image.text}", band on the ${image.hatchOn}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Place the mirror against the figure"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <Stage label="Given figure and its reflection">
          <div className={`flex ${axis === "horizontal" ? "flex-col" : "flex-row"} items-center justify-center gap-3`}>
            <Strip text={String(source.text)} flipped={false} hatchOn={source.hatchOn} capsOn={source.capsOn} />
            <div
              className={`bg-gradient-to-b from-sky-300 to-sky-500 rounded ${
                axis === "horizontal" ? "h-1.5 w-[150px]" : "w-1.5 h-[54px]"
              } ${axis ? "opacity-100" : "opacity-30"}`}
            />
            {image ? (
              <Strip text={image.text} flipped={image.flipped} hatchOn={image.hatchOn} capsOn={image.capsOn} />
            ) : (
              <div className="w-[150px] h-[54px] border-2 border-dashed border-slate-300 grid place-items-center text-[11px] font-semibold text-slate-400">
                reflection
              </div>
            )}
          </div>
        </Stage>

        <Stage label="Stand the mirror">
          <div className="flex flex-wrap gap-1.5">
            <Tile
              active={axis === "vertical"}
              readOnly={engine.readOnly}
              onClick={() => engine.update({ axis: "vertical" })}
              className="px-3 text-xs"
            >
              Upright mirror
            </Tile>
            <Tile
              active={axis === "horizontal"}
              readOnly={engine.readOnly}
              onClick={() => engine.update({ axis: "horizontal" })}
              className="px-3 text-xs"
            >
              Flat mirror
            </Tile>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-snug max-w-[420px]">
            The figure in the question has its mirror standing upright along one edge. An
            upright mirror swaps left and right; a flat one swaps top and bottom.
          </p>
        </Stage>
      </div>
    </ActivityShell>
  );
}

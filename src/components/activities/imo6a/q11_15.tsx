"use client";

import React, { useMemo } from "react";
import { Cpu, LayoutGrid, FoldVertical, Puzzle, Network } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchOptionState, matchText } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q11 — Operator Machine
   Re-programme each printed symbol, then run the expression.
   ══════════════════════════════════════════════════════════════ */

type Op = "+" | "−" | "×" | "÷";
const OP_LABEL: Record<Op, string> = {
  "+": "add",
  "−": "subtract",
  "×": "multiply",
  "÷": "divide",
};

interface OpState {
  mapping: Record<string, Op | null>;
}

/** Evaluate a token stream under ordinary BODMAS: × and ÷ first, left to right. */
function evaluate(tokens: (number | Op)[]): number | undefined {
  if (tokens.length === 0) return undefined;
  const pass1: (number | Op)[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "×" || t === "÷") {
      const left = pass1.pop();
      const right = tokens[++i];
      if (typeof left !== "number" || typeof right !== "number") return undefined;
      if (t === "÷" && right === 0) return undefined;
      pass1.push(t === "×" ? left * right : left / right);
    } else {
      pass1.push(t);
    }
  }
  let acc = pass1[0];
  if (typeof acc !== "number") return undefined;
  for (let i = 1; i < pass1.length; i += 2) {
    const op = pass1[i];
    const rhs = pass1[i + 1];
    if (typeof rhs !== "number") return undefined;
    if (op === "+") acc += rhs;
    else if (op === "−") acc -= rhs;
    else return undefined;
  }
  return acc;
}

export function Q11OperatorMachineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<OpState>) {
  const cfg = question?.customConfig ?? {};
  const expression: (number | string)[] = cfg.expression ?? [];
  const symbols: string[] = cfg.tokens ?? ["+", "−", "×", "÷"];
  const rule: Record<string, string> = cfg.mapping ?? {};

  const engine = useActivityEngine<OpState, string>({
    initialState: { mapping: Object.fromEntries(symbols.map((s) => [s, null])) },
    resolve: (s) => {
      if (symbols.some((sym) => !s.mapping[sym])) return undefined;
      const tokens = expression.map((t) =>
        typeof t === "number" ? t : (s.mapping[t] as Op)
      ) as (number | Op)[];
      const result = evaluate(tokens);
      return result === undefined ? undefined : matchNumber(question, result);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { mapping } = engine.state;
  const complete = symbols.every((s) => mapping[s]);
  const rewritten = complete
    ? expression.map((t) => (typeof t === "number" ? t : mapping[t])).join(" ")
    : null;
  const result = complete
    ? evaluate(expression.map((t) => (typeof t === "number" ? t : (mapping[t] as Op))) as (number | Op)[])
    : undefined;

  const assign = (symbol: string, op: Op) =>
    engine.update((p) => ({ mapping: { ...p.mapping, [symbol]: p.mapping[symbol] === op ? null : op } }));

  return (
    <ActivityShell
      title="Operator Rewiring Machine"
      howTo="Each printed symbol must be rewired to the operation this question gives it. Set all four, then the machine rewrites the expression and works it out under BODMAS."
      icon={Cpu}
      answerText={result === undefined ? undefined : String(Number(result.toFixed(6)))}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Give every printed symbol its new operation"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <Stage label="The printed expression">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {expression.map((t, i) => (
              <span
                key={i}
                className={`min-w-[2.6rem] h-11 px-2 grid place-items-center rounded-lg border-2 font-mono text-lg font-black ${
                  typeof t === "number"
                    ? "border-slate-200 bg-white text-slate-800"
                    : mapping[t as string]
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-amber-300 bg-amber-50 text-amber-700"
                }`}
              >
                {typeof t === "number" ? t : mapping[t as string] ?? t}
              </span>
            ))}
          </div>
        </Stage>

        <Stage label="Rewiring panel">
          <div className="space-y-2">
            {symbols.map((sym) => (
              <div key={sym} className="flex flex-wrap items-center gap-1.5">
                <span className="w-24 text-xs font-bold text-slate-600">
                  <span className="font-mono text-base text-slate-900">{sym}</span> stands for
                </span>
                {symbols.map((op) => (
                  <Tile
                    key={op}
                    active={mapping[sym] === op}
                    readOnly={engine.readOnly}
                    onClick={() => assign(sym, op as Op)}
                    className="w-14 text-sm"
                    ariaLabel={`${sym} stands for ${OP_LABEL[op as Op]}`}
                  >
                    {op}
                  </Tile>
                ))}
                {rule[sym] && (
                  <span className="text-[10px] font-semibold text-slate-400 ml-1">
                    question says: {rule[sym]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Stage>

        {rewritten && (
          <Stage label="Machine output">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-700">{rewritten}</span>
              <span className="text-slate-400 font-black">=</span>
              <Metric label="Result" value={result === undefined ? "—" : Number(result.toFixed(6))} tone="emerald" />
            </div>
          </Stage>
        )}
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q12 — Arrow Matrix
   Build the missing cell by turning an arrow and choosing its tail.
   ══════════════════════════════════════════════════════════════ */

type Dir = "up" | "down" | "left" | "right";
type Tail = "bar" | "doubleBar" | "circle" | "square" | "none";

const DIR_ROT: Record<Dir, number> = { up: -90, right: 0, down: 90, left: 180 };

function ArrowGlyph({ dir, tail, size = 46 }: { dir: Dir; tail: Tail; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" style={{ width: size, height: size }}>
      <g transform={`rotate(${DIR_ROT[dir]} 20 20)`}>
        <line x1="8" y1="20" x2="32" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <polyline points="26,14 32,20 26,26" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {tail === "bar" && <line x1="8" y1="13" x2="8" y2="27" stroke="#334155" strokeWidth="2" strokeLinecap="round" />}
        {tail === "doubleBar" && (
          <>
            <line x1="8" y1="13" x2="8" y2="27" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="13" x2="12" y2="27" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {tail === "circle" && <circle cx="8" cy="20" r="3" fill="none" stroke="#334155" strokeWidth="2" />}
        {tail === "square" && <rect x="5" y="17" width="6" height="6" fill="none" stroke="#334155" strokeWidth="2" />}
      </g>
    </svg>
  );
}

interface MatrixState {
  dir: Dir | null;
  tail: Tail | null;
}

export function Q12ArrowMatrixActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<MatrixState>) {
  const cfg = question?.customConfig ?? {};
  const grid: ({ dir: Dir; tail: Tail } | null)[][] = cfg.grid ?? [];

  const engine = useActivityEngine<MatrixState, string>({
    initialState: { dir: null, tail: null },
    resolve: (s) =>
      !s.dir || !s.tail
        ? undefined
        : matchOptionState(question, s, (opt, built) => opt.dir === built.dir && opt.tail === built.tail),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { dir, tail } = engine.state;

  return (
    <ActivityShell
      title="Arrow Matrix"
      howTo="Turn the loose arrow and fit a tail to it until the bottom-right cell continues the pattern the rows and columns are following."
      icon={LayoutGrid}
      answerText={dir && tail ? `Arrow pointing ${dir}, ${tail === "none" ? "no tail" : `${tail} tail`}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Choose a direction and a tail for the missing cell"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[auto_1fr] gap-3">
        <Stage label="The matrix">
          <div className="inline-grid grid-cols-3 gap-px bg-slate-300">
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`w-[62px] h-[62px] grid place-items-center ${
                    cell ? "bg-white" : "bg-emerald-50 ring-2 ring-inset ring-emerald-400"
                  }`}
                >
                  {cell ? (
                    <ArrowGlyph dir={cell.dir} tail={cell.tail} />
                  ) : dir && tail ? (
                    <ArrowGlyph dir={dir} tail={tail} />
                  ) : (
                    <span className="text-2xl font-black text-emerald-400">?</span>
                  )}
                </div>
              ))
            )}
          </div>
        </Stage>

        <div className="space-y-3">
          <Stage label="Point the arrow">
            <div className="flex flex-wrap gap-1.5">
              {(["up", "right", "down", "left"] as Dir[]).map((d) => (
                <Tile
                  key={d}
                  active={dir === d}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, dir: d }))}
                  className="w-[58px] grid place-items-center"
                  ariaLabel={`Point ${d}`}
                >
                  <ArrowGlyph dir={d} tail="none" size={30} />
                </Tile>
              ))}
            </div>
          </Stage>
          <Stage label="Fit a tail">
            <div className="flex flex-wrap gap-1.5">
              {(["none", "bar", "doubleBar", "circle", "square"] as Tail[]).map((t) => (
                <Tile
                  key={t}
                  active={tail === t}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, tail: t }))}
                  className="w-[58px] grid place-items-center"
                  ariaLabel={`${t} tail`}
                >
                  <ArrowGlyph dir="right" tail={t} size={30} />
                </Tile>
              ))}
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q13 — Transparent Fold
   Fold the see-through sheet and watch where the motif lands.
   ══════════════════════════════════════════════════════════════ */

type Fold = "none" | "left-over-right" | "right-over-left";

interface FoldState {
  fold: Fold;
  progress: number;
}

export function Q13TransparentFoldActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<FoldState>) {
  const cfg = question?.customConfig ?? {};
  const motif = cfg.sheet?.motif ?? { x: 58, y: 44, w: 16, h: 10 };

  const engine = useActivityEngine<FoldState, string>({
    initialState: { fold: "none", progress: 0 },
    resolve: (s) => {
      // A fold only counts once the sheet is actually closed.
      const settled: Fold = s.fold === "none" ? "none" : s.progress >= 1 ? s.fold : "none";
      if (s.fold !== "none" && s.progress < 1) return undefined;
      return matchOptionState(question, settled, (opt, built) => opt.fold === built);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { fold, progress } = engine.state;

  // The moving half swings about the midline; at full progress the motif has reflected.
  const moved = fold === "right-over-left" && progress >= 1;
  const motifX = moved ? 100 - motif.x - motif.w : motif.x;

  return (
    <ActivityShell
      title="Transparent Sheet Folder"
      howTo="Choose which half of the see-through sheet to fold across the dotted line, then drag the fold closed and see where the marked rectangle ends up."
      icon={FoldVertical}
      answerText={
        fold === "none"
          ? "Sheet left flat"
          : progress >= 1
          ? `Folded ${fold.replace(/-/g, " ")}`
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Pick a fold direction and close the sheet fully"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <Stage label="The sheet">
          <div className="flex justify-center">
            <svg viewBox="0 0 100 100" className="w-[240px] h-[240px]">
              <rect x="4" y="4" width="92" height="92" fill="#fff" stroke="#94a3b8" strokeWidth="1.2" />
              {/* nested corner wedges printed on the left half */}
              {[0, 1, 2].map((i) => (
                <polygon
                  key={i}
                  points={`${8 + i * 5},${8 + i * 5} ${48 - i * 4},${8 + i * 5} ${48 - i * 4},${92 - i * 5} ${8 + i * 5},${92 - i * 5}`}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="0.9"
                />
              ))}
              {/* dotted fold line */}
              <line x1="50" y1="2" x2="50" y2="98" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2.5" />
              {/* the moving half, drawn semi-transparent as it swings across */}
              {fold === "right-over-left" && progress > 0 && (
                <rect
                  x={50}
                  y={4}
                  width={46}
                  height={92}
                  fill="#bae6fd"
                  fillOpacity={0.25}
                  style={{
                    transform: `translateX(${-progress * 92}px) scaleX(${1 - 2 * progress > 0 ? 1 : -1})`,
                    transformOrigin: "50px 50px",
                    transformBox: "view-box",
                  }}
                />
              )}
              {fold === "left-over-right" && progress > 0 && (
                <rect
                  x={4}
                  y={4}
                  width={46}
                  height={92}
                  fill="#bae6fd"
                  fillOpacity={0.25}
                  style={{
                    transform: `translateX(${progress * 92}px)`,
                    transformOrigin: "50px 50px",
                    transformBox: "view-box",
                  }}
                />
              )}
              {/* the marked rectangle */}
              <rect
                x={motifX}
                y={motif.y}
                width={motif.w}
                height={motif.h}
                fill="#059669"
                fillOpacity="0.75"
                stroke="#047857"
                strokeWidth="1"
                style={{ transition: "none" }}
              />
            </svg>
          </div>
        </Stage>

        <Stage label="Fold control">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {(
              [
                ["none", "Leave flat"],
                ["right-over-left", "Fold right half over"],
                ["left-over-right", "Fold left half over"],
              ] as [Fold, string][]
            ).map(([f, label]) => (
              <Tile
                key={f}
                active={fold === f}
                readOnly={engine.readOnly}
                onClick={() => engine.update({ fold: f, progress: f === "none" ? 0 : 0 })}
                className="px-3 text-[11px]"
              >
                {label}
              </Tile>
            ))}
          </div>
          {fold !== "none" && (
            <NumberScale
              min={0}
              max={1}
              step={0.05}
              value={progress}
              onChange={(v) => engine.update((p) => ({ ...p, progress: v }))}
              readOnly={engine.readOnly}
              label="Close the fold"
              format={(v) => `${Math.round(v * 100)}%`}
              ticks={false}
            />
          )}
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q14 — Pattern Clockwork
   Spin and flip the loose tile to continue the pattern round the square.
   ══════════════════════════════════════════════════════════════ */

type Corner = "TL" | "TR" | "BL" | "BR";

interface TileState {
  glyph: string | null;
  rotation: number;
  corner: Corner | null;
}

function PatternTile({
  glyph,
  rotation,
  corner,
  size = 74,
}: {
  glyph: string | null;
  rotation: number;
  corner: Corner | null;
  size?: number;
}) {
  const arcAt: Record<Corner, string> = {
    TL: "M 6 22 A 16 16 0 0 1 22 6",
    TR: "M 58 6 A 16 16 0 0 1 74 22",
    BL: "M 22 74 A 16 16 0 0 1 6 58",
    BR: "M 74 58 A 16 16 0 0 1 58 74",
  };
  return (
    <svg viewBox="0 0 80 80" style={{ width: size, height: size }}>
      <rect x="2" y="2" width="76" height="76" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="2" y1="2" x2="78" y2="78" stroke="#cbd5e1" strokeWidth="1" />
      {corner && <path d={arcAt[corner]} fill="none" stroke="#334155" strokeWidth="2" />}
      {glyph && (
        <text
          x="40"
          y="58"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fill="#0f172a"
          transform={`rotate(${rotation} 40 48)`}
        >
          {glyph}
        </text>
      )}
    </svg>
  );
}

export function Q14PatternClockworkActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<TileState>) {
  const cfg = question?.customConfig ?? {};
  const tiles: { slot: string; glyph: string | null; rotation: number | null; corner: Corner | null }[] =
    cfg.tiles ?? [];

  const engine = useActivityEngine<TileState, string>({
    initialState: { glyph: null, rotation: 0, corner: null },
    resolve: (s) =>
      !s.glyph || !s.corner
        ? undefined
        : matchOptionState(
            question,
            s,
            (opt, built) =>
              opt.glyph === built.glyph &&
              ((opt.rotation ?? 0) % 360) === (built.rotation % 360) &&
              opt.corner === built.corner
          ),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const slotOrder: string[] = ["TL", "TR", "BL", "BR"];

  return (
    <ActivityShell
      title="Pattern Clockwork"
      howTo="Three tiles of the pattern square are printed. Build the fourth: choose its letter, spin it, and put the arc in the right corner so the pattern carries on round the square."
      icon={Puzzle}
      answerText={s.glyph && s.corner ? `${s.glyph} turned ${s.rotation}°, arc in ${s.corner}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Set the letter, its turn and the arc corner"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[auto_1fr] gap-3">
        <Stage label="The pattern square">
          <div className="inline-grid grid-cols-2 gap-px bg-slate-300">
            {slotOrder.map((slot) => {
              const t = tiles.find((x) => x.slot === slot);
              const missing = !t || t.glyph === null;
              return (
                <div key={slot} className={missing ? "ring-2 ring-inset ring-emerald-400" : ""}>
                  {missing ? (
                    <PatternTile glyph={s.glyph} rotation={s.rotation} corner={s.corner} />
                  ) : (
                    <PatternTile glyph={t!.glyph} rotation={t!.rotation ?? 0} corner={t!.corner} />
                  )}
                </div>
              );
            })}
          </div>
        </Stage>

        <div className="space-y-2.5">
          <Stage label="Letter">
            <div className="flex gap-1.5">
              {["W", "M"].map((g) => (
                <Tile
                  key={g}
                  active={s.glyph === g}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, glyph: g }))}
                  className="w-14 text-lg"
                >
                  {g}
                </Tile>
              ))}
            </div>
          </Stage>
          <Stage label="Turn">
            <div className="flex gap-1.5">
              {[0, 180].map((r) => (
                <Tile
                  key={r}
                  active={s.rotation === r}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, rotation: r }))}
                  className="w-16 text-xs"
                >
                  {r}°
                </Tile>
              ))}
            </div>
          </Stage>
          <Stage label="Arc corner">
            <div className="grid grid-cols-2 gap-1.5 w-[124px]">
              {(["TL", "TR", "BL", "BR"] as Corner[]).map((c) => (
                <Tile
                  key={c}
                  active={s.corner === c}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, corner: c }))}
                  className="text-[11px]"
                >
                  {c}
                </Tile>
              ))}
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q15 — Family Pinboard
   Wire the family together, then ask the board who the lady is.
   ══════════════════════════════════════════════════════════════ */

interface Person {
  id: string;
  label: string;
  gender: "M" | "F";
  fixed?: boolean;
}
interface Link {
  from: string;
  to: string;
  type: "parent" | "spouse";
}
interface FamilyState {
  links: Link[];
  picked: string | null;
  mode: "parent" | "spouse";
}

/** Work out how `who` stands to `root`, using only links the student actually drew. */
function relationOf(links: Link[], root: string, who: string): string | undefined {
  const childrenOf = (p: string) => links.filter((l) => l.type === "parent" && l.from === p).map((l) => l.to);
  const spousesOf = (p: string) =>
    links
      .filter((l) => l.type === "spouse" && (l.from === p || l.to === p))
      .map((l) => (l.from === p ? l.to : l.from));

  const kids = childrenOf(root);
  if (kids.includes(who)) return "Daughter";
  if (kids.some((k) => spousesOf(k).includes(who))) return "Daughter-in-law";
  if (kids.some((k) => childrenOf(k).includes(who))) return "Granddaughter";
  const grandkids = kids.flatMap((k) => childrenOf(k));
  if (grandkids.includes(who)) return "Granddaughter";
  return "Cousin";
}

export function Q15FamilyPinboardActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<FamilyState>) {
  const cfg = question?.customConfig ?? {};
  const people: Person[] = cfg.people ?? [];
  const required: Link[] = cfg.links ?? [];
  const resolveFor = cfg.resolveFor ?? { motherOf: "", relativeTo: "" };

  const hasLink = (links: Link[], l: Link) =>
    links.some(
      (x) =>
        x.type === l.type &&
        ((x.from === l.from && x.to === l.to) || (l.type === "spouse" && x.from === l.to && x.to === l.from))
    );

  const engine = useActivityEngine<FamilyState, string>({
    initialState: { links: [], picked: null, mode: "parent" },
    resolve: (s) => {
      if (!required.every((r) => hasLink(s.links, r))) return undefined;
      // The lady in the photograph is the mother of the named child.
      const mother = s.links.find(
        (l) =>
          l.type === "parent" &&
          l.to === resolveFor.motherOf &&
          people.find((p) => p.id === l.from)?.gender === "F"
      )?.from;
      if (!mother) return undefined;
      return matchText(question, relationOf(s.links, resolveFor.relativeTo, mother));
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { links, picked, mode } = engine.state;

  // Recomputed for the read-out so the bar states the finding, not an option letter.
  const motherId = links.find(
    (l) =>
      l.type === "parent" &&
      l.to === resolveFor.motherOf &&
      people.find((p) => p.id === l.from)?.gender === "F"
  )?.from;
  const finding =
    motherId && required.every((r) => hasLink(links, r))
      ? relationOf(links, resolveFor.relativeTo, motherId)
      : undefined;

  const connect = (id: string) =>
    engine.update((p) => {
      if (!p.picked) return { ...p, picked: id };
      if (p.picked === id) return { ...p, picked: null };
      const next: Link = { from: p.picked, to: id, type: p.mode };
      if (hasLink(p.links, next)) return { ...p, picked: null };
      return { ...p, links: [...p.links, next], picked: null };
    });

  const labelOf = (id: string) => people.find((p) => p.id === id)?.label ?? id;

  return (
    <ActivityShell
      title="Family Pinboard"
      howTo="Pick a relationship cord, then tap two people to join them. Build the whole family the sentence describes; the board then works out how the lady in the photograph is related."
      icon={Network}
      answerText={finding ? `The lady is Kashi's ${finding.toLowerCase()}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Join every pair the sentence mentions"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[1.1fr_1fr] gap-3">
        <Stage label="People">
          <div className="flex flex-wrap gap-1.5">
            {people.map((p) => (
              <Tile
                key={p.id}
                active={picked === p.id}
                readOnly={engine.readOnly}
                onClick={() => connect(p.id)}
                className="px-2.5 text-[11px] text-left"
              >
                <span className="block">{p.label}</span>
                <span className="block text-[9px] opacity-70">{p.gender === "F" ? "female" : "male"}</span>
              </Tile>
            ))}
          </div>

          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Cord type
            </div>
            <div className="flex gap-1.5">
              {(["parent", "spouse"] as const).map((m) => (
                <Tile
                  key={m}
                  active={mode === m}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, mode: m, picked: null }))}
                  className="px-3 text-[11px]"
                >
                  {m === "parent" ? "is parent of" : "is married to"}
                </Tile>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500 leading-snug">
              With &ldquo;is parent of&rdquo;, tap the parent first and then the child.
            </p>
          </div>
        </Stage>

        <div className="space-y-2.5">
          <Stage label="Cords you have run">
            {links.length === 0 ? (
              <p className="text-[11px] text-slate-500">No connections yet.</p>
            ) : (
              <ul className="space-y-1">
                {links.map((l, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5"
                  >
                    <span>
                      {labelOf(l.from)}{" "}
                      <span className="text-emerald-700">
                        {l.type === "parent" ? "is parent of" : "is married to"}
                      </span>{" "}
                      {labelOf(l.to)}
                    </span>
                    <button
                      type="button"
                      disabled={engine.readOnly}
                      onClick={() =>
                        engine.update((p) => ({ ...p, links: p.links.filter((_, j) => j !== i) }))
                      }
                      className="text-slate-400 hover:text-rose-600 font-black px-1"
                      aria-label="Remove this cord"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Stage>

          <Stage label="The sentence needs">
            <Conditions
              items={required.map((r, i) => ({
                id: String(i),
                label: `${labelOf(r.from)} ${r.type === "parent" ? "is parent of" : "is married to"} ${labelOf(r.to)}`,
                met: hasLink(links, r),
              }))}
            />
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

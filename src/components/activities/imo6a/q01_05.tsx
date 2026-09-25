"use client";

import React, { useMemo, useState } from "react";
import {
  Grid3x3,
  RotateCw,
  Factory,
  Target,
  Users,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { optionLabel } from "../kit/types";
import { matchNumber, matchText, matchOptionState, sameSet } from "./shared";
import { NumberScale, DraggableDot, DragSurface, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q1 — Number Cross Machine
   Three crosses follow one rule. The student dials the third centre.
   ══════════════════════════════════════════════════════════════ */

interface CrossState {
  centre: number | null;
}

interface Cross {
  top: number;
  left: number;
  right: number;
  bottom: number;
  centre: number | null;
}

function CrossFigure({
  cross,
  live,
  index,
}: {
  cross: Cross;
  live?: number | null;
  index: number;
}) {
  const centre = live !== undefined ? live : cross.centre;
  const cell = "w-11 h-9 grid place-items-center border-2 border-slate-300 bg-white font-mono text-sm font-black text-slate-800";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Figure {index}
      </div>
      <div className="inline-grid grid-cols-3 gap-px">
        <span />
        <div className={cell}>{cross.top}</div>
        <span />
        <div className={cell}>{cross.left}</div>
        <div
          className={`${cell} ${
            live !== undefined
              ? centre === null
                ? "border-emerald-500 border-dashed text-emerald-500"
                : "border-emerald-600 bg-emerald-50 text-emerald-800"
              : ""
          }`}
        >
          {centre === null ? "?" : centre}
        </div>
        <div className={cell}>{cross.right}</div>
        <span />
        <div className={cell}>{cross.bottom}</div>
        <span />
      </div>
    </div>
  );
}

export function Q01NumberCrossActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<CrossState>) {
  const cfg = question?.customConfig ?? {};
  const crosses: Cross[] = cfg.crosses ?? [];
  const range = cfg.dialRange ?? { min: 0, max: 40 };

  const engine = useActivityEngine<CrossState, string>({
    initialState: { centre: null },
    resolve: (s) => matchNumber(question, s.centre ?? undefined),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { centre } = engine.state;

  return (
    <ActivityShell
      title="Number Cross Machine"
      howTo="Study how the arms of the first two crosses relate to their centre, then dial the third centre until it obeys the same rule."
      icon={Grid3x3}
      answerText={centre === null ? undefined : String(centre)}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Drag the dial to set the missing centre value"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <Stage label="The three crosses">
          <div className="flex flex-wrap items-start justify-center gap-5">
            {crosses.map((c, i) => (
              <CrossFigure
                key={i}
                cross={c}
                index={i + 1}
                live={c.centre === null ? centre : undefined}
              />
            ))}
          </div>
        </Stage>

        <Stage label="Centre dial">
          <NumberScale
            min={range.min}
            max={range.max}
            step={1}
            value={centre}
            onChange={(v) => engine.update({ centre: v })}
            readOnly={engine.readOnly}
            label="Missing centre"
          />
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q2 — Transformation Lab
   Rotate the arm assembly, then mark the arms the markers ride on.
   ══════════════════════════════════════════════════════════════ */

const SLOTS_0 = ["N", "E", "S", "W"] as const;
const SLOTS_45 = ["NE", "SE", "SW", "NW"] as const;
const SLOT_ANGLE: Record<string, number> = {
  N: -90, NE: -45, E: 0, SE: 45, S: 90, SW: 135, W: 180, NW: -135,
};

interface TransformState {
  rotation: number;
  markers: string[];
}

function ArmFigure({
  rotation,
  markers,
  onToggle,
  readOnly,
  size = 110,
}: {
  rotation: number;
  markers: string[];
  onToggle?: (slot: string) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const slots = rotation === 0 ? SLOTS_0 : SLOTS_45;
  const R = 38;
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="select-none">
      <rect x="4" y="4" width="92" height="92" rx="4" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      {slots.map((slot) => {
        const a = (SLOT_ANGLE[slot] * Math.PI) / 180;
        const x = 50 + R * Math.cos(a);
        const y = 50 + R * Math.sin(a);
        const marked = markers.includes(slot);
        return (
          <g key={slot}>
            <line x1={50} y1={50} x2={x} y2={y} stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
            {onToggle && (
              <circle
                cx={x}
                cy={y}
                r={10}
                fill="transparent"
                style={{ cursor: readOnly ? "default" : "pointer" }}
                onClick={() => !readOnly && onToggle(slot)}
              />
            )}
            <circle
              cx={x}
              cy={y}
              r={marked ? 5 : 3}
              fill={marked ? "#059669" : "#fff"}
              stroke={marked ? "#047857" : "#94a3b8"}
              strokeWidth="1.8"
              pointerEvents="none"
            />
          </g>
        );
      })}
      <circle cx={50} cy={50} r={2.6} fill="#334155" />
    </svg>
  );
}

export function Q02TransformationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<TransformState>) {
  const cfg = question?.customConfig ?? {};
  const source = cfg.source ?? { rotation: 0, markers: ["W", "E"] };
  const target = cfg.target ?? { rotation: 45, markers: ["W", "E"] };

  const engine = useActivityEngine<TransformState, string>({
    initialState: { rotation: 0, markers: [] },
    resolve: (s) =>
      s.markers.length !== 2
        ? undefined
        : matchOptionState(question, s, (opt, built) =>
            opt.rotation === built.rotation && sameSet(opt.markers ?? [], built.markers)
          ),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { rotation, markers } = engine.state;

  const toggle = (slot: string) =>
    engine.update((prev) => {
      const has = prev.markers.includes(slot);
      if (has) return { ...prev, markers: prev.markers.filter((m) => m !== slot) };
      if (prev.markers.length >= 2) return { ...prev, markers: [prev.markers[1], slot] };
      return { ...prev, markers: [...prev.markers, slot] };
    });

  return (
    <ActivityShell
      title="Transformation Lab"
      howTo="See what happens between figures (i) and (ii), then apply the same change to figure (iii): turn the assembly, and mark the arms the two markers end up on."
      icon={RotateCw}
      answerText={
        markers.length === 2 ? `Turned ${rotation}° • markers on ${[...markers].sort().join(" and ")}` : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Turn the assembly and place both markers"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <Stage label="The relationship you must copy">
          <div className="flex items-center justify-center gap-3">
            <ArmFigure rotation={source.rotation} markers={source.markers} size={92} />
            <span className="text-2xl font-black text-slate-400">→</span>
            <ArmFigure rotation={target.rotation} markers={target.markers} size={92} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              (i) becomes (ii)
            </span>
          </div>
        </Stage>

        <Stage label="Your figure (iii)">
          <div className="flex flex-wrap items-center justify-center gap-5">
            <ArmFigure
              rotation={rotation}
              markers={markers}
              onToggle={toggle}
              readOnly={engine.readOnly}
              size={150}
            />
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Turn the assembly
              </div>
              <div className="flex gap-1.5">
                {[0, 45].map((r) => (
                  <Tile
                    key={r}
                    active={rotation === r}
                    readOnly={engine.readOnly}
                    onClick={() => engine.update({ rotation: r, markers: [] })}
                    className="px-3 text-xs"
                  >
                    {r}°
                  </Tile>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 max-w-[190px] leading-snug">
                Tap the end of an arm to put a marker on it. Two markers, exactly as in the
                original figure.
              </p>
              <Metric label="Markers placed" value={`${markers.length} of 2`} tone={markers.length === 2 ? "emerald" : "slate"} />
            </div>
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q3 — Renaming Machine
   Feed in the object a cricketer really uses; read the printed name.
   ══════════════════════════════════════════════════════════════ */

interface RenameState {
  loaded: string | null;
}

export function Q03RenamingMachineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<RenameState>) {
  const cfg = question?.customConfig ?? {};
  const renames: { real: string; calledAs: string }[] = cfg.renames ?? [];

  const printed = (real: string | null) =>
    real ? renames.find((r) => r.real === real)?.calledAs : undefined;

  const engine = useActivityEngine<RenameState, string>({
    initialState: { loaded: null },
    resolve: (s) => matchText(question, printed(s.loaded)),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { loaded } = engine.state;
  const output = printed(loaded);

  return (
    <ActivityShell
      title="Renaming Machine"
      howTo="The machine is programmed with this question's renaming rules. Load the object a cricketer actually plays with and read the label it prints."
      icon={Factory}
      answerText={output}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Put an object into the machine"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3.5">
        <Stage label="Machine programme">
          <div className="flex flex-wrap gap-1.5">
            {renames.map((r) => (
              <span
                key={r.real}
                className="text-[11px] font-mono font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              >
                {r.real} <span className="text-slate-400">is called</span>{" "}
                <span className="text-emerald-700">{r.calledAs}</span>
              </span>
            ))}
          </div>
        </Stage>

        <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <Stage label="Objects on the bench">
            <div className="grid grid-cols-2 gap-1.5">
              {renames.map((r) => (
                <Tile
                  key={r.real}
                  active={loaded === r.real}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update({ loaded: loaded === r.real ? null : r.real })}
                  className="px-2 text-[11px]"
                >
                  {r.real}
                </Tile>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500 leading-snug">
              {cfg.prompt}
            </p>
          </Stage>

          <div className="hidden sm:grid place-items-center text-3xl font-black text-slate-300">→</div>

          <Stage label="Printed label">
            <div
              className={`h-[86px] rounded-xl border-2 border-dashed grid place-items-center text-center px-3 ${
                output ? "border-emerald-400 bg-emerald-50" : "border-slate-300 bg-white"
              }`}
            >
              {output ? (
                <span className="font-black text-lg text-emerald-800">{output}</span>
              ) : (
                <span className="text-xs font-semibold text-slate-400">Nothing loaded yet</span>
              )}
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q4 — Dot Regions
   Four arrangements; drag three dots to reproduce the given condition.
   ══════════════════════════════════════════════════════════════ */

type Shape =
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "tri"; pts: [number, number][] };

const BOARDS: Record<string, { c: Shape; s: Shape; t: Shape }> = {
  A: {
    c: { kind: "circle", cx: 30, cy: 50, r: 18 },
    s: { kind: "rect", x: 20, y: 32, w: 36, h: 36 },
    t: { kind: "tri", pts: [[70, 74], [94, 74], [82, 48]] },
  },
  B: {
    c: { kind: "circle", cx: 26, cy: 46, r: 15 },
    s: { kind: "rect", x: 60, y: 28, w: 28, h: 28 },
    t: { kind: "tri", pts: [[30, 78], [58, 78], [44, 52]] },
  },
  C: {
    c: { kind: "circle", cx: 44, cy: 52, r: 20 },
    s: { kind: "rect", x: 34, y: 34, w: 38, h: 38 },
    t: { kind: "tri", pts: [[28, 68], [72, 68], [50, 32]] },
  },
  D: {
    c: { kind: "circle", cx: 34, cy: 50, r: 19 },
    s: { kind: "rect", x: 66, y: 34, w: 26, h: 26 },
    t: { kind: "tri", pts: [[24, 66], [56, 66], [40, 38]] },
  },
};

function inside(shape: Shape, x: number, y: number): boolean {
  if (shape.kind === "circle") {
    return (x - shape.cx) ** 2 + (y - shape.cy) ** 2 <= shape.r ** 2;
  }
  if (shape.kind === "rect") {
    return x >= shape.x && x <= shape.x + shape.w && y >= shape.y && y <= shape.y + shape.h;
  }
  const [[x1, y1], [x2, y2], [x3, y3]] = shape.pts;
  const d = (ax: number, ay: number, bx: number, by: number) => (bx - ax) * (y - ay) - (by - ay) * (x - ax);
  const d1 = d(x1, y1, x2, y2);
  const d2 = d(x2, y2, x3, y3);
  const d3 = d(x3, y3, x1, y1);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

interface DotState {
  board: string;
  dots: Record<string, { x: number; y: number }[]>;
}

const DEFAULT_DOTS = [
  { x: 14, y: 20 },
  { x: 30, y: 20 },
  { x: 46, y: 20 },
];

export function Q04DotRegionsActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<DotState>) {
  const cfg = question?.customConfig ?? {};
  const required: { id: string; inside: string[] }[] = cfg.requiredRegions ?? [];

  const membership = (board: string, x: number, y: number) => {
    const b = BOARDS[board];
    const keys: string[] = [];
    if (inside(b.c, x, y)) keys.push("c");
    if (inside(b.s, x, y)) keys.push("s");
    if (inside(b.t, x, y)) keys.push("t");
    return keys.sort();
  };

  const boardSatisfied = (board: string, dots: { x: number; y: number }[]) => {
    const want = required.map((r) => [...r.inside].sort().join(""));
    const got = dots.map((d) => membership(board, d.x, d.y).join(""));
    return sameSet(want, got);
  };

  const engine = useActivityEngine<DotState, string>({
    initialState: {
      board: "A",
      dots: { A: [...DEFAULT_DOTS], B: [...DEFAULT_DOTS], C: [...DEFAULT_DOTS], D: [...DEFAULT_DOTS] },
    },
    resolve: (s) => {
      const hit = Object.keys(BOARDS).find((b) => boardSatisfied(b, s.dots[b] ?? []));
      return hit;
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { board, dots } = engine.state;
  const active = dots[board] ?? DEFAULT_DOTS;
  const shapes = BOARDS[board];

  const moveDot = (i: number, x: number, y: number) =>
    engine.update((prev) => {
      const next = [...(prev.dots[prev.board] ?? DEFAULT_DOTS)];
      next[i] = { x, y };
      return { ...prev, dots: { ...prev.dots, [prev.board]: next } };
    });

  const conditions = required.map((r, i) => {
    const m = active[i] ? membership(board, active[i].x, active[i].y) : [];
    const want = [...r.inside].sort();
    const names = (k: string[]) =>
      k.length === 0 ? "outside every shape" : k.map((x) => ({ c: "circle", s: "square", t: "triangle" }[x])).join(" + ");
    return {
      id: r.id,
      label: `Dot ${i + 1} must sit in: ${names(want)} — currently ${names(m)}`,
      met: sameSet(want, m),
    };
  });

  return (
    <ActivityShell
      title="Dot Placement Board"
      howTo="Each arrangement is one of the options. Drag the three dots on a board until every dot sits in exactly the combination of shapes the given figure uses — only one arrangement can take all three."
      icon={Target}
      answerText={engine.answer ? `Arrangement ${engine.answer} satisfies every condition` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Drag the dots until all three conditions are met on one board"
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <div className="flex gap-1">
          {Object.keys(BOARDS).map((b) => (
            <Tile
              key={b}
              active={board === b}
              readOnly={engine.readOnly}
              onClick={() => engine.update((p) => ({ ...p, board: b }))}
              className="w-10 text-xs"
              ariaLabel={`Arrangement ${b}`}
            >
              {b}
            </Tile>
          ))}
        </div>
      }
    >
      <div className="grid sm:grid-cols-[1.15fr_1fr] gap-3">
        <Stage label={`Arrangement ${board}`}>
          <DragSurface aspect="aspect-square">
            <rect x="0" y="0" width="100" height="100" fill="#fff" />
            {shapes.s.kind === "rect" && (
              <rect
                x={shapes.s.x}
                y={shapes.s.y}
                width={shapes.s.w}
                height={shapes.s.h}
                fill="#e0f2fe"
                fillOpacity="0.55"
                stroke="#0284c7"
                strokeWidth="1.1"
              />
            )}
            {shapes.t.kind === "tri" && (
              <polygon
                points={shapes.t.pts.map((p) => p.join(",")).join(" ")}
                fill="#fef3c7"
                fillOpacity="0.6"
                stroke="#d97706"
                strokeWidth="1.1"
              />
            )}
            {shapes.c.kind === "circle" && (
              <circle
                cx={shapes.c.cx}
                cy={shapes.c.cy}
                r={shapes.c.r}
                fill="#dcfce7"
                fillOpacity="0.5"
                stroke="#16a34a"
                strokeWidth="1.1"
              />
            )}
            {active.map((d, i) => (
              <DraggableDot
                key={i}
                x={d.x}
                y={d.y}
                label={String(i + 1)}
                tone="rose"
                readOnly={engine.readOnly}
                onMove={(x, y) => moveDot(i, x, y)}
              />
            ))}
          </DragSurface>
        </Stage>

        <Stage label="Conditions from the given figure">
          <Conditions items={conditions} />
          <p className="mt-2 text-[11px] text-slate-500 leading-snug">
            Switch arrangements with the A–D buttons above. Each board keeps its own dots, so
            you can test one and come back.
          </p>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q5 — Carrom Board
   Seat the players so every stated condition holds, then read who faces west.
   ══════════════════════════════════════════════════════════════ */

const SEATS = ["N", "E", "S", "W"] as const;
type Seat = (typeof SEATS)[number];
const BEARING: Record<Seat, number> = { N: 0, E: 90, S: 180, W: 270 };
const BY_BEARING: Record<number, Seat> = { 0: "N", 90: "E", 180: "S", 270: "W" };
const DIR_NAME: Record<number, string> = { 0: "North", 90: "East", 180: "South", 270: "West" };

/** A player seated at `seat` looks across the board, so they face the opposite way. */
const facingOf = (seat: Seat) => (BEARING[seat] + 180) % 360;
/** The seat occupied by the player on their right hand. */
const rightSeatOf = (seat: Seat) => BY_BEARING[(BEARING[seat] + 270) % 360];

interface CarromState {
  seats: Record<Seat, string | null>;
  picked: string | null;
}

export function Q05CarromActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<CarromState>) {
  const cfg = question?.customConfig ?? {};
  const players: string[] = cfg.players ?? [];
  const anchor = cfg.anchor ?? { player: "B", facing: "N" };
  const rightOf: { of: string; is: string }[] = cfg.rightOf ?? [];

  const seatOf = (seats: Record<Seat, string | null>, player: string) =>
    SEATS.find((s) => seats[s] === player);

  const checks = (seats: Record<Seat, string | null>) => {
    const anchorSeat = seatOf(seats, anchor.player);
    const anchorOk =
      anchorSeat !== undefined && DIR_NAME[facingOf(anchorSeat)].startsWith(anchor.facing);
    const rightOks = rightOf.map((r) => {
      const a = seatOf(seats, r.of);
      const b = seatOf(seats, r.is);
      return a !== undefined && b !== undefined && rightSeatOf(a) === b;
    });
    return { anchorOk, rightOks, all: anchorOk && rightOks.every(Boolean) };
  };

  const engine = useActivityEngine<CarromState, string>({
    initialState: { seats: { N: null, E: null, S: null, W: null }, picked: null },
    resolve: (s) => {
      const filled = SEATS.every((k) => s.seats[k]);
      if (!filled) return undefined;
      if (!checks(s.seats).all) return undefined;
      const westSeat = SEATS.find((k) => DIR_NAME[facingOf(k)] === "West");
      const who = westSeat ? s.seats[westSeat] : null;
      return matchText(question, who ?? undefined);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { seats, picked } = engine.state;
  const status = checks(seats);
  const seated = (p: string) => SEATS.some((s) => seats[s] === p);

  const placeAt = (seat: Seat) =>
    engine.update((prev) => {
      if (prev.seats[seat]) return { ...prev, seats: { ...prev.seats, [seat]: null } };
      if (!prev.picked) return prev;
      const cleared: Record<Seat, string | null> = { ...prev.seats };
      SEATS.forEach((s) => {
        if (cleared[s] === prev.picked) cleared[s] = null;
      });
      cleared[seat] = prev.picked;
      return { seats: cleared, picked: null };
    });

  const seatBox = (seat: Seat) => {
    const who = seats[seat];
    return (
      <button
        key={seat}
        type="button"
        disabled={engine.readOnly}
        onClick={() => placeAt(seat)}
        className={`min-h-[52px] w-[74px] rounded-xl border-2 grid place-items-center transition ${
          who
            ? "bg-emerald-600 border-emerald-700 text-white"
            : picked
            ? "bg-white border-emerald-400 border-dashed text-emerald-600 hover:bg-emerald-50"
            : "bg-white border-slate-200 text-slate-400"
        }`}
      >
        <span className="font-black text-base leading-none">{who ?? "+"}</span>
        <span className="text-[9px] font-bold uppercase tracking-wide opacity-80 mt-0.5">
          faces {DIR_NAME[facingOf(seat)]}
        </span>
      </button>
    );
  };

  const westSeat = SEATS.find((k) => DIR_NAME[facingOf(k)] === "West") as Seat;
  const facingWest = seats[westSeat];

  return (
    <ActivityShell
      title="Carrom Table"
      howTo="Pick a player, then tap a side of the board to seat them. Everyone looks across the board, so the side they sit on decides the way they face. Satisfy every condition, then read who is facing west."
      icon={Users}
      answerText={engine.answer && facingWest ? `${facingWest} is facing west` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Seat all four players so that every condition is met"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[1fr_1fr] gap-3">
        <Stage label="The board">
          <div className="grid grid-cols-3 gap-2 place-items-center">
            <span />
            {seatBox("N")}
            <span />
            {seatBox("W")}
            <div className="w-[74px] h-[74px] rounded-xl border-2 border-amber-300 bg-amber-50 grid place-items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 text-center leading-tight">
                Carrom
                <br />
                board
              </span>
            </div>
            {seatBox("E")}
            <span />
            {seatBox("S")}
            <span />
          </div>
        </Stage>

        <div className="space-y-3">
          <Stage label="Players">
            <div className="flex flex-wrap gap-1.5">
              {players.map((p) => (
                <Tile
                  key={p}
                  active={picked === p}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((prev) => ({ ...prev, picked: prev.picked === p ? null : p }))}
                  className={`w-12 text-sm ${seated(p) ? "opacity-45" : ""}`}
                >
                  {p}
                </Tile>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500 leading-snug">
              Tap a seated player&apos;s square to lift them off the board again.
            </p>
          </Stage>

          <Stage label="Conditions">
            <Conditions
              items={[
                {
                  id: "anchor",
                  label: `${anchor.player} is facing ${DIR_NAME[{ N: 0, E: 90, S: 180, W: 270 }[anchor.facing as Seat]]}`,
                  met: status.anchorOk,
                },
                ...rightOf.map((r, i) => ({
                  id: `r${i}`,
                  label: `${r.is} is to the right of ${r.of}`,
                  met: status.rightOks[i],
                })),
              ]}
            />
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

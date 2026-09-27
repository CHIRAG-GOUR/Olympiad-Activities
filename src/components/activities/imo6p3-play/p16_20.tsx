"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Vault, Clock, Bot, Grid2x2, Compass } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, r4, Pt } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q16–Q20. */

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Place-Value Vault
   Each letter gets a place-value card. The vault adds the equation's terms live and opens
   only when they make the target; the asked expression is then worked from the same cards.
   ══════════════════════════════════════════════════════════════════════ */

export function Q16PlaceValueVaultActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const target = cfg<number>(question, "target", 0);
  const terms = cfg<{ k: string; coef: number; recip: boolean }[]>(question, "terms", []);
  const ask = cfg<Record<string, number>>(question, "ask", {});
  const askText = cfg<string>(question, "askText", "");
  const cards = cfg<number[]>(question, "cards", []);
  const [slot, setSlot] = useState(terms[0]?.k ?? "P");
  const termVal = (t: (typeof terms)[number], v?: number) => (v === undefined ? 0 : t.recip ? t.coef / v : t.coef * v);
  const play = usePlay<{ v: Record<string, number> }>({
    question,
    initial: { v: {} },
    derive: (w) => {
      if (terms.some((t) => w.v[t.k] === undefined)) return { note: "Give every letter a place-value card." };
      const sum = r4(terms.reduce((s, t) => s + termVal(t, w.v[t.k]), 0));
      if (Math.abs(sum - target) > 1e-9) return { note: `The terms add to ${sum}, not ${target}. The vault stays shut.` };
      const e = r4(Object.entries(ask).reduce((s, [k, c]) => s + c * w.v[k], 0));
      return { value: String(e), optionId: matchNumber(question, e, 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const sum = r4(terms.reduce((s, t) => s + termVal(t, w.v[t.k]), 0));
  const open = Math.abs(sum - target) < 1e-9 && terms.every((t) => w.v[t.k] !== undefined);

  return (
    <Shell
      play={play}
      question={question}
      title="Place-Value Vault"
      mission={`Pick a letter, then a place-value card for it. The vault adds the terms live. When they make exactly ${target} the vault opens and works out ${askText} from your cards.`}
      icon={Vault}
      dim="2D"
      submitLabel="Submit the expression's value"
      hints={cfg<string[]>(question, "hints", ["Each term supplies one digit of 35.4067: the 3 is 3 tens, the 5 is 5 ones, and so on.", "For 3/P to be 30, P must be a fraction."])}
      live={
        <>
          <Gauge label="Terms add to" value={sum} tone={open ? "emerald" : "amber"} />
          <Gauge label="Vault" value={open ? "OPEN" : "locked"} tone={open ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {terms.map((t) => (
          <button key={t.k} type="button" onClick={() => setSlot(t.k)} aria-label={`letter ${t.k}`} className={`rounded-xl border-2 p-2 text-center ${slot === t.k ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-white"}`}>
            <div className="font-mono text-sm font-black">{t.recip ? `${t.coef}/${t.k}` : `${t.coef}${t.k}`}</div>
            <div className="font-mono text-lg font-black text-violet-700">
              {t.k} = {w.v[t.k] ?? "?"}
            </div>
            <div className="text-[10px] font-bold text-slate-500">= {w.v[t.k] === undefined ? "?" : r4(termVal(t, w.v[t.k]))}</div>
          </button>
        ))}
      </div>
      <Bay label={`Cards for ${slot}`} tone="violet">
        <div className="flex flex-wrap gap-1.5">
          {cards.map((c) => (
            <Btn key={c} className="px-2 font-mono" active={w.v[slot] === c} tone={w.v[slot] === c ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ v: { ...p.v, [slot]: c } }))} ariaLabel={`card ${c}`}>
              {c}
            </Btn>
          ))}
        </div>
      </Bay>
      <div className={`rounded-xl p-2 font-mono font-black text-center ${open ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-500"}`}>
        {open ? `${askText} = ${r4(Object.entries(ask).reduce((s, [k, c]) => s + c * w.v[k], 0))}` : "🔒 vault locked"}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — Clock Workshop
   The student winds the clock; the hour hand creeps with the minutes. The gauge between
   the hands reads the smaller angle.
   ══════════════════════════════════════════════════════════════════════ */

export function Q17ClockWorkshopActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ mins: number; read: boolean }>({
    question,
    initial: { mins: 3 * 60 + 25, read: false },
    derive: (w) => {
      if (!w.read) return { note: "Set the clock, then read the angle gauge." };
      const h = (w.mins / 60) % 12;
      const m = w.mins % 60;
      const a = Math.abs(30 * h - 6 * m);
      const small = Math.min(a, 360 - a);
      return { value: `${small}°`, optionId: matchNumber(question, small) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const hA = (30 * ((w.mins / 60) % 12)) % 360;
  const mA = 6 * (w.mins % 60);
  const a = Math.abs(hA - mA);
  const small = Math.min(a, 360 - a);
  const hand = (deg: number, len: number) => [50 + len * Math.sin((deg * Math.PI) / 180), 50 - len * Math.cos((deg * Math.PI) / 180)];
  const time = `${Math.floor(w.mins / 60) % 12 || 12}:${String(w.mins % 60).padStart(2, "0")}`;
  const wind = (d: number) => play.set((p) => ({ mins: (((p.mins + d) % 720) + 720) % 720, read: false }));
  const [hx, hy] = hand(hA, 22);
  const [mx, my] = hand(mA, 34);

  return (
    <Shell
      play={play}
      question={question}
      title="Clock Workshop"
      mission="Wind the crown to set the clock to the time in the question. The gauge opens between the two hands and shows the smaller angle. Read the gauge when the clock is set."
      icon={Clock}
      dim="2D"
      submitLabel="Submit the angle"
      hints={["Each hour mark is 30° from the next.", "At an exact hour the minute hand points straight up at 12."]}
      live={
        <>
          <Gauge label="Clock" value={time} tone="violet" />
          <Gauge label="Gauge" value={`${small}°`} tone="amber" />
        </>
      }
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-center">
        <svg viewBox="0 0 100 100" className="w-56 h-56">
          <circle cx={50} cy={50} r={46} fill="#fff" stroke="#334155" strokeWidth={2} />
          {Array.from({ length: 12 }, (_, i) => {
            const [x, y] = hand(i * 30, 38);
            return (
              <text key={i} x={x} y={y + 2} fontSize={7} textAnchor="middle" fontWeight={900}>
                {i || 12}
              </text>
            );
          })}
          <path d={`M 50 50 L ${hand(hA, 14).join(" ")} A 14 14 0 0 ${(mA - hA + 360) % 360 > 180 ? 0 : 1} ${hand(mA, 14).join(" ")} Z`} fill="#fbbf2466" />
          <line x1={50} y1={50} x2={hx} y2={hy} stroke="#1e1b4b" strokeWidth={3} strokeLinecap="round" />
          <line x1={50} y1={50} x2={mx} y2={my} stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" />
          <circle cx={50} cy={50} r={2} />
        </svg>
        <div className="space-y-2">
          <Bay label="Crown" tone="violet">
            <div className="flex flex-wrap gap-1.5">
              <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(-60)}>−1 hour</Btn>
              <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(-5)}>−5 min</Btn>
              <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(5)}>+5 min</Btn>
              <Btn tone="slate" disabled={play.readOnly} onClick={() => wind(60)}>+1 hour</Btn>
            </div>
          </Bay>
          <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ read: true })}>
            📐 Read the angle gauge
          </Btn>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — Perimeter Robot
   The robot drives only along the outside edge of the shaded cells, one 1 cm edge at a
   time, and never over an edge twice. Home again with every edge driven, the counter is
   the perimeter.
   ══════════════════════════════════════════════════════════════════════ */

const boundaryEdges = (cells: Pt[]) => {
  const has = (x: number, y: number) => cells.some((c) => c[0] === x && c[1] === y);
  const out = new Set<string>();
  const add = (a: Pt, b: Pt) => out.add([a, b].map((p) => p.join(",")).sort().join("|"));
  cells.forEach(([x, y]) => {
    if (!has(x, y - 1)) add([x, y], [x + 1, y]);
    if (!has(x, y + 1)) add([x, y + 1], [x + 1, y + 1]);
    if (!has(x - 1, y)) add([x, y], [x, y + 1]);
    if (!has(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
  });
  return out;
};
const ekey = (a: Pt, b: Pt) => [a, b].map((p) => p.join(",")).sort().join("|");

export function Q18PerimeterRobotActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const cells = cfg<Pt[]>(question, "cells", []);
  const cols = cfg<number>(question, "cols", 8);
  const rows = cfg<number>(question, "rows", 6);
  const edges = React.useMemo(() => boundaryEdges(cells), [cells]);
  const home: Pt = cells.length ? [cells[0][0], cells[0][1]] : [0, 0];
  const play = usePlay<{ at: Pt; walked: string[] }>({
    question,
    initial: { at: home, walked: [] },
    derive: (w) => {
      const back = w.at[0] === home[0] && w.at[1] === home[1];
      if (!back || w.walked.length < edges.size) return { note: `Drive round the whole outside edge and come home (${w.walked.length} cm so far).` };
      return { value: `${w.walked.length} cm`, optionId: matchNumber(question, w.walked.length) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const S = 11;
  const drive = (dx: number, dy: number) =>
    play.set((p) => {
      const to: Pt = [p.at[0] + dx, p.at[1] + dy];
      const k = ekey(p.at, to);
      if (!edges.has(k) || p.walked.includes(k)) return p;
      return { at: to, walked: [...p.walked, k] };
    });

  return (
    <Shell
      play={play}
      question={question}
      title="Perimeter Robot"
      mission="Steer the robot along the outside edge of the shaded region, one grid edge (1 cm) at a time. It refuses to drive inside the shape, off its edge, or over an edge twice. Bring it home after driving every edge."
      icon={Bot}
      dim="2D"
      submitLabel="Submit the perimeter"
      hints={["Where two shaded squares only touch at a corner, the robot can turn either way — follow the outline you have not driven yet.", "Every edge of a shaded square that is not shared with another shaded square is part of the perimeter."]}
      live={
        <>
          <Gauge label="Edges driven" value={`${w.walked.length} cm`} tone="violet" />
          <Gauge label="Home?" value={w.at[0] === home[0] && w.at[1] === home[1] ? "yes" : "no"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-3">
        <Board>
          <svg viewBox={`-4 -4 ${cols * S + 8} ${rows * S + 8}`} className="w-full max-h-80">
            {Array.from({ length: cols + 1 }, (_, i) => <line key={`v${i}`} x1={i * S} x2={i * S} y1={0} y2={rows * S} stroke="#94a3b8" strokeWidth={0.4} />)}
            {Array.from({ length: rows + 1 }, (_, i) => <line key={`h${i}`} y1={i * S} y2={i * S} x1={0} x2={cols * S} stroke="#94a3b8" strokeWidth={0.4} />)}
            {cells.map(([x, y]) => <rect key={`${x},${y}`} x={x * S} y={y * S} width={S} height={S} fill="#c4b5fd" />)}
            {w.walked.map((k) => {
              const [a, b] = k.split("|").map((s) => s.split(",").map(Number));
              return <line key={k} x1={a[0] * S} y1={a[1] * S} x2={b[0] * S} y2={b[1] * S} stroke="#f59e0b" strokeWidth={1.6} />;
            })}
            <motion.circle animate={{ cx: w.at[0] * S, cy: w.at[1] * S }} r={2.6} fill="#0f172a" />
          </svg>
        </Board>
        <Bay label="Steering" tone="violet">
          <div className="grid grid-cols-3 gap-1 w-40 mx-auto">
            <span />
            <Btn disabled={play.readOnly} onClick={() => drive(0, -1)} ariaLabel="drive north">▲</Btn>
            <span />
            <Btn disabled={play.readOnly} onClick={() => drive(-1, 0)} ariaLabel="drive west">◀</Btn>
            <span className="text-center self-center text-xl">🤖</span>
            <Btn disabled={play.readOnly} onClick={() => drive(1, 0)} ariaLabel="drive east">▶</Btn>
            <span />
            <Btn disabled={play.readOnly} onClick={() => drive(0, 1)} ariaLabel="drive south">▼</Btn>
            <span />
          </div>
          <Btn tone="slate" className="mt-2" disabled={play.readOnly || !w.walked.length} onClick={() => play.set({ at: home, walked: [] })}>
            Send the robot home
          </Btn>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — Architect's Tiling Studio
   The student turns the tile to decide which side runs along the hall; a leftover strip
   means that way round does not fit. Once it fits, the floor is tiled and priced.
   ══════════════════════════════════════════════════════════════════════ */

export function Q19TilingStudioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const hall = cfg<[number, number]>(question, "hallCm", [0, 0]);
  const tile = cfg<[number, number]>(question, "tileCm", [1, 1]);
  const rate = cfg<number>(question, "rate", 1);
  const play = usePlay<{ turned: boolean; laid: boolean; priced: boolean }>({
    question,
    initial: { turned: true, laid: false, priced: false },
    derive: (w) => {
      const [a, b] = w.turned ? [tile[1], tile[0]] : tile;
      const n = Math.floor(hall[0] / a) * Math.floor(hall[1] / b);
      if (!w.laid || !w.priced) return { note: "Lay the floor, then price it." };
      const cost = n * rate;
      return { value: `${n.toLocaleString("en-IN")} tiles × ₹${rate} = ₹${cost.toLocaleString("en-IN")}`, optionId: matchNumber(question, cost) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const [a, b] = w.turned ? [tile[1], tile[0]] : tile;
  const along = hall[0] / a;
  const across = hall[1] / b;
  const fits = Number.isInteger(along) && Number.isInteger(across);
  const n = Math.floor(along) * Math.floor(across);

  return (
    <Shell
      play={play}
      question={question}
      title="Architect's Tiling Studio"
      mission={`The hall is ${hall[0] / 100} m × ${hall[1] / 100} m and a tile is ${tile[0]} cm × ${tile[1]} cm. Turn the tile until it fits both walls with nothing left over, lay the floor and price it at ₹${rate} a tile.`}
      icon={Grid2x2}
      dim="2D"
      submitLabel="Submit the cost"
      hints={["Change metres to centimetres first: 1 m = 100 cm.", "Number of tiles = tiles along the length × tiles across the width."]}
      live={
        <>
          <Gauge label="Along the length" value={`${+along.toFixed(2)} tiles`} tone={Number.isInteger(along) ? "emerald" : "rose"} />
          <Gauge label="Across the width" value={`${+across.toFixed(2)} tiles`} tone={Number.isInteger(across) ? "emerald" : "rose"} />
          <Gauge label="Tiles" value={w.laid ? n.toLocaleString("en-IN") : "—"} tone="violet" />
        </>
      }
    >
      <div className="rounded-2xl bg-stone-50 border-2 border-stone-200 p-2">
        <svg viewBox="0 0 100 34" className="w-full">
          <defs>
            <pattern id="p3q19t" width={(96 * a * 10) / hall[0]} height={(96 * b * 10) / hall[0]} patternUnits="userSpaceOnUse" x={2} y={2}>
              <rect width={(96 * a * 10) / hall[0]} height={(96 * b * 10) / hall[0]} fill="#a7f3d0" stroke="#047857" strokeWidth={0.1} />
            </pattern>
          </defs>
          <rect x={2} y={2} width={96} height={96 * (hall[1] / hall[0])} fill="#e7e5e4" stroke="#44403c" strokeWidth={0.4} />
          {w.laid && <rect x={2} y={2} width={(96 * (Math.floor(along) * a)) / hall[0]} height={(96 * (Math.floor(across) * b)) / hall[0]} fill="url(#p3q19t)" />}
          {!Number.isInteger(along) && <rect x={2 + (96 * Math.floor(along) * a) / hall[0]} y={2} width={(96 * (hall[0] - Math.floor(along) * a)) / hall[0] + 0.6} height={96 * (hall[1] / hall[0])} fill="#fb7185" />}
          {!Number.isInteger(across) && <rect x={2} y={2 + (96 * Math.floor(across) * b) / hall[0]} width={96} height={(96 * (hall[1] - Math.floor(across) * b)) / hall[0] + 0.6} fill="#fb7185" />}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn tone="sky" disabled={play.readOnly} onClick={() => play.set((p) => ({ turned: !p.turned, laid: false, priced: false }))}>
          ⟲ Turn the tile ({a} cm along the length)
        </Btn>
        <Btn tone="emerald" disabled={play.readOnly || !fits || w.laid} onClick={() => play.patch({ laid: true })}>
          {fits ? "Lay the floor" : "Leaves a strip — can't lay"}
        </Btn>
        <Btn tone="amber" disabled={play.readOnly || !w.laid} onClick={() => play.patch({ priced: true })}>
          Price at ₹{rate} a tile
        </Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — Compass Arena
   Arjun stands on the compass rose facing South-East. For each task the student dials a
   turn in quarter revolutions and a direction; Arjun spins and his heading is recorded.
   ══════════════════════════════════════════════════════════════════════ */

const ROSE = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];

export function Q20CompassArenaActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const start = Math.max(0, ROSE.findIndex((r) => r.replace(/[^A-Z]/g, "") === cfg<string>(question, "start", "SE")));
  const tasks = cfg<{ label: string }[]>(question, "tasks", []);
  const play = usePlay<{ task: number; quarters: number; dir: "cw" | "acw"; heading: number; record: (string | null)[] }>({
    question,
    initial: { task: 0, quarters: 1, dir: "cw", heading: start * 45, record: tasks.map(() => null) },
    derive: (w) => {
      if (w.record.some((r) => !r)) return { note: "Spin Arjun for each task and record where he faces." };
      const text = w.record.join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const facing = ROSE[((Math.round(w.heading / 45) % 8) + 8) % 8];

  return (
    <Shell
      play={play}
      question={question}
      title="Compass Arena"
      mission="Choose a task. Dial how many quarter revolutions to turn and which way, then spin Arjun and record where he ends up facing. Each task starts again from South-East."
      icon={Compass}
      dim="2D"
      submitLabel="Submit both headings"
      hints={["A whole revolution brings Arjun back to where he started.", "Three quarters of a revolution is three quarter-turns."]}
      live={
        <>
          <Gauge label="Facing" value={facing} tone="violet" />
          {tasks.map((t, i) => (
            <Gauge key={i} label={t.label} value={w.record[i] ?? "—"} tone={w.record[i] ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-center">
        <svg viewBox="-50 -50 100 100" className="w-56 h-56">
          <circle r={46} fill="#f0f9ff" stroke="#0369a1" strokeWidth={1} />
          {ROSE.map((r, i) => {
            const t = (i * 45 * Math.PI) / 180;
            return (
              <text key={r} x={38 * Math.sin(t)} y={-38 * Math.cos(t) + 2} fontSize={i % 2 ? 5 : 7} textAnchor="middle" fontWeight={900}>
                {r.replace(/[^A-Z]/g, "")}
              </text>
            );
          })}
          <motion.g animate={{ rotate: w.heading }} transition={{ duration: 1.2 }}>
            <polygon points="0,-26 5,4 -5,4" fill="#dc2626" />
            <circle r={6} fill="#1e293b" />
          </motion.g>
        </svg>
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {tasks.map((t, i) => (
              <Btn key={i} active={w.task === i} tone={w.task === i ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ task: i, heading: start * 45 })}>
                Task {t.label}
              </Btn>
            ))}
          </div>
          <Stepper label="Quarter turns" value={w.quarters} min={1} max={8} disabled={play.readOnly} onStep={(d) => play.patch({ quarters: w.quarters + d })} />
          <div className="flex gap-1.5">
            <Btn active={w.dir === "cw"} tone={w.dir === "cw" ? "sky" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ dir: "cw" })}>↻ clockwise</Btn>
            <Btn active={w.dir === "acw"} tone={w.dir === "acw" ? "sky" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ dir: "acw" })}>↺ anticlockwise</Btn>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ heading: start * 45 + (w.dir === "cw" ? 1 : -1) * w.quarters * 90 })}>
              Spin {w.quarters / 4} revolution{w.quarters === 4 ? "" : "s"}
            </Btn>
            <Btn tone="amber" disabled={play.readOnly || w.heading === start * 45} onClick={() => play.patch({ record: w.record.map((r, i) => (i === w.task ? facing : r)) })}>
              Record {tasks[w.task]?.label}
            </Btn>
          </div>
        </div>
      </div>
    </Shell>
  );
}

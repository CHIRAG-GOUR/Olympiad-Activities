"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rows3, Triangle, ArrowDownUp, Atom, Waves } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchOptionState } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Pt, toggle } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — Pattern Conveyor
   Four problem frames ride the conveyor. In each, the arrow turns 45° clockwise and the
   square hops one side clockwise round the frame. The student builds frame 5 by turning
   the arrow and moving the square; the finished frame is compared with the options.
   ══════════════════════════════════════════════════════════════════════ */

const SIDES = ["top", "right", "bottom", "left"] as const;
type Side = (typeof SIDES)[number];
const Q1_STATES: Record<string, { arrow: number; square: Side }> = {
  A: { arrow: 270, square: "left" },
  B: { arrow: 315, square: "bottom" },
  C: { arrow: 90, square: "right" },
  D: { arrow: 0, square: "bottom" },
};
const SQ_AT: Record<Side, Pt> = { top: [30, 8], right: [52, 30], bottom: [30, 52], left: [8, 30] };

function Frame({ arrow, square, size = "w-20" }: { arrow: number | null; square: Side | null; size?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`${size} bg-white rounded-lg border border-indigo-200`}>
      {arrow !== null && (
        <g transform={`rotate(${arrow} 30 30)`}>
          <line x1={16} y1={30} x2={42} y2={30} stroke="#4338ca" strokeWidth={3} />
          <polygon points="44,30 36,25 36,35" fill="#4338ca" />
        </g>
      )}
      {square && <rect x={SQ_AT[square][0] - 5} y={SQ_AT[square][1] - 5} width={10} height={10} fill="#f59e0b" stroke="#b45309" />}
    </svg>
  );
}

export function Q01PatternConveyorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const frames = [0, 1, 2, 3].map((i) => ({ arrow: (180 + i * 45) % 360, square: SIDES[(2 + i) % 4] }));
  const play = usePlay<{ arrow: number; square: Side | null; placed: boolean }>({
    question,
    initial: { arrow: 90, square: null, placed: false },
    derive: (w) =>
      !w.placed || !w.square
        ? { note: "Build frame 5 and load it onto the conveyor." }
        : { value: `Arrow at ${w.arrow}°, square on the ${w.square}`, optionId: matchOptionState({ ...question!, customConfig: { optionStates: Q1_STATES } } as never, w, (o: { arrow: number; square: Side }, b) => o.arrow === b.arrow && o.square === b.square) },
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
      title="Pattern Conveyor"
      mission="Study how the arrow and the square change from frame to frame. Then build frame 5: turn the arrow in 45° steps and move the square to a side of the frame. Load it onto the conveyor."
      icon={Rows3}
      dim="2D"
      submitLabel="Submit frame 5"
      live={<Gauge label="Frame 5" value={`${w.arrow}° · square ${w.square ?? "—"}`} tone="violet" />}
    >
      <Board>
        <div className="flex flex-wrap items-center gap-2">
          {frames.map((f, i) => (
            <div key={i} className="text-center">
              <Frame arrow={f.arrow} square={f.square} />
              <div className="text-[10px] font-black text-slate-500">{i + 1}</div>
            </div>
          ))}
          <div className="text-center">
            <motion.div animate={w.placed ? { scale: [1, 1.08, 1] } : {}}>
              <Frame arrow={w.arrow} square={w.square} size="w-24" />
            </motion.div>
            <div className="text-[10px] font-black text-indigo-600">5 (yours)</div>
          </div>
        </div>
      </Board>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <Btn tone="slate" disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, placed: false, arrow: (p.arrow + 315) % 360 }))}>↺ 45°</Btn>
        <Btn tone="slate" disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, placed: false, arrow: (p.arrow + 45) % 360 }))}>45° ↻</Btn>
        {SIDES.map((s) => (
          <Btn key={s} active={w.square === s} tone={w.square === s ? "amber" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ square: s, placed: false })} ariaLabel={`square ${s}`}>
            ■ {s}
          </Btn>
        ))}
        <Btn tone="emerald" disabled={play.readOnly || !w.square} onClick={() => play.patch({ placed: true })}>Load frame 5</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q2 — Triangle Scanner
   The student taps three corners of the figure. The scanner accepts them only if all three
   sides are drawn lines of the figure, and adds the triangle to the found list. The count
   of different triangles found is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const APEX: Pt = [50, 6];
const BASE_X = [10, 36.67, 63.33, 90];
const LEVELS = [40, 65, 90];
const at = (x: number, y: number): Pt => [APEX[0] + ((x - APEX[0]) * (y - APEX[1])) / (90 - APEX[1]), y];
const Q2_POINTS: Pt[] = [APEX, ...LEVELS.flatMap((y) => BASE_X.map((x) => at(x, y)))];
const lineOf = (a: number, b: number) => {
  const P = Q2_POINTS;
  const onCevian = (i: number) => (i === 0 ? -1 : (i - 1) % 4);
  const level = (i: number) => (i === 0 ? -1 : Math.floor((i - 1) / 4));
  if (a === 0 || b === 0) return onCevian(a === 0 ? b : a) >= 0; // apex to any point lies on a cevian
  if (onCevian(a) === onCevian(b)) return true;
  if (level(a) === level(b)) return true;
  return P.length < 0;
};

export function Q02TriangleScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [pick, setPick] = useState<number[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const play = usePlay<{ found: string[] }>({
    question,
    initial: { found: [] },
    derive: (w) => (!w.found.length ? { note: "Tap three corners to scan a triangle." } : { value: `${w.found.length} triangles found`, optionId: matchNumber(question, w.found.length) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const tap = (i: number) => {
    if (play.readOnly) return;
    const next = pick.includes(i) ? pick.filter((x) => x !== i) : [...pick, i];
    if (next.length < 3) return setPick(next);
    const [a, b, c] = next;
    const P = Q2_POINTS;
    const col = Math.abs((P[b][0] - P[a][0]) * (P[c][1] - P[a][1]) - (P[b][1] - P[a][1]) * (P[c][0] - P[a][0])) < 1e-6;
    const key = [...next].sort((x, y) => x - y).join("-");
    if (col || !lineOf(a, b) || !lineOf(b, c) || !lineOf(a, c)) setMsg("Not a triangle of the figure — every side must be a drawn line.");
    else if (w.found.includes(key)) setMsg("Already found.");
    else {
      setMsg(null);
      play.set((p) => ({ found: [...p.found, key] }));
    }
    setPick([]);
  };

  return (
    <Shell
      play={play}
      question={question}
      title="Triangle Scanner"
      mission="Tap three corners of a triangle in the figure. The scanner checks that all three sides are real lines and logs it. Find every different triangle — big and small."
      icon={Triangle}
      dim="2D"
      submitLabel="Submit the triangle count"
      live={<Gauge label="Found" value={w.found.length} tone="violet" />}
    >
      <Board>
        <svg viewBox="0 0 100 96" className="w-full max-h-80">
          <path d={`M ${APEX.join(" ")} L 10 90 L 90 90 Z`} fill="#eef2ff" stroke="#312e81" strokeWidth={0.8} />
          {BASE_X.slice(1, 3).map((x) => <line key={x} x1={APEX[0]} y1={APEX[1]} x2={x} y2={90} stroke="#312e81" strokeWidth={0.8} />)}
          {LEVELS.slice(0, 2).map((y) => <line key={y} x1={at(10, y)[0]} y1={y} x2={at(90, y)[0]} y2={y} stroke="#312e81" strokeWidth={0.8} />)}
          {w.found.map((k) => {
            const ids = k.split("-").map(Number);
            return <path key={k} d={`M ${ids.map((i) => Q2_POINTS[i].join(" ")).join(" L ")} Z`} fill="#a78bfa" opacity={0.12} />;
          })}
          {Q2_POINTS.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={2.4} fill={pick.includes(i) ? "#f59e0b" : "#4338ca"} role="button" aria-label={`corner ${i}`} style={{ cursor: "pointer" }} onClick={() => tap(i)} />
          ))}
        </svg>
      </Board>
      {msg && <p className="text-xs font-bold text-rose-600 mt-1">{msg}</p>}
      <Btn tone="slate" className="mt-2" disabled={play.readOnly || !w.found.length} onClick={() => play.set({ found: [] })}>Clear the log</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q3 — Number Flip Sorting Machine
   Each number card can be flipped to reverse its digits. The student flips the cards,
   loads them onto the sorting rail in ascending order, and points the lens at the middle
   digit of the middle card.
   ══════════════════════════════════════════════════════════════════════ */

export function Q03NumberFlipSortingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const nums = cfg<number[]>(question, "originalNumbers", []);
  const rev = (n: number) => Number(String(n).split("").reverse().join(""));
  const play = usePlay<{ flipped: number[]; rail: number[]; lens: boolean }>({
    question,
    initial: { flipped: [], rail: [], lens: false },
    derive: (w) => {
      if (w.rail.length < nums.length) return { note: "Flip the cards and load all five onto the rail." };
      if (!w.lens) return { note: "Point the lens at the middle digit of the middle card." };
      const mid = String(w.flipped.includes(w.rail[2]) ? rev(nums[w.rail[2]]) : nums[w.rail[2]]);
      const d = Number(mid[1]);
      return { value: `Middle card ${mid}, middle digit ${d}`, optionId: matchNumber(question, d) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const shown = (i: number) => (w.flipped.includes(i) ? rev(nums[i]) : nums[i]);
  const sorted = w.rail.every((i, k) => k === 0 || shown(w.rail[k - 1]) <= shown(i));

  return (
    <Shell
      play={play}
      question={question}
      title="Number Flip Sorting Machine"
      mission="Tap a card's ⟲ to flip it and reverse its digits. Then load the cards onto the rail from smallest to largest, and point the lens at the middle digit of the middle card."
      icon={ArrowDownUp}
      dim="2D"
      submitLabel="Submit the digit"
      live={
        <>
          <Gauge label="Rail" value={w.rail.map(shown).join(" < ") || "empty"} tone="violet" />
          <Gauge label="In order?" value={w.rail.length ? (sorted ? "yes" : "no") : "—"} tone={sorted ? "emerald" : "rose"} />
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {nums.map((n, i) => (
          <div key={n} className="rounded-xl bg-white border border-indigo-200 p-2 text-center shadow-sm">
            <motion.div key={String(w.flipped.includes(i))} initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} className="font-mono text-2xl font-black text-indigo-900">{shown(i)}</motion.div>
            <div className="flex gap-1 mt-1">
              <Btn className="px-2 min-h-[34px]" tone="slate" disabled={play.readOnly || w.rail.includes(i)} onClick={() => play.patch({ flipped: toggle(w.flipped, i) })} ariaLabel={`flip ${n}`}>⟲</Btn>
              <Btn className="px-2 min-h-[34px]" disabled={play.readOnly || w.rail.includes(i)} onClick={() => play.patch({ rail: [...w.rail, i], lens: false })} ariaLabel={`load ${n}`}>Load</Btn>
            </div>
          </div>
        ))}
      </div>
      <Board className="mt-2">
        <div className="flex gap-2 justify-center min-h-[48px]">
          {w.rail.map((i, k) => (
            <span key={i} className={`px-3 py-2 rounded-lg font-mono text-xl font-black ${k === 2 ? "bg-amber-100 border-2 border-amber-400" : "bg-white border border-slate-200"}`}>
              {String(shown(i)).split("").map((c, j) => <span key={j} className={w.lens && k === 2 && j === 1 ? "bg-amber-300 rounded px-0.5" : ""}>{c}</span>)}
            </span>
          ))}
        </div>
      </Board>
      <div className="flex gap-2 mt-2">
        <Btn tone="amber" disabled={play.readOnly || w.rail.length < nums.length} onClick={() => play.patch({ lens: true })}>🔍 Lens on the middle digit</Btn>
        <Btn tone="slate" disabled={play.readOnly || !w.rail.length} onClick={() => play.patch({ rail: [], lens: false })}>Clear the rail</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — Number Triangle Reactor
   The student wires the reactor: how the two top numbers combine, and how the result
   combines with the bottom number. The reactor tests the wiring on the two solved
   triangles; once both glow, it computes the third.
   ══════════════════════════════════════════════════════════════════════ */

const OPS: Record<string, (a: number, b: number) => number> = { "+": (a, b) => a + b, "−": (a, b) => a - b, "×": (a, b) => a * b };
export function Q04NumberTriangleReactorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const tris = cfg<{ a: number; b: number; c: number; center: number }[]>(question, "triangles", []);
  const run = (w: { o1: string; o2: string }, t: { a: number; b: number; c: number }) => OPS[w.o2](OPS[w.o1](t.a, t.b), t.c);
  const play = usePlay<{ o1: string; o2: string }>({
    question,
    initial: { o1: "×", o2: "+" },
    derive: (w) => {
      const ex = tris.slice(0, -1);
      if (!ex.every((t) => run(w, t) === t.center)) return { note: "Rewire the reactor until both solved triangles glow." };
      const v = run(w, tris[tris.length - 1]);
      return { value: String(v), optionId: matchNumber(question, v) };
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
      title="Number Triangle Reactor"
      mission="Choose how the two top numbers combine, and how that result combines with the bottom number. The reactor tests your wiring on the first two triangles; when both glow, it runs the third."
      icon={Atom}
      dim="2D"
      submitLabel="Submit the missing number"
      live={<Gauge label="Wiring" value={`(a ${w.o1} b) ${w.o2} c`} tone="violet" />}
    >
      <div className="grid grid-cols-3 gap-2">
        {tris.map((t, k) => {
          const last = k === tris.length - 1;
          const got = run(w, t);
          const ok = !last && got === t.center;
          return (
            <div key={k} className={`rounded-2xl p-2 text-center border-2 ${last ? "bg-amber-50 border-amber-300" : ok ? "bg-emerald-50 border-emerald-400" : "bg-white border-slate-200"}`}>
              <svg viewBox="0 0 60 50" className="w-full">
                <path d="M 30 4 L 4 44 L 56 44 Z" fill="none" stroke="#4338ca" strokeWidth={1} />
                <text x={10} y={20} fontSize={6} fontWeight={900}>{t.a}</text>
                <text x={46} y={20} fontSize={6} fontWeight={900}>{t.b}</text>
                <text x={30} y={50} fontSize={6} fontWeight={900} textAnchor="middle">{t.c}</text>
                <text x={30} y={33} fontSize={8} fontWeight={900} textAnchor="middle" fill={last ? "#b45309" : "#312e81"}>{last ? "?" : t.center}</text>
              </svg>
              <div className="text-[11px] font-bold text-slate-600">reactor: {got}</div>
            </div>
          );
        })}
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mt-2">
        {(["o1", "o2"] as const).map((k) => (
          <Bay key={k} label={k === "o1" ? "top numbers: a ? b" : "then ? bottom number c"}>
            <div className="flex gap-1">
              {Object.keys(OPS).map((o) => (
                <Btn key={o} active={w[k] === o} tone={w[k] === o ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ [k]: o } as never)} ariaLabel={`${k} ${o}`}>{o}</Btn>
              ))}
            </div>
          </Bay>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — Reflection Pool
   The student places a mirror — along the water below the word, or standing at its right
   — and chooses how the tiles are laid in the pool. The pool compares the student's tiles
   with the real reflection, and the laid-out tiles are matched to the options.
   ══════════════════════════════════════════════════════════════════════ */

const Q5_STATES: Record<string, { order: string; flip: string }> = {
  A: { order: "reverse", flip: "v" },
  B: { order: "same", flip: "none" },
  C: { order: "same", flip: "v" },
  D: { order: "same", flip: "h" },
};
export function Q05WaterReflectionPoolActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const word = cfg<string>(question, "word", "");
  const play = usePlay<{ order: string; flip: string; laid: boolean }>({
    question,
    initial: { order: "same", flip: "none", laid: false },
    derive: (w) =>
      !w.laid
        ? { note: "Lay the tiles in the pool." }
        : { value: `${w.order === "same" ? "Same order" : "Reversed order"}, tiles ${w.flip === "v" ? "upside down" : w.flip === "h" ? "mirrored" : "upright"}`, optionId: matchOptionState({ ...question!, customConfig: { optionStates: Q5_STATES } } as never, w, (o: { order: string; flip: string }, b) => o.order === b.order && o.flip === b.flip) },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const chars = w.order === "same" ? word.split("") : word.split("").reverse();
  const tf = (f: string) => (f === "v" ? "scaleY(-1)" : f === "h" ? "scaleX(-1)" : undefined);

  return (
    <Shell
      play={play}
      question={question}
      title="Reflection Pool"
      mission="A water image is what you see in still water below the word. Watch the live reflection in the pool, then lay the answer tiles yourself: choose their order and how each tile is turned."
      icon={Waves}
      dim="2D"
      submitLabel="Submit the tiles"
      live={<Gauge label="Your tiles" value={`${w.order}, ${w.flip}`} tone="violet" />}
    >
      <div className="rounded-2xl bg-gradient-to-b from-white via-sky-50 to-sky-200 border border-sky-200 p-3">
        <div className="font-mono text-3xl font-black text-slate-800 tracking-widest">{word}</div>
        <div className="h-1 bg-sky-400/60 rounded my-1" />
        <div className="font-mono text-3xl font-black text-sky-700/70 tracking-widest inline-block" style={{ transform: "scaleY(-1)" }}>{word}</div>
      </div>
      <Bay label="Lay the answer tiles" tone="violet" className="mt-2">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {[["same", "Order as written"], ["reverse", "Order reversed"]].map(([k, l]) => (
            <Btn key={k} active={w.order === k} tone={w.order === k ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ order: k, laid: false })}>{l}</Btn>
          ))}
          {[["none", "Tiles upright"], ["v", "Tiles upside down ⇅"], ["h", "Tiles mirrored ⇋"]].map(([k, l]) => (
            <Btn key={k} active={w.flip === k} tone={w.flip === k ? "sky" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ flip: k, laid: false })}>{l}</Btn>
          ))}
        </div>
        <div className="flex gap-1">
          {chars.map((c, i) => <span key={i} className="w-8 h-10 grid place-items-center rounded bg-white border border-indigo-200 font-mono text-2xl font-black text-indigo-900"><span className="inline-block" style={{ transform: tf(w.flip) }}>{c}</span></span>)}
        </div>
        <Btn tone="emerald" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ laid: true })}>Lay them in the pool</Btn>
      </Bay>
    </Shell>
  );
}

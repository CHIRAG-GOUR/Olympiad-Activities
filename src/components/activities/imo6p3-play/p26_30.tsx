"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Swords, Shirt, Weight, LockKeyhole } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, gcd } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q26–Q30. */

/* ══════════════════════════════════════════════════════════════════════
   Q26 — Ratio Reduction Laboratory
   The student drops factor cutters on each ratio; a cutter only bites when it divides both
   sides. When no cutter bites any more, each ratio is in simplest form.
   ══════════════════════════════════════════════════════════════════════ */

const CUTTERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];

export function Q26RatioLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const target = cfg<[number, number]>(question, "target", [1, 1]);
  const opts = (question?.multipleChoiceConfig?.options ?? []).map((o) => ({ id: o.id, r: (o.text.match(/\d+/g) ?? []).map(Number) as [number, number] }));
  const [cutter, setCutter] = useState(2);
  const [msg, setMsg] = useState<string | null>(null);
  const play = usePlay<{ r: Record<string, [number, number]>; flagged: string | null }>({
    question,
    initial: { r: Object.fromEntries(opts.map((o) => [o.id, o.r])), flagged: null },
    derive: (w) => {
      const open = opts.filter((o) => gcd(w.r[o.id][0], w.r[o.id][1]) > 1);
      if (open.length) return { note: `Keep cutting: ${open.map((o) => o.id).join(", ")} can still be reduced.` };
      if (!w.flagged) return { note: `Flag the ratio that did not end at ${target.join(" : ")}.` };
      const o = opts.find((x) => x.id === w.flagged)!;
      return { value: `${o.r.join(" : ")} ends at ${w.r[o.id].join(" : ")}`, optionId: matchText(question, o.r.join(" : ")) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const allDone = opts.every((o) => gcd(w.r[o.id][0], w.r[o.id][1]) === 1);

  return (
    <Shell
      play={play}
      question={question}
      title="Ratio Reduction Laboratory"
      mission={`Choose a factor cutter and drop it on a ratio. It only bites when it divides both numbers. Keep cutting until no ratio can be cut, then flag the one that did not become ${target.join(" : ")}.`}
      icon={Scissors}
      dim="2D"
      submitLabel="Submit the odd ratio"
      hints={["Try the small cutters first: 3 divides a number when its digit sum is a multiple of 3.", "A ratio equal to 3 : 8 must be (some number × 3) : (the same number × 8)."]}
      live={<Gauge label="Cutter" value={`÷ ${cutter}`} tone="violet" />}
    >
      <div className="flex flex-wrap gap-1">
        {CUTTERS.map((c) => (
          <Btn key={c} className="px-2 min-h-[34px]" active={cutter === c} tone={cutter === c ? "violet" : "slate"} onClick={() => setCutter(c)} ariaLabel={`cutter ${c}`}>
            ÷{c}
          </Btn>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {opts.map((o) => {
          const [a, b] = w.r[o.id];
          const done = gcd(a, b) === 1;
          return (
            <div key={o.id} className={`rounded-xl border-2 p-2 ${done ? "bg-indigo-50 border-indigo-300" : "bg-white border-slate-200"}`}>
              <button
                type="button"
                disabled={play.readOnly}
                aria-label={`ratio ${o.id}`}
                onClick={() => {
                  if (a % cutter || b % cutter) return setMsg(`÷${cutter} doesn't divide both ${a} and ${b}.`);
                  setMsg(null);
                  play.set((p) => ({ ...p, flagged: null, r: { ...p.r, [o.id]: [a / cutter, b / cutter] } }));
                }}
                className="w-full text-left"
              >
                <div className="text-[10px] font-black text-slate-500">{o.r.join(" : ")}</div>
                <div className="font-mono font-black text-2xl">
                  {a} : {b}
                </div>
                <div className="text-[10px] font-bold">{done ? "simplest form" : "can still be cut"}</div>
              </button>
              <Btn className="mt-1 w-full px-1 min-h-[30px] text-[11px]" tone={w.flagged === o.id ? "rose" : "slate"} active={w.flagged === o.id} disabled={play.readOnly || !allDone} onClick={() => play.patch({ flagged: o.id })} ariaLabel={`flag ${o.id}`}>
                🚩 not 3 : 8
              </Btn>
            </div>
          );
        })}
      </div>
      {msg && <p className="text-xs font-bold text-rose-600">{msg}</p>}
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — Operation Duel
   Robot 1 works out a ○ b and robot 2 works out b ○ a. If they agree the operation
   survives; one disagreement knocks it out. Each operation must duel three times.
   ══════════════════════════════════════════════════════════════════════ */

const OPF: Record<string, (a: number, b: number) => number> = { "+": (a, b) => a + b, "−": (a, b) => a - b, "×": (a, b) => a * b, "÷": (a, b) => (b === 0 ? NaN : a / b) };
const OPNAME: Record<string, string> = { "+": "Addition", "−": "Subtraction", "×": "Multiplication", "÷": "Division" };

export function Q27OperationDuelActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const ops = cfg<string[]>(question, "ops", ["+", "−", "×", "÷"]);
  const fmt = (v: number) => (Number.isNaN(v) ? "undefined" : +v.toFixed(3));
  const play = usePlay<{ a: number; b: number; log: { op: string; a: number; b: number; same: boolean }[] }>({
    question,
    initial: { a: 6, b: 3, log: [] },
    derive: (w) => {
      if (ops.some((o) => w.log.filter((l) => l.op === o).length < 3)) return { note: "Every operation must duel three times." };
      const keep = ops.filter((o) => w.log.filter((l) => l.op === o).every((l) => l.same));
      const text = keep.map((o) => OPNAME[o]).join(" and ");
      return { value: `${text || "None"} never lost`, optionId: matchText(question, text) };
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
      title="Operation Duel"
      mission="Choose two whole numbers. For an operation, robot 1 works out a ○ b and robot 2 works out b ○ a. If they agree the operation survives; one disagreement knocks it out. Duel every operation at least three times with different numbers."
      icon={Swords}
      dim="2D"
      submitLabel="Submit the survivors"
      hints={["Use different numbers for a and b — when a = b every operation agrees."]}
      live={<Gauge label="Knocked out" value={ops.filter((o) => w.log.some((l) => l.op === o && !l.same)).map((o) => OPNAME[o]).join(", ") || "none"} tone="rose" />}
    >
      <div className="flex flex-wrap gap-4">
        <Stepper label="a" value={w.a} min={0} max={20} disabled={play.readOnly} onStep={(d) => play.patch({ a: w.a + d })} />
        <Stepper label="b" value={w.b} min={0} max={20} disabled={play.readOnly} onStep={(d) => play.patch({ b: w.b + d })} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ops.map((o) => {
          const x = OPF[o](w.a, w.b);
          const y = OPF[o](w.b, w.a);
          const runs = w.log.filter((l) => l.op === o);
          const out = runs.some((l) => !l.same);
          return (
            <Bay key={o} label={`${OPNAME[o]} · ${runs.length}/3`}>
              <div className="font-mono text-xs font-bold">🤖 {w.a} {o} {w.b} = {fmt(x)}</div>
              <div className="font-mono text-xs font-bold">🤖 {w.b} {o} {w.a} = {fmt(y)}</div>
              <Btn className="mt-1 w-full" disabled={play.readOnly} onClick={() => play.patch({ log: [...w.log, { op: o, a: w.a, b: w.b, same: fmt(x) === fmt(y) && !Number.isNaN(x) }] })} ariaLabel={`duel ${OPNAME[o]}`}>
                Duel
              </Btn>
              <div className={`text-[10px] font-bold mt-1 ${out ? "text-rose-600" : "text-emerald-700"}`}>{out ? "❌ knocked out" : runs.length ? "✓ still in" : ""}</div>
            </Bay>
          );
        })}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — Knitting Factory Counter
   For each month the student packs as many sweaters into the month's crate as its tally
   marks show; the conveyor totals the crates.
   ══════════════════════════════════════════════════════════════════════ */

export const Tally = ({ n }: { n: number }) => (
  <span className="inline-flex gap-1.5 items-end">
    {Array.from({ length: Math.floor(n / 5) }, (_, i) => (
      <svg key={i} viewBox="0 0 26 20" className="h-5">
        {[3, 8, 13, 18].map((x) => <line key={x} x1={x} x2={x} y1={2} y2={18} stroke="#1e293b" strokeWidth={1.8} />)}
        <line x1={0} y1={16} x2={22} y2={4} stroke="#1e293b" strokeWidth={1.8} />
      </svg>
    ))}
    {n % 5 > 0 && (
      <svg viewBox={`0 0 ${(n % 5) * 5 + 2} 20`} className="h-5">
        {Array.from({ length: n % 5 }, (_, i) => <line key={i} x1={3 + i * 5} x2={3 + i * 5} y1={2} y2={18} stroke="#1e293b" strokeWidth={1.8} />)}
      </svg>
    )}
  </span>
);

export function Q28KnittingCounterActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const months = cfg<{ m: string; n: number }[]>(question, "months", []);
  const play = usePlay<{ crate: number[]; run: boolean }>({
    question,
    initial: { crate: months.map(() => 0), run: false },
    derive: (w) => {
      if (!w.run) return { note: "Pack each month's crate, then run the conveyor." };
      const t = w.crate.reduce((a, b) => a + b, 0);
      return { value: `${t} sweaters`, optionId: matchNumber(question, t) };
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
      title="Knitting Factory Counter"
      mission="Read each month's tally marks and pack that many sweaters into its crate. Then run the conveyor to count every sweater."
      icon={Shirt}
      dim="2D"
      submitLabel="Submit the total"
      hints={["A bundle of four lines with a line across it stands for 5."]}
      live={<Gauge label="On the conveyor" value={w.run ? w.crate.reduce((a, b) => a + b, 0) : "—"} tone="violet" />}
    >
      <Board className="grid sm:grid-cols-2 gap-1.5">
        {months.map((m, i) => (
          <div key={m.m} className="flex flex-wrap items-center gap-2 rounded-lg bg-white border p-1.5">
            <span className="w-20 text-xs font-black">{m.m}</span>
            <span className="w-24">
              <Tally n={m.n} />
            </span>
            <Stepper label={m.m} value={w.crate[i]} min={0} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ run: false, crate: p.crate.map((x, j) => (j === i ? x + d : x)) }))} />
          </div>
        ))}
      </Board>
      <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ run: true })}>
        ▶ Run the conveyor
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q29 — Sweater Warehouse Scales
   The student loads a month on each pan (weighed from its tally), then adds sweaters one
   at a time to the lighter pan until the beam is level.
   ══════════════════════════════════════════════════════════════════════ */

export function Q29SweaterScalesActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const months = cfg<{ m: string; n: number }[]>(question, "months", []);
  const play = usePlay<{ left: string | null; right: string | null; added: number }>({
    question,
    initial: { left: null, right: null, added: 0 },
    derive: (w) => {
      const L = months.find((m) => m.m === w.left)?.n;
      const R = months.find((m) => m.m === w.right)?.n;
      if (L === undefined || R === undefined) return { note: "Load a month on each pan." };
      if (L + w.added !== R) return { note: "Add sweaters to the left pan until the beam is level." };
      return { value: `${w.added} more to balance ${w.left} with ${w.right}`, optionId: matchNumber(question, w.added) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const L = (months.find((m) => m.m === w.left)?.n ?? 0) + w.added;
  const R = months.find((m) => m.m === w.right)?.n ?? 0;
  const tilt = Math.max(-12, Math.min(12, (R - L) * 2));
  const level = L === R && !!w.left && !!w.right;

  return (
    <Shell
      play={play}
      question={question}
      title="Sweater Warehouse Scales"
      mission="Load the month with fewer sweaters on the left pan and the other month on the right. Add sweaters one at a time to the left pan until the beam is level. The sweaters you added are the difference."
      icon={Weight}
      dim="2D"
      submitLabel="Submit the difference"
      hints={["Read both months' tallies from the table in the question."]}
      live={
        <>
          <Gauge label="Left pan" value={`${w.left ?? "—"} + ${w.added}`} tone="violet" />
          <Gauge label="Right pan" value={w.right ?? "—"} tone="violet" />
          <Gauge label="Beam" value={level ? "level" : "tipped"} tone={level ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <svg viewBox="0 0 100 44" className="w-full max-h-48">
          <polygon points="50,40 45,44 55,44" fill="#334155" />
          <line x1={50} y1={40} x2={50} y2={14} stroke="#334155" strokeWidth={1.2} />
          <g transform={`rotate(${tilt} 50 14)`}>
            <line x1={15} y1={14} x2={85} y2={14} stroke="#334155" strokeWidth={1.4} />
            <rect x={5} y={16} width={20} height={4} fill="#fcd34d" />
            <text x={15} y={27} fontSize={4} textAnchor="middle" fontWeight={900}>{L} 🧶</text>
            <rect x={75} y={16} width={20} height={4} fill="#fcd34d" />
            <text x={85} y={27} fontSize={4} textAnchor="middle" fontWeight={900}>{R} 🧶</text>
          </g>
        </svg>
      </Board>
      <div className="grid sm:grid-cols-2 gap-2">
        {(["left", "right"] as const).map((side) => (
          <Bay key={side} label={`${side} pan`}>
            <div className="flex flex-wrap gap-1">
              {months.map((m) => (
                <Btn key={m.m} className="px-2 min-h-[32px] text-[11px]" active={w[side] === m.m} tone={w[side] === m.m ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, [side]: m.m, added: 0 }))} ariaLabel={`${side} ${m.m}`}>
                  {m.m.slice(0, 3)}
                </Btn>
              ))}
            </div>
          </Bay>
        ))}
      </div>
      <div className="flex gap-2">
        <Btn tone="emerald" disabled={play.readOnly || !w.left} onClick={() => play.patch({ added: w.added + 1 })}>+1 sweater on the left</Btn>
        <Btn tone="slate" disabled={play.readOnly || !w.added} onClick={() => play.patch({ added: w.added - 1 })}>take one off</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — Remainder Security System
   Four locks each want a given remainder. The student dials a number; each lock shows the
   remainder it gets and how far the number is from its next multiple.
   ══════════════════════════════════════════════════════════════════════ */

export function Q30RemainderLocksActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const locks = cfg<{ d: number; r: number }[]>(question, "locks", []);
  const play = usePlay<{ n: number; tried: boolean }>({
    question,
    initial: { n: 10, tried: false },
    derive: (w) => {
      if (!w.tried) return { note: "Dial a number and try the locks." };
      if (!locks.every((l) => w.n % l.d === l.r)) return { note: `${w.n} does not open every lock.` };
      return { value: `${w.n} opens all four locks`, optionId: matchNumber(question, w.n) };
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
      title="Remainder Security System"
      mission="Dial a number and try the locks. Each lock divides it and shows the remainder, and how many more would make an exact multiple. Find the least number that opens all four."
      icon={LockKeyhole}
      dim="2D"
      submitLabel="Submit the number"
      hints={["Look at the “short of a multiple” readings: for the right number they are all the same.", "If a number is the same amount short of every multiple, it is a common multiple minus that amount."]}
      live={<Gauge label="Locks open" value={`${locks.filter((l) => w.n % l.d === l.r).length}/${locks.length}`} tone="violet" />}
    >
      <Stepper label="Dial" value={w.n} min={1} max={999} steps={[1, 10, 100]} disabled={play.readOnly} onStep={(d) => play.patch({ n: w.n + d, tried: false })} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {locks.map((l) => {
          const open = w.n % l.d === l.r;
          return (
            <motion.div key={l.d} animate={{ rotate: open && w.tried ? [0, -8, 8, 0] : 0 }} className={`rounded-xl border-2 p-2 text-center ${open ? "bg-emerald-50 border-emerald-400" : "bg-white border-slate-300"}`}>
              <div className="text-2xl">{open ? "🔓" : "🔒"}</div>
              <div className="text-xs font-black">÷ {l.d} must leave {l.r}</div>
              <div className="font-mono text-sm">leaves {w.n % l.d}</div>
              <div className="text-[10px] text-slate-500 font-bold">{l.d - (w.n % l.d)} short of a multiple</div>
            </motion.div>
          );
        })}
      </div>
      <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ tried: true })}>
        Try the locks
      </Btn>
    </Shell>
  );
}

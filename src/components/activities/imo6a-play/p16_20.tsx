"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Hammer, Atom, Flame, FlaskConical, ArrowLeftRight } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, Label3D, useTextTexture, approach, Floor } from "./three";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Number Forge (2D)
   Two forges, one set of five digit ingots each. The student fills one mould with the
   smallest number and the other with the greatest, then rolls both castings onto the
   subtraction machine, which works the column subtraction in front of them.
   ══════════════════════════════════════════════════════════════════════ */

interface ForgeWorld {
  racks: Record<string, number[]>;
  rolled: boolean;
}

function Subtractor({ big, small }: { big: number; small: number }) {
  const top = String(big);
  const bot = String(small).padStart(top.length, " ");
  const diff = String(big - small).padStart(top.length, " ");
  return (
    <div className="font-mono text-2xl font-black text-right inline-block bg-slate-900 text-emerald-300 rounded-xl px-4 py-3 tabular-nums">
      <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="tracking-[0.3em]">
        {top}
      </motion.div>
      <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="tracking-[0.3em] border-b-2 border-emerald-300/60">
        −{bot}
      </motion.div>
      <div className="tracking-[0.3em] text-white">
        {diff.split("").map((d, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (diff.length - i) * 0.18 }}>
            {d}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function Q16NumberForge({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const digits = cfg<number[]>(question, "digits", []);
  const rows = cfg<{ id: string; label: string }[]>(question, "rows", []);

  const play = usePlay<ForgeWorld>({
    question,
    initial: { racks: Object.fromEntries(rows.map((r) => [r.id, []])), rolled: false },
    derive: (w) => {
      const full = rows.every((r) => (w.racks[r.id] ?? []).length === digits.length);
      if (!full) return { note: "Fill both moulds, using every digit once in each." };
      if (!w.rolled) return { note: "Roll both castings onto the subtraction machine." };
      const nums = rows.map((r) => Number(w.racks[r.id].join("")));
      const d = Math.abs(nums[0] - nums[1]);
      return { value: String(d), optionId: matchNumber(question, d) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const nums = rows.map((r) => (w.racks[r.id] ?? []).join(""));

  const left = (rackId: string) => {
    const used = [...(w.racks[rackId] ?? [])];
    return digits.filter((d) => {
      const i = used.indexOf(d);
      if (i >= 0) {
        used.splice(i, 1);
        return false;
      }
      return true;
    });
  };

  return (
    <PlayShell
      title="Number Forge"
      mission="Tap digit ingots to pour them, left to right, into each mould. Make the smallest possible 5-digit number in one mould and the greatest in the other, using each digit once. Then roll both onto the subtraction machine."
      icon={Hammer}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the difference"
      live={
        <>
          {rows.map((r, i) => (
            <Gauge key={r.id} label={r.label} value={nums[i] || "—"} tone="violet" />
          ))}
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        {rows.map((r) => {
          const rack = w.racks[r.id] ?? [];
          return (
            <Bay key={r.id} label={`Forge: ${r.label}`} tone="violet">
              <div className="flex gap-1.5 mb-3">
                {digits.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={play.readOnly || rack[i] === undefined}
                    onClick={() => play.set((p) => ({ ...p, rolled: false, racks: { ...p.racks, [r.id]: p.racks[r.id].filter((_, j) => j !== i) } }))}
                    className={`w-12 h-14 rounded-lg border-2 font-mono text-2xl font-black grid place-items-center ${
                      rack[i] !== undefined ? "bg-gradient-to-b from-amber-300 to-orange-500 border-orange-600 text-white shadow-[0_0_14px_#f97316]" : "bg-slate-800 border-slate-700 text-slate-600"
                    }`}
                  >
                    {rack[i] ?? "_"}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                {left(r.id).map((d, i) => (
                  <motion.button
                    key={`${d}-${i}`}
                    layout
                    type="button"
                    disabled={play.readOnly}
                    onClick={() => play.set((p) => ({ ...p, rolled: false, racks: { ...p.racks, [r.id]: [...p.racks[r.id], d] } }))}
                    className="w-11 h-11 rounded-lg bg-gradient-to-b from-slate-200 to-slate-400 border-2 border-slate-500 font-mono text-xl font-black text-slate-900"
                  >
                    {d}
                  </motion.button>
                ))}
              </div>
            </Bay>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Btn tone="emerald" active disabled={play.readOnly || nums.some((n) => n.length !== digits.length)} onClick={() => play.patch({ rolled: true })}>
          Roll castings to the subtraction machine
        </Btn>
        {w.rolled && nums.every((n) => n.length === digits.length) && (
          <Subtractor big={Math.max(...nums.map(Number))} small={Math.min(...nums.map(Number))} />
        )}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — Factor Reactor (2D)
   1728 sits in the reactor as one block. Aiming a prime beam at a block splits it into
   two factor blocks when the prime divides it. The student loads the H.C.F. chamber and
   fires the reactor: what is left outside the chamber multiplies into the L.C.M.
   ══════════════════════════════════════════════════════════════════════ */

interface ReactorWorld {
  blocks: { id: number; v: number; inChamber: boolean }[];
  beam: number | null;
  fired: boolean;
  nextId: number;
}

const BLOCK_HUE = (v: number) => `hsl(${(Math.log2(v) * 47) % 360} 75% 60%)`;

export function Q17FactorReactor({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const product = cfg<number>(question, "product", 1728);
  const hcf = cfg<number>(question, "hcf", 12);
  const primes = [2, 3, 5, 7];

  const play = usePlay<ReactorWorld>({
    question,
    initial: { blocks: [{ id: 1, v: product, inChamber: false }], beam: null, fired: false, nextId: 2 },
    derive: (w) => {
      const chamber = w.blocks.filter((b) => b.inChamber);
      if (!chamber.length) return { note: `Load factor blocks worth the H.C.F. (${hcf}) into the chamber.` };
      if (!w.fired) return { note: "Fire the reactor." };
      const out = w.blocks.filter((b) => !b.inChamber).reduce((t, b) => t * b.v, 1);
      const inside = chamber.reduce((t, b) => t * b.v, 1);
      return {
        value: String(out),
        optionId: matchNumber(question, out),
        note: inside === hcf ? `Chamber holds ${inside}: product ÷ H.C.F.` : `Chamber holds ${inside}, not the H.C.F. ${hcf}.`,
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const chamber = w.blocks.filter((b) => b.inChamber);
  const chamberValue = chamber.reduce((t, b) => t * b.v, 1);
  const [fizz, setFizz] = React.useState<number | null>(null);

  const hit = (id: number) => {
    if (play.readOnly) return;
    const b = w.blocks.find((x) => x.id === id);
    if (!b) return;
    if (w.beam) {
      if (b.v % w.beam !== 0 || b.v === w.beam) {
        setFizz(id);
        setTimeout(() => setFizz(null), 500);
        return;
      }
      play.set((p) => ({
        ...p,
        fired: false,
        nextId: p.nextId + 2,
        blocks: p.blocks.flatMap((x) =>
          x.id === id
            ? [
                { id: p.nextId, v: p.beam!, inChamber: x.inChamber },
                { id: p.nextId + 1, v: x.v / p.beam!, inChamber: x.inChamber },
              ]
            : [x]
        ),
      }));
    } else {
      play.set((p) => ({ ...p, fired: false, blocks: p.blocks.map((x) => (x.id === id ? { ...x, inChamber: !x.inChamber } : x)) }));
    }
  };

  const Block = ({ b }: { b: ReactorWorld["blocks"][number] }) => (
    <motion.button
      layout
      layoutId={`blk-${b.id}`}
      type="button"
      disabled={play.readOnly}
      onClick={() => hit(b.id)}
      animate={fizz === b.id ? { x: [0, -4, 4, 0] } : {}}
      className="rounded-xl border-2 border-white/60 font-mono font-black text-white shadow-lg grid place-items-center"
      style={{
        background: BLOCK_HUE(b.v),
        width: 44 + Math.min(40, Math.log2(b.v) * 5),
        height: 44 + Math.min(40, Math.log2(b.v) * 5),
        fontSize: b.v > 999 ? 14 : 18,
      }}
    >
      {b.v}
    </motion.button>
  );

  return (
    <PlayShell
      title="Factor Reactor"
      mission={`Choose a prime beam, then tap a block to split it into factors (a beam that does not divide the block fizzles). Tap blocks without a beam to move them in or out of the H.C.F. chamber. Load exactly the H.C.F. and fire.`}
      icon={Atom}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the reactor output"
      live={
        <>
          <Gauge label="Product (given)" value={product} />
          <Gauge label="H.C.F. (given)" value={hcf} />
          <Gauge label="Chamber holds" value={chamber.length ? chamberValue : "empty"} tone={chamberValue === hcf ? "emerald" : "amber"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-3 min-h-[200px]">
          <div className="text-[10px] font-black text-indigo-300 mb-2">REACTOR FLOOR</div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {w.blocks.filter((b) => !b.inChamber).map((b) => (
                <Block key={b.id} b={b} />
              ))}
            </AnimatePresence>
          </div>
          {w.fired && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-3 inline-block rounded-lg bg-emerald-400 text-slate-900 font-mono font-black px-3 py-1">
              OUTPUT = {w.blocks.filter((b) => !b.inChamber).map((b) => b.v).join(" × ")} = {w.blocks.filter((b) => !b.inChamber).reduce((t, b) => t * b.v, 1)}
            </motion.div>
          )}
        </div>
        <div className="rounded-2xl border-4 border-dashed border-violet-400 bg-violet-50 p-3">
          <div className="text-[10px] font-black text-violet-700 mb-2">H.C.F. CHAMBER</div>
          <div className="flex flex-wrap gap-2 min-h-[60px]">
            {chamber.map((b) => (
              <Block key={b.id} b={b} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">PRIME BEAM:</span>
        {primes.map((p) => (
          <Btn key={p} tone="rose" active={w.beam === p} disabled={play.readOnly} onClick={() => play.patch({ beam: w.beam === p ? null : p })} className="w-12">
            {p}
          </Btn>
        ))}
        <Btn active={w.beam === null} disabled={play.readOnly} onClick={() => play.patch({ beam: null })}>
          Beam off (move blocks)
        </Btn>
        <Btn tone="emerald" active disabled={play.readOnly || !chamber.length} onClick={() => play.patch({ fired: true })}>
          FIRE REACTOR
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — Roman Numeral Forge (2D)
   Each option is a clay mould holding a Roman expression. Melting it shows the value of
   every symbol as it drops into the pot. The student must then cast the result back into
   Roman symbols by hand. Only a correct casting that reads CCC fits the stamp press.
   ══════════════════════════════════════════════════════════════════════ */

const ROMAN: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

function romanValue(s: string): number {
  let t = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ROMAN[s[i]] ?? 0;
    const n = ROMAN[s[i + 1]] ?? 0;
    t += v < n ? -v : v;
  }
  return t;
}
function toRoman(n: number): string {
  const table: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of table) while (n >= v) {
    out += s;
    n -= v;
  }
  return out;
}

interface Mould {
  optionId: string;
  left: string;
  op: "+" | "-";
  right: string;
}
interface RomanWorld {
  mould: number | null;
  melted: Record<number, boolean>;
  casts: Record<number, string>;
  stamped: number | null;
}

export function Q18RomanForge({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const moulds = cfg<Mould[]>(question, "candidates", []);
  const target = cfg<string>(question, "target", "CCC");
  const resultOf = (m: Mould) => (m.op === "+" ? romanValue(m.left) + romanValue(m.right) : romanValue(m.left) - romanValue(m.right));
  const textOf = (m: Mould) => `${m.left} ${m.op === "-" ? "−" : "+"} ${m.right}`;

  const play = usePlay<RomanWorld>({
    question,
    initial: { mould: null, melted: {}, casts: {}, stamped: null },
    derive: (w) => {
      if (w.stamped === null) return { note: `Cast a mould's result and press it into the ${target} stamp.` };
      const m = moulds[w.stamped];
      return { value: textOf(m), optionId: matchText(question, textOf(m)), note: `cast ${w.casts[w.stamped]} = ${resultOf(m)}` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const m = w.mould !== null ? moulds[w.mould] : null;
  const cast = w.mould !== null ? w.casts[w.mould] ?? "" : "";
  const castValid = m ? cast.length > 0 && cast === toRoman(resultOf(m)) : false;

  return (
    <PlayShell
      title="Roman Numeral Forge"
      mission={`Put a mould in the forge and melt it to see what each numeral is worth. Then cast the result back into Roman symbols yourself. The stamp press only takes a correct casting that reads ${target}.`}
      icon={Flame}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the stamped mould"
      live={
        <>
          <Gauge label="Moulds melted" value={`${Object.keys(w.melted).length} / ${moulds.length}`} tone="violet" />
          <Gauge label="Stamp plate" value={target} tone="amber" />
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {moulds.map((mo, i) => (
          <button
            key={i}
            type="button"
            disabled={play.readOnly}
            onClick={() => play.patch({ mould: i })}
            className={`min-h-[44px] px-3 py-2 rounded-xl border-2 font-mono text-sm font-black ${w.mould === i ? "bg-amber-100 border-amber-500 text-amber-900" : "bg-[#f5e6d3] border-[#d6b48c] text-[#7c4a1e]"}`}
          >
            {textOf(mo)} {w.stamped === i && "🔏"}
          </button>
        ))}
      </div>

      {m && w.mould !== null && (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-b from-orange-900 to-slate-900 p-3 text-white">
            <div className="text-[10px] font-black text-orange-300 mb-2">MELTING POT</div>
            {!w.melted[w.mould] ? (
              <Btn tone="amber" active disabled={play.readOnly} onClick={() => play.patch({ melted: { ...w.melted, [w.mould!]: true } })}>
                🔥 Melt this mould
              </Btn>
            ) : (
              <div className="space-y-2 font-mono">
                {[m.left, m.right].map((num, k) => (
                  <div key={k} className="flex flex-wrap items-center gap-1">
                    {num.split("").map((ch, j) => {
                      const neg = (ROMAN[ch] ?? 0) < (ROMAN[num[j + 1]] ?? 0);
                      return (
                        <motion.span
                          key={j}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: j * 0.12 + k * 0.6 }}
                          className={`px-1.5 py-0.5 rounded text-sm font-black ${neg ? "bg-sky-500" : "bg-orange-500"}`}
                        >
                          {ch}
                          <span className="text-[10px] ml-0.5">{neg ? "−" : "+"}
                            {ROMAN[ch]}
                          </span>
                        </motion.span>
                      );
                    })}
                    <span className="ml-2 text-orange-200 font-black">= {romanValue(num)}</span>
                  </div>
                ))}
                <div className="text-lg font-black text-emerald-300">
                  {romanValue(m.left)} {m.op === "-" ? "−" : "+"} {romanValue(m.right)} = {resultOf(m)}
                </div>
              </div>
            )}
          </div>
          <Bay label="Casting bench" tone="violet">
            <div className="min-h-[52px] rounded-lg border-2 border-dashed border-violet-300 bg-white px-2 py-2 font-mono text-2xl font-black tracking-widest text-violet-900">
              {cast || <span className="text-sm text-slate-400 font-semibold tracking-normal">tap symbols to cast</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Object.keys(ROMAN).map((sym) => (
                <Btn key={sym} disabled={play.readOnly || !w.melted[w.mould!]} onClick={() => play.set((p) => ({ ...p, stamped: null, casts: { ...p.casts, [p.mould!]: (p.casts[p.mould!] ?? "") + sym } }))} className="w-11 font-mono text-base">
                  {sym}
                </Btn>
              ))}
              <Btn disabled={play.readOnly || !cast} onClick={() => play.set((p) => ({ ...p, stamped: null, casts: { ...p.casts, [p.mould!]: (p.casts[p.mould!] ?? "").slice(0, -1) } }))}>
                ⌫
              </Btn>
            </div>
            <div className={`mt-2 text-[11px] font-bold ${cast ? (castValid ? "text-emerald-700" : "text-rose-600") : "text-slate-400"}`}>
              {cast ? (castValid ? `Casting sound: ${cast} = ${resultOf(m)}` : "Casting cracked — it does not read the melted result.") : "—"}
            </div>
            <Btn
              className="mt-2"
              tone="amber"
              active
              disabled={play.readOnly || !castValid || cast !== target}
              onClick={() => play.patch({ stamped: w.mould })}
            >
              🔏 Press into the {target} stamp
            </Btn>
            {castValid && cast !== target && <div className="text-[11px] font-semibold text-slate-500 mt-1">This casting does not fit the {target} plate.</div>}
          </Bay>
        </div>
      )}
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — Property Laboratory (2D)
   72(4 + 5) is a real 72-by-9 rectangle. The student can swap its sides, test closure,
   try to regroup, or drag the slicer across it. Whichever move turns the left-hand side
   into the right-hand side is the property at work.
   ══════════════════════════════════════════════════════════════════════ */

interface PropWorld {
  swapped: boolean;
  sliced: boolean;
  tried: string[];
}

export function Q19PropertyLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const k = cfg<number>(question, "multiplier", 72);
  const parts = cfg<number[]>(question, "parts", [4, 5]);
  const [a, b] = parts;
  const lhs = `${k}(${a} + ${b})`;
  const rhs = `${k} × ${a} + ${k} × ${b}`;

  const expr = (w: PropWorld) =>
    w.sliced ? (w.swapped ? `${a} × ${k} + ${b} × ${k}` : rhs) : w.swapped ? `(${a} + ${b})${k}` : lhs;

  const play = usePlay<PropWorld>({
    question,
    initial: { swapped: false, sliced: false, tried: [] },
    derive: (w) => {
      if (!w.sliced) return { note: "Find the move that turns the left-hand side into the right-hand side." };
      const name = "Distributive property";
      return {
        value: name,
        optionId: matchText(question, name),
        note: w.swapped ? "The slicer did the work; swapping the factors only changed their order." : "Slicing the rectangle turned the product of a sum into a sum of products.",
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const lamps = [
    { id: "Commutative", on: w.tried.includes("swap"), what: "swaps the order of two factors" },
    { id: "Closure", on: w.tried.includes("closure"), what: `${k} × ${a + b} = ${k * (a + b)} is still a whole number` },
    { id: "Associative", on: w.tried.includes("regroup"), what: "needs three numbers under one operation — nothing to regroup here" },
    { id: "Distributive", on: w.sliced, what: "splits a product of a sum into a sum of products" },
  ];
  const W = w.swapped ? 90 : 180;
  const H = w.swapped ? 180 : 90;
  const cut = (a / (a + b)) * (w.swapped ? H : W);

  return (
    <PlayShell
      title="Property Laboratory"
      mission="Experiment on the area model of the left-hand side: swap its sides, test closure, try regrouping, or slice it between its two parts. Keep going until the expression on screen matches the right-hand side."
      icon={FlaskConical}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the property"
      live={
        <>
          <Gauge label="On screen" value={expr(w)} tone="violet" />
          <Gauge label="Target" value={rhs} tone={expr(w) === rhs ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-3">
        <Bay label="Area model">
          <svg viewBox="0 0 220 210" className="w-full max-h-72">
            <motion.g animate={{ x: 20, y: 10 }}>
              <motion.rect width={W} height={H} rx={4} fill="#ddd6fe" stroke="#6d28d9" strokeWidth={2} animate={{ width: W, height: H }} />
              {w.sliced && (
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x1={w.swapped ? 0 : cut}
                  y1={w.swapped ? cut : 0}
                  x2={w.swapped ? W : cut}
                  y2={w.swapped ? cut : H}
                  stroke="#be123c"
                  strokeWidth={3}
                  strokeDasharray="6 3"
                />
              )}
              <text x={W / 2} y={-2} textAnchor="middle" fontSize={11} fontWeight={800} fill="#4c1d95">
                {w.swapped ? k : w.sliced ? `${a}  |  ${b}` : `${a} + ${b}`}
              </text>
              <text x={-4} y={H / 2} textAnchor="end" fontSize={11} fontWeight={800} fill="#4c1d95">
                {w.swapped ? (w.sliced ? `${a}|${b}` : `${a}+${b}`) : k}
              </text>
              <text x={W / 2} y={H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={900} fill="#1e1b4b">
                {k * (a + b)} sq units
              </text>
            </motion.g>
          </svg>
          <div className="font-mono text-lg font-black text-center text-violet-900">
            {expr(w)} {expr(w) === rhs && <span className="text-emerald-600">= right-hand side ✓</span>}
          </div>
        </Bay>
        <div className="space-y-3">
          <Bay label="Experiments" tone="violet">
            <div className="grid grid-cols-2 gap-1.5">
              <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, swapped: !p.swapped, tried: [...new Set([...p.tried, "swap"])] }))}>
                ⇄ Swap the sides
              </Btn>
              <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, tried: [...new Set([...p.tried, "closure"])] }))}>
                ∈ Test closure
              </Btn>
              <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, tried: [...new Set([...p.tried, "regroup"])] }))}>
                ( ) Regroup
              </Btn>
              <Btn tone="rose" active={w.sliced} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, sliced: !p.sliced }))}>
                ✂ Slice between {a} and {b}
              </Btn>
            </div>
          </Bay>
          <Bay label="Property lamps">
            <ul className="space-y-1">
              {lamps.map((l) => (
                <li key={l.id} className={`text-[11px] font-bold rounded-lg px-2 py-1 border ${l.on ? "bg-amber-50 border-amber-300 text-amber-900" : "bg-white border-slate-200 text-slate-400"}`}>
                  {l.on ? "💡" : "○"} {l.id}: {l.on ? l.what : "not tried"}
                </li>
              ))}
            </ul>
          </Bay>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — Digit Swap Elevator (3D)
   The four digits of 7939 are cubes on a place-value shelf. The student lifts two cubes
   and swaps them; a balance weighs the new number against the original.
   ══════════════════════════════════════════════════════════════════════ */

const PLACES = ["thousands", "hundreds", "tens", "ones"] as const;

function DigitCube({ digit, slot, lifted, selected, onPick }: { digit: number; slot: number; lifted: boolean; selected: boolean; onPick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useTextTexture(String(digit), { bg: selected ? "#7c3aed" : "#ffffff", fg: selected ? "#ffffff" : "#1e1b4b", border: "#7c3aed", scale: 0.7 });
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.x = approach(ref.current.position.x, -2.25 + slot * 1.5, 6, dt);
    ref.current.position.y = approach(ref.current.position.y, (lifted ? 1.1 : 0) + 0.55, 6, dt);
  });
  return (
    <group ref={ref} position={[-2.25 + slot * 1.5, 0.55, 1.6]} onClick={(e) => (e.stopPropagation(), onPick())}>
      <RoundedBox args={[1, 1, 1]} radius={0.08} castShadow>
        <meshStandardMaterial color={selected ? "#a78bfa" : "#ede9fe"} />
      </RoundedBox>
      <mesh position={[0, 0, 0.51]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Balance({ tilt, left, right }: { tilt: number; left: string; right: string }) {
  const beam = useRef<THREE.Group>(null);
  const lp = useRef<THREE.Group>(null);
  const rp = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!beam.current) return;
    beam.current.rotation.z = approach(beam.current.rotation.z, tilt * 0.22, 3, dt);
    const r = beam.current.rotation.z;
    if (lp.current) lp.current.position.y = 1.9 - Math.sin(r) * 1.8;
    if (rp.current) rp.current.position.y = 1.9 + Math.sin(r) * 1.8;
  });
  return (
    <group position={[0, 0, -1.2]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 2.4, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
      </mesh>
      <group ref={beam} position={[0, 2.45, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 0.1, 0.14]} />
          <meshStandardMaterial color="#6366f1" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
      {[
        { ref: lp, x: -1.8, text: left },
        { ref: rp, x: 1.8, text: right },
      ].map((pan) => (
        <group key={pan.x} ref={pan.ref} position={[pan.x, 1.9, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.7, 0.55, 0.12, 32]} />
            <meshStandardMaterial color="#c7d2fe" metalness={0.3} roughness={0.4} />
          </mesh>
          <Label3D text={pan.text} position={[0, 0.45, 0]} size={[1.3, 0.5]} billboard style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.6 }} />
        </group>
      ))}
    </group>
  );
}

interface SwapWorld {
  order: number[];
  picked: number[];
}

export function Q20DigitSwapElevator({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const original = cfg<number>(question, "number", 7939);
  const labels = cfg<{ gt: string; lt: string; eq: string }>(question, "comparisonLabels", { gt: "", lt: "", eq: "" });
  const digits = String(original).split("").map(Number);

  const play = usePlay<SwapWorld>({
    question,
    initial: { order: digits.map((_, i) => i), picked: [] },
    derive: (w) => {
      const moved = w.order.some((o, i) => o !== i);
      if (!moved) return { note: "Lift two cubes and swap them." };
      const nw = Number(w.order.map((i) => digits[i]).join(""));
      const label = nw > original ? labels.gt : nw < original ? labels.lt : labels.eq;
      return { value: label, optionId: matchText(question, label), note: `New number ${nw} vs original ${original}` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const newNum = Number(w.order.map((i) => digits[i]).join(""));
  const tilt = Math.sign(original - newNum); // positive: original (left pan) heavier

  const pick = (slot: number) => {
    if (play.readOnly) return;
    play.set((p) => {
      if (p.picked.includes(slot)) return { ...p, picked: p.picked.filter((s) => s !== slot) };
      const picked = [...p.picked, slot];
      if (picked.length < 2) return { ...p, picked };
      const order = [...p.order];
      [order[picked[0]], order[picked[1]]] = [order[picked[1]], order[picked[0]]];
      return { order, picked: [] };
    });
  };

  return (
    <PlayShell
      title="Digit Swap Elevator"
      mission="Tap two digit cubes on the place-value shelf to lift them, and they trade places. Swap the ones the question names. The balance then weighs the new number against the original."
      icon={ArrowLeftRight}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the comparison"
      live={
        <>
          <Gauge label="Original" value={original} />
          <Gauge label="New number" value={newNum} tone="violet" />
        </>
      }
    >
      <Stage3D height={340} camera={{ position: [0, 3.2, 7.4], fov: 42 }} orbitTarget={[0, 1.2, 0]} readOnly={play.readOnly}>
        <Floor y={0} />
        <mesh position={[0, 0.03, 1.6]} receiveShadow>
          <boxGeometry args={[6.4, 0.06, 1.4]} />
          <meshStandardMaterial color="#c4b5fd" />
        </mesh>
        {PLACES.map((pl, i) => (
          <Label3D key={pl} text={pl.toUpperCase()} position={[-2.25 + i * 1.5, 0.08, 2.45]} rotation={[-Math.PI / 2, 0, 0]} size={[1.3, 0.3]} style={{ bg: null, fg: "#4c1d95", scale: 0.6 }} />
        ))}
        {w.order.map((orig, slot) => (
          <DigitCube key={orig} digit={digits[orig]} slot={slot} lifted={w.picked.includes(slot)} selected={w.picked.includes(slot)} onPick={() => pick(slot)} />
        ))}
        <Balance tilt={tilt} left={`ORIGINAL ${original}`} right={`NEW ${newNum}`} />
      </Stage3D>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">OR TAP A PLACE:</span>
        {PLACES.map((pl, i) => (
          <Btn key={pl} active={w.picked.includes(i)} disabled={play.readOnly} onClick={() => pick(i)}>
            {pl}
          </Btn>
        ))}
        <Btn disabled={play.readOnly} onClick={() => play.set({ order: digits.map((_, i) => i), picked: [] })}>
          Restore {original}
        </Btn>
      </div>
    </PlayShell>
  );
}

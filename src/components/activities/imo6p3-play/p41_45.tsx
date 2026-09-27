"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hourglass, Coins, Package, Grid3x3, Scale } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, toMixedString } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, rupees } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q41–Q45. */

const r2 = (v: number) => Math.round(v * 100) / 100;

/* ══════════════════════════════════════════════════════════════════════
   Q41 — Time Machine
   Vinay's marker starts on the timeline years ago, at 3p. Each jump moves one year and adds
   one to his age; the student stops where the question asks.
   ══════════════════════════════════════════════════════════════════════ */

export function Q41TimeMachineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const ago = cfg<number>(question, "ago", 8);
  const ahead = cfg<number>(question, "ahead", 4);
  const play = usePlay<{ y: number; stopped: boolean }>({
    question,
    initial: { y: 0, stopped: false },
    derive: (w) => {
      if (!w.stopped) return { note: "Travel through time and stop at the year asked." };
      const text = w.y === 0 ? "3p" : `3p + ${w.y}`;
      return { value: `Vinay is ${text}`, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const span = ago + ahead + 4;
  const label = (k: number) => (k < ago ? `${ago - k} yr ago` : k === ago ? "now" : `in ${k - ago} yr`);

  return (
    <Shell
      play={play}
      question={question}
      title="Time Machine"
      mission={`The marker starts ${ago} years ago, when Vinay was 3p. Each jump moves one year forward and makes him one year older. Stop at the moment the question asks about.`}
      icon={Hourglass}
      dim="2D"
      submitLabel="Submit his age"
      hints={["First travel to “now”, then keep going into the future."]}
      live={
        <>
          <Gauge label="Time" value={label(w.y)} tone="violet" />
          <Gauge label="Vinay's age" value={w.y ? `3p + ${w.y}` : "3p"} tone="amber" />
        </>
      }
    >
      <div className="relative h-16 rounded-xl bg-indigo-50 border-2 border-indigo-200 px-2">
        {Array.from({ length: span + 1 }, (_, k) => (
          <span key={k} className={`absolute top-8 text-[8px] font-bold ${k === ago ? "text-amber-600" : "text-indigo-400"}`} style={{ left: `${(k / span) * 95 + 1}%` }}>
            |{k === ago ? " now" : ""}
          </span>
        ))}
        <motion.span animate={{ left: `${(w.y / span) * 95}%` }} className="absolute top-1 text-2xl">
          🧑
        </motion.span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn tone="slate" disabled={play.readOnly || w.y <= 0} onClick={() => play.patch({ y: w.y - 1, stopped: false })}>◀ 1 year back</Btn>
        <Btn disabled={play.readOnly || w.y >= span} onClick={() => play.patch({ y: w.y + 1, stopped: false })}>1 year forward ▶</Btn>
        <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ stopped: true })}>⏹ Stop here</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — Money Splitter
   The student hands out ratio blocks to Vishal and Anita, then pours the money over all the
   blocks; every block gets the same amount.
   ══════════════════════════════════════════════════════════════════════ */

export function Q42MoneySplitterActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = cfg<number>(question, "total", 0);
  const play = usePlay<{ v: number; a: number; poured: boolean }>({
    question,
    initial: { v: 0, a: 0, poured: false },
    derive: (w) => {
      if (!w.poured || !(w.v + w.a)) return { note: "Hand out the ratio blocks and pour the money." };
      const each = total / (w.v + w.a);
      return { value: `Anita gets ${w.a} × ${rupees(r2(each))} = ${rupees(r2(each * w.a))}`, optionId: matchNumber(question, r2(each * w.a), 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const each = w.v + w.a ? total / (w.v + w.a) : 0;

  return (
    <Shell
      play={play}
      question={question}
      title="Money Splitter"
      mission={`Give each person the number of equal blocks their part of the ratio says. Then pour the ${rupees(total)} over all the blocks — every block gets the same amount.`}
      icon={Coins}
      dim="2D"
      submitLabel="Submit Anita's share"
      hints={["A ratio of 4 : 5 means 4 blocks and 5 blocks — 9 blocks in all."]}
      live={<Gauge label="Per block" value={w.poured && each ? rupees(r2(each)) : "—"} tone="violet" />}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {(["v", "a"] as const).map((k) => (
          <Bay key={k} label={k === "v" ? "Vishal" : "Anita"} tone={k === "a" ? "violet" : "slate"}>
            <div className="flex flex-wrap gap-1 min-h-[40px]">
              {Array.from({ length: w[k] }, (_, i) => (
                <span key={i} className="w-12 h-9 rounded bg-amber-200 border border-amber-400 text-[9px] font-black grid place-items-center">
                  {w.poured ? rupees(r2(each)) : "block"}
                </span>
              ))}
            </div>
            <Stepper label={`${k === "v" ? "Vishal" : "Anita"} blocks`} value={w[k]} min={0} max={10} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ ...p, poured: false, [k]: p[k] + d }))} />
          </Bay>
        ))}
      </div>
      <Btn tone="emerald" disabled={play.readOnly || !(w.v + w.a)} onClick={() => play.patch({ poured: true })}>
        💰 Pour {rupees(total)}
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — Flour Loading Dock
   Each packet adds its whole kilograms to the dial and its fraction to the eighths pan.
   When the pan holds eight eighths, the student carries them over as one kilogram.
   ══════════════════════════════════════════════════════════════════════ */

export function Q43FlourDockActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const sacks = cfg<{ whole: number; num: number; den: number }[]>(question, "sacks", []);
  const play = usePlay<{ loaded: number[]; carried: number }>({
    question,
    initial: { loaded: [], carried: 0 },
    derive: (w) => {
      if (w.loaded.length < sacks.length) return { note: "Load every packet." };
      const eighths = w.loaded.reduce((s, i) => s + (sacks[i].num * 8) / sacks[i].den, 0) - 8 * w.carried;
      if (eighths >= 8) return { note: "The pan holds 8 eighths or more — carry them over." };
      const whole = w.loaded.reduce((s, i) => s + sacks[i].whole, 0) + w.carried;
      return { value: `${toMixedString(whole * 8 + eighths, 8)} kg`, optionId: matchNumber(question, whole + eighths / 8, 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const whole = w.loaded.reduce((s, i) => s + sacks[i].whole, 0) + w.carried;
  const eighths = w.loaded.reduce((s, i) => s + (sacks[i].num * 8) / sacks[i].den, 0) - 8 * w.carried;

  return (
    <Shell
      play={play}
      question={question}
      title="Flour Loading Dock"
      mission="Load each packet onto the scale: its whole kilograms go on the dial and its fraction goes into the eighths pan. Whenever the pan holds eight eighths, carry them over to the dial as one kilogram."
      icon={Package}
      dim="2D"
      submitLabel="Submit the total weight"
      hints={["1/2 kg is 4 eighths and 3/4 kg is 6 eighths."]}
      live={
        <>
          <Gauge label="Dial" value={`${whole} kg`} tone="violet" />
          <Gauge label="Eighths pan" value={`${eighths}/8 kg`} tone={eighths >= 8 ? "rose" : "amber"} />
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {sacks.map((s, i) => (
          <Btn key={i} tone={w.loaded.includes(i) ? "emerald" : "slate"} disabled={play.readOnly || w.loaded.includes(i)} onClick={() => play.patch({ loaded: [...w.loaded, i] })} ariaLabel={`sack ${i + 1}`}>
            🌾 {s.whole} {s.num}/{s.den} kg
          </Btn>
        ))}
      </div>
      <Board className="flex flex-wrap items-center gap-2">
        <div className="flex gap-0.5 flex-wrap w-64">
          {Array.from({ length: eighths }, (_, i) => <span key={i} className={`w-6 h-6 rounded ${i < 8 ? "bg-amber-300" : "bg-rose-300"}`} />)}
        </div>
        <Btn tone="amber" disabled={play.readOnly || eighths < 8} onClick={() => play.patch({ carried: w.carried + 1 })}>
          Carry 8/8 → 1 kg
        </Btn>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — Perfect Tile Workshop
   Both courtyard sides are broken into prime blocks. The student drops blocks into the tile
   maker; a block goes in only while both sides can spare it. The tile is laid; its side is
   4n cm.
   ══════════════════════════════════════════════════════════════════════ */

const primes = (n: number) => {
  const out: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) (out.push(p), (m /= p));
  if (m > 1) out.push(m);
  return out;
};

export function Q44TileWorkshopActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const L = cfg<number>(question, "lengthCm", 1);
  const Wd = cfg<number>(question, "widthCm", 1);
  const pl = primes(L);
  const pw = primes(Wd);
  const count = (arr: number[], p: number) => arr.filter((x) => x === p).length;
  const play = usePlay<{ hopper: number[]; tried: boolean }>({
    question,
    initial: { hopper: [], tried: false },
    derive: (w) => {
      if (!w.tried) return { note: "Build a tile and lay it." };
      const side = w.hopper.reduce((a, b) => a * b, 1);
      const spare = [...new Set(pl)].some((p) => count(w.hopper, p) < Math.min(count(pl, p), count(pw, p)));
      if (spare) return { note: `A ${side} cm tile fits, but a larger one would too.` };
      if (side % 4) return { note: `${side} cm is not 4 × a whole number.` };
      return { value: `Largest tile ${side} cm = ${side / 4} × 4 cm`, optionId: matchNumber(question, side / 4) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const side = w.hopper.reduce((a, b) => a * b, 1);
  const can = (p: number) => count(w.hopper, p) < Math.min(count(pl, p), count(pw, p));

  return (
    <Shell
      play={play}
      question={question}
      title="Perfect Tile Workshop"
      mission={`The courtyard is ${L} cm × ${Wd} cm. Each side is broken into prime blocks. Drop blocks into the tile maker — a block goes in only if both sides can spare it. Make the biggest tile that still fits both sides exactly, and lay it.`}
      icon={Grid3x3}
      dim="2D"
      submitLabel="Submit n"
      hints={["1.12 m = 112 cm and 0.84 m = 84 cm.", "The biggest tile uses every block the two sides share."]}
      live={
        <>
          <Gauge label="Tile side" value={`${side} cm`} tone="violet" />
          <Gauge label="Fits" value={`${L / side} × ${Wd / side} tiles`} tone="emerald" />
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {[{ n: L, ps: pl }, { n: Wd, ps: pw }].map((s) => (
          <Bay key={s.n} label={`${s.n} cm = ${s.ps.join(" × ")}`}>
            <div className="flex flex-wrap gap-1">
              {s.ps.map((p, i) => <span key={i} className="w-8 h-8 rounded bg-sky-100 border border-sky-300 grid place-items-center font-black">{p}</span>)}
            </div>
          </Bay>
        ))}
      </div>
      <Bay label={`Tile maker: ${w.hopper.join(" × ") || "empty"} = ${side} cm`} tone="violet">
        <div className="flex flex-wrap gap-1.5">
          {[...new Set([...pl, ...pw])].map((p) => (
            <Btn key={p} disabled={play.readOnly || !can(p)} onClick={() => play.set((s) => ({ hopper: [...s.hopper, p], tried: false }))} ariaLabel={`block ${p}`}>
              + {p}
            </Btn>
          ))}
          <Btn tone="slate" disabled={play.readOnly || !w.hopper.length} onClick={() => play.set({ hopper: [], tried: false })}>Empty</Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ tried: true })}>Lay the {side} cm tile</Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — Human Weight Balance
   Arjun's block is locked at twice Surbhi's and Sejal's at 5 kg less than Arjun's. The
   student slides Surbhi's weight until the group scale reads the total.
   ══════════════════════════════════════════════════════════════════════ */

export function Q45WeightBalanceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = cfg<number>(question, "total", 0);
  const play = usePlay<{ s: number }>({
    question,
    initial: { s: 10 },
    derive: (w) => {
      const a = r2(2 * w.s);
      const j = r2(a - 5);
      if (Math.abs(w.s + a + j - total) > 1e-9) return { note: `Together they weigh ${r2(w.s + a + j)} kg, not ${total} kg.` };
      return { value: `Sejal ${j} + Arjun ${a} = ${r2(a + j)} kg`, optionId: matchNumber(question, r2(a + j), 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const a = r2(2 * w.s);
  const j = r2(a - 5);
  const t = r2(w.s + a + j);

  return (
    <Shell
      play={play}
      question={question}
      title="Human Weight Balance"
      mission={`Slide Surbhi's weight. Arjun's block is locked at twice hers and Sejal's at 5 kg less than Arjun's. Balance the group scale at ${total} kg, then read Sejal and Arjun together.`}
      icon={Scale}
      dim="2D"
      submitLabel="Submit Sejal + Arjun"
      hints={["Every 1 kg added to Surbhi adds 5 kg to the group.", "Surbhi's weight may not be a whole number of kilograms."]}
      live={<Gauge label="Group scale" value={`${t} kg`} tone={Math.abs(t - total) < 1e-9 ? "emerald" : "amber"} />}
    >
      <Stepper label="Surbhi" value={w.s} min={5} max={30} steps={[0.1, 1]} unit=" kg" disabled={play.readOnly} onStep={(d) => play.patch({ s: r2(w.s + d) })} />
      <Board className="flex items-end gap-3 h-44">
        {[{ n: "Surbhi", v: w.s, c: "bg-pink-300" }, { n: "Arjun", v: a, c: "bg-sky-300" }, { n: "Sejal", v: j, c: "bg-violet-300" }].map((b) => (
          <div key={b.n} className="flex-1 text-center">
            <motion.div animate={{ height: Math.max(8, b.v * 4) }} className={`${b.c} rounded-t-lg mx-auto w-16`} />
            <div className="text-xs font-black">{b.n}</div>
            <div className="font-mono text-sm">{b.v} kg</div>
          </div>
        ))}
      </Board>
    </Shell>
  );
}

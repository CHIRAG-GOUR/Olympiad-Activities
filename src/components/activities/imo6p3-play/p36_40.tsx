"use client";

import React from "react";
import { motion } from "framer-motion";
import { Footprints, Receipt, Timer, ShoppingBag, Building2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, rupees } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q36–Q40. */

const r2 = (v: number) => Math.round(v * 100) / 100;

/* ══════════════════════════════════════════════════════════════════════
   Q36 — Marching Synchronizer
   Four friends march towards a finish line the student places; each shows whether the line
   falls on one of their footsteps. The least distance where all four land exactly wins.
   ══════════════════════════════════════════════════════════════════════ */

export function Q36MarchingSyncActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const steps = cfg<number[]>(question, "steps", []);
  const play = usePlay<{ d: number; stop: boolean }>({
    question,
    initial: { d: 100, stop: false },
    derive: (w) => {
      if (!w.stop) return { note: "Place the finish line and stop the parade." };
      if (!steps.every((s) => w.d % s === 0)) return { note: `Not every friend lands exactly on ${w.d} cm.` };
      return { value: `${w.d} cm`, optionId: matchNumber(question, w.d) };
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
      title="Marching Synchronizer"
      mission="Move the finish line. Each friend shows whether it lands exactly on one of their footsteps. Find the shortest distance where all four finish in complete steps, and stop the parade there."
      icon={Footprints}
      dim="2D"
      submitLabel="Submit the distance"
      hints={["The distance must be a multiple of every step length.", "Start from the longest step, 72 cm, and try its multiples."]}
      live={<Gauge label="Landing exactly" value={`${steps.filter((s) => w.d % s === 0).length}/${steps.length}`} tone="violet" />}
    >
      <Stepper label="Finish line" value={w.d} min={1} max={1000} steps={[1, 10, 50]} unit=" cm" disabled={play.readOnly} onStep={(d) => play.patch({ d: w.d + d, stop: false })} />
      <Board className="space-y-1.5">
        {steps.map((s) => {
          const ok = w.d % s === 0;
          const n = Math.floor(w.d / s);
          return (
            <div key={s} className="flex items-center gap-2">
              <span className="w-16 text-xs font-black">{s} cm step</span>
              <div className="relative flex-1 h-7 rounded bg-white border overflow-hidden">
                {Array.from({ length: Math.min(n, 60) }, (_, i) => (
                  <span key={i} className="absolute top-1 text-xs" style={{ left: `${((i + 1) * s * 100) / Math.max(w.d, 1) - 2}%` }}>
                    👣
                  </span>
                ))}
                <span className="absolute right-0 top-0 h-full w-1 bg-rose-500" />
              </div>
              <span className={`w-28 text-xs font-black ${ok ? "text-emerald-700" : "text-rose-600"}`}>{ok ? `${n} steps exactly` : `${n} steps + ${w.d % s} cm`}</span>
            </div>
          );
        })}
      </Board>
      <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ stop: true })}>
        🏁 Stop the parade here
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — Concert Budget Ledger
   Each money card must be lined up by place value; a card one column off counts ten times
   too much or too little. The student aligns and deposits every card and the ledger adds.
   ══════════════════════════════════════════════════════════════════════ */

export function Q37BudgetLedgerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const items = cfg<{ label: string; v: number }[]>(question, "items", []);
  const width = Math.max(...items.map((i) => String(i.v).length), 1);
  const play = usePlay<{ shift: number[]; dep: number[] }>({
    question,
    initial: { shift: items.map((i) => (width - String(i.v).length) + 1), dep: [] },
    derive: (w) => {
      if (w.dep.length < items.length) return { note: `Deposit every card (${w.dep.length}/${items.length}).` };
      const t = items.reduce((s, it, i) => s + it.v * 10 ** w.shift[i], 0);
      return { value: rupees(t), optionId: matchNumber(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const total = w.dep.reduce((s, i) => s + items[i].v * 10 ** w.shift[i], 0);

  return (
    <Shell
      play={play}
      question={question}
      title="Concert Budget Ledger"
      mission="Slide each money card so its digits sit under the right columns — ones under ones. A card one column too far left counts ten times as much. Deposit every card; the ledger adds the columns."
      icon={Receipt}
      dim="2D"
      submitLabel="Submit the total"
      hints={["Line up the last digits of all four amounts.", "The shortest amount, 56,480, has only five digits."]}
      live={<Gauge label="Ledger total" value={rupees(total)} tone="violet" />}
    >
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-2 space-y-1.5 font-mono overflow-x-auto">
        {items.map((it, i) => (
          <div key={it.label} className="flex items-center gap-1">
            <span className="w-28 text-xs font-sans font-black">{it.label}</span>
            <Btn className="px-2 min-h-[32px]" tone="slate" disabled={play.readOnly} onClick={() => play.set((p) => ({ dep: p.dep.filter((x) => x !== i), shift: p.shift.map((s, j) => (j === i ? s + 1 : s)) }))} ariaLabel={`${it.label} left`}>◀</Btn>
            <span className="text-lg tracking-[0.35em] w-56 text-right">{String(it.v * 10 ** w.shift[i]).padStart(width + 3, "·")}</span>
            <Btn className="px-2 min-h-[32px]" tone="slate" disabled={play.readOnly || w.shift[i] <= 0} onClick={() => play.set((p) => ({ dep: p.dep.filter((x) => x !== i), shift: p.shift.map((s, j) => (j === i ? s - 1 : s)) }))} ariaLabel={`${it.label} right`}>▶</Btn>
            <Btn className="px-2 min-h-[32px]" tone="emerald" disabled={play.readOnly || w.dep.includes(i)} onClick={() => play.patch({ dep: [...w.dep, i] })} ariaLabel={`deposit ${it.label}`}>Deposit</Btn>
          </div>
        ))}
        <div className="border-t-2 border-amber-400 pt-1 text-right text-xl font-black pr-24">{total.toLocaleString("en-IN")}</div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — Field Race Simulator
   Each runner's field is drawn to scale. The student sets the laps and starts the race; the
   odometers count the distance round each field.
   ══════════════════════════════════════════════════════════════════════ */

export function Q38FieldRaceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const runners = cfg<{ who: string; field: [number, number] }[]>(question, "runners", []);
  const per = (r: (typeof runners)[number]) => 2 * (r.field[0] + r.field[1]);
  const play = usePlay<{ laps: number[]; ran: boolean }>({
    question,
    initial: { laps: runners.map(() => 1), ran: false },
    derive: (w) => {
      if (!w.ran) return { note: "Set the laps and run the race." };
      const d = runners.map((r, i) => per(r) * w.laps[i]);
      const win = d[0] >= d[1] ? 0 : 1;
      const text = `${runners[win].who}, ${Math.abs(d[0] - d[1])} m`;
      return { value: text, optionId: matchText(question, text) };
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
      title="Field Race Simulator"
      mission="Set how many times each runner goes round their field, then start the race. The odometers add the distance round each field for every lap."
      icon={Timer}
      dim="2D"
      submitLabel="Submit the result"
      hints={["One lap is the perimeter of the field.", "Thrice means 3 laps; twice means 2 laps."]}
      live={<>{runners.map((r, i) => <Gauge key={r.who} label={r.who} value={w.ran ? `${per(r) * w.laps[i]} m` : "—"} tone="violet" />)}</>}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {runners.map((r, i) => (
          <Bay key={r.who} label={`${r.who} · field ${r.field[0]} m × ${r.field[1]} m`}>
            <svg viewBox="0 0 60 40" className="w-full h-28">
              <rect x={30 - r.field[0]} y={20 - r.field[1] / 1.4} width={r.field[0] * 2} height={(r.field[1] * 2) / 1.4} fill="#bbf7d0" stroke="#15803d" strokeWidth={0.8} />
              {w.ran && (
                <motion.circle
                  r={1.6}
                  fill="#dc2626"
                  initial={{ cx: 30 - r.field[0], cy: 20 - r.field[1] / 1.4 }}
                  animate={{ cx: [30 - r.field[0], 30 + r.field[0], 30 + r.field[0], 30 - r.field[0], 30 - r.field[0]], cy: [20 - r.field[1] / 1.4, 20 - r.field[1] / 1.4, 20 + r.field[1] / 1.4, 20 + r.field[1] / 1.4, 20 - r.field[1] / 1.4] }}
                  transition={{ duration: 1, repeat: w.laps[i] - 1 }}
                />
              )}
            </svg>
            <Stepper label={`${r.who} laps`} value={w.laps[i]} min={1} max={6} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ ran: false, laps: p.laps.map((x, j) => (j === i ? x + d : x)) }))} />
          </Bay>
        ))}
      </div>
      <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ ran: true })}>
        🏃 Start the race
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — Fashion Store Checkout
   The shirt has no price tag. The student balances two shirts against one saree by setting
   the shirt price, fills the basket and checks out.
   ══════════════════════════════════════════════════════════════════════ */

export function Q39FashionCheckoutActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const saree = cfg<number>(question, "saree", 0);
  const play = usePlay<{ shirt: number; qs: number; qh: number; paid: boolean }>({
    question,
    initial: { shirt: 400, qs: 0, qh: 0, paid: false },
    derive: (w) => {
      if (!w.paid) return { note: "Price the shirt, fill the basket and check out." };
      const t = r2(w.qs * saree + w.qh * w.shirt);
      return { value: rupees(t), optionId: matchNumber(question, t, 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const balanced = Math.abs(2 * w.shirt - saree) < 1e-9;
  const set = (k: "shirt" | "qs" | "qh", d: number) => play.set((p) => ({ ...p, paid: false, [k]: Math.max(0, r2(p[k] + d)) }));

  return (
    <Shell
      play={play}
      question={question}
      title="Fashion Store Checkout"
      mission={`A saree costs ${rupees(saree)} and is worth two shirts. Set the shirt price until two shirts balance one saree, put the sarees and shirts from the question in the basket, and check out.`}
      icon={ShoppingBag}
      dim="2D"
      submitLabel="Submit the bill"
      hints={["A shirt costs half as much as a saree."]}
      live={
        <>
          <Gauge label="Shirt price" value={rupees(w.shirt)} tone={balanced ? "emerald" : "amber"} />
          <Gauge label="Basket" value={`${w.qs} sarees, ${w.qh} shirts`} tone="violet" />
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-2">
        <Bay label={`Price scale — ${balanced ? "balanced" : "not balanced"}`}>
          <div className="text-center text-3xl">{balanced ? "⚖️" : 2 * w.shirt > saree ? "↙️" : "↘️"}</div>
          <div className="text-xs font-bold text-center">1 saree {rupees(saree)} ⟷ 2 shirts {rupees(2 * w.shirt)}</div>
          <Stepper label="Shirt ₹" value={w.shirt} min={0} steps={[0.25, 1, 100]} disabled={play.readOnly} onStep={(d) => set("shirt", d)} />
        </Bay>
        <Bay label="Basket" tone="violet">
          <Stepper label="Sarees" value={w.qs} min={0} disabled={play.readOnly} onStep={(d) => set("qs", d)} />
          <Stepper label="Shirts" value={w.qh} min={0} disabled={play.readOnly || !balanced} onStep={(d) => set("qh", d)} />
          {!balanced && <p className="text-[11px] font-bold text-slate-500">Price the shirt first.</p>}
        </Bay>
      </div>
      <Btn tone="emerald" disabled={play.readOnly || !balanced} onClick={() => play.patch({ paid: true })}>
        🧾 Check out
      </Btn>
      {w.paid && (
        <p className="font-mono font-black">
          {w.qs} × {rupees(saree)} + {w.qh} × {rupees(w.shirt)} = {rupees(r2(w.qs * saree + w.qh * w.shirt))}
        </p>
      )}
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — Real Estate Calculator
   Two towers. The student fills each with its flats; each tower's board multiplies flats
   by the unit price, and the difference board compares them.
   ══════════════════════════════════════════════════════════════════════ */

export function Q40RealEstateActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const towers = cfg<{ city: string; flats: number; price: number }[]>(question, "towers", []);
  const play = usePlay<{ n: number[]; compared: boolean }>({
    question,
    initial: { n: towers.map(() => 0), compared: false },
    derive: (w) => {
      if (!w.compared) return { note: "Fill both towers and compare them." };
      const t = towers.map((x, i) => x.price * w.n[i]);
      const d = Math.abs(t[0] - t[1]);
      return { value: rupees(d), optionId: matchNumber(question, d) };
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
      title="Real Estate Calculator"
      mission="Fill each tower with the number of flats in its city. Each tower's board multiplies its flats by the price of one flat. Then compare the two totals."
      icon={Building2}
      dim="2D"
      submitLabel="Submit the difference"
      hints={["City B has fewer rupees per flat but more flats — work out both totals before comparing."]}
      live={<>{towers.map((t, i) => <Gauge key={t.city} label={t.city} value={rupees(t.price * w.n[i])} tone="violet" />)}</>}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {towers.map((t, i) => (
          <Bay key={t.city} label={`${t.city} · ${rupees(t.price)} a flat`}>
            <div className="flex flex-wrap-reverse gap-0.5 h-24 content-start bg-sky-100 border border-sky-200 rounded p-1">
              {Array.from({ length: w.n[i] }, (_, k) => <span key={k} className="w-2.5 h-2.5 bg-amber-400 rounded-sm" />)}
            </div>
            <Stepper label={`${t.city} flats`} value={w.n[i]} min={0} max={100} steps={[1, 10]} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ compared: false, n: p.n.map((x, j) => (j === i ? x + d : x)) }))} />
            <div className="font-mono text-sm font-black">
              {w.n[i]} × {rupees(t.price)} = {rupees(t.price * w.n[i])}
            </div>
          </Bay>
        ))}
      </div>
      <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ compared: true })}>
        ⚖ Compare the towers
      </Btn>
    </Shell>
  );
}

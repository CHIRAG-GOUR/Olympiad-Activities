"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Fence, Clock3, CupSoda, Users } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, inr, r4 } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — Sports Store Checkout
   Each shop sells bats only in packs. The student puts packs in each basket until it
   holds 16 bats; the tills total the baskets and the saving board compares them.
   ══════════════════════════════════════════════════════════════════════ */

const SHOPS = [
  { k: "A", bats: 8, price: 2560 },
  { k: "B", bats: 4, price: 1550 },
];
export function Q36CricketBatShoppingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ packs: number[]; compared: boolean }>({
    question,
    initial: { packs: [0, 0], compared: false },
    derive: (w) => {
      if (!w.compared) return { note: "Fill both baskets and compare the tills." };
      if (SHOPS.some((s, i) => s.bats * w.packs[i] !== 16)) return { note: "Each basket must hold exactly 16 bats." };
      const d = Math.abs(SHOPS[0].price * w.packs[0] - SHOPS[1].price * w.packs[1]);
      return { value: `Saving ${inr(d)}`, optionId: matchNumber(question, d) };
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
      title="Sports Store Checkout"
      mission="Each shop sells bats only in packs. Add packs to each basket until it holds 16 bats, then compare the two tills to see how much buying from Shop A saves."
      icon={ShoppingCart}
      dim="2D"
      submitLabel="Submit the saving"
      live={<>{SHOPS.map((s, i) => <Gauge key={s.k} label={`Shop ${s.k}`} value={`${s.bats * w.packs[i]} bats · ${inr(s.price * w.packs[i])}`} tone="violet" />)}</>}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {SHOPS.map((s, i) => (
          <Bay key={s.k} label={`Shop ${s.k}: ${s.bats} bats for ${inr(s.price)}`}>
            <div className="flex flex-wrap gap-0.5 min-h-[28px]">{Array.from({ length: s.bats * w.packs[i] }, (_, k) => <span key={k}>🏏</span>)}</div>
            <Stepper label={`Shop ${s.k} packs`} value={w.packs[i]} min={0} max={8} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ compared: false, packs: p.packs.map((x, j) => (j === i ? x + d : x)) }))} />
          </Bay>
        ))}
      </div>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ compared: true })}>Compare the tills</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — Fencing Robot
   The robot walks the boundary of the field once per round of wire. The student sets how
   many rounds to lay and starts it; the wire counter adds the length of every lap.
   ══════════════════════════════════════════════════════════════════════ */

export function Q37LandFencingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const L = 4.5, B = 2.5;
  const play = usePlay<{ rounds: number; laid: number }>({
    question,
    initial: { rounds: 1, laid: 0 },
    derive: (w) => (!w.laid ? { note: "Set the rounds and lay the wire." } : { value: `${w.laid} rounds × ${2 * (L + B)} m = ${w.laid * 2 * (L + B)} m`, optionId: matchNumber(question, w.laid * 2 * (L + B)) }),
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
      title="Fencing Robot"
      mission={`The playground is ${L} m by ${B} m. Set how many rounds of wire go round it and send the robot; each lap it walks the whole boundary and the counter adds that length.`}
      icon={Fence}
      dim="2D"
      submitLabel="Submit the wire length"
      live={<Gauge label="Wire laid" value={`${w.laid * 2 * (L + B)} m`} tone="violet" />}
    >
      <Board>
        <svg viewBox="0 0 110 70" className="w-full max-h-56">
          <rect x={10} y={10} width={90} height={50} fill="#dcfce7" stroke="#16a34a" strokeWidth={1} />
          {Array.from({ length: w.laid }, (_, k) => <rect key={k} x={10 - (k + 1) * 1.6} y={10 - (k + 1) * 1.6} width={90 + (k + 1) * 3.2} height={50 + (k + 1) * 3.2} fill="none" stroke="#92400e" strokeWidth={0.5} />)}
          <text x={55} y={8} fontSize={4} textAnchor="middle">{L} m</text>
          <text x={104} y={36} fontSize={4}>{B} m</text>
          {w.laid > 0 && <motion.text key={w.laid} fontSize={6} animate={{ x: [10, 100, 100, 10, 10], y: [10, 10, 60, 60, 10] }} transition={{ duration: 1.2, repeat: w.laid - 1 }}>🤖</motion.text>}
        </svg>
      </Board>
      <div className="flex flex-wrap gap-2 mt-2">
        <Stepper label="Rounds" value={w.rounds} min={1} max={8} disabled={play.readOnly} onStep={(d) => play.patch({ rounds: w.rounds + d, laid: 0 })} />
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ laid: w.rounds })}>Lay the wire</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — Work-Time Payroll
   The payroll adds regular hours at the regular rate and overtime at the overtime rate.
   The student sets the regular week and adds overtime hours until the pay slip reaches
   the earnings in the question.
   ══════════════════════════════════════════════════════════════════════ */

export function Q38WorkingHoursActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ days: number; hrs: number; weeks: number; ot: number; printed: boolean }>({
    question,
    initial: { days: 1, hrs: 1, weeks: 1, ot: 0, printed: false },
    derive: (w) => {
      const reg = w.days * w.hrs * w.weeks;
      const pay = r4(reg * 2.4 + w.ot * 3.2);
      if (!w.printed) return { note: "Set the work schedule and print the pay slip." };
      if (Math.abs(pay - 432) > 1e-9) return { note: `The slip shows ₹${pay}, not ₹432.` };
      return { value: `${reg} + ${w.ot} = ${reg + w.ot} hours`, optionId: matchNumber(question, reg + w.ot) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const reg = w.days * w.hrs * w.weeks;
  const pay = r4(reg * 2.4 + w.ot * 3.2);
  const set = (k: "days" | "hrs" | "weeks" | "ot", d: number) => play.set((p) => ({ ...p, printed: false, [k]: p[k] + d }));

  return (
    <Shell
      play={play}
      question={question}
      title="Work-Time Payroll"
      mission="Set the clerk's regular schedule — days a week, hours a day, weeks — paid at ₹2.40 an hour. Add overtime hours at ₹3.20 until the pay slip shows ₹432, then print it."
      icon={Clock3}
      dim="2D"
      submitLabel="Submit the total hours"
      live={<><Gauge label="Regular hours" value={reg} tone="violet" /><Gauge label="Pay slip" value={`₹${pay}`} tone={Math.abs(pay - 432) < 1e-9 ? "emerald" : "amber"} /></>}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        <Bay label="Regular schedule">
          <Stepper label="Days a week" value={w.days} min={1} max={7} disabled={play.readOnly} onStep={(d) => set("days", d)} />
          <Stepper label="Hours a day" value={w.hrs} min={1} max={12} disabled={play.readOnly} onStep={(d) => set("hrs", d)} />
          <Stepper label="Weeks" value={w.weeks} min={1} max={8} disabled={play.readOnly} onStep={(d) => set("weeks", d)} />
        </Bay>
        <Bay label="Overtime" tone="violet">
          <Stepper label="Overtime hours" value={w.ot} min={0} max={100} steps={[1, 5]} disabled={play.readOnly} onStep={(d) => set("ot", d)} />
          <p className="text-xs font-mono mt-1">{reg} × ₹2.40 + {w.ot} × ₹3.20 = ₹{pay}</p>
        </Bay>
      </div>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ printed: true })}>🧾 Print the pay slip</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — Mocktail Laboratory
   A jug marked in sixths of a litre. The student pours each ingredient in; it fills as
   many sixths as it holds. Six sixths are carried over as one whole litre.
   ══════════════════════════════════════════════════════════════════════ */

const DRINKS = [
  { k: "soda", w: 2, n: 1, d: 3 },
  { k: "lime syrup", w: 1, n: 2, d: 3 },
  { k: "water", w: 1, n: 5, d: 6 },
];
export function Q39MocktailMixerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ poured: number[]; carried: number }>({
    question,
    initial: { poured: [], carried: 0 },
    derive: (w) => {
      const six = w.poured.reduce((s, i) => s + ((DRINKS[i].w * DRINKS[i].d + DRINKS[i].n) * 6) / DRINKS[i].d, 0);
      const whole = w.carried;
      const left = six - 6 * whole;
      if (w.poured.length < DRINKS.length) return { note: "Pour in every ingredient." };
      if (left >= 6) return { note: "Carry the full litres out of the sixths." };
      return { value: `${whole} ${left}/6 litres`, optionId: matchNumber(question, whole + left / 6, 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const six = w.poured.reduce((s, i) => s + ((DRINKS[i].w * DRINKS[i].d + DRINKS[i].n) * 6) / DRINKS[i].d, 0);
  const left = six - 6 * w.carried;

  return (
    <Shell
      play={play}
      question={question}
      title="Mocktail Laboratory"
      mission="The jug is marked in sixths of a litre. Pour in each ingredient — it fills as many sixths as it holds. Whenever six sixths are full, carry them over as one litre."
      icon={CupSoda}
      dim="2D"
      submitLabel="Submit the total"
      live={<Gauge label="Mocktail" value={`${w.carried} L + ${left}/6 L`} tone="violet" />}
    >
      <div className="flex flex-wrap gap-2">{DRINKS.map((d, i) => <Btn key={d.k} tone={w.poured.includes(i) ? "emerald" : "slate"} disabled={play.readOnly || w.poured.includes(i)} onClick={() => play.patch({ poured: [...w.poured, i] })} ariaLabel={`pour ${d.k}`}>🥤 {d.w} {d.n}/{d.d} L {d.k}</Btn>)}</div>
      <Board className="mt-2">
        <div className="flex items-end gap-3">
          <div className="flex gap-1">{Array.from({ length: w.carried }, (_, i) => <span key={i} className="w-8 h-20 rounded bg-sky-300 border border-sky-500 grid place-items-center text-[10px] font-black">1 L</span>)}</div>
          <div className="flex flex-col-reverse gap-0.5 w-16 min-h-[100px] rounded border-2 border-sky-400 p-0.5 bg-white">
            {Array.from({ length: left }, (_, i) => <span key={i} className={`h-3 rounded-sm ${i < 6 ? "bg-sky-200" : "bg-rose-300"}`} />)}
          </div>
          <Btn tone="amber" disabled={play.readOnly || left < 6} onClick={() => play.patch({ carried: w.carried + 1 })}>Carry 6/6 → 1 L</Btn>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — Village Population Simulator
   The population counter starts at the 2015 figure. The student dials the people who
   moved in and adds them, then dials the people who left and removes them.
   ══════════════════════════════════════════════════════════════════════ */

export function Q40VillagePopulationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const start = 105250;
  const play = usePlay<{ inn: number; out: number; applied: string[] }>({
    question,
    initial: { inn: 0, out: 0, applied: [] },
    derive: (w) => {
      if (w.applied.length < 2) return { note: "Apply the arrivals and the departures." };
      const p = start + w.inn - w.out;
      return { value: p.toLocaleString("en-IN"), optionId: matchNumber(question, p) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const now = start + (w.applied.includes("in") ? w.inn : 0) - (w.applied.includes("out") ? w.out : 0);

  return (
    <Shell
      play={play}
      question={question}
      title="Village Population Simulator"
      mission="The counter starts at 1,05,250. Dial the number of people who moved in and add them, then dial the number who left and remove them."
      icon={Users}
      dim="2D"
      submitLabel="Submit the population"
      live={<Gauge label="Population" value={now.toLocaleString("en-IN")} tone="violet" />}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        <Bay label="Moved in">
          <Stepper label="Arrivals" value={w.inn} min={0} steps={[1, 10, 100, 1000]} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ ...p, inn: p.inn + d, applied: p.applied.filter((x) => x !== "in") }))} />
          <Btn tone="emerald" className="mt-1" disabled={play.readOnly || w.applied.includes("in")} onClick={() => play.patch({ applied: [...w.applied, "in"] })}>+ Add arrivals</Btn>
        </Bay>
        <Bay label="Left the village">
          <Stepper label="Departures" value={w.out} min={0} steps={[1, 10, 100, 1000]} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ ...p, out: p.out + d, applied: p.applied.filter((x) => x !== "out") }))} />
          <Btn tone="rose" className="mt-1" disabled={play.readOnly || w.applied.includes("out")} onClick={() => play.patch({ applied: [...w.applied, "out"] })}>− Remove departures</Btn>
        </Bay>
      </div>
    </Shell>
  );
}

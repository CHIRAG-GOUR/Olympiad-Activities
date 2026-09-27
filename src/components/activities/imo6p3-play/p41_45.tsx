"use client";

import React, { useState } from "react";
import { Footprints, Fuel, Route, Milk, Truck } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, gcd } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, inr, r4, toggle } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — Step Synchronization
   Three walkers step towards a finish line the student places. Each shows whether the
   line falls on one of their footsteps. The least distance where all three land exactly
   is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const STEPS = [63, 70, 77];
export function Q41StepSynchronizationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ d: number; stop: boolean }>({
    question,
    initial: { d: 1000, stop: false },
    derive: (w) => {
      if (!w.stop) return { note: "Place the finish line and stop there." };
      if (!STEPS.every((s) => w.d % s === 0)) return { note: `Not everyone lands exactly on ${w.d} cm.` };
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
      title="Step Synchronization"
      mission="Move the finish line. Each walker shows whether it lands exactly on a footstep, and how much is left over. Find the shortest distance where all three finish in complete steps."
      icon={Footprints}
      dim="2D"
      submitLabel="Submit the distance"
      live={<Gauge label="Landing exactly" value={`${STEPS.filter((s) => w.d % s === 0).length}/3`} tone="violet" />}
    >
      <Stepper label="Finish line" value={w.d} min={1} max={20000} steps={[1, 10, 100, 1000]} unit=" cm" disabled={play.readOnly} onStep={(d) => play.patch({ d: w.d + d, stop: false })} />
      <div className="space-y-1.5 mt-2">
        {STEPS.map((s) => (
          <div key={s} className={`rounded-lg px-2 py-1 text-xs font-black ${w.d % s === 0 ? "bg-emerald-100 text-emerald-800" : "bg-white border border-slate-200 text-slate-600"}`}>
            👣 {s} cm steps: {Math.floor(w.d / s)} steps {w.d % s === 0 ? "exactly" : `+ ${w.d % s} cm left over`}
          </div>
        ))}
      </div>
      <Btn tone="amber" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ stop: true })}>🏁 Stop here</Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — Metro Fuel Savings
   The student loads the fuels that belong on top of the fraction and the one that goes
   underneath, then cuts common factors out of both until nothing more divides them.
   ══════════════════════════════════════════════════════════════════════ */

const FUELS: Record<string, number> = { CNG: 33000, Diesel: 3300, Petrol: 21000 };
const CUT = [2, 3, 5, 7, 11, 13];
export function Q42MetroFuelSavingsActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [msg, setMsg] = useState<string | null>(null);
  const play = usePlay<{ top: string[]; bot: string[]; frac: [number, number] | null }>({
    question,
    initial: { top: [], bot: [], frac: null },
    derive: (w) => {
      if (!w.frac) return { note: "Load the fuels and build the fraction." };
      if (gcd(w.frac[0], w.frac[1]) !== 1) return { note: "Keep cutting common factors." };
      const t = `${w.frac[0]}/${w.frac[1]}`;
      return { value: t, optionId: matchText(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const sum = (ks: string[]) => ks.reduce((s, k) => s + FUELS[k], 0);

  return (
    <Shell
      play={play}
      question={question}
      title="Metro Fuel Savings"
      mission="Load the fuels that go on top of the fraction and the one that goes underneath, then build it. Cut common factors out of the top and bottom until the fraction is in its simplest form."
      icon={Fuel}
      dim="2D"
      submitLabel="Submit the fraction"
      live={<Gauge label="Fraction" value={w.frac ? `${w.frac[0]}/${w.frac[1]}` : `${sum(w.top)}/${sum(w.bot)}`} tone="violet" />}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {(["top", "bot"] as const).map((k) => (
          <Bay key={k} label={k === "top" ? "Top of the fraction" : "Bottom of the fraction"}>
            <div className="flex flex-wrap gap-1">{Object.keys(FUELS).map((f) => <Btn key={f} className="px-2 min-h-[34px]" active={w[k].includes(f)} tone={w[k].includes(f) ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, frac: null, [k]: toggle(p[k], f) }))} ariaLabel={`${k} ${f}`}>{f} {FUELS[f].toLocaleString("en-IN")} t</Btn>)}</div>
          </Bay>
        ))}
      </div>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly || !w.top.length || !w.bot.length} onClick={() => play.patch({ frac: [sum(w.top), sum(w.bot)] })}>Build {sum(w.top)}/{sum(w.bot)}</Btn>
      {w.frac && (
        <Board className="mt-2">
          <div className="text-center font-mono text-2xl font-black text-indigo-900">{w.frac[0]} / {w.frac[1]}</div>
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {CUT.map((c) => <Btn key={c} className="px-2 min-h-[34px]" tone="slate" disabled={play.readOnly} onClick={() => {
              if (w.frac![0] % c || w.frac![1] % c) return setMsg(`÷${c} doesn't divide both.`);
              setMsg(null);
              play.patch({ frac: [w.frac![0] / c, w.frac![1] / c] });
            }} ariaLabel={`cut ${c}`}>÷{c}</Btn>)}
          </div>
          {msg && <p className="text-center text-xs font-bold text-rose-600">{msg}</p>}
        </Board>
      )}
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — Journey Tracker
   The trek odometer logs Monday to Wednesday. The student dials Thursday's distance until
   the four days add up to the planned total.
   ══════════════════════════════════════════════════════════════════════ */

const DAYS = [8.25, 7.52, 11.27];
export function Q43JourneyTrackerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = 42.25;
  const play = usePlay<{ th: number; logged: boolean }>({
    question,
    initial: { th: 10, logged: false },
    derive: (w) => {
      const s = r4(DAYS.reduce((a, b) => a + b, 0) + w.th);
      if (!w.logged) return { note: "Dial Thursday's distance and log it." };
      if (Math.abs(s - total) > 1e-9) return { note: `The four days make ${s} km, not ${total} km.` };
      return { value: `${w.th} km`, optionId: matchNumber(question, w.th, 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const s = r4(DAYS.reduce((a, b) => a + b, 0) + w.th);

  return (
    <Shell
      play={play}
      question={question}
      title="Journey Tracker"
      mission={`The odometer already holds Monday, Tuesday and Wednesday. Dial Thursday's distance until the four days add up to ${total} km, then log it.`}
      icon={Route}
      dim="2D"
      submitLabel="Submit Thursday's distance"
      live={<Gauge label="Four days" value={`${s} km`} tone={Math.abs(s - total) < 1e-9 ? "emerald" : "amber"} />}
    >
      <Board>
        <div className="flex h-8 rounded overflow-hidden border border-indigo-200">
          {[...DAYS, w.th].map((d, i) => <div key={i} className={["bg-indigo-300", "bg-sky-300", "bg-violet-300", "bg-amber-300"][i]} style={{ width: `${(d / Math.max(s, total)) * 100}%` }} />)}
        </div>
        <p className="text-xs font-mono mt-1">{DAYS.join(" + ")} + {w.th} = {s} km (plan {total} km)</p>
      </Board>
      <div className="flex flex-wrap gap-2 mt-2">
        <Stepper label="Thursday" value={w.th} min={0} steps={[0.01, 0.1, 1]} unit=" km" disabled={play.readOnly} onStep={(d) => play.patch({ th: r4(w.th + d), logged: false })} />
        <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ logged: true })}>Log Thursday</Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — Dairy Filling Station
   The barrel's reading must first be converted to millilitres. Then the student fills
   bottles in batches; the station refuses a batch it cannot fill completely.
   ══════════════════════════════════════════════════════════════════════ */

export function Q44DairyFillingStationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const bottle = 130;
  const play = usePlay<{ ml: number | null; filled: number; closed: boolean }>({
    question,
    initial: { ml: null, filled: 0, closed: false },
    derive: (w) => {
      if (w.ml === null) return { note: "Convert the barrel to millilitres." };
      if (!w.closed) return { note: "Fill bottles until no more full bottle fits, then close the station." };
      return { value: `${w.filled} bottles`, optionId: matchNumber(question, w.filled) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const left = w.ml === null ? null : w.ml - w.filled * bottle;
  const fill = (n: number) => left !== null && left >= n * bottle && play.patch({ filled: w.filled + n, closed: false });

  return (
    <Shell
      play={play}
      question={question}
      title="Dairy Filling Station"
      mission="The barrel holds 70 L 200 mL. Convert it to millilitres first. Then fill 130 mL bottles in batches of 100, 10 or 1 — a batch is refused if there isn't enough milk left. Close the station when not even one more bottle can be filled."
      icon={Milk}
      dim="2D"
      submitLabel="Submit the bottle count"
      live={<><Gauge label="In the barrel" value={left === null ? "70 L 200 mL" : `${left} mL`} tone="sky" /><Gauge label="Bottles" value={w.filled} tone="violet" /></>}
    >
      <div className="flex flex-wrap gap-1.5">
        {[[70200, "1 L = 1000 mL → 70,200 mL"], [70020, "1 L = 1000 mL → 70,020 mL"], [7200, "1 L = 100 mL → 7,200 mL"]].map(([v, l]) => (
          <Btn key={v} active={w.ml === v} tone={w.ml === v ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set({ ml: v as number, filled: 0, closed: false })}>{l}</Btn>
        ))}
      </div>
      <Board className="mt-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          {[100, 10, 1].map((n) => <Btn key={n} tone="emerald" disabled={play.readOnly || left === null || left < n * bottle} onClick={() => fill(n)} ariaLabel={`fill ${n}`}>🍼 Fill {n}</Btn>)}
          <Btn tone="amber" disabled={play.readOnly || left === null || left >= bottle} onClick={() => play.patch({ closed: true })}>Close the station</Btn>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — Milk Delivery Route
   The van makes the morning and evening runs each day. The student loads each run,
   drives the route for as many days as the question covers, and the till prices every
   litre delivered.
   ══════════════════════════════════════════════════════════════════════ */

export function Q45WeeklyMilkVendorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ morning: number; evening: number; days: number; billed: boolean }>({
    question,
    initial: { morning: 0, evening: 0, days: 1, billed: false },
    derive: (w) => {
      if (!w.billed) return { note: "Load both runs, set the days and bill it." };
      const t = (w.morning + w.evening) * w.days * 20;
      return { value: inr(t), optionId: matchNumber(question, t) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const set = (k: "morning" | "evening" | "days", d: number) => play.set((p) => ({ ...p, billed: false, [k]: p[k] + d }));

  return (
    <Shell
      play={play}
      question={question}
      title="Milk Delivery Route"
      mission="Load the van for the morning run and the evening run, set how many days it drives the route, and bill the litres at ₹20 each."
      icon={Truck}
      dim="2D"
      submitLabel="Submit the money due"
      live={<Gauge label="Bill" value={inr((w.morning + w.evening) * w.days * 20)} tone="violet" />}
    >
      <div className="grid sm:grid-cols-3 gap-2">
        <Bay label="Morning run"><Stepper label="Morning litres" value={w.morning} min={0} steps={[1, 10, 100]} disabled={play.readOnly} onStep={(d) => set("morning", d)} /></Bay>
        <Bay label="Evening run"><Stepper label="Evening litres" value={w.evening} min={0} steps={[1, 10, 100]} disabled={play.readOnly} onStep={(d) => set("evening", d)} /></Bay>
        <Bay label="Route"><Stepper label="Days" value={w.days} min={1} max={31} disabled={play.readOnly} onStep={(d) => set("days", d)} /></Bay>
      </div>
      <p className="text-xs font-mono mt-1">({w.morning} + {w.evening}) L × {w.days} days × ₹20</p>
      <Btn tone="emerald" className="mt-2" disabled={play.readOnly} onClick={() => play.patch({ billed: true })}>🧾 Bill the route</Btn>
    </Shell>
  );
}

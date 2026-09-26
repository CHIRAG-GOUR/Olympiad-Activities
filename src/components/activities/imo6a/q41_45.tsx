"use client";

import React, { useMemo } from "react";
import { Thermometer, ShoppingBasket, Candy, Wheat, PenLine } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, money, round } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q41 — Hill Thermometer
   Drag the mercury between the two readings and count the degrees.
   ══════════════════════════════════════════════════════════════ */

interface ThermState {
  from: number | null;
  to: number | null;
}

export function Q41ThermometerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<ThermState>) {
  const cfg = question?.customConfig ?? {};
  const readings: { id: string; label: string; value: number }[] = cfg.readings ?? [];
  const scale = cfg.scale ?? { min: -10, max: 10, step: 1 };
  const unit: string = cfg.unit ?? "°C";

  const engine = useActivityEngine<ThermState, string>({
    initialState: { from: null, to: null },
    resolve: (s) =>
      s.from === null || s.to === null || s.from === s.to
        ? undefined
        : matchNumber(question, Math.abs(s.from - s.to)),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { from, to } = engine.state;
  const drop = from !== null && to !== null ? Math.abs(from - to) : null;
  const pct = (v: number) => ((v - scale.min) / (scale.max - scale.min)) * 100;

  return (
    <ActivityShell
      title="Hill Thermometer"
      howTo="Set the mercury to the evening reading, then drag it down to the midnight reading. The gauge counts every degree the column passes through."
      icon={Thermometer}
      answerText={drop === null ? undefined : `${drop}${unit}`}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Set both readings on the thermometer"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[auto_1fr] gap-4">
        <Stage label="The column">
          <div className="relative h-[210px] w-[86px] mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-6 w-6 rounded-full border-2 border-slate-400 bg-white overflow-hidden">
              {from !== null && to !== null && (
                <div
                  className="absolute left-0 right-0 bg-rose-400/70"
                  style={{
                    bottom: `${pct(Math.min(from, to))}%`,
                    height: `${Math.abs(pct(from) - pct(to))}%`,
                  }}
                />
              )}
              {from !== null && (
                <div className="absolute left-0 right-0 h-0.5 bg-sky-600" style={{ bottom: `${pct(from)}%` }} />
              )}
              {to !== null && (
                <div className="absolute left-0 right-0 h-0.5 bg-rose-700" style={{ bottom: `${pct(to)}%` }} />
              )}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-9 h-9 rounded-full bg-rose-500 border-2 border-slate-400" />
            {[scale.max, 0, scale.min].map((v) => (
              <span
                key={v}
                className="absolute right-0 text-[9px] font-mono font-bold text-slate-500 -translate-y-1/2"
                style={{ bottom: `${pct(v)}%` }}
              >
                {v}
              </span>
            ))}
          </div>
        </Stage>

        <div className="space-y-2.5">
          {readings.map((r, i) => (
            <Stage key={r.id} label={r.label}>
              <NumberScale
                min={scale.min}
                max={scale.max}
                step={scale.step}
                value={i === 0 ? from : to}
                onChange={(v) => engine.update((p) => (i === 0 ? { ...p, from: v } : { ...p, to: v }))}
                readOnly={engine.readOnly}
                label={`Reading at ${r.label}`}
                format={(v) => `${v}${unit}`}
              />
            </Stage>
          ))}
          <Stage label="Gauge">
            <Conditions
              items={readings.map((r, i) => ({
                id: r.id,
                label: `${r.label} reading is ${r.value}${unit}`,
                met: (i === 0 ? from : to) === r.value,
              }))}
            />
            <div className="mt-2">
              <Metric label="Temperature fall" value={drop === null ? "—" : `${drop}${unit}`} tone="emerald" />
            </div>
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q42 — Shop Counter
   Weigh each item onto the scale, then let the till work out the change.
   ══════════════════════════════════════════════════════════════ */

interface ShopState {
  weights: Record<string, { kg: number; g: number }>;
  inBasket: string[];
}

export function Q42ShopCounterActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<ShopState>) {
  const cfg = question?.customConfig ?? {};
  const items: { id: string; label: string; kg: number; g: number; ratePerKg: number }[] = cfg.items ?? [];
  const tendered: number = cfg.tendered ?? 0;
  const currency: string = cfg.currency ?? "₹";

  const costOf = (id: string, w: { kg: number; g: number }) => {
    const it = items.find((x) => x.id === id);
    if (!it) return 0;
    return (w.kg + w.g / 1000) * it.ratePerKg;
  };

  const engine = useActivityEngine<ShopState, string>({
    initialState: {
      weights: Object.fromEntries(items.map((i) => [i.id, { kg: 0, g: 0 }])),
      inBasket: [],
    },
    resolve: (s) => {
      if (s.inBasket.length !== items.length) return undefined;
      const bill = s.inBasket.reduce((t, id) => t + costOf(id, s.weights[id]), 0);
      return matchNumber(question, round(tendered - bill, 2), 5e-3);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { weights, inBasket } = engine.state;
  const bill = inBasket.reduce((t, id) => t + costOf(id, weights[id]), 0);
  const change = round(tendered - bill, 2);
  const full = inBasket.length === items.length;

  return (
    <ActivityShell
      title="Shop Counter"
      howTo="Weigh out each item on the shop scale — kilograms on one dial, grams on the other — then put it in the basket. The till totals the bill and works out the change."
      icon={ShoppingBasket}
      answerText={full ? money(change, currency) : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`${inBasket.length} of ${items.length} items in the basket`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        {items.map((it) => {
          const w = weights[it.id] ?? { kg: 0, g: 0 };
          const inB = inBasket.includes(it.id);
          const right = w.kg === it.kg && w.g === it.g;
          return (
            <Stage key={it.id} label={`${it.label} — ${currency} ${it.ratePerKg} per kg`}>
              <div className="grid sm:grid-cols-2 gap-2.5">
                <NumberScale
                  min={0}
                  max={Math.max(20, it.kg + 5)}
                  step={1}
                  value={w.kg}
                  onChange={(v) =>
                    engine.update((p) => ({
                      ...p,
                      weights: { ...p.weights, [it.id]: { ...p.weights[it.id], kg: v } },
                      inBasket: p.inBasket.filter((x) => x !== it.id),
                    }))
                  }
                  readOnly={engine.readOnly}
                  label="Kilograms"
                  ticks={false}
                />
                <NumberScale
                  min={0}
                  max={990}
                  step={10}
                  value={w.g}
                  onChange={(v) =>
                    engine.update((p) => ({
                      ...p,
                      weights: { ...p.weights, [it.id]: { ...p.weights[it.id], g: v } },
                      inBasket: p.inBasket.filter((x) => x !== it.id),
                    }))
                  }
                  readOnly={engine.readOnly}
                  label="Grams"
                  ticks={false}
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <Metric label="On the scale" value={`${w.kg} kg ${w.g} g`} tone={right ? "emerald" : "slate"} />
                <Metric label="Costs" value={money(costOf(it.id, w), currency)} />
                <Tile
                  active={inB}
                  readOnly={engine.readOnly}
                  onClick={() =>
                    engine.update((p) => ({
                      ...p,
                      inBasket: inB ? p.inBasket.filter((x) => x !== it.id) : [...p.inBasket, it.id],
                    }))
                  }
                  className="px-3 text-[11px]"
                >
                  {inB ? "In the basket" : "Add to basket"}
                </Tile>
                <span className="text-[10px] font-semibold text-slate-400">
                  the list says {it.kg} kg {it.g} g
                </span>
              </div>
            </Stage>
          );
        })}

        <Stage label="Till">
          <div className="flex flex-wrap gap-1.5">
            <Metric label="Bill" value={money(bill, currency)} />
            <Metric label="Given to the shopkeeper" value={money(tendered, currency)} />
            <Metric label="Change" value={money(change, currency)} tone={full ? "emerald" : "slate"} />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q43 — Candy Flow
   Size the starting jar until every stage of the story matches.
   ══════════════════════════════════════════════════════════════ */

interface CandyState {
  start: number | null;
}

export function Q43CandyFlowActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<CandyState>) {
  const cfg = question?.customConfig ?? {};
  const range = cfg.startRange ?? { min: 2, max: 80, step: 2 };
  const steps: any[] = cfg.steps ?? [];
  const keptStep = steps.find((s) => s.id === "kept");
  const sakshiStep = steps.find((s) => s.id === "sakshi");

  const flowOf = (start: number) => {
    const swatiAte = start / 2;
    const jenyGot = start - swatiAte;
    const jenyKept = keptStep?.fixed ?? 0;
    const sakshiGot = jenyGot - jenyKept;
    return { swatiAte, jenyGot, jenyKept, sakshiGot };
  };

  const engine = useActivityEngine<CandyState, string>({
    initialState: { start: null },
    resolve: (s) => {
      if (s.start === null) return undefined;
      const f = flowOf(s.start);
      if (!Number.isInteger(f.swatiAte)) return undefined;
      if (f.sakshiGot !== (sakshiStep?.fixed ?? -1)) return undefined;
      return matchNumber(question, f.swatiAte);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const start = engine.state.start;
  const f = start === null ? null : flowOf(start);
  const storyOk = f !== null && f.sakshiGot === (sakshiStep?.fixed ?? -1);

  return (
    <ActivityShell
      title="Candy Flow"
      howTo="Set how many candies were in the jar to begin with. The candies flow down the chain — keep adjusting until every stage matches the story exactly."
      icon={Candy}
      answerText={storyOk && f ? String(f.swatiAte) : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Size the starting jar so the story works out"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Starting jar">
          <NumberScale
            min={range.min}
            max={range.max}
            step={range.step ?? 1}
            value={start}
            onChange={(v) => engine.update({ start: v })}
            readOnly={engine.readOnly}
            label="Candies Swati started with"
            ticks={false}
          />
        </Stage>

        <Stage label="Down the chain">
          <div className="grid sm:grid-cols-4 gap-2">
            {[
              { label: "Swati eats (half)", v: f?.swatiAte },
              { label: "Jeny receives", v: f?.jenyGot },
              { label: "Jeny keeps", v: f?.jenyKept },
              { label: "Sakshi receives", v: f?.sakshiGot },
            ].map((box, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-slate-200 bg-white p-2.5 text-center"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                  {box.label}
                </div>
                <div className="font-mono text-2xl font-black text-slate-900 mt-1">
                  {box.v === undefined || box.v === null ? "—" : box.v}
                </div>
              </div>
            ))}
          </div>
        </Stage>

        <Stage label="Does the story match?">
          <Conditions
            items={[
              {
                id: "kept",
                label: `Jeny keeps ${keptStep?.fixed ?? 0} candies`,
                met: f !== null && f.jenyKept === (keptStep?.fixed ?? 0),
              },
              {
                id: "sakshi",
                label: `Jeny passes ${sakshiStep?.fixed ?? 0} candies to Sakshi`,
                met: f !== null && f.sakshiGot === (sakshiStep?.fixed ?? -1),
              },
              {
                id: "half",
                label: "Swati's share is a whole number of candies",
                met: f !== null && Number.isInteger(f.swatiAte),
              },
            ]}
          />
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q44 — Grain Bagger
   Dial the bag size until every silo empties with nothing left over.
   ══════════════════════════════════════════════════════════════ */

interface BagState {
  size: number | null;
}

export function Q44GrainBaggerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<BagState>) {
  const cfg = question?.customConfig ?? {};
  const silos: { id: string; label: string; kg: number }[] = cfg.silos ?? [];
  const range = cfg.bagRange ?? { min: 1, max: 60, step: 1 };
  const unit: string = cfg.unit ?? "kg";

  const engine = useActivityEngine<BagState, string>({
    initialState: { size: null },
    resolve: (s) => {
      const size = s.size;
      if (!size) return undefined;
      const exact = silos.every((si) => si.kg % size === 0);
      return exact ? matchNumber(question, size) : undefined;
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const size = engine.state.size;
  const rows = silos.map((si) => ({
    ...si,
    bags: size ? Math.floor(si.kg / size) : 0,
    left: size ? si.kg % size : si.kg,
  }));
  const allExact = size !== null && rows.every((r) => r.left === 0);

  return (
    <ActivityShell
      title="Grain Bagger"
      howTo="Dial the bag size. Each silo empties into whole bags and anything that will not fill a bag is shown as leftover — find the largest size that leaves nothing behind in any silo."
      icon={Wheat}
      answerText={allExact && size ? `${size} ${unit}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Find a bag size that empties every silo exactly"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Bag size">
          <NumberScale
            min={range.min}
            max={range.max}
            step={range.step ?? 1}
            value={size}
            onChange={(v) => engine.update({ size: v })}
            readOnly={engine.readOnly}
            label={`Capacity of one bag (${unit})`}
            ticks={false}
          />
        </Stage>

        <Stage label="Silos">
          <div className="space-y-1.5">
            {rows.map((r) => (
              <div
                key={r.id}
                className={`flex flex-wrap items-center gap-2 rounded-xl border-2 px-3 py-2 ${
                  size !== null && r.left === 0 ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"
                }`}
              >
                <span className="w-[86px] text-[11px] font-bold text-slate-600">{r.label}</span>
                <Metric label="Wheat" value={`${r.kg} ${unit}`} />
                <Metric label="Full bags" value={size ? r.bags : "—"} />
                <Metric
                  label="Left over"
                  value={size ? `${r.left} ${unit}` : "—"}
                  tone={size !== null && r.left === 0 ? "emerald" : "amber"}
                />
              </div>
            ))}
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q45 — Blackboard Builder
   Build each number on the board, then let the teacher's panel do the sum.
   ══════════════════════════════════════════════════════════════ */

type Extreme = "smallest" | "greatest";

interface BoardState {
  digits: Record<string, number>;
  extremes: Record<string, Extreme>;
  teacherDigits: number;
  teacherExtreme: Extreme;
}

/** The smallest or greatest whole number with a given number of digits. */
function extremeValue(digits: number, kind: Extreme) {
  if (digits < 1) return 0;
  return kind === "smallest" ? 10 ** (digits - 1) : 10 ** digits - 1;
}

export function Q45BlackboardActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<BoardState>) {
  const cfg = question?.customConfig ?? {};
  const writers: { id: string; label: string; digits: number; extreme: Extreme }[] = cfg.writers ?? [];
  const teacher = cfg.teacher ?? { subtrahend: { digits: 4, extreme: "smallest" as Extreme } };

  const engine = useActivityEngine<BoardState, string>({
    initialState: {
      digits: Object.fromEntries(writers.map((w) => [w.id, 1])),
      extremes: Object.fromEntries(writers.map((w) => [w.id, "smallest" as Extreme])),
      teacherDigits: 1,
      teacherExtreme: "smallest",
    },
    resolve: (s) => {
      const sum = writers.reduce(
        (t, w) => t + extremeValue(s.digits[w.id] ?? 1, s.extremes[w.id] ?? "smallest"),
        0
      );
      const sub = extremeValue(s.teacherDigits, s.teacherExtreme);
      return matchNumber(question, Math.abs(sum - sub));
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const values = writers.map((w) => ({
    ...w,
    value: extremeValue(s.digits[w.id] ?? 1, s.extremes[w.id] ?? "smallest"),
    ok: (s.digits[w.id] ?? 1) === w.digits && (s.extremes[w.id] ?? "smallest") === w.extreme,
  }));
  const sum = values.reduce((t, v) => t + v.value, 0);
  const sub = extremeValue(s.teacherDigits, s.teacherExtreme);
  const result = Math.abs(sum - sub);

  const ExtremeToggle = ({
    value: v,
    onPick,
  }: {
    value: Extreme;
    onPick: (e: Extreme) => void;
  }) => (
    <div className="flex gap-1.5">
      {(["smallest", "greatest"] as Extreme[]).map((e) => (
        <Tile
          key={e}
          active={v === e}
          readOnly={engine.readOnly}
          onClick={() => onPick(e)}
          className="px-2.5 text-[11px]"
        >
          {e}
        </Tile>
      ))}
    </div>
  );

  return (
    <ActivityShell
      title="Blackboard Builder"
      howTo="Build each number on the board: set how many digits it has and whether it is the smallest or the greatest number of that size. The teacher's panel then does the arithmetic."
      icon={PenLine}
      answerText={String(result)}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Build the numbers on the board"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        {values.map((w) => (
          <Stage key={w.id} label={`${w.label} writes`}>
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[190px]">
                <NumberScale
                  min={1}
                  max={9}
                  step={1}
                  value={s.digits[w.id] ?? 1}
                  onChange={(v) => engine.update((p) => ({ ...p, digits: { ...p.digits, [w.id]: v } }))}
                  readOnly={engine.readOnly}
                  label="Number of digits"
                />
              </div>
              <ExtremeToggle
                value={s.extremes[w.id] ?? "smallest"}
                onPick={(e) => engine.update((p) => ({ ...p, extremes: { ...p.extremes, [w.id]: e } }))}
              />
              <Metric label="On the board" value={w.value} tone={w.ok ? "emerald" : "slate"} />
            </div>
            <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
              the question says the {w.extreme} {w.digits}-digit number
            </p>
          </Stage>
        ))}

        <Stage label="The teacher's panel">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[190px]">
              <NumberScale
                min={1}
                max={9}
                step={1}
                value={s.teacherDigits}
                onChange={(v) => engine.update((p) => ({ ...p, teacherDigits: v }))}
                readOnly={engine.readOnly}
                label="Digits in the number to subtract"
              />
            </div>
            <ExtremeToggle
              value={s.teacherExtreme}
              onPick={(e) => engine.update((p) => ({ ...p, teacherExtreme: e }))}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <Metric label="Sum of the two numbers" value={sum} />
            <span className="self-center font-black text-slate-400">−</span>
            <Metric label="Number to subtract" value={sub} />
            <span className="self-center font-black text-slate-400">=</span>
            <Metric label="Answer" value={result} tone="emerald" />
          </div>
          <div className="mt-2">
            <Conditions
              items={[
                {
                  id: "t",
                  label: `The teacher uses the ${teacher.subtrahend.extreme} ${teacher.subtrahend.digits}-digit number`,
                  met: s.teacherDigits === teacher.subtrahend.digits && s.teacherExtreme === teacher.subtrahend.extreme,
                },
              ]}
            />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

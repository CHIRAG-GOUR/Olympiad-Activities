"use client";

import React, { useMemo } from "react";
import { ArrowUpDown, Cog, Hammer, Scaling, Columns3 } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchText, gcd } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q16 — Digit Arranger
   Build both extreme numbers from the same five digits, then subtract.
   ══════════════════════════════════════════════════════════════ */

interface ArrangerState {
  racks: Record<string, (number | null)[]>;
  active: string;
}

export function Q16DigitArrangerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<ArrangerState>) {
  const cfg = question?.customConfig ?? {};
  const digits: number[] = cfg.digits ?? [];
  const rows: { id: string; label: string }[] = cfg.rows ?? [];

  const blank = () => Object.fromEntries(rows.map((r) => [r.id, digits.map(() => null)]));

  const engine = useActivityEngine<ArrangerState, string>({
    initialState: { racks: blank() as Record<string, (number | null)[]>, active: rows[0]?.id ?? "" },
    resolve: (s) => {
      const values = rows.map((r) => {
        const rack = s.racks[r.id] ?? [];
        if (rack.some((d) => d === null)) return undefined;
        return Number(rack.join(""));
      });
      if (values.some((v) => v === undefined)) return undefined;
      const [a, b] = values as number[];
      return matchNumber(question, Math.abs(a - b));
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { racks, active } = engine.state;

  /** Digits still on the tray for the rack being filled. */
  const remaining = useMemo(() => {
    const used = [...(racks[active] ?? [])].filter((d): d is number => d !== null);
    const pool = [...digits];
    used.forEach((d) => {
      const i = pool.indexOf(d);
      if (i >= 0) pool.splice(i, 1);
    });
    return pool;
  }, [racks, active, digits]);

  const place = (digit: number) =>
    engine.update((p) => {
      const rack = [...(p.racks[p.active] ?? [])];
      const slot = rack.findIndex((d) => d === null);
      if (slot < 0) return p;
      rack[slot] = digit;
      return { ...p, racks: { ...p.racks, [p.active]: rack } };
    });

  const lift = (rackId: string, slot: number) =>
    engine.update((p) => {
      const rack = [...(p.racks[rackId] ?? [])];
      // Lifting a digit pulls the later ones back one place so there is never a hole.
      rack.splice(slot, 1);
      rack.push(null);
      return { ...p, racks: { ...p.racks, [rackId]: rack } };
    });

  const numberOf = (id: string) => {
    const rack = racks[id] ?? [];
    return rack.some((d) => d === null) ? null : Number(rack.join(""));
  };

  const a = numberOf(rows[0]?.id ?? "");
  const b = numberOf(rows[1]?.id ?? "");
  const diff = a !== null && b !== null ? Math.abs(a - b) : null;

  return (
    <ActivityShell
      title="Digit Arranger"
      howTo="Every digit must be used exactly once in each rack. Fill one rack with the smallest number they can make and the other with the greatest, then read the difference."
      icon={ArrowUpDown}
      answerText={diff === null ? undefined : String(diff)}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Fill both racks using all five digits"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        {rows.map((r) => (
          <Stage key={r.id} label={r.label}>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1">
                {(racks[r.id] ?? []).map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={engine.readOnly || d === null}
                    onClick={() => lift(r.id, i)}
                    className={`w-11 h-12 rounded-lg border-2 font-mono text-xl font-black transition ${
                      d === null
                        ? "border-dashed border-slate-300 bg-white text-slate-300"
                        : "border-emerald-500 bg-emerald-50 text-emerald-800 hover:border-rose-400"
                    }`}
                  >
                    {d ?? "·"}
                  </button>
                ))}
              </div>
              <Tile
                active={active === r.id}
                readOnly={engine.readOnly}
                onClick={() => engine.update((p) => ({ ...p, active: r.id }))}
                className="px-3 text-[11px]"
              >
                {active === r.id ? "Filling this rack" : "Fill this rack"}
              </Tile>
              {numberOf(r.id) !== null && (
                <Metric label="Number" value={numberOf(r.id)} tone="emerald" />
              )}
            </div>
          </Stage>
        ))}

        <Stage label="Digit tray">
          <div className="flex flex-wrap gap-1.5">
            {remaining.length === 0 ? (
              <span className="text-[11px] font-semibold text-slate-500">
                Every digit is placed. Tap a placed digit to lift it out again.
              </span>
            ) : (
              remaining.map((d, i) => (
                <Tile
                  key={`${d}-${i}`}
                  readOnly={engine.readOnly}
                  onClick={() => place(d)}
                  className="w-12 text-xl"
                >
                  {d}
                </Tile>
              ))
            )}
          </div>
        </Stage>

        <Stage label="Subtraction bar">
          <div className="flex flex-wrap items-center gap-2">
            <Metric label={rows[1]?.label ?? "Greatest"} value={b ?? "—"} />
            <span className="font-black text-slate-400">−</span>
            <Metric label={rows[0]?.label ?? "Smallest"} value={a ?? "—"} />
            <span className="font-black text-slate-400">=</span>
            <Metric label="Difference" value={diff ?? "—"} tone="emerald" />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q17 — H.C.F. / L.C.M. Gearbox
   Hunt for a pair of numbers with the stated product and H.C.F.
   ══════════════════════════════════════════════════════════════ */

interface GearState {
  a: number;
  b: number;
}

export function Q17GearboxActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<GearState>) {
  const cfg = question?.customConfig ?? {};
  const product: number = cfg.product ?? 0;
  const hcf: number = cfg.hcf ?? 1;

  const engine = useActivityEngine<GearState, string>({
    initialState: { a: 1, b: 1 },
    resolve: (s) => {
      if (s.a * s.b !== product) return undefined;
      if (gcd(s.a, s.b) !== hcf) return undefined;
      const lcm = (s.a * s.b) / gcd(s.a, s.b);
      return matchNumber(question, lcm);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { a, b } = engine.state;
  const g = gcd(a, b);
  const productOk = a * b === product;
  const hcfOk = g === hcf;
  const lcm = productOk && hcfOk ? (a * b) / g : null;

  return (
    <ActivityShell
      title="H.C.F. / L.C.M. Gearbox"
      howTo="Turn the two gears until the pair of numbers has exactly the product and the H.C.F. the question states. The gearbox then reports their L.C.M."
      icon={Cog}
      answerText={lcm === null ? undefined : String(lcm)}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Find a pair with the stated product and H.C.F."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Stage label="First gear">
            <NumberScale
              min={1}
              max={product}
              step={1}
              value={a}
              onChange={(v) => engine.update((p) => ({ ...p, a: v }))}
              readOnly={engine.readOnly}
              label="Number A"
              ticks={false}
            />
          </Stage>
          <Stage label="Second gear">
            <NumberScale
              min={1}
              max={product}
              step={1}
              value={b}
              onChange={(v) => engine.update((p) => ({ ...p, b: v }))}
              readOnly={engine.readOnly}
              label="Number B"
              ticks={false}
            />
          </Stage>
        </div>

        <Stage label="Gearbox readings">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <Metric label="A × B" value={a * b} tone={productOk ? "emerald" : "slate"} />
            <Metric label="H.C.F." value={g} tone={hcfOk ? "emerald" : "slate"} />
            <Metric label="L.C.M." value={lcm ?? "—"} tone={lcm !== null ? "emerald" : "slate"} />
          </div>
          <Conditions
            items={[
              { id: "p", label: `Their product must be ${product}`, met: productOk },
              { id: "h", label: `Their H.C.F. must be ${hcf}`, met: hcfOk },
            ]}
          />
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q18 — Roman Forge
   Convert each numeral yourself, then commit the expression you believe matches.
   ══════════════════════════════════════════════════════════════ */

const ROMAN_VALUES: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  if (!Number.isInteger(n) || n <= 0 || n > 3999) return "—";
  let rest = n;
  let out = "";
  for (const [v, sym] of ROMAN_VALUES) {
    while (rest >= v) {
      out += sym;
      rest -= v;
    }
  }
  return out;
}

function fromRoman(s: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]] ?? 0;
    const next = map[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}

interface ForgeState {
  selected: string | null;
  left: number;
  right: number;
  committed: string | null;
}

export function Q18RomanForgeActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<ForgeState>) {
  const cfg = question?.customConfig ?? {};
  const target: string = cfg.target ?? "";
  const candidates: { optionId: string; left: string; op: string; right: string }[] = cfg.candidates ?? [];

  const textOf = (c: { left: string; op: string; right: string }) => `${c.left} ${c.op} ${c.right}`;

  const engine = useActivityEngine<ForgeState, string>({
    initialState: { selected: null, left: 0, right: 0, committed: null },
    resolve: (s) => {
      if (!s.committed) return undefined;
      const c = candidates.find((x) => x.optionId === s.committed);
      return c ? matchText(question, textOf(c)) : undefined;
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const current = candidates.find((c) => c.optionId === s.selected);
  const trueLeft = current ? fromRoman(current.left) : 0;
  const trueRight = current ? fromRoman(current.right) : 0;
  const conversionOk = current ? s.left === trueLeft && s.right === trueRight : false;
  const result = current && conversionOk ? (current.op === "+" ? s.left + s.right : s.left - s.right) : null;
  const cast = result === null ? null : toRoman(result);

  return (
    <ActivityShell
      title="Roman Numeral Forge"
      howTo={`Load an expression, work out what each numeral is worth and dial those values in. Once both are right the forge performs the operation and recasts the result — then commit the expression you believe gives ${target}.`}
      icon={Hammer}
      answerText={s.committed ? `Committed: ${textOf(candidates.find((c) => c.optionId === s.committed)!)}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Convert a candidate and commit the one you choose"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Expressions on the bench">
          <div className="flex flex-wrap gap-1.5">
            {candidates.map((c) => (
              <Tile
                key={c.optionId}
                active={s.selected === c.optionId}
                readOnly={engine.readOnly}
                onClick={() =>
                  engine.update((p) => ({ ...p, selected: c.optionId, left: 0, right: 0 }))
                }
                className="px-3 text-[11px] font-mono"
              >
                {textOf(c)}
              </Tile>
            ))}
          </div>
        </Stage>

        {current && (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <Stage label={`Value of ${current.left}`}>
                <NumberScale
                  min={0}
                  max={1200}
                  step={1}
                  value={s.left}
                  onChange={(v) => engine.update((p) => ({ ...p, left: v }))}
                  readOnly={engine.readOnly}
                  label={current.left}
                  ticks={false}
                />
              </Stage>
              <Stage label={`Value of ${current.right}`}>
                <NumberScale
                  min={0}
                  max={1200}
                  step={1}
                  value={s.right}
                  onChange={(v) => engine.update((p) => ({ ...p, right: v }))}
                  readOnly={engine.readOnly}
                  label={current.right}
                  ticks={false}
                />
              </Stage>
            </div>

            <Stage label="Forge">
              {conversionOk ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Metric label="Arithmetic" value={`${s.left} ${current.op} ${s.right} = ${result}`} />
                  <span className="font-black text-slate-400">→</span>
                  <Metric
                    label="Recast"
                    value={cast ?? "—"}
                    tone={cast === target ? "emerald" : "amber"}
                  />
                  <span className="text-[11px] font-semibold text-slate-500">
                    {cast === target ? `This is ${target}.` : `This is not ${target}.`}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 leading-snug">
                  Dial both numerals to their correct values. The forge stays cold until the
                  conversion is right.
                </p>
              )}
              <div className="mt-2.5">
                <Tile
                  readOnly={engine.readOnly}
                  active={s.committed === current.optionId}
                  onClick={() =>
                    engine.update((p) => ({
                      ...p,
                      committed: p.committed === current.optionId ? null : current.optionId,
                    }))
                  }
                  className="px-3 text-[11px]"
                >
                  {s.committed === current.optionId ? "Committed — tap to withdraw" : "Commit this expression"}
                </Tile>
              </div>
            </Stage>
          </>
        )}
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q19 — Area Distributor
   Split the rectangle, see the areas, then name the law that allowed it.
   ══════════════════════════════════════════════════════════════ */

interface DistState {
  split: number | null;
  law: string | null;
}

export function Q19AreaDistributorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<DistState>) {
  const cfg = question?.customConfig ?? {};
  const multiplier: number = cfg.multiplier ?? 1;
  const parts: number[] = cfg.parts ?? [];
  const whole = parts.reduce((a, b) => a + b, 0);
  const laws: string[] = (question?.multipleChoiceConfig?.options ?? []).map((o) => o.text);

  const engine = useActivityEngine<DistState, string>({
    initialState: { split: null, law: null },
    // The law may only be named once the split has actually been made correctly.
    resolve: (s) => (s.split === parts[0] && s.law ? matchText(question, s.law) : undefined),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { split, law } = engine.state;
  const splitOk = split === parts[0];
  const left = split ?? 0;
  const right = whole - left;

  return (
    <ActivityShell
      title="Area Distributor"
      howTo={`The rectangle is ${multiplier} by ${whole}. Slide the cut so it separates into the two pieces the expression describes, watch the areas, then name the law that lets you split it that way.`}
      icon={Scaling}
      answerText={splitOk && law ? law : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={splitOk ? "Now name the law being demonstrated" : "Slide the cut to match the expression"}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="The rectangle">
          <div className="flex h-24 rounded-lg overflow-hidden border-2 border-slate-300">
            <div
              className="bg-emerald-100 border-r-2 border-emerald-600 grid place-items-center transition-[width]"
              style={{ width: `${(left / whole) * 100}%` }}
            >
              {left > 0 && (
                <span className="text-[11px] font-black text-emerald-800 text-center leading-tight">
                  {multiplier} × {left}
                  <br />= {multiplier * left}
                </span>
              )}
            </div>
            <div className="bg-sky-100 grid place-items-center flex-1">
              {right > 0 && (
                <span className="text-[11px] font-black text-sky-800 text-center leading-tight">
                  {multiplier} × {right}
                  <br />= {multiplier * right}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2.5">
            <NumberScale
              min={0}
              max={whole}
              step={1}
              value={split}
              onChange={(v) => engine.update((p) => ({ ...p, split: v }))}
              readOnly={engine.readOnly}
              label="Position of the cut"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <Metric label="Whole" value={`${multiplier} × ${whole} = ${multiplier * whole}`} />
            <Metric
              label="Two pieces"
              value={`${multiplier * left} + ${multiplier * right} = ${multiplier * whole}`}
              tone={splitOk ? "emerald" : "slate"}
            />
          </div>
        </Stage>

        <Stage label="Which law does this demonstrate?">
          <div className="flex flex-wrap gap-1.5">
            {laws.map((l) => (
              <Tile
                key={l}
                active={law === l}
                readOnly={engine.readOnly || !splitOk}
                onClick={() => engine.update((p) => ({ ...p, law: p.law === l ? null : l }))}
                className="px-3 text-[11px]"
              >
                {l}
              </Tile>
            ))}
          </div>
          {!splitOk && (
            <p className="mt-2 text-[11px] text-slate-500">
              Make the split first — the laws unlock once the rectangle matches the expression.
            </p>
          )}
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q20 — Place Value Swapper
   Lift two digits out of their columns, swap them, and weigh the result.
   ══════════════════════════════════════════════════════════════ */

const PLACE_NAMES = ["thousands", "hundreds", "tens", "ones"];

interface SwapState {
  digits: number[];
  lifted: number | null;
}

export function Q20PlaceValueActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<SwapState>) {
  const cfg = question?.customConfig ?? {};
  const original: number = cfg.number ?? 0;
  const swap: string[] = cfg.swap ?? [];
  const labels = cfg.comparisonLabels ?? {};

  const originalDigits = useMemo(() => String(original).split("").map(Number), [original]);
  const places = useMemo(
    () => PLACE_NAMES.slice(PLACE_NAMES.length - originalDigits.length),
    [originalDigits.length]
  );
  const swapIdx = swap.map((p) => places.indexOf(p)).filter((i) => i >= 0);

  const engine = useActivityEngine<SwapState, string>({
    initialState: { digits: [...originalDigits], lifted: null },
    resolve: (s) => {
      // Only a genuine swap of the two named columns counts as having done the task.
      const swapped = [...originalDigits];
      if (swapIdx.length === 2) {
        const [i, j] = swapIdx;
        [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
      }
      if (s.digits.join("") !== swapped.join("")) return undefined;
      const now = Number(s.digits.join(""));
      const key = now > original ? "gt" : now < original ? "lt" : "eq";
      return matchText(question, labels[key]);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { digits, lifted } = engine.state;
  const now = Number(digits.join(""));
  const changed = digits.join("") !== originalDigits.join("");

  const tapColumn = (i: number) =>
    engine.update((p) => {
      if (p.lifted === null) return { ...p, lifted: i };
      if (p.lifted === i) return { ...p, lifted: null };
      const next = [...p.digits];
      [next[p.lifted], next[i]] = [next[i], next[p.lifted]];
      return { digits: next, lifted: null };
    });

  return (
    <ActivityShell
      title="Place Value Swapper"
      howTo={`Tap a column to lift its digit out, then tap another column to drop it there. Swap the ${swap.join(" and ")} digits, then read the balance.`}
      icon={Columns3}
      answerText={changed ? `${now} compared with ${original}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`Swap the ${swap.join(" and ")} digits`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Place value columns">
          <div className="flex gap-1.5">
            {digits.map((d, i) => (
              <button
                key={i}
                type="button"
                disabled={engine.readOnly}
                onClick={() => tapColumn(i)}
                className={`flex-1 min-w-[64px] rounded-xl border-2 py-2.5 transition ${
                  lifted === i
                    ? "border-emerald-600 bg-emerald-600 text-white -translate-y-1 shadow-lg"
                    : swap.includes(places[i])
                    ? "border-amber-300 bg-amber-50 text-slate-800 hover:border-emerald-400"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span className="block font-mono text-2xl font-black leading-none">{d}</span>
                <span className="block text-[9px] font-bold uppercase tracking-wider opacity-70 mt-1">
                  {places[i]}
                </span>
              </button>
            ))}
          </div>
          {lifted !== null && (
            <p className="mt-2 text-[11px] font-semibold text-emerald-700">
              Holding the {places[lifted]} digit — tap another column to drop it there.
            </p>
          )}
        </Stage>

        <Stage label="Balance">
          <div className="flex flex-wrap items-center gap-2">
            <Metric label="New number" value={now} tone={changed ? "emerald" : "slate"} />
            <span className="font-black text-lg text-slate-500">
              {!changed ? "=" : now > original ? ">" : now < original ? "<" : "="}
            </span>
            <Metric label="Original" value={original} />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

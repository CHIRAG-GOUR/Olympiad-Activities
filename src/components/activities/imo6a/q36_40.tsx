"use client";

import React, { useMemo } from "react";
import { PackageOpen, PartyPopper, Flower2, CalendarClock, Sigma } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchRatio, matchText, round } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q36 — Packing Line
   Bin the rotten fruit, then share the rest between the boxes.
   ══════════════════════════════════════════════════════════════ */

interface PackState {
  binned: number | null;
  boxes: number | null;
}

export function Q36PackingLineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<PackState>) {
  const cfg = question?.customConfig ?? {};
  const total: number = cfg.total ?? 0;
  const discard: number = cfg.discard ?? 0;
  const boxCount: number = cfg.boxes ?? 1;
  const item: string = cfg.itemLabel ?? "items";

  const engine = useActivityEngine<PackState, string>({
    initialState: { binned: null, boxes: null },
    resolve: (s) => {
      if (s.binned === null || s.boxes === null || s.boxes === 0) return undefined;
      const each = (total - s.binned) / s.boxes;
      return Number.isInteger(each) ? matchNumber(question, each) : undefined;
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { binned, boxes } = engine.state;
  const good = binned === null ? null : total - binned;
  const each = good !== null && boxes ? good / boxes : null;

  return (
    <ActivityShell
      title="Packing Line"
      howTo={`The crate holds ${total} ${item}. Tip the rotten ones into the bin, set how many boxes the conveyor feeds, and the line shares the rest out equally.`}
      icon={PackageOpen}
      answerText={each !== null && Number.isInteger(each) ? String(each) : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Set the bin and the number of boxes"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Stage 1 — the bin">
          <NumberScale
            min={0}
            max={Math.max(400, discard * 2)}
            step={1}
            value={binned}
            onChange={(v) => engine.update((p) => ({ ...p, binned: v }))}
            readOnly={engine.readOnly}
            label={`Rotten ${item} tipped into the bin`}
            ticks={false}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Metric label="In the crate" value={total} />
            <Metric label="Binned" value={binned ?? "—"} />
            <Metric label="Left to pack" value={good ?? "—"} tone={good !== null ? "emerald" : "slate"} />
          </div>
        </Stage>

        <Stage label="Stage 2 — the conveyor">
          <NumberScale
            min={1}
            max={Math.max(120, boxCount * 2)}
            step={1}
            value={boxes}
            onChange={(v) => engine.update((p) => ({ ...p, boxes: v }))}
            readOnly={engine.readOnly}
            label="Boxes on the line"
            ticks={false}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Metric
              label={`${item} per box`}
              value={each === null ? "—" : Number.isInteger(each) ? each : round(each, 3)}
              tone={each !== null && Number.isInteger(each) ? "emerald" : "amber"}
            />
            {each !== null && !Number.isInteger(each) && (
              <span className="text-[11px] font-semibold text-amber-700 self-center">
                They will not share out equally with these settings.
              </span>
            )}
          </div>
          <div className="mt-2.5">
            <Conditions
              items={[
                { id: "bin", label: `Exactly ${discard} rotten ${item} binned`, met: binned === discard },
                { id: "box", label: `${boxCount} boxes on the line`, met: boxes === boxCount },
              ]}
            />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q37 — Party Stocker
   Stack packs until the counts match and cover every guest.
   ══════════════════════════════════════════════════════════════ */

interface StockState {
  packs: Record<string, number>;
}

export function Q37PartyStockerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<StockState>) {
  const cfg = question?.customConfig ?? {};
  const guests: number = cfg.guests ?? 0;
  const items: { id: string; label: string; perPack: number; max: number }[] = cfg.items ?? [];

  const engine = useActivityEngine<StockState, string>({
    initialState: { packs: Object.fromEntries(items.map((i) => [i.id, 0])) },
    resolve: (s) => {
      if (items.some((i) => (s.packs[i.id] ?? 0) === 0)) return undefined;
      const phrase = items
        .map((i) => `${s.packs[i.id]} packs of ${i.label.toLowerCase()}`)
        .join(" and ");
      return matchText(question, phrase);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { packs } = engine.state;
  const totals = items.map((i) => ({ ...i, count: (packs[i.id] ?? 0) * i.perPack }));
  const equal = totals.length > 1 && totals.every((t) => t.count === totals[0].count);
  const enough = totals.every((t) => t.count >= guests);

  return (
    <ActivityShell
      title="Party Stocker"
      howTo={`Stack packs onto the trolley. Both counts must reach ${guests} and be exactly equal to each other — and you want to do it with as few packs as possible.`}
      icon={PartyPopper}
      answerText={
        items.every((i) => (packs[i.id] ?? 0) > 0)
          ? items.map((i) => `${packs[i.id]} packs of ${i.label.toLowerCase()}`).join(" and ")
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Load packs of each item onto the trolley"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        {items.map((i) => (
          <Stage key={i.id} label={`${i.label} — ${i.perPack} per pack`}>
            <NumberScale
              min={0}
              max={i.max}
              step={1}
              value={packs[i.id] ?? 0}
              onChange={(v) => engine.update((p) => ({ packs: { ...p.packs, [i.id]: v } }))}
              readOnly={engine.readOnly}
              label={`Packs of ${i.label.toLowerCase()}`}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Metric
                label={`Total ${i.label.toLowerCase()}`}
                value={(packs[i.id] ?? 0) * i.perPack}
                tone={(packs[i.id] ?? 0) * i.perPack >= guests ? "emerald" : "slate"}
              />
            </div>
          </Stage>
        ))}

        <Stage label="Trolley check">
          <Conditions
            items={[
              { id: "enough", label: `Every guest has one of each (at least ${guests})`, met: enough },
              { id: "equal", label: "Exactly the same number of each", met: equal },
            ]}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Metric label="Packs in total" value={items.reduce((t, i) => t + (packs[i.id] ?? 0), 0)} />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q38 — Garden Planner
   Dig the beds into the plot and read what grass is left.
   ══════════════════════════════════════════════════════════════ */

interface GardenState {
  dug: string[];
}

export function Q38GardenPlannerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<GardenState>) {
  const cfg = question?.customConfig ?? {};
  const land = cfg.land ?? { length: 0, width: 0 };
  const bed = cfg.bed ?? { side: 1, count: 1 };
  const unit: string = cfg.unit ?? "sq. m";
  const dp: number = cfg.decimals ?? 2;

  const cols = Math.floor(land.length / bed.side);
  const rows = Math.floor(land.width / bed.side);
  const landArea = round(land.length * land.width, 4);
  const bedArea = round(bed.side * bed.side, 4);

  const engine = useActivityEngine<GardenState, string>({
    initialState: { dug: [] },
    resolve: (s) =>
      s.dug.length !== bed.count
        ? undefined
        : matchNumber(question, round(landArea - s.dug.length * bedArea, dp), 5e-3),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { dug } = engine.state;
  const remaining = round(landArea - dug.length * bedArea, dp);

  const toggle = (key: string) =>
    engine.update((p) => {
      if (p.dug.includes(key)) return { dug: p.dug.filter((k) => k !== key) };
      if (p.dug.length >= bed.count) return p;
      return { dug: [...p.dug, key] };
    });

  return (
    <ActivityShell
      title="Garden Planner"
      howTo={`The plot is ${land.length} m by ${land.width} m. Dig ${bed.count} square beds of side ${bed.side} m into it — the ledger keeps track of what grass is left.`}
      icon={Flower2}
      answerText={dug.length === bed.count ? `${remaining} ${unit}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`${dug.length} of ${bed.count} beds dug`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-[1.2fr_1fr] gap-3">
        <Stage label="The plot">
          <div
            className="relative bg-emerald-50 border-2 border-emerald-600 rounded-lg overflow-hidden"
            style={{ aspectRatio: `${land.length} / ${land.width}` }}
          >
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, ${(bed.side / land.length) * 100}%)`,
                gridTemplateRows: `repeat(${rows}, ${(bed.side / land.width) * 100}%)`,
              }}
            >
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const key = `${c},${r}`;
                  const on = dug.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={engine.readOnly}
                      onClick={() => toggle(key)}
                      className={`border transition ${
                        on
                          ? "bg-amber-700/70 border-amber-900"
                          : "bg-transparent border-emerald-300/60 hover:bg-emerald-100"
                      }`}
                      aria-label={`Bed at column ${c + 1}, row ${r + 1}`}
                    />
                  );
                })
              )}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Tap a square to dig a bed there; tap it again to fill it back in.
          </p>
        </Stage>

        <Stage label="Ledger">
          <div className="space-y-1.5">
            <Metric label="Area of the land" value={`${landArea} ${unit}`} />
            <Metric label="Area of one bed" value={`${bedArea} ${unit}`} />
            <Metric label={`Beds dug (need ${bed.count})`} value={dug.length} tone={dug.length === bed.count ? "emerald" : "slate"} />
            <Metric label="Area dug out" value={`${round(dug.length * bedArea, dp)} ${unit}`} />
            <Metric
              label="Grass remaining"
              value={`${remaining} ${unit}`}
              tone={dug.length === bed.count ? "emerald" : "slate"}
            />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q39 — Age Timeline
   Slide each person to the year the question asks about.
   ══════════════════════════════════════════════════════════════ */

interface AgeState {
  offsets: Record<string, number>;
}

export function Q39AgeTimelineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<AgeState>) {
  const cfg = question?.customConfig ?? {};
  const people: { id: string; label: string; ageNow: number; offset: number; offsetLabel: string }[] =
    cfg.people ?? [];
  const order: string[] = cfg.ratioOrder ?? people.map((p) => p.id);
  const range = cfg.yearRange ?? { min: -6, max: 6 };

  const engine = useActivityEngine<AgeState, string>({
    initialState: { offsets: Object.fromEntries(people.map((p) => [p.id, 0])) },
    resolve: (s) => {
      const ages = order.map((id) => {
        const p = people.find((x) => x.id === id);
        return p ? p.ageNow + (s.offsets[id] ?? 0) : undefined;
      });
      if (ages.some((a) => a === undefined || (a as number) < 0)) return undefined;
      return matchRatio(question, ages[0] as number, ages[1] as number);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { offsets } = engine.state;
  const ageOf = (id: string) => {
    const p = people.find((x) => x.id === id);
    return p ? p.ageNow + (offsets[id] ?? 0) : 0;
  };

  return (
    <ActivityShell
      title="Age Timelines"
      howTo="Each person has their own timeline. Slide each marker to the year the question asks about, and the ratio bar reduces their two ages to lowest terms."
      icon={CalendarClock}
      answerText={`${ageOf(order[0])} : ${ageOf(order[1])}`}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Move each person to the right year"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        {people.map((p) => {
          const off = offsets[p.id] ?? 0;
          return (
            <Stage key={p.id} label={`${p.label} — ${p.ageNow} years old now`}>
              <NumberScale
                min={range.min}
                max={range.max}
                step={1}
                value={off}
                onChange={(v) => engine.update((st) => ({ offsets: { ...st.offsets, [p.id]: v } }))}
                readOnly={engine.readOnly}
                label="Years from now"
                format={(v) => (v === 0 ? "now" : v > 0 ? `+${v}` : String(v))}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Metric
                  label={off === 0 ? "Age now" : off < 0 ? `${-off} years ago` : `${off} years hence`}
                  value={p.ageNow + off}
                  tone={off === p.offset ? "emerald" : "slate"}
                />
                <span className="text-[11px] font-semibold text-slate-500 self-center">
                  the question wants {p.label} {p.offsetLabel}
                </span>
              </div>
            </Stage>
          );
        })}

        <Stage label="Ratio bar">
          <div className="flex flex-wrap items-center gap-2">
            <Metric label={people.find((p) => p.id === order[0])?.label ?? ""} value={ageOf(order[0])} />
            <span className="font-black text-lg text-slate-400">:</span>
            <Metric label={people.find((p) => p.id === order[1])?.label ?? ""} value={ageOf(order[1])} />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q40 — Algebra Sheet
   Build the breadth from blocks; the perimeter strip collects like terms.
   ══════════════════════════════════════════════════════════════ */

interface SheetState {
  blocks: string[];
}

const fmtTerm = (xCoef: number, constant: number, symbol: string, unit: string) => {
  const x = Number.isInteger(xCoef) ? String(xCoef) : String(round(xCoef, 3));
  const xPart = xCoef === 0 ? "" : `${xCoef === 1 ? "" : x}${symbol}`;
  if (constant === 0) return `(${xPart || "0"}) ${unit}`;
  if (!xPart) return `(${constant}) ${unit}`;
  return `(${xPart} ${constant < 0 ? "−" : "+"} ${Math.abs(constant)}) ${unit}`;
};

export function Q40AlgebraSheetActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<SheetState>) {
  const cfg = question?.customConfig ?? {};
  const symbol: string = cfg.lengthSymbol ?? "x";
  const unit: string = cfg.unit ?? "m";
  const blocks: { id: string; label: string; xCoef: number; constant: number }[] = cfg.breadthBlocks ?? [];
  const target = cfg.targetBreadth ?? { xCoef: 0, constant: 0 };

  const sumOf = (ids: string[]) =>
    ids.reduce(
      (acc, id) => {
        const b = blocks.find((x) => x.id === id);
        return b ? { xCoef: acc.xCoef + b.xCoef, constant: acc.constant + b.constant } : acc;
      },
      { xCoef: 0, constant: 0 }
    );

  const engine = useActivityEngine<SheetState, string>({
    initialState: { blocks: [] },
    resolve: (s) => {
      if (s.blocks.length === 0) return undefined;
      const b = sumOf(s.blocks);
      // Perimeter = 2 × length + 2 × breadth, with length = x.
      const p = { xCoef: 2 * (1 + b.xCoef), constant: 2 * b.constant };
      return matchText(question, fmtTerm(p.xCoef, p.constant, symbol, unit));
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const chosen = engine.state.blocks;
  const breadth = sumOf(chosen);
  const perim = { xCoef: 2 * (1 + breadth.xCoef), constant: 2 * breadth.constant };
  const breadthOk = breadth.xCoef === target.xCoef && breadth.constant === target.constant;

  const toggle = (id: string) =>
    engine.update((p) => ({
      blocks: p.blocks.includes(id) ? p.blocks.filter((b) => b !== id) : [...p.blocks, id],
    }));

  return (
    <ActivityShell
      title="Algebra Bed Sheet"
      howTo={`The length of the sheet is ${symbol}. Build its breadth by laying algebra blocks along the short edge, then the perimeter strip adds two lengths and two breadths and collects like terms.`}
      icon={Sigma}
      answerText={chosen.length ? fmtTerm(perim.xCoef, perim.constant, symbol, unit) : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Lay blocks to make the breadth"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="The sheet">
          <div className="flex items-stretch gap-2">
            <div className="flex-1 rounded-lg border-2 border-slate-300 bg-white grid place-items-center py-8">
              <span className="font-mono text-lg font-black text-slate-800">
                length = {symbol} {unit}
              </span>
            </div>
            <div
              className={`w-36 rounded-lg border-2 grid place-items-center text-center px-2 ${
                breadthOk ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white"
              }`}
            >
              <span className="font-mono text-sm font-black text-slate-800">
                breadth =<br />
                {chosen.length ? fmtTerm(breadth.xCoef, breadth.constant, symbol, unit) : "—"}
              </span>
            </div>
          </div>
        </Stage>

        <Stage label="Algebra blocks">
          <div className="flex flex-wrap gap-1.5">
            {blocks.map((b) => (
              <Tile
                key={b.id}
                active={chosen.includes(b.id)}
                readOnly={engine.readOnly}
                onClick={() => toggle(b.id)}
                className="px-3 text-sm font-mono"
              >
                {b.label}
              </Tile>
            ))}
          </div>
          <div className="mt-2.5">
            <Conditions
              items={[
                {
                  id: "b",
                  label: `Breadth is ${target.constant} ${unit} more than half the length`,
                  met: breadthOk,
                },
              ]}
            />
          </div>
        </Stage>

        <Stage label="Perimeter strip">
          <div className="flex flex-wrap items-center gap-2">
            <Metric label="2 × length" value={`2${symbol}`} />
            <span className="font-black text-slate-400">+</span>
            <Metric
              label="2 × breadth"
              value={chosen.length ? fmtTerm(2 * breadth.xCoef, 2 * breadth.constant, symbol, "") : "—"}
            />
            <span className="font-black text-slate-400">=</span>
            <Metric
              label="Perimeter"
              value={chosen.length ? fmtTerm(perim.xCoef, perim.constant, symbol, unit) : "—"}
              tone="emerald"
            />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

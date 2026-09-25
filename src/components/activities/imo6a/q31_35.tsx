"use client";

import React, { useMemo } from "react";
import { ArrowDownUp, Boxes, Filter, Workflow, Scale as ScaleIcon } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchNumberList, matchText, reduceFraction, round } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q31 — Fraction Ladder
   Reorder bars that fill to their true size.
   ══════════════════════════════════════════════════════════════ */

interface LadderState {
  order: string[];
}

export function Q31FractionLadderActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<LadderState>) {
  const cfg = question?.customConfig ?? {};
  const fractions: { id: string; num: number; den: number }[] = cfg.fractions ?? [];

  const label = (id: string) => {
    const f = fractions.find((x) => x.id === id);
    return f ? `${f.num}/${f.den}` : id;
  };

  const engine = useActivityEngine<LadderState, string>({
    initialState: { order: fractions.map((f) => f.id) },
    resolve: (s) => matchText(question, s.order.map(label).join(", ")),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { order } = engine.state;

  const move = (i: number, delta: number) =>
    engine.update((p) => {
      const j = i + delta;
      if (j < 0 || j >= p.order.length) return p;
      const next = [...p.order];
      [next[i], next[j]] = [next[j], next[i]];
      return { order: next };
    });

  return (
    <ActivityShell
      title="Fraction Ladder"
      howTo={`Move the bars until they are in ${cfg.order ?? "ascending"} order. Each bar fills to the true size of its fraction, so you can compare them by eye before you commit.`}
      icon={ArrowDownUp}
      answerText={order.map(label).join(", ")}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Arrange the bars"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <Stage label={`${cfg.order === "descending" ? "Largest" : "Smallest"} at the top`}>
        <ul className="space-y-1.5">
          {order.map((id, i) => {
            const f = fractions.find((x) => x.id === id)!;
            const pct = (f.num / f.den) * 100;
            return (
              <li key={id} className="flex items-center gap-2">
                <span className="w-6 text-[11px] font-black text-slate-400 tabular-nums">{i + 1}</span>
                <div className="flex-1 h-11 rounded-lg border-2 border-slate-200 bg-white overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-emerald-200"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 font-mono text-sm font-black text-slate-800">
                    {f.num}/{f.den}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={engine.readOnly || i === 0}
                    onClick={() => move(i, -1)}
                    className="w-9 h-[21px] rounded border-2 border-slate-200 bg-white text-[10px] font-black text-slate-600 disabled:opacity-30 hover:border-emerald-400"
                    aria-label={`Move ${f.num}/${f.den} up`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={engine.readOnly || i === order.length - 1}
                    onClick={() => move(i, 1)}
                    className="w-9 h-[21px] rounded border-2 border-slate-200 bg-white text-[10px] font-black text-slate-600 disabled:opacity-30 hover:border-emerald-400"
                    aria-label={`Move ${f.num}/${f.den} down`}
                  >
                    ▼
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Stage>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q32 — Net Folder
   Raise the net into a solid, name it, and count its faces.
   ══════════════════════════════════════════════════════════════ */

interface NetState {
  fold: number;
  name: string | null;
  faces: number | null;
}

export function Q32NetFolderActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<NetState>) {
  const cfg = question?.customConfig ?? {};
  const names: string[] = cfg.solidNames ?? [];

  const engine = useActivityEngine<NetState, string>({
    initialState: { fold: 0, name: null, faces: null },
    resolve: (s) =>
      s.fold < 1 || !s.name || s.faces === null
        ? undefined
        : matchText(question, `${s.name}, ${s.faces}`),
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const lift = s.fold;

  return (
    <ActivityShell
      title="Net Folder"
      howTo="Drag the fold control to raise the flat net into a solid. Then name the solid you have made and count how many faces it actually has."
      icon={Boxes}
      answerText={s.fold >= 1 && s.name && s.faces !== null ? `${s.name}, ${s.faces} faces` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={s.fold < 1 ? "Fold the net all the way up" : "Name the solid and count its faces"}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="The net">
          <div className="flex justify-center">
            <svg viewBox="0 0 100 100" className="w-[230px] h-[230px]">
              {/* the central panel stays put; the three outer panels swing upward */}
              <polygon points="30,70 70,70 50,36" fill="#e2e8f0" stroke="#334155" strokeWidth="1.3" />
              {[
                { pts: "10,70 50,70 30,36", ox: 20, oy: 0 },
                { pts: "50,70 90,70 70,36", ox: -20, oy: 0 },
                { pts: "30,36 70,36 50,2", ox: 0, oy: 30 },
              ].map((p, i) => (
                <polygon
                  key={i}
                  points={p.pts}
                  fill="#f8fafc"
                  stroke="#334155"
                  strokeWidth="1.3"
                  style={{
                    transform: `translate(${p.ox * lift}px, ${p.oy * lift}px) scale(${1 - lift * 0.18})`,
                    transformOrigin: "50px 52px",
                    transformBox: "view-box",
                  }}
                />
              ))}
            </svg>
          </div>
          <NumberScale
            min={0}
            max={1}
            step={0.05}
            value={s.fold}
            onChange={(v) => engine.update((p) => ({ ...p, fold: v }))}
            readOnly={engine.readOnly}
            label="Raise the panels"
            format={(v) => `${Math.round(v * 100)}%`}
            ticks={false}
          />
        </Stage>

        <div className="grid sm:grid-cols-2 gap-3">
          <Stage label="Name the solid">
            <div className="flex flex-wrap gap-1.5">
              {names.map((n) => (
                <Tile
                  key={n}
                  active={s.name === n}
                  readOnly={engine.readOnly || s.fold < 1}
                  onClick={() => engine.update((p) => ({ ...p, name: p.name === n ? null : n }))}
                  className="px-2.5 text-[11px]"
                >
                  {n}
                </Tile>
              ))}
            </div>
          </Stage>
          <Stage label="Count the faces">
            <NumberScale
              min={3}
              max={8}
              step={1}
              value={s.faces}
              onChange={(v) => engine.update((p) => ({ ...p, faces: v }))}
              readOnly={engine.readOnly || s.fold < 1}
              label="Number of faces"
            />
          </Stage>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q33 — Divisibility Sorter
   Stack a number's digits yourself, then read the verdict.
   ══════════════════════════════════════════════════════════════ */

interface SorterState {
  selected: string | null;
  added: number;
  committed: string | null;
}

export function Q33DivisibilitySorterActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<SorterState>) {
  const cfg = question?.customConfig ?? {};
  const divisor: number = cfg.divisor ?? 9;
  const candidates: { optionId: string; value: number }[] = cfg.candidates ?? [];

  const digitsOf = (n: number) => String(n).split("").map(Number);

  const engine = useActivityEngine<SorterState, string>({
    initialState: { selected: null, added: 0, committed: null },
    resolve: (s) => {
      if (!s.committed) return undefined;
      const c = candidates.find((x) => x.optionId === s.committed);
      return c ? matchNumber(question, c.value) : undefined;
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const current = candidates.find((c) => c.optionId === s.selected);
  const digits = current ? digitsOf(current.value) : [];
  const stacked = digits.slice(0, s.added);
  const sum = stacked.reduce((a, b) => a + b, 0);
  const complete = current !== undefined && s.added === digits.length;
  const divisible = complete && sum % divisor === 0;

  return (
    <ActivityShell
      title="Divisibility Sorter"
      howTo={`Feed a number in and stack its digits one at a time onto the scale. When every digit is up, the sorter tells you whether the digit sum is a multiple of ${divisor} — then commit the number you choose.`}
      icon={Filter}
      answerText={
        s.committed ? String(candidates.find((c) => c.optionId === s.committed)?.value) : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Test a number and commit your choice"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Numbers waiting">
          <div className="flex flex-wrap gap-1.5">
            {candidates.map((c) => (
              <Tile
                key={c.optionId}
                active={s.selected === c.optionId}
                readOnly={engine.readOnly}
                onClick={() => engine.update((p) => ({ ...p, selected: c.optionId, added: 0 }))}
                className={`px-3 text-sm font-mono ${
                  s.committed === c.optionId ? "ring-2 ring-emerald-500 ring-offset-1" : ""
                }`}
              >
                {c.value}
              </Tile>
            ))}
          </div>
        </Stage>

        {current && (
          <Stage label={`Stacking the digits of ${current.value}`}>
            <div className="flex flex-wrap items-center gap-1.5">
              {digits.map((d, i) => (
                <span
                  key={i}
                  className={`w-10 h-11 rounded-lg border-2 grid place-items-center font-mono text-lg font-black transition ${
                    i < s.added
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-300"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <Tile
                readOnly={engine.readOnly || s.added >= digits.length}
                onClick={() => engine.update((p) => ({ ...p, added: p.added + 1 }))}
                className="px-3 text-[11px]"
              >
                Add next digit
              </Tile>
              <Tile
                readOnly={engine.readOnly || s.added === 0}
                onClick={() => engine.update((p) => ({ ...p, added: 0 }))}
                className="px-3 text-[11px]"
              >
                Clear the scale
              </Tile>
              <Metric label="Digit sum" value={sum} tone={complete ? (divisible ? "emerald" : "amber") : "slate"} />
            </div>
            {complete && (
              <p className="mt-2 text-[11px] font-bold text-slate-700">
                {sum} {divisible ? "is" : "is not"} a multiple of {divisor}, so {current.value}{" "}
                {divisible ? "is" : "is not"} divisible by {divisor}.
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
                {s.committed === current.optionId ? "Committed — tap to withdraw" : "Commit this number"}
              </Tile>
            </div>
          </Stage>
        )}
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q34 — Decimal Network
   Resolve each quadrilateral, then wire every circle to its two neighbours.
   ══════════════════════════════════════════════════════════════ */

interface NetworkState {
  added: Record<string, number>;
  wires: Record<string, string[]>;
  picked: string | null;
}

export function Q34DecimalNetworkActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<NetworkState>) {
  const cfg = question?.customConfig ?? {};
  const nodes: { id: string; expression: string; terms: number[] }[] = cfg.nodes ?? [];
  const circles: { id: string; between: string[] }[] = cfg.circles ?? [];
  const readOrder: string[] = cfg.readOrder ?? [];
  const dp: number = cfg.decimals ?? 3;

  const quadValue = (id: string, added: Record<string, number>) => {
    const n = nodes.find((x) => x.id === id);
    if (!n) return undefined;
    const count = added[id] ?? 0;
    if (count < n.terms.length) return undefined;
    return round(n.terms.reduce((a, b) => a + b, 0), dp);
  };

  const circleValue = (id: string, st: NetworkState) => {
    const wired = st.wires[id] ?? [];
    if (wired.length !== 2) return undefined;
    const a = quadValue(wired[0], st.added);
    const b = quadValue(wired[1], st.added);
    if (a === undefined || b === undefined) return undefined;
    return round(a + b, dp);
  };

  const engine = useActivityEngine<NetworkState, string>({
    initialState: { added: {}, wires: {}, picked: null },
    resolve: (s) => {
      const vals = readOrder.map((id) => circleValue(id, s));
      if (vals.some((v) => v === undefined)) return undefined;
      return matchNumberList(question, vals as number[], 5e-4);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;

  const addTerm = (id: string) =>
    engine.update((p) => {
      const n = nodes.find((x) => x.id === id);
      if (!n) return p;
      const count = Math.min((p.added[id] ?? 0) + 1, n.terms.length);
      return { ...p, added: { ...p.added, [id]: count } };
    });

  const wire = (circleId: string, quadId: string) =>
    engine.update((p) => {
      const cur = p.wires[circleId] ?? [];
      if (cur.includes(quadId)) return { ...p, wires: { ...p.wires, [circleId]: cur.filter((x) => x !== quadId) } };
      const next = cur.length >= 2 ? [cur[1], quadId] : [...cur, quadId];
      return { ...p, wires: { ...p.wires, [circleId]: next } };
    });

  return (
    <ActivityShell
      title="Decimal Network"
      howTo="Work each quadrilateral out by adding its terms one at a time. Then wire every circle to the two quadrilaterals it sits between — each circle lights up with their sum."
      icon={Workflow}
      answerText={
        readOrder.every((id) => circleValue(id, s) !== undefined)
          ? readOrder.map((id) => circleValue(id, s)).join(", ")
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Resolve every quadrilateral and wire every circle"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Quadrilaterals">
          <div className="grid sm:grid-cols-3 gap-2">
            {nodes.map((n) => {
              const count = s.added[n.id] ?? 0;
              const partial = round(n.terms.slice(0, count).reduce((a, b) => a + b, 0), dp);
              const done = count === n.terms.length;
              return (
                <div
                  key={n.id}
                  className={`rounded-xl border-2 p-2.5 ${done ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"}`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{n.id}</div>
                  <div className="font-mono text-[11px] font-bold text-slate-700 mt-0.5">{n.expression}</div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <Tile
                      readOnly={engine.readOnly || done}
                      onClick={() => addTerm(n.id)}
                      className="px-2 text-[10px]"
                    >
                      Add term {Math.min(count + 1, n.terms.length)}
                    </Tile>
                    <Metric label="Running" value={partial.toFixed(dp)} tone={done ? "emerald" : "slate"} />
                  </div>
                </div>
              );
            })}
          </div>
        </Stage>

        <Stage label="Circles">
          <div className="grid sm:grid-cols-3 gap-2">
            {circles.map((c) => {
              const wired = s.wires[c.id] ?? [];
              const v = circleValue(c.id, s);
              return (
                <div
                  key={c.id}
                  className={`rounded-xl border-2 p-2.5 ${v !== undefined ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"}`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-slate-800">{c.id}</span>
                    <span className="font-mono text-sm font-black text-emerald-800">
                      {v === undefined ? "—" : v.toFixed(dp)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {nodes.map((n) => (
                      <Tile
                        key={n.id}
                        active={wired.includes(n.id)}
                        readOnly={engine.readOnly}
                        onClick={() => wire(c.id, n.id)}
                        className="px-2 text-[10px]"
                      >
                        {n.id}
                      </Tile>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    {wired.length}/2 wired
                  </p>
                </div>
              );
            })}
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q35 — Proportion Scales
   Convert to common units, then see which pair of ratios balances.
   ══════════════════════════════════════════════════════════════ */

interface PropState {
  selected: string | null;
  converted: string[];
  committed: string | null;
}

interface Quantity {
  v: number;
  u: string;
}

export function Q35ProportionScalesActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<PropState>) {
  const cfg = question?.customConfig ?? {};
  const candidates: { optionId: string; left: Quantity[]; right: Quantity[] }[] = cfg.candidates ?? [];
  const unitBase: Record<string, number> = cfg.unitBase ?? {};

  const engine = useActivityEngine<PropState, string>({
    initialState: { selected: null, converted: [], committed: null },
    resolve: (s) => s.committed ?? undefined,
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const current = candidates.find((c) => c.optionId === s.selected);
  const isConverted = current ? s.converted.includes(current.optionId) : false;

  const base = (q: Quantity) => q.v * (unitBase[q.u] ?? 1);
  const ratioOf = (pair: Quantity[]) => {
    if (pair.length !== 2) return null;
    const [a, b] = isConverted ? pair.map(base) : pair.map((q) => q.v);
    if (!b) return null;
    const [n, d] = reduceFraction(Math.round(a * 1000), Math.round(b * 1000));
    return { a, b, text: `${n} : ${d}`, value: a / b };
  };

  const lr = current ? ratioOf(current.left) : null;
  const rr = current ? ratioOf(current.right) : null;
  const balanced = lr && rr ? Math.abs(lr.value - rr.value) < 1e-9 : false;

  const show = (q: Quantity) => (isConverted ? `${round(base(q), 4)}` : `${q.v}${q.u === "₹" ? "" : " " + q.u}`);

  return (
    <ActivityShell
      title="Proportion Scales"
      howTo="Load a pair of ratios onto the twin scales. Convert both sides to a common unit first — only then can the scales tell you whether the two ratios are genuinely equal. Commit the pair you choose."
      icon={ScaleIcon}
      answerText={s.committed ? optionLabel(question, s.committed)?.replace(/^Option \w+ — /, "") : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Test a pair and commit your choice"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label="Pairs of ratios">
          <div className="flex flex-wrap gap-1.5">
            {candidates.map((c) => {
              const opt = question?.multipleChoiceConfig?.options.find((o) => o.id === c.optionId);
              return (
                <Tile
                  key={c.optionId}
                  active={s.selected === c.optionId}
                  readOnly={engine.readOnly}
                  onClick={() => engine.update((p) => ({ ...p, selected: c.optionId }))}
                  className={`px-2.5 text-[11px] ${
                    s.committed === c.optionId ? "ring-2 ring-emerald-500 ring-offset-1" : ""
                  }`}
                >
                  {opt?.text ?? c.optionId}
                </Tile>
              );
            })}
          </div>
        </Stage>

        {current && (
          <Stage label="Twin scales">
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                ["First ratio", current.left, lr],
                ["Second ratio", current.right, rr],
              ] as [string, Quantity[], ReturnType<typeof ratioOf>][]).map(([title, pair, r]) => (
                <div key={title} className="rounded-xl border-2 border-slate-200 bg-white p-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</div>
                  <div className="font-mono text-sm font-bold text-slate-800 mt-1">
                    {show(pair[0])} : {show(pair[1])}
                  </div>
                  <div className="mt-1.5">
                    <Metric label="In lowest terms" value={r?.text ?? "—"} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <Tile
                readOnly={engine.readOnly}
                active={isConverted}
                onClick={() =>
                  engine.update((p) => ({
                    ...p,
                    converted: isConverted
                      ? p.converted.filter((x) => x !== current.optionId)
                      : [...p.converted, current.optionId],
                  }))
                }
                className="px-3 text-[11px]"
              >
                {isConverted ? "Converted to common units" : "Convert to common units"}
              </Tile>
              <Metric
                label="Scales"
                value={!isConverted ? "units differ" : balanced ? "balanced" : "tipped"}
                tone={isConverted && balanced ? "emerald" : "slate"}
              />
            </div>

            <Conditions
              items={[
                { id: "conv", label: "Both ratios expressed in the same unit", met: isConverted },
                { id: "bal", label: "The two ratios are equal", met: Boolean(isConverted && balanced) },
              ]}
            />

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
                {s.committed === current.optionId ? "Committed — tap to withdraw" : "Commit this pair"}
              </Tile>
            </div>
          </Stage>
        )}
      </div>
    </ActivityShell>
  );
}

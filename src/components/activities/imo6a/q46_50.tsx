"use client";

import React, { useMemo } from "react";
import { Wrench, ClipboardCheck, BarChart3, Ruler as RulerIcon, Link2 } from "lucide-react";
import { ActivityComponentProps, optionLabel } from "../kit/types";
import { ActivityShell, Stage } from "../kit/ActivityShell";
import { useActivityEngine } from "../kit/useActivityEngine";
import { matchNumber, matchText, reduceFraction, toMixedString, round } from "./shared";
import { NumberScale, Conditions, Tile, Metric } from "./parts";

/* ══════════════════════════════════════════════════════════════
   Q46 — Blank Bench
   Four instruments, one per blank. Each finding fills in one word.
   ══════════════════════════════════════════════════════════════ */

interface BenchState {
  turn: number;
  anglesEqual: boolean | null;
  factorA: number;
  factorB: number;
  multiplied: boolean;
  step: number | null;
}

export function Q46BlankBenchActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<BenchState>) {
  const cfg = question?.customConfig ?? {};
  const blanks: any[] = cfg.blanks ?? [];
  const order: string[] = cfg.readOrder ?? ["P", "Q", "R", "S"];

  /** Fraction of a revolution, named the way the options name it. */
  const turnName = (turn: number) => {
    if (Math.abs(turn - 0.25) < 1e-6) return "One-fourth";
    if (Math.abs(turn - 1 / 3) < 0.01) return "One-third";
    if (Math.abs(turn - 0.5) < 1e-6) return "Half";
    return undefined;
  };

  const engine = useActivityEngine<BenchState, string>({
    initialState: {
      turn: 0,
      anglesEqual: null,
      factorA: -1,
      factorB: -1,
      multiplied: false,
      step: null,
    },
    resolve: (s) => {
      const P = turnName(s.turn);
      const Q = s.anglesEqual === null ? undefined : s.anglesEqual ? "equal" : "different";
      const R = !s.multiplied ? undefined : s.factorA * s.factorB > 0 ? "positive" : "negative";
      const S = s.step === null ? undefined : s.step > 0 ? "successor" : "predecessor";
      const found: Record<string, string | undefined> = { P, Q, R, S };
      const words = order.map((k) => found[k]);
      if (words.some((w) => !w)) return undefined;
      return matchText(question, words.join(", "));
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const degrees = Math.round(s.turn * 360);
  const product = s.factorA * s.factorB;

  const findings: Record<string, string | undefined> = {
    P: turnName(s.turn),
    Q: s.anglesEqual === null ? undefined : s.anglesEqual ? "equal" : "different",
    R: !s.multiplied ? undefined : product > 0 ? "positive" : "negative",
    S: s.step === null ? undefined : s.step > 0 ? "successor" : "predecessor",
  };

  return (
    <ActivityShell
      title="Four-Instrument Bench"
      howTo="Each blank has its own instrument. Turn the revolution dial, gauge a polygon, multiply two negative counters and step along the number track — the bench assembles your four findings into one reading."
      icon={Wrench}
      answerText={order.every((k) => findings[k]) ? order.map((k) => findings[k]).join(", ") : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Work all four instruments"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Stage label={`Blank P — ${blanks[0]?.prompt ?? ""}`}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 80 80" className="w-[96px] h-[96px] shrink-0">
              <circle cx="40" cy="40" r="32" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
              <path
                d={`M 40 40 L 72 40 A 32 32 0 ${s.turn > 0.5 ? 1 : 0} 1 ${
                  40 + 32 * Math.cos(2 * Math.PI * s.turn)
                } ${40 + 32 * Math.sin(2 * Math.PI * s.turn)} Z`}
                fill="#a7f3d0"
                fillOpacity="0.8"
              />
              <line x1="40" y1="40" x2="72" y2="40" stroke="#334155" strokeWidth="2" />
              <line
                x1="40"
                y1="40"
                x2={40 + 32 * Math.cos(2 * Math.PI * s.turn)}
                y2={40 + 32 * Math.sin(2 * Math.PI * s.turn)}
                stroke="#059669"
                strokeWidth="2.5"
              />
              <text x="40" y="74" textAnchor="middle" fontSize="8" fontWeight="800" fill="#475569">
                {degrees}°
              </text>
            </svg>
            <div className="flex-1">
              <NumberScale
                min={0}
                max={1}
                step={1 / 12}
                value={s.turn}
                onChange={(v) => engine.update((p) => ({ ...p, turn: v }))}
                readOnly={engine.readOnly}
                label="Fraction of a revolution"
                format={(v) => `${Math.round(v * 360)}°`}
                ticks={false}
              />
              <Metric label="That turn is" value={findings.P ?? "—"} tone={findings.P ? "emerald" : "slate"} />
            </div>
          </div>
        </Stage>

        <Stage label={`Blank Q — ${blanks[1]?.prompt ?? ""}`}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 80 80" className="w-[90px] h-[90px] shrink-0">
              <polygon
                points={
                  s.anglesEqual === false
                    ? "40,10 70,34 58,70 22,62 12,32"
                    : "40,10 68,30 57,64 23,64 12,30"
                }
                fill="#e0f2fe"
                stroke="#0284c7"
                strokeWidth="2"
              />
            </svg>
            <div className="flex-1 space-y-1.5">
              <p className="text-[11px] text-slate-500 leading-snug">
                All sides are already equal. Set the angles and see whether the figure is regular.
              </p>
              <div className="flex gap-1.5">
                {[
                  [true, "equal"],
                  [false, "different"],
                ].map(([v, label]) => (
                  <Tile
                    key={String(v)}
                    active={s.anglesEqual === v}
                    readOnly={engine.readOnly}
                    onClick={() => engine.update((p) => ({ ...p, anglesEqual: v as boolean }))}
                    className="px-2.5 text-[11px]"
                  >
                    {label as string}
                  </Tile>
                ))}
              </div>
              <Metric
                label="Regular figure?"
                value={s.anglesEqual === null ? "—" : s.anglesEqual ? "yes" : "no"}
                tone={s.anglesEqual ? "emerald" : "slate"}
              />
            </div>
          </div>
        </Stage>

        <Stage label={`Blank R — ${blanks[2]?.prompt ?? ""}`}>
          <div className="grid grid-cols-2 gap-2">
            <NumberScale
              min={-9}
              max={-1}
              step={1}
              value={s.factorA}
              onChange={(v) => engine.update((p) => ({ ...p, factorA: v, multiplied: false }))}
              readOnly={engine.readOnly}
              label="First counter"
              ticks={false}
            />
            <NumberScale
              min={-9}
              max={-1}
              step={1}
              value={s.factorB}
              onChange={(v) => engine.update((p) => ({ ...p, factorB: v, multiplied: false }))}
              readOnly={engine.readOnly}
              label="Second counter"
              ticks={false}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Tile
              active={s.multiplied}
              readOnly={engine.readOnly}
              onClick={() => engine.update((p) => ({ ...p, multiplied: !p.multiplied }))}
              className="px-3 text-[11px]"
            >
              {s.multiplied ? "Multiplied" : "Multiply them"}
            </Tile>
            {s.multiplied && <Metric label="Product" value={product} tone="emerald" />}
            <Metric label="Its sign is" value={findings.R ?? "—"} tone={findings.R ? "emerald" : "slate"} />
          </div>
        </Stage>

        <Stage label={`Blank S — ${blanks[3]?.prompt ?? ""}`}>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[-1, 0, 1].map((o) => (
              <div
                key={o}
                className={`w-14 h-14 rounded-xl border-2 grid place-items-center font-mono text-lg font-black ${
                  (s.step ?? 0) === o && o !== 0
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : o === 0
                    ? "border-slate-500 bg-white text-slate-800"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {o === 0 ? "n" : o > 0 ? "n+1" : "n−1"}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 leading-snug mb-1.5">
            Step to the number that comes just after n.
          </p>
          <div className="flex gap-1.5">
            <Tile
              active={s.step === -1}
              readOnly={engine.readOnly}
              onClick={() => engine.update((p) => ({ ...p, step: -1 }))}
              className="px-3 text-[11px]"
            >
              Step back
            </Tile>
            <Tile
              active={s.step === 1}
              readOnly={engine.readOnly}
              onClick={() => engine.update((p) => ({ ...p, step: 1 }))}
              className="px-3 text-[11px]"
            >
              Step forward
            </Tile>
            <Metric label="That number is the" value={findings.S ?? "—"} tone={findings.S ? "emerald" : "slate"} />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q47 — Truth Bench
   Test each claim on its own apparatus before calling it true or false.
   ══════════════════════════════════════════════════════════════ */

type TF = "T" | "F";

interface TruthState {
  parallelDrawn: boolean;
  leftAdded: number;
  rightAdded: number;
  probePlaced: boolean;
  jumped: boolean;
  verdicts: Record<string, TF | null>;
}

const mixedToNumber = (t: number | number[]) =>
  Array.isArray(t) ? t[0] + t[1] / t[2] : t;

export function Q47TruthBenchActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<TruthState>) {
  const cfg = question?.customConfig ?? {};
  const statements: any[] = cfg.statements ?? [];
  const order: string[] = cfg.readOrder ?? ["i", "ii", "iii", "iv"];

  const scaleCfg = statements.find((x) => x.id === "ii")?.config ?? { left: [], right: [] };
  const jumpCfg = statements.find((x) => x.id === "iv")?.config ?? { start: 0, jump: 0, claimedResult: 0 };

  const engine = useActivityEngine<TruthState, string>({
    initialState: {
      parallelDrawn: false,
      leftAdded: 0,
      rightAdded: 0,
      probePlaced: false,
      jumped: false,
      verdicts: { i: null, ii: null, iii: null, iv: null },
    },
    resolve: (s) => {
      const marks = order.map((id) => s.verdicts[id]);
      if (marks.some((m) => !m)) return undefined;
      return matchText(question, order.map((id, i) => `(${id}) ${marks[i]}`).join(", "));
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;
  const leftTotal = round(
    (scaleCfg.left as (number | number[])[]).slice(0, s.leftAdded).reduce((a: number, b) => a + mixedToNumber(b), 0),
    4
  );
  const rightTotal = round(
    (scaleCfg.right as (number | number[])[]).slice(0, s.rightAdded).reduce((a: number, b) => a + mixedToNumber(b), 0),
    4
  );
  const scaleReady =
    s.leftAdded === (scaleCfg.left as any[]).length && s.rightAdded === (scaleCfg.right as any[]).length;
  const landed = jumpCfg.start + jumpCfg.jump;

  const setVerdict = (id: string, v: TF) =>
    engine.update((p) => ({ ...p, verdicts: { ...p.verdicts, [id]: p.verdicts[id] === v ? null : v } }));

  const Mark = ({ id, locked }: { id: string; locked: boolean }) => (
    <div className="flex items-center gap-1.5 mt-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verdict</span>
      {(["T", "F"] as TF[]).map((v) => (
        <Tile
          key={v}
          active={s.verdicts[id] === v}
          readOnly={engine.readOnly || locked}
          onClick={() => setVerdict(id, v)}
          className="w-11 text-sm"
        >
          {v}
        </Tile>
      ))}
    </div>
  );

  const fmt = (t: number | number[]) => (Array.isArray(t) ? `${t[0]} ${t[1]}/${t[2]}` : String(t));

  return (
    <ActivityShell
      title="Truth Bench"
      howTo="Four claims, four pieces of apparatus. Run each test, then mark that claim true or false — the bench reports the pattern you produced."
      icon={ClipboardCheck}
      answerText={
        order.every((id) => s.verdicts[id])
          ? order.map((id) => `(${id}) ${s.verdicts[id]}`).join(", ")
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Test and mark all four claims"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Stage label="(i) Set-squares and parallel lines">
          <svg viewBox="0 0 100 70" className="w-full bg-white rounded-lg border border-slate-200">
            <line x1="8" y1="58" x2="92" y2="58" stroke="#64748b" strokeWidth="1.6" />
            <polygon points="20,58 44,58 20,34" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.3" />
            {s.parallelDrawn && (
              <>
                <line x1="14" y1="40" x2="86" y2="40" stroke="#059669" strokeWidth="1.6" />
                <line x1="14" y1="24" x2="86" y2="24" stroke="#059669" strokeWidth="1.6" />
                <polygon points="52,58 76,58 52,34" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.3" />
              </>
            )}
          </svg>
          <Tile
            readOnly={engine.readOnly}
            active={s.parallelDrawn}
            onClick={() => engine.update((p) => ({ ...p, parallelDrawn: !p.parallelDrawn }))}
            className="mt-2 px-3 text-[11px]"
          >
            {s.parallelDrawn ? "Lines drawn" : "Slide the set-square along and draw"}
          </Tile>
          <p className="text-[11px] text-slate-600 mt-2">{statements[0]?.text}</p>
          <Mark id="i" locked={!s.parallelDrawn} />
        </Stage>

        <Stage label="(ii) Twin scale">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["Left side", scaleCfg.left, s.leftAdded, "leftAdded", leftTotal],
                ["Right side", scaleCfg.right, s.rightAdded, "rightAdded", rightTotal],
              ] as [string, (number | number[])[], number, "leftAdded" | "rightAdded", number][]
            ).map(([title, terms, added, key, total]) => (
              <div key={title} className="rounded-xl border-2 border-slate-200 bg-white p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {terms.map((t, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-mono font-bold rounded px-1.5 py-0.5 border ${
                        i < added
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}
                    >
                      {fmt(t)}
                    </span>
                  ))}
                </div>
                <Tile
                  readOnly={engine.readOnly || added >= terms.length}
                  onClick={() => engine.update((p) => ({ ...p, [key]: added + 1 } as Partial<TruthState> as TruthState))}
                  className="mt-1.5 px-2 text-[10px] w-full"
                >
                  Add next term
                </Tile>
                <div className="mt-1.5">
                  <Metric label="Total" value={total} tone={added === terms.length ? "emerald" : "slate"} />
                </div>
              </div>
            ))}
          </div>
          {scaleReady && (
            <p className="mt-2 text-[11px] font-bold text-slate-700">
              {leftTotal} {leftTotal > rightTotal ? ">" : leftTotal < rightTotal ? "<" : "="} {rightTotal}
            </p>
          )}
          <p className="text-[11px] text-slate-600 mt-1.5">{statements[1]?.text}</p>
          <Mark id="ii" locked={!scaleReady} />
        </Stage>

        <Stage label="(iii) Integer line — zero against the negatives">
          <div className="relative h-14">
            <div className="absolute left-0 right-0 top-7 h-0.5 bg-slate-400" />
            {[-4, -3, -2, -1, 0, 1, 2].map((v) => (
              <div
                key={v}
                className="absolute top-4"
                style={{ left: `${((v + 4) / 6) * 100}%` }}
              >
                <div className={`w-px h-4 -translate-x-1/2 ${v === 0 ? "bg-emerald-600" : "bg-slate-300"}`} />
                <span className="absolute top-5 -translate-x-1/2 text-[9px] font-mono font-bold text-slate-500">
                  {v}
                </span>
              </div>
            ))}
            {s.probePlaced && (
              <div className="absolute top-0 -translate-x-1/2" style={{ left: `${(4 / 6) * 100}%` }}>
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white grid place-items-center text-[10px] font-black">
                  0
                </span>
              </div>
            )}
          </div>
          <Tile
            readOnly={engine.readOnly}
            active={s.probePlaced}
            onClick={() => engine.update((p) => ({ ...p, probePlaced: !p.probePlaced }))}
            className="mt-1 px-3 text-[11px]"
          >
            {s.probePlaced ? "Zero placed" : "Place zero on the line"}
          </Tile>
          {s.probePlaced && (
            <p className="mt-1.5 text-[11px] font-bold text-slate-700">
              Zero sits to the right of every negative number, so it is greater than all of them.
            </p>
          )}
          <p className="text-[11px] text-slate-600 mt-1.5">{statements[2]?.text}</p>
          <Mark id="iii" locked={!s.probePlaced} />
        </Stage>

        <Stage label="(iv) Integer line — jumping forward">
          <div className="relative h-14">
            <div className="absolute left-0 right-0 top-7 h-0.5 bg-slate-400" />
            {Array.from({ length: 11 }, (_, i) => i - 9).map((v) => (
              <div key={v} className="absolute top-4" style={{ left: `${((v + 9) / 10) * 100}%` }}>
                <div className="w-px h-4 -translate-x-1/2 bg-slate-300" />
                <span className="absolute top-5 -translate-x-1/2 text-[9px] font-mono font-bold text-slate-500">
                  {v}
                </span>
              </div>
            ))}
            <div
              className="absolute top-0 -translate-x-1/2 transition-[left]"
              style={{ left: `${(((s.jumped ? landed : jumpCfg.start) + 9) / 10) * 100}%` }}
            >
              <span className="w-7 h-7 rounded-full bg-sky-600 text-white grid place-items-center text-[10px] font-black">
                {s.jumped ? landed : jumpCfg.start}
              </span>
            </div>
          </div>
          <Tile
            readOnly={engine.readOnly}
            active={s.jumped}
            onClick={() => engine.update((p) => ({ ...p, jumped: !p.jumped }))}
            className="mt-1 px-3 text-[11px]"
          >
            {s.jumped ? `Landed on ${landed}` : `Jump ${jumpCfg.jump} forward from ${jumpCfg.start}`}
          </Tile>
          <p className="text-[11px] text-slate-600 mt-1.5">{statements[3]?.text}</p>
          <Mark id="iv" locked={!s.jumped} />
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q48 — Bar Graph Reader
   Read each bar off the axis yourself, then let the collectors combine them.
   ══════════════════════════════════════════════════════════════ */

interface GraphState {
  readings: Record<string, number | null>;
}

export function Q48BarGraphActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<GraphState>) {
  const cfg = question?.customConfig ?? {};
  const bars: { id: string; value: number }[] = cfg.bars ?? [];
  const yMax: number = cfg.yMax ?? 70;
  const yStep: number = cfg.yStep ?? 10;
  const queries: any[] = cfg.queries ?? [];

  const engine = useActivityEngine<GraphState, string>({
    initialState: { readings: Object.fromEntries(bars.map((b) => [b.id, null])) },
    resolve: (s) => {
      if (bars.some((b) => s.readings[b.id] === null)) return undefined;
      const get = (id: string) => s.readings[id] as number;
      const total = (queries[0]?.of ?? []).reduce((t: number, id: string) => t + get(id), 0);
      const num = (queries[1]?.numerator ?? []).reduce((t: number, id: string) => t + get(id), 0);
      const den = (queries[1]?.denominator ?? []).reduce((t: number, id: string) => t + get(id), 0);
      if (!den) return undefined;
      const [n, d] = reduceFraction(num, den);
      return matchText(question, `${total}, ${n}/${d}`);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { readings } = engine.state;
  const allRead = bars.every((b) => readings[b.id] !== null);
  const get = (id: string) => (readings[id] ?? 0) as number;
  const total = (queries[0]?.of ?? []).reduce((t: number, id: string) => t + get(id), 0);
  const num = (queries[1]?.numerator ?? []).reduce((t: number, id: string) => t + get(id), 0);
  const den = (queries[1]?.denominator ?? []).reduce((t: number, id: string) => t + get(id), 0);
  const [rn, rd] = den ? reduceFraction(num, den) : [0, 0];

  return (
    <ActivityShell
      title="Bar Graph Reader"
      howTo="Read each bar against the axis and record its height with the dial beside it. The two collectors then combine your readings — one totals every brand, the other compares S with P and R together."
      icon={BarChart3}
      answerText={allRead && den ? `${total}, ${rn}/${rd}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Record a reading for every bar"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        <Stage label={cfg.axisLabel ?? "The graph"}>
          <div className="flex gap-2">
            <div className="flex flex-col justify-between h-[180px] text-[9px] font-mono font-bold text-slate-500 pr-1">
              {Array.from({ length: yMax / yStep + 1 }, (_, i) => yMax - i * yStep).map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
            <div className="flex-1 relative h-[180px] border-l-2 border-b-2 border-slate-400">
              {Array.from({ length: yMax / yStep + 1 }, (_, i) => i * yStep).map((v) => (
                <div
                  key={v}
                  className="absolute left-0 right-0 border-t border-dashed border-slate-200"
                  style={{ bottom: `${(v / yMax) * 100}%` }}
                />
              ))}
              <div className="absolute inset-0 flex items-end justify-around px-2">
                {bars.map((b) => (
                  <div key={b.id} className="flex flex-col items-center w-full max-w-[52px]">
                    <div
                      className="w-7 bg-slate-400 border-2 border-slate-600 rounded-t"
                      style={{ height: `${(b.value / yMax) * 180}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-around mt-1 pl-7">
            {bars.map((b) => (
              <span key={b.id} className="text-[11px] font-black text-slate-600 w-full max-w-[52px] text-center">
                {b.id}
              </span>
            ))}
          </div>
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {cfg.categoryLabel}
          </div>
        </Stage>

        <Stage label="Your readings">
          <div className="grid sm:grid-cols-2 gap-2">
            {bars.map((b) => (
              <NumberScale
                key={b.id}
                min={0}
                max={yMax}
                step={5}
                value={readings[b.id] ?? null}
                onChange={(v) => engine.update((p) => ({ readings: { ...p.readings, [b.id]: v } }))}
                readOnly={engine.readOnly}
                label={`Brand ${b.id}`}
                ticks={false}
              />
            ))}
          </div>
        </Stage>

        <Stage label="Collectors">
          <div className="flex flex-wrap gap-1.5">
            <Metric label="Total shirts sold" value={allRead ? total : "—"} tone={allRead ? "emerald" : "slate"} />
            <Metric
              label="S to P and R together"
              value={allRead && den ? `${num}/${den} = ${rn}/${rd}` : "—"}
              tone={allRead ? "emerald" : "slate"}
            />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q49 — Twin Number Lines
   Snap a reader to each marker, then let the panel do the arithmetic.
   ══════════════════════════════════════════════════════════════ */

interface TwinState {
  ticks: Record<string, number | null>;
}

export function Q49TwinNumberLinesActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<TwinState>) {
  const cfg = question?.customConfig ?? {};
  const lines: {
    id: string;
    min: number;
    max: number;
    divisions: number;
    markers: { id: string; num: number; den: number }[];
  }[] = cfg.lines ?? [];

  const allMarkers = lines.flatMap((l) => l.markers.map((m) => ({ ...m, line: l })));

  const engine = useActivityEngine<TwinState, string>({
    initialState: { ticks: Object.fromEntries(allMarkers.map((m) => [m.id, null])) },
    resolve: (s) => {
      if (allMarkers.some((m) => s.ticks[m.id] === null)) return undefined;
      const val = (id: string) => {
        const m = allMarkers.find((x) => x.id === id)!;
        return (s.ticks[id] as number) / m.line.divisions;
      };
      const numerator = val("S") + val("R");
      const denominator = val("P") - val("Q");
      if (!denominator) return undefined;
      return matchNumber(question, numerator / denominator, 1e-6);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const { ticks } = engine.state;
  const allSet = allMarkers.every((m) => ticks[m.id] !== null);
  const valOf = (id: string) => {
    const m = allMarkers.find((x) => x.id === id);
    const t = ticks[id];
    return m && t !== null ? t / m.line.divisions : null;
  };

  const S = valOf("S");
  const P = valOf("P");
  const Q = valOf("Q");
  const R = valOf("R");
  const numer = S !== null && R !== null ? S + R : null;
  const denom = P !== null && Q !== null ? P - Q : null;
  const result = numer !== null && denom ? numer / denom : null;

  return (
    <ActivityShell
      title="Twin Number Lines"
      howTo="Each line is divided differently. Snap the reader under each marker to the tick it sits on, and the expression panel adds, subtracts and divides the exact fractions for you."
      icon={RulerIcon}
      answerText={
        result === null ? undefined : toMixedString(Math.round(result * 1e6), 1e6)
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Read all four markers off their lines"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-3">
        {lines.map((l) => {
          const totalTicks = (l.max - l.min) * l.divisions;
          return (
            <Stage key={l.id} label={`Number line — each unit split into ${l.divisions}`}>
              <div className="relative h-16">
                <div className="absolute left-0 right-0 top-9 h-0.5 bg-slate-400" />
                {Array.from({ length: totalTicks + 1 }, (_, i) => i).map((i) => {
                  const whole = i % l.divisions === 0;
                  return (
                    <div key={i} className="absolute top-6" style={{ left: `${(i / totalTicks) * 100}%` }}>
                      <div className={`w-px -translate-x-1/2 ${whole ? "h-6 bg-slate-500" : "h-3 bg-slate-300"}`} />
                      {whole && (
                        <span className="absolute top-7 -translate-x-1/2 text-[9px] font-mono font-bold text-slate-500">
                          {l.min + i / l.divisions}
                        </span>
                      )}
                    </div>
                  );
                })}
                {l.markers.map((m) => {
                  const frac = m.num / m.den;
                  return (
                    <div
                      key={m.id}
                      className="absolute top-0 -translate-x-1/2"
                      style={{ left: `${((frac - l.min) / (l.max - l.min)) * 100}%` }}
                    >
                      <span className="text-[11px] font-black text-rose-700">{m.id}</span>
                      <div className="w-3 h-3 rounded-full border-2 border-rose-600 bg-white mx-auto" />
                    </div>
                  );
                })}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-1">
                {l.markers.map((m) => (
                  <NumberScale
                    key={m.id}
                    min={0}
                    max={totalTicks}
                    step={1}
                    value={ticks[m.id] ?? null}
                    onChange={(v) => engine.update((p) => ({ ticks: { ...p.ticks, [m.id]: v } }))}
                    readOnly={engine.readOnly}
                    label={`Reader under ${m.id}`}
                    format={(v) => `${v}/${l.divisions}`}
                    ticks={false}
                  />
                ))}
              </div>
            </Stage>
          );
        })}

        <Stage label="Expression panel">
          <div className="flex flex-wrap items-center gap-1.5">
            <Metric label="S + R" value={numer === null ? "—" : round(numer, 4)} />
            <span className="font-black text-slate-400">÷</span>
            <Metric label="P − Q" value={denom === null ? "—" : round(denom, 4)} />
            <span className="font-black text-slate-400">=</span>
            <Metric
              label="Value"
              value={result === null ? "—" : toMixedString(Math.round(result * 1e6), 1e6)}
              tone={allSet ? "emerald" : "slate"}
            />
          </div>
        </Stage>
      </div>
    </ActivityShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   Q50 — Shade and Match
   Shade each figure, read off its ratio, then run a cord to that ratio.
   ══════════════════════════════════════════════════════════════ */

interface MatchState {
  shaded: Record<string, number>;
  pairs: Record<string, string | null>;
}

export function Q50ShadeMatchActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps<MatchState>) {
  const cfg = question?.customConfig ?? {};
  const figures: { id: string; label: string; parts: number; shaded: number }[] = cfg.figures ?? [];
  const ratios: { id: string; text: string }[] = cfg.ratios ?? [];
  const order: string[] = cfg.readOrder ?? figures.map((f) => f.id);

  const engine = useActivityEngine<MatchState, string>({
    initialState: {
      shaded: Object.fromEntries(figures.map((f) => [f.id, 0])),
      pairs: Object.fromEntries(figures.map((f) => [f.id, null])),
    },
    resolve: (s) => {
      if (order.some((id) => !s.pairs[id])) return undefined;
      const text = order.map((id) => `(${id}) → (${s.pairs[id]})`).join(", ");
      return matchText(question, text);
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const s = engine.state;

  const ratioOf = (f: { parts: number }, shaded: number) => {
    const un = f.parts - shaded;
    if (!shaded || !un) return null;
    const [a, b] = reduceFraction(shaded, un);
    return `${a} : ${b}`;
  };

  return (
    <ActivityShell
      title="Shade and Match"
      howTo="Tap the parts of each figure until its shading matches the one printed in Column I. Read the shaded-to-unshaded ratio it produces, then run a cord to that ratio in Column II."
      icon={Link2}
      answerText={
        order.every((id) => s.pairs[id])
          ? order.map((id) => `(${id}) → (${s.pairs[id]})`).join(", ")
          : undefined
      }
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Shade every figure and match it to a ratio"
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="space-y-2.5">
        {figures.map((f) => {
          const shaded = s.shaded[f.id] ?? 0;
          const r = ratioOf(f, shaded);
          const target = f.shaded;
          return (
            <Stage key={f.id} label={`(${f.id}) ${f.label} — ${f.parts} equal parts`}>
              <div className="flex flex-wrap gap-0.5 mb-2">
                {Array.from({ length: f.parts }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={engine.readOnly}
                    onClick={() =>
                      engine.update((p) => ({
                        ...p,
                        shaded: { ...p.shaded, [f.id]: i < (p.shaded[f.id] ?? 0) ? i : i + 1 },
                      }))
                    }
                    className={`w-6 h-6 border transition ${
                      i < shaded
                        ? "bg-slate-500 border-slate-700"
                        : "bg-white border-slate-300 hover:bg-slate-100"
                    }`}
                    aria-label={`Part ${i + 1} of figure ${f.id}`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Metric label="Shaded" value={`${shaded} of ${f.parts}`} tone={shaded === target ? "emerald" : "slate"} />
                <Metric label="Shaded : unshaded" value={r ?? "—"} tone={r ? "emerald" : "slate"} />
                <span className="text-[10px] font-semibold text-slate-400">
                  the printed figure has {target} shaded
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ratios.map((rt) => (
                  <Tile
                    key={rt.id}
                    active={s.pairs[f.id] === rt.id}
                    readOnly={engine.readOnly}
                    onClick={() =>
                      engine.update((p) => ({
                        ...p,
                        pairs: { ...p.pairs, [f.id]: p.pairs[f.id] === rt.id ? null : rt.id },
                      }))
                    }
                    className="px-2.5 text-[11px]"
                  >
                    ({rt.id}) {rt.text}
                  </Tile>
                ))}
              </div>
            </Stage>
          );
        })}
      </div>
    </ActivityShell>
  );
}

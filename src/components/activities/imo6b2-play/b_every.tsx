"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Grid2x2, Armchair, Maximize2, ClipboardCheck, Divide, Spline } from "lucide-react";
import { Question } from "@/types/question";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchNumberList, matchText, reduceFraction } from "../imo6a/shared";
import { usePlay, cfg, Play } from "../imo6a-play/engine";
import { PlayShell, PlayShellProps, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Label3D, Floor } from "../imo6a-play/three";

type ShellProps<W> = { play: Play<W>; question?: Question } & Omit<
  PlayShellProps,
  "derived" | "locked" | "touched" | "readOnly" | "onSubmit" | "onReset" | "question"
>;

function Shell<W>({ play, question, ...rest }: ShellProps<W>) {
  return (
    <PlayShell
      {...rest}
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
    />
  );
}

const inr = (v: number) => `₹ ${v.toLocaleString("en-IN")}`;
const factorise = (n: number) => {
  const out: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) (out.push(p), (m /= p));
  if (m > 1) out.push(m);
  return out;
};

/* ══════════════════════════════════════════════════════════════════════
   Q36 — Courtyard Tiler (2D)
   The student chooses a square tile size and sees it laid along both walls of the
   courtyard; any leftover strip shows in red. Only a tile that fits both walls exactly
   can be laid. The largest tile laid gives 3n, and so n.
   ══════════════════════════════════════════════════════════════════════ */

interface TileWorld {
  side: number;
  laid: number[];
  factors: boolean;
}

export function B36CourtyardTiler({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const L = cfg<number>(question, "lengthCm", 378);
  const Wd = cfg<number>(question, "widthCm", 525);
  const play = usePlay<TileWorld>({
    question,
    initial: { side: 10, laid: [], factors: false },
    derive: (w) => {
      if (!w.laid.length) return { note: "Lay a tile size that fits both walls with nothing left over." };
      const best = Math.max(...w.laid);
      if (best % 3) return { note: `The largest tile laid is ${best} cm, which is not 3n for a whole number n.` };
      return { value: `Largest tile ${best} cm = 3 × ${best / 3}, so n = ${best / 3}`, optionId: matchNumber(question, best / 3) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const gapL = L % w.side;
  const gapW = Wd % w.side;
  const fits = !gapL && !gapW;
  const S = 92 / Math.max(L, Wd);
  const nx = Math.floor(Wd / w.side);
  const ny = Math.floor(L / w.side);
  const drawGrid = nx * ny <= 900;
  const step = (d: number) => play.patch({ side: Math.min(120, Math.max(1, w.side + d)) });

  return (
    <Shell
      play={play}
      question={question}
      title="Courtyard Tiler"
      mission={`The courtyard is ${L} cm by ${Wd} cm. Choose a square tile size: it is laid along both walls, and any strip left over shows in red. Lay tiles only when both walls fit exactly, and find the biggest tile that does. Its side is 3n cm.`}
      icon={Grid2x2}
      dim="2D"
      submitLabel="Submit n"
      live={
        <>
          <Gauge label="Tile" value={`${w.side} cm`} tone="violet" />
          <Gauge label={`Along ${L} cm`} value={gapL ? `${ny} tiles + ${gapL} cm gap` : `${ny} tiles exactly`} tone={gapL ? "rose" : "emerald"} />
          <Gauge label={`Along ${Wd} cm`} value={gapW ? `${nx} tiles + ${gapW} cm gap` : `${nx} tiles exactly`} tone={gapW ? "rose" : "emerald"} />
          <Gauge label="Largest laid" value={w.laid.length ? `${Math.max(...w.laid)} cm` : "—"} tone="amber" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3">
        <div className="rounded-2xl bg-stone-100 border-2 border-stone-300 p-2">
          <svg viewBox={`0 0 100 ${L * S + 8}`} className="w-full max-h-80">
            <rect x={4} y={4} width={Wd * S} height={L * S} fill="#e7e5e4" stroke="#44403c" strokeWidth={0.6} />
            {drawGrid ? (
              Array.from({ length: nx * ny }, (_, k) => (
                <rect key={k} x={4 + (k % nx) * w.side * S} y={4 + Math.floor(k / nx) * w.side * S} width={w.side * S} height={w.side * S} fill={fits ? "#a7f3d0" : "#fde68a"} stroke="#78716c" strokeWidth={0.15} />
              ))
            ) : (
              <rect x={4} y={4} width={nx * w.side * S} height={ny * w.side * S} fill={fits ? "#a7f3d0" : "#fde68a"} />
            )}
            {gapW > 0 && <rect x={4 + nx * w.side * S} y={4} width={gapW * S} height={L * S} fill="#fb7185" opacity={0.8} />}
            {gapL > 0 && <rect x={4} y={4 + ny * w.side * S} width={Wd * S} height={gapL * S} fill="#fb7185" opacity={0.8} />}
          </svg>
          {!drawGrid && <p className="text-[11px] font-semibold text-stone-500">Too many tiles to draw one by one — the tiled area is shaded.</p>}
        </div>
        <div className="space-y-2">
          <Bay label="Tile size" tone="violet">
            <div className="flex flex-wrap gap-1.5">
              {[-10, -1, 1, 10].map((d) => (
                <Btn key={d} disabled={play.readOnly} onClick={() => step(d)}>
                  {d > 0 ? `+${d}` : d} cm
                </Btn>
              ))}
            </div>
            <Btn tone="emerald" className="mt-2 w-full" disabled={play.readOnly || !fits || w.laid.includes(w.side)} onClick={() => play.patch({ laid: [...w.laid, w.side] })}>
              {fits ? (w.laid.includes(w.side) ? "Already laid" : `Lay ${w.side} cm tiles`) : "Leaves a gap — can't lay"}
            </Btn>
          </Bay>
          <Bay label="Tile cutter's notebook">
            <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ factors: !w.factors })}>
              {w.factors ? "Hide" : "Show"} prime blocks of each wall
            </Btn>
            {w.factors && (
              <div className="text-xs font-mono font-bold mt-1 space-y-0.5">
                <div>{L} = {factorise(L).join(" × ")}</div>
                <div>{Wd} = {factorise(Wd).join(" × ")}</div>
              </div>
            )}
            <div className="text-xs font-bold mt-1">Laid so far: {w.laid.length ? w.laid.map((x) => `${x} cm`).join(", ") : "none"}</div>
          </Bay>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — Box Office (2D)
   Each block on the seat map is 50 seats. The student sells seats section by section,
   filling the hall; the gallery takes whatever the other sections leave. The cash box
   total with the hall full is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface SectionSpec {
  label: string;
  seats: number | null;
  price: number;
}
interface OfficeWorld {
  sold: number[];
}

export function B39BoxOffice({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const capacity = cfg<number>(question, "capacity", 0);
  const sections = cfg<SectionSpec[]>(question, "sections", []);
  const BLOCK = 50;
  const play = usePlay<OfficeWorld>({
    question,
    initial: { sold: sections.map(() => 0) },
    derive: (w) => {
      const seats = w.sold.reduce((a, b) => a + b, 0);
      const cash = w.sold.reduce((s, n, i) => s + n * sections[i].price, 0);
      if (seats < capacity) return { note: `Sell every seat: ${seats}/${capacity} sold so far (${inr(cash)}).` };
      const short = sections.findIndex((s, i) => s.seats !== null && w.sold[i] < s.seats);
      if (short >= 0) return { note: `${sections[short].label} still has seats — the other sections are over-sold.` };
      return { value: inr(cash), optionId: matchNumber(question, cash) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const seats = w.sold.reduce((a, b) => a + b, 0);
  const cash = w.sold.reduce((s, n, i) => s + n * sections[i].price, 0);
  const free = capacity - seats;
  const cap = (i: number) => Math.min(sections[i].seats ?? Infinity, w.sold[i] + free);
  const sell = (i: number, n: number) => play.set((p) => ({ sold: p.sold.map((x, j) => (j === i ? Math.max(0, Math.min(cap(i), x + n)) : x)) }));
  const colours = ["#f59e0b", "#94a3b8", "#b45309", "#8b5cf6", "#10b981"];
  const blocks: number[] = [];
  w.sold.forEach((n, i) => blocks.push(...Array(Math.floor(n / BLOCK)).fill(i)));

  return (
    <Shell
      play={play}
      question={question}
      title="Box Office"
      mission={`The hall holds ${capacity} seats. Sell each priced section in full; the gallery gets whatever seats are left. Every block on the seat map is ${BLOCK} seats. When the hall is full, the cash box shows the total collected.`}
      icon={Armchair}
      dim="2D"
      submitLabel="Submit the cash box total"
      live={
        <>
          <Gauge label="Seats sold" value={`${seats}/${capacity}`} tone={seats === capacity ? "emerald" : "violet"} />
          <Gauge label="Seats left" value={free} tone="amber" />
          <Gauge label="Cash box" value={inr(cash)} tone="sky" />
        </>
      }
    >
      <div className="rounded-2xl bg-slate-900 p-2">
        <div className="text-center text-[10px] font-black text-slate-400 tracking-widest mb-1">STAGE</div>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: Math.ceil(capacity / BLOCK) }, (_, k) => (
            <motion.div key={k} layout className="h-6 rounded" style={{ background: blocks[k] !== undefined ? colours[blocks[k] % colours.length] : "#334155" }} />
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mt-2">
        {sections.map((s, i) => (
          <Bay key={s.label} label={`${s.label} · ₹ ${s.price} a seat · ${s.seats === null ? "takes the rest" : `${s.seats} seats`}`}>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-3 h-3 rounded" style={{ background: colours[i % colours.length] }} />
              <span className="font-mono font-black w-12">{w.sold[i]}</span>
              {[-50, 50, 100].map((d) => (
                <Btn key={d} className="px-2" disabled={play.readOnly} onClick={() => sell(i, d)}>
                  {d > 0 ? `+${d}` : d}
                </Btn>
              ))}
              <Btn tone="amber" className="px-2" disabled={play.readOnly || w.sold[i] >= cap(i)} onClick={() => sell(i, Infinity)}>
                {s.seats === null ? "Fill the rest" : "Sell out"}
              </Btn>
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1">
              {w.sold[i]} × ₹ {s.price} = {inr(w.sold[i] * s.price)}
            </div>
          </Bay>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q46 — Growing Rectangle (3D)
   PQRS is a floor slab whose length is locked at twice its breadth. The student sets
   the breadth and grows the slab by 4 cm each way; the new strip shows how much area was
   added. When the added area matches the question, the perimeter of PQRS and the area
   of VWRT are read off the slabs.
   ══════════════════════════════════════════════════════════════════════ */

interface GrowWorld {
  b: number;
  grown: boolean;
}

export function B46GrowingRectangle({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const ratio = cfg<number>(question, "ratio", 2);
  const grow = cfg<number>(question, "grow", 4);
  const target = cfg<number>(question, "increase", 0);
  const play = usePlay<GrowWorld>({
    question,
    initial: { b: 10, grown: false },
    derive: (w) => {
      if (!w.grown) return { note: `Grow the slab by ${grow} cm each way to see the added strip.` };
      const l = ratio * w.b;
      const added = (l + grow) * (w.b + grow) - l * w.b;
      if (Math.abs(added - target) > 1e-9) return { note: `The strip adds ${added} cm², but the question says ${target} cm². Change the breadth.` };
      const per = 2 * (l + w.b);
      const big = (l + grow) * (w.b + grow);
      return { value: `PQRS perimeter ${per} cm, VWRT area ${big} cm²`, optionId: matchNumberList(question, [per, big]) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const l = ratio * w.b;
  const added = (l + grow) * (w.b + grow) - l * w.b;
  const k = 0.1; // scene units per cm
  const GL = (l + grow) * k;
  const GB = (w.b + grow) * k;
  const ox = -GL / 2;
  const oz = -GB / 2;
  const T = 0.18;

  return (
    <Shell
      play={play}
      question={question}
      title="Growing Rectangle"
      mission={`Set the breadth of PQRS — its length stays ${ratio} × the breadth. Press grow to add ${grow} cm to both the length and the breadth, making VWRT. Adjust until the added strip is exactly ${target} cm².`}
      icon={Maximize2}
      dim="3D"
      submitLabel="Submit perimeter and new area"
      live={
        <>
          <Gauge label="PQRS" value={`${l} × ${w.b} = ${l * w.b} cm²`} tone="violet" />
          <Gauge label="Perimeter of PQRS" value={`${2 * (l + w.b)} cm`} />
          <Gauge label="VWRT" value={w.grown ? `${l + grow} × ${w.b + grow} = ${(l + grow) * (w.b + grow)} cm²` : "not grown"} tone="sky" />
          <Gauge label="Added strip" value={w.grown ? `${added} cm²` : "—"} tone={w.grown && Math.abs(added - target) < 1e-9 ? "emerald" : "amber"} />
        </>
      }
    >
      <Stage3D height={320} camera={{ position: [0, Math.max(5, GL * 1.1), Math.max(4.5, GL * 0.9)], fov: 42 }} readOnly={play.readOnly}>
        <Floor size={60} />
        <group position={[ox, 0, oz]}>
          <mesh position={[(l * k) / 2, T / 2, (w.b * k) / 2]} castShadow receiveShadow>
            <boxGeometry args={[l * k, T, w.b * k]} />
            <meshStandardMaterial color="#8b5cf6" />
          </mesh>
          {w.grown && (
            <>
              <mesh position={[l * k + (grow * k) / 2, T / 2, ((w.b + grow) * k) / 2]} castShadow>
                <boxGeometry args={[grow * k, T * 0.9, (w.b + grow) * k]} />
                <meshStandardMaterial color="#fbbf24" />
              </mesh>
              <mesh position={[(l * k) / 2, T / 2, w.b * k + (grow * k) / 2]} castShadow>
                <boxGeometry args={[l * k, T * 0.9, grow * k]} />
                <meshStandardMaterial color="#fbbf24" />
              </mesh>
            </>
          )}
          <Label3D text="R" position={[0, 0.5, 0]} size={[0.5, 0.5]} billboard />
          <Label3D text="S" position={[l * k, 0.5, 0]} size={[0.5, 0.5]} billboard />
          <Label3D text="P" position={[l * k, 0.5, w.b * k]} size={[0.5, 0.5]} billboard />
          <Label3D text="Q" position={[0, 0.5, w.b * k]} size={[0.5, 0.5]} billboard />
          {w.grown && (
            <>
              <Label3D text="T" position={[GL, 0.5, 0]} size={[0.5, 0.5]} billboard style={{ bg: "#fef3c7" }} />
              <Label3D text="V" position={[GL, 0.5, GB]} size={[0.5, 0.5]} billboard style={{ bg: "#fef3c7" }} />
              <Label3D text="W" position={[0, 0.5, GB]} size={[0.5, 0.5]} billboard style={{ bg: "#fef3c7" }} />
            </>
          )}
          <Label3D text={`${l} cm`} position={[(l * k) / 2, 0.35, -0.35]} size={[1.4, 0.45]} billboard style={{ bg: null }} />
          <Label3D text={`${w.b} cm`} position={[-0.55, 0.35, (w.b * k) / 2]} size={[1.4, 0.45]} billboard style={{ bg: null }} />
        </group>
      </Stage3D>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <label className="flex items-center gap-2 text-xs font-bold">
          Breadth of PQRS
          <input type="range" min={5} max={30} step={0.5} value={w.b} disabled={play.readOnly} onChange={(e) => play.patch({ b: Number(e.target.value) })} className="accent-violet-600" />
          <span className="font-mono">{w.b} cm</span>
        </label>
        <div className="flex gap-1">
          {[-0.5, 0.5].map((d) => (
            <Btn key={d} className="px-2" disabled={play.readOnly} onClick={() => play.patch({ b: Math.min(30, Math.max(5, w.b + d)) })}>
              {d > 0 ? "+" : "−"}0.5
            </Btn>
          ))}
        </div>
        <Btn tone={w.grown ? "slate" : "amber"} disabled={play.readOnly} onClick={() => play.patch({ grown: !w.grown })}>
          {w.grown ? "Shrink back to PQRS" : `Grow by ${grow} cm each way`}
        </Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — Claim Checker (2D)
   Each statement gets its own small lab: share a chocolate, mark heights on a number
   line, age two people, line up a subtraction. A lab's result is compared with the
   statement's claim. Once all four labs are run, the one that disagrees is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface LabsCfg {
  A: { a: [number, number]; b: [number, number]; claim: [number, number] };
  B: { peak: number; mine: number; claim: number };
  C: { factor: number; years: number };
  D: { a: number; b: number; claim: number };
}
interface ClaimWorld {
  priya: number[];
  rohan: number[];
  peak: number;
  mine: number;
  x: number;
  years: number;
  xsAged: number[];
  shift: number;
  dDone: boolean;
}

export function B47ClaimChecker({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const labs = cfg<LabsCfg>(question, "labs", {
    A: { a: [2, 3], b: [1, 4], claim: [11, 12] },
    B: { peak: 2450, mine: -350, claim: 2100 },
    C: { factor: 3, years: 5 },
    D: { a: 12.5, b: 7.85, claim: 4.65 },
  });
  const pieces = labs.A.a[1] * labs.A.b[1];
  const [eater, setEater] = useState<"priya" | "rohan">("priya");

  const results = (w: ClaimWorld) => {
    const [pn, pd] = reduceFraction(w.priya.length, pieces);
    const [rn, rd] = reduceFraction(w.rohan.length, pieces);
    const aDone = pn * labs.A.a[1] === labs.A.a[0] * pd && rn * labs.A.b[1] === labs.A.b[0] * rd && w.priya.length > 0 && w.rohan.length > 0;
    const [tn, td] = reduceFraction(w.priya.length + w.rohan.length, pieces);
    const bDone = w.peak === labs.B.peak && w.mine === labs.B.mine;
    const cDone = w.years === labs.C.years && w.xsAged.length >= 2;
    return {
      A: aDone ? { got: `${tn}/${td}`, ok: tn * labs.A.claim[1] === labs.A.claim[0] * td } : null,
      B: bDone ? { got: `${w.peak - w.mine} m`, ok: w.peak - w.mine === labs.B.claim } : null,
      C: cDone ? { got: `${labs.C.factor}x + ${labs.C.years} every time`, ok: true } : null,
      D: w.dDone ? { got: `${+(labs.D.a - labs.D.b).toFixed(3)}`, ok: Math.abs(labs.D.a - labs.D.b - labs.D.claim) < 1e-9 } : null,
    };
  };

  const play = usePlay<ClaimWorld>({
    question,
    initial: { priya: [], rohan: [], peak: 0, mine: 0, x: 8, years: 0, xsAged: [], shift: 1, dDone: false },
    derive: (w) => {
      const r = results(w);
      const done = (Object.keys(r) as (keyof typeof r)[]).filter((k) => r[k]);
      if (done.length < 4) return { note: `Run every lab (${done.length}/4 done).` };
      const wrong = done.filter((k) => !r[k]!.ok);
      if (wrong.length !== 1) return { note: wrong.length ? "More than one claim failed — recheck the labs." : "Every claim checked out — recheck the labs." };
      return { value: `Statement ${wrong[0]}'s claim fails its lab`, optionId: wrong[0] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const r = results(w);
  const Stamp = ({ k }: { k: keyof typeof r }) =>
    r[k] ? (
      <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-black ${r[k]!.ok ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>{r[k]!.ok ? "CLAIM HOLDS" : "CLAIM FAILS"}</span>
    ) : (
      <span className="ml-auto text-[10px] font-bold text-slate-400">not run</span>
    );
  const opt = (id: string) => question?.multipleChoiceConfig?.options.find((o) => o.id === id)?.text ?? "";
  const lineY = (m: number) => 95 - ((m + 500) / 3500) * 90;
  const alignedB = labs.D.b * 10 ** (w.shift - 1);

  return (
    <Shell
      play={play}
      question={question}
      title="Claim Checker"
      mission="Every statement makes a claim. Run the lab beside each one: share the chocolate, mark the heights, age Monika and her father, line up the decimal points. Each lab stamps whether its claim holds. Find the statement whose claim fails."
      icon={ClipboardCheck}
      dim="2D"
      submitLabel="Submit the incorrect statement"
      live={
        <>
          {(["A", "B", "C", "D"] as const).map((k) => (
            <Gauge key={k} label={`Lab ${k}`} value={r[k] ? r[k]!.got : "—"} tone={!r[k] ? "slate" : r[k]!.ok ? "emerald" : "rose"} />
          ))}
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Bay label={<span className="flex items-center gap-2">A · Chocolate <Stamp k="A" /></span>}>
          <p className="text-[11px] text-slate-600 mb-1">{opt("A")}</p>
          <div className="flex gap-1.5 mb-1">
            {(["priya", "rohan"] as const).map((e) => (
              <Btn key={e} className="px-2" active={eater === e} tone={eater === e ? (e === "priya" ? "rose" : "sky") : "slate"} onClick={() => setEater(e)}>
                {e === "priya" ? `Priya eats (${w.priya.length})` : `Rohan eats (${w.rohan.length})`}
              </Btn>
            ))}
          </div>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${labs.A.b[1]}, 1fr)` }}>
            {Array.from({ length: pieces }, (_, i) => {
              const who = w.priya.includes(i) ? "priya" : w.rohan.includes(i) ? "rohan" : null;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={play.readOnly}
                  onClick={() =>
                    play.set((p) => {
                      const other = eater === "priya" ? "rohan" : "priya";
                      if (p[other].includes(i)) return p;
                      return { ...p, [eater]: p[eater].includes(i) ? p[eater].filter((x) => x !== i) : [...p[eater], i] };
                    })
                  }
                  className={`h-7 rounded-sm border ${who === "priya" ? "bg-rose-300 border-rose-500" : who === "rohan" ? "bg-sky-300 border-sky-500" : "bg-amber-800 border-amber-900"}`}
                />
              );
            })}
          </div>
          <p className="text-[11px] font-bold mt-1">
            Priya {reduceFraction(w.priya.length, pieces).join("/")} · Rohan {reduceFraction(w.rohan.length, pieces).join("/")} · together {reduceFraction(w.priya.length + w.rohan.length, pieces).join("/")}
          </p>
        </Bay>

        <Bay label={<span className="flex items-center gap-2">B · Heights <Stamp k="B" /></span>}>
          <p className="text-[11px] text-slate-600 mb-1">{opt("B")}</p>
          <div className="flex gap-2">
            <svg viewBox="0 0 60 100" className="h-36">
              <rect x={0} y={lineY(0)} width={60} height={100 - lineY(0)} fill="#bae6fd" />
              <line x1={30} x2={30} y1={5} y2={95} stroke="#334155" strokeWidth={0.8} />
              {[-500, 0, 1000, 2000, 3000].map((m) => (
                <g key={m}>
                  <line x1={27} x2={33} y1={lineY(m)} y2={lineY(m)} stroke="#334155" strokeWidth={0.6} />
                  <text x={35} y={lineY(m) + 1.5} fontSize={4} fontWeight={700}>
                    {m} m
                  </text>
                </g>
              ))}
              <text x={10} y={lineY(w.peak) + 2} fontSize={7}>⛰️</text>
              <text x={10} y={lineY(w.mine) + 2} fontSize={7}>⛏️</text>
              <line x1={22} x2={22} y1={lineY(w.peak)} y2={lineY(w.mine)} stroke="#dc2626" strokeWidth={1} />
            </svg>
            <div className="space-y-1 text-xs font-bold">
              {(["peak", "mine"] as const).map((k) => (
                <div key={k} className="flex items-center gap-1">
                  <span className="w-10">{k}</span>
                  {[-50, 50, 500].map((d) => (
                    <Btn key={d} className="px-1.5 min-h-[34px]" disabled={play.readOnly} onClick={() => play.patch({ [k]: Math.max(-500, Math.min(3000, w[k] + (k === "mine" ? -d : d))) } as Partial<ClaimWorld>)}>
                      {k === "mine" ? (d > 0 ? `↓${d}` : `↑${-d}`) : d > 0 ? `↑${d}` : `↓${-d}`}
                    </Btn>
                  ))}
                  <span className="font-mono">{w[k]} m</span>
                </div>
              ))}
              <div>Tape between them: {w.peak - w.mine} m</div>
            </div>
          </div>
        </Bay>

        <Bay label={<span className="flex items-center gap-2">C · Ages <Stamp k="C" /></span>}>
          <p className="text-[11px] text-slate-600 mb-1">{opt("C")}</p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            Monika now (x)
            <Btn className="px-2 min-h-[34px]" disabled={play.readOnly || w.x <= 1} onClick={() => play.patch({ x: w.x - 1, years: 0 })}>−</Btn>
            <span className="font-mono">{w.x}</span>
            <Btn className="px-2 min-h-[34px]" disabled={play.readOnly || w.x >= 20} onClick={() => play.patch({ x: w.x + 1, years: 0 })}>+</Btn>
            <Btn className="px-2 min-h-[34px]" tone="amber" disabled={play.readOnly || w.years >= labs.C.years} onClick={() => play.set((p) => {
              const years = p.years + 1;
              return { ...p, years, xsAged: years === labs.C.years && !p.xsAged.includes(p.x) ? [...p.xsAged, p.x] : p.xsAged };
            })}>
              +1 year ({w.years}/{labs.C.years})
            </Btn>
          </div>
          <p className="text-xs font-bold mt-1">
            Monika {w.x + w.years} · Father {labs.C.factor * w.x + w.years} · formula {labs.C.factor}x + {w.years} = {labs.C.factor * w.x + w.years}
          </p>
          <p className="text-[11px] text-slate-500">Age them {labs.C.years} years for at least two different x ({w.xsAged.length}/2).</p>
        </Bay>

        <Bay label={<span className="flex items-center gap-2">D · Subtraction <Stamp k="D" /></span>}>
          <p className="text-[11px] text-slate-600 mb-1">{opt("D")}</p>
          <div className="font-mono font-black text-lg leading-tight text-right w-40 bg-white rounded border p-1">
            <div>{labs.D.a.toFixed(3)}</div>
            <div>− {alignedB.toFixed(3)}</div>
            <div className="border-t">{(labs.D.a - alignedB).toFixed(3)}</div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Btn className="px-2 min-h-[34px]" disabled={play.readOnly || w.shift <= 0} onClick={() => play.patch({ shift: w.shift - 1, dDone: false })}>slide right</Btn>
            <Btn className="px-2 min-h-[34px]" disabled={play.readOnly || w.shift >= 2} onClick={() => play.patch({ shift: w.shift + 1, dDone: false })}>slide left</Btn>
            <Btn className="px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly || w.shift !== 1 || w.dDone} onClick={() => play.patch({ dDone: true })}>
              {w.shift === 1 ? "Points lined up — check" : "Line up the points"}
            </Btn>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — Divisibility Tester (2D)
   The student types numbers into the tester, which lights up divisibility by 5, 6 and 12.
   Statement I is judged true after four multiples of 5 all end in 0 or 5; Statement II
   is judged false as soon as a multiple of 6 is found that 12 does not divide, and true
   only after four multiples of 6 all pass.
   ══════════════════════════════════════════════════════════════════════ */

interface DivWorld {
  n: number;
  tested: number[];
}

export function B48DivisibilityTester({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const verdictOptions = cfg<Record<string, string>>(question, "verdictOptions", {});
  const verdicts = (w: DivWorld) => {
    const m5 = w.tested.filter((n) => n % 5 === 0);
    const bad5 = m5.some((n) => ![0, 5].includes(n % 10));
    const m6 = w.tested.filter((n) => n % 6 === 0);
    const bad6 = m6.some((n) => n % 12 !== 0);
    return [bad5 ? "F" : m5.length >= 4 ? "T" : null, bad6 ? "F" : m6.length >= 4 ? "T" : null] as const;
  };
  const play = usePlay<DivWorld>({
    question,
    initial: { n: 30, tested: [] },
    derive: (w) => {
      const v = verdicts(w);
      if (!v[0] || !v[1]) return { note: "Test more numbers until the tester can judge both statements." };
      return { value: `I ${v[0] === "T" ? "true" : "false"}, II ${v[1] === "T" ? "true" : "false"}`, optionId: verdictOptions[`${v[0]}${v[1]}`] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const v = verdicts(w);
  const lamp = (on: boolean, label: string) => (
    <div className={`px-3 py-2 rounded-xl border-2 text-center font-black text-sm ${on ? "bg-emerald-400 border-emerald-600 text-emerald-950" : "bg-slate-200 border-slate-300 text-slate-500"}`}>{label}</div>
  );
  const setN = (n: number) => play.patch({ n: Math.max(1, Math.min(99999, Math.round(n) || 1)) });

  return (
    <Shell
      play={play}
      question={question}
      title="Divisibility Tester"
      mission="Type a number and test it: the lamps show whether 5, 6 and 12 divide it, and its last digit. Keep testing. Statement I is judged after four multiples of 5; Statement II is judged false as soon as a multiple of 6 slips past 12, or true after four multiples of 6 that all pass."
      icon={Divide}
      dim="2D"
      submitLabel="Submit the verdicts"
      live={
        <>
          <Gauge label="Statement I" value={v[0] ?? `testing (${w.tested.filter((n) => n % 5 === 0).length}/4)`} tone={v[0] === "T" ? "emerald" : v[0] === "F" ? "rose" : "slate"} />
          <Gauge label="Statement II" value={v[1] ?? `testing (${w.tested.filter((n) => n % 6 === 0).length}/4)`} tone={v[1] === "T" ? "emerald" : v[1] === "F" ? "rose" : "slate"} />
          <Gauge label="Numbers tested" value={w.tested.length} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <Bay label="Tester" tone="dark">
          <input
            type="number"
            inputMode="numeric"
            value={w.n}
            disabled={play.readOnly}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full h-12 rounded-lg bg-slate-800 text-white font-mono font-black text-2xl px-3"
            aria-label="Number to test"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[-6, -5, -1, 1, 5, 6].map((d) => (
              <Btn key={d} className="px-2" tone="slate" disabled={play.readOnly} onClick={() => setN(w.n + d)}>
                {d > 0 ? `+${d}` : d}
              </Btn>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {lamp(w.n % 5 === 0, "÷ 5")}
            {lamp(w.n % 6 === 0, "÷ 6")}
            {lamp(w.n % 12 === 0, "÷ 12")}
            <div className="px-3 py-2 rounded-xl border-2 border-slate-600 text-center font-black text-sm">ends {w.n % 10}</div>
          </div>
          <Btn tone="emerald" className="mt-2 w-full" disabled={play.readOnly || w.tested.includes(w.n)} onClick={() => play.patch({ tested: [...w.tested, w.n] })}>
            {w.tested.includes(w.n) ? "Already in the log" : `Log ${w.n}`}
          </Btn>
        </Bay>
        <Bay label="Test log">
          <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
            {w.tested.map((n) => (
              <span key={n} className={`px-1.5 py-0.5 rounded border text-[11px] font-mono font-bold ${n % 6 === 0 && n % 12 !== 0 ? "bg-rose-100 border-rose-300" : "bg-white"}`}>
                {n}
                {n % 5 === 0 ? " ·5" : ""}
                {n % 6 === 0 ? " ·6" : ""}
                {n % 12 === 0 ? " ·12" : ""}
              </span>
            ))}
            {!w.tested.length && <span className="text-xs text-slate-400">nothing logged yet</span>}
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — Geometry Match Lab (2D)
   Four stations, one per row of Column I. P: spin a line pinned at one point and count
   the angles that reach the other point. Q: fire rays from a point until it is clear
   there is always room for another. R: arrange three lines and find the fewest meeting
   points. S: roll a wheel one full turn and name the distance it covers. The four
   station results make the matching.
   ══════════════════════════════════════════════════════════════════════ */

interface MatchWorld {
  pAngle: number;
  pSeen: number[];
  pHits: number[];
  rays: number;
  lines: { a: number; d: number }[];
  rLog: number[];
  roll: number;
  rolledFull: boolean;
}
const NUM_WORD = ["Zero", "One", "Two", "Three"];
const P1: [number, number] = [20, 70];
const P2: [number, number] = [20 + 50 * Math.cos(Math.PI / 6), 70 - 50 * Math.sin(Math.PI / 6)];
function meetPoints(lines: { a: number; d: number }[]) {
  const pts: [number, number][] = [];
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const [A, B] = [lines[i], lines[j]];
      const n1 = [Math.cos(((A.a + 90) * Math.PI) / 180), Math.sin(((A.a + 90) * Math.PI) / 180)];
      const n2 = [Math.cos(((B.a + 90) * Math.PI) / 180), Math.sin(((B.a + 90) * Math.PI) / 180)];
      const det = n1[0] * n2[1] - n1[1] * n2[0];
      if (Math.abs(det) < 1e-9) continue;
      const x = (A.d * n2[1] - B.d * n1[1]) / det;
      const y = (n1[0] * B.d - n2[0] * A.d) / det;
      if (!pts.some((p) => Math.hypot(p[0] - x, p[1] - y) < 0.5)) pts.push([x, y]);
    }
  return pts;
}
const sameLine = (l: { a: number; d: number }[]) => l.some((x, i) => l.some((y, j) => j > i && x.a === y.a && x.d === y.d));

export function B49GeometryMatchLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const results = (w: MatchWorld) => ({
    P: w.pSeen.length >= 36 ? NUM_WORD[w.pHits.length] ?? String(w.pHits.length) : null,
    Q: w.rays >= 12 ? "Infinite" : null,
    R: w.rLog.length >= 3 ? NUM_WORD[Math.min(...w.rLog)] : null,
    S: w.rolledFull ? "Circumference" : null,
  });
  const play = usePlay<MatchWorld>({
    question,
    initial: { pAngle: 0, pSeen: [0], pHits: [], rays: 0, lines: [{ a: 0, d: -10 }, { a: 60, d: 0 }, { a: 120, d: 10 }], rLog: [], roll: 0, rolledFull: false },
    derive: (w) => {
      const r = results(w);
      if (!r.P || !r.Q || !r.R || !r.S) return { note: "Finish every station to fill the matching." };
      const text = `P → ${r.P}, Q → ${r.Q}, R → ${r.R}, S → ${r.S}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const r = results(w);
  const aim = (Math.atan2(-(P2[1] - P1[1]), P2[0] - P1[0]) * 180) / Math.PI;
  const passes = (a: number) => Math.abs(((a - aim + 540) % 180) - 0) < 1e-6 || Math.abs(((a - aim + 540) % 180) - 180) < 1e-6;
  const pRad = (w.pAngle * Math.PI) / 180;
  const meets = meetPoints(w.lines);
  const R0 = 8;
  const rolled = w.roll * 2 * Math.PI * R0;

  return (
    <Shell
      play={play}
      question={question}
      title="Geometry Match Lab"
      mission="Work through the four stations. P: spin the line pinned at A through every angle and count how many pass through B. Q: keep firing rays from O. R: arrange three lines and log how many points they meet in — find the fewest. S: roll the wheel exactly one turn. The results fill in Column II."
      icon={Spline}
      dim="2D"
      submitLabel="Submit the matching"
      live={
        <>
          {(["P", "Q", "R", "S"] as const).map((k) => (
            <Gauge key={k} label={k} value={r[k] ?? "…"} tone={r[k] ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Bay label={`P · lines through two points — ${w.pSeen.length}/36 angles tried`}>
          <svg viewBox="0 0 100 80" className="w-full h-32 bg-white rounded">
            <line x1={P1[0] - 90 * Math.cos(pRad)} y1={P1[1] + 90 * Math.sin(pRad)} x2={P1[0] + 90 * Math.cos(pRad)} y2={P1[1] - 90 * Math.sin(pRad)} stroke={passes(w.pAngle) ? "#16a34a" : "#7c3aed"} strokeWidth={1} />
            <circle cx={P1[0]} cy={P1[1]} r={2} fill="#1e1b4b" />
            <circle cx={P2[0]} cy={P2[1]} r={2} fill="#1e1b4b" />
            <text x={P1[0] - 5} y={P1[1] + 6} fontSize={5} fontWeight={900}>A</text>
            <text x={P2[0] + 3} y={P2[1] - 2} fontSize={5} fontWeight={900}>B</text>
          </svg>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <Btn className="px-2 min-h-[34px]" disabled={play.readOnly} onClick={() => play.set((p) => {
              const a = (p.pAngle + 5) % 180;
              return { ...p, pAngle: a, pSeen: p.pSeen.includes(a) ? p.pSeen : [...p.pSeen, a] };
            })}>
              Spin +5°
            </Btn>
            <span className="font-mono text-xs font-bold">{w.pAngle}°</span>
            <Btn className="px-2 min-h-[34px]" tone="emerald" disabled={play.readOnly || !passes(w.pAngle) || w.pHits.includes(w.pAngle)} onClick={() => play.patch({ pHits: [...w.pHits, w.pAngle] })}>
              Through B — count it
            </Btn>
            <span className="text-xs font-bold">found {w.pHits.length}</span>
          </div>
        </Bay>

        <Bay label={`Q · rays from one point — ${w.rays} fired`}>
          <svg viewBox="-50 -40 100 80" className="w-full h-32 bg-white rounded">
            {Array.from({ length: w.rays }, (_, i) => {
              const a = i * 2.39996;
              return <line key={i} x1={0} y1={0} x2={60 * Math.cos(a)} y2={60 * Math.sin(a)} stroke="#0ea5e9" strokeWidth={0.6} />;
            })}
            <circle r={2} fill="#1e1b4b" />
            <text x={3} y={-3} fontSize={5} fontWeight={900}>O</text>
          </svg>
          <div className="flex items-center gap-2 mt-1">
            <Btn className="px-2 min-h-[34px]" disabled={play.readOnly} onClick={() => play.patch({ rays: w.rays + 1 })}>
              Fire a ray
            </Btn>
            <Btn className="px-2 min-h-[34px]" disabled={play.readOnly} onClick={() => play.patch({ rays: w.rays + 5 })}>
              Fire 5
            </Btn>
            <span className="text-[11px] font-bold text-slate-600">{w.rays >= 12 ? "There is always a gap for one more ray." : "Is there ever no room left?"}</span>
          </div>
        </Bay>

        <Bay label={`R · three lines — ${meets.length} meeting point${meets.length === 1 ? "" : "s"} now`}>
          <svg viewBox="-50 -40 100 80" className="w-full h-32 bg-white rounded">
            {w.lines.map((l, i) => {
              const t = (l.a * Math.PI) / 180;
              const nx = Math.cos(t + Math.PI / 2) * l.d;
              const ny = Math.sin(t + Math.PI / 2) * l.d;
              return <line key={i} x1={nx - 90 * Math.cos(t)} y1={ny - 90 * Math.sin(t)} x2={nx + 90 * Math.cos(t)} y2={ny + 90 * Math.sin(t)} stroke={["#ef4444", "#8b5cf6", "#10b981"][i]} strokeWidth={1} />;
            })}
            {meets.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={1.8} fill="#f59e0b" stroke="#78350f" strokeWidth={0.4} />
            ))}
          </svg>
          <div className="grid grid-cols-3 gap-1 mt-1">
            {w.lines.map((l, i) => (
              <div key={i} className="text-[10px] font-bold space-y-0.5">
                <div style={{ color: ["#ef4444", "#8b5cf6", "#10b981"][i] }}>line {i + 1}</div>
                <div className="flex gap-0.5">
                  <Btn className="px-1.5 min-h-[30px]" disabled={play.readOnly} onClick={() => play.patch({ lines: w.lines.map((x, j) => (j === i ? { ...x, a: (x.a + 30) % 180 } : x)) })}>
                    turn
                  </Btn>
                  <Btn className="px-1.5 min-h-[30px]" disabled={play.readOnly} onClick={() => play.patch({ lines: w.lines.map((x, j) => (j === i ? { ...x, d: x.d >= 20 ? -20 : x.d + 10 } : x)) })}>
                    shift
                  </Btn>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Btn className="px-2 min-h-[34px]" tone="amber" disabled={play.readOnly || sameLine(w.lines)} onClick={() => play.patch({ rLog: [...w.rLog, meets.length] })}>
              {sameLine(w.lines) ? "Two lines are on top of each other" : "Log this arrangement"}
            </Btn>
            <span className="text-[11px] font-bold">log: {w.rLog.join(", ") || "—"} · fewest {w.rLog.length ? Math.min(...w.rLog) : "—"}</span>
          </div>
        </Bay>

        <Bay label="S · roll the wheel">
          <svg viewBox="0 0 100 40" className="w-full h-24 bg-white rounded">
            <line x1={4} x2={96} y1={34} y2={34} stroke="#334155" strokeWidth={0.6} />
            <line x1={6} x2={6 + rolled} y1={34} y2={34} stroke="#f59e0b" strokeWidth={1.6} />
            <g transform={`translate(${6 + rolled} ${34 - R0}) rotate(${w.roll * 360})`}>
              <circle r={R0} fill="#ede9fe" stroke="#5b21b6" strokeWidth={0.8} />
              <line x1={0} y1={0} x2={0} y2={R0} stroke="#dc2626" strokeWidth={0.8} />
            </g>
          </svg>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <label className="flex items-center gap-2 text-xs font-bold">
              turns
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.05}
                value={w.roll}
                disabled={play.readOnly}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  play.set((p) => ({ ...p, roll: v, rolledFull: Math.abs(v - 1) < 1e-9 ? true : p.rolledFull }));
                }}
                className="accent-violet-600"
              />
              <span className="font-mono">{w.roll.toFixed(2)}</span>
            </label>
            <span className="text-[11px] font-bold text-slate-600">
              {Math.abs(w.roll - 1) < 1e-9 ? "One turn: the orange track is the distance around the wheel — its circumference." : `Track: ${w.roll.toFixed(2)} × distance round the wheel`}
            </span>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

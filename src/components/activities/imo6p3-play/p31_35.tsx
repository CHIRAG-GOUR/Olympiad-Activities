"use client";

import React from "react";
import { Thermometer, HardHat, Landmark, CookingPot, Split } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchNumberList, matchText, toMixedString } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, Stepper, polyPath, toggle, r4, Pt } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q31–Q35. */

/* ══════════════════════════════════════════════════════════════════════
   Q31 — Weather Observatory
   The student slides the cursor from day to day; the observatory measures each change.
   After every change is measured, the student flags the day with the biggest rise.
   ══════════════════════════════════════════════════════════════════════ */

export function Q31WeatherObservatoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const days = cfg<{ d: string; t: number }[]>(question, "days", []);
  const play = usePlay<{ at: number; seen: number[]; flag: number | null }>({
    question,
    initial: { at: 0, seen: [], flag: null },
    derive: (w) => {
      if (w.seen.length < days.length - 1) return { note: `Measure every day-to-day change (${w.seen.length}/${days.length - 1}).` };
      if (w.flag === null) return { note: "Flag the day with the biggest rise." };
      const ch = days[w.flag].t - days[w.flag - 1].t;
      return { value: `${days[w.flag].d}: ${ch > 0 ? "+" : ""}${ch} °C`, optionId: matchText(question, days[w.flag].d) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const Y = (t: number) => 38 - t * 1.4;
  const X = (i: number) => 10 + i * 14;
  const move = (i: number) => play.set((p) => ({ ...p, at: i, seen: i > 0 && !p.seen.includes(i) ? [...p.seen, i] : p.seen }));

  return (
    <Shell
      play={play}
      question={question}
      title="Weather Observatory"
      mission="Slide the cursor to each day; the observatory measures the change from the day before. When every change is measured, flag the day with the greatest rise."
      icon={Thermometer}
      dim="2D"
      submitLabel="Submit the day"
      hints={["A rise from a negative temperature counts the degrees below zero too: from −6 °C to 0 °C is a rise of 6."]}
      live={<Gauge label={days[w.at]?.d ?? ""} value={w.at ? `${days[w.at].t - days[w.at - 1].t > 0 ? "+" : ""}${days[w.at].t - days[w.at - 1].t} °C from ${days[w.at - 1].d}` : `${days[0]?.t} °C (start)`} tone="violet" />}
    >
      <svg viewBox="0 0 110 70" className="w-full max-h-72 bg-sky-50 rounded-xl border-2 border-sky-100">
        <line x1={5} x2={105} y1={Y(0)} y2={Y(0)} stroke="#94a3b8" strokeWidth={0.4} />
        <text x={4} y={Y(0) - 1} fontSize={3}>0°</text>
        <polyline points={days.map((d, i) => `${X(i)},${Y(d.t)}`).join(" ")} fill="none" stroke="#0369a1" strokeWidth={0.8} />
        {days.map((d, i) => (
          <g key={d.d}>
            <circle cx={X(i)} cy={Y(d.t)} r={1.6} fill={w.flag === i ? "#dc2626" : "#0369a1"} />
            <text x={X(i)} y={68} fontSize={3.6} textAnchor="middle" fontWeight={900}>{d.d.slice(0, 3)}</text>
            <text x={X(i)} y={Y(d.t) - 3} fontSize={3.2} textAnchor="middle">{d.t}°</text>
          </g>
        ))}
        {w.at > 0 && <line x1={X(w.at)} x2={X(w.at)} y1={Y(days[w.at - 1].t)} y2={Y(days[w.at].t)} stroke="#f59e0b" strokeWidth={1.4} />}
        <line x1={X(w.at)} x2={X(w.at)} y1={2} y2={64} stroke="#7c3aed" strokeWidth={0.4} strokeDasharray="1 1" />
      </svg>
      <input type="range" min={0} max={days.length - 1} value={w.at} disabled={play.readOnly} aria-label="day cursor" onChange={(e) => move(Number(e.target.value))} className="w-full accent-violet-600" />
      <div className="flex flex-wrap gap-1">
        {days.slice(1).map((d, k) => (
          <Btn key={d.d} className="px-2 min-h-[32px] text-[11px]" tone={w.flag === k + 1 ? "rose" : "slate"} active={w.flag === k + 1} disabled={play.readOnly || w.seen.length < days.length - 1} onClick={() => play.patch({ flag: k + 1 })} ariaLabel={`flag ${d.d}`}>
            🚩 {d.d.slice(0, 3)}
          </Btn>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — Construction Foreman
   The student picks a plan that splits the slab into rectangles. For each piece the tape
   is set to its length and breadth (it turns green only when it fits that piece), then the
   piece is poured. The slab's area is everything poured.
   ══════════════════════════════════════════════════════════════════════ */

type Piece = [number, number, number, number];

export function Q32ConstructionForemanActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const outline = cfg<Pt[]>(question, "outline", []);
  const labels = cfg<{ at: Pt; text: string }[]>(question, "labels", []);
  const cuts = cfg<{ id: string; label: string; pieces: Piece[] }[]>(question, "cuts", []);
  const play = usePlay<{ cut: string | null; dims: Record<number, [number, number]>; poured: number[] }>({
    question,
    initial: { cut: null, dims: {}, poured: [] },
    derive: (w) => {
      const c = cuts.find((x) => x.id === w.cut);
      if (!c) return { note: "Choose how to split the slab." };
      if (w.poured.length < c.pieces.length) return { note: `Measure and pour every piece (${w.poured.length}/${c.pieces.length}).` };
      const a = r4(w.poured.reduce((s, i) => s + (w.dims[i]?.[0] ?? 0) * (w.dims[i]?.[1] ?? 0), 0));
      return { value: `${a} cm²`, optionId: matchNumber(question, a, 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const c = cuts.find((x) => x.id === w.cut);
  const K = 10;
  const W = Math.max(...outline.map((p) => p[0]), 1);
  const H = Math.max(...outline.map((p) => p[1]), 1);
  const colours = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6"];
  const poured = r4(w.poured.reduce((s, i) => s + (w.dims[i]?.[0] ?? 0) * (w.dims[i]?.[1] ?? 0), 0));

  return (
    <Shell
      play={play}
      question={question}
      title="Construction Foreman"
      mission="Choose a plan that splits the slab into rectangles. For each piece set the tape to its length and breadth — the tape turns green when it fits the piece — then pour it. The slab's area is everything poured."
      icon={HardHat}
      dim="2D"
      submitLabel="Submit the area"
      hints={["Find the unlabelled sides first: the whole height is 5 + 0.5 + 2.5 = 8 cm, so the long right side is 8 − 1 = 7 cm.", "The figure is not drawn to scale — trust the labels."]}
      live={<Gauge label="Poured" value={`${poured} cm²`} tone="violet" />}
    >
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-3">
        <Board>
          <svg viewBox={`-14 -8 ${W * K + 30} ${H * K + 16}`} className="w-full max-h-80">
            <path d={polyPath(outline.map(([x, y]) => [x * K, (H - y) * K]))} fill="#f5f5f4" stroke="#1c1917" strokeWidth={0.7} />
            {c?.pieces.map(([x, y, pw, ph], i) => (
              <rect key={i} x={x * K} y={(H - y - ph) * K} width={pw * K} height={ph * K} fill={w.poured.includes(i) ? "#a8a29e" : colours[i % colours.length]} opacity={0.75} stroke="#1c1917" strokeWidth={0.4} />
            ))}
            {labels.map((l, i) => (
              <text key={i} x={l.at[0] * K} y={(H - l.at[1]) * K} fontSize={4} textAnchor="middle" fontWeight={700}>
                {l.text}
              </text>
            ))}
          </svg>
        </Board>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {cuts.map((x) => (
              <Btn key={x.id} active={w.cut === x.id} tone={w.cut === x.id ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set({ cut: x.id, dims: {}, poured: [] })}>
                {x.label}
              </Btn>
            ))}
          </div>
          {c?.pieces.map(([, , pw, ph], i) => {
            const d = w.dims[i] ?? [1, 1];
            const ok = (d[0] === pw && d[1] === ph) || (d[0] === ph && d[1] === pw);
            const set = (k: 0 | 1, v: number) => play.set((p) => ({ ...p, poured: p.poured.filter((x) => x !== i), dims: { ...p.dims, [i]: (k === 0 ? [v, d[1]] : [d[0], v]) as [number, number] } }));
            return (
              <Bay key={i} label={`Piece ${i + 1}`} tone={ok ? "violet" : "slate"}>
                <Stepper label={`piece ${i + 1} length`} value={d[0]} min={0.5} max={10} steps={[0.5]} disabled={play.readOnly} onStep={(s) => set(0, d[0] + s)} unit=" cm" />
                <Stepper label={`piece ${i + 1} breadth`} value={d[1]} min={0.5} max={10} steps={[0.5]} disabled={play.readOnly} onStep={(s) => set(1, d[1] + s)} unit=" cm" />
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-black ${ok ? "text-emerald-700" : "text-slate-500"}`}>{ok ? "tape fits ✓" : "tape doesn't fit yet"}</span>
                  <Btn tone="amber" className="ml-auto" disabled={play.readOnly || !ok || w.poured.includes(i)} onClick={() => play.patch({ poured: [...w.poured, i], dims: { ...w.dims, [i]: d } })} ariaLabel={`pour piece ${i + 1}`}>
                    Pour {d[0]} × {d[1]}
                  </Btn>
                </div>
              </Bay>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — Roman Numeral Decoder
   Each claim's numeral is laid out as tiles. The student sets every tile to add or to take
   away and decodes; the machine compares the total with the claim.
   ══════════════════════════════════════════════════════════════════════ */

const ROMAN: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

export function Q33RomanDecoderActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const claims = (question?.multipleChoiceConfig?.options ?? []).map((o) => {
    const [r, n] = o.text.split(/\s+[-–=]\s+/).map((s) => s.trim());
    return { id: o.id, text: o.text, roman: r, claim: Number((n ?? "0").replace(/,/g, "")) };
  });
  type RW = { minus: Record<string, number[]>; decoded: string[]; flagged: string | null };
  const total = (w: RW, c: (typeof claims)[number]) => c.roman.split("").reduce((s, ch, i) => s + ((w.minus[c.id] ?? []).includes(i) ? -1 : 1) * ROMAN[ch], 0);
  const play = usePlay<RW>({
    question,
    initial: { minus: {}, decoded: [], flagged: null },
    derive: (w) => {
      if (w.decoded.length < claims.length) return { note: `Decode every numeral (${w.decoded.length}/${claims.length}).` };
      if (!w.flagged) return { note: "Flag the claim that is wrong." };
      const c = claims.find((x) => x.id === w.flagged)!;
      return { value: `${c.roman} decodes to ${total(w, c)}; the claim says ${c.claim}`, optionId: matchText(question, c.text) };
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
      title="Roman Numeral Decoder"
      mission="Tap a tile to switch it between adding and taking away — a smaller symbol written just before a larger one is taken away. Decode every numeral, compare it with its claim, then flag the claim that is wrong."
      icon={Landmark}
      dim="2D"
      submitLabel="Submit the incorrect option"
      hints={["In CM, XL, XC and IX the first symbol is taken away.", "L is 50 and X is 10."]}
      live={<Gauge label="Decoded" value={w.decoded.map((id) => `${id} → ${total(w, claims.find((c) => c.id === id)!)}`).join(" · ") || "—"} tone="violet" />}
    >
      <div className="space-y-2">
        {claims.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-1 rounded-xl border-2 border-slate-200 p-2 bg-white">
            <span className="font-black w-6">{c.id}</span>
            {c.roman.split("").map((ch, i) => {
              const neg = (w.minus[c.id] ?? []).includes(i);
              return (
                <button key={i} type="button" disabled={play.readOnly} aria-label={`${c.id} tile ${i + 1}`} onClick={() => play.set((p) => ({ ...p, flagged: null, decoded: p.decoded.filter((x) => x !== c.id), minus: { ...p.minus, [c.id]: toggle(p.minus[c.id] ?? [], i) } }))} className={`w-9 h-11 rounded-lg font-serif font-black text-xl border-2 ${neg ? "bg-rose-100 border-rose-400" : "bg-amber-50 border-amber-300"}`}>
                  {ch}
                  <span className="block text-[9px] font-sans">
                    {neg ? "−" : "+"}
                    {ROMAN[ch]}
                  </span>
                </button>
              );
            })}
            <span className="font-mono text-sm ml-2">claim {c.claim}</span>
            <Btn className="ml-auto px-2" tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ decoded: Array.from(new Set([...w.decoded, c.id])) })} ariaLabel={`decode ${c.id}`}>
              Decode → {total(w, c)}
            </Btn>
            <Btn className="px-2" tone={w.flagged === c.id ? "rose" : "slate"} active={w.flagged === c.id} disabled={play.readOnly || w.decoded.length < claims.length} onClick={() => play.patch({ flagged: c.id })} ariaLabel={`flag ${c.id}`}>
              🚩
            </Btn>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — Fraction Mixer
   The student picks a jug marked in equal pieces; it works only if every fraction splits
   evenly into those pieces. Containers are poured in or taken out, then the mixture is
   reduced.
   ══════════════════════════════════════════════════════════════════════ */

export function Q34FractionMixerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const terms = cfg<{ sign: number; whole: number; num: number; den: number }[]>(question, "terms", []);
  const trays = cfg<number[]>(question, "trays", []);
  const pieces = (t: (typeof terms)[number], d: number) => ((t.whole * t.den + t.num) * d) / t.den;
  const play = usePlay<{ jug: number | null; done: number[]; reduced: boolean }>({
    question,
    initial: { jug: null, done: [], reduced: false },
    derive: (w) => {
      if (!w.jug) return { note: "Choose a common-denominator jug." };
      if (w.done.length < terms.length) return { note: "Pour in or take out every container." };
      if (!w.reduced) return { note: "Reduce the mixture." };
      const n = w.done.reduce((s, i) => s + terms[i].sign * pieces(terms[i], w.jug!), 0);
      const t = toMixedString(n, w.jug);
      return { value: t, optionId: matchText(question, t) ?? matchNumber(question, n / w.jug, 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const fits = (d: number) => terms.every((t) => d % t.den === 0);
  const n = w.jug ? w.done.reduce((s, i) => s + terms[i].sign * pieces(terms[i], w.jug!), 0) : 0;

  return (
    <Shell
      play={play}
      question={question}
      title="Fraction Mixer"
      mission="Pick a jug marked in equal pieces. It only works if every fraction splits evenly into those pieces. Pour in the containers that are added, take out the ones that are subtracted, then reduce the mixture."
      icon={CookingPot}
      dim="2D"
      submitLabel="Submit the mixture"
      hints={["The jug's pieces must be a common multiple of 3, 9 and 5.", "Change each mixed number to an improper fraction before pouring."]}
      live={<Gauge label="In the jug" value={w.jug ? `${n}/${w.jug}${w.reduced ? ` = ${toMixedString(n, w.jug)}` : ""}` : "—"} tone="violet" />}
    >
      <div className="flex flex-wrap gap-1.5">
        {trays.map((d) => (
          <Btn key={d} active={w.jug === d} tone={w.jug === d ? "violet" : "slate"} disabled={play.readOnly} onClick={() => fits(d) && play.set({ jug: d, done: [], reduced: false })} ariaLabel={`jug ${d}`}>
            jug of 1/{d} pieces {fits(d) ? "" : "✗"}
          </Btn>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {terms.map((t, i) => (
          <Bay key={i} label={`${t.sign < 0 ? "subtract" : "add"} ${t.whole ? `${t.whole} ` : ""}${t.num}/${t.den}`}>
            <div className="font-mono text-sm">{w.jug ? `= ${pieces(t, w.jug)} pieces` : "choose a jug"}</div>
            <Btn className="mt-1 w-full" tone={t.sign < 0 ? "rose" : "emerald"} disabled={play.readOnly || !w.jug || w.done.includes(i)} onClick={() => play.patch({ done: [...w.done, i], reduced: false })} ariaLabel={`container ${i + 1}`}>
              {t.sign < 0 ? "Take out" : "Pour in"}
            </Btn>
          </Bay>
        ))}
      </div>
      <Btn tone="amber" disabled={play.readOnly || !w.jug || w.done.length < terms.length} onClick={() => play.patch({ reduced: true })}>
        🥄 Reduce the mixture
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — Fair Share Factory
   The student sets the first part; the factory makes the other two so that the three
   weighted parts are equal. The containers are weighed together against the total.
   ══════════════════════════════════════════════════════════════════════ */

export function Q35FairShareActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = cfg<number>(question, "total", 0);
  const [m1, m2, m3] = cfg<[number, number, number]>(question, "mult", [1, 1, 1]);
  const play = usePlay<{ a: number }>({
    question,
    initial: { a: 300 },
    derive: (w) => {
      const b = (m1 * w.a) / m2;
      const c = (m1 * w.a) / m3;
      if (!Number.isInteger(b) || !Number.isInteger(c)) return { note: "The other parts would not be whole." };
      if (w.a + b + c !== total) return { note: `The three parts make ${w.a + b + c}, not ${total}.` };
      return { value: `${w.a}, ${b}, ${c}`, optionId: matchNumberList(question, [w.a, b, c]) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const b = (m1 * w.a) / m2;
  const c = (m1 * w.a) / m3;
  const sum = w.a + b + c;

  return (
    <Shell
      play={play}
      question={question}
      title="Fair Share Factory"
      mission={`Set the first part. The factory fills the other containers so that ${m1} × first = ${m2} × second = ${m3} × third. Adjust until the three containers hold exactly ${total} together.`}
      icon={Split}
      dim="2D"
      submitLabel="Submit the three parts"
      hints={["The first part must be a multiple of both 3 and 5 for the others to be whole.", "If the total is too big, lower the first part; if too small, raise it."]}
      live={<Gauge label="Together" value={+sum.toFixed(2)} tone={sum === total ? "emerald" : "amber"} />}
    >
      <Stepper label="First part" value={w.a} min={1} max={total} steps={[1, 10, 100]} disabled={play.readOnly} onStep={(d) => play.patch({ a: w.a + d })} />
      <div className="grid grid-cols-3 gap-2">
        {[w.a, b, c].map((v, i) => (
          <div key={i} className="rounded-xl bg-violet-50 border-2 border-violet-200 p-2 text-center">
            <div className="text-[10px] font-black">part {i + 1} × {[m1, m2, m3][i]}</div>
            <div className={`font-mono text-2xl font-black ${Number.isInteger(v) ? "" : "text-rose-600"}`}>{+v.toFixed(2)}</div>
            <div className="text-[10px] font-bold">= {+(v * [m1, m2, m3][i]).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

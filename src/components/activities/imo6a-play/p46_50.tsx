"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { FlaskRound, Wrench, Shirt, Gem, Landmark } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, reduceFraction, toMixedString, round } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, Label3D, approach, Floor } from "./three";

function StationTabs<T extends string>({ ids, labels, active, done, onPick, readOnly }: { ids: T[]; labels: Record<T, string>; active: T; done: Record<string, unknown>; onPick: (id: T) => void; readOnly?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <Btn key={id} active={active === id} disabled={readOnly} onClick={() => onPick(id)}>
          {done[id] ? "✅" : "⬜"} {labels[id]}
        </Btn>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q46 — Mathematical Truth Laboratory (2D)
   Four experiments, one per blank. A revolution dial, a polygon gauge, a sign multiplier
   and a number-line frog. Each experiment records the word its outcome supports; the four
   records together fill the blanks.
   ══════════════════════════════════════════════════════════════════════ */

interface TruthWorld {
  station: "P" | "Q" | "R" | "S";
  angle: number;
  skew: number;
  a: number;
  b: number;
  frogAt: number;
  records: Record<string, string>;
}
const FROG_START = 7;
const TURN_WORD: Record<string, string> = { "1/4": "One-fourth", "1/3": "One-third", "1/2": "Half" };

export function Q46TruthLaboratory({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const blanks = cfg<{ id: string; prompt: string }[]>(question, "blanks", []);
  const order = cfg<string[]>(question, "readOrder", ["P", "Q", "R", "S"]);
  const dialRef = useRef<SVGSVGElement>(null);

  const play = usePlay<TruthWorld>({
    question,
    initial: { station: "P", angle: 0, skew: 60, a: 1, b: 1, frogAt: FROG_START, records: {} },
    derive: (w) => {
      if (order.some((k) => !w.records[k])) return { note: `Finish all four experiments (${order.filter((k) => w.records[k]).length}/4 recorded).` };
      const text = order.map((k) => w.records[k]).join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const prompt = (id: string) => blanks.find((b) => b.id === id)?.prompt;
  const [n, d] = reduceFraction(w.angle, 360);
  const frac = w.angle ? `${n}/${d}` : "0";
  const record = (id: string, word: string) => play.set((p) => ({ ...p, records: { ...p.records, [id]: word } }));

  const dial = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const r = dialRef.current?.getBoundingClientRect();
      if (!r) return;
      const a = (Math.atan2(r.top + r.height / 2 - p.y, p.x - (r.left + r.width / 2)) * 180) / Math.PI;
      const deg = Math.round(((a + 360) % 360) / 15) * 15;
      if (deg !== w.angle) play.patch({ angle: deg % 360 });
    },
  });
  const arc = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    const x = 50 + 36 * Math.cos(rad);
    const y = 50 - 36 * Math.sin(rad);
    return `M 50 50 L 86 50 A 36 36 0 ${deg > 180 ? 1 : 0} 0 ${x} ${y} Z`;
  };

  // Rhombus with equal sides; `skew` is one interior angle.
  const rh = (() => {
    const s = 34;
    const t = (w.skew * Math.PI) / 180;
    const p0 = [20, 70];
    const p1 = [20 + s, 70];
    const p2 = [20 + s + s * Math.cos(t), 70 - s * Math.sin(t)];
    const p3 = [20 + s * Math.cos(t), 70 - s * Math.sin(t)];
    return [p0, p1, p2, p3].map((p) => p.join(",")).join(" ");
  })();
  const angles = [w.skew, 180 - w.skew, w.skew, 180 - w.skew];
  const product = w.a * w.b;

  return (
    <PlayShell
      title="Mathematical Truth Laboratory"
      mission="Run the four experiments. P: drag the dial arm to make a right angle. Q: skew the equal-sided figure until it is regular. R: multiply two negative counters. S: hop the frog to the number just after 7. Record each result; the lab fills the blanks from your records."
      icon={FlaskRound}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the four blanks"
      live={
        <>
          {order.map((k) => (
            <Gauge key={k} label={`Blank ${k}`} value={w.records[k] ?? "—"} tone={w.records[k] ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <StationTabs
        ids={["P", "Q", "R", "S"] as const as unknown as ("P" | "Q" | "R" | "S")[]}
        labels={{ P: "P · revolution dial", Q: "Q · polygon gauge", R: "R · sign multiplier", S: "S · number frog" }}
        active={w.station}
        done={w.records}
        readOnly={play.readOnly}
        onPick={(station) => play.patch({ station })}
      />
      <Bay label={prompt(w.station) ?? w.station} tone="violet">
        {w.station === "P" && (
          <div className="flex flex-wrap items-center gap-4">
            <svg ref={dialRef} viewBox="0 0 100 100" className="w-44 h-44 bg-white rounded-full border-2 border-violet-200" style={{ touchAction: "none" }} onPointerDown={(e) => dial.start(e, undefined)}>
              <circle cx={50} cy={50} r={36} fill="none" stroke="#e2e8f0" strokeWidth={1.2} />
              {w.angle > 0 && <path d={arc(w.angle)} fill="#c4b5fd" fillOpacity={0.6} />}
              <line x1={50} y1={50} x2={86} y2={50} stroke="#1e1b4b" strokeWidth={1.6} />
              <line x1={50} y1={50} x2={50 + 36 * Math.cos((w.angle * Math.PI) / 180)} y2={50 - 36 * Math.sin((w.angle * Math.PI) / 180)} stroke="#7c3aed" strokeWidth={2.2} />
              <circle cx={50 + 36 * Math.cos((w.angle * Math.PI) / 180)} cy={50 - 36 * Math.sin((w.angle * Math.PI) / 180)} r={4} fill="#7c3aed" stroke="#fff" />
            </svg>
            <div className="space-y-2">
              <div className="font-mono text-2xl font-black">{w.angle}°</div>
              <div className="text-sm font-bold text-slate-700">
                = {frac} of a full revolution (360°)
              </div>
              <Btn tone="emerald" active disabled={play.readOnly || !TURN_WORD[frac]} onClick={() => record("P", TURN_WORD[frac])}>
                Record: this is a right angle
              </Btn>
            </div>
          </div>
        )}
        {w.station === "Q" && (
          <div className="flex flex-wrap items-center gap-4">
            <svg viewBox="0 0 120 80" className="w-56 bg-white rounded-xl border border-slate-200">
              <polygon points={rh} fill="#ddd6fe" stroke="#6d28d9" strokeWidth={1.2} />
            </svg>
            <div className="space-y-2 min-w-[180px]">
              <div className="text-[11px] font-bold text-slate-600">All four sides: 34 units (equal)</div>
              <div className="text-[11px] font-bold text-slate-600">Angles: {angles.map((a) => `${a}°`).join(", ")}</div>
              <input type="range" min={30} max={90} step={5} value={w.skew} disabled={play.readOnly} onChange={(e) => play.patch({ skew: Number(e.target.value) })} className="w-full accent-violet-600" aria-label="skew" />
              <Btn tone="emerald" active disabled={play.readOnly} onClick={() => record("Q", angles.every((a) => a === angles[0]) ? "equal" : "different")}>
                Register this as a regular closed figure
              </Btn>
            </div>
          </div>
        )}
        {w.station === "R" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 font-mono text-2xl font-black">
              {(["a", "b"] as const).map((k, i) => (
                <React.Fragment key={k}>
                  {i === 1 && <span>×</span>}
                  <div className="flex items-center gap-1">
                    <Btn disabled={play.readOnly} onClick={() => play.patch({ [k]: clamp(w[k] - 1, -6, 6) } as Partial<TruthWorld>)}>
                      −
                    </Btn>
                    <span className={`w-12 text-center rounded-lg py-1 ${w[k] < 0 ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}>{w[k]}</span>
                    <Btn disabled={play.readOnly} onClick={() => play.patch({ [k]: clamp(w[k] + 1, -6, 6) } as Partial<TruthWorld>)}>
                      +
                    </Btn>
                  </div>
                </React.Fragment>
              ))}
              <span>= {product}</span>
            </div>
            <svg viewBox="0 0 200 20" className="w-full">
              <line x1={4} x2={196} y1={10} y2={10} stroke="#1e1b4b" strokeWidth={0.6} />
              {Array.from({ length: 73 }).map((_, i) => (
                <line key={i} x1={4 + i * (192 / 72)} x2={4 + i * (192 / 72)} y1={i === 36 ? 5 : 8} y2={i === 36 ? 15 : 12} stroke="#1e1b4b" strokeWidth={0.3} />
              ))}
              <motion.circle animate={{ cx: 4 + (product + 36) * (192 / 72) }} cy={10} r={3} fill={product > 0 ? "#10b981" : product < 0 ? "#e11d48" : "#64748b"} />
            </svg>
            <Btn tone="emerald" active disabled={play.readOnly || !(w.a < 0 && w.b < 0)} onClick={() => record("R", product > 0 ? "positive" : "negative")}>
              Record the sign of (negative) × (negative)
            </Btn>
            {!(w.a < 0 && w.b < 0) && <div className="text-[11px] text-slate-500 font-semibold">Set both counters to negative numbers.</div>}
          </div>
        )}
        {w.station === "S" && (
          <div className="space-y-2">
            <svg viewBox="0 0 200 40" className="w-full">
              <line x1={4} x2={196} y1={28} y2={28} stroke="#1e1b4b" strokeWidth={0.6} />
              {Array.from({ length: 11 }).map((_, i) => (
                <g key={i}>
                  <line x1={10 + i * 18} x2={10 + i * 18} y1={25} y2={31} stroke="#1e1b4b" strokeWidth={0.5} />
                  <text x={10 + i * 18} y={38} fontSize={5} textAnchor="middle" fontWeight={i + 2 === FROG_START ? 900 : 500}>
                    {i + 2}
                  </text>
                </g>
              ))}
              <motion.text animate={{ x: 10 + (w.frogAt - 2) * 18, y: [22, 12, 22] }} key={w.frogAt} transition={{ duration: 0.4 }} textAnchor="middle" fontSize={12}>
                🐸
              </motion.text>
            </svg>
            <div className="flex flex-wrap gap-2 items-center">
              <Btn disabled={play.readOnly || w.frogAt <= 2} onClick={() => play.patch({ frogAt: w.frogAt - 1 })}>
                ◀ hop back
              </Btn>
              <Btn disabled={play.readOnly || w.frogAt >= 12} onClick={() => play.patch({ frogAt: w.frogAt + 1 })}>
                hop on ▶
              </Btn>
              <Btn tone="emerald" active disabled={play.readOnly || Math.abs(w.frogAt - FROG_START) !== 1} onClick={() => record("S", w.frogAt > FROG_START ? "successor" : "predecessor")}>
                Record: {w.frogAt} comes just {w.frogAt > FROG_START ? "after" : "before"} {FROG_START}
              </Btn>
              <span className="text-[11px] font-semibold text-slate-500">The lab names the number you land on relative to {FROG_START}.</span>
            </div>
          </div>
        )}
      </Bay>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — True/False Engineering Lab (2D)
   Four stations. Slide a set-square along a ruler and draw; load both sides of the sum
   onto a twin scale; probe negative numbers against zero; hop along the integer line.
   Each station's result is what its experiment actually showed.
   ══════════════════════════════════════════════════════════════════════ */

type Frac = number | [number, number, number];
const fracVal = (f: Frac) => (Array.isArray(f) ? f[0] + f[1] / f[2] : f);
const fracText = (f: Frac) => (Array.isArray(f) ? `${f[0]} ${f[1]}/${f[2]}` : String(f));

interface EngWorld {
  station: "i" | "ii" | "iii" | "iv";
  squareX: number;
  lines: number[];
  loaded: string[];
  probes: number[];
  probe: number;
  hops: number;
  results: Record<string, "T" | "F">;
}

export function Q47EngineeringLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const stmts = cfg<{ id: string; text: string; config?: any }[]>(question, "statements", []);
  const order = cfg<string[]>(question, "readOrder", ["i", "ii", "iii", "iv"]);
  const scaleCfg = stmts.find((s) => s.id === "ii")?.config ?? { left: [], right: [] };
  const hopCfg = stmts.find((s) => s.id === "iv")?.config ?? { start: -7, jump: 4, claimedResult: -3 };
  const rulerRef = useRef<SVGSVGElement>(null);

  const play = usePlay<EngWorld>({
    question,
    initial: { station: "i", squareX: 20, lines: [], loaded: [], probes: [], probe: -1, hops: 0, results: {} },
    derive: (w) => {
      if (order.some((k) => !w.results[k])) return { note: `Run every station (${order.filter((k) => w.results[k]).length}/4 done).` };
      const text = order.map((k) => `(${k}) ${w.results[k]}`).join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const setResult = (id: string, r: "T" | "F") => play.set((p) => ({ ...p, results: { ...p.results, [id]: r } }));

  const slide = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const r = rulerRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = clamp(((p.x - r.left) / r.width) * 200, 10, 170);
      play.patch({ squareX: Math.round(x) });
    },
  });

  const chips = [
    ...scaleCfg.left.map((f: Frac, i: number) => ({ id: `L${i}`, side: "left", f })),
    ...scaleCfg.right.map((f: Frac, i: number) => ({ id: `R${i}`, side: "right", f })),
  ] as { id: string; side: "left" | "right"; f: Frac }[];
  const sum = (side: "left" | "right") => round(chips.filter((c) => c.side === side && w.loaded.includes(c.id)).reduce((t, c) => t + fracVal(c.f), 0), 4);
  const allLoaded = chips.every((c) => w.loaded.includes(c.id));
  const tilt = allLoaded ? Math.sign(sum("right") - sum("left")) * 10 : 0;
  const landing = hopCfg.start + w.hops;

  return (
    <PlayShell
      title="True/False Engineering Lab"
      mission="Run all four stations. (i) Slide the set-square along the ruler and draw two lines. (ii) Load every term onto its pan of the twin scale. (iii) Probe three negative numbers against zero. (iv) Hop right from −7 and compare where you land. Each station records what its experiment showed."
      icon={Wrench}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the T/F pattern"
      live={
        <>
          {order.map((k) => (
            <Gauge key={k} label={`(${k})`} value={w.results[k] ?? "—"} tone={w.results[k] === "T" ? "emerald" : w.results[k] === "F" ? "rose" : "slate"} />
          ))}
        </>
      }
    >
      <StationTabs
        ids={["i", "ii", "iii", "iv"] as ("i" | "ii" | "iii" | "iv")[]}
        labels={{ i: "(i) set-squares", ii: "(ii) twin scale", iii: "(iii) zero probe", iv: "(iv) integer hops" }}
        active={w.station}
        done={w.results}
        readOnly={play.readOnly}
        onPick={(station) => play.patch({ station })}
      />
      <Bay label={stmts.find((s) => s.id === w.station)?.text} tone="violet">
        {w.station === "i" && (
          <div className="space-y-2">
            <svg ref={rulerRef} viewBox="0 0 200 90" className="w-full bg-white rounded-xl border border-slate-200" style={{ touchAction: "none" }}>
              {w.lines.map((x, i) => (
                <line key={i} x1={x + 30} y1={4} x2={x + 30} y2={70} stroke="#1e1b4b" strokeWidth={0.8} />
              ))}
              <rect x={4} y={72} width={192} height={12} fill="#fef3c7" stroke="#d97706" strokeWidth={0.5} />
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={i} x1={8 + i * 10} x2={8 + i * 10} y1={72} y2={76} stroke="#92400e" strokeWidth={0.4} />
              ))}
              <g onPointerDown={(e) => slide.start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: "grab", touchAction: "none" }}>
                <polygon points={`${w.squareX},72 ${w.squareX + 30},72 ${w.squareX + 30},20`} fill="#a78bfa" fillOpacity={0.55} stroke="#6d28d9" strokeWidth={0.8} />
              </g>
            </svg>
            <div className="flex flex-wrap gap-2 items-center">
              <Btn disabled={play.readOnly} onClick={() => play.patch({ lines: [...w.lines, w.squareX].slice(-4) })}>
                ✏ Draw along the upright edge
              </Btn>
              <Btn disabled={play.readOnly} onClick={() => play.patch({ lines: [] })}>
                Erase
              </Btn>
              <Btn tone="emerald" active disabled={play.readOnly || new Set(w.lines).size < 2} onClick={() => setResult("i", "T")}>
                Measure: the lines never meet → record
              </Btn>
            </div>
          </div>
        )}
        {w.station === "ii" && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  disabled={play.readOnly || w.loaded.includes(c.id)}
                  onClick={() => play.patch({ loaded: [...w.loaded, c.id] })}
                  className={`min-h-[40px] px-2 rounded-lg border-2 font-mono text-xs font-black ${c.side === "left" ? "bg-sky-50 border-sky-300 text-sky-900" : "bg-pink-50 border-pink-300 text-pink-900"} ${w.loaded.includes(c.id) ? "opacity-30" : ""}`}
                >
                  {fracText(c.f)} → {c.side} pan
                </button>
              ))}
            </div>
            <svg viewBox="0 0 200 70" className="w-full max-h-40">
              <polygon points="95,68 105,68 100,24" fill="#475569" />
              <motion.g animate={{ rotate: tilt }} style={{ originX: "100px", originY: "24px" }}>
                <rect x={25} y={22} width={150} height={4} rx={2} fill="#6366f1" />
                <ellipse cx={40} cy={40} rx={22} ry={5} fill="#bae6fd" />
                <ellipse cx={160} cy={40} rx={22} ry={5} fill="#fbcfe8" />
                <text x={40} y={36} textAnchor="middle" fontSize={6} fontWeight={900}>
                  {sum("left")}
                </text>
                <text x={160} y={36} textAnchor="middle" fontSize={6} fontWeight={900}>
                  {sum("right")}
                </text>
              </motion.g>
            </svg>
            <Btn tone="emerald" active disabled={play.readOnly || !allLoaded} onClick={() => setResult("ii", sum("left") > sum("right") ? "T" : "F")}>
              Read the scale: is the left pan heavier? → record
            </Btn>
          </div>
        )}
        {w.station === "iii" && (
          <div className="space-y-2">
            <svg viewBox="0 0 200 30" className="w-full">
              <line x1={4} x2={196} y1={16} y2={16} stroke="#1e1b4b" strokeWidth={0.6} />
              {Array.from({ length: 21 }).map((_, i) => (
                <g key={i}>
                  <line x1={10 + i * 9} x2={10 + i * 9} y1={13} y2={19} stroke="#1e1b4b" strokeWidth={i === 10 ? 1 : 0.4} />
                  <text x={10 + i * 9} y={27} fontSize={4} textAnchor="middle">
                    {i - 10}
                  </text>
                </g>
              ))}
              {w.probes.map((p) => (
                <circle key={p} cx={10 + (p + 10) * 9} cy={16} r={2} fill="#e11d48" />
              ))}
              <circle cx={10 + 10 * 9} cy={16} r={2.4} fill="#0f172a" />
              <circle cx={10 + (w.probe + 10) * 9} cy={8} r={2.6} fill="#f59e0b" />
            </svg>
            <div className="flex flex-wrap gap-2 items-center">
              <Btn disabled={play.readOnly || w.probe <= -10} onClick={() => play.patch({ probe: w.probe - 1 })}>
                ◀
              </Btn>
              <span className="font-mono font-black text-lg w-10 text-center">{w.probe}</span>
              <Btn disabled={play.readOnly || w.probe >= -1} onClick={() => play.patch({ probe: w.probe + 1 })}>
                ▶
              </Btn>
              <Btn disabled={play.readOnly || w.probes.includes(w.probe)} onClick={() => play.patch({ probes: [...w.probes, w.probe] })}>
                Test 0 against {w.probe}
              </Btn>
            </div>
            <ul className="text-xs font-mono font-bold text-slate-700">
              {w.probes.map((p) => (
                <li key={p}>
                  0 {0 < p ? "<" : ">"} {p} &nbsp;→ zero is {0 < p ? "less" : "greater"}
                </li>
              ))}
            </ul>
            <Btn tone="emerald" active disabled={play.readOnly || w.probes.length < 3} onClick={() => setResult("iii", w.probes.every((p) => 0 < p) ? "T" : "F")}>
              Conclude from my tests → record
            </Btn>
          </div>
        )}
        {w.station === "iv" && (
          <div className="space-y-2">
            <svg viewBox="0 0 200 40" className="w-full">
              <line x1={4} x2={196} y1={28} y2={28} stroke="#1e1b4b" strokeWidth={0.6} />
              {Array.from({ length: 13 }).map((_, i) => (
                <g key={i}>
                  <line x1={10 + i * 15} x2={10 + i * 15} y1={25} y2={31} stroke="#1e1b4b" strokeWidth={0.5} />
                  <text x={10 + i * 15} y={38} fontSize={5} textAnchor="middle" fontWeight={i - 10 === hopCfg.start ? 900 : 500}>
                    {i - 10}
                  </text>
                </g>
              ))}
              <motion.text key={w.hops} animate={{ x: 10 + (landing + 10) * 15, y: [22, 10, 22] }} transition={{ duration: 0.4 }} textAnchor="middle" fontSize={12}>
                🐸
              </motion.text>
            </svg>
            <div className="flex flex-wrap gap-2 items-center">
              <Btn disabled={play.readOnly || landing >= 2} onClick={() => play.patch({ hops: w.hops + 1 })}>
                Hop 1 to the right
              </Btn>
              <Btn disabled={play.readOnly || w.hops === 0} onClick={() => play.patch({ hops: 0 })}>
                Back to {hopCfg.start}
              </Btn>
              <span className="text-sm font-black text-slate-800">
                {w.hops} hop{w.hops === 1 ? "" : "s"} → landed on {landing}
              </span>
              <Btn tone="emerald" active disabled={play.readOnly || w.hops === 0} onClick={() => setResult("iv", landing === hopCfg.claimedResult ? "T" : "F")}>
                Compare with the claim ({hopCfg.claimedResult}) → record
              </Btn>
            </div>
          </div>
        )}
      </Bay>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — Shirt Shop Data Game (3D)
   The bar graph becomes a real shop: one shelf per brand. The student stocks each shelf
   to match the graph, in packs of five shirts. The till counts the shirts on the shelves,
   and two baskets build the fraction the second task asks for.
   ══════════════════════════════════════════════════════════════════════ */

interface ShopWorld {
  stock: Record<string, number>;
  num: string[];
  den: string[];
}
const BRAND_COLOR = ["#8b5cf6", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e"];

function ShelfStack({ x, packs, color, label, onTap }: { x: number; packs: number; color: string; label: string; onTap: () => void }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = Math.max(1, packs);
  useEffect(() => {
    const d = new THREE.Object3D();
    for (let i = 0; i < packs; i++) {
      d.position.set(x, 0.12 + i * 0.16, 0);
      d.rotation.y = (i % 2 ? 0.08 : -0.06);
      d.updateMatrix();
      ref.current?.setMatrixAt(i, d.matrix);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [packs, x]);
  return (
    <group>
      <mesh position={[x, 1.2, -0.4]} castShadow receiveShadow onClick={(e) => (e.stopPropagation(), onTap())}>
        <boxGeometry args={[0.9, 2.4, 0.1]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
      {packs > 0 && (
        <instancedMesh key={n} ref={ref} args={[undefined, undefined, n]} castShadow onClick={(e) => (e.stopPropagation(), onTap())}>
          <boxGeometry args={[0.7, 0.14, 0.5]} />
          <meshStandardMaterial color={color} />
        </instancedMesh>
      )}
      <Label3D text={`${label}: ${packs * 5}`} position={[x, 2.65, -0.3]} size={[0.95, 0.32]} style={{ bg: color, fg: "#fff", scale: 0.6 }} />
    </group>
  );
}

export function Q48ShirtShop({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const bars = cfg<{ id: string; value: number }[]>(question, "bars", []);
  const yMax = cfg<number>(question, "yMax", 70);
  const yStep = cfg<number>(question, "yStep", 10);

  const play = usePlay<ShopWorld>({
    question,
    initial: { stock: Object.fromEntries(bars.map((b) => [b.id, 0])), num: [], den: [] },
    derive: (w) => {
      if (bars.some((b) => !w.stock[b.id])) return { note: "Stock every brand's shelf to match the graph." };
      if (!w.num.length || !w.den.length) return { note: "Fill both fraction baskets." };
      const total = bars.reduce((t, b) => t + w.stock[b.id] * 5, 0);
      const N = w.num.reduce((t, id) => t + w.stock[id] * 5, 0);
      const D = w.den.reduce((t, id) => t + w.stock[id] * 5, 0);
      const [n, d] = reduceFraction(N, D);
      const text = `${total}, ${n}/${d}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const total = bars.reduce((t, b) => t + w.stock[b.id] * 5, 0);
  const add = (id: string, d: number) => play.set((p) => ({ ...p, stock: { ...p.stock, [id]: clamp(p.stock[id] + d, 0, yMax / 5) } }));
  const toggle = (basket: "num" | "den", id: string) =>
    play.set((p) => ({ ...p, [basket]: p[basket].includes(id) ? p[basket].filter((x) => x !== id) : [...p[basket], id] }));

  return (
    <PlayShell
      title="Shirt Shop Data Game"
      mission="Read the bar graph and stock each brand's shelf to match it. Every pack holds 5 shirts: tap a shelf, or use + and −, to add or remove a pack. The till counts every shirt in the shop. Then fill the fraction baskets: brand S over brands P and R together."
      icon={Shirt}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit total and fraction"
      live={
        <>
          <Gauge label="Till: shirts in the shop" value={total} tone="violet" />
          <Gauge label="Top basket" value={w.num.join(" + ") || "—"} tone="sky" />
          <Gauge label="Bottom basket" value={w.den.join(" + ") || "—"} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1.6fr] gap-3">
        <Bay label="The printed bar graph">
          <svg viewBox="0 0 120 100" className="w-full">
            {Array.from({ length: yMax / yStep + 1 }).map((_, i) => (
              <g key={i}>
                <line x1={18} x2={116} y1={88 - (i * yStep * 78) / yMax} y2={88 - (i * yStep * 78) / yMax} stroke="#e2e8f0" strokeWidth={0.4} />
                <text x={15} y={89.5 - (i * yStep * 78) / yMax} fontSize={4} textAnchor="end">
                  {i * yStep}
                </text>
              </g>
            ))}
            {bars.map((b, i) => (
              <g key={b.id}>
                <rect x={24 + i * 18} y={88 - (b.value * 78) / yMax} width={11} height={(b.value * 78) / yMax} fill="#cbd5e1" stroke="#475569" strokeWidth={0.5} />
                <text x={29.5 + i * 18} y={95} fontSize={5} textAnchor="middle" fontWeight={800}>
                  {b.id}
                </text>
              </g>
            ))}
          </svg>
        </Bay>
        <Stage3D height={280} camera={{ position: [0, 2.4, 6.4], fov: 42 }} orbitTarget={[0, 1.1, 0]} readOnly={play.readOnly}>
          <Floor color="#e7e5e4" />
          {bars.map((b, i) => (
            <ShelfStack key={b.id} x={(i - 2) * 1.15} packs={w.stock[b.id]} color={BRAND_COLOR[i % BRAND_COLOR.length]} label={b.id} onTap={() => !play.readOnly && add(b.id, 1)} />
          ))}
        </Stage3D>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {bars.map((b, i) => (
          <div key={b.id} className="rounded-xl border-2 p-1.5 text-center" style={{ borderColor: BRAND_COLOR[i % BRAND_COLOR.length] }}>
            <div className="text-xs font-black">Brand {b.id}</div>
            <div className="font-mono text-lg font-black">{w.stock[b.id] * 5}</div>
            <div className="flex justify-center gap-1">
              <Btn disabled={play.readOnly} onClick={() => add(b.id, -1)} className="px-2">
                −
              </Btn>
              <Btn disabled={play.readOnly} onClick={() => add(b.id, 1)} className="px-2">
                +
              </Btn>
            </div>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {(["num", "den"] as const).map((basket) => (
          <Bay key={basket} label={basket === "num" ? "🧺 Top basket (numerator)" : "🧺 Bottom basket (denominator)"} tone="violet">
            <div className="flex flex-wrap gap-1">
              {bars.map((b) => (
                <Btn key={b.id} active={w[basket].includes(b.id)} disabled={play.readOnly} onClick={() => toggle(basket, b.id)} className="w-11">
                  {b.id}
                </Btn>
              ))}
            </div>
            <div className="mt-1 font-mono text-sm font-black text-violet-900">= {w[basket].reduce((t, id) => t + w.stock[id] * 5, 0)} shirts</div>
          </Bay>
        ))}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — Number-Line Treasure Hunt (2D)
   Four explorers each belong on one of the printed number lines. The student drags each
   explorer to its marker; the explorer reads its value off the ticks under its feet. The
   treasure chest's lock turns the four readings into (S + R) ÷ (P − Q).
   ══════════════════════════════════════════════════════════════════════ */

interface LineSpec {
  id: string;
  min: number;
  max: number;
  divisions: number;
  markers: { id: string; num: number; den: number }[];
}
interface HuntWorld {
  ticks: Record<string, number | null>;
  opened: boolean;
}

export function Q49TreasureHunt({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const lines = cfg<LineSpec[]>(question, "lines", []);
  const markers = lines.flatMap((l) => l.markers.map((m) => ({ ...m, line: l })));

  const reading = (w: HuntWorld, id: string) => {
    const m = markers.find((x) => x.id === id);
    const t = w.ticks[id];
    if (!m || t === null || t === undefined) return null;
    return { num: t, den: m.line.divisions };
  };
  const evaluate = (w: HuntWorld) => {
    const r = Object.fromEntries(["P", "Q", "R", "S"].map((k) => [k, reading(w, k)]));
    if (Object.values(r).some((x) => !x)) return null;
    const v = (k: string) => r[k]!.num / r[k]!.den;
    // exact arithmetic on a common denominator
    const L = lines.reduce((acc, l) => (acc * l.divisions) / gcdN(acc, l.divisions), 1);
    const s = (k: string) => (r[k]!.num * L) / r[k]!.den;
    const top = s("S") + s("R");
    const bot = s("P") - s("Q");
    return { top, bot, value: bot ? top / bot : NaN, approx: (v("S") + v("R")) / (v("P") - v("Q")) };
  };

  const play = usePlay<HuntWorld>({
    question,
    initial: { ticks: Object.fromEntries(markers.map((m) => [m.id, null])), opened: false },
    derive: (w) => {
      const e = evaluate(w);
      if (!e) return { note: "Place all four explorers on their number lines." };
      if (!w.opened) return { note: "Turn the chest's lock to evaluate." };
      if (!e.bot) return { note: "P − Q is zero — the lock cannot divide by it." };
      return { value: toMixedString(e.top, e.bot), optionId: matchNumber(question, e.value, 1e-9) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const e = evaluate(w);

  return (
    <PlayShell
      title="Number-Line Treasure Hunt"
      mission="Drag each explorer (P, Q, R, S) onto its own number line and stand it on its printed marker. The explorer reads its value off the ticks under its feet. When all four are standing, turn the chest's lock: it opens on (S + R) ÷ (P − Q)."
      icon={Gem}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the chest's value"
      live={
        <>
          {markers.map((m) => {
            const r = reading(w, m.id);
            return <Gauge key={m.id} label={`Explorer ${m.id}`} value={r ? `${r.num}/${r.den} = ${toMixedString(r.num, r.den)}` : "—"} tone="violet" />;
          })}
        </>
      }
    >
      {lines.map((l) => (
        <HuntLine key={l.id} line={l} ticks={w.ticks} readOnly={play.readOnly} onTick={(id, t) => play.set((p) => ({ ...p, opened: false, ticks: { ...p.ticks, [id]: t } }))} />
      ))}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 p-3">
        <motion.div animate={w.opened ? { rotate: [0, -8, 8, 0], scale: 1.1 } : { scale: 1 }} className="text-5xl">
          {w.opened ? "💰" : "🧰"}
        </motion.div>
        <div className="font-mono text-sm font-black text-amber-900">
          {e ? (
            <>
              ({toMixedString(reading(w, "S")!.num, reading(w, "S")!.den)} + {toMixedString(reading(w, "R")!.num, reading(w, "R")!.den)}) ÷ ({toMixedString(reading(w, "P")!.num, reading(w, "P")!.den)} − {toMixedString(reading(w, "Q")!.num, reading(w, "Q")!.den)})
              {w.opened && e.bot !== 0 && <div className="text-xl mt-1">= {toMixedString(e.top, e.bot)}</div>}
            </>
          ) : (
            "The lock needs all four readings."
          )}
        </div>
        <Btn tone="amber" active disabled={play.readOnly || !e} onClick={() => play.patch({ opened: true })}>
          🔑 Turn the lock
        </Btn>
      </div>
    </PlayShell>
  );
}

const gcdN = (a: number, b: number): number => (b ? gcdN(b, a % b) : a);

function HuntLine({ line, ticks, readOnly, onTick }: { line: LineSpec; ticks: Record<string, number | null>; readOnly?: boolean; onTick: (id: string, t: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const total = (line.max - line.min) * line.divisions;
  const X = (t: number) => 10 + (t / total) * 180;
  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-2">
      <svg ref={svg} viewBox="0 0 200 44" className="w-full" style={{ touchAction: "none" }}>
        <line x1={4} x2={196} y1={30} y2={30} stroke="#1e1b4b" strokeWidth={0.6} />
        {Array.from({ length: total + 1 }).map((_, t) => (
          <g key={t}>
            <line x1={X(t)} x2={X(t)} y1={t % line.divisions === 0 ? 25 : 27.5} y2={t % line.divisions === 0 ? 35 : 32.5} stroke="#1e1b4b" strokeWidth={t % line.divisions === 0 ? 0.8 : 0.35} />
            {t % line.divisions === 0 && (
              <text x={X(t)} y={42} fontSize={4.4} textAnchor="middle" fontWeight={800}>
                {line.min + t / line.divisions}
              </text>
            )}
          </g>
        ))}
        {line.markers.map((m) => (
          <g key={`mk-${m.id}`}>
            <circle cx={X((m.num / m.den) * line.divisions)} cy={30} r={2.2} fill="none" stroke="#475569" strokeWidth={0.6} />
            <line x1={X((m.num / m.den) * line.divisions) - 2} x2={X((m.num / m.den) * line.divisions) + 2} y1={30} y2={30} stroke="#475569" strokeWidth={0.5} />
            <text x={X((m.num / m.den) * line.divisions)} y={22} fontSize={4.2} textAnchor="middle" fontWeight={800} fill="#475569">
              {m.id}
            </text>
          </g>
        ))}
        {line.markers.map((m, i) => (
          <Explorer key={m.id} id={m.id} tick={ticks[m.id]} park={14 + i * 16} X={X} total={total} svg={svg} readOnly={readOnly} onTick={(t) => onTick(m.id, t)} />
        ))}
      </svg>
    </div>
  );
}

function Explorer({ id, tick, park, X, total, svg, readOnly, onTick }: { id: string; tick: number | null | undefined; park: number; X: (t: number) => number; total: number; svg: React.RefObject<SVGSVGElement | null>; readOnly?: boolean; onTick: (t: number) => void }) {
  const [drag, setDrag] = useState<number | null>(null);
  const { start } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const r = svg.current?.getBoundingClientRect();
      if (!r) return;
      const x = ((p.x - r.left) / r.width) * 200;
      setDrag(clamp(Math.round(((x - 10) / 180) * total), 0, total));
    },
    onEnd: () => {
      if (drag !== null) onTick(drag);
      setDrag(null);
    },
  });
  const t = drag ?? tick;
  const cx = t === null || t === undefined ? park : X(t);
  const cy = t === null || t === undefined ? 8 : 16;
  return (
    <g aria-label={`explorer ${id}`} onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: readOnly ? "default" : "grab", touchAction: "none" }}>
      <circle cx={cx} cy={cy} r={6} fill="transparent" />
      <text x={cx} y={cy + 2} textAnchor="middle" fontSize={8}>
        🧭
      </text>
      <rect x={cx - 3.2} y={cy - 9.5} width={6.4} height={5} rx={1} fill="#7c3aed" />
      <text x={cx} y={cy - 5.8} textAnchor="middle" fontSize={3.6} fontWeight={900} fill="#fff">
        {id}
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — Ratio Matching Museum (2D)
   Four exhibits, four ratio plaques. The student scans every piece of an exhibit with the
   light wand, which tallies shaded against unshaded, then strings a rope from each exhibit
   to the plaque it belongs to. When every exhibit is roped, the museum lights up.
   ══════════════════════════════════════════════════════════════════════ */

interface Exhibit {
  id: string;
  label: string;
  parts: number;
  shaded: number;
  shape: string;
}
interface MuseumWorld {
  scanned: Record<string, number[]>;
  ropes: Record<string, string>;
  holding: string | null;
}

/** Piece polygons for each exhibit, built from its piece count. */
function exhibitPieces(e: Exhibit): { pts: string; shaded: boolean }[] {
  const out: { pts: string; shaded: boolean }[] = [];
  const shadeSet = new Set<number>();
  // Spread the shaded pieces evenly through the exhibit.
  for (let k = 0; k < e.shaded; k++) shadeSet.add(Math.floor((k * e.parts) / e.shaded));
  if (e.shape === "hexagon-12") {
    for (let i = 0; i < 12; i++) {
      const a0 = (i * Math.PI) / 6;
      const a1 = ((i + 1) * Math.PI) / 6;
      const corner = (a: number) => {
        // point on a hexagon outline at angle a
        const sector = Math.floor(a / (Math.PI / 3));
        const s0 = sector * (Math.PI / 3);
        const s1 = s0 + Math.PI / 3;
        const p0 = [Math.cos(s0), Math.sin(s0)];
        const p1 = [Math.cos(s1), Math.sin(s1)];
        const t = (a - s0) / (Math.PI / 3);
        return [30 + 26 * (p0[0] + (p1[0] - p0[0]) * t), 30 + 26 * (p0[1] + (p1[1] - p0[1]) * t)];
      };
      const c0 = corner(a0 + 1e-9);
      const c1 = corner(Math.min(a1 - 1e-9, 2 * Math.PI - 1e-9));
      out.push({ pts: `30,30 ${c0.join(",")} ${c1.join(",")}`, shaded: shadeSet.has(i) });
    }
    return out;
  }
  if (e.shape === "triangle-strip") {
    const n = e.parts;
    // n alternating triangles span (n / 2 + 0.5) triangle widths.
    const w = 52 / (n / 2 + 0.5);
    for (let i = 0; i < n; i++) {
      const up = i % 2 === 0;
      const x = 4 + (i / 2) * w;
      const pts = up ? `${x},46 ${x + w / 2},14 ${x + w},46` : `${x},14 ${x + w},14 ${x + w / 2},46`;
      out.push({ pts, shaded: shadeSet.has(i) });
    }
    return out;
  }
  if (e.shape === "tiled-cross") {
    const cells = [
      [2, 0], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [2, 3],
    ].slice(0, e.parts);
    cells.forEach(([c, r], i) => {
      const x = 6 + c * 12;
      const y = 4 + r * 12;
      out.push({ pts: `${x},${y} ${x + 12},${y} ${x + 12},${y + 12} ${x},${y + 12}`, shaded: shadeSet.has(i) });
    });
    return out;
  }
  // square mosaic: a grid of equal squares holding exactly `parts` pieces
  const cols = Math.ceil(Math.sqrt(e.parts));
  for (let i = 0; i < e.parts; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const s = 52 / cols;
    const x = 4 + c * s;
    const y = 4 + r * s;
    out.push({ pts: `${x},${y} ${x + s},${y} ${x + s},${y + s} ${x},${y + s}`, shaded: shadeSet.has(i) });
  }
  return out;
}

export function Q50RatioMuseum({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const exhibits = cfg<Exhibit[]>(question, "figures", []);
  const plaques = cfg<{ id: string; text: string }[]>(question, "ratios", []);
  const order = cfg<string[]>(question, "readOrder", []);
  const pieces = useMemo(() => Object.fromEntries(exhibits.map((e) => [e.id, exhibitPieces(e)])), [exhibits]);

  const play = usePlay<MuseumWorld>({
    question,
    initial: { scanned: {}, ropes: {}, holding: null },
    derive: (w) => {
      if (order.some((id) => !w.ropes[id])) return { note: `Rope every exhibit to a plaque (${Object.keys(w.ropes).length}/${order.length}).` };
      const text = order.map((id) => `(${id}) → (${w.ropes[id]})`).join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const allRoped = order.every((id) => w.ropes[id]);

  const scan = (eid: string, i: number) =>
    play.set((p) => {
      const cur = p.scanned[eid] ?? [];
      return { ...p, scanned: { ...p.scanned, [eid]: cur.includes(i) ? cur : [...cur, i] } };
    });

  return (
    <PlayShell
      title="Ratio Matching Museum"
      mission="Wave the light wand over each exhibit: tap every piece to scan it, and the tally counts shaded against unshaded pieces. Then pick up an exhibit's rope and tap the ratio plaque it belongs to. Rope all four and the museum lights up."
      icon={Landmark}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the matching"
      live={
        <>
          {order.map((id) => (
            <Gauge key={id} label={`Exhibit ${id}`} value={w.ropes[id] ? `→ (${w.ropes[id]})` : "no rope"} tone={w.ropes[id] ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <div className={`rounded-2xl p-3 transition-colors duration-700 ${allRoped ? "bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 shadow-[0_0_40px_#fcd34d_inset]" : "bg-slate-800"}`}>
        <div className="grid md:grid-cols-[1.6fr_1fr] gap-3">
          <div className="grid grid-cols-2 gap-2">
            {exhibits.map((e) => {
              const sc = w.scanned[e.id] ?? [];
              const ps = pieces[e.id];
              const shadedSeen = sc.filter((i) => ps[i].shaded).length;
              const plainSeen = sc.length - shadedSeen;
              const done = sc.length === ps.length;
              return (
                <div key={e.id} className={`rounded-xl p-2 border-2 ${w.holding === e.id ? "border-amber-400 bg-amber-50" : "border-slate-600 bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">Exhibit ({e.id})</span>
                    <span className={`text-lg ${allRoped ? "" : "opacity-40"}`}>💡</span>
                  </div>
                  <svg viewBox="0 0 60 60" className="w-full max-h-32">
                    {ps.map((p, i) => (
                      <polygon
                        key={i}
                        points={p.pts}
                        fill={p.shaded ? "#94a3b8" : "#fff"}
                        stroke={sc.includes(i) ? "#f59e0b" : "#1e1b4b"}
                        strokeWidth={sc.includes(i) ? 1 : 0.5}
                        onClick={() => !play.readOnly && scan(e.id, i)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </svg>
                  <div className="text-[10px] font-bold text-slate-600">
                    Tally: {shadedSeen} shaded · {plainSeen} unshaded {done ? "✓ all scanned" : `(${sc.length}/${ps.length})`}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <Btn tone="amber" active={w.holding === e.id} disabled={play.readOnly} onClick={() => play.patch({ holding: w.holding === e.id ? null : e.id })} className="text-[11px]">
                      🪢 {w.ropes[e.id] ? `roped to (${w.ropes[e.id]})` : "pick up rope"}
                    </Btn>
                    <Btn disabled={play.readOnly} onClick={() => play.patch({ scanned: { ...w.scanned, [e.id]: ps.map((_, i) => i) } })} className="text-[11px]">
                      wand sweep
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="space-y-2">
            {plaques.map((p) => {
              const tied = Object.entries(w.ropes)
                .filter(([, v]) => v === p.id)
                .map(([k]) => k);
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  disabled={play.readOnly || !w.holding}
                  onClick={() => play.set((pw) => ({ ...pw, ropes: { ...pw.ropes, [pw.holding!]: p.id }, holding: null }))}
                  animate={allRoped ? { boxShadow: "0 0 18px #f59e0b" } : { boxShadow: "0 0 0px #000" }}
                  className={`w-full rounded-xl border-4 px-3 py-3 text-left ${w.holding ? "border-amber-400 bg-amber-50" : "border-amber-700 bg-[#fef3c7]"}`}
                >
                  <div className="text-[10px] font-black text-amber-800">PLAQUE ({p.id})</div>
                  <div className="font-mono text-2xl font-black text-amber-900">{p.text}</div>
                  <div className="text-[10px] font-bold text-amber-700">{tied.length ? `rope from (${tied.join("), (")})` : "no rope"}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
        {allRoped && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-center font-black text-amber-900">
            ✨ THE MUSEUM LIGHTS UP ✨
          </motion.div>
        )}
      </div>
      <p className="text-[11px] text-slate-500 font-semibold">Exhibits are rebuilt with the piece counts of the printed figures. The printed paper remains the reference for their exact drawings.</p>
    </PlayShell>
  );
}

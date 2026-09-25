"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { ChefHat, Route, Crosshair, Bike, Warehouse, Bell, Box, Sailboat, Wallet, Fence, Package, Telescope } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, reduceFraction, round, money } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Label3D, approach, Floor } from "../imo6a-play/three";
import { clientToSvg } from "../imo6a-play/svgPoint";

/* ══════════════════════════════════════════════════════════════════════
   Q29 — Fraction Subtraction Kitchen (2D)
   The student picks a slicing tray; a tray only works if every fraction cuts evenly into
   its slices. The starting amount is poured in as slices, and each amount to take away is
   served out. Whatever is left on the tray, in lowest terms, is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface Mixed {
  whole: number;
  num: number;
  den: number;
}
interface KitchenWorld {
  tray: number | null;
  poured: boolean;
  served: number[];
}
const slicesOf = (m: Mixed, tray: number) => ((m.whole * m.den + m.num) * tray) / m.den;
const mixedText = (m: Mixed) => (m.whole ? `${m.whole} ${m.num}/${m.den}` : `${m.num}/${m.den}`);

export function B29FractionKitchen({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const start = cfg<Mixed>(question, "start", { whole: 0, num: 0, den: 1 });
  const takeaway = cfg<Mixed[]>(question, "takeaway", []);
  const trays = cfg<number[]>(question, "trays", []);
  const fits = (t: number) => [start, ...takeaway].every((m) => t % m.den === 0);

  const play = usePlay<KitchenWorld>({
    question,
    initial: { tray: null, poured: false, served: [] },
    derive: (w) => {
      if (!w.tray || !w.poured) return { note: "Choose a tray that cuts every fraction evenly and pour in the starting amount." };
      if (w.served.length < takeaway.length) return { note: `Serve out every amount (${w.served.length}/${takeaway.length}).` };
      const left = slicesOf(start, w.tray) - takeaway.reduce((t, m) => t + slicesOf(m, w.tray!), 0);
      const [n, d] = reduceFraction(left, w.tray);
      const text = d === 1 ? String(n) : `${n}/${d}`;
      return { value: text, optionId: matchText(question, text), note: `${left}/${w.tray} left on the tray` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const left = w.tray && w.poured ? slicesOf(start, w.tray) - w.served.reduce((t, i) => t + slicesOf(takeaway[i], w.tray!), 0) : 0;
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <PlayShell
      title="Fraction Subtraction Kitchen"
      mission={`Pick a slicing tray. A tray only works if every fraction cuts into whole slices on it. Pour in ${mixedText(start)}, then serve out each amount the sum takes away. What stays on the tray is the answer, reduced to lowest terms.`}
      icon={ChefHat}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit what is left"
      live={
        <>
          <Gauge label="Tray" value={w.tray ? `${w.tray} slices per whole` : "—"} tone="violet" />
          <Gauge label="On the tray" value={w.tray && w.poured ? `${left}/${w.tray}` : "—"} tone="sky" />
          {msg && <Gauge label="Chef" value={msg} tone="amber" />}
        </>
      }
    >
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-bold text-slate-500">SLICING TRAYS:</span>
        {trays.map((t) => (
          <Btn
            key={t}
            active={w.tray === t}
            disabled={play.readOnly}
            onClick={() => {
              if (!fits(t)) {
                setMsg(`A ${t}-slice tray will not cut every fraction evenly.`);
                return;
              }
              setMsg(null);
              play.set({ tray: t, poured: false, served: [] });
            }}
          >
            {t} slices
          </Btn>
        ))}
      </div>
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-3">
        <div className="text-[10px] font-black text-amber-800 mb-1">SERVING TRAY</div>
        <div className="flex flex-wrap gap-[2px] min-h-[40px]">
          {w.tray &&
            w.poured &&
            Array.from({ length: Math.min(260, left) }).map((_, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-4 rounded-sm bg-orange-400" />
            ))}
        </div>
        {w.tray && w.poured && <div className="mt-1 font-mono text-sm font-black text-amber-900">{left} slices of 1/{w.tray}</div>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn tone="amber" active disabled={play.readOnly || !w.tray || w.poured} onClick={() => play.patch({ poured: true })}>
          Pour in {mixedText(start)} = {w.tray ? `${slicesOf(start, w.tray)}/${w.tray}` : "…"}
        </Btn>
        {takeaway.map((m, i) => (
          <Btn key={i} tone="rose" active={!w.served.includes(i)} disabled={play.readOnly || !w.poured || w.served.includes(i)} onClick={() => play.patch({ served: [...w.served, i] })}>
            − {mixedText(m)} {w.tray ? `(${slicesOf(m, w.tray)} slices)` : ""}
          </Btn>
        ))}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — Road Distance Simulator (2D)
   Four towns on one road, in a fixed order. The student drags the town markers until the
   three known distances all hold, then sends the measuring van from A to B.
   ══════════════════════════════════════════════════════════════════════ */

function RoadMarker({ t, km, lo, hi, X, svg, readOnly, onKm }: { t: string; km: number; lo: number; hi: number; X: (km: number) => number; svg: React.RefObject<SVGSVGElement | null>; readOnly?: boolean; onKm: (km: number) => void }) {
  const { start } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const q = clientToSvg(svg.current, p.x, p.y);
      if (!q) return;
      const next = clamp(Math.round((q.x - 10) / 3.4), lo, hi);
      if (next !== km) onKm(next);
    },
  });
  return (
    <g aria-label={`town ${t}`} onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: readOnly ? "default" : "grab", touchAction: "none" }}>
      <circle cx={X(km)} cy={40} r={8} fill="transparent" />
      <text x={X(km)} y={34} textAnchor="middle" fontSize={10}>
        🏙
      </text>
      <circle cx={X(km)} cy={44} r={3} fill="#7c3aed" stroke="#fff" />
      <text x={X(km)} y={58} textAnchor="middle" fontSize={6} fontWeight={900}>
        {t}
      </text>
    </g>
  );
}

interface RoadWorld {
  pos: Record<string, number>;
  measured: number | null;
}

export function B33RoadSimulator({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const order = cfg<string[]>(question, "order", []);
  const known = cfg<{ from: string; to: string; km: number }[]>(question, "known", []);
  const ask = cfg<{ from: string; to: string }>(question, "ask", { from: "A", to: "B" });
  const svg = useRef<SVGSVGElement>(null);
  const X = (km: number) => 10 + km * 3.4;

  const play = usePlay<RoadWorld>({
    question,
    initial: { pos: Object.fromEntries(order.map((t, i) => [t, i * 12])), measured: null },
    derive: (w) => {
      if (w.measured === null) return { note: `Place the towns, then send the van from ${ask.from} to ${ask.to}.` };
      return { value: `${w.measured} km`, optionId: matchNumber(question, w.measured) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const dist = (a: string, b: string) => Math.abs(w.pos[b] - w.pos[a]);

  return (
    <PlayShell
      title="Road Distance Simulator"
      mission={`The towns stay in the order ${order.join(" – ")}. Drag them along the road until every known distance is true, then send the measuring van from ${ask.from} to ${ask.to}.`}
      icon={Route}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the van's reading"
      live={
        <>
          {known.map((k) => (
            <Gauge key={`${k.from}${k.to}`} label={`${k.from} → ${k.to} must be ${k.km} km`} value={`${dist(k.from, k.to)} km ${dist(k.from, k.to) === k.km ? "✓" : ""}`} tone={dist(k.from, k.to) === k.km ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <div className="rounded-2xl bg-lime-50 border-2 border-lime-200 p-2">
        <svg ref={svg} viewBox="0 0 200 70" className="w-full" style={{ touchAction: "none" }}>
          <rect x={4} y={40} width={192} height={8} rx={4} fill="#475569" />
          <line x1={6} x2={194} y1={44} y2={44} stroke="#fde047" strokeWidth={0.6} strokeDasharray="3 3" />
          {Array.from({ length: 12 }).map((_, i) => (
            <text key={i} x={X(i * 5)} y={66} fontSize={3.4} textAnchor="middle" fill="#64748b">
              {i * 5}
            </text>
          ))}
          {w.measured !== null && (
            <motion.text initial={{ x: X(w.pos[ask.from]) }} animate={{ x: X(w.pos[ask.to]) }} transition={{ duration: 1.2 }} y={42} fontSize={8} textAnchor="middle">
              🚐
            </motion.text>
          )}
          {order.map((t, i) => (
            <RoadMarker
              key={t}
              t={t}
              km={w.pos[t]}
              lo={i ? w.pos[order[i - 1]] + 1 : 0}
              hi={i < order.length - 1 ? w.pos[order[i + 1]] - 1 : 55}
              X={X}
              svg={svg}
              readOnly={play.readOnly}
              onKm={(km) => play.set((pw) => ({ pos: { ...pw.pos, [t]: km }, measured: null }))}
            />
          ))}
        </svg>
      </div>
      <Btn tone="violet" active disabled={play.readOnly} onClick={() => play.patch({ measured: dist(ask.from, ask.to) })}>
        🚐 Drive the van from {ask.from} to {ask.to}
      </Btn>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — Common Divisor Cannon (2D)
   Three cannons, one per number. The student loads a divisor block and fires: each cannon
   shows its quotient and remainder, and the block only passes the factor wall when all
   three remainders are zero. The certified block is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface CannonWorld {
  block: number | null;
  fired: boolean;
  certified: number | null;
}

export function B35DivisorCannon({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const numbers = cfg<number[]>(question, "numbers", []);
  const blocks = cfg<number[]>(question, "blocks", []);

  const play = usePlay<CannonWorld>({
    question,
    initial: { block: null, fired: false, certified: null },
    derive: (w) => (w.certified === null ? { note: "Fire a block that clears every cannon, then certify it." } : { value: String(w.certified), optionId: matchNumber(question, w.certified) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const clear = w.fired && w.block !== null && numbers.every((n) => n % w.block! === 0);

  return (
    <PlayShell
      title="Common Divisor Cannon"
      mission="Load a divisor block and fire all three cannons. Each cannon divides its number by the block and shows the remainder. A block passes the factor wall only if every remainder is zero. Certify the block that gets through."
      icon={Crosshair}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the certified divisor"
    >
      <div className="grid sm:grid-cols-3 gap-2">
        {numbers.map((n) => {
          const r = w.fired && w.block ? n % w.block : null;
          return (
            <div key={n} className="rounded-2xl bg-slate-800 text-white p-3 text-center">
              <div className="text-3xl">💣</div>
              <div className="font-mono text-2xl font-black">{n}</div>
              {r !== null && w.block && (
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`mt-1 font-mono text-sm font-black ${r === 0 ? "text-emerald-300" : "text-rose-300"}`}>
                  {n} = {w.block} × {Math.floor(n / w.block)} + {r}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      <div className={`rounded-xl border-4 p-2 text-center font-black ${!w.fired ? "border-slate-300 text-slate-400" : clear ? "border-emerald-500 text-emerald-700 bg-emerald-50" : "border-rose-400 text-rose-700 bg-rose-50"}`}>
        FACTOR WALL {w.fired ? (clear ? "— the block passed through all three" : "— the block bounced off") : ""}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-bold text-slate-500">DIVISOR BLOCKS:</span>
        {blocks.map((b) => (
          <Btn key={b} active={w.block === b} disabled={play.readOnly} onClick={() => play.set({ block: b, fired: false, certified: null })} className="w-12">
            {b}
          </Btn>
        ))}
        <Btn tone="rose" active disabled={play.readOnly || w.block === null} onClick={() => play.patch({ fired: true })}>
          FIRE
        </Btn>
        <Btn tone="emerald" active disabled={play.readOnly || !clear} onClick={() => play.patch({ certified: w.block })}>
          Certify block {w.block ?? ""}
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — Courier Delivery Simulator (2D)
   The route is drawn to scale. The student sets where the courier leaves the bicycle
   (the converter shows metres and kilometres together); the rest of the route is walked.
   Delivering records the walking distance.
   ══════════════════════════════════════════════════════════════════════ */

interface CourierWorld {
  bikeM: number;
  delivered: boolean;
}

export function B37CourierRun({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = cfg<number>(question, "totalMetres", 35);
  const bikeKm = cfg<number>(question, "bikeKm", 0);

  const play = usePlay<CourierWorld>({
    question,
    initial: { bikeM: 0, delivered: false },
    derive: (w) => (!w.delivered ? { note: "Set where the courier leaves the bike, then deliver." } : { value: `${total - w.bikeM} m`, optionId: matchNumber(question, total - w.bikeM) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const X = (m: number) => 10 + (m / total) * 180;

  return (
    <PlayShell
      title="Courier Delivery Simulator"
      mission={`The route is ${total} m long. The courier rides ${bikeKm} km by bicycle. Slide the bike-drop point to where the ride ends (the converter shows metres and kilometres), then deliver: the rest is walked.`}
      icon={Bike}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the walking distance"
      live={
        <>
          <Gauge label="Bike distance" value={`${w.bikeM} m = ${round(w.bikeM / 1000, 3)} km`} tone="violet" />
          <Gauge label="Walking distance" value={`${total - w.bikeM} m`} tone="sky" />
          <Gauge label="Total" value={`${total} m`} />
        </>
      }
    >
      <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-2">
        <svg viewBox="0 0 200 50" className="w-full">
          <line x1={X(0)} x2={X(w.bikeM)} y1={30} y2={30} stroke="#7c3aed" strokeWidth={4} strokeLinecap="round" />
          <line x1={X(w.bikeM)} x2={X(total)} y1={30} y2={30} stroke="#0ea5e9" strokeWidth={4} strokeDasharray="3 2" />
          <text x={X(0)} y={22} fontSize={8} textAnchor="middle">
            🏤
          </text>
          <text x={X(total)} y={22} fontSize={8} textAnchor="middle">
            🏠
          </text>
          <motion.text animate={{ x: w.delivered ? X(total) : X(w.bikeM) }} y={24} fontSize={9} textAnchor="middle">
            {w.delivered ? "🚶" : "🚲"}
          </motion.text>
          {Array.from({ length: 8 }).map((_, i) => (
            <text key={i} x={X(i * 5)} y={44} fontSize={4} textAnchor="middle" fill="#64748b">
              {i * 5} m
            </text>
          ))}
        </svg>
        <input type="range" min={0} max={total} value={w.bikeM} disabled={play.readOnly} onChange={(e) => play.set({ bikeM: Number(e.target.value), delivered: false })} className="w-full accent-violet-600" aria-label="bike drop point in metres" />
      </div>
      <Btn tone="emerald" active disabled={play.readOnly} onClick={() => play.patch({ delivered: true })}>
        📦 Deliver the parcel
      </Btn>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — Rice Warehouse (2D)
   The warehouse scale reads the stock. The student sets the amount to take out on place-
   value wheels from tens down to thousandths and loads it onto the truck; the scale then
   shows the column subtraction and what is left.
   ══════════════════════════════════════════════════════════════════════ */

const WHEELS = [
  { label: "tens", v: 10 },
  { label: "ones", v: 1 },
  { label: "tenths", v: 0.1 },
  { label: "hundredths", v: 0.01 },
  { label: "thousandths", v: 0.001 },
];

interface RiceWorld {
  digits: number[];
  loaded: boolean;
}

export function B38RiceWarehouse({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const stock = cfg<number>(question, "stock", 0);
  const amountOf = (d: number[]) => round(d.reduce((t, x, i) => t + x * WHEELS[i].v, 0), 3);

  const play = usePlay<RiceWorld>({
    question,
    initial: { digits: WHEELS.map(() => 0), loaded: false },
    derive: (w) => {
      if (!w.loaded) return { note: "Set the amount on the wheels and load it onto the truck." };
      const left = round(stock - amountOf(w.digits), 3);
      return { value: `${left.toFixed(3)} kg`, optionId: matchNumber(question, left, 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const amt = amountOf(w.digits);

  return (
    <PlayShell
      title="Rice Warehouse"
      mission="Set the amount the worker takes out on the place-value wheels, from tens down to thousandths, and load it onto the truck. The warehouse scale subtracts it from the stock."
      icon={Warehouse}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the rice left"
      live={
        <>
          <Gauge label="Stock" value={`${stock.toFixed(3)} kg`} />
          <Gauge label="On the truck" value={`${amt.toFixed(3)} kg`} tone="violet" />
        </>
      }
    >
      <div className="flex flex-wrap gap-2 justify-center">
        {WHEELS.map((wh, i) => (
          <div key={wh.label} className="flex flex-col items-center gap-1 rounded-xl bg-slate-800 p-2 text-white w-20">
            <span className="text-[9px] font-black text-slate-300 uppercase">{wh.label}</span>
            <button type="button" disabled={play.readOnly} onClick={() => play.set((p) => ({ loaded: false, digits: p.digits.map((x, j) => (j === i ? (x + 1) % 10 : x)) }))} className="w-full h-8 rounded bg-slate-700" aria-label={`${wh.label} up`}>
              ▲
            </button>
            <motion.span key={w.digits[i]} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-3xl font-black text-amber-300">
              {w.digits[i]}
            </motion.span>
            <button type="button" disabled={play.readOnly} onClick={() => play.set((p) => ({ loaded: false, digits: p.digits.map((x, j) => (j === i ? (x + 9) % 10 : x)) }))} className="w-full h-8 rounded bg-slate-700" aria-label={`${wh.label} down`}>
              ▼
            </button>
            {i === 1 && <span className="text-2xl font-black leading-none -mt-1">.</span>}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Btn tone="violet" active disabled={play.readOnly || amt === 0} onClick={() => play.patch({ loaded: true })}>
          🚚 Load {amt.toFixed(3)} kg onto the truck
        </Btn>
        {w.loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-right bg-slate-900 text-lime-300 rounded-xl px-4 py-2 text-lg font-black">
            <div>{stock.toFixed(3)}</div>
            <div className="border-b border-lime-300/50">− {amt.toFixed(3)}</div>
            <div className="text-white">{round(stock - amt, 3).toFixed(3)} kg</div>
          </motion.div>
        )}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — Bell Tower (3D)
   Three bells swing on their own timers. The student runs the tower clock from the
   starting time; every bell swings when its interval comes round, and a gold ring marks
   moments when all three ring together. They stop the clock and record such a moment.
   ══════════════════════════════════════════════════════════════════════ */

interface BellWorld {
  recorded: number | null;
}

function BellMesh({ x, ringing, label }: { x: number; ringing: boolean; label: string }) {
  const ref = useRef<THREE.Group>(null);
  const t0 = useRef(0);
  const was = useRef(false);
  useFrame(({ clock }) => {
    if (ringing && !was.current) t0.current = clock.elapsedTime;
    was.current = ringing;
    if (!ref.current) return;
    const k = clock.elapsedTime - t0.current;
    ref.current.rotation.z = k < 1.2 && t0.current > 0 ? Math.sin(k * 14) * 0.5 * (1 - k / 1.2) : 0;
  });
  return (
    <group position={[x, 3, 0]}>
      <group ref={ref}>
        <mesh position={[0, -0.55, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.6, 0.9, 24, 1, true]} />
          <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>
      <Label3D text={label} position={[0, -1.45, 0.3]} size={[1.2, 0.3]} billboard style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.55 }} />
    </group>
  );
}

const clockText = (start: { h: number; m: number }, t: number) => {
  const total = start.h * 60 + start.m + t;
  const h24 = Math.floor(total / 60) % 24;
  const m = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "a.m." : "p.m."}`;
};

export function B40BellTower({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const intervals = cfg<number[]>(question, "intervals", []);
  const start = cfg<{ h: number; m: number }>(question, "start", { h: 17, m: 0 });
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [allAt, setAllAt] = useState<number[]>([]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((x) => x + 5), 180);
    return () => clearInterval(id);
  }, [running]);
  const ringing = intervals.map((iv) => t > 0 && t % iv === 0);
  useEffect(() => {
    if (ringing.every(Boolean) && !allAt.includes(t)) {
      setAllAt((a) => [...a, t]);
      setRunning(false);
    }
  }, [t]); // eslint-disable-line react-hooks/exhaustive-deps

  const play = usePlay<BellWorld>({
    question,
    initial: { recorded: null },
    derive: (w) => {
      if (w.recorded === null) return { note: "Run the clock and record the next moment all three bells ring together." };
      const text = clockText(start, w.recorded);
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <PlayShell
      title="Bell Tower"
      mission={`The bells ring every ${intervals.join(", ")} minutes and all rang together at ${clockText(start, 0)} Run the tower clock; the clock stops by itself the moment all three ring together again. Record that moment.`}
      icon={Bell}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={() => {
        setT(0);
        setRunning(false);
        setAllAt([]);
        play.reset();
      }}
      submitLabel="Submit the time"
      live={
        <>
          <Gauge label="Tower clock" value={clockText(start, t)} tone="violet" />
          <Gauge label="Minutes since start" value={t} />
          <Gauge label="All three rang at" value={allAt.map((a) => clockText(start, a)).join(", ") || "—"} tone="amber" />
        </>
      }
    >
      <Stage3D height={320} camera={{ position: [0, 2.6, 7], fov: 42 }} orbitTarget={[0, 2.2, 0]} readOnly={play.readOnly}>
        <Floor />
        <mesh position={[0, 3.2, -0.3]} castShadow>
          <boxGeometry args={[6, 0.2, 0.4]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {[-2.6, 2.6].map((x) => (
          <mesh key={x} position={[x, 1.6, -0.3]} castShadow>
            <boxGeometry args={[0.3, 3.2, 0.3]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
        ))}
        {intervals.map((iv, i) => (
          <BellMesh key={iv} x={(i - 1) * 1.8} ringing={ringing[i]} label={`every ${iv} min`} />
        ))}
        <Label3D text={clockText(start, t)} position={[0, 4, -0.2]} size={[1.8, 0.5]} billboard style={{ bg: ringing.every(Boolean) ? "#f59e0b" : "#ffffff", fg: "#1e1b4b", border: "#1e1b4b" }} />
      </Stage3D>
      <div className="flex flex-wrap gap-2">
        <Btn tone="violet" active={running} disabled={play.readOnly} onClick={() => setRunning((r) => !r)}>
          {running ? "⏸ Pause clock" : "▶ Run clock"}
        </Btn>
        <Btn disabled={play.readOnly || running} onClick={() => setT((x) => x + 5)}>
          +5 min
        </Btn>
        <Btn tone="emerald" active disabled={play.readOnly || running || t === 0} onClick={() => play.set({ recorded: t })}>
          Record {clockText(start, t)}
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q41 — Chocolate Box Challenge (2D)
   Two identical transparent boxes. The student chooses how many compartments both boxes
   have, then fills each box to its fraction. Only a compartment count that both fractions
   fit makes an exact fill possible; the difference in compartments is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface ChocWorld {
  cells: number;
  filled: number[];
}

export function B41ChocolateBoxes({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const boxes = cfg<{ who: string; num: number; den: number }[]>(question, "boxes", []);
  const choices = [8, 10, 20, 40];

  const play = usePlay<ChocWorld>({
    question,
    initial: { cells: 8, filled: boxes.map(() => 0) },
    derive: (w) => {
      if (w.filled.some((f) => f === 0)) return { note: "Fill both boxes." };
      const [a, b] = w.filled;
      if (a === b) return { value: "Both boxes hold the same" };
      const who = a > b ? boxes[0].who : boxes[1].who;
      const [n, d] = reduceFraction(Math.abs(a - b), w.cells);
      const text = `${who}, ${n}/${d}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <PlayShell
      title="Chocolate Box Challenge"
      mission="Choose how many equal compartments both boxes have. Then fill each friend's box to the fraction the question gives, one chocolate per compartment. Only some compartment counts let both boxes be filled exactly. Compare the two boxes."
      icon={Box}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit who has more, and by how much"
      live={
        <>
          {boxes.map((b, i) => (
            <Gauge key={b.who} label={`${b.who} should be ${b.num}/${b.den}`} value={`${w.filled[i]}/${w.cells}${w.filled[i] * b.den === b.num * w.cells ? " ✓" : ""}`} tone={w.filled[i] * b.den === b.num * w.cells ? "emerald" : "violet"} />
          ))}
        </>
      }
    >
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-bold text-slate-500">COMPARTMENTS PER BOX:</span>
        {choices.map((c) => (
          <Btn key={c} active={w.cells === c} disabled={play.readOnly} onClick={() => play.set({ cells: c, filled: boxes.map(() => 0) })}>
            {c}
          </Btn>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {boxes.map((b, i) => (
          <Bay key={b.who} label={`${b.who}'s box`} tone="violet">
            <div className="grid gap-1 p-1.5 rounded-xl bg-white/70 border-2 border-sky-200" style={{ gridTemplateColumns: `repeat(${Math.min(10, w.cells)}, minmax(0, 1fr))` }}>
              {Array.from({ length: w.cells }).map((_, k) => (
                <motion.span key={k} animate={{ scale: k < w.filled[i] ? 1 : 0.85 }} className={`aspect-square rounded ${k < w.filled[i] ? "bg-amber-800" : "bg-sky-50 border border-sky-200"}`} />
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              {[-5, -1, 1, 5].map((d) => (
                <Btn key={d} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, filled: p.filled.map((f, j) => (j === i ? clamp(f + d, 0, p.cells) : f)) }))} className="px-2">
                  {d > 0 ? `+${d}` : d}
                </Btn>
              ))}
            </div>
          </Bay>
        ))}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — Boat Journey Simulator (2D)
   The student first sails the calibration trip from the story; the speed meter works out
   the kilometres per hour. Then they drag the voyage clock and the boat sails on at that
   speed; arriving records the distance.
   ══════════════════════════════════════════════════════════════════════ */

interface BoatWorld {
  hours: number;
  speed: number | null;
  arrived: number | null;
}

export function B42BoatJourney({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const km = cfg<number>(question, "km", 15);
  const hours = cfg<number>(question, "hours", 6);

  const play = usePlay<BoatWorld>({
    question,
    initial: { hours: 0, speed: null, arrived: null },
    derive: (w) => {
      if (w.speed === null) return { note: `Sail the ${km} km trip in ${hours} hours to calibrate the speed meter.` };
      if (w.arrived === null) return { note: "Drag the voyage clock and arrive." };
      return { value: `${w.arrived} km`, optionId: matchNumber(question, w.arrived) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const dist = w.speed !== null ? round(w.speed * w.hours, 2) : null;
  const X = (d: number) => 10 + Math.min(1, d / 80) * 180;

  return (
    <PlayShell
      title="Boat Journey Simulator"
      mission={`First drag the voyage clock to ${hours} hours and log the ${km} km trip; the speed meter works out the boat's speed. Then drag the clock to the time the question asks about and arrive.`}
      icon={Sailboat}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the distance"
      live={
        <>
          <Gauge label="Voyage clock" value={`${w.hours} h`} tone="violet" />
          <Gauge label="Speed meter" value={w.speed !== null ? `${w.speed} km/h` : "not calibrated"} tone="sky" />
          <Gauge label="Distance so far" value={dist !== null ? `${dist} km` : "—"} />
        </>
      }
    >
      <div className="rounded-2xl bg-gradient-to-b from-sky-200 to-blue-400 p-2">
        <svg viewBox="0 0 200 50" className="w-full">
          <path d="M 0 34 Q 25 30 50 34 T 100 34 T 150 34 T 200 34 L 200 50 L 0 50 Z" fill="#1d4ed8" opacity={0.5} />
          {Array.from({ length: 9 }).map((_, i) => (
            <text key={i} x={X(i * 10)} y={47} fontSize={4} textAnchor="middle" fill="#e0f2fe">
              {i * 10} km
            </text>
          ))}
          <motion.text animate={{ x: X(dist ?? (w.hours / hours) * km) }} y={32} fontSize={11} textAnchor="middle">
            ⛵
          </motion.text>
        </svg>
        <input type="range" min={0} max={30} value={w.hours} disabled={play.readOnly} onChange={(e) => play.set((p) => ({ ...p, hours: Number(e.target.value), arrived: null }))} className="w-full accent-violet-600" aria-label="voyage clock in hours" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn tone="sky" active disabled={play.readOnly || w.hours !== hours} onClick={() => play.patch({ speed: round(km / hours, 4), arrived: null })}>
          Log the {km} km trip in {w.hours} h
        </Btn>
        <Btn tone="emerald" active disabled={play.readOnly || w.speed === null || w.hours === 0} onClick={() => play.patch({ arrived: dist })}>
          ⚓ Arrive after {w.hours} h
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — Shopping Game (2D)
   The student's wallet holds the story's money as notes. At each counter they hand over
   notes; the cashier keeps the price and drops the change back into the wallet as coins.
   What the wallet holds after both purchases is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface ShopWorld {
  wallet: number[];
  hand: number[];
  bought: number[];
}
const DENOMS = [20, 10, 5, 2, 1, 0.5, 0.25];
function changeCoins(amount: number): number[] {
  const out: number[] = [];
  let left = Math.round(amount * 100);
  for (const d of DENOMS) {
    const c = Math.round(d * 100);
    while (left >= c) {
      out.push(d);
      left -= c;
    }
  }
  return out;
}

export function B43ShoppingGame({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const start = cfg<number>(question, "wallet", 30);
  const items = cfg<{ label: string; price: number }[]>(question, "items", []);

  const play = usePlay<ShopWorld>({
    question,
    initial: { wallet: changeCoins(start), hand: [], bought: [] },
    derive: (w) => {
      if (w.bought.length < items.length) return { note: "Buy every item on the list." };
      const t = round(w.wallet.reduce((a, b) => a + b, 0), 2);
      return { value: money(t), optionId: matchNumber(question, t, 1e-6) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const walletTotal = round(w.wallet.reduce((a, b) => a + b, 0), 2);
  const handTotal = round(w.hand.reduce((t, i) => t + w.wallet[i], 0), 2);

  const pay = (k: number) =>
    play.set((p) => {
      const given = round(p.hand.reduce((t, i) => t + p.wallet[i], 0), 2);
      if (given < items[k].price) return p;
      const wallet = p.wallet.filter((_, i) => !p.hand.includes(i));
      return { wallet: [...wallet, ...changeCoins(round(given - items[k].price, 2))], hand: [], bought: [...p.bought, k] };
    });

  return (
    <PlayShell
      title="Shopping Game"
      mission="Tap notes and coins in your wallet to hold them out, then pay at an item's counter. The cashier keeps the price and drops your change back into the wallet. Buy everything on the list."
      icon={Wallet}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the money left"
      live={
        <>
          <Gauge label="Wallet" value={money(walletTotal)} tone="violet" />
          <Gauge label="Held out" value={money(handTotal)} tone="sky" />
        </>
      }
    >
      <Bay label="Your wallet" tone="violet">
        <div className="flex flex-wrap gap-1.5 min-h-[48px]">
          {w.wallet.map((d, i) => (
            <motion.button
              key={`${i}-${d}`}
              type="button"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: w.hand.includes(i) ? -6 : 0, opacity: 1 }}
              disabled={play.readOnly}
              onClick={() => play.patch({ hand: w.hand.includes(i) ? w.hand.filter((x) => x !== i) : [...w.hand, i] })}
              className={`${d >= 10 ? "w-20 h-11 rounded-md bg-emerald-200 border-emerald-500" : "w-11 h-11 rounded-full bg-amber-200 border-amber-500"} border-2 font-mono text-xs font-black ${w.hand.includes(i) ? "ring-2 ring-violet-500" : ""}`}
            >
              ₹{d % 1 ? d.toFixed(2) : d}
            </motion.button>
          ))}
        </div>
      </Bay>
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map((it, k) => (
          <div key={it.label} className={`rounded-xl border-2 p-3 ${w.bought.includes(k) ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
            <div className="text-2xl">{it.label === "Book" ? "📘" : "🧸"}</div>
            <div className="font-black text-sm">
              {it.label} · {money(it.price)}
            </div>
            <Btn className="mt-1" tone="emerald" active disabled={play.readOnly || w.bought.includes(k) || handTotal < it.price} onClick={() => pay(k)}>
              {w.bought.includes(k) ? "Bought ✓" : `Pay ${money(handTotal)}`}
            </Btn>
          </div>
        ))}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — Fence Builder (2D)
   The budget buys fence rolls at the given price per metre. The student buys rolls until
   the budget is spent exactly, then shares them out among the four sides of the square
   field. When all four sides are equal, the side length is recorded.
   ══════════════════════════════════════════════════════════════════════ */

interface FenceWorld {
  rolls: number;
  sides: number[];
}

export function B44FenceBuilder({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const cost = cfg<number>(question, "cost", 0);
  const rate = cfg<number>(question, "rate", 1);

  const play = usePlay<FenceWorld>({
    question,
    initial: { rolls: 0, sides: [0, 0, 0, 0] },
    derive: (w) => {
      const used = w.sides.reduce((a, b) => a + b, 0);
      if (w.rolls * rate !== cost) return { note: "Spend the whole budget on fence rolls." };
      if (used !== w.rolls) return { note: `Use every roll on the field (${used}/${w.rolls} placed).` };
      if (!w.sides.every((s) => s === w.sides[0])) return { note: "A square needs four equal sides." };
      return { value: `${w.sides[0]} m`, optionId: matchNumber(question, w.sides[0]) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const spent = w.rolls * rate;
  const used = w.sides.reduce((a, b) => a + b, 0);
  const S = 90 / Math.max(10, ...w.sides, 1);

  return (
    <PlayShell
      title="Fence Builder"
      mission={`You have ₹${cost}. Each 1 m fence roll costs ₹${rate}. Buy rolls until the budget is spent exactly, then share the rolls among the four sides of the square field.`}
      icon={Fence}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the side length"
      live={
        <>
          <Gauge label="Spent" value={`₹${spent} of ₹${cost}`} tone={spent === cost ? "emerald" : spent > cost ? "rose" : "violet"} />
          <Gauge label="Rolls bought" value={`${w.rolls} m`} />
          <Gauge label="Rolls placed" value={`${used} m`} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <div className="rounded-2xl bg-green-100 border-2 border-green-300 p-2">
          <svg viewBox="0 0 120 120" className="w-full max-h-72">
            <rect x={15} y={15} width={90} height={90} fill="#86efac" />
            {[
              [15, 15, 15 + w.sides[0] * S, 15],
              [105, 15, 105, 15 + w.sides[1] * S],
              [105, 105, 105 - w.sides[2] * S, 105],
              [15, 105, 15, 105 - w.sides[3] * S],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#78350f" strokeWidth={3} strokeDasharray="2 1" />
            ))}
            {["top", "right", "bottom", "left"].map((s, i) => (
              <text key={s} x={[60, 114, 60, 6][i]} y={[10, 62, 115, 62][i]} fontSize={6} fontWeight={900} textAnchor="middle" fill="#14532d">
                {w.sides[i]} m
              </text>
            ))}
          </svg>
        </div>
        <div className="space-y-2">
          <Bay label="Fence shop" tone="violet">
            <div className="flex flex-wrap gap-1.5">
              {[1, 5, 10].map((n) => (
                <Btn key={n} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, rolls: p.rolls + n }))}>
                  Buy {n} m
                </Btn>
              ))}
              <Btn disabled={play.readOnly || w.rolls <= used} onClick={() => play.set((p) => ({ ...p, rolls: p.rolls - 1 }))}>
                Return 1 m
              </Btn>
            </div>
          </Bay>
          <Bay label="Place rolls on each side">
            {["Top", "Right", "Bottom", "Left"].map((s, i) => (
              <div key={s} className="flex items-center gap-2 mb-1">
                <span className="w-14 text-xs font-black">{s}</span>
                <Btn disabled={play.readOnly || !w.sides[i]} onClick={() => play.set((p) => ({ ...p, sides: p.sides.map((x, j) => (j === i ? x - 1 : x)) }))} className="px-2">
                  −
                </Btn>
                <span className="font-mono font-black w-10 text-center">{w.sides[i]}</span>
                <Btn disabled={play.readOnly || used >= w.rolls} onClick={() => play.set((p) => ({ ...p, sides: p.sides.map((x, j) => (j === i ? x + 1 : x)) }))} className="px-2">
                  +
                </Btn>
              </div>
            ))}
          </Bay>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — Sugar Warehouse (2D)
   The first order's bags go on the weighbridge and the invoice is matched to their
   weight, which fixes the price per kilogram. The student then sets up the second order
   on the loading dials and loads it; the machine prints its invoice.
   ══════════════════════════════════════════════════════════════════════ */

interface SugarWorld {
  firstLoaded: boolean;
  rate: number | null;
  bags: number;
  kg: number;
  invoice: number | null;
}

export function B45SugarWarehouse({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const first = cfg<{ bags: number; kg: number; cost: number }>(question, "first", { bags: 0, kg: 0, cost: 0 });

  const play = usePlay<SugarWorld>({
    question,
    initial: { firstLoaded: false, rate: null, bags: 1, kg: 1, invoice: null },
    derive: (w) => (w.invoice === null ? { note: "Price the first order per kilogram, then load and invoice the second order." } : { value: `₹ ${w.invoice.toLocaleString("en-IN")}`, optionId: matchNumber(question, w.invoice) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const firstKg = first.bags * first.kg;
  const dial = (label: string, v: number, key: "bags" | "kg") => (
    <div className="flex items-center gap-1.5">
      <span className="w-20 text-xs font-black">{label}</span>
      {[-10, -1].map((d) => (
        <Btn key={d} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, [key]: Math.max(1, p[key] + d), invoice: null }))} className="px-2">
          {d}
        </Btn>
      ))}
      <span className="font-mono text-xl font-black w-12 text-center text-violet-900">{v}</span>
      {[1, 10].map((d) => (
        <Btn key={d} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, [key]: p[key] + d, invoice: null }))} className="px-2">
          +{d}
        </Btn>
      ))}
    </div>
  );

  return (
    <PlayShell
      title="Sugar Warehouse"
      mission={`Load the first order (${first.bags} bags of ${first.kg} kg) onto the weighbridge and let the pricing machine divide its invoice by the weight. Then set up the second order on the dials, load it, and print its invoice.`}
      icon={Package}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the invoice"
      live={
        <>
          <Gauge label="Weighbridge" value={w.firstLoaded ? `${firstKg} kg` : "empty"} />
          <Gauge label="Price per kg" value={w.rate !== null ? `₹${w.rate}` : "—"} tone="violet" />
          <Gauge label="Second order" value={`${w.bags} × ${w.kg} kg = ${w.bags * w.kg} kg`} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <Bay label={`First order · invoice ₹${first.cost.toLocaleString("en-IN")}`}>
          <div className="flex flex-wrap gap-0.5 min-h-[40px]">
            {w.firstLoaded && Array.from({ length: first.bags }).map((_, i) => <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.02 }} className="w-5 h-6 rounded-sm bg-stone-300 border border-stone-500" />)}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Btn disabled={play.readOnly || w.firstLoaded} onClick={() => play.patch({ firstLoaded: true })}>
              Load {first.bags} bags
            </Btn>
            <Btn tone="violet" active disabled={play.readOnly || !w.firstLoaded} onClick={() => play.patch({ rate: round(first.cost / firstKg, 4) })}>
              ₹{first.cost.toLocaleString("en-IN")} ÷ {w.firstLoaded ? firstKg : "?"} kg
            </Btn>
          </div>
        </Bay>
        <Bay label="Second order" tone="violet">
          {dial("Bags", w.bags, "bags")}
          {dial("kg per bag", w.kg, "kg")}
          <Btn className="mt-2" tone="emerald" active disabled={play.readOnly || w.rate === null} onClick={() => play.patch({ invoice: round(w.bags * w.kg * (w.rate ?? 0), 2) })}>
            🧾 Load and print invoice
          </Btn>
          {w.invoice !== null && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-mono text-sm font-black text-slate-800 bg-white border rounded p-2">
              {w.bags * w.kg} kg × ₹{w.rate} = ₹{w.invoice.toLocaleString("en-IN")}
            </motion.div>
          )}
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — Scholarship Data Observatory (3D)
   One tower per year. The student builds the pictograph by stacking star tokens on each
   tower, one star per so many students. The observatory then reads both challenges from
   the towers the student built.
   ══════════════════════════════════════════════════════════════════════ */

interface ObsWorld {
  stars: Record<number, number>;
}

function StarTower({ x, n, label, color }: { x: number; n: number; label: string; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = Math.max(1, n);
  useEffect(() => {
    const d = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      d.position.set(x, 0.18 + i * 0.3, 0);
      d.rotation.y = i * 0.3;
      d.updateMatrix();
      ref.current?.setMatrixAt(i, d.matrix);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [n, x]);
  return (
    <group>
      <mesh position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial color="#312e81" />
      </mesh>
      {n > 0 && (
        <instancedMesh key={count} ref={ref} args={[undefined, undefined, count]}>
          <octahedronGeometry args={[0.16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </instancedMesh>
      )}
      <Label3D text={label} position={[x, -0.25, 0.5]} rotation={[-0.6, 0, 0]} size={[0.9, 0.3]} style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.6 }} />
      <Label3D text={`${n} ★`} position={[x, 0.45 + n * 0.3, 0]} size={[0.7, 0.26]} billboard style={{ bg: null, fg: "#fde68a", scale: 0.7 }} />
    </group>
  );
}

export function B50DataObservatory({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const rows = cfg<{ year: number; students: number }[]>(question, "rows", []);
  const perStar = cfg<number>(question, "perStar", 500);
  const ask = cfg<{ count: number; more: number; than: number }>(question, "ask", { count: 0, more: 0, than: 0 });

  const play = usePlay<ObsWorld>({
    question,
    initial: { stars: Object.fromEntries(rows.map((r) => [r.year, 0])) },
    derive: (w) => {
      if (rows.some((r) => !w.stars[r.year])) return { note: "Stack stars on every year's tower." };
      const a = w.stars[ask.count];
      const b = w.stars[ask.more] - w.stars[ask.than];
      const text = `${a} and ${b}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const colors = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"];

  return (
    <PlayShell
      title="Scholarship Data Observatory"
      mission={`Build the pictograph: stack star tokens on each year's tower, one star for every ${perStar} students. The observatory reads the challenges from the towers you build: stars for ${ask.count}, and how many more stars ${ask.more} has than ${ask.than}.`}
      icon={Telescope}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit both readings"
      live={
        <>
          <Gauge label={`Stars for ${ask.count}`} value={w.stars[ask.count] ?? 0} tone="violet" />
          <Gauge label={`${ask.more} − ${ask.than}`} value={(w.stars[ask.more] ?? 0) - (w.stars[ask.than] ?? 0)} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-3">
        <Bay label="Scholarship records">
          <table className="w-full text-sm font-bold">
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-b border-slate-200">
                  <td className="py-1">{r.year}</td>
                  <td className="py-1 text-right font-mono">{r.students.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-slate-500 mt-2">★ = {perStar} students</p>
        </Bay>
        <Stage3D height={300} camera={{ position: [0, 3.2, 6.4], fov: 44 }} orbitTarget={[0, 1.4, 0]} readOnly={play.readOnly} background="#0b1026">
          {rows.map((r, i) => (
            <StarTower key={r.year} x={(i - 2) * 1.2} n={w.stars[r.year] ?? 0} label={String(r.year)} color={colors[i % colors.length]} />
          ))}
        </Stage3D>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {rows.map((r) => (
          <div key={r.year} className="rounded-xl border-2 border-indigo-200 p-1.5 text-center">
            <div className="text-xs font-black">{r.year}</div>
            <div className="font-mono text-lg font-black text-indigo-900">{w.stars[r.year] ?? 0} ★</div>
            <div className="flex justify-center gap-1">
              <Btn disabled={play.readOnly || !w.stars[r.year]} onClick={() => play.set((p) => ({ stars: { ...p.stars, [r.year]: p.stars[r.year] - 1 } }))} className="px-2">
                −
              </Btn>
              <Btn disabled={play.readOnly || (w.stars[r.year] ?? 0) >= 14} onClick={() => play.set((p) => ({ stars: { ...p.stars, [r.year]: (p.stars[r.year] ?? 0) + 1 } }))} className="px-2">
                +
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </PlayShell>
  );
}

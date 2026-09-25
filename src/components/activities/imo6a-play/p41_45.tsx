"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Thermometer, ShoppingCart, Candy, Wheat, School } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, money, round } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, Label3D, approach, Floor } from "./three";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — Temperature Elevator (2D)
   A thermometer on a hillside. At 8 p.m. the student drags the mercury to the evening
   reading and pins it; the clock moves to midnight and they drag it to the midnight
   reading. The drop gauge counts every degree the mercury passes on the way down.
   ══════════════════════════════════════════════════════════════════════ */

interface ThermoWorld {
  level: number;
  pins: Record<string, number>;
  phase: number;
}

export function Q41HillThermometer({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const readings = cfg<{ id: string; label: string; value: number }[]>(question, "readings", []);
  const scale = cfg<{ min: number; max: number; step: number }>(question, "scale", { min: -10, max: 10, step: 1 });
  const unit = cfg<string>(question, "unit", "°C");
  const svg = useRef<SVGSVGElement>(null);
  const Y = (t: number) => 14 + ((scale.max - t) / (scale.max - scale.min)) * 120;

  const play = usePlay<ThermoWorld>({
    question,
    initial: { level: 0, pins: {}, phase: 0 },
    derive: (w) => {
      if (readings.some((r) => w.pins[r.id] === undefined)) return { note: "Pin the mercury at each time of night." };
      const drop = w.pins[readings[0].id] - w.pins[readings[readings.length - 1].id];
      return { value: `${drop}${unit}`, optionId: matchNumber(question, drop), note: `From ${w.pins[readings[0].id]}${unit} to ${w.pins[readings[readings.length - 1].id]}${unit}` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const phase = readings[Math.min(w.phase, readings.length - 1)];
  const first = readings[0] ? w.pins[readings[0].id] : undefined;
  const passed = first !== undefined ? Math.max(0, first - w.level) : 0;

  const { start } = usePointerDrag({
    disabled: readOnly,
    onStart: (p) => setLevel(p.y),
    onMove: (p) => setLevel(p.y),
  });
  function setLevel(cy: number) {
    const r = svg.current?.getBoundingClientRect();
    if (!r) return;
    const y = ((cy - r.top) / r.height) * 150;
    const t = Math.round(scale.max - ((y - 14) / 120) * (scale.max - scale.min));
    const c = clamp(t, scale.min, scale.max);
    if (c !== w.level) play.patch({ level: c });
  }

  return (
    <PlayShell
      title="Temperature Elevator"
      mission="Drag the mercury up or down the thermometer to the reading for the time on the clock, then pin it. The clock moves on to midnight: drag the mercury to the midnight reading and pin that too. The drop gauge counts every degree passed."
      icon={Thermometer}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the temperature fall"
      live={
        <>
          <Gauge label="Mercury" value={`${w.level}${unit}`} tone="violet" />
          {readings.map((r) => (
            <Gauge key={r.id} label={`Pinned ${r.label}`} value={w.pins[r.id] !== undefined ? `${w.pins[r.id]}${unit}` : "—"} />
          ))}
          <Gauge label="Degrees passed" value={passed} tone="sky" />
        </>
      }
    >
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 rounded-2xl p-3 bg-gradient-to-b from-indigo-950 via-indigo-900 to-emerald-900 text-white">
        <div className="relative">
          <svg viewBox="0 0 200 150" className="w-full">
            <path d="M 0 150 L 60 50 L 100 90 L 150 30 L 200 150 Z" fill="#14532d" />
            <path d="M 140 45 L 150 30 L 160 45 Z" fill="#f8fafc" />
            <circle cx={170} cy={20} r={8} fill={w.phase === 0 ? "#fbbf24" : "#e2e8f0"} />
            <text x={10} y={20} fontSize={9} fontWeight={900} fill="#fff">
              🕗 {phase?.label}
            </text>
            <text x={10} y={32} fontSize={5} fill="#c7d2fe">
              the question says it read {phase?.value}
              {unit}
            </text>
          </svg>
        </div>
        <svg ref={svg} viewBox="0 0 70 150" className="w-36" style={{ touchAction: "none" }} onPointerDown={(e) => start(e, undefined)}>
          <rect x={28} y={10} width={14} height={128} rx={7} fill="#f8fafc" stroke="#94a3b8" />
          <circle cx={35} cy={140} r={9} fill="#ef4444" />
          <motion.rect x={31} width={8} fill="#ef4444" animate={{ y: Y(w.level), height: 140 - Y(w.level) }} />
          {Array.from({ length: scale.max - scale.min + 1 }).map((_, i) => {
            const t = scale.max - i;
            return (
              <g key={t}>
                <line x1={42} x2={t % 5 === 0 ? 50 : 46} y1={Y(t)} y2={Y(t)} stroke="#e2e8f0" strokeWidth={0.6} />
                {t % 2 === 0 && (
                  <text x={52} y={Y(t) + 1.6} fontSize={4.4} fill={t === 0 ? "#fde68a" : "#e2e8f0"} fontWeight={t === 0 ? 900 : 600}>
                    {t}
                  </text>
                )}
              </g>
            );
          })}
          {readings.map((r) =>
            w.pins[r.id] !== undefined ? (
              <g key={r.id}>
                <line x1={18} x2={28} y1={Y(w.pins[r.id])} y2={Y(w.pins[r.id])} stroke="#fbbf24" strokeWidth={1.4} />
                <text x={2} y={Y(w.pins[r.id]) + 1.5} fontSize={3.6} fill="#fbbf24" fontWeight={800}>
                  {r.label}
                </text>
              </g>
            ) : null
          )}
          {first !== undefined && w.level < first && <rect x={24} y={Y(first)} width={3} height={Y(w.level) - Y(first)} fill="#38bdf8" />}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {readings.map((r, i) => (
          <Btn
            key={r.id}
            tone="amber"
            active={w.pins[r.id] !== undefined}
            disabled={play.readOnly || w.phase !== i}
            onClick={() => play.set((p) => ({ ...p, pins: { ...p.pins, [r.id]: p.level }, phase: p.phase + 1 }))}
          >
            📌 Pin the {r.label} reading
          </Btn>
        ))}
        <Btn disabled={play.readOnly} onClick={() => play.set({ level: w.level, pins: {}, phase: 0 })}>
          Back to 8 p.m.
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — Grocery Checkout (2D)
   Sacks wait at the counter. Putting a sack on the scale shows its weight; bagging it
   rings it up at its rate. The student then pays by laying notes in the tray, and the
   change machine pays back the difference.
   ══════════════════════════════════════════════════════════════════════ */

interface ShopWorld {
  onScale: string | null;
  bagged: string[];
  tray: number[];
  paid: boolean;
}

export function Q42GroceryCheckout({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const items = cfg<{ id: string; label: string; kg: number; g: number; ratePerKg: number }[]>(question, "items", []);
  const tendered = cfg<number>(question, "tendered", 1000);
  const cur = cfg<string>(question, "currency", "₹");
  const notes = [500, 200, 100, 50, 20, 10];
  const lineOf = (it: (typeof items)[number]) => round((it.kg + it.g / 1000) * it.ratePerKg, 2);

  const play = usePlay<ShopWorld>({
    question,
    initial: { onScale: null, bagged: [], tray: [], paid: false },
    derive: (w) => {
      if (w.bagged.length < items.length) return { note: "Weigh and bag every item." };
      const bill = round(items.reduce((t, it) => t + lineOf(it), 0), 2);
      const given = w.tray.reduce((a, b) => a + b, 0);
      if (!w.paid) return { note: `The till shows ${money(bill, cur)}. Lay notes in the tray and pay.` };
      const change = round(given - bill, 2);
      return { value: money(change, cur), optionId: matchNumber(question, change, 5e-3), note: `Paid ${money(given, cur)} for a bill of ${money(bill, cur)}` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const scaleItem = items.find((i) => i.id === w.onScale);
  const bill = round(items.filter((i) => w.bagged.includes(i.id)).reduce((t, it) => t + lineOf(it), 0), 2);
  const given = w.tray.reduce((a, b) => a + b, 0);

  return (
    <PlayShell
      title="Grocery Checkout"
      mission={`Put each sack on the scale to weigh it, then bag it so the till rings it up. When everything is bagged, lay notes in the tray to hand over ${cur}${tendered} and pay. The change machine returns the difference.`}
      icon={ShoppingCart}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the change"
      live={
        <>
          <Gauge label="Bill so far" value={money(bill, cur)} tone="violet" />
          <Gauge label="In the tray" value={money(given, cur)} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <Bay label="Counter">
          <div className="flex flex-wrap gap-2">
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                disabled={play.readOnly || w.bagged.includes(it.id)}
                onClick={() => play.set((p) => ({ ...p, onScale: it.id, paid: false }))}
                className={`w-24 rounded-xl border-2 p-2 text-center ${w.onScale === it.id ? "border-violet-600 bg-violet-50" : w.bagged.includes(it.id) ? "opacity-40 border-slate-200" : "border-amber-300 bg-amber-50"}`}
              >
                <div className="text-3xl">🛍️</div>
                <div className="text-[11px] font-black">{it.label}</div>
                <div className="text-[10px] text-slate-500 font-bold">
                  {cur}
                  {it.ratePerKg} per kg
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-800 p-3 text-center">
            <div className="text-[10px] font-black text-slate-400">SCALE</div>
            <motion.div key={w.onScale ?? "none"} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-mono text-2xl font-black text-lime-300">
              {scaleItem ? `${scaleItem.kg} kg ${scaleItem.g} g` : "0 kg 0 g"}
            </motion.div>
            <Btn className="mt-2" tone="emerald" active disabled={play.readOnly || !scaleItem} onClick={() => play.set((p) => ({ ...p, bagged: [...p.bagged, p.onScale!], onScale: null }))}>
              Bag it and ring it up
            </Btn>
          </div>
        </Bay>
        <div className="space-y-3">
          <div className="rounded-xl bg-white border-2 border-slate-200 p-3 font-mono text-xs">
            <div className="text-center font-black text-slate-700 mb-1">— TILL RECEIPT —</div>
            {items
              .filter((i) => w.bagged.includes(i.id))
              .map((it) => (
                <motion.div key={it.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between">
                  <span>
                    {it.label} {it.kg} kg {it.g} g × {cur}
                    {it.ratePerKg}
                  </span>
                  <span className="font-black">{money(lineOf(it), cur)}</span>
                </motion.div>
              ))}
            <div className="border-t mt-1 pt-1 flex justify-between font-black">
              <span>TOTAL</span>
              <span>{money(bill, cur)}</span>
            </div>
          </div>
          <Bay label="Cash tray" tone="violet">
            <div className="flex flex-wrap gap-1 min-h-[40px]">
              <AnimatePresence>
                {w.tray.map((n, i) => (
                  <motion.button
                    key={`${n}-${i}`}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ scale: 0 }}
                    type="button"
                    disabled={play.readOnly}
                    onClick={() => play.set((p) => ({ ...p, paid: false, tray: p.tray.filter((_, j) => j !== i) }))}
                    className="px-2 py-1 rounded bg-emerald-200 border border-emerald-400 text-[11px] font-black"
                  >
                    {cur}
                    {n}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {notes.map((n) => (
                <Btn key={n} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, paid: false, tray: [...p.tray, n] }))}>
                  + {cur}
                  {n}
                </Btn>
              ))}
            </div>
            <Btn className="mt-2" tone="emerald" active disabled={play.readOnly || w.bagged.length < items.length || given < bill} onClick={() => play.patch({ paid: true })}>
              Pay {money(given, cur)}
            </Btn>
            {w.paid && (
              <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-2 font-mono text-lg font-black text-emerald-700">
                🪙 Change: {money(round(given - bill, 2), cur)}
              </motion.div>
            )}
          </Bay>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — Candy Sharing Game (2D)
   A candy jar and three friends. The student scoops candies onto Swati's plate (what she
   ate), into Jeny's jar (what Jeny kept) and into Sakshi's bag. The story's clues light up
   as they are met. What Swati ate is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface CandyWorld {
  plates: Record<string, number>;
}
const FRIENDS = [
  { id: "swati", label: "Swati ate", art: "👧" },
  { id: "jeny", label: "Jeny kept", art: "🧒" },
  { id: "sakshi", label: "Sakshi got", art: "👩" },
];

export function Q43CandySharing({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const steps = cfg<{ id: string; fixed?: number }[]>(question, "steps", []);
  const kept = steps.find((s) => s.id === "kept")?.fixed ?? 8;
  const sakshi = steps.find((s) => s.id === "sakshi")?.fixed ?? 10;

  const play = usePlay<CandyWorld>({
    question,
    initial: { plates: { swati: 0, jeny: 0, sakshi: 0 } },
    derive: (w) => {
      if (!w.plates.swati) return { note: "Scoop candies onto every plate." };
      if (!w.plates.jeny || !w.plates.sakshi) return { note: "Jeny and Sakshi both need candies too." };
      return { value: `${w.plates.swati} candies`, optionId: matchNumber(question, w.plates.swati) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const start = w.plates.swati + w.plates.jeny + w.plates.sakshi;
  const clues = [
    { label: `Jeny kept ${kept}`, met: w.plates.jeny === kept },
    { label: `Sakshi got the rest: ${sakshi}`, met: w.plates.sakshi === sakshi },
    { label: "Swati ate half of all her candies", met: start > 0 && w.plates.swati * 2 === start },
  ];

  return (
    <PlayShell
      title="Candy Sharing Game"
      mission="Scoop candies from the jar onto each friend's plate. Swati's plate is what she ate, Jeny's jar is what she kept, Sakshi's bag is what she was given. Keep adjusting until every clue in the story lights up."
      icon={Candy}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit what Swati ate"
      live={
        <>
          <Gauge label="Swati started with" value={start} tone="violet" />
          {clues.map((c) => (
            <Gauge key={c.label} label="Clue" value={`${c.met ? "✓" : "✗"} ${c.label}`} tone={c.met ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <div className="grid sm:grid-cols-3 gap-2">
        {FRIENDS.map((f) => (
          <div key={f.id} className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{f.art}</span>
              <div>
                <div className="text-[11px] font-black text-pink-900">{f.label}</div>
                <div className="font-mono text-2xl font-black text-pink-700">{w.plates[f.id]}</div>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-0.5 min-h-[28px]">
              {Array.from({ length: Math.min(60, w.plates[f.id]) }).map((_, i) => (
                <motion.span key={i} initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} className="w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${(i * 37) % 360} 85% 60%)` }} />
              ))}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {[-5, -1, 1, 5].map((d) => (
                <Btn key={d} disabled={play.readOnly || (d < 0 && w.plates[f.id] + d < 0)} onClick={() => play.set((p) => ({ plates: { ...p.plates, [f.id]: Math.max(0, p.plates[f.id] + d) } }))} className="px-2">
                  {d > 0 ? `+${d}` : d}
                </Btn>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 font-semibold">Swati gave Jeny everything she did not eat; Jeny kept some and gave the rest to Sakshi.</p>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — Farmer Packing Challenge (3D)
   Three silos hold each farmer's wheat. The student dials a bag size and fills the bags:
   sacks stack up beside each silo, and any wheat that cannot fill a whole bag spills onto
   the ground. The largest size that spills nothing anywhere is committed as the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface BagWorld {
  size: number;
  filled: number | null;
  tried: number[];
  committed: number | null;
}

function Silo({ x, kg, size, filled, label }: { x: number; kg: number; size: number | null; filled: boolean; label: string }) {
  const bags = filled && size ? Math.floor(kg / size) : 0;
  const spill = filled && size ? kg % size : 0;
  const sacks = useRef<THREE.InstancedMesh>(null);
  const shown = Math.min(bags, 60);
  useEffect(() => {
    const d = new THREE.Object3D();
    for (let i = 0; i < shown; i++) {
      d.position.set(x - 0.6 + (i % 5) * 0.3, 0.12 + Math.floor(i / 25) * 0.24, 1.1 + (Math.floor(i / 5) % 5) * 0.3);
      d.updateMatrix();
      sacks.current?.setMatrixAt(i, d.matrix);
    }
    if (sacks.current) sacks.current.instanceMatrix.needsUpdate = true;
  }, [shown, x]);
  const h = kg / 105;
  return (
    <group>
      <mesh position={[x, h / 2, -0.4]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, h, 28]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[x, h + 0.25, -0.4]} castShadow>
        <coneGeometry args={[0.6, 0.5, 28]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <Label3D text={`${label}: ${kg} kg`} position={[x, h + 0.9, -0.4]} size={[1.7, 0.36]} billboard style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.55 }} />
      {shown > 0 && (
        <instancedMesh key={shown} ref={sacks} args={[undefined, undefined, shown]} castShadow>
          <boxGeometry args={[0.24, 0.22, 0.24]} />
          <meshStandardMaterial color="#d4a373" />
        </instancedMesh>
      )}
      {filled && (
        <>
          {spill > 0 ? (
            <mesh position={[x + 0.6, 0.05, 0.3]} scale={[1, 0.3, 1]}>
              <sphereGeometry args={[0.15 + Math.min(0.5, spill / 60), 20, 12]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
          ) : (
            <mesh position={[x, 0.02, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.62, 0.78, 32]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          )}
          <Label3D text={spill ? `${bags} bags, ${spill} kg spilt` : `${bags} bags, no waste`} position={[x, 0.9, 1.9]} size={[1.9, 0.34]} billboard style={{ bg: spill ? "#b45309" : "#059669", fg: "#fff", scale: 0.55 }} />
        </>
      )}
    </group>
  );
}

export function Q44FarmerBagger({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const silos = cfg<{ id: string; label: string; kg: number }[]>(question, "silos", []);
  const range = cfg<{ min: number; max: number }>(question, "bagRange", { min: 1, max: 60 });
  const unit = cfg<string>(question, "unit", "kg");
  const wasteOf = (s: number) => silos.reduce((t, x) => t + (x.kg % s), 0);

  const play = usePlay<BagWorld>({
    question,
    initial: { size: 10, filled: null, tried: [], committed: null },
    derive: (w) => {
      if (w.committed === null) return { note: "Fill bags at a size that spills nothing, then commit it." };
      return { value: `${w.committed} ${unit}`, optionId: matchNumber(question, w.committed) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const zero = w.filled !== null && wasteOf(w.filled) === 0;

  return (
    <PlayShell
      title="Farmer Packing Challenge"
      mission="Dial a bag size and fill the bags. Every silo packs into whole bags and spills any wheat that cannot fill one. Find the largest bag size that spills nothing from any silo, and commit it."
      icon={Wheat}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the bag capacity"
      live={
        <>
          <Gauge label="Bag size" value={`${w.size} ${unit}`} tone="violet" />
          <Gauge label="Total spill" value={w.filled !== null ? `${wasteOf(w.filled)} ${unit}` : "—"} tone={zero ? "emerald" : "amber"} />
          <Gauge label="Zero-waste sizes tried" value={w.tried.filter((t) => wasteOf(t) === 0).sort((a, b) => a - b).join(", ") || "—"} tone="sky" />
        </>
      }
    >
      <Stage3D height={320} camera={{ position: [0, 3.4, 7.8], fov: 42 }} orbitTarget={[0, 1, 0.4]} readOnly={play.readOnly}>
        <Floor color="#e7e5c9" />
        {silos.map((s, i) => (
          <Silo key={s.id} x={(i - 1) * 2.6} kg={s.kg} size={w.filled} filled={w.filled !== null} label={s.label} />
        ))}
      </Stage3D>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">BAG SIZE:</span>
        {[-5, -1].map((d) => (
          <Btn key={d} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, size: clamp(p.size + d, range.min, range.max), filled: null, committed: null }))}>
            {d}
          </Btn>
        ))}
        <span className="font-mono text-2xl font-black text-violet-900 w-24 text-center whitespace-nowrap">
          {w.size} {unit}
        </span>
        {[1, 5].map((d) => (
          <Btn key={d} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, size: clamp(p.size + d, range.min, range.max), filled: null, committed: null }))}>
            +{d}
          </Btn>
        ))}
        <Btn tone="violet" active disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, filled: p.size, tried: [...new Set([...p.tried, p.size])], committed: null }))}>
          🌾 Fill the bags
        </Btn>
        <Btn tone="emerald" active disabled={play.readOnly || !zero} onClick={() => play.patch({ committed: w.filled })}>
          Commit {w.filled ?? ""} {unit} bags
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — Number Blackboard (2D)
   A classroom blackboard with chalk boxes for each number in the story. The student
   chalks in the digits of each number, then the teacher's machine adds the two
   children's numbers and takes away the smallest 4-digit number.
   ══════════════════════════════════════════════════════════════════════ */

interface BoardWorld {
  digits: Record<string, (number | null)[]>;
  cursor: { row: string; i: number } | null;
  worked: boolean;
}

export function Q45NumberBlackboard({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const writers = cfg<{ id: string; label: string; digits: number; extreme: string }[]>(question, "writers", []);
  const teacher = cfg<{ subtrahend: { digits: number; extreme: string } }>(question, "teacher", { subtrahend: { digits: 4, extreme: "smallest" } });
  const rows = [
    ...writers.map((w) => ({ id: w.id, label: `${w.label} writes the ${w.extreme} ${w.digits}-digit number`, n: w.digits })),
    { id: "teacher", label: `Teacher: the ${teacher.subtrahend.extreme} ${teacher.subtrahend.digits}-digit number`, n: teacher.subtrahend.digits },
  ];
  const numOf = (w: BoardWorld, id: string) => {
    const d = w.digits[id];
    return d && d.every((x) => x !== null) ? Number(d.join("")) : null;
  };

  const play = usePlay<BoardWorld>({
    question,
    initial: { digits: Object.fromEntries(rows.map((r) => [r.id, Array.from({ length: r.n }, () => null)])), cursor: null, worked: false },
    derive: (w) => {
      const nums = rows.map((r) => numOf(w, r.id));
      if (nums.some((n) => n === null)) return { note: "Chalk in every digit of every number." };
      if (!w.worked) return { note: "Run the teacher's machine." };
      const v = (nums[0] as number) + (nums[1] as number) - (nums[2] as number);
      return { value: String(v), optionId: matchNumber(question, v) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const nums = rows.map((r) => numOf(w, r.id));

  const write = (d: number) => {
    if (!w.cursor || play.readOnly) return;
    const { row, i } = w.cursor;
    if (i === 0 && d === 0) return; // a number never starts with 0
    play.set((p) => {
      const arr = [...p.digits[row]];
      arr[i] = d;
      const n = rows.find((r) => r.id === row)!.n;
      return { ...p, worked: false, digits: { ...p.digits, [row]: arr }, cursor: i + 1 < n ? { row, i: i + 1 } : null };
    });
  };

  return (
    <PlayShell
      title="Number Blackboard"
      mission="Tap a chalk box to choose it, then tap digits on the chalk tray to write. Each row must be the number the story describes (no number starts with 0). Then run the teacher's machine: the sum of the two children's numbers, minus the teacher's number."
      icon={School}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the teacher's answer"
      live={
        <>
          {rows.map((r, i) => (
            <Gauge key={r.id} label={r.id === "teacher" ? "Teacher" : writers[i]?.label ?? r.id} value={nums[i] ?? "—"} tone="violet" />
          ))}
        </>
      }
    >
      <div className="rounded-2xl border-8 border-amber-800 bg-[#1f3b2d] p-3 text-white space-y-3 shadow-inner">
        {rows.map((r) => (
          <div key={r.id}>
            <div className="text-[11px] font-bold text-emerald-200/80 mb-1" style={{ fontFamily: "cursive" }}>
              {r.label}
            </div>
            <div className="flex gap-1">
              {w.digits[r.id].map((d, i) => {
                const on = w.cursor?.row === r.id && w.cursor.i === i;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={play.readOnly}
                    onClick={() => play.patch({ cursor: { row: r.id, i } })}
                    className={`w-9 h-11 rounded border-2 font-mono text-2xl font-black ${on ? "border-yellow-300 bg-white/10" : "border-white/20"}`}
                    style={{ fontFamily: "'Comic Sans MS', cursive" }}
                  >
                    {d ?? ""}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {w.worked && nums.every((n) => n !== null) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-lg font-black text-yellow-200">
            ({nums[0]} + {nums[1]}) − {nums[2]} = {(nums[0] as number) + (nums[1] as number) - (nums[2] as number)}
          </motion.div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-500">CHALK TRAY:</span>
        {Array.from({ length: 10 }).map((_, d) => (
          <Btn key={d} disabled={play.readOnly || !w.cursor || (w.cursor.i === 0 && d === 0)} onClick={() => write(d)} className="w-10 font-mono text-base">
            {d}
          </Btn>
        ))}
        <Btn tone="emerald" active disabled={play.readOnly || nums.some((n) => n === null)} onClick={() => play.patch({ worked: true, cursor: null })}>
          Run the teacher's machine
        </Btn>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import { KeyRound, Map, Home, PenLine, Vault, Scale } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, gcd } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Label3D, approach, Floor } from "../imo6a-play/three";

const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const shiftLetter = (ch: string, s: number) => A[(((A.indexOf(ch) + s) % 26) + 26) % 26];

/* ══════════════════════════════════════════════════════════════════════
   Q3 — Secret Code Decryption Room (2D)
   A spy console with one alphabet wheel per letter. The student calibrates every wheel's
   shift until the example word encodes exactly like the intercepted code, then runs the
   target word through the same wheels and pulls the output letters onto the display.
   ══════════════════════════════════════════════════════════════════════ */

interface CipherWorld {
  shifts: number[];
  display: number[];
}

export function B03CipherRoom({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const ex = cfg<{ plain: string; coded: string }>(question, "example", { plain: "", coded: "" });
  const target = cfg<string>(question, "target", "");
  const n = Math.max(ex.plain.length, target.length);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (readOnly) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [readOnly]);

  const play = usePlay<CipherWorld>({
    question,
    initial: { shifts: Array.from({ length: n }, () => 0), display: [] },
    derive: (w) => {
      if (w.display.length < target.length) return { note: `Pull all ${target.length} decoded letters onto the display (${w.display.length} so far).` };
      const word = w.display.map((i) => shiftLetter(target[i], w.shifts[i])).join("");
      return { value: word, optionId: matchText(question, word) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const encoded = ex.plain.split("").map((c, i) => shiftLetter(c, w.shifts[i]));
  const calibrated = encoded.every((c, i) => c === ex.coded[i]);
  const setShift = (i: number, d: number) =>
    play.set((p) => ({ display: [], shifts: p.shifts.map((s, j) => (j === i ? Math.max(-5, Math.min(5, s + d)) : s)) }));

  return (
    <PlayShell
      title="Secret Code Decryption Room"
      mission={`Turn each wheel's shift until ${ex.plain} encodes as ${ex.coded} on the calibration strip. Red stamps mark letters that do not match yet. Then pull the decoded letters of ${target} onto the display in order.`}
      icon={KeyRound}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the decoded word"
      live={
        <>
          <Gauge label="Decrypt timer" value={`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`} tone="slate" />
          <Gauge label="Calibration" value={calibrated ? "locked on ✓" : `${encoded.filter((c, i) => c === ex.coded[i]).length}/${ex.plain.length} letters`} tone={calibrated ? "emerald" : "amber"} />
        </>
      }
    >
      <div className="rounded-2xl bg-slate-950 p-3 text-white overflow-x-auto">
        <div className="text-[10px] font-black tracking-widest text-emerald-400 mb-2">DECRYPT THE WORD</div>
        <div className="flex gap-2 min-w-max">
          {Array.from({ length: n }).map((_, i) => {
            const ok = encoded[i] === ex.coded[i];
            return (
              <div key={i} className="w-16 rounded-xl bg-slate-900 border border-slate-700 p-1.5 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 font-mono">{ex.plain[i] ?? ""}</span>
                <button type="button" disabled={play.readOnly} onClick={() => setShift(i, 1)} className="w-full h-7 rounded bg-slate-800 text-xs font-black" aria-label={`wheel ${i + 1} up`}>
                  ▲
                </button>
                <motion.div key={w.shifts[i]} initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} className="font-mono text-xs font-black text-amber-300">
                  {w.shifts[i] > 0 ? `+${w.shifts[i]}` : w.shifts[i]}
                </motion.div>
                <button type="button" disabled={play.readOnly} onClick={() => setShift(i, -1)} className="w-full h-7 rounded bg-slate-800 text-xs font-black" aria-label={`wheel ${i + 1} down`}>
                  ▼
                </button>
                <span className={`relative w-10 h-10 grid place-items-center rounded-lg font-mono text-xl font-black ${ok ? "bg-emerald-600" : "bg-rose-700"}`}>
                  {encoded[i] ?? ""}
                  {!ok && ex.plain[i] && <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-rose-500 rounded px-0.5 rotate-12">✗</span>}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">want {ex.coded[i] ?? ""}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[10px] font-black tracking-widest text-sky-400">TARGET: {target}</div>
        <div className="mt-1 flex gap-2 min-w-max">
          {target.split("").map((c, i) => {
            const used = w.display.includes(i);
            return (
              <button
                key={i}
                type="button"
                disabled={play.readOnly || used}
                onClick={() => play.patch({ display: [...w.display, i] })}
                className={`w-16 h-12 rounded-lg border-2 font-mono text-lg font-black ${used ? "border-slate-700 text-slate-600" : "border-sky-400 text-sky-200 hover:bg-sky-900"}`}
                aria-label={`pull decoded letter ${i + 1}`}
              >
                {c}→{shiftLetter(c, w.shifts[i])}
              </button>
            );
          })}
        </div>
      </div>
      <Bay label="Display" tone="violet">
        <div className="flex items-center gap-1.5 min-h-[48px]">
          {w.display.map((i, k) => (
            <motion.span key={k} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-10 h-12 grid place-items-center rounded-lg bg-violet-600 text-white font-mono text-2xl font-black">
              {shiftLetter(target[i], w.shifts[i])}
            </motion.span>
          ))}
          {!w.display.length && <span className="text-xs text-slate-400 font-semibold">Tap the target letters above to pull them here.</span>}
        </div>
        <Btn className="mt-2" disabled={play.readOnly || !w.display.length} onClick={() => play.patch({ display: [] })}>
          Clear display
        </Btn>
      </Bay>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — Pravin's Journey (3D)
   A top-down city grid. The student turns Pravin and walks him block by block, following
   the story. When they are done, a laser measures the straight-line distance back to the
   starting flag.
   ══════════════════════════════════════════════════════════════════════ */

type Heading = "N" | "E" | "S" | "W";
const HEADINGS: Heading[] = ["N", "E", "S", "W"];
const STEP_VEC: Record<Heading, [number, number]> = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };

interface WalkWorld {
  moves: Heading[];
  facing: Heading;
  lasered: boolean;
}

function walkPath(moves: Heading[], step: number) {
  const pts: [number, number][] = [[0, 0]];
  moves.forEach((h) => {
    const [x, z] = pts[pts.length - 1];
    pts.push([x + STEP_VEC[h][0] * step, z + STEP_VEC[h][1] * step]);
  });
  return pts;
}

function CityScene({ pts, facing, lasered, step }: { pts: [number, number][]; facing: Heading; lasered: boolean; step: number }) {
  const s = 1 / step; // world units per metre (one block = 1 unit)
  const me = useRef<THREE.Group>(null);
  const [ex, ez] = pts[pts.length - 1];
  const yaw = { N: Math.PI, E: Math.PI / 2, S: 0, W: -Math.PI / 2 }[facing];
  useFrame((_, dt) => {
    if (!me.current) return;
    me.current.position.x = approach(me.current.position.x, ex * s, 8, dt);
    me.current.position.z = approach(me.current.position.z, ez * s, 8, dt);
    me.current.rotation.y = approach(me.current.rotation.y, yaw, 10, dt);
  });
  const blocks: [number, number][] = [];
  for (let i = -3; i <= 4; i++) for (let j = -3; j <= 4; j++) blocks.push([i, j]);
  const dist = Math.hypot(ex, ez) * s;
  return (
    <>
      <Floor color="#cbd5e1" size={30} />
      {blocks.map(([i, j]) => (
        <mesh key={`${i},${j}`} position={[i + 0.5, 0.15 + ((i * 7 + j * 3) % 3) * 0.1, j + 0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.3 + ((i * 7 + j * 3) % 3) * 0.2, 0.7]} />
          <meshStandardMaterial color={["#a5b4fc", "#c4b5fd", "#fbcfe8"][((i + j) % 3 + 3) % 3]} />
        </mesh>
      ))}
      {/* start flag */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.15, 0.9, 0]}>
        <boxGeometry args={[0.3, 0.18, 0.02]} />
        <meshStandardMaterial color="#e11d48" />
      </mesh>
      {/* path trail */}
      {pts.slice(1).map((p, i) => {
        const [x0, z0] = pts[i];
        const cx = ((x0 + p[0]) / 2) * s;
        const cz = ((z0 + p[1]) / 2) * s;
        const horizontal = z0 === p[1];
        return (
          <mesh key={i} position={[cx, 0.03, cz]}>
            <boxGeometry args={[horizontal ? 1 : 0.08, 0.02, horizontal ? 0.08 : 1]} />
            <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
      <group ref={me}>
        <mesh castShadow position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.12, 0.25, 6, 12]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0, 0.34, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.06, 0.14, 10]} />
          <meshStandardMaterial color="#1e1b4b" />
        </mesh>
        <Label3D text="PRAVIN" position={[0, 0.75, 0]} size={[0.7, 0.2]} billboard style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.6 }} />
      </group>
      {lasered && dist > 0 && (
        <>
          <mesh position={[(ex * s) / 2, 0.4, (ez * s) / 2]} rotation={[0, -Math.atan2(ez, ex), Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, dist, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <Label3D text={`${Math.round(Math.hypot(ex, ez) * 100) / 100} m`} position={[(ex * s) / 2, 0.8, (ez * s) / 2]} size={[0.9, 0.3]} billboard style={{ bg: "#ef4444", fg: "#fff", scale: 0.6 }} />
        </>
      )}
      {HEADINGS.map((h) => {
        const [dx, dz] = STEP_VEC[h];
        return <Label3D key={h} text={h} position={[dx * 4.6 + 0.5, 0.05, dz * 4.6 + 0.5]} rotation={[-Math.PI / 2, 0, 0]} size={[0.5, 0.5]} style={{ bg: h === "N" ? "#e11d48" : "#1e1b4b", fg: "#fff" }} />;
      })}
    </>
  );
}

export function B04PravinJourney({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const step = cfg<number>(question, "step", 10);
  const startFacing = cfg<Heading>(question, "startFacing", "E");

  const play = usePlay<WalkWorld>({
    question,
    initial: { moves: [], facing: startFacing, lasered: false },
    derive: (w) => {
      if (!w.moves.length) return { note: "Walk Pravin through the story block by block." };
      if (!w.lasered) return { note: "Fire the laser to measure the distance back to the flag." };
      const [x, z] = walkPath(w.moves, step)[w.moves.length];
      const d = Math.round(Math.hypot(x, z) * 100) / 100;
      return { value: `${d} metres`, optionId: matchNumber(question, d) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const pts = walkPath(w.moves, step);
  const turn = (d: 1 | -1) => play.set((p) => ({ ...p, lasered: false, facing: HEADINGS[(HEADINGS.indexOf(p.facing) + d + 4) % 4] }));

  // Compress the walked moves into legs for the log.
  const legs: { h: Heading; m: number }[] = [];
  w.moves.forEach((h) => (legs.length && legs[legs.length - 1].h === h ? (legs[legs.length - 1].m += step) : legs.push({ h, m: step })));

  return (
    <PlayShell
      title="Pravin's Journey"
      mission={`Pravin starts at the red flag facing ${{ N: "North", E: "East", S: "South", W: "West" }[startFacing]}. Turn him and walk him block by block (each block is ${step} m) exactly as the story says. Then fire the laser to measure how far he is from the flag.`}
      icon={Map}
      dim="3D"
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
          <Gauge label="Facing" value={w.facing} tone="violet" />
          <Gauge label="Route" value={legs.map((l) => `${l.m} m ${l.h}`).join(" → ") || "—"} />
        </>
      }
    >
      <Stage3D height={340} camera={{ position: [0.5, 7.5, 5.5], fov: 45 }} orbitTarget={[0.5, 0, 0.5]} readOnly={play.readOnly}>
        <CityScene pts={pts} facing={w.facing} lasered={w.lasered} step={step} />
      </Stage3D>
      <div className="flex flex-wrap gap-2">
        <Btn disabled={play.readOnly} onClick={() => turn(-1)}>
          ↺ Turn left
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => turn(1)}>
          Turn right ↻
        </Btn>
        <Btn tone="violet" active disabled={play.readOnly || w.moves.length >= 16} onClick={() => play.set((p) => ({ ...p, lasered: false, moves: [...p.moves, p.facing] }))}>
          🚶 Walk {step} m
        </Btn>
        <Btn disabled={play.readOnly || !w.moves.length} onClick={() => play.set((p) => ({ ...p, lasered: false, moves: p.moves.slice(0, -1) }))}>
          ↶ Undo step
        </Btn>
        <Btn tone="rose" active disabled={play.readOnly || !w.moves.length} onClick={() => play.patch({ lasered: true })}>
          🔴 Fire laser to the flag
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q9 — Family Relationship House (2D)
   The family stands in the rooms of a house. The student follows the woman's sentence one
   link at a time: first her father, then the father's only daughter, then that person's
   husband. The house then names how the man stands to the woman.
   ══════════════════════════════════════════════════════════════════════ */

interface HouseWorld {
  father: string | null;
  daughter: string | null;
  husband: string | null;
}
const PEOPLE = [
  { id: "woman", label: "The woman (speaking)", art: "👩", room: "Living room" },
  { id: "father", label: "Her father", art: "👴", room: "Study" },
  { id: "mother", label: "Her mother", art: "👵", room: "Kitchen" },
  { id: "brother", label: "Her brother", art: "🧑", room: "Bedroom" },
  { id: "man", label: "The man in the picture", art: "👨", room: "Garden" },
];

export function B09FamilyHouse({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<HouseWorld>({
    question,
    initial: { father: null, daughter: null, husband: null },
    derive: (w) => {
      if (!w.father || !w.daughter || !w.husband) return { note: "Connect all three links of the sentence." };
      if (w.father !== "father") return { value: "The first link is not the woman's father", note: "“My father” is the woman's father." };
      if (w.daughter === "brother" || w.daughter === "mother") return { value: "That person is not a daughter of her father" };
      if (w.husband !== "man") return { value: "The husband link does not end at the man" };
      const rel = w.daughter === "woman" ? "Husband" : "Brother-in-law";
      return { value: rel, optionId: matchText(question, rel), note: w.daughter === "woman" ? "Her father's only daughter is the woman herself." : undefined };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const [slot, setSlot] = useState<keyof HouseWorld>("father");
  const slots: { k: keyof HouseWorld; label: string }[] = [
    { k: "father", label: "“my father” is…" },
    { k: "daughter", label: "“the only daughter of my father” is…" },
    { k: "husband", label: "“his wife is…” — so her husband is…" },
  ];

  return (
    <PlayShell
      title="Family Relationship House"
      mission="Choose a link of the woman's sentence, then tap the person in the house it points to. Follow all three links. The house then says how the man is related to the woman."
      icon={Home}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the relation"
    >
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-3">
        <div className="rounded-2xl border-4 border-amber-700 bg-amber-50 p-2 grid grid-cols-3 gap-2 relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl">🏠</div>
          {PEOPLE.map((p) => {
            const tagged = (Object.keys(w) as (keyof HouseWorld)[]).filter((k) => w[k] === p.id);
            return (
              <button
                key={p.id}
                type="button"
                disabled={play.readOnly}
                onClick={() => play.patch({ [slot]: p.id } as Partial<HouseWorld>)}
                className={`rounded-xl border-2 p-2 text-center bg-white ${tagged.length ? "border-violet-500" : "border-amber-200"}`}
              >
                <div className="text-[9px] font-black text-amber-700 uppercase">{p.room}</div>
                <div className="text-3xl">{p.art}</div>
                <div className="text-[11px] font-black text-slate-800 leading-tight">{p.label}</div>
                {tagged.map((t) => (
                  <div key={t} className="mt-0.5 text-[9px] font-black text-white bg-violet-600 rounded px-1">
                    {slots.find((s) => s.k === t)?.label.replace(/…$/, "")}
                  </div>
                ))}
              </button>
            );
          })}
        </div>
        <Bay label="The woman's sentence" tone="violet">
          <p className="text-sm font-bold text-slate-800 mb-2">“His wife is the only daughter of my father.”</p>
          <div className="space-y-1.5">
            {slots.map((s, i) => (
              <button
                key={s.k}
                type="button"
                disabled={play.readOnly}
                onClick={() => setSlot(s.k)}
                className={`w-full min-h-[44px] rounded-lg border-2 px-2 text-left text-xs font-bold ${slot === s.k ? "border-violet-600 bg-violet-100" : "border-slate-200 bg-white"}`}
              >
                Link {i + 1}: {s.label} <span className="text-violet-700">{w[s.k] ? PEOPLE.find((p) => p.id === w[s.k])?.label : "—"}</span>
              </button>
            ))}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — Pen Pricing Machine (2D)
   A stationery shop counter. Eight pens on the counter ring up as ₹w. The student splits
   the price to find one pen's cost, then drags pens into the second basket. The pricing
   machine prices the basket from the per-pen cost.
   ══════════════════════════════════════════════════════════════════════ */

interface PenWorld {
  split: boolean;
  basket: number;
}

function pennyText(n: number, d: number, sym: string) {
  const g = gcd(n, d) || 1;
  const a = n / g;
  const b = d / g;
  if (a === 0) return "₹ 0";
  if (b === 1) return a === 1 ? `₹ ${sym}` : `₹ ${a}${sym}`;
  return `₹ (${a === 1 ? "" : a}${sym}/${b})`;
}

export function B18PenShop({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const given = cfg<number>(question, "given", 8);
  const sym = cfg<string>(question, "symbol", "w");

  const play = usePlay<PenWorld>({
    question,
    initial: { split: false, basket: 0 },
    derive: (w) => {
      if (!w.split) return { note: "Split the counter price to find what one pen costs." };
      if (!w.basket) return { note: "Put pens into the second basket." };
      const text = pennyText(w.basket, given, sym);
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
      title="Pen Pricing Machine"
      mission={`${given} pens on the counter cost ₹${sym}. Press the splitter to price one pen, then tap pens to move them into the second basket. The pricing machine prices the basket.`}
      icon={PenLine}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the basket's price"
      live={
        <>
          <Gauge label="Counter" value={`${given} pens = ₹${sym}`} />
          <Gauge label="One pen" value={w.split ? pennyText(1, given, sym) : "not split yet"} tone="violet" />
          <Gauge label="Basket" value={`${w.basket} pens`} tone="sky" />
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <Bay label={`Counter · ${given} pens · price tag ₹${sym}`}>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: given }).map((_, i) => (
              <motion.button
                key={i}
                type="button"
                disabled={play.readOnly || !w.split || i < w.basket}
                onClick={() => play.patch({ basket: Math.min(given, w.basket + 1) })}
                animate={{ opacity: i < w.basket ? 0.2 : 1, y: i < w.basket ? -8 : 0 }}
                className="w-10 h-16 rounded-md bg-gradient-to-b from-sky-400 to-sky-700 text-white text-xl"
                aria-label={`pen ${i + 1}`}
              >
                🖊
              </motion.button>
            ))}
          </div>
          <Btn className="mt-2" tone="violet" active={w.split} disabled={play.readOnly} onClick={() => play.patch({ split: true })}>
            ÷ {given} — price one pen
          </Btn>
        </Bay>
        <Bay label="Second basket" tone="violet">
          <div className="min-h-[70px] flex flex-wrap gap-1">
            {Array.from({ length: w.basket }).map((_, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-12 rounded bg-sky-500 grid place-items-center text-white">
                🖊
              </motion.span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Btn disabled={play.readOnly || !w.basket} onClick={() => play.patch({ basket: w.basket - 1 })}>
              Put one back
            </Btn>
          </div>
          <div className="mt-2 font-mono text-lg font-black text-violet-900">
            {w.split && w.basket ? `${w.basket} × ${pennyText(1, given, sym).replace("₹ ", "₹")} = ${pennyText(w.basket, given, sym)}` : "—"}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — Divisibility Vault (2D)
   The vault code is the number with one missing digit. The student slots a digit key in,
   the scanner adds the digits and shows the remainder on division, and the door opens
   only for a number the divisor goes into exactly. The key in the lock is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface VaultWorld {
  digit: number | null;
  scanned: boolean;
  locked: number | null;
}

export function B22DivisibilityVault({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const left = cfg<string>(question, "left", "");
  const right = cfg<string>(question, "right", "");
  const divisor = cfg<number>(question, "divisor", 3);
  const keys = cfg<number[]>(question, "keys", [0, 1, 2, 3]);

  const play = usePlay<VaultWorld>({
    question,
    initial: { digit: null, scanned: false, locked: null },
    derive: (w) => {
      if (w.locked === null) return { note: "Scan a digit key, and keep the one that opens the vault." };
      return { value: String(w.locked), optionId: matchNumber(question, w.locked) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const number = `${left}${w.digit ?? "□"}${right}`;
  const digitSum = w.digit === null ? null : number.split("").reduce((t, c) => t + Number(c), 0);
  const rem = digitSum === null ? null : digitSum % divisor;
  const open = w.scanned && rem === 0;

  return (
    <PlayShell
      title="Divisibility Vault"
      mission={`Slot a digit key into the empty box, then run the scanner. It adds every digit of the code and shows the remainder on dividing by ${divisor}. The vault door opens only for a code that ${divisor} divides exactly. Lock in the key that opens it.`}
      icon={Vault}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the digit"
      live={
        <>
          <Gauge label="Digit sum" value={w.scanned && digitSum !== null ? digitSum : "—"} tone="violet" />
          <Gauge label={`Remainder ÷ ${divisor}`} value={w.scanned && rem !== null ? rem : "—"} tone={open ? "emerald" : "amber"} />
        </>
      }
    >
      <div className="rounded-2xl bg-gradient-to-b from-slate-700 to-slate-900 p-4 text-white">
        <div className="flex items-center justify-center gap-4">
          <motion.div animate={{ rotateY: open ? -70 : 0 }} style={{ transformOrigin: "left center" }} className="w-40 h-40 rounded-full border-8 border-slate-500 bg-slate-600 grid place-items-center shadow-inner">
            <motion.div animate={{ rotate: (w.digit ?? 0) * 36 }} className="w-24 h-24 rounded-full border-4 border-dashed border-amber-400 grid place-items-center text-4xl">
              {open ? "🔓" : "🔒"}
            </motion.div>
          </motion.div>
          <div className="font-mono text-3xl font-black tracking-widest">
            {number.split("").map((c, i) => (
              <span key={i} className={i === left.length ? "text-amber-300 underline" : ""}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">DIGIT KEYS:</span>
        {keys.map((k) => (
          <Btn key={k} tone="amber" active={w.digit === k} disabled={play.readOnly} onClick={() => play.set({ digit: k, scanned: false, locked: null })} className="w-12 text-lg">
            {k}
          </Btn>
        ))}
        <Btn tone="sky" active disabled={play.readOnly || w.digit === null} onClick={() => play.patch({ scanned: true })}>
          Run the scanner
        </Btn>
        <Btn tone="emerald" active disabled={play.readOnly || !open} onClick={() => play.patch({ locked: w.digit })}>
          Lock in key {w.digit ?? ""}
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — Integer Balance (3D)
   Each side of the comparison is a platform. The student feeds each side's terms onto its
   platform; the beam tilts with the true totals as they build up. Then they place a sign
   tile in the slot between the platforms.
   ══════════════════════════════════════════════════════════════════════ */

interface BalanceWorld {
  fed: [number, number];
  sign: string | null;
}

function Beam({ l, r, leftLabel, rightLabel }: { l: number; r: number; leftLabel: string; rightLabel: string }) {
  const beam = useRef<THREE.Group>(null);
  const lp = useRef<THREE.Group>(null);
  const rp = useRef<THREE.Group>(null);
  const tilt = Math.max(-0.35, Math.min(0.35, (l - r) / 180));
  useFrame((_, dt) => {
    if (!beam.current) return;
    beam.current.rotation.z = approach(beam.current.rotation.z, tilt, 3, dt);
    const a = beam.current.rotation.z;
    if (lp.current) lp.current.position.y = 2.2 - Math.sin(a) * 2;
    if (rp.current) rp.current.position.y = 2.2 + Math.sin(a) * 2;
  });
  return (
    <group>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.25, 2.6, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.6} />
      </mesh>
      <group ref={beam} position={[0, 2.7, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.4, 0.12, 0.18]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
      </group>
      {[
        { ref: lp, x: -2, v: l, t: leftLabel },
        { ref: rp, x: 2, v: r, t: rightLabel },
      ].map((p) => (
        <group key={p.x} ref={p.ref} position={[p.x, 2.2, 0]}>
          <RoundedBox args={[1.5, 0.14, 1.1]} radius={0.04} castShadow>
            <meshStandardMaterial color="#c7d2fe" />
          </RoundedBox>
          <Label3D text={p.t} position={[0, 0.5, 0]} size={[1.6, 0.42]} billboard style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.55 }} />
        </group>
      ))}
    </group>
  );
}

export function B24IntegerBalance({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const left = cfg<number[]>(question, "left", []);
  const right = cfg<number[]>(question, "right", []);
  const leftText = cfg<string>(question, "leftText", "");
  const rightText = cfg<string>(question, "rightText", "");
  const signs = cfg<string[]>(question, "signs", ["<", ">", "="]);

  const play = usePlay<BalanceWorld>({
    question,
    initial: { fed: [0, 0], sign: null },
    derive: (w) => {
      if (w.fed[0] < left.length || w.fed[1] < right.length) return { note: "Feed every term of both sides onto the platforms." };
      if (!w.sign) return { note: "Place a sign tile between the platforms." };
      return { value: w.sign, optionId: matchText(question, w.sign) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const lSum = left.slice(0, w.fed[0]).reduce((a, b) => a + b, 0);
  const rSum = right.slice(0, w.fed[1]).reduce((a, b) => a + b, 0);
  const fmt = (v: number) => (v < 0 ? `(−${-v})` : `+${v}`);

  return (
    <PlayShell
      title="Integer Balance"
      mission="Feed each side's terms onto its platform one at a time. Subtracting a negative number adds its size. The beam tilts with the real totals. When both sides are loaded, place the sign that belongs between them."
      icon={Scale}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the sign"
      live={
        <>
          <Gauge label="Left platform" value={w.fed[0] ? lSum : "empty"} tone="violet" />
          <Gauge label="Right platform" value={w.fed[1] ? rSum : "empty"} tone="violet" />
        </>
      }
    >
      <Stage3D height={300} camera={{ position: [0, 3.2, 7], fov: 42 }} orbitTarget={[0, 2, 0]} readOnly={play.readOnly}>
        <Floor />
        <Beam l={lSum} r={rSum} leftLabel={`LEFT ${w.fed[0] ? lSum : "—"}`} rightLabel={`RIGHT ${w.fed[1] ? rSum : "—"}`} />
        <Label3D text={w.sign ?? "?"} position={[0, 3.35, 0.3]} size={[0.6, 0.6]} billboard style={{ bg: w.sign ? "#7c3aed" : "#ffffff", fg: w.sign ? "#fff" : "#7c3aed", border: "#7c3aed" }} />
      </Stage3D>
      <div className="grid sm:grid-cols-2 gap-2">
        {[
          { side: 0, text: leftText, terms: left },
          { side: 1, text: rightText, terms: right },
        ].map((s) => (
          <Bay key={s.side} label={s.side ? "Right side" : "Left side"} tone="violet">
            <div className="font-mono text-sm font-black text-slate-800">{s.text}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {s.terms.map((t, i) => (
                <span key={i} className={`px-2 py-1 rounded font-mono text-xs font-black ${i < w.fed[s.side] ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {fmt(t)}
                </span>
              ))}
            </div>
            <Btn
              className="mt-2"
              disabled={play.readOnly || w.fed[s.side] >= s.terms.length}
              onClick={() => play.set((p) => ({ ...p, fed: (s.side ? [p.fed[0], p.fed[1] + 1] : [p.fed[0] + 1, p.fed[1]]) as [number, number] }))}
            >
              Feed next term
            </Btn>
          </Bay>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">SIGN TILES:</span>
        {signs.map((s) => (
          <Btn key={s} tone="violet" active={w.sign === s} disabled={play.readOnly} onClick={() => play.patch({ sign: s })} className="w-12 text-lg font-mono">
            {s}
          </Btn>
        ))}
      </div>
    </PlayShell>
  );
}

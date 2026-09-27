"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import { ScanLine, Shuffle, Layers3, CarFront, Shapes, Puzzle, Trees, Search, Grid3x3, Crosshair, Blocks, FlipHorizontal } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOptionState, sameSet } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Label3D, approach, Floor, usePlaneDrag } from "../imo6a-play/three";
import { clientToSvg } from "../imo6a-play/svgPoint";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — Symbol Security Scanner (3D)
   The character sequence rides a conveyor through a glass inspection chamber. The student
   runs, pauses or slows the belt, and pulls characters into the collection tray. The
   chamber shows what sits either side of the character inside it.
   ══════════════════════════════════════════════════════════════════════ */

const kindOf = (ch?: string) => (!ch ? "—" : /[0-9]/.test(ch) ? "NUMBER" : /[AEIOU]/.test(ch) ? "VOWEL" : /[A-Z]/.test(ch) ? "CONSONANT" : "SYMBOL");

function Belt({ seq, offset, tray, onPull }: { seq: string[]; offset: React.MutableRefObject<number>; tray: number[]; onPull: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const L = seq.length * 0.9;
  useFrame(() => {
    if (!group.current) return;
    group.current.children.forEach((c, i) => {
      const x = ((((i * 0.9 - offset.current) % L) + L) % L) - L / 2;
      c.position.x = x;
    });
  });
  return (
    <group ref={group}>
      {seq.map((ch, i) => (
        <group key={i} position={[0, 0.62, 0]} onClick={(e) => (e.stopPropagation(), onPull(i))}>
          <RoundedBox args={[0.7, 0.7, 0.18]} radius={0.06} castShadow>
            <meshStandardMaterial color={tray.includes(i) ? "#a78bfa" : "#ffffff"} />
          </RoundedBox>
          <Label3D text={ch} position={[0, 0, 0.1]} size={[0.6, 0.6]} style={{ bg: null, fg: kindOf(ch) === "SYMBOL" ? "#be123c" : "#1e1b4b" }} />
        </group>
      ))}
    </group>
  );
}

function Rollers({ speed }: { speed: React.MutableRefObject<number> }) {
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame((_, dt) => refs.current.forEach((m) => m && (m.rotation.x -= speed.current * dt * 3)));
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} ref={(m) => m && (refs.current[i] = m)} position={[-8.5 + i * 1.55, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.9, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
      ))}
    </>
  );
}

interface ScanWorld {
  tray: number[];
}

export function B01SymbolScanner({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const seq = cfg<string[]>(question, "sequence", []);
  const [mode, setMode] = useState<"run" | "pause" | "slow">("pause");
  const [zoom, setZoom] = useState(false);
  const offset = useRef(0);
  const speed = useRef(0);
  const [inChamber, setInChamber] = useState(0);

  const play = usePlay<ScanWorld>({
    question,
    initial: { tray: [] },
    derive: (w) => (!w.tray.length ? { note: "Pull every qualifying symbol into the collection tray." } : { value: `${w.tray.length} symbol${w.tray.length === 1 ? "" : "s"} collected`, optionId: matchText(question, ["Zero", "One", "Two", "Three", "Four", "Five"][w.tray.length] ?? String(w.tray.length)) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  function Driver() {
    useFrame((_, dt) => {
      const target = mode === "run" ? 1.2 : mode === "slow" ? 0.35 : 0;
      speed.current = approach(speed.current, target, 6, dt);
      offset.current += speed.current * dt;
      const L = seq.length * 0.9;
      // the chamber sits at x = 0: which tile is closest to it
      const idx = Math.round((((offset.current + L / 2) % L) + L) % L / 0.9) % seq.length;
      if (idx !== inChamber) setInChamber(idx);
    });
    return null;
  }

  const prev = seq[inChamber - 1];
  const next = seq[inChamber + 1];

  return (
    <PlayShell
      title="Symbol Security Scanner"
      mission="Run the belt and watch the glass chamber: it reports what kind of character is either side of the one inside. Tap a character on the belt to pull it into the collection tray (tap again to put it back). Collect every symbol that has a number just before it and a consonant just after it."
      icon={ScanLine}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the tray count"
      live={
        <>
          <Gauge label="In the chamber" value={`${kindOf(prev)} → ${seq[inChamber]} → ${kindOf(next)}`} tone="violet" />
          <Gauge label="Collection tray" value={w.tray.map((i) => seq[i]).join(" ") || "empty"} tone="amber" />
        </>
      }
    >
      <Stage3D height={zoom ? 360 : 280} camera={{ position: [0, zoom ? 1.6 : 2.6, zoom ? 3.2 : 6.5], fov: 42 }} orbitTarget={[0, 0.6, 0]} readOnly={play.readOnly}>
        <Floor />
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <boxGeometry args={[19, 0.1, 1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <Rollers speed={speed} />
        <Belt seq={seq} offset={offset} tray={w.tray} onPull={(i) => !play.readOnly && play.set((p) => ({ tray: p.tray.includes(i) ? p.tray.filter((x) => x !== i) : [...p.tray, i] }))} />
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.05, 1.1, 1.2]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.18} />
        </mesh>
        {[-0.45, 0.45].map((x) => (
          <mesh key={x} position={[x, 1.45, 0.62]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={mode === "pause" ? "#f59e0b" : "#ef4444"} emissive={mode === "pause" ? "#f59e0b" : "#ef4444"} emissiveIntensity={1} />
          </mesh>
        ))}
        <Driver />
      </Stage3D>
      <div className="flex flex-wrap gap-2">
        <Btn tone="emerald" active={mode === "run"} disabled={play.readOnly} onClick={() => setMode("run")}>
          ▶ Start
        </Btn>
        <Btn tone="amber" active={mode === "pause"} disabled={play.readOnly} onClick={() => setMode("pause")}>
          ⏸ Pause
        </Btn>
        <Btn tone="sky" active={mode === "slow"} disabled={play.readOnly} onClick={() => setMode("slow")}>
          ⏪ Slow motion
        </Btn>
        <Btn active={zoom} disabled={play.readOnly} onClick={() => setZoom((z) => !z)}>
          🔍 Zoom
        </Btn>
      </div>
      <Bay label="The full arrangement (tap to pull, same as on the belt)">
        <div className="flex flex-wrap gap-1 font-mono">
          {seq.map((ch, i) => (
            <button
              key={i}
              type="button"
              disabled={play.readOnly}
              onClick={() => play.set((p) => ({ tray: p.tray.includes(i) ? p.tray.filter((x) => x !== i) : [...p.tray, i] }))}
              className={`w-9 h-10 rounded border-2 text-lg font-black ${w.tray.includes(i) ? "bg-violet-600 border-violet-700 text-white" : "bg-white border-slate-200"}`}
              aria-label={`character ${i + 1}: ${ch}`}
            >
              {ch}
            </button>
          ))}
        </div>
      </Bay>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q6 — Number Swap Race (2D)
   Each car wears the number on its front plate, split across front and rear digits. The
   student swaps each car's plates, then starts the race: cars finish in order of their
   new numbers, smallest first. The student flags the car that finished in the position
   the question asks about.
   ══════════════════════════════════════════════════════════════════════ */

interface RaceWorld {
  swapped: boolean[];
  raced: boolean;
  flagged: number | null;
}
const swapFL = (n: number) => {
  const s = String(n).split("");
  [s[0], s[s.length - 1]] = [s[s.length - 1], s[0]];
  return Number(s.join(""));
};

export function B06NumberSwapRace({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const nums = cfg<number[]>(question, "numbers", []);
  const rank = cfg<number>(question, "rank", 1);
  const play = usePlay<RaceWorld>({
    question,
    initial: { swapped: nums.map(() => false), raced: false, flagged: null },
    derive: (w) => {
      if (!w.raced) return { note: "Swap the plates and start the race." };
      if (w.flagged === null) return { note: `Flag the car that finished ${rank === 2 ? "second" : `#${rank}`}.` };
      return { value: `Car ${nums[w.flagged]}`, optionId: matchNumber(question, nums[w.flagged]) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const plate = (i: number) => (w.swapped[i] ? swapFL(nums[i]) : nums[i]);
  const order = [...nums.keys()].sort((a, b) => plate(a) - plate(b));
  const COLORS = ["#8b5cf6", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e"];

  return (
    <PlayShell
      title="Number Swap Race"
      mission={`Tap a car's plates to swap its first and last digits. When every car is ready, start the race: cars finish in order of their plate numbers, smallest first. Flag the car that finishes ${rank === 2 ? "second" : `in position ${rank}`}.`}
      icon={CarFront}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the flagged car"
      live={<Gauge label="Plates swapped" value={`${w.swapped.filter(Boolean).length} / ${nums.length}`} tone="violet" />}
    >
      <div className="rounded-2xl bg-slate-100 border-2 border-slate-200 p-3 space-y-2">
        {nums.map((n, i) => {
          const place = order.indexOf(i);
          return (
            <div key={n} className="relative h-12 rounded-lg bg-white border-b-2 border-dashed border-slate-300">
              <motion.button
                type="button"
                disabled={play.readOnly}
                animate={{ left: w.raced ? `${78 - place * 14}%` : "2%" }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                onClick={() => (w.raced ? play.patch({ flagged: i }) : play.set((p) => ({ ...p, swapped: p.swapped.map((s, j) => (j === i ? !s : s)) })))}
                className={`absolute top-1 h-10 px-2 rounded-lg text-white font-mono text-lg font-black flex items-center gap-1 ${w.flagged === i ? "ring-4 ring-yellow-300" : ""}`}
                style={{ background: COLORS[i % COLORS.length] }}
                aria-label={`car ${n}`}
              >
                🏎 {plate(i)}
                {w.raced && <span className="text-[10px] bg-white/30 rounded px-1">#{place + 1}</span>}
              </motion.button>
              <span className="absolute right-2 top-3 text-xl">🏁</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn tone="emerald" active disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, raced: true, flagged: null }))}>
          🚦 Start the race
        </Btn>
        <Btn disabled={play.readOnly || !w.raced} onClick={() => play.set((p) => ({ ...p, raced: false, flagged: null }))}>
          Back to the grid
        </Btn>
        {w.raced && <span className="text-[11px] font-bold text-slate-600 self-center">Tap a car to flag it. Original number shown on the car's paperwork: {nums.map((n, i) => `${plate(i)}←${n}`).join(", ")}</span>}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — Fruit / Mango / Grass Ecosystem (3D)
   Three transparent zones stand on a meadow. The student drags each zone and resizes it,
   and drags the ecosystem's objects (a mango, an apple, a grass tuft) into the zones they
   belong to. The shape the finished zones make is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface Zone {
  x: number;
  z: number;
  r: number;
}
interface EcoWorld {
  zones: Record<string, Zone>;
  items: Record<string, { x: number; z: number }>;
  selected: string;
}
const ITEMS = [
  { id: "mango", label: "Mango", inside: ["Fruit", "Mango"], color: "#f59e0b" },
  { id: "apple", label: "Apple", inside: ["Fruit"], color: "#dc2626" },
  { id: "grass", label: "Grass", inside: ["Grass"], color: "#16a34a" },
];
const ZONE_COLOR: Record<string, string> = { Fruit: "#f472b6", Mango: "#f59e0b", Grass: "#22c55e" };
const inZ = (z: Zone, p: { x: number; z: number }) => Math.hypot(p.x - z.x, p.z - z.z) <= z.r;
const zSub = (a: Zone, b: Zone) => Math.hypot(a.x - b.x, a.z - b.z) + a.r <= b.r + 0.01;
const zApart = (a: Zone, b: Zone) => Math.hypot(a.x - b.x, a.z - b.z) >= a.r + b.r - 0.01;

function classifyEco(z: Record<string, Zone>): string | undefined {
  const F = z.Fruit;
  const M = z.Mango;
  const G = z.Grass;
  const pairs = [
    [F, M],
    [F, G],
    [M, G],
  ];
  if (pairs.every(([a, b]) => zApart(a, b))) return "all-separate";
  if ((zSub(M, F) && zSub(G, M)) || (zSub(G, F) && zSub(M, G)) || (zSub(F, M) && zSub(G, F))) return "nested-three";
  const nestedPair = zSub(M, F) || zSub(F, M) || zSub(G, F) || zSub(F, G) || zSub(M, G) || zSub(G, M);
  if (nestedPair) {
    const third = zSub(M, F) || zSub(F, M) ? G : zSub(G, F) || zSub(F, G) ? M : F;
    const others = [F, M, G].filter((x) => x !== third);
    if (others.every((o) => zApart(third, o))) return "nested-plus-separate";
  }
  return "overlap-plus-separate";
}

function ZoneMesh({ name, zone, onMove, readOnly }: { name: string; zone: Zone; onMove: (x: number, z: number) => void; readOnly?: boolean }) {
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const drag = usePlaneDrag({ plane, disabled: readOnly, onDrag: (p) => onMove(clamp(p.x, -4, 4), clamp(p.z, -3, 3)) });
  return (
    <group position={[zone.x, 0, zone.z]}>
      <mesh position={[0, 0.3, 0]} {...drag}>
        <cylinderGeometry args={[zone.r, zone.r, 0.6, 48, 1, true]} />
        <meshStandardMaterial color={ZONE_COLOR[name]} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} {...drag}>
        <circleGeometry args={[zone.r, 48]} />
        <meshStandardMaterial color={ZONE_COLOR[name]} transparent opacity={0.18} />
      </mesh>
      <Label3D text={name.toUpperCase()} position={[0, 0.9, -zone.r + 0.1]} size={[1.1, 0.3]} billboard style={{ bg: ZONE_COLOR[name], fg: "#fff", scale: 0.6 }} />
    </group>
  );
}

function ItemMesh({ id, pos, color, onMove, readOnly }: { id: string; pos: { x: number; z: number }; color: string; onMove: (x: number, z: number) => void; readOnly?: boolean }) {
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const drag = usePlaneDrag({ plane, disabled: readOnly, onDrag: (p) => onMove(clamp(p.x, -4.5, 4.5), clamp(p.z, -3.5, 3.5)) });
  return (
    <group position={[pos.x, 0, pos.z]}>
      <mesh position={[0, 0.25, 0]} castShadow {...drag}>
        {id === "grass" ? <coneGeometry args={[0.2, 0.5, 6]} /> : <sphereGeometry args={[0.22, 20, 20]} />}
        <meshStandardMaterial color={color} />
      </mesh>
      <Label3D text={id} position={[0, 0.7, 0]} size={[0.8, 0.22]} billboard style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.6 }} />
    </group>
  );
}

export function B10Ecosystem({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const labels = cfg<string[]>(question, "labels", ["Fruit", "Mango", "Grass"]);
  const play = usePlay<EcoWorld>({
    question,
    initial: {
      zones: { Fruit: { x: -2.5, z: 0, r: 1 }, Mango: { x: 0, z: 0, r: 1 }, Grass: { x: 2.5, z: 0, r: 1 } },
      items: { mango: { x: -2, z: 2.8 }, apple: { x: 0, z: 2.8 }, grass: { x: 2, z: 2.8 } },
      selected: "Fruit",
    },
    derive: (w) => {
      const wrong = ITEMS.filter((it) => labels.some((l) => inZ(w.zones[l], w.items[it.id]) !== it.inside.includes(l)));
      if (wrong.length) return { note: `${wrong.map((x) => x.label).join(", ")} ${wrong.length === 1 ? "is" : "are"} not yet inside exactly the zones it belongs to.` };
      const kind = classifyEco(w.zones);
      const words: Record<string, string> = {
        "all-separate": "Three separate zones",
        "nested-three": "Three zones one inside another",
        "nested-plus-separate": "One zone inside another, a third apart",
        "overlap-plus-separate": "Two zones overlapping, a third apart",
      };
      return { value: words[kind ?? ""] ?? "—", optionId: matchOptionState(question, kind, (o, b) => o === b) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <PlayShell
      title="Fruit · Mango · Grass Ecosystem"
      mission="Drag the three transparent zones around the meadow and resize them. Then drag the mango, the apple and the grass tuft into exactly the zones they belong to: a mango is a fruit; grass is not. The shape your zones make is read when everything is home."
      icon={Trees}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the ecosystem"
    >
      <Stage3D height={330} camera={{ position: [0, 6.5, 6], fov: 44 }} readOnly={play.readOnly} orbit={false}>
        <Floor color="#bbf7d0" />
        {labels.map((l) => (
          <ZoneMesh key={l} name={l} zone={w.zones[l]} readOnly={play.readOnly} onMove={(x, z) => play.set((p) => ({ ...p, selected: l, zones: { ...p.zones, [l]: { ...p.zones[l], x, z } } }))} />
        ))}
        {ITEMS.map((it) => (
          <ItemMesh key={it.id} id={it.id} pos={w.items[it.id]} color={it.color} readOnly={play.readOnly} onMove={(x, z) => play.set((p) => ({ ...p, items: { ...p.items, [it.id]: { x, z } } }))} />
        ))}
      </Stage3D>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">RESIZE:</span>
        {labels.map((l) => (
          <Btn key={l} active={w.selected === l} disabled={play.readOnly} onClick={() => play.patch({ selected: l })}>
            {l}
          </Btn>
        ))}
        <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, zones: { ...p.zones, [p.selected]: { ...p.zones[p.selected], r: Math.max(0.5, p.zones[p.selected].r - 0.25) } } }))}>
          − smaller
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, zones: { ...p.zones, [p.selected]: { ...p.zones[p.selected], r: Math.min(3, p.zones[p.selected].r + 0.25) } } }))}>
          + bigger
        </Btn>
        <span className="text-[11px] font-semibold text-slate-500">{w.selected}: radius {w.zones[w.selected].r.toFixed(2)}</span>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — Number Grid Reactor (2D)
   The grid is a 3 × 3 reactor of energy cells. The student picks a rule on the control
   panel and the reactor tests it on every complete row (green) — then dials the missing
   cell. The dial reading is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const RULES: { id: string; label: string; f: (a: number, b: number, row: number) => number }[] = [
  { id: "sum", label: "third = first + second", f: (a, b) => a + b },
  { id: "diffk", label: "third = difference + 5, 4, 3 (one less each row)", f: (a, b, r) => Math.abs(a - b) + (5 - r) },
  { id: "prod", label: "third = first × second", f: (a, b) => a * b },
  { id: "avg", label: "third = first + second − 1", f: (a, b) => a + b - 1 },
];

interface ReactorWorld {
  rule: string | null;
  dial: number;
  loaded: boolean;
}

export function B12NumberReactor({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const grid = cfg<(number | null)[][]>(question, "grid", []);
  const play = usePlay<ReactorWorld>({
    question,
    initial: { rule: null, dial: 0, loaded: false },
    derive: (w) => (!w.loaded ? { note: "Dial the missing cell and load it into the reactor." } : { value: String(w.dial), optionId: matchNumber(question, w.dial) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const rule = RULES.find((r) => r.id === w.rule);
  const rowOk = (r: number) => {
    const [a, b, c] = grid[r];
    return rule && c !== null ? rule.f(a as number, b as number, r) === c : null;
  };

  return (
    <PlayShell
      title="Number Grid Reactor"
      mission="Choose a rule on the control panel: the reactor tests it on every complete row and lights them green or red. When you have a rule that holds, dial the missing energy cell and load it."
      icon={Grid3x3}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the missing cell"
      live={<Gauge label="Rule tested" value={rule?.label ?? "none"} tone="violet" />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="rounded-2xl bg-indigo-50 border-2 border-indigo-200 p-3 grid gap-2">
          {grid.map((row, r) => (
            <div key={r} className={`flex gap-2 rounded-xl p-1 ${rowOk(r) === true ? "bg-emerald-500/30" : rowOk(r) === false ? "bg-rose-500/30" : ""}`}>
              {row.map((v, c) => (
                <motion.div key={c} animate={{ boxShadow: v === null ? "0 0 18px #a78bfa" : "0 0 6px #22d3ee" }} className="w-14 h-14 rounded-full grid place-items-center font-mono text-2xl font-black text-white bg-gradient-to-br from-cyan-500 to-indigo-700">
                  {v ?? (w.loaded ? w.dial : "?")}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Bay label="Rule control panel" tone="violet">
            <div className="grid gap-1.5">
              {RULES.map((r) => (
                <Btn key={r.id} active={w.rule === r.id} disabled={play.readOnly} onClick={() => play.patch({ rule: r.id })} className="text-left">
                  {r.label}
                </Btn>
              ))}
            </div>
          </Bay>
          <Bay label="Missing-cell dial">
            <div className="flex items-center gap-2">
              <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, loaded: false, dial: Math.max(0, p.dial - 1) }))}>
                −
              </Btn>
              <span className="font-mono text-3xl font-black w-12 text-center">{w.dial}</span>
              <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, loaded: false, dial: p.dial + 1 }))}>
                +
              </Btn>
              <Btn tone="emerald" active disabled={play.readOnly} onClick={() => play.patch({ loaded: true })}>
                ⚡ Load cell
              </Btn>
            </div>
          </Bay>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — Word Factory (2D)
   Four letter blocks ride into the press. The student arranges them in the press slots
   and stamps; a real word goes onto the collection shelf, a non-word is scrapped. When the
   student has tried enough arrangements they ship the shelf count.
   ══════════════════════════════════════════════════════════════════════ */

interface WordWorld {
  slots: number[];
  shelf: string[];
  scrap: string[];
  shipped: boolean;
}

export function B14WordFactory({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const letters = cfg<string[]>(question, "letters", []);
  const dict = cfg<string[]>(question, "dictionary", []);
  const play = usePlay<WordWorld>({
    question,
    initial: { slots: [], shelf: [], scrap: [], shipped: false },
    derive: (w) => {
      if (!w.shipped) return { note: "Stamp arrangements, then ship the shelf." };
      const n = w.shelf.length;
      return { value: `${n} meaningful word${n === 1 ? "" : "s"}`, optionId: matchText(question, ["Zero", "One", "Two", "Three", "Four"][n] ?? "") ?? matchText(question, "None of these") };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const word = w.slots.map((i) => letters[i]).join("");
  const stamp = () =>
    play.set((p) => {
      const wd = p.slots.map((i) => letters[i]).join("");
      if (dict.includes(wd)) return { ...p, slots: [], shelf: p.shelf.includes(wd) ? p.shelf : [...p.shelf, wd], shipped: false };
      return { ...p, slots: [], scrap: p.scrap.includes(wd) ? p.scrap : [...p.scrap, wd], shipped: false };
    });

  return (
    <PlayShell
      title="Word Factory"
      mission="Tap the letter blocks to load them into the press, left to right, using each block once. Stamp the arrangement: meaningful English words go onto the shelf, others are scrapped. Try as many arrangements as you need, then ship the shelf."
      icon={Blocks}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the word count"
      live={
        <>
          <Gauge label="Shelf" value={w.shelf.join(", ") || "empty"} tone="emerald" />
          <Gauge label="Arrangements tried" value={w.shelf.length + w.scrap.length} />
        </>
      }
    >
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-3">
        <div className="flex gap-2 justify-center">
          {letters.map((l, i) => (
            <motion.button key={l} type="button" disabled={play.readOnly || w.slots.includes(i) || w.slots.length >= letters.length} onClick={() => play.patch({ slots: [...w.slots, i] })} animate={{ y: w.slots.includes(i) ? 30 : 0, opacity: w.slots.includes(i) ? 0.3 : 1 }} className="w-14 h-14 rounded-lg bg-amber-300 border-b-4 border-amber-600 font-black text-2xl">
              {l}
            </motion.button>
          ))}
        </div>
        <div className="mt-6 flex gap-2 justify-center">
          {letters.map((_, k) => (
            <div key={k} className="w-14 h-14 rounded-lg border-2 border-dashed border-amber-400 grid place-items-center text-2xl font-black text-amber-900">
              {w.slots[k] !== undefined ? letters[w.slots[k]] : ""}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-2">
          <Btn tone="violet" active disabled={play.readOnly || w.slots.length < letters.length} onClick={stamp}>
            🔨 Stamp “{word}”
          </Btn>
          <Btn disabled={play.readOnly || !w.slots.length} onClick={() => play.patch({ slots: [] })}>
            Clear press
          </Btn>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Bay label="Collection shelf (words)" tone="violet">
          <div className="flex flex-wrap gap-1">{w.shelf.map((x) => <span key={x} className="px-2 py-1 rounded bg-emerald-600 text-white font-black text-sm">{x}</span>)}</div>
        </Bay>
        <Bay label="Scrap bin">
          <div className="flex flex-wrap gap-1">{w.scrap.map((x) => <span key={x} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono text-xs line-through">{x}</span>)}</div>
        </Bay>
      </div>
      <Btn tone="emerald" active disabled={play.readOnly || !(w.shelf.length + w.scrap.length)} onClick={() => play.patch({ shipped: true })}>
        🚚 Ship the shelf
      </Btn>
    </PlayShell>
  );
}


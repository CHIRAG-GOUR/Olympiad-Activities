"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Factory, Truck, Flower2, CalendarClock, BedDouble } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, gcd, round } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, Label3D, approach, Floor } from "./three";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — Strawberry Packing Factory (3D)
   Strawberries ride the conveyor. The student sets how many rotten berries the sorting
   robot must pull off and runs it, then sets the number of boxes and runs the packer. The
   packer shares the remaining berries equally and spills anything that will not share.
   ══════════════════════════════════════════════════════════════════════ */

interface FactoryWorld {
  discard: number;
  sorted: number | null;
  boxes: number;
  packed: number | null;
}

function Conveyor({ running }: { running: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const rotten = useRef<THREE.InstancedMesh>(null);
  const N = 28;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const speed = useRef(0.6);
  const t = useRef(0);
  useFrame((_, dt) => {
    speed.current = approach(speed.current, running ? 2.4 : 0.6, 3, dt);
    t.current += dt * speed.current;
    for (let i = 0; i < N; i++) {
      const x = ((i * 0.42 + t.current) % (N * 0.42)) - (N * 0.42) / 2;
      const isRotten = i % 7 === 3;
      dummy.position.set(x, 1.12 + Math.sin(i * 1.7) * 0.02, Math.sin(i * 2.3) * 0.18);
      // Rotten berries past the robot (x > 1.2) have been plucked off the belt.
      const gone = isRotten && x > 1.2;
      dummy.scale.setScalar(gone ? 0.0001 : 1);
      dummy.updateMatrix();
      (isRotten ? rotten.current : ref.current)?.setMatrixAt(i, dummy.matrix);
      if (isRotten) {
        dummy.scale.setScalar(0.0001);
        dummy.updateMatrix();
        ref.current?.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.setScalar(0.0001);
        dummy.updateMatrix();
        rotten.current?.setMatrixAt(i, dummy.matrix);
      }
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    if (rotten.current) rotten.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[N * 0.42, 0.2, 0.8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * N * 0.42) / 2, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.82, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
      ))}
      {[-4, -1.5, 1.5, 4].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]} castShadow>
          <boxGeometry args={[0.12, 0.85, 0.6]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
      <instancedMesh ref={ref} args={[undefined, undefined, N]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#e11d48" roughness={0.4} />
      </instancedMesh>
      <instancedMesh ref={rotten} args={[undefined, undefined, N]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

function Robot({ active }: { active: boolean }) {
  const arm = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (arm.current) arm.current.rotation.z = active ? Math.sin(clock.elapsedTime * 6) * 0.5 : approach(arm.current.rotation.z, 0, 4, 0.016);
  });
  return (
    <group position={[1.2, 0, -1]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.8, 16]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      <group ref={arm} position={[0, 1.8, 0]}>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1, 12]} />
          <meshStandardMaterial color="#a78bfa" />
        </mesh>
        <mesh position={[0, -0.25, 1]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>
    </group>
  );
}

function BoxYard({ boxes, perBox, spill }: { boxes: number; perBox: number | null; spill: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const fill = useRef<THREE.InstancedMesh>(null);
  const n = Math.max(1, Math.min(120, boxes));
  const cols = 19;
  useEffect(() => {
    const d = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      d.position.set(-4.5 + (i % cols) * 0.5, 0.15, 1.3 + Math.floor(i / cols) * 0.5);
      d.scale.setScalar(1);
      d.updateMatrix();
      ref.current?.setMatrixAt(i, d.matrix);
      d.position.y = 0.26;
      d.scale.set(1, perBox ? 1 : 0.0001, 1);
      d.updateMatrix();
      fill.current?.setMatrixAt(i, d.matrix);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    if (fill.current) fill.current.instanceMatrix.needsUpdate = true;
  }, [n, perBox]);
  return (
    <group>
      <instancedMesh key={`b${n}`} ref={ref} args={[undefined, undefined, n]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <meshStandardMaterial color="#d6b48c" />
      </instancedMesh>
      <instancedMesh key={`f${n}`} ref={fill} args={[undefined, undefined, n]}>
        <boxGeometry args={[0.34, 0.06, 0.34]} />
        <meshStandardMaterial color="#e11d48" />
      </instancedMesh>
      {spill > 0 && (
        <mesh position={[5, 0.1, 2]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#fb7185" />
        </mesh>
      )}
    </group>
  );
}

export function Q36StrawberryFactory({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = cfg<number>(question, "total", 12000);
  const label = cfg<string>(question, "itemLabel", "strawberries");

  const play = usePlay<FactoryWorld>({
    question,
    initial: { discard: 0, sorted: null, boxes: 1, packed: null },
    derive: (w) => {
      if (w.sorted === null) return { note: "Set the robot to remove the rotten berries and run the sorter." };
      if (w.packed === null) return { note: "Set the number of boxes and run the packer." };
      const left = total - w.sorted;
      const spill = left % w.packed;
      if (spill) return { note: `${spill} ${label} spill over — the boxes cannot be filled equally.` };
      const per = left / w.packed;
      return { value: `${per} per box`, optionId: matchNumber(question, per) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const remaining = w.sorted === null ? total : total - w.sorted;
  const per = w.packed ? Math.floor(remaining / w.packed) : null;
  const spill = w.packed ? remaining % w.packed : 0;
  const [runningSort, setRunningSort] = React.useState(false);

  const dial = (label: string, v: number, set: (n: number) => void, max: number) => (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-black text-slate-500 w-24">{label}</span>
      {[-10, -1].map((d) => (
        <Btn key={d} disabled={play.readOnly} onClick={() => set(clamp(v + d, 0, max))}>
          {d}
        </Btn>
      ))}
      <span className="font-mono text-xl font-black text-violet-900 w-14 text-center">{v}</span>
      {[1, 10].map((d) => (
        <Btn key={d} disabled={play.readOnly} onClick={() => set(clamp(v + d, 0, max))}>
          +{d}
        </Btn>
      ))}
    </div>
  );

  return (
    <PlayShell
      title="Strawberry Packing Factory"
      mission="Dial how many rotten berries the sorting robot must pull off the belt and run it. Then dial the number of boxes and run the packer. It shares the remaining berries out equally and spills anything that will not share."
      icon={Factory}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit berries per box"
      live={
        <>
          <Gauge label="Delivered" value={total} />
          <Gauge label="Thrown away" value={w.sorted ?? "—"} tone="rose" />
          <Gauge label="On the belt" value={remaining} tone="violet" />
          <Gauge label="Per box" value={per ?? "—"} tone="emerald" />
          {w.packed !== null && <Gauge label="Spill" value={spill} tone={spill ? "amber" : "emerald"} />}
        </>
      }
    >
      <Stage3D height={320} camera={{ position: [0, 3.4, 6.2], fov: 44 }} orbitTarget={[0, 0.8, 0.8]} readOnly={play.readOnly}>
        <Floor />
        <Conveyor running={runningSort} />
        <Robot active={runningSort} />
        <mesh position={[2.2, 0.35, -1.3]} castShadow>
          <cylinderGeometry args={[0.45, 0.35, 0.7, 20, 1, true]} />
          <meshStandardMaterial color="#57534e" side={THREE.DoubleSide} />
        </mesh>
        <Label3D text={`REJECT BIN ${w.sorted ?? 0}`} position={[2.2, 1.05, -1.3]} size={[1.4, 0.34]} billboard style={{ bg: "#1c1917", fg: "#fff", scale: 0.55 }} />
        <Label3D text={`${remaining} ON BELT`} position={[-3.6, 1.7, 0]} size={[1.8, 0.4]} billboard style={{ bg: "#7c3aed", fg: "#fff", scale: 0.55 }} />
        {w.packed !== null && <BoxYard boxes={w.packed} perBox={per} spill={spill} />}
        {w.packed !== null && per !== null && <Label3D text={`${per} IN EVERY BOX`} position={[0, 1.6, 2.4]} size={[2.2, 0.45]} billboard style={{ bg: spill ? "#b45309" : "#059669", fg: "#fff", scale: 0.55 }} />}
      </Stage3D>
      <div className="grid md:grid-cols-2 gap-3">
        <Bay label="Sorting robot" tone="violet">
          {dial("Rotten to remove", w.discard, (n) => play.set((p) => ({ ...p, discard: n, sorted: null, packed: null })), 1000)}
          <Btn
            className="mt-2"
            tone="violet"
            active
            disabled={play.readOnly}
            onClick={() => {
              setRunningSort(true);
              setTimeout(() => setRunningSort(false), 1600);
              play.set((p) => ({ ...p, sorted: p.discard, packed: null }));
            }}
          >
            ▶ Run the sorter
          </Btn>
        </Bay>
        <Bay label="Packer" tone="violet">
          {dial("Boxes", w.boxes, (n) => play.set((p) => ({ ...p, boxes: Math.max(1, n), packed: null })), 120)}
          <Btn className="mt-2" tone="emerald" active disabled={play.readOnly || w.sorted === null} onClick={() => play.patch({ packed: w.boxes })}>
            ▶ Run the packer
          </Btn>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q37 — Party Supply Logistics (2D)
   Packs of glasses and packs of straws sit on warehouse shelves. The student loads packs
   onto the truck, watching the two counters. The truck can only be dispatched when both
   counters match and cover every guest.
   ══════════════════════════════════════════════════════════════════════ */

interface TruckWorld {
  load: Record<string, number>;
  dispatched: Record<string, number> | null;
}

export function Q37PartyTruck({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const guests = cfg<number>(question, "guests", 480);
  const items = cfg<{ id: string; label: string; perPack: number; max: number }[]>(question, "items", []);

  const play = usePlay<TruckWorld>({
    question,
    initial: { load: Object.fromEntries(items.map((i) => [i.id, 0])), dispatched: null },
    derive: (w) => {
      if (!w.dispatched) return { note: `Load the truck until both counters match and reach ${guests}, then dispatch.` };
      const [g, s] = items.map((i) => w.dispatched![i.id]);
      const text = `${g} packs of ${items[0].label.toLowerCase()} and ${s} packs of ${items[1].label.toLowerCase()}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const totals = items.map((i) => w.load[i.id] * i.perPack);
  const canGo = totals.every((t) => t === totals[0]) && totals[0] >= guests;

  return (
    <PlayShell
      title="Party Supply Logistics"
      mission={`Tap a pack on the shelf to load it onto the truck; tap a pack on the truck to put it back. You need exactly as many glasses as straws, enough for ${guests} guests, from as few packs as possible.`}
      icon={Truck}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the dispatched load"
      live={
        <>
          {items.map((it, i) => (
            <Gauge key={it.id} label={it.label.toUpperCase()} value={`${w.load[it.id]} packs = ${totals[i]}`} tone={totals[i] >= guests ? "emerald" : "violet"} />
          ))}
          <Gauge label="Counters match" value={totals.every((t) => t === totals[0]) ? "yes" : "no"} tone={totals.every((t) => t === totals[0]) ? "emerald" : "amber"} />
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <Bay label="Warehouse shelves">
          {items.map((it) => (
            <div key={it.id} className="mb-2">
              <div className="text-[10px] font-black text-slate-500 mb-1">
                {it.label.toUpperCase()} · {it.perPack} per pack
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: Math.max(0, it.max - w.load[it.id]) }).map((_, k) => (
                  <motion.button
                    key={k}
                    layout
                    type="button"
                    disabled={play.readOnly}
                    onClick={() => play.set((p) => ({ ...p, dispatched: null, load: { ...p.load, [it.id]: Math.min(it.max, p.load[it.id] + 1) } }))}
                    className={`w-9 h-9 rounded-md border-2 text-[10px] font-black ${it.id === "glasses" ? "bg-sky-100 border-sky-300 text-sky-800" : "bg-pink-100 border-pink-300 text-pink-800"}`}
                  >
                    {it.id === "glasses" ? "🥤" : "🥢"}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </Bay>
        <div className="rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-slate-300 p-3">
          <div className="text-[10px] font-black text-slate-500 mb-2">🚚 TRUCK BED</div>
          <div className="min-h-[120px] rounded-xl bg-slate-700 p-2 flex flex-wrap gap-1 content-start">
            <AnimatePresence>
              {items.flatMap((it) =>
                Array.from({ length: w.load[it.id] }).map((_, k) => (
                  <motion.button
                    key={`${it.id}-${k}`}
                    initial={{ scale: 0, y: -30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    type="button"
                    disabled={play.readOnly}
                    onClick={() => play.set((p) => ({ ...p, dispatched: null, load: { ...p.load, [it.id]: Math.max(0, p.load[it.id] - 1) } }))}
                    className={`w-8 h-8 rounded-md text-sm ${it.id === "glasses" ? "bg-sky-300" : "bg-pink-300"}`}
                  >
                    {it.id === "glasses" ? "🥤" : "🥢"}
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Btn tone="emerald" active disabled={play.readOnly || !canGo} onClick={() => play.patch({ dispatched: { ...w.load } })}>
              Dispatch the truck
            </Btn>
            {w.dispatched && (
              <motion.span initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-xs font-black text-emerald-700">
                🚚💨 dispatched
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — Garden Designer (2D)
   The plot is drawn to scale. Five square flower beds sit beside it. The student drags
   every bed onto the plot; beds must lie fully on the land and must not overlap. The live
   meter reads land, dug area and the grass that is left.
   ══════════════════════════════════════════════════════════════════════ */

interface GardenWorld {
  beds: ({ x: number; y: number } | null)[];
}

export function Q38GardenDesigner({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const land = cfg<{ length: number; width: number }>(question, "land", { length: 4.8, width: 4.2 });
  const bed = cfg<{ side: number; count: number }>(question, "bed", { side: 1.2, count: 5 });
  const unit = cfg<string>(question, "unit", "sq. m");
  const dp = cfg<number>(question, "decimals", 2);
  const S = 20;
  const vbW = land.length * S + 40;
  const vbH = land.width * S + 12;
  const svg = useRef<SVGSVGElement>(null);

  const valid = (beds: GardenWorld["beds"], i: number) => {
    const b = beds[i];
    if (!b) return false;
    const inLand = b.x >= -1e-9 && b.y >= -1e-9 && b.x + bed.side <= land.length + 1e-9 && b.y + bed.side <= land.width + 1e-9;
    const overlap = beds.some((o, j) => j !== i && o && b.x < o.x + bed.side - 1e-9 && o.x < b.x + bed.side - 1e-9 && b.y < o.y + bed.side - 1e-9 && o.y < b.y + bed.side - 1e-9);
    return inLand && !overlap;
  };

  const play = usePlay<GardenWorld>({
    question,
    initial: { beds: Array.from({ length: bed.count }, () => null) },
    derive: (w) => {
      const ok = w.beds.map((_, i) => valid(w.beds, i));
      if (!ok.every(Boolean)) return { note: `${ok.filter((x) => !x).length} bed(s) still to dig fully on the land without overlapping.` };
      const left = round(land.length * land.width - bed.count * bed.side * bed.side, dp);
      return { value: `${left.toFixed(dp)} ${unit}`, optionId: matchNumber(question, left, 5e-3) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const dug = w.beds.filter((_, i) => valid(w.beds, i)).length;

  return (
    <PlayShell
      title="Garden Designer"
      mission="Drag each square flower bed from the shed onto the plot. A bed only counts once it lies fully on the land without overlapping another. The live meter shows the land, the dug area, and the grass that is left."
      icon={Flower2}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the remaining area"
      live={
        <>
          <Gauge label="Total land" value={`${land.length} × ${land.width} = ${round(land.length * land.width, dp)} ${unit}`} />
          <Gauge label="Beds dug" value={`${dug} × ${bed.side}² = ${round(dug * bed.side * bed.side, dp)} ${unit}`} tone="rose" />
          <Gauge label="Grass left" value={`${round(land.length * land.width - dug * bed.side * bed.side, dp)} ${unit}`} tone="emerald" />
        </>
      }
    >
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-2">
        <svg ref={svg} viewBox={`0 0 ${vbW} ${vbH}`} className="w-full max-h-[380px]" style={{ touchAction: "none" }}>
          <rect x={6} y={6} width={land.length * S} height={land.width * S} fill="#86efac" stroke="#15803d" strokeWidth={0.6} />
          {/* Faint 0.6 m survey grid */}
          {Array.from({ length: Math.floor(land.length / 0.6) + 1 }).map((_, i) => (
            <line key={`gx${i}`} x1={6 + i * 0.6 * S} x2={6 + i * 0.6 * S} y1={6} y2={6 + land.width * S} stroke="#15803d" strokeWidth={0.12} />
          ))}
          {Array.from({ length: Math.floor(land.width / 0.6) + 1 }).map((_, i) => (
            <line key={`gy${i}`} x1={6} x2={6 + land.length * S} y1={6 + i * 0.6 * S} y2={6 + i * 0.6 * S} stroke="#15803d" strokeWidth={0.12} />
          ))}
          <text x={6 + (land.length * S) / 2} y={4.5} textAnchor="middle" fontSize={3} fontWeight={800} fill="#14532d">
            {land.length} m
          </text>
          <text x={4} y={6 + (land.width * S) / 2} textAnchor="middle" fontSize={3} fontWeight={800} fill="#14532d" transform={`rotate(-90 4 ${6 + (land.width * S) / 2})`}>
            {land.width} m
          </text>
          <rect x={vbW - 31} y={6} width={28} height={vbH - 12} rx={2} fill="#fde68a" stroke="#d97706" strokeWidth={0.4} />
          <text x={vbW - 17} y={10} textAnchor="middle" fontSize={2.6} fontWeight={800} fill="#92400e">
            SHED
          </text>
          {w.beds.map((b, i) => (
            <BedPiece
              key={i}
              i={i}
              b={b}
              side={bed.side}
              S={S}
              svg={svg}
              vb={[vbW, vbH]}
              shedPos={{ x: vbW - 29 + (i % 2) * 13, y: 12 + Math.floor(i / 2) * 13 }}
              valid={valid(w.beds, i)}
              readOnly={play.readOnly}
              onDrop={(pos) => play.set((p) => ({ beds: p.beds.map((x, j) => (j === i ? pos : x)) }))}
              land={land}
            />
          ))}
        </svg>
      </div>
    </PlayShell>
  );
}

function BedPiece({
  i,
  b,
  side,
  S,
  svg,
  vb,
  shedPos,
  valid,
  readOnly,
  onDrop,
  land,
}: {
  i: number;
  b: { x: number; y: number } | null;
  side: number;
  S: number;
  svg: React.RefObject<SVGSVGElement | null>;
  vb: [number, number];
  shedPos: { x: number; y: number };
  valid: boolean;
  readOnly?: boolean;
  onDrop: (p: { x: number; y: number } | null) => void;
  land: { length: number; width: number };
}) {
  const [drag, setDrag] = React.useState<{ x: number; y: number } | null>(null);
  const grab = useRef({ dx: 0, dy: 0 });
  const size = b || drag ? side * S : 11;
  const px = drag ? drag.x : b ? 6 + b.x * S : shedPos.x;
  const py = drag ? drag.y : b ? 6 + b.y * S : shedPos.y;
  const toVb = (cx: number, cy: number) => {
    const r = svg.current?.getBoundingClientRect();
    if (!r) return null;
    return { x: ((cx - r.left) / r.width) * vb[0], y: ((cy - r.top) / r.height) * vb[1] };
  };
  const { start } = usePointerDrag({
    disabled: readOnly,
    onStart: (p) => {
      const q = toVb(p.x, p.y);
      if (q) grab.current = b ? { dx: q.x - px, dy: q.y - py } : { dx: (side * S) / 2, dy: (side * S) / 2 };
    },
    onMove: (p) => {
      const q = toVb(p.x, p.y);
      if (q) setDrag({ x: q.x - grab.current.dx, y: q.y - grab.current.dy });
    },
    onEnd: () => {
      if (drag) {
        // Snap to a 10 cm grid on the plot; beds dropped off the plot go back to the shed.
        const mx = Math.round(((drag.x - 6) / S) * 10) / 10;
        const my = Math.round(((drag.y - 6) / S) * 10) / 10;
        const onPlot = mx > -side / 2 && my > -side / 2 && mx < land.length && my < land.width;
        onDrop(onPlot ? { x: round(mx, 1), y: round(my, 1) } : null);
      }
      setDrag(null);
    },
  });
  return (
    <g aria-label={`flower bed ${i + 1}`} onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: readOnly ? "default" : "grab", touchAction: "none" }}>
      <rect x={px} y={py} width={size} height={size} rx={0.8} fill={b && !valid && !drag ? "#fca5a5" : "#a16207"} stroke={valid ? "#fff" : "#7f1d1d"} strokeWidth={0.4} opacity={drag ? 0.85 : 1} />
      <text x={px + size / 2} y={py + size / 2 + 1.5} textAnchor="middle" fontSize={size > 12 ? 5 : 4} pointerEvents="none">
        🌷
      </text>
      <text x={px + 1} y={py + 3} fontSize={2.4} fontWeight={800} fill="#fff" pointerEvents="none">
        {i + 1}
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q39 — Age Timeline (2D)
   Two life timelines, one per person, marked in years around today. The student slides
   each person's marker to the year the question asks about; their age at that moment is
   read off. The ratio machine then lets the student cancel common factors.
   ══════════════════════════════════════════════════════════════════════ */

interface AgeWorld {
  offsets: Record<string, number>;
  divided: number;
}

export function Q39AgeTimeline({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const people = cfg<{ id: string; label: string; ageNow: number; offsetLabel: string }[]>(question, "people", []);
  const order = cfg<string[]>(question, "ratioOrder", []);
  const range = cfg<{ min: number; max: number }>(question, "yearRange", { min: -6, max: 6 });
  const [shake, setShake] = React.useState<number | null>(null);

  const play = usePlay<AgeWorld>({
    question,
    initial: { offsets: Object.fromEntries(people.map((p) => [p.id, 0])), divided: 1 },
    derive: (w) => {
      const [a, b] = order.map((id) => people.find((p) => p.id === id)!.ageNow + w.offsets[id]);
      if (people.every((p) => w.offsets[p.id] === 0)) return { note: "Slide each marker to the year the question talks about." };
      const text = `${a / w.divided} : ${b / w.divided}`;
      const lowest = gcd(a / w.divided, b / w.divided) === 1;
      return { value: text, optionId: matchText(question, text), note: lowest ? "In lowest terms." : "This ratio can still be simplified." };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const ages = order.map((id) => people.find((p) => p.id === id)!.ageNow + (w.offsets[id] ?? 0));
  const X = (off: number) => 10 + ((off - range.min) / (range.max - range.min)) * 180;

  return (
    <PlayShell
      title="Age Timeline"
      mission="Slide each person's marker along their timeline to the moment the question asks about: backwards for years ago, forwards for years hence. Their age there appears on the marker. Then cancel common factors in the ratio machine."
      icon={CalendarClock}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the ratio"
      live={
        <>
          {people.map((p) => (
            <Gauge key={p.id} label={p.label} value={`${p.ageNow + w.offsets[p.id]} yrs (${w.offsets[p.id] === 0 ? "now" : w.offsets[p.id] < 0 ? `${-w.offsets[p.id]} yrs ago` : `${w.offsets[p.id]} yrs hence`})`} tone="violet" />
          ))}
        </>
      }
    >
      <div className="space-y-2">
        {people.map((p) => (
          <TimelineRow key={p.id} p={p} off={w.offsets[p.id]} X={X} range={range} readOnly={play.readOnly} onOff={(o) => play.set((pw) => ({ offsets: { ...pw.offsets, [p.id]: o }, divided: 1 }))} />
        ))}
      </div>
      <Bay label="Ratio machine" tone="violet">
        <div className="flex flex-wrap items-center gap-3">
          <motion.div animate={shake !== null ? { x: [0, -6, 6, -3, 0] } : {}} className="font-mono text-3xl font-black text-violet-900">
            {ages[0] / w.divided} : {ages[1] / w.divided}
          </motion.div>
          <div className="flex gap-1.5">
            {[2, 3, 5, 7].map((f) => (
              <Btn
                key={f}
                disabled={play.readOnly}
                onClick={() => {
                  const a = ages[0] / w.divided;
                  const b = ages[1] / w.divided;
                  if (a % f === 0 && b % f === 0) play.patch({ divided: w.divided * f });
                  else {
                    setShake(f);
                    setTimeout(() => setShake(null), 400);
                  }
                }}
              >
                ÷ {f}
              </Btn>
            ))}
            <Btn disabled={play.readOnly || w.divided === 1} onClick={() => play.patch({ divided: 1 })}>
              undo
            </Btn>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold mt-1">
          Order: {order.map((id) => people.find((p) => p.id === id)?.label).join(" : ")}
        </p>
      </Bay>
    </PlayShell>
  );
}

function TimelineRow({
  p,
  off,
  X,
  range,
  readOnly,
  onOff,
}: {
  p: { id: string; label: string; ageNow: number; offsetLabel: string };
  off: number;
  X: (o: number) => number;
  range: { min: number; max: number };
  readOnly?: boolean;
  onOff: (o: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const { start } = usePointerDrag({
    disabled: readOnly,
    onMove: (pt) => {
      const r = svg.current?.getBoundingClientRect();
      if (!r) return;
      const x = ((pt.x - r.left) / r.width) * 200;
      const o = Math.round(range.min + ((x - 10) / 180) * (range.max - range.min));
      const c = clamp(o, range.min, range.max);
      if (c !== off) onOff(c);
    },
  });
  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-2">
      <div className="text-[11px] font-black text-slate-700">
        {p.label} <span className="text-slate-400 font-semibold">— question asks: {p.offsetLabel}</span>
      </div>
      <svg ref={svg} viewBox="0 0 200 34" className="w-full" style={{ touchAction: "none" }}>
        <line x1={10} x2={190} y1={20} y2={20} stroke="#1e1b4b" strokeWidth={0.6} />
        {Array.from({ length: range.max - range.min + 1 }).map((_, i) => {
          const o = range.min + i;
          return (
            <g key={o}>
              <line x1={X(o)} x2={X(o)} y1={17} y2={23} stroke="#1e1b4b" strokeWidth={o === 0 ? 1 : 0.4} />
              <text x={X(o)} y={31} fontSize={3.4} textAnchor="middle" fill={o === 0 ? "#7c3aed" : "#64748b"} fontWeight={o === 0 ? 900 : 600}>
                {o === 0 ? "now" : o > 0 ? `+${o}` : o}
              </text>
            </g>
          );
        })}
        <g aria-label={`${p.label} marker`} onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: "grab", touchAction: "none" }}>
          <rect x={X(off) - 9} y={3} width={18} height={11} rx={3} fill="#7c3aed" />
          <text x={X(off)} y={10.5} textAnchor="middle" fontSize={5} fontWeight={900} fill="#fff">
            {p.ageNow + off}
          </text>
          <path d={`M ${X(off) - 3} 14 L ${X(off)} 18 L ${X(off) + 3} 14 Z`} fill="#7c3aed" />
          <rect x={X(off) - 12} y={0} width={24} height={24} fill="transparent" />
        </g>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — Bed Sheet Designer (2D)
   The sheet's length edge is labelled x. The student builds the breadth edge from algebra
   blocks. The sheet stretches live as the length slider moves, and the perimeter frame
   adds two lengths and two breadths, collecting like terms.
   ══════════════════════════════════════════════════════════════════════ */

interface SheetWorld {
  blocks: string[];
  x: number;
}

const termText = (a: number, b: number) => {
  const ax = a === 0 ? "" : a === 1 ? "x" : `${a}x`;
  if (!ax) return `${b}`;
  if (!b) return ax;
  return `${ax} + ${b}`;
};

export function Q40BedSheetDesigner({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const blocks = cfg<{ id: string; label: string; xCoef: number; constant: number }[]>(question, "breadthBlocks", []);
  const unit = cfg<string>(question, "unit", "m");

  const breadthOf = (w: SheetWorld) =>
    w.blocks.reduce(
      (t, id) => {
        const b = blocks.find((x) => x.id === id)!;
        return { a: t.a + b.xCoef, c: t.c + b.constant };
      },
      { a: 0, c: 0 }
    );

  const play = usePlay<SheetWorld>({
    question,
    initial: { blocks: [], x: 10 },
    derive: (w) => {
      if (!w.blocks.length) return { note: "Build the breadth edge from algebra blocks." };
      const br = breadthOf(w);
      const a = 2 * (1 + br.a);
      const c = 2 * br.c;
      const text = `(${termText(a, c)}) ${unit}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const br = breadthOf(w);
  const Lm = w.x;
  const Bm = br.a * w.x + br.c;
  const scale = 170 / Math.max(30, Lm, Bm);

  return (
    <PlayShell
      title="Bed Sheet Designer"
      mission="The length of the sheet is x. Tap algebra blocks to lay them along the breadth edge, so the breadth is what the question says. Drag the length slider to stretch the sheet and check your breadth grows the right way. The frame totals the perimeter."
      icon={BedDouble}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the perimeter"
      live={
        <>
          <Gauge label="Length" value={`x (now ${Lm} ${unit})`} />
          <Gauge label="Breadth" value={`${termText(br.a, br.c) || "—"} (now ${round(Bm, 2)} ${unit})`} tone="violet" />
          <Gauge label="Perimeter frame" value={`2(L + B) = ${termText(2 * (1 + br.a), 2 * br.c)}`} tone="emerald" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3">
        <div className="rounded-2xl bg-slate-50 border-2 border-slate-200 p-2">
          <svg viewBox="0 0 200 200" className="w-full max-h-[340px]">
            <motion.rect x={15} y={15} animate={{ width: Lm * scale, height: Math.max(2, Bm * scale) }} fill="url(#imo6a-quilt)" stroke="#7c3aed" strokeWidth={1.4} rx={3} />
            <defs>
              <pattern id="imo6a-quilt" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect width="12" height="12" fill="#ede9fe" />
                <path d="M 0 6 L 6 0 L 12 6 L 6 12 Z" fill="#ddd6fe" />
              </pattern>
            </defs>
            <text x={15 + (Lm * scale) / 2} y={11} textAnchor="middle" fontSize={7} fontWeight={900} fill="#4c1d95">
              x
            </text>
            <text x={10} y={15 + (Bm * scale) / 2} textAnchor="end" fontSize={6} fontWeight={900} fill="#4c1d95">
              {termText(br.a, br.c) || "?"}
            </text>
          </svg>
        </div>
        <div className="space-y-3">
          <Bay label="Breadth edge" tone="violet">
            <div className="min-h-[48px] flex flex-wrap gap-1 rounded-lg border-2 border-dashed border-violet-300 bg-white p-1.5">
              {w.blocks.map((id, i) => (
                <button key={i} type="button" disabled={play.readOnly} onClick={() => play.patch({ blocks: w.blocks.filter((_, j) => j !== i) })} className="px-2.5 min-h-[40px] rounded-md bg-violet-600 text-white font-mono font-black text-sm">
                  {blocks.find((b) => b.id === id)?.label}
                </button>
              ))}
              {!w.blocks.length && <span className="text-[11px] text-slate-400 font-semibold self-center">tap blocks below</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {blocks.map((b) => (
                <Btn key={b.id} disabled={play.readOnly} onClick={() => play.patch({ blocks: [...w.blocks, b.id] })} className="font-mono">
                  {b.label}
                </Btn>
              ))}
            </div>
          </Bay>
          <Bay label={`Length slider: x = ${w.x} ${unit}`}>
            <input
              type="range"
              min={2}
              max={30}
              value={w.x}
              disabled={play.readOnly}
              onChange={(e) => play.patch({ x: Number(e.target.value) })}
              className="w-full accent-violet-600"
              aria-label="length x"
            />
          </Bay>
        </div>
      </div>
    </PlayShell>
  );
}

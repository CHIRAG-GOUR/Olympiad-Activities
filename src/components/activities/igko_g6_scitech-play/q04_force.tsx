"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Waves, ArrowDownToLine, ToggleLeft, ToggleRight } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Slider, Reading, Studio, useInvestigation } from "./kit";
import { LabBench, Floor, Glass, Metal, Brushed, Wood } from "./models";
import { FORCES, G, evaluateForce, forceInitial, forceOutcome, forces, type ForceId, type ForceWorld } from "./logic";

/**
 * Q4 · Underwater force laboratory.
 * Investigate: a switchboard turns each force on or off; release the object and watch what
 * the remaining forces do to it. Isolating one force at a time shows what each one does.
 * Answer: mark the force that makes an object sink.
 */

const BENCH_Y = 0.9;
const TANK = { w: 1.6, h: 1.25, d: 0.8 };
const BASE = BENCH_Y + 0.05;
const WATER_TOP = BASE + 0.9;
const ABOVE = BASE + TANK.h + 0.35;
const sideFor = (volumeL: number) => 0.24 * Math.cbrt(volumeL);

function Arrow({ dir, length, color, visible }: { dir: 1 | -1; length: number; color: string; visible: boolean }) {
  const l = Math.max(0.04, length);
  return (
    <group visible={visible}>
      <mesh position={[0, (dir * l) / 2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, l, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, dir * (l + 0.05), 0]} rotation={[dir === 1 ? 0 : Math.PI, 0, 0]}>
        <coneGeometry args={[0.05, 0.1, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Tank({ world }: { world: ForceWorld }) {
  const obj = useRef<THREE.Group>(null);
  const water = useRef<THREE.Mesh>(null);
  const down = useRef<THREE.Group>(null);
  const up = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Mesh>(null);
  const m = useRef({ y: ABOVE, v: 0 });
  const side = sideFor(world.volumeL);
  const { gravity, maxBuoyancy, density } = forces(world);
  const scale = 0.035;
  const isMetal = density > 1;
  const color = useMemo(() => (isMetal ? "#8C939B" : "#C08A52"), [isMetal]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const s = m.current;
    const half = side / 2;
    const e = world.enabled;
    if (!world.released) {
      s.y = THREE.MathUtils.lerp(s.y, ABOVE, 0.15);
      s.v = 0;
    } else if (e.spring && e.gravitational) {
      s.y = THREE.MathUtils.lerp(s.y, WATER_TOP - half * 0.4, 0.06);
      s.v = 0;
    } else {
      const submerged = THREE.MathUtils.clamp((WATER_TOP - (s.y - half)) / side, 0, 1);
      const fDown = e.gravitational ? gravity : 0;
      const fUp = e.buoyant ? submerged * maxBuoyancy : 0;
      const inWater = submerged > 0;
      const drag = (inWater ? 2.6 : e.air ? 0.6 : 0) * s.v;
      const acc = (fUp - fDown) / Math.max(0.05, world.massKg) - drag;
      s.v += acc * dt * 0.2;
      s.y += s.v * dt * 2.2;
      if (s.y - half < BASE + 0.02) {
        s.y = BASE + 0.02 + half;
        s.v = 0;
      }
      if (s.y > ABOVE) {
        s.y = ABOVE;
        s.v = 0;
      }
    }
    if (obj.current) obj.current.position.y = s.y;
    const submergedNow = THREE.MathUtils.clamp((WATER_TOP - (s.y - half)) / side, 0, 1);
    const rise = (submergedNow * side ** 3) / (TANK.w * TANK.d);
    if (water.current) {
      const h = WATER_TOP - BASE + rise;
      water.current.scale.y = h;
      water.current.position.y = BASE + h / 2;
    }
    if (down.current) down.current.position.y = s.y - half;
    if (up.current) {
      up.current.position.y = s.y + half;
      up.current.scale.y = Math.max(0.02, world.enabled.buoyant ? submergedNow : 0);
    }
    if (spring.current) {
      spring.current.visible = world.enabled.spring;
      const top = BASE + TANK.h + 0.7;
      const len = Math.max(0.05, top - (s.y + half));
      spring.current.scale.y = len;
      spring.current.position.y = top - len / 2;
    }
  });

  return (
    <group>
      {/* Water */}
      <mesh ref={water} position={[0, BASE + 0.45, 0]} scale={[1, 0.9, 1]}>
        <boxGeometry args={[TANK.w - 0.03, 1, TANK.d - 0.03]} />
        <meshPhysicalMaterial color="#3AA0D8" transparent opacity={0.42} roughness={0.05} clearcoat={1} depthWrite={false} />
      </mesh>
      {/* Glass walls in an aluminium frame */}
      <mesh position={[0, BASE + TANK.h / 2, 0]}>
        <boxGeometry args={[TANK.w, TANK.h, TANK.d]} />
        <Glass opacity={0.1} />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[(sx * TANK.w) / 2, BASE + TANK.h / 2, (sz * TANK.d) / 2]}>
            <boxGeometry args={[0.03, TANK.h, 0.03]} />
            <Metal color="#C9D0D7" />
          </mesh>
        ))
      )}
      <RoundedBox args={[TANK.w + 0.08, 0.05, TANK.d + 0.08]} radius={0.01} position={[0, BASE, 0]} receiveShadow>
        <Brushed color="#4B5563" />
      </RoundedBox>
      {/* Gantry for the spring balance */}
      <mesh position={[0, BASE + TANK.h + 0.72, 0]}>
        <boxGeometry args={[TANK.w + 0.2, 0.04, 0.06]} />
        <Metal />
      </mesh>
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[(sx * (TANK.w + 0.2)) / 2, BASE + (TANK.h + 0.72) / 2, 0]}>
          <boxGeometry args={[0.04, TANK.h + 0.72, 0.04]} />
          <Metal />
        </mesh>
      ))}
      <mesh ref={spring} visible={false}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <Metal color="#E5E7EB" roughness={0.15} />
      </mesh>
      {/* Object with force arrows */}
      <group ref={obj} position={[0, ABOVE, 0]}>
        <RoundedBox args={[side, side, side]} radius={side * 0.06} castShadow>
          {isMetal ? <Metal color={color} roughness={0.35} /> : <Wood color={color} />}
        </RoundedBox>
        <Label3D text={`${world.massKg} kg · ${world.volumeL} L`} position={[0, side / 2 + 0.38, 0]} size={[0.8, 0.16]} billboard style={{ bg: "#FFFFFF", fg: "#0F172A", border: "#CBD5E1", scale: 0.55 }} />
      </group>
      <group ref={down} position={[0.36, ABOVE, 0]}>
        <Arrow dir={-1} length={gravity * scale} color="#EF4444" visible={world.enabled.gravitational} />
      </group>
      <group ref={up} position={[-0.36, ABOVE, 0]}>
        <Arrow dir={1} length={maxBuoyancy * scale} color="#2563EB" visible={world.enabled.buoyant} />
      </group>
    </group>
  );
}

export function IgkoQ04Force(props: ActivityComponentProps) {
  const play = useInvestigation<ForceWorld>(props, forceInitial, evaluateForce);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const { gravity, maxBuoyancy, density } = forces(world);
  const outcome = forceOutcome(world);
  const reset = (patch: Partial<ForceWorld>) => play.patch({ ...patch, released: false });
  const toggleForce = (f: ForceId) => reset({ enabled: { ...world.enabled, [f]: !world.enabled[f] } });

  const outcomeText = {
    waiting: "Waiting above the water",
    sinks: "Went down to the bottom",
    floats: "Floats at the surface",
    rises: "Pushed up and out of the water",
    hangs: "Hangs from the spring balance",
    drifts: "Stays exactly where it is",
  }[outcome];

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Underwater Force Laboratory"
      mission="Switch forces on and off, release the object and see what each force does to it. Then mark the force that makes an object sink."
      icon={Waves}
      live={
        <>
          <Reading label="Object" value={`${density} kg/L`} />
          <Reading label="Red arrow" value={world.enabled.gravitational ? `${gravity} N ↓` : "off"} tone="rose" />
          <Reading label="Blue arrow (max)" value={world.enabled.buoyant ? `${maxBuoyancy} N ↑` : "off"} tone="teal" />
          <Reading label="What happened" value={outcomeText} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0.8, 2.5, 3.8], fov: 44 }} readOnly={readOnly} orbit={{ target: [0, BENCH_Y + 0.95, 0], minDistance: 1.8, maxDistance: 7 }}>
          <Studio shadowScale={8} />
          <Floor />
          <LabBench size={[3.2, 1.6]} height={BENCH_Y} />
          <Tank world={world} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Force switchboard">
            <ul className="space-y-1.5">
              {(Object.keys(FORCES) as ForceId[]).map((f) => (
                <li key={f} className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">{FORCES[f].name}</span>
                  <button
                    type="button"
                    disabled={ro}
                    aria-pressed={world.enabled[f]}
                    onClick={() => toggleForce(f)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold border cursor-pointer disabled:opacity-40 ${
                      world.enabled[f] ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    {world.enabled[f] ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {world.enabled[f] ? "On" : "Off"}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="The object">
            <div className="space-y-3">
              <Slider label="Mass" value={world.massKg} min={0.2} max={3} step={0.1} unit=" kg" disabled={ro} onChange={(v) => reset({ massKg: +v.toFixed(1) })} />
              <Slider label="Size (volume)" value={world.volumeL} min={0.5} max={2} step={0.1} unit=" L" disabled={ro} onChange={(v) => reset({ volumeL: +v.toFixed(1) })} />
            </div>
            <button
              type="button"
              disabled={ro}
              onClick={() => play.patch({ released: !world.released })}
              className="mt-3 w-full h-9 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <ArrowDownToLine className="w-4 h-4" /> {world.released ? "Lift it back out" : "Release into the water"}
            </button>
            <p className="mt-1 text-[10.5px] text-slate-500">g = {G} N per kg</p>
          </Panel>
          <AnswerStation title="Cause of sinking" hint="Mark the force you think makes an object sink to the bottom.">
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(FORCES) as ForceId[]).map((f) => (
                <Chip key={f} active={world.cause === f} disabled={ro} onClick={() => play.patch({ cause: world.cause === f ? null : f })} tone="violet">
                  {FORCES[f].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Waves, ArrowDownToLine, Anchor } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, Slider, Reading, Chip, useInvestigation } from "./kit";
import { G, WATER_DENSITY, evaluateForce, forceInitial, forceOutcome, forces, type ForceWorld } from "./logic";

/**
 * Q4 · Underwater Force Laboratory.
 * Choose an object's mass and size, release it into the tank and watch the two forces on
 * it: gravity pulling down, buoyancy pushing up. The motion comes from those forces; what
 * happens to the object — and which force drove it — is the answer.
 */

const TANK = { w: 3.2, h: 2.4, d: 1.6 };
const WATER_TOP = 1.7; // resting water level (y)
const FLOOR = 0.08;
const ABOVE = 2.65; // where the object waits before release

/** Edge length of a cube holding `volumeL` litres, scaled for the scene. */
const sideFor = (volumeL: number) => 0.42 * Math.cbrt(volumeL);

function Arrow({ dir, length, color, origin }: { dir: 1 | -1; length: number; color: string; origin: THREE.Vector3 }) {
  const l = Math.max(0.05, length);
  return (
    <group position={origin}>
      <mesh position={[0, (dir * l) / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, l, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, dir * (l + 0.09), 0]} rotation={[dir === 1 ? 0 : Math.PI, 0, 0]}>
        <coneGeometry args={[0.09, 0.18, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Tank({ world }: { world: ForceWorld }) {
  const obj = useRef<THREE.Group>(null);
  const water = useRef<THREE.Mesh>(null);
  const gravArrow = useRef<THREE.Group>(null);
  const buoyArrow = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Mesh>(null);
  const motion = useRef({ y: ABOVE, v: 0 });

  const side = sideFor(world.volumeL);
  const { gravity, maxBuoyancy, density } = forces(world);
  const scale = 0.055; // metres of arrow per newton
  const outcome = forceOutcome(world);

  // Heavier-per-litre objects look darker and more metallic.
  const color = useMemo(() => new THREE.Color().setHSL(0.08, 0.55, THREE.MathUtils.clamp(0.75 - density * 0.18, 0.2, 0.75)), [density]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const m = motion.current;
    const half = side / 2;
    if (!world.released) {
      m.y = THREE.MathUtils.lerp(m.y, ABOVE, 0.15);
      m.v = 0;
    } else if (world.onSpring) {
      // Hanging from the spring balance: settles just below the surface.
      m.y = THREE.MathUtils.lerp(m.y, WATER_TOP - half - 0.12, 0.08);
      m.v = 0;
    } else {
      // Net force = gravity − buoyancy (submerged share) − water drag.
      const submerged = THREE.MathUtils.clamp((WATER_TOP - (m.y - half)) / side, 0, 1);
      const buoy = submerged * maxBuoyancy;
      const drag = (submerged > 0 ? 3.2 : 0.2) * m.v;
      const acc = (buoy - gravity) / Math.max(0.05, world.massKg) - drag;
      m.v += acc * dt * 0.18;
      m.y += m.v * dt * 2.2;
      if (m.y - half < FLOOR) {
        m.y = FLOOR + half;
        m.v = 0;
      }
    }
    if (obj.current) obj.current.position.y = m.y;

    // Water rises by the volume the object displaces.
    const submergedNow = THREE.MathUtils.clamp((WATER_TOP - (m.y - half)) / side, 0, 1);
    const rise = (submergedNow * side * side * side) / (TANK.w * TANK.d);
    if (water.current) {
      const top = WATER_TOP + rise;
      water.current.scale.y = top;
      water.current.position.y = top / 2;
    }
    const buoyNow = submergedNow * maxBuoyancy;
    if (gravArrow.current) {
      gravArrow.current.position.y = m.y;
      gravArrow.current.scale.y = 1;
    }
    if (buoyArrow.current) {
      buoyArrow.current.visible = buoyNow > 0.05;
      buoyArrow.current.position.y = m.y;
      buoyArrow.current.scale.y = Math.max(0.01, (buoyNow * scale) / Math.max(0.01, maxBuoyancy * scale));
    }
    if (spring.current) {
      spring.current.visible = world.onSpring;
      const topY = TANK.h + 0.55;
      const len = Math.max(0.1, topY - (m.y + half));
      spring.current.scale.y = len;
      spring.current.position.y = topY - len / 2;
    }
  });

  return (
    <group>
      {/* Water */}
      <mesh ref={water} position={[0, WATER_TOP / 2, 0]} scale={[1, WATER_TOP, 1]}>
        <boxGeometry args={[TANK.w - 0.04, 1, TANK.d - 0.04]} />
        <meshPhysicalMaterial color="#38BDF8" transparent opacity={0.38} roughness={0.08} transmission={0.4} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, TANK.h / 2, 0]}>
        <boxGeometry args={[TANK.w, TANK.h, TANK.d]} />
        <meshPhysicalMaterial color="#F0F9FF" transparent opacity={0.12} roughness={0.02} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[TANK.w + 0.2, 0.04, TANK.d + 0.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Depth ruler */}
      {[0, 0.5, 1, 1.5, 2].map((y) => (
        <mesh key={y} position={[-TANK.w / 2 + 0.02, y + FLOOR, TANK.d / 2]}>
          <boxGeometry args={[0.18, 0.015, 0.01]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
      ))}

      {/* The object */}
      <group ref={obj} position={[0, ABOVE, 0]}>
        <mesh castShadow>
          <boxGeometry args={[side, side, side]} />
          <meshStandardMaterial color={color} metalness={THREE.MathUtils.clamp((density - 0.6) * 0.6, 0, 0.8)} roughness={0.45} />
        </mesh>
        <Label3D text={`${world.massKg} kg · ${world.volumeL} L`} position={[0, side / 2 + 0.2, 0]} size={[1.1, 0.24]} billboard style={{ bg: "#FFFFFF", fg: "#0F172A", border: "#CBD5E1", scale: 0.5 }} />
      </group>

      {/* Forces */}
      <group ref={gravArrow} position={[0.62, ABOVE, 0]}>
        <Arrow dir={-1} length={gravity * scale} color="#EF4444" origin={new THREE.Vector3(0, 0, 0)} />
        <Label3D text={`Gravity ${gravity} N`} position={[0.62, -0.25, 0]} size={[1.0, 0.22]} billboard style={{ bg: "#FEE2E2", fg: "#991B1B", scale: 0.5 }} />
      </group>
      <group ref={buoyArrow} position={[-0.62, ABOVE, 0]} visible={false}>
        <Arrow dir={1} length={maxBuoyancy * scale} color="#2563EB" origin={new THREE.Vector3(0, 0, 0)} />
        <Label3D text="Buoyancy" position={[-0.55, 0.3, 0]} size={[0.8, 0.22]} billboard style={{ bg: "#DBEAFE", fg: "#1E3A8A", scale: 0.5 }} />
      </group>

      {/* Spring balance */}
      <mesh position={[0, TANK.h + 0.6, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.2]} />
        <meshStandardMaterial color="#64748B" metalness={0.6} />
      </mesh>
      <mesh ref={spring} visible={false}>
        <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
        <meshStandardMaterial color="#A3A3A3" metalness={0.8} />
      </mesh>

      <Label3D
        text={
          !world.released
            ? "Waiting above the water"
            : outcome === "sank"
            ? "Resting on the bottom"
            : outcome === "floated"
            ? "Floating at the surface"
            : outcome === "held"
            ? "Held by the spring"
            : "Hovering in the water"
        }
        position={[0, TANK.h + 1.05, 0]}
        size={[2.2, 0.3]}
        billboard
        style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.5 }}
      />
    </group>
  );
}

export function IgkoQ04Force(props: ActivityComponentProps) {
  const play = useInvestigation<ForceWorld>(props, forceInitial, evaluateForce);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const { gravity, maxBuoyancy, density } = forces(world);

  // Changing the object lifts it back out: a new object is a new experiment.
  const setObject = (patch: Partial<ForceWorld>) => play.patch({ ...patch, released: false });

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Underwater Force Laboratory"
      mission="Release objects into the tank and watch the forces on them. Find out which force takes a sinking object to the bottom."
      icon={Waves}
      live={
        <>
          <Reading label="Gravity (down)" value={`${gravity} N`} tone="rose" />
          <Reading label="Max buoyancy (up)" value={`${maxBuoyancy} N`} tone="teal" />
          <Reading label="Density" value={`${density} kg/L`} />
          <Reading label="Water" value={`${WATER_DENSITY} kg/L`} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Lab3D camera={{ position: [0.4, 2.1, 4.6], fov: 44 }} readOnly={readOnly}>
          <Tank world={world} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="The object">
            <div className="space-y-3">
              <Slider label="Mass" value={world.massKg} min={0.2} max={3} step={0.1} unit=" kg" disabled={ro} onChange={(v) => setObject({ massKg: +v.toFixed(1) })} />
              <Slider label="Size (volume)" value={world.volumeL} min={0.5} max={2} step={0.1} unit=" L" disabled={ro} onChange={(v) => setObject({ volumeL: +v.toFixed(1) })} />
              <p className="text-[11px] text-slate-500">
                Gravity on it = mass × {G}. The most water can push up = its volume of water × {G}.
              </p>
            </div>
          </Panel>
          <Panel title="Experiment">
            <div className="flex flex-wrap gap-1.5">
              <Chip active={world.onSpring} disabled={ro} onClick={() => setObject({ onSpring: !world.onSpring })}>
                <Anchor className="inline w-3 h-3 mr-1" />
                {world.onSpring ? "Hanging on spring balance" : "Hang on spring balance"}
              </Chip>
            </div>
            <button
              type="button"
              disabled={ro}
              onClick={() => play.patch({ released: !world.released })}
              className="mt-2 w-full h-9 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <ArrowDownToLine className="w-4 h-4" /> {world.released ? "Lift object out" : "Release into the water"}
            </button>
          </Panel>
        </div>
      </div>
    </Investigation>
  );
}

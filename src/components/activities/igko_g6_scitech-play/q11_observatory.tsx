"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Telescope, Gauge as GaugeIcon, SunDim, Tag } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, useInvestigation } from "./kit";
import { SKY_OBJECTS, SKY_INFO, detectorReading, evaluateObservatory, observatoryInitial, type ObservatoryWorld, type SkyObject } from "./logic";

/**
 * Q11 · Light observatory.
 * Investigate: measure the light reaching the detector from each object, with sunlight
 * reaching them and with it blocked by the shutter. Answer: tag the object you think is
 * non-luminous.
 */

const AT: Record<SkyObject, [number, number, number]> = {
  sun: [-3.6, 1.2, -1],
  moon: [0.4, 1.4, -0.6],
  star: [2.6, 2.4, -2.6],
  firefly: [2.3, 0.6, 1.2],
};

function Shutter({ closed }: { closed: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y = approach(ref.current.position.y, closed ? 1.3 : 4.2, 4, dt);
  });
  return (
    <mesh ref={ref} position={[-1.9, 4.2, -0.8]} rotation={[0, Math.PI / 2.2, 0]}>
      <boxGeometry args={[2.4, 2.4, 0.08]} />
      <meshStandardMaterial color="#1F2937" metalness={0.7} roughness={0.4} />
    </mesh>
  );
}

function Firefly() {
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((c) => {
    if (glow.current) glow.current.opacity = 0.55 + Math.sin(c.clock.elapsedTime * 3) * 0.35;
  });
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 24, 1, true]} />
        <meshPhysicalMaterial color="#F0FDF4" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial ref={glow} color="#BEF264" transparent toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.05, 0]} color="#BEF264" intensity={0.6} distance={1.5} />
    </group>
  );
}

function Scene({ world, target, disabled, onAim }: { world: ObservatoryWorld; target: SkyObject | null; disabled: boolean; onAim: (o: SkyObject) => void }) {
  const stars = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 500;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(16);
      p.set([v.x, v.y, v.z], i * 3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const sunLight = useRef<THREE.DirectionalLight>(null);
  const moonMat = useRef<THREE.MeshStandardMaterial>(null);
  const lit = useMemo(() => new THREE.Color("#D4D4D8"), []);
  const unlit = useMemo(() => new THREE.Color("#060608"), []);
  useFrame((_, dt) => {
    if (sunLight.current) sunLight.current.intensity = approach(sunLight.current.intensity, world.sunlightOn ? 3 : 0, 4, dt);
    // Only sunlight shows the Moon; with the shutter closed nothing reaches it to reflect.
    if (moonMat.current) moonMat.current.color.lerp(world.sunlightOn ? lit : unlit, Math.min(1, dt * 4));
  });
  const aimProps = (o: SkyObject) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (!disabled) onAim(o);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (!disabled) cursor(true);
    },
    onPointerOut: () => cursor(false),
  });
  return (
    <>
      <points geometry={stars}>
        <pointsMaterial color="#CBD5E1" size={0.04} />
      </points>
      {/* Only the Sun's light illuminates the others; the scene's ambient light is near zero. */}
      <ambientLight intensity={-0.7} />
      <directionalLight ref={sunLight} position={AT.sun} intensity={3} color="#FFF7D6" target-position={AT.moon} />
      <group position={AT.sun} {...aimProps("sun")}>
        <mesh>
          <sphereGeometry args={[0.9, 40, 40]} />
          <meshBasicMaterial color="#FDB813" toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.15, 40, 40]} />
          <meshBasicMaterial color="#FDE68A" transparent opacity={0.35} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      <group position={AT.moon} {...aimProps("moon")}>
        <mesh>
          <sphereGeometry args={[0.55, 48, 48]} />
          <meshStandardMaterial ref={moonMat} color="#D4D4D8" roughness={0.95} />
        </mesh>
      </group>
      <group position={AT.star} {...aimProps("star")}>
        <mesh>
          <octahedronGeometry args={[0.18]} />
          <meshBasicMaterial color="#E0F2FE" toneMapped={false} />
        </mesh>
        <pointLight color="#E0F2FE" intensity={0.5} distance={2} />
      </group>
      <group position={AT.firefly} {...aimProps("firefly")}>
        <Firefly />
      </group>
      <Shutter closed={!world.sunlightOn} />
      {SKY_OBJECTS.map((o) => (
        <Label3D
          key={o}
          text={SKY_INFO[o].name}
          position={[AT[o][0], AT[o][1] + (o === "sun" ? 1.4 : o === "firefly" ? 0.7 : 0.85), AT[o][2]]}
          size={[0.9, 0.24]}
          billboard
          style={{ bg: target === o ? "#7C3AED" : "#0F172A", fg: "#FFFFFF", scale: 0.55 }}
        />
      ))}
      {/* Detector on its tripod, aimed at the chosen object */}
      <group position={[0, 0, 3]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        <mesh position={[0, 1.05, 0]} rotation={target ? [0, Math.atan2(AT[target][0], AT[target][2] - 3) + Math.PI, 0] : [0, 0, 0]}>
          <boxGeometry args={[0.3, 0.25, 0.6]} />
          <meshStandardMaterial color="#7C3AED" metalness={0.3} />
        </mesh>
      </group>
    </>
  );
}

export function IgkoQ11Observatory(props: ActivityComponentProps) {
  const play = useInvestigation<ObservatoryWorld>(props, observatoryInitial, evaluateObservatory);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [target, setTarget] = useState<SkyObject | null>(null);
  const reading = target ? detectorReading(target, world.sunlightOn) : null;

  const record = () => {
    if (!target) return;
    play.patch({ readings: { ...world.readings, [`${target}:${world.sunlightOn ? "on" : "off"}`]: detectorReading(target, world.sunlightOn) } });
  };

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Light Observatory"
      mission="Measure how much light reaches the detector from each object, with sunlight reaching them and with it blocked. Find the object that makes no light of its own."
      icon={Telescope}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, 2.6, 7.6], fov: 48 }} background="#020617" readOnly={readOnly} badge="Observatory · tap an object to aim">
          <Scene world={world} target={target} disabled={ro} onAim={setTarget} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Sunlight">
            <Chip active={!world.sunlightOn} disabled={ro} onClick={() => play.patch({ sunlightOn: !world.sunlightOn })}>
              <SunDim className="inline w-3 h-3 mr-1" />
              {world.sunlightOn ? "Close the shutter (block sunlight)" : "Shutter closed — open it"}
            </Chip>
          </Panel>
          <Panel title="Light detector">
            <div className="flex flex-wrap gap-1.5">
              {SKY_OBJECTS.map((o) => (
                <Chip key={o} active={target === o} disabled={ro} onClick={() => setTarget(o)}>
                  Aim at {SKY_INFO[o].name}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-sm font-black font-mono text-slate-900">{reading === null ? "— lux" : `${reading} lux`}</p>
            <button
              type="button"
              disabled={ro || !target}
              onClick={record}
              className="mt-1 w-full h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <GaugeIcon className="w-4 h-4" /> Record this reading
            </button>
          </Panel>
          <AnswerStation title="Tag the object" hint="Tag the object you think is non-luminous.">
            <div className="grid grid-cols-2 gap-1.5">
              {SKY_OBJECTS.map((o) => (
                <Chip key={o} active={world.tagged === o} disabled={ro} onClick={() => play.patch({ tagged: world.tagged === o ? null : o })} tone="violet">
                  <Tag className="inline w-3 h-3 mr-1" />
                  {SKY_INFO[o].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>

      <Panel title="Readings" className="mt-3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-1.5 pr-2">Object</th>
                <th className="py-1.5 pr-2">Sunlight reaching it</th>
                <th className="py-1.5 pr-2">Sunlight blocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SKY_OBJECTS.map((o) => {
                const on = world.readings[`${o}:on`];
                const off = world.readings[`${o}:off`];
                return (
                  <tr key={o}>
                    <td className="py-1.5 pr-2 font-bold">{SKY_INFO[o].name}</td>
                    <td className="py-1.5 pr-2 font-mono">{on === undefined ? "—" : `${on} lux`}</td>
                    <td className="py-1.5 pr-2 font-mono">{off === undefined ? "—" : `${off} lux`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </Investigation>
  );
}

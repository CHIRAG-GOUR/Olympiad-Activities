"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Zap, Sun, Moon, Flag } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Slider, Reading, Studio, useInvestigation } from "./kit";
import { Metal, Plastic } from "./models";
import {
  SOURCES,
  SOURCE_INFO,
  CITY_DEMAND_MW,
  energyInitial,
  evaluateEnergy,
  sunlight,
  supplyMW,
  type EnergySource,
  type EnergyWorld,
} from "./logic";

/**
 * Q10 · Energy city.
 * Investigate: wire plants to the substation, run the clock through day and night and
 * compare what each plant burns and gives off. Answer: raise the council's flag over the
 * plant that is a non-conventional source of energy.
 */

const SUB: [number, number, number] = [0, 0, 0];
const PLANT_AT: Record<EnergySource, [number, number, number]> = {
  coal: [-3.2, 0, -1.6],
  gas: [-3.2, 0, 1.6],
  petroleum: [3.2, 0, 1.6],
  solar: [3.2, 0, -1.6],
};

function CoalPlant({ on }: { on: boolean }) {
  const smoke = useRef<THREE.Group>(null);
  useFrame((c) => {
    smoke.current?.children.forEach((m, i) => {
      const t = (c.clock.elapsedTime * 0.4 + i / 4) % 1;
      m.position.y = 1.6 + t * 1.2;
      m.scale.setScalar(on ? 0.6 + t : 0.0001);
    });
  });
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.1, 0.8, 0.8]} />
        <meshStandardMaterial color="#57534E" />
      </mesh>
      <mesh position={[0.35, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.4, 16]} />
        <meshStandardMaterial color="#78716C" />
      </mesh>
      <mesh position={[-0.6, 0.12, 0.45]}>
        <coneGeometry args={[0.3, 0.25, 8]} />
        <meshStandardMaterial color="#1C1917" roughness={1} />
      </mesh>
      <group ref={smoke} position={[0.35, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshStandardMaterial color="#9CA3AF" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function GasPlant() {
  return (
    <group>
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.32, 24, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.15, 0.5]}>
        <boxGeometry args={[0.9, 0.3, 0.3]} />
        <meshStandardMaterial color="#60A5FA" />
      </mesh>
    </group>
  );
}

function PetroleumGen() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.9, 0.6, 0.6]} />
        <meshStandardMaterial color="#B45309" />
      </mesh>
      {[-0.55, -0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0.55]}>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 14]} />
          <meshStandardMaterial color="#1E3A8A" />
        </mesh>
      ))}
    </group>
  );
}

function SolarFarm({ hour }: { hour: number }) {
  // Panels track the sun across the sky.
  const tilt = ((hour - 12) / 12) * (Math.PI / 3);
  return (
    <group>
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => (
          <group key={`${r}-${c}`} position={[(c - 1) * 0.55, 0.25, (r - 1) * 0.5]}>
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.22, 6]} />
              <meshStandardMaterial color="#94A3B8" />
            </mesh>
            <mesh rotation={[-0.5, 0, tilt]} castShadow>
              <boxGeometry args={[0.48, 0.03, 0.36]} />
              <meshStandardMaterial color="#1E40AF" metalness={0.6} roughness={0.2} emissive="#1D4ED8" emissiveIntensity={sunlight(hour) * 0.2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

function Cable({ from, active, flowing }: { from: [number, number, number]; active: boolean; flowing: boolean }) {
  const pulses = useRef<THREE.Group>(null);
  const a = useMemo(() => new THREE.Vector3(from[0], 0.08, from[2]), [from]);
  const b = useMemo(() => new THREE.Vector3(SUB[0], 0.08, SUB[2]), []);
  const len = a.distanceTo(b);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), [a, b]);
  useFrame((c) => {
    pulses.current?.children.forEach((m, i) => {
      const t = (c.clock.elapsedTime * 0.6 + i / 4) % 1;
      m.position.copy(a.clone().lerp(b, t));
      m.visible = flowing;
    });
  });
  if (!active) return null;
  return (
    <>
      <mesh position={mid} quaternion={q}>
        <cylinderGeometry args={[0.03, 0.03, len, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <group ref={pulses}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshBasicMaterial color="#FACC15" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function City({ powered }: { powered: number }) {
  const blocks = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ x: ((i % 4) - 1.5) * 0.55, z: (Math.floor(i / 4) - 1) * 0.55 + 3.3, h: 0.3 + ((i * 7) % 5) * 0.12 })),
    []
  );
  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} castShadow>
          <boxGeometry args={[0.4, b.h, 0.4]} />
          <meshStandardMaterial color="#CBD5E1" emissive="#FDE047" emissiveIntensity={powered * 0.7} />
        </mesh>
      ))}
      <Label3D text={powered >= 1 ? "City lit" : powered > 0 ? "Brown-out" : "City dark"} position={[0, 1.4, 3.3]} size={[1.2, 0.26]} billboard style={{ bg: powered >= 1 ? "#FEF08A" : "#0F172A", fg: powered >= 1 ? "#713F12" : "#FFFFFF", scale: 0.5 }} />
    </group>
  );
}

function CouncilFlag() {
  const cloth = useRef<THREE.Mesh>(null);
  useFrame((c) => {
    if (cloth.current) cloth.current.rotation.y = Math.sin(c.clock.elapsedTime * 3) * 0.15;
  });
  return (
    <group position={[0.75, 0, 0.6]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.8, 10]} />
        <Metal />
      </mesh>
      <mesh ref={cloth} position={[0.22, 1.62, 0]}>
        <boxGeometry args={[0.44, 0.28, 0.01]} />
        <Plastic color="#7C3AED" roughness={0.6} clearcoat={0} />
      </mesh>
    </group>
  );
}

function Scene({ world, disabled, onToggle }: { world: EnergyWorld; disabled: boolean; onToggle: (s: EnergySource) => void }) {
  const day = sunlight(world.hour);
  const supply = supplyMW(world);
  const powered = Math.min(1, supply / CITY_DEMAND_MW);
  const sunAngle = ((world.hour - 6) / 12) * Math.PI;
  return (
    <>
      <color attach="background" args={[new THREE.Color("#0B1220").lerp(new THREE.Color("#BAE6FD"), day)]} />
      <Studio shadowScale={16} intensity={0.3 + day * 0.7} />
      <directionalLight position={[Math.cos(sunAngle) * 8, Math.max(0.5, Math.sin(sunAngle) * 8), 2]} intensity={0.3 + day * 1.4} color="#FFF7ED" castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={new THREE.Color("#1E293B").lerp(new THREE.Color("#BBF7D0"), day)} />
      </mesh>
      {/* Substation */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color="#64748B" metalness={0.5} />
      </mesh>
      <Label3D text={`Substation ${supply}/${CITY_DEMAND_MW} MW`} position={[0, 1.0, 0]} size={[1.7, 0.26]} billboard style={{ bg: "#0F172A", fg: "#FACC15", scale: 0.5 }} />
      <mesh position={[0, 0.06, 1.65]}>
        <boxGeometry args={[0.08, 0.04, 2.6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <City powered={powered} />
      {SOURCES.map((s) => {
        const on = world.connected.includes(s);
        const producing = on && (!SOURCE_INFO[s].dayOnly || day > 0.05);
        return (
          <group key={s}>
            <group
              position={PLANT_AT[s]}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                if (!disabled) onToggle(s);
              }}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                if (!disabled) cursor(true);
              }}
              onPointerOut={() => cursor(false)}
            >
              <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.0, 32]} />
                <meshStandardMaterial color={on ? "#99F6E4" : "#E2E8F0"} />
              </mesh>
              {s === "coal" && <CoalPlant on={producing} />}
              {s === "gas" && <GasPlant />}
              {s === "petroleum" && <PetroleumGen />}
              {s === "solar" && <SolarFarm hour={world.hour} />}
              {world.nominated === s && <CouncilFlag />}
              <Label3D text={SOURCE_INFO[s].name} position={[0, 1.35, 0]} size={[1.3, 0.21]} billboard style={{ bg: on ? "#0F766E" : "#FFFFFF", fg: on ? "#FFFFFF" : "#0F172A", border: "#CBD5E1", scale: 0.5 }} />
            </group>
            <Cable from={PLANT_AT[s]} active={on} flowing={producing} />
          </group>
        );
      })}
    </>
  );
}

export function IgkoQ10Energy(props: ActivityComponentProps) {
  const play = useInvestigation<EnergyWorld>(props, energyInitial, evaluateEnergy);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const supply = supplyMW(world);
  const toggle = (s: EnergySource) => play.patch({ connected: world.connected.includes(s) ? world.connected.filter((x) => x !== s) : [...world.connected, s] });

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Energy City"
      mission="Run the city's power plants through day and night and compare them. Then raise the council's flag over the non-conventional source of energy."
      icon={Zap}
      live={
        <>
          <Reading label="Supply / demand" value={`${supply} / ${CITY_DEMAND_MW} MW`} tone={supply >= CITY_DEMAND_MW ? "teal" : "rose"} />
          <Reading label="Time" value={`${String(world.hour).padStart(2, "0")}:00`} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_330px]">
        <Lab3D camera={{ position: [0, 6.2, 7.4], fov: 46 }} readOnly={readOnly} badge="Smart city · tap a plant to wire it">
          <Scene world={world} disabled={ro} onToggle={toggle} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Power plants">
            <ul className="space-y-2">
              {SOURCES.map((s) => {
                const i = SOURCE_INFO[s];
                return (
                  <li key={s} className="rounded-lg border border-slate-200 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-900">{i.name}</span>
                      <Chip active={world.connected.includes(s)} disabled={ro} onClick={() => toggle(s)}>
                        {world.connected.includes(s) ? "Connected" : "Connect"}
                      </Chip>
                    </div>
                    <div className="mt-1 grid grid-cols-[1fr_auto] gap-x-2 text-[10.5px] text-slate-600">
                      <span>Runs on: {i.fuel}</span>
                      <span>{i.outputMW} MW</span>
                      <span>Smoke: {i.smoke}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
          <Panel title="Time of day">
            <Slider label="Clock" value={world.hour} min={0} max={23} unit=":00" disabled={ro} onChange={(v) => play.patch({ hour: v })} />
            <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
              {sunlight(world.hour) > 0.05 ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              Sunlight {Math.round(sunlight(world.hour) * 100)}%
            </p>
          </Panel>
          <AnswerStation title="Council flag" hint="Raise the flag over the plant that is a non-conventional source of energy.">
            <div className="grid grid-cols-2 gap-1.5">
              {SOURCES.map((s) => (
                <Chip key={s} active={world.nominated === s} disabled={ro} onClick={() => play.patch({ nominated: world.nominated === s ? null : s })} tone="violet">
                  <Flag className="inline w-3 h-3 mr-1" />
                  {SOURCE_INFO[s].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

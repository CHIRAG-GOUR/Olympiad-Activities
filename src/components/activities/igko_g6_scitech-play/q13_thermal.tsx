"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Thermometer, Flame, ArrowDownToLine, Camera, Tag } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "./kit";
import { LabBench, Floor, Glass, Metal, Brushed, Plastic, Matte } from "./models";
import { HEAT_TAGS, THERMAL_STATIONS, evaluateThermal, probeTemp, thermalInitial, type HeatTag, type ThermalStation, type ThermalWorld } from "./logic";

/**
 * Q13 · Thermal transfer laboratory.
 * Investigate: four stations move heat to a probe in different ways; heat each one, watch the
 * probe and record runs on the thermal camera. Answer: pin a name tag on the card that shows
 * a hand touching a hot stove.
 */

const BENCH_Y = 0.9;
const IDS = Object.keys(THERMAL_STATIONS) as ThermalStation[];
const ST_X: Record<ThermalStation, number> = { plate: -1.95, air: -0.65, lamp: 0.65, glove: 1.95 };

/** Probe colour from its temperature: blue (cool) through red to white-hot. */
const tempColor = (t: number) => {
  const c = new THREE.Color("#3B82F6");
  if (t <= 40) return c;
  if (t <= 100) return c.lerp(new THREE.Color("#EF4444"), (t - 40) / 60);
  return new THREE.Color("#EF4444").lerp(new THREE.Color("#FDE68A"), Math.min(1, (t - 100) / 80));
};

function HotPlate({ glow = 1 }: { glow?: number }) {
  return (
    <group>
      <RoundedBox args={[0.5, 0.08, 0.5]} radius={0.015} position={[0, 0.04, 0]} castShadow>
        <Brushed color="#9AA4AF" />
      </RoundedBox>
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.18, 40]} />
        <meshStandardMaterial color="#7F1D1D" emissive="#EF4444" emissiveIntensity={glow * 1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.084, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 40]} />
        <Matte color="#1F2937" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Probe({ temp, y, x = 0, z = 0 }: { temp: number; y: number; x?: number; z?: number }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y = approach(ref.current.position.y, y, 5, dt);
    if (mat.current) {
      const c = tempColor(temp);
      mat.current.color.lerp(c, Math.min(1, dt * 4));
      mat.current.emissive.lerp(temp > 90 ? c : new THREE.Color("#000"), Math.min(1, dt * 4));
    }
  });
  return (
    <group ref={ref} position={[x, y, z]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 12]} />
        <meshStandardMaterial ref={mat} color="#3B82F6" metalness={0.6} roughness={0.3} emissiveIntensity={0.4} />
      </mesh>
      <RoundedBox args={[0.06, 0.12, 0.06]} radius={0.01} position={[0, 0.35, 0]}>
        <Plastic color="#111827" />
      </RoundedBox>
    </group>
  );
}

function RisingAir({ on }: { on: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((c) => {
    g.current?.children.forEach((m, i) => {
      const t = (c.clock.elapsedTime * 0.5 + i / 8) % 1;
      m.position.set(Math.sin(i * 1.7 + t * 4) * 0.06, 0.1 + t * 0.55, Math.cos(i * 2.3) * 0.06);
      m.scale.setScalar(on ? 1 - t * 0.5 : 0.0001);
    });
  });
  return (
    <group ref={g}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshBasicMaterial color="#FB923C" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Station({ id, world, selected, disabled, onPick }: { id: ThermalStation; world: ThermalWorld; selected: boolean; disabled: boolean; onPick: () => void }) {
  const active = world.station === id;
  const t = active ? probeTemp(world) : 25;
  const heating = active && world.seconds > 0;
  return (
    <group position={[ST_X[id], BENCH_Y + 0.045, 0]}>
      <mesh
        position={[0, 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (!disabled) onPick();
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (!disabled) cursor(true);
        }}
        onPointerOut={() => cursor(false)}
      >
        <planeGeometry args={[1.15, 1.0]} />
        <meshStandardMaterial color={selected ? "#E0E7FF" : "#F1F5F9"} roughness={0.6} />
      </mesh>
      {id === "plate" && (
        <>
          <HotPlate />
          <Probe temp={t} y={active && world.touching ? 0.09 : 0.35} />
        </>
      )}
      {id === "glove" && (
        <>
          <HotPlate />
          <RoundedBox args={[0.2, 0.14, 0.28]} radius={0.06} position={[0, active && world.touching ? 0.16 : 0.42, 0]} castShadow>
            <meshStandardMaterial color="#B91C1C" roughness={0.95} />
          </RoundedBox>
          <Probe temp={t} y={active && world.touching ? 0.12 : 0.38} />
        </>
      )}
      {id === "air" && (
        <>
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.1, 0.018, 10, 32]} />
            <meshStandardMaterial color="#7F1D1D" emissive="#F97316" emissiveIntensity={heating ? 1.4 : 0.4} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.5, 0.8, 0.5]} />
            <Glass opacity={0.12} />
          </mesh>
          <RisingAir on={heating} />
          <Probe temp={t} y={0.55} />
        </>
      )}
      {id === "lamp" && (
        <>
          <group position={[-0.32, 0, 0]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
              <Metal />
            </mesh>
            <mesh position={[0.06, 0.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.1, 0.14, 32, 1, true]} />
              <Metal color="#E5E7EB" roughness={0.15} />
            </mesh>
            <mesh position={[0.1, 0.4, 0]}>
              <sphereGeometry args={[0.05, 24, 24]} />
              <meshStandardMaterial color="#FDBA74" emissive="#F97316" emissiveIntensity={heating ? 2.5 : 0.3} toneMapped={false} />
            </mesh>
            {heating && <pointLight position={[0.2, 0.4, 0]} color="#FB923C" intensity={1.2} distance={1.2} />}
          </group>
          <Probe temp={t} y={0.2} x={0.3} />
        </>
      )}
      <Label3D text={THERMAL_STATIONS[id].name} position={[0, 0.78, 0]} size={[0.55, 0.1]} billboard style={{ bg: selected ? "#4338CA" : "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
      {active && world.seconds > 0 && <Label3D text={`${t} °C`} position={[0, 0.64, 0]} size={[0.3, 0.09]} billboard style={{ bg: "#FFFFFF", fg: "#B91C1C", border: "#FECACA", scale: 0.6 }} />}
    </group>
  );
}

/** The scenario card on the bench: a hand touching a hot stove. */
function ScenarioCard({ tag }: { tag: HeatTag | null }) {
  return (
    <group position={[0, BENCH_Y + 1.35, -0.95]}>
      <RoundedBox args={[1.5, 0.95, 0.04]} radius={0.02} castShadow>
        <Plastic color="#FFFBEB" />
      </RoundedBox>
      <Label3D text="Touching a hot stove" position={[0, 0.33, 0.025]} size={[1.3, 0.14]} style={{ bg: null, fg: "#78350F", scale: 0.6 }} />
      {/* Stove ring and a hand resting on it */}
      <mesh position={[0, -0.1, 0.025]}>
        <ringGeometry args={[0.1, 0.18, 32]} />
        <meshBasicMaterial color="#DC2626" />
      </mesh>
      <mesh position={[0.02, -0.02, 0.03]} scale={[1, 0.6, 1]}>
        <circleGeometry args={[0.14, 32]} />
        <meshBasicMaterial color="#E9C4A0" />
      </mesh>
      {tag && (
        <group position={[0, -0.36, 0.04]}>
          <mesh>
            <boxGeometry args={[0.8, 0.16, 0.01]} />
            <meshStandardMaterial color="#7C3AED" />
          </mesh>
          <Label3D text={HEAT_TAGS[tag]} position={[0, 0, 0.008]} size={[0.75, 0.12]} style={{ bg: null, fg: "#FFFFFF", scale: 0.65 }} />
        </group>
      )}
    </group>
  );
}

export function IgkoQ13Thermal(props: ActivityComponentProps) {
  const play = useInvestigation<ThermalWorld>(props, thermalInitial, evaluateThermal);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const t = probeTemp(world);
  const canTouch = world.station === "plate" || world.station === "glove";
  const choose = (s: ThermalStation) => play.patch({ station: s, touching: false, seconds: 0 });
  const runsSorted = useMemo(() => IDS.filter((s) => world.runs[s] !== undefined), [world.runs]);

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Thermal Transfer Laboratory"
      mission="Heat each station and watch how the heat reaches the probe. Then pin a name tag on the card that shows a hand touching a hot stove."
      icon={Thermometer}
      live={
        <>
          <Reading label="Station" value={THERMAL_STATIONS[world.station].name} />
          <Reading label="Heating time" value={`${world.seconds} s`} />
          <Reading label="Probe" value={`${t} °C`} tone={t > 60 ? "rose" : "slate"} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0, 2.3, 3.3], fov: 46 }} readOnly={readOnly} orbit={{ target: [0, BENCH_Y + 0.55, -0.2], minDistance: 1.6, maxDistance: 6 }}>
          <Studio shadowScale={10} />
          <Floor />
          <LabBench size={[5.4, 1.9]} height={BENCH_Y} />
          {IDS.map((s) => (
            <Station key={s} id={s} world={world} selected={world.station === s} disabled={ro} onPick={() => choose(s)} />
          ))}
          <ScenarioCard tag={world.tag} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Experiment">
            <div className="grid grid-cols-2 gap-1.5">
              {IDS.map((s) => (
                <Chip key={s} active={world.station === s} disabled={ro} onClick={() => choose(s)}>
                  {THERMAL_STATIONS[s].name}
                </Chip>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">{THERMAL_STATIONS[world.station].detail}</p>
            <div className="mt-2 grid gap-1.5">
              <Chip active={world.touching} disabled={ro || !canTouch} onClick={() => play.patch({ touching: !world.touching, seconds: 0 })}>
                <ArrowDownToLine className="inline w-3 h-3 mr-1" /> {world.touching ? "Probe pressed on the surface — lift it" : "Press the probe onto the surface"}
              </Chip>
              <Chip disabled={ro || world.seconds >= 60} onClick={() => play.patch({ seconds: Math.min(60, world.seconds + 10) })}>
                <Flame className="inline w-3 h-3 mr-1" /> Heat for 10 more seconds
              </Chip>
              <Chip disabled={ro || world.seconds === 0} onClick={() => play.patch({ runs: { ...world.runs, [world.station]: t } })}>
                <Camera className="inline w-3 h-3 mr-1" /> Record this run on the thermal camera
              </Chip>
            </div>
          </Panel>
          {runsSorted.length > 0 && (
            <Panel title="Thermal camera">
              <ul className="space-y-1">
                {runsSorted.map((s) => {
                  const v = world.runs[s]!;
                  return (
                    <li key={s} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{THERMAL_STATIONS[s].name}</span>
                        <span className="font-mono">{v} °C</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full" style={{ width: `${Math.min(100, ((v - 20) / 160) * 100)}%`, background: `#${tempColor(v).getHexString()}` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}
          <AnswerStation title="Name tag" hint="Pin the tag naming how heat reaches your hand when you touch a hot stove.">
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(HEAT_TAGS) as HeatTag[]).map((k) => (
                <Chip key={k} active={world.tag === k} disabled={ro} onClick={() => play.patch({ tag: world.tag === k ? null : k })} tone="violet">
                  <Tag className="inline w-3 h-3 mr-1" />
                  {HEAT_TAGS[k]}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

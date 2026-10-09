"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Milk, FlaskConical, Microscope, Snowflake, Clock } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Slider, Reading, Studio, useInvestigation } from "./kit";
import { LabBench, Floor, Glass, Metal, Plastic } from "./models";
import { CHANGE_TRAYS, bacteriaCount, evaluateMilk, milkInitial, milkPH, souring, type MilkWorld, type Storage, type TrayId } from "./logic";

/**
 * Q7 · Milk transformation laboratory.
 * Investigate: leave fresh milk out (or chilled), run the clock and gather evidence — pH,
 * microscope, an attempt to undo the change. Answer: set the glass on the classification
 * tray for the kind of change you think it is.
 */

const BENCH_Y = 0.9;
const TRAY_IDS = Object.keys(CHANGE_TRAYS) as TrayId[];
const trayAt = (i: number): [number, number, number] => [-0.3 + i * 0.62, BENCH_Y + 0.06, 0.55];
const SPOT: Record<Storage, [number, number, number]> = { counter: [-1.25, BENCH_Y + 0.06, -0.15], fridge: [-2.45, BENCH_Y + 0.62, -0.25] };

function MilkGlass({ world }: { world: MilkWorld }) {
  const ref = useRef<THREE.Group>(null);
  const sour = souring(world);
  const milk = useMemo(() => new THREE.Color("#FFFFFF").lerp(new THREE.Color("#EFE2A8"), sour), [sour]);
  const curds = useMemo(
    () => Array.from({ length: 22 }, (_, i) => [Math.cos(i * 2.4) * 0.085 * ((i % 5) / 5 + 0.2), 0.08 + (i % 4) * 0.045, Math.sin(i * 2.4) * 0.085 * ((i % 5) / 5 + 0.2)] as [number, number, number]),
    []
  );
  const target = world.tray ? trayAt(TRAY_IDS.indexOf(world.tray)) : SPOT[world.storage];
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = approach(g.position.x, target[0], 5, dt);
    g.position.y = approach(g.position.y, target[1] + (world.tray ? 0.03 : 0), 5, dt);
    g.position.z = approach(g.position.z, target[2], 5, dt);
  });
  return (
    <group ref={ref} position={SPOT.counter}>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.34, 40, 1, true]} />
        <Glass opacity={0.18} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.01, 40]} />
        <Glass opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.135, 0]}>
        <cylinderGeometry args={[0.122, 0.105, 0.26, 40]} />
        <meshPhysicalMaterial color={milk} roughness={0.35} clearcoat={0.4} sheen={0.5} />
      </mesh>
      {curds.slice(0, Math.round(sour * curds.length)).map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.018 + (i % 3) * 0.007, 10, 10]} />
          <meshStandardMaterial color="#F6EBC4" roughness={0.95} />
        </mesh>
      ))}
      {world.pHMeasured && !world.tray && (
        <mesh position={[0.05, 0.3, 0]} rotation={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.008, 0.008, 0.42, 10]} />
          <Metal color="#64748B" />
        </mesh>
      )}
    </group>
  );
}

function Scene({ world, disabled, onTray }: { world: MilkWorld; disabled: boolean; onTray: (t: TrayId) => void }) {
  return (
    <>
      <Studio shadowScale={10} />
      <Floor />
      <LabBench size={[5.4, 1.9]} height={BENCH_Y} />
      {/* Fridge */}
      <group position={[-2.45, 0, -0.25]}>
        <RoundedBox args={[0.9, 1.9, 0.7]} radius={0.05} position={[0, 0.95, -0.05]} castShadow receiveShadow>
          <Plastic color="#F5F7FA" roughness={0.25} />
        </RoundedBox>
        <mesh position={[0.4, 1.25, 0.31]}>
          <boxGeometry args={[0.03, 0.5, 0.04]} />
          <Metal />
        </mesh>
        <Label3D text="Fridge · 4 °C" position={[0, 2.05, 0]} size={[0.9, 0.2]} billboard style={{ bg: "#DBEAFE", fg: "#1E3A8A", scale: 0.55 }} />
      </group>
      {/* Wall clock */}
      <group position={[-0.6, 2.0, -0.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.05, 48]} />
          <Plastic color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.03]} rotation={[0, 0, -((world.hours % 12) / 12) * Math.PI * 2]}>
          <boxGeometry args={[0.02, 0.2, 0.01]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <Label3D text={`${world.hours} h left out`} position={[0, -0.4, 0]} size={[0.8, 0.17]} style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
      </group>
      {/* pH meter */}
      <group position={[-1.7, BENCH_Y + 0.05, 0.45]}>
        <RoundedBox args={[0.32, 0.2, 0.16]} radius={0.02} position={[0, 0.1, 0]} castShadow>
          <Plastic color="#0E7490" />
        </RoundedBox>
        <Label3D text={world.pHMeasured ? `pH ${milkPH(world)}` : "pH --"} position={[0, 0.12, 0.082]} size={[0.26, 0.1]} style={{ bg: "#052E2B", fg: "#5EEAD4", scale: 0.6 }} />
      </group>
      {/* Classification trays */}
      {TRAY_IDS.map((t, i) => (
        <group key={t} position={trayAt(i)}>
          <RoundedBox
            args={[0.5, 0.03, 0.42]}
            radius={0.012}
            castShadow
            receiveShadow
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              if (!disabled) onTray(t);
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              if (!disabled) cursor(true);
            }}
            onPointerOut={() => cursor(false)}
          >
            <Plastic color={world.tray === t ? "#DDD6FE" : "#E2E8F0"} />
          </RoundedBox>
          <Label3D text={CHANGE_TRAYS[t].label} position={[0, 0.02, 0.27]} rotation={[-Math.PI / 2, 0, 0]} size={[0.6, 0.1]} style={{ bg: "#334155", fg: "#FFFFFF", scale: 0.5 }} />
        </group>
      ))}
      <MilkGlass world={world} />
    </>
  );
}

function MicroscopeView({ count }: { count: number }) {
  const shown = Math.min(140, Math.round(Math.log2(Math.max(1, count)) * 9));
  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-[180px] mx-auto rounded-full bg-[#FFFBEB] border-4 border-slate-700" role="img" aria-label={`${count} bacteria in view`}>
      {Array.from({ length: shown }, (_, i) => {
        const a = i * 2.39996;
        const r = 8 + ((i * 37) % 66);
        const x = 80 + Math.cos(a) * r;
        const y = 80 + Math.sin(a) * r;
        return <rect key={i} x={x} y={y} width="9" height="3" rx="1.5" fill="#7C3AED" opacity="0.75" transform={`rotate(${(i * 47) % 180} ${x} ${y})`} />;
      })}
    </svg>
  );
}

export function IgkoQ07Milk(props: ActivityComponentProps) {
  const play = useInvestigation<MilkWorld>(props, milkInitial, evaluateMilk);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const sour = souring(world);
  const setConditions = (patch: Partial<MilkWorld>) => play.patch({ ...patch, pHMeasured: false, microscopeUsed: false, reverseTried: false });

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Milk Transformation Laboratory"
      mission="Leave fresh milk out and watch what happens over time. Gather evidence, then set the glass on the tray for the kind of change it is."
      icon={Milk}
      live={
        <>
          <Reading label="Time" value={`${world.hours} h`} />
          <Reading label="Place" value={world.storage === "counter" ? "Counter, 30 °C" : "Fridge, 4 °C"} />
          <Reading label="Looks & smells" value={sour >= 0.6 ? "Lumpy, sour" : sour > 0.1 ? "Slightly thick" : "Fresh"} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0.2, 2.0, 2.8], fov: 44 }} readOnly={readOnly} orbit={{ target: [-0.5, BENCH_Y + 0.25, 0.1], minDistance: 1.6, maxDistance: 6 }}>
          <Scene world={world} disabled={ro} onTray={(t) => play.patch({ tray: world.tray === t ? null : t })} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Conditions">
            <div className="flex gap-1.5 mb-2">
              {(["counter", "fridge"] as Storage[]).map((s) => (
                <Chip key={s} active={world.storage === s} disabled={ro} onClick={() => setConditions({ storage: s })}>
                  {s === "counter" ? "Leave on the counter" : "Keep in the fridge"}
                </Chip>
              ))}
            </div>
            <Slider label="Time-lapse" value={world.hours} min={0} max={24} unit=" h" disabled={ro} onChange={(v) => setConditions({ hours: v })} />
            <button type="button" disabled={ro || world.hours >= 24} onClick={() => setConditions({ hours: Math.min(24, world.hours + 4) })} className="mt-2 w-full h-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40">
              <Clock className="w-3.5 h-3.5" /> Let 4 more hours pass
            </button>
          </Panel>
          <Panel title="Evidence">
            <div className="grid gap-1.5">
              <Chip active={world.pHMeasured} disabled={ro} onClick={() => play.patch({ pHMeasured: true })}>
                <FlaskConical className="inline w-3 h-3 mr-1" />
                {world.pHMeasured ? `pH ${milkPH(world)} (fresh milk: 6.7)` : "Dip the pH probe"}
              </Chip>
              <Chip active={world.microscopeUsed} disabled={ro} onClick={() => play.patch({ microscopeUsed: true })}>
                <Microscope className="inline w-3 h-3 mr-1" />
                {world.microscopeUsed ? `${bacteriaCount(world).toLocaleString()} bacteria in view` : "Look under the microscope"}
              </Chip>
              <Chip active={world.reverseTried} disabled={ro} onClick={() => play.patch({ reverseTried: true })}>
                <Snowflake className="inline w-3 h-3 mr-1" />
                {world.reverseTried ? (sour >= 0.6 ? "Chilled & stirred: still sour, lumps stay" : "Chilled & stirred: no difference") : "Try to undo it (chill & stir)"}
              </Chip>
            </div>
            {world.microscopeUsed && (
              <div className="mt-2">
                <MicroscopeView count={bacteriaCount(world)} />
              </div>
            )}
          </Panel>
          <AnswerStation title="Classification trays" hint="Set the glass on the tray for the kind of change you think souring is.">
            <div className="grid grid-cols-2 gap-1.5">
              {TRAY_IDS.map((t) => (
                <Chip key={t} active={world.tray === t} disabled={ro} onClick={() => play.patch({ tray: world.tray === t ? null : t })} tone="violet">
                  {CHANGE_TRAYS[t].label}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

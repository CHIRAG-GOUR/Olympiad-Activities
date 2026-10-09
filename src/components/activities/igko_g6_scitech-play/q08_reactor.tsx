"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { FlaskRound, Beaker } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Slider, Reading, Studio, useInvestigation } from "./kit";
import { LabBench, Floor, Glass, Metal, Plastic, Brushed } from "./models";
import { REACTION_SLOTS, co2Ml, evaluateReactor, reactorInitial, type ReactionSlot, type ReactorWorld } from "./logic";

/**
 * Q8 · Chemical reaction reactor.
 * Investigate: measure vinegar and baking soda, combine them, watch the gas collect and the
 * console show how the partners rearrange. Answer: file the reaction card under its name on
 * the classification board.
 */

const BENCH_Y = 0.9;
const REACT_SECONDS = 4;
const SLOT_IDS = Object.keys(REACTION_SLOTS) as ReactionSlot[];

function Apparatus({ world, progress }: { world: ReactorWorld; progress: number }) {
  const bubbles = useRef<THREE.InstancedMesh>(null);
  const balloon = useRef<THREE.Mesh>(null);
  const N = 70;
  const seeds = useMemo(() => Array.from({ length: N }, (_, i) => ({ x: Math.cos(i * 2.4) * 0.14 * ((i % 7) / 7), z: Math.sin(i * 2.4) * 0.14 * ((i % 7) / 7), s: 0.5 + (i % 5) / 5, o: i / N })), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const gas = co2Ml(world);
  const reacting = world.mixed && gas > 0;
  const fizz = reacting ? Math.max(0, 1 - progress) : 0;
  useFrame((clock) => {
    const t = clock.clock.elapsedTime;
    if (bubbles.current) {
      for (let i = 0; i < N; i++) {
        const b = seeds[i];
        const y = ((t * b.s + b.o) % 1) * 0.3;
        tmp.position.set(b.x, 0.05 + y, b.z);
        tmp.scale.setScalar(i / N < fizz * 1.2 ? 1 : 0.0001);
        tmp.updateMatrix();
        bubbles.current.setMatrixAt(i, tmp.matrix);
      }
      bubbles.current.instanceMatrix.needsUpdate = true;
    }
    if (balloon.current) balloon.current.scale.setScalar(1 + Math.min(1, (gas / 1200) * Math.min(1, progress)) * 1.4);
  });
  const vinegarH = (world.vinegarMl / 100) * 0.42;
  const liquidH = world.mixed ? 0.05 + (world.vinegarMl / 100) * 0.16 : 0.01;

  return (
    <group position={[0, BENCH_Y + 0.045, 0]}>
      {/* Measuring cylinder */}
      <group position={[-0.9, 0, 0.1]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 32, 1, true]} />
          <Glass />
        </mesh>
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 32]} />
          <Glass opacity={0.35} />
        </mesh>
        {!world.mixed && vinegarH > 0 && (
          <mesh position={[0, vinegarH / 2 + 0.01, 0]}>
            <cylinderGeometry args={[0.066, 0.066, vinegarH, 32]} />
            <meshPhysicalMaterial color="#F3D98B" transparent opacity={0.7} roughness={0.1} />
          </mesh>
        )}
        <Label3D text={`Vinegar ${world.mixed ? 0 : world.vinegarMl} mL`} position={[0, 0.62, 0]} size={[0.42, 0.085]} billboard style={{ bg: "#FEF3C7", fg: "#78350F", scale: 0.55 }} />
      </group>
      {/* Watch glass of baking soda */}
      <group position={[0.9, 0, 0.1]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.2, 0.14, 0.04, 40]} />
          <Glass opacity={0.3} />
        </mesh>
        {!world.mixed && world.sodaG > 0 && (
          <mesh position={[0, 0.03, 0]} scale={[1, 0.45, 1]}>
            <sphereGeometry args={[0.04 + (world.sodaG / 20) * 0.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={1} />
          </mesh>
        )}
        <Label3D text={`Baking soda ${world.mixed ? 0 : world.sodaG} g`} position={[0, 0.3, 0]} size={[0.46, 0.085]} billboard style={{ bg: "#F8FAFC", fg: "#0F172A", border: "#CBD5E1", scale: 0.55 }} />
      </group>
      {/* Conical flask with balloon */}
      <group position={[0, 0, -0.05]}>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.05, 0.18, 0.34, 40, 1, true]} />
          <Glass />
        </mesh>
        <mesh position={[0, 0.39, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.1, 32, 1, true]} />
          <Glass />
        </mesh>
        <mesh position={[0, liquidH / 2 + 0.005, 0]}>
          <cylinderGeometry args={[0.18 - liquidH * 0.38, 0.178, liquidH, 40]} />
          <meshPhysicalMaterial color={world.mixed ? "#FBF3C8" : "#E0F2FE"} transparent opacity={0.8} roughness={0.15} />
        </mesh>
        {reacting && (
          <mesh position={[0, liquidH + 0.02, 0]}>
            <cylinderGeometry args={[0.16, 0.17, 0.05 * (1 - progress) + 0.005, 40]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} roughness={0.9} />
          </mesh>
        )}
        <instancedMesh ref={bubbles} args={[undefined, undefined, N]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.8} roughness={0.05} />
        </instancedMesh>
        <mesh ref={balloon} position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <Plastic color="#E11D48" roughness={0.3} clearcoat={0.9} />
        </mesh>
        <Label3D text={reacting ? `CO₂ collected ${Math.round(gas * Math.min(1, progress))} mL` : "Reaction flask"} position={[0, 0.78, 0]} size={[0.62, 0.09]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
      </group>
      {/* Thermometer clamp stand */}
      <group position={[0.35, 0, -0.25]}>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.22, 0.02, 0.16]} />
          <Brushed />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.7, 8]} />
          <Metal />
        </mesh>
      </group>
    </group>
  );
}

function SwapDiagram() {
  const chip = (x: number, y: number, label: string, fill: string) => (
    <g>
      <rect x={x} y={y} width="54" height="20" rx="6" fill={fill} />
      <text x={x + 27} y={y + 14} fontSize="9" fontWeight="700" textAnchor="middle" fill="#0F172A">
        {label}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 250 112" className="w-full" role="img" aria-label="How the partners rearrange">
      {chip(4, 8, "H⁺", "#FDE68A")}
      {chip(60, 8, "CH₃COO⁻", "#FBCFE8")}
      <text x="121" y="22" fontSize="12" fontWeight="800">+</text>
      {chip(132, 8, "Na⁺", "#BAE6FD")}
      {chip(188, 8, "HCO₃⁻", "#BBF7D0")}
      <text x="125" y="48" fontSize="9" textAnchor="middle" fill="#475569">after the reaction ↓</text>
      {chip(4, 60, "Na⁺", "#BAE6FD")}
      {chip(60, 60, "CH₃COO⁻", "#FBCFE8")}
      <text x="121" y="74" fontSize="12" fontWeight="800">+</text>
      {chip(132, 60, "H⁺", "#FDE68A")}
      {chip(188, 60, "HCO₃⁻", "#BBF7D0")}
      <text x="125" y="104" fontSize="8.5" textAnchor="middle" fill="#475569">H₂CO₃ then breaks up into H₂O + CO₂</text>
    </svg>
  );
}

export function IgkoQ08Reactor(props: ActivityComponentProps) {
  const play = useInvestigation<ReactorWorld>(props, reactorInitial, evaluateReactor);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [progress, setProgress] = useState(world.mixed ? 1 : 0);
  const start = useRef<number | null>(null);
  useEffect(() => {
    if (!world.mixed) {
      setProgress(0);
      return;
    }
    if (progress >= 1) return;
    start.current = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - (start.current ?? 0)) / (REACT_SECONDS * 1000));
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world.mixed]);
  const measure = (patch: Partial<ReactorWorld>) => play.patch({ ...patch, mixed: false });
  const gas = co2Ml(world);
  const tempC = world.mixed && gas > 0 ? +(22 - 2.5 * Math.min(1, progress)).toFixed(1) : 22;

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Chemical Reaction Reactor"
      mission="Combine the reactants and watch what happens. Then file the reaction card under the name you think the reaction is called."
      icon={FlaskRound}
      live={
        <>
          <Reading label="CO₂ collected" value={`${Math.round(gas * Math.min(1, progress))} mL`} tone={gas > 0 ? "teal" : "slate"} />
          <Reading label="Temperature" value={`${tempC} °C`} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0.25, 1.85, 2.6], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, BENCH_Y + 0.25, 0], minDistance: 1.2, maxDistance: 5 }}>
          <Studio shadowScale={8} />
          <Floor />
          <LabBench size={[3.4, 1.4]} height={BENCH_Y} />
          <Apparatus world={world} progress={progress} />
          {/* Classification board on the wall */}
          <group position={[0, BENCH_Y + 0.85, -0.75]}>
            <RoundedBox args={[2.4, 0.7, 0.04]} radius={0.02} castShadow>
              <Plastic color="#F8FAFC" />
            </RoundedBox>
            <Label3D text="Reaction classification board" position={[0, 0.27, 0.03]} size={[1.6, 0.12]} style={{ bg: null, fg: "#0F172A", scale: 0.6 }} />
            {SLOT_IDS.map((s, i) => (
              <group key={s} position={[-0.9 + i * 0.6, -0.06, 0.03]}>
                <mesh>
                  <planeGeometry args={[0.52, 0.38]} />
                  <meshStandardMaterial color={world.filedAs === s ? "#DDD6FE" : "#E2E8F0"} />
                </mesh>
                <Label3D text={REACTION_SLOTS[s].label} position={[0, 0.13, 0.002]} size={[0.5, 0.08]} style={{ bg: null, fg: "#334155", scale: 0.5 }} />
                {world.filedAs === s && <Label3D text="Vinegar + baking soda" position={[0, -0.04, 0.004]} size={[0.44, 0.16]} style={{ bg: "#7C3AED", fg: "#FFFFFF", scale: 0.42 }} />}
              </group>
            ))}
          </group>
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Measure and combine">
            <div className="space-y-3">
              <Slider label="Vinegar (acetic acid)" value={world.vinegarMl} min={0} max={100} step={5} unit=" mL" disabled={ro} onChange={(v) => measure({ vinegarMl: v })} />
              <Slider label="Baking soda (sodium bicarbonate)" value={world.sodaG} min={0} max={20} unit=" g" disabled={ro} onChange={(v) => measure({ sodaG: v })} />
            </div>
            <button
              type="button"
              disabled={ro || world.mixed || (world.vinegarMl === 0 && world.sodaG === 0)}
              onClick={() => play.patch({ mixed: true })}
              className="mt-3 w-full h-9 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Beaker className="w-4 h-4" /> {world.mixed ? "Combined in the flask" : "Pour both into the flask"}
            </button>
          </Panel>
          {world.mixed && gas > 0 && progress >= 1 && (
            <Panel title="What the console saw">
              <SwapDiagram />
            </Panel>
          )}
          <AnswerStation title="Classification board" hint="File the reaction card under the name you think this reaction is called.">
            <div className="grid grid-cols-2 gap-1.5">
              {SLOT_IDS.map((s) => (
                <Chip key={s} active={world.filedAs === s} disabled={ro} onClick={() => play.patch({ filedAs: world.filedAs === s ? null : s })} tone="violet">
                  {REACTION_SLOTS[s].label}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

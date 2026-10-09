"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Cog, Power, Expand, IdCard } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "./kit";
import { LabBench, Floor, Metal, Brushed, Plastic, Wood, Brass } from "./models";
import { FUNCTION_CARDS, MOTOR_PARTS, MOTOR_PART_INFO, evaluateMotor, motorInitial, motorState, type FunctionCard, type MotorPart, type MotorWorld } from "./logic";

/**
 * Q15 · Electric motor workshop.
 * Investigate: fit the motor's parts, close the switch and read the meters; open the exploded
 * view to see how it is built. Answer: slot the card that describes what an electric motor
 * does into its name plate.
 */

const BENCH_Y = 0.9;
const BASE_Y = BENCH_Y + 0.045;

function Part({ id, offset, children, onPick, disabled }: { id: MotorPart; offset: [number, number, number]; children: React.ReactNode; onPick: () => void; disabled: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = approach(g.position.x, offset[0], 6, dt);
    g.position.y = approach(g.position.y, offset[1], 6, dt);
    g.position.z = approach(g.position.z, offset[2], 6, dt);
  });
  return (
    <group
      ref={ref}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!disabled) onPick();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (!disabled) cursor(true);
      }}
      onPointerOut={() => cursor(false)}
      name={id}
    >
      {children}
    </group>
  );
}

function Wire({ points, color, flowing }: { points: [number, number, number][]; color: string; flowing: boolean }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const pulses = useRef<THREE.Group>(null);
  useFrame((c) => {
    pulses.current?.children.forEach((m, i) => {
      const t = (c.clock.elapsedTime * 0.5 + i / 5) % 1;
      m.position.copy(curve.getPoint(t));
      m.visible = flowing;
    });
  });
  return (
    <>
      <mesh castShadow>
        <tubeGeometry args={[curve, 48, 0.012, 10, false]} />
        <Plastic color={color} roughness={0.4} />
      </mesh>
      <group ref={pulses}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshBasicMaterial color="#FDE047" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function Motor({ world, exploded, disabled, onToggle }: { world: MotorWorld; exploded: boolean; disabled: boolean; onToggle: (p: MotorPart) => void }) {
  const has = (p: MotorPart) => world.installed.includes(p);
  const s = motorState(world);
  const rotor = useRef<THREE.Group>(null);
  const speed = useRef(0);
  useFrame((_, dt) => {
    speed.current = approach(speed.current, s.spinning ? 18 : 0, 1.5, dt);
    if (rotor.current) rotor.current.rotation.x += speed.current * dt;
  });
  const e = exploded ? 1 : 0;

  return (
    <group position={[0, BASE_Y, 0]}>
      {/* Base board */}
      <RoundedBox args={[1.9, 0.06, 1.0]} radius={0.02} position={[0, 0.03, 0]} castShadow receiveShadow>
        <Wood color="#8B5E34" />
      </RoundedBox>

      {has("magnets") && (
        <>
          <Part id="magnets" offset={[0, 0.06, -0.24 - e * 0.35]} onPick={() => onToggle("magnets")} disabled={disabled}>
            <RoundedBox args={[0.38, 0.2, 0.08]} radius={0.02} position={[0, 0.1, 0]} castShadow>
              <Plastic color="#DC2626" />
            </RoundedBox>
            <Label3D text="N" position={[0, 0.1, 0.042]} size={[0.1, 0.1]} style={{ bg: null, fg: "#FFFFFF", scale: 0.8 }} />
          </Part>
          <Part id="magnets" offset={[0, 0.06, 0.24 + e * 0.35]} onPick={() => onToggle("magnets")} disabled={disabled}>
            <RoundedBox args={[0.38, 0.2, 0.08]} radius={0.02} position={[0, 0.1, 0]} castShadow>
              <Plastic color="#2563EB" />
            </RoundedBox>
            <Label3D text="S" position={[0, 0.1, 0.042]} size={[0.1, 0.1]} style={{ bg: null, fg: "#FFFFFF", scale: 0.8 }} />
          </Part>
        </>
      )}

      {has("rotor") && (
        <Part id="rotor" offset={[0, 0.24 + e * 0.45, 0]} onPick={() => onToggle("rotor")} disabled={disabled}>
          {/* Bearing posts */}
          {[-0.42, 0.42].map((x) => (
            <mesh key={x} position={[x, -0.09, 0]}>
              <boxGeometry args={[0.05, 0.22, 0.08]} />
              <Brushed />
            </mesh>
          ))}
          <group ref={rotor}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.95, 16]} />
              <Metal color="#E5E7EB" roughness={0.15} />
            </mesh>
            {/* Commutator */}
            <mesh position={[0.33, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.06, 24]} />
              <Metal color="#B87333" roughness={0.3} />
            </mesh>
            {/* Armature */}
            <RoundedBox args={[0.22, 0.2, 0.2]} radius={0.02}>
              <Brushed color="#6B7280" />
            </RoundedBox>
            {has("coil") && (
              <Part id="coil" offset={[0, e * 0.25, 0]} onPick={() => onToggle("coil")} disabled={disabled}>
                {Array.from({ length: 7 }, (_, i) => (
                  <mesh key={i} position={[-0.09 + i * 0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[0.13, 0.012, 10, 32]} />
                    <Metal color="#C46A2D" roughness={0.3} />
                  </mesh>
                ))}
              </Part>
            )}
          </group>
        </Part>
      )}
      {!has("rotor") && has("coil") && (
        <Part id="coil" offset={[0, 0.25 + e * 0.25, 0]} onPick={() => onToggle("coil")} disabled={disabled}>
          {Array.from({ length: 7 }, (_, i) => (
            <mesh key={i} position={[-0.09 + i * 0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.13, 0.012, 10, 32]} />
              <Metal color="#C46A2D" roughness={0.3} />
            </mesh>
          ))}
        </Part>
      )}

      {has("battery") && (
        <Part id="battery" offset={[-0.7 - e * 0.3, 0.06, 0.28]} onPick={() => onToggle("battery")} disabled={disabled}>
          <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.34, 32]} />
            <Plastic color="#111827" />
          </mesh>
          <mesh position={[0.06, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.072, 0.072, 0.2, 32]} />
            <Metal color="#C9A227" roughness={0.3} />
          </mesh>
          <mesh position={[0.18, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
            <Metal />
          </mesh>
          <Label3D text="6 V" position={[-0.07, 0.15, 0]} size={[0.14, 0.07]} billboard style={{ bg: "#111827", fg: "#FDE68A", scale: 0.7 }} />
        </Part>
      )}

      {has("wires") && (
        <group position={[e * -0.15, e * 0.05, 0]}>
          <Wire points={[[-0.52, 0.13, 0.28], [-0.4, 0.2, 0.15], [-0.25, 0.28, 0.06], [0.33, 0.27, 0.05]]} color="#DC2626" flowing={s.circuit} />
          <Wire points={[[-0.88, 0.13, 0.28], [-0.9, 0.12, 0.42], [-0.3, 0.1, 0.45], [0.3, 0.12, 0.3], [0.36, 0.22, -0.03]]} color="#111827" flowing={s.circuit} />
        </group>
      )}

      {/* Switch */}
      <group position={[-0.62, 0.06, -0.3]}>
        <RoundedBox args={[0.18, 0.04, 0.12]} radius={0.01} castShadow>
          <Plastic color="#1F2937" />
        </RoundedBox>
        <mesh position={[0, 0.04, 0]} rotation={[0, 0, world.switchOn ? -0.5 : 0.5]}>
          <boxGeometry args={[0.02, 0.09, 0.02]} />
          <Metal />
        </mesh>
      </group>
      {s.circuit && !s.spinning && <pointLight position={[0, 0.3, 0]} color="#F97316" intensity={0.6} distance={0.8} />}
    </group>
  );
}

function NamePlate({ card }: { card: FunctionCard | null }) {
  return (
    <group position={[0, BASE_Y + 0.08, 0.53]} rotation={[-0.6, 0, 0]}>
      <RoundedBox args={[1.2, 0.18, 0.02]} radius={0.01} castShadow>
        <Brass color="#D8DEE5" />
      </RoundedBox>
      <Label3D text={card ? FUNCTION_CARDS[card].label : "Electric motor: function — ?"} position={[0, 0, 0.012]} size={[1.14, 0.12]} style={{ bg: card ? "#7C3AED" : null, fg: card ? "#FFFFFF" : "#334155", scale: 0.5 }} />
    </group>
  );
}

export function IgkoQ15Motor(props: ActivityComponentProps) {
  const play = useInvestigation<MotorWorld>(props, motorInitial, evaluateMotor);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [exploded, setExploded] = useState(false);
  const s = motorState(world);
  const toggle = (p: MotorPart) => play.patch({ installed: world.installed.includes(p) ? world.installed.filter((x) => x !== p) : [...world.installed, p] });

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Electric Motor Workshop"
      mission="Build the motor, switch it on and read the meters. Then slot the card that describes what an electric motor does into its name plate."
      icon={Cog}
      live={
        <>
          <Reading label="Current" value={`${s.currentA} A`} tone={s.circuit ? "amber" : "slate"} />
          <Reading label="Electrical power in" value={`${s.inputW} W`} />
          <Reading label="Rotor speed" value={`${s.rpm} rpm`} tone={s.spinning ? "teal" : "slate"} />
          <Reading label="Warming the coil" value={`${s.heatW} W`} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0.8, 1.95, 1.9], fov: 40 }} readOnly={readOnly} orbit={{ target: [0, BENCH_Y + 0.2, 0], minDistance: 1, maxDistance: 4.5 }} badge="Workbench · tap a part to remove it">
          <Studio shadowScale={6} />
          <Floor />
          <LabBench size={[2.8, 1.6]} height={BENCH_Y} />
          <Motor world={world} exploded={exploded} disabled={ro} onToggle={toggle} />
          <NamePlate card={world.plate} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Parts tray">
            <ul className="space-y-1.5">
              {MOTOR_PARTS.map((p) => (
                <li key={p} className="flex items-start justify-between gap-2">
                  <span className="text-[11px] text-slate-600">
                    <strong className="text-slate-900">{MOTOR_PART_INFO[p].name}.</strong> {MOTOR_PART_INFO[p].role}
                  </span>
                  <Chip active={world.installed.includes(p)} disabled={ro} onClick={() => toggle(p)}>
                    {world.installed.includes(p) ? "Fitted" : "Fit"}
                  </Chip>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip active={world.switchOn} disabled={ro} onClick={() => play.patch({ switchOn: !world.switchOn })}>
                <Power className="inline w-3 h-3 mr-1" /> Switch {world.switchOn ? "on" : "off"}
              </Chip>
              <Chip active={exploded} onClick={() => setExploded((x) => !x)}>
                <Expand className="inline w-3 h-3 mr-1" /> Exploded view
              </Chip>
            </div>
          </Panel>
          <AnswerStation title="Name plate" hint="Slot the card that describes what an electric motor does.">
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(FUNCTION_CARDS) as FunctionCard[]).map((c) => (
                <Chip key={c} active={world.plate === c} disabled={ro} onClick={() => play.patch({ plate: world.plate === c ? null : c })} tone="violet">
                  <IdCard className="inline w-3 h-3 mr-1" />
                  {FUNCTION_CARDS[c].label}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

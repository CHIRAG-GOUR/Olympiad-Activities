"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Atom, Flame, Snowflake, FlaskConical, Archive } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Slider, Reading, Studio, useInvestigation } from "./kit";
import { LabBench, Floor, Glass, Metal, Brushed, Wood } from "./models";
import {
  JARS,
  MATTER_STATES,
  chamberJar,
  evaluatePlasma,
  ionisationAt,
  plasmaInitial,
  setEnergy,
  stateAtEnergy,
  type JarId,
  type PlasmaWorld,
} from "./logic";

/**
 * Q2 · Plasma Reactor.
 * Investigate: heat the reactor and watch its particles pass through each state of matter;
 * capture samples; boil the kettle for steam; look at the curiosities shelf.
 * Answer: arrange the "States of Matter" display case. The jar in its 4th slot is the answer.
 */

const BENCH_Y = 0.9;
const N = 110;
const R = 0.62;
const H = 1.25;
const CHAMBER: [number, number, number] = [-1.9, BENCH_Y + 0.12 + H / 2, 0];

const STATE_COLOR: Record<string, string> = { Solid: "#7DB7F5", Liquid: "#38BDF8", Gas: "#A78BFA", Plasma: "#F472B6" };

function lattice(i: number): THREE.Vector3 {
  const layer = Math.floor(i / 25);
  const k = i % 25;
  return new THREE.Vector3(((k % 5) - 2) * 0.17, -H / 2 + 0.1 + layer * 0.17, (Math.floor(k / 5) - 2) * 0.17);
}

/** The reactor: a borosilicate cylinder between steel flanges, with particles inside. */
function Reactor({ energy }: { energy: number }) {
  const ions = useRef<THREE.InstancedMesh>(null);
  const electrons = useRef<THREE.InstancedMesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const plasmaShell = useRef<THREE.MeshBasicMaterial>(null);
  const energyRef = useRef(energy);
  energyRef.current = energy;
  const sim = useMemo(
    () => ({
      pos: Array.from({ length: N }, (_, i) => lattice(i)),
      vel: Array.from({ length: N }, () => new THREE.Vector3()),
      phase: Array.from({ length: N }, () => Math.random() * Math.PI * 2),
    }),
    []
  );
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const m = ions.current;
    if (!m) return;
    for (let i = 0; i < N; i++) m.setColorAt(i, new THREE.Color(STATE_COLOR.Solid));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    (m.material as THREE.Material).needsUpdate = true;
  }, []);

  useFrame((clock, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const e = energyRef.current;
    const s = stateAtEnergy(e);
    const speed = 0.08 + (e / 100) * 1.7;
    const ionised = ionisationAt(e);
    const t = clock.clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      const p = sim.pos[i];
      const v = sim.vel[i];
      if (s === "Solid") {
        const home = lattice(i);
        const amp = 0.006 + (e / 22) * 0.03;
        p.set(home.x + Math.sin(t * 9 + i) * amp, home.y + Math.cos(t * 11 + i * 1.7) * amp, home.z + Math.sin(t * 7 + i * 2.3) * amp);
        v.set(0, 0, 0);
        continue;
      }
      v.x += (Math.random() - 0.5) * speed * dt * 6;
      v.y += (Math.random() - 0.5) * speed * dt * 6;
      v.z += (Math.random() - 0.5) * speed * dt * 6;
      if (s === "Liquid") v.y -= 1.2 * dt;
      const vmax = s === "Liquid" ? speed * 0.45 : speed;
      if (v.length() > vmax) v.setLength(vmax);
      p.addScaledVector(v, dt);
      const ceiling = s === "Liquid" ? -H / 2 + 0.45 : H / 2 - 0.05;
      if (p.y < -H / 2 + 0.05) {
        p.y = -H / 2 + 0.05;
        v.y = Math.abs(v.y);
      }
      if (p.y > ceiling) {
        p.y = ceiling;
        v.y = -Math.abs(v.y) * 0.6;
      }
      const rr = Math.hypot(p.x, p.z);
      if (rr > R - 0.06) {
        const nx = p.x / rr;
        const nz = p.z / rr;
        p.x = nx * (R - 0.06);
        p.z = nz * (R - 0.06);
        const dot = v.x * nx + v.z * nz;
        v.x -= 2 * dot * nx;
        v.z -= 2 * dot * nz;
      }
    }
    if (ions.current) {
      for (let i = 0; i < N; i++) {
        tmp.position.copy(sim.pos[i]);
        tmp.scale.setScalar(1);
        tmp.updateMatrix();
        ions.current.setMatrixAt(i, tmp.matrix);
        ions.current.setColorAt(i, i < ionised * N ? col.set("#FB923C") : col.set(STATE_COLOR[s]));
      }
      ions.current.instanceMatrix.needsUpdate = true;
      if (ions.current.instanceColor) ions.current.instanceColor.needsUpdate = true;
    }
    if (electrons.current) {
      for (let i = 0; i < N; i++) {
        if (i < ionised * N) {
          sim.phase[i] += dt * (8 + (i % 5));
          const a = sim.phase[i];
          tmp.position.set(sim.pos[i].x + Math.cos(a) * 0.1, sim.pos[i].y + Math.sin(a * 1.3) * 0.1, sim.pos[i].z + Math.sin(a) * 0.1);
          tmp.scale.setScalar(1);
        } else {
          tmp.position.copy(sim.pos[i]);
          tmp.scale.setScalar(0.0001);
        }
        tmp.updateMatrix();
        electrons.current.setMatrixAt(i, tmp.matrix);
      }
      electrons.current.instanceMatrix.needsUpdate = true;
    }
    if (glow.current) glow.current.intensity = THREE.MathUtils.lerp(glow.current.intensity, ionised * 6, 0.08);
    if (plasmaShell.current) plasmaShell.current.opacity = THREE.MathUtils.lerp(plasmaShell.current.opacity, ionised * 0.22, 0.08);
  });

  return (
    <group position={CHAMBER}>
      <instancedMesh ref={ions} args={[undefined, undefined, N]} castShadow>
        <sphereGeometry args={[0.042, 14, 14]} />
        <meshStandardMaterial roughness={0.3} />
      </instancedMesh>
      <instancedMesh ref={electrons} args={[undefined, undefined, N]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#67E8F9" toneMapped={false} />
      </instancedMesh>
      <mesh>
        <cylinderGeometry args={[R - 0.02, R - 0.02, H, 40, 1, true]} />
        <meshBasicMaterial ref={plasmaShell} color="#F472B6" transparent opacity={0} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[R, R, H, 48, 1, true]} />
        <Glass opacity={0.16} />
      </mesh>
      {[-H / 2, H / 2].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[R + 0.08, R + 0.08, 0.1, 48]} />
            <Metal color="#B9C2CC" roughness={0.3} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[Math.cos((i / 8) * Math.PI * 2) * (R + 0.04), y > 0 ? 0.06 : -0.06, Math.sin((i / 8) * Math.PI * 2) * (R + 0.04)]}>
              <cylinderGeometry args={[0.022, 0.022, 0.04, 6]} />
              <Metal color="#6B7280" />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, -H / 2 - 0.12, 0]}>
        <torusGeometry args={[R * 0.7, 0.03, 10, 40]} />
        <meshStandardMaterial color="#F97316" emissive="#EA580C" emissiveIntensity={energy / 60} />
      </mesh>
      <pointLight ref={glow} color="#F472B6" intensity={0} distance={3} />
      <Label3D text="Reactor chamber" position={[0, H / 2 + 0.3, 0]} size={[1.2, 0.2]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
    </group>
  );
}

/** A sealed glass jar holding a sample. */
function Jar({ kind, position, onClick, selected }: { kind: JarId; position: [number, number, number]; onClick?: () => void; selected?: boolean }) {
  const content = useMemo(() => {
    switch (kind) {
      case "solid":
        return (
          <mesh position={[0, -0.03, 0]} rotation={[0.3, 0.5, 0.2]}>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshPhysicalMaterial color="#DBEAFE" roughness={0.1} transmission={0.6} thickness={0.1} />
          </mesh>
        );
      case "liquid":
        return (
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.07, 24]} />
            <meshPhysicalMaterial color="#38BDF8" transparent opacity={0.7} roughness={0.1} />
          </mesh>
        );
      case "gas":
        return (
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#C4B5FD" transparent opacity={0.25} />
          </mesh>
        );
      case "plasma":
        return (
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#F472B6" toneMapped={false} />
          </mesh>
        );
      case "steam":
        return (
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#F8FAFC" transparent opacity={0.55} />
          </mesh>
        );
      default:
        return (
          <mesh>
            <icosahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial color="#4ADE80" emissive="#16A34A" emissiveIntensity={0.6} />
          </mesh>
        );
    }
  }, [kind]);
  return (
    <group
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        if (!onClick) return;
        e.stopPropagation();
        cursor(true);
      }}
      onPointerOut={() => cursor(false)}
    >
      <mesh>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 28, 1, true]} />
        <Glass opacity={selected ? 0.4 : 0.2} tint={selected ? "#EDE9FE" : "#F3FAFF"} />
      </mesh>
      <mesh position={[0, 0.125, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.035, 28]} />
        <Metal color="#94A3B8" />
      </mesh>
      {content}
      <Label3D text={JARS[kind].label} position={[0, -0.155, 0.1]} size={[0.3, 0.075]} style={{ bg: "#FFFFFF", fg: "#0F172A", scale: 0.65 }} />
    </group>
  );
}

function Kettle({ boiling }: { boiling: boolean }) {
  const puffs = useRef<THREE.Group>(null);
  useFrame((c) => {
    puffs.current?.children.forEach((m, i) => {
      const t = (c.clock.elapsedTime * 0.5 + i / 5) % 1;
      m.position.set(0.22 + t * 0.15, 0.3 + t * 0.6, 0);
      m.scale.setScalar(boiling ? 0.5 + t : 0.0001);
      ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.5;
    });
  });
  return (
    <group position={[-0.55, BENCH_Y + 0.05, -0.45]}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.06, 32]} />
        <meshStandardMaterial color="#1F2937" emissive={boiling ? "#DC2626" : "#000"} emissiveIntensity={boiling ? 0.5 : 0} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.19, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <Metal color="#D7DDE3" roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.15, 32]} />
        <Metal color="#D7DDE3" roughness={0.18} />
      </mesh>
      <mesh position={[0.2, 0.22, 0]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.02, 0.035, 0.2, 12]} />
        <Metal color="#C2C9D1" />
      </mesh>
      <group ref={puffs}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
      <Label3D text="Kettle" position={[0, 0.62, 0]} size={[0.6, 0.16]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
    </group>
  );
}

/** Glass display case with four numbered slots. */
function DisplayCase({ display, onSlot, disabled }: { display: (JarId | null)[]; onSlot: (i: number) => void; disabled: boolean }) {
  return (
    <group position={[1.75, BENCH_Y + 0.04, -0.1]}>
      <RoundedBox args={[1.9, 0.08, 0.7]} radius={0.02} position={[0, 0.04, 0]} castShadow receiveShadow>
        <Wood color="#3F2A1D" />
      </RoundedBox>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.86, 0.68, 0.66]} />
        <Glass opacity={0.12} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[1.9, 0.04, 0.7]} />
        <Brushed color="#A8B1BB" />
      </mesh>
      <Label3D text="STATES OF MATTER" position={[0, 0.92, 0]} size={[1.4, 0.18]} billboard style={{ bg: "#0F172A", fg: "#FDE68A", scale: 0.55 }} />
      {display.map((jar, i) => (
        <group key={i} position={[-0.69 + i * 0.46, 0.08, 0]}>
          <mesh
            position={[0, 0.01, 0]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              if (!disabled) onSlot(i);
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              if (!disabled) cursor(true);
            }}
            onPointerOut={() => cursor(false)}
          >
            <cylinderGeometry args={[0.14, 0.14, 0.02, 32]} />
            <meshPhysicalMaterial color={i === 3 ? "#EDE9FE" : "#F1F5F9"} roughness={0.2} clearcoat={1} />
          </mesh>
          <Label3D text={["1st", "2nd", "3rd", "4th"][i]} position={[0, 0.03, 0.22]} rotation={[-Math.PI / 2, 0, 0]} size={[0.28, 0.1]} style={{ bg: i === 3 ? "#7C3AED" : "#334155", fg: "#FFFFFF", scale: 0.6 }} />
          {jar && <Jar kind={jar} position={[0, 0.13, 0]} />}
        </group>
      ))}
    </group>
  );
}

export function IgkoQ02Plasma(props: ActivityComponentProps) {
  const play = useInvestigation<PlasmaWorld>(props, plasmaInitial, evaluatePlasma);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [boiling, setBoiling] = useState(false);
  const [held, setHeld] = useState<JarId | null>(null);
  const state = stateAtEnergy(world.energy);

  const collect = (j: JarId) => {
    if (!world.jars.includes(j)) play.patch({ jars: [...world.jars, j] });
    setHeld(j);
  };
  const placeInSlot = (i: number) => {
    const display = [...world.display];
    if (held) {
      // A jar sits in one slot at a time.
      for (let k = 0; k < display.length; k++) if (display[k] === held) display[k] = null;
      display[i] = held;
      setHeld(null);
    } else {
      display[i] = null;
    }
    play.patch({ display });
  };

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Plasma Reactor"
      mission="Explore how matter changes as it gains energy. Then arrange the States of Matter display case — the jar you put in the 4th slot is your answer."
      icon={Atom}
      live={
        <>
          <Reading label="Energy" value={`${world.energy}%`} tone="amber" />
          <Reading label="Chamber holds" value={state} />
          <Reading label="Particles ionised" value={`${Math.round(ionisationAt(world.energy) * 100)}%`} tone={ionisationAt(world.energy) > 0 ? "rose" : "slate"} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0.2, 2.6, 4.4], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, BENCH_Y + 0.5, 0], minDistance: 2.5, maxDistance: 8 }}>
          <Studio shadowScale={12} />
          <Floor />
          <LabBench size={[6.4, 2]} height={BENCH_Y} />
          <Reactor energy={world.energy} />
          <Kettle boiling={boiling} />
          {/* Curiosities shelf */}
          <group position={[0.35, BENCH_Y + 0.04, 0.5]}>
            <RoundedBox args={[0.6, 0.04, 0.3]} radius={0.01} castShadow>
              <Wood color="#7C5A3A" />
            </RoundedBox>
            <Jar kind="matteroid" position={[0, 0.14, 0]} onClick={ro ? undefined : () => collect("matteroid")} selected={held === "matteroid"} />
            <Label3D text="Curiosities" position={[0, 0.42, 0]} size={[0.7, 0.15]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
          </group>
          <DisplayCase display={world.display} onSlot={placeInSlot} disabled={ro} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Reactor controls">
            <Slider label="Energy supplied" value={world.energy} min={0} max={100} unit="%" disabled={ro} onChange={(v) => play.set((w) => setEnergy(w, v))} />
            <div className="mt-2 flex gap-1.5">
              <button type="button" disabled={ro} onClick={() => play.set((w) => setEnergy(w, w.energy - 5))} className="flex-1 h-8 rounded-lg border border-sky-200 bg-sky-50 text-sky-800 text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40">
                <Snowflake className="w-3.5 h-3.5" /> Cool
              </button>
              <button type="button" disabled={ro} onClick={() => play.set((w) => setEnergy(w, w.energy + 5))} className="flex-1 h-8 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40">
                <Flame className="w-3.5 h-3.5" /> Heat
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              States seen so far: {world.reached.join(" → ")}
            </p>
          </Panel>

          <Panel title="Collect samples">
            <div className="grid gap-1.5">
              <Chip disabled={ro} onClick={() => collect(chamberJar(world.energy))}>
                <FlaskConical className="inline w-3 h-3 mr-1" /> Capture a jar from the chamber ({state.toLowerCase()})
              </Chip>
              <Chip active={boiling} disabled={ro} onClick={() => setBoiling((b) => !b)}>
                <Flame className="inline w-3 h-3 mr-1" /> {boiling ? "Kettle boiling — switch off" : "Switch the kettle on"}
              </Chip>
              <Chip disabled={ro || !boiling} onClick={() => collect("steam")}>
                Hold a jar over the kettle spout
              </Chip>
              <Chip disabled={ro} onClick={() => collect("matteroid")}>
                <Archive className="inline w-3 h-3 mr-1" /> Take the jar from the curiosities shelf
              </Chip>
            </div>
          </Panel>

          <AnswerStation title="Arrange the display case" hint="Pick up a jar, then tap a slot in the case (or below). The 4th slot is your answer.">
            <div className="flex flex-wrap gap-1.5">
              {world.jars.length === 0 && <span className="text-[11px] text-slate-500">No jars collected yet.</span>}
              {world.jars.map((j) => (
                <Chip key={j} active={held === j} disabled={ro} onClick={() => setHeld(held === j ? null : j)} tone="violet">
                  {JARS[j].label} jar
                </Chip>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {world.display.map((jar, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={ro}
                  onClick={() => placeInSlot(i)}
                  className={`rounded-lg border-2 px-1 py-1.5 text-[11px] font-bold cursor-pointer disabled:opacity-40 ${
                    i === 3 ? "border-violet-400 bg-violet-50 text-violet-900" : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <span className="block text-[9px] uppercase tracking-wide opacity-70">{["1st", "2nd", "3rd", "4th"][i]}</span>
                  {jar ? JARS[jar].label : "empty"}
                </button>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
      <p className="sr-only">{MATTER_STATES.join(", ")}</p>
    </Investigation>
  );
}

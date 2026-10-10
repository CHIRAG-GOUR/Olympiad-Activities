"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Mountain, Play, Pin as PinIcon } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor, Matte, Glow } from "../igko_g6_scitech-play/models";
import { IW_BADGE } from "./iwkit";
import { CAUSE_CARDS, tectonicActivity, tectonicInitial, evaluateTectonic, type CauseCard, type Motion, type PlateKind, type TectonicRun, type TectonicWorld } from "./logic";

/**
 * Q5 · Tectonic plate simulator.
 * Investigate: a cut-away block of the Earth's crust and mantle. Choose each plate's kind and
 * how they move, add a cold current or melting glaciers, and run a century: the block shows
 * what forms and the log counts earthquakes and volcanoes. Answer: pin one cause card on
 * the Ring of Fire.
 */

const MANTLE_TOP = 0.7;
const SEA = 1.02;
const D = 1.2;
const thick = (k: PlateKind) => (k === "continental" ? 0.46 : 0.2);
const sameRun = (a: TectonicRun, b: TectonicRun) =>
  a.left === b.left && a.right === b.right && a.motion === b.motion && a.coldCurrent === b.coldCurrent && a.glacierMelt === b.glacierMelt;

function Volcano({ x, z, s, top }: { x: number; z: number; s: number; top: number }) {
  return (
    <group position={[x, top, z]} scale={[s, s, s]}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <coneGeometry args={[0.2, 0.32, 32, 1, true]} />
        <Matte color="#57534E" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.03, 16]} />
        <Glow color="#F97316" intensity={3} />
      </mesh>
    </group>
  );
}

function Peaks({ s, top }: { s: number; top: number }) {
  return (
    <group position={[0, top, 0]} scale={[1, Math.max(0.001, s), 1]}>
      {[-0.3, -0.1, 0.12, 0.3].map((x, i) => (
        <group key={x} position={[x, 0, (i % 2 ? 0.2 : -0.15)]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <coneGeometry args={[0.22, 0.4 + i * 0.05, 5]} />
            <Matte color="#78716C" />
          </mesh>
          <mesh position={[0, 0.36 + i * 0.025, 0]}>
            <coneGeometry args={[0.07, 0.1, 5]} />
            <Matte color="#F8FAFC" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PlateBlock({ kind, side }: { kind: PlateKind; side: -1 | 1 }) {
  const t = thick(kind);
  const continental = kind === "continental";
  return (
    <group>
      <RoundedBox args={[2, t, D]} radius={0.01} smoothness={2} position={[side, MANTLE_TOP + t / 2, 0]} castShadow receiveShadow>
        <Matte color={continental ? "#B08455" : "#3F4A5A"} roughness={0.9} />
      </RoundedBox>
      {continental && (
        <mesh position={[side, MANTLE_TOP + t + 0.006, 0]} receiveShadow>
          <boxGeometry args={[2, 0.012, D]} />
          <Matte color="#7FA05A" />
        </mesh>
      )}
      <Label3D text={continental ? "Continental plate" : "Oceanic plate"} position={[side, MANTLE_TOP + t / 2, D / 2 + 0.005]} size={[0.9, 0.12]} style={{ bg: null, fg: "#FFFFFF", scale: 0.5 }} />
    </group>
  );
}

function Section({ run, animate }: { run: TectonicRun; animate: boolean }) {
  const p = useRef(0);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const slab = useRef<THREE.Group>(null);
  const volcanoes = useRef<THREE.Group>(null);
  const peaks = useRef<THREE.Group>(null);
  const magma = useRef<THREE.Mesh>(null);
  const quakes = useRef<THREE.Group>(null);
  const ice = useRef<THREE.Group>(null);
  const act = tectonicActivity(run);
  const diver: -1 | 1 = run.left === "oceanic" ? -1 : 1; // the plate that dives, when one does
  const over: -1 | 1 = diver === -1 ? 1 : -1;
  const overTop = MANTLE_TOP + thick(over === -1 ? run.left : run.right);
  const diverKind = diver === -1 ? run.left : run.right;

  useEffect(() => {
    p.current = 0;
  }, [run.left, run.right, run.motion, run.coldCurrent, run.glacierMelt]);

  useFrame((c, dt) => {
    p.current = THREE.MathUtils.clamp(p.current + (animate ? dt / 2.2 : -dt * 2), 0, 1);
    const k = p.current;
    const shake = run.motion === "slide" && animate && k < 1 ? Math.sin(c.clock.elapsedTime * 60) * 0.004 : 0;
    if (left.current && right.current) {
      const gap = run.motion === "diverge" ? 0.12 * k : run.motion === "converge" && !act.subduction ? -0.04 * k : 0;
      left.current.position.x = -gap + shake;
      right.current.position.x = gap - shake;
      right.current.position.z = run.motion === "slide" ? 0.22 * k : 0;
    }
    if (slab.current) {
      slab.current.visible = act.subduction && k > 0.01;
      slab.current.scale.x = Math.max(0.001, k);
      slab.current.rotation.z = diver * 0.55 * k;
    }
    if (volcanoes.current) {
      const s = act.subduction ? k : run.motion === "diverge" ? k * 0.5 : 0;
      volcanoes.current.children.forEach((v) => {
        v.scale.setScalar(Math.max(0.001, s));
        v.visible = s > 0.02;
      });
    }
    if (peaks.current) peaks.current.visible = run.motion === "converge" && !act.subduction && k > 0.02;
    if (peaks.current) peaks.current.scale.y = Math.max(0.001, k);
    if (magma.current) {
      magma.current.visible = run.motion === "diverge" && k > 0.02;
      magma.current.scale.x = Math.max(0.001, k);
    }
    if (quakes.current) {
      quakes.current.children.forEach((q, i) => {
        const ph = (c.clock.elapsedTime * 1.4 + i * 0.37) % 1;
        q.scale.setScalar(0.4 + ph * 1.6);
        const m = (q as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = animate && k > 0.1 && i < Math.ceil(act.quakes / 6) ? (1 - ph) * 0.8 : 0;
      });
    }
    if (ice.current) ice.current.scale.set(1, run.glacierMelt ? Math.max(0.15, 1 - 0.85 * k) : 1, run.glacierMelt ? Math.max(0.3, 1 - 0.7 * k) : 1);
  });

  const quakePos = (i: number): [number, number, number] => {
    if (act.subduction) return [-diver * (0.15 + i * 0.13), MANTLE_TOP + 0.05 - i * 0.06, 0.1 * ((i % 3) - 1)];
    return [((i % 3) - 1) * 0.08, MANTLE_TOP + 0.25, 0.3 * ((i % 4) - 1.5) * 0.6];
  };

  return (
    <group>
      {/* Mantle */}
      <RoundedBox args={[4.3, MANTLE_TOP, D]} radius={0.02} smoothness={2} position={[0, MANTLE_TOP / 2, 0]} receiveShadow>
        <meshStandardMaterial color="#C2410C" roughness={0.7} emissive="#7C2D12" emissiveIntensity={0.35} />
      </RoundedBox>
      <Label3D text="Mantle" position={[-1.75, 0.3, D / 2 + 0.005]} size={[0.5, 0.12]} style={{ bg: null, fg: "#FFEDD5", scale: 0.55 }} />
      {/* Ocean water over oceanic crust */}
      {(["left", "right"] as const).map((side) =>
        run[side] === "oceanic" ? (
          <mesh key={side} position={[side === "left" ? -1 : 1, (MANTLE_TOP + 0.2 + SEA) / 2, 0]}>
            <boxGeometry args={[2, SEA - MANTLE_TOP - 0.2, D]} />
            <meshPhysicalMaterial color="#3B9AD9" transparent opacity={0.45} roughness={0.05} clearcoat={1} depthWrite={false} />
          </mesh>
        ) : null
      )}
      <group ref={left}>
        <PlateBlock kind={run.left} side={-1} />
      </group>
      <group ref={right}>
        <PlateBlock kind={run.right} side={1} />
      </group>
      {/* The diving slab, hinged at the boundary */}
      <group ref={slab} position={[0, MANTLE_TOP + thick(diverKind) / 2, 0]} visible={false}>
        <mesh position={[-diver * 0.6, 0, 0]} castShadow>
          <boxGeometry args={[1.2, thick(diverKind) * 0.9, D * 0.98]} />
          <Matte color="#334155" />
        </mesh>
      </group>
      {/* Volcano arc on the overriding plate (or a ridge where plates part) */}
      <group ref={volcanoes}>
        {(act.subduction ? [-0.3, 0.05, 0.35] : [-0.35, 0.35]).map((z, i) => (
          <Volcano key={i} x={act.subduction ? over * (0.45 + i * 0.08) : 0} z={z} s={0.001} top={act.subduction ? overTop : MANTLE_TOP + 0.05} />
        ))}
      </group>
      <group ref={peaks} visible={false}>
        <Peaks s={1} top={MANTLE_TOP + thick("continental")} />
      </group>
      <mesh ref={magma} position={[0, MANTLE_TOP + 0.1, 0]} visible={false}>
        <boxGeometry args={[0.24, 0.2, D * 0.96]} />
        <Glow color="#FB923C" intensity={1.6} />
      </mesh>
      <group ref={quakes}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} position={quakePos(i)}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#FDE047" transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* Glacier caps on continental plates */}
      <group ref={ice}>
        {(["left", "right"] as const).map((side) =>
          run[side] === "continental" ? (
            <mesh key={side} position={[side === "left" ? -1.5 : 1.5, MANTLE_TOP + 0.46 + 0.05, 0]} castShadow>
              <boxGeometry args={[0.7, 0.1, D * 0.8]} />
              <meshPhysicalMaterial color="#F0F9FF" roughness={0.2} transmission={0.2} clearcoat={1} />
            </mesh>
          ) : null
        )}
      </group>
      {/* A cold ocean current flowing past the coast */}
      {run.coldCurrent && <Current />}
    </group>
  );
}

function Current() {
  const g = useRef<THREE.Group>(null);
  useFrame((c) => {
    g.current?.children.forEach((m, i) => {
      m.position.z = ((c.clock.elapsedTime * 0.5 + i / 6) % 1) * 1.6 - 0.8;
    });
  });
  return (
    <group ref={g} position={[-1.2, SEA + 0.04, 0]}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.05, 0.14, 12]} />
          <meshStandardMaterial color="#BFDBFE" emissive="#60A5FA" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

const MOTIONS: Record<Motion, string> = { converge: "Push together", diverge: "Pull apart", slide: "Slide past" };

export function IgkoQ05Tectonic(props: ActivityComponentProps) {
  const play = useInvestigation<TectonicWorld>(props, tectonicInitial, evaluateTectonic);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const last = world.log[world.log.length - 1];
  const done = !!last && sameRun(last, world.run);
  const setRun = (patch: Partial<TectonicRun>) => {
    setRunning(false);
    clearTimeout(timer.current);
    play.patch({ run: { ...world.run, ...patch } });
  };
  const start = () => {
    setRunning(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const a = tectonicActivity(world.run);
      play.patch({ log: [...world.log, { ...world.run, quakes: a.quakes, volcanoes: a.volcanoes }].slice(-8) });
      setRunning(false);
    }, 2300);
  };
  const shown = done ? last : null;

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Tectonic Plate Simulator"
      mission="Set up two plates and run a century to see what forms at their boundary. Then pin the cause card that explains the Ring of Fire's earthquakes and volcanoes."
      icon={Mountain}
      live={
        <>
          <Reading label="Earthquakes / century" value={shown ? shown.quakes : "—"} tone="rose" />
          <Reading label="New volcanoes" value={shown ? shown.volcanoes : "—"} tone="amber" />
          <Reading label="Runs logged" value={world.log.length} tone="teal" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0.4, 2.0, 3.9], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, 0.75, 0], minDistance: 2.2, maxDistance: 7 }}>
          <Studio shadowScale={9} shadowOpacity={0.35} />
          <Floor color="#EEF1F5" />
          <Section run={world.run} animate={running || done} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Set up the boundary">
            <div className="space-y-2">
              {(["left", "right"] as const).map((side) => (
                <div key={side} className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">{side === "left" ? "Left plate" : "Right plate"}</span>
                  <div className="flex gap-1">
                    {(["oceanic", "continental"] as PlateKind[]).map((k) => (
                      <Chip key={k} active={world.run[side] === k} disabled={ro} onClick={() => setRun({ [side]: k })}>
                        {k === "oceanic" ? "Oceanic" : "Continental"}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-1">
                {(Object.keys(MOTIONS) as Motion[]).map((m) => (
                  <Chip key={m} active={world.run.motion === m} disabled={ro} onClick={() => setRun({ motion: m })}>
                    {MOTIONS[m]}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                <Chip active={world.run.coldCurrent} disabled={ro} onClick={() => setRun({ coldCurrent: !world.run.coldCurrent })}>
                  🌊 Very cold current
                </Chip>
                <Chip active={world.run.glacierMelt} disabled={ro} onClick={() => setRun({ glacierMelt: !world.run.glacierMelt })}>
                  🧊 Glaciers melting
                </Chip>
              </div>
            </div>
            <button
              type="button"
              disabled={ro || running}
              onClick={start}
              className="mt-2 w-full h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> {done ? "Run another century" : running ? "Simulating…" : "Run a century"}
            </button>
          </Panel>
          {world.log.length > 0 && (
            <Panel title="Run log">
              <table className="w-full text-[10.5px]">
                <thead className="text-slate-500">
                  <tr>
                    <th className="text-left font-bold">Plates</th>
                    <th className="text-left font-bold">Motion</th>
                    <th className="font-bold">Quakes</th>
                    <th className="font-bold">Volc.</th>
                  </tr>
                </thead>
                <tbody>
                  {world.log.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td>
                        {r.left[0].toUpperCase()}–{r.right[0].toUpperCase()}
                        {r.coldCurrent ? " 🌊" : ""}
                        {r.glacierMelt ? " 🧊" : ""}
                      </td>
                      <td>{MOTIONS[r.motion]}</td>
                      <td className="text-center font-mono">{r.quakes}</td>
                      <td className="text-center font-mono">{r.volcanoes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-1 text-[10px] text-slate-500">O = oceanic, C = continental</p>
            </Panel>
          )}
          <AnswerStation title="Ring of Fire map · pin a cause" hint="The Ring of Fire runs around the edges of the Pacific Ocean. Pin the card that explains why it has so many earthquakes and volcanoes.">
            <div className="grid gap-1.5">
              {(Object.keys(CAUSE_CARDS) as CauseCard[]).map((c) => (
                <Chip key={c} tone="violet" active={world.pinned === c} disabled={ro} onClick={() => play.patch({ pinned: world.pinned === c ? null : c })}>
                  <span className="inline-flex items-center gap-1.5 text-left">
                    <PinIcon className="w-3.5 h-3.5 shrink-0" /> {CAUSE_CARDS[c].label}
                  </span>
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

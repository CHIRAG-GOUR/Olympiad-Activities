"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Rocket, Check, X as XIcon } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, Chip, Reading, useInvestigation } from "./kit";
import {
  MODULES,
  MODULE_INFO,
  evaluateLunar,
  identifyMission,
  lunarInitial,
  type Destination,
  type LunarWorld,
  type MissionModule,
} from "./logic";

/**
 * Q3 · Chandrayaan mission reconstruction.
 * Build the spacecraft the question describes from real module types, choose its target and
 * launch it. Mission control compares the flown configuration with ISRO's missions and
 * names the one that matches.
 */

const MODULE_COLOR: Record<MissionModule, string> = {
  orbiter: "#F59E0B",
  impactor: "#EF4444",
  lander: "#94A3B8",
  rover: "#38BDF8",
  propulsion: "#A3A3A3",
};

const PAD: [number, number, number] = [-2.2, 0, 0.6];
const MOON: [number, number, number] = [2.4, 1.7, -1.8];
const MARS: [number, number, number] = [3.4, 1.3, 1.6];

/* ── Spacecraft modules ──────────────────────────────────────── */

function ModuleMesh({ kind }: { kind: MissionModule }) {
  const c = MODULE_COLOR[kind];
  switch (kind) {
    case "orbiter":
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.34, 0.42]} />
            <meshStandardMaterial color={c} metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0.5, 0, 0]}>
            <boxGeometry args={[0.55, 0.02, 0.3]} />
            <meshStandardMaterial color="#1E3A8A" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      );
    case "impactor":
      return (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.26, 20]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {/* Tricolour bands */}
          {["#FF9933", "#FFFFFF", "#138808"].map((col, i) => (
            <mesh key={col} position={[0, 0.08 - i * 0.08, 0]}>
              <cylinderGeometry args={[0.165, 0.165, 0.035, 20]} />
              <meshStandardMaterial color={col} />
            </mesh>
          ))}
        </group>
      );
    case "lander":
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.24, 0.44]} />
            <meshStandardMaterial color={c} metalness={0.5} roughness={0.4} />
          </mesh>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x * 0.24, -0.18, z * 0.24]} rotation={[z * 0.4, 0, -x * 0.4]}>
              <cylinderGeometry args={[0.015, 0.015, 0.22, 6]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          ))}
        </group>
      );
    case "rover":
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.1, 0.22]} />
            <meshStandardMaterial color={c} />
          </mesh>
          {[-0.1, 0.1].map((x) =>
            [-0.12, 0.12].map((z) => (
              <mesh key={`${x}${z}`} position={[x, -0.06, z]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
                <meshStandardMaterial color="#1F2937" />
              </mesh>
            ))
          )}
        </group>
      );
    default:
      return (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.32, 24]} />
            <meshStandardMaterial color={c} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.02, 0.4]}>
            <boxGeometry args={[0.3, 0.02, 0.45]} />
            <meshStandardMaterial color="#1E3A8A" />
          </mesh>
        </group>
      );
  }
}

const MODULE_HEIGHT: Record<MissionModule, number> = { orbiter: 0.36, impactor: 0.28, lander: 0.36, rover: 0.14, propulsion: 0.34 };

function Shelf({ stack, disabled, onToggle }: { stack: MissionModule[]; disabled: boolean; onToggle: (m: MissionModule) => void }) {
  return (
    <group position={[-0.2, 0, 2.3]}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.1, 0.8]} />
        <meshStandardMaterial color="#CBD5E1" />
      </mesh>
      {MODULES.map((m, i) => {
        const used = stack.includes(m);
        return (
          <group key={m} position={[-1.7 + i * 0.85, 0.32, 0]}>
            <group
              visible={!used}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                if (!disabled) onToggle(m);
              }}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                if (!disabled) cursor(true);
              }}
              onPointerOut={() => cursor(false)}
            >
              <ModuleMesh kind={m} />
            </group>
            <Label3D text={MODULE_INFO[m].name} position={[0, -0.22, 0.42]} rotation={[-Math.PI / 2.6, 0, 0]} size={[0.8, 0.2]} style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.5 }} />
          </group>
        );
      })}
    </group>
  );
}

/* ── Launch & flight ─────────────────────────────────────────── */

function Flight({ world, disabled, onRemove }: { world: LunarWorld; disabled: boolean; onRemove: (m: MissionModule) => void }) {
  const craft = useRef<THREE.Group>(null);
  const impactor = useRef<THREE.Group>(null);
  const [phase, setPhase] = useState(world.launched ? 1 : 0); // 0..1 flight, then orbit
  const progress = useRef(world.launched ? 1 : 0);
  const water = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!world.launched) {
      progress.current = 0;
      setPhase(0);
    }
  }, [world.launched]);

  const target = world.destination === "mars" ? MARS : MOON;
  const curve = useMemo(
    () =>
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(PAD[0], 1.4, PAD[2]),
        new THREE.Vector3(PAD[0], 3.4, PAD[2]),
        new THREE.Vector3(target[0] - 2, target[1] + 1.4, target[2]),
        new THREE.Vector3(target[0] - 0.75, target[1], target[2])
      ),
    [target]
  );
  const pathGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), [curve]);
  const pathLine = useMemo(() => new THREE.Line(pathGeom, new THREE.LineDashedMaterial({ color: "#FDE68A", dashSize: 0.12, gapSize: 0.08 })), [pathGeom]);
  useEffect(() => {
    pathLine.computeLineDistances();
    return () => pathGeom.dispose();
  }, [pathLine, pathGeom]);

  const waterGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 0.5;
      pts[i * 3 + 1] = Math.random() * 0.6;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, []);

  const hasImpactor = world.stack.includes("impactor");
  const toMoon = world.destination === "moon";

  useFrame((clock, dt) => {
    const g = craft.current;
    if (!g) return;
    if (world.launched) {
      progress.current = Math.min(1.6, progress.current + dt * 0.28);
      if (progress.current >= 1 && phase < 1) setPhase(1);
    }
    const p = progress.current;
    if (!world.launched) {
      g.position.set(PAD[0], 1.4, PAD[2]);
      g.rotation.set(0, 0, 0);
    } else if (p < 1) {
      const pos = curve.getPoint(p);
      g.position.copy(pos);
      g.rotation.z = -p * 1.2;
    } else {
      // Parking orbit around the target.
      const a = clock.clock.elapsedTime * 0.8;
      g.position.set(target[0] + Math.cos(a) * 0.85, target[1] + 0.15, target[2] + Math.sin(a) * 0.85);
    }
    // Once separated, the impact probe is no longer part of the orbiting craft.
    const onCraft = g.getObjectByName("stack-impactor");
    if (onCraft) onCraft.visible = !(world.launched && toMoon && p >= 1.05);
    if (impactor.current) {
      // The impact probe separates in orbit and falls to the surface.
      const drop = THREE.MathUtils.clamp((p - 1.05) / 0.4, 0, 1);
      impactor.current.visible = world.launched && hasImpactor && toMoon && p >= 1.05 && drop < 1;
      impactor.current.position.set(MOON[0] - 0.2, MOON[1] + 0.9 - drop * 0.55, MOON[2] + 0.3);
    }
    if (water.current) {
      const on = world.launched && hasImpactor && toMoon && p >= 1.45;
      water.current.visible = on;
      if (on) water.current.rotation.y += dt * 0.8;
    }
  });

  // On the pad the stack is shown on the launcher in assembly order.
  let y = 0;
  const stacked = world.stack.map((m) => {
    const at = y + MODULE_HEIGHT[m] / 2;
    y += MODULE_HEIGHT[m] + 0.02;
    return { m, at };
  });

  return (
    <>
      {world.launched && <primitive object={pathLine} />}
      {/* Launcher on the pad */}
      <group position={PAD}>
        <mesh position={[0, 0.6, 0]} castShadow visible={!world.launched}>
          <cylinderGeometry args={[0.2, 0.24, 1.2, 24]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[0.7, 0.8, 0.04, 32]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <Label3D text="ISRO launch pad" position={[0, 0.05, 0.95]} rotation={[-Math.PI / 2, 0, 0]} size={[1.4, 0.28]} style={{ bg: "#1E293B", fg: "#FFFFFF", scale: 0.5 }} />
      </group>
      <group ref={craft}>
        {stacked.map(({ m, at }) => (
          <group
            key={m}
            position={[0, at, 0]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              if (!disabled && !world.launched) onRemove(m);
            }}
            name={`stack-${m}`}
          >
            <ModuleMesh kind={m} />
          </group>
        ))}
      </group>
      <group ref={impactor} visible={false}>
        <ModuleMesh kind="impactor" />
      </group>
      <points ref={water} geometry={waterGeom} position={[MOON[0] - 0.2, MOON[1] + 0.32, MOON[2] + 0.3]} visible={false}>
        <pointsMaterial color="#60A5FA" size={0.05} transparent opacity={0.9} />
      </points>
    </>
  );
}

function Bodies() {
  return (
    <>
      <mesh position={MOON} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshStandardMaterial color="#D4D4D8" roughness={0.95} />
      </mesh>
      {[
        [0.2, 0.3, 0.42, 0.1],
        [-0.25, -0.1, 0.45, 0.08],
        [0.05, -0.32, 0.43, 0.06],
      ].map(([x, yy, z, r], i) => (
        <mesh key={i} position={[MOON[0] + x, MOON[1] + yy, MOON[2] + z]}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshStandardMaterial color="#A1A1AA" roughness={1} />
        </mesh>
      ))}
      <Label3D text="Moon" position={[MOON[0], MOON[1] + 0.85, MOON[2]]} size={[0.8, 0.24]} billboard style={{ bg: "#FFFFFF", fg: "#0F172A", scale: 0.55 }} />
      <mesh position={MARS} castShadow>
        <sphereGeometry args={[0.38, 40, 40]} />
        <meshStandardMaterial color="#C2410C" roughness={0.9} />
      </mesh>
      <Label3D text="Mars" position={[MARS[0], MARS[1] + 0.62, MARS[2]]} size={[0.7, 0.22]} billboard style={{ bg: "#FFFFFF", fg: "#7C2D12", scale: 0.55 }} />
    </>
  );
}

function Stars() {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 400;
    const pts = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 6);
      pts.set([v.x, Math.abs(v.y) + 1, v.z], i * 3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <points geometry={geom}>
      <pointsMaterial color="#E2E8F0" size={0.05} />
    </points>
  );
}

export function IgkoQ03Lunar(props: ActivityComponentProps) {
  const play = useInvestigation<LunarWorld>(props, lunarInitial, evaluateLunar);
  const { world, readOnly } = play;
  const ro = !!readOnly;

  const toggle = (m: MissionModule) =>
    play.set((w) => ({ ...w, launched: false, stack: w.stack.includes(m) ? w.stack.filter((x) => x !== m) : [...w.stack, m] }));
  const setDest = (d: Destination) => play.set((w) => ({ ...w, destination: d, launched: false }));
  const canLaunch = world.stack.length > 0 && world.destination !== null && !world.launched;
  const mission = world.launched ? identifyMission(world.stack, world.destination) : null;
  const water = world.launched && world.destination === "moon" && world.stack.includes("impactor");

  const telemetry = [
    { label: "Indian (ISRO) probe", ok: world.launched },
    { label: "Has an orbiter", ok: world.launched && world.stack.includes("orbiter") },
    { label: "Has an impact probe", ok: world.launched && world.stack.includes("impactor") },
    { label: "Water molecules detected in lunar soil", ok: water },
  ];

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Lunar Mission Reconstruction"
      mission="Rebuild the spacecraft described in the question from its modules, choose its target and launch it. Mission control identifies the mission you flew."
      icon={Rocket}
      submitLabel="Lock in identified mission"
      live={
        <>
          <Reading label="Modules on stack" value={world.stack.length ? world.stack.map((m) => MODULE_INFO[m].name).join(" + ") : "—"} />
          <Reading label="Target" value={world.destination ? world.destination.toUpperCase() : "—"} />
          <Reading label="Status" value={world.launched ? (mission ? `Identified: ${mission.name}` : "Flown · no match") : "On the pad"} tone={world.launched ? "teal" : "slate"} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Lab3D camera={{ position: [0.3, 3.9, 8.6], fov: 47 }} background="#020617" readOnly={readOnly} badge="Mission control · drag to look around">
          <Stars />
          <directionalLight position={[-6, 4, 4]} intensity={1.6} color="#FFF7ED" castShadow />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[-0.6, 0, 1.2]}>
            <planeGeometry args={[7, 4]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          <Shelf stack={world.stack} disabled={ro || world.launched} onToggle={toggle} />
          <Bodies />
          <Flight world={world} disabled={ro} onRemove={toggle} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Assembly bay">
            <p className="text-[11px] text-slate-500 mb-2">Tap a module on the shelf (or here) to add it to the stack; tap it on the stack to remove it.</p>
            <ul className="space-y-1.5">
              {MODULES.map((m) => (
                <li key={m}>
                  <Chip active={world.stack.includes(m)} disabled={ro} onClick={() => toggle(m)} title={MODULE_INFO[m].role}>
                    {world.stack.includes(m) ? "✓ " : "+ "}
                    {MODULE_INFO[m].name}
                  </Chip>
                  <span className="block text-[10.5px] text-slate-500 mt-0.5">{MODULE_INFO[m].role}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Flight plan">
            <div className="flex gap-1.5">
              <Chip active={world.destination === "moon"} disabled={ro} onClick={() => setDest("moon")}>Target: Moon</Chip>
              <Chip active={world.destination === "mars"} disabled={ro} onClick={() => setDest("mars")}>Target: Mars</Chip>
            </div>
            <button
              type="button"
              disabled={ro || !canLaunch}
              onClick={() => play.patch({ launched: true })}
              className="mt-2 w-full h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Rocket className="w-4 h-4" /> {world.launched ? "Launched" : "Launch"}
            </button>
          </Panel>
          <Panel title="Mission telemetry">
            <ul className="space-y-1">
              {telemetry.map((t) => (
                <li key={t.label} className={`flex items-center gap-1.5 text-xs font-semibold ${t.ok ? "text-emerald-800" : "text-slate-400"}`}>
                  {t.ok ? <Check className="w-3.5 h-3.5" /> : <XIcon className="w-3.5 h-3.5" />}
                  {t.label}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Investigation>
  );
}

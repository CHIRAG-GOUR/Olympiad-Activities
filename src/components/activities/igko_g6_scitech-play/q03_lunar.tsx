"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, Stars } from "@react-three/drei";
import { Rocket, Check, Minus, Wrench, Orbit } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "./kit";
import { Metal, Brushed, Matte } from "./models";
import {
  MODULES,
  MODULE_INFO,
  PATCHES,
  evaluateLunar,
  lunarInitial,
  lunarTelemetry,
  type Destination,
  type LunarWorld,
  type MissionModule,
  type PatchId,
} from "./logic";

/**
 * Q3 · Lunar mission reconstruction.
 * Investigate: assemble a spacecraft from real module types in the clean room and fly it.
 * Its instruments report what they find — never a mission name.
 * Answer: attach the mission patch you think this spacecraft flew under.
 */

/* ── Procedural planet surfaces ──────────────────────────────── */

function usePlanetTexture(kind: "moon" | "earth" | "mars") {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d")!;
    let s = kind === "moon" ? 11 : kind === "earth" ? 23 : 37;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    if (kind === "moon") {
      g.fillStyle = "#A9A9AD";
      g.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 9; i++) {
        g.fillStyle = `rgba(80,80,88,${0.25 + rnd() * 0.25})`;
        g.beginPath();
        g.ellipse(rnd() * 512, 40 + rnd() * 170, 30 + rnd() * 50, 18 + rnd() * 30, rnd() * 3, 0, Math.PI * 2);
        g.fill();
      }
      for (let i = 0; i < 160; i++) {
        const x = rnd() * 512;
        const y = rnd() * 256;
        const r = 1.5 + rnd() * rnd() * 14;
        g.fillStyle = "rgba(60,60,66,0.55)";
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = "rgba(220,220,225,0.5)";
        g.lineWidth = 1;
        g.beginPath();
        g.arc(x - r * 0.15, y - r * 0.15, r, Math.PI * 0.9, Math.PI * 1.8);
        g.stroke();
      }
    } else if (kind === "earth") {
      g.fillStyle = "#1D4E89";
      g.fillRect(0, 0, 512, 256);
      // Continents: clusters of small patches rather than single blobs.
      for (let c = 0; c < 6; c++) {
        const cx = rnd() * 512;
        const cy = 50 + rnd() * 150;
        for (let i = 0; i < 16; i++) {
          g.fillStyle = rnd() > 0.35 ? "#3E7B3B" : "#9C8350";
          g.beginPath();
          g.ellipse(cx + (rnd() - 0.5) * 70, cy + (rnd() - 0.5) * 50, 6 + rnd() * 14, 4 + rnd() * 9, rnd() * 3, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.fillStyle = "#F1F5F9";
      g.fillRect(0, 0, 512, 16);
      g.fillRect(0, 240, 512, 16);
      for (let i = 0; i < 40; i++) {
        g.fillStyle = "rgba(255,255,255,0.55)";
        g.beginPath();
        g.ellipse(rnd() * 512, rnd() * 256, 18 + rnd() * 40, 3 + rnd() * 6, 0, 0, Math.PI * 2);
        g.fill();
      }
    } else {
      g.fillStyle = "#B4532A";
      g.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 30; i++) {
        g.fillStyle = `rgba(90,35,20,${0.3 + rnd() * 0.3})`;
        g.beginPath();
        g.ellipse(rnd() * 512, rnd() * 256, 15 + rnd() * 40, 8 + rnd() * 20, rnd() * 3, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = "#F8FAFC";
      g.fillRect(0, 0, 512, 10);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [kind]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function Planet({ kind, radius, position, spin = 0.05 }: { kind: "moon" | "earth" | "mars"; radius: number; position: [number, number, number]; spin?: number }) {
  const map = usePlanetTexture(kind);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * spin;
  });
  return (
    <group position={position}>
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={map} bumpMap={map} bumpScale={kind === "moon" ? 2.5 : 0.6} roughness={kind === "earth" ? 0.55 : 0.95} />
      </mesh>
      {kind === "earth" && (
        <mesh>
          <sphereGeometry args={[radius * 1.03, 48, 48]} />
          <meshBasicMaterial color="#7DD3FC" transparent opacity={0.12} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
}

/* ── Spacecraft modules (clean-room scale) ───────────────────── */

const GOLD = "#D4A73C";

function SolarWing({ length = 1.0, side = 1 }: { length?: number; side?: 1 | -1 }) {
  return (
    <group position={[side * (0.3 + length / 2), 0, 0]}>
      <mesh>
        <boxGeometry args={[length, 0.012, 0.36]} />
        <meshStandardMaterial color="#14285A" metalness={0.6} roughness={0.25} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-length / 2 + (i + 0.5) * (length / 5), 0.008, 0]}>
          <boxGeometry args={[0.006, 0.004, 0.36]} />
          <Metal color="#D1D5DB" />
        </mesh>
      ))}
      <mesh position={[-side * (length / 2 + 0.04), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.1, 8]} />
        <Metal />
      </mesh>
    </group>
  );
}

function ModuleModel({ kind }: { kind: MissionModule }) {
  switch (kind) {
    case "orbiter":
      return (
        <group>
          <RoundedBox args={[0.5, 0.42, 0.5]} radius={0.02} castShadow>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.38} />
          </RoundedBox>
          <SolarWing side={1} />
          <mesh position={[0, 0.3, 0.18]} rotation={[-0.6, 0, 0]}>
            <sphereGeometry args={[0.13, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
            <meshStandardMaterial color="#F1F5F9" metalness={0.3} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.24, 0.12]}>
            <cylinderGeometry args={[0.008, 0.008, 0.12, 6]} />
            <Metal />
          </mesh>
        </group>
      );
    case "impactor":
      return (
        <group>
          <RoundedBox args={[0.24, 0.2, 0.24]} radius={0.015} castShadow>
            <Brushed color="#C9CFD6" />
          </RoundedBox>
          {["#FF9933", "#FFFFFF", "#138808"].map((c, i) => (
            <mesh key={c} position={[0, 0.045 - i * 0.045, 0.1205]}>
              <planeGeometry args={[0.18, 0.04]} />
              <meshStandardMaterial color={c} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.1215]}>
            <circleGeometry args={[0.014, 16]} />
            <meshStandardMaterial color="#1E3A8A" />
          </mesh>
        </group>
      );
    case "lander":
      return (
        <group>
          <RoundedBox args={[0.5, 0.3, 0.5]} radius={0.02} castShadow>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.42} />
          </RoundedBox>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => (
            <group key={`${x}${z}`}>
              <mesh position={[x * 0.3, -0.2, z * 0.3]} rotation={[z * 0.35, 0, -x * 0.35]}>
                <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
                <Metal />
              </mesh>
              <mesh position={[x * 0.35, -0.33, z * 0.35]}>
                <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
                <Metal color="#9CA3AF" />
              </mesh>
            </group>
          ))}
        </group>
      );
    case "rover":
      return (
        <group>
          <RoundedBox args={[0.32, 0.1, 0.24]} radius={0.01} castShadow>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0.08, -0.05]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[0.3, 0.008, 0.14]} />
            <meshStandardMaterial color="#14285A" metalness={0.6} roughness={0.25} />
          </mesh>
          {[-0.12, 0, 0.12].map((x) =>
            [-1, 1].map((sz) => (
              <mesh key={`${x}${sz}`} position={[x, -0.06, sz * 0.14]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
                <Matte color="#334155" roughness={0.6} />
              </mesh>
            ))
          )}
        </group>
      );
    default:
      return (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.42, 32]} />
            <Brushed color="#D1D5DB" />
          </mesh>
          <SolarWing side={-1} length={1.2} />
        </group>
      );
  }
}

const MODULE_H: Record<MissionModule, number> = { orbiter: 0.44, impactor: 0.22, lander: 0.62, rover: 0.2, propulsion: 0.44 };

function CraftStack({ stack, patch }: { stack: MissionModule[]; patch: PatchId | null }) {
  let y = 0;
  return (
    <group>
      {stack.map((m) => {
        const at = y + MODULE_H[m] / 2 + (m === "lander" ? 0.12 : 0);
        y += MODULE_H[m] + 0.03;
        return (
          <group key={m} position={[0, at, 0]}>
            <ModuleModel kind={m} />
          </group>
        );
      })}
      {patch && stack.length > 0 && (
        <group position={[0, MODULE_H[stack[0]] / 2 + (stack[0] === "lander" ? 0.12 : 0), 0.27]}>
          <mesh>
            <circleGeometry args={[0.09, 32]} />
            <meshStandardMaterial color="#0B1F4D" />
          </mesh>
          <Label3D text={PATCHES[patch].name} position={[0, 0, 0.002]} size={[0.16, 0.05]} style={{ bg: null, fg: "#FDE68A", scale: 0.7 }} />
        </group>
      )}
    </group>
  );
}

function CleanRoom({ world, disabled, onToggle }: { world: LunarWorld; disabled: boolean; onToggle: (m: MissionModule) => void }) {
  return (
    <>
      <Studio shadowScale={8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#E6EBF1" roughness={0.6} />
      </mesh>
      {/* Assembly stand */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.5, 48]} />
        <Brushed color="#B8C0C9" />
      </mesh>
      <group position={[0, 0.52, 0]}>
        <CraftStack stack={world.stack} patch={world.patch} />
      </group>
      {world.stack.length === 0 && <Label3D text="Empty assembly stand" position={[0, 1.0, 0]} size={[1.5, 0.22]} billboard style={{ bg: "#FFFFFF", fg: "#334155", border: "#CBD5E1", scale: 0.5 }} />}
      {/* Parts rack */}
      <group position={[0, 0, 2.0]}>
        <RoundedBox args={[4.4, 0.06, 0.8]} radius={0.02} position={[0, 0.6, 0]} receiveShadow castShadow>
          <meshPhysicalMaterial color="#F8FAFC" roughness={0.3} clearcoat={0.5} />
        </RoundedBox>
        {[-2.1, 2.1].map((x) => (
          <mesh key={x} position={[x, 0.3, 0]}>
            <boxGeometry args={[0.05, 0.6, 0.6]} />
            <Brushed />
          </mesh>
        ))}
        {MODULES.map((m, i) => {
          const used = world.stack.includes(m);
          return (
            <group key={m} position={[-1.68 + i * 0.84, 0.63, 0]}>
              <group
                visible={!used}
                scale={0.55}
                position={[0, MODULE_H[m] * 0.3 + (m === "lander" ? 0.07 : 0), 0]}
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
                <ModuleModel kind={m} />
              </group>
              <Label3D text={MODULE_INFO[m].name} position={[0, 0.04, 0.33]} rotation={[-Math.PI / 2.4, 0, 0]} size={[0.6, 0.1]} style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
            </group>
          );
        })}
      </group>
    </>
  );
}

/* ── Space: Earth, Moon and Mars ─────────────────────────────── */

const EARTH: [number, number, number] = [-5.2, 0, 1.5];
const MOON: [number, number, number] = [2.4, 0.4, -0.6];
const MARS: [number, number, number] = [6.5, -0.4, 3.2];
const MOON_R = 1.5;

function Space({ world }: { world: LunarWorld }) {
  const craft = useRef<THREE.Group>(null);
  const probe = useRef<THREE.Group>(null);
  const water = useRef<THREE.Group>(null);
  const progress = useRef(world.launched ? 1.6 : 0);
  useEffect(() => {
    if (!world.launched) progress.current = 0;
  }, [world.launched]);

  const target = world.destination === "mars" ? MARS : MOON;
  const targetR = world.destination === "mars" ? 0.9 : MOON_R;
  const curve = useMemo(
    () =>
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(EARTH[0] + 2.0, EARTH[1] + 0.3, EARTH[2]),
        new THREE.Vector3(EARTH[0] + 3.5, 2.6, EARTH[2] - 1.5),
        new THREE.Vector3(target[0] - 3, target[1] + 2.4, target[2]),
        new THREE.Vector3(target[0] - targetR - 0.35, target[1], target[2])
      ),
    [target, targetR]
  );
  const path = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    const l = new THREE.Line(g, new THREE.LineDashedMaterial({ color: "#FDE68A", dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.7 }));
    l.computeLineDistances();
    return l;
  }, [curve]);
  useEffect(() => () => path.geometry.dispose(), [path]);

  const hasImpactor = world.stack.includes("impactor");
  const toMoon = world.destination === "moon";

  useFrame((clock, dt) => {
    if (world.launched) progress.current = Math.min(2.2, progress.current + dt * 0.3);
    const p = progress.current;
    const g = craft.current;
    if (g) {
      g.visible = world.launched;
      if (p < 1) g.position.copy(curve.getPoint(p));
      else {
        const a = clock.clock.elapsedTime * 0.6;
        g.position.set(target[0] + Math.cos(a) * (targetR + 0.35), target[1] + 0.1, target[2] + Math.sin(a) * (targetR + 0.35));
      }
    }
    if (probe.current) {
      const drop = THREE.MathUtils.clamp((p - 1.1) / 0.5, 0, 1);
      probe.current.visible = world.launched && hasImpactor && toMoon && p > 1.1 && drop < 1;
      const start = new THREE.Vector3(MOON[0] - 0.4, MOON[1] + MOON_R + 0.6, MOON[2] + 0.5);
      const end = new THREE.Vector3(MOON[0] - 0.35, MOON[1] + MOON_R * 0.92, MOON[2] + 0.45);
      probe.current.position.copy(start.lerp(end, drop));
    }
    if (water.current) {
      const on = world.launched && hasImpactor && toMoon && p > 1.6;
      water.current.visible = on;
      water.current.children.forEach((m, i) => {
        const t = (clock.clock.elapsedTime * 0.35 + i / 6) % 1;
        m.position.set(Math.cos(i * 2.1) * 0.12 * t, t * 0.55, Math.sin(i * 2.1) * 0.12 * t);
        m.scale.setScalar(0.6 + t * 0.4);
      });
    }
  });

  return (
    <>
      <color attach="background" args={["#02040A"]} />
      <Stars radius={60} depth={30} count={2500} factor={3} fade speed={0.3} />
      <ambientLight intensity={0.08} />
      <directionalLight position={[-12, 4, 6]} intensity={2.6} color="#FFF4E0" castShadow />
      <Planet kind="earth" radius={1.8} position={EARTH} spin={0.08} />
      <Planet kind="moon" radius={MOON_R} position={MOON} spin={0.02} />
      <Planet kind="mars" radius={0.9} position={MARS} spin={0.06} />
      <Label3D text="Earth" position={[EARTH[0], EARTH[1] + 2.3, EARTH[2]]} size={[0.9, 0.24]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
      <Label3D text="Moon" position={[MOON[0], MOON[1] + MOON_R + 0.45, MOON[2]]} size={[0.9, 0.24]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
      <Label3D text="Mars" position={[MARS[0], MARS[1] + 1.25, MARS[2]]} size={[0.9, 0.24]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
      {world.launched && <primitive object={path} />}
      {/* The spacecraft, true to scale next to worlds: a small bright craft */}
      <group ref={craft} visible={false} scale={0.12}>
        <CraftStack stack={world.stack.filter((m) => !(m === "impactor" && progress.current > 1.1 && toMoon))} patch={null} />
        <pointLight color="#FDE68A" intensity={0.6} distance={1.5} />
      </group>
      <group ref={probe} visible={false} scale={0.12}>
        <ModuleModel kind="impactor" />
      </group>
      <group ref={water} position={[MOON[0] - 0.35, MOON[1] + MOON_R * 0.92, MOON[2] + 0.45]} visible={false}>
        {Array.from({ length: 6 }, (_, i) => (
          <group key={i}>
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#EF4444" emissive="#7F1D1D" emissiveIntensity={0.4} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.035, 0.022, 0]}>
                <sphereGeometry args={[0.02, 10, 10]} />
                <meshStandardMaterial color="#F8FAFC" emissive="#CBD5E1" emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </>
  );
}

export function IgkoQ03Lunar(props: ActivityComponentProps) {
  const play = useInvestigation<LunarWorld>(props, lunarInitial, evaluateLunar);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [view, setView] = useState<"bay" | "space">(world.launched ? "space" : "bay");
  const toggle = (m: MissionModule) =>
    play.set((w) => ({ ...w, launched: false, stack: w.stack.includes(m) ? w.stack.filter((x) => x !== m) : [...w.stack, m] }));
  const setDest = (d: Destination) => play.set((w) => ({ ...w, destination: d, launched: false }));
  const t = lunarTelemetry(world);
  const canLaunch = world.stack.length > 0 && !!world.destination && !world.launched;

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Lunar Mission Reconstruction"
      mission="Rebuild the spacecraft the question describes and fly it. Then attach the mission patch you think it flew under."
      icon={Rocket}
      live={
        <>
          <Reading label="On the stand" value={world.stack.length ? world.stack.map((m) => MODULE_INFO[m].name).join(" + ") : "—"} />
          <Reading label="Target" value={world.destination ? world.destination.toUpperCase() : "—"} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <Chip active={view === "bay"} onClick={() => setView("bay")}>
              <Wrench className="inline w-3 h-3 mr-1" /> Clean room
            </Chip>
            <Chip active={view === "space"} onClick={() => setView("space")}>
              <Orbit className="inline w-3 h-3 mr-1" /> Space
            </Chip>
          </div>
          {view === "bay" ? (
            <Lab3D key="bay" camera={{ position: [2.2, 2.3, 4.8], fov: 40 }} readOnly={readOnly} orbit={{ target: [0, 0.8, 0.6], minDistance: 2, maxDistance: 7 }} badge="Clean room · tap a module to fit it">
              <CleanRoom world={world} disabled={ro || world.launched} onToggle={toggle} />
            </Lab3D>
          ) : (
            <Lab3D key="space" camera={{ position: [0.5, 4.2, 11], fov: 48 }} readOnly={readOnly} orbit={{ target: [0.5, 0, 1], minDistance: 5, maxDistance: 20, maxPolarAngle: Math.PI }} badge="Earth, Moon and Mars · drag to look around">
              <Space world={world} />
            </Lab3D>
          )}
        </div>

        <div className="space-y-3">
          <Panel title="Assembly">
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
          <Panel title="Flight">
            <div className="flex gap-1.5">
              <Chip active={world.destination === "moon"} disabled={ro} onClick={() => setDest("moon")}>Target the Moon</Chip>
              <Chip active={world.destination === "mars"} disabled={ro} onClick={() => setDest("mars")}>Target Mars</Chip>
            </div>
            <button
              type="button"
              disabled={ro || !canLaunch}
              onClick={() => {
                play.patch({ launched: true });
                setView("space");
              }}
              className="mt-2 w-full h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Rocket className="w-4 h-4" /> {world.launched ? "Launched" : "Launch"}
            </button>
            <ul className="mt-2 space-y-0.5">
              {[
                ["Orbiter reporting", t.orbiter],
                ["Impact probe reached the surface", t.impactor && world.destination === "moon"],
                ["Water molecules detected in the soil", t.waterDetected],
              ].map(([label, ok]) => (
                <li key={label as string} className={`flex items-center gap-1.5 text-[11.5px] font-semibold ${ok ? "text-emerald-800" : "text-slate-400"}`}>
                  {ok ? <Check className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  {label as string}
                </li>
              ))}
            </ul>
          </Panel>
          <AnswerStation title="Mission patch" hint="Attach the patch you think this spacecraft flew under. It appears on the spacecraft.">
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(PATCHES) as PatchId[]).map((p) => (
                <Chip key={p} active={world.patch === p} disabled={ro} onClick={() => play.patch({ patch: world.patch === p ? null : p })} tone="violet">
                  {PATCHES[p].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

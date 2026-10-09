"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Anchor, ArrowDown, ArrowUp, NotebookPen, TrendingUp } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, approach } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Slider, Reading, Studio, useInvestigation } from "./kit";
import { Metal, Plastic, Glass, Matte } from "./models";
import { MAX_DEPTH_M, TRENDS, diveInitial, evaluateDive, pressureAt, type DiveWorld, type TrendId } from "./logic";

/**
 * Q14 · Deep-sea pressure dive.
 * Investigate: pilot the submarine down and up, log the pressure gauge at different depths.
 * Answer: draw the trend line you see on the dive graph.
 */

const COLUMN = 6.5; // scene units for 0–300 m
const depthY = (d: number) => -(d / MAX_DEPTH_M) * COLUMN;

function Submarine({ depth }: { depth: number }) {
  const ref = useRef<THREE.Group>(null);
  const prop = useRef<THREE.Mesh>(null);
  const arrows = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y = approach(ref.current.position.y, depthY(depth), 3, dt);
    if (prop.current) prop.current.rotation.x += dt * 12;
    if (arrows.current) {
      const s = 0.4 + (depth / MAX_DEPTH_M) * 1.4;
      arrows.current.children.forEach((a) => a.scale.setScalar(s));
    }
  });
  const arrowDirs = useMemo(() => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2), []);
  return (
    <group ref={ref}>
      {/* Hull */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.2, 0.7, 12, 32]} />
        <Plastic color="#F2B705" roughness={0.3} clearcoat={0.8} />
      </mesh>
      {/* Conning tower */}
      <mesh position={[0.05, 0.25, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.16, 24]} />
        <Plastic color="#E0A800" roughness={0.35} />
      </mesh>
      {/* Viewport */}
      <mesh position={[0.52, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.11, 32]} />
        <Glass tint="#93C5FD" opacity={0.6} />
      </mesh>
      <mesh position={[0.5, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.115, 0.015, 10, 32]} />
        <Metal />
      </mesh>
      {/* Propeller and fins */}
      <mesh ref={prop} position={[-0.58, 0, 0]}>
        <boxGeometry args={[0.02, 0.26, 0.05]} />
        <Metal color="#9CA3AF" />
      </mesh>
      <mesh position={[-0.48, 0, 0]}>
        <boxGeometry args={[0.12, 0.02, 0.36]} />
        <Plastic color="#E0A800" />
      </mesh>
      <pointLight position={[0.7, 0, 0]} color="#FEF3C7" intensity={1.5} distance={2.5} />
      {/* Water pressing in on the hull from every side */}
      <group ref={arrows}>
        {arrowDirs.map((a, i) => (
          <group key={i} position={[Math.cos(a) * 0.15, Math.sin(a) * 0.4, 0]} rotation={[0, 0, a + Math.PI / 2]}>
            <group position={[0, 0.55, 0]}>
              <mesh rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.035, 0.08, 10]} />
                <meshBasicMaterial color="#60A5FA" transparent opacity={0.85} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
                <meshBasicMaterial color="#60A5FA" transparent opacity={0.85} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

function Fish({ y, speed, offset }: { y: number; speed: number; offset: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((c) => {
    if (!ref.current) return;
    const t = (c.clock.elapsedTime * speed + offset) % 1;
    ref.current.position.x = -3 + t * 6;
  });
  return (
    <group ref={ref} position={[0, y, -1.2]}>
      <mesh scale={[1, 0.5, 0.35]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <Plastic color="#F97316" roughness={0.4} />
      </mesh>
      <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.035, 0.06, 4]} />
        <Plastic color="#EA580C" />
      </mesh>
    </group>
  );
}

function Ocean({ depth }: { depth: number }) {
  const column = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#38BDF8");
    grad.addColorStop(0.35, "#0E5E8C");
    grad.addColorStop(1, "#04121F");
    g.fillStyle = grad;
    g.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <>
      {/* Water backdrop that darkens with depth */}
      <mesh position={[0, -COLUMN / 2 + 0.2, -2]}>
        <planeGeometry args={[12, COLUMN + 1.2]} />
        <meshBasicMaterial map={column} />
      </mesh>
      {/* Light shafts near the surface */}
      {[-1.4, 0.2, 1.6].map((x, i) => (
        <mesh key={i} position={[x, -0.7, -1.6]} rotation={[0, 0, 0.12 * (i - 1)]}>
          <planeGeometry args={[0.35, 1.8]} />
          <meshBasicMaterial color="#E0F2FE" transparent opacity={0.08} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 4]} />
        <meshPhysicalMaterial color="#7DD3FC" transparent opacity={0.35} roughness={0.1} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      {/* Seabed with rocks */}
      <mesh position={[0, -COLUMN - 0.35, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 4]} />
        <Matte color="#3F3A2E" />
      </mesh>
      {[-1.8, -0.6, 1.1, 2.0].map((x, i) => (
        <mesh key={i} position={[x, -COLUMN - 0.25, -0.8 + (i % 2) * 0.3]} scale={[1, 0.6, 1]}>
          <dodecahedronGeometry args={[0.18 + (i % 3) * 0.06]} />
          <Matte color="#57534E" />
        </mesh>
      ))}
      <Fish y={-0.8} speed={0.06} offset={0.1} />
      <Fish y={-1.5} speed={0.05} offset={0.6} />
      <Fish y={-2.6} speed={0.04} offset={0.3} />
      {[0, 50, 100, 150, 200, 250, 300].map((d) => (
        <Label3D key={d} text={`${d} m`} position={[-2.4, depthY(d), -0.4]} size={[0.5, 0.15]} style={{ bg: depth >= d - 5 && depth <= d + 5 ? "#FDE68A" : "#0F172A", fg: depth >= d - 5 && depth <= d + 5 ? "#0F172A" : "#E2E8F0", scale: 0.6 }} />
      ))}
    </>
  );
}

function Gauge({ kPa }: { kPa: number }) {
  const max = 3200;
  const a = -135 + (Math.min(kPa, max) / max) * 270;
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto" role="img" aria-label={`Pressure ${kPa} kilopascals`}>
      <circle cx="60" cy="60" r="54" fill="#0F172A" stroke="#94A3B8" strokeWidth="4" />
      {Array.from({ length: 9 }, (_, i) => {
        const r = ((-135 + i * 33.75) * Math.PI) / 180;
        return <line key={i} x1={60 + Math.sin(r) * 42} y1={60 - Math.cos(r) * 42} x2={60 + Math.sin(r) * 50} y2={60 - Math.cos(r) * 50} stroke="#E2E8F0" strokeWidth="2" />;
      })}
      <line x1="60" y1="60" x2={60 + Math.sin((a * Math.PI) / 180) * 40} y2={60 - Math.cos((a * Math.PI) / 180) * 40} stroke="#F87171" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="60" r="5" fill="#F87171" />
      <text x="60" y="92" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontFamily="monospace">{kPa} kPa</text>
    </svg>
  );
}

/** Logged readings, plus the trend line the student draws. */
function DiveGraph({ log, trend }: { log: { depth: number; kPa: number }[]; trend: TrendId | null }) {
  const W = 260;
  const H = 150;
  const x = (d: number) => 30 + (d / MAX_DEPTH_M) * (W - 40);
  const y = (p: number) => H - 22 - (p / 3200) * (H - 34);
  const line =
    trend === "rises"
      ? `M${x(0)},${y(300)} L${x(300)},${y(2800)}`
      : trend === "falls"
      ? `M${x(0)},${y(2800)} L${x(300)},${y(300)}`
      : trend === "flat"
      ? `M${x(0)},${y(1500)} L${x(300)},${y(1500)}`
      : trend === "zigzag"
      ? `M${x(0)},${y(1200)} L${x(60)},${y(2400)} L${x(120)},${y(600)} L${x(180)},${y(2200)} L${x(240)},${y(900)} L${x(300)},${y(2000)}`
      : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-white border border-slate-200" role="img" aria-label="Pressure against depth">
      <line x1="30" y1={H - 22} x2={W - 10} y2={H - 22} stroke="#94A3B8" />
      <line x1="30" y1="10" x2="30" y2={H - 22} stroke="#94A3B8" />
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="8" fill="#475569">Depth (m) →</text>
      <text x="8" y={H / 2} fontSize="8" fill="#475569" transform={`rotate(-90 8 ${H / 2})`} textAnchor="middle">Pressure (kPa)</text>
      {[0, 100, 200, 300].map((d) => (
        <text key={d} x={x(d)} y={H - 13} fontSize="7" textAnchor="middle" fill="#64748B">{d}</text>
      ))}
      {line && <path d={line} stroke="#7C3AED" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />}
      {log.map((r, i) => (
        <circle key={i} cx={x(r.depth)} cy={y(r.kPa)} r="3.5" fill="#0EA5E9" stroke="#0369A1" />
      ))}
      {log.length === 0 && (
        <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="9" fill="#94A3B8">No readings logged yet</text>
      )}
    </svg>
  );
}

export function IgkoQ14Dive(props: ActivityComponentProps) {
  const play = useInvestigation<DiveWorld>(props, diveInitial, evaluateDive);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const kPa = pressureAt(world.depth);
  const go = (d: number) => play.patch({ depth: Math.max(0, Math.min(MAX_DEPTH_M, Math.round(d / 5) * 5)) });

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Deep-Sea Pressure Dive"
      mission="Take the submarine down and log the pressure gauge at different depths. Then draw the trend line you see on the graph."
      icon={Anchor}
      live={
        <>
          <Reading label="Depth" value={`${world.depth} m`} />
          <Reading label="Pressure" value={`${kPa} kPa`} tone="teal" />
          <Reading label="Readings logged" value={world.log.length} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, -3.2, 6.6], fov: 52 }} background="#041A2B" readOnly={readOnly} badge="Ocean · drag to look around" orbit={{ target: [0, -3.2, 0], minDistance: 3, maxDistance: 10, maxPolarAngle: Math.PI }}>
          <Studio shadows={false} intensity={0.35} />
          <Ocean depth={world.depth} />
          <Submarine depth={world.depth} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Helm">
            <Slider label="Depth" value={world.depth} min={0} max={MAX_DEPTH_M} step={5} unit=" m" disabled={ro} onChange={go} />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <Chip disabled={ro || world.depth <= 0} onClick={() => go(world.depth - 25)}>
                <ArrowUp className="inline w-3 h-3 mr-1" /> Rise 25 m
              </Chip>
              <Chip disabled={ro || world.depth >= MAX_DEPTH_M} onClick={() => go(world.depth + 25)}>
                <ArrowDown className="inline w-3 h-3 mr-1" /> Dive 25 m
              </Chip>
            </div>
          </Panel>
          <Panel title="Pressure gauge">
            <Gauge kPa={kPa} />
            <Chip disabled={ro} onClick={() => play.patch({ log: [...world.log, { depth: world.depth, kPa }] })}>
              <NotebookPen className="inline w-3 h-3 mr-1" /> Log this reading
            </Chip>
            {world.log.length > 0 && (
              <button type="button" disabled={ro} onClick={() => play.patch({ log: [] })} className="ml-2 text-[11px] font-bold text-slate-500 hover:underline disabled:opacity-40">
                Clear log
              </button>
            )}
          </Panel>
          <AnswerStation title="Draw the trend" hint="Draw the line that shows what happens to the pressure as you go deeper.">
            <DiveGraph log={world.log} trend={world.trend} />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {(Object.keys(TRENDS) as TrendId[]).map((t) => (
                <Chip key={t} active={world.trend === t} disabled={ro} onClick={() => play.patch({ trend: world.trend === t ? null : t })} tone="violet">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  {TRENDS[t].label}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

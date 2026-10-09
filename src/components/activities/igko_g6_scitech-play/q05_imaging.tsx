"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { ScanSearch, Play as PlayIcon, MapPin, PenLine } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Studio, useInvestigation } from "./kit";
import { Metal, Brushed, Plastic, Matte } from "./models";
import { STRUCTURES, TECHS, TECH_SPECS, evaluateImaging, imagingInitial, type ImagingWorld, type Tech } from "./logic";

/**
 * Q5 · Medical imaging centre.
 * Investigate: wheel the patient into each room, run its procedure and read the
 * instruments and images. Answer: sign the referral for the test the question describes.
 */

const ROOM_X: Record<Tech, number> = { xray: -4.8, ultrasound: -1.6, mri: 1.6, chemo: 4.8 };
const RUN_MS = 2600;

function Room({ tech, children, onPick, disabled }: { tech: Tech; children: React.ReactNode; onPick: () => void; disabled: boolean }) {
  return (
    <group position={[ROOM_X[tech], 0, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        receiveShadow
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
        <planeGeometry args={[3.0, 3.2]} />
        <meshPhysicalMaterial color="#EAF3FB" roughness={0.35} clearcoat={0.4} />
      </mesh>
      {/* Back wall and partition */}
      <mesh position={[0, 1.4, -1.55]} receiveShadow>
        <boxGeometry args={[3.0, 2.8, 0.08]} />
        <Matte color="#F4F7FA" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.9, -1.5]}>
        <boxGeometry args={[3.0, 0.12, 0.02]} />
        <Matte color="#2A9D8F" roughness={0.6} />
      </mesh>
      <mesh position={[1.52, 1.1, -0.4]}>
        <boxGeometry args={[0.06, 2.2, 2.3]} />
        <Matte color="#D5DEE8" roughness={0.9} />
      </mesh>
      <Label3D text={`${TECH_SPECS[tech].station}`} position={[0, 2.55, -1.5]} size={[0.9, 0.26]} style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.55 }} />
      {children}
    </group>
  );
}

function XRayRoom({ running }: { running: boolean }) {
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((c) => {
    if (beam.current) beam.current.opacity = running ? 0.18 + Math.sin(c.clock.elapsedTime * 22) * 0.06 : 0;
  });
  return (
    <group>
      <RoundedBox args={[0.9, 1.6, 0.14]} radius={0.04} position={[0, 1.2, -1.35]} castShadow>
        <Plastic color="#F1F5F9" />
      </RoundedBox>
      <mesh position={[0, 2.55, 0.3]}>
        <boxGeometry args={[0.1, 0.1, 2.4]} />
        <Brushed />
      </mesh>
      <mesh position={[0, 2.1, 0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 10]} />
        <Metal />
      </mesh>
      <RoundedBox args={[0.42, 0.32, 0.36]} radius={0.04} position={[0, 1.62, 0.5]} castShadow>
        <Plastic color="#E2E8F0" />
      </RoundedBox>
      <mesh position={[0, 1.05, -0.3]} rotation={[Math.PI / 2 - 0.65, 0, 0]}>
        <coneGeometry args={[0.45, 1.4, 32, 1, true]} />
        <meshBasicMaterial ref={beam} color="#FDE68A" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function UltrasoundRoom({ running }: { running: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((c) => {
    if (!ring.current) return;
    const t = (c.clock.elapsedTime * 1.3) % 1;
    ring.current.visible = running;
    ring.current.scale.setScalar(0.2 + t * 1.1);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.8;
  });
  return (
    <group>
      <group position={[0.95, 0, -0.7]}>
        <RoundedBox args={[0.5, 0.9, 0.45]} radius={0.05} position={[0, 0.6, 0]} castShadow>
          <Plastic color="#E8EEF5" />
        </RoundedBox>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
          <Metal />
        </mesh>
        <RoundedBox args={[0.62, 0.42, 0.05]} radius={0.02} position={[0, 1.55, 0.05]} castShadow>
          <meshStandardMaterial color="#0B1220" emissive={running ? "#0EA5E9" : "#000"} emissiveIntensity={running ? 0.35 : 0} roughness={0.2} />
        </RoundedBox>
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, 0.05, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
            <Matte color="#1F2937" />
          </mesh>
        ))}
      </group>
      <mesh ref={ring} position={[0, 0.98, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.01, 8, 48]} />
        <meshBasicMaterial color="#38BDF8" transparent />
      </mesh>
    </group>
  );
}

function MRIRoom({ running }: { running: boolean }) {
  const field = useRef<THREE.Group>(null);
  useFrame((c) => {
    if (!field.current) return;
    field.current.visible = running;
    field.current.children.forEach((ch, i) => {
      const t = (c.clock.elapsedTime * 0.5 + i / 4) % 1;
      ch.scale.setScalar(1 + t * 0.6);
      ((ch as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.5;
    });
  });
  return (
    <group position={[0, 1.05, -0.75]}>
      {/* Gantry: gloss-white housing with a bore */}
      <mesh castShadow>
        <torusGeometry args={[0.72, 0.38, 32, 64]} />
        <meshPhysicalMaterial color="#F8FAFC" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[1.1, 0.025, 12, 64]} />
        <Plastic color="#2563EB" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.36, 0.36, 0.9, 48, 1, true]} />
        <meshStandardMaterial color="#E2E8F0" side={THREE.DoubleSide} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.05 + 0.08, 0]}>
        <boxGeometry args={[1.5, 0.16, 0.9]} />
        <Plastic color="#E2E8F0" />
      </mesh>
      <group ref={field} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <torusGeometry args={[1.3, 0.008, 6, 64]} />
            <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ChemoRoom({ running }: { running: boolean }) {
  const drop = useRef<THREE.Mesh>(null);
  useFrame((c) => {
    if (!drop.current) return;
    drop.current.visible = running;
    drop.current.position.y = 1.72 - ((c.clock.elapsedTime * 1.4) % 1) * 0.35;
  });
  return (
    <group>
      <group position={[0, 0, -0.7]}>
        <RoundedBox args={[0.7, 0.18, 0.75]} radius={0.06} position={[0, 0.5, 0]} castShadow>
          <Plastic color="#5B7DB1" roughness={0.6} clearcoat={0.2} />
        </RoundedBox>
        <RoundedBox args={[0.7, 0.75, 0.16]} radius={0.06} position={[0, 0.85, -0.32]} rotation={[-0.25, 0, 0]} castShadow>
          <Plastic color="#5B7DB1" roughness={0.6} clearcoat={0.2} />
        </RoundedBox>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.44, 12]} />
          <Metal />
        </mesh>
      </group>
      <group position={[0.75, 0, -0.5]}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 2.0, 8]} />
          <Metal />
        </mesh>
        <RoundedBox args={[0.2, 0.28, 0.06]} radius={0.03} position={[0, 1.88, 0]}>
          <meshPhysicalMaterial color="#FEF9C3" transparent opacity={0.8} roughness={0.2} />
        </RoundedBox>
        <mesh ref={drop} position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#FACC15" />
        </mesh>
      </group>
    </group>
  );
}

/** Stylised, non-graphic patient on a wheeled table. */
function Patient({ at, sliding }: { at: Tech | null; sliding: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = approach(g.position.x, at ? ROOM_X[at] : 0, 4, dt);
    g.position.z = approach(g.position.z, sliding ? -0.75 : 0.75, 3, dt);
  });
  return (
    <group ref={ref} position={[0, 0, 0.75]}>
      <RoundedBox args={[0.62, 0.08, 1.85]} radius={0.03} position={[0, 0.72, 0]} castShadow>
        <Plastic color="#E0F2FE" roughness={0.5} />
      </RoundedBox>
      {[-0.7, 0.7].map((z) => (
        <mesh key={z} position={[0, 0.36, z]}>
          <cylinderGeometry args={[0.03, 0.03, 0.66, 10]} />
          <Metal />
        </mesh>
      ))}
      <mesh position={[0, 0.9, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.85, 10, 20]} />
        <meshStandardMaterial color="#9CC3E8" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.92, -0.68]} castShadow>
        <sphereGeometry args={[0.15, 28, 28]} />
        <meshStandardMaterial color="#E9C4A0" roughness={0.8} />
      </mesh>
    </group>
  );
}

function ScanImage({ tech }: { tech: Tech }) {
  if (tech === "chemo") return <div className="h-36 grid place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 text-center px-3">No image produced in this room.</div>;
  return (
    <svg viewBox="0 0 200 140" className="w-full h-36 rounded-lg bg-black" role="img" aria-label={`${TECH_SPECS[tech].station} output`}>
      {tech === "xray" && (
        <g stroke="#F8FAFC" strokeWidth="3" fill="none" opacity="0.92">
          <ellipse cx="100" cy="20" rx="16" ry="14" />
          <line x1="100" y1="34" x2="100" y2="125" />
          {[48, 60, 72, 84, 96].map((y) => (
            <path key={y} d={`M100 ${y} q -34 4 -40 18 M100 ${y} q 34 4 40 18`} />
          ))}
          <path d="M70 120 q30 14 60 0" />
        </g>
      )}
      {tech === "ultrasound" && (
        <g>
          <path d="M100 8 L30 130 Q100 150 170 130 Z" fill="#1F2937" />
          {Array.from({ length: 140 }, (_, i) => (
            <circle key={i} cx={40 + ((i * 53) % 120)} cy={30 + ((i * 37) % 95)} r="1" fill="#9CA3AF" opacity={0.5} />
          ))}
          <ellipse cx="100" cy="85" rx="28" ry="18" fill="#0B0F14" stroke="#D1D5DB" strokeWidth="1.5" />
        </g>
      )}
      {tech === "mri" && (
        <g>
          <ellipse cx="100" cy="70" rx="80" ry="56" fill="#6B7280" />
          <ellipse cx="100" cy="70" rx="72" ry="49" fill="#9CA3AF" />
          <ellipse cx="72" cy="62" rx="22" ry="16" fill="#D1D5DB" />
          <ellipse cx="128" cy="64" rx="18" ry="20" fill="#E5E7EB" />
          <circle cx="100" cy="108" r="10" fill="#F9FAFB" />
          <circle cx="100" cy="108" r="4" fill="#4B5563" />
          <circle cx="92" cy="84" r="4" fill="#FFFFFF" />
          <circle cx="108" cy="84" r="3.5" fill="#FFFFFF" />
          <path d="M40 92 q60 30 120 0" stroke="#4B5563" strokeWidth="5" fill="none" />
          <text x="6" y="134" fill="#E5E7EB" fontSize="8" fontFamily="monospace">SLICE 14/40</text>
        </g>
      )}
    </svg>
  );
}

export function IgkoQ05Imaging(props: ActivityComponentProps) {
  const play = useInvestigation<ImagingWorld>(props, imagingInitial, evaluateImaging);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [running, setRunning] = useState<Tech | null>(null);
  const [viewing, setViewing] = useState<Tech | null>(world.operated[world.operated.length - 1] ?? null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const moveTo = (t: Tech) => {
    if (!running) play.patch({ station: t });
  };
  const operate = () => {
    const t = world.station;
    if (!t || running) return;
    setRunning(t);
    timer.current = setTimeout(() => {
      setRunning(null);
      setViewing(t);
      play.set((w) => ({ ...w, operated: w.operated.includes(t) ? w.operated : [...w.operated, t] }));
    }, RUN_MS);
  };

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Medical Imaging Centre"
      mission="Take the patient through the rooms, run each procedure and study the readings. Then sign the referral for the test the question describes."
      icon={ScanSearch}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, 3.4, 7.4], fov: 48 }} readOnly={readOnly} badge="Imaging centre · tap a room to move the patient" orbit={{ target: [0, 0.9, 0], minDistance: 4, maxDistance: 14 }}>
          <Studio shadowScale={18} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 20]} />
            <meshStandardMaterial color="#DCE3EA" roughness={0.7} />
          </mesh>
          {TECHS.map((t) => (
            <Room key={t} tech={t} onPick={() => moveTo(t)} disabled={ro || !!running}>
              {t === "xray" && <XRayRoom running={running === t} />}
              {t === "ultrasound" && <UltrasoundRoom running={running === t} />}
              {t === "mri" && <MRIRoom running={running === t} />}
              {t === "chemo" && <ChemoRoom running={running === t} />}
            </Room>
          ))}
          <Patient at={world.station} sliding={running === "mri"} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Patient & procedure">
            <div className="flex flex-wrap gap-1.5">
              {TECHS.map((t) => (
                <Chip key={t} active={world.station === t} disabled={ro || !!running} onClick={() => moveTo(t)}>
                  <MapPin className="inline w-3 h-3 mr-0.5" />
                  {TECH_SPECS[t].station}
                </Chip>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">{world.station ? TECH_SPECS[world.station].howItWorks : "Move the patient into a room."}</p>
            <button
              type="button"
              disabled={ro || !world.station || !!running}
              onClick={operate}
              className="mt-2 w-full h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <PlayIcon className="w-4 h-4" /> {running ? "Running…" : "Run this room's procedure"}
            </button>
          </Panel>
          {viewing && (
            <Panel title={`Output · ${TECH_SPECS[viewing].station}`}>
              <ScanImage tech={viewing} />
            </Panel>
          )}
          <AnswerStation title="Referral form" hint="Sign the referral for the test the question describes.">
            <div className="grid grid-cols-2 gap-1.5">
              {TECHS.map((t) => (
                <Chip key={t} active={world.referral === t} disabled={ro} onClick={() => play.patch({ referral: world.referral === t ? null : t })} tone="violet">
                  <PenLine className="inline w-3 h-3 mr-1" />
                  {TECH_SPECS[t].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>

      <Panel title="Instrument log (rooms you have run)" className="mt-3">
        {world.operated.length === 0 ? (
          <p className="text-xs text-slate-500">Nothing run yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-1.5 pr-2">Room</th>
                  <th className="py-1.5 pr-2">Radiation detector</th>
                  <th className="py-1.5 pr-2">Magnetic field</th>
                  <th className="py-1.5 pr-2">Enters the body?</th>
                  <th className="py-1.5">Shows clearly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {world.operated.map((t) => {
                  const s = TECH_SPECS[t];
                  return (
                    <tr key={t}>
                      <td className="py-1.5 pr-2 font-bold">
                        <button type="button" className="hover:underline" onClick={() => setViewing(t)}>
                          {s.station} — {s.name}
                        </button>
                      </td>
                      <td className="py-1.5 pr-2 font-mono">{s.radiationUSv} µSv</td>
                      <td className="py-1.5 pr-2 font-mono">{s.fieldT} T</td>
                      <td className="py-1.5 pr-2">{s.invasive ? "Yes — drip" : "No"}</td>
                      <td className="py-1.5">{s.producesImage ? STRUCTURES.filter((x) => s.shows.includes(x)).join(", ") || "—" : "No image"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </Investigation>
  );
}

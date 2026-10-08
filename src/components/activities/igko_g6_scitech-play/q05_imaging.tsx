"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { ScanSearch, Play as PlayIcon, MapPin } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, Chip, useInvestigation } from "./kit";
import { STRUCTURES, TECHS, TECH_SPECS, evaluateImaging, imagingInitial, type ImagingWorld, type Tech } from "./logic";

/**
 * Q5 · Medical Imaging Centre.
 * Wheel the patient to each station, operate it and read the instruments: radiation dose,
 * magnetic field, whether anything enters the body, and what the image shows. Then
 * identify the test the question describes. Only a station that has actually been
 * operated can be identified.
 */

const STATION_X: Record<Tech, number> = { xray: -4.5, ultrasound: -1.5, mri: 1.5, chemo: 4.5 };
const STATION_NAME: Record<Tech, string> = {
  xray: "X-ray unit",
  ultrasound: "Ultrasound (sonography) unit",
  mri: "MRI scanner",
  chemo: "Chemotherapy infusion bay",
};
const RUN_MS = 2600;

/* ── Stations ────────────────────────────────────────────────── */

function XRay({ running }: { running: boolean }) {
  const beam = useRef<THREE.Mesh>(null);
  useFrame((c) => {
    if (beam.current) (beam.current.material as THREE.MeshBasicMaterial).opacity = running ? 0.25 + Math.sin(c.clock.elapsedTime * 20) * 0.08 : 0;
  });
  return (
    <group>
      <mesh position={[0, 1.6, -0.7]} castShadow>
        <boxGeometry args={[1.6, 2.6, 0.15]} />
        <meshStandardMaterial color="#E2E8F0" />
      </mesh>
      <mesh position={[0, 2.4, 0.9]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.5} />
      </mesh>
      <mesh ref={beam} position={[0, 1.6, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.7, 1.4, 24, 1, true]} />
        <meshBasicMaterial color="#FDE047" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Ultrasound({ running }: { running: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((c) => {
    if (!ring.current) return;
    const t = (c.clock.elapsedTime * 1.4) % 1;
    ring.current.visible = running;
    ring.current.scale.setScalar(0.2 + t * 1.2);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - t;
  });
  return (
    <group>
      <mesh position={[0.95, 0.75, -0.3]} castShadow>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#CBD5E1" />
      </mesh>
      <mesh position={[0.95, 1.75, -0.3]}>
        <boxGeometry args={[0.7, 0.5, 0.06]} />
        <meshStandardMaterial color="#0F172A" emissive={running ? "#38BDF8" : "#000"} emissiveIntensity={running ? 0.6 : 0} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#F1F5F9" />
      </mesh>
      <mesh ref={ring} position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.015, 8, 48]} />
        <meshBasicMaterial color="#38BDF8" transparent />
      </mesh>
    </group>
  );
}

function MRI({ running }: { running: boolean }) {
  const field = useRef<THREE.Group>(null);
  useFrame((c, dt) => {
    if (!field.current) return;
    field.current.visible = running;
    field.current.children.forEach((ch, i) => {
      const t = (c.clock.elapsedTime * 0.6 + i / 4) % 1;
      ch.scale.setScalar(1 + t * 0.9);
      ((ch as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.7;
    });
    field.current.rotation.x += dt * 0.2;
  });
  return (
    <group position={[0, 1.15, -0.55]}>
      <mesh rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.95, 0.42, 24, 64]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.35} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 0.9, 40, 1, true]} />
        <meshStandardMaterial color="#CBD5E1" side={THREE.DoubleSide} />
      </mesh>
      <group ref={field} visible={false}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <torusGeometry args={[1.45, 0.012, 6, 64]} />
            <meshBasicMaterial color="#A78BFA" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Chemo({ running }: { running: boolean }) {
  const drop = useRef<THREE.Mesh>(null);
  useFrame((c) => {
    if (!drop.current) return;
    drop.current.visible = running;
    drop.current.position.y = 1.95 - ((c.clock.elapsedTime * 1.5) % 1) * 0.5;
  });
  return (
    <group>
      <mesh position={[0.8, 1.2, -0.3]}>
        <cylinderGeometry args={[0.025, 0.025, 2.4, 8]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.7} />
      </mesh>
      <mesh position={[0.8, 2.2, -0.3]}>
        <boxGeometry args={[0.25, 0.35, 0.08]} />
        <meshStandardMaterial color="#FEF3C7" transparent opacity={0.85} />
      </mesh>
      <mesh ref={drop} position={[0.8, 1.95, -0.3]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#FCD34D" />
      </mesh>
    </group>
  );
}

function Station({ tech, running, onPick, disabled }: { tech: Tech; running: boolean; onPick: () => void; disabled: boolean }) {
  return (
    <group position={[STATION_X[tech], 0, 0]}>
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
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
        <planeGeometry args={[2.6, 2.6]} />
        <meshStandardMaterial color="#F1F5F9" />
      </mesh>
      {tech === "xray" && <XRay running={running} />}
      {tech === "ultrasound" && <Ultrasound running={running} />}
      {tech === "mri" && <MRI running={running} />}
      {tech === "chemo" && <Chemo running={running} />}
      <Label3D text={`${TECH_SPECS[tech].station} · ${STATION_NAME[tech]}`} position={[0, 3.2, -0.6]} size={[2.5, 0.3]} billboard style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.45 }} />
    </group>
  );
}

/** Stylised, non-graphic patient on a wheeled table. */
function Patient({ at, running, tech }: { at: Tech | null; running: boolean; tech: Tech | null }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const x = at ? STATION_X[at] : 0;
    g.position.x = approach(g.position.x, x, 4, dt);
    // The MRI table slides into the bore while scanning.
    const z = running && tech === "mri" ? -0.55 : 0.55;
    g.position.z = approach(g.position.z, z, 3, dt);
  });
  return (
    <group ref={ref} position={[0, 0, 0.55]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.7, 0.1, 1.9]} />
        <meshStandardMaterial color="#E0F2FE" />
      </mesh>
      {[-0.7, 0.7].map((z) => (
        <mesh key={z} position={[0, 0.28, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
      ))}
      <mesh position={[0, 0.78, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.9, 8, 16]} />
        <meshStandardMaterial color="#93C5FD" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.8, -0.72]} castShadow>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial color="#FCD9B6" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ── Output images (2D) ──────────────────────────────────────── */

function ScanImage({ tech }: { tech: Tech }) {
  if (tech === "chemo") {
    return <div className="h-36 grid place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 text-center px-3">No image produced. This station delivers a treatment.</div>;
  }
  return (
    <svg viewBox="0 0 200 140" className="w-full h-36 rounded-lg bg-black" role="img" aria-label={`${STATION_NAME[tech]} output`}>
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
          <path d="M60 60 q20 -8 40 0" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
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
          <text x="6" y="134" fill="#E5E7EB" fontSize="8" fontFamily="monospace">AXIAL SLICE 14/40</text>
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
    if (running) return;
    play.patch({ station: t, identified: world.identified });
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
      mission="Take the patient to each station, operate it and read the instruments. Then identify the test the question describes."
      icon={ScanSearch}
      submitLabel="Lock in identified test"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, 4.9, 9.6], fov: 46 }} readOnly={readOnly} badge={null}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 18]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
          {TECHS.map((t) => (
            <Station key={t} tech={t} running={running === t} disabled={ro || !!running} onPick={() => moveTo(t)} />
          ))}
          <Patient at={world.station} running={!!running} tech={running} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Patient & controls">
            <div className="flex flex-wrap gap-1.5">
              {TECHS.map((t) => (
                <Chip key={t} active={world.station === t} disabled={ro || !!running} onClick={() => moveTo(t)}>
                  <MapPin className="inline w-3 h-3 mr-0.5" />
                  {TECH_SPECS[t].station}
                </Chip>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              {world.station ? `Patient at ${STATION_NAME[world.station]}. ${TECH_SPECS[world.station].howItWorks}` : "Move the patient to a station."}
            </p>
            <button
              type="button"
              disabled={ro || !world.station || !!running}
              onClick={operate}
              className="mt-2 w-full h-9 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <PlayIcon className="w-4 h-4" /> {running ? "Operating…" : "Operate this station"}
            </button>
          </Panel>

          {viewing && (
            <Panel title={`Output · ${STATION_NAME[viewing]}`}>
              <ScanImage tech={viewing} />
            </Panel>
          )}
        </div>
      </div>

      <Panel title="Instrument log (stations you have operated)" className="mt-3">
        {world.operated.length === 0 ? (
          <p className="text-xs text-slate-500">Nothing operated yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-1.5 pr-2">Station</th>
                  <th className="py-1.5 pr-2">Radiation detector</th>
                  <th className="py-1.5 pr-2">Magnetic field</th>
                  <th className="py-1.5 pr-2">Enters the body?</th>
                  <th className="py-1.5 pr-2">Shows clearly</th>
                  <th className="py-1.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {world.operated.map((t) => {
                  const s = TECH_SPECS[t];
                  return (
                    <tr key={t} className={world.identified === t ? "bg-teal-50" : ""}>
                      <td className="py-1.5 pr-2 font-bold text-slate-900">
                        <button type="button" className="hover:underline" onClick={() => setViewing(t)}>
                          {STATION_NAME[t]}
                        </button>
                      </td>
                      <td className="py-1.5 pr-2 font-mono">{s.radiationUSv} µSv</td>
                      <td className="py-1.5 pr-2 font-mono">{s.fieldT} T</td>
                      <td className="py-1.5 pr-2">{s.invasive ? "Yes — drip" : "No"}</td>
                      <td className="py-1.5 pr-2">{s.producesImage ? STRUCTURES.filter((x) => s.shows.includes(x)).join(", ") || "—" : "No image"}</td>
                      <td className="py-1.5 text-right">
                        <Chip active={world.identified === t} disabled={ro} onClick={() => play.patch({ identified: t })}>
                          {world.identified === t ? "Identified" : "This is the test described"}
                        </Chip>
                      </td>
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

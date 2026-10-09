"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Sparkles, Radio, Power, UserRound } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, usePlaneDrag, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Slider, Reading, Studio, useInvestigation } from "./kit";
import { Metal, Brushed, Wood, Brass } from "./models";
import {
  SAMPLES,
  SCIENTISTS,
  LASER_NM,
  beamOnSample,
  evaluateRaman,
  ramanInitial,
  spectrum,
  type RamanWorld,
  type Sample,
  type ScientistId,
} from "./logic";

/**
 * Q6 · Light scattering laboratory.
 * Investigate: steer the laser into the sample cell and swing the detector round it to see
 * how light scatters. Answer: hang the effect's name plate under the scientist on the
 * laboratory's wall of portraits that it is named after. Nothing in the lab names him.
 */

const Y = 0.55;
const LASER: [number, number, number] = [-3, Y, -1.6];
const MIRROR: [number, number, number] = [0, Y, -1.6];
const CELL: [number, number, number] = [0, Y, 0.6];
const ARM = 1.7;
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -Y);

function Beam({ from, to, color = "#22C55E", width = 0.025, opacity = 0.9 }: { from: THREE.Vector3; to: THREE.Vector3; color?: string; width?: number; opacity?: number }) {
  const len = from.distanceTo(to);
  const mid = from.clone().add(to).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  return (
    <mesh position={mid} quaternion={q}>
      <cylinderGeometry args={[width, width, len, 10]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

/** Detector position for an angle measured from the beam's forward direction (+z). */
const detectorPos = (deg: number) => {
  const r = (deg * Math.PI) / 180;
  return new THREE.Vector3(CELL[0] + Math.sin(r) * ARM, Y, CELL[2] + Math.cos(r) * ARM);
};

const PORTRAIT_TONE: Record<ScientistId, string> = { chandrasekhar: "#7C5A3A", ramakrishnan: "#4B5563", raman: "#6B4F2A", khorana: "#3F4C5E" };

/** The laboratory's wall of scientists. The name plate hangs under the chosen portrait. */
function PortraitWall({ named }: { named: ScientistId | null }) {
  const ids = Object.keys(SCIENTISTS) as ScientistId[];
  return (
    <group position={[0, 1.9, -3.3]}>
      <mesh position={[0, 0, -0.05]} receiveShadow>
        <boxGeometry args={[7.6, 2.8, 0.1]} />
        <meshStandardMaterial color="#1A2130" roughness={0.9} />
      </mesh>
      {ids.map((id, i) => (
        <group key={id} position={[-2.7 + i * 1.8, 0.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.05, 1.3, 0.06]} />
            <Wood color="#8A5A2B" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.85, 1.1]} />
            <meshStandardMaterial color={PORTRAIT_TONE[id]} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.12, 0.04]}>
            <circleGeometry args={[0.17, 32]} />
            <meshStandardMaterial color="#D9C2A5" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.32, 0.04]}>
            <circleGeometry args={[0.32, 32, 0, Math.PI]} />
            <meshStandardMaterial color="#1F2937" roughness={0.9} />
          </mesh>
          <Label3D text={SCIENTISTS[id].name} position={[0, -0.82, 0.04]} size={[1.6, 0.18]} style={{ bg: "#F8FAFC", fg: "#0F172A", scale: 0.42 }} />
          {named === id && (
            <group position={[0, -1.12, 0.06]}>
              <mesh>
                <boxGeometry args={[1.3, 0.22, 0.03]} />
                <Brass />
              </mesh>
              <Label3D text="The effect is named after him" position={[0, 0, 0.02]} size={[1.25, 0.16]} style={{ bg: null, fg: "#3B2A06", scale: 0.5 }} />
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

function Bench({ world, disabled, onDetector }: { world: RamanWorld; disabled: boolean; onDetector: (deg: number) => void }) {
  const lit = beamOnSample(world);
  const sample = SAMPLES[world.sample];
  const spec = spectrum(world);
  const reflectDeg = 2 * world.mirrorDeg; // reflected direction, measured from +x towards +z
  const reflectDir = new THREE.Vector3(Math.cos((reflectDeg * Math.PI) / 180), 0, Math.sin((reflectDeg * Math.PI) / 180));
  const det = detectorPos(world.detectorDeg);

  const drag = usePlaneDrag({
    plane,
    disabled,
    onDrag: (p) => {
      const deg = Math.round((Math.atan2(p.x - CELL[0], p.z - CELL[2]) * 180) / Math.PI);
      onDetector(Math.max(0, Math.min(180, Math.abs(deg))));
    },
    onEnd: () => cursor(false),
  });

  const glowColor = useMemo(() => new THREE.Color(sample.transparent ? "#4ADE80" : "#111827"), [sample.transparent]);

  return (
    <>
      <Studio shadowScale={14} intensity={0.6} />
      <PortraitWall named={world.namedAfter} />
      {/* Optical table with a hole grid */}
      <mesh position={[0, 0.1, -0.4]} receiveShadow>
        <boxGeometry args={[7.5, 0.2, 5]} />
        <Brushed color="#2B3440" />
      </mesh>
      {Array.from({ length: 13 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => (
          <mesh key={`${i}-${j}`} position={[-3.3 + i * 0.55, 0.205, -2.5 + j * 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.03, 8]} />
            <meshBasicMaterial color="#0B0F17" />
          </mesh>
        ))
      )}

      {/* Laser */}
      <mesh position={LASER} castShadow>
        <boxGeometry args={[1.1, 0.4, 0.4]} />
        <Metal color="#3B4655" roughness={0.35} />
      </mesh>
      <mesh position={[LASER[0] + 0.56, Y, LASER[2]]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 20]} />
        <meshStandardMaterial color={world.laserOn ? "#22C55E" : "#475569"} emissive={world.laserOn ? "#22C55E" : "#000"} emissiveIntensity={1.5} />
      </mesh>
      <Label3D text={`Laser · ${LASER_NM} nm`} position={[LASER[0], Y + 0.45, LASER[2]]} size={[1.3, 0.24]} billboard style={{ bg: "#0F172A", fg: "#BBF7D0", scale: 0.5 }} />

      {/* Steering mirror */}
      {/* Face normal bisects the incoming (+x) and reflected beams. */}
      <group position={MIRROR} rotation={[0, Math.atan2(reflectDir.x - 1, reflectDir.z), 0]}>
        <mesh>
          <boxGeometry args={[0.55, 0.45, 0.04]} />
          <Metal color="#F1F5F9" roughness={0.03} />
        </mesh>
      </group>
      <mesh position={[MIRROR[0], 0.32, MIRROR[2]]}>
        <cylinderGeometry args={[0.05, 0.05, 0.25, 10]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>

      {/* Sample cell */}
      <mesh position={CELL}>
        <boxGeometry args={[0.45, 0.6, 0.45]} />
        <meshPhysicalMaterial
          color={world.sample === "card" ? "#111827" : world.sample === "benzene" ? "#FEF9C3" : "#E0F2FE"}
          transparent
          opacity={world.sample === "card" ? 1 : world.sample === "none" ? 0.12 : 0.45}
          roughness={0.05}
        />
      </mesh>
      <Label3D text={`Cell: ${sample.name}`} position={[CELL[0], Y + 0.55, CELL[2]]} size={[1.3, 0.24]} billboard style={{ bg: "#0F172A", fg: "#E0F2FE", scale: 0.5 }} />
      {lit && sample.transparent && world.sample !== "none" && (
        <mesh position={CELL}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.35} toneMapped={false} />
        </mesh>
      )}

      {/* Beam path */}
      {world.laserOn && <Beam from={new THREE.Vector3(LASER[0] + 0.6, Y, LASER[2])} to={new THREE.Vector3(...MIRROR)} />}
      {world.laserOn &&
        (lit ? (
          sample.transparent ? (
            <Beam from={new THREE.Vector3(...MIRROR)} to={new THREE.Vector3(CELL[0], Y, CELL[2] + 1.9)} />
          ) : (
            <Beam from={new THREE.Vector3(...MIRROR)} to={new THREE.Vector3(CELL[0], Y, CELL[2] - 0.23)} />
          )
        ) : (
          <Beam from={new THREE.Vector3(...MIRROR)} to={new THREE.Vector3(...MIRROR).addScaledVector(reflectDir, 2.6)} />
        ))}
      {/* Scattered light reaching the detector: green plus the faint shifted colour */}
      {spec.lines.length > 0 && world.detectorDeg >= 15 && (
        <>
          <Beam from={new THREE.Vector3(...CELL)} to={det} color="#22C55E" width={0.012} opacity={0.5} />
          {spec.shifted && <Beam from={new THREE.Vector3(...CELL).add(new THREE.Vector3(0, 0.04, 0))} to={det.clone().add(new THREE.Vector3(0, 0.04, 0))} color="#F97316" width={0.01} opacity={0.75} />}
        </>
      )}

      {/* Detector on its arm around the cell */}
      <mesh position={[CELL[0], 0.22, CELL[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ARM - 0.03, ARM + 0.03, 64, 1, -Math.PI / 2, Math.PI]} />
        <meshBasicMaterial color="#475569" side={THREE.DoubleSide} />
      </mesh>
      <group
        position={det}
        rotation={[0, (world.detectorDeg * Math.PI) / 180 + Math.PI, 0]}
        {...drag}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!disabled) cursor(true, "grab");
        }}
        onPointerOut={() => cursor(false)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.4, 0.55]} />
          <meshStandardMaterial color="#7C3AED" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.12, 20]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>
      <Label3D text={`Detector · ${world.detectorDeg}° (drag)`} position={[det.x, Y + 0.5, det.z]} size={[1.5, 0.24]} billboard style={{ bg: "#EDE9FE", fg: "#4C1D95", scale: 0.5 }} />
    </>
  );
}

/** Spectrometer read-out: intensity against wavelength, 500–700 nm. */
function SpectrumChart({ lines, shifted, intensity }: { lines: number[]; shifted: boolean; intensity: number }) {
  const x = (nm: number) => 20 + ((nm - 500) / 200) * 260;
  return (
    <svg viewBox="0 0 300 120" className="w-full rounded-lg bg-slate-950" role="img" aria-label="Spectrum">
      <defs>
        <linearGradient id="vis" x1="0" x2="1">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="0.25" stopColor="#22C55E" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="0.75" stopColor="#F97316" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      <rect x="20" y="104" width="260" height="5" fill="url(#vis)" opacity="0.8" />
      {[500, 550, 600, 650, 700].map((nm) => (
        <text key={nm} x={x(nm)} y="118" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="monospace">
          {nm}
        </text>
      ))}
      {lines.map((nm, i) => {
        const h = i === 0 ? Math.min(90, 20 + intensity * 0.7) : 26;
        return <rect key={nm} x={x(nm) - 2} y={100 - h} width="4" height={h} fill={i === 0 ? "#22C55E" : "#F97316"} />;
      })}
      {shifted && (
        <text x={x(lines[1])} y={100 - 32} fill="#FDBA74" fontSize="7" textAnchor="middle" fontFamily="monospace">
          shifted {lines[1]} nm
        </text>
      )}
      {lines.length === 0 && (
        <text x="150" y="60" fill="#64748B" fontSize="9" textAnchor="middle">
          No light reaching the detector
        </text>
      )}
    </svg>
  );
}

export function IgkoQ06Raman(props: ActivityComponentProps) {
  const play = useInvestigation<RamanWorld>(props, ramanInitial, evaluateRaman);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const live = spectrum(world);
  // Any change to the set-up clears the recorded spectrum.
  const change = (patch: Partial<RamanWorld>) => play.patch({ ...patch, recorded: null });

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Light Scattering Laboratory"
      mission="Shine the laser through samples and study the light scattered sideways. Then name the effect after the scientist on the wall it belongs to."
      icon={Sparkles}
      live={
        <>
          <Reading label="Beam on sample" value={beamOnSample(world) ? "Yes" : "No"} tone={beamOnSample(world) ? "teal" : "slate"} />
          <Reading label="Lines detected" value={live.lines.length ? live.lines.map((l) => `${l} nm`).join(", ") : "none"} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [3.0, 4.4, 6.0], fov: 46 }} background="#0B1020" readOnly={readOnly} badge="Optical bench · drag the detector" orbit={{ target: [0, 0.8, -0.8], minDistance: 3, maxDistance: 11 }}>
          <Bench world={world} disabled={ro} onDetector={(d) => change({ detectorDeg: d })} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Optics">
            <Chip active={world.laserOn} disabled={ro} onClick={() => change({ laserOn: !world.laserOn })}>
              <Power className="inline w-3 h-3 mr-1" />
              Laser {world.laserOn ? "on" : "off"}
            </Chip>
            <div className="mt-2 space-y-2">
              <Slider label="Mirror angle" value={world.mirrorDeg} min={0} max={90} unit="°" disabled={ro} onChange={(v) => change({ mirrorDeg: v })} />
              <Slider label="Detector angle from beam" value={world.detectorDeg} min={0} max={180} unit="°" disabled={ro} onChange={(v) => change({ detectorDeg: v })} />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(Object.keys(SAMPLES) as Sample[]).map((s) => (
                <Chip key={s} active={world.sample === s} disabled={ro} onClick={() => change({ sample: s })}>
                  {SAMPLES[s].name}
                </Chip>
              ))}
            </div>
          </Panel>
          <Panel title="Spectrometer">
            <SpectrumChart {...(world.recorded ?? live)} />
            <button
              type="button"
              disabled={ro}
              onClick={() => play.patch({ recorded: spectrum(world) })}
              className="mt-2 w-full h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Radio className="w-4 h-4" /> Record spectrum
            </button>
            <p className="mt-2 text-xs text-slate-600">
              {world.recorded
                ? world.recorded.shifted
                  ? "Recorded: besides the laser's own green line, a faint new line of a different colour appears."
                  : "Recorded: only the laser's own colour, or no light at all."
                : "No spectrum recorded since the last change."}
            </p>
          </Panel>
          <AnswerStation title="Name the effect" hint="Hang the effect's name plate under the scientist it is named after.">
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(SCIENTISTS) as ScientistId[]).map((id) => (
                <Chip key={id} active={world.namedAfter === id} disabled={ro} onClick={() => play.patch({ namedAfter: world.namedAfter === id ? null : id })} tone="violet">
                  <UserRound className="inline w-3 h-3 mr-1" />
                  {SCIENTISTS[id].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

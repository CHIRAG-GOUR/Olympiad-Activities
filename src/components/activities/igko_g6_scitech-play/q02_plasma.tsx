"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Atom, Flame, Snowflake, ScanLine } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Investigation, Lab3D, Panel, Slider, Reading, useInvestigation } from "./kit";
import {
  MATTER_STATES,
  evaluatePlasma,
  ionisationAt,
  plasmaInitial,
  setEnergy,
  stateAtEnergy,
  type PlasmaWorld,
} from "./logic";

/**
 * Q2 · Plasma Reactor.
 * Pump energy into a sealed chamber and watch the particles: a vibrating lattice, a
 * sliding liquid, a free gas — and, with enough energy, an ionised glowing plasma. The
 * chamber analyser measures which state the chamber is in; that measurement is the answer.
 */

const N = 120;
const R = 1.25; // chamber radius
const H = 2.6; // chamber height
const TRACERS = 3;
const TRAIL = 40;

const STATE_COLOR: Record<string, string> = {
  Solid: "#60A5FA",
  Liquid: "#22D3EE",
  Gas: "#A78BFA",
  Plasma: "#F472B6",
};

function lattice(i: number): THREE.Vector3 {
  // 5×5 grid layers stacked from the floor.
  const layer = Math.floor(i / 25);
  const k = i % 25;
  const x = (k % 5) - 2;
  const z = Math.floor(k / 5) - 2;
  return new THREE.Vector3(x * 0.32, -H / 2 + 0.2 + layer * 0.32, z * 0.32);
}

function Chamber({ energy }: { energy: number }) {
  const state = stateAtEnergy(energy);
  const ion = ionisationAt(energy);
  const ions = useRef<THREE.InstancedMesh>(null);
  const electrons = useRef<THREE.InstancedMesh>(null);
  const glass = useRef<THREE.MeshPhysicalMaterial>(null);
  const glow = useRef<THREE.PointLight>(null);
  const energyRef = useRef(energy);
  energyRef.current = energy;

  const sim = useMemo(() => {
    const pos = Array.from({ length: N }, (_, i) => lattice(i));
    const vel = Array.from({ length: N }, () => new THREE.Vector3((Math.random() - 0.5) * 0.2, 0, (Math.random() - 0.5) * 0.2));
    const ePhase = Array.from({ length: N }, () => Math.random() * Math.PI * 2);
    const trails = Array.from({ length: TRACERS }, () => Array.from({ length: TRAIL }, () => new THREE.Vector3()));
    return { pos, vel, ePhase, trails };
  }, []);

  const trailGeoms = useMemo(
    () => Array.from({ length: TRACERS }, () => new THREE.BufferGeometry().setFromPoints(Array.from({ length: TRAIL }, () => new THREE.Vector3()))),
    []
  );
  const trailMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#FDE047", transparent: true, opacity: 0.8 }), []);
  const trailLines = useMemo(() => trailGeoms.map((g) => new THREE.Line(g, trailMat)), [trailGeoms, trailMat]);
  useEffect(
    () => () => {
      trailGeoms.forEach((g) => g.dispose());
      trailMat.dispose();
    },
    [trailGeoms, trailMat]
  );

  // Per-particle colours need their buffer before the first frame draws.
  useEffect(() => {
    const m = ions.current;
    if (!m) return;
    for (let i = 0; i < N; i++) m.setColorAt(i, new THREE.Color(STATE_COLOR.Solid));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    (m.material as THREE.Material).needsUpdate = true;
  }, []);

  const tmp = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((clock, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const e = energyRef.current;
    const s = stateAtEnergy(e);
    const speed = 0.15 + (e / 100) * 3.2;
    const ionised = ionisationAt(e);
    const t = clock.clock.elapsedTime;

    for (let i = 0; i < N; i++) {
      const p = sim.pos[i];
      const v = sim.vel[i];
      if (s === "Solid") {
        // Bound to its lattice site; vibration grows with energy.
        const home = lattice(i);
        const amp = 0.015 + (e / 22) * 0.06;
        p.set(home.x + Math.sin(t * 9 + i) * amp, home.y + Math.cos(t * 11 + i * 1.7) * amp, home.z + Math.sin(t * 7 + i * 2.3) * amp);
        v.set(0, 0, 0);
        continue;
      }
      // Free particles: random kicks scaled to temperature.
      v.x += (Math.random() - 0.5) * speed * dt * 6;
      v.y += (Math.random() - 0.5) * speed * dt * 6;
      v.z += (Math.random() - 0.5) * speed * dt * 6;
      if (s === "Liquid") v.y -= 2.2 * dt; // stays pooled at the bottom
      const vmax = s === "Liquid" ? speed * 0.45 : speed;
      if (v.length() > vmax) v.setLength(vmax);
      p.addScaledVector(v, dt);
      // Walls
      const ceiling = s === "Liquid" ? -H / 2 + 0.95 : H / 2 - 0.08;
      if (p.y < -H / 2 + 0.08) {
        p.y = -H / 2 + 0.08;
        v.y = Math.abs(v.y);
      }
      if (p.y > ceiling) {
        p.y = ceiling;
        v.y = -Math.abs(v.y) * 0.6;
      }
      const rr = Math.hypot(p.x, p.z);
      if (rr > R - 0.1) {
        const nx = p.x / rr;
        const nz = p.z / rr;
        p.x = nx * (R - 0.1);
        p.z = nz * (R - 0.1);
        const dot = v.x * nx + v.z * nz;
        v.x -= 2 * dot * nx;
        v.z -= 2 * dot * nz;
      }
    }

    const ionCol = color.set(STATE_COLOR[s]);
    if (ions.current) {
      for (let i = 0; i < N; i++) {
        tmp.position.copy(sim.pos[i]);
        tmp.scale.setScalar(s === "Plasma" ? 1.15 : 1);
        tmp.updateMatrix();
        ions.current.setMatrixAt(i, tmp.matrix);
        ions.current.setColorAt(i, i < ionised * N ? color.set("#FB923C") : ionCol);
      }
      ions.current.instanceMatrix.needsUpdate = true;
      if (ions.current.instanceColor) ions.current.instanceColor.needsUpdate = true;
    }
    if (electrons.current) {
      for (let i = 0; i < N; i++) {
        const stripped = i < ionised * N;
        if (stripped) {
          // A freed electron races around near its ion.
          sim.ePhase[i] += dt * (8 + (i % 5));
          const a = sim.ePhase[i];
          tmp.position.set(sim.pos[i].x + Math.cos(a) * 0.22, sim.pos[i].y + Math.sin(a * 1.3) * 0.22, sim.pos[i].z + Math.sin(a) * 0.22);
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

    // Tracer trails: the paths of three particles over the last moments.
    for (let k = 0; k < TRACERS; k++) {
      const trail = sim.trails[k];
      trail.pop();
      trail.unshift(sim.pos[k * 37].clone());
      trailGeoms[k].setFromPoints(trail);
    }

    trailMat.color.set(s === "Solid" ? "#93C5FD" : "#FDE047");
    trailMat.opacity = s === "Solid" ? 0.25 : 0.8;
    if (glass.current) {
      glass.current.emissiveIntensity = THREE.MathUtils.lerp(glass.current.emissiveIntensity, ionised * 0.9, 0.08);
    }
    if (glow.current) glow.current.intensity = THREE.MathUtils.lerp(glow.current.intensity, ionised * 14, 0.08);
  });

  return (
    <group position={[0, H / 2 + 0.3, 0]}>
      <instancedMesh ref={ions} args={[undefined, undefined, N]} castShadow>
        <sphereGeometry args={[0.075, 14, 14]} />
        <meshStandardMaterial roughness={0.3} metalness={0.1} emissive="#FB7185" emissiveIntensity={ion * 0.6} />
      </instancedMesh>
      <instancedMesh ref={electrons} args={[undefined, undefined, N]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshBasicMaterial color="#67E8F9" toneMapped={false} />
      </instancedMesh>
      {trailLines.map((line, k) => (
        <primitive key={k} object={line} />
      ))}
      {/* Glass chamber */}
      <mesh>
        <cylinderGeometry args={[R, R, H, 48, 1, true]} />
        <meshPhysicalMaterial
          ref={glass}
          color="#E0F2FE"
          transparent
          opacity={0.18}
          roughness={0.05}
          transmission={0.6}
          emissive="#F472B6"
          emissiveIntensity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[-H / 2, H / 2].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[R + 0.08, R + 0.08, 0.14, 48]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Electrodes / heater coil */}
      <mesh position={[0, -H / 2 - 0.25, 0]}>
        <torusGeometry args={[0.8, 0.07, 12, 40]} />
        <meshStandardMaterial color="#F97316" emissive="#EA580C" emissiveIntensity={energy / 120} />
      </mesh>
      <pointLight ref={glow} position={[0, 0, 0]} color="#F472B6" intensity={0} distance={6} />
    </group>
  );
}

export function IgkoQ02Plasma(props: ActivityComponentProps) {
  const play = useInvestigation<PlasmaWorld>(props, plasmaInitial, evaluatePlasma);
  const { world, readOnly } = play;
  const state = stateAtEnergy(world.energy);
  const tempK = Math.round(150 + world.energy * world.energy * 1.1);
  const analysed = world.analysedAt !== null ? stateAtEnergy(world.analysedAt) : null;

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Plasma Reactor"
      mission="Raise the energy in the chamber, watch how the particles behave, and use the analyser to measure the state you produce."
      icon={Atom}
      live={
        <>
          <Reading label="Energy" value={`${world.energy}%`} tone="amber" />
          <Reading label="Temperature" value={`${tempK.toLocaleString()} K`} />
          <Reading label="Particles ionised" value={`${Math.round(ionisationAt(world.energy) * 100)}%`} tone={ionisationAt(world.energy) > 0 ? "rose" : "slate"} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Lab3D camera={{ position: [3.6, 3.4, 4.2], fov: 40 }} background="#0B1220" readOnly={readOnly}>
          <Chamber energy={world.energy} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[4, 48]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Energy control">
            <Slider
              label="Energy supplied"
              value={world.energy}
              min={0}
              max={100}
              unit="%"
              disabled={!!readOnly}
              onChange={(v) => play.set((w) => setEnergy(w, v))}
            />
            <div className="mt-2 flex gap-1.5">
              <button
                type="button"
                disabled={!!readOnly}
                onClick={() => play.set((w) => setEnergy(w, w.energy - 5))}
                className="flex-1 h-8 rounded-lg border border-sky-200 bg-sky-50 text-sky-800 text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Snowflake className="w-3.5 h-3.5" /> Cool
              </button>
              <button
                type="button"
                disabled={!!readOnly}
                onClick={() => play.set((w) => setEnergy(w, w.energy + 5))}
                className="flex-1 h-8 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Flame className="w-3.5 h-3.5" /> Heat
              </button>
            </div>
          </Panel>

          <Panel title="States observed, in order">
            <ol className="space-y-1">
              {MATTER_STATES.map((s, i) => {
                const seen = world.reached.includes(s);
                return (
                  <li key={s} className={`flex items-center gap-2 text-xs font-bold ${seen ? "text-slate-900" : "text-slate-300"}`}>
                    <span className="w-5 h-5 rounded-full grid place-items-center text-[10px] text-white" style={{ background: seen ? STATE_COLOR[s] : "#E2E8F0" }}>
                      {i + 1}
                    </span>
                    {seen ? s : "not reached yet"}
                    {seen && s === state && <span className="ml-auto text-[10px] text-teal-700">in chamber now</span>}
                  </li>
                );
              })}
            </ol>
          </Panel>

          <Panel title="Chamber analyser">
            <button
              type="button"
              disabled={!!readOnly}
              onClick={() => play.patch({ analysedAt: world.energy })}
              className="w-full h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <ScanLine className="w-4 h-4" /> Analyse the chamber now
            </button>
            <p className="mt-2 text-xs text-slate-600">
              {analysed
                ? `Measured: ${analysed} — ${Math.round(ionisationAt(world.analysedAt!) * 100)}% of particles ionised.`
                : "Not analysed since the last change."}
            </p>
          </Panel>
        </div>
      </div>
    </Investigation>
  );
}

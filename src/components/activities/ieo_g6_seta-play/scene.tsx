"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════════════
   Scene cue — lets every model in a World3D react when the student changes
   their choice. The reaction is the same whatever was chosen, so it never
   hints at which option is right.
   ══════════════════════════════════════════════════════════════════════ */

export const REACTION_SECONDS = 0.9;

type CueClock = { at: number };
const CueContext = createContext<CueClock>({ at: -100 });

/** Seconds since the last cue as a 0→1 progress, or null when no reaction is playing. */
export function useCueProgress() {
  const cue = useContext(CueContext);
  return (elapsed: number) => {
    const p = (elapsed - cue.at) / REACTION_SECONDS;
    return p >= 0 && p <= 1 ? p : null;
  };
}

/** Stable per-model phase, so a crowd of avatars does not move in lockstep. */
export function phaseOf(position: readonly number[] = [0, 0, 0]) {
  return ((position[0] * 12.9898 + position[2] * 78.233) % 6.283) + 6.283;
}

function CueStamp({ n, clock }: { n: number; clock: CueClock }) {
  const three = useThree();
  useEffect(() => {
    if (n > 0) clock.at = three.clock.getElapsedTime();
  }, [n, clock, three.clock]);
  return null;
}

/** Scales the whole scene in a short, soft pop on every cue. */
function CuePop({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const progress = useCueProgress();
  useFrame(({ clock }) => {
    if (!g.current) return;
    const p = progress(clock.getElapsedTime());
    const s = p === null ? 1 : 1 + 0.035 * Math.sin(Math.PI * p);
    g.current.scale.setScalar(s);
  });
  return <group ref={g}>{children}</group>;
}

/**
 * Everything a World3D adds around the scene: sky and fog (so the edge of a scene's
 * floor fades out instead of ending in a hard slab), a soft ground, the cue clock and
 * a sparkle burst on each change.
 */
export function StageFX({
  n,
  burst,
  sky,
  ground,
  camDistance,
  children,
}: {
  n: number;
  burst: boolean;
  sky: string;
  ground: string;
  camDistance: number;
  children: React.ReactNode;
}) {
  const clock = useRef<CueClock>({ at: -100 }).current;
  return (
    <CueContext.Provider value={clock}>
      <CueStamp n={n} clock={clock} />
      <fog attach="fog" args={[sky, camDistance * 1.15, camDistance * 2.9]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <circleGeometry args={[60, 48]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>
      <CuePop>{children}</CuePop>
      {burst && <Sparkles key={n} count={42} scale={[3.2, 2.2, 3.2]} size={5} speed={0.9} color="#FBBF24" position={[0, 1.3, 0.3]} />}
    </CueContext.Provider>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Small animated building blocks shared by several scenes.
   ══════════════════════════════════════════════════════════════════════ */

/** Rising, fading puffs — steam from a pot or a cup. */
export function Steam({ position = [0, 0, 0], count = 4, color = "#ffffff" }: { position?: [number, number, number]; count?: number; color?: string }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      const p = (t * 0.45 + i / count) % 1;
      m.position.set(Math.sin((p + i) * 5) * 0.06, p * 0.7, 0);
      m.scale.setScalar(0.05 + p * 0.1);
      (m.material as THREE.MeshStandardMaterial).opacity = 0.55 * (1 - p);
    });
  });
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** A slowly drifting puffy cloud. */
export function Cloud3D({ position = [0, 4, -6], scale = 1, speed = 0.25, span = 6 }: { position?: [number, number, number]; scale?: number; speed?: number; span?: number }) {
  const g = useRef<THREE.Group>(null);
  const phase = phaseOf(position);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * speed * 0.3 + phase) * span * 0.5;
  });
  return (
    <group ref={g} position={position} scale={scale}>
      {[[0, 0, 0, 0.6], [0.55, -0.08, 0.05, 0.45], [-0.55, -0.1, 0, 0.42], [0.2, 0.25, -0.05, 0.4]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** Bobs its children up and down (and optionally spins them). */
export function Bob({ children, amp = 0.08, speed = 1.6, spin = 0, position = [0, 0, 0] }: { children: React.ReactNode; amp?: number; speed?: number; spin?: number; position?: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  const phase = phaseOf(position);
  useFrame(({ clock }, dt) => {
    if (!g.current) return;
    g.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed + phase) * amp;
    g.current.rotation.y += spin * dt;
  });
  return (
    <group ref={g} position={position}>
      {children}
    </group>
  );
}

/** Rotates its children steadily about one axis — wheels, fans, clock hands. */
export function Spin({ children, speed = 1, axis = "y", position = [0, 0, 0], rotation = [0, 0, 0] }: { children: React.ReactNode; speed?: number; axis?: "x" | "y" | "z"; position?: [number, number, number]; rotation?: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation[axis] += speed * dt;
  });
  return (
    <group position={position} rotation={rotation}>
      <group ref={g}>{children}</group>
    </group>
  );
}

/** Moves its children back and forth along x (or loops them across when `loop`). */
export function Drift({ children, from, to, speed = 0.2, loop = false, position = [0, 0, 0] }: { children: React.ReactNode; from: number; to: number; speed?: number; loop?: boolean; position?: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  const phase = phaseOf(position);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.getElapsedTime() * speed + phase;
    const p = loop ? t % 1 : (Math.sin(t * Math.PI * 2) + 1) / 2;
    g.current.position.x = from + (to - from) * p;
    if (!loop) g.current.rotation.y = Math.cos(t * Math.PI * 2) >= 0 ? 0 : Math.PI;
  });
  return (
    <group position={position}>
      <group ref={g}>{children}</group>
    </group>
  );
}

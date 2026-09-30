"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { phaseOf } from "./scene";
import { planks, wallpaper } from "./textures";

/* ══════════════════════════════════════════════════════════════════════
   Reusable props for the English paper's scenes. Each is a small, solid,
   light-toned model; the living ones (trees, water, flags, animals) move.
   ══════════════════════════════════════════════════════════════════════ */

type V3 = [number, number, number];

export function Mat({ c, r = 0.7, m = 0, e, o }: { c: string; r?: number; m?: number; e?: string; o?: number }) {
  return (
    <meshStandardMaterial
      color={c}
      roughness={r}
      metalness={m}
      emissive={e ?? "#000000"}
      emissiveIntensity={e ? 0.6 : 0}
      transparent={o !== undefined}
      opacity={o ?? 1}
    />
  );
}

export function Box({ p = [0, 0, 0], s, c, r, rot }: { p?: V3; s: V3; c: string; r?: number; rot?: V3 }) {
  return (
    <mesh position={p} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={s} />
      <Mat c={c} r={r} />
    </mesh>
  );
}

export function Cyl({ p = [0, 0, 0], r1, r2, h, c, seg = 20, rot, rough }: { p?: V3; r1: number; r2?: number; h: number; c: string; seg?: number; rot?: V3; rough?: number }) {
  return (
    <mesh position={p} rotation={rot} castShadow receiveShadow>
      <cylinderGeometry args={[r1, r2 ?? r1, h, seg]} />
      <Mat c={c} r={rough} />
    </mesh>
  );
}

export function Ball({ p = [0, 0, 0], r, c, s }: { p?: V3; r: number; c: string; s?: V3 }) {
  return (
    <mesh position={p} scale={s} castShadow>
      <sphereGeometry args={[r, 20, 16]} />
      <Mat c={c} />
    </mesh>
  );
}

/** A leafy tree whose crown sways in the breeze. */
export function Tree({ p = [0, 0, 0], h = 1.6, crown = "#4CAF50", trunk = "#8B5A2B", scale = 1 }: { p?: V3; h?: number; crown?: string; trunk?: string; scale?: number }) {
  const g = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = 0.04 * Math.sin(clock.getElapsedTime() * 1.2 + ph);
  });
  return (
    <group position={p} scale={scale}>
      <Cyl p={[0, h / 2, 0]} r1={0.08} r2={0.12} h={h} c={trunk} seg={10} />
      <group ref={g} position={[0, h, 0]}>
        <Ball p={[0, 0.25, 0]} r={0.55} c={crown} />
        <Ball p={[0.35, 0.05, 0.1]} r={0.38} c={crown} />
        <Ball p={[-0.32, 0.08, -0.05]} r={0.4} c={crown} />
      </group>
    </group>
  );
}

/** A slim birch — the tree beavers fell. */
export function Birch({ p = [0, 0, 0], h = 2 }: { p?: V3; h?: number }) {
  return (
    <group position={p}>
      <Cyl p={[0, h / 2, 0]} r1={0.06} r2={0.08} h={h} c="#F1F5F9" seg={10} />
      {[0.4, 0.8, 1.2, 1.5].map((y) => (
        <Box key={y} p={[0, y, 0.06]} s={[0.08, 0.025, 0.02]} c="#334155" />
      ))}
      <Ball p={[0, h + 0.1, 0]} r={0.42} c="#A3D977" s={[1, 1.3, 1]} />
    </group>
  );
}

export function PalmTree({ p = [0, 0, 0], h = 2.2 }: { p?: V3; h?: number }) {
  const g = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = 0.15 * Math.sin(clock.getElapsedTime() * 0.8 + ph);
  });
  return (
    <group position={p}>
      <Cyl p={[0.1, h / 2, 0]} r1={0.07} r2={0.11} h={h} c="#A0784A" seg={10} rot={[0, 0, -0.06]} />
      <group ref={g} position={[0.18, h, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0.9]} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.9, 0.02]} />
            <Mat c="#3FA34D" />
          </mesh>
        ))}
        <Ball p={[0, -0.08, 0]} r={0.1} c="#7C4A1E" />
      </group>
    </group>
  );
}

export function Bush({ p = [0, 0, 0], c = "#5DBB63", s = 1 }: { p?: V3; c?: string; s?: number }) {
  return (
    <group position={p} scale={s}>
      <Ball p={[0, 0.2, 0]} r={0.28} c={c} />
      <Ball p={[0.25, 0.14, 0.05]} r={0.2} c={c} />
      <Ball p={[-0.24, 0.14, 0]} r={0.2} c={c} />
    </group>
  );
}

export function Flower({ p = [0, 0, 0], c = "#F472B6" }: { p?: V3; c?: string }) {
  const g = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = 0.12 * Math.sin(clock.getElapsedTime() * 2 + ph);
  });
  return (
    <group ref={g} position={p}>
      <Cyl p={[0, 0.12, 0]} r1={0.01} h={0.24} c="#3F9142" seg={6} />
      <Ball p={[0, 0.26, 0]} r={0.05} c={c} />
      <Ball p={[0, 0.26, 0.03]} r={0.022} c="#FDE047" />
    </group>
  );
}

export function Bench({ p = [0, 0, 0], rot = [0, 0, 0], w = 1.4, c = "#B7793F" }: { p?: V3; rot?: V3; w?: number; c?: string }) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0.47, 0]} s={[w, 0.06, 0.42]} c={c} />
      <Box p={[0, 0.82, -0.2]} s={[w, 0.28, 0.05]} c={c} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box p={[s * (w / 2 - 0.1), 0.22, 0]} s={[0.06, 0.46, 0.38]} c="#475569" />
          <Box p={[s * (w / 2 - 0.1), 0.62, -0.2]} s={[0.05, 0.36, 0.05]} c="#475569" />
        </group>
      ))}
    </group>
  );
}

export function Table({ p = [0, 0, 0], w = 1.4, d = 0.8, h = 0.72, top = "#C58B4E", leg = "#8B5A2B", round = false }: { p?: V3; w?: number; d?: number; h?: number; top?: string; leg?: string; round?: boolean }) {
  return (
    <group position={p}>
      {round ? <Cyl p={[0, h, 0]} r1={w / 2} h={0.05} c={top} seg={32} /> : <Box p={[0, h, 0]} s={[w, 0.05, d]} c={top} />}
      {round ? (
        <Cyl p={[0, h / 2, 0]} r1={0.05} h={h} c={leg} seg={10} />
      ) : (
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <Cyl key={i} p={[x * (w / 2 - 0.07), h / 2, z * (d / 2 - 0.07)]} r1={0.03} h={h} c={leg} seg={8} />)
      )}
    </group>
  );
}

export function Stool({ p = [0, 0, 0], c = "#F59E0B" }: { p?: V3; c?: string }) {
  return (
    <group position={p}>
      <Cyl p={[0, 0.47, 0]} r1={0.2} h={0.06} c={c} />
      <Cyl p={[0, 0.23, 0]} r1={0.04} h={0.46} c="#64748B" seg={8} />
      <Cyl p={[0, 0.02, 0]} r1={0.16} h={0.03} c="#64748B" />
    </group>
  );
}

export function Rock({ p = [0, 0, 0], s = 1, c = "#A8A29E" }: { p?: V3; s?: number; c?: string }) {
  return (
    <mesh position={p} scale={[s * 1.2, s * 0.75, s]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.35, 0]} />
      <Mat c={c} r={0.95} />
    </mesh>
  );
}

export function Mountain({ p = [0, 0, -9], h = 4, r = 3, c = "#94A3B8", snow = true }: { p?: V3; h?: number; r?: number; c?: string; snow?: boolean }) {
  return (
    <group position={p}>
      <mesh position={[0, h / 2, 0]} castShadow>
        <coneGeometry args={[r, h, 6]} />
        <Mat c={c} r={0.95} />
      </mesh>
      {snow && (
        <mesh position={[0, h * 0.82, 0]}>
          <coneGeometry args={[r * 0.36, h * 0.36, 6]} />
          <Mat c="#FFFFFF" r={0.9} />
        </mesh>
      )}
    </group>
  );
}

/** A simple house: walls, pitched roof, door and windows. */
export function House({ p = [0, 0, 0], rot = [0, 0, 0], w = 2.4, h = 1.6, d = 1.8, wall = "#FDF6E3", roof = "#E4572E", door = "#8B5A2B" }: { p?: V3; rot?: V3; w?: number; h?: number; d?: number; wall?: string; roof?: string; door?: string }) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, h / 2, 0]} s={[w, h, d]} c={wall} />
      <mesh position={[0, h + 0.35, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.78, 0.8, 4]} />
        <Mat c={roof} />
      </mesh>
      <Box p={[0, 0.42, d / 2 + 0.01]} s={[0.42, 0.84, 0.03]} c={door} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * w * 0.3, h * 0.6, d / 2 + 0.01]}>
          <Box s={[0.42, 0.36, 0.03]} c="#FFFFFF" />
          <Box p={[0, 0, 0.01]} s={[0.36, 0.3, 0.02]} c="#9BD3F2" />
        </group>
      ))}
    </group>
  );
}

/** A flag on a pole, fluttering. */
export function Flag({ p = [0, 0, 0], c = "#EF4444", h = 1.6 }: { p?: V3; c?: string; h?: number }) {
  const f = useRef<THREE.Mesh>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    if (f.current) {
      const t = clock.getElapsedTime();
      f.current.rotation.y = 0.35 * Math.sin(t * 3 + ph);
      f.current.scale.x = 1 + 0.08 * Math.sin(t * 5 + ph);
    }
  });
  return (
    <group position={p}>
      <Cyl p={[0, h / 2, 0]} r1={0.02} h={h} c="#CBD5E1" seg={8} />
      <mesh ref={f} position={[0.22, h - 0.15, 0]} castShadow>
        <boxGeometry args={[0.44, 0.28, 0.01]} />
        <Mat c={c} />
      </mesh>
    </group>
  );
}

/** A string of triangular party flags between two points at the same height. */
export function Bunting({ from, to, colors = ["#F43F5E", "#FBBF24", "#22C55E", "#3B82F6", "#A855F7"] }: { from: V3; to: V3; colors?: string[] }) {
  const n = 9;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const k = (i + 0.5) / n;
        const x = from[0] + (to[0] - from[0]) * k;
        const z = from[2] + (to[2] - from[2]) * k;
        const y = from[1] - Math.sin(k * Math.PI) * 0.25;
        return (
          <mesh key={i} position={[x, y - 0.1, z]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.09, 0.2, 3]} />
            <Mat c={colors[i % colors.length]} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Balloon({ p = [0, 1.6, 0], c = "#F43F5E" }: { p?: V3; c?: string }) {
  const g = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.getElapsedTime();
    g.current.position.y = p[1] + 0.08 * Math.sin(t * 1.3 + ph);
    g.current.rotation.z = 0.1 * Math.sin(t + ph);
  });
  return (
    <group ref={g} position={p}>
      <Ball r={0.18} c={c} s={[1, 1.2, 1]} />
      <Cyl p={[0, -0.5, 0]} r1={0.004} h={0.6} c="#94A3B8" seg={4} />
    </group>
  );
}

/** Water that gently shimmers (a rippling surface colour and height). */
export function Water({ p = [0, 0.01, 0], w = 4, d = 2, c = "#4FC3F7", round = false }: { p?: V3; w?: number; d?: number; c?: string; round?: boolean }) {
  const m = useRef<THREE.Mesh>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    if (!m.current) return;
    const t = clock.getElapsedTime();
    m.current.position.y = p[1] + 0.012 * Math.sin(t * 1.5 + ph);
    (m.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.12 + 0.08 * Math.sin(t * 2 + ph);
  });
  return (
    <mesh ref={m} position={p} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      {round ? <circleGeometry args={[w / 2, 40]} /> : <planeGeometry args={[w, d]} />}
      <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15} roughness={0.15} metalness={0.1} transparent opacity={0.9} />
    </mesh>
  );
}

/** Stripes of foam sliding along a river, so the water visibly flows. */
export function RiverFlow({ p = [0, 0.02, 0], w = 1.6, len = 12, dir = 1 }: { p?: V3; w?: number; len?: number; dir?: 1 | -1 }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = ((t * 0.12 * dir + i / 8) % 1 + 1) % 1;
      m.position.z = -len / 2 + k * len;
      m.position.x = Math.sin(i * 2.3) * w * 0.3;
    });
  });
  return (
    <group position={p}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.35, 0.05]} />
          <meshBasicMaterial color="#E0F7FF" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** A beaver: round brown body, flat paddle tail and the big orange front teeth. */
export function Beaver({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }: { p?: V3; rot?: V3; s?: number }) {
  const tail = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (tail.current) tail.current.rotation.x = -0.2 + 0.25 * Math.sin(t * 2.4 + ph);
    if (head.current) head.current.rotation.x = 0.12 * Math.sin(t * 3.5 + ph);
  });
  return (
    <group position={p} rotation={rot} scale={s}>
      <Ball p={[0, 0.28, 0]} r={0.3} c="#8B5A2B" s={[1, 0.85, 1.25]} />
      <group ref={head} position={[0, 0.38, 0.34]}>
        <Ball r={0.19} c="#8B5A2B" />
        <Ball p={[0, -0.03, 0.15]} r={0.09} c="#A87445" />
        <Ball p={[0, 0.02, 0.23]} r={0.03} c="#1F2937" />
        {[-1, 1].map((k) => (
          <group key={k}>
            <Ball p={[0.08 * k, 0.07, 0.15]} r={0.028} c="#1F2937" />
            <Ball p={[0.14 * k, 0.15, -0.02]} r={0.05} c="#6B4423" />
          </group>
        ))}
        {/* the famous front teeth */}
        <Box p={[-0.022, -0.1, 0.19]} s={[0.04, 0.07, 0.015]} c="#F59E0B" />
        <Box p={[0.022, -0.1, 0.19]} s={[0.04, 0.07, 0.015]} c="#F59E0B" />
      </group>
      <group ref={tail} position={[0, 0.12, -0.34]}>
        <mesh position={[0, 0, -0.22]} castShadow>
          <boxGeometry args={[0.24, 0.05, 0.42]} />
          <Mat c="#4B3621" r={0.9} />
        </mesh>
      </group>
      {[[-0.18, 0.2], [0.18, 0.2], [-0.18, -0.15], [0.18, -0.15]].map(([x, z], i) => (
        <Ball key={i} p={[x, 0.06, z]} r={0.07} c="#6B4423" />
      ))}
    </group>
  );
}

/** A fish that swims a loop around a point. */
export function Fish({ center = [0, 0.8, 0], radius = 1.2, speed = 0.6, c = "#FB923C" }: { center?: V3; radius?: number; speed?: number; c?: string }) {
  const g = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const ph = phaseOf(center) + radius;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + ph;
    if (g.current) {
      g.current.position.set(center[0] + Math.cos(t) * radius, center[1] + 0.15 * Math.sin(t * 2.3), center[2] + Math.sin(t) * radius * 0.6);
      g.current.rotation.y = -t;
    }
    if (tail.current) tail.current.rotation.y = 0.5 * Math.sin(clock.getElapsedTime() * 10);
  });
  return (
    <group ref={g}>
      <group rotation={[0, 0, 0]}>
        <Ball r={0.12} c={c} s={[0.55, 0.9, 1.6]} />
        <mesh ref={tail} position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.16, 3]} />
          <Mat c={c} />
        </mesh>
        <Ball p={[0.05, 0.03, 0.12]} r={0.018} c="#111827" />
        <Ball p={[-0.05, 0.03, 0.12]} r={0.018} c="#111827" />
      </group>
    </group>
  );
}

/** A dog: body, head, floppy ears and a wagging tail. */
export function Dog({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, c = "#E0A458" }: { p?: V3; rot?: V3; s?: number; c?: string }) {
  const tail = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (tail.current) tail.current.rotation.y = 0.6 * Math.sin(t * 12);
    if (head.current) head.current.rotation.z = 0.15 * Math.sin(t * 2);
  });
  return (
    <group position={p} rotation={rot} scale={s}>
      <Ball p={[0, 0.3, 0]} r={0.2} c={c} s={[0.85, 0.8, 1.35]} />
      {[[-0.1, 0.16], [0.1, 0.16], [-0.1, -0.16], [0.1, -0.16]].map(([x, z], i) => (
        <Cyl key={i} p={[x, 0.1, z]} r1={0.045} h={0.2} c={c} seg={8} />
      ))}
      <group ref={head} position={[0, 0.47, 0.25]}>
        <Ball r={0.15} c={c} />
        <Ball p={[0, -0.04, 0.13]} r={0.07} c="#F5D6A8" />
        <Ball p={[0, -0.01, 0.2]} r={0.028} c="#1F2937" />
        {[-1, 1].map((k) => (
          <group key={k}>
            <Ball p={[0.06 * k, 0.04, 0.12]} r={0.022} c="#1F2937" />
            <Ball p={[0.13 * k, 0.0, -0.02]} r={0.07} c="#9A6A36" s={[0.5, 1.2, 0.8]} />
          </group>
        ))}
      </group>
      <group ref={tail} position={[0, 0.38, -0.26]}>
        <Cyl p={[0, 0.08, -0.05]} r1={0.025} h={0.2} c={c} seg={6} rot={[-0.7, 0, 0]} />
      </group>
    </group>
  );
}

/** A bicycle standing upright, wheels turning at `spin` rad/s. */
export function Bicycle({ p = [0, 0, 0], rot = [0, 0, 0], frame = "#EF4444", spin = 4, s = 1 }: { p?: V3; rot?: V3; frame?: string; spin?: number; s?: number }) {
  const w1 = useRef<THREE.Group>(null);
  const w2 = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (w1.current) w1.current.rotation.z -= spin * dt;
    if (w2.current) w2.current.rotation.z -= spin * dt;
  });
  const R = 0.34;
  const Wheel = ({ x, r }: { x: number; r: React.RefObject<THREE.Group | null> }) => (
    <group position={[x, R, 0]}>
      <group ref={r}>
        <mesh castShadow>
          <torusGeometry args={[R, 0.035, 10, 32]} />
          <Mat c="#1F2937" r={0.6} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} rot={[0, 0, (i * Math.PI) / 4]} s={[R * 2, 0.012, 0.012]} c="#CBD5E1" />
        ))}
        <Cyl r1={0.04} h={0.06} c="#94A3B8" rot={[Math.PI / 2, 0, 0]} />
      </group>
    </group>
  );
  return (
    <group position={p} rotation={rot} scale={s}>
      <Wheel x={-0.55} r={w1} />
      <Wheel x={0.55} r={w2} />
      {/* frame: a triangle of tubes */}
      <Box p={[0, 0.62, 0]} s={[0.8, 0.04, 0.04]} c={frame} />
      <Box p={[-0.22, 0.48, 0]} rot={[0, 0, 1.05]} s={[0.36, 0.04, 0.04]} c={frame} />
      <Box p={[0.18, 0.48, 0]} rot={[0, 0, -0.95]} s={[0.4, 0.04, 0.04]} c={frame} />
      <Box p={[-0.38, 0.47, 0]} rot={[0, 0, -0.95]} s={[0.36, 0.04, 0.04]} c={frame} />
      <Box p={[0.48, 0.5, 0]} rot={[0, 0, 1.25]} s={[0.36, 0.04, 0.04]} c={frame} />
      {/* seat and handlebar */}
      <Box p={[-0.3, 0.78, 0]} s={[0.24, 0.05, 0.12]} c="#1F2937" />
      <Cyl p={[-0.3, 0.7, 0]} r1={0.018} h={0.16} c="#94A3B8" seg={6} />
      <Cyl p={[0.42, 0.8, 0]} r1={0.018} h={0.4} c="#94A3B8" seg={6} rot={[Math.PI / 2, 0, 0]} />
      <Cyl p={[0.42, 0.7, 0]} r1={0.02} h={0.2} c="#94A3B8" seg={6} />
    </group>
  );
}

/** A car with turning wheels and a gentle idle bounce. */
export function Car({ p = [0, 0, 0], rot = [0, 0, 0], c = "#3B82F6" }: { p?: V3; rot?: V3; c?: string }) {
  const body = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (body.current) body.current.position.y = 0.015 * Math.sin(clock.getElapsedTime() * 14);
  });
  return (
    <group position={p} rotation={rot}>
      <group ref={body}>
        <Box p={[0, 0.42, 0]} s={[2.0, 0.42, 0.95]} c={c} r={0.35} />
        <Box p={[-0.1, 0.8, 0]} s={[1.1, 0.4, 0.85]} c={c} r={0.35} />
        <Box p={[-0.1, 0.8, 0.43]} s={[0.95, 0.3, 0.02]} c="#BFE3F7" />
        <Box p={[-0.1, 0.8, -0.43]} s={[0.95, 0.3, 0.02]} c="#BFE3F7" />
        <Box p={[0.46, 0.8, 0]} s={[0.02, 0.3, 0.75]} c="#BFE3F7" />
        <Box p={[1.0, 0.45, 0.3]} s={[0.02, 0.1, 0.18]} c="#FEF08A" />
        <Box p={[1.0, 0.45, -0.3]} s={[0.02, 0.1, 0.18]} c="#FEF08A" />
      </group>
      {[[-0.65, 0.48], [0.65, 0.48], [-0.65, -0.48], [0.65, -0.48]].map(([x, z], i) => (
        <Cyl key={i} p={[x, 0.2, z]} r1={0.2} h={0.14} c="#1F2937" rot={[Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
}

/** A picture frame hung on a wall (facing +z). */
export function Frame({ p = [0, 1.6, -2.4], w = 0.8, h = 0.6, art = ["#F97316", "#FDE047", "#38BDF8"] }: { p?: V3; w?: number; h?: number; art?: string[] }) {
  return (
    <group position={p}>
      <Box s={[w + 0.08, h + 0.08, 0.04]} c="#B45309" />
      <Box p={[0, 0, 0.025]} s={[w, h, 0.01]} c="#FFFBEB" />
      <Ball p={[w * 0.22, h * 0.18, 0.035]} r={h * 0.14} c={art[1]} />
      <mesh position={[-w * 0.1, -h * 0.1, 0.035]}>
        <coneGeometry args={[h * 0.3, h * 0.45, 3]} />
        <Mat c={art[0]} />
      </mesh>
      <Box p={[0, -h * 0.36, 0.034]} s={[w * 0.9, h * 0.14, 0.01]} c={art[2]} />
    </group>
  );
}

/**
 * An indoor set: a back wall and two side walls with skirting, a wooden floor, windows
 * with frames, sills and curtains, and a framed picture — so indoor scenes read as rooms
 * instead of a wall standing in empty space.
 */
export function RoomWall({ z = -2.5, c = "#FFF7ED", h = 3.2, windows = [] as number[], floor = "#C9955E", width = 9, depth = 6.5 }: { z?: number; c?: string; h?: number; windows?: number[]; floor?: string; width?: number; depth?: number }) {
  const wallTex = wallpaper(c);
  const floorTex = planks(floor);
  const half = width / 2;
  const side = (s: -1 | 1) => (
    <group>
      <mesh position={[half * s, h / 2, z + depth / 2]} rotation={[0, -s * Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, h]} />
        <meshStandardMaterial color={c} map={wallTex ?? undefined} roughness={0.95} />
      </mesh>
      <Box p={[half * s - s * 0.02, 0.07, z + depth / 2]} s={[0.04, 0.14, depth]} c="#E7D8C3" />
    </group>
  );
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, z + depth / 2]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#ffffff" map={floorTex ?? undefined} roughness={0.75} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, h / 2, z]} receiveShadow>
        <planeGeometry args={[width, h]} />
        <meshStandardMaterial color={c} map={wallTex ?? undefined} roughness={0.95} />
      </mesh>
      <Box p={[0, h + 0.05, z + 0.05]} s={[width, 0.1, 0.1]} c="#F8FAFC" />
      <Box p={[0, 0.07, z + 0.02]} s={[width, 0.14, 0.04]} c="#E7D8C3" />
      {side(-1)}
      {side(1)}
      {windows.map((x) => (
        <group key={x} position={[x, 1.75, z + 0.03]}>
          <Box s={[1.1, 1.1, 0.06]} c="#FFFFFF" />
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.96, 0.96]} />
            <meshStandardMaterial color="#BFE3F7" emissive="#E0F2FE" emissiveIntensity={0.55} />
          </mesh>
          <Box p={[0, 0, 0.05]} s={[0.05, 0.96, 0.02]} c="#FFFFFF" />
          <Box p={[0, 0, 0.05]} s={[0.96, 0.05, 0.02]} c="#FFFFFF" />
          <Box p={[0, -0.6, 0.08]} s={[1.25, 0.06, 0.16]} c="#F1F5F9" />
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.66 * s, 0.02, 0.1]} castShadow>
              <boxGeometry args={[0.22, 1.25, 0.05]} />
              <meshStandardMaterial color="#FCA5A5" roughness={0.9} />
            </mesh>
          ))}
          <Cyl p={[0, 0.66, 0.12]} r1={0.02} h={1.7} c="#A16207" rot={[0, 0, Math.PI / 2]} />
        </group>
      ))}
      {/* a framed picture where there is room for one */}
      {!windows.some((x) => Math.abs(x) < 1.2) && (
        <group position={[windows.length ? (windows[0] > 0 ? -2.4 : 2.4) : -2.4, 1.9, z + 0.03]}>
          <Box s={[0.7, 0.5, 0.04]} c="#92400E" />
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshStandardMaterial color="#A7F3D0" />
          </mesh>
          <mesh position={[0.05, -0.05, 0.03]}>
            <circleGeometry args={[0.12, 3]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>
          <mesh position={[-0.18, 0.1, 0.03]}>
            <circleGeometry args={[0.05, 16]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
        </group>
      )}
    </group>
  );
}

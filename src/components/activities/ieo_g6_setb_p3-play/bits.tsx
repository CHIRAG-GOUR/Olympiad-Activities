"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ball, Box, Cyl, Mat } from "../ieo_g6_seta-play/props3D";
import { phaseOf } from "../ieo_g6_seta-play/scene";

/* ══════════════════════════════════════════════════════════════════════
   Building blocks for the Set B Paper 3 worlds.
   ══════════════════════════════════════════════════════════════════════ */

export type V3 = [number, number, number];

export function Ground({ c, r = 16 }: { c: string; r?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
      <circleGeometry args={[r, 48]} />
      <meshStandardMaterial color={c} roughness={1} />
    </mesh>
  );
}

/** Smoothly eases a value towards `on ? 1 : 0` and hands it to `apply` every frame. */
export function useEased(on: boolean, apply: (k: number, t: number) => void, speed = 1.4) {
  const k = useRef(on ? 1 : 0);
  useFrame(({ clock }, dt) => {
    const target = on ? 1 : 0;
    k.current += Math.sign(target - k.current) * Math.min(Math.abs(target - k.current), dt * speed);
    const e = k.current * k.current * (3 - 2 * k.current);
    apply(e, clock.getElapsedTime());
  });
}

/** A group that glides between two placements as `on` changes. */
export function Glide({
  on, from, to, rotFrom = [0, 0, 0], rotTo, sFrom = 1, sTo, speed = 1.2, children,
}: {
  on: boolean; from: V3; to: V3; rotFrom?: V3; rotTo?: V3; sFrom?: number; sTo?: number; speed?: number; children: React.ReactNode;
}) {
  const g = useRef<THREE.Group>(null);
  const rt = rotTo ?? rotFrom;
  const st = sTo ?? sFrom;
  useEased(
    on,
    (k) => {
      if (!g.current) return;
      g.current.position.set(from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k);
      g.current.rotation.set(rotFrom[0] + (rt[0] - rotFrom[0]) * k, rotFrom[1] + (rt[1] - rotFrom[1]) * k, rotFrom[2] + (rt[2] - rotFrom[2]) * k);
      g.current.scale.setScalar(sFrom + (st - sFrom) * k);
    },
    speed
  );
  return (
    <group ref={g} position={from}>
      {children}
    </group>
  );
}

/** A flat sign with crisp text drawn onto a canvas texture (no font download needed). */
export function Sign({
  p = [0, 1, 0], rot = [0, 0, 0], w = 1.2, h = 0.4, text, bg = "#FFFFFF", fg = "#1E293B", border = "#CBD5E1", size = 64, bold = true, post = false,
}: {
  p?: V3; rot?: V3; w?: number; h?: number; text: string; bg?: string; fg?: string; border?: string; size?: number; bold?: boolean; post?: boolean;
}) {
  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    const scale = 256;
    c.width = Math.round(w * scale);
    c.height = Math.round(h * scale);
    const x = c.getContext("2d")!;
    x.fillStyle = bg;
    x.fillRect(0, 0, c.width, c.height);
    x.strokeStyle = border;
    x.lineWidth = 12;
    x.strokeRect(6, 6, c.width - 12, c.height - 12);
    x.fillStyle = fg;
    x.textAlign = "center";
    x.textBaseline = "middle";
    const lines = text.split("\n");
    let fs = size;
    x.font = `${bold ? 800 : 600} ${fs}px system-ui, sans-serif`;
    while (fs > 18 && Math.max(...lines.map((l) => x.measureText(l).width)) > c.width - 36) {
      fs -= 4;
      x.font = `${bold ? 800 : 600} ${fs}px system-ui, sans-serif`;
    }
    lines.forEach((l, i) => x.fillText(l, c.width / 2, c.height / 2 + (i - (lines.length - 1) / 2) * fs * 1.15));
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [text, w, h, bg, fg, border, size, bold]);
  useEffect(() => () => tex?.dispose(), [tex]);
  return (
    <group position={p} rotation={rot}>
      {post && <Cyl p={[0, -h / 2 - 0.45, -0.02]} r1={0.03} h={0.9} c="#64748B" seg={8} />}
      <mesh castShadow>
        <boxGeometry args={[w, h, 0.03]} />
        <meshStandardMaterial color={bg} />
      </mesh>
      {tex && (
        <mesh position={[0, 0, 0.017]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/** A grey elephant that sways its trunk. */
export function Elephant({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }: { p?: V3; rot?: V3; s?: number }) {
  const trunk = useRef<THREE.Group>(null);
  const ear = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + ph;
    if (trunk.current) trunk.current.rotation.x = 0.25 + Math.sin(t * 1.3) * 0.25;
    if (ear.current) ear.current.rotation.y = Math.sin(t * 2) * 0.15;
  });
  const c = "#9CA3AF";
  return (
    <group position={p} rotation={rot} scale={s}>
      <Ball p={[0, 0.85, 0]} r={0.55} c={c} s={[1.35, 1, 1]} />
      {[[-0.45, 0.25], [0.45, 0.25], [-0.45, -0.25], [0.45, -0.25]].map(([x, z], i) => (
        <Cyl key={i} p={[x, 0.3, z]} r1={0.14} h={0.62} c="#8B929C" seg={10} />
      ))}
      <group position={[0.78, 1.05, 0]}>
        <Ball r={0.36} c={c} />
        <group ref={ear}>
          <Ball p={[-0.1, 0.05, 0.33]} r={0.28} c="#A8AEB7" s={[0.3, 1, 1]} />
          <Ball p={[-0.1, 0.05, -0.33]} r={0.28} c="#A8AEB7" s={[0.3, 1, 1]} />
        </group>
        <Ball p={[0.25, 0.1, 0.15]} r={0.04} c="#111827" />
        <Ball p={[0.25, 0.1, -0.15]} r={0.04} c="#111827" />
        <group ref={trunk} position={[0.3, -0.1, 0]}>
          <Cyl p={[0.06, -0.3, 0]} r1={0.07} r2={0.11} h={0.6} c={c} rot={[0, 0, 0.2]} seg={10} />
        </group>
        <Cyl p={[0.3, -0.15, 0.12]} r1={0.02} r2={0.04} h={0.3} c="#FFFBEB" rot={[0.3, 0, 1.2]} seg={8} />
        <Cyl p={[0.3, -0.15, -0.12]} r1={0.02} r2={0.04} h={0.3} c="#FFFBEB" rot={[-0.3, 0, 1.2]} seg={8} />
      </group>
      <Cyl p={[-0.78, 0.9, 0]} r1={0.02} h={0.4} c={c} rot={[0, 0, -0.6]} seg={6} />
    </group>
  );
}

/** A blue whale that rolls gently in the swell. */
export function Whale({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, spout = false }: { p?: V3; rot?: V3; s?: number; spout?: boolean }) {
  const g = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const jet = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (g.current) {
      g.current.position.y = p[1] + Math.sin(t * 0.8) * 0.06;
      g.current.rotation.z = Math.sin(t * 0.6) * 0.05;
    }
    if (tail.current) tail.current.rotation.z = Math.sin(t * 1.6) * 0.3;
    if (jet.current) {
      const k = spout ? 0.6 + 0.4 * Math.abs(Math.sin(t * 2.2)) : 0.001;
      jet.current.scale.set(1, k, 1);
    }
  });
  return (
    <group ref={g} position={p} rotation={rot} scale={s}>
      <Ball r={0.9} c="#2B5B84" s={[2.4, 0.8, 1]} />
      <Ball p={[0.2, -0.35, 0]} r={0.8} c="#D6E4F0" s={[2.2, 0.35, 0.85]} />
      <Ball p={[1.55, 0.05, 0.62]} r={0.06} c="#0F172A" />
      <Ball p={[1.55, 0.05, -0.62]} r={0.06} c="#0F172A" />
      <Box p={[0.2, -0.3, 0.85]} s={[0.6, 0.05, 0.3]} c="#244D70" rot={[0.4, 0, -0.3]} />
      <Box p={[0.2, -0.3, -0.85]} s={[0.6, 0.05, 0.3]} c="#244D70" rot={[-0.4, 0, -0.3]} />
      <group ref={tail} position={[-2.1, 0.1, 0]}>
        <Cyl p={[-0.25, 0, 0]} r1={0.12} r2={0.3} h={0.6} c="#2B5B84" rot={[0, 0, Math.PI / 2]} />
        <Box p={[-0.6, 0, 0]} s={[0.3, 0.06, 1.1]} c="#244D70" />
      </group>
      <group ref={jet} position={[1.0, 0.7, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.25, 1, 12, 1, true]} />
          <meshStandardMaterial color="#E0F2FE" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/** A spur gear (teeth around a disc) spinning at `speed`. */
export function Gear({ p = [0, 0, 0], r = 0.5, teeth = 12, c = "#94A3B8", speed = 0.6, phase = 0 }: { p?: V3; r?: number; teeth?: number; c?: string; speed?: number; phase?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = clock.getElapsedTime() * speed + phase;
  });
  return (
    <group position={p}>
      <group ref={g}>
        <Cyl r1={r} h={0.18} c={c} rot={[Math.PI / 2, 0, 0]} seg={32} />
        <Cyl r1={r * 0.25} h={0.22} c="#475569" rot={[Math.PI / 2, 0, 0]} seg={16} />
        {Array.from({ length: teeth }, (_, i) => {
          const a = (i / teeth) * Math.PI * 2;
          return <Box key={i} p={[Math.cos(a) * (r + 0.07), Math.sin(a) * (r + 0.07), 0]} s={[0.16, 0.12, 0.18]} c={c} rot={[0, 0, a]} />;
        })}
      </group>
    </group>
  );
}

/** An equirectangular map drawn on a canvas: ocean, continents, ice caps. */
let globeTex: THREE.CanvasTexture | null = null;
function globeTexture() {
  if (globeTex || typeof document === "undefined") return globeTex;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#1D6FB8");
  g.addColorStop(0.5, "#2B8FD9");
  g.addColorStop(1, "#1D6FB8");
  x.fillStyle = g;
  x.fillRect(0, 0, 1024, 512);
  // lon/lat → pixels
  const P = (lon: number, lat: number): [number, number] => [((lon + 180) / 360) * 1024, ((90 - lat) / 180) * 512];
  const land = (pts: [number, number][], col = "#6FB257") => {
    x.fillStyle = col;
    x.beginPath();
    pts.forEach(([lo, la], i) => {
      const [px, py] = P(lo, la);
      if (i) x.lineTo(px, py);
      else x.moveTo(px, py);
    });
    x.closePath();
    x.fill();
  };
  // rough continents
  land([[-10, 36], [0, 43], [-5, 48], [5, 52], [10, 55], [20, 58], [30, 60], [40, 62], [30, 45], [25, 38], [15, 38], [5, 40]]); // Europe
  land([[-17, 21], [-10, 33], [10, 37], [32, 31], [43, 12], [51, 11], [40, -5], [40, -16], [33, -28], [20, -35], [12, -18], [9, 4], [-8, 4], [-17, 14]], "#8DB255"); // Africa
  land([[40, 62], [60, 70], [100, 75], [140, 70], [160, 60], [140, 45], [122, 30], [108, 20], [100, 8], [80, 8], [72, 20], [58, 25], [48, 30], [40, 40]]); // Asia
  land([[-165, 65], [-140, 70], [-95, 72], [-65, 60], [-55, 50], [-80, 30], [-97, 18], [-88, 15], [-105, 25], [-118, 32], [-125, 48], [-150, 58]]); // N America
  land([[-80, 10], [-60, 8], [-35, -8], [-40, -22], [-55, -35], [-70, -52], [-75, -40], [-72, -18], [-80, -5]], "#7FB85A"); // S America
  land([[114, -22], [130, -12], [145, -15], [153, -28], [145, -38], [130, -32], [115, -34]], "#C9A35B"); // Australia
  land([[-50, 60], [-30, 70], [-20, 80], [-60, 82], [-70, 75]], "#E8F1F8"); // Greenland
  x.fillStyle = "#F1F5F9";
  x.fillRect(0, 490, 1024, 22);
  x.fillRect(0, 0, 1024, 10);
  globeTex = new THREE.CanvasTexture(c);
  globeTex.colorSpace = THREE.SRGBColorSpace;
  globeTex.anisotropy = 8;
  return globeTex;
}

/** A slowly turning globe. */
export function Globe({ p = [0, 1.2, 0], r = 1, spin = 0.15, children }: { p?: V3; r?: number; spin?: number; children?: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * spin;
  });
  const tex = globeTexture();
  return (
    <group position={p}>
      <group ref={g}>
        {/* texture u=0 at lon −180; three's sphere puts u=0.75 at +z, so turn it to match onSphere() */}
        <mesh castShadow rotation={[0, -Math.PI / 2, 0]}>
          <sphereGeometry args={[r, 64, 40]} />
          <meshStandardMaterial map={tex ?? undefined} roughness={0.6} />
        </mesh>
        {children}
      </group>
    </group>
  );
}

/** Converts latitude/longitude to a point on a sphere of radius r. */
export function onSphere(lat: number, lon: number, r: number): V3 {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
}

/** A clock face with moving hands; `rate` is clock-hours per real second. */
export function ClockFace({ p = [0, 2, 0], r = 0.8, rate = 0.02, frame = "#7C3AED" }: { p?: V3; r?: number; rate?: number; frame?: string }) {
  const hr = useRef<THREE.Group>(null);
  const mn = useRef<THREE.Group>(null);
  const time = useRef(9);
  useFrame((_, dt) => {
    time.current += dt * rate;
    if (hr.current) hr.current.rotation.z = -((time.current % 12) / 12) * Math.PI * 2;
    if (mn.current) mn.current.rotation.z = -(time.current % 1) * Math.PI * 2;
  });
  return (
    <group position={p}>
      <Cyl r1={r + 0.08} h={0.12} c={frame} rot={[Math.PI / 2, 0, 0]} seg={40} />
      <Cyl p={[0, 0, 0.04]} r1={r} h={0.08} c="#FFFBEB" rot={[Math.PI / 2, 0, 0]} seg={40} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <Box key={i} p={[Math.sin(a) * r * 0.85, Math.cos(a) * r * 0.85, 0.1]} s={[0.05, i % 3 ? 0.08 : 0.16, 0.02]} c="#334155" rot={[0, 0, -a]} />;
      })}
      <group ref={hr} position={[0, 0, 0.12]}>
        <Box p={[0, r * 0.25, 0]} s={[0.07, r * 0.5, 0.02]} c="#0F172A" />
      </group>
      <group ref={mn} position={[0, 0, 0.14]}>
        <Box p={[0, r * 0.36, 0]} s={[0.04, r * 0.72, 0.02]} c="#DC2626" />
      </group>
      <Ball p={[0, 0, 0.16]} r={0.05} c="#0F172A" />
    </group>
  );
}

/** A fridge whose door swings open when `open`. */
export function Fridge({ p = [0, 0, 0], rot = [0, 0, 0], open = false, children }: { p?: V3; rot?: V3; open?: boolean; children?: React.ReactNode }) {
  const door = useRef<THREE.Group>(null);
  useEased(open, (k) => {
    if (door.current) door.current.rotation.y = -k * 1.9;
  });
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0.95, 0]} s={[0.9, 1.9, 0.8]} c="#E2E8F0" />
      <Box p={[0, 1.35, 0.3]} s={[0.8, 0.03, 0.6]} c="#CBD5E1" />
      <Box p={[0, 0.8, 0.3]} s={[0.8, 0.03, 0.6]} c="#CBD5E1" />
      <mesh position={[0, 1.1, 0.35]}>
        <boxGeometry args={[0.82, 1.6, 0.05]} />
        <meshStandardMaterial color="#F8FAFC" emissive="#FEF9C3" emissiveIntensity={0.25} />
      </mesh>
      {children}
      <group ref={door} position={[0.45, 0, 0.41]}>
        <Box p={[-0.45, 0.95, 0.02]} s={[0.9, 1.88, 0.06]} c="#F1F5F9" />
        <Box p={[-0.8, 1.2, 0.07]} s={[0.04, 0.4, 0.04]} c="#94A3B8" />
      </group>
    </group>
  );
}

/** A small bird with flapping wings. */
export function Bird({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, c = "#1E3A8A", belly = "#FDE68A" }: { p?: V3; rot?: V3; s?: number; c?: string; belly?: string }) {
  const l = useRef<THREE.Group>(null);
  const r = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    const a = Math.sin(clock.getElapsedTime() * 12 + ph) * 0.7;
    if (l.current) l.current.rotation.x = a;
    if (r.current) r.current.rotation.x = -a;
  });
  return (
    <group position={p} rotation={rot} scale={s}>
      <Ball r={0.12} c={c} s={[1.6, 0.9, 0.9]} />
      <Ball p={[0.05, -0.04, 0]} r={0.09} c={belly} s={[1.3, 0.7, 0.8]} />
      <Ball p={[0.18, 0.04, 0]} r={0.07} c={c} />
      <mesh position={[0.26, 0.04, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.025, 0.08, 6]} />
        <Mat c="#F59E0B" />
      </mesh>
      <group ref={l} position={[0, 0.04, 0.08]}>
        <Box p={[0, 0, 0.14]} s={[0.14, 0.02, 0.28]} c={c} />
      </group>
      <group ref={r} position={[0, 0.04, -0.08]}>
        <Box p={[0, 0, -0.14]} s={[0.14, 0.02, 0.28]} c={c} />
      </group>
      <Box p={[-0.22, 0.02, 0]} s={[0.14, 0.02, 0.14]} c={c} rot={[0, 0.78, 0]} />
    </group>
  );
}

/** Many light particles in one draw call; `layout(i, t, out)` places particle i at time t. */
export function Particles({ count, size = 0.05, color, layout, opacity = 0.9 }: { count: number; size?: number; color: string; layout: (i: number, t: number, out: THREE.Vector3) => void; opacity?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      layout(i, t, v);
      tmp.position.copy(v);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[size, 6, 5]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </instancedMesh>
  );
}

/** Pseudo-random in [0,1) from an integer seed. */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

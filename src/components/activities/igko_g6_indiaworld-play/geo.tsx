"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Geography for the India and the World paper: simplified coastlines drawn into an
 * equirectangular texture in the browser (no map downloads), and helpers to place things
 * by longitude/latitude on a flat map or on a globe.
 */

type LL = [number, number]; // [longitude, latitude]

export const COASTS: Record<string, LL[]> = {
  africa: [[-17, 21], [-16, 28], [-10, 35], [0, 36], [10, 37], [20, 33], [32, 31], [35, 28], [43, 12], [51, 12], [42, -2], [40, -15], [35, -24], [27, -34], [18, -34], [12, -17], [9, -1], [5, 5], [-8, 5], [-15, 11]],
  europe: [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [0, 50], [5, 53], [8, 57], [5, 62], [15, 69], [28, 71], [40, 67], [40, 55], [30, 46], [28, 41], [23, 38], [15, 40], [12, 44], [3, 43]],
  asia: [[26, 40], [36, 36], [35, 30], [43, 12], [52, 16], [58, 22], [62, 25], [67, 24], [73, 17], [77, 8], [80, 15], [88, 22], [92, 20], [97, 16], [100, 8], [104, 1], [106, 10], [109, 18], [117, 23], [122, 30], [121, 40], [129, 42], [135, 45], [142, 53], [160, 60], [180, 66], [180, 72], [140, 73], [110, 77], [75, 73], [60, 69], [50, 68], [40, 67], [40, 55], [30, 46]],
  australia: [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -25], [150, -37], [141, -38], [131, -31], [115, -34]],
  northAmerica: [[-168, 66], [-140, 70], [-95, 72], [-80, 63], [-60, 55], [-66, 45], [-75, 35], [-81, 25], [-90, 30], [-97, 26], [-97, 18], [-87, 15], [-83, 9], [-80, 8], [-92, 15], [-105, 20], [-112, 30], [-120, 35], [-124, 42], [-125, 49], [-135, 58], [-150, 60], [-165, 60]],
  southAmerica: [[-80, 8], [-72, 12], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-65, -42], [-68, -52], [-75, -50], [-72, -35], [-71, -18], [-80, -5]],
  greenland: [[-45, 60], [-20, 70], [-20, 80], [-60, 82], [-70, 76], [-55, 65]],
  britain: [[-5, 50], [1, 51], [2, 53], [-1, 57], [-4, 59], [-6, 57], [-5, 54]],
  japan: [[130, 31], [135, 34], [141, 36], [142, 42], [140, 41], [136, 35], [131, 34]],
  madagascar: [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17]],
  sumatra: [[95, 5], [105, -5], [103, -6], [95, 2]],
  borneo: [[109, 2], [117, 7], [119, 1], [116, -4], [110, -3]],
  java: [[105, -6], [114, -7], [114, -8], [105, -7]],
  srilanka: [[80, 9.5], [82, 7], [81, 6], [79.8, 7]],
  antarctica: [[-180, -68], [-90, -72], [0, -70], [90, -67], [180, -68], [180, -90], [-180, -90]],
};

export const RIVERS: Record<string, LL[]> = {
  nile: [[31, 31], [31, 26], [33, 20], [32.5, 15.6], [33, 9], [32, 3], [33, 0]],
  congo: [[12.4, -6], [16, -4], [18, -1], [22, 1], [25, 0.5], [26, -4], [27, -8]],
  indus: [[67.5, 24], [68, 27], [71, 30], [72, 33], [75, 35]],
  ganges: [[88, 22], [87, 25], [84, 25.5], [81, 25.4], [79, 28], [78, 30]],
  tigris: [[48, 30.5], [47, 31.5], [45, 33], [44, 34.5], [43, 36.5], [41, 37.5]],
  euphrates: [[47.5, 30.8], [45, 32], [43.5, 33.5], [41, 34.5], [39, 36], [38.5, 38.5]],
  yangtze: [[121.5, 31.4], [117, 31], [113, 30.5], [110, 30.8], [106, 29.5], [104, 28.5], [100, 27]],
  yellow: [[119, 37.7], [116, 36.5], [113, 34.8], [110, 34.6], [110.5, 38], [106, 38], [104, 36]],
};

export const llToUV = ([lon, lat]: LL, w: number, h: number): [number, number] => [((lon + 180) / 360) * w, ((90 - lat) / 180) * h];

/** Equirectangular world texture: ocean, land, optional rivers and grid. */
export function useWorldTexture({
  ocean = "#3B82C4",
  land = "#D9CFA5",
  coast = "#A68E5B",
  rivers = false,
  grid = true,
  size = 2048,
}: { ocean?: string; land?: string; coast?: string; rivers?: boolean; grid?: boolean; size?: number } = {}) {
  const tex = useMemo(() => {
    const w = size;
    const h = size / 2;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, ocean);
    grad.addColorStop(0.5, new THREE.Color(ocean).offsetHSL(0, 0, 0.06).getStyle());
    grad.addColorStop(1, ocean);
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    if (grid) {
      g.strokeStyle = "rgba(255,255,255,0.12)";
      g.lineWidth = 1;
      for (let lon = -180; lon <= 180; lon += 30) {
        const [x] = llToUV([lon, 0], w, h);
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, h);
        g.stroke();
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        const [, y] = llToUV([0, lat], w, h);
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(w, y);
        g.stroke();
      }
    }
    for (const poly of Object.values(COASTS)) {
      g.beginPath();
      poly.forEach((p, i) => {
        const [x, y] = llToUV(p, w, h);
        if (i) g.lineTo(x, y);
        else g.moveTo(x, y);
      });
      g.closePath();
      g.fillStyle = land;
      g.fill();
      g.strokeStyle = coast;
      g.lineWidth = Math.max(2, w / 700);
      g.stroke();
    }
    if (rivers) {
      g.strokeStyle = "#2F7FD0";
      g.lineWidth = Math.max(3, w / 500);
      g.lineCap = "round";
      g.lineJoin = "round";
      for (const r of Object.values(RIVERS)) {
        g.beginPath();
        r.forEach((p, i) => {
          const [x, y] = llToUV(p, w, h);
          if (i) g.lineTo(x, y);
          else g.moveTo(x, y);
        });
        g.stroke();
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [ocean, land, coast, rivers, grid, size]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/* ── Flat map ────────────────────────────────────────────────── */

export interface MapFrame {
  /** Visible window, in degrees. */
  lon: [number, number];
  lat: [number, number];
  /** Width of the map in scene units; height follows the window's aspect. */
  width: number;
  y?: number;
}

export function mapSize(f: MapFrame) {
  const w = f.width;
  const h = (w * (f.lat[1] - f.lat[0])) / (f.lon[1] - f.lon[0]);
  return { w, h };
}

/** Scene position of a longitude/latitude on a flat map window. */
export function llToMap([lon, lat]: LL, f: MapFrame, lift = 0): [number, number, number] {
  const { w, h } = mapSize(f);
  const x = ((lon - f.lon[0]) / (f.lon[1] - f.lon[0]) - 0.5) * w;
  const z = (0.5 - (lat - f.lat[0]) / (f.lat[1] - f.lat[0])) * h;
  return [x, (f.y ?? 0) + lift, z];
}

/** A flat map table showing the window of the world texture. */
export function FlatMap({ frame, rivers = false, ocean, land }: { frame: MapFrame; rivers?: boolean; ocean?: string; land?: string }) {
  const base = useWorldTexture({ rivers, ocean, land });
  const tex = useMemo(() => {
    const t = base.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.needsUpdate = true;
    t.repeat.set((frame.lon[1] - frame.lon[0]) / 360, (frame.lat[1] - frame.lat[0]) / 180);
    t.offset.set((frame.lon[0] + 180) / 360, (frame.lat[0] + 90) / 180);
    return t;
  }, [base, frame.lon, frame.lat]);
  useEffect(() => () => tex.dispose(), [tex]);
  const { w, h } = mapSize(frame);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, frame.y ?? 0, 0]} receiveShadow>
      <planeGeometry args={[w, h]} />
      <meshPhysicalMaterial map={tex} roughness={0.55} clearcoat={0.5} clearcoatRoughness={0.3} />
    </mesh>
  );
}

/** A glowing arc between two map points, with travellers moving along it. */
export function MapArc({
  from,
  to,
  frame,
  color = "#F59E0B",
  height = 0.6,
  movers = 3,
  speed = 0.25,
  mover,
}: {
  from: LL;
  to: LL;
  frame: MapFrame;
  color?: string;
  height?: number;
  movers?: number;
  speed?: number;
  mover?: React.ReactNode;
}) {
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...llToMap(from, frame, 0.03));
    const b = new THREE.Vector3(...llToMap(to, frame, 0.03));
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += height * Math.min(1, a.distanceTo(b) / 2 + 0.3);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to, frame, height]);
  const group = useRef<THREE.Group>(null);
  useFrame((c) => {
    group.current?.children.forEach((m, i) => {
      const t = (c.clock.elapsedTime * speed + i / movers) % 1;
      m.position.copy(curve.getPoint(t));
      const ahead = curve.getPoint(Math.min(1, t + 0.01));
      m.lookAt(ahead);
    });
  });
  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.012, 8, false]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <group ref={group}>
        {Array.from({ length: movers }, (_, i) => (
          <group key={i}>
            {mover ?? (
              <mesh>
                <sphereGeometry args={[0.03, 10, 10]} />
                <meshBasicMaterial color={color} toneMapped={false} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </>
  );
}

/** A map pin. */
export function Pin({ at, frame, color = "#DC2626", height = 0.22 }: { at: LL; frame: MapFrame; color?: string; height?: number }) {
  const [x, y, z] = llToMap(at, frame);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, height, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, height, 0]} castShadow>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
      </mesh>
    </group>
  );
}

/* ── Globe ───────────────────────────────────────────────────── */

/** Position on a globe of radius r (matches three.js sphere UVs with the world texture). */
export function llToGlobe([lon, lat]: LL, r: number): THREE.Vector3 {
  const phi = ((lon + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta));
}

export function Globe({ radius = 1.6, rivers = false, children, spin = 0 }: { radius?: number; rivers?: boolean; children?: React.ReactNode; spin?: number }) {
  const map = useWorldTexture({ rivers, size: 2048 });
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && spin) ref.current.rotation.y += dt * spin;
  });
  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshPhysicalMaterial map={map} roughness={0.5} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.035, 64, 64]} />
        <meshBasicMaterial color="#93C5FD" transparent opacity={0.1} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {children}
    </group>
  );
}

/** Orient a child so its +Y axis points out of the globe at a lon/lat. */
export function GlobeAnchor({ at, r, children }: { at: LL; r: number; children: React.ReactNode }) {
  const pos = llToGlobe(at, r);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
  return (
    <group position={pos} quaternion={q}>
      {children}
    </group>
  );
}

"use client";

import React from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

/**
 * Shared materials and lab furniture for the IGKO investigations, so every scene is built
 * from the same physically based surfaces (lit by the studio environment) rather than
 * flat colours.
 */

type V3 = [number, number, number];

/* ── Materials ───────────────────────────────────────────────── */

export function Metal({ color = "#C7CED6", roughness = 0.28 }: { color?: string; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={1} roughness={roughness} />;
}

export function Brushed({ color = "#9AA4AF" }: { color?: string }) {
  return <meshStandardMaterial color={color} metalness={0.85} roughness={0.45} />;
}

export function Plastic({ color, roughness = 0.38, clearcoat = 0.6 }: { color: string; roughness?: number; clearcoat?: number }) {
  return <meshPhysicalMaterial color={color} roughness={roughness} clearcoat={clearcoat} clearcoatRoughness={0.25} />;
}

export function Glass({ tint = "#F3FAFF", opacity = 0.22, roughness = 0.04 }: { tint?: string; opacity?: number; roughness?: number }) {
  return (
    <meshPhysicalMaterial
      color={tint}
      transparent
      opacity={opacity}
      roughness={roughness}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.05}
      ior={1.5}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );
}

export function Wood({ color = "#A9784A", roughness = 0.62 }: { color?: string; roughness?: number }) {
  return <meshPhysicalMaterial color={color} roughness={roughness} clearcoat={0.3} clearcoatRoughness={0.5} />;
}

export function Matte({ color, roughness = 0.85 }: { color: string; roughness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0} />;
}

/** Satin brass for flat plates and plaques: reads as gold from any angle. */
export function Brass({ color = "#D9B25A" }: { color?: string }) {
  return <meshPhysicalMaterial color={color} metalness={0.45} roughness={0.32} clearcoat={0.8} clearcoatRoughness={0.2} />;
}

export function Glow({ color, intensity = 2 }: { color: string; intensity?: number }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />;
}

/* ── Furniture ───────────────────────────────────────────────── */

/** A laboratory bench: rounded composite top, steel frame and legs. */
export function LabBench({
  size = [6, 2.4] as [number, number],
  height = 0.9,
  top = "#E8EDF2",
  position = [0, 0, 0] as V3,
}: {
  size?: [number, number];
  height?: number;
  top?: string;
  position?: V3;
}) {
  const [w, d] = size;
  return (
    <group position={position}>
      <RoundedBox args={[w, 0.08, d]} radius={0.03} smoothness={4} position={[0, height, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={top} roughness={0.35} clearcoat={0.4} />
      </RoundedBox>
      <mesh position={[0, height - 0.08, 0]} castShadow>
        <boxGeometry args={[w - 0.2, 0.08, d - 0.2]} />
        <Brushed color="#8C96A1" />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (w / 2 - 0.18), (height - 0.1) / 2, sz * (d / 2 - 0.18)]} castShadow>
            <boxGeometry args={[0.07, height - 0.1, 0.07]} />
            <Brushed color="#7D8792" />
          </mesh>
        ))
      )}
    </group>
  );
}

/** A tiled lab floor that catches the contact shadows. */
export function Floor({ size = 30, color = "#EEF1F5" }: { size?: number; color?: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

/** A wooden crate built from planks with corner posts. */
export function Crate({ size = 0.7, band = "#F59E0B" }: { size?: number; band?: string }) {
  const s = size;
  return (
    <group>
      <RoundedBox args={[s, s * 0.72, s]} radius={0.02} smoothness={3} castShadow receiveShadow>
        <Wood color="#B9874F" />
      </RoundedBox>
      {[-0.22, 0, 0.22].map((y) => (
        <mesh key={y} position={[0, y * s, s / 2 + 0.004]}>
          <boxGeometry args={[s * 0.96, s * 0.05, 0.01]} />
          <Wood color="#8E6235" />
        </mesh>
      ))}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (s / 2 - 0.03), 0, sz * (s / 2 - 0.03)]}>
            <boxGeometry args={[0.07, s * 0.74, 0.07]} />
            <Wood color="#7A522A" />
          </mesh>
        ))
      )}
      <mesh position={[0, s * 0.37, 0]}>
        <boxGeometry args={[s * 1.01, 0.02, s * 0.22]} />
        <Plastic color={band} />
      </mesh>
    </group>
  );
}

/** A gold medal on a ribbon, as presented at a ceremony. */
export function Medal({ radius = 0.17 }: { radius?: number }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, radius * 0.18, 48]} />
        <Metal color="#E9B949" roughness={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, radius * 0.1]}>
        <torusGeometry args={[radius * 0.82, radius * 0.06, 12, 48]} />
        <Metal color="#C9962E" roughness={0.25} />
      </mesh>
    </group>
  );
}

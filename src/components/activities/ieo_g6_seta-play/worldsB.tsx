"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "./avatar3D";
import { Bob, Cloud3D, Drift, Spin, useEase } from "./scene";
import { Ball, Box, Bunting, Bush, Car, Cyl, Flag, Flower, House, Mat, Mountain, RoomWall, Table, Tree } from "./props3D";
import type { WorldProps } from "./story";

/* Worlds for Q13–Q24 of the official paper. */

function Ground({ c }: { c: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[18, 64]} />
      <Mat c={c} r={0.95} />
    </mesh>
  );
}

/** Expanding rings — a ringing phone. */
function Rings({ p, c = "#8B5CF6", on = true }: { p: [number, number, number]; c?: string; on?: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.9 + i / 3) % 1;
      m.scale.setScalar(0.2 + k * 0.8);
      (m.material as THREE.MeshBasicMaterial).opacity = on ? 0.6 * (1 - k) : 0;
    });
  });
  return (
    <group position={p}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <torusGeometry args={[0.25, 0.012, 6, 28]} />
          <meshBasicMaterial color={c} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* Q13 — the lady from yesterday walks past; it was her number he was calling */
export function PhoneCallWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#DDEBD4" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.2]} receiveShadow>
        <planeGeometry args={[40, 1.4]} />
        <Mat c="#E7DCCB" r={1} />
      </mesh>
      <House p={[-2.4, 0, -3]} />
      <House p={[2.2, 0, -3.4]} wall="#E0F2FE" roof="#0EA5E9" />
      <Avatar3D position={[-0.8, 0, 0.6]} rotation={[0, 0.5, 0]} pose="phone" shirtColor="#2563EB" hairStyle="short" expression="surprised" />
      <Rings p={[-0.62, 1.7, 0.7]} />
      <Drift from={0.4} to={2.4} speed={0.06} position={[0, 0, 0.1]}>
        <group rotation={[0, -Math.PI / 2, 0]}>
          <Avatar3D pose="walking" shirtColor="#EC4899" pantsColor="#831843" hairStyle="bun" hairColor="#78350F" />
          {/* her phone in her bag starts ringing once the sentence is complete */}
          <Rings p={[0, 1.1, 0.25]} c="#EC4899" on={filled} />
        </group>
      </Drift>
      <Tree p={[3.0, 0, -1.2]} />
      <Flower p={[-1.8, 0, 1.2]} />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

/* Q14 — the big sale, and the shopper who forgot the money again */
export function SaleWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#F5EFE6" />
      <RoomWall c="#FFF1F2" windows={[-2.4, 2.4]} />
      <Box p={[0, 2.4, -2.44]} s={[2.4, 0.6, 0.04]} c="#EF4444" />
      <Box p={[0, 2.4, -2.41]} s={[1.6, 0.18, 0.01]} c="#FFFFFF" />
      <Bunting from={[-3, 2.9, -2.3]} to={[3, 2.9, -2.3]} colors={["#EF4444", "#FFFFFF"]} />
      {/* clothes rails with swinging price tags */}
      {[-1.6, 1.6].map((x) => (
        <group key={x} position={[x, 0, -1.4]}>
          <Cyl p={[-0.6, 0.7, 0]} r1={0.02} h={1.4} c="#94A3B8" seg={8} />
          <Cyl p={[0.6, 0.7, 0]} r1={0.02} h={1.4} c="#94A3B8" seg={8} />
          <Cyl p={[0, 1.4, 0]} r1={0.02} h={1.2} c="#94A3B8" seg={8} rot={[0, 0, Math.PI / 2]} />
          {["#F472B6", "#60A5FA", "#FBBF24", "#34D399"].map((c, i) => (
            <Bob key={c} position={[-0.42 + i * 0.28, 1.05, 0]} amp={0.02} speed={2}>
              <Box s={[0.24, 0.6, 0.08]} c={c} />
              <Box p={[0.1, 0.3, 0.05]} s={[0.08, 0.1, 0.01]} c="#FDE047" />
            </Bob>
          ))}
        </group>
      ))}
      {/* the till */}
      <Box p={[0.2, 0.5, -0.4]} s={[1.2, 1.0, 0.6]} c="#A16207" />
      <Box p={[0.4, 1.12, -0.4]} s={[0.35, 0.25, 0.3]} c="#334155" />
      <Avatar3D position={[0.2, 0, -1.1]} pose="standing" shirtColor="#DC2626" hairStyle="cap" expression="neutral" />
      <Avatar3D position={[0.3, 0, 0.5]} rotation={[0, Math.PI, 0]} pose={filled ? "shrugging" : "standing"} shirtColor="#8B5CF6" hairStyle="ponytail" expression="worried" />
      {/* the empty purse, open on the counter */}
      <Box p={[-0.2, 1.03, -0.2]} rot={[0.3, 0.3, 0]} s={[0.26, 0.14, 0.06]} c="#F472B6" />
    </group>
  );
}

/* Q15 — the wind blows and the clouds gather, turning the sky grey */
export function GatheringCloudsWorld({ filled }: WorldProps) {
  const clouds = useRef<(THREE.Group | null)[]>([]);
  const k = useEase(filled, 0.4);
  const start: [number, number, number][] = [[-5, 3.2, -3], [5, 3.6, -3.5], [-3.5, 4.0, -5], [4, 2.9, -2.5], [0, 4.4, -6]];
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    clouds.current.forEach((g, i) => {
      if (!g) return;
      const e = 0.35 + 0.65 * k.current;
      g.position.set(start[i][0] * (1 - e * 0.75) + Math.sin(t * 0.4 + i) * 0.2, start[i][1], start[i][2]);
      g.children.forEach((c) => {
        const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.color.setRGB(1 - 0.35 * k.current, 1 - 0.33 * k.current, 1 - 0.28 * k.current);
      });
    });
  });
  const sway = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }) => {
    sway.current.forEach((g, i) => {
      if (g) g.rotation.z = (0.08 + 0.12 * k.current) * Math.sin(clock.getElapsedTime() * 2.4 + i);
    });
  });
  return (
    <group>
      <Ground c="#B8D8A0" />
      {start.map((p, i) => (
        <group key={i} ref={(g) => { clouds.current[i] = g; }} position={p}>
          {[[0, 0, 0, 0.7], [0.65, -0.1, 0.05, 0.5], [-0.6, -0.12, 0, 0.5], [0.2, 0.3, -0.05, 0.45]].map(([x, y, z, r], j) => (
            <mesh key={j} position={[x, y, z]}>
              <sphereGeometry args={[r, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {[[-2, -1.2], [1.8, -1.6], [-0.4, -2.4], [2.8, 0]].map(([x, z], i) => (
        <group key={i} ref={(g) => { sway.current[i] = g; }} position={[x, 0, z]}>
          <Tree p={[0, 0, 0]} />
        </group>
      ))}
      {/* a kite tugging on its string */}
      <Bob position={[0.9, 2.2, -0.5]} amp={0.25} speed={1.4}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.4, 0.4, 0.02]} />
          <Mat c="#F43F5E" />
        </mesh>
      </Bob>
      <Avatar3D position={[0.2, 0, 0.6]} rotation={[0, 0.3, 0]} pose="pointing" shirtColor="#F59E0B" hairStyle="ponytail" />
    </group>
  );
}

/* Q16 — she was giving him a lamp for his homework when the power went out */
export function PowerCutWorld({ filled }: WorldProps) {
  const bulb = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = filled ? 0.05 : t % 2.3 < 0.15 ? 0.2 : 1;
    if (bulb.current) (bulb.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.4 * flicker;
    if (lamp.current) lamp.current.intensity = filled ? 2.2 : 0.4;
  });
  return (
    <group>
      <Ground c="#E6DCCB" />
      <RoomWall c="#FEF9C3" windows={[2.2]} />
      {/* ceiling bulb that flickers, then goes out */}
      <group position={[0, 2.8, -0.8]}>
        <Cyl p={[0, 0.3, 0]} r1={0.008} h={0.6} c="#475569" seg={4} />
        <mesh ref={bulb}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#FEF3C7" emissive="#FDE047" emissiveIntensity={1.4} />
        </mesh>
      </group>
      <Table p={[-0.3, 0, -0.6]} w={1.3} d={0.7} top="#C58B4E" />
      <Box p={[-0.3, 0.77, -0.55]} s={[0.4, 0.02, 0.3]} c="#FFFFFF" />
      <Box p={[0.1, 0.8, -0.6]} s={[0.25, 0.08, 0.3]} c="#3B82F6" />
      <Box p={[-0.3, 0.4, 0.05]} s={[0.46, 0.05, 0.46]} c="#A16207" />
      <Avatar3D position={[-0.3, 0, 0.05]} rotation={[0, Math.PI, 0]} pose="sitting_studying" shirtColor="#22C55E" hairStyle="short" />
      {/* the lamp she is handing over */}
      <group position={[0.75, 0, -0.2]}>
        <Avatar3D rotation={[0, -1.3, 0]} pose="carrying" shirtColor="#A855F7" hairStyle="bun" />
        <group position={[-0.35, 1.2, 0.1]}>
          <Cyl p={[0, 0.1, 0]} r1={0.03} h={0.2} c="#64748B" seg={8} />
          <mesh position={[0, 0.25, 0]}>
            <coneGeometry args={[0.14, 0.18, 16, 1, true]} />
            <meshStandardMaterial color="#FDE68A" emissive="#FBBF24" emissiveIntensity={filled ? 1 : 0.2} side={THREE.DoubleSide} />
          </mesh>
          <pointLight ref={lamp} position={[0, 0.2, 0]} color="#FDE68A" distance={3} intensity={0.4} />
        </group>
      </group>
    </group>
  );
}

/* Q17 — diving into a task she loves: she jumps right in */
export function JumpInWorld({ filled }: WorldProps) {
  const leaves = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    leaves.current.forEach((m, i) => {
      if (!m) return;
      const k = ((t * (filled ? 0.9 : 0.4)) + i / 10) % 1;
      m.position.set(Math.cos(i * 1.7) * (0.3 + k * 0.8), 0.15 + Math.sin(k * Math.PI) * 1.1, 0.4 + Math.sin(i * 1.3) * (0.3 + k * 0.6));
      m.rotation.set(t * 3 + i, t * 2, 0);
    });
  });
  return (
    <group>
      <Ground c="#C9DDA8" />
      {/* the leaf pile she is raking up for the garden project */}
      <Ball p={[0, 0.05, 0.4]} r={0.8} c="#F59E0B" s={[1.3, 0.3, 1]} />
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} ref={(m) => { leaves.current[i] = m; }}>
          <boxGeometry args={[0.1, 0.01, 0.07]} />
          <Mat c={["#F97316", "#FBBF24", "#DC2626"][i % 3]} />
        </mesh>
      ))}
      <Avatar3D position={[0, 0.1, 0.4]} pose="jumping" shirtColor="#16A34A" hairStyle="ponytail" />
      {/* rake and wheelbarrow */}
      <Cyl p={[-1.3, 0.6, 0.2]} r1={0.02} h={1.2} c="#A16207" seg={6} rot={[0, 0, 0.3]} />
      <group position={[1.4, 0, 0]}>
        <Box p={[0, 0.4, 0]} s={[0.7, 0.3, 0.5]} c="#3B82F6" />
        <Cyl p={[0.4, 0.15, 0]} r1={0.15} h={0.06} c="#1F2937" rot={[Math.PI / 2, 0, 0]} />
      </group>
      <Tree p={[-2.4, 0, -1.8]} crown="#F59E0B" />
      <Tree p={[2.6, 0, -2.2]} crown="#EA580C" />
      <House p={[0, 0, -3.6]} />
    </group>
  );
}

/* Q18 — a weekend of study to catch up on the missed work */
export function CatchUpWorld({ filled }: WorldProps) {
  const pile = useRef<THREE.Group>(null);
  const k = useEase(filled, 0.5);
  useFrame(() => {
    if (pile.current) pile.current.scale.y = 1 - 0.6 * k.current;
  });
  return (
    <group>
      <Ground c="#E9E3F5" />
      <RoomWall c="#F5F3FF" windows={[-2.2]} />
      {/* calendar with the weekend ringed */}
      <group position={[1.6, 1.8, -2.44]}>
        <Box s={[0.9, 0.8, 0.03]} c="#FFFFFF" />
        <Box p={[0, 0.33, 0.02]} s={[0.9, 0.14, 0.01]} c="#EF4444" />
        {Array.from({ length: 14 }, (_, i) => (
          <Box key={i} p={[-0.36 + (i % 7) * 0.12, 0.12 - Math.floor(i / 7) * 0.2, 0.02]} s={[0.08, 0.1, 0.01]} c={i % 7 >= 5 ? "#FDE047" : "#E2E8F0"} />
        ))}
      </group>
      <Table p={[-0.2, 0, -0.5]} w={1.5} d={0.8} top="#C58B4E" />
      {/* the tall pile of missed work that shrinks as she catches up */}
      <group ref={pile} position={[-0.75, 0.77, -0.6]}>
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} p={[0, 0.04 + i * 0.075, 0]} rot={[0, i * 0.2, 0]} s={[0.36, 0.07, 0.26]} c={["#3B82F6", "#F43F5E", "#22C55E", "#F59E0B"][i % 4]} />
        ))}
      </group>
      <Box p={[0.05, 0.78, -0.45]} s={[0.4, 0.02, 0.3]} c="#FFFFFF" />
      <Box p={[-0.2, 0.4, 0.1]} s={[0.46, 0.05, 0.46]} c="#A16207" />
      <Avatar3D position={[-0.2, 0, 0.1]} rotation={[0, Math.PI, 0]} pose="sitting_studying" shirtColor="#6366F1" hairStyle="bun" />
      <group position={[0.5, 0.95, -0.7]}>
        <Cyl r1={0.14} h={0.04} c="#FFFFFF" rot={[Math.PI / 2, 0, 0]} />
        <Spin axis="z" speed={-4} position={[0, 0, 0.03]}>
          <Box p={[0, 0.05, 0]} s={[0.015, 0.1, 0.005]} c="#1F2937" />
        </Spin>
      </group>
    </group>
  );
}

/* Q19 — the town agrees to do away with some old traditions */
export function TraditionsWorld({ filled }: WorldProps) {
  const board = useRef<THREE.Group>(null);
  const k = useEase(filled, 0.5);
  useFrame(() => {
    if (board.current) {
      board.current.position.y = 1.4 - k.current * 0.9;
      board.current.rotation.x = -k.current * 1.2;
    }
  });
  return (
    <group>
      <Ground c="#E8E0D0" />
      {/* the old town hall */}
      <group position={[0, 0, -2.6]}>
        <Box p={[0, 1.2, 0]} s={[3.2, 2.4, 1.0]} c="#F5E6C8" />
        {[-1.2, -0.4, 0.4, 1.2].map((x) => (
          <Cyl key={x} p={[x, 1.0, 0.6]} r1={0.1} h={2.0} c="#FFFFFF" />
        ))}
        <mesh position={[0, 2.7, 0.2]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.4, 0.7, 4]} />
          <Mat c="#B45309" />
        </mesh>
      </group>
      {/* the old rule board, being taken down */}
      <group position={[-0.9, 0, -0.9]}>
        <Cyl p={[-0.5, 0.8, 0]} r1={0.04} h={1.6} c="#8B5A2B" seg={8} />
        <Cyl p={[0.5, 0.8, 0]} r1={0.04} h={1.6} c="#8B5A2B" seg={8} />
        <group ref={board} position={[0, 1.4, 0]}>
          <Box s={[1.1, 0.7, 0.05]} c="#FEF3C7" />
          {[0.18, 0.05, -0.08, -0.21].map((y) => (
            <Box key={y} p={[0, y, 0.03]} s={[0.8, 0.04, 0.01]} c="#78350F" />
          ))}
        </group>
      </group>
      <Avatar3D position={[0.5, 0, 0.3]} rotation={[0, -0.4, 0]} pose="gesturing" shirtColor="#0EA5E9" hairStyle="short" />
      <Avatar3D position={[1.4, 0, -0.3]} rotation={[0, -0.8, 0]} pose="standing" shirtColor="#F59E0B" hairStyle="bun" hairColor="#9CA3AF" hasGlasses />
      <Avatar3D position={[-2.0, 0, 0.2]} rotation={[0, 0.6, 0]} pose="standing" shirtColor="#10B981" hairStyle="cap" />
      <Flag p={[2.4, 0, -1.6]} h={2.2} c="#2563EB" />
    </group>
  );
}

/* Q20 — the inventor's workshop: gears turning, the big idea lighting up */
export function InventWorld({ filled }: WorldProps) {
  const idea = useRef<THREE.Mesh>(null);
  const k = useEase(filled, 0.8);
  useFrame(({ clock }) => {
    if (idea.current) {
      (idea.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15 + 1.6 * k.current + 0.1 * Math.sin(clock.getElapsedTime() * 4);
      idea.current.position.y = 2.2 + 0.05 * Math.sin(clock.getElapsedTime() * 2);
    }
  });
  const Gear = ({ p, r, sp, c }: { p: [number, number, number]; r: number; sp: number; c: string }) => (
    <Spin axis="z" speed={sp} position={p}>
      <Cyl r1={r} h={0.08} c={c} rot={[Math.PI / 2, 0, 0]} seg={24} />
      {Array.from({ length: 10 }, (_, i) => (
        <Box key={i} p={[Math.cos((i / 10) * Math.PI * 2) * r, Math.sin((i / 10) * Math.PI * 2) * r, 0]} rot={[0, 0, (i / 10) * Math.PI * 2]} s={[0.1, 0.08, 0.08]} c={c} />
      ))}
    </Spin>
  );
  return (
    <group>
      <Ground c="#E5E7EB" />
      <RoomWall c="#F0F9FF" windows={[-2.4]} />
      <Gear p={[-0.4, 1.8, -2.4]} r={0.4} sp={1.2} c="#F59E0B" />
      <Gear p={[0.4, 1.5, -2.4]} r={0.3} sp={-1.6} c="#3B82F6" />
      <Gear p={[1.0, 2.1, -2.4]} r={0.25} sp={1.9} c="#22C55E" />
      <Table p={[0, 0, -0.6]} w={1.6} d={0.8} top="#94A3B8" leg="#475569" />
      <Box p={[-0.4, 0.85, -0.6]} s={[0.3, 0.16, 0.3]} c="#F43F5E" />
      <Cyl p={[0.3, 0.85, -0.6]} r1={0.08} h={0.16} c="#FBBF24" />
      <mesh ref={idea} position={[0.2, 2.2, 0.1]}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#FEF9C3" emissive="#FDE047" emissiveIntensity={0.2} />
      </mesh>
      <Cyl p={[0.2, 2.0, 0.1]} r1={0.07} h={0.1} c="#94A3B8" />
      <Avatar3D position={[0.2, 0, 0.1]} pose="thinking" shirtColor="#FFFFFF" pantsColor="#334155" hairStyle="short" hairColor="#9CA3AF" hasGlasses />
    </group>
  );
}

/* Q21 — the notorious mountain road, full of dangerous potholes */
export function MountainRoadWorld({ filled }: WorldProps) {
  const car = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!car.current) return;
    const k = (clock.getElapsedTime() * (filled ? 0.12 : 0.07)) % 1;
    car.current.position.set(-2 + k * 4, 0.1 + k * 1.6 + Math.abs(Math.sin(k * 60)) * 0.06, -0.6 - k * 1.2);
    car.current.rotation.z = 0.35 + 0.08 * Math.sin(k * 60);
  });
  return (
    <group>
      <Ground c="#B9D39C" />
      <Mountain p={[1.6, 0, -4]} h={5} r={3.4} c="#8FA3B8" />
      <Mountain p={[-3.5, 0, -7]} h={4} r={3} c="#94A3B8" />
      {/* the road climbing the slope */}
      <mesh position={[0, 0.9, -1.2]} rotation={[0, 0, 0.38]} receiveShadow>
        <boxGeometry args={[4.6, 0.06, 1.0]} />
        <Mat c="#9CA3AF" r={1} />
      </mesh>
      {[-1.2, -0.2, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 0.93 + x * 0.4, -1.2 + (i - 1) * 0.2]} rotation={[-Math.PI / 2, 0, 0.38]}>
          <circleGeometry args={[0.13, 16]} />
          <meshBasicMaterial color="#374151" />
        </mesh>
      ))}
      <group ref={car}>
        <group scale={0.35}>
          <Car c="#F97316" />
        </group>
      </group>
      {/* warning sign */}
      <group position={[-1.8, 0, 0.5]}>
        <Cyl p={[0, 0.7, 0]} r1={0.03} h={1.4} c="#94A3B8" seg={8} />
        <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.3, 0.45, 3]} />
          <Mat c="#FBBF24" />
        </mesh>
        <Box p={[0, 1.48, 0.12]} s={[0.04, 0.16, 0.01]} c="#1F2937" />
      </group>
      <Avatar3D position={[-0.6, 0, 1.0]} rotation={[0, 0.3, 0]} pose="pointing" shirtColor="#DC2626" hairStyle="cap" expression="worried" />
      <Cloud3D position={[-1, 3.8, -5]} />
    </group>
  );
}

/* Q22 — a family arriving to make a new home in a new country */
export function ImmigrantsWorld({ filled }: WorldProps) {
  const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!dot.current) return;
    const k = (clock.getElapsedTime() * 0.25) % 1;
    dot.current.position.set(-1.0 + k * 2.0, 1.8 + Math.sin(k * Math.PI) * 0.35, -2.4);
  });
  return (
    <group>
      <Ground c="#EEF2F7" />
      <RoomWall c="#F8FAFC" windows={[2.4]} />
      {/* the world map with the journey drawn on it */}
      <group position={[0, 1.8, -2.46]}>
        <Box s={[2.6, 1.3, 0.03]} c="#BAE6FD" />
        {[[-0.8, 0.2, 0.7, 0.5], [0.1, 0.25, 0.5, 0.4], [0.2, -0.25, 0.4, 0.5], [0.85, 0.05, 0.6, 0.45]].map(([x, y, w, h], i) => (
          <Box key={i} p={[x, y, 0.02]} s={[w, h, 0.01]} c={["#86EFAC", "#FDE68A", "#FCA5A5", "#C4B5FD"][i]} />
        ))}
        <Ball p={[-1.0, 0, 0.04]} r={0.05} c="#DC2626" />
        <Ball p={[1.0, 0, 0.04]} r={0.05} c="#16A34A" />
      </group>
      <mesh ref={dot}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <Mat c="#1D4ED8" />
      </mesh>
      {/* the family and their luggage */}
      <Avatar3D position={[-0.9, 0, 0.3]} rotation={[0, 0.3, 0]} pose="gesturing" shirtColor="#0EA5E9" hairStyle="short" />
      <Avatar3D position={[-0.2, 0, 0.1]} pose="standing" shirtColor="#EC4899" hairStyle="bun" />
      <Avatar3D position={[0.4, 0, 0.5]} scale={0.7} pose="jumping" shirtColor="#FBBF24" hairStyle="ponytail" />
      {["#F43F5E", "#22C55E", "#8B5CF6"].map((c, i) => (
        <group key={c} position={[1.1 + i * 0.45, 0, -0.1 + i * 0.1]}>
          <Box p={[0, 0.3, 0]} s={[0.4, 0.56, 0.22]} c={c} />
          <Box p={[0, 0.62, 0]} s={[0.14, 0.05, 0.04]} c="#1F2937" />
        </group>
      ))}
      <Box p={[-2.2, 1.1, -2.4]} s={[1.0, 0.4, 0.04]} c="#16A34A" />
      <Box p={[-2.2, 1.1, -2.37]} s={[0.7, 0.1, 0.01]} c="#FFFFFF" />
      {filled && <Bunting from={[-2.9, 2.9, -2.3]} to={[2.9, 2.9, -2.3]} />}
    </group>
  );
}

/* Q23 — the shop's doors slide shut; the owner slips out the small back door */
export function ShopClosingWorld({ filled }: WorldProps) {
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const owner = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const shut = (Math.sin(t * 0.6) + 1) / 2;
    if (left.current) left.current.position.x = -0.25 - (1 - shut) * 0.4;
    if (right.current) right.current.position.x = 0.25 + (1 - shut) * 0.4;
    if (owner.current) owner.current.position.x = 1.4 + ((t * 0.25) % 1) * 2.2;
  });
  return (
    <group>
      <Ground c="#E8EDE4" />
      <group position={[0, 0, -1.6]}>
        <Box p={[0, 1.2, 0]} s={[3.0, 2.4, 1.4]} c="#FDE68A" />
        <Box p={[0, 2.25, 0.71]} s={[2.2, 0.35, 0.03]} c="#16A34A" />
        <Box p={[0, 0.7, 0.71]} s={[1.3, 1.4, 0.02]} c="#334155" />
        <mesh ref={left} position={[-0.25, 0.7, 0.73]}>
          <boxGeometry args={[0.5, 1.35, 0.03]} />
          <meshStandardMaterial color="#BFE3F7" transparent opacity={0.85} />
        </mesh>
        <mesh ref={right} position={[0.25, 0.7, 0.73]}>
          <boxGeometry args={[0.5, 1.35, 0.03]} />
          <meshStandardMaterial color="#BFE3F7" transparent opacity={0.85} />
        </mesh>
        {/* the small back door at the side */}
        <Box p={[1.51, 0.45, -0.2]} s={[0.03, 0.9, 0.5]} c="#8B5A2B" />
      </group>
      <group ref={owner} position={[1.4, 0, -1.8]}>
        <Avatar3D rotation={[0, Math.PI / 2, 0]} pose="walking" shirtColor="#475569" hairStyle="cap" hasBackpack backpackColor="#DC2626" />
      </group>
      <Avatar3D position={[-1.2, 0, 0.8]} rotation={[0, 0.5, 0]} pose={filled ? "thinking" : "standing"} shirtColor="#A855F7" hairStyle="ponytail" hasGlasses />
      <Tree p={[-2.8, 0, -1.4]} />
      <Bush p={[2.6, 0, 0.6]} />
    </group>
  );
}

/* Q24 — the detective still can't be sure whose house this is */
export function WhoseHouseWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#D6E8C8" />
      <House p={[0, 0, -1.9]} w={2.8} h={1.8} />
      {/* mailbox with no name on it */}
      <group position={[1.8, 0, -0.4]}>
        <Cyl p={[0, 0.5, 0]} r1={0.03} h={1.0} c="#64748B" seg={8} />
        <Box p={[0, 1.05, 0]} s={[0.3, 0.22, 0.4]} c="#EF4444" />
      </group>
      {[[-0.4, 2.8], [0.2, 3.1], [0.7, 2.7]].map(([x, y], i) => (
        <Bob key={i} position={[x, y, -0.8]} amp={0.12} speed={1.2 + i * 0.3}>
          <mesh>
            <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI * 1.4]} />
            <Mat c="#8B5CF6" />
          </mesh>
          <Ball p={[0, -0.2, 0]} r={0.03} c="#8B5CF6" />
        </Bob>
      ))}
      <Avatar3D position={[-0.4, 0, 0.3]} rotation={[0, 0.2, 0]} pose={filled ? "pointing" : "thinking"} shirtColor="#92400E" pantsColor="#44403C" hairStyle="hat" hasGlasses expression="neutral" />
      <Tree p={[-2.6, 0, -1.2]} />
      <Flower p={[1.2, 0, -0.9]} />
      <Flower p={[1.0, 0, -0.95]} c="#FDE047" />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

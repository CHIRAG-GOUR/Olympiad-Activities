"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "./avatar3D";
import { Bob, Cloud3D, Drift, Spin, Steam, useEase } from "./scene";
import { Ball, Bench, Box, Bush, Cyl, Flag, Flower, House, Mat, PalmTree, RoomWall, Table, Tree, Water } from "./props3D";
import type { WorldProps } from "./story";

/* Worlds for Q1–Q12 of the official paper. Each acts out its sentence. */

function Ground({ c }: { c: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[18, 64]} />
      <Mat c={c} r={0.95} />
    </mesh>
  );
}

function Road({ z = 1.4, w = 1.8 }: { z?: number; w?: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]} receiveShadow>
        <planeGeometry args={[40, w]} />
        <Mat c="#BAC3CF" r={1} />
      </mesh>
      {[-4, -2, 0, 2, 4].map((x) => (
        <Box key={x} p={[x, 0.015, z]} s={[0.8, 0.01, 0.07]} c="#FFFFFF" />
      ))}
    </group>
  );
}

/** A shop front with an awning and a hanging sign. */
function Shop({ p, wall, awning, sign, closed = false }: { p: [number, number, number]; wall: string; awning: string; sign: React.ReactNode; closed?: boolean }) {
  const board = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (board.current) board.current.rotation.z = 0.12 * Math.sin(clock.getElapsedTime() * 2 + p[0]);
  });
  return (
    <group position={p}>
      <Box p={[0, 1.1, 0]} s={[1.5, 2.2, 1.0]} c={wall} />
      <Box p={[0, 0.55, 0.51]} s={[0.9, 0.8, 0.02]} c="#BFE3F7" />
      <Box p={[0, 1.55, 0.7]} rot={[0.5, 0, 0]} s={[1.6, 0.05, 0.5]} c={awning} />
      <group position={[0, 2.35, 0.2]}>{sign}</group>
      {closed && (
        <group ref={board} position={[0, 1.15, 0.53]}>
          <Box p={[0, -0.15, 0]} s={[0.5, 0.22, 0.02]} c="#FFFFFF" />
          <Box p={[0, -0.15, 0.012]} s={[0.42, 0.06, 0.01]} c="#DC2626" />
        </group>
      )}
    </group>
  );
}

/* Q1 — every pizzeria in town is closed or no good */
export function PizzaStreetWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#E7ECF3" />
      <Road z={1.5} />
      <Shop p={[-2.1, 0, -1.4]} wall="#FDE68A" awning="#EF4444" closed sign={<Cyl r1={0.35} h={0.06} c="#F59E0B" rot={[Math.PI / 2, 0, 0]} />} />
      <Shop p={[0, 0, -1.6]} wall="#FECACA" awning="#16A34A" closed sign={<Spin speed={1.2}><Cyl r1={0.33} h={0.05} c="#FBBF24" rot={[Math.PI / 2, 0, 0]} /><Ball p={[0.1, 0.08, 0.03]} r={0.05} c="#DC2626" /><Ball p={[-0.12, -0.05, 0.03]} r={0.05} c="#DC2626" /></Spin>} />
      <Shop p={[2.1, 0, -1.4]} wall="#E0F2FE" awning="#2563EB" closed sign={<Box s={[0.7, 0.3, 0.05]} c="#FFFFFF" />} />
      <Avatar3D position={[-0.6, 0, 0.4]} rotation={[0, 0.4, 0]} pose="pointing" shirtColor="#F97316" hairStyle="short" expression={filled ? "worried" : "neutral"} />
      <Avatar3D position={[0.5, 0, 0.5]} rotation={[0, -0.5, 0]} pose={filled ? "shrugging" : "standing"} shirtColor="#8B5CF6" hairStyle="ponytail" expression="worried" />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

/* Q2 — the guest has to leave the hotel: no money left for another night */
export function HotelWorld({ filled }: WorldProps) {
  const guest = useRef<THREE.Group>(null);
  const out = useEase(filled, 0.5);
  useFrame(() => {
    if (guest.current) guest.current.position.x = 0.2 + out.current * 2.2;
  });
  return (
    <group>
      <Ground c="#F1E9DD" />
      <RoomWall c="#FFF7ED" windows={[-2.2]} />
      <Box p={[-0.8, 2.3, -2.45]} s={[1.6, 0.4, 0.04]} c="#1E3A8A" />
      <Box p={[-0.8, 2.3, -2.42]} s={[1.3, 0.1, 0.01]} c="#FDE047" />
      {/* reception desk with bell and a clerk */}
      <Box p={[-0.8, 0.55, -1.2]} s={[1.8, 1.1, 0.6]} c="#B45309" />
      <Box p={[-0.8, 1.12, -1.2]} s={[1.9, 0.05, 0.7]} c="#F5F5F4" />
      <Cyl p={[-0.3, 1.18, -1.1]} r1={0.07} r2={0.02} h={0.08} c="#D4A017" />
      <Avatar3D position={[-0.9, 0, -1.8]} pose="shaking_head" shirtColor="#0F766E" hairStyle="bun" hairColor="#1F2937" expression="neutral" />
      {/* the exit door */}
      <Box p={[2.5, 1.0, -2.44]} s={[0.9, 2.0, 0.05]} c="#22C55E" />
      <Box p={[2.5, 2.15, -2.42]} s={[0.6, 0.18, 0.02]} c="#FFFFFF" />
      <group ref={guest} position={[0.2, 0, 0.2]}>
        <Avatar3D rotation={[0, filled ? Math.PI / 2 : 0.2, 0]} pose={filled ? "walking" : "shrugging"} shirtColor="#2563EB" hairStyle="cap" expression="worried" />
        <group position={[0.35, 0, 0.15]}>
          <Box p={[0, 0.3, 0]} s={[0.42, 0.56, 0.22]} c="#F43F5E" />
          <Box p={[0, 0.63, 0]} s={[0.16, 0.05, 0.04]} c="#1F2937" />
        </group>
      </group>
      {/* an empty, open wallet */}
      <Box p={[-0.1, 1.16, -1.05]} rot={[0, 0.4, 0]} s={[0.26, 0.02, 0.18]} c="#78350F" />
    </group>
  );
}

/* Q3 — Frank and Jane rally a handball back and forth */
export function HandballWorld({ filled }: WorldProps) {
  const ball = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ball.current) return;
    const t = clock.getElapsedTime() * (filled ? 0.9 : 0.6);
    const k = (Math.sin(t * Math.PI) + 1) / 2;
    ball.current.position.set(-1.3 + k * 2.6, 1.2 + Math.sin(k * Math.PI) * 0.9, 0);
  });
  return (
    <group>
      <Ground c="#E6F1EA" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6.4, 3.4]} />
        <Mat c="#F59E0B" r={0.9} />
      </mesh>
      <Box p={[0, 0.015, 0]} s={[0.04, 0.01, 3.4]} c="#FFFFFF" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.2, 0.016, 0]}>
        <ringGeometry args={[1.2, 1.25, 32, 1, -Math.PI / 2, Math.PI]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {[-3.2, 3.2].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Box p={[0, 1.0, -0.8]} s={[0.08, 2, 0.08]} c="#FFFFFF" />
          <Box p={[0, 1.0, 0.8]} s={[0.08, 2, 0.08]} c="#FFFFFF" />
          <Box p={[0, 2.0, 0]} s={[0.08, 0.08, 1.7]} c="#FFFFFF" />
        </group>
      ))}
      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.1, 18, 18]} />
        <Mat c="#2563EB" />
      </mesh>
      <Avatar3D position={[-1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} pose="jumping" shirtColor="#22C55E" hairStyle="short" />
      <Avatar3D position={[1.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} pose="gesturing" shirtColor="#EC4899" hairStyle="ponytail" />
      <Avatar3D position={[2.3, 0, 1.3]} rotation={[0, -0.9, 0]} scale={0.9} pose="thinking" shirtColor="#64748B" hairStyle="cap" />
    </group>
  );
}

/* Q4 — a visitor from somewhere warm sees snow falling for the first time */
export function SnowWorld({ filled }: WorldProps) {
  const flakes = useRef<(THREE.Mesh | null)[]>([]);
  const seeds = useRef(Array.from({ length: 70 }, (_, i) => [((i * 41) % 70) / 10 - 3.5, ((i * 29) % 50) / 10 - 3, (i * 13) % 11] as const)).current;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    flakes.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * (filled ? 0.28 : 0.18) + seeds[i][2] / 11) % 1;
      m.position.set(seeds[i][0] + Math.sin(t + i) * 0.15, 3.4 - k * 3.4, seeds[i][1]);
    });
  });
  return (
    <group>
      <Ground c="#F8FAFC" />
      {seeds.map(([x, z], i) => (
        <mesh key={i} ref={(m) => { flakes.current[i] = m; }} position={[x, 2, z]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#E0F2FE" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* snowman */}
      <group position={[-1.3, 0, -0.8]}>
        <Ball p={[0, 0.35, 0]} r={0.38} c="#FFFFFF" />
        <Ball p={[0, 0.9, 0]} r={0.27} c="#FFFFFF" />
        <Ball p={[0, 1.3, 0]} r={0.19} c="#FFFFFF" />
        <mesh position={[0, 1.3, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.04, 0.18, 10]} />
          <Mat c="#F97316" />
        </mesh>
        <Cyl p={[0, 1.5, 0]} r1={0.14} h={0.16} c="#1F2937" />
        <Box p={[0, 1.05, 0.12]} s={[0.4, 0.06, 0.2]} c="#DC2626" />
      </group>
      {[[-2.8, -2], [2.6, -2.4], [3.3, -0.8]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <coneGeometry args={[0.5, 1.6, 8]} />
            <Mat c="#2F855A" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[0.28, 0.5, 8]} />
            <Mat c="#FFFFFF" />
          </mesh>
        </group>
      ))}
      {/* the visitor: sunhat, shorts and a suitcase with a palm-tree sticker */}
      <Avatar3D position={[0.5, 0, 0.3]} rotation={[0, -0.3, 0]} pose={filled ? "shrugging" : "standing"} shirtColor="#FB923C" pantsColor="#FDE68A" hairStyle="hat" expression="surprised" />
      <group position={[1.2, 0, 0.1]}>
        <Box p={[0, 0.3, 0]} s={[0.42, 0.56, 0.22]} c="#06B6D4" />
        <Box p={[0, 0.3, 0.115]} s={[0.18, 0.18, 0.01]} c="#FDE047" />
      </group>
      <group position={[2.4, 0, 0.6]} scale={0.45}>
        <PalmTree p={[0, 0, 0]} h={1.6} />
        <Cyl p={[0, 0.2, 0]} r1={0.35} r2={0.25} h={0.4} c="#C2410C" />
      </group>
    </group>
  );
}

/* Q5 — he gently puts the knocked-over flowers back in the vase */
export function VaseWorld({ filled }: WorldProps) {
  const bunch = useRef<THREE.Group>(null);
  const k = useEase(filled, 0.7);
  useFrame(() => {
    if (!bunch.current) return;
    const e = k.current;
    bunch.current.position.set(0.55 - 0.55 * e, 0.8 + 0.1 + Math.sin(e * Math.PI) * 0.5 + e * 0.12, 0.05 - 0.05 * e);
    bunch.current.rotation.z = (1 - e) * (Math.PI / 2 - 0.1);
  });
  return (
    <group>
      <Ground c="#F3EADF" />
      <RoomWall c="#FDF2F8" windows={[1.8]} />
      <Table p={[0, 0, 0]} w={1.6} d={0.8} top="#C58B4E" />
      {/* the vase */}
      <group position={[0, 0.77, 0]}>
        <Cyl p={[0, 0.2, 0]} r1={0.1} r2={0.16} h={0.4} c="#60A5FA" />
        <Cyl p={[0, 0.42, 0]} r1={0.08} r2={0.1} h={0.06} c="#3B82F6" />
      </group>
      {/* water spilt on the table */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.45, 0.78, 0.1]}>
        <circleGeometry args={[0.22, 20]} />
        <meshStandardMaterial color="#93C5FD" transparent opacity={0.6} />
      </mesh>
      {/* the bunch of flowers */}
      <group ref={bunch}>
        {[[-0.05, 0.3, "#F43F5E"], [0.06, 0.34, "#FBBF24"], [0, 0.4, "#A855F7"], [0.1, 0.28, "#FB7185"]].map(([x, h, c], i) => (
          <group key={i} position={[x as number, 0, 0]}>
            <Cyl p={[0, (h as number) / 2, 0]} r1={0.01} h={h as number} c="#16A34A" seg={6} />
            <Ball p={[0, h as number, 0]} r={0.06} c={c as string} />
          </group>
        ))}
      </group>
      <Avatar3D position={[0.95, 0, 0.1]} rotation={[0, -1.1, 0]} pose={filled ? "gesturing" : "kneeling"} shirtColor="#0EA5E9" hairStyle="short" expression={filled ? "happy" : "surprised"} />
    </group>
  );
}

/* Q6 — the insect is so tiny you need the magnifying glass to see it */
export function InsectWorld({ filled }: WorldProps) {
  const lens = useRef<THREE.Group>(null);
  const bug = useRef<THREE.Group>(null);
  const k = useEase(filled, 0.8);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bug.current) {
      bug.current.position.set(0.1 * Math.sin(t * 0.8), 0.86, 0.08 * Math.cos(t * 0.8));
      bug.current.rotation.y = -t * 0.8;
    }
    if (lens.current) {
      const e = k.current;
      lens.current.position.set(0.9 - e * 0.85 + 0.1 * Math.sin(t), 1.15 - e * 0.1, 0.4 - e * 0.4);
    }
  });
  return (
    <group>
      <Ground c="#E7F4E4" />
      <RoomWall c="#F0FDF4" windows={[-2]} />
      <Table p={[0, 0, 0]} w={1.6} d={0.9} top="#FFFFFF" leg="#94A3B8" />
      {/* a leaf on the table */}
      <mesh rotation={[-Math.PI / 2, 0, 0.4]} position={[0, 0.79, 0]} scale={[1, 0.55, 1]}>
        <circleGeometry args={[0.35, 24]} />
        <Mat c="#4ADE80" />
      </mesh>
      {/* the minuscule ladybird */}
      <group ref={bug}>
        <Ball r={0.018} c="#DC2626" s={[1, 0.6, 1.2]} />
        <Ball p={[0, 0.005, 0.017]} r={0.008} c="#111827" />
      </group>
      {/* magnifying glass */}
      <group ref={lens}>
        <mesh rotation={[Math.PI / 2 - 0.3, 0, 0]}>
          <torusGeometry args={[0.2, 0.025, 10, 32]} />
          <Mat c="#1F2937" m={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2 - 0.3, 0, 0]}>
          <circleGeometry args={[0.19, 32]} />
          <meshStandardMaterial color="#DBEAFE" transparent opacity={0.35} />
        </mesh>
        <Cyl p={[0.28, -0.05, 0.08]} r1={0.025} h={0.3} c="#B45309" rot={[0, 0, Math.PI / 2 - 0.3]} />
      </group>
      <Avatar3D position={[1.1, 0, 0.5]} rotation={[0, -0.9, 0]} pose="pointing" shirtColor="#FFFFFF" pantsColor="#334155" hairStyle="bun" hasGlasses expression="surprised" />
      <Box p={[-0.6, 0.8, -0.2]} s={[0.3, 0.03, 0.22]} c="#FEF3C7" />
    </group>
  );
}

/* Q7 — a meeting: nobody is persuaded by the report */
export function ReportWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#ECEFF4" />
      <RoomWall c="#F8FAFC" windows={[2.4]} />
      {/* chart board */}
      <group position={[-1.8, 0, -2.2]}>
        <Box p={[0, 1.5, 0]} s={[1.4, 1.0, 0.05]} c="#FFFFFF" />
        {[0.2, 0.45, 0.3, 0.6].map((h, i) => (
          <Box key={i} p={[-0.45 + i * 0.3, 1.1 + h / 2, 0.03]} s={[0.18, h, 0.01]} c={["#60A5FA", "#F87171", "#FBBF24", "#34D399"][i]} />
        ))}
        <Cyl p={[0, 0.5, 0]} r1={0.03} h={1.0} c="#64748B" seg={8} />
      </group>
      <Table p={[0, 0, -0.5]} w={2.2} d={0.9} top="#E2E8F0" leg="#64748B" />
      {[-0.6, 0.1, 0.7].map((x, i) => (
        <Box key={x} p={[x, 0.78, -0.5]} rot={[0, 0.2 * i, 0]} s={[0.24, 0.02, 0.32]} c="#FFFFFF" />
      ))}
      <Avatar3D position={[-0.2, 0, 0.5]} rotation={[0, Math.PI, 0]} pose="reading" shirtColor="#1D4ED8" hairStyle="short" hasGlasses expression="neutral" />
      <Avatar3D position={[-1.1, 0, -1.3]} rotation={[0, 0.5, 0]} pose={filled ? "shaking_head" : "thinking"} shirtColor="#DC2626" hairStyle="bun" expression="neutral" />
      <Avatar3D position={[0.9, 0, -1.3]} rotation={[0, -0.5, 0]} pose={filled ? "shrugging" : "standing"} shirtColor="#10B981" hairStyle="cap" expression="worried" />
    </group>
  );
}

/* Q8 — the long walk: the hiker trudges on towards the finish */
export function LongWalkWorld({ filled }: WorldProps) {
  const hiker = useRef<THREE.Group>(null);
  const k = useEase(filled, 0.35);
  useFrame(() => {
    if (hiker.current) hiker.current.position.z = 1.2 - k.current * 2.6;
  });
  return (
    <group>
      <Ground c="#BFD9A6" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -2]} receiveShadow>
        <planeGeometry args={[1.1, 30]} />
        <Mat c="#D9C7A7" r={1} />
      </mesh>
      {/* the finish arch */}
      <group position={[0, 0, -2.2]}>
        {[-0.9, 0.9].map((x) => (
          <Cyl key={x} p={[x, 1.1, 0]} r1={0.06} h={2.2} c="#EF4444" seg={10} />
        ))}
        <Box p={[0, 2.15, 0]} s={[2.0, 0.35, 0.08]} c="#EF4444" />
        <Box p={[0, 2.15, 0.05]} s={[1.3, 0.12, 0.01]} c="#FFFFFF" />
        <Flag p={[1.2, 0, 0]} h={1.6} c="#FBBF24" />
      </group>
      <group ref={hiker} position={[0, 0, 1.2]}>
        <Avatar3D rotation={[0, Math.PI, 0]} pose={filled ? "walking" : "tired"} shirtColor="#0EA5E9" hairStyle="cap" hasBackpack backpackColor="#F97316" expression="worried" />
      </group>
      {[[-1.6, -1], [1.7, -0.4], [-2.2, 0.8], [2.4, -2.4]].map(([x, z], i) => (
        <Tree key={i} p={[x, 0, z]} scale={0.9} />
      ))}
      <Bush p={[1.2, 0, 1.2]} />
      <Cloud3D position={[0, 3.6, -6]} />
    </group>
  );
}

/* Q9 — Edward and a feast of Italian food */
export function ItalianFoodWorld({ filled }: WorldProps) {
  const stack = useRef<THREE.Group>(null);
  const k = useEase(filled, 1);
  useFrame(() => {
    if (stack.current) stack.current.scale.y = 0.4 + k.current * 0.6;
  });
  return (
    <group>
      <Ground c="#F4E4D0" />
      <RoomWall c="#FFF7ED" windows={[-2, 2]} />
      <Box p={[0, 2.5, -2.44]} s={[1.6, 0.4, 0.03]} c="#16A34A" />
      <Box p={[0.53, 2.5, -2.42]} s={[0.53, 0.4, 0.02]} c="#DC2626" />
      <Box p={[0, 2.5, -2.42]} s={[0.53, 0.4, 0.02]} c="#FFFFFF" />
      <Table p={[0, 0, 0]} w={1.6} d={0.9} top="#FFFFFF" />
      {/* checked tablecloth */}
      {Array.from({ length: 16 }, (_, i) => (
        <Box key={i} p={[-0.6 + (i % 4) * 0.4, 0.765, -0.3 + Math.floor(i / 4) * 0.2]} s={[0.2, 0.005, 0.2]} c={(i + Math.floor(i / 4)) % 2 ? "#FCA5A5" : "#FFFFFF"} />
      ))}
      {/* pasta and pizza */}
      <Cyl p={[-0.1, 0.79, 0.15]} r1={0.2} h={0.03} c="#FFFFFF" />
      <Ball p={[-0.1, 0.83, 0.15]} r={0.12} c="#FCD34D" s={[1, 0.4, 1]} />
      <Ball p={[-0.08, 0.87, 0.13]} r={0.03} c="#DC2626" />
      <Cyl p={[0.45, 0.79, -0.1]} r1={0.24} h={0.02} c="#F59E0B" />
      {[[0.4, -0.05], [0.52, -0.16], [0.36, -0.2]].map(([x, z], i) => (
        <Cyl key={i} p={[x, 0.805, z]} r1={0.035} h={0.01} c="#DC2626" />
      ))}
      {/* the stack of plates he has already cleared */}
      <group ref={stack} position={[-0.6, 0.77, -0.2]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Cyl key={i} p={[0, 0.015 + i * 0.03, 0]} r1={0.16} h={0.025} c={i % 2 ? "#F1F5F9" : "#FFFFFF"} />
        ))}
      </group>
      <Box p={[0.1, 0.4, 0.8]} s={[0.46, 0.05, 0.46]} c="#C58B4E" />
      <Avatar3D position={[0.1, 0, 0.8]} rotation={[0, Math.PI, 0]} pose="sitting_eating" shirtColor="#16A34A" hairStyle="short" hairColor="#1F2937" />
      <Avatar3D position={[1.4, 0, -0.9]} rotation={[0, -0.7, 0]} pose="carrying" shirtColor="#FFFFFF" pantsColor="#1F2937" hairStyle="short" expression="happy" />
      <Steam position={[-0.1, 0.9, 0.15]} count={3} />
    </group>
  );
}

/* Q10 — Jenny at the pool: “I want to go swimming,” said Jenny. */
export function SwimWishWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#E6F4FB" />
      <Water p={[0, 0.03, -1.4]} w={6} d={2.2} c="#38BDF8" />
      <Box p={[0, 0.05, -0.25]} s={[6.2, 0.1, 0.2]} c="#F8FAFC" />
      {[-0.15, 0.15].map((x) => (
        <Cyl key={x} p={[-2.3 + x, 0.35, -0.3]} r1={0.02} h={0.6} c="#CBD5E1" seg={8} />
      ))}
      <Bob position={[1.6, 0.06, -1.3]} amp={0.04}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.07, 10, 22]} />
          <Mat c="#F97316" />
        </mesh>
      </Bob>
      <Avatar3D position={[-0.3, 0, 0.4]} rotation={[0, 0.2, 0]} pose={filled ? "jumping" : "pointing"} shirtColor="#EC4899" pantsColor="#EC4899" hairStyle="swimcap" />
      <Avatar3D position={[1.3, 0, 0.6]} rotation={[0, -0.6, 0]} pose="holding_cup" shirtColor="#FBBF24" hairStyle="short" />
      <PalmTree p={[-3, 0, 0.4]} />
      <Cloud3D position={[1, 3.8, -6]} />
    </group>
  );
}

/* Q11 — steam rising off water that is far too hot to swim in */
export function HotWaterWorld({ filled }: WorldProps) {
  const mercury = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (mercury.current) {
      const h = 0.75 + 0.05 * Math.sin(clock.getElapsedTime() * 2);
      mercury.current.scale.y = h;
      mercury.current.position.y = 0.35 + h * 0.4;
    }
  });
  return (
    <group>
      <Ground c="#E2E8F0" />
      <group position={[0, 0, -1.0]}>
        <Cyl p={[0, 0.12, 0]} r1={1.6} r2={1.7} h={0.24} c="#A8A29E" seg={36} />
        <Water p={[0, 0.25, 0]} w={3.0} round c="#7DD3FC" />
        {[[-0.8, 0.2], [0, -0.4], [0.7, 0.3], [-0.3, 0.6], [0.4, -0.8]].map(([x, z], i) => (
          <Steam key={i} position={[x, 0.3, z]} count={filled ? 5 : 3} />
        ))}
      </group>
      {/* the thermometer */}
      <group position={[1.9, 0, -0.6]}>
        <Box p={[0, 0.8, 0]} s={[0.28, 1.4, 0.06]} c="#FFFFFF" />
        <Cyl p={[0, 0.8, 0.04]} r1={0.03} h={1.1} c="#E5E7EB" seg={8} />
        <mesh ref={mercury} position={[0, 0.65, 0.05]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <Mat c="#DC2626" />
        </mesh>
        <Ball p={[0, 0.2, 0.05]} r={0.06} c="#DC2626" />
      </group>
      <Avatar3D position={[-0.9, 0, 0.7]} rotation={[0, 0.3, 0]} pose="shaking_head" shirtColor="#0EA5E9" hairStyle="short" expression="worried" />
      <Avatar3D position={[0.4, 0, 0.9]} rotation={[0, -0.3, 0]} scale={0.8} pose="pointing" shirtColor="#F43F5E" hairStyle="swimcap" expression="surprised" />
      <Rockery />
    </group>
  );
}

function Rockery() {
  return (
    <group>
      {[[-2.6, -1.4], [2.6, -2], [-2.2, 0.8]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} scale={[1.2, 0.7, 1]} castShadow>
          <dodecahedronGeometry args={[0.4, 0]} />
          <Mat c="#A8A29E" r={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* Q12 — counting the coins at the bus stop: walk if the fare is too dear */
export function BusFareWorld({ filled }: WorldProps) {
  const coins = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    coins.current.forEach((m, i) => {
      if (m) m.position.y = 1.02 + Math.abs(Math.sin(t * 2.5 + i)) * 0.12;
    });
  });
  return (
    <group>
      <Ground c="#D8E6CF" />
      <Road z={1.4} />
      <Box p={[0, 0.06, 0.2]} s={[40, 0.12, 0.3]} c="#E5E7EB" />
      {/* fare board */}
      <group position={[-1.4, 0, -0.4]}>
        <Cyl p={[0, 0.9, 0]} r1={0.03} h={1.8} c="#94A3B8" seg={8} />
        <Box p={[0, 1.8, 0.02]} s={[0.8, 0.55, 0.04]} c="#1D4ED8" />
        <Box p={[0, 1.88, 0.045]} s={[0.55, 0.08, 0.01]} c="#FDE047" />
        <Box p={[0, 1.7, 0.045]} s={[0.4, 0.08, 0.01]} c="#FFFFFF" />
      </group>
      <Avatar3D position={[0, 0, -0.2]} rotation={[0, 0.2, 0]} pose={filled ? "walking" : "carrying"} shirtColor="#F59E0B" hairStyle="ponytail" expression="neutral" />
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { coins.current[i] = m; }} position={[-0.08 + i * 0.08, 1.02, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.012, 16]} />
          <Mat c="#FBBF24" m={0.6} r={0.3} />
        </mesh>
      ))}
      {/* the shops, a walk away */}
      <House p={[2.4, 0, -3.2]} wall="#FDE68A" roof="#EF4444" />
      <Box p={[2.4, 2.4, -2.3]} s={[1.2, 0.3, 0.05]} c="#FFFFFF" />
      <Drift from={-12} to={12} speed={0.04} loop position={[0, 0, 1.5]}>
        <group>
          <Box p={[0, 0.85, 0]} s={[3.0, 1.3, 1.1]} c="#DC2626" r={0.4} />
          {[-1.0, -0.4, 0.2, 0.8].map((x) => (
            <Box key={x} p={[x, 1.15, 0.56]} s={[0.45, 0.4, 0.02]} c="#BFE3F7" />
          ))}
          {[-1.0, 1.0].map((x) => [-0.5, 0.5].map((z) => <Cyl key={`${x}${z}`} p={[x, 0.22, z]} r1={0.22} h={0.14} c="#1F2937" rot={[Math.PI / 2, 0, 0]} />))}
        </group>
      </Drift>
      <Bench p={[1.2, 0, -0.5]} />
      <Tree p={[-2.8, 0, -1.8]} />
      <Flower p={[-2.2, 0, 0.7]} />
    </group>
  );
}

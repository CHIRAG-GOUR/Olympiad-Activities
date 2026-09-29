"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "./avatar3D";
import { Bob, Cloud3D, Spin, useEase } from "./scene";
import { Ball, Bench, Birch, Box, Bush, Cyl, Flower, House, Mat, PalmTree, RiverFlow, RoomWall, Tree, Water } from "./props3D";
import type { WorldProps } from "./story";

/* Worlds for Q25–Q40 of the official paper. */

function Ground({ c }: { c: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[18, 64]} />
      <Mat c={c} r={0.95} />
    </mesh>
  );
}

/* ── Word balance lab (Q25–Q28, Q48, Q49) ─────────────────────────────
   The given word sits in a crate on the left pan. The student's tile drops
   into the right pan as a second crate; the beam always settles level, so
   the scale never hints whether the pair is right. */
export function makeBalanceWorld({ relation, crate, mood }: { relation: "same" | "opposite"; crate: string; mood: React.ComponentProps<typeof Avatar3D>["expression"] }) {
  function BalanceWorld({ filled }: WorldProps) {
    const beam = useRef<THREE.Group>(null);
    const dropIn = useRef<THREE.Group>(null);
    const k = useEase(filled, 1.2);
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const settle = filled ? 0.02 * Math.sin(t * 3) * Math.max(0, 1 - k.current) : 0.28;
      if (beam.current) beam.current.rotation.z = settle;
      if (dropIn.current) {
        dropIn.current.position.y = 0.2 + (1 - k.current) * 1.4;
        dropIn.current.scale.setScalar(Math.max(0.001, k.current));
      }
    });
    const pan = (x: number, children?: React.ReactNode) => (
      <group position={[x, 0, 0]}>
        {[-0.2, 0.2].map((dx) => (
          <Cyl key={dx} p={[dx * 0.6, -0.3, 0]} r1={0.006} h={0.6} c="#94A3B8" seg={4} rot={[0, 0, dx]} />
        ))}
        <group position={[0, -0.6, 0]}>
          <Cyl r1={0.38} r2={0.32} h={0.06} c="#FBBF24" seg={28} />
          {children}
        </group>
      </group>
    );
    return (
      <group>
        <Ground c="#EDE9FE" />
        <RoomWall c="#F5F3FF" windows={[-2.4, 2.4]} />
        {/* shelves of word crates */}
        {[-2.0, 2.0].map((x) => (
          <group key={x} position={[x, 0, -2.1]}>
            <Box p={[0, 0.9, 0]} s={[1.2, 1.8, 0.4]} c="#C4B5FD" />
            {[0.45, 1.05, 1.6].map((y) =>
              [-0.35, 0, 0.35].map((dx) => <Box key={`${y}${dx}`} p={[dx, y, 0.1]} s={[0.26, 0.26, 0.26]} c={["#F472B6", "#60A5FA", "#FBBF24"][Math.round((dx + 0.35) / 0.35)]} />)
            )}
          </group>
        ))}
        {/* the balance */}
        <group position={[0, 0, -0.6]}>
          <Cyl p={[0, 0.8, 0]} r1={0.06} r2={0.1} h={1.6} c="#7C3AED" />
          <Cyl p={[0, 0.03, 0]} r1={0.45} h={0.06} c="#7C3AED" />
          <group ref={beam} position={[0, 1.65, 0]}>
            <Box s={[2.2, 0.07, 0.1]} c="#A78BFA" />
            {pan(-1.0, <Box p={[0, 0.2, 0]} s={[0.36, 0.36, 0.36]} c={crate} />)}
            {pan(
              1.0,
              <group ref={dropIn}>
                <Box s={[0.36, 0.36, 0.36]} c={relation === "same" ? crate : "#FFFFFF"} />
                <Box p={[0, 0, 0.185]} s={[0.26, 0.08, 0.01]} c={relation === "same" ? "#FFFFFF" : crate} />
              </group>
            )}
          </group>
          {/* the = or ≠ badge on the stand */}
          <group position={[0, 1.15, 0.12]}>
            <Cyl r1={0.18} h={0.03} c="#FFFFFF" rot={[Math.PI / 2, 0, 0]} />
            <Box p={[0, 0.04, 0.02]} s={[0.16, 0.03, 0.01]} c="#7C3AED" />
            <Box p={[0, -0.04, 0.02]} s={[0.16, 0.03, 0.01]} c="#7C3AED" />
            {relation === "opposite" && <Box p={[0, 0, 0.025]} rot={[0, 0, 0.9]} s={[0.03, 0.22, 0.01]} c="#DC2626" />}
          </group>
        </group>
        <Avatar3D position={[1.6, 0, 0.5]} rotation={[0, -0.7, 0]} pose="thinking" shirtColor="#7C3AED" hairStyle="bun" hasGlasses expression={mood} />
      </group>
    );
  }
  return BalanceWorld;
}

/* Q29 — someone who is afraid of small spaces, stuck in a tiny lift */
export function TinyLiftWorld({ filled }: WorldProps) {
  const walls = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (walls.current) walls.current.scale.x = 1 - 0.05 * (Math.sin(clock.getElapsedTime() * 2) + 1);
  });
  return (
    <group>
      <Ground c="#E5E7EB" />
      <RoomWall c="#F1F5F9" />
      {/* the cramped lift */}
      <group position={[-0.9, 0, -0.9]}>
        <Box p={[0, 1.2, -0.45]} s={[1.0, 2.4, 0.05]} c="#CBD5E1" />
        <group ref={walls}>
          <Box p={[-0.5, 1.2, 0]} s={[0.05, 2.4, 0.9]} c="#E2E8F0" />
          <Box p={[0.5, 1.2, 0]} s={[0.05, 2.4, 0.9]} c="#E2E8F0" />
        </group>
        <Box p={[0, 2.42, 0]} s={[1.05, 0.05, 0.95]} c="#94A3B8" />
        <Box p={[0.35, 1.3, 0.4]} s={[0.12, 0.3, 0.02]} c="#FBBF24" />
        <Avatar3D position={[0, 0, 0]} scale={0.95} pose="shrugging" shirtColor="#F97316" hairStyle="short" expression="worried" />
      </group>
      {/* the spelling machine */}
      <group position={[1.2, 0, -0.9]}>
        <Box p={[0, 0.7, 0]} s={[1.1, 1.4, 0.7]} c="#38BDF8" />
        <Box p={[0, 1.1, 0.36]} s={[0.8, 0.35, 0.02]} c="#0F172A" />
        <Bob position={[0, 1.1, 0.38]} amp={0.01} speed={8}>
          <Box s={[0.7, 0.06, 0.01]} c={filled ? "#4ADE80" : "#FDE047"} />
        </Bob>
        {[-0.3, 0, 0.3].map((x) => (
          <Ball key={x} p={[x, 0.6, 0.37]} r={0.06} c={["#F43F5E", "#FBBF24", "#22C55E"][Math.round((x + 0.3) / 0.3)]} />
        ))}
        <Spin position={[0, 1.55, 0]} speed={3}>
          <Box s={[0.5, 0.04, 0.04]} c="#1D4ED8" />
        </Spin>
      </group>
    </group>
  );
}

/* Q30 — fanning a campfire only makes things worse */
export function FanTheFireWorld({ filled }: WorldProps) {
  const flames = useRef<(THREE.Mesh | null)[]>([]);
  const k = useEase(filled, 0.6);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    flames.current.forEach((m, i) => {
      if (!m) return;
      const s = (0.6 + 0.8 * k.current) * (1 + 0.15 * Math.sin(t * 12 + i * 2));
      m.scale.set(s, s * (1.2 + 0.2 * Math.sin(t * 9 + i)), s);
    });
  });
  return (
    <group>
      <Ground c="#D9E6C3" />
      <group position={[0, 0, -0.3]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Cyl key={i} p={[Math.cos(i) * 0.35, 0.08, Math.sin(i) * 0.35]} r1={0.1} h={0.15} c="#9CA3AF" seg={8} />
        ))}
        {[0, 1, 2].map((i) => (
          <Cyl key={i} p={[0, 0.1, 0]} r1={0.05} h={0.6} c="#7C4A1E" seg={8} rot={[Math.PI / 2, (i * Math.PI) / 3, 0]} />
        ))}
        {[["#F97316", 0, 0.22], ["#FBBF24", 0.06, 0.16], ["#EF4444", -0.07, 0.14]].map(([c, x, r], i) => (
          <mesh key={i} ref={(m) => { flames.current[i] = m; }} position={[x as number, 0.3, 0]}>
            <coneGeometry args={[r as number, 0.5, 12]} />
            <meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={0.8} />
          </mesh>
        ))}
        <pointLight position={[0, 0.6, 0]} color="#FB923C" intensity={1.5} distance={4} />
      </group>
      {/* the person fanning it */}
      <group position={[0.9, 0, 0.2]}>
        <Avatar3D rotation={[0, -1.2, 0]} pose="gesturing" shirtColor="#0EA5E9" hairStyle="cap" expression="surprised" />
      </group>
      <Avatar3D position={[-1.1, 0, 0.3]} rotation={[0, 0.9, 0]} pose="shaking_head" shirtColor="#EC4899" hairStyle="ponytail" expression="worried" />
      {/* the tent */}
      <mesh position={[-1.6, 0.55, -1.8]} rotation={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.9, 1.1, 4]} />
        <Mat c="#22C55E" />
      </mesh>
      <Tree p={[2.4, 0, -2]} />
      <Tree p={[-3, 0, -0.6]} scale={0.9} />
    </group>
  );
}

/* Q31–Q35 — the writer's dream: a modern castle by the sea, with wind turbines,
   solar panels, big windows and a retractable glass roof over a swimming stream */
export function DreamCastleWorld({ filled }: WorldProps) {
  const roofL = useRef<THREE.Mesh>(null);
  const roofR = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const open = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2;
    if (roofL.current) roofL.current.position.x = -0.35 - open * 0.55;
    if (roofR.current) roofR.current.position.x = 0.35 + open * 0.55;
  });
  const turbine = (x: number, z: number) => (
    <group position={[x, 0, z]}>
      <Cyl p={[0, 1.4, 0]} r1={0.04} r2={0.07} h={2.8} c="#F8FAFC" seg={10} />
      <Spin axis="z" speed={2.4} position={[0, 2.8, 0.08]}>
        {[0, 1, 2].map((i) => (
          <Box key={i} rot={[0, 0, (i * Math.PI * 2) / 3]} p={[0, 0, 0]} s={[0.07, 1.3, 0.02]} c="#F8FAFC" />
        ))}
      </Spin>
    </group>
  );
  return (
    <group>
      <Ground c="#E9D9A8" />
      <Water p={[0, 0.02, -7]} w={40} d={8} c="#38BDF8" />
      {/* the castle */}
      <group position={[0, 0, -1.4]}>
        <Box p={[0, 0.8, 0]} s={[2.8, 1.6, 1.8]} c="#E5E0D6" />
        {[-1.4, 1.4].map((x) => (
          <group key={x} position={[x, 0, 0.9]}>
            <Cyl p={[0, 1.2, 0]} r1={0.35} h={2.4} c="#D6CFC2" />
            <mesh position={[0, 2.65, 0]}>
              <coneGeometry args={[0.45, 0.6, 12]} />
              <Mat c="#2563EB" />
            </mesh>
          </group>
        ))}
        {/* big single-pane windows */}
        {[-0.6, 0.6].map((x) => (
          <Box key={x} p={[x, 0.9, 0.91]} s={[0.7, 0.8, 0.02]} c="#BFE3F7" />
        ))}
        {/* battlements */}
        {[-1.1, -0.66, -0.22, 0.22, 0.66, 1.1].map((x) => (
          <Box key={x} p={[x, 1.72, 0.85]} s={[0.24, 0.24, 0.12]} c="#D6CFC2" />
        ))}
        {/* the retractable glass roof over the garden */}
        <mesh ref={roofL} position={[-0.35, 1.66, 0]}>
          <boxGeometry args={[0.7, 0.04, 1.6]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.55} />
        </mesh>
        <mesh ref={roofR} position={[0.35, 1.66, 0]}>
          <boxGeometry args={[0.7, 0.04, 1.6]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.55} />
        </mesh>
        {/* solar panels */}
        {[-0.8, 0.8].map((x) => (
          <Box key={x} p={[x, 1.72, -0.6]} rot={[-0.5, 0, 0]} s={[0.6, 0.03, 0.4]} c="#1E3A8A" />
        ))}
      </group>
      {/* the garden stream you could swim along */}
      <Water p={[0.6, 0.02, 0.6]} w={0.7} d={3} c="#4FC3F7" />
      <RiverFlow p={[0.6, 0.03, 0.6]} w={0.6} len={3} />
      <Avatar3D position={[0.6, -0.1, 0.4]} rotation={[0, Math.PI, 0]} scale={0.8} pose="swimming" shirtColor="#F43F5E" hairStyle="swimcap" />
      {turbine(-2.6, -2.2)}
      {turbine(2.7, -2.6)}
      <PalmTree p={[-2.2, 0, 0.6]} />
      <Bush p={[1.6, 0, 0.9]} />
      <Flower p={[-0.6, 0, 0.9]} />
      <Flower p={[-0.4, 0, 1.1]} c="#FDE047" />
      <Avatar3D position={[-1.2, 0, 0.8]} rotation={[0, 0.4, 0]} pose={filled ? "gesturing" : "thinking"} shirtColor="#0EA5E9" hairStyle="short" />
      <Cloud3D position={[1, 3.8, -6]} />
    </group>
  );
}

/* Q36–Q40 — Casey's ivy-covered house on the edge of Baltimore, the swinging
   bench on the veranda, bossy Margaret next door, and the trip being planned */
export function CaseyWorld({ filled }: WorldProps) {
  const swing = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (swing.current) swing.current.rotation.x = 0.18 * Math.sin(clock.getElapsedTime() * 1.6);
  });
  return (
    <group>
      <Ground c="#A7D48E" />
      {/* the city on the horizon */}
      {[-4, -3.2, -2.3, -1.4, 3.5, 4.3].map((x, i) => (
        <Box key={x} p={[x, (1.4 + (i % 3) * 0.8) / 2, -8]} s={[0.7, 1.4 + (i % 3) * 0.8, 0.7]} c="#CBD5E1" />
      ))}
      {/* Casey's house, covered in ivy */}
      <group position={[-1.2, 0, -1.8]}>
        <House w={2.2} h={1.7} wall="#FDF6E3" roof="#9A3412" />
        {Array.from({ length: 14 }, (_, i) => (
          <Ball key={i} p={[-1.0 + (i % 7) * 0.33, 0.35 + Math.floor(i / 7) * 0.9 + (i % 2) * 0.2, 0.92]} r={0.16} c="#3F9142" />
        ))}
        {/* the veranda and its swinging bench */}
        <Box p={[0, 0.06, 1.3]} s={[2.4, 0.12, 0.8]} c="#C58B4E" />
        <Box p={[0, 1.9, 1.35]} s={[2.4, 0.06, 0.9]} c="#9A3412" />
        {[-1.1, 1.1].map((x) => (
          <Cyl key={x} p={[x, 1.0, 1.65]} r1={0.04} h={1.8} c="#FFFFFF" seg={8} />
        ))}
        <group ref={swing} position={[0, 1.85, 1.35]}>
          {[-0.4, 0.4].map((x) => (
            <Cyl key={x} p={[x, -0.5, 0]} r1={0.006} h={1.0} c="#64748B" seg={4} />
          ))}
          <group position={[0, -1.35, 0]}>
            <Bench p={[0, 0, 0]} w={1.0} c="#FEF3C7" />
            <Avatar3D position={[0.1, 0, 0.05]} pose={filled ? "reading" : "sitting"} scale={0.9} shirtColor="#38BDF8" pantsColor="#1E3A8A" hairStyle="ponytail" hairColor="#F5E6A8" />
          </group>
        </group>
      </group>
      {/* Margaret next door, playing doctors and nurses on her own */}
      <group position={[2.2, 0, -2.4]}>
        <House w={1.8} h={1.5} wall="#FCE7F3" roof="#BE185D" />
      </group>
      <Avatar3D position={[1.7, 0, -0.4]} rotation={[0, -0.6, 0]} pose="pointing" shirtColor="#FFFFFF" pantsColor="#BE185D" hairStyle="bun" hairColor="#78350F" expression="neutral" />
      <group position={[1.4, 0, 0.1]}>
        <Box p={[0, 0.1, 0]} s={[0.34, 0.2, 0.24]} c="#FFFFFF" />
        <Box p={[0, 0.2, 0.121]} s={[0.12, 0.04, 0.01]} c="#DC2626" />
        <Box p={[0, 0.2, 0.121]} s={[0.04, 0.12, 0.01]} c="#DC2626" />
      </group>
      {/* the wooded hills and the old log with insects under it */}
      <Tree p={[-3.4, 0, -0.4]} />
      <Birch p={[-2.8, 0, 0.8]} />
      <Cyl p={[0.2, 0.08, 1.0]} r1={0.1} h={0.9} c="#7C4A1E" seg={10} rot={[0, 0.5, Math.PI / 2]} />
      <Bob position={[0.5, 0.2, 1.2]} amp={0.03} speed={6}>
        <Ball r={0.03} c="#1F2937" s={[1, 0.6, 1.4]} />
      </Bob>
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}


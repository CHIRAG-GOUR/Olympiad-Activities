"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "./avatar3D";
import { Bob, Cloud3D, Spin, useEase } from "./scene";
import { Ball, Box, Bush, Cyl, Flower, Frame, Mat, PalmTree, RiverFlow, RoomWall, Table, Tree, Water } from "./props3D";
import type { WorldProps } from "./story";

/* Worlds for Q41–Q50 of the official paper — mostly conversations. */

function Ground({ c }: { c: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[18, 64]} />
      <Mat c={c} r={0.95} />
    </mesh>
  );
}

function Sofa({ p, rot = 0, c = "#60A5FA" }: { p: [number, number, number]; rot?: number; c?: string }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Box p={[0, 0.25, 0]} s={[1.6, 0.5, 0.7]} c={c} />
      <Box p={[0, 0.7, -0.3]} s={[1.6, 0.6, 0.15]} c={c} />
      {[-0.8, 0.8].map((x) => (
        <Box key={x} p={[x, 0.45, 0]} s={[0.15, 0.5, 0.7]} c={c} />
      ))}
      <Box p={[0, 0.52, 0.02]} s={[1.4, 0.06, 0.6]} c="#DBEAFE" />
    </group>
  );
}

/* Q41 — Henry begs to go to the match; Mum says: not a chance */
export function MatchPleaWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#EFE6D8" />
      <RoomWall c="#FFF7ED" windows={[-2.2]} />
      {/* a calendar full of Sundays */}
      <group position={[1.4, 1.8, -2.44]}>
        <Box s={[1.0, 0.9, 0.03]} c="#FFFFFF" />
        <Box p={[0, 0.37, 0.02]} s={[1.0, 0.16, 0.01]} c="#2563EB" />
        {Array.from({ length: 21 }, (_, i) => (
          <Box key={i} p={[-0.39 + (i % 7) * 0.13, 0.15 - Math.floor(i / 7) * 0.2, 0.02]} s={[0.09, 0.12, 0.01]} c={i % 7 === 6 ? "#F87171" : "#E2E8F0"} />
        ))}
      </group>
      <Sofa p={[-1.4, 0, -1.6]} />
      {/* Henry with his football scarf and ball */}
      <Avatar3D position={[-0.5, 0, 0.3]} rotation={[0, 0.6, 0]} pose={filled ? "tired" : "gesturing"} shirtColor="#DC2626" hairStyle="short" expression={filled ? "worried" : "happy"} />
      <Bob position={[-0.9, 0.12, 0.7]} amp={0.06} speed={3}>
        <Ball r={0.12} c="#FFFFFF" />
      </Bob>
      <Avatar3D position={[0.7, 0, 0.1]} rotation={[0, -0.6, 0]} pose="shaking_head" shirtColor="#7C3AED" hairStyle="bun" hairColor="#3B2314" expression="neutral" />
    </group>
  );
}

/* Q42 — Dimitri stayed out late and is exhausted today */
export function TiredMorningWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#E8EEF5" />
      <RoomWall c="#F0F9FF" windows={[1.8]} />
      {/* the unmade bed he left too late last night */}
      <group position={[-1.6, 0, -1.6]}>
        <Box p={[0, 0.25, 0]} s={[1.2, 0.5, 2.0]} c="#A16207" />
        <Box p={[0, 0.55, 0.1]} s={[1.1, 0.14, 1.8]} c="#BFDBFE" />
        <Box p={[0, 0.66, -0.7]} s={[0.6, 0.12, 0.3]} c="#FFFFFF" />
      </group>
      {/* the clock showing how late it got */}
      <group position={[0.2, 2.2, -2.44]}>
        <Cyl r1={0.28} h={0.04} c="#FFFFFF" rot={[Math.PI / 2, 0, 0]} />
        <Spin axis="z" speed={-3} position={[0, 0, 0.03]}>
          <Box p={[0, 0.1, 0]} s={[0.02, 0.2, 0.01]} c="#DC2626" />
        </Spin>
        <Box p={[0, 0.06, 0.03]} s={[0.03, 0.12, 0.01]} c="#1F2937" />
      </group>
      <Avatar3D position={[0.3, 0, 0.3]} pose="tired" shirtColor="#475569" hairStyle="short" hairColor="#111827" expression="worried" />
      {/* floating Z's */}
      {[0, 1, 2].map((i) => (
        <Bob key={i} position={[0.6 + i * 0.2, 2.1 + i * 0.25, 0.3]} amp={0.08} speed={1 + i * 0.4}>
          <Box s={[0.12 - i * 0.02, 0.02, 0.01]} c="#6366F1" />
        </Bob>
      ))}
      <Avatar3D position={[1.5, 0, -0.4]} rotation={[0, -0.7, 0]} pose={filled ? "shaking_head" : "holding_cup"} shirtColor="#F59E0B" hairStyle="ponytail" />
    </group>
  );
}

/* Q43 — Aunty needs the tray carried through; her nephew is mid-page */
export function LivingRoomWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#EEE5D5" />
      <RoomWall c="#FEF3C7" windows={[-2.4]} />
      <Frame p={[0.6, 1.8, -2.45]} />
      {/* doorway to the living room */}
      <Box p={[2.2, 1.0, -2.44]} s={[0.9, 2.0, 0.04]} c="#FFFFFF" />
      <Box p={[2.2, 1.0, -2.42]} s={[0.75, 1.9, 0.02]} c="#E0F2FE" />
      <Sofa p={[-1.2, 0, -1.2]} c="#34D399" />
      <Avatar3D position={[-1.2, 0.05, -1.05]} pose={filled ? "reading" : "sitting"} shirtColor="#2563EB" hairStyle="short" />
      <Avatar3D position={[0.9, 0, 0.1]} rotation={[0, -0.8, 0]} pose="carrying" shirtColor="#DB2777" hairStyle="bun" hairColor="#374151" expression="neutral" />
      <Table p={[0.2, 0, -0.9]} w={0.8} d={0.5} h={0.45} top="#C58B4E" />
    </group>
  );
}

/* Q44 — Amanda holds up something baffling; June has no idea either */
export function PuzzledWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#E4ECF5" />
      <RoomWall c="#F8FAFC" windows={[0]} />
      {/* the mysterious gadget, humming on the table */}
      <Table p={[0, 0, -0.9]} w={1.2} d={0.7} top="#E2E8F0" leg="#64748B" />
      <Spin position={[0, 1.0, -0.9]} speed={2}>
        <mesh>
          <torusKnotGeometry args={[0.14, 0.04, 64, 8]} />
          <Mat c="#A855F7" m={0.4} r={0.3} />
        </mesh>
      </Spin>
      {[[-0.3, 2.3], [0.2, 2.5], [0.6, 2.2]].map(([x, y], i) => (
        <Bob key={i} position={[x, y, -0.4]} amp={0.1} speed={1.4 + i * 0.3}>
          <mesh>
            <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI * 1.4]} />
            <Mat c="#F59E0B" />
          </mesh>
          <Ball p={[0, -0.16, 0]} r={0.025} c="#F59E0B" />
        </Bob>
      ))}
      <Avatar3D position={[-0.8, 0, 0.3]} rotation={[0, 0.6, 0]} pose="pointing" shirtColor="#14B8A6" hairStyle="ponytail" expression="surprised" />
      <Avatar3D position={[0.8, 0, 0.3]} rotation={[0, -0.6, 0]} pose={filled ? "shrugging" : "thinking"} shirtColor="#F43F5E" hairStyle="bun" expression="neutral" />
    </group>
  );
}

/* Q45 — the guys struggle with a heavy crate; Eugene says leave them be */
export function HeavyCrateWorld({ filled }: WorldProps) {
  const crate = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (crate.current) {
      const t = clock.getElapsedTime();
      crate.current.position.y = 0.3 + Math.max(0, Math.sin(t * 2)) * 0.08;
      crate.current.rotation.z = 0.05 * Math.sin(t * 4);
    }
  });
  return (
    <group>
      <Ground c="#D6E6C6" />
      <group ref={crate} position={[-1.2, 0.3, -1.0]}>
        <Box s={[0.9, 0.6, 0.6]} c="#B45309" />
        <Box p={[0, 0, 0.31]} s={[0.8, 0.05, 0.01]} c="#78350F" />
      </group>
      <Avatar3D position={[-1.8, 0, -1.0]} rotation={[0, Math.PI / 2, 0]} pose="carrying" shirtColor="#EF4444" hairStyle="cap" expression="worried" />
      <Avatar3D position={[-0.6, 0, -1.0]} rotation={[0, -Math.PI / 2, 0]} pose="carrying" shirtColor="#3B82F6" hairStyle="short" expression="worried" />
      <Avatar3D position={[0.7, 0, 0.5]} rotation={[0, -0.4, 0]} pose={filled ? "shrugging" : "pointing"} shirtColor="#22C55E" hairStyle="short" hairColor="#1F2937" />
      <Avatar3D position={[1.5, 0, 0.2]} rotation={[0, -0.8, 0]} pose="thinking" shirtColor="#F59E0B" hairStyle="ponytail" />
      <Tree p={[2.6, 0, -2]} />
      <Bush p={[-2.8, 0, 0.4]} />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

/* Q46 — at the drawing board: “No offence, but that's not quite what I want” */
export function DesignDeskWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#ECEFF4" />
      <RoomWall c="#F8FAFC" windows={[-2.4, 2.4]} />
      {/* the drawing board with a sketch */}
      <group position={[0, 0, -1.2]}>
        <Cyl p={[0, 0.5, 0]} r1={0.05} h={1.0} c="#64748B" seg={8} />
        <group position={[0, 1.2, 0]} rotation={[-0.5, 0, 0]}>
          <Box s={[1.3, 0.9, 0.04]} c="#FFFFFF" />
          <Box p={[-0.2, 0.1, 0.03]} s={[0.5, 0.35, 0.01]} c="#BFDBFE" />
          <Box p={[0.35, -0.2, 0.03]} s={[0.3, 0.2, 0.01]} c="#FDE68A" />
          <Box p={[0, -0.32, 0.03]} s={[1.0, 0.02, 0.01]} c="#1F2937" />
        </group>
      </group>
      <Avatar3D position={[-0.9, 0, -0.2]} rotation={[0, 0.7, 0]} pose={filled ? "shrugging" : "pointing"} shirtColor="#6366F1" hairStyle="short" hasGlasses expression="neutral" />
      <Avatar3D position={[0.9, 0, 0.2]} rotation={[0, -0.8, 0]} pose="gesturing" shirtColor="#F97316" hairStyle="bun" expression="worried" />
      {/* crumpled drafts */}
      {[[-0.3, 0.6], [0.2, 0.9], [-0.6, 1.0]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} castShadow>
          <icosahedronGeometry args={[0.08, 0]} />
          <Mat c="#F8FAFC" />
        </mesh>
      ))}
    </group>
  );
}

/* Q47 — next week: no class, just lying on a beach */
export function BeachDaydreamWorld({ filled }: WorldProps) {
  return (
    <group>
      <Ground c="#F7E3A1" />
      <Water p={[0, 0.02, -6]} w={40} d={9} c="#38BDF8" />
      <group position={[0.4, 0, -0.3]} rotation={[0, 0, 0.1]}>
        <Cyl p={[0, 1.1, 0]} r1={0.03} h={2.2} c="#E2E8F0" seg={8} />
        <mesh position={[0, 2.1, 0]} castShadow>
          <coneGeometry args={[1.0, 0.35, 16, 1, true]} />
          <meshStandardMaterial color="#F43F5E" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <Box p={[-0.2, 0.01, 0.1]} s={[0.7, 0.02, 1.5]} c="#22D3EE" />
      <Avatar3D position={[-0.2, 0, -0.3]} rotation={[0, Math.PI, 0]} pose="lying" shirtColor="#FBBF24" pantsColor="#0EA5E9" hairStyle="short" hasGlasses />
      <Cyl p={[0.5, 0.12, 0.6]} r1={0.08} h={0.24} c="#F97316" />
      {/* the classroom desk left behind, fading into the distance */}
      <group position={[-2.6, 0, -1.5]} rotation={[0, 0.4, 0]}>
        <Table w={0.8} d={0.5} h={0.7} top="#F5DEB3" leg="#64748B" />
        <Box p={[0, 0.74, 0]} s={[0.3, 0.02, 0.22]} c="#FFFFFF" />
      </group>
      <PalmTree p={[2.6, 0, -0.8]} />
      <Bob position={[1.6, 0.06, -2.8]} amp={0.06}>
        <Box s={[0.7, 0.16, 0.3]} c="#F97316" />
      </Bob>
      <Cloud3D position={[0, 3.8, -6]} />
      {filled && <Cloud3D position={[-2, 3.4, -5]} scale={0.7} />}
    </group>
  );
}

/* Q50 — Felix lost a shoe in the stream and has to manage barefoot */
export function BarefootWorld({ filled }: WorldProps) {
  const shoe = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!shoe.current) return;
    const k = (clock.getElapsedTime() * 0.12) % 1;
    shoe.current.position.set(1.4 + Math.sin(k * 8) * 0.1, 0.06, -4 + k * 5);
    shoe.current.rotation.y = k * 6;
  });
  const walk = useEase(filled, 0.5);
  const felix = useRef<THREE.Group>(null);
  useFrame(() => {
    if (felix.current) felix.current.position.z = 0.4 - walk.current * 0.6;
  });
  return (
    <group>
      <Ground c="#A7D48E" />
      <Water p={[1.4, 0.015, 0]} w={1.2} d={40} c="#4FB3E8" />
      <RiverFlow p={[1.4, 0.03, 0]} w={1.0} len={10} />
      <group ref={shoe}>
        <Box p={[0, 0.04, 0]} s={[0.12, 0.08, 0.24]} c="#DC2626" />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.6, 0.01, 0]} receiveShadow>
        <planeGeometry args={[1.0, 30]} />
        <Mat c="#D9C7A7" r={1} />
      </mesh>
      {/* sharp little stones on the path */}
      {[[-0.8, 0.6], [-0.4, -0.2], [-0.7, -1.0], [-0.3, 1.1]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.03, z]}>
          <dodecahedronGeometry args={[0.05, 0]} />
          <Mat c="#9CA3AF" />
        </mesh>
      ))}
      <group ref={felix} position={[-0.6, 0, 0.4]}>
        <Avatar3D rotation={[0, Math.PI, 0]} pose={filled ? "walking" : "pointing"} shirtColor="#0EA5E9" pantsColor="#334155" hairStyle="short" expression="worried" />
      </group>
      <Avatar3D position={[-1.6, 0, -0.2]} rotation={[0, 0.8, 0]} pose="gesturing" shirtColor="#F59E0B" hairStyle="ponytail" />
      <Tree p={[-2.8, 0, -1.8]} />
      <Tree p={[3.0, 0, -2.2]} />
      <Flower p={[-1.9, 0, 1.0]} />
    </group>
  );
}

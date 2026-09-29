"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "./avatar3D";
import { Bob, Cloud3D, Spin, Steam, Drift, phaseOf } from "./scene";
import {
  Ball, Balloon, Beaver, Bench, Bicycle, Birch, Box, Bunting, Bush, Car, Cyl, Dog, Fish, Flag, Flower, Frame,
  House, Mat, Mountain, PalmTree, RiverFlow, Rock, RoomWall, Table, Tree, Water,
} from "./props3D";

/* ══════════════════════════════════════════════════════════════════════
   Scenes for Q16–Q50 of the English paper. Each keeps the open space where
   its question places its own characters (mostly front-left and front-right).
   ══════════════════════════════════════════════════════════════════════ */

type P = { position?: [number, number, number] };

function Ground({ c, r = 18 }: { c: string; r?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[r, 64]} />
      <Mat c={c} r={0.95} />
    </mesh>
  );
}

function Chair({ p, rot = 0, c = "#C58B4E", cushion = "#F59E0B" }: { p: [number, number, number]; rot?: number; c?: string; cushion?: string }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Box p={[0, 0.46, 0]} s={[0.46, 0.05, 0.46]} c={c} />
      <Box p={[0, 0.5, 0]} s={[0.4, 0.04, 0.4]} c={cushion} />
      <Box p={[0, 0.8, -0.21]} s={[0.46, 0.5, 0.05]} c={c} />
      {[[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].map(([x, z], i) => (
        <Cyl key={i} p={[x, 0.22, z]} r1={0.025} h={0.44} c={c} seg={8} />
      ))}
    </group>
  );
}

/** A swing whose seat and rider swing back and forth. */
function Swing({ p }: { p: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.x = 0.45 * Math.sin(clock.getElapsedTime() * 1.8);
  });
  return (
    <group position={p}>
      {[-0.7, 0.7].map((x) => (
        <group key={x}>
          <Cyl p={[x, 0.95, 0.35]} r1={0.04} h={2.0} c="#EF4444" seg={8} rot={[-0.35, 0, 0]} />
          <Cyl p={[x, 0.95, -0.35]} r1={0.04} h={2.0} c="#EF4444" seg={8} rot={[0.35, 0, 0]} />
        </group>
      ))}
      <Cyl p={[0, 1.88, 0]} r1={0.05} h={1.5} c="#EF4444" seg={8} rot={[0, 0, Math.PI / 2]} />
      <group ref={g} position={[0, 1.88, 0]}>
        {[-0.18, 0.18].map((x) => (
          <Cyl key={x} p={[x, -0.6, 0]} r1={0.008} h={1.2} c="#64748B" seg={4} />
        ))}
        <Box p={[0, -1.2, 0]} s={[0.46, 0.05, 0.22]} c="#FBBF24" />
        <Avatar3D position={[0, -1.6, 0]} scale={0.7} pose="sitting" shirtColor="#EF4444" hairStyle="ponytail" />
      </group>
    </group>
  );
}

/* Q16 — the playground whose grass has worn away to bare soil */
export function PlaygroundPark3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#7CCB6B" />
      {/* the bare patch where grass used to be */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.2]} receiveShadow>
        <circleGeometry args={[1.7, 40]} />
        <Mat c="#B98B5B" r={1} />
      </mesh>
      {[[-0.6, 0.5], [0.5, -0.2], [0.9, 0.8], [-1.1, -0.3]].map(([x, z], i) => (
        <Rock key={i} p={[x, 0.03, z]} s={0.18} c="#9C7B57" />
      ))}
      <Swing p={[-0.6, 0, -1.4]} />
      {/* slide */}
      <group position={[1.8, 0, -1.2]} rotation={[0, -0.5, 0]}>
        <Box p={[0, 0.6, -0.5]} s={[0.5, 1.2, 0.08]} c="#38BDF8" />
        <Box p={[0, 1.2, -0.3]} s={[0.5, 0.06, 0.5]} c="#38BDF8" />
        <Box p={[0, 0.62, 0.45]} rot={[0.85, 0, 0]} s={[0.46, 0.05, 1.6]} c="#FDE047" />
      </group>
      <Tree p={[-2.6, 0, -2.2]} />
      <Tree p={[2.8, 0, -2.6]} scale={1.2} />
      <Bush p={[-2.2, 0, 0.6]} />
      <Bush p={[2.4, 0, 0.9]} s={0.8} />
      <Cloud3D position={[-2, 3.4, -5]} />
      <Cloud3D position={[2.5, 3.8, -6]} scale={0.8} />
    </group>
  );
}

/* Q17 — seaside holiday: waves, parasol, sandcastle and an ice-cream */
export function BeachSeaside3D({ position = [0, 0, 0] }: P) {
  const wave = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (wave.current) wave.current.position.z = -1.35 + 0.18 * Math.sin(clock.getElapsedTime() * 1.2);
  });
  return (
    <group position={position}>
      <Ground c="#F7E3A1" />
      <Water p={[0, 0.02, -6]} w={40} d={9} c="#38BDF8" />
      <mesh ref={wave} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -1.4]}>
        <planeGeometry args={[40, 0.35]} />
        <meshBasicMaterial color="#F0FBFF" transparent opacity={0.85} />
      </mesh>
      {/* parasol */}
      <group position={[1.3, 0, -0.3]} rotation={[0, 0, 0.12]}>
        <Cyl p={[0, 1.1, 0]} r1={0.03} h={2.2} c="#E2E8F0" seg={8} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh key={i} position={[0, 2.1, 0]} rotation={[0, (i * Math.PI) / 4, 0]} castShadow>
            <coneGeometry args={[1.0, 0.35, 2, 1, true, 0, Math.PI / 4]} />
            <meshStandardMaterial color={i % 2 ? "#FFFFFF" : "#F43F5E"} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      {/* towel and sandcastle */}
      <Box p={[1.3, 0.01, 0.3]} s={[0.7, 0.02, 1.2]} c="#22D3EE" />
      <group position={[-1.4, 0, 0.2]}>
        <Cyl p={[0, 0.15, 0]} r1={0.3} r2={0.35} h={0.3} c="#E8C87A" />
        <Cyl p={[0, 0.4, 0]} r1={0.18} r2={0.22} h={0.2} c="#E8C87A" />
        <Flag p={[0, 0.5, 0]} h={0.35} c="#F43F5E" />
        <Cyl p={[0.5, 0.1, 0.2]} r1={0.1} r2={0.08} h={0.2} c="#F97316" />
      </group>
      <Avatar3D position={[-0.2, 0, 0.1]} rotation={[0, 0.2, 0]} pose="holding_cone" shirtColor="#06B6D4" pantsColor="#F59E0B" hairStyle="cap" hairColor="#F97316" />
      <Bob position={[-2.8, 0.08, -3]} amp={0.06}>
        <Box s={[0.6, 0.16, 0.3]} c="#F97316" />
      </Bob>
      <PalmTree p={[-3.2, 0, -1.2]} />
      <Cloud3D position={[1.5, 3.6, -6]} />
    </group>
  );
}

/* Q19 — a lady on a park bench by the clock tower, the hands turning */
export function ParkBenchClock3D({ position = [0, 0, 0] }: P) {
  const minute = useRef<THREE.Group>(null);
  const hour = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (minute.current) minute.current.rotation.z = -t * 0.9;
    if (hour.current) hour.current.rotation.z = -t * 0.075;
  });
  return (
    <group position={position}>
      <Ground c="#9ED28A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 1.2]} />
        <Mat c="#E7DCC8" r={1} />
      </mesh>
      {/* clock tower */}
      <group position={[-1.3, 0, -1.8]}>
        <Box p={[0, 1.3, 0]} s={[0.8, 2.6, 0.8]} c="#E8D5B5" />
        <mesh position={[0, 2.95, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.72, 0.7, 4]} />
          <Mat c="#B45309" />
        </mesh>
        <group position={[0, 2.1, 0.41]}>
          <Cyl r1={0.3} h={0.03} c="#FFFFFF" rot={[Math.PI / 2, 0, 0]} seg={32} />
          <group ref={hour} position={[0, 0, 0.03]}>
            <Box p={[0, 0.08, 0]} s={[0.03, 0.16, 0.01]} c="#1F2937" />
          </group>
          <group ref={minute} position={[0, 0, 0.04]}>
            <Box p={[0, 0.12, 0]} s={[0.02, 0.24, 0.01]} c="#DC2626" />
          </group>
        </group>
      </group>
      <Bench p={[0.9, 0, -0.1]} rot={[0, -0.25, 0]} />
      <Avatar3D position={[0.75, 0, -0.08]} rotation={[0, -0.25, 0]} pose="sitting" shirtColor="#8B5CF6" pantsColor="#4C1D95" hairStyle="bun" hairColor="#9CA3AF" hasGlasses expression="neutral" />
      <Tree p={[2.6, 0, -2.2]} />
      <Tree p={[-3, 0, -0.6]} scale={0.9} />
      {[[-0.2, 0.6], [0.2, 0.9]].map(([x, z], i) => (
        <Bob key={i} position={[x, 0.08, z]} amp={0.04} speed={6}>
          <Ball r={0.08} c="#94A3B8" s={[1, 0.9, 1.3]} />
          <Ball p={[0, 0.08, 0.07]} r={0.045} c="#64748B" />
        </Bob>
      ))}
      <Cloud3D position={[0.5, 3.6, -6]} />
    </group>
  );
}

/* Q20 — a gift on the table, balloons bobbing, the lid lifting */
export function GiftUnboxing3D({ position = [0, 0, 0] }: P) {
  const lid = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (lid.current) lid.current.position.y = 0.34 + Math.max(0, Math.sin(clock.getElapsedTime() * 1.4)) * 0.12;
  });
  return (
    <group position={position}>
      <Ground c="#FDF3D7" />
      <RoomWall c="#FDE8F0" windows={[-1.8, 1.8]} />
      <Bunting from={[-3, 2.6, -2.4]} to={[3, 2.6, -2.4]} />
      <Table p={[-0.2, 0, -0.4]} w={1.4} d={0.8} top="#F9A8D4" />
      <group position={[-0.2, 0.75, -0.4]}>
        <Box p={[0, 0.16, 0]} s={[0.5, 0.32, 0.5]} c="#DC2626" />
        <Box p={[0, 0.16, 0]} s={[0.52, 0.33, 0.1]} c="#FBBF24" />
        <Box p={[0, 0.16, 0]} s={[0.1, 0.33, 0.52]} c="#FBBF24" />
        <group ref={lid} position={[0, 0.34, 0]}>
          <Box s={[0.56, 0.08, 0.56]} c="#EF4444" />
          <Ball p={[-0.08, 0.08, 0]} r={0.07} c="#FBBF24" s={[1.3, 0.7, 0.8]} />
          <Ball p={[0.08, 0.08, 0]} r={0.07} c="#FBBF24" s={[1.3, 0.7, 0.8]} />
        </group>
      </group>
      <Balloon p={[-1.3, 1.8, -0.9]} c="#F43F5E" />
      <Balloon p={[-1.0, 2.0, -1.1]} c="#3B82F6" />
      <Balloon p={[-1.55, 2.1, -1.2]} c="#FBBF24" />
      <Avatar3D position={[0.9, 0, 0.3]} rotation={[0, -0.6, 0]} pose="gesturing" shirtColor="#9333EA" hairStyle="short" expression="surprised" />
    </group>
  );
}

/* Q21 — an art studio: a finished picture on the wall and a blank canvas to copy it on */
export function ArtStudio3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#E6C9A0" />
      <RoomWall c="#F5F3FF" windows={[2.2]} />
      <Frame p={[-0.4, 1.7, -2.45]} w={1.2} h={0.85} />
      {/* easel with the copy in progress */}
      <group position={[-0.4, 0, -0.6]}>
        {[-0.35, 0.35].map((x) => (
          <Cyl key={x} p={[x, 0.75, 0]} r1={0.03} h={1.5} c="#A16207" seg={8} rot={[0, 0, x > 0 ? 0.12 : -0.12]} />
        ))}
        <Cyl p={[0, 0.75, -0.35]} r1={0.03} h={1.5} c="#A16207" seg={8} rot={[-0.35, 0, 0]} />
        <Box p={[0, 1.2, 0.02]} s={[0.95, 0.75, 0.04]} c="#FFFFFF" />
        <Ball p={[0.2, 1.33, 0.05]} r={0.07} c="#FDE047" />
        <mesh position={[-0.08, 1.12, 0.05]}>
          <coneGeometry args={[0.18, 0.28, 3]} />
          <Mat c="#F97316" />
        </mesh>
        <Box p={[0, 0.8, 0.12]} s={[1.0, 0.05, 0.16]} c="#A16207" />
      </group>
      {/* palette and paint pots */}
      <Table p={[-1.9, 0, -0.5]} w={0.9} d={0.6} top="#F1F5F9" />
      {["#EF4444", "#3B82F6", "#FDE047", "#22C55E"].map((c, i) => (
        <Cyl key={c} p={[-2.2 + i * 0.2, 0.83, -0.5]} r1={0.06} h={0.14} c={c} />
      ))}
      <Bob position={[-1.9, 0.78, -0.3]} amp={0.02}>
        <Cyl r1={0.2} h={0.02} c="#E7C29A" />
      </Bob>
    </group>
  );
}

/* Q22 & Q39 — a party table with a cake whose candle flickers */
export function GrandBanquetHall3D({ position = [0, 0, 0] }: P) {
  const flame = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (flame.current) flame.current.scale.set(1, 1 + 0.25 * Math.sin(clock.getElapsedTime() * 18), 1);
  });
  return (
    <group position={position}>
      <Ground c="#F1ECE4" />
      <RoomWall c="#FFF4E6" windows={[-2, 2]} />
      <Bunting from={[-3, 2.7, -2.4]} to={[3, 2.7, -2.4]} />
      <Table p={[0, 0, -0.3]} w={2.2} d={1.0} top="#FFFFFF" />
      <group position={[0, 0.75, -0.3]}>
        <Cyl p={[0, 0.12, 0]} r1={0.32} h={0.24} c="#FDE7C8" seg={32} />
        <Cyl p={[0, 0.33, 0]} r1={0.22} h={0.18} c="#F9A8D4" seg={32} />
        <Cyl p={[0, 0.5, 0]} r1={0.015} h={0.16} c="#60A5FA" seg={6} />
        <mesh ref={flame} position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color="#FDBA74" emissive="#FB923C" emissiveIntensity={1.4} />
        </mesh>
        {[-0.75, 0.75].map((x) => (
          <group key={x}>
            <Cyl p={[x, 0.01, 0.15]} r1={0.16} h={0.02} c="#FFFFFF" />
            <Box p={[x, 0.05, 0.15]} s={[0.12, 0.07, 0.1]} c="#F9A8D4" />
          </group>
        ))}
        <Cyl p={[0.45, 0.1, -0.25]} r1={0.05} h={0.2} c="#FCA5A5" />
      </group>
      <Chair p={[-1.35, 0, -0.3]} rot={Math.PI / 2} cushion="#F43F5E" />
      <Avatar3D position={[-1.3, 0, -0.3]} rotation={[0, Math.PI / 2, 0]} pose="sitting" shirtColor="#F43F5E" hairStyle="short" expression="worried" />
      <Balloon p={[2.1, 2.0, -1.5]} c="#A855F7" />
      <Balloon p={[2.4, 1.8, -1.2]} c="#FBBF24" />
    </group>
  );
}

/* Q23 — a music room: the speaker cone pulses and faint sound rings spread out */
export function AcousticSoundLab3D({ position = [0, 0, 0] }: P) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const cone = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    rings.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.35 + i / 3) % 1;
      m.scale.setScalar(0.3 + k * 1.6);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - k);
    });
    if (cone.current) cone.current.scale.setScalar(1 + 0.03 * Math.sin(t * 20));
  });
  return (
    <group position={position}>
      <Ground c="#EDE9FE" />
      <RoomWall c="#F3F0FF" />
      {/* foam panels */}
      {[-2, -1, 0, 1, 2].map((x) => (
        <Box key={x} p={[x * 0.7, 1.7, -2.45]} s={[0.6, 0.6, 0.06]} c={x % 2 ? "#C4B5FD" : "#DDD6FE"} />
      ))}
      <group position={[-0.8, 0, -1.2]}>
        <Box p={[0, 0.55, 0]} s={[0.6, 1.1, 0.5]} c="#475569" />
        <mesh ref={cone} position={[0, 0.7, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
          <Mat c="#1F2937" />
        </mesh>
        <Cyl p={[0, 0.3, 0.26]} r1={0.08} h={0.02} c="#1F2937" rot={[Math.PI / 2, 0, 0]} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} ref={(m) => { rings.current[i] = m; }} position={[0, 0.7, 0.3]}>
            <torusGeometry args={[0.3, 0.01, 6, 36]} />
            <meshBasicMaterial color="#8B5CF6" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
      <Table p={[0.4, 0, -1.2]} w={1.0} d={0.6} top="#E2E8F0" />
      <Box p={[0.4, 0.8, -1.2]} s={[0.6, 0.1, 0.45]} c="#334155" />
      <Spin position={[0.4, 0.86, -1.2]} speed={3}>
        <Cyl r1={0.18} h={0.01} c="#111827" seg={28} />
        <Cyl p={[0, 0.006, 0]} r1={0.06} h={0.01} c="#F43F5E" />
      </Spin>
      <Avatar3D position={[1.1, 0, 0.3]} rotation={[0, -0.6, 0]} pose="standing" shirtColor="#10B981" hasGlasses expression="neutral" />
    </group>
  );
}

/* Q24 & Q38 — a bright classroom with desks, a board and a teacher */
export function ClassroomAuditorium3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#E6C9A0" />
      <RoomWall c="#FEFCE8" windows={[-2.6, 2.6]} />
      <Box p={[0, 1.7, -2.46]} s={[3.0, 1.3, 0.05]} c="#8B5A2B" />
      <Box p={[0, 1.7, -2.43]} s={[2.85, 1.15, 0.03]} c="#2F6B4F" />
      <Box p={[-0.6, 1.85, -2.41]} s={[0.9, 0.03, 0.01]} c="#F8FAFC" />
      <Box p={[-0.3, 1.6, -2.41]} s={[1.3, 0.03, 0.01]} c="#F8FAFC" />
      <group position={[1.9, 2.4, -2.44]}>
        <Cyl r1={0.2} h={0.03} c="#FFFFFF" rot={[Math.PI / 2, 0, 0]} />
        <Spin speed={-0.6} axis="z" position={[0, 0, 0.03]}>
          <Box p={[0, 0.07, 0]} s={[0.02, 0.14, 0.01]} c="#1F2937" />
        </Spin>
      </group>
      {[-1.5, 1.5].map((x) => (
        <group key={x} position={[x, 0, -0.9]}>
          <Table w={0.9} d={0.55} h={0.7} top="#F5DEB3" leg="#64748B" />
          <Box p={[0.1, 0.74, 0]} s={[0.3, 0.02, 0.22]} c="#FFFFFF" />
          <Chair p={[0, 0, 0.45]} rot={Math.PI} c="#64748B" cushion="#60A5FA" />
        </group>
      ))}
      <Avatar3D position={[-2.3, 0, -1.8]} rotation={[0, 0.5, 0]} pose="gesturing" shirtColor="#0F766E" pantsColor="#334155" hairStyle="bun" hairColor="#4B5563" hasGlasses expression="neutral" />
    </group>
  );
}

/* Q25 — underwater reef: swaying weed, fish swimming, a turtle and rising bubbles */
function Seaweed({ p, h = 1 }: { p: [number, number, number]; h?: number }) {
  const g = useRef<THREE.Group>(null);
  const ph = phaseOf(p);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = 0.2 * Math.sin(clock.getElapsedTime() * 1.4 + ph);
  });
  return (
    <group ref={g} position={p}>
      <mesh position={[0, h / 2, 0]} castShadow>
        <capsuleGeometry args={[0.04, h, 4, 8]} />
        <Mat c="#22A06B" />
      </mesh>
    </group>
  );
}

function Bubbles({ p }: { p: [number, number, number] }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.3 + i / 5) % 1;
      m.position.set(Math.sin(k * 8 + i) * 0.08, k * 2.4, 0);
      m.scale.setScalar(0.6 + k);
    });
  });
  return (
    <group position={p}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#E0F7FF" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function MarineReef3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#F0DCA0" />
      {/* corals */}
      {[[-1.4, -0.6, "#F472B6"], [1.3, -0.9, "#FB923C"], [-0.4, -1.6, "#A78BFA"], [0.6, -1.5, "#F43F5E"]].map(([x, z, c], i) => (
        <group key={i} position={[x as number, 0, z as number]}>
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} position={[Math.cos(k * 1.7) * 0.12, 0.3 + k * 0.05, Math.sin(k * 1.7) * 0.12]} rotation={[Math.sin(k) * 0.4, 0, Math.cos(k * 2) * 0.5]} castShadow>
              <capsuleGeometry args={[0.05, 0.5, 4, 8]} />
              <Mat c={c as string} />
            </mesh>
          ))}
          <Ball p={[0, 0.08, 0]} r={0.18} c={c as string} s={[1.4, 0.6, 1.2]} />
        </group>
      ))}
      <Rock p={[1.9, 0.1, 0.1]} s={0.8} c="#C4B59A" />
      <Rock p={[-2.1, 0.08, 0.4]} s={0.6} c="#BFAE92" />
      {[[-0.9, -0.2], [-1.0, -0.4], [0.2, -2.0], [1.7, -0.3], [2.2, -1.2], [-2.3, -1.4]].map(([x, z], i) => (
        <Seaweed key={i} p={[x, 0, z]} h={0.8 + (i % 3) * 0.3} />
      ))}
      {/* starfish */}
      <group position={[0.4, 0.03, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0, 1, 2, 3, 4].map((k) => (
          <mesh key={k} rotation={[0, 0, (k * Math.PI * 2) / 5]} position={[0, 0, 0]}>
            <boxGeometry args={[0.07, 0.34, 0.04]} />
            <Mat c="#F97316" />
          </mesh>
        ))}
      </group>
      <Fish center={[0, 1.1, -0.6]} radius={1.4} c="#FB923C" />
      <Fish center={[0.3, 1.6, -0.9]} radius={1.0} speed={0.8} c="#38BDF8" />
      <Fish center={[-0.2, 0.7, -0.4]} radius={1.8} speed={0.45} c="#FACC15" />
      {/* a sea turtle gliding across */}
      <Drift from={-2.4} to={2.4} speed={0.06} position={[0, 1.9, -1.6]}>
        <group rotation={[0, Math.PI / 2, 0]}>
          <Ball r={0.3} c="#65A30D" s={[1, 0.45, 1.3]} />
          <Ball p={[0, 0.02, 0.42]} r={0.1} c="#A3E635" />
          {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, z], i) => (
            <Bob key={i} position={[x * 0.28, 0, z * 0.22]} amp={0.04} speed={4}>
              <Ball r={0.08} c="#A3E635" s={[1.6, 0.4, 0.8]} />
            </Bob>
          ))}
        </group>
      </Drift>
      <Bubbles p={[-1.4, 0.4, -0.6]} />
      <Bubbles p={[1.3, 0.4, -0.9]} />
    </group>
  );
}

/* Q26 — a word library: shelves, a dictionary on a stand and letter blocks floating */
export function LexicalVault3D({ position = [0, 0, 0] }: P) {
  const letters = ["#F43F5E", "#3B82F6", "#22C55E", "#F59E0B", "#A855F7"];
  return (
    <group position={position}>
      <Ground c="#F3E6CF" />
      <RoomWall c="#FFF8EB" />
      {[-1.6, 0, 1.6].map((x) => (
        <group key={x} position={[x, 0, -2.2]}>
          <Box p={[0, 1.1, 0]} s={[1.3, 2.2, 0.4]} c="#A16207" />
          {[0.35, 0.95, 1.55].map((y) => (
            <group key={y}>
              <Box p={[0, y - 0.05, 0.05]} s={[1.2, 0.04, 0.34]} c="#854D0E" />
              {Array.from({ length: 8 }, (_, i) => (
                <Box key={i} p={[-0.5 + i * 0.14, y + 0.17, 0.08]} s={[0.1, 0.32 + (i % 3) * 0.04, 0.24]} c={letters[(i + y * 10) % letters.length | 0]} />
              ))}
            </group>
          ))}
        </group>
      ))}
      {/* reading stand with a big open dictionary */}
      <group position={[-0.5, 0, -0.5]}>
        <Cyl p={[0, 0.5, 0]} r1={0.06} h={1.0} c="#854D0E" />
        <Box p={[0, 1.02, 0]} rot={[-0.5, 0, 0]} s={[0.7, 0.04, 0.5]} c="#854D0E" />
        <Box p={[-0.17, 1.07, 0.02]} rot={[-0.5, 0, 0.08]} s={[0.32, 0.03, 0.44]} c="#FFFFFF" />
        <Box p={[0.17, 1.07, 0.02]} rot={[-0.5, 0, -0.08]} s={[0.32, 0.03, 0.44]} c="#FFFFFF" />
      </group>
      {[[-1.4, 1.5, 0], [-0.2, 1.9, -0.9], [0.7, 1.6, -0.3], [-1.0, 2.2, -1.0]].map((p, i) => (
        <Bob key={i} position={p as [number, number, number]} amp={0.1} speed={1.2} spin={0.6}>
          <Box s={[0.26, 0.26, 0.26]} c={letters[i]} />
          <Box p={[0, 0, 0.135]} s={[0.12, 0.14, 0.01]} c="#FFFFFF" />
        </Bob>
      ))}
    </group>
  );
}

/* Q27, Q29–Q31, Q33 — a beaver pond: flowing river, a log dam and the lodge */
export function BeaverHabitat3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#8BCF74" />
      <Water p={[-0.2, 0.015, 0]} w={1.7} d={40} c="#4FB3E8" />
      <RiverFlow p={[-0.2, 0.03, 0]} w={1.5} len={10} />
      {/* the dam: stacked logs across the river */}
      <group position={[-0.2, 0, -1.3]}>
        {[0, 1, 2].map((row) =>
          [-0.6, 0, 0.6].map((x, i) => (
            <Cyl key={`${row}${i}`} p={[x + (row % 2) * 0.25, 0.1 + row * 0.13, row * -0.04]} r1={0.07} h={0.75} c={i % 2 ? "#8B5A2B" : "#A0703F"} rot={[0, 0, Math.PI / 2]} seg={10} />
          ))
        )}
        <Ball p={[0.1, 0.3, -0.2]} r={0.2} c="#6B4F2A" s={[3.5, 0.6, 1]} />
      </group>
      {/* the lodge: a dome of sticks */}
      <group position={[-1.6, 0, -2.2]}>
        <Ball p={[0, 0, 0]} r={0.75} c="#7A5A36" s={[1.3, 0.8, 1]} />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Cyl key={k} p={[Math.cos(k) * 0.5, 0.35, Math.sin(k) * 0.4]} r1={0.03} h={0.9} c="#5B4126" rot={[Math.sin(k), k, Math.cos(k) * 0.8]} seg={6} />
        ))}
      </group>
      <Beaver p={[0.4, 0, -0.6]} rot={[0, -0.5, 0]} s={1.1} />
      <Beaver p={[-0.9, 0.02, 0.6]} rot={[0, 0.8, 0]} s={0.8} />
      {/* a birch felled by the beavers' teeth */}
      <Cyl p={[1.5, 0.08, -0.7]} r1={0.08} h={1.3} c="#F1F5F9" rot={[0, 0.7, Math.PI / 2]} seg={10} />
      <mesh position={[1.9, 0.12, -1.0]}>
        <coneGeometry args={[0.09, 0.22, 10]} />
        <Mat c="#E8D7B5" />
      </mesh>
      <Birch p={[2.1, 0, -1.7]} h={2.2} />
      <Birch p={[2.6, 0, -0.6]} h={1.8} />
      <Tree p={[-3, 0, -1]} crown="#3F9B4B" />
      <Bush p={[1.8, 0, 1.2]} />
      <Cloud3D position={[0.5, 3.6, -6]} />
    </group>
  );
}

/* Q28, Q32 — Patagonia: snowy peaks, a flooded pond of drowned trees */
export function GlacierExpedition3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#B9D7A8" />
      <Mountain p={[-3.5, 0, -8]} h={4.5} r={3} c="#8FA3B8" />
      <Mountain p={[1, 0, -9]} h={5.5} r={3.6} c="#7F93AA" />
      <Mountain p={[5, 0, -8]} h={4} r={2.8} c="#94A3B8" />
      {/* the beaver pond that flooded the forest */}
      <Water p={[-0.8, 0.015, -1.0]} w={2.6} round c="#6CC3EA" />
      {[[-1.4, -1.2], [-0.4, -1.8], [0.3, -0.6], [-1.0, -0.2]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cyl p={[0, 0.5, 0]} r1={0.05} r2={0.07} h={1.0} c="#9CA3AF" seg={8} />
          <Cyl p={[0.12, 0.8, 0]} r1={0.02} h={0.35} c="#9CA3AF" seg={6} rot={[0, 0, -0.8]} />
        </group>
      ))}
      <Beaver p={[-0.2, 0.02, 0.1]} rot={[0, 0.4, 0]} s={0.9} />
      {/* the living forest beyond */}
      {[[-3, -2.5], [2.4, -2.2], [3.2, -1], [-3.6, -0.8]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <coneGeometry args={[0.45, 1.6, 8]} />
            <Mat c="#2F855A" />
          </mesh>
          <Cyl p={[0, 0.15, 0]} r1={0.07} h={0.3} c="#7C4A1E" seg={8} />
        </group>
      ))}
      <Flag p={[1.9, 0, 0.2]} c="#38BDF8" h={1.2} />
      <Cloud3D position={[-1, 3.8, -6]} />
      <Cloud3D position={[2.5, 4.2, -7]} scale={1.2} />
    </group>
  );
}

/* Q34, Q36 — the new house in Goa: balcony, air conditioner, palms and moving boxes */
export function GoaVilla3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#9FD88A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.3, 0.012, 0.3]} receiveShadow>
        <planeGeometry args={[1.0, 3.2]} />
        <Mat c="#E7D8C3" r={1} />
      </mesh>
      <group position={[-0.3, 0, -2]}>
        <Box p={[0, 1.2, 0]} s={[3.0, 2.4, 1.6]} c="#FFF7ED" />
        <mesh position={[0, 2.75, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.3, 0.8, 4]} />
          <Mat c="#E4572E" />
        </mesh>
        <Box p={[0, 0.45, 0.81]} s={[0.5, 0.9, 0.03]} c="#8B5A2B" />
        {/* balcony */}
        <Box p={[0.8, 1.55, 1.0]} s={[1.1, 0.06, 0.45]} c="#E2E8F0" />
        {[-0.5, -0.25, 0, 0.25, 0.5].map((x) => (
          <Cyl key={x} p={[0.8 + x, 1.72, 1.2]} r1={0.015} h={0.32} c="#94A3B8" seg={6} />
        ))}
        <Box p={[0.8, 1.88, 1.2]} s={[1.1, 0.04, 0.04]} c="#94A3B8" />
        <Box p={[0.8, 2.0, 0.82]} s={[0.7, 0.7, 0.03]} c="#9BD3F2" />
        {[-0.9, -0.3].map((x) => (
          <Box key={x} p={[x, 1.7, 0.82]} s={[0.4, 0.4, 0.03]} c="#9BD3F2" />
        ))}
        {/* air-conditioning unit with its fan turning */}
        <group position={[-1.1, 1.2, 0.95]}>
          <Box s={[0.5, 0.35, 0.28]} c="#F8FAFC" />
          <Spin axis="z" speed={6} position={[0.05, 0, 0.15]}>
            {[0, 1, 2].map((k) => (
              <Box key={k} rot={[0, 0, (k * Math.PI * 2) / 3]} p={[0, 0, 0]} s={[0.24, 0.05, 0.01]} c="#94A3B8" />
            ))}
          </Spin>
        </group>
      </group>
      {[[-0.2, 0.6], [0.1, 0.8], [-0.05, 1.0]].map(([x, z], i) => (
        <Box key={i} p={[x - 0.6, 0.15 + (i === 2 ? 0.3 : 0), z - 0.2]} s={[0.35, 0.3, 0.35]} c="#D6A96B" />
      ))}
      <PalmTree p={[-2.5, 0, -1.2]} h={2.6} />
      <PalmTree p={[2.2, 0, -2.6]} h={2.3} />
      <Bush p={[1.8, 0, -1]} />
      <Cloud3D position={[1, 4, -6]} />
    </group>
  );
}

/* Q35 — the verandah where the friend is invited to visit */
export function VillaVerandah3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#E8B58E" />
      <RoomWall c="#FFF4E0" windows={[-1.8]} />
      <Box p={[1.2, 0.9, -2.46]} s={[0.7, 1.8, 0.03]} c="#8B5A2B" />
      {/* verandah pillars and roof edge */}
      {[-2.4, 2.4].map((x) => (
        <Cyl key={x} p={[x, 1.4, -0.6]} r1={0.08} h={2.8} c="#FFFFFF" />
      ))}
      <Box p={[0, 2.85, -1.5]} s={[5.2, 0.12, 2.0]} c="#C2410C" />
      <Table p={[-0.6, 0, -0.9]} w={0.8} round top="#FDE68A" />
      <Cyl p={[-0.75, 0.8, -0.9]} r1={0.05} h={0.12} c="#FFFFFF" />
      <Steam position={[-0.75, 0.88, -0.9]} count={3} />
      <Cyl p={[-0.45, 0.78, -0.8]} r1={0.12} h={0.04} c="#FB923C" />
      <Chair p={[-1.4, 0, -1.0]} rot={0.6} c="#A16207" cushion="#22C55E" />
      <Chair p={[0.2, 0, -1.2]} rot={-0.4} c="#A16207" cushion="#22C55E" />
      {[-2.2, 2.2].map((x) => (
        <group key={x} position={[x, 0, -0.1]}>
          <Cyl p={[0, 0.2, 0]} r1={0.2} r2={0.15} h={0.4} c="#C2410C" />
          <Bush p={[0, 0.3, 0]} s={0.7} />
        </group>
      ))}
    </group>
  );
}

/* Q37 — brother and sister walking to the school down the road */
export function TrailGreeting3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#94D58A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -1]} receiveShadow>
        <planeGeometry args={[1.4, 30]} />
        <Mat c="#E5DCCB" r={1} />
      </mesh>
      {/* the school at the end of the road */}
      <group position={[0, 0, -4.5]}>
        <Box p={[0, 1.1, 0]} s={[3.6, 2.2, 1.2]} c="#FEF3C7" />
        <Box p={[0, 2.3, 0]} s={[3.8, 0.2, 1.4]} c="#DC2626" />
        <Box p={[0, 2.7, 0]} s={[1.0, 0.6, 0.6]} c="#FEF3C7" />
        <Cyl p={[0, 2.75, 0.31]} r1={0.18} h={0.02} c="#FFFFFF" rot={[Math.PI / 2, 0, 0]} />
        <Box p={[0, 0.5, 0.61]} s={[0.7, 1.0, 0.03]} c="#1D4ED8" />
        {[-1.2, -0.6, 0.6, 1.2].map((x) => (
          <Box key={x} p={[x, 1.3, 0.61]} s={[0.4, 0.4, 0.03]} c="#9BD3F2" />
        ))}
        <Flag p={[2.2, 0, 0.5]} h={2.4} c="#2563EB" />
      </group>
      <Avatar3D position={[-0.25, 0, -0.2]} pose="walking" rotation={[0, Math.PI, 0]} shirtColor="#2563EB" hairStyle="short" hasBackpack backpackColor="#F59E0B" />
      <Avatar3D position={[0.3, 0, -0.05]} pose="walking" rotation={[0, Math.PI, 0]} scale={0.9} shirtColor="#EC4899" hairStyle="ponytail" hasBackpack backpackColor="#8B5CF6" />
      {[-1.6, 1.6].map((x) =>
        [0.8, -1.2, -3].map((z) => <Tree key={`${x}${z}`} p={[x * (1 + Math.abs(z) * 0.1), 0, z]} scale={0.85} />)
      )}
      <Cloud3D position={[-1.5, 3.8, -6]} />
    </group>
  );
}

/* Q41 — the son has fallen in the park; his mother kneels to look at his knee */
export function MedicalInfirmary3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#A3D98E" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.6]} receiveShadow>
        <planeGeometry args={[40, 1.1]} />
        <Mat c="#E5DCCB" r={1} />
      </mesh>
      <Bench p={[0.7, 0, 0.15]} rot={[0, -0.6, 0]} w={1.1} />
      {/* the bike he fell off */}
      <Bicycle p={[1.6, 0.04, -1.6]} rot={[Math.PI / 2, 0, 0.5]} spin={1.2} frame="#22C55E" />
      {/* first-aid box */}
      <group position={[-0.3, 0, 0.7]}>
        <Box p={[0, 0.1, 0]} s={[0.36, 0.2, 0.26]} c="#FFFFFF" />
        <Box p={[0, 0.2, 0.131]} s={[0.14, 0.04, 0.01]} c="#DC2626" />
        <Box p={[0, 0.2, 0.131]} s={[0.04, 0.14, 0.01]} c="#DC2626" />
      </group>
      <Tree p={[-2.4, 0, -1.8]} />
      <Tree p={[2.8, 0, -2.4]} scale={1.1} />
      <Bush p={[-1.8, 0, 0.8]} s={0.8} />
      <Flower p={[-1.2, 0, 1.1]} />
      <Flower p={[-1.0, 0, 1.3]} c="#FDE047" />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

/* Q42 — the curious neighbour who is always peering over the fence */
export function SuburbanGarden3D({ position = [0, 0, 0] }: P) {
  const peek = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (peek.current) peek.current.position.y = -0.35 + 0.25 * Math.max(0, Math.sin(clock.getElapsedTime() * 0.9));
  });
  return (
    <group position={position}>
      <Ground c="#98D383" />
      <House p={[-2.2, 0, -3.2]} />
      <House p={[2.2, 0, -3.6]} wall="#E0F2FE" roof="#2563EB" />
      {/* the fence */}
      {Array.from({ length: 17 }, (_, i) => (
        <Box key={i} p={[-3.2 + i * 0.4, 0.45, -1.6]} s={[0.12, 0.9, 0.05]} c="#FFFFFF" />
      ))}
      <Box p={[0, 0.7, -1.62]} s={[6.8, 0.07, 0.04]} c="#F1F5F9" />
      <Box p={[0, 0.3, -1.62]} s={[6.8, 0.07, 0.04]} c="#F1F5F9" />
      {/* Mr Williams popping up behind it */}
      <group ref={peek} position={[0.1, -0.35, -1.95]}>
        <Avatar3D pose="standing" shirtColor="#64748B" pantsColor="#334155" hairStyle="short" hairColor="#D1D5DB" hasGlasses expression="surprised" />
      </group>
      {["#F472B6", "#FDE047", "#A78BFA", "#FB7185", "#F97316"].map((c, i) => (
        <Flower key={c} p={[-2.4 + i * 0.35, 0, -1.2]} c={c} />
      ))}
      <Tree p={[3.0, 0, -0.8]} />
      <Cloud3D position={[-1, 3.8, -6]} />
    </group>
  );
}

/* Q43 — the café where Jenna asks Shetty to dinner */
export function CafeBistro3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#EFE3D0" />
      <RoomWall c="#FFF1E6" windows={[-2.4, 2.4]} />
      {/* counter */}
      <Box p={[0, 0.5, -2.0]} s={[2.4, 1.0, 0.6]} c="#B45309" />
      <Box p={[0, 1.02, -2.0]} s={[2.5, 0.05, 0.7]} c="#F5F5F4" />
      <Box p={[-0.6, 1.25, -2.05]} s={[0.4, 0.4, 0.35]} c="#94A3B8" />
      <Steam position={[-0.6, 1.5, -2.0]} count={3} />
      {[-0.9, 0, 0.9].map((x) => (
        <group key={x} position={[x, 2.6, -1.2]}>
          <Cyl p={[0, 0.3, 0]} r1={0.008} h={0.6} c="#475569" seg={4} />
          <Bob amp={0.03} speed={1.3}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.18, 0.2, 18, 1, true]} />
              <meshStandardMaterial color="#F59E0B" emissive="#FBBF24" emissiveIntensity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </Bob>
        </group>
      ))}
      <Table p={[0, 0, 0.25]} w={0.8} round top="#FFFFFF" leg="#475569" />
      <Cyl p={[-0.18, 0.79, 0.3]} r1={0.05} h={0.1} c="#FFFFFF" />
      <Cyl p={[0.18, 0.79, 0.3]} r1={0.05} h={0.1} c="#FFFFFF" />
      <Steam position={[-0.18, 0.86, 0.3]} count={3} />
      <Chair p={[-0.95, 0, 0.45]} rot={0.6} c="#475569" cushion="#F87171" />
      <Chair p={[0.95, 0, 0.45]} rot={-0.6} c="#475569" cushion="#F87171" />
    </group>
  );
}

/* Q44 — fixing the bike straight away: the bike on its stand, wheel spinning */
export function BikeWorkshop3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#E5E7EB" />
      <RoomWall c="#F1F5F9" windows={[-2.2]} />
      {/* tool board */}
      <Box p={[1.4, 1.6, -2.46]} s={[1.6, 1.0, 0.04]} c="#FDE68A" />
      {[[1.0, 1.7], [1.4, 1.5], [1.8, 1.75]].map(([x, y], i) => (
        <Box key={i} p={[x, y, -2.42]} rot={[0, 0, 0.6 * (i - 1)]} s={[0.06, 0.45, 0.03]} c={["#EF4444", "#3B82F6", "#64748B"][i]} />
      ))}
      <Bicycle p={[-0.2, 0.1, -0.5]} spin={6} frame="#2563EB" />
      <Box p={[-0.2, 0.05, -0.5]} s={[1.5, 0.1, 0.3]} c="#94A3B8" />
      {/* toolbox and a dropped spanner */}
      <group position={[0.5, 0, 0.6]}>
        <Box p={[0, 0.14, 0]} s={[0.55, 0.28, 0.3]} c="#DC2626" />
        <Box p={[0, 0.32, 0]} s={[0.3, 0.06, 0.05]} c="#1F2937" />
      </group>
      <Box p={[-0.8, 0.02, 0.5]} rot={[0, 0.7, 0]} s={[0.35, 0.03, 0.06]} c="#94A3B8" />
    </group>
  );
}

/* Q45 — too tired to walk any further: two friends resting on rocks on the trail */
export function MountainSummit3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#B7D39A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.5]} receiveShadow>
        <planeGeometry args={[1.2, 30]} />
        <Mat c="#D9C7A7" r={1} />
      </mesh>
      <Mountain p={[-3, 0, -8]} h={5} r={3.2} c="#8AA1B5" />
      <Mountain p={[2.5, 0, -9]} h={6} r={3.8} c="#7D95AB" />
      {/* the rocks they sit on */}
      <mesh position={[-0.8, 0.22, 0.4]} scale={[1, 0.6, 0.9]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.42, 0]} />
        <Mat c="#A8A29E" r={0.95} />
      </mesh>
      <mesh position={[0.8, 0.22, 0.4]} scale={[1, 0.6, 0.9]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.42, 0]} />
        <Mat c="#B8B0A8" r={0.95} />
      </mesh>
      <Box p={[-0.3, 0.2, 0.9]} s={[0.35, 0.4, 0.2]} c="#F97316" />
      <Cyl p={[0.2, 0.12, 0.95]} r1={0.06} h={0.24} c="#38BDF8" />
      <Flag p={[1.9, 0, -1.8]} h={1.8} c="#F43F5E" />
      {[[-2.4, -1.4], [2.6, -0.6], [-2.8, 0.4]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <coneGeometry args={[0.45, 1.5, 8]} />
            <Mat c="#2F855A" />
          </mesh>
          <Cyl p={[0, 0.12, 0]} r1={0.07} h={0.25} c="#7C4A1E" seg={8} />
        </group>
      ))}
      <Cloud3D position={[0, 3.6, -5]} />
      <Cloud3D position={[-3, 4.2, -7]} scale={1.3} />
    </group>
  );
}

/* Q46 — riding a bike with the dog on your lap: the whole thing wobbles */
export function AbsurdBicycle3D({ position = [0, 0, 0] }: P) {
  const wobble = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (wobble.current) wobble.current.rotation.x = 0.03 * Math.sin(clock.getElapsedTime() * 3.2);
  });
  return (
    <group position={position}>
      <Ground c="#D6DCE4" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 2.2]} />
        <Mat c="#B9C2CE" r={1} />
      </mesh>
      {[-3, -1.5, 0, 1.5, 3].map((x) => (
        <Box key={x} p={[x, 0.015, 0]} s={[0.6, 0.01, 0.07]} c="#FFFFFF" />
      ))}
      <group ref={wobble}>
        <Bicycle p={[0, 0, 0]} spin={6} frame="#F43F5E" />
        <Dog p={[0.12, 0.72, 0.02]} rot={[0, Math.PI / 2, 0]} s={0.75} />
      </group>
      <House p={[-2.6, 0, -3]} wall="#FEF9C3" />
      <House p={[2.4, 0, -3.4]} wall="#E0F2FE" roof="#0EA5E9" />
      {[-1.8, 1.8].map((x) => (
        <group key={x} position={[x, 0, -1.4]}>
          <Cyl p={[0, 1.1, 0]} r1={0.04} h={2.2} c="#475569" seg={8} />
          <Ball p={[0, 2.25, 0]} r={0.12} c="#FEF08A" />
        </group>
      ))}
      <Tree p={[3.4, 0, -1.2]} />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

/* Q47 — the hostel's communal kitchen, shared by strangers */
export function CommunalKitchen3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#EEF1F5" />
      <RoomWall c="#F0FDF4" windows={[0]} />
      {/* long shared counter with several hobs */}
      <Box p={[0, 0.45, -2.05]} s={[4.6, 0.9, 0.6]} c="#FFFFFF" />
      <Box p={[0, 0.92, -2.05]} s={[4.7, 0.05, 0.7]} c="#CBD5E1" />
      {[-1.6, -0.5, 0.6, 1.7].map((x, i) => (
        <group key={x} position={[x, 0.95, -2.05]}>
          <Cyl r1={0.14} h={0.02} c="#1F2937" />
          {i % 2 === 0 ? (
            <>
              <Cyl p={[0, 0.12, 0]} r1={0.13} r2={0.12} h={0.22} c="#94A3B8" />
              <Steam position={[0, 0.25, 0]} count={3} />
            </>
          ) : (
            <Cyl p={[0, 0.04, 0]} r1={0.17} r2={0.14} h={0.05} c="#334155" />
          )}
        </group>
      ))}
      {/* shelves with labelled boxes for each guest */}
      {[-1.6, 1.6].map((x) => (
        <group key={x} position={[x, 1.85, -2.35]}>
          <Box s={[1.2, 0.05, 0.3]} c="#A16207" />
          {[-0.4, 0, 0.4].map((dx, i) => (
            <Box key={dx} p={[dx, 0.14, 0]} s={[0.3, 0.24, 0.24]} c={["#FCA5A5", "#93C5FD", "#FDE68A"][i]} />
          ))}
        </group>
      ))}
      <Box p={[2.6, 0.9, -2.0]} s={[0.8, 1.8, 0.7]} c="#E2E8F0" />
      <Box p={[2.25, 1.1, -1.64]} s={[0.04, 0.5, 0.04]} c="#94A3B8" />
      <Table p={[0, 0, -0.6]} w={1.8} d={0.7} top="#FDE68A" />
      {[-0.5, 0, 0.5].map((x) => (
        <Cyl key={x} p={[x, 0.77, -0.6]} r1={0.12} h={0.02} c="#FFFFFF" />
      ))}
    </group>
  );
}

/* Q48 — swimming: lane ropes, rippling water; the swimmer's arms propel them */
export function SwimmingPool3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#E6F4FB" />
      {/* the pool: tiled rim around the water */}
      <Box p={[0, 0.06, -1.8]} s={[7.2, 0.12, 0.3]} c="#F8FAFC" />
      <Box p={[0, 0.06, 1.6]} s={[7.2, 0.12, 0.3]} c="#F8FAFC" />
      <Water p={[0, 0.1, -0.1]} w={7.0} d={3.2} c="#38BDF8" />
      {[-1.1, 1.0].map((z) => (
        <group key={z}>
          {Array.from({ length: 24 }, (_, i) => (
            <Ball key={i} p={[-3.4 + i * 0.3, 0.13, z]} r={0.05} c={i % 4 < 2 ? "#F43F5E" : "#FFFFFF"} />
          ))}
        </group>
      ))}
      {/* ladder and a lifeguard chair */}
      {[-0.15, 0.15].map((x) => (
        <Cyl key={x} p={[-3.3 + x, 0.35, -1.75]} r1={0.02} h={0.5} c="#CBD5E1" rot={[0.4, 0, 0]} seg={8} />
      ))}
      <group position={[3.0, 0, -2.4]}>
        {[-0.2, 0.2].map((x) => (
          <Cyl key={x} p={[x, 0.7, 0]} r1={0.03} h={1.4} c="#F8FAFC" seg={8} />
        ))}
        <Box p={[0, 1.4, 0]} s={[0.5, 0.06, 0.4]} c="#F43F5E" />
      </group>
      <Bob position={[-2.2, 0.14, 0.5]} amp={0.04} speed={1.5}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.07, 10, 20]} />
          <Mat c="#FB923C" />
        </mesh>
      </Bob>
      <PalmTree p={[-3.6, 0, -2.8]} />
      <Cloud3D position={[1, 3.8, -6]} />
    </group>
  );
}

/* Q50 — Mohit dropped Joy home; Joy wants to repay the favour */
export function CarRideDropoff3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#A7D98F" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.2]} receiveShadow>
        <planeGeometry args={[40, 1.8]} />
        <Mat c="#B9C2CE" r={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -0.1]} receiveShadow>
        <planeGeometry args={[40, 0.5]} />
        <Mat c="#E5E7EB" r={1} />
      </mesh>
      <Car p={[0.2, 0, -1.2]} c="#F97316" />
      <House p={[-2.2, 0, -3.4]} wall="#FFF7ED" />
      <House p={[2.4, 0, -3.6]} wall="#ECFCCB" roof="#16A34A" />
      <Tree p={[3.4, 0, -2]} />
      <Bush p={[-3, 0, -2]} />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

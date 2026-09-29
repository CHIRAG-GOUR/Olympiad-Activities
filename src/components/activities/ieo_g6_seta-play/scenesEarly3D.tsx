"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "./avatar3D";
import { Bob, Cloud3D, Spin, Steam, Drift } from "./scene";
import { Ball, Bench, Box, Bush, Cyl, Dog, Flag, Flower, House, Mat, RoomWall, Table, Tree } from "./props3D";

/* ══════════════════════════════════════════════════════════════════════
   Scenes for the first part of the English paper (Q2–Q15, Q18). Each keeps
   the space its question uses for its own characters.
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

function Suitcase({ p, c, s = 1, rot = 0 }: { p: [number, number, number]; c: string; s?: number; rot?: number }) {
  return (
    <group position={p} rotation={[0, rot, 0]} scale={s}>
      <Box p={[0, 0.3, 0]} s={[0.42, 0.56, 0.22]} c={c} r={0.4} />
      <Box p={[0, 0.3, 0.115]} s={[0.36, 0.02, 0.01]} c="#FFFFFF" />
      <Box p={[0, 0.63, 0]} s={[0.16, 0.05, 0.04]} c="#1F2937" />
      {[-0.14, 0.14].map((x) => (
        <Cyl key={x} p={[x, 0.02, 0.06]} r1={0.03} h={0.04} c="#1F2937" rot={[0, 0, Math.PI / 2]} seg={10} />
      ))}
    </group>
  );
}

/* Q2, Q7 — the airport: bags riding the belt, a plane taxiing past the window */
export function AirportLuggage3D({ position = [0, 0, 0] }: P) {
  const belt = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    belt.current.forEach((g, i) => {
      if (g) g.position.x = -2.6 + (((t * 0.35 + i / 3) % 1) * 5.2);
    });
  });
  return (
    <group position={position}>
      <Ground c="#EEF2F7" />
      {/* the glass wall and the runway beyond it */}
      <mesh position={[0, 1.6, -2.6]}>
        <planeGeometry args={[30, 3.2]} />
        <meshStandardMaterial color="#BFE3F7" transparent opacity={0.55} />
      </mesh>
      {[-3, -1.5, 0, 1.5, 3].map((x) => (
        <Box key={x} p={[x, 1.6, -2.58]} s={[0.06, 3.2, 0.06]} c="#94A3B8" />
      ))}
      <Drift from={-7} to={7} speed={0.05} position={[0, 0.9, -5]}>
        <group scale={0.9}>
          <Cyl r1={0.35} h={3.2} c="#FFFFFF" rot={[0, 0, Math.PI / 2]} />
          <mesh position={[1.75, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.35, 0.5, 20]} />
            <Mat c="#FFFFFF" />
          </mesh>
          <Box p={[0, 0, 0]} s={[0.9, 0.06, 3.4]} c="#E2E8F0" />
          <Box p={[-1.45, 0.5, 0]} s={[0.5, 0.7, 0.06]} c="#2563EB" />
        </group>
      </Drift>
      {/* departures board */}
      <group position={[1.6, 2.3, -2.4]}>
        <Box s={[1.4, 0.55, 0.06]} c="#1E3A8A" />
        {[0.12, -0.02, -0.16].map((y, i) => (
          <Box key={y} p={[-0.1 + (i % 2) * 0.1, y, 0.035]} s={[0.9 - i * 0.12, 0.06, 0.01]} c="#FDE047" />
        ))}
      </group>
      {/* the baggage belt */}
      <Box p={[0, 0.25, -1.3]} s={[5.4, 0.5, 0.6]} c="#94A3B8" />
      <Box p={[0, 0.51, -1.3]} s={[5.4, 0.03, 0.5]} c="#334155" />
      {["#F43F5E", "#22C55E", "#3B82F6"].map((c, i) => (
        <group key={c} ref={(g) => { belt.current[i] = g; }} position={[0, 0.52, -1.3]}>
          <Suitcase p={[0, 0, 0]} c={c} s={0.7} rot={Math.PI / 2} />
        </group>
      ))}
      {/* the traveller's own bags */}
      <Suitcase p={[-1.0, 0, 0.1]} c="#F59E0B" />
      <Suitcase p={[-0.5, 0, 0.3]} c="#8B5CF6" s={0.8} rot={0.4} />
      <Avatar3D position={[-1.6, 0, 0.3]} rotation={[0, 0.5, 0]} pose="gesturing" shirtColor="#F59E0B" hairStyle="short" hasBackpack backpackColor="#EF4444" />
      <Avatar3D position={[1.2, 0, 0.2]} rotation={[0, -0.5, 0]} pose="standing" shirtColor="#0EA5E9" pantsColor="#1E293B" hairStyle="cap" hairColor="#1E3A8A" />
    </group>
  );
}

/* Q3, Q6 — a warm family kitchen: mother cooks at the stove, the child helps */
export function ChefKitchen3D({ position = [0, 0, 0] }: P) {
  const spoon = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (spoon.current) spoon.current.rotation.y = clock.getElapsedTime() * 2.2;
  });
  return (
    <group position={position}>
      <Ground c="#F1E3CC" />
      <RoomWall c="#FFF7ED" windows={[1.6]} />
      {/* tiled splashback */}
      {Array.from({ length: 10 }, (_, i) => (
        <Box key={i} p={[-2 + i * 0.3, 1.25, -2.47]} s={[0.28, 0.5, 0.02]} c={i % 2 ? "#E0F2FE" : "#FFFFFF"} />
      ))}
      {/* counter run with the stove in it */}
      <Box p={[-0.6, 0.45, -2.1]} s={[3.2, 0.9, 0.7]} c="#FDE68A" />
      <Box p={[-0.6, 0.92, -2.1]} s={[3.3, 0.05, 0.75]} c="#F5F5F4" />
      <Box p={[-0.2, 0.93, -2.1]} s={[0.8, 0.04, 0.6]} c="#1F2937" />
      {[-0.4, 0.0].map((x) => (
        <Cyl key={x} p={[x, 0.96, -2.1]} r1={0.12} h={0.02} c="#475569" />
      ))}
      {/* the pot, its steam and the spoon going round */}
      <Cyl p={[-0.4, 1.08, -2.1]} r1={0.16} r2={0.14} h={0.22} c="#CBD5E1" />
      <Steam position={[-0.4, 1.2, -2.1]} count={5} />
      <group ref={spoon} position={[-0.4, 1.2, -2.1]}>
        <Cyl p={[0.07, 0.08, 0]} r1={0.012} h={0.3} c="#A16207" seg={6} rot={[0, 0, 0.3]} />
      </group>
      <Cyl p={[0.0, 1.0, -2.1]} r1={0.18} r2={0.15} h={0.06} c="#334155" />
      {/* hood, shelves, fridge */}
      <mesh position={[-0.2, 2.1, -2.2]} castShadow>
        <cylinderGeometry args={[0.25, 0.55, 0.45, 4]} />
        <Mat c="#E2E8F0" m={0.3} />
      </mesh>
      <Box p={[-1.6, 1.9, -2.35]} s={[1.0, 0.05, 0.25]} c="#A16207" />
      {["#F87171", "#FBBF24", "#34D399"].map((c, i) => (
        <Cyl key={c} p={[-1.9 + i * 0.3, 2.02, -2.35]} r1={0.07} h={0.2} c={c} />
      ))}
      <Box p={[2.5, 0.95, -2.1]} s={[0.8, 1.9, 0.7]} c="#FFFFFF" />
      <Box p={[2.15, 1.2, -1.74]} s={[0.04, 0.5, 0.04]} c="#94A3B8" />
      {/* the prep table in front */}
      <Table p={[0.6, 0, -0.7]} w={1.2} d={0.6} h={0.8} top="#C58B4E" />
      <Box p={[0.5, 0.84, -0.7]} s={[0.4, 0.03, 0.3]} c="#FDE68A" />
      {[[0.4, -0.7], [0.55, -0.62], [0.9, -0.75]].map(([x, z], i) => (
        <Ball key={i} p={[x, 0.9, z]} r={0.055} c={i === 2 ? "#65A30D" : "#EF4444"} />
      ))}
      <Avatar3D position={[-0.4, 0, -1.4]} rotation={[0, 0.25, 0]} pose="holding_cup" shirtColor="#F472B6" pantsColor="#7C3AED" hairStyle="bun" hairColor="#3B2314" />
      <Avatar3D position={[0.1, 0, -0.9]} rotation={[0, -0.4, 0]} scale={0.72} pose="gesturing" shirtColor="#22C55E" hairStyle="short" />
    </group>
  );
}

/* Q4, Q10 — the geography corner: a big spinning globe, a world map and books */
export function LanguageGlobe3D({ position = [0, 0, 0] }: P) {
  const globe = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (globe.current) globe.current.rotation.y += dt * 0.5;
  });
  return (
    <group position={position}>
      <Ground c="#E9DDF7" />
      <RoomWall c="#F5F3FF" windows={[2.4]} />
      {/* world map on the wall */}
      <group position={[-0.8, 1.8, -2.46]}>
        <Box s={[2.0, 1.1, 0.03]} c="#BAE6FD" />
        {[[-0.5, 0.2, 0.5, 0.4], [0.1, 0.25, 0.35, 0.3], [0.2, -0.15, 0.3, 0.45], [0.6, 0.1, 0.45, 0.35], [-0.35, -0.3, 0.25, 0.25]].map(([x, y, w, h], i) => (
          <Box key={i} p={[x, y, 0.02]} s={[w, h, 0.01]} c={["#86EFAC", "#FDE68A", "#FCA5A5", "#C4B5FD", "#FDBA74"][i]} />
        ))}
      </group>
      {/* bookcase */}
      <group position={[1.4, 0, -2.2]}>
        <Box p={[0, 0.9, 0]} s={[1.1, 1.8, 0.35]} c="#C58B4E" />
        {[0.4, 0.95, 1.5].map((y) =>
          [0, 1, 2, 3, 4, 5].map((i) => (
            <Box key={`${y}${i}`} p={[-0.4 + i * 0.16, y, 0.08]} s={[0.12, 0.35, 0.2]} c={["#F43F5E", "#3B82F6", "#22C55E", "#F59E0B", "#A855F7", "#06B6D4"][(i + y * 10) % 6 | 0]} />
          ))
        )}
      </group>
      {/* the globe on its stand */}
      <group position={[-0.3, 0, -0.6]}>
        <Cyl p={[0, 0.05, 0]} r1={0.3} h={0.1} c="#A16207" />
        <Cyl p={[0, 0.45, 0]} r1={0.04} h={0.8} c="#A16207" seg={10} />
        <group position={[0, 1.2, 0]} rotation={[0, 0, 0.41]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.47, 0.018, 8, 40]} />
            <Mat c="#D4A017" m={0.5} r={0.3} />
          </mesh>
          <group ref={globe}>
            <mesh castShadow>
              <sphereGeometry args={[0.42, 36, 28]} />
              <Mat c="#38BDF8" r={0.4} />
            </mesh>
            {[[0.2, 0.15, 0.3], [-0.25, -0.1, 0.28], [0.05, -0.28, 0.25], [-0.1, 0.3, -0.2], [0.3, -0.05, -0.25]].map(([x, y, z], i) => (
              <mesh key={i} position={[x, y, z]} scale={[1, 0.8, 0.5]}>
                <sphereGeometry args={[0.16, 14, 12]} />
                <Mat c={i % 2 ? "#4ADE80" : "#86EFAC"} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
      <Table p={[-1.9, 0, -0.9]} w={1.0} d={0.6} top="#F5DEB3" />
      <Box p={[-1.9, 0.77, -0.9]} s={[0.5, 0.04, 0.35]} c="#FFFFFF" />
      <Avatar3D position={[1.0, 0, 0.4]} rotation={[0, -0.5, 0]} pose="gesturing" shirtColor="#7C3AED" hairStyle="short" hasGlasses />
    </group>
  );
}

/* Q5 — waiting at the bus stop; the bus comes by every few seconds */
export function BusStopShelter3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#CFE3C4" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.5]} receiveShadow>
        <planeGeometry args={[40, 2.2]} />
        <Mat c="#B9C2CE" r={1} />
      </mesh>
      {[-4, -2, 0, 2, 4].map((x) => (
        <Box key={x} p={[x, 0.015, 1.5]} s={[0.9, 0.01, 0.08]} c="#FFFFFF" />
      ))}
      <Box p={[0, 0.06, 0.25]} s={[40, 0.12, 0.35]} c="#E5E7EB" />
      {/* the shelter */}
      <group position={[-0.4, 0, -0.6]}>
        {[-0.9, 0.9].map((x) => (
          <Cyl key={x} p={[x, 1.1, -0.35]} r1={0.04} h={2.2} c="#64748B" seg={8} />
        ))}
        <Box p={[0, 2.22, -0.1]} s={[2.0, 0.08, 0.9]} c="#0EA5E9" />
        <mesh position={[0, 1.2, -0.4]}>
          <planeGeometry args={[1.8, 1.6]} />
          <meshStandardMaterial color="#BFE3F7" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        <Bench p={[0, 0, -0.1]} w={1.4} />
      </group>
      <Avatar3D position={[-0.6, 0, -0.65]} pose="sitting" shirtColor="#2563EB" hairStyle="short" expression="worried" />
      {/* bus stop sign with a clock */}
      <group position={[1.1, 0, 0.1]}>
        <Cyl p={[0, 1.1, 0]} r1={0.03} h={2.2} c="#94A3B8" seg={8} />
        <Cyl p={[0, 2.1, 0.02]} r1={0.22} h={0.03} c="#EF4444" rot={[Math.PI / 2, 0, 0]} />
        <Box p={[0, 2.1, 0.04]} s={[0.26, 0.08, 0.01]} c="#FFFFFF" />
      </group>
      {/* the bus, driving through */}
      <Drift from={-12} to={12} speed={0.045} loop position={[0, 0, 1.6]}>
        <group>
          <Box p={[0, 0.85, 0]} s={[3.2, 1.3, 1.1]} c="#FBBF24" r={0.4} />
          {[-1.1, -0.5, 0.1, 0.7].map((x) => (
            <Box key={x} p={[x, 1.15, 0.56]} s={[0.45, 0.4, 0.02]} c="#BFE3F7" />
          ))}
          <Box p={[1.61, 1.1, 0]} s={[0.02, 0.5, 0.9]} c="#BFE3F7" />
          {[-1.1, 1.1].map((x) =>
            [-0.5, 0.5].map((z) => <Cyl key={`${x}${z}`} p={[x, 0.22, z]} r1={0.22} h={0.14} c="#1F2937" rot={[Math.PI / 2, 0, 0]} />)
          )}
        </group>
      </Drift>
      <Tree p={[-2.6, 0, -1.4]} crown="#F59E0B" />
      <Tree p={[2.6, 0, -1.8]} />
      <Cloud3D position={[0.5, 3.8, -6]} />
    </group>
  );
}

/* Q8, Q18 — a greenhouse market: herbs with name tags and a fruit stall */
export function Herbarium3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#DDEFD6" />
      {/* greenhouse frame */}
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
        <group key={x}>
          <Box p={[x, 1.3, -2.4]} s={[0.05, 2.6, 0.05]} c="#FFFFFF" />
        </group>
      ))}
      <mesh position={[0, 1.3, -2.45]}>
        <planeGeometry args={[30, 2.6]} />
        <meshStandardMaterial color="#D9F99D" transparent opacity={0.35} />
      </mesh>
      {/* the herb bench */}
      <Table p={[-0.9, 0, -1.3]} w={2.2} d={0.7} h={0.75} top="#C58B4E" />
      {[-1.7, -1.2, -0.7, -0.2].map((x, i) => (
        <group key={x} position={[x, 0.78, -1.3]}>
          <Cyl p={[0, 0.1, 0]} r1={0.12} r2={0.09} h={0.2} c="#C2410C" />
          <Bob amp={0.015} speed={2}>
            <Ball p={[0, 0.3, 0]} r={0.14} c={["#4ADE80", "#22C55E", "#86EFAC", "#16A34A"][i]} s={[1, 1.2, 1]} />
          </Bob>
          <Box p={[0, 0.12, 0.13]} s={[0.16, 0.08, 0.01]} c="#FFFFFF" />
        </group>
      ))}
      {/* fruit stall with mangosteens */}
      <group position={[1.2, 0, -0.9]}>
        <Box p={[0, 0.4, 0]} s={[1.3, 0.8, 0.6]} c="#FDE68A" />
        <Box p={[0, 0.82, 0]} rot={[-0.3, 0, 0]} s={[1.3, 0.05, 0.6]} c="#A16207" />
        {Array.from({ length: 10 }, (_, i) => (
          <Ball key={i} p={[-0.5 + (i % 5) * 0.25, 0.92 - Math.floor(i / 5) * 0.05, -0.1 + Math.floor(i / 5) * 0.2]} r={0.08} c={i % 3 === 0 ? "#7E22CE" : i % 3 === 1 ? "#F59E0B" : "#EF4444"} />
        ))}
        {[-0.6, 0.6].map((x) => (
          <Cyl key={x} p={[x, 1.1, -0.28]} r1={0.025} h={1.4} c="#94A3B8" seg={6} />
        ))}
        <Box p={[0, 1.82, -0.1]} rot={[0.3, 0, 0]} s={[1.5, 0.05, 0.8]} c="#F43F5E" />
      </group>
      {[[-2.6, 0.3], [2.6, 0.5], [-2.2, 1.0]].map(([x, z], i) => (
        <Bush key={i} p={[x, 0, z]} c={i % 2 ? "#65A30D" : "#22C55E"} s={0.9} />
      ))}
      <Flower p={[-1.6, 0, 0.6]} />
      <Flower p={[-1.4, 0, 0.8]} c="#FDE047" />
      <Avatar3D position={[0.8, 0, 0.4]} rotation={[0, -0.5, 0]} pose="gesturing" shirtColor="#16A34A" hairStyle="ponytail" />
    </group>
  );
}

/* Q9 — the wash basin: running water, soap bubbles drifting up */
export function OpticalScanner3D({ position = [0, 0, 0] }: P) {
  const drops = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    drops.current.forEach((m, i) => {
      if (m) m.position.y = 1.28 - ((t * 1.6 + i / 6) % 1) * 0.36;
    });
  });
  return (
    <group position={position}>
      <Ground c="#E0F2FE" />
      <RoomWall c="#F0F9FF" />
      {Array.from({ length: 16 }, (_, i) => (
        <Box key={i} p={[-2.25 + (i % 8) * 0.64, 0.6 + Math.floor(i / 8) * 0.62, -2.47]} s={[0.6, 0.58, 0.02]} c={i % 2 ? "#FFFFFF" : "#E0F2FE"} />
      ))}
      {/* basin, tap and mirror */}
      <group position={[-0.5, 0, -1.3]} scale={1.25}>
        <Box p={[0, 0.4, 0]} s={[1.0, 0.8, 0.6]} c="#5EEAD4" />
        <Box p={[0, 0.4, 0.305]} s={[0.02, 0.6, 0.01]} c="#0F766E" />
        <Cyl p={[0, 0.9, 0]} r1={0.45} r2={0.3} h={0.22} c="#FFFFFF" seg={28} />
        <Cyl p={[0, 1.0, 0]} r1={0.38} h={0.02} c="#7DD3FC" seg={28} />
        <Cyl p={[0, 1.2, -0.3]} r1={0.03} h={0.35} c="#CBD5E1" seg={10} />
        <Cyl p={[0, 1.36, -0.18]} r1={0.025} h={0.26} c="#CBD5E1" seg={10} rot={[Math.PI / 2, 0, 0]} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} ref={(m) => { drops.current[i] = m; }} position={[0, 1.2, -0.05]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.8} />
          </mesh>
        ))}
        <Box p={[0, 1.95, -0.52]} s={[0.8, 0.9, 0.03]} c="#E2E8F0" />
        <Box p={[0, 1.95, -0.5]} s={[0.72, 0.82, 0.02]} c="#DBEAFE" />
        {/* soap bar */}
        <Box p={[0.35, 1.03, 0.1]} s={[0.14, 0.05, 0.09]} c="#F9A8D4" />
      </group>
      {[[-0.8, 1.4, -1.6], [-0.1, 1.7, -1.5], [0.3, 1.3, -1.2], [-0.5, 2.1, -1.3], [0.6, 1.9, -1.0]].map((p, i) => (
        <Bob key={i} position={p as [number, number, number]} amp={0.18} speed={0.8 + i * 0.15}>
          <mesh>
            <sphereGeometry args={[0.07 + (i % 3) * 0.03, 16, 16]} />
            <meshStandardMaterial color="#E0F2FE" transparent opacity={0.5} roughness={0.05} metalness={0.2} />
          </mesh>
        </Bob>
      ))}
      <Box p={[1.4, 1.3, -2.4]} s={[0.1, 0.05, 0.15]} c="#94A3B8" />
      <Box p={[1.4, 0.95, -2.35]} s={[0.5, 0.7, 0.03]} c="#86EFAC" />
      <Avatar3D position={[0.9, 0, -0.5]} rotation={[0, -0.7, 0]} pose="gesturing" shirtColor="#0EA5E9" hairStyle="short" />
    </group>
  );
}

/* Q12 — cricket practice: stumps, a ball bowled down the pitch, one player missing */
export function CricketPitch3D({ position = [0, 0, 0] }: P) {
  const ball = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ball.current) return;
    const k = (clock.getElapsedTime() * 0.4) % 1;
    ball.current.position.set(0, 0.1 + Math.abs(Math.sin(k * Math.PI * 2)) * 0.5 * (1 - k), 2.2 - k * 4.2);
  });
  return (
    <group position={position}>
      <Ground c="#7CCB6B" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <Mat c="#86D573" r={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[0.9, 4.6]} />
        <Mat c="#E3C98E" r={1} />
      </mesh>
      {[-2.0, 2.0].map((z) => (
        <group key={z} position={[0, 0, z]}>
          {[-0.08, 0, 0.08].map((x) => (
            <Cyl key={x} p={[x, 0.3, 0]} r1={0.015} h={0.6} c="#FEF3C7" seg={6} />
          ))}
          <Box p={[0, 0.61, 0]} s={[0.2, 0.02, 0.02]} c="#FEF3C7" />
          <Box p={[0, 0.02, 0.3]} s={[0.9, 0.01, 0.03]} c="#FFFFFF" />
        </group>
      ))}
      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.05, 14, 14]} />
        <Mat c="#DC2626" />
      </mesh>
      {/* the pavilion */}
      <group position={[-2.2, 0, -3.6]}>
        <Box p={[0, 0.8, 0]} s={[2.4, 1.6, 1.0]} c="#FFFFFF" />
        <mesh position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.9, 0.6, 4]} />
          <Mat c="#16A34A" />
        </mesh>
        <Flag p={[0.9, 1.6, 0]} h={0.9} c="#2563EB" />
      </group>
      <Avatar3D position={[0.35, 0, -2.2]} pose="standing" shirtColor="#FFFFFF" pantsColor="#F8FAFC" hairStyle="cap" hairColor="#1E3A8A" />
      <Avatar3D position={[-1.3, 0, 1.2]} rotation={[0, Math.PI * 0.8, 0]} pose="gesturing" shirtColor="#FFFFFF" pantsColor="#F8FAFC" hairStyle="short" />
      {/* an empty kit bag where the missing player should be */}
      <Box p={[1.6, 0.12, 0.6]} s={[0.7, 0.24, 0.3]} c="#1D4ED8" />
      <Tree p={[3.4, 0, -2.4]} />
      <Cloud3D position={[1.5, 3.8, -6]} />
    </group>
  );
}

/* Q13 — the storm: rain streaking down, trees bending, a figure hurrying home */
export function WeatherStation3D({ position = [0, 0, 0] }: P) {
  const rain = useRef<(THREE.Mesh | null)[]>([]);
  const drops = useRef(
    Array.from({ length: 60 }, (_, i) => [((i * 37) % 60) / 10 - 3, ((i * 53) % 40) / 10 - 2, (i * 17) % 7] as const)
  ).current;
  const flash = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    rain.current.forEach((m, i) => {
      if (m) m.position.y = 3.2 - ((t * 2.4 + drops[i][2] / 7) % 1) * 3.4;
    });
    if (flash.current) flash.current.intensity = t % 6 < 0.12 ? 8 : 0;
  });
  return (
    <group position={position}>
      <Ground c="#A7C89A" />
      <House p={[-1.6, 0, -2.4]} wall="#FEF3C7" />
      <Tree p={[1.8, 0, -1.8]} crown="#3F9B4B" />
      <Tree p={[2.8, 0, -0.6]} crown="#4CAF50" scale={0.8} />
      {/* storm clouds */}
      {[[-1.5, 3.4, -2], [0.6, 3.6, -1.6], [2.2, 3.3, -2.2]].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <Ball r={0.6} c="#94A3B8" />
          <Ball p={[0.6, -0.1, 0]} r={0.45} c="#A3B1C2" />
          <Ball p={[-0.55, -0.12, 0]} r={0.45} c="#8A99AB" />
        </group>
      ))}
      <pointLight ref={flash} position={[0.5, 3, -1]} color="#E0F2FE" intensity={0} distance={12} />
      {drops.map(([x, z], i) => (
        <mesh key={i} ref={(m) => { rain.current[i] = m; }} position={[x, 2, z]}>
          <boxGeometry args={[0.022, 0.24, 0.022]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.8} />
        </mesh>
      ))}
      {/* puddles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.012, 0.6]}>
        <circleGeometry args={[0.45, 24]} />
        <meshStandardMaterial color="#7DD3FC" transparent opacity={0.7} />
      </mesh>
      {/* someone hurrying home under an umbrella */}
      <group position={[0.3, 0, -0.4]}>
        <Avatar3D pose="walking" rotation={[0, -0.9, 0]} shirtColor="#F59E0B" hairStyle="short" />
        <group position={[0.1, 0, 0]}>
          <Cyl p={[0, 1.6, 0]} r1={0.015} h={0.9} c="#475569" seg={6} />
          <mesh position={[0, 2.1, 0]} castShadow>
            <coneGeometry args={[0.6, 0.3, 12, 1, true]} />
            <meshStandardMaterial color="#EF4444" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
      {/* the wind vane on the weather post */}
      <group position={[-2.6, 0, 0.2]}>
        <Cyl p={[0, 1.1, 0]} r1={0.03} h={2.2} c="#94A3B8" seg={8} />
        <Spin position={[0, 2.25, 0]} speed={2.5}>
          {[0, 1, 2].map((k) => (
            <group key={k} rotation={[0, (k * Math.PI * 2) / 3, 0]}>
              <Box p={[0.2, 0, 0]} s={[0.4, 0.015, 0.015]} c="#64748B" />
              <Ball p={[0.4, 0, 0]} r={0.05} c="#F43F5E" s={[1, 1, 0.6]} />
            </group>
          ))}
        </Spin>
      </group>
    </group>
  );
}

/* Q14 — a busy park; a signpost points the way to a quieter one */
export function ParkTrail3D({ position = [0, 0, 0] }: P) {
  const crowd: [number, number, string, NonNullable<React.ComponentProps<typeof Avatar3D>["pose"]>][] = [
    [-1.6, -0.6, "#F43F5E", "walking"],
    [-1.0, -1.5, "#22C55E", "standing"],
    [0.9, -1.3, "#3B82F6", "gesturing"],
    [1.6, -0.3, "#A855F7", "walking"],
    [-2.3, -1.9, "#F59E0B", "standing"],
  ];
  return (
    <group position={position}>
      <Ground c="#8BD27A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <planeGeometry args={[1.0, 30]} />
        <Mat c="#E3D2B0" r={1} />
      </mesh>
      {crowd.map(([x, z, c, pose], i) => (
        <Avatar3D key={i} position={[x, 0, z]} rotation={[0, (i * 1.3) % 3, 0]} pose={pose} scale={0.85} shirtColor={c} hairStyle={i % 2 ? "ponytail" : "short"} />
      ))}
      <Dog p={[-0.6, 0, -0.9]} rot={[0, 1.2, 0]} s={0.6} />
      <Bench p={[2.4, 0, -1.8]} rot={[0, -0.5, 0]} />
      {/* signpost: to the other park */}
      <group position={[0.8, 0, 0.3]}>
        <Cyl p={[0, 0.8, 0]} r1={0.04} h={1.6} c="#8B5A2B" seg={8} />
        <group position={[0.3, 1.4, 0]}>
          <Box s={[0.6, 0.2, 0.04]} c="#FEF3C7" />
          <mesh position={[0.36, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.1, 0.14, 3]} />
            <Mat c="#FEF3C7" />
          </mesh>
          <Box p={[-0.05, 0, 0.025]} s={[0.4, 0.04, 0.01]} c="#16A34A" />
        </group>
      </group>
      <Tree p={[-2.8, 0, -2.6]} />
      <Tree p={[2.9, 0, -3.0]} scale={1.2} />
      <Tree p={[-3.2, 0, 0.2]} scale={0.9} />
      <Bush p={[2.6, 0, 0.8]} />
      <Cloud3D position={[0, 3.8, -6]} />
    </group>
  );
}

/* Q15 — the train platform: a train pulls in and leaves while Reena walks on ahead */
export function TrainPlatform3D({ position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <Ground c="#D6DCE4" />
      {/* tracks */}
      {[-1.9, -1.3].map((x) => (
        <Box key={x} p={[x, 0.04, 0]} s={[0.06, 0.08, 40]} c="#94A3B8" />
      ))}
      {Array.from({ length: 30 }, (_, i) => (
        <Box key={i} p={[-1.6, 0.02, -15 + i]} s={[1.0, 0.04, 0.16]} c="#A16207" />
      ))}
      {/* the platform */}
      <Box p={[1.5, 0.25, 0]} s={[5, 0.5, 40]} c="#E5E7EB" />
      <Box p={[-0.97, 0.51, 0]} s={[0.12, 0.01, 40]} c="#FACC15" />
      {[0.4, 2.8].map((x) => (
        <Cyl key={x} p={[x, 1.6, -1.2]} r1={0.05} h={2.2} c="#64748B" seg={8} />
      ))}
      <Box p={[1.6, 2.72, -1.2]} s={[3.0, 0.08, 1.4]} c="#0EA5E9" />
      <group position={[1.6, 2.2, -0.6]}>
        <Box s={[0.9, 0.3, 0.05]} c="#1E3A8A" />
        <Box p={[0, 0, 0.03]} s={[0.7, 0.08, 0.01]} c="#FDE047" />
      </group>
      <Bench p={[2.2, 0.5, -0.8]} rot={[0, -Math.PI / 2, 0]} w={1.2} />
      {/* the train running through */}
      <group position={[-1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Drift from={-14} to={14} speed={0.04} loop>
          <group>
            {[0, 1, 2].map((k) => (
              <group key={k} position={[-k * 2.3, 0, 0]}>
                <Box p={[0, 0.95, 0]} s={[2.2, 1.4, 1.1]} c={k === 0 ? "#DC2626" : "#F87171"} r={0.4} />
                {[-0.6, 0, 0.6].map((x) => (
                  <Box key={x} p={[x, 1.2, 0.56]} s={[0.4, 0.4, 0.02]} c="#BFE3F7" />
                ))}
              </group>
            ))}
            <Box p={[1.11, 1.2, 0]} s={[0.02, 0.5, 0.8]} c="#BFE3F7" />
          </group>
        </Drift>
      </group>
      <Avatar3D position={[1.2, 0.5, -1.5]} rotation={[0, 0.4, 0]} pose="standing" shirtColor="#6366F1" hairStyle="short" />
      <Avatar3D position={[0.8, 0.5, -1.9]} rotation={[0, 0.8, 0]} pose="holding_cup" shirtColor="#14B8A6" hairStyle="bun" />
    </group>
  );
}

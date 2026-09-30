"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "../ieo_g6_seta-play/avatar3D";
import { Ball, Box, Bush, Cyl, Flower, House, Mountain, RoomWall, Table, Tree } from "../ieo_g6_seta-play/props3D";
import { Spin, Steam } from "../ieo_g6_seta-play/scene";
import type { LabWorldProps } from "./lab";
import { Gear, Glide, Globe, Ground, Particles, Sign, rnd, useEased } from "./bits";

/* ══════════════════════════════════════════════════════════════════════
   Worlds Q26–Q50. Reading worlds stage the passage; achiever worlds hold
   the task the student must carry out (it can be done by clicking in the
   world or from the task bar under it).
   ══════════════════════════════════════════════════════════════════════ */

const tilt = (y: number): [number, number, number] => [0, y, 0];

/** Makes a mesh group clickable for an achiever step, with a pointer cursor. */
function Hit({ on, onHit, children }: { on: boolean; onHit: () => void; children: React.ReactNode }) {
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (on) onHit();
      }}
      onPointerOver={() => on && (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {children}
    </group>
  );
}

/* Q26 — increments accumulating in the growth machine */
function W26({ filled }: LabWorldProps) {
  const stack = useRef<(THREE.Mesh | null)[]>([]);
  const n = useRef(1);
  const clock = useRef(0);
  useFrame((_, dt) => {
    clock.current += dt;
    if (clock.current > (filled ? 0.35 : 0.9)) {
      clock.current = 0;
      n.current = n.current >= 12 ? 1 : n.current + 1;
    }
    stack.current.forEach((m, i) => m && (m.visible = i < n.current));
  });
  return (
    <group>
      <Ground c="#E0F2FE" />
      <RoomWall z={-2.4} c="#F0F9FF" />
      {/* the machine */}
      <Box p={[-1.3, 0.8, -1.2]} s={[1.2, 1.6, 1]} c="#6366F1" />
      <Box p={[-1.3, 1.1, -0.69]} s={[0.8, 0.4, 0.02]} c="#0F172A" />
      <Sign p={[-1.3, 1.1, -0.67]} w={0.76} h={0.36} text="+1 each turn" size={44} bg="#0F172A" fg="#86EFAC" border="#0F172A" />
      <Spin position={[-1.3, 1.75, -1.2]} axis="y" speed={1.4}>
        <Gear r={0.25} teeth={10} c="#FBBF24" speed={0} />
      </Spin>
      <Box p={[-0.4, 0.5, -1]} s={[0.8, 0.08, 0.3]} c="#94A3B8" />
      {/* the growing stack */}
      <group position={[0.8, 0, -0.6]}>
        <Cyl p={[0, 0.03, 0]} r1={0.45} h={0.06} c="#CBD5E1" />
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} ref={(m) => { stack.current[i] = m; }} position={[0, 0.1 + i * 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.11, 24]} />
            <meshStandardMaterial color={i % 2 ? "#F59E0B" : "#FBBF24"} metalness={0.4} roughness={0.35} />
          </mesh>
        ))}
      </group>
      <Avatar3D position={[1.8, 0, 0.5]} rotation={tilt(-1)} pose={filled ? "pointing" : "thinking"} shirtColor="#0EA5E9" hairStyle="short" hasGlasses />
    </group>
  );
}

/* Q27 — the walled village and the open world */
function W27({ filled }: LabWorldProps) {
  const walls = useRef<THREE.Group>(null);
  useEased(filled, (k) => {
    if (walls.current) walls.current.position.y = -k * 0.55;
  });
  return (
    <group>
      <Ground c="#D9F99D" />
      {/* the little walled village — only its own streets in view */}
      <group position={[-1.5, 0, -0.4]}>
        <House p={[-0.3, 0, 0]} w={0.8} h={0.7} d={0.7} />
        <House p={[0.5, 0, -0.3]} w={0.7} h={0.6} d={0.6} roof="#B45309" />
        <group ref={walls}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} p={[i < 2 ? 0 : (i === 2 ? -1 : 1) * 1.1, 0.35, i < 2 ? (i ? 1 : -1) * 0.9 : 0]} s={i < 2 ? [2.3, 0.7, 0.12] : [0.12, 0.7, 1.9]} c="#A8A29E" />
          ))}
        </group>
      </group>
      {/* the observatory globe */}
      <Cyl p={[1.5, 0.3, -0.8]} r1={0.4} r2={0.6} h={0.6} c="#64748B" />
      <Globe p={[1.5, 1.35, -0.8]} r={0.75} spin={filled ? 0.5 : 0.12} />
      <Avatar3D position={[0.3, 0, 0.8]} rotation={tilt(filled ? -0.6 : 0.6)} pose={filled ? "gesturing" : "standing"} shirtColor="#7C3AED" hairStyle="beret" />
    </group>
  );
}

/* Q28 — meshing gears and the argument */
function W28({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#F1F5F9" />
      <RoomWall z={-2.4} c="#F8FAFC" />
      {/* two gears that mesh */}
      <group position={[-1.2, 1.4, -1.6]}>
        <Gear p={[-0.33, 0, 0]} r={0.36} teeth={12} c="#38BDF8" speed={0.8} />
        <Gear p={[0.4, 0, 0]} r={0.36} teeth={12} c="#F472B6" speed={-0.8} phase={0.26} />
        <Sign p={[0.03, -0.7, 0]} w={0.9} h={0.22} text="mesh" size={56} bg="#FFFFFF" fg="#0369A1" />
      </group>
      {/* a woven mesh panel */}
      <group position={[0.2, 1.3, -2.3]}>
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={`v${i}`} p={[-0.6 + i * 0.15, 0, 0]} s={[0.02, 1.2, 0.02]} c="#64748B" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={`h${i}`} p={[0, -0.6 + i * 0.15, 0.02]} s={[1.2, 0.02, 0.02]} c="#64748B" />
        ))}
      </group>
      {/* two friends: getting on, or not */}
      <Avatar3D position={[1.1, 0, 0.2]} rotation={tilt(filled ? -1.9 : -1.2)} pose={filled ? "shaking_head" : "gesturing"} shirtColor="#F59E0B" hairStyle="short" />
      <Avatar3D position={[2, 0, -0.2]} rotation={tilt(filled ? 1.9 : 1.2)} pose={filled ? "shrugging" : "gesturing"} shirtColor="#10B981" hairStyle="ponytail" />
    </group>
  );
}

/* Q29 — the detective office of wrongly named things */
function W29({ filled }: LabWorldProps) {
  const lamp = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (lamp.current) lamp.current.rotation.z = Math.sin(clock.getElapsedTime() * (filled ? 2.2 : 0.8)) * 0.25;
  });
  return (
    <group>
      <Ground c="#E7E5E4" />
      <RoomWall z={-2.4} c="#F5F5F4" windows={[1.8]} />
      <Table p={[-0.4, 0, -0.8]} w={1.8} d={0.9} top="#78350F" leg="#451A03" />
      <group ref={lamp} position={[-0.4, 2.3, -0.8]}>
        <Cyl p={[0, -0.4, 0]} r1={0.01} h={0.8} c="#1F2937" />
        <mesh position={[0, -0.85, 0]}>
          <coneGeometry args={[0.2, 0.2, 16, 1, true]} />
          <meshStandardMaterial color="#15803D" side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, -0.95, 0]} intensity={2} distance={3} color="#FEF08A" />
      </group>
      {/* objects wearing the wrong name tags */}
      <group position={[-0.9, 0.78, -0.7]}>
        <Ball r={0.12} c="#EF4444" />
        <Sign p={[0, 0.3, 0]} w={0.5} h={0.16} text="banana" size={48} bg="#FEF3C7" fg="#7C2D12" />
      </group>
      <group position={[-0.1, 0.8, -0.7]}>
        <Cyl r1={0.08} h={0.2} c="#FFFFFF" />
        <Sign p={[0, 0.32, 0]} w={0.5} h={0.16} text="teapot" size={48} bg="#FEF3C7" fg="#7C2D12" />
      </group>
      {/* the magnifier */}
      <group position={[0.3, 0.78, -0.5]} rotation={[0, 0, 0.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.02, 8, 24]} />
          <meshStandardMaterial color="#B45309" />
        </mesh>
        <Box p={[0.2, 0, 0]} s={[0.22, 0.03, 0.03]} c="#78350F" />
      </group>
      <Avatar3D position={[1, 0, 0]} rotation={tilt(-0.8)} pose={filled ? "pointing" : "thinking"} shirtColor="#57534E" hairStyle="hat" />
    </group>
  );
}

/* Q30 — the four-seasons garden */
function W30({ filled }: LabWorldProps) {
  const year = useRef(0);
  const annuals = useRef<(THREE.Group | null)[]>([]);
  const sky = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    year.current = (year.current + dt * (filled ? 0.2 : 0.06)) % 1;
    const season = year.current;
    // annual flowers bloom in spring/summer only
    const bloom = Math.max(0, Math.sin(season * Math.PI * 2));
    annuals.current.forEach((g) => g && g.scale.setScalar(0.05 + bloom));
    const m = sky.current?.material as THREE.MeshBasicMaterial | undefined;
    if (m) m.color.setHSL(0.55 - 0.1 * Math.cos(season * Math.PI * 2), 0.5, 0.75);
  });
  return (
    <group>
      <Ground c="#A3E635" />
      <mesh ref={sky} position={[0, 3, -5]}>
        <planeGeometry args={[16, 8]} />
        <meshBasicMaterial color="#BAE6FD" />
      </mesh>
      {/* the perennial shrub — there every season */}
      <Bush p={[0, 0, -0.6]} c="#15803D" s={1.6} />
      <Flower p={[0.3, 0.55, -0.4]} c="#A855F7" />
      {/* annuals that come and go */}
      {[-1.8, -1.2, 1.2, 1.8].map((x, i) => (
        <group key={x} ref={(g) => { annuals.current[i] = g; }} position={[x, 0, 0]}>
          <Flower c={["#F43F5E", "#FBBF24", "#FB923C", "#EC4899"][i]} />
        </group>
      ))}
      <Tree p={[-2.6, 0, -2.2]} />
      <Avatar3D position={[1.1, 0, 0.9]} rotation={tilt(-2.6)} pose={filled ? "kneeling" : "standing"} shirtColor="#65A30D" hairStyle="hat" />
    </group>
  );
}

/* Reading room for the worry passage: thoughts orbit a desk; collected ones settle. */
function WorryRoom({ filled, kind }: { filled: boolean; kind: "title" | "alarm" | "list" | "lens" }) {
  const orbit = useRef<THREE.Group>(null);
  const alarm = useRef<THREE.PointLight>(null);
  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    if (orbit.current) orbit.current.rotation.y += dt * (filled ? 0.1 : 0.4);
    if (alarm.current) alarm.current.intensity = kind === "alarm" ? 1.5 + Math.sin(t * 6) * 1.5 : 0;
  });
  return (
    <group>
      <Ground c="#EDE9FE" />
      <RoomWall z={-2.4} c="#F5F3FF" windows={[-1.8]} />
      <Table p={[0, 0, -0.5]} w={1.4} d={0.8} top="#C4B5FD" leg="#7C3AED" />
      {/* the list pad */}
      <Box p={[-0.2, 0.75, -0.4]} s={[0.4, 0.01, 0.5]} c="#FFFFFF" />
      {Array.from({ length: kind === "list" ? 10 : 4 }, (_, i) => (
        <Box key={i} p={[-0.2, 0.757, -0.6 + i * (kind === "list" ? 0.042 : 0.08)]} s={[0.3, 0.004, 0.01]} c="#64748B" />
      ))}
      {/* the brain's alarm lamp */}
      {kind === "alarm" && (
        <group position={[1.5, 1.8, -2.2]}>
          <Ball r={0.18} c="#F87171" />
          <pointLight ref={alarm} color="#EF4444" distance={4} />
        </group>
      )}
      {/* the lens */}
      {kind === "lens" && (
        <group position={[0.9, 1.1, 0]}>
          <mesh rotation={[0, 0.5, 0]}>
            <torusGeometry args={[0.28, 0.04, 10, 32]} />
            <meshStandardMaterial color="#1E293B" metalness={0.6} />
          </mesh>
          <mesh rotation={[0, 0.5, 0]}>
            <circleGeometry args={[0.26, 32]} />
            <meshStandardMaterial color="#BAE6FD" transparent opacity={0.35} />
          </mesh>
        </group>
      )}
      {/* orbiting worry bubbles */}
      <group ref={orbit} position={[0, 1.6, -0.5]}>
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const near = kind === "lens" && i === 0;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.5, Math.sin(i * 1.7) * 0.35, Math.sin(a) * 1.1]} scale={near ? 1.4 : 1}>
              <sphereGeometry args={[0.13, 16, 12]} />
              <meshStandardMaterial color={i % 3 === 0 ? "#FCA5A5" : i % 3 === 1 ? "#FDE68A" : "#A5B4FC"} transparent opacity={kind === "lens" && !near ? 0.35 : 0.9} />
            </mesh>
          );
        })}
      </group>
      <Avatar3D position={[0, 0, 0.3]} rotation={tilt(Math.PI)} pose={filled ? "sitting_studying" : "thinking"} shirtColor="#8B5CF6" hairStyle="ponytail" expression={filled ? "happy" : "worried"} />
    </group>
  );
}
const W31 = ({ filled }: LabWorldProps) => <WorryRoom filled={filled} kind="title" />;
const W32 = ({ filled }: LabWorldProps) => <WorryRoom filled={filled} kind="alarm" />;
const W33 = ({ filled }: LabWorldProps) => <WorryRoom filled={filled} kind="list" />;
const W35 = ({ filled }: LabWorldProps) => <WorryRoom filled={filled} kind="lens" />;

/** A wall calendar whose pages flip to the number of days the student set. */
function DayCalendar({ days, label }: { days: number | null; label: string }) {
  const page = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (page.current) page.current.rotation.x = days ? -Math.abs(Math.sin(clock.getElapsedTime() * 3)) * 0.4 : 0;
  });
  return (
    <group position={[0, 0, -2.3]}>
      <Box p={[0, 1.55, 0]} s={[1.6, 1.3, 0.05]} c="#DC2626" />
      <Sign p={[0, 1.35, 0.04]} w={1.5} h={0.8} text={days === null ? "—" : label} size={days === null ? 80 : 60} bg="#FFFFFF" fg="#111827" />
      <group ref={page} position={[0, 1.75, 0.06]}>
        <Box p={[0, -0.2, 0]} s={[1.5, 0.4, 0.01]} c="#FEF2F2" />
      </group>
    </group>
  );
}

/* Q34 — how far ahead to look */
function W34({ word, filled }: LabWorldProps) {
  const DAYS: Record<string, number> = { "1 day": 1, "10 days": 10, "6 months": 182, "180 weeks": 1260 };
  const days = word ? DAYS[word] ?? null : null;
  return (
    <group>
      <Ground c="#EDE9FE" />
      <RoomWall z={-2.4} c="#F5F3FF" />
      <DayCalendar days={days} label={days === null ? "" : `${word}\n≈ ${days.toLocaleString()} day${days === 1 ? "" : "s"}`} />
      <Table p={[0, 0, -0.5]} w={1.4} d={0.8} top="#C4B5FD" leg="#7C3AED" />
      <Box p={[-0.2, 0.75, -0.4]} s={[0.4, 0.01, 0.5]} c="#FFFFFF" />
      <Avatar3D position={[0, 0, 0.3]} rotation={tilt(Math.PI)} pose={filled ? "sitting_studying" : "thinking"} shirtColor="#8B5CF6" hairStyle="ponytail" />
    </group>
  );
}

/** The sugar-lab kitchen: allowed foods stay out, the sweets go into the bin when the case is closed. */
function SugarLab({ filled, kind }: { filled: boolean; kind: "sort" | "mirror" | "taste" | "balance" }) {
  const beam = useRef<THREE.Group>(null);
  useEased(filled, (k, t) => {
    if (beam.current) beam.current.rotation.z = kind === "balance" ? (1 - k) * 0.35 + Math.sin(t * 1.5) * 0.02 : 0;
  });
  const sweets = useRef<THREE.Group>(null);
  useEased(filled && kind === "sort", (k) => {
    if (sweets.current) {
      sweets.current.position.set(-0.6 + k * 1.95, 0.78 + Math.sin(k * Math.PI) * 0.5, -0.5 + k * 0.1);
      sweets.current.scale.setScalar(1 - k * 0.5);
    }
  });
  return (
    <group>
      <Ground c="#FEF3C7" />
      <RoomWall z={-2.4} c="#FFFBEB" windows={[1.8]} />
      <Box p={[0, 0.45, -1.9]} s={[4.4, 0.9, 0.6]} c="#E7E5E4" />
      <Table p={[0, 0, -0.5]} w={1.8} d={0.8} top="#FFFFFF" />
      {/* allowed: eggs, fish, salad, nuts, water */}
      {[0, 1, 2].map((i) => (
        <Ball key={i} p={[0.25 + i * 0.12, 0.8, -0.35]} r={0.05} c="#FFFBEB" s={[1, 1.25, 1]} />
      ))}
      <Box p={[0.55, 0.77, -0.65]} s={[0.25, 0.05, 0.12]} c="#FB923C" />
      <Cyl p={[0.2, 0.78, -0.7]} r1={0.12} h={0.05} c="#22C55E" />
      <Cyl p={[0.75, 0.84, -0.35]} r1={0.04} h={0.2} c="#BAE6FD" />
      {/* the sweets */}
      <group ref={sweets} position={[-0.6, 0.78, -0.5]}>
        <Box s={[0.2, 0.05, 0.12]} c="#F472B6" />
        <Ball p={[0.18, 0.03, 0.05]} r={0.04} c="#EF4444" />
        <Ball p={[0.1, 0.03, -0.08]} r={0.04} c="#A855F7" />
        {kind === "taste" && [0, 1, 2].map((i) => <Box key={i} p={[-0.2 + i * 0.08, 0.02, 0.15]} s={[0.06, 0.005, 0.1]} c={["#F9A8D4", "#93C5FD", "#FDE047"][i]} />)}
      </group>
      <Cyl p={[1.4, 0.3, -0.4]} r1={0.22} r2={0.18} h={0.6} c="#475569" />
      {/* the mirror for the skin question */}
      {kind === "mirror" && (
        <group position={[-1.8, 1.4, -2.3]}>
          <Box s={[0.8, 1.1, 0.04]} c="#CBD5E1" />
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.7, 1]} />
            <meshStandardMaterial color="#E0F2FE" metalness={0.8} roughness={0.1} />
          </mesh>
        </group>
      )}
      {/* the energy balance */}
      {kind === "balance" && (
        <group position={[-1.7, 0, -0.9]}>
          <Cyl p={[0, 0.6, 0]} r1={0.05} h={1.2} c="#64748B" />
          <group ref={beam} position={[0, 1.22, 0]}>
            <Box s={[1.4, 0.05, 0.05]} c="#475569" />
            <group position={[-0.65, -0.2, 0]}>
              <Cyl r1={0.2} h={0.03} c="#FBBF24" />
              <Ball p={[0, 0.08, 0]} r={0.08} c="#F59E0B" />
            </group>
            <group position={[0.65, -0.2, 0]}>
              <Cyl r1={0.2} h={0.03} c="#FBBF24" />
              <Box p={[0, 0.06, 0]} s={[0.12, 0.08, 0.1]} c="#22C55E" />
            </group>
          </group>
        </group>
      )}
      <Steam position={[0.75, 0.95, -0.35]} count={3} />
      <Avatar3D position={[0.9, 0, 0.5]} rotation={tilt(-2.6)} pose={filled ? "pointing" : "reading"} shirtColor="#FFFFFF" pantsColor="#1F2937" hairStyle="bun" hasGlasses />
    </group>
  );
}
const W36 = ({ filled }: LabWorldProps) => <SugarLab filled={filled} kind="sort" />;
const W37 = ({ filled }: LabWorldProps) => <SugarLab filled={filled} kind="mirror" />;
const W39 = ({ filled }: LabWorldProps) => <SugarLab filled={filled} kind="taste" />;
const W40 = ({ filled }: LabWorldProps) => <SugarLab filled={filled} kind="balance" />;

/* Q38 — how long the detox lasts */
function W38({ word, filled }: LabWorldProps) {
  const LABEL: Record<string, string> = {
    "Breakfast, lunch and dinner": "3 meals\n= 1 day",
    "3 days": "3 days",
    "A week": "7 days",
    "Whole life": "every day\nfor ever",
  };
  return (
    <group>
      <Ground c="#FEF3C7" />
      <RoomWall z={-2.4} c="#FFFBEB" />
      <DayCalendar days={word ? 1 : null} label={word ? LABEL[word] ?? word : ""} />
      <Table p={[0, 0, -0.5]} w={1.8} d={0.8} top="#FFFFFF" />
      {/* the three meals on the plan */}
      {[-0.55, 0, 0.55].map((x, i) => (
        <group key={x} position={[x, 0.76, -0.5]}>
          <Cyl r1={0.18} h={0.02} c="#F8FAFC" />
          {i === 0 && [0, 1, 2].map((k) => <Ball key={k} p={[-0.06 + k * 0.06, 0.04, 0]} r={0.035} c="#FFFBEB" />)}
          {i === 1 && <Box p={[0, 0.03, 0]} s={[0.16, 0.04, 0.08]} c="#FB923C" />}
          {i === 2 && <Ball p={[0, 0.04, 0]} r={0.07} c="#16A34A" s={[1, 0.6, 1]} />}
        </group>
      ))}
      <Avatar3D position={[0.9, 0, 0.5]} rotation={tilt(-2.6)} pose={filled ? "pointing" : "reading"} shirtColor="#FFFFFF" pantsColor="#1F2937" hairStyle="bun" hasGlasses />
    </group>
  );
}

/* Q41 — the builder who takes shortcuts */
function W41({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#D6D3D1" />
      {/* half-built wall, one corner left unfinished */}
      <group position={[-0.6, 0, -1.2]}>
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 8 - (r > 2 ? 3 : 0) }, (_, c) => (
            <Box key={`${r}-${c}`} p={[-1 + c * 0.3 + (r % 2) * 0.15, 0.1 + r * 0.2, 0]} s={[0.28, 0.18, 0.3]} c={(r + c) % 3 ? "#B45309" : "#C2410C"} />
          ))
        )}
      </group>
      {/* scaffold */}
      {[-1.8, 0.8].map((x) => (
        <Cyl key={x} p={[x, 1.1, -0.8]} r1={0.03} h={2.2} c="#64748B" />
      ))}
      <Box p={[-0.5, 1.4, -0.8]} s={[2.7, 0.05, 0.4]} c="#A16207" />
      <Sign p={[1.8, 1, 0.2]} rot={tilt(-0.5)} w={1} h={0.5} text={"QUOTE\nJimmy's Builders"} size={40} post bg="#FFFFFF" fg="#0F172A" />
      <Avatar3D position={[0.6, 0, 0]} rotation={tilt(-0.4)} pose={filled ? "shrugging" : "carrying"} shirtColor="#F97316" hairStyle="cap" />
      <Avatar3D position={[-1.6, 0, 0.8]} rotation={tilt(0.8)} pose="phone" shirtColor="#2563EB" hairStyle="short" />
      <Avatar3D position={[-0.7, 0, 1.1]} rotation={tilt(0.2)} pose={filled ? "shaking_head" : "gesturing"} shirtColor="#16A34A" hairStyle="short" />
    </group>
  );
}

/* Q42 — the missed breakfast */
function W42({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#FEF9C3" />
      <RoomWall z={-2.4} c="#FFFBEB" windows={[-1.6]} />
      <group position={[1.4, 0, -2.3]}>
        <Sign p={[0, 2, 0.02]} w={0.9} h={0.3} text="7:30 — breakfast" size={44} />
        <Sign p={[0, 1.6, 0.02]} w={0.9} h={0.3} text="11:00 — now" size={44} fg="#DC2626" />
      </group>
      <Table p={[-0.4, 0, -0.8]} w={1.4} d={0.8} top="#FDE68A" />
      <Cyl p={[-0.4, 0.76, -0.7]} r1={0.2} h={0.02} c="#FFFFFF" />
      <Cyl p={[-0.1, 0.8, -0.9]} r1={0.05} h={0.1} c="#FFFFFF" />
      <Box p={[-0.8, 0.8, -0.9]} s={[0.2, 0.1, 0.12]} c="#F59E0B" />
      <Avatar3D position={[0.7, 0, 0.3]} rotation={tilt(-0.7)} pose={filled ? "tired" : "standing"} shirtColor="#EC4899" hairStyle="ponytail" expression="worried" />
      <Particles count={filled ? 8 : 0} size={0.03} color="#F59E0B" layout={(i, t, out) => out.set(0.7 + Math.sin(t * 2 + i) * 0.3, 1.9 + ((t * 0.4 + i / 8) % 1) * 0.6, 0.3)} />
    </group>
  );
}

/* Q43 — the room that only needs the hoovering */
function W43({ filled }: LabWorldProps) {
  const hoover = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (hoover.current) hoover.current.position.x = 0.5 + (filled ? Math.sin(clock.getElapsedTime() * 2) * 0.5 : 0);
  });
  return (
    <group>
      <Ground c="#E0E7FF" />
      <RoomWall z={-2.4} c="#EEF2FF" windows={[1.5]} />
      {/* made bed, tidy shelf */}
      <Box p={[-1.7, 0.3, -1.6]} s={[1.2, 0.4, 1.4]} c="#A5B4FC" />
      <Box p={[-1.7, 0.55, -1.6]} s={[1.2, 0.1, 1.4]} c="#FFFFFF" />
      <Box p={[1.8, 1, -2.2]} s={[0.9, 0.05, 0.3]} c="#92400E" />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} p={[1.5 + i * 0.18, 1.14, -2.2]} s={[0.12, 0.24, 0.2]} c={["#EF4444", "#3B82F6", "#22C55E", "#F59E0B"][i]} />
      ))}
      {/* dust still on the rug */}
      <Box p={[0.2, 0.01, 0]} s={[2, 0.01, 1.2]} c="#C7D2FE" />
      <Particles count={40} size={0.018} color="#78716C" layout={(i, t, out) => out.set(-0.7 + rnd(i) * 1.8, 0.025, -0.5 + rnd(i + 3) * 1)} />
      <group ref={hoover} position={[0.5, 0, 0.2]}>
        <Box p={[0, 0.08, 0]} s={[0.35, 0.12, 0.25]} c="#DC2626" />
        <Cyl p={[0, 0.55, -0.05]} r1={0.02} h={0.9} c="#475569" rot={[0.2, 0, 0]} />
      </group>
      <Avatar3D position={[0.9, 0, 0.6]} rotation={tilt(-2.4)} pose={filled ? "carrying" : "standing"} shirtColor="#14B8A6" hairStyle="ponytail" />
      <Avatar3D position={[-0.6, 0, 1.2]} rotation={tilt(-0.4)} pose="gesturing" shirtColor="#9333EA" hairStyle="bun" />
    </group>
  );
}

/* Q44 — the baking tin that looks too small */
function W44({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#FFE4E6" />
      <RoomWall z={-2.4} c="#FFF1F2" windows={[-1.8]} />
      <Table p={[0, 0, -0.6]} w={2} d={0.9} top="#FFFFFF" />
      {/* the tin */}
      <Cyl p={[-0.3, 0.8, -0.6]} r1={0.16} h={0.1} c="#94A3B8" />
      {/* the mixing bowl — the batter for twelve */}
      <Cyl p={[0.45, 0.88, -0.6]} r1={0.34} r2={0.22} h={0.28} c="#FDE68A" />
      <Cyl p={[0.45, 1.01, -0.6]} r1={0.3} h={0.02} c="#FEF3C7" />
      {/* the twelve plates */}
      {Array.from({ length: 12 }, (_, i) => (
        <Cyl key={i} p={[-2 + (i % 6) * 0.8 * 0.5, 0.02 + Math.floor(i / 6) * 0.02, 1.2]} r1={0.12} h={0.015} c="#F8FAFC" />
      ))}
      <Sign p={[1.8, 1.8, -2.35]} w={0.9} h={0.3} text="Party for 12" size={48} bg="#FFFFFF" fg="#BE123C" />
      <Avatar3D position={[-1.1, 0, 0]} rotation={tilt(0.8)} pose="pointing" shirtColor="#F43F5E" hairStyle="ponytail" />
      <Avatar3D position={[1.2, 0, 0]} rotation={tilt(-0.8)} pose={filled ? "shaking_head" : "thinking"} shirtColor="#8B5CF6" hairStyle="bun" />
    </group>
  );
}

/* Q45 — yesterday's chance to ask */
function W45({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#E0F2FE" />
      {/* yesterday (left, faded) and today (right) */}
      <Box p={[-1.5, 0.005, 0]} s={[3, 0.01, 4]} c="#CBD5E1" />
      <Sign p={[-1.5, 2.3, -1.6]} w={1.1} h={0.3} text="yesterday" size={52} bg="#E2E8F0" fg="#475569" />
      <Sign p={[1.5, 2.3, -1.6]} w={1.1} h={0.3} text="today" size={52} bg="#FFFFFF" fg="#0369A1" />
      <group position={[-1.5, 0, -0.4]}>
        <Avatar3D position={[-0.4, 0, 0]} rotation={tilt(0.8)} pose="gesturing" shirtColor="#F472B6" hairStyle="ponytail" />
        <Avatar3D position={[0.4, 0, 0]} rotation={tilt(-0.8)} pose="phone" shirtColor="#94A3B8" hairStyle="short" />
      </group>
      <group position={[1.5, 0, -0.4]}>
        <Avatar3D position={[-0.4, 0, 0]} rotation={tilt(0.8)} pose={filled ? "shrugging" : "gesturing"} shirtColor="#F472B6" hairStyle="ponytail" />
        <Avatar3D position={[0.4, 0, 0]} rotation={tilt(-0.8)} pose="thinking" shirtColor="#3B82F6" hairStyle="short" expression="worried" />
      </group>
      <Box p={[0, 1, -0.4]} s={[0.04, 2, 3]} c="#94A3B8" />
    </group>
  );
}

/* Q46 — getting through the storm (achiever) */
function W46({ extra, poke, filled }: LabWorldProps) {
  const steps = ["tree", "wind", "shelter"];
  const done = steps.filter((s) => extra[s]).length;
  const next = steps[done];
  const team = useRef<THREE.Group>(null);
  const flash = useRef<THREE.PointLight>(null);
  const x = useRef(-2.2);
  useFrame(({ clock }, dt) => {
    const target = [-2.2, -0.9, 0.4, 1.8][done];
    x.current += (target - x.current) * Math.min(1, dt * 1.5);
    if (team.current) {
      team.current.position.x = x.current;
      team.current.rotation.z = done === 1 ? 0.15 + Math.sin(clock.getElapsedTime() * 5) * 0.05 : 0;
    }
    if (flash.current) flash.current.intensity = clock.getElapsedTime() % 4 < 0.1 ? 10 : 0;
  });
  return (
    <group>
      <Ground c="#64748B" />
      <Mountain p={[-3, 0, -7]} h={3} r={3} c="#475569" snow={false} />
      {[[-1.5, 3, -1], [0.5, 3.3, -1.5], [2, 3, -1]].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <Ball r={0.7} c="#475569" />
          <Ball p={[0.6, -0.1, 0]} r={0.5} c="#334155" />
        </group>
      ))}
      <pointLight ref={flash} position={[0, 3, 0]} color="#E0F2FE" distance={12} />
      <Particles count={360} size={0.02} color="#93C5FD" layout={(i, t, out) => out.set(-3 + ((rnd(i) * 6 + t * 1.2) % 6), 3 - ((t * (3 + rnd(i + 2)) + rnd(i + 5) * 3) % 3), -1.5 + rnd(i + 9) * 3)} />
      {/* obstacle 1: fallen tree */}
      <Hit on={next === "tree"} onHit={() => poke("tree", true)}>
        <group position={[-1.5, 0.15, 0.2]} rotation={[0, 0.3, Math.PI / 2]}>
          <Cyl r1={0.12} r2={0.16} h={1.6} c={next === "tree" ? "#B45309" : "#78350F"} />
        </group>
      </Hit>
      {/* obstacle 2: the gust */}
      <Hit on={next === "wind"} onHit={() => poke("wind", true)}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.2, 0.8 + i * 0.35, 0.2]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.35, 0.03, 6, 20, Math.PI]} />
            <meshStandardMaterial color={next === "wind" ? "#F8FAFC" : "#CBD5E1"} transparent opacity={0.7} />
          </mesh>
        ))}
      </Hit>
      {/* the shelter */}
      <Hit on={next === "shelter"} onHit={() => poke("shelter", true)}>
        <House p={[2.2, 0, -0.3]} w={1.2} h={1} d={1} wall={next === "shelter" ? "#FEF3C7" : "#E7E5E4"} roof="#1D4ED8" />
      </Hit>
      <group ref={team} position={[-2.2, 0, 0.6]}>
        <Avatar3D position={[0, 0, 0]} rotation={tilt(Math.PI / 2)} pose={done >= 3 ? (filled ? "jumping" : "gesturing") : "walking"} shirtColor="#FACC15" hairStyle="cap" />
        <Avatar3D position={[-0.45, 0, 0.3]} rotation={tilt(Math.PI / 2)} pose={done >= 3 ? "gesturing" : "walking"} shirtColor="#F97316" hairStyle="ponytail" />
      </group>
    </group>
  );
}

/* Q47 — the summer workload (achiever) */
function W47({ extra, poke, filled }: LabWorldProps) {
  const steps = ["june", "july", "august"];
  const done = steps.filter((s) => extra[s]).length;
  const next = steps[done];
  return (
    <group>
      <Ground c="#FEF08A" />
      <RoomWall z={-2.4} c="#FEFCE8" windows={[-2]} />
      {/* summer planner board */}
      <group position={[0.6, 0.4, -2.3]}>
        <Box p={[0, 1.2, 0]} s={[2.6, 1.3, 0.05]} c="#FFFFFF" />
        {["June", "July", "August"].map((m, i) => (
          <group key={m} position={[-0.85 + i * 0.85, 1.2, 0.04]}>
            <Sign p={[0, 0.45, 0]} w={0.7} h={0.2} text={m} size={44} bg="#FDE68A" fg="#78350F" border="#FDE68A" />
            {Array.from({ length: i < done ? 3 : 0 }, (_, k) => (
              <Box key={k} p={[0, 0.15 - k * 0.22, 0.02]} s={[0.6, 0.16, 0.02]} c={["#F87171", "#60A5FA", "#34D399"][k]} />
            ))}
          </group>
        ))}
      </group>
      {/* the crates of work waiting */}
      {steps.map((s, i) =>
        extra[s] ? null : (
          <Hit key={s} on={next === s} onHit={() => poke(s, true)}>
            <group position={[-1.6 + i * 0.7, 0, 0]}>
              <Box p={[0, 0.25, 0]} s={[0.5, 0.5, 0.5]} c={next === s ? "#D97706" : "#A16207"} />
              <Box p={[0, 0.51, 0]} s={[0.52, 0.03, 0.52]} c="#78350F" />
            </group>
          </Hit>
        )
      )}
      <Avatar3D position={[1.5, 0, 0.4]} rotation={tilt(-0.8)} pose={done >= 3 ? (filled ? "tired" : "thinking") : "carrying"} shirtColor="#0EA5E9" hairStyle="short" />
      <group position={[2.4, 0, -0.8]}>
        <PalmSun />
      </group>
    </group>
  );
}

function PalmSun() {
  return (
    <group>
      <Cyl p={[0, 0.02, 0]} r1={0.5} h={0.04} c="#FDE68A" />
      <mesh position={[0, 2.6, -1]}>
        <sphereGeometry args={[0.35, 16, 12]} />
        <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

/* Q48 — bringing the wild machine under control (achiever) */
function W48({ extra, poke, filled }: LabWorldProps) {
  const levers = ["lever1", "lever2", "lever3"];
  const done = levers.filter((s) => extra[s]).length;
  const next = levers[done];
  const body = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const wild = (3 - done) / 3;
    if (body.current) {
      body.current.rotation.z = Math.sin(t * 17) * 0.08 * wild;
      body.current.position.x = Math.sin(t * 23) * 0.05 * wild;
      body.current.position.y = Math.abs(Math.sin(t * 11)) * 0.1 * wild;
    }
  });
  return (
    <group>
      <Ground c="#CBD5E1" />
      <RoomWall z={-2.6} c="#E2E8F0" />
      <group ref={body} position={[0, 0, -1.1]}>
        <Box p={[0, 0.8, 0]} s={[1.8, 1.4, 1]} c="#475569" />
        <Gear p={[-0.45, 1.1, 0.52]} r={0.22} teeth={10} c="#FBBF24" speed={4 * ((3 - done) / 3) + 0.3} />
        <Gear p={[0.05, 1.1, 0.52]} r={0.22} teeth={10} c="#F97316" speed={-4 * ((3 - done) / 3) - 0.3} phase={0.3} />
        <mesh position={[0.55, 1.1, 0.52]}>
          <circleGeometry args={[0.18, 24]} />
          <meshStandardMaterial color={done >= 3 ? "#22C55E" : "#EF4444"} emissive={done >= 3 ? "#22C55E" : "#EF4444"} emissiveIntensity={0.6} />
        </mesh>
        <Steam position={[0.6, 1.55, 0]} count={done >= 3 ? 1 : 5} color="#E2E8F0" />
      </group>
      {/* the three control levers */}
      {levers.map((l, i) => (
        <Hit key={l} on={next === l} onHit={() => poke(l, true)}>
          <group position={[-0.6 + i * 0.6, 0, 0.3]}>
            <Box p={[0, 0.2, 0]} s={[0.3, 0.4, 0.3]} c="#334155" />
            <group position={[0, 0.4, 0]} rotation={[extra[l] ? 0.7 : -0.7, 0, 0]}>
              <Cyl p={[0, 0.3, 0]} r1={0.03} h={0.6} c="#94A3B8" />
              <Ball p={[0, 0.62, 0]} r={0.07} c={next === l ? "#F43F5E" : extra[l] ? "#22C55E" : "#991B1B"} />
            </group>
          </group>
        </Hit>
      ))}
      <Avatar3D position={[1.6, 0, 0.6]} rotation={tilt(-1)} pose={done >= 3 ? (filled ? "gesturing" : "standing") : "pointing"} shirtColor="#1D4ED8" hairStyle="cap" expression={done >= 3 ? "happy" : "worried"} />
    </group>
  );
}

/* Q49 — the material-testing lab (achiever) */
const SAMPLES = [
  { id: "sponge", label: "sponge", c: "#FDE047", passes: true },
  { id: "stone", label: "stone", c: "#A8A29E", passes: false },
  { id: "glass", label: "glass", c: "#BAE6FD", passes: false },
  { id: "sheet", label: "waterproof sheet", c: "#1D4ED8", passes: false },
];
function W49({ extra, poke }: LabWorldProps) {
  const next = SAMPLES.find((s) => !extra[s.id])?.id;
  const last = [...SAMPLES].reverse().find((s) => extra[s.id]);
  const spray = useRef(0);
  const prev = useRef<string | undefined>(undefined);
  useFrame((_, dt) => {
    if (last?.id !== prev.current) {
      prev.current = last?.id;
      spray.current = 1;
    }
    spray.current = Math.max(0, spray.current - dt * 0.25);
  });
  return (
    <group>
      <Ground c="#E0F2FE" />
      <RoomWall z={-2.4} c="#F0F9FF" />
      {/* the fluid chamber */}
      <Box p={[0, 0.02, -0.6]} s={[4.2, 0.04, 1.4]} c="#94A3B8" />
      {SAMPLES.map((s, i) => {
        const x = -1.5 + i * 1;
        const tested = !!extra[s.id];
        return (
          <group key={s.id} position={[x, 0, -0.6]}>
            {/* stand with a gap below */}
            <Box p={[-0.3, 0.3, 0]} s={[0.06, 0.6, 0.5]} c="#64748B" />
            <Box p={[0.3, 0.3, 0]} s={[0.06, 0.6, 0.5]} c="#64748B" />
            <Hit on={next === s.id} onHit={() => poke(s.id, true)}>
              <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[0.6, 0.18, 0.5]} />
                <meshStandardMaterial color={s.c} transparent={s.id === "glass"} opacity={s.id === "glass" ? 0.55 : 1} roughness={s.id === "sponge" ? 1 : 0.3} />
              </mesh>
            </Hit>
            {/* nozzle */}
            <Cyl p={[0, 1.5, 0]} r1={0.04} r2={0.08} h={0.2} c="#334155" />
            {/* spray above */}
            {tested && (
              <Particles
                count={40}
                size={0.018}
                color="#2563EB"
                layout={(k, t, out) => {
                  const y = 1.4 - ((t * 1.6 + rnd(k)) % 1) * 0.6;
                  out.set((rnd(k + 1) - 0.5) * 0.4, y, (rnd(k + 2) - 0.5) * 0.3);
                }}
              />
            )}
            {/* what comes through below — or the puddle on top */}
            {tested && s.passes && (
              <Particles
                count={30}
                size={0.018}
                color="#3B82F6"
                layout={(k, t, out) => {
                  const y = 0.6 - ((t * 1.3 + rnd(k + 4)) % 1) * 0.58;
                  out.set((rnd(k + 5) - 0.5) * 0.4, y, (rnd(k + 6) - 0.5) * 0.3);
                }}
              />
            )}
            {tested && !s.passes && <Box p={[0, 0.8, 0]} s={[0.56, 0.02, 0.46]} c="#60A5FA" />}
            {tested && s.passes && <Cyl p={[0, 0.05, 0]} r1={0.22} h={0.02} c="#60A5FA" />}
            <Sign p={[0, 0.25, 0.3]} w={0.62} h={0.16} text={s.label} size={40} />
          </group>
        );
      })}
      <Avatar3D position={[2.3, 0, 0.6]} rotation={tilt(-1.1)} pose={next ? "pointing" : "thinking"} shirtColor="#FFFFFF" pantsColor="#0F172A" hairStyle="short" hasGlasses />
    </group>
  );
}

/* Q50 — everyone at the rule board before the game (achiever) */
function W50({ extra, poke, filled }: LabWorldProps) {
  const steps = ["felix", "maya", "rules"];
  const done = steps.filter((s) => extra[s]).length;
  const next = steps[done];
  return (
    <group>
      <Ground c="#DDD6FE" />
      <RoomWall z={-2.4} c="#EDE9FE" />
      {/* game table */}
      <Table p={[0, 0, 0.3]} w={1.4} d={1} top="#15803D" leg="#14532D" />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} p={[-0.4 + i * 0.27, 0.76, 0.3]} s={[0.2, 0.02, 0.28]} c={["#F87171", "#60A5FA", "#FBBF24", "#34D399"][i]} />
      ))}
      {/* the rule board */}
      <Hit on={next === "rules"} onHit={() => poke("rules", true)}>
        <group position={[0, 0, -2.2]}>
          <Box p={[0, 1.45, 0]} s={[1.8, 1.3, 0.06]} c={next === "rules" ? "#FDE68A" : "#FFFFFF"} />
          <Sign p={[0, 1.45, 0.04]} w={1.7} h={1.2} text={"RULES\n1. Take turns\n2. No peeking\n3. Highest wins"} size={40} bg={next === "rules" ? "#FEF9C3" : "#FFFFFF"} fg="#312E81" />
        </group>
      </Hit>
      <Hit on={next === "felix"} onHit={() => poke("felix", true)}>
        <Glide on={!!extra.felix} from={[-2, 0, 0.8]} to={[-0.45, 0, -1.4]} rotFrom={tilt(1)} rotTo={tilt(Math.PI)}>
          <Avatar3D pose={extra.rules ? (filled ? "gesturing" : "reading") : next === "felix" ? "gesturing" : "standing"} shirtColor="#2563EB" hairStyle="short" />
        </Glide>
      </Hit>
      <Hit on={next === "maya"} onHit={() => poke("maya", true)}>
        <Glide on={!!extra.maya} from={[2, 0, 0.8]} to={[0.45, 0, -1.4]} rotFrom={tilt(-1)} rotTo={tilt(Math.PI)}>
          <Avatar3D pose={extra.rules ? (filled ? "gesturing" : "reading") : "phone"} shirtColor="#DB2777" hairStyle="ponytail" />
        </Glide>
      </Hit>
    </group>
  );
}

export const WORLDS_B: Record<number, React.ComponentType<LabWorldProps>> = {
  26: W26, 27: W27, 28: W28, 29: W29, 30: W30, 31: W31, 32: W32, 33: W33, 34: W34, 35: W35, 36: W36, 37: W37, 38: W38,
  39: W39, 40: W40, 41: W41, 42: W42, 43: W43, 44: W44, 45: W45, 46: W46, 47: W47, 48: W48, 49: W49, 50: W50,
};

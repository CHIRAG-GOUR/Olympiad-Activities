"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar3D } from "../ieo_g6_seta-play/avatar3D";
import { Balloon, Ball, Bench, Box, Bunting, Bush, Car, Cyl, Dog, Flag, Flower, House, Mountain, RoomWall, Table, Tree, Water } from "../ieo_g6_seta-play/props3D";
import { Cloud3D, Spin, Steam } from "../ieo_g6_seta-play/scene";
import type { LabWorldProps } from "./lab";
import { Bird, ClockFace, Elephant, Fridge, Glide, Globe, Ground, Particles, Sign, Whale, onSphere, rnd, useEased } from "./bits";

/* ══════════════════════════════════════════════════════════════════════
   Worlds Q1–Q25. Each acts out its sentence. The change a world makes when
   the student completes the build is the same whatever they built.
   ══════════════════════════════════════════════════════════════════════ */

const tilt = (y: number): [number, number, number] => [0, y, 0];

/* Q1 — the referee who hesitates before deciding */
function W01({ filled }: LabWorldProps) {
  const card = useRef<THREE.Group>(null);
  const ball = useRef<THREE.Group>(null);
  useEased(filled, (k, t) => {
    if (card.current) {
      card.current.position.y = 1.15 + k * 0.95;
      card.current.rotation.z = (1 - k) * 0.6;
    }
    if (ball.current) ball.current.position.set(0.25 + Math.sin(t * 0.9) * 0.08, 0.12, 0.7);
  });
  return (
    <group>
      <Ground c="#4CAF50" />
      {[-3, -1.5, 0, 1.5, 3].map((x) => (
        <Box key={x} p={[x, 0.004, 0]} s={[0.04, 0.005, 6]} c="#F8FAFC" />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[0.85, 0.9, 40]} />
        <meshBasicMaterial color="#F8FAFC" />
      </mesh>
      {/* goal */}
      <group position={[0, 0, -2.6]}>
        <Box p={[-1.1, 0.6, 0]} s={[0.08, 1.2, 0.08]} c="#FFFFFF" />
        <Box p={[1.1, 0.6, 0]} s={[0.08, 1.2, 0.08]} c="#FFFFFF" />
        <Box p={[0, 1.2, 0]} s={[2.28, 0.08, 0.08]} c="#FFFFFF" />
      </group>
      {/* stands */}
      {[0, 1, 2].map((r) => (
        <Box key={r} p={[0, 0.25 + r * 0.35, -3.6 - r * 0.45]} s={[8, 0.3, 0.4]} c={["#1D4ED8", "#DC2626", "#F59E0B"][r]} />
      ))}
      <Bunting from={[-3.5, 2.2, -3.4]} to={[3.5, 2.2, -3.4]} />
      {/* the incident: one player down, one arguing */}
      <Avatar3D position={[-0.9, 0, 0.4]} rotation={tilt(0.8)} pose="lying" shirtColor="#DC2626" hairStyle="short" expression="worried" />
      <Avatar3D position={[1.2, 0, 0.3]} rotation={tilt(-0.9)} pose={filled ? "shrugging" : "gesturing"} shirtColor="#1D4ED8" hairStyle="cap" />
      <group ref={ball}>
        <Ball r={0.12} c="#FFFFFF" />
      </group>
      {/* the referee */}
      <Avatar3D position={[0.15, 0, -0.3]} rotation={tilt(0)} pose={filled ? "pointing" : "thinking"} shirtColor="#111827" pantsColor="#111827" hairStyle="ponytail" expression={filled ? "neutral" : "worried"} />
      <group ref={card} position={[0.55, 1.15, -0.2]}>
        <Box s={[0.2, 0.28, 0.02]} c="#FACC15" />
      </group>
    </group>
  );
}

/* Q2 — rain always falls from the sky downwards */
function W02({ filled, extra, poke }: LabWorldProps) {
  const heavy = filled || !!extra.cloud;
  const puddle = useRef<THREE.Mesh>(null);
  useEased(filled, (k) => puddle.current?.scale.setScalar(0.6 + k * 0.8));
  return (
    <group>
      <Ground c="#8FBF7F" />
      <Mountain p={[-3, 0, -7]} h={3} r={2.4} />
      <Mountain p={[2.5, 0, -8]} h={3.6} r={2.8} />
      <House p={[-2.2, 0, -1.8]} wall="#FEF3C7" />
      <Tree p={[2.3, 0, -1.4]} />
      {/* the observatory dome */}
      <group position={[1.6, 0, 0.3]}>
        <Cyl p={[0, 0.4, 0]} r1={0.55} h={0.8} c="#E2E8F0" />
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#F8FAFC" />
        </mesh>
        <Cyl p={[0.25, 1.15, 0]} r1={0.08} h={0.6} c="#64748B" rot={[0, 0, -0.7]} />
      </group>
      {/* the cloud the student can seed */}
      <group position={[-0.3, 3.1, -0.6]} onClick={(e) => (e.stopPropagation(), poke("cloud", true))}>
        {[[0, 0, 0, 0.75], [0.7, -0.1, 0.1, 0.55], [-0.7, -0.12, 0, 0.55], [0.25, 0.3, -0.05, 0.5]].map(([x, y, z, r], i) => (
          <Ball key={i} p={[x, y, z]} r={r * (heavy ? 1.15 : 1)} c={heavy ? "#94A3B8" : "#CBD5E1"} />
        ))}
      </group>
      <Particles
        count={heavy ? 420 : 160}
        size={0.022}
        color="#2563EB"
        layout={(i, t, out) => {
          const sp = 2.2 + rnd(i) * 1.2;
          const y = 2.8 - ((t * sp + rnd(i + 7) * 3) % 2.8);
          out.set(-1.6 + rnd(i + 3) * 2.6, y, -1.3 + rnd(i + 11) * 1.4);
        }}
      />
      <mesh ref={puddle} rotation={[-Math.PI / 2, 0, 0]} position={[-0.3, 0.01, -0.6]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#60A5FA" transparent opacity={0.65} />
      </mesh>
      <Avatar3D position={[0.9, 0, 0.9]} rotation={tilt(-0.6)} pose="pointing" shirtColor="#0EA5E9" hairStyle="short" hasGlasses />
    </group>
  );
}

/* Q3 — born in Italy, never tasted pasta this good */
function W03({ filled }: LabWorldProps) {
  const fork = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (fork.current) fork.current.position.y = 0.95 + Math.abs(Math.sin(clock.getElapsedTime() * 2)) * 0.18;
  });
  return (
    <group>
      <Ground c="#F5E6CC" />
      <RoomWall z={-2.4} c="#FFF7ED" windows={[-1.6, 1.6]} />
      {/* Italian flag banner */}
      <group position={[0, 2.35, -2.35]}>
        <Box p={[-0.3, 0, 0]} s={[0.3, 0.45, 0.02]} c="#16A34A" />
        <Box p={[0, 0, 0]} s={[0.3, 0.45, 0.02]} c="#FFFFFF" />
        <Box p={[0.3, 0, 0]} s={[0.3, 0.45, 0.02]} c="#DC2626" />
      </group>
      <Table p={[0, 0, 0]} w={1.6} d={1} top="#F8FAFC" />
      {/* checked cloth + pasta */}
      <Box p={[0, 0.735, 0]} s={[1.62, 0.01, 1.02]} c="#FCA5A5" />
      <Cyl p={[0.1, 0.78, 0.1]} r1={0.25} r2={0.18} h={0.08} c="#FFFFFF" />
      {Array.from({ length: 10 }, (_, i) => (
        <Ball key={i} p={[0.1 + Math.cos(i) * 0.1, 0.84, 0.1 + Math.sin(i * 1.7) * 0.1]} r={0.06} c="#FCD34D" />
      ))}
      <Ball p={[0.12, 0.88, 0.08]} r={0.06} c="#DC2626" />
      <Steam position={[0.1, 0.9, 0.1]} />
      <group ref={fork} position={[0.3, 0.95, 0.2]}>
        <Box s={[0.02, 0.25, 0.02]} c="#94A3B8" rot={[0.4, 0, 0.3]} />
      </group>
      <Avatar3D position={[0.1, 0, 0.8]} rotation={tilt(Math.PI)} pose={filled ? "sitting_eating" : "sitting"} shirtColor="#16A34A" hairStyle="short" expression={filled ? "surprised" : "happy"} />
      <Avatar3D position={[-1.3, 0, -0.6]} rotation={tilt(0.6)} pose={filled ? "gesturing" : "standing"} shirtColor="#FFFFFF" pantsColor="#1F2937" hairStyle="hat" />
    </group>
  );
}

/* Q4 — "not really indicative of how we usually perform" */
function W04({ filled }: LabWorldProps) {
  const bars = [0.35, 0.4, 0.3, 1.4, 1.5, 1.45];
  return (
    <group>
      <Ground c="#E9D5FF" />
      {/* stage */}
      <Box p={[0, 0.2, -0.8]} s={[4.2, 0.4, 2]} c="#7C3AED" />
      <Box p={[0, 2, -1.9]} s={[4.2, 3.2, 0.1]} c="#312E81" />
      {[-1.6, 1.6].map((x) => (
        <Box key={x} p={[x, 2, -1.8]} s={[0.9, 3.2, 0.12]} c="#BE123C" />
      ))}
      <Avatar3D position={[-0.6, 0.4, -0.6]} pose={filled ? "shrugging" : "gesturing"} shirtColor="#F59E0B" hairStyle="beret" expression="worried" />
      <Avatar3D position={[0.6, 0.4, -0.6]} pose={filled ? "shrugging" : "tired"} shirtColor="#10B981" hairStyle="ponytail" expression="worried" />
      {/* the performance analyser: tonight vs the usual nights */}
      <group position={[2.3, 0, 0.6]} rotation={tilt(-0.5)}>
        <Box p={[0, 1, 0]} s={[1.5, 2, 0.1]} c="#F8FAFC" />
        {bars.map((h, i) => (
          <Box key={i} p={[-0.55 + i * 0.22, 0.25 + h / 2, 0.07]} s={[0.15, h, 0.04]} c={i < 3 ? "#F87171" : "#A78BFA"} />
        ))}
        <Sign p={[-0.33, 1.85, 0.08]} w={0.6} h={0.18} text="tonight" size={48} />
        <Sign p={[0.33, 1.85, 0.08]} w={0.6} h={0.18} text="usual" size={48} />
      </group>
    </group>
  );
}

/* Q5 — the whale is so big it is visible without binoculars */
function W05({ filled }: LabWorldProps) {
  const bino = useRef<THREE.Group>(null);
  useEased(filled, (k) => {
    if (bino.current) bino.current.position.y = 1.35 - k * 0.45;
  });
  return (
    <group>
      <Water p={[0, 0.02, -1]} w={14} d={10} c="#38BDF8" />
      <Whale p={[-0.6, 0.15, -2.2]} rot={tilt(0.2)} s={1.1} spout={filled} />
      {/* the boat */}
      <group position={[1.4, 0.05, 1.1]} rotation={tilt(-0.5)}>
        <Box p={[0, 0.15, 0]} s={[1.4, 0.3, 0.7]} c="#F8FAFC" />
        <Box p={[0, 0.32, 0]} s={[1.3, 0.04, 0.6]} c="#B45309" />
        <Avatar3D position={[0, 0.33, 0]} rotation={tilt(2.6)} pose="standing" shirtColor="#F97316" hairStyle="cap" expression={filled ? "surprised" : "happy"} scale={0.8} />
        <group ref={bino} position={[0.1, 1.35, -0.1]}>
          <Cyl p={[-0.05, 0, 0]} r1={0.03} h={0.12} c="#1F2937" rot={[Math.PI / 2, 0, 0]} />
          <Cyl p={[0.05, 0, 0]} r1={0.03} h={0.12} c="#1F2937" rot={[Math.PI / 2, 0, 0]} />
        </group>
      </group>
      <Cloud3D position={[-2, 3.4, -5]} />
      <Cloud3D position={[2.5, 3.8, -6]} scale={0.8} />
    </group>
  );
}

/* Q6 — the team whose meters stay below the target line */
function W06({ filled }: LabWorldProps) {
  const levels = [0.55, 0.62, 0.48, 0.6, 0.5, 0.58];
  return (
    <group>
      <Ground c="#E2E8F0" />
      <RoomWall z={-2.4} c="#F8FAFC" windows={[-2]} />
      {/* wall dashboard with target line */}
      <group position={[0.6, 0.4, -2.3]}>
        <Box p={[0, 1.2, 0]} s={[2.6, 1.6, 0.06]} c="#0F172A" />
        {levels.map((h, i) => (
          <Box key={i} p={[-1 + i * 0.4, 0.45 + h * 0.5, 0.05]} s={[0.24, h, 0.03]} c="#38BDF8" />
        ))}
        <Box p={[0, 1.25, 0.07]} s={[2.5, 0.03, 0.02]} c="#FACC15" />
        <Sign p={[1.05, 1.36, 0.08]} w={0.4} h={0.14} text="target" size={40} bg="#0F172A" fg="#FACC15" border="#0F172A" />
      </group>
      {levels.map((_, i) => (
        <group key={i} position={[-1.8 + (i % 3) * 1.4, 0, -0.9 + Math.floor(i / 3) * 1.3]}>
          <Table w={0.8} d={0.55} h={0.7} top="#E5E7EB" leg="#9CA3AF" />
          <Box p={[0, 0.84, -0.1]} s={[0.4, 0.26, 0.03]} c="#1F2937" />
          <Avatar3D position={[0, 0, 0.45]} rotation={tilt(Math.PI)} pose="sitting_studying" shirtColor={["#6366F1", "#F59E0B", "#10B981", "#EC4899", "#0EA5E9", "#8B5CF6"][i]} hairStyle={i % 2 ? "ponytail" : "short"} scale={0.85} />
        </group>
      ))}
      <Avatar3D position={[2.2, 0, 0.6]} rotation={tilt(-0.8)} pose={filled ? "shaking_head" : "reading"} shirtColor="#1E293B" hairStyle="bun" hasGlasses />
    </group>
  );
}

/* Q7 — the graffiti investigation board */
function W07({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#D6D3D1" />
      {/* school wall with graffiti */}
      <Box p={[-1.2, 1, -2.2]} s={[3.2, 2, 0.2]} c="#FDE68A" />
      {["#EF4444", "#3B82F6", "#22C55E", "#A855F7"].map((c, i) => (
        <Box key={c} p={[-2.2 + i * 0.7, 0.9 + (i % 2) * 0.4, -2.08]} s={[0.55, 0.12, 0.01]} c={c} rot={[0, 0, (i - 1.5) * 0.4]} />
      ))}
      <Sign p={[-1.2, 1.75, -2.08]} w={1.4} h={0.26} text="SCHOOL" size={60} bg="#FDE68A" border="#FDE68A" fg="#92400E" />
      {/* investigation board */}
      <group position={[1.5, 0, -1.1]} rotation={tilt(-0.4)}>
        <Box p={[0, 1.2, 0]} s={[1.6, 1.2, 0.05]} c="#B45309" />
        <Box p={[0, 1.2, 0.03]} s={[1.5, 1.1, 0.01]} c="#FEF3C7" />
        {[[-0.45, 1.45], [0.4, 1.5], [-0.3, 0.95], [0.45, 0.95]].map(([x, y], i) => (
          <group key={i}>
            <Box p={[x, y, 0.04]} s={[0.4, 0.28, 0.01]} c="#FFFFFF" />
            <Ball p={[x, y + 0.12, 0.06]} r={0.025} c="#DC2626" />
          </group>
        ))}
        <Box p={[0, 1.22, 0.05]} s={[0.95, 0.012, 0.01]} c="#DC2626" rot={[0, 0, filled ? -0.55 : 0.12]} />
        <Box p={[0, 1.22, 0.05]} s={[0.9, 0.012, 0.01]} c="#DC2626" rot={[0, 0, filled ? 0.6 : -0.1]} />
      </group>
      <Avatar3D position={[0.5, 0, 0.4]} rotation={tilt(-0.4)} pose={filled ? "pointing" : "thinking"} shirtColor="#57534E" hairStyle="hat" hasGlasses />
    </group>
  );
}

/* Q8 — who finished all my cold water? */
function W08({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#F1F5F9" />
      <RoomWall z={-2.3} c="#ECFEFF" windows={[1.8]} />
      <Box p={[-1.8, 0.45, -1.9]} s={[1.6, 0.9, 0.6]} c="#E7E5E4" />
      <Fridge p={[-0.4, 0, -1.8]} open={filled}>
        {/* the bottle — empty */}
        <group position={[0.1, 1.38, 0.2]}>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.36, 16]} />
            <meshStandardMaterial color="#BAE6FD" transparent opacity={0.35} />
          </mesh>
          <Cyl p={[0, 0.39, 0]} r1={0.03} h={0.06} c="#2563EB" />
        </group>
      </Fridge>
      {/* little sister with the glass */}
      <Avatar3D position={[1, 0, 0]} rotation={tilt(-0.5)} scale={0.7} pose="holding_cup" shirtColor="#F472B6" hairStyle="ponytail" expression={filled ? "surprised" : "happy"} />
      <Avatar3D position={[-0.3, 0, 0.8]} rotation={tilt(Math.PI - 0.3)} pose={filled ? "pointing" : "standing"} shirtColor="#0EA5E9" hairStyle="short" expression="worried" />
      <mesh position={[1.25, 0.9, 0.15]}>
        <cylinderGeometry args={[0.05, 0.04, 0.12, 12]} />
        <meshStandardMaterial color="#E0F2FE" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* Q9 — the teacher's question */
function W09({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#FDE68A" />
      <RoomWall z={-2.4} c="#FEFCE8" />
      <Box p={[0, 1.6, -2.3]} s={[3, 1.3, 0.06]} c="#14532D" />
      <Sign p={[0, 1.6, -2.26]} w={2.6} h={0.5} text="Do you know the answer…" size={56} bg="#14532D" fg="#F0FDF4" border="#14532D" />
      <Avatar3D position={[1.3, 0, -1.4]} rotation={tilt(-0.6)} pose={filled ? "gesturing" : "pointing"} shirtColor="#7C3AED" hairStyle="bun" hasGlasses />
      {[-1.2, 0, 1.2].map((x, i) => (
        <group key={x} position={[x - 0.3, 0, 0.6]}>
          <Table w={0.9} d={0.55} h={0.62} top="#FBBF24" leg="#78716C" />
          <Avatar3D position={[0, 0, 0.45]} rotation={tilt(Math.PI)} pose={i === 1 && filled ? "gesturing" : "sitting"} shirtColor={["#EF4444", "#3B82F6", "#22C55E"][i]} hairStyle={i === 1 ? "ponytail" : "short"} scale={0.8} />
        </group>
      ))}
    </group>
  );
}

/* Q10 — you and Katy at the party, and me as well */
function W10({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#FCE7F3" />
      <House p={[0, 0, -2.6]} w={3.4} h={1.9} wall="#FFFFFF" roof="#DB2777" />
      <Bunting from={[-2.2, 2, -1.5]} to={[2.2, 2, -1.5]} />
      <Balloon p={[-1.6, 1.8, -1.2]} c="#F43F5E" />
      <Balloon p={[-1.3, 2, -1.3]} c="#FBBF24" />
      <Balloon p={[1.5, 1.9, -1.2]} c="#3B82F6" />
      <Table p={[0, 0, -0.8]} w={1.2} d={0.6} top="#FFFFFF" />
      <Cyl p={[0, 0.85, -0.8]} r1={0.25} h={0.22} c="#F9A8D4" />
      <Avatar3D position={[-0.8, 0, 0]} rotation={tilt(0.4)} pose="jumping" shirtColor="#8B5CF6" hairStyle="short" />
      <Avatar3D position={[0.7, 0, 0]} rotation={tilt(-0.4)} pose="jumping" shirtColor="#F59E0B" hairStyle="ponytail" />
      {/* me: walks in from the gate */}
      <Glide on={filled} from={[3, 0, 1.6]} to={[0, 0, 0.7]} rotFrom={tilt(-2)} rotTo={tilt(Math.PI)}>
        <Avatar3D pose={filled ? "gesturing" : "walking"} shirtColor="#10B981" hairStyle="cap" />
      </Glide>
    </group>
  );
}

/* Q11 — the cancelled morning train */
function W11({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#CBD5E1" />
      {/* platform and track */}
      <Box p={[0, 0.2, -0.8]} s={[6, 0.4, 1.4]} c="#94A3B8" />
      {[-2.1, -1.7].map((z) => (
        <Box key={z} p={[0, 0.03, z]} s={[8, 0.05, 0.08]} c="#475569" />
      ))}
      {/* departure board */}
      <group position={[-1, 0.4, -1.2]}>
        <Cyl p={[0, 0.8, 0]} r1={0.04} h={1.6} c="#475569" />
        <Box p={[0, 1.7, 0]} s={[1.6, 0.5, 0.08]} c="#0F172A" />
        <Sign p={[0, 1.7, 0.05]} w={1.5} h={0.4} text={"07:45  CITY\nCANCELLED"} size={52} bg="#0F172A" fg="#F87171" border="#0F172A" />
      </group>
      {/* the car park */}
      <Car p={[2.2, 0, 1.2]} rot={tilt(0.3)} c="#F59E0B" />
      <Glide on={filled} from={[0, 0.4, -0.5]} to={[1.5, 0, 1]} rotFrom={tilt(0.3)} rotTo={tilt(1)}>
        <Avatar3D pose={filled ? "walking" : "phone"} shirtColor="#2563EB" hairStyle="short" hasBackpack backpackColor="#1E293B" expression="worried" />
      </Glide>
    </group>
  );
}

/* Q12 — The Old Mill */
function W12({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#86EFAC" />
      <Water p={[1.9, 0.015, 0]} w={1.2} d={8} c="#60A5FA" />
      <House p={[0, 0, -0.6]} w={2.2} h={1.9} wall="#E7E5E4" roof="#78350F" />
      {/* the old water wheel still on the wall */}
      <Spin position={[1.2, 0.9, -0.3]} rotation={[0, Math.PI / 2, 0]} axis="z" speed={filled ? 1.6 : 0.4}>
        <Cyl r1={0.75} h={0.12} c="#92400E" rot={[Math.PI / 2, 0, 0]} seg={24} />
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} p={[Math.cos((i / 8) * Math.PI * 2) * 0.72, Math.sin((i / 8) * Math.PI * 2) * 0.72, 0]} s={[0.1, 0.3, 0.3]} c="#78350F" rot={[0, 0, (i / 8) * Math.PI * 2]} />
        ))}
      </Spin>
      <Sign p={[-1.5, 1.1, 0.6]} w={1.1} h={0.3} text="The Old Mill" post size={56} bg="#FEF3C7" fg="#78350F" border="#B45309" />
      <Flower p={[-0.9, 0, 0.6]} />
      <Flower p={[-0.6, 0, 0.7]} c="#FBBF24" />
      <Avatar3D position={[-0.4, 0, 1.2]} rotation={tilt(Math.PI - 0.3)} pose={filled ? "pointing" : "standing"} shirtColor="#0D9488" hairStyle="hat" />
    </group>
  );
}

/* Q13 — crying at weddings with no tissue on hand */
function W13({ filled }: LabWorldProps) {
  const tissue = useRef<THREE.Group>(null);
  useEased(filled, (k, t) => {
    if (tissue.current) {
      tissue.current.position.y = 1.02 + k * 0.4 + Math.sin(t * 3) * 0.03 * k;
      tissue.current.scale.setScalar(0.2 + k * 0.8);
    }
  });
  return (
    <group>
      <Ground c="#FEF9C3" />
      {/* flower arch */}
      <group position={[0, 0, -1.8]}>
        {[-1, 1].map((x) => (
          <Cyl key={x} p={[x, 1, 0]} r1={0.05} h={2} c="#FFFFFF" />
        ))}
        <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1, 0.06, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <Ball key={i} p={[Math.cos((i / 8) * Math.PI), 2 + Math.sin((i / 8) * Math.PI), 0.05]} r={0.1} c={i % 2 ? "#F9A8D4" : "#FDE68A"} />
        ))}
      </group>
      <Avatar3D position={[-0.35, 0, -1.6]} pose="standing" shirtColor="#FFFFFF" pantsColor="#FFFFFF" hairStyle="bun" />
      <Avatar3D position={[0.35, 0, -1.6]} pose="standing" shirtColor="#1F2937" pantsColor="#1F2937" hairStyle="short" />
      {[-1.8, -1, 1, 1.8].map((x) => (
        <Bench key={x} p={[x, 0, 0.2]} w={0.7} c="#E5E7EB" />
      ))}
      <Avatar3D position={[1, 0, 0.35]} rotation={tilt(Math.PI)} pose="tired" shirtColor="#A855F7" hairStyle="ponytail" expression="worried" />
      {/* the tissue box */}
      <Box p={[1.35, 0.52, 0.25]} s={[0.26, 0.14, 0.16]} c="#93C5FD" />
      <group ref={tissue} position={[1.35, 1.02, 0.25]}>
        <Box s={[0.14, 0.18, 0.01]} c="#FFFFFF" rot={[0, 0, 0.3]} />
      </group>
    </group>
  );
}

/* Q14 — crumbs all over the grass */
function W14({ filled }: LabWorldProps) {
  const spread = useRef(0);
  useEased(filled, (k) => (spread.current = k), 0.8);
  return (
    <group>
      <Ground c="#65A30D" />
      <Tree p={[-2.4, 0, -1.8]} />
      <Tree p={[2.4, 0, -2.4]} scale={1.2} />
      <Box p={[0, 0.01, 0]} s={[1.8, 0.02, 1.4]} c="#EF4444" />
      {[-0.6, -0.2, 0.2, 0.6].map((x) => (
        <Box key={x} p={[x, 0.021, 0]} s={[0.18, 0.005, 1.4]} c="#FFFFFF" />
      ))}
      <Box p={[0.5, 0.2, -0.35]} s={[0.5, 0.35, 0.35]} c="#B45309" />
      <Cyl p={[-0.3, 0.06, 0.2]} r1={0.2} h={0.05} c="#FFFFFF" />
      <Particles
        count={140}
        size={0.02}
        color="#D97706"
        opacity={1}
        layout={(i, t, out) => {
          const a = rnd(i) * Math.PI * 2;
          const r = 0.1 + rnd(i + 5) * (0.3 + spread.current * 1.6);
          const lift = spread.current > 0.02 && spread.current < 0.98 ? Math.sin(spread.current * Math.PI) * 0.4 * rnd(i + 9) : 0;
          out.set(-0.3 + Math.cos(a) * r, 0.03 + lift + Math.sin(t * 3 + i) * 0.002, 0.2 + Math.sin(a) * r * 0.8);
        }}
      />
      <Avatar3D position={[-0.9, 0, 0.3]} rotation={tilt(1.2)} pose="sitting_eating" shirtColor="#0EA5E9" hairStyle="cap" />
      <Avatar3D position={[0.8, 0, 0.6]} rotation={tilt(-1.4)} pose="sitting" shirtColor="#F472B6" hairStyle="ponytail" />
      <Bird p={[2, 0.15, 1]} rot={tilt(2.6)} c="#44403C" belly="#A8A29E" />
    </group>
  );
}

/* Q15 — yesterday, before nursery, playing with the toy train */
function W15({ filled }: LabWorldProps) {
  const train = useRef<THREE.Group>(null);
  const a = useRef(0);
  useFrame((_, dt) => {
    a.current += dt * (filled ? 1.4 : 0.5);
    if (train.current) {
      train.current.position.set(Math.cos(a.current) * 0.9, 0.06, Math.sin(a.current) * 0.6);
      train.current.rotation.y = -a.current - Math.PI / 2;
    }
  });
  return (
    <group>
      <Ground c="#DBEAFE" />
      <RoomWall z={-2.3} c="#EFF6FF" windows={[1.6]} />
      <Box p={[-2, 0.3, -1.6]} s={[1.4, 0.4, 0.9]} c="#93C5FD" />
      <Box p={[-2, 0.55, -1.6]} s={[1.4, 0.12, 0.9]} c="#FFFFFF" />
      {/* yesterday's calendar page */}
      <Sign p={[1.6, 1.8, -2.25]} w={0.7} h={0.6} text={"MON\nyesterday"} size={56} bg="#FFFFFF" fg="#DC2626" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[1, 0.667, 1]}>
        <ringGeometry args={[0.85, 0.95, 48]} />
        <meshStandardMaterial color="#78350F" />
      </mesh>
      <group ref={train}>
        <Box p={[0, 0.06, 0]} s={[0.12, 0.12, 0.26]} c="#DC2626" />
        <Cyl p={[0, 0.16, 0.08]} r1={0.03} h={0.08} c="#1F2937" />
        <Box p={[0, 0.06, -0.3]} s={[0.12, 0.1, 0.22]} c="#2563EB" />
      </group>
      <Avatar3D position={[0.1, 0, 0.2]} rotation={tilt(Math.PI - 0.4)} scale={0.72} pose="kneeling" shirtColor="#FACC15" hairStyle="short" />
      {/* nursery bag by the door, ready for later */}
      <Box p={[2.1, 0.2, -0.6]} s={[0.35, 0.4, 0.2]} c="#22C55E" />
    </group>
  );
}

/* Q16 — falling head over heels for the puppy */
function W16({ filled }: LabWorldProps) {
  const kid = useRef<THREE.Group>(null);
  useEased(
    filled,
    (k) => {
      if (!kid.current) return;
      kid.current.rotation.x = -k * Math.PI * 2;
      kid.current.position.y = 0.8 + Math.sin(k * Math.PI) * 0.7;
    },
    0.9
  );
  return (
    <group>
      <Ground c="#BBF7D0" />
      <House p={[-2, 0, -2.4]} wall="#FFFBEB" roof="#EA580C" />
      <Bush p={[1.6, 0, -1.6]} />
      <Flower p={[1, 0, -1.2]} />
      <Dog p={[0.6, 0, 0.5]} rot={tilt(-2.2)} s={0.9} c="#F5D0A9" />
      <group position={[-0.5, 0, 0.3]}>
        <group ref={kid} position={[0, 0.8, 0]}>
          <group position={[0, -0.8, 0]}>
            <Avatar3D rotation={tilt(1.2)} pose={filled ? "jumping" : "kneeling"} shirtColor="#EC4899" hairStyle="ponytail" expression="happy" />
          </group>
        </group>
      </group>
      {filled &&
        [0, 1, 2].map((i) => (
          <Ball key={i} p={[-0.2 + i * 0.3, 1.9 + (i % 2) * 0.2, 0.3]} r={0.08} c="#F43F5E" s={[1, 0.9, 0.5]} />
        ))}
    </group>
  );
}

/* Q17 — working round the clock */
function W17({ filled }: LabWorldProps) {
  const sky = useRef<THREE.Mesh>(null);
  const day = useRef(0);
  useFrame((_, dt) => {
    day.current += dt * (filled ? 0.25 : 0.03);
    const m = sky.current?.material as THREE.MeshBasicMaterial | undefined;
    if (m) m.color.setHSL(0.6, 0.6, 0.35 + 0.4 * (0.5 + 0.5 * Math.cos(day.current * Math.PI * 2)));
  });
  return (
    <group>
      <Ground c="#E0E7FF" />
      <mesh ref={sky} position={[0, 3, -4]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial color="#93C5FD" />
      </mesh>
      {/* clock tower */}
      <group position={[-1.4, 0, -1.8]}>
        <Box p={[0, 1.4, 0]} s={[1, 2.8, 1]} c="#E7E5E4" />
        <mesh position={[0, 3.1, 0]}>
          <coneGeometry args={[0.8, 0.8, 4]} />
          <meshStandardMaterial color="#7C2D12" />
        </mesh>
        <ClockFace p={[0, 2.2, 0.52]} r={0.38} rate={filled ? 4 : 0.2} />
      </group>
      {/* the desk piled with revision */}
      <Table p={[0.9, 0, 0]} w={1.4} d={0.8} top="#FDE68A" />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} p={[0.5 + (i % 2) * 0.2, 0.78 + i * 0.07, -0.1]} s={[0.35, 0.06, 0.25]} c={["#EF4444", "#3B82F6", "#22C55E", "#F59E0B"][i]} />
      ))}
      <Cyl p={[1.4, 0.82, -0.2]} r1={0.05} h={0.18} c="#FFFFFF" />
      <Avatar3D position={[0.9, 0, 0.7]} rotation={tilt(Math.PI)} pose="sitting_studying" shirtColor="#6366F1" hairStyle="short" hasGlasses expression={filled ? "worried" : "neutral"} />
    </group>
  );
}

/* Q18 — the elephants of the savanna */
function W18({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#E8D7A5" />
      <Water p={[0.8, 0.015, -0.8]} w={2.2} d={1.2} c="#7DD3FC" round />
      {[[-2.6, -1.6], [2.8, -2.2], [-1.2, -3]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cyl p={[0, 0.8, 0]} r1={0.08} r2={0.12} h={1.6} c="#78350F" />
          <mesh position={[0, 1.7, 0]} scale={[1, 0.25, 1]}>
            <sphereGeometry args={[0.9, 16, 10]} />
            <meshStandardMaterial color="#65A30D" />
          </mesh>
        </group>
      ))}
      <Elephant p={[-0.8, 0, -0.6]} rot={tilt(0.3)} s={0.9} />
      <Elephant p={[0.2, 0, -1.5]} rot={tilt(-0.4)} s={1.05} />
      <Elephant p={[-0.2, 0, 0.1]} rot={tilt(0.1)} s={0.5} />
      {/* the conservation ranger arrives with the record book */}
      <Glide on={filled} from={[3, 0, 1.4]} to={[1.6, 0, 0.8]} rotFrom={tilt(-1.4)} rotTo={tilt(-0.9)}>
        <Avatar3D pose={filled ? "reading" : "walking"} shirtColor="#65A30D" pantsColor="#57534E" hairStyle="hat" />
      </Glide>
    </group>
  );
}

/* Q19 — settling into the city */
function W19({ filled }: LabWorldProps) {
  const heights = [2.4, 3.2, 1.8, 2.8, 3.6, 2.1];
  return (
    <group>
      <Ground c="#D1D5DB" />
      <Box p={[0, 0.005, 0.6]} s={[10, 0.01, 1.2]} c="#6B7280" />
      {heights.map((h, i) => (
        <group key={i} position={[-3 + i * 1.2, 0, -2.2 - (i % 2) * 0.5]}>
          <Box p={[0, h / 2, 0]} s={[1, h, 0.9]} c={["#FDE68A", "#BFDBFE", "#FBCFE8", "#BBF7D0", "#E9D5FF", "#FED7AA"][i]} />
          {Array.from({ length: Math.floor(h / 0.6) }, (_, r) => (
            <mesh key={r} position={[0, 0.4 + r * 0.6, 0.46]}>
              <planeGeometry args={[0.6, 0.25]} />
              <meshStandardMaterial color={filled ? "#FDE047" : "#64748B"} emissive={filled ? "#FACC15" : "#000000"} emissiveIntensity={filled ? 0.5 : 0} />
            </mesh>
          ))}
        </group>
      ))}
      <Glide on={filled} from={[2.8, 0, 1]} to={[0.2, 0, 0.3]} rotFrom={tilt(-1.6)} rotTo={tilt(-0.3)}>
        <Avatar3D pose={filled ? "gesturing" : "walking"} shirtColor="#F97316" hairStyle="cap" hasBackpack backpackColor="#0EA5E9" />
        <Box p={[0.3, 0.3, 0]} s={[0.3, 0.45, 0.15]} c="#7C3AED" />
      </Glide>
      <Avatar3D position={[-1.2, 0, 0.1]} rotation={tilt(0.9)} pose={filled ? "gesturing" : "standing"} shirtColor="#14B8A6" hairStyle="bun" />
      <Avatar3D position={[-2, 0, 0.5]} rotation={tilt(1.2)} pose={filled ? "gesturing" : "phone"} shirtColor="#E11D48" hairStyle="short" />
    </group>
  );
}

/* Q20 — the children behaving badly in front of the visitors */
function W20({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#FEF3C7" />
      <RoomWall z={-2.4} c="#FFFBEB" windows={[-1.8, 1.8]} />
      <Sign p={[0, 2.2, -2.35]} w={1.8} h={0.32} text="Welcome, visitors!" size={52} bg="#FFFFFF" fg="#1D4ED8" />
      {/* spilt paint and paper, scattered chairs */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.012, 0.2]}>
        <circleGeometry args={[0.35, 20]} />
        <meshStandardMaterial color="#60A5FA" />
      </mesh>
      <Box p={[0.6, 0.2, 0.4]} s={[0.4, 0.4, 0.4]} c="#F59E0B" rot={[0, 0.6, 1.3]} />
      {[[0.2, 0.3], [-0.9, -0.5], [1.1, -0.2]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.01, z]} s={[0.2, 0.005, 0.28]} c="#FFFFFF" rot={[0, i, 0]} />
      ))}
      <Avatar3D position={[-0.7, 0, -0.4]} rotation={tilt(0.4)} pose="jumping" shirtColor="#EF4444" hairStyle="short" scale={0.75} />
      <Avatar3D position={[0.3, 0, -0.7]} rotation={tilt(-0.5)} pose="gesturing" shirtColor="#22C55E" hairStyle="ponytail" scale={0.75} />
      {/* visitors at the door */}
      <Avatar3D position={[1.9, 0, 0.6]} rotation={tilt(-1.4)} pose="standing" shirtColor="#1E293B" hairStyle="short" expression="surprised" />
      <Avatar3D position={[2.3, 0, 0]} rotation={tilt(-1.6)} pose="standing" shirtColor="#6D28D9" hairStyle="bun" expression="surprised" />
      <Avatar3D position={[-1.8, 0, 0.8]} rotation={tilt(0.9)} pose={filled ? "shaking_head" : "standing"} shirtColor="#0F766E" hairStyle="bun" hasGlasses expression="worried" />
    </group>
  );
}

/* Q21 — the swallows' journey from Africa to Europe */
function W21({ filled }: LabWorldProps) {
  const flock = useRef<THREE.Group>(null);
  const t = useRef(0);
  const R = 1.25;
  const from = onSphere(8, 18, R + 0.25);
  const to = onSphere(50, 8, R + 0.25);
  useFrame((_, dt) => {
    t.current = (t.current + dt * (filled ? 0.25 : 0.06)) % 1;
    const k = t.current;
    if (flock.current) {
      const v = new THREE.Vector3(from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k).normalize().multiplyScalar(R + 0.2 + Math.sin(k * Math.PI) * 0.35);
      flock.current.position.copy(v);
      flock.current.lookAt(0, 0, 0);
    }
  });
  return (
    <group>
      <Ground c="#E0F2FE" />
      <Cyl p={[0, 0.2, 0]} r1={0.5} r2={0.7} h={0.4} c="#94A3B8" />
      <group position={[0, 1.55, 0]} rotation={[0.3, -0.35, 0]}>
        <Globe p={[0, 0, 0]} r={R} spin={0} />
        <group ref={flock}>
          {[[0, 0, 0], [0.15, 0.08, 0.1], [-0.12, 0.06, 0.12], [0.08, -0.08, 0.2]].map((q, i) => (
            <Bird key={i} p={q as [number, number, number]} s={0.4} rot={[Math.PI / 2, 0, -Math.PI / 2]} c="#1E3A8A" belly="#FCA5A5" />
          ))}
        </group>
        {/* the route line */}
        {Array.from({ length: 10 }, (_, i) => {
          const k = i / 9;
          const v = new THREE.Vector3(from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k).normalize().multiplyScalar(R + 0.05 + Math.sin(k * Math.PI) * 0.25);
          return <Ball key={i} p={[v.x, v.y, v.z]} r={0.025} c="#F97316" />;
        })}
      </group>
      <Sign p={[1.9, 0.6, 0.6]} rot={tilt(-0.6)} w={0.9} h={0.5} text={"Summer\nAfrica → Europe"} size={40} bg="#FFFFFF" fg="#0F172A" />
    </group>
  );
}

/* Q22 — the important papers to the headmaster's office */
function W22({ filled }: LabWorldProps) {
  return (
    <group>
      <Ground c="#E5E7EB" />
      <RoomWall z={-2.4} c="#F5F5F4" />
      <Box p={[1.8, 1.05, -2.35]} s={[0.9, 2.1, 0.05]} c="#78350F" />
      <Sign p={[1.8, 2.3, -2.3]} w={1.1} h={0.24} text="HEADMASTER" size={52} bg="#FEF3C7" fg="#78350F" />
      <Table p={[-1.3, 0, -0.6]} w={1.4} d={0.7} top="#D6D3D1" />
      {[0, 1, 2].map((i) => (
        <Box key={i} p={[-1.5 + i * 0.05, 0.75 + i * 0.012, -0.6]} s={[0.4, 0.01, 0.3]} c="#FFFFFF" rot={[0, i * 0.1, 0]} />
      ))}
      <Glide on={filled} from={[-0.6, 0, 0.3]} to={[1.5, 0, -1.4]} rotFrom={tilt(0.5)} rotTo={tilt(Math.PI - 0.1)}>
        <Avatar3D pose="carrying" shirtColor="#1D4ED8" hairStyle="short" />
        {/* locked briefcase */}
        <group position={[0, 0.95, 0.35]}>
          <Box s={[0.5, 0.35, 0.12]} c="#1F2937" />
          <Box p={[0, 0.02, 0.07]} s={[0.1, 0.08, 0.02]} c="#FACC15" />
        </group>
      </Glide>
    </group>
  );
}

/* Q23 — the house so quiet you can hear the tiniest mice */
function W23({ filled }: LabWorldProps) {
  const mice = useRef<(THREE.Group | null)[]>([]);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mice.current.forEach((m, i) => {
      if (!m) return;
      const x = ((t * (0.35 + i * 0.12) + i) % 3.6) - 1.8;
      m.position.set(x, 0.05, 0.9 - i * 0.3);
    });
    rings.current.forEach((r, i) => {
      if (!r) return;
      const k = (t * 0.6 + i / 3) % 1;
      r.scale.setScalar(0.2 + k * (filled ? 1.8 : 1.1));
      (r.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k);
    });
  });
  return (
    <group>
      <Ground c="#F5F5F4" />
      <RoomWall z={-2.4} c="#FAFAF9" windows={[-1.5, 1.5]} />
      <Box p={[-1.8, 0.4, -1.8]} s={[1.2, 0.8, 0.6]} c="#A8A29E" />
      <Box p={[1.8, 0.5, -1.9]} s={[0.8, 1, 0.5]} c="#78716C" />
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(g) => { mice.current[i] = g; }}>
          <Ball r={0.07} c="#9CA3AF" s={[1.6, 0.9, 1]} />
          <Ball p={[0.1, 0.03, 0.04]} r={0.03} c="#F9A8D4" />
          <Ball p={[0.1, 0.03, -0.04]} r={0.03} c="#F9A8D4" />
          <Cyl p={[-0.16, 0.01, 0]} r1={0.006} h={0.18} c="#F9A8D4" rot={[0, 0, Math.PI / 2]} />
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { rings.current[i] = m; }} position={[0, 0.25, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1, 40]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* the listening post */}
      <group position={[0.2, 0, -0.6]}>
        <Cyl p={[0, 0.6, 0]} r1={0.03} h={1.2} c="#475569" />
        <Ball p={[0, 1.25, 0]} r={0.12} c="#1F2937" />
      </group>
      <Avatar3D position={[1, 0, 0.1]} rotation={tilt(-0.6)} pose={filled ? "pointing" : "kneeling"} shirtColor="#7C3AED" hairStyle="ponytail" expression="surprised" />
    </group>
  );
}

/* Q24 — telling one twin from the other */
function W24({ filled }: LabWorldProps) {
  const beam = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (beam.current) beam.current.position.x = Math.sin(clock.getElapsedTime() * (filled ? 2.4 : 0.8)) * 0.9;
  });
  return (
    <group>
      <Ground c="#E0E7FF" />
      <RoomWall z={-2.4} c="#EEF2FF" />
      {/* scanner arch */}
      <group position={[0, 0, -0.6]}>
        {[-1.2, 1.2].map((x) => (
          <Box key={x} p={[x, 1.1, 0]} s={[0.15, 2.2, 0.3]} c="#6366F1" />
        ))}
        <Box p={[0, 2.25, 0]} s={[2.55, 0.15, 0.3]} c="#6366F1" />
        <mesh ref={beam} position={[0, 1.1, 0.05]}>
          <boxGeometry args={[0.05, 2.1, 0.05]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.8} />
        </mesh>
      </group>
      {[-0.45, 0.45].map((x) => (
        <group key={x} position={[x, 0, -0.6]}>
          <Cyl p={[0, 0.05, 0]} r1={0.35} h={0.1} c="#CBD5E1" />
          <Avatar3D position={[0, 0.1, 0]} pose="standing" shirtColor="#F97316" hairStyle="short" expression={filled ? "happy" : "neutral"} />
        </group>
      ))}
      <Avatar3D position={[1.6, 0, 0.9]} rotation={tilt(-0.9)} pose={filled ? "shrugging" : "thinking"} shirtColor="#0F766E" hairStyle="bun" hasGlasses />
    </group>
  );
}

/* Q25 — the fledgling in the workshop */
function W25({ filled }: LabWorldProps) {
  const chick = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (chick.current) chick.current.position.y = 1.72 + Math.abs(Math.sin(clock.getElapsedTime() * (filled ? 5 : 2))) * 0.12;
  });
  return (
    <group>
      <Ground c="#FDE9C9" />
      <RoomWall z={-2.4} c="#FFF7ED" windows={[1.7]} />
      {/* workbench with tools */}
      <Table p={[0, 0, -0.9]} w={2.4} d={0.8} h={0.85} top="#A16207" leg="#713F12" />
      <Box p={[-0.6, 0.93, -0.9]} s={[0.5, 0.1, 0.25]} c="#E7E5E4" />
      <Cyl p={[0.3, 0.92, -0.8]} r1={0.03} h={0.4} c="#78350F" rot={[0, 0, Math.PI / 2]} />
      <Box p={[0.55, 0.92, -0.8]} s={[0.12, 0.08, 0.08]} c="#64748B" />
      {/* tool wall */}
      {[-1.2, -0.7, -0.2, 0.3].map((x, i) => (
        <Box key={x} p={[x, 1.7, -2.35]} s={[0.08, 0.5 + (i % 2) * 0.2, 0.03]} c="#475569" />
      ))}
      {/* the fledgling in its nest on the shelf */}
      <group position={[1.4, 0, -2.1]}>
        <Box p={[0, 1.55, 0]} s={[0.8, 0.05, 0.4]} c="#92400E" />
        <mesh position={[0, 1.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.05, 8, 16]} />
          <meshStandardMaterial color="#A16207" />
        </mesh>
        <group ref={chick} position={[0, 1.72, 0]}>
          <Bird s={0.6} c="#A8A29E" belly="#FDE68A" rot={tilt(-1.2)} />
        </group>
      </group>
      <Avatar3D position={[-0.7, 0, -0.1]} rotation={tilt(0.2)} pose="gesturing" shirtColor="#1F2937" hairStyle="hat" hasGlasses />
      <Avatar3D position={[0.5, 0, -0.1]} rotation={tilt(-0.2)} scale={0.85} pose={filled ? "carrying" : "standing"} shirtColor="#F59E0B" hairStyle="cap" expression="happy" />
    </group>
  );
}

export const WORLDS_A: Record<number, React.ComponentType<LabWorldProps>> = {
  1: W01, 2: W02, 3: W03, 4: W04, 5: W05, 6: W06, 7: W07, 8: W08, 9: W09, 10: W10, 11: W11, 12: W12, 13: W13,
  14: W14, 15: W15, 16: W16, 17: W17, 18: W18, 19: W19, 20: W20, 21: W21, 22: W22, 23: W23, 24: W24, 25: W25,
};

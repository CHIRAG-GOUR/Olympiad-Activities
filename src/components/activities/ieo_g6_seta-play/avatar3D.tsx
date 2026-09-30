"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { phaseOf, useCueProgress } from "./scene";

/* ══════════════════════════════════════════════════════════════════════
   Animated 3D character.

   A jointed rig (shoulder → elbow, hip → knee) driven every frame: it breathes,
   blinks, glances around, and plays its pose's motion (walking, swimming,
   pedalling, waving, eating, writing). When the student changes their choice the
   character gives the same short hop-and-nod whatever was chosen.
   ══════════════════════════════════════════════════════════════════════ */

export interface Avatar3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  skinColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  hairColor?: string;
  hairStyle?: "short" | "ponytail" | "cap" | "beret" | "hat" | "bun" | "swimcap";
  pose?: "standing" | "sitting" | "sitting_eating" | "sitting_studying" | "walking" | "gesturing" | "holding_cup" | "holding_cone" | "swimming" | "biking" | "kneeling"
    | "jumping" | "lying" | "reading" | "carrying" | "shrugging" | "phone" | "tired" | "pointing" | "shaking_head" | "thinking" | "catching";
  expression?: "happy" | "neutral" | "surprised" | "worried";
  hasBackpack?: boolean;
  backpackColor?: string;
  hasGlasses?: boolean;
}

type Arm = { sx: number; sz: number; ex: number };
type Leg = { hip: number; knee: number };
type PoseDef = { hipY: number; L: Arm; R: Arm; legL: Leg; legR: Leg; pitch?: number };

const REST_L: Arm = { sx: 0.05, sz: -0.12, ex: -0.18 };
const REST_R: Arm = { sx: 0.05, sz: 0.12, ex: -0.18 };
const STRAIGHT: Leg = { hip: 0, knee: 0 };
const SEATED: Leg = { hip: -Math.PI / 2, knee: Math.PI / 2 };

const POSES: Record<NonNullable<Avatar3DProps["pose"]>, PoseDef> = {
  standing: { hipY: 0.86, L: REST_L, R: REST_R, legL: STRAIGHT, legR: STRAIGHT },
  walking: { hipY: 0.86, L: REST_L, R: REST_R, legL: STRAIGHT, legR: STRAIGHT },
  gesturing: { hipY: 0.86, L: { sx: -0.35, sz: -0.15, ex: -0.5 }, R: { sx: -2.4, sz: 0.35, ex: -0.35 }, legL: STRAIGHT, legR: STRAIGHT },
  holding_cup: { hipY: 0.86, L: REST_L, R: { sx: -0.75, sz: 0.1, ex: -1.35 }, legL: STRAIGHT, legR: STRAIGHT },
  holding_cone: { hipY: 0.86, L: REST_L, R: { sx: -0.8, sz: 0.1, ex: -1.4 }, legL: STRAIGHT, legR: STRAIGHT },
  sitting: { hipY: 0.6, L: { sx: -0.55, sz: -0.1, ex: -0.55 }, R: { sx: -0.55, sz: 0.1, ex: -0.55 }, legL: SEATED, legR: SEATED },
  sitting_eating: { hipY: 0.6, L: { sx: -1.0, sz: -0.2, ex: -1.3 }, R: { sx: -0.75, sz: 0.1, ex: -0.8 }, legL: SEATED, legR: SEATED },
  sitting_studying: { hipY: 0.6, L: { sx: -0.9, sz: -0.05, ex: -0.7 }, R: { sx: -0.95, sz: 0.05, ex: -0.75 }, legL: SEATED, legR: SEATED },
  kneeling: { hipY: 0.5, L: { sx: -0.85, sz: -0.1, ex: -0.5 }, R: { sx: -0.85, sz: 0.1, ex: -0.5 }, legL: { hip: 0, knee: Math.PI / 2 }, legR: { hip: 0, knee: Math.PI / 2 } },
  biking: { hipY: 0.8, L: { sx: -1.15, sz: -0.05, ex: -0.25 }, R: { sx: -1.15, sz: 0.05, ex: -0.25 }, legL: { hip: -1.2, knee: 1.2 }, legR: { hip: -1.2, knee: 1.2 } },
  swimming: { hipY: 0.28, L: REST_L, R: REST_R, legL: STRAIGHT, legR: STRAIGHT, pitch: Math.PI / 2 },
  jumping: { hipY: 0.86, L: { sx: -0.4, sz: -0.5, ex: -0.3 }, R: { sx: -0.4, sz: 0.5, ex: -0.3 }, legL: STRAIGHT, legR: STRAIGHT },
  lying: { hipY: 0.2, L: { sx: 0, sz: -0.5, ex: 0 }, R: { sx: -2.6, sz: 0.4, ex: -1.6 }, legL: STRAIGHT, legR: { hip: -0.3, knee: 0.6 }, pitch: -Math.PI / 2 },
  reading: { hipY: 0.86, L: { sx: -0.95, sz: -0.05, ex: -0.95 }, R: { sx: -0.95, sz: 0.05, ex: -0.95 }, legL: STRAIGHT, legR: STRAIGHT },
  carrying: { hipY: 0.86, L: { sx: -1.1, sz: -0.05, ex: -0.5 }, R: { sx: -1.1, sz: 0.05, ex: -0.5 }, legL: STRAIGHT, legR: STRAIGHT },
  shrugging: { hipY: 0.86, L: { sx: -0.3, sz: -0.9, ex: -1.4 }, R: { sx: -0.3, sz: 0.9, ex: -1.4 }, legL: STRAIGHT, legR: STRAIGHT },
  phone: { hipY: 0.86, L: REST_L, R: { sx: -0.5, sz: 0.55, ex: -2.4 }, legL: STRAIGHT, legR: STRAIGHT },
  tired: { hipY: 0.84, L: { sx: 0.1, sz: -0.05, ex: -0.05 }, R: { sx: 0.1, sz: 0.05, ex: -0.05 }, legL: { hip: 0, knee: 0.1 }, legR: { hip: 0, knee: 0.1 } },
  pointing: { hipY: 0.86, L: REST_L, R: { sx: -1.55, sz: 0.25, ex: -0.05 }, legL: STRAIGHT, legR: STRAIGHT },
  shaking_head: { hipY: 0.86, L: { sx: -0.2, sz: -0.3, ex: -1.6 }, R: { sx: -0.2, sz: 0.3, ex: -1.6 }, legL: STRAIGHT, legR: STRAIGHT },
  catching: { hipY: 0.84, L: { sx: -1.25, sz: -0.3, ex: -0.45 }, R: { sx: -1.25, sz: 0.3, ex: -0.45 }, legL: { hip: -0.15, knee: 0.3 }, legR: { hip: 0.1, knee: 0.15 } },
  thinking: { hipY: 0.86, L: { sx: -0.5, sz: -0.1, ex: -1.4 }, R: { sx: -0.35, sz: 0.25, ex: -2.35 }, legL: STRAIGHT, legR: STRAIGHT },
};

const THIGH = 0.42;
const SHIN = 0.42;
const UPPER_ARM = 0.3;
const FOREARM = 0.27;

function Limb({ length, radius, color }: { length: number; radius: number; color: string }) {
  return (
    <mesh position={[0, -length / 2, 0]} castShadow>
      <capsuleGeometry args={[radius, Math.max(0.01, length - radius * 2), 6, 14]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

export function Avatar3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  skinColor = "#F5C9A0",
  shirtColor = "#3B82F6",
  pantsColor,
  hairColor = "#5B3417",
  hairStyle = "short",
  pose = "standing",
  expression = "happy",
  hasBackpack = false,
  backpackColor = "#EF4444",
  hasGlasses = false,
}: Avatar3DProps) {
  const def = POSES[pose] ?? POSES.standing;
  const phase = phaseOf(position);
  // trousers vary from one character to the next unless a scene sets them
  const pants = pantsColor ?? ["#1E3A8A", "#374151", "#5B4636", "#3B5B92", "#475569"][Math.floor(phase * 7) % 5];
  const progress = useCueProgress();

  const body = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const shL = useRef<THREE.Group>(null);
  const shR = useRef<THREE.Group>(null);
  const elL = useRef<THREE.Group>(null);
  const elR = useRef<THREE.Group>(null);
  const hipL = useRef<THREE.Group>(null);
  const hipR = useRef<THREE.Group>(null);
  const knL = useRef<THREE.Group>(null);
  const knR = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase;
    const cue = progress(clock.getElapsedTime());
    const bump = cue === null ? 0 : Math.sin(Math.PI * cue);

    const L = { ...def.L };
    const R = { ...def.R };
    const lL = { ...def.legL };
    const lR = { ...def.legR };
    let lift = 0;

    if (pose === "walking") {
      const s = Math.sin(t * 5.5);
      lL.hip = 0.45 * s;
      lR.hip = -0.45 * s;
      lL.knee = Math.max(0, -s) * 0.7;
      lR.knee = Math.max(0, s) * 0.7;
      L.sx = -0.4 * s;
      R.sx = 0.4 * s;
      lift = Math.abs(Math.cos(t * 5.5)) * 0.035;
    } else if (pose === "swimming") {
      L.sx = -((t * 3) % (Math.PI * 2));
      R.sx = -((t * 3 + Math.PI) % (Math.PI * 2));
      L.ex = R.ex = -0.2;
      lL.hip = 0.25 * Math.sin(t * 9);
      lR.hip = -0.25 * Math.sin(t * 9);
      lift = 0.03 * Math.sin(t * 3);
    } else if (pose === "biking") {
      const s = Math.sin(t * 4);
      lL.hip = -1.2 + 0.35 * s;
      lR.hip = -1.2 - 0.35 * s;
      lL.knee = 1.2 - 0.3 * s;
      lR.knee = 1.2 + 0.3 * s;
    } else if (pose === "gesturing") {
      R.sz = 0.35 + 0.28 * Math.sin(t * 4.2);
      R.ex = -0.35 - 0.2 * Math.sin(t * 4.2 + 1);
    } else if (pose === "sitting_eating") {
      const s = (Math.sin(t * 1.6) + 1) / 2;
      L.sx = -0.8 - 0.45 * s;
      L.ex = -1.0 - 0.6 * s;
    } else if (pose === "sitting_studying") {
      R.ex = -0.75 + 0.06 * Math.sin(t * 9);
      R.sz = 0.05 + 0.04 * Math.sin(t * 3);
    } else if (pose === "holding_cup" || pose === "holding_cone") {
      const s = (Math.sin(t * 1.1) + 1) / 2;
      R.sx = def.R.sx - 0.25 * s;
    } else if (pose === "kneeling") {
      L.sx = -0.85 + 0.15 * Math.sin(t * 2);
      R.sx = -0.85 - 0.15 * Math.sin(t * 2);
    } else if (pose === "jumping") {
      const s = Math.abs(Math.sin(t * 3.2));
      lift = 0.35 * s;
      lL.knee = lR.knee = 0.6 * (1 - s);
      lL.hip = lR.hip = -0.3 * (1 - s);
      L.sz = -0.5 - 0.9 * s;
      R.sz = 0.5 + 0.9 * s;
    } else if (pose === "shrugging") {
      const s = (Math.sin(t * 2) + 1) / 2;
      L.sz = -0.9 - 0.25 * s;
      R.sz = 0.9 + 0.25 * s;
      lift = 0.02 * s;
    } else if (pose === "tired") {
      L.sx = 0.1 + 0.08 * Math.sin(t * 1.2);
      R.sx = 0.1 - 0.08 * Math.sin(t * 1.2);
    } else if (pose === "pointing") {
      R.sx = -1.55 + 0.08 * Math.sin(t * 2.5);
    } else if (pose === "carrying") {
      lift = 0.015 * Math.sin(t * 4);
    } else if (pose === "catching") {
      const s = Math.sin(t * 2.2);
      L.sx = -1.25 + 0.12 * s;
      R.sx = -1.25 + 0.12 * s;
      lift = 0.02 * Math.abs(s);
    } else if (pose === "phone") {
      L.sx = 0.1 * Math.sin(t * 1.5);
    }

    // The same reaction for every choice: a small hop, arms lifting, a nod.
    const standingish = def.hipY > 0.7 && pose !== "biking" && pose !== "jumping";
    if (bump) {
      L.sx -= 0.55 * bump;
      R.sx -= 0.55 * bump;
      L.sz -= 0.25 * bump;
      R.sz += 0.25 * bump;
      if (standingish) {
        lift += 0.16 * bump;
        lL.knee += 0.35 * bump;
        lR.knee += 0.35 * bump;
      }
    }

    if (body.current) body.current.position.y = def.hipY + lift;
    if (torso.current) torso.current.scale.set(1, 1 + 0.018 * Math.sin(t * 2.2), 1);
    if (head.current) {
      head.current.rotation.y =
        pose === "shaking_head" ? 0.45 * Math.sin(t * 7) : pose === "reading" ? 0.1 * Math.sin(t * 0.8) : 0.22 * Math.sin(t * 0.45) + 0.08 * Math.sin(t * 1.3);
      head.current.rotation.x =
        (pose === "tired" ? 0.45 + 0.1 * Math.sin(t * 0.9) : pose === "reading" ? 0.35 : 0.05 * Math.sin(t * 0.7)) +
        (cue === null ? 0 : 0.28 * Math.sin(cue * Math.PI * 3));
      head.current.rotation.z = pose === "thinking" || pose === "phone" ? 0.18 : 0;
    }
    if (eyes.current) eyes.current.scale.y = t % 3.7 < 0.12 ? 0.12 : 1;

    const arm = (sh: THREE.Group | null, el: THREE.Group | null, a: Arm) => {
      if (sh) sh.rotation.set(a.sx, 0, a.sz);
      if (el) el.rotation.set(a.ex, 0, 0);
    };
    arm(shL.current, elL.current, L);
    arm(shR.current, elR.current, R);
    if (hipL.current) hipL.current.rotation.x = lL.hip;
    if (hipR.current) hipR.current.rotation.x = lR.hip;
    if (knL.current) knL.current.rotation.x = lL.knee;
    if (knR.current) knR.current.rotation.x = lR.knee;
  });

  const shoe = "#1F2937";

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* soft contact shadow so the character sits on the floor */}
      {pose !== "swimming" && pose !== "lying" && (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
            <circleGeometry args={[0.42, 32]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.06} depthWrite={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
            <circleGeometry args={[0.26, 32]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.1} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* body pivots at the hips */}
      <group ref={body} position={[0, def.hipY, 0]}>
        <group rotation={[def.pitch ?? 0, 0, 0]}>
          {/* ── torso ── */}
          <group ref={torso}>
            <mesh position={[0, 0.3, 0]} scale={[1, 1, 0.78]} castShadow>
              <capsuleGeometry args={[0.2, 0.2, 12, 28]} />
              <meshStandardMaterial color={shirtColor} roughness={0.85} />
            </mesh>
            {/* neckline */}
            <mesh position={[0, 0.54, 0.07]} rotation={[-0.35, 0, 0]} scale={[1, 0.6, 1]}>
              <circleGeometry args={[0.07, 20]} />
              <meshStandardMaterial color={skinColor} roughness={0.62} />
            </mesh>
            {/* waistband */}
            <mesh position={[0, 0.06, 0]} scale={[1, 1, 0.8]} castShadow>
              <cylinderGeometry args={[0.2, 0.19, 0.1, 28]} />
              <meshStandardMaterial color={pants} roughness={0.85} />
            </mesh>
            {hasBackpack && (
              <group position={[0, 0.32, -0.22]}>
                <mesh castShadow>
                  <boxGeometry args={[0.32, 0.38, 0.14]} />
                  <meshStandardMaterial color={backpackColor} roughness={0.6} />
                </mesh>
                <mesh position={[0, -0.08, -0.08]} castShadow>
                  <boxGeometry args={[0.24, 0.16, 0.06]} />
                  <meshStandardMaterial color={backpackColor} roughness={0.5} />
                </mesh>
              </group>
            )}
          </group>

          {/* ── head ── */}
          <mesh position={[0, 0.62, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.075, 0.1, 14]} />
            <meshStandardMaterial color={skinColor} roughness={0.62} />
          </mesh>
          <group ref={head} position={[0, 0.84, 0]}>
            <mesh castShadow scale={[1, 0.97, 0.94]}>
              <sphereGeometry args={[0.26, 40, 32]} />
              <meshStandardMaterial color={skinColor} roughness={0.62} />
            </mesh>
            {/* ears */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0.25 * s, -0.01, -0.01]} scale={[0.55, 1, 0.8]}>
                <sphereGeometry args={[0.055, 14, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.62} />
              </mesh>
            ))}
            <Hair style={hairStyle} color={hairColor} />
            {/* eyes: big glossy cartoon eyes */}
            <group ref={eyes} position={[0, 0.0, 0.215]}>
              {[-1, 1].map((s) => (
                <group key={s} position={[0.088 * s, 0, 0]}>
                  <mesh scale={[0.8, 1.05, 0.5]}>
                    <sphereGeometry args={[0.052, 20, 18]} />
                    <meshStandardMaterial color="#1f1a17" roughness={0.15} />
                  </mesh>
                  <mesh position={[0.014 * s, 0.018, 0.024]}>
                    <sphereGeometry args={[0.014, 10, 10]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                  <mesh position={[-0.01 * s, -0.016, 0.024]}>
                    <sphereGeometry args={[0.007, 8, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                </group>
              ))}
            </group>
            {/* brows */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0.09 * s, 0.085, 0.228]} rotation={[0, 0, Math.PI / 2 + (expression === "worried" ? 0.35 * s : expression === "surprised" ? -0.15 * s : 0.1 * s)]}>
                <capsuleGeometry args={[0.009, 0.045, 4, 8]} />
                <meshStandardMaterial color={hairColor} roughness={0.7} />
              </mesh>
            ))}
            {/* nose */}
            <mesh position={[0, -0.045, 0.245]} scale={[1.2, 0.9, 0.8]}>
              <sphereGeometry args={[0.018, 12, 10]} />
              <meshStandardMaterial color="#e8a882" roughness={0.6} />
            </mesh>
            {/* mouth */}
            {expression === "happy" && (
              <mesh position={[0, -0.095, 0.228]} rotation={[0.25, 0, Math.PI]}>
                <torusGeometry args={[0.042, 0.011, 8, 20, Math.PI]} />
                <meshStandardMaterial color="#b4233c" roughness={0.5} />
              </mesh>
            )}
            {expression === "worried" && (
              <mesh position={[0, -0.12, 0.225]} rotation={[-0.25, 0, 0]}>
                <torusGeometry args={[0.032, 0.01, 8, 18, Math.PI]} />
                <meshStandardMaterial color="#b4233c" roughness={0.5} />
              </mesh>
            )}
            {expression === "surprised" && (
              <mesh position={[0, -0.105, 0.232]} scale={[1, 1.25, 0.6]}>
                <sphereGeometry args={[0.026, 14, 12]} />
                <meshStandardMaterial color="#7f1d1d" roughness={0.5} />
              </mesh>
            )}
            {expression === "neutral" && (
              <mesh position={[0, -0.1, 0.236]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.008, 0.04, 4, 8]} />
                <meshStandardMaterial color="#b4233c" roughness={0.5} />
              </mesh>
            )}
            {/* cheeks */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0.15 * s, -0.06, 0.19]} scale={[1, 0.7, 0.4]}>
                <sphereGeometry args={[0.035, 12, 10]} />
                <meshStandardMaterial color="#f9a8b8" transparent opacity={expression === "worried" ? 0.25 : 0.55} roughness={0.8} />
              </mesh>
            ))}
            {hasGlasses && (
              <group position={[0, 0.0, 0.262]}>
                {[-1, 1].map((s) => (
                  <mesh key={s} position={[0.088 * s, 0, 0]}>
                    <torusGeometry args={[0.058, 0.008, 8, 24]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.35} />
                  </mesh>
                ))}
                <mesh>
                  <boxGeometry args={[0.06, 0.009, 0.009]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              </group>
            )}
          </group>

          {/* ── arms ── */}
          {([
            [-1, shL, elL],
            [1, shR, elR],
          ] as const).map(([s, sh, el]) => (
            <group key={s} ref={sh} position={[0.235 * s, 0.49, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.066, 16, 16]} />
                <meshStandardMaterial color={shirtColor} roughness={0.85} />
              </mesh>
              <Limb length={UPPER_ARM} radius={0.06} color={shirtColor} />
              <group ref={el} position={[0, -UPPER_ARM, 0]}>
                <mesh>
                  <sphereGeometry args={[0.052, 14, 12]} />
                  <meshStandardMaterial color={skinColor} roughness={0.62} />
                </mesh>
                <Limb length={FOREARM} radius={0.047} color={skinColor} />
                {/* sleeve cuff */}
                <mesh position={[0, 0.0, 0]}>
                  <cylinderGeometry args={[0.066, 0.062, 0.06, 18]} />
                  <meshStandardMaterial color={shirtColor} roughness={0.85} />
                </mesh>
                <group position={[0, -FOREARM - 0.04, 0]}>
                  <mesh castShadow scale={[0.9, 1.15, 0.65]}>
                    <sphereGeometry args={[0.058, 16, 16]} />
                    <meshStandardMaterial color={skinColor} roughness={0.62} />
                  </mesh>
                  <mesh position={[0.035 * -s, 0.012, 0.025]} rotation={[0.3, 0, 0.7 * s]} castShadow>
                    <capsuleGeometry args={[0.017, 0.035, 4, 8]} />
                    <meshStandardMaterial color={skinColor} roughness={0.62} />
                  </mesh>
                </group>
                <HandProp pose={pose} side={s} />
              </group>
            </group>
          ))}

          {/* ── legs ── */}
          {([
            [-1, hipL, knL],
            [1, hipR, knR],
          ] as const).map(([s, hip, kn]) => (
            <group key={s} ref={hip} position={[0.1 * s, 0, 0]}>
              <Limb length={THIGH} radius={0.09} color={pants} />
              <group ref={kn} position={[0, -THIGH, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.084, 16, 14]} />
                  <meshStandardMaterial color={pants} roughness={0.85} />
                </mesh>
                <Limb length={SHIN} radius={0.078} color={pants} />
                {/* trouser hem */}
                {pose !== "swimming" && (
                  <mesh position={[0, -SHIN + 0.03, 0]}>
                    <cylinderGeometry args={[0.082, 0.084, 0.04, 16]} />
                    <meshStandardMaterial color={pants} roughness={0.8} />
                  </mesh>
                )}
                <mesh position={[0, -SHIN - 0.02, 0.06]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.85]} castShadow>
                  <capsuleGeometry args={[0.072, 0.13, 8, 16]} />
                  <meshStandardMaterial color={pose === "swimming" ? skinColor : shoe} roughness={0.4} />
                </mesh>
                {pose !== "swimming" && (
                  <mesh position={[0, -SHIN - 0.075, 0.06]} scale={[1, 0.35, 1]}>
                    <capsuleGeometry args={[0.075, 0.13, 6, 14]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.6} />
                  </mesh>
                )}
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

function Box3({ s, c, p = [0, 0, 0], r = [0, 0, 0] }: { s: [number, number, number]; c: string; p?: [number, number, number]; r?: [number, number, number] }) {
  return (
    <mesh position={p} rotation={r} castShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.6} />
    </mesh>
  );
}

function HandProp({ pose, side }: { pose: Avatar3DProps["pose"]; side: -1 | 1 }) {
  const at = -FOREARM - 0.05;
  if (pose === "sitting_eating" && side === -1)
    return (
      <mesh position={[0, at - 0.06, 0.04]} rotation={[0.6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
    );
  if (pose === "sitting_studying" && side === 1)
    return (
      <mesh position={[0, at - 0.04, 0.05]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, 0.16, 8]} />
        <meshStandardMaterial color="#2563eb" metalness={0.5} />
      </mesh>
    );
  if (pose === "holding_cup" && side === 1)
    return (
      <group position={[0, at, 0.06]} rotation={[Math.PI / 2 - 0.3, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.045, 0.12, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
      </group>
    );
  if (pose === "reading" && side === 1)
    return (
      <group position={[-0.12, at + 0.02, 0.06]} rotation={[1.1, 0, 0]}>
        <Box3 s={[0.2, 0.26, 0.03]} c="#2563EB" p={[-0.1, 0, 0]} r={[0, 0.3, 0]} />
        <Box3 s={[0.2, 0.26, 0.03]} c="#F43F5E" p={[0.1, 0, 0]} r={[0, -0.3, 0]} />
      </group>
    );
  if (pose === "carrying" && side === 1)
    return (
      <group position={[-0.25, at - 0.02, 0.12]}>
        <Box3 s={[0.6, 0.03, 0.34]} c="#C58B4E" />
        <Box3 s={[0.14, 0.1, 0.14]} p={[-0.12, 0.07, 0]} c="#FFFFFF" />
        <Box3 s={[0.12, 0.14, 0.12]} p={[0.14, 0.09, 0]} c="#F59E0B" />
      </group>
    );
  if (pose === "phone" && side === 1)
    return <Box3 s={[0.05, 0.14, 0.02]} p={[0, at, 0.04]} c="#1F2937" />;
  if (pose === "holding_cone" && side === 1)
    return (
      <group position={[0, at, 0.05]} rotation={[Math.PI / 2 + 0.4, 0, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.055, 0.18, 14]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.065, 14, 14]} />
          <meshStandardMaterial color="#f472b6" roughness={0.5} />
        </mesh>
      </group>
    );
  return null;
}

function Hair({ style, color }: { style: NonNullable<Avatar3DProps["hairStyle"]>; color: string }) {
  const mat = <meshStandardMaterial color={color} roughness={0.7} />;
  // a smooth shell over the top, back and sides of the head
  const shell = (
    <mesh position={[0, 0.03, -0.015]} scale={[1.02, 0.98, 1.0]} castShadow>
      <sphereGeometry args={[0.272, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
      {mat}
    </mesh>
  );
  const back = (
    <mesh position={[0, -0.03, -0.09]} scale={[1, 0.9, 0.75]} castShadow>
      <sphereGeometry args={[0.255, 32, 24]} />
      {mat}
    </mesh>
  );
  // a swept fringe: one smooth slab curving over the forehead
  const fringe = (tilt = 0.25) => (
    <mesh position={[0.02, 0.16, 0.13]} rotation={[0.95, 0, tilt]} scale={[1.3, 0.55, 0.42]} castShadow>
      <sphereGeometry args={[0.16, 28, 18]} />
      {mat}
    </mesh>
  );
  const sides = [-1, 1].map((s) => (
    <mesh key={s} position={[0.235 * s, 0.02, -0.03]} scale={[0.4, 0.95, 0.85]} castShadow>
      <sphereGeometry args={[0.12, 16, 14]} />
      {mat}
    </mesh>
  ));
  switch (style) {
    case "short":
      return (
        <group>
          {shell}
          {back}
          {fringe(0.3)}
          {sides}
        </group>
      );
    case "ponytail":
      return (
        <group>
          {shell}
          {back}
          {fringe(-0.35)}
          {sides}
          <mesh position={[0, 0.08, -0.27]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.035, 0.016, 8, 16]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.06, -0.33]} rotation={[0.3, 0, 0]} scale={[0.85, 1, 0.8]} castShadow>
            <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
            {mat}
          </mesh>
        </group>
      );
    case "bun":
      return (
        <group>
          {shell}
          {back}
          {fringe(-0.2)}
          {sides}
          <mesh position={[0, 0.26, -0.12]} castShadow>
            <sphereGeometry args={[0.105, 20, 16]} />
            {mat}
          </mesh>
        </group>
      );
    case "cap":
      return (
        <group>
          {back}
          {sides}
          <mesh position={[0, 0.05, 0]} castShadow>
            <sphereGeometry args={[0.278, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.06, 0.25]} rotation={[0.12, 0, 0]} scale={[1, 1, 1.1]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.018, 24, 1, false, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#1e40af" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.325, 0]}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshStandardMaterial color="#1e40af" />
          </mesh>
        </group>
      );
    case "beret":
      return (
        <group>
          {shell}
          {back}
          {fringe(0.2)}
          {sides}
          <mesh position={[0.03, 0.235, -0.01]} rotation={[0.1, 0, 0.18]} scale={[1, 0.28, 1]} castShadow>
            <sphereGeometry args={[0.25, 28, 18]} />
            <meshStandardMaterial color="#9f1239" roughness={0.8} />
          </mesh>
        </group>
      );
    case "hat":
      return (
        <group>
          {back}
          {sides}
          {fringe(0.2)}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 0.16, 28]} />
            <meshStandardMaterial color="#e7c27d" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.252, 0.252, 0.04, 28]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.13, 0]} scale={[1, 0.08, 1]} castShadow>
            <sphereGeometry args={[0.42, 32, 12]} />
            <meshStandardMaterial color="#e7c27d" roughness={0.85} />
          </mesh>
        </group>
      );
    case "swimcap":
      return (
        <mesh position={[0, 0.02, 0]} castShadow>
          <sphereGeometry args={[0.275, 32, 22, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.1} />
        </mesh>
      );
  }
}

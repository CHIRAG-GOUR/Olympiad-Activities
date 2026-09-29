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
  pose?: "standing" | "sitting" | "sitting_eating" | "sitting_studying" | "walking" | "gesturing" | "holding_cup" | "holding_cone" | "swimming" | "biking" | "kneeling";
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
};

const THIGH = 0.42;
const SHIN = 0.42;
const UPPER_ARM = 0.3;
const FOREARM = 0.27;

function Limb({ length, radius, color }: { length: number; radius: number; color: string }) {
  return (
    <mesh position={[0, -length / 2, 0]} castShadow>
      <capsuleGeometry args={[radius, Math.max(0.01, length - radius * 2), 6, 14]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}

export function Avatar3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  skinColor = "#F5C9A0",
  shirtColor = "#3B82F6",
  pantsColor = "#1E3A8A",
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
    }

    // The same reaction for every choice: a small hop, arms lifting, a nod.
    const standingish = def.hipY > 0.7 && pose !== "biking";
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
      head.current.rotation.y = 0.22 * Math.sin(t * 0.45) + 0.08 * Math.sin(t * 1.3);
      head.current.rotation.x = 0.05 * Math.sin(t * 0.7) + (cue === null ? 0 : 0.28 * Math.sin(cue * Math.PI * 3));
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
      {pose !== "swimming" && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <circleGeometry args={[0.32, 24]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      )}

      {/* body pivots at the hips */}
      <group ref={body} position={[0, def.hipY, 0]}>
        <group rotation={[def.pitch ?? 0, 0, 0]}>
          {/* ── torso ── */}
          <group ref={torso}>
            <mesh position={[0, 0.28, 0]} castShadow>
              <capsuleGeometry args={[0.19, 0.26, 8, 18]} />
              <meshStandardMaterial color={shirtColor} roughness={0.7} />
            </mesh>
            {/* belt line */}
            <mesh position={[0, 0.03, 0]} castShadow>
              <cylinderGeometry args={[0.195, 0.19, 0.08, 18]} />
              <meshStandardMaterial color={pantsColor} roughness={0.7} />
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
          <mesh position={[0, 0.66, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.1, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          <group ref={head} position={[0, 0.8, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.22, 28, 28]} />
              <meshStandardMaterial color={skinColor} roughness={0.55} />
            </mesh>
            {/* ears */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0.215 * s, 0, 0]}>
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshStandardMaterial color={skinColor} roughness={0.6} />
              </mesh>
            ))}
            <Hair style={hairStyle} color={hairColor} />
            {/* eyes */}
            <group ref={eyes} position={[0, 0.03, 0.18]}>
              {[-1, 1].map((s) => (
                <group key={s} position={[0.075 * s, 0, 0]}>
                  <mesh>
                    <sphereGeometry args={[0.045, 14, 14]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 0, 0.032]}>
                    <sphereGeometry args={[0.024, 12, 12]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.2} />
                  </mesh>
                  <mesh position={[0.008, 0.01, 0.052]}>
                    <sphereGeometry args={[0.007, 8, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                </group>
              ))}
            </group>
            {/* brows */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0.075 * s, 0.1, 0.2]} rotation={[0, 0, expression === "worried" ? 0.3 * s : expression === "surprised" ? -0.1 * s : 0]}>
                <boxGeometry args={[0.06, 0.013, 0.012]} />
                <meshStandardMaterial color={hairColor} />
              </mesh>
            ))}
            {/* nose */}
            <mesh position={[0, -0.02, 0.215]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </mesh>
            {/* mouth */}
            {expression === "happy" && (
              <mesh position={[0, -0.08, 0.195]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.04, 0.009, 8, 18, Math.PI]} />
                <meshStandardMaterial color="#9f1239" />
              </mesh>
            )}
            {expression === "worried" && (
              <mesh position={[0, -0.11, 0.195]}>
                <torusGeometry args={[0.035, 0.009, 8, 18, Math.PI]} />
                <meshStandardMaterial color="#9f1239" />
              </mesh>
            )}
            {expression === "surprised" && (
              <mesh position={[0, -0.09, 0.2]}>
                <sphereGeometry args={[0.028, 12, 12]} />
                <meshStandardMaterial color="#9f1239" />
              </mesh>
            )}
            {expression === "neutral" && (
              <mesh position={[0, -0.09, 0.205]}>
                <boxGeometry args={[0.06, 0.012, 0.01]} />
                <meshStandardMaterial color="#9f1239" />
              </mesh>
            )}
            {expression === "happy" &&
              [-1, 1].map((s) => (
                <mesh key={s} position={[0.12 * s, -0.05, 0.17]}>
                  <sphereGeometry args={[0.03, 10, 10]} />
                  <meshStandardMaterial color="#fb7185" transparent opacity={0.45} />
                </mesh>
              ))}
            {hasGlasses && (
              <group position={[0, 0.03, 0.225]}>
                {[-1, 1].map((s) => (
                  <mesh key={s} position={[0.075 * s, 0, 0]}>
                    <torusGeometry args={[0.048, 0.007, 8, 20]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
                  </mesh>
                ))}
                <mesh>
                  <boxGeometry args={[0.05, 0.008, 0.008]} />
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
            <group key={s} ref={sh} position={[0.25 * s, 0.5, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.075, 14, 14]} />
                <meshStandardMaterial color={shirtColor} roughness={0.7} />
              </mesh>
              <Limb length={UPPER_ARM} radius={0.062} color={shirtColor} />
              <group ref={el} position={[0, -UPPER_ARM, 0]}>
                <Limb length={FOREARM} radius={0.052} color={skinColor} />
                <mesh position={[0, -FOREARM - 0.03, 0]} castShadow>
                  <sphereGeometry args={[0.058, 14, 14]} />
                  <meshStandardMaterial color={skinColor} roughness={0.55} />
                </mesh>
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
              <Limb length={THIGH} radius={0.085} color={pantsColor} />
              <group ref={kn} position={[0, -THIGH, 0]}>
                <Limb length={SHIN} radius={0.072} color={pantsColor} />
                <mesh position={[0, -SHIN - 0.02, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <capsuleGeometry args={[0.07, 0.12, 6, 12]} />
                  <meshStandardMaterial color={pose === "swimming" ? skinColor : shoe} roughness={0.45} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
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
  const mat = <meshStandardMaterial color={color} roughness={0.8} />;
  // a cap of hair covering the top and back of the head
  const cap = (
    <mesh position={[0, 0.045, -0.02]} scale={[1.04, 0.92, 1.04]} castShadow>
      <sphereGeometry args={[0.225, 26, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      {mat}
    </mesh>
  );
  switch (style) {
    case "short":
      return (
        <group>
          {cap}
          <mesh position={[0, 0.16, 0.12]} rotation={[0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 4, 10]} />
            {mat}
          </mesh>
        </group>
      );
    case "ponytail":
      return (
        <group>
          {cap}
          <mesh position={[0, 0.06, -0.26]} rotation={[0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.22, 6, 12]} />
            {mat}
          </mesh>
        </group>
      );
    case "bun":
      return (
        <group>
          {cap}
          <mesh position={[0, 0.22, -0.1]} castShadow>
            <sphereGeometry args={[0.11, 16, 16]} />
            {mat}
          </mesh>
        </group>
      );
    case "cap":
      return (
        <group>
          <mesh position={[0, 0.07, 0]} castShadow>
            <sphereGeometry args={[0.235, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            {mat}
          </mesh>
          <mesh position={[0, 0.08, 0.22]} rotation={[0.15, 0, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 20, 1, false, -Math.PI / 2, Math.PI]} />
            {mat}
          </mesh>
        </group>
      );
    case "beret":
      return (
        <group>
          {cap}
          <mesh position={[0.04, 0.2, 0]} rotation={[0, 0, 0.25]} castShadow>
            <cylinderGeometry args={[0.26, 0.23, 0.07, 22]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.8} />
          </mesh>
        </group>
      );
    case "hat":
      return (
        <group position={[0, 0.14, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.23, 0.17, 22]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.07, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.02, 28]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.7} />
          </mesh>
        </group>
      );
    case "swimcap":
      return (
        <mesh position={[0, 0.03, 0]} castShadow>
          <sphereGeometry args={[0.232, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.15} />
        </mesh>
      );
  }
}

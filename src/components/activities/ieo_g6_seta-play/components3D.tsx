"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════════════
   1. HIGH-FIDELITY 3D HUMAN AVATAR
   Articulated 3D human character with head, hair variants, facial
   expressions, clothes, detailed posed limbs, and accessories.
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

export function Avatar3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  skinColor = "#FCD34D",
  shirtColor = "#3B82F6",
  pantsColor = "#1E293B",
  hairColor = "#78350F",
  hairStyle = "short",
  pose = "standing",
  expression = "happy",
  hasBackpack = false,
  backpackColor = "#EF4444",
  hasGlasses = false,
}: Avatar3DProps) {
  const isSitting = pose === "sitting" || pose === "sitting_eating" || pose === "sitting_studying";
  const isKneeling = pose === "kneeling";
  const isWalking = pose === "walking";

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* ── HEAD & FACE ── */}
      <group position={[0, isSitting ? 1.35 : isKneeling ? 0.95 : 1.65, 0]}>
        {/* Head */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Hair Styles */}
        {hairStyle === "short" && (
          <group position={[0, 0.08, -0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.23, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.12, 0.14]} castShadow>
              <boxGeometry args={[0.28, 0.08, 0.12]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
          </group>
        )}

        {hairStyle === "ponytail" && (
          <group position={[0, 0.08, -0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.23, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.08, -0.26]} rotation={[0.4, 0, 0]} castShadow>
              <coneGeometry args={[0.08, 0.35, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
          </group>
        )}

        {hairStyle === "bun" && (
          <group position={[0, 0.08, -0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.23, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.22, -0.1]} castShadow>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
          </group>
        )}

        {hairStyle === "cap" && (
          <group position={[0, 0.12, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.24, 20, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.06, 0.2]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.26, 0.02, 0.18]} />
              <meshStandardMaterial color={hairColor} roughness={0.5} />
            </mesh>
          </group>
        )}

        {hairStyle === "beret" && (
          <group position={[0, 0.18, 0]} rotation={[0, 0, 0.25]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.25, 0.08, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
          </group>
        )}

        {hairStyle === "hat" && (
          <group position={[0, 0.14, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.24, 0.16, 20]} />
              <meshStandardMaterial color="#FBBF24" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.06, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.02, 24]} />
              <meshStandardMaterial color="#FBBF24" roughness={0.7} />
            </mesh>
          </group>
        )}

        {hairStyle === "swimcap" && (
          <mesh position={[0, 0.04, 0]} castShadow>
            <sphereGeometry args={[0.23, 20, 20]} />
            <meshStandardMaterial color="#2563EB" roughness={0.3} metalness={0.2} />
          </mesh>
        )}

        {/* Eyes */}
        <group position={[0, 0.02, 0.19]}>
          <mesh position={[-0.07, 0, 0]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0.07, 0, 0]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Eyebrows */}
          <mesh position={[-0.07, 0.04, 0]}>
            <boxGeometry args={[0.04, 0.01, 0.01]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.07, 0.04, 0]}>
            <boxGeometry args={[0.04, 0.01, 0.01]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          {/* Mouth */}
          {expression === "happy" && (
            <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.03, 0.008, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#B91C1C" />
            </mesh>
          )}
          {expression === "surprised" && (
            <mesh position={[0, -0.06, 0]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshStandardMaterial color="#B91C1C" />
            </mesh>
          )}
          {expression === "worried" && (
            <mesh position={[0, -0.06, 0]}>
              <torusGeometry args={[0.03, 0.008, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#B91C1C" />
            </mesh>
          )}
        </group>

        {/* Glasses */}
        {hasGlasses && (
          <group position={[0, 0.02, 0.2]}>
            <mesh position={[-0.07, 0, 0]}>
              <torusGeometry args={[0.04, 0.006, 8, 16]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} />
            </mesh>
            <mesh position={[0.07, 0, 0]}>
              <torusGeometry args={[0.04, 0.006, 8, 16]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.06, 0.008, 0.008]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </group>
        )}
      </group>

      {/* ── TORSO & CLOTHES ── */}
      <group position={[0, isSitting ? 0.9 : isKneeling ? 0.55 : 1.1, 0]}>
        {/* Neck */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.12, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.52, 0.24]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.28, 0.08]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.06, 0.1]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>

        {/* Backpack */}
        {hasBackpack && (
          <group position={[0, 0.05, -0.18]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.42, 0.16]} />
              <meshStandardMaterial color={backpackColor} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.08, -0.1]} castShadow>
              <boxGeometry args={[0.26, 0.2, 0.06]} />
              <meshStandardMaterial color={backpackColor} roughness={0.6} />
            </mesh>
          </group>
        )}

        {/* ── ARMS ── */}
        {/* Left Arm */}
        <group position={[-0.26, 0.2, 0]}>
          {pose === "sitting_eating" ? (
            <group rotation={[0.9, 0.2, -0.3]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
              {/* Silver Spoon in Left Hand */}
              <mesh position={[0, -0.4, 0.06]} rotation={[0.8, 0, 0]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          ) : pose === "sitting_studying" ? (
            <group rotation={[0.8, 0, -0.2]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
            </group>
          ) : pose === "gesturing" || pose === "holding_cone" ? (
            <group rotation={[0.8, 0, -0.4]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
              {pose === "holding_cone" && (
                <group position={[0, -0.42, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh castShadow>
                    <coneGeometry args={[0.05, 0.16, 12]} />
                    <meshStandardMaterial color="#D97706" />
                  </mesh>
                  <mesh position={[0, 0.09, 0]} castShadow>
                    <sphereGeometry args={[0.06, 12, 12]} />
                    <meshStandardMaterial color="#F43F5E" />
                  </mesh>
                </group>
              )}
            </group>
          ) : pose === "holding_cup" ? (
            <group rotation={[0.6, 0, -0.3]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
            </group>
          ) : (
            <group rotation={[isWalking ? -0.4 : 0, 0, 0.1]}>
              <mesh position={[0, -0.18, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.36, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.38, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
            </group>
          )}
        </group>

        {/* Right Arm */}
        <group position={[0.26, 0.2, 0]}>
          {pose === "sitting_eating" ? (
            <group rotation={[0.7, -0.2, 0.3]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
            </group>
          ) : pose === "sitting_studying" ? (
            <group rotation={[0.9, -0.3, 0.2]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
              {/* Pen */}
              <mesh position={[0, -0.38, 0.05]} rotation={[0.5, 0, 0]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
                <meshStandardMaterial color="#2563EB" metalness={0.7} />
              </mesh>
            </group>
          ) : pose === "gesturing" ? (
            <group rotation={[1.1, 0, 0.5]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
            </group>
          ) : pose === "holding_cup" ? (
            <group rotation={[0.9, 0, 0.3]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
              <group position={[0, -0.4, 0.05]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.05, 0.04, 0.1, 16]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
                </mesh>
              </group>
            </group>
          ) : (
            <group rotation={[isWalking ? 0.4 : 0, 0, -0.1]}>
              <mesh position={[0, -0.18, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.36, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              <mesh position={[0, -0.38, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* ── LEGS & SHOES ── */}
      {isSitting ? (
        <group position={[0, 0.6, 0]}>
          {/* Thighs forward */}
          <mesh position={[-0.12, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.38, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.12, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.38, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Lower legs */}
          <mesh position={[-0.12, -0.28, 0.36]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.42, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.12, -0.28, 0.36]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.42, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Shoes */}
          <mesh position={[-0.12, -0.5, 0.42]} castShadow>
            <boxGeometry args={[0.12, 0.08, 0.2]} />
            <meshStandardMaterial color="#0F172A" roughness={0.4} />
          </mesh>
          <mesh position={[0.12, -0.5, 0.42]} castShadow>
            <boxGeometry args={[0.12, 0.08, 0.2]} />
            <meshStandardMaterial color="#0F172A" roughness={0.4} />
          </mesh>
        </group>
      ) : isKneeling ? (
        <group position={[0, 0.35, 0]}>
          <mesh position={[-0.12, -0.15, -0.1]} rotation={[0.6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.4, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.12, -0.15, -0.1]} rotation={[0.6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.4, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0.45, 0]}>
          <mesh position={[-0.12, 0, isWalking ? 0.1 : 0]} rotation={[isWalking ? 0.3 : 0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.75, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.12, 0, isWalking ? -0.1 : 0]} rotation={[isWalking ? -0.3 : 0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.75, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[-0.12, -0.4, isWalking ? 0.15 : 0.04]} castShadow>
            <boxGeometry args={[0.12, 0.09, 0.22]} />
            <meshStandardMaterial color="#0F172A" roughness={0.4} />
          </mesh>
          <mesh position={[0.12, -0.4, isWalking ? -0.05 : 0.04]} castShadow>
            <boxGeometry args={[0.12, 0.09, 0.22]} />
            <meshStandardMaterial color="#0F172A" roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   2. 3D WOODEN DINING CHAIR (Reusable Chair Component)
   ══════════════════════════════════════════════════════════════════════ */
export function WoodenChair3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "#92400E",
  cushionColor = "#FBBF24",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  cushionColor?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 4 Chair Legs */}
      {[
        [-0.2, -0.2],
        [0.2, -0.2],
        [-0.2, 0.2],
        [0.2, 0.2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]} castShadow>
          <cylinderGeometry args={[0.025, 0.02, 0.45, 12]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}

      {/* Chair Seat Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.04, 0.48]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Padded Cushion */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.04, 0.44]} />
        <meshStandardMaterial color={cushionColor} roughness={0.7} />
      </mesh>

      {/* Backrest Uprights */}
      <mesh position={[-0.2, 0.8, -0.2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.8, -0.2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Backrest Spindles & Curved Top Rail */}
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <boxGeometry args={[0.48, 0.08, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[-0.08, 0.78, -0.2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.08, 0.78, -0.2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   3. 3D DINING ROOM & BREAKFAST SPREAD (For Q1 Morning Routine)
   Complete dining room: Walls, hardwood floor, morning sunlit window,
   wall clock at 7:15 AM, sideboard with toaster/kettle, dining table
   with chairs, kid sitting and eating cereal with toast and juice!
   ══════════════════════════════════════════════════════════════════════ */
export function DiningTable3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* ── ROOM ENVIRONMENT ── */}
      {/* Hardwood Parquet Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#B45309" roughness={0.4} />
      </mesh>

      {/* Floor Rug */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.6]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.8} />
      </mesh>

      {/* Back Room Wall */}
      <mesh position={[0, 2, -2.5]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#FFFBEB" roughness={0.9} />
      </mesh>

      {/* Baseboard Moulding */}
      <mesh position={[0, 0.1, -2.48]}>
        <boxGeometry args={[8, 0.2, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Sunny Morning Window */}
      <group position={[-1.6, 2.2, -2.45]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.4, 1.6, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Window Glass Pane */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.2, 1.4]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.1} />
        </mesh>
        {/* Window Cross Mullions */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[1.2, 0.04, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.04, 1.4, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Warm Sunlight Beam */}
        <pointLight position={[0, 0, 0.5]} intensity={1.5} color="#FEF08A" distance={4} />
      </group>

      {/* Wall Clock at 7:15 AM */}
      <group position={[1.4, 2.6, -2.45]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.01, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Clock Hands */}
        <mesh position={[0.04, -0.02, 0.035]} rotation={[0, 0, -1.8]}>
          <boxGeometry args={[0.015, 0.12, 0.005]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.07, 0, 0.035]} rotation={[0, 0, -Math.PI / 2]}>
          <boxGeometry args={[0.01, 0.16, 0.005]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Sideboard Cabinet in Background */}
      <group position={[1.6, 0.5, -2.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.0, 0.6]} />
          <meshStandardMaterial color="#78350F" roughness={0.5} />
        </mesh>
        {/* Toaster on Sideboard */}
        <mesh position={[-0.4, 0.6, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.2]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Electric Kettle */}
        <mesh position={[0.3, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.28, 16]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
      </group>

      {/* ── DINING TABLE SET ── */}
      {/* Tabletop */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 32]} />
        <meshStandardMaterial color="#78350F" roughness={0.3} />
      </mesh>
      {/* Table Pedestal / 4 Legs */}
      {[
        [-0.55, -0.55],
        [0.55, -0.55],
        [-0.55, 0.55],
        [0.55, 0.55],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.7, 12]} />
          <meshStandardMaterial color="#451A03" roughness={0.5} />
        </mesh>
      ))}

      {/* Left Chair (Where kid sits) */}
      <WoodenChair3D position={[-0.65, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#78350F" />
      {/* Right Chair */}
      <WoodenChair3D position={[0.65, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#78350F" />

      {/* ── BREAKFAST SPREAD ON TABLETOP ── */}
      {/* Woven Placemat */}
      <mesh position={[-0.2, 0.765, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.6, 0.45]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.9} />
      </mesh>

      {/* Ceramic Cereal Bowl */}
      <group position={[-0.25, 0.78, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.12, 0.1, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Milk & Flakes inside */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
          <meshStandardMaterial color="#FEF08A" roughness={0.4} />
        </mesh>
      </group>

      {/* Plate with Toast */}
      <group position={[-0.25, 0.77, 0.28]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.02, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* 2 Slices of Golden Toast */}
        <mesh position={[-0.04, 0.02, 0]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.14, 0.02, 0.14]} />
          <meshStandardMaterial color="#D97706" roughness={0.8} />
        </mesh>
        <mesh position={[0.04, 0.03, 0]} rotation={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.14, 0.02, 0.14]} />
          <meshStandardMaterial color="#B45309" roughness={0.8} />
        </mesh>
        {/* Melting Butter square */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.04, 0.015, 0.04]} />
          <meshStandardMaterial color="#FDE047" roughness={0.2} />
        </mesh>
      </group>

      {/* Glass of Fresh Orange Juice with Straw */}
      <group position={[-0.45, 0.78, -0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.18, 16]} />
          <meshStandardMaterial color="#F97316" roughness={0.1} transparent opacity={0.85} />
        </mesh>
        {/* Straw */}
        <mesh position={[0.02, 0.08, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Fresh Milk Carton */}
      <group position={[0.15, 0.88, -0.15]} castShadow>
        <mesh>
          <boxGeometry args={[0.14, 0.24, 0.14]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.1, 0.08, 4]} />
          <meshStandardMaterial color="#E0F2FE" />
        </mesh>
      </group>

      {/* ── SITTING BREAKFAST KID ── */}
      <Avatar3D
        position={[-0.65, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        pose="sitting_eating"
        shirtColor="#3B82F6"
        pantsColor="#1E293B"
        hairStyle="short"
        hairColor="#78350F"
        expression="happy"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   4. 3D AIRPORT CHECK-IN TERMINAL (Q2 Luggage & Q7 Weight Scale)
   ══════════════════════════════════════════════════════════════════════ */
export function AirportLuggage3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Terminal Granite Tile Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Terminal Glass Curtain Wall with Tarmac & Jet Outside */}
      <mesh position={[0, 2, -2.5]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#93C5FD" roughness={0.1} transparent opacity={0.6} />
      </mesh>

      {/* Airplane on Tarmac outside window */}
      <group position={[-1.8, 1.8, -3.2]} rotation={[0, 0.4, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 2.2, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Airplane Wings */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 2.0]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Tail Fin */}
        <mesh position={[-0.9, 0.35, 0]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.3, 0.4, 0.04]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Departure Screen Board */}
      <group position={[1.4, 2.6, -2.4]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.8, 0.08]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.7, 0.7]} />
          <meshStandardMaterial color="#1E293B" emissive="#0284C7" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Check-In Desk Counter */}
      <group position={[0.8, 0.6, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.4, 1.2, 0.7]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[1.5, 0.05, 0.8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Agent Monitor */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.4, 0.3, 0.04]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Check-In Officer Avatar sitting behind desk */}
      <Avatar3D
        position={[0.8, 0, -0.6]}
        rotation={[0, 0, 0]}
        pose="sitting"
        shirtColor="#1E3A8A"
        hairStyle="short"
        hairColor="#1E293B"
      />

      {/* Conveyor Belt & Digital Scale */}
      <group position={[-0.7, 0.25, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.5, 1.6]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* Rubber Belt */}
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[1.3, 0.02, 1.5]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        {/* Digital Scale LED Post */}
        <group position={[0.55, 0.6, 0.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.26, 0.16, 0.06]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
        </group>

        {/* Large Rolling Luggage Suitcases */}
        <group position={[-0.2, 0.55, 0]} castShadow>
          <mesh>
            <boxGeometry args={[0.45, 0.55, 0.28]} />
            <meshStandardMaterial color="#DC2626" roughness={0.4} />
          </mesh>
          {/* Telescopic Handle */}
          <mesh position={[0, 0.36, 0]}>
            <boxGeometry args={[0.2, 0.18, 0.02]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
        </group>
        <group position={[0.25, 0.5, 0.2]} rotation={[0, 0.4, 0]} castShadow>
          <mesh>
            <boxGeometry args={[0.38, 0.45, 0.24]} />
            <meshStandardMaterial color="#2563EB" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Passenger Avatar with Carry-on bag */}
      <Avatar3D
        position={[-1.2, 0, 0.8]}
        rotation={[0, 0.6, 0]}
        pose="gesturing"
        shirtColor="#F59E0B"
        pantsColor="#1E293B"
        hairStyle="ponytail"
        hairColor="#B45309"
        hasBackpack
        backpackColor="#10B981"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   5. 3D GOURMET CHEF KITCHEN (Q3 & Q6 Cooking Timeline)
   ══════════════════════════════════════════════════════════════════════ */
export function ChefKitchen3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Kitchen Terracotta Floor Tiles */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>

      {/* Kitchen Subway Tile Wall */}
      <mesh position={[0, 2, -2.5]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
      </mesh>

      {/* Stainless Steel Range & Burners */}
      <group position={[0, 0.5, -1.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.0, 0.8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass Oven Door */}
        <mesh position={[0, 0, 0.41]}>
          <boxGeometry args={[1.4, 0.6, 0.02]} />
          <meshStandardMaterial color="#0F172A" roughness={0.1} />
        </mesh>
        {/* Burner Grates */}
        <mesh position={[-0.4, 0.52, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        <mesh position={[0.4, 0.52, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        {/* Stockpot with Steam */}
        <group position={[-0.4, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.16, 0.36, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
        </group>
        {/* Sauté Frying Pan with Vegetables */}
        <group position={[0.4, 0.58, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.08, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
          {/* Pan Handle */}
          <mesh position={[0.3, 0.02, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
        </group>
      </group>

      {/* Extractor Hood */}
      <group position={[0, 2.4, -1.8]}>
        <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.9, 0.6, 4]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Prep Kitchen Island Table in Front */}
      <group position={[0, 0.45, 0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.9, 0.9]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.4} />
        </mesh>
        {/* Wooden Butcher Block Top */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.06, 1.0]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} />
        </mesh>
        {/* Cutting Board with Tomatoes and Knife */}
        <mesh position={[-0.4, 0.52, 0]} castShadow>
          <boxGeometry args={[0.45, 0.02, 0.35]} />
          <meshStandardMaterial color="#FDE68A" />
        </mesh>
        <mesh position={[-0.4, 0.56, 0]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.2} />
        </mesh>
      </group>

      {/* Chef Avatar in Apron Cooking */}
      <Avatar3D
        position={[-0.9, 0, 0.4]}
        rotation={[0, 0.8, 0]}
        pose="gesturing"
        shirtColor="#FFFFFF"
        pantsColor="#1E293B"
        hairStyle="cap"
        hairColor="#451A03"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   6. 3D ROTATING LINGUISTIC GLOBE (Q4 & Q10 Language Studio)
   ══════════════════════════════════════════════════════════════════════ */
export function LanguageGlobe3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const globeRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group position={position}>
      {/* Studio Parquet Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </mesh>

      {/* Library Bookshelf Wall Backdrop */}
      <group position={[0, 1.6, -2.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.2, 0.5]} />
          <meshStandardMaterial color="#78350F" roughness={0.6} />
        </mesh>
        {/* Colorful Encyclopedias & Dictionaries */}
        {[-1.5, -0.8, 0, 0.8, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 0.6, 0.1]} castShadow>
            <boxGeometry args={[0.4, 0.5, 0.35]} />
            <meshStandardMaterial color={["#DC2626", "#2563EB", "#16A34A", "#9333EA", "#D97706"][i]} />
          </mesh>
        ))}
      </group>

      {/* Central Marble Pedestal & Glowing Globe */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.9, 24]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Brass Globe Stand Arm */}
        <mesh position={[0, 1.25, 0]} castShadow rotation={[0, 0, 0.4]}>
          <torusGeometry args={[0.62, 0.03, 16, 32]} />
          <meshStandardMaterial color="#D97706" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Rotating 3D Globe with Continents */}
        <group ref={globeRef} position={[0, 1.25, 0]} rotation={[0.3, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#0284C7" roughness={0.4} />
          </mesh>
          {/* Continent Landmasses */}
          <mesh position={[0, 0.15, 0.45]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#22C55E" roughness={0.7} />
          </mesh>
          <mesh position={[-0.35, -0.1, 0.35]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#16A34A" roughness={0.7} />
          </mesh>
          <mesh position={[0.35, 0.1, -0.35]} castShadow>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial color="#15803D" roughness={0.7} />
          </mesh>
          {/* Glowing Atmospheric Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.65, 0.72, 32]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Linguist Student Avatar */}
      <Avatar3D
        position={[1.1, 0, 0.5]}
        rotation={[0, -0.6, 0]}
        pose="gesturing"
        shirtColor="#7C3AED"
        hairStyle="short"
        hasGlasses
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   7. 3D BUS STOP TRANSIT SHELTER (Q5 Daily Commute)
   ══════════════════════════════════════════════════════════════════════ */
export function BusStopShelter3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* City Sidewalk Pavement */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.8} />
      </mesh>
      {/* Asphalt Road in Front */}
      <mesh position={[0, 0.005, 1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 2.5]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Yellow Curb Tactile Line */}
      <mesh position={[0, 0.02, 0.55]}>
        <boxGeometry args={[8, 0.04, 0.12]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* Glass Bus Stop Shelter */}
      <group position={[0, 0, -0.6]}>
        {/* Steel Shelter Frame Pillars */}
        <mesh position={[-1.2, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[1.2, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        {/* Glass Back Wall */}
        <mesh position={[0, 1.2, -0.4]} receiveShadow>
          <boxGeometry args={[2.4, 2.0, 0.04]} />
          <meshStandardMaterial color="#BAE6FD" roughness={0.1} transparent opacity={0.5} />
        </mesh>
        {/* Curved Canopy Roof */}
        <mesh position={[0, 2.4, 0]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[2.6, 0.08, 1.4]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} />
        </mesh>

        {/* Shelter Wooden Bench */}
        <mesh position={[0, 0.45, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.06, 0.35]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} />
        </mesh>
        <mesh position={[-0.7, 0.22, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.7, 0.22, -0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Bus Stop Timetable Signpost */}
      <group position={[1.6, 1.1, 0.2]} castShadow>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.7} />
        </mesh>
        {/* Bus Route Flag Sign */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.04]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
      </group>

      {/* Autumn Street Tree on Left */}
      <group position={[-2.2, 0, -1.2]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 2.0, 12]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.4, 0]} castShadow>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.8} />
        </mesh>
      </group>

      {/* Commuter Avatar waiting at Stop */}
      <Avatar3D
        position={[-0.3, 0, -0.2]}
        rotation={[0, 0.2, 0]}
        pose="sitting"
        shirtColor="#2563EB"
        pantsColor="#1E293B"
        hairStyle="short"
        hasBackpack
        backpackColor="#DC2626"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   8. 3D BOTANICAL HERBARIUM (Q8 Sensory & Q18 Greenhouse)
   ══════════════════════════════════════════════════════════════════════ */
export function Herbarium3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stone Paving Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#64748B" roughness={0.8} />
      </mesh>

      {/* Glass Greenhouse Arches */}
      <group position={[0, 1.6, -2.2]}>
        <mesh receiveShadow>
          <boxGeometry args={[4.5, 3.2, 0.04]} />
          <meshStandardMaterial color="#A7F3D0" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <torusGeometry args={[2.2, 0.04, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#065F46" metalness={0.7} />
        </mesh>
      </group>

      {/* Wooden Staging Benches with Herb Pots */}
      <group position={[0, 0.45, -0.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.9, 0.8]} />
          <meshStandardMaterial color="#78350F" roughness={0.6} />
        </mesh>
        {/* Row of Terracotta Pots with Herbs */}
        {[-1.1, -0.55, 0, 0.55, 1.1].map((x, i) => (
          <group key={i} position={[x, 0.55, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.08, 0.2, 16]} />
              <meshStandardMaterial color="#EA580C" roughness={0.7} />
            </mesh>
            {/* Green Foliage / Flowers */}
            <mesh position={[0, 0.16, 0]} castShadow>
              <sphereGeometry args={[0.14, 12, 12]} />
              <meshStandardMaterial color={["#16A34A", "#84CC16", "#A855F7", "#10B981", "#22C55E"][i]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Botanist Avatar Inspecting Herbs */}
      <Avatar3D
        position={[0.9, 0, 0.4]}
        rotation={[0, -0.6, 0]}
        pose="gesturing"
        shirtColor="#059669"
        hairStyle="bun"
        hairColor="#78350F"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   9. 3D OPTICAL & LEXICAL SCANNER (Q9 & Q49 Futuristic Scanner)
   ══════════════════════════════════════════════════════════════════════ */
export function OpticalScanner3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const ringRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.8;
  });

  return (
    <group position={position}>
      {/* Sci-Fi Reflective Grid Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Holographic Scanner Core */}
      <group position={[0, 0.6, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 1.1, 0.4, 32]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing HUD Base Ring */}
        <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 32]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.8} />
        </mesh>

        {/* Rotating Hologram Rings */}
        <group ref={ringRef} position={[0, 0.8, 0]}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.65, 0.02, 16, 32]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.5, 0.015, 16, 32]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* Scientist Analyst Avatar */}
      <Avatar3D
        position={[1.2, 0, 0.5]}
        rotation={[0, -0.6, 0]}
        pose="gesturing"
        shirtColor="#0284C7"
        hairStyle="short"
        hasGlasses
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   10. 3D ICE-CREAM PARLOUR (Q11 Treat Suggestion)
   ══════════════════════════════════════════════════════════════════════ */
export function IceCreamParlour3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Checkerboard Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#FCE7F3" roughness={0.3} />
      </mesh>

      {/* Striped Awning Wall Backdrop */}
      <group position={[0, 2.2, -2.4]}>
        <mesh receiveShadow>
          <planeGeometry args={[8, 3.6]} />
          <meshStandardMaterial color="#FFF1F2" roughness={0.9} />
        </mesh>
        {/* Striped Canopy Awning */}
        <mesh position={[0, 0.8, 0.6]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[4.2, 0.08, 1.4]} />
          <meshStandardMaterial color="#F43F5E" />
        </mesh>
      </group>

      {/* Glass Ice Cream Freezer Counter */}
      <group position={[0, 0.5, -0.6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.0, 0.9]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Glass Sneeze Guard Display */}
        <mesh position={[0, 0.45, 0.2]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[2.7, 0.5, 0.03]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.5} roughness={0.1} />
        </mesh>

        {/* 6 Colorful Gelato Tubs */}
        {[-0.9, -0.55, -0.2, 0.2, 0.55, 0.9].map((x, i) => (
          <group key={i} position={[x, 0.52, -0.1]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.12, 0.35]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} />
            </mesh>
            {/* Gelato Scoop mound */}
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={["#F43F5E", "#FDE047", "#10B981", "#78350F", "#EC4899", "#38BDF8"][i]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Parlour Bistro Table & Chair */}
      <group position={[1.4, 0, 0.6]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.04, 24]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.65, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
        </mesh>
        <WoodenChair3D position={[-0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#F43F5E" cushionColor="#FDE047" />
      </group>

      {/* Kids holding ice cream cone */}
      <Avatar3D
        position={[-1.1, 0, 0.5]}
        rotation={[0, 0.5, 0]}
        pose="holding_cone"
        shirtColor="#EC4899"
        hairStyle="ponytail"
        hairColor="#F59E0B"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   11. 3D CRICKET STADIUM PITCH (Q12 Match Attendance)
   ══════════════════════════════════════════════════════════════════════ */
export function CricketPitch3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stadium Outfield Grass */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} />
      </mesh>

      {/* Manicured Clay Cricket Pitch */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.0, 5.0]} />
        <meshStandardMaterial color="#D97706" roughness={0.9} />
      </mesh>

      {/* White Popping Crease Lines */}
      <mesh position={[0, 0.02, 1.2]}>
        <boxGeometry args={[1.8, 0.01, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 0.02, -1.2]}>
        <boxGeometry args={[1.8, 0.01, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Wooden Wickets (3 Stumps & 2 Bails) */}
      <group position={[0, 0, -1.2]}>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.7, 12]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.3} />
          </mesh>
        ))}
        {/* Bails on top */}
        <mesh position={[0, 0.71, 0]}>
          <boxGeometry args={[0.22, 0.015, 0.015]} />
          <meshStandardMaterial color="#FEF3C7" />
        </mesh>
      </group>

      {/* Cricket Bat & Red Leather Ball on Pitch */}
      <group position={[0.25, 0.04, -0.8]} rotation={[0.2, -0.4, 0]} castShadow>
        {/* Bat Blade */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.03]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>
        {/* Rubber Handle */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Red Cricket Ball */}
      <mesh position={[-0.2, 0.06, -0.4]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#DC2626" roughness={0.3} />
      </mesh>

      {/* Batsman Avatar in White Kit */}
      <Avatar3D
        position={[0, 0, -0.8]}
        rotation={[0, 0, 0]}
        pose="standing"
        shirtColor="#FFFFFF"
        pantsColor="#FFFFFF"
        hairStyle="cap"
        hairColor="#1E293B"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   12. 3D WEATHER OBSERVATORY STATION (Q13 Anemometer)
   ══════════════════════════════════════════════════════════════════════ */
export function WeatherStation3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const anemometerRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (anemometerRef.current) anemometerRef.current.rotation.y += delta * 3.5;
  });

  return (
    <group position={position}>
      {/* Alpine Hillock Grass */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 4.0, 0.6, 32]} />
        <meshStandardMaterial color="#16A34A" roughness={0.8} />
      </mesh>

      {/* Weather Tower Mast */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 2.4, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
        </mesh>

        {/* Spinning 3-Cup Anemometer */}
        <group ref={anemometerRef} position={[0, 2.4, 0]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
                <meshStandardMaterial color="#CBD5E1" />
              </mesh>
              {/* Cup Hemispheres */}
              <mesh position={[0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <sphereGeometry args={[0.07, 12, 12, 0, Math.PI]} />
                <meshStandardMaterial color="#EF4444" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Meteorologist Avatar */}
      <Avatar3D
        position={[1.0, 0.1, 0.5]}
        rotation={[0, -0.6, 0]}
        pose="gesturing"
        shirtColor="#0284C7"
        hairStyle="cap"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   13. 3D PARK TRAIL & BENCH (Q14 Nature Hike & Q16 Playground)
   ══════════════════════════════════════════════════════════════════════ */
export function ParkTrail3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Forest Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} />
      </mesh>

      {/* Curved Dirt Trail */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.6, 8]} />
        <meshStandardMaterial color="#92400E" roughness={0.9} />
      </mesh>

      {/* Pine Trees */}
      <group position={[-1.8, 0, -1.0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 1.2, 10]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <coneGeometry args={[0.8, 1.6, 12]} />
          <meshStandardMaterial color="#065F46" />
        </mesh>
      </group>

      {/* Wooden Trail Marker Signpost */}
      <group position={[1.4, 0.8, 0.2]} castShadow>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.45, 0.14, 0.03]} />
          <meshStandardMaterial color="#FEF3C7" />
        </mesh>
      </group>

      {/* Hiker Avatar */}
      <Avatar3D
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        pose="walking"
        shirtColor="#EA580C"
        pantsColor="#1E293B"
        hairStyle="cap"
        hasBackpack
        backpackColor="#3B82F6"
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   14. 3D RAILWAY PLATFORM & TRACKS (Q15 Train Travel)
   ══════════════════════════════════════════════════════════════════════ */
export function TrainPlatform3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Brick Platform Ground */}
      <mesh position={[0.8, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.6, 8]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.7} />
      </mesh>
      {/* Yellow Safety Line */}
      <mesh position={[-0.5, 0.61, 0]}>
        <boxGeometry args={[0.14, 0.02, 8]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* Ballast Stone Bed & Twin Steel Railway Tracks */}
      <mesh position={[-1.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.4, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      {/* Steel Rails */}
      <mesh position={[-1.4, 0.08, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-2.2, 0.08, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Platform Victorian Wooden Bench */}
      <WoodenChair3D position={[1.4, 0.6, -0.4]} rotation={[0, -Math.PI / 2, 0]} color="#78350F" />

      {/* Passenger Avatar with Suitcase */}
      <Avatar3D
        position={[0.8, 0.6, 0.4]}
        rotation={[0, -0.8, 0]}
        pose="standing"
        shirtColor="#1E3A8A"
        hairStyle="short"
        hasBackpack
      />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   15. 3D COMMUNITY PLAYGROUND (Q16)
   ══════════════════════════════════════════════════════════════════════ */
export function PlaygroundPark3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#22C55E" roughness={0.8} />
      </mesh>
      <WoodenChair3D position={[0, 0, -1.2]} color="#78350F" />
      <Avatar3D position={[0, 0, -1.2]} pose="sitting" shirtColor="#EF4444" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   16. 3D TROPICAL SEASIDE BEACH (Q17 Coastal Holiday)
   ══════════════════════════════════════════════════════════════════════ */
export function BeachSeaside3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sandy Beach */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#FDE68A" roughness={0.9} />
      </mesh>
      {/* Ocean Water Edge */}
      <mesh position={[0, 0.005, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 3.6]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Striped Beach Parasol Umbrella */}
      <group position={[1.2, 0, -0.4]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
          <meshStandardMaterial color="#CBD5E1" />
        </mesh>
        <mesh position={[0, 2.2, 0]} rotation={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[1.1, 0.4, 16]} />
          <meshStandardMaterial color="#F43F5E" />
        </mesh>
      </group>

      {/* Sunbather Avatar */}
      <Avatar3D position={[-0.5, 0, 0.2]} rotation={[0, 0.4, 0]} pose="sitting" shirtColor="#06B6D4" hairStyle="cap" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   17. 3D CLOCK TOWER PLAZA (Q19 Time Management)
   ══════════════════════════════════════════════════════════════════════ */
export function ParkBenchClock3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.7} />
      </mesh>
      {/* Victorian Clock Tower */}
      <group position={[0, 1.5, -1.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 3.0, 0.8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 1.2, 0.42]}>
          <circleGeometry args={[0.25, 24]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      <WoodenChair3D position={[1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#78350F" />
      <Avatar3D position={[1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} pose="sitting" shirtColor="#3B82F6" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   18. 3D GIFT UNBOXING PARTY (Q20 Gift Opening)
   ══════════════════════════════════════════════════════════════════════ */
export function GiftUnboxing3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.4} />
      </mesh>
      {/* Wooden Table with Big Gift Box */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.08, 1.0]} />
        <meshStandardMaterial color="#78350F" />
      </mesh>
      <group position={[0, 0.95, 0]} castShadow>
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
        {/* Golden Ribbon */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.62, 0.62, 0.12]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.62, 0.62]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.7} />
        </mesh>
      </group>
      <Avatar3D position={[0.9, 0, 0.3]} rotation={[0, -0.6, 0]} pose="gesturing" shirtColor="#9333EA" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   19. 3D ART ATELIER STUDIO (Q21 Fine Arts Masterpiece)
   ══════════════════════════════════════════════════════════════════════ */
export function ArtStudio3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#B45309" roughness={0.5} />
      </mesh>
      {/* Artist Easel */}
      <group position={[-0.4, 0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.8, 1.0, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        {/* 3 Tripod Legs */}
        <mesh position={[-0.35, 0.6, 0]} rotation={[0, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <mesh position={[0.35, 0.6, 0]} rotation={[0, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
      </group>
      {/* Painter Avatar in Beret */}
      <Avatar3D position={[0.9, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#7C3AED" hairStyle="beret" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   20. 3D PALACE GRAND BANQUET (Q22 Cake Regret & Q39 Party)
   ══════════════════════════════════════════════════════════════════════ */
export function GrandBanquetHall3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Banquet Table with Tiered Cake */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.1, 1.1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Multi-tiered Cake */}
      <group position={[0, 0.95, 0]} castShadow>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 24]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.2, 24]} />
          <meshStandardMaterial color="#F43F5E" roughness={0.4} />
        </mesh>
      </group>
      <WoodenChair3D position={[-1.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#78350F" cushionColor="#DC2626" />
      <Avatar3D position={[-1.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} pose="sitting" shirtColor="#DC2626" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   21. 3D ACOUSTIC AUDIO LAB (Q23 Audible Sound Lab)
   ══════════════════════════════════════════════════════════════════════ */
export function AcousticSoundLab3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.4} />
      </mesh>
      {/* Soundproof Foam Panels */}
      <mesh position={[0, 1.8, -2.4]} receiveShadow>
        <planeGeometry args={[8, 3.6]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>
      {/* Audio Desk & Oscilloscope */}
      <mesh position={[0, 0.6, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.8, 0.8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 1.2, -0.6]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.08]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.5} />
      </mesh>
      <Avatar3D position={[1.1, 0, 0.3]} rotation={[0, -0.6, 0]} pose="gesturing" shirtColor="#10B981" hasGlasses />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   22. 3D CLASSROOM AUDITORIUM (Q24 & Q38 School Enrolment)
   ══════════════════════════════════════════════════════════════════════ */
export function ClassroomAuditorium3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#B45309" roughness={0.4} />
      </mesh>
      {/* Large Blackboard Wall */}
      <mesh position={[0, 1.8, -2.4]} receiveShadow>
        <planeGeometry args={[5.0, 2.6]} />
        <meshStandardMaterial color="#064E3B" roughness={0.8} />
      </mesh>
      {/* Student Desks & Chairs */}
      <group position={[-0.8, 0, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.06, 0.5]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <WoodenChair3D position={[0, 0, 0.35]} color="#78350F" />
      </group>
      <group position={[0.8, 0, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.06, 0.5]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <WoodenChair3D position={[0, 0, 0.35]} color="#78350F" />
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   23. 3D UNDERWATER MARINE CORAL REEF (Q25 Marine Reef)
   ══════════════════════════════════════════════════════════════════════ */
export function MarineReef3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seabed Sand */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#FDE68A" roughness={0.9} />
      </mesh>
      {/* Colorful Corals */}
      <mesh position={[-1.2, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#F43F5E" roughness={0.6} />
      </mesh>
      <mesh position={[1.2, 0.5, -0.4]} castShadow>
        <coneGeometry args={[0.5, 0.9, 12]} />
        <meshStandardMaterial color="#A855F7" roughness={0.6} />
      </mesh>
      {/* Tropical Fish */}
      <mesh position={[0, 1.4, 0]} rotation={[0, 0.6, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.08, 0.25, 8]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   24. 3D LEXICAL SPELLING VAULT (Q26 Forensic Spelling)
   ══════════════════════════════════════════════════════════════════════ */
export function LexicalVault3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 4 Pedestals for Spelling Cards */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.3, 0.9, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.24, 16]} />
            <meshStandardMaterial color="#F43F5E" emissive="#F43F5E" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   25. 3D BEAVER RIVER VALLEY & DAM (Q27, Q29, Q30, Q31, Q33)
   ══════════════════════════════════════════════════════════════════════ */
export function BeaverHabitat3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Riverbank Grass */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} />
      </mesh>
      {/* River Stream */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.5, 8]} />
        <meshStandardMaterial color="#0284C7" roughness={0.1} transparent opacity={0.8} />
      </mesh>

      {/* Timber Beaver Dam Barrier */}
      <group position={[0, 0.25, -0.4]} castShadow>
        <mesh>
          <boxGeometry args={[2.6, 0.5, 0.6]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        {/* Beaver Lodge Dome on Water */}
        <mesh position={[-0.8, 0.35, 0.8]} castShadow>
          <sphereGeometry args={[0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#92400E" roughness={0.9} />
        </mesh>
      </group>

      {/* Fallen Birch Log with Orange Incisor Gnaw Marks */}
      <group position={[1.2, 0.15, 0.6]} rotation={[0, 0.6, 0]} castShadow>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 1.4, 16]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.7} />
        </mesh>
        {/* Gnawed ends */}
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.16, 0.2, 16]} />
          <meshStandardMaterial color="#EA580C" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   26. 3D PATAGONIAN GLACIER EXPEDITION (Q28 & Q32)
   ══════════════════════════════════════════════════════════════════════ */
export function GlacierExpedition3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Snowy Alpine Ground */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
      </mesh>
      {/* Glacial Ice Crevasse */}
      <mesh position={[-1.2, 0.4, -1.2]} castShadow>
        <coneGeometry args={[1.2, 2.2, 8]} />
        <meshStandardMaterial color="#BAE6FD" metalness={0.4} roughness={0.2} />
      </mesh>
      {/* Expedition Yellow Tent */}
      <group position={[1.2, 0.45, 0]} castShadow>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.8, 0.9, 4]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   27. 3D SUNNY GOA COASTAL VILLA (Q34 & Q36 Architecture)
   ══════════════════════════════════════════════════════════════════════ */
export function GoaVilla3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stone Pavers */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
      </mesh>
      {/* Modern Goa Villa Structure */}
      <group position={[0, 1.4, -1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 2.6, 1.8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Terracotta Tile Roof */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[3.8, 0.3, 2.0]} />
          <meshStandardMaterial color="#EA580C" />
        </mesh>
        {/* Balcony Glass Railing */}
        <mesh position={[0, 0.4, 1.0]}>
          <boxGeometry args={[1.8, 0.6, 0.04]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} />
        </mesh>
      </group>
      {/* Palm Trees */}
      <group position={[-2.0, 0, 0.4]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 2.4, 10]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <mesh position={[0, 2.4, 0]} castShadow>
          <sphereGeometry args={[0.8, 12, 12]} />
          <meshStandardMaterial color="#15803D" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   28. 3D VILLA VERANDAH PATIO (Q35 Hospitality)
   ══════════════════════════════════════════════════════════════════════ */
export function VillaVerandah3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#EA580C" roughness={0.4} />
      </mesh>
      <WoodenChair3D position={[-0.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#78350F" cushionColor="#10B981" />
      <WoodenChair3D position={[0.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#78350F" cushionColor="#10B981" />
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 24]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   29. 3D MORNING SCHOOL WALK TRAIL (Q37 Commute)
   ══════════════════════════════════════════════════════════════════════ */
export function TrailGreeting3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#22C55E" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.8, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
      </mesh>
      <Avatar3D position={[-0.4, 0, 0]} rotation={[0, 0, 0]} pose="walking" shirtColor="#2563EB" hasBackpack backpackColor="#F59E0B" />
      <Avatar3D position={[0.4, 0, 0.2]} rotation={[0, 0, 0]} pose="walking" shirtColor="#EC4899" hairStyle="ponytail" hasBackpack backpackColor="#8B5CF6" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   30. 3D SPORTS PODIUM & STADIUM
   ══════════════════════════════════════════════════════════════════════ */
export function SportsVictoryPodium3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#DC2626" roughness={0.8} />
      </mesh>
      {/* 3 Tier Podium */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.9, 0.7]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.6} />
      </mesh>
      <mesh position={[-0.7, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.6} />
      </mesh>
      <mesh position={[0.7, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color="#B45309" metalness={0.6} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   31. 3D HOME STUDY DESK & BOOKS
   ══════════════════════════════════════════════════════════════════════ */
export function LibraryDesk3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#B45309" roughness={0.5} />
      </mesh>
      {/* Study Desk */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.08, 0.8]} />
        <meshStandardMaterial color="#78350F" />
      </mesh>
      <WoodenChair3D position={[0, 0, 0.5]} color="#78350F" />
      <Avatar3D position={[0, 0, 0.5]} pose="sitting_studying" shirtColor="#2563EB" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   32. 3D MEDICAL INFIRMARY CLINIC (Q41 First-Aid)
   ══════════════════════════════════════════════════════════════════════ */
export function MedicalInfirmary3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
      </mesh>
      {/* Examination Bed */}
      <mesh position={[-0.8, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.5, 0.8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      {/* First Aid Kit */}
      <group position={[0.6, 0.65, 0]} castShadow>
        <mesh>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
      </group>
      <WoodenChair3D position={[0.7, 0, 0.5]} color="#FFFFFF" cushionColor="#38BDF8" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   33. 3D SUBURBAN GARDEN & FENCE (Q42 Curious Neighbour)
   ══════════════════════════════════════════════════════════════════════ */
export function SuburbanGarden3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#22C55E" roughness={0.8} />
      </mesh>
      {/* Wooden Fence */}
      <group position={[0, 0.6, -0.6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.0, 1.2, 0.08]} />
          <meshStandardMaterial color="#B45309" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   34. 3D SIDEWALK CAFE BISTRO (Q43 Dinner Invitation)
   ══════════════════════════════════════════════════════════════════════ */
export function CafeBistro3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#64748B" roughness={0.8} />
      </mesh>
      {/* Bistro Marble Table */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <WoodenChair3D position={[-0.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#1E293B" cushionColor="#DC2626" />
      <WoodenChair3D position={[0.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#1E293B" cushionColor="#DC2626" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   35. 3D BICYCLE WORKSHOP (Q44 Proverb)
   ══════════════════════════════════════════════════════════════════════ */
export function BikeWorkshop3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      {/* Bicycle on Repair Stand */}
      <group position={[0, 0.8, 0]}>
        <mesh position={[-0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.35, 0.04, 12, 24]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.35, 0.04, 12, 24]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   36. 3D MOUNTAIN SUMMIT (Q45 Hiking Fatigue)
   ══════════════════════════════════════════════════════════════════════ */
export function MountainSummit3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.8, 0.8, 24]} />
        <meshStandardMaterial color="#64748B" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   37. 3D BICYCLE WITH DOG IN BASKET (Q46 Preposterous)
   ══════════════════════════════════════════════════════════════════════ */
export function AbsurdBicycle3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      {/* Bicycle Frame */}
      <group position={[0, 0.6, 0]}>
        <mesh position={[-0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.4, 0.04, 12, 24]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.4, 0.04, 12, 24]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Front Basket with Cute Dog */}
        <group position={[0.65, 0.45, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.28, 0.32]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          {/* Golden Retriever Dog */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   38. 3D COMMUNAL HOSTEL KITCHEN (Q47 Shared Kitchen)
   ══════════════════════════════════════════════════════════════════════ */
export function CommunalKitchen3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} />
      </mesh>
      {/* Stainless Steel Island Counter */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.0, 0.9]} />
        <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cooking Pots with steam */}
      <mesh position={[-0.5, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   39. 3D SWIMMING POOL (Q48 Aquatic Propulsion)
   ══════════════════════════════════════════════════════════════════════ */
export function SwimmingPool3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tiled Pool Basin */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0284C7" roughness={0.1} />
      </mesh>
      {/* Lane divider with floats */}
      <group position={[0, 0.1, -0.8]}>
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#DC2626" : "#FFFFFF"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   40. 3D CAR DROPOFF & DRIVEWAY (Q50 Evening Drop-Off)
   ══════════════════════════════════════════════════════════════════════ */
export function CarRideDropoff3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Driveway */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Sedan Car */}
      <group position={[-0.8, 0.45, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.6, 1.1]} />
          <meshStandardMaterial color="#2563EB" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 0.95]} />
          <meshStandardMaterial color="#1E40AF" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   NEW 3D SCENES FOR IEO CLASS 6 SET A (Q1–Q50)
   ══════════════════════════════════════════════════════════════════════ */

/** Q1: 3D Pizza Town Detective */
export function PizzaTown3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cobblestone Street */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} />
      </mesh>
      {/* Sidewalk */}
      <mesh position={[0, 0.05, -1.8]} receiveShadow>
        <boxGeometry args={[8, 0.1, 2.2]} />
        <meshStandardMaterial color="#D6D3D1" roughness={0.7} />
      </mesh>
      {/* Pizzeria Building */}
      <group position={[-2.2, 1.4, -2.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.6, 2.0]} />
          <meshStandardMaterial color="#B45309" roughness={0.8} />
        </mesh>
        {/* Red & White Awning */}
        <mesh position={[0, 0.5, 1.1]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[2.9, 0.1, 0.8]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
        {/* Pizza Sign */}
        <mesh position={[0, 1.1, 1.05]}>
          <boxGeometry args={[1.6, 0.4, 0.08]} />
          <meshStandardMaterial color="#FEF08A" />
        </mesh>
      </group>
      {/* Newspaper / Editorial Desk */}
      <group position={[1.8, 0.6, -1.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.0, 1.2]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* Printing Press Roller */}
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1.6, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      {/* Vintage Street Lamp */}
      <group position={[0.2, 1.2, -0.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.08, 2.4, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FEF08A" emissive="#F59E0B" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/** Q2: 3D Hotel Checkout Escape */
export function HotelCheckout3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Marble Reception Floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Reception Counter */}
      <mesh position={[0, 0.6, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.2, 1.0]} />
        <meshStandardMaterial color="#854D0E" roughness={0.4} />
      </mesh>
      {/* Counter Top Brass Bell & Register */}
      <mesh position={[-0.8, 1.25, -1.2]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.12, 16]} />
        <meshStandardMaterial color="#EAB308" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 1.25, -1.1]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.6} />
      </mesh>
      {/* Luggage Cart with Brass Frame */}
      <group position={[-2.2, 0.7, 0.5]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.15, 0.9]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <torusGeometry args={[0.45, 0.04, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#EAB308" metalness={0.9} />
        </mesh>
      </group>
      {/* Wallet on Counter */}
      <mesh position={[-0.1, 1.23, -0.9]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.06, 0.2]} />
        <meshStandardMaterial color="#78350F" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Q3: 3D Handball Talent Scanner */
export function HandballCourt3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Hardwood Gymnasium Floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} />
      </mesh>
      {/* D-Zone 6m Arc */}
      <mesh position={[0, 0.01, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.3, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Red & White Handball Goal */}
      <group position={[0, 1.0, -3.2]}>
        <mesh position={[-1.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.0, 12]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
        <mesh position={[1.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.0, 12]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 3.12, 12]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
      </group>
      {/* Handball */}
      <mesh position={[0.4, 0.25, -0.5]} castShadow>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Q4: 3D First Snow Alpine Mountain */
export function SnowMountain3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Snowy Terrain */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.7} />
      </mesh>
      {/* Mountain Peak */}
      <mesh position={[0, 2.0, -3.5]} castShadow>
        <coneGeometry args={[3.2, 4.2, 8]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.4, -3.5]}>
        <coneGeometry args={[1.4, 1.6, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Snow Pine Trees */}
      {[-2.0, -0.8, 1.8].map((x, i) => (
        <group key={i} position={[x, 0.8, -1.2 - i * 0.4]}>
          <mesh castShadow>
            <coneGeometry args={[0.6, 1.4, 8]} />
            <meshStandardMaterial color="#065F46" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.45, 0.9, 8]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Q5: 3D Precision Flower Studio & Vase */
export function FlowerVase3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Studio Table */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.4} />
      </mesh>
      {/* Porcelain Vase */}
      <group position={[0, 0.7, -0.5]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.45, 1.2, 24]} />
          <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <torusGeometry args={[0.32, 0.05, 16, 32]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.8} />
        </mesh>
      </group>
      {/* Flowers */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 1.4 + i * 0.1, -0.5 + i * 0.05]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={i === 0 ? "#F43F5E" : i === 1 ? "#F59E0B" : "#EC4899"} />
        </mesh>
      ))}
      {/* Robotic Hand */}
      <group position={[1.4, 1.2, 0.2]} rotation={[0, -0.4, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/** Q6: 3D High-Detail Microscopy Lab */
export function MicroscopyLab3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} />
      </mesh>
      <group position={[0, 0.8, -0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.25, 1.4]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.7, -0.4]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 1.2, 16]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0.1]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.18, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.55, 0.1]} receiveShadow>
          <boxGeometry args={[0.9, 0.08, 0.8]} />
          <meshStandardMaterial color="#0284C7" transparent opacity={0.7} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

/** Q7: 3D Intelligence Analysis Holographic Room */
export function IntelligenceRoom3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#090D16" roughness={0.2} />
      </mesh>
      <group position={[0, 0.6, -0.6]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.4, 0.8, 32]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 0.05, 32]} />
          <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/** Q8: 3D Mountain Walk Hiking Trail & Finish Gate */
export function HikingTrail3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3F6212" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 10]} />
        <meshStandardMaterial color="#A16207" roughness={0.8} />
      </mesh>
      <group position={[0, 1.4, -3.2]}>
        <mesh position={[-1.2, 0, 0]} castShadow>
          <boxGeometry args={[0.25, 2.8, 0.25]} />
          <meshStandardMaterial color="#78350F" roughness={0.7} />
        </mesh>
        <mesh position={[1.2, 0, 0]} castShadow>
          <boxGeometry args={[0.25, 2.8, 0.25]} />
          <meshStandardMaterial color="#78350F" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[2.6, 0.5, 0.08]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
      </group>
    </group>
  );
}

/** Q9: 3D Italian Trattoria */
export function ItalianFood3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#C2410C" roughness={0.6} />
      </mesh>
      <group position={[0, 0.6, -0.6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.9, 1.6]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        <mesh position={[-0.5, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.18, 0.14, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.5, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 20]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
      </group>
    </group>
  );
}

/** Q10: 3D Theatre Stage */
export function DialogueTheatre3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#78350F" roughness={0.4} />
      </mesh>
      <mesh position={[-3.2, 1.8, -2.0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 3.8, 16]} />
        <meshStandardMaterial color="#991B1B" roughness={0.7} />
      </mesh>
      <mesh position={[3.2, 1.8, -2.0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 3.8, 16]} />
        <meshStandardMaterial color="#991B1B" roughness={0.7} />
      </mesh>
      {[-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 1.2]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#FEF08A" emissive="#F59E0B" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}


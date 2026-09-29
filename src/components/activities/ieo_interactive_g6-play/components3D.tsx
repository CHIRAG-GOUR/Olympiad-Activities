"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════════════
   1. HIGH-FIDELITY 3D HUMAN AVATAR
   Articulated 3D human character with head, hair, face features,
   neck, torso, clothes, arms/hands (posed), legs, and shoes.
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
  pose?: "standing" | "sitting" | "walking" | "gesturing" | "holding_cup" | "holding_cone" | "swimming" | "biking" | "kneeling";
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
  const isSitting = pose === "sitting";
  const isKneeling = pose === "kneeling";
  const isWalking = pose === "walking";

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* ── HEAD & FACE ── */}
      <group position={[0, isSitting ? 1.4 : isKneeling ? 1.0 : 1.7, 0]}>
        {/* Head Sphere */}
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
            {/* Hair bangs / front fringe */}
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
            {/* Ponytail back clump */}
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
            {/* Top / Back Bun */}
            <mesh position={[0, 0.22, -0.1]} castShadow>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
          </group>
        )}

        {hairStyle === "cap" && (
          <group position={[0, 0.12, 0]}>
            {/* Cap Dome */}
            <mesh castShadow>
              <sphereGeometry args={[0.24, 20, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.5} />
            </mesh>
            {/* Visor Brim */}
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
            {/* Wide brim */}
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
          {/* Smile / Mouth */}
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

        {/* Optional Glasses */}
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

      {/* ── NECK & TORSO ── */}
      <group position={[0, isSitting ? 0.95 : isKneeling ? 0.6 : 1.15, 0]}>
        {/* Neck */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.12, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Torso / Shirt */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.52, 0.24]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>

        {/* Shirt Collar Detail */}
        <mesh position={[0, 0.28, 0.08]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.06, 0.1]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>

        {/* Optional Backpack */}
        {hasBackpack && (
          <group position={[0, 0.05, -0.18]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.42, 0.16]} />
              <meshStandardMaterial color={backpackColor} roughness={0.6} />
            </mesh>
            {/* Front pocket */}
            <mesh position={[0, -0.08, -0.1]} castShadow>
              <boxGeometry args={[0.26, 0.2, 0.06]} />
              <meshStandardMaterial color={backpackColor} roughness={0.6} />
            </mesh>
          </group>
        )}

        {/* ── ARMS & HANDS ── */}
        {/* Left Arm */}
        <group position={[-0.26, 0.2, 0]}>
          {pose === "gesturing" || pose === "holding_cone" ? (
            <group rotation={[0.8, 0, -0.4]}>
              <mesh position={[0, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.05, 0.32, 12]} />
                <meshStandardMaterial color={shirtColor} />
              </mesh>
              {/* Hand */}
              <mesh position={[0, -0.34, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
              {/* Ice cream cone held */}
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
          {pose === "gesturing" ? (
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
              {/* Coffee Cup in Hand */}
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
        <group position={[0, 0.65, 0]}>
          {/* Upper Thighs forward */}
          <mesh position={[-0.12, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.4, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.12, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.4, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Lower Legs hanging down */}
          <mesh position={[-0.12, -0.3, 0.4]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.45, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.12, -0.3, 0.4]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.45, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Shoes */}
          <mesh position={[-0.12, -0.55, 0.46]} castShadow>
            <boxGeometry args={[0.12, 0.09, 0.22]} />
            <meshStandardMaterial color="#0F172A" roughness={0.4} />
          </mesh>
          <mesh position={[0.12, -0.55, 0.46]} castShadow>
            <boxGeometry args={[0.12, 0.09, 0.22]} />
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
          {/* Left Leg */}
          <mesh position={[-0.12, 0, isWalking ? 0.1 : 0]} rotation={[isWalking ? 0.3 : 0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.75, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Right Leg */}
          <mesh position={[0.12, 0, isWalking ? -0.1 : 0]} rotation={[isWalking ? -0.3 : 0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.75, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Shoes */}
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
   2. 3D DINING TABLE & BREAKFAST SPREAD (For Q1 Morning Routine)
   ══════════════════════════════════════════════════════════════════════ */
export function DiningTable3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.08, 32]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.4} />
      </mesh>
      {/* Table Rim Bevel */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.04, 32]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      {/* 4 Carved Wooden Table Legs */}
      {[
        [-0.7, -0.7],
        [0.7, -0.7],
        [-0.7, 0.7],
        [0.7, 0.7],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x * 0.8, 0.33, z * 0.8]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.66, 12]} />
          <meshStandardMaterial color="#92400E" roughness={0.5} />
        </mesh>
      ))}

      {/* Breakfast Items on Tabletop */}
      {/* Ceramic Plate */}
      <group position={[-0.2, 0.76, 0.2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.3, 0.03, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Sunny-side-up Egg */}
        <mesh position={[-0.05, 0.02, -0.03]}>
          <cylinderGeometry args={[0.15, 0.16, 0.015, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[-0.05, 0.035, -0.03]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.1} />
        </mesh>
        {/* Golden Toast with Melted Butter */}
        <mesh position={[0.12, 0.03, 0.04]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.025, 0.18]} />
          <meshStandardMaterial color="#D97706" roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.045, 0.04]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.07, 0.01, 0.07]} />
          <meshStandardMaterial color="#FDE047" roughness={0.2} />
        </mesh>
      </group>

      {/* Ceramic Mug with Coffee & Steam */}
      <group position={[0.35, 0.76, 0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.18, 16]} />
          <meshStandardMaterial color="#7C3AED" roughness={0.3} />
        </mesh>
        {/* Mug Handle */}
        <mesh position={[0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.018, 8, 16]} />
          <meshStandardMaterial color="#7C3AED" />
        </mesh>
        {/* Coffee Liquid */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.01, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.1} />
        </mesh>
      </group>

      {/* Fresh Orange Juice Glass */}
      <group position={[0.2, 0.76, -0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.22, 16]} />
          <meshStandardMaterial color="#F97316" transparent opacity={0.85} roughness={0.1} />
        </mesh>
        {/* Straw */}
        <mesh position={[0.03, 0.08, 0]} rotation={[0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.26, 8]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   3. 3D ICE-CREAM PARLOUR (For Q11 Suggestions)
   ══════════════════════════════════════════════════════════════════════ */
export function IceCreamParlour3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Parlour Building Base */}
      <mesh position={[0, 1.2, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.4, 1.2]} />
        <meshStandardMaterial color="#FDF2F8" roughness={0.4} />
      </mesh>

      {/* Striped Canopy / Awning */}
      <group position={[0, 2.2, -0.4]} rotation={[0.3, 0, 0]}>
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.06, 1.1]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#F43F5E" : "#FFFFFF"} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Parlour Signboard */}
      <group position={[0, 2.7, -0.8]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.45, 0.1]} />
          <meshStandardMaterial color="#FB7185" roughness={0.3} />
        </mesh>
      </group>

      {/* Display Counter with Glass Case */}
      <group position={[0, 0.6, -0.3]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.9, 0.7]} />
          <meshStandardMaterial color="#F472B6" roughness={0.5} />
        </mesh>
        {/* Glass Countertop Display */}
        <mesh position={[0, 0.35, 0.05]}>
          <boxGeometry args={[2.2, 0.35, 0.5]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        {/* Ice cream tubs inside */}
        {[-0.7, -0.25, 0.25, 0.7].map((x, i) => (
          <mesh key={i} position={[x, 0.3, 0.05]}>
            <cylinderGeometry args={[0.16, 0.14, 0.16, 16]} />
            <meshStandardMaterial color={["#F43F5E", "#38BDF8", "#FCD34D", "#78350F"][i]} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   4. 3D CRICKET PITCH & STADIUM (For Q12 Cricket Absence)
   ══════════════════════════════════════════════════════════════════════ */
export function CricketPitch3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stadium Grass Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#10B981" roughness={0.8} />
      </mesh>

      {/* Clay Cricket Pitch Strip */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.02, 2.6]} />
        <meshStandardMaterial color="#D97706" roughness={0.9} />
      </mesh>

      {/* Crease Lines */}
      <mesh position={[0, 0.025, 0.9]}>
        <boxGeometry args={[1.1, 0.01, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 0.025, -0.9]}>
        <boxGeometry args={[1.1, 0.01, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* 3 Wooden Stumps / Wickets & Bails at Batting End */}
      <group position={[0, 0.02, 1.0]}>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.7, 12]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.4} />
          </mesh>
        ))}
        {/* Horizontal Bail on top */}
        <mesh position={[0, 0.71, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
          <meshStandardMaterial color="#FDE68A" />
        </mesh>
      </group>

      {/* Cricket Bat resting on pitch */}
      <group position={[0.25, 0.05, 0.4]} rotation={[0, -0.4, 1.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.55, 0.03]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.5} />
        </mesh>
        {/* Rubber Grip Handle */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
      </group>

      {/* Red Leather Cricket Ball with White Seam */}
      <group position={[-0.2, 0.06, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   5. 3D METEOROLOGICAL RADAR STATION (For Q13 Storm Prediction)
   ══════════════════════════════════════════════════════════════════════ */
export function WeatherStation3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const dishRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (dishRef.current) dishRef.current.rotation.y += delta * 0.8;
  });

  return (
    <group position={position}>
      {/* Sci-fi Command Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.6, 24]} />
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Glowing Central Radar Screen */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.1, 24]} />
        <meshStandardMaterial color="#0284C7" roughness={0.1} emissive="#0369A1" emissiveIntensity={0.5} />
      </mesh>

      {/* Rotating Radar Tower Dish */}
      <group ref={dishRef} position={[0, 1.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 12]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        {/* Parabolic Radar Dish */}
        <mesh position={[0, 0.45, 0]} rotation={[0.4, 0, 0]} castShadow>
          <sphereGeometry args={[0.45, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.2} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3D Floating Storm Cloud */}
      <group position={[1.2, 2.0, -0.5]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, -0.05, 0]} castShadow>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#64748B" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   6. 3D PARK TRAIL & BOTANICAL TREES (For Q14 Park Direction)
   ══════════════════════════════════════════════════════════════════════ */
export function ParkTrail3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Grass Ground Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#22C55E" roughness={0.8} />
      </mesh>

      {/* Winding Cobblestone Pathway */}
      <mesh position={[-0.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0.3]} receiveShadow>
        <planeGeometry args={[1.2, 4.8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
      </mesh>

      {/* Lush 3D Oak Trees flanking trail */}
      {/* Tree 1 */}
      <group position={[-1.4, 0, -0.8]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 1.4, 12]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#15803D" roughness={0.7} />
        </mesh>
        <mesh position={[0.2, 2.0, 0.1]} castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#16A34A" roughness={0.7} />
        </mesh>
      </group>

      {/* Tree 2 */}
      <group position={[1.4, 0, 0.6]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 1.2, 12]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#16A34A" roughness={0.7} />
        </mesh>
      </group>

      {/* Directional Wooden Signpost */}
      <group position={[0.6, 0, -0.3]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 10]} />
          <meshStandardMaterial color="#92400E" />
        </mesh>
        {/* Signboard Arrow */}
        <mesh position={[0.15, 1.0, 0]} castShadow>
          <boxGeometry args={[0.45, 0.18, 0.04]} />
          <meshStandardMaterial color="#FEF3C7" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   7. 3D TRAIN STATION & PLATFORM (For Q15 Train Delay)
   ══════════════════════════════════════════════════════════════════════ */
export function TrainPlatform3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Platform Surface */}
      <mesh position={[-0.6, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 4.5]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
      </mesh>

      {/* Yellow Safety Line */}
      <mesh position={[0.42, 0.51, 0]}>
        <boxGeometry args={[0.1, 0.01, 4.5]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.4} />
      </mesh>

      {/* Railway Tracks Base */}
      <mesh position={[1.4, 0, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.04, 4.5]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Steel Rails */}
      <mesh position={[0.9, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.08, 4.5]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.7, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.08, 4.5]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Wooden Sleepers */}
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((z, i) => (
        <mesh key={i} position={[1.3, 0.03, z]}>
          <boxGeometry args={[1.2, 0.04, 0.16]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
      ))}

      {/* Digital Delay Board on Overhead Truss */}
      <group position={[-0.8, 2.0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.55, 0.15]} />
          <meshStandardMaterial color="#0F172A" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[1.45, 0.42, 0.01]} />
          <meshStandardMaterial color="#000000" emissive="#FACC15" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   8. 3D NOSTALGIC BEACH VACATION (For Q17 Beach Memories)
   ══════════════════════════════════════════════════════════════════════ */
export function BeachSeaside3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sandy Beach Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#FDE68A" roughness={0.9} />
      </mesh>

      {/* Ocean Water Strip in background */}
      <mesh position={[0, 0.01, -1.8]} receiveShadow>
        <boxGeometry args={[5.5, 0.04, 2.0]} />
        <meshStandardMaterial color="#0284C7" transparent opacity={0.8} roughness={0.1} />
      </mesh>

      {/* Striped Beach Umbrella */}
      <group position={[-1.2, 0, -0.4]}>
        <mesh position={[0, 1.1, 0]} rotation={[0.1, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.2, 10]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Umbrella Canopy Cone */}
        <mesh position={[0.1, 2.1, 0.1]} rotation={[0.1, 0, 0.1]} castShadow>
          <coneGeometry args={[1.1, 0.5, 16]} />
          <meshStandardMaterial color="#EF4444" roughness={0.5} />
        </mesh>
      </group>

      {/* Sandcastle with Turrets */}
      <group position={[1.1, 0, 0.4]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.6]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.9} />
        </mesh>
        {/* Turrets */}
        {[-0.25, 0.25].map((x) =>
          [-0.25, 0.25].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.4, z]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.25, 10]} />
              <meshStandardMaterial color="#D97706" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   9. 3D BOTANICAL HERBARIUM (For Q18 Herbs & Botanical Names)
   ══════════════════════════════════════════════════════════════════════ */
export function Herbarium3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wooden Greenhouse Table */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.1, 1.2]} />
        <meshStandardMaterial color="#B45309" roughness={0.6} />
      </mesh>
      {/* 4 Table Legs */}
      {[
        [-1.2, -0.4],
        [1.2, -0.4],
        [-1.2, 0.4],
        [1.2, 0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 10]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
      ))}

      {/* Pot 1: Basil (Broad glossy leaves) */}
      <group position={[-0.8, 0.55, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.35, 16]} />
          <meshStandardMaterial color="#EA580C" roughness={0.7} />
        </mesh>
        {/* Foliage */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#16A34A" roughness={0.5} />
        </mesh>
      </group>

      {/* Pot 2: Rosemary (Needle branches) */}
      <group position={[0, 0.55, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.35, 16]} />
          <meshStandardMaterial color="#EA580C" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <coneGeometry args={[0.2, 0.45, 12]} />
          <meshStandardMaterial color="#15803D" roughness={0.6} />
        </mesh>
      </group>

      {/* Pot 3: Mint (Aromatic cluster) */}
      <group position={[0.8, 0.55, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.35, 16]} />
          <meshStandardMaterial color="#EA580C" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.28, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#10B981" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   10. 3D PARK BENCH & CLOCK (For Q19 4 PM Duration)
   ══════════════════════════════════════════════════════════════════════ */
export function ParkBenchClock3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Park Ground Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#16A34A" roughness={0.8} />
      </mesh>

      {/* Wooden Park Bench */}
      <group position={[-0.4, 0, 0]}>
        {/* Bench Slats */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.8, 0.05, 0.5]} />
          <meshStandardMaterial color="#92400E" roughness={0.5} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.9, -0.22]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.4, 0.05]} />
          <meshStandardMaterial color="#92400E" roughness={0.5} />
        </mesh>
        {/* Cast Iron Legs */}
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.55, 10]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Standing Grand 3D Clock Post */}
      <group position={[1.4, 0, -0.3]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 2.4, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        {/* Clock Head Disc */}
        <mesh position={[0, 2.3, 0]} rotation={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.14, 24]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   11. 3D ART MASTERPIECE STUDIO (For Q21 Replicate Painting)
   ══════════════════════════════════════════════════════════════════════ */
export function ArtStudio3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Studio Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.1, 32]} />
        <meshStandardMaterial color="#F5F5F4" roughness={0.5} />
      </mesh>

      {/* Wooden Tripod Easel */}
      <group position={[0, 0, -0.2]}>
        {/* 3 Legs */}
        <mesh position={[-0.35, 1.0, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 10]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <mesh position={[0.35, 1.0, 0]} rotation={[0, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 10]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <mesh position={[0, 1.0, -0.4]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 10]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>

        {/* Master Canvas */}
        <group position={[0, 1.2, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.9, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Painting artwork surface */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.1, 0.8]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   12. 3D DEEP OCEAN REEF (For Q25 Marine Creatures)
   ══════════════════════════════════════════════════════════════════════ */
export function MarineReef3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const fishRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (fishRef.current) {
      fishRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.8) * 1.2;
      fishRef.current.position.y = 1.4 + Math.cos(clock.getElapsedTime() * 1.2) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Sandy Ocean Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#0E7490" roughness={0.8} />
      </mesh>

      {/* Colorful Coral Formations */}
      <group position={[-1.0, 0, -0.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#F43F5E" roughness={0.6} />
        </mesh>
      </group>
      <group position={[1.0, 0, -0.2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[0.35, 0.9, 12]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.6} />
        </mesh>
      </group>

      {/* Swimming Sea Turtle */}
      <group position={[-0.4, 1.0, 0.4]} rotation={[0.1, 0.6, -0.1]}>
        {/* Carapace Shell */}
        <mesh castShadow>
          <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#065F46" roughness={0.4} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.1, 0.38]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
        {/* Flippers */}
        <mesh position={[-0.32, 0, 0.15]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.3, 0.02, 0.12]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
        <mesh position={[0.32, 0, 0.15]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.3, 0.02, 0.12]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
      </group>

      {/* Swimming Fish */}
      <group ref={fishRef} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.08, 0.3, 12]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   13. 3D BEAVER RIVER HABITAT & DAM (For Q31-Q33 Beavers)
   ══════════════════════════════════════════════════════════════════════ */
export function BeaverHabitat3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Forest Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} />
      </mesh>

      {/* River Stream */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.02, 5.0]} />
        <meshStandardMaterial color="#0284C7" transparent opacity={0.8} roughness={0.1} />
      </mesh>

      {/* Timber Dam Barrier across River */}
      <group position={[0, 0.25, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.5, 0.6]} />
          <meshStandardMaterial color="#78350F" roughness={0.9} />
        </mesh>
        {/* Criss-cross sticks */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.1, 0]} rotation={[0.4, 0, i % 2 === 0 ? 0.3 : -0.3]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
            <meshStandardMaterial color="#92400E" />
          </mesh>
        ))}
      </group>

      {/* 3D Beaver Animal Model */}
      <group position={[-0.7, 0.2, -0.6]} rotation={[0, 0.6, 0]}>
        {/* Fur Body */}
        <mesh castShadow>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0.22, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#92400E" roughness={0.8} />
        </mesh>
        {/* Prominent Orange Front Incisors! */}
        <group position={[0.36, 0.06, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.03, 0.07, 0.04]} />
            <meshStandardMaterial color="#EA580C" roughness={0.2} />
          </mesh>
        </group>
        {/* Broad Paddle Tail */}
        <mesh position={[-0.32, -0.05, 0]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.35, 0.04, 0.18]} />
          <meshStandardMaterial color="#451A03" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   14. 3D GOA VILLA & PALM TREES (For Q34 & Q36 Goa Residence)
   ══════════════════════════════════════════════════════════════════════ */
export function GoaVilla3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Garden Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#86EFAC" roughness={0.8} />
      </mesh>

      {/* Villa Main Structure */}
      <group position={[0, 0.8, -0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.6, 1.6]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Terracotta Tile Hip Roof */}
        <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.0, 0.9, 4]} />
          <meshStandardMaterial color="#EA580C" roughness={0.5} />
        </mesh>
        {/* Glass Balcony Upper Floor */}
        <mesh position={[0, 0.35, 0.85]} castShadow>
          <boxGeometry args={[1.4, 0.35, 0.2]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} roughness={0.1} />
        </mesh>
        {/* Front Wooden Door */}
        <mesh position={[0, -0.45, 0.82]}>
          <boxGeometry args={[0.4, 0.7, 0.04]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
      </group>

      {/* Tall Coconut Palm Tree */}
      <group position={[-1.5, 0, 0.6]}>
        {/* Slanted Curved Trunk */}
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.08, 0.14, 2.4, 12]} />
          <meshStandardMaterial color="#92400E" roughness={0.9} />
        </mesh>
        {/* Palm Fronds Canopy */}
        {[-0.6, -0.2, 0.2, 0.6].map((rot, i) => (
          <mesh key={i} position={[-0.2, 2.4, 0]} rotation={[rot, i, 0]} castShadow>
            <boxGeometry args={[1.2, 0.02, 0.2]} />
            <meshStandardMaterial color="#15803D" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   15. 3D ABSURD BICYCLE RIDE (For Q46 Preposterous Bike Challenge)
   ══════════════════════════════════════════════════════════════════════ */
export function AbsurdBicycle3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const bikeRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (bikeRef.current) {
      // Gentle comic wobble
      bikeRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 4) * 0.06;
    }
  });

  return (
    <group position={position}>
      {/* Road Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.1, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Wobbling Bicycle Group */}
      <group ref={bikeRef} position={[0, 0.4, 0]}>
        {/* Rear Wheel */}
        <mesh position={[-0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.38, 0.04, 12, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        {/* Front Wheel */}
        <mesh position={[0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.38, 0.04, 12, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        {/* Blue Bike Frame */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#2563EB" metalness={0.7} />
        </mesh>
        <mesh position={[-0.2, 0.35, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color="#2563EB" metalness={0.7} />
        </mesh>
        {/* Handlebars */}
        <mesh position={[0.55, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>

        {/* Front Basket */}
        <mesh position={[0.65, 0.45, 0]} castShadow>
          <boxGeometry args={[0.3, 0.25, 0.35]} />
          <meshStandardMaterial color="#D97706" roughness={0.8} />
        </mesh>

        {/* Cute Golden Dog in Front Basket! */}
        <group position={[0.65, 0.58, 0]}>
          {/* Dog Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.7} />
          </mesh>
          {/* Floppy Ears */}
          <mesh position={[-0.1, 0.05, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          <mesh position={[0.1, 0.05, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          {/* Snout */}
          <mesh position={[0, -0.04, 0.12]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#FED7AA" />
          </mesh>
        </group>

        {/* Cyclist Avatar Riding */}
        <Avatar3D position={[-0.1, 0.2, 0]} scale={0.85} pose="sitting" shirtColor="#DC2626" hairStyle="cap" expression="worried" />
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   16. 3D COMMUNAL HOSTEL KITCHEN (For Q47 Communal Kitchen)
   ══════════════════════════════════════════════════════════════════════ */
export function CommunalKitchen3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tiled Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
      </mesh>

      {/* Large Stainless Steel Shared Kitchen Island */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.0, 1.2]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Double Gas Burners */}
        <mesh position={[-0.6, 0.51, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        <mesh position={[0.6, 0.51, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        {/* Cooking Pot */}
        <mesh position={[-0.6, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.16, 0.24, 16]} />
          <meshStandardMaterial color="#E11D48" roughness={0.3} />
        </mesh>
        {/* Frying Pan */}
        <mesh position={[0.6, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.18, 0.06, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>
      </group>

      {/* 2 Student Chef Avatars Sharing Kitchen */}
      <Avatar3D position={[-1.0, 0, 0.9]} rotation={[0, 0.3, 0]} shirtColor="#059669" hairStyle="bun" pose="standing" />
      <Avatar3D position={[1.0, 0, 0.9]} rotation={[0, -0.3, 0]} shirtColor="#7C3AED" hairStyle="short" pose="standing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   17. 3D SWIMMING POOL THRUST (For Q48 Swimming Propulsion)
   ══════════════════════════════════════════════════════════════════════ */
export function SwimmingPool3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pool Basin Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#0284C7" roughness={0.4} />
      </mesh>

      {/* Translucent Pool Water Volume */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[3.4, 0.8, 2.4]} />
        <meshStandardMaterial color="#06B6D4" transparent opacity={0.65} roughness={0.1} />
      </mesh>

      {/* Floating Lane Separator Ropes with Floats */}
      {[-0.9, 0.9].map((z) => (
        <group key={z} position={[0, 0.82, z]}>
          {[-1.4, -0.7, 0, 0.7, 1.4].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.14, 12]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#EF4444" : "#FFFFFF"} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Swimmer in Freestyle Stroke */}
      <group position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
        {/* Torso lying flat in water */}
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 0.9, 16]} />
          <meshStandardMaterial color="#FED7AA" />
        </mesh>
        {/* Head with Swimcap */}
        <mesh position={[0.55, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#2563EB" />
        </mesh>
        {/* Forward extended arm reaching for stroke */}
        <mesh position={[0.85, 0.16, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
          <meshStandardMaterial color="#FED7AA" />
        </mesh>
        {/* Recovery arm in high-elbow curve */}
        <mesh position={[0.3, 0.35, -0.15]} rotation={[0.4, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.45, 10]} />
          <meshStandardMaterial color="#FED7AA" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   18. 3D CAR RIDE DROP-OFF (For Q50 Social Repayment)
   ══════════════════════════════════════════════════════════════════════ */
export function CarRideDropoff3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Driveway Pavement */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#64748B" roughness={0.7} />
      </mesh>

      {/* 3D Modern Sedan Automobile */}
      <group position={[-0.4, 0.4, -0.2]}>
        {/* Lower Chassis */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[2.2, 0.5, 1.2]} />
          <meshStandardMaterial color="#2563EB" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Cabin Greenhouse with Glass */}
        <mesh position={[-0.1, 0.55, 0]} castShadow>
          <boxGeometry args={[1.2, 0.45, 1.05]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.6} roughness={0.1} />
        </mesh>
        {/* 4 Wheels */}
        {[
          [-0.7, -0.6],
          [0.7, -0.6],
          [-0.7, 0.6],
          [0.7, 0.6],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Driver Avatar inside waving */}
      <Avatar3D position={[-0.3, 0.6, -0.2]} scale={0.7} shirtColor="#F59E0B" pose="gesturing" />

      {/* Grateful Passenger Avatar standing outside car waving */}
      <Avatar3D position={[1.1, 0, 0.4]} rotation={[0, -0.8, 0]} shirtColor="#EC4899" hairStyle="ponytail" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   19. 3D AIRPORT LUGGAGE CAROUSEL (For Q2 Airport Baggage Inquiry)
   ══════════════════════════════════════════════════════════════════════ */
export function AirportLuggage3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const beltRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (beltRef.current) beltRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group position={position}>
      {/* Airport Terminal Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Oval Baggage Carousel Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.4, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Conveyor Belt Slats */}
      <mesh position={[0, 0.41, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.04, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.7} />
      </mesh>

      {/* Rotating Suitcases on Carousel */}
      <group ref={beltRef} position={[0, 0.45, 0]}>
        {/* Red Suitcase */}
        <group position={[0.9, 0.15, 0]} rotation={[0, 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.22, 0.45]} />
            <meshStandardMaterial color="#EF4444" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.08, 0.04, 0.04]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>
        {/* Navy Blue Suitcase */}
        <group position={[-0.8, 0.15, 0.4]} rotation={[0, 1.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.24, 0.5]} />
            <meshStandardMaterial color="#1D4ED8" roughness={0.4} />
          </mesh>
        </group>
        {/* Yellow Hard-shell Luggage */}
        <group position={[0, 0.15, -0.9]} rotation={[0, -0.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.2, 0.42]} />
            <meshStandardMaterial color="#EAB308" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Flight Information Display Pillar */}
      <group position={[-1.2, 0, -1.0]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.0, 16]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[1.2, 0.6, 0.15]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0, 1.8, 0.08]}>
          <boxGeometry args={[1.1, 0.5, 0.01]} />
          <meshStandardMaterial color="#0284C7" emissive="#0369A1" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Inquiring Traveler Avatar with Trolley */}
      <Avatar3D position={[1.4, 0, 0.6]} rotation={[0, -1.2, 0]} shirtColor="#8B5CF6" hairStyle="short" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   20. 3D RESTAURANT CHEF KITCHEN (For Q3 Head Chef Career)
   ══════════════════════════════════════════════════════════════════════ */
export function ChefKitchen3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tiled Kitchen Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
      </mesh>

      {/* Commercial Stainless Steel Cooktop Island */}
      <group position={[0, 0.5, -0.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.6, 1.0, 1.1]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Gas Burner Grates */}
        <mesh position={[-0.5, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        {/* Blue/Orange Flame */}
        <mesh position={[-0.5, 0.56, 0]}>
          <coneGeometry args={[0.18, 0.1, 12]} />
          <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.9} />
        </mesh>
        {/* Copper Sauté Pan */}
        <group position={[-0.5, 0.62, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.08, 16]} />
            <meshStandardMaterial color="#EA580C" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.3, 0.02, 0]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>

        {/* Wooden Prep Cutting Board with Bell Pepper */}
        <group position={[0.6, 0.52, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.04, 0.35]} />
            <meshStandardMaterial color="#B45309" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>
        </group>
      </group>

      {/* Head Chef Avatar in White Chef Coat & Toque */}
      <Avatar3D position={[0, 0, 0.8]} rotation={[0, 0, 0]} shirtColor="#FFFFFF" pantsColor="#0F172A" hairStyle="bun" pose="standing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   21. 3D GLOBAL LANGUAGE GLOBE (For Q4 Romance Languages)
   ══════════════════════════════════════════════════════════════════════ */
export function LanguageGlobe3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const globeRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group position={position}>
      {/* Stone Library Dais */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.1, 32]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.6} />
      </mesh>

      {/* Classical Mahogany Globe Stand */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 0.7, 24]} />
        <meshStandardMaterial color="#78350F" roughness={0.4} />
      </mesh>
      {/* Brass Meridian Arm Ring */}
      <mesh position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 12, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rotating 3D World Globe */}
      <group ref={globeRef} position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial color="#0284C7" roughness={0.3} />
        </mesh>
        {/* Continents (Stylized 3D land patches) */}
        {[-0.3, 0.2, 0.5].map((lat, i) => (
          <mesh key={i} position={[Math.sin(i * 2) * 0.6, lat, Math.cos(i * 2) * 0.6]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#22C55E" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Language Pedestals: French, Spanish, Latin */}
      <group position={[-1.4, 0, 0.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 0.8, 16]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.3, 0.08, 0.25]} />
          <meshStandardMaterial color="#1E40AF" />
        </mesh>
      </group>
      <group position={[1.4, 0, 0.5]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 0.8, 16]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.3, 0.08, 0.25]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   22. 3D CITY BUS STOP SHELTER & BUS (For Q5 Bus Delay)
   ══════════════════════════════════════════════════════════════════════ */
export function BusStopShelter3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const busRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (busRef.current) {
      busRef.current.position.x = 1.0 + Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Pavement & Road */}
      <mesh position={[-0.8, -0.05, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.1, 4.5]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
      </mesh>
      <mesh position={[1.2, -0.05, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.08, 4.5]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Yellow Road Divider Stripe */}
      <mesh position={[1.2, 0.01, 0]}>
        <boxGeometry args={[0.08, 0.01, 4.5]} />
        <meshStandardMaterial color="#FACC15" />
      </mesh>

      {/* Modern Glass Bus Shelter */}
      <group position={[-1.2, 0, 0]}>
        {/* Steel Support Posts */}
        <mesh position={[-0.4, 0.9, -0.9]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        <mesh position={[-0.4, 0.9, 0.9]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        {/* Curved Glass Roof Canopy */}
        <mesh position={[-0.1, 1.8, 0]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[1.2, 0.05, 2.2]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} />
        </mesh>
        {/* Glass Back Wall */}
        <mesh position={[-0.45, 0.9, 0]}>
          <boxGeometry args={[0.04, 1.6, 2.0]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.4} />
        </mesh>
        {/* Shelter Bench */}
        <mesh position={[-0.3, 0.45, 0]} castShadow>
          <boxGeometry args={[0.3, 0.04, 1.4]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        {/* Bus Stop Timetable Sign */}
        <group position={[0.2, 0, 1.2]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 10]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
        </group>
      </group>

      {/* Approaching Yellow City Bus */}
      <group ref={busRef} position={[1.2, 0.55, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.9, 2.4]} />
          <meshStandardMaterial color="#FACC15" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.15, 1.21]}>
          <boxGeometry args={[1.0, 0.45, 0.02]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.7} />
        </mesh>
        {/* Headlights */}
        <mesh position={[-0.4, -0.2, 1.21]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.4, -0.2, 1.21]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Waiting Commuter Avatar */}
      <Avatar3D position={[-1.1, 0, 0]} shirtColor="#0284C7" hairStyle="cap" pose="sitting" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   23. 3D CLASSROOM AUDITORIUM & EXAM HALL (For Q6 & Q24)
   ══════════════════════════════════════════════════════════════════════ */
export function ClassroomAuditorium3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Classroom Parquet Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#FDE68A" roughness={0.6} />
      </mesh>

      {/* Large Green Chalkboard on Wall */}
      <group position={[0, 1.4, -1.8]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 1.4, 0.08]} />
          <meshStandardMaterial color="#065F46" roughness={0.7} />
        </mesh>
        {/* Wooden Frame */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[3.3, 1.5, 0.04]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
      </group>

      {/* Two Student Wooden Desks */}
      {/* Left Desk */}
      <group position={[-0.9, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.06, 0.6]} />
          <meshStandardMaterial color="#92400E" roughness={0.5} />
        </mesh>
        {/* Desk Legs */}
        {[
          [-0.4, -0.2],
          [0.4, -0.2],
          [-0.4, 0.2],
          [0.4, 0.2],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.24, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.48, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
        ))}
        {/* Exam Paper on Desk */}
        <mesh position={[0, 0.54, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Student 1 Avatar */}
        <Avatar3D position={[0, 0, 0.5]} pose="sitting" shirtColor="#2563EB" hairStyle="short" expression="neutral" />
      </group>

      {/* Right Desk */}
      <group position={[0.9, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.06, 0.6]} />
          <meshStandardMaterial color="#92400E" roughness={0.5} />
        </mesh>
        {[
          [-0.4, -0.2],
          [0.4, -0.2],
          [-0.4, 0.2],
          [0.4, 0.2],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.24, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.48, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 0.54, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Student 2 Avatar */}
        <Avatar3D position={[0, 0, 0.5]} pose="sitting" shirtColor="#DC2626" hairStyle="ponytail" expression="worried" />
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   24. 3D PARK PICNIC & RAIN CLOUD (For Q7 Conditional Rain)
   ══════════════════════════════════════════════════════════════════════ */
export function PicnicParkRain3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const rainRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rainRef.current) {
      rainRef.current.children.forEach((drop) => {
        drop.position.y -= delta * 3;
        if (drop.position.y < 0.2) drop.position.y = 2.0;
      });
    }
  });

  return (
    <group position={position}>
      {/* Meadow Grass */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#22C55E" roughness={0.8} />
      </mesh>

      {/* Red Checkered Picnic Blanket */}
      <mesh position={[0, 0.01, 0.2]} receiveShadow>
        <boxGeometry args={[2.0, 0.02, 1.8]} />
        <meshStandardMaterial color="#EF4444" roughness={0.9} />
      </mesh>

      {/* Wicker Picnic Basket */}
      <group position={[-0.4, 0.15, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.3, 0.35]} />
          <meshStandardMaterial color="#B45309" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <torusGeometry args={[0.15, 0.02, 8, 16]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
      </group>

      {/* Fruit Platter */}
      <group position={[0.3, 0.04, 0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.03, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.06, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
        <mesh position={[0.06, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#84CC16" />
        </mesh>
      </group>

      {/* Floating Rain Cloud & Raindrops */}
      <group position={[0.8, 2.2, -0.6]}>
        <mesh castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        <mesh position={[0.35, -0.05, 0]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#64748B" roughness={0.9} />
        </mesh>
        <mesh position={[-0.35, -0.05, 0]} castShadow>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* Raindrop particles */}
        <group ref={rainRef}>
          {[-0.3, -0.1, 0.1, 0.3].map((rx, i) => (
            <mesh key={i} position={[rx, 1.2 - i * 0.3, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.15, 6]} />
              <meshStandardMaterial color="#38BDF8" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Picnic Avatar with Open Umbrella */}
      <Avatar3D position={[-0.9, 0, 0.8]} shirtColor="#F59E0B" hairStyle="cap" pose="standing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   25. 3D SCHOOL TOUR BUS & MONUMENT GATE (For Q8 Excursion)
   ══════════════════════════════════════════════════════════════════════ */
export function SchoolTourBus3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Ground & Plaza */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
      </mesh>

      {/* Historic Monument Archway */}
      <group position={[0, 0, -1.2]}>
        <mesh position={[-1.1, 1.1, 0]} castShadow>
          <boxGeometry args={[0.4, 2.2, 0.4]} />
          <meshStandardMaterial color="#B45309" roughness={0.6} />
        </mesh>
        <mesh position={[1.1, 1.1, 0]} castShadow>
          <boxGeometry args={[0.4, 2.2, 0.4]} />
          <meshStandardMaterial color="#B45309" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <boxGeometry args={[2.8, 0.4, 0.5]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>
      </group>

      {/* School Tour Coach Bus */}
      <group position={[-0.6, 0.5, 0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.8, 1.0]} />
          <meshStandardMaterial color="#0284C7" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Windows */}
        <mesh position={[0, 0.15, 0.51]}>
          <boxGeometry args={[1.6, 0.35, 0.02]} />
          <meshStandardMaterial color="#E0F2FE" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Excited Student Avatars with Backpacks */}
      <Avatar3D position={[0.8, 0, 0.4]} shirtColor="#10B981" hairStyle="cap" hasBackpack backpackColor="#EF4444" pose="gesturing" />
      <Avatar3D position={[1.4, 0, 0.8]} shirtColor="#EC4899" hairStyle="ponytail" hasBackpack backpackColor="#8B5CF6" pose="walking" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   26. 3D CORPORATE OFFICE & DESKS (For Q9 Seniority Comparison)
   ══════════════════════════════════════════════════════════════════════ */
export function CorporateOffice3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Modern Office Carpet */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Executive Office Desk */}
      <group position={[0, 0.45, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.08, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} />
        </mesh>
        {/* Steel Legs */}
        {[
          [-1.1, -0.5],
          [1.1, -0.5],
          [-1.1, 0.5],
          [1.1, 0.5],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.22, z]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.44, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} />
          </mesh>
        ))}

        {/* Dual Laptop Workstations */}
        <group position={[-0.6, 0.08, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.02, 0.3]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.15, -0.15]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.4, 0.28, 0.02]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 0.15, -0.14]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.36, 0.24, 0.01]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.5} />
          </mesh>
        </group>

        <group position={[0.6, 0.08, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.02, 0.3]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.15, -0.15]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.4, 0.28, 0.02]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 0.15, -0.14]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.36, 0.24, 0.01]} />
            <meshStandardMaterial color="#A855F7" emissive="#7E22CE" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>

      {/* Senior Colleague Avatar */}
      <Avatar3D position={[-0.6, 0, 0.7]} shirtColor="#1E3A8A" pantsColor="#0F172A" pose="sitting" expression="happy" />

      {/* Junior Colleague Avatar */}
      <Avatar3D position={[0.6, 0, 0.7]} shirtColor="#0D9488" pantsColor="#1E293B" pose="sitting" expression="neutral" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   27. 3D TRANSIT TICKET KIOSK (For Q10 Lend Some Money)
   ══════════════════════════════════════════════════════════════════════ */
export function TicketKiosk3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Metro Concourse Tile */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.1, 32]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.3} />
      </mesh>

      {/* Automated Ticket Vending Machine Kiosk */}
      <group position={[-0.5, 1.0, -0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 2.0, 0.8]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Touch Screen Interface */}
        <mesh position={[0, 0.3, 0.41]}>
          <boxGeometry args={[0.7, 0.5, 0.02]} />
          <meshStandardMaterial color="#0284C7" emissive="#0369A1" emissiveIntensity={0.7} />
        </mesh>
        {/* Coin & Currency Slot */}
        <mesh position={[0.2, -0.15, 0.41]}>
          <boxGeometry args={[0.2, 0.04, 0.02]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        {/* Ticket Dispenser Bin */}
        <mesh position={[0, -0.55, 0.41]}>
          <boxGeometry args={[0.5, 0.2, 0.04]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Commuter Avatar Searching Pockets */}
      <Avatar3D position={[0.6, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#7C3AED" hairStyle="short" pose="gesturing" expression="surprised" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   28. 3D PLAYGROUND SWINGS & SLIDE (For Q16 Playing in Park)
   ══════════════════════════════════════════════════════════════════════ */
export function PlaygroundPark3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Playground Turf */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#16A34A" roughness={0.8} />
      </mesh>

      {/* A-Frame Swing Set */}
      <group position={[-1.0, 0, -0.2]}>
        {/* Frame Beams */}
        <mesh position={[-0.7, 1.1, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 10]} />
          <meshStandardMaterial color="#2563EB" metalness={0.8} />
        </mesh>
        <mesh position={[0.7, 1.1, 0]} rotation={[0, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 10]} />
          <meshStandardMaterial color="#2563EB" metalness={0.8} />
        </mesh>
        {/* Top Crossbar */}
        <mesh position={[0, 2.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshStandardMaterial color="#2563EB" metalness={0.8} />
        </mesh>
        {/* Swing Seat Hanging */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.4, 0.03, 0.2]} />
          <meshStandardMaterial color="#EA580C" />
        </mesh>
      </group>

      {/* Yellow Playground Slide */}
      <group position={[1.1, 0, 0]}>
        {/* Slide Chute */}
        <mesh position={[0, 0.8, 0]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 1.8]} />
          <meshStandardMaterial color="#FACC15" roughness={0.2} />
        </mesh>
        {/* Ladder Steps */}
        <mesh position={[0, 0.8, -0.7]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Happy Playing Child Avatar */}
      <Avatar3D position={[0, 0, 0.8]} shirtColor="#EC4899" hairStyle="ponytail" pose="gesturing" expression="happy" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   29. 3D PRECIOUS ANTIQUE GIFT UNBOXING (For Q20 Precious Gift)
   ══════════════════════════════════════════════════════════════════════ */
export function GiftUnboxing3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Polished Tabletop */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 32]} />
        <meshStandardMaterial color="#78350F" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#451A03" />
      </mesh>

      {/* Opened Crimson Gift Box with Gold Ribbon */}
      <group position={[0, 0.62, 0]}>
        {/* Box Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.25, 0.6]} />
          <meshStandardMaterial color="#DC2626" roughness={0.4} />
        </mesh>
        {/* Satin Gold Lining Inside */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.55, 0.1, 0.55]} />
          <meshStandardMaterial color="#FEF08A" roughness={0.2} metalness={0.6} />
        </mesh>
        {/* Antique Gold Pocket Watch / Pendant */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Open Box Lid tilted to side */}
        <mesh position={[0.5, 0.15, 0.2]} rotation={[0.4, 0.3, 0.6]} castShadow>
          <boxGeometry args={[0.64, 0.08, 0.64]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
      </group>

      {/* Celebrating Grandchild Avatar */}
      <Avatar3D position={[0.9, 0, 0.6]} rotation={[0, -0.6, 0]} shirtColor="#9333EA" hairStyle="bun" pose="gesturing" expression="happy" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   30. 3D GRAND BANQUET HALL & CHANDELIER (For Q22 Golden Chandeliers)
   ══════════════════════════════════════════════════════════════════════ */
export function GrandBanquetHall3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Marble Ballroom Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Long Royal Banquet Table */}
      <group position={[0, 0.45, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.08, 1.1]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Golden Table Runner */}
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[3.0, 0.01, 0.4]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} />
        </mesh>

        {/* Candelabras with Flickering Candles */}
        {[-0.8, 0.8].map((x, i) => (
          <group key={i} position={[x, 0.25, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.04, 0.35, 12]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.9} />
            </mesh>
            {/* Flames */}
            <mesh position={[0, 0.22, 0]}>
              <coneGeometry args={[0.03, 0.08, 8]} />
              <meshStandardMaterial color="#EA580C" emissive="#F59E0B" emissiveIntensity={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Hanging Golden Crystal Chandelier */}
      <group position={[0, 2.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.2, 0.4, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Glowing Crystal Drops */}
        {[-0.4, 0, 0.4].map((x, i) => (
          <mesh key={i} position={[x, -0.25, 0]} castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#FEF08A" emissive="#FACC15" emissiveIntensity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   31. 3D ACOUSTIC SOUND LAB & BELL (For Q23 Barely Audible)
   ══════════════════════════════════════════════════════════════════════ */
export function AcousticSoundLab3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const waveRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (waveRef.current) {
      waveRef.current.children.forEach((ring, idx) => {
        const s = 1 + Math.sin(clock.getElapsedTime() * 2 + idx) * 0.2;
        ring.scale.set(s, s, s);
      });
    }
  });

  return (
    <group position={position}>
      {/* Sound Chamber Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.1, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* Brass Bell Stand */}
      <group position={[-0.8, 0, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.6, 12]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        {/* Resonant Brass Bell */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <coneGeometry args={[0.3, 0.4, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Expanding Acoustic Waveform Rings */}
      <group ref={waveRef} position={[-0.8, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {[0.6, 1.0, 1.4].map((rad, i) => (
          <mesh key={i}>
            <ringGeometry args={[rad, rad + 0.04, 32]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.6 - i * 0.15} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Oscilloscope Decibel Meter Station */}
      <group position={[1.0, 0.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.6, 0.4]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.21]}>
          <boxGeometry args={[0.7, 0.45, 0.01]} />
          <meshStandardMaterial color="#10B981" emissive="#059669" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   32. 3D LEXICAL MANUSCRIPT VAULT (For Q26 Ancient Manuscript)
   ══════════════════════════════════════════════════════════════════════ */
export function LexicalVault3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stone Chamber Podium */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.6, 0.6, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Brass Lectern */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.7, 16]} />
        <meshStandardMaterial color="#D97706" metalness={0.8} />
      </mesh>
      {/* Angled Book Rest */}
      <group position={[0, 1.3, 0]} rotation={[0.4, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.06, 0.8]} />
          <meshStandardMaterial color="#78350F" roughness={0.5} />
        </mesh>
        {/* Ancient Open Parchment Manuscript */}
        <mesh position={[-0.24, 0.05, 0]} rotation={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[0.45, 0.03, 0.65]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.9} />
        </mesh>
        <mesh position={[0.24, 0.05, 0]} rotation={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[0.45, 0.03, 0.65]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.9} />
        </mesh>
      </group>

      {/* Scholar Avatar Examining with Magnifying Glass */}
      <Avatar3D position={[0, 0, 1.1]} shirtColor="#4338CA" hairStyle="short" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   33. 3D PATAGONIA GLACIER EXPEDITION (For Q32 & Q33 Expedition)
   ══════════════════════════════════════════════════════════════════════ */
export function GlacierExpedition3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Glacial Snow Base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#E0F2FE" roughness={0.4} />
      </mesh>

      {/* Jagged Mountain Glacial Peaks */}
      <group position={[0, 0, -1.2]}>
        <mesh position={[-1.0, 1.2, 0]} castShadow>
          <coneGeometry args={[1.2, 2.4, 4]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.9} />
        </mesh>
        {/* Snow Cap */}
        <mesh position={[-1.0, 1.9, 0]} castShadow>
          <coneGeometry args={[0.5, 1.0, 4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>

        <mesh position={[0.8, 1.0, 0]} castShadow>
          <coneGeometry args={[1.0, 2.0, 4]} />
          <meshStandardMaterial color="#64748B" roughness={0.9} />
        </mesh>
      </group>

      {/* Geodesic Dome Expedition Tent */}
      <group position={[-0.8, 0.4, 0.4]}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#F97316" roughness={0.6} />
        </mesh>
      </group>

      {/* Polar Explorer Avatar in Heavy Parka */}
      <Avatar3D position={[0.6, 0, 0.5]} shirtColor="#DC2626" hairStyle="cap" hasBackpack backpackColor="#1E293B" pose="standing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   34. 3D VILLA VERANDAH & ROCKING CHAIR (For Q35 Reading in Verandah)
   ══════════════════════════════════════════════════════════════════════ */
export function VillaVerandah3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Terracotta Verandah Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#EA580C" roughness={0.6} />
      </mesh>

      {/* Colonial Arch Columns */}
      <group position={[0, 0, -1.2]}>
        {[-1.2, 0, 1.2].map((x, i) => (
          <mesh key={i} position={[x, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 2.2, 16]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Woven Rocking Chair */}
      <group position={[-0.4, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.08, 0.5]} />
          <meshStandardMaterial color="#78350F" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.4, -0.22]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.06]} />
          <meshStandardMaterial color="#92400E" roughness={0.6} />
        </mesh>
      </group>

      {/* Round Tea Table with Teapot */}
      <group position={[0.6, 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 20]} />
          <meshStandardMaterial color="#FEF3C7" />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        {/* Porcelain Teapot */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#0284C7" roughness={0.2} />
        </mesh>
      </group>

      {/* Relaxing Grandmother Avatar */}
      <Avatar3D position={[-0.4, 0, 0]} pose="sitting" shirtColor="#E11D48" hairStyle="bun" expression="happy" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   35. 3D TRAIL GREETING & FENCE (For Q37 Spoken Greetings)
   ══════════════════════════════════════════════════════════════════════ */
export function TrailGreeting3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Grassy Path */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#22C55E" roughness={0.8} />
      </mesh>

      {/* Wooden Picket Fence */}
      <group position={[0, 0.4, -1.0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 0.08, 0.04]} />
          <meshStandardMaterial color="#FEF3C7" />
        </mesh>
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.8, 0.04]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>

      {/* Two Walking Avatars Greeting */}
      <Avatar3D position={[-0.8, 0, 0.2]} rotation={[0, 0.5, 0]} shirtColor="#2563EB" hairStyle="short" pose="gesturing" />
      <Avatar3D position={[0.8, 0, 0.2]} rotation={[0, -0.5, 0]} shirtColor="#EC4899" hairStyle="ponytail" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   36. 3D SPORTS PODIUM & TROPHY (For Q38 Congratulations)
   ══════════════════════════════════════════════════════════════════════ */
export function SportsVictoryPodium3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stadium Arena Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#0284C7" roughness={0.4} />
      </mesh>

      {/* 3-Tiered Victory Podium */}
      {/* 1st Place (Center, Tallest) */}
      <group position={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Golden Championship Trophy Cup */}
        <group position={[0, 0.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.08, 0.35, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.1, 16]} />
            <meshStandardMaterial color="#B45309" />
          </mesh>
        </group>
      </group>

      {/* 2nd Place (Left) */}
      <mesh position={[-0.9, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.6} />
      </mesh>

      {/* 3rd Place (Right) */}
      <mesh position={[0.9, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.3, 0.8]} />
        <meshStandardMaterial color="#B45309" metalness={0.5} />
      </mesh>

      {/* Champion Avatar on Podium */}
      <Avatar3D position={[0, 0.8, 0]} shirtColor="#DC2626" hairStyle="cap" pose="gesturing" expression="happy" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   37. 3D LIBRARY INQUIRY DESK (For Q39 Library Direction)
   ══════════════════════════════════════════════════════════════════════ */
export function LibraryDesk3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Parquet Library Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#FDE68A" roughness={0.5} />
      </mesh>

      {/* Towering Bookshelf */}
      <group position={[0, 1.2, -1.3]}>
        <mesh castShadow>
          <boxGeometry args={[3.0, 2.4, 0.5]} />
          <meshStandardMaterial color="#78350F" roughness={0.6} />
        </mesh>
        {/* Book rows */}
        {[-0.6, 0, 0.6].map((y, i) => (
          <group key={i} position={[0, y, 0.1]}>
            {[-1.0, -0.5, 0, 0.5, 1.0].map((x, j) => (
              <mesh key={j} position={[x, 0, 0]} castShadow>
                <boxGeometry args={[0.35, 0.45, 0.3]} />
                <meshStandardMaterial color={["#DC2626", "#2563EB", "#16A34A", "#F59E0B", "#9333EA"][(i + j) % 5]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Library Information Desk */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.0, 0.8]} />
          <meshStandardMaterial color="#92400E" roughness={0.4} />
        </mesh>
        {/* Green Banker's Desk Lamp */}
        <mesh position={[-0.6, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
          <meshStandardMaterial color="#065F46" roughness={0.2} />
        </mesh>
      </group>

      {/* Librarian Avatar behind desk */}
      <Avatar3D position={[0, 0, -0.6]} shirtColor="#4B5563" hairStyle="bun" pose="standing" />

      {/* Inquiring Student Avatar in front */}
      <Avatar3D position={[0, 0, 0.8]} rotation={[0, Math.PI, 0]} shirtColor="#3B82F6" hairStyle="short" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   38. 3D MEDICAL INFIRMARY CLINIC (For Q41 First Aid / Throat)
   ══════════════════════════════════════════════════════════════════════ */
export function MedicalInfirmary3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sanitary Clinic Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#E0F2FE" roughness={0.3} />
      </mesh>

      {/* Adjustable Medical Bed */}
      <group position={[-0.8, 0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.45, 2.0]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Pillow */}
        <mesh position={[0, 0.28, -0.7]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshStandardMaterial color="#BAE6FD" />
        </mesh>
      </group>

      {/* First Aid Medicine Cabinet / Stand */}
      <group position={[0.9, 0.8, -0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 1.6, 0.5]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.5} />
        </mesh>
        {/* Red Cross Emblem */}
        <mesh position={[0, 0.4, 0.26]}>
          <boxGeometry args={[0.2, 0.06, 0.01]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
        <mesh position={[0, 0.4, 0.26]}>
          <boxGeometry args={[0.06, 0.2, 0.01]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Doctor Avatar with Stethoscope */}
      <Avatar3D position={[0.4, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#FFFFFF" pantsColor="#0F172A" hairStyle="short" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   39. 3D SUBURBAN GARDEN & SHEARS (For Q42 Borrowing Tools)
   ══════════════════════════════════════════════════════════════════════ */
export function SuburbanGarden3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Garden Lawn */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} />
      </mesh>

      {/* Flower Bed with Tulips */}
      <group position={[0, 0.1, -1.0]}>
        <mesh castShadow>
          <boxGeometry args={[2.8, 0.15, 0.6]} />
          <meshStandardMaterial color="#78350F" roughness={0.9} />
        </mesh>
        {[-1.0, -0.5, 0, 0.5, 1.0].map((x, i) => (
          <mesh key={i} position={[x, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#F43F5E" : "#FBBF24"} />
          </mesh>
        ))}
      </group>

      {/* Garden Wheelbarrow & Shears */}
      <group position={[-0.8, 0.25, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.3, 0.5]} />
          <meshStandardMaterial color="#0284C7" metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.15, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Helpful Neighbour Avatar */}
      <Avatar3D position={[0.7, 0, 0.3]} shirtColor="#D97706" hairStyle="hat" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   40. 3D CAFÉ BISTRO PATIO (For Q43 Ordering Food)
   ══════════════════════════════════════════════════════════════════════ */
export function CafeBistro3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cobblestone Bistro Patio */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.1, 32]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
      </mesh>

      {/* Marble Round Bistro Table */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.05, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.5, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>

        {/* Coffee Cup & Croissant */}
        <mesh position={[-0.2, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.1, 12]} />
          <meshStandardMaterial color="#7C3AED" />
        </mesh>
        <mesh position={[0.2, 0.06, 0]} castShadow>
          <torusGeometry args={[0.08, 0.03, 8, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.8} />
        </mesh>
      </group>

      {/* Dining Customer Avatar */}
      <Avatar3D position={[-0.8, 0, 0]} rotation={[0, 0.8, 0]} pose="sitting" shirtColor="#059669" hairStyle="beret" expression="happy" />

      {/* Courteous Waiter Avatar */}
      <Avatar3D position={[0.8, 0, -0.2]} rotation={[0, -0.8, 0]} shirtColor="#FFFFFF" pantsColor="#000000" hairStyle="short" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   41. 3D BIKE REPAIR WORKSHOP (For Q44 Bicycle Wrench Repair)
   ══════════════════════════════════════════════════════════════════════ */
export function BikeWorkshop3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Workshop Concrete Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#64748B" roughness={0.6} />
      </mesh>

      {/* Heavy-Duty Work Stand holding Bike Frame */}
      <group position={[-0.4, 0.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 1.6, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        {/* Bike Frame in clamp */}
        <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[1.0, 0.06, 0.06]} />
          <meshStandardMaterial color="#DC2626" metalness={0.7} />
        </mesh>
      </group>

      {/* Red Tool Chest with Wrenches */}
      <group position={[0.9, 0.45, -0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.9, 0.5]} />
          <meshStandardMaterial color="#EF4444" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Chrome Wrench on top */}
        <mesh position={[0, 0.48, 0]} rotation={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.25, 0.02, 0.04]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Mechanic Avatar with Tools */}
      <Avatar3D position={[0.3, 0, 0.6]} rotation={[0, -0.5, 0]} shirtColor="#2563EB" hairStyle="cap" pose="gesturing" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   42. 3D MOUNTAIN SUMMIT & CAIRN (For Q45 Summit Rest)
   ══════════════════════════════════════════════════════════════════════ */
export function MountainSummit3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Rocky Mountain Summit Peak */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} />
      </mesh>

      {/* Stacked Trail Marker Stone Cairn */}
      <group position={[-0.8, 0, -0.3]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#57534E" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#78716C" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#A8A29E" roughness={0.8} />
        </mesh>
      </group>

      {/* Mountain Vista Pine Trees in distance */}
      <group position={[1.2, 0, -1.0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <coneGeometry args={[0.4, 1.6, 8]} />
          <meshStandardMaterial color="#065F46" roughness={0.8} />
        </mesh>
      </group>

      {/* Victorious Hiker Avatar with Trekking Poles */}
      <Avatar3D position={[0.2, 0, 0.3]} shirtColor="#D97706" hairStyle="hat" hasBackpack backpackColor="#1E293B" pose="gesturing" expression="happy" />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   43. 3D OPTICAL CLARITY SCIENCE SCANNER (For Q49 Lucidity / Clarity)
   ══════════════════════════════════════════════════════════════════════ */
export function OpticalScanner3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const prismRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (prismRef.current) {
      prismRef.current.rotation.y = clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Sci-fi Research Lab Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.1, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Optical Analyzer Dais */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.6, 24]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Floating Rotating Optical Crystal Prism */}
      <group ref={prismRef} position={[0, 1.2, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.75} roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Glowing holographic energy rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshStandardMaterial color="#818CF8" emissive="#6366F1" emissiveIntensity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Research Scientist Avatar with Clipboard */}
      <Avatar3D position={[1.1, 0, 0.5]} rotation={[0, -0.8, 0]} shirtColor="#FFFFFF" pantsColor="#0F172A" hairStyle="short" pose="gesturing" />
    </group>
  );
}


"use client";

import React from "react";
import { Avatar3D } from "./avatar3D";

/* Indoor scenes shared by the English papers: the breakfast table and the ice-cream parlour. */

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
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial color="#D9A066" roughness={0.4} />
      </mesh>

      {/* Floor Rug */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.6]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.8} />
      </mesh>

      {/* Back Room Wall */}
      <mesh position={[0, 2, -2.5]} receiveShadow>
        <planeGeometry args={[30, 4]} />
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
   10. 3D ICE-CREAM PARLOUR (Q11 Treat Suggestion)
   ══════════════════════════════════════════════════════════════════════ */
export function IceCreamParlour3D({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Checkerboard Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial color="#FCE7F3" roughness={0.3} />
      </mesh>

      {/* Striped Awning Wall Backdrop */}
      <group position={[0, 2.2, -2.4]}>
        <mesh receiveShadow>
          <planeGeometry args={[30, 3.6]} />
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



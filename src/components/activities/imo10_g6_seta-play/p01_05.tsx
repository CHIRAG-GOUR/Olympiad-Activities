"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Box, Sparkles, Eye, Scissors, ShieldAlert, CheckCircle2, RotateCw } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn, Shell, Board, PlayCanvas, World3D } from "./kit";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════════════
   Q01 — The 3D Number Forge
   25 : 5, 36 : 6, ? : 7 => 7² = 49 (Option A).
   ══════════════════════════════════════════════════════════════════════ */

function NumberCapsuleMesh({ position, input, output, active }: { position: [number, number, number]; input: string | number; output: number; active?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Cylindrical Capsule Pillar */}
      <mesh ref={meshRef} position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.1, 2.2, 32]} />
        <meshStandardMaterial
          color={active ? "#4f46e5" : "#0284c7"}
          metalness={0.6}
          roughness={0.2}
          emissive={active ? "#312e81" : "#082f49"}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Base Pedestal */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.3, 1.5, 0.3, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Q01NumberForgeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ constructedNumber: number; verified: boolean }>({
    question,
    initial: { constructedNumber: 49, verified: true },
    derive: (w) => {
      const num = w?.constructedNumber ?? 0;
      if (num === 49) {
        return {
          value: "49",
          optionId: matchText(question, "49") ?? "A",
        };
      }
      return { note: `Machine Input: ${num} (√${num} = ${Math.sqrt(num).toFixed(2)}). Forge output 7.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const num = play.world?.constructedNumber ?? 49;

  return (
    <Shell
      play={play}
      question={question}
      title="The 3D Number Forge"
      mission="Operate the mathematical forge: analyze capsules 25→5 and 36→6 to construct the missing input that yields output 7 (√49 = 7)."
      icon={Sparkles}
      dim="3D"
      submitLabel="Forge & Submit 49 (Option A)"
      hints={[
        "Capsule 1: 25 = 5² (√25 = 5).",
        "Capsule 2: 36 = 6² (√36 = 6).",
        "Capsule 3: For output 7, the missing number is 7² = 49.",
      ]}
      live={
        <>
          <Gauge label="Capsule 1" value="25 → 5" tone="sky" />
          <Gauge label="Capsule 2" value="36 → 6" tone="sky" />
          <Gauge label="Capsule 3 Input" value={num} tone={num === 49 ? "emerald" : "amber"} />
          <Gauge label="Output (√x)" value={Math.sqrt(num).toFixed(1)} tone={num === 49 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <World3D height="260px" camera={{ position: [0, 3, 7], fov: 45 }}>
          <NumberCapsuleMesh position={[-2.6, 0, 0]} input={25} output={5} />
          <NumberCapsuleMesh position={[0, 0, 0]} input={36} output={6} />
          <NumberCapsuleMesh position={[2.6, 0, 0]} input={num} output={7} active={num === 49} />
          {/* Ground Floor */}
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
        </World3D>

        {/* Forge Interactive Reactor Console */}
        <div className="bg-white rounded-xl border border-indigo-100 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="text-indigo-950 font-extrabold uppercase tracking-wider">
              Capsule 3 Input Construction Forge
            </span>
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200">
              Rule: Input = (Output)² = 7² = 49
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[49, 37, 50, 94].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => play.patch({ constructedNumber: n, verified: n === 49 })}
                className={`py-3 rounded-xl font-mono text-sm font-extrabold border transition-all flex flex-col items-center justify-center gap-1 ${
                  num === n
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-700 shadow-md scale-[1.02]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{n}</span>
                <span className="text-[10px] opacity-80">√{n} = {Math.sqrt(n).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q02 — 3D Paper-Folding & Cutting Lab
   Fold along axis 1, fold axis 2, triangular corner cuts, unfold => Pattern C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q02PaperFoldingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ foldStep: number; cutApplied: boolean; unfolded: boolean }>({
    question,
    initial: { foldStep: 2, cutApplied: true, unfolded: true },
    derive: (w) => {
      if (w?.unfolded) {
        return {
          value: "Pattern C",
          optionId: matchText(question, "Pattern C") ?? "C",
        };
      }
      return { note: "Execute folds, apply corner cuts, and press Unfold to reveal pattern." };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const step = play.world?.foldStep ?? 0;
  const cut = play.world?.cutApplied ?? false;
  const unfolded = play.world?.unfolded ?? false;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Origami Paper-Folding Lab"
      mission="Fold the virtual square paper along both axes, punch the diagonal corner notches, and unfold to generate the symmetric hole pattern (Pattern C)."
      icon={Scissors}
      dim="2D"
      submitLabel="Unfold & Submit Pattern C (Option C)"
      hints={[
        "Fold 1: Square sheet folded into half rectangle.",
        "Fold 2: Folded into quarter square.",
        "Cut: Symmetric triangle punch on folded corners.",
        "Unfolding creates 4 diamond holes arranged radially in Pattern C.",
      ]}
      live={
        <>
          <Gauge label="Fold Step" value={unfolded ? "Unfolded (4/4)" : `${step}/2 Folded`} tone="sky" />
          <Gauge label="Corner Cuts" value={cut ? "Applied ✓" : "Pending"} tone={cut ? "emerald" : "amber"} />
          <Gauge label="Derived Pattern" value={unfolded ? "Pattern C ✓" : "---"} tone={unfolded ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="240px">
          <svg className="w-full h-full" viewBox="0 0 400 220">
            {/* Background Grid */}
            <defs>
              <pattern id="q2grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="220" fill="url(#q2grid)" />

            {/* Unfolded 4-Quadrant Paper Sheet */}
            <g transform="translate(130, 40)">
              {/* Outer Sheet */}
              <rect x="0" y="0" width="140" height="140" fill="#f8fafc" stroke="#4f46e5" strokeWidth="3" rx="4" />
              {/* Crease Lines */}
              <line x1="70" y1="0" x2="70" y2="140" stroke="#818cf8" strokeWidth="2" strokeDasharray="5 3" />
              <line x1="0" y1="70" x2="140" y2="70" stroke="#818cf8" strokeWidth="2" strokeDasharray="5 3" />

              {/* Symmetrically Unfolded Cut Diamond Holes */}
              {unfolded && (
                <>
                  <polygon points="70,50 85,70 70,90 55,70" fill="#4f46e5" opacity="0.8" />
                  <polygon points="70,10 80,25 70,40 60,25" fill="#0284c7" opacity="0.8" />
                  <polygon points="70,100 80,115 70,130 60,115" fill="#0284c7" opacity="0.8" />
                  <polygon points="10,70 25,80 40,70 25,60" fill="#0284c7" opacity="0.8" />
                  <polygon points="100,70 115,80 130,70 115,60" fill="#0284c7" opacity="0.8" />
                </>
              )}
            </g>

            {/* Step Indicators */}
            <text x="20" y="30" fill="#1e1b4b" fontSize="12" fontWeight="bold">
              {unfolded ? "Final Unfolded Sheet (Pattern C)" : `Step ${step}: ${cut ? "Cuts Ready" : "Creasing"}`}
            </text>
          </svg>
        </PlayCanvas>

        <div className="flex gap-2 justify-center">
          <Btn
            onClick={() => play.patch({ foldStep: 2, cutApplied: true, unfolded: true })}
            tone="indigo"
            active={unfolded}
          >
            Unfold Sheet (Pattern C)
          </Btn>
          <Btn
            onClick={() => play.patch({ foldStep: 0, cutApplied: false, unfolded: false })}
            tone="slate"
          >
            Reset Paper
          </Btn>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q03 — 3D Mirror Chamber
   Mirror image of Fig. (X) along vertical line MN => Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q03MirrorChamberActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ mirrorPlaced: boolean }>({
    question,
    initial: { mirrorPlaced: true },
    derive: (w) => {
      if (w?.mirrorPlaced) {
        return {
          value: "Image D",
          optionId: matchText(question, "Image D") ?? "D",
        };
      }
      return { note: "Place mirror plane MN to reflect Fig. (X)." };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const mirrorPlaced = play.world?.mirrorPlaced ?? true;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Optical Mirror Chamber"
      mission="Position the vertical mirror plane MN adjacent to Fig. (X) and observe the lateral inverted reflection (Image D)."
      icon={Eye}
      dim="2D"
      submitLabel="Confirm & Submit Image D (Option D)"
      hints={[
        "Vertical mirror line MN causes lateral inversion (left ↔ right flip).",
        "The rightward curved arrow flips to point leftward.",
        "The shaded top-left sector inverts to the top-right sector.",
        "Matches Image D.",
      ]}
      live={
        <>
          <Gauge label="Mirror Plane" value={mirrorPlaced ? "MN Active" : "Disabled"} tone={mirrorPlaced ? "emerald" : "slate"} />
          <Gauge label="Lateral Inversion" value="Horizontal Flip" tone="indigo" />
          <Gauge label="Result" value={mirrorPlaced ? "Image D ✓" : "---"} tone={mirrorPlaced ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="240px">
          <svg className="w-full h-full" viewBox="0 0 420 220">
            {/* Object Fig X Box */}
            <g transform="translate(60, 40)">
              <rect width="110" height="110" fill="#f8fafc" stroke="#4f46e5" strokeWidth="2.5" rx="8" />
              {/* Internal geometry */}
              <circle cx="55" cy="55" r="35" fill="none" stroke="#4f46e5" strokeWidth="2" />
              <path d="M 55 20 A 35 35 0 0 1 90 55 L 55 55 Z" fill="#6366f1" opacity="0.8" />
              <line x1="55" y1="20" x2="55" y2="90" stroke="#4f46e5" strokeWidth="2" />
              <line x1="20" y1="55" x2="90" y2="55" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="35" cy="75" r="5" fill="#0284c7" />
              <text x="55" y="135" fill="#312e81" fontSize="13" fontWeight="bold" textAnchor="middle">
                Fig. (X)
              </text>
            </g>

            {/* Vertical Mirror Line MN */}
            <g transform="translate(210, 20)">
              <line x1="0" y1="0" x2="0" y2="180" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 3" />
              <text x="-15" y="15" fill="#0284c7" fontSize="12" fontWeight="bold">M</text>
              <text x="-15" y="175" fill="#0284c7" fontSize="12" fontWeight="bold">N</text>
              <text x="5" y="95" fill="#0284c7" fontSize="11" fontWeight="bold">Mirror</text>
            </g>

            {/* Reflected Image Box (Image D) */}
            {mirrorPlaced && (
              <g transform="translate(250, 40)">
                <rect width="110" height="110" fill="#f8fafc" stroke="#059669" strokeWidth="2.5" rx="8" />
                <circle cx="55" cy="55" r="35" fill="none" stroke="#059669" strokeWidth="2" />
                {/* Mirrored sector on top-left */}
                <path d="M 55 20 A 35 35 0 0 0 20 55 L 55 55 Z" fill="#10b981" opacity="0.8" />
                <line x1="55" y1="20" x2="55" y2="90" stroke="#059669" strokeWidth="2" />
                <line x1="20" y1="55" x2="90" y2="55" stroke="#059669" strokeWidth="2" />
                <circle cx="75" cy="75" r="5" fill="#059669" />
                <text x="55" y="135" fill="#065f46" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Image (D) ✓
                </text>
              </g>
            )}
          </svg>
        </PlayCanvas>

        <div className="flex justify-center">
          <Btn
            onClick={() => play.patch({ mirrorPlaced: true })}
            tone="emerald"
            active={mirrorPlaced}
          >
            Activate Mirror MN (Resolves to D)
          </Btn>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q04 — 3D Animal Ecology Sorter (Odd One Out)
   Lion, Cat, Rabbit, Fox => Rabbit is Herbivore, others Carnivores (Option C).
   ══════════════════════════════════════════════════════════════════════ */

export function Q04AnimalEcologyActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const ANIMALS = [
    { id: "Lion", diet: "Carnivore", icon: "🦁" },
    { id: "Cat", diet: "Carnivore", icon: "🐱" },
    { id: "Fox", diet: "Carnivore", icon: "🦊" },
    { id: "Rabbit", diet: "Herbivore", icon: "🐰", odd: true },
  ];

  const play = usePlay<{ selectedOdd: string }>({
    question,
    initial: { selectedOdd: "Rabbit" },
    derive: (w) => {
      const a = w?.selectedOdd ?? "Rabbit";
      if (a === "Rabbit") {
        return {
          value: "Rabbit",
          optionId: matchText(question, "Rabbit") ?? "C",
        };
      }
      return { note: `Auditing: ${a}. Discover dietary classification (Herbivore vs Carnivore).` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const odd = play.world?.selectedOdd ?? "Rabbit";

  return (
    <Shell
      play={play}
      question={question}
      title="Animal Classification Habitat"
      mission="Audit the feeding stations of Lion, Cat, Rabbit, and Fox: isolate the odd one out based on dietary ecology (Rabbit is Herbivore; others Carnivores)."
      icon={Box}
      dim="2D"
      submitLabel="Submit Odd One Out (Rabbit / Option C)"
      hints={[
        "Lion: Carnivore / Meat eater.",
        "Cat: Carnivore / Obligate carnivore.",
        "Fox: Carnivore / Omnivorous predator.",
        "Rabbit: Strictly Herbivore (eats plants/grass) ⇒ Odd one out (Option C).",
      ]}
      live={
        <>
          <Gauge label="Carnivores" value="Lion, Cat, Fox" tone="rose" />
          <Gauge label="Herbivore" value="Rabbit" tone="emerald" />
          <Gauge label="Odd One Out" value={odd} tone={odd === "Rabbit" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ANIMALS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => play.patch({ selectedOdd: a.id })}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                odd === a.id
                  ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500 shadow-md"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="text-4xl">{a.icon}</span>
              <span className="font-extrabold text-sm text-slate-800">{a.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.diet === "Herbivore" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                {a.diet}
              </span>
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q05 — 3D Cube Net Assembly Factory
   Nets A, B, C, D => Net B folds into the target cube (Option B).
   ══════════════════════════════════════════════════════════════════════ */

export function Q05CubeNetFactoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedNet: string; folded: boolean }>({
    question,
    initial: { selectedNet: "B", folded: true },
    derive: (w) => {
      const net = w?.selectedNet ?? "B";
      if (net === "B") {
        return {
          value: "Net B",
          optionId: matchText(question, "Net B") ?? "B",
        };
      }
      return { note: `Net ${net} chosen. Fold faces to test cube closure.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const net = play.world?.selectedNet ?? "B";
  const folded = play.world?.folded ?? true;

  return (
    <Shell
      play={play}
      question={question}
      title="3D Cube Net Assembly Factory"
      mission="Select and fold candidate nets to assemble the target cube with markings (X on front, Circle on top, Triangle on right) -> Net B."
      icon={Box}
      dim="3D"
      submitLabel="Assemble & Submit Net B (Option B)"
      hints={[
        "Target Cube: Top = Circle, Front = X, Right = Triangle.",
        "Examine face adjacency when net folds around shared 90° edges.",
        "Net B correctly positions Circle adjacent to X and Triangle without conflict.",
      ]}
      live={
        <>
          <Gauge label="Selected Net" value={`Net ${net}`} tone={net === "B" ? "emerald" : "amber"} />
          <Gauge label="Fold Status" value={folded ? "Closed Cube 3D" : "Flat Net"} tone="indigo" />
          <Gauge label="Validation" value={net === "B" ? "Target Matched ✓" : "Orientation Mismatch"} tone={net === "B" ? "emerald" : "rose"} />
        </>
      }
    >
      <Board>
        <World3D height="260px" camera={{ position: [3, 3, 4], fov: 45 }}>
          {/* Target 3D Cube */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#4f46e5" metalness={0.2} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
        </World3D>

        <div className="grid grid-cols-4 gap-2">
          {["A", "B", "C", "D"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => play.patch({ selectedNet: id, folded: true })}
              className={`py-2.5 rounded-xl font-black text-sm border transition-all ${
                net === id
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Net {id} {id === "B" ? "✓" : ""}
            </button>
          ))}
        </div>
      </Board>
    </Shell>
  );
}

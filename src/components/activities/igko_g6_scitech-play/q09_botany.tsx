"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import { type ThreeEvent } from "@react-three/fiber";
import { Leaf, Scissors, FileCheck2 } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Studio, useInvestigation } from "./kit";
import { SPECIES, SPECIES_INFO, botanyInitial, evaluateBotany, type BotanyWorld, type Species } from "./logic";

/**
 * Q9 · Botanical fruit detective.
 * Investigate: pick fruit in the greenhouse and cut it open on the bench to see how it is
 * built. Answer: file the plant the question describes. Nothing here says how any fruit
 * is eaten — that part is the student's own knowledge.
 */

const LOOK: Record<Species, { fruit: string; size: number; count: number; flower: string; bed: [number, number, number] }> = {
  cranberry: { fruit: "#B91C1C", size: 0.07, count: 14, flower: "#F9A8D4", bed: [-2.7, 0, 0] },
  elderberry: { fruit: "#3B0764", size: 0.04, count: 30, flower: "#FFFFFF", bed: [-0.9, 0, 0] },
  blueberry: { fruit: "#1E3A8A", size: 0.06, count: 16, flower: "#F8FAFC", bed: [0.9, 0, 0] },
  tomato: { fruit: "#DC2626", size: 0.16, count: 5, flower: "#FACC15", bed: [2.7, 0, 0] },
};

function Plant({ species, selected, disabled, onPick }: { species: Species; selected: boolean; disabled: boolean; onPick: () => void }) {
  const look = LOOK[species];
  const fruitSpots = useMemo(
    () =>
      Array.from({ length: look.count }, (_, i) => {
        const a = i * 2.39996;
        const h = 0.55 + ((i * 0.37) % 0.7);
        return [Math.cos(a) * 0.32, h, Math.sin(a) * 0.32] as [number, number, number];
      }),
    [look.count]
  );
  const leafSpots = useMemo(() => Array.from({ length: 9 }, (_, i) => [Math.cos(i * 1.7) * 0.3, 0.45 + i * 0.1, Math.sin(i * 1.7) * 0.3] as [number, number, number]), []);
  const pick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!disabled) onPick();
  };
  return (
    <group position={look.bed}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.24, 1.4]} />
        <meshStandardMaterial color="#78350F" roughness={1} />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshStandardMaterial color="#3F2A14" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.95, 8]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      {leafSpots.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.35, 0.6]} castShadow>
          <sphereGeometry args={[0.16, 12, 10]} />
          <meshStandardMaterial color={i % 2 ? "#15803D" : "#16A34A"} roughness={0.8} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos(i * 2.1) * 0.25, 1.15, Math.sin(i * 2.1) * 0.25]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={look.flower} emissive={look.flower} emissiveIntensity={0.15} />
        </mesh>
      ))}
      <group
        onClick={pick}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!disabled) cursor(true);
        }}
        onPointerOut={() => cursor(false)}
      >
        {fruitSpots.map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <sphereGeometry args={[look.size, 16, 16]} />
            <meshPhysicalMaterial color={look.fruit} roughness={0.28} clearcoat={0.8} clearcoatRoughness={0.2} />
          </mesh>
        ))}
      </group>
      <Label3D
        text={`${SPECIES_INFO[species].name} plant`}
        position={[0, 1.6, 0]}
        size={[1.3, 0.26]}
        billboard
        style={{ bg: selected ? "#0F766E" : "#FFFFFF", fg: selected ? "#FFFFFF" : "#14532D", border: "#86EFAC", scale: 0.5 }}
      />
    </group>
  );
}

/** Specimen on the cutting board: whole, or halved to show its inside. */
function Specimen({ species, cut }: { species: Species; cut: boolean }) {
  const look = LOOK[species];
  const r = Math.max(0.16, look.size * 2.4);
  const seeds = useMemo(() => {
    const n = species === "elderberry" ? 4 : species === "tomato" ? 26 : species === "cranberry" ? 8 : 18;
    return Array.from({ length: n }, (_, i) => {
      const a = i * 2.39996;
      const rr = (species === "tomato" ? 0.55 : 0.35) * r * Math.sqrt((i + 0.5) / n);
      return [Math.cos(a) * rr, Math.sin(a) * rr] as [number, number];
    });
  }, [species, r]);
  const flesh = species === "tomato" ? "#F87171" : species === "elderberry" ? "#581C87" : species === "blueberry" ? "#A5B4FC" : "#FECACA";
  return (
    <group position={[0, 0.62, 1.7]}>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.06, 0.9]} />
        <meshStandardMaterial color="#D6A26A" roughness={0.9} />
      </mesh>
      {!cut ? (
        <mesh position={[0, r, 0]} castShadow>
          <sphereGeometry args={[r, 32, 32]} />
          <meshPhysicalMaterial color={look.fruit} roughness={0.28} clearcoat={0.8} clearcoatRoughness={0.2} />
        </mesh>
      ) : (
        [-1, 1].map((side) => (
          <group key={side} position={[side * (r + 0.08), r * 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <circleGeometry args={[r, 40]} />
              <meshStandardMaterial color={flesh} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <ringGeometry args={[r * 0.92, r, 40]} />
              <meshBasicMaterial color={look.fruit} side={THREE.DoubleSide} />
            </mesh>
            {species === "tomato" &&
              [0, 1, 2].map((k) => (
                <mesh key={k} position={[Math.cos(k * 2.1) * r * 0.45, Math.sin(k * 2.1) * r * 0.45, 0.002]}>
                  <circleGeometry args={[r * 0.3, 24]} />
                  <meshBasicMaterial color="#FDE68A" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
              ))}
            {seeds.map(([x, y], i) => (
              <mesh key={i} position={[x, y, 0.004]}>
                <circleGeometry args={[species === "elderberry" ? r * 0.16 : r * 0.05, 10]} />
                <meshBasicMaterial color={species === "elderberry" ? "#78350F" : "#FEF9C3"} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        ))
      )}
    </group>
  );
}

export function IgkoQ09Botany(props: ActivityComponentProps) {
  const play = useInvestigation<BotanyWorld>(props, botanyInitial, evaluateBotany);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  // Which fruit is on the bench is only where the student is looking, not an experiment result.
  const [bench, setBench] = useState<Species | null>(world.filed ?? world.dissected[world.dissected.length - 1] ?? null);
  const cut = bench ? world.dissected.includes(bench) : false;
  const info = bench ? SPECIES_INFO[bench] : null;

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Botanical Fruit Detective"
      mission="Pick fruit from the greenhouse and cut it open on the bench to see how it is built. Then file the plant the question describes."
      icon={Leaf}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, 3.0, 5.6], fov: 46 }} background="#ECFDF5" readOnly={readOnly} badge="Greenhouse · tap a plant's fruit">
          <Studio shadowScale={14} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 20]} />
            <meshStandardMaterial color="#C9D8B6" roughness={0.95} />
          </mesh>
          {SPECIES.map((s) => (
            <Plant key={s} species={s} selected={bench === s} disabled={ro} onPick={() => setBench(s)} />
          ))}
          <mesh position={[0, 0.3, 1.7]}>
            <boxGeometry args={[2.2, 0.6, 1.1]} />
            <meshStandardMaterial color="#F5F5F4" />
          </mesh>
          {bench && <Specimen species={bench} cut={cut} />}
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Collect a fruit">
            <div className="flex flex-wrap gap-1.5">
              {SPECIES.map((s) => (
                <Chip key={s} active={bench === s} disabled={ro} onClick={() => setBench(s)}>
                  {SPECIES_INFO[s].name}
                </Chip>
              ))}
            </div>
          </Panel>

          {bench && info && (
            <Panel title={`On the bench · ${info.name}`}>
              <button
                type="button"
                disabled={ro || cut}
                onClick={() => play.patch({ dissected: [...world.dissected, bench] })}
                className="w-full h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Scissors className="w-4 h-4" /> {cut ? "Cut open" : "Cut it open"}
              </button>
              {cut ? (
                <dl className="mt-2 grid grid-cols-[76px_1fr] gap-x-2 gap-y-1 text-xs">
                  <dt className="font-bold text-slate-500">Fruit</dt>
                  <dd className="text-slate-800">{info.fruitType}</dd>
                  <dt className="font-bold text-slate-500">Inside</dt>
                  <dd className="text-slate-800">{info.inside}</dd>
                  <dt className="font-bold text-slate-500">Flower</dt>
                  <dd className="text-slate-800">{info.flower}</dd>
                </dl>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Cut the fruit open to examine its structure.</p>
              )}
            </Panel>
          )}
          <AnswerStation title="Specimen folder" hint="File the plant the question describes.">
            <div className="grid grid-cols-2 gap-1.5">
              {SPECIES.map((s) => (
                <Chip key={s} active={world.filed === s} disabled={ro} onClick={() => play.patch({ filed: world.filed === s ? null : s })} tone="violet">
                  <FileCheck2 className="inline w-3 h-3 mr-1" />
                  {SPECIES_INFO[s].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

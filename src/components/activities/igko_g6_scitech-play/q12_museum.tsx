"use client";

import React, { useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Landmark, Pin, Award } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Studio, useInvestigation } from "./kit";
import { Glass, Metal, Brushed, Plastic, Wood, Brass } from "./models";
import { EXHIBITS, MILESTONES, evaluateMuseum, milestone, museumInitial, type ExhibitId, type MuseumWorld } from "./logic";

/**
 * Q12 · Indian science heritage museum.
 * Investigate: walk the gallery, study each scientist's exhibit and pin dated milestones to
 * the wall timeline. Answer: place the "Father of India's nuclear programme" plaque on one
 * exhibit.
 */

const IDS: ExhibitId[] = ["bhabha", "bose", "kalam", "sarabhai"];
const EX_X: Record<ExhibitId, number> = { bhabha: -3.3, bose: -1.1, kalam: 1.1, sarabhai: 3.3 };

/** Each exhibit's signature object, inside its glass case. */
function Artifact({ id }: { id: ExhibitId }) {
  switch (id) {
    case "bhabha":
      return (
        <group>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.24, 32]} />
            <Plastic color="#E5E7EB" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Plastic color="#F1F5F9" />
          </mesh>
          <mesh position={[0.25, 0.18, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.36, 16]} />
            <Brushed />
          </mesh>
        </group>
      );
    case "bose":
      return (
        <group rotation={[0, 0.6, 0]}>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.36, 0.08, 0.2]} />
            <Wood color="#6B4428" />
          </mesh>
          <mesh position={[0.05, 0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.09, 0.22, 4, 1, true]} />
            <Metal color="#B87333" roughness={0.35} />
          </mesh>
        </group>
      );
    case "kalam":
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 24]} />
            <Plastic color="#F8FAFC" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <coneGeometry args={[0.05, 0.12, 24]} />
            <Plastic color="#EF4444" />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 0.06, 0.08, Math.sin((i * Math.PI) / 2) * 0.06]} rotation={[0, (-i * Math.PI) / 2, 0]}>
              <boxGeometry args={[0.06, 0.1, 0.008]} />
              <Plastic color="#1E3A8A" />
            </mesh>
          ))}
        </group>
      );
    default:
      return (
        <group position={[0, 0.2, 0]}>
          <mesh>
            <octahedronGeometry args={[0.1]} />
            <meshStandardMaterial color="#D4A73C" metalness={1} roughness={0.35} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.2, 0, 0]}>
              <boxGeometry args={[0.2, 0.008, 0.1]} />
              <meshStandardMaterial color="#14285A" metalness={0.6} roughness={0.25} />
            </mesh>
          ))}
        </group>
      );
  }
}

function Exhibit({ id, plaque, disabled, onPick }: { id: ExhibitId; plaque: boolean; disabled: boolean; onPick: () => void }) {
  return (
    <group position={[EX_X[id], 0, -0.6]}>
      {/* Plinth with bust */}
      <group
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (!disabled) onPick();
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (!disabled) cursor(true);
        }}
        onPointerOut={() => cursor(false)}
      >
        <RoundedBox args={[0.7, 1.1, 0.7]} radius={0.03} position={[0, 0.55, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#EDEAE4" roughness={0.3} clearcoat={0.6} />
        </RoundedBox>
        <mesh position={[0, 1.3, 0]} castShadow>
          <sphereGeometry args={[0.16, 40, 40]} />
          <Metal color="#8C6A3F" roughness={0.42} />
        </mesh>
        <mesh position={[0, 1.13, 0]} castShadow scale={[1, 0.6, 0.7]}>
          <sphereGeometry args={[0.24, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Metal color="#7D5D35" roughness={0.45} />
        </mesh>
      </group>
      <Label3D text={EXHIBITS[id].name} position={[0, 0.8, 0.36]} size={[0.66, 0.12]} style={{ bg: "#1F2937", fg: "#F8FAFC", scale: 0.42 }} />
      <Label3D text={EXHIBITS[id].theme} position={[0, 0.62, 0.36]} size={[0.66, 0.09]} style={{ bg: null, fg: "#475569", scale: 0.42 }} />
      {/* Display case with signature object */}
      <group position={[0, 0, 0.95]}>
        <RoundedBox args={[0.7, 0.7, 0.5]} radius={0.02} position={[0, 0.35, 0]} castShadow receiveShadow>
          <Wood color="#3F2A1D" />
        </RoundedBox>
        <mesh position={[0, 0.98, 0]}>
          <boxGeometry args={[0.66, 0.56, 0.46]} />
          <Glass opacity={0.1} />
        </mesh>
        <group position={[0, 0.7, 0]}>
          <Artifact id={id} />
        </group>
      </group>
      {plaque && (
        <group position={[0, 1.65, 0.05]}>
          <RoundedBox args={[0.9, 0.22, 0.04]} radius={0.01} castShadow>
            <Brass />
          </RoundedBox>
          <Label3D text="Father of India's nuclear programme" position={[0, 0, 0.025]} size={[0.86, 0.13]} style={{ bg: null, fg: "#3B2A06", scale: 0.5 }} />
        </group>
      )}
    </group>
  );
}

function Timeline({ pinned }: { pinned: string[] }) {
  const items = pinned.map(milestone).filter((m): m is NonNullable<typeof m> => Boolean(m)).sort((a, b) => a.year - b.year);
  return (
    <group position={[0, 2.35, -1.6]}>
      <mesh position={[0, -0.6, -0.08]} receiveShadow>
        <boxGeometry args={[11, 4.2, 0.06]} />
        <meshStandardMaterial color="#6E2F2F" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0, -0.04]} receiveShadow>
        <boxGeometry args={[9, 1.4, 0.06]} />
        <meshStandardMaterial color="#F6F0E2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[9.15, 1.55, 0.04]} />
        <Wood color="#5A3A22" />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[8.4, 0.025, 0.02]} />
        <Metal color="#334155" />
      </mesh>
      <Label3D text="Timeline wall" position={[0, 0.55, 0]} size={[1.6, 0.18]} style={{ bg: null, fg: "#334155", scale: 0.55 }} />
      {items.map((m, i) => {
        const x = items.length === 1 ? 0 : -3.9 + (i * 7.8) / Math.max(1, items.length - 1);
        return (
          <group key={m.id} position={[x, 0.1, 0.01]}>
            <Label3D text={`${m.year}`} position={[0, 0.24, 0]} size={[0.5, 0.15]} style={{ bg: "#0F172A", fg: "#FDE68A", scale: 0.6 }} />
            <Label3D text={m.event} position={[0, 0, 0]} size={[1.0, 0.3]} style={{ bg: "#FFFFFF", fg: "#0F172A", border: "#CBD5E1", scale: 0.16 }} />
            <mesh position={[0, -0.34, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <Metal color="#B91C1C" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function IgkoQ12Museum(props: ActivityComponentProps) {
  const play = useInvestigation<MuseumWorld>(props, museumInitial, evaluateMuseum);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [open, setOpen] = useState<ExhibitId>("bhabha");
  const pinToggle = (id: string) => play.patch({ timeline: world.timeline.includes(id) ? world.timeline.filter((x) => x !== id) : [...world.timeline, id] });

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Indian Science Heritage Museum"
      mission="Study the four exhibits and build a timeline from their milestones. Then place the plaque on the scientist known as the father of India's nuclear programme."
      icon={Landmark}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_330px]">
        <Lab3D camera={{ position: [0, 2.0, 5.4], fov: 48 }} readOnly={readOnly} badge="Gallery · tap a plinth to open its exhibit" orbit={{ target: [0, 1.2, -0.4], minDistance: 3, maxDistance: 10 }}>
          <Studio shadowScale={16} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 20]} />
            <meshPhysicalMaterial color="#C9BFAE" roughness={0.25} clearcoat={0.6} />
          </mesh>
          {IDS.map((id) => (
            <Exhibit key={id} id={id} plaque={world.plaque === id} disabled={ro} onPick={() => setOpen(id)} />
          ))}
          <Timeline pinned={world.timeline} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Exhibit">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {IDS.map((id) => (
                <Chip key={id} active={open === id} onClick={() => setOpen(id)}>
                  {EXHIBITS[id].name.split(" ").slice(-1)[0]}
                </Chip>
              ))}
            </div>
            <p className="text-xs font-black text-slate-900">{EXHIBITS[open].name}</p>
            <p className="text-[11px] text-slate-500 mb-1.5">{EXHIBITS[open].theme}</p>
            <ul className="space-y-1.5">
              {MILESTONES.filter((m) => m.exhibit === open).map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 p-2">
                  <span className="text-xs text-slate-700">
                    <strong className="font-mono text-slate-900">{m.year}</strong> · {m.event}
                  </span>
                  <Chip active={world.timeline.includes(m.id)} disabled={ro} onClick={() => pinToggle(m.id)}>
                    <Pin className="inline w-3 h-3" />
                  </Chip>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[10.5px] text-slate-500">Pinned items line up by year on the timeline wall.</p>
          </Panel>
          <AnswerStation title="Plaque" hint="Place the plaque on the scientist known as the father of India's nuclear programme.">
            <div className="grid grid-cols-1 gap-1.5">
              {IDS.map((id) => (
                <Chip key={id} active={world.plaque === id} disabled={ro} onClick={() => play.patch({ plaque: world.plaque === id ? null : id })} tone="violet">
                  <Award className="inline w-3 h-3 mr-1" />
                  {EXHIBITS[id].name}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

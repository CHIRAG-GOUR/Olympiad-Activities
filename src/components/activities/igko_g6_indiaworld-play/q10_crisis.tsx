"use client";

import React from "react";
import { RoundedBox } from "@react-three/drei";
import { Briefcase, FileText } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor, Matte, Metal, Plastic, Wood, Glow } from "../igko_g6_scitech-play/models";
import { Folder, IW_BADGE } from "./iwkit";
import { DESKS, DOSSIERS, crisisInitial, evaluateCrisis, type CrisisWorld, type Desk, type Dossier } from "./logic";

/**
 * Q10 · International crisis room.
 * Four organisations' desks surround the operations table; four crisis dossiers wait in the
 * middle. Route each dossier to the desk that should handle it. The desk the currency-
 * collapse dossier is delivered to is the student's answer. Desks show only their names.
 */

const DESK_IDS = Object.keys(DESKS) as Desk[];
const DOSSIER_IDS = Object.keys(DOSSIERS) as Dossier[];
const DESK_COLOR: Record<Desk, string> = { who: "#0E7490", imf: "#1E3A8A", unicef: "#0284C7", wto: "#166534" };
const ACRONYM: Record<Desk, string> = { who: "WHO", imf: "IMF", unicef: "UNICEF", wto: "WTO" };
const DOSSIER_COLOR: Record<Dossier, string> = { currency: "#FCD34D", outbreak: "#FCA5A5", children: "#A7F3D0", tariffs: "#C4B5FD" };
const deskAngle = (i: number) => (-0.62 + (i / 3) * 1.24) * 1;
const deskPos = (i: number): [number, number, number] => [Math.sin(deskAngle(i)) * 2.1, 0, -Math.cos(deskAngle(i)) * 2.1 + 0.5];

function DeskStation({ id, i, dossiers }: { id: Desk; i: number; dossiers: Dossier[] }) {
  const [x, , z] = deskPos(i);
  const c = DESK_COLOR[id];
  return (
    <group position={[x, 0, z]} rotation={[0, -deskAngle(i), 0]}>
      <RoundedBox args={[1.05, 0.06, 0.6]} radius={0.02} smoothness={3} position={[0, 0.74, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#F1F5F9" roughness={0.35} clearcoat={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.37, -0.22]} castShadow>
        <boxGeometry args={[1.0, 0.72, 0.04]} />
        <Plastic color={c} roughness={0.5} />
      </mesh>
      {[-0.46, 0.46].map((sx) => (
        <mesh key={sx} position={[sx, 0.37, 0.1]}>
          <boxGeometry args={[0.04, 0.72, 0.4]} />
          <Metal color="#94A3B8" />
        </mesh>
      ))}
      {/* Monitor */}
      <group position={[0, 0.98, -0.16]}>
        <RoundedBox args={[0.5, 0.3, 0.025]} radius={0.01} smoothness={2} castShadow>
          <Plastic color="#111827" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.46, 0.26]} />
          <Glow color={c} intensity={0.55} />
        </mesh>
        <Label3D text={ACRONYM[id]} position={[0, 0, 0.016]} size={[0.42, 0.14]} style={{ bg: null, fg: "#FFFFFF", scale: 0.62 }} />
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.04, 0.12, 0.03]} />
          <Metal />
        </mesh>
      </group>
      {/* Name plate and pennant */}
      <group position={[0, 0.8, 0.22]}>
        <mesh rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.46, 0.09, 0.012]} />
          <Wood color="#3F2A1A" />
        </mesh>
        <Label3D text={DESKS[id].name} position={[0, 0.002, 0.008]} rotation={[-0.4, 0, 0]} size={[0.44, 0.08]} style={{ bg: null, fg: "#F8FAFC", scale: 0.5 }} />
      </group>
      {/* Chair */}
      <group position={[0, 0, 0.6]}>
        <RoundedBox args={[0.4, 0.07, 0.38]} radius={0.03} smoothness={3} position={[0, 0.46, 0]} castShadow>
          <Plastic color="#334155" roughness={0.6} clearcoat={0.2} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.45, 0.06]} radius={0.03} smoothness={3} position={[0, 0.72, 0.18]} castShadow>
          <Plastic color="#334155" roughness={0.6} clearcoat={0.2} />
        </RoundedBox>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.44, 12]} />
          <Metal />
        </mesh>
      </group>
      {/* Delivered dossiers */}
      {dossiers.map((d, k) => (
        <group key={d} position={[0.22 - k * 0.12, 0.78 + k * 0.03, 0.08]} rotation={[0, 0.15 * (k % 2 ? -1 : 1), 0]} scale={0.6}>
          <Folder label={DOSSIERS[d].title} color={DOSSIER_COLOR[d]} />
        </group>
      ))}
    </group>
  );
}

function Room({ world }: { world: CrisisWorld }) {
  const waiting = DOSSIER_IDS.filter((d) => !world.routed[d]);
  return (
    <>
      <Studio shadowScale={12} shadowOpacity={0.35} />
      <Floor color="#E6E9EE" />
      <mesh position={[0, 1.6, -2.1]} receiveShadow>
        <planeGeometry args={[8, 3.2]} />
        <Matte color="#F3F4F6" />
      </mesh>
      {/* Wall screen */}
      <group position={[0, 2.05, -2.08]}>
        <RoundedBox args={[2.6, 0.9, 0.05]} radius={0.02} smoothness={2}>
          <Plastic color="#0F172A" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[2.5, 0.8]} />
          <meshStandardMaterial color="#1E293B" emissive="#0EA5E9" emissiveIntensity={0.12} />
        </mesh>
        <Label3D text="CRISIS ROOM · ROUTE EVERY DOSSIER" position={[0, 0, 0.032]} size={[2.3, 0.2]} style={{ bg: null, fg: "#E0F2FE", scale: 0.5 }} />
      </group>
      {DESK_IDS.map((id, i) => (
        <DeskStation key={id} id={id} i={i} dossiers={DOSSIER_IDS.filter((d) => world.routed[d] === id)} />
      ))}
      {/* Operations table with the dossiers still waiting */}
      <group position={[0, 0, 1.25]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.75, 0.06, 64]} />
          <Wood color="#5B3A22" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.12, 0.25, 0.7, 24]} />
          <Metal color="#64748B" />
        </mesh>
        {waiting.map((d, k) => (
          <group key={d} position={[Math.cos((k / Math.max(1, waiting.length)) * Math.PI * 2) * 0.32, 0.765 + k * 0.004, Math.sin((k / Math.max(1, waiting.length)) * Math.PI * 2) * 0.32]} rotation={[0, k * 0.8, 0]} scale={0.7}>
            <Folder label={DOSSIERS[d].title} color={DOSSIER_COLOR[d]} />
          </group>
        ))}
      </group>
    </>
  );
}

export function IgkoQ10Crisis(props: ActivityComponentProps) {
  const play = useInvestigation<CrisisWorld>(props, crisisInitial, evaluateCrisis);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const route = (d: Dossier, desk: Desk) => {
    const routed = { ...world.routed };
    if (routed[d] === desk) delete routed[d];
    else routed[d] = desk;
    play.patch({ routed });
  };
  const others = DOSSIER_IDS.filter((d) => d !== "currency");

  const DeskPicker = ({ d, tone }: { d: Dossier; tone?: "violet" }) => (
    <div className="grid grid-cols-4 gap-1">
      {DESK_IDS.map((k) => (
        <Chip key={k} tone={tone} active={world.routed[d] === k} disabled={ro} onClick={() => route(d, k)}>
          {ACRONYM[k]}
        </Chip>
      ))}
    </div>
  );

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="International Crisis Room"
      mission="Read each crisis dossier and deliver it to the organisation that should handle it. The desk you send the currency-collapse dossier to is your answer."
      icon={Briefcase}
      live={
        <>
          <Reading label="Dossiers delivered" value={`${Object.keys(world.routed).length} / ${DOSSIER_IDS.length}`} tone="teal" />
          <Reading label="Currency dossier" value={world.routed.currency ? DESKS[world.routed.currency].name : "on the table"} tone="amber" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, 2.6, 4.4], fov: 44 }} readOnly={readOnly} orbit={{ target: [0, 0.8, 0], minDistance: 2.2, maxDistance: 8, maxPolarAngle: 1.4 }}>
          <Room world={world} />
        </Lab3D>

        <div className="space-y-3">
          <AnswerStation title={`Dossier · ${DOSSIERS.currency.title}`} hint={DOSSIERS.currency.detail}>
            <DeskPicker d="currency" tone="violet" />
          </AnswerStation>
          <Panel title="Other dossiers">
            <ul className="space-y-2">
              {others.map((d) => (
                <li key={d}>
                  <p className="flex items-start gap-1.5 text-[11.5px] text-slate-700 mb-1">
                    <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: DOSSIER_COLOR[d] === "#FCA5A5" ? "#DC2626" : DOSSIER_COLOR[d] === "#A7F3D0" ? "#059669" : "#7C3AED" }} />
                    <span>
                      <b>{DOSSIERS[d].title}.</b> {DOSSIERS[d].detail}
                    </span>
                  </p>
                  <DeskPicker d={d} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Investigation>
  );
}

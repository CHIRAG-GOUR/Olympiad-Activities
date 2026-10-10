"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Pickaxe, Search } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor, Matte, Wood, Plastic } from "../igko_g6_scitech-play/models";
import { FlatMap, llToMap, type MapFrame } from "./geo";
import { BriefingTable, IW_BADGE } from "./iwkit";
import { MESO_ARTIFACTS, RIVER_VALLEYS, mesoInitial, evaluateMeso, type MesoWorld, type Valley } from "./logic";

/**
 * Q3 · Mesopotamia expedition.
 * Investigate: examine the expedition's finds (none says where it was dug up) and study the
 * great river pairs on the map. Answer: found the city — a ziggurat rises in the river valley
 * the student chooses.
 */

const TABLE_Y = 0.78;
const FRAME: MapFrame = { lon: [5, 128], lat: [-8, 48], width: 3.5, y: TABLE_Y + 0.045 };
const SITES: Record<Valley, [number, number]> = {
  nileCongo: [27, 4],
  indusGanges: [77, 27],
  tigrisEuphrates: [44.5, 33],
  yangtzeYellow: [112, 33],
};
const VALLEYS = Object.keys(RIVER_VALLEYS) as Valley[];

function Ziggurat({ grow }: { grow: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const s = THREE.MathUtils.lerp(g.current.scale.y, grow ? 1 : 0.001, 0.08);
    g.current.scale.set(1, s, 1);
    g.current.visible = s > 0.01;
  });
  const tiers = [0.22, 0.16, 0.1];
  return (
    <group ref={g} scale={[1, 0.001, 1]}>
      {tiers.map((w, i) => (
        <RoundedBox key={i} args={[w, 0.05, w]} radius={0.004} smoothness={2} position={[0, 0.025 + i * 0.05, 0]} castShadow receiveShadow>
          <Matte color={["#C89B62", "#D2A86F", "#DCB57E"][i]} roughness={0.95} />
        </RoundedBox>
      ))}
      <mesh position={[0, 0.07, 0.11]} rotation={[0.75, 0, 0]}>
        <boxGeometry args={[0.04, 0.1, 0.01]} />
        <Matte color="#B98A52" />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <boxGeometry args={[0.05, 0.04, 0.05]} />
        <Matte color="#E8C690" />
      </mesh>
    </group>
  );
}

function SiteMarker({ at, label, chosen, onClick }: { at: [number, number]; label: string; chosen: boolean; onClick?: () => void }) {
  const [x, y, z] = llToMap(at, FRAME);
  return (
    <group
      position={[x, y, z]}
      onClick={(e) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <cylinderGeometry args={[0.13, 0.14, 0.012, 32]} />
        <meshPhysicalMaterial color={chosen ? "#FDE68A" : "#F5F0E6"} roughness={0.6} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.125, 0.14, 40]} />
        <meshBasicMaterial color={chosen ? "#B45309" : "#64748B"} />
      </mesh>
      <Ziggurat grow={chosen} />
      <Label3D text={label} position={[0, 0.36, 0]} size={[0.56, 0.11]} billboard style={{ bg: "#FFFFFF", fg: "#1E3A8A", border: "#93C5FD", scale: 0.42 }} />
    </group>
  );
}

function Finds({ examined, ro, onExamine }: { examined: number[]; ro: boolean; onExamine: (i: number) => void }) {
  const lift = (i: number) => (examined.includes(i) ? 0.03 : 0);
  const click = (i: number) => (e: { stopPropagation: () => void }) => {
    if (ro) return;
    e.stopPropagation();
    onExamine(i);
  };
  const y = TABLE_Y + 0.05;
  return (
    <group position={[0, 0, 1.12]}>
      {/* Clay tablet with cuneiform wedges */}
      <group position={[-1.2, y + lift(0), 0]} onClick={click(0)}>
        <RoundedBox args={[0.28, 0.04, 0.2]} radius={0.015} smoothness={3} castShadow>
          <Matte color="#B68A5C" roughness={0.95} />
        </RoundedBox>
        {Array.from({ length: 12 }, (_, k) => (
          <mesh key={k} position={[-0.1 + (k % 6) * 0.04, 0.022, -0.05 + Math.floor(k / 6) * 0.08]} rotation={[-Math.PI / 2, 0, (k * 0.9) % 3]}>
            <coneGeometry args={[0.01, 0.03, 3]} />
            <Matte color="#8E643A" />
          </mesh>
        ))}
      </group>
      {/* Stepped temple model */}
      <group position={[-0.4, y + lift(1), 0]} onClick={click(1)}>
        <Ziggurat grow />
      </group>
      {/* Potter's wheel */}
      <group position={[0.4, y + lift(2), 0]} onClick={click(2)}>
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.03, 40]} />
          <Wood color="#8B5E34" />
        </mesh>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.07, 24]} />
          <Matte color="#C0835A" />
        </mesh>
      </group>
      {/* Irrigation canal map on clay */}
      <group position={[1.2, y + lift(3), 0]} onClick={click(3)}>
        <RoundedBox args={[0.3, 0.03, 0.22]} radius={0.01} smoothness={2} castShadow>
          <Matte color="#C9A06C" roughness={0.95} />
        </RoundedBox>
        {[-0.07, 0.07].map((zz) => (
          <mesh key={zz} position={[0, 0.017, zz]}>
            <boxGeometry args={[0.26, 0.004, 0.018]} />
            <Plastic color="#2F7FD0" />
          </mesh>
        ))}
        {[-0.08, 0, 0.08].map((xx) => (
          <mesh key={xx} position={[xx, 0.017, 0]}>
            <boxGeometry args={[0.01, 0.004, 0.13]} />
            <Plastic color="#5BA3E0" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function IgkoQ03Meso(props: ActivityComponentProps) {
  const play = useInvestigation<MesoWorld>(props, mesoInitial, evaluateMeso);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const examine = (i: number) => play.patch({ examined: world.examined.includes(i) ? world.examined : [...world.examined, i] });
  const found = (v: Valley) => play.patch({ city: world.city === v ? null : v });
  const last = world.examined[world.examined.length - 1];

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Mesopotamia Expedition"
      mission="Examine the expedition's finds and study the river valleys on the map. Then found the city: raise its ziggurat between the two rivers where you think Mesopotamia grew."
      icon={Pickaxe}
      live={
        <>
          <Reading label="Finds examined" value={`${world.examined.length} / ${MESO_ARTIFACTS.length}`} tone="teal" />
          <Reading label="City founded" value={world.city ? `Between the ${RIVER_VALLEYS[world.city].label}` : "not yet"} tone="amber" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0, 3.4, 3.4], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, TABLE_Y, 0.15], minDistance: 2, maxDistance: 7, maxPolarAngle: 1.35 }}>
          <Studio shadowScale={10} shadowOpacity={0.35} />
          <Floor color="#EDE5D6" />
          <BriefingTable size={[3.9, 3]} height={TABLE_Y} inlay="#5B4630" />
          <group position={[0, 0, -0.4]}>
            <FlatMap frame={FRAME} rivers land="#E3D3A4" />
            {VALLEYS.map((v) => (
              <SiteMarker key={v} at={SITES[v]} label={RIVER_VALLEYS[v].label} chosen={world.city === v} onClick={ro ? undefined : () => found(v)} />
            ))}
          </group>
          <Finds examined={world.examined} ro={ro} onExamine={examine} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Expedition finds · tap to examine">
            <div className="grid grid-cols-2 gap-1.5">
              {MESO_ARTIFACTS.map((a, i) => (
                <Chip key={a.name} active={world.examined.includes(i)} disabled={ro} onClick={() => examine(i)}>
                  <span className="inline-flex items-center gap-1">
                    <Search className="w-3 h-3" /> {a.name}
                  </span>
                </Chip>
              ))}
            </div>
            {last !== undefined && (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50/70 p-2 text-[11.5px] text-slate-800">
                <b>{MESO_ARTIFACTS[last].name}:</b> {MESO_ARTIFACTS[last].note}
              </p>
            )}
            <p className="mt-2 text-[10.5px] text-slate-500">The name “Mesopotamia” comes from Greek and means “the land between the rivers”.</p>
          </Panel>
          <AnswerStation title="Found the city" hint="Raise the ziggurat in one river valley — tap its marker on the map or choose it here.">
            <div className="grid grid-cols-2 gap-1.5">
              {VALLEYS.map((v) => (
                <Chip key={v} tone="violet" active={world.city === v} disabled={ro} onClick={() => found(v)}>
                  🏛 {RIVER_VALLEYS[v].label}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

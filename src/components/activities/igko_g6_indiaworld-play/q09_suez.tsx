"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Construction, Flag as FlagIcon, Shovel } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor, Matte, Plastic, Metal } from "../igko_g6_scitech-play/models";
import { Plaque, IW_BADGE } from "./iwkit";
import { AROUND_AFRICA_NM, CANAL_PLAQUES, CANAL_SECTIONS, VIA_SUEZ_NM, canalOpen, suezInitial, evaluateSuez, type CanalPlaque, type SuezWorld } from "./logic";

/**
 * Q9 · Suez Canal engineering.
 * Investigate: a diorama of the isthmus between the Mediterranean Sea and the Red Sea. Dig
 * the canal section by section, then race two freighters from Europe to Asia — one through
 * the canal (once it is open), one around Africa. Answer: fix the plaque that states why
 * the canal was built to the monument at its entrance.
 */

const BASE_Y = 0.3;
const SECTION_LEN = 1.8 / CANAL_SECTIONS;
const secZ = (i: number) => -0.9 + SECTION_LEN * (i + 0.5);
const PLAQUE_IDS = Object.keys(CANAL_PLAQUES) as CanalPlaque[];

function Sea({ z, depth, label }: { z: number; depth: number; label: string }) {
  return (
    <group position={[0, BASE_Y, z]}>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.02, depth]} />
        <meshPhysicalMaterial color="#2B83C6" roughness={0.08} clearcoat={1} transmission={0.1} />
      </mesh>
      <Label3D text={label} position={[0.8, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[1.1, 0.16]} style={{ bg: null, fg: "#E0F2FE", scale: 0.6 }} />
    </group>
  );
}

function Section({ i, dug, onClick }: { i: number; dug: boolean; onClick?: () => void }) {
  const sand = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!sand.current) return;
    const target = dug ? 0.001 : 1;
    sand.current.scale.y = THREE.MathUtils.lerp(sand.current.scale.y, target, 0.1);
    sand.current.visible = sand.current.scale.y > 0.02;
  });
  return (
    <group
      position={[0, BASE_Y, secZ(i)]}
      onClick={(e) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Channel bed and water */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.32, 0.02, SECTION_LEN + 0.002]} />
        <Matte color="#A07A4A" />
      </mesh>
      <mesh position={[0, -0.042, 0]} visible={dug}>
        <boxGeometry args={[0.3, 0.012, SECTION_LEN + 0.002]} />
        <meshPhysicalMaterial color="#2F8FD6" roughness={0.06} clearcoat={1} />
      </mesh>
      {/* Undug sand */}
      <mesh ref={sand} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.32, 0.1, SECTION_LEN - 0.01]} />
        <Matte color="#E3C48B" roughness={1} />
      </mesh>
      <Label3D text={`Section ${i + 1}`} position={[-0.45, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[0.4, 0.08]} style={{ bg: "#FFFFFFD0", fg: "#78350F", scale: 0.5 }} />
    </group>
  );
}

function CanalShip({ go, open }: { go: boolean; open: boolean }) {
  const g = useRef<THREE.Group>(null);
  const t = useRef(0);
  useEffect(() => {
    t.current = 0;
  }, [go]);
  useFrame((_, dt) => {
    if (!g.current) return;
    if (go && open) t.current = Math.min(1, t.current + dt / 4);
    g.current.position.z = -1.3 + t.current * 2.6;
    g.current.visible = open;
  });
  return (
    <group ref={g} position={[0, BASE_Y - 0.02, -1.3]}>
      <RoundedBox args={[0.11, 0.05, 0.36]} radius={0.02} smoothness={2} castShadow>
        <Plastic color="#1F2937" />
      </RoundedBox>
      {[-0.08, 0, 0.08].map((z, k) => (
        <mesh key={z} position={[0, 0.045, z]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.07]} />
          <Plastic color={["#DC2626", "#2563EB", "#F59E0B"][k]} />
        </mesh>
      ))}
      <mesh position={[0, 0.07, 0.14]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.05]} />
        <Matte color="#F8FAFC" />
      </mesh>
    </group>
  );
}

function Diorama({ world, ro, racing, onDig, onFix }: { world: SuezWorld; ro: boolean; racing: boolean; onDig: (i: number) => void; onFix: (p: CanalPlaque) => void }) {
  const open = canalOpen(world);
  return (
    <group>
      {/* Desert block */}
      <RoundedBox args={[3.2, BASE_Y, 3.2]} radius={0.03} smoothness={3} position={[0, BASE_Y / 2 - 0.06, 0]} castShadow receiveShadow>
        <Matte color="#D9B97C" roughness={1} />
      </RoundedBox>
      {/* Dunes */}
      {[[-1, 0.2], [-0.7, -0.5], [1.0, 0.4], [0.8, -0.3], [-1.2, 0.6], [1.2, -0.6]].map(([x, z], k) => (
        <mesh key={k} position={[x, BASE_Y - 0.06, z]} scale={[1, 0.25, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Matte color="#E6C98F" roughness={1} />
        </mesh>
      ))}
      <Sea z={-1.25} depth={0.7} label="Mediterranean Sea" />
      <Sea z={1.25} depth={0.7} label="Red Sea" />
      {Array.from({ length: CANAL_SECTIONS }, (_, i) => (
        <Section key={i} i={i} dug={world.dug.includes(i)} onClick={ro ? undefined : () => onDig(i)} />
      ))}
      <Label3D text="AFRICA" position={[-1.05, BASE_Y + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[0.6, 0.14]} style={{ bg: null, fg: "#92400E", scale: 0.6 }} />
      <Label3D text="ASIA (Sinai)" position={[1.05, BASE_Y + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[0.7, 0.14]} style={{ bg: null, fg: "#92400E", scale: 0.55 }} />
      <CanalShip go={racing} open={open} />
      {/* Entrance monument */}
      <group position={[0.55, BASE_Y - 0.06, -0.78]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.22, 0.12, 0.22]} />
          <Matte color="#E7E5E4" />
        </mesh>
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.07, 0.6, 4]} />
          <Matte color="#F5F5F4" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.74, 0]} castShadow>
          <coneGeometry args={[0.035, 0.06, 4]} />
          <Metal color="#E9B949" roughness={0.2} />
        </mesh>
        {world.plaque && (
          <group position={[0, 0.07, 0.115]} scale={0.18}>
            <Plaque text={CANAL_PLAQUES[world.plaque].label} width={1.6} />
          </group>
        )}
      </group>
      {/* Plaques waiting on a stand */}
      {PLAQUE_IDS.map((p, i) =>
        world.plaque === p ? null : (
          <group key={p} position={[-1.95 + (i % 2) * 3.9, 0.3 + Math.floor(i / 2) * 0.32, 0.2]} rotation={[0, (i % 2 ? -1 : 1) * 0.6, 0]} scale={0.34}>
            <Plaque text={CANAL_PLAQUES[p].label} width={1.6} onClick={ro ? undefined : () => onFix(p)} />
          </group>
        )
      )}
    </group>
  );
}

export function IgkoQ09Suez(props: ActivityComponentProps) {
  const play = useInvestigation<SuezWorld>(props, suezInitial, evaluateSuez);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const open = canalOpen(world);
  const [racing, setRacing] = useState(false);
  const [progress, setProgress] = useState(world.raced ? 1 : 0);
  const raf = useRef<number>(undefined);
  const viaCanal = open ? VIA_SUEZ_NM : AROUND_AFRICA_NM;

  useEffect(() => () => cancelAnimationFrame(raf.current!), []);
  const race = () => {
    setRacing(true);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 5000);
      setProgress(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setRacing(false);
        play.patch({ raced: true });
      }
    };
    setProgress(0);
    raf.current = requestAnimationFrame(tick);
  };
  const dig = (i: number) => play.patch({ dug: world.dug.includes(i) ? world.dug.filter((d) => d !== i) : [...world.dug, i].sort() });
  const fix = (p: CanalPlaque) => play.patch({ plaque: world.plaque === p ? null : p });
  // Both ships sail at the same speed; the race clock is set by the longer voyage.
  const shipA = Math.min(1, (progress * AROUND_AFRICA_NM) / viaCanal);
  const shipB = progress;

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Suez Canal Engineering"
      mission="Dig the canal across the isthmus section by section, then race two freighters from Europe to Asia. Then fix the plaque that states why the canal was built to the monument at its entrance."
      icon={Construction}
      live={
        <>
          <Reading label="Sections dug" value={`${world.dug.length} / ${CANAL_SECTIONS}`} tone="amber" />
          <Reading label="Canal" value={open ? "Open to ships" : "Blocked by sand"} tone={open ? "teal" : "slate"} />
          <Reading label="Europe → Asia via isthmus" value={`${viaCanal.toLocaleString()} nm`} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [2.2, 2.7, 2.6], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, 0.3, 0], minDistance: 1.8, maxDistance: 7, maxPolarAngle: 1.35 }}>
          <Studio shadowScale={8} shadowOpacity={0.35} />
          <Floor color="#EEF1F5" />
          <Diorama world={world} ro={ro} racing={racing} onDig={dig} onFix={fix} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Excavation · tap a section to dig or refill">
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: CANAL_SECTIONS }, (_, i) => (
                <Chip key={i} active={world.dug.includes(i)} disabled={ro} onClick={() => dig(i)}>
                  <span className="inline-flex items-center gap-0.5">
                    <Shovel className="w-3 h-3" /> {i + 1}
                  </span>
                </Chip>
              ))}
            </div>
          </Panel>
          <Panel title="Freighter race · Europe to Asia">
            {[
              { name: open ? "Ship A · through the isthmus" : "Ship A · isthmus blocked, sails around", nm: viaCanal, p: shipA, color: "bg-sky-600" },
              { name: "Ship B · around Africa", nm: AROUND_AFRICA_NM, p: shipB, color: "bg-amber-500" },
            ].map((s) => (
              <div key={s.name} className="mb-1.5">
                <div className="flex justify-between text-[10.5px] font-bold text-slate-600">
                  <span>{s.name}</span>
                  <span className="font-mono">{s.nm.toLocaleString()} nm</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${s.color}`} style={{ width: `${s.p * 100}%` }} />
                </div>
              </div>
            ))}
            <button
              type="button"
              disabled={ro || racing}
              onClick={race}
              className="mt-1 w-full h-9 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FlagIcon className="w-4 h-4" /> {racing ? "Racing…" : "Start the race"}
            </button>
          </Panel>
          <AnswerStation title="Entrance monument · fix a plaque" hint="Fix the plaque that states the primary reason the Suez Canal was built. Tap a plaque in the scene or here.">
            <div className="grid gap-1.5">
              {PLAQUE_IDS.map((p) => (
                <Chip key={p} tone="violet" active={world.plaque === p} disabled={ro} onClick={() => fix(p)}>
                  {CANAL_PLAQUES[p].label}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

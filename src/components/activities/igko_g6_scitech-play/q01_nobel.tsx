"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Award, Info } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, usePlaneDrag, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Studio, useInvestigation } from "./kit";
import { Crate, Medal, Matte, Plastic, Wood, Brushed } from "./models";
import { PRIZES, CITIES, NOBEL_BACKGROUND, evaluateNobel, nobelInitial, type Prize, type City, type NobelWorld } from "./logic";

/**
 * Q1 · Nobel Mission Control.
 * A map table of Scandinavia with the two ceremonial halls. The student reads the question,
 * decides which prize it describes and where that prize is presented, and carries the crate
 * there. The delivery is the answer; nothing in the room says which is right.
 */

const TABLE_Y = 0.9;
const HALLS: Record<City, { pad: [number, number, number] }> = {
  oslo: { pad: [-1.25, TABLE_Y + 0.17, 0.35] },
  stockholm: { pad: [1.55, TABLE_Y + 0.17, 0.25] },
};
const BAND: Record<Prize, string> = { Physics: "#2563EB", Chemistry: "#059669", Peace: "#D97706" };
const dock = (i: number): [number, number, number] => [-1.2 + i * 1.2, TABLE_Y + 0.29, 2.15];
const SNAP = 0.8;
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(TABLE_Y + 0.3));

/* ── Map table ───────────────────────────────────────────────── */

// Simplified coastlines (x = east, z = south).
const NORWAY: [number, number][] = [
  [-3.0, 1.0], [-3.25, 0.25], [-2.95, -0.55], [-2.5, -1.35], [-1.85, -2.05], [-1.1, -2.6], [-0.35, -2.85], [0.25, -2.75],
  [0.05, -2.35], [-0.55, -1.95], [-0.95, -1.25], [-1.05, -0.45], [-0.85, 0.3], [-0.95, 0.85], [-1.55, 1.2], [-2.35, 1.3],
];
const SWEDEN: [number, number][] = [
  [-0.85, 0.3], [-1.05, -0.45], [-0.95, -1.25], [-0.55, -1.95], [0.05, -2.35], [0.25, -2.75], [0.85, -2.55], [1.15, -1.75],
  [1.55, -0.95], [2.25, -0.35], [2.25, 0.55], [1.7, 1.15], [0.85, 1.65], [0.05, 1.45], [-0.55, 1.0],
];

function Land({ points, color }: { points: [number, number][]; color: string }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.03, bevelSegments: 3 });
    g.rotateX(Math.PI / 2);
    g.translate(0, TABLE_Y + 0.17, 0);
    return g;
  }, [points]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Pines({ seed, area }: { seed: number; area: [number, number, number, number] }) {
  const trees = useMemo(() => {
    const out: [number, number, number][] = [];
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 14; i++) out.push([area[0] + rnd() * (area[1] - area[0]), TABLE_Y + 0.18, area[2] + rnd() * (area[3] - area[2])]);
    return out;
  }, [seed, area]);
  return (
    <>
      {trees.map((p, i) => (
        <mesh key={i} position={[p[0], p[1] + 0.09, p[2]]} castShadow>
          <coneGeometry args={[0.07, 0.2, 7]} />
          <meshStandardMaterial color="#2F6B3F" roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

function OsloCityHall() {
  const [x, , z] = HALLS.oslo.pad;
  return (
    <group position={[x, TABLE_Y + 0.17, z - 0.75]}>
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.32, 0.4]} />
        <Matte color="#A2502E" />
      </mesh>
      {[-0.32, 0.32].map((tx) => (
        <group key={tx} position={[tx, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.26, 1.0, 0.3]} />
            <Matte color="#8E4426" />
          </mesh>
          {[0.25, 0.45, 0.65, 0.85].map((wy) => (
            <mesh key={wy} position={[0, wy, 0.153]}>
              <planeGeometry args={[0.14, 0.08]} />
              <meshStandardMaterial color="#1E293B" metalness={0.4} roughness={0.2} />
            </mesh>
          ))}
          <mesh position={[0, 1.02, 0.151]}>
            <circleGeometry args={[0.07, 24]} />
            <Brushed color="#E5E7EB" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StockholmConcertHall() {
  const [x, , z] = HALLS.stockholm.pad;
  return (
    <group position={[x, TABLE_Y + 0.17, z - 0.75]}>
      <mesh position={[0, 0.03, 0.05]} receiveShadow>
        <boxGeometry args={[1.15, 0.06, 0.6]} />
        <Matte color="#CBD5E1" />
      </mesh>
      <mesh position={[0, 0.3, -0.05]} castShadow>
        <boxGeometry args={[1.05, 0.5, 0.38]} />
        <Plastic color="#3B6FB6" roughness={0.5} clearcoat={0.2} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-0.45 + i * 0.1, 0.3, 0.17]} castShadow>
          <cylinderGeometry args={[0.025, 0.028, 0.48, 12]} />
          <Matte color="#F8FAFC" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.58, 0.02]} castShadow>
        <boxGeometry args={[1.12, 0.07, 0.46]} />
        <Matte color="#E2E8F0" />
      </mesh>
    </group>
  );
}

function Podium({ city, lit }: { city: City; lit: boolean }) {
  const [x, y, z] = HALLS[city].pad;
  return (
    <group position={[x, y, z]}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[0.42, 0.46, 0.06, 48]} />
        <meshPhysicalMaterial color="#F1F5F9" roughness={0.15} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.032, 0]}>
        <torusGeometry args={[0.42, 0.012, 8, 64]} />
        <meshStandardMaterial color={lit ? "#F5B83D" : "#C7CED6"} metalness={1} roughness={0.2} emissive={lit ? "#B45309" : "#000"} emissiveIntensity={lit ? 0.4 : 0} />
      </mesh>
      <Label3D text={`${CITIES[city].name}, ${CITIES[city].country}`} position={[0, 1.55, -0.75]} size={[1.4, 0.26]} billboard style={{ bg: "#FFFFFF", fg: "#0F172A", border: "#CBD5E1", scale: 0.5 }} />
      <Label3D text={CITIES[city].hall} position={[0, 0.04, 0.62]} rotation={[-Math.PI / 2, 0, 0]} size={[1.3, 0.2]} style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.5 }} />
    </group>
  );
}

/* ── Award crates ────────────────────────────────────────────── */

function AwardCrate({
  prize,
  home,
  at,
  disabled,
  onDrop,
}: {
  prize: Prize;
  home: [number, number, number];
  at: City | null;
  disabled: boolean;
  onDrop: (city: City | null) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const medal = useRef<THREE.Group>(null);
  const [drag, setDrag] = useState<THREE.Vector3 | null>(null);

  const target = useMemo<[number, number, number]>(() => {
    if (drag) return [drag.x, TABLE_Y + 0.55, drag.z];
    if (at) {
      const [x, y, z] = HALLS[at].pad;
      return [x, y + 0.29, z];
    }
    return home;
  }, [drag, at, home]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = approach(g.position.x, target[0], 12, dt);
    g.position.y = approach(g.position.y, target[1], 12, dt);
    g.position.z = approach(g.position.z, target[2], 12, dt);
    if (medal.current) {
      medal.current.position.y = approach(medal.current.position.y, at && !drag ? 0.75 : 0.2, 3, dt);
      medal.current.rotation.y += dt * (at ? 1.2 : 0.3);
    }
  });

  const handlers = usePlaneDrag({
    plane: dragPlane,
    disabled,
    onDrag: (p) => setDrag(p),
    onEnd: (p) => {
      setDrag(null);
      cursor(false);
      if (!p) return;
      const city = (Object.keys(HALLS) as City[]).find((c) => Math.hypot(p.x - HALLS[c].pad[0], p.z - HALLS[c].pad[2]) < SNAP) ?? null;
      onDrop(city);
    },
  });

  return (
    <group ref={ref} position={home}>
      <group
        {...handlers}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (!disabled) cursor(true, "grab");
        }}
        onPointerOut={() => cursor(false)}
      >
        <Crate size={0.58} band={BAND[prize]} />
      </group>
      <Label3D text={`${prize}`} position={[0, 0.02, 0.295]} size={[0.52, 0.17]} style={{ bg: BAND[prize], fg: "#FFFFFF", scale: 0.6 }} />
      <group ref={medal} position={[0, 0.2, 0]}>
        <Medal radius={0.13} />
      </group>
    </group>
  );
}

function Scene({ world, disabled, onDeliver, onReturn }: { world: NobelWorld; disabled: boolean; onDeliver: (p: Prize, c: City) => void; onReturn: (p: Prize) => void }) {
  const d = world.delivery;
  return (
    <>
      <Studio shadowY={0} shadowScale={16} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#E9EDF2" roughness={0.95} />
      </mesh>
      {/* Map table */}
      <RoundedBox args={[7.6, 0.14, 5.8]} radius={0.06} smoothness={4} position={[0, TABLE_Y, 0]} castShadow receiveShadow>
        <Wood color="#6B4428" />
      </RoundedBox>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * 3.5, TABLE_Y / 2, sz * 2.6]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, TABLE_Y, 16]} />
            <Wood color="#4A2E1A" />
          </mesh>
        ))
      )}
      <mesh position={[0, TABLE_Y + 0.085, -0.5]} receiveShadow>
        <boxGeometry args={[7.2, 0.03, 4.4]} />
        <meshPhysicalMaterial color="#5BA7D6" roughness={0.25} clearcoat={0.8} />
      </mesh>
      <Land points={NORWAY} color="#CFE3B6" />
      <Land points={SWEDEN} color="#EADFA9" />
      <Pines seed={7} area={[-2.6, -1.3, -2.0, 0.6]} />
      <Pines seed={19} area={[-0.3, 1.6, -2.0, 0.8]} />
      <Label3D text="NORWAY" position={[-2.15, TABLE_Y + 0.2, -0.6]} rotation={[-Math.PI / 2, 0, 0.5]} size={[1.0, 0.24]} style={{ bg: null, fg: "#3F6212", scale: 0.6 }} />
      <Label3D text="SWEDEN" position={[0.75, TABLE_Y + 0.2, -1.2]} rotation={[-Math.PI / 2, 0, 0.4]} size={[1.0, 0.24]} style={{ bg: null, fg: "#854D0E", scale: 0.6 }} />
      <OsloCityHall />
      <StockholmConcertHall />
      {(Object.keys(HALLS) as City[]).map((c) => (
        <Podium key={c} city={c} lit={d?.city === c} />
      ))}
      {/* Dispatch tray */}
      <RoundedBox args={[4.2, 0.06, 0.9]} radius={0.03} smoothness={3} position={[0, TABLE_Y + 0.1, 2.15]} receiveShadow>
        <meshPhysicalMaterial color="#1F2937" roughness={0.5} clearcoat={0.3} />
      </RoundedBox>
      <Label3D text="Dispatch tray — drag a crate to a hall's podium" position={[0, TABLE_Y + 0.14, 2.72]} rotation={[-Math.PI / 2, 0, 0]} size={[3.4, 0.2]} style={{ bg: null, fg: "#334155", scale: 0.5 }} />
      {PRIZES.map((p, i) => (
        <AwardCrate key={p} prize={p} home={dock(i)} at={d?.prize === p ? d.city : null} disabled={disabled} onDrop={(c) => (c ? onDeliver(p, c) : onReturn(p))} />
      ))}
      {d && <spotLight position={[HALLS[d.city].pad[0], 4.5, HALLS[d.city].pad[2] + 1.5]} angle={0.3} penumbra={0.7} intensity={25} color="#FFF4D6" />}
    </>
  );
}

export function IgkoQ01Nobel(props: ActivityComponentProps) {
  const play = useInvestigation<NobelWorld>(props, nobelInitial, evaluateNobel);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [chosen, setChosen] = useState<Prize | null>(world.delivery?.prize ?? null);
  const deliver = (p: Prize, c: City) => play.patch({ delivery: { prize: p, city: c } });
  const recall = (p: Prize) => {
    if (world.delivery?.prize === p) play.patch({ delivery: null });
  };

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Nobel Mission Control"
      mission="Decide which prize the question describes and where it is presented, then carry that award crate to the hall."
      icon={Award}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Lab3D camera={{ position: [0.2, 5.4, 6.2], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, TABLE_Y, 0], minDistance: 4, maxDistance: 11 }}>
          <Scene world={world} disabled={ro} onDeliver={deliver} onReturn={recall} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Foundation terminal">
            <ul className="space-y-1 text-xs text-slate-700">
              {NOBEL_BACKGROUND.map((line) => (
                <li key={line} className="flex gap-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                  {line}
                </li>
              ))}
            </ul>
          </Panel>
          <AnswerStation title="Deliver the award" hint="Drag a crate onto a hall's podium in the map — or choose a crate and a hall here.">
            <div className="flex flex-wrap gap-1.5">
              {PRIZES.map((p) => (
                <Chip key={p} active={chosen === p} disabled={ro} onClick={() => setChosen(p)} tone="violet">
                  {p} crate
                </Chip>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(Object.keys(HALLS) as City[]).map((c) => (
                <Chip key={c} disabled={ro || !chosen} onClick={() => chosen && deliver(chosen, c)} tone="violet">
                  Send to {CITIES[c].hall}
                </Chip>
              ))}
            </div>
            {world.delivery && (
              <button type="button" disabled={ro} onClick={() => play.patch({ delivery: null })} className="mt-2 text-xs font-bold text-violet-700 hover:underline disabled:opacity-40">
                Return the crate to the tray
              </button>
            )}
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

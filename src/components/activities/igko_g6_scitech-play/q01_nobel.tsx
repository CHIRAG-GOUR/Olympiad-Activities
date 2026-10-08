"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Award, ScrollText } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D, usePlaneDrag, approach, cursor } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, Chip, useInvestigation } from "./kit";
import {
  PRIZES,
  CITIES,
  PRIZE_CITATIONS,
  evaluateNobel,
  nobelInitial,
  type Prize,
  type City,
  type NobelWorld,
} from "./logic";

/**
 * Q1 · Nobel Mission Control.
 * Read each award crate's citation at the Nobel Foundation terminal, then carry the award
 * described in the question to the ceremonial hall where it is presented. The delivery —
 * which crate, which hall — is the answer.
 */

const HALLS: Record<City, { pad: [number, number, number]; label: string }> = {
  oslo: { pad: [-1.55, 0.32, 0.55], label: "Oslo City Hall" },
  stockholm: { pad: [1.95, 0.32, 0.35], label: "Stockholm Concert Hall" },
};

const CRATE_COLORS: Record<Prize, string> = {
  Physics: "#3B82F6",
  Chemistry: "#10B981",
  Medicine: "#EF4444",
  Literature: "#8B5CF6",
  Peace: "#F59E0B",
};

const dockSpot = (i: number): [number, number, number] => [-2.6 + i * 1.3, 0.36, 3.15];
const SNAP = 0.95;
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.36);

/* ── Map ─────────────────────────────────────────────────────── */

function Land({ points, color, height = 0.22 }: { points: [number, number][]; color: string; height?: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.04, bevelSegments: 2 });
    g.rotateX(Math.PI / 2);
    g.translate(0, height, 0);
    return g;
  }, [points, height]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

// Simplified outlines (x = east, z = south), not to survey accuracy.
const NORWAY: [number, number][] = [
  [-3.4, 1.4], [-3.6, 0.4], [-3.2, -0.6], [-2.6, -1.6], [-1.8, -2.6], [-0.9, -3.4], [0.1, -3.7],
  [0.3, -3.2], [-0.4, -2.6], [-1.0, -1.8], [-1.2, -0.8], [-1.0, 0.2], [-0.9, 0.9], [-1.4, 1.5], [-2.3, 1.7],
];
const SWEDEN: [number, number][] = [
  [-1.0, 0.2], [-1.2, -0.8], [-1.0, -1.8], [-0.4, -2.6], [0.3, -3.2], [1.1, -3.0], [1.4, -2.0],
  [1.9, -1.0], [2.6, -0.2], [2.4, 0.9], [1.6, 1.6], [0.6, 2.3], [-0.3, 2.0], [-0.9, 0.9],
];

function OsloHall() {
  return (
    <group position={[HALLS.oslo.pad[0] - 0.05, 0.22, HALLS.oslo.pad[2] - 0.9]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.5]} />
        <meshStandardMaterial color="#B45309" roughness={0.7} />
      </mesh>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.75, 0]} castShadow>
          <boxGeometry args={[0.3, 1.5, 0.34]} />
          <meshStandardMaterial color="#9A3412" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function StockholmHall() {
  return (
    <group position={[HALLS.stockholm.pad[0], 0.22, HALLS.stockholm.pad[2] - 0.9]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.55]} />
        <meshStandardMaterial color="#60A5FA" roughness={0.5} />
      </mesh>
      {[-0.45, -0.15, 0.15, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.35, 0.3]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 12]} />
          <meshStandardMaterial color="#F8FAFC" />
        </mesh>
      ))}
      <mesh position={[0, 0.78, 0.05]}>
        <boxGeometry args={[1.3, 0.12, 0.65]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>
    </group>
  );
}

function Podium({ city, glowing }: { city: City; glowing: boolean }) {
  const [x, , z] = HALLS[city].pad;
  return (
    <group position={[x, 0.24, z]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[0.55, 0.6, 0.08, 40]} />
        <meshStandardMaterial color={glowing ? "#FDE68A" : "#E2E8F0"} emissive={glowing ? "#F59E0B" : "#000000"} emissiveIntensity={glowing ? 0.35 : 0} />
      </mesh>
      <Label3D
        text={HALLS[city].label}
        position={[0, 0.02, 0.85]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[1.6, 0.32]}
        style={{ bg: "#0F172A", fg: "#FFFFFF", scale: 0.5 }}
      />
      <Label3D text={`${CITIES[city].name} · ${CITIES[city].country}`} position={[0, 1.95, -0.9]} size={[1.7, 0.34]} billboard style={{ bg: "#FFFFFF", fg: "#0F172A", border: "#CBD5E1", scale: 0.5 }} />
    </group>
  );
}

/* ── Crates ──────────────────────────────────────────────────── */

function Crate({
  prize,
  home,
  delivered,
  disabled,
  onInspect,
  onDrop,
}: {
  prize: Prize;
  home: [number, number, number];
  delivered: City | null;
  disabled: boolean;
  onInspect: () => void;
  onDrop: (city: City | null) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const medal = useRef<THREE.Mesh>(null);
  const [dragAt, setDragAt] = useState<THREE.Vector3 | null>(null);
  const moved = useRef(0);

  const target = useMemo<[number, number, number]>(() => {
    if (dragAt) return [dragAt.x, 0.62, dragAt.z];
    if (delivered) {
      const [x, , z] = HALLS[delivered].pad;
      return [x, 0.5, z];
    }
    return home;
  }, [dragAt, delivered, home]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = approach(g.position.x, target[0], 12, dt);
    g.position.y = approach(g.position.y, target[1], 12, dt);
    g.position.z = approach(g.position.z, target[2], 12, dt);
    if (medal.current) {
      const up = delivered && !dragAt ? 1.25 : 0.32;
      medal.current.position.y = approach(medal.current.position.y, up, 3, dt);
      medal.current.rotation.y += dt * (delivered ? 1.6 : 0.4);
    }
  });

  const drag = usePlaneDrag({
    plane: dragPlane,
    disabled,
    onStart: () => {
      moved.current = 0;
    },
    onDrag: (p) => {
      moved.current += 1;
      setDragAt(p);
    },
    onEnd: (p) => {
      setDragAt(null);
      cursor(false);
      if (moved.current < 3) {
        onInspect();
        return;
      }
      if (!p) return onDrop(null);
      const city = (Object.keys(HALLS) as City[]).find((c) => {
        const [x, , z] = HALLS[c].pad;
        return Math.hypot(p.x - x, p.z - z) < SNAP;
      });
      onDrop(city ?? null);
    },
  });

  return (
    <group ref={ref} position={home}>
      <mesh
        castShadow
        {...drag}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (!disabled) cursor(true, "grab");
        }}
        onPointerOut={() => cursor(false)}
      >
        <boxGeometry args={[0.72, 0.5, 0.72]} />
        <meshStandardMaterial color="#A16207" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[0.74, 0.04, 0.2]} />
        <meshStandardMaterial color={CRATE_COLORS[prize]} />
      </mesh>
      <Label3D text={prize} position={[0, 0.02, 0.37]} size={[0.68, 0.24]} style={{ bg: CRATE_COLORS[prize], fg: "#FFFFFF", scale: 0.55 }} />
      <mesh ref={medal} position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 40]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.25} emissive="#B45309" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Scene({
  world,
  disabled,
  onInspect,
  onDeliver,
  onReturn,
}: {
  world: NobelWorld;
  disabled: boolean;
  onInspect: (p: Prize) => void;
  onDeliver: (p: Prize, c: City) => void;
  onReturn: (p: Prize) => void;
}) {
  const delivered = world.delivery;
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#7DD3FC" roughness={0.35} metalness={0.1} />
      </mesh>
      <Land points={NORWAY} color="#BBF7D0" />
      <Land points={SWEDEN} color="#FEF08A" />
      <Label3D text="NORWAY" position={[-2.3, 0.5, -0.9]} rotation={[-Math.PI / 2, 0, 0]} size={[1.4, 0.36]} style={{ bg: null, fg: "#166534", scale: 0.6 }} />
      <Label3D text="SWEDEN" position={[0.8, 0.5, -1.4]} rotation={[-Math.PI / 2, 0, 0]} size={[1.4, 0.36]} style={{ bg: null, fg: "#854D0E", scale: 0.6 }} />
      <OsloHall />
      <StockholmHall />
      {(Object.keys(HALLS) as City[]).map((c) => (
        <Podium key={c} city={c} glowing={delivered?.city === c} />
      ))}
      {/* Dock */}
      <mesh position={[0, 0.06, 3.15]} receiveShadow>
        <boxGeometry args={[7, 0.12, 1.1]} />
        <meshStandardMaterial color="#78716C" roughness={0.9} />
      </mesh>
      <Label3D text="Nobel Foundation dock — drag a crate to a hall" position={[0, 0.13, 3.85]} rotation={[-Math.PI / 2, 0, 0]} size={[4.4, 0.3]} style={{ bg: "#1C1917", fg: "#FAFAF9", scale: 0.5 }} />
      {PRIZES.map((p, i) => (
        <Crate
          key={p}
          prize={p}
          home={dockSpot(i)}
          delivered={delivered?.prize === p ? delivered.city : null}
          disabled={disabled}
          onInspect={() => onInspect(p)}
          onDrop={(city) => (city ? onDeliver(p, city) : onReturn(p))}
        />
      ))}
      {delivered && (
        <spotLight
          position={[HALLS[delivered.city].pad[0], 4, HALLS[delivered.city].pad[2] + 1]}
          angle={0.35}
          penumbra={0.6}
          intensity={18}
          color="#FFF7D6"
          castShadow
        />
      )}
    </>
  );
}

export function IgkoQ01Nobel(props: ActivityComponentProps) {
  const play = useInvestigation<NobelWorld>(props, nobelInitial, evaluateNobel);
  const { world, readOnly } = play;
  const [open, setOpen] = useState<Prize | null>(world.inspected[world.inspected.length - 1] ?? null);
  const [chosen, setChosen] = useState<Prize | null>(null);

  // Reading a citation is looking, not experimenting: it never withdraws a locked-in answer.
  const inspect = (p: Prize) => {
    setOpen(p);
    setChosen(p);
  };
  const deliver = (p: Prize, c: City) => play.patch({ delivery: { prize: p, city: c } });
  const recall = (p: Prize) => {
    if (world.delivery?.prize === p) play.patch({ delivery: null });
  };

  return (
    <Investigation
      play={play}
      question={props.question}
      title="Nobel Mission Control"
      mission="Read the award crates' citations, then carry the award described in the question to the hall where it is presented."
      icon={Award}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Lab3D camera={{ position: [0.2, 7.2, 7.4], fov: 42 }} readOnly={readOnly}>
          <Scene world={world} disabled={!!readOnly} onInspect={inspect} onDeliver={deliver} onReturn={recall} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Nobel Foundation terminal">
            <p className="text-[11px] text-slate-500 mb-2">Tap a crate (here or on the dock) to open its citation card.</p>
            <div className="flex flex-wrap gap-1.5">
              {PRIZES.map((p) => (
                <Chip key={p} active={open === p} onClick={() => inspect(p)}>
                  <ScrollText className="inline w-3 h-3 mr-1" />
                  {p}
                </Chip>
              ))}
            </div>
            {open && (
              <blockquote className="mt-2 rounded-lg border-l-4 pl-2.5 py-1.5 text-xs text-slate-700 bg-slate-50" style={{ borderColor: CRATE_COLORS[open] }}>
                <span className="block font-black text-slate-900">{open} crate — citation</span>
                {PRIZE_CITATIONS[open]}
              </blockquote>
            )}
          </Panel>

          <Panel title="Transport">
            <p className="text-[11px] text-slate-500 mb-2">
              Drag a crate onto a hall&apos;s podium in the map, or pick a crate and send it here.
            </p>
            <div className="text-xs font-bold text-slate-700 mb-1.5">Crate: {chosen ?? "none selected"}</div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(HALLS) as City[]).map((c) => (
                <Chip key={c} disabled={!chosen || !!readOnly} onClick={() => chosen && deliver(chosen, c)}>
                  Send to {HALLS[c].label}
                </Chip>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-600">
              {world.delivery ? (
                <>
                  On the podium: <strong>{world.delivery.prize}</strong> award at{" "}
                  <strong>{HALLS[world.delivery.city].label}</strong>
                  <button type="button" disabled={!!readOnly} onClick={() => play.patch({ delivery: null })} className="ml-2 text-teal-700 font-bold hover:underline disabled:opacity-40">
                    Return to dock
                  </button>
                </>
              ) : (
                "No award delivered yet."
              )}
            </div>
          </Panel>
        </div>
      </div>
    </Investigation>
  );
}

"use client";

import React from "react";
import { RoundedBox } from "@react-three/drei";
import { Cog } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor, LabBench, Brass, Wood, Metal, Matte } from "../igko_g6_scitech-play/models";
import { Plaque, IW_BADGE } from "./iwkit";
import { ZERO_PLAQUES, machineReading, zeroInitial, evaluateZero, type ZeroPlaque, type ZeroWorld } from "./logic";

/**
 * Q7 · Place-value machine.
 * Investigate: a counting machine with four wheel slots (thousands, hundreds, tens, ones).
 * It reads only the wheels that are present, as a number system with no zero would, so an
 * empty slot silently disappears. Insert wheels — including a zero wheel — and compare what
 * the machine reads with what the slots mean. Answer: mount the plaque that says why the
 * discovery of zero was revolutionary.
 */

const BENCH_Y = 0.9;
const PLACES = ["Thousands", "Hundreds", "Tens", "Ones"];
const PLAQUE_IDS = Object.keys(ZERO_PLAQUES) as ZeroPlaque[];

function Wheel({ x, digit }: { x: number; digit: number | null }) {
  return (
    <group position={[x, 0, 0]}>
      {/* Recess */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.24, 0.3, 0.02]} />
        <Matte color="#1C1917" />
      </mesh>
      {digit !== null && (
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.02]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.2, 40]} />
            <meshPhysicalMaterial color="#F5F0E1" roughness={0.4} clearcoat={0.6} />
          </mesh>
          <Label3D text={String(digit)} position={[0, 0, 0.152]} size={[0.16, 0.2]} style={{ bg: null, fg: "#111827", scale: 0.85, weight: 800 }} />
          {[-1, 1].map((s) => (
            <mesh key={s} rotation={[0, 0, Math.PI / 2]} position={[s * 0.105, 0, 0.02]}>
              <cylinderGeometry args={[0.135, 0.135, 0.012, 40]} />
              <Brass />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function Machine({ world, ro, onMount }: { world: ZeroWorld; ro: boolean; onMount: (p: ZeroPlaque) => void }) {
  const { value } = machineReading(world.wheels);
  const y = BENCH_Y + 0.05;
  return (
    <group>
      {/* Cabinet */}
      <RoundedBox args={[1.6, 0.9, 0.6]} radius={0.04} smoothness={4} position={[0, y + 0.45, -0.15]} castShadow receiveShadow>
        <Wood color="#6B3F22" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.5, 0.02]} radius={0.015} smoothness={2} position={[0, y + 0.5, 0.155]}>
        <Brass color="#C9A04A" />
      </RoundedBox>
      <group position={[0, y + 0.53, 0.16]}>
        {world.wheels.map((d, i) => (
          <Wheel key={i} x={-0.51 + i * 0.34} digit={d} />
        ))}
        {PLACES.map((p, i) => (
          <Label3D key={p} text={p} position={[-0.51 + i * 0.34, -0.2, 0.013]} size={[0.3, 0.06]} style={{ bg: null, fg: "#3B2A0F", scale: 0.55 }} />
        ))}
      </group>
      {/* Read-out window on top */}
      <group position={[0, y + 1.05, -0.15]}>
        <RoundedBox args={[0.9, 0.24, 0.12]} radius={0.03} smoothness={3} castShadow>
          <Metal color="#B8BEC6" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.062]}>
          <planeGeometry args={[0.8, 0.17]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} />
        </mesh>
        <Label3D text={`READS  ${value}`} position={[0, 0, 0.064]} size={[0.78, 0.15]} style={{ bg: null, fg: "#FBBF24", scale: 0.6, weight: 800 }} />
      </group>
      {/* Crank */}
      <group position={[0.86, y + 0.55, -0.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 12]} />
          <Metal />
        </mesh>
        <mesh position={[0.07, -0.08, 0]}>
          <boxGeometry args={[0.02, 0.18, 0.03]} />
          <Metal />
        </mesh>
        <mesh position={[0.07, -0.18, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.09, 12]} />
          <Wood color="#3F2412" />
        </mesh>
      </group>
      {/* Plaque mount */}
      <group position={[0, y + 0.13, 0.16]}>
        {world.plaque ? (
          <Plaque text={ZERO_PLAQUES[world.plaque].label} width={1.36} />
        ) : (
          <mesh>
            <boxGeometry args={[1.42, 0.28, 0.01]} />
            <meshStandardMaterial color="#3B2414" roughness={0.8} />
          </mesh>
        )}
      </group>
      {/* Plaques waiting on the bench */}
      {PLAQUE_IDS.map((p, i) =>
        world.plaque === p ? null : (
          <group key={p} position={[-1.05 + (i % 2) * 2.1, y + 0.02, 0.45 + Math.floor(i / 2) * 0.38]} rotation={[-Math.PI / 2 + 0.25, 0, 0]} scale={0.62}>
            <Plaque text={ZERO_PLAQUES[p].label} width={1.36} onClick={ro ? undefined : () => onMount(p)} />
          </group>
        )
      )}
    </group>
  );
}

export function IgkoQ07Zero(props: ActivityComponentProps) {
  const play = useInvestigation<ZeroWorld>(props, zeroInitial, evaluateZero);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const { value, intended } = machineReading(world.wheels);
  const setWheel = (i: number, d: number | null) => play.patch({ wheels: world.wheels.map((w, k) => (k === i ? d : w)) });
  const mount = (p: ZeroPlaque) => play.patch({ plaque: world.plaque === p ? null : p });

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Place-Value Machine"
      mission="The machine reads only the wheels that are present. Set the wheels — try leaving a slot empty, then try a zero wheel — and compare what it reads with what the slots mean. Then mount the plaque that says why zero was revolutionary."
      icon={Cog}
      live={
        <>
          <Reading label="Machine reads" value={value} tone="amber" />
          <Reading label="The slots mean" value={intended} tone="teal" />
          <Reading label="Empty slots" value={world.wheels.filter((w) => w === null).length} />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0.2, 1.9, 2.8], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, BENCH_Y + 0.5, 0], minDistance: 1.6, maxDistance: 6 }}>
          <Studio shadowScale={8} />
          <Floor />
          <LabBench size={[3.2, 1.7]} height={BENCH_Y} top="#E9E2D6" />
          <Machine world={world} ro={ro} onMount={mount} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Wheel slots">
            <div className="grid grid-cols-4 gap-1.5">
              {world.wheels.map((d, i) => (
                <label key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">{PLACES[i]}</span>
                  <select
                    value={d === null ? "" : String(d)}
                    disabled={ro}
                    onChange={(e) => setWheel(i, e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-1 py-1.5 text-center text-sm font-black text-slate-800 cursor-pointer disabled:opacity-50"
                  >
                    <option value="">empty</option>
                    {Array.from({ length: 10 }, (_, k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-slate-500">An empty slot has no wheel at all. Wheel “0” is the newest wheel in the box.</p>
          </Panel>
          <AnswerStation title="Mount a plaque" hint="Mount the plaque that says why the discovery of zero was revolutionary. Tap a plaque on the bench or here.">
            <div className="grid gap-1.5">
              {PLAQUE_IDS.map((p) => (
                <Chip key={p} tone="violet" active={world.plaque === p} disabled={ro} onClick={() => mount(p)}>
                  {ZERO_PLAQUES[p].label}
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

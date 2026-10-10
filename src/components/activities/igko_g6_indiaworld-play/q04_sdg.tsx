"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Building2, Inbox, LayoutGrid } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor, Matte, Metal, Plastic, Glass, Wood } from "../igko_g6_scitech-play/models";
import { IW_BADGE } from "./iwkit";
import { SDG_PROJECTS, sdgInitial, evaluateSdg, type SdgProject, type SdgWorld } from "./logic";

/**
 * Q4 · Sustainable city builder.
 * Investigate: build a model city plot by plot and compare it with the UN's board of 17
 * goals. Answer: drop the one project card that is NOT an SDG theme into the review tray.
 */

const PROJECTS = Object.keys(SDG_PROJECTS) as SdgProject[];
const PLOT = 0.9;
const plotPos = (i: number): [number, number, number] => [(i % 3 - 1) * (PLOT + 0.28), 0.12, (Math.floor(i / 3) - 0.5) * (PLOT + 0.28) - 0.25];

const GOALS: [string, string][] = [
  ["No Poverty", "#E5243B"], ["Zero Hunger", "#DDA63A"], ["Good Health and Well-being", "#4C9F38"], ["Quality Education", "#C5192D"],
  ["Gender Equality", "#FF3A21"], ["Clean Water and Sanitation", "#26BDE2"], ["Affordable and Clean Energy", "#FCC30B"], ["Decent Work and Economic Growth", "#A21942"],
  ["Industry, Innovation and Infrastructure", "#FD6925"], ["Reduced Inequalities", "#DD1367"], ["Sustainable Cities and Communities", "#FD9D24"], ["Responsible Consumption and Production", "#BF8B2E"],
  ["Climate Action", "#3F7E44"], ["Life Below Water", "#0A97D9"], ["Life on Land", "#56C02B"], ["Peace, Justice and Strong Institutions", "#00689D"],
  ["Partnerships for the Goals", "#19486A"],
];

function Tree({ p, s = 1 }: { p: [number, number, number]; s?: number }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.016, 0.1, 8]} />
        <Wood color="#6B4423" />
      </mesh>
      <mesh position={[0, 0.14, 0]} castShadow>
        <icosahedronGeometry args={[0.07, 1]} />
        <Matte color="#3F9142" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Model({ id }: { id: SdgProject }) {
  switch (id) {
    case "water":
      return (
        <group>
          {[-1, 1].map((sx) => [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * 0.1, 0.2, sz * 0.1]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
              <Metal color="#94A3B8" />
            </mesh>
          )))}
          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.2, 32]} />
            <Plastic color="#38BDF8" />
          </mesh>
          <mesh position={[0, 0.61, 0]} castShadow>
            <coneGeometry args={[0.18, 0.08, 32]} />
            <Metal color="#CBD5E1" />
          </mesh>
          <mesh position={[0.28, 0.06, 0]} castShadow>
            <boxGeometry args={[0.2, 0.12, 0.3]} />
            <Matte color="#E2E8F0" />
          </mesh>
        </group>
      );
    case "school":
      return (
        <group>
          <RoundedBox args={[0.6, 0.26, 0.32]} radius={0.01} position={[0, 0.13, -0.08]} castShadow>
            <Matte color="#FDE7C4" />
          </RoundedBox>
          <mesh position={[0, 0.3, -0.08]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.46, 0.14, 4]} />
            <Matte color="#B91C1C" />
          </mesh>
          {[-0.2, -0.07, 0.07, 0.2].map((x) => (
            <mesh key={x} position={[x, 0.16, 0.085]}>
              <boxGeometry args={[0.07, 0.08, 0.005]} />
              <Glass tint="#BAE6FD" opacity={0.85} />
            </mesh>
          ))}
          <mesh position={[0, 0.006, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.55, 0.2]} />
            <Matte color="#86C06C" />
          </mesh>
        </group>
      );
    case "food":
      return (
        <group>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[-0.3 + i * 0.13, 0.015, 0.1]} castShadow>
              <boxGeometry args={[0.11, 0.03, 0.42]} />
              <Matte color={i % 2 ? "#E9C46A" : "#7FB24C"} />
            </mesh>
          ))}
          <RoundedBox args={[0.24, 0.2, 0.2]} radius={0.01} position={[0.25, 0.1, -0.2]} castShadow>
            <Matte color="#A3361F" />
          </RoundedBox>
          <mesh position={[0.25, 0.24, -0.2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.24, 3]} />
            <Matte color="#F1F5F9" />
          </mesh>
        </group>
      );
    case "court":
      return (
        <group>
          <RoundedBox args={[0.64, 0.05, 0.44]} radius={0.01} position={[0, 0.025, 0]} castShadow>
            <Matte color="#E7E5E4" />
          </RoundedBox>
          {[-0.24, -0.12, 0, 0.12, 0.24].map((x) => (
            <mesh key={x} position={[x, 0.18, 0.15]} castShadow>
              <cylinderGeometry args={[0.022, 0.025, 0.26, 16]} />
              <Matte color="#F5F5F4" roughness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, 0.17, -0.05]} castShadow>
            <boxGeometry args={[0.56, 0.24, 0.26]} />
            <Matte color="#E7E5E4" />
          </mesh>
          <mesh position={[0, 0.36, 0.02]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.62, 3]} />
            <Matte color="#F5F5F4" />
          </mesh>
        </group>
      );
    case "barracks":
      return (
        <group>
          {[-0.12, 0.12].map((z) => (
            <group key={z} position={[-0.05, 0, z]}>
              <mesh position={[0, 0.07, 0]} castShadow>
                <boxGeometry args={[0.48, 0.14, 0.16]} />
                <Matte color="#6B7A4B" />
              </mesh>
              <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.48, 16, 1, false, 0, Math.PI]} />
                <Metal color="#7C8466" roughness={0.6} />
              </mesh>
            </group>
          ))}
          <mesh position={[0.3, 0.2, -0.28]} castShadow>
            <boxGeometry args={[0.08, 0.4, 0.08]} />
            <Wood color="#5B4630" />
          </mesh>
          <mesh position={[0.3, 0.42, -0.28]} castShadow>
            <boxGeometry args={[0.14, 0.06, 0.14]} />
            <Matte color="#4B5534" />
          </mesh>
        </group>
      );
    case "solar":
      return (
        <group>
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => (
              <group key={`${r}${c}`} position={[-0.2 + c * 0.26, 0.07, -0.2 + r * 0.16]} rotation={[-0.5, 0, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.22, 0.01, 0.12]} />
                  <meshPhysicalMaterial color="#1E3A8A" roughness={0.15} metalness={0.4} clearcoat={1} />
                </mesh>
              </group>
            ))
          )}
          <Tree p={[0.3, 0, -0.2]} />
          <Tree p={[0.32, 0, 0.05]} s={0.8} />
          <Tree p={[0.28, 0, 0.27]} s={1.1} />
        </group>
      );
  }
}

function Plot({ id, i, built, rejected }: { id: SdgProject; i: number; built: boolean; rejected: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const s = THREE.MathUtils.lerp(g.current.scale.x, built && !rejected ? 1 : 0.001, 0.12);
    g.current.scale.setScalar(s);
    g.current.visible = s > 0.01;
  });
  return (
    <group position={plotPos(i)}>
      <RoundedBox args={[PLOT, 0.03, PLOT]} radius={0.01} smoothness={2} receiveShadow>
        <Matte color={built && !rejected ? "#BFD8A8" : "#E7DFC9"} />
      </RoundedBox>
      <group position={[0, 0.015, 0]}>
        <group ref={g} scale={0.001}>
          <Model id={id} />
        </group>
      </group>
      <Label3D text={SDG_PROJECTS[id].name} position={[0, 0.02, PLOT / 2 - 0.07]} rotation={[-Math.PI / 2, 0, 0]} size={[0.8, 0.1]} style={{ bg: "#FFFFFFDD", fg: "#334155", scale: 0.42 }} />
    </group>
  );
}

function ReviewTray({ rejected }: { rejected: SdgProject | null }) {
  return (
    <group position={[0, 0.06, 1.25]}>
      <RoundedBox args={[1.3, 0.08, 0.5]} radius={0.03} smoothness={3} castShadow receiveShadow>
        <Plastic color="#7C3AED" roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.18, 0.38]} />
        <Matte color="#EDE9FE" />
      </mesh>
      <Label3D text="Review tray · NOT an SDG theme" position={[0, 0.06, -0.33]} rotation={[-0.6, 0, 0]} size={[1.2, 0.13]} style={{ bg: "#FFFFFF", fg: "#5B21B6", border: "#C4B5FD", scale: 0.4 }} />
      {rejected && (
        <group position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, -0.06]}>
          <mesh>
            <planeGeometry args={[0.8, 0.26]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
          </mesh>
          <Label3D text={SDG_PROJECTS[rejected].label} position={[0, 0, 0.002]} size={[0.76, 0.2]} style={{ bg: null, fg: "#1F2937", scale: 0.4 }} />
        </group>
      )}
    </group>
  );
}

export function IgkoQ04Sdg(props: ActivityComponentProps) {
  const play = useInvestigation<SdgWorld>(props, sdgInitial, evaluateSdg);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [board, setBoard] = React.useState(false);
  const build = (p: SdgProject) => play.patch({ built: world.built.includes(p) ? world.built.filter((x) => x !== p) : [...world.built, p] });
  const reject = (p: SdgProject) => play.patch({ rejected: world.rejected === p ? null : p });

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Sustainable City Builder"
      mission="Build a model city and compare it with the UN's board of 17 goals. Then drop the one project card that is NOT an SDG theme into the review tray."
      icon={Building2}
      live={
        <>
          <Reading label="Plots built" value={`${world.built.filter((b) => b !== world.rejected).length} / ${PROJECTS.length}`} tone="teal" />
          <Reading label="In the review tray" value={world.rejected ? SDG_PROJECTS[world.rejected].label : "empty"} tone="amber" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0, 3.3, 3.6], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, 0.1, 0.25], minDistance: 2, maxDistance: 7, maxPolarAngle: 1.35 }}>
          <Studio shadowScale={9} shadowOpacity={0.4} />
          <Floor color="#EEF1F5" />
          <RoundedBox args={[3.8, 0.1, 3.4]} radius={0.04} smoothness={3} position={[0, 0.05, 0.1]} receiveShadow castShadow>
            <Matte color="#9CA3AF" roughness={0.7} />
          </RoundedBox>
          {PROJECTS.map((p, i) => (
            <Plot key={p} id={p} i={i} built={world.built.includes(p)} rejected={world.rejected === p} />
          ))}
          <ReviewTray rejected={world.rejected} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Build on a plot · tap to build or clear">
            <div className="grid grid-cols-2 gap-1.5">
              {PROJECTS.map((p) => (
                <Chip key={p} active={world.built.includes(p)} disabled={ro} onClick={() => build(p)}>
                  {SDG_PROJECTS[p].name}
                </Chip>
              ))}
            </div>
          </Panel>
          <Panel title="UN goals board">
            <button
              type="button"
              onClick={() => setBoard((b) => !b)}
              className="w-full inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> {board ? "Hide the 17 goals" : "Show the 17 Sustainable Development Goals"}
            </button>
            {board && (
              <ol className="mt-2 grid grid-cols-2 gap-1">
                {GOALS.map(([g, c], i) => (
                  <li key={g} className="rounded-md px-1.5 py-1 text-[9.5px] font-bold leading-tight text-white" style={{ background: c }}>
                    {i + 1}. {g}
                  </li>
                ))}
              </ol>
            )}
          </Panel>
          <AnswerStation title="Review tray" hint="Put the one project card that is NOT a theme of the SDGs in the tray. Tap the same card again to take it back.">
            <div className="grid grid-cols-2 gap-1.5">
              {PROJECTS.map((p) => (
                <Chip key={p} tone="violet" active={world.rejected === p} disabled={ro} onClick={() => reject(p)}>
                  <span className="inline-flex items-center gap-1">
                    <Inbox className="w-3 h-3" /> {SDG_PROJECTS[p].label}
                  </span>
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}

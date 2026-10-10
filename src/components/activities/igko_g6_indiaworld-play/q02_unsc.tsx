"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { Landmark, Archive } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Brass, Wood, Plastic, Matte } from "../igko_g6_scitech-play/models";
import { Flag, IW_BADGE } from "./iwkit";
import { PERMANENT_SEATS, UN_COUNTRIES, unscInitial, unseated, evaluateUnsc, type UnCountry, type UnscWorld } from "./logic";

/**
 * Q2 · Security Council chamber.
 * Investigate: the horseshoe table has fifteen seats; five carry the gold "permanent member"
 * plates. Answer: seat five delegations in the permanent seats. The delegation left
 * standing in the gallery is the student's answer — any of the six can be left out.
 */

const R_OUT = 1.55;
const R_IN = 1.02;
const SWEEP = 0.75 * Math.PI;
const TABLE_Y = 0.74;
const SEATS = 15;
const FIRST_PERMANENT = 5;
const COUNTRIES = Object.keys(UN_COUNTRIES) as UnCountry[];

const seatAngle = (i: number) => -SWEEP + (i / (SEATS - 1)) * 2 * SWEEP;
const polar = (r: number, theta: number, y = 0): [number, number, number] => [r * Math.sin(theta), y, -r * Math.cos(theta)];

function Horseshoe() {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, R_OUT, Math.PI / 2 - SWEEP - 0.08, Math.PI / 2 + SWEEP + 0.08, false);
    s.absarc(0, 0, R_IN, Math.PI / 2 + SWEEP + 0.08, Math.PI / 2 - SWEEP - 0.08, true);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 96 });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group>
      <mesh geometry={geo} position={[0, TABLE_Y - 0.03, 0]} castShadow receiveShadow>
        <Wood color="#C9A574" roughness={0.38} />
      </mesh>
      {/* Modesty panel under the table edge */}
      <mesh position={[0, TABLE_Y / 2, 0]}>
        <cylinderGeometry args={[R_OUT - 0.04, R_OUT - 0.04, TABLE_Y - 0.06, 96, 1, true, Math.PI - SWEEP - 0.08, 2 * SWEEP + 0.16]} />
        <Wood color="#8A6238" />
      </mesh>
    </group>
  );
}

function Chair({ theta, permanent }: { theta: number; permanent: boolean }) {
  const [x, , z] = polar(R_OUT + 0.28, theta);
  return (
    <group position={[x, 0, z]} rotation={[0, Math.PI - theta, 0]}>
      <RoundedBox args={[0.36, 0.08, 0.34]} radius={0.03} smoothness={3} position={[0, 0.46, 0]} castShadow>
        <Plastic color={permanent ? "#1E3A8A" : "#475569"} roughness={0.55} clearcoat={0.2} />
      </RoundedBox>
      <RoundedBox args={[0.36, 0.5, 0.07]} radius={0.03} smoothness={3} position={[0, 0.74, 0.17]} castShadow>
        <Plastic color={permanent ? "#1E3A8A" : "#475569"} roughness={0.55} clearcoat={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.44, 12]} />
        <meshStandardMaterial color="#CBD5E1" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 24]} />
        <meshStandardMaterial color="#94A3B8" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

function SeatPlate({ theta, text, gold }: { theta: number; text: string; gold: boolean }) {
  const [x, , z] = polar(R_OUT - 0.1, theta, 0);
  return (
    <group position={[x, TABLE_Y + 0.07, z]} rotation={[0, -theta, 0]}>
      <mesh rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.012]} />
        {gold ? <Brass /> : <Matte color="#E2E8F0" roughness={0.5} />}
      </mesh>
      <Label3D text={text} position={[0, 0.003, 0.008]} rotation={[-0.35, 0, 0]} size={[0.28, 0.07]} style={{ bg: null, fg: gold ? "#3B2A0F" : "#475569", scale: 0.42 }} />
    </group>
  );
}

function Scene({ world, ro, onGallery }: { world: UnscWorld; ro: boolean; onGallery: (c: UnCountry) => void }) {
  const waiting = unseated(world);
  return (
    <>
      <Studio shadowScale={12} shadowOpacity={0.35} />
      {/* Chamber floor and the raised dais */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial color="#E9E4DA" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
        <circleGeometry args={[2.35, 64]} />
        <meshStandardMaterial color="#C7D2E3" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[0.55, 0.62, 64]} />
        <meshStandardMaterial color="#D9B25A" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* The mural wall */}
      <mesh position={[0, 1.6, -3.2]} receiveShadow>
        <planeGeometry args={[7, 3.2]} />
        <meshStandardMaterial color="#F3EBDD" roughness={0.9} />
      </mesh>
      <group position={[0, 2.25, -3.18]}>
        <mesh>
          <circleGeometry args={[0.42, 64]} />
          <meshStandardMaterial color="#5B92E5" roughness={0.6} />
        </mesh>
        {[0.12, 0.22, 0.32].map((r) => (
          <mesh key={r} position={[0, 0, 0.002]}>
            <ringGeometry args={[r - 0.012, r, 64]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
        <Label3D text="SECURITY COUNCIL" position={[0, -0.62, 0.002]} size={[1.6, 0.2]} style={{ bg: null, fg: "#1E3A8A", scale: 0.55 }} />
      </group>
      <Horseshoe />
      {Array.from({ length: SEATS }, (_, i) => {
        const theta = seatAngle(i);
        const permanent = i >= FIRST_PERMANENT && i < FIRST_PERMANENT + PERMANENT_SEATS;
        const who = permanent ? world.seats[i - FIRST_PERMANENT] : null;
        return (
          <group key={i}>
            <Chair theta={theta} permanent={permanent} />
            <SeatPlate theta={theta} gold={permanent} text={permanent ? (who ? UN_COUNTRIES[who].name : "Permanent member") : "Elected member"} />
            {who && (
              <group position={polar(R_OUT - 0.32, theta, TABLE_Y + 0.03)}>
                <Flag id={who} height={0.36} size={0.2} />
              </group>
            )}
          </group>
        );
      })}
      {/* Gallery: delegations waiting to be seated */}
      {COUNTRIES.map((c, i) => {
        const x = -1.75 + i * 0.7;
        const here = waiting.includes(c);
        return (
          <group key={c} position={[x, 0, 2.55]} visible={here}>
            <group
              onClick={(e) => {
                if (ro || !here) return;
                e.stopPropagation();
                onGallery(c);
              }}
            >
              <Flag id={c} height={0.95} size={0.4} />
            </group>
            <Label3D text={UN_COUNTRIES[c].name} position={[0, 1.15, 0]} size={[0.62, 0.12]} billboard style={{ bg: "#FFFFFF", fg: "#0F172A", border: "#CBD5E1", scale: 0.42 }} />
          </group>
        );
      })}
    </>
  );
}

export function IgkoQ02Unsc(props: ActivityComponentProps) {
  const play = useInvestigation<UnscWorld>(props, unscInitial, evaluateUnsc);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [archive, setArchive] = React.useState(false);
  const seated = (c: UnCountry) => world.seats.includes(c);
  const full = world.seats.every(Boolean);

  const toggle = (c: UnCountry) => {
    if (seated(c)) play.patch({ seats: world.seats.map((s) => (s === c ? null : s)) });
    else {
      const free = world.seats.indexOf(null);
      if (free < 0) return;
      play.patch({ seats: world.seats.map((s, i) => (i === free ? c : s)) });
    }
  };

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Security Council Chamber"
      mission="Seat delegations in the five gold permanent-member seats. When all five are taken, the delegation left in the gallery is your answer."
      icon={Landmark}
      live={
        <>
          <Reading label="Permanent seats filled" value={`${world.seats.filter(Boolean).length} / ${PERMANENT_SEATS}`} tone="teal" />
          <Reading label="Left in the gallery" value={full ? unseated(world).map((c) => UN_COUNTRIES[c].name).join(", ") : "—"} tone="amber" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0, 3.1, 5.2], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, 0.7, 0.2], minDistance: 2.5, maxDistance: 9, maxPolarAngle: 1.4 }}>
          <Scene world={world} ro={ro} onGallery={toggle} />
        </Lab3D>

        <div className="space-y-3">
          <AnswerStation title="Seat the permanent members" hint="Tap a delegation to walk it to the next free gold seat; tap again to return it to the gallery. The one you leave out is your answer.">
            <div className="grid grid-cols-2 gap-1.5">
              {COUNTRIES.map((c) => (
                <Chip key={c} tone="violet" active={seated(c)} disabled={ro || (!seated(c) && full)} onClick={() => toggle(c)}>
                  {seated(c) ? "🪑 " : "🚶 "}
                  {UN_COUNTRIES[c].name}
                </Chip>
              ))}
            </div>
            <ol className="mt-2 grid grid-cols-5 gap-1 text-center">
              {world.seats.map((s, i) => (
                <li key={i} className={`rounded-md border px-1 py-1 text-[9.5px] font-bold ${s ? "border-amber-300 bg-amber-50 text-amber-900" : "border-dashed border-slate-300 text-slate-400"}`}>
                  {s ? UN_COUNTRIES[s].name.replace("United ", "U. ") : `Seat ${i + 1}`}
                </li>
              ))}
            </ol>
          </AnswerStation>
          <Panel title="Chamber archive">
            <button
              type="button"
              onClick={() => setArchive((a) => !a)}
              className="w-full inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" /> {archive ? "Close the archive drawer" : "Open the archive drawer"}
            </button>
            {archive && (
              <ul className="mt-2 list-disc pl-5 space-y-1 text-[11.5px] text-slate-700">
                <li>The Council first met in January 1946, after the Second World War.</li>
                <li>Its permanent seats went to the major Allied powers that had won that war.</li>
                <li>Each permanent member can veto a resolution; the other ten members are elected for two years.</li>
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </Investigation>
  );
}

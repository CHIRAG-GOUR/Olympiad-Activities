"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import { Ship, Anchor, NotebookPen } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor, Matte, Plastic, Metal } from "../igko_g6_scitech-play/models";
import { FlatMap, Pin, llToMap, type MapFrame } from "./geo";
import { BriefingTable, IW_BADGE } from "./iwkit";
import { PASSAGES, ROUTES, shipInitial, evaluateShip, type Passage, type RouteId, type ShipWorld } from "./logic";

/**
 * Q6 · Shipping navigator.
 * Investigate: plan and sail three voyages from Mumbai to London on a world chart; each
 * one's distance and sailing time are logged. Answer: write the major landmark a ship on
 * the shortest route passes through into the voyage log.
 */

type LL = [number, number];
const TABLE_Y = 0.78;
const FRAME: MapFrame = { lon: [-100, 260], lat: [-58, 72], width: 4.3, y: TABLE_Y + 0.045 };
const wrapLon = (lon: number) => ((((lon + 100) % 360) + 360) % 360) - 100;

/** Waypoints in continuous longitude (east of 260° continues past the chart's seam). */
const PATHS: Record<RouteId, LL[]> = {
  suez: [[72.8, 18.9], [65, 16], [52, 13], [43.4, 12.6], [38, 20], [34.5, 27], [32.5, 29.9], [32.3, 31.5], [25, 34], [12, 37.3], [0, 37.5], [-5.6, 36], [-9.5, 38], [-9.8, 43], [-5, 48.5], [-1, 50.2], [1.3, 51.2], [0.3, 51.5]],
  cape: [[72.8, 18.9], [66, 5], [55, -15], [40, -30], [27, -36.5], [18.4, -35.5], [10, -25], [0, -5], [-15, 10], [-19, 25], [-12, 38], [-9.8, 44], [-5, 48.5], [-1, 50.2], [1.3, 51.2], [0.3, 51.5]],
  panama: [[72.8, 18.9], [77, 7], [82, 5.5], [95, 6], [99, 4.5], [103.8, 1.3], [110, 8], [122, 18], [140, 22], [180, 22], [220, 15], [255, 10], [275, 7.5], [280.4, 9.1], [284, 12], [290, 18], [300, 28], [320, 40], [345, 47], [354, 49.5], [358.7, 50.2], [361.3, 51.2], [360.3, 51.5]],
};
const MARKS: Record<Passage, LL> = { suez: [32.4, 30.6], gibraltar: [-5.6, 36], malacca: [100.5, 3], panama: [-79.6, 9.1], cape: [18.5, -34.4] };
const ROUTE_COLORS: Record<RouteId, string> = { suez: "#0EA5E9", cape: "#F59E0B", panama: "#A855F7" };
const ROUTE_IDS = Object.keys(ROUTES) as RouteId[];
const KNOTS = 20;
const days = (nm: number) => (nm / (KNOTS * 24)).toFixed(1);

function samplePath(path: LL[]) {
  // Dense samples in continuous longitude, with cumulative length for even motion.
  const pts: LL[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [a, b] = [path[i], path[i + 1]];
    const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2));
    for (let k = 0; k < n; k++) pts.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  pts.push(path[path.length - 1]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, total: cum[cum.length - 1] };
}

function RouteLine({ id, sailed, active }: { id: RouteId; sailed: boolean; active: boolean }) {
  const segments = useMemo(() => {
    const { pts } = samplePath(PATHS[id]);
    const out: [number, number, number][][] = [[]];
    pts.forEach((p, i) => {
      const lon = wrapLon(p[0]);
      if (i && Math.abs(lon - wrapLon(pts[i - 1][0])) > 180) out.push([]);
      out[out.length - 1].push(llToMap([lon, p[1]], FRAME, 0.012));
    });
    return out.filter((s) => s.length > 1);
  }, [id]);
  return (
    <>
      {segments.map((s, i) => (
        <Line key={i} points={s} color={ROUTE_COLORS[id]} lineWidth={active ? 3.5 : 2} dashed={!sailed} dashSize={0.04} gapSize={0.03} transparent opacity={active || sailed ? 1 : 0.55} />
      ))}
    </>
  );
}

function Freighter() {
  return (
    <group scale={0.55}>
      <RoundedBox args={[0.34, 0.06, 0.09]} radius={0.02} smoothness={3} position={[0, 0.03, 0]} castShadow>
        <Plastic color="#1F2937" />
      </RoundedBox>
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[0.345, 0.025, 0.092]} />
        <Matte color="#B91C1C" />
      </mesh>
      {[-0.1, -0.03, 0.04].map((x, i) => (
        <mesh key={x} position={[x, 0.08, 0]} castShadow>
          <boxGeometry args={[0.06, 0.04, 0.075]} />
          <Plastic color={["#2563EB", "#F59E0B", "#10B981"][i]} />
        </mesh>
      ))}
      <mesh position={[0.12, 0.1, 0]} castShadow>
        <boxGeometry args={[0.05, 0.08, 0.07]} />
        <Matte color="#F8FAFC" roughness={0.5} />
      </mesh>
      <mesh position={[0.125, 0.16, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.05, 8]} />
        <Metal color="#94A3B8" />
      </mesh>
    </group>
  );
}

function Voyage({ id, sailing, done, onArrive }: { id: RouteId; sailing: boolean; done: boolean; onArrive: () => void }) {
  const g = useRef<THREE.Group>(null);
  const t = useRef(done ? 1 : 0);
  const sampled = useMemo(() => samplePath(PATHS[id]), [id]);
  const duration = ROUTES[id].nm / 1800;
  const arrived = useRef(false);
  useEffect(() => {
    if (!sailing) return;
    t.current = 0;
    arrived.current = false;
  }, [sailing]);
  const at = (d: number): LL => {
    const { pts, cum } = sampled;
    let i = cum.findIndex((c) => c >= d);
    if (i <= 0) return pts[0];
    const f = (d - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]);
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
  };
  useFrame((_, dt) => {
    if (!g.current) return;
    if (sailing) t.current = Math.min(1, t.current + dt / duration);
    const d = t.current * sampled.total;
    const p = at(d);
    const q = at(Math.min(sampled.total, d + 0.5));
    const a = llToMap([wrapLon(p[0]), p[1]], FRAME, 0.012);
    const b = llToMap([wrapLon(q[0]), q[1]], FRAME, 0.012);
    g.current.position.set(...a);
    if (Math.abs(b[0] - a[0]) < 1) g.current.rotation.y = Math.atan2(-(b[2] - a[2]), b[0] - a[0]) + Math.PI;
    if (sailing && t.current >= 1 && !arrived.current) {
      arrived.current = true;
      onArrive();
    }
  });
  return (
    <group ref={g}>
      <Freighter />
    </group>
  );
}

export function IgkoQ06Ship(props: ActivityComponentProps) {
  const play = useInvestigation<ShipWorld>(props, shipInitial, evaluateShip);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [sailing, setSailing] = useState(false);
  const route = world.route;

  const choose = (r: RouteId) => {
    setSailing(false);
    play.patch({ route: r });
  };
  const arrive = () => {
    setSailing(false);
    if (route && !world.sailed.includes(route)) play.patch({ sailed: [...world.sailed, route] });
  };

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Shipping Navigator"
      mission="Plan and sail voyages from Mumbai to London and compare their distances. Then log the major landmark that a ship on the shortest route passes through."
      icon={Ship}
      live={
        <>
          <Reading label="Route planned" value={route ? ROUTES[route].label : "none"} tone="teal" />
          <Reading label="Distance" value={route ? `${ROUTES[route].nm.toLocaleString()} nm` : "—"} />
          <Reading label={`Days at ${KNOTS} knots`} value={route ? days(ROUTES[route].nm) : "—"} tone="amber" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Lab3D camera={{ position: [0, 3.6, 2.6], fov: 44 }} readOnly={readOnly} orbit={{ target: [0, TABLE_Y, 0], minDistance: 1.4, maxDistance: 6.5, maxPolarAngle: 1.3 }}>
          <Studio shadowScale={10} shadowOpacity={0.3} />
          <Floor color="#E9EEF3" />
          <BriefingTable size={[4.7, 2.1]} height={TABLE_Y} inlay="#203A5C" />
          <FlatMap frame={FRAME} />
          <Pin at={[72.8, 18.9]} frame={FRAME} color="#F97316" />
          <Pin at={[-0.1, 51.5]} frame={FRAME} color="#2563EB" />
          <Label3D text="Mumbai" position={llToMap([72.8, 18.9], FRAME, 0.34)} size={[0.36, 0.09]} billboard style={{ bg: "#FFFFFF", fg: "#9A3412", border: "#FDBA74", scale: 0.48 }} />
          <Label3D text="London" position={llToMap([-0.1, 51.5], FRAME, 0.34)} size={[0.36, 0.09]} billboard style={{ bg: "#FFFFFF", fg: "#1E3A8A", border: "#93C5FD", scale: 0.48 }} />
          {(Object.keys(MARKS) as Passage[]).map((p) => (
            <Label3D key={p} text={PASSAGES[p].name} position={llToMap(MARKS[p], FRAME, 0.07)} rotation={[-Math.PI / 2, 0, 0]} size={[0.44, 0.07]} style={{ bg: "#FFFFFFE6", fg: "#334155", scale: 0.48 }} />
          ))}
          {ROUTE_IDS.map((r) => (route === r || world.sailed.includes(r) ? <RouteLine key={r} id={r} sailed={world.sailed.includes(r)} active={route === r} /> : null))}
          {route && <Voyage key={route} id={route} sailing={sailing} done={world.sailed.includes(route)} onArrive={arrive} />}
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Voyage planner">
            <div className="grid gap-1.5">
              {ROUTE_IDS.map((r) => (
                <Chip key={r} active={route === r} disabled={ro} onClick={() => choose(r)}>
                  <span className="inline-flex w-full items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: ROUTE_COLORS[r] }} /> {ROUTES[r].label}
                    </span>
                    {world.sailed.includes(r) && <span className="font-mono text-[10px] opacity-80">{ROUTES[r].nm.toLocaleString()} nm</span>}
                  </span>
                </Chip>
              ))}
            </div>
            <button
              type="button"
              disabled={ro || !route || sailing}
              onClick={() => setSailing(true)}
              className="mt-2 w-full h-9 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Anchor className="w-4 h-4" /> {sailing ? "Under way…" : "Set sail"}
            </button>
            {world.sailed.length > 0 && (
              <ul className="mt-2 space-y-0.5 text-[11px] text-slate-700">
                {world.sailed.map((r) => (
                  <li key={r}>
                    ✓ {ROUTES[r].label}: {ROUTES[r].nm.toLocaleString()} nm · {days(ROUTES[r].nm)} days
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <AnswerStation title="Voyage log · key landmark" hint="Write in the major landmark that a ship on the shortest Mumbai–London route passes through.">
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(PASSAGES) as Passage[]).map((p) => (
                <Chip key={p} tone="violet" active={world.logged === p} disabled={ro} onClick={() => play.patch({ logged: world.logged === p ? null : p })}>
                  <span className="inline-flex items-center gap-1">
                    <NotebookPen className="w-3 h-3" /> {PASSAGES[p].name}
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

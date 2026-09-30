"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { motion } from "framer-motion";
import { ChartPie, Box, Scissors, CircleDot, Factory, Columns3, Bug, FlaskConical, MessageSquareText, Triangle, Ruler, Cuboid, FlipHorizontal2, Hexagon } from "lucide-react";
import { Question } from "@/types/question";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, reduceFraction } from "../imo6a/shared";
import { usePlay, cfg, Play } from "../imo6a-play/engine";
import { PlayShell, PlayShellProps, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Label3D, Floor } from "../imo6a-play/three";
import { clientToSvg } from "../imo6a-play/svgPoint";

/* ── shared chrome ─────────────────────────────────────────── */

type ShellProps<W> = { play: Play<W>; question?: Question } & Omit<
  PlayShellProps,
  "derived" | "locked" | "touched" | "readOnly" | "onSubmit" | "onReset" | "question"
>;

function Shell<W>({ play, question, ...rest }: ShellProps<W>) {
  return (
    <PlayShell
      {...rest}
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
    />
  );
}

type Pt = [number, number];
const polyPath = (pts: Pt[]) => `M ${pts.map((p) => p.join(" ")).join(" L ")} Z`;
const shoelace = (pts: Pt[]) => Math.abs(pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0)) / 2;
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const listText = (ids: (string | number)[]) =>
  ids.length <= 1 ? ids.join("") : `${ids.slice(0, -1).join(", ")} and ${ids[ids.length - 1]}`;

/* ── piece geometry for "figure made of equal parts" questions ── */

/** Equal pieces of a named figure, in a 100 × 100 box. */
function piecesOf(shape: string, parts: number): Pt[][] {
  if (shape === "circle") {
    return Array.from({ length: parts }, (_, i) => {
      const a0 = (i / parts) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 1) / parts) * Math.PI * 2 - Math.PI / 2;
      const arc: Pt[] = Array.from({ length: 9 }, (_, k) => {
        const a = a0 + ((a1 - a0) * k) / 8;
        return [50 + 42 * Math.cos(a), 50 + 42 * Math.sin(a)];
      });
      return [[50, 50], ...arc];
    });
  }
  if (shape === "grid") {
    const rows = parts % 4 === 0 && parts > 8 ? 3 : parts >= 6 ? 2 : 1;
    const cols = Math.ceil(parts / rows);
    const cw = 84 / cols;
    const ch = Math.min(cw, 84 / rows);
    const top = 50 - (ch * rows) / 2;
    return Array.from({ length: parts }, (_, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const x = 8 + c * cw;
      const y = top + r * ch;
      return [[x, y], [x + cw, y], [x + cw, y + ch], [x, y + ch]] as Pt[];
    });
  }
  if (shape === "triangle") {
    // n rows of small triangles: parts = rows²
    const rows = Math.round(Math.sqrt(parts));
    const s = 80 / rows;
    const P = (r: number, c: number): Pt => [50 + (c - r / 2) * s, 12 + r * s * 0.95];
    const out: Pt[][] = [];
    for (let k = 0; k < rows; k++) {
      for (let c = 0; c <= k; c++) {
        out.push([P(k, c), P(k + 1, c), P(k + 1, c + 1)]);
        if (c < k) out.push([P(k, c), P(k, c + 1), P(k + 1, c + 1)]);
      }
    }
    return out;
  }
  if (shape === "staircase") {
    // rows of 4, 3, 2, 1 from the bottom
    const out: Pt[][] = [];
    const s = 19;
    let row = 0;
    let left = parts;
    for (let n = 4; n >= 1 && left > 0; n--, row++) {
      for (let c = 0; c < n && left > 0; c++, left--) {
        const x = 12 + c * s;
        const y = 88 - (row + 1) * s;
        out.push([[x, y], [x + s, y], [x + s, y + s], [x, y + s]]);
      }
    }
    return out;
  }
  // strips
  const w = 84 / parts;
  return Array.from({ length: parts }, (_, i) => [[8 + i * w, 25], [8 + (i + 1) * w, 25], [8 + (i + 1) * w, 75], [8 + i * w, 75]] as Pt[]);
}

const spreadShaded = (parts: number, shaded: number) => Array.from({ length: shaded }, (_, i) => Math.round((i * parts) / shaded));

interface FigSpec {
  parts: number;
  shaded: number | number[];
  shape: string;
}
function FigureSvg({ spec, tallied, onTap, big, disabled }: { spec: FigSpec; tallied: number[]; onTap?: (i: number) => void; big?: boolean; disabled?: boolean }) {
  const pieces = piecesOf(spec.shape, spec.parts);
  const shaded = Array.isArray(spec.shaded) ? spec.shaded : spreadShaded(spec.parts, spec.shaded);
  return (
    <svg viewBox="0 0 100 100" className={big ? "w-full max-h-64" : "w-full h-20"}>
      {pieces.map((pts, i) => {
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        return (
          <g key={i} onClick={() => !disabled && onTap?.(i)} style={{ cursor: onTap && !disabled ? "pointer" : undefined }}>
            <path d={polyPath(pts)} fill={shaded.includes(i) ? "#8b5cf6" : "#ffffff"} stroke="#312e81" strokeWidth={big ? 0.8 : 1.4} />
            {tallied.includes(i) && big && (
              <text x={cx} y={cy + 2.5} fontSize={7} fontWeight={900} textAnchor="middle" fill={shaded.includes(i) ? "#fff" : "#16a34a"}>
                ✓
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── solids: a generic right prism, for Q17 and Q31 ─────────── */

type V3 = [number, number, number];
function prism(n: number, R: number, H: number, phase = 0) {
  const t = (i: number) => phase + (i / n) * Math.PI * 2;
  const bottom: V3[] = Array.from({ length: n }, (_, i) => [R * Math.cos(t(i)), 0, R * Math.sin(t(i))]);
  const top: V3[] = bottom.map(([x, , z]) => [x, H, z]);
  const faces: { name: string; pts: V3[] }[] = [
    { name: "base", pts: bottom },
    { name: "top", pts: top },
    ...bottom.map((b, i) => ({ name: `side ${i + 1}`, pts: [b, bottom[(i + 1) % n], top[(i + 1) % n], top[i]] })),
  ];
  const verts = [...bottom, ...top];
  const edges: [V3, V3][] = [
    ...bottom.map((b, i) => [b, bottom[(i + 1) % n]] as [V3, V3]),
    ...top.map((b, i) => [b, top[(i + 1) % n]] as [V3, V3]),
    ...bottom.map((b, i) => [b, top[i]] as [V3, V3]),
  ];
  return { faces, verts, edges, center: [0, H / 2, 0] as V3 };
}

function useFaceGeometry(pts: V3[]) {
  return useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos: number[] = [];
    for (let i = 1; i < pts.length - 1; i++) pos.push(...pts[0], ...pts[i], ...pts[i + 1]);
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }, [pts]);
}

const centroid = (pts: V3[]): V3 => [0, 1, 2].map((k) => pts.reduce((s, p) => s + p[k], 0) / pts.length) as V3;

function Face({ pts, center, explode, painted, color, onTap, label }: { pts: V3[]; center: V3; explode: number; painted: boolean; color: string; onTap?: () => void; label?: string }) {
  const geo = useFaceGeometry(pts);
  const c = centroid(pts);
  const dir = new THREE.Vector3(c[0] - center[0], c[1] - center[1], c[2] - center[2]).normalize().multiplyScalar(explode);
  return (
    <group position={[dir.x, dir.y, dir.z]}>
      <mesh
        geometry={geo}
        castShadow
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (e.delta > 6) return;
          e.stopPropagation();
          onTap?.();
        }}
      >
        <meshStandardMaterial color={painted ? color : "#f8fafc"} side={THREE.DoubleSide} transparent opacity={0.94} />
        <Edges color="#312e81" />
      </mesh>
      {label && <Label3D text={label} position={[c[0] * 1.02, c[1], c[2] * 1.02]} size={[0.42, 0.42]} billboard style={{ bg: null, fg: "#1e1b4b" }} />}
    </group>
  );
}

/** Holds a solid of height H on the turntable: spun about its axis, optionally turned
 *  upside down about its middle, and lifted so exploded faces stay above the floor. */
function Turntable({ H, spin, flipped, lift = 0, children }: { H: number; spin: number; flipped: boolean; lift?: number; children: React.ReactNode }) {
  return (
    <group position={[0, H / 2 + 0.05 + lift, 0]} rotation={[flipped ? Math.PI : 0, spin, 0]}>
      <group position={[0, -H / 2, 0]}>{children}</group>
    </group>
  );
}

function TurntableControls({ n, spin, setSpin, flipped, setFlipped }: { n: number; spin: number; setSpin: (v: number) => void; flipped: boolean; setFlipped: (v: boolean) => void }) {
  return (
    <>
      <Btn tone="sky" onClick={() => setSpin(spin - (Math.PI * 2) / n)}>
        ⟲ Turn the table
      </Btn>
      <Btn tone="sky" onClick={() => setSpin(spin + (Math.PI * 2) / n)}>
        Turn the table ⟳
      </Btn>
      <Btn tone="sky" active={flipped} onClick={() => setFlipped(!flipped)}>
        ⇅ {flipped ? "Stand it back up" : "Turn it upside down"}
      </Btn>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — Face Painter (3D)
   A pentagonal prism sits on the turntable. The student orbits it, pulls the faces apart
   with the explode slider so hidden faces come into view, and paints each face once. The
   paint counter is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface PaintWorld {
  painted: number[];
  explode: number;
}

export function B17FacePainter({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const solid = cfg<string>(question, "solid", "pentagonal-prism");
  const n = solid.startsWith("pentagonal") ? 5 : solid.startsWith("hexagonal") ? 6 : solid.startsWith("square") ? 4 : 3;
  const H = 1.5;
  const P = useMemo(() => prism(n, 1.1, H, -Math.PI / 2), [n]);
  const [spin, setSpin] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const play = usePlay<PaintWorld>({
    question,
    initial: { painted: [], explode: 0 },
    derive: (w) =>
      !w.painted.length ? { note: "Tap a face to paint it. Paint every face exactly once." } : { value: `${w.painted.length} face${w.painted.length === 1 ? "" : "s"} painted`, optionId: matchNumber(question, w.painted.length) },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const hues = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#fb923c", "#f87171", "#2dd4bf", "#c084fc"];

  return (
    <Shell
      play={play}
      question={question}
      title="Face Painter"
      mission="Turn the table, tip the solid upside down, or drag the empty space to look round it. Slide the faces apart if it helps. Tap each flat face to paint it (tap again to wipe it) and paint every face exactly once — the counter is your answer."
      icon={Box}
      dim="3D"
      submitLabel="Submit the face count"
      live={
        <>
          <Gauge label="Faces painted" value={w.painted.length} tone="violet" />
          <Gauge label="Still white" value={P.faces.length - w.painted.length > 0 ? "some faces" : "none"} tone={P.faces.length === w.painted.length ? "emerald" : "amber"} />
          <Gauge label="Explode" value={`${Math.round(w.explode * 100)}%`} />
        </>
      }
    >
      <Stage3D height={320} camera={{ position: [3.4, 3.4, 3.8], fov: 44 }} orbitTarget={[0, 1, 0]} readOnly={play.readOnly}>
        <Floor />
        <Turntable H={H} spin={spin} flipped={flipped} lift={w.explode * 1.2}>
          {P.faces.map((f, i) => (
            <Face
              key={i}
              pts={f.pts}
              center={P.center}
              explode={w.explode * 1.2}
              painted={w.painted.includes(i)}
              color={hues[w.painted.indexOf(i) % hues.length] ?? hues[0]}
              label={w.painted.includes(i) ? String(w.painted.indexOf(i) + 1) : undefined}
              onTap={() => !play.readOnly && play.set((p) => ({ ...p, painted: toggle(p.painted, i) }))}
            />
          ))}
        </Turntable>
      </Stage3D>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <label className="flex items-center gap-2 text-xs font-bold">
          Pull faces apart
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={w.explode}
            disabled={play.readOnly}
            onChange={(e) => play.patch({ explode: Number(e.target.value) })}
            className="accent-violet-600"
          />
        </label>
        <TurntableControls n={n} spin={spin} setSpin={setSpin} flipped={flipped} setFlipped={setFlipped} />
        <Btn tone="slate" disabled={play.readOnly || !w.painted.length} onClick={() => play.patch({ painted: [] })}>
          Wipe all paint
        </Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — Perimeter Ant (2D)
   An ant stands at one corner of the figure. The student taps an edge next to the ant to
   walk it; the odometer adds its length. The perimeter is what the odometer reads when
   the ant has walked every edge and is home again.
   ══════════════════════════════════════════════════════════════════════ */

interface AntWorld {
  at: number;
  walked: number[];
}

export function B25PerimeterAnt({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const outline = cfg<Pt[]>(question, "outline", []);
  const n = outline.length;
  const len = (i: number) => Math.hypot(outline[(i + 1) % n][0] - outline[i][0], outline[(i + 1) % n][1] - outline[i][1]);
  const play = usePlay<AntWorld>({
    question,
    initial: { at: 0, walked: [] },
    derive: (w) => {
      const total = w.walked.reduce((s, i) => s + len(i), 0);
      if (w.walked.length < n || w.at !== 0) return { note: `Walk every edge and come home (${w.walked.length}/${n} edges, odometer ${total} cm).` };
      return { value: `${total} cm`, optionId: matchNumber(question, total) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const xs = outline.map((p) => p[0]);
  const ys = outline.map((p) => p[1]);
  const W = Math.max(...xs, 1);
  const H = Math.max(...ys, 1);
  const S = 86 / Math.max(W, H);
  const X = (x: number) => 7 + x * S;
  const Y = (y: number) => 7 + (H - y) * S;
  const total = w.walked.reduce((s, i) => s + len(i), 0);
  const ant = outline[w.at] ?? [0, 0];

  return (
    <Shell
      play={play}
      question={question}
      title="Perimeter Ant"
      mission="Tap an edge that touches the ant to make it walk that edge. It can't walk an edge twice. Walk all the way round and back to the start — the odometer is the perimeter."
      icon={Bug}
      dim="2D"
      submitLabel="Submit the odometer reading"
      live={
        <>
          <Gauge label="Odometer" value={`${total} cm`} tone="violet" />
          <Gauge label="Edges walked" value={`${w.walked.length}/${n}`} />
          <Gauge label="Home?" value={w.at === 0 && w.walked.length ? "yes" : "no"} tone={w.at === 0 && w.walked.length === n ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="rounded-2xl bg-lime-50 border-2 border-lime-200 p-2">
        <svg viewBox={`0 0 100 ${H * S + 14}`} className="w-full max-h-80">
          <path d={polyPath(outline.map(([x, y]) => [X(x), Y(y)]))} fill="#ecfccb" />
          {outline.map((p, i) => {
            const q = outline[(i + 1) % n];
            const done = w.walked.includes(i);
            const reachable = !done && (i === w.at || (i + 1) % n === w.at);
            const mx = (X(p[0]) + X(q[0])) / 2;
            const my = (Y(p[1]) + Y(q[1])) / 2;
            return (
              <g
                key={i}
                style={{ cursor: reachable && !play.readOnly ? "pointer" : undefined }}
                onClick={() => {
                  if (!reachable || play.readOnly) return;
                  play.set((s) => ({ at: s.at === i ? (i + 1) % n : i, walked: [...s.walked, i] }));
                }}
              >
                <line x1={X(p[0])} y1={Y(p[1])} x2={X(q[0])} y2={Y(q[1])} stroke="transparent" strokeWidth={6} />
                <line x1={X(p[0])} y1={Y(p[1])} x2={X(q[0])} y2={Y(q[1])} stroke={done ? "#7c3aed" : reachable ? "#f59e0b" : "#65a30d"} strokeWidth={done ? 1.8 : 1.2} strokeDasharray={reachable ? "2 1" : undefined} />
                <text x={mx + (p[1] === q[1] ? 0 : 3.5)} y={my + (p[1] === q[1] ? (p[1] === 0 ? 4 : -1.5) : 1)} fontSize={3.4} fontWeight={900} textAnchor="middle" fill="#1e1b4b">
                  {len(i)} cm
                </text>
              </g>
            );
          })}
          <circle cx={X(outline[0]?.[0] ?? 0)} cy={Y(outline[0]?.[1] ?? 0)} r={2.4} fill="none" stroke="#dc2626" strokeWidth={0.6} />
          <motion.g animate={{ x: X(ant[0]), y: Y(ant[1]) }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
            <text x={0} y={2} fontSize={6} textAnchor="middle">
              🐜
            </text>
          </motion.g>
        </svg>
      </div>
      <Btn tone="slate" className="mt-2" disabled={play.readOnly || !w.walked.length} onClick={() => play.set({ at: 0, walked: [] })}>
        Send the ant home and reset the odometer
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q26 — Percentage Beaker (2D)
   Each figure is poured into the beaker: its shaded pieces become liquid and the beaker
   fills to the shaded share of the figure, marked in percent. Only a poured figure can
   stand on the 40% pedestal, and the figure on the pedestal is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface BeakerWorld {
  poured: string[];
  last: string | null;
  pedestal: string | null;
}

export function B26PercentBeaker({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figures = cfg<Record<string, FigSpec>>(question, "figures", {});
  const ids = Object.keys(figures);
  const pct = (id: string) => {
    const f = figures[id];
    const s = Array.isArray(f.shaded) ? f.shaded.length : f.shaded;
    return (s / f.parts) * 100;
  };
  const target = cfg<number>(question, "targetPercent", 40);
  const [sel, setSel] = useState(ids[0] ?? "A");
  const play = usePlay<BeakerWorld>({
    question,
    initial: { poured: [], last: null, pedestal: null },
    derive: (w) =>
      !w.pedestal ? { note: `Pour the figures, then stand the ${target}% one on the pedestal.` } : { value: `Figure ${w.pedestal} fills ${+pct(w.pedestal).toFixed(1)}%`, optionId: w.pedestal },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const level = w.last ? pct(w.last) : 0;

  return (
    <Shell
      play={play}
      question={question}
      title="Percentage Beaker"
      mission={`Pick a figure and pour it: its shaded pieces fill the beaker to the shaded share of the figure. Compare with the ${target}% line (${target / 100} of the whole). Stand the figure that fills exactly to it on the pedestal.`}
      icon={FlaskConical}
      dim="2D"
      submitLabel="Submit the figure on the pedestal"
      live={
        <>
          <Gauge label="Beaker level" value={w.last ? `${+level.toFixed(1)}% (figure ${w.last})` : "empty"} tone="sky" />
          <Gauge label="Figures poured" value={w.poured.join(", ") || "none"} />
          <Gauge label="Pedestal" value={w.pedestal ? `figure ${w.pedestal}` : "empty"} tone="amber" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3">
        <div className="grid grid-cols-2 gap-2">
          {ids.map((id) => (
            <button key={id} type="button" onClick={() => setSel(id)} className={`rounded-xl border-2 p-1 bg-white ${sel === id ? "border-violet-500 ring-2 ring-violet-200" : "border-slate-200"}`}>
              <FigureSvg spec={figures[id]} tallied={[]} />
              <div className="text-[11px] font-black">
                Figure {id} {w.poured.includes(id) ? "· poured" : ""}
              </div>
            </button>
          ))}
        </div>
        <Bay label="Beaker" tone="violet">
          <div className="flex gap-3 items-end">
            <svg viewBox="0 0 60 110" className="h-56">
              <rect x={10} y={5} width={40} height={100} rx={3} fill="#f8fafc" stroke="#334155" strokeWidth={1.2} />
              <motion.rect x={11} width={38} y={104 - level} height={level} initial={false} animate={{ y: 104 - level, height: level }} transition={{ duration: 0.9 }} fill="#38bdf8" opacity={0.8} />
              {Array.from(new Set([20, 40, 60, 80, 100, target])).map((m) => (
                <g key={m}>
                  <line x1={10} x2={m === target ? 56 : 18} y1={105 - m} y2={105 - m} stroke={m === target ? "#dc2626" : "#475569"} strokeWidth={m === target ? 1 : 0.6} />
                  <text x={m === target ? 57 : 20} y={106 - m} fontSize={5} fontWeight={800} fill={m === target ? "#dc2626" : "#475569"}>
                    {m}%
                  </text>
                </g>
              ))}
            </svg>
            <div className="space-y-2 flex-1">
              <Btn className="w-full" disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, last: sel, poured: p.poured.includes(sel) ? p.poured : [...p.poured, sel] }))}>
                Pour figure {sel}
              </Btn>
              <Btn className="w-full" tone="amber" disabled={play.readOnly || !w.poured.includes(sel)} onClick={() => play.patch({ pedestal: sel })}>
                Stand figure {sel} on the {target}% pedestal
              </Btn>
              {!w.poured.includes(sel) && <p className="text-[11px] font-bold text-slate-500">Pour figure {sel} before it can go on the pedestal.</p>}
            </div>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q27 — Period Reader (2D)
   The digits sit in a row with a comma slot between each pair. The student places the
   commas; the reader names the groups from the right as ones, thousands, lakhs and crores
   and reads the number aloud from the grouping. The reading is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function words(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : "");
  return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${words(n % 100)}` : ""}`;
}
const PERIODS = ["", "thousand", "lakh", "crore"];

function readGrouped(digits: string, commas: boolean[]) {
  const groups: string[] = [];
  let cur = "";
  digits.split("").forEach((d, i) => {
    cur += d;
    if (i < commas.length && commas[i]) {
      groups.push(cur);
      cur = "";
    }
  });
  groups.push(cur);
  if (groups.length > PERIODS.length) return { error: "More groups than periods (ones, thousand, lakh, crore)." };
  if (groups.some((g) => g.length > 3)) return { error: "A group longer than 3 digits can't be read as one period." };
  const rev = [...groups].reverse();
  const parts = rev
    .map((g, i) => ({ v: Number(g), name: PERIODS[i] }))
    .reverse()
    .filter((p) => p.v)
    .map((p) => `${words(p.v)}${p.name ? ` ${p.name}` : ""}`);
  const text = parts.join(" ");
  return { groups, text: text.charAt(0).toUpperCase() + text.slice(1) };
}

interface PeriodWorld {
  commas: boolean[];
}

export function B27PeriodReader({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const digits = String(cfg<number>(question, "number", 0));
  const play = usePlay<PeriodWorld>({
    question,
    initial: { commas: Array(Math.max(0, digits.length - 1)).fill(false) },
    derive: (w) => {
      if (!w.commas.some(Boolean)) return { note: "Place the commas that split the number into periods." };
      const r = readGrouped(digits, w.commas);
      if ("error" in r) return { note: r.error };
      return { value: r.text, optionId: matchText(question, r.text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const r = readGrouped(digits, w.commas);
  const shown = digits.split("").map((d, i) => d + (w.commas[i] ? "," : "")).join("");
  const groupIndex = (() => {
    // which period each digit belongs to, counted from the right
    const g: number[] = [];
    let k = w.commas.filter(Boolean).length;
    digits.split("").forEach((_, i) => {
      g.push(k);
      if (w.commas[i]) k--;
    });
    return g;
  })();
  const tones = ["bg-emerald-100 border-emerald-300", "bg-sky-100 border-sky-300", "bg-amber-100 border-amber-300", "bg-rose-100 border-rose-300", "bg-slate-200 border-slate-400"];

  return (
    <Shell
      play={play}
      question={question}
      title="Period Reader"
      mission="Tap the gaps between digits to place commas. The reader names the groups from the right — ones, thousand, lakh, crore — and reads the number out from your grouping. Group it the Indian way and let it read."
      icon={MessageSquareText}
      dim="2D"
      submitLabel="Submit the reading"
      live={
        <>
          <Gauge label="Written as" value={shown} tone="violet" />
          <Gauge label="Groups (left to right)" value={"groups" in r ? r.groups!.map((g) => g.length).join("-") : "—"} />
        </>
      }
    >
      <div className="flex flex-wrap items-end justify-center gap-0.5 py-3">
        {digits.split("").map((d, i) => (
          <React.Fragment key={i}>
            <div className={`w-11 rounded-xl border-2 text-center py-2 ${tones[Math.min(groupIndex[i], 4)]}`}>
              <div className="font-mono font-black text-2xl">{d}</div>
              <div className="text-[8px] font-black uppercase">{PERIODS[groupIndex[i]] || (groupIndex[i] === 0 ? "ones" : "?")}</div>
            </div>
            {i < digits.length - 1 && (
              <button
                type="button"
                disabled={play.readOnly}
                aria-label={`comma after digit ${i + 1}`}
                onClick={() => play.set((p) => ({ commas: p.commas.map((c, j) => (j === i ? !c : c)) }))}
                className={`w-5 h-14 rounded-md border-2 border-dashed font-black text-xl ${w.commas[i] ? "border-violet-500 text-violet-700 bg-violet-50" : "border-slate-200 text-transparent hover:border-violet-300"}`}
              >
                ,
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      <Bay label="The reader says" tone="violet">
        <p className="text-base font-bold">{"error" in r ? `⚠ ${r.error}` : w.commas.some(Boolean) ? `“${r.text}”` : "…waiting for commas"}</p>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q28 — Triangle Forge (2D)
   Three side sliders forge a triangle and the protractor reads its angles. The student
   logs scalene triangles; each statement is checked against every logged triangle, and
   the answer is the statement that held for all of them.
   ══════════════════════════════════════════════════════════════════════ */

interface ForgeWorld {
  s: [number, number, number];
  log: { s: [number, number, number]; ang: [number, number, number] }[];
}
const anglesOf = ([a, b, c]: [number, number, number]): [number, number, number] | null => {
  if (a + b <= c || a + c <= b || b + c <= a) return null;
  const A = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
  const B = (Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180) / Math.PI;
  return [A, B, 180 - A - B];
};
const eq = (x: number, y: number) => Math.abs(x - y) < 0.05;
const STATEMENTS: { text: string; holds: (g: [number, number, number]) => boolean }[] = [
  { text: "Two angles are equal", holds: (g) => [eq(g[0], g[1]), eq(g[1], g[2]), eq(g[0], g[2])].filter(Boolean).length === 1 },
  { text: "All the angles are equal", holds: (g) => eq(g[0], g[1]) && eq(g[1], g[2]) },
  { text: "All the angles are of different measures", holds: (g) => !eq(g[0], g[1]) && !eq(g[1], g[2]) && !eq(g[0], g[2]) },
];

export function B28TriangleForge({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<ForgeWorld>({
    question,
    initial: { s: [6, 6, 6], log: [] },
    derive: (w) => {
      if (w.log.length < 3) return { note: `Log at least 3 different triangles with three different sides (${w.log.length}/3).` };
      const always = STATEMENTS.filter((st) => w.log.every((l) => st.holds(l.ang)));
      if (always.length !== 1) return { note: always.length ? "Two statements held every time — forge a triangle that tells them apart." : "No statement held every time." };
      return { value: `Held for all ${w.log.length}: “${always[0].text}”`, optionId: matchText(question, always[0].text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const ang = anglesOf(w.s);
  const [a, b, c] = w.s;
  const scalene = a !== b && b !== c && a !== c;
  const dup = w.log.some((l) => [...l.s].sort().join() === [...w.s].sort().join());
  // draw: side c on the floor, apex from a and b
  const cx = (b * b - a * a + c * c) / (2 * c);
  const cy = Math.sqrt(Math.max(0, b * b - cx * cx));
  const span = Math.max(c, cx, c - cx, 1);
  const K = 70 / Math.max(span, cy);
  const P: Pt[] = [[15, 90], [15 + c * K, 90], [15 + cx * K, 90 - cy * K]];

  return (
    <Shell
      play={play}
      question={question}
      title="Triangle Forge"
      mission="Set the three sides with the sliders and read the angles. Log triangles whose three sides are all different, as many as you like. Each statement is tested on every logged triangle — the answer is the one that is true for all of them."
      icon={Triangle}
      dim="2D"
      submitLabel="Submit the statement that always held"
      live={
        <>
          <Gauge label="Sides" value={`${a}, ${b}, ${c}`} tone={scalene ? "emerald" : "amber"} />
          <Gauge label="Angles" value={ang ? ang.map((x) => `${x.toFixed(1)}°`).join(", ") : "not a triangle"} tone="violet" />
          <Gauge label="Logged" value={w.log.length} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <div className="rounded-2xl bg-white border-2 border-slate-200 p-2">
          <svg viewBox="0 0 100 100" className="w-full max-h-64">
            {ang ? (
              <>
                <path d={polyPath(P)} fill="#ede9fe" stroke="#5b21b6" strokeWidth={1} />
                {P.map((p, i) => (
                  <text key={i} x={p[0] + (i === 1 ? -9 : i === 0 ? 2 : -4)} y={p[1] + (i === 2 ? 6 : -2)} fontSize={4} fontWeight={900} fill="#1e1b4b">
                    {ang[i].toFixed(1)}°
                  </text>
                ))}
              </>
            ) : (
              <text x={50} y={50} textAnchor="middle" fontSize={5} fontWeight={800} fill="#be123c">
                These sides don't close into a triangle
              </text>
            )}
          </svg>
          {(["a", "b", "c"] as const).map((k, i) => (
            <label key={k} className="flex items-center gap-2 text-xs font-bold">
              side {k}
              <input
                type="range"
                min={2}
                max={12}
                value={w.s[i]}
                disabled={play.readOnly}
                onChange={(e) => play.patch({ s: w.s.map((x, j) => (j === i ? Number(e.target.value) : x)) as [number, number, number] })}
                className="accent-violet-600 flex-1"
              />
              <span className="font-mono w-6">{w.s[i]}</span>
            </label>
          ))}
          <Btn className="mt-1" disabled={play.readOnly || !ang || !scalene || dup} onClick={() => ang && play.patch({ log: [...w.log, { s: w.s, ang }] })}>
            {!scalene ? "Sides must all differ to log" : dup ? "Already logged" : "Log this triangle"}
          </Btn>
        </div>
        <Bay label="Statement tests" tone="violet">
          <table className="w-full text-[11px]">
            <thead>
              <tr>
                <th className="text-left">Statement</th>
                {w.log.map((l, i) => (
                  <th key={i} className="font-mono">{l.s.join("-")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATEMENTS.map((st) => (
                <tr key={st.text} className="border-t">
                  <td className="py-1 font-semibold">{st.text}</td>
                  {w.log.map((l, i) => (
                    <td key={i} className={`text-center font-black ${st.holds(l.ang) ? "text-emerald-600" : "text-rose-500"}`}>
                      {st.holds(l.ang) ? "✓" : "✗"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Btn tone="slate" className="mt-2" disabled={play.readOnly || !w.log.length} onClick={() => play.patch({ log: [] })}>
            Clear the log
          </Btn>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q31 — Solid Inspector (3D)
   The solid stands on a turntable. A slicing plane runs up through it and reports the
   cross-section, which names the solid. Three counting modes let the student tag faces,
   corners and edges. The name plus the three tallies is the answer.
   ══════════════════════════════════════════════════════════════════════ */

function Rod({ a, b, on, onTap }: { a: V3; b: V3; on: boolean; onTap: () => void }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va);
    return { pos: va.clone().add(vb).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()), len: d.length() };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat} onClick={(e: ThreeEvent<MouseEvent>) => (e.delta > 6 ? undefined : (e.stopPropagation(), onTap()))}>
      <cylinderGeometry args={[0.06, 0.06, len, 10]} />
      <meshStandardMaterial color={on ? "#f59e0b" : "#475569"} emissive={on ? "#f59e0b" : "#000000"} emissiveIntensity={on ? 0.4 : 0} />
    </mesh>
  );
}

interface InspectWorld {
  faces: number[];
  verts: number[];
  edges: number[];
  slice: number;
  sliced: number[];
}

export function B31SolidInspector({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const solid = cfg<string>(question, "solid", "triangular-prism");
  const n = solid.startsWith("square") ? 4 : solid.startsWith("pentagonal") ? 5 : 3;
  const H = 1.7;
  const P = useMemo(() => prism(n, 1.1, H, -Math.PI / 2), [n]);
  const baseName = ({ 3: "Triangular", 4: "Square", 5: "Pentagonal" } as Record<number, string>)[n];
  const [mode, setMode] = useState<"faces" | "verts" | "edges">("faces");
  const [spin, setSpin] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const play = usePlay<InspectWorld>({
    question,
    initial: { faces: [], verts: [], edges: [], slice: 0.5, sliced: [] },
    derive: (w) => {
      if (w.sliced.length < 8) return { note: "Run the slicer from the base to the top to name the solid." };
      if (!w.faces.length || !w.verts.length || !w.edges.length) return { note: "Tag the faces, corners and edges." };
      const name = `${baseName} prism`;
      const text = `${name}, ${w.faces.length}, ${w.verts.length}, ${w.edges.length}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const tap = (k: "faces" | "verts" | "edges", i: number) => !play.readOnly && play.set((p) => ({ ...p, [k]: toggle(p[k], i) }));
  const bucket = Math.round(w.slice * 10);

  return (
    <Shell
      play={play}
      question={question}
      title="Solid Inspector"
      mission="Slide the slicer from the base to the top and watch the cross-section: a shape that never changes size means a prism, one that shrinks to a point means a pyramid. Then switch counting modes and tap every face, every corner and every edge once. Turn the table or tip the solid over to reach the hidden side."
      icon={Cuboid}
      dim="3D"
      submitLabel="Submit name, faces, vertices, edges"
      live={
        <>
          <Gauge label="Cross-section" value={w.sliced.length >= 8 ? `${baseName?.toLowerCase()} · same size all the way → prism` : `${baseName?.toLowerCase()} at this height (${w.sliced.length}/11 heights seen)`} tone="sky" />
          <Gauge label="Faces" value={w.faces.length} tone={mode === "faces" ? "violet" : "slate"} />
          <Gauge label="Vertices" value={w.verts.length} tone={mode === "verts" ? "violet" : "slate"} />
          <Gauge label="Edges" value={w.edges.length} tone={mode === "edges" ? "violet" : "slate"} />
        </>
      }
    >
      <Stage3D height={320} camera={{ position: [3.2, 3.6, 3.6], fov: 42 }} orbitTarget={[0, 0.85, 0]} readOnly={play.readOnly}>
        <Floor />
        <Turntable H={H} spin={spin} flipped={flipped}>
          {P.faces.map((f, i) => (
            <Face key={i} pts={f.pts} center={P.center} explode={0} painted={w.faces.includes(i)} color="#a78bfa" onTap={() => mode === "faces" && tap("faces", i)} />
          ))}
          {P.verts.map((v, i) => (
            <mesh key={i} position={v} onClick={(e: ThreeEvent<MouseEvent>) => (e.delta > 6 ? undefined : (e.stopPropagation(), mode === "verts" && tap("verts", i)))}>
              <sphereGeometry args={[mode === "verts" ? 0.14 : 0.09, 16, 16]} />
              <meshStandardMaterial color={w.verts.includes(i) ? "#ef4444" : "#1e293b"} />
            </mesh>
          ))}
          {mode === "edges" && P.edges.map(([a, b], i) => <Rod key={i} a={a} b={b} on={w.edges.includes(i)} onTap={() => tap("edges", i)} />)}
        </Turntable>
        <mesh position={[0, 0.05 + w.slice * H, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 3.2]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </Stage3D>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <label className="flex items-center gap-2 text-xs font-bold">
          Slicer height
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={w.slice}
            disabled={play.readOnly}
            onChange={(e) => {
              const v = Number(e.target.value);
              const b = Math.round(v * 10);
              play.set((p) => ({ ...p, slice: v, sliced: p.sliced.includes(b) ? p.sliced : [...p.sliced, b] }));
            }}
            className="accent-sky-600"
          />
          <span className="font-mono">{bucket * 10}%</span>
        </label>
        {(["faces", "verts", "edges"] as const).map((m) => (
          <Btn key={m} active={mode === m} tone={mode === m ? "violet" : "slate"} onClick={() => setMode(m)}>
            Count {m === "verts" ? "vertices" : m}
          </Btn>
        ))}
        <TurntableControls n={n} spin={spin} setSpin={setSpin} flipped={flipped} setFlipped={setFlipped} />
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — Mirror Line Tester (2D)
   The student turns a mirror line through each shape's centre. The reflected outline is
   drawn over the shape, and the student records a line of symmetry whenever the two
   match. A shape's case closes once every mirror angle has been tried. The verdicts come
   from the recorded lines.
   ══════════════════════════════════════════════════════════════════════ */

const MIRROR_SHAPES: { id: string; name: string; pts: Pt[] | null }[] = [
  { id: "para", name: "Parallelogram", pts: [[-30, -14], [18, -14], [30, 14], [-18, 14]] },
  { id: "rect", name: "Rectangle", pts: [[-30, -17], [30, -17], [30, 17], [-30, 17]] },
  { id: "square", name: "Square", pts: [[-22, -22], [22, -22], [22, 22], [-22, 22]] },
  { id: "circle", name: "Circle", pts: null },
];
const ANGLES = Array.from({ length: 12 }, (_, i) => i * 15);
const reflect = ([x, y]: Pt, deg: number): Pt => {
  const t = (2 * deg * Math.PI) / 180;
  return [x * Math.cos(t) + y * Math.sin(t), x * Math.sin(t) - y * Math.cos(t)];
};
const matches = (pts: Pt[] | null, deg: number) =>
  !pts || pts.map((p) => reflect(p, deg)).every((r) => pts.some((q) => Math.hypot(q[0] - r[0], q[1] - r[1]) < 0.01));

interface MirrorWorld {
  angle: Record<string, number>;
  visited: Record<string, number[]>;
  lines: Record<string, number[]>;
  closed: string[];
}

export function B32MirrorTester({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const [open, setOpen] = useState("para");
  const verdicts = (w: MirrorWorld) => {
    const c = (id: string) => w.closed.includes(id);
    const n = (id: string) => (w.lines[id] ?? []).length;
    return [
      c("para") ? (n("para") === 1 ? "T" : "F") : null,
      c("rect") && c("square") ? (n("rect") === n("square") ? "T" : "F") : null,
      c("circle") ? (n("circle") === ANGLES.length ? "T" : "F") : null,
    ];
  };
  const play = usePlay<MirrorWorld>({
    question,
    initial: { angle: {}, visited: {}, lines: {}, closed: [] },
    derive: (w) => {
      const v = verdicts(w);
      if (v.some((x) => !x)) return { note: "Close the case on every shape: try all 12 mirror angles on it." };
      const text = v.map((x) => (x === "T" ? "True" : "False")).join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const shape = MIRROR_SHAPES.find((s) => s.id === open)!;
  const ang = w.angle[open] ?? 0;
  const visited = w.visited[open] ?? [0];
  const lines = w.lines[open] ?? [];
  const hit = matches(shape.pts, ang);
  const v = verdicts(w);
  const setAngle = (a: number) =>
    play.set((p) => ({ ...p, angle: { ...p.angle, [open]: a }, visited: { ...p.visited, [open]: Array.from(new Set([...(p.visited[open] ?? [0]), a])) } }));
  const rad = (ang * Math.PI) / 180;

  return (
    <Shell
      play={play}
      question={question}
      title="Mirror Line Tester"
      mission="Pick a shape and turn the mirror line through its centre. When the reflected outline (dashed) lands exactly on the shape, record that line of symmetry. Try all 12 angles on a shape to close its case. The verdicts fill in from what you recorded."
      icon={FlipHorizontal2}
      dim="2D"
      submitLabel="Submit True/False for (i), (ii), (iii)"
      live={
        <>
          <Gauge label="Mirror" value={`${ang}° · ${hit ? "match" : "no match"}`} tone={hit ? "emerald" : "slate"} />
          <Gauge label={`${shape.name} lines`} value={lines.length} tone="violet" />
          <Gauge label="Verdicts" value={v.map((x) => x ?? "?").join(", ")} tone="amber" />
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5 mb-2">
        {MIRROR_SHAPES.map((s) => (
          <Btn key={s.id} active={open === s.id} tone={open === s.id ? "violet" : w.closed.includes(s.id) ? "emerald" : "slate"} onClick={() => setOpen(s.id)}>
            {s.name} {w.closed.includes(s.id) ? `· ${(w.lines[s.id] ?? []).length} lines` : ""}
          </Btn>
        ))}
      </div>
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <div className="rounded-2xl bg-white border-2 border-slate-200 p-2">
          <svg viewBox="-50 -50 100 100" className="w-full max-h-64">
            {shape.pts ? <path d={polyPath(shape.pts)} fill="#ddd6fe" stroke="#5b21b6" strokeWidth={1} /> : <circle r={30} fill="#ddd6fe" stroke="#5b21b6" strokeWidth={1} />}
            {shape.pts ? (
              <path d={polyPath(shape.pts.map((p) => reflect(p, ang)))} fill="none" stroke={hit ? "#16a34a" : "#dc2626"} strokeWidth={1} strokeDasharray="2 1.5" />
            ) : (
              <circle r={30} fill="none" stroke="#16a34a" strokeWidth={1} strokeDasharray="2 1.5" />
            )}
            <line x1={-46 * Math.cos(rad)} y1={-46 * Math.sin(rad)} x2={46 * Math.cos(rad)} y2={46 * Math.sin(rad)} stroke="#0ea5e9" strokeWidth={1.2} />
            {lines.map((l) => (
              <line key={l} x1={-40 * Math.cos((l * Math.PI) / 180)} y1={-40 * Math.sin((l * Math.PI) / 180)} x2={40 * Math.cos((l * Math.PI) / 180)} y2={40 * Math.sin((l * Math.PI) / 180)} stroke="#16a34a" strokeWidth={0.4} />
            ))}
          </svg>
        </div>
        <Bay label={`Mirror angle — ${visited.length}/12 tried`} tone="violet">
          <div className="grid grid-cols-6 gap-1">
            {ANGLES.map((a) => (
              <button
                key={a}
                type="button"
                disabled={play.readOnly || w.closed.includes(open)}
                onClick={() => setAngle(a)}
                className={`h-9 rounded-md border-2 text-[11px] font-black ${ang === a ? "bg-sky-600 text-white border-sky-700" : lines.includes(a) ? "bg-emerald-100 border-emerald-300" : visited.includes(a) ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200"}`}
              >
                {a}°
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Btn tone="emerald" disabled={play.readOnly || !hit || lines.includes(ang) || w.closed.includes(open)} onClick={() => play.patch({ lines: { ...w.lines, [open]: [...lines, ang] } })}>
              Record this line
            </Btn>
            <Btn tone="amber" disabled={play.readOnly || visited.length < ANGLES.length || w.closed.includes(open)} onClick={() => play.patch({ closed: [...w.closed, open] })}>
              Close the case
            </Btn>
            {w.closed.includes(open) && (
              <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ closed: w.closed.filter((c) => c !== open) })}>
                Reopen
              </Btn>
            )}
          </div>
          <ul className="mt-2 text-[11px] font-semibold text-slate-600 space-y-0.5">
            <li>(i) Parallelogram has two lines → {v[0] ?? "?"}</li>
            <li>(ii) Rectangle has as many lines as a square → {v[1] ?? "?"}</li>
            <li>(iii) Every diameter of a circle is a line of symmetry → {v[2] ?? "?"}</li>
          </ul>
        </Bay>
      </div>
    </Shell>
  );
}


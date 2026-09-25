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

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Fraction Scanner (2D)
   Each figure goes under the scanner. The student taps every piece to tally it; the
   scanner counts shaded pieces against all pieces. A figure can be docked in the target
   slot only once all its pieces are tallied, and the docked figure is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface FigSpec {
  parts: number;
  shaded: number | number[];
  shape: string;
}
interface ScanFracWorld {
  tallied: Record<string, number[]>;
  docked: string | null;
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

export function B16FractionScanner({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figures = cfg<Record<string, FigSpec>>(question, "figures", {});
  const target = cfg<[number, number]>(question, "target", [1, 1]);
  const ids = Object.keys(figures);
  const [open, setOpen] = useState(ids[0] ?? "A");
  const shadedOf = (id: string) => {
    const f = figures[id];
    return Array.isArray(f.shaded) ? f.shaded : spreadShaded(f.parts, f.shaded);
  };
  const reading = (id: string, t: number[]) => {
    const sh = shadedOf(id);
    return { shaded: t.filter((i) => sh.includes(i)).length, total: t.length, done: t.length === figures[id].parts };
  };

  const play = usePlay<ScanFracWorld>({
    question,
    initial: { tallied: {}, docked: null },
    derive: (w) => {
      if (!w.docked) return { note: "Tally a figure's pieces, then dock the one that measures the target fraction." };
      const r = reading(w.docked, w.tallied[w.docked] ?? []);
      const [n, d] = reduceFraction(r.shaded, r.total);
      return { value: `Figure ${w.docked} docked: ${r.shaded}/${r.total} = ${n}/${d}`, optionId: w.docked };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const t = w.tallied[open] ?? [];
  const r = figures[open] ? reading(open, t) : { shaded: 0, total: 0, done: false };
  const [rn, rd] = reduceFraction(r.shaded, r.total || 1);

  return (
    <Shell
      play={play}
      question={question}
      title="Fraction Scanner"
      mission={`Put each figure under the scanner and tap every piece to tally it. The scanner counts shaded pieces out of all pieces. Dock the figure whose tally is exactly ${target[0]}/${target[1]}.`}
      icon={ChartPie}
      dim="2D"
      submitLabel="Submit the docked figure"
      live={
        <>
          <Gauge label={`Figure ${open} tally`} value={`${r.shaded} shaded / ${r.total} pieces`} tone="violet" />
          <Gauge label="Reads as" value={r.total ? `${rn}/${rd}` : "—"} tone={r.done ? "emerald" : "slate"} />
          <Gauge label="Target slot" value={`${target[0]}/${target[1]} · ${w.docked ? `holds ${w.docked}` : "empty"}`} tone="amber" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-3">
        <Bay label="Figure tray — pick one to scan">
          <div className="grid grid-cols-2 gap-2">
            {ids.map((id) => {
              const done = figures[id] && reading(id, w.tallied[id] ?? []).done;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setOpen(id)}
                  className={`rounded-xl border-2 p-1 bg-white ${open === id ? "border-violet-500 ring-2 ring-violet-200" : "border-slate-200"}`}
                >
                  <FigureSvg spec={figures[id]} tallied={[]} />
                  <div className="text-[11px] font-black">
                    Figure {id} {done ? "· scanned" : ""} {w.docked === id ? "· docked" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </Bay>
        <Bay label={`Scanner bed — figure ${open}: tap every piece`} tone="violet">
          {figures[open] && (
            <FigureSvg
              spec={figures[open]}
              tallied={t}
              big
              disabled={play.readOnly}
              onTap={(i) => play.set((p) => ({ ...p, docked: p.docked === open ? null : p.docked, tallied: { ...p.tallied, [open]: toggle(p.tallied[open] ?? [], i) } }))}
            />
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <Btn disabled={play.readOnly || !r.done} onClick={() => play.patch({ docked: open })}>
              Dock figure {open} in the {target[0]}/{target[1]} slot
            </Btn>
            {!r.done && <span className="text-xs font-bold text-slate-500 self-center">Tally all {figures[open]?.parts} pieces first.</span>}
          </div>
        </Bay>
      </div>
    </Shell>
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
   Q19 — Area Cutter (2D)
   The polygon is an irregular shape nobody can measure directly. The student slides a
   horizontal cutter across it; when the cut produces only rectangles and triangles, each
   piece gets a measured area and can be lifted out of the frame. What remains of the
   frame after every piece is lifted is the shaded area.
   ══════════════════════════════════════════════════════════════════════ */

function clipY(pts: Pt[], c: number, keepBelow: boolean): Pt[] {
  const inside = (p: Pt) => (keepBelow ? p[1] <= c + 1e-9 : p[1] >= c - 1e-9);
  const out: Pt[] = [];
  pts.forEach((cur, i) => {
    const prev = pts[(i + pts.length - 1) % pts.length];
    const ci = inside(cur);
    const pi = inside(prev);
    if (ci !== pi) {
      const t = (c - prev[1]) / (cur[1] - prev[1]);
      out.push([prev[0] + t * (cur[0] - prev[0]), c]);
    }
    if (ci) out.push(cur);
  });
  // drop repeats and straight-through points so shapes classify cleanly
  const dedup = out.filter((p, i) => {
    const q = out[(i + out.length - 1) % out.length];
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-9;
  });
  return dedup.filter((p, i) => {
    const a = dedup[(i + dedup.length - 1) % dedup.length];
    const b = dedup[(i + 1) % dedup.length];
    return Math.abs((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) > 1e-9;
  });
}

function measure(pts: Pt[]): { kind: "rectangle" | "triangle" | "irregular"; area?: number; how?: string } {
  if (pts.length === 4 && pts.every((p, i) => {
    const q = pts[(i + 1) % 4];
    return Math.abs(p[0] - q[0]) < 1e-9 || Math.abs(p[1] - q[1]) < 1e-9;
  })) {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const L = Math.max(...xs) - Math.min(...xs);
    const B = Math.max(...ys) - Math.min(...ys);
    return { kind: "rectangle", area: L * B, how: `${L} × ${B}` };
  }
  if (pts.length === 3) {
    const flat = pts.findIndex((p, i) => Math.abs(p[1] - pts[(i + 1) % 3][1]) < 1e-9);
    if (flat >= 0) {
      const a = pts[flat];
      const b = pts[(flat + 1) % 3];
      const apex = pts[(flat + 2) % 3];
      const base = Math.abs(a[0] - b[0]);
      const h = Math.abs(apex[1] - a[1]);
      return { kind: "triangle", area: (base * h) / 2, how: `½ × ${base} × ${h}` };
    }
  }
  return { kind: "irregular" };
}

interface CutWorld {
  cut: number | null;
  lifted: number[];
}

export function B19AreaCutter({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const rect = cfg<{ w: number; h: number }>(question, "rect", { w: 20, h: 12 });
  const poly = cfg<Pt[]>(question, "polygon", []);
  const ys = poly.map((p) => p[1]);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const piecesFor = (cut: number | null) => {
    const raw = cut === null ? [poly] : [clipY(poly, cut, true), clipY(poly, cut, false)];
    return raw.filter((p) => p.length >= 3 && shoelace(p) > 1e-9).map((pts) => ({ pts, ...measure(pts) }));
  };

  const play = usePlay<CutWorld>({
    question,
    initial: { cut: null, lifted: [] },
    derive: (w) => {
      const pieces = piecesFor(w.cut);
      if (pieces.some((p) => p.kind === "irregular")) return { note: "An irregular piece can't be measured. Move the cutter until every piece is a rectangle or a triangle." };
      if (w.lifted.length < pieces.length) return { note: `Lift every measured piece out of the frame (${w.lifted.length}/${pieces.length}).` };
      const out = pieces.reduce((s, p) => s + (p.area ?? 0), 0);
      const left = rect.w * rect.h - out;
      return { value: `${rect.w * rect.h} − ${out} = ${left} cm²`, optionId: matchNumber(question, left) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const pieces = piecesFor(w.cut);
  const S = 100 / rect.w;
  const X = (x: number) => 5 + x * S;
  const Y = (y: number) => 5 + (rect.h - y) * S;
  const colours = ["#fbbf24", "#34d399"];

  return (
    <Shell
      play={play}
      question={question}
      title="Area Cutter"
      mission="The polygon in the frame can't be measured as it is. Slide the cutter to slice it into pieces you can measure, lift each measured piece out of the frame, and read how much shaded frame is left."
      icon={Scissors}
      dim="2D"
      submitLabel="Submit the shaded area"
      live={
        <>
          <Gauge label="Frame" value={`${rect.w} × ${rect.h} = ${rect.w * rect.h} cm²`} />
          <Gauge label="Cutter" value={w.cut === null ? "not used" : `y = ${w.cut} cm`} tone="violet" />
          <Gauge label="Lifted out" value={`${pieces.filter((_, i) => w.lifted.includes(i)).reduce((s, p) => s + (p.area ?? 0), 0)} cm²`} tone="amber" />
        </>
      }
    >
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-3">
        <div className="rounded-2xl bg-white border-2 border-slate-200 p-2">
          <svg viewBox={`0 0 110 ${rect.h * S + 10}`} className="w-full">
            <defs>
              <pattern id="b19hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="3" height="3" fill="#ddd6fe" />
                <line x1="0" y1="0" x2="0" y2="3" stroke="#8b5cf6" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x={X(0)} y={Y(rect.h)} width={rect.w * S} height={rect.h * S} fill="url(#b19hatch)" stroke="#312e81" strokeWidth={0.6} />
            {Array.from({ length: rect.w + 1 }, (_, i) => (
              <line key={`v${i}`} x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(rect.h)} stroke="#a5b4fc" strokeWidth={0.12} />
            ))}
            {Array.from({ length: rect.h + 1 }, (_, i) => (
              <line key={`h${i}`} x1={X(0)} y1={Y(i)} x2={X(rect.w)} y2={Y(i)} stroke="#a5b4fc" strokeWidth={0.12} />
            ))}
            {pieces.map((p, i) =>
              w.lifted.includes(i) ? (
                <path key={i} d={polyPath(p.pts.map(([x, y]) => [X(x), Y(y)]))} fill="#ffffff" stroke="#94a3b8" strokeDasharray="1 1" strokeWidth={0.4} />
              ) : (
                <path key={i} d={polyPath(p.pts.map(([x, y]) => [X(x), Y(y)]))} fill={p.kind === "irregular" ? "#fda4af" : colours[i % 2]} stroke="#1e1b4b" strokeWidth={0.5} />
              )
            )}
            {poly.map(([x, y], i) => (
              <text key={i} x={X(x)} y={Y(y) - 1.2} fontSize={2.6} textAnchor="middle" fontWeight={800} fill="#1e1b4b">
                ({x},{y})
              </text>
            ))}
            {w.cut !== null && <line x1={X(-0.5)} y1={Y(w.cut)} x2={X(rect.w + 0.5)} y2={Y(w.cut)} stroke="#dc2626" strokeWidth={0.6} strokeDasharray="2 1" />}
          </svg>
          <label className="flex items-center gap-2 text-xs font-bold mt-1">
            Cutter height
            <input
              type="range"
              min={minY}
              max={maxY}
              step={1}
              value={w.cut ?? minY}
              disabled={play.readOnly}
              onChange={(e) => play.set({ cut: Number(e.target.value), lifted: [] })}
              className="accent-rose-600 flex-1"
            />
            <Btn tone="slate" disabled={play.readOnly || w.cut === null} onClick={() => play.set({ cut: null, lifted: [] })}>
              Put cutter away
            </Btn>
          </label>
        </div>
        <Bay label="Pieces" tone="violet">
          <ul className="space-y-2">
            {pieces.map((p, i) => (
              <li key={i} className="flex items-center gap-2 bg-white rounded-lg border p-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: p.kind === "irregular" ? "#fda4af" : colours[i % 2] }} />
                <span className="text-xs font-bold flex-1">
                  {p.kind === "irregular" ? `${p.pts.length}-sided irregular piece — no formula` : `${p.kind}: ${p.how} = ${p.area} cm²`}
                </span>
                <Btn disabled={play.readOnly || p.kind === "irregular"} active={w.lifted.includes(i)} tone={w.lifted.includes(i) ? "amber" : "violet"} onClick={() => play.patch({ lifted: toggle(w.lifted, i) })}>
                  {w.lifted.includes(i) ? "Put back" : "Lift out"}
                </Btn>
              </li>
            ))}
          </ul>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — Circle Lab (2D)
   The student drags the ends of a chord round the circle. When the chord passes through
   the centre the lab measures it against the diameter; tapping the region cut off by a
   chord names it. Each statement's verdict switch unlocks once its experiment has run.
   ══════════════════════════════════════════════════════════════════════ */

interface CircleWorld {
  a1: number;
  a2: number;
  sawDiameter: boolean;
  sawSegment: boolean;
  v: [string | null, string | null];
}

export function B20CircleLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const verdictOptions = cfg<Record<string, string>>(question, "verdictOptions", {});
  const R = 38;
  const pos = (deg: number): Pt => [50 + R * Math.cos((deg * Math.PI) / 180), 50 + R * Math.sin((deg * Math.PI) / 180)];

  const play = usePlay<CircleWorld>({
    question,
    initial: { a1: 200, a2: 320, sawDiameter: false, sawSegment: false, v: [null, null] },
    derive: (w) => {
      if (!w.v[0] || !w.v[1]) return { note: "Run both experiments, then set a verdict for each statement." };
      const key = `${w.v[0]}${w.v[1]}`;
      return { value: `(i) ${w.v[0] === "T" ? "true" : "false"}, (ii) ${w.v[1] === "T" ? "true" : "false"}`, optionId: verdictOptions[key] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const p1 = pos(w.a1);
  const p2 = pos(w.a2);
  const chord = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
  const diff = (((w.a2 - w.a1) % 360) + 360) % 360;
  const throughCentre = diff === 180;
  const small = diff <= 180;
  const segPath = `M ${p1.join(" ")} A ${R} ${R} 0 0 ${small ? 1 : 0} ${p2.join(" ")} Z`;

  const [dragging, setDragging] = useState<null | 1 | 2>(null);
  const moveTo = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging || play.readOnly) return;
    const q = clientToSvg(e.currentTarget, e.clientX, e.clientY);
    if (!q) return;
    const x = q.x - 50;
    const y = q.y - 50;
    const a = (Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) / 5) * 5) % 360;
    const k = dragging === 1 ? "a1" : "a2";
    if (w[k] === a) return;
    play.set((s) => {
      const next = { ...s, [k]: a } as CircleWorld;
      const d = (((next.a2 - next.a1) % 360) + 360) % 360;
      return d === 180 ? { ...next, sawDiameter: true } : next;
    });
  };

  const Verdict = ({ i, unlocked }: { i: 0 | 1; unlocked: boolean }) => (
    <div className="flex gap-1.5">
      {["T", "F"].map((v) => (
        <Btn key={v} disabled={play.readOnly || !unlocked} active={w.v[i] === v} tone={w.v[i] === v ? (v === "T" ? "emerald" : "rose") : "slate"} onClick={() => play.patch({ v: (i === 0 ? [v, w.v[1]] : [w.v[0], v]) as [string, string] })}>
          {v === "T" ? "True" : "False"}
        </Btn>
      ))}
    </div>
  );

  return (
    <Shell
      play={play}
      question={question}
      title="Circle Lab"
      mission="Drag the two ends of the chord around the circle. Line the chord up through the centre and compare it with the diameter; tap the region between a chord and its arc to name it. Then give each statement its verdict."
      icon={CircleDot}
      dim="2D"
      submitLabel="Submit the verdicts"
      live={
        <>
          <Gauge label="Chord length" value={`${(chord / R).toFixed(2)} r`} tone="violet" />
          <Gauge label="Through the centre?" value={throughCentre ? "yes — equals 2r" : "no"} tone={throughCentre ? "emerald" : "slate"} />
          <Gauge label="Region named" value={w.sawSegment ? "segment" : "—"} tone={w.sawSegment ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <div className="rounded-2xl bg-white border-2 border-slate-200 p-2 select-none" style={{ touchAction: "none" }}>
          <svg
            viewBox="0 0 100 100"
            className="w-full max-h-72"
            onPointerMove={moveTo}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
          >
            <circle cx={50} cy={50} r={R} fill="#f5f3ff" stroke="#312e81" strokeWidth={0.8} />
            <path d={segPath} fill={w.sawSegment ? "#fbbf24" : "#ddd6fe"} opacity={0.85} onClick={() => !play.readOnly && play.patch({ sawSegment: true })} style={{ cursor: "pointer" }} />
            {w.sawSegment && (
              <text x={(p1[0] + p2[0]) / 2} y={(p1[1] + p2[1]) / 2 + (small ? -3 : 5)} fontSize={4} fontWeight={900} textAnchor="middle" fill="#78350f">
                segment
              </text>
            )}
            <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={throughCentre ? "#16a34a" : "#7c3aed"} strokeWidth={1.4} />
            <circle cx={50} cy={50} r={1.3} fill="#1e1b4b" />
            <text x={52} y={48} fontSize={3.5} fontWeight={800}>
              O
            </text>
            {[p1, p2].map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#7c3aed" stroke="#fff" strokeWidth={0.8} style={{ cursor: "grab" }}
                data-handle={i + 1}
                onPointerDown={(e) => {
                  if (play.readOnly) return;
                  (e.currentTarget.ownerSVGElement as SVGSVGElement | null)?.setPointerCapture?.(e.pointerId);
                  setDragging((i + 1) as 1 | 2);
                }}
              />
            ))}
          </svg>
          <p className="text-[11px] text-slate-500 font-semibold">Drag the violet dots. The drag reads your finger's angle around the circle, so drag inside the box.</p>
        </div>
        <div className="space-y-2">
          <Bay label="(i) A chord that passes through the centre is a diameter">
            <p className="text-xs font-semibold text-slate-600 mb-1">{w.sawDiameter ? "Lab note: a chord through O measured 2r — the diameter." : "Experiment: get the chord through O."}</p>
            <Verdict i={0} unlocked={w.sawDiameter} />
          </Bay>
          <Bay label="(ii) The region between a chord and its arc is a segment">
            <p className="text-xs font-semibold text-slate-600 mb-1">{w.sawSegment ? "Lab note: chord + arc enclose a segment." : "Experiment: tap the shaded region cut off by the chord."}</p>
            <Verdict i={1} unlocked={w.sawSegment} />
          </Bay>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q21 — Number Machine Factory (2D)
   Four machines each combine two whole numbers. The student sets a and b, feeds them to a
   machine and the output lands on the belt; an output that is not a whole number jams
   the machine. After every machine has been tested three times, the jammed machine is
   the property that is not always true.
   ══════════════════════════════════════════════════════════════════════ */

interface MachineRun {
  m: string;
  a: number;
  b: number;
  out: number;
  ok: boolean;
}
interface FactoryWorld {
  a: number;
  b: number;
  log: MachineRun[];
}
const runMachine = (op: string, a: number, b: number) => {
  if (op === "+") return { out: a + b, ok: true };
  if (op === "×") return { out: a * b, ok: true };
  if (op === "−") return { out: a - b, ok: a - b >= 0 };
  return { out: a * 1, ok: a * 1 === a };
};

export function B21MachineFactory({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const machines = cfg<{ id: string; op: string }[]>(question, "machines", []);
  const play = usePlay<FactoryWorld>({
    question,
    initial: { a: 3, b: 5, log: [] },
    derive: (w) => {
      const untested = machines.filter((m) => w.log.filter((r) => r.m === m.id).length < 3);
      const jammed = machines.filter((m) => w.log.some((r) => r.m === m.id && !r.ok));
      if (untested.length && jammed.length === 0) return { note: `Test every machine at least 3 times (${machines.length - untested.length}/${machines.length} done).` };
      if (!jammed.length) return { note: "No machine has jammed yet. Try other pairs — does any rule break?" };
      if (jammed.length > 1) return { note: "More than one machine jammed — check the log." };
      return { value: `Machine ${jammed[0].id} (a ${jammed[0].op === "×1" ? "× 1" : `${jammed[0].op} b`}) jammed`, optionId: jammed[0].id };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const Step = ({ k }: { k: "a" | "b" }) => (
    <div className="flex items-center gap-1.5">
      <span className="font-black w-4">{k}</span>
      <Btn className="px-2" disabled={play.readOnly || w[k] <= 0} onClick={() => play.patch({ [k]: w[k] - 1 } as Partial<FactoryWorld>)}>
        −
      </Btn>
      <span className="font-mono font-black text-lg w-8 text-center">{w[k]}</span>
      <Btn className="px-2" disabled={play.readOnly || w[k] >= 20} onClick={() => play.patch({ [k]: w[k] + 1 } as Partial<FactoryWorld>)}>
        +
      </Btn>
    </div>
  );

  return (
    <Shell
      play={play}
      question={question}
      title="Number Machine Factory"
      mission="Pick two whole numbers a and b, and feed them into each machine. A machine jams when its output isn't a whole number (whole numbers are 0, 1, 2, 3 …). Test each machine at least three times and find the one whose rule is not always true."
      icon={Factory}
      dim="2D"
      submitLabel="Submit the jammed machine"
      live={
        <>
          <Gauge label="Inputs" value={`a = ${w.a}, b = ${w.b}`} tone="violet" />
          <Gauge label="Runs logged" value={w.log.length} />
          <Gauge label="Jams" value={w.log.filter((r) => !r.ok).length} tone={w.log.some((r) => !r.ok) ? "rose" : "emerald"} />
        </>
      }
    >
      <div className="flex flex-wrap gap-4 mb-2">
        <Step k="a" />
        <Step k="b" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {machines.map((m) => {
          const runs = w.log.filter((r) => r.m === m.id);
          const jam = runs.some((r) => !r.ok);
          return (
            <motion.div key={m.id} animate={jam ? { rotate: [0, -2, 2, 0] } : {}} className={`rounded-2xl border-2 p-2 ${jam ? "bg-rose-50 border-rose-300" : "bg-slate-50 border-slate-200"}`}>
              <div className="text-[10px] font-black uppercase text-slate-500">Machine {m.id}</div>
              <div className="font-mono font-black text-lg">{m.op === "×1" ? "a × 1" : `a ${m.op} b`}</div>
              <Btn className="w-full mt-1" disabled={play.readOnly} onClick={() => play.patch({ log: [...w.log, { m: m.id, a: w.a, b: w.b, ...runMachine(m.op, w.a, w.b) }] })}>
                Feed {m.op === "×1" ? `a = ${w.a}` : `${w.a}, ${w.b}`}
              </Btn>
              <ul className="mt-1 space-y-0.5 max-h-24 overflow-y-auto">
                {runs.map((r, i) => (
                  <li key={i} className={`text-[11px] font-mono font-bold ${r.ok ? "text-emerald-700" : "text-rose-700"}`}>
                    {m.op === "×1" ? `${r.a} × 1 = ${r.out}` : `${r.a} ${m.op} ${r.b} = ${r.out}`} {r.ok ? "✓" : "✗ JAM"}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] font-bold text-slate-500">{runs.length}/3 tests</div>
            </motion.div>
          );
        })}
      </div>
      <Btn tone="slate" className="mt-2" disabled={play.readOnly || !w.log.length} onClick={() => play.patch({ log: [] })}>
        Clear the log
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — Place-Value Columns (2D)
   Each part of the expanded form is a digit card. The student drops each card into a
   place-value column; the column decides what the digit stands for. The number read off
   the columns is the answer, so a card in the wrong column changes the number.
   ══════════════════════════════════════════════════════════════════════ */

interface Block {
  id: string;
  label: string;
  digit: number;
  place: number;
}
interface ColumnsWorld {
  placed: Record<string, number>;
}
const PLACES = [2, 1, 0, -1, -2, -3, -4];
const PLACE_NAME: Record<number, string> = { 2: "Hundreds", 1: "Tens", 0: "Ones", [-1]: "Tenths", [-2]: "Hundredths", [-3]: "Thousandths", [-4]: "Ten-thousandths" };
const PLACE_FRAC: Record<number, string> = { 2: "100", 1: "10", 0: "1", [-1]: "1/10", [-2]: "1/100", [-3]: "1/1000", [-4]: "1/10000" };

function readColumns(blocks: Block[], placed: Record<string, number>) {
  let scaled = 0; // in ten-thousandths
  blocks.forEach((b) => {
    if (placed[b.id] !== undefined) scaled += b.digit * 10 ** (placed[b.id] + 4);
  });
  const int = Math.floor(scaled / 10000);
  const frac = String(scaled % 10000).padStart(4, "0").replace(/0+$/, "");
  return { text: frac ? `${int}.${frac}` : String(int), num: scaled / 10000 };
}

export function B23PlaceValueColumns({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const blocks = cfg<Block[]>(question, "blocks", []);
  const [held, setHeld] = useState<string | null>(null);
  const play = usePlay<ColumnsWorld>({
    question,
    initial: { placed: {} },
    derive: (w) => {
      const left = blocks.filter((b) => w.placed[b.id] === undefined).length;
      if (left) return { note: `Place every card in a column (${blocks.length - left}/${blocks.length}).` };
      const r = readColumns(blocks, w.placed);
      return { value: r.text, optionId: matchText(question, r.text) ?? matchNumber(question, r.num) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const reading = readColumns(blocks, w.placed);
  const inCol = (pl: number) => blocks.filter((b) => w.placed[b.id] === pl);

  return (
    <Shell
      play={play}
      question={question}
      title="Place-Value Columns"
      mission="Tap a card from the expanded form, then tap the column it belongs in. A column tells you what its digit is worth — check it matches the card. Empty columns count as 0. Read the finished number off the board."
      icon={Columns3}
      dim="2D"
      submitLabel="Submit the number on the board"
      live={
        <>
          <Gauge label="Board reads" value={reading.text} tone="violet" />
          <Gauge label="Cards placed" value={`${Object.keys(w.placed).length}/${blocks.length}`} />
          <Gauge label="Holding" value={held ? blocks.find((b) => b.id === held)?.label : "—"} tone="amber" />
        </>
      }
    >
      <Bay label="Expanded-form cards">
        <div className="flex flex-wrap gap-2">
          {blocks.map((b) => {
            const at = w.placed[b.id];
            const worth = at !== undefined ? `${b.digit} × ${PLACE_FRAC[at]}` : "";
            const wrong = at !== undefined && at !== b.place;
            return (
              <button
                key={b.id}
                type="button"
                disabled={play.readOnly}
                onClick={() => setHeld(held === b.id ? null : b.id)}
                className={`min-h-[44px] px-3 rounded-xl border-2 font-mono font-black text-base ${held === b.id ? "bg-amber-100 border-amber-500" : at !== undefined ? (wrong ? "bg-rose-50 border-rose-300" : "bg-emerald-50 border-emerald-300") : "bg-white border-slate-300"}`}
              >
                {b.label}
                {at !== undefined && <span className="block text-[10px] font-bold">{worth} {wrong ? "≠ card" : "✓"}</span>}
              </button>
            );
          })}
        </div>
      </Bay>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 mt-2">
        {PLACES.map((pl) => (
          <button
            key={pl}
            type="button"
            disabled={play.readOnly || !held}
            onClick={() => {
              if (!held) return;
              play.set((p) => ({ placed: { ...p.placed, [held]: pl } }));
              setHeld(null);
            }}
            className={`rounded-xl border-2 p-1 min-h-[88px] text-center ${pl === -1 ? "border-l-4 border-l-rose-400" : ""} ${held ? "bg-violet-50 border-violet-300 hover:bg-violet-100" : "bg-slate-50 border-slate-200"}`}
          >
            <div className="text-[9px] font-black uppercase text-slate-500 leading-tight">{PLACE_NAME[pl]}</div>
            <div className="text-[9px] font-bold text-slate-400">× {PLACE_FRAC[pl]}</div>
            <div className="font-mono font-black text-2xl">{inCol(pl).reduce((s, b) => s + b.digit, 0) || 0}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Btn tone="slate" disabled={play.readOnly || !held || w.placed[held] === undefined} onClick={() => {
          if (!held) return;
          play.set((p) => {
            const next = { ...p.placed };
            delete next[held];
            return { placed: next };
          });
          setHeld(null);
        }}>
          Take the held card off the board
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
  const [sel, setSel] = useState(ids[0] ?? "A");
  const play = usePlay<BeakerWorld>({
    question,
    initial: { poured: [], last: null, pedestal: null },
    derive: (w) =>
      !w.pedestal ? { note: "Pour the figures, then stand the 40% one on the pedestal." } : { value: `Figure ${w.pedestal} fills ${+pct(w.pedestal).toFixed(1)}%`, optionId: w.pedestal },
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
      mission="Pick a figure and pour it: its shaded pieces fill the beaker to the shaded share of the figure. Compare with the 40% line. Stand the figure that fills exactly to 40% on the pedestal."
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
              <motion.rect x={11} width={38} initial={false} animate={{ y: 104 - level, height: level }} transition={{ duration: 0.9 }} fill="#38bdf8" opacity={0.8} />
              {[20, 40, 60, 80, 100].map((m) => (
                <g key={m}>
                  <line x1={10} x2={m === 40 ? 56 : 18} y1={105 - m} y2={105 - m} stroke={m === 40 ? "#dc2626" : "#475569"} strokeWidth={m === 40 ? 1 : 0.6} />
                  <text x={m === 40 ? 57 : 20} y={106 - m} fontSize={5} fontWeight={800} fill={m === 40 ? "#dc2626" : "#475569"}>
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
                Stand figure {sel} on the 40% pedestal
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
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "");
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
      <Bay label="The reader says" tone="dark">
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
  { text: "All angles are equal", holds: (g) => eq(g[0], g[1]) && eq(g[1], g[2]) },
  { text: "Exactly two angles are equal", holds: (g) => [eq(g[0], g[1]), eq(g[1], g[2]), eq(g[0], g[2])].filter(Boolean).length === 1 },
  { text: "All angles are of different measures", holds: (g) => !eq(g[0], g[1]) && !eq(g[1], g[2]) && !eq(g[0], g[2]) },
  { text: "One angle is always 90°", holds: (g) => g.some((x) => eq(x, 90)) },
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
   Q30 — Measuring-Stick Workshop (2D)
   Two rods have consecutive lengths. The student lays measuring sticks along both rods;
   a stick measures a rod when copies fit with nothing left over. The longest stick that
   measures both is their HCF. The workshop logs pairs and keeps the statements that held
   for every pair.
   ══════════════════════════════════════════════════════════════════════ */

interface StickWorld {
  n: number;
  stick: number;
  fits: number[];
  log: { n: number; hcf: number }[];
}
const HCF_STATEMENTS = [
  { text: "0", holds: (l: { n: number; hcf: number }) => l.hcf === 0 },
  { text: "2", holds: (l: { n: number; hcf: number }) => l.hcf === 2 },
  { text: "the smaller number", holds: (l: { n: number; hcf: number }) => l.hcf === l.n },
  { text: "1", holds: (l: { n: number; hcf: number }) => l.hcf === 1 },
];

export function B30StickWorkshop({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<StickWorld>({
    question,
    initial: { n: 8, stick: 4, fits: [], log: [] },
    derive: (w) => {
      if (w.log.length < 3) return { note: `Log the longest common stick for at least 3 different pairs (${w.log.length}/3).` };
      const always = HCF_STATEMENTS.filter((s) => w.log.every(s.holds));
      if (always.length !== 1) return { note: always.length ? "More than one statement held every time — log a different pair." : "No statement held for every pair." };
      return { value: `HCF was ${always[0].text} for every pair`, optionId: matchText(question, always[0].text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const rods = [w.n, w.n + 1];
  const fitsBoth = rods.every((r) => r % w.stick === 0);
  const best = w.fits.length ? Math.max(...w.fits) : 0;
  const logged = w.log.some((l) => l.n === w.n);
  const U = 88 / (w.n + 1);

  return (
    <Shell
      play={play}
      question={question}
      title="Measuring-Stick Workshop"
      mission="Two rods are consecutive numbers long. Choose a stick and lay it along both rods: it measures a rod when copies fit exactly. Try sticks until you find the longest one that measures both — that is the HCF. Log it, then change the rods and repeat."
      icon={Ruler}
      dim="2D"
      submitLabel="Submit what the HCF always was"
      live={
        <>
          <Gauge label="Rods" value={`${w.n} and ${w.n + 1}`} tone="violet" />
          <Gauge label="Stick" value={`${w.stick} ${fitsBoth ? "fits both" : "leaves a gap"}`} tone={fitsBoth ? "emerald" : "rose"} />
          <Gauge label="Longest common stick found" value={best || "—"} tone="amber" />
        </>
      }
    >
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-2">
        <svg viewBox="0 0 100 40" className="w-full">
          {rods.map((r, k) => {
            const copies = Math.floor(r / w.stick);
            const gap = r - copies * w.stick;
            return (
              <g key={k} transform={`translate(6 ${6 + k * 17})`}>
                <rect width={r * U} height={5} fill="#a16207" rx={1} />
                <text x={r * U + 1} y={4.5} fontSize={3.6} fontWeight={900}>
                  {r}
                </text>
                {Array.from({ length: copies }, (_, i) => (
                  <rect key={i} x={i * w.stick * U} y={6} width={w.stick * U - 0.4} height={4} fill="#34d399" stroke="#065f46" strokeWidth={0.2} />
                ))}
                {gap > 0 && <rect x={copies * w.stick * U} y={6} width={gap * U} height={4} fill="#fda4af" />}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className="text-xs font-black">Stick</span>
        {Array.from({ length: w.n + 1 }, (_, i) => i + 1).map((s) => (
          <Btn
            key={s}
            className="px-2 min-w-[40px]"
            active={w.stick === s}
            tone={w.stick === s ? "violet" : w.fits.includes(s) ? "emerald" : "slate"}
            disabled={play.readOnly}
            onClick={() => play.set((p) => ({ ...p, stick: s, fits: [w.n, w.n + 1].every((r) => r % s === 0) && !p.fits.includes(s) ? [...p.fits, s] : p.fits }))}
          >
            {s}
          </Btn>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className="text-xs font-black">Rods</span>
        <Btn className="px-2" disabled={play.readOnly || w.n <= 1} onClick={() => play.patch({ n: w.n - 1, stick: 1, fits: [] })}>
          shorter
        </Btn>
        <Btn className="px-2" disabled={play.readOnly || w.n >= 14} onClick={() => play.patch({ n: w.n + 1, stick: 1, fits: [] })}>
          longer
        </Btn>
        <Btn tone="amber" disabled={play.readOnly || !best || logged} onClick={() => play.patch({ log: [...w.log, { n: w.n, hcf: best }] })}>
          {logged ? "Pair already logged" : `Log HCF(${w.n}, ${w.n + 1}) = ${best || "?"}`}
        </Btn>
      </div>
      {!!w.log.length && (
        <Bay label="Workshop log" className="mt-2">
          <div className="flex flex-wrap gap-1.5 text-xs font-mono font-bold">
            {w.log.map((l, i) => (
              <span key={i} className="px-2 py-1 rounded bg-white border">
                HCF({l.n}, {l.n + 1}) = {l.hcf}
              </span>
            ))}
          </div>
        </Bay>
      )}
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
      c("para") ? (n("para") === 2 ? "T" : "F") : null,
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
      const text = v.join(", ");
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
      submitLabel="Submit T/F for (i), (ii), (iii)"
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

/* ══════════════════════════════════════════════════════════════════════
   Q34 — Polygon Gate (2D)
   Each figure goes through the gate. The gate's two sensors report whether the figure is
   closed and whether it is made only of straight sides. After scanning, the student sorts
   the figure into the polygon bin or the reject bin. The polygon bin is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface GateShape {
  id: number;
  name: string;
  closed: boolean;
  straight: boolean;
}
interface GateWorld {
  scanned: number[];
  bin: Record<number, "poly" | "not">;
}
const ngon = (k: number, r = 30): Pt[] => Array.from({ length: k }, (_, i) => [50 + r * Math.cos(-Math.PI / 2 + (i / k) * Math.PI * 2), 50 + r * Math.sin(-Math.PI / 2 + (i / k) * Math.PI * 2)]);
function GateFigure({ name }: { name: string }) {
  if (name === "circle") return <circle cx={50} cy={50} r={30} fill="#e0f2fe" stroke="#0c4a6e" strokeWidth={3} />;
  if (name === "zig-zag") return <polyline points="12,70 30,30 48,70 66,30 84,70" fill="none" stroke="#0c4a6e" strokeWidth={3} />;
  const k = name === "triangle" ? 3 : name === "pentagon" ? 5 : name === "hexagon" ? 6 : 4;
  return <path d={polyPath(ngon(k))} fill="#e0f2fe" stroke="#0c4a6e" strokeWidth={3} />;
}

export function B34PolygonGate({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const shapes = cfg<GateShape[]>(question, "shapes", []);
  const [sel, setSel] = useState<number>(shapes[0]?.id ?? 1);
  const play = usePlay<GateWorld>({
    question,
    initial: { scanned: [], bin: {} },
    derive: (w) => {
      const sorted = shapes.filter((s) => w.bin[s.id]).length;
      if (sorted < shapes.length) return { note: `Scan and sort every figure (${sorted}/${shapes.length}).` };
      const poly = shapes.filter((s) => w.bin[s.id] === "poly").map((s) => s.id);
      if (!poly.length) return { note: "The polygon bin is empty." };
      const text = listText(poly);
      return { value: `Polygons: ${text}`, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const s = shapes.find((x) => x.id === sel);
  const scanned = w.scanned.includes(sel);

  return (
    <Shell
      play={play}
      question={question}
      title="Polygon Gate"
      mission="Send each figure through the gate: one sensor checks the figure is closed, the other checks every side is a straight line. Then sort the figure into the polygon bin or the reject bin."
      icon={Hexagon}
      dim="2D"
      submitLabel="Submit the polygon bin"
      live={
        <>
          <Gauge label="Polygon bin" value={shapes.filter((x) => w.bin[x.id] === "poly").map((x) => x.id).join(", ") || "empty"} tone="emerald" />
          <Gauge label="Reject bin" value={shapes.filter((x) => w.bin[x.id] === "not").map((x) => x.id).join(", ") || "empty"} tone="rose" />
        </>
      }
    >
      <div className="grid grid-cols-5 gap-1.5">
        {shapes.map((x) => (
          <button key={x.id} type="button" onClick={() => setSel(x.id)} className={`rounded-xl border-2 p-1 bg-white ${sel === x.id ? "border-violet-500 ring-2 ring-violet-200" : "border-slate-200"} ${w.bin[x.id] === "poly" ? "bg-emerald-50" : w.bin[x.id] === "not" ? "bg-rose-50" : ""}`}>
            <svg viewBox="0 0 100 100" className="w-full h-14">
              <GateFigure name={x.name} />
            </svg>
            <div className="text-[11px] font-black">{x.id}</div>
          </button>
        ))}
      </div>
      {s && (
        <div className="grid md:grid-cols-[1fr_1fr] gap-3 mt-2">
          <Bay label={`Gate — figure ${s.id}`} tone="dark">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 100 100" className="w-24 h-24 bg-slate-800 rounded-lg">
                <GateFigure name={s.name} />
              </svg>
              <div className="space-y-1.5 text-sm font-bold">
                <div>Closed? {scanned ? (s.closed ? "🟢 yes" : "🔴 no — the ends don't meet") : "…"}</div>
                <div>Only straight sides? {scanned ? (s.straight ? "🟢 yes" : "🔴 no — it curves") : "…"}</div>
              </div>
            </div>
            <Btn tone="sky" className="mt-2" disabled={play.readOnly || scanned} onClick={() => play.patch({ scanned: [...w.scanned, sel] })}>
              {scanned ? "Scanned" : "Run the gate"}
            </Btn>
          </Bay>
          <Bay label="Sort it">
            <div className="flex flex-wrap gap-2">
              <Btn tone="emerald" disabled={play.readOnly || !scanned} active={w.bin[sel] === "poly"} onClick={() => play.patch({ bin: { ...w.bin, [sel]: "poly" } })}>
                → Polygon bin
              </Btn>
              <Btn tone="rose" disabled={play.readOnly || !scanned} active={w.bin[sel] === "not"} onClick={() => play.patch({ bin: { ...w.bin, [sel]: "not" } })}>
                → Reject bin
              </Btn>
            </div>
            {!scanned && <p className="text-[11px] font-bold text-slate-500 mt-1">Run the gate before sorting.</p>}
          </Bay>
        </div>
      )}
    </Shell>
  );
}

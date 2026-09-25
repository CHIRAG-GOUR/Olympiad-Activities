"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Zap, PencilRuler, Footprints, Scale, Beaker } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchNumberList, matchText } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, Label3D, approach, Floor } from "./three";
import { clientToSvg } from "./svgPoint";

/** Pointer position inside an SVG, in viewBox units. */
function useSvgPointer(svg: React.RefObject<SVGSVGElement | null>, vbW: number, vbH: number) {
  void vbW;
  void vbH;
  return (clientX: number, clientY: number) => clientToSvg(svg.current, clientX, clientY);
}

/** A draggable SVG handle; reports positions in viewBox units. */
function Handle({
  x,
  y,
  svg,
  vb,
  onMove,
  onEnd,
  readOnly,
  r = 3,
  fill = "#7c3aed",
  children,
}: {
  x: number;
  y: number;
  svg: React.RefObject<SVGSVGElement | null>;
  vb: [number, number];
  onMove: (x: number, y: number) => void;
  onEnd?: () => void;
  readOnly?: boolean;
  r?: number;
  fill?: string;
  children?: React.ReactNode;
}) {
  const at = useSvgPointer(svg, vb[0], vb[1]);
  const { start, dragging } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const q = at(p.x, p.y);
      if (q) onMove(q.x, q.y);
    },
    onEnd: () => onEnd?.(),
  });
  return (
    <g onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: readOnly ? "default" : dragging ? "grabbing" : "grab", touchAction: "none" }}>
      <circle cx={x} cy={y} r={r * 2.4} fill="transparent" />
      <circle cx={x} cy={y} r={r} fill={fill} stroke="#fff" strokeWidth={0.8} />
      {children}
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q21 — Laser Line Studio (2D)
   Three laser beams cross a dark board. Each has a pivot to drag and a tip to swing. The
   board marks every distinct crossing point live. The student pushes the count as low as
   it will go while every beam still meets another, then records it.
   ══════════════════════════════════════════════════════════════════════ */

interface Beam {
  x: number;
  y: number;
  deg: number;
}
interface LaserWorld {
  beams: Beam[];
  recorded: number | null;
}
const BEAM_COLORS = ["#f43f5e", "#22d3ee", "#facc15"];

function crossings(beams: Beam[]) {
  const pts: { x: number; y: number }[] = [];
  const meets = beams.map(() => false);
  for (let i = 0; i < beams.length; i++)
    for (let j = i + 1; j < beams.length; j++) {
      const a = beams[i];
      const b = beams[j];
      const ax = Math.cos((a.deg * Math.PI) / 180);
      const ay = Math.sin((a.deg * Math.PI) / 180);
      const bx = Math.cos((b.deg * Math.PI) / 180);
      const by = Math.sin((b.deg * Math.PI) / 180);
      const den = ax * by - ay * bx;
      if (Math.abs(den) < Math.sin((1 * Math.PI) / 180)) continue; // parallel
      const t = ((b.x - a.x) * by - (b.y - a.y) * bx) / den;
      const p = { x: a.x + t * ax, y: a.y + t * ay };
      meets[i] = meets[j] = true;
      if (!pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 1.6)) pts.push(p);
    }
  return { pts, meets };
}

export function Q21LaserLines({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const n = cfg<number>(question, "lineCount", 3);
  const svg = useRef<SVGSVGElement>(null);

  const play = usePlay<LaserWorld>({
    question,
    initial: {
      beams: Array.from({ length: n }, (_, i) => ({ x: 25 + i * 25, y: 50 + (i % 2 ? 12 : -12), deg: 20 + i * 55 })),
      recorded: null,
    },
    derive: (w) => {
      const { pts, meets } = crossings(w.beams);
      if (!meets.every(Boolean)) return { note: "Every beam must cross at least one other beam — three lines that intersect." };
      if (w.recorded === null) return { note: `The board shows ${pts.length} crossing point(s). Record when you have the minimum.` };
      return { value: `${w.recorded} crossing point${w.recorded === 1 ? "" : "s"}`, optionId: matchNumber(question, w.recorded) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const { pts, meets } = crossings(w.beams);

  const moveBeam = (i: number, patch: Partial<Beam>) =>
    play.set((p) => {
      const beams = p.beams.map((b, j) => (j === i ? { ...b, ...patch } : b));
      // Magnetic snap: a pivot dropped near the other two beams' crossing locks onto it.
      if (patch.x !== undefined) {
        const others = crossings(beams.filter((_, j) => j !== i)).pts;
        const hit = others.find((q) => Math.hypot(q.x - beams[i].x, q.y - beams[i].y) < 3.5);
        if (hit) beams[i] = { ...beams[i], x: hit.x, y: hit.y };
      }
      return { beams, recorded: null };
    });

  return (
    <PlayShell
      title="Laser Line Studio"
      mission="Drag a beam's pivot (the big dot) to move it and its tip (the small dot) to swing it. The board counts every point where beams cross. Make the count as small as possible while all three beams still intersect, then record it."
      icon={Zap}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the recorded count"
      live={
        <>
          <Gauge label="Crossing points now" value={pts.length} tone="violet" />
          <Gauge label="Beams meeting another" value={`${meets.filter(Boolean).length} / ${n}`} tone={meets.every(Boolean) ? "emerald" : "amber"} />
        </>
      }
    >
      <div className="rounded-2xl bg-slate-950 p-1">
        <svg ref={svg} viewBox="0 0 100 100" className="w-full max-h-[380px]" style={{ touchAction: "none" }}>
          <defs>
            <filter id="imo6a-glow">
              <feGaussianBlur stdDeviation="0.8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {w.beams.map((b, i) => {
            const dx = Math.cos((b.deg * Math.PI) / 180) * 150;
            const dy = Math.sin((b.deg * Math.PI) / 180) * 150;
            return <line key={i} x1={b.x - dx} y1={b.y - dy} x2={b.x + dx} y2={b.y + dy} stroke={BEAM_COLORS[i]} strokeWidth={0.9} filter="url(#imo6a-glow)" />;
          })}
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.2} fill="none" stroke="#fff" strokeWidth={0.6}>
              <animate attributeName="r" values="1.6;2.8;1.6" dur="1.2s" repeatCount="indefinite" />
            </circle>
          ))}
          {w.beams.map((b, i) => {
            const tx = b.x + Math.cos((b.deg * Math.PI) / 180) * 16;
            const ty = b.y + Math.sin((b.deg * Math.PI) / 180) * 16;
            return (
              <g key={i}>
                <Handle x={b.x} y={b.y} svg={svg} vb={[100, 100]} fill={BEAM_COLORS[i]} r={2.6} readOnly={play.readOnly} onMove={(x, y) => moveBeam(i, { x: clamp(x, 2, 98), y: clamp(y, 2, 98) })} />
                <Handle
                  x={tx}
                  y={ty}
                  svg={svg}
                  vb={[100, 100]}
                  fill="#e2e8f0"
                  r={1.6}
                  readOnly={play.readOnly}
                  onMove={(x, y) => moveBeam(i, { deg: Math.round((Math.atan2(y - b.y, x - b.x) * 180) / Math.PI) })}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <Btn tone="violet" active disabled={play.readOnly || !meets.every(Boolean)} onClick={() => play.patch({ recorded: pts.length })}>
        Record {pts.length} crossing point{pts.length === 1 ? "" : "s"}
      </Btn>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q22 — Geometry Construction Workshop (2D)
   A working pair of compasses and a ruler. Open the compass against the ruler, plant its
   point, and sweep the pencil round to draw. The bench checks what has really been
   constructed: a full circle of the known radius, and the perpendicular bisector drawn
   through the crossings of two equal arcs from the ends of the segment.
   ══════════════════════════════════════════════════════════════════════ */

const CM = 10;
const BINS = 72;
type Centre = "O" | "A" | "B";
interface ArcRec {
  r: number;
  bins: number[];
}
interface BenchWorld {
  task: "circle" | "bisector";
  centre: Centre;
  radius: number;
  arcs: Partial<Record<Centre, ArcRec>>;
  line: boolean;
  declaredNone: boolean;
}

export function Q22ConstructionBench({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const tasks = cfg<{ id: string; label: string; optionId: string }[]>(question, "tasks", []);
  const both = cfg<string>(question, "bothOptionId", "");
  const neither = cfg<string>(question, "neitherOptionId", "");
  const p = cfg<{ radiusCm: number; segmentCm: number }>(question, "play", { radiusCm: 3, segmentCm: 4 });
  const svg = useRef<SVGSVGElement>(null);
  const at = useSvgPointer(svg, 160, 100);

  const pts: Record<Centre, { x: number; y: number }> = {
    O: { x: 40, y: 50 },
    A: { x: 100 - (p.segmentCm * CM) / 2 + 20, y: 50 },
    B: { x: 100 + (p.segmentCm * CM) / 2 + 20, y: 50 },
  };

  const crossingsOf = (w: BenchWorld) => {
    const a = w.arcs.A;
    const b = w.arcs.B;
    if (!a || !b || Math.abs(a.r - b.r) > 0.05 || a.r * 2 <= p.segmentCm) return null;
    const h = Math.sqrt(a.r * a.r - (p.segmentCm / 2) ** 2) * CM;
    const mx = (pts.A.x + pts.B.x) / 2;
    const P = { x: mx, y: 50 - h };
    const Q = { x: mx, y: 50 + h };
    const covers = (c: Centre, q: { x: number; y: number }) => {
      const arc = w.arcs[c]!;
      const ang = ((Math.atan2(q.y - pts[c].y, q.x - pts[c].x) * 180) / Math.PI + 360) % 360;
      return arc.bins.includes(Math.floor(ang / (360 / BINS)) % BINS);
    };
    if (![P, Q].every((q) => covers("A", q) && covers("B", q))) return null;
    return [P, Q];
  };
  const doneCircle = (w: BenchWorld) => !!w.arcs.O && Math.abs(w.arcs.O.r - p.radiusCm) < 0.05 && w.arcs.O.bins.length >= BINS;
  const doneBisector = (w: BenchWorld) => w.line && !!crossingsOf(w);

  const play = usePlay<BenchWorld>({
    question,
    initial: { task: "circle", centre: "O", radius: 1, arcs: {}, line: false, declaredNone: false },
    derive: (w) => {
      const c = doneCircle(w);
      const b = doneBisector(w);
      if (c && b) return { value: "Both constructions completed", optionId: both };
      if (c) return { value: "Only the circle constructed", optionId: tasks.find((t) => t.id === "circle")?.optionId, note: "Still to try: the perpendicular bisector." };
      if (b) return { value: "Only the bisector constructed", optionId: tasks.find((t) => t.id === "bisector")?.optionId, note: "Still to try: the circle." };
      if (w.declaredNone) return { value: "Declared: neither can be made", optionId: neither };
      return { note: "Complete a construction on the bench." };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const c = pts[w.centre];
  const lastAng = useRef<number | null>(null);
  const [pencilAng, setPencilAng] = React.useState(-45);
  // Re-planting the point parks the pencil where it can be grabbed: B sits near the right
  // edge of the bench, so its pencil starts up and to the left rather than off-canvas.
  React.useEffect(() => setPencilAng(w.centre === "B" ? 225 : -45), [w.centre]);
  const px = c.x + w.radius * CM * Math.cos((pencilAng * Math.PI) / 180);
  const py = c.y + w.radius * CM * Math.sin((pencilAng * Math.PI) / 180);

  const sweep = usePointerDrag({
    disabled: readOnly,
    onStart: () => (lastAng.current = null),
    onMove: (pt) => {
      const q = at(pt.x, pt.y);
      if (!q) return;
      const ang = ((Math.atan2(q.y - c.y, q.x - c.x) * 180) / Math.PI + 360) % 360;
      setPencilAng(ang);
      const prev = lastAng.current ?? ang;
      lastAng.current = ang;
      let d = ang - prev;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      const steps = Math.max(1, Math.ceil(Math.abs(d) / 2));
      const add = new Set<number>();
      for (let k = 0; k <= steps; k++) {
        const a = (prev + (d * k) / steps + 360) % 360;
        add.add(Math.floor(a / (360 / BINS)) % BINS);
      }
      play.set((pw) => {
        const cur = pw.arcs[pw.centre];
        const same = cur && Math.abs(cur.r - pw.radius) < 0.001;
        const bins = new Set(same ? cur!.bins : []);
        add.forEach((b) => bins.add(b));
        return { ...pw, declaredNone: false, arcs: { ...pw.arcs, [pw.centre]: { r: pw.radius, bins: [...bins].sort((m, n) => m - n) } } };
      });
    },
  });

  const cross = crossingsOf(w);

  const arcPath = (centre: Centre, rec: ArcRec) =>
    rec.bins
      .map((b) => {
        const a0 = (b * (360 / BINS) * Math.PI) / 180;
        const a1 = ((b + 1) * (360 / BINS) * Math.PI) / 180;
        const R = rec.r * CM;
        const o = pts[centre];
        return `M ${o.x + R * Math.cos(a0)} ${o.y + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${o.x + R * Math.cos(a1)} ${o.y + R * Math.sin(a1)}`;
      })
      .join(" ");

  return (
    <PlayShell
      title="Geometry Construction Workshop"
      mission={`Set the compass opening by sliding the pencil leg along the ruler, choose where to plant the point, then drag the pencil round to sweep an arc. Task 1: a circle of radius ${p.radiusCm} cm. Task 2: the perpendicular bisector of AB (${p.segmentCm} cm) from two equal arcs.`}
      icon={PencilRuler}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit what the bench built"
      live={
        <>
          <Gauge label="Compass opening" value={`${w.radius.toFixed(1)} cm`} tone="violet" />
          <Gauge label="Circle" value={doneCircle(w) ? "constructed ✓" : "not yet"} tone={doneCircle(w) ? "emerald" : "slate"} />
          <Gauge label="Bisector" value={doneBisector(w) ? "constructed ✓" : cross ? "arcs cross — join them" : "not yet"} tone={doneBisector(w) ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {(["circle", "bisector"] as const).map((t) => (
          <Btn key={t} active={w.task === t} disabled={play.readOnly} onClick={() => play.patch({ task: t, centre: t === "circle" ? "O" : "A" })}>
            {t === "circle" ? `Task 1: circle of radius ${p.radiusCm} cm` : "Task 2: perpendicular bisector of AB"}
          </Btn>
        ))}
      </div>
      <div className="rounded-2xl border-2 border-slate-200 bg-[linear-gradient(#e2e8f0_1px,transparent_1px),linear-gradient(90deg,#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px] bg-white">
        <svg ref={svg} viewBox="0 0 160 100" className="w-full" style={{ touchAction: "none" }}>
          {(Object.keys(w.arcs) as Centre[]).map((k) => (
            <path key={k} d={arcPath(k, w.arcs[k]!)} stroke="#1e1b4b" strokeWidth={0.6} fill="none" />
          ))}
          {w.task === "bisector" && <line x1={pts.A.x} y1={50} x2={pts.B.x} y2={50} stroke="#1e1b4b" strokeWidth={0.9} />}
          {cross && (
            <>
              {cross.map((q, i) => (
                <circle key={i} cx={q.x} cy={q.y} r={1.3} fill="#be123c" />
              ))}
              {w.line && <line x1={cross[0].x} y1={2} x2={cross[1].x} y2={98} stroke="#be123c" strokeWidth={0.8} />}
            </>
          )}
          {(w.task === "circle" ? (["O"] as Centre[]) : (["A", "B"] as Centre[])).map((k) => (
            <g key={k}>
              <circle cx={pts[k].x} cy={pts[k].y} r={1.2} fill="#0f172a" />
              <text x={pts[k].x - 3} y={pts[k].y + 5} fontSize={4} fontWeight={800}>
                {k}
              </text>
            </g>
          ))}
          {/* the compass: point leg on the centre, pencil leg on the circle */}
          <line x1={c.x} y1={c.y} x2={(c.x + px) / 2} y2={Math.min(c.y, py) - 14} stroke="#475569" strokeWidth={1.2} />
          <line x1={(c.x + px) / 2} y1={Math.min(c.y, py) - 14} x2={px} y2={py} stroke="#475569" strokeWidth={1.2} />
          <g onPointerDown={(e) => sweep.start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: "grab", touchAction: "none" }}>
            <circle cx={px} cy={py} r={6} fill="transparent" />
            <circle cx={px} cy={py} r={2.2} fill="#f59e0b" stroke="#fff" strokeWidth={0.6} />
          </g>
          {/* ruler along the bottom */}
          <rect x={4} y={86} width={90} height={10} fill="#fef3c7" stroke="#d97706" strokeWidth={0.5} />
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i}>
              <line x1={8 + i * CM} y1={86} x2={8 + i * CM} y2={90} stroke="#92400e" strokeWidth={0.4} />
              <text x={8 + i * CM} y={94.5} fontSize={3} textAnchor="middle" fill="#92400e">
                {i}
              </text>
            </g>
          ))}
          <Handle
            x={8 + w.radius * CM}
            y={88}
            svg={svg}
            vb={[160, 100]}
            fill="#7c3aed"
            r={2}
            readOnly={play.readOnly}
            onMove={(x) => play.patch({ radius: Math.round(clamp((x - 8) / CM, 0.5, 8) * 10) / 10 })}
          />
          <line x1={8} y1={88} x2={8 + w.radius * CM} y2={88} stroke="#7c3aed" strokeWidth={0.8} />
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {w.task === "bisector" && (
          <>
            <span className="text-[10px] font-bold text-slate-500">PLANT THE POINT AT:</span>
            {(["A", "B"] as Centre[]).map((k) => (
              <Btn key={k} active={w.centre === k} disabled={play.readOnly} onClick={() => play.patch({ centre: k })} className="w-12">
                {k}
              </Btn>
            ))}
            <Btn tone="rose" active disabled={play.readOnly || !cross} onClick={() => play.patch({ line: true })}>
              📏 Join the crossings with the ruler
            </Btn>
          </>
        )}
        <Btn disabled={play.readOnly} onClick={() => play.set((pw) => ({ ...pw, arcs: { ...pw.arcs, [pw.centre]: undefined }, line: false }))}>
          Erase arcs at {w.centre}
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => play.patch({ declaredNone: true })}>
          Neither can be made
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — Number Line Journey (2D)
   A giant number line with 1 cm between marks. The student walks the traveller to one end
   of the segment, plants a flag, walks to the other end and declares arrival. The tape
   between flag and traveller measures every step.
   ══════════════════════════════════════════════════════════════════════ */

interface JourneyWorld {
  pos: number;
  flag: number | null;
  arrived: number | null;
}

export function Q23NumberLineJourney({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const min = cfg<number>(question, "min", -12);
  const max = cfg<number>(question, "max", 12);
  const endpoints = cfg<number[]>(question, "endpoints", []);
  const svg = useRef<SVGSVGElement>(null);
  const X = (v: number) => 6 + ((v - min) / (max - min)) * 188;

  const play = usePlay<JourneyWorld>({
    question,
    initial: { pos: 0, flag: null, arrived: null },
    derive: (w) => {
      if (w.flag === null) return { note: "Walk to one end of the segment and plant the start flag." };
      if (w.arrived === null) return { note: "Walk to the other end and declare arrival." };
      const d = Math.abs(w.arrived - w.flag);
      return { value: `${d} cm`, optionId: matchNumber(question, d), note: `From ${w.flag} to ${w.arrived}` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const tape = w.flag !== null ? Math.abs(w.pos - w.flag) : 0;

  return (
    <PlayShell
      title="Number Line Journey"
      mission={`Drag the traveller along the number line. Plant the flag at one end of the segment (${endpoints.join(" and ")} are its ends), then walk to the other end. The measuring tape counts every 1 cm step.`}
      icon={Footprints}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the distance travelled"
      live={
        <>
          <Gauge label="Traveller at" value={w.pos} tone="violet" />
          <Gauge label="Flag at" value={w.flag ?? "—"} />
          <Gauge label="Tape" value={`${tape} cm`} tone="sky" />
        </>
      }
    >
      <div className="rounded-2xl bg-gradient-to-b from-sky-100 to-emerald-50 border-2 border-sky-200 p-2">
        <svg ref={svg} viewBox="0 0 200 70" className="w-full" style={{ touchAction: "none" }}>
          <line x1={2} y1={48} x2={198} y2={48} stroke="#1e1b4b" strokeWidth={0.8} />
          {Array.from({ length: max - min + 1 }).map((_, i) => {
            const v = min + i;
            return (
              <g key={v}>
                <line x1={X(v)} y1={45} x2={X(v)} y2={51} stroke="#1e1b4b" strokeWidth={v === 0 ? 0.9 : 0.5} />
                <text x={X(v)} y={58} fontSize={3.4} textAnchor="middle" fontWeight={v === 0 ? 900 : 600} fill="#334155">
                  {v}
                </text>
              </g>
            );
          })}
          {w.flag !== null && (
            <>
              <rect x={Math.min(X(w.flag), X(w.pos))} y={40} width={Math.abs(X(w.pos) - X(w.flag))} height={4} fill="#facc15" stroke="#ca8a04" strokeWidth={0.4} />
              <text x={(X(w.flag) + X(w.pos)) / 2} y={38} fontSize={4} textAnchor="middle" fontWeight={900} fill="#854d0e">
                {tape} cm
              </text>
              <g transform={`translate(${X(w.flag)} 48)`}>
                <line x1={0} y1={0} x2={0} y2={-26} stroke="#334155" strokeWidth={0.6} />
                <path d="M 0 -26 L 8 -23 L 0 -20 Z" fill="#e11d48" />
              </g>
            </>
          )}
          <Handle
            x={X(w.pos)}
            y={30}
            svg={svg}
            vb={[200, 70]}
            r={3.4}
            fill="#7c3aed"
            readOnly={play.readOnly}
            onMove={(x) => {
              const v = Math.round(min + ((x - 6) / 188) * (max - min));
              const pos = clamp(v, min, max);
              if (pos !== w.pos) play.set((p) => ({ ...p, pos, arrived: null }));
            }}
          >
            <text x={X(w.pos)} y={24} fontSize={9} textAnchor="middle" pointerEvents="none">
              🚶
            </text>
          </Handle>
        </svg>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, pos: Math.max(min, p.pos - 1), arrived: null }))}>
          ◀ step
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, pos: Math.min(max, p.pos + 1), arrived: null }))}>
          step ▶
        </Btn>
        <Btn tone="rose" active={w.flag !== null} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, flag: p.pos, arrived: null }))}>
          🚩 Plant flag here
        </Btn>
        <Btn tone="emerald" active disabled={play.readOnly || w.flag === null || w.pos === w.flag} onClick={() => play.patch({ arrived: w.pos })}>
          I have arrived
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — Ratio Balance (3D)
   1162 units start in the reservoir. Three glass columns rise to 4×, 5× and 7× what the
   student pours into them. A glass shelf rests on the three tops and lies level only when
   the three weighted amounts are equal.
   ══════════════════════════════════════════════════════════════════════ */

interface PourWorld {
  parts: number[];
  step: number;
}

function Column({ x, height, color, label }: { x: number; height: number; color: string; label: string }) {
  const liquid = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!liquid.current) return;
    const h = approach(liquid.current.scale.y, Math.max(0.001, height), 5, dt);
    liquid.current.scale.y = h;
    liquid.current.position.y = h / 2;
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 3.4, 32, 1, true]} />
        <meshStandardMaterial color="#e0e7ff" transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={liquid} scale={[1, 0.001, 1]}>
        <cylinderGeometry args={[0.46, 0.46, 1, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} transparent opacity={0.85} />
      </mesh>
      <Label3D text={label} position={[0, -0.01, 0.95]} rotation={[-Math.PI / 2, 0, 0]} size={[1.5, 0.45]} style={{ bg: "#ffffff", fg: "#1e1b4b", scale: 0.55 }} />
    </group>
  );
}

function Shelf({ heights }: { heights: number[] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [h1, h2, h3] = heights;
  useFrame((_, dt) => {
    if (!ref.current) return;
    const tilt = Math.atan2(h3 - h1, 4);
    const mid = Math.max((h1 + h3) / 2, h2);
    ref.current.rotation.z = approach(ref.current.rotation.z, tilt, 4, dt);
    ref.current.position.y = approach(ref.current.position.y, mid + 0.06, 4, dt);
  });
  const level = Math.abs(h1 - h2) < 1e-6 && Math.abs(h2 - h3) < 1e-6 && h1 > 0;
  return (
    <mesh ref={ref} position={[0, 0.1, 0]} castShadow>
      <boxGeometry args={[5.4, 0.08, 1.3]} />
      <meshStandardMaterial color={level ? "#34d399" : "#a5b4fc"} transparent opacity={0.7} />
    </mesh>
  );
}

export function Q24RatioBalance({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = cfg<number>(question, "total", 1162);
  const mult = cfg<number[]>(question, "multipliers", [4, 5, 7]);
  const labels = cfg<string[]>(question, "partLabels", []);

  const play = usePlay<PourWorld>({
    question,
    initial: { parts: mult.map(() => 0), step: 100 },
    derive: (w) => {
      const used = w.parts.reduce((a, b) => a + b, 0);
      if (used !== total) return { note: `${total - used} units still in the reservoir — pour them all.` };
      const weighted = w.parts.map((p, i) => p * mult[i]);
      return {
        value: w.parts.join(", "),
        optionId: matchNumberList(question, w.parts),
        note: weighted.every((x) => x === weighted[0]) ? "The shelf is level: all three weighted amounts are equal." : "The shelf is not level yet.",
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const used = w.parts.reduce((a, b) => a + b, 0);
  const reservoir = total - used;
  const weighted = w.parts.map((p, i) => p * mult[i]);
  const scale = 3.2 / (total * Math.max(...mult) * 0.55);
  const heights = weighted.map((x) => x * scale);

  const pour = (i: number, dir: 1 | -1) =>
    play.set((p) => {
      const parts = [...p.parts];
      const room = dir > 0 ? total - parts.reduce((a, b) => a + b, 0) : parts[i];
      parts[i] += dir * Math.min(p.step, room);
      return { ...p, parts };
    });

  return (
    <PlayShell
      title="Ratio Balance"
      mission={`Pour the ${total} units from the reservoir into the three parts. Each column rises to ${mult.join("×, ")}× what you pour into it. Keep pouring until the glass shelf lies level and the reservoir is empty.`}
      icon={Scale}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the three parts"
      live={
        <>
          <Gauge label="Reservoir" value={reservoir} tone={reservoir === 0 ? "emerald" : "amber"} />
          {w.parts.map((p, i) => (
            <Gauge key={i} label={labels[i] ?? `Part ${i + 1}`} value={`${p} → ${mult[i]}×${p} = ${weighted[i]}`} tone="violet" />
          ))}
        </>
      }
    >
      <Stage3D height={320} camera={{ position: [0, 3.4, 7.2], fov: 42 }} orbitTarget={[0, 1.3, 0]} readOnly={play.readOnly}>
        <Floor />
        {w.parts.map((_, i) => (
          <Column key={i} x={(i - 1) * 2} height={heights[i]} color={["#8b5cf6", "#0ea5e9", "#f59e0b"][i]} label={`${mult[i]} × ${labels[i] ?? `part ${i + 1}`}`} />
        ))}
        <group position={[0, 0, 0]}>
          <Shelf heights={heights} />
        </group>
      </Stage3D>
      <div className="grid sm:grid-cols-3 gap-2">
        {w.parts.map((p, i) => (
          <Bay key={i} label={labels[i] ?? `Part ${i + 1}`} tone="violet">
            <div className="flex items-center justify-between gap-2">
              <Btn disabled={play.readOnly || p === 0} onClick={() => pour(i, -1)}>
                − {w.step}
              </Btn>
              <span className="font-mono text-xl font-black text-violet-900">{p}</span>
              <Btn disabled={play.readOnly || reservoir === 0} onClick={() => pour(i, 1)}>
                + {w.step}
              </Btn>
            </div>
          </Bay>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-500">POUR SIZE:</span>
        {[100, 10, 1].map((s) => (
          <Btn key={s} active={w.step === s} disabled={play.readOnly} onClick={() => play.patch({ step: s })} className="w-14">
            {s}
          </Btn>
        ))}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — Decimal → Fraction Workshop (2D)
   A tank of ten cells. The student fills it to read 0.6, locks that water level, then
   rebuilds the tank with a new number of cells. The water stays where it is; the student
   has to count how many of the new cells it fills.
   ══════════════════════════════════════════════════════════════════════ */

interface TankWorld {
  den: number;
  num: number;
  lockedLevel: number | null;
}

export function Q25DecimalTank({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const target = cfg<number>(question, "targetDecimal", 0.6);
  const svg = useRef<SVGSVGElement>(null);
  const at = useSvgPointer(svg, 60, 120);

  const play = usePlay<TankWorld>({
    question,
    initial: { den: 10, num: 0, lockedLevel: null },
    derive: (w) => {
      if (w.lockedLevel === null) return { note: `Fill the tank until it reads ${target}, then lock the water level.` };
      if (w.den === 10) return { note: "Rebuild the tank with the question's denominator." };
      const text = `${w.num}/${w.den}`;
      const match = Math.abs(w.num / w.den - w.lockedLevel) < 1e-9;
      return { value: text, optionId: matchText(question, text), note: match ? "Your count matches the locked water level." : "Your count does not match the water level yet." };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const H = 100;
  const cellH = H / w.den;

  const fill = usePointerDrag({
    disabled: readOnly,
    onStart: (p) => set(p.x, p.y),
    onMove: (p) => set(p.x, p.y),
  });
  function set(cx: number, cy: number) {
    const q = at(cx, cy);
    if (!q) return;
    const frac = clamp((110 - q.y) / H, 0, 1);
    const num = Math.round(frac * w.den);
    if (num !== w.num) play.patch({ num });
  }

  return (
    <PlayShell
      title="Decimal → Fraction Workshop"
      mission={`Drag inside the tank to fill it cell by cell until the gauge reads ${target}, then lock the water level. Rebuild the tank with a new number of cells: the water stays put, and you count how many of the new cells it fills.`}
      icon={Beaker}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the fraction"
      live={
        <>
          <Gauge label="Cells" value={w.den} tone="violet" />
          <Gauge label="Filled" value={`${w.num} / ${w.den}`} />
          <Gauge label="Gauge reads" value={(w.num / w.den).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")} tone="sky" />
          {w.lockedLevel !== null && <Gauge label="Locked water level" value={w.lockedLevel} tone="emerald" />}
        </>
      }
    >
      <div className="grid sm:grid-cols-[auto_1fr] gap-4 items-start">
        <svg ref={svg} viewBox="0 0 60 120" className="w-40" style={{ touchAction: "none" }} onPointerDown={(e) => fill.start(e, undefined)}>
          <rect x={10} y={10} width={40} height={H} rx={3} fill="#f8fafc" stroke="#1e1b4b" strokeWidth={1} />
          <motion.rect x={11} width={38} animate={{ y: 110 - (w.num / w.den) * H, height: (w.num / w.den) * H }} fill="#38bdf8" opacity={0.75} />
          {Array.from({ length: w.den - 1 }).map((_, i) => (
            <line key={i} x1={10} x2={w.den > 30 ? 18 : 50} y1={110 - (i + 1) * cellH} y2={110 - (i + 1) * cellH} stroke="#1e1b4b" strokeWidth={w.den > 30 ? 0.25 : 0.4} />
          ))}
          {w.lockedLevel !== null && (
            <g>
              <line x1={6} x2={54} y1={110 - w.lockedLevel * H} y2={110 - w.lockedLevel * H} stroke="#e11d48" strokeWidth={0.8} strokeDasharray="2 1" />
              <text x={55} y={112 - w.lockedLevel * H} fontSize={4} fill="#e11d48" fontWeight={900}>
                lock
              </text>
            </g>
          )}
        </svg>
        <div className="space-y-3">
          <Btn tone="rose" active disabled={play.readOnly || w.lockedLevel !== null || w.num / w.den !== target} onClick={() => play.patch({ lockedLevel: w.num / w.den })}>
            🔒 Lock the water level at {(w.num / w.den).toFixed(2)}
          </Btn>
          <Bay label="Rebuild the tank" tone="violet">
            <div className="flex flex-wrap items-center gap-2">
              <Btn disabled={play.readOnly || w.lockedLevel === null} onClick={() => play.patch({ den: Math.max(5, w.den - 5), num: 0 })}>
                − 5 cells
              </Btn>
              <span className="font-mono text-2xl font-black text-violet-900 w-12 text-center">{w.den}</span>
              <Btn disabled={play.readOnly || w.lockedLevel === null} onClick={() => play.patch({ den: Math.min(100, w.den + 5), num: 0 })}>
                + 5 cells
              </Btn>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500">FINE FILL:</span>
              <Btn disabled={play.readOnly || w.num === 0} onClick={() => play.patch({ num: w.num - 1 })}>
                − 1 cell
              </Btn>
              <Btn disabled={play.readOnly || w.num === w.den} onClick={() => play.patch({ num: w.num + 1 })}>
                + 1 cell
              </Btn>
            </div>
          </Bay>
          <div className="font-mono text-3xl font-black text-slate-900">
            <span className="inline-flex flex-col items-center leading-none">
              <span>{w.num}</span>
              <span className="w-full h-0.5 bg-slate-900 my-1" />
              <span>{w.den}</span>
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Flag, Pyramid, ScanLine, Network, Store } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchNumberList, matchText, reduceFraction, round } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, approach, Floor, Label3D } from "./three";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — Fraction Number-Line Race (2D)
   Four runners wear fraction bibs. The student places each runner on the 0-to-1 track
   where they think that fraction lives. Firing the starting gun sends every runner to
   their true spot as ghosts, so the student can see, rethink and re-place. The order of
   the student's own placements is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface Runner {
  id: string;
  num: number;
  den: number;
}
interface RaceWorld {
  spots: Record<string, number | null>;
  raced: boolean;
}

function RunnerChip({ r, x, svg, onDrop, readOnly, y }: { r: Runner; x: number; y: number; svg: React.RefObject<SVGSVGElement | null>; onDrop: (x: number) => void; readOnly?: boolean }) {
  const [drag, setDrag] = useState<number | null>(null);
  const { start } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const rect = svg.current?.getBoundingClientRect();
      if (rect) setDrag(clamp(((p.x - rect.left) / rect.width) * 220, 0, 220));
    },
    onEnd: () => {
      if (drag !== null) onDrop(drag);
      setDrag(null);
    },
  });
  const cx = drag ?? x;
  return (
    <g aria-label={`runner ${r.num}/${r.den}`} onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: readOnly ? "default" : "grab", touchAction: "none" }}>
      <rect x={cx - 9} y={y - 9} width={18} height={18} rx={4} fill="#7c3aed" stroke="#fff" strokeWidth={0.8} />
      <text x={cx} y={y - 0.8} textAnchor="middle" fontSize={5} fontWeight={900} fill="#fff">
        {r.num}
      </text>
      <line x1={cx - 4} x2={cx + 4} y1={y + 0.4} y2={y + 0.4} stroke="#fff" strokeWidth={0.6} />
      <text x={cx} y={y + 6} textAnchor="middle" fontSize={5} fontWeight={900} fill="#fff">
        {r.den}
      </text>
      <text x={cx} y={y - 11} textAnchor="middle" fontSize={7}>
        🏃
      </text>
    </g>
  );
}

export function Q31FractionRace({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const runners = cfg<Runner[]>(question, "fractions", []);
  const svg = useRef<SVGSVGElement>(null);
  const X = (v: number) => 10 + v * 200;
  const V = (x: number) => clamp((x - 10) / 200, 0, 1);

  const play = usePlay<RaceWorld>({
    question,
    initial: { spots: Object.fromEntries(runners.map((r) => [r.id, null])), raced: false },
    derive: (w) => {
      if (runners.some((r) => w.spots[r.id] === null)) return { note: "Place every runner on the track." };
      const order = [...runners].sort((a, b) => (w.spots[a.id] as number) - (w.spots[b.id] as number));
      const text = order.map((r) => `${r.num}/${r.den}`).join(", ");
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const waiting = runners.filter((r) => w.spots[r.id] === null);

  return (
    <PlayShell
      title="Fraction Number-Line Race"
      mission="Drag each runner onto the track at the spot where you think its fraction lives, smallest nearest 0. Fire the starting gun to send ghost runners to their true spots, then re-place yours if you want to."
      icon={Flag}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit my finishing order"
      live={<Gauge label="Runners on the track" value={`${runners.length - waiting.length} / ${runners.length}`} tone="violet" />}
    >
      <div className="rounded-2xl bg-gradient-to-b from-emerald-100 to-emerald-50 border-2 border-emerald-200 p-2">
        <svg ref={svg} viewBox="0 0 220 110" className="w-full" style={{ touchAction: "none" }}>
          <rect x={4} y={48} width={212} height={20} rx={10} fill="#fb923c" opacity={0.35} />
          <line x1={X(0)} x2={X(1)} y1={58} y2={58} stroke="#1e1b4b" strokeWidth={0.8} />
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i}>
              <line x1={X(i / 10)} x2={X(i / 10)} y1={54} y2={62} stroke="#1e1b4b" strokeWidth={i % 5 ? 0.4 : 0.9} />
              {i % 5 === 0 && (
                <text x={X(i / 10)} y={74} textAnchor="middle" fontSize={5} fontWeight={800}>
                  {i / 10}
                </text>
              )}
            </g>
          ))}
          {w.raced &&
            runners.map((r) => (
              <motion.g key={`ghost-${r.id}`} initial={{ x: 0, opacity: 0 }} animate={{ x: X(r.num / r.den) - X(0), opacity: 0.55 }} transition={{ duration: 1.4, ease: "easeOut" }}>
                <rect x={X(0) - 7} y={80} width={14} height={14} rx={3} fill="#0f172a" />
                <text x={X(0)} y={89} textAnchor="middle" fontSize={4.5} fontWeight={900} fill="#fff">
                  {r.num}/{r.den}
                </text>
              </motion.g>
            ))}
          {runners.map((r, i) => {
            const v = w.spots[r.id];
            const x = v === null ? 22 + i * 26 : X(v);
            const y = v === null ? 22 : 38;
            return (
              <RunnerChip
                key={r.id}
                r={r}
                x={x}
                y={y}
                svg={svg}
                readOnly={play.readOnly}
                onDrop={(dx) => play.set((p) => ({ ...p, spots: { ...p.spots, [r.id]: round(V(dx), 3) } }))}
              />
            );
          })}
          {waiting.length > 0 && (
            <text x={110} y={104} textAnchor="middle" fontSize={5} fontWeight={800} fill="#065f46">
              starting pen — drag runners down onto the track
            </text>
          )}
        </svg>
      </div>
      <Btn tone="rose" active disabled={play.readOnly || waiting.length > 0} onClick={() => play.patch({ raced: true })}>
        🔫 Fire the starting gun (show true spots)
      </Btn>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — 3D Solid Folding Lab (3D)
   The printed net (a large triangle split into four) lies on the bench. The student folds
   the three outer flaps up on their hinges. Once the solid closes, they turn it over and
   tap every face to count it. The lab names the solid from its shape.
   ══════════════════════════════════════════════════════════════════════ */

const FLAP_FOLD = Math.PI - Math.acos(1 / 3); // flat → closed tetrahedron
const EDGE = 1.6;

function TriangleMesh({ pts, color, lit, onTap }: { pts: [number, number, number][]; color: string; lit: boolean; onTap: () => void }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts.flat(), 3));
    g.computeVertexNormals();
    return g;
  }, [pts]);
  return (
    <mesh geometry={geo} castShadow receiveShadow onClick={(e) => (e.stopPropagation(), onTap())}>
      <meshStandardMaterial color={lit ? "#facc15" : color} emissive={lit ? "#f59e0b" : "#000"} emissiveIntensity={lit ? 0.5 : 0} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Tetra({ folded, lit, onTap }: { folded: boolean[]; lit: string[]; onTap: (id: string) => void }) {
  const R = EDGE / Math.sqrt(3);
  const verts = [90, 210, 330].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return new THREE.Vector3(R * Math.cos(a), 0, -R * Math.sin(a));
  });
  const hOut = (EDGE * Math.sqrt(3)) / 2;
  const colors = ["#a78bfa", "#60a5fa", "#f472b6"];
  return (
    <group position={[0, 0.02, 0]}>
      <TriangleMesh pts={verts.map((v) => [v.x, v.y, v.z]) as [number, number, number][]} color="#c4b5fd" lit={lit.includes("base")} onTap={() => onTap("base")} />
      {[0, 1, 2].map((k) => {
        const a = verts[k];
        const b = verts[(k + 1) % 3];
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const n = mid.clone().setY(0).normalize();
        const phi = Math.atan2(n.x, n.z);
        return (
          <group key={k} position={[mid.x, 0, mid.z]} rotation={[0, phi, 0]}>
            <Flap angle={folded[k] ? FLAP_FOLD : 0}>
              <TriangleMesh
                pts={[
                  [-EDGE / 2, 0, 0],
                  [EDGE / 2, 0, 0],
                  [0, 0, hOut],
                ]}
                color={colors[k]}
                lit={lit.includes(`flap${k}`)}
                onTap={() => onTap(`flap${k}`)}
              />
            </Flap>
          </group>
        );
      })}
    </group>
  );
}

function Flap({ angle, children }: { angle: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.x = approach(ref.current.rotation.x, -angle, 5, dt);
  });
  return <group ref={ref}>{children}</group>;
}

interface NetWorld {
  folded: boolean[];
  counted: string[];
}

export function Q32SolidFoldingLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<NetWorld>({
    question,
    initial: { folded: [false, false, false], counted: [] },
    derive: (w) => {
      if (!w.folded.every(Boolean)) return { note: "Fold all three flaps up into a closed solid." };
      if (!w.counted.length) return { note: "Tap every face of the solid to count it." };
      // Named from what was built: a triangular base with every other face meeting at one apex.
      const name = "Triangular pyramid";
      const text = `${name}, ${w.counted.length}`;
      return { value: text, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const closed = w.folded.every(Boolean);

  return (
    <PlayShell
      title="3D Solid Folding Lab"
      mission="Tap a flap of the net to fold it up on its hinge. Once the solid has closed, drag to turn it over, and tap every face once to count it. Tap a lit face again to un-count it."
      icon={Pyramid}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit shape and face count"
      live={
        <>
          <Gauge label="Flaps folded" value={`${w.folded.filter(Boolean).length} / 3`} tone="violet" />
          <Gauge label="Faces counted" value={w.counted.length} tone="amber" />
          <Gauge label="Base" value="triangle" />
          <Gauge label="Solid" value={closed ? "closed — every side face meets at one apex" : "open net"} tone={closed ? "emerald" : "slate"} />
        </>
      }
    >
      <Stage3D height={340} camera={{ position: [2.2, 2.6, 3.2], fov: 42 }} orbitTarget={[0, 0.3, 0]} minPolar={0.05} maxPolar={Math.PI - 0.05} readOnly={play.readOnly}>
        <Floor y={-0.01} />
        <Tetra
          folded={w.folded}
          lit={w.counted}
          onTap={(id) => {
            if (play.readOnly) return;
            if (!closed && id.startsWith("flap")) {
              const k = Number(id.slice(4));
              play.set((p) => ({ ...p, counted: [], folded: p.folded.map((f, i) => (i === k ? !f : f)) }));
              return;
            }
            if (!closed) return;
            play.set((p) => ({ ...p, counted: p.counted.includes(id) ? p.counted.filter((x) => x !== id) : [...p.counted, id] }));
          }}
        />
      </Stage3D>
      <div className="flex flex-wrap gap-2">
        <Btn disabled={play.readOnly} onClick={() => play.set({ folded: [true, true, true], counted: [] })}>
          Fold all flaps
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => play.set({ folded: [false, false, false], counted: [] })}>
          Open the net
        </Btn>
        <Btn disabled={play.readOnly || !w.counted.length} onClick={() => play.patch({ counted: [] })}>
          Clear count
        </Btn>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — Divisibility Scanner (2D)
   Each candidate is a block. In the scanner the student taps its digits into the digit-
   sum wheel, then runs the division drum, which shows the quotient and the remainder
   gauge. Blocks the student judges divisible go into the ACCEPTED crate.
   ══════════════════════════════════════════════════════════════════════ */

interface ScanWorld {
  inScanner: number | null;
  fed: Record<number, number[]>;
  divided: Record<number, boolean>;
  crate: number[];
}

export function Q33DivisibilityScanner({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const divisor = cfg<number>(question, "divisor", 9);
  const cands = cfg<{ optionId: string; value: number }[]>(question, "candidates", []);

  const play = usePlay<ScanWorld>({
    question,
    initial: { inScanner: null, fed: {}, divided: {}, crate: [] },
    derive: (w) => {
      if (w.crate.length === 0) return { note: `Scan the numbers and move the one divisible by ${divisor} into the ACCEPTED crate.` };
      if (w.crate.length > 1) return { note: "The crate takes exactly one number." };
      const v = cands[w.crate[0]].value;
      return { value: String(v), optionId: matchNumber(question, v) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const k = w.inScanner;
  const cand = k !== null ? cands[k] : null;
  const digits = cand ? String(cand.value).split("").map(Number) : [];
  const fed = k !== null ? w.fed[k] ?? [] : [];
  const sum = fed.reduce((t, i) => t + digits[i], 0);

  return (
    <PlayShell
      title="Divisibility Scanner"
      mission={`Load a number block into the scanner. Tap each of its digits to drop it into the digit-sum wheel, then run the division drum by ${divisor}. Move the number you find divisible into the ACCEPTED crate.`}
      icon={ScanLine}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the accepted number"
      live={
        <>
          <Gauge label="Scanned" value={`${Object.keys(w.divided).length} / ${cands.length}`} tone="violet" />
          <Gauge label="Crate" value={w.crate.map((i) => cands[i].value).join(", ") || "empty"} tone="emerald" />
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {cands.map((c, i) => (
          <button
            key={c.value}
            type="button"
            disabled={play.readOnly}
            onClick={() => play.patch({ inScanner: i })}
            className={`min-h-[44px] px-3 rounded-xl border-2 font-mono text-lg font-black ${k === i ? "bg-violet-600 border-violet-700 text-white" : w.crate.includes(i) ? "bg-emerald-100 border-emerald-400 text-emerald-900" : "bg-white border-slate-300 text-slate-900"}`}
          >
            {c.value}
            {w.divided[i] && <span className="ml-1 text-[10px]">✓ scanned</span>}
          </button>
        ))}
      </div>
      {cand && k !== null && (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-900 p-3 text-white">
            <div className="text-[10px] font-black text-sky-300 mb-2">SCANNER BED</div>
            <div className="flex gap-1.5">
              {digits.map((d, i) => (
                <motion.button
                  key={i}
                  type="button"
                  disabled={play.readOnly || fed.includes(i)}
                  onClick={() => play.set((p) => ({ ...p, fed: { ...p.fed, [k]: [...(p.fed[k] ?? []), i] } }))}
                  animate={fed.includes(i) ? { y: 30, opacity: 0.25 } : { y: 0, opacity: 1 }}
                  className="w-10 h-12 rounded-lg bg-sky-500 font-mono text-xl font-black"
                >
                  {d}
                </motion.button>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <motion.div animate={{ rotate: sum * 24 }} className="w-16 h-16 rounded-full border-4 border-dashed border-sky-300 grid place-items-center font-mono text-xl font-black">
                {sum}
              </motion.div>
              <span className="text-xs text-sky-200 font-bold">digit-sum wheel {fed.length === digits.length ? "(all digits in)" : `(${fed.length}/${digits.length} digits)`}</span>
            </div>
          </div>
          <Bay label="Division drum" tone="violet">
            <Btn tone="sky" active disabled={play.readOnly || fed.length < digits.length} onClick={() => play.patch({ divided: { ...w.divided, [k]: true } })}>
              Run the drum: ÷ {divisor}
            </Btn>
            {w.divided[k] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                <div className="font-mono text-sm font-black text-slate-800">
                  {cand.value} = {divisor} × {Math.floor(cand.value / divisor)} + {cand.value % divisor}
                </div>
                <div className="text-[10px] font-bold text-slate-500">REMAINDER GAUGE</div>
                <div className="h-4 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${((cand.value % divisor) / (divisor - 1)) * 100}%` }} className="h-full bg-rose-500" />
                </div>
                <div className={`font-mono text-lg font-black ${cand.value % divisor === 0 ? "text-emerald-700" : "text-rose-600"}`}>REMAINDER = {cand.value % divisor}</div>
                <div className="flex gap-2">
                  <Btn tone="emerald" active={w.crate.includes(k)} disabled={play.readOnly} onClick={() => play.patch({ crate: w.crate.includes(k) ? w.crate.filter((x) => x !== k) : [...w.crate, k] })}>
                    {w.crate.includes(k) ? "Take out of crate" : "Move into ACCEPTED crate"}
                  </Btn>
                </div>
              </motion.div>
            )}
          </Bay>
        </div>
      )}
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — Number Quadrilateral Reactor (2D)
   The printed diagram, live. The student reacts each quadrilateral chamber by feeding
   its terms into the meter one by one, then runs a cable from every circle to the two
   chambers it sits between. Each circle reads the sum of the chambers wired to it.
   ══════════════════════════════════════════════════════════════════════ */

interface QuadNode {
  id: string;
  expression: string;
  terms: number[];
}
interface ReactorWorld {
  fed: Record<string, number>;
  wires: Record<string, string[]>;
  holding: string | null;
}
const QUAD_POS: Record<string, { x: number; y: number; pts: string }> = {
  TL: { x: 28, y: 22, pts: "8,8 58,8 46,38 4,38" },
  TR: { x: 132, y: 22, pts: "102,8 156,8 152,38 114,38" },
  BM: { x: 80, y: 112, pts: "66,94 94,94 104,128 80,140 56,128" },
};
const CIRCLE_POS: Record<string, { x: number; y: number }> = { P: { x: 80, y: 24 }, Q: { x: 58, y: 62 }, R: { x: 102, y: 62 } };

export function Q34QuadReactor({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const nodes = cfg<QuadNode[]>(question, "nodes", []);
  const circles = cfg<{ id: string }[]>(question, "circles", []);
  const readOrder = cfg<string[]>(question, "readOrder", []);
  const dp = cfg<number>(question, "decimals", 3);

  const valueOf = (w: ReactorWorld, id: string) => {
    const n = nodes.find((x) => x.id === id);
    if (!n || (w.fed[id] ?? 0) < n.terms.length) return null;
    return round(n.terms.reduce((a, b) => a + b, 0), dp);
  };
  const circleValue = (w: ReactorWorld, c: string) => {
    const ws = w.wires[c] ?? [];
    if (ws.length !== 2) return null;
    const vals = ws.map((q) => valueOf(w, q));
    if (vals.some((v) => v === null)) return null;
    return round((vals[0] as number) + (vals[1] as number), dp);
  };

  const play = usePlay<ReactorWorld>({
    question,
    initial: { fed: {}, wires: {}, holding: null },
    derive: (w) => {
      const vals = readOrder.map((c) => circleValue(w, c));
      if (vals.some((v) => v === null)) return { note: "React every chamber and wire every circle to two chambers." };
      return { value: vals.map((v) => (v as number).toFixed(dp)).join(", "), optionId: matchNumberList(question, vals as number[], 5e-4) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  const tapChamber = (id: string) => {
    if (play.readOnly) return;
    if (w.holding) {
      play.set((p) => {
        const cur = p.wires[p.holding!] ?? [];
        const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-2);
        return { ...p, wires: { ...p.wires, [p.holding!]: next } };
      });
      return;
    }
    const n = nodes.find((x) => x.id === id)!;
    play.set((p) => ({ ...p, fed: { ...p.fed, [id]: Math.min(n.terms.length, (p.fed[id] ?? 0) + 1) } }));
  };

  return (
    <PlayShell
      title="Number Quadrilateral Reactor"
      mission="With no circle selected, tap a chamber to feed its next term into its meter, until every term is in. Then tap a circle to pick up its cable and tap the two chambers it sits between. Each circle shows the sum of its two chambers."
      icon={Network}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit P, Q and R"
      live={
        <>
          {nodes.map((n) => (
            <Gauge key={n.id} label={`Chamber ${n.id}`} value={valueOf(w, n.id)?.toFixed(dp) ?? `${w.fed[n.id] ?? 0}/${n.terms.length} terms`} tone="violet" />
          ))}
        </>
      }
    >
      <div className="rounded-2xl bg-slate-50 border-2 border-slate-200 p-2">
        <svg viewBox="0 0 160 145" className="w-full max-h-[420px]">
          {circles.map((c) =>
            (w.wires[c.id] ?? []).map((q) => (
              <motion.line
                key={`${c.id}-${q}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={CIRCLE_POS[c.id].x}
                y1={CIRCLE_POS[c.id].y}
                x2={QUAD_POS[q].x}
                y2={QUAD_POS[q].y}
                stroke="#f59e0b"
                strokeWidth={1.4}
              />
            ))
          )}
          {nodes.map((n) => {
            const fedN = w.fed[n.id] ?? 0;
            const partial = round(n.terms.slice(0, fedN).reduce((a, b) => a + b, 0), dp);
            return (
              <g key={n.id} role="button" aria-label={`chamber ${n.id}`} onClick={() => tapChamber(n.id)} style={{ cursor: "pointer" }}>
                <polygon points={QUAD_POS[n.id].pts} fill={fedN === n.terms.length ? "#ddd6fe" : "#fff"} stroke="#1e1b4b" strokeWidth={0.8} />
                {n.terms.map((t, i) => (
                  <text key={i} x={QUAD_POS[n.id].x} y={QUAD_POS[n.id].y - 8 + i * 6.5 + (n.id === "BM" ? 6 : 0)} textAnchor="middle" fontSize={5} fontWeight={800} fill={i < fedN ? "#7c3aed" : "#334155"}>
                    {i === 0 ? t : t < 0 ? `− ${Math.abs(t)}` : `+ ${t}`}
                  </text>
                ))}
                <text x={QUAD_POS[n.id].x} y={QUAD_POS[n.id].y + (n.id === "BM" ? 19 : 14)} textAnchor="middle" fontSize={4.4} fontWeight={900} fill="#059669">
                  meter: {fedN ? partial.toFixed(dp) : "—"}
                </text>
              </g>
            );
          })}
          {circles.map((c) => {
            const v = circleValue(w, c.id);
            return (
              <g key={c.id} role="button" aria-label={`circle ${c.id}`} onClick={() => !play.readOnly && play.patch({ holding: w.holding === c.id ? null : c.id })} style={{ cursor: "pointer" }}>
                <circle cx={CIRCLE_POS[c.id].x} cy={CIRCLE_POS[c.id].y} r={14} fill={w.holding === c.id ? "#fef3c7" : v !== null ? "#dcfce7" : "#fff"} stroke={w.holding === c.id ? "#f59e0b" : "#1e1b4b"} strokeWidth={w.holding === c.id ? 1.6 : 0.8} />
                <text x={CIRCLE_POS[c.id].x} y={CIRCLE_POS[c.id].y - 2} textAnchor="middle" fontSize={7} fontWeight={900}>
                  {c.id}
                </text>
                <text x={CIRCLE_POS[c.id].x} y={CIRCLE_POS[c.id].y + 6} textAnchor="middle" fontSize={4.4} fontWeight={800} fill="#065f46">
                  {v !== null ? v.toFixed(dp) : `${(w.wires[c.id] ?? []).length}/2 wires`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-bold text-slate-600">{w.holding ? `Holding circle ${w.holding}'s cable: tap two chambers.` : "Tap a chamber to feed its next term."}</span>
        {w.holding && (
          <Btn onClick={() => play.patch({ holding: null })} disabled={play.readOnly}>
            Put cable down
          </Btn>
        )}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — Proportion Marketplace (2D)
   Four stalls, each selling two ratios. The student converts quantities with the unit
   converter until each ratio compares like with like, then weighs the stall's two ratios
   on the market balance. The stall that balances goes into the proportion basket.
   ══════════════════════════════════════════════════════════════════════ */

interface Qty {
  v: number;
  u: string;
}
interface Stall {
  optionId: string;
  left: Qty[];
  right: Qty[];
}
interface MarketWorld {
  stall: number;
  conv: Record<string, boolean>;
  weighed: number[];
  basket: number | null;
}

const BIGGER: Record<string, { to: string; f: number }> = { kg: { to: "g", f: 1000 }, m: { to: "cm", f: 100 }, L: { to: "mL", f: 1000 } };

export function Q35ProportionMarket({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const stalls = cfg<Stall[]>(question, "candidates", []);

  const shown = (w: MarketWorld, s: number, side: "left" | "right", i: number): Qty => {
    const q = stalls[s][side][i];
    const key = `${s}-${side}-${i}`;
    if (w.conv[key] && BIGGER[q.u]) return { v: q.v * BIGGER[q.u].f, u: BIGGER[q.u].to };
    return q;
  };
  const ratioOf = (w: MarketWorld, s: number, side: "left" | "right") => {
    const a = shown(w, s, side, 0);
    const b = shown(w, s, side, 1);
    if (a.u !== b.u) return null;
    return reduceFraction(a.v, b.v);
  };

  const play = usePlay<MarketWorld>({
    question,
    initial: { stall: 0, conv: {}, weighed: [], basket: null },
    derive: (w) => {
      if (w.basket === null) return { note: "Weigh the stalls and put the one whose two ratios balance into the basket." };
      const s = stalls[w.basket];
      const text = question?.multipleChoiceConfig?.options?.find((o) => o.id === s.optionId)?.text ?? s.optionId;
      return { value: text, optionId: s.optionId };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const s = w.stall;
  const L = ratioOf(w, s, "left");
  const R = ratioOf(w, s, "right");
  const tilt = L && R ? Math.max(-14, Math.min(14, (L[0] / L[1] - R[0] / R[1]) * 60)) : 0;
  const level = !!L && !!R && L[0] === R[0] && L[1] === R[1];
  const weighed = w.weighed.includes(s);

  const Chip = ({ side, i }: { side: "left" | "right"; i: number }) => {
    const q = shown(w, s, side, i);
    const orig = stalls[s][side][i];
    const key = `${s}-${side}-${i}`;
    const canConvert = !!BIGGER[orig.u];
    return (
      <button
        type="button"
        disabled={play.readOnly || !canConvert}
        onClick={() => play.set((p) => ({ ...p, weighed: p.weighed.filter((x) => x !== s), basket: p.basket === s ? null : p.basket, conv: { ...p.conv, [key]: !p.conv[key] } }))}
        className={`min-h-[44px] px-2.5 rounded-lg border-2 font-mono text-sm font-black ${canConvert ? "bg-amber-50 border-amber-300 text-amber-900" : "bg-white border-slate-200 text-slate-800"}`}
        title={canConvert ? "Tap to convert" : undefined}
      >
        {q.u === "₹" ? `₹${q.v}` : `${q.v} ${q.u}`}
        {canConvert && <span className="block text-[9px] font-bold opacity-70">tap: {w.conv[key] ? `back to ${orig.u}` : `→ ${BIGGER[orig.u].to}`}</span>}
      </button>
    );
  };

  return (
    <PlayShell
      title="Proportion Marketplace"
      mission="Visit each stall. Tap a quantity to run it through the unit converter until both quantities in a ratio share a unit. Then weigh the stall's two ratios on the market balance. The stall that balances goes into the proportion basket."
      icon={Store}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the basket"
      live={
        <>
          <Gauge label="Stalls weighed" value={`${w.weighed.length} / ${stalls.length}`} tone="violet" />
          <Gauge label="Basket" value={w.basket === null ? "empty" : `stall ${stalls[w.basket].optionId}`} tone="emerald" />
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {stalls.map((st, i) => (
          <Btn key={st.optionId} active={w.stall === i} disabled={play.readOnly} onClick={() => play.patch({ stall: i })}>
            🏪 Stall {st.optionId} {w.weighed.includes(i) ? "✓" : ""}
          </Btn>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {(["left", "right"] as const).map((side) => {
          const r = side === "left" ? L : R;
          return (
            <Bay key={side} label={`Ratio ${side === "left" ? 1 : 2}`} tone="violet">
              <div className="flex items-center gap-2">
                <Chip side={side} i={0} />
                <span className="font-black text-lg">:</span>
                <Chip side={side} i={1} />
              </div>
              <div className="mt-2 text-[11px] font-bold text-slate-600">{r ? `in lowest terms ${r[0]} : ${r[1]}` : "units differ — convert first"}</div>
            </Bay>
          );
        })}
      </div>
      <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-200 p-2">
        <svg viewBox="0 0 200 80" className="w-full max-h-40">
          <polygon points="94,76 106,76 100,30" fill="#78350f" />
          <motion.g animate={{ rotate: -tilt }} style={{ originX: "100px", originY: "30px" }}>
            <rect x={30} y={28} width={140} height={4} rx={2} fill="#b45309" />
            <line x1={40} y1={32} x2={40} y2={50} stroke="#78350f" />
            <line x1={160} y1={32} x2={160} y2={50} stroke="#78350f" />
            <ellipse cx={40} cy={52} rx={18} ry={4} fill={weighed ? "#fcd34d" : "#e5e7eb"} />
            <ellipse cx={160} cy={52} rx={18} ry={4} fill={weighed ? "#fcd34d" : "#e5e7eb"} />
            {weighed && L && (
              <text x={40} y={46} textAnchor="middle" fontSize={6} fontWeight={900}>
                {L[0]}:{L[1]}
              </text>
            )}
            {weighed && R && (
              <text x={160} y={46} textAnchor="middle" fontSize={6} fontWeight={900}>
                {R[0]}:{R[1]}
              </text>
            )}
          </motion.g>
        </svg>
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <Btn tone="amber" active disabled={play.readOnly || !L || !R} onClick={() => play.patch({ weighed: [...new Set([...w.weighed, s])] })}>
            ⚖ Weigh stall {stalls[s]?.optionId}
          </Btn>
          {weighed && <span className={`text-xs font-black ${level ? "text-emerald-700" : "text-rose-600"}`}>{level ? "The balance is level." : "The balance tips."}</span>}
          <Btn tone="emerald" active={w.basket === s} disabled={play.readOnly || !weighed} onClick={() => play.patch({ basket: w.basket === s ? null : s })}>
            🧺 {w.basket === s ? "Take out of basket" : "Put in the proportion basket"}
          </Btn>
        </div>
      </div>
    </PlayShell>
  );
}

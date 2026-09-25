"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Grid3x3, Layers, Puzzle, Users, RotateCw, RotateCcw } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchOptionState, matchText } from "../imo6a/shared";
import { usePointerDrag } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, usePlaneDrag, approach } from "./three";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — Operator Mixer (2D)
   The printed expression runs along a console with an empty socket under every symbol.
   The student reads the decoder card, plugs the real operation into each socket and
   presses CALCULATE. The console then works the rewritten expression by BODMAS.
   ══════════════════════════════════════════════════════════════════════ */

type Op = "+" | "−" | "×" | "÷";
const OPS: Op[] = ["+", "−", "×", "÷"];
const OP_NAME: Record<Op, string> = { "+": "addition", "−": "subtraction", "×": "multiplication", "÷": "division" };

/** BODMAS, recording each step so the console can replay its working. */
function evaluateSteps(nums: number[], ops: Op[]): { steps: string[]; value: number } {
  let n = [...nums];
  let o = [...ops];
  const steps: string[] = [];
  const show = () => n.map((x, i) => (i < o.length ? `${x} ${o[i]} ` : `${x}`)).join("");
  for (const pass of [["×", "÷"], ["+", "−"]] as Op[][]) {
    let i = 0;
    while (i < o.length) {
      if (pass.includes(o[i])) {
        const a = n[i];
        const b = n[i + 1];
        const r = o[i] === "×" ? a * b : o[i] === "÷" ? a / b : o[i] === "+" ? a + b : a - b;
        n.splice(i, 2, Math.round(r * 1e9) / 1e9);
        o.splice(i, 1);
        steps.push(show());
      } else i++;
    }
  }
  return { steps, value: n[0] };
}

interface MixerWorld {
  sockets: (Op | null)[];
  holding: Op | null;
  calculatedWith: string | null;
}

export function Q11OperatorMixer({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const expr = cfg<(number | string)[]>(question, "expression", []);
  const mapping = cfg<Record<string, Op>>(question, "mapping", {});
  const nums = expr.filter((t) => typeof t === "number") as number[];
  const printed = expr.filter((t) => typeof t === "string") as Op[];

  const play = usePlay<MixerWorld>({
    question,
    initial: { sockets: printed.map(() => null), holding: null, calculatedWith: null },
    derive: (w) => {
      if (w.sockets.some((s) => !s)) return { note: "Plug a real operation into every socket." };
      if (w.calculatedWith !== w.sockets.join("")) return { note: "Press CALCULATE to run the rewritten expression." };
      const { value: v } = evaluateSteps(nums, w.sockets as Op[]);
      return { value: String(v), optionId: matchNumber(question, v) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const ran = w.sockets.every(Boolean) && w.calculatedWith === w.sockets.join("");
  const working = ran ? evaluateSteps(nums, w.sockets as Op[]) : null;

  return (
    <PlayShell
      title="Operator Mixer Console"
      mission="Read the decoder card. Pick up an operation tile and drop it into the socket under each printed symbol, so the console does what the question says that symbol means. Then press CALCULATE."
      icon={Calculator}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the console's result"
      live={<Gauge label="Sockets filled" value={`${w.sockets.filter(Boolean).length} / ${printed.length}`} tone="violet" />}
    >
      <Bay label="Decoder card">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(mapping).map(([sym, real]) => (
            <span key={sym} className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1">
              ‘<span className="font-mono text-base">{sym}</span>’ stands for {OP_NAME[real]}
            </span>
          ))}
        </div>
      </Bay>

      <div className="rounded-2xl bg-slate-900 p-4 overflow-x-auto">
        <div className="flex items-end gap-2 min-w-max">
          {expr.map((t, i) => {
            if (typeof t === "number")
              return (
                <div key={i} className="w-14 h-14 rounded-xl bg-slate-800 border-2 border-slate-700 text-white font-mono text-xl font-black grid place-items-center">
                  {t}
                </div>
              );
            const k = expr.slice(0, i).filter((x) => typeof x === "string").length;
            const plugged = w.sockets[k];
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-slate-400">printed</span>
                <span className="font-mono text-lg font-black text-amber-300">{t}</span>
                <button
                  type="button"
                  disabled={play.readOnly}
                  onClick={() =>
                    play.set((p) => ({ ...p, sockets: p.sockets.map((s, j) => (j === k ? p.holding ?? null : s)), calculatedWith: null }))
                  }
                  className={`w-12 h-12 rounded-full border-2 font-mono text-xl font-black grid place-items-center transition ${
                    plugged ? "bg-violet-500 border-violet-300 text-white shadow-[0_0_16px_#8b5cf6]" : "bg-slate-800 border-dashed border-slate-500 text-slate-500"
                  }`}
                  aria-label={`Socket ${k + 1}`}
                >
                  {plugged ?? "◌"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">OPERATION TILES:</span>
        {OPS.map((op) => (
          <Btn key={op} tone="violet" active={w.holding === op} disabled={play.readOnly} onClick={() => play.patch({ holding: w.holding === op ? null : op })} className="w-12 text-lg">
            {op}
          </Btn>
        ))}
        <Btn tone="emerald" active disabled={play.readOnly || w.sockets.some((s) => !s)} onClick={() => play.patch({ calculatedWith: w.sockets.join("") })}>
          CALCULATE
        </Btn>
      </div>

      {working && (
        <Bay label="Console working (BODMAS)" tone="dark">
          <ol className="space-y-1 font-mono text-sm">
            <li className="text-slate-400">{nums.map((x, i) => (i < w.sockets.length ? `${x} ${w.sockets[i]} ` : x)).join("")}</li>
            {working.steps.map((s, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 * (i + 1) }}>
                = {s}
              </motion.li>
            ))}
          </ol>
        </Bay>
      )}
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — Matrix Completion Lab (2D)
   The 3×3 arrow matrix plays its rows on request. The student builds the missing tile
   by turning a rotor to aim the arrow and fitting a tail piece.
   ══════════════════════════════════════════════════════════════════════ */

type Dir = "up" | "right" | "down" | "left";
type TailKind = "bar" | "circle" | "square" | "doubleBar" | "none";
const DIR_DEG: Record<Dir, number> = { right: 0, down: 90, left: 180, up: 270 };
const DEG_DIR: Record<number, Dir> = { 0: "right", 90: "down", 180: "left", 270: "up" };

function ArrowGlyph({ dir, tail }: { dir: Dir; tail: TailKind }) {
  const s = { stroke: "#1e1b4b", strokeWidth: 2.4, fill: "none", strokeLinecap: "round" as const };
  return (
    <g transform={`rotate(${DIR_DEG[dir]} 25 25)`}>
      <line x1={10} y1={25} x2={40} y2={25} {...s} />
      <path d="M 33 19 L 40 25 L 33 31" {...s} />
      {tail === "bar" && <line x1={10} y1={19} x2={10} y2={31} {...s} />}
      {tail === "doubleBar" && <path d="M 10 19 L 10 31 M 14 19 L 14 31" {...s} />}
      {tail === "circle" && <circle cx={8} cy={25} r={3} {...s} fill="#fff" />}
      {tail === "square" && <rect x={4} y={21.5} width={7} height={7} {...s} fill="#fff" />}
    </g>
  );
}

interface MatrixWorld {
  deg: number;
  tail: TailKind;
  fitted: boolean;
  played: number | null;
}

function Rotor({ deg, onDeg, readOnly }: { deg: number; onDeg: (d: number) => void; readOnly?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { start } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const a = (Math.atan2(p.y - (r.top + r.height / 2), p.x - (r.left + r.width / 2)) * 180) / Math.PI;
      const snapped = ((Math.round(a / 90) * 90) % 360 + 360) % 360;
      if (snapped !== deg) onDeg(snapped);
    },
  });
  return (
    <div
      ref={ref}
      onPointerDown={(e) => start(e, undefined)}
      className="relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 border-4 border-violet-300 cursor-grab"
      style={{ touchAction: "none" }}
      role="slider"
      aria-label="Arrow rotor"
      aria-valuenow={deg}
    >
      <motion.div className="absolute inset-0" animate={{ rotate: deg }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
        <div className="absolute top-1/2 left-1/2 w-12 h-2 -translate-y-1/2 rounded-full bg-violet-600 origin-left" />
        <div className="absolute top-1/2 right-1 w-4 h-4 -translate-y-1/2 rounded-full bg-violet-700 border-2 border-white" />
      </motion.div>
      <div className="absolute inset-0 grid place-items-center text-[9px] font-black text-violet-700 pointer-events-none">DRAG</div>
    </div>
  );
}

export function Q12MatrixLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const grid = cfg<({ dir: Dir; tail: TailKind } | null)[][]>(question, "grid", []);
  const tails: TailKind[] = ["bar", "doubleBar", "circle", "square", "none"];

  const play = usePlay<MatrixWorld>({
    question,
    initial: { deg: 0, tail: "none", fitted: false, played: null },
    derive: (w) => {
      if (!w.fitted) return { note: "Aim the arrow, choose its tail, then fit the tile into the matrix." };
      const built = { dir: DEG_DIR[w.deg], tail: w.tail };
      return {
        value: `Arrow pointing ${built.dir}, tail: ${built.tail === "doubleBar" ? "double bar" : built.tail}`,
        optionId: matchOptionState(question, built, (o, b) => o.dir === b.dir && o.tail === b.tail),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <PlayShell
      title="Pattern Matrix Lab"
      mission="Tap a row's play button to watch how its arrows change from cell to cell. Then drag the rotor to aim your arrow, fit a tail piece, and slot the tile into the empty cell."
      icon={Grid3x3}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the completed matrix"
      live={
        <>
          <Gauge label="Arrow aim" value={DEG_DIR[w.deg]} tone="violet" />
          <Gauge label="Tail" value={w.tail} />
          <Gauge label="Tile" value={w.fitted ? "fitted" : "on the bench"} tone={w.fitted ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="space-y-1">
          {grid.map((row, r) => (
            <div key={r} className="flex items-center gap-1">
              {row.map((cell, c) => {
                const isGap = cell === null;
                return (
                  <motion.div
                    key={c}
                    animate={w.played === r ? { scale: [1, 1.12, 1], transition: { delay: c * 0.35, duration: 0.5 } } : { scale: 1 }}
                    className={`w-20 h-20 rounded-lg border-2 ${isGap ? (w.fitted ? "border-emerald-500 bg-emerald-50" : "border-dashed border-violet-400 bg-violet-50") : "border-slate-300 bg-white"}`}
                  >
                    <svg viewBox="0 0 50 50" className="w-full h-full">
                      {cell && <ArrowGlyph dir={cell.dir} tail={cell.tail} />}
                      {isGap && w.fitted && <ArrowGlyph dir={DEG_DIR[w.deg]} tail={w.tail} />}
                      {isGap && !w.fitted && (
                        <text x={25} y={30} textAnchor="middle" fontSize={16} fontWeight={900} fill="#a78bfa">
                          ?
                        </text>
                      )}
                    </svg>
                  </motion.div>
                );
              })}
              <Btn disabled={play.readOnly} onClick={() => play.patch({ played: r })} className="ml-1">
                ▶
              </Btn>
            </div>
          ))}
        </div>

        <Bay label="Tile bench" tone="violet">
          <div className="flex flex-wrap items-center gap-4">
            <Rotor deg={w.deg} readOnly={play.readOnly} onDeg={(deg) => play.set((p) => ({ ...p, deg, fitted: false }))} />
            <svg viewBox="0 0 50 50" className="w-24 h-24 bg-white rounded-xl border-2 border-violet-300">
              <ArrowGlyph dir={DEG_DIR[w.deg]} tail={w.tail} />
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tails.map((t) => (
              <button
                key={t}
                type="button"
                disabled={play.readOnly}
                onClick={() => play.set((p) => ({ ...p, tail: t, fitted: false }))}
                className={`w-14 h-12 rounded-lg border-2 ${w.tail === t ? "border-violet-600 bg-violet-100" : "border-slate-200 bg-white"}`}
                aria-label={`Tail ${t}`}
              >
                <svg viewBox="0 12 30 26" className="w-full h-full">
                  <ArrowGlyph dir="right" tail={t} />
                </svg>
              </button>
            ))}
          </div>
          <Btn className="mt-3" tone="emerald" active disabled={play.readOnly} onClick={() => play.patch({ fitted: true })}>
            Slot the tile into the matrix
          </Btn>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — X-Ray Fold (3D)
   The transparent sheet is a real two-panel object hinged on the dotted line. The student
   grabs either half and swings it over. Everything on the moving half reflects through
   the fold; the result is read from where the layers actually land.
   ══════════════════════════════════════════════════════════════════════ */

interface SheetRect {
  id: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
interface SheetSpec {
  mark: { x: number; y: number; glyph: string };
  rects: SheetRect[];
  diagonals: boolean;
}

/** Paint one half (x from `from` to `to`, in sheet units) of the sheet onto a canvas. */
function useHalfTexture(spec: SheetSpec, from: number, to: number) {
  const tex = useMemo(() => {
    const W = 256;
    const H = 512;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    const X = (x: number) => ((x - from) / (to - from)) * W;
    const Y = (y: number) => ((1 - y) / 2) * H;
    g.fillStyle = "rgba(224,231,255,0.35)";
    g.fillRect(0, 0, W, H);
    g.strokeStyle = "#1e1b4b";
    g.lineWidth = 6;
    spec.rects.forEach((r) => g.strokeRect(X(r.x0), Y(r.y1), X(r.x1) - X(r.x0), Y(r.y0) - Y(r.y1)));
    if (spec.diagonals) {
      const inner = spec.rects.find((r) => r.id === "inner");
      const outer = spec.rects.find((r) => r.id === "outer");
      if (inner && outer) {
        const pairs: [number, number, number, number][] = [
          [outer.x0, outer.y1, inner.x0, inner.y1],
          [outer.x1, outer.y1, inner.x1, inner.y1],
          [outer.x0, outer.y0, inner.x0, inner.y0],
          [outer.x1, outer.y0, inner.x1, inner.y0],
        ];
        pairs.forEach(([a, b, cc, d]) => {
          g.beginPath();
          g.moveTo(X(a), Y(b));
          g.lineTo(X(cc), Y(d));
          g.stroke();
        });
      }
    }
    g.fillStyle = "#be123c";
    g.font = "900 64px system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(spec.mark.glyph, X(spec.mark.x), Y(spec.mark.y));
    // fold line
    g.setLineDash([14, 12]);
    g.strokeStyle = "#7c3aed";
    g.lineWidth = 4;
    const fx = X(0);
    g.beginPath();
    g.moveTo(fx, 0);
    g.lineTo(fx, H);
    g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [spec, from, to]);
  return tex;
}

function SheetHalf({
  side,
  spec,
  angle,
  onAngle,
  readOnly,
}: {
  side: "left" | "right";
  spec: SheetSpec;
  angle: number;
  onAngle: (a: number) => void;
  readOnly?: boolean;
}) {
  const tex = useHalfTexture(spec, side === "left" ? -1 : 0, side === "left" ? 0 : 1);
  const hinge = useRef<THREE.Group>(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const sign = side === "left" ? 1 : -1;
  const drag = usePlaneDrag({
    plane,
    disabled: readOnly,
    onDrag: (p) => {
      // The free edge of the swinging half sits at x = ∓cos(angle); invert that.
      const x = Math.max(-1, Math.min(1, p.x));
      const a = side === "left" ? Math.acos(-x) : Math.acos(x);
      onAngle(Math.round((a / Math.PI) * 100) / 100);
    },
  });
  useFrame((_, dt) => {
    if (hinge.current) hinge.current.rotation.y = approach(hinge.current.rotation.y, sign * angle * Math.PI, 9, dt);
  });
  return (
    <group ref={hinge} position={[0, 0, side === "left" ? 0.004 : 0]}>
      <mesh position={[side === "left" ? -0.5 : 0.5, 0, 0]} {...drag} castShadow>
        <planeGeometry args={[1, 2]} />
        <meshStandardMaterial map={tex} transparent opacity={0.92} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface FoldWorld {
  left: number;
  right: number;
}

type FoldResult = { half: "left" | "right"; mark: "original" | "mirrored" | "none"; lines: "single" | "double" };

/** Where the layers really land after a complete fold of one half over the other. */
function foldResult(spec: SheetSpec, w: FoldWorld): FoldResult | undefined {
  const leftDone = w.left >= 0.97 && w.right <= 0.03;
  const rightDone = w.right >= 0.97 && w.left <= 0.03;
  if (!leftDone && !rightDone) return undefined;
  const moving = leftDone ? "left" : "right";
  const stays = leftDone ? "right" : "left";
  const onMoving = (x: number) => (moving === "left" ? x < 0 : x > 0);
  const mark = onMoving(spec.mark.x) ? "mirrored" : "original";
  // A line from the moving half lands on -x; it doubles unless the staying half has it too.
  const edgesOf = (r: SheetRect) => [r.x0, r.x1];
  const doubled = spec.rects.some((r) =>
    edgesOf(r).some((x) => onMoving(x) && !spec.rects.some((q) => edgesOf(q).some((x2) => Math.abs(x2 + x) < 1e-6 && Math.abs(q.y0 - r.y0) < 1e-6 && Math.abs(q.y1 - r.y1) < 1e-6)))
  );
  return { half: stays, mark, lines: doubled ? "double" : "single" };
}

function OptionSketch({ st }: { st: FoldResult }) {
  return (
    <svg viewBox="0 0 60 44" className="w-full">
      <rect x={4} y={2} width={26} height={40} fill="none" stroke="#94a3b8" strokeDasharray="1.5 1.5" />
      <rect x={30} y={2} width={26} height={40} fill="#fff" stroke="#1e1b4b" />
      <path d="M 30 16 L 43 16 L 43 28 L 30 28 M 43 16 L 56 2 M 43 28 L 56 42" fill="none" stroke="#1e1b4b" />
      {st.lines === "double" && <path d="M 30 18 L 41 18 L 41 26 L 30 26" fill="none" stroke="#1e1b4b" />}
      <rect x={30} y={19} width={7} height={6} fill="none" stroke="#1e1b4b" />
      {st.mark !== "none" && (
        <text x={32.5} y={24} fontSize={6} fontWeight={900} fill="#be123c" textAnchor="middle" transform={st.mark === "mirrored" ? "translate(65 0) scale(-1 1)" : undefined}>
          C
        </text>
      )}
    </svg>
  );
}

export function Q13XRayFold({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const spec = cfg<SheetSpec>(question, "play", { mark: { x: -0.06, y: 0, glyph: "C" }, rects: [], diagonals: true });
  const options = (question?.customConfig?.play?.options ?? {}) as Record<string, FoldResult>;

  const play = usePlay<FoldWorld>({
    question,
    initial: { left: 0, right: 0 },
    derive: (w) => {
      const r = foldResult(spec, w);
      if (!r) return { note: "Swing one half of the sheet all the way over the other." };
      const opt = Object.keys(options).find((id) => options[id].half === r.half && options[id].mark === r.mark && options[id].lines === r.lines);
      return {
        value: `${r.half === "right" ? "Left" : "Right"} half folded over: mark ${r.mark}, lines ${r.lines}`,
        optionId: opt,
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const res = foldResult(spec, w);

  return (
    <PlayShell
      title="X-Ray Fold"
      mission="Grab a half of the transparent sheet and swing it over along the dotted line. You can see through the layers, so watch where every line and the small mark land. Turn the view to check."
      icon={Layers}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the folded sheet"
      live={
        <>
          <Gauge label="Left half" value={`${Math.round(w.left * 180)}°`} tone="violet" />
          <Gauge label="Right half" value={`${Math.round(w.right * 180)}°`} tone="violet" />
          {res && <Gauge label="Layers" value={`mark ${res.mark}, lines ${res.lines}`} tone="emerald" />}
        </>
      }
    >
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-3">
        <Stage3D height={330} camera={{ position: [0.6, 0.8, 3.6], fov: 45 }} readOnly={play.readOnly} background="#eef2ff" maxPolar={Math.PI / 1.6}>
          <SheetHalf side="left" spec={spec} angle={w.left} readOnly={play.readOnly} onAngle={(a) => play.set((p) => ({ ...p, left: a, right: a > 0.05 ? 0 : p.right }))} />
          <SheetHalf side="right" spec={spec} angle={w.right} readOnly={play.readOnly} onAngle={(a) => play.set((p) => ({ ...p, right: a, left: a > 0.05 ? 0 : p.left }))} />
        </Stage3D>
        <Bay label="Answer objects on the table">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(options).map(([id, st]) => (
              <div key={id} className="rounded-lg border border-slate-200 bg-white p-1">
                <div className="text-[10px] font-black text-slate-500">{id}</div>
                <OptionSketch st={st} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-slate-500">Sketches of the printed options. The printed paper is the reference.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Btn disabled={play.readOnly} onClick={() => play.set({ left: 1, right: 0 })}>
              Fold left over right
            </Btn>
            <Btn disabled={play.readOnly} onClick={() => play.set({ left: 0, right: 1 })}>
              Fold right over left
            </Btn>
            <Btn disabled={play.readOnly} onClick={() => play.set({ left: 0, right: 0 })}>
              Open flat
            </Btn>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — Pattern Builder (2D)
   Three tiles of the square are printed; the fourth is a blank frame. Loose pieces (a
   letter card and a quarter-arc) float beside it. The student fits the letter, turns it,
   and snaps the arc into a corner.
   ══════════════════════════════════════════════════════════════════════ */

type Corner = "TL" | "TR" | "BL" | "BR";
interface PatternTile {
  slot: Corner;
  glyph: "W" | "M" | null;
  rotation: number | null;
  corner: Corner | null;
}

function Glyph({ g, rot, x = 25, y = 30 }: { g: "W" | "M"; rot: number; x?: number; y?: number }) {
  // M has upright outer strokes; W has slanted ones — so an upside-down M never looks like W.
  const d = g === "M" ? "M -7 6 L -7 -6 L 0 2 L 7 -6 L 7 6" : "M -8 -6 L -4 6 L 0 -2 L 4 6 L 8 -6";
  return <path d={d} transform={`translate(${x} ${y}) rotate(${rot})`} stroke="#1e1b4b" strokeWidth={2} fill="none" strokeLinejoin="round" />;
}

const ARC_AT: Record<Corner, string> = {
  TL: "M 2 14 A 12 12 0 0 0 14 2",
  TR: "M 36 2 A 12 12 0 0 0 48 14",
  BL: "M 2 36 A 12 12 0 0 1 14 48",
  BR: "M 48 36 A 12 12 0 0 1 36 48",
};
const DIAG_AT: Record<Corner, string> = {
  TL: "M 2 12 L 12 2",
  TR: "M 38 2 L 48 12",
  BL: "M 2 38 L 12 48",
  BR: "M 38 48 L 48 38",
};
const OPPOSITE: Record<Corner, Corner> = { TL: "BR", TR: "BL", BL: "TR", BR: "TL" };

function TileArt({ glyph, rot, arc, diag }: { glyph?: "W" | "M" | null; rot: number; arc?: Corner | null; diag?: Corner | null }) {
  return (
    <svg viewBox="0 0 50 50" className="w-full h-full">
      <rect x={1} y={1} width={48} height={48} fill="#fff" stroke="#1e1b4b" strokeWidth={1.2} />
      {diag && <path d={DIAG_AT[diag]} stroke="#1e1b4b" strokeWidth={1.6} />}
      {arc && <path d={ARC_AT[arc]} stroke="#7c3aed" strokeWidth={2} fill="none" />}
      {glyph && <Glyph g={glyph} rot={rot} />}
    </svg>
  );
}

interface PatternWorld {
  glyph: "W" | "M" | null;
  rotation: number;
  corner: Corner | null;
}

export function Q14PatternBuilder({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const tiles = cfg<PatternTile[]>(question, "tiles", []);

  const play = usePlay<PatternWorld>({
    question,
    initial: { glyph: null, rotation: 0, corner: null },
    derive: (w) => {
      if (!w.glyph) return { note: "Fit a letter card into the empty tile." };
      if (!w.corner) return { note: "Snap the arc piece into a corner of the tile." };
      return {
        value: `${w.glyph} turned ${w.rotation}°, arc at ${w.corner}`,
        optionId: matchOptionState(question, w, (o, b) => o.glyph === b.glyph && o.rotation === b.rotation && o.corner === b.corner),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <PlayShell
      title="Pattern Builder"
      mission="Study how the printed tiles change as you go round the square. Drop a letter card into the empty tile, turn it, and snap the arc piece into the corner where the pattern needs it."
      icon={Puzzle}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the finished tile"
      live={
        <>
          <Gauge label="Letter" value={w.glyph ?? "—"} tone="violet" />
          <Gauge label="Turn" value={`${w.rotation}°`} />
          <Gauge label="Arc" value={w.corner ?? "—"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="grid grid-cols-2 gap-0 w-64 h-64 border-2 border-slate-800 rounded-lg overflow-hidden bg-white">
          {(["TL", "TR", "BL", "BR"] as Corner[]).map((slot) => {
            const t = tiles.find((x) => x.slot === slot);
            if (t?.glyph) return <TileArt key={slot} glyph={t.glyph} rot={t.rotation ?? 0} arc={OPPOSITE[slot]} diag={slot} />;
            return (
              <div key={slot} className="relative bg-violet-50 border-2 border-dashed border-violet-400">
                <TileArt glyph={w.glyph} rot={w.rotation} arc={w.corner} diag={slot} />
                {!play.readOnly &&
                  (["TL", "TR", "BL", "BR"] as Corner[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Arc to ${c}`}
                      onClick={() => play.patch({ corner: c })}
                      className={`absolute w-8 h-8 rounded-full ${w.corner === c ? "bg-violet-500/30" : "bg-violet-400/10 hover:bg-violet-400/30"} ${c[0] === "T" ? "top-0" : "bottom-0"} ${c[1] === "L" ? "left-0" : "right-0"}`}
                    />
                  ))}
              </div>
            );
          })}
        </div>
        <Bay label="Loose pieces" tone="violet">
          <div className="flex flex-wrap gap-2">
            {(["W", "M"] as const).map((g) => (
              <motion.button
                key={g}
                type="button"
                disabled={play.readOnly}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: g === "M" ? 0.6 : 0 }}
                onClick={() => play.patch({ glyph: g })}
                aria-label={`letter card ${g}`}
                className={`w-16 h-16 rounded-xl border-2 bg-white shadow-sm ${w.glyph === g ? "border-violet-600 ring-2 ring-violet-300" : "border-slate-200"}`}
              >
                <svg viewBox="10 15 30 30" className="w-full h-full">
                  <Glyph g={g} rot={0} />
                </svg>
              </motion.button>
            ))}
            <div className="w-16 h-16 rounded-xl border-2 border-slate-200 bg-white grid place-items-center text-[10px] font-bold text-violet-700 text-center p-1">
              arc piece: tap a corner of the empty tile
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Btn disabled={play.readOnly || !w.glyph} onClick={() => play.patch({ rotation: (w.rotation + 270) % 360 })}>
              <RotateCcw className="w-4 h-4" />
            </Btn>
            <Btn disabled={play.readOnly || !w.glyph} onClick={() => play.patch({ rotation: (w.rotation + 90) % 360 })}>
              <RotateCw className="w-4 h-4" />
            </Btn>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — Family Detective (2D)
   Kashi's sentence is a chain of relationship cords. The student pulls each cord in turn;
   a new card appears for every new person, and a cord that leads back to someone already
   on the board loops back to them. The photograph lands on the last person reached.
   ══════════════════════════════════════════════════════════════════════ */

type Rel = "son" | "daughter" | "wife" | "husband" | "mother" | "father";
const MALE: Rel[] = ["son", "husband", "father"];
const isFemale = (r: Rel | "self") => r !== "self" && !MALE.includes(r);

/** Collapse a relation path from Kashi (male) so that loops back to known people vanish. */
function reducePath(path: Rel[]): Rel[] {
  const out: Rel[] = [];
  for (const step of path) {
    const prev = out[out.length - 1];
    const before = out.length >= 2 ? out[out.length - 2] : ("self" as const);
    if ((step === "mother" || step === "father") && (prev === "son" || prev === "daughter")) {
      const beforeFemale = isFemale(before);
      out.pop();
      if (step === "mother" && !beforeFemale) out.push("wife");
      if (step === "father" && beforeFemale) out.push("husband");
      continue;
    }
    if ((step === "husband" && prev === "wife") || (step === "wife" && prev === "husband")) {
      out.pop();
      continue;
    }
    out.push(step);
  }
  return out;
}

const RELATION_NAME: Record<string, string> = {
  "": "Kashi himself",
  son: "Son",
  daughter: "Daughter",
  wife: "Wife",
  mother: "Mother",
  father: "Father",
  "son wife": "Daughter-in-law",
  "daughter husband": "Son-in-law",
  "son son": "Grandson",
  "son daughter": "Granddaughter",
  "daughter son": "Grandson",
  "daughter daughter": "Granddaughter",
  "mother son": "Brother",
  "mother daughter": "Sister",
  "father son": "Brother",
  "father daughter": "Sister",
};

const CARD_NAME = (path: Rel[]) => (path.length ? `Kashi's ${path.join("'s ")}` : "Kashi");

interface FamilyWorld {
  steps: Rel[];
  photo: boolean;
}

export function Q15FamilyDetective({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const cords: Rel[] = ["son", "daughter", "wife", "husband", "mother", "father"];

  const play = usePlay<FamilyWorld>({
    question,
    initial: { steps: [], photo: false },
    derive: (w) => {
      if (!w.steps.length) return { note: "Pull the relationship cords in the order of Kashi's sentence." };
      if (!w.photo) return { note: "Pin the photograph on the person the sentence ends at." };
      const reduced = reducePath(w.steps);
      const name = RELATION_NAME[reduced.join(" ")] ?? `Kashi's ${reduced.join("'s ")}`;
      return { value: name, optionId: matchText(question, name), note: `The lady is ${CARD_NAME(reduced)}.` };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  // Cards on the board: each prefix of the path, collapsed, so repeated people merge.
  const cards = useMemo(() => {
    const seen: { key: string; label: string; female: boolean; depth: number }[] = [{ key: "", label: "Kashi", female: false, depth: 0 }];
    const trail: string[] = [""];
    w.steps.forEach((_, i) => {
      const red = reducePath(w.steps.slice(0, i + 1));
      const key = red.join(" ");
      if (!seen.some((c) => c.key === key)) seen.push({ key, label: CARD_NAME(red), female: isFemale(red[red.length - 1] ?? "self"), depth: red.length });
      trail.push(key);
    });
    return { seen, trail };
  }, [w.steps]);
  const lastKey = cards.trail[cards.trail.length - 1];

  return (
    <PlayShell
      title="Family Detective"
      mission="Kashi said: “She is the mother of my son's wife's daughter”. Pull one cord for each link in that sentence, starting from Kashi. Watch where each cord leads, then pin the photograph on the person the sentence ends at."
      icon={Users}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the lady's relation"
      live={
        <>
          <Gauge label="Cords pulled" value={w.steps.length ? w.steps.join(" → ") : "—"} tone="violet" />
          <Gauge label="People on board" value={cards.seen.length} />
        </>
      }
    >
      <div className="rounded-2xl border-2 border-amber-200 bg-[repeating-linear-gradient(45deg,#fffbeb_0_12px,#fef3c7_12px_24px)] p-3 min-h-[220px]">
        <div className="flex flex-wrap gap-3 items-start">
          <AnimatePresence>
            {cards.seen.map((c) => (
              <motion.div
                key={c.key || "self"}
                layout
                initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: c.depth % 2 ? 2 : -2 }}
                className={`relative w-36 rounded-lg border-2 bg-white p-2 shadow ${c.key === lastKey ? "border-violet-600 ring-2 ring-violet-300" : "border-slate-200"}`}
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-500 border border-white" />
                <div className="text-2xl">{c.key === "" ? "👴" : c.female ? "👩" : "👨"}</div>
                <div className="text-[11px] font-black text-slate-800 leading-tight">{c.label}</div>
                {w.photo && c.key === lastKey && (
                  <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-1 text-[10px] font-black bg-violet-600 text-white rounded px-1.5 py-0.5 inline-block">
                    📷 the lady in the photo
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {w.steps.length > 0 && (
          <div className="mt-3 text-[11px] font-bold text-amber-900">
            Path walked: Kashi {w.steps.map((s) => `→ ${s}`).join(" ")}
            {cards.trail.length > 1 && cards.trail[cards.trail.length - 1] !== w.steps.join(" ") && " (a cord looped back to someone already on the board)"}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">PULL A CORD FROM THE HIGHLIGHTED CARD:</span>
        {cords.map((r) => (
          <Btn key={r} disabled={play.readOnly || w.steps.length >= 6} onClick={() => play.set((p) => ({ steps: [...p.steps, r], photo: false }))}>
            {r}
          </Btn>
        ))}
        <Btn disabled={play.readOnly || !w.steps.length} onClick={() => play.set((p) => ({ steps: p.steps.slice(0, -1), photo: false }))}>
          ↶ undo
        </Btn>
        <Btn tone="violet" active disabled={play.readOnly || !w.steps.length} onClick={() => play.patch({ photo: true })}>
          📷 Pin photograph here
        </Btn>
      </div>
    </PlayShell>
  );
}

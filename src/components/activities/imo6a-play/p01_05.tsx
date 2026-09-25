"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import { Cog, Shuffle, Tag, Crosshair, Compass, Play, Zap } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "./engine";
import { PlayShell, Bay, Gauge, Btn } from "./PlayShell";
import { Stage3D, Label3D, approach, Floor } from "./three";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — The Missing Number Machine (3D)
   Three machines share one hidden rule. The student sets the gear slots to a rule of
   their own, runs all three machines, and only a rule that reproduces the first two
   printed centres is allowed to fill the third machine's locked output chamber.
   ══════════════════════════════════════════════════════════════════════ */

type Arm = "top" | "left" | "right" | "bottom";
type Op = "+" | "−" | "×" | "÷";
type Out = "whole" | "units" | "digitsum";
interface Cross {
  top: number;
  left: number;
  right: number;
  bottom: number;
  centre: number | null;
}
interface MachineWorld {
  a: Arm | null;
  op1: Op | null;
  b: Arm | null;
  op2: Op | null;
  c: Arm | null;
  out: Out;
  /** The rule the machines were last run with; stale as soon as a gear moves. */
  ranWith: string | null;
}

const ARM_LABEL: Record<Arm, string> = { top: "Top", left: "Left", right: "Right", bottom: "Bottom" };
const OUT_LABEL: Record<Out, string> = { whole: "Whole result", units: "Units digit", digitsum: "Digit sum" };

const apply = (x: number, op: Op, y: number) =>
  op === "+" ? x + y : op === "−" ? x - y : op === "×" ? x * y : y === 0 ? NaN : x / y;

const digitSum = (n: number) => String(Math.abs(Math.trunc(n))).split("").reduce((t, d) => t + Number(d), 0);

function runRule(w: MachineWorld, c: Cross): number | null {
  if (!w.a || !w.op1 || !w.b) return null;
  let v = apply(c[w.a], w.op1, c[w.b]);
  if (w.op2 && w.c) v = apply(v, w.op2, c[w.c]);
  if (!Number.isFinite(v)) return null;
  if (w.out === "units") return Number.isInteger(v) ? Math.abs(v) % 10 : null;
  if (w.out === "digitsum") return Number.isInteger(v) ? digitSum(v) : null;
  return Math.round(v * 1000) / 1000;
}

const ruleKey = (w: MachineWorld) => [w.a, w.op1, w.b, w.op2, w.c, w.out].join("|");

function Gear({ x, y, z, r, teeth, speed, color }: { x: number; y: number; z: number; r: number; teeth: number; speed: React.MutableRefObject<number>; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += speed.current * dt * (teeth % 2 ? -1 : 1);
  });
  return (
    <group ref={ref} position={[x, y, z]}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.16, 32]} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
      </mesh>
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r + 0.06), Math.sin(a) * (r + 0.06), 0]} rotation={[0, 0, a]} castShadow>
            <boxGeometry args={[0.14, 0.1, 0.16]} />
            <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
          </mesh>
        );
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.28, r * 0.28, 0.2, 16]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
    </group>
  );
}

/** A number bead that travels from an arm into the centre chamber while the machine runs. */
function Bead({ from, runAt }: { from: [number, number, number]; runAt: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clamp((clock.elapsedTime - runAt.current) / 1.4, 0, 1);
    const visible = runAt.current > 0 && t > 0 && t < 1;
    ref.current.visible = visible;
    const e = 1 - Math.pow(1 - t, 3);
    ref.current.position.set(from[0] * (1 - e), from[1] * (1 - e), 0.42);
  });
  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={1.2} />
    </mesh>
  );
}

function Machine({
  x,
  cross,
  output,
  status,
  runAt,
  speed,
  index,
}: {
  x: number;
  cross: Cross;
  output: string;
  status: "idle" | "match" | "miss" | "result";
  runAt: React.MutableRefObject<number>;
  speed: React.MutableRefObject<number>;
  index: number;
}) {
  const glow = status === "match" ? "#10b981" : status === "miss" ? "#e11d48" : status === "result" ? "#8b5cf6" : "#94a3b8";
  const arms: { key: Arm; pos: [number, number, number] }[] = [
    { key: "top", pos: [0, 0.78, 0.36] },
    { key: "left", pos: [-0.78, 0, 0.36] },
    { key: "right", pos: [0.78, 0, 0.36] },
    { key: "bottom", pos: [0, -0.78, 0.36] },
  ];
  return (
    <group position={[x, 1.95, 0]}>
      <RoundedBox args={[2.5, 2.6, 0.6]} radius={0.12} castShadow receiveShadow>
        <meshStandardMaterial color="#ddd6fe" roughness={0.55} />
      </RoundedBox>
      <Label3D text={`MACHINE ${index + 1}`} position={[0, 1.12, 0.31]} size={[1.6, 0.26]} style={{ bg: null, fg: "#4c1d95", scale: 0.7 }} />
      {arms.map((a) => (
        <group key={a.key}>
          <Label3D text={String(cross[a.key])} position={a.pos} size={[0.62, 0.62]} style={{ bg: "#ffffff", border: "#c4b5fd", fg: "#1e1b4b" }} />
          <Bead from={[a.pos[0], a.pos[1], a.pos[2]]} runAt={runAt} />
        </group>
      ))}
      {/* Centre chamber: glass box with the output inside */}
      <mesh position={[0, 0, 0.36]}>
        <boxGeometry args={[0.66, 0.66, 0.12]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={status === "idle" ? 0.05 : 0.6} transparent opacity={0.55} />
      </mesh>
      <Label3D text={output} position={[0, 0, 0.44]} size={[0.56, 0.56]} style={{ bg: null, fg: status === "idle" ? "#334155" : "#ffffff" }} />
      <Gear x={-0.72} y={-1.62} z={0.1} r={0.34} teeth={10} speed={speed} color="#a78bfa" />
      <Gear x={0} y={-1.55} z={0.1} r={0.26} teeth={7} speed={speed} color="#818cf8" />
      <Gear x={0.66} y={-1.62} z={0.1} r={0.3} teeth={9} speed={speed} color="#c084fc" />
    </group>
  );
}

function MachineHall({
  crosses,
  outputs,
  statuses,
  runSignal,
}: {
  crosses: Cross[];
  outputs: string[];
  statuses: ("idle" | "match" | "miss" | "result")[];
  runSignal: number;
}) {
  const runAt = useRef(0);
  const speed = useRef(0.2);
  const lastSignal = useRef(runSignal);
  useFrame(({ clock }, dt) => {
    if (runSignal !== lastSignal.current) {
      lastSignal.current = runSignal;
      runAt.current = clock.elapsedTime;
    }
    const running = runAt.current > 0 && clock.elapsedTime - runAt.current < 1.6;
    speed.current = approach(speed.current, running ? 7 : 0.25, 5, dt);
  });
  return (
    <>
      <Floor y={-0.02} />
      {crosses.map((c, i) => (
        <Machine key={i} index={i} x={(i - 1) * 3} cross={c} output={outputs[i]} status={statuses[i]} runAt={runAt} speed={speed} />
      ))}
      {/* Pipes carrying the rule from machine to machine */}
      {[-1.5, 1.5].map((px) => (
        <mesh key={px} position={[px, 3.3, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.6, 16]} />
          <meshStandardMaterial color="#6366f1" metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

export function Q01NumberMachine({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const crosses = cfg<Cross[]>(question, "crosses", []);
  const init: MachineWorld = { a: null, op1: null, b: null, op2: null, c: null, out: "whole", ranWith: null };

  const play = usePlay<MachineWorld>({
    question,
    initial: init,
    derive: (w) => {
      if (!w.a || !w.op1 || !w.b) return { note: "Fit at least one operation gear between two arms." };
      if (w.ranWith !== ruleKey(w)) return { note: "Press RUN MACHINES to test your rule on all three machines." };
      const outs = crosses.map((c) => runRule(w, c));
      const broken = crosses.findIndex((c, i) => c.centre !== null && outs[i] !== c.centre);
      if (broken >= 0)
        return { note: `Machine ${broken + 1} printed ${crosses[broken].centre}, but your rule makes ${outs[broken] ?? "no number"}. Adjust the gears.` };
      const last = outs[crosses.length - 1];
      if (last === null) return { note: "Your rule does not produce a number on machine 3." };
      return { value: String(last), optionId: matchNumber(question, last) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const [signal, setSignal] = useState(0);
  const ran = w.ranWith === ruleKey(w);
  const outs = crosses.map((c) => (ran ? runRule(w, c) : null));
  const statuses = crosses.map((c, i) => {
    if (!ran) return "idle" as const;
    if (c.centre === null) return outs.slice(0, -1).every((o, j) => o === crosses[j].centre) ? ("result" as const) : ("idle" as const);
    return outs[i] === c.centre ? ("match" as const) : ("miss" as const);
  });
  const shown = crosses.map((c, i) => {
    if (c.centre !== null) return String(c.centre);
    return statuses[i] === "result" && outs[i] !== null ? String(outs[i]) : "?";
  });

  const slot = (key: "a" | "b" | "c", allowNone = false) => (
    <div className="flex flex-wrap gap-1">
      {allowNone && (
        <Btn active={w[key] === null} onClick={() => play.patch({ [key]: null } as Partial<MachineWorld>)} disabled={play.readOnly}>
          —
        </Btn>
      )}
      {(["top", "left", "right", "bottom"] as Arm[]).map((arm) => (
        <Btn key={arm} active={w[key] === arm} onClick={() => play.patch({ [key]: arm } as Partial<MachineWorld>)} disabled={play.readOnly}>
          {ARM_LABEL[arm]}
        </Btn>
      ))}
    </div>
  );
  const opSlot = (key: "op1" | "op2", allowNone = false) => (
    <div className="flex gap-1">
      {allowNone && (
        <Btn active={w[key] === null} onClick={() => play.patch({ [key]: null } as Partial<MachineWorld>)} disabled={play.readOnly}>
          —
        </Btn>
      )}
      {(["+", "−", "×", "÷"] as Op[]).map((op) => (
        <Btn key={op} tone="amber" active={w[key] === op} onClick={() => play.patch({ [key]: op } as Partial<MachineWorld>)} disabled={play.readOnly} className="w-11 text-base">
          {op}
        </Btn>
      ))}
    </div>
  );

  return (
    <PlayShell
      title="The Missing Number Machine"
      mission="Every machine hides the same rule. Fit gears to build a rule from the arms, run all three machines, and keep adjusting until machines 1 and 2 print their own centres. Only then does machine 3 fill its locked chamber."
      icon={Cog}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit machine 3's output"
      live={
        <>
          {crosses.map((c, i) => (
            <Gauge
              key={i}
              label={`Machine ${i + 1}`}
              value={ran ? (outs[i] ?? "—") : "not run"}
              tone={statuses[i] === "match" ? "emerald" : statuses[i] === "miss" ? "rose" : statuses[i] === "result" ? "violet" : "slate"}
            />
          ))}
        </>
      }
    >
      <Stage3D height={330} camera={{ position: [0, 2.6, 7.4], fov: 42 }} orbitTarget={[0, 1.7, 0]} readOnly={play.readOnly} maxPolar={Math.PI / 2.1}>
        <MachineHall crosses={crosses} outputs={shown} statuses={statuses} runSignal={signal} />
      </Stage3D>

      <Bay label="Gear rack — build the rule" tone="violet">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-violet-700 w-16">GEAR 1</span>
            {slot("a")}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-violet-700 w-16">OPERATION</span>
            {opSlot("op1")}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-violet-700 w-16">GEAR 2</span>
            {slot("b")}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-violet-700 w-16">THEN</span>
            {opSlot("op2", true)}
            {w.op2 && slot("c")}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-violet-700 w-16">NOZZLE</span>
            {(["whole", "units", "digitsum"] as Out[]).map((o) => (
              <Btn key={o} tone="sky" active={w.out === o} onClick={() => play.patch({ out: o })} disabled={play.readOnly}>
                {OUT_LABEL[o]}
              </Btn>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <code className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded px-2 py-1">
              {w.a ? ARM_LABEL[w.a] : "?"} {w.op1 ?? "?"} {w.b ? ARM_LABEL[w.b] : "?"}
              {w.op2 ? ` ${w.op2} ${w.c ? ARM_LABEL[w.c] : "?"}` : ""} → {OUT_LABEL[w.out]}
            </code>
            <Btn
              tone="violet"
              active
              disabled={play.readOnly || !w.a || !w.op1 || !w.b || (!!w.op2 && !w.c)}
              onClick={() => {
                setSignal((n) => n + 1);
                play.set((p) => ({ ...p, ranWith: ruleKey(p) }));
              }}
            >
              <span className="inline-flex items-center gap-1">
                <Play className="w-4 h-4" /> RUN MACHINES
              </span>
            </Btn>
          </div>
        </div>
      </Bay>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q2 — Figure Transformation Lab (2D)
   The lab first plays figure (i) turning into figure (ii). The student then fits end-
   pieces onto the blank figure (iii), feeds it through the same transformation, and
   compares what comes out with figure (iv).
   ══════════════════════════════════════════════════════════════════════ */

type Piece = "dot" | "arrow" | "bar" | "plus" | "fork" | "diamond" | "curl" | "none";
type XArm = "NW" | "NE" | "SE" | "SW";
const X_ANGLE: Record<XArm, number> = { NE: -45, SE: 45, SW: 135, NW: -135 };
const X_ARMS: XArm[] = ["NW", "NE", "SE", "SW"];
const TURN_CW: Record<XArm, XArm> = { NW: "NE", NE: "SE", SE: "SW", SW: "NW" };

/** Draw a decoration at the tip of an arm pointing at `deg` (0 = right, clockwise). */
function EndPiece({ kind, deg, len = 34 }: { kind: Piece; deg: number; len?: number }) {
  const rad = (deg * Math.PI) / 180;
  const tx = 50 + Math.cos(rad) * len;
  const ty = 50 + Math.sin(rad) * len;
  const s = { stroke: "#1e1b4b", strokeWidth: 2.4, fill: "none", strokeLinecap: "round" as const };
  return (
    <g transform={`translate(${tx} ${ty}) rotate(${deg})`}>
      {kind === "dot" && <circle r={3.6} fill="#1e1b4b" />}
      {kind === "arrow" && <path d="M -7 -5 L 0 0 L -7 5" {...s} />}
      {kind === "bar" && <path d="M 0 -6 L 0 6" {...s} />}
      {kind === "plus" && <path d="M -3 -6 L -3 6 M -9 0 L 3 0" {...s} />}
      {kind === "fork" && <path d="M 0 0 L 6 -5 M 0 0 L 6 5" {...s} />}
      {kind === "diamond" && <path d="M 0 0 L 4 -4 L 8 0 L 4 4 Z" {...s} fill="#fff" />}
      {kind === "curl" && <path d="M 0 0 C 6 0 7 -7 2 -8" {...s} />}
    </g>
  );
}

function PlusFigure({ ends, turn = 0 }: { ends: Record<string, Piece>; turn?: number }) {
  const deg = { right: 0, bottom: 90, left: 180, top: -90 } as Record<string, number>;
  return (
    <motion.g animate={{ rotate: turn }} style={{ originX: "50px", originY: "50px" }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
      <path d="M 16 50 L 84 50 M 50 16 L 50 84" stroke="#1e1b4b" strokeWidth={2.4} />
      {Object.entries(ends).map(([k, v]) => (
        <EndPiece key={k} kind={v} deg={deg[k]} />
      ))}
    </motion.g>
  );
}

function XFigure({
  ends,
  turn = 0,
  onArm,
  hot,
}: {
  ends: Partial<Record<XArm, Piece>>;
  turn?: number;
  onArm?: (a: XArm) => void;
  hot?: boolean;
}) {
  return (
    <motion.g animate={{ rotate: turn }} style={{ originX: "50px", originY: "50px" }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
      <path d="M 26 26 L 74 74 M 74 26 L 26 74" stroke="#1e1b4b" strokeWidth={2.4} />
      {X_ARMS.map((a) => {
        const rad = (X_ANGLE[a] * Math.PI) / 180;
        const cx = 50 + Math.cos(rad) * 36;
        const cy = 50 + Math.sin(rad) * 36;
        return (
          <g key={a}>
            {ends[a] ? (
              <EndPiece kind={ends[a] as Piece} deg={X_ANGLE[a]} />
            ) : (
              hot && <circle cx={cx} cy={cy} r={6} fill="#ede9fe" stroke="#8b5cf6" strokeDasharray="2 2" />
            )}
            {onArm && <circle cx={cx} cy={cy} r={11} fill="transparent" role="button" aria-label={`arm ${a}`} style={{ cursor: "pointer" }} onClick={() => onArm(a)} />}
          </g>
        );
      })}
    </motion.g>
  );
}

interface TransformWorld {
  built: Partial<Record<XArm, Piece>>;
  holding: Piece | null;
  applied: boolean;
}

export function Q02TransformationLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const p = cfg<any>(question, "play", {});
  const figI: Record<string, Piece> = p.figI ?? {};
  const figIV: Record<XArm, Piece> = p.figIV ?? {};
  const pieces: Piece[] = p.pieces ?? [];
  const options: Record<string, Record<XArm, Piece>> = p.options ?? {};
  const [demo, setDemo] = useState(false);

  const play = usePlay<TransformWorld>({
    question,
    initial: { built: {}, holding: null, applied: false },
    derive: (w) => {
      const done = X_ARMS.every((a) => w.built[a]);
      if (!done) return { note: "Fit an end-piece on all four arms of figure (iii)." };
      const opt = Object.keys(options).find((id) => X_ARMS.every((a) => options[id][a] === w.built[a]));
      return {
        value: X_ARMS.map((a) => `${a}:${w.built[a]}`).join(" "),
        optionId: opt,
        note: w.applied ? undefined : "Tip: feed it through the transformation to compare with (iv).",
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const turned: Partial<Record<XArm, Piece>> = {};
  X_ARMS.forEach((a) => {
    if (w.built[a]) turned[TURN_CW[a]] = w.built[a];
  });
  const armMatch = X_ARMS.map((a) => (w.applied ? turned[a] === figIV[a] : null));

  return (
    <PlayShell
      title="Figure Transformation Lab"
      mission="Watch the machine turn figure (i) into figure (ii). Then fit end-pieces onto the blank figure (iii) so that the same machine turns it into figure (iv)."
      icon={Shuffle}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit figure (iii)"
      live={
        <>
          <Gauge label="Arms fitted" value={`${X_ARMS.filter((a) => w.built[a]).length} / 4`} tone="violet" />
          {w.applied && <Gauge label="Arms matching (iv)" value={`${armMatch.filter(Boolean).length} / 4`} tone={armMatch.every(Boolean) ? "emerald" : "amber"} />}
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <Bay label="Demonstration: (i) → (ii)">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-28 h-28 bg-white rounded-xl border border-slate-200">
              <PlusFigure ends={figI} />
            </svg>
            <span className="text-2xl text-violet-500 font-black">→</span>
            <svg viewBox="0 0 100 100" className="w-28 h-28 bg-white rounded-xl border-2 border-violet-300">
              <PlusFigure ends={figI} turn={demo ? 90 : 0} />
            </svg>
          </div>
          <Btn className="mt-2" active={demo} onClick={() => setDemo((d) => !d)}>
            <span className="inline-flex items-center gap-1">
              <Play className="w-3.5 h-3.5" /> {demo ? "Show (i) again" : "Run the machine on (i)"}
            </span>
          </Btn>
        </Bay>

        <Bay label="Your bench: build (iii), compare with (iv)" tone="violet">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-28 h-28 bg-white rounded-xl border-2 border-dashed border-violet-400">
              <XFigure
                ends={w.built}
                hot
                onArm={(a) => {
                  if (play.readOnly) return;
                  play.set((prev) => ({
                    ...prev,
                    applied: false,
                    built: { ...prev.built, [a]: prev.holding ?? undefined },
                  }));
                }}
              />
            </svg>
            <span className="text-2xl text-violet-500 font-black">→</span>
            <svg viewBox="0 0 100 100" className="w-28 h-28 bg-white rounded-xl border border-slate-200">
              {w.applied && <XFigure ends={w.built} turn={90} />}
              {!w.applied && <text x="50" y="56" textAnchor="middle" fontSize="12" fill="#a78bfa" fontWeight="800">output</text>}
            </svg>
            <svg viewBox="0 0 100 100" className="w-24 h-24 bg-white rounded-xl border border-slate-200">
              <XFigure ends={figIV} />
              <text x="6" y="12" fontSize="9" fontWeight="800" fill="#64748b">(iv)</text>
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-slate-500 mr-1">PICK A PIECE, THEN TAP AN ARM:</span>
            {pieces.map((pc) => (
              <button
                key={pc}
                type="button"
                disabled={play.readOnly}
                aria-label={pc}
                onClick={() => play.set((prev) => ({ ...prev, holding: prev.holding === pc ? null : pc }))}
                className={`w-11 h-11 rounded-lg border-2 grid place-items-center ${w.holding === pc ? "border-violet-600 bg-violet-100" : "border-slate-200 bg-white"}`}
              >
                <svg viewBox="30 30 40 40" className="w-9 h-9">
                  <EndPiece kind={pc} deg={0} len={0} />
                  <path d="M 36 50 L 50 50" stroke="#1e1b4b" strokeWidth={2.4} />
                </svg>
              </button>
            ))}
            <Btn
              tone="violet"
              active
              disabled={play.readOnly || !X_ARMS.every((a) => w.built[a])}
              onClick={() => play.patch({ applied: true })}
            >
              Feed (iii) through the machine
            </Btn>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q3 — Secret Sports Dictionary (2D)
   Real sports objects ride a conveyor. The student sticks each new-name tag on the object
   the rules say it belongs to, then hands the cricketer the object a cricketer really
   uses. The tag on that object is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const SPORT_ART: Record<string, string> = {
  Racket: "🏸",
  Football: "⚽",
  "Cricket bat": "🏏",
  "Basket ball": "🏀",
  Dice: "🎲",
};

interface ConveyorWorld {
  tags: Record<string, string | null>;
  holdingTag: string | null;
  inHands: string | null;
}

export function Q03SportsDictionary({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const renames = cfg<{ real: string; calledAs: string }[]>(question, "renames", []);
  const objects = useMemo(() => {
    const all = new Set<string>();
    renames.forEach((r) => {
      all.add(r.real);
      all.add(r.calledAs);
    });
    return [...all];
  }, [renames]);
  const tagPool = renames.map((r) => r.calledAs);

  const play = usePlay<ConveyorWorld>({
    question,
    initial: { tags: {}, holdingTag: null, inHands: null },
    derive: (w) => {
      if (!w.inHands) return { note: "Hand the cricketer the object a cricketer really plays with." };
      const name = w.tags[w.inHands] ?? w.inHands;
      return {
        value: name,
        optionId: matchText(question, name),
        note: w.tags[w.inHands] ? `The real ${w.inHands.toLowerCase()} carries the tag "${name}".` : "This object has no new-name tag yet.",
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const used = new Set(Object.values(w.tags).filter(Boolean) as string[]);

  const tapObject = (obj: string) => {
    if (play.readOnly) return;
    if (w.holdingTag) {
      play.set((p) => {
        const tags = { ...p.tags };
        Object.keys(tags).forEach((k) => {
          if (tags[k] === p.holdingTag) tags[k] = null;
        });
        tags[obj] = p.holdingTag;
        return { ...p, tags, holdingTag: null };
      });
    } else {
      play.set((p) => ({ ...p, inHands: p.inHands === obj ? null : obj }));
    }
  };

  return (
    <PlayShell
      title="Secret Sports Dictionary"
      mission="Follow the renaming rules: pick up a name tag and stick it on the real object that the rules rename. Then tap the object a cricketer truly plays with to put it in the cricketer's hands."
      icon={Tag}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit what the cricketer holds"
      live={<Gauge label="Tags placed" value={`${used.size} / ${tagPool.length}`} tone="violet" />}
    >
      <div className="grid md:grid-cols-[1fr_auto] gap-3">
        <Bay label="Rule book">
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {renames.map((r) => (
              <li key={r.real} className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5">
                <span className="text-slate-900">{r.real}</span> <span className="text-slate-400">is called</span>{" "}
                <span className="text-violet-700">‘{r.calledAs}’</span>
              </li>
            ))}
          </ul>
        </Bay>
        <Bay label="Cricketer" tone="violet" className="min-w-[150px]">
          <div className="flex flex-col items-center gap-1">
            <div className="text-5xl" aria-hidden>
              🧑‍🦱
            </div>
            <motion.div
              key={w.inHands ?? "none"}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="min-h-[56px] grid place-items-center text-center"
            >
              {w.inHands ? (
                <>
                  <span className="text-3xl">{SPORT_ART[w.inHands] ?? "❔"}</span>
                  <span className="text-[11px] font-black text-violet-700">{w.tags[w.inHands] ?? "no tag"}</span>
                </>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400">empty hands</span>
              )}
            </motion.div>
          </div>
        </Bay>
      </div>

      <Bay label="Name-tag rack" tone="violet">
        <div className="flex flex-wrap gap-1.5">
          {tagPool.map((t) => (
            <button
              key={t}
              type="button"
              disabled={play.readOnly}
              onClick={() => play.set((p) => ({ ...p, holdingTag: p.holdingTag === t ? null : t }))}
              className={`min-h-[44px] px-3 rounded-full border-2 text-xs font-black transition ${
                w.holdingTag === t
                  ? "bg-violet-600 border-violet-700 text-white scale-105"
                  : used.has(t)
                    ? "bg-violet-50 border-violet-200 text-violet-400"
                    : "bg-white border-violet-300 text-violet-800"
              }`}
            >
              🏷 {t}
            </button>
          ))}
        </div>
      </Bay>

      <div className="relative rounded-2xl border-2 border-slate-800 bg-slate-800 overflow-hidden p-3 pt-4">
        <div
          className="absolute inset-x-0 bottom-0 h-4 opacity-60"
          style={{
            background: "repeating-linear-gradient(90deg,#475569 0 14px,#1e293b 14px 28px)",
            animation: "imo6aBelt 1.2s linear infinite",
          }}
        />
        <style>{"@keyframes imo6aBelt{from{background-position:0 0}to{background-position:28px 0}}"}</style>
        <div className="relative flex flex-wrap justify-center gap-2 pb-4">
          {objects.map((obj, i) => (
            <motion.button
              key={obj}
              type="button"
              disabled={play.readOnly}
              onClick={() => tapObject(obj)}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className={`w-24 rounded-xl border-2 p-2 bg-white text-center ${w.inHands === obj ? "border-emerald-500 ring-2 ring-emerald-300" : "border-slate-200"}`}
            >
              <div className="text-3xl">{SPORT_ART[obj] ?? "❔"}</div>
              <div className="text-[10px] font-bold text-slate-500">real: {obj}</div>
              <div className={`mt-1 text-[10px] font-black rounded px-1 py-0.5 ${w.tags[obj] ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                {w.tags[obj] ? `🏷 ${w.tags[obj]}` : "no tag"}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — Laser Dot Grid (2D)
   The student scans each dot of the given figure to learn which shapes it lives in, then
   drops three laser dots onto a candidate board. A board is only certified when all three
   dots sit in the same combinations of shapes as the originals.
   ══════════════════════════════════════════════════════════════════════ */

interface Shapes {
  c: { cx: number; cy: number; r: number };
  s: { x: number; y: number; w: number; h: number };
  t: [number, number][];
}

function inTri(t: [number, number][], x: number, y: number) {
  const [a, b, c] = t;
  const d = (p: number[], q: number[]) => (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]);
  const d1 = d(a, b);
  const d2 = d(b, c);
  const d3 = d(c, a);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

function membership(sh: Shapes, x: number, y: number): string {
  const out: string[] = [];
  if (Math.hypot(x - sh.c.cx, y - sh.c.cy) <= sh.c.r) out.push("c");
  if (x >= sh.s.x && x <= sh.s.x + sh.s.w && y >= sh.s.y && y <= sh.s.y + sh.s.h) out.push("s");
  if (inTri(sh.t, x, y)) out.push("t");
  return out.join("");
}

const REGION_NAME = (k: string) =>
  k === "" ? "outside every shape" : k.split("").map((x) => ({ c: "circle", s: "square", t: "triangle" }[x])).join(" + ");

function ShapeArt({ sh, faint }: { sh: Shapes; faint?: boolean }) {
  const st = { fill: "none", stroke: faint ? "#94a3b8" : "#1e1b4b", strokeWidth: 1.2 };
  return (
    <>
      <rect x={sh.s.x} y={sh.s.y} width={sh.s.w} height={sh.s.h} {...st} />
      <circle cx={sh.c.cx} cy={sh.c.cy} r={sh.c.r} {...st} />
      <polygon points={sh.t.map((p) => p.join(",")).join(" ")} {...st} />
    </>
  );
}

interface LaserWorld {
  scanned: boolean[];
  board: string | null;
  dots: Record<string, [number, number][]>;
}

function LaserDot({ x, y, onMove, readOnly, svgRef, label }: { x: number; y: number; onMove: (x: number, y: number) => void; readOnly?: boolean; svgRef: React.RefObject<SVGSVGElement | null>; label: string }) {
  const rect = useRef<DOMRect | null>(null);
  const { start, dragging } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const r = rect.current;
      if (!r) return;
      onMove(clamp(((p.x - r.left) / r.width) * 100, 0, 100), clamp(((p.y - r.top) / r.height) * 80, 0, 80));
    },
  });
  return (
    <g
      onPointerDown={(e) => {
        rect.current = svgRef.current?.getBoundingClientRect() ?? null;
        start(e as unknown as React.PointerEvent, undefined);
      }}
      style={{ cursor: readOnly ? "default" : dragging ? "grabbing" : "grab", touchAction: "none" }}
    >
      <circle cx={x} cy={y} r={7} fill="transparent" />
      <circle cx={x} cy={y} r={4.2} fill="#fecdd3" opacity={0.7}>
        <animate attributeName="r" values="3.2;5;3.2" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r={1.9} fill="#e11d48" stroke="#fff" strokeWidth={0.5} />
      <text x={x + 3} y={y - 3} fontSize={3.6} fontWeight={900} fill="#9f1239">
        {label}
      </text>
    </g>
  );
}

export function Q04LaserDotGrid({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const p = cfg<any>(question, "play", {});
  const given: Shapes & { dots: [number, number][] } = p.given;
  const boards: Record<string, Shapes> = p.boards ?? {};
  const required = useMemo(() => (given?.dots ?? []).map(([x, y]) => membership(given, x, y)), [given]);
  const svgRef = useRef<SVGSVGElement>(null);

  const fresh = (): [number, number][] => [
    [12, 8],
    [22, 8],
    [32, 8],
  ];

  const play = usePlay<LaserWorld>({
    question,
    initial: { scanned: required.map(() => false), board: null, dots: {} },
    derive: (w) => {
      if (!w.scanned.every(Boolean)) return { note: "Scan all three dots of the given figure first." };
      if (!w.board) return { note: "Choose a candidate board and drop your laser dots on it." };
      const dots = w.dots[w.board] ?? [];
      const got = dots.map(([x, y]) => membership(boards[w.board!], x, y)).sort();
      const want = [...required].sort();
      const ok = got.length === want.length && got.every((g, i) => g === want[i]);
      if (!ok) return { note: `Board ${w.board}: the dots do not yet repeat the given placement.` };
      return { value: `Board ${w.board} repeats the placement`, optionId: w.board };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const active = w.board ? w.dots[w.board] ?? fresh() : null;
  const got = active && w.board ? active.map(([x, y]) => membership(boards[w.board!], x, y)) : [];
  const remaining = [...required];
  const satisfied = got.map((g) => {
    const i = remaining.indexOf(g);
    if (i >= 0) {
      remaining.splice(i, 1);
      return true;
    }
    return false;
  });

  return (
    <PlayShell
      title="Laser Dot Grid"
      mission="Tap each black dot in the given figure to scan which shapes it sits inside. Then open a candidate board and drag the three red laser dots until every one repeats a scanned placement."
      icon={Crosshair}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Certify this board"
      live={
        <>
          <Gauge label="Dots scanned" value={`${w.scanned.filter(Boolean).length} / ${required.length}`} tone="violet" />
          {w.board && <Gauge label={`Board ${w.board}`} value={`${satisfied.filter(Boolean).length} / ${required.length} dots placed`} tone={satisfied.every(Boolean) ? "emerald" : "amber"} />}
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-3">
        <Bay label="Given figure — tap the dots">
          <svg viewBox="0 0 100 80" className="w-full bg-white rounded-xl border border-slate-200">
            {given && <ShapeArt sh={given} />}
            {given?.dots.map(([x, y], i) => (
              <g key={i} role="button" aria-label={`scan dot ${i + 1}`} onClick={() => !play.readOnly && play.set((prev) => ({ ...prev, scanned: prev.scanned.map((s, j) => (j === i ? true : s)) }))} style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r={6} fill={w.scanned[i] ? "#ddd6fe" : "transparent"} />
                <circle cx={x} cy={y} r={1.6} fill="#0f172a" />
                <text x={x + 2.5} y={y - 2.5} fontSize={3.8} fontWeight={900} fill="#6d28d9">
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
          <ul className="mt-2 space-y-1">
            {required.map((r, i) => (
              <li key={i} className={`text-[11px] font-bold rounded-lg px-2 py-1 border ${w.scanned[i] ? "bg-violet-50 border-violet-200 text-violet-800" : "bg-white border-slate-200 text-slate-400"}`}>
                Dot {i + 1}: {w.scanned[i] ? `inside ${REGION_NAME(r)} only` : "not scanned"}
              </li>
            ))}
          </ul>
        </Bay>

        <Bay label="Candidate boards" tone="violet">
          <div className="flex gap-1.5 mb-2">
            {Object.keys(boards).map((id) => (
              <Btn
                key={id}
                active={w.board === id}
                disabled={play.readOnly}
                onClick={() => play.set((prev) => ({ ...prev, board: id, dots: prev.dots[id] ? prev.dots : { ...prev.dots, [id]: fresh() } }))}
                className="w-12"
              >
                {id}
              </Btn>
            ))}
          </div>
          {w.board && active ? (
            <svg ref={svgRef} viewBox="0 0 100 80" className="w-full bg-white rounded-xl border-2 border-violet-300" style={{ touchAction: "none" }}>
              <ShapeArt sh={boards[w.board]} />
              {active.map(([x, y], i) => (
                <LaserDot
                  key={i}
                  x={x}
                  y={y}
                  label={satisfied[i] ? "✓" : "·"}
                  svgRef={svgRef}
                  readOnly={play.readOnly}
                  onMove={(nx, ny) =>
                    play.set((prev) => ({
                      ...prev,
                      dots: { ...prev.dots, [prev.board!]: (prev.dots[prev.board!] ?? fresh()).map((d, j) => (j === i ? [nx, ny] : d)) },
                    }))
                  }
                />
              ))}
            </svg>
          ) : (
            <div className="h-40 grid place-items-center text-xs font-semibold text-slate-400">Pick a board to open it</div>
          )}
          {w.board && (
            <ul className="mt-2 space-y-1">
              {got.map((g, i) => (
                <li key={i} className="text-[11px] font-semibold text-slate-600">
                  Laser {i + 1}: inside {REGION_NAME(g)}
                </li>
              ))}
            </ul>
          )}
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — Carrom Direction Challenge (3D)
   A carrom board on a fixed compass rose. The student seats the four players, may spin
   the board as a whole, and switches on the West beam. The beam finds whoever faces west.
   ══════════════════════════════════════════════════════════════════════ */

const DIRS = ["N", "E", "S", "W"] as const;
type Dir = (typeof DIRS)[number];
const DIR_NAME: Record<Dir, string> = { N: "North", E: "East", S: "South", W: "West" };
const opposite = (d: Dir): Dir => DIRS[(DIRS.indexOf(d) + 2) % 4];
const cw = (d: Dir): Dir => DIRS[(DIRS.indexOf(d) + 1) % 4];
const PLAYER_COLOR: Record<string, string> = { A: "#8b5cf6", B: "#0ea5e9", C: "#f59e0b", D: "#10b981" };

interface CarromWorld {
  seats: (string | null)[];
  turn: number;
  holding: string | null;
  beam: boolean;
}

function seatDir(i: number, turn: number): Dir {
  return DIRS[(((i + turn) % 4) + 4) % 4];
}

function Player({ id, pos, glow }: { id: string; pos: [number, number, number]; glow: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = pos[1] + (glow ? Math.sin(clock.elapsedTime * 5) * 0.05 : 0);
  });
  // Every player faces the centre of the board.
  const yaw = Math.atan2(-pos[0], -pos[2]);
  return (
    <group ref={ref} position={pos} rotation={[0, yaw, 0]}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.28, 0.5, 6, 16]} />
        <meshStandardMaterial color={PLAYER_COLOR[id]} emissive={glow ? PLAYER_COLOR[id] : "#000"} emissiveIntensity={glow ? 0.8 : 0} />
      </mesh>
      <mesh castShadow position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#fde7d6" />
      </mesh>
      {/* nose: shows which way the player faces */}
      <mesh position={[0, 1.08, 0.24]}>
        <coneGeometry args={[0.07, 0.18, 12]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <Label3D text={id} position={[0, 1.62, 0]} size={[0.5, 0.5]} billboard style={{ bg: PLAYER_COLOR[id], fg: "#fff" }} />
    </group>
  );
}

function CarromScene({ world, onSeat }: { world: CarromWorld; onSeat: (i: number) => void }) {
  const board = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (board.current) board.current.rotation.y = approach(board.current.rotation.y, -world.turn * (Math.PI / 2), 6, dt);
  });
  const seatLocal: [number, number, number][] = [
    [0, 0, -2.2],
    [2.2, 0, 0],
    [0, 0, 2.2],
    [-2.2, 0, 0],
  ];
  const westSeat = world.seats.findIndex((_, i) => seatDir(i, world.turn) === "E");
  const westPlayer = westSeat >= 0 ? world.seats[westSeat] : null;

  return (
    <>
      <Floor y={-0.01} color="#e0e7ff" />
      {/* Fixed compass rose */}
      {DIRS.map((d, i) => {
        const a = (i * Math.PI) / 2;
        const x = Math.sin(a) * 3.4;
        const z = -Math.cos(a) * 3.4;
        return <Label3D key={d} text={d} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]} size={[0.6, 0.6]} style={{ bg: d === "N" ? "#e11d48" : "#1e1b4b", fg: "#fff" }} />;
      })}
      <group ref={board}>
        <RoundedBox args={[3.2, 0.25, 3.2]} radius={0.06} position={[0, 0.12, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.26, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.02, 2.8]} />
          <meshStandardMaterial color="#fde68a" roughness={0.8} />
        </mesh>
        {[
          [-1.3, -1.3],
          [1.3, -1.3],
          [-1.3, 1.3],
          [1.3, 1.3],
        ].map(([x, z], k) => (
          <mesh key={k} position={[x, 0.28, z]}>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 20]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
        ))}
        <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 40]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>
        {seatLocal.map((pos, i) => {
          const occupant = world.seats[i];
          return (
            <group key={i}>
              <mesh position={[pos[0], 0.03, pos[2]]} rotation={[-Math.PI / 2, 0, 0]} onClick={(e) => (e.stopPropagation(), onSeat(i))}>
                <circleGeometry args={[0.55, 32]} />
                <meshStandardMaterial color={occupant ? "#a78bfa" : "#ffffff"} />
              </mesh>
              {occupant && <Player id={occupant} pos={[pos[0], 0.02, pos[2]]} glow={world.beam && occupant === westPlayer} />}
            </group>
          );
        })}
      </group>
      {/* The West beam: a light shaft pointing due West from the player who faces that way */}
      {world.beam && westPlayer && (
        <mesh position={[0.1, 0.9, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.35, 4.2, 24, 1, true]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

export function Q05CarromBoard({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const players = cfg<string[]>(question, "players", ["A", "B", "C", "D"]);
  const anchor = cfg<{ player: string; facing: Dir }>(question, "anchor", { player: "B", facing: "N" });
  const rightOf = cfg<{ of: string; is: string }[]>(question, "rightOf", []);

  const play = usePlay<CarromWorld>({
    question,
    initial: { seats: [null, null, null, null], turn: 0, holding: null, beam: false },
    derive: (w) => {
      if (w.seats.some((s) => !s)) return { note: "Seat all four players around the board." };
      if (!w.beam) return { note: "Switch on the West beam to find who faces west." };
      const i = w.seats.findIndex((_, k) => seatDir(k, w.turn) === "E");
      const who = w.seats[i]!;
      return { value: who, optionId: matchText(question, who) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const dirOf = (p: string): Dir | undefined => {
    const i = w.seats.indexOf(p);
    return i < 0 ? undefined : seatDir(i, w.turn);
  };
  const facingOf = (p: string) => {
    const d = dirOf(p);
    return d ? opposite(d) : undefined;
  };
  const checks = [
    { label: `${anchor.player} faces ${DIR_NAME[anchor.facing]}`, met: facingOf(anchor.player) === anchor.facing },
    ...rightOf.map((r) => {
      const f = facingOf(r.of);
      const rightSeat = f ? cw(f) : undefined;
      return { label: `${r.is} sits on ${r.of}'s right`, met: !!rightSeat && dirOf(r.is) === rightSeat };
    }),
  ];

  const seat = (i: number) => {
    if (play.readOnly) return;
    play.set((prev) => {
      const seats = [...prev.seats];
      if (prev.holding) {
        const old = seats.indexOf(prev.holding);
        if (old >= 0) seats[old] = null;
        seats[i] = prev.holding;
        return { ...prev, seats, holding: null, beam: false };
      }
      seats[i] = null;
      return { ...prev, seats, beam: false };
    });
  };

  return (
    <PlayShell
      title="Carrom Direction Challenge"
      mission="Pick a player, then tap a seat pad to sit them at the board. Everyone faces the centre. Spin the board if it helps, while the compass stays fixed. When every clue holds, switch on the West beam."
      icon={Compass}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the West-facing player"
      live={
        <>
          {checks.map((c) => (
            <Gauge key={c.label} label="Clue" value={`${c.met ? "✓" : "✗"} ${c.label}`} tone={c.met ? "emerald" : "slate"} />
          ))}
        </>
      }
    >
      <Stage3D height={340} camera={{ position: [0, 6.2, 6.4], fov: 40 }} readOnly={play.readOnly}>
        <CarromScene world={w} onSeat={seat} />
      </Stage3D>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">PLAYERS:</span>
        {players.map((p) => (
          <Btn key={p} active={w.holding === p} disabled={play.readOnly} onClick={() => play.set((prev) => ({ ...prev, holding: prev.holding === p ? null : p }))} className="w-12">
            <span style={{ color: w.holding === p ? undefined : PLAYER_COLOR[p] }}>{p}</span>
            {w.seats.includes(p) && <span className="text-[9px] block leading-none">seated</span>}
          </Btn>
        ))}
        <span className="mx-1 w-px h-8 bg-slate-200" />
        {DIRS.map((d) => {
          const i = [0, 1, 2, 3].find((k) => seatDir(k, w.turn) === d)!;
          return (
            <Btn key={d} disabled={play.readOnly || !w.holding} onClick={() => seat(i)} title={`Seat at the ${DIR_NAME[d]} pad`}>
              {d} pad
            </Btn>
          );
        })}
        <span className="mx-1 w-px h-8 bg-slate-200" />
        <Btn disabled={play.readOnly} onClick={() => play.set((prev) => ({ ...prev, turn: prev.turn - 1, beam: false }))}>
          ⟲ Spin board
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => play.set((prev) => ({ ...prev, turn: prev.turn + 1, beam: false }))}>
          Spin board ⟳
        </Btn>
        <Btn tone="amber" active={w.beam} disabled={play.readOnly || w.seats.some((s) => !s)} onClick={() => play.patch({ beam: !w.beam })}>
          <span className="inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> West beam
          </span>
        </Btn>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import { ScanLine, Shuffle, Layers3, CarFront, Shapes, Puzzle, Trees, Search, Grid3x3, Crosshair, Blocks, FlipHorizontal } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOptionState, sameSet } from "../imo6a/shared";
import { usePointerDrag, clamp } from "../kit/usePointerDrag";
import { usePlay, cfg } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Label3D, approach, Floor, usePlaneDrag } from "../imo6a-play/three";
import { clientToSvg } from "../imo6a-play/svgPoint";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — Symbol Security Scanner (3D)
   The character sequence rides a conveyor through a glass inspection chamber. The student
   runs, pauses or slows the belt, and pulls characters into the collection tray. The
   chamber shows what sits either side of the character inside it.
   ══════════════════════════════════════════════════════════════════════ */

const kindOf = (ch?: string) => (!ch ? "—" : /[0-9]/.test(ch) ? "NUMBER" : /[AEIOU]/.test(ch) ? "VOWEL" : /[A-Z]/.test(ch) ? "CONSONANT" : "SYMBOL");

function Belt({ seq, offset, tray, onPull }: { seq: string[]; offset: React.MutableRefObject<number>; tray: number[]; onPull: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const L = seq.length * 0.9;
  useFrame(() => {
    if (!group.current) return;
    group.current.children.forEach((c, i) => {
      const x = ((((i * 0.9 - offset.current) % L) + L) % L) - L / 2;
      c.position.x = x;
    });
  });
  return (
    <group ref={group}>
      {seq.map((ch, i) => (
        <group key={i} position={[0, 0.62, 0]} onClick={(e) => (e.stopPropagation(), onPull(i))}>
          <RoundedBox args={[0.7, 0.7, 0.18]} radius={0.06} castShadow>
            <meshStandardMaterial color={tray.includes(i) ? "#a78bfa" : "#ffffff"} />
          </RoundedBox>
          <Label3D text={ch} position={[0, 0, 0.1]} size={[0.6, 0.6]} style={{ bg: null, fg: kindOf(ch) === "SYMBOL" ? "#be123c" : "#1e1b4b" }} />
        </group>
      ))}
    </group>
  );
}

function Rollers({ speed }: { speed: React.MutableRefObject<number> }) {
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame((_, dt) => refs.current.forEach((m) => m && (m.rotation.x -= speed.current * dt * 3)));
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} ref={(m) => m && (refs.current[i] = m)} position={[-8.5 + i * 1.55, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.9, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
      ))}
    </>
  );
}

interface ScanWorld {
  tray: number[];
}

export function B01SymbolScanner({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const seq = cfg<string[]>(question, "sequence", []);
  const [mode, setMode] = useState<"run" | "pause" | "slow">("pause");
  const [zoom, setZoom] = useState(false);
  const offset = useRef(0);
  const speed = useRef(0);
  const [inChamber, setInChamber] = useState(0);

  const play = usePlay<ScanWorld>({
    question,
    initial: { tray: [] },
    derive: (w) => (!w.tray.length ? { note: "Pull every qualifying symbol into the collection tray." } : { value: `${w.tray.length} symbol${w.tray.length === 1 ? "" : "s"} collected`, optionId: matchText(question, ["Zero", "One", "Two", "Three", "Four", "Five"][w.tray.length] ?? String(w.tray.length)) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  function Driver() {
    useFrame((_, dt) => {
      const target = mode === "run" ? 1.2 : mode === "slow" ? 0.35 : 0;
      speed.current = approach(speed.current, target, 6, dt);
      offset.current += speed.current * dt;
      const L = seq.length * 0.9;
      // the chamber sits at x = 0: which tile is closest to it
      const idx = Math.round((((offset.current + L / 2) % L) + L) % L / 0.9) % seq.length;
      if (idx !== inChamber) setInChamber(idx);
    });
    return null;
  }

  const prev = seq[inChamber - 1];
  const next = seq[inChamber + 1];

  return (
    <PlayShell
      title="Symbol Security Scanner"
      mission="Run the belt and watch the glass chamber: it reports what kind of character is either side of the one inside. Tap a character on the belt to pull it into the collection tray (tap again to put it back). Collect every symbol that has a number just before it and a consonant just after it."
      icon={ScanLine}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the tray count"
      live={
        <>
          <Gauge label="In the chamber" value={`${kindOf(prev)} → ${seq[inChamber]} → ${kindOf(next)}`} tone="violet" />
          <Gauge label="Collection tray" value={w.tray.map((i) => seq[i]).join(" ") || "empty"} tone="amber" />
        </>
      }
    >
      <Stage3D height={zoom ? 360 : 280} camera={{ position: [0, zoom ? 1.6 : 2.6, zoom ? 3.2 : 6.5], fov: 42 }} orbitTarget={[0, 0.6, 0]} readOnly={play.readOnly}>
        <Floor />
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <boxGeometry args={[19, 0.1, 1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <Rollers speed={speed} />
        <Belt seq={seq} offset={offset} tray={w.tray} onPull={(i) => !play.readOnly && play.set((p) => ({ tray: p.tray.includes(i) ? p.tray.filter((x) => x !== i) : [...p.tray, i] }))} />
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.05, 1.1, 1.2]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.18} />
        </mesh>
        {[-0.45, 0.45].map((x) => (
          <mesh key={x} position={[x, 1.45, 0.62]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={mode === "pause" ? "#f59e0b" : "#ef4444"} emissive={mode === "pause" ? "#f59e0b" : "#ef4444"} emissiveIntensity={1} />
          </mesh>
        ))}
        <Driver />
      </Stage3D>
      <div className="flex flex-wrap gap-2">
        <Btn tone="emerald" active={mode === "run"} disabled={play.readOnly} onClick={() => setMode("run")}>
          ▶ Start
        </Btn>
        <Btn tone="amber" active={mode === "pause"} disabled={play.readOnly} onClick={() => setMode("pause")}>
          ⏸ Pause
        </Btn>
        <Btn tone="sky" active={mode === "slow"} disabled={play.readOnly} onClick={() => setMode("slow")}>
          ⏪ Slow motion
        </Btn>
        <Btn active={zoom} disabled={play.readOnly} onClick={() => setZoom((z) => !z)}>
          🔍 Zoom
        </Btn>
      </div>
      <Bay label="The full arrangement (tap to pull, same as on the belt)">
        <div className="flex flex-wrap gap-1 font-mono">
          {seq.map((ch, i) => (
            <button
              key={i}
              type="button"
              disabled={play.readOnly}
              onClick={() => play.set((p) => ({ tray: p.tray.includes(i) ? p.tray.filter((x) => x !== i) : [...p.tray, i] }))}
              className={`w-9 h-10 rounded border-2 text-lg font-black ${w.tray.includes(i) ? "bg-violet-600 border-violet-700 text-white" : "bg-white border-slate-200"}`}
              aria-label={`character ${i + 1}: ${ch}`}
            >
              {ch}
            </button>
          ))}
        </div>
      </Bay>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q2 — Shape Transformation Machine (2D)
   The first chamber tries a chosen transformation on figure (i) and lights up when the
   result is figure (ii). The student then loads figure (iii) into the second chamber with
   the same transformation; the candidate piece matching the output snaps into place.
   ══════════════════════════════════════════════════════════════════════ */

type Fig = { cells: [number, number][]; dot: [number, number] };
type Tf = "rot90" | "rot180" | "rot270" | "flipH" | "flipV";
const TF_LABEL: Record<Tf, string> = { rot90: "Turn ¼ clockwise", rot180: "Turn ½", rot270: "Turn ¼ anticlockwise", flipH: "Flip left↔right", flipV: "Flip top↔bottom" };
function applyTf(f: Fig, t: Tf): Fig {
  const m = ([r, c]: [number, number]): [number, number] =>
    t === "rot90" ? [c, 2 - r] : t === "rot180" ? [2 - r, 2 - c] : t === "rot270" ? [2 - c, r] : t === "flipH" ? [r, 2 - c] : [2 - r, c];
  return { cells: f.cells.map(m), dot: m(f.dot) };
}
const sameFig = (a: Fig, b: Fig) => sameSet(a.cells.map((x) => x.join(",")), b.cells.map((x) => x.join(","))) && a.dot.join() === b.dot.join();

function FigArt({ f, tone = "#6d28d9" }: { f: Fig | null; tone?: string }) {
  return (
    <svg viewBox="0 0 30 30" className="w-full h-full">
      <rect x={0.5} y={0.5} width={29} height={29} fill="#fff" stroke="#cbd5e1" />
      {f?.cells.map(([r, c]) => (
        <rect key={`${r}${c}`} x={1.5 + c * 9} y={1.5 + r * 9} width={9} height={9} fill={tone} opacity={0.75} stroke="#fff" strokeWidth={0.5} />
      ))}
      {f && <circle cx={6 + f.dot[1] * 9} cy={6 + f.dot[0] * 9} r={2.2} fill="#facc15" stroke="#1e1b4b" strokeWidth={0.5} />}
    </svg>
  );
}

interface TfWorld {
  tf: Tf | null;
  testedOnI: boolean;
  appliedToIII: boolean;
}

export function B02TransformationMachine({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figI = cfg<Fig>(question, "figI", { cells: [], dot: [0, 0] });
  const figIII = cfg<Fig>(question, "figIII", { cells: [], dot: [0, 0] });
  const relation = cfg<Tf>(question, "relation", "rot90");
  const optionTf = cfg<Record<string, Tf>>(question, "optionTransforms", {});
  const figII = applyTf(figI, relation);

  const play = usePlay<TfWorld>({
    question,
    initial: { tf: null, testedOnI: false, appliedToIII: false },
    derive: (w) => {
      if (!w.tf || !w.appliedToIII) return { note: "Find the transformation that turns (i) into (ii), then feed (iii) through it." };
      const out = applyTf(figIII, w.tf);
      const opt = Object.keys(optionTf).find((id) => sameFig(applyTf(figIII, optionTf[id]), out));
      return { value: `(iii) → ${TF_LABEL[w.tf]}`, optionId: opt };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const testOut = w.tf ? applyTf(figI, w.tf) : null;
  const matchesII = !!testOut && sameFig(testOut, figII);
  const outIII = w.tf && w.appliedToIII ? applyTf(figIII, w.tf) : null;
  const snapped = outIII ? Object.keys(optionTf).find((id) => sameFig(applyTf(figIII, optionTf[id]), outIII)) : undefined;

  return (
    <PlayShell
      title="Shape Transformation Machine"
      mission="Pick a transformation and test it on figure (i) in the first chamber. The chamber lights up when the result is figure (ii). Then feed figure (iii) through the same transformation; the candidate piece that matches the output snaps into the output chamber."
      icon={Shuffle}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the output piece"
    >
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(TF_LABEL) as Tf[]).map((t) => (
          <Btn key={t} active={w.tf === t} disabled={play.readOnly} onClick={() => play.set({ tf: t, testedOnI: false, appliedToIII: false })}>
            {TF_LABEL[t]}
          </Btn>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Bay label="Chamber 1: test on figure (i)">
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="aspect-square">
              <FigArt f={figI} />
            </div>
            <motion.div animate={w.testedOnI ? { rotate: [0, 180, 360] } : {}} className="text-3xl text-center">
              ⚙️
            </motion.div>
            <div className={`aspect-square rounded ${w.testedOnI ? (matchesII ? "ring-4 ring-emerald-400" : "ring-4 ring-rose-400") : ""}`}>
              <FigArt f={w.testedOnI ? testOut : null} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-16 aspect-square">
              <FigArt f={figII} tone="#0f766e" />
            </div>
            <span className="text-[11px] font-bold text-slate-600">figure (ii)</span>
            <Btn className="ml-auto" disabled={play.readOnly || !w.tf} onClick={() => play.patch({ testedOnI: true })}>
              Test on (i)
            </Btn>
          </div>
          {w.testedOnI && <div className={`mt-1 text-xs font-black ${matchesII ? "text-emerald-700" : "text-rose-600"}`}>{matchesII ? "The output is figure (ii)." : "Not figure (ii) — try another transformation."}</div>}
        </Bay>
        <Bay label="Chamber 2: figure (iii) → output" tone="violet">
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="aspect-square">
              <FigArt f={figIII} />
            </div>
            <div className="text-3xl text-center">➜</div>
            <div className="aspect-square">
              <FigArt f={outIII} tone="#0f766e" />
            </div>
          </div>
          <Btn className="mt-2" tone="violet" active disabled={play.readOnly || !w.tf} onClick={() => play.patch({ appliedToIII: true })}>
            Feed (iii) through {w.tf ? TF_LABEL[w.tf].toLowerCase() : "…"}
          </Btn>
        </Bay>
      </div>
      <Bay label="Candidate pieces waiting outside">
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(optionTf).map((id) => (
            <motion.div key={id} animate={snapped === id ? { y: -10, scale: 1.05 } : { y: 0, scale: 1 }} className={`rounded-lg border-2 p-1 ${snapped === id ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
              <div className="text-[10px] font-black text-slate-500">{id}</div>
              <div className="aspect-square">
                <FigArt f={applyTf(figIII, optionTf[id])} tone="#64748b" />
              </div>
            </motion.div>
          ))}
        </div>
      </Bay>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — Nested Shape Evolution (3D)
   The series stands as transparent nested containers. The student builds the next set by
   choosing the outer, middle and inner shells from the parts bin; the machine assembles
   it in 3D beside the series.
   ══════════════════════════════════════════════════════════════════════ */

type ShellShape = "square" | "circle" | "triangle";

function ShellMesh({ shape, size, color }: { shape: ShellShape; size: number; color: string }) {
  const geo =
    shape === "square" ? <boxGeometry args={[size, size, size]} /> : shape === "circle" ? <sphereGeometry args={[size * 0.62, 24, 24]} /> : <coneGeometry args={[size * 0.62, size, 3]} />;
  return (
    <mesh>
      {geo}
      <meshStandardMaterial color={color} transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Nest({ x, stack, label, highlight }: { x: number; stack: (ShellShape | null)[]; label: string; highlight?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4;
  });
  const colors = ["#8b5cf6", "#0ea5e9", "#f59e0b"];
  return (
    <group position={[x, 1, 0]}>
      <group ref={ref}>
        {stack.map((s, i) => (s ? <ShellMesh key={i} shape={s} size={1.3 - i * 0.4} color={colors[i]} /> : null))}
      </group>
      <Label3D text={label} position={[0, -1.1, 0]} size={[1.3, 0.32]} billboard style={{ bg: highlight ? "#7c3aed" : "#1e1b4b", fg: "#fff", scale: 0.55 }} />
    </group>
  );
}

interface NestWorld {
  stack: (ShellShape | null)[];
  slot: number;
}

export function B05NestingMachine({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const series = cfg<ShellShape[][]>(question, "series", []);
  const play = usePlay<NestWorld>({
    question,
    initial: { stack: [null, null, null], slot: 0 },
    derive: (w) => {
      if (w.stack.some((s) => !s)) return { note: "Choose the outer, middle and inner shells." };
      return { value: w.stack.join(" ⊃ "), optionId: matchOptionState(question, w.stack, (o: string[], b) => o.join() === b.join()) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const layer = ["Outer shell", "Middle shell", "Inner shell"];

  return (
    <PlayShell
      title="Nested Shape Evolution"
      mission="The series stands as nested transparent shells. Work out how the layers move from one figure to the next. Then choose the outer, middle and inner shells for the next figure; the machine assembles it at the end of the row."
      icon={Layers3}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the next figure"
      live={<Gauge label="Your figure" value={w.stack.map((s) => s ?? "?").join(" ⊃ ")} tone="violet" />}
    >
      <Stage3D height={300} camera={{ position: [0, 2.2, 7.4], fov: 42 }} orbitTarget={[0, 0.9, 0]} readOnly={play.readOnly}>
        <Floor />
        {series.map((s, i) => (
          <Nest key={i} x={(i - 1.5) * 2.2} stack={s} label={`Figure ${i + 1}`} />
        ))}
        <Nest x={1.5 * 2.2} stack={w.stack} label="Figure 4 (yours)" highlight />
      </Stage3D>
      <div className="grid sm:grid-cols-3 gap-2">
        {layer.map((l, i) => (
          <Bay key={l} label={l} tone={w.slot === i ? "violet" : "slate"}>
            <div className="flex gap-1.5">
              {(["square", "circle", "triangle"] as ShellShape[]).map((s) => (
                <Btn key={s} active={w.stack[i] === s} disabled={play.readOnly} onClick={() => play.set((p) => ({ slot: i, stack: p.stack.map((x, j) => (j === i ? s : x)) }))}>
                  {s === "square" ? "■" : s === "circle" ? "●" : "▲"} {s}
                </Btn>
              ))}
            </div>
          </Bay>
        ))}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q6 — Number Swap Race (2D)
   Each car wears the number on its front plate, split across front and rear digits. The
   student swaps each car's plates, then starts the race: cars finish in order of their
   new numbers, smallest first. The student flags the car that finished in the position
   the question asks about.
   ══════════════════════════════════════════════════════════════════════ */

interface RaceWorld {
  swapped: boolean[];
  raced: boolean;
  flagged: number | null;
}
const swapFL = (n: number) => {
  const s = String(n).split("");
  [s[0], s[s.length - 1]] = [s[s.length - 1], s[0]];
  return Number(s.join(""));
};

export function B06NumberSwapRace({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const nums = cfg<number[]>(question, "numbers", []);
  const rank = cfg<number>(question, "rank", 1);
  const play = usePlay<RaceWorld>({
    question,
    initial: { swapped: nums.map(() => false), raced: false, flagged: null },
    derive: (w) => {
      if (!w.raced) return { note: "Swap the plates and start the race." };
      if (w.flagged === null) return { note: `Flag the car that finished ${rank === 2 ? "second" : `#${rank}`}.` };
      return { value: `Car ${nums[w.flagged]}`, optionId: matchNumber(question, nums[w.flagged]) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const plate = (i: number) => (w.swapped[i] ? swapFL(nums[i]) : nums[i]);
  const order = [...nums.keys()].sort((a, b) => plate(a) - plate(b));
  const COLORS = ["#8b5cf6", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e"];

  return (
    <PlayShell
      title="Number Swap Race"
      mission={`Tap a car's plates to swap its first and last digits. When every car is ready, start the race: cars finish in order of their plate numbers, smallest first. Flag the car that finishes ${rank === 2 ? "second" : `in position ${rank}`}.`}
      icon={CarFront}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the flagged car"
      live={<Gauge label="Plates swapped" value={`${w.swapped.filter(Boolean).length} / ${nums.length}`} tone="violet" />}
    >
      <div className="rounded-2xl bg-slate-700 p-3 space-y-2">
        {nums.map((n, i) => {
          const place = order.indexOf(i);
          return (
            <div key={n} className="relative h-12 rounded-lg bg-slate-600 border-b-2 border-dashed border-slate-400">
              <motion.button
                type="button"
                disabled={play.readOnly}
                animate={{ left: w.raced ? `${78 - place * 14}%` : "2%" }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                onClick={() => (w.raced ? play.patch({ flagged: i }) : play.set((p) => ({ ...p, swapped: p.swapped.map((s, j) => (j === i ? !s : s)) })))}
                className={`absolute top-1 h-10 px-2 rounded-lg text-white font-mono text-lg font-black flex items-center gap-1 ${w.flagged === i ? "ring-4 ring-yellow-300" : ""}`}
                style={{ background: COLORS[i % COLORS.length] }}
                aria-label={`car ${n}`}
              >
                🏎 {plate(i)}
                {w.raced && <span className="text-[10px] bg-white/30 rounded px-1">#{place + 1}</span>}
              </motion.button>
              <span className="absolute right-2 top-3 text-xl">🏁</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn tone="emerald" active disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, raced: true, flagged: null }))}>
          🚦 Start the race
        </Btn>
        <Btn disabled={play.readOnly || !w.raced} onClick={() => play.set((p) => ({ ...p, raced: false, flagged: null }))}>
          Back to the grid
        </Btn>
        {w.raced && <span className="text-[11px] font-bold text-slate-600 self-center">Tap a car to flag it. Original number shown on the car's paperwork: {nums.map((n, i) => `${plate(i)}←${n}`).join(", ")}</span>}
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — Classification Arena (2D)
   Nine figures and three gates. The student picks up a figure (tap it to turn it over and
   inspect it) and sends it through a gate. When all nine have passed, the arena doors
   open and the grouping is read.
   ══════════════════════════════════════════════════════════════════════ */

const FIG_PATH: Record<string, string> = {
  equilateral: "M 10 32 L 25 6 L 40 32 Z",
  square: "M 11 7 L 39 7 L 39 35 L 11 35 Z",
  circle: "M 25 7 A 14 14 0 1 1 24.9 7 Z",
  rectangle: "M 6 12 L 44 12 L 44 30 L 6 30 Z",
  right: "M 10 34 L 10 8 L 40 34 Z",
  oval: "M 25 11 A 18 10 0 1 1 24.9 11 Z",
  parallelogram: "M 14 30 L 22 10 L 44 10 L 36 30 Z",
  semicircle: "M 7 28 A 18 18 0 0 1 43 28 Z",
  scalene: "M 6 32 L 30 8 L 44 32 Z",
};

interface ArenaWorld {
  gates: Record<number, number>;
  holding: number | null;
  turned: Record<number, number>;
}

export function B07ClassificationArena({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figures = cfg<string[]>(question, "figures", []);
  const play = usePlay<ArenaWorld>({
    question,
    initial: { gates: {}, holding: null, turned: {} },
    derive: (w) => {
      if (Object.keys(w.gates).length < figures.length) return { note: `Send every figure through a gate (${Object.keys(w.gates).length}/${figures.length}).` };
      const groups = [0, 1, 2].map((g) => figures.map((_, i) => i + 1).filter((n) => w.gates[n - 1] === g));
      if (groups.some((g) => g.length !== 3)) return { note: "Each gate takes exactly three figures." };
      const text = groups.map((g) => g.join(", ")).sort().join(" · ");
      const opt = question?.multipleChoiceConfig?.options.find((o) => o.text.split(" · ").sort().join(" · ") === text)?.id;
      return { value: groups.map((g) => `{${g.join(", ")}}`).join(" "), optionId: opt };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const done = Object.keys(w.gates).length === figures.length;

  return (
    <PlayShell
      title="Classification Arena"
      mission="Tap a figure to pick it up (tap again to turn it and inspect it from another angle), then tap a gate to send it through. Find the property that splits the nine figures into three classes of three. When all nine are through, the arena doors open."
      icon={Shapes}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the three classes"
    >
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
        {figures.map((f, i) =>
          w.gates[i] === undefined ? (
            <button
              key={i}
              type="button"
              disabled={play.readOnly}
              onClick={() => play.set((p) => (p.holding === i ? { ...p, turned: { ...p.turned, [i]: ((p.turned[i] ?? 0) + 90) % 360 } } : { ...p, holding: i }))}
              className={`rounded-xl border-2 bg-white p-1 ${w.holding === i ? "border-violet-600 ring-2 ring-violet-300" : "border-slate-200"}`}
              aria-label={`figure ${i + 1}`}
            >
              <svg viewBox="0 0 50 42" className="w-full" style={{ transform: `rotate(${w.turned[i] ?? 0}deg)` }}>
                <path d={FIG_PATH[f]} fill="#ddd6fe" stroke="#4c1d95" strokeWidth={1.4} />
              </svg>
              <div className="text-[10px] font-black">{i + 1}</div>
            </button>
          ) : (
            <div key={i} className="rounded-xl border-2 border-dashed border-slate-200 grid place-items-center text-[10px] text-slate-300">
              {i + 1}
            </div>
          )
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((g) => (
          <button
            key={g}
            type="button"
            disabled={play.readOnly || w.holding === null}
            onClick={() => play.set((p) => ({ ...p, gates: { ...p.gates, [p.holding!]: g }, holding: null }))}
            className={`rounded-2xl border-4 min-h-[120px] p-2 text-left ${done ? "border-emerald-400 bg-emerald-50" : "border-amber-700 bg-amber-50"}`}
          >
            <div className="text-[10px] font-black text-amber-800">GATE {g + 1}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {figures.map((f, i) =>
                w.gates[i] === g ? (
                  <span
                    key={i}
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!play.readOnly) play.set((p) => { const gates = { ...p.gates }; delete gates[i]; return { ...p, gates }; });
                    }}
                    className="w-10 rounded bg-white border"
                  >
                    <svg viewBox="0 0 50 42">
                      <path d={FIG_PATH[f]} fill="#c4b5fd" stroke="#4c1d95" strokeWidth={1.4} />
                    </svg>
                    <span className="block text-center text-[9px] font-black">{i + 1}</span>
                  </span>
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>
      {done && <div className="text-center font-black text-emerald-700">🚪 The arena doors are open.</div>}
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — Pattern Reconstruction Chamber (2D)
   Figure X is a four-quarter structure with one quarter smashed out. The loose piece sits
   on the workbench; the student turns and flips it and slots it into the gap. The
   orientation it is slotted in at is the answer.
   ══════════════════════════════════════════════════════════════════════ */

function Tile({ turn, flip }: { turn: number; flip: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <g transform={`rotate(${turn} 20 20) ${flip ? "translate(40 0) scale(-1 1)" : ""}`}>
        <rect x={1} y={1} width={38} height={38} fill="#fff" stroke="#1e1b4b" strokeWidth={1.2} />
        <path d="M 1 1 L 39 1 L 1 39 Z" fill="#8b5cf6" opacity={0.7} />
        <circle cx={30} cy={30} r={4} fill="#f59e0b" />
        <path d="M 22 8 L 34 8" stroke="#1e1b4b" strokeWidth={2} />
      </g>
    </svg>
  );
}

interface ReconWorld {
  turn: number;
  flip: boolean;
  slotted: boolean;
}

export function B08ReconstructionChamber({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<ReconWorld>({
    question,
    initial: { turn: 0, flip: false, slotted: false },
    derive: (w) =>
      !w.slotted
        ? { note: "Turn and flip the loose piece, then slot it into the gap." }
        : { value: `Piece turned ${w.turn}°${w.flip ? ", flipped" : ""}`, optionId: matchOptionState(question, w, (o, b) => o.turn === b.turn && o.flip === b.flip) },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const quarters: { key: string; turn: number }[] = [
    { key: "TL", turn: 0 },
    { key: "TR", turn: 90 },
    { key: "BL", turn: -1 },
    { key: "BR", turn: 180 },
  ];

  return (
    <PlayShell
      title="Pattern Reconstruction Chamber"
      mission="Figure X is built from one tile turned a little more in each quarter, going round clockwise. One quarter has been smashed out. Turn and flip the loose piece on the workbench, then slot it into the gap."
      icon={Puzzle}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the slotted piece"
      live={<Gauge label="Piece" value={`${w.turn}°${w.flip ? " · flipped" : ""}`} tone="violet" />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-center">
        <div className={`grid grid-cols-2 w-64 h-64 border-4 rounded-xl overflow-hidden ${w.slotted ? "border-emerald-500" : "border-slate-800"}`}>
          {quarters.map((q) =>
            q.turn >= 0 ? (
              <Tile key={q.key} turn={q.turn} flip={false} />
            ) : (
              <div key={q.key} className="bg-[repeating-linear-gradient(45deg,#f1f5f9_0_6px,#e2e8f0_6px_12px)] grid place-items-center">
                {w.slotted ? <Tile turn={w.turn} flip={w.flip} /> : <span className="text-3xl">💥</span>}
              </div>
            )
          )}
        </div>
        <Bay label="Workbench" tone="violet">
          <div className="w-28 h-28 mx-auto">
            <motion.div animate={{ rotate: 0 }} className="w-full h-full">
              <Tile turn={w.turn} flip={w.flip} />
            </motion.div>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, slotted: false, turn: (p.turn + 270) % 360 }))}>
              ⟲ Turn
            </Btn>
            <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, slotted: false, turn: (p.turn + 90) % 360 }))}>
              Turn ⟳
            </Btn>
            <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, slotted: false, flip: !p.flip }))}>
              ⇋ Flip
            </Btn>
            <Btn tone="emerald" active disabled={play.readOnly} onClick={() => play.patch({ slotted: true })}>
              Slot it in
            </Btn>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — Fruit / Mango / Grass Ecosystem (3D)
   Three transparent zones stand on a meadow. The student drags each zone and resizes it,
   and drags the ecosystem's objects (a mango, an apple, a grass tuft) into the zones they
   belong to. The shape the finished zones make is the answer.
   ══════════════════════════════════════════════════════════════════════ */

interface Zone {
  x: number;
  z: number;
  r: number;
}
interface EcoWorld {
  zones: Record<string, Zone>;
  items: Record<string, { x: number; z: number }>;
  selected: string;
}
const ITEMS = [
  { id: "mango", label: "Mango", inside: ["Fruit", "Mango"], color: "#f59e0b" },
  { id: "apple", label: "Apple", inside: ["Fruit"], color: "#dc2626" },
  { id: "grass", label: "Grass", inside: ["Grass"], color: "#16a34a" },
];
const ZONE_COLOR: Record<string, string> = { Fruit: "#f472b6", Mango: "#f59e0b", Grass: "#22c55e" };
const inZ = (z: Zone, p: { x: number; z: number }) => Math.hypot(p.x - z.x, p.z - z.z) <= z.r;
const zSub = (a: Zone, b: Zone) => Math.hypot(a.x - b.x, a.z - b.z) + a.r <= b.r + 0.01;
const zApart = (a: Zone, b: Zone) => Math.hypot(a.x - b.x, a.z - b.z) >= a.r + b.r - 0.01;

function classifyEco(z: Record<string, Zone>): string | undefined {
  const F = z.Fruit;
  const M = z.Mango;
  const G = z.Grass;
  const pairs = [
    [F, M],
    [F, G],
    [M, G],
  ];
  if (pairs.every(([a, b]) => zApart(a, b))) return "all-separate";
  if ((zSub(M, F) && zSub(G, M)) || (zSub(G, F) && zSub(M, G)) || (zSub(F, M) && zSub(G, F))) return "nested-three";
  const nestedPair = zSub(M, F) || zSub(F, M) || zSub(G, F) || zSub(F, G) || zSub(M, G) || zSub(G, M);
  if (nestedPair) {
    const third = zSub(M, F) || zSub(F, M) ? G : zSub(G, F) || zSub(F, G) ? M : F;
    const others = [F, M, G].filter((x) => x !== third);
    if (others.every((o) => zApart(third, o))) return "nested-plus-separate";
  }
  return "overlap-plus-separate";
}

function ZoneMesh({ name, zone, onMove, readOnly }: { name: string; zone: Zone; onMove: (x: number, z: number) => void; readOnly?: boolean }) {
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const drag = usePlaneDrag({ plane, disabled: readOnly, onDrag: (p) => onMove(clamp(p.x, -4, 4), clamp(p.z, -3, 3)) });
  return (
    <group position={[zone.x, 0, zone.z]}>
      <mesh position={[0, 0.3, 0]} {...drag}>
        <cylinderGeometry args={[zone.r, zone.r, 0.6, 48, 1, true]} />
        <meshStandardMaterial color={ZONE_COLOR[name]} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} {...drag}>
        <circleGeometry args={[zone.r, 48]} />
        <meshStandardMaterial color={ZONE_COLOR[name]} transparent opacity={0.18} />
      </mesh>
      <Label3D text={name.toUpperCase()} position={[0, 0.9, -zone.r + 0.1]} size={[1.1, 0.3]} billboard style={{ bg: ZONE_COLOR[name], fg: "#fff", scale: 0.6 }} />
    </group>
  );
}

function ItemMesh({ id, pos, color, onMove, readOnly }: { id: string; pos: { x: number; z: number }; color: string; onMove: (x: number, z: number) => void; readOnly?: boolean }) {
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const drag = usePlaneDrag({ plane, disabled: readOnly, onDrag: (p) => onMove(clamp(p.x, -4.5, 4.5), clamp(p.z, -3.5, 3.5)) });
  return (
    <group position={[pos.x, 0, pos.z]}>
      <mesh position={[0, 0.25, 0]} castShadow {...drag}>
        {id === "grass" ? <coneGeometry args={[0.2, 0.5, 6]} /> : <sphereGeometry args={[0.22, 20, 20]} />}
        <meshStandardMaterial color={color} />
      </mesh>
      <Label3D text={id} position={[0, 0.7, 0]} size={[0.8, 0.22]} billboard style={{ bg: "#1e1b4b", fg: "#fff", scale: 0.6 }} />
    </group>
  );
}

export function B10Ecosystem({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const labels = cfg<string[]>(question, "labels", ["Fruit", "Mango", "Grass"]);
  const play = usePlay<EcoWorld>({
    question,
    initial: {
      zones: { Fruit: { x: -2.5, z: 0, r: 1 }, Mango: { x: 0, z: 0, r: 1 }, Grass: { x: 2.5, z: 0, r: 1 } },
      items: { mango: { x: -2, z: 2.8 }, apple: { x: 0, z: 2.8 }, grass: { x: 2, z: 2.8 } },
      selected: "Fruit",
    },
    derive: (w) => {
      const wrong = ITEMS.filter((it) => labels.some((l) => inZ(w.zones[l], w.items[it.id]) !== it.inside.includes(l)));
      if (wrong.length) return { note: `${wrong.map((x) => x.label).join(", ")} ${wrong.length === 1 ? "is" : "are"} not yet inside exactly the zones it belongs to.` };
      const kind = classifyEco(w.zones);
      const words: Record<string, string> = {
        "all-separate": "Three separate zones",
        "nested-three": "Three zones one inside another",
        "nested-plus-separate": "One zone inside another, a third apart",
        "overlap-plus-separate": "Two zones overlapping, a third apart",
      };
      return { value: words[kind ?? ""] ?? "—", optionId: matchOptionState(question, kind, (o, b) => o === b) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <PlayShell
      title="Fruit · Mango · Grass Ecosystem"
      mission="Drag the three transparent zones around the meadow and resize them. Then drag the mango, the apple and the grass tuft into exactly the zones they belong to: a mango is a fruit; grass is not. The shape your zones make is read when everything is home."
      icon={Trees}
      dim="3D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the ecosystem"
    >
      <Stage3D height={330} camera={{ position: [0, 6.5, 6], fov: 44 }} readOnly={play.readOnly} orbit={false}>
        <Floor color="#bbf7d0" />
        {labels.map((l) => (
          <ZoneMesh key={l} name={l} zone={w.zones[l]} readOnly={play.readOnly} onMove={(x, z) => play.set((p) => ({ ...p, selected: l, zones: { ...p.zones, [l]: { ...p.zones[l], x, z } } }))} />
        ))}
        {ITEMS.map((it) => (
          <ItemMesh key={it.id} id={it.id} pos={w.items[it.id]} color={it.color} readOnly={play.readOnly} onMove={(x, z) => play.set((p) => ({ ...p, items: { ...p.items, [it.id]: { x, z } } }))} />
        ))}
      </Stage3D>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500">RESIZE:</span>
        {labels.map((l) => (
          <Btn key={l} active={w.selected === l} disabled={play.readOnly} onClick={() => play.patch({ selected: l })}>
            {l}
          </Btn>
        ))}
        <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, zones: { ...p.zones, [p.selected]: { ...p.zones[p.selected], r: Math.max(0.5, p.zones[p.selected].r - 0.25) } } }))}>
          − smaller
        </Btn>
        <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, zones: { ...p.zones, [p.selected]: { ...p.zones[p.selected], r: Math.min(3, p.zones[p.selected].r + 0.25) } } }))}>
          + bigger
        </Btn>
        <span className="text-[11px] font-semibold text-slate-500">{w.selected}: radius {w.zones[w.selected].r.toFixed(2)}</span>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q11 — Hidden Shape Treasure Hunt (2D)
   Four dark rooms, each a tangle of lines. The student drags a glowing camera lens across
   a room; the lens projects the target shape's outline, and freezes with MATCH FOUND when
   every edge of the target lies on real lines of that room.
   ══════════════════════════════════════════════════════════════════════ */

type Seg = [[number, number], [number, number]];
// Target: a square with a triangular roof, 2 units wide.
const TARGET: Seg[] = [
  [[0, 1], [0, 3]],
  [[0, 3], [2, 3]],
  [[2, 3], [2, 1]],
  [[2, 1], [1, 0]],
  [[1, 0], [0, 1]],
];
const ROOMS: Record<string, Seg[]> = {
  A: [
    [[1, 1], [1, 3]], [[1, 3], [3, 3]], [[3, 3], [3, 1]], [[1, 1], [3, 1]], [[0, 0], [4, 4]], [[4, 0], [0, 4]], [[2, 0], [2, 4]],
  ],
  B: [
    [[1, 2], [1, 4]], [[1, 4], [3, 4]], [[3, 4], [3, 2]], [[3, 2], [2, 0]], [[0, 0], [4, 0]], [[1, 2], [3, 2]], [[0, 3], [4, 3]],
  ],
  C: [
    [[1, 1], [1, 3]], [[1, 3], [3, 3]], [[3, 3], [3, 1]], [[3, 1], [2, 2]], [[2, 2], [1, 1]], [[0, 0], [4, 0]], [[0, 4], [4, 4]],
  ],
  D: [
    [[0, 0], [4, 4]], [[1, 2], [1, 4]], [[1, 4], [3, 4]], [[3, 4], [3, 2]], [[3, 2], [2, 1]], [[2, 1], [1, 2]], [[0, 3], [4, 3]], [[4, 0], [0, 4]],
  ],
};
const onSegG = (p: [number, number], [[x1, y1], [x2, y2]]: Seg) =>
  Math.abs((x2 - x1) * (p[1] - y1) - (y2 - y1) * (p[0] - x1)) < 1e-6 && p[0] >= Math.min(x1, x2) - 1e-6 && p[0] <= Math.max(x1, x2) + 1e-6 && p[1] >= Math.min(y1, y2) - 1e-6 && p[1] <= Math.max(y1, y2) + 1e-6;
const embedded = (room: Seg[], ax: number, ay: number) =>
  TARGET.every(([a, b]) => room.some((s) => onSegG([a[0] + ax, a[1] + ay], s) && onSegG([b[0] + ax, b[1] + ay], s)));

interface HuntWorld {
  room: string;
  lens: Record<string, [number, number]>;
  found: string | null;
}

export function B11HiddenShapeHunt({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const svg = useRef<SVGSVGElement>(null);
  const S = 20;
  const play = usePlay<HuntWorld>({
    question,
    initial: { room: "A", lens: {}, found: null },
    derive: (w) => (!w.found ? { note: "Sweep the camera over each room until it freezes on a match." } : { value: `MATCH FOUND in figure ${w.found}`, optionId: w.found }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const [ax, ay] = w.lens[w.room] ?? [0, 0];
  const hit = embedded(ROOMS[w.room], ax, ay);
  const { start } = usePointerDrag({
    disabled: readOnly,
    onMove: (p) => {
      const q = clientToSvg(svg.current, p.x, p.y);
      if (!q) return;
      const nx = clamp(Math.round((q.x - 10) / S - 1), 0, 2);
      const ny = clamp(Math.round((q.y - 10) / S - 1.5), 0, 1);
      if (nx !== ax || ny !== ay) play.set((pw) => ({ ...pw, found: null, lens: { ...pw.lens, [pw.room]: [nx, ny] } }));
    },
  });

  return (
    <PlayShell
      title="Hidden Shape Treasure Hunt"
      mission="The target shape is shown at the top. Pick a room, then drag the glowing camera across it. The camera projects the target's outline; when every edge lands on a real line in the room it freezes with MATCH FOUND. Record the room where that happens."
      icon={Search}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the room"
      live={<Gauge label="Camera" value={hit ? "MATCH FOUND" : "searching"} tone={hit ? "emerald" : "slate"} />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-start">
        <Bay label="Target">
          <svg viewBox="-1 -1 4 5" className="w-20">
            {TARGET.map(([a, b], i) => (
              <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#7c3aed" strokeWidth={0.15} />
            ))}
          </svg>
        </Bay>
        <div>
          <div className="flex gap-1.5 mb-2">
            {Object.keys(ROOMS).map((id) => (
              <Btn key={id} active={w.room === id} disabled={play.readOnly} onClick={() => play.patch({ room: id })} className="w-16">
                Figure {id}
              </Btn>
            ))}
          </div>
          <div className="rounded-2xl bg-slate-950 p-1">
            <svg ref={svg} viewBox="0 0 100 100" className="w-full max-h-80" style={{ touchAction: "none" }}>
              {ROOMS[w.room].map(([a, b], i) => (
                <line key={i} x1={10 + a[0] * S} y1={10 + a[1] * S} x2={10 + b[0] * S} y2={10 + b[1] * S} stroke="#e2e8f0" strokeWidth={0.9} />
              ))}
              <g onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: "grab", touchAction: "none" }}>
                <rect x={10 + ax * S - 6} y={10 + ay * S - 6} width={2 * S + 12} height={3 * S + 12} rx={6} fill={hit ? "#10b98133" : "#7c3aed22"} stroke={hit ? "#10b981" : "#a78bfa"} strokeWidth={1} />
                {TARGET.map(([a, b], i) => (
                  <line key={i} x1={10 + (a[0] + ax) * S} y1={10 + (a[1] + ay) * S} x2={10 + (b[0] + ax) * S} y2={10 + (b[1] + ay) * S} stroke={hit ? "#34d399" : "#c4b5fd"} strokeWidth={1.6} strokeDasharray={hit ? undefined : "2 1.5"} />
                ))}
              </g>
            </svg>
          </div>
          <Btn className="mt-2" tone="emerald" active disabled={play.readOnly || !hit} onClick={() => play.patch({ found: w.room })}>
            📸 Freeze: MATCH FOUND in figure {w.room}
          </Btn>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — Number Grid Reactor (2D)
   The grid is a 3 × 3 reactor of energy cells. The student picks a rule on the control
   panel and the reactor tests it on every complete row (green) — then dials the missing
   cell. The dial reading is the answer.
   ══════════════════════════════════════════════════════════════════════ */

const RULES: { id: string; label: string; f: (a: number, b: number, row: number) => number }[] = [
  { id: "sum", label: "third = first + second", f: (a, b) => a + b },
  { id: "diffk", label: "third = difference + 5, 4, 3 (one less each row)", f: (a, b, r) => Math.abs(a - b) + (5 - r) },
  { id: "prod", label: "third = first × second", f: (a, b) => a * b },
  { id: "avg", label: "third = first + second − 1", f: (a, b) => a + b - 1 },
];

interface ReactorWorld {
  rule: string | null;
  dial: number;
  loaded: boolean;
}

export function B12NumberReactor({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const grid = cfg<(number | null)[][]>(question, "grid", []);
  const play = usePlay<ReactorWorld>({
    question,
    initial: { rule: null, dial: 0, loaded: false },
    derive: (w) => (!w.loaded ? { note: "Dial the missing cell and load it into the reactor." } : { value: String(w.dial), optionId: matchNumber(question, w.dial) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const rule = RULES.find((r) => r.id === w.rule);
  const rowOk = (r: number) => {
    const [a, b, c] = grid[r];
    return rule && c !== null ? rule.f(a as number, b as number, r) === c : null;
  };

  return (
    <PlayShell
      title="Number Grid Reactor"
      mission="Choose a rule on the control panel: the reactor tests it on every complete row and lights them green or red. When you have a rule that holds, dial the missing energy cell and load it."
      icon={Grid3x3}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the missing cell"
      live={<Gauge label="Rule tested" value={rule?.label ?? "none"} tone="violet" />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="rounded-2xl bg-slate-950 p-3 grid gap-2">
          {grid.map((row, r) => (
            <div key={r} className={`flex gap-2 rounded-xl p-1 ${rowOk(r) === true ? "bg-emerald-500/30" : rowOk(r) === false ? "bg-rose-500/30" : ""}`}>
              {row.map((v, c) => (
                <motion.div key={c} animate={{ boxShadow: v === null ? "0 0 18px #a78bfa" : "0 0 6px #22d3ee" }} className="w-14 h-14 rounded-full grid place-items-center font-mono text-2xl font-black text-white bg-gradient-to-br from-cyan-500 to-indigo-700">
                  {v ?? (w.loaded ? w.dial : "?")}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Bay label="Rule control panel" tone="violet">
            <div className="grid gap-1.5">
              {RULES.map((r) => (
                <Btn key={r.id} active={w.rule === r.id} disabled={play.readOnly} onClick={() => play.patch({ rule: r.id })} className="text-left">
                  {r.label}
                </Btn>
              ))}
            </div>
          </Bay>
          <Bay label="Missing-cell dial">
            <div className="flex items-center gap-2">
              <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, loaded: false, dial: Math.max(0, p.dial - 1) }))}>
                −
              </Btn>
              <span className="font-mono text-3xl font-black w-12 text-center">{w.dial}</span>
              <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, loaded: false, dial: p.dial + 1 }))}>
                +
              </Btn>
              <Btn tone="emerald" active disabled={play.readOnly} onClick={() => play.patch({ loaded: true })}>
                ⚡ Load cell
              </Btn>
            </div>
          </Bay>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — Dot Placement Observatory (2D)
   The observatory holds a movable circle, rectangle and triangle and two probe dots. The
   student arranges the shapes until both dots can sit in exactly the regions the
   reference figure uses; the chamber turns green, and the arrangement is read.
   ══════════════════════════════════════════════════════════════════════ */

interface ObsShapes {
  c: { x: number; y: number };
  r: { x: number; y: number };
  t: { x: number; y: number };
  d1: { x: number; y: number };
  d2: { x: number; y: number };
}
const inC = (s: ObsShapes, p: { x: number; y: number }) => Math.hypot(p.x - s.c.x, p.y - s.c.y) <= 16;
const inR = (s: ObsShapes, p: { x: number; y: number }) => Math.abs(p.x - s.r.x) <= 18 && Math.abs(p.y - s.r.y) <= 12;
const inT = (s: ObsShapes, p: { x: number; y: number }) => {
  const dy = p.y - (s.t.y - 16);
  if (dy < 0 || dy > 30) return false;
  return Math.abs(p.x - s.t.x) <= (dy / 30) * 20;
};
function overlapKind(s: ObsShapes) {
  let ct = false, cr = false, rt = false, tInR = true;
  for (let x = 0; x <= 160; x += 2)
    for (let y = 0; y <= 100; y += 2) {
      const p = { x, y };
      const c = inC(s, p), r = inR(s, p), t = inT(s, p);
      if (c && t) ct = true;
      if (c && r) cr = true;
      if (r && t) rt = true;
      if (t && !r) tInR = false;
    }
  if (tInR && !ct && !cr) return "t-in-r";
  if (ct && rt && !cr) return "t-bridges-c-r";
  if (cr && !ct && !rt) return "c-r-only";
  if (!ct && !cr && !rt) return "all-apart";
  return "other";
}

function Draggable({ p, svg, onMove, children, readOnly, label }: { p: { x: number; y: number }; svg: React.RefObject<SVGSVGElement | null>; onMove: (x: number, y: number) => void; children: React.ReactNode; readOnly?: boolean; label: string }) {
  const { start } = usePointerDrag({
    disabled: readOnly,
    onMove: (pt) => {
      const q = clientToSvg(svg.current, pt.x, pt.y);
      if (q) onMove(clamp(q.x, 0, 160), clamp(q.y, 0, 100));
    },
  });
  return (
    <g aria-label={label} onPointerDown={(e) => start(e as unknown as React.PointerEvent, undefined)} style={{ cursor: readOnly ? "default" : "grab", touchAction: "none" }}>
      {children}
    </g>
  );
}

export function B13DotObservatory({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const svg = useRef<SVGSVGElement>(null);
  const play = usePlay<{ s: ObsShapes }>({
    question,
    initial: { s: { c: { x: 30, y: 30 }, r: { x: 80, y: 30 }, t: { x: 130, y: 40 }, d1: { x: 60, y: 85 }, d2: { x: 100, y: 85 } } },
    derive: (w) => {
      const s = w.s;
      const ok1 = inC(s, s.d1) && inT(s, s.d1) && !inR(s, s.d1);
      const ok2 = inR(s, s.d2) && inT(s, s.d2) && !inC(s, s.d2);
      if (!ok1 || !ok2) return { note: "Arrange the shapes so dot 1 sits in circle + triangle only and dot 2 in rectangle + triangle only." };
      const kind = overlapKind(s);
      return { value: "Both dots placed as in the reference", optionId: matchOptionState(question, kind, (o, b) => o === b) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const s = play.world.s;
  const ok1 = inC(s, s.d1) && inT(s, s.d1) && !inR(s, s.d1);
  const ok2 = inR(s, s.d2) && inT(s, s.d2) && !inC(s, s.d2);
  const mv = (k: keyof ObsShapes) => (x: number, y: number) => play.set((p) => ({ s: { ...p.s, [k]: { x, y } } }));

  return (
    <PlayShell
      title="Dot Placement Observatory"
      mission="Drag the circle, the rectangle and the triangle, then drag the two probe dots. Dot 1 must sit in the circle and the triangle only; dot 2 in the rectangle and the triangle only. When both hold, the observation chamber turns green and your arrangement of shapes is recorded."
      icon={Crosshair}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the arrangement"
      live={
        <>
          <Gauge label="Dot 1 (circle + triangle)" value={ok1 ? "✓" : "✗"} tone={ok1 ? "emerald" : "slate"} />
          <Gauge label="Dot 2 (rectangle + triangle)" value={ok2 ? "✓" : "✗"} tone={ok2 ? "emerald" : "slate"} />
        </>
      }
    >
      <div className={`rounded-2xl p-1 transition-colors ${ok1 && ok2 ? "bg-emerald-200" : "bg-slate-900"}`}>
        <svg ref={svg} viewBox="0 0 160 100" className="w-full" style={{ touchAction: "none" }}>
          <Draggable p={s.c} svg={svg} onMove={mv("c")} readOnly={play.readOnly} label="circle">
            <circle cx={s.c.x} cy={s.c.y} r={16} fill="#38bdf833" stroke="#38bdf8" strokeWidth={1} />
          </Draggable>
          <Draggable p={s.r} svg={svg} onMove={mv("r")} readOnly={play.readOnly} label="rectangle">
            <rect x={s.r.x - 18} y={s.r.y - 12} width={36} height={24} fill="#f59e0b33" stroke="#f59e0b" strokeWidth={1} />
          </Draggable>
          <Draggable p={s.t} svg={svg} onMove={mv("t")} readOnly={play.readOnly} label="triangle">
            <polygon points={`${s.t.x},${s.t.y - 16} ${s.t.x - 20},${s.t.y + 14} ${s.t.x + 20},${s.t.y + 14}`} fill="#a78bfa33" stroke="#a78bfa" strokeWidth={1} />
          </Draggable>
          {(["d1", "d2"] as const).map((k, i) => (
            <Draggable key={k} p={s[k]} svg={svg} onMove={mv(k)} readOnly={play.readOnly} label={`dot ${i + 1}`}>
              <circle cx={s[k].x} cy={s[k].y} r={5} fill="transparent" />
              <circle cx={s[k].x} cy={s[k].y} r={2} fill={(i ? ok2 : ok1) ? "#10b981" : "#f43f5e"} stroke="#fff" strokeWidth={0.6} />
              <text x={s[k].x + 3} y={s[k].y - 3} fontSize={4} fontWeight={900} fill="#fff">
                {i + 1}
              </text>
            </Draggable>
          ))}
        </svg>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — Word Factory (2D)
   Four letter blocks ride into the press. The student arranges them in the press slots
   and stamps; a real word goes onto the collection shelf, a non-word is scrapped. When the
   student has tried enough arrangements they ship the shelf count.
   ══════════════════════════════════════════════════════════════════════ */

interface WordWorld {
  slots: number[];
  shelf: string[];
  scrap: string[];
  shipped: boolean;
}

export function B14WordFactory({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const letters = cfg<string[]>(question, "letters", []);
  const dict = cfg<string[]>(question, "dictionary", []);
  const play = usePlay<WordWorld>({
    question,
    initial: { slots: [], shelf: [], scrap: [], shipped: false },
    derive: (w) => {
      if (!w.shipped) return { note: "Stamp arrangements, then ship the shelf." };
      const n = w.shelf.length;
      return { value: `${n} meaningful word${n === 1 ? "" : "s"}`, optionId: matchText(question, ["Zero", "One", "Two", "Three", "Four"][n] ?? "") ?? matchText(question, "None of these") };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const word = w.slots.map((i) => letters[i]).join("");
  const stamp = () =>
    play.set((p) => {
      const wd = p.slots.map((i) => letters[i]).join("");
      if (dict.includes(wd)) return { ...p, slots: [], shelf: p.shelf.includes(wd) ? p.shelf : [...p.shelf, wd], shipped: false };
      return { ...p, slots: [], scrap: p.scrap.includes(wd) ? p.scrap : [...p.scrap, wd], shipped: false };
    });

  return (
    <PlayShell
      title="Word Factory"
      mission="Tap the letter blocks to load them into the press, left to right, using each block once. Stamp the arrangement: meaningful English words go onto the shelf, others are scrapped. Try as many arrangements as you need, then ship the shelf."
      icon={Blocks}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the word count"
      live={
        <>
          <Gauge label="Shelf" value={w.shelf.join(", ") || "empty"} tone="emerald" />
          <Gauge label="Arrangements tried" value={w.shelf.length + w.scrap.length} />
        </>
      }
    >
      <div className="rounded-2xl bg-slate-800 p-3">
        <div className="flex gap-2 justify-center">
          {letters.map((l, i) => (
            <motion.button key={l} type="button" disabled={play.readOnly || w.slots.includes(i) || w.slots.length >= letters.length} onClick={() => play.patch({ slots: [...w.slots, i] })} animate={{ y: w.slots.includes(i) ? 30 : 0, opacity: w.slots.includes(i) ? 0.3 : 1 }} className="w-14 h-14 rounded-lg bg-amber-300 border-b-4 border-amber-600 font-black text-2xl">
              {l}
            </motion.button>
          ))}
        </div>
        <div className="mt-6 flex gap-2 justify-center">
          {letters.map((_, k) => (
            <div key={k} className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-500 grid place-items-center text-2xl font-black text-white">
              {w.slots[k] !== undefined ? letters[w.slots[k]] : ""}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-2">
          <Btn tone="violet" active disabled={play.readOnly || w.slots.length < letters.length} onClick={stamp}>
            🔨 Stamp “{word}”
          </Btn>
          <Btn disabled={play.readOnly || !w.slots.length} onClick={() => play.patch({ slots: [] })}>
            Clear press
          </Btn>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Bay label="Collection shelf (words)" tone="violet">
          <div className="flex flex-wrap gap-1">{w.shelf.map((x) => <span key={x} className="px-2 py-1 rounded bg-emerald-600 text-white font-black text-sm">{x}</span>)}</div>
        </Bay>
        <Bay label="Scrap bin">
          <div className="flex flex-wrap gap-1">{w.scrap.map((x) => <span key={x} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono text-xs line-through">{x}</span>)}</div>
        </Bay>
      </div>
      <Btn tone="emerald" active disabled={play.readOnly || !(w.shelf.length + w.scrap.length)} onClick={() => play.patch({ shipped: true })}>
        🚚 Ship the shelf
      </Btn>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — Mirror Portal (2D)
   The symbol string stands before a vertical mirror; the student can slide the mirror
   nearer or further and watch the reflection. Then they build the reflection themselves
   from the character tiles: choose the order and how each tile is turned.
   ══════════════════════════════════════════════════════════════════════ */

interface PortalWorld {
  gap: number;
  reversed: boolean;
  flipped: "none" | "h" | "v";
  built: boolean;
}

export function B15MirrorPortal({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const text = cfg<string>(question, "text", "");
  const play = usePlay<PortalWorld>({
    question,
    initial: { gap: 20, reversed: false, flipped: "none", built: false },
    derive: (w) =>
      !w.built
        ? { note: "Build the reflection from the tiles and press it into the portal." }
        : {
            value: `${w.reversed ? "Reverse order" : "Same order"}, tiles ${w.flipped === "h" ? "reversed" : w.flipped === "v" ? "upside down" : "as written"}`,
            optionId: matchOptionState(question, w, (o, b) => o.reversed === b.reversed && o.flipped === b.flipped),
          },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const chars = w.reversed ? text.split("").reverse() : text.split("");
  const glyph = (c: string, f: PortalWorld["flipped"]) => (
    <span className="inline-block" style={{ transform: f === "h" ? "scaleX(-1)" : f === "v" ? "scaleY(-1)" : undefined }}>
      {c}
    </span>
  );

  return (
    <PlayShell
      title="Mirror Portal"
      mission="A vertical mirror stands to the right of the string. Slide it nearer or further to watch the live reflection. Then build the reflection yourself: choose the order of the tiles and how each tile is turned, and press it into the portal."
      icon={FlipHorizontal}
      dim="2D"
      question={question}
      derived={play.derived}
      locked={play.locked}
      touched={play.touched}
      readOnly={play.readOnly}
      onSubmit={play.submit}
      onReset={play.reset}
      submitLabel="Submit the built reflection"
    >
      <div className="rounded-2xl bg-gradient-to-r from-slate-100 via-white to-sky-100 border-2 border-slate-200 p-4 overflow-hidden">
        <div className="flex items-center font-mono text-4xl font-black text-slate-900">
          <span>{text}</span>
          <span style={{ width: w.gap }} />
          <span className="w-1.5 self-stretch bg-slate-500 rounded" />
          <span style={{ width: w.gap }} />
          <span className="text-sky-700 opacity-70" style={{ transform: "scaleX(-1)", display: "inline-block" }}>
            {text}
          </span>
        </div>
        <input type="range" min={4} max={80} value={w.gap} disabled={play.readOnly} onChange={(e) => play.patch({ gap: Number(e.target.value) })} className="w-full mt-2 accent-sky-600" aria-label="mirror distance" />
      </div>
      <Bay label="Build the reflection" tone="violet">
        <div className="flex flex-wrap gap-2 mb-2">
          <Btn active={!w.reversed} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, reversed: false, built: false }))}>
            Order as written
          </Btn>
          <Btn active={w.reversed} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, reversed: true, built: false }))}>
            Order reversed
          </Btn>
          <span className="w-px bg-slate-200" />
          {(["none", "h", "v"] as const).map((f) => (
            <Btn key={f} active={w.flipped === f} disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, flipped: f, built: false }))}>
              {f === "none" ? "Tiles upright" : f === "h" ? "Tiles reversed ⇋" : "Tiles upside down ⇅"}
            </Btn>
          ))}
        </div>
        <div className="font-mono text-4xl font-black text-violet-900 flex gap-1">
          {chars.map((c, i) => (
            <span key={i} className="w-10 h-12 grid place-items-center rounded bg-white border-2 border-violet-200">
              {glyph(c, w.flipped)}
            </span>
          ))}
        </div>
        <Btn className="mt-2" tone="emerald" active disabled={play.readOnly} onClick={() => play.patch({ built: true })}>
          🌀 Press into the portal
        </Btn>
      </Bay>
    </PlayShell>
  );
}

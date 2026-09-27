"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Shuffle, Layers3, Shapes, Puzzle, Search, Scale3d, Triangle, CircleDot, Factory, Ruler, Hexagon, ClipboardCheck, Microscope } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText, matchOptionState, gcd, reduceFraction } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Label3D, Floor } from "../imo6a-play/three";
import { Shell, Board, Stepper, polyPath, toggle, optText, Pt } from "../imo6p3-play/kit";

/**
 * Set B #2 (9th IMO Class 6 Set B, Question Paper 2) — games rebuilt to match the printed
 * paper: Q2, Q5, Q7, Q8, Q11, Q16, Q19, Q20, Q21, Q30, Q34, Q47 and Q48. Each game derives
 * its answer from the world the student builds; none of them names a correct option.
 */

/* ══════════════════════════════════════════════════════════════════════
   Q2 — Position Shuffler
   Figure (i) becomes (ii) by moving every symbol to a new place (the one that lands in the
   middle grows). The movers are listed; the student builds (iv) by placing the symbols of
   (iii) where those movers would send them.
   ══════════════════════════════════════════════════════════════════════ */

type Slots = Record<string, string>;
const SLOT_NAME: Record<string, string> = { TL: "top-left", C: "middle", BR: "bottom-right" };

function SlotFrame({ s, onSlot, hot }: { s: Slots; onSlot?: (k: string) => void; hot?: boolean }) {
  const pos: Record<string, { x: number; y: number; size: number }> = { TL: { x: 14, y: 14, size: 12 }, C: { x: 50, y: 50, size: 30 }, BR: { x: 86, y: 86, size: 12 } };
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[9rem] rounded-lg border-2 border-slate-400 bg-white">
      {Object.entries(pos).map(([k, p]) => (
        <g key={k} onClick={() => onSlot?.(k)} style={{ cursor: onSlot ? "pointer" : undefined }} role={onSlot ? "button" : undefined} aria-label={onSlot ? `slot ${SLOT_NAME[k]}` : undefined}>
          <rect x={p.x - p.size / 2 - 3} y={p.y - p.size / 2 - 3} width={p.size + 6} height={p.size + 6} rx={3} fill={hot ? "#f5f3ff" : "transparent"} stroke={hot ? "#c4b5fd" : "none"} strokeDasharray="2 2" strokeWidth={0.6} />
          <text x={p.x} y={p.y + p.size * 0.35} fontSize={p.size} textAnchor="middle" fontWeight={700} fill="#1e1b4b">
            {s[k] ?? ""}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function B02PositionShuffler({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const f1 = cfg<Slots>(question, "fig1", {});
  const f2 = cfg<Slots>(question, "fig2", {});
  const f3 = cfg<Slots>(question, "fig3", {});
  const symbols = Object.values(f3);
  const [held, setHeld] = useState<string | null>(null);
  const play = usePlay<{ built: Slots }>({
    question,
    initial: { built: {} },
    derive: (w) => {
      if (Object.keys(w.built).length < symbols.length) return { note: "Place every symbol of (iii) in the frame for (iv)." };
      return {
        value: `(iv): ${Object.entries(w.built).map(([k, v]) => `${v} ${SLOT_NAME[k]}`).join(", ")}`,
        optionId: matchOptionState(question, w.built, (o: Slots, b) => Object.keys(o).every((k) => o[k] === b[k]) && Object.keys(b).every((k) => o[k] === b[k])),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="Position Shuffler"
      mission="Compare (i) and (ii): every symbol has moved to a new place, and the one in the middle is drawn large. Then build (iv): tap a symbol of (iii), then tap the place in the empty frame where the same move sends it."
      icon={Shuffle}
      dim="2D"
      submitLabel="Submit figure (iv)"
      hints={["Follow each symbol of (i): where did the small circle end up in (ii)? Where did the +?", "The middle place always holds the large symbol."]}
      live={<Gauge label="Placed" value={`${Object.keys(w.built).length}/${symbols.length}`} tone="violet" />}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Bay label="(i) → (ii)">
          <div className="flex items-center gap-2">
            <SlotFrame s={f1} />
            <span className="text-xl text-violet-600">➜</span>
            <SlotFrame s={f2} />
          </div>
        </Bay>
        <Bay label="(iii) → build (iv)" tone="violet">
          <div className="flex items-center gap-2">
            <SlotFrame s={f3} />
            <span className="text-xl text-violet-600">➜</span>
            <SlotFrame
              s={w.built}
              hot
              onSlot={(k) => {
                if (play.readOnly || !held) return;
                play.set((p) => {
                  const built = Object.fromEntries(Object.entries(p.built).filter(([slot, v]) => v !== held && slot !== k));
                  return { built: { ...built, [k]: held } };
                });
              }}
            />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {symbols.map((sym) => (
              <Btn key={sym} className="px-3 text-lg" active={held === sym} tone={held === sym ? "amber" : "slate"} disabled={play.readOnly} onClick={() => setHeld(sym)} ariaLabel={`symbol ${sym}`}>
                {sym}
              </Btn>
            ))}
            <Btn tone="slate" disabled={play.readOnly || !Object.keys(w.built).length} onClick={() => play.set({ built: {} })}>
              Clear
            </Btn>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — Nested Shape Evolution (3D)
   The series stands as a row of shape plates. The student chooses the outer and inner
   plates of the next figure; the machine assembles it at the end of the row.
   ══════════════════════════════════════════════════════════════════════ */

const SHAPES: Record<string, { label: string; pts: [number, number][] }> = (() => {
  const ngon = (n: number, rot: number) => Array.from({ length: n }, (_, i) => [Math.cos(rot + (i * 2 * Math.PI) / n), Math.sin(rot + (i * 2 * Math.PI) / n)] as [number, number]);
  return {
    triangle: { label: "▲ triangle", pts: ngon(3, Math.PI / 2) },
    square: { label: "■ square", pts: ngon(4, Math.PI / 4) },
    shield: { label: "⬟ shield (point down)", pts: ngon(5, -Math.PI / 2) },
    house: { label: "⌂ house (point up)", pts: ngon(5, Math.PI / 2) },
    hexagon: { label: "⬢ hexagon", pts: ngon(6, 0) },
  };
})();

function Plate({ shape, size, color, z }: { shape: string; size: number; color: string; z: number }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const pts = SHAPES[shape].pts;
    s.moveTo(pts[0][0] * size, pts[0][1] * size);
    pts.slice(1).forEach(([x, y]) => s.lineTo(x * size, y * size));
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: false });
  }, [shape, size]);
  return (
    <mesh geometry={geo} position={[0, 0, z]} castShadow>
      <meshStandardMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

function NestFigure({ x, stack, label, mine }: { x: number; stack: (string | null)[]; label: string; mine?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && mine) ref.current.rotation.y = Math.sin(performance.now() / 900) * 0.25;
    void dt;
  });
  return (
    <group position={[x, 1.1, 0]}>
      <group ref={ref}>
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[1.6, 1.6, 0.04]} />
          <meshStandardMaterial color={mine ? "#ede9fe" : "#ffffff"} />
        </mesh>
        {stack[0] && <Plate shape={stack[0]} size={0.72} color="#8b5cf6" z={0} />}
        {stack[1] && <Plate shape={stack[1]} size={stack[0] ? 0.3 : 0.34} color="#f59e0b" z={0.14} />}
      </group>
      <Label3D text={label} position={[0, -1.05, 0]} size={[1.5, 0.3]} billboard style={{ bg: mine ? "#7c3aed" : "#1e1b4b", fg: "#fff", scale: 0.55 }} />
    </group>
  );
}

export function B05NestedSeries({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const series = cfg<(string | null)[][]>(question, "series", []);
  const play = usePlay<{ stack: (string | null)[] }>({
    question,
    initial: { stack: [null, null] },
    derive: (w) => {
      if (!w.stack[1]) return { note: "Choose the plates of the next figure." };
      const shown = w.stack.filter(Boolean) as string[];
      return {
        value: w.stack[0] ? `large ${w.stack[0]} holding a small ${w.stack[1]}` : `a small ${w.stack[1]} on its own`,
        optionId: matchOptionState(question, shown, (o: string[], b) => o.join() === b.join()),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const n = series.length + 1;

  return (
    <Shell
      play={play}
      question={question}
      title="Nested Shape Evolution"
      mission="The series stands as a row of plates. Work out how each figure leads to the next. Then choose the large outer plate (or none) and the small inner plate for the next figure; the machine assembles it at the end of the row."
      icon={Layers3}
      dim="3D"
      submitLabel="Submit the next figure"
      hints={["Watch the small shape: it grows large in the next figure and a new small shape appears inside it.", "Count the sides of the new small shape each time."]}
      live={<Gauge label="Your figure" value={w.stack[1] ? (w.stack[0] ? `${w.stack[0]} ⊃ ${w.stack[1]}` : w.stack[1]) : "—"} tone="violet" />}
    >
      <Stage3D height={260} camera={{ position: [0, 1.6, 10.5], fov: 42 }} orbitTarget={[0, 1, 0]} readOnly={play.readOnly}>
        <Floor />
        {series.map((s, i) => (
          <NestFigure key={i} x={(i - (n - 1) / 2) * 1.9} stack={s} label={`Figure ${i + 1}`} />
        ))}
        <NestFigure x={((n - 1) / 2) * 1.9} stack={w.stack} label="Yours" mine />
      </Stage3D>
      <div className="grid sm:grid-cols-2 gap-2">
        {(["Outer (large) plate", "Inner (small) plate"] as const).map((label, i) => (
          <Bay key={label} label={label} tone={i ? "violet" : "slate"}>
            <div className="flex flex-wrap gap-1">
              {i === 0 && (
                <Btn className="px-2 text-[11px]" active={w.stack[0] === null} tone={w.stack[0] === null ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ stack: [null, p.stack[1]] }))} ariaLabel="outer none">
                  none
                </Btn>
              )}
              {Object.entries(SHAPES).map(([k, s]) => (
                <Btn key={k} className="px-2 text-[11px]" active={w.stack[i] === k} tone={w.stack[i] === k ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.set((p) => ({ stack: p.stack.map((x, j) => (j === i ? k : x)) }))} ariaLabel={`${i ? "inner" : "outer"} ${k}`}>
                  {s.label}
                </Btn>
              ))}
            </div>
          </Bay>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — Classification Arena
   Nine line figures and three gates. The student probes a figure (the probe says whether
   the figure is closed and how the line meets it), then sends it through a gate.
   ══════════════════════════════════════════════════════════════════════ */

const LINE_FIGS: Record<string, { el: React.ReactNode; probe: string }> = {
  openCross: { el: <><path d="M 30 8 A 16 14 0 0 0 30 34" fill="none" /><path d="M 8 21 H 32" /></>, probe: "an open curve; the line crosses it" },
  triThrough: { el: <><path d="M 22 6 L 36 32 L 8 32 Z" fill="none" /><path d="M 12 28 L 42 12" /></>, probe: "a closed triangle; the line passes through it" },
  rectThrough: { el: <><rect x={10} y={8} width={24} height={26} fill="none" /><path d="M 22 4 V 38" /></>, probe: "a closed rectangle; the line passes through it" },
  circleTouch: { el: <><circle cx={20} cy={18} r={11} fill="none" /><path d="M 18 29 H 42" /></>, probe: "a closed circle; the line only touches it" },
  arrowLine: { el: <><path d="M 6 21 H 44" /><path d="M 10 21 H 26 M 21 16 L 26 21 L 21 26" /></>, probe: "an open arrow lying on the line" },
  triTouch: { el: <><path d="M 26 6 L 40 32 L 12 32 Z" fill="none" /><path d="M 4 40 L 12 32" /></>, probe: "a closed triangle; the line only touches a corner" },
  squareTouch: { el: <><rect x={8} y={12} width={22} height={22} fill="none" /><path d="M 30 4 V 12" /></>, probe: "a closed square; the line only touches it" },
  openCross2: { el: <><path d="M 12 10 H 30 V 36 M 12 24 H 30" fill="none" /><path d="M 22 4 V 40" /></>, probe: "an open figure; the line crosses it" },
  circleThrough: { el: <><circle cx={22} cy={21} r={12} fill="none" /><path d="M 10 8 L 36 36" /></>, probe: "a closed circle; the line passes through it" },
};
const groupKey = (groups: number[][]) => groups.map((g) => [...g].sort((a, b) => a - b).join(",")).sort().join(";");

export function B07LineFigureArena({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const figs = cfg<string[]>(question, "figures", []);
  const [held, setHeld] = useState<number | null>(null);
  const play = usePlay<{ gate: Record<number, number> }>({
    question,
    initial: { gate: {} },
    derive: (w) => {
      if (Object.keys(w.gate).length < figs.length) return { note: `Send every figure through a gate (${Object.keys(w.gate).length}/${figs.length}).` };
      const groups = [0, 1, 2].map((g) => figs.map((_, i) => i + 1).filter((n) => w.gate[n - 1] === g));
      if (groups.some((g) => g.length !== 3)) return { note: "Each gate takes exactly three figures." };
      const key = groupKey(groups);
      const opt = question?.multipleChoiceConfig?.options.find((o) => groupKey(o.text.split(";").map((g) => g.split(",").map((x) => Number(x.trim())))) === key)?.id;
      return { value: groups.map((g) => g.join(", ")).join(" ; "), optionId: opt };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="Classification Arena"
      mission="Tap a figure to probe it, then tap a gate to send it through (tap a figure in a gate to take it back). Find the property that splits the nine figures into three gates of three."
      icon={Shapes}
      dim="2D"
      submitLabel="Submit the three classes"
      hints={["Look at how the line meets each shape: does it pass through, only touch, or cross an open figure?"]}
      live={<Gauge label="Probe" value={held !== null ? `${held + 1}: ${LINE_FIGS[figs[held]]?.probe}` : "tap a figure"} tone="sky" />}
    >
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
        {figs.map((f, i) => (
          <button key={i} type="button" disabled={play.readOnly} onClick={() => setHeld(i)} aria-label={`figure ${i + 1}`} className={`rounded-xl border-2 p-1 ${held === i ? "border-violet-600 ring-2 ring-violet-300 bg-white" : w.gate[i] !== undefined ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
            <svg viewBox="0 0 46 42" className="w-full" stroke="#1e1b4b" strokeWidth={1.8} fill="none" strokeLinecap="round">
              {LINE_FIGS[f]?.el}
            </svg>
            <div className="text-[10px] font-black">{i + 1}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((g) => (
          <button
            key={g}
            type="button"
            disabled={play.readOnly || held === null}
            onClick={() => {
              if (held === null) return;
              play.set((p) => ({ gate: { ...p.gate, [held]: g } }));
              setHeld(null);
            }}
            aria-label={`gate ${g + 1}`}
            className="rounded-2xl border-4 border-amber-300 bg-amber-50 min-h-[90px] p-2 text-left"
          >
            <div className="text-[10px] font-black text-amber-800">GATE {g + 1}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {figs.map((f, i) =>
                w.gate[i] === g ? (
                  <span key={i} className="w-9 rounded bg-white border">
                    <svg viewBox="0 0 46 42" stroke="#1e1b4b" strokeWidth={1.8} fill="none">
                      {LINE_FIGS[f]?.el}
                    </svg>
                    <span className="block text-center text-[9px] font-black">{i + 1}</span>
                  </span>
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — Pattern Reconstruction
   Fig. X is the same above and below its middle line, but the lower middle triangle is
   missing. The loose piece is a copy of the upper middle triangle; the student turns and
   flips it and slots it into the gap.
   ══════════════════════════════════════════════════════════════════════ */

function TopPiece() {
  // drawn pointing down, inside the triangle (10,10) (90,10) (50,50)
  return (
    <>
      <path d="M 10 10 L 90 10 L 50 50 Z" fill="#fff" stroke="#1e1b4b" strokeWidth={0.8} />
      <path d="M 10 10 L 30 10 L 20 20 Z" fill="#8b5cf6" />
      <path d="M 52 14 H 76 M 64 14 V 26" stroke="#1e1b4b" strokeWidth={1.2} />
      <path d="M 44 36 L 50 42 L 56 36 Z" fill="#f59e0b" />
      <circle cx={30} cy={16} r={2.4} fill="#0ea5e9" />
    </>
  );
}

export function B08PatternReconstruction({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ turn: number; flip: boolean; slotted: boolean }>({
    question,
    initial: { turn: 0, flip: false, slotted: false },
    derive: (w) =>
      !w.slotted
        ? { note: "Turn and flip the loose piece, then slot it into the gap." }
        : { value: `Piece turned ${w.turn}°${w.flip ? " and flipped" : ""}`, optionId: matchOptionState(question, { turn: w.turn, flip: w.flip }, (o, b) => o.turn === b.turn && o.flip === b.flip) },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  // turn about the piece's own centre (50, 30); the gap's centre is (50, 70)
  const pieceTf = (dy: number) => `translate(0 ${dy}) rotate(${w.turn} 50 30) ${w.flip ? "translate(100 0) scale(-1 1)" : ""}`;

  return (
    <Shell
      play={play}
      question={question}
      title="Pattern Reconstruction"
      mission="Fig. X is the same above and below its middle line, but the lower middle triangle has been knocked out. The loose piece is a copy of the upper middle triangle. Turn it, flip it, and slot it into the gap so the whole design matches above and below."
      icon={Puzzle}
      dim="2D"
      submitLabel="Submit the slotted piece"
      hints={["The corners of Fig. X show how the bottom half copies the top half.", "Turning a piece half a turn is not the same as reflecting it top to bottom."]}
      live={<Gauge label="Piece" value={`${w.turn}°${w.flip ? " · flipped" : ""}`} tone="violet" />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-center">
        <Board>
          <svg viewBox="0 0 100 100" className="w-64 h-64">
            <rect x={2} y={2} width={96} height={96} fill="#fff" stroke="#1e1b4b" strokeWidth={1} />
            <line x1={2} y1={50} x2={98} y2={50} stroke="#94a3b8" strokeDasharray="2 2" strokeWidth={0.5} />
            {/* matching corner marks, reflected top to bottom */}
            <path d="M 2 2 H 12 L 2 12 Z" fill="#8b5cf6" />
            <path d="M 2 98 H 12 L 2 88 Z" fill="#8b5cf6" />
            <rect x={86} y={4} width={10} height={4} fill="#0ea5e9" />
            <rect x={86} y={92} width={10} height={4} fill="#0ea5e9" />
            <g>
              <TopPiece />
            </g>
            <path d="M 10 90 L 90 90 L 50 50 Z" fill={w.slotted ? "none" : "#f1f5f9"} stroke="#94a3b8" strokeDasharray="2 2" strokeWidth={0.6} />
            {w.slotted && (
              <g transform={pieceTf(40)}>
                <TopPiece />
              </g>
            )}
            {!w.slotted && (
              <text x={50} y={80} fontSize={10} textAnchor="middle" fill="#94a3b8" fontWeight={900}>
                ?
              </text>
            )}
          </svg>
        </Board>
        <Bay label="Workbench" tone="violet">
          <svg viewBox="0 0 100 60" className="w-40 mx-auto">
            <g transform={pieceTf(0)}>
              <TopPiece />
            </g>
          </svg>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, slotted: false, turn: (p.turn + 90) % 360 }))}>
              Turn ⟳ 90°
            </Btn>
            <Btn disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, slotted: false, flip: !p.flip }))}>
              ⇋ Flip left–right
            </Btn>
            <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ slotted: true })}>
              Slot it in
            </Btn>
          </div>
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q11 — Hidden Shape Hunt
   The student slides a camera lens (projecting Fig. X) over each figure. The lens freezes
   with MATCH FOUND only when every stroke of Fig. X lies on a real line of that figure.
   ══════════════════════════════════════════════════════════════════════ */

type Seg = [Pt, Pt];
const onSeg = (p: Pt, [[x1, y1], [x2, y2]]: Seg) =>
  Math.abs((x2 - x1) * (p[1] - y1) - (y2 - y1) * (p[0] - x1)) < 1e-6 && p[0] >= Math.min(x1, x2) - 1e-6 && p[0] <= Math.max(x1, x2) + 1e-6 && p[1] >= Math.min(y1, y2) - 1e-6 && p[1] <= Math.max(y1, y2) + 1e-6;

export function B11HiddenShapeHunt({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const target = cfg<Seg[]>(question, "target", []);
  const rooms = cfg<Record<string, Seg[]>>(question, "rooms", {});
  const tw = Math.max(...target.flat().map((p) => p[0]), 0);
  const th = Math.max(...target.flat().map((p) => p[1]), 0);
  const W = 4;
  const H = 5;
  const inside = (room: Seg[], ax: number, ay: number) => target.every(([a, b]) => room.some((s) => onSeg([a[0] + ax, a[1] + ay], s) && onSeg([b[0] + ax, b[1] + ay], s)));
  const play = usePlay<{ room: string; lens: Record<string, Pt>; found: string | null }>({
    question,
    initial: { room: "A", lens: {}, found: null },
    derive: (w) => (!w.found ? { note: "Slide the camera over each figure until it freezes on a match." } : { value: `MATCH FOUND in figure ${w.found}`, optionId: w.found }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const [ax, ay] = w.lens[w.room] ?? [0, 0];
  const hit = !!rooms[w.room] && inside(rooms[w.room], ax, ay);
  const S = 16;
  const O = 10;
  const move = (dx: number, dy: number) =>
    play.set((p) => {
      const [x, y] = p.lens[p.room] ?? [0, 0];
      const nx = Math.max(0, Math.min(W - tw, x + dx));
      const ny = Math.max(0, Math.min(H - th, y + dy));
      return { ...p, found: null, lens: { ...p.lens, [p.room]: [nx, ny] } };
    });

  return (
    <Shell
      play={play}
      question={question}
      title="Hidden Shape Hunt"
      mission="Pick a figure and slide the camera lens over it with the arrows. The lens projects Fig. X; when every stroke lands on a real line of the figure, it freezes with MATCH FOUND. Record the figure where that happens."
      icon={Search}
      dim="2D"
      submitLabel="Submit the figure"
      hints={["Fig. X needs a long upright stroke with a short bar across its top.", "At the bottom the stroke steps to the right and drops down."]}
      live={<Gauge label="Camera" value={hit ? "MATCH FOUND" : "searching"} tone={hit ? "emerald" : "slate"} />}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-3 items-start">
        <Bay label="Fig. (X)">
          <svg viewBox={`-0.5 -0.5 ${tw + 1} ${th + 1}`} className="w-16">
            {target.map(([a, b], i) => (
              <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#7c3aed" strokeWidth={0.18} strokeLinecap="round" />
            ))}
          </svg>
        </Bay>
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {Object.keys(rooms).map((id) => (
              <Btn key={id} active={w.room === id} tone={w.room === id ? "violet" : "slate"} onClick={() => play.patch({ room: id })}>
                Figure {id}
              </Btn>
            ))}
          </div>
          <Board>
            <svg viewBox={`0 0 ${W * S + 2 * O} ${H * S + 2 * O}`} className="w-full max-h-80">
              {(rooms[w.room] ?? []).map(([a, b], i) => (
                <line key={i} x1={O + a[0] * S} y1={O + a[1] * S} x2={O + b[0] * S} y2={O + b[1] * S} stroke="#1e293b" strokeWidth={1.4} strokeLinecap="round" />
              ))}
              <rect x={O + ax * S - 4} y={O + ay * S - 4} width={tw * S + 8} height={th * S + 8} rx={4} fill={hit ? "#10b98122" : "#7c3aed14"} stroke={hit ? "#10b981" : "#a78bfa"} strokeWidth={0.8} />
              {target.map(([a, b], i) => (
                <line key={i} x1={O + (a[0] + ax) * S} y1={O + (a[1] + ay) * S} x2={O + (b[0] + ax) * S} y2={O + (b[1] + ay) * S} stroke={hit ? "#10b981" : "#a78bfa"} strokeWidth={2.2} strokeDasharray={hit ? undefined : "3 2"} strokeLinecap="round" />
              ))}
            </svg>
          </Board>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Btn tone="slate" disabled={play.readOnly} onClick={() => move(-1, 0)} ariaLabel="lens left">◀</Btn>
            <Btn tone="slate" disabled={play.readOnly} onClick={() => move(1, 0)} ariaLabel="lens right">▶</Btn>
            <Btn tone="slate" disabled={play.readOnly} onClick={() => move(0, -1)} ariaLabel="lens up">▲</Btn>
            <Btn tone="slate" disabled={play.readOnly} onClick={() => move(0, 1)} ariaLabel="lens down">▼</Btn>
            <Btn tone="emerald" disabled={play.readOnly || !hit} onClick={() => play.patch({ found: w.room })}>
              📸 Freeze: MATCH FOUND in figure {w.room}
            </Btn>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Fraction Pair Matcher
   Each row pairs a Column-I figure with a Column-II figure. The student taps every piece of
   a figure to count it; the reader shows shaded pieces over all pieces. Once every figure
   is counted, the student flags the pair whose fractions are not equal.
   ══════════════════════════════════════════════════════════════════════ */

type Fig16 = { regions: Pt[][]; shaded: number[] };

export function B16FractionPairs({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const pairs = cfg<Record<string, [Fig16, Fig16]>>(question, "pairs", {});
  const ids = Object.keys(pairs);
  const keyOf = (id: string, side: number) => `${id}${side}`;
  const [open, setOpen] = useState(keyOf(ids[0] ?? "A", 0));
  const play = usePlay<{ counted: Record<string, number[]>; flagged: string | null }>({
    question,
    initial: { counted: {}, flagged: null },
    derive: (w) => {
      const all = ids.every((id) => [0, 1].every((s) => (w.counted[keyOf(id, s)] ?? []).length === pairs[id][s].regions.length));
      if (!all) return { note: "Count every piece of all eight figures." };
      if (!w.flagged) return { note: "Flag the pair whose fractions are not equal." };
      return { value: `Pair ${w.flagged} flagged as not equal`, optionId: w.flagged };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const read = (id: string, s: number) => {
    const t = w.counted[keyOf(id, s)] ?? [];
    const f = pairs[id][s];
    return { n: t.filter((i) => f.shaded.includes(i)).length, d: t.length, done: t.length === f.regions.length };
  };
  const frac = (id: string, s: number) => {
    const r = read(id, s);
    if (!r.done) return `${r.n}/${r.d} so far`;
    const [a, b] = reduceFraction(r.n, r.d);
    return `${r.n}/${r.d} = ${a}/${b}`;
  };
  const openId = open.slice(0, -1);
  const openSide = Number(open.slice(-1));
  const f = pairs[openId]?.[openSide];
  const allCounted = ids.every((id) => read(id, 0).done && read(id, 1).done);

  return (
    <Shell
      play={play}
      question={question}
      title="Fraction Pair Matcher"
      mission="Pick a figure and tap every piece to count it: the reader shows shaded pieces over all pieces. Count both figures of every pair, then flag the pair whose two fractions are not equal."
      icon={Scale3d}
      dim="2D"
      submitLabel="Submit the incorrect pair"
      hints={["Simplify each fraction before comparing, e.g. 6/18 = 1/3.", "Count every piece, not just the shaded ones."]}
      live={<Gauge label={`${openId} · column ${openSide ? "II" : "I"}`} value={f ? frac(openId, openSide) : "—"} tone="violet" />}
    >
      <div className="grid md:grid-cols-[1.1fr_1fr] gap-3">
        <div className="space-y-1.5">
          {ids.map((id) => (
            <div key={id} className="flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white p-1.5">
              <span className="font-black w-5">{id}</span>
              {[0, 1].map((s) => (
                <button key={s} type="button" onClick={() => setOpen(keyOf(id, s))} aria-label={`open ${id} column ${s ? "II" : "I"}`} className={`rounded-lg border-2 p-0.5 ${open === keyOf(id, s) ? "border-violet-500" : read(id, s).done ? "border-emerald-300" : "border-slate-200"}`}>
                  <svg viewBox="0 0 100 100" className="w-14 h-14">
                    {pairs[id][s].regions.map((pts, i) => (
                      <path key={i} d={polyPath(pts)} fill={pairs[id][s].shaded.includes(i) ? "#a78bfa" : "#fff"} stroke="#312e81" strokeWidth={1.2} />
                    ))}
                  </svg>
                </button>
              ))}
              <span className="text-[10px] font-bold text-slate-600 flex-1">
                I: {frac(id, 0)}
                <br />
                II: {frac(id, 1)}
              </span>
              <Btn className="px-2 min-h-[30px] text-[11px]" tone={w.flagged === id ? "rose" : "slate"} active={w.flagged === id} disabled={play.readOnly || !allCounted} onClick={() => play.patch({ flagged: id })} ariaLabel={`flag ${id}`}>
                🚩
              </Btn>
            </div>
          ))}
        </div>
        <Board>
          {f && (
            <svg viewBox="0 0 100 100" className="w-full max-h-72">
              {f.regions.map((pts, i) => (
                <path
                  key={i}
                  d={polyPath(pts)}
                  fill={f.shaded.includes(i) ? "#a78bfa" : "#ffffff"}
                  stroke={(w.counted[open] ?? []).includes(i) ? "#f59e0b" : "#312e81"}
                  strokeWidth={(w.counted[open] ?? []).includes(i) ? 1.6 : 0.6}
                  role="button"
                  aria-label={`piece ${i + 1}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => !play.readOnly && play.set((p) => ({ flagged: null, counted: { ...p.counted, [open]: toggle(p.counted[open] ?? [], i) } }))}
                />
              ))}
            </svg>
          )}
        </Board>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — Shaded Corners
   The rectangle's measurements are hidden. The student sets AB until the perimeter reads
   76 cm, then AE and BJ until the two ratio lamps light. The four shaded corner triangles
   can then be measured one by one; their areas add to the shaded area.
   ══════════════════════════════════════════════════════════════════════ */

export function B19ShadedCorners({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const perimeter = cfg<number>(question, "perimeter", 76);
  const bc = cfg<number>(question, "bc", 20);
  const kA = cfg<number>(question, "abOverAe", 3);
  const kB = cfg<number>(question, "bcOverBj", 2);
  type W19 = { ab: number; ae: number; bj: number; measured: number[] };
  const lamps = (w: W19) => ({ per: 2 * (w.ab + bc) === perimeter, ae: w.ab === kA * w.ae, bj: bc === kB * w.bj });
  const tris = (w: W19) => [
    { name: "corner A", legs: [w.ae, w.ae] },
    { name: "corner D", legs: [w.ae, w.ae] },
    { name: "corner B", legs: [w.ab - w.ae, w.bj] },
    { name: "corner C", legs: [w.ab - w.ae, bc - w.bj] },
  ];
  const play = usePlay<W19>({
    question,
    initial: { ab: 10, ae: 2, bj: 4, measured: [] },
    derive: (w) => {
      const l = lamps(w);
      if (!l.per || !l.ae || !l.bj) return { note: "Set AB, AE and BJ so that all three lamps light." };
      if (w.measured.length < 4) return { note: `Measure every shaded triangle (${w.measured.length}/4).` };
      const total = tris(w).reduce((s, t) => s + (t.legs[0] * t.legs[1]) / 2, 0);
      return { value: `${total} cm²`, optionId: matchText(question, `${total} cm²`) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const l = lamps(w);
  const ready = l.per && l.ae && l.bj;
  const K = 4;
  const X = (x: number) => 6 + x * K;
  const Y = (y: number) => 6 + y * K;
  const ab = Math.max(1, w.ab);
  const set = (k: "ab" | "ae" | "bj", d: number) => play.set((p) => ({ ...p, measured: [], [k]: Math.max(1, p[k] + d) }));
  const shapes = [
    [[0, 0], [w.ae, 0], [0, w.ae]],
    [[bc, 0], [bc - w.ae, 0], [bc, w.ae]],
    [[0, ab], [0, w.ae], [w.bj, ab]],
    [[bc, ab], [bc, w.ae], [w.bj, ab]],
  ] as Pt[][];

  return (
    <Shell
      play={play}
      question={question}
      title="Shaded Corners"
      mission={`BC is ${bc} cm. Set AB until the perimeter reads ${perimeter} cm, then set AE and BJ until their lamps light. The corner cuts at A and D are as long as AE. Then measure each shaded triangle; the shaded area is their total.`}
      icon={Triangle}
      dim="2D"
      submitLabel="Submit the shaded area"
      hints={["Perimeter = 2 × (AB + BC).", "A right triangle's area is half the product of its two short sides."]}
      live={
        <>
          <Gauge label="Perimeter" value={`${2 * (w.ab + bc)} cm`} tone={l.per ? "emerald" : "amber"} />
          <Gauge label="AB ÷ AE" value={`${+(w.ab / w.ae).toFixed(2)}`} tone={l.ae ? "emerald" : "amber"} />
          <Gauge label="BC ÷ BJ" value={`${+(bc / w.bj).toFixed(2)}`} tone={l.bj ? "emerald" : "amber"} />
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-3">
        <Board>
          <svg viewBox={`0 0 ${bc * K + 12} ${ab * K + 12}`} className="w-full max-h-72">
            <rect x={X(0)} y={Y(0)} width={bc * K} height={ab * K} fill="#fff" stroke="#1e1b4b" strokeWidth={0.6} />
            {shapes.map((pts, i) => (
              <path key={i} d={polyPath(pts.map(([x, y]) => [X(x), Y(y)]))} fill={w.measured.includes(i) ? "#fbbf24" : "#cbd5e1"} stroke="#1e1b4b" strokeWidth={0.4} />
            ))}
            {[["A", 0, 0], ["D", bc, 0], ["B", 0, ab], ["C", bc, ab], ["E", 0, w.ae], ["J", w.bj, ab]].map(([t, x, y]) => (
              <text key={t as string} x={X(x as number) + ((x as number) > 0 ? 1.5 : -4.5)} y={Y(y as number) + ((y as number) > 0 ? 4 : -1)} fontSize={3.4} fontWeight={900}>
                {t}
              </text>
            ))}
          </svg>
        </Board>
        <div className="space-y-2">
          <Bay label="Measurements">
            <Stepper label="AB" value={w.ab} min={1} max={40} steps={[1, 5]} unit=" cm" disabled={play.readOnly} onStep={(d) => set("ab", d)} />
            <Stepper label="AE" value={w.ae} min={1} max={20} unit=" cm" disabled={play.readOnly} onStep={(d) => set("ae", d)} />
            <Stepper label="BJ" value={w.bj} min={1} max={bc - 1} unit=" cm" disabled={play.readOnly} onStep={(d) => set("bj", d)} />
          </Bay>
          <Bay label="Shaded triangles" tone="violet">
            <div className="grid grid-cols-2 gap-1.5">
              {tris(w).map((t, i) => (
                <Btn key={t.name} className="text-[11px]" tone={w.measured.includes(i) ? "emerald" : "slate"} disabled={play.readOnly || !ready || w.measured.includes(i)} onClick={() => play.patch({ measured: [...w.measured, i] })} ariaLabel={`measure ${t.name}`}>
                  {t.name}: {w.measured.includes(i) ? `½ × ${t.legs[0]} × ${t.legs[1]} = ${(t.legs[0] * t.legs[1]) / 2}` : "measure"}
                </Btn>
              ))}
            </div>
          </Bay>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — Circle Region Lab
   Two circles: one with two radii drawn, one with a chord. The student taps the region
   in each; the lab outlines what encloses it. Each statement's verdict unlocks once its
   region has been examined.
   ══════════════════════════════════════════════════════════════════════ */

export function B20CircleRegions({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const verdictOptions = cfg<Record<string, string>>(question, "verdictOptions", {});
  const play = usePlay<{ seen: [boolean, boolean]; v: [string | null, string | null] }>({
    question,
    initial: { seen: [false, false], v: [null, null] },
    derive: (w) => {
      if (!w.v[0] || !w.v[1]) return { note: "Examine both regions, then give each statement a verdict." };
      return { value: `(i) ${w.v[0] === "T" ? "true" : "false"}, (ii) ${w.v[1] === "T" ? "true" : "false"}`, optionId: verdictOptions[`${w.v[0]}${w.v[1]}`] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const R = 34;
  const at = (deg: number) => [50 + R * Math.cos((deg * Math.PI) / 180), 50 + R * Math.sin((deg * Math.PI) / 180)].join(" ");
  const see = (i: 0 | 1) => play.set((p) => ({ ...p, seen: (i ? [p.seen[0], true] : [true, p.seen[1]]) as [boolean, boolean] }));
  const Verdict = ({ i }: { i: 0 | 1 }) => (
    <div className="flex gap-1.5">
      {["T", "F"].map((v) => (
        <Btn key={v} disabled={play.readOnly || !w.seen[i]} active={w.v[i] === v} tone={w.v[i] === v ? (v === "T" ? "emerald" : "rose") : "slate"} onClick={() => play.patch({ v: (i === 0 ? [v, w.v[1]] : [w.v[0], v]) as [string, string] })} ariaLabel={`statement ${i + 1} ${v === "T" ? "true" : "false"}`}>
          {v === "T" ? "True" : "False"}
        </Btn>
      ))}
    </div>
  );

  return (
    <Shell
      play={play}
      question={question}
      title="Circle Region Lab"
      mission="Tap the shaded region in each circle. The lab outlines the boundary pieces that enclose it — arcs, radii or chords. Then decide whether each statement describes its region correctly."
      icon={CircleDot}
      dim="2D"
      submitLabel="Submit the verdicts"
      hints={["A radius joins the centre to the circle; a chord joins two points of the circle."]}
      live={
        <>
          <Gauge label="Region 1" value={w.seen[0] ? "arc + 2 radii" : "—"} tone={w.seen[0] ? "emerald" : "slate"} />
          <Gauge label="Region 2" value={w.seen[1] ? "arc + chord" : "—"} tone={w.seen[1] ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <Bay key={i} label={`Circle ${i + 1}`}>
            <svg viewBox="0 0 100 100" className="w-full max-h-52">
              <circle cx={50} cy={50} r={R} fill="#f5f3ff" stroke="#312e81" strokeWidth={0.8} />
              <path
                d={i === 0 ? `M 50 50 L ${at(-60)} A ${R} ${R} 0 0 1 ${at(20)} Z` : `M ${at(-40)} A ${R} ${R} 0 0 1 ${at(60)} Z`}
                fill={w.seen[i] ? "#fbbf24" : "#c4b5fd"}
                stroke={w.seen[i] ? "#b45309" : "#312e81"}
                strokeWidth={w.seen[i] ? 1.6 : 0.6}
                role="button"
                aria-label={`region ${i + 1}`}
                style={{ cursor: "pointer" }}
                onClick={() => !play.readOnly && see(i as 0 | 1)}
              />
              <circle cx={50} cy={50} r={1.3} fill="#1e1b4b" />
            </svg>
          </Bay>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Bay label="(i) sector: an arc and a pair of radii" tone="violet">
          <Verdict i={0} />
        </Bay>
        <Bay label="(ii) segment: an arc and a chord" tone="violet">
          <Verdict i={1} />
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q21 — Whole-Number Laws Lab
   Four labs, one per statement. The student feeds whole numbers into each lab and reads
   the machines' outputs; after testing every lab, they flag the statement that failed.
   ══════════════════════════════════════════════════════════════════════ */

type LawRun = { lab: string; a: number; b: number; c: number };
const LAB_RESULT: Record<string, (r: LawRun) => { text: string; holds: boolean }> = {
  A: ({ a, b }) => ({ text: `${a} + ${b} = ${a + b}, ${a} × ${b} = ${a * b}`, holds: true }),
  B: ({ a }) => ({ text: `${a} ÷ 0 = no answer`, holds: true }),
  C: ({ a, b }) => ({ text: `${a} + ${b} = ${a + b} and ${b} + ${a} = ${b + a}; ${a} − ${b} = ${a - b} and ${b} − ${a} = ${b - a}`, holds: a - b === b - a }),
  D: ({ a, b, c }) => ({ text: `${a} × (${b} + ${c}) = ${a * (b + c)}; ${a} × ${b} + ${a} × ${c} = ${a * b + a * c}`, holds: a * (b + c) === a * b + a * c }),
};

export function B21LawsLab({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ a: number; b: number; c: number; log: LawRun[]; flagged: string | null }>({
    question,
    initial: { a: 7, b: 3, c: 2, log: [], flagged: null },
    derive: (w) => {
      const labs = ["A", "B", "C", "D"];
      if (labs.some((l) => w.log.filter((r) => r.lab === l).length < 2)) return { note: "Run every lab at least twice." };
      if (!w.flagged) return { note: "Flag the statement whose lab failed." };
      return { value: `Statement ${w.flagged} flagged as incorrect`, optionId: w.flagged };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const run = (lab: string) => play.set((p) => ({ ...p, flagged: null, log: [...p.log, { lab, a: p.a, b: p.b, c: p.c }] }));

  return (
    <Shell
      play={play}
      question={question}
      title="Whole-Number Laws Lab"
      mission="Choose whole numbers a, b and c, then run each lab. Each lab tests one statement with your numbers and shows what the machines produced. Run every lab at least twice with different numbers, then flag the statement that is incorrect."
      icon={Factory}
      dim="2D"
      submitLabel="Submit the incorrect statement"
      hints={["A law must hold for every pair of numbers; one failure is enough to break it.", "Try a and b that are not equal."]}
      live={<Gauge label="Runs" value={w.log.length} tone="violet" />}
    >
      <div className="flex flex-wrap gap-4">
        <Stepper label="a" value={w.a} min={0} max={20} disabled={play.readOnly} onStep={(d) => play.patch({ a: w.a + d })} />
        <Stepper label="b" value={w.b} min={0} max={20} disabled={play.readOnly} onStep={(d) => play.patch({ b: w.b + d })} />
        <Stepper label="c" value={w.c} min={0} max={20} disabled={play.readOnly} onStep={(d) => play.patch({ c: w.c + d })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {(["A", "B", "C", "D"] as const).map((lab) => {
          const runs = w.log.filter((r) => r.lab === lab);
          return (
            <Bay key={lab} label={`Lab ${lab}`}>
              <p className="text-[11px] font-semibold text-slate-600">{optText(question, lab)}</p>
              <Btn className="mt-1" disabled={play.readOnly} onClick={() => run(lab)} ariaLabel={`run lab ${lab}`}>
                ▶ Run with a = {w.a}, b = {w.b}{lab === "D" ? `, c = ${w.c}` : ""}
              </Btn>
              <ul className="mt-1 space-y-0.5 max-h-24 overflow-y-auto">
                {runs.map((r, i) => {
                  const res = LAB_RESULT[lab](r);
                  return (
                    <li key={i} className={`text-[11px] font-mono font-bold ${res.holds ? "text-emerald-700" : "text-rose-700"}`}>
                      {res.text}
                    </li>
                  );
                })}
              </ul>
              <Btn className="mt-1 px-2 min-h-[30px] text-[11px]" tone={w.flagged === lab ? "rose" : "slate"} active={w.flagged === lab} disabled={play.readOnly} onClick={() => play.patch({ flagged: lab })} ariaLabel={`flag ${lab}`}>
                🚩 This statement is incorrect
              </Btn>
            </Bay>
          );
        })}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — HCF Explorer
   The student picks an even number and an odd number; both are broken into their factors
   and the common ones light up. The largest common factor is logged. After several pairs
   the logs show whether the HCF is always the same.
   ══════════════════════════════════════════════════════════════════════ */

const factorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

export function B30HcfExplorer({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ e: number; o: number; log: { e: number; o: number; h: number }[] }>({
    question,
    initial: { e: 4, o: 7, log: [] },
    derive: (w) => {
      if (w.log.length < 3) return { note: `Log the HCF for at least 3 different pairs (${w.log.length}/3).` };
      const hs = new Set(w.log.map((l) => l.h));
      const text = hs.size === 1 ? String([...hs][0]) : "Can't say";
      return { value: hs.size === 1 ? `HCF was ${text} every time` : `HCF changed: ${w.log.map((l) => l.h).join(", ")}`, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const fe = factorsOf(w.e);
  const fo = factorsOf(w.o);
  const common = fe.filter((d) => fo.includes(d));
  const dup = w.log.some((l) => l.e === w.e && l.o === w.o);

  return (
    <Shell
      play={play}
      question={question}
      title="HCF Explorer"
      mission="Choose an even number and an odd number. Both are broken into their factors, and the factors they share light up. Log the highest common factor, then try other pairs and see whether it is always the same."
      icon={Ruler}
      dim="2D"
      submitLabel="Submit what the HCF always is"
      hints={["An even number and an odd number can share an odd factor such as 3 or 5."]}
      live={<Gauge label="Logged" value={w.log.map((l) => `(${l.e}, ${l.o}) → ${l.h}`).join("  ") || "—"} tone="violet" />}
    >
      <div className="flex flex-wrap gap-4">
        <Stepper label="Even" value={w.e} min={2} max={40} steps={[2]} disabled={play.readOnly} onStep={(d) => play.patch({ e: w.e + d })} />
        <Stepper label="Odd" value={w.o} min={1} max={39} steps={[2]} disabled={play.readOnly} onStep={(d) => play.patch({ o: w.o + d })} />
      </div>
      <Board className="space-y-1">
        {[
          { n: w.e, f: fe },
          { n: w.o, f: fo },
        ].map((row) => (
          <div key={row.n} className="flex flex-wrap items-center gap-1">
            <span className="w-10 font-mono font-black">{row.n}</span>
            {row.f.map((d) => (
              <span key={d} className={`px-1.5 py-0.5 rounded font-mono text-xs font-black border ${common.includes(d) ? "bg-emerald-100 border-emerald-400" : "bg-white border-slate-200"}`}>
                {d}
              </span>
            ))}
          </div>
        ))}
      </Board>
      <Btn tone="emerald" disabled={play.readOnly || dup} onClick={() => play.patch({ log: [...w.log, { e: w.e, o: w.o, h: Math.max(...common) }] })}>
        {dup ? "Pair already logged" : `Log HCF(${w.e}, ${w.o}) = ${gcd(w.e, w.o)}`}
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — Polygon Inspector
   Each figure is inspected against the three tests of a polygon: made only of straight
   sides, closed, and sides meeting only at their ends (no crossings, no extra lines). The
   student answers each test by looking; a figure that fails any test goes in the
   "not a polygon" bin.
   ══════════════════════════════════════════════════════════════════════ */

const POLY_ART: Record<string, React.ReactNode> = {
  triangleExtra: <><path d="M 50 12 L 86 80 L 14 80 Z" fill="none" /><path d="M 30 48 L 64 88" /></>,
  hexagon: <path d="M 30 18 L 70 18 L 90 50 L 70 82 L 30 82 L 10 50 Z" fill="none" />,
  openCross: <><path d="M 44 10 V 90" /><path d="M 20 40 L 80 30 L 90 70 L 20 70" fill="none" /></>,
  triangleInner: <><path d="M 50 12 L 90 82 L 10 82 Z" fill="none" /><path d="M 30 47 L 70 47 L 50 82 Z" fill="none" /></>,
  bowTie: <path d="M 14 22 L 86 78 L 86 22 L 14 78 Z" fill="none" />,
};
const TESTS = ["only straight sides", "closed", "sides meet only at corners"];

export function B34PolygonInspector({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const shapes = cfg<{ id: string; name: string }[]>(question, "shapes", []);
  const [open, setOpen] = useState(shapes[0]?.id ?? "(i)");
  const play = usePlay<{ answers: Record<string, (boolean | null)[]> }>({
    question,
    initial: { answers: {} },
    derive: (w) => {
      const done = shapes.filter((s) => (w.answers[s.id] ?? []).length === TESTS.length && (w.answers[s.id] ?? []).every((x) => x !== null));
      if (done.length < shapes.length) return { note: `Inspect every figure against all three tests (${done.length}/${shapes.length}).` };
      const not = shapes.filter((s) => w.answers[s.id].some((x) => x === false)).map((s) => s.id);
      if (!not.length) return { note: "Every figure passed — look again." };
      const text = not.length === 1 ? not[0] : `${not.slice(0, -1).join(", ")} and ${not[not.length - 1]}`;
      return { value: `Not polygons: ${text}`, optionId: matchText(question, text) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const s = shapes.find((x) => x.id === open);
  const ans = w.answers[open] ?? [null, null, null];
  const setAns = (i: number, v: boolean) => play.set((p) => ({ answers: { ...p.answers, [open]: (p.answers[open] ?? [null, null, null]).map((x, j) => (j === i ? v : x)) } }));

  return (
    <Shell
      play={play}
      question={question}
      title="Polygon Inspector"
      mission="A polygon is a closed figure made only of straight sides that meet just at their ends. Pick a figure and answer the three tests for it by looking closely. A figure that fails any test is not a polygon."
      icon={Hexagon}
      dim="2D"
      submitLabel="Submit the figures that are not polygons"
      hints={["Extra lines inside or sticking out mean the sides do not meet only at their ends.", "A figure whose sides cross each other is not a polygon."]}
      live={<Gauge label="Not polygons so far" value={shapes.filter((x) => (w.answers[x.id] ?? []).some((v) => v === false)).map((x) => x.id).join(", ") || "—"} tone="rose" />}
    >
      <div className="flex flex-wrap gap-1.5">
        {shapes.map((x) => (
          <Btn key={x.id} active={open === x.id} tone={open === x.id ? "violet" : (w.answers[x.id] ?? []).filter((v) => v !== null).length === 3 ? "emerald" : "slate"} onClick={() => setOpen(x.id)}>
            Figure {x.id}
          </Btn>
        ))}
      </div>
      <div className="grid sm:grid-cols-[1fr_1.2fr] gap-3">
        <Board>
          <svg viewBox="0 0 100 100" className="w-full max-h-56" stroke="#1e1b4b" strokeWidth={2.4} fill="none" strokeLinejoin="round">
            {s && POLY_ART[s.name]}
          </svg>
        </Board>
        <Bay label={`Tests for figure ${open}`} tone="violet">
          {TESTS.map((t, i) => (
            <div key={t} className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="text-xs font-bold w-40">{t}?</span>
              <Btn className="px-2 min-h-[30px]" tone={ans[i] === true ? "emerald" : "slate"} active={ans[i] === true} disabled={play.readOnly} onClick={() => setAns(i, true)} ariaLabel={`${open} ${t} yes`}>
                yes
              </Btn>
              <Btn className="px-2 min-h-[30px]" tone={ans[i] === false ? "rose" : "slate"} active={ans[i] === false} disabled={play.readOnly} onClick={() => setAns(i, false)} ariaLabel={`${open} ${t} no`}>
                no
              </Btn>
            </div>
          ))}
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — Claim Checker
   Four labs, one per statement: a chocolate bar to shade, an altitude line, an age
   builder and a decimal adder. Each lab works its claim out; the student then flags the
   statement whose claim did not hold.
   ══════════════════════════════════════════════════════════════════════ */

type Labs47 = {
  A: { a: [number, number]; b: [number, number]; claim: [number, number] };
  B: { peak: number; mine: number; claimCm: number };
  C: { factor: number; years: number };
  D: { from: [number, number]; take: [number, number]; claim: number };
};

export function B47ClaimChecker({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const labs = cfg<Labs47>(question, "labs", { A: { a: [2, 3], b: [1, 4], claim: [11, 12] }, B: { peak: 0, mine: 0, claimCm: 0 }, C: { factor: 3, years: 5 }, D: { from: [0, 0], take: [0, 0], claim: 0 } });
  const pieces = labs.A.a[1] * labs.A.b[1];
  type W47 = { first: number[]; second: number[]; eater: 0 | 1; up: number; down: number; blocks: string[]; dSteps: number; flagged: string | null };
  const r5 = (v: number) => Math.round(v * 1e5) / 1e5;
  const results = (w: W47) => {
    const [fn, fd] = reduceFraction(w.first.length, pieces);
    const [sn, sd] = reduceFraction(w.second.length, pieces);
    const aDone = w.first.length > 0 && w.second.length > 0 && fn * labs.A.a[1] === labs.A.a[0] * fd && sn * labs.A.b[1] === labs.A.b[0] * sd;
    const [tn, td] = reduceFraction(w.first.length + w.second.length, pieces);
    const bDone = w.up === labs.B.peak && -w.down === labs.B.mine;
    const dist = w.up + w.down;
    const cDone = w.blocks.join() === [`×${labs.C.factor}`, `+${labs.C.years}`].join();
    const d1 = r5(labs.D.from[0] + labs.D.from[1]);
    const d2 = r5(labs.D.take[0] + labs.D.take[1]);
    return {
      A: aDone ? { got: `${tn}/${td}`, ok: tn * labs.A.claim[1] === labs.A.claim[0] * td } : null,
      B: bDone ? { got: `${dist.toLocaleString("en-IN")} m = ${(dist * 100).toLocaleString("en-IN")} cm`, ok: dist * 100 === labs.B.claimCm } : null,
      C: cDone ? { got: `${labs.C.factor}x + ${labs.C.years}`, ok: true } : null,
      D: w.dSteps >= 3 ? { got: `${d1} − ${d2} = ${r5(d1 - d2)}`, ok: Math.abs(r5(d1 - d2) - labs.D.claim) < 1e-9 } : null,
    };
  };
  const play = usePlay<W47>({
    question,
    initial: { first: [], second: [], eater: 0, up: 0, down: 0, blocks: [], dSteps: 0, flagged: null },
    derive: (w) => {
      const r = results(w);
      if (Object.values(r).some((x) => !x)) return { note: `Work every lab (${Object.values(r).filter(Boolean).length}/4 done).` };
      if (!w.flagged) return { note: "Flag the statement whose claim did not hold." };
      return { value: `Statement ${w.flagged} flagged as incorrect`, optionId: w.flagged };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const r = results(w);
  const stamp = (x: { got: string; ok: boolean } | null) => (x ? <span className="text-[11px] font-black">{x.got}</span> : <span className="text-[10px] text-slate-400 font-bold">not worked yet</span>);
  const d1 = r5(labs.D.from[0] + labs.D.from[1]);
  const d2 = r5(labs.D.take[0] + labs.D.take[1]);

  return (
    <Shell
      play={play}
      question={question}
      title="Claim Checker"
      mission="Work each lab. A: shade what each friend ate on the chocolate bar. B: set the heights above and below sea level. C: build Monika's father's age from blocks. D: run the decimal adder. Compare each result with its claim, then flag the incorrect statement."
      icon={ClipboardCheck}
      dim="2D"
      submitLabel="Submit the incorrect statement"
      hints={["Check the units in every claim: metres and centimetres are different.", "1 m = 100 cm."]}
      live={<>{(["A", "B", "C", "D"] as const).map((k) => <Gauge key={k} label={`Lab ${k}`} value={r[k] ? "worked" : "—"} tone={r[k] ? "emerald" : "slate"} />)}</>}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Bay label={<span className="flex items-center gap-2">A · Chocolate bar {stamp(r.A)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "A")}</p>
          <div className="flex gap-1.5 mb-1">
            {[0, 1].map((e) => (
              <Btn key={e} className="px-2 min-h-[30px] text-[11px]" active={w.eater === e} tone={w.eater === e ? "violet" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ eater: e as 0 | 1 })}>
                Friend {e + 1}
              </Btn>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-0.5 w-56">
            {Array.from({ length: pieces }, (_, i) => {
              const who = w.first.includes(i) ? 0 : w.second.includes(i) ? 1 : null;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={play.readOnly}
                  aria-label={`chocolate piece ${i + 1}`}
                  onClick={() =>
                    play.set((p) => {
                      const first = p.first.filter((x) => x !== i);
                      const second = p.second.filter((x) => x !== i);
                      if (who === p.eater) return { ...p, first, second, flagged: null };
                      return { ...p, flagged: null, first: p.eater === 0 ? [...first, i] : first, second: p.eater === 1 ? [...second, i] : second };
                    })
                  }
                  className={`h-7 rounded border ${who === 0 ? "bg-violet-400 border-violet-600" : who === 1 ? "bg-amber-300 border-amber-500" : "bg-amber-900/10 border-amber-900/30"}`}
                />
              );
            })}
          </div>
        </Bay>
        <Bay label={<span className="flex items-center gap-2">B · Altitude line {stamp(r.B)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "B")}</p>
          <Stepper label="A above sea (m)" value={w.up} min={0} max={20000} steps={[50, 1000]} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ ...p, flagged: null, up: p.up + d }))} />
          <Stepper label="B below sea (m)" value={w.down} min={0} max={60000} steps={[100, 1000, 10000]} disabled={play.readOnly} onStep={(d) => play.set((p) => ({ ...p, flagged: null, down: p.down + d }))} />
        </Bay>
        <Bay label={<span className="flex items-center gap-2">C · Age builder {stamp(r.C)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "C")}</p>
          <div className="flex flex-wrap gap-1">
            {[`×${labs.C.factor}`, `+${labs.C.years}`, "×2", "+3"].map((b) => (
              <Btn key={b} className="px-2 min-h-[30px]" disabled={play.readOnly} onClick={() => play.set((p) => ({ ...p, flagged: null, blocks: [...p.blocks, b].slice(-2) }))} ariaLabel={`block ${b}`}>
                {b}
              </Btn>
            ))}
            <Btn className="px-2 min-h-[30px]" tone="slate" disabled={play.readOnly || !w.blocks.length} onClick={() => play.patch({ blocks: [] })}>
              clear
            </Btn>
          </div>
          <div className="font-mono text-sm font-black mt-1">x {w.blocks.join(" ")}</div>
        </Bay>
        <Bay label={<span className="flex items-center gap-2">D · Decimal adder {stamp(r.D)}</span>}>
          <p className="text-[11px] text-slate-600 mb-1">{optText(question, "D")}</p>
          <div className="font-mono text-[11px] font-bold space-y-0.5">
            <div>{w.dSteps >= 1 ? `${labs.D.from[0]} + ${labs.D.from[1]} = ${d1}` : "…"}</div>
            <div>{w.dSteps >= 2 ? `${labs.D.take[0]} + ${labs.D.take[1]} = ${d2}` : "…"}</div>
            <div>{w.dSteps >= 3 ? `${d1} − ${d2} = ${r5(d1 - d2)}` : "…"}</div>
          </div>
          <Btn className="mt-1 px-2 min-h-[30px]" disabled={play.readOnly || w.dSteps >= 3} onClick={() => play.patch({ dSteps: w.dSteps + 1 })}>
            Next step
          </Btn>
        </Bay>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(["A", "B", "C", "D"] as const).map((k) => (
          <Btn key={k} tone={w.flagged === k ? "rose" : "slate"} active={w.flagged === k} disabled={play.readOnly || Object.values(r).some((x) => !x)} onClick={() => play.patch({ flagged: k })} ariaLabel={`flag ${k}`}>
            🚩 Statement {k} is incorrect
          </Btn>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — Divisibility Tester
   The student types numbers into the tester; it shows the digit sum and whether 2, 3, 5 and
   6 divide the number. A statement is judged false as soon as one number breaks it, and
   true only after four numbers it covers all agree.
   ══════════════════════════════════════════════════════════════════════ */

export function B48DivisibilityTester({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const verdictOptions = cfg<Record<string, string>>(question, "verdictOptions", {});
  const dsum = (n: number) => String(n).split("").reduce((s, d) => s + Number(d), 0);
  const verdicts = (tested: number[]) => {
    const c1 = tested.filter((n) => dsum(n) % 5 === 0);
    const bad1 = c1.some((n) => n % 5 !== 0);
    const c2 = tested.filter((n) => n % 2 === 0 || n % 3 === 0);
    const bad2 = c2.some((n) => n % 6 !== 0);
    return [bad1 ? "F" : c1.length >= 4 ? "T" : null, bad2 ? "F" : c2.length >= 4 ? "T" : null] as const;
  };
  const play = usePlay<{ n: number; tested: number[] }>({
    question,
    initial: { n: 23, tested: [] },
    derive: (w) => {
      const v = verdicts(w.tested);
      if (!v[0] || !v[1]) return { note: "Test more numbers until both statements can be judged." };
      return { value: `Statement I ${v[0] === "T" ? "true" : "false"}, Statement II ${v[1] === "T" ? "true" : "false"}`, optionId: verdictOptions[`${v[0]}${v[1]}`] };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const v = verdicts(w.tested);
  const tick = (b: boolean) => (b ? "✓" : "✗");

  return (
    <Shell
      play={play}
      question={question}
      title="Divisibility Tester"
      mission="Type a number and test it. The tester shows its digit sum and which of 2, 3, 5 and 6 divide it. A statement fails as soon as one number breaks it; it stands only after four numbers it talks about all agree."
      icon={Microscope}
      dim="2D"
      submitLabel="Submit the verdicts"
      hints={["For Statement I, try numbers whose digits add up to 5 or 10.", "For Statement II, try a number divisible by 2 but not by 3."]}
      live={
        <>
          <Gauge label="Statement I" value={v[0] === "F" ? "broken" : v[0] === "T" ? "holds" : "undecided"} tone={v[0] === "F" ? "rose" : v[0] === "T" ? "emerald" : "slate"} />
          <Gauge label="Statement II" value={v[1] === "F" ? "broken" : v[1] === "T" ? "holds" : "undecided"} tone={v[1] === "F" ? "rose" : v[1] === "T" ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" aria-label="Number to test" value={w.n} disabled={play.readOnly} onChange={(e) => play.patch({ n: Math.max(1, Math.round(Number(e.target.value)) || 1) })} className="w-28 h-10 rounded border-2 px-2 font-mono font-black bg-white" />
        <Btn tone="emerald" disabled={play.readOnly || w.tested.includes(w.n)} onClick={() => play.patch({ tested: [...w.tested, w.n] })}>
          Test {w.n}
        </Btn>
      </div>
      <Board>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-slate-500">
              <th className="text-left">number</th>
              <th>digit sum</th>
              <th>÷2</th>
              <th>÷3</th>
              <th>÷5</th>
              <th>÷6</th>
            </tr>
          </thead>
          <tbody>
            {w.tested.map((n) => (
              <tr key={n} className="text-center font-bold">
                <td className="text-left">{n}</td>
                <td>{dsum(n)}</td>
                <td>{tick(n % 2 === 0)}</td>
                <td>{tick(n % 3 === 0)}</td>
                <td>{tick(n % 5 === 0)}</td>
                <td>{tick(n % 6 === 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Board>
    </Shell>
  );
}

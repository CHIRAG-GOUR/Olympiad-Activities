"use client";

import React from "react";
import { Box, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q1 — Rotating dice laboratory.
 *
 * The die is a real 3D body the student spins with mouse or finger. Face numbers follow
 * the net implied by the two given positions (5 opposite 6, 1 opposite 2, 3 opposite 4),
 * so the microworld genuinely answers the question: spin 6 to the bottom and read the top.
 * The number showing on top IS the submitted answer.
 */

interface DiceState {
  rotX: number;
  rotY: number;
  touched: boolean;
}

// Local face normals in the CSS coordinate system (x right, y DOWN, z toward viewer)
const FACES: { pips: number; n: [number, number, number]; transform: string }[] = [
  { pips: 5, n: [0, 0, 1], transform: "translateZ(56px)" },
  { pips: 6, n: [0, 0, -1], transform: "rotateY(180deg) translateZ(56px)" },
  { pips: 3, n: [1, 0, 0], transform: "rotateY(90deg) translateZ(56px)" },
  { pips: 4, n: [-1, 0, 0], transform: "rotateY(-90deg) translateZ(56px)" },
  { pips: 2, n: [0, -1, 0], transform: "rotateX(90deg) translateZ(56px)" },
  { pips: 1, n: [0, 1, 0], transform: "rotateX(-90deg) translateZ(56px)" },
];

const rad = (d: number) => (d * Math.PI) / 180;

/** World normal of a local face under the CSS transform rotateX(a) rotateY(b). */
function worldNormal([x, y, z]: [number, number, number], a: number, b: number) {
  const ca = Math.cos(rad(a));
  const sa = Math.sin(rad(a));
  const cb = Math.cos(rad(b));
  const sb = Math.sin(rad(b));
  // Ry first, then Rx
  const yx = cb * x + sb * z;
  const yy = y;
  const yz = -sb * x + cb * z;
  return [yx, ca * yy - sa * yz, sa * yy + ca * yz] as [number, number, number];
}

function faceTowards(a: number, b: number, dir: [number, number, number]) {
  let best = FACES[0];
  let bestDot = -Infinity;
  for (const f of FACES) {
    const w = worldNormal(f.n, a, b);
    const dot = w[0] * dir[0] + w[1] * dir[1] + w[2] * dir[2];
    if (dot > bestDot) {
      bestDot = dot;
      best = f;
    }
  }
  return best.pips;
}

const PIP_LAYOUT: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Pips({ n }: { n: number }) {
  const on = new Set(PIP_LAYOUT[n]);
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1 p-3 w-full h-full">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`w-3 h-3 rounded-full place-self-center ${on.has(i) ? (n === 1 || n === 5 ? "bg-rose-600" : "bg-slate-900") : ""}`}
        />
      ))}
    </div>
  );
}

export function DiceLabActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<DiceState>) {
  const engine = useActivityEngine<DiceState, number>({
    initialState: { rotX: -22, rotY: 38, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (!s.touched) return undefined;
      // Only once the student has actually parked 6 on the bottom does a reading exist.
      const bottom = faceTowards(s.rotX, s.rotY, [0, 1, 0]);
      if (bottom !== 6) return undefined;
      return faceTowards(s.rotX, s.rotY, [0, -1, 0]);
    },
  });

  const { rotX, rotY } = engine.state;
  const top = faceTowards(rotX, rotY, [0, -1, 0]);
  const bottom = faceTowards(rotX, rotY, [0, 1, 0]);
  const front = faceTowards(rotX, rotY, [0, 0, 1]);

  const last = React.useRef({ x: 0, y: 0 });
  const { start, dragging } = usePointerDrag({
    disabled: engine.readOnly,
    onStart: (p) => {
      last.current = { x: p.x, y: p.y };
    },
    onMove: (p) => {
      const dx = p.x - last.current.x;
      const dy = p.y - last.current.y;
      last.current = { x: p.x, y: p.y };
      engine.update((s) => ({
        rotX: Math.max(-180, Math.min(180, s.rotX - dy * 0.7)),
        rotY: s.rotY + dx * 0.7,
        touched: true,
      }));
    },
    onEnd: () => {
      // Settle on a clean orientation so exactly one face is squarely on top
      engine.update((s) => ({
        rotX: Math.round(s.rotX / 90) * 90,
        rotY: Math.round(s.rotY / 90) * 90,
        touched: true,
      }));
    },
  });

  const nudge = (axis: "x" | "y", delta: number) =>
    engine.update((s) => ({
      rotX: axis === "x" ? Math.round(s.rotX / 90) * 90 + delta : Math.round(s.rotX / 90) * 90,
      rotY: axis === "y" ? Math.round(s.rotY / 90) * 90 + delta : Math.round(s.rotY / 90) * 90,
      touched: true,
    }));

  return (
    <ActivityShell
      icon={Box}
      title="Rotating 3D Dice Laboratory"
      howTo="Drag the die with your mouse or finger (or use the arrow pads) until face 6 rests on the bottom. Whatever lands on top becomes your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? "Top face reading" : undefined}
      pendingHint={
        engine.state.touched
          ? `Face ${bottom} is on the bottom — keep rotating until 6 is underneath.`
          : "Spin the die to start."
      }
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <Stage className="min-h-[280px] flex items-center justify-center overflow-hidden">
          <div
            onPointerDown={(e) => start(e, undefined)}
            className={`absolute inset-0 ${engine.readOnly ? "" : dragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ touchAction: "none", perspective: "900px" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="relative w-28 h-28 transition-transform duration-150 ease-out"
                style={{ transformStyle: "preserve-3d", transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }}
              >
                {FACES.map((f) => (
                  <div
                    key={f.pips}
                    className={`absolute inset-0 rounded-xl border-2 shadow-md ${
                      f.pips === bottom ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-400"
                    }`}
                    style={{ transform: f.transform, backfaceVisibility: "hidden" }}
                  >
                    <Pips n={f.pips} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-2.5 left-2.5 rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-mono text-slate-600 pointer-events-none">
            pitch {Math.round(rotX)}° · yaw {Math.round(rotY)}°
          </div>
        </Stage>

        <div className="space-y-2.5">
          <ReadOut label="On top" value={top} tone="emerald" />
          <ReadOut label="On the bottom" value={bottom} tone={bottom === 6 ? "emerald" : "slate"} />
          <ReadOut label="Facing you" value={front} />

          <div className="grid grid-cols-3 gap-1 pt-1">
            <span />
            <button type="button" disabled={engine.readOnly} onClick={() => nudge("x", 90)} className="h-11 grid place-items-center rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-100">
              <ArrowUp className="w-4 h-4" />
            </button>
            <span />
            <button type="button" disabled={engine.readOnly} onClick={() => nudge("y", -90)} className="h-11 grid place-items-center rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-100">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button type="button" disabled={engine.readOnly} onClick={() => nudge("x", -90)} className="h-11 grid place-items-center rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-100">
              <ArrowDown className="w-4 h-4" />
            </button>
            <button type="button" disabled={engine.readOnly} onClick={() => nudge("y", 90)} className="h-11 grid place-items-center rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-100">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            Position 1 showed 3, 2, 5 and Position 2 showed 1, 4, 5 — this die is built from exactly
            those two corners.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

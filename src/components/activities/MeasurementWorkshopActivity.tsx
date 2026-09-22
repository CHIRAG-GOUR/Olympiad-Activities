"use client";

import React from "react";
import { Octagon } from "lucide-react";
import { ActivityShell, Stage, ReadOut, Stepper, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q34 — Polygon diagonal workshop.
 *
 * The student sets the number of sides and then draws diagonals by tapping vertex pairs.
 * The workshop counts only genuine diagonals (never the sides), and that count is the
 * answer.
 */

interface DiagState {
  sides: number;
  drawn: string[];
  armed: number | null;
}

const key = (a: number, b: number) => [a, b].sort((x, y) => x - y).join("-");

export function MeasurementWorkshopActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<DiagState>) {
  const engine = useActivityEngine<DiagState, number>({
    initialState: { sides: 8, drawn: [], armed: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.drawn.length ? s.drawn.length : undefined),
  });

  const { sides, drawn } = engine.state;
  const pt = (i: number) => {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    return { x: 60 + 46 * Math.cos(a), y: 60 + 46 * Math.sin(a) };
  };

  const isSide = (a: number, b: number) => Math.abs(a - b) === 1 || Math.abs(a - b) === sides - 1;
  const total = (sides * (sides - 3)) / 2;

  const tap = (i: number) =>
    engine.update((s) => {
      if (s.armed === null) return { ...s, armed: i };
      if (s.armed === i) return { ...s, armed: null };
      if (isSide(s.armed, i)) return { ...s, armed: null };
      const k = key(s.armed, i);
      return { ...s, armed: null, drawn: s.drawn.includes(k) ? s.drawn.filter((x) => x !== k) : [...s.drawn, k] };
    });

  const drawAll = () => {
    const all: string[] = [];
    for (let a = 0; a < sides; a++)
      for (let b = a + 1; b < sides; b++) if (!isSide(a, b)) all.push(key(a, b));
    engine.update((s) => ({ ...s, drawn: all, armed: null }));
  };

  return (
    <ActivityShell
      icon={Octagon}
      title="Polygon Diagonal Workshop"
      howTo="Tap two non-adjacent vertices to draw a diagonal (tap it again to erase). Adjacent vertices are sides and are refused — the diagonals you draw are counted as your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `diagonals of a ${sides}-sided polygon` : undefined}
      pendingHint="Tap two vertices that are not neighbours."
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <button
          type="button"
          disabled={engine.readOnly}
          onClick={drawAll}
          className="px-3 min-h-[44px] sm:min-h-0 sm:py-1.5 rounded-lg border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-emerald-400"
        >
          Draw every diagonal
        </button>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <Stage label={`Regular ${sides}-sided polygon`}>
          <svg viewBox="0 0 120 120" className="w-full max-w-[300px] mx-auto">
            <polygon
              points={Array.from({ length: sides }, (_, i) => `${pt(i).x},${pt(i).y}`).join(" ")}
              fill="#f8fafc"
              stroke="#0f172a"
              strokeWidth={1.8}
            />
            {drawn.map((k) => {
              const [a, b] = k.split("-").map(Number);
              return <line key={k} x1={pt(a).x} y1={pt(a).y} x2={pt(b).x} y2={pt(b).y} stroke="#059669" strokeWidth={1.2} />;
            })}
            {Array.from({ length: sides }, (_, i) => (
              <circle
                key={i}
                cx={pt(i).x}
                cy={pt(i).y}
                r={5}
                fill={engine.state.armed === i ? "#059669" : "#0f172a"}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: "pointer" }}
                onClick={() => !engine.readOnly && tap(i)}
              />
            ))}
          </svg>
        </Stage>

        <div className="space-y-2">
          <Stepper label="Number of sides" value={sides} min={3} max={12} onChange={(n) => engine.update({ sides: n, drawn: [], armed: null })} readOnly={engine.readOnly} />
          <ReadOut label="Diagonals drawn" value={drawn.length} tone={drawn.length ? "emerald" : "slate"} />
          <ReadOut label="Formula n(n−3)/2" value={total} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Compare what you drew with the formula for this polygon.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

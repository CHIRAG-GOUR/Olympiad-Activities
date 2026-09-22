"use client";

import React from "react";
import { Ruler } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q21 — Quadrilateral surveyor.
 *
 * The vertices are draggable and the student draws segments by tapping two vertices. The
 * number of distinct segments actually drawn on the figure is the answer.
 */

interface SurveyState {
  pos: Record<string, { x: number; y: number }>;
  segs: string[];
  armed: string | null;
}

const V = ["A", "B", "C", "D"];
const START = {
  A: { x: 22, y: 20 },
  B: { x: 78, y: 26 },
  C: { x: 84, y: 80 },
  D: { x: 18, y: 76 },
};

const key = (a: string, b: string) => [a, b].sort().join("");

export function GeometrySurveyorActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<SurveyState>) {
  const engine = useActivityEngine<SurveyState, number>({
    initialState: { pos: START, segs: [], armed: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.segs.length ? s.segs.length : undefined),
  });

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragged = React.useRef(false);

  const { start } = usePointerDrag<string>({
    disabled: engine.readOnly,
    onStart: () => {
      dragged.current = false;
    },
    onMove: (p, id) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      dragged.current = true;
      engine.update((s) => ({
        ...s,
        pos: {
          ...s.pos,
          [id]: { x: clamp(((p.x - r.left) / r.width) * 100, 8, 92), y: clamp(((p.y - r.top) / r.height) * 100, 8, 92) },
        },
      }));
    },
  });

  const tap = (id: string) => {
    if (engine.readOnly || dragged.current) return;
    engine.update((s) => {
      if (!s.armed) return { ...s, armed: id };
      if (s.armed === id) return { ...s, armed: null };
      const k = key(s.armed, id);
      return { ...s, armed: null, segs: s.segs.includes(k) ? s.segs.filter((x) => x !== k) : [...s.segs, k] };
    });
  };

  const pos = engine.state.pos;
  const sides = ["AB", "BC", "CD", "AD"];
  const drawnSides = engine.state.segs.filter((s) => sides.includes(s)).length;
  const drawnDiagonals = engine.state.segs.filter((s) => !sides.includes(s)).length;

  return (
    <ActivityShell
      icon={Ruler}
      title="Quadrilateral Segment Surveyor"
      howTo="Drag the vertices to reshape ABCD, then tap two vertices to draw (or erase) the segment joining them. Draw every distinct segment — the surveyor counts them for you."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${drawnSides} sides + ${drawnDiagonals} diagonals` : undefined}
      pendingHint="Tap two vertices to draw your first segment."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <Stage label="Survey field">
          <svg ref={svgRef} viewBox="0 0 100 100" className="w-full max-w-[320px] mx-auto rounded-lg bg-white border border-slate-200" style={{ touchAction: "none" }}>
            {engine.state.segs.map((s) => {
              const a = pos[s[0]];
              const b = pos[s[1]];
              return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#059669" strokeWidth={1.6} strokeLinecap="round" />;
            })}
            {V.map((id) => (
              <g key={id}>
                <circle
                  cx={pos[id].x}
                  cy={pos[id].y}
                  r={7}
                  fill="transparent"
                  style={{ cursor: "grab" }}
                  onPointerDown={(e) => start(e as unknown as React.PointerEvent, id)}
                  onClick={() => tap(id)}
                />
                <circle
                  cx={pos[id].x}
                  cy={pos[id].y}
                  r={3}
                  fill={engine.state.armed === id ? "#059669" : "#0f172a"}
                  stroke="#fff"
                  strokeWidth={1.2}
                  pointerEvents="none"
                />
                <text x={pos[id].x + 4.5} y={pos[id].y - 4} fontSize={6} fontWeight="bold" fill="#0f172a" pointerEvents="none">
                  {id}
                </text>
              </g>
            ))}
          </svg>
          <p className="text-[10px] text-slate-500 text-center mt-1">
            Tap a vertex to arm it, then tap another to join them.
          </p>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Segments drawn" value={engine.state.segs.length} tone={engine.state.segs.length ? "emerald" : "slate"} />
          <ReadOut label="Sides" value={drawnSides} />
          <ReadOut label="Diagonals" value={drawnDiagonals} />
          <div className="flex flex-wrap gap-1">
            {engine.state.segs.map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                {s[0]}–{s[1]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}

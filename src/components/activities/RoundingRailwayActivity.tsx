"use client";

import React from "react";
import { TrainTrack } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q18 — Rounding railway.
 *
 * Two number lines with draggable carriages. Each carriage snaps to a thousand-marker, and
 * the difference between the two stations the student parks at is the answer.
 */

interface RailState {
  a: number | null;
  b: number | null;
}

const LINES = [
  { id: "a" as const, exact: 789562, min: 785000, max: 794000 },
  { id: "b" as const, exact: 435821, min: 431000, max: 440000 },
];

export function RoundingRailwayActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<RailState>) {
  const engine = useActivityEngine<RailState, number>({
    initialState: { a: null, b: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.a !== null && s.b !== null ? s.a - s.b : undefined),
  });

  const refs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const { start } = usePointerDrag<"a" | "b">({
    disabled: engine.readOnly,
    onStart: (p, id) => place(p.x, id),
    onMove: (p, id) => place(p.x, id),
  });

  function place(clientX: number, id: "a" | "b") {
    const line = LINES.find((l) => l.id === id)!;
    const r = refs.current[id]?.getBoundingClientRect();
    if (!r) return;
    const frac = clamp((clientX - r.left) / r.width, 0, 1);
    const raw = line.min + frac * (line.max - line.min);
    engine.patch({ [id]: Math.round(raw / 1000) * 1000 } as Partial<RailState>);
  }

  return (
    <ActivityShell
      icon={TrainTrack}
      title="Rounding Railway"
      howTo="Drag each carriage along its track and park it at the nearest thousand-station for that number. The gap between the two stations is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${engine.state.a} − ${engine.state.b}` : undefined}
      pendingHint="Park both carriages on a thousand-station."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <div className="space-y-3">
          {LINES.map((line) => {
            const parked = engine.state[line.id];
            const stations: number[] = [];
            for (let v = line.min; v <= line.max; v += 1000) stations.push(v);
            const fracOf = (v: number) => (v - line.min) / (line.max - line.min);
            return (
              <Stage key={line.id} label={`Track ${line.id.toUpperCase()} — exact value ${line.exact.toLocaleString("en-IN")}`}>
                <div
                  ref={(el) => {
                    refs.current[line.id] = el;
                  }}
                  onPointerDown={(e) => start(e, line.id)}
                  className="relative h-[74px] cursor-pointer"
                  style={{ touchAction: "none" }}
                >
                  <div className="absolute left-0 right-0 top-[40px] h-1.5 bg-slate-300 rounded-full" />
                  {stations.map((v) => (
                    <div key={v} className="absolute -translate-x-1/2 top-[34px]" style={{ left: `${fracOf(v) * 100}%` }}>
                      <div className={`w-0.5 h-4 mx-auto ${parked === v ? "bg-emerald-600" : "bg-slate-400"}`} />
                      <span className={`block mt-1 text-[9px] font-mono ${parked === v ? "text-emerald-700 font-black" : "text-slate-400"}`}>
                        {(v / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
                  {/* exact value flag */}
                  <div className="absolute -translate-x-1/2 top-0" style={{ left: `${fracOf(line.exact) * 100}%` }}>
                    <span className="block text-[9px] font-mono font-bold text-rose-600 whitespace-nowrap">
                      {line.exact.toLocaleString("en-IN")}
                    </span>
                    <div className="w-0.5 h-5 bg-rose-500 mx-auto" />
                  </div>
                  {parked !== null && (
                    <div className="absolute -translate-x-1/2 top-[26px] transition-all" style={{ left: `${fracOf(parked) * 100}%` }}>
                      <div className="w-9 h-7 rounded bg-emerald-600 border-2 border-emerald-800 grid place-items-center text-white text-[9px] font-black">
                        {line.id.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
              </Stage>
            );
          })}
        </div>

        <div className="space-y-2">
          <ReadOut label="Rounded A" value={engine.state.a?.toLocaleString("en-IN") ?? "—"} />
          <ReadOut label="Rounded B" value={engine.state.b?.toLocaleString("en-IN") ?? "—"} />
          <ReadOut
            label="Estimated difference"
            value={engine.answer?.toLocaleString("en-IN") ?? "—"}
            tone={engine.answer !== undefined ? "emerald" : "slate"}
          />
        </div>
      </div>
    </ActivityShell>
  );
}

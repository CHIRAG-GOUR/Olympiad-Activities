"use client";

import React from "react";
import { Timer } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q41 — Exercise session timeline.
 *
 * Two draggable markers on a real 24-hour timeline. The stopwatch measures the span the
 * student brackets, in minutes, and that measurement is the answer.
 */

interface TimeState {
  start: number | null; // minutes from 00:00
  end: number | null;
}

const DAY = 24 * 60;
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function GymTimeActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<TimeState>) {
  const engine = useActivityEngine<TimeState, number>({
    initialState: { start: null, end: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.start !== null && s.end !== null && s.end > s.start ? s.end - s.start : undefined),
  });

  const railRef = React.useRef<HTMLDivElement | null>(null);

  const setMarker = (clientX: number, which: "start" | "end") => {
    const r = railRef.current?.getBoundingClientRect();
    if (!r) return;
    const frac = clamp((clientX - r.left) / r.width, 0, 1);
    engine.patch({ [which]: Math.round(frac * DAY) } as Partial<TimeState>);
  };

  const { start } = usePointerDrag<"start" | "end">({
    disabled: engine.readOnly,
    onStart: (p, which) => setMarker(p.x, which),
    onMove: (p, which) => setMarker(p.x, which),
  });

  const s = engine.state;
  const fracOf = (m: number) => (m / DAY) * 100;
  const exact = s.start === 18 * 60 + 25 && s.end === 19 * 60 + 52;

  return (
    <ActivityShell
      icon={Timer}
      title="Exercise Session Timeline"
      howTo="Drag the green start marker and the red finish marker onto the timeline at the times Puneet began and ended. The stopwatch reads the span in minutes."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${fmt(s.start as number)} to ${fmt(s.end as number)}` : undefined}
      pendingHint="Place both markers, with the finish after the start."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <Stage label="24-hour clock line — he began at 18:25 and finished at 19:52">
          <div ref={railRef} className="relative h-[92px]" style={{ touchAction: "none" }}>
            <div className="absolute left-0 right-0 top-[44px] h-2 rounded-full bg-slate-200" />
            {s.start !== null && s.end !== null && s.end > s.start && (
              <div
                className="absolute top-[44px] h-2 rounded-full bg-emerald-500"
                style={{ left: `${fracOf(s.start)}%`, width: `${fracOf(s.end - s.start)}%` }}
              />
            )}
            {Array.from({ length: 13 }, (_, i) => i * 2).map((h) => (
              <div key={h} className="absolute -translate-x-1/2 top-[54px] text-[9px] font-mono text-slate-400" style={{ left: `${(h / 24) * 100}%` }}>
                {String(h).padStart(2, "0")}
              </div>
            ))}
            {(["start", "end"] as const).map((which) => {
              const v = s[which];
              return (
                <div
                  key={which}
                  onPointerDown={(e) => start(e, which)}
                  className={`absolute -translate-x-1/2 cursor-ew-resize ${which === "start" ? "top-[8px]" : "top-[68px]"}`}
                  style={{ left: `${v === null ? (which === "start" ? 4 : 96) : fracOf(v)}%`, touchAction: "none" }}
                >
                  <div
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-black text-white ${
                      which === "start" ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  >
                    {v === null ? (which === "start" ? "start" : "finish") : fmt(v)}
                  </div>
                  <div className={`w-0.5 h-7 mx-auto ${which === "start" ? "bg-emerald-600" : "bg-rose-600"}`} />
                </div>
              );
            })}
          </div>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Started" value={s.start === null ? "—" : fmt(s.start)} tone="emerald" />
          <ReadOut label="Finished" value={s.end === null ? "—" : fmt(s.end)} tone="rose" />
          <ReadOut
            label="Stopwatch"
            value={engine.answer === undefined ? "—" : `${engine.answer} min`}
            tone={exact ? "emerald" : "slate"}
          />
          <p className="text-[10px] text-slate-500 leading-snug">
            The answer is wanted in minutes, not hours and minutes.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

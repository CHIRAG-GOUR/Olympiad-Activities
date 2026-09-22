"use client";

import React from "react";
import { Footprints } from "lucide-react";
import { ActivityShell, Stage, ReadOut, ValueSlider, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q45 — Step synchroniser.
 *
 * Three athletes march along a shared track, each with their own stride. The student slides
 * the finish line until all three land on it with a whole number of steps; the distance the
 * finish line is standing at is the answer.
 */

interface StepState {
  distance: number | null;
}

const ATHLETES = [
  { name: "Athlete A", stride: 50, colour: "#0284c7" },
  { name: "Athlete B", stride: 75, colour: "#059669" },
  { name: "Athlete C", stride: 90, colour: "#d97706" },
];

const MAX = 1000;

export function StepSyncActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<StepState>) {
  const engine = useActivityEngine<StepState, number>({
    initialState: { distance: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => s.distance ?? undefined,
  });

  const d = engine.state.distance ?? 0;
  const landed = ATHLETES.map((a) => d > 0 && d % a.stride === 0);
  const allLanded = landed.every(Boolean) && d > 0;

  return (
    <ActivityShell
      icon={Footprints}
      title="Step Synchroniser"
      howTo="Slide the finish line along the track. Each athlete's footprints are drawn at their real stride — stop where all three land exactly on the line."
      answerText={engine.answer !== undefined && engine.answer > 0 ? String(engine.answer) : undefined}
      mappedTo={allLanded ? "all three land in complete steps" : engine.answer ? "not every athlete lands here" : undefined}
      pendingHint="Slide the finish line to a distance."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_210px]">
        <Stage label="Shared track (cm)">
          <div className="relative space-y-2.5 pt-4">
            {/* finish line */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10" style={{ left: `${(d / MAX) * 100}%` }}>
              <span className="absolute -top-0 -translate-x-1/2 px-1.5 rounded bg-rose-500 text-white text-[9px] font-black font-mono whitespace-nowrap">
                {d} cm
              </span>
            </div>

            {ATHLETES.map((a, i) => {
              const steps = Math.floor(d / a.stride);
              return (
                <div key={a.name}>
                  <div className="flex items-baseline justify-between text-[10px] font-bold">
                    <span className="text-slate-700">
                      {a.name} — stride {a.stride} cm
                    </span>
                    <span className={landed[i] ? "text-emerald-700 font-black" : "text-slate-400"}>
                      {steps} complete steps{landed[i] ? " — lands exactly" : ""}
                    </span>
                  </div>
                  <div className="relative h-5 rounded bg-slate-100 border border-slate-200 overflow-hidden">
                    {Array.from({ length: Math.floor(MAX / a.stride) }, (_, k) => {
                      const pos = ((k + 1) * a.stride) / MAX;
                      const reached = (k + 1) * a.stride <= d;
                      return (
                        <span
                          key={k}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-3 rounded-sm"
                          style={{ left: `${pos * 100}%`, background: reached ? a.colour : "#cbd5e1" }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Stage>

        <div className="space-y-2">
          <ValueSlider
            label="Finish line distance"
            value={d}
            min={0}
            max={MAX}
            step={5}
            unit="cm"
            onChange={(v) => engine.update({ distance: v })}
            readOnly={engine.readOnly}
          />
          <ReadOut label="All three land?" value={allLanded ? "Yes" : "No"} tone={allLanded ? "emerald" : "slate"} />
          <ReadOut label="Distance" value={engine.answer === undefined ? "—" : `${engine.answer} cm`} tone={allLanded ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Find the shortest distance where nobody has to take part of a step.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

"use client";

import React from "react";
import { Flag } from "lucide-react";
import { ActivityShell, Stage, ReadOut, Stepper, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q38 — Two-track lap race.
 *
 * The student sends each runner round her own track. Every lap adds that track's real
 * perimeter, and the gap between the two distance counters is the answer.
 */

interface RaceState {
  rashi: number;
  kirti: number;
  touched: boolean;
}

const RASHI = { w: 52, h: 30, perimeter: 2 * (52 + 30) };
const KIRTI = { side: 65, perimeter: 4 * 65 };

export function FieldRaceActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<RaceState>) {
  const engine = useActivityEngine<RaceState, number>({
    initialState: { rashi: 0, kirti: 0, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) =>
      s.touched && s.rashi > 0 && s.kirti > 0
        ? Math.abs(s.kirti * KIRTI.perimeter - s.rashi * RASHI.perimeter)
        : undefined,
  });

  const { rashi, kirti } = engine.state;
  const dR = rashi * RASHI.perimeter;
  const dK = kirti * KIRTI.perimeter;

  const Track = ({
    name,
    laps,
    distance,
    shape,
    colour,
  }: {
    name: string;
    laps: number;
    distance: number;
    shape: React.ReactNode;
    colour: string;
  }) => (
    <div className="flex-1 text-center">
      <svg viewBox="0 0 120 90" className="w-full max-w-[160px] mx-auto">
        {shape}
        {laps > 0 && (
          <circle r={5} fill={colour}>
            <animateMotion dur={`${Math.max(1.2, 4 / laps)}s`} repeatCount="indefinite" path="M20,18 H100 V72 H20 Z" />
          </circle>
        )}
      </svg>
      <div className="text-xs font-black text-slate-900">{name}</div>
      <div className="font-mono text-sm font-black" style={{ color: colour }}>
        {distance} m
      </div>
    </div>
  );

  return (
    <ActivityShell
      icon={Flag}
      title="Two-Track Lap Race"
      howTo="Send each runner round her track with the lap counters. Every lap adds that track's real perimeter — the gap between the two distance readings is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${dK > dR ? "Kirti" : "Rashi"} ran further by this much` : undefined}
      pendingHint="Give both runners at least one lap."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <Stage label="Running tracks">
          <div className="flex gap-3">
            <Track
              name={`Rashi — ${RASHI.w} m × ${RASHI.h} m rectangle`}
              laps={rashi}
              distance={dR}
              colour="#0284c7"
              shape={<rect x={20} y={18} width={80} height={54} fill="none" stroke="#94a3b8" strokeWidth={3} rx={3} />}
            />
            <Track
              name={`Kirti — ${KIRTI.side} m square`}
              laps={kirti}
              distance={dK}
              colour="#059669"
              shape={<rect x={27} y={13} width={66} height={66} fill="none" stroke="#94a3b8" strokeWidth={3} rx={3} />}
            />
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[10px] font-mono font-bold text-slate-500">
            <span>Rashi lap = {RASHI.perimeter} m</span>
            <span>Kirti lap = {KIRTI.perimeter} m</span>
          </div>
        </Stage>

        <div className="space-y-2">
          <Stepper label="Rashi's laps" value={rashi} min={0} max={12} onChange={(v) => engine.update((s) => ({ ...s, rashi: v, touched: true }))} readOnly={engine.readOnly} />
          <Stepper label="Kirti's laps" value={kirti} min={0} max={12} onChange={(v) => engine.update((s) => ({ ...s, kirti: v, touched: true }))} readOnly={engine.readOnly} />
          <ReadOut label="Distance gap" value={engine.answer === undefined ? "—" : `${engine.answer} m`} tone={engine.answer !== undefined ? "emerald" : "slate"} />
        </div>
      </div>
    </ActivityShell>
  );
}

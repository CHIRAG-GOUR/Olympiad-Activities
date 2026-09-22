"use client";

import React from "react";
import { PackagePlus } from "lucide-react";
import { ActivityShell, Stage, ReadOut, Stepper, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q36 — Carton weighing platform.
 *
 * Twelve cartons weigh 180 kg, so the platform gives each carton its real 15 kg. The
 * student loads cartons until the display reaches the target load; the number of cartons
 * standing on the platform is the answer.
 */

interface LoadState {
  cartons: number | null;
}

const PER_CARTON = 180 / 12;
const TARGET = 225;

export function PocketMoneyActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<LoadState>) {
  const engine = useActivityEngine<LoadState, number>({
    initialState: { cartons: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => s.cartons ?? undefined,
  });

  const n = engine.state.cartons ?? 0;
  const weight = Number((n * PER_CARTON).toFixed(2));
  const exact = weight === TARGET;

  return (
    <ActivityShell
      icon={PackagePlus}
      title="Carton Weighing Platform"
      howTo="Tap a carton to load it, or use the counter. Each carton puts its real weight on the scale — load until the display reads the target and your carton count is the answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${weight} kg on the platform` : undefined}
      pendingHint="Load at least one carton onto the platform."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <Stage label={`Reference: 12 cartons = 180 kg, so 1 carton = ${PER_CARTON} kg`}>
          <div className="flex flex-wrap gap-1.5 min-h-[112px] content-start p-2 rounded-lg bg-white border border-slate-200">
            {Array.from({ length: 24 }, (_, i) => {
              const loaded = i < n;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={engine.readOnly}
                  onClick={() => engine.update({ cartons: loaded ? i : i + 1 })}
                  className={`w-10 h-10 rounded border-2 grid place-items-center text-[9px] font-black transition ${
                    loaded ? "bg-amber-200 border-amber-600 text-amber-900" : "bg-slate-50 border-dashed border-slate-300 text-slate-300"
                  }`}
                >
                  {PER_CARTON}kg
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl border-4 border-slate-700 bg-slate-900 px-4 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform reading</div>
            <div className={`font-mono text-3xl font-black tabular-nums ${exact ? "text-emerald-400" : "text-amber-300"}`}>
              {weight.toFixed(2)} kg
            </div>
            <div className="text-[10px] font-mono text-slate-400">target {TARGET} kg</div>
          </div>
        </Stage>

        <div className="space-y-2">
          <Stepper label="Cartons on the platform" value={n} min={0} max={24} onChange={(v) => engine.update({ cartons: v })} readOnly={engine.readOnly} />
          <ReadOut label="Cartons" value={engine.answer ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
          <ReadOut label="Load" value={`${weight.toFixed(2)} kg`} tone={exact ? "emerald" : "slate"} />
        </div>
      </div>
    </ActivityShell>
  );
}

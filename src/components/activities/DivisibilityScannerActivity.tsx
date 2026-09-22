"use client";

import React from "react";
import { Rocket } from "lucide-react";
import { ActivityShell, Stage, ReadOut, ValueSlider, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q35 — Orbital launch simulation.
 *
 * The student sets the launch velocity and fires. The rocket climbs under a real
 * velocity-to-altitude model and the altitude it reaches is shown against the target band.
 * The velocity actually flown is the answer.
 */

interface LaunchState {
  velocity: number;
  flown: number | null; // the velocity of the last completed flight
}

const ALT_PER_MS = 0.1; // 2500 m/s reaches 250 km

export function DivisibilityScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<LaunchState>) {
  const cfg = question?.simulationConfig;
  const min = cfg?.minVal ?? 500;
  const max = cfg?.maxVal ?? 3500;
  const step = cfg?.step ?? 50;

  const engine = useActivityEngine<LaunchState, number>({
    initialState: { velocity: cfg?.defaultVal ?? 1500, flown: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => s.flown ?? undefined,
  });

  const [progress, setProgress] = React.useState(0);
  const raf = React.useRef<number | null>(null);
  const flying = React.useRef(false);

  // Always cancel the animation when this question unmounts
  React.useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    []
  );

  const launch = () => {
    if (engine.readOnly || flying.current) return;
    flying.current = true;
    const startedAt = performance.now();
    const target = engine.state.velocity;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / 1400);
      setProgress(t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else {
        flying.current = false;
        engine.update((s) => ({ ...s, flown: target }));
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const s = engine.state;
  const altitude = Math.round(s.velocity * ALT_PER_MS);
  const flownAltitude = s.flown === null ? null : Math.round(s.flown * ALT_PER_MS);
  const targetMin = cfg?.targetCondition.minSuccessValue ?? 2450;
  const targetMax = cfg?.targetCondition.maxSuccessValue ?? 2550;
  const inOrbit = s.flown !== null && s.flown >= targetMin && s.flown <= targetMax;
  const climb = (progress * altitude) / 350;

  return (
    <ActivityShell
      icon={Rocket}
      title="Orbital Launch Simulator"
      howTo="Set the launch velocity, then fire. The rocket climbs to the altitude that velocity produces — the velocity you actually fly is submitted as your answer."
      answerText={s.flown !== null ? `${s.flown} ${cfg?.parameterUnit ?? "m/s"}` : undefined}
      mappedTo={flownAltitude !== null ? `reached ${flownAltitude} km` : undefined}
      pendingHint="Set a velocity and press Launch."
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <button
          type="button"
          disabled={engine.readOnly}
          onClick={launch}
          className="px-4 min-h-[44px] sm:min-h-0 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition"
        >
          Launch
        </button>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <Stage label="Launch range">
          <div className="relative h-[240px] rounded-lg bg-gradient-to-b from-slate-900 via-sky-900 to-sky-200 overflow-hidden">
            {/* target orbital band */}
            <div
              className="absolute inset-x-0 border-y-2 border-dashed border-emerald-400/80 bg-emerald-400/10"
              style={{ bottom: `${(250 / 350) * 100}%`, height: "6%" }}
            >
              <span className="absolute right-1 -top-4 text-[9px] font-mono font-bold text-emerald-300">250 km target orbit</span>
            </div>

            <div
              className="absolute left-1/2 -translate-x-1/2 transition-none"
              style={{ bottom: `calc(${Math.min(1, climb) * 88}% + 8px)` }}
            >
              <Rocket className="w-7 h-7 text-white rotate-45" />
              {progress > 0 && progress < 1 && <div className="w-1.5 h-6 mx-auto bg-gradient-to-b from-amber-400 to-transparent rounded-full" />}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-3 bg-slate-700" />
            {s.flown !== null && progress >= 1 && (
              <div className={`absolute top-2 left-2 rounded-lg px-2 py-1 text-[10px] font-black ${inOrbit ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                {inOrbit ? "Stable orbit achieved" : `Off target at ${flownAltitude} km`}
              </div>
            )}
          </div>
        </Stage>

        <div className="space-y-3">
          <ValueSlider
            label={cfg?.parameterName ?? "Launch velocity"}
            value={s.velocity}
            min={min}
            max={max}
            step={step}
            unit={cfg?.parameterUnit ?? "m/s"}
            onChange={(v) => engine.update((st) => ({ ...st, velocity: v }))}
            readOnly={engine.readOnly}
          />
          <ReadOut label="Predicted altitude" value={`${altitude} km`} />
          <ReadOut label="Velocity flown" value={s.flown === null ? "—" : `${s.flown} m/s`} tone={s.flown !== null ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            {cfg?.targetCondition.description ?? "Reach a stable 250 km orbit."}
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

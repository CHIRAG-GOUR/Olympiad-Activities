"use client";

import React from "react";
import { Thermometer } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q39 — Twin thermometer station.
 *
 * The student drags the mercury in both thermometers to the recorded temperatures. The
 * station measures the real gap between the two columns, and that gap is the answer.
 */

interface WeatherState {
  manali: number | null;
  jaipur: number | null;
}

const MIN = -20;
const MAX = 40;

export function WeatherStationActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<WeatherState>) {
  const engine = useActivityEngine<WeatherState, number>({
    initialState: { manali: null, jaipur: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.manali !== null && s.jaipur !== null ? s.jaipur - s.manali : undefined),
  });

  const refs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const { start } = usePointerDrag<"manali" | "jaipur">({
    disabled: engine.readOnly,
    onStart: (p, id) => setTemp(p.y, id),
    onMove: (p, id) => setTemp(p.y, id),
  });

  function setTemp(clientY: number, id: "manali" | "jaipur") {
    const r = refs.current[id]?.getBoundingClientRect();
    if (!r) return;
    const frac = clamp(1 - (clientY - r.top) / r.height, 0, 1);
    engine.patch({ [id]: Math.round(MIN + frac * (MAX - MIN)) } as Partial<WeatherState>);
  }

  const Tube = ({ id, city, target }: { id: "manali" | "jaipur"; city: string; target: number }) => {
    const t = engine.state[id];
    const frac = t === null ? 0 : (t - MIN) / (MAX - MIN);
    const set = t === target;
    return (
      <div className="flex-1 flex flex-col items-center gap-1.5">
        <div className="text-xs font-black text-slate-900">{city}</div>
        <div className="text-[10px] font-mono text-slate-500">recorded {target}°C</div>
        <div
          ref={(el) => {
            refs.current[id] = el;
          }}
          onPointerDown={(e) => start(e, id)}
          className={`relative w-9 h-[170px] rounded-full border-4 bg-white cursor-ns-resize overflow-hidden ${set ? "border-emerald-500" : "border-slate-300"}`}
          style={{ touchAction: "none" }}
        >
          <div
            className={`absolute inset-x-0 bottom-0 ${t !== null && t < 0 ? "bg-sky-500" : "bg-rose-500"}`}
            style={{ height: `${frac * 100}%` }}
          />
          {/* freezing mark */}
          <div className="absolute inset-x-0 border-t border-dashed border-slate-400" style={{ bottom: `${((0 - MIN) / (MAX - MIN)) * 100}%` }} />
        </div>
        <div className={`font-mono text-lg font-black ${set ? "text-emerald-700" : "text-slate-800"}`}>
          {t === null ? "—" : `${t}°C`}
        </div>
      </div>
    );
  };

  return (
    <ActivityShell
      icon={Thermometer}
      title="Twin Thermometer Station"
      howTo="Drag the mercury in each thermometer to the temperature recorded for that city. The station measures the gap between the two columns as your answer."
      answerText={engine.answer !== undefined ? `${engine.answer}` : undefined}
      mappedTo={engine.answer !== undefined ? `${engine.state.jaipur}°C − (${engine.state.manali}°C)` : undefined}
      pendingHint="Set both thermometers by dragging the mercury."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <Stage label="December readings">
          <div className="flex gap-6 justify-center py-1">
            <Tube id="manali" city="Manali" target={-8} />
            <Tube id="jaipur" city="Jaipur" target={23} />
          </div>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Manali" value={engine.state.manali === null ? "—" : `${engine.state.manali}°C`} tone="sky" />
          <ReadOut label="Jaipur" value={engine.state.jaipur === null ? "—" : `${engine.state.jaipur}°C`} tone="rose" />
          <ReadOut label="Temperature gap" value={engine.answer === undefined ? "—" : `${engine.answer}°C`} tone={engine.answer !== undefined ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Count the whole way across the freezing mark, not just the warm side.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

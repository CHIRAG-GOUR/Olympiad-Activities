"use client";

import React from "react";
import { Scale3d } from "lucide-react";
import { ActivityShell, Stage, ReadOut, ValueSlider, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q47 — Fulcrum torque simulator.
 *
 * The student loads the right arm and releases the beam. The tilt is computed from real
 * torques, and the load actually released on the beam is the answer.
 */

interface TorqueState {
  load: number;
  released: number | null;
}

const LEFT_FORCE = 18;
const LEFT_ARM = 2;
const RIGHT_ARM = 3;

export function InspectionDroneActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<TorqueState>) {
  const cfg = question?.simulationConfig;

  const engine = useActivityEngine<TorqueState, number>({
    initialState: { load: cfg?.defaultVal ?? 6, released: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => s.released ?? undefined,
  });

  const s = engine.state;
  const leftTorque = LEFT_FORCE * LEFT_ARM;
  const rightTorque = (s.released ?? s.load) * RIGHT_ARM;
  const tilt = s.released === null ? 0 : Math.max(-14, Math.min(14, (leftTorque - rightTorque) / 4));
  const balanced = s.released !== null && leftTorque === rightTorque;

  return (
    <ActivityShell
      icon={Scale3d}
      title="Fulcrum Torque Simulator"
      howTo="Set the counterweight on the right arm, then release the beam. The tilt comes from the real torques — the load you release is submitted as your answer."
      answerText={s.released !== null ? String(s.released) : undefined}
      mappedTo={s.released !== null ? `right torque ${rightTorque} N·m vs left ${leftTorque} N·m` : undefined}
      pendingHint="Set a counterweight and press Release beam."
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <button
          type="button"
          disabled={engine.readOnly}
          onClick={() => engine.patch({ released: s.load })}
          className="px-4 min-h-[44px] sm:min-h-0 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black"
        >
          Release beam
        </button>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <Stage label="Torque bench">
          <svg viewBox="0 0 340 170" className="w-full max-w-[440px] mx-auto">
            <polygon points="170,132 148,152 192,152" fill="#475569" />
            <line x1={170} y1={52} x2={170} y2={132} stroke="#475569" strokeWidth={5} />

            <g transform={`rotate(${tilt} 170 52)`}>
              <line x1={50} y1={52} x2={290} y2={52} stroke="#0f172a" strokeWidth={7} strokeLinecap="round" />
              {/* left load 18 N at 2.0 m */}
              <line x1={90} y1={52} x2={90} y2={80} stroke="#94a3b8" strokeWidth={2.5} />
              <rect x={66} y={80} width={48} height={30} rx={4} fill="#e0f2fe" stroke="#0284c7" strokeWidth={2.5} />
              <text x={90} y={100} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#075985" fontFamily="monospace">
                18 N
              </text>
              {/* right counterweight at 3.0 m */}
              <line x1={260} y1={52} x2={260} y2={80} stroke="#94a3b8" strokeWidth={2.5} />
              <rect x={232} y={80} width={56} height={30} rx={4} fill={balanced ? "#d1fae5" : "#fef3c7"} stroke={balanced ? "#059669" : "#d97706"} strokeWidth={2.5} />
              <text x={260} y={100} textAnchor="middle" fontSize={12} fontWeight="bold" fill={balanced ? "#065f46" : "#92400e"} fontFamily="monospace">
                {s.released ?? s.load} N
              </text>
            </g>

            <text x={90} y={26} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="monospace">2.0 m arm</text>
            <text x={260} y={26} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="monospace">3.0 m arm</text>
            {s.released !== null && (
              <text x={170} y={168} textAnchor="middle" fontSize={11} fontWeight="bold" fill={balanced ? "#059669" : "#b45309"}>
                {balanced ? "Beam level at 0° — equilibrium" : `Beam tilts ${tilt > 0 ? "left" : "right"}`}
              </text>
            )}
          </svg>
        </Stage>

        <div className="space-y-3">
          <ValueSlider
            label={cfg?.parameterName ?? "Right counterweight"}
            value={s.load}
            min={cfg?.minVal ?? 2}
            max={cfg?.maxVal ?? 24}
            step={cfg?.step ?? 1}
            unit={cfg?.parameterUnit ?? "kg (N)"}
            onChange={(v) => engine.update((st) => ({ ...st, load: v }))}
            readOnly={engine.readOnly}
          />
          <ReadOut label="Left torque" value={`${leftTorque} N·m`} tone="sky" />
          <ReadOut label="Right torque" value={`${(s.released ?? s.load) * RIGHT_ARM} N·m`} tone={balanced ? "emerald" : "slate"} />
          <ReadOut label="Load released" value={s.released ?? "—"} tone={s.released !== null ? "emerald" : "slate"} />
        </div>
      </div>
    </ActivityShell>
  );
}

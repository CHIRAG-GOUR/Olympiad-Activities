"use client";

import React from "react";
import { Spline } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q27 — Line grid inspector.
 *
 * Three parallel rails crossed by four transversals. The student taps every crossing to tally
 * intersecting pairs and taps the parallel bands to tally parallel pairs. The running
 * difference on the inspector panel is the answer.
 */

interface TrackState {
  crossings: string[];
  parallels: string[];
  touched: boolean;
}

const RAILS = [30, 70, 110];
const TRANSVERSALS = [40, 90, 150, 200];
const PARALLEL_PAIRS = ["0-1", "1-2", "0-2"];

export function TrackInspectorActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<TrackState>) {
  const engine = useActivityEngine<TrackState, number>({
    initialState: { crossings: [], parallels: [], touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.touched ? new Set(s.crossings).size - new Set(s.parallels).size : undefined),
  });

  const crossings = new Set(engine.state.crossings);
  const parallels = new Set(engine.state.parallels);

  const toggle = (key: "crossings" | "parallels", id: string) =>
    engine.update((s) => {
      const next = new Set(s[key]);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...s, [key]: Array.from(next), touched: true };
    });

  return (
    <ActivityShell
      icon={Spline}
      title="Line Grid Inspector"
      howTo="Tap each crossing dot to log an intersecting pair, and tap a parallel band to log a parallel pair. The inspector subtracts one tally from the other — that difference is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${crossings.size} intersecting − ${parallels.size} parallel` : undefined}
      pendingHint="Start tapping the crossings on the grid."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <Stage label="3 parallel rails · 4 transversals">
          <svg viewBox="0 0 240 150" className="w-full rounded-lg bg-white border border-slate-200">
            {RAILS.map((y) => (
              <line key={y} x1={8} y1={y} x2={232} y2={y} stroke="#94a3b8" strokeWidth={2.5} />
            ))}
            {TRANSVERSALS.map((x) => (
              <line key={x} x1={x - 18} y1={12} x2={x + 18} y2={138} stroke="#cbd5e1" strokeWidth={2.5} />
            ))}

            {/* Parallel bands — tap the gap between two rails */}
            {PARALLEL_PAIRS.map((p, i) => {
              const [a, b] = p.split("-").map(Number);
              const y = (RAILS[a] + RAILS[b]) / 2;
              return (
                <g key={p} onClick={() => !engine.readOnly && toggle("parallels", p)} style={{ cursor: "pointer" }}>
                  <rect x={6} y={y - 7} width={20 + i * 6} height={14} rx={7} fill={parallels.has(p) ? "#059669" : "#e2e8f0"} />
                  <text x={16 + i * 3} y={y + 4} textAnchor="middle" fontSize={8} fontWeight="bold" fill={parallels.has(p) ? "#fff" : "#64748b"}>
                    ∥
                  </text>
                </g>
              );
            })}

            {/* Crossing dots */}
            {RAILS.map((y, ri) =>
              TRANSVERSALS.map((x, ti) => {
                const cx = x - 18 + ((y - 12) / 126) * 36;
                const id = `r${ri}t${ti}`;
                return (
                  <circle
                    key={id}
                    cx={cx}
                    cy={y}
                    r={6}
                    fill={crossings.has(id) ? "#059669" : "#ffffff"}
                    stroke={crossings.has(id) ? "#065f46" : "#94a3b8"}
                    strokeWidth={2}
                    style={{ cursor: "pointer" }}
                    onClick={() => !engine.readOnly && toggle("crossings", id)}
                  />
                );
              })
            )}
          </svg>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Intersecting pairs" value={crossings.size} tone="emerald" />
          <ReadOut label="Parallel pairs" value={parallels.size} tone="sky" />
          <ReadOut label="Difference" value={engine.answer ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Log each crossing once, then subtract the parallel pairs you find.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

"use client";

import React from "react";
import { TrendingDown } from "lucide-react";
import { ActivityShell, Stage, ReorderList, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q31 — Integer altitude trail.
 *
 * The student drags the integer markers along the trail. The altitude profile redraws from
 * the order they build, and that order is the submitted answer.
 */

interface TrailState {
  order: string[];
  touched: boolean;
}

const VALUE: Record<string, number> = { i49: 49, i38: 38, i20: 20, in10: -10, in25: -25 };

export function NumberTrailActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<TrailState>) {
  const items = React.useMemo(
    () => (question?.orderingConfig?.items || []).map((i) => ({ id: i.id, label: i.label })),
    [question]
  );

  const initial = React.useMemo(() => {
    const ids = (question?.orderingConfig?.items || []).map((i) => i.id);
    return [3, 0, 4, 1, 2].filter((n) => n < ids.length).map((n) => ids[n]);
  }, [question]);

  const engine = useActivityEngine<TrailState, string[]>({
    initialState: { order: initial, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    deriveStateFromValue: (v) => (Array.isArray(v) ? { order: v, touched: true } : undefined),
    resolve: (s) => (s.touched ? s.order : undefined),
  });

  const values = engine.state.order.map((id) => VALUE[id] ?? 0);
  const descending = values.every((v, i) => i === 0 || v < values[i - 1]);

  return (
    <ActivityShell
      icon={TrendingDown}
      title="Mountain-to-Valley Integer Trail"
      howTo="Drag the integer markers so the trail falls from the highest peak down to the deepest valley. The profile redraws as you move them."
      answerText={engine.answer ? values.join(", ") : undefined}
      mappedTo={engine.answer ? (descending ? "Strictly descending trail" : "Trail as arranged") : undefined}
      pendingHint="Move at least one marker to set your trail order."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
        <ReorderList
          items={items}
          order={engine.state.order}
          onReorder={(order) => engine.update({ order, touched: true })}
          readOnly={engine.readOnly}
          renderMeta={(id) => (
            <span className={`font-mono text-[11px] font-black ${VALUE[id] < 0 ? "text-rose-600" : "text-emerald-700"}`}>
              {VALUE[id] > 0 ? "+" : ""}
              {VALUE[id]}
            </span>
          )}
        />

        <Stage label="Altitude profile">
          <svg viewBox="0 0 200 140" className="w-full">
            <line x1={0} y1={70} x2={200} y2={70} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={2} y={66} fontSize={8} fill="#94a3b8" fontFamily="monospace">sea level</text>
            <polyline
              points={values.map((v, i) => `${20 + i * 40},${70 - v}`).join(" ")}
              fill="none"
              stroke={descending ? "#059669" : "#0284c7"}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            {values.map((v, i) => (
              <g key={i}>
                <circle cx={20 + i * 40} cy={70 - v} r={5} fill={v < 0 ? "#e11d48" : "#059669"} stroke="#fff" strokeWidth={2} />
                <text x={20 + i * 40} y={v < 0 ? 70 - v + 16 : 70 - v - 9} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#0f172a">
                  {v}
                </text>
              </g>
            ))}
          </svg>
          <p className={`text-[10px] mt-1 leading-snug ${descending ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
            {descending ? "The trail now falls at every step." : "The trail must fall at every single step."}
          </p>
        </Stage>
      </div>
    </ActivityShell>
  );
}

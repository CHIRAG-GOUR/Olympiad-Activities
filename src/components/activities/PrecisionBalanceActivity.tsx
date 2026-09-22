"use client";

import React from "react";
import { Scale } from "lucide-react";
import { ActivityShell, ReadOut, DropBuckets, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";

/**
 * Q30 — Decimal balance beam.
 *
 * The student loads every decimal block onto a pan. The beam tilts from the real sums, and
 * the comparison symbol the beam settles on is mapped onto the matching option.
 */

interface BalanceState {
  assignment: Record<string, string>;
}

const BLOCKS = [
  { id: "l1", v: 95.23 },
  { id: "l2", v: 220.8 },
  { id: "l3", v: -11.05 },
  { id: "r1", v: 350.91 },
  { id: "r2", v: 18.31 },
  { id: "r3", v: -57.73 },
];

export function PrecisionBalanceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<BalanceState>) {
  const engine = useActivityEngine<BalanceState, string>({
    initialState: { assignment: {} },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (Object.keys(s.assignment).length !== BLOCKS.length) return undefined;
      const sum = (pan: string) =>
        BLOCKS.filter((b) => s.assignment[b.id] === pan).reduce((t, b) => t + b.v, 0);
      const diff = Number((sum("lhs") - sum("rhs")).toFixed(2));
      const symbol = diff > 0 ? ">" : diff < 0 ? "<" : "=";
      return question?.multipleChoiceConfig?.options.find((o) => o.text.trim().startsWith(symbol))?.id;
    },
  });

  const sum = (pan: string) =>
    Number(BLOCKS.filter((b) => engine.state.assignment[b.id] === pan).reduce((t, b) => t + b.v, 0).toFixed(2));
  const lhs = sum("lhs");
  const rhs = sum("rhs");
  const loaded = Object.keys(engine.state.assignment).length === BLOCKS.length;
  const tilt = loaded ? Math.max(-11, Math.min(11, (lhs - rhs) / 2)) : 0;
  const symbol = !loaded ? "?" : lhs > rhs ? ">" : lhs < rhs ? "<" : "=";

  return (
    <ActivityShell
      icon={Scale}
      title="Decimal Balance Beam"
      howTo="Load every decimal block onto the left or right pan. The beam tilts from the real totals, and the comparison symbol it settles on is your answer."
      answerText={loaded ? `LHS ${symbol} RHS` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`Load all ${BLOCKS.length} blocks — ${Object.keys(engine.state.assignment).length} placed.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="mb-3 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3">
        <svg viewBox="0 0 320 140" className="w-full max-w-[420px] mx-auto">
          <polygon points="160,120 140,138 180,138" fill="#475569" />
          <line x1={160} y1={40} x2={160} y2={120} stroke="#475569" strokeWidth={5} />
          <g transform={`rotate(${tilt} 160 40)`}>
            <line x1={40} y1={40} x2={280} y2={40} stroke="#0f172a" strokeWidth={6} strokeLinecap="round" />
            <line x1={70} y1={40} x2={70} y2={72} stroke="#94a3b8" strokeWidth={2.5} />
            <line x1={250} y1={40} x2={250} y2={72} stroke="#94a3b8" strokeWidth={2.5} />
            <rect x={28} y={72} width={84} height={26} rx={5} fill="#d1fae5" stroke="#059669" strokeWidth={2.5} />
            <text x={70} y={89} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#065f46" fontFamily="monospace">
              {lhs.toFixed(2)}
            </text>
            <rect x={208} y={72} width={84} height={26} rx={5} fill="#e0f2fe" stroke="#0284c7" strokeWidth={2.5} />
            <text x={250} y={89} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#075985" fontFamily="monospace">
              {rhs.toFixed(2)}
            </text>
          </g>
          <text x={160} y={22} textAnchor="middle" fontSize={22} fontWeight="bold" fill={loaded ? "#059669" : "#cbd5e1"}>
            {symbol}
          </text>
        </svg>
        <div className="flex justify-center gap-3 mt-1">
          <ReadOut label="Left pan" value={lhs.toFixed(2)} tone="emerald" />
          <ReadOut label="Right pan" value={rhs.toFixed(2)} tone="sky" />
        </div>
      </div>

      <DropBuckets
        columns={3}
        trayLabel="Drag every decimal block onto a pan"
        items={BLOCKS.map((b) => ({ id: b.id, text: b.v.toFixed(2) }))}
        buckets={[
          { id: "lhs", title: "Left pan (LHS)" },
          { id: "rhs", title: "Right pan (RHS)" },
        ]}
        assignment={engine.state.assignment}
        onAssign={(itemId, bucketId) =>
          engine.update((s) => {
            const assignment = { ...s.assignment };
            if (bucketId) assignment[itemId] = bucketId;
            else delete assignment[itemId];
            return { assignment };
          })
        }
        readOnly={engine.readOnly}
      />
    </ActivityShell>
  );
}

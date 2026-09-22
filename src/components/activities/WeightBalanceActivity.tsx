"use client";

import React from "react";
import { Weight } from "lucide-react";
import { ActivityShell, Stage, ReadOut, ValueSlider, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q42 — Three-girl weighing bench.
 *
 * Sneha's scale is fixed. The student dials in how much heavier each of the other two is,
 * and every scale recomputes. The combined reading of the three scales is the answer.
 */

interface WeighState {
  sakshiOffset: number | null;
  monikaOffset: number | null;
}

const SNEHA = 35.28;

export function WeightBalanceActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<WeighState>) {
  const engine = useActivityEngine<WeighState, number>({
    initialState: { sakshiOffset: null, monikaOffset: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (s.sakshiOffset === null || s.monikaOffset === null) return undefined;
      const sakshi = SNEHA + s.sakshiOffset;
      const monika = sakshi + s.monikaOffset;
      return Number((SNEHA + sakshi + monika).toFixed(2));
    },
  });

  const s = engine.state;
  const sakshi = s.sakshiOffset === null ? null : Number((SNEHA + s.sakshiOffset).toFixed(2));
  const monika = sakshi === null || s.monikaOffset === null ? null : Number((sakshi + s.monikaOffset).toFixed(2));

  const Scale = ({ name, kg, note }: { name: string; kg: number | null; note: string }) => (
    <div className="flex-1 text-center">
      <div className="mx-auto w-[86px] h-[62px] rounded-t-xl border-4 border-slate-700 bg-slate-900 grid place-items-center">
        <span className="font-mono text-sm font-black text-emerald-400 tabular-nums">
          {kg === null ? "--.--" : kg.toFixed(2)}
        </span>
      </div>
      <div className="mx-auto w-[104px] h-2.5 bg-slate-400 rounded-b" />
      <div className="text-xs font-black text-slate-900 mt-1">{name}</div>
      <div className="text-[10px] text-slate-500">{note}</div>
    </div>
  );

  return (
    <ActivityShell
      icon={Weight}
      title="Three-Girl Weighing Bench"
      howTo="Sneha's scale is already set. Dial in how much heavier Sakshi is than Sneha, and how much heavier Monika is than Sakshi — the bench totals all three scales."
      answerText={engine.answer !== undefined ? `${engine.answer.toFixed(2)}` : undefined}
      mappedTo={engine.answer !== undefined ? "kg on the bench in total" : undefined}
      pendingHint="Set both difference dials."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
        <Stage label="Weighing bench">
          <div className="flex gap-2 py-1">
            <Scale name="Sneha" kg={SNEHA} note="given" />
            <Scale name="Sakshi" kg={sakshi} note="heavier than Sneha" />
            <Scale name="Monika" kg={monika} note="heavier than Sakshi" />
          </div>
        </Stage>

        <div className="space-y-3">
          <ValueSlider
            label="Sakshi is heavier by"
            value={s.sakshiOffset ?? 0}
            min={0}
            max={10}
            step={0.01}
            unit="kg"
            onChange={(v) => engine.patch({ sakshiOffset: v })}
            readOnly={engine.readOnly}
          />
          <ValueSlider
            label="Monika is heavier by"
            value={s.monikaOffset ?? 0}
            min={0}
            max={10}
            step={0.01}
            unit="kg"
            tone="sky"
            onChange={(v) => engine.patch({ monikaOffset: v })}
            readOnly={engine.readOnly}
          />
          <ReadOut label="Combined weight" value={engine.answer === undefined ? "—" : `${engine.answer.toFixed(2)} kg`} tone={engine.answer !== undefined ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Sakshi is 4.15 kg heavier than Sneha; Monika is 1.05 kg heavier than Sakshi.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

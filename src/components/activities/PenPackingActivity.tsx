"use client";

import React from "react";
import { PenLine } from "lucide-react";
import { ActivityShell, Stage, ReadOut, Stepper, SwitchToggle, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q40 — Pen packing line.
 *
 * The student opens the hoppers that feed the line and sets the box capacity dial. The
 * machine divides the real merged total by the capacity, and the number of full boxes it
 * produces is the answer.
 */

interface PackState {
  black: boolean;
  blue: boolean;
  capacity: number;
  run: boolean;
}

const BLACK = 125360;
const BLUE = 93515;

export function PenPackingActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<PackState>) {
  const engine = useActivityEngine<PackState, number>({
    initialState: { black: false, blue: false, capacity: 425, run: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (!s.run) return undefined;
      const total = (s.black ? BLACK : 0) + (s.blue ? BLUE : 0);
      if (!total || !s.capacity) return undefined;
      return Math.floor(total / s.capacity);
    },
  });

  const s = engine.state;
  const total = (s.black ? BLACK : 0) + (s.blue ? BLUE : 0);
  const boxes = s.capacity ? Math.floor(total / s.capacity) : 0;
  const leftover = s.capacity ? total % s.capacity : 0;

  return (
    <ActivityShell
      icon={PenLine}
      title="Pen Packing Line"
      howTo="Open the hoppers that should feed the line, set the box capacity dial, then run the line. The boxes it fills are your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${total.toLocaleString("en-IN")} ÷ ${s.capacity}` : undefined}
      pendingHint="Open at least one hopper, set the capacity, then press Run line."
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <button
          type="button"
          disabled={engine.readOnly || !total}
          onClick={() => engine.patch({ run: true })}
          className="px-4 min-h-[44px] sm:min-h-0 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-black"
        >
          Run line
        </button>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_210px]">
        <Stage label="Conveyor">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1.5 w-[46%]">
              <SwitchToggle label={`Black pens — ${BLACK.toLocaleString("en-IN")}`} on={s.black} onChange={(v) => engine.patch({ black: v, run: false })} readOnly={engine.readOnly} />
              <SwitchToggle label={`Blue pens — ${BLUE.toLocaleString("en-IN")}`} on={s.blue} onChange={(v) => engine.patch({ blue: v, run: false })} readOnly={engine.readOnly} />
            </div>

            <div className="flex-1 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Merged hopper</div>
              <div className="font-mono text-2xl font-black text-slate-900">{total.toLocaleString("en-IN")}</div>
              <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.min(100, (total / (BLACK + BLUE)) * 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1 justify-center">
            {s.run &&
              Array.from({ length: Math.min(40, boxes) }, (_, i) => (
                <span key={i} className="w-4 h-4 rounded-sm bg-amber-400 border border-amber-700" />
              ))}
            {s.run && boxes > 40 && (
              <span className="text-[10px] font-mono font-bold text-slate-500 self-center">
                +{boxes - 40} more boxes
              </span>
            )}
          </div>
        </Stage>

        <div className="space-y-2">
          <Stepper label="Pens per box" value={s.capacity} min={25} max={1000} step={25} onChange={(v) => engine.patch({ capacity: v, run: false })} readOnly={engine.readOnly} />
          <ReadOut label="Boxes filled" value={s.run ? boxes : "—"} tone={s.run ? "emerald" : "slate"} />
          <ReadOut label="Pens left over" value={s.run ? leftover : "—"} />
        </div>
      </div>
    </ActivityShell>
  );
}

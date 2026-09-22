"use client";

import React from "react";
import { Mail } from "lucide-react";
import { ActivityShell, Stage, ReadOut, Stepper, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q43 — Envelope cutting bed.
 *
 * The student sets how many envelopes are cut along each edge of the sheet. The bed refuses
 * to overrun the paper and shows the real offcut, so the grid the student lays out gives
 * the envelope count that is submitted.
 */

interface CutState {
  cols: number;
  rows: number;
  touched: boolean;
}

const SHEET = { w: 384, h: 168 };
const ENV = { w: 16, h: 12 };

export function EnvelopePlantActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<CutState>) {
  const engine = useActivityEngine<CutState, number>({
    initialState: { cols: 1, rows: 1, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.touched ? s.cols * s.rows : undefined),
  });

  const { cols, rows } = engine.state;
  const usedW = cols * ENV.w;
  const usedH = rows * ENV.h;
  const overrun = usedW > SHEET.w || usedH > SHEET.h;
  const wasteW = SHEET.w - usedW;
  const wasteH = SHEET.h - usedH;
  const maxCols = Math.floor(SHEET.w / ENV.w);
  const maxRows = Math.floor(SHEET.h / ENV.h);

  return (
    <ActivityShell
      icon={Mail}
      title="Envelope Cutting Bed"
      howTo="Set how many envelopes to cut across and down the sheet. The bed lays out the real grid and shows the paper left over — the envelopes you lay out are your answer."
      answerText={engine.answer !== undefined && !overrun ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined && !overrun ? `${cols} across × ${rows} down` : undefined}
      pendingHint={overrun ? "The grid overruns the sheet — reduce it." : "Set the cutting grid."}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_210px]">
        <Stage label={`Paper sheet ${SHEET.w} cm × ${SHEET.h} cm · envelope ${ENV.w} cm × ${ENV.h} cm`}>
          <div className="relative w-full rounded-lg border-2 border-slate-400 bg-white overflow-hidden" style={{ aspectRatio: `${SHEET.w} / ${SHEET.h}` }}>
            <div
              className={`absolute left-0 top-0 grid ${overrun ? "opacity-50" : ""}`}
              style={{
                width: `${Math.min(100, (usedW / SHEET.w) * 100)}%`,
                height: `${Math.min(100, (usedH / SHEET.h) * 100)}%`,
                gridTemplateColumns: `repeat(${Math.min(cols, maxCols)}, minmax(0,1fr))`,
                gridTemplateRows: `repeat(${Math.min(rows, maxRows)}, minmax(0,1fr))`,
              }}
            >
              {Array.from({ length: Math.min(cols, maxCols) * Math.min(rows, maxRows) }, (_, i) => (
                <div key={i} className={`border ${overrun ? "border-rose-400 bg-rose-100" : "border-emerald-500 bg-emerald-100"}`} />
              ))}
            </div>
          </div>
          <div className={`mt-2 text-[11px] font-bold text-center ${overrun ? "text-rose-600" : "text-slate-500"}`}>
            {overrun
              ? "This grid does not fit on the sheet."
              : `Offcut: ${wasteW} cm across, ${wasteH} cm down`}
          </div>
        </Stage>

        <div className="space-y-2">
          <Stepper label="Envelopes across" value={cols} min={1} max={30} onChange={(v) => engine.update((s) => ({ ...s, cols: v, touched: true }))} readOnly={engine.readOnly} />
          <Stepper label="Envelopes down" value={rows} min={1} max={20} onChange={(v) => engine.update((s) => ({ ...s, rows: v, touched: true }))} readOnly={engine.readOnly} />
          <ReadOut label="Envelopes cut" value={overrun ? "does not fit" : cols * rows} tone={engine.answer !== undefined && !overrun ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Fill the sheet completely — leaving usable paper wastes envelopes.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

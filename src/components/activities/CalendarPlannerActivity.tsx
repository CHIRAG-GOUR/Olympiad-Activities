"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q13 — Work calendar planner.
 *
 * Every date starts as an office day. The student taps the dates Ankit does not travel in
 * (multiples of 5, and Sundays via the column heading). The office counter is the answer.
 */

interface CalState {
  off: string[];
  touched: boolean;
}

const DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]; // Feb 1 is a Saturday
const TOTAL = 29;

export function CalendarPlannerActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<CalState>) {
  const engine = useActivityEngine<CalState, number>({
    initialState: { off: [], touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.touched ? TOTAL - new Set(s.off).size : undefined),
  });

  const off = new Set(engine.state.off);

  const toggle = (d: number) =>
    engine.update((s) => {
      const next = new Set(s.off);
      const k = String(d);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return { off: Array.from(next), touched: true };
    });

  const toggleColumn = (col: number) =>
    engine.update((s) => {
      const next = new Set(s.off);
      const days: string[] = [];
      for (let d = 1; d <= TOTAL; d++) if ((d - 1) % 7 === col) days.push(String(d));
      const allOff = days.every((d) => next.has(d));
      days.forEach((d) => (allOff ? next.delete(d) : next.add(d)));
      return { off: Array.from(next), touched: true };
    });

  return (
    <ActivityShell
      icon={CalendarDays}
      title="February Duty Planner"
      howTo="Tap every date Ankit does NOT travel to the office (tap a weekday heading to switch that whole column). The office counter is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? "Office days counted" : undefined}
      pendingHint="Tap the dates he works from home or is on holiday."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <Stage label="February 20XX — 29 days, the 1st is a Saturday">
          <div className="grid grid-cols-7 gap-1 max-w-[420px]">
            {DAYS.map((d, i) => (
              <button
                key={d}
                type="button"
                disabled={engine.readOnly}
                onClick={() => toggleColumn(i)}
                className={`py-1 rounded text-[10px] font-black uppercase transition ${
                  d === "Sun" ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {d}
              </button>
            ))}
            {Array.from({ length: TOTAL }, (_, i) => i + 1).map((d) => {
              const isOff = off.has(String(d));
              return (
                <button
                  key={d}
                  type="button"
                  disabled={engine.readOnly}
                  onClick={() => toggle(d)}
                  className={`aspect-square rounded-lg border-2 font-mono text-sm font-black transition ${
                    isOff
                      ? "bg-rose-50 border-rose-400 text-rose-500 line-through"
                      : "bg-emerald-50 border-emerald-400 text-emerald-800"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-2 text-[10px] font-bold">
            <span className="text-emerald-700">Green = at the office</span>
            <span className="text-rose-600">Red = home or holiday</span>
          </div>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Office days" value={TOTAL - off.size} tone={engine.state.touched ? "emerald" : "slate"} />
          <ReadOut label="Marked off" value={off.size} tone="rose" />
          <p className="text-[10px] text-slate-500 leading-snug">
            He works from home on every date that is a multiple of 5, and every Sunday is a
            mandatory holiday.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

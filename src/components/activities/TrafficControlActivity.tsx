"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { ActivityShell, ReadOut, DropBuckets, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q22 — Library footfall comparator.
 *
 * The student drags day-bars into two collection trays. Each tray totals itself live and
 * the difference between the trays is the answer.
 */

interface FootfallState {
  assignment: Record<string, string>;
}

const DAYS: { id: string; label: string; n: number }[] = [
  { id: "mon", label: "Mon", n: 25 },
  { id: "tue", label: "Tue", n: 12 },
  { id: "wed", label: "Wed", n: 28 },
  { id: "thu", label: "Thu", n: 17 },
  { id: "fri", label: "Fri", n: 10 },
  { id: "sat", label: "Sat", n: 19 },
  { id: "sun", label: "Sun", n: 11 },
];

export function TrafficControlActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<FootfallState>) {
  const engine = useActivityEngine<FootfallState, number>({
    initialState: { assignment: {} },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const groupA = DAYS.filter((d) => s.assignment[d.id] === "groupA");
      const groupB = DAYS.filter((d) => s.assignment[d.id] === "groupB");
      if (!groupA.length || !groupB.length) return undefined;
      return groupA.reduce((t, d) => t + d.n, 0) - groupB.reduce((t, d) => t + d.n, 0);
    },
  });

  const totalOf = (g: string) =>
    DAYS.filter((d) => engine.state.assignment[d.id] === g).reduce((t, d) => t + d.n, 0);

  return (
    <ActivityShell
      icon={BarChart3}
      title="Library Footfall Comparator"
      howTo="Drag the day bars into the two trays you want to compare. Each tray totals itself, and the difference between them is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${totalOf("groupA")} − ${totalOf("groupB")}` : undefined}
      pendingHint="Put at least one day in each tray."
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <div className="flex gap-2">
          <ReadOut label="Tray 1" value={totalOf("groupA")} tone="emerald" />
          <ReadOut label="Tray 2" value={totalOf("groupB")} tone="sky" />
        </div>
      }
    >
      <div className="mb-3 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Weekly visitors</div>
        <div className="flex items-end gap-2 h-[110px]">
          {DAYS.map((d) => {
            const tray = engine.state.assignment[d.id];
            return (
              <div key={d.id} className="flex-1 flex flex-col items-center justify-end gap-1">
                <span className="text-[10px] font-mono font-black text-slate-700">{d.n}</span>
                <div
                  className={`w-full rounded-t ${tray === "groupA" ? "bg-emerald-500" : tray === "groupB" ? "bg-sky-500" : "bg-slate-300"}`}
                  style={{ height: `${(d.n / 28) * 78}px` }}
                />
                <span className="text-[10px] font-bold text-slate-500">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <DropBuckets
        columns={7}
        trayLabel="Drag a day into a tray"
        items={DAYS.map((d) => ({ id: d.id, text: d.label, sub: String(d.n) }))}
        buckets={[
          { id: "groupA", title: `Tray 1 — total ${totalOf("groupA")}` },
          { id: "groupB", title: `Tray 2 — total ${totalOf("groupB")}` },
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

"use client";

import React from "react";
import { Construction } from "lucide-react";
import { ActivityShell, Stage, ReorderList, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q5 — Place-value crane.
 *
 * The student physically drags the place-value crates into a stack. The stack order the
 * crane ends up holding is submitted directly as the ordering answer.
 */

interface OrderState {
  order: string[];
  touched: boolean;
}

const SCRAMBLE = [2, 0, 4, 1, 3];
const MAGNITUDE: Record<string, number> = { "2": 1, "3": 10, "1": 100, "4": 1000, "5": 100000 };

export function PlaceValueCraneActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<OrderState>) {
  const items = React.useMemo(
    () =>
      question?.orderingConfig?.items.map((i) => ({ id: i.id, label: i.label, sub: i.sublabel })) || [],
    [question]
  );

  const initial = React.useMemo(() => {
    const ids = items.map((i) => i.id);
    return SCRAMBLE.filter((n) => n < ids.length).map((n) => ids[n]).concat(ids.filter((_, i) => !SCRAMBLE.includes(i)));
  }, [items]);

  const engine = useActivityEngine<OrderState, string[]>({
    initialState: { order: initial, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    deriveStateFromValue: (v) => (Array.isArray(v) ? { order: v, touched: true } : undefined),
    resolve: (s) => (s.touched ? s.order : undefined),
  });

  const magnitudes = engine.state.order.map((id) => MAGNITUDE[id] ?? 1);
  const ascending = magnitudes.every((m, i) => i === 0 || m > magnitudes[i - 1]);

  return (
    <ActivityShell
      icon={Construction}
      title="Place-Value Crane Stack"
      howTo="Drag the crates (or use the arrows) so the crane stacks the place values from the smallest magnitude at the top of the list to the greatest at the bottom."
      answerText={
        engine.answer
          ? engine.state.order.map((id) => question?.orderingConfig?.items.find((i) => i.id === id)?.label.split(".")[0] ?? id).join(" → ")
          : undefined
      }
      mappedTo={engine.answer ? (ascending ? "Strictly ascending stack" : "Stack as arranged") : undefined}
      pendingHint="Move at least one crate to lock in your stacking order."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <div>
          <ReorderList
            items={items}
            order={engine.state.order}
            onReorder={(order) => engine.update({ order, touched: true })}
            readOnly={engine.readOnly}
            renderMeta={(id) => (
              <span className="font-mono text-[11px] font-bold text-slate-500 tabular-nums">
                {MAGNITUDE[id]?.toLocaleString("en-IN")}
              </span>
            )}
          />
        </div>

        <Stage label="Crane load profile">
          <div className="flex items-end gap-1.5 h-[150px]">
            {engine.state.order.map((id, i) => {
              const m = MAGNITUDE[id] ?? 1;
              const h = (Math.log10(m) + 1) / 6;
              return (
                <div key={id} className="flex-1 flex flex-col items-center justify-end gap-1">
                  <div
                    className={`w-full rounded-t-md ${ascending ? "bg-emerald-500" : "bg-sky-500"}`}
                    style={{ height: `${Math.max(8, h * 120)}px` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500">{i + 1}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 leading-snug">
            Bars rise left to right only when the stack climbs in magnitude.
          </p>
        </Stage>
      </div>
    </ActivityShell>
  );
}

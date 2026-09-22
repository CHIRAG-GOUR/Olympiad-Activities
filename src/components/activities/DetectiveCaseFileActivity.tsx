"use client";

import React from "react";
import { Search } from "lucide-react";
import { ActivityShell, Stage, ReadOut, ReorderList, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q50 — Detective case file.
 *
 * The student measures the composite figure for real — tapping edges to walk the perimeter
 * and dragging over cells to measure the shaded area — then drags the four result cards
 * into ascending order. That ordering is the answer.
 */

interface CaseState {
  edges: string[];
  cells: number[];
  order: string[];
  touched: boolean;
}

/** Composite figure: an 18 x 12 rectangle with a 9 x 6 shaded block inside. */
const GW = 18;
const GH = 12;
const EDGES = [
  { id: "top", len: 18 },
  { id: "right", len: 12 },
  { id: "bottom", len: 18 },
  { id: "left", len: 12 },
  { id: "step-in", len: 3 },
  { id: "step-up", len: 3 },
];

const VALUE: Record<string, number> = { v_shaded: 54, v_perim: 66, v_unshaded: 162, v_total: 216 };

export function DetectiveCaseFileActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<CaseState>) {
  const items = React.useMemo(
    () => (question?.orderingConfig?.items || []).map((i) => ({ id: i.id, label: i.label })),
    [question]
  );

  const initial = React.useMemo(() => {
    const ids = (question?.orderingConfig?.items || []).map((i) => i.id);
    return [3, 1, 0, 2].filter((n) => n < ids.length).map((n) => ids[n]);
  }, [question]);

  const engine = useActivityEngine<CaseState, string[]>({
    initialState: { edges: [], cells: [], order: initial, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    deriveStateFromValue: (v) => (Array.isArray(v) ? { edges: [], cells: [], order: v, touched: true } : undefined),
    resolve: (s) => (s.touched ? s.order : undefined),
  });

  const s = engine.state;
  const shadedSet = new Set(s.cells);
  const mode = React.useRef<"add" | "remove">("add");

  const applyCell = (i: number) =>
    engine.update((st) => {
      const next = new Set(st.cells);
      if (mode.current === "add") next.add(i);
      else next.delete(i);
      return { ...st, cells: Array.from(next) };
    });

  const { start } = usePointerDrag<number>({
    disabled: engine.readOnly,
    onStart: (_p, i) => {
      mode.current = shadedSet.has(i) ? "remove" : "add";
      applyCell(i);
    },
    onMove: (p) => {
      const el = document.elementFromPoint(p.x, p.y) as HTMLElement | null;
      const idx = el?.dataset?.cell;
      if (idx !== undefined) applyCell(Number(idx));
    },
  });

  const perimeter = s.edges.reduce((t, id) => t + (EDGES.find((e) => e.id === id)?.len ?? 0), 0);
  const values = s.order.map((id) => VALUE[id] ?? 0);
  const ascending = values.every((v, i) => i === 0 || v > values[i - 1]);

  return (
    <ActivityShell
      icon={Search}
      title="Composite Figure Case File"
      howTo="Tap the edges to walk the perimeter and drag over squares to measure the shaded area, then drag the four result cards into ascending order."
      answerText={engine.answer ? values.join(" < ") : undefined}
      mappedTo={engine.answer ? (ascending ? "Strictly ascending" : "Order as arranged") : undefined}
      pendingHint="Measure the figure, then reorder the result cards."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[260px_1fr]">
        <Stage label="Evidence figure">
          <div
            className="grid gap-[2px] mx-auto"
            style={{ gridTemplateColumns: `repeat(${GW}, minmax(0,1fr))`, touchAction: "none" }}
          >
            {Array.from({ length: GW * GH }, (_, i) => (
              <div
                key={i}
                data-cell={i}
                onPointerDown={(e) => start(e, i)}
                className={`aspect-square rounded-[1px] border border-slate-200 ${
                  shadedSet.has(i) ? "bg-emerald-600" : "bg-white hover:bg-emerald-100"
                }`}
              />
            ))}
          </div>

          <div className="mt-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Walk the perimeter — tap each edge
            </div>
            <div className="flex flex-wrap gap-1">
              {EDGES.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  disabled={engine.readOnly}
                  onClick={() =>
                    engine.update((st) => ({
                      ...st,
                      edges: st.edges.includes(e.id) ? st.edges.filter((x) => x !== e.id) : [...st.edges, e.id],
                    }))
                  }
                  className={`px-2 py-1.5 min-h-[34px] rounded-lg border-2 text-[10px] font-black transition ${
                    s.edges.includes(e.id) ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  {e.id} ({e.len})
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <ReadOut label="Perimeter walked" value={`${perimeter} cm`} tone={perimeter === 66 ? "emerald" : "slate"} />
            <ReadOut label="Shaded measured" value={`${shadedSet.size} cm²`} tone={shadedSet.size === 54 ? "emerald" : "slate"} />
          </div>
        </Stage>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            {question?.orderingConfig?.instruction || "Arrange the results in ascending order"}
          </div>
          <ReorderList
            items={items}
            order={s.order}
            onReorder={(order) => engine.update((st) => ({ ...st, order, touched: true }))}
            readOnly={engine.readOnly}
            renderMeta={(id) => (
              <span className="font-mono text-[11px] font-black text-slate-500 tabular-nums">{VALUE[id]}</span>
            )}
          />
        </div>
      </div>
    </ActivityShell>
  );
}

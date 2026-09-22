"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q24 — Floor border planner.
 *
 * A 10 cm × 9 cm floor drawn as unit squares, with the stepped cut-out already lifted out.
 * The student drags across the remaining border to tile it, and the number of squares they
 * actually tile is the answer.
 */

interface FloorState {
  tiled: number[];
  touched: boolean;
}

const W = 10;
const H = 9;
/** The stepped unshaded cut-out: 54 of the 90 unit squares. */
const CUTOUT_ROWS: [number, number][] = [
  [2, 7],
  [2, 7],
  [1, 8],
  [1, 8],
  [1, 8],
  [2, 7],
  [2, 7],
  [2, 7],
];
const isCut = (x: number, y: number) => {
  const r = CUTOUT_ROWS[y];
  return !!r && x >= r[0] && x <= r[1];
};

export function FloorPlannerActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<FloorState>) {
  const engine = useActivityEngine<FloorState, number>({
    initialState: { tiled: [], touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.touched ? new Set(s.tiled).size : undefined),
  });

  const tiled = new Set(engine.state.tiled);
  const mode = React.useRef<"add" | "remove">("add");

  const apply = (i: number) => {
    const x = i % W;
    const y = Math.floor(i / W);
    if (isCut(x, y)) return;
    engine.update((s) => {
      const next = new Set(s.tiled);
      if (mode.current === "add") next.add(i);
      else next.delete(i);
      return { tiled: Array.from(next), touched: true };
    });
  };

  const { start } = usePointerDrag<number>({
    disabled: engine.readOnly,
    onStart: (_p, i) => {
      mode.current = tiled.has(i) ? "remove" : "add";
      apply(i);
    },
    onMove: (p) => {
      const el = document.elementFromPoint(p.x, p.y) as HTMLElement | null;
      const idx = el?.dataset?.cell;
      if (idx !== undefined) apply(Number(idx));
    },
  });

  const cutCount = CUTOUT_ROWS.reduce((t, [a, b]) => t + (b - a + 1), 0);

  return (
    <ActivityShell
      icon={LayoutGrid}
      title="Floor Border Planner"
      howTo="Drag across the grey border squares to tile them (drag again to lift a tile). The white stepped area is the cut-out. The squares you tile are your answer."
      answerText={engine.answer !== undefined ? `${engine.answer}` : undefined}
      mappedTo={engine.answer !== undefined ? "sq. cm of border tiled" : undefined}
      pendingHint="Tile the shaded border around the cut-out."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <Stage label={`Outer rectangle 10 cm × 9 cm = ${W * H} sq. cm`}>
          <div
            className="grid gap-[2px] mx-auto w-full max-w-[360px]"
            style={{ gridTemplateColumns: `repeat(${W}, minmax(0,1fr))`, touchAction: "none" }}
          >
            {Array.from({ length: W * H }, (_, i) => {
              const x = i % W;
              const y = Math.floor(i / W);
              const cut = isCut(x, y);
              return (
                <div
                  key={i}
                  data-cell={i}
                  onPointerDown={(e) => !cut && start(e, i)}
                  className={`aspect-square rounded-[3px] border transition-colors ${
                    cut
                      ? "bg-white border-slate-200"
                      : tiled.has(i)
                      ? "bg-emerald-600 border-emerald-800"
                      : "bg-slate-200 border-slate-300 hover:bg-emerald-200 cursor-pointer"
                  }`}
                />
              );
            })}
          </div>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Border tiled" value={`${tiled.size} sq. cm`} tone={engine.state.touched ? "emerald" : "slate"} />
          <ReadOut label="Cut-out (unshaded)" value={`${cutCount} sq. cm`} />
          <ReadOut label="Total floor" value={`${W * H} sq. cm`} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Tile every grey square to measure the full shaded border.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

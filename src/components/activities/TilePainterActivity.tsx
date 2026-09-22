"use client";

import React from "react";
import { Paintbrush } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q16 — Tessellation painter.
 *
 * Twenty-eight diamond tiles the student paints by dragging across them. The live fraction
 * read-out tracks what is left unshaded, and the number of tiles actually painted is the
 * answer.
 */

interface PaintState {
  shaded: number[];
  touched: boolean;
}

const TOTAL = 28;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export function TilePainterActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<PaintState>) {
  const engine = useActivityEngine<PaintState, number>({
    initialState: { shaded: [], touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.touched ? new Set(s.shaded).size : undefined),
  });

  const shaded = new Set(engine.state.shaded);
  const mode = React.useRef<"add" | "remove">("add");

  const apply = (i: number) =>
    engine.update((s) => {
      const next = new Set(s.shaded);
      if (mode.current === "add") next.add(i);
      else next.delete(i);
      return { shaded: Array.from(next), touched: true };
    });

  const { start } = usePointerDrag<number>({
    disabled: engine.readOnly,
    onStart: (_p, i) => {
      mode.current = shaded.has(i) ? "remove" : "add";
      apply(i);
    },
    onMove: (p) => {
      const el = document.elementFromPoint(p.x, p.y) as HTMLElement | null;
      const idx = el?.dataset?.tile;
      if (idx !== undefined) apply(Number(idx));
    },
  });

  const unshaded = TOTAL - shaded.size;
  const g = gcd(unshaded, TOTAL) || 1;

  return (
    <ActivityShell
      icon={Paintbrush}
      title="Tessellation Shading Studio"
      howTo="Drag across the diamond tiles to shade them, and drag again to clear them. Watch the unshaded fraction until it reads exactly 3/7 — the number of tiles you shaded is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? "Tiles shaded" : undefined}
      pendingHint="Shade some tiles to begin."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <Stage label="28 identical diamond units">
          <div className="grid grid-cols-7 gap-2 max-w-[400px] mx-auto py-2" style={{ touchAction: "none" }}>
            {Array.from({ length: TOTAL }, (_, i) => (
              <div
                key={i}
                data-tile={i}
                onPointerDown={(e) => start(e, i)}
                className={`aspect-square rotate-45 rounded-sm border-2 transition-colors ${
                  shaded.has(i) ? "bg-emerald-600 border-emerald-800" : "bg-white border-slate-300 hover:border-emerald-400"
                } ${engine.readOnly ? "" : "cursor-pointer"}`}
              />
            ))}
          </div>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Shaded" value={shaded.size} tone="emerald" />
          <ReadOut label="Unshaded" value={unshaded} />
          <ReadOut
            label="Unshaded fraction"
            value={`${unshaded}/${TOTAL} = ${unshaded / g}/${TOTAL / g}`}
            tone={unshaded * 7 === TOTAL * 3 ? "emerald" : "slate"}
          />
          <p className="text-[10px] text-slate-500 leading-snug">
            Exactly three sevenths of the figure has to stay unshaded.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

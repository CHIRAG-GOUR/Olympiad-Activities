"use client";

import React from "react";
import { GitBranch } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q17 — Prime factor tree.
 *
 * The student drags number tiles into the two empty nodes of the tree. Each parent node
 * checks the product of its children live, and the ratio x / y computed from the tree the
 * student builds is the answer.
 */

interface TreeState {
  x: number | null;
  y: number | null;
}

const TILES = [2, 3, 4, 6, 8, 12, 16, 24];

export function NumberTreeActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<TreeState>) {
  const engine = useActivityEngine<TreeState, number>({
    initialState: { x: null, y: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.x !== null && s.y !== null && s.y !== 0 ? Number((s.x / s.y).toFixed(4)) : undefined),
  });

  const nodeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [ghost, setGhost] = React.useState<{ n: number; x: number; y: number } | null>(null);
  const [armed, setArmed] = React.useState<number | null>(null);

  const nodeAt = (px: number, py: number) => {
    for (const k of ["x", "y"] as const) {
      const el = nodeRefs.current[k];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) return k;
    }
    return null;
  };

  const { start } = usePointerDrag<number>({
    disabled: engine.readOnly,
    onStart: (p, n) => setGhost({ n, x: p.x, y: p.y }),
    onMove: (p, n) => setGhost({ n, x: p.x, y: p.y }),
    onEnd: (p, n) => {
      setGhost(null);
      const slot = nodeAt(p.x, p.y);
      if (slot) engine.patch({ [slot]: n } as Partial<TreeState>);
    },
  });

  const { x, y } = engine.state;
  const topOk = x !== null && x * 8 === 48;
  const lowOk = y !== null && y * 2 === 4;

  const Node = ({ label, value: v, slot, ok }: { label: string; value: number | null; slot?: "x" | "y"; ok?: boolean }) => (
    <div
      ref={slot ? (el) => { nodeRefs.current[slot] = el; } : undefined}
      onClick={() => {
        if (slot && armed !== null && !engine.readOnly) {
          engine.patch({ [slot]: armed } as Partial<TreeState>);
          setArmed(null);
        }
      }}
      className={`w-14 h-14 grid place-items-center rounded-full border-2 font-mono text-lg font-black ${
        slot
          ? v === null
            ? armed !== null
              ? "border-emerald-500 border-dashed bg-emerald-50 text-emerald-600 cursor-pointer"
              : "border-dashed border-slate-400 bg-white text-slate-300"
            : ok
            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
            : "border-amber-500 bg-amber-50 text-amber-800"
          : "border-slate-300 bg-white text-slate-800"
      }`}
    >
      {v ?? label}
    </div>
  );

  return (
    <ActivityShell
      icon={GitBranch}
      title="Prime Factor Tree Builder"
      howTo="Drag number tiles into the two empty nodes (or tap a tile, then a node). Each parent checks its children's product, and the ratio x ÷ y from your tree is the answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined && x !== null && y !== null ? `x ÷ y = ${x} ÷ ${y}` : undefined}
      pendingHint="Fill both empty nodes of the tree."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <Stage label="Factor tree for 48">
          <div className="flex flex-col items-center gap-1 py-1">
            <Node label="48" value={48} />
            <svg width="190" height="26"><path d="M95 0 L40 26 M95 0 L150 26" stroke="#94a3b8" strokeWidth={2} fill="none" /></svg>
            <div className="flex gap-16">
              <Node label="x" value={x} slot="x" ok={topOk} />
              <Node label="8" value={8} />
            </div>
            <svg width="190" height="26"><path d="M150 0 L110 26 M150 0 L185 26" stroke="#94a3b8" strokeWidth={2} fill="none" /></svg>
            <div className="flex gap-16 pl-24">
              <Node label="2" value={2} />
              <Node label="4" value={4} />
            </div>
            <svg width="190" height="26"><path d="M150 0 L120 26 M150 0 L180 26" stroke="#94a3b8" strokeWidth={2} fill="none" /></svg>
            <div className="flex gap-12 pl-32">
              <Node label="y" value={y} slot="y" ok={lowOk} />
              <Node label="2" value={2} />
            </div>
          </div>
          <div className="flex justify-center gap-4 text-[10px] font-bold mt-1">
            <span className={topOk ? "text-emerald-700" : "text-slate-500"}>x × 8 = 48 {topOk ? "✓" : ""}</span>
            <span className={lowOk ? "text-emerald-700" : "text-slate-500"}>y × 2 = 4 {lowOk ? "✓" : ""}</span>
          </div>
        </Stage>

        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Number tiles</div>
          <div className="grid grid-cols-4 gap-1.5">
            {TILES.map((n) => (
              <button
                key={n}
                type="button"
                disabled={engine.readOnly}
                onPointerDown={(e) => start(e, n)}
                onClick={() => setArmed((a) => (a === n ? null : n))}
                className={`h-11 rounded-lg border-2 font-mono text-sm font-black transition ${
                  armed === n ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white border-slate-200 text-slate-800 hover:border-emerald-400"
                } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
                style={{ touchAction: "none" }}
              >
                {n}
              </button>
            ))}
          </div>
          <ReadOut label="Ratio x ÷ y" value={engine.answer ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
        </div>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50 w-12 h-12 grid place-items-center rounded-full border-2 border-emerald-600 bg-white font-mono text-lg font-black text-emerald-700 shadow-lg" style={{ left: ghost.x - 24, top: ghost.y - 24 }}>
          {ghost.n}
        </div>
      )}
    </ActivityShell>
  );
}

"use client";

import React from "react";
import { Puzzle, RotateCw } from "lucide-react";
import { ActivityShell, Stage, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q14 — Mosaic restoration.
 *
 * Four salvaged tiles sit on the bench. The student drags one into the missing quadrant and
 * rotates it until the design reads as symmetric. Whichever tile is physically seated in
 * the gap is the answer.
 */

interface MosaicState {
  placed: string | null;
  rotation: number;
}

const TILES = ["A", "B", "C", "D"];

/** Each salvaged tile drawn in its own 60x60 quadrant space. */
function TileArt({ id, size = 60 }: { id: string; size?: number }) {
  const common = { fill: "none", stroke: "#0f172a", strokeWidth: 3 } as const;
  return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      {id === "A" && (
        <>
          <path d="M0 60 L60 0" {...common} />
          <circle cx={42} cy={42} r={9} {...common} />
        </>
      )}
      {id === "B" && (
        <>
          <path d="M0 30 H60 M30 0 V60" {...common} />
        </>
      )}
      {id === "C" && (
        <>
          <path d="M0 60 A 60 60 0 0 1 60 0" {...common} />
          <path d="M0 60 A 34 34 0 0 1 34 26" {...common} />
          <circle cx={54} cy={54} r={5} fill="#0f172a" />
        </>
      )}
      {id === "D" && (
        <>
          <rect x={12} y={12} width={36} height={36} {...common} />
        </>
      )}
    </svg>
  );
}

/** The three surviving quadrants are quarter-turn copies of the same radial arc motif. */
function SurvivingQuadrant({ rotate }: { rotate: number }) {
  return (
    <g transform={`rotate(${rotate} 30 30)`}>
      <TileArt id="C" />
    </g>
  );
}

export function MosaicRestorationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<MosaicState>) {
  const engine = useActivityEngine<MosaicState, string>({
    initialState: { placed: null, rotation: 0 },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) =>
      s.placed
        ? question?.multipleChoiceConfig?.options.find((o) => o.id === s.placed)?.id || s.placed
        : undefined,
  });

  const gapRef = React.useRef<HTMLDivElement | null>(null);
  const [ghost, setGhost] = React.useState<{ id: string; x: number; y: number } | null>(null);

  const overGap = (x: number, y: number) => {
    const r = gapRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const { start } = usePointerDrag<string>({
    disabled: engine.readOnly,
    onStart: (p, id) => setGhost({ id, x: p.x, y: p.y }),
    onMove: (p, id) => setGhost({ id, x: p.x, y: p.y }),
    onEnd: (p, id) => {
      setGhost(null);
      if (overGap(p.x, p.y)) engine.update({ placed: id, rotation: 0 });
    },
  });

  // Symmetry meter: tile C seated at 270° continues the radial arc pattern
  const symmetric = engine.state.placed === "C" && engine.state.rotation === 270;

  return (
    <ActivityShell
      icon={Puzzle}
      title="Mosaic Restoration Bench"
      howTo="Drag a salvaged tile into the empty quadrant and rotate it with the turn button until the four-quadrant design becomes symmetric. The tile you seat is your answer."
      answerText={engine.state.placed ? `Tile ${engine.state.placed} seated at ${engine.state.rotation}°` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Drag one of the four salvaged tiles into the empty quadrant."
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        engine.state.placed ? (
          <button
            type="button"
            disabled={engine.readOnly}
            onClick={() => engine.patch({ rotation: (engine.state.rotation + 90) % 360 })}
            className="inline-flex items-center gap-1.5 px-3 min-h-[44px] sm:min-h-0 sm:py-1.5 rounded-lg border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-emerald-400"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotate tile 90°
          </button>
        ) : null
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
        <Stage label="Four-quadrant design">
          <div className={`relative mx-auto w-[248px] h-[248px] rounded-xl border-2 bg-white ${symmetric ? "border-emerald-500" : "border-slate-300"}`}>
            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
              <line x1={60} y1={0} x2={60} y2={120} stroke="#e2e8f0" strokeWidth={1.5} />
              <line x1={0} y1={60} x2={120} y2={60} stroke="#e2e8f0" strokeWidth={1.5} />
              <g transform="translate(0,0)"><SurvivingQuadrant rotate={0} /></g>
              <g transform="translate(60,0)"><SurvivingQuadrant rotate={90} /></g>
              <g transform="translate(60,60)"><SurvivingQuadrant rotate={180} /></g>
            </svg>

            <div
              ref={gapRef}
              className={`absolute left-0 bottom-0 w-1/2 h-1/2 grid place-items-center rounded-bl-lg border-2 border-dashed ${
                engine.state.placed ? "border-emerald-400 bg-emerald-50/40" : "border-slate-400 bg-slate-50"
              }`}
            >
              {engine.state.placed ? (
                <div style={{ transform: `rotate(${engine.state.rotation}deg)` }}>
                  <TileArt id={engine.state.placed} size={120} />
                </div>
              ) : (
                <span className="text-slate-400 font-black text-2xl">?</span>
              )}
            </div>
          </div>
          <div className={`mt-2 text-center text-[11px] font-bold ${symmetric ? "text-emerald-700" : "text-slate-500"}`}>
            Symmetry check: {symmetric ? "the radial pattern now closes" : "the pattern does not close yet"}
          </div>
        </Stage>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Salvaged tiles — drag one into the gap
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TILES.map((id) => (
              <button
                key={id}
                type="button"
                disabled={engine.readOnly}
                onPointerDown={(e) => start(e, id)}
                className={`rounded-xl border-2 bg-white p-2 grid place-items-center transition ${
                  engine.state.placed === id ? "border-emerald-500 opacity-40" : "border-slate-200 hover:border-emerald-400"
                } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
                style={{ touchAction: "none" }}
              >
                <TileArt id={id} size={54} />
                <span className="text-[10px] font-black text-slate-600 mt-1">Tile {id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50 rounded-lg border-2 border-emerald-600 bg-white p-1 shadow-lg" style={{ left: ghost.x - 30, top: ghost.y - 30 }}>
          <TileArt id={ghost.id} size={54} />
        </div>
      )}
    </ActivityShell>
  );
}

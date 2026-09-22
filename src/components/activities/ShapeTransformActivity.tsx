"use client";

import React from "react";
import { Replace } from "lucide-react";
import { ActivityShell, Stage, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q11 — Figure analogy workbench.
 *
 * The student rebuilds figure (iv) themselves: drag each inner shape into a corner and tap
 * it to swap its shading. The transformation they actually perform is classified and mapped
 * onto the option that describes it.
 */

interface Piece {
  id: string;
  corner: number; // 0 TL, 1 TR, 2 BR, 3 BL
  filled: boolean;
}
interface AnalogyState {
  pieces: Piece[];
  touched: boolean;
}

const START: Piece[] = [
  { id: "square", corner: 0, filled: true },
  { id: "circle", corner: 2, filled: false },
  { id: "triangle", corner: 1, filled: true },
];

const CORNER_POS = [
  { left: "6%", top: "8%" },
  { left: "62%", top: "8%" },
  { left: "62%", top: "60%" },
  { left: "6%", top: "60%" },
];

function Glyph({ id, filled, size = 34 }: { id: string; filled: boolean; size?: number }) {
  const fill = filled ? "#334155" : "#ffffff";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {id === "square" && <rect x={6} y={6} width={28} height={28} rx={3} fill={fill} stroke="#0f172a" strokeWidth={2.5} />}
      {id === "circle" && <circle cx={20} cy={20} r={14} fill={fill} stroke="#0f172a" strokeWidth={2.5} />}
      {id === "triangle" && <polygon points="20,5 35,34 5,34" fill={fill} stroke="#0f172a" strokeWidth={2.5} />}
    </svg>
  );
}

export function ShapeTransformActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<AnalogyState>) {
  const engine = useActivityEngine<AnalogyState, string>({
    initialState: { pieces: START, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (!s.touched) return undefined;
      const opt = (id: string) => question?.multipleChoiceConfig?.options.find((o) => o.id === id)?.id;
      const moved = s.pieces.every((p) => {
        const from = START.find((x) => x.id === p.id)!;
        return p.corner === (from.corner + 2) % 4;
      });
      const inverted = s.pieces.every((p) => p.filled !== START.find((x) => x.id === p.id)!.filled);
      if (moved && inverted) return opt("C");
      if (moved) return opt("A");
      if (inverted) return opt("B");
      return opt("D");
    },
  });

  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const slotRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const dragged = React.useRef(false);
  const [ghost, setGhost] = React.useState<{ id: string; x: number; y: number } | null>(null);

  const slotAt = (x: number, y: number) => {
    for (let i = 0; i < 4; i++) {
      const el = slotRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i;
    }
    return null;
  };

  const { start } = usePointerDrag<string>({
    disabled: engine.readOnly,
    onStart: () => {
      dragged.current = false;
    },
    onMove: (p, id) => {
      dragged.current = true;
      setGhost({ id, x: p.x, y: p.y });
    },
    onEnd: (p, id) => {
      setGhost(null);
      const slot = slotAt(p.x, p.y);
      if (slot === null) return;
      engine.update((s) => ({
        touched: true,
        pieces: s.pieces.map((pc) => (pc.id === id ? { ...pc, corner: slot } : pc)),
      }));
    },
  });

  const toggleFill = (id: string) => {
    if (engine.readOnly || dragged.current) return;
    engine.update((s) => ({ touched: true, pieces: s.pieces.map((p) => (p.id === id ? { ...p, filled: !p.filled } : p)) }));
  };

  const summary = () => {
    if (!engine.state.touched) return undefined;
    const moved = engine.state.pieces.every((p) => p.corner === (START.find((x) => x.id === p.id)!.corner + 2) % 4);
    const inverted = engine.state.pieces.every((p) => p.filled !== START.find((x) => x.id === p.id)!.filled);
    if (moved && inverted) return "Shifted diagonally + shading inverted";
    if (moved) return "Shifted diagonally, shading unchanged";
    if (inverted) return "Shading inverted, positions unchanged";
    return "Partial / other transformation";
  };

  const Reference = ({ pieces, caption }: { pieces: Piece[]; caption: string }) => (
    <div className="text-center">
      <div className="relative w-[92px] h-[92px] mx-auto rounded-lg border-2 border-slate-300 bg-white">
        {pieces.map((p) => (
          <span key={p.id} className="absolute" style={{ ...CORNER_POS[p.corner], transform: "scale(0.78)" }}>
            <Glyph id={p.id} filled={p.filled} size={30} />
          </span>
        ))}
      </div>
      <span className="text-[10px] font-bold text-slate-500">{caption}</span>
    </div>
  );

  return (
    <ActivityShell
      icon={Replace}
      title="Figure Analogy Workbench"
      howTo="Study how (i) becomes (ii), then build (iv) yourself: drag each inner shape to a corner and tap a shape to swap its shading."
      answerText={summary()}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Move or re-shade at least one inner shape in figure (iv)."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[230px_1fr]">
        <Stage label="Given relationship">
          <div className="flex items-center justify-center gap-2">
            <Reference pieces={START} caption="(i)" />
            <span className="text-lg font-black text-slate-400">→</span>
            <Reference
              pieces={START.map((p) => ({ ...p, corner: (p.corner + 2) % 4, filled: !p.filled }))}
              caption="(ii)"
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Reference pieces={START} caption="(iii)" />
            <span className="text-lg font-black text-slate-400">→</span>
            <span className="w-[92px] h-[92px] grid place-items-center rounded-lg border-2 border-dashed border-emerald-400 text-emerald-600 font-black text-2xl">
              ?
            </span>
          </div>
        </Stage>

        <Stage label="Build figure (iv)">
          <div
            ref={frameRef}
            className="relative mx-auto w-[220px] h-[220px] rounded-xl border-2 border-slate-300 bg-white"
            style={{ touchAction: "none" }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                className="absolute w-[46%] h-[46%] rounded-lg border-2 border-dashed border-slate-200"
                style={{ left: i === 0 || i === 3 ? "3%" : "51%", top: i === 0 || i === 1 ? "3%" : "51%" }}
              />
            ))}
            {engine.state.pieces.map((p) => (
              <button
                key={p.id}
                type="button"
                onPointerDown={(e) => start(e, p.id)}
                onClick={() => toggleFill(p.id)}
                className={`absolute grid place-items-center w-[46%] h-[46%] rounded-lg transition-opacity ${
                  ghost?.id === p.id ? "opacity-20" : ""
                } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
                style={{
                  left: p.corner === 0 || p.corner === 3 ? "3%" : "51%",
                  top: p.corner === 0 || p.corner === 1 ? "3%" : "51%",
                  touchAction: "none",
                }}
              >
                <Glyph id={p.id} filled={p.filled} size={46} />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">Drag to move · tap to invert the shading</p>
        </Stage>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50" style={{ left: ghost.x - 20, top: ghost.y - 20 }}>
          <Glyph id={ghost.id} filled={engine.state.pieces.find((p) => p.id === ghost.id)?.filled ?? false} size={40} />
        </div>
      )}
    </ActivityShell>
  );
}

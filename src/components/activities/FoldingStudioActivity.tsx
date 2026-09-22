"use client";

import React from "react";
import { FoldHorizontal } from "lucide-react";
import { ActivityShell, Stage, ToggleRow, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q7 — Transparent sheet folding studio.
 *
 * The student picks a fold line and physically drags the flap across. The chevrons on the
 * moving half are genuinely mirrored onto the fixed half, so the superimposed pattern the
 * student produces is what gets classified into an option.
 */

type Axis = "vertical" | "horizontal" | "diagonal";
interface FoldState {
  axis: Axis;
  progress: number; // 0..1
  folds: number; // completed folds
}

const CHEVRONS = [30, 60, 90, 120, 150];

export function FoldingStudioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<FoldState>) {
  const engine = useActivityEngine<FoldState, string>({
    initialState: { axis: "vertical", progress: 0, folds: 0 },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const has = (id: string) => question?.multipleChoiceConfig?.options.find((o) => o.id === id)?.id;
      if (s.folds >= 2) return has("C"); // folded twice: chevrons collapse into parallel stripes
      if (s.progress < 0.95) return undefined;
      if (s.axis === "vertical") return has("A");
      if (s.axis === "horizontal") return has("B");
      return has("D");
    },
  });

  const s = engine.state;
  const sheetRef = React.useRef<HTMLDivElement | null>(null);

  const { start } = usePointerDrag({
    disabled: engine.readOnly,
    onMove: (p) => {
      const r = sheetRef.current?.getBoundingClientRect();
      if (!r) return;
      const frac =
        s.axis === "horizontal"
          ? (p.y - r.top) / r.height
          : (p.x - r.left) / r.width;
      engine.patch({ progress: Math.min(1, Math.max(0, (frac - 0) * 2)) });
    },
    onEnd: () =>
      engine.update((st) => ({
        ...st,
        progress: st.progress > 0.55 ? 1 : 0,
        folds: st.progress > 0.55 ? Math.min(2, st.folds + 1) : st.folds,
      })),
  });

  const folded = s.progress >= 0.95;
  const flapAngle = s.progress * 180;

  const resultName = s.folds >= 2
    ? "Parallel vertical stripes"
    : !folded
    ? null
    : s.axis === "vertical"
    ? "Superimposed crossed chevron diamond grid"
    : s.axis === "horizontal"
    ? "Single direction chevron pattern"
    : "Offset disconnected lines";

  const Chevrons = ({ mirror = false, dim = false }: { mirror?: boolean; dim?: boolean }) => (
    <g opacity={dim ? 0.55 : 1} transform={mirror ? "translate(120,0) scale(-1,1)" : undefined}>
      {CHEVRONS.map((y) => (
        <polyline
          key={y}
          points={`10,${y + 16} 60,${y} 110,${y + 16}`}
          fill="none"
          stroke={dim ? "#0ea5e9" : "#475569"}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
    </g>
  );

  return (
    <ActivityShell
      icon={FoldHorizontal}
      title="Transparent Sheet Folding Studio"
      howTo="Choose the fold line, then drag the flap right across the sheet. Release past halfway to complete the fold — the superimposed pattern you create is your answer."
      answerText={resultName ?? undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Drag the flap across the dotted fold line and release to complete the fold."
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <span className="text-[11px] font-mono font-bold text-slate-500">
          folds: {s.folds} · {Math.round(s.progress * 100)}%
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_210px]">
        <Stage label="Sheet">
          <div
            ref={sheetRef}
            onPointerDown={(e) => start(e, undefined)}
            className="relative mx-auto max-w-[320px] cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none", perspective: "800px" }}
          >
            <svg viewBox="0 0 240 200" className="w-full rounded-lg bg-white border border-slate-200">
              {/* Fixed half */}
              <g transform="translate(120,0)">
                <Chevrons />
              </g>
              {/* Mirrored image arriving from the folded flap */}
              {s.progress > 0.05 && (
                <g transform="translate(120,0)" opacity={s.progress}>
                  {s.axis === "vertical" && <Chevrons mirror dim />}
                  {s.axis === "horizontal" && (
                    <g transform="translate(0,200) scale(1,-1)">
                      <Chevrons dim />
                    </g>
                  )}
                  {s.axis === "diagonal" && (
                    <g transform="rotate(-38 60 100)">
                      <Chevrons dim />
                    </g>
                  )}
                </g>
              )}
              {s.folds >= 2 &&
                [20, 45, 70, 95].map((x) => (
                  <line key={x} x1={120 + x} y1={12} x2={120 + x} y2={188} stroke="#0ea5e9" strokeWidth={3} />
                ))}

              {/* Moving flap */}
              <g style={{ transformOrigin: "120px 100px", transform: `rotateY(${flapAngle}deg)`, transformStyle: "preserve-3d" }}>
                {s.progress < 0.98 && (
                  <g opacity={1 - s.progress * 0.5}>
                    <rect x={4} y={4} width={116} height={192} fill="#ffffff" stroke="#94a3b8" strokeWidth={1.5} />
                    <Chevrons />
                  </g>
                )}
              </g>

              {/* Fold line */}
              {s.axis === "vertical" && <line x1={120} y1={0} x2={120} y2={200} stroke="#e11d48" strokeWidth={2} strokeDasharray="6 5" />}
              {s.axis === "horizontal" && <line x1={0} y1={100} x2={240} y2={100} stroke="#e11d48" strokeWidth={2} strokeDasharray="6 5" />}
              {s.axis === "diagonal" && <line x1={0} y1={200} x2={240} y2={0} stroke="#e11d48" strokeWidth={2} strokeDasharray="6 5" />}
            </svg>
          </div>
        </Stage>

        <div className="space-y-2.5">
          <ToggleRow<Axis>
            label="Fold line"
            options={[
              { id: "vertical", label: "Vertical", sub: "the dotted middle line" },
              { id: "horizontal", label: "Horizontal", sub: "across the middle" },
              { id: "diagonal", label: "Diagonal", sub: "corner to corner" },
            ]}
            value={s.axis}
            onChange={(axis) => engine.update({ axis, progress: 0, folds: 0 })}
            readOnly={engine.readOnly}
          />
          {folded && s.folds < 2 && (
            <button
              type="button"
              disabled={engine.readOnly}
              onClick={() => engine.update((st) => ({ ...st, folds: 2 }))}
              className="w-full min-h-[44px] rounded-lg border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-emerald-400"
            >
              Fold the folded sheet again
            </button>
          )}
          <p className="text-[10px] text-slate-500 leading-snug">
            A transparent sheet keeps both patterns visible after folding — look at where the
            chevrons cross.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

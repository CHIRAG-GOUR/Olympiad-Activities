"use client";

import React from "react";
import { PieChart } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q23 — Fraction simplifying gearbox.
 *
 * The student drags divisor gears onto the fraction. A gear only bites when it divides BOTH
 * the numerator and the denominator, so the fraction the student grinds down is genuinely
 * derived, and its simplest form is mapped onto the matching option.
 */

interface GearState {
  num: number;
  den: number;
  applied: number[];
  rejected: number | null;
}

const GEARS = [2, 3, 5, 7, 11];

export function PieWorkshopActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<GearState>) {
  const engine = useActivityEngine<GearState, string>({
    initialState: { num: 12, den: 122, applied: [], rejected: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (!s.applied.length) return undefined;
      const canSimplify = GEARS.some((g) => s.num % g === 0 && s.den % g === 0);
      if (canSimplify) return undefined; // keep grinding until it is in simplest form
      const text = `${s.num} / ${s.den}`;
      const opts = question?.multipleChoiceConfig?.options || [];
      const hit = opts.find((o) => o.text.replace(/\s/g, "").startsWith(text.replace(/\s/g, "")));
      return hit ? hit.id : opts.find((o) => /none/i.test(o.text))?.id;
    },
  });

  const bayRef = React.useRef<HTMLDivElement | null>(null);
  const [ghost, setGhost] = React.useState<{ g: number; x: number; y: number } | null>(null);

  const overBay = (x: number, y: number) => {
    const r = bayRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const applyGear = (g: number) =>
    engine.update((s) => {
      if (s.num % g === 0 && s.den % g === 0) {
        return { num: s.num / g, den: s.den / g, applied: [...s.applied, g], rejected: null };
      }
      return { ...s, rejected: g };
    });

  const { start } = usePointerDrag<number>({
    disabled: engine.readOnly,
    onStart: (p, g) => setGhost({ g, x: p.x, y: p.y }),
    onMove: (p, g) => setGhost({ g, x: p.x, y: p.y }),
    onEnd: (p, g) => {
      setGhost(null);
      if (overBay(p.x, p.y)) applyGear(g);
    },
  });

  const s = engine.state;
  const simplest = !GEARS.some((g) => s.num % g === 0 && s.den % g === 0);

  return (
    <ActivityShell
      icon={PieChart}
      title="Fraction Simplifying Gearbox"
      howTo="Drag a divisor gear onto the fraction bay. A gear only bites when it divides the top and the bottom — keep grinding until nothing bites any more."
      answerText={engine.answer ? `${s.num} / ${s.den}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={s.applied.length ? "Keep going — a gear still bites." : "Drop a gear onto the fraction bay."}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <Stage label="Fraction bay — Tuesday visitors ÷ weekly total">
          <div
            ref={bayRef}
            className={`mx-auto w-[190px] rounded-xl border-2 p-4 text-center transition-colors ${
              simplest && s.applied.length ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white"
            }`}
          >
            <div className="font-mono text-4xl font-black text-slate-900 leading-none">{s.num}</div>
            <div className="h-0.5 bg-slate-800 my-2" />
            <div className="font-mono text-4xl font-black text-slate-900 leading-none">{s.den}</div>
          </div>

          {s.rejected !== null && (
            <div className="mt-2 text-center text-[11px] font-bold text-rose-600">
              Gear {s.rejected} slipped — it does not divide both numbers.
            </div>
          )}

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {s.applied.map((g, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                ÷{g}
              </span>
            ))}
          </div>
        </Stage>

        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Divisor gears</div>
          <div className="grid grid-cols-3 gap-1.5">
            {GEARS.map((g) => (
              <button
                key={g}
                type="button"
                disabled={engine.readOnly}
                onPointerDown={(e) => start(e, g)}
                onClick={() => applyGear(g)}
                className={`h-12 rounded-full border-2 border-dashed font-mono text-base font-black transition ${
                  engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"
                } bg-white border-slate-300 text-slate-800 hover:border-emerald-400`}
                style={{ touchAction: "none" }}
              >
                ÷{g}
              </button>
            ))}
          </div>
          <ReadOut label="Current fraction" value={`${s.num}/${s.den}`} tone={simplest && s.applied.length ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            12 people visited on Tuesday out of 122 for the whole week.
          </p>
        </div>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50 w-12 h-12 grid place-items-center rounded-full border-2 border-emerald-600 bg-white font-mono text-base font-black text-emerald-700 shadow-lg" style={{ left: ghost.x - 24, top: ghost.y - 24 }}>
          ÷{ghost.g}
        </div>
      )}
    </ActivityShell>
  );
}

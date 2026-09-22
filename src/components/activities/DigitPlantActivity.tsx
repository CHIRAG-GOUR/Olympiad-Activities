"use client";

import React from "react";
import { Sprout } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q37 — Digit planting beds.
 *
 * The student plants digit tiles into two six-slot beds to build the greatest and the
 * smallest number. The plant adds whatever the student actually built, and that sum is
 * the answer.
 */

interface PlantState {
  greatest: (number | null)[];
  smallest: (number | null)[];
  armed: number | null;
}

const DIGITS = [1, 4, 0, 6, 8];

export function DigitPlantActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<PlantState>) {
  const engine = useActivityEngine<PlantState, number>({
    initialState: { greatest: Array(6).fill(null), smallest: Array(6).fill(null), armed: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (s.greatest.some((d) => d === null) || s.smallest.some((d) => d === null)) return undefined;
      const g = Number(s.greatest.join(""));
      const m = Number(s.smallest.join(""));
      if (g < 100000 || m < 100000) return undefined; // both must be genuine 6-digit numbers
      return g + m;
    },
  });

  const slotRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [ghost, setGhost] = React.useState<{ d: number; x: number; y: number } | null>(null);

  const slotAt = (x: number, y: number) => {
    for (const k of Object.keys(slotRefs.current)) {
      const el = slotRefs.current[k];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return k;
    }
    return null;
  };

  const plant = (slotKey: string, digit: number | null) => {
    const [bed, idxStr] = slotKey.split(":");
    const idx = Number(idxStr);
    engine.update((s) => {
      const next = (bed === "g" ? s.greatest : s.smallest).slice();
      next[idx] = digit;
      return bed === "g" ? { ...s, greatest: next, armed: null } : { ...s, smallest: next, armed: null };
    });
  };

  const { start } = usePointerDrag<number>({
    disabled: engine.readOnly,
    onStart: (p, d) => setGhost({ d, x: p.x, y: p.y }),
    onMove: (p, d) => setGhost({ d, x: p.x, y: p.y }),
    onEnd: (p, d) => {
      setGhost(null);
      const slot = slotAt(p.x, p.y);
      if (slot) plant(slot, d);
    },
  });

  const Bed = ({ bed, label }: { bed: "g" | "s"; label: string }) => {
    const row = bed === "g" ? engine.state.greatest : engine.state.smallest;
    const num = row.every((d) => d !== null) ? Number(row.join("")) : null;
    return (
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
        <div className="flex gap-1">
          {row.map((d, i) => (
            <div
              key={i}
              ref={(el) => {
                slotRefs.current[`${bed}:${i}`] = el;
              }}
              onClick={() => {
                if (engine.readOnly) return;
                if (engine.state.armed !== null) plant(`${bed}:${i}`, engine.state.armed);
                else if (d !== null) plant(`${bed}:${i}`, null);
              }}
              className={`flex-1 aspect-[3/4] max-w-[46px] rounded-lg border-2 grid place-items-center font-mono text-xl font-black transition ${
                d === null
                  ? engine.state.armed !== null
                    ? "border-emerald-500 border-dashed bg-emerald-50 cursor-pointer text-emerald-500"
                    : "border-dashed border-slate-300 bg-white text-slate-300"
                  : "border-emerald-500 bg-emerald-50 text-emerald-800 cursor-pointer"
              }`}
            >
              {d ?? "·"}
            </div>
          ))}
        </div>
        <div className="mt-1 font-mono text-sm font-black text-slate-700">
          {num !== null ? num.toLocaleString("en-IN") : "incomplete"}
        </div>
      </div>
    );
  };

  return (
    <ActivityShell
      icon={Sprout}
      title="Digit Planting Beds"
      howTo="Drag digits into the two beds (or tap a digit, then a slot) to plant the greatest and the smallest six-digit numbers. The plant adds the two numbers you built."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? "sum of your two numbers" : undefined}
      pendingHint="Fill all six slots in both beds with genuine six-digit numbers."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <Stage label="Planting beds — digits 1, 4, 0, 6, 8 (one digit may be repeated)">
          <div className="space-y-3">
            <Bed bed="g" label="Greatest six-digit number" />
            <Bed bed="s" label="Smallest six-digit number" />
          </div>
        </Stage>

        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Digit seeds</div>
          <div className="grid grid-cols-5 gap-1.5">
            {DIGITS.map((d) => (
              <button
                key={d}
                type="button"
                disabled={engine.readOnly}
                onPointerDown={(e) => start(e, d)}
                onClick={() => engine.update((s) => ({ ...s, armed: s.armed === d ? null : d }))}
                className={`h-11 rounded-lg border-2 font-mono text-lg font-black transition ${
                  engine.state.armed === d ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white border-slate-200 text-slate-800 hover:border-emerald-400"
                } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
                style={{ touchAction: "none" }}
              >
                {d}
              </button>
            ))}
          </div>
          <ReadOut label="Sum" value={engine.answer?.toLocaleString("en-IN") ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Tap a planted digit to lift it out again.
          </p>
        </div>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50 w-10 h-10 grid place-items-center rounded-lg border-2 border-emerald-600 bg-white font-mono text-lg font-black text-emerald-700 shadow-lg" style={{ left: ghost.x - 20, top: ghost.y - 20 }}>
          {ghost.d}
        </div>
      )}
    </ActivityShell>
  );
}

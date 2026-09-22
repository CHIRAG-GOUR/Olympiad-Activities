"use client";

import React from "react";
import { Factory } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q12 — Operator swap factory.
 *
 * The student drags replacement operator tiles into the three slots of the expression.
 * The machine then evaluates the expression they built under BODMAS, and that computed
 * value is the answer.
 */

type Op = "+" | "-" | "*" | "/";
interface FactoryState {
  slots: (Op | null)[];
}

const NUMBERS = [510, 17, 15, 2];
const ORIGINAL: Op[] = ["+", "*", "/"];
const GLYPH: Record<Op, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const SWAP_RULES: { from: Op; to: Op }[] = [
  { from: "*", to: "-" },
  { from: "-", to: "+" },
  { from: "+", to: "/" },
  { from: "/", to: "*" },
];

function evaluate(nums: number[], ops: Op[]): number | undefined {
  const n = nums.slice();
  const o = ops.slice();
  for (let i = 0; i < o.length; ) {
    if (o[i] === "*" || o[i] === "/") {
      const r = o[i] === "*" ? n[i] * n[i + 1] : n[i + 1] === 0 ? NaN : n[i] / n[i + 1];
      if (!Number.isFinite(r)) return undefined;
      n.splice(i, 2, r);
      o.splice(i, 1);
    } else i++;
  }
  let acc = n[0];
  for (let i = 0; i < o.length; i++) acc = o[i] === "+" ? acc + n[i + 1] : acc - n[i + 1];
  return Number.isFinite(acc) ? Number(acc.toFixed(6)) : undefined;
}

export function OperatorFactoryActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<FactoryState>) {
  const engine = useActivityEngine<FactoryState, number>({
    initialState: { slots: [null, null, null] },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.slots.every(Boolean) ? evaluate(NUMBERS, s.slots as Op[]) : undefined),
  });

  const slotRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [ghost, setGhost] = React.useState<{ op: Op; x: number; y: number } | null>(null);
  const [armed, setArmed] = React.useState<Op | null>(null);

  const slotAt = (x: number, y: number) => {
    for (let i = 0; i < slotRefs.current.length; i++) {
      const el = slotRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) return i;
    }
    return null;
  };

  const { start } = usePointerDrag<Op>({
    disabled: engine.readOnly,
    onStart: (p, op) => setGhost({ op, x: p.x, y: p.y }),
    onMove: (p, op) => setGhost({ op, x: p.x, y: p.y }),
    onEnd: (p, op) => {
      setGhost(null);
      const slot = slotAt(p.x, p.y);
      if (slot === null) return;
      engine.update((s) => {
        const slots = s.slots.slice();
        slots[slot] = op;
        return { slots };
      });
    },
  });

  const placeArmed = (i: number) => {
    if (!armed || engine.readOnly) return;
    engine.update((s) => {
      const slots = s.slots.slice();
      slots[i] = armed;
      return { slots };
    });
    setArmed(null);
  };

  const built = engine.state.slots;
  const expression = NUMBERS.map((n, i) => `${n}${built[i] ? ` ${GLYPH[built[i]!]} ` : ""}`).join("");

  return (
    <ActivityShell
      icon={Factory}
      title="Operator Swap Factory"
      howTo="Drag a replacement operator onto each grey slot (or tap a tile then a slot). The factory evaluates the expression you build using BODMAS — its output is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? "Machine output" : undefined}
      pendingHint={`Fill all three slots — ${built.filter(Boolean).length} of 3 placed.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <div className="space-y-3">
          <Stage label="Conveyor — original expression">
            <div className="flex items-center justify-center gap-2 font-mono text-xl font-black text-slate-500">
              {NUMBERS.map((n, i) => (
                <React.Fragment key={i}>
                  <span>{n}</span>
                  {i < ORIGINAL.length && <span className="text-slate-400">{GLYPH[ORIGINAL[i]]}</span>}
                </React.Fragment>
              ))}
            </div>
          </Stage>

          <Stage label="Rebuilt expression — drop operators here">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-2xl font-black text-slate-900">
              {NUMBERS.map((n, i) => (
                <React.Fragment key={i}>
                  <span>{n}</span>
                  {i < 3 && (
                    <div
                      ref={(el) => {
                        slotRefs.current[i] = el;
                      }}
                      onClick={() => placeArmed(i)}
                      className={`w-12 h-12 grid place-items-center rounded-lg border-2 transition-colors ${
                        built[i]
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                          : armed
                          ? "border-emerald-500 border-dashed bg-emerald-50/50 cursor-pointer"
                          : "border-dashed border-slate-400 bg-white text-slate-300"
                      }`}
                    >
                      {built[i] ? GLYPH[built[i]!] : "?"}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {built.every(Boolean) && (
              <div className="mt-3 text-center font-mono text-sm text-slate-600">
                {expression.trim()} = <span className="font-black text-emerald-700">{engine.answer}</span>
              </div>
            )}
          </Stage>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Operator tiles — drag or tap
            </div>
            <div className="flex gap-2">
              {(["+", "-", "*", "/"] as Op[]).map((op) => (
                <button
                  key={op}
                  type="button"
                  disabled={engine.readOnly}
                  onPointerDown={(e) => start(e, op)}
                  onClick={() => setArmed((a) => (a === op ? null : op))}
                  className={`w-14 h-14 rounded-xl border-2 font-mono text-2xl font-black transition ${
                    armed === op ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white border-slate-300 text-slate-800 hover:border-emerald-400"
                  } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
                  style={{ touchAction: "none" }}
                >
                  {GLYPH[op]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="rounded-xl border-2 border-slate-200 bg-white p-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Swap rules</div>
            <div className="space-y-1">
              {SWAP_RULES.map((r) => (
                <div key={r.from} className="flex items-center gap-2 font-mono text-sm font-black text-slate-700">
                  <span className="w-7 h-7 grid place-items-center rounded bg-slate-100">{GLYPH[r.from]}</span>
                  <span className="text-slate-400 text-xs">becomes</span>
                  <span className="w-7 h-7 grid place-items-center rounded bg-emerald-100 text-emerald-800">{GLYPH[r.to]}</span>
                </div>
              ))}
            </div>
          </div>
          <ReadOut label="Machine output" value={engine.answer ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
          <p className="text-[10px] text-slate-500 leading-snug">
            The factory applies BODMAS: × and ÷ run before + and −.
          </p>
        </div>
      </div>

      {ghost && (
        <div
          className="pointer-events-none fixed z-50 w-12 h-12 grid place-items-center rounded-lg border-2 border-emerald-600 bg-white font-mono text-2xl font-black text-emerald-700 shadow-lg"
          style={{ left: ghost.x - 24, top: ghost.y - 24 }}
        >
          {GLYPH[ghost.op]}
        </div>
      )}
    </ActivityShell>
  );
}

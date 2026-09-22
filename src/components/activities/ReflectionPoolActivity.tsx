"use client";

import React from "react";
import { Waves } from "lucide-react";
import { ActivityShell, Stage, SwitchToggle, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q6 — Reflection pool.
 *
 * The student drags the waterline up to the word and switches on the transformations they
 * think a water image performs. The reflection is rendered from those transformations, and
 * the transformation set they build is mapped onto the matching option.
 */

interface PoolState {
  water: number; // 0..1 height of the waterline
  flipV: boolean;
  reverse: boolean;
  rotate180: boolean;
  vowelsOnly: boolean;
}

const WORD = "WELCOME";
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function ReflectionPoolActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<PoolState>) {
  const engine = useActivityEngine<PoolState, string>({
    initialState: { water: 0.25, flipV: false, reverse: false, rotate180: false, vowelsOnly: false },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const opts = question?.multipleChoiceConfig?.options || [];
      const pick = (id: string) => opts.find((o) => o.id === id)?.id;
      if (s.water < 0.4) return undefined; // the word must actually touch the water
      if (s.vowelsOnly) return pick("D");
      if (s.rotate180) return pick("C");
      if (s.flipV && s.reverse) return pick("B");
      if (s.flipV) return pick("A");
      return undefined;
    },
  });

  const s = engine.state;
  const poolRef = React.useRef<HTMLDivElement | null>(null);
  const { start } = usePointerDrag({
    disabled: engine.readOnly,
    onStart: (p) => engine.patch({ water: clamp(1 - p.fracY, 0.05, 0.62) }),
    onMove: (p) => {
      const r = poolRef.current?.getBoundingClientRect();
      if (!r) return;
      engine.patch({ water: clamp(1 - (p.y - r.top) / r.height, 0.05, 0.62) });
    },
  });

  const letters = (s.reverse ? WORD.split("").reverse() : WORD.split(""));
  const submerged = s.water >= 0.4;

  const describe = () => {
    const parts: string[] = [];
    if (s.flipV) parts.push("flipped top-to-bottom");
    if (s.reverse) parts.push("letter order reversed");
    if (s.rotate180) parts.push("rotated 180°");
    if (s.vowelsOnly) parts.push("vowels only inverted");
    return parts.length ? parts.join(" + ") : null;
  };

  return (
    <ActivityShell
      icon={Waves}
      title="Reflection Pool Bench"
      howTo="Drag the waterline up until the word meets the surface, then switch on the transformations a water image really performs. The reflection you build is your answer."
      answerText={engine.answer ? describe() ?? undefined : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={submerged ? "Switch on the transformations that form the water image." : "Drag the waterline up to the word."}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <Stage label="Pool">
          <div
            ref={poolRef}
            onPointerDown={(e) => start(e, undefined)}
            className="relative h-[220px] rounded-xl bg-gradient-to-b from-white to-sky-50 overflow-hidden border border-slate-200 cursor-ns-resize"
            style={{ touchAction: "none" }}
          >
            {/* The word standing above the pool */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex gap-0.5 font-black text-3xl text-slate-900"
              style={{ bottom: `calc(${s.water * 100}% + 4px)` }}
            >
              {WORD.split("").map((ch, i) => (
                <span key={i}>{ch}</span>
              ))}
            </div>

            {/* Water body */}
            <div
              className="absolute inset-x-0 bottom-0 bg-sky-200/50 border-t-2 border-sky-400 backdrop-blur-[1px]"
              style={{ height: `${s.water * 100}%` }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-1 flex gap-0.5 font-black text-3xl text-sky-800/70">
                {letters.map((ch, i) => {
                  const flip = s.vowelsOnly ? VOWELS.has(ch) : s.flipV;
                  const transforms = [flip ? "scaleY(-1)" : "", s.rotate180 ? "rotate(180deg)" : ""].filter(Boolean).join(" ");
                  return (
                    <span key={i} style={{ display: "inline-block", transform: transforms || undefined }}>
                      {ch}
                    </span>
                  );
                })}
              </div>
            </div>

            <div
              className="absolute right-2 text-[10px] font-mono font-bold text-sky-700"
              style={{ bottom: `calc(${s.water * 100}% + 2px)` }}
            >
              waterline
            </div>
          </div>
        </Stage>

        <div className="space-y-2">
          <SwitchToggle label="Flip top-to-bottom" sub="Mirror across the waterline" on={s.flipV} onChange={(v) => engine.patch({ flipV: v })} readOnly={engine.readOnly} />
          <SwitchToggle label="Reverse letter order" sub="Last letter first" on={s.reverse} onChange={(v) => engine.patch({ reverse: v })} readOnly={engine.readOnly} />
          <SwitchToggle label="Rotate each letter 180°" sub="Turn, do not mirror" on={s.rotate180} onChange={(v) => engine.patch({ rotate180: v })} readOnly={engine.readOnly} />
          <SwitchToggle label="Invert vowels only" sub="Leave consonants upright" on={s.vowelsOnly} onChange={(v) => engine.patch({ vowelsOnly: v })} readOnly={engine.readOnly} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Watch letters such as W, E and M in the reflection — a true water image mirrors across the
            surface without re-ordering the word.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

"use client";

import React from "react";
import { Grid3x3 } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps, optionIdByText, optionLabel } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q2 — Letter matrix circuit.
 *
 * The student slides a live alphabet carriage into the empty cell of the matrix. The grid
 * recomputes its row and column steps from the letter actually placed, so the placement
 * itself is the answer; it is mapped onto the source option that names that letter.
 */

interface LetterState {
  index: number | null; // 0..25
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ROWS = [
  ["U", "X", "Z"],
  ["M", "P", "R"],
  ["L", null, "Q"],
];
const code = (c: string) => ALPHABET.indexOf(c);

export function LetterCircuitActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<LetterState>) {
  const engine = useActivityEngine<LetterState, string>({
    initialState: { index: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (s.index === null) return undefined;
      const letter = ALPHABET[s.index];
      return optionIdByText(question, (t) => t.trim().toUpperCase().startsWith(letter));
    },
  });

  const letter = engine.state.index === null ? null : ALPHABET[engine.state.index];
  const railRef = React.useRef<HTMLDivElement | null>(null);

  const pick = (clientX: number) => {
    const r = railRef.current?.getBoundingClientRect();
    if (!r) return;
    const frac = Math.min(0.999, Math.max(0, (clientX - r.left) / r.width));
    engine.update({ index: Math.floor(frac * 26) });
  };

  const { start } = usePointerDrag({
    disabled: engine.readOnly,
    onStart: (p) => pick(p.x),
    onMove: (p) => pick(p.x),
  });

  const stepRight = letter ? code("Q") - code(letter) : null;
  const stepLeft = letter ? code(letter) - code("L") : null;
  const colStep = letter ? code(letter) - code("P") : null;

  return (
    <ActivityShell
      icon={Grid3x3}
      title="Letter Circuit Matrix"
      howTo="Drag the alphabet carriage to slot a letter into the empty cell. The matrix recalculates its row and column steps live from the letter you place."
      answerText={letter ? letter : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="Slide a letter into the empty cell of row 3."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
        <Stage label="Letter matrix">
          <div className="grid grid-cols-3 gap-2 max-w-[320px] mx-auto">
            {ROWS.flatMap((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`aspect-square rounded-xl border-2 grid place-items-center font-black text-2xl ${
                    cell === null
                      ? letter
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "bg-white border-dashed border-slate-400 text-slate-300"
                      : "bg-white border-slate-300 text-slate-800"
                  }`}
                >
                  {cell ?? letter ?? "?"}
                </div>
              ))
            )}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500">
            <span>Row 1 steps: +3, +2</span>
            <span>Row 2 steps: +3, +2</span>
            <span className={letter ? "text-emerald-700 font-bold" : ""}>
              Row 3 steps: {stepLeft !== null ? `${stepLeft >= 0 ? "+" : ""}${stepLeft}` : "?"},{" "}
              {stepRight !== null ? `${stepRight >= 0 ? "+" : ""}${stepRight}` : "?"}
            </span>
          </div>
        </Stage>

        <div className="space-y-2.5">
          <ReadOut label="Letter placed" value={letter ?? "—"} tone={letter ? "emerald" : "slate"} />
          <ReadOut label="Column step (from P)" value={colStep === null ? "—" : `${colStep >= 0 ? "+" : ""}${colStep}`} />
          <p className="text-[10px] text-slate-500 leading-snug">
            Compare your row 3 steps with rows 1 and 2, and your column step with the column above.
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Alphabet carriage — drag to choose
        </div>
        <div
          ref={railRef}
          onPointerDown={(e) => start(e, undefined)}
          className="flex rounded-xl border-2 border-slate-300 bg-white overflow-hidden cursor-pointer"
          style={{ touchAction: "none" }}
        >
          {ALPHABET.map((ch, i) => (
            <span
              key={ch}
              className={`flex-1 py-2.5 text-center text-[11px] font-black transition-colors ${
                i === engine.state.index ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-emerald-50"
              }`}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </ActivityShell>
  );
}

"use client";

import React from "react";
import { Landmark } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q33 — Roman decoder table.
 *
 * Four excavated tablet pairs. The student drags a pair onto the decoder, which really
 * parses the Roman numerals and subtracts them. The value the decoder prints for the pair
 * the student chose to test is the answer.
 */

interface RomanState {
  loaded: string | null;
}

const PAIRS = [
  { id: "P1", a: "MMMCLXIX", b: "MMDCCXVII" },
  { id: "P2", a: "MMCDLXV", b: "MCCXLIV" },
  { id: "P3", a: "DCCCXCIX", b: "CDXLVII" },
  { id: "P4", a: "MMDCCIX", b: "MMCDIII" },
];

const VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

function fromRoman(s: string) {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = VALUES[s[i]] || 0;
    const next = VALUES[s[i + 1]] || 0;
    total += v < next ? -v : v;
  }
  return total;
}

export function RomanArchaeologyActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<RomanState>) {
  const engine = useActivityEngine<RomanState, number>({
    initialState: { loaded: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const pair = PAIRS.find((p) => p.id === s.loaded);
      return pair ? fromRoman(pair.a) - fromRoman(pair.b) : undefined;
    },
  });

  const deckRef = React.useRef<HTMLDivElement | null>(null);
  const [ghost, setGhost] = React.useState<{ id: string; x: number; y: number } | null>(null);

  const overDeck = (x: number, y: number) => {
    const r = deckRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const { start } = usePointerDrag<string>({
    disabled: engine.readOnly,
    onStart: (p, id) => setGhost({ id, x: p.x, y: p.y }),
    onMove: (p, id) => setGhost({ id, x: p.x, y: p.y }),
    onEnd: (p, id) => {
      setGhost(null);
      if (overDeck(p.x, p.y)) engine.update({ loaded: id });
    },
  });

  const pair = PAIRS.find((p) => p.id === engine.state.loaded);
  const results = PAIRS.map((p) => ({ p, v: fromRoman(p.a) - fromRoman(p.b) }));
  const least = Math.min(...results.map((r) => r.v));

  return (
    <ActivityShell
      icon={Landmark}
      title="Roman Tablet Decoder"
      howTo="Drag an excavated tablet pair onto the decoder table. The decoder really parses the numerals and subtracts them — load each pair to find which subtraction gives the least value."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={pair ? `${pair.a} − ${pair.b}` : undefined}
      pendingHint="Drag a tablet pair onto the decoder."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
        <Stage label="Decoder table">
          <div
            ref={deckRef}
            className={`mx-auto max-w-[320px] rounded-2xl border-4 p-4 text-center ${
              pair ? "border-emerald-500 bg-emerald-50" : "border-dashed border-slate-400 bg-white"
            }`}
          >
            {pair ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3 font-serif text-lg font-black tracking-wider text-slate-800">
                  <span>{pair.a}</span>
                  <span className="text-slate-400">−</span>
                  <span>{pair.b}</span>
                </div>
                <div className="flex items-center justify-center gap-3 font-mono text-base font-bold text-slate-600">
                  <span>{fromRoman(pair.a)}</span>
                  <span className="text-slate-400">−</span>
                  <span>{fromRoman(pair.b)}</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-2xl font-black text-emerald-700">{engine.answer}</span>
                </div>
                {engine.answer === least && (
                  <div className="text-[11px] font-bold text-emerald-700">This is the least value of the four pairs.</div>
                )}
              </div>
            ) : (
              <div className="py-6 text-sm font-semibold text-slate-400">Drop a tablet pair here</div>
            )}
          </div>
        </Stage>

        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Excavated tablets</div>
          {PAIRS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={engine.readOnly}
              onPointerDown={(e) => start(e, p.id)}
              onClick={() => engine.update({ loaded: p.id })}
              className={`w-full rounded-xl border-2 px-2.5 py-2 text-left font-serif text-xs font-bold tracking-wide transition ${
                engine.state.loaded === p.id ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-white border-slate-200 text-slate-800 hover:border-emerald-400"
              } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
              style={{ touchAction: "none" }}
            >
              {p.a} − {p.b}
            </button>
          ))}
          <ReadOut label="Decoded value" value={engine.answer ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
        </div>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50 rounded-lg border-2 border-emerald-600 bg-white px-2 py-1 font-serif text-xs font-bold shadow-lg" style={{ left: ghost.x + 8, top: ghost.y + 8 }}>
          {PAIRS.find((p) => p.id === ghost.id)?.a}
        </div>
      )}
    </ActivityShell>
  );
}

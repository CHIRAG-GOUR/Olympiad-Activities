"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q44 — Roman-label checkout.
 *
 * Each crate is labelled in Roman numerals. Dragging a crate over the scanner decodes it
 * for real and adds it to the running bill; the bill total is the answer.
 */

interface CheckoutState {
  scanned: string[];
}

const CRATES = [
  { id: "apples", label: "Apples", roman: "MCDLXX" },
  { id: "oranges", label: "Oranges", roman: "CMXLVIII" },
  { id: "melons", label: "Watermelons", roman: "MCCCXCIX" },
];

const VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
const fromRoman = (s: string) =>
  s.split("").reduce((t, ch, i) => t + (VALUES[ch] < (VALUES[s[i + 1]] || 0) ? -VALUES[ch] : VALUES[ch]), 0);

export function MarketCheckoutActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<CheckoutState>) {
  const engine = useActivityEngine<CheckoutState, number>({
    initialState: { scanned: [] },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) =>
      s.scanned.length
        ? s.scanned.reduce((t, id) => t + fromRoman(CRATES.find((c) => c.id === id)!.roman), 0)
        : undefined,
  });

  const scannerRef = React.useRef<HTMLDivElement | null>(null);
  const [ghost, setGhost] = React.useState<{ id: string; x: number; y: number } | null>(null);

  const toggle = (id: string) =>
    engine.update((s) => ({
      scanned: s.scanned.includes(id) ? s.scanned.filter((x) => x !== id) : [...s.scanned, id],
    }));

  const overScanner = (x: number, y: number) => {
    const r = scannerRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const { start } = usePointerDrag<string>({
    disabled: engine.readOnly,
    onStart: (p, id) => setGhost({ id, x: p.x, y: p.y }),
    onMove: (p, id) => setGhost({ id, x: p.x, y: p.y }),
    onEnd: (p, id) => {
      setGhost(null);
      if (overScanner(p.x, p.y) && !engine.state.scanned.includes(id)) toggle(id);
    },
  });

  return (
    <ActivityShell
      icon={ShoppingCart}
      title="Roman-Label Checkout"
      howTo="Drag each crate across the scanner. The scanner decodes its Roman label into a number and adds it to the bill — the bill total is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${engine.state.scanned.length} crate(s) scanned` : undefined}
      pendingHint="Drag a crate onto the scanner window."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_210px]">
        <Stage label="Checkout counter">
          <div
            ref={scannerRef}
            className={`rounded-xl border-4 p-3 ${engine.state.scanned.length ? "border-emerald-500 bg-emerald-50" : "border-dashed border-slate-400 bg-white"}`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Scanner bill</div>
            {engine.state.scanned.length ? (
              <div className="space-y-1">
                {engine.state.scanned.map((id) => {
                  const c = CRATES.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="font-serif tracking-wide">{c.label} — {c.roman}</span>
                      <span className="font-mono text-emerald-700">{fromRoman(c.roman)}</span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between border-t border-slate-300 pt-1 mt-1 text-sm font-black">
                  <span>Total fruits</span>
                  <span className="font-mono text-emerald-700">{engine.answer}</span>
                </div>
              </div>
            ) : (
              <div className="py-5 text-center text-sm font-semibold text-slate-400">Drag a crate here</div>
            )}
          </div>
        </Stage>

        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Crates</div>
          {CRATES.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={engine.readOnly}
              onPointerDown={(e) => start(e, c.id)}
              onClick={() => toggle(c.id)}
              className={`w-full rounded-xl border-2 px-2.5 py-2 text-left transition ${
                engine.state.scanned.includes(c.id) ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-200 hover:border-emerald-400"
              } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
              style={{ touchAction: "none" }}
            >
              <span className="block text-xs font-black text-slate-900">{c.label}</span>
              <span className="block font-serif text-sm font-bold tracking-wider text-slate-600">{c.roman}</span>
            </button>
          ))}
          <ReadOut label="Bill total" value={engine.answer ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
        </div>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50 rounded-lg border-2 border-emerald-600 bg-white px-2 py-1 font-serif text-xs font-bold shadow-lg" style={{ left: ghost.x + 8, top: ghost.y + 8 }}>
          {CRATES.find((c) => c.id === ghost.id)?.roman}
        </div>
      )}
    </ActivityShell>
  );
}

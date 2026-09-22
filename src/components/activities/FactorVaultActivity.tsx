"use client";

import React from "react";
import { Vault } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q32 — Common factor vault.
 *
 * The student drags candidate tiles at the vault slot. Only a genuine common factor of 32
 * and 48 is accepted; the vault multiplies everything it swallows, and that running product
 * is the answer.
 */

interface VaultState {
  accepted: number[];
  rejected: number | null;
}

const CANDIDATES = [1, 2, 3, 4, 5, 6, 8, 12, 16, 24, 32, 48];
const divides = (n: number) => 32 % n === 0 && 48 % n === 0;

export function FactorVaultActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<VaultState>) {
  const engine = useActivityEngine<VaultState, number>({
    initialState: { accepted: [], rejected: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.accepted.length ? s.accepted.reduce((a, b) => a * b, 1) : undefined),
  });

  const slotRef = React.useRef<HTMLDivElement | null>(null);
  const [ghost, setGhost] = React.useState<{ n: number; x: number; y: number } | null>(null);

  const feed = (n: number) =>
    engine.update((s) => {
      if (s.accepted.includes(n)) return { ...s, accepted: s.accepted.filter((x) => x !== n), rejected: null };
      if (divides(n)) return { accepted: [...s.accepted, n], rejected: null };
      return { ...s, rejected: n };
    });

  const overSlot = (x: number, y: number) => {
    const r = slotRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const { start } = usePointerDrag<number>({
    disabled: engine.readOnly,
    onStart: (p, n) => setGhost({ n, x: p.x, y: p.y }),
    onMove: (p, n) => setGhost({ n, x: p.x, y: p.y }),
    onEnd: (p, n) => {
      setGhost(null);
      if (overSlot(p.x, p.y)) feed(n);
    },
  });

  const accepted = engine.state.accepted;

  return (
    <ActivityShell
      icon={Vault}
      title="Common Factor Vault"
      howTo="Drag number tiles into the vault slot. The vault only swallows genuine common factors of 32 and 48, and multiplies everything it accepts — that product is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={accepted.length ? accepted.join(" × ") : undefined}
      pendingHint="Feed the vault every common factor of 32 and 48."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <Stage label="Vault slot">
          <div
            ref={slotRef}
            className={`mx-auto max-w-[280px] rounded-2xl border-4 p-4 text-center transition-colors ${
              accepted.length ? "border-emerald-500 bg-emerald-50" : "border-dashed border-slate-400 bg-white"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Accepted factors</div>
            <div className="flex flex-wrap justify-center gap-1.5 my-2 min-h-[30px]">
              {accepted.map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={engine.readOnly}
                  onClick={() => feed(n)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono text-sm font-black"
                >
                  {n}
                </button>
              ))}
              {!accepted.length && <span className="text-xs text-slate-400 italic">empty</span>}
            </div>
            <div className="font-mono text-2xl font-black text-slate-900">
              {accepted.length ? accepted.reduce((a, b) => a * b, 1) : "—"}
            </div>
          </div>

          {engine.state.rejected !== null && (
            <div className="mt-2 text-center text-[11px] font-bold text-rose-600">
              The vault spat out {engine.state.rejected} — it does not divide both 32 and 48.
            </div>
          )}
        </Stage>

        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Candidate tiles</div>
          <div className="grid grid-cols-4 gap-1.5">
            {CANDIDATES.map((n) => (
              <button
                key={n}
                type="button"
                disabled={engine.readOnly}
                onPointerDown={(e) => start(e, n)}
                onClick={() => feed(n)}
                className={`h-11 rounded-lg border-2 font-mono text-sm font-black transition ${
                  accepted.includes(n)
                    ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                    : "bg-white border-slate-200 text-slate-800 hover:border-emerald-400"
                } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
                style={{ touchAction: "none" }}
              >
                {n}
              </button>
            ))}
          </div>
          <ReadOut label="Running product" value={engine.answer ?? "—"} tone={engine.answer !== undefined ? "emerald" : "slate"} />
        </div>
      </div>

      {ghost && (
        <div className="pointer-events-none fixed z-50 w-11 h-11 grid place-items-center rounded-lg border-2 border-emerald-600 bg-white font-mono text-sm font-black text-emerald-700 shadow-lg" style={{ left: ghost.x - 22, top: ghost.y - 22 }}>
          {ghost.n}
        </div>
      )}
    </ActivityShell>
  );
}

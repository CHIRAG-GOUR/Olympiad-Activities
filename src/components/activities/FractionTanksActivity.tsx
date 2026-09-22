"use client";

import React from "react";
import { Container } from "lucide-react";
import { ActivityShell, Stage, ConnectPairs, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q28 — Fraction model tanks.
 *
 * The student shades the two tanks by tapping segments. Each tank reduces its own fraction
 * live, and the reduced value wires itself to Column B — including the comparison row, which
 * follows from the two tanks the student actually filled.
 */

interface TankState {
  p: number[];
  q: number[];
}

const MODELS: Record<string, { parts: number; target: number }> = {
  m_p: { parts: 12, target: 8 },
  m_q: { parts: 6, target: 3 },
};

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const reduce = (n: number, d: number) => {
  const g = gcd(n, d) || 1;
  return [n / g, d / g] as const;
};

export function FractionTanksActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<TankState>) {
  const cfg = question?.matchingConfig;

  const wiring = React.useCallback(
    (s: TankState) => {
      if (!cfg) return [];
      const pairs: { leftId: string; rightId: string }[] = [];
      const used = new Set<string>();
      const shaded = { m_p: new Set(s.p).size, m_q: new Set(s.q).size };

      (["m_p", "m_q"] as const).forEach((id) => {
        const model = MODELS[id];
        if (!shaded[id]) return;
        const [n, d] = reduce(shaded[id], model.parts);
        const match = cfg.rightItems.find((r) => !used.has(r.id) && r.text.replace(/\s/g, "").startsWith(`${n}/${d}`));
        if (match) {
          used.add(match.id);
          pairs.push({ leftId: id, rightId: match.id });
        }
      });

      if (shaded.m_p && shaded.m_q) {
        const vp = shaded.m_p / MODELS.m_p.parts;
        const vq = shaded.m_q / MODELS.m_q.parts;
        const symbol = vp > vq ? "P > Q" : vp < vq ? "P < Q" : "P = Q";
        const match = cfg.rightItems.find((r) => !used.has(r.id) && r.text.replace(/\s/g, "") === symbol.replace(/\s/g, ""));
        if (match) pairs.push({ leftId: "comp", rightId: match.id });
      }
      return pairs;
    },
    [cfg]
  );

  const engine = useActivityEngine<TankState, { leftId: string; rightId: string }[]>({
    initialState: { p: [], q: [] },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const pairs = wiring(s);
      return cfg && pairs.length === cfg.leftItems.length ? pairs : undefined;
    },
  });

  const toggle = (tank: "p" | "q", i: number) =>
    engine.update((s) => {
      const next = new Set(s[tank]);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return { ...s, [tank]: Array.from(next) };
    });

  const Tank = ({ id }: { id: "m_p" | "m_q" }) => {
    const key = id === "m_p" ? "p" : "q";
    const model = MODELS[id];
    const shaded = new Set(engine.state[key]);
    const [n, d] = shaded.size ? reduce(shaded.size, model.parts) : [0, model.parts];
    return (
      <div className="flex items-center gap-2">
        <div className="grid grid-cols-3 gap-[3px] w-[76px] shrink-0" style={{ touchAction: "manipulation" }}>
          {Array.from({ length: model.parts }, (_, i) => (
            <button
              key={i}
              type="button"
              disabled={engine.readOnly}
              onClick={() => toggle(key, i)}
              className={`aspect-square rounded-sm border transition-colors ${
                shaded.has(i) ? "bg-sky-500 border-sky-700" : "bg-white border-slate-300 hover:border-sky-400"
              }`}
            />
          ))}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-xs text-slate-900">
            {id === "m_p" ? "Model P" : "Model Q"} — shade {model.target} of {model.parts}
          </div>
          <div className={`text-[10px] font-mono font-bold ${shaded.size ? "text-emerald-700" : "text-slate-400"}`}>
            {shaded.size}/{model.parts}
            {shaded.size ? ` = ${n}/${d}` : ""}
          </div>
        </div>
      </div>
    );
  };

  const pairs = wiring(engine.state);
  const vp = new Set(engine.state.p).size / MODELS.m_p.parts;
  const vq = new Set(engine.state.q).size / MODELS.m_q.parts;

  return (
    <ActivityShell
      icon={Container}
      title="Fraction Model Tanks"
      howTo="Tap segments to shade each model exactly as described. Each tank reduces its fraction live and wires itself to Column B, and the comparison row follows from your two tanks."
      answerText={engine.answer ? `${pairs.length} of ${cfg?.leftItems.length} rows wired` : undefined}
      mappedTo={engine.answer ? "Wired from the tanks you shaded" : undefined}
      pendingHint={`Shade both models — ${pairs.length} of ${cfg?.leftItems.length ?? 3} rows wired.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <Stage label={cfg?.instruction || "Shade the models, then read the wiring"}>
        <ConnectPairs
          left={(cfg?.leftItems || []).map((l) => ({
            id: l.id,
            text: l.text,
            autoLinkTo: null,
            body:
              l.id === "comp" ? (
                <div className="text-xs font-bold text-slate-900">
                  Comparison result
                  <span className="block text-[10px] font-mono font-bold text-emerald-700">
                    {new Set(engine.state.p).size && new Set(engine.state.q).size
                      ? `${vp.toFixed(3)} vs ${vq.toFixed(3)}`
                      : "shade both tanks"}
                  </span>
                </div>
              ) : (
                <Tank id={l.id as "m_p" | "m_q"} />
              ),
          }))}
          right={(cfg?.rightItems || []).map((r) => ({ id: r.id, text: r.text }))}
          pairs={pairs}
          onChange={() => undefined}
          readOnly
          leftTitle="Shade the models"
          rightTitle="Reduced value"
        />
      </Stage>
    </ActivityShell>
  );
}

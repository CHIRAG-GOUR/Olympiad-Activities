"use client";

import React from "react";
import { MoveVertical } from "lucide-react";
import { ActivityShell, Stage, ConnectPairs, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q46 — Integer elevator bank.
 *
 * Each expression is an elevator the student drives one term at a time. When the car has
 * travelled every term and the final operation is applied, the floor it stops on wires
 * itself to the matching value in Column II.
 */

type FinalOp = "successor" | "predecessor" | "inverse";
interface ElevatorState {
  steps: Record<string, number>;
  finished: Record<string, boolean>;
}

const RUNS: Record<string, { terms: number[]; op: FinalOp }> = {
  P: { terms: [170, -20, 219, -38], op: "successor" },
  Q: { terms: [-911, 175, -200], op: "predecessor" },
  R: { terms: [480, -419, -729, 330], op: "successor" },
  S: { terms: [152, 283, -333], op: "inverse" },
};

const OP_LABEL: Record<FinalOp, string> = {
  successor: "successor (+1)",
  predecessor: "predecessor (−1)",
  inverse: "additive inverse (×−1)",
};

const applyOp = (v: number, op: FinalOp) => (op === "successor" ? v + 1 : op === "predecessor" ? v - 1 : -v);

export function IntegerElevatorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<ElevatorState>) {
  const cfg = question?.matchingConfig;

  const wiring = React.useCallback(
    (s: ElevatorState) => {
      if (!cfg) return [];
      const used = new Set<string>();
      const pairs: { leftId: string; rightId: string }[] = [];
      for (const left of cfg.leftItems) {
        const run = RUNS[left.id];
        if (!run || !s.finished[left.id]) continue;
        const total = applyOp(run.terms.reduce((a, b) => a + b, 0), run.op);
        const match = cfg.rightItems.find((r) => {
          if (used.has(r.id)) return false;
          const n = r.text.match(/-?−?\d+/);
          if (!n) return false;
          return Number(n[0].replace("−", "-")) === total;
        });
        if (match) {
          used.add(match.id);
          pairs.push({ leftId: left.id, rightId: match.id });
        }
      }
      return pairs;
    },
    [cfg]
  );

  const engine = useActivityEngine<ElevatorState, { leftId: string; rightId: string }[]>({
    initialState: { steps: {}, finished: {} },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const pairs = wiring(s);
      return cfg && pairs.length === cfg.leftItems.length ? pairs : undefined;
    },
  });

  const drive = (id: string) =>
    engine.update((s) => {
      const run = RUNS[id];
      const at = s.steps[id] ?? 0;
      if (at < run.terms.length) return { ...s, steps: { ...s.steps, [id]: at + 1 } };
      return { ...s, finished: { ...s.finished, [id]: true } };
    });

  const Car = ({ id }: { id: string }) => {
    const run = RUNS[id];
    if (!run) return null;
    const at = engine.state.steps[id] ?? 0;
    const done = !!engine.state.finished[id];
    const partial = run.terms.slice(0, at).reduce((a, b) => a + b, 0);
    const floor = done ? applyOp(run.terms.reduce((a, b) => a + b, 0), run.op) : partial;
    const complete = at >= run.terms.length;
    return (
      <div className="flex items-center gap-2">
        <div className="w-[52px] shrink-0">
          <div className="relative h-[70px] rounded border-2 border-slate-300 bg-slate-50 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-400" />
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-6 h-5 rounded-sm transition-all ${done ? "bg-emerald-600" : "bg-sky-600"}`}
              style={{ top: `${Math.max(2, Math.min(62, 32 - floor / 40))}px` }}
            />
          </div>
          <div className={`text-center font-mono text-[11px] font-black ${done ? "text-emerald-700" : "text-slate-600"}`}>
            {floor}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-[11px] text-slate-900 leading-tight">
            {id}. {run.terms.map((t, i) => (i === 0 ? t : t < 0 ? ` − ${Math.abs(t)}` : ` + ${t}`)).join("")}
          </div>
          <div className="text-[10px] text-slate-500">then take the {OP_LABEL[run.op]}</div>
          <button
            type="button"
            disabled={engine.readOnly || done}
            onClick={() => drive(id)}
            className={`mt-1 px-2.5 py-1.5 min-h-[34px] rounded-lg border-2 text-[10px] font-black transition ${
              done
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
            }`}
          >
            {done ? "Floor reached" : complete ? `Apply ${OP_LABEL[run.op]}` : `Travel term ${at + 1} of ${run.terms.length}`}
          </button>
        </div>
      </div>
    );
  };

  const pairs = wiring(engine.state);

  return (
    <ActivityShell
      icon={MoveVertical}
      title="Integer Elevator Bank"
      howTo="Drive each elevator one term at a time, then apply its final operation. The floor each car stops on wires itself to the matching value in Column II."
      answerText={engine.answer ? `${pairs.length} of ${cfg?.leftItems.length} elevators driven` : undefined}
      mappedTo={engine.answer ? "Wired from the floors you reached" : undefined}
      pendingHint={`Finish every elevator — ${pairs.length} of ${cfg?.leftItems.length ?? 4} wired.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <Stage label={cfg?.instruction || "Drive the elevators, then read the wiring"}>
        <ConnectPairs
          left={(cfg?.leftItems || []).map((l) => ({ id: l.id, text: l.text, autoLinkTo: null, body: <Car id={l.id} /> }))}
          right={(cfg?.rightItems || []).map((r) => ({ id: r.id, text: r.text }))}
          pairs={pairs}
          onChange={() => undefined}
          readOnly
          leftTitle="Column I — drive each car"
          rightTitle="Column II"
        />
      </Stage>
    </ActivityShell>
  );
}

"use client";

import React from "react";
import { Shuffle } from "lucide-react";
import { ActivityShell, Stage, ConnectPairs, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q8 — Substitution cipher patch bay.
 *
 * The student physically wires each real word to the code word it is called. The wiring
 * they build is submitted as the matching answer, and the bench reads back which code word
 * now stands for the colourless liquid.
 */

interface WireState {
  pairs: { leftId: string; rightId: string }[];
}

export function TransformationLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<WireState>) {
  const cfg = question?.matchingConfig;

  const engine = useActivityEngine<WireState, { leftId: string; rightId: string }[]>({
    initialState: { pairs: [] },
    activityState,
    value,
    onChange,
    readOnly,
    deriveStateFromValue: (v) => (Array.isArray(v) ? { pairs: v } : undefined),
    resolve: (s) => (cfg && s.pairs.length === cfg.leftItems.length ? s.pairs : undefined),
  });

  // What the wiring the student built says about the colourless liquid
  const waterWire = engine.state.pairs.find((p) => p.leftId === "water");
  const codeForWater = waterWire
    ? cfg?.rightItems.find((r) => r.id === waterWire.rightId)?.text.replace(/\s*\(.*\)$/, "")
    : null;

  return (
    <ActivityShell
      icon={Shuffle}
      title="Substitution Cipher Patch Bay"
      howTo="Drag from a real word to the code word it is called (or tap one then the other). Wire all four and the bench reads back the code for the colourless liquid."
      answerText={engine.answer ? `${engine.state.pairs.length} of ${cfg?.leftItems.length} wires connected` : undefined}
      mappedTo={codeForWater ? `Colourless liquid is called “${codeForWater}”` : undefined}
      pendingHint={`Connect all ${cfg?.leftItems.length ?? 4} words — ${engine.state.pairs.length} wired so far.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <Stage label={cfg?.instruction || "Wire the substitutions"}>
        <ConnectPairs
          left={(cfg?.leftItems || []).map((l) => ({ id: l.id, text: l.text }))}
          right={(cfg?.rightItems || []).map((r) => ({ id: r.id, text: r.text.replace(/\s*\(.*\)$/, "") }))}
          pairs={engine.state.pairs}
          onChange={(pairs) => engine.update({ pairs })}
          readOnly={engine.readOnly}
          leftTitle="Real word"
          rightTitle="Is called"
        />
      </Stage>

      <div className="mt-3 rounded-xl border-2 border-slate-200 bg-slate-50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Bench read-out</div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Water is the naturally colourless substance. Follow your wire out of the{" "}
          <span className="font-bold">Water</span> terminal —{" "}
          {codeForWater ? (
            <span className="font-black text-emerald-700">it is called “{codeForWater}”.</span>
          ) : (
            <span className="italic text-slate-500">wire the Water terminal to see its code word.</span>
          )}
        </p>
      </div>
    </ActivityShell>
  );
}

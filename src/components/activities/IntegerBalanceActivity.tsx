"use client";

import React from "react";
import { Scale } from "lucide-react";
import { ActivityShell, DropBuckets, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q19 — Integer sign sorter.
 *
 * Each expression card carries its own running total, computed live as the student sorts.
 * The bucket mapping they build is the classification answer.
 */

interface SignState {
  assignment: Record<string, string>;
}

const TERMS: Record<string, number[]> = {
  exp_a: [171, -23, -120],
  exp_b: [-815, 750, -230],
  exp_c: [-413, -315, 880],
};

export function IntegerBalanceActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<SignState>) {
  const cfg = question?.classificationConfig;

  const engine = useActivityEngine<SignState, Record<string, string>>({
    initialState: { assignment: {} },
    activityState,
    value,
    onChange,
    readOnly,
    deriveStateFromValue: (v) => (v && typeof v === "object" ? { assignment: v } : undefined),
    resolve: (s) => (cfg && Object.keys(s.assignment).length === cfg.items.length ? s.assignment : undefined),
  });

  const placed = Object.keys(engine.state.assignment).length;

  return (
    <ActivityShell
      icon={Scale}
      title="Integer Sign Sorter"
      howTo="Drag each expression onto the pan that matches the sign of its total. Each card shows its own running sum as you work."
      answerText={engine.answer ? `All ${placed} expressions sorted` : undefined}
      mappedTo={engine.answer ? "Sorting submitted as arranged" : undefined}
      pendingHint={`${placed} of ${cfg?.items.length ?? 3} expressions placed.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <DropBuckets
        columns={3}
        trayLabel={cfg?.instruction || "Sort each expression by the sign of its sum"}
        items={(cfg?.items || []).map((i) => {
          const terms = TERMS[i.id] || [];
          const sum = terms.reduce((a, b) => a + b, 0);
          return {
            id: i.id,
            text: terms.map((t, n) => (n === 0 ? String(t) : t < 0 ? `+ (${t})` : `+ ${t}`)).join(" "),
            sub: `running total = ${sum > 0 ? "+" : ""}${sum}`,
          };
        })}
        buckets={(cfg?.categories || []).map((c) => ({ id: c.id, title: c.title }))}
        assignment={engine.state.assignment}
        onAssign={(itemId, bucketId) =>
          engine.update((s) => {
            const assignment = { ...s.assignment };
            if (bucketId) assignment[itemId] = bucketId;
            else delete assignment[itemId];
            return { assignment };
          })
        }
        readOnly={engine.readOnly}
      />
    </ActivityShell>
  );
}

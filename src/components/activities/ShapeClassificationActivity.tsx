"use client";

import React from "react";
import { Shapes } from "lucide-react";
import { ActivityShell, DropBuckets, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q15 — Boundary-property sorter.
 *
 * The student drags all nine figures into the three geometric classes. The mapping they
 * build is submitted directly as the classification answer.
 */

interface SortState {
  assignment: Record<string, string>;
}

const GLYPHS: Record<string, React.ReactNode> = {
  "1": <ellipse cx="16" cy="16" rx="14" ry="9" />,
  "2": <polygon points="16,3 29,28 3,28" />,
  "3": <polygon points="4,8 28,4 27,27 6,29" />,
  "4": <path d="M4 28 A 18 18 0 0 1 28 28 Z" />,
  "5": <polygon points="16,3 29,13 24,28 8,28 3,13" />,
  "6": <path d="M5 4 H27 V18 A 11 11 0 0 1 5 18 Z" />,
  "7": <path d="M22 4 A 13 13 0 1 0 22 28 A 10 10 0 1 1 22 4 Z" />,
  "8": <path d="M5 28 V14 A 11 11 0 0 1 27 14 V28 Z" />,
  "9": <path d="M16 2 C26 14 28 19 28 22 A 12 12 0 0 1 4 22 C4 19 6 14 16 2 Z" />,
};

export function ShapeClassificationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<SortState>) {
  const cfg = question?.classificationConfig;

  const engine = useActivityEngine<SortState, Record<string, string>>({
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
      icon={Shapes}
      title="Boundary Property Sorter"
      howTo="Drag each figure into the class whose boundary it shares — or tap a figure, then tap a bucket. Every figure must be placed."
      answerText={engine.answer ? `All ${placed} figures classified` : undefined}
      mappedTo={engine.answer ? "Grouping submitted as arranged" : undefined}
      pendingHint={`${placed} of ${cfg?.items.length ?? 9} figures sorted.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <DropBuckets
        columns={5}
        trayLabel={cfg?.instruction || "Drag each shape into its class"}
        items={(cfg?.items || []).map((i) => ({
          id: i.id,
          text: `Fig ${i.id}`,
          visual: (
            <svg viewBox="0 0 32 32" className="w-7 h-7 fill-slate-200 stroke-slate-700" strokeWidth={2}>
              {GLYPHS[i.id]}
            </svg>
          ),
        }))}
        buckets={(cfg?.categories || []).map((c) => ({ id: c.id, title: c.title.replace(/\s*\(.*\)$/, "") }))}
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

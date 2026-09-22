"use client";

import React from "react";
import { FileSearch } from "lucide-react";
import { ActivityShell, Stage, ReadOut, DropBuckets, Stepper, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q48 — Evidence room.
 *
 * Two benches let the student actually test each statement: a letter tagger for the word
 * CREATIVE and a ratio scaler for 7/9. They then file each statement card in the True or
 * False drawer, and that filing is the classification answer.
 */

interface EvidenceState {
  vowels: string[];
  straight: string[];
  p: number;
  assignment: Record<string, string>;
}

const WORD = "CREATIVE".split("");

export function EvidenceRoomActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<EvidenceState>) {
  const cfg = question?.classificationConfig;

  const engine = useActivityEngine<EvidenceState, Record<string, string>>({
    initialState: { vowels: [], straight: [], p: 81, assignment: {} },
    activityState,
    value,
    onChange,
    readOnly,
    deriveStateFromValue: (v) =>
      v && typeof v === "object" ? { vowels: [], straight: [], p: 81, assignment: v } : undefined,
    resolve: (s) => (cfg && Object.keys(s.assignment).length === cfg.items.length ? s.assignment : undefined),
  });

  const s = engine.state;
  const tag = (list: "vowels" | "straight", key: string) =>
    engine.update((st) => {
      const next = new Set(st[list]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...st, [list]: Array.from(next) };
    });

  const tagged = new Set([...s.vowels, ...s.straight]).size;
  const q = Math.round((7 / 9) * 135);
  const scaledCorrect = s.p === (7 / 9) * 729;

  return (
    <ActivityShell
      icon={FileSearch}
      title="Evidence Room"
      howTo="Test both statements on the benches below, then drag each statement card into the True or False drawer. Your filing is the answer."
      answerText={engine.answer ? "Both statements filed" : undefined}
      mappedTo={engine.answer ? "Filing submitted as arranged" : undefined}
      pendingHint={`${Object.keys(s.assignment).length} of ${cfg?.items.length ?? 2} statements filed.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-2 mb-3">
        <Stage label="Bench I — the word CREATIVE">
          <p className="text-[10px] text-slate-500 mb-2">
            Tap a letter once to tag it a vowel, and use the lower row to tag letters drawn only with
            straight lines.
          </p>
          <div className="flex gap-1 mb-1.5">
            {WORD.map((ch, i) => (
              <button
                key={`v${i}`}
                type="button"
                disabled={engine.readOnly}
                onClick={() => tag("vowels", `${i}`)}
                className={`flex-1 h-10 rounded-lg border-2 font-black text-sm transition ${
                  s.vowels.includes(`${i}`) ? "bg-sky-100 border-sky-500 text-sky-800" : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {WORD.map((_ch, i) => (
              <button
                key={`s${i}`}
                type="button"
                disabled={engine.readOnly}
                onClick={() => tag("straight", `${i}`)}
                className={`flex-1 h-7 rounded border-2 text-[9px] font-black transition ${
                  s.straight.includes(`${i}`) ? "bg-amber-100 border-amber-500 text-amber-800" : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                line
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <ReadOut label="Vowels" value={s.vowels.length} tone="sky" />
            <ReadOut label="Straight-line letters" value={s.straight.length} />
            <ReadOut label="Fraction" value={`${tagged}/8`} tone={tagged === 4 ? "emerald" : "slate"} />
          </div>
        </Stage>

        <Stage label="Bench II — scale the ratio 7 / 9">
          <div className="flex items-center justify-center gap-3 font-mono text-lg font-black text-slate-800">
            <span>7/9</span>
            <span className="text-slate-400">=</span>
            <span className={scaledCorrect ? "text-emerald-700" : "text-rose-600"}>{s.p}/729</span>
            <span className="text-slate-400">=</span>
            <span>{q}/135</span>
          </div>
          <div className="mt-3">
            <Stepper label="Set p" value={s.p} min={0} max={729} step={1} onChange={(v) => engine.patch({ p: v })} readOnly={engine.readOnly} />
          </div>
          <div className="mt-2 text-[11px] font-bold text-center">
            {scaledCorrect ? (
              <span className="text-emerald-700">
                7 × 81 = {s.p}. Then p + q = {s.p + q}.
              </span>
            ) : (
              <span className="text-slate-500">729 ÷ 9 = 81, so p must be 7 × 81.</span>
            )}
          </div>
        </Stage>
      </div>

      <DropBuckets
        columns={2}
        trayLabel={cfg?.instruction || "File each statement"}
        items={(cfg?.items || []).map((i) => ({ id: i.id, text: i.text.replace(/\s*\(.*\)$/, "") }))}
        buckets={(cfg?.categories || []).map((c) => ({ id: c.id, title: c.title }))}
        assignment={s.assignment}
        onAssign={(itemId, bucketId) =>
          engine.update((st) => {
            const assignment = { ...st.assignment };
            if (bucketId) assignment[itemId] = bucketId;
            else delete assignment[itemId];
            return { ...st, assignment };
          })
        }
        readOnly={engine.readOnly}
      />
    </ActivityShell>
  );
}

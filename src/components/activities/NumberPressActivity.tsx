"use client";

import React from "react";
import { Hash } from "lucide-react";
import { ActivityShell, Stage, ReorderList, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q26 — Digit press.
 *
 * The student drags digit tiles into place-value slots. The number the press forms is read
 * back live in the Indian system, and the arrangement itself is the ordering answer.
 */

interface PressState {
  order: string[];
  touched: boolean;
}

const DIGIT_OF: Record<string, string> = { d9a: "9", d9b: "9", d5: "5", d3: "3", d2: "2", d0: "0" };
const PLACES = ["Lakhs", "Ten-Thousands", "Thousands", "Hundreds", "Tens", "Ones"];

function inWords(n: number) {
  const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const two = (v: number): string => (v < 20 ? ones[v] : `${tens[Math.floor(v / 10)]}${v % 10 ? `-${ones[v % 10]}` : ""}`);
  const three = (v: number): string => (v >= 100 ? `${ones[Math.floor(v / 100)]} hundred${v % 100 ? ` ${two(v % 100)}` : ""}` : two(v));
  const lakh = Math.floor(n / 100000);
  const rest = n % 100000;
  const thousand = Math.floor(rest / 1000);
  const last = rest % 1000;
  return [
    lakh ? `${two(lakh)} lakh` : "",
    thousand ? `${three(thousand)} thousand` : "",
    last ? three(last) : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function NumberPressActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<PressState>) {
  const items = React.useMemo(
    () => (question?.orderingConfig?.items || []).map((i) => ({ id: i.id, label: DIGIT_OF[i.id] ?? i.label, sub: i.label })),
    [question]
  );

  const initial = React.useMemo(() => {
    const ids = (question?.orderingConfig?.items || []).map((i) => i.id);
    return [3, 0, 5, 2, 4, 1].filter((n) => n < ids.length).map((n) => ids[n]);
  }, [question]);

  const engine = useActivityEngine<PressState, string[]>({
    initialState: { order: initial, touched: false },
    activityState,
    value,
    onChange,
    readOnly,
    deriveStateFromValue: (v) => (Array.isArray(v) ? { order: v, touched: true } : undefined),
    resolve: (s) => (s.touched ? s.order : undefined),
  });

  const digits = engine.state.order.map((id) => DIGIT_OF[id] ?? "0").join("");
  const numeric = Number(digits);

  return (
    <ActivityShell
      icon={Hash}
      title="Six-Digit Number Press"
      howTo="Drag the digit tiles so the highest place value sits at the top of the stack. The press forms the number live and reads it back in words."
      answerText={engine.answer ? digits : undefined}
      mappedTo={engine.answer ? inWords(numeric) : undefined}
      pendingHint="Move at least one digit tile to press a number."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
        <ReorderList
          items={items}
          order={engine.state.order}
          onReorder={(order) => engine.update({ order, touched: true })}
          readOnly={engine.readOnly}
          renderMeta={(_id, idx) => (
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{PLACES[idx]}</span>
          )}
        />

        <Stage label="Press output">
          <div className="font-mono text-3xl font-black text-center text-slate-900 tracking-widest">
            {digits.slice(0, 1)},{digits.slice(1, 3)},{digits.slice(3)}
          </div>
          <div className="mt-3 text-center text-xs font-bold text-emerald-800 capitalize leading-snug">
            {inWords(numeric)}
          </div>
          <p className="text-[10px] text-slate-500 mt-3 leading-snug">
            Digits available: 3, 5, 0, 2, 9 with the greatest digit repeated.
          </p>
        </Stage>
      </div>
    </ActivityShell>
  );
}

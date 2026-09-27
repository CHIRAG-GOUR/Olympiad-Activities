"use client";

import React from "react";
import { Question } from "@/types/question";
import { Play } from "../imo6a-play/engine";
import { PlayShell, PlayShellProps, Btn } from "../imo6a-play/PlayShell";

/**
 * Shared chrome for Paper 3. Every game follows the play contract: the student builds a
 * world, the world produces a value, the value is matched to a printed option, and only the
 * game's submit button records it. Nothing here knows which option is correct.
 */

const RIBBON: Record<string, string> = {
  "Logical Reasoning": "from-sky-100 via-white to-indigo-100 text-sky-800 border-sky-200",
  "Mathematical Reasoning": "from-violet-100 via-white to-fuchsia-100 text-violet-800 border-violet-200",
  "Everyday Mathematics": "from-emerald-100 via-white to-teal-100 text-emerald-800 border-emerald-200",
  "Achievers Section": "from-amber-100 via-white to-orange-100 text-amber-800 border-amber-200",
};

type ShellProps<W> = { play: Play<W>; question?: Question; hints?: string[] } & Omit<
  PlayShellProps,
  "derived" | "locked" | "touched" | "readOnly" | "onSubmit" | "onReset" | "question"
>;

export function Shell<W>({ play, question, hints = [], ...rest }: ShellProps<W>) {
  const r = RIBBON[question?.section ?? ""] ?? RIBBON["Logical Reasoning"];
  const [shown, setShown] = React.useState(0);
  return (
    <div className="space-y-1.5">
      <div className={`flex items-center justify-between gap-2 rounded-xl border bg-gradient-to-r px-3 py-1 text-[11px] font-black uppercase tracking-wider ${r}`}>
        <span>{question?.section ?? "Olympiad"}</span>
        {hints.length > 0 && (
          <button
            type="button"
            onClick={() => setShown((n) => Math.min(hints.length, n + 1))}
            disabled={shown >= hints.length}
            className="normal-case tracking-normal rounded-lg border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 disabled:opacity-50"
          >
            💡 {shown === 0 ? "Need a hint?" : shown < hints.length ? "Another hint" : "No more hints"}
          </button>
        )}
      </div>
      {shown > 0 && (
        <ol className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 list-decimal list-inside space-y-0.5">
          {hints.slice(0, shown).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ol>
      )}
      <PlayShell
        {...rest}
        question={question}
        derived={play.derived}
        locked={play.locked}
        touched={play.touched}
        readOnly={play.readOnly}
        onSubmit={play.submit}
        onReset={play.reset}
      />
    </div>
  );
}

/** A light board every world is drawn on. */
export const Board = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-2 shadow-sm ${className}`}>{children}</div>
);

export function Stepper({
  label,
  value,
  onStep,
  steps = [1],
  disabled,
  min = -Infinity,
  max = Infinity,
  unit = "",
}: {
  label: string;
  value: number | string;
  onStep: (d: number) => void;
  steps?: number[];
  disabled?: boolean;
  min?: number;
  max?: number;
  unit?: string;
}) {
  const v = typeof value === "number" ? value : NaN;
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-xs font-black text-slate-700 mr-1">{label}</span>
      {[...steps].reverse().map((d) => (
        <Btn key={`m${d}`} className="px-2" tone="slate" disabled={disabled || v - d < min} onClick={() => onStep(-d)} ariaLabel={`${label} -${d}`}>
          −{d}
        </Btn>
      ))}
      <span className="font-mono font-black text-lg text-indigo-900 min-w-[3.5rem] text-center">
        {value}
        {unit}
      </span>
      {steps.map((d) => (
        <Btn key={`p${d}`} className="px-2" tone="slate" disabled={disabled || v + d > max} onClick={() => onStep(d)} ariaLabel={`${label} +${d}`}>
          +{d}
        </Btn>
      ))}
    </div>
  );
}

export type Pt = [number, number];
export const polyPath = (pts: Pt[]) => `M ${pts.map((p) => p.join(" ")).join(" L ")} Z`;
export const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
export const r4 = (v: number) => Math.round(v * 1e6) / 1e6;
export const inr = (v: number) => `₹${v.toLocaleString("en-IN")}`;
export const optText = (q: Question | undefined, id: string) => q?.multipleChoiceConfig?.options.find((o) => o.id === id)?.text ?? "";
/** The option whose text starts with `prefix` (case-insensitive). */
export const optStarting = (q: Question | undefined, prefix: string) =>
  q?.multipleChoiceConfig?.options.find((o) => o.text.toLowerCase().startsWith(prefix.toLowerCase()))?.id;
/** "P", "P and Q", "P, Q and S" */
export const listText = (ids: (string | number)[]) =>
  ids.length <= 1 ? ids.join("") : `${ids.slice(0, -1).join(", ")} and ${ids[ids.length - 1]}`;
/** Rupees with paise shown only when there are any: ₹ 7,878.75 */
export const rupees = (v: number) => `₹ ${v.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(v) ? 0 : 2 })}`;

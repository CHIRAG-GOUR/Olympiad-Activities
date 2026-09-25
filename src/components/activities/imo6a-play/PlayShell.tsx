"use client";

import React from "react";
import { Box, CheckCircle2, Hand, Lock, LucideIcon, RotateCcw, Send, Sparkles, Square } from "lucide-react";
import { Question } from "@/types/question";
import { Derived } from "./engine";

/**
 * Chrome shared by every Set A mini-game.
 *
 * The strip across the top shows where the student is in the play contract. The world
 * sits in the middle. The footer shows the live value the world produces and the option
 * that value lands on, and holds the one control that records it. The read-out itself is
 * never clickable: the only way to change the answer is to change the world.
 */

const STEPS = ["World", "Manipulate", "Live state", "Answer derived", "Submitted"] as const;

function optionText(question: Question | undefined, id?: string) {
  const o = question?.multipleChoiceConfig?.options?.find((x) => x.id === id);
  return o ? `Option ${o.id} — ${o.text}` : undefined;
}

export interface PlayShellProps {
  title: string;
  /** One sentence: what the student has to do in this world. */
  mission: string;
  icon: LucideIcon;
  /** "3D" for WebGL worlds, "2D" for SVG/DOM worlds. */
  dim: "2D" | "3D";
  question?: Question;
  derived: Derived;
  locked: boolean;
  touched: boolean;
  readOnly?: boolean;
  onSubmit: () => void;
  onReset: () => void;
  /** Label on the submit control, e.g. "Run machine & submit". */
  submitLabel?: string;
  /** Live metrics describing the current world. */
  live?: React.ReactNode;
  /** Extra condition that must hold before submitting, beyond having a value. */
  submitBlocked?: string;
  children: React.ReactNode;
}

export function PlayShell({
  title,
  mission,
  icon: Icon,
  dim,
  question,
  derived,
  locked,
  touched,
  readOnly,
  onSubmit,
  onReset,
  submitLabel = "Submit answer",
  live,
  submitBlocked,
  children,
}: PlayShellProps) {
  const hasValue = derived.value !== undefined && derived.value !== "";
  const reached = locked ? 5 : hasValue ? 4 : touched ? 3 : 1;
  const canSubmit = !readOnly && hasValue && !submitBlocked && !locked;
  const mapped = optionText(question, derived.optionId);

  return (
    <div className="bg-white border-2 border-violet-100 rounded-2xl text-slate-900 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-violet-600 text-white shadow-sm shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg leading-tight text-slate-900">{title}</h3>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-black tracking-wider rounded-md px-1.5 py-0.5 ${
                    dim === "3D" ? "bg-indigo-600 text-white" : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {dim === "3D" ? <Box className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                  {dim}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                <Hand className="w-3.5 h-3.5 mt-px shrink-0 text-violet-600" />
                <span>{mission}</span>
              </p>
            </div>
          </div>
        </div>

        <ol className="mt-3 flex flex-wrap items-center gap-1" aria-label="Progress through the activity">
          {STEPS.map((s, i) => {
            const done = i + 1 <= reached;
            return (
              <li key={s} className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 border transition-colors ${
                    done
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && <span className={`w-3 h-px ${done ? "bg-violet-400" : "bg-slate-200"}`} />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="p-3 sm:p-4 space-y-3 select-none" style={{ touchAction: "manipulation" }}>
        {children}
        {live && <div className="flex flex-wrap gap-2">{live}</div>}
      </div>

      <div
        className={`mx-3 sm:mx-4 mb-3 sm:mb-4 rounded-xl border-2 px-3.5 py-3 flex flex-wrap items-center justify-between gap-3 transition-colors ${
          locked
            ? "bg-emerald-50 border-emerald-500"
            : hasValue
              ? "bg-violet-50 border-violet-300"
              : "bg-slate-50 border-dashed border-slate-200"
        }`}
      >
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            {locked ? <Lock className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            {locked ? "Answer recorded from your world" : "Answer your world produces right now"}
          </div>
          {hasValue ? (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className={`font-mono text-xl font-black break-all ${locked ? "text-emerald-800" : "text-violet-900"}`}>
                {derived.value}
              </span>
              {mapped ? (
                <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded px-1.5 py-0.5">
                  {mapped}
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-300 rounded px-1.5 py-0.5">
                  matches none of the printed options
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm font-semibold text-slate-500">{derived.note ?? "Work the world to produce an answer."}</div>
          )}
          {hasValue && derived.note && <div className="text-[11px] text-slate-500 mt-0.5">{derived.note}</div>}
          {submitBlocked && hasValue && !locked && (
            <div className="text-[11px] font-semibold text-amber-700 mt-0.5">{submitBlocked}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {locked && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          <button
            type="button"
            onClick={onReset}
            disabled={readOnly}
            className="inline-flex items-center gap-1.5 px-3 min-h-[44px] bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 rounded-lg text-xs font-bold text-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-lg text-sm font-extrabold text-white bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            {locked ? "Submitted" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Framed region inside a world. */
export function Bay({
  label,
  children,
  className = "",
  tone = "slate",
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tone?: "slate" | "violet" | "dark";
}) {
  const tones = {
    slate: "bg-slate-50 border-slate-200",
    violet: "bg-violet-50/60 border-violet-200",
    dark: "bg-slate-900 border-slate-800 text-white",
  } as const;
  return (
    <div className={`relative rounded-2xl border-2 p-3 ${tones[tone]} ${className}`}>
      {label && (
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${tone === "dark" ? "text-slate-400" : "text-slate-500"}`}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

/** Small live metric chip. */
export function Gauge({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "slate" | "violet" | "emerald" | "amber" | "rose" | "sky";
}) {
  const tones = {
    slate: "bg-white border-slate-200 text-slate-900",
    violet: "bg-violet-50 border-violet-300 text-violet-900",
    emerald: "bg-emerald-50 border-emerald-300 text-emerald-900",
    amber: "bg-amber-50 border-amber-300 text-amber-900",
    rose: "bg-rose-50 border-rose-300 text-rose-900",
    sky: "bg-sky-50 border-sky-300 text-sky-900",
  } as const;
  return (
    <div className={`px-2.5 py-1.5 rounded-lg border-2 ${tones[tone]}`}>
      <div className="text-[9px] font-bold uppercase tracking-wider opacity-60 leading-tight">{label}</div>
      <div className="font-mono text-sm font-black leading-tight tabular-nums">{value}</div>
    </div>
  );
}

/** Chunky, touch-sized action button used inside worlds. */
export function Btn({
  children,
  onClick,
  disabled,
  active,
  tone = "violet",
  className = "",
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  tone?: "violet" | "slate" | "emerald" | "amber" | "rose" | "sky";
  className?: string;
  title?: string;
}) {
  const on = {
    violet: "bg-violet-600 border-violet-700 text-white",
    slate: "bg-slate-800 border-slate-900 text-white",
    emerald: "bg-emerald-600 border-emerald-700 text-white",
    amber: "bg-amber-500 border-amber-600 text-white",
    rose: "bg-rose-600 border-rose-700 text-white",
    sky: "bg-sky-600 border-sky-700 text-white",
  } as const;
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[44px] px-3 rounded-lg border-2 text-xs font-extrabold transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? on[tone] : "bg-white border-slate-200 text-slate-700 hover:border-violet-400"
      } ${className}`}
    >
      {children}
    </button>
  );
}

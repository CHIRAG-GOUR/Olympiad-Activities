"use client";

import React from "react";
import { RotateCcw, CheckCircle2, MousePointerClick, LucideIcon } from "lucide-react";

interface ActivityShellProps {
  title: string;
  howTo: string;
  icon: LucideIcon;
  children: React.ReactNode;
  /** The answer the interaction currently resolves to (already student-readable) */
  answerText?: string;
  /** e.g. "Option C" once the resolved answer maps onto a source option */
  mappedTo?: string;
  /** What the student still has to do before an answer exists */
  pendingHint: string;
  onReset: () => void;
  readOnly?: boolean;
  /** Extra controls rendered on the header's right-hand side */
  tools?: React.ReactNode;
}

/**
 * Shared chrome for every activity: instructions, the microworld, and a live read-out of
 * the answer the microworld currently resolves to. The read-out is NOT clickable — the
 * manipulation is the only way to change the answer.
 */
export function ActivityShell({
  title,
  howTo,
  icon: Icon,
  children,
  answerText,
  mappedTo,
  pendingHint,
  onReset,
  readOnly = false,
  tools,
}: ActivityShellProps) {
  const answered = answerText !== undefined && answerText !== "";

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-slate-900 leading-tight">{title}</h3>
            <p className="text-xs text-slate-600 mt-0.5 flex items-start gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 mt-px shrink-0 text-emerald-600" />
              <span>{howTo}</span>
            </p>
          </div>
        </div>
        {tools && <div className="flex items-center gap-2 shrink-0">{tools}</div>}
      </div>

      <div className="select-none" style={{ touchAction: "manipulation" }}>
        {children}
      </div>

      {/* Live resolved-answer bar — mirrors what the interaction produced, never clickable */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 px-3.5 py-2.5 transition-colors ${
          answered ? "bg-emerald-50 border-emerald-500" : "bg-slate-50 border-slate-200 border-dashed"
        }`}
      >
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Answer produced by your activity
          </div>
          {answered ? (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-xl font-black text-emerald-800 break-all">{answerText}</span>
              {mappedTo && (
                <span className="text-[11px] font-bold text-emerald-700 bg-white border border-emerald-300 rounded px-1.5 py-0.5">
                  {mappedTo}
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm font-semibold text-slate-500">{pendingHint}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {answered && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          <button
            type="button"
            onClick={onReset}
            disabled={readOnly}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 rounded-lg text-xs font-bold text-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset activity
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small framed sub-panel used inside microworlds. */
export function Stage({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={`relative bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5 ${className}`}>
      {label && (
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</div>
      )}
      {children}
    </div>
  );
}

export function ReadOut({ label, value, tone = "slate" }: { label: string; value: React.ReactNode; tone?: "slate" | "emerald" | "rose" | "sky" }) {
  const tones = {
    slate: "bg-white border-slate-200 text-slate-900",
    emerald: "bg-emerald-50 border-emerald-300 text-emerald-900",
    rose: "bg-rose-50 border-rose-300 text-rose-900",
    sky: "bg-sky-50 border-sky-300 text-sky-900",
  } as const;
  return (
    <div className={`px-3 py-2 rounded-xl border-2 ${tones[tone]}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</div>
      <div className="font-mono text-base font-black leading-tight">{value}</div>
    </div>
  );
}

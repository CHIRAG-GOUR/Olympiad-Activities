"use client";

import React, { useEffect } from "react";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, RotateCcw, Send, X, MousePointerClick, LayoutGrid } from "lucide-react";

/**
 * Plain-language guide to every control on the examination screen: the navigation bar,
 * the question palette and its colours, and the Interactive / Standard switch.
 */

const NAV_BUTTONS = [
  {
    label: "<< Back",
    icon: ArrowLeft,
    swatch: "bg-slate-100 border border-slate-300 text-slate-800",
    what: "Goes to the previous question. Your answer on this question is kept exactly as it is.",
  },
  {
    label: "Next >>",
    icon: ArrowRight,
    swatch: "bg-slate-100 border border-slate-300 text-slate-800",
    what: "Goes to the next question without changing this question's status.",
  },
  {
    label: "Clear Response",
    icon: RotateCcw,
    swatch: "bg-white border border-slate-300 text-slate-700",
    what: "Removes the answer to this question, resets its activity and removes any review flag, so it counts as not answered.",
  },
  {
    label: "Mark for Review & Next",
    icon: Bookmark,
    swatch: "bg-[#8067D9] text-white",
    what: "Flags this question to look at again and moves on. Any answer already recorded here is kept and still marked.",
  },
  {
    label: "Save & Mark for Review",
    icon: Bookmark,
    swatch: "bg-[#D97706] text-white",
    what: "Keeps your answer, flags the question to look at again and moves on. The answer is still marked.",
  },
  {
    label: "Save & Next",
    icon: CheckCircle2,
    swatch: "bg-[#55B987] text-white",
    what: "Confirms your answer, removes any review flag and moves to the next question.",
  },
  {
    label: "Submit Paper",
    icon: Send,
    swatch: "bg-[#2468B2] text-white",
    what: "Shows a section-by-section summary, then ends the examination when you confirm. You cannot return afterwards.",
  },
];

const PALETTE_STATES = [
  { box: "bg-white text-slate-800 border border-slate-300 rounded-md", name: "Not Visited", what: "You have not opened this question yet." },
  { box: "bg-[#E8786A] text-white rounded-md", name: "Not Answered", what: "You opened it but have not recorded an answer." },
  { box: "bg-[#55B987] text-white rounded-md", name: "Answered", what: "An answer is recorded and will be marked." },
  { box: "bg-[#8067D9] text-white rounded-full", name: "Marked for Review", what: "Flagged, with no answer. It will not be marked." },
  { box: "bg-[#8067D9] text-white rounded-full relative", name: "Answered & Marked for Review", what: "Flagged, with an answer. The answer will be marked.", dot: true },
];

export function ExamButtonGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How the examination controls work"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl w-full max-w-2xl max-h-[92dvh] flex flex-col"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-black text-slate-900">How the controls work</h3>
            <p className="text-xs text-slate-500">Every button on this screen, and what it does to your answers.</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 rounded-lg border border-slate-300 grid place-items-center hover:bg-slate-100" aria-label="Close guide">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-5">
          <section>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Navigation bar (bottom of the screen)</h4>
            <ul className="space-y-2">
              {NAV_BUTTONS.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.label} className="flex items-start gap-3">
                    <span className={`shrink-0 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[11px] font-bold min-w-[170px] ${b.swatch}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {b.label}
                    </span>
                    <span className="text-[13px] text-slate-700 leading-snug pt-1">{b.what}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" /> Question palette colours
            </h4>
            <ul className="space-y-2">
              {PALETTE_STATES.map((s) => (
                <li key={s.name} className="flex items-start gap-3">
                  <span className={`shrink-0 w-8 h-8 grid place-items-center font-mono text-xs font-bold ${s.box}`}>
                    7{s.dot && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#55B987] border border-white" />}
                  </span>
                  <span className="text-[13px] text-slate-700 leading-snug pt-1">
                    <b className="text-slate-900">{s.name}:</b> {s.what}
                  </span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-8 h-8 grid place-items-center font-mono text-xs font-bold bg-white border border-slate-300 rounded-md ring-2 ring-[#2468B2] ring-offset-1">7</span>
                <span className="text-[13px] text-slate-700 leading-snug pt-1">
                  <b className="text-slate-900">Blue ring:</b> the question on screen now. Tap any number to jump straight to it.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5" /> On each question
            </h4>
            <ul className="space-y-1.5 text-[13px] text-slate-700 leading-snug">
              <li>
                <b className="text-slate-900">Sections</b> (top tabs): jump to the first question of a section. The badge shows how many you have answered there.
              </li>
              <li>
                <b className="text-slate-900">Interactive / Standard</b>: switch between the question's activity and the plain lettered options. Both record the same answer.
              </li>
              <li>
                <b className="text-slate-900">Activity submit button</b>: inside an activity, your answer is recorded only after you press its violet submit button. Changing the activity afterwards withdraws the answer until you submit again.
              </li>
              <li>
                <b className="text-slate-900">Reset</b> (inside an activity): puts that activity back to its starting state and clears its answer.
              </li>
              <li>
                <b className="text-slate-900">Time Left</b>: the paper submits itself when the clock reaches zero. It turns red in the last three minutes.
              </li>
            </ul>
          </section>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
          <button type="button" onClick={onClose} className="h-10 px-5 rounded-lg bg-[#2468B2] hover:bg-[#1C5190] text-white text-sm font-bold">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

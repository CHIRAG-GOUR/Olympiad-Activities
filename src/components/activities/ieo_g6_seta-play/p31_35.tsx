"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { BookOpen, TreePine, ShieldCheck, Truck, MapPin, Sparkles, CheckCircle2, Home, Users } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — Beaver Physical Anatomy (Huge front teeth)
   Question: "What is interesting about a beaver's appearance?"
   Options:
     A. They are very small.
     B. They are the biggest animal in South America.
     C. They have huge front teeth.
     D. They have thin tails. -> Key: C (They have huge front teeth.)
   ══════════════════════════════════════════════════════════════════════ */
export function Q31BeaverAnatomyActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ feature?: string }>({
    question,
    initial: { feature: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.feature) return { note: "Select the distinctive anatomical feature mentioned in the passage" };
      const map: Record<string, string> = {
        "They are very small.": "A",
        "They are the biggest animal in South America.": "B",
        "They have huge front teeth.": "C",
        "They have thin tails.": "D",
      };
      return {
        value: w.feature,
        optionId: map[w.feature],
        note: w.feature === "They have huge front teeth." ? "Correct passage fact: Beavers possess prominent, continuously growing orange incisors" : `Selected: ${w.feature}`,
      };
    },
  });

  const features = [
    "They are very small.",
    "They are the biggest animal in South America.",
    "They have huge front teeth.",
    "They have thin tails.",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q31 · Beaver Zoological Anatomy & Adaptation"
      subtitle="Examine the biological adaptations that enable beavers to fell trees and construct river dams"
      hints={["The passage specifically notes their massive, self-sharpening front incisor teeth used to fell birch trees."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Zoological Anatomy Chart · Rodentia</span>
                <span className="text-[11px] font-medium text-slate-500">Distinctive Physical Adaptations</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🦫 Feature: Huge Front Teeth
            </span>
          </div>

          {/* Beaver Illustration Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center mb-4">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Water stream in front */}
                  <path d="M 0 145 Q 90 135 190 145 T 380 145 L 380 180 L 0 180 Z" fill="#38BDF8" opacity="0.7" />

                  {/* Fallen birch log */}
                  <g transform="translate(180, 115)">
                    <rect x="0" y="0" width="160" height="28" rx="4" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
                    {/* Log rings / gnaw marks */}
                    <path d="M 0 0 Q -10 14 0 28" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
                    <line x1="20" y1="5" x2="35" y2="5" stroke="#78350F" strokeWidth="2" />
                    <line x1="60" y1="18" x2="80" y2="18" stroke="#78350F" strokeWidth="2" />
                    <line x1="110" y1="8" x2="130" y2="8" stroke="#78350F" strokeWidth="2" />
                    {/* Wood shavings */}
                    <circle cx="10" cy="35" r="3" fill="#FCD34D" />
                    <circle cx="25" cy="32" r="2" fill="#FCD34D" />
                  </g>

                  {/* Beaver sitting beside log */}
                  <g transform="translate(80, 45)">
                    {/* Broad Paddle Tail */}
                    <ellipse cx="-15" cy="75" rx="35" ry="12" fill="#451A03" stroke="#292524" strokeWidth="1.5" transform="rotate(-15)" />
                    {/* Furry Body */}
                    <ellipse cx="45" cy="60" rx="38" ry="30" fill="#78350F" stroke="#451A03" strokeWidth="2" />
                    {/* Head */}
                    <circle cx="78" cy="40" r="22" fill="#92400E" stroke="#451A03" strokeWidth="2" />
                    {/* Small rounded ears */}
                    <circle cx="70" cy="22" r="6" fill="#78350F" />
                    <circle cx="85" cy="22" r="6" fill="#78350F" />
                    {/* Shiny black nose */}
                    <ellipse cx="98" cy="42" rx="5" ry="3.5" fill="#1E293B" />
                    {/* Eye */}
                    <circle cx="82" cy="35" r="3" fill="#1E293B" />
                    <circle cx="83" cy="34" r="1" fill="#FFFFFF" />
                    {/* Huge Orange Incisor Front Teeth! */}
                    <g transform="translate(94, 46)">
                      <rect x="0" y="0" width="4.5" height="11" rx="1" fill="#EA580C" stroke="#7C2D12" strokeWidth="1" />
                      <rect x="5" y="0" width="4.5" height="11" rx="1" fill="#EA580C" stroke="#7C2D12" strokeWidth="1" />
                    </g>
                    {/* Paws grasping wood */}
                    <circle cx="80" cy="72" r="7" fill="#451A03" />
                  </g>

                  {/* Annotation pointer to front teeth */}
                  <g transform="translate(200, 30)">
                    <rect x="0" y="0" width="140" height="26" rx="6" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
                    <text x="70" y="17" textAnchor="middle" fill="#C2410C" fontSize="9" fontWeight="bold">
                      ★ Huge Front Teeth!
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Right: Feature choices */}
            <div className="md:col-span-5 space-y-2">
              {features.map((f) => {
                const active = play.world.feature === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => !play.locked && play.set({ feature: f })}
                    className={`w-full p-3 rounded-xl border-2 text-left font-semibold text-xs transition-all flex items-center justify-between ${
                      active
                        ? "border-amber-600 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-200"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <span>{f}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Distinctive Anatomical Feature" tone="amber">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {features.map((f) => (
                  <WordPill
                    key={f}
                    text={f}
                    tone="amber"
                    selected={play.world.feature === f}
                    onClick={() => play.set({ feature: f })}
                    disabled={play.locked}
                  />
                ))}
              </div>
            </Bay>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — Ecological Impact in South America (adversely affected)
   Question: "What was the outcome of transporting beavers to South America?"
   Options:
     A. They were hunted by wild animals.
     B. The business was successful.
     C. They adversely affected the environment.
     D. All of these -> Key: C (They adversely affected the environment.)
   ══════════════════════════════════════════════════════════════════════ */
export function Q32PatagoniaEcoImpactActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ outcome?: string }>({
    question,
    initial: { outcome: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.outcome) return { note: "Select the ecological consequence in South America" };
      const map: Record<string, string> = {
        "They were hunted by wild animals.": "A",
        "The business was successful.": "B",
        "They adversely affected the environment.": "C",
        "All of these": "D",
      };
      return {
        value: w.outcome,
        optionId: map[w.outcome],
        note: w.outcome === "They adversely affected the environment." ? "Correct: With no natural predators, beavers multiplied rapidly and flooded native Patagonian forests" : `Selected: ${w.outcome}`,
      };
    },
  });

  const outcomes = [
    "They were hunted by wild animals.",
    "The business was successful.",
    "They adversely affected the environment.",
    "All of these",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q32 · Environmental Impact in Patagonia"
      subtitle="Analyze the ecological disruption caused by introducing non-native beavers to South America"
      hints={["Without natural predators like bears or wolves in Patagonia, beavers flooded and destroyed vast tracts of native forest."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <TreePine className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Ecological Impact Assessment</span>
                <span className="text-[11px] font-medium text-slate-500">Tierra del Fuego Ecosystem Alteration</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
              ⚠️ Outcome: Adverse Ecological Impact
            </span>
          </div>

          {/* Impact Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            {outcomes.map((o) => {
              const active = play.world.outcome === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => !play.locked && play.set({ outcome: o })}
                  className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    active
                      ? "border-rose-600 bg-rose-50 text-rose-950 shadow-md ring-2 ring-rose-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span>{o}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Ecological Outcome" tone="rose">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {outcomes.map((o) => (
                  <WordPill
                    key={o}
                    text={o}
                    tone="rose"
                    selected={play.world.outcome === o}
                    onClick={() => play.set({ outcome: o })}
                    disabled={play.locked}
                  />
                ))}
              </div>
            </Bay>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — Purpose of Beaver Dams (protection and food)
   Question: "Why do beavers make dams?"
   Options:
     A. To make their teeth more strong
     B. They are too big to swim in rivers without dams.
     C. For protection and food
     D. To live in the wild -> Key: C (For protection and food)
   ══════════════════════════════════════════════════════════════════════ */
export function Q33DamFunctionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ purpose?: string }>({
    question,
    initial: { purpose: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.purpose) return { note: "Select the primary purpose of dam construction" };
      const map: Record<string, string> = {
        "To make their teeth more strong": "A",
        "They are too big to swim in rivers without dams.": "B",
        "For protection and food": "C",
        "To live in the wild": "D",
      };
      return {
        value: w.purpose,
        optionId: map[w.purpose],
        note: w.purpose === "For protection and food" ? "Correct: Dams create deep ponds that protect the lodge from predators and store branches for winter food" : `Selected: ${w.purpose}`,
      };
    },
  });

  const purposes = [
    "To make their teeth more strong",
    "They are too big to swim in rivers without dams.",
    "For protection and food",
    "To live in the wild",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q33 · Beaver Engineering: Dam Architecture"
      subtitle="Examine the dual survival benefits provided by beaver ponds: predator defence and winter food storage"
      hints={["Deep water behind the dam prevents freezing down to the bed and keeps lodges safe from land predators."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Eco-Architecture Cross-Section</span>
                <span className="text-[11px] font-medium text-slate-500">Lodge Fortress & Winter Food Cache</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🛡️ Purpose: Protection & Food
            </span>
          </div>

          {/* Dam Architecture Diagram */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-emerald-100 p-4 shadow-xs mb-4">
            <div className="relative h-44 rounded-xl bg-gradient-to-b from-sky-100 via-emerald-50 to-blue-100 border border-emerald-300/60 flex items-center justify-center p-2 overflow-hidden">
              <svg viewBox="0 0 380 160" className="w-full h-full">
                {/* Deep water pond */}
                <rect x="0" y="50" width="220" height="110" fill="#0284C7" opacity="0.6" />
                <text x="100" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">DEEP WATER POND (SAFETY)</text>
                <text x="100" y="100" textAnchor="middle" fill="#E0F2FE" fontSize="8">Winter food branches anchored below</text>

                {/* Timber Dam barrier */}
                <g transform="translate(220, 40)">
                  <polygon points="0,120 40,120 30,10 0,20" fill="#78350F" stroke="#451A03" strokeWidth="2" />
                  {/* Criss-crossed sticks */}
                  <line x1="5" y1="30" x2="35" y2="80" stroke="#B45309" strokeWidth="2.5" />
                  <line x1="5" y1="80" x2="35" y2="30" stroke="#B45309" strokeWidth="2.5" />
                  <line x1="5" y1="100" x2="35" y2="50" stroke="#B45309" strokeWidth="2.5" />
                </g>

                {/* Downstream shallow river */}
                <rect x="260" y="110" width="120" height="50" fill="#38BDF8" opacity="0.4" />
                <text x="320" y="135" textAnchor="middle" fill="#0369A1" fontSize="9" fontWeight="bold">Shallow Creek</text>

                {/* Beaver Lodge Dome */}
                <g transform="translate(50, 20)">
                  <path d="M 0 50 Q 40 10 80 50 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
                  {/* Dry nest chamber inside */}
                  <ellipse cx="40" cy="42" rx="22" ry="12" fill="#FEF3C7" />
                  <text x="40" y="45" textAnchor="middle" fill="#78350F" fontSize="7" fontWeight="bold">DRY NEST</text>
                  {/* Underwater entrance tube */}
                  <path d="M 15 50 L 15 80 L 30 80 L 30 50" fill="#0284C7" stroke="#451A03" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>

          {/* Purpose Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {purposes.map((p) => {
              const active = play.world.purpose === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => !play.locked && play.set({ purpose: p })}
                  className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    active
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span>{p}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Dam Purpose" tone="emerald">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {purposes.map((p) => (
                  <WordPill
                    key={p}
                    text={p}
                    tone="emerald"
                    selected={play.world.purpose === p}
                    onClick={() => play.set({ purpose: p })}
                    disabled={play.locked}
                  />
                ))}
              </div>
            </Bay>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — Relocation to Goa (Moved)
   Sentence: "How are you? I have ______ to a new house and I now live in Goa."
   Options: A. change, B. moved, C. calculated, D. paused -> Key: B (moved)
   ══════════════════════════════════════════════════════════════════════ */
export function Q34GoaRelocationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the verb expressing relocation" };
      const map: Record<string, string> = { change: "A", moved: "B", calculated: "C", paused: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "moved" ? "Correct: 'moved to a new house' expresses residential relocation" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["change", "moved", "calculated", "paused"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q34 · Moving to Sunny Goa (Email Cloze)"
      subtitle="Complete the opening greeting of the email announcing the family's house relocation"
      hints={["To change one's permanent residence to a new home is to 'move house' or 'have moved to a new house'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-teal-50/40 to-amber-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Email to Friend · New Home in Goa</span>
                <span className="text-[11px] font-medium text-slate-500">Section 4: Contextual Cloze Email</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300">
              🌴 Welcome to Goa
            </span>
          </div>

          {/* Moving Van & Palm Trees Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-sky-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 border border-sky-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Palm Tree on left */}
                  <g transform="translate(40, 20)">
                    <path d="M 20 130 Q 15 70 30 20" stroke="#92400E" strokeWidth="6" fill="none" />
                    {/* Palm Fronds */}
                    <path d="M 30 20 Q -5 0 -20 20" stroke="#15803D" strokeWidth="3" fill="none" />
                    <path d="M 30 20 Q 10 -10 0 -25" stroke="#15803D" strokeWidth="3" fill="none" />
                    <path d="M 30 20 Q 50 -10 65 -20" stroke="#15803D" strokeWidth="3" fill="none" />
                    <path d="M 30 20 Q 70 5 80 25" stroke="#15803D" strokeWidth="3" fill="none" />
                  </g>

                  {/* Sunny Goa Beach Villa on right */}
                  <g transform="translate(230, 45)">
                    {/* Villa Roof */}
                    <polygon points="0,40 60,10 120,40" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
                    {/* Villa Walls */}
                    <rect x="10" y="40" width="100" height="75" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                    {/* Balcony */}
                    <rect x="25" y="55" width="40" height="20" fill="#38BDF8" opacity="0.6" stroke="#0284C7" strokeWidth="1" />
                    {/* Door */}
                    <rect x="75" y="70" width="22" height="45" fill="#78350F" />
                  </g>

                  {/* Moving Van in center driveway */}
                  <g transform="translate(90, 80)">
                    {/* Van Cargo Box */}
                    <rect x="0" y="10" width="90" height="50" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
                    <text x="45" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">MOVERS 🚚</text>
                    {/* Van Cabin */}
                    <path d="M 90 25 L 120 25 L 130 45 L 130 60 L 90 60 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
                    <rect x="95" y="30" width="22" height="15" rx="2" fill="#BAE6FD" />
                    {/* Wheels */}
                    <circle cx="30" cy="62" r="10" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                    <circle cx="110" cy="62" r="10" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1">Residential Relocation</span>
                <div className="text-xs text-slate-700 font-mono bg-sky-50/70 p-2.5 rounded-lg border border-sky-200/60 leading-relaxed">
                  have + <span className="text-blue-600 font-bold">moved</span> to a new house
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Moved" indicates establishing a new residence in Goa.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-sky-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              How are you? I have{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              to a new house and I now live in Goa.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Relocation Verb" tone="sky">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {verbs.map((v) => (
                  <WordPill
                    key={v}
                    text={v}
                    tone="sky"
                    selected={play.world.verb === v}
                    onClick={() => play.set({ verb: v })}
                    disabled={play.locked}
                  />
                ))}
              </div>
            </Bay>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — Hospitality Invitation (Visit)
   Sentence: "This means I live much closer to you and I hope that you can ______ more often."
   Options: A. visit, B. travel, C. accommodate, D. borrow -> Key: A (visit)
   ══════════════════════════════════════════════════════════════════════ */
export function Q35HospitalityInviteActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the verb expressing a social visit" };
      const map: Record<string, string> = { visit: "A", travel: "B", accommodate: "C", borrow: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "visit" ? "Correct: 'visit more often' expresses the natural desire for friendly social calls" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["visit", "travel", "accommodate", "borrow"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q35 · Proximity & Hospitality Invitation"
      subtitle="Complete the friendly invite encouraging frequent visits now that the distance is reduced"
      hints={["When you live closer to friends, you hope they can come over and 'visit' more often."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Friendship GPS Route · Close Distance</span>
                <span className="text-[11px] font-medium text-slate-500">Encouraging Frequent Weekend Visits</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              💌 Invite: Visit More Often
            </span>
          </div>

          {/* Proximity Map Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-emerald-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-emerald-50 via-sky-50 to-amber-50 border border-emerald-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Connecting dashed scenic route */}
                  <path d="M 80 100 Q 180 30 300 100" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="8,6" />

                  {/* Friend's House (Origin) */}
                  <g transform="translate(50, 75)">
                    <rect x="0" y="15" width="45" height="35" rx="3" fill="#60A5FA" />
                    <polygon points="0,15 22.5,0 45,15" fill="#2563EB" />
                    <text x="22.5" y="62" textAnchor="middle" fill="#1E3A8A" fontSize="8" fontWeight="bold">YOUR HOME</text>
                  </g>

                  {/* Bicycle moving along route */}
                  <g transform="translate(180, 50)">
                    <circle cx="10" cy="15" r="7" fill="#1E293B" />
                    <circle cx="35" cy="15" r="7" fill="#1E293B" />
                    <line x1="10" y1="15" x2="22" y2="5" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="22" y1="5" x2="35" y2="15" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="10" y1="15" x2="25" y2="15" stroke="#F59E0B" strokeWidth="2" />
                    <text x="22" y="-2" textAnchor="middle" fill="#D97706" fontSize="7.5" fontWeight="bold">Short Ride! 🚲</text>
                  </g>

                  {/* New Goa House (Destination) */}
                  <g transform="translate(275, 70)">
                    <rect x="0" y="15" width="55" height="40" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                    <polygon points="0,15 27.5,-2 55,15" fill="#EA580C" />
                    <text x="27.5" y="68" textAnchor="middle" fill="#92400E" fontSize="8" fontWeight="bold">NEW GOA VILLA</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Social Collocation</span>
                <div className="text-xs text-slate-700 font-mono bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                  hope that you can <span className="text-purple-600 font-bold">visit</span> more often
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Visit" naturally pairs with coming over to see a friend at their new house.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-emerald-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              This means I live much closer to you and I hope that you can{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              more often.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Hospitality Verb" tone="emerald">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {verbs.map((v) => (
                  <WordPill
                    key={v}
                    text={v}
                    tone="emerald"
                    selected={play.world.verb === v}
                    onClick={() => play.set({ verb: v })}
                    disabled={play.locked}
                  />
                ))}
              </div>
            </Bay>
          </div>
        </div>
      </Board>
    </Shell>
  );
}

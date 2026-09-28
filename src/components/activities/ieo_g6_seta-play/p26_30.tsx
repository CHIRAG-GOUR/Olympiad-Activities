"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { Search, BookOpen, Clock, Compass, ShieldAlert, Sparkles, CheckCircle2, AlertCircle, FileText } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — Forensic Spelling Scanner ('Amature' vs 'Amateur')
   Question: "Choose the word with the incorrect spelling."
   Options: A. Amature, B. Anarchist, C. Stoic, D. Insolvent -> Key: A (Amature)
   ══════════════════════════════════════════════════════════════════════ */
export function Q26SpellingInspectorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string }>({
    question,
    initial: { selectedWord: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Select the word containing a spelling error" };
      const map: Record<string, string> = { Amature: "A", Anarchist: "B", Stoic: "C", Insolvent: "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note: w.selectedWord === "Amature" ? "Correct error flagged: 'Amature' is misspelled (correct: 'Amateur' with -eur)" : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["Amature", "Anarchist", "Stoic", "Insolvent"];
  const definitions: Record<string, string> = {
    Amature: "❌ Misspelled! Correct: 'Amateur' (a non-professional or hobbyist, from French -eur).",
    Anarchist: "✓ Correctly spelt: A person who believes in or advocates anarchism.",
    Stoic: "✓ Correctly spelt: A person who can endure pain or hardship without showing feelings.",
    Insolvent: "✓ Correctly spelt: Unable to pay debts owed; bankrupt.",
  };

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q26 · Lexical Forensic Spelling Inspector"
      subtitle="Inspect four vocabulary entries and flag the single word containing an orthographic error"
      hints={["Look closely at the suffix of the first word: English uses French ending '-eur' in 'amateur'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-purple-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Lexical Scanner · Section 2: Spelling</span>
                <span className="text-[11px] font-medium text-slate-500">Orthographic Diagnostic Analysis</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
              🔍 Target: Find Incorrect Spelling
            </span>
          </div>

          {/* Forensic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-4">
            {words.map((w) => {
              const active = play.world.selectedWord === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => !play.locked && play.set({ selectedWord: w })}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all relative ${
                    active
                      ? "border-rose-500 bg-rose-50/90 shadow-md ring-2 ring-rose-200"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm font-bold text-slate-900">{w}</span>
                    {active && <span className="text-xs font-bold text-rose-600">FLAGGED</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {definitions[w]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Analysis Banner */}
          <div className="mt-4 rounded-xl border border-rose-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase">Spelling Analysis Result</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {play.world.selectedWord
                    ? definitions[play.world.selectedWord]
                    : "Click any word above or the pills below to run optical character inspection."}
                </p>
              </div>
            </div>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Incorrectly Spelt Word" tone="rose">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {words.map((w) => (
                  <WordPill
                    key={w}
                    text={w}
                    tone="rose"
                    selected={play.world.selectedWord === w}
                    onClick={() => play.set({ selectedWord: w })}
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
   Q27 — Beaver Passage Suitable Title (Reading Comprehension)
   Question: "Choose the most suitable title for the passage."
   Options:
     A. Beavers: Animals that are like mice
     B. Beavers: Animals that won't survive hunting
     C. Beavers: The rarest animals
     D. Beavers: Animals that are returning -> Key: D
   ══════════════════════════════════════════════════════════════════════ */
export function Q27PassageTitleActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ titleChoice?: string }>({
    question,
    initial: { titleChoice: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.titleChoice) return { note: "Select the most accurate summary title for the reading passage" };
      const map: Record<string, string> = {
        "Beavers: Animals that are like mice": "A",
        "Beavers: Animals that won't survive hunting": "B",
        "Beavers: The rarest animals": "C",
        "Beavers: Animals that are returning": "D",
      };
      return {
        value: w.titleChoice,
        optionId: map[w.titleChoice],
        note: w.titleChoice.includes("returning") ? "Correct: The passage highlights beaver conservation, reintroduction, and their return" : `Selected: ${w.titleChoice}`,
      };
    },
  });

  const titles = [
    "Beavers: Animals that are like mice",
    "Beavers: Animals that won't survive hunting",
    "Beavers: The rarest animals",
    "Beavers: Animals that are returning",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q27 · Wildlife Passage Title Synthesis"
      subtitle="Read the beaver conservation chronicle and select the most fitting overarching title"
      hints={["The central thesis covers how beavers are being brought back and reintroduced to their historical habitats."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Reading Comprehension · Passage Analysis</span>
                <span className="text-[11px] font-medium text-slate-500">The Story of Beaver Reintroduction & Rewilding</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              📖 Section 3: Reading
            </span>
          </div>

          {/* Reading Summary Card */}
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs mb-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-900 uppercase">
              <FileText className="w-4 h-4 text-emerald-600" /> Passage Synopsis
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
              "Beavers once vanished from many parts of the world due to extensive fur hunting. In recent decades, conservationists have reintroduced them across European waterways and studied their legacy across the globe. Today, these remarkable ecosystem engineers are making a triumphant comeback to their ancestral rivers..."
            </p>
          </div>

          {/* Title Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {titles.map((t) => {
              const active = play.world.titleChoice === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => !play.locked && play.set({ titleChoice: t })}
                  className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    active
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span>{t}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Primary Headline Title" tone="emerald">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {titles.map((t) => (
                  <WordPill
                    key={t}
                    text={t}
                    tone="emerald"
                    selected={play.world.titleChoice === t}
                    onClick={() => play.set({ titleChoice: t })}
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
   Q28 — South America Beaver Introduction (1940s)
   Question: "When did beavers get introduced to South America?"
   Options: A. 16th century, B. 1940s, C. 1980s, D. 21st century -> Key: B (1940s)
   ══════════════════════════════════════════════════════════════════════ */
export function Q28HistoricalTimelineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ era?: string }>({
    question,
    initial: { era: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.era) return { note: "Select the decade when beavers were brought to South America" };
      const map: Record<string, string> = { "16th century": "A", "1940s": "B", "1980s": "C", "21st century": "D" };
      return {
        value: w.era,
        optionId: map[w.era],
        note: w.era === "1940s" ? "Correct passage fact: 20 beavers were introduced to Tierra del Fuego in 1946 (1940s)" : `Selected: ${w.era}`,
      };
    },
  });

  const eras = ["16th century", "1940s", "1980s", "21st century"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q28 · South American Introduction Timeline"
      subtitle="Identify the historical decade when beavers were transported to South America"
      hints={["According to the passage, beavers were imported to Argentina/Chile in the 1940s to establish a commercial fur industry."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-blue-200/80 bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">Historical Chronology · Patagonia Archive</span>
                <span className="text-[11px] font-medium text-slate-500">Transcontinental Wildlife Relocation</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-300">
              📅 Decade: 1940s
            </span>
          </div>

          {/* Timeline Milestones Graphic */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-blue-100 p-4 shadow-xs mb-4">
            <div className="relative h-44 rounded-xl bg-gradient-to-b from-sky-100 to-slate-100 border border-blue-300/60 flex items-center justify-center p-2 overflow-hidden">
              <svg viewBox="0 0 380 160" className="w-full h-full">
                {/* Timeline axis line */}
                <line x1="30" y1="80" x2="350" y2="80" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />

                {/* Milestone 1: 16th Century */}
                <g transform="translate(60, 80)">
                  <circle cx="0" cy="0" r="10" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
                  <text x="0" y="-18" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">16th Century</text>
                  <text x="0" y="25" textAnchor="middle" fill="#64748B" fontSize="8">UK Extinction</text>
                </g>

                {/* Milestone 2: 1940s (Target Highlight) */}
                <g transform="translate(160, 80)">
                  <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
                  <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
                  <text x="0" y="-22" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="bold">1940s ★</text>
                  <text x="0" y="28" textAnchor="middle" fill="#92400E" fontSize="8.5" fontWeight="bold">South America Intro</text>
                </g>

                {/* Milestone 3: 1980s */}
                <g transform="translate(250, 80)">
                  <circle cx="0" cy="0" r="10" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
                  <text x="0" y="-18" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">1980s</text>
                  <text x="0" y="25" textAnchor="middle" fill="#64748B" fontSize="8">Forest Impact</text>
                </g>

                {/* Milestone 4: 21st Century */}
                <g transform="translate(330, 80)">
                  <circle cx="0" cy="0" r="10" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
                  <text x="0" y="-18" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">21st Century</text>
                  <text x="0" y="25" textAnchor="middle" fill="#64748B" fontSize="8">Global Rewilding</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Question Text */}
          <div className="rounded-xl border-2 border-blue-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              When did beavers get introduced to South America?
            </p>
            {play.world.era && (
              <span className="inline-block mt-2 font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200 text-sm">
                Selected: {play.world.era}
              </span>
            )}
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Historical Time Period" tone="sky">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {eras.map((e) => (
                  <WordPill
                    key={e}
                    text={e}
                    tone="sky"
                    selected={play.world.era === e}
                    onClick={() => play.set({ era: e })}
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
   Q29 — European Beaver Reintroduction Reason (because there were none left)
   Question: "Why were beavers reintroduced in Europe?"
   Options:
     A. because there were none left
     B. because they cannot help the environment
     C. for their fur
     D. for protection against predators -> Key: A
   ══════════════════════════════════════════════════════════════════════ */
export function Q29EuropeanRewildingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ reason?: string }>({
    question,
    initial: { reason: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.reason) return { note: "Select the conservation rationale for European reintroduction" };
      const map: Record<string, string> = {
        "because there were none left": "A",
        "because they cannot help the environment": "B",
        "for their fur": "C",
        "for protection against predators": "D",
      };
      return {
        value: w.reason,
        optionId: map[w.reason],
        note: w.reason === "because there were none left" ? "Correct: European reintroduction programs were launched because native populations had become completely extinct" : `Selected: ${w.reason}`,
      };
    },
  });

  const reasons = [
    "because there were none left",
    "because they cannot help the environment",
    "for their fur",
    "for protection against predators",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q29 · European Conservation & Rewilding"
      subtitle="Determine the underlying reason conservationists brought beavers back to European rivers"
      hints={["Centuries of over-trapping left zero wild beavers across most European nations, necessitating reintroduction."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">European Rewilding Initiative</span>
                <span className="text-[11px] font-medium text-slate-500">Restoring Extirpated Wetland Habitats</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🌿 Reason: None Left (Extinction Recovery)
            </span>
          </div>

          {/* Reason Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            {reasons.map((r) => {
              const active = play.world.reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => !play.locked && play.set({ reason: r })}
                  className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    active
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span>{r}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Conservation Cause" tone="emerald">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {reasons.map((r) => (
                  <WordPill
                    key={r}
                    text={r}
                    tone="emerald"
                    selected={play.world.reason === r}
                    onClick={() => play.set({ reason: r })}
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
   Q30 — Primary Cause of Population Decline (Hunted for fur)
   Question: "What is the main reason that beavers' number has reduced?"
   Options:
     A. Hunted to reduce damming
     B. Hunted for fur
     C. Cannot breed with one another
     D. Hunted by other animals -> Key: B (Hunted for fur)
   ══════════════════════════════════════════════════════════════════════ */
export function Q30FurHuntingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ cause?: string }>({
    question,
    initial: { cause: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.cause) return { note: "Select the primary historical cause of beaver decline" };
      const map: Record<string, string> = {
        "Hunted to reduce damming": "A",
        "Hunted for fur": "B",
        "Cannot breed with one another": "C",
        "Hunted by other animals": "D",
      };
      return {
        value: w.cause,
        optionId: map[w.cause],
        note: w.cause === "Hunted for fur" ? "Correct: Beavers were hunted nearly to extinction for their valuable, waterproof pelts" : `Selected: ${w.cause}`,
      };
    },
  });

  const causes = [
    "Hunted to reduce damming",
    "Hunted for fur",
    "Cannot breed with one another",
    "Hunted by other animals",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q30 · Historical Fur Trade & Population Decline"
      subtitle="Identify the commercial factor that drove global beaver populations to near-extinction"
      hints={["Beavers possess dense, water-repellent fur that was intensely prized for luxury felt hats and coats."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Historical Conservation Museum</span>
                <span className="text-[11px] font-medium text-slate-500">18th-19th Century Commercial Trapping Impact</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🧥 Main Factor: Hunted for Fur
            </span>
          </div>

          {/* Causes Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            {causes.map((c) => {
              const active = play.world.cause === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => !play.locked && play.set({ cause: c })}
                  className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    active
                      ? "border-amber-600 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span>{c}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Primary Cause" tone="amber">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {causes.map((c) => (
                  <WordPill
                    key={c}
                    text={c}
                    tone="amber"
                    selected={play.world.cause === c}
                    onClick={() => play.set({ cause: c })}
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

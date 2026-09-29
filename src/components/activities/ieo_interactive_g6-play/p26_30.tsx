"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, Bay, World3D } from "./kit";
import { Search, BookOpen, Clock, Compass, ShieldAlert, AlertCircle } from "lucide-react";
import {
  LexicalVault3D,
  BeaverHabitat3D,
  GlacierExpedition3D,
  Avatar3D,
} from "./components3D";

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
      dim="3D"
      play={play}
      question={question}
      title="Q26 · Lexical Forensic Spelling Vault 3D"
      subtitle="Inspect 3D vocabulary pedestals and flag the single word containing an orthographic error"
      hints={["Look closely at the suffix of the first word: English uses French ending '-eur' in 'amateur'."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-purple-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 p-4 bg-white/60 backdrop-blur-xs">
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

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0.9, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#E11D48" pantsColor="#1E293B" hairStyle="short" pose="gesturing" />
          </World3D>
        </div>

        {/* Forensic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
        <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-xs">
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
      dim="3D"
      play={play}
      question={question}
      title="Q27 · Beaver Wetland Habitat & Title Synthesis 3D"
      subtitle="Examine the 3D beaver river ecosystem and select the overarching headline title"
      hints={["The central thesis covers how beavers are being brought back and reintroduced to their historical habitats."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
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

          <World3D height="280px" camera={{ position: [0, 2.6, 5.0], fov: 45 }}>
            <BeaverHabitat3D position={[0, 0, 0]} />
            <Avatar3D position={[1.4, 0, 0.4]} rotation={[0, -0.7, 0]} shirtColor="#059669" hairStyle="cap" pose="standing" />
          </World3D>
        </div>

        {/* Title Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
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
      dim="3D"
      play={play}
      question={question}
      title="Q28 · South American Introduction Expedition 3D"
      subtitle="Examine the 3D Patagonian expedition terrain and identify the decade of introduction"
      hints={["According to the passage, beavers were imported to Argentina/Chile in the 1940s to establish a commercial fur industry."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-blue-200/80 bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200/60 p-4 bg-white/60 backdrop-blur-xs">
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

          <World3D height="280px" camera={{ position: [0, 2.8, 5.2], fov: 45 }}>
            <GlacierExpedition3D position={[0, 0, 0]} />
            <Avatar3D position={[0.8, 0, 0.5]} rotation={[0, -0.6, 0]} shirtColor="#2563EB" hairStyle="cap" hasBackpack backpackColor="#F59E0B" pose="standing" />
          </World3D>
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
      dim="3D"
      play={play}
      question={question}
      title="Q29 · European Conservation & Rewilding 3D"
      subtitle="Examine the restored river wetland and determine why beavers were reintroduced"
      hints={["Centuries of over-trapping left zero wild beavers across most European nations, necessitating reintroduction."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
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

          <World3D height="280px" camera={{ position: [0, 2.6, 5.0], fov: 45 }}>
            <BeaverHabitat3D position={[0, 0, 0]} />
            <Avatar3D position={[-1.2, 0, 0.4]} rotation={[0, 0.7, 0]} shirtColor="#0D9488" hairStyle="ponytail" pose="gesturing" />
          </World3D>
        </div>

        {/* Reason Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
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
      dim="3D"
      play={play}
      question={question}
      title="Q30 · Historical Fur Trade & Population Decline 3D"
      subtitle="Examine the riverbank habitat and identify the commercial factor that drove population loss"
      hints={["Beavers possess dense, water-repellent fur that was intensely prized for luxury felt hats and coats."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
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

          <World3D height="280px" camera={{ position: [0, 2.6, 5.0], fov: 45 }}>
            <BeaverHabitat3D position={[0, 0, 0]} />
            <Avatar3D position={[1.1, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#D97706" hairStyle="bun" pose="gesturing" />
          </World3D>
        </div>

        {/* Causes Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
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
      </Board>
    </Shell>
  );
}

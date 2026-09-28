"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { BookOpen, ShieldAlert, Sparkles, History, Search, FileText } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — Spelling Lock (Section 2: Spelling)
   Question: "Choose the word with the incorrect spelling."
   Options: A. Amature, B. Anarchist, C. Stoic, D. Insolvent -> Key: A (Amature)
   ══════════════════════════════════════════════════════════════════════ */
export function Q26SpellingLockActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string }>({
    question,
    initial: { selectedWord: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Inspect words in the spelling scanner" };
      const map: Record<string, string> = { Amature: "A", Anarchist: "B", Stoic: "C", Insolvent: "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note: w.selectedWord === "Amature" ? "Correctly identified misspelling: 'Amature' (correct: 'Amateur')" : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["Amature", "Anarchist", "Stoic", "Insolvent"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q26 · Word Vault Spelling Scanner"
      subtitle="Examine the four word plates and identify the misspelling"
      hints={["'Amature' is misspelled; the correct spelling is 'Amateur' (a-m-a-t-e-u-r)."]}
    >
      <Board>
        {/* Spelling Scanner Vault */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {words.map((w) => (
            <div
              key={w}
              onClick={() => !play.locked && play.set({ selectedWord: w })}
              className={`p-3 rounded-xl border text-center font-mono cursor-pointer transition-all ${
                play.world.selectedWord === w
                  ? "bg-purple-100 border-purple-400 text-purple-900 shadow-md ring-2 ring-purple-300"
                  : "bg-white border-slate-200 hover:border-purple-200 text-slate-800"
              }`}
            >
              <span className="text-xs font-bold block">{w}</span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {w === "Amature" ? "⚠️ Spelling Flag" : "✓ Dictionary Match"}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Selected Misspelled Word: <span className="font-mono font-bold text-purple-900">{play.world.selectedWord || "None"}</span>
          </p>
        </div>

        <Bay label="Identify Incorrect Spelling" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {words.map((w) => (
              <WordPill
                key={w}
                text={w}
                tone="purple"
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
   Q27 — Beaver Conservation Documentary (Reading: Suitable Title)
   Question: "Choose the most suitable title for the passage."
   Options: A. Beavers: Animals that are like mice, B. Beavers: Animals that won't survive hunting, C. Beavers: The rarest animals, D. Beavers: Animals that are returning -> Key: D
   ══════════════════════════════════════════════════════════════════════ */
export function Q27BeaverExpeditionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ title?: string }>({
    question,
    initial: { title: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.title) return { note: "Select the most suitable passage title" };
      const map: Record<string, string> = {
        "Beavers: Animals that are like mice": "A",
        "Beavers: Animals that won't survive hunting": "B",
        "Beavers: The rarest animals": "C",
        "Beavers: Animals that are returning": "D",
      };
      return {
        value: w.title,
        optionId: map[w.title],
        note: w.title?.includes("returning") ? "Correct: Captures the overarching theme of global recovery and reintroduction" : `Selected: ${w.title}`,
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
      title="Q27 · Beaver Conservation Documentary"
      subtitle="Synthesize the entire passage themes into the most accurate document title"
      hints={["The passage traces historical hunting followed by successful modern reintroduction in Europe and South America, showing they are 'returning'."]}
    >
      <Board>
        {/* Documentary Synopsis Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Passage Theme Summary: Global Beaver Populations & Modern Recovery</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Covers beaver anatomy, dam building, historical hunting for fur, transplantation to South America, and successful European reintroduction programs.
          </p>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Selected Title: <span className="font-bold text-purple-900">{play.world.title || "None"}</span>
          </p>
        </div>

        <Bay label="Passage Title Options" tone="emerald">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
            {titles.map((t) => (
              <WordPill
                key={t}
                text={t}
                tone="emerald"
                selected={play.world.title === t}
                onClick={() => play.set({ title: t })}
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
   Q28 — South America Time Portal (Reading Fact: 1940s)
   Question: "When did beavers get introduced to South America?"
   Options: A. 16th century, B. 1940s, C. 1980s, D. 21st century -> Key: B (1940s)
   ══════════════════════════════════════════════════════════════════════ */
export function Q28SouthAmericaTimelineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ period?: string }>({
    question,
    initial: { period: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.period) return { note: "Select the historical introduction era" };
      const map: Record<string, string> = { "16th century": "A", "1940s": "B", "1980s": "C", "21st century": "D" };
      return {
        value: w.period,
        optionId: map[w.period],
        note: w.period === "1940s" ? "Correct passage fact: 20 Canadian beavers introduced in the 1940s" : `Selected: ${w.period}`,
      };
    },
  });

  const periods = ["16th century", "1940s", "1980s", "21st century"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q28 · South America Time Portal"
      subtitle="Pinpoint the exact decade when beavers were brought to Tierra del Fuego"
      hints={["According to the passage, beavers were introduced to South America in the 1940s to establish a fur industry."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <History className="w-4 h-4 text-amber-700" />
            <span>Historical Timeline: Fur Industry Expansion Project</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Introduction Era: <span className="font-mono font-bold text-purple-900">{play.world.period || "Unspecified"}</span>
          </p>
        </div>

        <Bay label="Historical Era Selector" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {periods.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="amber"
                selected={play.world.period === p}
                onClick={() => play.set({ period: p })}
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
   Q29 — European Wildlife Restoration (Reading Fact: None Left)
   Question: "Why were beavers reintroduced in Europe?"
   Options: A. because there were none left, B. because they cannot help the environment, C. for their fur, D. for protection against predators -> Key: A
   ══════════════════════════════════════════════════════════════════════ */
export function Q29ConservationMissionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ reason?: string }>({
    question,
    initial: { reason: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.reason) return { note: "Select the reason for European reintroduction" };
      const map: Record<string, string> = {
        "because there were none left": "A",
        "because they cannot help the environment": "B",
        "for their fur": "C",
        "for protection against predators": "D",
      };
      return {
        value: w.reason,
        optionId: map[w.reason],
        note: w.reason?.includes("none left") ? "Correct: Intensive hunting had caused total local extinction across many countries" : `Selected: ${w.reason}`,
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
      title="Q29 · European Wildlife Restoration"
      subtitle="Identify the conservation motive for returning beavers to Europe"
      hints={["The text states that beavers had vanished completely (none left) from many European regions due to historical overhunting."]}
    >
      <Board>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-xs sm:text-sm">
            <FileText className="w-4 h-4 text-sky-700" />
            <span>Conservation Audit: European Beaver Extinction Assessment</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Selected Motive: <span className="font-bold text-purple-900">{play.world.reason || "None"}</span>
          </p>
        </div>

        <Bay label="Conservation Reason" tone="sky">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
            {reasons.map((r) => (
              <WordPill
                key={r}
                text={r}
                tone="sky"
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
   Q30 — Fur Trading Investigation (Reading Cause: Hunted for fur)
   Question: "What is the main reason that beavers' number has reduced?"
   Options: A. Hunted to reduce damming, B. Hunted for fur, C. Cannot breed with one another, D. Hunted by other animals -> Key: B
   ══════════════════════════════════════════════════════════════════════ */
export function Q30FurTradingInvestigationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ cause?: string }>({
    question,
    initial: { cause: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.cause) return { note: "Select the primary cause of population decline" };
      const map: Record<string, string> = {
        "Hunted to reduce damming": "A",
        "Hunted for fur": "B",
        "Cannot breed with one another": "C",
        "Hunted by other animals": "D",
      };
      return {
        value: w.cause,
        optionId: map[w.cause],
        note: w.cause === "Hunted for fur" ? "Correct: High market demand for thick fur coats and felt hats drove excessive hunting" : `Selected: ${w.cause}`,
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
      title="Q30 · Fur Trade Investigation"
      subtitle="Review the historical commercial factors that depleted beaver numbers"
      hints={["The text confirms beavers were extensively hunted for their luxurious warm waterproof pelts."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <Search className="w-4 h-4 text-amber-700" />
            <span>Commercial Fur Trade Evidence Board (18th–19th Century)</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Identified Factor: <span className="font-bold text-purple-900">{play.world.cause || "None"}</span>
          </p>
        </div>

        <Bay label="Population Decline Cause" tone="amber">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
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

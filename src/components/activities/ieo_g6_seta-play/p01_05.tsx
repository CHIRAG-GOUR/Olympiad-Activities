"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Pizza,
  Building2,
  Wallet,
  Activity,
  Snowflake,
  Flower2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import {
  PizzaTown3D,
  HotelCheckout3D,
  HandballCourt3D,
  SnowMountain3D,
  FlowerVase3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — 🍕 3D Pizza Town Detective
   Sentence: "It's a ______ that there aren't any good pizzerias in this town."
   Options: A. shame, B. shaming, C. shamed, D. shameful -> Key: A (shame)
   ══════════════════════════════════════════════════════════════════════ */
export function Q01MorningRoutineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [inspectedPizzeria, setInspectedPizzeria] = useState<number | null>(null);

  const play = usePlay<{ selectedWord?: string; inspectedCount: number }>({
    question,
    initial: { selectedWord: undefined, inspectedCount: 0 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Inspect the town pizzerias and install the magnetic noun tile" };
      const map: Record<string, string> = { shame: "A", shaming: "B", shamed: "C", shameful: "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note:
          w.selectedWord === "shame"
            ? "Grammatically perfect: 'It's a shame that...' expresses regret regarding the lack of pizzerias."
            : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["shame", "shaming", "shamed", "shameful"];
  const pizzerias = [
    { name: "Luigi's Oven", status: "Permanently Closed", rating: "1.2 ★" },
    { name: "Piazza Slice", status: "Under Renovation", rating: "1.8 ★" },
    { name: "Express Pizza", status: "Poor Quality / Cold", rating: "2.0 ★" },
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q1 · 3D Pizza Town Detective"
      subtitle="Investigate town restaurants, find the editorial desk, and complete the regret expression"
      hints={[
        "The idiom 'It's a shame that...' uses the singular noun 'shame' to express disappointment that no good pizzerias exist in town.",
      ]}
    >
      <Board>
        {/* 3D Miniature European Town */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-900/10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-3.5 bg-white/70 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 text-white shadow-xs">
                <Pizza className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Town Restaurant Inspection
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Search for quality pizza places
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {pizzerias.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInspectedPizzeria(idx);
                    play.patch({ inspectedCount: idx + 1 });
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                    inspectedPizzeria === idx
                      ? "bg-red-500 text-white border-red-600 shadow-xs"
                      : "bg-white/80 text-slate-700 border-slate-200 hover:bg-red-50"
                  }`}
                >
                  Spot #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.2], fov: 45 }}>
            <PizzaTown3D position={[0, 0, 0]} />
            <Avatar3D position={[0.8, 0, 0]} pose="walking" hairStyle="cap" shirtColor="#EF4444" />
          </World3D>

          {inspectedPizzeria !== null && (
            <div className="p-3 bg-red-50/90 border-t border-red-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-red-900">{pizzerias[inspectedPizzeria].name}: </span>
                <span className="text-red-700">{pizzerias[inspectedPizzeria].status} ({pizzerias[inspectedPizzeria].rating})</span>
              </div>
              <span className="text-[11px] font-bold text-red-600">No good pizzeria found!</span>
            </div>
          )}
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 text-center shadow-xs border-2 border-slate-700">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            It&apos;s a{" "}
            <SentenceSlot value={play.world.selectedWord} filled={!!play.world.selectedWord} />{" "}
            that there aren&apos;t any good pizzerias in this town.
          </p>
        </div>

        {/* Magnetic Word Bay */}
        <Bay label="Magnetic Word Tiles · Editorial Desk" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {words.map((w) => (
              <WordPill
                key={w}
                word={w}
                selected={play.world.selectedWord === w}
                onClick={() => play.patch({ selectedWord: w })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q2 — 🏨 3D Hotel Checkout Escape
   Sentence: "I couldn't stay any longer due ______ having enough money to pay for the hotel."
   Options: A. to, B. to not, C. not to, D. not -> Key: B (to not)
   ══════════════════════════════════════════════════════════════════════ */
export function Q02PackingRobotActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ phraseChoice?: string; billChecked: boolean }>({
    question,
    initial: { phraseChoice: undefined, billChecked: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phraseChoice) return { note: "Assemble the correct prepositional negation sequence" };
      const map: Record<string, string> = { to: "A", "to not": "B", "not to": "C", not: "D" };
      return {
        value: w.phraseChoice,
        optionId: map[w.phraseChoice],
        note:
          w.phraseChoice === "to not"
            ? "Grammatically correct: 'due to not having enough money' connects the cause to the gerund phrase."
            : `Selected: ${w.phraseChoice}`,
      };
    },
  });

  const choices = ["to", "to not", "not to", "not"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q2 · 3D Hotel Checkout Escape"
      subtitle="Inspect the hotel bill and wallet, then assemble the causal negation structure"
      hints={[
        "The preposition 'due to' is followed by a gerund clause. When negated, 'not' comes before the gerund: 'due to not having...'",
      ]}
    >
      <Board>
        {/* 3D Hotel Lobby */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Grand Plaza Hotel Checkout
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Balance: $320 due vs $40 in wallet
                </span>
              </div>
            </div>

            <button
              onClick={() => play.patch({ billChecked: true })}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                play.world.billChecked
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              {play.world.billChecked ? "Bill & Wallet Inspected" : "Inspect Bill & Wallet"}
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <HotelCheckout3D position={[0, 0, 0]} />
            <Avatar3D position={[-1.2, 0, 0.4]} pose="standing" shirtColor="#2563EB" hairStyle="short" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I couldn&apos;t stay any longer due{" "}
            <SentenceSlot value={play.world.phraseChoice} filled={!!play.world.phraseChoice} />{" "}
            having enough money to pay for the hotel.
          </p>
        </div>

        {/* Word Insertion Bay */}
        <Bay label="Grammar Reconstruction Terminal" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {choices.map((c) => (
              <WordPill
                key={c}
                word={c}
                selected={play.world.phraseChoice === c}
                onClick={() => play.patch({ phraseChoice: c })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q3 — 🤾 3D Handball Talent Scanner
   Sentence: "Either Frank or Jane ______ handball really well, but I can never remember who though."
   Options: A. was played, B. play, C. playing, D. plays -> Key: D (plays)
   ══════════════════════════════════════════════════════════════════════ */
export function Q03MemoryKitchenActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [activePlayer, setActivePlayer] = useState<"Frank" | "Jane">("Frank");

  const play = usePlay<{ selectedVerb?: string; playerObserved: string }>({
    question,
    initial: { selectedVerb: undefined, playerObserved: "Frank" },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedVerb) return { note: "Observe court talent and insert the singular present verb" };
      const map: Record<string, string> = { "was played": "A", play: "B", playing: "C", plays: "D" };
      return {
        value: w.selectedVerb,
        optionId: map[w.selectedVerb],
        note:
          w.selectedVerb === "plays"
            ? "Grammatically correct: 'Either Frank or Jane' takes a singular verb ('plays') in Present Simple."
            : `Selected: ${w.selectedVerb}`,
      };
    },
  });

  const verbs = ["was played", "play", "playing", "plays"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q3 · 3D Handball Talent Scanner"
      subtitle="Scan handball court performance and apply the singular subject-verb rule"
      hints={[
        "When two singular subjects are connected by 'either... or', the verb must agree with the singular noun (singular present: 'plays').",
      ]}
    >
      <Board>
        {/* 3D Handball Court */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  School Handball Arena
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Active Player on Court: {activePlayer}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(["Frank", "Jane"] as const).map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setActivePlayer(name);
                    play.patch({ playerObserved: name });
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    activePlayer === name
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                  }`}
                >
                  Player: {name}
                </button>
              ))}
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.4, 4.0], fov: 45 }}>
            <HandballCourt3D position={[0, 0, 0]} />
            <Avatar3D
              position={[activePlayer === "Frank" ? -0.8 : 0.8, 0, 0]}
              pose="gesturing"
              shirtColor={activePlayer === "Frank" ? "#2563EB" : "#EC4899"}
              hairStyle={activePlayer === "Frank" ? "short" : "ponytail"}
            />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Either Frank or Jane{" "}
            <SentenceSlot value={play.world.selectedVerb} filled={!!play.world.selectedVerb} />{" "}
            handball really well, but I can never remember who though.
          </p>
        </div>

        {/* Verb Bay */}
        <Bay label="Select Subject-Verb Agreement Tile" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                word={v}
                selected={play.world.selectedVerb === v}
                onClick={() => play.patch({ selectedVerb: v })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — ❄️ 3D First-Snow Experience
   Sentence: "Being from a warm southern climate, I ______ snow before, so it is quite a shock."
   Options: A. was seen, B. haven't seen, C. saw, D. was seeing -> Key: B (haven't seen)
   ══════════════════════════════════════════════════════════════════════ */
export function Q04LanguageMapActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [climate, setClimate] = useState<"Warm South" | "Snowy Mountain">("Snowy Mountain");

  const play = usePlay<{ selectedAspect?: string; climateMode: string }>({
    question,
    initial: { selectedAspect: undefined, climateMode: "Snowy Mountain" },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAspect) return { note: "Examine past experience timeline and select the correct aspect" };
      const map: Record<string, string> = {
        "was seen": "A",
        "haven't seen": "B",
        saw: "C",
        "was seeing": "D",
      };
      return {
        value: w.selectedAspect,
        optionId: map[w.selectedAspect],
        note:
          w.selectedAspect === "haven't seen"
            ? "Grammatically correct: 'haven't seen... before' expresses life experience up to the present moment."
            : `Selected: ${w.selectedAspect}`,
      };
    },
  });

  const aspects = ["was seen", "haven't seen", "saw", "was seeing"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q4 · ❄️ 3D First-Snow Experience"
      subtitle="Experience the climate transition and install the present-perfect life experience form"
      hints={[
        "Describing lack of experience up to the present with 'before' requires Present Perfect ('haven't seen').",
      ]}
    >
      <Board>
        {/* 3D Alpine Winter World */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-300/80 bg-gradient-to-b from-sky-100 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-sky-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Snowflake className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Climate Transition Experience
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Current Setting: {climate}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const next = climate === "Warm South" ? "Snowy Mountain" : "Warm South";
                setClimate(next);
                play.patch({ climateMode: next });
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-sky-500 text-white hover:bg-sky-600 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Toggle Climate
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.2], fov: 45 }}>
            <SnowMountain3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0]} pose="standing" expression="surprised" shirtColor="#0284C7" hairStyle="cap" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-sky-50/90 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Being from a warm southern climate, I{" "}
            <SentenceSlot value={play.world.selectedAspect} filled={!!play.world.selectedAspect} />{" "}
            snow before, so it is quite a shock.
          </p>
        </div>

        {/* Aspect Bay */}
        <Bay label="Personal Experience Timeline Tiles" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {aspects.map((a) => (
              <WordPill
                key={a}
                word={a}
                selected={play.world.selectedAspect === a}
                onClick={() => play.patch({ selectedAspect: a })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — 🌷 Precision Flower Rescue
   Sentence: "He ______ put the flowers back in the vase after knocking them over."
   Options: A. delicately, B. delicate, C. more delicate, D. delicates -> Key: A (delicately)
   ══════════════════════════════════════════════════════════════════════ */
export function Q05BusStopTimeActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [flowersRescued, setFlowersRescued] = useState(false);

  const play = usePlay<{ selectedAdverb?: string; vaseRestored: boolean }>({
    question,
    initial: { selectedAdverb: undefined, vaseRestored: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAdverb) return { note: "Perform the precision flower restoration and choose the manner adverb" };
      const map: Record<string, string> = {
        delicately: "A",
        delicate: "B",
        "more delicate": "C",
        delicates: "D",
      };
      return {
        value: w.selectedAdverb,
        optionId: map[w.selectedAdverb],
        note:
          w.selectedAdverb === "delicately"
            ? "Grammatically correct: The adverb 'delicately' modifies the action verb 'put'."
            : `Selected: ${w.selectedAdverb}`,
      };
    },
  });

  const adverbs = ["delicately", "delicate", "more delicate", "delicates"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q5 · 🌷 Precision Flower Rescue"
      subtitle="Carefully restore the knocked-over vase and attach the manner adverb modifying 'put'"
      hints={[
        "To modify the verb 'put', an adverb of manner ending in '-ly' ('delicately') is required.",
      ]}
    >
      <Board>
        {/* 3D Flower Studio */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-200/80 bg-gradient-to-b from-rose-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-rose-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs">
                <Flower2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Tabletop Flower Studio
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {flowersRescued ? "Status: Stems safely upright in porcelain vase" : "Status: Stems fallen across table"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFlowersRescued(!flowersRescued);
                play.patch({ vaseRestored: !flowersRescued });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                flowersRescued
                  ? "bg-rose-600 text-white border-rose-700"
                  : "bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {flowersRescued ? "Delicate Grip Active" : "Execute Gentle Rescue"}
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <FlowerVase3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-rose-50/90 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            He{" "}
            <SentenceSlot value={play.world.selectedAdverb} filled={!!play.world.selectedAdverb} />{" "}
            put the flowers back in the vase after knocking them over.
          </p>
        </div>

        {/* Adverb Bay */}
        <Bay label="Adverb of Manner Tiles" tone="rose">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {adverbs.map((adv) => (
              <WordPill
                key={adv}
                word={adv}
                selected={play.world.selectedAdverb === adv}
                onClick={() => play.patch({ selectedAdverb: adv })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

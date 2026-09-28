"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay, Gauge, Btn } from "./kit";
import { Sparkles, Utensils, Luggage, Clock, Globe, Bus } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — 3D Morning Routine (Word & Structure)
   Sentence: "In the morning, before I go to work, I wake up and ______ breakfast."
   Options: A. eaten, B. ate, C. eat, D. eating -> Key: C (eat)
   ══════════════════════════════════════════════════════════════════════ */
export function Q01MorningRoutineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedVerb?: string; step: number }>({
    question,
    initial: { selectedVerb: undefined, step: 1 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedVerb) return { note: "Select an action verb to complete the morning routine" };
      const map: Record<string, string> = { eaten: "A", ate: "B", eat: "C", eating: "D" };
      return {
        value: w.selectedVerb,
        optionId: map[w.selectedVerb],
        note: w.selectedVerb === "eat" ? "Grammatically correct: present habitual routine" : `Selected: ${w.selectedVerb}`,
      };
    },
  });

  const verbs = ["eaten", "ate", "eat", "eating"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q1 · Morning Routine Simulation"
      subtitle="Complete the morning sequence by installing the correct verb into the kitchen action slot"
      hints={["A morning routine done before work every day expresses a regular, habitual action in Present Simple."]}
    >
      <Board>
        {/* 3D Visual Chamber */}
        <World3D camera={{ position: [0, 2.5, 5], fov: 45 }} height="260px">
          {/* Room Base */}
          <mesh position={[0, -0.6, 0]} receiveShadow>
            <cylinderGeometry args={[3.2, 3.2, 0.2, 32]} />
            <meshStandardMaterial color="#FAF5FF" />
          </mesh>
          {/* Table */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.1, 24]} />
            <meshStandardMaterial color="#D8B4FE" />
          </mesh>
          {/* Plate & Breakfast */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.05, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Toast / Food */}
          <mesh position={[-0.15, 0.12, 0]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.25, 0.08, 0.25]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Coffee Mug */}
          <mesh position={[0.3, 0.18, -0.1]}>
            <cylinderGeometry args={[0.12, 0.1, 0.2, 16]} />
            <meshStandardMaterial color="#9333EA" />
          </mesh>
          {/* Character representation */}
          <group position={[0, 0.5, -0.8]}>
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#FED7AA" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.5, 16]} />
              <meshStandardMaterial color="#7C3AED" />
            </mesh>
          </group>
        </World3D>

        {/* Live Sentence Display */}
        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            In the morning, before I go to work, I wake up and{" "}
            <SentenceSlot value={play.world.selectedVerb} filled={!!play.world.selectedVerb} />{" "}
            breakfast.
          </p>
        </div>

        {/* Verb Selection Bay */}
        <Bay label="Select Morning Verb" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                tone="purple"
                selected={play.world.selectedVerb === v}
                onClick={() => play.set((prev) => ({ ...prev, selectedVerb: v }))}
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
   Q2 — 3D Holiday Packing Robot
   Sentence: "I am going on holiday today, but I still ______ pack my bags."
   Options: A. have, B. hasn't, C. have to, D. haven't -> Key: C (have to)
   ══════════════════════════════════════════════════════════════════════ */
export function Q02PackingRobotActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ phrase?: string }>({
    question,
    initial: { phrase: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phrase) return { note: "Select the modal phrase of obligation" };
      const map: Record<string, string> = { have: "A", "hasn't": "B", "have to": "C", "haven't": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: w.phrase === "have to" ? "Grammatically correct obligation: 'have to pack'" : `Selected: ${w.phrase}`,
      };
    },
  });

  const options = ["have", "hasn't", "have to", "haven't"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q2 · Holiday Packing Room"
      subtitle="Install the semi-modal phrase into the packing robot control panel"
      hints={["To express necessity or obligation for a base verb like 'pack', use 'have to'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 3, 5], fov: 45 }} height="260px">
          {/* Floor */}
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[5, 0.2, 5]} />
            <meshStandardMaterial color="#F0FDF4" />
          </mesh>
          {/* Suitcase */}
          <mesh position={[-0.4, -0.2, 0]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.5, 0.4]} />
            <meshStandardMaterial color="#2563EB" />
          </mesh>
          {/* Luggage handle */}
          <mesh position={[-0.4, 0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Packing Robot Arm */}
          <group position={[0.8, 0.2, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.6, 16]} />
              <meshStandardMaterial color="#64748B" />
            </mesh>
            <mesh position={[-0.3, 0.4, 0]} rotation={[0, 0, 0.7]}>
              <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
              <meshStandardMaterial color="#0EA5E9" />
            </mesh>
          </group>
        </World3D>

        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I am going on holiday today, but I still{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            pack my bags.
          </p>
        </div>

        <Bay label="Robot Obligation Selector" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {options.map((opt) => (
              <WordPill
                key={opt}
                text={opt}
                tone="sky"
                selected={play.world.phrase === opt}
                onClick={() => play.set({ phrase: opt })}
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
   Q3 — 3D Memory Kitchen (Past Simple)
   Sentence: "When I was a child, I ______ my mother cook dinner."
   Options: A. was helping, B. helps, C. helped, D. help -> Key: C (helped)
   ══════════════════════════════════════════════════════════════════════ */
export function Q03MemoryKitchenActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the past tense verb for the childhood memory" };
      const map: Record<string, string> = { "was helping": "A", helps: "B", helped: "C", help: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "helped" ? "Correct Past Simple narration: 'helped'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["was helping", "helps", "helped", "help"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q3 · Childhood Memory Machine"
      subtitle="Complete the retrospective childhood narration using the memory recorder"
      hints={["'When I was a child' sets the completed past timeframe, requiring simple past 'helped'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.8, 5], fov: 45 }} height="260px">
          {/* Kitchen Ground */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#FEF3C7" />
          </mesh>
          {/* Cooking Stove */}
          <mesh position={[0, -0.1, -0.8]}>
            <boxGeometry args={[1.4, 0.8, 0.8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Cooking Pot with glowing steam */}
          <mesh position={[0, 0.4, -0.8]}>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
          {/* Mother & Child Tokens */}
          <mesh position={[-0.5, 0.4, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
            <meshStandardMaterial color="#EC4899" />
          </mesh>
          <mesh position={[0.4, 0.1, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.5, 16]} />
            <meshStandardMaterial color="#8B5CF6" />
          </mesh>
        </World3D>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            When I was a child, I{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            my mother cook dinner.
          </p>
        </div>

        <Bay label="Memory Narration Verb" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                tone="amber"
                selected={play.world.verb === v}
                onClick={() => play.set({ verb: v })}
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
   Q4 — Language Museum (Articles)
   Sentence: "______ German is ______ easy language to learn."
   Options: A. No article, an, B. A, an, C. The, an, D. The, the -> Key: A
   ══════════════════════════════════════════════════════════════════════ */
export function Q04LanguageMapActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ pair?: string }>({
    question,
    initial: { pair: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.pair) return { note: "Select the pair of articles" };
      const map: Record<string, string> = {
        "No article, an": "A",
        "A, an": "B",
        "The, an": "C",
        "The, the": "D",
      };
      return {
        value: w.pair,
        optionId: map[w.pair],
        note: w.pair === "No article, an" ? "Correct: Languages take zero article, 'easy' begins with vowel sound (an)" : `Selected: ${w.pair}`,
      };
    },
  });

  const pairs = ["No article, an", "A, an", "The, an", "The, the"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q4 · Language Museum"
      subtitle="Assemble the article tiles into both sentence slots"
      hints={["Names of languages (German) do not take articles. 'Easy language' is singular countable starting with a vowel sound, so it takes 'an'."]}
    >
      <Board>
        {/* Language Gallery Plaque */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-teal-200 rounded-xl p-5 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Globe className="w-4 h-4" />
            <span>European Languages Exhibition · Plaque 04</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700">🇩🇪 German</span>
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700">🇫🇷 French</span>
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700">🇪🇸 Spanish</span>
          </div>
        </div>

        {/* Live Sentence Display */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            <SentenceSlot
              value={play.world.pair ? (play.world.pair.startsWith("No article") ? "[Ø]" : play.world.pair.split(",")[0]) : undefined}
              placeholder="[Slot 1]"
              filled={!!play.world.pair}
            />{" "}
            German is{" "}
            <SentenceSlot
              value={play.world.pair ? play.world.pair.split(", ")[1] : undefined}
              placeholder="[Slot 2]"
              filled={!!play.world.pair}
            />{" "}
            easy language to learn.
          </p>
        </div>

        <Bay label="Article Pair Tiles" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {pairs.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="emerald"
                selected={play.world.pair === p}
                onClick={() => play.set({ pair: p })}
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
   Q5 — Bus Stop Time Machine (Stative Verb / Present Simple)
   Sentence: "I ______ waiting for the bus. It is always late and I get bored."
   Options: A. hated, B. hate, C. hates, D. hating -> Key: B (hate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q05BusStopTimeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the present emotion verb" };
      const map: Record<string, string> = { hated: "A", hate: "B", hates: "C", hating: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "hate" ? "Correct Present Simple: 'I hate waiting'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["hated", "hate", "hates", "hating"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q5 · Bus Stop Time Loop"
      subtitle="Connect the narrator's recurring thought with the correct present tense verb"
      hints={["'It is always late' indicates a general present condition. With subject 'I', use base form 'hate'."]}
    >
      <Board>
        {/* Bus Stop Station Graphics */}
        <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 font-mono text-amber-400">
              <Bus className="w-4 h-4" /> Stop #42 · City Line
            </span>
            <span className="font-mono text-red-400 animate-pulse">● DELAYED +25 MIN</span>
          </div>
          <p className="text-xs text-slate-300 italic">"Why does this always happen when I need to get home?"</p>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I <SentenceSlot value={play.world.verb} filled={!!play.world.verb} /> waiting for the bus. It is always late and I get bored.
          </p>
        </div>

        <Bay label="Emotion Verb Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                tone="purple"
                selected={play.world.verb === v}
                onClick={() => play.set({ verb: v })}
                disabled={play.locked}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

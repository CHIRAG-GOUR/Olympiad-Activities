"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { Sparkles, Utensils, Luggage, Globe, Bus, CheckCircle2, Heart } from "lucide-react";
import {
  DiningTable3D,
  AirportLuggage3D,
  ChefKitchen3D,
  LanguageGlobe3D,
  BusStopShelter3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — Rich 3D Morning Routine (Word & Structure)
   Sentence: "In the morning, before I go to work, I wake up and ______ breakfast."
   Options: A. eaten, B. ate, C. eat, D. eating -> Key: C (eat)
   ══════════════════════════════════════════════════════════════════════ */
export function Q01MorningRoutineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedVerb?: string; routineStep: number }>({
    question,
    initial: { selectedVerb: undefined, routineStep: 3 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedVerb) return { note: "Select an action verb to complete the morning breakfast routine" };
      const map: Record<string, string> = { eaten: "A", ate: "B", eat: "C", eating: "D" };
      return {
        value: w.selectedVerb,
        optionId: map[w.selectedVerb],
        note: `Selected: ${w.selectedVerb}`,
      };
    },
  });

  const verbs = ["eaten", "ate", "eat", "eating"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q1 · Morning Routine 3D Studio"
      subtitle="Interact with the 3D morning kitchen scene and install the correct habitual verb"
      hints={["This is something you do every morning — a habit. Which tense do we use for habits?", "Look at the verb just before it: 'I wake up'. The blank should match that form."]}
    >
      <Board>
        {/* 3D Morning Kitchen Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-sky-50/50 shadow-sm">
          {/* Header Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Utensils className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">7:15 AM · Daily Breakfast</span>
                <span className="text-[11px] font-medium text-slate-500">Alex's Morning Routine</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 1. Alarm
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 2. Freshen Up
              </span>
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                play.world.selectedVerb ? "bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-200" : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
              }`}>
                3. {play.world.selectedVerb ? `Action [${play.world.selectedVerb}]` : "Breakfast Action"}
              </span>
            </div>
          </div>

          {/* Real 3D Interactive World */}
          <World3D cue={play.world} height="300px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <DiningTable3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Live Sentence Display with Interactive Slot */}
        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            In the morning, before I go to work, I wake up and{" "}
            <SentenceSlot value={play.world.selectedVerb} filled={!!play.world.selectedVerb} />{" "}
            breakfast.
          </p>
        </div>

        {/* Verb Selection Bay */}
        <Bay label="Select Morning Verb Tile" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
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
   Q2 — 3D Airport Luggage Terminal (Modal Obligations)
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
        note: `Selected: ${w.phrase}`,
      };
    },
  });

  const options = ["have", "hasn't", "have to", "haven't"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q2 · Airport Baggage Terminal 3D"
      subtitle="Explore the airport carousel and install the modal phrase of obligation"
      hints={["The speaker needs to do something before leaving. Which option shows something you must do?", "Only one option can be followed straight away by a verb like 'pack'."]}
    >
      <Board>
        {/* 3D Airport Terminal Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-200/80 bg-gradient-to-b from-sky-50 via-indigo-50/30 to-purple-50/40 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Luggage className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Terminal Baggage Claim · Holiday Departure</span>
                <span className="text-[11px] font-medium text-slate-500">Flight Departs at 18:00 hrs</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`px-2.5 py-1 rounded-lg border ${
                play.world.phrase ? "bg-sky-100 text-sky-900 border-sky-300" : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
              }`}>
                {play.world.phrase ? `🧳 Plan: "${play.world.phrase} pack"` : "⏳ Obligation Pending"}
              </span>
            </div>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.8, 6.2], fov: 45 }}>
            <AirportLuggage3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            I am going on holiday today, but I still{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            pack my bags.
          </p>
        </div>

        <Bay label="Select Obligation Modal" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {options.map((opt) => (
              <WordPill
                key={opt}
                text={opt}
                size="lg"
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
   Q3 — 3D Chef Career Kitchen (Past Simple / Narrative)
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
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["was helping", "helps", "helped", "help"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q3 · Childhood Memory Kitchen 3D"
      subtitle="Complete the retrospective childhood narrative inside the 3D kitchen"
      hints={["'When I was a child' puts the whole sentence in the finished past.", "It is a one-word past form — not a present form, and not an '-ing' form."]}
    >
      <Board>
        {/* 3D Chef Kitchen Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-yellow-50/60 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Childhood Memory · Family Cooking</span>
                <span className="text-[11px] font-medium text-slate-500">Simple Past Narrative</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                {play.world.verb ? `Verb: ${play.world.verb}` : "Waiting for past tense..."}
              </span>
            </div>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.2, 5.6], fov: 45 }}>
            <ChefKitchen3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            When I was a child, I{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            my mother cook dinner.
          </p>
        </div>

        <Bay label="Memory Narration Verb" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
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
   Q4 — 3D Global Language Museum (Articles)
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
        note: `Selected: ${w.pair}`,
      };
    },
  });

  const pairs = ["No article, an", "A, an", "The, an", "The, the"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q4 · Global Language Museum 3D"
      subtitle="Examine the world globe and install the correct article pair"
      hints={["Do we say 'the English' or just 'English' when we mean the language?", "For the second blank, say 'easy' aloud: does it start with a vowel sound?"]}
    >
      <Board>
        {/* 3D Global Language Dais */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-teal-200/80 bg-gradient-to-b from-teal-50 via-sky-50 to-emerald-50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wider block">World Linguistics Exhibition</span>
                <span className="text-[11px] font-medium text-slate-500">Language Family Classifications</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 border border-teal-200">
                🇩🇪 German [Ø Zero Article]
              </span>
            </div>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.8, 5.2], fov: 45 }}>
            <LanguageGlobe3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Live Sentence Display */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            <SentenceSlot
              value={play.world.pair ? (play.world.pair.startsWith("No article") ? "[Ø No article]" : play.world.pair.split(",")[0]) : undefined}
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pairs.map((p) => (
              <WordPill
                key={p}
                text={p}
                size="lg"
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
   Q5 — 3D City Bus Stop Station (Stative Verb / Present Simple)
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
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["hated", "hate", "hates", "hating"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q5 · City Bus Stop 3D Station"
      subtitle="Observe the bus shelter scene and select the verb expressing habitual emotion"
      hints={["'It is always late' — is the speaker describing now, or the past?", "The subject is 'I'. Which form of the verb goes with 'I'?"]}
    >
      <Board>
        {/* 3D Bus Stop Station */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-300 bg-gradient-to-b from-slate-900 to-indigo-950 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-900/80 backdrop-blur-xs text-white">
            <span className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold">
              <Bus className="w-4 h-4" /> Transit Station #42 · Route 108
            </span>
            <span className="font-mono text-xs text-red-400 font-bold animate-pulse">
              ● BUS RUNNING LATE (+35 MIN)
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.4, 6.2], fov: 45 }}>
            <BusStopShelter3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            I <SentenceSlot value={play.world.verb} filled={!!play.world.verb} /> waiting for the bus. It is always late and I get bored.
          </p>
        </div>

        <Bay label="Emotion Verb Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
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

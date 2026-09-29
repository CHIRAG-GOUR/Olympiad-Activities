"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { UtensilsCrossed, Scale, Microscope, HeartHandshake, Globe } from "lucide-react";
import {
  ChefKitchen3D,
  AirportLuggage3D,
  Herbarium3D,
  OpticalScanner3D,
  LanguageGlobe3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — 3D Restaurant Timeline Portal (Time Conjunctions)
   Sentence: "I have not visited this restaurant ______ it opened, five years ago."
   Options: A. everyday, B. since, C. when, D. now -> Key: B (since)
   ══════════════════════════════════════════════════════════════════════ */
export function Q06RestaurantTimelineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ connector?: string }>({
    question,
    initial: { connector: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.connector) return { note: "Select the timeline conjunction" };
      const map: Record<string, string> = { everyday: "A", since: "B", when: "C", now: "D" };
      return {
        value: w.connector,
        optionId: map[w.connector],
        note: `Selected: ${w.connector}`,
      };
    },
  });

  const connectors = ["everyday", "since", "when", "now"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q6 · Restaurant Timeline 3D Studio"
      subtitle="Examine the restaurant's 5-year timeline and connect the starting point conjunction"
      hints={["The restaurant opened five years ago, and the speaker has not been back from that moment until now.", "Which word points back to a starting time in the past?"]}
    >
      <Board>
        {/* 3D Restaurant Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-yellow-50/60 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Le Bistro Italiano · History</span>
                <span className="text-[11px] font-medium text-slate-500">Established 5 Years Ago</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
              Time Anchor: Starting Point (Past)
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.2, 5.6], fov: 45 }}>
            <ChefKitchen3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            I have not visited this restaurant{" "}
            <SentenceSlot value={play.world.connector} filled={!!play.world.connector} />{" "}
            it opened, five years ago.
          </p>
        </div>

        <Bay label="Timeline Conjunction Selector" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {connectors.map((c) => (
              <WordPill
                key={c}
                text={c}
                size="lg"
                tone="amber"
                selected={play.world.connector === c}
                onClick={() => play.set({ connector: c })}
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
   Q7 — 3D Airport Luggage Scale (Sensory Observation)
   Sentence: "Can I help you with your bags? They ______ heavy."
   Options: A. looked, B. seeming, C. look, D. seemed -> Key: C (look)
   ══════════════════════════════════════════════════════════════════════ */
export function Q07MagicBagActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the sensory observation verb" };
      const map: Record<string, string> = { looked: "A", seeming: "B", look: "C", seemed: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["looked", "seeming", "look", "seemed"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q7 · Airport Baggage Scale 3D"
      subtitle="Inspect the heavy suitcases on the check-in conveyor and select the present sensory verb"
      hints={["The speaker is looking at the bags right now.", "The subject is 'They', and the verb 'look' can describe how something appears."]}
    >
      <Board>
        {/* 3D Airport Check-in Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-200/80 bg-gradient-to-b from-sky-50 via-blue-50/40 to-indigo-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Terminal Baggage Scale</span>
                <span className="text-[11px] font-medium text-slate-500">Live Observation · Plural Subject 'They'</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-red-100 text-red-800 border border-red-200 text-xs font-mono font-bold animate-pulse">
              Scale: 32.4 kg [HEAVY LUGGAGE]
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.6, 6.0], fov: 45 }}>
            <AirportLuggage3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            Can I help you with your bags? They{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            heavy.
          </p>
        </div>

        <Bay label="Observation Verb Selector" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
                tone="sky"
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
   Q8 — 3D Botanical Specimen Lab (Experience / Present Perfect)
   Sentence: "I don't know if I like mangosteen, I ______ never had one."
   Options: A. ain't, B. was, C. haven't, D. have -> Key: C (haven't)
   ══════════════════════════════════════════════════════════════════════ */
export function Q08MangoDetectiveActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ aux?: string }>({
    question,
    initial: { aux: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.aux) return { note: "Select the auxiliary verb" };
      const map: Record<string, string> = { "ain't": "A", was: "B", "haven't": "C", have: "D" };
      return {
        value: w.aux,
        optionId: map[w.aux],
        note: `Selected: ${w.aux}`,
      };
    },
  });

  const options = ["ain't", "was", "haven't", "have"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q8 · Botanical Specimen 3D Lab"
      subtitle="Examine the tropical botanical herbs and record the tasting experience"
      hints={["'never had one' needs a helping verb that goes with 'had'.", "Read the sentence aloud with each option and listen to which one sounds right."]}
    >
      <Board>
        {/* 3D Botanical Herbarium */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-200/80 bg-gradient-to-b from-purple-50 via-fuchsia-50/30 to-indigo-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-700 text-white shadow-xs">
                <Microscope className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Botanical Greenhouse Table</span>
                <span className="text-[11px] font-medium text-slate-500">Exotic Specimen Tasting Experience</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 text-xs font-mono font-bold">
              Tasting Count: 0 (Untasted)
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.0, 5.5], fov: 45 }}>
            <Herbarium3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            I don't know if I like mangosteen, I{" "}
            <SentenceSlot value={play.world.aux} filled={!!play.world.aux} />{" "}
            never had one.
          </p>
        </div>

        <Bay label="Auxiliary Option Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {options.map((opt) => (
              <WordPill
                key={opt}
                text={opt}
                size="lg"
                tone="purple"
                selected={play.world.aux === opt}
                onClick={() => play.set({ aux: opt })}
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
   Q9 — 3D Hygiene Science Scanner (Logical Connectors)
   Sentence: "Washing your hands thoroughly with soap prevents germs from spreading. ______ always wash them before eating food."
   Options: A. Nevertheless, B. In case, C. Because of, D. Therefore -> Key: D (Therefore)
   ══════════════════════════════════════════════════════════════════════ */
export function Q09HandwashingLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ connector?: string }>({
    question,
    initial: { connector: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.connector) return { note: "Select the logical connector" };
      const map: Record<string, string> = { Nevertheless: "A", "In case": "B", "Because of": "C", Therefore: "D" };
      return {
        value: w.connector,
        optionId: map[w.connector],
        note: `Selected: ${w.connector}`,
      };
    },
  });

  const connectors = ["Nevertheless", "In case", "Because of", "Therefore"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q9 · Hygiene Science 3D Scanner"
      subtitle="Analyze the cause-and-effect relationship inside the optics lab and select the connector"
      hints={["The first sentence gives a fact; the second tells you what to do because of it.", "Which word introduces a result or conclusion?"]}
    >
      <Board>
        {/* 3D Science Scanner */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50 via-teal-50/30 to-sky-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Hygiene Research Lab</span>
                <span className="text-[11px] font-medium text-slate-500">Logical Consequence Deduction</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold">
              Logic: Deductive Result
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.2, 5.6], fov: 45 }}>
            <OpticalScanner3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            Washing your hands thoroughly with soap prevents germs from spreading.{" "}
            <SentenceSlot value={play.world.connector} filled={!!play.world.connector} />{" "}
            always wash them before eating food.
          </p>
        </div>

        <Bay label="Consequence Connector Selector" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {connectors.map((c) => (
              <WordPill
                key={c}
                text={c}
                size="lg"
                tone="emerald"
                selected={play.world.connector === c}
                onClick={() => play.set({ connector: c })}
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
   Q10 — 3D World Geography Classroom (Predicate Adjective)
   Sentence: "My favourite period at school is geography. It ______ to learn about the world."
   Options: A. is interesting, B. interests, C. interested, D. interesting -> Key: A (is interesting)
   ══════════════════════════════════════════════════════════════════════ */
export function Q10GeographyDiscoveryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ phrase?: string }>({
    question,
    initial: { phrase: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phrase) return { note: "Select the predicate phrase" };
      const map: Record<string, string> = { "is interesting": "A", interests: "B", interested: "C", interesting: "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["is interesting", "interests", "interested", "interesting"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q10 · World Geography 3D Studio"
      subtitle="Examine the world globe and install the predicate adjective phrase"
      hints={["'It ______ to learn about the world' — 'It' stands for 'learning about the world'.", "You need a linking verb followed by an adjective."]}
    >
      <Board>
        {/* 3D World Globe Classroom */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50 via-sky-50/40 to-purple-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">Geography Studio · Period 3</span>
                <span className="text-[11px] font-medium text-slate-500">World Continents & Oceans</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-mono font-bold">
              Structure: It + Be + Adj + To-V
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.8, 5.2], fov: 45 }}>
            <LanguageGlobe3D position={[0, 0, 0]} />
          </World3D>
        </div>

        <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            My favourite period at school is geography. It{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            to learn about the world.
          </p>
        </div>

        <Bay label="Predicate Phrase Selector" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {phrases.map((p) => (
              <WordPill
                key={p}
                text={p}
                size="lg"
                tone="indigo"
                selected={play.world.phrase === p}
                onClick={() => play.set({ phrase: p })}
                disabled={play.locked}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

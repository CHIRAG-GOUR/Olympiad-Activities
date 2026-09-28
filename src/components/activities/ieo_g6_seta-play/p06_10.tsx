"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, WordPill, SentenceSlot, Bay } from "./kit";
import { UtensilsCrossed, ShieldAlert, Sparkles, Globe, History, Scale, Award, Microscope, HeartHandshake, CheckCircle2 } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — Restaurant Time Portal (Time Conjunctions)
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
        note: w.connector === "since" ? "Correct: 'since' marks the starting point with Present Perfect" : `Selected: ${w.connector}`,
      };
    },
  });

  const connectors = ["everyday", "since", "when", "now"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q6 · Restaurant Timeline Portal"
      subtitle="Connect the Present Perfect timeframe to the opening day milestone"
      hints={["'have not visited' pairs with 'since' to denote action from a fixed past starting point until now."]}
    >
      <Board>
        {/* Rich Restaurant Timeline Card */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-yellow-50/60 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Le Bistro Italiano · History</span>
                <span className="text-[11px] font-medium text-slate-500">Founded 5 Years Ago · Continuous Timeline</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
              Time Anchor: Starting Point (Past)
            </span>
          </div>

          {/* Timeline Milestones Graphic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/90 rounded-xl p-4 border border-amber-200 shadow-2xs flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                🏪
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 block">Opening Day Event</span>
                <p className="text-[11px] text-slate-600">Five Years Ago · Ribbon Cutting</p>
              </div>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-purple-200 shadow-2xs flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
                📍
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 block">Present Day</span>
                <p className="text-[11px] text-slate-600">Have not visited throughout 5-year gap</p>
              </div>
            </div>
          </div>
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
   Q7 — Airport Baggage Scanner (Sensory Observation)
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
        note: w.verb === "look" ? "Correct: Present sensory observation of plural subject 'They'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["looked", "seeming", "look", "seemed"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q7 · Airport Baggage Scanner"
      subtitle="Inspect the heavy luggage on the check-in scale and choose the present observation verb"
      hints={["'Can I help you...' is present dialogue. With plural subject 'They', use base sensory verb 'look'."]}
    >
      <Board>
        {/* Airport Check-in Stage */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-200/80 bg-gradient-to-b from-sky-50 via-blue-50/40 to-indigo-50/50 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Terminal 2 · Baggage Drop Scale</span>
                <span className="text-[11px] font-medium text-slate-500">Live Observation · Two Bulky Suitcases</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-red-100 text-red-800 border border-red-200 text-xs font-mono font-bold animate-pulse">
              Scale: 32.4 kg [HEAVY LUGGAGE]
            </span>
          </div>

          {/* Luggage Scale Graphic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="bg-white/90 rounded-xl p-4 border border-sky-200 shadow-2xs flex items-center gap-4">
              <div className="text-4xl">🧳🧳</div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Checked Luggage (Plural: They)</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Visibly bulging suitcases on conveyor platform.</p>
              </div>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-sky-200 shadow-2xs flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xl">
                🙋
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Helpful Traveler:</span>
                <p className="text-xs text-sky-900 italic">"Can I help you with your bags? They look heavy."</p>
              </div>
            </div>
          </div>
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
   Q8 — Mango Detective Laboratory (Experience / Present Perfect)
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
        note: w.aux === "haven't" ? "Targeted answer key form: 'haven't'" : `Selected: ${w.aux}`,
      };
    },
  });

  const options = ["ain't", "was", "haven't", "have"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q8 · Fruit Detective Laboratory"
      subtitle="Examine the exotic mangosteen specimen and record the tasting experience"
      hints={["Examine the experience log and select the auxiliary verb form from the options."]}
    >
      <Board>
        {/* Botanical Lab Specimen Stage */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-purple-200/80 bg-gradient-to-b from-purple-50 via-fuchsia-50/30 to-indigo-50/50 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-700 text-white shadow-xs">
                <Microscope className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Specimen Chamber #8: Garcinia mangostana</span>
                <span className="text-[11px] font-medium text-slate-500">Tropical Fruit · Experience Log Audit</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 text-xs font-mono font-bold">
              Tasting Count: 0 (Untasted)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Mangosteen Specimen Box */}
            <div className="bg-white/90 rounded-xl p-4 border border-purple-200 shadow-2xs flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center text-3xl shadow-md">
                🫐
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Purple Mangosteen</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Known as the 'Queen of Fruits' in Southeast Asia.</p>
              </div>
            </div>

            {/* Experience Record Log */}
            <div className="bg-white/90 rounded-xl p-4 border border-purple-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block">Life Experience Record:</span>
              <p className="text-xs text-purple-900 italic mt-1">"I don't know if I like it because I haven't never had one before."</p>
            </div>
          </div>
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
   Q9 — Germ Defense Laboratory (Logical Connectors)
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
        note: w.connector === "Therefore" ? "Correct logical consequence: 'Therefore'" : `Selected: ${w.connector}`,
      };
    },
  });

  const connectors = ["Nevertheless", "In case", "Because of", "Therefore"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q9 · Germ Defense Laboratory"
      subtitle="Synthesize the cause-and-effect conclusion connector"
      hints={["The second sentence is a direct logical result of the premise that soap stops germs. Use 'Therefore'."]}
    >
      <Board>
        {/* Cause-and-Effect Lab Stage */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50 via-teal-50/30 to-sky-50/50 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Hygiene Research Lab</span>
                <span className="text-[11px] font-medium text-slate-500">Cause ➔ Logical Consequence Relationship</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold">
              Logic: Deductive Result
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/90 rounded-xl p-4 border border-emerald-200 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                <span className="text-lg">🧼</span>
                <span>Premise 1: Soap Kills Pathogens</span>
              </div>
              <p className="text-[11.5px] text-slate-600">Thorough handwashing breaks lipid virus membranes and removes bacteria.</p>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-sky-200 shadow-2xs">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-xs mb-1">
                <span className="text-lg">🍽️</span>
                <span>Logical Result: Meal Precaution</span>
              </div>
              <p className="text-[11.5px] text-slate-600">Consequently / For this reason, wash hands before every meal.</p>
            </div>
          </div>
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
   Q10 — World Geography Classroom (Predicate Adjective)
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
        note: w.phrase === "is interesting" ? "Correct: 'It is interesting to learn...'" : `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["is interesting", "interests", "interested", "interesting"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q10 · World Geography Classroom"
      subtitle="Activate the interactive world globe and complete the subject impression"
      hints={["Dummy subject 'It' takes linking verb + adjective + to-infinitive: 'It is interesting to learn...'."]}
    >
      <Board>
        {/* World Classroom Stage */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50 via-sky-50/40 to-purple-50/50 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">Class 6 Geography Studio</span>
                <span className="text-[11px] font-medium text-slate-500">Period 3 · Exploring Oceans & Continents</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-mono font-bold">
              Structure: It + Be + Adj + To-V
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="bg-white/90 rounded-xl p-4 border border-indigo-200 shadow-2xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center text-3xl shadow-md animate-bounce-slow">
                🌍
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">World Exploration</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Studying landscapes, climates, and civilizations.</p>
              </div>
            </div>

            <div className="bg-white/90 rounded-xl p-4 border border-indigo-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block">Subject Evaluation:</span>
              <p className="text-xs text-indigo-900 italic mt-1">"My favourite period at school is geography. It is interesting to learn about the world."</p>
            </div>
          </div>
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

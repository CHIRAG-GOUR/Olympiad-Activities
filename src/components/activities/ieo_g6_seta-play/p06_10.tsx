"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { UtensilsCrossed, ShieldAlert, Sparkles, Globe, History, Scale } from "lucide-react";

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
        {/* Timeline Bar */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5"><History className="w-4 h-4 text-amber-700" /> Opening Day (5 Years Ago)</span>
            <span>Present Day</span>
          </div>
          <div className="relative w-full h-3 bg-amber-200 rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full" />
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I have not visited this restaurant{" "}
            <SentenceSlot value={play.world.connector} filled={!!play.world.connector} />{" "}
            it opened, five years ago.
          </p>
        </div>

        <Bay label="Timeline Conjunction Selector" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {connectors.map((c) => (
              <WordPill
                key={c}
                text={c}
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
   Q7 — 3D Baggage Scanner (Sensory Verbs)
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
      dim="3D"
      play={play}
      question={question}
      title="Q7 · Airport Baggage Scanner"
      subtitle="Inspect the luggage weight and choose the present observation verb"
      hints={["'Can I help you...' is present dialogue. With plural subject 'They', use base sensory verb 'look'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 3, 5], fov: 45 }} height="260px">
          {/* Airport Floor */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#F1F5F9" />
          </mesh>
          {/* Heavy Luggage 1 */}
          <mesh position={[-0.4, 0, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.45]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>
          {/* Heavy Luggage 2 */}
          <mesh position={[0.4, -0.1, 0.2]}>
            <boxGeometry args={[0.65, 0.75, 0.4]} />
            <meshStandardMaterial color="#1E3A8A" />
          </mesh>
          {/* Weight Indicator Beacon */}
          <mesh position={[0, 0.8, -0.5]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#EAB308" emissive="#CA8A04" emissiveIntensity={0.6} />
          </mesh>
        </World3D>

        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            Can I help you with your bags? They{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            heavy.
          </p>
        </div>

        <Bay label="Observation Verb Selector" tone="sky">
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
      dim="3D"
      play={play}
      question={question}
      title="Q8 · Fruit Detective Laboratory"
      subtitle="Examine the exotic mangosteen specimen and record the tasting experience"
      hints={["Examine the experience log and select the auxiliary verb form from the options."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.5], fov: 45 }} height="260px">
          {/* Pedestal */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 0.4, 24]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Glass Specimen Chamber */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 1.2, 24]} />
            <meshStandardMaterial color="#93C5FD" transparent opacity={0.3} />
          </mesh>
          {/* Mangosteen Fruit */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial color="#581C87" />
          </mesh>
          {/* Calyx leaves */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.3, 0.08, 0.3]} />
            <meshStandardMaterial color="#15803D" />
          </mesh>
        </World3D>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I don't know if I like mangosteen, I{" "}
            <SentenceSlot value={play.world.aux} filled={!!play.world.aux} />{" "}
            never had one.
          </p>
        </div>

        <Bay label="Auxiliary Option Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {options.map((opt) => (
              <WordPill
                key={opt}
                text={opt}
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
   Q9 — 3D Germ Laboratory (Logical Connectors)
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
        {/* Cause & Effect Visual Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Premise / Cause</span>
            <p className="text-xs text-slate-700 mt-1">Soap + Water = Germs eliminated</p>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-center">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">Conclusion / Action</span>
            <p className="text-xs text-slate-700 mt-1">Always wash before meals</p>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            Washing your hands thoroughly with soap prevents germs from spreading.{" "}
            <SentenceSlot value={play.world.connector} filled={!!play.world.connector} />{" "}
            always wash them before eating food.
          </p>
        </div>

        <Bay label="Consequence Connector" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {connectors.map((c) => (
              <WordPill
                key={c}
                text={c}
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
   Q10 — 3D Geography Discovery (Predicate Adjective)
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
      dim="3D"
      play={play}
      question={question}
      title="Q10 · World Geography Classroom"
      subtitle="Activate the interactive world globe and complete the subject impression"
      hints={["Dummy subject 'It' takes linking verb + adjective + to-infinitive: 'It is interesting to learn...'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2, 4.5], fov: 45 }} height="260px">
          {/* Classroom Desk */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
            <meshStandardMaterial color="#E0E7FF" />
          </mesh>
          {/* Globe Stand */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.4, 0.8, 16]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Globe Sphere */}
          <mesh position={[0, 0.6, 0]} rotation={[0.4, 0.4, 0]}>
            <sphereGeometry args={[0.55, 24, 24]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Continent Rings */}
          <mesh position={[0, 0.6, 0]} rotation={[0.4, 0.4, 0]}>
            <ringGeometry args={[0.6, 0.65, 32]} />
            <meshStandardMaterial color="#EAB308" />
          </mesh>
        </World3D>

        <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            My favourite period at school is geography. It{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            to learn about the world.
          </p>
        </div>

        <Bay label="Predicate Phrase Selector" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {phrases.map((p) => (
              <WordPill
                key={p}
                text={p}
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

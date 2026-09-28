"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { History, Waves, Sprout, Clock, Send } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Past-vs-Present Playground (Used to)
   Sentence: "That area of the playground ______ be covered in grass. Now it is bare soil."
   Options: A. isn't, B. was once, C. is to, D. used to -> Key: D (used to)
   ══════════════════════════════════════════════════════════════════════ */
export function Q16OldPlaygroundActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ phrase?: string }>({
    question,
    initial: { phrase: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phrase) return { note: "Select the past state construction" };
      const map: Record<string, string> = { "isn't": "A", "was once": "B", "is to": "C", "used to": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: w.phrase === "used to" ? "Correct habitual/past-state: 'used to be covered'" : `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["isn't", "was once", "is to", "used to"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q16 · Past-vs-Present Playground"
      subtitle="Contrast past lush green grass with present bare soil"
      hints={["To describe a state that existed regularly in the past but no longer does, followed by base verb 'be', use 'used to'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Soil / Grass Ground */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#A16207" />
          </mesh>
          {/* Swingset */}
          <mesh position={[-0.8, 0.4, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="#2563EB" />
          </mesh>
          <mesh position={[0.8, 0.4, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="#2563EB" />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1.7, 0.1, 0.1]} />
            <meshStandardMaterial color="#2563EB" />
          </mesh>
        </World3D>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            That area of the playground{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            be covered in grass. Now it is bare soil.
          </p>
        </div>

        <Bay label="Past State Selector" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {phrases.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="amber"
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

/* ══════════════════════════════════════════════════════════════════════
   Q17 — Beach Memory Habit (Past 'Would')
   Sentence: "When I was younger, we used to go on holiday to the beach and I ______ eat lots of ice cream."
   Options: A. shall, B. will, C. am going to, D. would -> Key: D (would)
   ══════════════════════════════════════════════════════════════════════ */
export function Q17BeachMemoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ modal?: string }>({
    question,
    initial: { modal: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.modal) return { note: "Select the modal for repeated past action" };
      const map: Record<string, string> = { shall: "A", will: "B", "am going to": "C", would: "D" };
      return {
        value: w.modal,
        optionId: map[w.modal],
        note: w.modal === "would" ? "Correct past habitual modal: 'would eat'" : `Selected: ${w.modal}`,
      };
    },
  });

  const modals = ["shall", "will", "am going to", "would"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q17 · Childhood Beach Memory"
      subtitle="Complete the repeated past childhood holiday routine"
      hints={["'When I was younger, we used to...' establishes past narrative. 'Would' denotes repeated past habits alongside 'used to'."]}
    >
      <Board>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-xs sm:text-sm">
            <Waves className="w-4 h-4 text-sky-700" />
            <span>Childhood Seaside Holidays · Recurring Summer Routine</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            When I was younger, we used to go on holiday to the beach and I{" "}
            <SentenceSlot value={play.world.modal} filled={!!play.world.modal} />{" "}
            eat lots of ice cream.
          </p>
        </div>

        <Bay label="Habitual Modal Selector" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {modals.map((m) => (
              <WordPill
                key={m}
                text={m}
                tone="sky"
                selected={play.world.modal === m}
                onClick={() => play.set({ modal: m })}
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
   Q18 — Botanical Lab (Dependent Prepositions)
   Sentence: "I am not familiar ______ the botanical names of these herbs."
   Options: A. to, B. with, C. by, D. of -> Key: B (with)
   ══════════════════════════════════════════════════════════════════════ */
export function Q18BotanicalLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ prep?: string }>({
    question,
    initial: { prep: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.prep) return { note: "Select the dependent preposition" };
      const map: Record<string, string> = { to: "A", with: "B", by: "C", of: "D" };
      return {
        value: w.prep,
        optionId: map[w.prep],
        note: w.prep === "with" ? "Correct collocation: 'familiar with'" : `Selected: ${w.prep}`,
      };
    },
  });

  const preps = ["to", "with", "by", "of"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q18 · Botanical Identification Laboratory"
      subtitle="Connect the dependent preposition to the adjective 'familiar'"
      hints={["The adjective 'familiar' takes the dependent preposition 'with' when referring to knowledge of things."]}
    >
      <Board>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Herbal Herbarium Specimen: Ocimum basilicum (Basil)</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I am not familiar{" "}
            <SentenceSlot value={play.world.prep} filled={!!play.world.prep} />{" "}
            the botanical names of these herbs.
          </p>
        </div>

        <Bay label="Collocation Preposition" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {preps.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="emerald"
                selected={play.world.prep === p}
                onClick={() => play.set({ prep: p })}
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
   Q19 — Time-Lapse Bench (Future Perfect Continuous)
   Sentence: "By 4 pm, this lady ______ been sitting on that bench for five hours."
   Options: A. has, B. will have, C. have, D. must have -> Key: B (will have)
   ══════════════════════════════════════════════════════════════════════ */
export function Q19TimeLapseBenchActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ aux?: string }>({
    question,
    initial: { aux: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.aux) return { note: "Select the future perfect auxiliary" };
      const map: Record<string, string> = { has: "A", "will have": "B", have: "C", "must have": "D" };
      return {
        value: w.aux,
        optionId: map[w.aux],
        note: w.aux === "will have" ? "Correct Future Perfect Continuous: 'will have been sitting'" : `Selected: ${w.aux}`,
      };
    },
  });

  const auxs = ["has", "will have", "have", "must have"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q19 · Time-Lapse Park Bench"
      subtitle="Project duration to the future deadline milestone (By 4 pm)"
      hints={["'By 4 pm' sets a future time limit with duration 'for five hours', requiring 'will have' been sitting."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Time Projection: 11:00 AM ➔ 4:00 PM (Target: 5 Hours Duration)</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            By 4 pm, this lady{" "}
            <SentenceSlot value={play.world.aux} filled={!!play.world.aux} />{" "}
            been sitting on that bench for five hours.
          </p>
        </div>

        <Bay label="Future Duration Auxiliary" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {auxs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="amber"
                selected={play.world.aux === a}
                onClick={() => play.set({ aux: a })}
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
   Q20 — Gift Delivery Drone (Relative Pronouns)
   Sentence: "The child ______ receives this gift is very lucky."
   Options: A. who, B. whose, C. which, D. whom -> Key: A (who)
   ══════════════════════════════════════════════════════════════════════ */
export function Q20GiftDeliveryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ pronoun?: string }>({
    question,
    initial: { pronoun: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.pronoun) return { note: "Select the relative pronoun" };
      const map: Record<string, string> = { who: "A", whose: "B", which: "C", whom: "D" };
      return {
        value: w.pronoun,
        optionId: map[w.pronoun],
        note: w.pronoun === "who" ? "Correct subject relative pronoun for a person: 'who'" : `Selected: ${w.pronoun}`,
      };
    },
  });

  const pronouns = ["who", "whose", "which", "whom"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q20 · Gift Delivery Drone"
      subtitle="Identify the recipient subject pronoun to calibrate the delivery drone"
      hints={["'The child' is a person functioning as the subject of the clause 'receives this gift', which takes 'who'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Delivery Landing Pad */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
            <meshStandardMaterial color="#EDE9FE" />
          </mesh>
          {/* Gift Box */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#EC4899" />
          </mesh>
          {/* Gift Ribbon */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.62, 0.1, 0.62]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
          {/* Drone above */}
          <group position={[0, 1.2, 0]}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#3B82F6" />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.04, 16]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </group>
        </World3D>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            The child <SentenceSlot value={play.world.pronoun} filled={!!play.world.pronoun} /> receives this gift is very lucky.
          </p>
        </div>

        <Bay label="Relative Pronoun Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {pronouns.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="purple"
                selected={play.world.pronoun === p}
                onClick={() => play.set({ pronoun: p })}
                disabled={play.locked}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

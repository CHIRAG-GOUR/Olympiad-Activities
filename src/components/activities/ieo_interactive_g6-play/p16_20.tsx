"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { History, Waves, Sprout, Clock, Gift, Sun, Sparkles } from "lucide-react";
import {
  PlaygroundPark3D,
  BeachSeaside3D,
  Herbarium3D,
  ParkBenchClock3D,
  GiftUnboxing3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — 3D Playground Historical Landscape (Used to)
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
      if (!w.phrase) return { note: "Select the past habitual/state construction" };
      const map: Record<string, string> = { "isn't": "A", "was once": "B", "is to": "C", "used to": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: w.phrase === "used to" ? "Correct: 'used to be' denotes a former enduring state that no longer exists" : `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["isn't", "was once", "is to", "used to"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q16 · Playground Landscape 3D Studio"
      subtitle="Contrast the former green playground with current soil and select the past state phrase"
      hints={["To describe a past condition or habit that is no longer true, followed by base verb 'be', use 'used to'."]}
    >
      <Board>
        {/* 3D Playground Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-emerald-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <History className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">School Playground · Landscape Log</span>
                <span className="text-[11px] font-medium text-slate-500">Past Greenery vs Present Soil</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              Pattern: used to + be
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 3.2, 5.8], fov: 45 }}>
            <PlaygroundPark3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            That area of the playground{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            be covered in grass. Now it is bare soil.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Past State Verb Phrase" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {phrases.map((p) => (
              <WordPill
                key={p}
                text={p}
                size="lg"
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
   Q17 — 3D Seaside Beach Vacation (Past Habitual 'Would')
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
      if (!w.modal) return { note: "Select the modal verb expressing past repeated habit" };
      const map: Record<string, string> = { shall: "A", will: "B", "am going to": "C", would: "D" };
      return {
        value: w.modal,
        optionId: map[w.modal],
        note: w.modal === "would" ? "Correct: 'would' expresses repeated, nostalgic past actions during holidays" : `Selected: ${w.modal}`,
      };
    },
  });

  const modals = ["shall", "will", "am going to", "would"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q17 · Seaside Beach 3D Studio"
      subtitle="Complete the nostalgic recollection of childhood summer habits by the seaside"
      hints={["'Would + base verb' is used to describe typical, repeated activities carried out in the past during holidays or childhood."]}
    >
      <Board>
        {/* 3D Beach Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-amber-50/40 to-blue-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
                <Waves className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Childhood Seaside Vacation</span>
                <span className="text-[11px] font-medium text-slate-500">Sunny Holiday Memory Album</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-600" /> Summer Beach
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 3.0, 5.5], fov: 45 }}>
            <BeachSeaside3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            When I was younger, we used to go on holiday to the beach and I{" "}
            <SentenceSlot value={play.world.modal} filled={!!play.world.modal} />{" "}
            eat lots of ice cream.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Past Modal Verb" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {modals.map((m) => (
              <WordPill
                key={m}
                text={m}
                size="lg"
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
   Q18 — 3D Botanical Herbarium Collocation (Familiar 'With')
   Sentence: "I am not familiar ______ the botanical names of these herbs."
   Options: A. to, B. with, C. by, D. of -> Key: B (with)
   ══════════════════════════════════════════════════════════════════════ */
export function Q18BotanicalHerbariumActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ prep?: string }>({
    question,
    initial: { prep: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.prep) return { note: "Select the preposition that collocates with 'familiar'" };
      const map: Record<string, string> = { to: "A", with: "B", by: "C", of: "D" };
      return {
        value: w.prep,
        optionId: map[w.prep],
        note: w.prep === "with" ? "Correct collocation: A person is 'familiar with' a topic or names" : `Selected: ${w.prep}`,
      };
    },
  });

  const preps = ["to", "with", "by", "of"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q18 · Botanical Herbarium 3D"
      subtitle="Complete the statement regarding familiarity with plant scientific names in the greenhouse"
      hints={["When a person has knowledge of or experience with something, they are 'familiar with' it."]}
    >
      <Board>
        {/* 3D Botanical Herbarium */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Sprout className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Greenhouse Herbarium Table</span>
                <span className="text-[11px] font-medium text-slate-500">Basil, Rosemary & Mint Specimens</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🌿 Collocation: Familiar + with
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.8, 5.2], fov: 45 }}>
            <Herbarium3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I am not familiar{" "}
            <SentenceSlot value={play.world.prep} filled={!!play.world.prep} />{" "}
            the botanical names of these herbs.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Dependent Preposition" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {preps.map((p) => (
              <WordPill
                key={p}
                text={p}
                size="lg"
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
   Q19 — 3D Park Bench Clock Duration (Future Perfect Continuous)
   Sentence: "By 4 pm, this lady ______ been sitting on that bench for five hours."
   Options: A. has, B. will have, C. have, D. must have -> Key: B (will have)
   ══════════════════════════════════════════════════════════════════════ */
export function Q19BenchDurationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the future perfect auxiliary" };
      const map: Record<string, string> = { has: "A", "will have": "B", have: "C", "must have": "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "will have" ? "Correct: 'will have been sitting' expresses an ongoing duration up to a future point (4 PM)" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["has", "will have", "have", "must have"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q19 · Park Bench Clock 3D Studio"
      subtitle="Complete the future perfect continuous calculation for the lady resting on the bench"
      hints={["'By [future time]' marking a duration requires Future Perfect Continuous: 'will have been + verb-ing'."]}
    >
      <Board>
        {/* 3D Park Bench & Grand Clock */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/80 via-purple-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">Central Park · Clock Tower</span>
                <span className="text-[11px] font-medium text-slate-500">Time Horizon: 4:00 PM (5 Hours Duration)</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300">
              ⏱ By 4:00 PM
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 3.2, 5.8], fov: 45 }}>
            <ParkBenchClock3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            By 4 pm, this lady{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            been sitting on that bench for five hours.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Auxiliary Verb" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
                tone="indigo"
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
   Q20 — 3D Antique Gift Unboxing (Subject 'Who')
   Sentence: "The child ______ receives this gift is very lucky."
   Options: A. who, B. whose, C. which, D. whom -> Key: A (who)
   ══════════════════════════════════════════════════════════════════════ */
export function Q20LuckyGiftActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ pronoun?: string }>({
    question,
    initial: { pronoun: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.pronoun) return { note: "Select the relative pronoun referring to the child" };
      const map: Record<string, string> = { who: "A", whose: "B", which: "C", whom: "D" };
      return {
        value: w.pronoun,
        optionId: map[w.pronoun],
        note: w.pronoun === "who" ? "Correct: 'who' is the subject relative pronoun referring to a human person (child)" : `Selected: ${w.pronoun}`,
      };
    },
  });

  const pronouns = ["who", "whose", "which", "whom"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q20 · Antique Gift Unboxing 3D"
      subtitle="Complete the relative clause identifying the fortunate child who receives the special present"
      hints={["Use 'who' as the subject pronoun when referring to people performing an action ('receives')."]}
    >
      <Board>
        {/* 3D Gift Table Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-violet-200/80 bg-gradient-to-b from-violet-50/80 via-purple-50/40 to-pink-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                <Gift className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-violet-950 uppercase tracking-wider block">Birthday Gift Unboxing Table</span>
                <span className="text-[11px] font-medium text-slate-500">Lucky Recipient Announcement</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-pink-100 text-pink-900 border border-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" /> Antique Watch
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.8, 5.0], fov: 45 }}>
            <GiftUnboxing3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-violet-50/80 border-2 border-violet-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            The child{" "}
            <SentenceSlot value={play.world.pronoun} filled={!!play.world.pronoun} />{" "}
            receives this gift is very lucky.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Relative Pronoun" tone="violet">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pronouns.map((p) => (
              <WordPill
                key={p}
                text={p}
                size="lg"
                tone="violet"
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

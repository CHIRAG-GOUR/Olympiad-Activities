"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { IceCream, Trophy, Radio, Navigation, Clock } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — 3D Ice-Cream Shop (Modal Suggestions)
   Sentence: "Shall ______ to the shop and buy ice cream? I think we deserve a treat today."
   Options: A. you going, B. you gone, C. we go, D. we going -> Key: C (we go)
   ══════════════════════════════════════════════════════════════════════ */
export function Q11IceCreamShopActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ phrase?: string }>({
    question,
    initial: { phrase: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phrase) return { note: "Select the suggestion phrase" };
      const map: Record<string, string> = { "you going": "A", "you gone": "B", "we go": "C", "we going": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: w.phrase === "we go" ? "Correct suggestion: 'Shall we go...?'" : `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["you going", "you gone", "we go", "we going"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q11 · Ice-Cream Shop Invitation"
      subtitle="Assemble the suggestion into the dialogue wheel outside the treat parlour"
      hints={["'Shall we + base verb' is standard English for joint polite suggestions."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Street Floor */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#FDF2F8" />
          </mesh>
          {/* Shop Stall */}
          <mesh position={[0, 0.2, -0.8]}>
            <boxGeometry args={[2.2, 1.4, 0.8]} />
            <meshStandardMaterial color="#F472B6" />
          </mesh>
          {/* Striped Awning */}
          <mesh position={[0, 0.9, -0.4]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[2.4, 0.1, 0.9]} />
            <meshStandardMaterial color="#FDE047" />
          </mesh>
          {/* Giant Ice Cream Cone display */}
          <mesh position={[0.7, 0.8, -0.7]}>
            <coneGeometry args={[0.2, 0.5, 16]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
        </World3D>

        <div className="bg-pink-50/80 border border-pink-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            Shall <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} /> to the shop and buy ice cream? I think we deserve a treat today.
          </p>
        </div>

        <Bay label="Suggestion Dialogue Phrase" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {phrases.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="purple"
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
   Q12 — Cricket Memory Investigation (Past Be-Verb Negation)
   Sentence: "He ______ at cricket practice yesterday. I don't know where he was."
   Options: A. wasn't, B. was, C. hasn't, D. had -> Key: A (wasn't)
   ══════════════════════════════════════════════════════════════════════ */
export function Q12CricketMemoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the past negative verb" };
      const map: Record<string, string> = { "wasn't": "A", was: "B", "hasn't": "C", had: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "wasn't" ? "Correct: 'He wasn't at cricket practice yesterday'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["wasn't", "was", "hasn't", "had"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q12 · Cricket Practice Investigation"
      subtitle="Inspect the pitch attendance roster and resolve the absence"
      hints={["'I don't know where he was' confirms his absence yesterday. Singular subject 'He' takes 'wasn't'."]}
    >
      <Board>
        {/* Attendance Roster */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-xs sm:text-sm text-emerald-900">Yesterday's Practice Roster</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-white border text-[11px] font-bold text-slate-700">Aarav: Present</span>
            <span className="px-2.5 py-1 rounded bg-white border text-[11px] font-bold text-slate-700">Rohan: Present</span>
            <span className="px-2.5 py-1 rounded bg-red-100 border border-red-200 text-[11px] font-bold text-red-700">Target Player: ABSENT</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            He <SentenceSlot value={play.world.verb} filled={!!play.world.verb} /> at cricket practice yesterday. I don't know where he was.
          </p>
        </div>

        <Bay label="Past Verb Selector" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                tone="emerald"
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
   Q13 — Storm Rescue Communication (Future Perfect)
   Sentence: "I will call you later. Hopefully, you ______ made it home through the storm."
   Options: A. do have, B. do, C. will, D. will have -> Key: D (will have)
   ══════════════════════════════════════════════════════════════════════ */
export function Q13StormRescueActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ tense?: string }>({
    question,
    initial: { tense: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.tense) return { note: "Select the future perfect auxiliary" };
      const map: Record<string, string> = { "do have": "A", do: "B", will: "C", "will have": "D" };
      return {
        value: w.tense,
        optionId: map[w.tense],
        note: w.tense === "will have" ? "Correct Future Perfect: 'will have made it home'" : `Selected: ${w.tense}`,
      };
    },
  });

  const options = ["do have", "do", "will", "will have"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q13 · Storm Rescue Radio"
      subtitle="Establish communication with the commuter and transmit the future perfect message"
      hints={["To describe an action completed before a future time (when I call later), use 'will have' + past participle."]}
    >
      <Board>
        {/* Weather Radar Panel */}
        <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col items-center gap-2">
          <div className="flex items-center justify-between w-full text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-cyan-400">
              <Radio className="w-4 h-4" /> Commuter Route Dispatch
            </span>
            <span className="font-mono text-yellow-400">Storm Warning Level 3</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">Future check-in point: ETA 19:00 hrs</p>
        </div>

        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I will call you later. Hopefully, you{" "}
            <SentenceSlot value={play.world.tense} filled={!!play.world.tense} />{" "}
            made it home through the storm.
          </p>
        </div>

        <Bay label="Auxiliary Radio Phrase" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {options.map((opt) => (
              <WordPill
                key={opt}
                text={opt}
                tone="sky"
                selected={play.world.tense === opt}
                onClick={() => play.set({ tense: opt })}
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
   Q14 — City Park Explorer (Prepositions of Direction)
   Sentence: "I don't like it here, it is so busy. Let's go ______ another park where there are fewer people."
   Options: A. on, B. at, C. to, D. in -> Key: C (to)
   ══════════════════════════════════════════════════════════════════════ */
export function Q14ParkExplorerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ prep?: string }>({
    question,
    initial: { prep: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.prep) return { note: "Select the preposition of direction" };
      const map: Record<string, string> = { on: "A", at: "B", to: "C", in: "D" };
      return {
        value: w.prep,
        optionId: map[w.prep],
        note: w.prep === "to" ? "Correct preposition of motion: 'go to another park'" : `Selected: ${w.prep}`,
      };
    },
  });

  const preps = ["on", "at", "to", "in"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q14 · City Park Navigator"
      subtitle="Plot movement from the crowded plaza to the quiet botanical park"
      hints={["'Go' expresses movement towards a destination, which requires the preposition 'to'."]}
    >
      <Board>
        {/* Map Route Graphics */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
            <Navigation className="w-4 h-4 text-emerald-700" />
            <span>Central Square (Busy: 850 people) ➔ Meadow Park (Quiet: 20 people)</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I don't like it here, it is so busy. Let's go{" "}
            <SentenceSlot value={play.world.prep} filled={!!play.world.prep} />{" "}
            another park where there are fewer people.
          </p>
        </div>

        <Bay label="Preposition Selector" tone="emerald">
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
   Q15 — Train Station Waiting Game (Gerunds)
   Sentence: "They were late as usual. So, instead of ______ around, Reena decided to go on ahead without them."
   Options: A. wait, B. waited, C. waiting, D. waits -> Key: C (waiting)
   ══════════════════════════════════════════════════════════════════════ */
export function Q15WaitingGameActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ gerund?: string }>({
    question,
    initial: { gerund: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.gerund) return { note: "Select the verb form after preposition" };
      const map: Record<string, string> = { wait: "A", waited: "B", waiting: "C", waits: "D" };
      return {
        value: w.gerund,
        optionId: map[w.gerund],
        note: w.gerund === "waiting" ? "Correct gerund: 'instead of waiting around'" : `Selected: ${w.gerund}`,
      };
    },
  });

  const forms = ["wait", "waited", "waiting", "waits"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q15 · Train Station Waiting Game"
      subtitle="Select the correct verbal form following preposition 'of'"
      hints={["Prepositions like 'of' must be followed by a gerund (-ing form), so 'instead of waiting'."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Platform 3 · Delay Timer: +45 mins</span>
          </div>
          <span className="text-xs font-semibold text-amber-800">Reena decides to depart</span>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            They were late as usual. So, instead of{" "}
            <SentenceSlot value={play.world.gerund} filled={!!play.world.gerund} />{" "}
            around, Reena decided to go on ahead without them.
          </p>
        </div>

        <Bay label="Gerund Form Selector" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {forms.map((f) => (
              <WordPill
                key={f}
                text={f}
                tone="amber"
                selected={play.world.gerund === f}
                onClick={() => play.set({ gerund: f })}
                disabled={play.locked}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

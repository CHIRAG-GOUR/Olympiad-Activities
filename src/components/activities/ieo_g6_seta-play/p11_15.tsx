"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { IceCream, Trophy, PhoneCall, Navigation, Footprints } from "lucide-react";
import {
  IceCreamParlour3D,
  CricketPitch3D,
  WeatherStation3D,
  ParkTrail3D,
  TrainPlatform3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — 3D Ice-Cream Parlour Suggestion (Modal Suggestions)
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
      if (!w.phrase) return { note: "Select the joint suggestion phrase to complete the dialogue" };
      const map: Record<string, string> = { "you going": "A", "you gone": "B", "we go": "C", "we going": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["you going", "you gone", "we go", "we going"];
  const isSelected = !!play.world.phrase;

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q11 · Ice-Cream Parlour 3D Studio"
      subtitle="Complete the joint invitation outside the 3D ice-cream parlour by selecting the modal phrase"
      hints={["'Shall ___ ...' is making a suggestion that includes the speaker too.", "After 'Shall' plus a subject, the verb stays in its plain form."]}
    >
      <Board>
        {/* 3D Ice Cream Parlour Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-pink-200/80 bg-gradient-to-b from-pink-50/80 via-rose-50/40 to-amber-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500 text-white shadow-xs">
                <IceCream className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-pink-950 uppercase tracking-wider block">Sunny Afternoon · Gelato Parlour</span>
                <span className="text-[11px] font-medium text-slate-500">Proposing an Afternoon Treat</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                isSelected ? "bg-purple-100 text-purple-800 border-purple-300" : "bg-pink-100 text-pink-900 border-pink-300"
              }`}>
                {isSelected ? `Dialogue: Shall ${play.world.phrase}...` : "Proposing an outing..."}
              </span>
            </div>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 5.0], fov: 45 }}>
            <IceCreamParlour3D position={[0, 0, 0]} />
            <Avatar3D position={[0.8, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#3B82F6" pose="holding_cone" hairStyle="cap" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-pink-50/80 border-2 border-pink-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            Shall{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            to the shop and buy ice cream? I think we deserve a treat today.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Suggestion Modal Phrase" tone="pink">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {phrases.map((p) => (
              <WordPill
                key={p}
                text={p}
                size="lg"
                tone="pink"
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
   Q12 — 3D Cricket Ground Roster & Pitch (Past Be-Verb Negation)
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
      if (!w.verb) return { note: "Select the past tense verb expressing absence" };
      const map: Record<string, string> = { "wasn't": "A", was: "B", "hasn't": "C", had: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["wasn't", "was", "hasn't", "had"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q12 · Cricket Academy 3D Stadium"
      subtitle="Complete the statement regarding the player's absence from yesterday's cricket training"
      hints={["'yesterday' tells you the time of the sentence.", "'I don't know where he was' tells you something about whether he was there. Try each option aloud."]}
    >
      <Board>
        {/* 3D Cricket Pitch Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Cricket Academy Pitch</span>
                <span className="text-[11px] font-medium text-slate-500">Yesterday's Training Session Log</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              Status: Player Absent
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.2, 5.8], fov: 45 }}>
            <CricketPitch3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            He{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            at cricket practice yesterday. I don't know where he was.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Past Tense Auxiliary" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
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
   Q13 — 3D Radar Weather Station (Future Perfect)
   Sentence: "I will call you later. Hopefully, you ______ made it home through the storm."
   Options: A. do have, B. do, C. will, D. will have -> Key: D (will have)
   ══════════════════════════════════════════════════════════════════════ */
export function Q13StormWarningActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the Future Perfect auxiliary" };
      const map: Record<string, string> = { "do have": "A", do: "B", will: "C", "will have": "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["do have", "do", "will", "will have"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q13 · Radar Weather Station 3D"
      subtitle="Complete the future perfect expectation for safe arrival home through the storm"
      hints={["The speaker hopes that, by the time of the call later, getting home will already be finished.", "That is a future action completed before another future moment: 'will ___ + made'."]}
    >
      <Board>
        {/* 3D Weather Station Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-blue-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Meteorological Radar Tower</span>
                <span className="text-[11px] font-medium text-slate-500">Tracking Coastal Storm Passage</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300">
              🌪️ Radar Active
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.0, 5.5], fov: 45 }}>
            <WeatherStation3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            I will call you later. Hopefully, you{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            made it home through the storm.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Auxiliary Verb" tone="sky">
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
   Q14 — 3D Park Directional Trail (Preposition 'To')
   Sentence: "I don't like it here, it is so busy. Let's go ______ another park where there are fewer people."
   Options: A. on, B. at, C. to, D. in -> Key: C (to)
   ══════════════════════════════════════════════════════════════════════ */
export function Q14ParkPathActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ prep?: string }>({
    question,
    initial: { prep: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.prep) return { note: "Select the directional preposition towards destination" };
      const map: Record<string, string> = { on: "A", at: "B", to: "C", in: "D" };
      return {
        value: w.prep,
        optionId: map[w.prep],
        note: `Selected: ${w.prep}`,
      };
    },
  });

  const preps = ["on", "at", "to", "in"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q14 · Botanical Park Trail 3D"
      subtitle="Examine the directional park trail and select the preposition of movement"
      hints={["The speakers want to move towards another park.", "Which preposition shows movement towards a place?"]}
    >
      <Board>
        {/* 3D Botanical Park Trail */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-lime-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Botanical Garden Pathways</span>
                <span className="text-[11px] font-medium text-slate-500">Directional Trail to Quieter Zone</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🌿 Direction: To Another Park
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.2, 5.8], fov: 45 }}>
            <ParkTrail3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I don't like it here, it is so busy. Let's go{" "}
            <SentenceSlot value={play.world.prep} filled={!!play.world.prep} />{" "}
            another park where there are fewer people.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Direction Preposition" tone="emerald">
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
   Q15 — 3D Train Station Platform (Gerund after 'instead of')
   Sentence: "They were late as usual. So, instead of ______ around, Reena decided to go on ahead without them."
   Options: A. wait, B. waited, C. waiting, D. waits -> Key: C (waiting)
   ══════════════════════════════════════════════════════════════════════ */
export function Q15TrainPlatformActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the gerund form after 'instead of'" };
      const map: Record<string, string> = { wait: "A", waited: "B", waiting: "C", waits: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["wait", "waited", "waiting", "waits"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q15 · Train Station Platform 3D"
      subtitle="Complete the sentence explaining why Reena moved ahead without waiting for latecomers"
      hints={["'instead of' is followed by a verb here.", "Try each form of 'wait' after 'instead of' and read the sentence aloud."]}
    >
      <Board>
        {/* 3D Train Station Platform */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Footprints className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Central Station Platform #4</span>
                <span className="text-[11px] font-medium text-slate-500">Reena Decides to Move Ahead</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🚶‍♀️ Moving Ahead
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.5, 6.0], fov: 45 }}>
            <TrainPlatform3D position={[0, 0, 0]} />
            <Avatar3D
              position={[-0.4, 0.5, 0.4]}
              shirtColor="#7C3AED"
              hairStyle="ponytail"
              pose="walking"
              hasBackpack
              backpackColor="#EC4899"
            />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            They were late as usual. So, instead of{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            around, Reena decided to go on ahead without them.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Gerund Form" tone="amber">
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

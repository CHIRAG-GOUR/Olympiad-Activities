"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { HeartPulse, Eye, UtensilsCrossed, Scissors, Footprints } from "lucide-react";
import {
  MedicalInfirmary3D,
  SuburbanGarden3D,
  CafeBistro3D,
  BikeWorkshop3D,
  MountainSummit3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — First Aid & Past Inquiry (Did)
   Mother: "Oh, dear! ______ you fall over? You have bruised your knee!"
   Options: A. Did, B. Do, C. Don't, D. How -> Key: A (Did)
   ══════════════════════════════════════════════════════════════════════ */
export function Q41BruisedKneeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ aux?: string }>({
    question,
    initial: { aux: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.aux) return { note: "Select the past simple auxiliary question word" };
      const map: Record<string, string> = { Did: "A", Do: "B", "Don't": "C", How: "D" };
      return {
        value: w.aux,
        optionId: map[w.aux],
        note: w.aux === "Did" ? "Correct: 'Did you fall over?' forms a past simple inquiry with base verb 'fall'" : `Selected: ${w.aux}`,
      };
    },
  });

  const auxs = ["Did", "Do", "Don't", "How"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q41 · First-Aid Station Past Inquiry 3D"
      subtitle="Complete Mother's inquiry about how the knee injury occurred in the 3D first-aid clinic"
      hints={["Past simple yes/no questions use auxiliary 'Did' + subject + base verb ('Did you fall over?')."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Home First-Aid Corner · Minor Injury</span>
                <span className="text-[11px] font-medium text-slate-500">Section 5: Spoken & Written Expression</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
              🩹 Auxiliary: Did you fall?
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <MedicalInfirmary3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0.4]} rotation={[0, 0.6, 0]} shirtColor="#9333EA" hairStyle="bun" pose="kneeling" />
            <Avatar3D position={[0.7, 0, 0.3]} rotation={[0, -0.6, 0]} shirtColor="#2563EB" hairStyle="short" pose="sitting" expression="worried" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Mother: "Oh, dear!{" "}
            <SentenceSlot value={play.world.aux} filled={!!play.world.aux} />{" "}
            you fall over? You have bruised your knee!"
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Question Auxiliary" tone="rose">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {auxs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="rose"
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
   Q42 — Personality Traits (Nosey)
   Christy: "Oh! That old man is always asking questions. He is so ______."
   Options: A. spatial, B. repentant, C. nosey, D. punctual -> Key: C (nosey)
   ══════════════════════════════════════════════════════════════════════ */
export function Q42CuriousNeighbourActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ trait?: string }>({
    question,
    initial: { trait: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.trait) return { note: "Select the adjective describing an overly inquisitive person" };
      const map: Record<string, string> = { spatial: "A", repentant: "B", nosey: "C", punctual: "D" };
      return {
        value: w.trait,
        optionId: map[w.trait],
        note: w.trait === "nosey" ? "Correct: 'nosey' (nosy) describes someone who pries into other people's affairs and asks too many questions" : `Selected: ${w.trait}`,
      };
    },
  });

  const traits = ["spatial", "repentant", "nosey", "punctual"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q42 · Neighbour Character Assessment 3D"
      subtitle="Identify the character adjective describing someone who constantly pries and asks questions"
      hints={["A person who is excessively curious about other people's private business is 'nosey'."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Neighbourhood Dialogue · Character Traits</span>
                <span className="text-[11px] font-medium text-slate-500">Evaluating Overly Inquisitive Behavior</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              👀 Trait: Nosey
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <SuburbanGarden3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0.4]} rotation={[0, 0.6, 0]} shirtColor="#D97706" hairStyle="short" pose="gesturing" />
            <Avatar3D position={[0.9, 0, 0.3]} rotation={[0, -0.6, 0]} shirtColor="#EC4899" hairStyle="ponytail" pose="standing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Christy: "Oh! That old man is always asking questions. He is so{" "}
            <SentenceSlot value={play.world.trait} filled={!!play.world.trait} />."
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Personality Adjective" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {traits.map((t) => (
              <WordPill
                key={t}
                text={t}
                tone="amber"
                selected={play.world.trait === t}
                onClick={() => play.set({ trait: t })}
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
   Q43 — Polite Social Dialogue: Dinner Acceptance
   Jenna: "Are you free for dinner in the evening?"
   Shetty: "______"
   Options:
     A. No problem.
     B. Yes, I can.
     C. Why?
     D. Certainly. What time in the evening? -> Key: D
   ══════════════════════════════════════════════════════════════════════ */
export function Q43DinnerResponseActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ reply?: string }>({
    question,
    initial: { reply: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.reply) return { note: "Select the most polite and natural dinner invitation response" };
      const map: Record<string, string> = {
        "No problem.": "A",
        "Yes, I can.": "B",
        "Why?": "C",
        "Certainly. What time in the evening?": "D",
      };
      return {
        value: w.reply,
        optionId: map[w.reply],
        note: w.reply.includes("Certainly") ? "Correct: Polite affirmative acceptance paired with time confirmation" : `Selected: ${w.reply}`,
      };
    },
  });

  const replies = [
    "No problem.",
    "Yes, I can.",
    "Why?",
    "Certainly. What time in the evening?",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q43 · Social Bistro Dialogue: Dinner Invitation 3D"
      subtitle="Select the polite, natural conversational response to accept the dinner invitation"
      hints={["'Certainly. What time in the evening?' provides courteous acceptance while clarifying logistics."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/80 via-purple-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">Conversational Etiquette · Dinner Plan</span>
                <span className="text-[11px] font-medium text-slate-500">Polite Pragmatic Dialogue</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300">
              🍽️ Response: Certainly. What time?
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <CafeBistro3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.9, 0, 0.4]} rotation={[0, 0.6, 0]} shirtColor="#6366F1" hairStyle="short" pose="sitting" />
            <Avatar3D position={[0.9, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#A855F7" hairStyle="bun" pose="sitting" />
          </World3D>
        </div>

        {/* Reply Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {replies.map((r) => {
            const active = play.world.reply === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => !play.locked && play.set({ reply: r })}
                className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                  active
                    ? "border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md ring-2 ring-indigo-200"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                }`}
              >
                <span>{r}</span>
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
        <Bay label="Confirm Polite Response" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {replies.map((r) => (
              <WordPill
                key={r}
                text={r}
                tone="indigo"
                selected={play.world.reply === r}
                onClick={() => play.set({ reply: r })}
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
   Q44 — Traditional English Proverb (saves nine)
   Mary: "Fix your bike right away. Don't leave it for the weekend."
   Tim: "Yes, a stitch in time ______."
   Options: A. make nine, B. saves time, C. makes time, D. saves nine -> Key: D (saves nine)
   ══════════════════════════════════════════════════════════════════════ */
export function Q44StitchInTimeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ proverbEnd?: string }>({
    question,
    initial: { proverbEnd: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.proverbEnd) return { note: "Select the completion for the famous English proverb" };
      const map: Record<string, string> = { "make nine": "A", "saves time": "B", "makes time": "C", "saves nine": "D" };
      return {
        value: w.proverbEnd,
        optionId: map[w.proverbEnd],
        note: w.proverbEnd === "saves nine" ? "Correct proverb: 'A stitch in time saves nine' (timely action prevents larger problems)" : `Selected: ${w.proverbEnd}`,
      };
    },
  });

  const endings = ["make nine", "saves time", "makes time", "saves nine"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q44 · Bicycle Workshop Proverb 3D"
      subtitle="Complete the timeless English proverb on timely repair and diligence at the 3D repair workshop"
      hints={["The traditional proverb is: 'A stitch in time saves nine'."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Wisdom & Proverbs Archive · Timely Repair</span>
                <span className="text-[11px] font-medium text-slate-500">Fixing Small Issues Before They Escalate</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🧵 Proverb: A Stitch in Time Saves Nine
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <BikeWorkshop3D position={[0, 0, 0]} />
            <Avatar3D position={[1.1, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#2563EB" hairStyle="cap" pose="kneeling" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Tim: "Yes, a stitch in time{" "}
            <SentenceSlot value={play.world.proverbEnd} filled={!!play.world.proverbEnd} />."
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Proverb Ending" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {endings.map((e) => (
              <WordPill
                key={e}
                text={e}
                tone="amber"
                selected={play.world.proverbEnd === e}
                onClick={() => play.set({ proverbEnd: e })}
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
   Q45 — Negative Agreement (Neither)
   Alan: "I am so tired. I don't feel like walking any more."
   Sherry: "Me ______"
   Options: A. as well as, B. also, C. neither, D. no -> Key: C (neither)
   ══════════════════════════════════════════════════════════════════════ */
export function Q45NegativeAgreementActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ particle?: string }>({
    question,
    initial: { particle: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.particle) return { note: "Select the word used to agree with a negative statement" };
      const map: Record<string, string> = { "as well as": "A", also: "B", neither: "C", no: "D" };
      return {
        value: w.particle,
        optionId: map[w.particle],
        note: w.particle === "neither" ? "Correct: 'neither' (Me neither / Neither do I) agrees with a negative sentence ('don't feel like')" : `Selected: ${w.particle}`,
      };
    },
  });

  const particles = ["as well as", "also", "neither", "no"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q45 · Mountain Trail Negative Agreement 3D"
      subtitle="Complete Sherry's concurrence with Alan's fatigue on the 3D mountain summit"
      hints={["To agree with a negative statement ('I don't feel like...'), English uses 'neither' (e.g. 'Me neither')."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-teal-200/80 bg-gradient-to-b from-teal-50/80 via-emerald-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                <Footprints className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wider block">Hiking Trail Rest Stop · Mutual Fatigue</span>
                <span className="text-[11px] font-medium text-slate-500">Agreeing with a Negative Assertion</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-teal-100 text-teal-900 border border-teal-300">
              🤝 Agreement: Me Neither
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <MountainSummit3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0.4]} rotation={[0, 0.6, 0]} shirtColor="#0284C7" hairStyle="cap" pose="sitting" expression="worried" />
            <Avatar3D position={[0.8, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#EC4899" hairStyle="ponytail" pose="sitting" expression="worried" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-teal-50/80 border-2 border-teal-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Alan: "I am so tired. I don't feel like walking any more."<br />
            Sherry: "Me{" "}
            <SentenceSlot value={play.world.particle} filled={!!play.world.particle} />."
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Agreement Particle" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {particles.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="emerald"
                selected={play.world.particle === p}
                onClick={() => play.set({ particle: p })}
                disabled={play.locked}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

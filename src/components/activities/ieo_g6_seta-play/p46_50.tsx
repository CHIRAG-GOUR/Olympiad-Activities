"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { Trophy, Sparkles, Waves, Search, AlertCircle, Heart } from "lucide-react";
import {
  AbsurdBicycle3D,
  CommunalKitchen3D,
  SwimmingPool3D,
  LexicalVault3D,
  CarRideDropoff3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — Absurd Bike Riding Idea (Preposterous)
   Sentence: "Riding my bike with the dog on my lap. What a ______ idea!"
   Options: A. preposterous, B. durable, C. laborious, D. imbrue -> Key: A (preposterous)
   ══════════════════════════════════════════════════════════════════════ */
export function Q46RidiculousBikeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the advanced adjective expressing utter absurdity" };
      const map: Record<string, string> = { preposterous: "A", durable: "B", laborious: "C", imbrue: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["preposterous", "durable", "laborious", "imbrue"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q46 · Achievers: Absurd Idea Evaluation 3D"
      subtitle="Identify the advanced vocabulary term describing a dangerous and utterly ridiculous proposal"
      hints={["Riding a bike with a dog on your lap would be silly.", "Which word means absurd or ridiculous?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/90 bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-300/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Advanced Vocabulary: Total Absurdity</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-200/80 text-amber-950 border border-amber-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> 3 Marks Question
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <AbsurdBicycle3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.3, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} shirtColor="#3B82F6" hairStyle="cap" pose="biking" expression="worried" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Riding my bike with the dog on my lap. What a{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
            idea!
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Advanced Adjective" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {adjs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="amber"
                selected={play.world.adj === a}
                onClick={() => play.set({ adj: a })}
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
   Q47 — Shared European Hostel Kitchen (Communal)
   Sentence: "I went to a hostel when I was in Europe and there was a ______ kitchen. It was strange to have to share it with other people we did not know."
   Options: A. corporal, B. considerate, C. communal, D. contentious -> Key: C (communal)
   ══════════════════════════════════════════════════════════════════════ */
export function Q47SharedHostelKitchenActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the adjective meaning shared by all community members" };
      const map: Record<string, string> = { corporal: "A", considerate: "B", communal: "C", contentious: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["corporal", "considerate", "communal", "contentious"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q47 · Achievers: Shared Hostel Kitchen 3D"
      subtitle="Identify the social adjective describing facilities shared amongst travellers from different places"
      hints={["The kitchen was shared with other people.", "Which word is linked to 'community' and means shared?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-300/90 bg-gradient-to-b from-sky-50/90 via-indigo-50/50 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-300/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">European Hostel · Shared Cooking Space</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-200/80 text-sky-950 border border-sky-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-700" /> 3 Marks Question
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <CommunalKitchen3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.9, 0, 0.4]} rotation={[0, 0.6, 0]} shirtColor="#0D9488" hairStyle="short" pose="gesturing" />
            <Avatar3D position={[0.9, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#8B5CF6" hairStyle="bun" pose="gesturing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I went to a hostel when I was in Europe and there was a{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
            kitchen. It was strange to have to share it with other people we did not know.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Shared Facility Adjective" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {adjs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="sky"
                selected={play.world.adj === a}
                onClick={() => play.set({ adj: a })}
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
   Q48 — Hydrodynamic Thrust Verb (Propel)
   Sentence: "When you swim, you can use your arms to ______ you forward."
   Options: A. propel, B. pith, C. purport, D. pester -> Key: A (propel)
   ══════════════════════════════════════════════════════════════════════ */
export function Q48SwimmingPropulsionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the verb meaning to drive or push forward" };
      const map: Record<string, string> = { propel: "A", pith: "B", purport: "C", pester: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["propel", "pith", "purport", "pester"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q48 · Achievers: Hydrodynamic Propulsion 3D"
      subtitle="Examine how arm strokes generate forward thrust and propel a swimmer through the 3D pool lane"
      hints={["Your arms move you forward through the water.", "Which verb means to push or drive forward?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-cyan-300/90 bg-gradient-to-b from-cyan-50/90 via-blue-50/50 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Aquatic Biomechanics · Forward Thrust</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-cyan-200/80 text-cyan-950 border border-cyan-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-700" /> 3 Marks Question
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <SwimmingPool3D position={[0, 0, 0]} />
            <Avatar3D position={[0, -0.1, 0]} rotation={[0, Math.PI / 2, 0]} shirtColor="#0284C7" hairStyle="swimcap" pose="swimming" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-cyan-50/80 border-2 border-cyan-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            When you swim, you can use your arms to{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            you forward.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Forward Thrust Verb" tone="sky">
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
   Q49 — Forensic Spelling (Convalesence -> Convalescence)
   Question: "Choose the word with the incorrect spelling."
   Options: A. Credulous, B. Convalesence, C. Contagious, D. Contemporary -> Key: B (Convalesence)
   ══════════════════════════════════════════════════════════════════════ */
export function Q49AdvancedSpellingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string }>({
    question,
    initial: { selectedWord: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Select the word containing a spelling error" };
      const map: Record<string, string> = { Credulous: "A", Convalesence: "B", Contagious: "C", Contemporary: "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note: `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["Credulous", "Convalesence", "Contagious", "Contemporary"];
  const definitions: Record<string, string> = {
    Credulous: "Meaning: too ready to believe things.",
    Convalesence: "Meaning: the time of slowly getting better after an illness.",
    Contagious: "Meaning: able to spread from one person to another.",
    Contemporary: "Meaning: belonging to the same time; modern.",
  };

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q49 · Achievers: Lexical Forensic Spelling 3D"
      subtitle="Inspect 3D optical holographic columns and flag the single misspelling"
      hints={["Say each word slowly and check the spelling letter by letter.", "Look closely at the middle of the long word that means getting better after an illness."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-300/90 bg-gradient-to-b from-rose-50/90 via-purple-50/50 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-300/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Advanced Orthographic Analysis</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-200/80 text-rose-950 border border-rose-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" /> 3 Marks Question
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[1.1, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#E11D48" hairStyle="short" pose="gesturing" />
          </World3D>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {words.map((w) => {
            const active = play.world.selectedWord === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => !play.locked && play.set({ selectedWord: w })}
                className={`p-3.5 rounded-xl border-2 text-left transition-all relative ${
                  active
                    ? "border-rose-500 bg-rose-50/90 shadow-md ring-2 ring-rose-200"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-bold text-slate-900">{w}</span>
                  {active && <span className="text-xs font-bold text-rose-600">FLAGGED</span>}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {definitions[w]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Diagnostic Note */}
        <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-700 font-medium">
            {play.world.selectedWord
              ? definitions[play.world.selectedWord]
              : "Select the word card above to analyze its orthographic validity."}
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Incorrectly Spelt Term" tone="rose">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {words.map((w) => (
              <WordPill
                key={w}
                text={w}
                tone="rose"
                selected={play.world.selectedWord === w}
                onClick={() => play.set({ selectedWord: w })}
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
   Q50 — Social Pragmatic Dismissal (Don't be silly, it was nothing)
   Joy: "How can I ever repay you?"
   Mohit: "______"
   Options:
     A. Oh well, better luck next time.
     B. Well, I am not sure, but let me ask somebody.
     C. Don't be silly, it was nothing.
     D. What do you need? -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q50FavorRepaymentActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ reply?: string }>({
    question,
    initial: { reply: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.reply) return { note: "Select the natural, polite response to an expression of immense gratitude" };
      const map: Record<string, string> = {
        "Oh well, better luck next time.": "A",
        "Well, I am not sure, but let me ask somebody.": "B",
        "Don't be silly, it was nothing.": "C",
        "What do you need?": "D",
      };
      return {
        value: w.reply,
        optionId: map[w.reply],
        note: `Selected: ${w.reply}`,
      };
    },
  });

  const replies = [
    "Oh well, better luck next time.",
    "Well, I am not sure, but let me ask somebody.",
    "Don't be silly, it was nothing.",
    "What do you need?",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q50 · Achievers: Pragmatic Social Dialogue 3D"
      subtitle="Select the gracious conversational response acknowledging and modestly dismissing a favor at the 3D car drop-off"
      hints={["Joy is thanking Mohit for a kind favour.", "Which reply graciously plays down the favour?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-300/90 bg-gradient-to-b from-purple-50/90 via-pink-50/50 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-300/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Pragmatic Dialogue · Gracious Favor Repayment</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-200/80 text-purple-950 border border-purple-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" /> 3 Marks Question
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <CarRideDropoff3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0.4]} rotation={[0, 0.6, 0]} shirtColor="#2563EB" hairStyle="short" pose="gesturing" />
            <Avatar3D position={[1.2, 0, 0.3]} rotation={[0, -0.6, 0]} shirtColor="#EC4899" hairStyle="ponytail" pose="gesturing" />
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
                    ? "border-purple-600 bg-purple-50 text-purple-950 shadow-md ring-2 ring-purple-200"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                }`}
              >
                <span>{r}</span>
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
        <Bay label="Confirm Gracious Dialogue Response" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {replies.map((r) => (
              <WordPill
                key={r}
                text={r}
                tone="purple"
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

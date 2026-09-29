"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Clapperboard,
  Palmtree,
  Sun,
  Scale,
  Footprints,
  Trophy,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  BeachSeaside3D,
  LexicalVault3D,
  SuburbanGarden3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — 🎬 3D Conversation Director (Achievers)
   Sentence: "No offence meant to you ______ I don't think you've quite understood what I want."
   Options: A. but, B. so, C. when, D. because -> Key: A (but)
   ══════════════════════════════════════════════════════════════════════ */
export function Q46RidiculousBikeActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedConjunction?: string; directionSet: boolean }>({
    question,
    initial: { selectedConjunction: undefined, directionSet: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedConjunction) return { note: "Direct the boardroom dialogue transition and choose 'but'" };
      const map: Record<string, string> = { but: "A", so: "B", when: "C", because: "D" };
      return {
        value: w.selectedConjunction,
        optionId: map[w.selectedConjunction],
        note:
          w.selectedConjunction === "but"
            ? "Discourse marker: 'No offence meant to you, but...' is the standard polite preface for expressing disagreement."
            : `Selected: ${w.selectedConjunction}`,
      };
    },
  });

  const conjunctions = ["but", "so", "when", "because"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q46 · 🏆 3D Conversation Director"
      subtitle="Direct the polite disclaimer into respectful disagreement with the contrast conjunction 'but'"
      hints={[
        "The conventional social discourse structure is 'No offence meant to you, BUT...'.",
      ]}
    >
      <Board>
        {/* 3D Executive Office Studio */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-xs">
                <Trophy className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Achievers Section · Social Language Lab
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Polite Softener → Respectful Clarification
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950">
              3 Marks
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0]} pose="gesturing" shirtColor="#D97706" />
            <Avatar3D position={[0.8, 0, 0]} pose="standing" shirtColor="#475569" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            No offence meant to you{" "}
            <SentenceSlot value={play.world.selectedConjunction} filled={!!play.world.selectedConjunction} />{" "}
            I don&apos;t think you&apos;ve quite understood what I want.
          </p>
        </div>

        {/* Conjunction Bay */}
        <Bay label="Discourse Contrast Bay" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {conjunctions.map((c) => (
              <WordPill
                key={c}
                word={c}
                selected={play.world.selectedConjunction === c}
                onClick={() => play.patch({ selectedConjunction: c })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — 🏖️ ACHIEVER 3D FUTURE-TIME SIMULATION (Future Continuous)
   Sentence: "This time next week I won't be in class, ______ on a beach relaxing."
   Options: A. I'd lie, B. I'll be lying, C. I'll lie, D. I'm lying -> Key: B (I'll be lying)
   ══════════════════════════════════════════════════════════════════════ */
export function Q47SharedHostelKitchenActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [timelineStep, setTimelineStep] = useState<"Today (Class)" | "Next Week (Beach)">("Next Week (Beach)");

  const play = usePlay<{ selectedAspect?: string; step: string }>({
    question,
    initial: { selectedAspect: undefined, step: "Next Week (Beach)" },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAspect) return { note: "Advance the future timeline portal to next week and select the future continuous form" };
      const map: Record<string, string> = {
        "I'd lie": "A",
        "I'll be lying": "B",
        "I'll lie": "C",
        "I'm lying": "D",
      };
      return {
        value: w.selectedAspect,
        optionId: map[w.selectedAspect],
        note:
          w.selectedAspect === "I'll be lying"
            ? "Future Continuous: 'This time next week... I'll be lying on a beach' describes an action in progress at a specific future moment."
            : `Selected: ${w.selectedAspect}`,
      };
    },
  });

  const aspects = ["I'd lie", "I'll be lying", "I'll lie", "I'm lying"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q47 · 🏖️ 3D Future-Time Simulation"
      subtitle="Shift from today's classroom to next week's tropical beach and install 'I'll be lying'"
      hints={[
        "'This time next week' specifies a future point in time when an ongoing activity will be taking place: Future Continuous ('I'll be lying').",
      ]}
    >
      <Board>
        {/* 3D Beach & Future Timeline */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-300/80 bg-gradient-to-b from-sky-100 to-amber-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-sky-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
                <Palmtree className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Future Timeline Projection
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Target Point: Exactly 7 Days from Now · Beach Vacation
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950">
              3 Marks
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <BeachSeaside3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#0284C7" hairStyle="swimcap" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-sky-50/90 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            This time next week I won&apos;t be in class,{" "}
            <SentenceSlot value={play.world.selectedAspect} filled={!!play.world.selectedAspect} />{" "}
            on a beach relaxing.
          </p>
        </div>

        {/* Aspect Bay */}
        <Bay label="Future Continuous Aspect Bay" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {aspects.map((a) => (
              <WordPill
                key={a}
                word={a}
                selected={play.world.selectedAspect === a}
                onClick={() => play.patch({ selectedAspect: a })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q48 — 🌓 ACHIEVER 3D LIGHT/DARK WORLD (Antonym of Sinister)
   Question: "Choose the correct antonym of the given word: Sinister"
   Options: A. Threatening, B. Evil, C. Ominous, D. Auspicious -> Key: D (Auspicious)
   ══════════════════════════════════════════════════════════════════════ */
export function Q48SwimmingPropulsionActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedAntonym?: string; realmShifted: boolean }>({
    question,
    initial: { selectedAntonym: undefined, realmShifted: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAntonym) return { note: "Cross from the ominous dark realm into the radiant realm and choose 'Auspicious'" };
      const map: Record<string, string> = {
        Threatening: "A",
        Evil: "B",
        Ominous: "C",
        Auspicious: "D",
      };
      return {
        value: w.selectedAntonym,
        optionId: map[w.selectedAntonym],
        note:
          w.selectedAntonym === "Auspicious"
            ? "Antonym match: 'Sinister' means giving the impression that something harmful or evil is happening; its exact opposite is 'Auspicious' (promising success, favorable)."
            : `Selected: ${w.selectedAntonym}`,
      };
    },
  });

  const antonyms = ["Threatening", "Evil", "Ominous", "Auspicious"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q48 · 🌓 3D Light/Dark World"
      subtitle="Traverse between the ominous sinister realm and the favorable auspicious realm"
      hints={[
        "'Sinister' means threatening evil or disaster; 'Auspicious' means favorable, promising good fortune (the true antonym).",
      ]}
    >
      <Board>
        {/* 3D Dual Light & Dark World */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-300/80 bg-gradient-to-b from-purple-950 to-amber-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-purple-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Sun className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-200 uppercase tracking-wider block">
                  Dual Realm Semantic Transformer
                </span>
                <span className="text-[11px] font-medium text-amber-300">
                  Sinister (Ominous / Dark) ↔ Auspicious (Favorable / Golden)
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950">
              3 Marks
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#F59E0B" />
          </World3D>
        </div>

        {/* Live Antonym Slot */}
        <div className="bg-purple-950/80 border-2 border-purple-700 text-purple-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Antonym of <span className="text-purple-400 font-mono underline">Sinister</span> ={" "}
            <SentenceSlot value={play.world.selectedAntonym} filled={!!play.world.selectedAntonym} />
          </p>
        </div>

        {/* Antonym Bay */}
        <Bay label="Antonym Selection Bay" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {antonyms.map((a) => (
              <WordPill
                key={a}
                word={a}
                selected={play.world.selectedAntonym === a}
                onClick={() => play.patch({ selectedAntonym: a })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q49 — ⚖️ 3D Decision Chamber (Synonym of Unilateral)
   Question: "Choose the correct synonym of the given word: Unilateral"
   Options: A. One-sided, B. Open-ended, C. Quick-witted, D. Down-trodden -> Key: A (One-sided)
   ══════════════════════════════════════════════════════════════════════ */
export function Q49AdvancedSpellingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedSynonym?: string; decisionExecuted: boolean }>({
    question,
    initial: { selectedSynonym: undefined, decisionExecuted: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedSynonym) return { note: "Manipulate the single-party decision lever and select the synonym of 'Unilateral'" };
      const map: Record<string, string> = {
        "One-sided": "A",
        "Open-ended": "B",
        "Quick-witted": "C",
        "Down-trodden": "D",
      };
      return {
        value: w.selectedSynonym,
        optionId: map[w.selectedSynonym],
        note:
          w.selectedSynonym === "One-sided"
            ? "Synonym match: 'Unilateral' (uni- = one + lateral = side) means performed by or affecting only one person, group, or country ('One-sided')."
            : `Selected: ${w.selectedSynonym}`,
      };
    },
  });

  const synonyms = ["One-sided", "Open-ended", "Quick-witted", "Down-trodden"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q49 · ⚖️ 3D Decision Chamber"
      subtitle="Examine single-party decision protocols and pair 'Unilateral' with 'One-sided'"
      hints={[
        "'Unilateral' literally means done by or affecting only one side without the agreement of others ('One-sided').",
      ]}
    >
      <Board>
        {/* 3D Decision Rotunda */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-300/80 bg-gradient-to-b from-indigo-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-indigo-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Scale className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
                  Diplomatic Decision Rotunda
                </span>
                <span className="text-[11px] font-medium text-indigo-400">
                  Protocol: Single Party Action · Zero Counterpart Consent
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950">
              3 Marks
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#4F46E5" />
          </World3D>
        </div>

        {/* Live Synonym Slot */}
        <div className="bg-indigo-950/80 border-2 border-indigo-700 text-indigo-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Synonym of <span className="text-indigo-400 font-mono underline">Unilateral</span> ={" "}
            <SentenceSlot value={play.world.selectedSynonym} filled={!!play.world.selectedSynonym} />
          </p>
        </div>

        {/* Synonym Bay */}
        <Bay label="Synonym Selection Bay" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {synonyms.map((s) => (
              <WordPill
                key={s}
                word={s}
                selected={play.world.selectedSynonym === s}
                onClick={() => play.patch({ selectedSynonym: s })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q50 — 👟 3D Lost Shoe Adventure (Achievers Phrasal Verb)
   Dialogue:
     Felix: I've lost my shoe, so I am having to ______ with bare feet.
   Options: A. push over, B. get by, C. have it, D. show around -> Key: B (get by)
   ══════════════════════════════════════════════════════════════════════ */
export function Q50FavorRepaymentActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedPhrasal?: string; shoeSearched: boolean }>({
    question,
    initial: { selectedPhrasal: undefined, shoeSearched: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedPhrasal) return { note: "Search for Felix's lost shoe and select the phrasal verb meaning to manage with difficulty" };
      const map: Record<string, string> = {
        "push over": "A",
        "get by": "B",
        "have it": "C",
        "show around": "D",
      };
      return {
        value: w.selectedPhrasal,
        optionId: map[w.selectedPhrasal],
        note:
          w.selectedPhrasal === "get by"
            ? "Phrasal verb: 'get by' means to manage, cope, or survive despite a difficulty or lack of resources."
            : `Selected: ${w.selectedPhrasal}`,
      };
    },
  });

  const phrasals = ["push over", "get by", "have it", "show around"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q50 · 🏆 3D Lost Shoe Adventure"
      subtitle="Help Felix cope with his missing shoe and install the phrasal verb 'get by'"
      hints={[
        "'Get by' means to manage or cope with difficulty (e.g., continuing to move around with bare feet).",
      ]}
    >
      <Board>
        {/* 3D Lost Shoe Exploration */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Footprints className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  School Hallway Lost & Found
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Felix: Missing Left Shoe → Strategy: Manage / Cope with Bare Feet
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950">
              3 Marks
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <SuburbanGarden3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#EA580C" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <div className="text-left max-w-md mx-auto space-y-2 text-slate-900 text-sm sm:text-base font-medium">
            <p className="text-slate-600 text-xs block mb-1 font-bold">Felix:</p>
            <p>
              I&apos;ve lost my shoe, so I am having to{" "}
              <SentenceSlot value={play.world.selectedPhrasal} filled={!!play.world.selectedPhrasal} />{" "}
              with bare feet.
            </p>
          </div>
        </div>

        {/* Phrasal Bay */}
        <Bay label="Phrasal Verb Bay" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {phrasals.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedPhrasal === p}
                onClick={() => play.patch({ selectedPhrasal: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

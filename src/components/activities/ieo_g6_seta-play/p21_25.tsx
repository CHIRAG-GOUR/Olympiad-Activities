"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { Palette, Utensils, Volume2, ShieldAlert, Fish } from "lucide-react";
import {
  ArtStudio3D,
  GrandBanquetHall3D,
  AcousticSoundLab3D,
  ClassroomAuditorium3D,
  MarineReef3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — 3D Masterpiece Art Studio (Precision Vocabulary)
   Sentence: "That is such a pretty picture. I would like to try and ______ it."
   Options: A. repeal, B. revitalise, C. replicate, D. reimburse -> Key: C (replicate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q21ArtStudioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the vocabulary term meaning to make an exact copy" };
      const map: Record<string, string> = { repeal: "A", revitalise: "B", replicate: "C", reimburse: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["repeal", "revitalise", "replicate", "reimburse"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q21 · Masterpiece Art Studio 3D"
      subtitle="Select the precise verb describing reproducing the master oil painting on easel"
      hints={["The speaker wants to make their own copy of the picture.", "Which word means to copy something exactly?"]}
    >
      <Board>
        {/* 3D Art Studio Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-200/80 bg-gradient-to-b from-purple-50/80 via-pink-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Fine Arts Studio · Easel Station</span>
                <span className="text-[11px] font-medium text-slate-500">Master Canvas Reproduction</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-300">
              🎨 Target: Replicate
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.8, 5.0], fov: 45 }}>
            <ArtStudio3D position={[0, 0, 0]} />
            <Avatar3D position={[0.9, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#7C3AED" hairStyle="beret" pose="gesturing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            That is such a pretty picture. I would like to try and{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            it.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Precise Verb" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                tone="purple"
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
   Q22 — 3D Grand Banquet Feast (Regret 'If only')
   Sentence: "If ______ I had not eaten that last piece of cake. I feel so full."
   Options: A. barely, B. never, C. ever, D. only -> Key: D (only)
   ══════════════════════════════════════════════════════════════════════ */
export function Q22CakeRegretActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adverb?: string }>({
    question,
    initial: { adverb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adverb) return { note: "Select the word completing the idiom of regret" };
      const map: Record<string, string> = { barely: "A", never: "B", ever: "C", only: "D" };
      return {
        value: w.adverb,
        optionId: map[w.adverb],
        note: `Selected: ${w.adverb}`,
      };
    },
  });

  const adverbs = ["barely", "never", "ever", "only"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q22 · Grand Banquet Feast 3D"
      subtitle="Complete the idiom of regret describing overeating at the grand banquet table"
      hints={["'If ___ I had not eaten...' expresses a regret about the past.", "Try each word in the blank and read the sentence aloud."]}
    >
      <Board>
        {/* 3D Banquet Hall Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Utensils className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Grand Banquet Dining Table</span>
                <span className="text-[11px] font-medium text-slate-500">Overeating Regret Expression</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🍰 Idiom: If only...
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.2, 5.8], fov: 45 }}>
            <GrandBanquetHall3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            If{" "}
            <SentenceSlot value={play.world.adverb} filled={!!play.world.adverb} />{" "}
            I had not eaten that last piece of cake. I feel so full.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Regret Particle" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {adverbs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="amber"
                selected={play.world.adverb === a}
                onClick={() => play.set({ adverb: a })}
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
   Q23 — 3D Acoustic Sound Chamber (Audible)
   Sentence: "The music was so quiet, it was barely ______."
   Options: A. amicable, B. audible, C. atrocious, D. averse -> Key: B (audible)
   ══════════════════════════════════════════════════════════════════════ */
export function Q23QuietSoundActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the sensory adjective related to hearing sounds" };
      const map: Record<string, string> = { amicable: "A", audible: "B", atrocious: "C", averse: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["amicable", "audible", "atrocious", "averse"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q23 · Acoustic Testing Chamber 3D"
      subtitle="Identify the hearing-related adjective describing faint or barely perceptible music"
      hints={["The music was so quiet it could hardly be heard.", "Look for the word linked with hearing (think 'audio')."]}
    >
      <Board>
        {/* 3D Sound Chamber */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-indigo-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Acoustic Testing Chamber</span>
                <span className="text-[11px] font-medium text-slate-500">Decibel Level: 5 dB · Faint Whisper Range</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300">
              🔊 Volume: Barely Audible
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.8, 5.2], fov: 45 }}>
            <AcousticSoundLab3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            The music was so quiet, it was barely{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Sensory Adjective" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {adjs.map((a) => (
              <WordPill
                key={a}
                text={a}
                size="lg"
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
   Q24 — 3D School Classroom Discipline (Modal 'Should')
   Sentence: "He ______ get a detention for being so badly behaved."
   Options: A. should, B. won't, C. shan't, D. ought -> Key: A (should)
   ══════════════════════════════════════════════════════════════════════ */
export function Q24SchoolDisciplineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ modal?: string }>({
    question,
    initial: { modal: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.modal) return { note: "Select the modal verb expressing expected consequence" };
      const map: Record<string, string> = { should: "A", "won't": "B", "shan't": "C", ought: "D" };
      return {
        value: w.modal,
        optionId: map[w.modal],
        note: `Selected: ${w.modal}`,
      };
    },
  });

  const modals = ["should", "won't", "shan't", "ought"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q24 · School Conduct 3D Auditorium"
      subtitle="Identify the modal verb expressing a justified disciplinary consequence"
      hints={["The speaker thinks a detention is what he deserves.", "Pick the modal that fits straight before 'get'. Check whether 'ought' would need 'to'."]}
    >
      <Board>
        {/* 3D Classroom Auditorium */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Classroom Hall · Code of Conduct</span>
                <span className="text-[11px] font-medium text-slate-500">Evaluation of Disruptive Behavior</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
              📋 Modal: Should (Deserved Consequence)
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 3.2, 5.8], fov: 45 }}>
            <ClassroomAuditorium3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-rose-50/80 border-2 border-rose-300/80 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            He{" "}
            <SentenceSlot value={play.world.modal} filled={!!play.world.modal} />{" "}
            get a detention for being so badly behaved.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Modal Verb" tone="rose">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {modals.map((m) => (
              <WordPill
                key={m}
                text={m}
                tone="rose"
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
   Q25 — 3D Deep Ocean Marine Creatures (Marine)
   Sentence: "There is a lot of ______ life in the sea. Some of the creatures are strange."
   Options: A. wharf, B. marina, C. quay, D. marine -> Key: D (marine)
   ══════════════════════════════════════════════════════════════════════ */
export function Q25MarineCreaturesActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the adjective relating to the sea and ocean life" };
      const map: Record<string, string> = { wharf: "A", marina: "B", quay: "C", marine: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["wharf", "marina", "quay", "marine"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q25 · Deep Ocean Marine 3D World"
      subtitle="Select the correct adjective modifying ocean life and deep-sea creatures"
      hints={["The blank describes the kind of life found in the sea.", "Three options are places where boats stop. Which word is an adjective meaning 'of the sea'?"]}
    >
      <Board>
        {/* 3D Deep Ocean Reef */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-cyan-200/80 bg-gradient-to-b from-cyan-50/80 via-blue-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
                <Fish className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-950 uppercase tracking-wider block">Deep Sea Ocean Reef</span>
                <span className="text-[11px] font-medium text-slate-500">Exploring Marine Biodiversity</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-cyan-100 text-cyan-900 border border-cyan-300">
              🌊 Collocation: Marine Life
            </span>
          </div>

          <World3D cue={play.world} sky="#C9ECFF" ground="#F0DCA0" height="280px" camera={{ position: [0, 3.0, 5.5], fov: 45 }}>
            <MarineReef3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-cyan-50/80 border-2 border-cyan-300/80 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            There is a lot of{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
            life in the sea. Some of the creatures are strange.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Oceanic Adjective" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {adjs.map((a) => (
              <WordPill
                key={a}
                text={a}
                size="lg"
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

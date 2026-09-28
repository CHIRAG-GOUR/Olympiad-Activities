"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { Palette, Volume2, Shield, Fish, HeartCrack } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — Art Restoration Replicator (Precision Vocabulary)
   Sentence: "That is such a pretty picture. I would like to try and ______ it."
   Options: A. repeal, B. revitalise, C. replicate, D. reimburse -> Key: C (replicate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q21ArtRestorationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the art reproduction verb" };
      const map: Record<string, string> = { repeal: "A", revitalise: "B", replicate: "C", reimburse: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "replicate" ? "Correct: 'replicate' means to reproduce or make a copy of artwork" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["repeal", "revitalise", "replicate", "reimburse"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q21 · Art Studio Replicator"
      subtitle="Select the precise verb meaning to copy or duplicate a masterpiece"
      hints={["'Replicate' specifically means to create an exact reproduction or copy of an existing work."]}
    >
      <Board>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs sm:text-sm">
            <Palette className="w-4 h-4 text-purple-700" />
            <span>Masterpiece Gallery: 'Sunset Over Venice' (Oil on Canvas)</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            That is such a pretty picture. I would like to try and{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            it.
          </p>
        </div>

        <Bay label="Precision Art Verb" tone="purple">
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
   Q22 — Dessert Decision (Idiomatic Regret 'If only')
   Sentence: "If ______ I had not eaten that last piece of cake. I feel so full."
   Options: A. barely, B. never, C. ever, D. only -> Key: D (only)
   ══════════════════════════════════════════════════════════════════════ */
export function Q22CakeChallengeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ particle?: string }>({
    question,
    initial: { particle: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.particle) return { note: "Select the regret idiom particle" };
      const map: Record<string, string> = { barely: "A", never: "B", ever: "C", only: "D" };
      return {
        value: w.particle,
        optionId: map[w.particle],
        note: w.particle === "only" ? "Correct idiom of regret: 'If only I had not...'" : `Selected: ${w.particle}`,
      };
    },
  });

  const particles = ["barely", "never", "ever", "only"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q22 · Dessert Regret Challenge"
      subtitle="Complete the exclamation expressing deep wish or regret"
      hints={["'If only' is a fixed idiom followed by Past Perfect to express regret over a past choice."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <HeartCrack className="w-4 h-4 text-amber-700" />
            <span>Satiation Status: 100% Full (Excessive Cake Consumed)</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            If <SentenceSlot value={play.world.particle} filled={!!play.world.particle} /> I had not eaten that last piece of cake. I feel so full.
          </p>
        </div>

        <Bay label="Regret Particle Selector" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {particles.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="amber"
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

/* ══════════════════════════════════════════════════════════════════════
   Q23 — Sound Engineering Room ('Audible')
   Sentence: "The music was so quiet, it was barely ______."
   Options: A. amicable, B. audible, C. atrocious, D. averse -> Key: B (audible)
   ══════════════════════════════════════════════════════════════════════ */
export function Q23SoundDetectorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the sound perception adjective" };
      const map: Record<string, string> = { amicable: "A", audible: "B", atrocious: "C", averse: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "audible" ? "Correct: 'audible' means capable of being heard" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["amicable", "audible", "atrocious", "averse"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q23 · Sound Engineering Room"
      subtitle="Analyze the low-amplitude acoustic waveform"
      hints={["Something that can be heard is 'audible'. 'Barely audible' means almost too quiet to hear."]}
    >
      <Board>
        {/* Waveform graphic */}
        <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-emerald-400">
              <Volume2 className="w-4 h-4" /> Acoustic Sensor #9
            </span>
            <span className="font-mono text-slate-400">Level: 4 dB (Whisper Threshold)</span>
          </div>
          <div className="w-full h-8 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="w-full h-1 bg-emerald-500 rounded-full animate-pulse opacity-60" />
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            The music was so quiet, it was barely{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />.
          </p>
        </div>

        <Bay label="Acoustic Adjective Selector" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {adjs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="emerald"
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
   Q24 — School Discipline Simulator ('Should')
   Sentence: "He ______ get a detention for being so badly behaved."
   Options: A. should, B. won't, C. shan't, D. ought -> Key: A (should)
   ══════════════════════════════════════════════════════════════════════ */
export function Q24DetentionChamberActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ modal?: string }>({
    question,
    initial: { modal: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.modal) return { note: "Select the modal verb of expectation" };
      const map: Record<string, string> = { should: "A", "won't": "B", "shan't": "C", ought: "D" };
      return {
        value: w.modal,
        optionId: map[w.modal],
        note: w.modal === "should" ? "Correct modal: 'should get a detention' ('ought' requires 'to')" : `Selected: ${w.modal}`,
      };
    },
  });

  const modals = ["should", "won't", "shan't", "ought"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q24 · School Conduct Simulator"
      subtitle="Apply the appropriate modal expressing expected consequence"
      hints={["'Should' is followed directly by base verb 'get'. 'Ought' would require 'to get'."]}
    >
      <Board>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-900 font-bold text-xs sm:text-sm">
            <Shield className="w-4 h-4 text-red-700" />
            <span>Discipline Record: Disruptive Behaviour Reported</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            He <SentenceSlot value={play.world.modal} filled={!!play.world.modal} /> get a detention for being so badly behaved.
          </p>
        </div>

        <Bay label="Consequence Modal Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {modals.map((m) => (
              <WordPill
                key={m}
                text={m}
                tone="purple"
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
   Q25 — 3D Ocean Explorer ('Marine Life')
   Sentence: "There is a lot of ______ life in the sea. Some of the creatures are strange."
   Options: A. wharf, B. marina, C. quay, D. marine -> Key: D (marine)
   ══════════════════════════════════════════════════════════════════════ */
export function Q25OceanExplorerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ word?: string }>({
    question,
    initial: { word: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.word) return { note: "Select the oceanic adjective" };
      const map: Record<string, string> = { wharf: "A", marina: "B", quay: "C", marine: "D" };
      return {
        value: w.word,
        optionId: map[w.word],
        note: w.word === "marine" ? "Correct collocation: 'marine life' refers to saltwater organisms" : `Selected: ${w.word}`,
      };
    },
  });

  const words = ["wharf", "marina", "quay", "marine"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q25 · Submarine Ocean Explorer"
      subtitle="Classify living organisms in the deep coral reef environment"
      hints={["'Marine' is the adjective meaning relating to or found in the sea, forming the standard term 'marine life'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Deep Ocean Floor */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Coral Formations */}
          <mesh position={[-0.8, 0.1, 0]}>
            <dodecahedronGeometry args={[0.5]} />
            <meshStandardMaterial color="#F43F5E" />
          </mesh>
          <mesh position={[0.7, 0, -0.3]}>
            <octahedronGeometry args={[0.45]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Swimming Sea Creature representation */}
          <group position={[0, 0.6, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.2, 0.7, 16]} />
              <meshStandardMaterial color="#10B981" />
            </mesh>
          </group>
        </World3D>

        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            There is a lot of <SentenceSlot value={play.world.word} filled={!!play.world.word} /> life in the sea. Some of the creatures are strange.
          </p>
        </div>

        <Bay label="Oceanic Adjective Selector" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {words.map((w) => (
              <WordPill
                key={w}
                text={w}
                tone="sky"
                selected={play.world.word === w}
                onClick={() => play.set({ word: w })}
                disabled={play.locked}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

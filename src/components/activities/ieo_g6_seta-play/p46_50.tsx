"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { Trophy, Sparkles, Waves, Search, MessageSquare, Utensils, AlertTriangle } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — Absurd Bike Challenge (Achievers: 3 Marks · 'Preposterous')
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
      if (!w.adj) return { note: "Select the vocabulary expressing total absurdity" };
      const map: Record<string, string> = { preposterous: "A", durable: "B", laborious: "C", imbrue: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "preposterous" ? "Correct Achievers vocabulary: 'preposterous' means utterly absurd or ridiculous" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["preposterous", "durable", "laborious", "imbrue"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q46 · Achievers: Absurd Idea Challenge"
      subtitle="Identify the advanced adjective describing an utterly ridiculous and dangerous proposal"
      hints={["'Preposterous' means contrary to reason or common sense; utterly absurd."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Ground */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#FEF3C7" />
          </mesh>
          {/* Bicycle Frame representation */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.5, 0.1, 0.1]} />
            <meshStandardMaterial color="#2563EB" />
          </mesh>
          {/* Wheels */}
          <mesh position={[-0.7, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0.7, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Absurd Dog on Lap */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#92400E" />
          </mesh>
        </World3D>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-200/60 text-amber-900 text-xs font-bold font-mono mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Achievers Section · 3 Marks</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            Riding my bike with the dog on my lap. What a{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
            idea!
          </p>
        </div>

        <Bay label="Absurdity Adjective" tone="amber">
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
   Q47 — Hostel Shared Kitchen (Achievers: 3 Marks · 'Communal')
   Sentence: "I went to a hostel when I was in Europe and there was a ______ kitchen. It was strange to have to share it with other people we did not know."
   Options: A. corporal, B. considerate, C. communal, D. contentious -> Key: C (communal)
   ══════════════════════════════════════════════════════════════════════ */
export function Q47CommunalKitchenActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the vocabulary for shared community facilities" };
      const map: Record<string, string> = { corporal: "A", considerate: "B", communal: "C", contentious: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "communal" ? "Correct Achievers vocabulary: 'communal' means shared by all members of a group" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["corporal", "considerate", "communal", "contentious"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q47 · Achievers: Shared Hostel Kitchen"
      subtitle="Experience the concept of a shared facility used by multiple residents"
      hints={["A facility shared by members of a community or hostel guests is 'communal'."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Kitchen Floor */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
          {/* Shared Long Cooking Counter */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[2.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          {/* Multiple Cooking Stations */}
          <mesh position={[-0.8, 0.35, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
          <mesh position={[0.8, 0.35, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
        </World3D>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-200/60 text-amber-900 text-xs font-bold font-mono mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Achievers Section · 3 Marks</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I went to a hostel when I was in Europe and there was a{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
            kitchen. It was strange to have to share it with other people we did not know.
          </p>
        </div>

        <Bay label="Shared Facility Adjective" tone="amber">
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
   Q48 — Swimming Propulsion Lab (Achievers: 3 Marks · 'Propel')
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
      if (!w.verb) return { note: "Select the kinematic driving verb" };
      const map: Record<string, string> = { propel: "A", pith: "B", purport: "C", pester: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "propel" ? "Correct Achievers kinematic verb: 'propel' means to drive forward" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["propel", "pith", "purport", "pester"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q48 · Achievers: Hydrodynamic Propulsion"
      subtitle="Experience the physics of arm strokes generating forward thrust"
      hints={["'Propel' means to push, drive, or thrust someone or something forward."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Pool Water */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#06B6D4" transparent opacity={0.7} />
          </mesh>
          {/* Swimmer Figure representation */}
          <group position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.22, 1.2, 16]} />
              <meshStandardMaterial color="#FDBA74" />
            </mesh>
            {/* Extended arms creating thrust */}
            <mesh position={[0.4, 0.4, 0]} rotation={[0, 0, 0.6]}>
              <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
              <meshStandardMaterial color="#FDBA74" />
            </mesh>
          </group>
        </World3D>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-200/60 text-amber-900 text-xs font-bold font-mono mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Achievers Section · 3 Marks</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            When you swim, you can use your arms to{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            you forward.
          </p>
        </div>

        <Bay label="Forward Thrust Verb" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
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

/* ══════════════════════════════════════════════════════════════════════
   Q49 — Forensic Spelling Detective (Achievers: 3 Marks · 'Convalesence')
   Question: "Choose the word with the incorrect spelling."
   Options: A. Credulous, B. Convalesence, C. Contagious, D. Contemporary -> Key: B (Convalesence)
   ══════════════════════════════════════════════════════════════════════ */
export function Q49SpellingDetectiveActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string }>({
    question,
    initial: { selectedWord: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Inspect words in the forensic spelling scanner" };
      const map: Record<string, string> = { Credulous: "A", Convalesence: "B", Contagious: "C", Contemporary: "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note: w.selectedWord === "Convalesence" ? "Correct Achievers finding: 'Convalesence' is missing the second 'c' (correct: 'Convalescence')" : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["Credulous", "Convalesence", "Contagious", "Contemporary"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q49 · Achievers: Forensic Spelling Scanner"
      subtitle="Detect the advanced orthographic error in the Latinate word series"
      hints={["'Convalesence' is misspelled; it requires 'sc': 'Convalescence' (from Latin convalescere)."]}
    >
      <Board>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {words.map((w) => (
            <div
              key={w}
              onClick={() => !play.locked && play.set({ selectedWord: w })}
              className={`p-3 rounded-xl border text-center font-mono cursor-pointer transition-all ${
                play.world.selectedWord === w
                  ? "bg-amber-100 border-amber-400 text-amber-900 shadow-md ring-2 ring-amber-300"
                  : "bg-white border-slate-200 hover:border-amber-200 text-slate-800"
              }`}
            >
              <span className="text-xs font-bold block">{w}</span>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {w === "Convalesence" ? "⚠️ Missing 'c' Detected" : "✓ Lexicon Match"}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-200/60 text-amber-900 text-xs font-bold font-mono mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Achievers Section · 3 Marks</span>
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Detected Misspelling: <span className="font-mono font-bold text-amber-900">{play.world.selectedWord || "None"}</span>
          </p>
        </div>

        <Bay label="Identify Forensic Misspelling" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {words.map((w) => (
              <WordPill
                key={w}
                text={w}
                tone="amber"
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
   Q50 — Repaying a Favour (Achievers: 3 Marks · 'Don't be silly...')
   Dialogue: Joy: "How can I ever repay you?" / Mohit: "______"
   Options: A. Oh well, better luck next time., B. Well, I am not sure, but let me ask somebody., C. Don't be silly, it was nothing., D. What do you need? -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q50RepayingFavourActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ response?: string }>({
    question,
    initial: { response: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.response) return { note: "Select the pragmatic conversational response" };
      const map: Record<string, string> = {
        "Oh well, better luck next time.": "A",
        "Well, I am not sure, but let me ask somebody.": "B",
        "Don't be silly, it was nothing.": "C",
        "What do you need?": "D",
      };
      return {
        value: w.response,
        optionId: map[w.response],
        note: w.response?.includes("Don't be silly") ? "Correct Achievers pragmatic response: Humble, polite dismissal of a favour" : `Selected: ${w.response}`,
      };
    },
  });

  const responses = [
    "Oh well, better luck next time.",
    "Well, I am not sure, but let me ask somebody.",
    "Don't be silly, it was nothing.",
    "What do you need?",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q50 · Achievers: Pragmatic Social Dialogue"
      subtitle="Select the gracious and culturally appropriate response to expressed gratitude"
      hints={["'Don't be silly, it was nothing.' is the standard friendly English response dismissing excessive thanks for a favour."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <MessageSquare className="w-4 h-4 text-amber-700" />
            <span>Social Context: Acknowledging Gratitude for a Helpful Favour</span>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-200/60 text-amber-900 text-xs font-bold font-mono mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Achievers Section · 3 Marks</span>
          </div>
          <p className="text-sm font-semibold text-slate-800">Joy: "How can I ever repay you?"</p>
          <p className="text-sm sm:text-base font-bold text-amber-900 leading-relaxed">
            Mohit: "{play.world.response || "____________________"}"
          </p>
        </div>

        <Bay label="Pragmatic Response Selector" tone="amber">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
            {responses.map((r) => (
              <WordPill
                key={r}
                text={r}
                tone="amber"
                selected={play.world.response === r}
                onClick={() => play.set({ response: r })}
                disabled={play.locked}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

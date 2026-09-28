"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { Shield, Sparkles, MapPin, Truck, Home } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — 3D Beaver Body Scanner (Reading: Physical Feature)
   Question: "What is interesting about a beaver's appearance?"
   Options: A. They are very small., B. They are the biggest animal in South America., C. They have huge front teeth., D. They have thin tails. -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q31BeaverBodyScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ trait?: string }>({
    question,
    initial: { trait: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.trait) return { note: "Inspect beaver anatomy features" };
      const map: Record<string, string> = {
        "They are very small.": "A",
        "They are the biggest animal in South America.": "B",
        "They have huge front teeth.": "C",
        "They have thin tails.": "D",
      };
      return {
        value: w.trait,
        optionId: map[w.trait],
        note: w.trait?.includes("front teeth") ? "Correct: Beavers have prominent, continuously growing orange front incisors" : `Selected: ${w.trait}`,
      };
    },
  });

  const traits = [
    "They are very small.",
    "They are the biggest animal in South America.",
    "They have huge front teeth.",
    "They have thin tails.",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q31 · Beaver Anatomy Scanner"
      subtitle="Examine the distinctive biological adaptations of the beaver"
      hints={["The text highlights the large front teeth used for gnawing tree trunks and felling timber."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2, 4.5], fov: 45 }} height="260px">
          {/* Beaver Body */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.45, 1.2, 16]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
          {/* Broad Paddle Tail */}
          <mesh position={[0, -0.2, -0.8]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.5, 0.08, 0.7]} />
            <meshStandardMaterial color="#451A03" />
          </mesh>
          {/* Prominent Orange Incisor Teeth */}
          <mesh position={[0, 0.45, 0.4]}>
            <boxGeometry args={[0.15, 0.2, 0.1]} />
            <meshStandardMaterial color="#F97316" emissive="#EA580C" emissiveIntensity={0.5} />
          </mesh>
        </World3D>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Selected Trait: <span className="font-bold text-purple-900">{play.world.trait || "None"}</span>
          </p>
        </div>

        <Bay label="Physical Feature Selector" tone="purple">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
            {traits.map((t) => (
              <WordPill
                key={t}
                text={t}
                tone="purple"
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
   Q32 — South American Ecology (Reading: Impact)
   Question: "What was the outcome of transporting beavers to South America?"
   Options: A. They were hunted by wild animals., B. The business was successful., C. They adversely affected the environment., D. All of these -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q32SouthAmericanEcologyActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ outcome?: string }>({
    question,
    initial: { outcome: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.outcome) return { note: "Select the ecological impact in South America" };
      const map: Record<string, string> = {
        "They were hunted by wild animals.": "A",
        "The business was successful.": "B",
        "They adversely affected the environment.": "C",
        "All of these": "D",
      };
      return {
        value: w.outcome,
        optionId: map[w.outcome],
        note: w.outcome?.includes("adversely") ? "Correct: Overpopulation led to severe deforestation and flooding" : `Selected: ${w.outcome}`,
      };
    },
  });

  const outcomes = [
    "They were hunted by wild animals.",
    "The business was successful.",
    "They adversely affected the environment.",
    "All of these",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q32 · South American Ecosystem Impact"
      subtitle="Evaluate the ecological results of introducing beavers without natural predators"
      hints={["Without predators, their dams flooded vast forests and destroyed indigenous trees, adversely affecting the environment."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-amber-900">Ecosystem Audit: Tierra del Fuego Forest Flooding Assessment</span>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Assessed Outcome: <span className="font-bold text-purple-900">{play.world.outcome || "None"}</span>
          </p>
        </div>

        <Bay label="Ecological Result" tone="amber">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
            {outcomes.map((o) => (
              <WordPill
                key={o}
                text={o}
                tone="amber"
                selected={play.world.outcome === o}
                onClick={() => play.set({ outcome: o })}
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
   Q33 — 3D Dam Builder (Reading: Dam Purpose)
   Question: "Why do beavers make dams?"
   Options: A. To make their teeth more strong, B. They are too big to swim in rivers without dams., C. For protection and food, D. To live in the wild -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q33DamBuilderActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ purpose?: string }>({
    question,
    initial: { purpose: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.purpose) return { note: "Identify why beavers construct dams" };
      const map: Record<string, string> = {
        "To make their teeth more strong": "A",
        "They are too big to swim in rivers without dams.": "B",
        "For protection and food": "C",
        "To live in the wild": "D",
      };
      return {
        value: w.purpose,
        optionId: map[w.purpose],
        note: w.purpose === "For protection and food" ? "Correct: Dams create deep ponds protecting lodges from predators and storing winter branches" : `Selected: ${w.purpose}`,
      };
    },
  });

  const purposes = [
    "To make their teeth more strong",
    "They are too big to swim in rivers without dams.",
    "For protection and food",
    "To live in the wild",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q33 · Beaver Dam Engineering"
      subtitle="Construct the log dam and observe its defensive and nutritional functions"
      hints={["Dams create deep water ponds that protect lodges from predators like wolves and provide submerged caches for food."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Water Reservoir */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#0284C7" transparent opacity={0.8} />
          </mesh>
          {/* Timber Dam Wall */}
          <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[2.5, 0.4, 0.6]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
          {/* Beaver Lodge Dome */}
          <mesh position={[0.6, 0.1, -0.7]}>
            <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#5C2605" />
          </mesh>
        </World3D>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Primary Function: <span className="font-bold text-purple-900">{play.world.purpose || "None"}</span>
          </p>
        </div>

        <Bay label="Dam Construction Motive" tone="sky">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
            {purposes.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="sky"
                selected={play.world.purpose === p}
                onClick={() => play.set({ purpose: p })}
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
   Q34 — Moving Day Simulator (Section 4: Email / Contextual Vocabulary)
   Sentence: "How are you? I have ______ to a new house and I now live in Goa."
   Options: A. change, B. moved, C. calculated, D. paused -> Key: B (moved)
   ══════════════════════════════════════════════════════════════════════ */
export function Q34MovingDayActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the relocation verb" };
      const map: Record<string, string> = { change: "A", moved: "B", calculated: "C", paused: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "moved" ? "Correct Present Perfect relocation: 'I have moved'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["change", "moved", "calculated", "paused"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q34 · Moving Day in Goa"
      subtitle="Complete Sumi's relocation announcement in the opening email line"
      hints={["'have + moved to a new house' is the standard expression for changing one's residence."]}
    >
      <Board>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm">
            <Truck className="w-4 h-4 text-indigo-700" />
            <span>Sumi's Relocation Email · Destination: Goa</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            How are you? I have <SentenceSlot value={play.world.verb} filled={!!play.world.verb} /> to a new house and I now live in Goa.
          </p>
        </div>

        <Bay label="Relocation Verb Selector" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
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
   Q35 — Friendship Map (Email Vocabulary: 'Visit')
   Sentence: "This means I live much closer to you and I hope that you can ______ more often."
   Options: A. visit, B. travel, C. accommodate, D. borrow -> Key: A (visit)
   ══════════════════════════════════════════════════════════════════════ */
export function Q35FriendshipVisitsActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the friendship collocation verb" };
      const map: Record<string, string> = { visit: "A", travel: "B", accommodate: "C", borrow: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "visit" ? "Correct collocation: 'visit more often'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["visit", "travel", "accommodate", "borrow"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q35 · Friendship Visits Map"
      subtitle="Select the natural social verb for coming over to a friend's nearby home"
      hints={["When living closer to a friend, you hope they can come over and 'visit more often'."]}
    >
      <Board>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Proximity Status: Walking distance (5 mins) ➔ Frequent visits enabled</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            This means I live much closer to you and I hope that you can{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            more often.
          </p>
        </div>

        <Bay label="Social Verb Selector" tone="emerald">
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

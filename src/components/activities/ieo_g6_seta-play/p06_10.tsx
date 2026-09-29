"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Microscope,
  Binary,
  Compass,
  UtensilsCrossed,
  Theater,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  MicroscopyLab3D,
  IntelligenceRoom3D,
  HikingTrail3D,
  ItalianFood3D,
  DialogueTheatre3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — 🔬 3D Microscopy Lab
   Sentence: "The ______ size of the insect makes it very difficult to see without a magnifying glass."
   Options: A. nanometre, B. deliberating, C. platitude, D. minuscule -> Key: D (minuscule)
   ══════════════════════════════════════════════════════════════════════ */
export function Q06RestaurantTimelineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [zoomLevel, setZoomLevel] = useState(100);

  const play = usePlay<{ selectedWord?: string; zoom: number }>({
    question,
    initial: { selectedWord: undefined, zoom: 100 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Adjust microscope zoom and select the precise size adjective" };
      const map: Record<string, string> = {
        nanometre: "A",
        deliberating: "B",
        platitude: "C",
        minuscule: "D",
      };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note:
          w.selectedWord === "minuscule"
            ? "Semantically perfect: 'minuscule' is an adjective meaning extremely small or tiny."
            : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["nanometre", "deliberating", "platitude", "minuscule"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q6 · 🔬 3D Microscopy Lab"
      subtitle="Adjust the optical microscope focus and insert the adjective denoting extremely small size"
      hints={[
        "The sentence requires an adjective describing extreme smallness. 'Minuscule' means extremely small, whereas 'nanometre' is a noun unit of measurement.",
      ]}
    >
      <Board>
        {/* 3D Lab Simulation */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-cyan-300/80 bg-gradient-to-b from-slate-900 to-cyan-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-cyan-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-slate-900 shadow-xs">
                <Microscope className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider block">
                  Optical Lens & Specimen Turret
                </span>
                <span className="text-[11px] font-medium text-cyan-400">
                  Magnification: {zoomLevel}x · Specimen: Wing Scale Parasite
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[40, 100, 400].map((z) => (
                <button
                  key={z}
                  onClick={() => {
                    setZoomLevel(z);
                    play.patch({ zoom: z });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    zoomLevel === z
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-xs"
                      : "bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {z}x Lens
                </button>
              ))}
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.0, 3.6], fov: 45 }}>
            <MicroscopyLab3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-cyan-950/80 border-2 border-cyan-700 text-cyan-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            The{" "}
            <SentenceSlot value={play.world.selectedWord} filled={!!play.world.selectedWord} />{" "}
            size of the insect makes it very difficult to see without a magnifying glass.
          </p>
        </div>

        {/* Word Insertion Bay */}
        <Bay label="Vocabulary Size Descriptors" tone="cyan">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {words.map((w) => (
              <WordPill
                key={w}
                word={w}
                selected={play.world.selectedWord === w}
                onClick={() => play.patch({ selectedWord: w })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — 🕵️ 3D Intelligence Analysis Room
   Sentence: "It will be very difficult to persuade them to do anything ______ the information in this report."
   Options: A. across, B. in, C. with, D. on -> Key: C (with)
   ══════════════════════════════════════════════════════════════════════ */
export function Q07MagicBagActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [evidenceUnlocked, setEvidenceUnlocked] = useState(false);

  const play = usePlay<{ selectedPreposition?: string; reportParsed: boolean }>({
    question,
    initial: { selectedPreposition: undefined, reportParsed: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedPreposition) return { note: "Connect the report evidence on the holographic table and install the preposition" };
      const map: Record<string, string> = { across: "A", in: "B", with: "C", on: "D" };
      return {
        value: w.selectedPreposition,
        optionId: map[w.selectedPreposition],
        note:
          w.selectedPreposition === "with"
            ? "Idiomatic collocation: 'do anything with the information' is the natural English phrasing."
            : `Selected: ${w.selectedPreposition}`,
      };
    },
  });

  const preps = ["across", "in", "with", "on"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q7 · 🕵️ 3D Intelligence Analysis Room"
      subtitle="Examine the dossier on the holographic table and install the natural prepositional collocation"
      hints={[
        "The standard English idiom is 'to do something / anything WITH information'.",
      ]}
    >
      <Board>
        {/* 3D Command Intelligence Table */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-400/80 bg-gradient-to-b from-slate-950 to-indigo-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-indigo-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-xs">
                <Binary className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
                  Holographic Dossier Table
                </span>
                <span className="text-[11px] font-medium text-indigo-400">
                  Classified File: #ENG-REPORT-7
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setEvidenceUnlocked(!evidenceUnlocked);
                play.patch({ reportParsed: !evidenceUnlocked });
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {evidenceUnlocked ? "Evidence Nodes Linked" : "Link Hologram Evidence"}
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.4, 4.0], fov: 45 }}>
            <IntelligenceRoom3D position={[0, 0, 0]} />
            <Avatar3D position={[1.2, 0, 0]} pose="gesturing" shirtColor="#4F46E5" hairStyle="short" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-indigo-950/80 border-2 border-indigo-700 text-indigo-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            It will be very difficult to persuade them to do anything{" "}
            <SentenceSlot value={play.world.selectedPreposition} filled={!!play.world.selectedPreposition} />{" "}
            the information in this report.
          </p>
        </div>

        {/* Preposition Bay */}
        <Bay label="Prepositional Collocation Bay" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {preps.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedPreposition === p}
                onClick={() => play.patch({ selectedPreposition: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — 🥾 3D Mountain Walk
   Sentence: "I will be glad ______ this walk is finally over."
   Options: A. so, B. when, C. and, D. but -> Key: B (when)
   ══════════════════════════════════════════════════════════════════════ */
export function Q08MangoDetectiveActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedConjunction?: string; step: number }>({
    question,
    initial: { selectedConjunction: undefined, step: 3 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedConjunction) return { note: "Traverse the hiking trail to the finish gate and insert the time conjunction" };
      const map: Record<string, string> = { so: "A", when: "B", and: "C", but: "D" };
      return {
        value: w.selectedConjunction,
        optionId: map[w.selectedConjunction],
        note:
          w.selectedConjunction === "when"
            ? "Grammatically correct: 'when' introduces the time clause expressing future event completion."
            : `Selected: ${w.selectedConjunction}`,
      };
    },
  });

  const conjunctions = ["so", "when", "and", "but"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q8 · 🥾 3D Mountain Walk"
      subtitle="Complete the mountain trail progress and install the temporal conjunction"
      hints={[
        "The clause refers to a point in time when an ongoing activity concludes: 'glad WHEN this walk is finally over'.",
      ]}
    >
      <Board>
        {/* 3D Mountain Trail */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-lime-300/80 bg-gradient-to-b from-lime-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-lime-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-700 text-white shadow-xs">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Mountain Ridge Trail
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Progress: 9.8 km / 10.0 km · Approaching Finish Gate
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-lime-100 text-lime-900 border border-lime-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-700" /> Forest Path
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-lime-100 text-lime-900 border border-lime-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-700" /> Hill Ascent
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white border border-emerald-700 flex items-center gap-1 shadow-xs animate-pulse">
                Finish Gate
              </span>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.4, 4.0], fov: 45 }}>
            <HikingTrail3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="walking" shirtColor="#65A30D" hasBackpack backpackColor="#1E293B" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-lime-50/90 border-2 border-lime-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I will be glad{" "}
            <SentenceSlot value={play.world.selectedConjunction} filled={!!play.world.selectedConjunction} />{" "}
            this walk is finally over.
          </p>
        </div>

        {/* Conjunction Bay */}
        <Bay label="Temporal Conjunction Bay" tone="emerald">
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
   Q9 — 🍝 3D Italian Food Journey
   Sentence: "Edward ______ a lot of Italian food, hasn't he?"
   Options: A. will have eaten, B. eats, C. has eaten, D. will eat -> Key: C (has eaten)
   ══════════════════════════════════════════════════════════════════════ */
export function Q09HandwashingLabActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedTense?: string; foodLogged: boolean }>({
    question,
    initial: { selectedTense: undefined, foodLogged: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedTense) return { note: "Inspect Edward's food history log and match the tag question tense" };
      const map: Record<string, string> = {
        "will have eaten": "A",
        eats: "B",
        "has eaten": "C",
        "will eat": "D",
      };
      return {
        value: w.selectedTense,
        optionId: map[w.selectedTense],
        note:
          w.selectedTense === "has eaten"
            ? "Question tag rule: The tag 'hasn't he?' demands an affirmative Present Perfect main clause ('has eaten')."
            : `Selected: ${w.selectedTense}`,
      };
    },
  });

  const tenses = ["will have eaten", "eats", "has eaten", "will eat"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q9 · 🍝 3D Italian Food Journey"
      subtitle="Review the completed culinary history and match the question tag aspect"
      hints={[
        "The negative question tag 'hasn't he?' proves the main clause must use the affirmative auxiliary verb 'has eaten'.",
      ]}
    >
      <Board>
        {/* 3D Trattoria */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-orange-300/80 bg-gradient-to-b from-orange-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-orange-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
                <UtensilsCrossed className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Edward&apos;s Italian Food Journey
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Dishes Eaten: Margherita Pizza, Fettuccine, Risotto, Gelato
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
              Question Tag: <span className="text-red-700">..., hasn&apos;t he?</span>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <ItalianFood3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, -0.2]} pose="sitting_eating" shirtColor="#EA580C" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-orange-50/90 border-2 border-orange-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Edward{" "}
            <SentenceSlot value={play.world.selectedTense} filled={!!play.world.selectedTense} />{" "}
            a lot of Italian food, hasn&apos;t he?
          </p>
        </div>

        {/* Tense Bay */}
        <Bay label="Tense & Question Tag Matcher" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {tenses.map((t) => (
              <WordPill
                key={t}
                word={t}
                selected={play.world.selectedTense === t}
                onClick={() => play.patch({ selectedTense: t })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — 🎭 3D Dialogue Theatre
   Sentence: "“I want to go swimming ______ said Jenny."
   Options: A. “, B. ,”, C. .”, D. :” -> Key: B (,”)
   ══════════════════════════════════════════════════════════════════════ */
export function Q10GeographyDiscoveryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedPunctuation?: string; dialoguePerformed: boolean }>({
    question,
    initial: { selectedPunctuation: undefined, dialoguePerformed: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedPunctuation) return { note: "Attach the speech closure punctuation before the dialogue reporting verb" };
      const map: Record<string, string> = { "“": "A", ",”": "B", ".”": "C", ":”": "D" };
      return {
        value: w.selectedPunctuation,
        optionId: map[w.selectedPunctuation],
        note:
          w.selectedPunctuation === ",”"
            ? "Punctuation rule: Direct speech ending before a reporting tag takes a comma inside the quotation marks: 'swimming,' said Jenny."
            : `Selected: ${w.selectedPunctuation}`,
      };
    },
  });

  const puncs = ["“", ",”", ".”", ":”"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q10 · 🎭 3D Dialogue Theatre"
      subtitle="Direct Jenny's theatrical dialogue and install the direct speech closing punctuation"
      hints={[
        "In direct speech, when the quoted sentence continues with 'said Jenny', it ends with a comma inside the closing quotation marks: '...swimming,' said Jenny.",
      ]}
    >
      <Board>
        {/* 3D Stage Simulation */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-red-300/80 bg-gradient-to-b from-red-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-red-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                <Theater className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider block">
                  Theatrical Stage Performance
                </span>
                <span className="text-[11px] font-medium text-red-400">
                  Jenny&apos;s Line Delivery
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-red-900/80 border border-red-700 text-red-100">
              Speaker: Jenny
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 4.0], fov: 45 }}>
            <DialogueTheatre3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0]} pose="gesturing" shirtColor="#DC2626" hairStyle="ponytail" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-red-950/80 border-2 border-red-700 text-red-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            &ldquo;I want to go swimming
            <span className="inline-block mx-1.5 px-3 py-1 rounded-lg bg-red-600 text-white font-mono text-xl shadow-inner border border-red-400">
              {play.world.selectedPunctuation || "___"}
            </span>{" "}
            said Jenny.
          </p>
        </div>

        {/* Punctuation Bay */}
        <Bay label="Punctuation Mechanism Bay" tone="rose">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {puncs.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedPunctuation === p}
                onClick={() => play.patch({ selectedPunctuation: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  AlertTriangle,
  Globe2,
  SearchCheck,
  FileSearch,
  HeartCrack,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  LanguageGlobe3D,
  LexicalVault3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — 🚙 3D Mountain Road Reconnaissance
   Sentence: "The road up that mountain is ______ because of the dangerous holes in it."
   Options: A. innocuous, B. intrepid, C. brave, D. notorious -> Key: D (notorious)
   ══════════════════════════════════════════════════════════════════════ */
export function Q21ArtStudioActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string; hazardInspected: boolean }>({
    question,
    initial: { selectedWord: undefined, hazardInspected: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Inspect the mountain road hazard markers and select the descriptive adjective" };
      const map: Record<string, string> = {
        innocuous: "A",
        intrepid: "B",
        brave: "C",
        notorious: "D",
      };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note:
          w.selectedWord === "notorious"
            ? "Vocabulary meaning: 'notorious' means famous or well known for something bad or dangerous."
            : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["innocuous", "intrepid", "brave", "notorious"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q21 · 🚙 3D Mountain Road Reconnaissance"
      subtitle="Examine the dangerous road conditions and install the adjective 'notorious'"
      hints={[
        "'Notorious' means widely known for negative qualities or dangers (such as hazardous potholes).",
      ]}
    >
      <Board>
        {/* 3D Mountain Reconnaissance */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-red-300/80 bg-gradient-to-b from-red-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-red-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider block">
                  Mountain Pass Reconnaissance
                </span>
                <span className="text-[11px] font-medium text-red-400">
                  Hazards: Deep Potholes, Landslides · Reputation: Infamous
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#DC2626" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-red-950/80 border-2 border-red-700 text-red-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            The road up that mountain is{" "}
            <SentenceSlot value={play.world.selectedWord} filled={!!play.world.selectedWord} />{" "}
            because of the dangerous holes in it.
          </p>
        </div>

        {/* Word Bay */}
        <Bay label="Evaluative Adjective Bay" tone="rose">
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
   Q22 — 🌍 3D Family Journey Map
   Sentence: "I am not from here originally; my family are ______."
   Options: A. absurd, B. immigrants, C. forfeit, D. bribed -> Key: B (immigrants)
   ══════════════════════════════════════════════════════════════════════ */
export function Q22CakeRegretActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedNoun?: string; globeRotated: boolean }>({
    question,
    initial: { selectedNoun: undefined, globeRotated: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedNoun) return { note: "Trace the cross-border relocation journey and install the collective noun" };
      const map: Record<string, string> = {
        absurd: "A",
        immigrants: "B",
        forfeit: "C",
        bribed: "D",
      };
      return {
        value: w.selectedNoun,
        optionId: map[w.selectedNoun],
        note:
          w.selectedNoun === "immigrants"
            ? "Demographic noun: 'immigrants' refers to people who come to live permanently in a foreign country."
            : `Selected: ${w.selectedNoun}`,
      };
    },
  });

  const nouns = ["absurd", "immigrants", "forfeit", "bribed"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q22 · 🌍 3D Family Journey Map"
      subtitle="Trace the family migration trajectory across the 3D globe and choose 'immigrants'"
      hints={[
        "People who move from their original country to settle permanently in another are called 'immigrants'.",
      ]}
    >
      <Board>
        {/* 3D Migration Globe */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-blue-300/80 bg-gradient-to-b from-blue-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-blue-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white shadow-xs">
                <Globe2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">
                  Global Migration Trajectory
                </span>
                <span className="text-[11px] font-medium text-blue-400">
                  Origin Country → Relocation Route → New Permanent Home
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LanguageGlobe3D position={[0, 0, 0]} />
            <Avatar3D position={[0.9, 0, 0.2]} pose="standing" shirtColor="#0284C7" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-blue-950/80 border-2 border-blue-700 text-blue-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            I am not from here originally; my family are{" "}
            <SentenceSlot value={play.world.selectedNoun} filled={!!play.world.selectedNoun} />.
          </p>
        </div>

        {/* Noun Bay */}
        <Bay label="Demographic Collective Noun Bay" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {nouns.map((n) => (
              <WordPill
                key={n}
                word={n}
                selected={play.world.selectedNoun === n}
                onClick={() => play.patch({ selectedNoun: n })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q23 — 🕵️ 3D Grammar Crime Scene
   Sentence: "The shops doors closed, and the owner left through the small back door. Choose the part containing the error."
   Options: A. The shops doors, B. closed, and the owner, C. left through the small, D. back door. -> Key: A
   ══════════════════════════════════════════════════════════════════════ */
export function Q23QuietSoundActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedSegment?: string; proofreadDone: boolean }>({
    question,
    initial: { selectedSegment: undefined, proofreadDone: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedSegment) return { note: "Scan the storefront sentence segments to isolate the grammatical error" };
      const map: Record<string, string> = {
        "The shops doors": "A",
        "closed, and the owner": "B",
        "left through the small": "C",
        "back door.": "D",
      };
      return {
        value: w.selectedSegment,
        optionId: map[w.selectedSegment],
        note:
          w.selectedSegment === "The shops doors"
            ? "Error identified: Missing possessive apostrophe. Correct form is 'The shop's doors' (or 'shop doors')."
            : `Selected segment: ${w.selectedSegment}`,
      };
    },
  });

  const segments = [
    "The shops doors",
    "closed, and the owner",
    "left through the small",
    "back door.",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q23 · 🕵️ 3D Grammar Crime Scene"
      subtitle="Inspect the shop sign and isolate the erroneous segment missing the possessive form"
      hints={[
        "The plural 'shops doors' without an apostrophe is an error; it should be possessive singular 'shop's doors'.",
      ]}
    >
      <Board>
        {/* 3D Store Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-xs">
                <SearchCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
                  Proofreading Scanner · Crime Scene
                </span>
                <span className="text-[11px] font-medium text-amber-400">
                  Target: Segment Containing Grammatical Error
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#D97706" />
          </World3D>
        </div>

        {/* Live Segment Highlighter */}
        <div className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            <span className="text-slate-400 text-xs block mb-1">Selected Error Segment:</span>
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono text-base font-bold shadow-xs inline-block">
              {play.world.selectedSegment || "No segment highlighted yet"}
            </span>
          </p>
        </div>

        {/* Segment Bay */}
        <Bay label="Isolate Error Segment" tone="amber">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {segments.map((seg, i) => (
              <button
                key={seg}
                onClick={() => play.patch({ selectedSegment: seg })}
                className={`p-3 rounded-xl border text-left font-bold text-sm transition-all ${
                  play.world.selectedSegment === seg
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-300"
                    : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750"
                }`}
              >
                <span className="text-xs font-mono text-amber-300 mr-2">[{String.fromCharCode(65 + i)}]</span>
                {seg}
              </button>
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q24 — 🏠 3D Address Investigation
   Sentence: "It's taken me a long time to find out for definite exact whose house this is. Choose the part containing the error."
   Options: A. It's taken me a long time, B. to find out, C. for definite exact, D. whose house this is. -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q24SchoolDisciplineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedSegment?: string; addressChecked: boolean }>({
    question,
    initial: { selectedSegment: undefined, addressChecked: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedSegment) return { note: "Inspect the address records and highlight the redundant segment" };
      const map: Record<string, string> = {
        "It's taken me a long time": "A",
        "to find out": "B",
        "for definite exact": "C",
        "whose house this is.": "D",
      };
      return {
        value: w.selectedSegment,
        optionId: map[w.selectedSegment],
        note:
          w.selectedSegment === "for definite exact"
            ? "Error identified: Redundant double modifier. Correct phrasing is 'for definite' or 'for exact'."
            : `Selected segment: ${w.selectedSegment}`,
      };
    },
  });

  const segments = [
    "It's taken me a long time",
    "to find out",
    "for definite exact",
    "whose house this is.",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q24 · 🏠 3D Address Investigation"
      subtitle="Isolate the redundant adverbial phrase segment 'for definite exact'"
      hints={[
        "The phrase 'for definite exact' combines two synonymous terms incorrectly; only one modifier should be used.",
      ]}
    >
      <Board>
        {/* 3D Neighborhood Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-300/80 bg-gradient-to-b from-purple-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-purple-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500 text-white shadow-xs">
                <FileSearch className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-200 uppercase tracking-wider block">
                  Detective Address Ledger
                </span>
                <span className="text-[11px] font-medium text-purple-400">
                  Target: Redundant Clashing Modifiers
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#9333EA" />
          </World3D>
        </div>

        {/* Live Sentence Segment Slot */}
        <div className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            <span className="text-slate-400 text-xs block mb-1">Selected Error Segment:</span>
            <span className="px-3 py-1 rounded-lg bg-purple-500 text-white font-mono text-base font-bold shadow-xs inline-block">
              {play.world.selectedSegment || "No segment highlighted yet"}
            </span>
          </p>
        </div>

        {/* Segment Bay */}
        <Bay label="Select Redundant Segment" tone="purple">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {segments.map((seg, i) => (
              <button
                key={seg}
                onClick={() => play.patch({ selectedSegment: seg })}
                className={`p-3 rounded-xl border text-left font-bold text-sm transition-all ${
                  play.world.selectedSegment === seg
                    ? "bg-purple-600 text-white border-purple-400 shadow-md ring-2 ring-purple-300"
                    : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750"
                }`}
              >
                <span className="text-xs font-mono text-purple-300 mr-2">[{String.fromCharCode(65 + i)}]</span>
                {seg}
              </button>
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q25 — ❤️🔥 3D Emotion Laboratory (Synonym of Despise)
   Question: "Choose the correct synonym of Despise."
   Options: A. Hate, B. Like, C. Crave, D. Devour -> Key: A (Hate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q25MarineCreaturesActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedSynonym?: string; emotionAnalyzed: boolean }>({
    question,
    initial: { selectedSynonym: undefined, emotionAnalyzed: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedSynonym) return { note: "Scan the affective reaction chamber and select the synonym of 'Despise'" };
      const map: Record<string, string> = { Hate: "A", Like: "B", Crave: "C", Devour: "D" };
      return {
        value: w.selectedSynonym,
        optionId: map[w.selectedSynonym],
        note:
          w.selectedSynonym === "Hate"
            ? "Synonym match: 'Despise' means to feel intense contempt, hatred, or deep dislike for someone/something."
            : `Selected synonym: ${w.selectedSynonym}`,
      };
    },
  });

  const synonyms = ["Hate", "Like", "Crave", "Devour"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q25 · ❤️🔥 3D Emotion Laboratory"
      subtitle="Examine emotional biometric response states and identify the synonym of 'Despise'"
      hints={[
        "'Despise' is a strong verb meaning to feel intense dislike or contempt for something ('Hate').",
      ]}
    >
      <Board>
        {/* 3D Emotion Chamber */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-300/80 bg-gradient-to-b from-rose-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-rose-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <HeartCrack className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-200 uppercase tracking-wider block">
                  Affective Biometric Scanner
                </span>
                <span className="text-[11px] font-medium text-rose-400">
                  Target Word: DESPISE (Strong Contempt & Aversion)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#E11D48" expression="worried" />
          </World3D>
        </div>

        {/* Live Synonym Slot */}
        <div className="bg-rose-950/80 border-2 border-rose-700 text-rose-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Synonym of <span className="text-rose-400 font-mono underline">Despise</span> ={" "}
            <SentenceSlot value={play.world.selectedSynonym} filled={!!play.world.selectedSynonym} />
          </p>
        </div>

        {/* Synonym Bay */}
        <Bay label="Synonym Selection Bay" tone="rose">
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

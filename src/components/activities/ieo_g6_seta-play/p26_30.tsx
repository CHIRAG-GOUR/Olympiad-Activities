"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Sparkles,
  Shield,
  Trees,
  KeyRound,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react";
import {
  CommunalKitchen3D,
  LexicalVault3D,
  SuburbanGarden3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q26 — 🧼 3D Hygiene Inspection (Synonym of Sanitary)
   Question: "Choose the correct synonym of Sanitary."
   Options: A. Expensive, B. Pretty, C. Clean, D. New -> Key: C (Clean)
   ══════════════════════════════════════════════════════════════════════ */
export function Q26SpellingInspectorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedSynonym?: string; inspectionDone: boolean }>({
    question,
    initial: { selectedSynonym: undefined, inspectionDone: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedSynonym) return { note: "Inspect commercial kitchen surface hygiene and select the synonym of 'Sanitary'" };
      const map: Record<string, string> = { Expensive: "A", Pretty: "B", Clean: "C", New: "D" };
      return {
        value: w.selectedSynonym,
        optionId: map[w.selectedSynonym],
        note:
          w.selectedSynonym === "Clean"
            ? "Synonym match: 'Sanitary' relates to cleanliness and public health, synonymous with 'Clean'."
            : `Selected synonym: ${w.selectedSynonym}`,
      };
    },
  });

  const synonyms = ["Expensive", "Pretty", "Clean", "New"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q26 · 🧼 3D Hygiene Inspection"
      subtitle="Inspect restaurant surfaces for hygiene standards and pair 'Sanitary' with 'Clean'"
      hints={[
        "'Sanitary' means clean, hygienic, and free from dirt, infection, or bacteria ('Clean').",
      ]}
    >
      <Board>
        {/* 3D Commercial Kitchen */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-xs">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
                  Public Health Hygiene Audit
                </span>
                <span className="text-[11px] font-medium text-emerald-400">
                  Target Word: SANITARY (Hygienic, Disinfected & Free from Germs)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <CommunalKitchen3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#10B981" />
          </World3D>
        </div>

        {/* Live Synonym Slot */}
        <div className="bg-emerald-950/80 border-2 border-emerald-700 text-emerald-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Synonym of <span className="text-emerald-400 font-mono underline">Sanitary</span> ={" "}
            <SentenceSlot value={play.world.selectedSynonym} filled={!!play.world.selectedSynonym} />
          </p>
        </div>

        {/* Synonym Bay */}
        <Bay label="Synonym Selection Bay" tone="emerald">
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
   Q27 — 🚧 3D Safety Rescue (Antonym of Peril)
   Question: "Choose the correct antonym of Peril."
   Options: A. Beautiful, B. Safety, C. Upside-down, D. Ecstasy -> Key: B (Safety)
   ══════════════════════════════════════════════════════════════════════ */
export function Q27PassageTitleActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedAntonym?: string; hazardNavigated: boolean }>({
    question,
    initial: { selectedAntonym: undefined, hazardNavigated: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAntonym) return { note: "Navigate from hazard into the safety bunker and select the antonym of 'Peril'" };
      const map: Record<string, string> = { Beautiful: "A", Safety: "B", "Upside-down": "C", Ecstasy: "D" };
      return {
        value: w.selectedAntonym,
        optionId: map[w.selectedAntonym],
        note:
          w.selectedAntonym === "Safety"
            ? "Antonym match: 'Peril' means serious and immediate danger; its true opposite is 'Safety'."
            : `Selected antonym: ${w.selectedAntonym}`,
      };
    },
  });

  const antonyms = ["Beautiful", "Safety", "Upside-down", "Ecstasy"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q27 · 🚧 3D Safety Rescue"
      subtitle="Rescue the character from dangerous hazards into the safe zone and choose 'Safety'"
      hints={[
        "'Peril' means extreme danger or risk; the exact antonym is 'Safety'.",
      ]}
    >
      <Board>
        {/* 3D Hazard to Safety Course */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
                  Hazard Escape Course
                </span>
                <span className="text-[11px] font-medium text-emerald-400">
                  Contrast: Peril (Danger Zone) ↔ Safety (Protected Zone)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#059669" />
          </World3D>
        </div>

        {/* Live Antonym Slot */}
        <div className="bg-emerald-950/80 border-2 border-emerald-700 text-emerald-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Antonym of <span className="text-red-400 font-mono underline">Peril</span> ={" "}
            <SentenceSlot value={play.world.selectedAntonym} filled={!!play.world.selectedAntonym} />
          </p>
        </div>

        {/* Antonym Bay */}
        <Bay label="Antonym Selection Bay" tone="emerald">
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
   Q28 — 🌳 3D Ecosystem Transformation (Antonym of Lush)
   Question: "Choose the correct antonym of Lush."
   Options: A. Ancient, B. Fancy, C. Enclosed, D. Barren -> Key: D (Barren)
   ══════════════════════════════════════════════════════════════════════ */
export function Q28HistoricalTimelineActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [terrainState, setTerrainState] = useState<"Lush" | "Barren">("Barren");

  const play = usePlay<{ selectedAntonym?: string; state: string }>({
    question,
    initial: { selectedAntonym: undefined, state: "Barren" },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAntonym) return { note: "Transform the terrain environment and choose the antonym of 'Lush'" };
      const map: Record<string, string> = { Ancient: "A", Fancy: "B", Enclosed: "C", Barren: "D" };
      return {
        value: w.selectedAntonym,
        optionId: map[w.selectedAntonym],
        note:
          w.selectedAntonym === "Barren"
            ? "Antonym match: 'Lush' means abundant, thriving vegetation; 'Barren' means devoid of plant life or growth."
            : `Selected antonym: ${w.selectedAntonym}`,
      };
    },
  });

  const antonyms = ["Ancient", "Fancy", "Enclosed", "Barren"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q28 · 🌳 3D Ecosystem Transformation"
      subtitle="Shift the environment from verdant flora to bleak arid landscape and select 'Barren'"
      hints={[
        "'Lush' refers to rich, fertile, green plant growth. The exact opposite is 'Barren' (dry, empty, lifeless).",
      ]}
    >
      <Board>
        {/* 3D Ecosystem */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-lime-300/80 bg-gradient-to-b from-stone-900 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-stone-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-600 text-white shadow-xs">
                <Trees className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-lime-200 uppercase tracking-wider block">
                  Ecosystem State Monitor
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Condition: {terrainState} Landscape
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const next = terrainState === "Lush" ? "Barren" : "Lush";
                setTerrainState(next);
                play.patch({ state: next });
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-lime-700 hover:bg-lime-600 text-white transition-all"
            >
              Toggle: {terrainState === "Lush" ? "Dry Out" : "Fertilize"}
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <SuburbanGarden3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Live Antonym Slot */}
        <div className="bg-stone-900 border-2 border-stone-700 text-stone-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Antonym of <span className="text-lime-400 font-mono underline">Lush</span> ={" "}
            <SentenceSlot value={play.world.selectedAntonym} filled={!!play.world.selectedAntonym} />
          </p>
        </div>

        {/* Antonym Bay */}
        <Bay label="Antonym Selection Bay" tone="slate">
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
   Q29 — 🔤 3D Spelling Escape Room (Claustrophobia)
   Question: "What is the spelling of this word that means ‘to be afraid of small spaces’?"
   Options: A. Claustrophobia, B. Clostraphobia, C. Clostrefobia, D. Claustrephobia -> Key: A
   ══════════════════════════════════════════════════════════════════════ */
export function Q29EuropeanRewildingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedSpelling?: string; roomUnlocked: boolean }>({
    question,
    initial: { selectedSpelling: undefined, roomUnlocked: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedSpelling) return { note: "Assemble the letters C-L-A-U-S-T-R-O-P-H-O-B-I-A to unlock the escape room" };
      const map: Record<string, string> = {
        Claustrophobia: "A",
        Clostraphobia: "B",
        Clostrefobia: "C",
        Claustrephobia: "D",
      };
      return {
        value: w.selectedSpelling,
        optionId: map[w.selectedSpelling],
        note:
          w.selectedSpelling === "Claustrophobia"
            ? "Correct spelling: 'Claustrophobia' (claustro- + -phobia)."
            : `Selected spelling: ${w.selectedSpelling}`,
      };
    },
  });

  const spellings = [
    "Claustrophobia",
    "Clostraphobia",
    "Clostrefobia",
    "Claustrephobia",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q29 · 🔤 3D Spelling Escape Room"
      subtitle="Reconstruct the term for fear of enclosed small spaces to unlock the escape chamber"
      hints={[
        "The standard root is Latin 'claustrum' (enclosed space) + 'phobia' (fear) = 'Claustrophobia'.",
      ]}
    >
      <Board>
        {/* 3D Escape Room */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-300/80 bg-gradient-to-b from-purple-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-purple-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <KeyRound className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-200 uppercase tracking-wider block">
                  Enclosed Chamber Escape Console
                </span>
                <span className="text-[11px] font-medium text-purple-400">
                  Definition: Fear of small, enclosed spaces
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-purple-900/80 border border-purple-700">
              {play.world.selectedSpelling === "Claustrophobia" ? (
                <span className="text-emerald-400 flex items-center gap-1"><Unlock className="w-3.5 h-3.5" /> Chamber Unlocked</span>
              ) : (
                <span className="text-purple-300 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Door Locked</span>
              )}
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#7E22CE" expression="worried" />
          </World3D>
        </div>

        {/* Live Spelling Slot */}
        <div className="bg-purple-950/80 border-2 border-purple-700 text-purple-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Correct Spelling ={" "}
            <SentenceSlot value={play.world.selectedSpelling} filled={!!play.world.selectedSpelling} />
          </p>
        </div>

        {/* Spelling Bay */}
        <Bay label="Spelling Variant Tiles" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {spellings.map((sp) => (
              <WordPill
                key={sp}
                word={sp}
                selected={play.world.selectedSpelling === sp}
                onClick={() => play.patch({ selectedSpelling: sp })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q30 — 🔥 3D Problem Escalation Lab (Exacerbate)
   Question: "What is the spelling of the word that means ‘to make things worse’?"
   Options: A. Exsasarbate, B. Execerbate, C. Exacerbate, D. Exacerbate -> Key: D (Exacerbate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q30FurHuntingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedSpelling?: string; problemEscalated: boolean }>({
    question,
    initial: { selectedSpelling: undefined, problemEscalated: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedSpelling) return { note: "Assemble the letters E-X-A-C-E-R-B-A-T-E for 'to make things worse'" };
      const map: Record<string, string> = {
        Exsasarbate: "A",
        Execerbate: "B",
        Exacerbate: "D",
      };
      return {
        value: w.selectedSpelling,
        optionId: map[w.selectedSpelling] || "D",
        note:
          w.selectedSpelling === "Exacerbate"
            ? "Correct spelling: 'Exacerbate' (ex- + acerbus, meaning to make a problem or bad situation worse)."
            : `Selected spelling: ${w.selectedSpelling}`,
      };
    },
  });

  const spellings = [
    "Exsasarbate",
    "Execerbate",
    "Exacerbate",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q30 · 🔥 3D Problem Escalation Lab"
      subtitle="Assemble the correct spelling for the word meaning 'to make things worse'"
      hints={[
        "The correct spelling is 'E-X-A-C-E-R-B-A-T-E' (from Latin 'acerbus', harsh or bitter).",
      ]}
    >
      <Board>
        {/* 3D Malfunction Lab */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-red-300/80 bg-gradient-to-b from-red-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-red-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                <AlertOctagon className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider block">
                  Problem Escalation Laboratory
                </span>
                <span className="text-[11px] font-medium text-red-400">
                  Definition: To make a situation, problem, or pain worse
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#EF4444" />
          </World3D>
        </div>

        {/* Live Spelling Slot */}
        <div className="bg-red-950/80 border-2 border-red-700 text-red-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Correct Spelling ={" "}
            <SentenceSlot value={play.world.selectedSpelling} filled={!!play.world.selectedSpelling} />
          </p>
        </div>

        {/* Spelling Bay */}
        <Bay label="Spelling Variant Tiles" tone="rose">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {spellings.map((sp) => (
              <WordPill
                key={sp}
                word={sp}
                selected={play.world.selectedSpelling === sp}
                onClick={() => play.patch({ selectedSpelling: sp })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

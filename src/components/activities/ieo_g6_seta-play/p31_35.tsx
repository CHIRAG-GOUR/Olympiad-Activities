"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Castle,
  DollarSign,
  Wind,
  Droplets,
  Maximize2,
  BookOpen,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  GoaVilla3D,
  VillaVerandah3D,
  SuburbanGarden3D,
  Avatar3D,
} from "./components3D";
import { IEO_READING_PASSAGE_DREAM_HOUSE } from "@/data/ieo_g6_seta";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — 🏰 3D Dream Home Builder (Passage Title)
   Question: "Choose the best title or heading for the passage."
   Options: A. The House I Live In, B. Ideal Home, C. A Castle for a King, D. Watery Living -> Key: B
   ══════════════════════════════════════════════════════════════════════ */
export function Q31BeaverAnatomyActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [showPassage, setShowPassage] = useState(false);

  const play = usePlay<{ selectedTitle?: string; houseConstructed: boolean }>({
    question,
    initial: { selectedTitle: undefined, houseConstructed: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedTitle) return { note: "Review the architectural passage and select the comprehensive title" };
      const map: Record<string, string> = {
        "The House I Live In": "A",
        "Ideal Home": "B",
        "A Castle for a King": "C",
        "Watery Living": "D",
      };
      return {
        value: w.selectedTitle,
        optionId: map[w.selectedTitle],
        note:
          w.selectedTitle === "Ideal Home"
            ? "Central theme: The passage describes the writer's hypothetical dream castle ('Ideal Home')."
            : `Selected title: ${w.selectedTitle}`,
      };
    },
  });

  const titles = [
    "The House I Live In",
    "Ideal Home",
    "A Castle for a King",
    "Watery Living",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q31 · 🏰 3D Dream Home Builder"
      subtitle="Synthesize the architectural vision and select the optimal passage title"
      hints={[
        "The author imagines their personal dream residence, making 'Ideal Home' the most accurate and encompassing title.",
      ]}
    >
      <Board>
        {/* 3D Dream Villa */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Castle className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Coastal Dream Castle Simulator
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Features: Stone Walls, Solar Arrays, Sea Views, Retractable Roof
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowPassage(!showPassage)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 transition-all flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {showPassage ? "Hide Passage" : "Read Passage"}
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <GoaVilla3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#059669" />
          </World3D>

          {showPassage && (
            <div className="p-4 bg-emerald-950 text-emerald-100 border-t border-emerald-800 text-xs leading-relaxed max-h-48 overflow-y-auto">
              <h4 className="font-bold text-emerald-300 text-sm mb-1.5">Passage 1: Dream House</h4>
              <p className="whitespace-pre-line text-emerald-200">{IEO_READING_PASSAGE_DREAM_HOUSE}</p>
            </div>
          )}
        </div>

        {/* Live Title Slot */}
        <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Passage Title ={" "}
            <SentenceSlot value={play.world.selectedTitle} filled={!!play.world.selectedTitle} />
          </p>
        </div>

        {/* Title Bay */}
        <Bay label="Passage Title Selection Bay" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {titles.map((t) => (
              <WordPill
                key={t}
                word={t}
                selected={play.world.selectedTitle === t}
                onClick={() => play.patch({ selectedTitle: t })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q32 — 🌊 3D Real-Estate Budget Simulator
   Question: "What is the problem of buying a house with a sea view?"
   Options: A. The cost, B. The wind, C. The smell, D. The windows -> Key: A (The cost)
   ══════════════════════════════════════════════════════════════════════ */
export function Q32PatagoniaEcoImpactActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedProblem?: string; pricesCompared: boolean }>({
    question,
    initial: { selectedProblem: undefined, pricesCompared: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedProblem) return { note: "Compare coastal property prices and identify the main obstacle" };
      const map: Record<string, string> = {
        "The cost": "A",
        "The wind": "B",
        "The smell": "C",
        "The windows": "D",
      };
      return {
        value: w.selectedProblem,
        optionId: map[w.selectedProblem],
        note:
          w.selectedProblem === "The cost"
            ? "Textual evidence: The passage explicitly states that the astronomical purchase cost is the greatest hurdle."
            : `Selected: ${w.selectedProblem}`,
      };
    },
  });

  const problems = ["The cost", "The wind", "The smell", "The windows"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q32 · 🌊 3D Real-Estate Budget Simulator"
      subtitle="Examine coastal real estate price tags and identify 'The cost' as the major obstacle"
      hints={[
        "Paragraph 1 notes that the astronomical financial purchase cost is the main hurdle in owning coastal property.",
      ]}
    >
      <Board>
        {/* 3D Real Estate Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Coastal Property Price Evaluation
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Sea View Villa: $4,850,000 · Inland Home: $450,000 (10x Hurdle)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <VillaVerandah3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#D97706" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Main Problem with Sea View Property ={" "}
            <SentenceSlot value={play.world.selectedProblem} filled={!!play.world.selectedProblem} />
          </p>
        </div>

        {/* Problem Bay */}
        <Bay label="Property Obstacle Bay" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {problems.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedProblem === p}
                onClick={() => play.patch({ selectedProblem: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q33 — 🌬️ 3D Renewable Energy Simulator
   Question: "The writer wants wind turbines for the house to ______."
   Options: A. save the wind, B. make a nice noise, C. look like Holland, D. protect nature -> Key: D
   ══════════════════════════════════════════════════════════════════════ */
export function Q33DamFunctionActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedReason?: string; turbinesActive: boolean }>({
    question,
    initial: { selectedReason: undefined, turbinesActive: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedReason) return { note: "Activate clean wind energy and determine the writer's goal" };
      const map: Record<string, string> = {
        "save the wind": "A",
        "make a nice noise": "B",
        "look like Holland": "C",
        "protect nature": "D",
      };
      return {
        value: w.selectedReason,
        optionId: map[w.selectedReason],
        note:
          w.selectedReason === "protect nature"
            ? "Passage purpose: Wind turbines and solar panels are installed to minimize carbon footprint and protect nature."
            : `Selected reason: ${w.selectedReason}`,
      };
    },
  });

  const reasons = [
    "save the wind",
    "make a nice noise",
    "look like Holland",
    "protect nature",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q33 · 🌬️ 3D Renewable Energy Simulator"
      subtitle="Install wind turbines and solar panels to minimize emissions and 'protect nature'"
      hints={[
        "Paragraph 2 states that renewable energy is used to reduce the carbon footprint and 'protect nature'.",
      ]}
    >
      <Board>
        {/* 3D Renewable Energy */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-teal-300/80 bg-gradient-to-b from-teal-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-teal-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                <Wind className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Green Energy Generation Dashboard
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Clean Electricity: 100% Zero Emissions · Goal: Environmental Protection
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <GoaVilla3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#0D9488" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-teal-50/90 border-2 border-teal-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            The writer wants wind turbines for the house to{" "}
            <SentenceSlot value={play.world.selectedReason} filled={!!play.world.selectedReason} />.
          </p>
        </div>

        {/* Reason Bay */}
        <Bay label="Energy Purpose Bay" tone="teal">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {reasons.map((r) => (
              <WordPill
                key={r}
                word={r}
                selected={play.world.selectedReason === r}
                onClick={() => play.patch({ selectedReason: r })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q34 — 🌿 3D Garden Construction
   Question: "What will the special feature of the garden be?"
   Options: A. The flowers, B. The rocks, C. The water body, D. The trees -> Key: C (The water body)
   ══════════════════════════════════════════════════════════════════════ */
export function Q34GoaRelocationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedFeature?: string; gardenBuilt: boolean }>({
    question,
    initial: { selectedFeature: undefined, gardenBuilt: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedFeature) return { note: "Inspect the atrium garden features and select the central element" };
      const map: Record<string, string> = {
        "The flowers": "A",
        "The rocks": "B",
        "The water body": "C",
        "The trees": "D",
      };
      return {
        value: w.selectedFeature,
        optionId: map[w.selectedFeature],
        note:
          w.selectedFeature === "The water body"
            ? "Passage detail: The central special feature is the cascading, expansive water body and koi streams."
            : `Selected feature: ${w.selectedFeature}`,
      };
    },
  });

  const features = ["The flowers", "The rocks", "The water body", "The trees"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q34 · 🌿 3D Garden Construction"
      subtitle="Examine the indoor-outdoor atrium and identify 'The water body' as the centerpiece"
      hints={[
        "Paragraph 3 highlights an indoor-outdoor botanical garden centered around an expansive cascading water body.",
      ]}
    >
      <Board>
        {/* 3D Atrium Garden */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-cyan-300/80 bg-gradient-to-b from-cyan-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-cyan-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
                <Droplets className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Botanical Courtyard Atrium
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Centerpiece: Natural Stone Water Stream & Koi Cascades
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <SuburbanGarden3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#0284C7" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-cyan-50/90 border-2 border-cyan-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Special Garden Feature ={" "}
            <SentenceSlot value={play.world.selectedFeature} filled={!!play.world.selectedFeature} />
          </p>
        </div>

        {/* Feature Bay */}
        <Bay label="Garden Centerpiece Bay" tone="cyan">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {features.map((f) => (
              <WordPill
                key={f}
                word={f}
                selected={play.world.selectedFeature === f}
                onClick={() => play.patch({ selectedFeature: f })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — 🏠 3D Mechanical Roof (Meaning of Retractable)
   Question: "What does the word ‘retractable’ mean in the third paragraph?"
   Options: A. Something that moves, B. Something that is beautiful, C. Something that is very expensive, D. Something that shines -> Key: A
   ══════════════════════════════════════════════════════════════════════ */
export function Q35HospitalityInviteActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [roofOpen, setRoofOpen] = useState(false);

  const play = usePlay<{ selectedMeaning?: string; roofToggled: boolean }>({
    question,
    initial: { selectedMeaning: undefined, roofToggled: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedMeaning) return { note: "Slide the motorized roof panels and define 'retractable'" };
      const map: Record<string, string> = {
        "Something that moves": "A",
        "Something that is beautiful": "B",
        "Something that is very expensive": "C",
        "Something that shines": "D",
      };
      return {
        value: w.selectedMeaning,
        optionId: map[w.selectedMeaning],
        note:
          w.selectedMeaning === "Something that moves"
            ? "Contextual definition: 'Retractable' means able to be drawn back or moved (sliding open to let in air)."
            : `Selected meaning: ${w.selectedMeaning}`,
      };
    },
  });

  const meanings = [
    "Something that moves",
    "Something that is beautiful",
    "Something that is very expensive",
    "Something that shines",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q35 · 🏠 3D Mechanical Roof"
      subtitle="Slide the motorized glass roof on its tracks to demonstrate that 'retractable' means 'something that moves'"
      hints={[
        "The passage describes the roof sliding completely open; 'retractable' means capable of moving or drawing back.",
      ]}
    >
      <Board>
        {/* 3D Retractable Roof */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-300/80 bg-gradient-to-b from-indigo-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-indigo-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Maximize2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Motorized Roof Mechanism
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  State: {roofOpen ? "Retracted / Fully Open" : "Closed / Sliding Ready"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setRoofOpen(!roofOpen);
                play.patch({ roofToggled: !roofOpen });
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" /> {roofOpen ? "Close Roof" : "Retract / Slide Open"}
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <GoaVilla3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#4F46E5" />
          </World3D>
        </div>

        {/* Live Meaning Slot */}
        <div className="bg-indigo-50/90 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Meaning of <span className="text-indigo-600 font-mono underline">&lsquo;retractable&rsquo;</span> ={" "}
            <SentenceSlot value={play.world.selectedMeaning} filled={!!play.world.selectedMeaning} />
          </p>
        </div>

        {/* Meaning Bay */}
        <Bay label="Contextual Definition Bay" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {meanings.map((m) => (
              <WordPill
                key={m}
                word={m}
                selected={play.world.selectedMeaning === m}
                onClick={() => play.patch({ selectedMeaning: m })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

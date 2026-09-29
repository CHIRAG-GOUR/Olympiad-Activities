"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Home,
  MapPin,
  Users2,
  Plane,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import {
  SuburbanGarden3D,
  LanguageGlobe3D,
  Avatar3D,
} from "./components3D";
import { IEO_READING_PASSAGE_CASEY } from "@/data/ieo_g6_seta";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — 🏘️ 3D Neighbourhood Story World (Passage Title)
   Question: "Choose the best title or heading for the passage."
   Options: A. Summer Holidays, B. The Biggest House, C. My Friend Next Door, D. Camping on Holiday -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q36NewHouseShowroomActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [showPassage, setShowPassage] = useState(false);

  const play = usePlay<{ selectedTitle?: string; storyExplored: boolean }>({
    question,
    initial: { selectedTitle: undefined, storyExplored: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedTitle) return { note: "Explore the suburban neighbourhood story and select the central title" };
      const map: Record<string, string> = {
        "Summer Holidays": "A",
        "The Biggest House": "B",
        "My Friend Next Door": "C",
        "Camping on Holiday": "D",
      };
      return {
        value: w.selectedTitle,
        optionId: map[w.selectedTitle],
        note:
          w.selectedTitle === "My Friend Next Door"
            ? "Central theme: The relationship between Casey and her neighbour Margaret is the main focus ('My Friend Next Door')."
            : `Selected title: ${w.selectedTitle}`,
      };
    },
  });

  const titles = [
    "Summer Holidays",
    "The Biggest House",
    "My Friend Next Door",
    "Camping on Holiday",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q36 · 🏘️ 3D Neighbourhood Story World"
      subtitle="Examine Casey and Margaret's dynamic and select 'My Friend Next Door'"
      hints={[
        "The central story line revolves around Casey's interactions and disagreements with her next-door neighbour Margaret.",
      ]}
    >
      <Board>
        {/* 3D Suburban Neighbourhood */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Home className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Baltimore Suburban Neighborhood
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Casey&apos;s House (Left) & Margaret&apos;s House (Right)
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowPassage(!showPassage)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-all flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {showPassage ? "Hide Passage" : "Read Passage"}
            </button>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <SuburbanGarden3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0]} pose="standing" shirtColor="#2563EB" hairStyle="short" />
            <Avatar3D position={[0.8, 0, 0]} pose="standing" shirtColor="#EC4899" hairStyle="ponytail" />
          </World3D>

          {showPassage && (
            <div className="p-4 bg-amber-950 text-amber-100 border-t border-amber-800 text-xs leading-relaxed max-h-48 overflow-y-auto">
              <h4 className="font-bold text-amber-300 text-sm mb-1.5">Passage 2: Casey & Margaret</h4>
              <p className="whitespace-pre-line text-amber-200">{IEO_READING_PASSAGE_CASEY}</p>
            </div>
          )}
        </div>

        {/* Live Title Slot */}
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Passage Title ={" "}
            <SentenceSlot value={play.world.selectedTitle} filled={!!play.world.selectedTitle} />
          </p>
        </div>

        {/* Title Bay */}
        <Bay label="Story Title Selection Bay" tone="amber">
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
   Q37 — 🗺️ 3D Baltimore Map Explorer
   Question: "Where was Casey's house?"
   Options: A. In the middle of a city, B. On the periphery of a city, C. In the countryside, D. Near a campsite -> Key: B
   ══════════════════════════════════════════════════════════════════════ */
export function Q37SchoolWalkActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedLocation?: string; mapExplored: boolean }>({
    question,
    initial: { selectedLocation: undefined, mapExplored: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedLocation) return { note: "Fly across the city radar and locate Casey's house" };
      const map: Record<string, string> = {
        "In the middle of a city": "A",
        "On the periphery of a city": "B",
        "In the countryside": "C",
        "Near a campsite": "D",
      };
      return {
        value: w.selectedLocation,
        optionId: map[w.selectedLocation],
        note:
          w.selectedLocation === "On the periphery of a city"
            ? "Textual fact: Paragraph 1 states Casey lived on the quiet periphery (outer suburban edge) of Baltimore."
            : `Selected: ${w.selectedLocation}`,
      };
    },
  });

  const locations = [
    "In the middle of a city",
    "On the periphery of a city",
    "In the countryside",
    "Near a campsite",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q37 · 🗺️ 3D Baltimore Map Explorer"
      subtitle="Trace the geographical location of Casey's home on the city periphery"
      hints={[
        "Paragraph 1 explicitly notes that Casey lived on the 'periphery of Baltimore' where suburbs meet wooded hills.",
      ]}
    >
      <Board>
        {/* 3D City Map */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-blue-300/80 bg-gradient-to-b from-blue-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-blue-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Baltimore Geographical Zones
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Target: Outer Suburban Fringe (Periphery)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LanguageGlobe3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#2563EB" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-blue-50/90 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Casey&apos;s House Location ={" "}
            <SentenceSlot value={play.world.selectedLocation} filled={!!play.world.selectedLocation} />
          </p>
        </div>

        {/* Location Bay */}
        <Bay label="Geographical Location Bay" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {locations.map((loc) => (
              <WordPill
                key={loc}
                word={loc}
                selected={play.world.selectedLocation === loc}
                onClick={() => play.patch({ selectedLocation: loc })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q38 — 🎭 3D Neighbourhood Personality Simulation
   Question: "Why did Casey not like her next-door neighbour?"
   Options: A. They played difficult games., B. Margaret was too young., C. She always went away., D. They disagreed with each other. -> Key: D
   ══════════════════════════════════════════════════════════════════════ */
export function Q38DualSchoolActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedReason?: string; personalitiesCompared: boolean }>({
    question,
    initial: { selectedReason: undefined, personalitiesCompared: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedReason) return { note: "Compare character play preferences and identify why they clashed" };
      const map: Record<string, string> = {
        "They played difficult games.": "A",
        "Margaret was too young.": "B",
        "She always went away.": "C",
        "They disagreed with each other.": "D",
      };
      return {
        value: w.selectedReason,
        optionId: map[w.selectedReason],
        note:
          w.selectedReason === "They disagreed with each other."
            ? "Textual fact: Paragraph 2 states they found it difficult to get along because they constantly disagreed on everything."
            : `Selected: ${w.selectedReason}`,
      };
    },
  });

  const reasons = [
    "They played difficult games.",
    "Margaret was too young.",
    "She always went away.",
    "They disagreed with each other.",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q38 · 🎭 3D Neighbourhood Personality Simulation"
      subtitle="Observe their contrasting play styles and identify 'They disagreed with each other.'"
      hints={[
        "Paragraph 2 states that Casey and Margaret struggled to get along because they disagreed on every game and activity.",
      ]}
    >
      <Board>
        {/* 3D Dynamics */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-300/80 bg-gradient-to-b from-rose-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-rose-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <Users2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Character Preference Dynamics
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Margaret: Dolls & Tea Parties vs Casey: Tree Climbing & Bug Catching
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <SuburbanGarden3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0]} pose="standing" shirtColor="#2563EB" />
            <Avatar3D position={[0.8, 0, 0]} pose="standing" shirtColor="#EC4899" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-rose-50/90 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Reason for Friction ={" "}
            <SentenceSlot value={play.world.selectedReason} filled={!!play.world.selectedReason} />
          </p>
        </div>

        {/* Reason Bay */}
        <Bay label="Friction Reason Bay" tone="rose">
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
   Q39 — 🌎 3D Adventure Planning Game
   Question: "Casey's mother would be difficult to ______."
   Options: A. ask for the money to travel, B. force to South America, C. convince about the holiday, D. go abroad with -> Key: D (go abroad with)
   ══════════════════════════════════════════════════════════════════════ */
export function Q39PartyPlanningActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedPhrase?: string; itineraryDrawn: boolean }>({
    question,
    initial: { selectedPhrase: undefined, itineraryDrawn: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedPhrase) return { note: "Review Casey's travel itinerary and complete the Mother travel phrase" };
      const map: Record<string, string> = {
        "ask for the money to travel": "A",
        "force to South America": "B",
        "convince about the holiday": "C",
        "go abroad with": "D",
      };
      return {
        value: w.selectedPhrase,
        optionId: map[w.selectedPhrase],
        note:
          w.selectedPhrase === "go abroad with"
            ? "Passage detail: Convincing her mother to actually travel and go abroad with her was notoriously difficult."
            : `Selected: ${w.selectedPhrase}`,
      };
    },
  });

  const phrases = [
    "ask for the money to travel",
    "force to South America",
    "convince about the holiday",
    "go abroad with",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q39 · 🌎 3D Adventure Planning Game"
      subtitle="Prepare the foreign travel passport and complete the difficulty regarding Mother"
      hints={[
        "Paragraph 3 describes how difficult it was to persuade her mother to leave Baltimore and 'go abroad with' her.",
      ]}
    >
      <Board>
        {/* 3D Travel Planning */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Plane className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  South America Expedition Desk
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Passport, Flight Itinerary & Mother&apos;s Reluctance
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LanguageGlobe3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#059669" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Casey&apos;s mother would be difficult to{" "}
            <SentenceSlot value={play.world.selectedPhrase} filled={!!play.world.selectedPhrase} />.
          </p>
        </div>

        {/* Phrase Bay */}
        <Bay label="Travel Plan Phrase Bay" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {phrases.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedPhrase === p}
                onClick={() => play.patch({ selectedPhrase: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q40 — ⚠️ 3D Vocabulary Hazard Map (Meaning of Notoriously)
   Question: "What is the meaning of the word ‘notoriously’ in the third paragraph?"
   Options: A. Especially, B. Quickly, C. Reservedly, D. Dangerously -> Key: D (Dangerously)
   ══════════════════════════════════════════════════════════════════════ */
export function Q40FoodPrepActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedMeaning?: string; radarActive: boolean }>({
    question,
    initial: { selectedMeaning: undefined, radarActive: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedMeaning) return { note: "Inspect the hazardous mountain travel context and define 'notoriously'" };
      const map: Record<string, string> = {
        Especially: "A",
        Quickly: "B",
        Reservedly: "C",
        Dangerously: "D",
      };
      return {
        value: w.selectedMeaning,
        optionId: map[w.selectedMeaning],
        note:
          w.selectedMeaning === "Dangerously"
            ? "Contextual meaning: In the context of unpredictable foreign mountain travel, 'notoriously' points toward 'Dangerously'."
            : `Selected: ${w.selectedMeaning}`,
      };
    },
  });

  const meanings = ["Especially", "Quickly", "Reservedly", "Dangerously"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q40 · ⚠️ 3D Vocabulary Hazard Map"
      subtitle="Analyze the contextual perception of unpredictable travel and define 'notoriously'"
      hints={[
        "The passage contrasts safe home life with foreign travel perceived as notoriously/dangerously unpredictable.",
      ]}
    >
      <Board>
        {/* 3D Hazard Radar */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-red-300/80 bg-gradient-to-b from-red-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-red-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider block">
                  Foreign Travel Hazard Radar
                </span>
                <span className="text-[11px] font-medium text-red-400">
                  Perception: High Risk / Notoriously Unsafe
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LanguageGlobe3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#DC2626" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-red-950/80 border-2 border-red-700 text-red-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Meaning of <span className="text-red-400 font-mono underline">&lsquo;notoriously&rsquo;</span> ={" "}
            <SentenceSlot value={play.world.selectedMeaning} filled={!!play.world.selectedMeaning} />
          </p>
        </div>

        {/* Meaning Bay */}
        <Bay label="Contextual Definition Bay" tone="rose">
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

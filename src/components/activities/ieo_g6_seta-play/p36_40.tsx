"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { Home, Footprints, Users, PartyPopper, Utensils, Wind } from "lucide-react";
import {
  GoaVilla3D,
  TrailGreeting3D,
  ClassroomAuditorium3D,
  GrandBanquetHall3D,
  DiningTable3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — Architectural Adjective (Exquisite)
   Sentence: "It is a/an ______ new house with a balcony and air conditioning."
   Options: A. pugnacious, B. hideous, C. exquisite, D. drab -> Key: C (exquisite)
   ══════════════════════════════════════════════════════════════════════ */
export function Q36NewHouseShowroomActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the appreciative architectural adjective" };
      const map: Record<string, string> = { pugnacious: "A", hideous: "B", exquisite: "C", drab: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "exquisite" ? "Correct: 'exquisite' means exceptionally beautiful, refined, and delightful" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["pugnacious", "hideous", "exquisite", "drab"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q36 · Goa Modern Villa Architectural Showcase 3D"
      subtitle="Select the refined adjective praising the 3D coastal home with its elegant balcony and air conditioning"
      hints={["'Exquisite' is the only positive adjective describing something elegant, high-quality, and beautiful."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-200/80 bg-gradient-to-b from-purple-50/80 via-pink-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Home className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Goa Coastal Residence · Feature Highlights</span>
                <span className="text-[11px] font-medium text-slate-500">Balcony Ocean View · Modern Climate Control</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-purple-600" /> Air Conditioned
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <GoaVilla3D position={[0, 0, 0]} />
            <Avatar3D position={[1.1, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#7C3AED" hairStyle="ponytail" pose="gesturing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            It is a/an{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
            new house with a balcony and air conditioning.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Architectural Adjective" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {adjs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="purple"
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
   Q37 — School Commute Verb (Walk)
   Sentence: "It is also quite near my school so my brother and I can ______ there in the mornings."
   Options: A. draw, B. tumble, C. lay, D. walk -> Key: D (walk)
   ══════════════════════════════════════════════════════════════════════ */
export function Q37SchoolWalkActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the commute locomotion verb" };
      const map: Record<string, string> = { draw: "A", tumble: "B", lay: "C", walk: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "walk" ? "Correct: 'walk there in the mornings' describes the short pedestrian commute" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["draw", "tumble", "lay", "walk"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q37 · Morning School Commute Trail 3D"
      subtitle="Complete the sentence explaining the short walking commute along the 3D scenic morning pathway"
      hints={["Because the new house is 'quite near' the school, the siblings can easily travel on foot ('walk')."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Footprints className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Morning Trail · 8:15 AM</span>
                <span className="text-[11px] font-medium text-slate-500">Distance: 500 Metres · 8-Minute Scenic Walk</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🚶 Commute: Walk
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <TrailGreeting3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            It is also quite near my school so my brother and I can{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            there in the mornings.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Commute Verb" tone="emerald">
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

/* ══════════════════════════════════════════════════════════════════════
   Q38 — Dual Subject Quantifier (Both)
   Sentence: "As we have moved house, we are ______ going to a new school."
   Options: A. two, B. both, C. together, D. couple -> Key: B (both)
   ══════════════════════════════════════════════════════════════════════ */
export function Q38DualSchoolActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ quantifier?: string }>({
    question,
    initial: { quantifier: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.quantifier) return { note: "Select the dual pronoun/quantifier" };
      const map: Record<string, string> = { two: "A", both: "B", together: "C", couple: "D" };
      return {
        value: w.quantifier,
        optionId: map[w.quantifier],
        note: w.quantifier === "both" ? "Correct: 'we are both going' properly refers to the two siblings" : `Selected: ${w.quantifier}`,
      };
    },
  });

  const quantifiers = ["two", "both", "together", "couple"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q38 · Sibling School Enrolment 3D"
      subtitle="Complete the statement referring to the two siblings attending their new school"
      hints={["'Both' is the grammatical pronoun/quantifier used to refer to two people together ('we are both going')."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">New School Enrolment · Brother & Sister</span>
                <span className="text-[11px] font-medium text-slate-500">Two Siblings Starting Classes Together</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300">
              👥 Quantifier: Both
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.6, 5.0], fov: 45 }}>
            <ClassroomAuditorium3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.5, 0, 0.4]} rotation={[0, 0.4, 0]} shirtColor="#2563EB" hairStyle="short" hasBackpack backpackColor="#F59E0B" pose="standing" />
            <Avatar3D position={[0.5, 0, 0.4]} rotation={[0, -0.4, 0]} shirtColor="#EC4899" hairStyle="ponytail" hasBackpack backpackColor="#8B5CF6" pose="standing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            As we have moved house, we are{" "}
            <SentenceSlot value={play.world.quantifier} filled={!!play.world.quantifier} />{" "}
            going to a new school.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Dual Quantifier" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {quantifiers.map((q) => (
              <WordPill
                key={q}
                text={q}
                tone="indigo"
                selected={play.world.quantifier === q}
                onClick={() => play.set({ quantifier: q })}
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
   Q39 — Party Organizing Collocation (Planning)
   Sentence: "I am ______ a moving in party and wondered if you would like to come."
   Options: A. creating, B. planning, C. making, D. doing -> Key: B (planning)
   ══════════════════════════════════════════════════════════════════════ */
export function Q39PartyPlanningActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the verb collocating with organizing a party" };
      const map: Record<string, string> = { creating: "A", planning: "B", making: "C", doing: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "planning" ? "Correct collocation: 'planning a party' expresses organizing an event" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["creating", "planning", "making", "doing"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q39 · Housewarming Party Event Planner 3D"
      subtitle="Select the natural English collocation for preparing and hosting a housewarming party"
      hints={["In English, one 'plans a party', 'hosts a party', or 'throws a party'."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-pink-200/80 bg-gradient-to-b from-pink-50/80 via-purple-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500 text-white shadow-xs">
                <PartyPopper className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-pink-950 uppercase tracking-wider block">Housewarming Party Planning Checklist</span>
                <span className="text-[11px] font-medium text-slate-500">Invitations · Music · Refreshments</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-pink-100 text-pink-900 border border-pink-300">
              🎉 Collocation: Planning a Party
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <GrandBanquetHall3D position={[0, 0, 0]} />
            <Avatar3D position={[1.0, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#EC4899" hairStyle="bun" pose="gesturing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-pink-50/80 border-2 border-pink-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I am{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            a moving in party and wondered if you would like to come.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Event Verb" tone="pink">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                tone="pink"
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
   Q40 — Culinary Preparation Verb (Prepare)
   Sentence: "My mother and I will ______ lots of nice things to eat..."
   Options: A. measure, B. making, C. prepare, D. transform -> Key: C (prepare)
   ══════════════════════════════════════════════════════════════════════ */
export function Q40FoodPrepActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the culinary base verb following modal 'will'" };
      const map: Record<string, string> = { measure: "A", making: "B", prepare: "C", transform: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "prepare" ? "Correct: 'will prepare' uses the bare infinitive for culinary cooking" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["measure", "making", "prepare", "transform"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q40 · Gourmet Kitchen Culinary Preparation 3D"
      subtitle="Complete the sentence with the base verb describing preparing delicious delicacies on the 3D feast table"
      hints={["After modal auxiliary 'will', use base verb 'prepare' ('will prepare lots of nice things to eat')."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Utensils className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Kitchen Prep Counter · Party Feast</span>
                <span className="text-[11px] font-medium text-slate-500">Delicious Snacks & Delicacies</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🍳 Verb: Prepare
            </span>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <DiningTable3D position={[0, 0, 0]} />
            <Avatar3D position={[-1.0, 0, 0.3]} rotation={[0, 0.6, 0]} shirtColor="#EF4444" hairStyle="short" pose="gesturing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            My mother and I will{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            lots of nice things to eat...
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Culinary Verb" tone="amber">
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

"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { Home, Sparkles, Navigation, Users, Calendar, Utensils } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q36 — 3D House Showcase (Email Adjectives: 'Exquisite')
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
        note: w.adj === "exquisite" ? "Correct: 'exquisite' means extremely beautiful and elegant" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["pugnacious", "hideous", "exquisite", "drab"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q36 · Goa Villa Showcase"
      subtitle="Classify the beautiful new house with balcony and modern air conditioning"
      hints={["'Exquisite' is the only positive adjective describing something refined and exceptionally beautiful."]}
    >
      <Board>
        <World3D camera={{ position: [0, 2.5, 4.8], fov: 45 }} height="260px">
          {/* Garden Base */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[3, 3, 0.2, 32]} />
            <meshStandardMaterial color="#86EFAC" />
          </mesh>
          {/* Villa House */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2, 1.6, 1.4]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
          {/* Balcony Railing */}
          <mesh position={[0, 0.4, 0.8]}>
            <boxGeometry args={[1.4, 0.4, 0.2]} />
            <meshStandardMaterial color="#38BDF8" />
          </mesh>
          {/* Villa Roof */}
          <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.8, 0.8, 4]} />
            <meshStandardMaterial color="#EA580C" />
          </mesh>
        </World3D>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            It is a/an <SentenceSlot value={play.world.adj} filled={!!play.world.adj} /> new house with a balcony and air conditioning.
          </p>
        </div>

        <Bay label="Descriptive Adjective Selector" tone="purple">
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
   Q37 — Walk to School (Email Locomotion Verb: 'Walk')
   Sentence: "It is also quite near my school so my brother and I can ______ there in the mornings."
   Options: A. draw, B. tumble, C. lay, D. walk -> Key: D (walk)
   ══════════════════════════════════════════════════════════════════════ */
export function Q37WalkToSchoolActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the commute verb" };
      const map: Record<string, string> = { draw: "A", tumble: "B", lay: "C", walk: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "walk" ? "Correct: 'walk there in the mornings' suits the short distance to school" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["draw", "tumble", "lay", "walk"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q37 · Morning School Commute"
      subtitle="Select the pedestrian locomotion verb for the short morning trip"
      hints={["Because the house is 'quite near' the school, the siblings can easily 'walk' there."]}
    >
      <Board>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
            <Navigation className="w-4 h-4 text-emerald-700" />
            <span>Commute Distance: 400m along shaded footpath ➔ Pedestrian friendly</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            It is also quite near my school so my brother and I can{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            there in the mornings.
          </p>
        </div>

        <Bay label="Commute Verb Selector" tone="emerald">
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
   Q38 — Sibling School Admission (Email Quantifier: 'Both')
   Sentence: "As we have moved house, we are ______ going to a new school."
   Options: A. two, B. both, C. together, D. couple -> Key: B (both)
   ══════════════════════════════════════════════════════════════════════ */
export function Q38NewSchoolActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ word?: string }>({
    question,
    initial: { word: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.word) return { note: "Select the dual pronoun/quantifier" };
      const map: Record<string, string> = { two: "A", both: "B", together: "C", couple: "D" };
      return {
        value: w.word,
        optionId: map[w.word],
        note: w.word === "both" ? "Correct quantifier: 'we are both going to a new school'" : `Selected: ${w.word}`,
      };
    },
  });

  const words = ["two", "both", "together", "couple"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q38 · Sibling School Admission"
      subtitle="Select the natural quantifier referring to the two siblings"
      hints={["'We are both going' is the grammatically standard quantifier placement for two people."]}
    >
      <Board>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-xs sm:text-sm">
            <Users className="w-4 h-4 text-sky-700" />
            <span>Enrolment Roster: Sumi + Brother (2 students)</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            As we have moved house, we are{" "}
            <SentenceSlot value={play.world.word} filled={!!play.world.word} />{" "}
            going to a new school.
          </p>
        </div>

        <Bay label="Dual Quantifier Selector" tone="sky">
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

/* ══════════════════════════════════════════════════════════════════════
   Q39 — Party Planning Board (Email Collocation: 'Planning')
   Sentence: "I am ______ a moving in party and wondered if you would like to come."
   Options: A. creating, B. planning, C. making, D. doing -> Key: B (planning)
   ══════════════════════════════════════════════════════════════════════ */
export function Q39PartyPlannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the event organizing verb" };
      const map: Record<string, string> = { creating: "A", planning: "B", making: "C", doing: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "planning" ? "Correct collocation: 'planning a moving-in party'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["creating", "planning", "making", "doing"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q39 · Housewarming Party Planner"
      subtitle="Choose the natural verb for organizing an upcoming celebration"
      hints={["We 'plan a party' to arrange guests, food, and timing."]}
    >
      <Board>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-900 font-bold text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-pink-700" />
            <span>Event Checklist: Invitations, Music Playlist, Snack Menu</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            I am <SentenceSlot value={play.world.verb} filled={!!play.world.verb} /> a moving in party and wondered if you would like to come.
          </p>
        </div>

        <Bay label="Event Verb Selector" tone="purple">
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
   Q40 — Party Kitchen Prep (Email Modal Structure: 'Prepare')
   Sentence: "My mother and I will ______ lots of nice things to eat..."
   Options: A. measure, B. making, C. prepare, D. transform -> Key: C (prepare)
   ══════════════════════════════════════════════════════════════════════ */
export function Q40PartyPreparationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the culinary verb after modal 'will'" };
      const map: Record<string, string> = { measure: "A", making: "B", prepare: "C", transform: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "prepare" ? "Correct: 'will prepare lots of nice things to eat'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["measure", "making", "prepare", "transform"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q40 · Party Kitchen Preparation"
      subtitle="Complete the culinary plan following the modal auxiliary 'will'"
      hints={["Modal 'will' must be followed by base form verb 'prepare' (not -ing form 'making')."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <Utensils className="w-4 h-4 text-amber-700" />
            <span>Kitchen Prep Station: Sandwiches, Fruit Skewers, Mango Cake</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            My mother and I will{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            lots of nice things to eat...
          </p>
        </div>

        <Bay label="Culinary Verb Selector" tone="amber">
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

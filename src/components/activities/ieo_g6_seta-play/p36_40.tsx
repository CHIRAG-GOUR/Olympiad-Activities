"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { Home, Sparkles, Navigation, Users, Calendar, Utensils, Footprints, Wind, PartyPopper, CheckCircle2 } from "lucide-react";

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
      dim="2D"
      play={play}
      question={question}
      title="Q36 · Goa Modern Villa Architectural Showcase"
      subtitle="Select the refined adjective praising the new home with its elegant balcony and air conditioning"
      hints={["'Exquisite' is the only positive adjective describing something elegant, high-quality, and beautiful."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-purple-200/80 bg-gradient-to-b from-purple-50/80 via-pink-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 pb-3 mb-4">
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

          {/* Villa Showcase Illustration Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-purple-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-200 via-pink-50 to-amber-100 border border-purple-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Palm trees framing the villa */}
                  <g transform="translate(30, 20)">
                    <path d="M 20 140 Q 10 70 25 20" stroke="#92400E" strokeWidth="5" fill="none" />
                    <path d="M 25 20 Q -5 5 -15 25" stroke="#15803D" strokeWidth="3" fill="none" />
                    <path d="M 25 20 Q 25 -10 15 -25" stroke="#15803D" strokeWidth="3" fill="none" />
                    <path d="M 25 20 Q 55 5 65 25" stroke="#15803D" strokeWidth="3" fill="none" />
                  </g>

                  {/* Modern Villa Structure */}
                  <g transform="translate(100, 30)">
                    {/* Villa Walls */}
                    <rect x="0" y="30" width="180" height="95" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                    {/* Terracotta Roof */}
                    <polygon points="-10,30 90,0 190,30" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />

                    {/* Glass Balcony on upper floor */}
                    <rect x="30" y="40" width="70" height="35" rx="3" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
                    <line x1="30" y1="58" x2="100" y2="58" stroke="#38BDF8" strokeWidth="1" />
                    <text x="65" y="52" textAnchor="middle" fill="#0284C7" fontSize="7" fontWeight="bold">BALCONY</text>

                    {/* Large modern windows */}
                    <rect x="115" y="42" width="45" height="30" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
                    <rect x="30" y="85" width="45" height="40" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />

                    {/* Front Door */}
                    <rect x="115" y="82" width="30" height="43" rx="2" fill="#78350F" />
                    <circle cx="122" cy="104" r="2" fill="#FBBF24" />
                  </g>

                  {/* Lawn Garden */}
                  <rect x="0" y="155" width="380" height="25" fill="#22C55E" />
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-1">Adjective Nuance</span>
                <div className="text-xs text-slate-700 font-mono bg-purple-50/70 p-2.5 rounded-lg border border-purple-200/60 leading-relaxed">
                  <span className="text-purple-600 font-bold">exquisite</span> = extremely beautiful & fine
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Pugnacious" means combative; "hideous" means ugly; "drab" means dull. "Exquisite" is the sole appreciative word.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-purple-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              It is a/an{" "}
              <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
              new house with a balcony and air conditioning.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
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
          </div>
        </div>
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
      dim="2D"
      play={play}
      question={question}
      title="Q37 · Morning School Commute Route"
      subtitle="Complete the sentence explaining the short walking distance between the house and school"
      hints={["Because the new house is 'quite near' the school, the siblings can easily travel on foot ('walk')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
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

          {/* Morning Walking Path Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-emerald-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 border border-emerald-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Sidewalk */}
                  <rect x="0" y="125" width="380" height="55" fill="#E2E8F0" />
                  <line x1="0" y1="125" x2="380" y2="125" stroke="#94A3B8" strokeWidth="2" />

                  {/* School Gate in Distance on Right */}
                  <g transform="translate(280, 50)">
                    <rect x="0" y="20" width="80" height="55" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
                    <polygon points="0,20 40,0 80,20" fill="#1E40AF" />
                    <rect x="30" y="45" width="20" height="30" fill="#FEF3C7" />
                    <text x="40" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">SCHOOL 🏫</text>
                  </g>

                  {/* Sibling 1 (Brother with blue backpack) */}
                  <g transform="translate(100, 55)">
                    <circle cx="20" cy="20" r="12" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <path d="M 8 20 Q 20 6 32 20 Z" fill="#78350F" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 16 26 Q 20 30 24 26" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 10 32 L 4 65 L 36 65 L 30 32 Z" fill="#2563EB" />
                    <rect x="6" y="36" width="8" height="22" rx="2" fill="#F59E0B" />
                  </g>

                  {/* Sibling 2 (Sister walking alongside with red backpack) */}
                  <g transform="translate(150, 55)">
                    <circle cx="20" cy="20" r="12" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    <path d="M 8 20 Q 20 6 32 20 Q 32 35 36 40 L 30 38 Z" fill="#92400E" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 16 26 Q 20 30 24 26" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 10 32 L 4 65 L 36 65 L 30 32 Z" fill="#EC4899" />
                    <rect x="6" y="36" width="8" height="22" rx="2" fill="#8B5CF6" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Locomotion Verb Context</span>
                <div className="text-xs text-slate-700 font-mono bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                  can <span className="text-emerald-600 font-bold">walk</span> there in the mornings
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Walk" describes everyday walking commute to school.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-emerald-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              It is also quite near my school so my brother and I can{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              there in the mornings.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
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
          </div>
        </div>
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
      dim="2D"
      play={play}
      question={question}
      title="Q38 · Sibling School Enrolment (Quantifiers)"
      subtitle="Complete the statement referring to the two siblings attending their new school"
      hints={["'Both' is the grammatical pronoun/quantifier used to refer to two people together ('we are both going')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 pb-3 mb-4">
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

          {/* Sibling Badge Card Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-indigo-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-indigo-50 via-sky-50 to-purple-50 border border-indigo-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Sibling 1 Badge */}
                  <g transform="translate(60, 30)">
                    <rect x="0" y="0" width="115" height="115" rx="8" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2" />
                    <circle cx="57.5" cy="40" r="20" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <text x="57.5" y="75" textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="bold">STUDENT 1</text>
                    <text x="57.5" y="90" textAnchor="middle" fill="#6366F1" fontSize="8.5">Grade 6 · Enrolled</text>
                  </g>

                  {/* Plus connector */}
                  <g transform="translate(180, 75)">
                    <circle cx="10" cy="10" r="14" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" />
                    <text x="10" y="15" textAnchor="middle" fill="#4F46E5" fontSize="14" fontWeight="bold">&</text>
                  </g>

                  {/* Sibling 2 Badge */}
                  <g transform="translate(205, 30)">
                    <rect x="0" y="0" width="115" height="115" rx="8" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
                    <circle cx="57.5" cy="40" r="20" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    <text x="57.5" y="75" textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="bold">STUDENT 2</text>
                    <text x="57.5" y="90" textAnchor="middle" fill="#EC4899" fontSize="8.5">Grade 6 · Enrolled</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">Dual Quantifier Rule</span>
                <div className="text-xs text-slate-700 font-mono bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-200/60 leading-relaxed">
                  we are <span className="text-indigo-600 font-bold">both</span> going to...
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Both" refers directly to the two family members sharing the action.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-indigo-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              As we have moved house, we are{" "}
              <SentenceSlot value={play.world.quantifier} filled={!!play.world.quantifier} />{" "}
              going to a new school.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
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
          </div>
        </div>
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
      dim="2D"
      play={play}
      question={question}
      title="Q39 · Housewarming Party Event Planner"
      subtitle="Select the natural English collocation for preparing and hosting a housewarming party"
      hints={["In English, one 'plans a party', 'hosts a party', or 'throws a party'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-pink-200/80 bg-gradient-to-b from-pink-50/80 via-purple-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-200/60 pb-3 mb-4">
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

          {/* Party Planner Board Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-pink-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-pink-100 via-rose-50 to-amber-50 border border-pink-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Party Streamers */}
                  <path d="M 20 20 Q 90 40 180 20 T 360 20" fill="none" stroke="#EC4899" strokeWidth="2.5" />
                  <path d="M 20 35 Q 90 55 180 35 T 360 35" fill="none" stroke="#F59E0B" strokeWidth="2" />

                  {/* Balloons */}
                  <circle cx="60" cy="50" r="14" fill="#F43F5E" />
                  <line x1="60" y1="64" x2="65" y2="90" stroke="#78350F" strokeWidth="1" />
                  <circle cx="85" cy="45" r="14" fill="#3B82F6" />
                  <line x1="85" y1="59" x2="75" y2="90" stroke="#78350F" strokeWidth="1" />

                  {/* Invitation Envelope in Center */}
                  <g transform="translate(150, 45)">
                    <rect x="0" y="0" width="130" height="85" rx="6" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
                    <polygon points="0,0 65,45 130,0" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1.5" />
                    <text x="65" y="65" textAnchor="middle" fill="#9D174D" fontSize="10" fontWeight="bold">
                      YOU'RE INVITED!
                    </text>
                    <text x="65" y="77" textAnchor="middle" fill="#BE185D" fontSize="7">
                      Goa Housewarming Celebration
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-pink-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-pink-800 uppercase tracking-wider block mb-1">Collocation Rule</span>
                <div className="text-xs text-slate-700 font-mono bg-pink-50/70 p-2.5 rounded-lg border border-pink-200/60 leading-relaxed">
                  I am <span className="text-pink-600 font-bold">planning</span> a party
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Planning a party" is the standard expression for arranging a social gathering.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-pink-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              I am{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              a moving in party and wondered if you would like to come.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
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
          </div>
        </div>
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
      dim="2D"
      play={play}
      question={question}
      title="Q40 · Gourmet Kitchen Culinary Preparation"
      subtitle="Complete the sentence with the base verb describing preparing party delicacies"
      hints={["After modal auxiliary 'will', use base verb 'prepare' ('will prepare lots of nice things to eat')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
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

          {/* Kitchen Food Prep Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Kitchen Counter Table */}
                  <rect x="20" y="110" width="340" height="55" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />

                  {/* Mother Chef Avatar on left */}
                  <g transform="translate(60, 35)">
                    {/* Head */}
                    <circle cx="20" cy="20" r="13" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    <circle cx="20" cy="8" r="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 16 26 Q 20 30 24 26" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    {/* Apron */}
                    <path d="M 8 32 L 2 75 L 38 75 L 32 32 Z" fill="#EF4444" />
                    <polygon points="12,32 20,45 28,32" fill="#FFFFFF" />
                  </g>

                  {/* Child Chef Avatar on right */}
                  <g transform="translate(280, 45)">
                    <circle cx="20" cy="18" r="11" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <circle cx="20" cy="8" r="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                    <circle cx="16" cy="18" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="18" r="1.5" fill="#1E293B" />
                    <path d="M 16 24 Q 20 28 24 24" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 8 30 L 3 65 L 37 65 L 32 30 Z" fill="#3B82F6" />
                  </g>

                  {/* Tasty treats on counter */}
                  {/* Steaming dish */}
                  <g transform="translate(140, 95)">
                    <ellipse cx="25" cy="15" rx="25" ry="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
                    {/* Fruit bowl */}
                    <circle cx="15" cy="12" r="5" fill="#EF4444" />
                    <circle cx="25" cy="10" r="6" fill="#F59E0B" />
                    <circle cx="35" cy="12" r="5" fill="#84CC16" />
                  </g>

                  {/* Pastry tray */}
                  <g transform="translate(200, 95)">
                    <rect x="0" y="5" width="45" height="15" rx="3" fill="#D97706" />
                    <circle cx="12" cy="10" r="4" fill="#FEF08A" />
                    <circle cx="23" cy="10" r="4" fill="#FEF08A" />
                    <circle cx="34" cy="10" r="4" fill="#FEF08A" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Modal + Base Verb</span>
                <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  will + <span className="text-amber-600 font-bold">prepare</span> [base verb]
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Prepare" is the correct base infinitive verb matching the modal auxiliary "will".
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-amber-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              My mother and I will{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              lots of nice things to eat...
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
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
          </div>
        </div>
      </Board>
    </Shell>
  );
}

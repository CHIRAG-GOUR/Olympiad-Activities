"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { Trophy, Sparkles, Waves, Search, MessageSquare, Utensils, AlertTriangle, CheckCircle2, Car, Heart, Shield } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q46 — Absurd Bike Riding Idea (Preposterous)
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
      if (!w.adj) return { note: "Select the advanced adjective expressing utter absurdity" };
      const map: Record<string, string> = { preposterous: "A", durable: "B", laborious: "C", imbrue: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "preposterous" ? "Correct: 'preposterous' means utterly absurd, ridiculous, or contrary to reason" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["preposterous", "durable", "laborious", "imbrue"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q46 · Achievers: Absurd Idea Evaluation"
      subtitle="Identify the advanced vocabulary term describing a dangerous and utterly ridiculous proposal"
      hints={["'Preposterous' means completely contrary to reason or common sense; utterly absurd."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-300/90 bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-300/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Advanced Vocabulary: Total Absurdity</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-200/80 text-amber-950 border border-amber-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> 3 Marks Question
            </span>
          </div>

          {/* Absurd Dog on Bicycle Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-200 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Road */}
                  <rect x="0" y="130" width="380" height="50" fill="#64748B" />
                  <line x1="0" y1="155" x2="380" y2="155" stroke="#FDE047" strokeWidth="2" strokeDasharray="12,8" />

                  {/* Bicycle Frame */}
                  <g transform="translate(140, 75)">
                    {/* Wheels */}
                    <circle cx="20" cy="55" r="22" fill="none" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="95" cy="55" r="22" fill="none" stroke="#1E293B" strokeWidth="3" />
                    {/* Spokes */}
                    <line x1="20" y1="33" x2="20" y2="77" stroke="#94A3B8" strokeWidth="1" />
                    <line x1="95" y1="33" x2="95" y2="77" stroke="#94A3B8" strokeWidth="1" />
                    {/* Metal Frame */}
                    <polygon points="20,55 55,55 80,30 45,30" fill="none" stroke="#2563EB" strokeWidth="3.5" />
                    <line x1="55" y1="55" x2="45" y2="18" stroke="#2563EB" strokeWidth="3.5" />
                    <line x1="95" y1="55" x2="80" y2="15" stroke="#2563EB" strokeWidth="3.5" />
                    {/* Handlebars */}
                    <line x1="75" y1="15" x2="90" y2="12" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                    {/* Seat */}
                    <rect x="38" y="15" width="18" height="6" rx="2" fill="#1E293B" />
                  </g>

                  {/* Cyclist Avatar wobbling */}
                  <g transform="translate(180, 25)">
                    {/* Head */}
                    <circle cx="20" cy="20" r="13" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    {/* Helmet */}
                    <ellipse cx="20" cy="12" rx="15" ry="8" fill="#DC2626" />
                    {/* Worried Face */}
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 16 27 Q 20 23 24 27" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    {/* Torso */}
                    <path d="M 10 32 L 4 70 L 36 70 L 30 32 Z" fill="#3B82F6" />
                  </g>

                  {/* Excited Golden Dog sitting on cyclist's lap/basket */}
                  <g transform="translate(210, 48)">
                    {/* Dog Body */}
                    <ellipse cx="20" cy="25" rx="16" ry="12" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
                    {/* Dog Head */}
                    <circle cx="30" cy="15" r="11" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                    {/* Floppy Ears */}
                    <ellipse cx="22" cy="10" rx="5" ry="9" fill="#D97706" />
                    <ellipse cx="36" cy="10" rx="5" ry="9" fill="#D97706" />
                    {/* Dog Face & Tongue */}
                    <circle cx="34" cy="14" r="1.5" fill="#1E293B" />
                    <ellipse cx="40" cy="17" rx="3" ry="2" fill="#1E293B" />
                    <path d="M 38 20 Q 40 25 42 20" fill="#EF4444" />
                  </g>

                  {/* Thought / Danger Warning */}
                  <g transform="translate(40, 30)">
                    <rect x="0" y="0" width="125" height="36" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                    <text x="62.5" y="16" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="bold">⚠️ DANGEROUS IDEA!</text>
                    <text x="62.5" y="28" textAnchor="middle" fill="#B45309" fontSize="8">What a preposterous idea!</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Achievers Vocabulary</span>
                <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  <span className="text-amber-700 font-bold">preposterous</span> = completely contrary to reason; absurd
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Durable" means long-lasting; "laborious" means requiring hard effort; "preposterous" means utterly silly or ridiculous.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-amber-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              Riding my bike with the dog on my lap. What a{" "}
              <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
              idea!
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Advanced Adjective" tone="amber">
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
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q47 — Shared European Hostel Kitchen (Communal)
   Sentence: "I went to a hostel when I was in Europe and there was a ______ kitchen. It was strange to have to share it with other people we did not know."
   Options: A. corporal, B. considerate, C. communal, D. contentious -> Key: C (communal)
   ══════════════════════════════════════════════════════════════════════ */
export function Q47SharedHostelKitchenActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the adjective meaning shared by all community members" };
      const map: Record<string, string> = { corporal: "A", considerate: "B", communal: "C", contentious: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "communal" ? "Correct: 'communal' describes facilities shared by a community or group" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["corporal", "considerate", "communal", "contentious"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q47 · Achievers: Shared Hostel Kitchen"
      subtitle="Identify the social adjective describing facilities shared amongst travellers from different places"
      hints={["'Communal' (from community) refers to resources, spaces, or kitchens shared collectively."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-300/90 bg-gradient-to-b from-sky-50/90 via-indigo-50/50 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-300/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">European Hostel · Shared Cooking Space</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-200/80 text-sky-950 border border-sky-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-700" /> 3 Marks Question
            </span>
          </div>

          {/* Hostel Kitchen Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-sky-200 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-slate-100 via-sky-50 to-amber-50 border border-sky-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Shared Stainless Steel Island Counter */}
                  <rect x="20" y="105" width="340" height="60" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
                  <rect x="30" y="115" width="80" height="40" rx="2" fill="#E2E8F0" />
                  <rect x="150" y="115" width="80" height="40" rx="2" fill="#E2E8F0" />
                  <rect x="270" y="115" width="80" height="40" rx="2" fill="#E2E8F0" />

                  {/* Cooking Pot with Steam */}
                  <g transform="translate(170, 85)">
                    <rect x="0" y="5" width="40" height="20" rx="3" fill="#334155" />
                    <line x1="-5" y1="10" x2="0" y2="10" stroke="#334155" strokeWidth="2" />
                    <line x1="40" y1="10" x2="45" y2="10" stroke="#334155" strokeWidth="2" />
                    <path d="M 12 0 Q 15 -10 12 -20" stroke="#94A3B8" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <path d="M 28 0 Q 25 -10 28 -20" stroke="#94A3B8" strokeWidth="1.5" fill="none" opacity="0.6" />
                  </g>

                  {/* Traveller 1 (Cooking pasta) */}
                  <g transform="translate(60, 35)">
                    <circle cx="20" cy="20" r="13" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 10 32 L 4 70 L 36 70 L 30 32 Z" fill="#10B981" />
                    <text x="20" y="-3" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="bold">Guest A</text>
                  </g>

                  {/* Traveller 2 (Making tea) */}
                  <g transform="translate(290, 35)">
                    <circle cx="20" cy="20" r="13" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 10 32 L 4 70 L 36 70 L 30 32 Z" fill="#8B5CF6" />
                    <text x="20" y="-3" textAnchor="middle" fill="#6D28D9" fontSize="7.5" fontWeight="bold">Guest B</text>
                  </g>

                  {/* Shared Banner */}
                  <rect x="110" y="10" width="160" height="24" rx="6" fill="#0284C7" />
                  <text x="190" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                    SHARED COMMUNAL KITCHEN
                  </text>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1">Vocabulary Definition</span>
                <div className="text-xs text-slate-700 font-mono bg-sky-50/70 p-2.5 rounded-lg border border-sky-200/60 leading-relaxed">
                  <span className="text-sky-700 font-bold">communal</span> = shared by all members of a group
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Corporal" relates to the body; "considerate" means thoughtful; "communal" refers to shared community spaces.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-sky-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              I went to a hostel when I was in Europe and there was a{" "}
              <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
              kitchen. It was strange to have to share it with other people we did not know.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Shared Facility Adjective" tone="sky">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {adjs.map((a) => (
                  <WordPill
                    key={a}
                    text={a}
                    tone="sky"
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
   Q48 — Hydrodynamic Thrust Verb (Propel)
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
      if (!w.verb) return { note: "Select the verb meaning to drive or push forward" };
      const map: Record<string, string> = { propel: "A", pith: "B", purport: "C", pester: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "propel" ? "Correct: 'propel' means to drive, push, or thrust someone or something forward" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["propel", "pith", "purport", "pester"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q48 · Achievers: Hydrodynamic Propulsion"
      subtitle="Examine how arm strokes generate forward thrust and propel a swimmer through water"
      hints={["'Propel' means to drive, push, or thrust forward in a specific direction (as in jet propulsion or arm strokes)."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-cyan-300/90 bg-gradient-to-b from-cyan-50/90 via-blue-50/50 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Aquatic Biomechanics · Forward Thrust</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-cyan-200/80 text-cyan-950 border border-cyan-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-700" /> 3 Marks Question
            </span>
          </div>

          {/* Swimming Propulsion Illustration */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-slate-900 rounded-xl border border-cyan-700 p-4 shadow-inner">
              <div className="relative h-48 rounded-lg bg-gradient-to-b from-blue-900 via-cyan-950 to-slate-950 border border-cyan-500/40 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Pool lane lines */}
                  <line x1="0" y1="30" x2="380" y2="30" stroke="#F59E0B" strokeWidth="3" strokeDasharray="10,5" />
                  <line x1="0" y1="150" x2="380" y2="150" stroke="#F59E0B" strokeWidth="3" strokeDasharray="10,5" />

                  {/* Water streamlines & ripples */}
                  <path d="M 40 70 Q 120 60 200 70 T 360 70" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
                  <path d="M 20 110 Q 100 100 180 110 T 340 110" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />

                  {/* Swimmer performing freestyle stroke */}
                  <g transform="translate(160, 70)">
                    {/* Body */}
                    <ellipse cx="0" cy="20" rx="45" ry="12" fill="#FED7AA" />
                    {/* Swim Cap & Goggles */}
                    <circle cx="45" cy="18" r="10" fill="#3B82F6" />
                    <rect x="42" y="15" width="8" height="4" rx="1" fill="#1E293B" />
                    {/* Outstretched forward arm */}
                    <path d="M 30 15 L 75 10" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                    {/* Recovery arm pulling back */}
                    <path d="M -10 15 L 10 -5 L 30 10" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" fill="none" />
                    {/* Flutter kick wake */}
                    <path d="M -45 18 L -65 10" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
                    <path d="M -45 22 L -65 30" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
                  </g>

                  {/* Forward Thrust Force Vectors */}
                  <g transform="translate(250, 45)">
                    <path d="M 0 10 L 30 10 L 30 2 L 45 15 L 30 28 L 30 20 L 0 20 Z" fill="#34D399" />
                    <text x="20" y="-3" textAnchor="middle" fill="#34D399" fontSize="8" fontWeight="bold">PROPULSION →</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-cyan-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block mb-1">Kinematic Action Verb</span>
                <div className="text-xs text-slate-700 font-mono bg-cyan-50/70 p-2.5 rounded-lg border border-cyan-200/60 leading-relaxed">
                  use your arms to <span className="text-cyan-700 font-bold">propel</span> you forward
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Propel" specifically describes generating thrust or driving movement forward in fluids or mechanics.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-cyan-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              When you swim, you can use your arms to{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              you forward.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Forward Thrust Verb" tone="sky">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {verbs.map((v) => (
                  <WordPill
                    key={v}
                    text={v}
                    tone="sky"
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
   Q49 — Forensic Spelling (Convalesence -> Convalescence)
   Question: "Choose the word with the incorrect spelling."
   Options: A. Credulous, B. Convalesence, C. Contagious, D. Contemporary -> Key: B (Convalesence)
   ══════════════════════════════════════════════════════════════════════ */
export function Q49AdvancedSpellingActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string }>({
    question,
    initial: { selectedWord: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Select the word containing a spelling error" };
      const map: Record<string, string> = { Credulous: "A", Convalesence: "B", Contagious: "C", Contemporary: "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note: w.selectedWord === "Convalesence" ? "Correct error flagged: 'Convalesence' is missing 'sc' (correct: 'Convalescence')" : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["Credulous", "Convalesence", "Contagious", "Contemporary"];
  const definitions: Record<string, string> = {
    Credulous: "✓ Correctly spelt: Having or showing too great a readiness to believe things.",
    Convalesence: "❌ Misspelled! Correct: 'Convalescence' (the gradual recovery of health and strength after illness, with 'sc').",
    Contagious: "✓ Correctly spelt: Spread from one person or organism to another by direct or indirect contact.",
    Contemporary: "✓ Correctly spelt: Living or occurring at the same time; modern.",
  };

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q49 · Achievers: Lexical Forensic Spelling"
      subtitle="Inspect advanced medical and sociological vocabulary and flag the single misspelling"
      hints={["Pay close attention to Latin roots with 'sc' in 'convalescence' (from Latin convalescere)."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-rose-300/90 bg-gradient-to-b from-rose-50/90 via-purple-50/50 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-300/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Advanced Orthographic Analysis</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-200/80 text-rose-950 border border-rose-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" /> 3 Marks Question
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-4">
            {words.map((w) => {
              const active = play.world.selectedWord === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => !play.locked && play.set({ selectedWord: w })}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all relative ${
                    active
                      ? "border-rose-500 bg-rose-50/90 shadow-md ring-2 ring-rose-200"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm font-bold text-slate-900">{w}</span>
                    {active && <span className="text-xs font-bold text-rose-600">FLAGGED</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {definitions[w]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Diagnostic Note */}
          <div className="mt-4 rounded-xl border border-rose-200 bg-white p-4 shadow-xs">
            <p className="text-xs text-slate-700 font-medium">
              {play.world.selectedWord
                ? definitions[play.world.selectedWord]
                : "Select the word card above to analyze its orthographic validity."}
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Incorrectly Spelt Term" tone="rose">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {words.map((w) => (
                  <WordPill
                    key={w}
                    text={w}
                    tone="rose"
                    selected={play.world.selectedWord === w}
                    onClick={() => play.set({ selectedWord: w })}
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
   Q50 — Social Pragmatic Dismissal (Don't be silly, it was nothing)
   Joy: "How can I ever repay you?"
   Mohit: "______"
   Options:
     A. Oh well, better luck next time.
     B. Well, I am not sure, but let me ask somebody.
     C. Don't be silly, it was nothing.
     D. What do you need? -> Key: C
   ══════════════════════════════════════════════════════════════════════ */
export function Q50FavorRepaymentActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ reply?: string }>({
    question,
    initial: { reply: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.reply) return { note: "Select the natural, polite response to an expression of immense gratitude" };
      const map: Record<string, string> = {
        "Oh well, better luck next time.": "A",
        "Well, I am not sure, but let me ask somebody.": "B",
        "Don't be silly, it was nothing.": "C",
        "What do you need?": "D",
      };
      return {
        value: w.reply,
        optionId: map[w.reply],
        note: w.reply.includes("Don't be silly") ? "Correct: A modest, warm, and natural English dismissal of a personal favour" : `Selected: ${w.reply}`,
      };
    },
  });

  const replies = [
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
      subtitle="Select the gracious, natural conversational response acknowledging and modestly dismissing a favor"
      hints={["'Don't be silly, it was nothing' is standard English for graciously minimizing a good deed done for a friend."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-purple-300/90 bg-gradient-to-b from-purple-50/90 via-pink-50/50 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-300/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Section 6: Achievers Section · 3 Marks</span>
                <span className="text-[11px] font-medium text-slate-600">Pragmatic Dialogue · Gracious Favor Repayment</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-200/80 text-purple-950 border border-purple-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" /> 3 Marks Question
            </span>
          </div>

          {/* Ride Home Drop-off Scene Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-purple-200 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-purple-50 to-amber-50 border border-purple-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Evening sky dusk */}
                  <rect x="0" y="130" width="380" height="50" fill="#64748B" />

                  {/* Car on left */}
                  <g transform="translate(60, 60)">
                    <rect x="0" y="25" width="130" height="45" rx="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
                    <path d="M 25 25 L 50 5 L 95 5 L 115 25 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
                    <rect x="52" y="8" width="40" height="15" rx="2" fill="#BAE6FD" />
                    <circle cx="35" cy="70" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                    <circle cx="95" cy="70" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                  </g>

                  {/* Mohit (Driver in car waving warmly) */}
                  <g transform="translate(130, 45)">
                    <circle cx="15" cy="15" r="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <circle cx="12" cy="15" r="1.5" fill="#1E293B" />
                    <circle cx="18" cy="15" r="1.5" fill="#1E293B" />
                    <path d="M 12 20 Q 15 23 18 20" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 15 25 L 30 15" stroke="#FDE68A" strokeWidth="3.5" strokeLinecap="round" />
                    <text x="15" y="-5" textAnchor="middle" fill="#1E40AF" fontSize="8" fontWeight="bold">MOHIT</text>
                  </g>

                  {/* Joy (Grateful passenger outside house) */}
                  <g transform="translate(260, 40)">
                    <circle cx="20" cy="20" r="13" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 16 26 Q 20 30 24 26" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 10 32 L 4 70 L 36 70 L 30 32 Z" fill="#EC4899" />
                    <text x="20" y="-5" textAnchor="middle" fill="#BE185D" fontSize="8" fontWeight="bold">JOY</text>
                  </g>

                  {/* Dialogue Bubble */}
                  <g transform="translate(160, 10)">
                    <rect x="0" y="0" width="160" height="26" rx="6" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="1.5" />
                    <text x="80" y="17" textAnchor="middle" fill="#6D28D9" fontSize="8.5" fontWeight="bold">
                      "Don't be silly, it was nothing! 😊"
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-1">Pragmatic Politeness Formula</span>
                <div className="text-xs text-slate-700 font-mono bg-purple-50/70 p-2.5 rounded-lg border border-purple-200/60 leading-relaxed">
                  "How can I repay you?" → <span className="text-purple-700 font-bold">"Don't be silly, it was nothing."</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Politely and modestly puts the speaker at ease without demanding reciprocation.
                </p>
              </div>
            </div>
          </div>

          {/* Reply Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            {replies.map((r) => {
              const active = play.world.reply === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => !play.locked && play.set({ reply: r })}
                  className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    active
                      ? "border-purple-600 bg-purple-50 text-purple-950 shadow-md ring-2 ring-purple-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span>{r}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Gracious Dialogue Response" tone="purple">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {replies.map((r) => (
                  <WordPill
                    key={r}
                    text={r}
                    tone="purple"
                    selected={play.world.reply === r}
                    onClick={() => play.set({ reply: r })}
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

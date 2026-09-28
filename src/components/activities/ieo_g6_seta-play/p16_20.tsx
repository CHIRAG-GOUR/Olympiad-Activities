"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { History, Waves, Sprout, Clock, Gift, Sparkles, Sun, CheckCircle2, User, Heart } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — Past-vs-Present Playground (Used to)
   Sentence: "That area of the playground ______ be covered in grass. Now it is bare soil."
   Options: A. isn't, B. was once, C. is to, D. used to -> Key: D (used to)
   ══════════════════════════════════════════════════════════════════════ */
export function Q16OldPlaygroundActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ phrase?: string }>({
    question,
    initial: { phrase: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phrase) return { note: "Select the past habitual/state construction" };
      const map: Record<string, string> = { "isn't": "A", "was once": "B", "is to": "C", "used to": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: w.phrase === "used to" ? "Correct: 'used to be' denotes a former enduring state that no longer exists" : `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["isn't", "was once", "is to", "used to"];
  const [viewPast, setViewPast] = useState(false);

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q16 · Playground Landscape Historical Timeline"
      subtitle="Contrast the former green lawn with the current bare soil condition"
      hints={["To describe a past condition or habit that is no longer true, followed by base verb 'be', use 'used to'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-emerald-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <History className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">School Playground · Landscape Log</span>
                <span className="text-[11px] font-medium text-slate-500">Past Greenery vs Present Soil</span>
              </div>
            </div>

            {/* Toggle View Mode */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-amber-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewPast(false)}
                className={`px-3 py-1 rounded-lg transition-all ${!viewPast ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
              >
                Now (Bare Soil)
              </button>
              <button
                type="button"
                onClick={() => setViewPast(true)}
                className={`px-3 py-1 rounded-lg transition-all ${viewPast ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
              >
                Past (Lush Grass)
              </button>
            </div>
          </div>

          {/* Playground Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 to-amber-100 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Swingset frame on left */}
                  <g transform="translate(40, 40)">
                    {/* Metal A-frame */}
                    <line x1="10" y1="110" x2="35" y2="20" stroke="#3B82F6" strokeWidth="3" />
                    <line x1="60" y1="110" x2="35" y2="20" stroke="#3B82F6" strokeWidth="3" />
                    <line x1="35" y1="20" x2="130" y2="20" stroke="#3B82F6" strokeWidth="4" />
                    <line x1="105" y1="110" x2="130" y2="20" stroke="#3B82F6" strokeWidth="3" />
                    <line x1="155" y1="110" x2="130" y2="20" stroke="#3B82F6" strokeWidth="3" />
                    {/* Swings */}
                    <line x1="60" y1="20" x2="55" y2="80" stroke="#64748B" strokeWidth="1.5" />
                    <line x1="75" y1="20" x2="70" y2="80" stroke="#64748B" strokeWidth="1.5" />
                    <rect x="50" y="80" width="30" height="4" rx="2" fill="#E11D48" />
                  </g>

                  {/* Ground patch based on view state */}
                  {viewPast ? (
                    <g>
                      <ellipse cx="260" cy="120" rx="100" ry="45" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                      <text x="260" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">🌿 LUSH GREEN GRASS</text>
                      <text x="260" y="130" textAnchor="middle" fill="#DCFCE7" fontSize="9">"It used to be covered in grass"</text>
                    </g>
                  ) : (
                    <g>
                      <ellipse cx="260" cy="120" rx="100" ry="45" fill="#B45309" stroke="#78350F" strokeWidth="2" opacity="0.85" />
                      <ellipse cx="260" cy="120" rx="75" ry="30" fill="#92400E" />
                      <text x="260" y="115" textAnchor="middle" fill="#FEF3C7" fontSize="11" fontWeight="bold">🍂 NOW BARE SOIL</text>
                      <text x="260" y="130" textAnchor="middle" fill="#FDE68A" fontSize="9">Worn down over time</text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Past State Construction</span>
                <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  <span className="text-amber-600 font-bold">used to</span> + base verb (be)
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Describes something that was repeatedly true in the past but is no longer true today.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-amber-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              That area of the playground{" "}
              <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
              be covered in grass. Now it is bare soil.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Past State Verb Phrase" tone="amber">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {phrases.map((p) => (
                  <WordPill
                    key={p}
                    text={p}
                    tone="amber"
                    selected={play.world.phrase === p}
                    onClick={() => play.set({ phrase: p })}
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
   Q17 — Beach Vacation Memory (Past Habitual 'Would')
   Sentence: "When I was younger, we used to go on holiday to the beach and I ______ eat lots of ice cream."
   Options: A. shall, B. will, C. am going to, D. would -> Key: D (would)
   ══════════════════════════════════════════════════════════════════════ */
export function Q17BeachMemoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ modal?: string }>({
    question,
    initial: { modal: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.modal) return { note: "Select the modal verb expressing past repeated habit" };
      const map: Record<string, string> = { shall: "A", will: "B", "am going to": "C", would: "D" };
      return {
        value: w.modal,
        optionId: map[w.modal],
        note: w.modal === "would" ? "Correct: 'would' expresses repeated, nostalgic past actions during holidays" : `Selected: ${w.modal}`,
      };
    },
  });

  const modals = ["shall", "will", "am going to", "would"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q17 · Beach Vacation Memory"
      subtitle="Complete the nostalgic recollection of childhood summer habits by the seaside"
      hints={["'Would + base verb' is used to describe typical, repeated activities carried out in the past during holidays or childhood."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-amber-50/40 to-blue-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
                <Waves className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Childhood Seaside Vacation</span>
                <span className="text-[11px] font-medium text-slate-500">Sunny Holiday Memory Album</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-600" /> Summer Beach
            </span>
          </div>

          {/* Beach Memory Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-sky-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 border border-sky-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Sun */}
                  <circle cx="50" cy="35" r="18" fill="#FBBF24" />
                  {/* Ocean Waves */}
                  <path d="M 0 80 Q 40 70 80 80 T 160 80 T 240 80 T 320 80 T 380 80 L 380 120 L 0 120 Z" fill="#38BDF8" opacity="0.6" />
                  <path d="M 0 95 Q 40 85 80 95 T 160 95 T 240 95 T 320 95 T 380 95 L 380 130 L 0 130 Z" fill="#0284C7" opacity="0.4" />

                  {/* Golden Sand Beach */}
                  <rect x="0" y="115" width="380" height="65" fill="#FDE68A" />

                  {/* Striped Beach Umbrella */}
                  <g transform="translate(70, 60)">
                    <line x1="30" y1="20" x2="25" y2="85" stroke="#78350F" strokeWidth="2.5" />
                    <path d="M 0 25 Q 30 0 60 25 Z" fill="#EF4444" />
                    <polygon points="0,25 20,25 30,0" fill="#FFFFFF" />
                    <polygon points="40,25 60,25 30,0" fill="#FFFFFF" />
                  </g>

                  {/* Child Avatar eating ice cream */}
                  <g transform="translate(220, 65)">
                    {/* Head */}
                    <circle cx="20" cy="18" r="12" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    {/* Sunhat */}
                    <ellipse cx="20" cy="12" rx="18" ry="5" fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
                    {/* Face smile */}
                    <circle cx="16" cy="18" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="18" r="1.5" fill="#1E293B" />
                    <path d="M 16 23 Q 20 27 24 23" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    {/* Shirt */}
                    <path d="M 8 30 L 3 65 L 37 65 L 32 30 Z" fill="#10B981" />
                    {/* Double scoop cone held up */}
                    <g transform="translate(32, 25)">
                      <polygon points="4,15 12,15 8,30" fill="#D97706" />
                      <circle cx="8" cy="12" r="6" fill="#F43F5E" />
                      <circle cx="8" cy="4" r="5" fill="#FBBF24" />
                    </g>
                  </g>

                  {/* Sandcastle */}
                  <g transform="translate(150, 125)">
                    <rect x="0" y="10" width="30" height="20" fill="#F59E0B" />
                    <rect x="5" y="0" width="8" height="10" fill="#F59E0B" />
                    <rect x="17" y="0" width="8" height="10" fill="#F59E0B" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1">Past Habitual 'Would'</span>
                <div className="text-xs text-slate-700 font-mono bg-sky-50/70 p-2.5 rounded-lg border border-sky-200/60 leading-relaxed">
                  used to go + and I <span className="text-purple-600 font-bold">would eat</span>...
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Would" is commonly paired with past memories to describe joyful recurring routines.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-sky-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              When I was younger, we used to go on holiday to the beach and I{" "}
              <SentenceSlot value={play.world.modal} filled={!!play.world.modal} />{" "}
              eat lots of ice cream.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Past Modal Verb" tone="sky">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {modals.map((m) => (
                  <WordPill
                    key={m}
                    text={m}
                    tone="sky"
                    selected={play.world.modal === m}
                    onClick={() => play.set({ modal: m })}
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
   Q18 — Botanical Herbarium Collocation (Familiar 'With')
   Sentence: "I am not familiar ______ the botanical names of these herbs."
   Options: A. to, B. with, C. by, D. of -> Key: B (with)
   ══════════════════════════════════════════════════════════════════════ */
export function Q18BotanicalHerbariumActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ prep?: string }>({
    question,
    initial: { prep: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.prep) return { note: "Select the preposition that collocates with 'familiar'" };
      const map: Record<string, string> = { to: "A", with: "B", by: "C", of: "D" };
      return {
        value: w.prep,
        optionId: map[w.prep],
        note: w.prep === "with" ? "Correct collocation: A person is 'familiar with' a topic or names" : `Selected: ${w.prep}`,
      };
    },
  });

  const preps = ["to", "with", "by", "of"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q18 · Botanical Herbarium Identification"
      subtitle="Complete the student's statement regarding familiarity with plant scientific names"
      hints={["When a person has knowledge of or experience with something, they are 'familiar with' it."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Sprout className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">School Herbarium Laboratory</span>
                <span className="text-[11px] font-medium text-slate-500">Aromatic Herbs & Botanical Classification</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🌿 Collocation: Familiar + with
            </span>
          </div>

          {/* Herbarium Pots & Botanical Tags Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-emerald-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-slate-100 via-emerald-50 to-amber-50 border border-emerald-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Wooden Lab Shelf */}
                  <rect x="20" y="135" width="340" height="25" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />

                  {/* Pot 1: Basil (Ocimum basilicum) */}
                  <g transform="translate(60, 60)">
                    {/* Terracotta Pot */}
                    <polygon points="10,45 40,45 35,75 15,75" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
                    <rect x="8" y="40" width="34" height="6" rx="1" fill="#C2410C" />
                    {/* Plant leaves */}
                    <circle cx="25" cy="30" r="14" fill="#16A34A" />
                    <circle cx="18" cy="20" r="10" fill="#22C55E" />
                    <circle cx="32" cy="20" r="10" fill="#4ADE80" />
                    {/* Botanical Tag */}
                    <rect x="0" y="80" width="50" height="15" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
                    <text x="25" y="91" textAnchor="middle" fill="#78350F" fontSize="6.5" fontStyle="italic">O. basilicum</text>
                  </g>

                  {/* Pot 2: Rosemary (Salvia rosmarinus) */}
                  <g transform="translate(165, 55)">
                    <polygon points="10,50 40,50 35,80 15,80" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
                    <rect x="8" y="45" width="34" height="6" rx="1" fill="#C2410C" />
                    {/* Spiky needle leaves */}
                    <line x1="25" y1="45" x2="25" y2="15" stroke="#15803D" strokeWidth="3" />
                    <line x1="25" y1="35" x2="15" y2="25" stroke="#16A34A" strokeWidth="2" />
                    <line x1="25" y1="30" x2="35" y2="20" stroke="#16A34A" strokeWidth="2" />
                    <line x1="25" y1="20" x2="12" y2="10" stroke="#22C55E" strokeWidth="2" />
                    <line x1="25" y1="15" x2="38" y2="8" stroke="#22C55E" strokeWidth="2" />
                    {/* Botanical Tag */}
                    <rect x="0" y="85" width="50" height="15" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
                    <text x="25" y="96" textAnchor="middle" fill="#78350F" fontSize="6.5" fontStyle="italic">S. rosmarinus</text>
                  </g>

                  {/* Pot 3: Mint (Mentha) */}
                  <g transform="translate(270, 60)">
                    <polygon points="10,45 40,45 35,75 15,75" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
                    <rect x="8" y="40" width="34" height="6" rx="1" fill="#C2410C" />
                    <circle cx="25" cy="30" r="12" fill="#10B981" />
                    <circle cx="16" cy="22" r="9" fill="#34D399" />
                    <circle cx="34" cy="22" r="9" fill="#059669" />
                    {/* Botanical Tag */}
                    <rect x="0" y="80" width="50" height="15" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
                    <text x="25" y="91" textAnchor="middle" fill="#78350F" fontSize="6.5" fontStyle="italic">Mentha sp.</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Dependent Preposition Rule</span>
                <div className="text-xs text-slate-700 font-mono bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                  familiar + <span className="text-purple-600 font-bold">with</span> [something]
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "I am not familiar with..." expresses lack of acquaintance or knowledge of a subject.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-emerald-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              I am not familiar{" "}
              <SentenceSlot value={play.world.prep} filled={!!play.world.prep} />{" "}
              the botanical names of these herbs.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Dependent Preposition" tone="emerald">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {preps.map((p) => (
                  <WordPill
                    key={p}
                    text={p}
                    tone="emerald"
                    selected={play.world.prep === p}
                    onClick={() => play.set({ prep: p })}
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
   Q19 — Park Bench Duration (Future Perfect Continuous)
   Sentence: "By 4 pm, this lady ______ been sitting on that bench for five hours."
   Options: A. has, B. will have, C. have, D. must have -> Key: B (will have)
   ══════════════════════════════════════════════════════════════════════ */
export function Q19BenchDurationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the future perfect auxiliary" };
      const map: Record<string, string> = { has: "A", "will have": "B", have: "C", "must have": "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "will have" ? "Correct: 'will have been sitting' expresses an ongoing duration up to a future point (4 PM)" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["has", "will have", "have", "must have"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q19 · Park Bench Continuous Duration Tracker"
      subtitle="Complete the future perfect continuous calculation for the lady resting on the bench"
      hints={["'By [future time]' marking a duration requires Future Perfect Continuous: 'will have been + verb-ing'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/80 via-purple-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">Central Park · Time Horizon: 4:00 PM</span>
                <span className="text-[11px] font-medium text-slate-500">Duration Count: 11:00 AM → 4:00 PM (5 Hours)</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300">
              ⏱ By 4:00 PM
            </span>
          </div>

          {/* Park Bench & Lady Illustration */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-indigo-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-indigo-50 to-emerald-100 border border-indigo-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Shady Oak Tree */}
                  <g transform="translate(40, 20)">
                    <rect x="25" y="60" width="12" height="70" fill="#78350F" />
                    <circle cx="31" cy="40" r="35" fill="#15803D" />
                    <circle cx="45" cy="30" r="25" fill="#22C55E" opacity="0.8" />
                  </g>

                  {/* Wooden Park Bench */}
                  <g transform="translate(180, 80)">
                    {/* Backrest */}
                    <rect x="0" y="0" width="120" height="8" rx="2" fill="#92400E" stroke="#78350F" strokeWidth="1" />
                    <rect x="0" y="12" width="120" height="8" rx="2" fill="#92400E" stroke="#78350F" strokeWidth="1" />
                    {/* Seat */}
                    <rect x="0" y="28" width="120" height="12" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                    {/* Metal Legs */}
                    <line x1="15" y1="40" x2="10" y2="70" stroke="#1E293B" strokeWidth="3" />
                    <line x1="105" y1="40" x2="110" y2="70" stroke="#1E293B" strokeWidth="3" />
                  </g>

                  {/* Lady Seated peacefully reading a book */}
                  <g transform="translate(220, 60)">
                    {/* Head */}
                    <circle cx="20" cy="16" r="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    {/* Silver Hair Bun */}
                    <circle cx="14" cy="12" r="5" fill="#94A3B8" />
                    <circle cx="20" cy="10" r="8" fill="#CBD5E1" />
                    {/* Shawl & Dress */}
                    <path d="M 10 26 L 4 60 L 36 60 L 30 26 Z" fill="#6366F1" />
                    {/* Book */}
                    <rect x="12" y="42" width="18" height="12" rx="2" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
                  </g>

                  {/* Clock Widget on Top Right */}
                  <g transform="translate(300, 15)">
                    <circle cx="25" cy="25" r="22" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2.5" />
                    {/* Clock hands showing 4:00 */}
                    <line x1="25" y1="25" x2="25" y2="10" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="25" y1="25" x2="38" y2="34" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="25" cy="25" r="2.5" fill="#1E293B" />
                    <text x="25" y="58" textAnchor="middle" fill="#4338CA" fontSize="9" fontWeight="bold">4:00 PM</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">Future Perfect Continuous</span>
                <div className="text-xs text-slate-700 font-mono bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-200/60 leading-relaxed">
                  By [time] + <span className="text-purple-600 font-bold">will have</span> + been sitting
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Indicates that an ongoing activity will have reached a continuous milestone at that future hour.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-indigo-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              By 4 pm, this lady{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              been sitting on that bench for five hours.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Auxiliary Verb" tone="indigo">
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
          </div>
        </div>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — Gift Recipient Relative Pronoun (Subject 'Who')
   Sentence: "The child ______ receives this gift is very lucky."
   Options: A. who, B. whose, C. which, D. whom -> Key: A (who)
   ══════════════════════════════════════════════════════════════════════ */
export function Q20LuckyGiftActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ pronoun?: string }>({
    question,
    initial: { pronoun: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.pronoun) return { note: "Select the relative pronoun referring to the child" };
      const map: Record<string, string> = { who: "A", whose: "B", which: "C", whom: "D" };
      return {
        value: w.pronoun,
        optionId: map[w.pronoun],
        note: w.pronoun === "who" ? "Correct: 'who' is the subject relative pronoun referring to a human person (child)" : `Selected: ${w.pronoun}`,
      };
    },
  });

  const pronouns = ["who", "whose", "which", "whom"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q20 · Surprise Birthday Gift Recipient"
      subtitle="Complete the relative clause identifying the fortunate child who receives the special present"
      hints={["Use 'who' as the subject pronoun when referring to people performing an action ('receives')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-violet-200/80 bg-gradient-to-b from-violet-50/80 via-purple-50/40 to-pink-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                <Gift className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-violet-950 uppercase tracking-wider block">Celebration Stage · Grand Prize</span>
                <span className="text-[11px] font-medium text-slate-500">Lucky Recipient Announcement</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-pink-100 text-pink-900 border border-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" /> Surprise Box
            </span>
          </div>

          {/* Child & Golden Gift Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-violet-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-pink-100 via-purple-50 to-indigo-100 border border-violet-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Confetti in background */}
                  <circle cx="50" cy="30" r="3" fill="#EC4899" />
                  <circle cx="80" cy="50" r="4" fill="#FBBF24" />
                  <circle cx="120" cy="25" r="3" fill="#3B82F6" />
                  <circle cx="280" cy="30" r="4" fill="#10B981" />
                  <circle cx="330" cy="45" r="3" fill="#F43F5E" />

                  {/* Excited Child Avatar on the left */}
                  <g transform="translate(100, 50)">
                    {/* Head */}
                    <circle cx="25" cy="22" r="14" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                    {/* Party Hat */}
                    <polygon points="15,10 25,-12 35,10" fill="#EC4899" stroke="#BE185D" strokeWidth="1" />
                    <circle cx="25" cy="-12" r="3" fill="#FBBF24" />
                    {/* Big happy eyes & smile */}
                    <circle cx="20" cy="22" r="2" fill="#1E293B" />
                    <circle cx="30" cy="22" r="2" fill="#1E293B" />
                    <path d="M 19 28 Q 25 35 31 28" stroke="#1E293B" strokeWidth="2" fill="#DC2626" />
                    {/* Torso */}
                    <path d="M 15 36 L 8 75 L 42 75 L 35 36 Z" fill="#8B5CF6" />
                    {/* Raised hands celebrating */}
                    <path d="M 15 42 L -2 25" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 35 42 L 52 25" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />
                  </g>

                  {/* Luxurious Wrapped Gift Box with Ribbon */}
                  <g transform="translate(230, 70)">
                    {/* Gift Box Base */}
                    <rect x="0" y="20" width="70" height="55" rx="6" fill="#F43F5E" stroke="#BE185D" strokeWidth="2" />
                    {/* Gift Lid */}
                    <rect x="-4" y="10" width="78" height="15" rx="3" fill="#E11D48" stroke="#9F1239" strokeWidth="2" />
                    {/* Golden Ribbon Vertical */}
                    <rect x="30" y="10" width="10" height="65" fill="#FBBF24" />
                    {/* Golden Ribbon Horizontal */}
                    <rect x="0" y="42" width="70" height="10" fill="#FBBF24" />
                    {/* Bow on Top */}
                    <ellipse cx="28" cy="6" rx="10" ry="6" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
                    <ellipse cx="42" cy="6" rx="10" ry="6" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
                    <circle cx="35" cy="8" r="4" fill="#F59E0B" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-violet-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-violet-800 uppercase tracking-wider block mb-1">Subject Relative Pronoun</span>
                <div className="text-xs text-slate-700 font-mono bg-violet-50/70 p-2.5 rounded-lg border border-violet-200/60 leading-relaxed">
                  The person (child) + <span className="text-purple-600 font-bold">who</span> + receives...
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Who" links the human antecedent ("child") with the active verb ("receives").
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-violet-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              The child{" "}
              <SentenceSlot value={play.world.pronoun} filled={!!play.world.pronoun} />{" "}
              receives this gift is very lucky.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Relative Pronoun" tone="violet">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {pronouns.map((p) => (
                  <WordPill
                    key={p}
                    text={p}
                    tone="violet"
                    selected={play.world.pronoun === p}
                    onClick={() => play.set({ pronoun: p })}
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

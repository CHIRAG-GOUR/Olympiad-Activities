"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { MessageSquare, Eye, UtensilsCrossed, Scissors, Footprints, Sparkles, CheckCircle2, HeartPulse, User } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — First Aid & Past Inquiry (Did)
   Mother: "Oh, dear! ______ you fall over? You have bruised your knee!"
   Options: A. Did, B. Do, C. Don't, D. How -> Key: A (Did)
   ══════════════════════════════════════════════════════════════════════ */
export function Q41BruisedKneeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ aux?: string }>({
    question,
    initial: { aux: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.aux) return { note: "Select the past simple auxiliary question word" };
      const map: Record<string, string> = { Did: "A", Do: "B", "Don't": "C", How: "D" };
      return {
        value: w.aux,
        optionId: map[w.aux],
        note: w.aux === "Did" ? "Correct: 'Did you fall over?' forms a past simple inquiry with base verb 'fall'" : `Selected: ${w.aux}`,
      };
    },
  });

  const auxs = ["Did", "Do", "Don't", "How"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q41 · First-Aid Station Past Inquiry"
      subtitle="Complete Mother's question inquiring about how the bruised knee occurred"
      hints={["Past simple yes/no questions use auxiliary 'Did' + subject + base verb ('Did you fall over?')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Home First-Aid Corner · Minor Injury</span>
                <span className="text-[11px] font-medium text-slate-500">Section 5: Spoken & Written Expression</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
              🩹 Auxiliary: Did you fall?
            </span>
          </div>

          {/* Mother & Son First-Aid Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-rose-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-amber-50 via-rose-50 to-slate-100 border border-rose-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* First aid kit box on floor */}
                  <g transform="translate(40, 115)">
                    <rect x="0" y="0" width="45" height="32" rx="4" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
                    <rect x="18" y="8" width="9" height="16" fill="#DC2626" />
                    <rect x="14.5" y="11.5" width="16" height="9" fill="#DC2626" />
                  </g>

                  {/* Mother kneeling down gently */}
                  <g transform="translate(100, 45)">
                    {/* Head */}
                    <circle cx="20" cy="18" r="12" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    <path d="M 8 18 Q 20 4 32 18 Z" fill="#78350F" />
                    <circle cx="16" cy="18" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="18" r="1.5" fill="#1E293B" />
                    <path d="M 16 23 Q 20 26 24 23" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    {/* Dress */}
                    <path d="M 10 28 L 2 70 L 38 70 L 30 28 Z" fill="#9333EA" />
                    {/* Outstretched caring hands with bandage */}
                    <path d="M 30 45 L 60 65" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
                    <rect x="58" y="60" width="12" height="10" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
                  </g>

                  {/* Son seated with bandaged knee */}
                  <g transform="translate(200, 50)">
                    <circle cx="20" cy="18" r="11" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <circle cx="16" cy="18" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="18" r="1.5" fill="#1E293B" />
                    <path d="M 16 24 Q 20 21 24 24" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 10 28 L 4 60 L 36 60 L 30 28 Z" fill="#2563EB" />
                    {/* Leg with bruised knee bandage */}
                    <path d="M 12 60 L 12 85" stroke="#1E293B" strokeWidth="4" />
                    <path d="M 28 60 L 45 75 L 45 90" stroke="#1E293B" strokeWidth="4" />
                    {/* Bruise patch */}
                    <circle cx="45" cy="75" r="5" fill="#DC2626" opacity="0.8" />
                    <rect x="39" y="72" width="12" height="6" rx="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
                  </g>

                  {/* Dialogue Bubble */}
                  <g transform="translate(140, 10)">
                    <rect x="0" y="0" width="180" height="28" rx="6" fill="#FFFFFF" stroke="#9333EA" strokeWidth="1.5" />
                    <text x="90" y="18" textAnchor="middle" fill="#6B21A8" fontSize="9" fontWeight="bold">
                      "Did you fall over? Oh dear!"
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1">Past Question Structure</span>
                <div className="text-xs text-slate-700 font-mono bg-rose-50/70 p-2.5 rounded-lg border border-rose-200/60 leading-relaxed">
                  <span className="text-rose-600 font-bold">Did</span> + subject (you) + base verb (fall)
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Did" establishes the past tense, while "fall" stays in its base form.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-rose-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              Mother: "Oh, dear!{" "}
              <SentenceSlot value={play.world.aux} filled={!!play.world.aux} />{" "}
              you fall over? You have bruised your knee!"
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Question Auxiliary" tone="rose">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {auxs.map((a) => (
                  <WordPill
                    key={a}
                    text={a}
                    tone="rose"
                    selected={play.world.aux === a}
                    onClick={() => play.set({ aux: a })}
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
   Q42 — Personality Traits (Nosey)
   Christy: "Oh! That old man is always asking questions. He is so ______."
   Options: A. spatial, B. repentant, C. nosey, D. punctual -> Key: C (nosey)
   ══════════════════════════════════════════════════════════════════════ */
export function Q42CuriousNeighbourActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ trait?: string }>({
    question,
    initial: { trait: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.trait) return { note: "Select the adjective describing an overly inquisitive person" };
      const map: Record<string, string> = { spatial: "A", repentant: "B", nosey: "C", punctual: "D" };
      return {
        value: w.trait,
        optionId: map[w.trait],
        note: w.trait === "nosey" ? "Correct: 'nosey' (nosy) describes someone who pries into other people's affairs and asks too many questions" : `Selected: ${w.trait}`,
      };
    },
  });

  const traits = ["spatial", "repentant", "nosey", "punctual"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q42 · Neighbour Character Assessment"
      subtitle="Identify the character adjective describing someone who constantly pries and asks questions"
      hints={["A person who is excessively curious about other people's private business is 'nosey'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Neighbourhood Dialogue · Character Traits</span>
                <span className="text-[11px] font-medium text-slate-500">Evaluating Overly Inquisitive Behavior</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              👀 Trait: Nosey
            </span>
          </div>

          {/* Fence Peeking Illustration */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Wooden Garden Fence */}
                  {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
                    <polygon key={x} points={`${x},60 ${x + 10},40 ${x + 20},60 ${x + 20},160 ${x},160`} fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                  ))}
                  <rect x="20" y="80" width="340" height="10" fill="#B45309" />
                  <rect x="20" y="130" width="340" height="10" fill="#B45309" />

                  {/* Mr Williams peeking over fence with binoculars */}
                  <g transform="translate(145, 10)">
                    {/* Head */}
                    <circle cx="25" cy="25" r="15" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    {/* Balding grey hair */}
                    <path d="M 12 25 Q 12 12 25 12 Q 38 12 38 25" stroke="#94A3B8" strokeWidth="3" fill="none" />
                    {/* Spectacles & Binoculars */}
                    <rect x="14" y="20" width="10" height="8" rx="2" fill="#3B82F6" stroke="#1E293B" strokeWidth="1" />
                    <rect x="26" y="20" width="10" height="8" rx="2" fill="#3B82F6" stroke="#1E293B" strokeWidth="1" />
                    <line x1="24" y1="24" x2="26" y2="24" stroke="#1E293B" strokeWidth="2" />
                  </g>

                  {/* Christy chatting on right */}
                  <g transform="translate(280, 60)">
                    <circle cx="20" cy="20" r="13" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <path d="M 8 20 Q 20 6 32 20 Z" fill="#92400E" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 10 32 L 4 65 L 36 65 L 30 32 Z" fill="#EC4899" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Character Adjective Meaning</span>
                <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  <span className="text-amber-600 font-bold">nosey</span> = prying into other people's affairs
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Spatial" relates to space; "repentant" means regretful; "punctual" means on time. "Nosey" fits the description.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-amber-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              Christy: "Oh! That old man is always asking questions. He is so{" "}
              <SentenceSlot value={play.world.trait} filled={!!play.world.trait} />."
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Personality Adjective" tone="amber">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {traits.map((t) => (
                  <WordPill
                    key={t}
                    text={t}
                    tone="amber"
                    selected={play.world.trait === t}
                    onClick={() => play.set({ trait: t })}
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
   Q43 — Polite Social Dialogue: Dinner Acceptance
   Jenna: "Are you free for dinner in the evening?"
   Shetty: "______"
   Options:
     A. No problem.
     B. Yes, I can.
     C. Why?
     D. Certainly. What time in the evening? -> Key: D
   ══════════════════════════════════════════════════════════════════════ */
export function Q43DinnerResponseActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ reply?: string }>({
    question,
    initial: { reply: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.reply) return { note: "Select the most polite and natural dinner invitation response" };
      const map: Record<string, string> = {
        "No problem.": "A",
        "Yes, I can.": "B",
        "Why?": "C",
        "Certainly. What time in the evening?": "D",
      };
      return {
        value: w.reply,
        optionId: map[w.reply],
        note: w.reply.includes("Certainly") ? "Correct: Polite affirmative acceptance paired with time confirmation" : `Selected: ${w.reply}`,
      };
    },
  });

  const replies = [
    "No problem.",
    "Yes, I can.",
    "Why?",
    "Certainly. What time in the evening?",
  ];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q43 · Social Dialogue: Dinner Invitation Response"
      subtitle="Select the polite, natural conversational response to accept the dinner invitation"
      hints={["'Certainly. What time in the evening?' provides courteous acceptance while clarifying logistics."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/80 via-purple-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">Conversational Etiquette · Dinner Plan</span>
                <span className="text-[11px] font-medium text-slate-500">Polite Pragmatic Dialogue</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300">
              🍽️ Response: Certainly. What time?
            </span>
          </div>

          {/* Dinner Reservation Table Canvas */}
          <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-xs mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 sm:w-1/2">
                <span className="text-[11px] font-bold text-indigo-800 uppercase block mb-1">Jenna (Inviting)</span>
                <p className="text-xs font-semibold text-slate-800">
                  "Are you free for dinner in the evening?"
                </p>
              </div>

              <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 sm:w-1/2">
                <span className="text-[11px] font-bold text-purple-800 uppercase block mb-1">Shetty (Responding)</span>
                <p className="text-xs font-semibold text-slate-800">
                  {play.world.reply ?? "Select reply..."}
                </p>
              </div>
            </div>
          </div>

          {/* Reply Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {replies.map((r) => {
              const active = play.world.reply === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => !play.locked && play.set({ reply: r })}
                  className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    active
                      ? "border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md ring-2 ring-indigo-200"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <span>{r}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Selector Bay */}
          <div className="mt-2">
            <Bay label="Confirm Polite Response" tone="indigo">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {replies.map((r) => (
                  <WordPill
                    key={r}
                    text={r}
                    tone="indigo"
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

/* ══════════════════════════════════════════════════════════════════════
   Q44 — Traditional English Proverb (saves nine)
   Mary: "Fix your bike right away. Don't leave it for the weekend."
   Tim: "Yes, a stitch in time ______."
   Options: A. make nine, B. saves time, C. makes time, D. saves nine -> Key: D (saves nine)
   ══════════════════════════════════════════════════════════════════════ */
export function Q44StitchInTimeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ proverbEnd?: string }>({
    question,
    initial: { proverbEnd: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.proverbEnd) return { note: "Select the completion for the famous English proverb" };
      const map: Record<string, string> = { "make nine": "A", "saves time": "B", "makes time": "C", "saves nine": "D" };
      return {
        value: w.proverbEnd,
        optionId: map[w.proverbEnd],
        note: w.proverbEnd === "saves nine" ? "Correct proverb: 'A stitch in time saves nine' (timely action prevents larger problems)" : `Selected: ${w.proverbEnd}`,
      };
    },
  });

  const endings = ["make nine", "saves time", "makes time", "saves nine"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q44 · Famous Proverbs: Timely Maintenance"
      subtitle="Complete the timeless English proverb on timely repair and diligence"
      hints={["The traditional proverb is: 'A stitch in time saves nine'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Wisdom & Proverbs Archive · Timely Repair</span>
                <span className="text-[11px] font-medium text-slate-500">Fixing Small Issues Before They Escalate</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🧵 Proverb: A Stitch in Time Saves Nine
            </span>
          </div>

          {/* Needle & Bike Workshop Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Golden Needle & Thread Motif */}
                  <g transform="translate(60, 40)">
                    {/* Needle */}
                    <line x1="0" y1="80" x2="80" y2="10" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                    <ellipse cx="75" cy="14" rx="2" ry="5" fill="#1E293B" transform="rotate(-40 75 14)" />
                    {/* Golden Thread */}
                    <path d="M 75 14 Q 100 0 120 30 T 160 30 T 200 30" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4,4" />
                  </g>

                  {/* Bike Repair Icon */}
                  <g transform="translate(240, 50)">
                    <circle cx="20" cy="30" r="16" fill="none" stroke="#2563EB" strokeWidth="3" />
                    <circle cx="65" cy="30" r="16" fill="none" stroke="#2563EB" strokeWidth="3" />
                    <line x1="20" y1="30" x2="42" y2="15" stroke="#1D4ED8" strokeWidth="3" />
                    <line x1="42" y1="15" x2="65" y2="30" stroke="#1D4ED8" strokeWidth="3" />
                    <line x1="20" y1="30" x2="50" y2="30" stroke="#1D4ED8" strokeWidth="3" />
                    {/* Wrench */}
                    <path d="M 40 5 L 55 -10" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Proverb Meaning</span>
                <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  A stitch in time <span className="text-amber-600 font-bold">saves nine</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Taking quick action to fix a small rip now saves having to make nine stitches later.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-amber-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              Tim: "Yes, a stitch in time{" "}
              <SentenceSlot value={play.world.proverbEnd} filled={!!play.world.proverbEnd} />."
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Proverb Ending" tone="amber">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {endings.map((e) => (
                  <WordPill
                    key={e}
                    text={e}
                    tone="amber"
                    selected={play.world.proverbEnd === e}
                    onClick={() => play.set({ proverbEnd: e })}
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
   Q45 — Negative Agreement (Neither)
   Alan: "I am so tired. I don't feel like walking any more."
   Sherry: "Me ______" / "______"
   Options: A. as well as, B. also, C. neither, D. no -> Key: C (neither)
   ══════════════════════════════════════════════════════════════════════ */
export function Q45NegativeAgreementActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ particle?: string }>({
    question,
    initial: { particle: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.particle) return { note: "Select the word used to agree with a negative statement" };
      const map: Record<string, string> = { "as well as": "A", also: "B", neither: "C", no: "D" };
      return {
        value: w.particle,
        optionId: map[w.particle],
        note: w.particle === "neither" ? "Correct: 'neither' (Me neither / Neither do I) agrees with a negative sentence ('don't feel like')" : `Selected: ${w.particle}`,
      };
    },
  });

  const particles = ["as well as", "also", "neither", "no"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q45 · Conversational Negative Agreement"
      subtitle="Complete Sherry's concurrence with Alan's statement of fatigue"
      hints={["To agree with a negative statement ('I don't feel like...'), English uses 'neither' (e.g. 'Me neither')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-teal-200/80 bg-gradient-to-b from-teal-50/80 via-emerald-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                <Footprints className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wider block">Hiking Trail Rest Stop · Mutual Fatigue</span>
                <span className="text-[11px] font-medium text-slate-500">Agreeing with a Negative Assertion</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-teal-100 text-teal-900 border border-teal-300">
              🤝 Agreement: Me Neither
            </span>
          </div>

          {/* Tired Hikers Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-teal-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-teal-50 to-emerald-100 border border-teal-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Rest Boulder */}
                  <ellipse cx="190" cy="140" rx="140" ry="30" fill="#64748B" />

                  {/* Alan resting exhausted on left */}
                  <g transform="translate(100, 55)">
                    <circle cx="20" cy="18" r="11" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <circle cx="16" cy="18" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="18" r="1.5" fill="#1E293B" />
                    <path d="M 16 25 Q 20 22 24 25" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 10 28 L 4 65 L 36 65 L 30 28 Z" fill="#3B82F6" />
                    <text x="20" y="-5" textAnchor="middle" fill="#1E40AF" fontSize="8" fontWeight="bold">ALAN</text>
                  </g>

                  {/* Sherry resting on right */}
                  <g transform="translate(240, 55)">
                    <circle cx="20" cy="18" r="11" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    <circle cx="16" cy="18" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="18" r="1.5" fill="#1E293B" />
                    <path d="M 16 25 Q 20 22 24 25" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 10 28 L 4 65 L 36 65 L 30 28 Z" fill="#EC4899" />
                    <text x="20" y="-5" textAnchor="middle" fill="#BE185D" fontSize="8" fontWeight="bold">SHERRY</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-teal-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Negative Agreement Rule</span>
                <div className="text-xs text-slate-700 font-mono bg-teal-50/70 p-2.5 rounded-lg border border-teal-200/60 leading-relaxed">
                  Negative clause ("don't") → <span className="text-teal-700 font-bold">neither</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Also" and "too" agree with positive sentences; "neither" agrees with negative ones.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-teal-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              Alan: "I am so tired. I don't feel like walking any more."<br />
              Sherry: "Me{" "}
              <SentenceSlot value={play.world.particle} filled={!!play.world.particle} />."
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Agreement Particle" tone="emerald">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {particles.map((p) => (
                  <WordPill
                    key={p}
                    text={p}
                    tone="emerald"
                    selected={play.world.particle === p}
                    onClick={() => play.set({ particle: p })}
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

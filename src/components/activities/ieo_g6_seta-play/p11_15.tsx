"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { IceCream, Trophy, Radio, Navigation, Clock, CloudRain, PhoneCall, Trees, Footprints, AlertCircle, Sparkles } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — Ice-Cream Parlour Suggestion (Modal Suggestions)
   Sentence: "Shall ______ to the shop and buy ice cream? I think we deserve a treat today."
   Options: A. you going, B. you gone, C. we go, D. we going -> Key: C (we go)
   ══════════════════════════════════════════════════════════════════════ */
export function Q11IceCreamShopActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ phrase?: string }>({
    question,
    initial: { phrase: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phrase) return { note: "Select the joint suggestion phrase to complete the dialogue" };
      const map: Record<string, string> = { "you going": "A", "you gone": "B", "we go": "C", "we going": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: w.phrase === "we go" ? "Grammatically correct: 'Shall we go' forms a polite joint suggestion with base verb" : `Selected: ${w.phrase}`,
      };
    },
  });

  const phrases = ["you going", "you gone", "we go", "we going"];
  const isSelected = !!play.world.phrase;
  const isCorrect = play.world.phrase === "we go";

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q11 · Ice-Cream Parlour Suggestion"
      subtitle="Complete the joint invitation outside the ice-cream parlour by selecting the polite modal phrase"
      hints={["'Shall we + base verb' is the standard English construction for proposing a shared activity or treat."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-pink-200/80 bg-gradient-to-b from-pink-50/80 via-rose-50/40 to-amber-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500 text-white shadow-xs">
                <IceCream className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-pink-950 uppercase tracking-wider block">Sunny Afternoon · Treat Time</span>
                <span className="text-[11px] font-medium text-slate-500">Outside Scoop Delight Parlour</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                isSelected ? (isCorrect ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-purple-100 text-purple-800 border-purple-300") : "bg-pink-100 text-pink-900 border-pink-300"
              }`}>
                {isSelected ? `Dialogue: Shall ${play.world.phrase}...` : "Proposing an outing..."}
              </span>
            </div>
          </div>

          {/* Illustrated Parlour & Friends Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left: Vector Shopfront & Avatars */}
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-pink-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-pink-50 to-amber-100/60 border border-pink-200/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Shop Awning */}
                  <path d="M 60 40 L 320 40 L 330 65 L 50 65 Z" fill="#F43F5E" />
                  <polygon points="60,40 90,40 85,65 55,65" fill="#FFE4E6" />
                  <polygon points="120,40 150,40 145,65 115,65" fill="#FFE4E6" />
                  <polygon points="180,40 210,40 205,65 175,65" fill="#FFE4E6" />
                  <polygon points="240,40 270,40 265,65 235,65" fill="#FFE4E6" />
                  <polygon points="300,40 320,40 330,65 295,65" fill="#FFE4E6" />

                  {/* Parlour Signboard */}
                  <rect x="110" y="14" width="160" height="24" rx="6" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
                  <text x="190" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                    🍦 SCOOP DELIGHT 🍧
                  </text>

                  {/* Shop Window Display */}
                  <rect x="70" y="65" width="240" height="60" rx="4" fill="#E0F2FE" stroke="#CBD5E1" strokeWidth="2" />
                  <rect x="90" y="85" width="35" height="25" rx="3" fill="#F472B6" />
                  <rect x="135" y="85" width="35" height="25" rx="3" fill="#38BDF8" />
                  <rect x="180" y="85" width="35" height="25" rx="3" fill="#FCD34D" />
                  <rect x="225" y="85" width="35" height="25" rx="3" fill="#A78BFA" />

                  {/* Cobblestone pavement */}
                  <rect x="0" y="135" width="380" height="45" fill="#E2E8F0" />
                  <line x1="0" y1="135" x2="380" y2="135" stroke="#94A3B8" strokeWidth="2" />

                  {/* Friend 1 (Speaker proposing treat) */}
                  <g transform="translate(100, 75)">
                    <path d="M 15 50 L 5 80 L 35 80 L 25 50 Z" fill="#6366F1" />
                    <circle cx="20" cy="35" r="14" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                    <path d="M 8 32 Q 20 18 32 32 Q 20 24 8 32 Z" fill="#78350F" />
                    <circle cx="16" cy="35" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="35" r="1.5" fill="#1E293B" />
                    <path d="M 17 40 Q 20 44 23 40" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <path d="M 25 55 L 45 45" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />
                  </g>

                  {/* Friend 2 (Smiling listener) */}
                  <g transform="translate(240, 75)">
                    <path d="M 15 50 L 5 80 L 35 80 L 25 50 Z" fill="#EC4899" />
                    <circle cx="20" cy="35" r="14" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
                    <path d="M 6 34 Q 20 16 34 34 Q 20 22 6 34 Z" fill="#1E293B" />
                    <circle cx="16" cy="35" r="1.5" fill="#1E293B" />
                    <circle cx="24" cy="35" r="1.5" fill="#1E293B" />
                    <path d="M 17 40 Q 20 44 23 40" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                  </g>

                  {/* Speech Bubble */}
                  <rect x="90" y="5" width="140" height="30" rx="8" fill="#FFFFFF" stroke="#6366F1" strokeWidth="1.5" />
                  <polygon points="120,35 125,43 132,35" fill="#FFFFFF" stroke="#6366F1" strokeWidth="1.5" />
                  <rect x="119" y="33" width="14" height="4" fill="#FFFFFF" />
                  <text x="160" y="24" textAnchor="middle" fill="#4338CA" fontSize="10" fontWeight="bold">
                    "Shall we get a treat?"
                  </text>
                </svg>
              </div>
            </div>

            {/* Right: Grammar Info */}
            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-pink-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-pink-800 uppercase tracking-wider block mb-1">Polite Suggestion Formula</span>
                <div className="text-xs text-slate-700 font-mono bg-pink-50/70 p-2.5 rounded-lg border border-pink-200/60 leading-relaxed">
                  <span className="text-pink-600 font-bold">Shall</span> +{" "}
                  <span className="text-purple-600 font-bold">[Subject + Base Verb]</span> + ... ?
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Shall we go" proposes a joint activity respectfully without awkward gerunds or past tenses.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-pink-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              Shall{" "}
              <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
              to the shop and buy ice cream? I think we deserve a treat today.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Suggestion Modal Phrase" tone="purple">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {phrases.map((p) => (
                  <WordPill
                    key={p}
                    text={p}
                    tone="purple"
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
   Q12 — Cricket Practice Roster & Absence (Past Be-Verb Negation)
   Sentence: "He ______ at cricket practice yesterday. I don't know where he was."
   Options: A. wasn't, B. was, C. hasn't, D. had -> Key: A (wasn't)
   ══════════════════════════════════════════════════════════════════════ */
export function Q12CricketMemoryActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the past tense verb expressing absence" };
      const map: Record<string, string> = { "wasn't": "A", was: "B", "hasn't": "C", had: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "wasn't" ? "Correct: 'wasn't' indicates he was absent from yesterday's practice session" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["wasn't", "was", "hasn't", "had"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q12 · Cricket Ground Attendance Investigation"
      subtitle="Complete the coach's statement regarding the player's absence from yesterday's training"
      hints={["'Yesterday' indicates past simple. 'I don't know where he was' confirms he was NOT present ('wasn't')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Cricket Academy Pitch</span>
                <span className="text-[11px] font-medium text-slate-500">Yesterday's Training Session Log</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              Status: Player Absent
            </span>
          </div>

          {/* Cricket Ground & Roster Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-emerald-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 to-emerald-200/70 border border-emerald-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  <ellipse cx="190" cy="115" rx="180" ry="60" fill="#10B981" stroke="#059669" strokeWidth="2" />
                  <rect x="130" y="80" width="120" height="65" rx="4" fill="#D97706" opacity="0.65" />
                  <line x1="145" y1="80" x2="145" y2="145" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="235" y1="80" x2="235" y2="145" stroke="#FFFFFF" strokeWidth="2" />

                  {/* Wickets */}
                  <rect x="140" y="70" width="2" height="25" fill="#FEF3C7" />
                  <rect x="143" y="70" width="2" height="25" fill="#FEF3C7" />
                  <rect x="146" y="70" width="2" height="25" fill="#FEF3C7" />
                  <rect x="139" y="69" width="10" height="2" fill="#FEF3C7" />

                  {/* Cricket Bat & Red Ball */}
                  <g transform="translate(200, 110) rotate(-35)">
                    <rect x="0" y="0" width="8" height="32" rx="2" fill="#FBBF24" stroke="#92400E" strokeWidth="1" />
                    <rect x="2" y="-12" width="4" height="12" rx="1" fill="#FFFFFF" stroke="#92400E" strokeWidth="1" />
                  </g>
                  <circle cx="230" cy="120" r="7" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                  <path d="M 224 120 Q 230 114 236 120" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeDasharray="1,1" />

                  {/* Coach Avatar */}
                  <g transform="translate(60, 50)">
                    <path d="M 12 18 Q 24 10 36 18 L 44 20 L 36 22 Z" fill="#047857" />
                    <circle cx="24" cy="24" r="12" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <circle cx="20" cy="24" r="1.5" fill="#1E293B" />
                    <circle cx="28" cy="24" r="1.5" fill="#1E293B" />
                    <path d="M 10 38 L 4 75 L 44 75 L 38 38 Z" fill="#065F46" />
                  </g>

                  {/* Missing Player Silhouette */}
                  <g transform="translate(280, 50)" opacity="0.8">
                    <circle cx="24" cy="24" r="12" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3" />
                    <path d="M 10 38 L 4 75 L 44 75 L 38 38 Z" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3" />
                    <text x="24" y="29" textAnchor="middle" fill="#DC2626" fontSize="16" fontWeight="bold">?</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">Practice Attendance Sheet</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded bg-emerald-50 text-emerald-900 font-medium">
                    <span>Rahul (Batsman)</span>
                    <span className="text-emerald-700 font-bold">✓ Present</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-emerald-50 text-emerald-900 font-medium">
                    <span>Samir (Bowler)</span>
                    <span className="text-emerald-700 font-bold">✓ Present</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-rose-50 text-rose-900 font-medium border border-rose-200">
                    <span>Target Player</span>
                    <span className="text-rose-600 font-bold">✗ Absent ({play.world.verb ?? "..."})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-emerald-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              He{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              at cricket practice yesterday. I don't know where he was.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Past Tense Auxiliary" tone="emerald">
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
   Q13 — Storm Arrival & Future Call (Future Perfect)
   Sentence: "I will call you later. Hopefully, you ______ made it home through the storm."
   Options: A. do have, B. do, C. will, D. will have -> Key: D (will have)
   ══════════════════════════════════════════════════════════════════════ */
export function Q13StormWarningActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the Future Perfect auxiliary" };
      const map: Record<string, string> = { "do have": "A", do: "B", will: "C", "will have": "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "will have" ? "Correct: Future Perfect 'will have + made' looks forward to completed arrival" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["do have", "do", "will", "will have"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q13 · Storm Commute & Phone Call Check"
      subtitle="Complete the future perfect expectation for safe arrival home through the storm"
      hints={["Future Perfect ('will have + past participle') describes an action expected to be completed before a specified future moment."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-blue-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Stormy Evening Dispatch</span>
                <span className="text-[11px] font-medium text-slate-500">Checking Arrival Status at Destination</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" /> Storm Alert
            </span>
          </div>

          {/* Cozy Home vs Rainy Road Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-sky-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-slate-800 via-blue-900 to-slate-900 border border-sky-700/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Rain streaks */}
                  {[30, 80, 130, 180, 230, 280, 330].map((x, i) => (
                    <line key={i} x1={x} y1={20} x2={x - 20} y2={160} stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="6,8" opacity="0.6" />
                  ))}

                  {/* Warm House on the right */}
                  <g transform="translate(240, 60)">
                    {/* Roof */}
                    <polygon points="0,50 50,10 100,50" fill="#EA580C" />
                    {/* Walls */}
                    <rect x="10" y="50" width="80" height="65" fill="#FEF3C7" />
                    {/* Glowing Window */}
                    <rect x="25" y="60" width="22" height="22" rx="2" fill="#FBBF24" />
                    <line x1="36" y1="60" x2="36" y2="82" stroke="#78350F" strokeWidth="1" />
                    <line x1="25" y1="71" x2="47" y2="71" stroke="#78350F" strokeWidth="1" />
                    {/* Door */}
                    <rect x="58" y="70" width="20" height="45" rx="2" fill="#78350F" />
                    {/* Porch light glowing */}
                    <circle cx="68" cy="65" r="5" fill="#FDE047" opacity="0.9" />
                  </g>

                  {/* Commuter arriving with umbrella */}
                  <g transform="translate(130, 85)">
                    {/* Yellow Umbrella */}
                    <path d="M 0 30 Q 30 5 60 30 Z" fill="#EAB308" />
                    <line x1="30" y1="20" x2="30" y2="60" stroke="#78350F" strokeWidth="2" />
                    <path d="M 30 60 Q 34 65 30 70" stroke="#78350F" strokeWidth="2" fill="none" />
                    {/* Figure walking towards porch */}
                    <circle cx="28" cy="40" r="7" fill="#FDE68A" />
                    <path d="M 22 47 L 34 47 L 30 75 L 24 75 Z" fill="#3B82F6" />
                  </g>

                  {/* Friend on smartphone calling */}
                  <g transform="translate(30, 75)">
                    <circle cx="20" cy="20" r="10" fill="#FED7AA" />
                    <path d="M 12 30 L 28 30 L 26 65 L 14 65 Z" fill="#6366F1" />
                    {/* Phone held to ear */}
                    <rect x="26" y="16" width="5" height="9" rx="1" fill="#1E293B" />
                  </g>

                  {/* Speech bubble */}
                  <rect x="40" y="15" width="130" height="24" rx="6" fill="#FFFFFF" stroke="#6366F1" strokeWidth="1" />
                  <text x="105" y="31" textAnchor="middle" fill="#4338CA" fontSize="9" fontWeight="bold">
                    "I will call you later..."
                  </text>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1">Future Perfect Formula</span>
                <div className="text-xs text-slate-700 font-mono bg-sky-50/70 p-2.5 rounded-lg border border-sky-200/60 leading-relaxed">
                  <span className="text-blue-600 font-bold">will have</span> +{" "}
                  <span className="text-purple-600 font-bold">past participle (made)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Hopefully you will have made it home" anticipates a completed journey in the near future.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-sky-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              I will call you later. Hopefully, you{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              made it home through the storm.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Auxiliary Verb" tone="sky">
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
   Q14 — Park Transition Preposition (Preposition 'To')
   Sentence: "I don't like it here, it is so busy. Let's go ______ another park where there are fewer people."
   Options: A. on, B. at, C. to, D. in -> Key: C (to)
   ══════════════════════════════════════════════════════════════════════ */
export function Q14ParkPathActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ prep?: string }>({
    question,
    initial: { prep: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.prep) return { note: "Select the directional preposition towards destination" };
      const map: Record<string, string> = { on: "A", at: "B", to: "C", in: "D" };
      return {
        value: w.prep,
        optionId: map[w.prep],
        note: w.prep === "to" ? "Correct: 'go to' denotes movement towards another destination" : `Selected: ${w.prep}`,
      };
    },
  });

  const preps = ["on", "at", "to", "in"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q14 · Park Destination Preposition"
      subtitle="Complete the invitation to move from the crowded lawn to a quieter park"
      hints={["The verb 'go' expressing movement towards a place or destination pairs with the preposition 'to'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-lime-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">City Parks Comparison</span>
                <span className="text-[11px] font-medium text-slate-500">Crowded Park → Quiet Garden Trail</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🌿 Direction: To Another Park
            </span>
          </div>

          {/* Crowded vs Quiet Park Scene */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-emerald-100 p-4 shadow-xs">
            <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 border border-emerald-300/60 flex items-center justify-center p-2 overflow-hidden">
              <svg viewBox="0 0 380 180" className="w-full h-full">
                {/* Left side: Busy crowded zone */}
                <rect x="10" y="50" width="160" height="115" rx="8" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1.5" />
                <text x="90" y="70" textAnchor="middle" fill="#991B1B" fontSize="10" fontWeight="bold">⚠️ VERY BUSY PARK</text>
                {/* Crowded stick figures */}
                {[40, 70, 100, 130].map((x, i) => (
                  <g key={i} transform={`translate(${x}, 85)`}>
                    <circle cx="10" cy="10" r="5" fill="#EF4444" />
                    <rect x="8" y="15" width="4" height="18" fill="#B91C1C" />
                  </g>
                ))}

                {/* Arrow pointing across */}
                <g transform="translate(180, 95)">
                  <path d="M 0 10 L 25 10 L 25 0 L 40 15 L 25 30 L 25 20 L 0 20 Z" fill="#059669" />
                  <text x="20" y="-5" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">"Let's go TO..."</text>
                </g>

                {/* Right side: Quiet peaceful green park */}
                <rect x="230" y="50" width="140" height="115" rx="8" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
                <text x="300" y="70" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">✨ PEACEFUL PARK</text>
                {/* Big lush tree and one relaxed visitor */}
                <g transform="translate(250, 80)">
                  <rect x="20" y="30" width="6" height="30" fill="#78350F" />
                  <circle cx="23" cy="20" r="18" fill="#22C55E" />
                </g>
                <g transform="translate(310, 100)">
                  <circle cx="10" cy="8" r="5" fill="#10B981" />
                  <rect x="8" y="13" width="4" height="16" fill="#047857" />
                </g>
              </svg>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-emerald-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              I don't like it here, it is so busy. Let's go{" "}
              <SentenceSlot value={play.world.prep} filled={!!play.world.prep} />{" "}
              another park where there are fewer people.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Direction Preposition" tone="emerald">
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
   Q15 — Reena's Decision (Gerund after 'instead of')
   Sentence: "They were late as usual. So, instead of ______ around, Reena decided to go on ahead without them."
   Options: A. wait, B. waited, C. waiting, D. waits -> Key: C (waiting)
   ══════════════════════════════════════════════════════════════════════ */
export function Q15TrainPlatformActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the gerund form after 'instead of'" };
      const map: Record<string, string> = { wait: "A", waited: "B", waiting: "C", waits: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "waiting" ? "Correct: Prepositional phrase 'instead of' requires gerund 'waiting'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["wait", "waited", "waiting", "waits"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q15 · Reena's Independent Decision"
      subtitle="Complete the sentence explaining why Reena moved ahead without waiting for latecomers"
      hints={["'Instead of' is a prepositional phrase, so any following verb must take the gerund (-ing) form: 'instead of waiting'."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Footprints className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Meeting Point · 10:30 AM</span>
                <span className="text-[11px] font-medium text-slate-500">Friends Late as Usual → Reena Moves Ahead</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🚶‍♀️ Walking Ahead
            </span>
          </div>

          {/* Reena Walking Ahead Illustration */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-sky-100 via-amber-50 to-slate-200 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Sidewalk */}
                  <rect x="0" y="125" width="380" height="55" fill="#E2E8F0" />
                  <line x1="0" y1="125" x2="380" y2="125" stroke="#94A3B8" strokeWidth="2" />

                  {/* Late friends standing far behind confused */}
                  <g transform="translate(40, 75)" opacity="0.65">
                    <circle cx="15" cy="18" r="8" fill="#FDE68A" />
                    <rect x="11" y="26" width="8" height="35" fill="#64748B" />
                    <circle cx="35" cy="18" r="8" fill="#FED7AA" />
                    <rect x="31" y="26" width="8" height="35" fill="#475569" />
                    <text x="25" y="10" textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="bold">LATE ⏳</text>
                  </g>

                  {/* Reena Confidently Marching Forward */}
                  <g transform="translate(240, 50)">
                    {/* Head */}
                    <circle cx="25" cy="22" r="13" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                    {/* Hair */}
                    <path d="M 12 22 Q 25 6 38 22 Q 35 34 38 42 L 32 40 Z" fill="#92400E" />
                    {/* Face */}
                    <circle cx="29" cy="22" r="1.5" fill="#1E293B" />
                    <path d="M 28 27 Q 31 29 34 27" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    {/* Jacket & Backpack */}
                    <path d="M 17 35 L 12 75 L 38 75 L 33 35 Z" fill="#7C3AED" />
                    <rect x="9" y="38" width="8" height="24" rx="3" fill="#EC4899" />
                    {/* Stride legs */}
                    <path d="M 17 75 L 10 105" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 33 75 L 42 105" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                  </g>

                  {/* Speech Bubble */}
                  <rect x="180" y="15" width="160" height="26" rx="6" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.5" />
                  <text x="260" y="32" textAnchor="middle" fill="#6D28D9" fontSize="9" fontWeight="bold">
                    "Instead of waiting, I'll go ahead!"
                  </text>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Prepositional Phrase Rule</span>
                <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  instead of + <span className="text-purple-600 font-bold">gerund (verb-ing)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "instead of waiting" correctly pairs the preposition "of" with the verbal noun gerund.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-amber-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              They were late as usual. So, instead of{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              around, Reena decided to go on ahead without them.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Gerund Form" tone="amber">
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

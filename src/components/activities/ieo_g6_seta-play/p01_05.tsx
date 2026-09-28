"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, WordPill, SentenceSlot, Bay } from "./kit";
import { Sparkles, Utensils, Luggage, Clock, Globe, Bus, CheckCircle2, ArrowRight, Sun, Heart } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — Rich Morning Routine Simulation (Word & Structure)
   Sentence: "In the morning, before I go to work, I wake up and ______ breakfast."
   Options: A. eaten, B. ate, C. eat, D. eating -> Key: C (eat)
   ══════════════════════════════════════════════════════════════════════ */
export function Q01MorningRoutineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedVerb?: string; routineStep: number }>({
    question,
    initial: { selectedVerb: undefined, routineStep: 3 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedVerb) return { note: "Select an action verb to complete the morning breakfast routine" };
      const map: Record<string, string> = { eaten: "A", ate: "B", eat: "C", eating: "D" };
      return {
        value: w.selectedVerb,
        optionId: map[w.selectedVerb],
        note: w.selectedVerb === "eat" ? "Grammatically correct: Present Simple routine with subject 'I'" : `Selected: ${w.selectedVerb}`,
      };
    },
  });

  const verbs = ["eaten", "ate", "eat", "eating"];
  const isCorrect = play.world.selectedVerb === "eat";

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q1 · Morning Routine Simulation"
      subtitle="Complete the morning sequence by installing the correct verb into the kitchen action slot"
      hints={["A recurring routine done every morning before work expresses a regular, habitual action in Present Simple (base verb 'eat')."]}
    >
      <Board>
        {/* Morning Scene Stage */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-sky-50/50 p-5 sm:p-6 shadow-sm">
          {/* Top Status Bar: Time & Routine Timeline */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Sun className="h-4 w-4 animate-spin-slow" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">7:15 AM · Daily Routine</span>
                <span className="text-[11px] font-medium text-slate-500">Sunny Morning · Preparing for work</span>
              </div>
            </div>

            {/* Routine sequence badges */}
            <div className="flex items-center gap-1 sm:gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 1. Alarm Rings
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 2. Freshen Up
              </span>
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                play.world.selectedVerb ? "bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-200" : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
              }`}>
                3. Breakfast Action
              </span>
            </div>
          </div>

          {/* Illustrated Interactive Kitchen Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left: Kitchen Table & Breakfast Props */}
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5"><Utensils className="w-4 h-4 text-amber-600" /> Kitchen Dining Table</span>
                <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {play.world.selectedVerb ? `Action: [${play.world.selectedVerb}]` : "Waiting for verb..."}
                </span>
              </div>

              {/* Breakfast Spread SVG / Vector Illustration */}
              <div className="relative h-44 rounded-xl bg-gradient-to-br from-amber-50/70 to-orange-100/50 border border-amber-200/60 flex items-center justify-center p-3">
                <svg viewBox="0 0 360 160" className="w-full h-full">
                  {/* Dining Table Surface */}
                  <ellipse cx="180" cy="120" rx="160" ry="38" fill="#FDE68A" stroke="#D97706" strokeWidth="3" />
                  <ellipse cx="180" cy="115" rx="145" ry="30" fill="#FEF3C7" />

                  {/* Ceramic Plate */}
                  <ellipse cx="160" cy="115" rx="55" ry="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                  <ellipse cx="160" cy="113" rx="42" ry="13" fill="#F8FAFC" />

                  {/* Sunny side up egg */}
                  <ellipse cx="145" cy="112" rx="20" ry="8" fill="#FFFFFF" />
                  <circle cx="145" cy="112" r="7" fill="#F59E0B" />
                  <circle cx="143" cy="110" r="2" fill="#FFFFFF" opacity="0.8" />

                  {/* Toast slice */}
                  <rect x="170" y="104" width="22" height="15" rx="3" fill="#D97706" transform="rotate(-10 170 104)" />
                  <rect x="172" y="106" width="18" height="11" rx="2" fill="#FBBF24" transform="rotate(-10 170 104)" />

                  {/* Steaming Coffee Mug */}
                  <rect x="235" y="90" width="22" height="26" rx="4" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2" />
                  <path d="M 257 96 C 265 96, 265 108, 257 110" fill="none" stroke="#7C3AED" strokeWidth="3" />
                  {/* Steam particles */}
                  <path d="M 240 82 Q 244 75, 240 68" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
                    <animate attributeName="d" values="M 240 82 Q 244 75, 240 68; M 240 82 Q 236 75, 240 68; M 240 82 Q 244 75, 240 68" dur="2s" repeatCount="indefinite" />
                  </path>
                  <path d="M 248 80 Q 252 73, 248 66" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
                    <animate attributeName="d" values="M 248 80 Q 245 73, 248 66; M 248 80 Q 251 73, 248 66; M 248 80 Q 245 73, 248 66" dur="2.5s" repeatCount="indefinite" />
                  </path>

                  {/* Fresh Orange Juice Glass */}
                  <rect x="85" y="86" width="18" height="30" rx="3" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" opacity="0.9" />
                  <line x1="92" y1="78" x2="102" y2="108" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />

                  {/* Fork and Knife */}
                  <line x1="95" y1="125" x2="120" y2="125" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
                  <line x1="200" y1="125" x2="225" y2="125" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Right: Character State & Energy Card */}
            <div className="md:col-span-5 bg-white/90 backdrop-blur-xs rounded-xl border border-purple-100 p-4 shadow-xs flex flex-col justify-between h-full space-y-3">
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Character Status</span>
                <p className="text-xs text-slate-600 mt-0.5">Alex (Preparing for morning commute)</p>
              </div>

              {/* Character Avatar Box */}
              <div className="bg-gradient-to-br from-purple-100/60 to-indigo-100/40 rounded-xl p-3 border border-purple-200/70 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  {play.world.selectedVerb === "eat" ? "😋" : play.world.selectedVerb ? "🤔" : "🥱"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">Energy Level</span>
                    <span className="text-purple-700 font-mono">{play.world.selectedVerb === "eat" ? "100% Boosted" : "35% Hungry"}</span>
                  </div>
                  <div className="w-full h-2 bg-purple-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        play.world.selectedVerb === "eat" ? "w-full bg-emerald-500" : "w-1/3 bg-amber-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11.5px] text-slate-600 font-medium">
                {play.world.selectedVerb === "eat" ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Perfect! Routine completes with full energy.
                  </span>
                ) : play.world.selectedVerb ? (
                  <span className="text-purple-700">Verb selected: "{play.world.selectedVerb}". Verify tense match!</span>
                ) : (
                  <span>Select a verb tile below to feed the morning routine engine.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Sentence Display with Interactive Slot */}
        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            In the morning, before I go to work, I wake up and{" "}
            <SentenceSlot value={play.world.selectedVerb} filled={!!play.world.selectedVerb} />{" "}
            breakfast.
          </p>
        </div>

        {/* Verb Selection Bay */}
        <Bay label="Select Morning Verb Tile" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
                tone="purple"
                selected={play.world.selectedVerb === v}
                onClick={() => play.set((prev) => ({ ...prev, selectedVerb: v }))}
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
   Q2 — Smart Holiday Packing Room (Modal Obligations)
   Sentence: "I am going on holiday today, but I still ______ pack my bags."
   Options: A. have, B. hasn't, C. have to, D. haven't -> Key: C (have to)
   ══════════════════════════════════════════════════════════════════════ */
export function Q02PackingRobotActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ phrase?: string }>({
    question,
    initial: { phrase: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.phrase) return { note: "Select the modal phrase of obligation" };
      const map: Record<string, string> = { have: "A", "hasn't": "B", "have to": "C", "haven't": "D" };
      return {
        value: w.phrase,
        optionId: map[w.phrase],
        note: w.phrase === "have to" ? "Grammatically correct obligation: 'have to pack'" : `Selected: ${w.phrase}`,
      };
    },
  });

  const options = ["have", "hasn't", "have to", "haven't"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q2 · Smart Holiday Packing Room"
      subtitle="Install the semi-modal phrase into the packing robot control panel"
      hints={["To express necessity or obligation for a base verb like 'pack', use 'have to'."]}
    >
      <Board>
        {/* Packing Room Visual Canvas */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-200/80 bg-gradient-to-b from-sky-50 via-indigo-50/30 to-purple-50/40 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Luggage className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Holiday Departure Checklist</span>
                <span className="text-[11px] font-medium text-slate-500">Flight at 18:00 hrs · Packing Pending</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                ✓ Passport Ready
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                ✓ Tickets Booked
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${
                play.world.phrase === "have to" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
              }`}>
                {play.world.phrase === "have to" ? "✓ Suitcase Packed" : "⏳ Luggage Obligation"}
              </span>
            </div>
          </div>

          {/* Detailed Illustrated Room & Robot */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left: Open Suitcase & Essentials */}
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-sky-100 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>🧳 Luggage Compartment #01</span>
                <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {play.world.phrase === "have to" ? "Status: PACKED & LOCKED" : "Status: OPEN / WAITING"}
                </span>
              </div>

              {/* Vector Suitcase Illustration */}
              <div className="relative h-44 rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 border border-sky-200 flex items-center justify-center p-3">
                <svg viewBox="0 0 320 140" className="w-full h-full">
                  {/* Suitcase Base */}
                  <rect x="50" y="30" width="220" height="90" rx="12" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />
                  <rect x="60" y="40" width="200" height="70" rx="6" fill="#1E40AF" />

                  {/* Packed Essentials inside suitcase */}
                  <rect x="70" y="50" width="60" height="25" rx="4" fill="#38BDF8" />
                  <text x="80" y="66" fill="#0C4A6E" fontSize="9" fontWeight="bold">SHIRTS</text>

                  <rect x="70" y="80" width="60" height="20" rx="4" fill="#A855F7" />
                  <text x="80" y="94" fill="#3B0764" fontSize="9" fontWeight="bold">JACKET</text>

                  {/* Passport & Travel Items */}
                  <rect x="145" y="50" width="40" height="50" rx="3" fill="#047857" stroke="#065F46" strokeWidth="1" />
                  <text x="150" y="76" fill="#FFFFFF" fontSize="8" fontWeight="bold">PASSPORT</text>

                  {/* Sunglasses */}
                  <ellipse cx="215" cy="65" rx="14" ry="10" fill="#1E293B" />
                  <ellipse cx="245" cy="65" rx="14" ry="10" fill="#1E293B" />
                  <line x1="229" y1="65" x2="231" y2="65" stroke="#CBD5E1" strokeWidth="2" />

                  {/* Suitcase Straps */}
                  <rect x="100" y="30" width="8" height="90" fill="#F59E0B" />
                  <rect x="210" y="30" width="8" height="90" fill="#F59E0B" />

                  {/* Suitcase Handle */}
                  <path d="M 130 30 L 130 15 L 190 15 L 190 30" fill="none" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Right: Smart Packing Assistant Bot */}
            <div className="md:col-span-5 bg-white/90 backdrop-blur-xs rounded-xl border border-sky-100 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-950">PackBot Assistant v4</h4>
                  <p className="text-[11px] text-slate-500">Autonomous Packing Robot</p>
                </div>
              </div>

              <div className="bg-sky-50 rounded-xl p-3 border border-sky-200/80 text-xs text-slate-700 leading-relaxed">
                "I am ready to zip up the bags, but the sentence describing your obligation needs the modal phrase of necessity!"
              </div>

              <div className="text-[11.5px] font-bold text-sky-800">
                {play.world.phrase === "have to" ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Robot calibrated: 'have to pack' verified!
                  </span>
                ) : (
                  <span>Select 'have to' to trigger robotic packing sequence.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            I am going on holiday today, but I still{" "}
            <SentenceSlot value={play.world.phrase} filled={!!play.world.phrase} />{" "}
            pack my bags.
          </p>
        </div>

        <Bay label="Robot Obligation Selector" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {options.map((opt) => (
              <WordPill
                key={opt}
                text={opt}
                size="lg"
                tone="sky"
                selected={play.world.phrase === opt}
                onClick={() => play.set({ phrase: opt })}
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
   Q3 — Childhood Memory Kitchen (Past Simple)
   Sentence: "When I was a child, I ______ my mother cook dinner."
   Options: A. was helping, B. helps, C. helped, D. help -> Key: C (helped)
   ══════════════════════════════════════════════════════════════════════ */
export function Q03MemoryKitchenActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the past tense verb for the childhood memory" };
      const map: Record<string, string> = { "was helping": "A", helps: "B", helped: "C", help: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "helped" ? "Correct Past Simple narration: 'helped'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["was helping", "helps", "helped", "help"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q3 · Childhood Memory Machine"
      subtitle="Complete the retrospective childhood narration using the memory recorder"
      hints={["'When I was a child' sets the completed past timeframe, requiring simple past 'helped'."]}
    >
      <Board>
        {/* Nostalgic Memory Kitchen Stage */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-yellow-50/60 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Childhood Flashback · Memory Album</span>
                <span className="text-[11px] font-medium text-slate-500">Year: 2012 · Cooking dinner with Mother</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                Tense: Simple Past (Narrative)
              </span>
            </div>
          </div>

          {/* Memory Scene Illustration */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-amber-200/70 p-4 shadow-xs">
            <div className="relative h-44 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 flex items-center justify-center p-3">
              <svg viewBox="0 0 360 140" className="w-full h-full">
                {/* Kitchen Counter & Stove */}
                <rect x="40" y="50" width="280" height="80" rx="8" fill="#78350F" />
                <rect x="50" y="55" width="260" height="20" rx="4" fill="#FBBF24" />

                {/* Soup Pot */}
                <rect x="145" y="35" width="70" height="40" rx="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
                <ellipse cx="180" cy="35" rx="35" ry="8" fill="#94A3B8" />
                {/* Rising steam */}
                <path d="M 170 25 Q 175 15, 170 5" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.8" />
                <path d="M 190 25 Q 185 15, 190 5" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.8" />

                {/* Mother Character */}
                <circle cx="105" cy="30" r="14" fill="#FDBA74" />
                <rect x="90" y="44" width="30" height="50" rx="6" fill="#EC4899" />
                <text x="96" y="70" fill="#FFFFFF" fontSize="8" fontWeight="bold">MOM</text>

                {/* Child Character */}
                <circle cx="255" cy="42" r="11" fill="#FDBA74" />
                <rect x="244" y="53" width="22" height="40" rx="4" fill="#3B82F6" />
                <text x="249" y="73" fill="#FFFFFF" fontSize="7" fontWeight="bold">ME</text>

                {/* Wooden Stirring Spoon */}
                <line x1="120" y1="55" x2="165" y2="45" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            When I was a child, I{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            my mother cook dinner.
          </p>
        </div>

        <Bay label="Memory Narration Verb" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
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

/* ══════════════════════════════════════════════════════════════════════
   Q4 — Language Museum (Articles)
   Sentence: "______ German is ______ easy language to learn."
   Options: A. No article, an, B. A, an, C. The, an, D. The, the -> Key: A
   ══════════════════════════════════════════════════════════════════════ */
export function Q04LanguageMapActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ pair?: string }>({
    question,
    initial: { pair: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.pair) return { note: "Select the pair of articles" };
      const map: Record<string, string> = {
        "No article, an": "A",
        "A, an": "B",
        "The, an": "C",
        "The, the": "D",
      };
      return {
        value: w.pair,
        optionId: map[w.pair],
        note: w.pair === "No article, an" ? "Correct: Languages take zero article, 'easy' begins with vowel sound (an)" : `Selected: ${w.pair}`,
      };
    },
  });

  const pairs = ["No article, an", "A, an", "The, an", "The, the"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q4 · Language Museum"
      subtitle="Assemble the article tiles into both sentence slots"
      hints={["Names of languages (German) do not take articles. 'Easy language' is singular countable starting with a vowel sound, so it takes 'an'."]}
    >
      <Board>
        {/* Language Gallery Plaque */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border-2 border-teal-200/80 rounded-2xl p-5 flex flex-col items-center gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
            <Globe className="w-5 h-5 text-teal-700" />
            <span>World Linguistics Exhibition · European Language Plaque</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
            <div className="bg-white rounded-xl p-3 border border-slate-200 text-center shadow-2xs">
              <span className="text-xl block mb-1">🇩🇪</span>
              <span className="text-xs font-bold text-slate-800">German</span>
              <span className="text-[10px] text-slate-500 block">[Ø Zero Article]</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 text-center shadow-2xs">
              <span className="text-xl block mb-1">🇫🇷</span>
              <span className="text-xs font-bold text-slate-800">French</span>
              <span className="text-[10px] text-slate-500 block">[Ø Zero Article]</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 text-center shadow-2xs">
              <span className="text-xl block mb-1">🇪🇸</span>
              <span className="text-xs font-bold text-slate-800">Spanish</span>
              <span className="text-[10px] text-slate-500 block">[Ø Zero Article]</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 text-center shadow-2xs">
              <span className="text-xl block mb-1">🇮🇳</span>
              <span className="text-xs font-bold text-slate-800">Hindi</span>
              <span className="text-[10px] text-slate-500 block">[Ø Zero Article]</span>
            </div>
          </div>
        </div>

        {/* Live Sentence Display */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            <SentenceSlot
              value={play.world.pair ? (play.world.pair.startsWith("No article") ? "[Ø No article]" : play.world.pair.split(",")[0]) : undefined}
              placeholder="[Slot 1]"
              filled={!!play.world.pair}
            />{" "}
            German is{" "}
            <SentenceSlot
              value={play.world.pair ? play.world.pair.split(", ")[1] : undefined}
              placeholder="[Slot 2]"
              filled={!!play.world.pair}
            />{" "}
            easy language to learn.
          </p>
        </div>

        <Bay label="Article Pair Tiles" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pairs.map((p) => (
              <WordPill
                key={p}
                text={p}
                size="lg"
                tone="emerald"
                selected={play.world.pair === p}
                onClick={() => play.set({ pair: p })}
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
   Q5 — Bus Stop Time Machine (Stative Verb / Present Simple)
   Sentence: "I ______ waiting for the bus. It is always late and I get bored."
   Options: A. hated, B. hate, C. hates, D. hating -> Key: B (hate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q05BusStopTimeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the present emotion verb" };
      const map: Record<string, string> = { hated: "A", hate: "B", hates: "C", hating: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "hate" ? "Correct Present Simple: 'I hate waiting'" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["hated", "hate", "hates", "hating"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q5 · Bus Stop Time Loop"
      subtitle="Connect the narrator's recurring thought with the correct present tense verb"
      hints={["'It is always late' indicates a general present condition. With subject 'I', use base form 'hate'."]}
    >
      <Board>
        {/* Bus Stop Station Graphics */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-300 bg-gradient-to-b from-slate-900 to-indigo-950 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold">
              <Bus className="w-4 h-4" /> City Transit Stop #42 · Route 108
            </span>
            <span className="font-mono text-xs text-red-400 font-bold animate-pulse">
              ● DELAYED (+35 MIN)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            {/* Passenger Waiting Illustration */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-700/80 border border-purple-500 flex items-center justify-center text-2xl shadow-inner">
                🙍
              </div>
              <div>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Commuter Thought Bubble</span>
                <p className="text-xs sm:text-sm text-slate-200 italic mt-0.5">
                  "It is always late and I get bored waiting every single afternoon..."
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-300">
              Condition: General Present State
            </div>
          </div>
        </div>

        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#182338] leading-relaxed">
            I <SentenceSlot value={play.world.verb} filled={!!play.world.verb} /> waiting for the bus. It is always late and I get bored.
          </p>
        </div>

        <Bay label="Emotion Verb Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                text={v}
                size="lg"
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

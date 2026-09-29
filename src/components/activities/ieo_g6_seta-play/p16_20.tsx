"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Lightbulb,
  Zap,
  Target,
  BookOpen,
  Landmark,
  Cpu,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  LibraryDesk3D,
  LexicalVault3D,
  GiftUnboxing3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — 💡 3D Power-Cut Scene
   Sentence: "Before the electricity went out, she ______ me a lamp with my homework."
   Options: A. gives, B. has given, C. was giving, D. is giving -> Key: C (was giving)
   ══════════════════════════════════════════════════════════════════════ */
export function Q16OldPlaygroundActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [lightsFlickered, setLightsFlickered] = useState(true);

  const play = usePlay<{ selectedAspect?: string; powerState: string }>({
    question,
    initial: { selectedAspect: undefined, powerState: "storm_cut" },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAspect) return { note: "Witness the interrupted past action and choose the past continuous form" };
      const map: Record<string, string> = {
        gives: "A",
        "has given": "B",
        "was giving": "C",
        "is giving": "D",
      };
      return {
        value: w.selectedAspect,
        optionId: map[w.selectedAspect],
        note:
          w.selectedAspect === "was giving"
            ? "Past Continuous for interrupted action: 'was giving me a lamp' was in progress when the electricity went out."
            : `Selected: ${w.selectedAspect}`,
      };
    },
  });

  const aspects = ["gives", "has given", "was giving", "is giving"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q16 · 💡 3D Power-Cut Scene"
      subtitle="Examine the action in progress before the electrical power failure"
      hints={[
        "An action in progress in the past before another completed event ('went out') requires Past Continuous ('was giving').",
      ]}
    >
      <Board>
        {/* 3D Stormy Study Room */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-xs">
                <Lightbulb className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
                  Study Desk · Stormy Evening
                </span>
                <span className="text-[11px] font-medium text-amber-400">
                  Status: Handing Over Desk Lamp during Outage
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-900/80 border border-amber-700 text-amber-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Power Cut Event
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LibraryDesk3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0]} pose="gesturing" shirtColor="#F59E0B" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-amber-950/80 border-2 border-amber-700 text-amber-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            Before the electricity went out, she{" "}
            <SentenceSlot value={play.world.selectedAspect} filled={!!play.world.selectedAspect} />{" "}
            me a lamp with my homework.
          </p>
        </div>

        {/* Aspect Bay */}
        <Bay label="Past Continuous Aspect Bay" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {aspects.map((a) => (
              <WordPill
                key={a}
                word={a}
                selected={play.world.selectedAspect === a}
                onClick={() => play.patch({ selectedAspect: a })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — 🧗 3D Challenge Board
   Sentence: "I always jump ______ with both feet on tasks that I enjoy."
   Options: A. on, B. in, C. up, D. at -> Key: B (in)
   ══════════════════════════════════════════════════════════════════════ */
export function Q17BeachMemoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedPreposition?: string; taskJumped: boolean }>({
    question,
    initial: { selectedPreposition: undefined, taskJumped: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedPreposition) return { note: "Accept the enjoyable project and complete the enthusiastic idiom" };
      const map: Record<string, string> = { on: "A", in: "B", up: "C", at: "D" };
      return {
        value: w.selectedPreposition,
        optionId: map[w.selectedPreposition],
        note:
          w.selectedPreposition === "in"
            ? "Idiomatic expression: 'jump in with both feet' means to engage enthusiastically and wholeheartedly."
            : `Selected: ${w.selectedPreposition}`,
      };
    },
  });

  const prepositions = ["on", "in", "up", "at"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q17 · 🧗 3D Challenge Board"
      subtitle="Jump enthusiastically into an enjoyable challenge and complete the idiom"
      hints={[
        "The complete English idiom for enthusiastically starting an activity is 'jump IN with both feet'.",
      ]}
    >
      <Board>
        {/* 3D Adventure Challenge */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Target className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Adventure Challenge Arena
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Target Task: Build Robotics Model · Commitment: Full & Enthusiastic
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <GiftUnboxing3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#059669" hairStyle="cap" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I always jump{" "}
            <SentenceSlot value={play.world.selectedPreposition} filled={!!play.world.selectedPreposition} />{" "}
            with both feet on tasks that I enjoy.
          </p>
        </div>

        {/* Preposition Bay */}
        <Bay label="Idiomatic Phrasal Preposition Bay" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {prepositions.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedPreposition === p}
                onClick={() => play.patch({ selectedPreposition: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — 📚 3D Study Recovery Game
   Sentence: "I have to study all weekend, so I can catch up ______ the work I missed last week."
   Options: A. to, B. on, C. at, D. around -> Key: B (on)
   ══════════════════════════════════════════════════════════════════════ */
export function Q18BotanicalHerbariumActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedPreposition?: string; workSorted: boolean }>({
    question,
    initial: { selectedPreposition: undefined, workSorted: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedPreposition) return { note: "Organize the missed assignments and complete the phrasal verb" };
      const map: Record<string, string> = { to: "A", on: "B", at: "C", around: "D" };
      return {
        value: w.selectedPreposition,
        optionId: map[w.selectedPreposition],
        note:
          w.selectedPreposition === "on"
            ? "Phrasal verb: 'catch up on [something]' means to do tasks that should have been done earlier."
            : `Selected: ${w.selectedPreposition}`,
      };
    },
  });

  const preps = ["to", "on", "at", "around"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q18 · 📚 3D Study Recovery Game"
      subtitle="Organize missed school assignments and complete the phrasal verb 'catch up on'"
      hints={[
        "The standard phrasal verb for recovering missed work or tasks is 'catch up ON'.",
      ]}
    >
      <Board>
        {/* 3D Library Desk */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-blue-200/80 bg-gradient-to-b from-blue-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-blue-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  School Library Study Station
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Missed Modules: History Ch 4, Math Set B, Science Lab Notes
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LibraryDesk3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="sitting_studying" shirtColor="#2563EB" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-blue-50/90 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I have to study all weekend, so I can catch up{" "}
            <SentenceSlot value={play.world.selectedPreposition} filled={!!play.world.selectedPreposition} />{" "}
            the work I missed last week.
          </p>
        </div>

        {/* Preposition Bay */}
        <Bay label="Phrasal Particle Bay" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {preps.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedPreposition === p}
                onClick={() => play.patch({ selectedPreposition: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — 🏛️ 3D Tradition Museum
   Sentence: "I agree that the ______ of some old traditions makes sense today."
   Options: A. hanging, B. brink, C. abolition, D. shower -> Key: C (abolition)
   ══════════════════════════════════════════════════════════════════════ */
export function Q19BenchDurationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedNoun?: string; traditionDiscontinued: boolean }>({
    question,
    initial: { selectedNoun: undefined, traditionDiscontinued: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedNoun) return { note: "Examine historical customs and select the formal noun for ending a practice" };
      const map: Record<string, string> = { hanging: "A", brink: "B", abolition: "C", shower: "D" };
      return {
        value: w.selectedNoun,
        optionId: map[w.selectedNoun],
        note:
          w.selectedNoun === "abolition"
            ? "Formal vocabulary: 'abolition' means the formal ending or cancellation of a system, practice, or outdated tradition."
            : `Selected: ${w.selectedNoun}`,
      };
    },
  });

  const nouns = ["hanging", "brink", "abolition", "shower"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q19 · 🏛️ 3D Tradition Museum"
      subtitle="Explore historical customs and install the formal noun meaning the ending of outdated traditions"
      hints={[
        "The formal noun for formally ending, repealing, or doing away with an old tradition or law is 'abolition'.",
      ]}
    >
      <Board>
        {/* 3D Museum Hall */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-stone-300/80 bg-gradient-to-b from-stone-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-stone-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-700 text-white shadow-xs">
                <Landmark className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Historical Customs Museum
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Topic: Discontinuation & Reform of Obsolete Customs
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LexicalVault3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#57534E" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-stone-50/90 border-2 border-stone-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I agree that the{" "}
            <SentenceSlot value={play.world.selectedNoun} filled={!!play.world.selectedNoun} />{" "}
            of some old traditions makes sense today.
          </p>
        </div>

        {/* Noun Bay */}
        <Bay label="Historical Noun Bay" tone="slate">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {nouns.map((n) => (
              <WordPill
                key={n}
                word={n}
                selected={play.world.selectedNoun === n}
                onClick={() => play.patch({ selectedNoun: n })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — 🤖 3D Invention Workshop
   Sentence: "It is really difficult to ______ and create something new."
   Options: A. innovate, B. nudge, C. simple, D. unable -> Key: A (innovate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q20LuckyGiftActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedVerb?: string; machineUpgraded: boolean }>({
    question,
    initial: { selectedVerb: undefined, machineUpgraded: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedVerb) return { note: "Synthesize the engineering breakthrough and choose the creative verb" };
      const map: Record<string, string> = { innovate: "A", nudge: "B", simple: "C", unable: "D" };
      return {
        value: w.selectedVerb,
        optionId: map[w.selectedVerb],
        note:
          w.selectedVerb === "innovate"
            ? "Vocabulary meaning: 'innovate' means to introduce new methods, ideas, or products."
            : `Selected: ${w.selectedVerb}`,
      };
    },
  });

  const verbs = ["innovate", "nudge", "simple", "unable"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q20 · 🤖 3D Invention Workshop"
      subtitle="Modify components in the inventor's lab and install the verb 'innovate'"
      hints={[
        "The infinitive verb paired with 'create something new' is 'innovate' (meaning to introduce novel ideas/methods).",
      ]}
    >
      <Board>
        {/* 3D Invention Workshop */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-teal-300/80 bg-gradient-to-b from-teal-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-teal-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Inventor&apos;s Prototype Bench
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Gears, Quantum Core & Microcontrollers Assembled
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <GiftUnboxing3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#0D9488" hairStyle="cap" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-teal-50/90 border-2 border-teal-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            It is really difficult to{" "}
            <SentenceSlot value={play.world.selectedVerb} filled={!!play.world.selectedVerb} />{" "}
            and create something new.
          </p>
        </div>

        {/* Verb Bay */}
        <Bay label="Infinitive Creative Verb Bay" tone="teal">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {verbs.map((v) => (
              <WordPill
                key={v}
                word={v}
                selected={play.world.selectedVerb === v}
                onClick={() => play.patch({ selectedVerb: v })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}
